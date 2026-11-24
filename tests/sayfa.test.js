import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const kok = new URL('../', import.meta.url);
const oku = (p) => readFileSync(new URL(p, kok), 'utf8');
const html = oku('index.html');
const hepsi = () => html + oku('src/app.js');

test('sayfa: <title> ve <h1> "Stok takip" olur', () => {
  assert.match(html, /<title>\s*Stok takip\s*<\/title>/);
  assert.match(html, /<h1[^>]*>\s*Stok takip\s*<\/h1>/);
});

test('sayfa: görev listesi kalıntıları yoktur', () => {
  assert.doesNotMatch(html, /Görev listesi/);
  assert.doesNotMatch(html, /id=["']ekle-formu["']/);
  assert.equal(existsSync(new URL('src/gorevler.js', kok)), false);
  assert.doesNotMatch(oku('src/app.js'), /gorevler|gorevEkle|tamamlanmaDegistir/);
});

test('sayfa: src/app.js module script olarak yüklenir, göreli yol, dosyalar vardır', () => {
  assert.match(html, /<script\s+type=["']module["']\s+src=["']src\/app\.js["']\s*>\s*<\/script>/);
  assert.ok(existsSync(new URL('src/app.js', kok)));
  assert.ok(existsSync(new URL('src/stok.js', kok)));
  const srclar = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)].map((m) => m[1]);
  for (const s of srclar) {
    assert.doesNotMatch(s, /^(\/|[a-z][a-z0-9+.-]*:|\/\/)/i, `göreli olmalı: ${s}`);
    assert.ok(existsSync(new URL(s, kok)), `dosya yok: ${s}`);
  }
});

test('sayfa: app.js içindeki her getElementById kimliği index.html içinde tanımlıdır', () => {
  const kaynak = oku('src/app.js');
  const idler = [...kaynak.matchAll(/getElementById\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1]);
  assert.ok(idler.length > 0);
  for (const id of new Set(idler)) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `index.html'de id yok: ${id}`);
  }
});

test('sayfa: arama kutusu, kategori seçici, kritik onay kutusu, yeni ürün ve CSV düğmeleri', () => {
  assert.match(html, /<select/i);
  assert.match(html, /type=["']checkbox["']/);
  assert.match(hepsi(), /Yalnız kritik stok/);
  assert.match(hepsi(), /Yeni ürün/);
  assert.match(hepsi(), /CSV indir/);
});

test('sayfa: "Örnek verilerle başla" düğmesi bulunur', () => {
  assert.match(hepsi(), /Örnek verilerle başla/);
});

test('sayfa: tablo ve sütun başlıkları vardır', () => {
  assert.match(html, /<table/i);
  for (const s of ['Ad', 'SKU', 'Kategori', 'Stok', 'Min', 'Alış', 'Satış']) {
    assert.match(hepsi(), new RegExp(s), `sütun yok: ${s}`);
  }
});

test('sayfa: satır düğmeleri ve Kritik rozeti metinleri vardır', () => {
  for (const s of ['Giriş', 'Çıkış', 'Düzenle', 'Geçmiş', 'Kritik']) {
    assert.match(hepsi(), new RegExp(s), `metin yok: ${s}`);
  }
});

test('sayfa: 600 piksel altı için medya sorgusu vardır', () => {
  assert.match(html, /@media[^{]*max-width:\s*600px/);
});

test('app.js: localStorage kullanır ve bozuk veriyi try/catch ile karşılar', () => {
  const k = oku('src/app.js');
  assert.match(k, /localStorage/);
  assert.match(k, /try\s*\{[\s\S]*JSON\.parse[\s\S]*\}\s*catch/);
});

test('app.js: CSV dosya adı stok-AAAA-GG-AA.csv biçimindedir', () => {
  assert.match(oku('src/app.js'), /stok-[^\n]*\.csv/);
});

test('app.js: kullanıcı metni için innerHTML kullanılmaz, textContent kullanılır', () => {
  const k = oku('src/app.js');
  assert.doesNotMatch(k, /\.(innerHTML|outerHTML)\s*=|insertAdjacentHTML/);
  assert.match(k, /textContent/);
});

test('README: uygulamanın 8080 portunda sunulacağı anlatılır', () => {
  assert.match(oku('README.md'), /8080/);
});

test('README: 8080 için tek komut verilir ve bağımlılık gerektirmez', () => {
  const readme = oku('README.md');
  assert.match(readme, /python3 -m http\.server 8080/);
  assert.doesNotMatch(readme, /npm install\s+\S+/);
  assert.match(readme, /localhost:8080/);
});
