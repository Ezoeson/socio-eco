import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Statistiques globales
    const totals = {
      enquetes: await prisma.enquete.count(),
      pecheurs: await prisma.enquete.count({ where: { estPecheur: true } }),
      collecteurs: await prisma.enquete.count({
        where: { estCollecteur: true },
      }),
      activites: await prisma.activiteEconomique.count(),
    };

    // 2. Répartition par région avec groupBy et include
    const regionsData = await prisma.region.findMany({
      select: {
        nom: true,
        districts: {
          select: {
            communes: {
              select: {
                fokontanys: {
                  select: {
                    secteurs: {
                      select: {
                        enquetes: {
                          select: {
                            estPecheur: true,
                            estCollecteur: true,
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

    // Traitement des données
    const regions = regionsData
      .map((region) => {
        let total = 0;
        let pecheurs = 0;
        let collecteurs = 0;

        region.districts.forEach((district) => {
          district.communes.forEach((commune) => {
            commune.fokontanys.forEach((fokontany) => {
              fokontany.secteurs.forEach((secteur) => {
                secteur.enquetes.forEach((enquete) => {
                  total++;
                  if (enquete.estPecheur) pecheurs++;
                  if (enquete.estCollecteur) collecteurs++;
                });
              });
            });
          });
        });

        return {
          nom: region.nom,
          total,
          pecheurs,
          collecteurs,
        };
      })
      .sort((a, b) => b.total - a.total);

    return NextResponse.json({
      totals: {
        enquetes: totals.enquetes,
        pecheurs: totals.pecheurs,
        collecteurs: totals.collecteurs,
        activites: totals.activites,
      },
      regions,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
