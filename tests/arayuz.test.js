import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Asgari sahte DOM: app.js tarayıcısız çalıştırılır.
class Oge {
  constructor(etiket) {
    this.tagName = etiket.toUpperCase();
    this.children = [];
    this.dinleyiciler = {};
    this.attrs = {};
    this.style = {};
    this.hidden = false;
    this.value = '';
    this._text = '';
    this._kume = new Set();
    const k = this._kume;
    this.classList = {
      add: (...c) => c.forEach((x) => k.add(x)),
      remove: (...c) => c.forEach((x) => k.delete(x)),
      toggle: (c, f) => {
        const ac = f === undefined ? !k.has(c) : f;
        if (ac) k.add(c); else k.delete(c);
        return ac;
      },
      contains: (c) => k.has(c),
    };
  }
  set className(v) { this._kume.clear(); String(v).split(/\s+/).filter(Boolean).forEach((c) => this._kume.add(c)); }
  get className() { return [...this._kume].join(' '); }
  set textContent(v) { this._text = String(v); this.children = []; }
  get textContent() { return this._text + this.children.map((c) => c.textContent).join(''); }
  append(...k) { this.children.push(...k); }
  appendChild(k) { this.children.push(k); return k; }
  replaceChildren(...k) { this.children = [...k]; this._text = ''; }
  setAttribute(a, v) { this.attrs[a] = String(v); if (a === 'type') this.type = String(v); }
  getAttribute(a) { return this.attrs[a]; }
  addEventListener(o, f) { (this.dinleyiciler[o] ??= []).push(f); }
  tikla() {
    this.checked = !this.checked;
    for (const o of ['change', 'click', 'input']) {
      if (this.dinleyiciler[o]) {
        this.dinleyiciler[o].forEach((f) => f({ target: this, preventDefault() {} }));
        return;
      }
    }
  }
  bul(fn, sonuc = []) {
    if (fn(this)) sonuc.push(this);
    this.children.forEach((c) => c.bul(fn, sonuc));
    return sonuc;
  }
}

const ogeler = {};
globalThis.document = {
  getElementById: (id) => (ogeler[id] ??= new Oge(id === 'ekle-formu' ? 'form' : id === 'liste' ? 'ul' : 'div')),
  createElement: (e) => new Oge(e),
};
globalThis.fetch = () => Promise.resolve({ ok: false });

await import('../src/app.js');

function gorevEkleUI(baslik) {
  ogeler['baslik'].value = baslik;
  ogeler['ekle-formu'].dinleyiciler.submit.forEach((f) => f({ preventDefault() {} }));
}
const satirlar = () => ogeler['liste'].children;
const kutu = (s) => s.bul((o) => o.tagName === 'INPUT' && o.type === 'checkbox')[0];
const baslikOgesi = (s) => s.bul((o) => o.tagName === 'SPAN' && o._text !== '')[0];
const ustuCizili = (o) => o.style.textDecoration === 'line-through' || o.classList.contains('tamamlandi');

gorevEkleUI('Süt al');
gorevEkleUI('Ekmek');

test('arayüz: her görev satırında onay kutusu bulunur, başlangıçta işaretsizdir', () => {
  assert.equal(satirlar().length, 2);
  for (const s of satirlar()) {
    assert.ok(kutu(s), 'checkbox yok');
    assert.equal(Boolean(kutu(s).checked), false);
  }
});

test('arayüz: kutu işaretlenince yalnız o görev tamamlanır ve başlığı çizilir', () => {
  kutu(satirlar()[0]).tikla();
  const [a, b] = satirlar();
  assert.equal(kutu(a).checked, true);
  assert.equal(Boolean(kutu(b).checked), false);
  assert.ok(ustuCizili(baslikOgesi(a)));
  assert.ok(!ustuCizili(baslikOgesi(b)));
});

test('arayüz: işaret kaldırılınca çizgi kalkar', () => {
  kutu(satirlar()[0]).tikla();
  const a = satirlar()[0];
  assert.equal(Boolean(kutu(a).checked), false);
  assert.ok(!ustuCizili(baslikOgesi(a)));
});

test('arayüz: başlık textContent ile yazılır (HTML olarak yorumlanmaz)', () => {
  gorevEkleUI('<b>x</b>');
  const s = satirlar()[2];
  assert.ok(s.textContent.includes('<b>x</b>'));
  assert.equal(s.bul((o) => o.tagName === 'B').length, 0);
});

test('arayüz: index.html üstü çizili stil kuralını içerir', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /tamamlandi[^}]*text-decoration:\s*line-through/);
});

test('arayüz: app.js tamamlanmaDegistir fonksiyonunu içe aktarır', () => {
  const kaynak = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.match(kaynak, /import\s*\{[^}]*tamamlanmaDegistir[^}]*\}\s*from/);
});
