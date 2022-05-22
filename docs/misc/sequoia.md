# Sequoia-PGP
OpenPGPのコマンドラインの実装として、[GnuPG](./keyManagement.md)の他、[Sequoia-PGP](https://sequoia-pgp.org/)を利用することもできます。Sequoia-PGPには、GnuPGと比較して下記のような特徴があります^[[sq feature comparison with gpg](https://sequoia-pgp.org/blog/2022/05/11/202205-sq-gpg-comparison/)]。

- サブコマンドを明示的に指定することで動作をわかりやすくする
- デフォルトの鍵束を持たないことで私有鍵や公開鍵を管理しやすくする

なお、Sequoia-PGPでは、私有鍵や鍵対を「key」と、公開鍵を「cert」あるいは「certificate」と呼びます^[[sq](https://docs.sequoia-pgp.org/sq/index.html)のマニュアル]。

## Sequoia-PGPのインストール
本稿の執筆時には、Xubuntu 22.04で下記のようにインストールすることができました。

```
$ sudo apt install sq
$ sq --version
sq 0.25.0 (sequoia-openpgp 1.3.0)
```

## 電子署名の検証
Sequoia-PGPでは鍵束に公開鍵を追加せずに簡単に電子署名を検証できます。ここでは、[Tails](https://tails.boum.org)のUSBイメージの電子署名を検証してみます。

[Tailsのダウンロードページ](https://tails.boum.org/install/download/)から、USBイメージとOpenPGP signatureをダウンロードします。ここでは、それぞれ`tails-amd64-5.0.img`と`tails-amd64-5.0.img.sig`というファイル名で保存されました。また、OpenPGP signing keyも、このページからダウンロードします。`tails-signing.key`というファイル名で保存されました。

::: warning
公開鍵が改竄されている可能性を減らすため、電子署名の検証に利用する公開鍵は、本来は、電子署名や電子署名の対象とは別の経路で入手するべきです。
:::

Sequoia-PGPでは下記のコマンドで、ダウンロードしたUSBイメージが、電子署名された対象のものと変化していないことを確認できました。

```
$ sq verify --signer-cert tails-signing.key --detached tails-amd64-5.0.img.sig tails-amd64-5.0.img
Good signature from 7BFBD2B902EE13D0
1 good signature.
```

### GnuPGによる電子署名の検証
GnuPGで電子署名を検証する場合には、公開鍵を鍵対にインポートしておく必要があります。

```
$ gpg --import tails-signing.key
gpg: key DBB802B258ACD84F: 2172 signatures not checked due to missing keys
gpg: key DBB802B258ACD84F: public key "Tails developers (offline long-term identity key) <tails@boum.org>" imported
gpg: Total number processed: 1
gpg:               imported: 1
gpg: marginals needed: 3  completes needed: 1  trust model: pgp
gpg: depth: 0  valid:   1  signed:   2  trust: 0-, 0q, 0n, 0m, 0f, 1u
gpg: depth: 1  valid:   2  signed:   0  trust: 2-, 0q, 0n, 0m, 0f, 0u
gpg: next trustdb check due at 2022-06-24
```

この状態で、下記のように電子署名を検証することができました。

```
$ gpg --verify tails-amd64-5.0.img.sig tails-amd64-5.0.img
gpg: Signature made Mon 02 May 2022 01:21:28 AM HST
gpg:                using RSA key 753F901377A309F2731FA33F7BFBD2B902EE13D0
gpg: Good signature from "Tails developers (offline long-term identity key) <tails@boum.org>" [unknown]
gpg:                 aka "Tails developers <tails@boum.org>" [unknown]
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: A490 D0F4 D311 A415 3E2B  B7CA DBB8 02B2 58AC D84F
     Subkey fingerprint: 753F 9013 77A3 09F2 731F  A33F 7BFB D2B9 02EE 13D0
```

