// Örnek veri: hareketler ürün stoklarıyla tutarlıdır (0'dan yürütülünce stoğa ulaşır).
import { hareketEkle } from './stok.js';

const URUNLER = [
  { ad: 'Kurşun kalem', sku: 'KLM-001', kategori: 'Kırtasiye', birim: 'adet', minStok: 20, alisFiyati: 3.5, satisFiyati: 6 },
  { ad: 'A4 kâğıt', sku: 'KGT-A4', kategori: 'Kırtasiye', birim: 'kutu', minStok: 10, alisFiyati: 180, satisFiyati: 240 },
  { ad: 'Çay', sku: 'CAY-001', kategori: 'Gıda', birim: 'kg', minStok: 15, alisFiyati: 220, satisFiyati: 290 },
  { ad: 'Şeker', sku: 'SKR-001', kategori: 'Gıda', birim: 'kg', minStok: 25, alisFiyati: 38, satisFiyati: 52 },
  { ad: 'Zeytinyağı', sku: 'ZYT-001', kategori: 'Gıda', birim: 'lt', minStok: 10, alisFiyati: 260, satisFiyati: 340 },
  { ad: 'Sıvı sabun', sku: 'SBN-001', kategori: 'Temizlik', birim: 'lt', minStok: 12, alisFiyati: 45, satisFiyati: 70 },
  { ad: 'Çöp poşeti', sku: 'CPS-001', kategori: 'Temizlik', birim: 'kutu', minStok: 8, alisFiyati: 30, satisFiyati: 48 },
  { ad: 'Pil AA', sku: 'PIL-AA', kategori: 'Elektronik', birim: 'adet', minStok: 30, alisFiyati: 9, satisFiyati: 15 },
];

// [ürün sırası, tür, miktar, açıklama, kaç gün önce]
const HAREKETLER = [
  [0, 'giris', 100, 'İlk alım', 20], [0, 'cikis', 60, 'Satış', 5],
  [1, 'giris', 30, 'İlk alım', 18], [1, 'cikis', 24, 'Satış', 3],
  [2, 'giris', 50, 'İlk alım', 15], [2, 'cikis', 20, 'Satış', 2],
  [3, 'giris', 80, 'İlk alım', 14], [3, 'cikis', 10, 'Satış', 1],
  [4, 'giris', 40, 'İlk alım', 12], [4, 'duzeltme', 35, 'Sayım farkı', 4],
  [5, 'giris', 25, 'İlk alım', 10], [5, 'cikis', 5, 'Satış', 0],
  [6, 'giris', 20, 'İlk alım', 9],
  [7, 'giris', 200, 'İlk alım', 8], [7, 'cikis', 150, 'Satış', 0],
];

export function ornekVeri(simdi = Date.now()) {
  let urunler = URUNLER.map((u, i) => ({ ...u, id: i + 1, stok: 0 }));
  let hareketler = [];
  const gun = 86400000;
  for (const [i, tur, miktar, aciklama, once] of HAREKETLER) {
    const s = hareketEkle(urunler, hareketler, {
      urunId: i + 1, tur, miktar, aciklama, tarih: simdi - once * gun - (HAREKETLER.length - hareketler.length) * 1000,
    });
    urunler = s.urunler;
    hareketler = s.hareketler;
  }
  return { urunler, hareketler };
}
