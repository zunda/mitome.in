# Git
この記事の内容は2020年7月頃のものです。

[Git](https://git-scm.com/)はバージョン管理システムのひとつで、本稿の管理にも利用されています。変更内容にデジタル署名をすることで、管理されているプログラムコードなどの利用者が変更内容の検証をすることができるようになります。

[GnuPGによるOpenPGP鍵対の生成](../email/keyManagement)が完了している環境で、`commit`コマンドに`-S`オプションを追加することでデジタル署名できます。

```
$ git commit -S
[master fd70ab6] Start writing about signing on Git
 1 file changed, 7 insertions(+)
 create mode 100644 docs/misc/README.md
```

::: details gpg2の利用
Ubuntu 16.04など、OSによっては、最近のGnuPGが`gpg2`コマンドとして提供されている場合があります。下記のコマンドで、Gitが`gpg`コマンドの代わりに`gpg2`コマンドを利用するようになります。

```
$ git config --global gpg.program gpg2
```
:::

常にデジタル署名するよう設定することもできます。

```
$ git config --global commit.gpgsign true
```

公開鍵がインポートされている環境で、デジタル署名を検証することができます。

```
$ git verify-commit fd70ab6
gpg: Signature made Fri 26 Jun 2020 08:08:24 AM HST
gpg:                using RSA key F60960D80B224382CA8D831CB56C20316D6E8279
gpg:                issuer "zundan@gmail.com"
gpg: Good signature from "zunda <zundan@gmail.com>" [ultimate]
```

[GitHubにOpenPGP公開鍵をアップロードする](https://help.github.com/ja/github/authenticating-to-github/adding-a-new-gpg-key-to-your-github-account)ことで、GitHub上でデジタル署名が検証されるようになります。公開鍵は[ASCII Armor](../OpenPGP/keyPair#ascii-armor)にしてコピーする必要があります。

```
$ gpg --export --armor F60960D80B224382CA8D831CB56C20316D6E8279
-----BEGIN PGP PUBLIC KEY BLOCK-----

mQGNBF7y5CEBDADCBGI+RhNbXWjHOhIwBX9k1kxr6t/nTcec97vMNMxLYn3qxaWc
  (中略)
z53RAXLlDXUjh5wQPrsASA==
=ELpI
-----END PGP PUBLIC KEY BLOCK-----
```

GitHub上でデジタル署名の検証に成功すると「Verified」というマークが表示されます。

![GitHubがデジタル署名の検証に成功した様子](/github-sign-verified.png)

GitHubに登録されているOpenPGP公開鍵は、[GitHubのREST API v3](https://developer.github.com/v3/) (`https://api.github.com`)の[`GET /users/:username/gpg_keys`](https://developer.github.com/v3/users/gpg_keys/#list-gpg-keys-for-a-user)から取得することができます。また、`https://github.com/:username.gpg`から取得することもできるようです。後者では、登録されているすべての公開鍵が1つのASCII Armorに同梱されるようです。
