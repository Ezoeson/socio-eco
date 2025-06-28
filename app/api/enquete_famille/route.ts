import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Utilisez l'instance partagée plutôt que new PrismaClient()
import { NiveauEducation } from "@prisma/client";

interface MembreFamille {
  nom: string;
  age?: number;
  ancienLieuResidence: string;
  villageOrigine: string;
  anneeArrivee: number;
  niveauEducation: string;
  lienFamilial: string;
  sexe?: string;
  frequentationEcole: boolean;
}

interface EnqueteData {
  nomEnquete: string;
  nomRepondant?: string;
  estPecheur: boolean;
  estCollecteur: boolean;
  touteActivite: boolean;
  ethnie?: string;
  districtOrigine?: string;
  anneeArriveeVillage?: number;
  possessionAncienMetier?: boolean;
  ancienMetier?: string;
  dateEnquete?: Date | string;
  enqueteurId?: string;
  secteurId?: string;
  membresFamille: MembreFamille[];
}

export async function POST(request: Request) {
  const data: EnqueteData = await request.json();

  // Validation requise
  if (!data.nomEnquete) {
    return NextResponse.json(
      { message: "Le nom de l'enquête est requis" },
      { status: 400 }
    );
  }

  // Conversion de la date si nécessaire
  const dateEnquete = data.dateEnquete
    ? new Date(data.dateEnquete)
    : new Date();

  // Création de l'enquête
  const newEnquete = await prisma.enquete.create({
    data: {
      nomEnquete: data.nomEnquete,
      nomRepondant: data.nomRepondant,
      estPecheur: data.estPecheur,
      estCollecteur: data.estCollecteur,
      touteActivite: data.touteActivite,
      ethnie: data.ethnie,
      districtOrigine: data.districtOrigine,
      anneeArriveeVillage: data.anneeArriveeVillage,
      possessionAncienMetier: data.possessionAncienMetier,
      ancienMetier: data.ancienMetier,
      dateEnquete: dateEnquete,
      enqueteurId: data.enqueteurId,
      secteurId: data.secteurId,
      membresFamille: {
        create:
          data.membresFamille?.map((membre) => ({
            nom: membre.nom,
            age: membre.age,
            ancienLieuResidence: membre.ancienLieuResidence,
            villageOrigine: membre.villageOrigine,
            anneeArrivee: membre.anneeArrivee,
            niveauEducation: membre.niveauEducation as NiveauEducation,

            lienFamilial: membre.lienFamilial,
            sexe: membre.sexe,
            frequentationEcole: membre.frequentationEcole,
          })) || [],
      },
      ...(data.estPecheur && { pecheur: { create: {} } }),
      ...(data.estCollecteur && { collecteur: { create: {} } }),
    },
    include: {
      membresFamille: true,
      pecheur: data.estPecheur,
      collecteur: data.estCollecteur,
      enqueteur: true,
      secteur: true,
    },
  });

  return NextResponse.json(
    {
      message: "Enquête créée avec succès",
      data: newEnquete,
    },
    { status: 201 }
  );
}

// export async function POST(request: Request) {
//   try {
//     const { membresFamille, estPecheur, estCollecteur, ...enqueteData } =
//       await request.json();

//     // Création de l'enquête avec les membres de famille
//     const newEnquete = await prisma.enquete.create({
//       data: {
//         ...enqueteData,
//         membresFamille: {
//           create: membresFamille.map((membre: MembreFamille) => ({
//             nom: membre.nom,
//             age: membre.age,
//             ancienLieuResidence: membre.ancienLieuResidence,
//             villageOrigine: membre.villageOrigine,
//             anneeArrivee: membre.anneeArrivee,
//             niveauEducation: membre.niveauEducation,
//             lienFamilial: membre.lienFamilial,
//             sexe: membre.sexe,
//             frequentationEcole: membre.frequentationEcole,
//           })),
//         },
//         // Gestion des relations conditionnelles
//         ...(estPecheur && { pecheur: { create: {} } }),
//         ...(estCollecteur && { collecteur: { create: {} } }),
//       },
//       include: {
//         membresFamille: true,
//         pecheur: true,
//         collecteur: true,
//       },
//     });

//     return NextResponse.json(
//       {
//         message: "Enquête créée avec succès",
//         data: newEnquete,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating enquete:", error);
//     return NextResponse.json(
//       {
//         message: "Erreur interne du serveur",
//         error: error instanceof Error ? error.message : "Erreur inconnue",
//       },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }
