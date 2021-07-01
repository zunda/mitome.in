# LibreOffice
[LibreOffice](https://ja.libreoffice.org/)は豊富な機能を備えたオフィススイートです。認証局に電子署名されたクライアント証明書や[GnuPGに登録](../email/keyManagement.md)したOpenPGP鍵対を利用することで、作成した文書の暗号化や電子署名が可能です。

## インストール
LibreOfficeは利用中のOSにデフォルトでインストールされているかもしれません。Xubuntu 20.04ではLibreOffice 6.4.3.2 40(Build:2)がインストールされていましたが、起動時のエラーの抑制のために`default-jre`パッケージと`libreoffice-java-common`パッケージを追加でインストールする必要がありました。[LibreOfficeのダウンロードページ](https://ja.libreoffice.org/download/download/)からダウンロードすることもできます。

## クライアント証明書の利用
ここではテスト用のルート認証局とクライアント証明書を生成し、Firefoxにインポートし、それをLibreOfficeから参照することで、LibreOfficeでの文書への電子署名とPKIによる検証を試してみます。

手元でテスト用のルート認証局やクライアント証明書を生成する場合には、`openssl`コマンドを利用します。Xubuntu 20.04ではOpenSSL 1.1.1fがインストールされていました。インストールする必要がある場合には手元のOSのマニュアル等を参照するか、[OpenSSLのダウンロードページ](https://www.openssl.org/source/)や[LibreSSLのホームページ](https://www.libressl.org/)を参照してください。

### クライアント証明書の準備
ルート認証局を生成し、クライアント証明書に電子署名します。

#### ルート認証局
ここでは`openssl`コマンドで種々の証明書を生成します。まずルートCA証明書です。

```
$ openssl req -newkey rsa:4096 -keyform PEM -keyout ca.key -x509 -days 30 -outform PEM -out ca.cer
```

パスフレーズを入力し、その他の情報を適宜入力します。ルートCA証明書が生成されました。

```
$ openssl x509 -in ca.cer -noout -issuer -subject
issuer=O = mitome.in test, CN = mitome.in test CA
subject=O = mitome.in test, CN = mitome.in test CA
```

#### クライアント証明書
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

Firefoxにインポートできるよう、私有鍵と併せてPKCS #12形式に変換します。

```
$ openssl pkcs12 -export -inkey client.key -in client.cer -out client.p12
```

### Firefoxへの証明書のインポート
Firefoxを起動し、右上のハンバーガーメニューからPreferencesをクリックし、左のペインからPrivacy & Securityをクリックします。

クライアント証明書をインポートします。Certificatesの項のView Certificates...をボタンをクリックし、Your CertificatesのImport...ボタンをクリックします。

![Firefoxにクライアント証明書をインポートする](/firefox-import-clientcert.png)

このようにテスト用のクライアント証明書をインポートすることができました。

![Firefoxにインポートされたクライアント証明書](/firefox-view-clientcert.png)

ルートCA証明書もインポートします。

::: danger
この操作の結果、FirefoxはインポートされたルートCA証明書を信用することになります。これは、このルートCA証明書とペアになっている私有鍵によって電子署名された全ての証明書を信用することを意味します。私有鍵が適切に管理されていないルートCA証明書をインポートしてしまわないように注意してください。
:::

先程と同様、Firefoxの右上のハンバーガーメニューからPreferencesをクリックし、左のペインからPrivacy & Securityをクリックします。Certificatesの項のView Certificates...をボタンをクリックし、Authorities...のImport...ボタンをクリックします。

![FirefoxにルートCA証明書をインポートする](/firefox-import-ca.png)

Firefoxが信用する範囲をできるだけ限定しておきます。

![FirefoxにインポートするルートCA証明書の有効範囲を設定する](/firefox-import-ca-confirm.png)

このようにテスト用のルートCA証明書をインポートすることができました。

![FirefoxにインポートされたルートCA証明書](/firefox-view-ca.png)

### LibreOfficeの起動と電子署名
Xubuntu 20.04のLibreOfficeはデフォルトではThuderbirdにインポートされた証明書を参照するようです。

LibreOfficeを起動し、Tools - Options... - Securityとメニューをたどり、Certificateボタンを押してFirefoxのものを参照するように設定を変更します。

![LibreOfficeの証明書へのパスの変更](/libreoffice-cert-path.png)

設定を変更すると、LibreOfficeの再起動を促されます。再起動したら文書を新規作成してみましょう。

文書を作成保存すると、電子署名が可能です。文書を保存したら、File - Digital Signatures - Digital Signatures...とメニューをたどります。Sign Document...メニューをクリックし、先ほどインポートしたクライアント証明書を選択し、Signボタンをクリックします。

![LibreOfficeでの文書への電子署名](/libreoffice-sign.png)

これで、文書への署名が完了し、LibreOfficeが文書の内容を検証するようになりました。

![LibreOfficeによる電子署名の検証](/libreoffice-verify.png)

電子署名の検証が失敗することで、電子署名後に内容が編集されたことがわかります。

![LibreOfficeによる電子署名の検証の失敗](/libreoffice-verify-failed.png)

クライアント証明書は文書に添付されて保存されるようです。クライアント証明書やルートCA証明書の無い環境では、電子署名の検証には成功しますが、クライアント証明書の検証はできません。

![LibreOfficeによるクライアント証明書の検証の失敗](/libreoffice-sign-noca.png)

## GnuPGに登録した鍵対の利用
LibreOfficeは、GnuPGに登録した鍵対や公開鍵を文書の暗号化や電子署名に利用することもできます。

Xubuntu 20.04では、LibreOfficeのgpg-agentとのやりとりがapparmorで許可されていません。`/etc/apparmor.d/usr.lib.libreoffice.program.soffice.bin`を下記のように編集する必要がありました^[[Ubuntu Launchpadに登録](https://bugs.launchpad.net/ubuntu/+source/libreoffice/+bug/1886092)させていただきました]。

```diff
--- /etc/apparmor.d.20200702/usr.lib.libreoffice.program.soffice.bin	2019-10-03 10:31:21.000000000 -1000
+++ /etc/apparmor.d/usr.lib.libreoffice.program.soffice.bin	2020-07-02 08:59:44.516754728 -1000
@@ -223,6 +223,7 @@

     owner @{HOME}/.gnupg/* r,
     owner @{HOME}/.gnupg/random_seed rk,
+    owner /{,var/}run/user/*/** rw,
   }

   # probably should become a subprofile like gpg above, but then it doesn't
```

クライアント証明書を利用する場合と同様、文書を保存したら、File - Digital Signatures - Digital Signatures...とメニューをたどります。Sign Document...メニューをクリックすることで、GnuPGに登録している私有鍵で電子署名できます。

![LibreOfficeでの文書へのGnuPGによる電子署名](/libreoffice-sign-gpg.png)

また、文書の保存時に、左下のEncrypt with GPG keyをチェックすることで、GnuPGに登録している公開鍵で暗号化することもできます。複数の受取人が復号できるよう、公開鍵は複数選ぶこともできます。

![LibreOfficeでの文書のGnuPGによる暗号化](/libreoffice-encrypt-gpg.png)
