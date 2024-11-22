import { Suspense } from 'react';
import EditPostPage from '@/components/EditPost';

export default async function Page({ params,
}: {
    params: Promise<{ postId: string }>
}) {
    const postId = (await params).postId
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditPostPage postId={postId} />
        </Suspense>
    );
}