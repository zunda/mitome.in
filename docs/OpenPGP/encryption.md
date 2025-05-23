# 暗号化と復号
OpenPGPに従って生成した公開鍵や私有鍵を利用して、メッセージを暗号化したり復号したりすることができます。前のページで生成した鍵を使って暗号化と復号を試してみましょう。

::: tip
本稿ではブラウザ上でテキストのメッセージを取り扱いますが、OpenPGPではバイナリのデータも同様に取り扱うことができます。
:::

## メッセージの暗号化
メッセージの暗号化の際には、復号をできる受取人の公開鍵を指定します。複数の公開鍵を指定すると、それぞれのペアになっている私有鍵で復号することができます。

::: details 複数の公開鍵による暗号化
OpenPGPでは暗号化の度にセッション鍵を生成してそれをメッセージの暗号化に利用し、セッション鍵を公開鍵で暗号化することにより秘匿性を確保します。複数の公開鍵で暗号化する際には、それぞれの公開鍵で暗号化したセッション鍵を暗号文で添付します。復号の際には、暗号化されたセッション鍵のいずれかを復号できた場合に、メッセージを復号できることになります。セッション鍵は推測されしまってはいけないので、鍵対の生成時と同様、セッション鍵の生成に暗号論的に安全な乱数が必要です。
:::

::: tip
不要な公開鍵は、一覧内の鍵の左の <font-awesome-icon icon="eraser" /> ボタンを押して取り除くことができます。暗号文の上の <font-awesome-icon icon="copy" /> ボタンを押して暗号文をクリップボードにコピーすることができます。
:::

<noscript>JavaScriptを有効にすると下記で暗号化を試せます。</noscript>
<Encrypt />

## 暗号化したメッセージの復号
次に、暗号したメッセージを復号してみましょう。受取人の公開鍵のいずれかとペアになっている私有鍵を、私有鍵にパスフレーズを設定した場合にはパスフレーズと一緒に指定しておけば、下記にペーストした暗号文を復号して元のメッセージを確認できます。

::: warning
原則的に、実際に利用する私有鍵をブラウザにペーストしないように注意してください。ブラウザが表示しているウェブサイトに私有鍵が漏洩してしまう可能性があります。
:::

<noscript>JavaScriptを有効にすると下記で復号を試せます。</noscript>
<Decrypt />

::: tip
復号できない場合には、暗号化した時に指定した公開鍵とペアになっている私有鍵を指定したかどうか、パスフレーズを設定した場合には間違っていないか、再確認してみてください。
:::

セキュリティキーやスマートカードなどの[暗号デバイス](../device/)は、ホストの計算機から暗号文を受け取り、格納された私有鍵によって復号したメッセージをホストの計算機に送り返すので、デバイスの外に私有鍵を提示する必要がありません。デバイスを堅牢にすることで、複製できない私有鍵を利用しやすい状態で保管することができます。

暗号化と復号の次は、デジタル署名と検証を試してみましょう。
