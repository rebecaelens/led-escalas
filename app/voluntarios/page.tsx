'use client';

import { useState, useEffect } from 'react';
import { Voluntario } from '@/lib/types';
import { Plus, Trash2, Users as UsersIcon } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function VoluntariosPage() {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarVoluntarios();
  }, []);

  async function carregarVoluntarios() {
    try {
      const res = await fetch('/api/voluntarios');
      const json = await res.json();
      setVoluntarios(json.voluntarios || []);
    } catch (erro) {
      console.error('Erro ao carregar voluntários:', erro);
    }
  }

  async function adicionarVoluntario(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;

    setCarregando(true);
    try {
      const res = await fetch('/api/voluntarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone })
      });

      if (res.ok) {
        setNome('');
        setEmail('');
        setTelefone('');
        await carregarVoluntarios();
      }
    } catch (erro) {
      console.error('Erro ao adicionar:', erro);
    } finally {
      setCarregando(false);
    }
  }

  async function deletarVoluntario(id: string, nome: string) {
    if (!confirm(`Tem certeza que deseja deletar ${nome}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/voluntarios/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await carregarVoluntarios();
      } else {
        alert('❌ Erro ao deletar voluntário');
      }
    } catch (erro) {
      console.error('Erro ao deletar:', erro);
      alert('❌ Erro ao deletar voluntário');
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <UsersIcon className="text-cyan-400" size={32} />
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Gerenciar Voluntários
          </h1>
        </div>

        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <form onSubmit={adicionarVoluntario} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="Nome *"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              />
            </div>
            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} /> Adicionar Voluntário
            </button>
          </form>
        </div>

        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-cyan-400 font-semibold">Nome</th>
                  <th className="px-6 py-4 text-left text-cyan-400 font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-cyan-400 font-semibold">Telefone</th>
                  <th className="px-6 py-4 text-left text-cyan-400 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {voluntarios.map((vol) => (
                  <tr key={vol.id} className="border-t border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-white font-medium">{vol.nome}</td>
                    <td className="px-6 py-4 text-gray-300">{vol.email || '-'}</td>
                    <td className="px-6 py-4 text-gray-300">{vol.telefone || '-'}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => deletarVoluntario(vol.id, vol.nome)}
                        className="text-red-400 hover:text-red-300 transition"
                        title="Deletar voluntário"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-white/5">
            {voluntarios.map((vol) => (
              <div key={vol.id} className="p-4 hover:bg-white/5 transition">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">{vol.nome}</h3>
                    {vol.email && <p className="text-gray-400 text-sm mb-1">{vol.email}</p>}
                    {vol.telefone && <p className="text-gray-400 text-sm">{vol.telefone}</p>}
                  </div>
                  <button 
                    onClick={() => deletarVoluntario(vol.id, vol.nome)}
                    className="text-red-400 hover:text-red-300 transition ml-3"
                    title="Deletar voluntário"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {voluntarios.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              Nenhum voluntário cadastrado
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
