---
id: D-002
title: React 18 ve Material-UI (MUI) ile Bileşen ve Sayfa Mimarisi
status: accepted
scope: architecture
created: "2026-09-22"
supersedes: null
superseded_by: null
---

# D-002 — React 18 ve Material-UI (MUI) ile Bileşen ve Sayfa Mimarisi

## Context
Film uygulamasında zengin medya kartları, karuseller, gezinme çubukları ve detay modal/sayfaları içeren modern, tutarlı ve duyarlı bir kullanıcı arayüzü gerekmektedir.

## Decision
Kullanıcı arayüzü React 18 üzerinde `@mui/material`, `@emotion/styled` ve `react-router-dom` v6 ile yapılandırılacaktır. Sayfa bazlı rotalama `App.js` içinde tanımlanacak, yetkilendirme gerektiren rotalar `ProtectedRoute` bileşeni ile sarılacaktır.

## Consequences
- Hazır ve erişilebilir tema bileşenleri sayesinde hızlı UI geliştirme.
- Styled-components / Emotion ile esnek özel CSS stillendirmesi.
- React Router v6 ile deklaratif ve güvenli sayfa geçişleri.

## Keywords (for Doctor drift detection)
- MaterialUI
- ThemeProvider
- BrowserRouter
- ProtectedRoute
- MenuBar
