'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/dynamicImport/dynamic-import';
import Wrapper from '@/components/Wrapper';
import { Plus, Search, Edit, Trash2, MapPin } from 'lucide-react';
import { useState } from 'react';

const initialCommunes = [
  {
    id: '1',
    nom: 'Antananarivo I',
    district: 'Antananarivo Renivohitra',
    fokontany: 32,
  },
  {
    id: '2',
    nom: 'Antananarivo II',
    district: 'Antananarivo Renivohitra',
    fokontany: 27,
  },
  {
    id: '3',
    nom: 'Antananarivo III',
    district: 'Antananarivo Renivohitra',
    fokontany: 33,
  },
];

export default function Communes() {
  const [communes, setCommunes] = useState(initialCommunes);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCommunes = communes.filter(
    (commune) =>
      commune.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commune.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setCommunes(communes.filter((commune) => commune.id !== id));
  };

  return (
    <Wrapper>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='text-3xl font-bold flex items-center gap-2'>
              <MapPin className='h-8 w-8 text-green-600' />
              Gestion des Communes
            </h2>
            <p className='text-gray-600'>
              Administration territoriale - Niveau communal
            </p>
          </div>
          <div className='flex gap-2'>
            <Button className='cursor-pointer'>
              <Plus className='h-4 w-4 mr-2' />
              Nouvelle commune
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <div className='flex justify-between items-center'>
                  <CardTitle>
                    Liste des Communes ({filteredCommunes.length})
                  </CardTitle>
                  <div className='flex items-center gap-2'>
                    <Search className='h-4 w-4 text-gray-400' />
                    <Input
                      placeholder='Rechercher une commune...'
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
                      <TableHead>Nom de la commune</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Fokontany</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCommunes.map((commune) => (
                      <TableRow key={commune.id}>
                        <TableCell className='font-medium'>
                          {commune.nom}
                        </TableCell>
                        <TableCell>{commune.district}</TableCell>
                        <TableCell>{commune.fokontany}</TableCell>
                        <TableCell>
                          <div className='flex gap-2'>
                            <Button variant='outline' size='sm'>
                              <Edit className='h-3 w-3' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleDelete(commune.id)}
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
