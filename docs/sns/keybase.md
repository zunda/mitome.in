# Keybase
## PGP公開鍵の登録
Keybaseの利用を始めるとOpenPGP公開鍵が生成されます。

下記のような手順で鍵IDを確認できます。

```
$ keybase pgp export | gpg
gpg: WARNING: no command supplied.  Trying to guess what you mean ...
pub   rsa4096 2017-03-13 [SC]
      C31D6E888EEB6DACEA881A8C7BF7154E0B170373
uid           zunda <zundan@gmail.com>
uid           zunda <zunda@freeshell.org>
sub   rsa2048 2017-03-13 [E] [expires: 2025-03-11]
sub   rsa2048 2017-03-13 [SA] [expires: 2025-03-11]
```

下記のような手順でPGP公開鍵サーバに登録できます。

```
$ keybase pgp export | curl -T - https://keys.openpgp.org
Key successfully uploaded. Proceed with verification here:
https://keys.openpgp.org/upload/…
```
