import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { Post } from '@/types/post';

interface PostFormProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function PostForm({ isOpen, setIsOpen }: PostFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [source, setSource] = useState('');

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = auth.currentUser;

        if (!user) {
            alert('You need to be logged in to create a post.');
            return;
        }

        if (!title || !description || !source) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            const newPost: Omit<Post, 'id'> = {
                title,
                description,
                source, // Include source field
                votes: 0,
                userId: user.uid,
            };
            await addDoc(collection(db, 'posts'), newPost);
            setTitle('');
            setDescription('');
            setSource('');
            setIsOpen(false);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className={`fixed inset-0 ${isOpen ? '' : 'hidden'} flex items-center justify-center bg-gray-900 bg-opacity-50 z-50`}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h3 className="text-2xl font-bold mb-4">Create a New Post</h3>
                <form onSubmit={handleCreatePost} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input input-bordered w-full"
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="textarea textarea-bordered w-full"
                    ></textarea>
                    <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select Source</option>
                        <option value="Webflow">Webflow</option>
                        <option value="Shopify">Shopify</option>
                        <option value="Azure">Azure</option>
                    </select>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
