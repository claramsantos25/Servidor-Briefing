import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configura o "transportador" de e-mail usando Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: parseInt(process.env.EMAIL_PORT, 10) === 465, // `true` para porta 465, `false` para as outras
    auth: {
        user: process.env.EMAIL_USER, // Seu e-mail
        pass: process.env.EMAIL_PASS, // Sua senha de aplicativo
    },
});

/**
 * Gera o conteúdo HTML do e-mail de notificação.
 * @param {object} data - Os dados do formulário.
 * @returns {string} - O HTML do e-mail.
 */
function generateHtml(data) {
    // Este é o mesmo template de e-mail de antes, agora com as variáveis do servidor
    return `
    <div style="font-family: Inter, Arial, sans-serif; background-color: #fdf7ff; padding: 20px; color: #4a3b5a;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #f0d9ff;">
            <div style="background-color: #a13ee2; color: #ffffff; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">✨ Novo Briefing Recebido!</h1>
            </div>
            <div style="padding: 20px 30px;">
                <p style="font-size: 16px;">Olá Cla,</p>
                <p style="font-size: 16px;">Você recebeu um novo briefing para o projeto <strong>"${data.service_name}"</strong> de <strong>${data.client_name}</strong>.</p>
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
                <h2 style="font-size: 18px; color: #2c1d3e; border-bottom: 2px solid #f0d9ff; padding-bottom: 5px; margin-bottom: 15px;">Dados do Cliente</h2>
                <p style="font-size: 16px; line-height: 1.6;"><strong>Nome:</strong> ${data.client_name}<br><strong>Email:</strong> ${data.client_email}<br><strong>Serviço:</strong> ${data.service_name}</p>
                <h2 style="font-size: 18px; color: #2c1d3e; border-bottom: 2px solid #f0d9ff; padding-bottom: 5px; margin-top: 30px; margin-bottom: 15px;">Respostas do Briefing</h2>
                <h3 style="font-size: 16px; color: #7b2f9c; margin-top: 20px;">Sobre a Marca</h3>
                <div style="font-size: 15px; line-height: 1.6; background-color: #fdf7ff; padding: 12px; border-radius: 8px;"><strong>Nome da Marca:</strong> ${data.brand_name}<br><strong>Instagram:</strong> ${data.brand_instagram}<br><strong>Nicho:</strong> ${data.brand_niche}<br><strong>Produtos/Serviços:</strong> ${data.brand_products}</div>
                <h3 style="font-size: 16px; color: #7b2f9c; margin-top: 20px;">Público-Alvo</h3>
                <div style="font-size: 15px; line-height: 1.6; background-color: #fdf7ff; padding: 12px; border-radius: 8px;">${data.target_audience}</div>
                <h3 style="font-size: 16px; color: #7b2f9c; margin-top: 20px;">Objetivos do Projeto</h3>
                <div style="font-size: 15px; line-height: 1.6; background-color: #fdf7ff; padding: 12px; border-radius: 8px;">${data.project_goals}</div>
                <h3 style="font-size: 16px; color: #7b2f9c; margin-top: 20px;">Estilo e Preferências</h3>
                <div style="font-size: 15px; line-height: 1.6; background-color: #fdf7ff; padding: 12px; border-radius: 8px;"><strong>3 Adjetivos:</strong> ${data.brand_adjectives}<br><strong>Referências:</strong> ${data.brand_references}<br><strong>O que evitar:</strong> ${data.brand_avoid}</div>
                <h3 style="font-size: 16px; color: #7b2f9c; margin-top: 20px;">Conteúdo e Informações</h3>
                <div style="font-size: 15px; line-height: 1.6; background-color: #fdf7ff; padding: 12px; border-radius: 8px;">${data.content_info}</div>
            </div>
            <div style="background-color: #f8f9fa; padding: 15px 30px; text-align: center; font-size: 12px; color: #888;">
                <p style="margin:0;">Este é um e-mail automático enviado pelo formulário de briefing do seu site.</p>
            </div>
        </div>
    </div>`;
}

/**
 * Envia o e-mail de notificação.
 * @param {object} formData - Os dados do formulário.
 */
export async function sendBriefingEmail(formData) {
    const mailOptions = {
        from: `"${formData.client_name} via Briefing" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `Novo Briefing de ${formData.client_name} para "${formData.service_name}"`,
        html: generateHtml(formData),
    };

    await transporter.sendMail(mailOptions);
}
