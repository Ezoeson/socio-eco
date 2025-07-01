import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Stats Pêcheurs vs Collecteurs
    const pecheursCollecteurs = await prisma.enquete.groupBy({
      by: ["estPecheur", "estCollecteur"],
      _count: { _all: true },
    });

    // 2. Top Équipements
    const equipements = await prisma.equipementPeche.groupBy({
      by: ["typeEquipement"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    // 3. Prix COVID
    const prixCovid = await prisma.circuitCommercialProduit.findMany({
      select: {
        typeProduit: true,
        prixAvantCorona: true,
        prixPendantCorona: true,
        prixApresCorona: true,
      },
      distinct: ["typeProduit"],
    });

    // 4. Acquisition Embarcations
    const embarcations = await prisma.embarcationPeche.groupBy({
      by: ["modeAcquisition"],
      _count: { id: true },
    });

    return NextResponse.json({
      pecheursCollecteurs: {
        pecheurs:
          pecheursCollecteurs.find((s) => s.estPecheur)?._count._all || 0,
        collecteurs:
          pecheursCollecteurs.find((s) => s.estCollecteur)?._count._all || 0,
      },
      topEquipements: equipements.map((e) => ({
        equipement: e.typeEquipement || "Non spécifié",
        count: e._count.id,
      })),
      prixCovid: prixCovid.map((p) => ({
        produit: p.typeProduit || "Non spécifié",
        avant: p.prixAvantCorona || 0,
        pendant: p.prixPendantCorona || 0,
        apres: p.prixApresCorona || 0,
      })),
      acquisitionEmbarcations: embarcations.map((e) => ({
        mode: e.modeAcquisition || "Non spécifié",
        count: e._count.id,
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
