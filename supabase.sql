-- Tabela de Voluntários
CREATE TABLE voluntarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Restrições (dias que não podem servir)
CREATE TABLE restricoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voluntario_id UUID NOT NULL REFERENCES voluntarios(id) ON DELETE CASCADE,
  dia_semana INTEGER, -- 0=domingo, 1=segunda, ..., 6=sábado
  data_especifica DATE, -- Para restrições de data única
  descricao TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Notificações
CREATE TABLE notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('sucesso', 'erro', 'info', 'aviso')),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  criada_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizada_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance (idempotentes)
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(lida);
CREATE INDEX IF NOT EXISTS idx_notificacoes_criada_em ON notificacoes(criada_em DESC);

-- Tabela de Escalas
CREATE TABLE escalas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voluntario_id UUID NOT NULL REFERENCES voluntarios(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  observacoes TEXT,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  UNIQUE(data) -- Uma pessoa por dia
);

-- Tabela de Histórico de Serviços (para análise)
CREATE TABLE historico_servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voluntario_id UUID NOT NULL REFERENCES voluntarios(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  sorteado BOOLEAN DEFAULT TRUE,
  ajustado_manualmente BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_escalas_mes_ano ON escalas(mes, ano);
CREATE INDEX idx_escalas_voluntario ON escalas(voluntario_id);
CREATE INDEX idx_restricoes_voluntario ON restricoes(voluntario_id);
CREATE INDEX idx_historico_voluntario ON historico_servicos(voluntario_id);

-- RLS (Row Level Security) - opcional, ativar conforme necessidade
ALTER TABLE voluntarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalas ENABLE ROW LEVEL SECURITY;
ALTER TABLE restricoes ENABLE ROW LEVEL SECURITY;
