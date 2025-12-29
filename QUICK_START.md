# 🚀 Guia Rápido de Setup - LED Escala

## ⚡ 3 Passos para Colocar em Funcionamento

### PASSO 1: Setup Supabase (10 min)

```bash
# 1. Acesse https://supabase.com
# 2. Clique em "New Project"
# 3. Preencha os dados:
#    - Project name: "LED Escala" (ou outro nome)
#    - Database password: (gere uma senha forte)
#    - Region: us-east-1 (ou mais próximo de você)
# 4. Aguarde criação (≈2 min)

# 5. Na aba "SQL Editor", clique em "+New Query"
# 6. Copie TUDO do arquivo supabase.sql
# 7. Cole na query do Supabase
# 8. Clique "Run"

# 9. Vá para "Settings" → "API"
# 10. Copie:
#     - Project URL
#     - Anon Key (public)
```

### PASSO 2: Configurar Projeto (2 min)

```bash
# No seu terminal, dentro da pasta led/:

# 1. Copie o template
cp .env.example .env.local

# 2. Edite .env.local e cole os valores do Supabase:
#    NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
#    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon

# 3. Salve o arquivo
```

### PASSO 3: Rodar Localmente (1 min)

```bash
# No seu terminal:

# 1. Instale dependências (já feito, mas caso falte:)
npm install

# 2. Inicie o servidor
npm run dev

# 3. Abra http://localhost:3000
# 🎉 Pronto! Sistema rodando localmente
```

---

## ✅ Verificar se Está Funcionando

Quando abrir http://localhost:3000 você deve ver:
- ✅ Logo "LED Escala" no topo
- ✅ 4 cards de funcionalidades
- ✅ Guia passo-a-passo visual

Clique em "Voluntários":
- ✅ Formulário para adicionar voluntário
- ✅ Tabela vazia (nenhum cadastrado ainda)

---

## 🎮 Teste Rápido

```
1. Vá em "Voluntários"
2. Adicione 3 voluntários:
   - João
   - Maria
   - Pedro

3. Vá em "Calendário"
4. Clique "Sorteiar Mês"
5. Veja a magia acontecer! ✨

6. Clique "Exportar PDF" para testar
```

---

## 🆘 Se Algo Não Funcionar

### "Não consigo acessar localhost:3000"
```bash
# Verifique se o servidor está rodando:
npm run dev

# Deve aparecer:
# ▲ Next.js 16.x
# - Local: http://localhost:3000
```

### "Erro de conexão ao banco"
```bash
# 1. Verifique se as variáveis estão em .env.local
# 2. Copie exatamente do Supabase (sem espaços)
# 3. Reinicie o servidor: Ctrl+C e `npm run dev` novamente
```

### "Calendário vazio após sorteio"
```bash
# 1. Certifique-se que tem voluntários cadastrados
# 2. Clique "Sorteiar Mês" novamente
# 3. Mude de mês e volte
# 4. Refresque a página (Ctrl+R ou Cmd+R)
```

### "Erro ao exportar PDF"
```bash
# Esse é o navegador sendo restritivo
# Tente com Chrome/Chromium
# Ou use a função "Imprimir" em vez disso
```

---

## 📦 Para Produção (Depois)

Quando quiser colocar no ar:

```bash
# 1. Deploy no Vercel (recomendado para Next.js)
npm i -g vercel
vercel

# 2. Ou no seu próprio servidor:
npm run build
npm start
```

---

## 📞 Dicas Importantes

- ✅ Use **Chrome/Brave** para melhor compatibilidade
- ✅ Não compartilhe seu `.env.local` (contém chaves secretas!)
- ✅ Se quiser rodar em outro computador, configure `.env.local` nele também
- ✅ O banco fica na nuvem, então funciona de qualquer lugar

---

## 🎓 Como o Sistema Funciona (Resumido)

```
Você acessa → Next.js (Frontend)
             ↓
           API Routes (Backend)
             ↓
           Supabase (Banco PostgreSQL)
             ↓
           Dados salvos ✅
```

Quando clica "Sorteiar Mês":
```
Pega todos voluntários
     ↓
Conta quantas vezes cada um foi escalado
     ↓
Prioriza os que serviram menos
     ↓
Preenche o calendário automaticamente
     ↓
Salva no banco
     ↓
Mostra na tela 🎉
```

---

**Dúvidas? Leia o README.md ou SETUP_SUMMARY.md**

**Boa sorte! 🙏**
