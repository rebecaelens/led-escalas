import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('notificacoes')
      .select('*')
      .order('criada_em', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      sucesso: true,
      notificacoes: data || []
    });
  } catch (erro) {
    console.error('Erro ao buscar notificações:', erro);
    return NextResponse.json({ erro: 'Erro ao buscar notificações' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipo, titulo, mensagem, lida } = body;

    if (!tipo || !titulo || !mensagem) {
      return NextResponse.json({ erro: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('notificacoes')
      .insert([
        {
          tipo,
          titulo,
          mensagem,
          lida: lida || false,
          criada_em: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({
      sucesso: true,
      notificacao: data[0]
    });
  } catch (erro) {
    console.error('Erro ao criar notificação:', erro);
    return NextResponse.json({ erro: 'Erro ao criar notificação' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      // Deletar todas
      const { error } = await supabase
        .from('notificacoes')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Deleta todas (truque para deletar tudo)

      if (error) throw error;

      return NextResponse.json({ sucesso: true, mensagem: 'Todas as notificações deletadas' });
    } else {
      // Deletar uma específica
      const { error } = await supabase
        .from('notificacoes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return NextResponse.json({ sucesso: true, mensagem: 'Notificação deletada' });
    }
  } catch (erro) {
    console.error('Erro ao deletar notificação:', erro);
    return NextResponse.json({ erro: 'Erro ao deletar notificação' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, lida } = body;

    if (!id) {
      return NextResponse.json({ erro: 'ID obrigatório' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('notificacoes')
      .update({ lida })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({
      sucesso: true,
      notificacao: data[0]
    });
  } catch (erro) {
    console.error('Erro ao atualizar notificação:', erro);
    return NextResponse.json({ erro: 'Erro ao atualizar notificação' }, { status: 500 });
  }
}
