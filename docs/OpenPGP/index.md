# OpenPGPとは
[OpenPGP](https://www.openpgp.org/)は、電子メールなどのメッセージの暗号化やデジタル署名などに利用される公開鍵暗号の規格の総称で、[RFC 4880](https://www.rfc-editor.org/rfc/rfc4880)などに規定されています。

OpenPGPは、[PGP (Pretty Good Privacy)](https://en.wikipedia.org/wiki/Pretty_Good_Privacy)と呼ばれる実装に基づいて策定されました。広く利用されている[GnuPG (GNU Privacy Guard・GPG)](https://ja.wikipedia.org/wiki/GNU_Privacy_Guard)は、OpenPGP実装のひとつです。[次章](/email/keyManagement)で利用してみます。本章では、JavaScriptによるOpenPGP実装のひとつである[OpenPGP.js](https://openpgpjs.org/)を利用して、ブラウザ上で暗号化やデジタル署名を試し、公開鍵暗号の振る舞いを確認してみます。

公開鍵暗号によるメッセージの暗号化やデジタル署名には、公開鍵(public key)と私有鍵^[私有鍵は一般的には「秘密鍵」と呼ばれることが多いのですが、本稿では、対称鍵暗号(共通鍵暗号とも呼ばれる)の鍵(secret key)との区別のため、「私有鍵」と呼びます。](private key)のペア([鍵対](keyPair)、key pair)を使います。公開鍵は、インターネットや印刷物などで公開されているものを取得して、メッセージの暗号化や、デジタル署名の検証に使います。私有鍵は、ペアになっている公開鍵で暗号化されたメッセージの復号や、ペアになっている公開鍵で検証できるようなデジタル署名のために使います。

受取人の公開鍵で[暗号化](encryption)されたメッセージは、ペアになっている、受取人の私有鍵のみで復号することができます。また、あるメッセージについて私有鍵で作成された[デジタル署名](sign)を、ペアになっている公開鍵で検証することによって、手元のメッセージがデジタル署名の作成対象と同一なことを確認できます。

::: tip
公開鍵暗号では、暗号化と復号に、ペアになってはいても異なる鍵を使います。このため、非対称暗号とも呼ばれます。
:::

メッセージの暗号化の際には、手元の[公開鍵が本当にメッセージを送る相手のものか確認する](./wot)必要があります。公開鍵を取り違えると、送信者の意図しない第三者がメッセージを復号できてしまうかもしれません。

私有鍵は、漏れないよう無くさないよう厳重に管理する必要があります。私有鍵を入手した第三者は、暗号化されたメッセージを復号したり、鍵対の持ち主になりすましてデジタル署名したりすることができてしまいます。私有鍵を紛失すると、暗号化されたメッセージを復号することができなくなったり、これまでと同じアイデンティティでデジタル署名できなくなったりしてしまいます。

::: warning
本章では、ブラウザ上で私有鍵を生成したり利用したりしますが、原則的に、実際に利用する私有鍵をブラウザにペーストしないように注意してください。ブラウザが表示しているウェブサイトに私有鍵が漏洩してしまう可能性があります。
:::

それでは、ブラウザ上で、鍵対の生成、テキストの暗号化と復号、デジタル署名を試してみましょう。公開鍵が意図した人のものかを確認する、信頼の網にも触れます。
