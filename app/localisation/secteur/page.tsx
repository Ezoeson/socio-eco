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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Secteur = {
  id: string;
  nom: string;
  fokontanyId: string;
  fokontany: { id: string; nom: string };
};

type Fokontany = {
  id: string;
  nom: string;
};

export default function Secteurs() {
  const [secteurs, setSecteurs] = useState<Secteur[]>([]);
  const [formData, setFormData] = useState<{
    nom?: string;
    fokontanyId: string;
  }>({
    fokontanyId: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fokontanyOptions, setFokontanyOptions] = useState<Fokontany[]>([]);

  useEffect(() => {
    const fetchSecteur = async () => {
      try {
        const response = await fetch('/api/secteur');
        const data = await response.json();
        setSecteurs(data);
      } catch (error) {
        console.error('Error fetching secteur:', error);
      }
    };

    const fetchFokontanys = async () => {
      try {
        const response = await fetch('/api/fokontany');
        const data = await response.json();
        setFokontanyOptions(data);
      } catch (error) {
        console.error('Error fetching fokontanys:', error);
      }
    };

    fetchSecteur();
    fetchFokontanys();
  }, [
    setSecteurs,
    setFokontanyOptions,
    setFormData,
    setEditingId,
    isDialogOpen,
  ]);

  const filteredSecteurs = secteurs.filter((secteur) =>
    secteur?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.fokontanyId) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/secteur/${editingId}` : '/api/secteur';

    try {
      // create
      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.nom,
          fokontanyId: formData.fokontanyId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (editingId) {
            // update
            setSecteurs(
              secteurs.map((secteur) =>
                secteur.id === editingId ? { ...secteur, ...formData } : secteur
              )
            );
          } else {
            // create
            setSecteurs([...secteurs, data]);
          }
          setIsDialogOpen(false);
          setFormData({ fokontanyId: '' });
          setEditingId(null);
        });

      // update
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (secteur: Secteur) => {
    setFormData({ nom: secteur.nom, fokontanyId: secteur.fokontanyId });
    setEditingId(secteur.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce secteur ?')) return;

    fetch(`/api/secteur/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setSecteurs(secteurs.filter((secteur) => secteur.id !== id));
      })
      .catch((error) => console.error('Error deleting secteur:', error));
  };

  return (
    <Wrapper>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='text-3xl font-bold flex items-center gap-2'>
              <MapPin className='h-8 w-8 text-green-600' />
              Gestion des Secteurs
            </h2>
            <p className='text-gray-600'>
              Administration territoriale - Niveau secteur
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setFormData({ fokontanyId: '' });
                  setEditingId(null);
                }}
              >
                <Plus className='h-4 w-4 mr-2' />
                Nouveau secteur
              </Button>
            </DialogTrigger>

            <DialogContent className='max-w-md'>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Modifier un secteur' : 'Ajouter un secteur'}
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
                    Liste des Secteurs ({filteredSecteurs.length})
                  </CardTitle>
                  <div className='flex items-center gap-2'>
                    <Search className='h-4 w-4 text-gray-400' />
                    <Input
                      placeholder='Rechercher un secteur...'
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
                      <TableHead>Nom du secteur</TableHead>
                      <TableHead>Fokontany</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSecteurs.map((secteur) => (
                      <TableRow key={secteur?.id}>
                        <TableCell className='font-medium'>
                          {secteur?.nom}
                        </TableCell>
                        <TableCell>{secteur?.fokontany.nom}</TableCell>
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
