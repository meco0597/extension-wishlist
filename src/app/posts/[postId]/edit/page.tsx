import { Suspense } from 'react';
import EditPostPage from '@/components/EditPost';

interface PageProps {
    params: { postId: string };
}

export default function Page({ params }: PageProps) {
    <Suspense fallback={<div>Loading...</div>}>
        <EditPostPage postId={params.postId} />
    </Suspense>
}