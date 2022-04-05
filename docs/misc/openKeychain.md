# OpenKeychain
[OpenKeychain](https://www.openkeychain.org/)というAndroidアプリケーションで、テキストやファイルの暗号化と復号、そして、電子署名とその検証ができます。[YubiKey](../device/yubiKey.md) 5 NFCなどのスマートカードを併用することで、携帯電話に私有鍵を保管することなく復号や電子署名できます。

## 公開鍵のインポート
[vCardに`KEY`エレメントを含めたQRコード](vCard.md)などをスキャンすることで、公開鍵サーバから公開鍵をインポートすることができます。右下の+メニューから、Scan QR Codeメニューをタップします。

![公開鍵のインポート](/OpenKeychain-my-keys.png)

上のメニューからファイルやテキストを暗号化したり、私有鍵をインポートしてある場合には右上のメニューから[公開鍵の信頼度を設定](../OpenPGP/wot.md)したりすることができます。

![公開鍵の閲覧](/OpenKeychain-pubkey.png)
