# 📅 LED Escala - Sistema de Escala de Voluntários

Um sistema inteligente e justo para organizar voluntários da sua igreja. Sorteio automático que prioriza quem serviu menos.

## ✨ Funcionalidades

- ✅ **Cadastro de Voluntários** - Nome, email, telefone
- ✅ **Restrições** - Marcar dias/datas que não podem servir
- ✅ **Sorteio Justo** - Prioriza voluntários menos escalados
- ✅ **Calendário Mensal** - Visualize toda a escala
- ✅ **Edição Manual** - Ajuste escalas após sorteio
- ✅ **Exportar/Imprimir** - PDF ou impressão direta

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 + React + Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: Supabase (PostgreSQL)
- **Utilitários**: FullCalendar, jsPDF, html2canvas, lucide-react

## 🚀 Como Começar

### 1. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Na aba SQL, execute o arquivo `supabase.sql` para criar as tabelas
3. Copie sua URL e chave anônima

### 2. Variáveis de Ambiente

Crie arquivo `.env.local` (copie de `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### 3. Instalar Dependências

```bash
npm install
```

### 4. Executar Projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📖 Como Usar

### Passo 1: Cadastrar Voluntários
1. Vá para **Voluntários**
2. Preencha nome, email (opcional), telefone (opcional)
3. Clique em "Adicionar Voluntário"

### Passo 2: Definir Restrições (Opcional)
1. Abra um voluntário
2. Marque dias da semana ou datas específicas que não pode servir
3. Salvar

### Passo 3: Sorteio Automático
1. Vá para **Calendário**
2. Selecione mês/ano
3. Clique em "Sorteiar Mês"
4. ✨ A escala é preenchida automaticamente!

### Passo 4: Ajustes Manuais
1. Clique em um dia do calendário
2. Edite o voluntário manualmente se necessário

### Passo 5: Exportar/Imprimir
1. No calendário, clique em:
   - **Exportar PDF** → Baixa arquivo
   - **Imprimir** → Abre diálogo de impressão

## 🧠 Lógica do Sorteio

O algoritmo implementa um sorteio **justo e transparente**:

1. **Filtra aptos** → Voluntários disponíveis no dia (sem restrições)
2. **Conta serviços** → Quantas vezes cada um já foi escalado
3. **Prioriza menos** → Seleciona entre os menos escalados
4. **Embaralha** → Se houver empate, sorteia entre eles
5. **Respeita restrições** → Nunca viola restrições de indisponibilidade

**Resultado**: Um sistema justo onde todos servem de forma equilibrada.

## 📁 Estrutura do Projeto

```
led/
├── app/
│   ├── api/
│   │   ├── sorteio/          # Endpoints de sorteio
│   │   ├── voluntarios/       # CRUD de voluntários
│   │   └── restricoes/        # CRUD de restrições
│   ├── page.tsx              # Home
│   ├── voluntarios/
│   │   └── page.tsx          # Gestão de voluntários
│   └── calendario/
│       └── page.tsx          # Calendário mensal
├── lib/
│   ├── types.ts              # Tipos TypeScript
│   ├── supabase.ts           # Cliente Supabase
│   ├── sorteio.ts            # Lógica de sorteio
│   └── export.ts             # Exportar PDF/Print
├── supabase.sql              # Schema do banco
├── .env.example              # Template de env
└── package.json
```

## 🔐 Segurança

- Variáveis de ambiente nunca são expostas
- Supabase RLS pode ser ativado para multi-tenant
- API routes validam dados antes de salvar

## 📈 Possíveis Expansões

- [ ] Autenticação de usuários
- [ ] Dashboard com estatísticas
- [ ] Notificações por email/WhatsApp
- [ ] Histórico e relatórios
- [ ] Temas personalizados
- [ ] Multi-idioma

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato!

## 📄 Licença

Livre para usar e modificar em sua igreja.

---

**Desenvolvido com ❤️ para servir sua comunidade**
