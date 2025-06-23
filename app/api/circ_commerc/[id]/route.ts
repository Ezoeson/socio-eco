// app/api/circuit-commercial/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const circuit = await prisma.circuitCommercialProduit.findUnique({
      where: { id },
      include: {
        pecheur: true,
        destinations: true,
      },
    });

    if (!circuit) {
      return NextResponse.json(
        { error: 'Commercial circuit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(circuit);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch commercial circuit' },
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

    const circuitExists = await prisma.circuitCommercialProduit.findUnique({
      where: { id: id },
    });

    if (!circuitExists) {
      return NextResponse.json(
        { error: 'Commercial circuit not found' },
        { status: 404 }
      );
    }

    if (json.pecheurId) {
      const pecheurExists = await prisma.pecheur.findUnique({
        where: { id: json.pecheurId },
      });

      if (!pecheurExists) {
        return NextResponse.json(
          { error: 'Pecheur not found' },
          { status: 404 }
        );
      }
    }

    // Handle destinations update
    if (json.destinations) {
      // First delete existing destinations
      await prisma.destinationCommerciale.deleteMany({
        where: { circuitId: id },
      });

      // Then create new ones
      await prisma.circuitCommercialProduit.update({
        where: { id: id },
        data: {
          destinations: {
            create: json.destinations,
          },
        },
      });
    }

    const updatedCircuit = await prisma.circuitCommercialProduit.update({
      where: { id: id },
      data: json,
      include: {
        pecheur: true,
        destinations: true,
      },
    });

    return NextResponse.json({
      message: 'Commercial circuit updated successfully',
      data: updatedCircuit,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update commercial circuit' },
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
    const circuit = await prisma.circuitCommercialProduit.findUnique({
      where: { id: id },
    });

    if (!circuit) {
      return NextResponse.json(
        { error: 'Commercial circuit not found' },
        { status: 404 }
      );
    }

    await prisma.circuitCommercialProduit.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: 'Commercial circuit deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete commercial circuit' },
      { status: 500 }
    );
  }
}
