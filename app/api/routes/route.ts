import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all routes with pickup points
export async function GET(request: NextRequest) {
  try {
    const routes = await prisma.route.findMany({
      where: { isActive: true },
      include: {
        pickupPoints: {
          where: { isActive: true },
          include: {
            parkingSpaces: {
              where: { status: 'AVAILABLE' },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: routes });
  } catch (error) {
    console.error('Error fetching routes:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch routes' },
      { status: 500 }
    );
  }
}

// POST create new route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const route = await prisma.route.create({
      data: {
        name: body.name,
        code: body.code,
        startPoint: body.startPoint,
        endPoint: body.endPoint,
        distance: body.distance,
        estimatedTime: body.estimatedTime,
        stops: body.stops || [],
        basePrice: body.basePrice,
        pricePerKm: body.pricePerKm,
        surgeMultiplier: body.surgeMultiplier || 1.0,
      },
    });

    return NextResponse.json({ success: true, data: route }, { status: 201 });
  } catch (error) {
    console.error('Error creating route:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create route' },
      { status: 500 }
    );
  }
}