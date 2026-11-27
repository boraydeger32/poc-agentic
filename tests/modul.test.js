import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as stok from '../src/stok.js';

const { modulCozumle, kritikSayisi, ozetHesapla, hareketleriSuz } = stok;

const kok = new URL('../', import.meta.url);
const oku = (p) => readFileSync(new URL(p, kok), 'utf8');

const dondur = (x) => {
  if (x && typeof x === 'object' && !Object.isFrozen(x)) {
    Object.freeze(x);
    Object.values(x).forEach(dondur);
  }
  return x;
};
const urun = (o = {}) => ({
  id: 1, ad: 'Kalem', sku: 'K-1', kategori: 'Kırtasiye', birim: 'adet',
  stok: 10, minStok: 5, alisFiyati: 2, satisFiyati: 4, ...o,
});
const har = (o = {}) => ({ id: 1, urunId: 1, tur: 'giris', miktar: 1, aciklama: '', tarih: 1000, ...o });

// modulCozumle
test('modulCozumle: bilinen hash yolları modül anahtarına çözülür', () => {
  assert.equal(modulCozumle('#/ozet'), 'ozet');
  assert.equal(modulCozumle('#/urunler'), 'urunler');
  assert.equal(modulCozumle('#/hareketler'), 'hareketler');
  assert.equal(modulCozumle('#/kritik'), 'kritik');
  assert.equal(modulCozumle('#/ayarlar'), 'ayarlar');
});

test('modulCozumle: boş, tanınmayan, null ve undefined hash Özet açar', () => {
  for (const h of ['', '#', '#/', '#/bilinmeyen', '#/xyz', undefined, null, 5]) {
    assert.equal(modulCozumle(h), 'ozet', String(h));
  }
});

// kritikSayisi
test('kritikSayisi: stok === minStok sayılır, stok > minStok sayılmaz, girdi değişmez', () => {
  const l = dondur([
    urun({ id: 1, stok: 5, minStok: 5 }),
    urun({ id: 2, stok: 6, minStok: 5 }),
    urun({ id: 3, stok: 0, minStok: 5 }),
  ]);
  assert.equal(kritikSayisi(l), 2);
  assert.equal(kritikSayisi([]), 0);
});

// ozetHesapla
test('ozetHesapla: boş veride 0, 0, 0 ve []', () => {
  const o = ozetHesapla([], []);
  assert.equal(o.urunSayisi, 0);
  assert.equal(o.toplamStok, 0);
  assert.equal(o.kritikSayisi, 0);
  assert.deepEqual(o.sonHareketler, []);
});

test('ozetHesapla: ürün sayısı, stok toplamı ve kritik sayısı', () => {
  const o = ozetHesapla(dondur([
    urun({ id: 1, stok: 3, minStok: 3 }),
    urun({ id: 2, stok: 7, minStok: 1 }),
  ]), []);
  assert.equal(o.urunSayisi, 2);
  assert.equal(o.toplamStok, 10);
  assert.equal(o.kritikSayisi, 1);
});

test('ozetHesapla: son 5 hareket en yeni üstte, girdi değişmez', () => {
  const hs = dondur([1, 2, 3, 4, 5, 6, 7].map((i) => har({ id: i, tarih: i * 10 })));
  const o = ozetHesapla(dondur([urun()]), hs);
  assert.deepEqual(o.sonHareketler.map((h) => h.id), [7, 6, 5, 4, 3]);
});

test('ozetHesapla: tarih eşitse id büyük olan üstte', () => {
  const hs = dondur([har({ id: 1, tarih: 5 }), har({ id: 3, tarih: 5 }), har({ id: 2, tarih: 5 })]);
  assert.deepEqual(ozetHesapla([], hs).sonHareketler.map((h) => h.id), [3, 2, 1]);
});

// hareketleriSuz
const urunler = dondur([urun({ id: 1, ad: 'Kalem' }), urun({ id: 2, ad: 'Defter' })]);
const hareketler = dondur([
  har({ id: 1, urunId: 1, tur: 'giris', tarih: 10 }),
  har({ id: 2, urunId: 2, tur: 'cikis', tarih: 20 }),
  har({ id: 3, urunId: 1, tur: 'duzeltme', tarih: 30 }),
  har({ id: 4, urunId: 1, tur: 'cikis', tarih: 30 }),
  har({ id: 5, urunId: 99, tur: 'giris', tarih: 5 }),
]);
const idler = (s) => s.map((h) => h.id);

test('hareketleriSuz: süzgeçsiz hepsi, en yeni üstte (eşitte id büyük üstte)', () => {
  assert.deepEqual(idler(hareketleriSuz(urunler, hareketler, {})), [4, 3, 2, 1, 5]);
  assert.deepEqual(idler(hareketleriSuz(urunler, hareketler)), [4, 3, 2, 1, 5]);
  assert.deepEqual(idler(hareketleriSuz(urunler, hareketler, { urunId: '', tur: '' })), [4, 3, 2, 1, 5]);
});

test('hareketleriSuz: ürüne göre süzer', () => {
  assert.deepEqual(idler(hareketleriSuz(urunler, hareketler, { urunId: 2 })), [2]);
  assert.deepEqual(idler(hareketleriSuz(urunler, hareketler, { urunId: 1 })), [4, 3, 1]);
});

test('hareketleriSuz: türe göre süzer, düzeltme dahil', () => {
  assert.deepEqual(idler(hareketleriSuz(urunler, hareketler, { tur: 'giris' })), [1, 5]);
  assert.deepEqual(idler(hareketleriSuz(urunler, hareketler, { tur: 'cikis' })), [4, 2]);
  assert.deepEqual(idler(hareketleriSuz(urunler, hareketler, { tur: 'duzeltme' })), [3]);
});

test('hareketleriSuz: ürün ve tür birlikte; eşleşme yoksa boş liste', () => {
  assert.deepEqual(idler(hareketleriSuz(urunler, hareketler, { urunId: 1, tur: 'cikis' })), [4]);
  assert.deepEqual(hareketleriSuz(urunler, hareketler, { urunId: 2, tur: 'duzeltme' }), []);
  assert.deepEqual(hareketleriSuz([], [], {}), []);
});

test('hareketleriSuz: satırlar urunAd taşır; silinmiş ürün için boş olmayan yedek metin', () => {
  const s = hareketleriSuz(urunler, hareketler, {});
  assert.equal(s.find((h) => h.id === 2).urunAd, 'Defter');
  const yetim = s.find((h) => h.id === 5);
  assert.equal(typeof yetim.urunAd, 'string');
  assert.ok(yetim.urunAd.trim().length > 0);
  assert.equal(yetim.miktar, 1);
  assert.equal(yetim.urunId, 99);
});

test('hareketleriSuz: girdi değişmez (dondurulmuş girdiyle hata vermez)', () => {
  assert.doesNotThrow(() => hareketleriSuz(urunler, hareketler, { tur: 'giris' }));
  assert.equal(hareketler[0].id, 1);
});

// Sayfa yapısı
const html = oku('index.html');

test("sayfa: kenar çubuğu aria-label'lı <nav> ve beş gerçek bağlantı, sırayla", () => {
  assert.match(html, /<nav\b[^>]*aria-label=["'][^"']+["']/);
  const nav = html.match(/<nav\b[\s\S]*?<\/nav>/)[0];
  const hrefler = [...nav.matchAll(/<a\b[^>]*href=["']([^"']+)["']/g)].map((m) => m[1]);
  assert.deepEqual(hrefler, ['#/ozet', '#/urunler', '#/hareketler', '#/kritik', '#/ayarlar']);
  assert.match(nav, /Stok takip/);
  for (const m of ['Özet', 'Ürünler', 'Stok hareketleri', 'Kritik stok', 'Ayarlar']) {
    assert.match(nav, new RegExp(m));
  }
});

test('sayfa: kritik rozeti nav içinde ve varsayılan gizli', () => {
  const nav = html.match(/<nav\b[\s\S]*?<\/nav>/)[0];
  assert.match(nav, /<span\b[^>]*class=["'][^"']*rozet[^"']*["'][^>]*\bhidden\b|<span\b[^>]*\bhidden\b[^>]*class=["'][^"']*rozet/);
});

test('sayfa: menü düğmesi gerçek button, adlı, aria-expanded ve aria-controls taşır', () => {
  const b = html.match(/<button\b[^>]*id=["']menu-dugme["'][^>]*>/);
  assert.ok(b, 'menu-dugme yok');
  assert.match(b[0], /type=["']button["']/);
  assert.match(b[0], /aria-label=["'][^"']+["']/);
  assert.match(b[0], /aria-expanded=["']false["']/);
  const c = b[0].match(/aria-controls=["']([^"']+)["']/);
  assert.ok(c);
  assert.match(html, new RegExp(`id=["']${c[1]}["']`));
});

test('sayfa: beş modül bölümü vardır ve seçili bağlantı renk dışı işaretle belirtilir', () => {
  for (const m of ['ozet', 'urunler', 'hareketler', 'kritik', 'ayarlar']) {
    assert.match(html, new RegExp(`<section\\b[^>]*id=["']modul-${m}["']`), m);
  }
  const css = html.match(/<style[\s\S]*?<\/style>/)[0];
  const kural = css.match(/aria-current=["']?page["']?\][^{]*\{[^}]*\}/);
  assert.ok(kural, 'aria-current CSS yok');
  assert.match(kural[0], /font-weight:\s*(bold|[6-9]00)|border-left|text-decoration|outline/);
});

test("sayfa: app.js hashchange ve modulCozumle kullanır, hash/menü localStorage'a yazılmaz", () => {
  const k = oku('src/app.js');
  assert.match(k, /hashchange/);
  assert.match(k, /modulCozumle/);
  assert.match(k, /ozetHesapla/);
  assert.match(k, /hareketleriSuz/);
  assert.match(k, /kritikSayisi/);
  assert.match(k, /aria-current/);
  assert.match(k, /aria-expanded/);
  assert.doesNotMatch(k, /setItem\([^)]*(hash|menu)/i);
});

test('sayfa: Ayarlar silmeden önce confirm ister; örnek yükle ve sil düğmeleri vardır', () => {
  const k = oku('src/app.js');
  assert.match(html, /id=["']ayar-ornek["']/);
  assert.match(html, /id=["']ayar-sil["']/);
  assert.match(k, /confirm\(/);
});

test('sayfa: hareketler ve kritik modülleri için kimlikler tanımlıdır', () => {
  for (const id of ['hareket-urun', 'hareket-tur', 'hareket-govde', 'hareket-bos', 'kritik-govde', 'kritik-bos', 'ozet-son-hareketler']) {
    assert.match(html, new RegExp(`id=["']${id}["']`), id);
  }
});
