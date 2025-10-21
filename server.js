import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { appendToSheet } from './googleSheets.js';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Permite requisições do seu frontend
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Rota de verificação (health check) para a raiz do servidor
app.get('/', (req, res) => {
    res.status(200).send('Servidor de briefing está no ar e pronto para receber dados!');
});

// Rota principal da API para receber o briefing
app.post('/api/submit-briefing', async (req, res) => {
    try {
        const formData = req.body;
        console.log('Dados do formulário recebidos:', formData);

        // Adiciona os dados à planilha do Google Sheets
        await appendToSheet(formData);
        console.log('Dados adicionados à planilha com sucesso.');

        // Retorna uma resposta de sucesso para o frontend
        res.status(200).json({ message: 'Briefing adicionado à planilha com sucesso!' });

    } catch (error) {
        console.error('Erro ao adicionar à planilha:', error);
        res.status(500).json({ message: 'Ocorreu um erro no servidor. Verifique os logs.' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

