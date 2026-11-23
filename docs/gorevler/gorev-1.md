# Görev #1: Görevler tamamlandı olarak işaretlenebilsin.

Listedeki her görevin yanında bir onay kutusu olsun. Kutu işaretlenince görev tamamlanmış sayılsın ve başlığının üstü çizilsin. İşaret kaldırılınca eski haline dönsün.

## İnsan önceki teslimi reddetti
<img width="1728" height="1117" alt="Ekran Resmi 2026-11-23 15 23 40" src="https://github.com/user-attachments/assets/6004c902-f75b-4552-80d1-b3159c379744" />  Bu görüntü ne alaka
Bu ret notu görevin parçasıdır; kabul kriterleri ve testler bunu kapsamalıdır.

## Kabul kriterleri
- [ ] Yorum: 'tamamlandı' durumu görevde `tamamlandi` (boolean) alanıdır; kalıcılık, silme, filtreleme kapsam dışıdır. `src/gorevler.js` yeni saf fonksiyon `tamamlanmaDegistir(liste, id)` dışa aktarır; verilen id'li görevin `tamamlandi` değerini tersine çevirip yeni liste döndürür. İnsanın ret notundaki ekran görüntüsü okunamadığı için (yalnız 'Bu görüntü ne alaka' yazıyor) en dar yorum seçildi: teslim yalnız onay kutusu ve üstü çizili başlıkla ilgili olmalı, ilgisiz çıktı içermemelidir.
- [ ] `gorevEkle([], 'Süt al')` sonucu `[{ id: 1, baslik: 'Süt al', tamamlandi: false }]` olur.
- [ ] `tamamlanmaDegistir(liste, id)` `tamamlandi: false` olan görevi `true` yapar; tamamlanmış görevde tekrar çağrılınca `false` olur ve iki çağrı sonunda görev ilk haline eşittir.
- [ ] `tamamlanmaDegistir` yalnız verilen id'li görevi değiştirir; diğer görevlerin tüm alanları, listedeki sıra ile hedef görevin `id` ve `baslik` değerleri aynı kalır.
- [ ] `tamamlanmaDegistir` girdi listesini ve görev nesnelerini değiştirmez (dondurulmuş girdiyle hata vermez, yeni liste döner); listede olmayan id ya da boş liste verilirse içeriği aynı liste döner ve hata fırlatmaz.
- [ ] Arayüzde (`src/app.js`) her görev satırında tam bir `input type=checkbox` bulunur; başlangıçta işaretsizdir, `checked` değeri görevin `tamamlandi` değerini yansıtır; kutu tıklanınca yalnız o görev tamamlanır, diğer satırların kutuları değişmez.
- [ ] Tamamlanmış görevin başlık öğesi üstü çizili görünür (`tamamlandi` sınıfı ve `index.html` içinde `text-decoration: line-through` kuralı); işaret kaldırılınca sınıf kalkar ve çizgi kaybolur; başlık `textContent` ile yazılır (`<b>x</b>` gibi bir başlık HTML olarak yorumlanmaz).
- [ ] Ret notu kapsamı: görev satırı yalnız onay kutusu ve başlık metninden oluşur; bu görev kapsamında görsel, ek bileşen veya istenmeyen başka öğe eklenmez; `node --test tests/*.test.js` tüm testlerle geçer.

## Plan
1. Önce mevcut durumu doğrula: `src/gorevler.js` (`gorevEkle` zaten `tamamlandi: false` veriyor, `tamamlanmaDegistir` var), `src/app.js` (onay kutusu ve `tamamlandi` sınıfı var), `index.html` (`li span.tamamlandi` çizgi kuralı var) ve testler. `node --test tests/*.test.js` çalıştır; eksik ya da kırık olan yoksa bu kodlara dokunma.
2. Ret notunu çöz: ekran görüntüsü (Ekran Resmi 2026-11-23 15 23 40) okunamadı, yorumda yalnız 'Bu görüntü ne alaka' var. İnsana, görüntünün hangi ekranı gösterdiğini ve neyin ilgisiz bulunduğunu sor; yanıt gelene kadar en dar yorumu uygula: görev dışı hiçbir öğe/dosya teslime girmesin.
3. `src/app.js` ve `index.html` içinde görev kapsamı dışı öğe var mı kontrol et (örn. teslimle gelen görsel, ek dosya, `Sürüm` altbilgisi). Görevle ilgisizse ve ret nedeni olarak doğrulanırsa kaldır; doğrulanmadıysa dokunma ve raporda belirt.
4. `tests/arayuz.test.js` içine satırın yalnız bir checkbox ve bir başlık span'ından oluştuğunu doğrulayan test ekle (ret notu kapsamı); mevcut testleri koru.
5. `README.md` görev biçimi satırının `{ id: number, baslik: string, tamamlandi: boolean }` olduğunu doğrula.
6. `docs/gorevler/gorev-1.md` içindeki kriterleri bu listeyle güncelle.
7. `node --test tests/*.test.js` ile tüm testlerin geçtiğini doğrula.
