import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Autentica e retorna um cliente da API do Google Sheets.
 */
async function getAuthClient() {
    // As credenciais são lidas da variável de ambiente como uma string JSON
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
    
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    return auth.getClient();
}

/**
 * Adiciona os dados do formulário a uma nova linha na planilha.
 * @param {object} formData - Os dados recebidos do formulário de briefing.
 */
export async function appendToSheet(formData) {
    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const spreadsheetId = process.env.SPREADSHEET_ID;
    const sheetName = process.env.SHEET_NAME || 'Briefings';

    // IMPORTANTE: A ordem dos dados neste array DEVE ser a mesma
    // da ordem das colunas (cabeçalho) na sua planilha.
    const row = [
        new Date().toLocaleString("pt-BR"), // Data e Hora do Envio
        formData.client_name,
        formData.client_email,
        formData.service_name,
        formData.brand_name,
        formData.brand_instagram,
        formData.brand_niche,
        formData.brand_products,
        formData.target_audience,
        formData.project_goals,
        formData.brand_adjectives,
        formData.brand_references,
        formData.brand_avoid,
        formData.content_info,
    ];

    // Adiciona a nova linha à planilha
    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A1`, // O range A1 faz com que a API adicione após a última linha preenchida
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [row],
        },
    });
}

