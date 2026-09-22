---
doctor_run_id: DOCTOR-001
timestamp: "2026-09-22T21:43:00+03:00"
runtime: antigravity
mode: full
scope: repository
status: findings
findings:
  - id: DR-001
    severity: high
    evidence: proven
    check: INV-02
    file: .agent-method/charter/PHASES.md
    summary: PHASE-001 'intent_goals: [G-1]' referansına sahip ancak PROJECT_INTENT.md içindeki G-1 hedefi tanımlanmamış şablon halinde.
    canonical_source: .agent-method/charter/PROJECT_INTENT.md
    status: open
  - id: DR-002
    severity: medium
    evidence: proven
    check: charter-unpopulated
    file: .agent-method/charter/PROJECT_INTENT.md
    summary: PROJECT_INTENT.md henüz doldurulmamış; şablon yorumları ve boş maddeler içeriyor. Semantik drift denetimleri için gerekli somut kapsam dışı anahtar kelimeler bulunmuyor.
    canonical_source: .agent-method/charter/PROJECT_INTENT.md
    status: open
  - id: DR-003
    severity: low
    evidence: proven
    check: state-placeholder
    file: .agent-method/state.yaml
    summary: state.yaml içindeki project.id ('my-project') ve project.name ('My Project') genel şablon değerleri taşıyor; repo paket adı ('movieapp') ile senkronize edilmemiş.
    canonical_source: package.json
    status: open
  - id: DR-004
    severity: medium
    evidence: proven
    check: git-untracked-canonical
    file: .agent-method/
    summary: .agent-method/, .agents/, .claude/ ve AGENTS.md dosyaları Git takibinde değil (untracked). ADM metodolojisinin kalıcılığı ve kanıt izlenebilirliği için Git'e commit edilmelidir.
    canonical_source: git status
    status: open
---

# DOCTOR-001 Denetim Raporu

- **Tarih:** 2026-09-22 21:43:00 (+03:00)
- **Çalışma Ortamı (Runtime):** Antigravity
- **Kapsam:** Tam depo (Full / Structural + Semantic)
- **Durum:** `findings` (4 açık bulgu, 0 engelleyici kritik bulgu)

## 1. Denetim Özeti
ADM çerçevesinin mevcut durumu, `docs/INVARIANTS.md` listesi ve projenin genel yapısı incelendi.
Temel yapısal mekanizma (şemalar, Claude shim'leri, döngü şablonları, tekil oturum kuralı vb.) sağlıklı durumdadır. Ancak projenin ADM başlangıç (charter/bootstrap) aşamasında kaldığı, `PROJECT_INTENT.md` ve `PHASES.md` dosyalarının henüz projeye (`movieapp`) özgü olarak yapılandırılmadığı tespit edilmiştir.

## 2. Yapısal Denetimler (Structural Invariants)
- **INV-01 (GD -> Phase):** Geçerli. Tanımlı aktif veya tamamlanmış yetim GD bulunmamaktadır.
- **INV-02 (Phase -> Intent Goal):** ⚠️ **BAŞARISIZ (DR-001).** `PHASES.md` içindeki PHASE-001 hedefi `G-1` olarak belirtilmiş fakat `PROJECT_INTENT.md` dosyasında `G-1` tanımlanmamıştır.
- **INV-03 (Tek Aktif Faz):** Geçerli.
- **INV-04 / INV-05 (Aktif GD Durumu):** Geçerli (`state.yaml` içinde aktif GD `null`).
- **INV-06 / INV-07 / INV-08 (Kabul Kriterleri & Test Borcu):** Geçerli.
- **INV-09 / INV-10 / INV-11 (Benzersiz Kimlikler):** Geçerli.
- **INV-12 / INV-17 (Üretilen Dosyalar / Projections):** Geçerli (`projections: []`, `generated/` klasörü yok).
- **INV-13 (Tek Aktif Oturum):** Geçerli (`state.yaml` oturum bloğu temiz, stale session yok).
- **INV-14 (Runtime Bağımsızlığı):** Geçerli.
- **INV-15 (Çekirdek Komut Bağımsızlığı):** Geçerli.
- **INV-16 (Claude Shim Doğrulaması):** Geçerli. `.agents/skills/` altındaki 7 kanonik beceri için `.claude/skills/` altındaki shim'ler mevcut ve hedefleri doğru.
- **INV-18 (Kritik Bulgular):** Geçerli (kritik seviyede açık bulgu yok).

## 3. Semantik Denetimler (Semantic Drift)
- `PROJECT_INTENT.md` Bölüm 3 (Kapsam dışı somut kavram/modül listesi) ve `decisions/` kayıtları boş olduğu için anahtar kelime tabanlı kod sapması (intent drift) mekanik olarak işletilememiştir.
- Kod tabanında Create React App tabanlı bir film uygulaması (`movieapp`) mevcutken, ADM state ve charter dosyalarında projenin amaç ve hedefleri henüz belgelenmemiştir.

## 4. Bulgular ve Önerilen Eylemler

### [DR-001] (Yüksek - Proven) INV-02: PHASE-001 Hedef Eşleşmesi Eksik
- **Açıklama:** `PHASES.md` içinde yer alan `intent_goals: [G-1]` referansı, `PROJECT_INTENT.md` içinde tanımlı bir hedefe işaret etmiyor.
- **Öneri:** `PROJECT_INTENT.md` içine projenin ölçülebilir hedefleri (ör. G-1, G-2) girilmeli veya `adm-analyze` / `adm-bootstrap` ile charter yapılandırılmalıdır.

### [DR-002] (Orta - Proven) charter-unpopulated: PROJECT_INTENT.md Doldurulmamış
- **Açıklama:** `PROJECT_INTENT.md` henüz taslak şablon aşamasındadır. Amaç, hedefler, kapsam dışı öğeler, kısıtlar ve başarı kriteri tanımlanmamıştır.
- **Öneri:** Mevcut React film uygulaması göz önünde bulundurularak amaç ve hedefler netleştirilmelidir.

### [DR-003] (Düşük - Proven) state-placeholder: Proje Bilgileri Şablon Değerlerinde
- **Açıklama:** `state.yaml` dosyasında proje `id: my-project`, `name: My Project` olarak bırakılmıştır. `package.json` dosyasında ise projenin adı `movieapp` olarak geçmektedir.
- **Öneri:** `state.yaml` dosyasındaki `project` bloğu `id: movieapp`, `name: Movie App` olarak güncellenmelidir.

### [DR-004] (Orta - Proven) git-untracked-canonical: ADM Dosyaları Git Takibinde Değil
- **Açıklama:** `.agent-method/`, `.agents/`, `.claude/`, `AGENTS.md` ve diğer ADM dokümanları Git deposuna henüz eklenmemiştir.
- **Öneri:** Dosyalar `git add` ve `git commit` ile depoya dahil edilmelidir.
