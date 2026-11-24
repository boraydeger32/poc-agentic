// Arayüz. Mantık içermez: src/stok.js fonksiyonlarını çağırır ve sayfayı çizer.
import {
  urunEkle, urunGuncelle, hareketEkle, kritikStoklar, kritikMi, stokDegeri, urunleriSuz,
  hareketGecmisi, csvOlustur, paraBicimle, csvDosyaAdi, ayniGunMu, veriGecerliMi, BIRIMLER,
} from './stok.js';
import { ornekVeri } from './ornek.js';

const ANAHTAR = 'stok-takip-verisi';
let urunler = [];
let hareketler = [];
let siralama = { anahtar: null, ters: false };

const aramaEl = document.getElementById('arama');
const kategoriEl = document.getElementById('kategori');
const kritikEl = document.getElementById('sadece-kritik');
const govdeEl = document.getElementById('tablo-govde');
const baslikEl = document.getElementById('tablo-baslik');
const uyariEl = document.getElementById('uyari');
const modalEl = document.getElementById('modal');
const modalBaslikEl = document.getElementById('modal-baslik');
const modalIcerikEl = document.getElementById('modal-icerik');

const SUTUNLAR = [
  { anahtar: 'ad', etiket: 'Ad' },
  { anahtar: 'sku', etiket: 'SKU' },
  { anahtar: 'kategori', etiket: 'Kategori' },
  { anahtar: 'stok', etiket: 'Stok' },
  { anahtar: 'minStok', etiket: 'Min. stok' },
  { anahtar: 'alisFiyati', etiket: 'Alış fiyatı' },
  { anahtar: 'satisFiyati', etiket: 'Satış fiyatı' },
];

function yaz(tag, metin, sinif) {
  const e = document.createElement(tag);
  if (metin !== undefined) e.textContent = metin;
  if (sinif) e.className = sinif;
  return e;
}

function uyar(metin) {
  uyariEl.textContent = metin;
  uyariEl.hidden = !metin;
}

// ---- Kalıcılık ----
function kaydet() {
  try {
    localStorage.setItem(ANAHTAR, JSON.stringify({ urunler, hareketler }));
  } catch (e) {
    uyar('Veriler tarayıcıya kaydedilemedi.');
  }
}

function yukle() {
  let ham = null;
  try {
    ham = localStorage.getItem(ANAHTAR);
  } catch (e) {
    uyar('Kayıtlı veriye erişilemedi; boş başlatıldı.');
    return;
  }
  if (ham === null || ham === undefined) return;
  try {
    const veri = JSON.parse(ham);
    if (!veriGecerliMi(veri)) throw new Error('biçim');
    urunler = veri.urunler;
    hareketler = veri.hareketler;
  } catch (e) {
    urunler = [];
    hareketler = [];
    uyar('Kayıtlı veri bozuk olduğu için okunamadı; uygulama boş başladı.');
  }
}

// ---- Çizim ----
function kartlariCiz() {
  const simdi = Date.now();
  document.getElementById('ozet-urun').textContent = String(urunler.length);
  document.getElementById('ozet-deger').textContent = paraBicimle(stokDegeri(urunler).alis);
  document.getElementById('ozet-kritik').textContent = String(kritikStoklar(urunler).length);
  document.getElementById('ozet-hareket').textContent = String(hareketler.filter((h) => ayniGunMu(h.tarih, simdi)).length);
}

function kategorileriCiz() {
  const secili = kategoriEl.value;
  const kategoriler = [...new Set(urunler.map((u) => u.kategori).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'tr'));
  kategoriEl.replaceChildren();
  const hepsi = yaz('option', 'Tüm kategoriler');
  hepsi.value = '';
  kategoriEl.append(hepsi);
  for (const k of kategoriler) {
    const o = yaz('option', k);
    o.value = k;
    kategoriEl.append(o);
  }
  kategoriEl.value = kategoriler.includes(secili) ? secili : '';
}

function basliklariCiz() {
  baslikEl.replaceChildren();
  for (const s of SUTUNLAR) {
    const th = yaz('th', s.etiket);
    th.className = 'siralanabilir';
    if (siralama.anahtar === s.anahtar) th.textContent = `${s.etiket} ${siralama.ters ? '▼' : '▲'}`;
    th.addEventListener('click', () => {
      siralama = siralama.anahtar === s.anahtar
        ? { anahtar: s.anahtar, ters: !siralama.ters }
        : { anahtar: s.anahtar, ters: false };
      ciz();
    });
    baslikEl.append(th);
  }
  baslikEl.append(yaz('th', 'İşlemler'));
}

function sirala(liste) {
  if (!siralama.anahtar) return liste;
  const k = siralama.anahtar;
  const y = siralama.ters ? -1 : 1;
  return [...liste].sort((a, b) => (typeof a[k] === 'number'
    ? a[k] - b[k]
    : String(a[k]).localeCompare(String(b[k]), 'tr')) * y);
}

function satirCiz(u) {
  const tr = yaz('tr');
  if (kritikMi(u)) tr.classList.add('kritik');
  const hucre = (etiket, metin) => {
    const td = yaz('td', metin);
    td.setAttribute('data-label', etiket);
    return td;
  };
  const adTd = hucre('Ad', u.ad);
  if (kritikMi(u)) adTd.append(' ', yaz('span', 'Kritik', 'rozet'));
  tr.append(
    adTd,
    hucre('SKU', u.sku),
    hucre('Kategori', u.kategori),
    hucre('Stok', `${u.stok} ${u.birim}`),
    hucre('Min. stok', String(u.minStok)),
    hucre('Alış fiyatı', paraBicimle(u.alisFiyati)),
    hucre('Satış fiyatı', paraBicimle(u.satisFiyati)),
  );
  const islem = yaz('td', undefined, 'islemler');
  const dugme = (metin, fn) => {
    const b = yaz('button', metin);
    b.type = 'button';
    b.addEventListener('click', fn);
    return b;
  };
  islem.append(
    dugme('Giriş', () => hareketPenceresi(u.id, 'giris')),
    dugme('Çıkış', () => hareketPenceresi(u.id, 'cikis')),
    dugme('Düzenle', () => urunPenceresi(u.id)),
    dugme('Geçmiş', () => gecmisPenceresi(u.id)),
  );
  tr.append(islem);
  return tr;
}

function ciz() {
  kartlariCiz();
  kategorileriCiz();
  basliklariCiz();
  const liste = sirala(urunleriSuz(urunler, {
    arama: aramaEl.value, kategori: kategoriEl.value, sadeceKritik: kritikEl.checked,
  }));
  govdeEl.replaceChildren(...liste.map(satirCiz));
  document.getElementById('bos').hidden = liste.length > 0;
  document.getElementById('ornek-veri').hidden = urunler.length > 0 || hareketler.length > 0;
}

// ---- Pencereler ----
function pencereAc(baslik) {
  modalBaslikEl.textContent = baslik;
  modalIcerikEl.replaceChildren();
  if (typeof modalEl.showModal === 'function') {
    if (!modalEl.open) modalEl.showModal();
  } else modalEl.setAttribute('open', '');
}

function pencereKapat() {
  if (typeof modalEl.close === 'function') modalEl.close();
  else modalEl.removeAttribute('open');
}

function alan(etiket, girdi) {
  const kap = yaz('div', undefined, 'alan');
  const l = yaz('label', etiket);
  l.append(girdi);
  const hata = yaz('div', '', 'hata');
  hata.setAttribute('role', 'alert');
  kap.append(l, hata);
  return { kap, hata };
}

function girdiYap(ad, tip, deger) {
  const i = yaz('input');
  i.name = ad;
  i.type = tip;
  if (tip === 'number') { i.min = '0'; i.step = 'any'; }
  i.value = deger === undefined ? '' : String(deger);
  return i;
}

function sayi(girdi) {
  const m = girdi.value.trim().replace(',', '.');
  return m === '' ? NaN : Number(m);
}

function hataAlani(hata) {
  if (/^Ad /.test(hata)) return 'ad';
  if (/SKU/.test(hata)) return 'sku';
  if (/^Birim/.test(hata)) return 'birim';
  if (/^Min/.test(hata)) return 'minStok';
  if (/^Stok/.test(hata)) return 'stok';
  if (/^Alış/.test(hata)) return 'alisFiyati';
  if (/^Satış/.test(hata)) return 'satisFiyati';
  return null;
}

function urunPenceresi(id) {
  const mevcut = urunler.find((u) => u.id === id);
  pencereAc(mevcut ? 'Ürünü düzenle' : 'Yeni ürün');
  const v = mevcut || { ad: '', sku: '', kategori: '', birim: 'adet', stok: 0, minStok: 0, alisFiyati: 0, satisFiyati: 0 };
  const form = yaz('form');
  const girdiler = {
    ad: girdiYap('ad', 'text', v.ad),
    sku: girdiYap('sku', 'text', v.sku),
    kategori: girdiYap('kategori', 'text', v.kategori),
    birim: yaz('select'),
    stok: girdiYap('stok', 'number', v.stok),
    minStok: girdiYap('minStok', 'number', v.minStok),
    alisFiyati: girdiYap('alisFiyati', 'number', v.alisFiyati),
    satisFiyati: girdiYap('satisFiyati', 'number', v.satisFiyati),
  };
  for (const b of BIRIMLER) {
    const o = yaz('option', b);
    o.value = b;
    girdiler.birim.append(o);
  }
  girdiler.birim.value = v.birim;
  const etiketler = {
    ad: 'Ad', sku: 'SKU', kategori: 'Kategori', birim: 'Birim', stok: 'Stok',
    minStok: 'Min. stok', alisFiyati: 'Alış fiyatı', satisFiyati: 'Satış fiyatı',
  };
  const hatalar = {};
  for (const k of Object.keys(girdiler)) {
    if (k === 'stok' && mevcut) continue; // mevcut ürünün stoğu hareketle değişir
    const a = alan(etiketler[k], girdiler[k]);
    hatalar[k] = a.hata;
    form.append(a.kap);
  }
  const genel = yaz('div', '', 'hata');
  const kaydetBtn = yaz('button', 'Kaydet');
  kaydetBtn.type = 'submit';
  const iptal = yaz('button', 'İptal');
  iptal.type = 'button';
  iptal.addEventListener('click', pencereKapat);
  form.append(genel, yaz('div', undefined, 'dugmeler'));
  form.lastChild.append(kaydetBtn, iptal);
  form.addEventListener('submit', (olay) => {
    olay.preventDefault();
    for (const h of Object.values(hatalar)) h.textContent = '';
    genel.textContent = '';
    const alanlar = {
      ad: girdiler.ad.value, sku: girdiler.sku.value, kategori: girdiler.kategori.value,
      birim: girdiler.birim.value, minStok: sayi(girdiler.minStok),
      alisFiyati: sayi(girdiler.alisFiyati), satisFiyati: sayi(girdiler.satisFiyati),
    };
    if (!mevcut) alanlar.stok = sayi(girdiler.stok);
    const sonuc = mevcut ? urunGuncelle(urunler, id, alanlar) : urunEkle(urunler, alanlar);
    if (sonuc.hata) {
      (hatalar[hataAlani(sonuc.hata)] || genel).textContent = sonuc.hata;
      return;
    }
    urunler = sonuc;
    kaydet();
    pencereKapat();
    ciz();
  });
  modalIcerikEl.append(form);
}

function hareketPenceresi(id, tur) {
  const urun = urunler.find((u) => u.id === id);
  if (!urun) return;
  pencereAc(`${urun.ad}: ${tur === 'giris' ? 'Stok girişi' : 'Stok çıkışı'}`);
  const form = yaz('form');
  const miktar = girdiYap('miktar', 'number', '');
  const aciklama = girdiYap('aciklama', 'text', '');
  const m = alan(`Miktar (${urun.birim}) — mevcut stok: ${urun.stok}`, miktar);
  const a = alan('Açıklama', aciklama);
  const kaydetBtn = yaz('button', 'Kaydet');
  kaydetBtn.type = 'submit';
  const iptal = yaz('button', 'İptal');
  iptal.type = 'button';
  iptal.addEventListener('click', pencereKapat);
  const dugmeler = yaz('div', undefined, 'dugmeler');
  dugmeler.append(kaydetBtn, iptal);
  form.append(m.kap, a.kap, dugmeler);
  form.addEventListener('submit', (olay) => {
    olay.preventDefault();
    m.hata.textContent = '';
    const q = sayi(miktar);
    if (!(q > 0)) {
      m.hata.textContent = 'Miktar sıfırdan büyük bir sayı olmalı.';
      return;
    }
    const sonuc = hareketEkle(urunler, hareketler, { urunId: id, tur, miktar: q, aciklama: aciklama.value.trim() });
    if (sonuc.hata) {
      m.hata.textContent = sonuc.hata === 'Stok yetersiz.' ? `Stok yetersiz: mevcut stok ${urun.stok} ${urun.birim}.` : sonuc.hata;
      return;
    }
    urunler = sonuc.urunler;
    hareketler = sonuc.hareketler;
    kaydet();
    pencereKapat();
    ciz();
  });
  modalIcerikEl.append(form);
}

const TUR_ETIKET = { giris: 'Giriş', cikis: 'Çıkış', duzeltme: 'Düzeltme' };

function gecmisPenceresi(id) {
  const urun = urunler.find((u) => u.id === id);
  if (!urun) return;
  pencereAc(`${urun.ad}: Hareket geçmişi`);
  const kayitlar = hareketGecmisi(hareketler, id, {});
  if (kayitlar.length === 0) {
    modalIcerikEl.append(yaz('p', 'Bu ürün için hareket yok.'));
  } else {
    const tablo = yaz('table', undefined, 'gecmis');
    const ust = yaz('tr');
    for (const b of ['Tarih', 'Tür', 'Miktar', 'Açıklama', 'Sonrası stok']) ust.append(yaz('th', b));
    tablo.append(ust);
    for (const h of kayitlar) {
      const tr = yaz('tr');
      tr.append(
        yaz('td', new Date(h.tarih).toLocaleString('tr-TR')),
        yaz('td', TUR_ETIKET[h.tur] || h.tur),
        yaz('td', `${h.miktar} ${urun.birim}`),
        yaz('td', h.aciklama),
        yaz('td', `${h.sonrasiStok} ${urun.birim}`),
      );
      tablo.append(tr);
    }
    modalIcerikEl.append(tablo);
  }
  const kapat = yaz('button', 'Kapat');
  kapat.type = 'button';
  kapat.addEventListener('click', pencereKapat);
  modalIcerikEl.append(kapat);
}

// ---- Olaylar ----
aramaEl.addEventListener('input', ciz);
kategoriEl.addEventListener('change', ciz);
kritikEl.addEventListener('change', ciz);
document.getElementById('yeni-urun').addEventListener('click', () => urunPenceresi(null));

document.getElementById('ornek-veri').addEventListener('click', () => {
  const veri = ornekVeri();
  urunler = veri.urunler;
  hareketler = veri.hareketler;
  uyar('');
  kaydet();
  ciz();
});

document.getElementById('csv-indir').addEventListener('click', () => {
  const blob = new Blob(['﻿', csvOlustur(urunler)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = csvDosyaAdi(new Date()); // stok-AAAA-GG-AA.csv
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

yukle();
ciz();
