import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// İnsan, önceki teslimi "UI/UX çok kötü, profesyonel hale getir" diye reddetti.
// Bu testler profesyonel arayüzün ölçülebilir niteliklerini statik olarak sınar.
const kok = new URL('../', import.meta.url);
const oku = (p) => readFileSync(new URL(p, kok), 'utf8');
const html = oku('index.html');
const js = oku('src/app.js');
const css = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/) || [, ''])[1];

test('ui: tasarım belirteçleri CSS özel özellikleriyle tanımlıdır', () => {
  assert.match(css, /:root\s*\{[^}]*--[a-z-]+\s*:/);
  const kullanim = css.match(/var\(--[a-z-]+/g) || [];
  assert.ok(kullanim.length >= 15, `var(--...) kullanımı az: ${kullanim.length}`);
  const tanim = css.match(/--[a-z0-9-]+\s*:/g) || [];
  assert.ok(tanim.length >= 8, `en az 8 belirteç beklenir: ${tanim.length}`);
});

test('ui: sayfa yapısı landmark öğeleri kullanır (header, main)', () => {
  assert.match(html, /<header\b/);
  assert.match(html, /<main\b/);
  assert.match(html, /<h1[^>]*>\s*Stok takip\s*<\/h1>/);
});

test('ui: hover, focus-visible ve disabled durumları tanımlıdır', () => {
  assert.match(css, /button[^{]*:hover/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /button[^{]*:disabled|\[disabled\]/);
});

test('ui: düğmeler birincil ve tehlike varyantlarına sahiptir', () => {
  assert.match(css, /\.(btn-)?(birincil|primary)\b/);
  assert.match(css, /\.(btn-)?(tehlike|danger)\b/);
  assert.match(html + js, /(birincil|primary)/);
});

test('ui: alert/confirm/prompt yok; bildirimler sayfa içi toast ve aria-live ile', () => {
  assert.doesNotMatch(js, /\b(window\.)?(alert|confirm|prompt)\s*\(/);
  assert.match(html + js, /aria-live|role=["']status["']|'status'/);
  assert.match(css, /\.(toast|bildirim)\b/);
});

test('ui: tablo üstbilgisi sabit kalır, sayılar sağa hizalı ve tabular-nums', () => {
  assert.match(css, /position:\s*sticky/);
  assert.match(css, /tabular-nums/);
  assert.match(css, /text-align:\s*right/);
});

test('ui: sıralanabilir sütunlar aria-sort ve yön oku taşır', () => {
  assert.match(js, /aria-sort/);
  assert.match(js, /[▲▼↑↓]/);
});

test('ui: sıralanabilir başlıklar klavyeyle kullanılabilir', () => {
  assert.ok(/tabindex|tabIndex/.test(js) || /createElement\(\s*['"]button['"]/.test(js));
  assert.match(js, /keydown|Enter/);
});

test('ui: modal kapatma düğmesi, showModal, odak yönetimi ve backdrop stili', () => {
  assert.match(js, /Kapat|İptal/);
  assert.match(js, /showModal/);
  assert.match(js, /\.focus\(\)/);
  assert.match(css, /dialog::backdrop/);
});

test('ui: form hataları erişilebilir (aria-invalid, aria-describedby) ve zorunlu alan işaretli', () => {
  assert.match(js, /aria-invalid/);
  assert.match(js, /aria-describedby|ariaDescribedBy/);
  assert.match(js, /required|Zorunlu|\*/);
});

test('ui: boş durumlar ayrı mesajlar gösterir (ürün yok / filtre sonucu yok)', () => {
  assert.match(html + js, /Filtreye uyan ürün yok|Sonuç bulunamadı|Eşleşen ürün yok/);
  assert.match(html + js, /Henüz ürün (yok|eklenmedi)/);
});

test('ui: Kritik rozeti ve kritik satır stili vardır', () => {
  assert.match(css, /\.rozet/);
  assert.match(css, /tr\.kritik/);
  assert.match(js, /Kritik/);
});

test('ui: özet kartları kenar/gölge stiline ve dört başlığa sahiptir', () => {
  assert.match(css, /\.kart\b[^{]*\{[^}]*(box-shadow|border)/);
  for (const m of ['Toplam ürün', 'Toplam stok değeri', 'Kritik', 'Bugünkü hareket']) {
    assert.ok(html.includes(m), m);
  }
});

test('ui: mobilde dokunma hedefleri en az 44px, kutu modeli border-box', () => {
  const mobil = css.slice(css.search(/@media[^{]*max-width:\s*600px/));
  assert.match(mobil, /min-height:\s*(44px|2\.75rem)/);
  assert.match(css, /box-sizing:\s*border-box/);
});

test('ui: geçişler ve prefers-reduced-motion tanımlıdır', () => {
  assert.match(css, /transition\s*:/);
  assert.match(css, /prefers-reduced-motion/);
});

test('ui: satır işlem düğmeleri erişilebilir ad taşır', () => {
  assert.match(js, /aria-label|ariaLabel/);
});

test('ui: kullanıcı metni yalnız textContent ile yazılır', () => {
  assert.doesNotMatch(js, /\.(innerHTML|outerHTML)\s*=|insertAdjacentHTML/);
});
