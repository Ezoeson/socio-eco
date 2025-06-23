// app/api/activite-economique/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const activite = await prisma.activiteEconomique.findUnique({
      where: { id: id },
      include: {
        enquete: true,
        pecheur: true,
        collecteur: true,
      },
    });

    if (!activite) {
      return NextResponse.json(
        { error: 'Economic activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(activite);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch economic activity' },
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

    const activiteExists = await prisma.activiteEconomique.findUnique({
      where: { id: id },
    });

    if (!activiteExists) {
      return NextResponse.json(
        { error: 'Economic activity not found' },
        { status: 404 }
      );
    }

    // Validate enquete exists if provided
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
    }

    // Validate pecheur exists if provided
    if (json.pecheur && json.pecheur.length > 0) {
      for (const pecheurId of json.pecheur) {
        const pecheurExists = await prisma.pecheur.findUnique({
          where: { id: pecheurId },
        });
        if (!pecheurExists) {
          return NextResponse.json(
            { error: `Pecheur with ID ${pecheurId} not found` },
            { status: 404 }
          );
        }
      }
    }

    // Validate collecteur exists if provided
    if (json.collecteur && json.collecteur.length > 0) {
      for (const collecteurId of json.collecteur) {
        const collecteurExists = await prisma.collecteur.findUnique({
          where: { id: collecteurId },
        });
        if (!collecteurExists) {
          return NextResponse.json(
            { error: `Collecteur with ID ${collecteurId} not found` },
            { status: 404 }
          );
        }
      }
    }

    const updatedActivite = await prisma.activiteEconomique.update({
      where: { id: id },
      data: {
        ...json,
        pecheur: json.pecheur
          ? { set: json.pecheur.map((id: string) => ({ id })) }
          : undefined,
        collecteur: json.collecteur
          ? { set: json.collecteur.map((id: string) => ({ id })) }
          : undefined,
      },
      include: {
        enquete: true,
        pecheur: true,
        collecteur: true,
      },
    });

    return NextResponse.json({
      message: 'Economic activity updated successfully',
      data: updatedActivite,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update economic activity' },
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
    const activite = await prisma.activiteEconomique.findUnique({
      where: { id: id },
    });

    if (!activite) {
      return NextResponse.json(
        { error: 'Economic activity not found' },
        { status: 404 }
      );
    }

    await prisma.activiteEconomique.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: 'Economic activity deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete economic activity' },
      { status: 500 }
    );
  }
}
