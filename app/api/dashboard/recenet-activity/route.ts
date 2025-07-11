import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const recentActivity = await prisma.enquete.findMany({
      take: 5,
      orderBy: { creationDate: "desc" },
      select: {
        nomRepondant: true,
        estPecheur: true,
        estCollecteur: true,
        creationDate: true,
        secteur: {
          select: {
            fokontany: {
              select: {
                commune: {
                  select: {
                    district: {
                      select: {
                        region: {
                          select: {
                            nom: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const formattedActivity = recentActivity.map((enquete) => ({
      nom: enquete.nomRepondant,
      type: enquete.estPecheur
        ? "Pêcheur"
        : enquete.estCollecteur
        ? "Collecteur"
        : "Autre",
      region:
        enquete.secteur?.fokontany?.commune?.district?.region?.nom ||
        "Inconnue",
      date: formatDateDifference(enquete.creationDate),
    }));

    return NextResponse.json(formattedActivity);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

function formatDateDifference(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Il y a quelques secondes";
  if (diffInSeconds < 3600)
    return `Il y a ${Math.floor(diffInSeconds / 60)} minutes`;
  if (diffInSeconds < 86400)
    return `Il y a ${Math.floor(diffInSeconds / 3600)} heures`;
  if (diffInSeconds < 2592000)
    return `Il y a ${Math.floor(diffInSeconds / 86400)} jours`;

  return `Il y a ${Math.floor(diffInSeconds / 2592000)} mois`;
}
