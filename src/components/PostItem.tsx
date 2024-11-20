import { TrashIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { auth, db } from '../lib/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, increment, query, updateDoc, where } from 'firebase/firestore';
import { Post } from '@/types/post';
import { useState } from 'react';

interface PostItemProps {
    post: Post;
}

export default function PostItem({ post }: PostItemProps) {
    const [hasVoted, setHasVoted] = useState<boolean>(post.hasVoted ? false : true);

    const handleVoteToggle = async (postId: string) => {
        const user = auth.currentUser;
        if (!user) {
            alert('You need to be logged in to vote.');
            return;
        }

        const userId = user.uid;
        const voteRef = collection(db, `posts/${postId}/votes`);
        const userVoteQuery = query(voteRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(userVoteQuery);

        try {
            if (!querySnapshot.empty) {
                const voteDoc = querySnapshot.docs[0];
                await deleteDoc(doc(db, `posts/${postId}/votes`, voteDoc.id));
                const postRef = doc(db, 'posts', postId);
                await updateDoc(postRef, { votes: increment(-1) });
                setHasVoted(false);
            } else {
                await addDoc(voteRef, { userId, timestamp: new Date() });
                const postRef = doc(db, 'posts', postId);
                await updateDoc(postRef, { votes: increment(1) });
                setHasVoted(true);
            }
        } catch (error) {
            console.error('Error toggling vote:', error);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            await deleteDoc(doc(db, 'posts', postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
            <p className="text-gray-600 mt-2">{post.description}</p>
            <div className="flex items-center justify-between mt-4">
                <span className="text-gray-500 text-sm">Source: {post.source}</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleVoteToggle(post.id)}
                        className={`btn btn-sm flex items-center gap-2 ${hasVoted ? 'btn-success' : 'btn-outline'
                            }`}
                    >
                        <ChevronUpIcon
                            className={`h-5 w-5 ${hasVoted ? 'text-green-500' : 'text-gray-500'
                                }`}
                        />
                        {hasVoted ? 'Unvote' : 'Upvote'}
                    </button>
                    <button
                        onClick={() => handleDeletePost(post.id)}
                        className="btn btn-error btn-sm flex items-center gap-2"
                    >
                        <TrashIcon className="h-5 w-5" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
