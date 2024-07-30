// スクリプトプロパティからAPIキーとLINEアクセストークンを取得
const scriptProperties = PropertiesService.getScriptProperties();
const OPENAI_API_KEY = scriptProperties.getProperty('OPENAI_API_KEY');
const LINE_ACCESS_TOKEN = scriptProperties.getProperty('LINE_ACCESS_TOKEN');
const SPREADSHEET_ID = scriptProperties.getProperty('SPREADSHEET_ID');

// ボットの性格を設定
const BOT_PERSONALITY = "ここにプロンプトを入れる";

// doPost関数：LINEからのPOSTリクエストを処理
function doPost(e) {
  try {
    Logger.log(`Event data: ${JSON.stringify(e)}`);
    if (!e.postData) {
      throw new Error("No post data received");
    }
    const contents = JSON.parse(e.postData.contents);
    Logger.log(`Parsed contents: ${JSON.stringify(contents)}`);
    const events = contents.events;

    events.forEach(event => {
      const replyToken = event.replyToken;
      const userId = event.source.userId;
      const userMessage = event.message.text;

      const replyMessage = getReplyMessage(userId, userMessage);
      Logger.log(`Reply message: ${replyMessage}`);
      replyToUser(replyToken, replyMessage);

      // 会話履歴にユーザーメッセージとボットの返信を追加
      addMessageToHistory(userId, { role: 'user', content: userMessage });
      addMessageToHistory(userId, { role: 'assistant', content: replyMessage });

      // 会話ログをスプレッドシートに記録
      logConversation(userId, 'user', userMessage);
      logConversation(userId, 'assistant', replyMessage);
    });

    // 成功時にステータスコード200を返す
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // エラーハンドリング
    Logger.log(error);
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 会話履歴を取得
function getConversationHistory(userId) {
  const history = PropertiesService.getUserProperties().getProperty(userId);
  if (history) {
    return JSON.parse(history);
  } else {
    return [];
  }
}

// 会話履歴にメッセージを追加
function addMessageToHistory(userId, message) {
  let history = getConversationHistory(userId);
  history.push(message);
  if (history.length > 10) { // 最新の5つの会話（各ロールで10メッセージ）
    history.shift(); // 古いメッセージを削除
  }
  PropertiesService.getUserProperties().setProperty(userId, JSON.stringify(history));
}

// 会話ログをスプレッドシートに記録
function logConversation(userId, role, message) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('会話ログ');
  const timestamp = new Date();
  sheet.appendRow([timestamp, userId, role, message]);
}

// スプレッドシートからの回答を取得し、LLMに渡して最終回答を生成
function getReplyMessage(userId, userMessage) {
  Logger.log(`Fetching reply for message: ${userMessage}`);
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('QAデータ');
  const data = sheet.getDataRange().getValues();
  Logger.log(`Spreadsheet data: ${JSON.stringify(data)}`);

  let relevantQA = '';

  for (let i = 1; i < data.length; i++) { // 1行目はヘッダーのためスキップ
    const question = data[i][0];
    const answer = data[i][1];

    if (userMessage.includes(question)) {
      relevantQA += `質問: ${question}\n回答: ${answer}\n\n`;
    }
  }

  // 会話履歴を取得
  let conversationHistory = getConversationHistory(userId);

  // スプレッドシートに一致する質問がある場合、その情報を基にGPT-4を使用
  if (relevantQA) {
    return getReplyMessageFromGPT(conversationHistory, userMessage, relevantQA);
  } else {
    // 一致する質問がない場合もGPT-4を使用
    return getReplyMessageFromGPT(conversationHistory, userMessage);
  }
}

// GPT-4モデルからの回答を取得
function getReplyMessageFromGPT(conversationHistory, userMessage, relevantQA = '') {
  Logger.log(`Fetching GPT-4 response for message: ${userMessage}`);
  const url = 'https://api.openai.com/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + OPENAI_API_KEY
  };
  const messages = [
    { role: 'system', content: BOT_PERSONALITY },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  if (relevantQA) {
    messages.push({ role: 'system', content: `以下は参考情報です。\n\n${relevantQA}` });
  }

  const postData = {
    model: "gpt-4o-mini",
    messages: messages,
    max_tokens: 3000
  };

  const options = {
    method: 'post',
    headers: headers,
    payload: JSON.stringify(postData)
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    Logger.log(`GPT Response: ${JSON.stringify(json)}`);

    return json.choices[0].message.content.trim();
  } catch (error) {
    Logger.log(error);
    return "申し訳ありませんが、現在お答えできません。";
  }
}

// ユーザーに返信
function replyToUser(replyToken, message) {
  Logger.log(`Sending reply to user: ${message}`);
  const url = 'https://api.line.me/v2/bot/message/reply';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + LINE_ACCESS_TOKEN
  };
  const postData = {
    replyToken: replyToken,
    messages: [{
      type: 'text',
      text: message
    }]
  };

  const options = {
    method: 'post',
    headers: headers,
    payload: JSON.stringify(postData)
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log(`LINE Reply Response: ${response.getContentText()}`);
  } catch (error) {
    Logger.log(error);
  }
}