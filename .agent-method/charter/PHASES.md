# PHASES

> Canonical structure of the project. One active phase unless config says otherwise (INV-03).
> Progress percentages are DERIVED — do not store them here.

## PHASE-001 — Temel Mimari, Keşif ve Arayüz
- status: completed
- intent_goals: [G-1, G-2, G-4]
- summary: React + MUI arayüzü, React Router navigasyonu, Express sunucusu ve temel JWT kimlik doğrulama altyapısı kuruldu.
- entry_criteria:
  - Temel repo ve proje şablonunun oluşturulması.
- exit_criteria:
  - Film, dizi, oyuncu sayfalarının ve menü yapısının görüntülenmesi.
  - Kayıt ve giriş arayüzlerinin çalışması.
- gd_range: GD-001..GD-003

## PHASE-002 — Liste ve Favori Yönetimi Entegrasyonu
- status: active
- intent_goals: [G-3]
- summary: MongoDB üzerinde kullanıcıya ait sistem listeleri (favoriler, izleme listesi) ve özel listelerin tam CRUD işlemleri ile frontend entegrasyonu.
- entry_criteria:
  - PHASE-001 tamamlanmış olmalı.
  - MongoDB bağlantısı ve List/User şemaları hazır olmalı.
- exit_criteria:
  - Detay sayfalarından listelere içerik eklenebilmeli.
  - MyLists ve MyFavorites sayfalarında listeler güncellenebilmeli.
- gd_range: GD-004..GD-007

## PHASE-003 — Test, Güvenlik ve Stabilizasyon
- status: planned
- intent_goals: [G-1, G-2, G-3, G-4]
- summary: Frontend ve backend için otomatik birim/entegrasyon testlerinin yazılması, hata yönetimi ve performans iyileştirmeleri.
- entry_criteria:
  - PHASE-002 tamamlanmış olmalı.
- exit_criteria:
  - Jest / React Testing Library testlerinin kritik akışları kapsaması.
  - Backend hata middleware'lerinin standartlaştırılması.
- gd_range: GD-008..GD-012
