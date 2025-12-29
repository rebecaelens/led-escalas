import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { voluntario_id, dia_semana, data_especifica, descricao } = await req.json();

    const { data, error } = await supabase
      .from('restricoes')
      .insert({
        voluntario_id,
        dia_semana: dia_semana !== undefined ? dia_semana : null,
        data_especifica: data_especifica || null,
        descricao: descricao || null
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ restricao: data }, { status: 201 });
  } catch (erro) {
    console.error('Erro ao criar restrição:', erro);
    return NextResponse.json(
      { erro: 'Erro ao criar restrição' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const voluntario_id = searchParams.get('voluntario_id');

    let query = supabase.from('restricoes').select('*');

    if (voluntario_id) {
      query = query.eq('voluntario_id', voluntario_id);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ restricoes: data });
  } catch (erro) {
    console.error('Erro ao buscar restrições:', erro);
    return NextResponse.json(
      { erro: 'Erro ao buscar restrições' },
      { status: 500 }
    );
  }
}
