// app/api/pecheur/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET({ params }: { params: { id: string } }) {
  try {
    const pecheur = await prisma.pecheur.findUnique({
      where: { id: params.id },
      include: {
        enquete: true,
        pratiquesPeche: true,
        equipementsPeche: true,
        embarcations: true,
        circuitsCommercial: true,
        activites: true,
      },
    });

    if (!pecheur) {
      return NextResponse.json({ error: 'Pecheur not found' }, { status: 404 });
    }

    return NextResponse.json(pecheur);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch pecheur' },
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

    const pecheurExists = await prisma.pecheur.findUnique({
      where: { id: params.id },
    });

    if (!pecheurExists) {
      return NextResponse.json({ error: 'Pecheur not found' }, { status: 404 });
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

      const existingPecheur = await prisma.pecheur.findUnique({
        where: { enqueteId: json.enqueteId },
      });

      if (existingPecheur && existingPecheur.id !== params.id) {
        return NextResponse.json(
          { error: 'Another pecheur already exists for this enquete' },
          { status: 400 }
        );
      }
    }

    const updatedPecheur = await prisma.pecheur.update({
      where: { id: params.id },
      data: json,
      include: {
        enquete: true,
      },
    });

    return NextResponse.json({
      message: 'Pecheur updated successfully',
      data: updatedPecheur,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update pecheur' },
      { status: 500 }
    );
  }
}

export async function DELETE({ params }: { params: { id: string } }) {
  try {
    const pecheur = await prisma.pecheur.findUnique({
      where: { id: params.id },
    });

    if (!pecheur) {
      return NextResponse.json({ error: 'Pecheur not found' }, { status: 404 });
    }

    await prisma.pecheur.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Pecheur deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete pecheur' },
      { status: 500 }
    );
  }
}
