# FlowCrypt
[FlowCrypt](https://flowcrypt.com/)はGmailでPGP暗号を利用できるようにするブラウザ拡張機能で、執筆時には[FirefoxやChromeのエクステンションやAndroidのアプリとして利用可能](https://flowcrypt.com/download)です。ここでは、Chromeの拡張機能の利用例を紹介します。

## インストール
FlowCryptのブラウザ拡張機能は、[FlowCryptのホームページ](https://flowcrypt.com/)から「Get Chrome Extension」ボタンをクリックすることで、Chrome Web Storeからインストールできます。

## 初期設定
ブラウザ拡張機能の設定メニューから設定を始めます。

![FlowCryptの設定開始](/flowcrypt-start.png)

指示に従ってGmailにログインし、拡張機能からのアクセスを許可します。

![FlowCryptへのアクセス許可](/flowcrypt-access.png)

今回は、[先に生成した鍵対](keyManagement.md)をインポートします。

![FlowCryptの鍵対の設定](/flowcrypt-setup-keypair.png)

下記のコマンドでASCII Armor形式になった私有鍵が表示されるので、「Paste arrmored key directly」を選択してコピーペーストします。デフォルトでは、公開鍵がFlowCryptにアップロードされます。

```
$ gpg --export-secret-keys --armor
```

![FlowCryptへの私有鍵の設定](/flowcrypt-setup-private-key.png)

## メールの暗号化と復号
設定を終えてGmailのInboxを確認するとFlowCryptからの最初の暗号化メールが届いていました。

![FlowCryptからの最初のメール](/flowcrypt-first-email.png)

Secure Composeボタンから、メールを書き、暗号化や電子署名を施して送ることができます。

![FlowCryptでの電子メールの送信](/flowcrypt-compose.png)

FlowCryptによって暗号化された電子メールは、FlowCryptによって自動的に復号されます。残念ながら、現状では、Muttでは自動的な処理はおこなわないようです。

![FlowCryptからの電子メールのMuttでの閲覧](/flowcrypt-mutt.png)
