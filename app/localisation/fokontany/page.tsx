'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Wrapper from '@/components/Wrapper';
import { Plus, Search, Edit, Trash2, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Fokontany = {
  id: string;
  nom: string;
  communeId: string;
  commune: { id: string; nom: string };
};

type Commune = {
  id: string;
  nom: string;
};

export default function Fokontanys() {
  const [fokontanys, setFokontanys] = useState<Fokontany[]>([]);
  const [formData, setFormData] = useState<{
    nom?: string;
    communeId: string;
  }>({
    communeId: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [communeOptions, setCommuneOptions] = useState<Commune[]>([]);

  useEffect(() => {
    const fetchFokontany = async () => {
      try {
        const response = await fetch('/api/fokontany');
        const data = await response.json();
        setFokontanys(data);
      } catch (error) {
        console.error('Error fetching fokontany:', error);
      }
    };

    const fetchCommunes = async () => {
      try {
        const response = await fetch('/api/commune');
        const data = await response.json();
        setCommuneOptions(data);
      } catch (error) {
        console.error('Error fetching communes:', error);
      }
    };

    fetchFokontany();
    fetchCommunes();
  }, [
    setFokontanys,
    setCommuneOptions,
    setFormData,
    setEditingId,
    isDialogOpen,
  ]);

  const filteredFokontanys = fokontanys.filter((fokontany) =>
    fokontany?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.communeId) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/fokontany/${editingId}` : '/api/fokontany';

    try {
      // create
      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.nom,
          communeId: formData.communeId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (editingId) {
            // update
            setFokontanys(
              fokontanys.map((fokontany) =>
                fokontany.id === editingId
                  ? { ...fokontany, ...formData }
                  : fokontany
              )
            );
          } else {
            // create
            setFokontanys([...fokontanys, data]);
          }
          setIsDialogOpen(false);
          setFormData({ communeId: '' });
          setEditingId(null);
        });

      // update
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (fokontany: Fokontany) => {
    setFormData({ nom: fokontany.nom, communeId: fokontany.communeId });
    setEditingId(fokontany.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce fokontany ?')) return;

    fetch(`/api/fokontany/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setFokontanys(fokontanys.filter((fokontany) => fokontany.id !== id));
      })
      .catch((error) => console.error('Error deleting fokontany:', error));
  };

  return (
    <Wrapper>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='text-3xl font-bold flex items-center gap-2'>
              <MapPin className='h-8 w-8 text-green-600' />
              Gestion des Fokontanys
            </h2>
            <p className='text-gray-600'>
              Administration territoriale - Niveau fokontany
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setFormData({ communeId: '' });
                  setEditingId(null);
                }}
              >
                <Plus className='h-4 w-4 mr-2' />
                Nouveau fokontany
              </Button>
            </DialogTrigger>

            <DialogContent className='max-w-md'>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Modifier un fokontany' : 'Ajouter un fokontany'}
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
                  <Select
                    value={formData.communeId || ''}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, communeId: value }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Sélectionner un commune' />
                    </SelectTrigger>
                    <SelectContent>
                      {communeOptions.map((commune) => (
                        <SelectItem key={commune.id} value={commune.id}>
                          {commune.nom}
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
                    Liste des Fokontanys ({filteredFokontanys.length})
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFokontanys.map((fokontany) => (
                      <TableRow key={fokontany?.id}>
                        <TableCell className='font-medium'>
                          {fokontany?.nom}
                        </TableCell>
                        <TableCell>{fokontany?.commune.nom}</TableCell>
                        <TableCell>
                          <div className='flex gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleEdit(fokontany)}
                            >
                              <Edit className='h-3 w-3' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleDelete(fokontany.id)}
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
