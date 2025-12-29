import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('voluntarios')
      .delete()
      .eq('id', id);

    if (error) throw error;

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
