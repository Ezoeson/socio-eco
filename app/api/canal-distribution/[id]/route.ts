// app/api/canal-distribution/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const canal = await prisma.canalDistribution.findUnique({
      where: { id: id },
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json();

    const canalExists = await prisma.canalDistribution.findUnique({
      where: { id: id },
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
      where: { id: id },
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const canal = await prisma.canalDistribution.findUnique({
      where: { id: id },
    });

    if (!canal) {
      return NextResponse.json(
        { error: 'Distribution channel not found' },
        { status: 404 }
      );
    }

    await prisma.canalDistribution.delete({
      where: { id: id },
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
