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

## İnsan önceki teslimi reddetti
UI ve UX olarak çok kötü. Profesyonel hale getir.
Bu ret notu görevin parçasıdır; kabul kriterleri ve testler bunu kapsamalıdır.

## Kabul kriterleri
- [ ] YORUM (kapsam): Depoda iş mantığı (src/stok.js), örnek veri ve temel arayüz zaten var; bu teslimin asıl işi, insanın reddettiği 'UI/UX çok kötü' notunu gidermektir. Bu yüzden ürün/hareket biçimleri ve src/stok.js fonksiyonlarının davranışı değişmez. Mevcut testlerin hepsi (`node --test tests/*.test.js`) hatasız geçmeye devam eder. Yeni özellik eklenmez; yalnız görsel tasarım, kullanılabilirlik ve erişilebilirlik iyileştirilir. 'Profesyonel' ölçüsü aşağıdaki gözlemlenebilir kriterlerdir.
- [ ] Tasarım sistemi: index.html içindeki CSS, :root altında CSS özel özellikleri (--renk-*, --bosluk-*, --yaricap-*, --golge-* gibi en az 8 değişken) tanımlar; renk, boşluk ve köşe yuvarlaklığı değerleri bu değişkenlerden okunur. Satır içi style özniteliği ve harici/CDN stil dosyası kullanılmaz. Tek bir uyumlu renk paleti (birincil, tehlike, uyarı, nötr) ve tek yazı tipi yığını vardır. Testte index.html kaynağı taranır.
- [ ] Düğme ve form kalıpları: Düğmelerin birincil (Yeni ürün, Kaydet), ikincil (CSV indir, İptal) ve tehlike/uyarı (Çıkış) olarak ayrışan sınıfları vardır. Düğme, girdi ve seçicilerde :hover, :focus-visible ve :disabled stilleri tanımlıdır. Satır işlem düğmeleri (Giriş, Çıkış, Düzenle, Geçmiş) küçük ve birbirinden ayırt edilebilir olup her biri tablo satırında aynı sırada görünür. Testte CSS kaynağında bu seçiciler ve sınıflar aranır; app.js'te işlem düğmeleri bu sınıflarla üretilir.
- [ ] Özet kartları ve tablo düzeni: Dört kart (Toplam ürün, Toplam stok değeri, Kritik stoktaki ürün, Bugünkü hareket) kart başlığı + büyük değer biçimiyle, kritik kart sayısı 0'dan büyükse vurgu sınıfıyla gösterilir; para değeri paraBicimle çıktısıdır (örn. 12450 → "12.450,00 ₺"). Tablo başlığı yapışkan (position: sticky) olup sayısal sütunlar (stok, min. stok, fiyatlar) sağa hizalıdır; satır üzerine gelince (hover) vurgu vardır; kritik satır kırmızımsı arka plan ve 'Kritik' rozeti taşır. Testte CSS taranır ve sahte DOM'da satırın sınıfları/rozeti doğrulanır.
- [ ] Sıralama ve durum geri bildirimi: Sıralanabilir sütun başlıkları klavyeyle odaklanabilir (düğme öğesi ya da tabindex=0 + Enter/Boşluk) ve aria-sort özniteliği taşır (none/ascending/descending); ilk tıklamada artan, ikinci tıklamada azalan olur ve aktif sütunda ▲/▼ göstergesi çıkar. Süzme sonucu boşsa, ürün hiç yoksa 'Henüz ürün yok' ile 'Örnek verilerle başla' düğmesini içeren, süzme sonucu boşsa 'Aramanıza uygun ürün bulunamadı' diyen ayrı ve açıklayıcı boş durum mesajı gösterilir. Testte sahte DOM üzerinde başlığa tıklanıp aria-sort değeri ve boş durum metinleri doğrulanır.
- [ ] Pencere (modal) kullanılabilirliği: Tüm pencereler <dialog> ile açılır; başlığı, kapatma düğmesi (aria-label="Kapat") ve Esc ile kapanma vardır; her form alanının <label for> ile bağlı etiketi, zorunlu alanlarda işareti, geçersiz alanda aria-invalid="true" ve aria-describedby ile bağlı Türkçe hata mesajı bulunur (hata metni textContent ile yazılır); pencere açılınca ilk alana odak gelir; kaydetme geçersizken pencere kapanmaz. Giriş/Çıkış penceresi ürün adını ve mevcut stoğu birimiyle gösterir; stok yetmiyorsa 'Stok yetersiz' uyarısı pencerenin içinde görünür ve stok değişmez. Geçmiş penceresi tarihi okunur Türkçe biçimle (GG.AA.YYYY SS:DD), türü Türkçe etiketle (Giriş/Çıkış/Düzeltme), miktarı ve hareket sonrası stoğu (sonrasiStok) listeler; hareket yoksa 'Bu ürün için hareket yok' yazar. Testte sahte DOM ile doğrulanır.
- [ ] Bildirim ve uyarılar: Kayıt, hareket ekleme ve silme gibi başarılı işlemlerden sonra, birkaç saniye sonra kaybolan ve role="status" taşıyan bir bildirim (toast) gösterilir; bozuk localStorage verisinde uyarı alanı (role="alert") görünür, uygulama boş açılır ve çökmez. Tarayıcı alert()/confirm()/prompt() kullanılmaz. Kullanıcıdan gelen tüm metinler yalnız textContent ile yazılır; src/app.js içinde innerHTML, outerHTML ve insertAdjacentHTML geçmez. Testte kaynak taranır ve bozuk JSON ile sahte DOM'da uygulama yüklenip uyarı metni doğrulanır.
- [ ] Duyarlılık ve erişilebilirlik: 600 px altında tablo başlığı gizlenir, her satır kart olarak görünür ve her hücre data-label ile etiketlenir; araç çubuğu (arama, kategori, kritik onay kutusu) tek sütuna iner, dört özet kartı 2×2 kalır, modal ekrana sığar (max-width: 100vw civarı) ve düğmelerin dokunma alanı en az 40 px yüksekliktedir; yatay kaydırma oluşmaz. Arama kutusu, kategori seçici ve onay kutusunun görünür ya da aria-label'lı etiketi vardır; sayfada <main>, <header> ve düzgün başlık hiyerarşisi (tek h1) bulunur; prefers-reduced-motion için animasyonlar kapatılır. Testte index.html'deki @media (max-width: 600px) bloğu ve bu öznitelikler taranır.

## Plan
1. Mevcut durumu doğrula: `node --test tests/*.test.js` çalıştır, hepsinin geçtiğini not et. src/stok.js, src/ornek.js ve tests/stok.test.js'e DOKUNMA (iş mantığı tamam). Gerekirse yalnız biçimleme yardımcısı eklemek için src/stok.js'e saf bir `tarihBicimle(ts)` (GG.AA.YYYY SS:DD) ve `turEtiketi(tur)` fonksiyonu ekle ve tests/stok.test.js'te test et.
2. index.html: <style> bloğunu baştan yaz. :root altında renk (birincil, tehlike, uyarı, başarı, nötr tonlar, yüzey, kenarlık), boşluk, yarıçap, gölge değişkenleri tanımla. Sınıflar: .dugme, .dugme-birincil, .dugme-ikincil, .dugme-tehlike, .dugme-kucuk; :hover/:focus-visible/:disabled stilleri; yapışkan tablo başlığı, sağa hizalı sayısal sütunlar (.sayi), satır hover, .kritik arka planı ve .rozet; kart değerleri için .kart.vurgu; .bos-durum; .toast; dialog::backdrop; prefers-reduced-motion. @media (max-width: 600px) bloğunu koru ve genişlet (kart görünümü, tek sütun araç çubuğu, 2×2 özet kartları, tam genişlik modal, 40 px dokunma alanı).
3. index.html gövdesi: <header> içinde tek <h1>Stok takip</h1> ve eylem düğmeleri (Yeni ürün birincil, CSV indir ikincil); <main> içinde özet kartlar, araç çubuğu (etiketli arama, kategori, kritik onay kutusu), tablo kapsayıcısı (yatay taşmayı önleyen), boş durum alanı (#bos + #ornek-veri), role=status toast alanı (#bildirim) ve role=alert #uyari. <dialog id="modal"> içine başlık ve Kapat (aria-label) düğmesi ekle. Tüm yeni kimlikleri app.js'te kullanmadan önce burada tanımla (sayfa testi bunu denetler).
4. src/app.js: (a) satır işlem düğmelerine ve araç çubuğu düğmelerine yeni sınıfları ver; Çıkış'ı ikincil/uyarı tonunda yap. (b) basliklariCiz: sıralanabilir başlıklara düğme içeren th, aria-sort ve ▲/▼ göstergesi, Enter/Boşluk desteği; sayısal hücrelere .sayi sınıfı. (c) kartlariCiz: kritik sayısı > 0 ise .vurgu sınıfı. (d) ciz: iki ayrı boş durum metni (ürün yok + örnek veri düğmesi / süzme sonucu boş). (e) bildirimGoster(metin) ekle (role=status, ~3 sn sonra gizle) ve ürün kaydet, hareket ekle, CSV indir sonrası çağır.
5. src/app.js pencereler: alan() yardımcısını label for/id, zorunlu işareti, aria-invalid ve aria-describedby ile bağla; hata metnini textContent ile yaz; pencere açılınca ilk alana focus(); Kapat düğmesi ve Esc (dialog cancel olayı) ile kapanma; geçersizken kapanmama. hareketPenceresi'nde ürün adı ve mevcut stoğu birimiyle üstte göster, stok yetersizse hata alanında 'Stok yetersiz' göster. gecmisPenceresi'nde tarihBicimle ve turEtiketi kullan, sonrasiStok sütununu göster, boşsa 'Bu ürün için hareket yok' yaz. alert/confirm/prompt ve innerHTML kullanma.
6. Testler: tests/sayfa.test.js'e yeni kriterlerin kaynak taramalarını ekle (:root değişken sayısı ≥ 8, sınıf ve :focus-visible/:hover/:disabled kuralları, sticky, <main>/<header>, tek h1, aria-label'lar, prefers-reduced-motion, @media 600px içinde data-label/kart kuralları, `style=` özniteliği yok, alert(/confirm(/prompt( yok, innerHTML yok). tests/arayuz.test.js (sahte DOM; yoksa oluştur): sıralama ikinci tıklamada ters + aria-sort, boş durum metinleri, modal doğrulama hatası + aria-invalid, stok yetersiz uyarısı ve stokun değişmemesi, geçmiş penceresi sütunları, bozuk localStorage'da uyarı ve çökmeme. Mevcut tests/stok.test.js'i bozma.
7. README.md'ye kısa bir 'Arayüz ilkeleri' bölümü ekle (tasarım değişkenleri, erişilebilirlik kuralları, 600 px kart görünümü); 8080 komutu ve test komutu aynen kalsın. docs/gorevler/tur-5.md'ye bu kabul kriterlerini ve planı yaz. Sonda `node --test tests/*.test.js` çalıştır, `python3 -m http.server 8080` ile http://localhost:8080 adresini 1280 px ve 375 px genişlikte elle kontrol et: boş durum, örnek veri, sıralama, modallar, kritik satırlar, toast, CSV indirme.
