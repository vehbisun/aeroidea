// AeroIdea - Aşama 6B (n8n'e gönderme eklendi)
// Bu dosya: (1) formu kontrol eder, (2) hata varsa mesaj gösterir,
// (3) konsept açıklamasını yazar, (4) rapor üretir, (5) örnek veriyle demo yapar.

// ===== 1. HTML'deki parçaları JavaScript'e tanıtalım =====
const form = document.getElementById("konsept-formu");
const adKutusu = document.getElementById("konsept-adi");
const kapasiteKutusu = document.getElementById("kapasite");
const gorevKutusu = document.getElementById("gorev");
const itkiKutusu = document.getElementById("itki");
const oncelikKutusu = document.getElementById("oncelik");
const stilKutusu = document.getElementById("stil");
const sonucAlani = document.getElementById("sonuc");
const ornekDugme = document.getElementById("ornek-dugme");
const raporBolumu = document.getElementById("rapor-bolumu");
const raporAlani = document.getElementById("rapor");
const indirDugme = document.getElementById("indir-dugme");
const n8nBolumu = document.getElementById("n8n-bolumu");
const n8nAdresKutusu = document.getElementById("n8n-adres");
const n8nGonderDugme = document.getElementById("n8n-gonder-dugme");
const n8nDurum = document.getElementById("n8n-durum");

// Kapasite sınırları (80–150 aralığı)
const MIN_KAPASITE = 80;
const MAX_KAPASITE = 150;

// ===== 2. Örnek veriler (demo için) =====
// Bunlar sadece denemelik isimler ve yolcu sayılarıdır; mühendislik verisi değildir.
const ORNEKLER = [
  { ad: "Mavi Kanat", kapasite: 120 },
  { ad: "Yeşil Rota", kapasite: 90 },
  { ad: "Gökyüzü Taşıyıcı", kapasite: 148 }
];
let ornekSirasi = 0;

// ===== 3. Raporda kullanılacak sabit metinler =====
// Bu değerlerin HİÇBİRİ hesaplanmadı. Rapor bunu açıkça söyler.
const DOGRULANMAMIS_DEGERLER = [
  "Menzil",
  "Enerji tüketimi",
  "Enerji tasarrufu oranı",
  "Motor gücü",
  "Batarya / enerji depolama kapasitesi",
  "Kalkış ağırlığı",
  "Kanat açıklığı"
];

const ITKI_NOTU =
  "Hibrit elektrik fikri, elektrik motoru ile başka bir enerji kaynağını " +
  "birlikte kullanmayı hedefler. Bu konseptte hangi düzenin kullanılacağı " +
  "henüz belirlenmemiştir.";

const RAPOR_UYARISI =
  "Bu rapor eğitim amaçlıdır. Mühendislik performansı hakkında bir iddia " +
  "içermez. Yukarıdaki \"Hesaplanmadı\" yazan değerler uydurulmamıştır; " +
  "gerçek değerler için güvenilir kaynak veya uzman desteği gerekir.";

// ===== 4. Hata gösterme ve temizleme yardımcıları =====
function hataGoster(kutu, mesajId, mesaj) {
  document.getElementById(mesajId).textContent = mesaj;
  kutu.classList.add("hatali");
  kutu.setAttribute("aria-invalid", "true");
}

function hataTemizle(kutu, mesajId) {
  document.getElementById(mesajId).textContent = "";
  kutu.classList.remove("hatali");
  kutu.removeAttribute("aria-invalid");
}

// ===== 5. Girdi kontrolü =====
function formuKontrolEt() {
  let hataVarMi = false;
  let ilkHataliKutu = null;

  // --- Konsept adı ---
  hataTemizle(adKutusu, "konsept-adi-hata");
  const ad = adKutusu.value.trim();

  if (ad === "") {
    hataGoster(adKutusu, "konsept-adi-hata", "Lütfen konsept için bir ad yaz.");
    hataVarMi = true;
    ilkHataliKutu = adKutusu;
  } else if (ad.length < 3) {
    hataGoster(adKutusu, "konsept-adi-hata", "Ad en az 3 karakter olmalı.");
    hataVarMi = true;
    ilkHataliKutu = adKutusu;
  } else if (ad.length > 40) {
    hataGoster(adKutusu, "konsept-adi-hata", "Ad en fazla 40 karakter olabilir.");
    hataVarMi = true;
    ilkHataliKutu = adKutusu;
  }

  // --- Yolcu kapasitesi ---
  hataTemizle(kapasiteKutusu, "kapasite-hata");
  const kapasiteMetni = kapasiteKutusu.value.trim();
  const kapasite = Number(kapasiteMetni);

  if (kapasiteMetni === "") {
    hataGoster(kapasiteKutusu, "kapasite-hata", "Lütfen yolcu kapasitesini yaz.");
    hataVarMi = true;
    ilkHataliKutu = ilkHataliKutu || kapasiteKutusu;
  } else if (!Number.isInteger(kapasite)) {
    hataGoster(kapasiteKutusu, "kapasite-hata", "Kapasite tam sayı olmalı (örn. 120).");
    hataVarMi = true;
    ilkHataliKutu = ilkHataliKutu || kapasiteKutusu;
  } else if (kapasite < MIN_KAPASITE || kapasite > MAX_KAPASITE) {
    hataGoster(
      kapasiteKutusu,
      "kapasite-hata",
      "Kapasite " + MIN_KAPASITE + " ile " + MAX_KAPASITE + " arasında olmalı."
    );
    hataVarMi = true;
    ilkHataliKutu = ilkHataliKutu || kapasiteKutusu;
  }

  if (ilkHataliKutu) {
    ilkHataliKutu.focus();
  }

  return !hataVarMi;
}

// ===== 6. Seçili seçeneğin ekrandaki yazısını al =====
function seciliYazi(selectKutusu) {
  return selectKutusu.options[selectKutusu.selectedIndex].text;
}

// ===== 7. Formdaki bilgileri tek bir "paket" (nesne) yap =====
// Aşama 6'da n8n'e bu paketi göndereceğiz.
function konseptVerisiOlustur() {
  return {
    ad: adKutusu.value.trim(),
    kapasite: Number(kapasiteKutusu.value),
    gorev: seciliYazi(gorevKutusu),
    itki: seciliYazi(itkiKutusu),
    oncelik: seciliYazi(oncelikKutusu),
    stil: seciliYazi(stilKutusu),
    zaman: new Date().toLocaleString("tr-TR")
  };
}

function kucukHarf(metin) {
  return metin.toLocaleLowerCase("tr-TR");
}

// ===== 8. Konsept açıklaması metni =====
function konseptMetniOlustur(v) {
  return (
    v.ad + ", " + v.kapasite + " yolcu kapasiteli bir konsept uçak fikridir. " +
    "Görevi: " + kucukHarf(v.gorev) + ". " +
    "Enerji yaklaşımı: " + kucukHarf(v.itki) + ". " +
    "Tasarım önceliği: " + kucukHarf(v.oncelik) + ". " +
    "Görsel stil: " + kucukHarf(v.stil) + "."
  );
}

// ===== 9. Rapor yapısı =====
// Rapor önce "veri" olarak hazırlanır. Sonra hem ekrana hem .txt dosyasına çevrilir.
function raporYapisiOlustur(v) {
  return {
    baslik: v.ad + " – Konsept Raporu",
    zaman: "Oluşturulma zamanı: " + v.zaman,
    bolumler: [
      {
        baslik: "1. Girdi özeti",
        tur: "tablo",
        basliklar: ["Alan", "Değer"],
        satirlar: [
          ["Konsept adı", v.ad],
          ["Uçak görevi", v.gorev],
          ["Yolcu kapasitesi", v.kapasite + " yolcu"],
          ["Enerji / itki yaklaşımı", v.itki],
          ["Tasarım önceliği", v.oncelik],
          ["Görsel stil", v.stil]
        ]
      },
      {
        baslik: "2. Konsept açıklaması",
        tur: "metin",
        metinler: [konseptMetniOlustur(v), ITKI_NOTU]
      },
      {
        baslik: "3. Doğrulanmamış değerler",
        tur: "tablo",
        basliklar: ["Değer", "Durum"],
        satirlar: DOGRULANMAMIS_DEGERLER.map(function (deger) {
          return [deger, "Hesaplanmadı – doğrulanmadı"];
        })
      },
      {
        baslik: "4. Araştırılacak sorular",
        tur: "liste",
        maddeler: [
          "Uçak hangi uçuş mesafesi için tasarlanacak?",
          "Hibrit elektrik düzeninde enerji hangi kaynaklardan gelecek?",
          "Enerji verimliliği hangi ölçüyle karşılaştırılacak?",
          "Karşılaştırma için hangi güvenilir kaynaklar kullanılabilir?"
        ]
      },
      {
        baslik: "5. Sonraki adımlar",
        tur: "liste",
        maddeler: [
          "Araştırma sorularını takım olarak cevaplamaya çalışın.",
          "Bulduğunuz her değerin kaynağını not edin.",
          "Raporu öğretmeninizle birlikte gözden geçirin."
        ]
      }
    ],
    uyari: RAPOR_UYARISI
  };
}

// ===== 10. Raporu ekrana çizen yardımcılar =====
// Yine textContent kullanıyoruz (güvenlik için).
function tabloOlustur(basliklar, satirlar) {
  const kaydirma = document.createElement("div");
  kaydirma.className = "tablo-kaydir";

  const tablo = document.createElement("table");
  const thead = document.createElement("thead");
  const baslikSatiri = document.createElement("tr");

  basliklar.forEach(function (b) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = b;
    baslikSatiri.append(th);
  });
  thead.append(baslikSatiri);

  const tbody = document.createElement("tbody");
  satirlar.forEach(function (satir) {
    const tr = document.createElement("tr");
    satir.forEach(function (hucre, sira) {
      // İlk hücre satırın başlığıdır (th), diğerleri normal hücre (td)
      const eleman = document.createElement(sira === 0 ? "th" : "td");
      if (sira === 0) {
        eleman.scope = "row";
      }
      eleman.textContent = hucre;
      tr.append(eleman);
    });
    tbody.append(tr);
  });

  tablo.append(thead, tbody);
  kaydirma.append(tablo);
  return kaydirma;
}

function raporuGoster(rapor) {
  raporAlani.innerHTML = "";

  const baslik = document.createElement("h3");
  baslik.textContent = rapor.baslik;
  const zaman = document.createElement("p");
  zaman.textContent = rapor.zaman;
  raporAlani.append(baslik, zaman);

  rapor.bolumler.forEach(function (bolum) {
    const h4 = document.createElement("h4");
    h4.textContent = bolum.baslik;
    raporAlani.append(h4);

    if (bolum.tur === "tablo") {
      raporAlani.append(tabloOlustur(bolum.basliklar, bolum.satirlar));
    } else if (bolum.tur === "metin") {
      bolum.metinler.forEach(function (metin) {
        const p = document.createElement("p");
        p.textContent = metin;
        raporAlani.append(p);
      });
    } else if (bolum.tur === "liste") {
      const ul = document.createElement("ul");
      bolum.maddeler.forEach(function (madde) {
        const li = document.createElement("li");
        li.textContent = madde;
        ul.append(li);
      });
      raporAlani.append(ul);
    }
  });

  const uyari = document.createElement("p");
  uyari.className = "uyari-kutu";
  uyari.textContent = rapor.uyari;
  raporAlani.append(uyari);

  raporBolumu.hidden = false; // rapor bölümünü görünür yap
}

// ===== 11. Aynı raporu düz yazıya çevir (indirmek için) =====
function raporMetniOlustur(rapor) {
  const satirlar = [rapor.baslik, rapor.zaman, ""];

  rapor.bolumler.forEach(function (bolum) {
    satirlar.push(bolum.baslik);
    if (bolum.tur === "tablo") {
      bolum.satirlar.forEach(function (satir) {
        satirlar.push("- " + satir[0] + ": " + satir[1]);
      });
    } else if (bolum.tur === "metin") {
      bolum.metinler.forEach(function (metin) {
        satirlar.push(metin);
      });
    } else if (bolum.tur === "liste") {
      bolum.maddeler.forEach(function (madde) {
        satirlar.push("- " + madde);
      });
    }
    satirlar.push("");
  });

  satirlar.push(rapor.uyari);
  return satirlar.join("\n");
}

let sonRapor = null; // en son üretilen raporu burada saklarız
let sonVeri = null;  // en son oluşturulan konsept paketini burada saklarız

function raporuIndir() {
  if (!sonRapor) {
    return;
  }
  const metin = raporMetniOlustur(sonRapor);
  const dosya = new Blob([metin], { type: "text/plain;charset=utf-8" });
  const adres = URL.createObjectURL(dosya);

  const baglanti = document.createElement("a");
  baglanti.href = adres;
  baglanti.download = "aeroidea-rapor.txt";
  document.body.append(baglanti);
  baglanti.click();
  baglanti.remove();
  URL.revokeObjectURL(adres);
}

// ===== 12. Konsept açıklamasını "Sonuç" alanına yaz =====
function konseptiGoster(v) {
  sonucAlani.innerHTML = "";

  const baslik = document.createElement("h3");
  baslik.textContent = v.ad;

  const ozet = document.createElement("p");
  ozet.textContent = konseptMetniOlustur(v);

  const itkiNotu = document.createElement("p");
  itkiNotu.textContent = ITKI_NOTU;

  const uyari = document.createElement("p");
  uyari.textContent =
    "Not: Menzil, enerji tasarrufu, motor gücü ve ağırlık gibi değerler " +
    "hesaplanmadı ve doğrulanmadı. Aşağıdaki raporda bunları görebilirsin.";

  sonucAlani.append(baslik, ozet, itkiNotu, uyari);
}

// ===== 12b. n8n'e gönderme (Aşama 6B) =====
// Durum mesajını yazar. tur: "basari", "hata" veya "bilgi" (renk için)
function durumYaz(mesaj, tur) {
  n8nDurum.textContent = mesaj;
  n8nDurum.className = tur ? "durum-" + tur : "";
}

// Adres kutusunu kontrol eder. Geçerliyse adresi, değilse null döndürür.
function n8nAdresiniKontrolEt() {
  hataTemizle(n8nAdresKutusu, "n8n-adres-hata");
  const adres = n8nAdresKutusu.value.trim();

  if (adres === "") {
    hataGoster(n8nAdresKutusu, "n8n-adres-hata", "Lütfen n8n webhook adresini yaz.");
    n8nAdresKutusu.focus();
    return null;
  }

  let url;
  try {
    url = new URL(adres); // geçersiz adreste hata fırlatır
  } catch (hata) {
    hataGoster(
      n8nAdresKutusu,
      "n8n-adres-hata",
      "Bu geçerli bir adres değil. Adres http:// veya https:// ile başlamalı."
    );
    n8nAdresKutusu.focus();
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    hataGoster(
      n8nAdresKutusu,
      "n8n-adres-hata",
      "Adres http:// veya https:// ile başlamalı."
    );
    n8nAdresKutusu.focus();
    return null;
  }

  // https sayfalar, localhost dışındaki http adreslerine istek gönderemez.
  const yerelMi = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (location.protocol === "https:" && url.protocol === "http:" && !yerelMi) {
    hataGoster(
      n8nAdresKutusu,
      "n8n-adres-hata",
      "Bu sayfa https ile açıldığı için localhost dışındaki http:// adreslerine gönderemez."
    );
    n8nAdresKutusu.focus();
    return null;
  }

  return url.href;
}

// Raporu n8n'e gönderir. "async" = cevabı beklerken sayfa donmaz.
async function n8nyeGonder() {
  const adres = n8nAdresiniKontrolEt();
  if (!adres) {
    return;
  }

  if (!sonVeri || !sonRapor) {
    durumYaz("Önce bir konsept oluştur.", "hata");
    return;
  }

  // Gönderilecek paket: konsept bilgileri + rapor metni
  const paket = Object.assign({}, sonVeri, {
    rapor: raporMetniOlustur(sonRapor),
    kaynak: "AeroIdea web uygulaması"
  });

  n8nGonderDugme.disabled = true; // üst üste basılmasın
  durumYaz("Gönderiliyor...", "bilgi");

  // 10 saniyede cevap gelmezse vazgeç
  const sureKontrol = new AbortController();
  const zamanAsimi = setTimeout(function () {
    sureKontrol.abort();
  }, 10000);

  try {
    const cevap = await fetch(adres, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paket),
      signal: sureKontrol.signal
    });

    if (cevap.status === 404) {
      durumYaz(
        "n8n bu adresi bulamadı (404). Test adresi kullanıyorsan önce n8n'de " +
        "\"Execute workflow\" düğmesine bas, sonra tekrar gönder.",
        "hata"
      );
    } else if (!cevap.ok) {
      durumYaz("n8n hata döndürdü (kod: " + cevap.status + ").", "hata");
    } else {
      let mesaj = "";
      try {
        const json = await cevap.json();
        mesaj = json.mesaj || "";
      } catch (hata) {
        // Cevap JSON değilse sorun değil, mesajsız devam ederiz
      }
      durumYaz(
        "Gönderildi. n8n cevap verdi" + (mesaj ? ": " + mesaj : "") + ".",
        "basari"
      );
    }
  } catch (hata) {
    if (hata.name === "AbortError") {
      durumYaz("10 saniye içinde cevap gelmedi. n8n çalışıyor mu?", "hata");
    } else {
      durumYaz(
        "Gönderilemedi. Olası nedenler: n8n çalışmıyor, adres yanlış, " +
        "\"Execute workflow\" düğmesine basılmadı ya da tarayıcı isteği engelledi " +
        "(CORS / yerel ağ izni). Ayrıntı için F12 → Console sekmesine bak.",
        "hata"
      );
    }
  } finally {
    clearTimeout(zamanAsimi);
    n8nGonderDugme.disabled = false;
  }
}

function n8nDurumunuTemizle() {
  durumYaz("", "");
  hataTemizle(n8nAdresKutusu, "n8n-adres-hata");
}

// ===== 13. Düğmeye basılınca ne olacak? =====
form.addEventListener("submit", function (olay) {
  olay.preventDefault();

  if (formuKontrolEt()) {
    const veri = konseptVerisiOlustur();
    konseptiGoster(veri);
    sonRapor = raporYapisiOlustur(veri);
    sonVeri = veri;
    raporuGoster(sonRapor);
    n8nBolumu.hidden = false;
    n8nDurumunuTemizle();
  } else {
    sonucAlani.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = "Konsept oluşturulamadı. Lütfen işaretli alanları düzelt.";
    sonucAlani.append(p);
    sonRapor = null;
    sonVeri = null;
    raporBolumu.hidden = true;
    n8nBolumu.hidden = true;
  }
});

// ===== 14. "Örnek veriyle doldur" düğmesi =====
ornekDugme.addEventListener("click", function () {
  const ornek = ORNEKLER[ornekSirasi];
  ornekSirasi = (ornekSirasi + 1) % ORNEKLER.length; // sıradakine geç, sondan sonra başa dön

  adKutusu.value = ornek.ad;
  kapasiteKutusu.value = ornek.kapasite;
  hataTemizle(adKutusu, "konsept-adi-hata");
  hataTemizle(kapasiteKutusu, "kapasite-hata");

  form.requestSubmit(); // formu "Konsept oluştur"a basılmış gibi gönder
});

// ===== 15. "Raporu indir" ve "n8n'e gönder" düğmeleri =====
indirDugme.addEventListener("click", raporuIndir);
n8nGonderDugme.addEventListener("click", n8nyeGonder);
n8nAdresKutusu.addEventListener("input", function () {
  hataTemizle(n8nAdresKutusu, "n8n-adres-hata");
});

// ===== 16. Yazmaya başlayınca o kutunun hatasını sil =====
adKutusu.addEventListener("input", function () {
  hataTemizle(adKutusu, "konsept-adi-hata");
});
kapasiteKutusu.addEventListener("input", function () {
  hataTemizle(kapasiteKutusu, "kapasite-hata");
});
