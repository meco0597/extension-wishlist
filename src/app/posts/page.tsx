'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, where, query, orderBy, limit, getDocs } from 'firebase/firestore';
import FilterBar from '@/components/FilterBar';
import PostList from '@/components/PostList';
import PostForm from '@/components/PostForm';
import { Post } from '@/types/post';
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { fetchUserVotes } from '@/lib/voteUtils';

export default function Wishlist() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<'most' | 'least' | 'newest'>('newest');
    const [filterSource, setFilterSource] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const { toast } = useToast();
    const postsPerPage = 9;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsQuery = query(
                    collection(db, 'posts'),
                    orderBy('createdAt', 'desc'),
                    limit(50)
                );

                // Initial fetch
                const querySnapshot = await getDocs(postsQuery);
                const initialPosts: Post[] = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Post, 'id'>),
                }));
                setPosts(initialPosts);

                // Real-time updates
                const unsubscribe = onSnapshot(
                    postsQuery,
                    async (snapshot) => {
                        const user = auth.currentUser;
                        const updatedPosts = await Promise.all(
                            snapshot.docs.map(async (doc) => {
                                const postData = { id: doc.id, ...(doc.data() as Omit<Post, 'id'>) };
                                if (user) {
                                    postData.hasVoted = await fetchUserVotes(doc.id);
                                }
                                return postData;
                            })
                        );
                        setPosts(updatedPosts);
                        setLoading(false);
                    },
                    (error) => {
                        console.error('Error fetching posts:', error);
                        toast({
                            title: "Error",
                            description: "Failed to load posts. Please try again later.",
                            variant: "destructive",
                        });
                        setLoading(false);
                    }
                );
                return () => unsubscribe();
            } catch (error) {
                console.error('Error setting up posts listener:', error);
                toast({
                    title: "Error",
                    description: "Failed to initialize posts. Please refresh the page.",
                    variant: "destructive",
                });
                setLoading(false);
            }
        };
        fetchPosts();
    }, [toast]);

    const filteredPosts = posts.filter((post) =>
        filterSource === "All" || filterSource === "" ? true : post.source === filterSource
    );

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (sortOrder === 'most') {
            return b.votes - a.votes;
        } else if (sortOrder === 'least') {
            return a.votes - b.votes;
        } else if (sortOrder === 'newest') {
            return (b.createdAt > a.createdAt) ? 1 : -1;
        }
        return 0;
    });

    const paginatedPosts = sortedPosts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <Link href="/"><h1 className="text-3xl font-bold tracking-tight">Wishlist</h1></Link>
                        <Button onClick={() => setModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Post
                        </Button>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                <FilterBar
                    filterSource={filterSource}
                    setFilterSource={setFilterSource}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                />
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 bg-muted/50 rounded-lg">
                        <h2 className="text-xl font-semibold text-muted-foreground">No posts found</h2>
                        <p className="text-muted-foreground mt-2">Be the first to create a post!</p>
                        <Button
                            variant="outline"
                            onClick={() => setModalOpen(true)}
                            className="mt-4"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Post
                        </Button>
                    </div>
                ) : (
                    <PostList
                        posts={paginatedPosts}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPosts={filteredPosts.length}
                        postsPerPage={postsPerPage}
                    />
                )}
            </main>
            <PostForm
                isOpen={isModalOpen}
                setIsOpen={setModalOpen}
            />
            <Toaster />
        </div>
    );
}