# はじめに
認め印を使うくらい気軽に、電子署名や暗号でやりとりしたいな。というわけで、認め印の代わりとして広く使われている暗号技術を使い、文書に署名したり、文書を暗号化したりしてみます。電子メール、ソーシャルネットワークなどでの応用例にも触れます。

本稿で取り扱う暗号技術は、暗号化と復号、そして、電子署名とその検証に、ペアになっている2種類の鍵を使う、公開鍵暗号と呼ばれる暗号技術を応用したものです。暗号化の場合でも電子署名の場合でも、私有鍵を秘匿することとともに、正当な公開鍵を利用することが、盗聴やなりすましを防ぐのに重要です。

しかし、公開鍵の正当性を検証することは単純な作業ではありません。OpenPGPでは、信頼の網と呼ばれる、それぞれの個人が相手の信頼度を決める、信頼の網と呼ばれる方法で、公開鍵の信頼度を決めます。いっぽう、HTTPSで利用されているTLSと同様、信頼する認証局を決めて、鍵対の信頼度の検証を認証局に委ねる、PKIも利用されています。認証局が信頼できるものとして電子署名した公開鍵を、証明書と呼ぶことがあります。

本稿は書きかけです。追加点、誤りや改善点に気づいた方は、GitHubのレポジトリ[zunda/mitome.in](https://github.com/zunda/mitome.in)の[Issue](https://github.com/zunda/mitome.in/issues)や[プルリクエスト](https://github.com/zunda/mitome.in/pulls)にお知らせいただけると著者が喜びます。

## 著者・コントリビュータ
本稿の内容は下記の人々(アルファベット順)によるものです。主著者であるzundaからお礼申し上げます。

- Coro365 &lt;coro.365 at gmail.com&gt;
- estpls
- Nakaya &lt;eniehack at outlook dot jp&gt;
- zunda &lt;zundan at gmail.com&gt;
- この他の著者

## ライセンス
Copyright 2020 by zunda &lt;zundan at gmail.com&gt; and the contributors

本稿は[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ja)に従って利用できます。

本サイトを生成する[プログラムコード](https://github.com/zunda/mitome.in)は[MITライセンス](https://github.com/zunda/mitome.in/blob/master/LICENSE)に従って利用できます。本サイトで利用させていただいている[ソフトウェアのライセンス](https://github.com/zunda/mitome.in/blob/master/LICENSES)もご確認ください。
