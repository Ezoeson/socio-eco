async function deleteRelatedRecords(
  prisma: any,
  enqueteId: string,
  existingEnquete: any
) {
  // Supprimer les membres de famille
  await prisma.membreFamille.deleteMany({
    where: { enqueteId },
  });

  // Supprimer les activités
  await prisma.activiteEconomique.deleteMany({
    where: { enqueteId },
  });

  // Supprimer les données du pêcheur si elles existent
  if (existingEnquete.pecheur) {
    await deletePecheurRecords(prisma, existingEnquete.pecheur.id);
  }

  // Supprimer les données du collecteur si elles existent
  if (existingEnquete.collecteur) {
    await deleteCollecteurRecords(prisma, existingEnquete.collecteur.id);
  }
}

// Fonctions pour supprimer les relations spécifiques
async function deletePecheurRecords(prisma: any, pecheurId: string) {
  // Supprimer les pratiques de pêche
  await prisma.pratiquePeche.deleteMany({
    where: { pecheurId },
  });

  // Supprimer les équipements
  await prisma.equipementPeche.deleteMany({
    where: { pecheurId },
  });

  // Supprimer les embarcations
  await prisma.embarcationPeche.deleteMany({
    where: { pecheurId },
  });

  // Supprimer les circuits commerciaux et leurs destinations
  const circuits = await prisma.circuitCommercialProduit.findMany({
    where: { pecheurId },
  });

  for (const circuit of circuits) {
    await prisma.destinationCommerciale.deleteMany({
      where: { circuitId: circuit.id },
    });
  }

  await prisma.circuitCommercialProduit.deleteMany({
    where: { pecheurId },
  });

  // Supprimer le pêcheur lui-même
  await prisma.pecheur.delete({
    where: { id: pecheurId },
  });
}

async function deleteCollecteurRecords(prisma: any, collecteurId: string) {
  // Supprimer les produits achetés en utilisant le bon nom de relation
  await prisma.produitAchete.deleteMany({
    where: {
      operateurId: collecteurId,
    },
  });

  // Supprimer les stockages (adaptez selon votre schéma)
  await prisma.stockage.deleteMany({
    where: {
      operateurId: collecteurId, // Ou la relation appropriée selon votre schéma
    },
  });

  // Supprimer les distributions
  await prisma.distribution.deleteMany({
    where: {
      operateurId: collecteurId,
    },
  });

  // Supprimer les contrats acheteur
  await prisma.contratAcheteur.deleteMany({
    where: {
      operateurId: collecteurId,
    },
  });

  // Supprimer le collecteur lui-même
  await prisma.collecteur.delete({
    where: { id: collecteurId },
  });
}

export { deleteCollecteurRecords, deletePecheurRecords, deleteRelatedRecords };
