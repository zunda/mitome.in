# LibreOffice
[LibreOffice](https://ja.libreoffice.org/)は豊富な機能を備えたオフィススイートです。認証局に電子署名されたクライアント証明書を利用することで、作成した文書の電子署名したり、電子署名を検証したりできます。

ここではテスト用のルート認証局を作成し、FirefoxにルートCA証明書とクライアント証明書をインポートし、それをLibreOfficeから参照することで、LibreOfficeでの文書への電子署名を試してみます。

## クライアント証明書の準備
ルート認証局を作成し、クライアント証明書に電子署名します。

### ルート認証局
ここでは`openssl`コマンドで種々の証明書を作成します。まずルートCA証明書です。

```
$ openssl req -newkey rsa:4096 -keyform PEM -keyout ca.key -x509 -days 30 -outform PEM -out ca.cer
```

パスフレーズを入力し、その他の情報を適宜入力します。自己署名したルートCA証明書が生成されました。

```
$ openssl x509 -in ca.cer -noout -issuer -subject
issuer=O = mitome.in test, CN = mitome.in test CA
subject=O = mitome.in test, CN = mitome.in test CA
```

### クライアント証明書
クライアントの私有鍵を生成し、証明書リクエストを生成して電子署名します。証明書リクエストに含める情報を適宜入力します。

```
$ openssl genrsa -out client.key 4096
$ openssl req -new -key client.key -out client.req
```

クライアント証明書を生成し、ルートCA証明書で電子署名します。

```
$ openssl x509 -req -in client.req -CA ca.cer -CAkey ca.key -set_serial 101 -extensions client -days 30 -outform PEM -out client.cer
```

ルートCA証明書のパスフレーズを入力すると、下記のようにクライアント証明書が生成されました。

```
$ openssl x509 -in client.cer -noout -issuer -subject
issuer=O = mitome.in test, CN = mitome.in test CA
subject=O = mitome.in test, CN = zunda, emailAddress = zundan@gmail.com
```

Firefoxにインポートできるよう、PKCS #12形式に変換します。

```
$ openssl pkcs12 -export -inkey client.key -in client.cer -out client.p12
```

## 証明書のインポート
Firefoxを起動し、右上のハンバーガーメニューからPreferencesをクリックし、左のペインからPrivacy & Securityをクリックします。

クライアント証明書をインポートします。Certificatesの項のView Certificates...をボタンをクリックし、Your CertificatesのImport...ボタンをクリックします。

![Firefoxにクライアント証明書をインポートする](/firefox-import-clientcert.png)

このようにテスト用のクライアント証明書をインポートすることができました。

![Firefoxにインポートされたクライアント証明書](/firefox-view-clientcert.png)

ルートCA証明書もインポートします。

::: danger
この操作の結果、FirefoxはインポートされたルートCA証明書を信用することになります。これは、このルートCA証明書とペアになっている私有鍵によって電子署名された全ての証明書を信用することを意味します。私有鍵が適切に管理されていないルートCA証明書をインポートしてしまわないように注意してください。
:::

Certificatesの項のView Certificates...をボタンをクリックし、Authorities...のImport...ボタンをクリックします。

![FirefoxにルートCA証明書をインポートする](/firefox-import-ca.png)

Firefoxが信用する範囲をできるだけ限定しておきます。

![FirefoxにインポートするルートCA証明書の有効範囲を設定する](/firefox-import-ca-confirm.png)

このようにテスト用のルートCA証明書をインポートすることができました。

![FirefoxにインポートされたルートCA証明書](/firefox-view-ca.png)

## LibreOfficeの起動と電子署名
Firefoxにインポートしたクライアント証明書をLibreOfficeから参照するには、Firefoxがインポートした証明書を保存しているパスをLibreOfficeに知らせる必要があります。

下記のようなコマンドでパスを見つけることができます(一部マスクしてあります)。

```
$ find ~/.mozilla -name cert*.db -printf "%h\n"
/home/zunda/.mozilla/firefox/********.default
```

これを利用して、`MOZILLA_CERTIFICATE_FOLDER`環境変数に証明書のパスを設定して`libreoffice`を起動することで、LibreOfficeがクライアント証明書を参照できるようになります。

```
$ MOZILLA_CERTIFICATE_FOLDER=`find ~/.mozilla -name cert*.db -printf "%h\n"` libreoffice
```

文書を作成保存すると、電子署名が可能です。文書を保存したら、File - Digital Signatures - Digital Signatures...とメニューをたどります。Sign Document...メニューをクリックし、先ほどインポートしたクライアント証明書を選択し、Signボタンをクリックします。

![LibreOfficeでの文書への電子署名](/libreoffice-sign.png)

これで、文書への署名が完了し、LibreOfficeが文書の内容を検証するようになりました。

![LibreOfficeによる電子署名の検証](/libreoffice-verify.png)

電子署名の検証が失敗することで、電子署名後に内容が編集されたことがわかります。

![LibreOfficeによる電子署名の検証の失敗](/libreoffice-verify-failed.png)
