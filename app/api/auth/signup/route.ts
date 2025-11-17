import { NextRequest, NextResponse } from 'next/server';
import { signUp } from '@/lib/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await signUp(body);

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    }

    return NextResponse.json(result, { status: 400 });
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}