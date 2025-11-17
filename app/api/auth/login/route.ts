import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await login(body);

    if (result.success) {
      // Set HTTP-only cookie with the token
      const response = NextResponse.json(result, { status: 200 });

      if (result.data?.token) {
        response.cookies.set('auth-token', result.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });
      }

      return response;
    }

    return NextResponse.json(result, { status: 401 });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}