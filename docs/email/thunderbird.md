# Thunderbird
[Thunderbird](http://www.thunderbird.net/ja/)はGUIで利用しやすい電子メールクライアントで、[2020年夏にリリースされたバージョン78からOpenPGPの利用にプラグインが不要になりました](https://wiki.mozilla.org/Thunderbird:OpenPGP:2020)。

## インストール
バージョン78以上のThunderbirdは利用中のOSのパッケージとしてインストールできるかもしれません。Ubuntu 20.04では下記のコマンドでインストールできました。

```
$ sudo snap install thunderbird
```

[Thunderbirdのホームページ](http://www.thunderbird.net/ja/)の「無料ダウンロード」ボタンからダウンロードすることもできます。

## 設定

この例で利用するGmailアカウントでは2段階認証を有効にしているので、Thunderbirdでの[ログインにはアプリ パスワードを利用](https://support.google.com/mail/answer/185833?hl=ja)します。

さらに、[Gmailを設定してIMAPを有効に](https://support.google.com/mail/answer/7126229?hl=ja)します。

## 暗号化したメールの送信
送信したメールの内容は下記のようになります。

::: warning
電子メールをOpenPGPで暗号化しても、ヘッダ部分は暗号化されません。
:::

## 受信したメールの復号
私有鍵のある環境でメールを確認することで、メールを復号して読むことができます。


## メールへの電子署名

## 受信したメールの電子署名の検証
