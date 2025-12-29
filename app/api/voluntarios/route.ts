import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { nome, email, telefone } = await req.json();

    if (!nome) {
      return NextResponse.json(
        { erro: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('voluntarios')
      .insert({
        nome,
        email: email || null,
        telefone: telefone || null,
        ativo: true
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ voluntario: data }, { status: 201 });
  } catch (erro) {
    console.error('Erro ao criar voluntário:', erro);
    return NextResponse.json(
      { erro: 'Erro ao criar voluntário' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('voluntarios')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ voluntarios: data });
  } catch (erro) {
    console.error('Erro ao buscar voluntários:', erro);
    return NextResponse.json(
      { erro: 'Erro ao buscar voluntários' },
      { status: 500 }
    );
  }
}
