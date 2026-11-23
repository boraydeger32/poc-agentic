import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gorevEkle, tamamlanmaDegistir } from '../src/gorevler.js';

test('gorevEkle: başlığı olan görev tamamlandi:false ile listeye eklenir', () => {
  const sonuc = gorevEkle([], 'Süt al');
  assert.deepEqual(sonuc, [{ id: 1, baslik: 'Süt al', tamamlandi: false }]);
});

test('gorevEkle: boş ya da yalnız boşluk olan başlık eklenmez', () => {
  assert.deepEqual(gorevEkle([], ''), []);
  assert.deepEqual(gorevEkle([], '   '), []);
});

test('gorevEkle: başlığın başındaki ve sonundaki boşluk atılır', () => {
  assert.equal(gorevEkle([], '  Ekmek  ')[0].baslik, 'Ekmek');
});

test('gorevEkle: kimlikler artarak verilir ve girdi listesi değişmez', () => {
  const ilk = gorevEkle([], 'Bir');
  const ikinci = gorevEkle(ilk, 'İki');
  assert.equal(ikinci[1].id, 2);
  assert.equal(ilk.length, 1);
});

const ornek = () => [
  { id: 1, baslik: 'Bir', tamamlandi: false },
  { id: 2, baslik: 'İki', tamamlandi: true },
  { id: 3, baslik: 'Üç', tamamlandi: false },
];

test('tamamlanmaDegistir: tamamlanmamış görev tamamlandı olur', () => {
  assert.equal(tamamlanmaDegistir(ornek(), 1)[0].tamamlandi, true);
});

test('tamamlanmaDegistir: tamamlanmış görev tekrar çağrılınca false olur', () => {
  assert.equal(tamamlanmaDegistir(ornek(), 2)[1].tamamlandi, false);
});

test('tamamlanmaDegistir: iki çağrı görevi ilk haline döndürür', () => {
  const sonuc = tamamlanmaDegistir(tamamlanmaDegistir(ornek(), 1), 1);
  assert.deepEqual(sonuc, ornek());
});

test('tamamlanmaDegistir: yalnız hedef görev değişir, sıra ve id/baslik korunur', () => {
  assert.deepEqual(tamamlanmaDegistir(ornek(), 3), [
    { id: 1, baslik: 'Bir', tamamlandi: false },
    { id: 2, baslik: 'İki', tamamlandi: true },
    { id: 3, baslik: 'Üç', tamamlandi: true },
  ]);
});

test('tamamlanmaDegistir: girdi liste ve nesneler değişmez, yeni liste döner', () => {
  const donmus = Object.freeze(ornek().map((g) => Object.freeze({ ...g })));
  const sonuc = tamamlanmaDegistir(donmus, 1);
  assert.notEqual(sonuc, donmus);
  assert.notEqual(sonuc[0], donmus[0]);
  assert.deepEqual(donmus, ornek());
});

test('tamamlanmaDegistir: olmayan id içeriği aynı listeyi döndürür, hata fırlatmaz', () => {
  assert.deepEqual(tamamlanmaDegistir(ornek(), 99), ornek());
});

test('tamamlanmaDegistir: boş listede hata fırlatmaz', () => {
  assert.deepEqual(tamamlanmaDegistir([], 1), []);
});
