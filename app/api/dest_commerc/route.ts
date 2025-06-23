// app/api/destination-commerciale/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const destinations = await prisma.destinationCommerciale.findMany({
      include: {
        circuit: true,
      },
    });
    return NextResponse.json(destinations);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch commercial destinations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // Validate circuit exists
    const circuitExists = await prisma.circuitCommercialProduit.findUnique({
      where: { id: json.circuitId },
    });

    if (!circuitExists) {
      return NextResponse.json(
        { error: 'Commercial circuit not found' },
        { status: 404 }
      );
    }

    const destination = await prisma.destinationCommerciale.create({
      data: json,
      include: {
        circuit: true,
      },
    });

    return NextResponse.json({
      message: 'Commercial destination created successfully',
      data: destination,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create commercial destination' },
      { status: 500 }
    );
  }
}
