# GnuPGによる鍵対の生成と管理
OpenPGPを利用するには鍵対が必要です。本稿で紹介するツールの多くに鍵を管理する機能がありますので、これから使い始める人は自分が使うツールで鍵の生成から始めるのが良さそうです。

ここでは、実際に公開鍵を生成し管理する一般的な手順として、OpenPGPのコマンドラインの実装として広く利用されている[GnuPG](https://gnupg.org/)を利用して、鍵対の生成と公開を試してみます。

::: warning
ここで紹介するのはGnuPGのデフォルトの設定に沿った最小限の手順です。より安全な鍵の管理が必要な場合には、Debian GNU/Linuxの開発者向けの文書[Using OpenPGP subkeys in Debian development](https://wiki.debian.org/Subkeys)などを参照してください。
:::

## GnuPGのインストール
GnuPGは手元のOSに標準でインストールされているかもしれません。端末を起動し、`gpg`コマンドを実行してみてください。

インストールされていない場合は、[GnuPGのダウンロード](https://gnupg.org/download/index.html)のページなどからダウンロードできます。ダウンロードしたファイルが正当なものであることを、[Integrity Check](https://gnupg.org/download/integrity_check.html)に従って確認してから利用してください。

インストールできたら、`gpg`コマンドに`--version`オプションを指定して実行することで下記のような表示が得られます。

```
$ gpg --version
gpg (GnuPG) 2.2.19
libgcrypt 1.8.5
Copyright (C) 2019 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Home: /home/zunda/.gnupg
Supported algorithms:
Pubkey: RSA, ELG, DSA, ECDH, ECDSA, EDDSA
Cipher: IDEA, 3DES, CAST5, BLOWFISH, AES, AES192, AES256, TWOFISH,
        CAMELLIA128, CAMELLIA192, CAMELLIA256
Hash: SHA1, RIPEMD160, SHA256, SHA384, SHA512, SHA224
Compression: Uncompressed, ZIP, ZLIB, BZIP2
```

::: tip
本稿での実行例は、Xubuntu 20.04、GnuPG 2.2.19でのものです。
:::

## 鍵対の生成
GnuPGがインストールできたら鍵対を生成します。

端末から`gpg`コマンドを`--generate-key`オプションを指定して実行して、GnuPGのデフォルトの設定で鍵対を生成してみます。有効期間は2年間となりました。端末からは名前と電子メールアドレスを入力しました。

```
$ gpg --generate-key
gpg (GnuPG) 2.2.19; Copyright (C) 2019 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Note: Use "gpg --full-generate-key" for a full featured key generation dialog.

GnuPG needs to construct a user ID to identify your key.

Real name: zunda
Email address: zundan@gmail.com
You selected this USER-ID:
    "zunda <zundan@gmail.com>"

Change (N)ame, (E)mail, or (O)kay/(Q)uit? o
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.
gpg: /home/zunda/.gnupg/trustdb.gpg: trustdb created
gpg: key B56C20316D6E8279 marked as ultimately trusted
gpg: directory '/home/zunda/.gnupg/openpgp-revocs.d' created
gpg: revocation certificate stored as '/home/zunda/.gnupg/openpgp-revocs.d/F60960D80B224382CA8D831CB56C20316D6E8279.rev'
public and secret key created and signed.

pub   rsa3072 2020-06-24 [SC] [expires: 2022-06-24]
      F60960D80B224382CA8D831CB56C20316D6E8279
uid                      zunda <zundan@gmail.com>
sub   rsa3072 2020-06-24 [E] [expires: 2022-06-24]

```

パスフレーズは下記のようなウインドウから入力しました。今後、私有鍵が必要な場面で適宜パスフレーズの入力を促されます。

![パスフレーズを入力する様子](/gpg-genkey-agent.png)

この操作で、`gpg`コマンドは2対の鍵対を生成しました。署名(`S`)と証明書(`C`)に利用するマスター鍵対と、暗号(`E`)に利用する副(sub)鍵対です。今回生成されたマスター鍵対のIDは`F60960D80B224382CA8D831CB56C20316D6E8279`となりました。副鍵も同じIDで取り扱います。

生成された鍵対や鍵対を登録してある鍵束は、`~/.gnupg/` (ホームディレクトリ以下の`.gnupg`ディレクトリ)以下にファイルとして記録されます。下記では一部のIDを伏せ字にしてあります。

```
$ find ~/.gnupg -type f | xargs file
~/.gnupg/openpgp-revocs.d/F60960D80B224382CA8D831CB56C20316D6E8279.rev:  ASCII text
~/.gnupg/trustdb.gpg:                                                    GPG key trust database version 3
~/.gnupg/private-keys-v1.d/23DB************************************.key: data
~/.gnupg/private-keys-v1.d/1E7A************************************.key: data
~/.gnupg/pubring.kbx:                                                    GPG keybox database version 1, created-at Wed Jun 24 05:23:42 2020, last-maintained Wed Jun 24 05:23:42 2020
~/.gnupg/pubring.kbx~:                                                   GPG keybox database version 1, created-at Wed Jun 24 05:23:42 2020, last-maintained Wed Jun 24 05:23:42 2020
```

鍵束に登録された公開鍵の概要を、`gpg`コマンドに`--list-keys`を指定して実行することで確認できます。`gpg`コマンドは必要に応じて信頼の網を再確認します。小さな信頼の網が形成され、自分自身が究極的に信頼されていることがわかります。

```
$ gpg --list-keys
gpg: checking the trustdb
gpg: marginals needed: 3  completes needed: 1  trust model: pgp
gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
gpg: next trustdb check due at 2022-06-24
/home/zunda/.gnupg/pubring.kbx
------------------------------
pub   rsa3072 2020-06-24 [SC] [expires: 2022-06-24]
      F60960D80B224382CA8D831CB56C20316D6E8279
uid           [ultimate] zunda <zundan@gmail.com>
sub   rsa3072 2020-06-24 [E] [expires: 2022-06-24]

```

対応する私有鍵が登録されていることも`--list-secret-keys`オプションで確認することができます。

```
$ gpg --list-secret-keys
/home/zunda/.gnupg/pubring.kbx
------------------------------
sec   rsa3072 2020-06-24 [SC] [expires: 2022-06-24]
      F60960D80B224382CA8D831CB56C20316D6E8279
uid           [ultimate] zunda <zundan@gmail.com>
ssb   rsa3072 2020-06-24 [E] [expires: 2022-06-24]

```

私有鍵を失ってしまった場合に鍵対を失効できるよう、生成された失効証明書を安全な場所に保管しておきましょう。

::: warning
失効証明書を漏洩してしまわないよう注意してください。悪意の第三者が失効証明書を入手すると、鍵対を失効させてしまえるようになります。
:::

## 公開鍵の公開
生成した公開鍵は、USBフラッシュメモリなどにコピーして、やりとりする相手に渡すほか、PGP公開鍵サーバに公開することで広く利用してもらえるようになります。下記のようなコマンドで鍵IDを指定してPGP公開鍵サーバに登録することができます。登録した公開鍵は、鍵IDや指紋で検索することができます。

```
$ gpg --send-key F60960D80B224382CA8D831CB56C20316D6E8279
gpg: sending key B56C20316D6E8279 to hkps://keys.openpgp.org
```

GnuPGがデフォルトで利用するPGP公開鍵サーバ`keys.openpgp.org`の[利用手順](https://keys.openpgp.org/about/usage)に従って電子メールアドレスを確認してもらうことで、電子メールアドレスで公開鍵を検索できるようになります。

```
$ gpg --export zundan@gmail.com | curl -T - https://keys.openpgp.org
Key successfully uploaded. Proceed with verification here:
https://keys.openpgp.org/upload/…
```

表示されたリンクをウェブブラウザで開くと下記のようなページが表示されます。

![keys.openpgp.orgによる確認メール送信ページ](/keys-openpgp-email-verification.png)

ボタンをクリックして確認のメールを送信してもらい、送られてきたメールに含まれるリンクを閲覧します。(本稿の執筆時点2020-06-24では、`gpg --send-key`コマンドでも確認のメールを送信してもらえるようです。)

## 公開鍵のインポートと署名
他の人の公開鍵は、鍵IDなどを指定してPGP公開鍵サーバからインポートすることができます。

```
$ gpg --recv-keys C31D6E888EEB6DACEA881A8C7BF7154E0B170373
gpg: key 7BF7154E0B170373: public key "zunda <zundan@gmail.com>" imported
gpg: Total number processed: 1
gpg:               imported: 1
```

インポートした公開鍵には信頼度を署名しておきましょう。

```
$ gpg --sign-key C31D6E888EEB6DACEA881A8C7BF7154E0B170373

pub  rsa4096/7BF7154E0B170373
     created: 2017-03-13  expires: never       usage: SC
     trust: unknown       validity: unknown
sub  rsa2048/3058EB92337633FD
     created: 2017-03-13  expires: 2025-03-11  usage: SA
sub  rsa2048/166945FDA87229FE
     created: 2017-03-13  expires: 2025-03-11  usage: E
[ unknown] (1). zunda <zundan@gmail.com>
[ unknown] (2)  zunda <zunda@freeshell.org>

Really sign all user IDs? (y/N) y

pub  rsa4096/7BF7154E0B170373
     created: 2017-03-13  expires: never       usage: SC
     trust: unknown       validity: unknown
 Primary key fingerprint: C31D 6E88 8EEB 6DAC EA88  1A8C 7BF7 154E 0B17 0373

     zunda <zundan@gmail.com>
     zunda <zunda@freeshell.org>

Are you sure that you want to sign this key with your
key "zunda <zundan@gmail.com>" (B56C20316D6E8279)

Really sign? (y/N) y

```

::: tip
署名したことを公開したくない場合には、`--sign-key`オプションの代わりに`--lsign-key`オプションを指定します。
:::

鍵束の状況を確認してみます。`full`の信頼度で署名できました。

```
$ gpg --list-keys
/home/zunda/.gnupg/pubring.kbx
------------------------------
pub   rsa3072 2020-06-24 [SC] [expires: 2022-06-24]
      F60960D80B224382CA8D831CB56C20316D6E8279
uid           [ultimate] zunda <zundan@gmail.com>
sub   rsa3072 2020-06-24 [E] [expires: 2022-06-24]

pub   rsa4096 2017-03-13 [SC]
      C31D6E888EEB6DACEA881A8C7BF7154E0B170373
uid           [  full  ] zunda <zundan@gmail.com>
uid           [  full  ] zunda <zunda@freeshell.org>
sub   rsa2048 2017-03-13 [SA] [expires: 2025-03-11]
sub   rsa2048 2017-03-13 [E] [expires: 2025-03-11]

```

署名した公開鍵をPGP公開鍵サーバに登録することで、他の人が信頼度の参考にすることができます。

```
$ gpg --send-key C31D6E888EEB6DACEA881A8C7BF7154E0B170373
gpg: sending key 7BF7154E0B170373 to hkps://keys.openpgp.org
```

#### 他の人の署名をインポートする
他の人が公開鍵に署名した際には、下記のコマンドで署名をインポートし、信頼の網を更新することができます。今回は変更はなかったようです。

```
$ gpg --refresh-keys
gpg: refreshing 2 keys from hkps://keys.openpgp.org
gpg: key 7BF7154E0B170373: "zunda <zundan@gmail.com>" not changed
gpg: key B56C20316D6E8279: "zunda <zundan@gmail.com>" not changed
gpg: Total number processed: 2
gpg:              unchanged: 2
```

## 公開鍵の失効
私有鍵のパスフレーズを忘れてしまって鍵対を利用できなくなってしまったり、私有鍵が漏洩して第三者によるなりすましの可能性が出てしまった場合には、鍵対を失効させる必要があります。

手元の鍵束で鍵対を失効させるには、保管しておいた失効証明書を利用します。

まず、失効証明書の下記の行の最初のコロン`:`をエディタで削除しておきます。

```
:-----BEGIN PGP PUBLIC KEY BLOCK-----
```

失効証明書をインポートすることで鍵対が失効します。

```
$ gpg --import F60960D80B224382CA8D831CB56C20316D6E8279.rev
gpg: key B56C20316D6E8279: "zunda <zundan@gmail.com>" revocation certificate imported
gpg: Total number processed: 1
gpg:    new key revocations: 1
gpg: marginals needed: 3  completes needed: 1  trust model: pgp
gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
gpg: next trustdb check due at 2022-06-24
```

鍵対が失効したことを確認できます。

```
$ gpg --list-keys
/home/zunda/.gnupg/pubring.kbx
------------------------------
pub   rsa3072 2020-06-24 [SC] [revoked: 2020-06-24]
      F60960D80B224382CA8D831CB56C20316D6E8279
uid           [ revoked] zunda <zundan@gmail.com>

$ gpg --list-secret-keys
/home/zunda/.gnupg/pubring.kbx
------------------------------
sec   rsa3072 2020-06-24 [SC] [revoked: 2020-06-24]
      F60960D80B224382CA8D831CB56C20316D6E8279
uid           [ revoked] zunda <zundan@gmail.com>

```

::: tip
手元の私有鍵が利用可能な場合には、`gpg -o 失効証明書のファイル名 --gen-revoke 鍵ID`コマンドで失効証明書を再生成することができます。
:::

公開鍵を公開している場合には、失効させた公開鍵を公開しなおすことで、公開している公開鍵を失効させることができます。(今回失効させた公開鍵は公開しなおしていませんので、公開鍵は有効なままです。)
