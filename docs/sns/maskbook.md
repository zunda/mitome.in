# Mask Network
[Mask Network](https://mask.io/) (Maskbook)はFacebookやTwitterを通じて暗号化されたメッセージをやりとりすることのできるブラウザ拡張機能で、執筆時にはChrome系、Ecge、Firefoxで利用できます。ここでは、Chromeの拡張機能をTwitterで利用^[[2020年7月15日に起きたセキュリティインシデント](https://blog.twitter.com/en_us/topics/company/2020/an-update-on-our-security-incident.html)を受けて、[Mask NetworkによるTwitterへの投稿ができなくなっている](https://twitter.com/realmaskbook/status/1283772518508052480)可能性があります]する例を紹介します。

## インストール
Mask Networkのブラウザ拡張機能は、[Mask Networkのホームページ](https://mask.io/)から「Install」ボタンをクリックすることで、Chrome Web Storeからインストールできます。[Mask Networkのプライバシーポリシー](https://legal.mask.io/maskbook/)に同意すると、新規に設定を始めるかバックアップから設定をインポートするか選択できます。

![Welcome to Mask Network](/maskbook-start.png)

## 初期設定
今回はNew UserとしてSet upボタンをクリックします。まずMask Networkでのペルソナの名前を入力します。新しい鍵対も生成されるようです。

![Persona name](/maskbook-persona.png)

設定したペルソナをFacebookやTwitterと連携できます。Twitterと連携してみます。

![Connect sns](/maskbook-connect.png)

ブラウザ拡張機能がtwitter.comとのやりとりを読んだり変更したりすることを許可します。

![Permissin](/maskbook-permission.png)

ブラウザでログインしているプロファイルとの連携が進みます。

![Confirm on Twitter](/maskbook-twitter-confirmation.png)

公開鍵をプロファイルに公開します。

![Public key on Twitter](/maskbook-twitter-pubkey.png)

と思いましたが、今回はもともと書かれていたURLがTwitterによって省略されてしまいました。手で修正しておきます。公開鍵の前後の文字は、U+1F3AD (Prforming Arts)だそうです。仮面舞踏会かな？

![Edit bio on Twitter](/maskbook-twitter-bio.png)

## ツイートの暗号化
Twitterのツイートする部分にCompose encrypted postというリンクが表われます。これをクリックすると、暗号化したツイートを作成することができます。ここではEveryone向けに暗号化してみます。

![Tweet](/maskbook-twitter-tweet.png)

暗号文がURLのクエリ文字列に含まれるツイートが生成されます。

![Encrypted tweet](/maskbook-twitter-encrypted.png)

## 暗号化したツイートの閲覧
Mask Networkをインストールしたブラウザからは、ツイートの内容が復号され電子署名も検証された状態でツイートの内容を閲覧できます。

![Decrypted tweet](/maskbook-twitter-decrypted.png)

Mask Networkをインストールしていないブラウザからは、ツイートの内容に含まれるURLでMask Networkのインストールを促されます。

![View without eextension](/maskbook-twitter-noinstall.png)

## ステガノグラフィー
Mask Networkはツイートを暗号化して添付画像に隠すこともできます。

Compose encrypted postからImage Payloadを有効にして、ツイートを作成します。

![Enable Image Payload](/maskbook-twitter-image.png)

ツイートと一緒に画像が投稿されます。

![Tweet with an image](/maskbook-twitter-post.png)

Mask Networkをインストールしたブラウザからは、URLに暗号化したものと同様、ツイートの内容が復号され電子署名も検証された状態でツイートの内容を閲覧できます。

![Decrypted tweet from image](/maskbook-twitter-image-decrypt.png)

## 設定のバックアップ
Mask Networkの私有鍵はブラウザ拡張機能の設定として保存されています。失なわれてしまわないように、バックアップしておきます。ブラウザ拡張機能の設定メニューからMask NetworkのOptionをクリックし、スクロールしてBackupボタンを押します。

![Backup](/maskbook-backup.png)

JSONファイルとして私有鍵を含む設定内容がダウンロードされます。
