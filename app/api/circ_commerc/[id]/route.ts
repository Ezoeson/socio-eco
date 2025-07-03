// app/api/circuit-commercial/[id]/route.ts

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface DestinationData {
  name: string;
  location: string;

  [key: string]: string | number | boolean | null | undefined;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const circuit = await prisma.circuitCommercialProduit.findUnique({
      where: { id },
      include: {
        destinations: true,
        pecheur: {
          include: {
            enquete: true,
          },
        },
      },
    });

    if (!circuit) {
      return NextResponse.json(
        { error: "Commercial circuit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(circuit);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch commercial circuit" },
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

    const { pecheurId, destinations, ...circuitData } = await request.json();

    const circuitExists = await prisma.circuitCommercialProduit.findUnique({
      where: { id: id },
    });

    if (!circuitExists) {
      return NextResponse.json(
        { error: "Commercial circuit not found" },
        { status: 404 }
      );
    }

    if (pecheurId) {
      const pecheurExists = await prisma.pecheur.findUnique({
        where: { id: pecheurId },
      });

      if (!pecheurExists) {
        return NextResponse.json(
          { error: "Pecheur not found" },
          { status: 404 }
        );
      }
    }

    const updatedCircuit = await prisma.$transaction(async (prisma) => {
      await prisma.circuitCommercialProduit.update({
        where: { id: id },
        data: circuitData,
      });

      // 2. Supprimer les anciennes destinations
      await prisma.destinationCommerciale.deleteMany({
        where: { circuitId: id },
      });

      // 3. Ajouter les nouvelles destinations
      if (destinations && destinations.length > 0) {
        await prisma.destinationCommerciale.createMany({
          data: destinations.map((dest: DestinationData) => ({
            ...dest,
            circuitId: id,
          })),
        });
      }

      return prisma.circuitCommercialProduit.findUnique({
        where: { id: id },
        include: { destinations: true },
      });
    });

    return NextResponse.json(updatedCircuit);
  } catch {
    return NextResponse.json(
      { error: "Failed to update commercial circuit" },
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
    const circuit = await prisma.circuitCommercialProduit.findUnique({
      where: { id: id },
    });

    if (!circuit) {
      return NextResponse.json(
        { error: "Commercial circuit not found" },
        { status: 404 }
      );
    }

    await prisma.circuitCommercialProduit.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: "Commercial circuit deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete commercial circuit" },
      { status: 500 }
    );
  }
}
