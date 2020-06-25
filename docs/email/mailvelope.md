# mailvelope

:::warning
この記事は書きかけです
:::

## mailvelopeとは

mailvelopeはブラウザの拡張機能です。
mailvelopeを導入すればgmail.comやoutlook.comなどのサイトでも、PGPを使って暗号化されたメールを送受信できるようになります。
firefoxやEdge、Google Chromeを公式にサポートしています。
無料でも使えますが、有料プランだとGSuiteとの連携が強化されたりするみたいです。
また、プログラムが[公開されている](https://github.com/mailvelope/mailvelope)ため、不安な方はソースコードを検証することができます。

## 使い方

### 初期設定

最初、mailvelopeはあなたのPGP鍵を知りません。
ですから、鍵を作成するか、鍵をファイルなどからインポートするか、GnuPGと連携させます。

![](/mailvelope/find_mailvelope_icon_in_window.png)
拡張機能をインストールしたら、上図のようにアドレスバーの横からMailvelopeのアイコンをクリックしてください。
するとメニューが出てくるので、「鍵リング」を選択。
![](/mailvelope/prepare_keyring.png)
選択すると「鍵リングの準備という題名のページが表示され、「鍵の生成」、「鍵をインポート」、「GnuPGによる接続」の3つからmailvelopeにPGP鍵を教える方法を選択できるので自由に選択してください。
以下、章別に方法を示します。

#### 鍵を生成

![](/mailvelope/generated_keyring.png)

上図のように名前とメールアドレス、パスワードを入力すれば生成されます。

#### インポートする

公開鍵サーバからインポートするか、`.asc`方式の鍵ファイルを選択することができます。

#### GnuPGと連携する

この操作では最初にgpgmeというソフトウェアのインストールを必要とします。
基本的にはgpgmeのインストールができていれば、mailvelopeの再起動をすれば自動的に連携が可能です。
しかし、連携できない場合は[この設定例](https://github.com/mailvelope/mailvelope/wiki/Mailvelope-GnuPG-integration)の通りに
ファイルを作成する必要があります。

連携ができる状態になると先程の「鍵リングの準備」ページに以下のようなドロップダウンメニューが表示されるので使いたい鍵を選択すれば完了です。
![](/mailvelope/manage_keyring.png)

### Gmail

Gmailでの使い方を例にとった、公式による[使い方ガイド（英語）](https://www.mailvelope.com/en/help)があります。
しかし、以下に示す、Outlookでの使用方法と基本的には一緒かと思われます。

### Outlook

メールの新規作成画面にします。
ここで宛先などを書かず、そのままMailvelopeのロゴをクリック。
後で述べますが、宛先もMailvelopeでよしなにやってくれます。
![](/mailvelope/find_mailvelope_icon.png)
下図のようなウィンドウが出てきます。
ここで宛先とメッセージを記入し、「暗号化」をクリック。
![](/mailvelope/write_body_with_address.png)
ここで送られる側の人の公開鍵を知っているか、送られる側の人の公開鍵が鍵サーバに公開されている必要があります。
![](/mailvelope/pasted_encrypted_text_with_address.png)
宛先と本文が挿入された状態になるので送信。

## 参考

* [公式サイト（英語）](https://mailvelope.com/en/)
* [Firefox addons](https://addons.mozilla.org/ja/firefox/addon/mailvelope/)
* [chrome web store](https://chrome.google.com/webstore/detail/mailvelope/kajibbejlbohfaggdiogboambcijhkke)
