# 🔔 Sistema de Notificações Real

As notificações agora são **100% reais** e integradas com o banco de dados Supabase!

## 📋 Como Funciona

### ✅ Notificações São Criadas Automaticamente Quando:

1. **Um novo voluntário é adicionado** → Notificação de sucesso
2. **Um voluntário é atualizado** → Notificação de info
3. **Um voluntário é deletado** → Notificação de erro
4. **Uma escala é criada manualmente** → Notificação de sucesso
5. **Uma escala é sorteada** → Notificação de sucesso

### 🗑️ Limpeza Real

Quando você clica em **"Limpar tudo"** ou **"Deletar"**, as notificações são:
- ✅ Deletadas do banco de dados Supabase
- ✅ Removidas permanentemente (não voltam ao recarregar a página)
- ✅ Sincronizadas em tempo real

## 🛠️ Configuração

### 1️⃣ Criar a Tabela no Supabase

Acesse seu projeto Supabase → SQL Editor e execute o script:

```sql
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

-- Criar índices
CREATE INDEX idx_notificacoes_lida ON notificacoes(lida);
CREATE INDEX idx_notificacoes_criada_em ON notificacoes(criada_em DESC);

-- Ativar Row Level Security
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "notificacoes_select" ON notificacoes FOR SELECT USING (true);
CREATE POLICY "notificacoes_insert" ON notificacoes FOR INSERT WITH CHECK (true);
CREATE POLICY "notificacoes_update" ON notificacoes FOR UPDATE USING (true);
CREATE POLICY "notificacoes_delete" ON notificacoes FOR DELETE USING (true);
```

### 2️⃣ Pronto!

Agora todas as ações do sistema criarão notificações reais automaticamente!

## 📝 API de Notificações

### GET `/api/notificacoes`
Busca todas as notificações do banco de dados

```bash
curl https://seu-app.com/api/notificacoes
```

**Resposta:**
```json
{
  "sucesso": true,
  "notificacoes": [
    {
      "id": "uuid-1",
      "tipo": "sucesso",
      "titulo": "Novo Voluntário",
      "mensagem": "João Silva foi adicionado ao sistema",
      "lida": false,
      "criada_em": "2026-01-12T10:30:00.000Z"
    }
  ]
}
```

### POST `/api/notificacoes`
Criar uma notificação manualmente

```bash
curl -X POST https://seu-app.com/api/notificacoes \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "info",
    "titulo": "Aviso",
    "mensagem": "Sua mensagem aqui",
    "lida": false
  }'
```

### PATCH `/api/notificacoes`
Marcar como lida

```bash
curl -X PATCH https://seu-app.com/api/notificacoes \
  -H "Content-Type: application/json" \
  -d '{
    "id": "uuid-da-notificacao",
    "lida": true
  }'
```

### DELETE `/api/notificacoes?id=uuid`
Deletar uma notificação específica

```bash
curl -X DELETE https://seu-app.com/api/notificacoes?id=uuid-da-notificacao
```

### DELETE `/api/notificacoes`
Deletar TODAS as notificações (use com cuidado!)

```bash
curl -X DELETE https://seu-app.com/api/notificacoes
```

## 🔄 Auto-Atualização

A página de notificações se atualiza automaticamente a cada **5 segundos**, então você verá novas notificações em tempo real conforme outras ações acontecem no sistema!

## 🎯 Tipos de Notificação

| Tipo | Ícone | Cor | Uso |
|------|-------|-----|-----|
| `sucesso` | ✅ | Verde | Voluntário adicionado, escala criada |
| `erro` | ❌ | Vermelho | Voluntário deletado |
| `info` | ℹ️ | Azul | Voluntário atualizado |
| `aviso` | ⚠️ | Amarelo | Avisos gerais |

## 📱 Página de Notificações

Acesse em `/notificacoes` para:
- ✅ Ver todas as notificações do banco de dados
- ✅ Filtrar por lidas/não-lidas
- ✅ Marcar como lida
- ✅ Deletar individual ou em lote
- ✅ Exportar em CSV (opcional)

---

**Pronto! Seu sistema de notificações agora é 100% real!** 🎉
