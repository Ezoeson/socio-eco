// app/api/destination-commerciale/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const destination = await prisma.destinationCommerciale.findUnique({
      where: { id: id },
      include: {
        circuit: true,
      },
    });

    if (!destination) {
      return NextResponse.json(
        { error: 'Commercial destination not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(destination);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch commercial destination' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json();

    const destinationExists = await prisma.destinationCommerciale.findUnique({
      where: { id: id },
    });

    if (!destinationExists) {
      return NextResponse.json(
        { error: 'Commercial destination not found' },
        { status: 404 }
      );
    }

    if (json.circuitId) {
      const circuitExists = await prisma.circuitCommercialProduit.findUnique({
        where: { id: json.circuitId },
      });

      if (!circuitExists) {
        return NextResponse.json(
          { error: 'Commercial circuit not found' },
          { status: 404 }
        );
      }
    }

    const updatedDestination = await prisma.destinationCommerciale.update({
      where: { id: id },
      data: json,
      include: {
        circuit: true,
      },
    });

    return NextResponse.json({
      message: 'Commercial destination updated successfully',
      data: updatedDestination,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update commercial destination' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const destination = await prisma.destinationCommerciale.findUnique({
      where: { id: id },
    });

    if (!destination) {
      return NextResponse.json(
        { error: 'Commercial destination not found' },
        { status: 404 }
      );
    }

    await prisma.destinationCommerciale.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: 'Commercial destination deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete commercial destination' },
      { status: 500 }
    );
  }
}
