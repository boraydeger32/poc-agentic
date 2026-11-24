# Görev tur-5: Stok takip uygulaması

Mevcut görev listesi uygulamasını, küçük bir işletmenin kullanacağı bir stok takip uygulamasına dönüştür. Uygulama derleme aracı ve dış paket olmadan, yalnız HTML, CSS ve sade JavaScript ile çalışsın; veriler tarayıcının localStorage alanında saklansın.

## Kabul kriterleri

### Veri ve iş mantığı (src/ altında saf fonksiyonlar, testle ölçülür)

1. Ürün: `id`, `ad`, `sku` (benzersiz stok kodu), `kategori`, `birim` (adet, kg, lt, kutu), `stok` (sayı), `minStok` (sayı), `alisFiyati`, `satisFiyati`.
2. Stok hareketi: `id`, `urunId`, `tur` ("giris", "cikis", "duzeltme"), `miktar`, `aciklama`, `tarih` (zaman damgası).
3. `src/stok.js` şu fonksiyonları sunsun; hiçbiri girdi verisini değiştirmesin:
   * `urunEkle(urunler, alanlar)`: ad ya da SKU boşsa, SKU başka bir üründe varsa ya da fiyat/stok negatifse hata nesnesi döndürür (`{ hata: "..." }`); başarılıysa yeni listeyi döndürür.
   * `urunGuncelle(urunler, id, degisiklikler)` ve `urunSil(urunler, hareketler, id)`: hareketi olan ürün silinemez, hata döner.
   * `hareketEkle(urunler, hareketler, hareket)`: girişte stoğu artırır, çıkışta azaltır, düzeltmede stoğu verilen değere eşitler. Çıkış mevcut stoktan büyükse hata döner, stok asla negatife düşmez. Yeni ürün ve hareket listelerini birlikte döndürür.
   * `kritikStoklar(urunler)`: stoğu minStok değerine eşit ya da altında olan ürünler.
   * `stokDegeri(urunler)`: toplam stok değeri (stok × alış fiyatı) ve toplam potansiyel satış değeri.
   * `urunleriSuz(urunler, { arama, kategori, sadeceKritik })`: arama ad ve SKU'da, büyük/küçük harf duyarsız.
   * `hareketGecmisi(hareketler, urunId, { baslangic, bitis })`: tarih aralığına göre, yeniden eskiye.
   * `csvOlustur(urunler)`: başlık satırı olan, virgül ve tırnak içeren değerleri doğru kaçıran CSV metni.

### Arayüz

 4. Üstte dört özet kartı: toplam ürün sayısı, toplam stok değeri (TL biçiminde, örn. "12.450,00 ₺"), kritik stoktaki ürün sayısı, bugünkü hareket sayısı.
 5. Ürün tablosu: ad, SKU, kategori, stok (birimiyle), min. stok, alış ve satış fiyatı. Sütun başlığına tıklayınca o sütuna göre sıralansın, ikinci tıklamada ters sıralansın. Kritik stoktaki satırlar kırmızımsı arka planla ve "Kritik" rozetiyle gösterilsin.
 6. Tablonun üstünde arama kutusu, kategori seçici ve "Yalnız kritik stok" onay kutusu; filtreler anında uygulansın.
 7. "Yeni ürün" düğmesi bir pencere (modal) açsın. Geçersiz alanların altında Türkçe hata mesajı görünsün, kaydetme engellensin.
 8. Her satırda "Giriş", "Çıkış", "Düzenle", "Geçmiş" düğmeleri olsun. Giriş/Çıkış miktar ve açıklama soran küçük bir pencere açsın; stok yetmiyorsa uyarı versin.
 9. "Geçmiş" o ürünün hareketlerini tarih, tür, miktar, açıklama ve hareket sonrası stokla listeleyen bir pencere açsın.
10. "CSV indir" düğmesi ürün listesini `stok-AAAA-GG-AA.csv` adıyla indirsin.
11. Veriler localStorage'da saklansın; sayfa yenilenince geri gelsin. Kayıtlı veri bozuksa uygulama çökmesin, boş başlasın ve bir uyarı göstersin.
12. İlk açılışta veri yoksa "Örnek verilerle başla" düğmesi 8 örnek ürün ve birkaç hareket yüklesin.
13. Telefon genişliğinde (600 piksel altı) tablo yerine kart görünümüne geçilsin.
14. Kullanıcıdan gelen bütün metinler sayfaya `textContent` ile yazılsın; `innerHTML` ile kullanıcı metni basılmasın.

## Kapsam dışı

Kullanıcı girişi, sunucu veya veritabanı, barkod okuyucu, fatura.

## Kabul kriterleri
- [ ] YORUM: Uygulama görev listesinin yerini alır. index.html başlığı ve h1 "Stok takip" olur; src/gorevler.js, src/app.js'deki görev kodu ve eski görev testleri kaldırılır, sayfa testleri yeni sayfaya göre güncellenir. Hareketin "hareket sonrası stok" değeri hareket nesnesine yazılmaz; hareketGecmisi çıktısındaki her kayıt, tüm hareketler tarih sırasıyla yürütülerek hesaplanan sonrasiStok alanını taşır (tarih filtresi bu değeri değiştirmez). Düzeltme hareketinde miktar, yeni stok değeridir. Kullanıcı girişi, sunucu, veritabanı, barkod, fatura kapsam dışıdır.
- [ ] Ürün (id, ad, sku, kategori, birim [adet|kg|lt|kutu], stok, minStok, alisFiyati, satisFiyati) ve stok hareketi (id, urunId, tur [giris|cikis|duzeltme], miktar, aciklama, tarih zaman damgası) biçimleri kullanılır. src/stok.js'deki hiçbir fonksiyon girdi listelerini ya da nesnelerini değiştirmez (testte donmuş girdiyle doğrulanır).
- [ ] urunEkle: ad ya da SKU boşsa (boşluk dahil), SKU başka üründe varsa ya da fiyat/stok negatifse { hata: "..." } döner; başarılıysa yeni id'li ürünün eklendiği yeni liste döner. urunGuncelle(urunler, id, degisiklikler) değişikliği uygular, aynı doğrulamaları (SKU kendi dışındaki ürünlerde benzersiz) yapar. urunSil(urunler, hareketler, id): hareketi olan üründe { hata } döner, hareketi olmayanı siler.
- [ ] hareketEkle: giriş stoğu artırır, çıkış azaltır, düzeltme stoğu verilen değere eşitler. Çıkış miktarı mevcut stoktan büyükse { hata } döner ve stok negatife düşmez. Başarıda yeni ürün ve hareket listeleri birlikte döner (hareket id ve tarih alır).
- [ ] kritikStoklar: stok <= minStok olan ürünleri döndürür (eşitlik dahil). stokDegeri: toplam stok×alisFiyati ve toplam stok×satisFiyati değerlerini döndürür; boş listede 0 döner.
- [ ] urunleriSuz: arama ad ve SKU'da büyük/küçük harf duyarsız çalışır; kategori filtresi ve sadeceKritik birlikte (VE ile) uygulanır; boş filtre tüm listeyi döndürür. hareketGecmisi: yalnız verilen urunId'nin hareketlerini, baslangic/bitis aralığında (uçlar dahil, verilmeyen uç sınırsız) yeniden eskiye sıralı döndürür.
- [ ] csvOlustur: ilk satır başlıktır, her ürün bir satırdır; virgül, çift tırnak veya satır sonu içeren değer çift tırnağa alınır ve içindeki tırnaklar ikiye katlanır.
- [ ] Arayüz özeti: üstte dört kart gösterilir: toplam ürün sayısı, toplam stok değeri (TL biçimi, örn. "12.450,00 ₺"), kritik ürün sayısı, bugünkü hareket sayısı. Ürün tablosu ad, SKU, kategori, stok (birimiyle), min. stok, alış ve satış fiyatı sütunlarını gösterir; başlığa tıklama o sütuna göre artan, ikinci tıklama azalan sıralar; kritik satırlar kırmızımsı arka planla ve "Kritik" rozetiyle görünür.
- [ ] Arama kutusu, kategori seçici ve "Yalnız kritik stok" onay kutusu değişince tablo anında süzülür. "Yeni ürün" düğmesi modal açar; geçersiz alanın altında Türkçe hata mesajı görünür ve kayıt yapılmaz.
- [ ] Her satırda "Giriş", "Çıkış", "Düzenle", "Geçmiş" düğmeleri bulunur. Giriş/Çıkış miktar ve açıklama soran pencere açar; stok yetmiyorsa uyarı gösterilir ve stok değişmez. "Geçmiş" penceresi tarih, tür, miktar, açıklama ve hareket sonrası stoku listeler.
- [ ] "CSV indir" düğmesi ürün listesini `stok-AAAA-GG-AA.csv` adıyla (bugünün tarihi) indirir. Veriler localStorage'da saklanır ve sayfa yenilenince geri gelir; kayıtlı veri bozuksa (geçersiz JSON ya da beklenmeyen biçim) uygulama çökmez, boş başlar ve uyarı gösterir.
- [ ] Veri yokken "Örnek verilerle başla" düğmesi 8 örnek ürün ve birkaç hareket yükler (örnek veri src/ altında saf veri/fonksiyon olarak durur, hareketleri ürün stoklarıyla tutarlıdır). 600 px altında tablo yerine kart görünümü gösterilir (index.html'de @media (max-width: 600px) kuralı).
- [ ] Kullanıcıdan gelen bütün metinler textContent ile yazılır; src/app.js içinde innerHTML (ve insertAdjacentHTML, outerHTML) kullanılmaz (testte kaynak taranır). Dış paket/derleme yoktur; `node --test tests/*.test.js` hatasız geçer.

## Plan
1. Önce `node --test tests/*.test.js` çalıştır. tests/gorevler.test.js ve tests/sayfa.test.js eski görev listesine bağlı; bunları yeni yapıya göre değiştireceksin.
2. src/stok.js oluştur (saf fonksiyonlar, girdiyi değiştirmez, hatalar `{ hata }`): urunEkle, urunGuncelle, urunSil, hareketEkle, kritikStoklar, stokDegeri, urunleriSuz, hareketGecmisi (sonrasiStok hesaplı), csvOlustur. Ortak doğrulama için dosya içinde küçük bir yardımcı kullan. Aynı dosyada ya da src/ornek.js içinde 8 örnek ürün ve tutarlı birkaç hareket üreten saf veri ekle. Sayı ve para biçimlendirme ("12.450,00 ₺") ile CSV dosya adı üretimi de saf fonksiyon olarak src/stok.js'e konur.
3. tests/stok.test.js yaz: her fonksiyon için mutlu yol, hata yolları (boş ad/SKU, yinelenen SKU, negatif değerler, stoktan fazla çıkış, hareketli ürünü silme), sınır (stok == minStok), büyük/küçük harf duyarsız arama, tarih aralığı ve sıralama, CSV kaçışı, girdinin değişmemesi (Object.freeze).
4. src/gorevler.js ve tests/gorevler.test.js dosyalarını sil.
5. index.html'yi yeniden yaz: başlık/h1 "Stok takip", özet kartları, araç çubuğu (arama, kategori, kritik onay kutusu, Yeni ürün, CSV indir), tablo, "Örnek verilerle başla" düğmesi, uyarı alanı, modal için <dialog> ya da kaplama öğeleri. CSS satır içi: kritik satır arka planı, rozet, @media (max-width: 600px) ile tabloyu kart görünümüne çevir. Yalnız göreli script src="src/app.js" (type=module).
6. src/app.js'yi yeniden yaz: yalnız src/stok.js fonksiyonlarını çağırıp çizer. localStorage yükleme/kaydetme (try/catch; bozuk veride boş başla + uyarı), sütun sıralama durumu (ikinci tıklamada ters), anlık filtreler, modal formlar (ürün, giriş/çıkış, geçmiş) ve alan altı Türkçe hata mesajları, CSV indirme (Blob + a[download]). Tüm kullanıcı metni textContent ile; innerHTML yok.
7. tests/sayfa.test.js ve tests/arayuz.test.js'i yeni sayfaya uyarla: title/h1, app.js'deki her getElementById kimliğinin index.html'de olması, göreli script yolu, @media 600px kuralı, kaynakta innerHTML bulunmaması, bozuk localStorage ile çökmeme, örnek veri düğmesi. Sahte DOM'a gereken öğeler (dialog, select) eklenebilir.
8. README.md'yi stok takip uygulamasına göre güncelle (yapı: src/stok.js, src/app.js; 8080 çalıştırma komutu korunur; testler). docs/gorevler/gorev-tur-5.md dosyasına kriterleri ve planı yaz. Sonunda `node --test tests/*.test.js` çalıştır ve tarayıcıda http://localhost:8080 sayfasını elle kontrol et.
