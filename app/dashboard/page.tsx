'use client';

import { useState, useEffect } from 'react';
import { Voluntario, Escala } from '@/lib/types';
import { BarChart3, Users, TrendingUp, Zap } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

interface EstatisticaVoluntario {
  id: string;
  nome: string;
  totalEscalas: number;
  ultimaEscala?: string;
  proximaEscala?: string;
}

export default function DashboardPage() {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [escalas, setEscalas] = useState<Escala[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticaVoluntario[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [resVol, resEscalas] = await Promise.all([
        fetch('/api/voluntarios'),
        fetch('/api/sorteio?mes=0&ano=2026')
      ]);

      if (resVol.ok && resEscalas.ok) {
        const dataVol = await resVol.json();
        const dataEscalas = await resEscalas.json();
        
        setVoluntarios(dataVol.voluntarios || []);
        setEscalas(dataEscalas.escalas || []);
        
        calcularEstatisticas(dataVol.voluntarios || [], dataEscalas.escalas || []);
      }
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
    } finally {
      setCarregando(false);
    }
  }

  function calcularEstatisticas(vols: Voluntario[], esc: Escala[]) {
    const stats: EstatisticaVoluntario[] = vols.map(vol => {
      const escalasDoVoluntario = esc.filter(e => e.voluntario_id === vol.id);
      const ultima = escalasDoVoluntario.sort((a, b) => 
        new Date(b.data).getTime() - new Date(a.data).getTime()
      )[0];
      
      const proxima = escalasDoVoluntario.sort((a, b) => 
        new Date(a.data).getTime() - new Date(b.data).getTime()
      ).find(e => new Date(e.data) > new Date());

      return {
        id: vol.id,
        nome: vol.nome,
        totalEscalas: escalasDoVoluntario.length,
        ultimaEscala: ultima?.data,
        proximaEscala: proxima?.data
      };
    });

    setEstatisticas(stats.sort((a, b) => b.totalEscalas - a.totalEscalas));
  }

  const totalEscalas = escalas.length;
  const proximasEscalas = estatisticas.filter(e => e.proximaEscala).slice(0, 3);
  const maioraFrequente = estatisticas[0];
  const menorFrequente = estatisticas[estatisticas.length - 1];

  if (carregando) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-6 flex items-center justify-center">
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="text-cyan-400" size={32} />
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Voluntários</p>
                  <p className="text-3xl font-bold text-white mt-2">{voluntarios.length}</p>
                </div>
                <Users className="text-cyan-400" size={32} />
              </div>
            </div>

            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Escalas</p>
                  <p className="text-3xl font-bold text-white mt-2">{totalEscalas}</p>
                </div>
                <TrendingUp className="text-green-400" size={32} />
              </div>
            </div>

            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Mais Frequente</p>
                  <p className="text-lg font-bold text-white mt-2 truncate">{maioraFrequente?.nome}</p>
                  <p className="text-xs text-cyan-400 mt-1">{maioraFrequente?.totalEscalas} escalas</p>
                </div>
                <Zap className="text-yellow-400" size={32} />
              </div>
            </div>

            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Menos Frequente</p>
                  <p className="text-lg font-bold text-white mt-2 truncate">{menorFrequente?.nome}</p>
                  <p className="text-xs text-cyan-400 mt-1">{menorFrequente?.totalEscalas} escalas</p>
                </div>
                <Zap className="text-purple-400" size={32} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Próximas Escalas */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Próximas Escalas</h2>
              <div className="space-y-3">
                {proximasEscalas.length > 0 ? (
                  proximasEscalas.map((vol) => (
                    <div key={vol.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <p className="text-white font-semibold">{vol.nome}</p>
                        <p className="text-xs text-gray-400">
                          {vol.proximaEscala && new Date(vol.proximaEscala).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-cyan-400 font-semibold">{vol.totalEscalas} escalas</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">Nenhuma escala agendada</p>
                )}
              </div>
            </div>

            {/* Distribuição de Escalas */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Distribuição de Escalas</h2>
              <div className="space-y-2">
                {estatisticas.slice(0, 5).map((vol) => {
                  const maxEscalas = Math.max(...estatisticas.map(e => e.totalEscalas), 1);
                  const percentual = (vol.totalEscalas / maxEscalas) * 100;
                  
                  return (
                    <div key={vol.id}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-white truncate">{vol.nome}</p>
                        <p className="text-xs text-cyan-400 font-semibold">{vol.totalEscalas}</p>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                          style={{ width: `${percentual}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tabela Completa */}
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-6">
            <h2 className="text-xl font-bold text-white mb-4">Estatísticas Detalhadas</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-cyan-400 font-semibold">Voluntário</th>
                    <th className="px-4 py-3 text-center text-cyan-400 font-semibold">Total de Escalas</th>
                    <th className="px-4 py-3 text-left text-cyan-400 font-semibold">Última Escala</th>
                    <th className="px-4 py-3 text-left text-cyan-400 font-semibold">Próxima Escala</th>
                  </tr>
                </thead>
                <tbody>
                  {estatisticas.map((vol) => (
                    <tr key={vol.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-4 py-3 text-white">{vol.nome}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold">
                          {vol.totalEscalas}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {vol.ultimaEscala ? new Date(vol.ultimaEscala).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {vol.proximaEscala ? new Date(vol.proximaEscala).toLocaleDateString('pt-BR') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
