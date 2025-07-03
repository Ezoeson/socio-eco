import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const secteurs = await prisma.secteur.findMany({
    include: {
      fokontany: {
        select: {
          id: true,
          nom: true,
        }, 
      },
      enquetes: {
        select: {
          id: true,
          nomPerscible: true,
          dateEnquete: true,
        },

      },
    },
  });
  return NextResponse.json(secteurs);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    const fokontanyExists = await prisma.fokontany.findUnique({
      where: { id: json.fokontanyId },
    });

    if (!fokontanyExists) {
      return NextResponse.json(
        { error: "Fokontany not found" },
        { status: 404 }
      );
    }

    const existingSecteur = await prisma.secteur.findFirst({
      where: {
        nom: json.nom,
        fokontanyId: json.fokontanyId,
      },
    });

    if (existingSecteur) {
      return NextResponse.json(
        { error: "Secteur with this name already exists in this fokontany" },
        { status: 400 }
      );
    }

    const secteur = await prisma.secteur.create({
      data: json,
      include: {
        fokontany: true,
      },
    });

    return NextResponse.json({
      message: "Secteur created successfully",
      data: secteur,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create secteur" },
      { status: 500 }
    );
  }
}
