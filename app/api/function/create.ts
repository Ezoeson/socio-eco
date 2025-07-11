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

export {
  createActiviteData,
  createCollecteurData,
  createMembreFamilleData,
  createPecheurData,
};
