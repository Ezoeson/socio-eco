'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Wrapper from '@/components/Wrapper';
import { Plus, Edit, Trash2, Search, MapPin } from 'lucide-react';
import { useState } from 'react';

interface Secteur {
  id: string;
  nom: string;
  fokontanyId: string;
  fokontanyNom: string;
}

// Données fictives pour les fokontany
const fokontanyOptions = [
  { id: '1', nom: '67 Ha' },
  { id: '2', nom: 'Analakely' },
  { id: '3', nom: 'Tsaralalana' },
];

const mockData: Secteur[] = [
  {
    id: '1',
    nom: 'Secteur Nord',
    fokontanyId: '1',
    fokontanyNom: '67 Ha',
  },
];

export default function Secteurs() {
  const [secteurs, setSecteurs] = useState<Secteur[]>(mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Secteur>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredSecteurs = secteurs.filter(
    (secteur) =>
      secteur.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      secteur.fokontanyNom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nom || !formData.fokontanyId) return;

    const selectedFokontany = fokontanyOptions.find(
      (f) => f.id === formData.fokontanyId
    );

    if (editingId) {
      setSecteurs((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                nom: formData.nom || '',
                fokontanyId: formData.fokontanyId || '',
                fokontanyNom: selectedFokontany?.nom || '',
              }
            : s
        )
      );
    } else {
      const newSecteur: Secteur = {
        id: Date.now().toString(),
        nom: formData.nom || '',
        fokontanyId: formData.fokontanyId || '',
        fokontanyNom: selectedFokontany?.nom || '',
      };
      setSecteurs((prev) => [...prev, newSecteur]);
    }

    setFormData({});
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (secteur: Secteur) => {
    setFormData({
      nom: secteur.nom,
      fokontanyId: secteur.fokontanyId,
    });
    setEditingId(secteur.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSecteurs((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <Wrapper>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='text-3xl font-bold flex items-center gap-2'>
              <MapPin className='h-8 w-8 text-green-600' />
              Secteurs
            </h2>
            <p className='text-gray-600'>Gestion des secteurs</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className='cursor-pointer'
                onClick={() => {
                  setFormData({});
                  setEditingId(null);
                }}
              >
                <Plus className='h-4 w-4 mr-2' />
                Ajouter secteur
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-md'>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Modifier' : 'Ajouter'} un secteur
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <Label htmlFor='nom'>Nom du secteur</Label>
                  <Input
                    id='nom'
                    value={formData.nom || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nom: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Fokontany</Label>
                  <Select
                    value={formData.fokontanyId || ''}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, fokontanyId: value }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Sélectionner un fokontany' />
                    </SelectTrigger>
                    <SelectContent>
                      {fokontanyOptions.map((fokontany) => (
                        <SelectItem key={fokontany.id} value={fokontany.id}>
                          {fokontany.nom}
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
                    Liste des secteurs ({filteredSecteurs.length})
                  </CardTitle>
                  <div className='flex items-center gap-2'>
                    <Search className='h-4 w-4 text-gray-400' />
                    <Input
                      placeholder='Rechercher...'
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
                      <TableHead>Secteur</TableHead>
                      <TableHead>Fokontany</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSecteurs.map((secteur) => (
                      <TableRow key={secteur.id}>
                        <TableCell className='font-medium'>
                          {secteur.nom}
                        </TableCell>
                        <TableCell>{secteur.fokontanyNom}</TableCell>
                        <TableCell>
                          <div className='flex gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleEdit(secteur)}
                            >
                              <Edit className='h-3 w-3' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleDelete(secteur.id)}
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
