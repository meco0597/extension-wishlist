'use client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return <>{user && children}</>;
}
