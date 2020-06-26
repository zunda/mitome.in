# その他のツール
電子メールやソーシャルネットワークサービスの他にも電子署名が有用な場面があります。その一部を紹介します。

## Git
[Git](https://git-scm.com/)はバージョン管理システムのひとつで、本稿の管理にも利用しています。変更内容に電子署名をすることで、管理されているプログラムコードなどの利用者が変更内容の検証をすることができるようになります。

[GnuPGによるOpenPGP鍵対の生成](../email/keyManagement)が完了している環境で、`commit`コマンドに`-S`オプションを追加することで電子署名できます。

```
$ git commit -S
[master fd70ab6] Start writing about signing on Git
 1 file changed, 7 insertions(+)
 create mode 100644 docs/misc/README.md
```

常に電子署名するよう設定することもできます。

```
git config --global commit.gpgsign true
```

公開鍵がインポートされている環境で、電子署名を検証することができます。

```
$ git verify-commit fd70ab6
gpg: Signature made Fri 26 Jun 2020 08:08:24 AM HST
gpg:                using RSA key F60960D80B224382CA8D831CB56C20316D6E8279
gpg:                issuer "zundan@gmail.com"
gpg: Good signature from "zunda <zundan@gmail.com>" [ultimate]
```
