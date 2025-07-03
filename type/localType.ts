export type District = {
  id: string;
  nom: string;
  regionId: string;
  region: { id: string; nom: string };
};

export interface Region {
  id: string;
  nom: string;
  districts: number;
  communes: number;
  fokontany: number;
}
// pour pecheur
export interface Pecheur {
  id?: string;
  PratiquePeche?: PratiquePeche[];
  EquipementPeche?: EquipementPeche[];
  EmbarcationPeche?: EmbarcationPeche[];
  CircuitCommercial?: CircuitCommercial[];
}

export interface PratiquePeche {
  id: string;
  anneeDebut?: number;
  especeCible?: string;
  dureeSaisonHaute?: number;
  dureeSaisonBasse?: number;
  frequenceSortiesSaisonHaute?: number;
  frequenceSortiesSaisonBasse?: number;
  capturesMoyennesSaisonHaute?: number;
  capturesMoyennesSaisonBasse?: number;
  classificationActivite?: string;
}

export interface EquipementPeche {
  id: string;
  typeEquipement?: string;
  quantite?: number;
  utilisationHebdomadaire?: number;
  dureeUtilisation?: number;
  rendementEstime?: number;
}

export interface EmbarcationPeche {
  id: string;
  nombre?: number;
  proprietaire?: boolean;
  statutPropriete?: string;
  nombreEquipage?: number;
  partageCaptures?: number;
  coutAcquisition?: number;
  modeAcquisition?: string;
  typeFinancement?: string;
  montantFinancement?: number;
  dureeFinancement?: number;
  remboursementMensuel?: number;
  typeEmbarcation?: string;
  systemePropulsion?: string;
  longueur?: number;
  capacitePassagers?: number;
  ageMois?: number;
  materiauxConstruction?: string;
  typeBois?: string;
  dureeVieEstimee?: number;
}

export interface CircuitCommercial {
  id: string;
  typeProduit?: string;
  modeLivraison?: string;
  dureeDeplacement?: number;
  prixAvantCorona?: number;
  prixApresCorona?: number;
  prixPendantCorona?: number;
  methodeDeconservation?: string;
  avanceFinanciere?: boolean;
  montantAvance?: number;
  determinePrix?: boolean;
  prixUnitaire?: number;
  restrictionQuantite?: boolean;
  quantiteLivree?: number;
  modePaiement?: string;
  periodeDemandeElevee?: string;
  periodeDemandeFaible?: string;
  destinations: DestinationCommerciale[];
}

export interface DestinationCommerciale {
  id?: string;
  nom?: string;
  pourcentage?: number;
}

export interface MembreFamille {
  id: string;
  nom: string;
  age?: number;
  ancienLieuResidence?: string;
  villageOrigine?: string;
  anneeArrivee?: number;
  niveauEducation?: string;
  lienFamilial?: string;
  sexe?: string;
  frequentationEcole?: boolean;
}

export interface EnqueteFormData {
  id: string;
  nomPerscible: string;
  nomRepondant?: string;
  estPecheur: boolean;
  estCollecteur: boolean;
  touteActivite: boolean;
  localFokontany: boolean;
  ethnie?: string;
  districtOrigine?: string;
  anneeArriveeVillage?: number;
  possessionAncienMetier?: boolean;
  ancienMetier?: string;
  dateEnquete: string;
  enqueteurId: string;
  secteurId: string;
  membresFamille: MembreFamille[];
  Pecheur?: Pecheur[];
  
}
