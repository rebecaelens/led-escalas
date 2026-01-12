-- Script para criar tabela de notificações no Supabase
-- Execute este script no Supabase SQL Editor

-- Criar tabela de notificações
CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('sucesso', 'erro', 'info', 'aviso')),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  criada_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizada_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(lida);

CREATE INDEX IF NOT EXISTS idx_notificacoes_criada_em ON notificacoes(criada_em DESC);

-- Ativar Row Level Security
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

-- Política para leitura (todos podem ver)
CREATE POLICY "notificacoes_select" ON notificacoes
  FOR SELECT USING (true);

-- Política para inserção (qualquer um pode inserir)
CREATE POLICY "notificacoes_insert" ON notificacoes
  FOR INSERT WITH CHECK (true);

-- Política para atualização (qualquer um pode atualizar)
CREATE POLICY "notificacoes_update" ON notificacoes
  FOR UPDATE USING (true);

-- Política para deleção (qualquer um pode deletar)
CREATE POLICY "notificacoes_delete" ON notificacoes
  FOR DELETE USING (true);

-- Fim do script
