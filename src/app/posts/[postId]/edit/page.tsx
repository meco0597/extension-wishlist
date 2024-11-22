import { Suspense } from 'react';
import EditPostPage from '@/components/EditPost';

export default function Page({ params }: { params: { postId: string } }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditPostPage postId={params.postId} />
        </Suspense>
    );
}