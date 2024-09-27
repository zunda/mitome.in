# YubiKey
[YubiKey](https://www.yubico.com/products/)は[Yubico社](https://www.yubico.com/)のハードウェア認証デバイスで、種々の認証プロトコルに対応しています。

本稿では、2020年7月に購入した[YubiKey 5 NFC](https://www.yubico.com/product/yubikey-5-nfc)^[2020年9月には[YubiKey 5C NFC](https://www.yubico.com/product/yubikey-5c-nfc/)が発売されました。コネクタの形状以外はYubiKey 5 NFCと同じ仕様のようです。USB-Cを利用している場合はYubiKey 5C NFCを購入するのが良さそうです。]でOpenPGPを試してみます。

![パッケージに入ったYubiKey 5 NFC](/YubiKey5NFC.jpg)

## インストール
Xubuntu 20.04では、デフォルトでインストールされている`gpg`パッケージの他に、スマートカードとのやりとりのためのデーモン`pcscd`と、GnuPGにスマートカードのサポートを提供する`scdaemon`を追加でインストールする必要がありました。`pcscd`のために`libccid`もインストールされました。

```
$ sudo apt install pcscd scdaemon
```

## YubiKeyの接続
USBポートにYubiKey 5 NFCを接続します。`dmesg`コマンドで確認すると、入力デバイスとして認識されたことがわかります。

```
usb 5-1: new full-speed USB device number 6 using xhci_hcd
usb 5-1: New USB device found, idVendor=1050, idProduct=0407, bcdDevice= 5.26
usb 5-1: New USB device strings: Mfr=1, Product=2, SerialNumber=0
usb 5-1: Product: YubiKey OTP+FIDO+CCID
usb 5-1: Manufacturer: Yubico
input: Yubico YubiKey OTP+FIDO+CCID as /devices/pci0000:00/0000:00:07.1/0000:0a:00.3/usb5/5-1/5-1:1.0/0003:1050:0407.0007/input/input24
hid-generic 0003:1050:0407.0007: input,hidraw4: USB HID v1.10 Keyboard [Yubico YubiKey OTP+FIDO+CCID] on usb-0000:0a:00.3-1/input0
hid-generic 0003:1050:0407.0008: hiddev0,hidraw5: USB HID v1.10 Device [Yubico YubiKey OTP+FIDO+CCID] on usb-0000:0a:00.3-1/input1
```

GnuPGからはスマートカードとして認識されます。シリアル番号は隠してあります。

```
$ gpg --card-status
Reader ...........: 1050:0407:X:0
Application ID ...: D2760001240103040006********0000
Application type .: OpenPGP
Version ..........: 3.4
Manufacturer .....: Yubico
Serial number ....: ********
Name of cardholder: [not set]
Language prefs ...: [not set]
Salutation .......:
URL of public key : [not set]
Login data .......: [not set]
Signature PIN ....: not forced
Key attributes ...: rsa2048 rsa2048 rsa2048
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 0
KDF setting ......: off
Signature key ....: [none]
Encryption key....: [none]
Authentication key: [none]
General key info..: [none]
```

ここからは、Yubicoによる文書[Using Your YubiKey with OpenPGP](https://support.yubico.com/support/solutions/articles/15000006420-using-your-yubikey-with-openpgp)を参考に進めます。

## OpenPGP鍵対の生成
OpenPGP鍵対を生成しておきます。[GnuPGによる鍵対の生成と管理](../email/keyManagement.md)を参照してください。

## 私有鍵のバックアップの作成
YubiKeyに移動してしまった私有鍵は取り出すことができません。YubiKeyを壊してしまった場合に私有鍵が失なわれてしまわないように、バックアップを作成しておくこともできます。安全な場所に保管しておきましょう。

マスター鍵対のIDの例として、ここでは`F60960D80B224382CA8D831CB56C20316D6E8279`を利用します。手元の鍵対のIDで置き換えてください。

```
$ gpg --export-secret-key --armor F60960D80B224382CA8D831CB56C20316D6E8279
```

パスフレーズを入力すると、ASCII Armor形式で私有鍵が表示されます。安全な場所に保管してください。

## YubiKeyへの私有鍵の移動
YubiKey 5 NFCをUSBポートに接続したまま操作を進めます。`gpg --edit-key`コマンドを起動します。

```
$ gpg --edit-key F60960D80B224382CA8D831CB56C20316D6E8279
gpg (GnuPG) 2.2.19; Copyright (C) 2019 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

sec  rsa3072/B56C20316D6E8279
     created: 2020-06-24  expires: 2022-06-24  usage: SC
     trust: ultimate      validity: ultimate
ssb  rsa3072/164F21FF001C8CD1
     created: 2020-06-24  expires: 2022-06-24  usage: E
[ultimate] (1). zunda <zundan@gmail.com>

```

まず主鍵をYubiKeyの署名鍵スロットに移動します。私有鍵のパスフレーズを入力した後、YubiKeyのAdmin PIN ([デフォルト](https://support.yubico.com/support/solutions/articles/15000006420-using-your-yubikey-with-openpgp)では12345678)を入力します。

```
gpg> keytocard
Really move the primary key? (y/N) y
Please select where to store the key:
   (1) Signature key
   (3) Authentication key
Your selection? 1
```

![Admin PINの入力](/yubiKey-admin-pin.png)

主鍵をYubiKeyの認証鍵スロットにも移動します。

```
gpg> keytocard
Really move the primary key? (y/N) y
Please select where to store the key:
   (1) Signature key
   (3) Authentication key
Your selection? 3

sec  rsa3072/B56C20316D6E8279
     created: 2020-06-24  expires: 2022-06-24  usage: SC
     trust: ultimate      validity: ultimate
ssb  rsa3072/164F21FF001C8CD1
     created: 2020-06-24  expires: 2022-06-24  usage: E
[ultimate] (1). zunda <zundan@gmail.com>

```

次に暗号鍵をYubiKeyの暗号鍵スロットに移動します。

```
gpg> key 1

sec  rsa3072/B56C20316D6E8279
     created: 2020-06-24  expires: 2022-06-24  usage: SC
     trust: ultimate      validity: ultimate
ssb* rsa3072/164F21FF001C8CD1
     created: 2020-06-24  expires: 2022-06-24  usage: E
[ultimate] (1). zunda <zundan@gmail.com>

gpg> keytocard
Please select where to store the key:
   (2) Encryption key
Your selection? 2

sec  rsa3072/B56C20316D6E8279
     created: 2020-06-24  expires: 2022-06-24  usage: SC
     trust: ultimate      validity: ultimate
ssb* rsa3072/164F21FF001C8CD1
     created: 2020-06-24  expires: 2022-06-24  usage: E
[ultimate] (1). zunda <zundan@gmail.com>

```

最後に移動した鍵を`~/.gnupg/`から取り除いて終了します。

```
gpg> quit
Save changes? (y/N) y
```

私有鍵がYubiKeyに移動された(`sec`や`ssb`の後ろに`>`マークがある)ことを確認します。

```
$ gpg --list-secret-keys
/home/zunda/.gnupg/pubring.kbx
------------------------------
sec>  rsa3072 2020-06-24 [SC] [expires: 2022-06-24]
      F60960D80B224382CA8D831CB56C20316D6E8279
      Card serial no. = 0006 ********
uid           [ultimate] zunda <zundan@gmail.com>
ssb>  rsa3072 2020-06-24 [E] [expires: 2022-06-24]

```

公開鍵のURLを登録しておきます。

```
$ gpg --card-edit
gpg/card> admin
Admin commands are allowed
gpg/card> url
URL to retrieve public key: https://keys.openpgp.org/vks/v1/by-fingerprint/F60960D80B224382CA8D831CB56C20316D6E8279
gpg/card> quit
```

YubiKeyのOpenPGPアプレットの状態も確認できます。デジタル署名を生成した回数も記録されているようです。

```
$ gpg --card-status
Reader ...........: 1050:0407:X:0
Application ID ...: D2760001240103040006********0000
Application type .: OpenPGP
Version ..........: 3.4
Manufacturer .....: Yubico
Serial number ....: ********
Name of cardholder: [not set]
Language prefs ...: [not set]
Salutation .......:
URL of public key : https://keys.openpgp.org/vks/v1/by-fingerprint/F60960D80B224382CA8D831CB56C20316D6E8279
Login data .......: [not set]
Signature PIN ....: not forced
Key attributes ...: rsa3072 rsa2048 rsa3072
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 7
KDF setting ......: off
Signature key ....: F609 60D8 0B22 4382 CA8D  831C B56C 2031 6D6E 8279
      created ....: 2020-06-24 05:26:57
Encryption key....: CAE6 B476 3A84 A557 2636  25CE 164F 21FF 001C 8CD1
      created ....: 2020-06-24 05:26:57
Authentication key: F609 60D8 0B22 4382 CA8D  831C B56C 2031 6D6E 8279
      created ....: 2020-06-24 05:26:57
General key info..: pub  rsa3072/B56C20316D6E8279 2020-06-24 zunda <zundan@gmail.com>
sec>  rsa3072/B56C20316D6E8279  created: 2020-06-24  expires: 2022-06-24
                                card-no: 0006 ********
ssb>  rsa3072/164F21FF001C8CD1  created: 2020-06-24  expires: 2022-06-24
                                card-no: 0006 ********
```

## 私有鍵の利用
これまで通りデジタル署名や復号します。私有鍵が必要になった時に、YubiKeyのUSBポートへの接続を求められます。

![YubiKeyの接続](/yubiKey-insert.png)

YubiKeyを接続して、YubiKeyのUser PIN ([デフォルト](https://support.yubico.com/support/solutions/articles/15000006420-using-your-yubikey-with-openpgp)では123456)を入力します。

![YubiKeyのUser PIN](/yubiKey-user-pin.png)

## YubiKeyの設定
PINがデフォルトのままなのは鍵を紛失してしまった場合に心許無いので、変更しておきます。既存のUser PINと新しいUser PINを、GUIから入力します。

```
$ gpg --card-edit

gpg/card> admin
Admin commands are allowed

gpg/card> passwd
gpg: OpenPGP card no. D2760001240103040006********0000 detected

1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection? 1
```

同様にAdmin PINを変更します。

```
1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection? 3
```

終了します。

```
1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection? q

gpg/card> q
```

## 他のLinuxでの私有鍵の利用
Ubuntu 22.04で試してみます。GnuPG 2.2.27がインストールされていました。上と同様、まず追加で必要なパッケージをインストールします。デーモンの起動のためにインストール後にログアウトして再ログインしておくと良いでしょう。

```
$ sudo apt install pcscd scdaemon
```


GnuPGの鍵束にスタブを作成し、私有鍵のあるYubiKeyのシリアル番号を記録し、公開鍵を取得します。YubiKeyをUSBポートに挿入しておいて`gpg --card-edit`コマンドを実行することでスタブを作成し、`fetch`サブコマンドで、上記で登録したURLから公開鍵を取得します。

```
$ gpg --card-edit
gpg: directory '/home/zunda/.gnupg' created
gpg: keybox '/home/zunda/.gnupg/pubring.kbx' created

Reader ...........: 1050:0407:X:0
Application ID ...: D2760001240103040006********0000
Application type .: OpenPGP
Version ..........: 3.4
Manufacturer .....: Yubico
Serial number ....: ********
Name of cardholder: [not set]
Language prefs ...: [not set]
Salutation .......: 
URL of public key : https://keys.openpgp.org/vks/v1/by-fingerprint/F60960D80B224382CA8D831CB56C20316D6E8279
Login data .......: [not set]
Signature PIN ....: not forced
Key attributes ...: rsa3072 rsa3072 rsa3072
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 514
KDF setting ......: off
Signature key ....: F609 60D8 0B22 4382 CA8D  831C B56C 2031 6D6E 8279
      created ....: 2020-06-24 05:26:57
Encryption key....: CAE6 B476 3A84 A557 2636  25CE 164F 21FF 001C 8CD1
      created ....: 2020-06-24 05:26:57
Authentication key: F609 60D8 0B22 4382 CA8D  831C B56C 2031 6D6E 8279
      created ....: 2020-06-24 05:26:57
General key info..: [none]

gpg/card> fetch
gpg: requesting key from 'https://keys.openpgp.org/vks/v1/by-fingerprint/F60960D80B224382CA8D831CB56C20316D6E8279'
gpg: /home/zunda/.gnupg/trustdb.gpg: trustdb created
gpg: key B56C20316D6E8279: public key "zunda <zundan@gmail.com>" imported
gpg: Total number processed: 1
gpg:               imported: 1

gpg/card> quit
```

YubiKeyの私有鍵で自分の公開鍵に署名しておきます。`trust`サブコマンドで`5` (I trust ultimately)します。

```
$ gpg --edit-key F60960D80B224382CA8D831CB56C20316D6E8279
gpg (GnuPG) 2.2.27; Copyright (C) 2021 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

sec  rsa3072/B56C20316D6E8279
     created: 2020-06-24  expires: 2026-06-25  usage: SC  
     card-no: 0006 ********
     trust: unknown       validity: unknown
ssb  rsa3072/164F21FF001C8CD1
     created: 2020-06-24  expires: 2026-06-25  usage: E   
     card-no: 0006 ********
[ unknown] (1). zunda <zundan@gmail.com>

gpg> trust
sec  rsa3072/B56C20316D6E8279
     created: 2020-06-24  expires: 2026-06-25  usage: SC  
     card-no: 0006 ********
     trust: unknown       validity: unknown
ssb  rsa3072/164F21FF001C8CD1
     created: 2020-06-24  expires: 2026-06-25  usage: E   
     card-no: 0006 ********
[ unknown] (1). zunda <zundan@gmail.com>

Please decide how far you trust this user to correctly verify other users' keys
(by looking at passports, checking fingerprints from different sources, etc.)

  1 = I don't know or won't say
  2 = I do NOT trust
  3 = I trust marginally
  4 = I trust fully
  5 = I trust ultimately
  m = back to the main menu

Your decision? 5
Do you really want to set this key to ultimate trust? (y/N) y

sec  rsa3072/B56C20316D6E8279
     created: 2020-06-24  expires: 2026-06-25  usage: SC  
     card-no: 0006 ********
     trust: ultimate      validity: unknown
ssb  rsa3072/164F21FF001C8CD1
     created: 2020-06-24  expires: 2026-06-25  usage: E   
     card-no: 0006 ********
[ unknown] (1). zunda <zundan@gmail.com>
Please note that the shown key validity is not necessarily correct
unless you restart the program.

gpg> quit
```

これで、YubiKeyに移動された私有鍵を、私有鍵を生成したのとは異なる環境で利用できるようになりました。

Gitで変更内容へデジタル署名してみましょう。

```
$ git commit -S
[move-yubikey 3a27355] Use YubiKey at a separate environment
 1 file changed, 119 insertions(+)
```

デジタル署名の検証に成功しました。

```
$ git verify-commit 3a27355
gpg: Signature made Sun 19 Jul 2020 02:33:49 PM HST using RSA key ID 6D6E8279
gpg: Good signature from "zunda <zundan@gmail.com>" [ultimate]
```

### 新しいYubiKeyでの既存の鍵対の利用
上記の操作でGnuPGは鍵束にスタブを作成し、私有鍵のあるYubiKeyのシリアル番号を記録しました。新しいYubiKeyを購入した場合など、スタブを更新する場合には、いちどスタブを消去する必要があるようです。操作の結果、`gpg --list-secret-keys`に対象の私有鍵が表示されなくなりました。

```
$ gpg --delete-secret-key F60960D80B224382CA8D831CB56C20316D6E8279
gpg (GnuPG) 2.2.4; Copyright (C) 2017 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.


sec  rsa3072/B56C20316D6E8279 2020-06-24 zunda <zundan@gmail.com>

Delete this key from the keyring? (y/N) y
This is a secret key! - really delete? (y/N) y
```

既存のスタブを消去したあと、新しいYubiKeyをUSBポートに挿入し`gpg --card-edit`コマンドを実行することで、再度鍵束にスタブが生成され、新しいYubiKeyのシリアル番号が記録されます。

## macOSでの私有鍵の利用
[GPG Suiteをインストール](../email/keyManagement.md#gnupg%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)したmacOSでもYubiKeyに格納された私有鍵を利用することができます。

GPG SuiteでインストールされるGPG Keychainで、Lookup KeyからPGP公開鍵サーバに登録した公開鍵を、メールアドレスなどで検索してインポートします。

私有鍵がYubiKeyにあることを、GPG Suiteに知らせます。YubiKeyをUSBポートに挿入し`gpg --card-status`コマンドを実行することで、鍵束にスタブが生成され、私有鍵のあるYubiKeyのシリアル番号が記録されます。

```
$ gpg --card-status
Reader ...........: 1050:0407:X:0
Application ID ...: D2760001240103040006********0000
Application type .: OpenPGP
Version ..........: 3.4
Manufacturer .....: Yubico
Serial number ....: ********
Name of cardholder: [not set]
Language prefs ...: [not set]
Salutation .......:
URL of public key : https://keys.openpgp.org/vks/v1/by-fingerprint/F60960D80B224382CA8D831CB56C20316D6E8279
Login data .......: [not set]
Signature PIN ....: not forced
Key attributes ...: rsa3072 rsa2048 rsa3072
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 10
KDF setting ......: off
Signature key ....: F609 60D8 0B22 4382 CA8D  831C B56C 2031 6D6E 8279
      created ....: 2020-06-24 05:26:57
Encryption key....: CAE6 B476 3A84 A557 2636  25CE 164F 21FF 001C 8CD1
      created ....: 2020-06-24 05:26:57
Authentication key: F609 60D8 0B22 4382 CA8D  831C B56C 2031 6D6E 8279
      created ....: 2020-06-24 05:26:57
General key info..: pub  rsa3072/B56C20316D6E8279 2020-06-24 zunda <zundan@gmail.com>
sec>  rsa3072/B56C20316D6E8279  created: 2020-06-24  expires: 2022-06-24
                                card-no: 0006 ********
ssb#  rsa3072/164F21FF001C8CD1  created: 2020-06-24  expires: 2022-06-24
```

::: tip
環境によっては^[MacBook Air M1, 2020、macOS Ventura 13.3.1、GPG_Suite-2023.2で確認しました]、`gpg --card-status`コマンドが、`Operation not supported by device`といったエラーを表示して失敗することがあるようです。Yubicoによる[Troubleshooting Issues with GPG](https://support.yubico.com/hc/en-us/articles/360013714479-Troubleshooting-Issues-with-GPG)を参考に、下記の内容のファイルを`~/.gnupg/scdaemon.conf`として作成して、ラップトップを再起動することでエラーを解消することができました。

```
shared-access
```
:::

GPG Keychainで、公開鍵をダブルタップして、Detailsメニューから公開鍵の指紋が自分のものであることを確認して、Owner TrustをUltimateにします。

![GPG Keychainでの信頼度の設定](/gpg-suite-keychain.png)

デジタル署名や復号などで私有鍵が必要になった場合には、YubiKeyのUser PINをPinentryに入力します。

![Pinentry MacへのPINの入力](/gpg-suite-pinentry.png)

## 携帯電話での私有鍵の利用
[OpenKeychain](../misc/openKeychain.md)などのアプリケーションをNFCの利用可能な携帯電話インストールすることで、YubiKeyに格納された私有鍵を利用できるようになります。

## エアギャップ環境での鍵対の管理
私有鍵の秘匿性を高めるため、ネットワーク接続のない環境で鍵対を生成しYubiKeyへ保管したい場合があります。このような場合、[Tails OS](https://tails.boum.org/)などを利用し、USBフラッシュメモリに収めたOSを起動しネットワークに接続せずに鍵対の生成とYubiKeyの管理が可能です。

2022年5月現在、Tails 5.0では下記のバージョンのパッケージが利用できました。

- gpg-2.2.27-2+deb11u1
- scdaemon-2.2.27-2+deb11u1
- pcscd-1.9.1-1
- libccid-1.4.34-1
- paperkey-1.6-1

paperkeyは、生成した私有鍵を紙に印刷するなどしてバックアップしやすい形式に変換するツールです。`gpg –export-secret-key | paperkey`などのコマンド列で利用します。私有鍵がネットワークに露出してしまわないよう、印刷にはUSBなどで直接接続されたプリンタを利用する必要があります。
