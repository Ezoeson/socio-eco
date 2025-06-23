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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/dynamicImport/dynamic-import';
import Wrapper from '@/components/Wrapper';

import { Plus, Search, Edit, Trash2, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface Region {
  id: string;
  nom: string;
  districts: number;
  communes: number;
  fokontany: number;
}

export default function Region() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<Partial<Region>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  useEffect(() => {
    const fetchRegion = async () => {
      try {
        const response = await fetch('/api/region');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des régions');
        }
        const data = await response.json();
        setRegions(data);
        console.log(data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };
    fetchRegion();
  }, [isDialogOpen, isDeleteModal]);

  const filteredRegions = regions?.filter((region) =>
    region?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom) return;
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/region/${editingId}` : '/api/region';
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nom: formData.nom }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la sauvegarde de la région');
        }
        return response.json();
      })
      .then((data) => {
        if (editingId) {
          setRegions((prev) =>
            prev.map((region) =>
              region.id === editingId ? { ...region, nom: data.nom } : region
            )
          );
        } else {
          setRegions((prev) => [...prev, { ...data, id: data.id }]);
        }
        setFormData({});
        setEditingId(null);
        setIsDialogOpen(false);
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
  };

  const handleEdit = (region: Region) => {
    setFormData(region);
    setEditingId(region.id);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    fetch(`/api/region/${deletingId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de la région');
        }
        return response.json();
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
    toast('suppression reussi');
    setIsDialogOpen(false);
  };

  return (
    <Wrapper>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='text-3xl font-bold  flex items-center gap-2'>
              <MapPin className='h-8 w-8 text-green-600' />
              Gestion des Régions
            </h2>
            <p className='text-gray-600'>
              Administration territoriale - Niveau régional
            </p>
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
                Ajouter région
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-md'>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Modifier' : 'Ajouter'} une region
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <Label>Nom de la région</Label>
                  <Input
                    value={formData.nom || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                    required
                  />
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
                    Liste des Régions ({filteredRegions.length})
                  </CardTitle>
                  <div className='flex items-center gap-2'>
                    <Search className='h-4 w-4 text-gray-400' />
                    <Input
                      placeholder='Rechercher une région...'
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
                      <TableHead>Nom de la région</TableHead>
                      <TableHead>Districts</TableHead>
                      <TableHead>Communes</TableHead>
                      <TableHead>Fokontany</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegions?.map((region) => (
                      <TableRow key={region.id}>
                        <TableCell className='font-medium'>
                          {region.nom}
                        </TableCell>
                        <TableCell>{region.districts}</TableCell>
                        <TableCell>{region.communes}</TableCell>
                        <TableCell>{region.fokontany}</TableCell>
                        <TableCell>
                          <div className='flex gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleEdit(region)}
                            >
                              <Edit className='h-3 w-3' />
                            </Button>
                            <AlertDialog
                              open={isDeleteModal}
                              onOpenChange={setIsDeleteModal}
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => {
                                    setDeletingId(region.id);
                                    setIsDeleteModal(true);
                                  }}
                                >
                                  <Trash2 className='h-3 w-3' />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Voulez-vous supprimer?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your account and remove
                                    your data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete()}
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
