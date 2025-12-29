'use client';

import Link from 'next/link';
import { Calendar, Users, ScrollText } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Escala de Voluntários
            </h2>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Sistema inteligente e justo para organizar voluntários
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
            <FeatureCard
              icon={<Users size={28} />}
              title="Cadastro"
              description="Adicione e gerencie voluntários com facilidade"
              href="/voluntarios"
            />
            <FeatureCard
              icon={<Calendar size={28} />}
              title="Calendário"
              description="Visualize a escala mensal interativa"
              href="/calendario"
            />
            <FeatureCard
              icon={<ScrollText size={28} />}
              title="Sorteio Justo"
              description="Algoritmo que prioriza quem serviu menos"
              href="/calendario"
            />
          </div>

          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Como Começar</h3>
            <ol className="space-y-4 text-gray-300">
              <li className="flex gap-3 sm:gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm sm:text-base font-bold">1</span>
                <div className="text-sm sm:text-base">
                  <strong className="text-cyan-400">Cadastre voluntários:</strong> Adicione os nomes de quem pode escalar
                </div>
              </li>
              <li className="flex gap-3 sm:gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm sm:text-base font-bold">2</span>
                <div className="text-sm sm:text-base">
                  <strong className="text-cyan-400">Defina restrições:</strong> Marque dias indisponíveis (opcional)
                </div>
              </li>
              <li className="flex gap-3 sm:gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm sm:text-base font-bold">3</span>
                <div className="text-sm sm:text-base">
                  <strong className="text-cyan-400">Faça o sorteio:</strong> Use o sorteio automático para preencher a escala
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  href 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="group backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6 hover:bg-white/10 transition-all cursor-pointer transform hover:scale-105 hover:border-cyan-500/50">
        <div className="text-cyan-400 mb-3 sm:mb-4 group-hover:text-purple-400 transition-colors">{icon}</div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors">{description}</p>
      </div>
    </Link>
  );
}
