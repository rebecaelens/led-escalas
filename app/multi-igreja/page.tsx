'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

interface Igreja {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  pastor: string;
  voluntarios: number;
  escalas: number;
  ativa: boolean;
}

export default function MultiIgrejaPage() {
  const [igrejas, setIgrejas] = useState<Igreja[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [formulario, setFormulario] = useState({
    nome: '',
    cidade: '',
    estado: '',
    pastor: ''
  });

  useEffect(() => {
    carregarIgrejas();
  }, []);

  async function carregarIgrejas() {
    try {
      // Simulando dados do localStorage
      const dados = localStorage.getItem('igrejas');
      if (dados) {
        setIgrejas(JSON.parse(dados));
      } else {
        // Igrejas de exemplo
        const exemplos: Igreja[] = [
          {
            id: '1',
            nome: 'Igreja LED Maracanau',
            cidade: 'Maracanau',
            estado: 'CE',
            pastor: 'Pastor João',
            voluntarios: 25,
            escalas: 48,
            ativa: true
          },
          {
            id: '2',
            nome: 'Igreja Fortaleza',
            cidade: 'Fortaleza',
            estado: 'CE',
            pastor: 'Pastor Maria',
            voluntarios: 18,
            escalas: 36,
            ativa: true
          },
          {
            id: '3',
            nome: 'Igreja Caucaia',
            cidade: 'Caucaia',
            estado: 'CE',
            pastor: 'Pastor Pedro',
            voluntarios: 12,
            escalas: 24,
            ativa: false
          }
        ];
        setIgrejas(exemplos);
        localStorage.setItem('igrejas', JSON.stringify(exemplos));
      }
    } catch (erro) {
      console.error('Erro ao carregar igrejas:', erro);
    } finally {
      setCarregando(false);
    }
  }

  function abrirModal(igreja?: Igreja) {
    if (igreja) {
      setEditandoId(igreja.id);
      setFormulario({
        nome: igreja.nome,
        cidade: igreja.cidade,
        estado: igreja.estado,
        pastor: igreja.pastor
      });
    } else {
      setEditandoId(null);
      setFormulario({ nome: '', cidade: '', estado: '', pastor: '' });
    }
    setModalAberto(true);
  }

  function salvarIgreja() {
    if (!formulario.nome || !formulario.cidade) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    let novasIgrejas;
    if (editandoId) {
      novasIgrejas = igrejas.map(i =>
        i.id === editandoId ? { ...i, ...formulario } : i
      );
    } else {
      novasIgrejas = [
        ...igrejas,
        {
          id: Date.now().toString(),
          ...formulario,
          voluntarios: 0,
          escalas: 0,
          ativa: true
        }
      ];
    }
    setIgrejas(novasIgrejas);
    localStorage.setItem('igrejas', JSON.stringify(novasIgrejas));
    setModalAberto(false);
    alert(editandoId ? 'Igreja atualizada!' : 'Igreja criada!');
  }

  function deletarIgreja(id: string) {
    if (!confirm('Tem certeza?')) return;
    const novasIgrejas = igrejas.filter(i => i.id !== id);
    setIgrejas(novasIgrejas);
    localStorage.setItem('igrejas', JSON.stringify(novasIgrejas));
    alert('Igreja deletada!');
  }

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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Building2 className="text-orange-400" size={32} />
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Múltiplas Igrejas
              </h1>
            </div>
            <button
              onClick={() => abrirModal()}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Nova Igreja</span>
            </button>
          </div>

          {/* Modal */}
          {modalAberto && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8 w-full max-w-md">
                <h2 className="text-xl font-bold text-white mb-6">
                  {editandoId ? 'Editar Igreja' : 'Nova Igreja'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Nome da Igreja *</label>
                    <input
                      type="text"
                      placeholder="Nome da Igreja"
                      value={formulario.nome}
                      onChange={(e) => setFormulario({ ...formulario, nome: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Cidade *</label>
                      <input
                        type="text"
                        placeholder="Cidade"
                        value={formulario.cidade}
                        onChange={(e) => setFormulario({ ...formulario, cidade: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Estado</label>
                      <input
                        type="text"
                        placeholder="CE"
                        maxLength={2}
                        value={formulario.estado}
                        onChange={(e) => setFormulario({ ...formulario, estado: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Pastor/Líder</label>
                    <input
                      type="text"
                      placeholder="Nome do Pastor"
                      value={formulario.pastor}
                      onChange={(e) => setFormulario({ ...formulario, pastor: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setModalAberto(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={salvarIgreja}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid de Igrejas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {igrejas.map((igreja) => (
              <div
                key={igreja.id}
                className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:border-orange-400/50 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{igreja.nome}</h3>
                    <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                      <MapPin size={16} />
                      {igreja.cidade}, {igreja.estado}
                    </div>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    igreja.ativa
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-gray-500/20 text-gray-300'
                  }`}>
                    {igreja.ativa ? '✓ Ativa' : '✕ Inativa'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 py-4 border-y border-white/10">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cyan-400">{igreja.voluntarios}</p>
                    <p className="text-xs text-gray-400">Voluntários</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{igreja.escalas}</p>
                    <p className="text-xs text-gray-400">Escalas</p>
                  </div>
                </div>

                {igreja.pastor && (
                  <p className="text-sm text-gray-400 mb-4">
                    👤 <span className="text-white">{igreja.pastor}</span>
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => abrirModal(igreja)}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-blue-500/20 text-blue-400 font-semibold transition flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    <span className="hidden sm:inline">Editar</span>
                  </button>
                  <button
                    onClick={() => deletarIgreja(igreja.id)}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-red-400 font-semibold transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Deletar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="mt-8 p-4 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-300 text-sm">
            <p className="font-semibold mb-2">💡 Dica:</p>
            <p>Gerencie múltiplas igrejas/comunidades em um único sistema. Cada uma terá seu próprio calendário e voluntários.</p>
          </div>
        </div>
      </div>
    </>
  );
}
