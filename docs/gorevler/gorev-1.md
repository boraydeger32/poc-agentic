# Görev #1: Görevler tamamlandı olarak işaretlenebilsin.

Listedeki her görevin yanında bir onay kutusu olsun. Kutu işaretlenince görev tamamlanmış sayılsın ve başlığının üstü çizilsin. İşaret kaldırılınca eski haline dönsün.

## İnsan önceki teslimi reddetti
<img width="1728" height="1117" alt="Ekran Resmi 2026-11-23 15 30 04" src="https://github.com/user-attachments/assets/ea2376c7-1865-4e0a-bd5b-1b63b8117c5a" />  Yanlış proje çalışıyor 8080 portunda.
Bu ret notu görevin parçasıdır; kabul kriterleri ve testler bunu kapsamalıdır.

## Kabul kriterleri
- [ ] Yorum: Önceki ret notundaki ekran görüntüsü okunamadı; yalnız "Yanlış proje çalışıyor 8080 portunda" yazıyor. En dar yorum: 8080'de sunulan sayfa bu depodaki görev listesi olmalıdır; başka bir projenin sayfası olmamalıdır. Depo kökü doğrudan sunulduğunda `index.html` bu projenin sayfasını vermelidir. Kapsam dışı: sunucu, derleme adımı, bağımlılık, yeni özellik. Onay kutusu ve üstü çizili başlık davranışı (tamamlandı yorumu) aynen geçerlidir.
- [ ] `index.html` içinde `<title>` değeri `Görev listesi`, `<h1>` metni `Görev listesi` olur; sayfada `ekle-formu`, `baslik`, `liste`, `bos` kimlikli öğeler bulunur ve `<script type="module" src="src/app.js">` ile `src/app.js` yüklenir (testte `index.html` okunarak doğrulanır).
- [ ] `index.html` içindeki `script src` yolu depo köküne göre göreli (`src/app.js`) olur ve bu dosya diskte vardır. Mutlak yol ya da dış adres kullanılmaz, böylece kök hangi portta sunulursa sunulsun bu proje yüklenir.
- [ ] `src/app.js` içinde `getElementById` ile aranan her kimlik (`ekle-formu`, `baslik`, `liste`, `bos`, `surum`) `index.html` içinde tanımlıdır; başka bir projenin sayfası bu kimlikleri sağlayamayacağı için yanlış sayfa testle yakalanır.
- [ ] `README.md`, uygulamanın depo kökünden sunularak 8080 portunda açılacağını tek bir komutla anlatan kısa bir bölüm içerir. Komut ek bağımlılık gerektirmez (örn. `python3 -m http.server 8080`). Testte README içinde `8080` geçtiği doğrulanır.
- [ ] `tamamlanmaDegistir(liste, id)` verilen id'li görevin `tamamlandi` değerini tersine çevirir. İki çağrı görevi ilk haline döndürür. Yalnız hedef görev değişir, girdi liste ve nesneler değişmez. Olmayan id ya da boş listede içeriği aynı liste döner ve hata fırlatmaz.
- [ ] Arayüzde her görev satırı tam olarak bir `input type=checkbox` ve bir başlık `span`'ından oluşur. Kutu `tamamlandi` değerini yansıtır. Tıklanınca yalnız o görev değişir. Tamamlanmış görevin başlığında `tamamlandi` sınıfı bulunur, `index.html` bu sınıf için `text-decoration: line-through` kuralını içerir. İşaret kalkınca sınıf da kalkar.
- [ ] `node --test tests/*.test.js` mevcut ve yeni testlerle birlikte hatasız geçer.

## Plan
1. Önce `node --test tests/*.test.js` çalıştır. `src/gorevler.js` (`gorevEkle`, `tamamlanmaDegistir`), `src/app.js` (onay kutusu, `tamamlandi` sınıfı) ve `index.html` (çizgi kuralı) zaten var. Kırık bir şey yoksa bu dosyaların mantığına dokunma.
2. Ret notunu çöz: 8080'deki yanlış proje büyük olasılıkla bu depoyu değil başka bir dizini sunan bir süreçtir. Geliştirici 8080'i dinleyen süreci bulsun (örn. `lsof -i :8080`), eskisini durdursun ve sunucuyu bu deponun kökünden başlatsın. Bu bir ortam işidir, kod değişikliği değildir. Ekran görüntüsü okunamadığı için insana görüntüde ne gördüğünü kısaca sor.
3. `README.md`: "Çalıştırma" bölümü ekle. Depo kökünde `python3 -m http.server 8080` çalıştırılır, `http://localhost:8080` açılır ve sayfa başlığı "Görev listesi" olmalıdır. Derleme gerekmediğini ve bağımlılık eklenmediğini yaz. `package.json` ve `src/` dosyalarına dokunma.
4. `tests/arayuz.test.js` dosyasına, `readFileSync` ile `index.html` okuyan testler ekle. Testler `<title>` ve `<h1>` değerini, `script src="src/app.js"` göreli yolunu ve dosyanın varlığını (`existsSync`) doğrular. Ayrıca `app.js` içindeki `getElementById('...')` kimliklerini regex ile çıkarıp her birinin `index.html`'de `id="..."` olarak geçtiğini doğrular.
5. `tests/arayuz.test.js` dosyasına `README.md` içinde `8080` geçtiğini kontrol eden bir test ekle. Mevcut testleri silme veya değiştirme.
6. `docs/gorevler/gorev-1.md` dosyasındaki kriterleri ve planı bu listeyle güncelle.
7. `node --test tests/*.test.js` çalıştır ve hepsinin geçtiğini doğrula. Teslimden önce tarayıcıda `http://localhost:8080` açıp bu projenin sayfasının geldiğini, kutunun işaretlenince başlığın çizildiğini kontrol et.
