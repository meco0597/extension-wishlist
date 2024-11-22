import { Suspense } from 'react';
import PostDetail from '@/components/PostDetail';

export default async function Page({ params,
}: {
    params: Promise<{ postId: string }>
}) {
    const postId = (await params).postId
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PostDetail postId={postId} />
        </Suspense>
    );
}