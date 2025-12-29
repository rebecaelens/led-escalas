import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { voluntario_id } = body;

    const { data, error } = await supabase
      .from('escalas')
      .update({ voluntario_id })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ sucesso: true, escala: data[0] });
  } catch (erro) {
    console.error('Erro ao atualizar escala:', erro);
    return NextResponse.json(
      { erro: 'Erro ao atualizar escala' },
      { status: 500 }
    );
  }
}
