// app/api/methode-stockage/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const methode = await prisma.methodeStockage.findUnique({
      where: { id: id },
      include: {
        operateur: true,
      },
    });

    if (!methode) {
      return NextResponse.json(
        { error: 'Storage method not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(methode);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch storage method' },
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

    const methodeExists = await prisma.methodeStockage.findUnique({
      where: { id: id },
    });

    if (!methodeExists) {
      return NextResponse.json(
        { error: 'Storage method not found' },
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

    const updatedMethode = await prisma.methodeStockage.update({
      where: { id: id },
      data: json,
      include: {
        operateur: true,
      },
    });

    return NextResponse.json({
      message: 'Storage method updated successfully',
      data: updatedMethode,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update storage method' },
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
    const methode = await prisma.methodeStockage.findUnique({
      where: { id: id },
    });

    if (!methode) {
      return NextResponse.json(
        { error: 'Storage method not found' },
        { status: 404 }
      );
    }

    await prisma.methodeStockage.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: 'Storage method deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete storage method' },
      { status: 500 }
    );
  }
}
