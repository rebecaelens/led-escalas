// Tipos principais do sistema
export interface Voluntario {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Restricao {
  id: string;
  voluntario_id: string;
  dia_semana?: number; // 0-6 (domingo-sábado)
  data_especifica?: string; // YYYY-MM-DD
  descricao?: string;
  created_at: string;
}

export interface Escala {
  id: string;
  voluntario_id: string;
  data: string; // YYYY-MM-DD
  mes: number;
  ano: number;
  observacoes?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface HistoricoServico {
  id: string;
  voluntario_id: string;
  data: string;
  sorteado: boolean;
  ajustado_manualmente: boolean;
  created_at: string;
}

export interface SorteioResult {
  data: string;
  voluntario_id: string;
  voluntario_nome: string;
  justificativa: string;
}
