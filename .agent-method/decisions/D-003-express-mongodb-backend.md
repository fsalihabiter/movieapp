---
id: D-003
title: Express.js ve MongoDB / Mongoose Veri Tabanı Mimarisi
status: accepted
scope: architecture
created: "2026-09-22"
supersedes: null
superseded_by: null
---

# D-003 — Express.js ve MongoDB / Mongoose Veri Tabanı Mimarisi

## Context
Kullanıcı hesapları, özel film/dizi listeleri ve favori içeriklerinin kalıcı, ilişkisel olmayan ve esnek bir yapıda saklanması gerekmektedir.

## Decision
Arka yüz servisi Express.js (Node.js) üzerinde inşa edilecek, veri tabanı olarak MongoDB kullanılacak ve veri modelleme Mongoose ODM ile gerçekleştirilecektir.

## Consequences
- Şema tabanlı doğrulama ve referanslama (`ref: 'User'`) ile veri bütünlüğü.
- JSON tabanlı RESTful API uç noktaları (`/api/auth`, `/api/lists`).
- Geliştirme ortamında ortam değişkenleri `.env` üzerinden yönetilir.

## Keywords (for Doctor drift detection)
- ExpressApp
- Mongoose
- UserSchema
- ListSchema
- MongoDBConnection
