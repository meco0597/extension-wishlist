import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { verifyAuth } from '../../auth';

export async function POST(req: NextRequest) {
    return verifyAuth(req, async () => {
        const { title, description, platform, categories, userId } = await req.json();

        if (!title || !description || !platform) {
            return NextResponse.json({ error: 'Validation Error: Missing fields' }, { status: 400 });
        }

        if (title.length > 200 || description.length > 1000) {
            return NextResponse.json({ error: 'Validation Error: Exceeded character limit' }, { status: 400 });
        }

        try {
            const newPost = {
                title,
                description,
                platform,
                categories,
                votes: 0,
                userId,
                createdAt: new Date().toISOString(),
            };
            await addDoc(collection(db, 'posts'), newPost);
            return NextResponse.json({ message: 'Post created successfully' }, { status: 201 });
        } catch (error) {
            return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
        }
    });
}