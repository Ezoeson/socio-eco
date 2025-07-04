import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collecteur = await prisma.collecteur.findUnique({
      where: { id: id },
      include: {
        enquete: true,
        produitsAchetes: true,
        methodesStockage: true,
        canauxDistribution: true,
        activites: true,
      },
    });

    if (!collecteur) {
      return NextResponse.json(
        { error: 'Collecteur not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(collecteur);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch collecteur' },
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

    const collecteurExists = await prisma.collecteur.findUnique({
      where: { id: id },
    });

    if (!collecteurExists) {
      return NextResponse.json(
        { error: 'Collecteur not found' },
        { status: 404 }
      );
    }

    if (json.enqueteId) {
      const enqueteExists = await prisma.enquete.findUnique({
        where: { id: json.enqueteId },
      });

      if (!enqueteExists) {
        return NextResponse.json(
          { error: 'Enquete not found' },
          { status: 404 }
        );
      }

      const existingCollecteur = await prisma.collecteur.findUnique({
        where: { enqueteId: json.enqueteId },
      });

      if (existingCollecteur && existingCollecteur.id !== id) {
        return NextResponse.json(
          { error: 'Another collecteur already exists for this enquete' },
          { status: 400 }
        );
      }
    }

    const updatedCollecteur = await prisma.collecteur.update({
      where: { id: id },
      data: json,
      include: {
        enquete: true,
      },
    });

    return NextResponse.json({
      message: 'Collecteur updated successfully',
      data: updatedCollecteur,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update collecteur' },
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
    const collecteur = await prisma.collecteur.findUnique({
      where: { id },
    });

    if (!collecteur) {
      return NextResponse.json(
        { error: 'Collecteur not found' },
        { status: 404 }
      );
    }

    await prisma.collecteur.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: 'Collecteur deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete collecteur' },
      { status: 500 }
    );
  }
}
