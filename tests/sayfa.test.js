import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const kok = new URL('../', import.meta.url);
const oku = (p) => readFileSync(new URL(p, kok), 'utf8');
const html = oku('index.html');

test('sayfa: <title> "Görev listesi" olur', () => {
  assert.match(html, /<title>\s*Görev listesi\s*<\/title>/);
});

test('sayfa: <h1> metni "Görev listesi" olur', () => {
  assert.match(html, /<h1[^>]*>\s*Görev listesi\s*<\/h1>/);
});

test('sayfa: ekle-formu, baslik, liste, bos kimlikli öğeler bulunur', () => {
  for (const id of ['ekle-formu', 'baslik', 'liste', 'bos']) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `${id} yok`);
  }
});

test('sayfa: src/app.js module script olarak yüklenir', () => {
  assert.match(html, /<script\s+type=["']module["']\s+src=["']src\/app\.js["']\s*>\s*<\/script>/);
});

test('sayfa: script src göreli yoldur (mutlak yol ya da dış adres yok) ve dosya vardır', () => {
  const srclar = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)].map((m) => m[1]);
  assert.ok(srclar.length >= 1);
  for (const s of srclar) {
    assert.doesNotMatch(s, /^(\/|[a-z][a-z0-9+.-]*:|\/\/)/i, `göreli olmalı: ${s}`);
    assert.ok(existsSync(new URL(s, kok)), `dosya yok: ${s}`);
  }
  assert.ok(existsSync(new URL('src/app.js', kok)));
});

test('sayfa: app.js içindeki her getElementById kimliği index.html içinde tanımlıdır', () => {
  const kaynak = oku('src/app.js');
  const idler = [...kaynak.matchAll(/getElementById\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1]);
  for (const beklenen of ['ekle-formu', 'baslik', 'liste', 'bos', 'surum']) {
    assert.ok(idler.includes(beklenen), `app.js ${beklenen} aramıyor`);
  }
  for (const id of new Set(idler)) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `index.html'de id yok: ${id}`);
  }
});

test('sayfa: index.html tamamlandi sınıfı için line-through kuralı içerir', () => {
  assert.match(html, /\.tamamlandi[^{]*\{[^}]*text-decoration:\s*line-through/);
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
