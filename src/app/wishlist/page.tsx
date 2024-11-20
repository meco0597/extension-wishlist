'use client';
import { useState, useEffect } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import FilterBar from '@/components/FilterBar';
import PostList from '@/components/PostList';
import PostForm from '@/components/PostForm';
import { Post } from '@/types/post';

export default function Wishlist() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<'most' | 'least'>('most');
    const [filterSource, setFilterSource] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);

    const postsPerPage = 10;

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
            const updatedPosts: Post[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Post, 'id'>), // Ensure Firestore data matches type
            }));
            setPosts(updatedPosts);
        });

        return () => unsubscribe();
    }, []);

    const filteredPosts = posts.filter((post) =>
        filterSource ? post.source === filterSource : true
    );

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        return sortOrder === 'most' ? b.votes - a.votes : a.votes - b.votes;
    });

    const paginatedPosts = sortedPosts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-indigo-600">Wishlist</h1>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="btn btn-primary"
                    >
                        Add Post
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-10">
                <FilterBar
                    filterSource={filterSource}
                    setFilterSource={setFilterSource}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                />
                <PostList
                    posts={paginatedPosts}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPosts={filteredPosts.length}
                    postsPerPage={postsPerPage}
                />
            </main>

            {isModalOpen && (
                <PostForm
                    isOpen={isModalOpen}
                    setIsOpen={setModalOpen}
                />
            )}
        </div>
    );
}
