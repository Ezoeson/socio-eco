// app/api/destination-commerciale/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const destination = await prisma.destinationCommerciale.findUnique({
      where: { id: params.id },
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json();

    const destinationExists = await prisma.destinationCommerciale.findUnique({
      where: { id: params.id },
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
      where: { id: params.id },
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const destination = await prisma.destinationCommerciale.findUnique({
      where: { id: params.id },
    });

    if (!destination) {
      return NextResponse.json(
        { error: 'Commercial destination not found' },
        { status: 404 }
      );
    }

    await prisma.destinationCommerciale.delete({
      where: { id: params.id },
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
