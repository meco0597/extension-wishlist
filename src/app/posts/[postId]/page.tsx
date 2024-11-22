import { Suspense } from 'react';
import PostDetail from '@/components/PostDetail';

interface PageProps {
    params: { postId: string };
}

export default function Page({ params }: PageProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PostDetail postId={params.postId} />
        </Suspense>
    );
}