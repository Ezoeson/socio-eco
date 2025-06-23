/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/region/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET single region by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const region = await prisma.region.findUnique({
      where: { id: params.id },
    });

    if (!region) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }

    return NextResponse.json(region);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch region' },
      { status: 500 }
    );
  }
}

// PUT update region
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json();

    // Check if region exists
    const regionExists = await prisma.region.findUnique({
      where: { id: params.id },
    });

    if (!regionExists) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }

    const updatedRegion = await prisma.region.update({
      where: { id: params.id },
      data: json,
    });

    return NextResponse.json({
      message: 'Region updated successfully',
      data: updatedRegion,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update region' },
      { status: 500 }
    );
  }
}

// DELETE region
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if region exists
    const region = await prisma.region.findUnique({
      where: { id: params.id },
    });

    if (!region) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }

    // Delete the region (cascades to communes due to Prisma relation)
    await prisma.region.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Region deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete region' },
      { status: 500 }
    );
  }
}
