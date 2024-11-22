import { Suspense } from 'react';
import PostDetail from '@/components/PostDetail';

export default function Page({ params }: { params: { postId: string } }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PostDetail postId={params.postId} />
        </Suspense>
    );
}