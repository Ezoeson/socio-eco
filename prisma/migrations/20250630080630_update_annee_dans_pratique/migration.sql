-- CreateEnum
CREATE TYPE "NiveauEducation" AS ENUM ('AUCUN', 'PRESCOLAIRE', 'PRIMAIRE_NON_COMPLET', 'PRIMAIRE_COMPLET', 'COLLEGE_NON_COMPLET', 'COLLEGE_COMPLET', 'SECONDAIRE_NON_COMPLET', 'SECONDAIRE_COMPLET');

-- CreateEnum
CREATE TYPE "SourceFinancement" AS ENUM ('PROPRE', 'EMPRUNT', 'DON');

-- CreateEnum
CREATE TYPE "Sexe" AS ENUM ('MASCULIN', 'FEMININ');

-- CreateEnum
CREATE TYPE "LienFamilial" AS ENUM ('CONJOINT', 'ENFANT', 'PARENT', 'BEAU_PARENT', 'FRERE_SOEUR', 'AUTRE');

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
    "nomRepondant" TEXT NOT NULL,
    "nomPerscible" TEXT,
    "ethnie" TEXT,
    "districtOrigine" TEXT,
    "anneeArriveeVillage" INTEGER,
    "possessionAncienMetier" BOOLEAN,
    "ancienMetier" TEXT,
    "dateEnquete" TIMESTAMP(3),
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
    "niveauEducation" "NiveauEducation",
    "lienFamilial" "LienFamilial",
    "sexe" "Sexe",
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
    "typeFinancement" "SourceFinancement",
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
    "partMarche" DOUBLE PRECISION,

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
CREATE TABLE "operateurs_marche" (
    "id" TEXT NOT NULL,
    "enqueteId" TEXT NOT NULL,
    "localFokontany" BOOLEAN,
    "experienceAnnees" DOUBLE PRECISION,
    "estMareyeur" BOOLEAN DEFAULT false,
    "lieuCollecte" TEXT[],
    "capitalTotal" DOUBLE PRECISION,
    "partCapitalPropre" DOUBLE PRECISION,
    "partCapitalEmprunte" DOUBLE PRECISION,
    "investissementEquipement" DOUBLE PRECISION,
    "investissementLocation" DOUBLE PRECISION,
    "coutRessourcesHumaines" DOUBLE PRECISION,

    CONSTRAINT "operateurs_marche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produits_achetes" (
    "id" TEXT NOT NULL,
    "operateurId" TEXT NOT NULL,
    "typeProduit" TEXT,
    "volumeHebdomadaireKg" DOUBLE PRECISION,
    "criteresQualite" TEXT,
    "systemeAvance" BOOLEAN,
    "montantAvance" INTEGER,
    "possedeCarteProfession" BOOLEAN,
    "varieteProduitA" TEXT,
    "varieteProduitB" TEXT,
    "dureeCollecteHebdo" DOUBLE PRECISION,

    CONSTRAINT "produits_achetes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "methodes_stockage" (
    "id" TEXT NOT NULL,
    "operateurId" TEXT NOT NULL,
    "typeProduit" TEXT,
    "lieuStockage" TEXT[],
    "techniqueConservation" TEXT,
    "dureeStockageJours" INTEGER,
    "tauxPerte" DOUBLE PRECISION,
    "gestionDechets" TEXT,

    CONSTRAINT "methodes_stockage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canaux_distribution" (
    "id" TEXT NOT NULL,
    "operateurId" TEXT NOT NULL,
    "typeProduit" TEXT,
    "circuitDistribution" TEXT,
    "pointVente" TEXT[],
    "moyenTransport" TEXT,
    "frequenceLivraisonsMois" INTEGER,
    "techniqueTransport" TEXT,
    "prixVenteKg" INTEGER,
    "periodeDemandeElevee" TEXT,
    "periodeDemandeFaible" TEXT,
    "requiertAvance" BOOLEAN,
    "montantAvance" INTEGER,
    "acheteurDeterminePrix" BOOLEAN,

    CONSTRAINT "canaux_distribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activites_economiques" (
    "id" TEXT NOT NULL,
    "enqueteId" TEXT NOT NULL,
    "typeActivite" TEXT,
    "sousType" TEXT,
    "utilisationRessource" TEXT,
    "prixVente" INTEGER,
    "frequenceCollecte" TEXT,
    "frequenceCommercialisation" TEXT,
    "saisonHaute" TEXT,
    "saisonBasse" TEXT,
    "importanceActivite" TEXT,
    "lienAvecPeche" TEXT,
    "superficie" DOUBLE PRECISION,
    "productionAnnuelle" DOUBLE PRECISION,
    "regimeFoncier" TEXT,
    "localisation" TEXT,
    "outilsUtilises" TEXT,
    "frequenceActivite" TEXT,
    "dureeExperience" TEXT,
    "nombreAnimaux" INTEGER,
    "zonePaturage" TEXT,
    "frequenceSoins" TEXT,
    "tempsConsacreHebdo" INTEGER,
    "revenuMensuel" DOUBLE PRECISION,
    "lieuExercice" TEXT,
    "niveauSpecialization" TEXT,

    CONSTRAINT "activites_economiques_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ActiviteEconomiqueToPecheur" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ActiviteEconomiqueToPecheur_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ActiviteEconomiqueToCollecteur" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ActiviteEconomiqueToCollecteur_AB_pkey" PRIMARY KEY ("A","B")
);

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
CREATE UNIQUE INDEX "operateurs_marche_enqueteId_key" ON "operateurs_marche"("enqueteId");

-- CreateIndex
CREATE UNIQUE INDEX "produits_achetes_operateurId_typeProduit_key" ON "produits_achetes"("operateurId", "typeProduit");

-- CreateIndex
CREATE INDEX "_ActiviteEconomiqueToPecheur_B_index" ON "_ActiviteEconomiqueToPecheur"("B");

-- CreateIndex
CREATE INDEX "_ActiviteEconomiqueToCollecteur_B_index" ON "_ActiviteEconomiqueToCollecteur"("B");

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
ALTER TABLE "operateurs_marche" ADD CONSTRAINT "operateurs_marche_enqueteId_fkey" FOREIGN KEY ("enqueteId") REFERENCES "enquetes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produits_achetes" ADD CONSTRAINT "produits_achetes_operateurId_fkey" FOREIGN KEY ("operateurId") REFERENCES "operateurs_marche"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "methodes_stockage" ADD CONSTRAINT "methodes_stockage_operateurId_fkey" FOREIGN KEY ("operateurId") REFERENCES "operateurs_marche"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canaux_distribution" ADD CONSTRAINT "canaux_distribution_operateurId_fkey" FOREIGN KEY ("operateurId") REFERENCES "operateurs_marche"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activites_economiques" ADD CONSTRAINT "activites_economiques_enqueteId_fkey" FOREIGN KEY ("enqueteId") REFERENCES "enquetes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActiviteEconomiqueToPecheur" ADD CONSTRAINT "_ActiviteEconomiqueToPecheur_A_fkey" FOREIGN KEY ("A") REFERENCES "activites_economiques"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActiviteEconomiqueToPecheur" ADD CONSTRAINT "_ActiviteEconomiqueToPecheur_B_fkey" FOREIGN KEY ("B") REFERENCES "pecheurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActiviteEconomiqueToCollecteur" ADD CONSTRAINT "_ActiviteEconomiqueToCollecteur_A_fkey" FOREIGN KEY ("A") REFERENCES "activites_economiques"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActiviteEconomiqueToCollecteur" ADD CONSTRAINT "_ActiviteEconomiqueToCollecteur_B_fkey" FOREIGN KEY ("B") REFERENCES "operateurs_marche"("id") ON DELETE CASCADE ON UPDATE CASCADE;
