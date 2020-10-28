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

Thunderbirdのメインウインドウの右上のハンバーガーメニューから、Tools - OpenPGP Key Managerを選択します。開いたウインドウのメニューから、File - Import Secret Key(s) From Fileを選択します。先ほど生成したファイルを選択し、Openボタンをクリックします。

![Thunderbirdの設定ウィザード](/thunderbird-import-select.png)

確認ダイアログが表示されるのでContinueボタンをクリックし、もう一度パスフレーズを入力します。

![Thunderbirdの設定ウィザード](/thunderbird-import-confirm.png)

これでインポートが完了しました。もう一度Continueボタンを押し、ウインドウを閉じます。

![Thunderbirdの設定ウィザード](/thunderbird-import-complete.png)

私有鍵を含むファイルは確実に消しておきましょう。

```
$ rm private.pgp
```

## 暗号化したメールの送信
送信したメールの内容は下記のようになります。

::: warning
電子メールをOpenPGPで暗号化しても、ヘッダ部分は暗号化されません。
:::

## 受信したメールの復号
私有鍵のある環境でメールを確認することで、メールを復号して読むことができます。


## メールへの電子署名

## 受信したメールの電子署名の検証
