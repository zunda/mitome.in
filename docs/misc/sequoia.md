# Sequoia-PGP
OpenPGPのコマンドラインの実装として、[GnuPG](../email/keyManagement.md)の他、[Sequoia-PGP](https://sequoia-pgp.org/)を利用することもできます。Sequoia-PGPには、GnuPGと比較して下記のような特徴があります^[[sq feature comparison with gpg](https://sequoia-pgp.org/blog/2022/05/11/202205-sq-gpg-comparison/)]。

- サブコマンドを明示的に指定することで動作をわかりやすくする
- デフォルトの鍵束を持たないことで私有鍵や公開鍵を管理しやすくする

なお、Sequoia-PGPでは、私有鍵や鍵対を「key」と、公開鍵を「cert」あるいは「certificate」と呼びます^[[sqのマニュアル](https://docs.sequoia-pgp.org/sq/index.html)]。

## Sequoia-PGPのインストール
本稿の執筆時には、Xubuntu 22.04で下記のようにインストールすることができました。

```
$ sudo apt install sq
$ sq --version
sq 0.25.0 (sequoia-openpgp 1.3.0)
```

## Sequoia-PGPによるデジタル署名の検証
Sequoia-PGPでは鍵束に公開鍵を追加せずに簡単にデジタル署名を検証できます。ここでは、[Tails](https://tails.boum.org)のUSBイメージのデジタル署名を検証してみます。

[Tailsのダウンロードページ](https://tails.boum.org/install/download/)から、USBイメージとOpenPGP signatureをダウンロードします。ここでは、それぞれ`tails-amd64-5.0.img`と`tails-amd64-5.0.img.sig`というファイル名で保存されました。また、OpenPGP signing keyも、このページからダウンロードします。`tails-signing.key`というファイル名で保存されました。

::: warning
公開鍵が改竄されている可能性を減らすため、本来は、デジタル署名の検証に利用する公開鍵あるいはIDや指紋を、デジタル署名やデジタル署名の対象とは別の経路で入手するべきです。
:::

Sequoia-PGPでは下記のコマンドで、ダウンロードしたUSBイメージが、デジタル署名の対象と変化していないことを確認できました。

```
$ sq verify --signer-cert tails-signing.key --detached tails-amd64-5.0.img.sig tails-amd64-5.0.img
Good signature from 7BFBD2B902EE13D0
1 good signature.
```

### GnuPGによるデジタル署名の検証
GnuPGでデジタル署名を検証する場合には、公開鍵を鍵束にインポートしておく必要があります。

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

この状態で、下記のようにデジタル署名を検証することができました。今回は[インポートした公開鍵の信頼度を署名](../email/keyManagement.md#%E5%85%AC%E9%96%8B%E9%8D%B5%E3%81%AE%E3%82%A4%E3%83%B3%E3%83%9B%E3%82%9A%E3%83%BC%E3%83%88%E3%81%A8%E7%BD%B2%E5%90%8D)していないので、公開鍵を[信頼の網](../OpenPGP/wot.md#openpgp%E3%81%AB%E3%82%88%E3%82%8B%E4%BF%A1%E9%A0%BC%E3%81%AE%E7%B6%B2)によって信頼できないと警告されています。

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
