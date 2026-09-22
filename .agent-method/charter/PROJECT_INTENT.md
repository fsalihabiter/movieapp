# PROJECT_INTENT

> Canonical source of the project's purpose. Everything else derives from this.
> Body is written in the project's human language (config: method.language = tr).

## 1. Amaç (Purpose)
MovieApp, kullanıcıların güncel ve popüler film, dizi ve oyuncu bilgilerini keşfedebilecekleri, detaylı inceleme yapabilecekleri, kişisel izleme ve favori listeleri oluşturarak organize edebilecekleri modern bir tam yığın (full-stack) web uygulamasıdır.

## 2. Hedefler (Goals)
- G-1: Popüler, vizyondaki ve kategorize edilmiş film/dizi/oyuncu içeriklerini zengin detay sayfalarıyla kullanıcılara sunmak.
- G-2: JWT ve HTTP-Only cookie tabanlı güvenli kimlik doğrulama (kayıt, giriş, oturum tazeleme) altyapısı sağlamak.
- G-3: Kullanıcıların kişisel favori ve özel listelerini MongoDB üzerinde kalıcı olarak yönetmesini (oluşturma, ekleme, silme, güncelleme) sağlamak.
- G-4: Çoklu dil desteği (Türkçe ve İngilizce) ve modern duyarlı (responsive) bir kullanıcı arayüzü sunmak.

## 3. Kapsam dışı (Out of scope / will-not-do)
<!-- Doctor'ın drift tespiti bu listedeki SOMUT kavram/sınıf/modül adlarını
     anahtar kelime olarak kullanır. Yoruma açık ifade yazma. -->
- Stripe, PayPal, Subscription, PaymentGateway (Ödeme ve abonelik sistemleri)
- VideoUpload, StreamingServer, HLS, WebRTC (Doğrudan video barındırma ve medya akışı)
- SocketIO, WebSocket, ChatRoom (Canlı sohbet veya anlık mesajlaşma)
- FlutterApp, ReactNative, MobileNative (Ayrı mobil uygulama kod tabanları)

## 4. Kısıtlar (Constraints)
- Frontend: React 18, React Router v6, Material-UI (MUI), Axios
- Backend: Node.js, Express.js (v5), Mongoose, MongoDB
- Güvenlik: Access token localStorage, refresh token HTTP-Only cookie ile taşınmalıdır.
- Çoklu dil: `i18next` ve `react-i18next` kütüphaneleri kullanılmalıdır.

## 5. Başarı kriteri (Definition of success)
- Kullanıcı arayüzünde tüm film/dizi/oyuncu rotaları hatasız çalışmalıdır.
- Kimlik doğrulama akışı (login, logout, token refresh) uçtan uca çalışmalıdır.
- Kullanıcılar kendi listelerine içerik ekleyip çıkarabilmeli ve favorilerini yönetebilmelidir.
- Temel arayüz bileşenleri için birim testleri başarıyla tamamlanmalıdır.
