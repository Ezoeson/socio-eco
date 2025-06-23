import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET({ params }: { params: { id: string } }) {
  try {
    const enquete = await prisma.enquete.findUnique({
      where: { id: params.id },
      include: {
        enqueteur: true,
        secteur: true,
        pecheur: true,
        collecteur: true,
        membresFamille: true,
        activites: true,
      },
    });

    if (!enquete) {
      return NextResponse.json({ error: 'Enquete not found' }, { status: 404 });
    }

    return NextResponse.json(enquete);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch enquete' },
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

    const enqueteExists = await prisma.enquete.findUnique({
      where: { id: params.id },
    });

    if (!enqueteExists) {
      return NextResponse.json({ error: 'Enquete not found' }, { status: 404 });
    }

    // Validate related entities if provided
    if (json.enqueteurId) {
      const enqueteurExists = await prisma.enqueteur.findUnique({
        where: { id: json.enqueteurId },
      });
      if (!enqueteurExists) {
        return NextResponse.json(
          { error: 'Enqueteur not found' },
          { status: 404 }
        );
      }
    }

    if (json.secteurId) {
      const secteurExists = await prisma.secteur.findUnique({
        where: { id: json.secteurId },
      });
      if (!secteurExists) {
        return NextResponse.json(
          { error: 'Secteur not found' },
          { status: 404 }
        );
      }
    }

    const updatedEnquete = await prisma.enquete.update({
      where: { id: params.id },
      data: json,
      include: {
        enqueteur: true,
        secteur: true,
        pecheur: true,
        collecteur: true,
        membresFamille: true,
        activites: true,
      },
    });

    return NextResponse.json({
      message: 'Enquete updated successfully',
      data: updatedEnquete,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update enquete' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const enquete = await prisma.enquete.findUnique({
      where: { id: params.id },
    });

    if (!enquete) {
      return NextResponse.json({ error: 'Enquete not found' }, { status: 404 });
    }

    await prisma.enquete.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Enquete deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete enquete' },
      { status: 500 }
    );
  }
}
