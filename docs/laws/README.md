# 電子署名と実社会
ここまで、OpenPGPの規格と、電子署名や暗号を応用したオンラインでのやりとりについて紹介してきました。ここで、これらの技術と実生活、特に民事上の契約書との関係について考察しておきます。

## 電子署名及び認証業務に関する法律

ここまでにも述べたように、現代のオンラインでの日常生活では、特にウェブサイトの閲覧に[暗号通信の技術(TLS)](../OpenPGP/wot)が広く利用されています。また、一部の[SNS](../sns/)ではHTTP署名などの電子署名が利用されています。

いっぽう、契約書などの実社会での活用については、2000年に公布、2001年に施行された[電子署名及び認証業務に関する法律](https://elaws.e-gov.go.jp/search/elawsSearch/elaws_search/lsg0500/detail?lawId=412AC0000000102) (電子署名法と略称されることがあります) が電子署名について定めています。

同法第二条を読むと、本稿で述べてきたOpenPGPによる電子署名は同法で定められている電子署名に含まれそうです:

> この法律において「電子署名」とは、電磁的記録（電子的方式、磁気的方式その他人の知覚によっては認識することができない方式で作られる記録であって、電子計算機による情報処理の用に供されるものをいう。以下同じ。）に記録することができる情報について行われる措置であって、次の要件のいずれにも該当するものをいう。
>
> 一　当該情報が当該措置を行った者の作成に係るものであることを示すためのものであること。
>
> 二　当該情報について改変が行われていないかどうかを確認することができるものであること。

さらに、同法第三条は下記のように電子署名の効力を定めています:

> 電磁的記録であって情報を表すために作成されたもの（公務員が職務上作成したものを除く。）は、当該電磁的記録に記録された情報について本人による電子署名（これを行うために必要な符号及び物件を適正に管理することにより、本人だけが行うことができることとなるものに限る。）が行われているときは、真正に成立したものと推定する。

ここで、下記に詳しく説明するように、

- 「真正に成立」したものと
- 「推定」する

という言葉には法律特有の意味があります。

### 成立の真正
文書を作成した者の意思に基づいて文書が記載されたこと(他人が勝手に書いたものではないこと)が、その文書の「成立の真正」と呼ばれます。[民事訴訟法第二百二十八条](https://elaws.e-gov.go.jp/search/elawsSearch/elaws_search/lsg0500/detail?lawId=408AC0000000109#1161)第１項にも、

> 文書は、その成立が真正であることを証明しなければならない。

と規定されています。ある契約書が、「真正に成立した」ものであると認められた場合、契約書の記載内容通りの約束(合意)があったと認められる可能性が高いということになります。

### 推定
「推定」についての規定上は、上記の電子署名及び認証業務に関する法律第三条のほか、[民事訴訟法第二百二十八条](https://elaws.e-gov.go.jp/search/elawsSearch/elaws_search/lsg0500/detail?lawId=408AC0000000109#1161)第４項にもあります:

> 私文書は、本人又はその代理人の署名又は押印があるときは、真正に成立したものと推定する。

これらの法律の規定によって成立の真正が「推定」された場合には、契約書がニセモノであると証明して裁判官を納得させられなければ、その契約書がホンモノであると認められることになります。

### 二重の推定
押印による成立の真正の推定については、最高裁判所によって「二重の推定」と呼ばれる法理が認められていて、「推定」には下記のふたつの意味があるといえます:

1. 契約書の印影と印章が合致したときは、その印影は本人の意思で押されたこと（事実上の推定）
2. 印影が本人の意思に基づく場合には、その文書全体が本人の意思に基づき成立したこと（成立の真正の推定）

裏返すと、契約書がニセモノと証明するには、

1. 契約書に誰かが勝手に押印したものであることや、
2. 押印はホンモノだけれど契約書の内容は誰かが勝手に書いたもの(または一部を書き替えたもの)であること

を証拠を示して主張しなければならないことになります。通常は極めて困難であると言われています。

## 電子署名の今後
このように、民事訴訟では、押印された文書の力は絶大なので、法律実務上、署名または記名押印(実務的には手書きのサインと押印が併用されることもあります)された契約書を作成することが重要とされています。

OpenPGPでの電子署名は、

1. 私有鍵を持っている人しか施せず、
2. 公開鍵によって検証することで内容が改竄されていないことを確かめられる

ことから、押印と同様、二重の推定が成り立つ可能性が高そうです。

電子署名が押印に取って代わる可能性は全くないわけではなさそうです。