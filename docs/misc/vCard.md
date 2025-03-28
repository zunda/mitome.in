# 名刺
[vCard](https://ja.wikipedia.org/wiki/VCard)という機械可読な名刺の標準規格があります。この規格には、[`KEY`エレメントとして公開鍵などのURIを格納](https://www.rfc-editor.org/rfc/rfc6350.html#section-6.8.1)することができ、[OpenPGP公開鍵の指紋を指定するopenpgp4fprスキーム](https://metacode.biz/openpgp/openpgp4fpr)が定義されています。`openpgp4fpr:`に鍵IDを続けて記載します。

vCardをQRコードとして名刺に印刷することで、安全に公開鍵を配布することできます。

:::: warning
本人から直接受けとらなかった鍵IDやQRコードは改竄されている可能性があることに留意が必要です.
::::

```shellsession{1-8}
$ cat <<_END | qrencode -o vcard.png
BEGIN:VCARD
FN:zunda
URL:https://zunda.ninja
EMAIL:zundan@gmail.com
KEY:OPENPGP4FPR:F60960D80B224382CA8D831CB56C20316D6E8279
END:VCARD
_END
```

上記のコマンドで、下記のようなQRコードが生成されます。

![生成されたQRコード](/vcard.png)

このQRコードを[OpenKeychain](openKeychain)などのアプリケーションで読み込むことで、自動的に公開鍵サーバから公開鍵をインポートすることもできます。

QRコードを読み込んだ人が鍵IDを確認できるよう、また、QRコードを読み込むアプリケーションが無くても公開鍵をインポートできるよう、鍵IDはQRコードだけではなく文字としても印刷しておくと良いでしょう。
