---
id: D-001
title: JWT Access Token ve HTTP-Only Cookie Tabanlı Refresh Token Mimarisi
status: accepted
scope: architecture
created: "2026-09-22"
supersedes: null
superseded_by: null
---

# D-001 — JWT Access Token ve HTTP-Only Cookie Tabanlı Refresh Token Mimarisi

## Context
Kullanıcıların oturum açma, oturumu sürdürme ve korumalı kaynaklara erişim ihtiyacı bulunmaktadır. Tarayıcıda token saklama yöntemleri XSS ve CSRF risklerini dengelemelidir.

## Decision
Kısa ömürlü Access Token istemci tarafında (`localStorage`) tutulacak ve her istekte `token: Bearer <token>` başlığıyla iletilecektir. Uzun ömürlü Refresh Token ise `httpOnly`, `sameSite` özellikli güvenli çerezde (cookie) saklanacak, access token süresi dolduğunda Axios interceptor üzerinden otomatik olarak yenilenecektir.

## Consequences
- XSS ile refresh token çalınamaz.
- Kullanıcı deneyimi kesintiye uğramadan oturum tazelenir.
- CORS ayarlarında `credentials: true` ve izinli origin tanımları zorunludur.

## Keywords (for Doctor drift detection)
- accessToken
- refreshToken
- cookieParser
- AuthContext
- api.interceptors
