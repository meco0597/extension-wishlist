'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Post } from '@/types/post';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PlatformSelect from './PlatformSelect';
import CategorySelect from './CategorySelect';

interface EditPostProps {
    postId: string;
}

export default function EditPost({ postId }: EditPostProps) {
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [platform, setPlatform] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const { toast } = useToast();
    const currentUser = auth.currentUser;

    // Replace Firestore calls with API calls
    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) return;
            try {
                const postDoc = await getDoc(doc(db, 'posts', postId));
                if (postDoc.exists()) {
                    const postData = { id: postDoc.id, ...postDoc.data() } as Post;
                    setPost(postData);
                    setTitle(postData.title);
                    setDescription(postData.description);
                    setPlatform(postData.platform);
                    setCategories(postData.categories || []);
                } else {
                    toast({
                        title: "Post not found",
                        description: "The requested post could not be found.",
                        variant: "destructive",
                    });
                    router.push('/posts');
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load post details.",
                    variant: "destructive",
                });
                router.push('/posts');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId, router, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!post || !currentUser) return;
        if (currentUser.uid !== post.userId) {
            toast({
                title: "Unauthorized",
                description: "You don't have permission to edit this post.",
                variant: "destructive",
            });
            return;
        }
        if (!title || !description || !platform) {
            toast({
                title: "Validation Error",
                description: "Please fill in all fields.",
                variant: "destructive",
            });
            return;
        }
        if (title.length > 200 || description.length > 1000) {
            toast({
                title: "Validation Error",
                description: "Exceeded character limit.",
                variant: "destructive",
            });
            return;
        }
        try {
            await updateDoc(doc(db, 'posts', postId), {
                title,
                description,
                platform,
                categories,
            });

            toast({
                title: "Success",
                description: "Post updated successfully.",
            });
            router.push(`/posts/${postId}`);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update post. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!post || (currentUser?.uid !== post.userId)) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Unauthorized</h1>
                    <p className="mt-2 text-gray-600">You don't have permission to edit this post.</p>
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/posts/${postId}`)}
                        className="mt-4"
                    >
                        Back to Post
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/posts/${postId}`)}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Post
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter title"
                        />
                        <p className="text-sm text-gray-500">{200 - title.length} characters left</p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                            className="min-h-[150px]"
                        />
                        <p className="text-sm text-gray-500">{1000 - description.length} characters left</p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="platform" className="text-sm font-medium text-gray-700">
                            Platform
                        </label>
                        <PlatformSelect value={platform} onValueChange={setPlatform} />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="categories" className="text-sm font-medium text-gray-700">
                            Categories
                        </label>
                        <CategorySelect selectedCategories={categories} onCategoriesChange={setCategories} />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push(`/posts/${postId}`)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}