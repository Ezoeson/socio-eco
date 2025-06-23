import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fokontany = await prisma.fokontany.findUnique({
      where: { id: id },
      include: {
        commune: true,
        secteurs: true,
      },
    });

    if (!fokontany) {
      return NextResponse.json(
        { error: 'Fokontany not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(fokontany);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch fokontany' },
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

    const fokontanyExists = await prisma.fokontany.findUnique({
      where: { id: id },
    });

    if (!fokontanyExists) {
      return NextResponse.json(
        { error: 'Fokontany not found' },
        { status: 404 }
      );
    }

    if (json.communeId) {
      const communeExists = await prisma.commune.findUnique({
        where: { id: json.communeId },
      });

      if (!communeExists) {
        return NextResponse.json(
          { error: 'Commune not found' },
          { status: 404 }
        );
      }
    }

    if (json.nom) {
      const existingFokontany = await prisma.fokontany.findFirst({
        where: {
          nom: json.nom,
          communeId: json.communeId || fokontanyExists.communeId,
          NOT: {
            id: id,
          },
        },
      });

      if (existingFokontany) {
        return NextResponse.json(
          { error: 'Fokontany with this name already exists in this commune' },
          { status: 400 }
        );
      }
    }

    const updatedFokontany = await prisma.fokontany.update({
      where: { id: id },
      data: json,
      include: {
        commune: true,
        secteurs: true,
      },
    });

    return NextResponse.json({
      message: 'Fokontany updated successfully',
      data: updatedFokontany,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update fokontany' },
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
    const fokontany = await prisma.fokontany.findUnique({
      where: { id: id },
    });

    if (!fokontany) {
      return NextResponse.json(
        { error: 'Fokontany not found' },
        { status: 404 }
      );
    }

    await prisma.fokontany.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: 'Fokontany deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete fokontany' },
      { status: 500 }
    );
  }
}
