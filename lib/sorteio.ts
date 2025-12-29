import { Voluntario, Restricao, Escala } from './types';

/**
 * Implementa lógica de sorteio JUSTA
 * Prioriza voluntários que serviram menos
 * Respeita restrições de disponibilidade
 */

export async function calcularMenosEscalado(
  voluntarios: Voluntario[],
  escalasHistorico: Escala[]
): Promise<Map<string, number>> {
  const contagem = new Map<string, number>();

  for (const vol of voluntarios) {
    const vezes = escalasHistorico.filter(e => e.voluntario_id === vol.id).length;
    contagem.set(vol.id, vezes);
  }

  return contagem;
}

export function temRestricao(
  voluntarioId: string,
  data: Date,
  restricoes: Restricao[]
): boolean {
  const diaSemana = data.getDay();
  const dataStr = data.toISOString().split('T')[0];

  return restricoes.some(r => {
    if (r.voluntario_id !== voluntarioId) return false;

    // Restrição por dia da semana
    if (r.dia_semana !== null && r.dia_semana !== undefined) {
      if (r.dia_semana === diaSemana) return true;
    }

    // Restrição por data específica
    if (r.data_especifica === dataStr) return true;

    return false;
  });
}

export async function sorteiarVoluntario(
  data: Date,
  voluntarios: Voluntario[],
  restricoes: Restricao[],
  escalasHistorico: Escala[]
): Promise<{ voluntario: Voluntario; justificativa: string } | null> {
  // 1. Filtrar voluntários que podem nesse dia
  const aptos = voluntarios.filter(vol => 
    vol.ativo && !temRestricao(vol.id, data, restricoes)
  );

  if (aptos.length === 0) {
    return null; // Ninguém disponível
  }

  // 2. Contar quantas vezes cada um já foi escalado
  const contagem = await calcularMenosEscalado(aptos, escalasHistorico);
  
  // 3. Encontrar o mínimo
  const minEscalacoes = Math.min(...aptos.map(v => contagem.get(v.id) || 0));
  
  // 4. Filtrar os menos escalados (top 2-3)
  const menosEscalados = aptos
    .filter(v => (contagem.get(v.id) || 0) === minEscalacoes)
    .sort(() => Math.random() - 0.5); // Embaralhar entre os com mesma contagem

  if (menosEscalados.length === 0) {
    return null;
  }

  const escolhido = menosEscalados[0];

  return {
    voluntario: escolhido,
    justificativa: `Escalado por ser um dos menos utilizados (${minEscalacoes} serviços prévios)`
  };
}

export async function sorteiarMes(
  ano: number,
  mes: number,
  voluntarios: Voluntario[],
  restricoes: Restricao[],
  escalasHistorico: Escala[]
): Promise<{ [key: string]: string }> {
  const dias = new Date(ano, mes + 1, 0).getDate(); // Último dia do mês
  const resultado: { [key: string]: string } = {};

  for (let dia = 1; dia <= dias; dia++) {
    const data = new Date(ano, mes, dia);
    
    // Pular fins de semana (sexta, sábado, domingo)
    // Ou ajustar conforme sua lógica
    
    const resultado_sorteio = await sorteiarVoluntario(
      data,
      voluntarios,
      restricoes,
      escalasHistorico
    );

    if (resultado_sorteio) {
      resultado[data.toISOString().split('T')[0]] = resultado_sorteio.voluntario.id;
    }
  }

  return resultado;
}
