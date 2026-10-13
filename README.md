# AeroIdea – Uçak Konsept Üretici

Lise öğrencileri için hazırlanmış bir eğitim prototipi.

Kullanıcı birkaç tercih seçer (konsept adı, yolcu kapasitesi vb.). Uygulama bu tercihlerden kısa bir **konsept açıklaması** ve bir **rapor** üretir.

## Bu proje neyi yapar?

- Formdaki girdileri kontrol eder ve anlaşılır hata mesajları gösterir.
- Konsept açıklaması ve rapor üretir.
- Örnek verilerle çalışan bir demo içerir.
- Raporu `.txt` dosyası olarak indirir.

## Bu proje neyi yapmaz?

- Gerçek mühendislik hesabı yapmaz.
- Menzil, enerji tüketimi, motor gücü, ağırlık gibi değerleri **hesaplamaz ve uydurmaz**. Raporda bunlar "Hesaplanmadı – doğrulanmadı" olarak görünür.

## Tercihler (ilk prototip)

- Uçak görevi: Yolcu taşımacılığı
- Kapasite: 80–150 yolcu
- Enerji / itki yaklaşımı: Hibrit elektrik
- Tasarım önceliği: Enerji verimliliği
- Görsel stil: Modern ve gerçekçi

## Dosyalar

| Dosya | Görevi |
|---|---|
| `index.html` | Sayfanın iskeleti (form + sonuç + rapor alanı) |
| `style.css` | Görünüm, renkler, mobil uyum |
| `app.js` | Girdi kontrolü, konsept ve rapor üretimi, n8n'e gönderme |

## Nasıl çalıştırılır?

Bilgisayarda `index.html` dosyasını tarayıcıda açmak yeterlidir. Kurulum, üyelik veya ücretli servis gerekmez.

## Yol haritası

- [x] Temel uygulama (form, kontrol, konsept, rapor, demo)
- [x] GitHub Pages ile yayınlama
- [x] n8n ile otomasyon (webhook ile veri alma ve kontrol)
- [ ] n8n'de gelen veriyi e-posta / tabloya aktarma (isteğe bağlı)

## n8n entegrasyonu (isteğe bağlı)

Uygulama, oluşturulan raporu n8n'deki bir **webhook** adresine gönderebilir.

- Webhook adresi kodun içinde **yoktur**. Sayfadaki "n8n webhook adresi" kutusuna elle yazılır.
- n8n bu projede öğretmenin / takımın **kendi bilgisayarında** çalışır (`localhost`). Bu yüzden gönderme yalnızca n8n'in çalıştığı bilgisayardan yapılabilir. Başka bir cihazdan açılan sitede bu düğme çalışmaz.
- n8n tarafında da girdi kontrolü yapılır: yolcu kapasitesi 80–150 dışındaysa n8n hata cevabı (400) döndürür.
- Anahtar, şifre veya gizli adres bu depoya **yazılmamalıdır** (depo herkese açıktır).

## Ekip

Takım üyelerinin adlarını / takma adlarını buraya yazın.
