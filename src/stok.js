// Stok iş mantığı: saf fonksiyonlar, girdiyi değiştirmez, hatalar { hata } döner.

export const BIRIMLER = ['adet', 'kg', 'lt', 'kutu'];
export const TURLER = ['giris', 'cikis', 'duzeltme'];

const sonrakiId = (liste) => liste.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1;
const bosMu = (s) => typeof s !== 'string' || s.trim() === '';
const gecerliSayi = (n) => typeof n === 'number' && Number.isFinite(n) && n >= 0;

function dogrula(urun, digerleri) {
  if (bosMu(urun.ad)) return 'Ad boş olamaz.';
  if (bosMu(urun.sku)) return 'SKU boş olamaz.';
  if (digerleri.some((u) => u.sku === urun.sku.trim())) return 'Bu SKU başka bir üründe kullanılıyor.';
  if (!BIRIMLER.includes(urun.birim)) return 'Birim geçersiz.';
  if (!gecerliSayi(urun.stok)) return 'Stok geçerli bir sayı olmalı, negatif olamaz.';
  if (!gecerliSayi(urun.minStok)) return 'Min. stok geçerli bir sayı olmalı, negatif olamaz.';
  if (!gecerliSayi(urun.alisFiyati)) return 'Alış fiyatı geçerli bir sayı olmalı, negatif olamaz.';
  if (!gecerliSayi(urun.satisFiyati)) return 'Satış fiyatı geçerli bir sayı olmalı, negatif olamaz.';
  return null;
}

function temizle(a) {
  return { ...a, ad: String(a.ad ?? '').trim(), sku: String(a.sku ?? '').trim(), kategori: String(a.kategori ?? '').trim() };
}

export function urunEkle(urunler, alanlar) {
  const yeni = temizle({ birim: 'adet', stok: 0, minStok: 0, alisFiyati: 0, satisFiyati: 0, ...alanlar });
  const hata = dogrula(yeni, urunler);
  if (hata) return { hata };
  return [...urunler, { ...yeni, id: sonrakiId(urunler) }];
}

export function urunGuncelle(urunler, id, degisiklikler) {
  const mevcut = urunler.find((u) => u.id === id);
  if (!mevcut) return { hata: 'Ürün bulunamadı.' };
  const yeni = temizle({ ...mevcut, ...degisiklikler, id });
  const hata = dogrula(yeni, urunler.filter((u) => u.id !== id));
  if (hata) return { hata };
  return urunler.map((u) => (u.id === id ? yeni : u));
}

export function urunSil(urunler, hareketler, id) {
  if (!urunler.some((u) => u.id === id)) return { hata: 'Ürün bulunamadı.' };
  if (hareketler.some((h) => h.urunId === id)) return { hata: 'Hareketi olan ürün silinemez.' };
  return urunler.filter((u) => u.id !== id);
}

export function hareketEkle(urunler, hareketler, hareket) {
  const urun = urunler.find((u) => u.id === hareket.urunId);
  if (!urun) return { hata: 'Ürün bulunamadı.' };
  if (!TURLER.includes(hareket.tur)) return { hata: 'Hareket türü geçersiz.' };
  const m = hareket.miktar;
  if (typeof m !== 'number' || !Number.isFinite(m) || m < 0 || (m === 0 && hareket.tur !== 'duzeltme')) {
    return { hata: 'Miktar geçersiz.' };
  }
  let stok;
  if (hareket.tur === 'giris') stok = urun.stok + m;
  else if (hareket.tur === 'cikis') {
    if (m > urun.stok) return { hata: 'Stok yetersiz.' };
    stok = urun.stok - m;
  } else stok = m;
  const kayit = {
    id: sonrakiId(hareketler),
    urunId: urun.id,
    tur: hareket.tur,
    miktar: m,
    aciklama: String(hareket.aciklama ?? ''),
    tarih: hareket.tarih ?? Date.now(),
  };
  return {
    urunler: urunler.map((u) => (u.id === urun.id ? { ...u, stok } : u)),
    hareketler: [...hareketler, kayit],
  };
}

export const kritikMi = (u) => u.stok <= u.minStok;
export const kritikStoklar = (urunler) => urunler.filter(kritikMi);

export function stokDegeri(urunler) {
  let alis = 0;
  let satis = 0;
  for (const u of urunler) {
    alis += u.stok * u.alisFiyati;
    satis += u.stok * u.satisFiyati;
  }
  return { alis, satis };
}

export function urunleriSuz(urunler, { arama = '', kategori = '', sadeceKritik = false } = {}) {
  const q = String(arama).trim().toLocaleLowerCase('tr');
  return urunler.filter((u) => {
    if (q && !u.ad.toLocaleLowerCase('tr').includes(q) && !u.sku.toLocaleLowerCase('tr').includes(q)) return false;
    if (kategori && u.kategori !== kategori) return false;
    if (sadeceKritik && !kritikMi(u)) return false;
    return true;
  });
}

// guncelStok verilirse, hareketlerden önceki başlangıç stoğu (üründe ilk
// kayıtla girilen) geriye doğru bulunur. Düzeltme varsa ondan sonrası zaten kesindir.
export function hareketGecmisi(hareketler, urunId, { baslangic, bitis, guncelStok } = {}) {
  const sirali = hareketler
    .filter((h) => h.urunId === urunId)
    .sort((a, b) => a.tarih - b.tarih || a.id - b.id);
  let stok = 0;
  if (typeof guncelStok === 'number' && !sirali.some((h) => h.tur === 'duzeltme')) {
    const net = sirali.reduce((t, h) => t + (h.tur === 'giris' ? h.miktar : -h.miktar), 0);
    stok = guncelStok - net;
  }
  const hesapli = sirali.map((h) => {
    if (h.tur === 'giris') stok += h.miktar;
    else if (h.tur === 'cikis') stok -= h.miktar;
    else stok = h.miktar;
    return { ...h, sonrasiStok: stok };
  });
  return hesapli
    .filter((h) => (baslangic === undefined || h.tarih >= baslangic) && (bitis === undefined || h.tarih <= bitis))
    .reverse();
}

const kacir = (v) => {
  const s = String(v ?? '');
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function csvOlustur(urunler) {
  const kolonlar = ['id', 'ad', 'sku', 'kategori', 'birim', 'stok', 'minStok', 'alisFiyati', 'satisFiyati'];
  const satirlar = urunler.map((u) => kolonlar.map((k) => kacir(u[k])).join(','));
  return [kolonlar.join(','), ...satirlar].join('\n') + '\n';
}

export function paraBicimle(n) {
  const [tam, kes] = Math.abs(n).toFixed(2).split('.');
  const nokta = tam.replace(/\B(?=(\d{3})+$)/g, '.');
  return `${n < 0 ? '-' : ''}${nokta},${kes} ₺`;
}

const iki = (n) => String(n).padStart(2, '0');

export function csvDosyaAdi(tarih = new Date()) {
  return `stok-${tarih.getFullYear()}-${iki(tarih.getMonth() + 1)}-${iki(tarih.getDate())}.csv`;
}

export function ayniGunMu(a, b) {
  const x = new Date(a);
  const y = new Date(b);
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
}

// Kayıtlı verinin biçimini denetler.
export function veriGecerliMi(v) {
  return !!v && Array.isArray(v.urunler) && Array.isArray(v.hareketler)
    && v.urunler.every((u) => u && typeof u === 'object' && typeof u.ad === 'string' && typeof u.sku === 'string'
      && gecerliSayi(u.stok) && gecerliSayi(u.minStok) && gecerliSayi(u.alisFiyati) && gecerliSayi(u.satisFiyati))
    && v.hareketler.every((h) => h && typeof h === 'object' && TURLER.includes(h.tur) && typeof h.miktar === 'number');
}
