import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MapPin,
  Globe,
  Hash,
  FileText,
  AlertCircle,
  Edit,
  Trash2,
  Copy,
  Building2,
  Search,
  X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'react-toastify';

import cidadeService from '../services/cidadeService';
import ufService from '../services/ufService';
import { Cidade, UnidadeFederativa, CreateCidadeDto, UpdateCidadeDto } from '../types';

// Componentes reutilizáveis
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import DataGrid, { Column } from '@/components/DataGrid';
import ActionMenu from '@/components/ActionMenu';

const CidadePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Cidade | null>(null);
  const [selectedUf, setSelectedUf] = useState<string>('all');
  const [formData, setFormData] = useState<CreateCidadeDto>({
    nome_cidade: '',
    id_uf: undefined,
    codigo_ibge: ''
  });

  // Queries
  const { data: dados = [], isLoading, error, refetch } = useQuery<Cidade[]>({
    queryKey: ['cidades'],
    queryFn: async () => {
      try {
        const response = await cidadeService.listar();
        return Array.isArray(response) ? response : [];
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast.error('Erro ao carregar cidades');
        return [];
      }
    },
    initialData: [],
  });

  const { data: ufs = [], isLoading: loadingUfs } = useQuery<UnidadeFederativa[]>({
    queryKey: ['ufs'],
    queryFn: async () => {
      try {
        const response = await ufService.listar();
        return Array.isArray(response) ? response : [];
      } catch (error) {
        console.error('Erro ao buscar UFs:', error);
        toast.error('Erro ao carregar UFs');
        return [];
      }
    },
    initialData: [],
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateCidadeDto) => cidadeService.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cidades'] });
      toast.success('Cidade criada com sucesso!');
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao criar cidade');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCidadeDto }) => 
      cidadeService.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cidades'] });
      toast.success('Cidade atualizada com sucesso!');
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar cidade');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => cidadeService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cidades'] });
      toast.success('Cidade excluída com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao excluir cidade');
    }
  });

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUfChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      id_uf: value ? parseInt(value) : undefined 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome_cidade) {
      toast.warning('Nome da cidade é obrigatório');
      return;
    }

    if (!formData.id_uf) {
      toast.warning('Selecione uma UF');
      return;
    }

    if (editingItem) {
      updateMutation.mutate({ 
        id: editingItem.id_cidade, 
        data: formData 
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item: Cidade) => {
    setEditingItem(item);
    setFormData({
      nome_cidade: item.nome_cidade || '',
      id_uf: item.id_uf || undefined,
      codigo_ibge: item.codigo_ibge || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta cidade?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDuplicate = (item: Cidade) => {
    setFormData({
      nome_cidade: item.nome_cidade ? `${item.nome_cidade} (cópia)` : '',
      id_uf: item.id_uf,
      codigo_ibge: item.codigo_ibge
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({
      nome_cidade: '',
      id_uf: undefined,
      codigo_ibge: ''
    });
  };

  // Filtro e estatísticas
  const dadosArray = useMemo(() => Array.isArray(dados) ? dados : [], [dados]);
  
  const filteredData = useMemo(() => {
    let filtered = dadosArray;
    
    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.nome_cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codigo_ibge?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nome_uf?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sigla_uf?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtro por UF
    if (selectedUf !== 'all') {
      filtered = filtered.filter(item => item.id_uf === parseInt(selectedUf));
    }
    
    return filtered;
  }, [dadosArray, searchTerm, selectedUf]);

  const stats = useMemo(() => ({
    total: dadosArray.length,
    totalUfs: new Set(dadosArray.map(d => d.id_uf).filter(Boolean)).size,
    comIbge: dadosArray.filter(d => d.codigo_ibge).length,
  }), [dadosArray]);

  // Colunas da grid
  const columns: Column<Cidade>[] = [
    {
      key: 'id_cidade',
      title: 'ID',
      width: '80px',
      render: (value: number) => (
        <Badge variant="outline" className="font-mono bg-blue-50">
          #{value}
        </Badge>
      )
    },
    {
      key: 'nome_cidade',
      title: 'Cidade',
      width: '250px',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{value || '—'}</span>
        </div>
      )
    },
    {
      key: 'sigla_uf',
      title: 'UF',
      width: '80px',
      render: (value: string, record: Cidade) => (
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          {value || record.nome_uf || '—'}
        </Badge>
      )
    },
    {
      key: 'codigo_ibge',
      title: 'Código IBGE',
      width: '150px',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-green-500" />
          <span className="font-mono">{value || '—'}</span>
        </div>
      )
    }
  ];

  const isLoadingMutation = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <PageHeader
        title="Cidades"
        subtitle="Gerencie as cidades e códigos IBGE"
        action={{
          label: "Nova Cidade",
          onClick: () => {
            setEditingItem(null);
            setFormData({ nome_cidade: '', id_uf: undefined, codigo_ibge: '' });
            setIsDialogOpen(true);
          }
        }}
      />

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Pesquisar por cidade, UF ou código IBGE..."
            resultCount={filteredData.length}
          />
        </div>
        
        <Select value={selectedUf} onValueChange={setSelectedUf}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrar por UF" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as UFs</SelectItem>
            {ufs
              .sort((a, b) => (a.sigla_uf || '').localeCompare(b.sigla_uf || ''))
              .map(uf => (
                <SelectItem key={uf.id_uf} value={uf.id_uf.toString()}>
                  {uf.sigla_uf} - {uf.nome_uf}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>

        {selectedUf !== 'all' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedUf('all')}
            className="gap-1"
          >
            <X className="h-4 w-4" />
            Limpar filtro
          </Button>
        )}
      </div>

      {/* Data Grid */}
      <DataGrid
        data={filteredData}
        columns={columns}
        loading={isLoading}
        error={error as Error}
        onRetry={refetch}
        emptyMessage="Nenhuma cidade cadastrada"
        rowKey="id_cidade"
        actions={(record) => (
          <ActionMenu
            disabled={isLoadingMutation}
            actions={[
              {
                label: 'Editar',
                icon: <Edit className="h-4 w-4" />,
                onClick: () => handleEdit(record)
              },
              {
                label: 'Duplicar',
                icon: <Copy className="h-4 w-4" />,
                onClick: () => handleDuplicate(record)
              },
              {
                label: 'Excluir',
                icon: <Trash2 className="h-4 w-4" />,
                onClick: () => handleDelete(record.id_cidade),
                variant: 'destructive'
              }
            ]}
          />
        )}
      />

      {/* Dialog de Cadastro/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {editingItem ? 'Editar Cidade' : 'Nova Cidade'}
            </DialogTitle>
            <DialogDescription>
              {editingItem 
                ? 'Edite as informações da cidade abaixo.'
                : 'Preencha as informações para cadastrar uma nova cidade.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!editingItem && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">ID automático</AlertTitle>
                <AlertDescription className="text-blue-600">
                  O ID será gerado automaticamente pelo sistema.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="nome_cidade" className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Nome da Cidade
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  id="nome_cidade"
                  name="nome_cidade"
                  value={formData.nome_cidade || ''}
                  onChange={handleInputChange}
                  placeholder="Ex: São Paulo"
                  maxLength={50}
                  className="font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="uf" className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Unidade Federativa
                  <span className="text-red-500">*</span>
                </label>
                <Select 
                  value={formData.id_uf?.toString() || ''} 
                  onValueChange={handleUfChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a UF" />
                  </SelectTrigger>
                  <SelectContent>
                    {ufs
                      .sort((a, b) => (a.sigla_uf || '').localeCompare(b.sigla_uf || ''))
                      .map(uf => (
                        <SelectItem key={uf.id_uf} value={uf.id_uf.toString()}>
                          {uf.sigla_uf} - {uf.nome_uf}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="codigo_ibge" className="text-sm font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  Código IBGE
                  <span className="text-xs text-muted-foreground">(opcional)</span>
                </label>
                <Input
                  id="codigo_ibge"
                  name="codigo_ibge"
                  value={formData.codigo_ibge || ''}
                  onChange={handleInputChange}
                  placeholder="Ex: 3550308"
                  maxLength={10}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Código de 7 dígitos do IBGE
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCloseDialog}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isLoadingMutation || loadingUfs}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto gap-2"
              >
                {isLoadingMutation ? (
                  <>
                    <span className="animate-spin">⚪</span>
                    Salvando...
                  </>
                ) : (
                  editingItem ? 'Atualizar' : 'Salvar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CidadePage;