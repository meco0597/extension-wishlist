"use client";

import PostItem from './PostItem';
import { Button } from "@/components/ui/button";
import { Post } from '@/types/post';

interface PostListProps {
    posts: Post[];
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPosts: number;
    postsPerPage: number;
}

export default function PostList({
    posts,
    currentPage,
    setCurrentPage,
    totalPosts,
    postsPerPage,
}: PostListProps) {
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                {posts.map((post) => (
                    <PostItem key={post.id} post={post} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <Button
                            key={idx}
                            variant={currentPage === idx + 1 ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(idx + 1)}
                        >
                            {idx + 1}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}