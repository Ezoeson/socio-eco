import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const commune = await prisma.commune.findUnique({
      where: { id: id },
      include: {
        district: true,
        fokontanys: true,
      },
    });

    if (!commune) {
      return NextResponse.json({ error: 'Commune not found' }, { status: 404 });
    }

    return NextResponse.json(commune);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch commune' },
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

    const communeExists = await prisma.commune.findUnique({
      where: { id: id },
    });

    if (!communeExists) {
      return NextResponse.json({ error: 'Commune not found' }, { status: 404 });
    }

    if (json.districtId) {
      const districtExists = await prisma.district.findUnique({
        where: { id: json.districtId },
      });

      if (!districtExists) {
        return NextResponse.json(
          { error: 'District not found' },
          { status: 404 }
        );
      }
    }

    if (json.nom) {
      const existingCommune = await prisma.commune.findFirst({
        where: {
          nom: json.nom,
          districtId: json.districtId || communeExists.districtId,
          NOT: {
            id: id,
          },
        },
      });

      if (existingCommune) {
        return NextResponse.json(
          { error: 'Commune with this name already exists in this district' },
          { status: 400 }
        );
      }
    }

    const updatedCommune = await prisma.commune.update({
      where: { id: id },
      data: json,
      include: {
        district: true,
        fokontanys: true,
      },
    });

    return NextResponse.json({
      message: 'Commune updated successfully',
      data: updatedCommune,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update commune' },
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
    const commune = await prisma.commune.findUnique({
      where: { id: id },
    });

    if (!commune) {
      return NextResponse.json({ error: 'Commune not found' }, { status: 404 });
    }

    await prisma.commune.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: 'Commune deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete commune' },
      { status: 500 }
    );
  }
}
