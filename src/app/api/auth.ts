import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getApps, initializeApp, getApp, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';
import config from '@/config';

const adminConfig = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
} as ServiceAccount;

// Check if the app is already initialized
if (!getApps().length) {
    initializeApp({
        credential: admin.credential.cert(adminConfig)
    }, config.firebaseAppName);
}

export async function verifyAuth(req: NextRequest, next: Function) {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await getAuth(getApp(config.firebaseAppName)).verifyIdToken(token);
        (req as any).user = decodedToken;

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