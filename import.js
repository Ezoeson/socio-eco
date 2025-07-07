import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("⏳ Début de l'importation des données...");

    const jsonData = JSON.parse(
      fs.readFileSync("./db/liste_fokontany_par_commune_data.json", "utf-8")
    );

    // Supprimer l'entrée exemple "Region"
    delete jsonData.Region;

    const regionCount = Object.keys(jsonData).length;
    console.log(`📊 ${regionCount} régions à importer`);

    let regionsCreated = 0;
    let districtsCreated = 0;
    let communesCreated = 0;
    let fokontanysCreated = 0;

    for (const regionName in jsonData) {
      console.log(`\n🏙️ Traitement de la région: ${regionName}`);

      const region = await prisma.region.upsert({
        where: { nom: regionName },
        update: {},
        create: { nom: regionName },
      });
      regionsCreated++;

      // Créer un cache des districts pour éviter les doublons
      const districtCache = new Map();

      const communes = jsonData[regionName];
      console.log(
        `  📍 ${Object.keys(communes).length} communes dans cette région`
      );

      for (const communeName in communes) {
        const communeData = communes[communeName];

        for (const fokontanyData of communeData) {
          const districtName = fokontanyData.district;

          // Créer le district s'il n'existe pas déjà
          if (!districtCache.has(districtName)) {
            const district = await prisma.district.upsert({
              where: {
                nom_regionId: {
                  nom: districtName,
                  regionId: region.id,
                },
              },
              update: {},
              create: {
                nom: districtName,
                regionId: region.id,
              },
            });
            districtCache.set(districtName, district.id);
            districtsCreated++;
          }

          // Créer la commune
          const commune = await prisma.commune.upsert({
            where: {
              nom_districtId: {
                nom: communeName,
                districtId: districtCache.get(districtName),
              },
            },
            update: {},
            create: {
              nom: communeName,
              districtId: districtCache.get(districtName),
            },
          });
          communesCreated++;

          // Créer le fokontany
          await prisma.fokontany.upsert({
            where: {
              nom_communeId: {
                nom: fokontanyData.fokontany,
                communeId: commune.id,
              },
            },
            update: {},
            create: {
              nom: fokontanyData.fokontany,
              communeId: commune.id,
            },
          });
          fokontanysCreated++;
        }
      }
    }

    console.log("\n✅ Importation terminée avec succès !");
    console.log("📊 Statistiques:");
    console.log(`- Régions créées: ${regionsCreated}`);
    console.log(`- Districts créés: ${districtsCreated}`);
    console.log(`- Communes créées: ${communesCreated}`);
    console.log(`- Fokontanys créés: ${fokontanysCreated}`);
  } catch (error) {
    console.error("\n❌ Erreur lors de l'importation:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
