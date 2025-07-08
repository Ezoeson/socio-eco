/*
  Warnings:

  - You are about to drop the column `dureeExperience` on the `activites_economiques` table. All the data in the column will be lost.
  - You are about to drop the column `frequenceActivite` on the `activites_economiques` table. All the data in the column will be lost.
  - You are about to drop the column `frequenceCommercialisation` on the `activites_economiques` table. All the data in the column will be lost.
  - You are about to drop the column `lienAvecPeche` on the `activites_economiques` table. All the data in the column will be lost.
  - You are about to drop the column `lieuExercice` on the `activites_economiques` table. All the data in the column will be lost.
  - You are about to drop the column `localisation` on the `activites_economiques` table. All the data in the column will be lost.
  - You are about to drop the column `niveauSpecialization` on the `activites_economiques` table. All the data in the column will be lost.
  - You are about to drop the column `nombreAnimaux` on the `activites_economiques` table. All the data in the column will be lost.
  - You are about to drop the column `outilsUtilises` on the `activites_economiques` table. All the data in the column will be lost.
  - You are about to drop the column `productionAnnuelle` on the `activites_economiques` table. All the data in the column will be lost.
  - You are about to drop the column `regimeFoncier` on the `activites_economiques` table. All the data in the column will be lost.
  - You are about to drop the column `revenuMensuel` on the `activites_economiques` table. All the data in the column will be lost.
  - You are about to drop the column `sousType` on the `activites_economiques` table. All the data in the column will be lost.
  - You are about to drop the column `superficie` on the `activites_economiques` table. All the data in the column will be lost.
  - You are about to drop the column `tempsConsacreHebdo` on the `activites_economiques` table. All the data in the column will be lost.
  - The `frequenceCollecte` column on the `activites_economiques` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[nom]` on the table `regions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `typeActivite` on table `activites_economiques` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "activites_economiques" DROP COLUMN "dureeExperience",
DROP COLUMN "frequenceActivite",
DROP COLUMN "frequenceCommercialisation",
DROP COLUMN "lienAvecPeche",
DROP COLUMN "lieuExercice",
DROP COLUMN "localisation",
DROP COLUMN "niveauSpecialization",
DROP COLUMN "nombreAnimaux",
DROP COLUMN "outilsUtilises",
DROP COLUMN "productionAnnuelle",
DROP COLUMN "regimeFoncier",
DROP COLUMN "revenuMensuel",
DROP COLUMN "sousType",
DROP COLUMN "superficie",
DROP COLUMN "tempsConsacreHebdo",
ADD COLUMN     "activiteAgricole" TEXT,
ADD COLUMN     "activiteGeneratrice" TEXT,
ADD COLUMN     "activiteSalariale" TEXT,
ADD COLUMN     "autreRessourceExploitee" TEXT,
ADD COLUMN     "complementaritePeche" TEXT,
ADD COLUMN     "dureeActiviteAGR" INTEGER,
ADD COLUMN     "dureeConsacreeSalariat" INTEGER,
ADD COLUMN     "effectifElevage" INTEGER,
ADD COLUMN     "frequenceActiviteAgricole" TEXT,
ADD COLUMN     "frequenceMensuelleAGR" INTEGER,
ADD COLUMN     "frequenceMensuelleSalariat" INTEGER,
ADD COLUMN     "frequenceVente" INTEGER,
ADD COLUMN     "lieuExerciceAGR" TEXT,
ADD COLUMN     "lieuExerciceSalariat" TEXT,
ADD COLUMN     "lieuExploitationAgricole" TEXT,
ADD COLUMN     "outilsProduction" TEXT,
ADD COLUMN     "quantiteProduite" DOUBLE PRECISION,
ADD COLUMN     "revenuMensuelAGR" DOUBLE PRECISION,
ADD COLUMN     "revenuMensuelSalariat" DOUBLE PRECISION,
ADD COLUMN     "sousTypeElevage" TEXT,
ADD COLUMN     "statutFoncier" TEXT,
ADD COLUMN     "superficieCultivee" DOUBLE PRECISION,
ALTER COLUMN "typeActivite" SET NOT NULL,
DROP COLUMN "frequenceCollecte",
ADD COLUMN     "frequenceCollecte" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "regions_nom_key" ON "regions"("nom");
