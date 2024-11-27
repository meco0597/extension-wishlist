import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { Post } from '@/types/post';
import { verifyAuth } from '../auth';

export async function GET(req: NextRequest) {
    return verifyAuth(req, async () => {
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page') || '1';
        const sortOrder = searchParams.get('sortOrder') || 'newest';
        const filterPlatform = searchParams.getAll('filterPlatform');
        const selectedCategories = searchParams.getAll('selectedCategories');

        const postsPerPage = 20;
        const pageNumber = parseInt(page, 10);
        const platformFilters = Array.isArray(filterPlatform) ? filterPlatform : [filterPlatform];
        const categoryFilters = Array.isArray(selectedCategories) ? selectedCategories : [selectedCategories];

        try {
            let postsQuery = query(
                collection(db, 'posts'),
                orderBy('createdAt', 'desc'),
                limit(postsPerPage)
            );

            if (platformFilters.length > 0 && platformFilters[0] !== '') {
                postsQuery = query(postsQuery, where('platform', 'in', platformFilters));
            }

            if (categoryFilters.length > 0 && categoryFilters[0] !== '') {
                postsQuery = query(postsQuery, where('categories', 'array-contains-any', categoryFilters));
            }

            if (pageNumber > 1) {
                const previousPageQuery = query(
                    collection(db, 'posts'),
                    orderBy('createdAt', 'desc'),
                    limit((pageNumber - 1) * postsPerPage)
                );

                const previousPageSnapshot = await getDocs(previousPageQuery);
                if (!previousPageSnapshot.empty) {
                    const lastVisible = previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
                    postsQuery = query(postsQuery, startAfter(lastVisible));
                } else {
                    console.log('No previous page documents found.');
                }
            }

            const querySnapshot = await getDocs(postsQuery);
            const posts: Post[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Post, 'id'>),
            }));

            return NextResponse.json({ posts }, { status: 200 });
        } catch (error) {
            console.error('Error fetching posts:', error);
            return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
        }
    });
}