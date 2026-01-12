import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Ex: whatsapp:+14155238886
const contentSid = process.env.TWILIO_CONTENT_SID; // Content template SID

if (!accountSid || !authToken || !whatsappNumber) {
  console.warn('⚠️ Variáveis Twilio não configuradas. WhatsApp desabilitado.');
}

const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function enviarWhatsApp(
  numeroDestino: string,
  nomeVoluntario: string,
  data: string,
  hora: string = '09:00'
): Promise<boolean> {
  try {
    if (!twilioClient || !whatsappNumber) {
      console.warn('WhatsApp não configurado. Mensagem não foi enviada.');
      return false;
    }

    // Garantir que o número começa com + e tem o código de país
    let numeroFormatado = numeroDestino.replace(/\D/g, '');
    if (!numeroFormatado.startsWith('55')) {
      numeroFormatado = '55' + numeroFormatado;
    }
    const whatsappDestino = `whatsapp:+${numeroFormatado}`;

    if (contentSid) {
      // Usar Content Template
      await twilioClient.messages.create({
        from: whatsappNumber,
        to: whatsappDestino,
        contentSid: contentSid,
        contentVariables: JSON.stringify({
          '1': nomeVoluntario,
          '2': data,
          '3': hora
        })
      });
    } else {
      // Fallback: enviar mensagem simples
      const mensagem = gerarMensagemEscala(nomeVoluntario, data);
      await twilioClient.messages.create({
        from: whatsappNumber,
        to: whatsappDestino,
        body: mensagem
      });
    }

    console.log(`✅ WhatsApp enviado para ${numeroFormatado}`);
    return true;
  } catch (erro) {
    console.error('❌ Erro ao enviar WhatsApp:', erro);
    return false;
  }
}

export function gerarMensagemEscala(
  nome: string,
  data: string
): string {
  return `👋 Olá ${nome}!\n\n📅 Você foi escalado para servir em:\n${data}\n\n🙏 Obrigado!\n\nLED Escala`;
    day: '2-digit',
    month: 'long'
  });

  return `👋 Olá ${nome}!\n\n📅 Você foi escalado para servir em:\n${dataFormatada} (${dia})\n\n🙏 Obrigado por sua disponibilidade!\n\nLED Escala`;
}
