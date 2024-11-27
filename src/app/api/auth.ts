import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getApps, initializeApp, getApp, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';
import config from '@/config';

const adminConfig: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
};

// Initialize Firebase Admin
if (!getApps().length) {
    try {
        initializeApp({
            credential: admin.credential.cert(adminConfig)
        }, config.firebaseAppName);
    } catch (error) {
        console.error('Firebase initialization error:', error);
        throw error;
    }
}

// Add this type declaration
interface AuthenticatedRequest extends NextRequest {
    user: admin.auth.DecodedIdToken;
}

export async function verifyAuth(req: NextRequest, next: Function) {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await getAuth(getApp(config.firebaseAppName)).verifyIdToken(token);
        (req as AuthenticatedRequest).user = decodedToken;

        // Add user ID to the request headers
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('user-id', decodedToken.uid);

        // Create a new request with updated headers
        const newRequest = new Request(req.url, {
            headers: requestHeaders,
            method: req.method,
            body: req.body,
            redirect: req.redirect,
        });

        return next(newRequest);
    } catch (error) {
        console.log('Error verifying token:', error);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}