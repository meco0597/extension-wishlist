'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { Post } from '@/types/post';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SourceSelect from '@/components/SourceSelect';
import TagSelect from '@/components/TagSelect';

export default function NewPost() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [source, setSource] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = auth.currentUser;

        if (!user) {
            toast({
                title: "Authentication required",
                description: "You need to be logged in to create a post.",
                variant: "destructive",
            });
            return;
        }

        if (!title || !description || !source) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        try {
            const newPost: Omit<Post, 'id'> = {
                title,
                description,
                source,
                tags,
                votes: 0,
                userId: user.uid,
                createdAt: new Date().toISOString(),
            };

            await addDoc(collection(db, 'posts'), newPost);
            toast({
                title: "Success",
                description: "Your post has been created.",
            });
            router.push('/posts');
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create post. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/posts')}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Posts
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
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
                        <label htmlFor="source" className="text-sm font-medium text-gray-700">
                            Source
                        </label>
                        <SourceSelect value={source} onValueChange={setSource} />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="tags" className="text-sm font-medium text-gray-700">
                            Tags
                        </label>
                        <TagSelect selectedTags={tags} onTagsChange={setTags} />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/posts')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Create Post</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}