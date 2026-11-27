// Arayüz. Mantık içermez: src/stok.js fonksiyonlarını çağırır ve sayfayı çizer.
import {
  urunEkle, urunGuncelle, hareketEkle, kritikStoklar, kritikMi, stokDegeri, urunleriSuz,
  hareketGecmisi, csvOlustur, paraBicimle, csvDosyaAdi, ayniGunMu, veriGecerliMi, BIRIMLER,
  tarihBicimle, turEtiketi, TURLER, modulCozumle, ozetHesapla, hareketleriSuz, urunAdiBul,
  kritikRozetSayisi, onayliDegistir, veriVarMi, hareketBosMetni,
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
  { anahtar: 'stok', etiket: 'Stok', sayi: true },
  { anahtar: 'minStok', etiket: 'Min. stok', sayi: true },
  { anahtar: 'alisFiyati', etiket: 'Alış fiyatı', sayi: true },
  { anahtar: 'satisFiyati', etiket: 'Satış fiyatı', sayi: true },
];

let bildirimZamanlayici = null;
function bildirimGoster(metin) {
  const el = document.getElementById('bildirim');
  el.textContent = metin;
  el.hidden = false;
  clearTimeout(bildirimZamanlayici);
  bildirimZamanlayici = setTimeout(() => { el.hidden = true; }, 3000);
}

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
function hareketSatiri(h) {
  const tr = yaz('tr');
  tr.append(
    yaz('td', tarihBicimle(h.tarih)),
    yaz('td', h.urunAd),
    yaz('td', turEtiketi(h.tur)),
    yaz('td', String(h.miktar)),
    yaz('td', h.aciklama),
  );
  return tr;
}

function kartlariCiz() {
  const o = ozetHesapla(urunler, hareketler);
  document.getElementById('ozet-urun').textContent = String(o.urunSayisi);
  document.getElementById('ozet-stok').textContent = String(o.toplamStok);
  document.getElementById('ozet-kritik').textContent = String(o.kritikSayisi);
  document.getElementById('kart-kritik').classList.toggle('vurgu', o.kritikSayisi > 0);
  const son = o.sonHareketler.map((h) => ({ ...h, urunAd: urunAdiBul(urunler, h.urunId) }));
  document.getElementById('ozet-deger').textContent = paraBicimle(stokDegeri(urunler).alis);
  document.getElementById('ozet-hareket').textContent = String(hareketler.filter((h) => ayniGunMu(h.tarih, Date.now())).length);
  document.getElementById('ozet-son-hareketler').replaceChildren(...son.map(hareketSatiri));
  document.getElementById('ozet-bos').hidden = son.length > 0;
}

function rozetCiz() {
  const n = kritikRozetSayisi(urunler);
  const rozet = document.getElementById('rozet-kritik');
  rozet.textContent = String(n);
  rozet.hidden = n === 0;
  const baglanti = document.querySelector('.kenar-baglanti[data-modul="kritik"]');
  baglanti.setAttribute('aria-label', n > 0 ? `Kritik stok, ${n} kritik ürün` : 'Kritik stok');
}

const TUR_SECENEKLERI = [['', 'Tüm türler'], ...TURLER.map((t) => [t, turEtiketi(t)])];
function hareketSuzgecCiz() {
  const urunEl = document.getElementById('hareket-urun');
  const turEl = document.getElementById('hareket-tur');
  const seciliUrun = urunEl.value;
  const seciliTur = turEl.value;
  urunEl.replaceChildren();
  const hepsi = yaz('option', 'Tüm ürünler');
  hepsi.value = '';
  urunEl.append(hepsi);
  for (const u of urunler) {
    const o = yaz('option', u.ad);
    o.value = String(u.id);
    urunEl.append(o);
  }
  urunEl.value = urunler.some((u) => String(u.id) === seciliUrun) ? seciliUrun : '';
  if (turEl.options.length === 0) {
    for (const [d, e] of TUR_SECENEKLERI) {
      const o = yaz('option', e);
      o.value = d;
      turEl.append(o);
    }
  }
  turEl.value = seciliTur;
  const liste = hareketleriSuz(urunler, hareketler, { urunId: urunEl.value, tur: turEl.value });
  document.getElementById('hareket-govde').replaceChildren(...liste.map(hareketSatiri));
  const bosMetin = hareketBosMetni(hareketler.length, liste.length);
  document.getElementById('hareket-bos-metin').textContent = bosMetin;
  document.getElementById('hareket-bos').hidden = liste.length > 0;
  document.getElementById('hareket-tablo').hidden = liste.length === 0;
}

function kritikModuluCiz() {
  const liste = kritikStoklar(urunler);
  const satirlar = liste.map((u) => {
    const tr = yaz('tr', undefined, 'kritik');
    const islem = yaz('td', undefined, 'islemler');
    const b = yaz('button', 'Giriş', 'dugme dugme-kucuk dugme-giris');
    b.type = 'button';
    b.setAttribute('aria-label', `${u.ad}: Giriş`);
    b.addEventListener('click', () => hareketPenceresi(u.id, 'giris'));
    islem.append(b);
    tr.append(yaz('td', u.ad), yaz('td', u.sku), yaz('td', `${u.stok} ${u.birim}`), yaz('td', String(u.minStok)), islem);
    return tr;
  });
  document.getElementById('kritik-govde').replaceChildren(...satirlar);
  document.getElementById('kritik-bos').hidden = liste.length > 0;
  document.getElementById('kritik-tablo').hidden = liste.length === 0;
}

// ---- Gezinme ----
let ilkGosterim = true;
function modulGoster() {
  const aktif = modulCozumle(location.hash);
  for (const s of document.querySelectorAll('section.modul')) s.hidden = s.dataset.modul !== aktif;
  for (const a of document.querySelectorAll('.kenar-baglanti')) {
    if (a.dataset.modul === aktif) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  menuAyarla(false);
  if (!ilkGosterim) {
    const baslik = document.getElementById(`baslik-${aktif}`);
    if (baslik) baslik.focus();
  }
  ilkGosterim = false;
}

function menuAyarla(acik) {
  document.body.classList.toggle('menu-acik', acik);
  document.getElementById('menu-dugme').setAttribute('aria-expanded', String(acik));
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
    const th = yaz('th', undefined, s.sayi ? 'siralanabilir sayi' : 'siralanabilir');
    th.setAttribute('scope', 'col');
    const aktif = siralama.anahtar === s.anahtar;
    th.setAttribute('aria-sort', aktif ? (siralama.ters ? 'descending' : 'ascending') : 'none');
    const dugme = document.createElement('button');
    dugme.textContent = aktif ? `${s.etiket} ${siralama.ters ? '▼' : '▲'}` : s.etiket;
    dugme.type = 'button';
    dugme.addEventListener('click', () => {
      siralama = siralama.anahtar === s.anahtar
        ? { anahtar: s.anahtar, ters: !siralama.ters }
        : { anahtar: s.anahtar, ters: false };
      ciz();
      const yeni = baslikEl.children[SUTUNLAR.indexOf(s)];
      if (yeni && yeni.firstChild && yeni.firstChild.focus) yeni.firstChild.focus();
    });
    dugme.addEventListener('keydown', (olay) => {
      if (olay.key === ' ' || olay.key === 'Enter') { olay.preventDefault(); dugme.click(); }
    });
    th.append(dugme);
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
  const hucre = (etiket, metin, sayiMi) => {
    const td = yaz('td', metin, sayiMi ? 'sayi' : undefined);
    td.setAttribute('data-label', etiket);
    return td;
  };
  const adTd = hucre('Ad', u.ad);
  if (kritikMi(u)) adTd.append(' ', yaz('span', 'Kritik', 'rozet'));
  tr.append(
    adTd,
    hucre('SKU', u.sku),
    hucre('Kategori', u.kategori),
    hucre('Stok', `${u.stok} ${u.birim}`, true),
    hucre('Min. stok', String(u.minStok), true),
    hucre('Alış fiyatı', paraBicimle(u.alisFiyati), true),
    hucre('Satış fiyatı', paraBicimle(u.satisFiyati), true),
  );
  const islem = yaz('td', undefined, 'islemler');
  const dugme = (metin, sinif, fn) => {
    const b = yaz('button', metin, `dugme dugme-kucuk ${sinif}`);
    b.type = 'button';
    b.setAttribute('aria-label', `${u.ad}: ${metin}`);
    b.addEventListener('click', fn);
    return b;
  };
  islem.append(
    dugme('Giriş', 'dugme-giris', () => hareketPenceresi(u.id, 'giris')),
    dugme('Çıkış', 'dugme-tehlike', () => hareketPenceresi(u.id, 'cikis')),
    dugme('Düzenle', 'dugme-duzenle', () => urunPenceresi(u.id)),
    dugme('Geçmiş', 'dugme-gecmis', () => gecmisPenceresi(u.id)),
  );
  tr.append(islem);
  return tr;
}

function ciz() {
  kartlariCiz();
  rozetCiz();
  hareketSuzgecCiz();
  kritikModuluCiz();
  kategorileriCiz();
  basliklariCiz();
  const liste = sirala(urunleriSuz(urunler, {
    arama: aramaEl.value, kategori: kategoriEl.value, sadeceKritik: kritikEl.checked,
  }));
  govdeEl.replaceChildren(...liste.map(satirCiz));
  document.getElementById('bos').hidden = liste.length > 0;
  const veriYok = urunler.length === 0 && hareketler.length === 0;
  document.getElementById('ornek-veri').hidden = !veriYok;
  if (liste.length === 0) {
    document.getElementById('bos-baslik').textContent = urunler.length === 0 ? 'Henüz ürün yok' : 'Sonuç bulunamadı';
    document.getElementById('bos-metin').textContent = urunler.length === 0
      ? 'İlk ürününüzü ekleyin ya da örnek verilerle başlayın.'
      : 'Aramanıza uygun ürün bulunamadı. Filtreleri değiştirmeyi deneyin.';
  }
}

// ---- Pencereler ----
function pencereAc(baslik) {
  modalBaslikEl.textContent = baslik;
  modalIcerikEl.replaceChildren();
  if (typeof modalEl.showModal === 'function') {
    if (!modalEl.open) modalEl.showModal();
  } else modalEl.setAttribute('open', '');
}

// İçerik eklendikten sonra çağrılır: ilk alana (yoksa ilk düğmeye) odak verir.
function ilkAlanaOdak() {
  const hedef = modalIcerikEl.querySelector('input, select, button');
  if (hedef && typeof hedef.focus === 'function') hedef.focus();
}

function pencereKapat() {
  if (typeof modalEl.close === 'function') modalEl.close();
  else modalEl.removeAttribute('open');
}

let alanSayaci = 0;
function alan(etiket, girdi, zorunlu) {
  alanSayaci += 1;
  const kap = yaz('div', undefined, 'alan');
  const l = yaz('label', etiket);
  girdi.id = `alan-${alanSayaci}`;
  l.setAttribute('for', girdi.id);
  if (zorunlu) {
    girdi.required = true;
    girdi.setAttribute('aria-required', 'true');
    l.append(yaz('span', '*', 'zorunlu'));
  }
  const hata = yaz('div', '', 'hata');
  hata.id = `hata-${alanSayaci}`;
  hata.setAttribute('role', 'alert');
  girdi.setAttribute('aria-describedby', hata.id);
  kap.append(l, girdi, hata);
  return { kap, hata, girdi };
}

function hataYaz(a, metin) {
  a.hata.textContent = metin;
  if (metin) a.girdi.setAttribute('aria-invalid', 'true');
  else a.girdi.removeAttribute('aria-invalid');
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
  form.noValidate = true;
  form.setAttribute('novalidate', '');
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
    const a = alan(etiketler[k], girdiler[k], k === 'ad' || k === 'sku');
    hatalar[k] = a;
    form.append(a.kap);
  }
  const genel = yaz('div', '', 'hata');
  const kaydetBtn = yaz('button', 'Kaydet', 'dugme dugme-birincil');
  kaydetBtn.type = 'submit';
  const iptal = yaz('button', 'İptal', 'dugme dugme-ikincil');
  iptal.type = 'button';
  iptal.addEventListener('click', pencereKapat);
  form.append(genel, yaz('div', undefined, 'dugmeler'));
  form.lastChild.append(kaydetBtn, iptal);
  form.addEventListener('submit', (olay) => {
    olay.preventDefault();
    for (const h of Object.values(hatalar)) hataYaz(h, '');
    genel.textContent = '';
    const alanlar = {
      ad: girdiler.ad.value, sku: girdiler.sku.value, kategori: girdiler.kategori.value,
      birim: girdiler.birim.value, minStok: sayi(girdiler.minStok),
      alisFiyati: sayi(girdiler.alisFiyati), satisFiyati: sayi(girdiler.satisFiyati),
    };
    if (!mevcut) alanlar.stok = sayi(girdiler.stok);
    const sonuc = mevcut ? urunGuncelle(urunler, id, alanlar) : urunEkle(urunler, alanlar);
    if (sonuc.hata) {
      const hedef = hatalar[hataAlani(sonuc.hata)];
      if (hedef) { hataYaz(hedef, sonuc.hata); hedef.girdi.focus(); } else genel.textContent = sonuc.hata;
      return;
    }
    urunler = sonuc;
    kaydet();
    pencereKapat();
    ciz();
    bildirimGoster(mevcut ? 'Ürün güncellendi.' : 'Ürün eklendi.');
  });
  modalIcerikEl.append(form);
  ilkAlanaOdak();
}

function hareketPenceresi(id, tur) {
  const urun = urunler.find((u) => u.id === id);
  if (!urun) return;
  pencereAc(`${urun.ad}: ${tur === 'giris' ? 'Stok girişi' : 'Stok çıkışı'}`);
  const form = yaz('form');
  form.noValidate = true;
  form.setAttribute('novalidate', '');
  const miktar = girdiYap('miktar', 'number', '');
  const aciklama = girdiYap('aciklama', 'text', '');
  const bilgi = yaz('p', `${urun.ad} — mevcut stok: ${urun.stok} ${urun.birim}`, 'modal-bilgi');
  const m = alan(`Miktar (${urun.birim})`, miktar, true);
  const a = alan('Açıklama', aciklama);
  const kaydetBtn = yaz('button', 'Kaydet', 'dugme dugme-birincil');
  kaydetBtn.type = 'submit';
  const iptal = yaz('button', 'İptal', 'dugme dugme-ikincil');
  iptal.type = 'button';
  iptal.addEventListener('click', pencereKapat);
  const dugmeler = yaz('div', undefined, 'dugmeler');
  dugmeler.append(kaydetBtn, iptal);
  form.append(bilgi, m.kap, a.kap, dugmeler);
  form.addEventListener('submit', (olay) => {
    olay.preventDefault();
    hataYaz(m, '');
    const q = sayi(miktar);
    if (!(q > 0)) {
      hataYaz(m, 'Miktar sıfırdan büyük bir sayı olmalı.');
      return;
    }
    const sonuc = hareketEkle(urunler, hareketler, { urunId: id, tur, miktar: q, aciklama: aciklama.value.trim() });
    if (sonuc.hata) {
      hataYaz(m, sonuc.hata === 'Stok yetersiz.' ? `Stok yetersiz: mevcut stok ${urun.stok} ${urun.birim}.` : sonuc.hata);
      return;
    }
    urunler = sonuc.urunler;
    hareketler = sonuc.hareketler;
    kaydet();
    pencereKapat();
    ciz();
    bildirimGoster(tur === 'giris' ? 'Stok girişi kaydedildi.' : 'Stok çıkışı kaydedildi.');
  });
  modalIcerikEl.append(form);
  ilkAlanaOdak();
}

function gecmisPenceresi(id) {
  const urun = urunler.find((u) => u.id === id);
  if (!urun) return;
  pencereAc(`${urun.ad}: Hareket geçmişi`);
  const kayitlar = hareketGecmisi(hareketler, id, { guncelStok: urun.stok });
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
        yaz('td', tarihBicimle(h.tarih)),
        yaz('td', turEtiketi(h.tur)),
        yaz('td', `${h.miktar} ${urun.birim}`),
        yaz('td', h.aciklama),
        yaz('td', `${h.sonrasiStok} ${urun.birim}`),
      );
      tablo.append(tr);
    }
    modalIcerikEl.append(tablo);
  }
  const kapat = yaz('button', 'Kapat', 'dugme dugme-ikincil');
  kapat.type = 'button';
  kapat.addEventListener('click', pencereKapat);
  const alt = yaz('div', undefined, 'dugmeler');
  alt.append(kapat);
  modalIcerikEl.append(alt);
  kapat.focus();
}

// ---- Olaylar ----
aramaEl.addEventListener('input', ciz);
kategoriEl.addEventListener('change', ciz);
kritikEl.addEventListener('change', ciz);
document.getElementById('yeni-urun').addEventListener('click', () => urunPenceresi(null));
document.getElementById('modal-kapat').addEventListener('click', pencereKapat);
// Esc, <dialog>'un yerleşik cancel/close davranışıyla pencereyi kapatır.
// Dışarı (arka plana) tıklayınca da kapat.
modalEl.addEventListener('click', (olay) => { if (olay.target === modalEl) pencereKapat(); });

function ornekUygula(onaylandi) {
  const sonuc = onayliDegistir({ urunler, hareketler }, ornekVeri(), onaylandi);
  urunler = sonuc.urunler;
  hareketler = sonuc.hareketler;
  uyar('');
  kaydet();
  ciz();
  bildirimGoster('Örnek veriler yüklendi.');
}
function ornekYukle() {
  // Dolu veri varsa onaysız üzerine yazılmaz.
  if (!veriVarMi(urunler, hareketler)) { ornekUygula(true); return; }
  silOnayiconfirm(
    () => ornekUygula(true),
    'Örnek verileri yükle',
    'Mevcut ürünler ve stok hareketleri örnek veriyle değiştirilecek. Bu işlem geri alınamaz. Devam edilsin mi?',
    'Evet, yükle',
  );
}
document.getElementById('ornek-veri').addEventListener('click', ornekYukle);
document.getElementById('ayar-ornek').addEventListener('click', ornekYukle);

// Sayfa içi onay penceresi (tarayıcının yerleşik onay kutusu kullanılmaz).
function silOnayiconfirm(
  onaylaninca,
  baslik = 'Bütün veriyi sil',
  metin = 'Bütün ürünler ve stok hareketleri silinecek. Bu işlem geri alınamaz. Devam edilsin mi?',
  etiket = 'Evet, sil',
) {
  pencereAc(baslik);
  modalIcerikEl.append(yaz('p', metin));
  const sil = yaz('button', etiket, 'dugme dugme-tehlike');
  sil.type = 'button';
  const vazgec = yaz('button', 'Vazgeç', 'dugme dugme-ikincil');
  vazgec.type = 'button';
  vazgec.addEventListener('click', pencereKapat);
  sil.addEventListener('click', () => { pencereKapat(); onaylaninca(); });
  const alt = yaz('div', undefined, 'dugmeler');
  alt.append(vazgec, sil);
  modalIcerikEl.append(alt);
  vazgec.focus();
}

document.getElementById('ayar-sil').addEventListener('click', () => {
  silOnayiconfirm(() => {
    urunler = [];
    hareketler = [];
    kaydet();
    ciz();
    bildirimGoster('Bütün veri silindi.');
  });
});

document.getElementById('hareket-urun').addEventListener('change', ciz);
document.getElementById('hareket-tur').addEventListener('change', ciz);
document.getElementById('menu-dugme').addEventListener('click', () => {
  menuAyarla(!document.body.classList.contains('menu-acik'));
});
document.addEventListener('keydown', (olay) => {
  if (olay.key === 'Escape' && document.body.classList.contains('menu-acik')) {
    menuAyarla(false);
    document.getElementById('menu-dugme').focus();
  }
});
// Aynı modülün bağlantısına tıklanınca hashchange olmaz; menüyü yine kapat.
document.getElementById('kenar-nav').addEventListener('click', (olay) => {
  if (olay.target.closest && olay.target.closest('a')) menuAyarla(false);
});
window.addEventListener('hashchange', modulGoster);

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
  bildirimGoster('CSV dosyası indirildi.');
});

yukle();
ciz();
modulGoster();
