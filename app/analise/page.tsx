'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, PieChart, LineChart as LineChartIcon } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

interface DadosAnalise {
  mesAtual: number;
  voluntariosAtivos: number;
  escalasTotal: number;
  mediaEscalasVoluntario: number;
  taxaPreenchimento: number;
  voluntarioMaiorFrequencia: { nome: string; escalas: number };
  trend: 'subindo' | 'caindo' | 'estavel';
}

export default function AnalisePage() {
  const [dados, setDados] = useState<DadosAnalise>({
    mesAtual: new Date().getMonth() + 1,
    voluntariosAtivos: 25,
    escalasTotal: 48,
    mediaEscalasVoluntario: 1.92,
    taxaPreenchimento: 78,
    voluntarioMaiorFrequencia: { nome: 'João Silva', escalas: 6 },
    trend: 'subindo'
  });

  const [periodo, setPeriodo] = useState<'mes' | 'trimestre' | 'ano'>('mes');
  const [grafico, setGrafico] = useState<'barras' | 'linhas' | 'pizza'>('barras');

  const dados_grafico_mes = [
    { mes: 'Jan', escalas: 40, voluntarios: 22 },
    { mes: 'Fev', escalas: 45, voluntarios: 24 },
    { mes: 'Mar', escalas: 48, voluntarios: 25 },
    { mes: 'Abr', escalas: 52, voluntarios: 25 },
    { mes: 'Mai', escalas: 55, voluntarios: 26 }
  ];

  const dados_por_voluntario = [
    { nome: 'João Silva', escalas: 6, porcentagem: 12.5 },
    { nome: 'Maria Santos', escalas: 5, porcentagem: 10.4 },
    { nome: 'Pedro Costa', escalas: 4, porcentagem: 8.3 },
    { nome: 'Ana Paula', escalas: 4, porcentagem: 8.3 },
    { nome: 'Outros', escalas: 29, porcentagem: 60.5 }
  ];

  function renderizarGrafico() {
    if (grafico === 'barras') {
      return (
        <div className="flex items-end gap-2 h-64 p-4 bg-white/5 rounded-lg">
          {dados_grafico_mes.map((d) => (
            <div key={d.mes} className="flex-1 flex flex-col items-center">
              <div className="w-full flex gap-1 justify-center mb-4" style={{ height: '200px' }}>
                <div
                  className="bg-cyan-500 rounded-t-lg opacity-80"
                  style={{ width: '45%', height: `${(d.escalas / 60) * 100}%` }}
                  title={`Escalas: ${d.escalas}`}
                ></div>
                <div
                  className="bg-purple-500 rounded-t-lg opacity-80"
                  style={{ width: '45%', height: `${(d.voluntarios / 30) * 100}%` }}
                  title={`Voluntários: ${d.voluntarios}`}
                ></div>
              </div>
              <p className="text-xs text-gray-400">{d.mes}</p>
            </div>
          ))}
        </div>
      );
    }

    if (grafico === 'pizza') {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-lg">
          <div className="w-48 h-48 rounded-full bg-gradient-conic from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-gray-900 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-white">{dados.taxaPreenchimento}%</p>
              <p className="text-xs text-gray-400">Preenchido</p>
            </div>
          </div>

          <div className="mt-6 space-y-2 w-full">
            {dados_por_voluntario.map((d) => (
              <div key={d.nome} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{d.nome}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                      style={{ width: `${d.porcentagem}%` }}
                    ></div>
                  </div>
                  <span className="text-cyan-400 font-semibold">{d.porcentagem.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="p-8 bg-white/5 rounded-lg text-center">
        <LineChartIcon className="mx-auto text-cyan-400 mb-4" size={64} />
        <p className="text-gray-400">Gráfico de linhas (simulado)</p>
        <p className="text-xs text-gray-500 mt-2">Mostra tendência ao longo do tempo</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-green-400" size={32} />
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Análise Avançada
            </h1>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-2">VOLUNTÁRIOS ATIVOS</p>
              <p className="text-2xl font-bold text-white">{dados.voluntariosAtivos}</p>
              <p className="text-green-400 text-xs mt-2">↑ +2 este mês</p>
            </div>

            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-2">ESCALAS TOTAL</p>
              <p className="text-2xl font-bold text-cyan-400">{dados.escalasTotal}</p>
              <p className="text-cyan-400 text-xs mt-2">↑ +7 este mês</p>
            </div>

            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-2">MÉDIA POR VOL.</p>
              <p className="text-2xl font-bold text-purple-400">{dados.mediaEscalasVoluntario.toFixed(2)}</p>
              <p className="text-purple-400 text-xs mt-2">escalas/voluntário</p>
            </div>

            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-2">TAXA PREENCHIMENTO</p>
              <p className="text-2xl font-bold text-green-400">{dados.taxaPreenchimento}%</p>
              <p className="text-green-400 text-xs mt-2">Dias preenchidos</p>
            </div>

            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-2">TENDÊNCIA</p>
              <p className="text-2xl font-bold text-orange-400">
                {dados.trend === 'subindo' ? '📈' : dados.trend === 'caindo' ? '📉' : '➡️'}
              </p>
              <p className="text-orange-400 text-xs mt-2 capitalize">
                {dados.trend === 'subindo' ? 'Crescendo' : dados.trend === 'caindo' ? 'Reduzindo' : 'Estável'}
              </p>
            </div>
          </div>

          {/* Controles */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex gap-2">
              {(['mes', 'trimestre', 'ano'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    periodo === p
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {p === 'mes' ? 'Mês' : p === 'trimestre' ? 'Trimestre' : 'Ano'}
                </button>
              ))}
            </div>

            <div className="flex gap-2 ml-auto">
              {(['barras', 'linhas', 'pizza'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGrafico(g)}
                  className={`p-2 rounded-lg transition ${
                    grafico === g
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
                  }`}
                  title={g}
                >
                  {g === 'barras' ? <BarChart3 size={20} /> :
                   g === 'linhas' ? <LineChartIcon size={20} /> :
                   <PieChart size={20} />}
                </button>
              ))}
            </div>
          </div>

          {/* Gráfico */}
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Escalas vs Voluntários ({periodo})</h2>
            {renderizarGrafico()}
          </div>

          {/* Top Voluntários */}
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Top Voluntários</h2>
            <div className="space-y-3">
              {dados_por_voluntario.slice(0, 4).map((vol, index) => (
                <div key={vol.nome} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-cyan-400">#{index + 1}</span>
                    <div>
                      <p className="text-white font-semibold">{vol.nome}</p>
                      <p className="text-xs text-gray-400">{vol.escalas} escalas ({vol.porcentagem.toFixed(1)}%)</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(vol.escalas, 5) }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-8 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-sm"
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-300 text-sm">
            <p className="font-semibold mb-2">💡 Dica:</p>
            <p>Use essas análises para identificar oportunidades de melhoria, distribuição balanceada de escalas e planejamento futuro.</p>
          </div>
        </div>
      </div>
    </>
  );
}
