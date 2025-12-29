'use client';

import { useState, useEffect } from 'react';
import { Escala, Voluntario } from '@/lib/types';
import { RotateCcw, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Edit3, Lock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function CalendarioPage() {
  const [escalas, setEscalas] = useState<(Escala & { voluntario?: Voluntario })[]>([]);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [mesAtual, setMesAtual] = useState(0);
  const [anoAtual, setAnoAtual] = useState(2026);
  const [carregando, setCarregando] = useState(false);
  const [sorteioEmAndamento, setSorteioEmAndamento] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [mostrarModalSenha, setMostrarModalSenha] = useState(false);
  const [senha, setSenha] = useState('');

  useEffect(() => {
    carregarDados();
  }, [mesAtual, anoAtual]);

  async function carregarDados() {
    try {
      const [resEscalas, resVol] = await Promise.all([
        fetch(`/api/sorteio?mes=${mesAtual}&ano=${anoAtual}`),
        fetch('/api/voluntarios')
      ]);

      if (resEscalas.ok) {
        const data = await resEscalas.json();
        setEscalas(data.escalas || []);
      }

      if (resVol.ok) {
        const data = await resVol.json();
        setVoluntarios(data.voluntarios || []);
      }
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
    }
  }

  async function sorteiarMes() {
    if (voluntarios.length === 0) {
      alert('Nenhum voluntário cadastrado');
      return;
    }

    setSorteioEmAndamento(true);
    try {
      const dias = new Date(anoAtual, mesAtual + 1, 0).getDate();
      let sorteiosRealizados = 0;

      for (let dia = 1; dia <= dias; dia++) {
        const data = new Date(anoAtual, mesAtual, dia);
        const diaSemana = data.getDay();

        let deveSortear = false;

        if (mesAtual === 0 && dia === 1) {
          deveSortear = false;
        } else if (diaSemana === 0 || diaSemana === 4) {
          deveSortear = true;
        } else if (mesAtual === 0 && dia >= 2 && dia <= 13) {
          deveSortear = true;
        }

        if (!deveSortear) continue;

        const res = await fetch('/api/sorteio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: data.toISOString().split('T')[0],
            ano: anoAtual,
            mes: mesAtual
          })
        });

        if (res.ok) {
          sorteiosRealizados++;
        }
      }

      alert(`✅ ${sorteiosRealizados} escalas geradas com sucesso!`);
      await carregarDados();
    } catch (erro) {
      console.error('Erro ao sorteiar:', erro);
      alert('❌ Erro ao realizar sorteio');
    } finally {
      setSorteioEmAndamento(false);
    }
  }

  function verificarSenha() {
    if (senha === 'cnm@aracanau26') {
      setModoEdicao(true);
      setMostrarModalSenha(false);
      setSenha('');
      alert('✅ Modo de edição ativado!');
    } else {
      alert('❌ Senha incorreta!');
      setSenha('');
    }
  }

  async function atualizarVoluntario(escalaId: string, novoVoluntarioId: string) {
    try {
      const res = await fetch(`/api/sorteio/${escalaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voluntario_id: novoVoluntarioId })
      });

      if (res.ok) {
        await carregarDados();
      }
    } catch (erro) {
      console.error('Erro ao atualizar escala:', erro);
    }
  }

  function obterVoluntario(voluntarioId: string) {
    return voluntarios.find(v => v.id === voluntarioId);
  }

  const diasMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const escalasMap = new Map(escalas.map(e => [e.data, e]));

  const nomeMes = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(
    new Date(anoAtual, mesAtual)
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <CalendarIcon className="text-cyan-400" size={32} />
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Calendário de Escala
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMesAtual(m => m === 0 ? 11 : m - 1)}
              className="p-2 backdrop-blur-lg bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition text-cyan-400"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-4 py-2 backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg font-semibold text-white min-w-[160px] text-center">
              {nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)} {anoAtual}
            </div>
            <button
              onClick={() => setMesAtual(m => m === 11 ? 0 : m + 1)}
              className="p-2 backdrop-blur-lg bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition text-cyan-400"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 mb-6 flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={sorteiarMes}
            disabled={sorteioEmAndamento}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-2.5 px-4 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50"
          >
            <RotateCcw size={18} /> Sorteiar Mês
          </button>
          <button
            onClick={() => setMostrarModalSenha(true)}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 ${
              modoEdicao 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' 
                : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
            } text-white font-bold py-2.5 px-4 rounded-lg transition-all transform hover:scale-[1.02]`}
          >
            {modoEdicao ? <Edit3 size={18} /> : <Lock size={18} />}
            <span className="hidden sm:inline">{modoEdicao ? 'Editando' : 'Editar'}</span>
          </button>
        </div>

        <div id="calendario-escala" className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
              <div key={dia} className="text-center font-bold text-cyan-400 py-2 text-xs sm:text-sm border-b border-white/10">
                {dia}
              </div>
            ))}

            {Array.from({ length: new Date(anoAtual, mesAtual, 1).getDay() }).map((_, i) => (
              <div key={`vazio-${i}`} className="aspect-square bg-white/5 rounded-lg"></div>
            ))}

            {Array.from({ length: diasMes }).map((_, i) => {
              const dia = i + 1;
              const data = new Date(anoAtual, mesAtual, dia);
              const dataStr = data.toISOString().split('T')[0];
              const escala = escalasMap.get(dataStr);
              const voluntario = escala ? obterVoluntario(escala.voluntario_id) : null;

              return (
                <div
                  key={dia}
                  className="aspect-square rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 p-1.5 sm:p-2 transition cursor-pointer flex flex-col"
                >
                  <div className="text-xs sm:text-sm font-bold text-gray-300 mb-1">{dia}</div>
                  {voluntario ? (
                    <div className="flex-1 flex flex-col justify-between">
                      {modoEdicao && escala ? (
                        <select
                          value={escala.voluntario_id}
                          onChange={(e) => atualizarVoluntario(escala.id, e.target.value)}
                          className="text-[10px] sm:text-xs bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 rounded px-1 py-0.5 font-semibold w-full"
                        >
                          {voluntarios.map(v => (
                            <option key={v.id} value={v.id} className="bg-gray-800 text-white">
                              {v.nome}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-[10px] sm:text-xs bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 rounded px-1 py-0.5 font-semibold line-clamp-2">
                          {voluntario.nome}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-600">-</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-300">
              <strong className="text-cyan-400">Total de escalas:</strong> {escalas.length} / {diasMes}
            </p>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Detalhes da Escala</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-cyan-400 font-semibold text-sm">Data</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-cyan-400 font-semibold text-sm">Voluntário</th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-cyan-400 font-semibold text-sm">Observações</th>
                </tr>
              </thead>
              <tbody>
                {escalas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 sm:px-6 py-4 text-center text-gray-400">
                      Nenhuma escala para este mês. Clique em "Sorteiar Mês" para gerar.
                    </td>
                  </tr>
                ) : (
                  escalas.map((escala) => {
                    const vol = obterVoluntario(escala.voluntario_id);
                    return (
                      <tr key={escala.id} className="border-t border-white/5 hover:bg-white/5 transition">
                        <td className="px-4 sm:px-6 py-3 text-white text-sm">
                          {new Intl.DateTimeFormat('pt-BR').format(new Date(escala.data))}
                        </td>
                        <td className="px-4 sm:px-6 py-3 font-semibold text-cyan-300 text-sm">
                          {modoEdicao ? (
                            <select
                              value={escala.voluntario_id}
                              onChange={(e) => atualizarVoluntario(escala.id, e.target.value)}
                              className="bg-gray-800 border border-cyan-500/30 text-cyan-300 rounded px-2 py-1 w-full max-w-xs"
                            >
                              {voluntarios.map(v => (
                                <option key={v.id} value={v.id} className="bg-gray-800">
                                  {v.nome}
                                </option>
                              ))}
                            </select>
                          ) : (
                            vol?.nome || 'Desconhecido'
                          )}
                        </td>
                        <td className="hidden sm:table-cell px-6 py-3 text-sm text-gray-400">{escala.observacoes || '-'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {mostrarModalSenha && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="backdrop-blur-lg bg-gray-900/95 border border-white/20 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="text-yellow-400" size={28} />
                <h2 className="text-2xl font-bold text-white">Área Restrita</h2>
              </div>
              <p className="text-gray-300 mb-6">Digite a senha para ativar o modo de edição:</p>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && verificarSenha()}
                placeholder="Digite a senha"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 mb-6"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setMostrarModalSenha(false);
                    setSenha('');
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={verificarSenha}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
