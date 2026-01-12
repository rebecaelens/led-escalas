import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/publico/voluntarios - Lista públicos dos voluntários
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const apiKey = searchParams.get('api_key');

  // Verificar chave da API (simples validação)
  if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
    return NextResponse.json({ erro: 'Chave da API inválida' }, { status: 401 });
  }

  try {
    if (action === 'voluntarios') {
      const { data, error } = await supabase
        .from('voluntarios')
        .select('id, nome, email, telefone, ativo')
        .eq('ativo', true);

      if (error) throw error;

      return NextResponse.json({
        sucesso: true,
        total: data.length,
        voluntarios: data
      });
    }

    if (action === 'escalas') {
      const { data, error } = await supabase
        .from('escalas')
        .select('id, data, voluntario_id, voluntarios(nome)');

      if (error) throw error;

      return NextResponse.json({
        sucesso: true,
        total: data.length,
        escalas: data
      });
    }

    if (action === 'mes') {
      const mes = searchParams.get('mes');
      const ano = searchParams.get('ano');

      if (!mes || !ano) {
        return NextResponse.json({ erro: 'Mês e ano são obrigatórios' }, { status: 400 });
      }

      const { data, error } = await supabase
        .from('escalas')
        .select('id, data, voluntario_id, voluntarios(nome)')
        .gte('data', `${ano}-${String(mes).padStart(2, '0')}-01`)
        .lt('data', `${ano}-${String(parseInt(mes) + 1).padStart(2, '0')}-01`);

      if (error) throw error;

      return NextResponse.json({
        sucesso: true,
        mes: parseInt(mes),
        ano: parseInt(ano),
        total: data.length,
        escalas: data
      });
    }

    return NextResponse.json({
      erro: 'Ação não reconhecida',
      acoes_disponiveis: ['voluntarios', 'escalas', 'mes']
    }, { status: 400 });

  } catch (erro) {
    console.error('Erro na API pública:', erro);
    return NextResponse.json({ erro: 'Erro ao processar solicitação' }, { status: 500 });
  }
}
