# CAPABILITIES — reuse registry (canonical)

> GD reuse analysis scans this file FIRST. adm-close asks whether it needs updating.

```yaml
- capability: Authentication
  location: server/routes/auth.js, src/context/AuthContext.js, src/services/api.js
  status: healthy
  scope: all
  owner: Auth & Security
  public_api: api.post('/auth/login'), api.post('/auth/register'), api.post('/auth/refresh')
  description: JWT access token ve HTTP-Only cookie tabanlı refresh token ile kullanıcı oturumu yönetimi.

- capability: UserLists
  location: server/routes/lists.js, server/models/List.js, src/pages/MyLists.js, src/pages/MyFavorites.js, src/components/MovieDetails/AddToListDialog.js
  status: healthy
  scope: all
  owner: User Data
  public_api: api.get('/lists'), api.post('/lists'), api.post('/lists/:id/items'), api.delete('/lists/:id')
  description: Kullanıcıların özel ve sistem listeleri (favoriler vb.) üzerinde CRUD işlemleri ve modal üzerinden tek tıkla liste yönetimi.

- capability: MediaDetails
  location: src/components/MovieDetails/Detailed.js, src/components/MovieDetails/AllCastDialog.js, src/components/MovieDetails/TrailerDialog.js
  status: healthy
  scope: all
  owner: Catalog & Media
  public_api: Detailed, AllCastDialog, TrailerDialog
  description: Zengin film/dizi meta verileri, tüm oyuncu kadrosu görüntüleme ve dahili YouTube fragman oynatıcı.

- capability: MediaCatalog
  location: src/pages/Movies.js, src/pages/Series.js, src/pages/Actors.js, src/components/MovieList.js
  status: healthy
  scope: all
  owner: Catalog
  public_api: TMDb API ve yerel liste entegrasyonu
  description: Film, dizi ve oyuncu listeleme, filtreleme, kategori ve detay sunumu.

- capability: Localization
  location: src/i18n.js, src/locales/
  status: healthy
  scope: all
  owner: UI Core
  public_api: i18n, useTranslation
  description: i18next ile Türkçe ve İngilizce dil desteği ve dinamik dil değiştirme.
```
