// app/api/equipement-peche/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const equipement = await prisma.equipementPeche.findUnique({
      where: { id: params.id },
      include: {
        pecheur: true,
      },
    });

    if (!equipement) {
      return NextResponse.json(
        { error: 'Fishing equipment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(equipement);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch fishing equipment' },
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

    const equipementExists = await prisma.equipementPeche.findUnique({
      where: { id: params.id },
    });

    if (!equipementExists) {
      return NextResponse.json(
        { error: 'Fishing equipment not found' },
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

    const updatedEquipement = await prisma.equipementPeche.update({
      where: { id: params.id },
      data: json,
      include: {
        pecheur: true,
      },
    });

    return NextResponse.json({
      message: 'Fishing equipment updated successfully',
      data: updatedEquipement,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update fishing equipment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const equipement = await prisma.equipementPeche.findUnique({
      where: { id: params.id },
    });

    if (!equipement) {
      return NextResponse.json(
        { error: 'Fishing equipment not found' },
        { status: 404 }
      );
    }

    await prisma.equipementPeche.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Fishing equipment deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete fishing equipment' },
      { status: 500 }
    );
  }
}
