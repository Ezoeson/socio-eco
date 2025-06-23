import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET single district by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const district = await prisma.district.findUnique({
      where: { id: id },
      include: {
        region: true,
        communes: true,
      },
    });

    if (!district) {
      return NextResponse.json(
        { error: 'District not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(district);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch district' },
      { status: 500 }
    );
  }
}

// PUT update district
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json();

    // Check if district exists
    const districtExists = await prisma.district.findUnique({
      where: { id: id },
    });

    if (!districtExists) {
      return NextResponse.json(
        { error: 'District not found' },
        { status: 404 }
      );
    }

    // If regionId is being updated, check if new region exists
    if (json.regionId) {
      const regionExists = await prisma.region.findUnique({
        where: { id: json.regionId },
      });

      if (!regionExists) {
        return NextResponse.json(
          { error: 'Region not found' },
          { status: 404 }
        );
      }
    }

    // Check for unique constraint if name is being updated
    if (json.nom) {
      const existingDistrict = await prisma.district.findFirst({
        where: {
          nom: json.nom,
          regionId: json.regionId || districtExists.regionId,
          NOT: {
            id: id,
          },
        },
      });

      if (existingDistrict) {
        return NextResponse.json(
          { error: 'District with this name already exists in this region' },
          { status: 400 }
        );
      }
    }

    const updatedDistrict = await prisma.district.update({
      where: { id: id },
      data: json,
      include: {
        region: true,
        communes: true,
      },
    });

    return NextResponse.json({
      message: 'District updated successfully',
      data: updatedDistrict,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update district' },
      { status: 500 }
    );
  }
}

// DELETE district
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
  
    const district = await prisma.district.findUnique({
      where: { id: id },
    });

    if (!district) {
      return NextResponse.json(
        { error: 'District not found' },
        { status: 404 }
      );
    }

    // Delete the district (cascades to communes due to Prisma relation)
    await prisma.district.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: 'District deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete district' },
      { status: 500 }
    );
  }
}
