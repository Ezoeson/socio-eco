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

  // Validations de base
  if (!data.nomRepondant) {
    return NextResponse.json(
      { message: "Le nom du répondant est requis" },
      { status: 400 }
    );
  }

  // Validation des relations existantes
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
    // Création de l'enquête avec toutes les relations
    const newEnquete = await prisma.enquete.create({
      data: {
        nomPerscible: data.nomPerscible || "Enquête Famille",
        nomRepondant: data.nomRepondant,
        estPecheur: data.estPecheur,
        estCollecteur: data.estCollecteur,
        touteActivite: data.touteActivite,
        localFokontany: data.localFokontany,
        ethnie: data.ethnie,
        districtOrigine: data.districtOrigine,
        anneeArriveeVillage: data.anneeArriveeVillage,
        possessionAncienMetier: data.possessionAncienMetier,
        ancienMetier: data.ancienMetier,
        dateEnquete: dateEnquete,
        enqueteurId: data.enqueteurId,
        secteurId: data.secteurId,

        // Membres de la famille
        membresFamille:
          data.membresFamille?.length > 0
            ? {
                create: data.membresFamille.map(createMembreFamilleData),
              }
            : undefined,

        // Collecteur
        collecteur:
          data.estCollecteur && data.collecteur?.[0]
            ? {
                create: createCollecteurData(data.collecteur[0]),
              }
            : undefined,

        // Pêcheur
        pecheur:
          data.estPecheur && data.Pecheur?.[0]
            ? {
                create: createPecheurData(data.Pecheur[0]),
              }
            : undefined,

        // Activités économiques
        activites:
          data.activites && data.activites.length > 0
            ? {
                create: data.activites.map(createActiviteData),
              }
            : undefined,
      },
      include: getIncludeRelations(),
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
      {
        message: "Une erreur est survenue lors de la création de l'enquête",
        error: process.env.NODE_ENV === "development",
      },
      { status: 500 }
    );
  }
}

// Fonctions helper complètes

function createMembreFamilleData(membre: any) {
  return {
    nom: membre.nom,
    age: membre.age,
    ancienLieuResidence: membre.ancienLieuResidence,
    villageOrigine: membre.villageOrigine,
    anneeArrivee: membre.anneeArrivee,
    niveauEducation: membre.niveauEducation,
    lienFamilial: membre.lienFamilial,
    sexe: membre.sexe,
    frequentationEcole: membre.frequentationEcole,
  };
}

function createCollecteurData(collecteur: any) {
  return {
    // Circuit de commercialisation
    anneeDemarrageActivite: collecteur.anneeDemarrageActivite,
    lieuCollecte: collecteur.lieuCollecte || [],
    dureeCollecteHebdo: collecteur.dureeCollecteHebdo,
    frequencePassage: collecteur.frequencePassage,
    effectifPersonnel: collecteur.effectifPersonnel,

    // Capitaux
    capitalTotal: collecteur.capitalTotal,
    partCapitalPropre: collecteur.partCapitalPropre,
    partCapitalEmprunte: collecteur.partCapitalEmprunte,
    investissementEquipement: collecteur.investissementEquipement,
    investissementLocation: collecteur.investissementLocation,
    coutRessourcesHumaines: collecteur.coutRessourcesHumaines,

    // Autres caractéristiques
    estMareyeur: collecteur.estMareyeur,
    estStockage: collecteur.estStockage,
    estContrat: collecteur.estContrat,

    // Relations
    produitsAchetes:
      collecteur.produitsAchetes?.length > 0
        ? {
            create: collecteur.produitsAchetes.map((produit: any) => ({
              typeProduit: produit.typeProduit,
              volumeHebdomadaireKg: produit.volumeHebdomadaireKg,
              criteresQualite: produit.criteresQualite,
              systemeAvance: produit.systemeAvance,
              montantAvance: produit.montantAvance,
              possedeCarteProfession: produit.possedeCarteProfession,
              varietes: produit.varietes || [],
            })),
          }
        : undefined,

    stockages:
      collecteur.stockages?.length > 0
        ? {
            create: collecteur.stockages.map((stockage: any) => ({
              typeProduit: stockage.typeProduit,
              lieux: stockage.lieux || [],
              techniques: stockage.techniques || [],
              dureesStockage: stockage.dureesStockage,
              tauxPertes: stockage.tauxPertes,
              gestionDechets: stockage.gestionDechets,
            })),
          }
        : undefined,

    distributions:
      collecteur.distributions?.length > 0
        ? {
            create: collecteur.distributions.map((distribution: any) => ({
              destination_produit: distribution.destination_produit || [],
              lieu_vente: distribution.lieu_vente || [],
              moyensTransport: distribution.moyensTransport || [],
              techniquesTransport: distribution.techniquesTransport || [],
              frequenceLivraisons: distribution.frequenceLivraisons,
              periodeDemandeElevee: distribution.periodeDemandeElevee,
              periodeDemandeFaible: distribution.periodeDemandeFaible,
            })),
          }
        : undefined,

    contratsAcheteur:
      collecteur.contratsAcheteur?.length > 0
        ? {
            create: collecteur.contratsAcheteur.map((contrat: any) => ({
              typeProduit: contrat.typeProduit,
              perceptionAvance: contrat.perceptionAvance,
              montantAvance: contrat.montantAvance,
              acheteurDeterminePrix: contrat.acheteurDeterminePrix,
              prixVenteKg: contrat.prixVenteKg,
            })),
          }
        : undefined,
  };
}

function createPecheurData(pecheur: any) {
  return {
    pratiquesPeche:
      pecheur.PratiquePeche?.length > 0
        ? {
            create: pecheur.PratiquePeche.map((pratique: any) => ({
              anneeDebut: pratique.anneeDebut,
              especeCible: pratique.especeCible,
              dureeSaisonHaute: pratique.dureeSaisonHaute,
              dureeSaisonBasse: pratique.dureeSaisonBasse,
              frequenceSortiesSaisonHaute: pratique.frequenceSortiesSaisonHaute,
              frequenceSortiesSaisonBasse: pratique.frequenceSortiesSaisonBasse,
              capturesMoyennesSaisonHaute: pratique.capturesMoyennesSaisonHaute,
              capturesMoyennesSaisonBasse: pratique.capturesMoyennesSaisonBasse,
              classificationActivite: pratique.classificationActivite,
            })),
          }
        : undefined,

    equipementsPeche:
      pecheur.EquipementPeche?.length > 0
        ? {
            create: pecheur.EquipementPeche.map((equipement: any) => ({
              typeEquipement: equipement.typeEquipement,
              quantite: equipement.quantite,
              utilisationHebdomadaire: equipement.utilisationHebdomadaire,
              dureeUtilisation: equipement.dureeUtilisation,
              rendementEstime: equipement.rendementEstime,
            })),
          }
        : undefined,

    embarcations:
      pecheur.EmbarcationPeche?.length > 0
        ? {
            create: pecheur.EmbarcationPeche.map((embarcation: any) => ({
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
              remboursementMensuel: embarcation.remboursementMensuel,
              longueur: embarcation.longueur,
              capacitePassagers: embarcation.capacitePassagers,
              ageMois: embarcation.ageMois,
              dureeVieEstimee: embarcation.dureeVieEstimee,
              materiauxConstruction: embarcation.materiauxConstruction,
              typeBois: embarcation.typeBois,
            })),
          }
        : undefined,

    circuitsCommercial:
      pecheur.CircuitCommercial?.length > 0
        ? {
            create: pecheur.CircuitCommercial.map((circuit: any) => ({
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
              destinations:
                circuit.destinations?.length > 0
                  ? {
                      create: circuit.destinations.map((destination: any) => ({
                        nom: destination.nom,
                        pourcentage: destination.pourcentage,
                      })),
                    }
                  : undefined,
            })),
          }
        : undefined,
  };
}

function createActiviteData(activite: any) {
  return {
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
  };
}

function getIncludeRelations() {
  return {
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
    activites: true,
  };
}
