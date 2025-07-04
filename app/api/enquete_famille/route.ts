import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
import { EnqueteFormData } from "@/type/localType";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const enquetes = await prisma.enquete.findMany({
      include: {
        enqueteur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
          },
        },
        secteur: true,
        pecheur: {
          include: {
            pratiquesPeche: true,
            embarcations: true,
            equipementsPeche: true,
            circuitsCommercial: true,
          },
        },
        membresFamille: true,
        collecteur: true,
        activites: true,
      },
    });
    return NextResponse.json(enquetes);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch enquetes" },
      { status: 500 }
    );
  }
}
// export async function POST(request: Request) {
//   const data: EnqueteData = await request.json();

//   if (!data.nomRepondant) {
//     return NextResponse.json(
//       { message: "Le nom du répondant est requis" },
//       { status: 400 }
//     );
//   }

//   // Validate enqueteurId if provided
//   if (data.enqueteurId) {
//     const enqueteurExists = await prisma.enqueteur.findUnique({
//       where: { id: data.enqueteurId },
//     });
//     if (!enqueteurExists) {
//       return NextResponse.json(
//         { message: "L'enquêteur spécifié n'existe pas" },
//         { status: 400 }
//       );
//     }
//   }

//   // Validate secteurId if provided
//   if (data.secteurId) {
//     const secteurExists = await prisma.secteur.findUnique({
//       where: { id: data.secteurId },
//     });
//     if (!secteurExists) {
//       return NextResponse.json(
//         { message: "Le secteur spécifié n'existe pas" },
//         { status: 400 }
//       );
//     }
//   }

//   const dateEnquete = data.dateEnquete
//     ? new Date(data.dateEnquete)
//     : new Date();
//   // You should define this array based on your logic

//   const newEnquete = await prisma.enquete.create({
//     data: {
//       nomPerscible: data.nomPerscible || "Enquête Famille",
//       nomRepondant: data.nomRepondant,
//       estPecheur: data.estPecheur,
//       estCollecteur: data.estCollecteur,
//       touteActivite: data.touteActivite,
//       ethnie: data.ethnie,
//       districtOrigine: data.districtOrigine,
//       anneeArriveeVillage: data.anneeArriveeVillage,
//       possessionAncienMetier: data.possessionAncienMetier,
//       ancienMetier: data.ancienMetier,
//       dateEnquete: dateEnquete,
//       enqueteurId: data.enqueteurId,
//       secteurId: data.secteurId,
//       membresFamille: {
//         create:
//           data.membresFamille?.map((membre) => ({
//             nom: membre.nom,
//             age: membre.age,
//             ancienLieuResidence: membre.ancienLieuResidence,
//             villageOrigine: membre.villageOrigine,
//             anneeArrivee: membre.anneeArrivee,
//             niveauEducation: membre.niveauEducation as
//               | NiveauEducation
//               | null
//               | undefined,
//             lienFamilial: membre.lienFamilial as
//               | import("@prisma/client").LienFamilial
//               | null
//               | undefined,
//             sexe: membre.sexe as
//               | import("@prisma/client").Sexe
//               | null
//               | undefined,
//             frequentationEcole: membre.frequentationEcole,
//           })) || [],
//       },
//       ...(data.estPecheur && { pecheur: { create: {} } }),
//     },
//     include: {
//       membresFamille: true,
//       pecheur: data.estPecheur,
//       collecteur: data.estCollecteur,
//       enqueteur: true,
//       secteur: true,
//     },
//   });

//   return NextResponse.json(
//     {
//       message: "Enquête créée avec succès",
//       data: newEnquete,
//     },
//     { status: 201 }
//   );
// }

// export async function POST(request: Request) {
//   const data: EnqueteData = await request.json();
//   console.log("Données brutes:", data);
//   console.log("Données formatées:", JSON.stringify(data, null, 2));
// }

export async function POST(request: Request) {
  const data: EnqueteFormData = await request.json();

  if (!data.nomRepondant) {
    return NextResponse.json(
      { message: "Le nom du répondant est requis" },
      { status: 400 }
    );
  }

  // Validate enqueteurId if provided
  if (data.enqueteurId) {
    const enqueteurExists = await prisma.enqueteur.findUnique({
      where: { id: data.enqueteurId },
    });
    if (!enqueteurExists) {
      return NextResponse.json(
        { message: "L'enquêteur spécifié n'existe pas" },
        { status: 400 }
      );
    }
  }

  // Validate secteurId if provided
  if (data.secteurId) {
    const secteurExists = await prisma.secteur.findUnique({
      where: { id: data.secteurId },
    });
    if (!secteurExists) {
      return NextResponse.json(
        { message: "Le secteur spécifié n'existe pas" },
        { status: 400 }
      );
    }
  }

  const dateEnquete = data.dateEnquete
    ? new Date(data.dateEnquete)
    : new Date();

  try {
    const newEnquete = await prisma.enquete.create({
      data: {
        nomPerscible: data.nomPerscible || "Enquête Famille",
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
              niveauEducation: membre.niveauEducation,
              lienFamilial: membre.lienFamilial,
              sexe: membre.sexe,
              frequentationEcole: membre.frequentationEcole,
            })) || [],
        },
        pecheur: data.estPecheur
          ? {
              create: {
                pratiquesPeche: data.Pecheur?.[0]?.PratiquePeche
                  ? {
                      create: data.Pecheur[0].PratiquePeche.map((pratique) => ({
                        anneeDebut: pratique.anneeDebut,
                        especeCible: pratique.especeCible,
                        dureeSaisonHaute: pratique.dureeSaisonHaute,
                        dureeSaisonBasse: pratique.dureeSaisonBasse,
                        frequenceSortiesSaisonHaute:
                          pratique.frequenceSortiesSaisonHaute,
                        frequenceSortiesSaisonBasse:
                          pratique.frequenceSortiesSaisonBasse,
                        capturesMoyennesSaisonHaute:
                          pratique.capturesMoyennesSaisonHaute,
                        capturesMoyennesSaisonBasse:
                          pratique.capturesMoyennesSaisonBasse,
                        classificationActivite: pratique.classificationActivite,
                      })),
                    }
                  : undefined,
                equipementsPeche: data.Pecheur?.[0]?.EquipementPeche
                  ? {
                      create: data.Pecheur[0].EquipementPeche.map(
                        (equipement) => ({
                          typeEquipement: equipement.typeEquipement,
                          quantite: equipement.quantite,
                          utilisationHebdomadaire:
                            equipement.utilisationHebdomadaire,
                          dureeUtilisation: equipement.dureeUtilisation,
                          rendementEstime: equipement.rendementEstime,
                        })
                      ),
                    }
                  : undefined,
                embarcations: data.Pecheur?.[0]?.EmbarcationPeche
                  ? {
                      create: data.Pecheur[0].EmbarcationPeche.map(
                        (embarcation) => ({
                          typeEmbarcation: embarcation.typeEmbarcation,
                          systemePropulsion: embarcation.systemePropulsion,
                          proprietaire: embarcation.proprietaire,
                          nombre: embarcation.nombre,
                          nombreEquipage: embarcation.nombreEquipage,
                          partageCaptures: embarcation.partageCaptures,
                          statutPropriete: embarcation.statutPropriete,
                          coutAcquisition: embarcation.coutAcquisition,
                          modeAcquisition: embarcation.modeAcquisition,
                          typeFinancement: embarcation.typeFinancement,
                          montantFinancement: embarcation.montantFinancement,
                          dureeFinancement: embarcation.dureeFinancement,
                          remboursementMensuel:
                            embarcation.remboursementMensuel,
                          longueur: embarcation.longueur,
                          capacitePassagers: embarcation.capacitePassagers,
                          ageMois: embarcation.ageMois,
                          dureeVieEstimee: embarcation.dureeVieEstimee,
                          materiauxConstruction:
                            embarcation.materiauxConstruction,
                          typeBois: embarcation.typeBois,
                        })
                      ),
                    }
                  : undefined,
                circuitsCommercial: data.Pecheur?.[0]?.CircuitCommercial
                  ? {
                      create: data.Pecheur[0].CircuitCommercial.map(
                        (circuit) => ({
                          typeProduit: circuit.typeProduit,
                          avanceFinanciere: circuit.avanceFinanciere,
                          montantAvance: circuit.montantAvance,
                          determinePrix: circuit.determinePrix,
                          prixUnitaire: circuit.prixUnitaire,
                          restrictionQuantite: circuit.restrictionQuantite,
                          quantiteLivree: circuit.quantiteLivree,
                          modePaiement: circuit.modePaiement,
                          periodeDemandeElevee: circuit.periodeDemandeElevee,
                          periodeDemandeFaible: circuit.periodeDemandeFaible,
                          modeLivraison: circuit.modeLivraison,
                          methodeDeconservation: circuit.methodeDeconservation,
                          dureeDeplacement: circuit.dureeDeplacement,
                          prixAvantCorona: circuit.prixAvantCorona,
                          prixPendantCorona: circuit.prixPendantCorona,
                          prixApresCorona: circuit.prixApresCorona,
                          destinations: {
                            create:
                              circuit.destinations?.map((destination) => ({
                                nom: destination.nom,
                                pourcentage: destination.pourcentage,
                              })) || [],
                          },
                        })
                      ),
                    }
                  : undefined,
              },
            }
          : undefined,
        activites: data.activites
          ? {
              create: data.activites.map((activite) => ({
                typeActivite: activite.typeActivite,
                importanceActivite: activite.importanceActivite,

                // Champs mangrove
                autreRessourceExploitee: activite.autreRessourceExploitee,
                utilisationRessource: activite.utilisationRessource,
                prixVente: activite.prixVente,
                frequenceCollecte: activite.frequenceCollecte,
                frequenceVente: activite.frequenceVente,
                saisonHaute: activite.saisonHaute,
                saisonBasse: activite.saisonBasse,

                // Champs agriculture
                activiteAgricole: activite.activiteAgricole,
                complementaritePeche: activite.complementaritePeche,
                frequenceActiviteAgricole: activite.frequenceActiviteAgricole,
                superficieCultivee: activite.superficieCultivee,
                quantiteProduite: activite.quantiteProduite,
                statutFoncier: activite.statutFoncier,
                lieuExploitationAgricole: activite.lieuExploitationAgricole,
                outilsProduction: activite.outilsProduction,

                // Champs élevage
                sousTypeElevage: activite.sousTypeElevage,
                effectifElevage: activite.effectifElevage,
                zonePaturage: activite.zonePaturage,
                frequenceSoins: activite.frequenceSoins,

                // Champs salariat
                activiteSalariale: activite.activiteSalariale,
                dureeConsacreeSalariat: activite.dureeConsacreeSalariat,
                frequenceMensuelleSalariat: activite.frequenceMensuelleSalariat,
                lieuExerciceSalariat: activite.lieuExerciceSalariat,
                revenuMensuelSalariat: activite.revenuMensuelSalariat,

                // Champs AGR
                activiteGeneratrice: activite.activiteGeneratrice,
                dureeActiviteAGR: activite.dureeActiviteAGR,
                frequenceMensuelleAGR: activite.frequenceMensuelleAGR,
                lieuExerciceAGR: activite.lieuExerciceAGR,
                revenuMensuelAGR: activite.revenuMensuelAGR,
              })),
            }
          : undefined,
      },

      include: {
        membresFamille: true,
        pecheur: {
          include: {
            pratiquesPeche: true,
            equipementsPeche: true,
            embarcations: true,
            circuitsCommercial: {
              include: {
                destinations: true,
              },
            },
          },
        },
        collecteur: true,
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
  } catch (error) {
    console.error("Erreur lors de la création de l'enquête:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création de l'enquête" },
      { status: 500 }
    );
  }
}
