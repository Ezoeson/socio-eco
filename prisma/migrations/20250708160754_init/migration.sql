-- CreateTable
CREATE TABLE "regions" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communes" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "communes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fokontanys" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "communeId" TEXT NOT NULL,

    CONSTRAINT "fokontanys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secteurs" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "fokontanyId" TEXT NOT NULL,

    CONSTRAINT "secteurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enqueteurs" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT,
    "code" TEXT,
    "telephone" TEXT,
    "image" TEXT,
    "email" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enqueteurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enquetes" (
    "id" TEXT NOT NULL,
    "estPecheur" BOOLEAN NOT NULL DEFAULT false,
    "estCollecteur" BOOLEAN NOT NULL DEFAULT false,
    "touteActivite" BOOLEAN NOT NULL DEFAULT false,
    "localFokontany" BOOLEAN,
    "nomRepondant" TEXT NOT NULL,
    "nomPerscible" TEXT,
    "ethnie" TEXT,
    "districtOrigine" TEXT,
    "anneeArriveeVillage" INTEGER,
    "possessionAncienMetier" BOOLEAN,
    "ancienMetier" TEXT,
    "dateEnquete" TIMESTAMP(3),
    "updateDate" TIMESTAMP(3) NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enqueteurId" TEXT,
    "secteurId" TEXT,

    CONSTRAINT "enquetes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membres_famille" (
    "id" TEXT NOT NULL,
    "enqueteId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "age" INTEGER,
    "ancienLieuResidence" TEXT,
    "villageOrigine" TEXT,
    "anneeArrivee" INTEGER,
    "niveauEducation" TEXT,
    "lienFamilial" TEXT,
    "sexe" TEXT,
    "frequentationEcole" BOOLEAN,

    CONSTRAINT "membres_famille_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pecheurs" (
    "id" TEXT NOT NULL,
    "enqueteId" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pecheurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pratiques_peche" (
    "id" TEXT NOT NULL,
    "pecheurId" TEXT NOT NULL,
    "anneeDebut" INTEGER,
    "especeCible" TEXT,
    "dureeSaisonHaute" INTEGER,
    "dureeSaisonBasse" INTEGER,
    "frequenceSortiesSaisonHaute" DOUBLE PRECISION,
    "frequenceSortiesSaisonBasse" DOUBLE PRECISION,
    "capturesMoyennesSaisonHaute" DOUBLE PRECISION,
    "capturesMoyennesSaisonBasse" DOUBLE PRECISION,
    "classificationActivite" TEXT,

    CONSTRAINT "pratiques_peche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipements_peche" (
    "id" TEXT NOT NULL,
    "pecheurId" TEXT NOT NULL,
    "typeEquipement" TEXT,
    "quantite" INTEGER,
    "utilisationHebdomadaire" INTEGER,
    "dureeUtilisation" INTEGER,
    "rendementEstime" INTEGER,

    CONSTRAINT "equipements_peche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "embarcations_peche" (
    "id" TEXT NOT NULL,
    "pecheurId" TEXT NOT NULL,
    "nombre" INTEGER,
    "proprietaire" BOOLEAN,
    "statutPropriete" TEXT,
    "nombreEquipage" INTEGER,
    "partageCaptures" DOUBLE PRECISION,
    "coutAcquisition" DOUBLE PRECISION,
    "modeAcquisition" TEXT,
    "typeFinancement" TEXT,
    "montantFinancement" DOUBLE PRECISION,
    "dureeFinancement" INTEGER,
    "remboursementMensuel" DOUBLE PRECISION,
    "typeEmbarcation" TEXT,
    "systemePropulsion" TEXT,
    "longueur" DOUBLE PRECISION,
    "capacitePassagers" INTEGER,
    "ageMois" INTEGER,
    "materiauxConstruction" TEXT,
    "typeBois" TEXT,
    "dureeVieEstimee" INTEGER,

    CONSTRAINT "embarcations_peche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "circuits_commerciaux" (
    "id" TEXT NOT NULL,
    "pecheurId" TEXT NOT NULL,
    "typeProduit" TEXT,
    "modeLivraison" TEXT,
    "dureeDeplacement" INTEGER,
    "prixAvantCorona" DOUBLE PRECISION,
    "prixApresCorona" DOUBLE PRECISION,
    "prixPendantCorona" DOUBLE PRECISION,
    "methodeDeconservation" TEXT,
    "avanceFinanciere" BOOLEAN,
    "montantAvance" INTEGER,
    "determinePrix" BOOLEAN,
    "prixUnitaire" INTEGER,
    "restrictionQuantite" BOOLEAN,
    "quantiteLivree" DOUBLE PRECISION,
    "modePaiement" TEXT,
    "periodeDemandeElevee" TEXT,
    "periodeDemandeFaible" TEXT,

    CONSTRAINT "circuits_commerciaux_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinations_commerciales" (
    "id" TEXT NOT NULL,
    "circuitId" TEXT NOT NULL,
    "nom" TEXT,
    "pourcentage" DOUBLE PRECISION,

    CONSTRAINT "destinations_commerciales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collecteurs" (
    "id" TEXT NOT NULL,
    "enqueteId" TEXT NOT NULL,
    "annee_demarrage_activite" INTEGER,
    "lieu_collecte" TEXT[],
    "duree_collecte_hebdomadaire" INTEGER,
    "frequence_passage" TEXT,
    "effectif_personel" INTEGER,
    "capitaux" DOUBLE PRECISION,
    "financier_propre_pourcentage" DOUBLE PRECISION,
    "financier_emprunte_pourcentage" DOUBLE PRECISION,
    "investissement_propre" DOUBLE PRECISION,
    "investissement_location" DOUBLE PRECISION,
    "ressources_humaine" DOUBLE PRECISION,
    "est_mareyeur" BOOLEAN DEFAULT false,
    "est_stockage" BOOLEAN DEFAULT true,
    "lieu_stockage" TEXT[],
    "technique_conservation" TEXT,
    "duree_stockage_jours" INTEGER,
    "taux_perte" DOUBLE PRECISION,
    "gestion_dechets" TEXT,
    "circuit_distribution" TEXT[],
    "point_vente" TEXT[],
    "moyen_transport" TEXT[],
    "frequence_livraisons" INTEGER,
    "technique_transport" TEXT,
    "saison_forte_demande" TEXT,
    "saison_faible_demande" TEXT,

    CONSTRAINT "collecteurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produits" (
    "id" TEXT NOT NULL,
    "collecteurId" TEXT NOT NULL,
    "type_produit" TEXT,
    "quantite_hebdomadaire" DOUBLE PRECISION,
    "criteres_qualite" TEXT,
    "varietes" TEXT[],
    "systeme_avance" BOOLEAN DEFAULT false,
    "montant_avance" DOUBLE PRECISION,
    "possede_carte" BOOLEAN DEFAULT false,

    CONSTRAINT "produits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contrats" (
    "id" TEXT NOT NULL,
    "collecteurId" TEXT NOT NULL,
    "type_produit" TEXT,
    "perception_avance" BOOLEAN DEFAULT false,
    "montant_avance" DOUBLE PRECISION,
    "acheteur_fixe_prix" BOOLEAN DEFAULT false,
    "prix_vente_kg" DOUBLE PRECISION,

    CONSTRAINT "contrats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activites_economiques" (
    "id" TEXT NOT NULL,
    "enqueteId" TEXT NOT NULL,
    "typeActivite" TEXT NOT NULL,
    "importanceActivite" TEXT,
    "autreRessourceExploitee" TEXT,
    "utilisationRessource" TEXT,
    "prixVente" INTEGER,
    "frequenceCollecte" INTEGER,
    "frequenceVente" INTEGER,
    "saisonHaute" TEXT,
    "saisonBasse" TEXT,
    "activiteAgricole" TEXT,
    "complementaritePeche" TEXT,
    "frequenceActiviteAgricole" TEXT,
    "superficieCultivee" DOUBLE PRECISION,
    "quantiteProduite" DOUBLE PRECISION,
    "statutFoncier" TEXT,
    "lieuExploitationAgricole" TEXT,
    "outilsProduction" TEXT,
    "sousTypeElevage" TEXT,
    "effectifElevage" INTEGER,
    "zonePaturage" TEXT,
    "frequenceSoins" TEXT,
    "activiteSalariale" TEXT,
    "dureeConsacreeSalariat" INTEGER,
    "frequenceMensuelleSalariat" INTEGER,
    "lieuExerciceSalariat" TEXT,
    "revenuMensuelSalariat" DOUBLE PRECISION,
    "activiteGeneratrice" TEXT,
    "dureeActiviteAGR" INTEGER,
    "frequenceMensuelleAGR" INTEGER,
    "lieuExerciceAGR" TEXT,
    "revenuMensuelAGR" DOUBLE PRECISION,

    CONSTRAINT "activites_economiques_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "regions_nom_key" ON "regions"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "districts_nom_regionId_key" ON "districts"("nom", "regionId");

-- CreateIndex
CREATE UNIQUE INDEX "communes_nom_districtId_key" ON "communes"("nom", "districtId");

-- CreateIndex
CREATE UNIQUE INDEX "fokontanys_nom_communeId_key" ON "fokontanys"("nom", "communeId");

-- CreateIndex
CREATE UNIQUE INDEX "secteurs_nom_fokontanyId_key" ON "secteurs"("nom", "fokontanyId");

-- CreateIndex
CREATE UNIQUE INDEX "enqueteurs_nom_key" ON "enqueteurs"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "enqueteurs_code_key" ON "enqueteurs"("code");

-- CreateIndex
CREATE UNIQUE INDEX "enqueteurs_email_key" ON "enqueteurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pecheurs_id_key" ON "pecheurs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "pecheurs_enqueteId_key" ON "pecheurs"("enqueteId");

-- CreateIndex
CREATE UNIQUE INDEX "pratiques_peche_pecheurId_especeCible_key" ON "pratiques_peche"("pecheurId", "especeCible");

-- CreateIndex
CREATE UNIQUE INDEX "embarcations_peche_pecheurId_key" ON "embarcations_peche"("pecheurId");

-- CreateIndex
CREATE UNIQUE INDEX "collecteurs_enqueteId_key" ON "collecteurs"("enqueteId");

-- CreateIndex
CREATE UNIQUE INDEX "produits_collecteurId_type_produit_key" ON "produits"("collecteurId", "type_produit");

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communes" ADD CONSTRAINT "communes_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fokontanys" ADD CONSTRAINT "fokontanys_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "communes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secteurs" ADD CONSTRAINT "secteurs_fokontanyId_fkey" FOREIGN KEY ("fokontanyId") REFERENCES "fokontanys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enquetes" ADD CONSTRAINT "enquetes_enqueteurId_fkey" FOREIGN KEY ("enqueteurId") REFERENCES "enqueteurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enquetes" ADD CONSTRAINT "enquetes_secteurId_fkey" FOREIGN KEY ("secteurId") REFERENCES "secteurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membres_famille" ADD CONSTRAINT "membres_famille_enqueteId_fkey" FOREIGN KEY ("enqueteId") REFERENCES "enquetes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pecheurs" ADD CONSTRAINT "pecheurs_enqueteId_fkey" FOREIGN KEY ("enqueteId") REFERENCES "enquetes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pratiques_peche" ADD CONSTRAINT "pratiques_peche_pecheurId_fkey" FOREIGN KEY ("pecheurId") REFERENCES "pecheurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipements_peche" ADD CONSTRAINT "equipements_peche_pecheurId_fkey" FOREIGN KEY ("pecheurId") REFERENCES "pecheurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "embarcations_peche" ADD CONSTRAINT "embarcations_peche_pecheurId_fkey" FOREIGN KEY ("pecheurId") REFERENCES "pecheurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "circuits_commerciaux" ADD CONSTRAINT "circuits_commerciaux_pecheurId_fkey" FOREIGN KEY ("pecheurId") REFERENCES "pecheurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destinations_commerciales" ADD CONSTRAINT "destinations_commerciales_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "circuits_commerciaux"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collecteurs" ADD CONSTRAINT "collecteurs_enqueteId_fkey" FOREIGN KEY ("enqueteId") REFERENCES "enquetes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produits" ADD CONSTRAINT "produits_collecteurId_fkey" FOREIGN KEY ("collecteurId") REFERENCES "collecteurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contrats" ADD CONSTRAINT "contrats_collecteurId_fkey" FOREIGN KEY ("collecteurId") REFERENCES "collecteurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activites_economiques" ADD CONSTRAINT "activites_economiques_enqueteId_fkey" FOREIGN KEY ("enqueteId") REFERENCES "enquetes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
