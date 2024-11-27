import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getDoc, doc, updateDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { Post } from '@/types/post';
import { verifyAuth } from '../../auth';

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
    return verifyAuth(req, async () => {
        const postId = params.postId;
        const userId = req.headers.get('user-id');

        console.log('Post ID for GET:', postId);
        console.log('User ID for GET:', userId);

        if (req.method !== 'GET') {
            return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
        }

        try {
            const postDoc = await getDoc(doc(db, 'posts', postId as string));
            if (!postDoc.exists()) {
                return NextResponse.json({ error: 'Post not found' }, { status: 404 });
            }
            const postData = { id: postDoc.id, ...postDoc.data() } as Post;

            const votesQuery = query(
                collection(db, 'votes'),
                where('postId', '==', postId),
                where('userId', '==', userId)
            );
            const votesSnapshot = await getDocs(votesQuery);

            postData.hasVoted = !votesSnapshot.empty;
            return NextResponse.json(postData, { status: 200 });
        } catch (error) {
            console.log('Error fetching post:', error);
            return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
        }
    });
}

export async function PUT(req: NextRequest, { params }: { params: { postId: string } }) {
    return verifyAuth(req, async () => {
        const postId = params.postId;
        const { title, description, platform, categories, userId } = await req.json();

        if (!title || !description || !platform) {
            return NextResponse.json({ error: 'Validation Error: Missing fields' }, { status: 400 });
        }

        if (title.length > 200 || description.length > 1000) {
            return NextResponse.json({ error: 'Validation Error: Exceeded character limit' }, { status: 400 });
        }

        try {
            await updateDoc(doc(db, 'posts', postId as string), {
                title,
                description,
                platform,
                categories,
            });
            return NextResponse.json({ message: 'Post updated successfully' }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
        }
    });
}