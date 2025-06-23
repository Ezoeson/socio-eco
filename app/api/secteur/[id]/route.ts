import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,

  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const secteur = await prisma.secteur.findUnique({
      where: { id: id },
      include: {
        fokontany: true,
        enquetes: true,
      },
    });

    if (!secteur) {
      return NextResponse.json({ error: 'Secteur not found' }, { status: 404 });
    }

    return NextResponse.json(secteur);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch secteur' },
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

    const secteurExists = await prisma.secteur.findUnique({
      where: { id: id },
    });

    if (!secteurExists) {
      return NextResponse.json({ error: 'Secteur not found' }, { status: 404 });
    }

    if (json.fokontanyId) {
      const fokontanyExists = await prisma.fokontany.findUnique({
        where: { id: json.fokontanyId },
      });

      if (!fokontanyExists) {
        return NextResponse.json(
          { error: 'Fokontany not found' },
          { status: 404 }
        );
      }
    }

    if (json.nom) {
      const existingSecteur = await prisma.secteur.findFirst({
        where: {
          nom: json.nom,
          fokontanyId: json.fokontanyId || secteurExists.fokontanyId,
          NOT: {
            id: id,
          },
        },
      });

      if (existingSecteur) {
        return NextResponse.json(
          { error: 'Secteur with this name already exists in this fokontany' },
          { status: 400 }
        );
      }
    }

    const updatedSecteur = await prisma.secteur.update({
      where: { id: id },
      data: json,
      include: {
        fokontany: true,
        enquetes: true,
      },
    });

    return NextResponse.json({
      message: 'Secteur updated successfully',
      data: updatedSecteur,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update secteur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const secteur = await prisma.secteur.findUnique({
      where: { id: id },
    });

    if (!secteur) {
      return NextResponse.json({ error: 'Secteur not found' }, { status: 404 });
    }

    await prisma.secteur.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: 'Secteur deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete secteur' },
      { status: 500 }
    );
  }
}
