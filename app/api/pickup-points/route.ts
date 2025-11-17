import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all pickup points
export async function GET(request: NextRequest) {
  try {
    const pickupPoints = await prisma.pickupPoint.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        type: true,
        hasParkingHub: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ success: true, data: pickupPoints });
  } catch (error) {
    console.error('Error fetching pickup points:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch pickup points' },
      { status: 500 }
    );
  }
}
