# 電子署名サービス
[手元の計算機でのOpenPGP鍵対の管理や組織内でのクライアント証明書の管理](../OpenPGP/wot.html)の煩雑さを回避するため、電子署名を提供するサービスがあります。このようなサービスでは、[電子署名及び認証業務に関する法律第三条](../laws/#電子署名及び認証業務に関する法律)による「本人による電子署名」の要件を満たさない仕組みが採用されている場合が多いようです^[[「電子署名法の改正」に関する意見](https://holmes.my.salesforce.com/sfc/p/?fbclid=IwAR2Lq3RGj6M2XNUf1G15OtyqJwiimX8uk-v0u2pR1vx3325YHR7ogoRc9Ew#7F000002aD7F/a/7F0000009j68/re5ng_y5dcWytTEUJ5bQoNW3TZ8ye770bk_uZQ_IZ.A)]。

実際、DocuSignで署名されたPDF文書の署名を検証すると、署名の主体となったクライアント証明書として、[自組織で生成・管理するもの](../misc/libreOffice.html#クライアント証明書)の代わりに、DocuSignのものが利用されていることがわかります。

![DocuSignで署名されたPDF文書の署名の検証](/acrobat-reader-docusign-sign.png)
