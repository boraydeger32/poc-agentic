// Arayüz. Mantık içermez: src/gorevler.js fonksiyonlarını çağırır ve sayfayı çizer.
import { gorevEkle } from './gorevler.js';

let gorevler = [];

const form = document.getElementById('ekle-formu');
const girdi = document.getElementById('baslik');
const listeEl = document.getElementById('liste');
const bosEl = document.getElementById('bos');

function ciz() {
  listeEl.replaceChildren();
  for (const gorev of gorevler) {
    const satir = document.createElement('li');
    const metin = document.createElement('span');
    metin.textContent = gorev.baslik;
    satir.append(metin);
    listeEl.append(satir);
  }
  bosEl.hidden = gorevler.length > 0;
}

form.addEventListener('submit', (olay) => {
  olay.preventDefault();
  gorevler = gorevEkle(gorevler, girdi.value);
  girdi.value = '';
  ciz();
});

// Yayındaki sürümü göster (alpha ortamı surum.txt dosyasını yazar).
fetch('surum.txt', { cache: 'no-store' })
  .then((yanit) => (yanit.ok ? yanit.text() : 'yerel'))
  .then((surum) => { document.getElementById('surum').textContent = surum.trim().slice(0, 8); })
  .catch(() => {});

ciz();
