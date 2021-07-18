# Mutt
この記事の内容は2020年6月頃のものです。

[Mutt](http://www.mutt.org/)は端末内でテキスト表示で利用する電子メールクライアントです。

## インストール
Muttは利用中のOSのパッケージとしてインストールできるかもしれません。Ubuntu 20.04では下記のコマンドでインストールできました。

```
$ sudo apt install mutt
```

[Downloading Mutt](http://www.mutt.org/download.html)からダウンロードすることもできます。

## 設定
Muttの利用方法は[詳しいマニュアル](http://www.mutt.org/doc/manual/)にまとめられています。下記では、筆者がGmailのIMAPクライアントとして利用するようにXubuntu 20.04で設定した例です。

この例で利用するGmailアカウントでは2段階認証を有効にしているので、Muttでの[ログインにはアプリ パスワードを利用](https://support.google.com/mail/answer/185833?hl=ja)します。[ArchWikiの記事](https://wiki.archlinux.org/index.php/mutt#Using_native_IMAP_support)などを参考に、`~/.muttrc`を作成して下記のように編集します。GmailのIMAPとSMTPに関する設定のみを抽出して、パスワードは隠してあります。

```
set folder = imaps://imap.gmail.com/
set imap_user = zundan@gmail.com
set imap_pass = ****************
set spoolfile= +INBOX
mailboxes = +INBOX

set header_cache = "~/.cache/mutt"
set message_cachedir = "~/.cache/mutt"
set postponed = +[Gmail]/Drafts
unset imap_passive
set imap_keepalive = 300
set mail_check = 120

set smtp_url = smtps://$imap_user:$imap_pass@smtp.gmail.com:465
set ssl_starttls = yes
```

さらに、[Gmailを設定してIMAPを有効に](https://support.google.com/mail/answer/7126229?hl=ja)します。

端末から`mutt`コマンドを実行するとMuttが起動します。

![muttのインボックス](/mutt-inbox.png)

Ubuntu 20.04のMuttでは、[GnuPGで鍵対を生成](keyManagement)するだけでOpenPGPでの電子メールのやりとりができるようになっているようです。

## 暗号化したメールの送信
メールを書いて`p`キーを押すことで暗号化、電子署名、両方を選択できます。`e`キーを押して、必要な場合には送信先の公開鍵を選択することで、電子メールを暗号化して送信できます。

![MuttのOpenPGPのメニュー](/mutt-p.png)

送信したメールの内容は下記のようになります。

::: warning
電子メールをOpenPGPで暗号化しても、ヘッダ部分は暗号化されません。
:::

```
Date: Fri, 26 Jun 2020 12:22:05 -1000
From: zunda <zundan@gmail.com>
To: zundan@gmail.com
Subject: 暗号化のテスト
MIME-Version: 1.0
Content-Type: multipart/encrypted; protocol="application/pgp-encrypted"; boundary="UugvWAfsgieZRqgk"
Content-Disposition: inline

--UugvWAfsgieZRqgk
Content-Type: application/pgp-encrypted
Content-Disposition: attachment


--UugvWAfsgieZRqgk
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="msg.asc"

-----BEGIN PGP MESSAGE-----

hQGMAxZPIf8AHIzRAQv9GLpygSm7ek+poYzI/yyaCgKgbsMjADJdQ7IT4/+KfV/j
eU0liYPqwnTqISYuIi7/rLCSw43x2WPwIklzh/RtWaXsXmlLt/hdV5ViApo72HFs
EA3UAjVmFnQ3qgm/bOeiBqCP4/xVj3y+PqbTQo2zXBYFcYugSxPqA1BoSjj2AsOF
NHbxHJviUrJg9c+A8W4jvBTC+WgrfYhTPshzl3krgfe5GoyEcZSJyFPsmZI/+fFc
9MauJ7k4mx9dCWzvUQsu6oadO50jFiZXMwe1Nf9GBmHBG1GHG29FMcY6txlRv/5D
cYkUXbQzRr/CvWptO6FFYrLN4TOoqoXBCBA1OaBuDtx5oG3Ie/uve/gjPmCr0ddU
PnO2aY/ckBqYrTs4cR43SFa3DUPDRGhHzF/16EL+bUpE5j7wZH9tbUdp1sfSzjpt
izjfGGmuUUVSIgUqZSdJhI0O0if/ROFVam3JnavmVFs4DLKlwkwj3S6SADSs1GkU
e5JOu3lLHdksRjdLNsU40pMBSyFy5dDxVGasHwzEK2xBnumm9Zn8bwtqplKKA4Re
FrC4VWXrPVmp/KbyN5c6UyDogIaizQvNiXqy9fKJODCs1w05qT1Fy14OVg/aAG7T
vYGCxsR/0whM71DxNoTPtrQeo0C9wh4H79WKtjfTznO82iA3ZT+esezE/fyl3DbI
ETdaUlkLa2m58RUJeYZGx3nrv+w=
=hV9X
-----END PGP MESSAGE-----

--UugvWAfsgieZRqgk--
```

## 受信したメールの復号
私有鍵のある環境でメールを確認することで、メールを復号して読むことができます。

![Muttによるメールの復号](/mutt-decrypt.png)

## メールへの電子署名

電子メールを送る時に、`p`キーと`s`キーを押すことで電子署名を施すことができます。また、`p`キーと`b`キーを押すことで電子署名と暗号化の両方を施すことができます。

## 受信したメールの電子署名の検証
Muttは自動的に電子署名の検証もしてくれます。

![Muttによるメールの電子署名の検証](/mutt-verify-sign.png)
