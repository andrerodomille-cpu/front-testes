import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Hash,
  Tag,
  FileText,
  AlertCircle,
  Edit,
  Trash2,
  Copy,
  Eye
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
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'react-toastify';

import numeroCasService from '../services/numeroCasService';
import { NumeroCas, CreateNumeroCasDto, UpdateNumeroCasDto } from '../types';

// Componentes reutilizáveis
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import DataGrid, { Column } from '@/components/DataGrid';
import ActionMenu from '@/components/ActionMenu';

const NumeroCasPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NumeroCas | null>(null);
  const [formData, setFormData] = useState<CreateNumeroCasDto>({
    numero_cas: '',
    descricao_numero_cas: ''
  });

  // Query para buscar dados
  const { data: dados = [], isLoading, error, refetch } = useQuery<NumeroCas[]>({
    queryKey: ['numeroCas'],
    queryFn: async () => {
      try {
        const response = await numeroCasService.listar();
        return Array.isArray(response) ? response : [];
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast.error('Erro ao carregar números CAS');
        return [];
      }
    },
    initialData: [],
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateNumeroCasDto) => numeroCasService.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numeroCas'] });
      toast.success('Número CAS criado com sucesso!');
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao criar número CAS');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNumeroCasDto }) => 
      numeroCasService.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numeroCas'] });
      toast.success('Número CAS atualizado com sucesso!');
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar número CAS');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => numeroCasService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numeroCas'] });
      toast.success('Número CAS excluído com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao excluir número CAS');
    }
  });

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      updateMutation.mutate({ 
        id: editingItem.id_numero_cas, 
        data: formData 
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item: NumeroCas) => {
    setEditingItem(item);
    setFormData({
      numero_cas: item.numero_cas || '',
      descricao_numero_cas: item.descricao_numero_cas || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleView = (item: NumeroCas) => {
    toast.info(`Visualizando: ${item.numero_cas || 'Sem número'}`);
    // Implementar visualização detalhada se necessário
  };

  const handleDuplicate = (item: NumeroCas) => {
    setFormData({
      numero_cas: item.numero_cas ? `${item.numero_cas} (cópia)` : '',
      descricao_numero_cas: item.descricao_numero_cas
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({
      numero_cas: '',
      descricao_numero_cas: ''
    });
  };

  // Filtro e estatísticas
  const dadosArray = useMemo(() => Array.isArray(dados) ? dados : [], [dados]);
  
  const filteredData = useMemo(() => 
    dadosArray.filter(item => 
      item.numero_cas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao_numero_cas?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [dadosArray, searchTerm]
  );

  const stats = useMemo(() => ({
    total: dadosArray.length,
    comDescricao: dadosArray.filter(d => d.descricao_numero_cas).length,
    semDescricao: dadosArray.filter(d => !d.descricao_numero_cas).length,
  }), [dadosArray]);

  // Colunas da grid
  const columns: Column<NumeroCas>[] = [
    {
      key: 'id_numero_cas',
      title: 'ID',
      width: '100px',
      render: (value: number) => (
        <Badge variant="outline" className="font-mono bg-blue-50">
          #{value}
        </Badge>
      )
    },
    {
      key: 'numero_cas',
      title: 'Número CAS',
      width: '200px',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-blue-500" />
          <span className="font-mono font-medium">{value || '—'}</span>
        </div>
      )
    },
    {
      key: 'descricao_numero_cas',
      title: 'Descrição',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-green-500" />
          <span className="line-clamp-1">
            {value || <span className="text-muted-foreground italic">Sem descrição</span>}
          </span>
        </div>
      )
    }
  ];

  const isLoadingMutation = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <PageHeader
        title="Números CAS"
        subtitle="Gerencie os números CAS do sistema"
        action={{
          label: "Novo Número CAS",
          onClick: () => {
            setEditingItem(null);
            setFormData({ numero_cas: '', descricao_numero_cas: '' });
            setIsDialogOpen(true);
          }
        }}
      />

      {/* Search Bar */}
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Pesquisar por número ou descrição..."
        resultCount={filteredData.length}
      />

      {/* Data Grid */}
      <DataGrid
        data={filteredData}
        columns={columns}
        loading={isLoading}
        error={error as Error}
        onRetry={refetch}
        emptyMessage="Nenhum número CAS cadastrado"
        rowKey="id_numero_cas"
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
                onClick: () => handleDelete(record.id_numero_cas),
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
            <DialogTitle className="text-2xl font-bold bg-blue-600 bg-clip-text text-transparent">
              {editingItem ? 'Editar Número CAS' : 'Novo Número CAS'}
            </DialogTitle>
            <DialogDescription>
              {editingItem 
                ? 'Edite as informações do número CAS abaixo.'
                : 'Preencha as informações para criar um novo número CAS.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="numero_cas" className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  Número CAS
                </label>
                <Input
                  id="numero_cas"
                  name="numero_cas"
                  value={formData.numero_cas || ''}
                  onChange={handleInputChange}
                  placeholder="Informe o Número CAS"
                  maxLength={15}
                  className="font-mono"
                />
                
              </div>

              <div className="space-y-2">
                <label htmlFor="descricao_numero_cas" className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Descrição
                  <span className="text-xs text-muted-foreground">(opcional)</span>
                </label>
                <Input
                  id="descricao_numero_cas"
                  name="descricao_numero_cas"
                  value={formData.descricao_numero_cas || ''}
                  onChange={handleInputChange}
                  placeholder="Informe a descrição do Número CAS"
                  maxLength={100}
                />
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
                disabled={isLoadingMutation}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto gap-2"
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

export default NumeroCasPage;