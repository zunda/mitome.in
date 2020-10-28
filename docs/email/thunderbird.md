# Thunderbird
[Thunderbird](http://www.thunderbird.net/ja/)はGUIで利用しやすい電子メールクライアントで、[2020年夏にリリースされたバージョン78からOpenPGPの利用にプラグインが不要になりました](https://wiki.mozilla.org/Thunderbird:OpenPGP:2020)。

## インストール
バージョン78以上のThunderbirdは利用中のOSのパッケージとしてインストールできるかもしれません。Ubuntu 20.04では下記のコマンドでインストールできました。

```
$ sudo snap install thunderbird
```

[Thunderbirdのホームページ](http://www.thunderbird.net/ja/)の「無料ダウンロード」ボタンからダウンロードすることもできます。

## 設定
Thunderbirdを起動してウィザードに必要な情報を記入することで、利用を始めることができます。

![Thunderbirdの設定ウィザード](/thunderbird-config-wizard.png)

この例で利用するGmailアカウントでは2段階認証を有効にしているので、Thunderbirdでの[ログインにはアプリ パスワードを利用](https://support.google.com/mail/answer/185833?hl=ja)します。

さらに、[Gmailを設定してIMAPを有効に](https://support.google.com/mail/answer/7126229?hl=ja)します。

### 私有鍵の登録
まず、下記のような手順で自分の私有鍵をThunderbirdにインポートします。

GnuPGで自分の私有鍵のIDを確認します。

```
$ gpg --list-secret-keys
/home/zunda/.gnupg/pubring.kbx
------------------------------
sec   rsa3072 2020-06-24 [SC] [expires: 2022-06-24]
      F60960D80B224382CA8D831CB56C20316D6E8279
uid           [ultimate] zunda <zundan@gmail.com>
ssb   rsa3072 2020-06-24 [E] [expires: 2022-06-24]

```

確認したIDの私有鍵をGnuPGからエキスポートします。生成されたファイルは私有鍵を含みますので、漏洩してしまわないよう取り扱いに注意が必要です。

```
$ gpg --export-secret-keys F60960D80B224382CA8D831CB56C20316D6E8279 > private.pgp
```

Thunderbirdのメインウインドウの右上のハンバーガーメニューから、Account Settingsを選択し、操作対象のアカウントのEnd-To-End Encryptionを選択し、OpenPGP欄の右のAdd Key...ボタンをクリックします。Create a new OpenPGP Keyを選択することもできますが、本稿ではImport an existing OpenPGP Keyを選択して、作成しておいた私有鍵をインポートします。

![Thunderbirdへの私有鍵のインポート開始](/thunderbird-seckey-import-start.png)

Select File to Import...ボタンをクリックし、先ほど私有鍵をエキスポートして生成したファイルを選択し、Openボタンをクリックします。

![Thunderbirdへの私有鍵のインポートの確認](/thunderbird-import-select.png)

確認ダイアログが表示されるのでContinueボタンをクリックし、パスフレーズを入力します。

![Thunderbirdの私有鍵のインポートの完了](/thunderbird-import-confirm.png)

これでインポートが完了しました。もう一度Continueボタンを押します。今インポートした私有鍵をこのアカウントで利用するようラジオボタンを選択します。

![私有鍵のインポート後のアカウントの設定](/thunderbird-import-complete.png)

私有鍵を含むファイルは確実に消しておきましょう。

```
$ rm private.pgp
```

## 暗号化・電子署名したメールの送信
### 公開鍵の登録
送信先の公開鍵をThunderbirdに登録します。

Thunderbirdのメインウインドウの右上のハンバーガーメニューから、Tools - OpenPGP Key Managerを選択します。開いたウインドウのメニューから、Keyserver - Discover Keys Onlineを選択し、送信先のメールアドレスを入力します。

![送信先のメールアドレスの入力](/thunderbird-pubkey-email.png)

公開鍵サーバに公開鍵があれば、インポートするかどうか確認されます。

![インポートする公開鍵の確認](/thunderbird-pubkey-confirm.png)

公開鍵の指紋が正しいことを確認して、OKボタンをクリックします。

![インポートされた公開鍵の概要](/thunderbird-pubkey-complete.png)

インポートした公開鍵を右クリックし、Key Propertiesをクリックします。

![インポートされた公開鍵のプロパティ](/thunderbird-prop-pubkey.png)

公開鍵の指紋を確認して、信頼度を設定します。

![インポートされた公開鍵の信頼度の設定](/thunderbird-trust-pubkey.png)

### メールの作成
Writeボタンなどからメールを書くことができます。公開鍵を登録した送信先の場合には、Options - Require Encryptionを選択することができます。メールへの電子署名も有効になりました。

![メールの作成と暗号化の設定](/thunderbird-compose.png)

現状ではS/MIMEの設定はしていないので、暗号化にはOpenPGPを利用するようになっています。下のステータスバーの右端のアイコンでも確認できます。

![利用する暗号技術](/thunderbird-encryption-technology.png)

## 受信したメールの復号
私有鍵のある環境でメールを確認することで、メールを復号して読むことができます。

## 受信したメールの電子署名の検証

https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq
