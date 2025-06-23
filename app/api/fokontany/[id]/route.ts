/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/fokontany/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const fokontany = await prisma.fokontany.findUnique({
      where: { id: params.id },
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
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch fokontany' },
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

    const fokontanyExists = await prisma.fokontany.findUnique({
      where: { id: params.id },
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
            id: params.id,
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
      where: { id: params.id },
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
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update fokontany' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const fokontany = await prisma.fokontany.findUnique({
      where: { id: params.id },
    });

    if (!fokontany) {
      return NextResponse.json(
        { error: 'Fokontany not found' },
        { status: 404 }
      );
    }

    await prisma.fokontany.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Fokontany deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete fokontany' },
      { status: 500 }
    );
  }
}
