// app/api/produit-achete/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const produit = await prisma.produitAchete.findUnique({
      where: { id: params.id },
      include: {
        operateur: true,
      },
    });

    if (!produit) {
      return NextResponse.json(
        { error: 'Purchased product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(produit);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch purchased product' },
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

    const produitExists = await prisma.produitAchete.findUnique({
      where: { id: params.id },
    });

    if (!produitExists) {
      return NextResponse.json(
        { error: 'Purchased product not found' },
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

    // Check unique constraint if typeProduit is being updated
    if (json.typeProduit && json.typeProduit !== produitExists.typeProduit) {
      const existingProduit = await prisma.produitAchete.findFirst({
        where: {
          operateurId: json.operateurId || produitExists.operateurId,
          typeProduit: json.typeProduit,
          NOT: {
            id: params.id,
          },
        },
      });

      if (existingProduit) {
        return NextResponse.json(
          { error: 'Product of this type already exists for this collecteur' },
          { status: 400 }
        );
      }
    }

    const updatedProduit = await prisma.produitAchete.update({
      where: { id: params.id },
      data: json,
      include: {
        operateur: true,
      },
    });

    return NextResponse.json({
      message: 'Purchased product updated successfully',
      data: updatedProduit,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update purchased product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const produit = await prisma.produitAchete.findUnique({
      where: { id: params.id },
    });

    if (!produit) {
      return NextResponse.json(
        { error: 'Purchased product not found' },
        { status: 404 }
      );
    }

    await prisma.produitAchete.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Purchased product deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete purchased product' },
      { status: 500 }
    );
  }
}
