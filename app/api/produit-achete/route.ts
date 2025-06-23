// app/api/produit-achete/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const produits = await prisma.produitAchete.findMany({
      include: {
        operateur: true,
      },
    });
    return NextResponse.json(produits);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch purchased products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // Validate operateur exists
    const operateurExists = await prisma.collecteur.findUnique({
      where: { id: json.operateurId },
    });

    if (!operateurExists) {
      return NextResponse.json(
        { error: 'Collecteur not found' },
        { status: 404 }
      );
    }

    // Check unique constraint (operateurId + typeProduit)
    if (json.typeProduit) {
      const existingProduit = await prisma.produitAchete.findFirst({
        where: {
          operateurId: json.operateurId,
          typeProduit: json.typeProduit,
        },
      });

      if (existingProduit) {
        return NextResponse.json(
          { error: 'Product of this type already exists for this collecteur' },
          { status: 400 }
        );
      }
    }

    const produit = await prisma.produitAchete.create({
      data: json,
      include: {
        operateur: true,
      },
    });

    return NextResponse.json({
      message: 'Purchased product created successfully',
      data: produit,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create purchased product' },
      { status: 500 }
    );
  }
}
