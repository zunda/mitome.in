# Keybase
[Keybase](https://keybase.io/)はエンドツーエンドの暗号化によって安全にメッセージをやりとりしたりファイルを共有したりするサービス^[2020年5月に[ZoomはKeybaseを買収](https://keybase.io/blog/keybase-joins-zoom)しました。今後の動向に注視が必要かもしれません]です。ウェブブラウザの他、Android、iOS、Linux、macOS、Windows用のアプリでも利用できます。

## サーバやクライアントどうしのやりとり
Keybaseではアカウントへのログインにパスフレーズを使えますが、基本的にはクライアントプログラム(あるいはクライアントデバイス)から利用することになります。クライアントプログラムからアクセス可能な情報はkeybaseサーバ上に共通鍵暗号で暗号化されて保管されていて、共通鍵は、アクセス可能なクライアントプログラムそれぞれの公開鍵で暗号化されて保管されています。

ライアントプログラムどうしはKeybaseサーバを通してやりとりします。Keybaseは、公開鍵暗号を利用したやりとり暗号化すすることにより、クライアントプログラム同士はKeybaseサーバに知られることなく共通鍵を共有できるように設計されています。

この節は、DegicaのTaku Nakajimaさんによるブログ記事『[Keybaseの暗号化 git を理解するためのポイント](https://tech.degica.com/ja/2017/10/06/keybase-git/)』を参考にさせていただきました。Keybaseによる『[Keybase Crypto Documents](https://book.keybase.io/docs/crypto)』でも、リンク先の文書が一部失われていますが、詳細を確認できそうです。

## OpenPGP鍵対
Keybaseの利用を始めるとOpenPGP鍵対が生成あるいはインポート^[本稿で紹介している鍵対がどう生成されたのか記録が残っていません。すみません]され、CLIから利用可能になります。詳細については、`keybase help gpg`などを参照してください。生成された私有鍵のパスフレーズは、Keybaseのパスワードと同じです。

Keybaseに登録してある鍵対のIDを、下記のような手順で確認できます。

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

Keybaseに登録されているOpenPGP公開鍵は、[`curl`コマンドで`https://keybase.io/ユーザーID/key.asc`から取得したり`keybase pgp pull`コマンドでGnuPG鍵束にインポートすることもできます](https://keybase.io/encrypt)。
