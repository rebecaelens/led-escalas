'use client';

import { useState, useEffect } from 'react';
import { Clock, Filter, DownloadCloud } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

interface AuditoriaLog {
  id: string;
  acao: string;
  usuario?: string;
  descricao: string;
  data: Date;
  tipo: 'criacao' | 'atualizacao' | 'delecao' | 'outro';
  entidade: string;
  entidadeId?: string;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditoriaLog[]>([]);
  const [filtro, setFiltro] = useState<'todas' | 'criacao' | 'atualizacao' | 'delecao'>('todas');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarLogs();
  }, []);

  async function carregarLogs() {
    try {
      // Simulando dados de auditoria do localStorage
      const auditoria = localStorage.getItem('auditoria') || '[]';
      const dados = JSON.parse(auditoria).map((log: any) => ({
        ...log,
        data: new Date(log.data)
      }));

      // Se não tiver dados, criar exemplos
      if (dados.length === 0) {
        const exemplos: AuditoriaLog[] = [
          {
            id: '1',
            acao: 'Escala Criada',
            usuario: 'Sistema',
            descricao: 'Nova escala para janeiro/2026 foi criada automaticamente',
            data: new Date(Date.now() - 86400000),
            tipo: 'criacao',
            entidade: 'Escala',
            entidadeId: 'esc_001'
          },
          {
            id: '2',
            acao: 'Voluntário Adicionado',
            usuario: 'Admin',
            descricao: 'João Silva foi adicionado ao calendário de 15/01/2026',
            data: new Date(Date.now() - 172800000),
            tipo: 'atualizacao',
            entidade: 'Escala',
            entidadeId: 'esc_002'
          },
          {
            id: '3',
            acao: 'Voluntário Criado',
            usuario: 'Admin',
            descricao: 'Novo voluntário registrado: Maria Santos',
            data: new Date(Date.now() - 259200000),
            tipo: 'criacao',
            entidade: 'Voluntário',
            entidadeId: 'vol_001'
          },
          {
            id: '4',
            acao: 'Voluntário Deletado',
            usuario: 'Admin',
            descricao: 'Voluntário removido: Pedro Costa',
            data: new Date(Date.now() - 345600000),
            tipo: 'delecao',
            entidade: 'Voluntário',
            entidadeId: 'vol_002'
          },
          {
            id: '5',
            acao: 'Escala Modificada',
            usuario: 'Sistema',
            descricao: 'Alteração em voluntário da escala de 20/01/2026',
            data: new Date(Date.now() - 432000000),
            tipo: 'atualizacao',
            entidade: 'Escala',
            entidadeId: 'esc_003'
          }
        ];
        setLogs(exemplos);
        localStorage.setItem('auditoria', JSON.stringify(exemplos));
      } else {
        setLogs(dados);
      }
    } catch (erro) {
      console.error('Erro ao carregar logs:', erro);
    } finally {
      setCarregando(false);
    }
  }

  function exportarCSV() {
    const csv = [
      ['Data', 'Tipo', 'Ação', 'Entidade', 'Descrição', 'Usuário'],
      ...logsFiltrados.map(log => [
        log.data.toLocaleString('pt-BR'),
        log.tipo,
        log.acao,
        log.entidade,
        log.descricao,
        log.usuario || '-'
      ])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  function obterCor(tipo: string) {
    switch (tipo) {
      case 'criacao':
        return 'bg-green-500/10 border-green-500/30 text-green-300';
      case 'atualizacao':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-300';
      case 'delecao':
        return 'bg-red-500/10 border-red-500/30 text-red-300';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-300';
    }
  }

  function obterEmoji(tipo: string) {
    switch (tipo) {
      case 'criacao':
        return '➕';
      case 'atualizacao':
        return '✏️';
      case 'delecao':
        return '🗑️';
      default:
        return '📝';
    }
  }

  const logsFiltrados = filtro === 'todas'
    ? logs
    : logs.filter(log => log.tipo === filtro);

  if (carregando) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
          <p className="text-white">Carregando...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Clock className="text-cyan-400" size={32} />
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Auditoria e Histórico
              </h1>
            </div>
            <button
              onClick={exportarCSV}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition"
            >
              <DownloadCloud size={20} />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(['todas', 'criacao', 'atualizacao', 'delecao'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                  filtro === f
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
                }`}
              >
                {f === 'todas' ? `Todas (${logs.length})` : 
                 f === 'criacao' ? `Criações (${logs.filter(l => l.tipo === 'criacao').length})` :
                 f === 'atualizacao' ? `Atualizações (${logs.filter(l => l.tipo === 'atualizacao').length})` :
                 `Deleções (${logs.filter(l => l.tipo === 'delecao').length})`}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {logsFiltrados.length > 0 ? (
              logsFiltrados
                .sort((a, b) => b.data.getTime() - a.data.getTime())
                .map((log, index) => (
                  <div
                    key={log.id}
                    className={`backdrop-blur-lg border rounded-xl p-4 sm:p-5 ${obterCor(log.tipo)}`}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 text-2xl">{obterEmoji(log.tipo)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-white">{log.acao}</h3>
                            <p className="text-sm mt-1 opacity-80">{log.descricao}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs opacity-70">
                              <span>📦 {log.entidade}</span>
                              {log.usuario && <span>👤 {log.usuario}</span>}
                              <span>🕐 {log.data.toLocaleString('pt-BR')}</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">
                              #{log.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-12">
                <Clock className="text-gray-500 mx-auto mb-4" size={48} />
                <p className="text-gray-400">Nenhum log encontrado</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 p-4 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-300 text-sm">
            <p className="font-semibold mb-2">💡 Dica:</p>
            <p>O histórico de auditoria rastreia todas as alterações no sistema, incluindo criação, modificação e deleção de voluntários e escalas.</p>
          </div>
        </div>
      </div>
    </>
  );
}
