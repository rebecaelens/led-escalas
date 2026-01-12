import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { enviarWhatsApp, gerarMensagemEscala } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const { escala_id } = await req.json();

    if (!escala_id) {
      return NextResponse.json(
        { erro: 'ID da escala é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar escala com voluntário
    const { data: escala, error: errEscala } = await supabase
      .from('escalas')
      .select(`
        *,
        voluntario:voluntarios(id, nome, telefone)
      `)
      .eq('id', escala_id)
      .single();

    if (errEscala || !escala) {
      return NextResponse.json(
        { erro: 'Escala não encontrada' },
        { status: 404 }
      );
    }

    const voluntario = escala.voluntario;
    if (!voluntario || !voluntario.telefone) {
      return NextResponse.json(
        { erro: 'Voluntário sem telefone cadastrado' },
        { status: 400 }
      );
    }

    // Gerar mensagem
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const dataParts = escala.data.split('-');
    const data = new Date(parseInt(dataParts[0]), parseInt(dataParts[1]) - 1, parseInt(dataParts[2]));
    const dia = diasSemana[data.getDay()];
    
    const mensagem = gerarMensagemEscala(
      voluntario.nome,
      escala.data,
      dia
    );

    // Enviar mensagem
    const sucesso = await enviarWhatsApp(voluntario.telefone, mensagem);

    if (!sucesso) {
      return NextResponse.json(
        { erro: 'Falha ao enviar WhatsApp' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: 'WhatsApp enviado com sucesso',
      voluntario: voluntario.nome
    });
  } catch (erro) {
    console.error('Erro ao enviar notificação:', erro);
    return NextResponse.json(
      { erro: 'Erro ao enviar notificação' },
      { status: 500 }
    );
  }
}

// Enviar para todos os voluntários de um mês
export async function PUT(req: NextRequest) {
  try {
    const { mes, ano } = await req.json();

    if (mes === undefined || !ano) {
      return NextResponse.json(
        { erro: 'Mês e ano são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar todas as escalas do mês
    const { data: escalas, error: errEscalas } = await supabase
      .from('escalas')
      .select(`
        *,
        voluntario:voluntarios(id, nome, telefone)
      `)
      .eq('mes', mes)
      .eq('ano', ano);

    if (errEscalas || !escalas) {
      return NextResponse.json(
        { erro: 'Erro ao buscar escalas' },
        { status: 500 }
      );
    }

    let enviados = 0;
    let erros = 0;
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    for (const escala of escalas) {
      if (!escala.voluntario?.telefone) continue;

      const dataParts = escala.data.split('-');
      const data = new Date(parseInt(dataParts[0]), parseInt(dataParts[1]) - 1, parseInt(dataParts[2]));
      const dia = diasSemana[data.getDay()];

      const mensagem = gerarMensagemEscala(
        escala.voluntario.nome,
        escala.data,
        dia
      );

      const sucesso = await enviarWhatsApp(escala.voluntario.telefone, mensagem);
      if (sucesso) {
        enviados++;
      } else {
        erros++;
      }
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: `Notificações enviadas: ${enviados} sucesso, ${erros} erro`,
      enviados,
      erros
    });
  } catch (erro) {
    console.error('Erro ao enviar notificações em lote:', erro);
    return NextResponse.json(
      { erro: 'Erro ao enviar notificações' },
      { status: 500 }
    );
  }
}
