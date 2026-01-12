'use client';

import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

interface Notificacao {
  id: string;
  tipo: 'sucesso' | 'erro' | 'info' | 'aviso';
  titulo: string;
  mensagem: string;
  criada_em: string;
  lida: boolean;
}

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [toastMensagem, setToastMensagem] = useState('');
  const [filtro, setFiltro] = useState<'todas' | 'nao-lidas'>('todas');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarNotificacoes();
    // Atualizar a cada 5 segundos
    const interval = setInterval(carregarNotificacoes, 5000);
    return () => clearInterval(interval);
  }, []);

  async function carregarNotificacoes() {
    try {
      const res = await fetch('/api/notificacoes');
      if (res.ok) {
        const data = await res.json();
        setNotificacoes(data.notificacoes || []);
      }
    } catch (erro) {
      console.error('Erro ao carregar notificações:', erro);
    } finally {
      setCarregando(false);
    }
  }

  function marcarComoLida(id: string) {
    fetch('/api/notificacoes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, lida: true })
    }).then(() => carregarNotificacoes());
  }

  function deletarNotificacao(id: string) {
    fetch(`/api/notificacoes?id=${id}`, { method: 'DELETE' })
      .then(() => carregarNotificacoes())
      .then(() => mostrarMensagem('Notificação removida'));
    mostrarMensagem('Notificação removida');
  }

  function deletarTodas() {
    if (confirm('Tem certeza que deseja deletar TODAS as notificações do banco de dados?')) {
      fetch('/api/notificacoes', { method: 'DELETE' })
        .then(() => carregarNotificacoes())
        .then(() => mostrarMensagem('Todas as notificações foram removidas'));
    }
  }

  function marcarTodasComoLidas() {
    Promise.all(notificacoes.map(n =>
      fetch('/api/notificacoes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: n.id, lida: true })
      })
    )).then(() => carregarNotificacoes())
      .then(() => mostrarMensagem('Todas as notificações marcadas como lidas'));
  }

  function mostrarMensagem(msg: string) {
    setToastMensagem(msg);
    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 3000);
  }

  const notificacoesFiltradas = filtro === 'nao-lidas'
    ? notificacoes.filter(n => !n.lida)
    : notificacoes;

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  const obterIcone = (tipo: string) => {
    switch (tipo) {
      case 'sucesso':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'erro':
        return <AlertCircle className="text-red-400" size={20} />;
      case 'aviso':
        return <AlertCircle className="text-yellow-400" size={20} />;
      default:
        return <Info className="text-blue-400" size={20} />;
    }
  };

  const obterCor = (tipo: string) => {
    switch (tipo) {
      case 'sucesso':
        return 'border-green-500/30 bg-green-500/10';
      case 'erro':
        return 'border-red-500/30 bg-red-500/10';
      case 'aviso':
        return 'border-yellow-500/30 bg-yellow-500/10';
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Bell className="text-cyan-400" size={32} />
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Notificações
              </h1>
              {naoLidas > 0 && (
                <span className="inline-block px-3 py-1 rounded-full bg-red-500 text-white text-sm font-semibold">
                  {naoLidas}
                </span>
              )}
            </div>
          </div>

  if (carregando) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
          <p className="text-white text-lg">Carregando notificações...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-6">
          {/* Toast */}
          {mostrarToast && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 flex items-center gap-2 animate-pulse">
              <CheckCircle size={20} />
              {toastMensagem}
            </div>
          )}

          {/* Filtros e Ações */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setFiltro('todas')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filtro === 'todas'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
                }`}
              >
                Todas ({notificacoes.length})
              </button>
              <button
                onClick={() => setFiltro('nao-lidas')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filtro === 'nao-lidas'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
                }`}
              >
                Não Lidas ({naoLidas})
              </button>
            </div>

            <div className="flex gap-2 ml-auto">
              {naoLidas > 0 && (
                <button
                  onClick={marcarTodasComoLidas}
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20 transition text-sm"
                >
                  Marcar todas como lidas
                </button>
              )}
              {notificacoes.length > 0 && (
                <button
                  onClick={deletarTodas}
                  className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30 transition text-sm"
                >
                  Limpar tudo
                </button>
              )}
            </div>
          </div>

          {/* Lista de Notificações */}
          <div className="space-y-3">
            {notificacoesFiltradas.length > 0 ? (
              notificacoesFiltradas
                .sort((a, b) => b.data.getTime() - a.data.getTime())
                .map((notif) => (
                  <div
                    key={notif.id}
                    className={`backdrop-blur-lg border rounded-xl p-4 sm:p-5 flex items-start gap-4 transition ${
                      obterCor(notif.tipo)
                    } ${!notif.lida ? 'ring-2 ring-cyan-400/50' : ''}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {obterIcone(notif.tipo)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white">{notif.titulo}</h3>
                      <p className="text-gray-300 text-sm mt-1">{notif.mensagem}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notif.criada_em).toLocaleString('pt-BR')}
                      </p>
                    </div>
                .sort((a, b) => new Date(b.criada_em).getTime() - new Date(a.criada_em).getTime())

                    <div className="flex gap-2 flex-shrink-0">
                      {!notif.lida && (
                        <button
                          onClick={() => marcarComoLida(notif.id)}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition"
                          title="Marcar como lida"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => deletarNotificacao(notif.id)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition"
                        title="Deletar"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-12">
                <Bell className="text-gray-500 mx-auto mb-4" size={48} />
                <p className="text-gray-400 text-lg">
                  {filtro === 'nao-lidas' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
                </p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 p-4 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-300 text-sm">
            <p className="font-semibold mb-2">💡 Dica:</p>
            <p>As notificações serão exibidas quando: voluntários são adicionados, escalas são criadas, ou há mudanças importantes no sistema.</p>
          </div>
        </div>
      </div>
    </>
  );
}
