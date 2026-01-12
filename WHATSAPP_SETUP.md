# 📱 Configurar WhatsApp com Twilio

## Passo a Passo

### 1. Criar Conta Twilio

1. Acesse [https://www.twilio.com](https://www.twilio.com)
2. Clique em **Sign Up**
3. Preencha seus dados e crie a conta
4. Confirme seu email

### 2. Configurar WhatsApp no Twilio

1. No painel Twilio, vá para **Messaging → Try it out → Send an SMS**
2. Ou acesse direto: **Messaging → Channels → WhatsApp**
3. Clique em **Set Up WhatsApp Sandbox**
4. Siga as instruções para conectar sua conta Twilio ao WhatsApp

### 3. Obter Credenciais

1. Vá para **Account → API Keys & tokens**
2. Copie:
   - **Account SID** 
   - **Auth Token**

3. Vá para **Messaging → Channels → WhatsApp → Sandbox**
4. Copie o número gerado (ex: `whatsapp:+1234567890`)

### 4. Configurar Variáveis de Ambiente

No arquivo `.env.local`, adicione:

```env
TWILIO_ACCOUNT_SID=seu_account_sid_aqui
TWILIO_AUTH_TOKEN=seu_auth_token_aqui
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

### 5. Conectar WhatsApp Sandbox

1. Salve seu número de telefone pessoal no telefone
2. Envie a mensagem `join kind-river` para o número Twilio
3. Você receberá uma confirmação

### 6. Usar no Sistema

1. Cadastre voluntários com **telefone** (ex: 85987654321)
2. Faça sorteio normalmente com "Sorteiar Mês"
3. Clique no botão **WhatsApp** para notificar todos
4. Os voluntários receberão a mensagem no WhatsApp

## ⚠️ Importante

- ✅ Cada voluntário **DEVE ter telefone cadastrado**
- ✅ Aceite os termos do Twilio WhatsApp Sandbox
- ✅ No sandbox, apenas telefones autorizados recebem mensagens
- ✅ Para produção, solicite aprovação do Twilio (pago)

## 📞 Formato de Telefone

Use o formato com código de país Brasil:
- ✅ `85987654321` (será convertido para `+5585987654321`)
- ✅ `5585987654321`
- ❌ `(85) 98765-4321` (será limpado automaticamente)

## 💰 Custos

- **Sandbox (teste)**: GRÁTIS
- **Produção**: ~R$ 0,50 - R$ 1,50 por mensagem (varia)

## 🆘 Troubleshooting

### "WhatsApp não configurado"
→ Verifique se as 3 variáveis estão em `.env.local`
→ Reinicie o servidor: `npm run dev`

### "Mensagem não chegou"
→ Autorize seu número no Twilio Sandbox
→ Certifique-se que o número está no formato correto
→ Verifique em `Messaging → Logs` no painel Twilio

### "Erro de autenticação"
→ Copie as credenciais exatamente (sem espaços)
→ Regenere o Auth Token se necessário

---

**Dúvidas? Consulte a documentação do Twilio: https://www.twilio.com/docs/whatsapp**
