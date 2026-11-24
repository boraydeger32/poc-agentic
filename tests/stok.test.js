import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  urunEkle, urunGuncelle, urunSil, hareketEkle, kritikStoklar,
  stokDegeri, urunleriSuz, hareketGecmisi, csvOlustur,
} from '../src/stok.js';

const dondur = (x) => {
  if (x && typeof x === 'object' && !Object.isFrozen(x)) {
    Object.freeze(x);
    Object.values(x).forEach(dondur);
  }
  return x;
};

const urun = (o = {}) => ({
  id: 1, ad: 'Kalem', sku: 'KLM-1', kategori: 'Kırtasiye', birim: 'adet',
  stok: 10, minStok: 5, alisFiyati: 2, satisFiyati: 4, ...o,
});
const alan = (o = {}) => ({
  ad: 'Defter', sku: 'DFT-1', kategori: 'Kırtasiye', birim: 'adet',
  stok: 3, minStok: 1, alisFiyati: 10, satisFiyati: 15, ...o,
});

// urunEkle
test('urunEkle: geçerli ürün yeni id ile yeni listeye eklenir, girdi değişmez', () => {
  const liste = dondur([urun()]);
  const s = urunEkle(liste, alan());
  assert.ok(Array.isArray(s));
  assert.equal(s.length, 2);
  assert.equal(liste.length, 1);
  const yeni = s[1];
  assert.equal(yeni.ad, 'Defter');
  assert.equal(yeni.sku, 'DFT-1');
  assert.notEqual(yeni.id, 1);
  assert.ok(yeni.id !== undefined);
});

test('urunEkle: boş ya da yalnız boşluk ad/SKU hata döndürür', () => {
  for (const o of [{ ad: '' }, { ad: '   ' }, { sku: '' }, { sku: '  ' }]) {
    const s = urunEkle([], alan(o));
    assert.equal(typeof s.hata, 'string', JSON.stringify(o));
    assert.ok(s.hata.length > 0);
  }
});

test('urunEkle: var olan SKU hata döndürür', () => {
  assert.equal(typeof urunEkle([urun()], alan({ sku: 'KLM-1' })).hata, 'string');
});

test('urunEkle: negatif fiyat ya da stok hata döndürür', () => {
  for (const o of [{ alisFiyati: -1 }, { satisFiyati: -1 }, { stok: -1 }]) {
    assert.equal(typeof urunEkle([], alan(o)).hata, 'string', JSON.stringify(o));
  }
});

test('urunEkle: sıfır fiyat/stok geçerlidir', () => {
  const s = urunEkle([], alan({ stok: 0, alisFiyati: 0, satisFiyati: 0 }));
  assert.ok(Array.isArray(s));
});

// urunGuncelle
test('urunGuncelle: değişikliği uygular, girdiyi değiştirmez', () => {
  const liste = dondur([urun(), urun({ id: 2, sku: 'B' })]);
  const s = urunGuncelle(liste, 1, { ad: 'Kurşun kalem', satisFiyati: 5 });
  assert.equal(s.find((u) => u.id === 1).ad, 'Kurşun kalem');
  assert.equal(s.find((u) => u.id === 1).satisFiyati, 5);
  assert.equal(s.find((u) => u.id === 1).sku, 'KLM-1');
  assert.equal(liste[0].ad, 'Kalem');
});

test('urunGuncelle: kendi SKU\'su serbest, başkasının SKU\'su hata', () => {
  const liste = [urun(), urun({ id: 2, sku: 'B' })];
  assert.ok(Array.isArray(urunGuncelle(liste, 1, { sku: 'KLM-1', ad: 'X' })));
  assert.equal(typeof urunGuncelle(liste, 1, { sku: 'B' }).hata, 'string');
});

test('urunGuncelle: boş ad, boş SKU, negatif değer hata; olmayan id hata', () => {
  const liste = [urun()];
  assert.equal(typeof urunGuncelle(liste, 1, { ad: ' ' }).hata, 'string');
  assert.equal(typeof urunGuncelle(liste, 1, { sku: '' }).hata, 'string');
  assert.equal(typeof urunGuncelle(liste, 1, { alisFiyati: -2 }).hata, 'string');
  assert.equal(typeof urunGuncelle(liste, 1, { stok: -2 }).hata, 'string');
  assert.equal(typeof urunGuncelle(liste, 99, { ad: 'X' }).hata, 'string');
});

// urunSil
test('urunSil: hareketi olmayan ürün silinir, girdi değişmez', () => {
  const liste = dondur([urun(), urun({ id: 2, sku: 'B' })]);
  const s = urunSil(liste, dondur([]), 1);
  assert.deepEqual(s.map((u) => u.id), [2]);
  assert.equal(liste.length, 2);
});

test('urunSil: hareketi olan ürün silinemez; olmayan id hata', () => {
  const liste = [urun()];
  const har = [{ id: 1, urunId: 1, tur: 'giris', miktar: 1, aciklama: '', tarih: 1 }];
  assert.equal(typeof urunSil(liste, har, 1).hata, 'string');
  assert.equal(typeof urunSil(liste, [], 42).hata, 'string');
});

// hareketEkle
const hareket = (tur, miktar, o = {}) => ({ urunId: 1, tur, miktar, aciklama: 'not', ...o });

test('hareketEkle: giriş stoğu artırır, hareket id ve tarih alır', () => {
  const u = dondur([urun()]);
  const h = dondur([]);
  const s = hareketEkle(u, h, hareket('giris', 5));
  assert.equal(s.urunler[0].stok, 15);
  assert.equal(s.hareketler.length, 1);
  const k = s.hareketler[0];
  assert.equal(k.urunId, 1);
  assert.equal(k.tur, 'giris');
  assert.equal(k.miktar, 5);
  assert.equal(k.aciklama, 'not');
  assert.ok(k.id !== undefined);
  assert.equal(typeof k.tarih, 'number');
  assert.equal(u[0].stok, 10);
  assert.equal(h.length, 0);
});

test('hareketEkle: çıkış stoğu azaltır; tam stok kadar çıkış serbest', () => {
  assert.equal(hareketEkle([urun()], [], hareket('cikis', 4)).urunler[0].stok, 6);
  assert.equal(hareketEkle([urun()], [], hareket('cikis', 10)).urunler[0].stok, 0);
});

test('hareketEkle: stoktan fazla çıkış hata döner, stok negatife düşmez', () => {
  const s = hareketEkle([urun()], [], hareket('cikis', 11));
  assert.equal(typeof s.hata, 'string');
  assert.equal(s.urunler, undefined);
});

test('hareketEkle: düzeltme stoğu verilen değere eşitler (0 dahil)', () => {
  const s = hareketEkle([urun()], [], hareket('duzeltme', 3));
  assert.equal(s.urunler[0].stok, 3);
  assert.equal(s.hareketler[0].miktar, 3);
  assert.equal(hareketEkle([urun()], [], hareket('duzeltme', 0)).urunler[0].stok, 0);
});

test('hareketEkle: olmayan ürün, geçersiz tür ya da geçersiz miktar hata döner', () => {
  assert.equal(typeof hareketEkle([urun()], [], hareket('giris', 1, { urunId: 9 })).hata, 'string');
  assert.equal(typeof hareketEkle([urun()], [], hareket('iade', 1)).hata, 'string');
  assert.equal(typeof hareketEkle([urun()], [], hareket('giris', -1)).hata, 'string');
});

test('hareketEkle: iki hareket birikir ve id\'ler farklıdır', () => {
  const a = hareketEkle([urun()], [], hareket('giris', 5));
  const b = hareketEkle(a.urunler, a.hareketler, hareket('cikis', 3));
  assert.equal(b.urunler[0].stok, 12);
  assert.equal(b.hareketler.length, 2);
  assert.notEqual(b.hareketler[0].id, b.hareketler[1].id);
});

// kritik
test('kritikStoklar: stok <= minStok olanlar (eşitlik dahil)', () => {
  const liste = dondur([
    urun({ id: 1, stok: 4, minStok: 5 }),
    urun({ id: 2, stok: 5, minStok: 5 }),
    urun({ id: 3, stok: 6, minStok: 5 }),
  ]);
  assert.deepEqual(kritikStoklar(liste).map((u) => u.id), [1, 2]);
  assert.deepEqual(kritikStoklar([]), []);
});

// değer
test('stokDegeri: alış ve satış toplamları; boş listede 0', () => {
  const liste = dondur([
    urun({ stok: 10, alisFiyati: 2, satisFiyati: 3 }),
    urun({ id: 2, sku: 'B', stok: 5, alisFiyati: 10, satisFiyati: 20 }),
  ]);
  const d = stokDegeri(liste);
  const degerler = Object.values(d);
  assert.ok(degerler.includes(70), JSON.stringify(d));
  assert.ok(degerler.includes(130), JSON.stringify(d));
  const bos = stokDegeri([]);
  assert.ok(Object.values(bos).length >= 2);
  assert.ok(Object.values(bos).every((v) => v === 0));
});

// süz
const sl = dondur([
  urun({ id: 1, ad: 'Kalem', sku: 'KLM-1', kategori: 'A', stok: 1, minStok: 5 }),
  urun({ id: 2, ad: 'Defter', sku: 'DFT-1', kategori: 'A', stok: 50, minStok: 5 }),
  urun({ id: 3, ad: 'Çay', sku: 'CAY-9', kategori: 'B', stok: 2, minStok: 5 }),
]);
const idler = (l) => l.map((u) => u.id);

test('urunleriSuz: boş filtre tüm listeyi döndürür', () => {
  assert.deepEqual(idler(urunleriSuz(sl, {})), [1, 2, 3]);
  assert.deepEqual(idler(urunleriSuz(sl, { arama: '', kategori: '', sadeceKritik: false })), [1, 2, 3]);
});

test('urunleriSuz: arama ad ve SKU\'da büyük/küçük harf duyarsız', () => {
  assert.deepEqual(idler(urunleriSuz(sl, { arama: 'KALEM' })), [1]);
  assert.deepEqual(idler(urunleriSuz(sl, { arama: 'dft' })), [2]);
  assert.deepEqual(idler(urunleriSuz(sl, { arama: 'yok' })), []);
});

test('urunleriSuz: kategori ve sadeceKritik VE ile birleşir', () => {
  assert.deepEqual(idler(urunleriSuz(sl, { kategori: 'A' })), [1, 2]);
  assert.deepEqual(idler(urunleriSuz(sl, { sadeceKritik: true })), [1, 3]);
  assert.deepEqual(idler(urunleriSuz(sl, { kategori: 'A', sadeceKritik: true })), [1]);
  assert.deepEqual(idler(urunleriSuz(sl, { arama: 'a', kategori: 'B', sadeceKritik: true })), [3]);
});

// geçmiş
const hl = dondur([
  { id: 1, urunId: 1, tur: 'giris', miktar: 10, aciklama: 'a', tarih: 100 },
  { id: 2, urunId: 2, tur: 'giris', miktar: 99, aciklama: 'b', tarih: 150 },
  { id: 3, urunId: 1, tur: 'cikis', miktar: 4, aciklama: 'c', tarih: 200 },
  { id: 4, urunId: 1, tur: 'duzeltme', miktar: 20, aciklama: 'd', tarih: 300 },
  { id: 5, urunId: 1, tur: 'giris', miktar: 1, aciklama: 'e', tarih: 400 },
]);

test('hareketGecmisi: yalnız o ürün, yeniden eskiye', () => {
  assert.deepEqual(hareketGecmisi(hl, 1, {}).map((h) => h.id), [5, 4, 3, 1]);
  assert.deepEqual(hareketGecmisi(hl, 2).map((h) => h.id), [2]);
  assert.deepEqual(hareketGecmisi(hl, 77, {}), []);
});

test('hareketGecmisi: sonrasiStok tüm hareketler yürütülerek hesaplanır', () => {
  const g = hareketGecmisi(hl, 1, {});
  assert.deepEqual(g.map((h) => h.sonrasiStok), [21, 20, 6, 10]);
});

test('hareketGecmisi: girdi karışık sırada olsa da hesap tarih sırasına göre', () => {
  const karisik = dondur([hl[4], hl[2], hl[0], hl[3]]);
  assert.deepEqual(hareketGecmisi(karisik, 1, {}).map((h) => h.sonrasiStok), [21, 20, 6, 10]);
});

test('hareketGecmisi: tarih aralığı uçlar dahil; sonrasiStok değişmez', () => {
  const g = hareketGecmisi(hl, 1, { baslangic: 200, bitis: 300 });
  assert.deepEqual(g.map((h) => h.id), [4, 3]);
  assert.deepEqual(g.map((h) => h.sonrasiStok), [20, 6]);
  assert.deepEqual(hareketGecmisi(hl, 1, { baslangic: 300 }).map((h) => h.id), [5, 4]);
  assert.deepEqual(hareketGecmisi(hl, 1, { bitis: 100 }).map((h) => h.id), [1]);
});

test('hareketGecmisi: hareket nesnelerine sonrasiStok yazılmaz (girdi değişmez)', () => {
  hareketGecmisi(hl, 1, {});
  assert.equal('sonrasiStok' in hl[0], false);
});

// csv
test('csvOlustur: başlık satırı ve ürün başına bir satır', () => {
  const satirlar = csvOlustur([urun(), urun({ id: 2, sku: 'B' })]).trim().split(/\r?\n/);
  assert.equal(satirlar.length, 3);
  assert.match(satirlar[0], /ad/i);
  assert.match(satirlar[0], /sku/i);
  assert.match(satirlar[1], /Kalem/);
});

test('csvOlustur: boş listede yalnız başlık', () => {
  assert.equal(csvOlustur([]).trim().split(/\r?\n/).length, 1);
});

test('csvOlustur: virgül, tırnak ve satır sonu kaçırılır', () => {
  const c = csvOlustur(dondur([
    urun({ ad: 'A, B' }),
    urun({ id: 2, sku: 'B', ad: 'Is "x"' }),
    urun({ id: 3, sku: 'C', ad: 'satır\nsonu' }),
  ]));
  assert.ok(c.includes('"A, B"'));
  assert.ok(c.includes('"Is ""x"""'));
  assert.ok(c.includes('"satır\nsonu"'));
});
