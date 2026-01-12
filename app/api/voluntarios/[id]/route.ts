import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Buscar nome do voluntário antes de deletar
    const { data: voluntarioData } = await supabase
      .from('voluntarios')
      .select('nome')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('voluntarios')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Criar notificação
    await supabase
      .from('notificacoes')
      .insert({
        tipo: 'info',
        titulo: 'Voluntário Atualizado',
        mensagem: `${nome} foi atualizado com sucesso`,
        lida: false,
        criada_em: new Date().toISOString()
      });

    // Criar notificação
    if (voluntarioData?.nome) {
      await supabase
        .from('notificacoes')
        .insert({
          tipo: 'erro',
          titulo: 'Voluntário Removido',
          mensagem: `${voluntarioData.nome} foi removido do sistema`,
          lida: false,
          criada_em: new Date().toISOString()
        });
    }

    return NextResponse.json({ sucesso: true });
  } catch (erro) {
    console.error('Erro ao deletar voluntário:', erro);
    return NextResponse.json(
      { erro: 'Erro ao deletar voluntário' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { nome, email, telefone, ativo } = await req.json();

    const { data, error } = await supabase
      .from('voluntarios')
      .update({
        nome,
        email,
        telefone,
        ativo,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ voluntario: data });
  } catch (erro) {
    console.error('Erro ao atualizar voluntário:', erro);
    return NextResponse.json(
      { erro: 'Erro ao atualizar voluntário' },
      { status: 500 }
    );
  }
}
