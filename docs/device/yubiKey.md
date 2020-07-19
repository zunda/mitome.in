# YubiKey
[YubiKey](https://www.yubico.com/products/)は[Yubico社](https://www.yubico.com/)のハードウェア認証デバイスで、種々の認証プロトコルに対応しています。

本稿では、2020年7月に購入した[YubiKey 5 NFC](https://www.yubico.com/product/yubikey-5-nfc)でOpenPGPを試してみます。

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
Application ID ...: D2760001240103040006134605900000
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

`keytocard`コマンドで、まず署名鍵をYubiKeyに移動します。私有鍵のパスフレーズを入力した後、YubiKeyのAdmin PIN ([デフォルト](https://support.yubico.com/support/solutions/articles/15000006420-using-your-yubikey-with-openpgp)では12345678)を入力します。

```
gpg> keytocard
Really move the primary key? (y/N) y
Please select where to store the key:
   (1) Signature key
   (3) Authentication key
Your selection? 1
```

![Admin PINの入力](/yubiKey-admin-pin.png)

次に`keytocard`コマンドで認証鍵をYubiKeyに移動します。

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

最後に移動した鍵を`~/.gnupg/`から取り除いて終了します。

```
gpg> quit
Save changes? (y/N) y
```

私有鍵がYubiKeyに移動されたことを確認します。

```
$ gpg --list-secret-keys
/home/zunda/.gnupg/pubring.kbx
------------------------------
sec>  rsa3072 2020-06-24 [SC] [expires: 2022-06-24]
      F60960D80B224382CA8D831CB56C20316D6E8279
      Card serial no. = 0006 ********
uid           [ultimate] zunda <zundan@gmail.com>
ssb   rsa3072 2020-06-24 [E] [expires: 2022-06-24]

```

YubiKeyのOpenPGPアプレットの状態も確認できます。電子署名を生成した回数も記録されているようです。

```
$ gpg --card-status
Reader ...........: Yubico YubiKey OTP FIDO CCID 00 00
Application ID ...: D2760001240103040006134605900000
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
Key attributes ...: rsa3072 rsa2048 rsa3072
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 3
KDF setting ......: off
Signature key ....: F609 60D8 0B22 4382 CA8D  831C B56C 2031 6D6E 8279
      created ....: 2020-06-24 05:26:57
Encryption key....: [none]
Authentication key: F609 60D8 0B22 4382 CA8D  831C B56C 2031 6D6E 8279
      created ....: 2020-06-24 05:26:57
General key info..: pub  rsa3072/B56C20316D6E8279 2020-06-24 zunda <zundan@gmail.com>
sec>  rsa3072/B56C20316D6E8279  created: 2020-06-24  expires: 2022-06-24
                                card-no: 0006 ********
ssb   rsa3072/164F21FF001C8CD1  created: 2020-06-24  expires: 2022-06-24
```

## YubiKeyに移動された私有鍵の利用
これまで通り電子署名や復号します。私有鍵が必要になった時に、YubiKeyのUSBポートへの接続を求められます。

![YubiKeyの接続](/yubiKey-insert.png)

YubiKeyを接続して、YubiKeyのUser PIN ([デフォルト](https://support.yubico.com/support/solutions/articles/15000006420-using-your-yubikey-with-openpgp)では123456)を入力します。

![YubiKeyのUser PIN](/yubiKey-user-pin.png)
