// app/api/embarcation-peche/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET({ params }: { params: { id: string } }) {
  try {
    const embarcation = await prisma.embarcationPeche.findUnique({
      where: { id: params.id },
      include: {
        pecheur: true,
      },
    });

    if (!embarcation) {
      return NextResponse.json(
        { error: 'Fishing boat not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(embarcation);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch fishing boat' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json();

    const embarcationExists = await prisma.embarcationPeche.findUnique({
      where: { id: params.id },
    });

    if (!embarcationExists) {
      return NextResponse.json(
        { error: 'Fishing boat not found' },
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

    const updatedEmbarcation = await prisma.embarcationPeche.update({
      where: { id: params.id },
      data: json,
      include: {
        pecheur: true,
      },
    });

    return NextResponse.json({
      message: 'Fishing boat updated successfully',
      data: updatedEmbarcation,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update fishing boat' },
      { status: 500 }
    );
  }
}

export async function DELETE({ params }: { params: { id: string } }) {
  try {
    const embarcation = await prisma.embarcationPeche.findUnique({
      where: { id: params.id },
    });

    if (!embarcation) {
      return NextResponse.json(
        { error: 'Fishing boat not found' },
        { status: 404 }
      );
    }

    await prisma.embarcationPeche.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Fishing boat deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete fishing boat' },
      { status: 500 }
    );
  }
}
