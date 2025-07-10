import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma"; // Utilisez l'instance partagée plutôt que new PrismaClient()

import { EnqueteFormData } from "@/type/localType";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const enquete = await prisma.enquete.findUnique({
      where: { id: id },
      include: {
        enqueteur: true,
        secteur: true,
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
        membresFamille: true,
        activites: true,
      },
    });

    if (!enquete) {
      return NextResponse.json({ error: "Enquete not found" }, { status: 404 });
    }

    return NextResponse.json(enquete);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch enquete" },
      { status: 500 }
    );
  }
}

export async function PUTE(request: Request) {
  const data: EnqueteFormData & { id: string } = await request.json();

  // Vérifier que l'ID est fourni
  if (!data.id) {
    return NextResponse.json(
      { message: "L'ID de l'enquête est requis pour la mise à jour" },
      { status: 400 }
    );
  }

  // Vérifier que l'enquête existe
  const existingEnquete = await prisma.enquete.findUnique({
    where: { id: data.id },
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
    },
  });

  if (!existingEnquete) {
    return NextResponse.json(
      { message: "Enquête non trouvée" },
      { status: 404 }
    );
  }

  // Valider les données comme dans POST
  if (!data.nomRepondant) {
    return NextResponse.json(
      { message: "Le nom du répondant est requis" },
      { status: 400 }
    );
  }

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
    : existingEnquete.dateEnquete;

  try {
    // Commencer la transaction pour toutes les opérations
    const updatedEnquete = await prisma.$transaction(async (prisma) => {
      // Supprimer les relations existantes qui seront recréées
      await prisma.membreFamille.deleteMany({
        where: { enqueteId: data.id },
      });
      await prisma.activiteEconomique.deleteMany({
        where: { enqueteId: data.id },
      });

      if (existingEnquete.pecheur) {
        await prisma.pratiquePeche.deleteMany({
          where: { pecheurId: existingEnquete.pecheur.id },
        });
        await prisma.equipementPeche.deleteMany({
          where: { pecheurId: existingEnquete.pecheur.id },
        });
        await prisma.embarcationPeche.deleteMany({
          where: { pecheurId: existingEnquete.pecheur.id },
        });

        const circuits = await prisma.circuitCommercialProduit.findMany({
          where: { pecheurId: existingEnquete.pecheur.id },
        });

        for (const circuit of circuits) {
          await prisma.destinationCommerciale.deleteMany({
            where: { circuitId: circuit.id },
          });
        }

        await prisma.circuitCommercialProduit.deleteMany({
          where: { pecheurId: existingEnquete.pecheur.id },
        });
      }

      // Mettre à jour l'enquête principale
      return await prisma.enquete.update({
        where: { id: data.id },
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
                update: {
                  pratiquesPeche: data.Pecheur?.[0]?.PratiquePeche
                    ? {
                        create: data.Pecheur[0].PratiquePeche.map(
                          (pratique) => ({
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
                            classificationActivite:
                              pratique.classificationActivite,
                          })
                        ),
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
                            methodeDeconservation:
                              circuit.methodeDeconservation,
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
            : existingEnquete.pecheur
            ? { delete: true }
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
                  frequenceMensuelleSalariat:
                    activite.frequenceMensuelleSalariat,
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
    });

    return NextResponse.json(
      {
        message: "Enquête mise à jour avec succès",
        data: updatedEnquete,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'enquête:", error);
    return NextResponse.json(
      {
        message: "Une erreur est survenue lors de la mise à jour de l'enquête",
      },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {
  const data: EnqueteFormData & { id: string } = await request.json();

  // Validations de base
  if (!data.id) {
    return NextResponse.json(
      { message: "L'ID de l'enquête est requis" },
      { status: 400 }
    );
  }

  if (!data.nomRepondant) {
    return NextResponse.json(
      { message: "Le nom du répondant est requis" },
      { status: 400 }
    );
  }

  // Validation des IDs existants si fournis
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

  // Récupération de l'enquête existante
  const existingEnquete = await prisma.enquete.findUnique({
    where: { id: data.id },
    include: {
      membresFamille: true,
      pecheur: {
        include: {
          pratiquesPeche: true,
          equipementsPeche: true,
          embarcations: true,
          circuitsCommercial: { include: { destinations: true } },
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
      activites: true,
    },
  });

  if (!existingEnquete) {
    return NextResponse.json(
      { message: "Enquête non trouvée" },
      { status: 404 }
    );
  }

  try {
    const updatedEnquete = await prisma.$transaction(async (prisma) => {
      // Suppression des relations existantes
      await Promise.all([
        prisma.membreFamille.deleteMany({ where: { enqueteId: data.id } }),
        prisma.activiteEconomique.deleteMany({ where: { enqueteId: data.id } }),
      ]);

      // Suppression des relations du pêcheur
      if (existingEnquete.pecheur) {
        await Promise.all([
          prisma.pratiquePeche.deleteMany({
            where: { pecheurId: existingEnquete.pecheur.id },
          }),
          prisma.equipementPeche.deleteMany({
            where: { pecheurId: existingEnquete.pecheur.id },
          }),
          prisma.embarcationPeche.deleteMany({
            where: { pecheurId: existingEnquete.pecheur.id },
          }),
          prisma.circuitCommercialProduit.deleteMany({
            where: { pecheurId: existingEnquete.pecheur.id },
          }),
        ]);
      }

      // Suppression des relations du collecteur

      // Date de l'enquête
      const dateEnquete = data.dateEnquete
        ? new Date(data.dateEnquete)
        : existingEnquete.dateEnquete;

      // Mise à jour de l'enquête principale
      return await prisma.enquete.update({
        where: { id: data.id },
        data: {
          // Champs de base
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

          // Membres famille
          membresFamille: data.membresFamille?.length
            ? {
                create: data.membresFamille.map((membre) => ({
                  nom: membre.nom,
                  age: membre.age,
                  ancienLieuResidence: membre.ancienLieuResidence,
                  villageOrigine: membre.villageOrigine,
                  anneeArrivee: membre.anneeArrivee,
                  niveauEducation: membre.niveauEducation,
                  lienFamilial: membre.lienFamilial,
                  sexe: membre.sexe,
                  frequentationEcole: membre.frequentationEcole,
                })),
              }
            : undefined,

          // Pêcheur
          pecheur:
            data.estPecheur && data.Pecheur?.length
              ? {
                  update: {
                    pratiquesPeche: data.Pecheur[0].PratiquePeche?.length
                      ? {
                          create: data.Pecheur[0].PratiquePeche.map(
                            (pratique) => ({
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
                              classificationActivite:
                                pratique.classificationActivite,
                            })
                          ),
                        }
                      : undefined,

                    equipementsPeche: data.Pecheur[0].EquipementPeche?.length
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

                    embarcations: data.Pecheur[0].EmbarcationPeche?.length
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
                              montantFinancement:
                                embarcation.montantFinancement,
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

                    circuitsCommercial: data.Pecheur[0].CircuitCommercial
                      ?.length
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
                              periodeDemandeElevee:
                                circuit.periodeDemandeElevee,
                              periodeDemandeFaible:
                                circuit.periodeDemandeFaible,
                              modeLivraison: circuit.modeLivraison,
                              methodeDeconservation:
                                circuit.methodeDeconservation,
                              dureeDeplacement: circuit.dureeDeplacement,
                              prixAvantCorona: circuit.prixAvantCorona,
                              prixPendantCorona: circuit.prixPendantCorona,
                              prixApresCorona: circuit.prixApresCorona,
                              destinations: circuit.destinations?.length
                                ? {
                                    create: circuit.destinations.map(
                                      (destination) => ({
                                        nom: destination.nom,
                                        pourcentage: destination.pourcentage,
                                      })
                                    ),
                                  }
                                : undefined,
                            })
                          ),
                        }
                      : undefined,
                  },
                }
              : existingEnquete.pecheur
              ? { delete: true }
              : undefined,

          // Collecteur
          collecteur:
            data.estCollecteur && data.collecteur?.length
              ? {
                  update: {
                    // Ajoutez cette ligne
                    data: {
                      // Champs de base
                      anneeDemarrageActivite:
                        data.collecteur[0].anneeDemarrageActivite,
                      lieuCollecte: data.collecteur[0].lieuCollecte || [],
                      dureeCollecteHebdo: data.collecteur[0].dureeCollecteHebdo,
                      frequencePassage: data.collecteur[0].frequencePassage,
                      effectifPersonnel: data.collecteur[0].effectifPersonnel,
                      capitalTotal: data.collecteur[0].capitalTotal,
                      partCapitalPropre: data.collecteur[0].partCapitalPropre,
                      partCapitalEmprunte:
                        data.collecteur[0].partCapitalEmprunte,
                      investissementEquipement:
                        data.collecteur[0].investissementEquipement,
                      investissementLocation:
                        data.collecteur[0].investissementLocation,
                      coutRessourcesHumaines:
                        data.collecteur[0].coutRessourcesHumaines,
                      estMareyeur: data.collecteur[0].estMareyeur,
                      estStockage: data.collecteur[0].estStockage,
                      estContrat: data.collecteur[0].estContrat,

                      // Relations
                      produitsAchetes: data.collecteur[0].produitsAchetes
                        ?.length
                        ? {
                            create: data.collecteur[0].produitsAchetes.map(
                              (produit) => ({
                                typeProduit: produit.typeProduit,
                                volumeHebdomadaireKg:
                                  produit.volumeHebdomadaireKg,
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

                      stockages: data.collecteur[0].stockages?.length
                        ? {
                            create: data.collecteur[0].stockages.map(
                              (stockage) => ({
                                typeProduit: stockage.typeProduit,
                                lieux: stockage.lieux || [],
                                techniques: stockage.techniques || [],
                                dureesStockage: stockage.dureesStockage,
                                tauxPertes: stockage.tauxPertes,
                                gestionDechets: stockage.gestionDechets,
                              })
                            ),
                          }
                        : undefined,

                      distributions: data.collecteur[0].distributions?.length
                        ? {
                            create: data.collecteur[0].distributions.map(
                              (distribution) => ({
                                destination_produit:
                                  distribution.destination_produit || [],
                                lieu_vente: distribution.lieu_vente || [],
                                moyensTransport:
                                  distribution.moyensTransport || [],
                                techniquesTransport:
                                  distribution.techniquesTransport || [],
                                frequenceLivraisons:
                                  distribution.frequenceLivraisons,
                                periodeDemandeElevee:
                                  distribution.periodeDemandeElevee,
                                periodeDemandeFaible:
                                  distribution.periodeDemandeFaible,
                              })
                            ),
                          }
                        : undefined,

                      contratsAcheteur: data.collecteur[0].contratsAcheteur
                        ?.length
                        ? {
                            create: data.collecteur[0].contratsAcheteur.map(
                              (contrat) => ({
                                typeProduit: contrat.typeProduit,
                                perceptionAvance: contrat.perceptionAvance,
                                montantAvance: contrat.montantAvance,
                                acheteurDeterminePrix:
                                  contrat.acheteurDeterminePrix,
                                prixVenteKg: contrat.prixVenteKg,
                              })
                            ),
                          }
                        : undefined,
                    },
                  },
                }
              : existingEnquete.collecteur
              ? { delete: true }
              : undefined,

          // Activités
          activites: data.activites?.length
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
                  frequenceMensuelleSalariat:
                    activite.frequenceMensuelleSalariat,
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
              circuitsCommercial: { include: { destinations: true } },
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
          activites: true,
          enqueteur: true,
          secteur: true,
        },
      });
    });

    return NextResponse.json(
      {
        message: "Enquête mise à jour avec succès",
        data: updatedEnquete,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'enquête:", error);
    return NextResponse.json(
      {
        message: "Une erreur est survenue lors de la mise à jour de l'enquête",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const enquete = await prisma.enquete.findUnique({
      where: { id: id },
    });

    if (!enquete) {
      return NextResponse.json({ error: "Enquete not found" }, { status: 404 });
    }

    await prisma.enquete.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: "Enquete deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete enquete" },
      { status: 500 }
    );
  }
}
