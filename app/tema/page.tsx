'use client';

import { useState, useEffect } from 'react';
import { Palette, Sun, Moon, Eye, BarChart3 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

interface TemaConfig {
  id: string;
  nome: string;
  descricao: string;
  cores: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  preview: string;
}

const TEMAS: TemaConfig[] = [
  {
    id: 'default',
    nome: 'Cyan & Purple',
    descricao: 'Tema padrão com gradiente cyan para roxo',
    cores: {
      primary: 'cyan',
      secondary: 'purple',
      accent: 'blue',
      background: 'from-gray-900 via-purple-900 to-gray-900'
    },
    preview: 'bg-gradient-to-r from-cyan-400 to-purple-400'
  },
  {
    id: 'ocean',
    nome: 'Ocean Blue',
    descricao: 'Tema inspirado no oceano em tons de azul',
    cores: {
      primary: 'blue',
      secondary: 'cyan',
      accent: 'teal',
      background: 'from-blue-900 via-blue-800 to-cyan-900'
    },
    preview: 'bg-gradient-to-r from-blue-400 to-cyan-400'
  },
  {
    id: 'sunset',
    nome: 'Sunset',
    descricao: 'Tema com cores quentes do pôr do sol',
    cores: {
      primary: 'orange',
      secondary: 'red',
      accent: 'yellow',
      background: 'from-orange-900 via-red-900 to-pink-900'
    },
    preview: 'bg-gradient-to-r from-orange-400 to-red-400'
  },
  {
    id: 'forest',
    nome: 'Forest Green',
    descricao: 'Tema com tons verdes e naturais',
    cores: {
      primary: 'green',
      secondary: 'emerald',
      accent: 'teal',
      background: 'from-green-900 via-emerald-900 to-teal-900'
    },
    preview: 'bg-gradient-to-r from-green-400 to-emerald-400'
  },
  {
    id: 'lavender',
    nome: 'Lavender',
    descricao: 'Tema suave em tons roxos e lilás',
    cores: {
      primary: 'purple',
      secondary: 'pink',
      accent: 'indigo',
      background: 'from-purple-900 via-pink-900 to-purple-900'
    },
    preview: 'bg-gradient-to-r from-purple-400 to-pink-400'
  }
];

export default function TemaPage() {
  const [temaSelecionado, setTemaSelecionado] = useState('default');
  const [modo, setModo] = useState<'claro' | 'escuro'>('escuro');
  const [visualizacao, setVisualizacao] = useState(false);

  useEffect(() => {
    // Carregar tema do localStorage
    const tema = localStorage.getItem('tema-selecionado') || 'default';
    setTemaSelecionado(tema);
  }, []);

  function salvarTema(temaId: string) {
    setTemaSelecionado(temaId);
    localStorage.setItem('tema-selecionado', temaId);
    alert(`Tema "${TEMAS.find(t => t.id === temaId)?.nome}" aplicado!`);
  }

  const temaBuscado = TEMAS.find(t => t.id === temaSelecionado);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Palette className="text-cyan-400" size={32} />
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Personalizar Interface
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tema Atual */}
            <div className="lg:col-span-1 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Tema Atual</h2>
              
              {temaBuscado && (
                <div>
                  <div className={`w-full h-24 rounded-lg ${temaBuscado.preview} mb-4`}></div>
                  <h3 className="text-white font-semibold">{temaBuscado.nome}</h3>
                  <p className="text-gray-400 text-sm mt-2">{temaBuscado.descricao}</p>
                </div>
              )}

              {/* Modo Claro/Escuro */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  {modo === 'escuro' ? <Moon size={18} /> : <Sun size={18} />}
                  Modo
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setModo('escuro')}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                      modo === 'escuro'
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <Moon size={18} />
                    Escuro
                  </button>
                  <button
                    onClick={() => setModo('claro')}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                      modo === 'claro'
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <Sun size={18} />
                    Claro
                  </button>
                </div>
              </div>

              {/* Preferências */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Eye size={18} />
                  Preferências
                </h3>
                <label className="flex items-center gap-3 text-gray-300 hover:text-white transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visualizacao}
                    onChange={(e) => setVisualizacao(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Animações suaves</span>
                </label>
              </div>
            </div>

            {/* Seleção de Temas */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold text-white mb-4">Escolha um Tema</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TEMAS.map((tema) => (
                  <button
                    key={tema.id}
                    onClick={() => salvarTema(tema.id)}
                    className={`backdrop-blur-lg border rounded-xl p-4 transition transform hover:scale-105 ${
                      temaSelecionado === tema.id
                        ? 'border-cyan-400/50 bg-cyan-500/10 ring-2 ring-cyan-400/50'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-full h-16 rounded-lg ${tema.preview} mb-4`}></div>
                    <h3 className="text-white font-semibold">{tema.nome}</h3>
                    <p className="text-gray-400 text-sm mt-2">{tema.descricao}</p>
                    {temaSelecionado === tema.id && (
                      <div className="mt-4 text-green-400 text-sm font-semibold flex items-center gap-1">
                        ✓ Aplicado
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Seção de Dicas */}
          <div className="mt-8 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Estatísticas de Uso
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Visitantes por Dia</p>
                <p className="text-2xl font-bold text-cyan-400 mt-2">1.2K</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Escalas Criadas</p>
                <p className="text-2xl font-bold text-green-400 mt-2">48</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Voluntários Ativos</p>
                <p className="text-2xl font-bold text-purple-400 mt-2">25</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-300 text-sm">
            <p className="font-semibold mb-2">💡 Dica:</p>
            <p>Os temas são salvos no navegador e se aplicarão a todos os acessos futuros. Você pode alterá-los a qualquer momento!</p>
          </div>
        </div>
      </div>
    </>
  );
}
