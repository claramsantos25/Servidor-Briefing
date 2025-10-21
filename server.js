import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { appendToSheet } from './googleSheets.js';
import { sendBriefingEmail } from './email.js';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Permite requisições do seu frontend
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Rota principal da API para receber o briefing
app.post('/api/submit-briefing', async (req, res) => {
    try {
        const formData = req.body;
        console.log('Dados do formulário recebidos:', formData);

        // 1. Adiciona os dados à planilha do Google Sheets
        await appendToSheet(formData);
        console.log('Dados adicionados à planilha com sucesso.');

        // 2. Envia o e-mail de notificação com os dados
        await sendBriefingEmail(formData);
        console.log('E-mail de notificação enviado com sucesso.');

        // 3. Retorna uma resposta de sucesso para o frontend
        res.status(200).json({ message: 'Briefing enviado com sucesso!' });

    } catch (error) {
        console.error('Erro ao processar o briefing:', error);
        res.status(500).json({ message: 'Ocorreu um erro no servidor. Verifique os logs.' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
