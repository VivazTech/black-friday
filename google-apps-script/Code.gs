/**
 * Black Friday Vivaz Cataratas — integração do site com a planilha.
 *
 * Instalação (ver README do projeto):
 * 1. Na planilha: Extensões > Apps Script, cole este arquivo.
 * 2. Em Configurações do projeto > Propriedades do script, crie SECRET com o mesmo
 *    valor de SHEETS_WEBHOOK_SECRET do site.
 * 3. Implantar > Nova implantação > App da Web, executar como "Eu", acesso "Qualquer pessoa".
 * 4. Copie a URL terminada em /exec para SHEETS_WEBHOOK_URL.
 */
const LEADS_SHEET = 'Cadastros';
const CONFIG_SHEET = 'Config';
const LEAD_HEADERS = ['Data', 'Nome', 'Sobrenome', 'E-mail', 'País', 'WhatsApp', 'Idioma'];
const MODES = ['pre-venda', 'vendas-abertas'];

function sheet_(name, headers) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(name);
  if (!sheet) {
    sheet = book.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

// Impede que um valor digitado pelo visitante seja interpretado como fórmula.
function text_(value) {
  const text = String(value == null ? '' : value).slice(0, 300);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function readMode_() {
  const value = sheet_(CONFIG_SHEET, ['Chave', 'Valor', 'Atualizado em']).getRange('B2').getValue();
  return MODES.indexOf(value) >= 0 ? value : null;
}

// Leitura pública: informa apenas qual página está no ar.
function doGet() {
  return json_({ ok: true, mode: readMode_() || 'pre-venda' });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (error) {
    return json_({ ok: false, error: 'invalid-json' });
  }
  const secret = PropertiesService.getScriptProperties().getProperty('SECRET');
  if (!secret || body.secret !== secret) return json_({ ok: false, error: 'unauthorized' });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (body.action === 'lead') {
      sheet_(LEADS_SHEET, LEAD_HEADERS).appendRow([
        new Date(),
        text_(body.nome),
        text_(body.sobrenome),
        text_(body.email),
        text_(body.pais),
        text_(body.whatsapp),
        text_(body.idioma),
      ]);
      return json_({ ok: true });
    }
    if (body.action === 'setMode') {
      if (MODES.indexOf(body.mode) < 0) return json_({ ok: false, error: 'invalid-mode' });
      const config = sheet_(CONFIG_SHEET, ['Chave', 'Valor', 'Atualizado em']);
      config.getRange('A2:C2').setValues([['modo', body.mode, new Date()]]);
      return json_({ ok: true, mode: body.mode });
    }
    return json_({ ok: false, error: 'unknown-action' });
  } finally {
    lock.releaseLock();
  }
}
