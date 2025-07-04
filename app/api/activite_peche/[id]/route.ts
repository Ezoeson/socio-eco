// app/api/pratique-peche/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pratique = await prisma.pratiquePeche.findUnique({
      where: { id: id },
      include: {
        pecheur: true,
      },
    });

    if (!pratique) {
      return NextResponse.json(
        { error: 'Fishing practice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(pratique);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch fishing practice' },
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

    const pratiqueExists = await prisma.pratiquePeche.findUnique({
      where: { id: id },
    });

    if (!pratiqueExists) {
      return NextResponse.json(
        { error: 'Fishing practice not found' },
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

    // Check unique constraint if especeCible is being updated
    if (json.especeCible && json.especeCible !== pratiqueExists.especeCible) {
      const existingPratique = await prisma.pratiquePeche.findFirst({
        where: {
          pecheurId: json.pecheurId || pratiqueExists.pecheurId,
          especeCible: json.especeCible,
          NOT: {
            id: id,
          },
        },
      });

      if (existingPratique) {
        return NextResponse.json(
          {
            error:
              'Fishing practice for this species already exists for this pecheur',
          },
          { status: 400 }
        );
      }
    }

    const updatedPratique = await prisma.pratiquePeche.update({
      where: { id:id },
      data: json,
      include: {
        pecheur: true,
      },
    });

    return NextResponse.json({
      message: 'Fishing practice updated successfully',
      data: updatedPratique,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update fishing practice' },
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
    const pratique = await prisma.pratiquePeche.findUnique({
      where: { id: id },
    });

    if (!pratique) {
      return NextResponse.json(
        { error: 'Fishing practice not found' },
        { status: 404 }
      );
    }

    await prisma.pratiquePeche.delete({
      where: { id:id },
    });

    return NextResponse.json({
      message: 'Fishing practice deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete fishing practice' },
      { status: 500 }
    );
  }
}
