'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

interface ConfiguracaoIgreja {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  pastor: string;
  horarioServico: string;
  descricao: string;
}

export default function ConfiguracoesPage() {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoIgreja>({
    id: '1',
    nome: 'Igreja Maracanau',
    endereco: 'Rua das Flores, 123',
    telefone: '+55 (85) 99999-9999',
    email: 'contato@igreja.com',
    pastor: 'Pastor João',
    horarioServico: '19:00',
    descricao: 'Uma comunidade de fé dedicada ao serviço'
  });

  const [salvo, setSalvo] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [senha, setSenha] = useState('');
  const [senhaCorreta, setSenhaCorreta] = useState(false);

  const SENHA_ADMIN = 'cn@maracanau26';

  function verificarSenha() {
    if (senha === SENHA_ADMIN) {
      setSenhaCorreta(true);
    } else {
      alert('Senha incorreta!');
      setSenha('');
    }
  }

  async function salvarConfiguracao() {
    setCarregando(true);
    try {
      // Simulando save - em um projeto real, isso seria um POST/PUT para uma API
      localStorage.setItem('configuracaoIgreja', JSON.stringify(configuracao));
      setSalvo(true);
      setTimeout(() => setSalvo(false), 3000);
    } catch (erro) {
      console.error('Erro ao salvar:', erro);
      alert('Erro ao salvar configurações');
    } finally {
      setCarregando(false);
    }
  }

  function handleChange(field: keyof ConfiguracaoIgreja, value: string) {
    setConfiguracao(prev => ({
      ...prev,
      [field]: value
    }));
  }

  if (!senhaCorreta) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-6 flex items-center justify-center">
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8 w-full max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="text-red-400" size={28} />
              <h1 className="text-2xl font-bold text-white">Acesso Restrito</h1>
            </div>

            <p className="text-gray-300 mb-6">Digite a senha para acessar as configurações da igreja:</p>

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Settings className="text-cyan-400" size={32} />
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Configurações da Igreja
            </h1>
          </div>

          {salvo && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              ✅ Configurações salvas com sucesso!
            </div>
          )}

          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8">
            <div className="space-y-6">
              {/* Nome da Igreja */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Nome da Igreja *
                </label>
                <input
                  type="text"
                  value={configuracao.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  placeholder="Digite o nome da Igreja"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Pastor */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Nome do Pastor/Lider
                </label>
                <input
                  type="text"
                  value={configuracao.pastor}
                  onChange={(e) => handleChange('pastor', e.target.value)}
                  placeholder="Digite o nome do pastor"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  value={configuracao.endereco}
                  onChange={(e) => handleChange('endereco', e.target.value)}
                  placeholder="Endereço da Igreja"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={configuracao.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  placeholder="+55 (85) 9999-9999"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={configuracao.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="contato@igreja.com"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Horário do Serviço */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Horário do Serviço
                </label>
                <input
                  type="time"
                  value={configuracao.horarioServico}
                  onChange={(e) => handleChange('horarioServico', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Descrição da Igreja
                </label>
                <textarea
                  value={configuracao.descricao}
                  onChange={(e) => handleChange('descricao', e.target.value)}
                  placeholder="Descreva um pouco sobre a sua igreja..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              {/* Botão Salvar */}
              <button
                onClick={salvarConfiguracao}
                disabled={carregando}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {carregando ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-300 text-sm">
            <p className="font-semibold mb-2">💡 Dica:</p>
            <p>Essas informações são utilizadas para identificar sua igreja no sistema e podem ser exibidas em relatórios.</p>
          </div>
        </div>
      </div>
    </>
  );
}
