# Keyoxide
[Keyoxide](https://keyoxide.org/)は、分散されたオンラインアイデンティティを確立する方法のひとつです。Keyoxideに則って電子署名を追加した公開鍵を[OpenPGP](../openpgp/)に則って公開すれば、特定のサービスに依存せずオンラインのアイデンティティを確立し確認できるという特長があります。

自分の公開鍵にはidentity proofとして下記のような形式のnotationを添付した電子署名を追加してOpenPGP公開鍵サーバに公開します。

```
proof@metacode.biz=自分の管理するSNSアカウントのURL
```

自分の管理するSNSアカウントには、proofとして自分の鍵対の指紋を掲示します。

Keyoxideでは、identity proofとSNSアカウントに掲示されたproofとに一貫性があることを確認することで、identity proofを追加した鍵対を管理している人と、SNSアカウントにproofを掲示する権限のある人とが同一であることを確認できます。日常的にSNSで交流している相手の公開鍵を[信頼の網](../OpenPGP/wot.md#openpgpによる信頼の網)に追加する場合には、Keyoxideによるアイデンティティの確認を参考にできそうです。

## Keyoxideによるアイデンティティの確立
例として、主著者の[Mastodonアカウントのproofを追加](https://keyoxide.org/guides/mastodon)してみます。

### Identity Proofの追加
まず、自分の公開鍵にidentity proofを追加します。鍵対の指紋は`F60960D80B224382CA8D831CB56C20316D6E8279`で、主著者のMastodonアカウントは`https://mastodon.zunda.ninja/@zundan`にあります。

```sh
$ gpg --edit-key F60960D80B224382CA8D831CB56C20316D6E8279
gpg> notation
Enter the notation: proof@metacode.biz=https://mastodon.zunda.ninja/@zundan
gpg> save
```

追加したnotationは下記のように確認することができます。

```sh
$ gpg --list-keys --with-sig-list --list-options show-notations F60960D80B224382CA8D831CB56C20316D6E8279
pub   rsa3072 2020-06-24 [SC] [expires: 2022-06-24]
      F60960D80B224382CA8D831CB56C20316D6E8279
uid           [ultimate] zunda <zundan@gmail.com>
sig 3    N   B56C20316D6E8279 2021-02-17  zunda <zundan@gmail.com>
   Signature notation: proof@metacode.biz=https://mastodon.zunda.ninja/@zundan
sub   rsa3072 2020-06-24 [E] [expires: 2022-06-24]
sig          B56C20316D6E8279 2020-06-24  zunda <zundan@gmail.com>
```

追加したnotationを含む公開鍵をOpenPGP公開鍵サーバに公開します。

```sh
$ gpg --send-key F60960D80B224382CA8D831CB56C20316D6E8279
gpg: sending key B56C20316D6E8279 to hkps://keys.openpgp.org
```

### SNS Proofの追加
Mastodonのproofを追加する場合には、アカウントのプロフィール補足情報に、自分の鍵対の指紋を設定します。この他のSNSへのproofの追加手順は、[Keyoxideによるガイド](https://keyoxide.org/guides)のAdding proofs項を参考にしてみてください。

![Mastodonのアカウントのプロフィール補足情報への鍵対の指紋の設定](/keyoxide-add-proof.png)

## Keyoxideによるアイデンティティの確認
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

KeyoxideのProfile URL generatorに指定した公開鍵にidentity proofが追加されていない場合には「No claims associated」と、notationに指定したSNSアカウントにproofが掲示されていない場合には「unvefified」と表示されます。

## 手作業でのアイデンティティの確認
Keyoxideによるアイデンティティの確認は、万が一Keyoxideのウェブサイトが停止してしまっている場合でも可能です。

### Identity Proofの取得
OpenPGP公開鍵サーバなどから取得した公開鍵に追加されているidentity proofは、下記のように確認することができます。

ダウンロードした公開鍵について確認する場合

```sh
$ gpg --show-keys --with-sig-list ~/Downloads/F60960D80B224382CA8D831CB56C20316D6E8279.asc | grep proof@metacode.biz=
   Signature notation: proof@metacode.biz=https://mastodon.zunda.ninja/@zundan
```

自分の鍵束に追加されている公開鍵について確認する場合

```sh
$ gpg --list-keys --with-sig-list --list-options show-notations F60960D80B224382CA8D831CB56C20316D6E8279 | grep proof@metacode.biz=
   Signature notation: proof@metacode.biz=https://mastodon.zunda.ninja/@zundan
```

### SNSに掲示されたProofの確認
上記で得られたSNSアカウントをブラウザなどで閲覧し、確認対象の鍵対の指紋をページ内検索で見つけます。

![Mastodonに表示されたproof](/keyoxide-sns-proof.png)

::: warning
なりすましを防ぐため、確認対象のSNSアカウントのみが書きこめる場所に鍵対の指紋が書いてあることの確認が必要です。
:::
