// app/api/embarcation-peche/[id]/route.ts

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const embarcation = await prisma.embarcationPeche.findUnique({
      where: { id: id },
      include: {
        pecheur: true,
      },
    });

    if (!embarcation) {
      return NextResponse.json(
        { error: "Fishing boat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(embarcation);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch fishing boat" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const json = await request.json();

  const embarcationExists = await prisma.embarcationPeche.findUnique({
    where: { id: id },
  });

  if (!embarcationExists) {
    return NextResponse.json(
      { error: "Fishing boat not found" },
      { status: 404 }
    );
  }

  if (json.pecheurId) {
    const pecheurExists = await prisma.pecheur.findUnique({
      where: { id: json.pecheurId },
    });

    if (!pecheurExists) {
      return NextResponse.json({ error: "Pecheur not found" }, { status: 404 });
    }
  }

  const updatedEmbarcation = await prisma.embarcationPeche.update({
    where: { id: id },
    data: json,
  });

  return NextResponse.json({
    message: "Fishing boat updated successfully",
    data: updatedEmbarcation,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const embarcation = await prisma.embarcationPeche.findUnique({
      where: { id: id },
    });

    if (!embarcation) {
      return NextResponse.json(
        { error: "Fishing boat not found" },
        { status: 404 }
      );
    }

    await prisma.embarcationPeche.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: "Fishing boat deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete fishing boat" },
      { status: 500 }
    );
  }
}
