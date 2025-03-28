# はじめに
認め印を使うくらい気軽に、暗号でやりとりをしたり電子署名したいな、というわけで、本稿では、認め印の代わりとして広く使われている暗号技術を使い、文書を暗号化したり文書に署名したりしてみます。文書を暗号化することで、受取人以外は文書の内容を知ることができなくなります。文書に電子署名することで、文書の内容が改竄されていないか検証することができるようになります。電子メール、ソーシャルネットワークなどでの応用例にも触れます。

本稿で取り扱う暗号技術は、暗号化と復号、そして、電子署名とその検証に、ペアになっている2種類の鍵を使う、公開鍵暗号と呼ばれる暗号技術を応用したものです。公開鍵暗号を利用した電子署名をデジタル署名と呼びます^[[Wikipedia「電子署名」](https://ja.wikipedia.org/wiki/%E9%9B%BB%E5%AD%90%E7%BD%B2%E5%90%8D)]。

公開鍵暗号を利用する際、自分の私有鍵を漏らさず無くさないことが重要です。公開鍵で暗号化された文書の内容は対になっている私有鍵のみで復号して確認することができるので、私有鍵を漏らすと第三者が暗号化された文書の内容を確認できてしまい、私有鍵を無くすと自分宛てに暗号化された文書の内容を確認することができなくなってしまいます。いっぽう、ある公開鍵で正当性を検証できるデジタル署名は、対になっている私有鍵で施されたもののみなので、私有鍵を漏らすと第三者が自分になりすますことができてしまい、私有鍵を無くすとこれまでのアイデンティティでデジタル署名をすることができなくなってしまいます。

いっぽう、公開鍵の正当性を検証することは単純な作業ではありません。OpenPGPでは、信頼の網と呼ばれる方法で、それぞれの個人が手元に取得した他人の公開鍵の信頼度を決めます。[SSH (Secure Shell) の公開鍵認証](https://en.wikipedia.org/wiki/Secure_Shell#Authentication:_OpenSSH_key_management)や[FIDO](https://fidoalliance.org/how-fido-works/) (Fast Identity Online)では、信頼できる経路で、リモートのサービスに自分の公開鍵を登録します。HTTPSで利用されているTLS (Tsansport Layer Security)と同様、信頼する認証局を決めて、鍵対の信頼度の検証を認証局に委ねる、PKI (Public Key Infrastructure)も利用されています。認証局がデジタル署名した公開鍵を、証明書と呼ぶことがあります。

本稿は書きかけです。追加点、誤りや改善点に気づいた方は、GitHubのレポジトリ[zunda/mitome.in](https://github.com/zunda/mitome.in)の[Issue](https://github.com/zunda/mitome.in/issues)や[プルリクエスト](https://github.com/zunda/mitome.in/pulls)にお知らせいただけると著者が喜びます。

## 著者・コントリビュータ
本稿の内容は下記の人々(アルファベット順)によるものです。主著者であるzundaからお礼申し上げます。

- Coro365 &lt;coro.365 at gmail.com&gt;
- estpls
- Nakaya &lt;eniehack at outlook dot jp&gt;
- zunda &lt;zundan at gmail.com&gt;
- この他の[著者](https://github.com/zunda/mitome.in/graphs/contributors)^[本稿のgitレポジトリへのコミット以外の方法で原稿をいただいた場合は、リンク先のページに表示されません]

## ライセンス
Copyright 2020 by zunda &lt;zundan at gmail.com&gt; and the contributors

本稿は[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ja)に従って利用できます。

本サイトを生成する[プログラムコード](https://github.com/zunda/mitome.in)は[MITライセンス](https://github.com/zunda/mitome.in/blob/master/LICENSE)に従って利用できます。本サイトで利用させていただいている[ソフトウェアのライセンス](https://github.com/zunda/mitome.in/blob/master/LICENSES)もご確認ください。
