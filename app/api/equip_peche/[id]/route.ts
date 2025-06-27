// app/api/equipement-peche/[id]/route.ts

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const equipement = await prisma.equipementPeche.findUnique({
      where: { id: id },
      include: {
        pecheur: true,
      },
    });

    if (!equipement) {
      return NextResponse.json(
        { error: "Fishing equipment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(equipement);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch fishing equipment" },
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

    const equipementExists = await prisma.equipementPeche.findUnique({
      where: { id: id },
    });

    if (!equipementExists) {
      return NextResponse.json(
        { error: "Fishing equipment not found" },
        { status: 404 }
      );
    }

    if (json.pecheurId) {
      const pecheurExists = await prisma.pecheur.findUnique({
        where: { id: json.pecheurId },
      });

      if (!pecheurExists) {
        return NextResponse.json(
          { error: "Pecheur not found" },
          { status: 404 }
        );
      }
    }

    const updatedEquipement = await prisma.equipementPeche.update({
      where: { id: id },
      data: json,
      include: {
        pecheur: true,
      },
    });

    return NextResponse.json({
      message: "Fishing equipment updated successfully",
      data: updatedEquipement,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update fishing equipment" },
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
    const equipement = await prisma.equipementPeche.findUnique({
      where: { id: id },
    });

    if (!equipement) {
      return NextResponse.json(
        { error: "Fishing equipment not found" },
        { status: 404 }
      );
    }

    await prisma.equipementPeche.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: "Fishing equipment deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete fishing equipment" },
      { status: 500 }
    );
  }
}
