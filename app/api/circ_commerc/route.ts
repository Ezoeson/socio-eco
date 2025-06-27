// app/api/circuit-commercial/route.ts

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const circuits = await prisma.circuitCommercialProduit.findMany({
      include: {
        destinations: true,
        pecheur: {
          include: {
            enquete: true,
          },
        },
      },
    });
    return NextResponse.json(circuits);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch commercial circuits" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { pecheurId, destinations, ...circuitData } = await request.json();

    // Validate pecheur exists
    const pecheurExists = await prisma.pecheur.findUnique({
      where: { id: pecheurId },
    });

    if (!pecheurExists) {
      return NextResponse.json({ error: "Pecheur not found" }, { status: 404 });
    }

    const newCircuit = await prisma.$transaction(async (prisma) => {
      const circuit = await prisma.circuitCommercialProduit.create({
        data: {
          ...circuitData,
          pecheurId,
        },
      });

      if (destinations && destinations.length > 0) {
        await prisma.destinationCommerciale.createMany({
          data: destinations.map((dest: any) => ({
            ...dest,
            circuitId: circuit.id,
          })),
        });
      }

      return prisma.circuitCommercialProduit.findUnique({
        where: { id: circuit.id },
        include: { destinations: true },
      });
    });

    return NextResponse.json(newCircuit, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create commercial circuit" },
      { status: 500 }
    );
  }
}
