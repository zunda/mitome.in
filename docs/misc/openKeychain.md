# OpenKeychain
この記事の内容は2022年4月頃のものです。

[OpenKeychain](https://www.openkeychain.org/)というAndroidアプリケーションを利用して、携帯電話で、テキストやファイルの暗号化と復号、そして、デジタル署名とその検証ができます。[YubiKey](../device/yubiKey.md) 5 NFCなどのスマートカードを併用することで、携帯電話に私有鍵を保管することなく復号やデジタル署名できます。

## 公開鍵のインポート
[vCardに`KEY`エレメントを含めたQRコード](vCard.md)をスキャンすることで、公開鍵サーバから公開鍵をインポートすることができます。右下の+メニューから、Scan QR Codeメニューをタップします。

![公開鍵のインポート](/OpenKeychain-my-keys.png)

インポートした公開鍵は下記のように閲覧できます。公開鍵の信頼度を設定していないので、オレンジ色で表示されています。名前の下にアイコンとして表示されているメニューからファイルやテキストを暗号化することができます。私有鍵をインポートしてある場合には右上のメニューから[公開鍵の信頼度を設定](../OpenPGP/wot.md)することができます。

![公開鍵の閲覧](/OpenKeychain-pubkey.png)


## 私有鍵のインポート
携帯電話のNFCを有効にした後、My Keys欄のClick here to create or import oneをタップすることで私有鍵をインポートできます。USE SECURITY TOKENをタップして、YubiKeyを携帯電話に近づけてインポートが終わるまでしばらく待ちます。

![私有鍵のインポート](/OpenKeychain-my-seckeys.png)

下記のように[YubiKeyに格納した](../device/yubiKey.md)私有鍵の情報を取得できました。

![私有鍵の閲覧](/OpenKeychain-seckey.png)

復号やデジタル署名のために私有鍵が必要な場面では、YubiKeyのPINを入力してから、その都度YubiKeyを携帯電話に近づける必要があります。PINにアルファベットが含まれる場合には入力欄の右のabcをタップします。数字のみに戻す場合は123をタップします。

![YubiKeyのPINの入力](/OpenKeychain-pin.png)
