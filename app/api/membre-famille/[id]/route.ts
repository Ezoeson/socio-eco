// app/api/membre-famille/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET({ params }: { params: { id: string } }) {
  try {
    const membre = await prisma.membreFamille.findUnique({
      where: { id: params.id },
      include: {
        enquete: true,
      },
    });

    if (!membre) {
      return NextResponse.json(
        { error: 'Family member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(membre);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch family member' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json();

    const membreExists = await prisma.membreFamille.findUnique({
      where: { id: params.id },
    });

    if (!membreExists) {
      return NextResponse.json(
        { error: 'Family member not found' },
        { status: 404 }
      );
    }

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

    const updatedMembre = await prisma.membreFamille.update({
      where: { id: params.id },
      data: json,
      include: {
        enquete: true,
      },
    });

    return NextResponse.json({
      message: 'Family member updated successfully',
      data: updatedMembre,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update family member' },
      { status: 500 }
    );
  }
}

export async function DELETE({ params }: { params: { id: string } }) {
  try {
    const membre = await prisma.membreFamille.findUnique({
      where: { id: params.id },
    });

    if (!membre) {
      return NextResponse.json(
        { error: 'Family member not found' },
        { status: 404 }
      );
    }

    await prisma.membreFamille.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Family member deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete family member' },
      { status: 500 }
    );
  }
}
