'use client';
import { Button } from '@/components/ui/button';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import Wrapper from '@/components/Wrapper';
import { Plus, Search, Edit, Trash2, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/dynamicImport/dynamic-import';

const initialDistricts = [
  {
    id: '1',
    nom: 'Antananarivo Renivohitra',
    region: 'Analamanga',
    communes: 6,
    fokontany: 192,
  },
  {
    id: '2',
    nom: 'Anjozorobe',
    region: 'Analamanga',
    communes: 17,
    fokontany: 189,
  },
  {
    id: '3',
    nom: 'Ankazobe',
    region: 'Analamanga',
    communes: 17,
    fokontany: 208,
  },
];
const regionOptions = [
  { id: '1', nom: 'Analamanga' },
  { id: '2', nom: 'Vakinankaratra' },
  { id: '3', nom: 'Itasy' },
];
interface District {
  id: string;
  nom: string;
  region: string;
  communes: number;
  fokontany: number;
}
export default function Districts() {
  const [districts, setDistricts] = useState(initialDistricts);
  const [formData, setFormData] = useState<Partial<District>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDistricts = districts.filter(
    (district) =>
      district.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      district.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de création/mise à jour
  };

  const handleEdit = (district: District) => {
    setFormData(district);
    setEditingId(district.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDistricts(districts.filter((district) => district.id !== id));
  };

  return (
    <Wrapper>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='text-3xl font-bold flex items-center gap-2'>
              <MapPin className='h-8 w-8 text-green-600' />
              Gestion des Districts
            </h2>
            <p className='text-gray-600'>
              Administration territoriale - Niveau district
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setFormData({});
                  setEditingId(null);
                }}
              >
                <Plus className='h-4 w-4 mr-2' />
                Nouveau district
              </Button>
            </DialogTrigger>

            <DialogContent className='max-w-md'>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Modifier' : 'Ajouter'} un district
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <Label>Nom du district</Label>
                  <Input
                    value={formData.nom || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Région</Label>
                  <Select
                    value={formData.region || ''}
                    onValueChange={(value) =>
                      setFormData({ ...formData, region: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Sélectionner une région' />
                    </SelectTrigger>
                    <SelectContent>
                      {regionOptions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type='submit' className='w-full'>
                  {editingId ? 'Modifier' : 'Ajouter'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <div className='flex justify-between items-center'>
                  <CardTitle>
                    Liste des Districts ({filteredDistricts.length})
                  </CardTitle>
                  <div className='flex items-center gap-2'>
                    <Search className='h-4 w-4 text-gray-400' />
                    <Input
                      placeholder='Rechercher un district...'
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
                      <TableHead>Nom du district</TableHead>
                      <TableHead>Région</TableHead>
                      <TableHead>Communes</TableHead>
                      <TableHead>Fokontany</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDistricts.map((district) => (
                      <TableRow key={district.id}>
                        <TableCell className='font-medium'>
                          {district.nom}
                        </TableCell>
                        <TableCell>{district.region}</TableCell>
                        <TableCell>{district.communes}</TableCell>
                        <TableCell>{district.fokontany}</TableCell>
                        <TableCell>
                          <div className='flex gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleEdit(district)}
                            >
                              <Edit className='h-3 w-3' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleDelete(district.id)}
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
