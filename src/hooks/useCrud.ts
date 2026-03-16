import { useState, useEffect, useCallback } from 'react';

interface CrudService<T, C, U> {
  listar: () => Promise<T[]>;
  buscarPorId: (id: number) => Promise<T>;
  criar: (data: C) => Promise<T>;
  atualizar: (id: number, data: U) => Promise<T>;
  excluir: (id: number) => Promise<{ message: string }>;
}

interface UseCrudReturn<T, C, U> {
  dados: T[];
  loading: boolean;
  error: string | null;
  listar: () => Promise<void>;
  buscarPorId: (id: number) => Promise<T | undefined>;
  criar: (data: C) => Promise<T | undefined>;
  atualizar: (id: number, data: U) => Promise<T | undefined>;
  excluir: (id: number) => Promise<void>;
}

export function useCrud<T, C, U>(service: CrudService<T, C, U>): UseCrudReturn<T, C, U> {
  const [dados, setDados] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const listar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.listar();
      setDados(result);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao listar registros');
    } finally {
      setLoading(false);
    }
  }, [service]);

  const buscarPorId = useCallback(async (id: number): Promise<T | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.buscarPorId(id);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao buscar registro');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const criar = useCallback(async (data: C): Promise<T | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.criar(data);
      await listar(); // Atualiza a lista
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar registro');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [service, listar]);

  const atualizar = useCallback(async (id: number, data: U): Promise<T | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.atualizar(id, data);
      await listar(); // Atualiza a lista
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar registro');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [service, listar]);

  const excluir = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await service.excluir(id);
      await listar(); // Atualiza a lista
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao excluir registro');
    } finally {
      setLoading(false);
    }
  }, [service, listar]);

  // Carrega dados na montagem
  useEffect(() => {
    listar();
  }, [listar]);

  return {
    dados,
    loading,
    error,
    listar,
    buscarPorId,
    criar,
    atualizar,
    excluir
  };
}