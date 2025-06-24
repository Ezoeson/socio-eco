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
