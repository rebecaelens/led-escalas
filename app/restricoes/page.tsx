'use client';

import { useState, useEffect } from 'react';
import { Restricao } from '@/lib/types';
import { Ban, Plus, Trash2, Edit2, Calendar } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function RestricoesPaginaPage() {
  const [restricoes, setRestricoes] = useState<Restricao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [senhaModal, setSenhaModal] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const [formulario, setFormulario] = useState({
    voluntario_id: '',
    data_inicio: '',
    data_fim: '',
    motivo: '',
    tipo: 'indisponivel' as 'indisponivel' | 'feriado'
  });

  const SENHA_ADMIN = 'cn@maracanau26';

  useEffect(() => {
    carregarRestricoes();
  }, []);

  async function carregarRestricoes() {
    try {
      const res = await fetch('/api/restricoes');
      if (res.ok) {
        const data = await res.json();
        setRestricoes(data.restricoes || []);
      }
    } catch (erro) {
      console.error('Erro ao carregar restrições:', erro);
    } finally {
      setCarregando(false);
    }
  }

  function verificarSenha() {
    if (senhaModal === SENHA_ADMIN) {
      setModoEdicao(true);
      setSenhaModal('');
    } else {
      alert('Senha incorreta!');
    }
  }

  function abrirModal(restricao?: Restricao) {
    if (restricao) {
      setEditandoId(restricao.id);
      setFormulario({
        voluntario_id: restricao.voluntario_id,
        data_inicio: restricao.data_inicio,
        data_fim: restricao.data_fim,
        motivo: restricao.motivo,
        tipo: restricao.tipo
      });
    } else {
      setEditandoId(null);
      setFormulario({
        voluntario_id: '',
        data_inicio: '',
        data_fim: '',
        motivo: '',
        tipo: 'indisponivel'
      });
    }
    setModalAberto(true);
  }

  async function salvarRestricao() {
    if (!formulario.voluntario_id || !formulario.data_inicio) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const metodo = editandoId ? 'PATCH' : 'POST';
      const url = editandoId ? `/api/restricoes/${editandoId}` : '/api/restricoes';

      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario)
      });

      if (res.ok) {
        alert(editandoId ? 'Restrição atualizada!' : 'Restrição criada!');
        setModalAberto(false);
        carregarRestricoes();
      } else {
        alert('Erro ao salvar restrição');
      }
    } catch (erro) {
      console.error('Erro:', erro);
      alert('Erro ao salvar');
    }
  }

  async function deletarRestricao(id: string) {
    if (!confirm('Tem certeza?')) return;

    try {
      const res = await fetch(`/api/restricoes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Restrição deletada!');
        carregarRestricoes();
      }
    } catch (erro) {
      console.error('Erro:', erro);
    }
  }

  if (!modoEdicao) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-6 flex items-center justify-center">
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8 w-full max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <Ban className="text-red-400" size={28} />
              <h1 className="text-2xl font-bold text-white">Acesso Restrito</h1>
            </div>

            <p className="text-gray-300 mb-6">Digite a senha para gerenciar restrições:</p>

            <input
              type="password"
              placeholder="Senha"
              value={senhaModal}
              onChange={(e) => setSenhaModal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && verificarSenha()}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 mb-4"
            />

            <button
              onClick={verificarSenha}
              className="w-full px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
            >
              Entrar
            </button>
          </div>
        </div>
      </>
    );
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
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Ban className="text-red-400" size={32} />
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Gerenciar Restrições
              </h1>
            </div>
            <button
              onClick={() => abrirModal()}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Nova Restrição</span>
            </button>
          </div>

          {/* Modal */}
          {modalAberto && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8 w-full max-w-md">
                <h2 className="text-xl font-bold text-white mb-6">
                  {editandoId ? 'Editar Restrição' : 'Nova Restrição'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Voluntário *</label>
                    <input
                      type="text"
                      placeholder="ID do voluntário"
                      value={formulario.voluntario_id}
                      onChange={(e) => setFormulario({ ...formulario, voluntario_id: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Data Início *</label>
                    <input
                      type="date"
                      value={formulario.data_inicio}
                      onChange={(e) => setFormulario({ ...formulario, data_inicio: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Data Fim</label>
                    <input
                      type="date"
                      value={formulario.data_fim}
                      onChange={(e) => setFormulario({ ...formulario, data_fim: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Tipo</label>
                    <select
                      value={formulario.tipo}
                      onChange={(e) => setFormulario({ ...formulario, tipo: e.target.value as any })}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="indisponivel">Indisponível</option>
                      <option value="feriado">Feriado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Motivo</label>
                    <input
                      type="text"
                      placeholder="Ex: Doente, Viagem, etc..."
                      value={formulario.motivo}
                      onChange={(e) => setFormulario({ ...formulario, motivo: e.target.value })}
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
                    onClick={salvarRestricao}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista */}
          <div className="space-y-3">
            {restricoes.length > 0 ? (
              restricoes.map((r) => (
                <div key={r.id} className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={18} className="text-red-400" />
                      <p className="text-white font-semibold">{r.voluntario_id}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300">
                        {r.tipo === 'feriado' ? '🏖️ Feriado' : '🚫 Indisponível'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {new Date(r.data_inicio).toLocaleDateString('pt-BR')}
                      {r.data_fim ? ` até ${new Date(r.data_fim).toLocaleDateString('pt-BR')}` : ''}
                    </p>
                    {r.motivo && <p className="text-sm text-gray-500 mt-1">Motivo: {r.motivo}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => abrirModal(r)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-blue-500/20 text-blue-400 transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deletarRestricao(r.id)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-red-400 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Ban className="text-gray-500 mx-auto mb-4" size={48} />
                <p className="text-gray-400">Nenhuma restrição cadastrada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
