import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sorteiarVoluntario } from '@/lib/sorteio';

export async function POST(req: NextRequest) {
  try {
    const { data, ano, mes } = await req.json();

    if (!data || !ano || mes === undefined) {
      return NextResponse.json(
        { erro: 'Data, ano e mês são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar voluntários ativos
    const { data: voluntarios, error: errVol } = await supabase
      .from('voluntarios')
      .select('*')
      .eq('ativo', true);

    if (errVol) throw errVol;

    // Buscar restrições
    const { data: restricoes, error: errRes } = await supabase
      .from('restricoes')
      .select('*');

    if (errRes) throw errRes;

    // Buscar histórico de escalas
    const { data: historico, error: errHist } = await supabase
      .from('escalas')
      .select('*');

    if (errHist) throw errHist;

    // Fazer sorteio
    const dataObj = new Date(data);
    const resultado = await sorteiarVoluntario(
      dataObj,
      voluntarios || [],
      restricoes || [],
      historico || []
    );

    if (!resultado) {
      return NextResponse.json(
        { erro: 'Nenhum voluntário disponível para essa data' },
        { status: 404 }
      );
    }

    // Salvar escala
    const { data: novaEscala, error: errEscala } = await supabase
      .from('escalas')
      .insert({
        voluntario_id: resultado.voluntario.id,
        data: data,
        mes: mes,
        ano: ano,
        observacoes: resultado.justificativa
      })
      .select()
      .single();

    if (errEscala) throw errEscala;

    return NextResponse.json({
      sucesso: true,
      escala: novaEscala,
      voluntario: resultado.voluntario
    });
  } catch (erro) {
    console.error('Erro no sorteio:', erro);
    return NextResponse.json(
      { erro: 'Erro ao realizar sorteio' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const mes = searchParams.get('mes');
    const ano = searchParams.get('ano');

    let query = supabase.from('escalas').select(`
      *,
      voluntario:voluntarios(id, nome, email)
    `);

    if (mes && ano) {
      query = query
        .eq('mes', parseInt(mes))
        .eq('ano', parseInt(ano));
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ escalas: data });
  } catch (erro) {
    console.error('Erro ao buscar escalas:', erro);
    return NextResponse.json(
      { erro: 'Erro ao buscar escalas' },
      { status: 500 }
    );
  }
}
