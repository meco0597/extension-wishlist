import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    // if (req.nextUrl.pathname.startsWith('/api')) {
    //     const authHeader = req.headers.get('authorization');

    //     if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    //     }

    //     const token = authHeader.split('Bearer ')[1];

    //     try {
    //         const response = NextResponse.next();
    //         return response;
    //     } catch (error) {
    //         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    //     }
    // }
    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};