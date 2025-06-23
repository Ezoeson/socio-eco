import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET single region by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const region = await prisma.region.findUnique({
      where: { id: id },
    });

    if (!region) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }

    return NextResponse.json(region);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch region' },
      { status: 500 }
    );
  }
}

// PUT update region
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json();

    // Check if region exists
    const regionExists = await prisma.region.findUnique({
      where: { id: id },
    });

    if (!regionExists) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }

    const updatedRegion = await prisma.region.update({
      where: { id: id },
      data: json,
    });

    return NextResponse.json({
      message: 'Region updated successfully',
      data: updatedRegion,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update region' },
      { status: 500 }
    );
  }
}

// DELETE region
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if region exists
    const region = await prisma.region.findUnique({
      where: { id: id },
    });

    if (!region) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }

    // Delete the region (cascades to communes due to Prisma relation)
    await prisma.region.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: 'Region deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete region' },
      { status: 500 }
    );
  }
}
