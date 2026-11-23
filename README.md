# Görev listesi

Tarayıcıda çalışan küçük bir görev listesi. Bu depodaki kodu ajan fabrikası yazar; insanlar görev
açar ve sonucu kabul eder.

## Yapı

- `index.html` — sayfa. Derleme adımı yoktur, dosyalar doğrudan sunulur.
- `src/gorevler.js` — iş mantığı. Saf fonksiyonlar: girdiyi değiştirmez, yeni liste döndürür.
- `src/app.js` — arayüz. Yalnız `src/gorevler.js` fonksiyonlarını çağırır ve sayfayı çizer.
- `tests/` — Node'un yerleşik test çalıştırıcısıyla yazılmış testler (`*.test.js`).
- `docs/gorevler/` — her görevin kabul kriterleri ve planı.

## Kurallar

- Dış bağımlılık yok. `npm install` gerekmez.
- İş mantığı `src/gorevler.js` içinde durur ve testle ölçülür; arayüz koduna mantık gömülmez.
- Kullanıcıdan gelen metin sayfaya `textContent` ile yazılır, `innerHTML` ile değil.
- Bir görev şu biçimdedir: `{ id: number, baslik: string }`. Yeni alanlar görevlerle eklenir.

## Testleri çalıştırma

```
node --test tests/*.test.js
```
