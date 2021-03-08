# Keyoxide
[Keyoxide](https://keyoxide.org/)は、分散されたオンラインアイデンティティを確立する方法のひとつです。Keyoxideに則って電子署名を追加した公開鍵を[OpenPGP](../openpgp/)に則って公開すれば、特定のサービスに依存せずオンラインのアイデンティティを確立し確認できます。

自分の公開鍵にはidentity proofとして下記のような形式のnotationを添付した電子署名を追加してOpenPGP公開鍵サーバに公開します。

```
proof@metacode.biz=自分の管理するSNSアカウントのURL
```

自分の管理するSNSアカウントには、proofとして自分の鍵対の指紋を掲示します。

Keyoxideでは、identity proofとSNSアカウントに掲示されたproofとに一貫性があることを確認することで、identity proofを追加した鍵対を管理している人と、SNSアカウントにproofを掲示する権限のある人とが同一であることを確認できます。日常的にSNSで交流している相手の公開鍵を[信頼の網](../OpenPGP/wot.md#openpgpによる信頼の網)に追加する場合には、Keyoxideによるアイデンティティの確認を参考にできそうです。

## アイデンティティの確立
例として、主著者の[Mastodonアカウントのproofを追加](https://keyoxide.org/guides/mastodon)してみます。

### Identity Proofの追加
まず、自分の公開鍵にidentity proofを追加します。鍵対の指紋は`F60960D80B224382CA8D831CB56C20316D6E8279`で、Mastodonアカウントは`https://mastodon.zunda.ninja/@zundan`にあります。

```
$ gpg --edit-key F60960D80B224382CA8D831CB56C20316D6E8279
gpg> notation
Enter the notation: proof@metacode.biz=https://mastodon.zunda.ninja/@zundan
gpg> save
```

追加したnotationは下記のように`--edit-key`の`showpref`コマンドで表示される内容の`Notations:`の行で確認することができます。

```
$ gpg --edit-key F60960D80B224382CA8D831CB56C20316D6E8279
gpg (GnuPG) 2.2.19; Copyright (C) 2019 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

sec  rsa3072/B56C20316D6E8279
     created: 2020-06-24  expires: 2022-06-24  usage: SC
     trust: ultimate      validity: ultimate
ssb  rsa3072/164F21FF001C8CD1
     created: 2020-06-24  expires: 2022-06-24  usage: E
[ultimate] (1). zunda <zundan@gmail.com>

gpg> showpref
[ultimate] (1). zunda <zundan@gmail.com>
     Cipher: AES256, AES192, AES, 3DES
     Digest: SHA512, SHA384, SHA256, SHA224, SHA1
     Compression: ZLIB, BZIP2, ZIP, Uncompressed
     Features: MDC, Keyserver no-modify
     Notations: proof@metacode.biz=https://mastodon.zunda.ninja/@zundan

gpg> quit
```

::: tip
Notationは、自己署名として、公開鍵に付随しているユーザーID (メールアドレス)のいずれかに添付されます。公開鍵に付随しているすべてのnotationは、インポートした公開鍵に対する`gpg --check-sigs --list-options show-notations`コマンドやファイルに対する`gpg --show-key --with-sig-list`コマンドで表示することができますが、[あるユーザーIDに複数の自己署名が添付されている場合には、最新のもののみが有効になる場合が多く](https://tools.ietf.org/html/rfc4880#section-5.2.3.3)、表示されたnotationの一部には[公開鍵から取り除かれたものもある](https://zenn.dev/zunda/scraps/b93fa981ee68d2#comment-30a11b4c0a465c)場合があります。
:::


追加したnotationを含む公開鍵をOpenPGP公開鍵サーバに公開します。

```
$ gpg --send-key F60960D80B224382CA8D831CB56C20316D6E8279
gpg: sending key B56C20316D6E8279 to hkps://keys.openpgp.org
```

### SNS Proofの追加
Mastodonにproofを追加する場合には、アカウントのプロフィール補足情報に、自分の鍵対の指紋を設定します。この他のSNSへのproofの追加手順は、[Keyoxideによるガイド](https://keyoxide.org/guides)のAdding proofs項を参考にしてみてください。

![Mastodonのアカウントのプロフィール補足情報への鍵対の指紋の設定](/keyoxide-add-proof.png)

## アイデンティティの確認
Keyoxideによる[Profile URL generator](https://keyoxide.org/util/profile-url)で得られるProfile URL (`https://keyoxide.org/鍵対の指紋`)を閲覧することでアイデンティティの確認ができます。 今回の例では`https://keyoxide.org/F60960D80B224382CA8D831CB56C20316D6E8279`です。

![Keyoxideによるアイデンティティの確認](/keyoxide-verified.png)

主著者のMastodonアカウントの右に「verified ✔」と表示されていて、identity proofとMastodonに掲示したproofとの間に矛盾がないことがわかります^[本稿の執筆後にnotationの追加や削除をおこなっています。現状ではアイデンティティの確認ができない状態になっているかもしれません。]。

::: warning
公開鍵のidentity proofとSNSアカウントのproofはそれぞれなりすましをしたい人でも設定することができてしまいます。アイデンティティの確認のためには、identity proofに設定されているSNSアカウントと、そのSNSアカウントに掲示されているproofの鍵対の指紋との両方が一致する必要があります。
:::

::: warning
Keyoxideによるプロファイルページに表示されているアイコンは、アイデンティティの確認対象ではありません。見た目にだまされないよう注意が必要です。
:::

::: tip
Keyoxideによるプロファイルページに表示されているアイコンは、[Gravatar](https://ja.gravatar.com/)から設定することができます。
:::

KeyoxideのProfile URL generatorに指定した公開鍵にidentity proofが追加されていない場合には「No claims associated」と、notationに指定したSNSアカウントにproofが掲示されていない場合には「unverified」と表示されます。

## 手作業での確認
Keyoxideによるアイデンティティの確認は、万が一Keyoxideのウェブサイトが停止してしまっている場合でも可能です。

### Identity Proofの取得
OpenPGP公開鍵サーバなどから取得した公開鍵に追加されているidentity proofは、下記のように確認することができます。

ダウンロードした公開鍵について確認する場合は、確認対象のユーザーID (下記では`uid zunda <zundan@gmail.com>`)に添付された自己署名のうち最新のもの(下記では`2021-03-06`)のみが有効です。その自己署名に含まれる`Signature notation proof@metacode.biz=`で始まる行が有効なidentity proofです。

```
$ gpg --show-keys --with-sig-list ~/Downloads/F60960D80B224382CA8D831CB56C20316D6E8279\(5\).asc
pub   rsa3072 2020-06-24 [SC] [expires: 2022-06-24]
      F60960D80B224382CA8D831CB56C20316D6E8279
uid                      zunda <zundan@gmail.com>
sig 3    N   B56C20316D6E8279 2021-03-06  zunda <zundan@gmail.com>
   Signature notation: proof@metacode.biz=https://mastodon.zunda.ninja/@zundan
sig 3        B56C20316D6E8279 2021-03-01  zunda <zundan@gmail.com>
  :
sub   rsa3072 2020-06-24 [E] [expires: 2022-06-24]
sig          B56C20316D6E8279 2020-06-24  zunda <zundan@gmail.com>
```

自分の鍵束に追加されている公開鍵について確認する場合は、下記の手順で有効なnotationのみを表示させることができます。`Notations: proof@metacode.biz=`で始まる行がidentity proofです。

```
$ gpg --edit-key F60960D80B224382CA8D831CB56C20316D6E8279
gpg (GnuPG) 2.2.19; Copyright (C) 2019 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

sec  rsa3072/B56C20316D6E8279
     created: 2020-06-24  expires: 2022-06-24  usage: SC
     trust: ultimate      validity: ultimate
ssb  rsa3072/164F21FF001C8CD1
     created: 2020-06-24  expires: 2022-06-24  usage: E
[ultimate] (1). zunda <zundan@gmail.com>

gpg> showpref
[ultimate] (1). zunda <zundan@gmail.com>
     Cipher: AES256, AES192, AES, 3DES
     Digest: SHA512, SHA384, SHA256, SHA224, SHA1
     Compression: ZLIB, BZIP2, ZIP, Uncompressed
     Features: MDC, Keyserver no-modify
     Notations: proof@metacode.biz=https://mastodon.zunda.ninja/@zundan

gpg> quit
```

### SNSに掲示されたProofの確認
上記で得られたSNSアカウントをブラウザなどで閲覧し、確認対象の鍵対の指紋をページ内検索で見つけます。

![Mastodonに表示されたproof](/keyoxide-sns-proof.png)

::: warning
なりすましを防ぐため、確認対象のSNSアカウントのみが書きこめる場所に鍵対の指紋が書いてあることの確認が必要です。
:::
