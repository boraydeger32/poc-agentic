import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gorevEkle } from '../src/gorevler.js';

test('gorevEkle: başlığı olan görev listeye eklenir', () => {
  const sonuc = gorevEkle([], 'Süt al');
  assert.deepEqual(sonuc, [{ id: 1, baslik: 'Süt al' }]);
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
