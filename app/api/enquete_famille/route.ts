import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
import { EnqueteFormData } from "@/type/localType";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Common parameters
    const searchTerm = searchParams.get("search") || "";
    const hasPagination = searchParams.has("page");
    const page = Number(searchParams.get("page")) || 1;
    const perPage = 10;
    const skip = (page - 1) * perPage;

    // Date filters (from first example)
    const dateDebut = searchParams.get("dateDebut");
    const dateFin = searchParams.get("dateFin");

    // Build where clause
    const whereClause: any = {};

    // Search term filter (combined from both examples)
    if (searchTerm) {
      whereClause.OR = [
        // from district example
        { nomPerscible: { contains: searchTerm, mode: "insensitive" } }, // from enquete example
        { nomRepondant: { contains: searchTerm, mode: "insensitive" } }, // from enquete example
        {
          enqueteur: {
            // from enquete example
            OR: [
              { nom: { contains: searchTerm, mode: "insensitive" } },
              { prenom: { contains: searchTerm, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    // Date filter (from enquete example)
    if (dateDebut || dateFin) {
      whereClause.dateEnquete = {};
      if (dateDebut) whereClause.dateEnquete.gte = new Date(dateDebut);
      if (dateFin) whereClause.dateEnquete.lte = new Date(dateFin);
    }

    if (hasPagination) {
      const [enquetes, totalEnquetes] = await Promise.all([
        prisma.enquete.findMany({
          where: whereClause,
          skip,
          take: perPage,
          include: {
            enqueteur: {
              select: {
                id: true,
                nom: true,
                prenom: true,
              },
            },
            secteur: {
              select: {
                id: true,
                nom: true,
              },
            },
            membresFamille: true,
          },
          orderBy: {
            dateEnquete: "desc",
          },
        }),
        prisma.enquete.count({ where: whereClause }),
      ]);

      return NextResponse.json({
        data: enquetes,
        total: totalEnquetes,
        page,
        totalPages: Math.ceil(totalEnquetes / perPage),
      });
    } else {
      // Case without pagination
      const enquetes = await prisma.enquete.findMany({
        where: whereClause,
        include: {
          enqueteur: {
            select: {
              id: true,
              nom: true,
              prenom: true,
            },
          },
          secteur: {
            select: {
              id: true,
              nom: true,
            },
          },
          membresFamille: true,
          pecheur: true,
          collecteur: true,
        },
        orderBy: {
          dateEnquete: "desc",
        },
      });

      return NextResponse.json({
        data: enquetes,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch data",
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
  const data: EnqueteFormData = await request.json();

  if (!data.nomRepondant) {
    return NextResponse.json(
      { message: "Le nom du répondant est requis" },
      { status: 400 }
    );
  }

  // Validations existantes...
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
        // Champs existants de l'enquête...
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

        // Ajout du collecteur avec les nouvelles relations
        collecteur: data.estCollecteur
          ? {
              create: {
                // Circuit de commercialisation
                anneeDemarrageActivite:
                  data.collecteur?.[0]?.anneeDemarrageActivite,
                lieuCollecte: data.collecteur?.[0]?.lieuCollecte || [],
                dureeCollecteHebdo: data.collecteur?.[0]?.dureeCollecteHebdo,
                frequencePassage: data.collecteur?.[0]?.frequencePassage,
                effectifPersonnel: data.collecteur?.[0]?.effectifPersonnel,

                // Capitaux
                capitalTotal: data.collecteur?.[0]?.capitalTotal,
                partCapitalPropre: data.collecteur?.[0]?.partCapitalPropre,
                partCapitalEmprunte: data.collecteur?.[0]?.partCapitalEmprunte,
                investissementEquipement:
                  data.collecteur?.[0]?.investissementEquipement,
                investissementLocation:
                  data.collecteur?.[0]?.investissementLocation,
                coutRessourcesHumaines:
                  data.collecteur?.[0]?.coutRessourcesHumaines,

                // Autres caractéristiques
                estMareyeur: data.collecteur?.[0]?.estMareyeur,
                estStockage: data.collecteur?.[0]?.estStockage,
                estContrat: data.collecteur?.[0]?.estContrat,

                // Relations
                produitsAchetes: data.collecteur?.[0]?.produitsAchetes
                  ? {
                      create: data.collecteur[0].produitsAchetes.map(
                        (produit) => ({
                          typeProduit: produit.typeProduit,
                          volumeHebdomadaireKg: produit.volumeHebdomadaireKg,
                          criteresQualite: produit.criteresQualite,
                          systemeAvance: produit.systemeAvance,
                          montantAvance: produit.montantAvance,
                          possedeCarteProfession:
                            produit.possedeCarteProfession,
                          varietes: produit.varietes || [],
                        })
                      ),
                    }
                  : undefined,

                stockages: data.collecteur?.[0]?.stockages
                  ? {
                      create: data.collecteur[0].stockages.map((stockage) => ({
                        typeProduit: stockage.typeProduit,
                        lieux: stockage.lieux || [],
                        techniques: stockage.techniques || [],
                        dureesStockage: stockage.dureesStockage,
                        tauxPertes: stockage.tauxPertes,
                        gestionDechets: stockage.gestionDechets,
                      })),
                    }
                  : undefined,

                distributions: data.collecteur?.[0]?.distributions
                  ? {
                      create: data.collecteur[0].distributions.map(
                        (distribution) => ({
                          destination_produit:
                            distribution.destination_produit || [],
                          lieu_vente: distribution.lieu_vente || [],
                          moyensTransport: distribution.moyensTransport || [],
                          techniquesTransport:
                            distribution.techniquesTransport || [],
                          frequenceLivraisons: distribution.frequenceLivraisons,
                          periodeDemandeElevee:
                            distribution.periodeDemandeElevee,
                          periodeDemandeFaible:
                            distribution.periodeDemandeFaible,
                        })
                      ),
                    }
                  : undefined,

                contratsAcheteur: data.collecteur?.[0]?.contratsAcheteur
                  ? {
                      create: data.collecteur[0].contratsAcheteur.map(
                        (contrat) => ({
                          typeProduit: contrat.typeProduit,
                          perceptionAvance: contrat.perceptionAvance,
                          montantAvance: contrat.montantAvance,
                          acheteurDeterminePrix: contrat.acheteurDeterminePrix,
                          prixVenteKg: contrat.prixVenteKg,
                        })
                      ),
                    }
                  : undefined,
              },
            }
          : undefined,

        // Reste des relations existantes (pecheur, activites...)
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
                autreRessourceExploitee: activite.autreRessourceExploitee,
                utilisationRessource: activite.utilisationRessource,
                prixVente: activite.prixVente,
                frequenceCollecte: activite.frequenceCollecte,
                frequenceVente: activite.frequenceVente,
                saisonHaute: activite.saisonHaute,
                saisonBasse: activite.saisonBasse,
                activiteAgricole: activite.activiteAgricole,
                complementaritePeche: activite.complementaritePeche,
                frequenceActiviteAgricole: activite.frequenceActiviteAgricole,
                superficieCultivee: activite.superficieCultivee,
                quantiteProduite: activite.quantiteProduite,
                statutFoncier: activite.statutFoncier,
                lieuExploitationAgricole: activite.lieuExploitationAgricole,
                outilsProduction: activite.outilsProduction,
                sousTypeElevage: activite.sousTypeElevage,
                effectifElevage: activite.effectifElevage,
                zonePaturage: activite.zonePaturage,
                frequenceSoins: activite.frequenceSoins,
                activiteSalariale: activite.activiteSalariale,
                dureeConsacreeSalariat: activite.dureeConsacreeSalariat,
                frequenceMensuelleSalariat: activite.frequenceMensuelleSalariat,
                lieuExerciceSalariat: activite.lieuExerciceSalariat,
                revenuMensuelSalariat: activite.revenuMensuelSalariat,
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
        collecteur: {
          include: {
            produitsAchetes: true,
            stockages: true,
            distributions: true,
            contratsAcheteur: true,
          },
        },
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
