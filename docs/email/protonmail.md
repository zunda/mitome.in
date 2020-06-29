# ProtonMail
[ProtonMail](https://protonmail.com/)はユーザーのプライバシーに配慮した電子メーサービスで、アカウント([無料から](https://protonmail.com/pricing))を作成して、Androidアプリ、iOSアプリ、Webから利用します。[オープンソース](https://github.com/ProtonMail)で開発されていて、[寄付](https://protonmail.com/donate)も受け付けています。また、本稿でも利用している[OpenPGP.js](https://openpgpjs.org/)もメンテナンスしています。

`protonmail.com`あるいは`protonmail.ch`のドメインでユーザー名を選んでアカウントを作成できます。

## OpenPGP鍵対
アカウントを作成すると鍵対が生成されます。ログインし、Settings、Keysと辿ると確認できます。鍵対を追加、インポートしたり、私有鍵をエクスポートすることもできます。

![鍵対の設定](/protonmail-keys.png)

公開鍵をエクスポートすると、[ASCII Armor](../OpenPGP/keyPair.md#ascii-armor)としてダウンロードします。手元にインポートしておきましょう。

```
$ gpg --import Downloads/publickey.zundan@protonmail.com.asc
gpg: key A2204BAE9AAB5A9C: public key "zundan@protonmail.com <zundan@protonmail.com>" imported
gpg: Total number processed: 1
gpg:               imported: 1
```

IDを確認して署名します。表示されたIDをコピーし、ウェブブラウザの検索欄(Ctrl-F)のペーストしてページ内に表示されているものと照合するのが確実です。

```
$ gpg --list-keys zundan@protonmail.com
pub   rsa2048 2020-06-29 [SC]
      5BCBA985515A6B9B95ECDFD1A2204BAE9AAB5A9C
uid           [ unknown] zundan@protonmail.com <zundan@protonmail.com>
sub   rsa2048 2020-06-29 [E]

$ gpg --sign-key 5BCBA985515A6B9B95ECDFD1A2204BAE9AAB5A9C

pub  rsa2048/A2204BAE9AAB5A9C
     created: 2020-06-29  expires: never       usage: SC
     trust: unknown       validity: unknown
sub  rsa2048/7685D0B693B79333
     created: 2020-06-29  expires: never       usage: E
[ unknown] (1). zundan@protonmail.com <zundan@protonmail.com>


pub  rsa2048/A2204BAE9AAB5A9C
     created: 2020-06-29  expires: never       usage: SC
     trust: unknown       validity: unknown
 Primary key fingerprint: 5BCB A985 515A 6B9B 95EC  DFD1 A220 4BAE 9AAB 5A9C

     zundan@protonmail.com <zundan@protonmail.com>

Are you sure that you want to sign this key with your
key "zunda <zundan@gmail.com>" (B56C20316D6E8279)

Really sign? (y/N) y

```

署名後の状況を確認しておきます。

```
$ gpg --list-keys zundan@protonmail.com
gpg: checking the trustdb
gpg: marginals needed: 3  completes needed: 1  trust model: pgp
gpg: depth: 0  valid:   1  signed:   2  trust: 0-, 0q, 0n, 0m, 0f, 1u
gpg: depth: 1  valid:   2  signed:   0  trust: 2-, 0q, 0n, 0m, 0f, 0u
gpg: next trustdb check due at 2022-06-24
pub   rsa2048 2020-06-29 [SC]
      5BCBA985515A6B9B95ECDFD1A2204BAE9AAB5A9C
uid           [  full  ] zundan@protonmail.com <zundan@protonmail.com>
sub   rsa2048 2020-06-29 [E]

```

公開鍵は、[OpenPGP公開鍵サーバに公開](keyManagement.md#公開鍵の公開)しておいても良いでしょう。


## 送信先の公開鍵の登録
送信先を公開鍵と共に登録することでメールを暗号化してやりとりできるようになります。

ContactsからAdd Contactをクリックし、名前と電子メールアドレスを入力し、電子メールアドレスの右の歯車マークから詳細を表示します。

![コンタクトの追加](/protonmail-add-contact.png)

下記のようなコマンドで公開鍵のASCII Armorを生成しておき、Upload Keyボタンからアップロードします。

```
$ gpg --export --aromor -o pubkey.gpg F60960D80B224382CA8D831CB56C20316D6E8279
```

![公開鍵の追加](/protonmail-add-key.png)

ProtonMailから送信する電子メールの暗号化や電子署名は、送信先の設定で有効にしておきます。

![送信電子メールの設定](/protonmail-contact-detail.png)

## 暗号化したメールの送信
上記のように設定した相手にメールを書くと、設定に応じて、自動的に暗号化や電子署名して送信します。

![電子メールの送信](/protonmail-compose.png)

期待どおり、届いたメールを復号し電子署名の検証に成功しました。

![ProtonMailから送信した電子メールの受信](/protonmail-decrypted-verified.png)

## 暗号化したメールの受信
Muttから暗号化し電子署名したメールも、無事ProtonMailに届き電子署名の検証に成功しました。

![電子メールの受信](/protonmail-receive.png)
