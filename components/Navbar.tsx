'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Users, Calendar, BarChart3, Settings, Bell, Ban, Clock, Palette, Building2, TrendingUp } from 'lucide-react';

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <>
      <nav className="backdrop-blur-lg bg-white/5 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-cyan-400 font-bold text-lg hover:text-cyan-300 transition">
            <Calendar size={24} />
            <span className="hidden sm:inline">LED TECNOLOGIA CN MARACANAÚ</span>
          </Link>

          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="p-2 hover:bg-white/10 rounded-lg transition text-cyan-400"
          >
            {menuAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuAberto && (
          <div className="backdrop-blur-lg bg-white/5 border-t border-white/10 px-4 py-4 flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition text-white"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link
              href="/voluntarios"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition text-white"
            >
              <Users size={20} />
              <span>Voluntários</span>
            </Link>
            <Link
              href="/calendario"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition text-white"
            >
              <Calendar size={20} />
              <span>Calendário</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition text-white"
            >
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/notificacoes"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition text-white"
            >
              <Bell size={20} />
              <span>Notificações</span>
            </Link>
            <Link
              href="/configuracoes"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition text-white"
            >
              <Settings size={20} />
              <span>Configurações</span>
            </Link>
            <hr className="border-white/10 my-2" />
            <Link
              href="/restricoes"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition text-white"
            >
              <Ban size={20} />
              <span>Restrições</span>
            </Link>
            <Link
              href="/auditoria"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition text-white"
            >
              <Clock size={20} />
              <span>Auditoria</span>
            </Link>
            <Link
              href="/tema"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition text-white"
            >
              <Palette size={20} />
              <span>Personalizar</span>
            </Link>
            <hr className="border-white/10 my-2" />
            <Link
              href="/multi-igreja"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition text-white"
            >
              <Building2 size={20} />
              <span>Múltiplas Igrejas</span>
            </Link>
            <Link
              href="/analise"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition text-white"
            >
              <TrendingUp size={20} />
              <span>Análise Avançada</span>
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
