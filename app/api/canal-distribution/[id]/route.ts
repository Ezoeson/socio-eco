// app/api/canal-distribution/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const canal = await prisma.canalDistribution.findUnique({
      where: { id: params.id },
      include: {
        operateur: true,
      },
    });

    if (!canal) {
      return NextResponse.json(
        { error: 'Distribution channel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(canal);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch distribution channel' },
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

    const canalExists = await prisma.canalDistribution.findUnique({
      where: { id: params.id },
    });

    if (!canalExists) {
      return NextResponse.json(
        { error: 'Distribution channel not found' },
        { status: 404 }
      );
    }

    if (json.operateurId) {
      const operateurExists = await prisma.collecteur.findUnique({
        where: { id: json.operateurId },
      });

      if (!operateurExists) {
        return NextResponse.json(
          { error: 'Collecteur not found' },
          { status: 404 }
        );
      }
    }

    const updatedCanal = await prisma.canalDistribution.update({
      where: { id: params.id },
      data: json,
      include: {
        operateur: true,
      },
    });

    return NextResponse.json({
      message: 'Distribution channel updated successfully',
      data: updatedCanal,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update distribution channel' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const canal = await prisma.canalDistribution.findUnique({
      where: { id: params.id },
    });

    if (!canal) {
      return NextResponse.json(
        { error: 'Distribution channel not found' },
        { status: 404 }
      );
    }

    await prisma.canalDistribution.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Distribution channel deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete distribution channel' },
      { status: 500 }
    );
  }
}
