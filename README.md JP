# GAS Line Bot

このリポジトリは、Google Apps Script (GAS) を使用して実装されたLINEボットのコードを含んでいます。このボットは、ユーザーから送信されたメッセージに対応し、LINE Messaging APIによってトリガーされるさまざまなWebhookイベントを処理します。このボットを使うことで、LINE上でインタラクティブなチャットボットを作成し、ユーザー入力に自動的に応答することができます。

## 特徴

- **メッセージ処理**: LINEユーザーからのメッセージを受け取り、処理します。
- **ポストバックイベント対応**: ユーザーアクションによってトリガーされるポストバックイベントを処理します。
- **クイックリプライ**: 事前に定義されたクイックリプライオプションをユーザーに提供します。
- **リッチレスポンス**: テキスト、スタンプ、その他のマルチメディア形式のリッチレスポンスを送信できます。
- **エラーハンドリング**: カスタムのエラーログやエラーメッセージを処理します。

## 前提条件

- **Google Apps Script (GAS)** アカウントが必要です。
- **LINE Messaging API**: LINE Developerアカウントが必要です。また、メッセージングAPIを利用するためにチャンネルを設定する必要があります。
- **LINEチャネルアクセストークン**: このトークンは、LINEプラットフォームとボットを認証するために必要です。
- **LINEチャネルシークレット**: リクエストを検証するための、チャネル固有の識別子です。

## セットアップ手順

1. **リポジトリをクローン** するか、`linebot.js` の内容をGoogle Apps Scriptプロジェクトにコピーします。

2. **LINE Messaging APIを設定**: [LINE Developers Console](https://developers.line.biz/console/) にログインし、まだ作成していない場合は新しいチャネルを作成します。

3. **Webhook URLを設定**: LINE Developers Consoleで、Webhook URLにGoogle Apps ScriptのWebアプリURLを設定します。GASのデプロイ設定は「自分として実行」、アクセスレベルは「全員（匿名ユーザー含む）」に設定してください。

4. **環境変数の設定**:
   - `linebot.js` スクリプト内の以下の変数を更新します:
     - `LINE_CHANNEL_ACCESS_TOKEN`: LINEチャネルアクセストークン。
     - `LINE_CHANNEL_SECRET`: LINEチャネルシークレット。

5. **GASプロジェクトをWebアプリとしてデプロイ**:
   - Google Apps Scriptエディタで `デプロイ` → `新しいデプロイ` → `ウェブアプリ` を選択し、ステップ3で説明したように設定します。
   - WebアプリURLをコピーし、LINE Developers ConsoleのWebhook URLフィールドに貼り付けます。

6. **ボットをテスト**: LINEでボットにメッセージを送信し、適切に応答するか確認します。Google Apps Scriptのログを確認して、問題があればデバッグしてください。

## ファイルの概要

- `linebot.js`: LINE Messaging APIからのWebhookリクエストを処理するメインスクリプト。主な関数は以下の通りです:
  - `doPost(e)`: LINE APIからのPOSTリクエストを処理するエントリーポイント。
  - `handleMessageEvent(event)`: 受信したメッセージを処理し、ユーザーに応答します。
  - `handlePostbackEvent(event)`: クイックリプライや他のインタラクティブ機能によって送信されるポストバックデータを処理します。
  - `sendTextMessage(replyToken, message)`: ユーザーにテキストメッセージを返信します。

## 使用例

デプロイが完了すると、LINEユーザーが送信したメッセージにボットが自動的に応答します。ボットの応答内容や動作は、`handleMessageEvent` や `handlePostbackEvent` 関数を修正することでカスタマイズできます。

## 貢献

このプロジェクトに貢献したい場合は、プルリクエストを送信するか、イシューを作成してください。

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。詳細は `LICENSE` ファイルをご覧ください。
