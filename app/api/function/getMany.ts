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

export default getIncludeRelations;
