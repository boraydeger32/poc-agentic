// İş mantığı. Bu dosyadaki fonksiyonlar saftır: girdiyi değiştirmez, yeni değer döndürür.

/**
 * Listeye yeni bir görev ekler.
 * Başlık boşsa ya da yalnız boşluktan oluşuyorsa liste değişmeden döner.
 */
export function gorevEkle(liste, baslik) {
  const temiz = String(baslik ?? '').trim();
  if (temiz === '') return liste;
  const id = liste.reduce((enBuyuk, g) => Math.max(enBuyuk, g.id), 0) + 1;
  return [...liste, { id, baslik: temiz, tamamlandi: false }];
}

/**
 * Verilen id'li görevin tamamlandi değerini tersine çevirir; yeni liste döndürür.
 */
export function tamamlanmaDegistir(liste, id) {
  return liste.map((g) => (g.id === id ? { ...g, tamamlandi: !g.tamamlandi } : g));
}
