# Mutt
[Mutt](http://www.mutt.org/)は端末内でテキスト表示で利用する軽量高速な電子メールクライアントです。

## インストール
Mutt利用中のOSのパッケージとしてインストールできるかもしれません。Ubuntu 20.04では下記のコマンでインストールできました。

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

さらに、[GnuPGで生成管理](keyManagement)する鍵対を利用してメールの暗号化、復号、電子署名、その検証ができるよう設定します。

TODO: 設定する

## 暗号化したメールの送信

TODO: スクリーンショットを取得する

## 受信したメールの復号

TODO: スクリーンショットを取得する

## メールへの電子署名

TODO: スクリーンショットを取得する

## 受信したメールの電子署名の検証

TODO: スクリーンショットを取得する
