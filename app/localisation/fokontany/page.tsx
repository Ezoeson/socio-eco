'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Wrapper from '@/components/Wrapper';
import { Plus, Search, Edit, Trash2, MapPin } from 'lucide-react';
import { useState } from 'react';

const initialFokontany = [
  {
    id: '1',
    nom: '67 Ha',
    commune: 'Antananarivo I',
    secteurs: 4,
    population: 12500,
  },
  {
    id: '2',
    nom: 'Analakely',
    commune: 'Antananarivo I',
    secteurs: 3,
    population: 8900,
  },
  {
    id: '3',
    nom: 'Tsaralalana',
    commune: 'Antananarivo I',
    secteurs: 5,
    population: 15200,
  },
];

export default function Fokontany() {
  const [fokontany, setFokontany] = useState(initialFokontany);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFokontany = fokontany.filter(
    (fkt) =>
      fkt.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fkt.commune.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setFokontany(fokontany.filter((fkt) => fkt.id !== id));
  };

  return (
    <Wrapper>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='text-3xl font-bold flex items-center gap-2'>
              <MapPin className='h-8 w-8 text-green-600' />
              Gestion des Fokontany
            </h2>
            <p className='text-gray-600'>
              Administration territoriale - Niveau local
            </p>
          </div>
          <div className='flex gap-2'>
            <Button className='cursor-pointer'>
              <Plus className='h-4 w-4 mr-2' />
              Nouveau fokontany
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <div className='flex justify-between items-center'>
                  <CardTitle>
                    Liste des Fokontany ({filteredFokontany.length})
                  </CardTitle>
                  <div className='flex items-center gap-2'>
                    <Search className='h-4 w-4 text-gray-400' />
                    <Input
                      placeholder='Rechercher un fokontany...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='w-64'
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom du fokontany</TableHead>
                      <TableHead>Commune</TableHead>
                      <TableHead>Secteurs</TableHead>
                      <TableHead>Population</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFokontany.map((fkt) => (
                      <TableRow key={fkt.id}>
                        <TableCell className='font-medium'>{fkt.nom}</TableCell>
                        <TableCell>{fkt.commune}</TableCell>
                        <TableCell>{fkt.secteurs}</TableCell>
                        <TableCell>{fkt.population.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className='flex gap-2'>
                            <Button variant='outline' size='sm'>
                              <Edit className='h-3 w-3' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleDelete(fkt.id)}
                            >
                              <Trash2 className='h-3 w-3' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
