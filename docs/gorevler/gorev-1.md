# Görev #1: Görevler tamamlandı olarak işaretlenebilsin.

Listedeki her görevin yanında bir onay kutusu olsun. Kutu işaretlenince görev tamamlanmış sayılsın ve başlığının üstü çizilsin. İşaret kaldırılınca eski haline dönsün.

## Kabul kriterleri
- [ ] Yorum: 'tamamlandı' durumu görevde `tamamlandi` (boolean) alanı olarak tutulur; kalıcılık (localStorage vb.), silme ve filtreleme kapsam dışıdır. Yeni bir saf fonksiyon `tamamlanmaDegistir(liste, id)` `src/gorevler.js` içinde dışa aktarılır; verilen id'li görevin `tamamlandi` değerini tersine çevirip yeni liste döndürür.
- [ ] `gorevEkle` ile eklenen yeni görev `tamamlandi: false` alanıyla oluşur: `gorevEkle([], 'Süt al')` sonucu `[{ id: 1, baslik: 'Süt al', tamamlandi: false }]` olur.
- [ ] `tamamlanmaDegistir(liste, id)` tamamlanmamış (`tamamlandi: false`) görevi `tamamlandi: true` yapar.
- [ ] `tamamlanmaDegistir(liste, id)` tamamlanmış görevde tekrar çağrılınca `tamamlandi` değeri `false` olur; iki çağrı sonunda görev ilk haline eşittir.
- [ ] `tamamlanmaDegistir` yalnız verilen id'li görevi değiştirir; diğer görevlerin tüm alanları ve listedeki sıra aynı kalır, görevin `id` ve `baslik` değerleri de değişmez.
- [ ] `tamamlanmaDegistir` girdi listesini ve içindeki görev nesnelerini değiştirmez (yeni liste döner); listede olmayan bir id verilirse içeriği aynı bir liste döner ve hata fırlatmaz.
- [ ] Arayüzde (`src/app.js`) her görev satırında bir onay kutusu (`input type=checkbox`) bulunur; işaretli olması görevin `tamamlandi` değerini yansıtır ve tıklanınca yalnız `tamamlanmaDegistir` çağrılır.
- [ ] Arayüzde tamamlanmış görevin başlığı üstü çizili (`text-decoration: line-through`) gösterilir, işaret kaldırılınca çizgi kalkar; başlık hâlâ `textContent` ile yazılır.

## Plan
1. `src/gorevler.js`: `gorevEkle` içinde yeni görev nesnesine `tamamlandi: false` ekle (`{ id, baslik: temiz, tamamlandi: false }`).
2. `src/gorevler.js`: `tamamlanmaDegistir(liste, id)` fonksiyonunu ekle ve dışa aktar. `liste.map` ile eşleşen id'li görev için `{ ...g, tamamlandi: !g.tamamlandi }` döndür, diğerlerini olduğu gibi bırak. Girdiyi değiştirme.
3. `tests/gorevler.test.js`: mevcut `gorevEkle` ilk testindeki beklenen değeri `tamamlandi: false` içerecek şekilde güncelle; `tamamlanmaDegistir` için testler ekle: false→true, true→false (geri dönüş), yalnız hedef görev değişir ve sıra korunur, girdi değişmez, bilinmeyen id listeyi değiştirmez.
4. `src/app.js`: `tamamlanmaDegistir`'i içe aktar. `ciz()` içinde her satırın başına `input type=checkbox` ekle; `checked = gorev.tamamlandi`, erişilebilirlik için `aria-label` ver, `change` olayında `gorevler = tamamlanmaDegistir(gorevler, gorev.id); ciz();` çağır. Satırda tamamlandıysa metin span'ına `tamamlandi` sınıfını ekle (veya `classList.toggle`).
5. `index.html`: stil bölümüne `li span.tamamlandi { text-decoration: line-through; color: #656d76; }` kuralını ekle.
6. `README.md`: görev biçimi satırını `{ id: number, baslik: string, tamamlandi: boolean }` olarak güncelle.
7. `docs/gorevler/` altına bu görevin kabul kriterleri ve planını içeren dosyayı ekle (ör. `1-tamamlandi-isareti.md`).
8. `node --test tests/*.test.js` ile testlerin geçtiğini doğrula.
