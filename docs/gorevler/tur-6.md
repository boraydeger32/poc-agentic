# Görev tur-6: `Kenar çubuğu (sidebar) ve modüller`

Stok takip uygulamasına solda bir kenar çubuğu ekle ve uygulamayı modüllere ayır. Şu an her şey tek sayfada; kullanıcı kenar çubuğundan modül seçerek gezinebilmeli.

## Kenar çubuğu

* Sayfanın solunda sabit durur; üstünde uygulama adı, altında modül bağlantıları vardır.
* Seçili modül görsel olarak belli olur (yalnız renkle değil).
* Kritik stok bağlantısının yanında kritik ürün sayısı rozet olarak görünür; sayı 0 ise rozet görünmez.
* 600 pikselin altında kenar çubuğu kapalı gelir, bir menü düğmesiyle açılıp kapanır; bir modül seçilince kendiliğinden kapanır.
* Klavye ile gezilebilir; menü düğmesinin ve bağlantıların erişilebilir adları vardır.

## Modüller

1. Özet: toplam ürün sayısı, toplam stok adedi, kritik ürün sayısı ve son 5 stok hareketi.
2. Ürünler: mevcut ürün listesi ve bütün işlevleri (arama, kategori ve kritik süzgeçleri, yeni ürün, giriş, çıkış, düzenle, geçmiş, CSV indirme) burada, aynen çalışır.
3. Stok hareketleri: bütün ürünlerin giriş ve çıkış hareketleri tek listede, en yeni üstte; ürüne ve hareket türüne göre süzülebilir.
4. Kritik stok: yalnız kritik seviyenin altındaki ürünler; her satırdan stok girişi yapılabilir.
5. Ayarlar: örnek veriyi yükleme ve bütün veriyi silme (silmeden önce onay ister).

## Gezinme

* Açılışta Özet modülü gelir.
* Seçili modül adres çubuğundaki hash ile tutulur (örneğin #/urunler); sayfa yenilenince aynı modül açılır, tarayıcının geri düğmesi önceki modüle döner.
* Tanınmayan bir hash gelirse Özet açılır.

## Kısıtlar

* Mevcut veri ve localStorage biçimi korunur; kullanıcının kayıtlı ürünleri ve hareketleri kaybolmaz.
* Mevcut işlevlerin hiçbiri bozulmaz; mevcut testler geçmeye devam eder.
* Dış paket, yazı tipi ya da derleme adımı eklenmez.
* Hangi modülün açılacağı, özet sayıları ve hareket listesinin süzülmesi src/ altında saf fonksiyonlar olarak yazılır ve testle ölçülür.

## Kapsam dışı

* Kullanıcı girişi, yetkilendirme, sunucu tarafı.
* Yeni veri alanları (tedarikçi, fiyat, depo gibi).
* Grafikler ve raporlama.

## Üst bağlam (SAFe ekibi)
Aşağıdakiler bu görev için bağlayıcıdır: kapsamın dışına çıkma, kısıtlara uy.

### PM — değer ve kapsam
**Değer:** Stok takibini küçük işletmede kullanan kişi şu an her şeyi tek uzun sayfada görüyor. Kenar çubuğu ve modüller, ihtiyacı olan işe (özet bakma, ürün yönetimi, hareketlere bakma, kritik stoğu hızlıca doldurma, veri yönetimi) doğrudan gitmesini sağlar. Kritik ürün sayısı her sayfadan görünür. Telefonda da kullanılabilir kalır.

**Kapsam**
- Sayfanın solunda sabit kenar çubuğu: üstte uygulama adı, altında beş modül bağlantısı (Özet, Ürünler, Stok hareketleri, Kritik stok, Ayarlar).
- Seçili modül renk dışında bir işaretle de belli olur (kalın yazı, çizgi ya da işaret gibi).
- Kritik stok bağlantısında kritik ürün sayısı rozeti; sayı 0 ise rozet görünmez. Sayı, stok değişince güncellenir.
- 600 pikselin altında kenar çubuğu kapalı açılır, menü düğmesiyle açılıp kapanır, modül seçilince kendiliğinden kapanır.
- Klavyeyle gezinme; menü düğmesi ve bağlantıların erişilebilir adları (rozet sayısı bağlantının adında anlaşılır olur).
- Özet modülü: toplam ürün sayısı, toplam stok adedi (stok miktarlarının toplamı), kritik ürün sayısı ve son 5 stok hareketi.
- Ürünler modülü: bugünkü ürün listesi ve bütün işlevleri (arama, kategori ve kritik süzgeçleri, yeni ürün, giriş, çıkış, düzenle, geçmiş, CSV indirme) aynen burada çalışır.
- Stok hareketleri modülü: bütün ürünlerin hareketleri tek listede, en yeni üstte; ürüne ve hareket türüne göre süzülür. En dar yorum: veride bulunan düzeltme hareketleri de listelenir ve tür süzgecinde seçilebilir; hareket satırında ürün adı görünür.

**Kapsam dışı**
- Kullanıcı girişi, yetkilendirme, sunucu tarafı.
- Yeni veri alanları (tedarikçi, fiyat, depo vb.); ürün ve hareket biçimi değişmez.
- Grafikler ve raporlama.
- Dış paket, yazı tipi ya da derleme adımı.
- Mevcut ürün işlevlerinde davranış değişikliği ya da yeniden tasarım; Ürünler modülü yalnızca taşınır.
- Hareket listesinde tarih aralığı, arama, sıralama veya sayfalama; yalnız ürün ve tür süzgeci istendi.
- Kritik stok modülünde giriş dışında işlem (çıkış, düzenleme, geçmiş) ve kritik eşiğinin tanımının değişmesi.
- Ayarlar'da örnek veri ve silme dışında seçenek (dışa/içe aktarma, tema vb.).

**Bölme önerisi:** Tek seferde teslim edilebilir büyüklükte ama istenirse iki dilimde: (1) kenar çubuğu, hash gezinmesi ve modül iskeleti; Özet ve Ürünler (mevcut işlevlerin taşınması) ve rozet; (2) Stok hareketleri, Kritik stok ve Ayarlar modülleri. Bölünürse ilk dilim tek başına çalışır durumda olmalı.

### System Architect — mimari kısıtlar
**Kısıtlar**
- Modül seçimi, özet sayıları (ürün sayısı, stok toplamı, kritik sayısı, son 5 hareket), rozet sayısı ve hareket listesi süzgeci (ürün + tür, en yeni üstte) saf fonksiyon olarak src/stok.js içinde yazılır; girdiyi değiştirmez, DOM/localStorage/Date'e dokunmaz ve tests/stok.test.js içinde testle ölçülür. README'ye göre app.js yalnız stok.js'i çağırır; ayrı bir src dosyası açılacaksa README Yapı bölümü de güncellenir ve app.js içine mantık gömülmez.
- Veri biçimi değişmez: ürün {id, ad, sku, kategori, birim, stok, minStok, alisFiyati, satisFiyati}, hareket {id, urunId, tur, miktar, aciklama, tarih}; ANAHTAR altındaki localStorage yapısı ({urunler, hareketler}) ve veriGecerliMi/try-catch ile bozuk veriyi karşılayan yükleme aynen kalır. Hash ve menü durumu localStorage'a yazılmaz. Hareket listesi TURLER'in üçünü (giris, cikis, duzeltme) kapsar; ürün adı urunId üzerinden bulunur.
- Kritik tanımı tek yerde, mevcut kritikMi (stok <= minStok) / kritikStoklar olarak kalır; rozet, Özet sayısı ve Kritik stok modülü bunları kullanır, yeni eşik yazılmaz. Görevdeki 'altında' ifadesi mevcut kuralı değiştirmez; bu ifade ile kodun uyuşmazlığı mimar/PM ile netleştirilir. Rozet her stok değişiminden (giriş, çıkış, düzenleme, örnek veri, silme) sonra yeniden hesaplanır. Kritik stok modülündeki giriş, mevcut hareketEkle akışını kullanır; stok mantığı çoğaltılmaz.
- Mevcut testler geçmeye devam eder: index.html'de <title> ve <h1> 'Stok takip', header ve main landmark'ları, tablo ve sütun başlıkları, 600px max-width medya sorgusu, CSS belirteçleri (var(--...)) kalır; app.js'deki her getElementById kimliği index.html'de tanımlı olur; kullanıcı metni yalnız textContent ile yazılır (innerHTML, outerHTML, insertAdjacentHTML yok, ürün/hareket adı dahil); Ürünler modülünün işlevleri ve metinleri ('Yeni ürün', 'CSV indir', 'Yalnız kritik stok', 'Örnek verilerle başla') davranış değişmeden taşınır.
- Dış paket, CDN, yazı tipi, framework ve derleme adımı eklenmez; package.json'a bağımlılık girmez; script göreli yolla type=module olarak yüklenir ve python3 -m http.server 8080 ile doğrudan çalışır. Gezinme yalnız location.hash + hashchange ile yapılır (ör. #/urunler); bilinmeyen/boş hash Özet'e düşer, geri düğmesi önceki modüle döner, sayfa yenilenince aynı modül açılır. Yeni hash yolları saf fonksiyonda tek tablodan okunur.
- Erişilebilirlik ve duyarlılık denetlenebilir olur: kenar çubuğu <nav> içinde aria-label'lı, bağlantılar gerçek <a href='#/...'> öğeleri (klavyeyle gezilir); seçili bağlantıda aria-current='page' ve renk dışı işaret (kalın yazı/çizgi) bulunur; menü düğmesi gerçek <button>, erişilebilir adlı, aria-expanded/aria-controls taşır; rozet sayısı bağlantının erişilebilir adında geçer, 0 ise rozet DOM'da gizlenir. 600px altı davranışı mevcut medya sorgusu kuralıyla yapılır, modül seçilince menü kapanır; geniş ekranda sabit kalır. Renk değerleri :root belirteçlerinden gelir.

**Etkilenen alanlar**
- index.html: kenar çubuğu <nav>, menü düğmesi, modül bölümleri (Özet, Ürünler, Stok hareketleri, Kritik stok, Ayarlar) ve ilgili CSS (:root belirteçleri, 600px medya sorgusu)
- src/stok.js: yeni saf fonksiyonlar (modül çözümleme, özet, rozet sayısı, hareket süzgeci)
- src/app.js: hash gezinmesi, modül çizimi, rozet güncelleme, Ayarlar (örnek veri yükle, onaylı tümünü sil), Kritik stok girişi; mevcut ürün işlevleri taşınır
- tests/stok.test.js (yeni fonksiyon testleri) ve gerekirse tests/sayfa.test.js, tests/arayuz-kalite.test.js (yalnız yeni yapıya uyum için, mevcut iddialar gevşetilmeden)
- README.md: Yapı bölümü yalnız yeni dosya eklenirse güncellenir
- Dokunulmaz: src/ornek.js ve veri biçimi, ürün/hareket alanları, localStorage anahtarı ve yapısı, stok hesabı (hareketEkle, urunEkle, urunGuncelle, urunSil), CSV biçimi ve dosya adı, kritik eşiği tanımı, package.json, sunucu/kimlik doğrulama/grafik/yeni alan (kapsam dışı)

### RTE — riskler ve bağımlılıklar
**Ekip başlayabilir mi:** evet

**Riskler**
- Görevdeki 'kritik seviyenin altında' ifadesi koddaki kritikMi (stok <= minStok) kuralıyla uyuşmuyor. Mimar mevcut kuralın korunmasını istiyor, ama bu netleşmezse Kritik stok modülü ile rozet sayısı yanlış beklenebilir.
- app.js 454 satır ve tek sayfalık yapıda. Ürünler modülünü taşırken mevcut işlevler, getElementById kimlikleri ve textContent kuralı bozulabilir. index.html'deki başlık, landmark ve 600px medya sorgusuna bağlı mevcut testler de kırılabilir.
- Kapsam geniş: kenar çubuğu, hash gezinmesi, 5 modül, rozet ve duyarlı menü bir arada. Tek seferde teslim edilirse sınırda durma ihtimali artar. Tarayıcıya özgü davranışlar (geri düğmesi, menünün kendiliğinden kapanması, klavye gezinmesi) birim testle zor ölçülür.

**Bağımlılıklar**
- src/stok.js (kritikMi, kritikStoklar, hareketEkle, TURLER), src/app.js, src/ornek.js ve localStorage yapısı ({urunler, hareketler}) aynen korunur.
- index.html, tests/stok.test.js, tests/sayfa.test.js ve tests/arayuz-kalite.test.js. Yeni yapıya uyum için yalnız ek yapılabilir, mevcut iddialar gevşetilmez.
- docs/gorevler/ altındaki önceki görev belgeleri (gorev-1.md, tur-5.md) ve README Yapı bölümü. Yeni src dosyası açılırsa README güncellenir.

**Öneriler**
- Önce 'altında' ile '<=' uyuşmazlığını PM/mimarla kapat. Kayıt olarak mevcut kuralın korunduğunu yaz.
- İki dilimde ilerle. Dilim 1: saf fonksiyonlar ve testleri, kenar çubuğu, hash gezinmesi, Özet, Ürünler ve rozet. Dilim 2: Stok hareketleri, Kritik stok ve Ayarlar.
- Saf fonksiyonları (modül çözümleme, özet, rozet, hareket süzgeci) önce testleriyle yaz. Sonra arayüzü bağla ve mevcut testleri her adımda çalıştır.

## Kabul kriterleri
- [ ] Yorum kaydı: 'kritik seviyenin altında' ifadesi mevcut kritikMi kuralı (stok <= minStok) olarak yorumlanır, yeni eşik yazılmaz. Rozet, Özet kritik sayısı ve Kritik stok modülü kritikMi/kritikStoklar'dan beslenir. kritikSayisi(urunler) stok===minStok olan ürünü de sayar, stok>minStok olanı saymaz; girdi dizisi değişmez.
- [ ] modulCozumle(hash) saf fonksiyonu, tek bir hash→modül tablosundan okuyarak '#/ozet','#/urunler','#/hareketler','#/kritik','#/ayarlar' için ilgili modül anahtarını döndürür; '', '#', '#/', '#/bilinmeyen', undefined ve null için 'ozet' döndürür.
- [ ] ozetHesapla(urunler, hareketler) {urunSayisi, toplamStok, kritikSayisi, sonHareketler} döndürür: urunSayisi ürün adedi, toplamStok stok değerlerinin toplamı, kritikSayisi kritikStoklar uzunluğu; sonHareketler en yeni 5 hareket, en yeni üstte (tarih eşitse id büyük olan üstte). Boş veride 0, 0, 0 ve []; girdiler değişmez, Date/DOM/localStorage kullanılmaz.
- [ ] hareketleriSuz(urunler, hareketler, {urunId, tur}) bütün hareketleri en yeni üstte döndürür; urunId verilirse yalnız o ürünün, tur verilirse (giris, cikis, duzeltme üçü de) yalnız o türün hareketlerini; ikisi birlikte verilirse ikisini birden sağlayanları; boş/tanımsız süzgeç hepsini döndürür. Her satır orijinal hareket alanlarını ve urunAd alanını taşır; ürünü bulunamayan hareket için urunAd boş olmaz (yedek metin). Girdi değişmez.
- [ ] Kenar çubuğu <nav aria-label=...> içinde, üstte uygulama adı, altında gerçek <a href='#/...'> bağlantılarıyla Özet, Ürünler, Stok hareketleri, Kritik stok, Ayarlar sırasıyla bulunur; seçili bağlantıda aria-current='page' ve renk dışı işaret (kalın yazı/çizgi) vardır, diğerlerinde aria-current yoktur. Kritik stok bağlantısındaki rozet kritikSayisi>0 iken sayıyı gösterir ve bağlantının erişilebilir adında sayı geçer; sayı 0 iken rozet gizlidir. Rozet giriş, çıkış, düzenleme, örnek veri ve tümünü silme sonrası güncellenir.
- [ ] Gezinme yalnız location.hash ve hashchange ile yapılır: açılışta (boş hash) Özet açılır, sayfa yenilenince hash'teki modül açılır, geri düğmesi önceki modüle döner, tanınmayan hash Özet'i açar; hash ve menü durumu localStorage'a yazılmaz. Menü düğmesi gerçek <button>, erişilebilir adlı ve aria-expanded/aria-controls taşır; 600px altında kenar çubuğu kapalı gelir, düğmeyle açılıp kapanır (aria-expanded güncellenir), modül seçilince kapanır; geniş ekranda sabit kalır.
- [ ] Ürünler modülü mevcut ürün listesini ve işlevlerini (arama, kategori ve kritik süzgeçleri, 'Yeni ürün', giriş, çıkış, düzenle, geçmiş, 'CSV indir', 'Örnek verilerle başla') davranış ve metin değişmeden taşır. Stok hareketleri modülü ürün ve tür süzgeciyle hareketleriSuz sonucunu ürün adıyla listeler; Kritik stok modülü yalnız kritikStoklar ürünlerini listeler ve her satırdan giriş mevcut hareketEkle ile yapılır (stok ve rozet güncellenir); Ayarlar'da örnek veri yükleme ve onay istedikten sonra bütün veriyi silme vardır, onay reddedilirse veri silinmez.
- [ ] Mevcut testler (stok, sayfa, arayuz-kalite) gevşetilmeden geçer: <title> ve <h1> 'Stok takip', header/main landmark'ları, tablo ve sütun başlıkları, 600px max-width medya sorgusu, var(--...) belirteçleri durur; app.js'deki her getElementById kimliği index.html'de tanımlıdır; innerHTML/outerHTML/insertAdjacentHTML kullanılmaz; localStorage anahtarı ve {urunler, hareketler} biçimi ile mevcut kayıtlı veri değişmeden yüklenir; package.json'a bağımlılık eklenmez. `node --test tests/*.test.js` hatasız biter.

## Plan
1. Önce depoyu temel al: src/stok.js, src/app.js (454 satır), index.html ve üç test dosyasını oku; mevcut kimlikleri, metinleri ve testlerin bağlı olduğu yapıyı not et. 'altında' ile '<=' kararını kayıt olarak yaz (mevcut kural korunur).
2. src/stok.js'e saf fonksiyonları ekle (ayrı dosya açma, README değişmesin): MODULLER tablosu ve modulCozumle(hash), kritikSayisi(urunler) (kritikStoklar(urunler).length), ozetHesapla(urunler, hareketler), hareketleriSuz(urunler, hareketler, {urunId, tur}). Girdiyi değiştirme (sıralamadan önce kopya al); Date/DOM/localStorage kullanma. Mevcut kritikMi, kritikStoklar, hareketEkle, urunEkle, urunGuncelle, urunSil, veriGecerliMi ve ornek.js'e dokunma.
3. tests/stok.test.js'e yeni fonksiyonlar için testler ekle: modulCozumle (bilinen yollar, boş/bilinmeyen/null), kritikSayisi (eşit sınır dahil), ozetHesapla (boş veri, 5'ten fazla hareket, tarih eşitliği, girdi değişmezliği), hareketleriSuz (ürün, tür, ikisi birlikte, düzeltme, silinmiş ürün, sıralama, girdi değişmezliği). Testleri yeşile getir.
4. Dilim 1 – index.html: header/main yapısını koruyarak solda sabit <nav aria-label> kenar çubuğu (uygulama adı, 5 <a href='#/...'> bağlantı, Kritik stok için rozet span'ı), aria-expanded/aria-controls'lu menü <button>'u ve 5 modül <section>'ı ekle. Mevcut ürün arayüzünü Ürünler bölümüne taşı (kimlikleri koru). CSS: renkler :root belirteçlerinden; seçili bağlantı için kalın yazı + sol çizgi (aria-current='page' seçicisi); mevcut 600px medya sorgusunda kenar çubuğu varsayılan kapalı, açık sınıfıyla görünür.
5. Dilim 1 – src/app.js: hashchange ve açılışta modulCozumle(location.hash) ile ilgili section'ı göster, diğerlerini gizle, aria-current'ı güncelle, dar ekranda menüyü kapat; menü düğmesi aria-expanded'ı değiştirir. Özet'i ozetHesapla ile textContent kullanarak çiz. Rozeti kritikSayisi ile hesaplayan tek bir fonksiyon yaz, bağlantının aria-label'ına sayıyı koy (0 ise rozeti hidden yap) ve her kaydetme/yeniden çizim sonrasında çağır. Ürünler işlevleri aynen çalışsın. Her adımdan sonra node --test tests/*.test.js çalıştır.
6. Dilim 2 – Stok hareketleri: ürün ve tür seçicileri (tür seçenekleri TURLER ve turEtiketi'nden, düzeltme dahil) ekle; liste hareketleriSuz çıktısıyla tablo olarak çizilir (tarih tarihBicimle, ürün adı, tür, miktar, açıklama; hepsi textContent). Kritik stok: kritikStoklar listesi, her satırda miktar alanı ve 'Giriş' düğmesi; mevcut hareketEkle akışını/yardımcısını çağır, stoğu kaydet, rozeti ve görünümü yenile. Ayarlar: örnek veri yükle (mevcut ornek.js akışı) ve confirm() ile onaylı tümünü sil; ikisi de sonrası rozet ve görünümü yenile.
7. Son kontrol: node --test tests/*.test.js geçer; tests/sayfa.test.js ve arayuz-kalite.test.js yalnız yeni yapı için ek iddia alır (nav aria-label, menü düğmesi, aria-current, modül bölümleri), mevcut iddialar gevşemez. app.js'teki tüm getElementById kimliklerinin index.html'de olduğunu, innerHTML kullanılmadığını ve python3 -m http.server 8080 ile elle gezinmenin (hash, geri, yenileme, 600px altı menü) çalıştığını doğrula. Bağımlılık, README Yapı bölümü ve dokunulmaz alanlar değişmez.

## Tasarım

**Dosyalar**
- index.html — <header> ve <h1>Stok takip</h1> kalır (uygulama adı). Header'a menü düğmesi eklenir: <button type=button id=menu-dugme aria-label="Menüyü aç/kapat" aria-expanded=false aria-controls=kenar-cubugu>. Yeni <nav id=kenar-cubugu aria-label="Ana menü"> içinde 5 <a href="#/ozet|#/urunler|#/hareketler|#/kritik|#/ayarlar" data-modul="..."> bağlantısı; Kritik stok bağlantısında <span id=kritik-rozet class=rozet hidden>. <main> içinde 5 <section id=modul-ozet|modul-urunler|modul-hareketler|modul-kritik|modul-ayarlar hidden>. Mevcut kartlar, arama aracı ve tablo (id'leri aynen) modul-urunler/m
- index.html — Yeni id'ler: ozet-stok-adedi, ozet-son-hareketler (liste), hareket-urun (select), hareket-tur (select), hareket-govde (tbody, Ürün/Tür/Miktar/Açıklama/Tarih başlıklı tablo), hareket-bos, kritik-govde, kritik-bos, ayar-ornek, ayar-sil. Mevcut kartlardaki 'Toplam ürün', 'Toplam stok değeri', 'Kritik', 'Bugünkü hareket' metinleri silinmez (testler arıyor); 'Toplam stok adedi' kartı eklenir.
- src/stok.js — Yeni saf fonksiyonlar ve sabit (aşağıdaki imzalarla); mevcut fonksiyonlara dokunulmaz.
- src/app.js — Yalnız stok.js'i çağıran arayüz: hashchange + ilk yükleme ile modulCozumle(location.hash), bölümlerin hidden/aria-current güncellemesi, menü aç/kapa, rozet/Özet/Hareketler/Kritik çizimi, Ayarlar düğmeleri. Mevcut ciz() içine modül çizimi çağrısı eklenir; kaydet/yukle/ürün işlevleri aynen. Mantık gömülmez, innerHTML yok.
- tests/stok.test.js — Yeni fonksiyonların testleri (girdiyi değiştirmeme, sınırlar dahil). tests/sayfa.test.js ve tests/arayuz-kalite.test.js — yalnız ek iddia: nav aria-label, 5 href, menü düğmesi aria-expanded/aria-controls, aria-current CSS, hidden rozet; mevcut iddialar gevşetilmez.
- README.md — Yeni src dosyası açılmadığı için değişmez.

**Kararlar**
- stok.js imzaları: export const MODULLER = [{ yol: '/ozet', ad: 'Özet' }, { yol: '/urunler', ad: 'Ürünler' }, { yol: '/hareketler', ad: 'Stok hareketleri' }, { yol: '/kritik', ad: 'Kritik stok' }, { yol: '/ayarlar', ad: 'Ayarlar' }] — tek hash tablosu; sıra kenar çubuğu sırasıdır, ilk eleman varsayılan.
- modulCozumle(hash: string|undefined|null): string — '#/urunler' gibi hash'i alır, MODULLER'de varsa yolu başındaki '#' atılmış biçimde döndürür ('/urunler' → modül anahtarı 'urunler'); boş, tanınmayan, string olmayan, sonda eğik çizgi/sorgu gibi sapmalarda 'ozet' döner. Dönen değer her zaman 'ozet'|'urunler'|'hareketler'|'kritik'|'ayarlar'. Bu yüzden MODULLER girdisini { anahtar: 'ozet', yol: '#/ozet', ad: 'Özet' } biçiminde tut (anahtar, yol, ad); HTML href'leri yol ile birebir aynı olur.
- ozetHesapla(urunler, hareketler): { urunSayisi: number, stokAdedi: number, kritikSayisi: number, sonHareketler: Hareket[] } — urunSayisi=urunler.length; stokAdedi=stok toplamı (sayısal olmayan 0 sayılır); kritikSayisi=kritikStoklar(urunler).length (yeni eşik yazılmaz, <= kuralı korunur; 'altında' ifadesi kayıt olarak mevcut kuralla çözülmüş sayılır); sonHareketler=en yeni 5 hareket (tarih azalan, eşitse id azalan), kopya liste, girdi sıralanmaz/değişmez (.slice() ile kopyala). Date kullanılmaz. Mevcut 'Bugünkü hareket' ve 'Toplam stok değeri' kartları app.js'te eskisi gibi kalır.
- kritikRozetSayisi(urunler): number — kritikStoklar(urunler).length; yalnız bu çağrı rozet ve Özet sayısı kaynağıdır. Rozet metni ve erişilebilir ad app.js'te: sayı>0 ise rozet hidden=false, textContent=String(sayi), bağlantıya aria-label=`Kritik stok, ${sayi} kritik ürün`; sayı 0 ise rozet hidden=true ve aria-label kaldırılır (görünen ad 'Kritik stok'). Diğer bağlantılar görünen metinle adlandırılır (aria-label gerekmez).
- hareketleriSuz(hareketler, { urunId = '', tur = '' } = {}): Hareket[] — urunId boş ('' / undefined / null) ise tüm ürünler, doluysa h.urunId === urunId (select değeri string olduğundan karşılaştırma String(h.urunId) === String(urunId) ile yapılır); tur boşsa hepsi, doluysa h.tur === tur ('giris'|'cikis'|'duzeltme', TURLER'den). Sonuç en yeni üstte: tarih azalan, eşitse id azalan; yeni dizi döner, girdi değişmez. Sayfalama/arama/tarih aralığı yok.
- Ürün adı için saf yardımcı: urunAdiBul(urunler, urunId): string — bulunursa u.ad, silinmiş ürün için '(silinmiş ürün)'. Hareket satırı ve Özet son hareketleri bunu kullanır; tür etiketi mevcut turEtiketi, tarih tarihBicimle, miktar düz sayı.
- Kritik stok modülü: liste kritikStoklar(urunler) (kritikMi tek tanım); satırda ad, stok, minStok, birim ve 'Stok girişi' düğmesi; düğme mevcut hareketPenceresi(id, 'giris') çağırır (hareketEkle akışı, yeni stok mantığı yazılmaz). Boşsa 'Kritik stokta ürün yok' mesajı (kritik-bos). Satırlar textContent ile yazılır.
- Ayarlar: 'Örnek verileri yükle' (ayar-ornek) mevcut ornek-veri işleyicisiyle aynı gövdeyi paylaşan küçük bir app.js fonksiyonuna (ornekYukle) çıkarılır, iki düğme de onu çağırır; 'Tüm veriyi sil' (ayar-sil) window.confirm ile onay ister, onaylanırsa urunler=[]; hareketler=[]; kaydet(); ciz(); bildirimGoster('Tüm veri silindi.'). Onaylanmazsa hiçbir şey değişmez. Örnek yüklemenin mevcut verinin üstüne yazması için de aynı confirm kullanılmaz (mevcut davranış korunur).

## Arayüz tasarımı

**Ekran davranışı**
- GENEL DÜZEN (geniş ekran, >600px): Solda sabit (position: fixed ya da sticky, tam yükseklik) dikey <nav id="kenar-cubugu" aria-label="Ana menü">. Sağdaki içerik (header + main) kenar çubuğu genişliği kadar soldan boşluk bırakır. Renkler yalnız :root belirteçlerinden (var(--renk-yuzey), var(--renk-kenar), var(--renk-birincil-acik) vb.); yeni renk değeri, yazı tipi, simge paketi yok.
- KENAR ÇUBUĞU İÇERİĞİ: En üstte uygulama adı 'Stok takip' (metin olarak, kalın). Altında alt alta 5 gerçek <a> bağlantısı, bu sırayla: 'Özet' (#/ozet), 'Ürünler' (#/urunler), 'Stok hareketleri' (#/hareketler), 'Kritik stok' (#/kritik), 'Ayarlar' (#/ayarlar). Her bağlantı tam genişlik, en az 2.5rem yüksekliğinde, soluk zeminde metin rengi var(--renk-metin); üzerine gelince var(--renk-zemin). Not: sayfada <h1>Stok takip</h1> korunur; kenar çubuğundaki ad ikinci bir h1 olmasın (düz metin/div).
- SEÇİLİ MODÜL: Seçili bağlantıda aria-current="page" bulunur, diğerlerinde bu öznitelik hiç yoktur. Görsel işaret renkten bağımsız: kalın yazı (font-weight: 700) + solda 4px dolu çizgi (border-left, var(--renk-birincil)) ve açık mavi zemin. Diğer bağlantılarda aynı çizgi şeffaf olur ki metin kaymasın. CSS seçicisi a[aria-current="page"] olsun.
- ROZET: 'Kritik stok' bağlantısının sağında, metnin yanında kırmızı yuvarlak rozet (mevcut .rozet sınıfı: var(--renk-tehlike) zemin, beyaz yazı) kritik ürün sayısını gösterir, örn. '3'. Sayı 0 ise rozet hidden olur (ekranda ve erişilebilirlik ağacında yok). Sayı>0 iken bağlantının aria-label'ı 'Kritik stok, 3 kritik ürün' olur; 0 iken aria-label kaldırılır. Sayı kritikStoklar (stok <= minStok) tanımından gelir; 'altında' ifadesi bu kurala göre yorumlanır (kayıt notu). Rozet her giriş, çıkış, ürün düzenleme/ekleme, örnek veri yükleme ve tüm veriyi silme sonrası, ciz() içinde yeniden hesaplanır; 
- HEADER VE MENÜ DÜĞMESİ: Mevcut header ve <h1>Stok takip</h1> yerinde kalır. Geniş ekranda menü düğmesi gizlidir. Header'daki 'Yeni ürün' ve 'CSV indir' düğmeleri metin ve davranış olarak değişmeden Ürünler modülüyle ilgili kalır; mevcut test ve kimlikler (yeni-urun, csv-indir) korunur. Öneri: bu iki düğme yalnız #/urunler modülünde görünsün (diğer modüllerde hidden), böylece 'Ürünler modülünün işlevi' olarak taşınmış olur; ya da header'da kalıp her modülde çalışsın. Tercih: Ürünler modülünde görünür, diğerlerinde gizli (hidden), çünkü görev bunları Ürünler işlevi sayıyor.
- DAR EKRAN (<=600px, mevcut max-width: 600px medya sorgusu içinde): Kenar çubuğu varsayılan kapalıdır (ekran dışı/gizli, içerik tam genişlik). Header'da solda gerçek <button type="button" id="menu-dugme"> görünür: görünen metin 'Menü', aria-label 'Menüyü aç/kapat', aria-expanded 'false', aria-controls 'kenar-cubugu'. Tıklayınca kenar çubuğu içeriğin üstüne kayarak açılır (sabit konum, soldan, tam yükseklik, z-index yüksek, var(--golge-orta) gölge) ve aria-expanded 'true' olur; tekrar tıklayınca kapanır ve 'false' olur. Açık durum bir sınıfla (örn. .acik) yönetilir, localStorage'a yazılmaz. Bir 
- GEZİNME: Yalnız location.hash ve hashchange. Açılışta hash boşsa Özet açılır (adres çubuğuna zorla yazmak şart değil). Sayfa yenilenince hash'teki modül açılır. Geri düğmesi önceki modüle döner (bağlantılar normal href olduğundan geçmişe kayıt düşer; replace kullanma). '#/bilinmeyen', '#', '#/' ve benzeri tanınmayan hash'te Özet açılır ve kenar çubuğunda Özet seçili görünür. Aynı anda yalnız bir modül <section> görünür, diğerleri hidden. Modül değişince sayfa en üste kaydırılır ve ilgili modülün başlığı (h2, tabindex=-1) odak alır ki ekran okuyucu yeni içeriği duyursun. Hash ve menü durumu loc
- MODÜL BAŞLIKLARI: Her modül section'ının en üstünde bir h2 başlık vardır: 'Özet', 'Ürünler', 'Stok hareketleri', 'Kritik stok', 'Ayarlar' (kenar çubuğu metinleriyle aynı). Not: mevcut kartlardaki h2'ler (Toplam ürün vb.) kart içinde kalır.

**Durumlar**
- BOŞ VERİ (ürün ve hareket yok): Özet'te Toplam ürün 0, Toplam stok adedi 0, Kritik 0 (vurgu yok), 'Son stok hareketleri' altında liste yerine 'Henüz stok hareketi yok.' metni. Ürünler'de mevcut boş durum ('Henüz ürün yok' + 'Örnek verilerle başla'). Stok hareketleri'nde tablo yerine id=hareket-bos içinde 'Henüz stok hareketi yok.'; süzgeç seçicileri açık kalır ('Tüm ürünler' tek seçenek). Kritik stok'ta 'Kritik stokta ürün yok' (id=kritik-bos), tablo gizli. Rozet gizli.
- SÜZGEÇ SONUCU BOŞ (Stok hareketleri): Veri var ama seçilen ürün/tür birleşimine uyan hareket yok ise tablo gizlenir ve hareket-bos içinde 'Seçilen süzgeçe uygun hareket yok. Süzgeçleri değiştirmeyi deneyin.' yazar. Süzgeçler değişince bu metin güncellenir. Ürün seçicide seçili ürün silinip kaybolursa seçim 'Tüm ürünler'e döner.
- KRİTİK SINIRI: stok === minStok olan ürün de kritiktir (<= kuralı) ve Kritik stok listesinde, rozet sayısında ve Özet'te sayılır; stok > minStok olan sayılmaz. Bu karar kayıt olarak PM/mimarla teyit edilecek; yeni eşik yazılmaz.
- UZUN METİN: Çok uzun ürün adı veya açıklama kenar çubuğunu/tabloyu taşırmaz: hücrede satır kaydırılır (overflow-wrap: anywhere). Kenar çubuğunda bağlantı metni sabit olduğundan uzun içerik yok; rozet 3 haneli sayıda ('120') bile bağlantı içinde taşmadan sığar. Özet son hareket satırında uzun ürün adı alt satıra kayar.
- SİLİNMİŞ ÜRÜNÜN HAREKETİ: Hareket satırında ürün adı yerine '(silinmiş ürün)' yazılır; satır listeden düşmez. Ürün süzgeci yalnız mevcut ürünleri sunar.
- DÜZELTME HAREKETİ: Veride varsa listelenir, tür süzgecinde 'Düzeltme' seçilebilir, satırda 'Düzeltme' metniyle yazılır. Yeni düzeltme oluşturma arayüzü eklenmez.
- BİLİNMEYEN HASH: '#/xyz', '#', '' → Özet açılır, kenar çubuğunda Özet seçili (aria-current) olur. Hata ya da boş ekran gösterilmez.
- BOZUK / ERİŞİLEMEYEN KAYIT: Mevcut davranış aynen: #uyari kutusu ilgili mesajla (role=alert) görünür ve uygulama boş veriyle açılır; kutu hangi modülde olunursa olunsun üstte görünür. Kayıt yazılamazsa 'Veriler tarayıcıya kaydedilemedi.' uyarısı korunur.

**Erişilebilirlik**
- LANDMARK'LAR: Sayfada <header> ve <main> korunur. Kenar çubuğu <nav id="kenar-cubugu" aria-label="Ana menü">. Modül bölümleri <section aria-labelledby=...> ile başlıklarına bağlanır. Tek <h1> 'Stok takip'; <title> 'Stok takip' kalır.
- KLAVYE: Tab sırası: menü düğmesi (dar ekran) → nav bağlantıları (Özet, Ürünler, Stok hareketleri, Kritik stok, Ayarlar) → header düğmeleri → modül içeriği. Bağlantılar gerçek <a href> olduğu için Enter ile etkinleşir; ek klavye betiği gerekmez. Menü düğmesi Enter ve Boşluk ile çalışır (gerçek button). Dar ekranda menü kapalıyken bağlantılar tab sırasına girmez; açılınca ilk bağlantı Tab ile ulaşılır. Esc menüyü kapatır ve odağı menü düğmesine döndürür. Odak göstergesi: mevcut 3px var(--renk-birincil) outline kuralı bağlantılara da uygulanır (a:focus-visible).
- ERİŞİLEBİLİR ADLAR: Menü düğmesi aria-label 'Menüyü aç/kapat', aria-expanded true/false güncel tutulur, aria-controls='kenar-cubugu'. Bağlantılar görünen metinleriyle adlanır; yalnız Kritik stok bağlantısı sayı>0 iken aria-label 'Kritik stok, N kritik ürün' taşır (rozet metni aria-hidden yapılabilir ki çift okunmasın). Seçili bağlantıda aria-current='page'. Satır düğmeleri '<Ürün adı>: Stok girişi' biçiminde adlanır (mevcut kalıp).
- RENKTEN BAĞIMSIZLIK: Seçili modül = kalın yazı + sol çizgi + aria-current; kritik durum = 'Kritik' yazılı rozet + sayı (yalnız kırmızı zemin değil); hareket türü = Giriş/Çıkış/Düzeltme metni; hata = metin. Rozet sayısı rakamla verilir.
- FORM ETİKETLERİ: Hareket süzgecindeki iki select ('Ürün', 'Hareket türü') ve tüm yeni düğmeler görünür ya da aria-label'lı etiket taşır. Tablolarda th scope='col'. Tablo başlıkları, dar ekranda gizlense bile hücrelerde data-label ile etiket sağlanır (mevcut kalıp).
- DUYURU: Modül değişince ilgili modülün h2'sine odak verilir (tabindex=-1, odak çerçevesi görünür) ve sayfa başa kaydırılır. İşlem bildirimleri mevcut #bildirim (role=status, aria-live=polite) ile duyurulur: 'Stok girişi kaydedildi.', 'Örnek veriler yüklendi.', 'Tüm veri silindi.'. Rozet değişimi ayrıca duyurulmaz (gürültü olmasın).
- HAREKET AZALTMA VE KONTRAST: Menü açılıp kapanma geçişi varsa mevcut prefers-reduced-motion kuralı altında kapanır (animasyon yok). Metin/zemin kontrastı mevcut belirteçlerle sağlanır (seçili bağlantıda var(--renk-birincil-koyu) metin, var(--renk-birincil-acik) zemin); yeni renk eklenmez.
- DOKUNMA HEDEFİ: 600px altında menü düğmesi, nav bağlantıları, süzgeç select'leri ve 'Stok girişi' düğmeleri en az 44px yüksekliktedir (mevcut .dugme/select kuralı).
