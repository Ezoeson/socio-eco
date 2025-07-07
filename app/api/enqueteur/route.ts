import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // On peut récupérer des paramètres de requête si besoin (ex: filtrage, pagination)
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search") || "";

    // Exemple de filtre simple sur le nom de l’enqueteur (à adapter selon besoin)
    const whereClause = searchTerm
      ? {
          nom: {
            contains: searchTerm,
            mode: "insensitive" as const,
          },
        }
      : {};

    // Récupération des enqueteurs avec inclusions imbriquées
    const enqueteurs = await prisma.enqueteur.findMany({
      where: whereClause,
      include: {
        enquetes: {
          include: {
            secteur: true,
            collecteur: {
              include: {
                produitsAchetes: true,
                methodesStockage: true,
              },
            },
            pecheur: true,
          },
        },
      },
      orderBy: {
        nom: "asc", // Tri alphabétique pour cohérence
      },
    });

    return NextResponse.json(enqueteurs);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch enqueteurs",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // Check for unique fields
    if (json.nom) {
      const existingByNom = await prisma.enqueteur.findUnique({
        where: { nom: json.nom },
      });
      if (existingByNom) {
        return NextResponse.json(
          { error: "Enqueteur with this name already exists" },
          { status: 400 }
        );
      }
    }

    if (json.code) {
      const existingByCode = await prisma.enqueteur.findUnique({
        where: { code: json.code },
      });
      if (existingByCode) {
        return NextResponse.json(
          { error: "Enqueteur with this code already exists" },
          { status: 400 }
        );
      }
    }

    if (json.email) {
      const existingByEmail = await prisma.enqueteur.findUnique({
        where: { email: json.email },
      });
      if (existingByEmail) {
        return NextResponse.json(
          { error: "Enqueteur with this email already exists" },
          { status: 400 }
        );
      }
    }

    const enqueteur = await prisma.enqueteur.create({
      data: json,
    });

    return NextResponse.json({
      message: "Enqueteur created successfully",
      data: enqueteur,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create enqueteur" },
      { status: 500 }
    );
  }
}
