"use client";

import React from "react";
import Wrapper from "@/components/Wrapper";
import { PecheursVsCollecteurs } from "@/components/chart/pecheursVsCollecteurs";
import { AcquisitionEmbarcations } from "@/components/chart/acquisitionEmbarcations";
import { TopEquipements } from "@/components/chart/topEquipements";

import { PrixCOVID } from "@/components/chart/prixCOVID";
import { useEffect,useState } from "react";

interface StatData {
  pecheursCollecteurs?: { 
    pecheurs: number;
    collecteurs: number;
  };
  topEquipements?: { 
    equipement: string; 
    count: number;
  }[];
  prixCovid?: { 
    produit: string; 
    avant: number; 
    pendant: number; 
    apres: number; 
  }[];
  acquisitionEmbarcations?: { 
    mode: string; 
    count: number; 
  }[];
}

export default function Dashboard() {
  const [data, setData] = useState<StatData | null>(null);
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/stat`, {
        next: { revalidate: 3600 }, // Cache de 1 heure
      });
      if (!res.ok) throw new Error("Échec de la récupération des données");
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, []);
  return (
    <Wrapper>
      <div className="flex flex-1 flex-col items-center gap-6 p-4 pt-0 md:gap-8 w-full max-w-screen-2xl mx-auto">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col rounded-xl bg-white p-4 shadow-md dark:bg-gray-900 dark:shadow-blue-500 overflow-hidden">
            <PecheursVsCollecteurs data={data?.pecheursCollecteurs} />
          </div>
          <div className="flex flex-col rounded-xl bg-white p-4 shadow-md dark:bg-gray-900 dark:shadow-blue-500 overflow-hidden">
            <AcquisitionEmbarcations data={data?.acquisitionEmbarcations} />
          </div>
          <div className="flex flex-col rounded-xl bg-white p-4 shadow-md dark:bg-gray-900 dark:shadow-blue-500 overflow-hidden">
            <TopEquipements data={data?.topEquipements} />
          </div>
        </div>

        <div className="w-full rounded-xl bg-white p-4 shadow-md dark:bg-gray-900 dark:shadow-blue-500 overflow-hidden">
          <PrixCOVID />
        </div>
      </div>
    </Wrapper>
  );
}
