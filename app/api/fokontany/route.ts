/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/fokontany/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const fokontanys = await prisma.fokontany.findMany({
      include: {
        commune: true,
        secteurs: true,
      },
    });
    return NextResponse.json(fokontanys);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch fokontanys' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    const communeExists = await prisma.commune.findUnique({
      where: { id: json.communeId },
    });

    if (!communeExists) {
      return NextResponse.json({ error: 'Commune not found' }, { status: 404 });
    }

    const existingFokontany = await prisma.fokontany.findFirst({
      where: {
        nom: json.nom,
        communeId: json.communeId,
      },
    });

    if (existingFokontany) {
      return NextResponse.json(
        { error: 'Fokontany with this name already exists in this commune' },
        { status: 400 }
      );
    }

    const fokontany = await prisma.fokontany.create({
      data: json,
      include: {
        commune: true,
      },
    });

    return NextResponse.json({
      message: 'Fokontany created successfully',
      data: fokontany,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create fokontany' },
      { status: 500 }
    );
  }
}
