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
- Bir görev şu biçimdedir: `{ id: number, baslik: string, tamamlandi: boolean }`. Yeni alanlar görevlerle eklenir.

## Çalıştırma

Depo kökünde şu komutu çalıştırın:

```
python3 -m http.server 8080
```

Ardından `http://localhost:8080` adresini açın; sayfa başlığı "Görev listesi" olmalıdır.
Derleme gerekmez, bağımlılık eklenmez. 8080 portunu başka bir süreç tutuyorsa önce onu durdurun,
yoksa başka bir projenin sayfası görünür.

## Testleri çalıştırma

```
node --test tests/*.test.js
```
