import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const enqueteur = await prisma.enqueteur.findUnique({
      where: { id: params.id },
      include: {
        enquetes: true,
      },
    });

    if (!enqueteur) {
      return NextResponse.json(
        { error: 'Enqueteur not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(enqueteur);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch enqueteur' },
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

    const enqueteurExists = await prisma.enqueteur.findUnique({
      where: { id: params.id },
    });

    if (!enqueteurExists) {
      return NextResponse.json(
        { error: 'Enqueteur not found' },
        { status: 404 }
      );
    }

    // Check for unique fields
    if (json.nom && json.nom !== enqueteurExists.nom) {
      const existingByNom = await prisma.enqueteur.findUnique({
        where: { nom: json.nom },
      });
      if (existingByNom) {
        return NextResponse.json(
          { error: 'Enqueteur with this name already exists' },
          { status: 400 }
        );
      }
    }

    if (json.code && json.code !== enqueteurExists.code) {
      const existingByCode = await prisma.enqueteur.findUnique({
        where: { code: json.code },
      });
      if (existingByCode) {
        return NextResponse.json(
          { error: 'Enqueteur with this code already exists' },
          { status: 400 }
        );
      }
    }

    if (json.email && json.email !== enqueteurExists.email) {
      const existingByEmail = await prisma.enqueteur.findUnique({
        where: { email: json.email },
      });
      if (existingByEmail) {
        return NextResponse.json(
          { error: 'Enqueteur with this email already exists' },
          { status: 400 }
        );
      }
    }

    const updatedEnqueteur = await prisma.enqueteur.update({
      where: { id: params.id },
      data: json,
      include: {
        enquetes: true,
      },
    });

    return NextResponse.json({
      message: 'Enqueteur updated successfully',
      data: updatedEnqueteur,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update enqueteur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const enqueteur = await prisma.enqueteur.findUnique({
      where: { id: params.id },
    });

    if (!enqueteur) {
      return NextResponse.json(
        { error: 'Enqueteur not found' },
        { status: 404 }
      );
    }

    await prisma.enqueteur.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Enqueteur deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete enqueteur' },
      { status: 500 }
    );
  }
}
