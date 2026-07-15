# postgresql-multi-model

**User:** Anonymous  
**Created:** 7/15/2026 19:43:18  
**Updated:** 7/15/2026 21:14:06  
**Exported:** 7/15/2026 21:26:02  
**Link:** [https://chatgpt.com/g/g-p-6a539ddc858881919467b6da20df4567-cheatsheet/c/6a57805d-9c00-83ec-8743-302312d47081](https://chatgpt.com/g/g-p-6a539ddc858881919467b6da20df4567-cheatsheet/c/6a57805d-9c00-83ec-8743-302312d47081)  

## Response:
7/15/2026, 7:44:37 PM

Saya akan framing ini sebagai “PostgreSQL as multi-model database” untuk tiga mode praktis: key-value, document/JSON, dan geospatial. Saya akan pakai rujukan official PostgreSQL/PostGIS agar terminologi dan fitur tidak ngarang.

Strukturnya saya bagi menjadi 3 domain utama, tetapi saya tambahkan lapisan lintas-domain seperti indexing, schema governance, performance, migration, dan operational risk karena itulah yang biasanya menentukan apakah pola ini aman dipakai di production.

## Introduction

PostgreSQL bisa dipakai sebagai **multi-model database**: relational tetap menjadi fondasi utama, tetapi ia juga punya kemampuan **key-value**, **document/JSON**, dan **geospatial** melalui tipe data native, extension, operator, indexing, dan constraint. Untuk stack enterprise, pola ini berguna saat kita ingin fleksibilitas seperti NoSQL/GIS tanpa kehilangan transaksi ACID, SQL, foreign key, migration discipline, auditability, dan operational tooling PostgreSQL.

Batas pentingnya: PostgreSQL **bukan pengganti universal Redis, MongoDB, atau dedicated GIS/search engine**. Ia cocok ketika data semi-structured/spatial masih perlu hidup dekat dengan relational core. Untuk key-value ultra-low-latency volatile cache, Redis tetap lebih tepat; untuk document workload dengan schema sangat bebas dan massive horizontal document sharding, dedicated document DB bisa lebih cocok; untuk spatial analytics skala sangat besar, arsitektur OLAP/GIS khusus mungkin dibutuhkan.

Secara fitur, PostgreSQL mendukung `json` dan `jsonb`; `jsonb` disimpan dalam format binary decomposed sehingga lebih efisien untuk query dibanding `json` yang menyimpan salinan teks input dan perlu reparsing saat diproses. PostgreSQL juga punya `hstore` sebagai extension key/value berbasis text key-value, serta index types seperti B-tree, Hash, GiST, SP-GiST, GIN, dan BRIN yang masing-masing cocok untuk pola query berbeda. Untuk geospatial, PostGIS menambahkan tipe, fungsi, dan spatial indexing di atas PostgreSQL. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html))

---

## Diagram

```text
PostgreSQL Multi-Model Practical Skill Map
│
├── 1. Foundation Layer
│   ├── Relational core: table, FK, constraint, transaction, migration
│   ├── Extension governance: hstore, postgis, pg_trgm, btree_gin, btree_gist
│   ├── Index strategy: B-tree, Hash, GIN, GiST, SP-GiST, BRIN
│   └── Operational safety: EXPLAIN, VACUUM, ANALYZE, bloat, lock, migration
│
├── 2. Key-Value Database Patterns
│   ├── Simple KV table: key, value, metadata, version, expires_at
│   ├── hstore: text key/value attributes inside one column
│   ├── jsonb as KV: richer typed values, nested maps, arrays
│   ├── Sparse attribute / EAV replacement
│   ├── Config / feature flag / tenant settings
│   └── Indexing: unique key, expression index, partial index, GIN
│
├── 3. Document Database Patterns
│   ├── json vs jsonb decision
│   ├── Document table: id, type, payload, status, version, timestamps
│   ├── JSON operators: field access, containment, existence, path query
│   ├── Schema governance: CHECK, generated columns, validation pipeline
│   ├── Query acceleration: GIN, expression index, partial index
│   └── Lifecycle: versioning, audit, outbox, retention, migration
│
└── 4. Geospatial Database Patterns
    ├── PostGIS extension enablement
    ├── geometry vs geography, SRID, projection
    ├── Spatial predicates: intersects, contains, within, overlaps
    ├── Proximity: ST_DWithin, ST_Distance, nearest-neighbor
    ├── Spatial indexing: GiST, SP-GiST, BRIN
    ├── Spatial joins, clipping, buffering, aggregation
    └── Advanced: raster, topology, routing, geocoding
```

---

## Tabular Decomposition Map

| Area | Practical category / skill | Yang perlu dikuasai | Fokus production |
|---|---|---|---|
| Foundation | Multi-model boundary | Memahami kapan PostgreSQL layak dipakai sebagai KV/document/geospatial store dan kapan perlu Redis/MongoDB/search engine/GIS khusus. | Jangan memakai JSONB/hstore untuk semua hal; tetap normalisasi data yang punya relasi kuat, constraint kuat, dan query transaksional kompleks. |
| Foundation | Extension governance | Mengelola `CREATE EXTENSION`, ownership, migration, environment parity, dan compatibility antar environment. | Extension harus masuk migration tool seperti Flyway/Liquibase, bukan manual di production. PostgreSQL extension perlu diregistrasikan dengan `CREATE EXTENSION`. ([PostgreSQL](https://www.postgresql.org/docs/current/contrib.html?utm_source=chatgpt.com)) |
| Foundation | Index type literacy | Memilih B-tree, Hash, GIN, GiST, SP-GiST, BRIN sesuai access pattern. | PostgreSQL menyediakan beberapa index type, dan masing-masing cocok untuk operator/query berbeda; salah pilih index sering membuat JSONB/spatial query tetap lambat. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-types.html)) |
| Foundation | Expression index | Index pada ekspresi seperti `(payload->>'customerId')`, `lower(key)`, atau computed geometry expression. | Cocok untuk field semi-structured yang sering difilter/sort; PostgreSQL mendukung index pada function/scalar expression. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-expressional.html)) |
| Foundation | Partial index | Index hanya subset data, misalnya document aktif, tenant tertentu, atau `expires_at IS NULL`. | Bagus untuk workload dengan hot subset; predicate query harus match dengan predicate index agar planner bisa memakai index. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-partial.html)) |
| Foundation | Partitioning | Range/list/hash partition untuk dokumen/event/spatial data besar berdasarkan waktu, tenant, region, atau hash key. | PostgreSQL declarative partitioning mendukung range, list, dan hash partitioning; berguna untuk retention dan maintenance data besar. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html)) |
| Key-value | Simple KV table | Pola tabel `kv_store(key text primary key, value jsonb/text/bytea, version, updated_at, expires_at)`. | Paling mudah diberi constraint, TTL semu, optimistic locking, audit, dan ownership domain. |
| Key-value | Namespaced key design | Format key seperti `tenant:module:entity:id:attribute`, atau pakai kolom terpisah `tenant_id`, `namespace`, `key`. | Lebih baik kolom terpisah jika butuh query, filtering, RLS, dan index selective. Jangan bergantung pada string parsing key untuk domain penting. |
| Key-value | `hstore` | Menyimpan atribut key/value text sederhana dalam satu kolom. | Cocok untuk sparse attributes sederhana; `hstore` menyimpan key/value text dan setiap key dalam satu hstore bersifat unik. ([PostgreSQL](https://www.postgresql.org/docs/current/hstore.html)) |
| Key-value | `jsonb` as KV | Menyimpan value lebih kaya: string, number, boolean, object, array, nested map. | Lebih fleksibel dari `hstore`; cocok jika value tidak semuanya text atau butuh nested object. |
| Key-value | Config / tenant settings | Menyimpan konfigurasi per tenant, per service, per feature, per environment. | Harus ada versioning, validation, fallback/default resolution, dan cache invalidation strategy. |
| Key-value | Feature flag storage | Key-value untuk flag, rollout percentage, targeting rules, override per tenant/user. | Jangan hanya simpan JSON; butuh audit trail, effective date, approval state, dan safe default. |
| Key-value | Idempotency key store | Menyimpan request idempotency key, response hash/result, status, expiry. | Gunakan unique constraint, transaction boundary yang jelas, dan cleanup berbasis `expires_at`. |
| Key-value | Optimistic concurrency | `version`, `updated_at`, atau compare-and-swap style update. | Penting untuk config/KV yang diedit banyak actor; hindari lost update. |
| Key-value | KV indexing | B-tree untuk key lookup, expression index untuk extracted value, GIN untuk containment/existence. | Jangan membuat GIN besar tanpa access pattern jelas; GIN dirancang untuk composite values saat query mencari element/key di dalam item. ([PostgreSQL](https://www.postgresql.org/docs/current/gin.html)) |
| Document | `json` vs `jsonb` | `json` menyimpan input text; `jsonb` lebih efisien untuk processing dan indexing. | Untuk production queryable document store, default praktis biasanya `jsonb`; `json` hanya dipilih jika exact input formatting/order punya alasan khusus. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html)) |
| Document | Document table model | Pola `documents(id, doc_type, payload jsonb, status, version, created_at, updated_at)`. | Jangan hanya punya `id + payload`; tambahkan metadata queryable sebagai kolom biasa untuk lifecycle, filtering, ownership, dan audit. |
| Document | Hybrid relational + document | Kolom relational untuk invariant utama, `jsonb` untuk detail fleksibel. | Ini biasanya pola enterprise terbaik: constraint kuat tetap di relational column, fleksibilitas ada di payload. |
| Document | JSON field access | Menggunakan operator field access, text extraction, containment, existence, dan array/object traversal. | Pastikan query API membatasi path yang boleh diquery agar tidak membuka arbitrary expensive query dari client. |
| Document | JSONPath / SQL-JSON | Query path kompleks memakai `jsonpath`, `jsonb_path_exists`, `jsonb_path_query`, dan keluarga fungsi terkait. | Berguna untuk predicate nested yang lebih ekspresif; PostgreSQL menyediakan fungsi dan operator JSON termasuk SQL/JSON path. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html)) |
| Document | Schema governance | CHECK constraint, generated columns, application-level JSON schema validation, migration payload version. | PostgreSQL tidak otomatis memahami business schema dalam JSON; validasi harus dirancang eksplisit. |
| Document | Generated columns / extracted columns | Field penting dari JSON dipromosikan ke generated/stored column atau duplicated indexed column. | Gunakan untuk field yang sering dipakai filter, join, sort, unique rule, atau foreign-key-like validation. |
| Document | GIN index strategy | GIN pada payload untuk containment/existence query. | GIN kuat untuk mencari element/key dalam composite value, tetapi write overhead dan ukuran index harus dipantau. ([PostgreSQL](https://www.postgresql.org/docs/current/gin.html)) |
| Document | Expression / partial indexes | Index pada `(payload->>'status')`, `(payload->'customer'->>'id')`, atau hanya `WHERE doc_type='case'`. | Lebih murah dan predictable daripada satu GIN global besar jika query pattern sempit. |
| Document | Document versioning | Simpan `schema_version`, `payload_version`, previous payload, atau event/audit table. | Wajib untuk regulatory/case-management domain karena payload berubah seiring aturan bisnis. |
| Document | Document mutation pattern | `jsonb_set`, merge, patch semantic, full replacement, atau command-based mutation. | Full replacement lebih sederhana diaudit; patch lebih efisien tetapi rawan conflict dan validation gap. |
| Document | Search boundary | JSONB bukan full-text/search engine lengkap. | Untuk keyword search kompleks, ranking, fuzzy search, atau semantic search, pertimbangkan PostgreSQL full-text/pg_trgm atau search engine khusus. |
| Geospatial | PostGIS enablement | `CREATE EXTENSION postgis`, opsional raster/topology/geocoder/routing extension. | PostGIS extension harus diaktifkan per database; beberapa extension tambahan seperti raster/topology/routing perlu di-enable terpisah sesuai kebutuhan. ([PostGIS](https://postgis.net/documentation/getting_started/install_windows/enabling_postgis/)) |
| Geospatial | `geometry` vs `geography` | `geometry` untuk koordinat planar/projection-aware; `geography` untuk bumi/spherical calculations. | Salah pilih tipe/SRID menyebabkan hasil jarak/area salah atau query lambat. |
| Geospatial | SRID & projection | Memahami SRID, `ST_SetSRID`, `ST_Transform`, unit meter/degree, local projection. | Jangan hitung distance meter di data degree tanpa memahami tipe dan projection. |
| Geospatial | Spatial data modeling | Point, LineString, Polygon, MultiPolygon, collection, administrative boundary, service area. | Validasi tipe geometry dan SRID dengan constraint agar data tidak campur sembarangan. |
| Geospatial | Spatial predicates | `ST_Intersects`, `ST_Contains`, `ST_Within`, `ST_Overlaps`, `ST_Touches`, dll. | Banyak predicate PostGIS index-aware dan otomatis menambahkan bounding-box operator sebagai filter awal. ([PostGIS](https://postgis.net/docs/manual-3.2/using_postgis_query.html)) |
| Geospatial | Distance query | `ST_DWithin` untuk “dalam radius”; `ST_Distance` untuk menghitung jarak. | Untuk large table, filter dengan `ST_DWithin` lebih index-friendly daripada langsung `ST_Distance(...) < radius`; docs PostGIS menegaskan `ST_Distance` tidak memakai index untuk optimasi operasi. ([PostGIS](https://postgis.net/docs/manual-3.2/using_postgis_query.html)) |
| Geospatial | Nearest neighbor / KNN | Query nearest dengan `ORDER BY geom <-> constant_geom LIMIT n`. | Operator `<->` mendukung index-assisted nearest-neighbor saat dipakai di `ORDER BY`, dengan catatan penggunaan index bergantung pada bentuk query. ([PostGIS](https://postgis.net/docs/geometry_distance_knn.html)) |
| Geospatial | Spatial indexing | GiST default umum, SP-GiST untuk partitioned spatial structures tertentu, BRIN untuk data besar yang spatially sorted. | PostGIS memakai R-tree di atas GiST; docs juga menyebut BRIN dan SP-GiST sebagai opsi untuk data multi-dimensional dengan karakteristik tertentu. ([PostGIS](https://postgis.net/docs/using_postgis_dbmanagement.html)) |
| Geospatial | Spatial joins | Join lokasi ke boundary, point-in-polygon, service coverage, nearest facility, route zone. | Selalu desain join agar spatial index bisa menjadi primary filter; cek dengan `EXPLAIN ANALYZE`. |
| Geospatial | Geometry validation | `ST_IsValid`, `ST_MakeValid`, ring orientation, duplicate points, invalid polygons. | Data spatial dari eksternal sering kotor; validasi penting sebelum join/analytics. |
| Geospatial | Buffer, intersection, union | `ST_Buffer`, `ST_Intersection`, `ST_Union`, clipping, dissolve, coverage calculation. | Operasi ini mahal; precompute/materialize untuk data yang jarang berubah. |
| Geospatial | Raster/topology/routing | Raster untuk grid/image spatial; topology untuk network/edge-node; pgRouting untuk network routing. | Jangan enable advanced extension tanpa use case jelas; ada cost operational dan migration. PostGIS bundle menyediakan extension seperti raster, topology, dan pgRouting yang dapat diaktifkan sesuai kebutuhan. ([PostGIS](https://postgis.net/documentation/getting_started/install_windows/enabling_postgis/)) |
| Cross-cutting | Data lifecycle & retention | TTL semu via `expires_at`, partition detach/drop, archival, cold storage. | PostgreSQL tidak punya TTL native seperti cache store; lifecycle perlu job, partition, atau scheduled cleanup. |
| Cross-cutting | Security & tenancy | RLS, tenant_id, namespace ownership, data masking, audit. | Untuk JSONB/KV, jangan sembunyikan tenant/security boundary hanya di dalam payload; jadikan kolom biasa. |
| Cross-cutting | Query governance | Batasi dynamic JSON/spatial filters dari API. | Arbitrary filter dari client bisa memicu seq scan, expensive spatial operation, atau GIN overload. |
| Cross-cutting | Observability | `pg_stat_statements`, slow query log, `EXPLAIN (ANALYZE, BUFFERS)`, index usage. | JSONB/spatial performance harus diukur dari actual query shape, bukan asumsi index sudah cukup. |

---

## Roadmap Alur Belajar yang Direkomendasikan

1. **Mulai dari boundary decision**: kapan pakai relational normal, kapan `jsonb`, kapan `hstore`, kapan PostGIS, dan kapan perlu external specialized store.  
2. **Pelajari index types PostgreSQL**: B-tree, Hash, GIN, GiST, SP-GiST, BRIN; ini fondasi semua pola KV/document/geospatial.  
3. **Masuk ke key-value pattern**: simple KV table, `hstore`, `jsonb`, idempotency key, tenant config, optimistic locking.  
4. **Masuk ke document pattern**: `jsonb` payload design, metadata columns, JSON operators, JSONPath, schema versioning, validation.  
5. **Pelajari indexing document**: GIN vs expression index vs partial index; biasakan validasi dengan `EXPLAIN ANALYZE`.  
6. **Masuk ke PostGIS basic**: enable extension, `geometry` vs `geography`, SRID, point/line/polygon, spatial predicates.  
7. **Masuk ke spatial performance**: GiST index, `ST_DWithin`, KNN `<->`, spatial join, bounding-box behavior, materialization.  
8. **Tutup dengan production hardening**: migration, audit, retention, partitioning, backup/restore, security, observability, query governance.

---

## Rekomendasi Materi Selanjutnya

Lanjutkan ke **Cheatsheet PostgreSQL Multi-Model Series 1: Key-Value Patterns with PostgreSQL - KV table, hstore, jsonb, idempotency key, config store, feature flag, TTL pattern, indexing, dan concurrency control**.  
Kalau dijadikan seri lengkap, saya rekomendasikan **16 seri** untuk topik PostgreSQL key-value, document, dan geospatial ini.

---

**Sources:**

- [PostgreSQL: Documentation: 18: 8.14. JSON Types](https://www.postgresql.org/docs/current/datatype-json.html)
- [Enabling PostGIS | PostGIS](https://postgis.net/documentation/getting_started/install_windows/enabling_postgis/)

## Response:
7/15/2026, 7:46:44 PM

Total saya rekomendasikan: **16 seri**.

Rinciannya:

| Seri | Topik |
|---:|---|
| 1 | PostgreSQL as Multi-Model Database: boundary, trade-off, dan use case |
| 2 | Key-Value Pattern: simple KV table, namespace, metadata, TTL |
| 3 | PostgreSQL `hstore`: use case, operator, indexing, limitation |
| 4 | `jsonb` as Key-Value Store: config, feature flag, tenant setting |
| 5 | Idempotency Key Store, distributed lock-lite, optimistic concurrency |
| 6 | Document Database Pattern dengan `jsonb`: document table design |
| 7 | JSON/JSONB Operators, Functions, JSONPath |
| 8 | JSONB Indexing: GIN, expression index, partial index |
| 9 | Document Schema Governance: validation, versioning, generated columns |
| 10 | Document Mutation Pattern: patch, merge, audit, event/outbox |
| 11 | PostGIS Foundation: geometry, geography, SRID, projection |
| 12 | Spatial Data Modeling: point, line, polygon, multipolygon, boundary |
| 13 | Spatial Query Pattern: contains, within, intersects, overlaps |
| 14 | Distance & Nearest Neighbor: `ST_DWithin`, `ST_Distance`, KNN `<->` |
| 15 | Spatial Indexing & Performance: GiST, SP-GiST, BRIN, spatial join |
| 16 | Production Hardening: migration, partitioning, observability, security, retention |

Jadi totalnya **16 seri**, dengan urutan dari **foundation → key-value → document → geospatial → production hardening**.

## Response:
7/15/2026, 7:57:56 PM

Saya pahami sebagai: total seri ditambah supaya masing-masing tipe database punya seri integrasi Java/Jersey/MyBatis sendiri: key-value, document, dan geospatial. Saya mulai dari seri foundation dulu, lalu nanti urutan masuk ke praktik per tipe database.

Siap. Saya tambahkan **3 seri integrasi Java/Jersey/MyBatis**, masing-masing di akhir blok tipe database.

Total seri berubah dari **16 menjadi 19 seri**.

## Updated Series Plan - PostgreSQL Key-Value, Document, Geospatial

| Seri | Topik |
|---:|---|
| 1 | PostgreSQL as Multi-Model Database: boundary, trade-off, dan use case |
| 2 | Key-Value Pattern: simple KV table, namespace, metadata, TTL |
| 3 | PostgreSQL `hstore`: use case, operator, indexing, limitation |
| 4 | `jsonb` as Key-Value Store: config, feature flag, tenant setting |
| 5 | Idempotency Key Store, distributed lock-lite, optimistic concurrency |
| 6 | **Java/Jersey/MyBatis Integration Pattern for PostgreSQL Key-Value Database** |
| 7 | Document Database Pattern dengan `jsonb`: document table design |
| 8 | JSON/JSONB Operators, Functions, JSONPath |
| 9 | JSONB Indexing: GIN, expression index, partial index |
| 10 | Document Schema Governance: validation, versioning, generated columns |
| 11 | Document Mutation Pattern: patch, merge, audit, event/outbox |
| 12 | **Java/Jersey/MyBatis Integration Pattern for PostgreSQL Document Database** |
| 13 | PostGIS Foundation: geometry, geography, SRID, projection |
| 14 | Spatial Data Modeling: point, line, polygon, multipolygon, boundary |
| 15 | Spatial Query Pattern: contains, within, intersects, overlaps |
| 16 | Distance & Nearest Neighbor: `ST_DWithin`, `ST_Distance`, KNN `<->` |
| 17 | Spatial Indexing & Performance: GiST, SP-GiST, BRIN, spatial join |
| 18 | Production Hardening: migration, partitioning, observability, security, retention |
| 19 | **Java/Jersey/MyBatis Integration Pattern for PostgreSQL Geospatial Database** |

---

# Seri 1/19 - PostgreSQL as Multi-Model Database: Boundary, Trade-off, dan Use Case

## 1. Tujuan Seri Ini

Seri pertama ini adalah fondasi praktis untuk menentukan kapan PostgreSQL layak dipakai sebagai:

1. **Key-value database**
2. **Document database**
3. **Geospatial database**

Intinya bukan “PostgreSQL bisa semua”, tetapi **kapan PostgreSQL cukup tepat, kapan berbahaya, dan bagaimana desain awalnya agar tidak menjadi technical debt**.

PostgreSQL punya dukungan native untuk JSON melalui `json` dan `jsonb`; `jsonb` disimpan dalam bentuk binary decomposed sehingga lebih efisien untuk diproses dan bisa di-index, sedangkan `json` menyimpan representasi teks input dan perlu diparsing ulang saat diproses. PostgreSQL juga menyediakan extension `hstore` untuk key-value berbasis text, serta index types seperti B-tree, Hash, GIN, GiST, SP-GiST, dan BRIN. Untuk geospatial, PostGIS menambahkan tipe dan fungsi GIS di atas PostgreSQL, termasuk dukungan spatial index berbasis GiST/R-tree. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html?utm_source=chatgpt.com))

---

## 2. Mental Model

```text
PostgreSQL Multi-Model Decision Model
│
├── Relational Core
│   ├── Strong schema
│   ├── FK / constraint
│   ├── transactional consistency
│   ├── reporting-friendly
│   └── best default untuk business-critical entities
│
├── Key-Value Layer
│   ├── simple KV table
│   ├── hstore
│   ├── jsonb map
│   ├── config / setting / idempotency
│   └── good when access pattern mostly key lookup
│
├── Document Layer
│   ├── jsonb payload
│   ├── semi-structured data
│   ├── document versioning
│   ├── dynamic attributes
│   └── good when schema changes faster than relational model
│
├── Geospatial Layer
│   ├── PostGIS geometry / geography
│   ├── SRID / projection
│   ├── spatial predicate
│   ├── distance / nearest neighbor
│   └── good when location is part of transactional system
│
└── Operational Layer
    ├── migration
    ├── indexing
    ├── EXPLAIN ANALYZE
    ├── retention
    ├── audit
    └── observability
```

---

## 3. Decision Table: Kapan Pakai Apa?

| Need | PostgreSQL pattern | Cocok jika | Jangan pakai jika |
|---|---|---|---|
| Lookup berdasarkan key | Simple KV table | Akses utama adalah `WHERE key = ?`; butuh ACID, audit, dan metadata. | Perlu cache ultra-low-latency, high churn, TTL native, pub/sub kuat. Redis biasanya lebih tepat. |
| Sparse attributes sederhana | `hstore` | Semua value cukup text, struktur flat, atribut tidak terlalu kompleks. | Butuh nested object, array, number/boolean asli, atau schema document kompleks. |
| Flexible config / settings | `jsonb` KV | Value bisa nested dan typed; masih perlu transaksi PostgreSQL. | Perlu rule engine/flag evaluation sangat kompleks dan real-time global rollout. |
| Document-like data | `jsonb` document table | Entity punya metadata stabil tetapi detail payload berubah-ubah. | Hampir semua field perlu join, FK, unique constraint, dan reporting kompleks. Lebih baik relational. |
| Dynamic case payload | Relational + `jsonb` hybrid | Core fields stabil, detail per product/workflow berubah. | Payload menjadi tempat menyembunyikan semua business invariant. |
| Spatial point/radius search | PostGIS `geometry`/`geography` | Location query adalah bagian dari transactional app. | Butuh GIS analytics sangat besar, map tile engine, atau dedicated geospatial warehouse. |
| Spatial boundary matching | PostGIS polygon/multipolygon | Perlu point-in-polygon, service area, jurisdiction, branch coverage. | Boundary sangat besar dan query sangat berat tanpa precompute/materialized layer. |
| Nearest facility | PostGIS KNN `<->` | Perlu nearest point/facility dengan spatial index. | Perlu routing network detail; gunakan pgRouting atau dedicated routing engine. |

---

## 4. Practical Architecture Pattern

### 4.1 Recommended Baseline

Untuk enterprise microservice berbasis Java/Jersey/MyBatis, baseline paling aman adalah:

```text
API Layer
  Jersey Resource
    ↓
Application Service
  validation, authorization, transaction boundary
    ↓
Repository / Mapper
  MyBatis mapper interface + XML SQL
    ↓
PostgreSQL
  relational columns + jsonb/hstore/geometry as needed
```

Prinsipnya:

| Layer | Tanggung jawab |
|---|---|
| Jersey Resource | HTTP contract, request/response DTO, status code, auth context extraction |
| Service | Business invariant, transaction boundary, validation orchestration |
| MyBatis Mapper | Explicit SQL, query shape control, result mapping |
| PostgreSQL | Constraint, indexing, transaction, query execution, data integrity |
| Migration tool | Extension, table, index, constraint, seed data |

---

## 5. PostgreSQL Multi-Model Capability Map

| Capability | PostgreSQL feature | Practical usage |
|---|---|---|
| Key-value simple | `text primary key`, `jsonb`, `bytea`, `text` | Config store, idempotency key, tenant setting |
| Key-value flat | `hstore` extension | Sparse flat attributes with text values |
| Document | `jsonb` | Case payload, dynamic request payload, external API snapshot |
| JSON query | JSON operators/functions, SQL/JSON path | Filter nested payload, extract field, validate path existence |
| JSON indexing | GIN, expression index, partial index | Fast containment/existence/extracted-field search |
| Geospatial | PostGIS extension | Point, polygon, boundary, nearest search |
| Spatial indexing | GiST, SP-GiST, BRIN | Radius search, spatial join, large geospatial table optimization |
| Lifecycle | Partitioning, scheduled cleanup | TTL-like cleanup, retention, archival |
| Audit | history table, event table, outbox | Regulatory defensibility, replay, traceability |

PostgreSQL GIN indexes are designed for composite values where queries search for elements inside those values, which is why GIN is central for arrays, JSONB, and some document-style access patterns. ([PostgreSQL](https://www.postgresql.org/docs/current/gin.html?utm_source=chatgpt.com))

---

## 6. Practical Design Rule: Jangan Langsung JSONB Semua

Kesalahan umum saat memakai PostgreSQL sebagai document database adalah membuat tabel seperti ini:

```sql
CREATE TABLE bad_documents (
    id uuid PRIMARY KEY,
    payload jsonb NOT NULL
);
```

Ini terlalu bebas. Untuk production, biasanya lebih aman seperti ini:

```sql
CREATE TABLE case_documents (
    id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,
    document_type text NOT NULL,
    business_key text NOT NULL,
    status text NOT NULL,
    schema_version int NOT NULL,
    payload jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    version bigint NOT NULL DEFAULT 0,

    CONSTRAINT uq_case_documents_business_key
        UNIQUE (tenant_id, document_type, business_key),

    CONSTRAINT ck_case_documents_status
        CHECK (status IN ('DRAFT', 'ACTIVE', 'SUSPENDED', 'ARCHIVED')),

    CONSTRAINT ck_case_documents_payload_object
        CHECK (jsonb_typeof(payload) = 'object')
);
```

Kenapa lebih aman?

| Kolom | Alasan |
|---|---|
| `tenant_id` | Security boundary dan query partitioning/filtering. Jangan disembunyikan di JSON. |
| `document_type` | Membantu routing validation, indexing, dan partial index. |
| `business_key` | Idempotency/business identity. |
| `status` | Field lifecycle yang sering difilter. Lebih baik kolom biasa. |
| `schema_version` | Wajib untuk payload evolution. |
| `payload` | Bagian fleksibel, bukan tempat semua invariant. |
| `version` | Optimistic concurrency control. |

---

## 7. Practical Design Rule: Key-Value Tidak Berarti Tanpa Struktur

Contoh simple KV table yang lebih production-ready:

```sql
CREATE TABLE app_kv_store (
    tenant_id uuid NOT NULL,
    namespace text NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL,
    value_type text NOT NULL,
    version bigint NOT NULL DEFAULT 0,
    expires_at timestamptz NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    PRIMARY KEY (tenant_id, namespace, key),

    CONSTRAINT ck_app_kv_store_value_object
        CHECK (jsonb_typeof(value) IN ('object', 'array', 'string', 'number', 'boolean'))
);

CREATE INDEX idx_app_kv_store_expires_at
    ON app_kv_store (expires_at)
    WHERE expires_at IS NOT NULL;
```

Pattern ini cocok untuk:

| Use case | Contoh |
|---|---|
| Tenant config | `tenant:123/payment/maxLimit` |
| Feature flag | `tenant:123/feature/new-review-flow` |
| External reference cache | `provider:X/customer:Y/profile-snapshot` |
| Idempotency metadata | `request-idempotency/payment/abc-123` |
| Runtime parameter | `workflow/escalation/default-sla-days` |

Tapi untuk high-throughput volatile cache, Redis tetap lebih natural karena PostgreSQL tidak punya TTL native seperti key-value cache engine. Di PostgreSQL, TTL biasanya dibuat lewat `expires_at`, partial index, scheduled cleanup, atau partition retention.

---

## 8. Practical Design Rule: Geospatial Harus Disiplin SRID

Contoh buruk:

```sql
CREATE TABLE places_bad (
    id uuid PRIMARY KEY,
    lat double precision NOT NULL,
    lon double precision NOT NULL
);
```

Ini bisa jalan, tetapi cepat menjadi sulit untuk radius search, spatial join, dan indexing.

Contoh lebih baik dengan PostGIS:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE places (
    id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    location geometry(Point, 4326) NOT NULL,
    status text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_places_status
        CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE INDEX idx_places_location_gist
    ON places
    USING gist (location);
```

PostGIS adalah extension PostgreSQL untuk menyimpan dan memproses objek GIS, termasuk dukungan spatial index berbasis GiST/R-tree. ([PostGIS](https://postgis.net/docs/manual-3.5/postgis-en.html?utm_source=chatgpt.com))

Untuk query radius, pattern praktisnya:

```sql
SELECT
    id,
    name
FROM places
WHERE status = 'ACTIVE'
  AND ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(:lon, :lat), 4326),
        :radius_degrees
      );
```

Catatan penting: untuk jarak meter secara global, biasanya perlu memahami `geometry` vs `geography` atau transformasi projection. Jangan asal menghitung meter pada koordinat derajat.

Untuk nearest-neighbor search, PostGIS menyediakan operator `<->` yang dapat dipakai dalam `ORDER BY` untuk index-assisted nearest-neighbor result set. ([PostGIS](https://postgis.net/docs/geometry_distance_knn.html?utm_source=chatgpt.com))

```sql
SELECT
    id,
    name
FROM places
WHERE status = 'ACTIVE'
ORDER BY location <-> ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)
LIMIT 10;
```

---

## 9. Boundary: PostgreSQL vs Redis vs MongoDB vs Dedicated GIS

| Scenario | PostgreSQL saja cukup? | Pertimbangan |
|---|---:|---|
| Tenant settings dengan audit | Ya | PostgreSQL kuat karena transactional, auditable, dan mudah di-backup. |
| Idempotency key untuk API payment/case command | Ya | Cocok dengan unique constraint dan transaction boundary. |
| Session cache volatile skala tinggi | Tidak ideal | Redis lebih tepat. |
| Dynamic case payload dengan reporting terbatas | Ya | Gunakan relational metadata + `jsonb` payload. |
| Semua field document perlu arbitrary query | Hati-hati | JSONB bisa, tetapi index dan query governance harus ketat. |
| Massive document DB horizontal scale | Tidak selalu | Dedicated document DB bisa lebih cocok. |
| Point-in-polygon regulatory jurisdiction | Ya | PostGIS cocok. |
| Fleet tracking real-time sangat tinggi | Tergantung | Bisa perlu time-series/spatial pipeline khusus. |
| Map tile serving | Tidak cukup hanya PostgreSQL | Biasanya perlu tile server/cache/rendering layer. |
| Complex route optimization | Tidak cukup hanya basic PostGIS | Bisa perlu pgRouting atau routing engine khusus. |

---

## 10. Practical Checklist Sebelum Memilih PostgreSQL Multi-Model

Gunakan checklist ini sebelum membuat table `jsonb`, `hstore`, atau `geometry`.

| Pertanyaan | Kalau jawabannya “ya” | Arah desain |
|---|---|---|
| Apakah data punya invariant kuat? | Ya | Jadikan kolom relational + constraint. |
| Apakah field sering dipakai filter/sort/join? | Ya | Jadikan kolom biasa atau generated/extracted column. |
| Apakah field jarang dipakai dan bervariasi? | Ya | Cocok masuk `jsonb`. |
| Apakah value flat text-only? | Ya | Pertimbangkan `hstore`. |
| Apakah value nested/typed? | Ya | Gunakan `jsonb`. |
| Apakah akses utamanya by key? | Ya | Simple KV table cukup. |
| Apakah perlu radius / boundary / nearest query? | Ya | Gunakan PostGIS, bukan lat/lon double biasa. |
| Apakah data perlu TTL? | Ya | Desain `expires_at`, cleanup job, atau partition retention. |
| Apakah query akan dibuat dinamis dari API? | Ya | Batasi whitelist field/operator. |
| Apakah workload write-heavy? | Ya | Hati-hati dengan GIN/spatial index terlalu banyak. |
| Apakah perlu audit regulatory? | Ya | Tambahkan history/outbox/event table. |

---

## 11. Implementation Blueprint per Tipe Database

### 11.1 Key-Value Blueprint

```text
Use case:
  tenant config, feature flag, idempotency key, runtime parameter

Table:
  tenant_id
  namespace
  key
  value jsonb
  version
  expires_at

Indexes:
  primary key (tenant_id, namespace, key)
  partial index expires_at
  optional expression index on value field

Service pattern:
  getValue()
  putValue()
  compareAndSet()
  deleteValue()
  cleanupExpired()
```

### 11.2 Document Blueprint

```text
Use case:
  case payload, external API snapshot, workflow document, regulatory case profile

Table:
  id
  tenant_id
  document_type
  business_key
  status
  schema_version
  payload jsonb
  version

Indexes:
  unique business key
  index tenant/status/type
  GIN payload only when containment/existence query is needed
  expression index for hot JSON field

Service pattern:
  createDocument()
  validatePayload()
  patchDocument()
  transitionStatus()
  getDocumentView()
  auditMutation()
```

### 11.3 Geospatial Blueprint

```text
Use case:
  office/branch location, service area, jurisdiction, nearest facility

Table:
  id
  tenant_id
  name
  geometry/geography column
  status
  metadata jsonb optional

Indexes:
  GiST geometry/geography
  B-tree tenant/status
  optional partial GiST for active records

Service pattern:
  findWithinRadius()
  findNearest()
  matchBoundary()
  validateGeometry()
  importGeoJson()
```

---

## 12. MyBatis-Oriented Design Preview

Nanti di seri integrasi, kita akan detailkan. Namun sejak awal desain SQL harus MyBatis-friendly:

```java
public interface KvStoreMapper {
    Optional<KvRecord> findByKey(
        @Param("tenantId") UUID tenantId,
        @Param("namespace") String namespace,
        @Param("key") String key
    );

    int upsertValue(KvRecord record);

    int compareAndSet(
        @Param("tenantId") UUID tenantId,
        @Param("namespace") String namespace,
        @Param("key") String key,
        @Param("expectedVersion") long expectedVersion,
        @Param("newValue") String newValueJson
    );
}
```

Contoh SQL MyBatis-style untuk optimistic update:

```xml
<update id="compareAndSet">
    UPDATE app_kv_store
    SET
        value = CAST(#{newValue} AS jsonb),
        version = version + 1,
        updated_at = now()
    WHERE tenant_id = #{tenantId}
      AND namespace = #{namespace}
      AND key = #{key}
      AND version = #{expectedVersion}
</update>
```

Jika return row count = `0`, artinya salah satu dari ini terjadi:

| Penyebab | Makna |
|---|---|
| Key tidak ada | Client update data yang belum dibuat |
| Version mismatch | Ada concurrent update |
| Tenant/namespace salah | Access boundary mismatch |
| Data sudah expired/dihapus | Lifecycle conflict |

---

## 13. Production Guardrails

| Guardrail | Kenapa penting |
|---|---|
| Semua extension lewat migration | Agar dev/staging/prod konsisten. PostgreSQL extension dibuat dengan `CREATE EXTENSION`. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createextension.html?utm_source=chatgpt.com)) |
| Jangan sembunyikan tenant/security boundary di JSON | Sulit enforce RLS, index, audit, dan query governance. |
| Jangan index semua JSON path | Index punya cost write, storage, vacuum, dan planning. |
| Gunakan `EXPLAIN (ANALYZE, BUFFERS)` | Validasi actual query, bukan asumsi. |
| Gunakan partial index untuk hot subset | Lebih hemat daripada global index besar. |
| Pisahkan metadata stabil dari payload fleksibel | Query lebih cepat dan invariant lebih aman. |
| Versikan payload | Wajib untuk document evolution. |
| Audit mutation | Penting untuk regulatory system dan complex case lifecycle. |
| Batasi dynamic filter dari API | Mencegah arbitrary expensive query. |
| Monitor bloat dan slow query | JSONB/GIN/spatial index bisa membesar cepat. |

---

## 14. Learning Outcome Seri 1

Setelah seri ini, target pemahaman praktisnya:

1. Bisa membedakan kapan PostgreSQL dipakai sebagai relational, key-value, document, atau geospatial store.
2. Bisa memilih antara simple KV table, `hstore`, dan `jsonb`.
3. Bisa mengenali kapan `jsonb` aman dan kapan mulai menjadi anti-pattern.
4. Bisa memahami kenapa PostGIS lebih tepat daripada sekadar `lat`/`lon` column.
5. Bisa membuat desain awal yang siap diintegrasikan ke Java/Jersey/MyBatis.
6. Bisa menghindari kesalahan umum: “semua masuk JSONB”, “semua di-index”, atau “geospatial tanpa SRID”.

---

## 15. Ringkasan Praktis

| Tipe | Default praktis |
|---|---|
| Key-value | Simple KV table + `jsonb` value + metadata + optimistic version |
| Flat key-value | `hstore` jika value text-only dan struktur flat |
| Document | Relational metadata + `jsonb payload` |
| JSON indexing | Expression/partial index dulu; GIN jika containment/existence query dominan |
| Geospatial | PostGIS `geometry`/`geography`, SRID jelas, GiST index |
| Java integration | Jersey Resource → Service → MyBatis Mapper → explicit SQL |
| Production | Migration, audit, index governance, EXPLAIN, retention, observability |

---

# Status

**Seri 1/19 selesai.**

Rekomendasi berikutnya: **Seri 2/19 - Key-Value Pattern: simple KV table, namespace, metadata, TTL, upsert, cleanup, optimistic locking, dan query pattern production-style.**

---

**Sources:**

- [Documentation: 18: 8.14. JSON Types](https://www.postgresql.org/docs/current/datatype-json.html?utm_source=chatgpt.com)
- [PostGIS 3.5.7 Manual](https://postgis.net/docs/manual-3.5/postgis-en.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:24:58 PM

Saya lanjut ke **Seri 2/19**, fokusnya practical key-value table design di PostgreSQL: struktur tabel, namespace, TTL-style cleanup, upsert, optimistic locking, dan query pattern yang aman untuk service Java/Jersey/MyBatis nanti.

# Seri 2/19 - Key-Value Pattern: Simple KV Table, Namespace, Metadata, TTL

## 1. Tujuan Seri Ini

Seri ini membahas cara memakai PostgreSQL sebagai **key-value database praktis** untuk kebutuhan enterprise application, terutama di microservice Java/Jersey/MyBatis.

Fokusnya bukan membuat PostgreSQL menjadi Redis, tetapi membuat pola **durable key-value store** yang:

- transactional,
- auditable,
- bisa di-query dengan SQL,
- bisa diberi constraint,
- bisa di-versioning,
- aman untuk multi-tenant,
- mudah diintegrasikan dengan Java/MyBatis,
- dan masih masuk akal secara operasional.

Pola ini cocok untuk data seperti:

| Use case | Contoh |
|---|---|
| Tenant configuration | Limit transaksi, SLA default, notification setting |
| Runtime parameter | `workflow.escalation.maxDays`, `case.review.defaultAssignee` |
| Feature flag sederhana | Enable/disable fitur per tenant/module |
| External reference snapshot | Cache durable hasil lookup eksternal |
| Small metadata bag | Attribute tambahan yang tidak cukup penting menjadi tabel relational |
| Idempotency metadata ringan | Request key, status, response digest - detail penuh nanti di Seri 5 |

PostgreSQL mendukung `INSERT ... ON CONFLICT` untuk menangani conflict pada unique constraint / exclusion constraint, sehingga cocok untuk pola **upsert** key-value. PostgreSQL juga mendukung `jsonb` sebagai value fleksibel, dan GIN index dapat dipakai untuk pencarian key/value di dalam banyak dokumen `jsonb` jika memang diperlukan. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-insert.html?utm_source=chatgpt.com))

---

## 2. Mental Model

```text
PostgreSQL Key-Value Store
│
├── Identity
│   ├── tenant_id
│   ├── namespace
│   └── key
│
├── Value
│   ├── value jsonb
│   ├── value_type
│   └── schema_version
│
├── Lifecycle
│   ├── status
│   ├── expires_at
│   ├── created_at
│   └── updated_at
│
├── Concurrency
│   ├── version
│   ├── optimistic update
│   └── row count check
│
├── Query Pattern
│   ├── get by exact key
│   ├── list by namespace
│   ├── upsert
│   ├── compare-and-set
│   └── cleanup expired
│
└── Operational Safety
    ├── primary key
    ├── partial index
    ├── expression index
    ├── size guardrail
    ├── audit
    └── EXPLAIN ANALYZE
```

---

## 3. Rule Utama: KV Store Tetap Butuh Struktur

Anti-pattern yang sering muncul:

```sql
CREATE TABLE kv_bad (
    key text PRIMARY KEY,
    value jsonb NOT NULL
);
```

Ini terlalu sederhana untuk production. Masalahnya:

| Masalah | Dampak |
|---|---|
| Tidak ada `tenant_id` | Sulit multi-tenant, security boundary lemah |
| Tidak ada `namespace` | Key mudah tabrakan antar module |
| Tidak ada `version` | Lost update saat concurrent write |
| Tidak ada `expires_at` | Tidak ada TTL-style lifecycle |
| Tidak ada `value_type` | Sulit validasi dan deserialization |
| Tidak ada audit metadata | Sulit trace perubahan |
| Tidak ada ownership | Sulit tahu service/domain pemilik key |
| Tidak ada schema version | Sulit evolve format value |

Untuk production, key-value store sebaiknya tetap punya **relational metadata**.

---

## 4. Recommended Table Design

```sql
CREATE TABLE app_kv_store (
    tenant_id uuid NOT NULL,
    namespace text NOT NULL,
    key text NOT NULL,

    value jsonb NOT NULL,
    value_type text NOT NULL,
    schema_version integer NOT NULL DEFAULT 1,

    status text NOT NULL DEFAULT 'ACTIVE',
    version bigint NOT NULL DEFAULT 0,

    expires_at timestamptz NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by text NULL,
    updated_by text NULL,

    PRIMARY KEY (tenant_id, namespace, key),

    CONSTRAINT ck_app_kv_store_namespace_not_blank
        CHECK (length(trim(namespace)) > 0),

    CONSTRAINT ck_app_kv_store_key_not_blank
        CHECK (length(trim(key)) > 0),

    CONSTRAINT ck_app_kv_store_status
        CHECK (status IN ('ACTIVE', 'DISABLED', 'DELETED')),

    CONSTRAINT ck_app_kv_store_value_type
        CHECK (value_type IN (
            'STRING',
            'NUMBER',
            'BOOLEAN',
            'OBJECT',
            'ARRAY',
            'CONFIG',
            'FEATURE_FLAG',
            'REFERENCE_SNAPSHOT'
        )),

    CONSTRAINT ck_app_kv_store_value_json_type
        CHECK (jsonb_typeof(value) IN (
            'string',
            'number',
            'boolean',
            'object',
            'array'
        ))
);
```

### Kenapa primary key-nya `(tenant_id, namespace, key)`?

Karena dalam enterprise system, key biasanya tidak global.

```text
tenant_id + namespace + key = actual identity
```

Contoh:

```text
tenant A / workflow.escalation / default-sla-days
tenant B / workflow.escalation / default-sla-days
tenant A / feature.case-review / enabled
tenant A / integration.dukcapil / endpoint-config
```

Kalau hanya pakai satu string global seperti:

```text
tenant:A:workflow:escalation:default-sla-days
```

itu memang bisa, tetapi lebih buruk untuk:

- query per tenant,
- index selectivity,
- row-level security,
- audit,
- cleanup,
- migration,
- dan validation.

---

## 5. Index Design

### 5.1 Primary Key untuk Exact Lookup

```sql
ALTER TABLE app_kv_store
    ADD CONSTRAINT pk_app_kv_store
    PRIMARY KEY (tenant_id, namespace, key);
```

Query paling utama:

```sql
SELECT value, value_type, schema_version, version
FROM app_kv_store
WHERE tenant_id = :tenantId
  AND namespace = :namespace
  AND key = :key
  AND status = 'ACTIVE'
  AND (expires_at IS NULL OR expires_at > now());
```

Ini harus menjadi query paling cepat dan paling sering.

---

### 5.2 Index untuk List by Namespace

Kalau sering menampilkan semua config dalam satu namespace:

```sql
CREATE INDEX idx_app_kv_store_namespace_active
    ON app_kv_store (tenant_id, namespace, status, key)
    WHERE status = 'ACTIVE';
```

PostgreSQL mendukung **partial index**, yaitu index yang hanya berisi subset row berdasarkan predicate tertentu. Ini berguna jika hanya row aktif yang sering di-query. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-partial.html?utm_source=chatgpt.com))

---

### 5.3 Index untuk Cleanup Expired Key

```sql
CREATE INDEX idx_app_kv_store_expires_at
    ON app_kv_store (expires_at)
    WHERE expires_at IS NOT NULL;
```

Dipakai oleh cleanup job:

```sql
DELETE FROM app_kv_store
WHERE expires_at IS NOT NULL
  AND expires_at <= now();
```

Untuk tabel besar, jangan delete jutaan row dalam satu transaksi. Gunakan batch.

---

### 5.4 Expression Index untuk Field JSON yang Sering Di-query

Misalnya value untuk feature flag:

```json
{
  "enabled": true,
  "rolloutPercentage": 25,
  "owner": "case-platform"
}
```

Kalau sering filter berdasarkan `enabled`:

```sql
CREATE INDEX idx_app_kv_store_feature_enabled
    ON app_kv_store (((value ->> 'enabled')::boolean))
    WHERE namespace = 'feature.case-review'
      AND status = 'ACTIVE';
```

PostgreSQL mendukung index pada ekspresi, bukan hanya kolom biasa; ini berguna untuk extracted value dari `jsonb`. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-expressional.html?utm_source=chatgpt.com))

---

### 5.5 GIN Index: Jangan Langsung Dipakai Tanpa Alasan

Kalau query sering seperti ini:

```sql
SELECT *
FROM app_kv_store
WHERE value @> '{"owner": "case-platform"}'::jsonb;
```

bisa memakai GIN:

```sql
CREATE INDEX idx_app_kv_store_value_gin
    ON app_kv_store
    USING gin (value);
```

GIN cocok untuk composite value ketika query perlu mencari elemen di dalam value, seperti key/value di `jsonb`. Tetapi GIN index bisa besar dan punya write overhead, jadi jangan dijadikan default untuk semua KV table. ([PostgreSQL](https://www.postgresql.org/docs/current/gin.html?utm_source=chatgpt.com))

Practical rule:

| Query pattern | Index yang lebih cocok |
|---|---|
| Exact key lookup | Primary key B-tree |
| List by namespace | B-tree composite / partial index |
| Cleanup expired | Partial B-tree on `expires_at` |
| Filter satu field JSON spesifik | Expression index |
| Search containment banyak key JSON | GIN |
| Semua query by arbitrary JSON path | Redesign query/API governance |

---

## 6. Upsert Pattern

### 6.1 Basic Upsert

```sql
INSERT INTO app_kv_store (
    tenant_id,
    namespace,
    key,
    value,
    value_type,
    schema_version,
    status,
    version,
    expires_at,
    created_by,
    updated_by
)
VALUES (
    :tenantId,
    :namespace,
    :key,
    CAST(:valueJson AS jsonb),
    :valueType,
    :schemaVersion,
    'ACTIVE',
    0,
    :expiresAt,
    :actor,
    :actor
)
ON CONFLICT (tenant_id, namespace, key)
DO UPDATE SET
    value = EXCLUDED.value,
    value_type = EXCLUDED.value_type,
    schema_version = EXCLUDED.schema_version,
    status = 'ACTIVE',
    version = app_kv_store.version + 1,
    expires_at = EXCLUDED.expires_at,
    updated_at = now(),
    updated_by = EXCLUDED.updated_by;
```

`ON CONFLICT` di PostgreSQL memungkinkan alternatif action saat terjadi unique/exclusion constraint violation, misalnya `DO NOTHING` atau `DO UPDATE`. Ini adalah fondasi upsert untuk KV store. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-insert.html?utm_source=chatgpt.com))

### 6.2 Kapan Upsert Cocok?

| Cocok | Tidak cocok |
|---|---|
| Setting yang boleh overwrite | Update harus gagal kalau ada concurrent modification |
| Runtime parameter | Perubahan membutuhkan approval workflow |
| Cache durable / reference snapshot | Perubahan harus preserve historical version |
| Replace seluruh value | Perlu patch sebagian value dengan conflict detection detail |

Kalau update harus aman terhadap concurrent editor, gunakan **compare-and-set**.

---

## 7. Optimistic Locking / Compare-And-Set Pattern

### 7.1 Read

```sql
SELECT
    tenant_id,
    namespace,
    key,
    value,
    value_type,
    schema_version,
    version,
    expires_at
FROM app_kv_store
WHERE tenant_id = :tenantId
  AND namespace = :namespace
  AND key = :key
  AND status = 'ACTIVE'
  AND (expires_at IS NULL OR expires_at > now());
```

Client menerima `version`.

### 7.2 Update dengan Expected Version

```sql
UPDATE app_kv_store
SET
    value = CAST(:newValueJson AS jsonb),
    value_type = :valueType,
    schema_version = :schemaVersion,
    version = version + 1,
    expires_at = :expiresAt,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND namespace = :namespace
  AND key = :key
  AND version = :expectedVersion
  AND status = 'ACTIVE'
  AND (expires_at IS NULL OR expires_at > now());
```

Interpretasi row count:

| Row count | Arti |
|---:|---|
| `1` | Update berhasil |
| `0` | Key tidak ada, expired, deleted, atau version conflict |

Di Java service, jangan diam-diam menganggap `0` sebagai sukses.

```java
if (updated == 0) {
    throw new ConcurrentModificationException(
        "KV entry was modified, deleted, or expired"
    );
}
```

---

## 8. TTL-Style Pattern

PostgreSQL tidak punya TTL native seperti Redis. Untuk KV store di PostgreSQL, TTL biasanya dibuat dengan:

1. `expires_at`,
2. query read yang mengabaikan expired row,
3. cleanup job,
4. optional partition retention untuk skala besar.

### 8.1 Read Harus Memfilter Expired Data

```sql
SELECT value
FROM app_kv_store
WHERE tenant_id = :tenantId
  AND namespace = :namespace
  AND key = :key
  AND status = 'ACTIVE'
  AND (expires_at IS NULL OR expires_at > now());
```

Jangan hanya mengandalkan cleanup job, karena expired row mungkin belum terhapus.

---

### 8.2 Batch Cleanup

```sql
WITH expired_rows AS (
    SELECT tenant_id, namespace, key
    FROM app_kv_store
    WHERE expires_at IS NOT NULL
      AND expires_at <= now()
    ORDER BY expires_at
    LIMIT :batchSize
)
DELETE FROM app_kv_store kv
USING expired_rows e
WHERE kv.tenant_id = e.tenant_id
  AND kv.namespace = e.namespace
  AND kv.key = e.key;
```

Untuk beberapa worker cleanup paralel, bisa memakai row locking:

```sql
WITH expired_rows AS (
    SELECT tenant_id, namespace, key
    FROM app_kv_store
    WHERE expires_at IS NOT NULL
      AND expires_at <= now()
    ORDER BY expires_at
    LIMIT :batchSize
    FOR UPDATE SKIP LOCKED
)
DELETE FROM app_kv_store kv
USING expired_rows e
WHERE kv.tenant_id = e.tenant_id
  AND kv.namespace = e.namespace
  AND kv.key = e.key;
```

`SKIP LOCKED` membuat row yang sedang terkunci oleh transaksi lain dilewati, tetapi dokumentasi PostgreSQL juga menegaskan bahwa ini memberi view data yang tidak konsisten, sehingga cocok untuk pola seperti queue/batch worker, bukan untuk query bisnis yang butuh snapshot lengkap. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-select.html?utm_source=chatgpt.com))

---

## 9. Soft Delete vs Hard Delete

Untuk KV store, ada dua opsi.

### 9.1 Hard Delete

```sql
DELETE FROM app_kv_store
WHERE tenant_id = :tenantId
  AND namespace = :namespace
  AND key = :key;
```

Cocok untuk:

| Cocok | Alasan |
|---|---|
| Temporary cache | Tidak perlu histori |
| Expired token metadata | Bisa dibuang |
| Reference snapshot kecil | Bisa direfresh |

### 9.2 Soft Delete

```sql
UPDATE app_kv_store
SET
    status = 'DELETED',
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND namespace = :namespace
  AND key = :key
  AND status <> 'DELETED';
```

Cocok untuk:

| Cocok | Alasan |
|---|---|
| Config penting | Butuh audit |
| Feature flag | Perlu trace siapa disable |
| Regulatory parameter | Tidak boleh hilang tanpa histori |
| Tenant-level setting | Bisa perlu restore |

Untuk domain regulatory/case-management, soft delete + audit table biasanya lebih aman.

---

## 10. Audit Table Pattern

KV yang mempengaruhi business behavior sebaiknya punya audit.

```sql
CREATE TABLE app_kv_store_audit (
    audit_id bigserial PRIMARY KEY,
    tenant_id uuid NOT NULL,
    namespace text NOT NULL,
    key text NOT NULL,

    old_value jsonb NULL,
    new_value jsonb NULL,

    old_version bigint NULL,
    new_version bigint NULL,

    action text NOT NULL,
    actor text NULL,
    reason text NULL,

    changed_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_app_kv_store_audit_action
        CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'EXPIRE', 'RESTORE'))
);
```

### Audit Insert Saat Update

```sql
WITH old_row AS (
    SELECT *
    FROM app_kv_store
    WHERE tenant_id = :tenantId
      AND namespace = :namespace
      AND key = :key
      AND version = :expectedVersion
),
updated_row AS (
    UPDATE app_kv_store kv
    SET
        value = CAST(:newValueJson AS jsonb),
        version = kv.version + 1,
        updated_at = now(),
        updated_by = :actor
    FROM old_row old
    WHERE kv.tenant_id = old.tenant_id
      AND kv.namespace = old.namespace
      AND kv.key = old.key
    RETURNING kv.*
)
INSERT INTO app_kv_store_audit (
    tenant_id,
    namespace,
    key,
    old_value,
    new_value,
    old_version,
    new_version,
    action,
    actor,
    reason
)
SELECT
    old_row.tenant_id,
    old_row.namespace,
    old_row.key,
    old_row.value,
    updated_row.value,
    old_row.version,
    updated_row.version,
    'UPDATE',
    :actor,
    :reason
FROM old_row
JOIN updated_row
  ON updated_row.tenant_id = old_row.tenant_id
 AND updated_row.namespace = old_row.namespace
 AND updated_row.key = old_row.key;
```

Pattern ini menjaga update dan audit dalam satu transaksi.

---

## 11. Namespace Design

Namespace sebaiknya stabil dan meaningful.

Contoh bagus:

```text
workflow.escalation
workflow.assignment
feature.case-review
integration.dukcapil
integration.payment-gateway
notification.email-template
security.password-policy
case.default-values
```

Contoh kurang bagus:

```text
misc
general
config
data
temp
module1
```

### Naming Rule

| Rule | Contoh |
|---|---|
| Domain dulu | `workflow.escalation` |
| Modul jelas | `integration.payment-gateway` |
| Hindari global vague namespace | Jangan `settings` saja |
| Stable over implementation | Jangan `className.methodName` |
| Bisa dipetakan ke ownership | `case.review-policy` dimiliki case service |

---

## 12. Key Design

Key harus cukup spesifik tetapi tidak menjadi encoding yang terlalu rumit.

### 12.1 Good Key

```text
default-sla-days
max-retry-count
enabled
rollout-rule
branch-coverage-radius
notification-template-id
```

### 12.2 Bad Key

```text
tenant-123-feature-case-review-enabled
workflow-escalation-default-sla-days-prod-v2
setting1
abc
flag
```

Karena `tenant_id` dan `namespace` sudah kolom sendiri, key tidak perlu mengulang semuanya.

---

## 13. Value Design

### 13.1 Scalar Value

```json
true
```

```json
30
```

```json
"STRICT"
```

Cocok untuk setting sederhana.

### 13.2 Object Value

```json
{
  "enabled": true,
  "rolloutPercentage": 25,
  "allowedRoles": ["SUPERVISOR", "REVIEWER"],
  "defaultDecision": "MANUAL_REVIEW"
}
```

Cocok untuk config yang punya beberapa field.

### 13.3 Value dengan Metadata Internal

Biasanya metadata jangan ditaruh semua di JSON karena sudah ada kolom. Tetapi metadata domain yang memang bagian dari config boleh.

```json
{
  "slaDays": 5,
  "calendar": "BUSINESS_DAY",
  "escalationLevel": "REGIONAL_SUPERVISOR",
  "notifyChannels": ["EMAIL", "IN_APP"]
}
```

---

## 14. Validation Strategy

KV store yang terlalu bebas akan menjadi dumping ground. Minimal gunakan validasi berlapis.

```text
Validation Layers
│
├── Database constraint
│   ├── not null
│   ├── check status
│   ├── check jsonb type
│   └── primary key
│
├── Application validation
│   ├── namespace whitelist
│   ├── key whitelist
│   ├── value_type validation
│   ├── JSON schema / DTO validation
│   └── permission check
│
├── Service ownership
│   ├── owner module
│   ├── allowed writer
│   └── audit reason
│
└── Runtime consumption
    ├── safe default
    ├── fallback
    ├── deserialization failure handling
    └── cache invalidation
```

### Practical Java-side Rule

Jangan expose endpoint seperti ini:

```http
PUT /kv/{namespace}/{key}
```

yang menerima sembarang namespace/key/value dari user internal tanpa governance.

Lebih aman:

```http
PUT /workflow/escalation/default-sla
PUT /features/case-review/rule
PUT /integrations/payment-gateway/config
```

Endpoint boleh tetap memakai KV table di belakang, tetapi contract API-nya domain-specific.

---

## 15. Query Patterns

### 15.1 Get Single Value

```sql
SELECT
    value,
    value_type,
    schema_version,
    version
FROM app_kv_store
WHERE tenant_id = :tenantId
  AND namespace = :namespace
  AND key = :key
  AND status = 'ACTIVE'
  AND (expires_at IS NULL OR expires_at > now());
```

### 15.2 List Namespace

```sql
SELECT
    key,
    value,
    value_type,
    schema_version,
    version,
    expires_at,
    updated_at
FROM app_kv_store
WHERE tenant_id = :tenantId
  AND namespace = :namespace
  AND status = 'ACTIVE'
  AND (expires_at IS NULL OR expires_at > now())
ORDER BY key;
```

### 15.3 Find Expired

```sql
SELECT
    tenant_id,
    namespace,
    key,
    expires_at
FROM app_kv_store
WHERE expires_at IS NOT NULL
  AND expires_at <= now()
ORDER BY expires_at
LIMIT :limit;
```

### 15.4 Find by JSON Field

```sql
SELECT
    tenant_id,
    namespace,
    key,
    value
FROM app_kv_store
WHERE namespace = 'feature.case-review'
  AND status = 'ACTIVE'
  AND (value ->> 'enabled')::boolean = true;
```

### 15.5 Containment Query

```sql
SELECT
    tenant_id,
    namespace,
    key,
    value
FROM app_kv_store
WHERE namespace = 'feature.case-review'
  AND value @> '{"owner": "case-platform"}'::jsonb;
```

Gunakan containment query hanya jika memang dibutuhkan. Untuk query yang selalu pada field tertentu, expression index sering lebih predictable daripada GIN global.

---

## 16. Java/Jersey/MyBatis Preview

Detail integrasi penuh ada di **Seri 6**, tetapi sejak sekarang desain SQL perlu MyBatis-friendly.

### 16.1 Domain Record

```java
public record KvEntry(
    UUID tenantId,
    String namespace,
    String key,
    String valueJson,
    String valueType,
    int schemaVersion,
    String status,
    long version,
    OffsetDateTime expiresAt,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {}
```

### 16.2 Mapper Interface

```java
public interface KvStoreMapper {

    Optional<KvEntry> findActiveByKey(
        @Param("tenantId") UUID tenantId,
        @Param("namespace") String namespace,
        @Param("key") String key
    );

    List<KvEntry> findActiveByNamespace(
        @Param("tenantId") UUID tenantId,
        @Param("namespace") String namespace
    );

    int upsert(KvEntry entry);

    int compareAndSet(
        @Param("tenantId") UUID tenantId,
        @Param("namespace") String namespace,
        @Param("key") String key,
        @Param("expectedVersion") long expectedVersion,
        @Param("newValueJson") String newValueJson,
        @Param("valueType") String valueType,
        @Param("schemaVersion") int schemaVersion,
        @Param("expiresAt") OffsetDateTime expiresAt,
        @Param("actor") String actor
    );

    int softDelete(
        @Param("tenantId") UUID tenantId,
        @Param("namespace") String namespace,
        @Param("key") String key,
        @Param("expectedVersion") long expectedVersion,
        @Param("actor") String actor
    );
}
```

### 16.3 MyBatis XML: Find

```xml
<select id="findActiveByKey" resultMap="KvEntryResultMap">
    SELECT
        tenant_id,
        namespace,
        key,
        value::text AS value_json,
        value_type,
        schema_version,
        status,
        version,
        expires_at,
        created_at,
        updated_at
    FROM app_kv_store
    WHERE tenant_id = #{tenantId}
      AND namespace = #{namespace}
      AND key = #{key}
      AND status = 'ACTIVE'
      AND (expires_at IS NULL OR expires_at > now())
</select>
```

### 16.4 MyBatis XML: Upsert

```xml
<insert id="upsert">
    INSERT INTO app_kv_store (
        tenant_id,
        namespace,
        key,
        value,
        value_type,
        schema_version,
        status,
        version,
        expires_at,
        created_at,
        updated_at
    )
    VALUES (
        #{tenantId},
        #{namespace},
        #{key},
        CAST(#{valueJson} AS jsonb),
        #{valueType},
        #{schemaVersion},
        'ACTIVE',
        0,
        #{expiresAt},
        now(),
        now()
    )
    ON CONFLICT (tenant_id, namespace, key)
    DO UPDATE SET
        value = EXCLUDED.value,
        value_type = EXCLUDED.value_type,
        schema_version = EXCLUDED.schema_version,
        status = 'ACTIVE',
        version = app_kv_store.version + 1,
        expires_at = EXCLUDED.expires_at,
        updated_at = now()
</insert>
```

### 16.5 MyBatis XML: Compare-And-Set

```xml
<update id="compareAndSet">
    UPDATE app_kv_store
    SET
        value = CAST(#{newValueJson} AS jsonb),
        value_type = #{valueType},
        schema_version = #{schemaVersion},
        version = version + 1,
        expires_at = #{expiresAt},
        updated_at = now(),
        updated_by = #{actor}
    WHERE tenant_id = #{tenantId}
      AND namespace = #{namespace}
      AND key = #{key}
      AND version = #{expectedVersion}
      AND status = 'ACTIVE'
      AND (expires_at IS NULL OR expires_at > now())
</update>
```

---

## 17. Service-Level Pattern

```java
public final class KvStoreService {

    private final KvStoreMapper mapper;
    private final ObjectMapper objectMapper;

    public <T> Optional<KvValue<T>> get(
        UUID tenantId,
        String namespace,
        String key,
        Class<T> type
    ) {
        return mapper.findActiveByKey(tenantId, namespace, key)
            .map(entry -> deserialize(entry, type));
    }

    public void putConfig(
        UUID tenantId,
        String namespace,
        String key,
        Object value,
        String actor
    ) {
        String json = serialize(value);

        KvEntry entry = new KvEntry(
            tenantId,
            namespace,
            key,
            json,
            "CONFIG",
            1,
            "ACTIVE",
            0,
            null,
            null,
            null
        );

        mapper.upsert(entry);
    }

    public void updateWithVersion(
        UUID tenantId,
        String namespace,
        String key,
        long expectedVersion,
        Object newValue,
        String actor
    ) {
        String json = serialize(newValue);

        int updated = mapper.compareAndSet(
            tenantId,
            namespace,
            key,
            expectedVersion,
            json,
            "CONFIG",
            1,
            null,
            actor
        );

        if (updated == 0) {
            throw new ConcurrentModificationException(
                "KV entry was changed, deleted, expired, or not found"
            );
        }
    }

    private String serialize(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid KV value", e);
        }
    }

    private <T> KvValue<T> deserialize(KvEntry entry, Class<T> type) {
        try {
            T value = objectMapper.readValue(entry.valueJson(), type);
            return new KvValue<>(value, entry.version(), entry.schemaVersion());
        } catch (JsonProcessingException e) {
            throw new IllegalStateException(
                "Stored KV value cannot be deserialized: "
                    + entry.namespace() + "/" + entry.key(),
                e
            );
        }
    }
}
```

Practical rule: deserialization error harus dianggap **data/config corruption**, bukan sekadar bad request.

---

## 18. Jersey Resource Pattern

Jangan membuat generic admin API terlalu bebas kecuali untuk internal platform tool.

Lebih aman membuat resource domain-specific:

```java
@Path("/tenants/{tenantId}/workflow/escalation-config")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class EscalationConfigResource {

    private final KvStoreService kvStoreService;

    @GET
    public Response getConfig(@PathParam("tenantId") UUID tenantId) {
        Optional<EscalationConfig> config = kvStoreService.get(
            tenantId,
            "workflow.escalation",
            "default",
            EscalationConfig.class
        );

        return config
            .map(Response::ok)
            .orElseGet(() -> Response.status(Response.Status.NOT_FOUND))
            .build();
    }

    @PUT
    public Response updateConfig(
        @PathParam("tenantId") UUID tenantId,
        UpdateEscalationConfigRequest request
    ) {
        kvStoreService.updateWithVersion(
            tenantId,
            "workflow.escalation",
            "default",
            request.expectedVersion(),
            request.config(),
            "current-user"
        );

        return Response.noContent().build();
    }
}
```

API-nya domain-specific, storage-nya KV.

Ini menjaga agar table `app_kv_store` tidak berubah menjadi tempat sampah global.

---

## 19. Failure Modes

| Failure mode | Penyebab | Mitigasi |
|---|---|---|
| Lost update | Dua writer update key yang sama | `version` + compare-and-set |
| Key collision | Namespace terlalu umum | Namespace governance |
| JSON corruption | Value tidak sesuai DTO terbaru | `schema_version`, validation, migration |
| Expired data terbaca | Query tidak filter `expires_at` | Standard query helper / mapper |
| Cleanup membuat bloat | Delete besar-besaran | Batch delete, autovacuum tuning, partition |
| GIN index membesar | Semua value di-index | Pakai expression/partial index dulu |
| KV jadi dumping ground | Semua data fleksibel masuk KV | Ownership dan whitelist namespace |
| Security leak | Tenant di JSON, bukan kolom | `tenant_id` wajib kolom |
| Query lambat | Arbitrary JSON query | Query governance dan `EXPLAIN ANALYZE` |
| Audit hilang | Upsert langsung overwrite | Audit table / history table |

---

## 20. Production Checklist

Sebelum KV table dipakai production, cek ini:

| Checklist | Status |
|---|---|
| Ada `tenant_id` atau boundary ownership lain | Wajib untuk multi-tenant |
| Ada `namespace` | Wajib |
| Ada `key` | Wajib |
| Ada `value_type` | Sangat disarankan |
| Ada `schema_version` | Sangat disarankan |
| Ada `version` | Wajib jika editable |
| Ada `expires_at` | Wajib jika TTL-like |
| Read query filter expired row | Wajib |
| Cleanup job batch-based | Wajib untuk data besar |
| Upsert behavior jelas | Wajib |
| Compare-and-set untuk update kritikal | Wajib |
| Audit untuk config kritikal | Wajib |
| Namespace whitelist | Sangat disarankan |
| JSON value validation | Wajib untuk config/domain behavior |
| Index berdasarkan query nyata | Wajib |
| `EXPLAIN ANALYZE` untuk query utama | Wajib |
| Alert untuk slow query / bloat | Sangat disarankan |

---

## 21. Kapan Pattern Ini Tidak Cocok?

| Need | Kenapa kurang cocok |
|---|---|
| Cache volatile high-throughput | Redis lebih natural karena latency dan TTL native |
| Pub/sub real-time config propagation | PostgreSQL bisa, tapi Redis/Kafka/event bus biasanya lebih tepat |
| Arbitrary document query | Lebih masuk ke document DB/search engine atau desain document khusus |
| Large binary object | Jangan taruh besar di `jsonb`; gunakan object storage atau `bytea` dengan hati-hati |
| Hot counter update sangat tinggi | Row-level contention tinggi |
| Semua service bebas tulis key | Governance buruk, ownership kabur |
| Query analytics kompleks atas value JSON | Lebih baik relational/OLAP model |

---

## 22. Ringkasan Praktis

```text
Recommended PostgreSQL KV Pattern
│
├── Identity
│   └── PRIMARY KEY (tenant_id, namespace, key)
│
├── Value
│   └── value jsonb + value_type + schema_version
│
├── Lifecycle
│   └── status + expires_at + cleanup job
│
├── Concurrency
│   └── version + compare-and-set
│
├── Index
│   ├── PK for exact lookup
│   ├── partial index for active/list query
│   ├── expires_at index for cleanup
│   ├── expression index for hot JSON field
│   └── GIN only for real containment search
│
└── API Design
    ├── domain-specific endpoint
    ├── namespace/key whitelist
    ├── typed DTO validation
    └── audit for critical config
```

---

# Status

**Seri 2/19 selesai.**

Berikutnya: **Seri 3/19 - PostgreSQL `hstore`: use case, operator, indexing, limitation, dan kapan lebih baik pakai `jsonb`.**

---

**Sources:**

- [Documentation: 18: INSERT](https://www.postgresql.org/docs/current/sql-insert.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:28:21 PM

Saya lanjut ke **Seri 3/19**, fokus pada `hstore`: kapan berguna sebagai key-value flat, bagaimana operator/query/index-nya, dan batasnya dibanding `jsonb`.

# Seri 3/19 - PostgreSQL `hstore`: Use Case, Operator, Indexing, Limitation

## 1. Tujuan Seri Ini

Seri ini membahas penggunaan **PostgreSQL `hstore`** sebagai pola **flat key-value attributes** di dalam satu kolom.

`hstore` adalah extension PostgreSQL yang menyediakan tipe data untuk menyimpan pasangan **key/value** dalam satu nilai. Ia cocok untuk data semi-structured yang key-nya bervariasi antar row, tetapi semua key dan value disimpan sebagai **text string**. Dokumentasi PostgreSQL menyebut use case seperti row dengan banyak atribut yang jarang diperiksa, atau semi-structured data. `hstore` juga termasuk trusted extension, sehingga bisa di-install oleh non-superuser yang punya privilege `CREATE` pada database. ([PostgreSQL](https://www.postgresql.org/docs/current/hstore.html?utm_source=chatgpt.com))

Di seri sebelumnya kita sudah membahas simple KV table dengan `jsonb`. Sekarang kita fokus ke pertanyaan praktis:

> kapan `hstore` lebih cocok daripada `jsonb`, kapan tidak, dan bagaimana memakainya tanpa membuat schema berantakan?

---

## 2. Mental Model

```text id="7d8c3n"
PostgreSQL hstore Mental Model
│
├── What it is
│   ├── one column
│   ├── many key/value pairs
│   ├── flat structure only
│   ├── keys are text
│   └── values are text or NULL
│
├── Good for
│   ├── sparse flat attributes
│   ├── metadata bag
│   ├── external reference attributes
│   ├── simple labels/properties
│   └── product/case/custom fields if value is text-like
│
├── Not good for
│   ├── nested document
│   ├── arrays
│   ├── numeric/boolean type fidelity
│   ├── complex schema validation
│   └── rich document mutation
│
├── Query
│   ├── key exists
│   ├── value by key
│   ├── contains key/value pair
│   ├── contains keys
│   └── convert to json/jsonb if needed
│
└── Index
    ├── GIN for key/value containment/existence
    ├── GiST also supported
    ├── expression index for one hot key
    └── B-tree still used for relational columns
```

---

## 3. Kapan `hstore` Cocok?

`hstore` cocok ketika kita punya **atribut tambahan yang flat, jarang dipakai, dan semua value bisa diperlakukan sebagai text**.

Contoh domain:

| Use case | Contoh atribut | Kenapa cocok |
|---|---|---|
| External provider metadata | `provider_id`, `source_system`, `risk_code` | Key bervariasi tergantung provider |
| Case custom attributes sederhana | `channel`, `priority_hint`, `region_code` | Flat dan text-like |
| Product/catalog properties sederhana | `color`, `size`, `material` | Banyak atribut opsional |
| Import staging metadata | `file_name`, `row_number`, `batch_id` | Sementara, fleksibel, text |
| Integration response headers | `request_id`, `trace_id`, `gateway_code` | Flat key-value |
| Label/property bag internal | `owner`, `module`, `classification` | Cocok untuk filtering sederhana |

Contoh data `hstore`:

```sql id="s2urqo"
'channel => web, region_code => JKT, priority_hint => high'
```

Atau dengan literal lebih eksplisit:

```sql id="ql1m1r"
'"channel"=>"web", "region_code"=>"JKT", "priority_hint"=>"high"'
```

---

## 4. Kapan Jangan Pakai `hstore`?

Gunakan `jsonb` atau relational table jika butuh struktur lebih kaya.

| Kebutuhan | Kenapa `hstore` kurang cocok | Alternatif |
|---|---|---|
| Nested object | `hstore` flat only | `jsonb` |
| Array | Tidak natural | `jsonb` |
| Boolean/number asli | Value `hstore` adalah text | `jsonb` atau kolom typed |
| Complex document | Tidak ada struktur nested | `jsonb` |
| Strong validation per field | Sulit enforce secara sistematis | Kolom relational / generated column / CHECK |
| Join berdasarkan attribute penting | Lebih baik kolom biasa | Relational column |
| Audit mutation detail kompleks | Bisa, tapi kurang natural | JSONB document audit / event table |
| Query arbitrary dynamic attribute skala besar | Index dan governance bisa kompleks | Search/document store khusus |

Rule paling praktis:

```text id="o7cg2f"
hstore = flat text property bag
jsonb  = typed/nested document
table  = business-critical structured data
```

---

## 5. Enable Extension

Sebelum memakai `hstore`, extension harus diaktifkan:

```sql id="9vowei"
CREATE EXTENSION IF NOT EXISTS hstore;
```

`hstore` adalah module/extension PostgreSQL, bukan tipe yang selalu tersedia otomatis di semua database. Dokumentasi PostgreSQL menyatakan module ini mengimplementasikan tipe data `hstore` untuk key/value pairs dalam satu PostgreSQL value. ([PostgreSQL](https://www.postgresql.org/docs/current/hstore.html?utm_source=chatgpt.com))

Dalam enterprise setup, ini harus masuk migration:

```sql id="nr4msc"
-- V001__enable_hstore.sql
CREATE EXTENSION IF NOT EXISTS hstore;
```

Jangan enable manual di production tanpa migration, karena environment dev/staging/prod bisa tidak konsisten.

---

## 6. Table Design Pattern

### 6.1 Basic Pattern

```sql id="zvx1wx"
CREATE TABLE case_attribute_bag (
    case_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,
    attributes hstore NOT NULL DEFAULT hstore(''),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
```

Namun untuk production, biasanya lebih baik tambahkan status/version:

```sql id="16f98p"
CREATE TABLE case_attribute_bag (
    case_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    attributes hstore NOT NULL DEFAULT hstore(''),

    status text NOT NULL DEFAULT 'ACTIVE',
    version bigint NOT NULL DEFAULT 0,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    updated_by text NULL,

    CONSTRAINT ck_case_attribute_bag_status
        CHECK (status IN ('ACTIVE', 'DISABLED', 'DELETED'))
);
```

### 6.2 Pattern dengan Relational Core + `hstore`

```sql id="ba0isv"
CREATE TABLE provider_reference (
    id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,
    provider_code text NOT NULL,
    external_reference text NOT NULL,

    -- stable relational fields
    entity_type text NOT NULL,
    status text NOT NULL,

    -- flexible flat attributes
    attributes hstore NOT NULL DEFAULT hstore(''),

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_provider_reference
        UNIQUE (tenant_id, provider_code, external_reference),

    CONSTRAINT ck_provider_reference_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'FAILED'))
);
```

Prinsipnya sama seperti `jsonb`: **jangan sembunyikan invariant utama di flexible column**.

---

## 7. Operator Dasar `hstore`

PostgreSQL menyediakan operator dan fungsi `hstore` untuk mengambil value, cek key, cek containment, menghapus key, dan menggabungkan hstore. Dokumentasi PostgreSQL menyediakan daftar operator/fungsi `hstore` seperti access by key, existence, containment, delete, concatenate, dan conversion ke JSON/JSONB. ([PostgreSQL](https://www.postgresql.org/docs/current/hstore.html?utm_source=chatgpt.com))

### 7.1 Ambil Value Berdasarkan Key

```sql id="xadz73"
SELECT attributes -> 'region_code' AS region_code
FROM case_attribute_bag
WHERE case_id = :caseId;
```

Hasilnya text.

---

### 7.2 Cek Key Exists

```sql id="unh4ef"
SELECT *
FROM case_attribute_bag
WHERE attributes ? 'priority_hint';
```

Gunakan untuk mencari row yang punya attribute tertentu.

---

### 7.3 Cek Multiple Keys

```sql id="wwdako"
SELECT *
FROM case_attribute_bag
WHERE attributes ?& ARRAY['region_code', 'channel'];
```

Artinya semua key harus ada.

```sql id="iu7gsd"
SELECT *
FROM case_attribute_bag
WHERE attributes ?| ARRAY['risk_code', 'priority_hint'];
```

Artinya salah satu key ada.

---

### 7.4 Contains Key/Value Pair

```sql id="q3h8fq"
SELECT *
FROM case_attribute_bag
WHERE attributes @> '"region_code"=>"JKT"'::hstore;
```

Artinya `attributes` mengandung pair `region_code = JKT`.

---

### 7.5 Append / Merge Attribute

```sql id="rcn7th"
UPDATE case_attribute_bag
SET
    attributes = attributes || '"priority_hint"=>"high"'::hstore,
    version = version + 1,
    updated_at = now()
WHERE case_id = :caseId
  AND version = :expectedVersion;
```

Kalau key sudah ada, value akan ditimpa oleh operand kanan.

---

### 7.6 Delete Key

```sql id="88fo47"
UPDATE case_attribute_bag
SET
    attributes = delete(attributes, 'priority_hint'),
    version = version + 1,
    updated_at = now()
WHERE case_id = :caseId
  AND version = :expectedVersion;
```

---

## 8. Practical Query Pattern

### 8.1 Find by Stable Relational Field

```sql id="gqjrcs"
SELECT id, provider_code, external_reference, attributes
FROM provider_reference
WHERE tenant_id = :tenantId
  AND provider_code = :providerCode
  AND status = 'ACTIVE';
```

Ini harus tetap menjadi query utama jika data punya stable filter.

---

### 8.2 Find by hstore Attribute

```sql id="3g5y6c"
SELECT id, provider_code, external_reference, attributes
FROM provider_reference
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND attributes -> 'region_code' = :regionCode;
```

Untuk key yang sangat sering dipakai, pertimbangkan expression index atau promote menjadi kolom biasa.

---

### 8.3 Find by Containment

```sql id="6xxvxc"
SELECT id, provider_code, external_reference, attributes
FROM provider_reference
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND attributes @> hstore(:attributeKey, :attributeValue);
```

Contoh:

```sql id="qf4vm3"
SELECT *
FROM provider_reference
WHERE attributes @> hstore('gateway_code', 'APPROVED');
```

---

### 8.4 Convert to JSONB untuk API Response

Kadang API response lebih natural dalam JSON.

```sql id="n339ry"
SELECT
    id,
    provider_code,
    external_reference,
    hstore_to_jsonb(attributes) AS attributes_json
FROM provider_reference
WHERE id = :id;
```

PostgreSQL menyediakan fungsi conversion dari `hstore` ke JSON/JSONB seperti `hstore_to_json`, `hstore_to_jsonb`, dan varian loose conversion. ([PostgreSQL](https://www.postgresql.org/docs/current/hstore.html?utm_source=chatgpt.com))

---

## 9. Indexing Strategy

PostgreSQL mendukung beberapa index type seperti B-tree, Hash, GiST, SP-GiST, GIN, BRIN, dan bloom extension; setiap index type memakai algoritma berbeda dan cocok untuk jenis predicate berbeda. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-types.html?utm_source=chatgpt.com))

Untuk `hstore`, practical index biasanya:

1. B-tree untuk kolom relational.
2. Expression index untuk satu key yang sering dipakai.
3. GIN untuk key existence / containment.
4. GiST jika butuh operator class tertentu, tetapi GIN lebih umum untuk containment/existence use case.

---

### 9.1 B-tree untuk Relational Filters

```sql id="s9cgwa"
CREATE INDEX idx_provider_reference_tenant_provider_status
    ON provider_reference (tenant_id, provider_code, status);
```

Ini tetap wajib karena kebanyakan query production harus mulai dari tenant/status/provider.

---

### 9.2 Expression Index untuk Hot Attribute

Jika `region_code` sering difilter:

```sql id="pscr53"
CREATE INDEX idx_provider_reference_region_code
    ON provider_reference ((attributes -> 'region_code'))
    WHERE status = 'ACTIVE';
```

Query:

```sql id="h0gy8k"
SELECT *
FROM provider_reference
WHERE status = 'ACTIVE'
  AND attributes -> 'region_code' = 'JKT';
```

Expression index bagus ketika query selalu mengambil satu key spesifik. PostgreSQL mendukung index pada expression, sehingga hasil fungsi/operator dapat di-index. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-types.html?utm_source=chatgpt.com))

---

### 9.3 GIN Index untuk Containment / Key Exists

```sql id="xsymuw"
CREATE INDEX idx_provider_reference_attributes_gin
    ON provider_reference
    USING gin (attributes);
```

Query yang bisa terbantu:

```sql id="nskfku"
SELECT *
FROM provider_reference
WHERE attributes ? 'gateway_code';
```

```sql id="ytgn2v"
SELECT *
FROM provider_reference
WHERE attributes @> '"gateway_code"=>"APPROVED"'::hstore;
```

GIN didesain untuk composite values ketika query mencari elemen di dalam nilai tersebut; ini cocok untuk tipe seperti array, hstore, dan jsonb. ([PostgreSQL](https://www.postgresql.org/docs/current/hstore.html?utm_source=chatgpt.com))

---

### 9.4 Jangan Over-index

Jangan otomatis membuat:

```sql id="aehjsy"
CREATE INDEX idx_everything_hstore_gin
    ON provider_reference
    USING gin (attributes);
```

untuk semua tabel `hstore`.

Gunakan decision berikut:

| Query pattern | Index |
|---|---|
| `WHERE id = ?` | Primary key |
| `WHERE tenant_id = ? AND status = ?` | B-tree |
| `WHERE attributes -> 'region_code' = ?` sering | Expression index |
| `WHERE attributes ? 'key'` sering | GIN |
| `WHERE attributes @> 'k=>v'` sering | GIN |
| Query jarang/admin-only | Mungkin tidak perlu index |
| Query banyak attribute arbitrary | Pertimbangkan ulang model |

---

## 10. Constraint dan Validation

`hstore` fleksibel, tetapi bukan berarti bebas total.

### 10.1 Pastikan Required Key Ada

Misalnya `provider_reference` harus punya `source_system`:

```sql id="tp9uw0"
ALTER TABLE provider_reference
ADD CONSTRAINT ck_provider_reference_has_source_system
CHECK (attributes ? 'source_system');
```

### 10.2 Pastikan Value Salah Satu dari Set Tertentu

```sql id="5ll7tl"
ALTER TABLE provider_reference
ADD CONSTRAINT ck_provider_reference_channel
CHECK (
    attributes -> 'channel' IS NULL
    OR attributes -> 'channel' IN ('WEB', 'MOBILE', 'BRANCH', 'API')
);
```

### 10.3 Pastikan Tidak Ada Key Terlarang

```sql id="c39kko"
ALTER TABLE provider_reference
ADD CONSTRAINT ck_provider_reference_no_sensitive_keys
CHECK (
    NOT attributes ?| ARRAY['password', 'secret', 'token', 'api_key']
);
```

Ini penting agar sensitive data tidak masuk ke metadata bag.

---

## 11. Mutation Pattern

### 11.1 Replace Entire Attribute Bag

```sql id="l5r0p6"
UPDATE provider_reference
SET
    attributes = CAST(:attributes AS hstore),
    version = version + 1,
    updated_at = now()
WHERE id = :id
  AND version = :expectedVersion;
```

Cocok jika client mengedit seluruh set attribute.

---

### 11.2 Patch One Attribute

```sql id="5x0vrs"
UPDATE provider_reference
SET
    attributes = attributes || hstore(:attributeKey, :attributeValue),
    version = version + 1,
    updated_at = now()
WHERE id = :id
  AND version = :expectedVersion;
```

Cocok untuk update kecil.

---

### 11.3 Patch Multiple Attributes

```sql id="syekb0"
UPDATE provider_reference
SET
    attributes = attributes || CAST(:patchAttributes AS hstore),
    version = version + 1,
    updated_at = now()
WHERE id = :id
  AND version = :expectedVersion;
```

---

### 11.4 Remove Attribute

```sql id="8gqba0"
UPDATE provider_reference
SET
    attributes = delete(attributes, :attributeKey),
    version = version + 1,
    updated_at = now()
WHERE id = :id
  AND version = :expectedVersion;
```

---

## 12. Audit Pattern untuk `hstore`

Karena `hstore` sering dipakai untuk atribut fleksibel, audit harus jelas.

```sql id="11ja9p"
CREATE TABLE provider_reference_attribute_audit (
    audit_id bigserial PRIMARY KEY,
    reference_id uuid NOT NULL,
    tenant_id uuid NOT NULL,

    old_attributes hstore NULL,
    new_attributes hstore NULL,

    action text NOT NULL,
    actor text NULL,
    reason text NULL,
    changed_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_provider_reference_attribute_audit_action
        CHECK (action IN ('CREATE', 'REPLACE', 'PATCH', 'REMOVE', 'DELETE'))
);
```

### Update + Audit dalam Satu Statement

```sql id="ixxgnx"
WITH old_row AS (
    SELECT *
    FROM provider_reference
    WHERE id = :id
      AND tenant_id = :tenantId
      AND version = :expectedVersion
),
updated_row AS (
    UPDATE provider_reference pr
    SET
        attributes = pr.attributes || CAST(:patchAttributes AS hstore),
        version = pr.version + 1,
        updated_at = now()
    FROM old_row old
    WHERE pr.id = old.id
    RETURNING pr.*
)
INSERT INTO provider_reference_attribute_audit (
    reference_id,
    tenant_id,
    old_attributes,
    new_attributes,
    action,
    actor,
    reason
)
SELECT
    old_row.id,
    old_row.tenant_id,
    old_row.attributes,
    updated_row.attributes,
    'PATCH',
    :actor,
    :reason
FROM old_row
JOIN updated_row ON updated_row.id = old_row.id;
```

Jika row count insert audit = `0`, update tidak terjadi karena version mismatch atau row tidak ditemukan.

---

## 13. `hstore` vs `jsonb`

| Aspek | `hstore` | `jsonb` |
|---|---|---|
| Struktur | Flat key-value | Nested object/array |
| Key type | Text | Text untuk object key |
| Value type | Text atau NULL | String, number, boolean, object, array, null |
| Cocok untuk | Sparse flat attributes | Document/semi-structured payload |
| Operator | Simpler | Lebih kaya |
| JSON API compatibility | Perlu convert | Native cocok |
| Type fidelity | Lemah | Lebih baik |
| Indexing | GIN/GiST/expression | GIN/expression/partial |
| Long-term flexibility | Terbatas | Lebih fleksibel |
| Kompleksitas | Lebih sederhana | Lebih kompleks |

Rule singkat:

```text id="ibxdk2"
Pakai hstore kalau:
  - key/value flat
  - semua value cukup text
  - attribute bag sederhana
  - tidak butuh nested document

Pakai jsonb kalau:
  - butuh nested structure
  - value butuh type asli
  - API/domain sudah JSON-native
  - perlu document-style lifecycle
```

---

## 14. Anti-Pattern

### 14.1 Menyimpan Business-Critical Field di `hstore`

Buruk:

```sql id="egyy30"
attributes = '"status"=>"APPROVED", "tenant_id"=>"...", "amount"=>"1000000"'
```

Lebih baik:

```sql id="v65fy3"
status text NOT NULL,
tenant_id uuid NOT NULL,
amount numeric(18,2) NOT NULL,
attributes hstore
```

Business invariant harus tetap relational.

---

### 14.2 Menggunakan `hstore` untuk Nested Document

Buruk:

```text id="ueyqv8"
customer.name => Alice
customer.address.city => Jakarta
customer.address.zip => 12910
items.0.sku => ABC
items.0.qty => 2
```

Ini pseudo-nested dan sulit divalidasi. Gunakan `jsonb`.

---

### 14.3 Attribute Bag Tanpa Governance

Buruk:

```sql id="759o6k"
attributes hstore NOT NULL
```

tanpa whitelist, tanpa key convention, tanpa audit, tanpa size guardrail.

Dampaknya:

- key typo membuat data bercabang,
- query susah distandarkan,
- index tidak efektif,
- sensitive data bisa masuk,
- API contract tidak jelas.

---

## 15. Practical MyBatis Preview

Seri integrasi key-value ada di **Seri 6**, tetapi untuk `hstore` ada beberapa pattern penting.

### 15.1 Simpan `hstore` sebagai String

Cara paling sederhana dengan MyBatis adalah mengirim literal `hstore` sebagai string lalu cast:

```xml id="m6j3f8"
<insert id="insertProviderReference">
    INSERT INTO provider_reference (
        id,
        tenant_id,
        provider_code,
        external_reference,
        entity_type,
        status,
        attributes
    )
    VALUES (
        #{id},
        #{tenantId},
        #{providerCode},
        #{externalReference},
        #{entityType},
        #{status},
        CAST(#{attributesHstore} AS hstore)
    )
</insert>
```

Namun ini rawan escaping jika string dibuat manual.

---

### 15.2 Lebih Aman: Build `hstore` dari Pair

Untuk single attribute patch:

```xml id="9n7phw"
<update id="patchAttribute">
    UPDATE provider_reference
    SET
        attributes = attributes || hstore(#{attributeKey}, #{attributeValue}),
        version = version + 1,
        updated_at = now()
    WHERE id = #{id}
      AND tenant_id = #{tenantId}
      AND version = #{expectedVersion}
</update>
```

Ini lebih aman daripada menyusun literal `'"key"=>"value"'` manual di Java.

---

### 15.3 Ambil sebagai JSONB untuk API

```xml id="nv0m70"
<select id="findById" resultMap="ProviderReferenceResultMap">
    SELECT
        id,
        tenant_id,
        provider_code,
        external_reference,
        entity_type,
        status,
        hstore_to_jsonb(attributes)::text AS attributes_json,
        version,
        created_at,
        updated_at
    FROM provider_reference
    WHERE id = #{id}
      AND tenant_id = #{tenantId}
</select>
```

Di Java, field `attributesJson` bisa di-deserialize menjadi `Map<String, String>`.

```java id="r4k2wz"
public record ProviderReferenceView(
    UUID id,
    UUID tenantId,
    String providerCode,
    String externalReference,
    String entityType,
    String status,
    Map<String, String> attributes,
    long version
) {}
```

---

## 16. API Design Pattern

Jangan expose arbitrary generic update kecuali untuk trusted admin/internal tooling.

Kurang aman:

```http id="j9jwhw"
PATCH /provider-references/{id}/attributes
{
  "anything": "anything"
}
```

Lebih aman:

```http id="nnljwl"
PATCH /provider-references/{id}/metadata
{
  "expectedVersion": 7,
  "attributes": {
    "region_code": "JKT",
    "channel": "WEB",
    "source_system": "INTERNAL_PORTAL"
  },
  "reason": "Correct imported metadata"
}
```

Tambahkan validation:

| Validasi | Contoh |
|---|---|
| Allowed key | hanya `region_code`, `channel`, `source_system`, `priority_hint` |
| Max key length | misalnya 64 |
| Max value length | misalnya 256/1024 |
| No sensitive key | block `password`, `token`, `secret` |
| Expected version | optimistic locking |
| Reason required | untuk audit mutation |

---

## 17. Migration Pattern: `hstore` ke `jsonb`

Kadang `hstore` cukup di awal, lalu kebutuhan berkembang menjadi nested/typed document. PostgreSQL menyediakan conversion dari `hstore` ke JSON/JSONB, sehingga migration bisa dibuat bertahap. ([PostgreSQL](https://www.postgresql.org/docs/current/hstore.html?utm_source=chatgpt.com))

### 17.1 Tambah Kolom JSONB

```sql id="60q6wk"
ALTER TABLE provider_reference
ADD COLUMN attributes_jsonb jsonb;
```

### 17.2 Backfill

```sql id="phm14f"
UPDATE provider_reference
SET attributes_jsonb = hstore_to_jsonb(attributes)
WHERE attributes_jsonb IS NULL;
```

### 17.3 Dual Write Sementara

Application menulis ke dua kolom selama transisi.

### 17.4 Cutover Read

Application mulai membaca dari `attributes_jsonb`.

### 17.5 Drop hstore Column Setelah Stabil

```sql id="4yul82"
ALTER TABLE provider_reference
DROP COLUMN attributes;
```

Practical rule: jangan migrasi langsung di satu deploy besar untuk data kritikal. Gunakan expand → backfill → dual read/write → contract switch → cleanup.

---

## 18. Performance Checklist

| Checklist | Penjelasan |
|---|---|
| Query utama tetap memakai relational columns | `tenant_id`, `status`, `provider_code` harus indexed |
| Hot key pakai expression index | Lebih murah dari GIN global |
| Containment/existence banyak pakai GIN | Cocok jika query `?`, `?&`, `?|`, `@>` sering |
| Hindari hstore terlalu besar | Kalau value bag besar/nested, gunakan `jsonb` atau model lain |
| Cek `EXPLAIN ANALYZE` | Pastikan index benar-benar dipakai |
| Monitor write overhead | GIN/GiST menambah cost insert/update |
| Hindari arbitrary dynamic filter | Whitelist key yang boleh dicari |
| Audit mutation kritikal | Attribute bag sering berubah tanpa jejak jika tidak diaudit |

---

## 19. Failure Modes

| Failure mode | Penyebab | Mitigasi |
|---|---|---|
| Key typo | Tidak ada whitelist | Application validation / CHECK untuk required keys |
| Value type ambiguity | Semua value text | Gunakan `jsonb` jika butuh type fidelity |
| Query lambat | Attribute sering difilter tapi tidak di-index | Expression index / GIN |
| Index membesar | GIN pada attribute bag besar | Batasi key/value, partial index, rethink model |
| Sensitive data leak | Attribute bebas | Blocklist/allowlist key |
| Lost update | Patch tanpa version | Optimistic locking |
| Hard-to-debug API | Generic metadata endpoint | Domain-specific endpoint |
| Pseudo-nested mess | Pakai dotted key | Gunakan `jsonb` |
| Reporting sulit | Field penting ada di hstore | Promote ke relational column |
| Migration sulit | hstore dipakai untuk semua hal | Governance dan schema version |

---

## 20. Production-Ready Template

```sql id="w0tgjk"
CREATE EXTENSION IF NOT EXISTS hstore;

CREATE TABLE provider_reference (
    id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,
    provider_code text NOT NULL,
    external_reference text NOT NULL,

    entity_type text NOT NULL,
    status text NOT NULL,

    attributes hstore NOT NULL DEFAULT hstore(''),

    version bigint NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    updated_by text NULL,

    CONSTRAINT uq_provider_reference
        UNIQUE (tenant_id, provider_code, external_reference),

    CONSTRAINT ck_provider_reference_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'FAILED')),

    CONSTRAINT ck_provider_reference_no_sensitive_keys
        CHECK (
            NOT attributes ?| ARRAY['password', 'secret', 'token', 'api_key']
        )
);

CREATE INDEX idx_provider_reference_tenant_provider_status
    ON provider_reference (tenant_id, provider_code, status);

CREATE INDEX idx_provider_reference_region_code
    ON provider_reference ((attributes -> 'region_code'))
    WHERE status = 'ACTIVE';

CREATE INDEX idx_provider_reference_attributes_gin
    ON provider_reference
    USING gin (attributes);
```

Catatan: GIN index di template ini hanya jika containment/existence query memang sering. Kalau tidak, hapus dulu dan tambahkan saat terbukti perlu.

---

## 21. Ringkasan Praktis

```text id="ezvl7p"
hstore Practical Rule
│
├── Use hstore for
│   ├── flat key/value attributes
│   ├── sparse text metadata
│   ├── simple provider/custom fields
│   └── semi-structured attributes rarely queried
│
├── Avoid hstore for
│   ├── nested documents
│   ├── arrays
│   ├── typed values
│   ├── core business fields
│   └── complex validation
│
├── Indexing
│   ├── B-tree for relational filters
│   ├── expression index for hot key
│   └── GIN for existence/containment
│
└── Production safety
    ├── extension via migration
    ├── whitelist keys
    ├── block sensitive keys
    ├── optimistic locking
    ├── audit critical mutation
    └── migrate to jsonb if structure grows
```

---

# Status

**Seri 3/19 selesai.**

Berikutnya: **Seri 4/19 - `jsonb` as Key-Value Store: config, feature flag, tenant setting, typed value, validation, indexing, dan operational pattern.**

---

**Sources:**

- [Documentation: 18: F.17. hstore — hstore key/value datatype](https://www.postgresql.org/docs/current/hstore.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:30:43 PM

Saya lanjut ke **Seri 4/19**, fokus pada `jsonb` sebagai key-value store yang lebih kaya daripada `hstore`: tenant config, feature flag, typed value, validation, indexing, dan pola penggunaan production.

# Seri 4/19 - `jsonb` as Key-Value Store: Config, Feature Flag, Tenant Setting

## 1. Tujuan Seri Ini

Seri ini membahas cara memakai PostgreSQL `jsonb` sebagai **key-value store yang lebih kaya** daripada `hstore`.

Di seri sebelumnya:

- **Seri 2**: simple KV table dengan `value jsonb`
- **Seri 3**: `hstore` untuk flat text key-value
- **Seri 4 ini**: `jsonb` sebagai typed/nested key-value store untuk config, feature flag, tenant setting, dan runtime policy

`jsonb` cocok saat value tidak cukup hanya string/text, misalnya:

```json
{
  "enabled": true,
  "rolloutPercentage": 25,
  "allowedRoles": ["SUPERVISOR", "REVIEWER"],
  "rules": {
    "minRiskScore": 70,
    "requiresManualReview": true
  }
}
```

PostgreSQL membedakan `json` dan `jsonb`: `json` menyimpan salinan teks input, sedangkan `jsonb` disimpan dalam format binary decomposed sehingga tidak mempertahankan whitespace/order asli, tetapi lebih efisien untuk pemrosesan dan mendukung indexing. Untuk workload production yang perlu query terhadap isi JSON, `jsonb` biasanya lebih tepat daripada `json`. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html?utm_source=chatgpt.com))

---

## 2. Mental Model

```text
jsonb as Key-Value Store
│
├── Identity
│   ├── tenant_id
│   ├── namespace
│   └── key
│
├── Value
│   ├── value jsonb
│   ├── schema_version
│   ├── value_type
│   └── validation profile
│
├── Use Case
│   ├── tenant config
│   ├── feature flag
│   ├── runtime policy
│   ├── integration config
│   ├── UI behavior config
│   └── workflow parameter
│
├── Query
│   ├── exact key lookup
│   ├── list namespace
│   ├── JSON field filter
│   ├── containment query
│   └── JSONPath query
│
├── Mutation
│   ├── replace whole value
│   ├── merge object
│   ├── patch field
│   ├── compare-and-set
│   └── audit mutation
│
└── Operational Safety
    ├── CHECK constraint
    ├── generated/extracted column
    ├── expression index
    ├── partial index
    ├── GIN index
    ├── schema versioning
    └── query governance
```

---

## 3. Kapan `jsonb` sebagai KV Cocok?

| Use case | Contoh value | Kenapa `jsonb` cocok |
|---|---|---|
| Tenant configuration | Limit, threshold, calendar rule, escalation rule | Struktur bisa nested dan typed |
| Feature flag | Enabled, rollout percentage, targeting rule | Boolean, number, array, object native |
| Workflow parameter | SLA, reviewer role, escalation level | Bisa disimpan dekat dengan relational workflow/case data |
| Integration config | Endpoint, timeout, retry, credential reference | Bisa punya struktur object kompleks |
| UI behavior config | Visible columns, form sections, default filter | Array/object natural |
| Runtime policy | Approval matrix, risk threshold, routing rule | Bisa versioned dan audited |
| External provider snapshot kecil | Response metadata, provider capability | Fleksibel tapi tetap transactional |

`jsonb` bukan sekadar “bebas schema”. Dalam production, gunakan `jsonb` untuk **bagian yang memang fleksibel**, bukan untuk menyembunyikan semua business invariant.

---

## 4. Kapan Jangan Pakai `jsonb` KV?

| Kebutuhan | Kenapa tidak ideal | Alternatif |
|---|---|---|
| Lookup cache ultra-cepat dan volatile | PostgreSQL bukan cache engine native | Redis |
| Semua field perlu FK/unique constraint | JSONB sulit enforce relational invariant | Normalisasi tabel |
| Query analytics berat atas banyak field | JSONB bisa mahal dan sulit dioptimalkan | OLAP model / materialized view |
| Arbitrary user-defined query bebas | Bisa memicu seq scan/index bloat | Query API whitelist/search engine |
| Document sangat besar dan sering patch | Write amplification, bloat, concurrency conflict | Dedicated document strategy |
| Hot counter update tinggi | Row contention | Counter table/sharded counter/Redis |
| Secret credential | Jangan simpan raw secret di JSONB | Secret manager / encrypted reference |

Rule praktis:

```text
jsonb KV cocok untuk flexible config/policy.
jsonb KV buruk jika menjadi tempat semua data karena malas desain schema.
```

---

## 5. Recommended Table Design

```sql
CREATE TABLE app_jsonb_kv_store (
    tenant_id uuid NOT NULL,
    namespace text NOT NULL,
    key text NOT NULL,

    value jsonb NOT NULL,
    value_type text NOT NULL,
    schema_version integer NOT NULL DEFAULT 1,

    status text NOT NULL DEFAULT 'ACTIVE',
    version bigint NOT NULL DEFAULT 0,

    effective_from timestamptz NULL,
    effective_until timestamptz NULL,
    expires_at timestamptz NULL,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by text NULL,
    updated_by text NULL,

    PRIMARY KEY (tenant_id, namespace, key),

    CONSTRAINT ck_app_jsonb_kv_namespace_not_blank
        CHECK (length(trim(namespace)) > 0),

    CONSTRAINT ck_app_jsonb_kv_key_not_blank
        CHECK (length(trim(key)) > 0),

    CONSTRAINT ck_app_jsonb_kv_status
        CHECK (status IN ('DRAFT', 'ACTIVE', 'DISABLED', 'DELETED')),

    CONSTRAINT ck_app_jsonb_kv_value_type
        CHECK (value_type IN (
            'TENANT_CONFIG',
            'FEATURE_FLAG',
            'WORKFLOW_POLICY',
            'INTEGRATION_CONFIG',
            'UI_CONFIG',
            'REFERENCE_SNAPSHOT'
        )),

    CONSTRAINT ck_app_jsonb_kv_value_is_object
        CHECK (jsonb_typeof(value) = 'object'),

    CONSTRAINT ck_app_jsonb_kv_effective_window
        CHECK (
            effective_from IS NULL
            OR effective_until IS NULL
            OR effective_from < effective_until
        )
);
```

Kenapa `value` dipaksa object?

Karena untuk config/feature flag/policy production, object lebih mudah diberi schema version, validasi, patch, audit, dan defaulting. Scalar seperti `true` atau `30` boleh dipakai untuk KV sederhana, tetapi untuk enterprise config biasanya object lebih aman.

---

## 6. Contoh Value per Use Case

### 6.1 Tenant Config

```json
{
  "maxOpenCases": 5000,
  "defaultTimezone": "Asia/Jakarta",
  "businessCalendar": "ID_BUSINESS_DAY",
  "notificationChannels": ["EMAIL", "IN_APP"],
  "caseAutoCloseDays": 30
}
```

### 6.2 Feature Flag

```json
{
  "enabled": true,
  "rolloutPercentage": 25,
  "allowedTenants": [],
  "allowedRoles": ["SUPERVISOR", "CASE_REVIEWER"],
  "defaultTreatment": "CONTROL"
}
```

### 6.3 Workflow Policy

```json
{
  "slaDays": 5,
  "calendar": "BUSINESS_DAY",
  "escalationLevels": [
    {
      "afterDays": 3,
      "targetRole": "SUPERVISOR"
    },
    {
      "afterDays": 5,
      "targetRole": "REGIONAL_MANAGER"
    }
  ],
  "manualReviewRequired": true
}
```

### 6.4 Integration Config

```json
{
  "endpointRef": "secret://payment-gateway/base-url",
  "timeoutMillis": 3000,
  "retry": {
    "maxAttempts": 3,
    "backoffMillis": 500
  },
  "circuitBreaker": {
    "failureThreshold": 10,
    "openDurationSeconds": 60
  }
}
```

Catatan penting: simpan **reference ke secret**, bukan secret value mentah.

---

## 7. Query Pattern

### 7.1 Exact Lookup by Key

```sql
SELECT
    value,
    value_type,
    schema_version,
    version,
    effective_from,
    effective_until
FROM app_jsonb_kv_store
WHERE tenant_id = :tenantId
  AND namespace = :namespace
  AND key = :key
  AND status = 'ACTIVE'
  AND (expires_at IS NULL OR expires_at > now())
  AND (effective_from IS NULL OR effective_from <= now())
  AND (effective_until IS NULL OR effective_until > now());
```

Ini harus menjadi query utama dan harus ditopang primary key.

---

### 7.2 List Config by Namespace

```sql
SELECT
    key,
    value,
    value_type,
    schema_version,
    version,
    updated_at
FROM app_jsonb_kv_store
WHERE tenant_id = :tenantId
  AND namespace = :namespace
  AND status = 'ACTIVE'
  AND (expires_at IS NULL OR expires_at > now())
ORDER BY key;
```

---

### 7.3 Filter by JSON Field

Contoh cari feature flag yang enabled:

```sql
SELECT
    tenant_id,
    namespace,
    key,
    value
FROM app_jsonb_kv_store
WHERE namespace = 'feature.case-review'
  AND status = 'ACTIVE'
  AND (value ->> 'enabled')::boolean = true;
```

Operator dan fungsi JSON/JSONB di PostgreSQL mencakup akses field, extraction, containment, dan SQL/JSON path; ini membuat query terhadap struktur JSON mungkin dilakukan langsung dari SQL. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

---

### 7.4 Containment Query

```sql
SELECT
    tenant_id,
    namespace,
    key,
    value
FROM app_jsonb_kv_store
WHERE value @> '{"enabled": true}'::jsonb;
```

Containment cocok jika ingin mencari object yang mengandung pasangan key/value tertentu.

---

### 7.5 JSONPath Query

Contoh cari policy yang punya escalation level ke `REGIONAL_MANAGER`:

```sql
SELECT
    tenant_id,
    namespace,
    key,
    value
FROM app_jsonb_kv_store
WHERE namespace = 'workflow.escalation'
  AND jsonb_path_exists(
        value,
        '$.escalationLevels[*] ? (@.targetRole == "REGIONAL_MANAGER")'
      );
```

PostgreSQL mengimplementasikan SQL/JSON path expression melalui tipe `jsonpath`, dan fungsi seperti `jsonb_path_exists` bisa dipakai untuk predicate path yang lebih ekspresif. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

---

## 8. Indexing Strategy

### 8.1 Primary Key

```sql
ALTER TABLE app_jsonb_kv_store
ADD CONSTRAINT pk_app_jsonb_kv_store
PRIMARY KEY (tenant_id, namespace, key);
```

Dipakai untuk exact lookup.

---

### 8.2 Namespace Listing Index

```sql
CREATE INDEX idx_app_jsonb_kv_namespace_active
    ON app_jsonb_kv_store (tenant_id, namespace, status, key)
    WHERE status = 'ACTIVE';
```

Partial index berguna untuk subset row yang sering diakses, misalnya hanya config aktif.

---

### 8.3 Effective Window Index

```sql
CREATE INDEX idx_app_jsonb_kv_effective_window
    ON app_jsonb_kv_store (tenant_id, namespace, effective_from, effective_until)
    WHERE status = 'ACTIVE';
```

Berguna jika banyak config punya active window.

---

### 8.4 Expression Index untuk Hot JSON Field

Kalau `enabled` sering difilter:

```sql
CREATE INDEX idx_app_jsonb_kv_feature_enabled
    ON app_jsonb_kv_store (((value ->> 'enabled')::boolean))
    WHERE namespace = 'feature.case-review'
      AND status = 'ACTIVE';
```

Generated/expression approach biasanya lebih predictable daripada GIN global kalau query hanya terhadap satu field spesifik.

---

### 8.5 GIN Index untuk Containment

Default:

```sql
CREATE INDEX idx_app_jsonb_kv_value_gin
    ON app_jsonb_kv_store
    USING gin (value);
```

Alternative dengan `jsonb_path_ops`:

```sql
CREATE INDEX idx_app_jsonb_kv_value_path_gin
    ON app_jsonb_kv_store
    USING gin (value jsonb_path_ops);
```

PostgreSQL menyediakan dua operator class GIN untuk `jsonb`: `jsonb_ops` sebagai default, dan `jsonb_path_ops` yang mendukung operator lebih sedikit tetapi bisa lebih baik performanya untuk operator yang didukung. ([PostgreSQL](https://www.postgresql.org/docs/current/gin.html?utm_source=chatgpt.com))

Practical decision:

| Query pattern | Index yang disarankan |
|---|---|
| `tenant_id + namespace + key` | Primary key |
| List namespace aktif | Composite B-tree partial index |
| Field JSON spesifik | Expression index |
| Banyak containment query `@>` | GIN |
| Banyak existence query key `?` | GIN default `jsonb_ops` |
| Containment-heavy dan path terbatas | Pertimbangkan `jsonb_path_ops` |
| Query jarang/admin-only | Jangan index dulu |
| Semua field arbitrary | Redesign query governance |

---

## 9. Generated Column Pattern

Jika satu field JSON sering dipakai filter/sort/join, pertimbangkan generated column.

Contoh feature flag `enabled`:

```sql
ALTER TABLE app_jsonb_kv_store
ADD COLUMN enabled boolean
GENERATED ALWAYS AS ((value ->> 'enabled')::boolean) STORED;
```

Lalu index:

```sql
CREATE INDEX idx_app_jsonb_kv_enabled
    ON app_jsonb_kv_store (tenant_id, namespace, enabled)
    WHERE status = 'ACTIVE';
```

Generated column adalah kolom yang selalu dihitung dari kolom lain; PostgreSQL mendukung generated column stored dan virtual, dengan stored column dihitung saat write dan menempati storage seperti kolom biasa. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-generated-columns.html?utm_source=chatgpt.com))

Kapan pakai generated column?

| Cocok | Tidak cocok |
|---|---|
| Field sangat sering dipakai filter/sort | Field jarang dipakai |
| Field perlu index predictable | Field sangat dinamis |
| Field perlu tampil di reporting | Struktur JSON sering berubah |
| Field punya tipe stabil | Tipe/value bisa berubah antar schema version |

---

## 10. Validation Pattern

### 10.1 Database-Level Minimal Validation

```sql
ALTER TABLE app_jsonb_kv_store
ADD CONSTRAINT ck_feature_flag_required_fields
CHECK (
    value_type <> 'FEATURE_FLAG'
    OR (
        value ? 'enabled'
        AND jsonb_typeof(value -> 'enabled') = 'boolean'
    )
);
```

### 10.2 Validasi Nested Field

```sql
ALTER TABLE app_jsonb_kv_store
ADD CONSTRAINT ck_integration_config_timeout
CHECK (
    value_type <> 'INTEGRATION_CONFIG'
    OR (
        value ? 'timeoutMillis'
        AND jsonb_typeof(value -> 'timeoutMillis') = 'number'
        AND (value ->> 'timeoutMillis')::integer BETWEEN 100 AND 30000
    )
);
```

### 10.3 Application-Level Validation

Database constraint bagus untuk invariant minimal. Tetapi validasi business schema kompleks lebih baik di application layer:

```java
public record FeatureFlagConfig(
    boolean enabled,
    int rolloutPercentage,
    List<String> allowedTenants,
    List<String> allowedRoles,
    String defaultTreatment
) {
    public FeatureFlagConfig {
        if (rolloutPercentage < 0 || rolloutPercentage > 100) {
            throw new IllegalArgumentException("rolloutPercentage must be 0..100");
        }
        if (!Set.of("CONTROL", "TREATMENT").contains(defaultTreatment)) {
            throw new IllegalArgumentException("Invalid defaultTreatment");
        }
    }
}
```

Practical rule:

```text
Database constraint:
  protect minimal shape and impossible states.

Application validation:
  protect domain-specific rules and richer schema.
```

---

## 11. Mutation Pattern

### 11.1 Replace Whole Value

```sql
UPDATE app_jsonb_kv_store
SET
    value = CAST(:newValueJson AS jsonb),
    schema_version = :schemaVersion,
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND namespace = :namespace
  AND key = :key
  AND version = :expectedVersion
  AND status = 'ACTIVE';
```

Ini paling aman untuk audit dan validation, karena seluruh object divalidasi sebagai satu DTO.

---

### 11.2 Patch One Field dengan `jsonb_set`

```sql
UPDATE app_jsonb_kv_store
SET
    value = jsonb_set(
        value,
        '{enabled}',
        to_jsonb(:enabled::boolean),
        true
    ),
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND namespace = :namespace
  AND key = :key
  AND version = :expectedVersion
  AND status = 'ACTIVE';
```

Gunakan hati-hati. Patch field bisa melewati validasi object penuh jika application layer tidak disiplin.

---

### 11.3 Patch Nested Field

```sql
UPDATE app_jsonb_kv_store
SET
    value = jsonb_set(
        value,
        '{retry,maxAttempts}',
        to_jsonb(:maxAttempts::integer),
        true
    ),
    version = version + 1,
    updated_at = now()
WHERE tenant_id = :tenantId
  AND namespace = 'integration.payment-gateway'
  AND key = 'default'
  AND version = :expectedVersion;
```

---

### 11.4 Merge Top-Level Object

```sql
UPDATE app_jsonb_kv_store
SET
    value = value || CAST(:patchJson AS jsonb),
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND namespace = :namespace
  AND key = :key
  AND version = :expectedVersion;
```

Catatan: operator merge `||` untuk JSONB tidak selalu berarti deep merge recursive. Untuk nested object, desain patch semantic harus eksplisit.

---

## 12. Upsert Pattern

`INSERT ... ON CONFLICT` di PostgreSQL dapat dipakai untuk menentukan aksi alternatif saat terjadi pelanggaran unique/exclusion constraint, seperti `DO NOTHING` atau `DO UPDATE`; ini menjadi fondasi pola upsert. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-insert.html?utm_source=chatgpt.com))

```sql
INSERT INTO app_jsonb_kv_store (
    tenant_id,
    namespace,
    key,
    value,
    value_type,
    schema_version,
    status,
    version,
    effective_from,
    effective_until,
    expires_at,
    created_by,
    updated_by
)
VALUES (
    :tenantId,
    :namespace,
    :key,
    CAST(:valueJson AS jsonb),
    :valueType,
    :schemaVersion,
    'ACTIVE',
    0,
    :effectiveFrom,
    :effectiveUntil,
    :expiresAt,
    :actor,
    :actor
)
ON CONFLICT (tenant_id, namespace, key)
DO UPDATE SET
    value = EXCLUDED.value,
    value_type = EXCLUDED.value_type,
    schema_version = EXCLUDED.schema_version,
    status = 'ACTIVE',
    effective_from = EXCLUDED.effective_from,
    effective_until = EXCLUDED.effective_until,
    expires_at = EXCLUDED.expires_at,
    version = app_jsonb_kv_store.version + 1,
    updated_at = now(),
    updated_by = EXCLUDED.updated_by;
```

### Upsert Cocok Untuk

| Cocok | Contoh |
|---|---|
| Admin replace config | Tenant setting |
| Seed default config | Bootstrap environment |
| Reference snapshot | External provider capabilities |
| Non-critical overwrite | UI preference |

### Upsert Tidak Cocok Untuk

| Tidak cocok | Kenapa |
|---|---|
| Config dengan approval workflow | Harus explicit state transition |
| Concurrent editor | Bisa lost update |
| Regulatory parameter penting | Butuh audit/approval |
| Feature flag critical | Perlu compare-and-set dan audit |

---

## 13. Compare-and-Set Pattern

```sql
UPDATE app_jsonb_kv_store
SET
    value = CAST(:newValueJson AS jsonb),
    schema_version = :schemaVersion,
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND namespace = :namespace
  AND key = :key
  AND version = :expectedVersion
  AND status = 'ACTIVE';
```

Interpretasi:

| Row count | Arti |
|---:|---|
| `1` | Update sukses |
| `0` | Tidak ditemukan, deleted, disabled, atau version conflict |

Di service Java:

```java
int updated = mapper.compareAndSet(...);

if (updated == 0) {
    throw new ConcurrentModificationException(
        "Config was modified by another transaction or is no longer active"
    );
}
```

---

## 14. Audit Pattern

Untuk config/feature flag/policy, audit bukan optional.

```sql
CREATE TABLE app_jsonb_kv_store_audit (
    audit_id bigserial PRIMARY KEY,

    tenant_id uuid NOT NULL,
    namespace text NOT NULL,
    key text NOT NULL,

    old_value jsonb NULL,
    new_value jsonb NULL,

    old_schema_version integer NULL,
    new_schema_version integer NULL,

    old_version bigint NULL,
    new_version bigint NULL,

    action text NOT NULL,
    actor text NULL,
    reason text NULL,

    changed_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_app_jsonb_kv_audit_action
        CHECK (action IN (
            'CREATE',
            'UPDATE',
            'PATCH',
            'DISABLE',
            'DELETE',
            'RESTORE'
        ))
);
```

### Update + Audit dalam Satu Transaksi SQL

```sql
WITH old_row AS (
    SELECT *
    FROM app_jsonb_kv_store
    WHERE tenant_id = :tenantId
      AND namespace = :namespace
      AND key = :key
      AND version = :expectedVersion
      AND status = 'ACTIVE'
),
updated_row AS (
    UPDATE app_jsonb_kv_store kv
    SET
        value = CAST(:newValueJson AS jsonb),
        schema_version = :schemaVersion,
        version = kv.version + 1,
        updated_at = now(),
        updated_by = :actor
    FROM old_row old
    WHERE kv.tenant_id = old.tenant_id
      AND kv.namespace = old.namespace
      AND kv.key = old.key
    RETURNING kv.*
)
INSERT INTO app_jsonb_kv_store_audit (
    tenant_id,
    namespace,
    key,
    old_value,
    new_value,
    old_schema_version,
    new_schema_version,
    old_version,
    new_version,
    action,
    actor,
    reason
)
SELECT
    old_row.tenant_id,
    old_row.namespace,
    old_row.key,
    old_row.value,
    updated_row.value,
    old_row.schema_version,
    updated_row.schema_version,
    old_row.version,
    updated_row.version,
    'UPDATE',
    :actor,
    :reason
FROM old_row
JOIN updated_row
  ON updated_row.tenant_id = old_row.tenant_id
 AND updated_row.namespace = old_row.namespace
 AND updated_row.key = old_row.key;
```

---

## 15. Feature Flag Practical Design

### 15.1 Table Usage

```text
tenant_id:       tenant A
namespace:       feature.case-review
key:             enhanced-review-flow
value_type:      FEATURE_FLAG
schema_version:  1
value:
{
  "enabled": true,
  "rolloutPercentage": 50,
  "allowedRoles": ["SUPERVISOR"],
  "defaultTreatment": "TREATMENT"
}
```

### 15.2 Read Effective Flag

```sql
SELECT
    value,
    version
FROM app_jsonb_kv_store
WHERE tenant_id = :tenantId
  AND namespace = 'feature.case-review'
  AND key = :flagKey
  AND value_type = 'FEATURE_FLAG'
  AND status = 'ACTIVE'
  AND (effective_from IS NULL OR effective_from <= now())
  AND (effective_until IS NULL OR effective_until > now())
  AND (expires_at IS NULL OR expires_at > now());
```

### 15.3 Service Evaluation

```java
public boolean isEnabled(
    UUID tenantId,
    String flagKey,
    String userId,
    Set<String> roles
) {
    FeatureFlagConfig flag = configRepository
        .findFeatureFlag(tenantId, flagKey)
        .orElse(FeatureFlagConfig.disabled());

    if (!flag.enabled()) {
        return false;
    }

    if (!Collections.disjoint(flag.allowedRoles(), roles)) {
        return true;
    }

    return percentageBucket(userId, flagKey) < flag.rolloutPercentage();
}
```

Production note: untuk high-throughput flag evaluation, jangan query DB setiap request. Gunakan cache lokal/Redis + invalidation/eventing. PostgreSQL menjadi source of truth, bukan hot-path evaluator.

---

## 16. Tenant Setting Practical Design

### 16.1 Value

```json
{
  "caseAutoCloseDays": 30,
  "maxOpenCases": 5000,
  "defaultPriority": "MEDIUM",
  "allowedChannels": ["WEB", "API", "BRANCH"]
}
```

### 16.2 Validation DTO

```java
public record TenantCaseSetting(
    int caseAutoCloseDays,
    int maxOpenCases,
    String defaultPriority,
    List<String> allowedChannels
) {
    public TenantCaseSetting {
        if (caseAutoCloseDays < 1 || caseAutoCloseDays > 365) {
            throw new IllegalArgumentException("caseAutoCloseDays must be 1..365");
        }
        if (maxOpenCases < 1) {
            throw new IllegalArgumentException("maxOpenCases must be positive");
        }
        if (!Set.of("LOW", "MEDIUM", "HIGH").contains(defaultPriority)) {
            throw new IllegalArgumentException("Invalid defaultPriority");
        }
    }
}
```

### 16.3 Store

```sql
INSERT INTO app_jsonb_kv_store (
    tenant_id,
    namespace,
    key,
    value,
    value_type,
    schema_version,
    status
)
VALUES (
    :tenantId,
    'case.setting',
    'default',
    CAST(:valueJson AS jsonb),
    'TENANT_CONFIG',
    1,
    'ACTIVE'
)
ON CONFLICT (tenant_id, namespace, key)
DO UPDATE SET
    value = EXCLUDED.value,
    schema_version = EXCLUDED.schema_version,
    version = app_jsonb_kv_store.version + 1,
    updated_at = now();
```

---

## 17. Integration Config Practical Design

### 17.1 Value

```json
{
  "endpointRef": "secret://provider-x/base-url",
  "connectTimeoutMillis": 1000,
  "readTimeoutMillis": 3000,
  "retry": {
    "maxAttempts": 3,
    "backoffMillis": 500
  },
  "circuitBreaker": {
    "enabled": true,
    "failureThreshold": 10,
    "openDurationSeconds": 60
  }
}
```

### 17.2 Guardrail

| Jangan | Sebaiknya |
|---|---|
| Simpan password/token raw di JSONB | Simpan secret reference |
| Update config tanpa audit | Wajib audit |
| Reload config tanpa version | Gunakan version/checksum |
| Hard-code endpoint di service | Ambil dari config source |
| Query DB setiap outbound call | Cache config dengan TTL/invalidation |

---

## 18. MyBatis Preview

Detail penuh integrasi ada di **Seri 6**, tapi pattern dasarnya seperti ini.

### 18.1 Mapper Interface

```java
public interface JsonbKvStoreMapper {

    Optional<JsonbKvEntry> findActiveByKey(
        @Param("tenantId") UUID tenantId,
        @Param("namespace") String namespace,
        @Param("key") String key
    );

    List<JsonbKvEntry> findActiveByNamespace(
        @Param("tenantId") UUID tenantId,
        @Param("namespace") String namespace
    );

    int upsert(JsonbKvEntry entry);

    int compareAndSet(
        @Param("tenantId") UUID tenantId,
        @Param("namespace") String namespace,
        @Param("key") String key,
        @Param("expectedVersion") long expectedVersion,
        @Param("newValueJson") String newValueJson,
        @Param("schemaVersion") int schemaVersion,
        @Param("actor") String actor
    );
}
```

### 18.2 Result Map

```xml
<resultMap id="JsonbKvEntryResultMap" type="com.example.config.JsonbKvEntry">
    <id property="tenantId" column="tenant_id"/>
    <id property="namespace" column="namespace"/>
    <id property="key" column="key"/>

    <result property="valueJson" column="value_json"/>
    <result property="valueType" column="value_type"/>
    <result property="schemaVersion" column="schema_version"/>
    <result property="status" column="status"/>
    <result property="version" column="version"/>
    <result property="effectiveFrom" column="effective_from"/>
    <result property="effectiveUntil" column="effective_until"/>
    <result property="expiresAt" column="expires_at"/>
    <result property="updatedAt" column="updated_at"/>
</resultMap>
```

### 18.3 Select

```xml
<select id="findActiveByKey" resultMap="JsonbKvEntryResultMap">
    SELECT
        tenant_id,
        namespace,
        key,
        value::text AS value_json,
        value_type,
        schema_version,
        status,
        version,
        effective_from,
        effective_until,
        expires_at,
        updated_at
    FROM app_jsonb_kv_store
    WHERE tenant_id = #{tenantId}
      AND namespace = #{namespace}
      AND key = #{key}
      AND status = 'ACTIVE'
      AND (expires_at IS NULL OR expires_at > now())
      AND (effective_from IS NULL OR effective_from <= now())
      AND (effective_until IS NULL OR effective_until > now())
</select>
```

### 18.4 Upsert

```xml
<insert id="upsert">
    INSERT INTO app_jsonb_kv_store (
        tenant_id,
        namespace,
        key,
        value,
        value_type,
        schema_version,
        status,
        effective_from,
        effective_until,
        expires_at,
        created_by,
        updated_by
    )
    VALUES (
        #{tenantId},
        #{namespace},
        #{key},
        CAST(#{valueJson} AS jsonb),
        #{valueType},
        #{schemaVersion},
        'ACTIVE',
        #{effectiveFrom},
        #{effectiveUntil},
        #{expiresAt},
        #{createdBy},
        #{updatedBy}
    )
    ON CONFLICT (tenant_id, namespace, key)
    DO UPDATE SET
        value = EXCLUDED.value,
        value_type = EXCLUDED.value_type,
        schema_version = EXCLUDED.schema_version,
        status = 'ACTIVE',
        effective_from = EXCLUDED.effective_from,
        effective_until = EXCLUDED.effective_until,
        expires_at = EXCLUDED.expires_at,
        version = app_jsonb_kv_store.version + 1,
        updated_at = now(),
        updated_by = EXCLUDED.updated_by
</insert>
```

---

## 19. Jersey API Design

Hindari endpoint generic terlalu bebas:

```http
PUT /kv/{namespace}/{key}
```

Lebih aman:

```http
PUT /tenants/{tenantId}/features/{featureKey}
PUT /tenants/{tenantId}/case-settings/default
PUT /tenants/{tenantId}/workflow-policies/escalation
PUT /tenants/{tenantId}/integration-configs/payment-gateway
```

Storage-nya boleh generic `jsonb` KV table, tetapi API contract sebaiknya domain-specific.

### Contoh Resource

```java
@Path("/tenants/{tenantId}/features/{featureKey}")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class FeatureFlagResource {

    private final FeatureFlagService service;

    @GET
    public Response get(
        @PathParam("tenantId") UUID tenantId,
        @PathParam("featureKey") String featureKey
    ) {
        return service.find(tenantId, featureKey)
            .map(Response::ok)
            .orElseGet(() -> Response.status(Response.Status.NOT_FOUND))
            .build();
    }

    @PUT
    public Response update(
        @PathParam("tenantId") UUID tenantId,
        @PathParam("featureKey") String featureKey,
        UpdateFeatureFlagRequest request
    ) {
        service.update(
            tenantId,
            featureKey,
            request.expectedVersion(),
            request.config(),
            request.reason()
        );

        return Response.noContent().build();
    }
}
```

---

## 20. Operational Pattern

### 20.1 Cache Strategy

Untuk config/feature flag, pattern umum:

```text
PostgreSQL jsonb KV
  = source of truth

Application local cache / Redis
  = fast runtime read

Audit table
  = traceability

Event/outbox
  = invalidation propagation
```

Jangan query PostgreSQL setiap request untuk feature flag yang dipakai di hot path.

---

### 20.2 Invalidation Pattern

```text
Admin updates config
    ↓
PostgreSQL transaction
    ├── update app_jsonb_kv_store
    ├── insert audit row
    └── insert outbox event
            ↓
Outbox publisher
            ↓
Kafka/RabbitMQ/Redis pubsub
            ↓
Service refreshes local cache
```

Ini lebih aman daripada berharap semua service polling DB terus-menerus.

---

### 20.3 Versioned Read Pattern

```java
public record ConfigEnvelope<T>(
    T value,
    long version,
    int schemaVersion,
    Instant loadedAt
) {}
```

Service bisa membandingkan version untuk cache refresh.

---

## 21. Failure Modes

| Failure mode | Penyebab | Mitigasi |
|---|---|---|
| Config corrupt | JSON tidak sesuai DTO | DTO validation + schema_version |
| Feature salah aktif | Default/fallback buruk | Safe default harus explicit |
| Lost update | Upsert overwrite concurrent change | Compare-and-set |
| Audit hilang | Direct update tanpa history | Update + audit dalam transaksi |
| Slow query | Filter JSON field tanpa index | Expression/generated column index |
| GIN bloat | Semua JSONB di-GIN | Index hanya query nyata |
| Secret leak | Credential disimpan di JSONB | Secret reference only |
| Arbitrary query abuse | API expose JSON filter bebas | Whitelist field/operator |
| Cache stale | Tidak ada invalidation | Version + event/outbox |
| Schema evolution gagal | Value lama tidak migrasi | `schema_version` + compatibility reader |

---

## 22. Production Checklist

| Checklist | Status |
|---|---|
| `tenant_id`, `namespace`, `key` sebagai identity | Wajib |
| `value_type` jelas | Wajib |
| `schema_version` ada | Wajib |
| `version` untuk optimistic locking | Wajib |
| `status` lifecycle | Wajib |
| `effective_from/effective_until` jika config terjadwal | Disarankan |
| `expires_at` jika TTL-like | Opsional sesuai use case |
| DB CHECK untuk minimal JSON shape | Disarankan |
| DTO validation di Java | Wajib |
| Audit untuk config kritikal | Wajib |
| Expression/generated index untuk hot field | Disarankan |
| GIN hanya jika containment/existence query nyata | Disarankan |
| API domain-specific, bukan arbitrary KV bebas | Wajib |
| Cache/invalidation untuk hot-path read | Wajib untuk high traffic |
| Secret tidak disimpan raw | Wajib |
| `EXPLAIN ANALYZE` untuk query utama | Wajib |

---

## 23. Anti-Pattern

### 23.1 Semua Config Satu JSON Besar

Buruk:

```text
namespace = tenant.config
key       = all
value     = { semua setting tenant }
```

Masalah:

- update satu setting mengunci/mengubah satu object besar,
- audit sulit granular,
- conflict lebih sering,
- cache invalidation kasar,
- schema evolution lebih sulit.

Lebih baik pecah berdasarkan domain:

```text
case.setting/default
workflow.escalation/default
feature.case-review/enhanced-review-flow
integration.payment-gateway/default
```

---

### 23.2 Semua Field Di-query dari JSONB

Buruk:

```sql
WHERE value ->> 'status' = 'ACTIVE'
  AND value ->> 'tenantId' = :tenantId
```

Lebih baik:

```sql
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
```

Business-critical filter harus menjadi kolom relational.

---

### 23.3 Generic Internal API Tanpa Guardrail

Buruk:

```http
PUT /internal/kv/{namespace}/{key}
{
  "anything": "anything"
}
```

Lebih baik:

```http
PUT /tenants/{tenantId}/workflow-policies/escalation
{
  "expectedVersion": 12,
  "reason": "Update escalation policy for regional review",
  "policy": {
    "slaDays": 5,
    "calendar": "BUSINESS_DAY"
  }
}
```

---

## 24. Ringkasan Praktis

```text
jsonb KV Production Pattern
│
├── Store
│   ├── tenant_id
│   ├── namespace
│   ├── key
│   ├── value jsonb
│   ├── value_type
│   ├── schema_version
│   └── version
│
├── Use for
│   ├── tenant config
│   ├── feature flag
│   ├── workflow policy
│   ├── integration config
│   └── UI/runtime behavior
│
├── Validate with
│   ├── CHECK constraint
│   ├── Java DTO
│   ├── schema_version
│   └── namespace/key whitelist
│
├── Optimize with
│   ├── primary key
│   ├── partial index
│   ├── expression index
│   ├── generated column
│   └── GIN only when needed
│
└── Operate with
    ├── optimistic locking
    ├── audit table
    ├── cache
    ├── invalidation event/outbox
    └── EXPLAIN ANALYZE
```

---

# Status

**Seri 4/19 selesai.**

Berikutnya: **Seri 5/19 - Idempotency Key Store, distributed lock-lite, optimistic concurrency, transaction boundary, retry safety, dan failure handling production-style.**

---

**Sources:**

- [Documentation: 18: 8.14. JSON Types](https://www.postgresql.org/docs/current/datatype-json.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:32:48 PM

Saya lanjut ke **Seri 5/19**, fokus pada idempotency key store, optimistic concurrency, distributed lock-lite, retry safety, dan boundary transaksi. Ini penting untuk API command seperti create case, submit review, payment-like operation, callback handling, dan workflow trigger.

# Seri 5/19 - Idempotency Key Store, Distributed Lock-Lite, Optimistic Concurrency

## 1. Tujuan Seri Ini

Seri ini membahas pola **retry-safe command processing** di PostgreSQL, terutama untuk service Java/Jersey/MyBatis yang menangani operasi seperti:

| Use case | Contoh |
|---|---|
| Submit command dari API | `POST /cases`, `POST /reviews`, `POST /payments`, `POST /workflow-transitions` |
| Retry dari client/gateway | Client timeout lalu kirim ulang request yang sama |
| Callback eksternal | Provider mengirim callback/event yang bisa duplicate |
| Workflow trigger | Camunda/job worker mengirim command ulang |
| Message consumer | Kafka/RabbitMQ redelivery |
| Scheduled job | Job batch restart dan memproses item yang sama |
| Integration command | Outbound call yang hasilnya harus tidak double-write |

Core problem-nya:

```text
Request bisa dikirim ulang.
Network bisa timeout.
Service bisa crash setelah DB commit tapi sebelum response terkirim.
Message broker bisa redeliver.
Callback provider bisa duplicate.
User bisa double-click.
```

Maka kita butuh pola:

1. **idempotency key store**,
2. **request fingerprint**,
3. **response/result caching**,
4. **optimistic concurrency**,
5. **transaction boundary yang jelas**,
6. **lock-lite jika perlu serialisasi per business key**,
7. **retry-safe failure handling**.

PostgreSQL mendukung fondasi penting untuk pola ini: unique constraint, `INSERT ... ON CONFLICT`, row-level locking, transaction isolation, advisory locks, dan `FOR UPDATE SKIP LOCKED` untuk pola queue-like worker. `ON CONFLICT` dapat dipakai sebagai alternatif saat insert melanggar unique/exclusion constraint, dan advisory lock punya makna yang didefinisikan aplikasi, bukan dipaksakan otomatis oleh database. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-insert.html?utm_source=chatgpt.com))

---

## 2. Mental Model

```text
Idempotency & Retry Safety Model
│
├── Request Identity
│   ├── idempotency_key
│   ├── tenant_id
│   ├── operation
│   └── business_key
│
├── Request Integrity
│   ├── request_hash
│   ├── request_body_digest
│   ├── method/path binding
│   └── actor/client binding
│
├── Processing State
│   ├── RECEIVED
│   ├── PROCESSING
│   ├── SUCCEEDED
│   ├── FAILED_RETRYABLE
│   ├── FAILED_FINAL
│   └── EXPIRED
│
├── Result Materialization
│   ├── response_status
│   ├── response_body
│   ├── resource_id
│   ├── error_code
│   └── completed_at
│
├── Concurrency Control
│   ├── unique constraint
│   ├── row lock
│   ├── optimistic version
│   ├── advisory lock
│   └── compare-and-set
│
└── Operational Lifecycle
    ├── TTL / expires_at
    ├── cleanup
    ├── audit
    ├── retry policy
    └── observability
```

---

## 3. Idempotency Bukan Sekadar “Jangan Double Insert”

Idempotency berarti:

> Request yang sama, jika diproses lebih dari sekali, menghasilkan efek akhir yang sama atau mengembalikan hasil yang sama tanpa membuat side effect ganda.

Contoh:

```http
POST /cases
Idempotency-Key: 9c6d0a6e-...
```

Request pertama:

```text
create case C-001
return 201 Created
```

Request kedua dengan idempotency key sama:

```text
tidak membuat case baru
return hasil yang sama atau referensi case yang sama
```

Tapi ada jebakan penting:

| Skenario | Yang harus terjadi |
|---|---|
| Key sama, payload sama | Return hasil sebelumnya atau tunggu proses sebelumnya selesai |
| Key sama, payload beda | Reject sebagai idempotency conflict |
| Key beda, business command sama | Tergantung business uniqueness |
| Request pertama crash setelah commit | Retry harus menemukan hasil commit |
| Request pertama sedang processing | Retry jangan memproses ulang bersamaan |
| Request gagal transient | Retry boleh lanjut sesuai policy |
| Request gagal final validation | Retry dengan key sama boleh return failure final |

---

## 4. Recommended Table Design

```sql
CREATE TABLE api_idempotency_key (
    tenant_id uuid NOT NULL,
    operation text NOT NULL,
    idempotency_key text NOT NULL,

    request_hash text NOT NULL,
    request_method text NOT NULL,
    request_path text NOT NULL,

    business_key text NULL,
    actor_id text NULL,
    client_id text NULL,

    status text NOT NULL,
    processing_started_at timestamptz NULL,
    completed_at timestamptz NULL,

    response_status integer NULL,
    response_body jsonb NULL,

    resource_type text NULL,
    resource_id uuid NULL,

    error_code text NULL,
    error_message text NULL,

    retry_count integer NOT NULL DEFAULT 0,
    version bigint NOT NULL DEFAULT 0,

    expires_at timestamptz NOT NULL,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    PRIMARY KEY (tenant_id, operation, idempotency_key),

    CONSTRAINT ck_api_idempotency_status
        CHECK (status IN (
            'RECEIVED',
            'PROCESSING',
            'SUCCEEDED',
            'FAILED_RETRYABLE',
            'FAILED_FINAL',
            'EXPIRED'
        )),

    CONSTRAINT ck_api_idempotency_response_when_succeeded
        CHECK (
            status <> 'SUCCEEDED'
            OR response_status IS NOT NULL
        ),

    CONSTRAINT ck_api_idempotency_expiry_future
        CHECK (expires_at > created_at)
);
```

### Kenapa primary key-nya `(tenant_id, operation, idempotency_key)`?

Karena key yang sama bisa saja muncul dari tenant atau operasi berbeda.

```text
tenant A / create-case / key-123
tenant A / submit-review / key-123
tenant B / create-case / key-123
```

Semua itu harus terpisah.

---

## 5. Index Design

### 5.1 Primary Key untuk Lookup

```sql
PRIMARY KEY (tenant_id, operation, idempotency_key)
```

Dipakai untuk semua retry lookup.

---

### 5.2 Cleanup Expired

```sql
CREATE INDEX idx_api_idempotency_expires_at
    ON api_idempotency_key (expires_at)
    WHERE status IN ('SUCCEEDED', 'FAILED_FINAL', 'EXPIRED');
```

### 5.3 Processing Timeout Recovery

```sql
CREATE INDEX idx_api_idempotency_processing_timeout
    ON api_idempotency_key (processing_started_at)
    WHERE status = 'PROCESSING';
```

### 5.4 Business Key Lookup

```sql
CREATE INDEX idx_api_idempotency_business_key
    ON api_idempotency_key (tenant_id, operation, business_key)
    WHERE business_key IS NOT NULL;
```

Ini berguna untuk investigasi atau recovery, bukan sebagai pengganti idempotency key.

---

## 6. Request Hash / Fingerprint

Idempotency key saja tidak cukup. Client bisa saja mengirim key sama untuk payload berbeda.

Maka simpan hash request canonical.

```text
request_hash = SHA-256(
  method + "\n" +
  normalized_path + "\n" +
  canonical_json_body + "\n" +
  tenant_id + "\n" +
  operation
)
```

### Contoh Conflict

Request pertama:

```json
{
  "customerId": "C001",
  "amount": 100000
}
```

Request kedua dengan idempotency key sama:

```json
{
  "customerId": "C001",
  "amount": 999999
}
```

Harus return:

```http
409 Conflict
```

Bukan memproses ulang.

---

## 7. Basic Acquire Pattern

### 7.1 Insert Idempotency Row

```sql
INSERT INTO api_idempotency_key (
    tenant_id,
    operation,
    idempotency_key,
    request_hash,
    request_method,
    request_path,
    business_key,
    actor_id,
    client_id,
    status,
    processing_started_at,
    expires_at
)
VALUES (
    :tenantId,
    :operation,
    :idempotencyKey,
    :requestHash,
    :requestMethod,
    :requestPath,
    :businessKey,
    :actorId,
    :clientId,
    'PROCESSING',
    now(),
    :expiresAt
)
ON CONFLICT (tenant_id, operation, idempotency_key)
DO NOTHING;
```

`ON CONFLICT DO NOTHING` membuat insert tidak error jika key sudah ada; ini cocok untuk race condition antar retry request yang memakai idempotency key sama. PostgreSQL mendokumentasikan `ON CONFLICT` sebagai aksi alternatif terhadap unique/exclusion violation. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-insert.html?utm_source=chatgpt.com))

---

### 7.2 Read Existing Row

```sql
SELECT
    tenant_id,
    operation,
    idempotency_key,
    request_hash,
    status,
    response_status,
    response_body,
    resource_type,
    resource_id,
    error_code,
    error_message,
    version
FROM api_idempotency_key
WHERE tenant_id = :tenantId
  AND operation = :operation
  AND idempotency_key = :idempotencyKey;
```

Interpretasi:

| Kondisi | Response |
|---|---|
| Row baru berhasil diinsert | Caller boleh proses command |
| Row sudah ada + hash sama + `SUCCEEDED` | Return cached response |
| Row sudah ada + hash sama + `FAILED_FINAL` | Return final error yang sama |
| Row sudah ada + hash sama + `PROCESSING` | Return `409/425/202` atau wait/poll sesuai API design |
| Row sudah ada + hash beda | Return `409 Idempotency Key Reused With Different Payload` |
| Row expired | Biasanya reject atau buat policy khusus |

---

## 8. Transaction Boundary Pattern

Ada dua pola utama.

---

### 8.1 Pattern A - Idempotency Row dan Business Write Satu Transaksi

```text
BEGIN
  acquire idempotency key
  validate request
  insert/update business data
  update idempotency row to SUCCEEDED with response
COMMIT
```

Kelebihan:

| Kelebihan | Penjelasan |
|---|---|
| Atomic | Business write dan idempotency result commit bersama |
| Retry aman | Jika commit sukses, retry melihat `SUCCEEDED` |
| Failure jelas | Jika rollback, tidak ada partial state |
| Cocok untuk | Pure DB operation tanpa external side effect |

Kekurangan:

| Kekurangan | Penjelasan |
|---|---|
| Transaksi bisa panjang | Kalau business logic berat |
| Tidak cocok untuk external call di dalam transaksi | Jangan tahan DB transaction saat call HTTP eksternal |

Pattern ini cocok untuk:

```text
create internal case
submit internal review
transition local workflow state
create local assignment
```

---

### 8.2 Pattern B - Idempotency + Outbox untuk External Side Effect

```text
BEGIN
  acquire idempotency key
  insert local command/resource
  insert outbox event
  mark idempotency SUCCEEDED/ACCEPTED
COMMIT

Async worker:
  publish/call external side effect
```

Kelebihan:

| Kelebihan | Penjelasan |
|---|---|
| Tidak tahan transaksi saat external call | Lebih aman |
| Retry-safe | Outbox bisa diproses ulang |
| Cocok untuk distributed system | Side effect dipisahkan |
| Audit lebih jelas | Command dan event tersimpan |

Cocok untuk:

```text
payment initiation
send notification
call external registry
publish domain event
start workflow externally
```

---

## 9. Complete DB-Atomic Command Pattern

Contoh: `POST /cases` dengan idempotency.

### 9.1 Business Table

```sql
CREATE TABLE case_header (
    case_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,
    case_number text NOT NULL,
    customer_id text NOT NULL,
    status text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_case_header_case_number
        UNIQUE (tenant_id, case_number),

    CONSTRAINT ck_case_header_status
        CHECK (status IN ('DRAFT', 'SUBMITTED', 'CLOSED'))
);
```

### 9.2 Single Transaction SQL

```sql
WITH inserted_idempotency AS (
    INSERT INTO api_idempotency_key (
        tenant_id,
        operation,
        idempotency_key,
        request_hash,
        request_method,
        request_path,
        business_key,
        actor_id,
        status,
        processing_started_at,
        expires_at
    )
    VALUES (
        :tenantId,
        'CREATE_CASE',
        :idempotencyKey,
        :requestHash,
        'POST',
        '/cases',
        :caseNumber,
        :actorId,
        'PROCESSING',
        now(),
        now() + interval '24 hours'
    )
    ON CONFLICT (tenant_id, operation, idempotency_key)
    DO NOTHING
    RETURNING *
),
created_case AS (
    INSERT INTO case_header (
        case_id,
        tenant_id,
        case_number,
        customer_id,
        status
    )
    SELECT
        :caseId,
        :tenantId,
        :caseNumber,
        :customerId,
        'SUBMITTED'
    FROM inserted_idempotency
    RETURNING *
),
completed_idempotency AS (
    UPDATE api_idempotency_key idem
    SET
        status = 'SUCCEEDED',
        completed_at = now(),
        response_status = 201,
        response_body = jsonb_build_object(
            'caseId', created_case.case_id,
            'caseNumber', created_case.case_number,
            'status', created_case.status
        ),
        resource_type = 'CASE',
        resource_id = created_case.case_id,
        version = idem.version + 1,
        updated_at = now()
    FROM created_case
    WHERE idem.tenant_id = :tenantId
      AND idem.operation = 'CREATE_CASE'
      AND idem.idempotency_key = :idempotencyKey
    RETURNING idem.*
)
SELECT
    response_status,
    response_body
FROM completed_idempotency;
```

Jika hasil kosong, berarti idempotency key sudah ada. Maka service harus baca row existing dan interpretasikan status/hash.

---

## 10. Existing Key Handling

```sql
SELECT
    request_hash,
    status,
    response_status,
    response_body,
    error_code,
    error_message,
    resource_type,
    resource_id
FROM api_idempotency_key
WHERE tenant_id = :tenantId
  AND operation = :operation
  AND idempotency_key = :idempotencyKey;
```

### Decision Table

| Existing status | Request hash sama? | Action |
|---|---:|---|
| `SUCCEEDED` | Ya | Return stored `response_status` + `response_body` |
| `FAILED_FINAL` | Ya | Return stored final error |
| `FAILED_RETRYABLE` | Ya | Bisa retry claim tergantung policy |
| `PROCESSING` | Ya | Return `202 Accepted`, `409 Conflict`, atau wait bounded |
| `RECEIVED` | Ya | Claim untuk processing |
| Any | Tidak | Return `409 Conflict` |
| Expired | Ya | Return `409/410` atau treat as new hanya jika policy mengizinkan |

---

## 11. Mark Success

```sql
UPDATE api_idempotency_key
SET
    status = 'SUCCEEDED',
    completed_at = now(),
    response_status = :responseStatus,
    response_body = CAST(:responseBodyJson AS jsonb),
    resource_type = :resourceType,
    resource_id = :resourceId,
    version = version + 1,
    updated_at = now()
WHERE tenant_id = :tenantId
  AND operation = :operation
  AND idempotency_key = :idempotencyKey
  AND status = 'PROCESSING';
```

Kalau row count `0`, jangan abaikan. Bisa berarti:

| Penyebab | Makna |
|---|---|
| Status sudah berubah | Race/concurrent recovery |
| Key salah | Bug |
| Tenant/operation salah | Bug/security issue |
| Row expired/dihapus | Lifecycle bug |

---

## 12. Mark Final Failure

Untuk validasi final, misalnya payload invalid atau business rule menolak command:

```sql
UPDATE api_idempotency_key
SET
    status = 'FAILED_FINAL',
    completed_at = now(),
    response_status = :responseStatus,
    response_body = CAST(:errorBodyJson AS jsonb),
    error_code = :errorCode,
    error_message = :errorMessage,
    version = version + 1,
    updated_at = now()
WHERE tenant_id = :tenantId
  AND operation = :operation
  AND idempotency_key = :idempotencyKey
  AND status = 'PROCESSING';
```

Final failure boleh di-cache supaya retry request yang sama mendapat error konsisten.

---

## 13. Mark Retryable Failure

Untuk error transient:

```sql
UPDATE api_idempotency_key
SET
    status = 'FAILED_RETRYABLE',
    error_code = :errorCode,
    error_message = :errorMessage,
    retry_count = retry_count + 1,
    version = version + 1,
    updated_at = now()
WHERE tenant_id = :tenantId
  AND operation = :operation
  AND idempotency_key = :idempotencyKey
  AND status = 'PROCESSING';
```

Practical rule:

```text
FAILED_FINAL:
  request valid diproses dan hasilnya final gagal.
  retry dengan key sama return error yang sama.

FAILED_RETRYABLE:
  proses tidak selesai karena transient issue.
  retry boleh mencoba melanjutkan atau reclaim.
```

---

## 14. Processing Timeout Recovery

Service bisa crash saat status `PROCESSING`. Maka butuh timeout policy.

```sql
SELECT
    tenant_id,
    operation,
    idempotency_key,
    request_hash,
    version
FROM api_idempotency_key
WHERE status = 'PROCESSING'
  AND processing_started_at < now() - interval '5 minutes'
ORDER BY processing_started_at
LIMIT :limit
FOR UPDATE SKIP LOCKED;
```

`SKIP LOCKED` melewati row yang sedang terkunci; dokumentasi PostgreSQL menyatakan ini memberi view data yang tidak konsisten dan tidak cocok untuk general-purpose query, tetapi cocok untuk menghindari lock contention pada table yang diakses banyak consumer seperti queue. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-select.html))

Recovery update:

```sql
UPDATE api_idempotency_key
SET
    status = 'FAILED_RETRYABLE',
    error_code = 'PROCESSING_TIMEOUT',
    error_message = 'Processing did not complete within timeout window',
    version = version + 1,
    updated_at = now()
WHERE tenant_id = :tenantId
  AND operation = :operation
  AND idempotency_key = :idempotencyKey
  AND version = :expectedVersion
  AND status = 'PROCESSING';
```

---

## 15. Distributed Lock-Lite dengan Advisory Lock

Kadang idempotency key saja tidak cukup. Misalnya kita perlu memastikan hanya satu command aktif per business key:

```text
tenant + customer_id + operation
tenant + case_number + transition
tenant + workflow_instance_id + command_type
```

PostgreSQL menyediakan **advisory lock**, yaitu lock dengan makna yang ditentukan aplikasi. Sistem tidak memaksakan penggunaannya; aplikasi harus konsisten memakai lock tersebut. Advisory lock bisa session-level atau transaction-level; transaction-level otomatis dilepas saat transaksi berakhir dan biasanya lebih cocok untuk short-term locking. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html))

### 15.1 Transaction-Level Advisory Lock

```sql
SELECT pg_try_advisory_xact_lock(hashtext(:lockKey));
```

Contoh `lockKey`:

```text
tenant:123|operation:SUBMIT_CASE|caseNumber:C-001
```

Jika hasil `true`, lanjut proses.

Jika `false`, berarti ada transaksi lain memegang lock untuk key yang sama.

```sql
SELECT pg_try_advisory_xact_lock(
    hashtext(:tenantId || ':' || :operation || ':' || :businessKey)
);
```

### 15.2 Kapan Pakai Advisory Lock?

| Cocok | Contoh |
|---|---|
| Serialisasi command per business key | Satu transition aktif per case |
| Prevent concurrent recalculation | Recompute summary per account |
| Protect external operation orchestration | Submit provider request per application |
| Lock scope tidak mudah dimodelkan sebagai row | Belum ada row business |

### 15.3 Kapan Jangan Pakai Advisory Lock?

| Jangan | Alasan |
|---|---|
| Sebagai pengganti unique constraint | Unique constraint lebih kuat |
| Untuk lock jangka panjang | Bisa menghambat koneksi/session |
| Tanpa timeout/retry policy | Bisa membuat request gagal tidak jelas |
| Dengan key hash collision risk tidak dipahami | `hashtext` bukan identity absolut |
| Untuk critical correctness lintas sistem | Lock hanya di PostgreSQL database tersebut |

Untuk correctness utama, tetap utamakan **unique constraint + transaction + idempotency row**. Advisory lock adalah tambahan untuk serialisasi workflow, bukan fondasi tunggal.

---

## 16. Optimistic Concurrency untuk Business Entity

Contoh table case:

```sql
CREATE TABLE case_workflow_state (
    case_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,
    status text NOT NULL,
    assigned_to text NULL,
    version bigint NOT NULL DEFAULT 0,
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_case_workflow_status
        CHECK (status IN (
            'DRAFT',
            'SUBMITTED',
            'UNDER_REVIEW',
            'APPROVED',
            'REJECTED'
        ))
);
```

Transition:

```sql
UPDATE case_workflow_state
SET
    status = :newStatus,
    version = version + 1,
    updated_at = now()
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND status = :expectedStatus
  AND version = :expectedVersion;
```

Row count:

| Row count | Meaning |
|---:|---|
| `1` | Transition sukses |
| `0` | Status berubah, version conflict, case tidak ada, atau tenant salah |

Ini lebih aman daripada:

```sql
UPDATE case_workflow_state
SET status = :newStatus
WHERE case_id = :caseId;
```

Karena update tanpa expected state bisa membuat transition illegal.

---

## 17. Isolation Level Practical Notes

PostgreSQL mendukung standard transaction isolation levels, tetapi internally hanya tiga distinct isolation levels; `Read Uncommitted` berperilaku seperti `Read Committed` di PostgreSQL. Dokumentasi juga menyebut `Read Committed` sebagai default statement visibility mode di PostgreSQL. ([PostgreSQL](https://www.postgresql.org/docs/current/transaction-iso.html?utm_source=chatgpt.com))

Practical guidance:

| Case | Isolation yang biasanya cukup |
|---|---|
| Idempotency key insert + unique constraint | `READ COMMITTED` biasanya cukup |
| Optimistic update by version | `READ COMMITTED` biasanya cukup |
| Complex invariant across multiple rows | Pertimbangkan explicit locking atau `SERIALIZABLE` |
| Financial/regulatory invariant kompleks | Model invariant eksplisit, test concurrency, jangan hanya naik isolation |
| Queue worker with `SKIP LOCKED` | `READ COMMITTED` umum dipakai |

Jangan menganggap menaikkan isolation level otomatis menyelesaikan desain concurrency buruk. Biasanya yang lebih penting adalah:

```text
unique constraint
expected state
version check
transaction boundary
retry policy
```

---

## 18. MyBatis Mapper Pattern

### 18.1 Record

```java
public record IdempotencyRecord(
    UUID tenantId,
    String operation,
    String idempotencyKey,
    String requestHash,
    String status,
    Integer responseStatus,
    String responseBodyJson,
    String resourceType,
    UUID resourceId,
    String errorCode,
    String errorMessage,
    long version
) {}
```

### 18.2 Mapper Interface

```java
public interface IdempotencyMapper {

    int insertProcessing(
        @Param("tenantId") UUID tenantId,
        @Param("operation") String operation,
        @Param("idempotencyKey") String idempotencyKey,
        @Param("requestHash") String requestHash,
        @Param("requestMethod") String requestMethod,
        @Param("requestPath") String requestPath,
        @Param("businessKey") String businessKey,
        @Param("actorId") String actorId,
        @Param("clientId") String clientId,
        @Param("expiresAt") OffsetDateTime expiresAt
    );

    Optional<IdempotencyRecord> findByKey(
        @Param("tenantId") UUID tenantId,
        @Param("operation") String operation,
        @Param("idempotencyKey") String idempotencyKey
    );

    int markSucceeded(
        @Param("tenantId") UUID tenantId,
        @Param("operation") String operation,
        @Param("idempotencyKey") String idempotencyKey,
        @Param("responseStatus") int responseStatus,
        @Param("responseBodyJson") String responseBodyJson,
        @Param("resourceType") String resourceType,
        @Param("resourceId") UUID resourceId
    );

    int markFinalFailure(
        @Param("tenantId") UUID tenantId,
        @Param("operation") String operation,
        @Param("idempotencyKey") String idempotencyKey,
        @Param("responseStatus") int responseStatus,
        @Param("errorBodyJson") String errorBodyJson,
        @Param("errorCode") String errorCode,
        @Param("errorMessage") String errorMessage
    );

    boolean tryAdvisoryTransactionLock(@Param("lockKey") String lockKey);
}
```

### 18.3 XML Insert Processing

```xml
<insert id="insertProcessing">
    INSERT INTO api_idempotency_key (
        tenant_id,
        operation,
        idempotency_key,
        request_hash,
        request_method,
        request_path,
        business_key,
        actor_id,
        client_id,
        status,
        processing_started_at,
        expires_at
    )
    VALUES (
        #{tenantId},
        #{operation},
        #{idempotencyKey},
        #{requestHash},
        #{requestMethod},
        #{requestPath},
        #{businessKey},
        #{actorId},
        #{clientId},
        'PROCESSING',
        now(),
        #{expiresAt}
    )
    ON CONFLICT (tenant_id, operation, idempotency_key)
    DO NOTHING
</insert>
```

### 18.4 XML Find

```xml
<select id="findByKey" resultMap="IdempotencyRecordResultMap">
    SELECT
        tenant_id,
        operation,
        idempotency_key,
        request_hash,
        status,
        response_status,
        response_body::text AS response_body_json,
        resource_type,
        resource_id,
        error_code,
        error_message,
        version
    FROM api_idempotency_key
    WHERE tenant_id = #{tenantId}
      AND operation = #{operation}
      AND idempotency_key = #{idempotencyKey}
</select>
```

### 18.5 XML Advisory Lock

```xml
<select id="tryAdvisoryTransactionLock" resultType="boolean">
    SELECT pg_try_advisory_xact_lock(hashtext(#{lockKey}))
</select>
```

---

## 19. Service Pattern: Idempotent Command Handler

```java
public final class IdempotentCommandExecutor {

    private final IdempotencyMapper idempotencyMapper;
    private final ObjectMapper objectMapper;

    public <T> Response execute(
        IdempotentCommand<T> command,
        Supplier<CommandResult> businessOperation
    ) {
        int inserted = idempotencyMapper.insertProcessing(
            command.tenantId(),
            command.operation(),
            command.idempotencyKey(),
            command.requestHash(),
            command.method(),
            command.path(),
            command.businessKey(),
            command.actorId(),
            command.clientId(),
            command.expiresAt()
        );

        if (inserted == 0) {
            IdempotencyRecord existing = idempotencyMapper.findByKey(
                command.tenantId(),
                command.operation(),
                command.idempotencyKey()
            ).orElseThrow();

            return handleExisting(command, existing);
        }

        try {
            CommandResult result = businessOperation.get();

            String responseJson = serialize(result.body());

            int updated = idempotencyMapper.markSucceeded(
                command.tenantId(),
                command.operation(),
                command.idempotencyKey(),
                result.httpStatus(),
                responseJson,
                result.resourceType(),
                result.resourceId()
            );

            if (updated == 0) {
                throw new IllegalStateException("Could not mark idempotency success");
            }

            return Response.status(result.httpStatus())
                .entity(result.body())
                .build();

        } catch (BusinessValidationException e) {
            markFinalFailure(command, e);
            return Response.status(e.httpStatus())
                .entity(e.errorBody())
                .build();

        } catch (RuntimeException e) {
            // Depending on transaction setup, this may roll back.
            // For external side effects, prefer outbox pattern.
            throw e;
        }
    }

    private Response handleExisting(
        IdempotentCommand<?> command,
        IdempotencyRecord existing
    ) {
        if (!existing.requestHash().equals(command.requestHash())) {
            return Response.status(Response.Status.CONFLICT)
                .entity(Map.of(
                    "error", "IDEMPOTENCY_KEY_REUSED",
                    "message", "Same idempotency key was used with a different request"
                ))
                .build();
        }

        return switch (existing.status()) {
            case "SUCCEEDED" ->
                Response.status(existing.responseStatus())
                    .entity(parseJson(existing.responseBodyJson()))
                    .build();

            case "FAILED_FINAL" ->
                Response.status(existing.responseStatus())
                    .entity(parseJson(existing.responseBodyJson()))
                    .build();

            case "PROCESSING" ->
                Response.status(202)
                    .entity(Map.of(
                        "status", "PROCESSING",
                        "message", "Request is already being processed"
                    ))
                    .build();

            case "FAILED_RETRYABLE" ->
                Response.status(409)
                    .entity(Map.of(
                        "status", "FAILED_RETRYABLE",
                        "message", "Previous attempt failed retryably; retry policy required"
                    ))
                    .build();

            default ->
                Response.status(409)
                    .entity(Map.of(
                        "status", existing.status(),
                        "message", "Idempotency key is not reusable"
                    ))
                    .build();
        };
    }

    private String serialize(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Cannot serialize idempotency response", e);
        }
    }

    private Object parseJson(String json) {
        try {
            return objectMapper.readValue(json, Object.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Stored response is corrupted", e);
        }
    }
}
```

Catatan: di production, transaction management harus memastikan insert idempotency, business write, dan mark result berada di boundary yang benar. Kalau memakai Jersey tanpa Spring, biasanya transaction dikelola lewat service/unit-of-work wrapper atau MyBatis `SqlSession` lifecycle.

---

## 20. Jersey API Pattern

```java
@Path("/cases")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CaseResource {

    private final CaseCommandService caseCommandService;

    @POST
    public Response createCase(
        @HeaderParam("Idempotency-Key") String idempotencyKey,
        CreateCaseRequest request
    ) {
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("error", "MISSING_IDEMPOTENCY_KEY"))
                .build();
        }

        return caseCommandService.createCase(idempotencyKey, request);
    }
}
```

Practical API rule:

| Rule | Alasan |
|---|---|
| Idempotency key wajib untuk unsafe POST command | Retry-safe |
| Jangan wajib untuk pure GET | GET semestinya safe/idempotent |
| Bind key ke operation/path | Hindari reuse salah endpoint |
| Simpan request hash | Deteksi key sama payload beda |
| Simpan response final | Retry bisa return hasil sama |
| TTL jelas | Store tidak tumbuh selamanya |

---

## 21. Response Semantics

| Situation | Suggested HTTP |
|---|---|
| First command succeeded | `201 Created` / `200 OK` |
| Retry same key succeeded before | Same status/body as original, atau `200 OK` dengan resource |
| Same key different payload | `409 Conflict` |
| Same key still processing | `202 Accepted` atau `409 Conflict` |
| Final validation failure cached | Same error status/body |
| Retryable failure | `409`, `425`, atau domain-specific retry instruction |
| Expired idempotency key | `409 Conflict` / `410 Gone` |

Pilih satu contract dan dokumentasikan. Jangan berubah-ubah antar endpoint.

---

## 22. Cleanup Pattern

```sql
WITH expired AS (
    SELECT tenant_id, operation, idempotency_key
    FROM api_idempotency_key
    WHERE expires_at <= now()
      AND status IN ('SUCCEEDED', 'FAILED_FINAL', 'EXPIRED')
    ORDER BY expires_at
    LIMIT :batchSize
    FOR UPDATE SKIP LOCKED
)
DELETE FROM api_idempotency_key idem
USING expired e
WHERE idem.tenant_id = e.tenant_id
  AND idem.operation = e.operation
  AND idem.idempotency_key = e.idempotency_key;
```

Untuk regulatory/audit-heavy domain, jangan langsung delete detail penting. Alternatif:

```sql
UPDATE api_idempotency_key
SET
    status = 'EXPIRED',
    response_body = NULL,
    error_message = NULL,
    updated_at = now()
WHERE expires_at <= now()
  AND status IN ('SUCCEEDED', 'FAILED_FINAL');
```

Atau pindahkan ke archive table.

---

## 23. Outbox Integration Pattern

Untuk side effect eksternal, gunakan outbox.

```sql
CREATE TABLE outbox_event (
    event_id uuid PRIMARY KEY,
    aggregate_type text NOT NULL,
    aggregate_id uuid NOT NULL,
    event_type text NOT NULL,
    payload jsonb NOT NULL,
    status text NOT NULL DEFAULT 'PENDING',
    retry_count integer NOT NULL DEFAULT 0,
    available_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),
    published_at timestamptz NULL,

    CONSTRAINT ck_outbox_event_status
        CHECK (status IN ('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED'))
);
```

Transaction:

```sql
BEGIN;

-- acquire idempotency
-- insert/update business data

INSERT INTO outbox_event (
    event_id,
    aggregate_type,
    aggregate_id,
    event_type,
    payload
)
VALUES (
    :eventId,
    'CASE',
    :caseId,
    'CASE_CREATED',
    CAST(:payloadJson AS jsonb)
);

-- mark idempotency succeeded/accepted

COMMIT;
```

Worker claim:

```sql
WITH picked AS (
    SELECT event_id
    FROM outbox_event
    WHERE status = 'PENDING'
      AND available_at <= now()
    ORDER BY created_at
    LIMIT :batchSize
    FOR UPDATE SKIP LOCKED
)
UPDATE outbox_event e
SET
    status = 'PROCESSING',
    retry_count = retry_count + 1
FROM picked
WHERE e.event_id = picked.event_id
RETURNING e.*;
```

`FOR UPDATE SKIP LOCKED` cocok untuk multi-worker queue-like table karena menghindari worker saling menunggu row yang sama, dengan konsekuensi snapshot tidak cocok untuk query bisnis biasa. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-select.html))

---

## 24. Failure Mode Matrix

| Failure | Skenario | Mitigasi |
|---|---|---|
| Double submit | User/client retry POST | Idempotency key + unique constraint |
| Same key different payload | Client bug/reuse key | Request hash + `409 Conflict` |
| Crash before business commit | Transaction rollback | Retry creates/processes again |
| Crash after business commit before response | Idempotency row committed with result | Retry returns result |
| Crash after business commit but before idempotency success | Bad transaction boundary | Keep business write + mark success in same transaction, or use recovery by business key |
| External call succeeds but DB rollback | Side effect outside transaction | Use outbox/saga design |
| Two workers process same job | Race claim | `FOR UPDATE SKIP LOCKED` |
| Long-running lock | User input/external HTTP inside transaction | Short transactions, outbox |
| Deadlock | Inconsistent lock order | Consistent ordering, retry deadlock abort |
| Hot business key | Many concurrent commands | Advisory lock / optimistic state transition |
| Table grows forever | No TTL cleanup | `expires_at`, cleanup/archive |
| Stored response contains PII | Response cache too rich | Store minimal response or redact |
| Idempotency key predictable | Weak client key | Require UUID/random key, bind to tenant/client |

PostgreSQL explicitly warns that transactions waiting for conflicting locks can wait indefinitely when no deadlock is detected, so applications should not hold transactions open for long periods such as while waiting for user input. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html))

---

## 25. Production Checklist

| Checklist | Status |
|---|---|
| Idempotency key required for unsafe POST command | Wajib |
| Unique constraint on `(tenant_id, operation, idempotency_key)` | Wajib |
| Request hash/fingerprint stored | Wajib |
| Same key different payload returns conflict | Wajib |
| Response/result stored for success | Wajib |
| Final failure stored if useful | Disarankan |
| Processing timeout recovery | Wajib untuk reliability |
| TTL/retention strategy | Wajib |
| Business write and idempotency result atomic | Wajib jika pure DB operation |
| External side effect uses outbox/saga | Wajib |
| Optimistic version on business entity | Wajib untuk mutable workflow |
| Advisory lock only as supplemental lock-lite | Disarankan hati-hati |
| No external HTTP call inside long DB transaction | Wajib |
| Row count checks after update | Wajib |
| Observability for duplicate/retry/conflict rate | Wajib |
| Redaction policy for stored response body | Wajib jika ada PII/sensitive data |

---

## 26. Ringkasan Praktis

```text
PostgreSQL Idempotency Production Pattern
│
├── Identity
│   └── tenant_id + operation + idempotency_key
│
├── Safety
│   ├── request_hash
│   ├── unique constraint
│   ├── status machine
│   └── version
│
├── Processing
│   ├── insert PROCESSING
│   ├── execute business command
│   ├── mark SUCCEEDED / FAILED_FINAL
│   └── return cached result on retry
│
├── Concurrency
│   ├── ON CONFLICT DO NOTHING
│   ├── compare-and-set
│   ├── row count check
│   ├── FOR UPDATE SKIP LOCKED for workers
│   └── advisory lock only when needed
│
├── Distributed Side Effects
│   ├── outbox
│   ├── async publisher
│   ├── retry policy
│   └── dedupe at receiver when possible
│
└── Operations
    ├── expires_at
    ├── cleanup/archive
    ├── stuck PROCESSING recovery
    ├── metrics
    └── audit/redaction
```

---

# Status

**Seri 5/19 selesai.**

Berikutnya: **Seri 6/19 - Java/Jersey/MyBatis Integration Pattern for PostgreSQL Key-Value Database**, mencakup resource design, service transaction boundary, mapper XML, JSONB/hstore handling, idempotency integration, validation, error mapping, dan test strategy.

---

**Sources:**

- [Documentation: 18: INSERT](https://www.postgresql.org/docs/current/sql-insert.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:36:12 PM

Saya lanjut ke **Seri 6/19**, yaitu seri penutup blok key-value: integrasi Java/Jersey/MyBatis untuk PostgreSQL KV, termasuk JSONB/hstore mapping, transaksi, idempotency, validation, error mapping, dan test strategy.

# Seri 6/19 - Java/Jersey/MyBatis Integration Pattern for PostgreSQL Key-Value Database

## 1. Tujuan Seri Ini

Seri ini adalah penutup blok **PostgreSQL key-value database**. Fokusnya bukan lagi hanya desain tabel, tetapi bagaimana pola key-value ini dipakai secara aman dari aplikasi **Java 17+ / Jersey / MyBatis**.

Target praktisnya:

1. Membuat API key-value yang **domain-specific**, bukan generic dumping endpoint.
2. Menghubungkan Jersey Resource → Service → MyBatis Mapper → PostgreSQL.
3. Menangani `jsonb`, `hstore`, optimistic locking, idempotency, validation, transaction boundary, dan error mapping.
4. Menyiapkan pola yang bisa dipakai di enterprise service: tenant config, feature flag, workflow policy, integration config, idempotency key, dan metadata bag.

Untuk Jakarta/Jersey modern, gunakan `jakarta.ws.rs.*` namespace. Jersey 3.x adalah line yang mendukung Jakarta RESTful Web Services 3.0, sementara Jakarta RESTful Web Services 4.0 adalah bagian dari Jakarta EE 11 dan mempertahankan model resource berbasis REST API. Untuk MyBatis, konfigurasi utama tetap berada pada `configuration`, `settings`, `typeHandlers`, `environments`, dan `mappers`, sementara SQL detail bisa diletakkan di Mapper XML. ([Jersey](https://jersey.github.io/?utm_source=chatgpt.com))

---

## 2. Integration Architecture

```text id="zfrg24"
Java/Jersey/MyBatis PostgreSQL KV Architecture
│
├── HTTP Layer
│   ├── Jersey Resource
│   ├── DTO request/response
│   ├── Bean Validation
│   ├── Idempotency-Key header
│   └── ExceptionMapper
│
├── Application Service Layer
│   ├── domain-specific command
│   ├── validation orchestration
│   ├── transaction boundary
│   ├── optimistic locking
│   ├── idempotency handling
│   └── audit reason enforcement
│
├── Repository Layer
│   ├── MyBatis mapper interface
│   ├── Mapper XML
│   ├── TypeHandler for jsonb/hstore
│   ├── explicit SQL
│   └── row count interpretation
│
├── PostgreSQL Layer
│   ├── app_jsonb_kv_store
│   ├── app_kv_store_audit
│   ├── api_idempotency_key
│   ├── hstore metadata table
│   └── indexes/constraints
│
└── Operational Layer
    ├── migration
    ├── EXPLAIN ANALYZE
    ├── slow query logs
    ├── cleanup jobs
    ├── cache invalidation
    └── audit/observability
```

Prinsip desainnya: **storage boleh generic, API jangan terlalu generic**.

Buruk:

```http id="q7t7ii"
PUT /internal/kv/{namespace}/{key}
```

Lebih baik:

```http id="3euttr"
PUT /tenants/{tenantId}/workflow/escalation-policy
PUT /tenants/{tenantId}/features/{featureKey}
PUT /tenants/{tenantId}/integrations/payment-gateway/config
```

---

## 3. Recommended Package Structure

```text id="h2c7vo"
com.company.caseplatform.config
│
├── api
│   ├── FeatureFlagResource.java
│   ├── TenantSettingResource.java
│   ├── WorkflowPolicyResource.java
│   └── KvExceptionMapper.java
│
├── application
│   ├── FeatureFlagService.java
│   ├── TenantSettingService.java
│   ├── WorkflowPolicyService.java
│   ├── IdempotentCommandExecutor.java
│   └── TransactionExecutor.java
│
├── domain
│   ├── FeatureFlagConfig.java
│   ├── TenantCaseSetting.java
│   ├── WorkflowEscalationPolicy.java
│   ├── ConfigEnvelope.java
│   └── KvConflictException.java
│
├── persistence
│   ├── JsonbKvStoreMapper.java
│   ├── HstoreMetadataMapper.java
│   ├── IdempotencyMapper.java
│   ├── JsonbTypeHandler.java
│   ├── HstoreMapTypeHandler.java
│   └── mapper-xml
│       ├── JsonbKvStoreMapper.xml
│       ├── HstoreMetadataMapper.xml
│       └── IdempotencyMapper.xml
│
└── infrastructure
    ├── ObjectMapperFactory.java
    ├── SqlSessionFactoryProvider.java
    ├── PgDataSourceFactory.java
    └── ClockProvider.java
```

---

## 4. Maven Dependency Baseline

Versi pasti sebaiknya dikunci melalui BOM/internal parent POM perusahaan. Contoh struktur dependency:

```xml id="n7p67r"
<dependencies>
    <!-- Jersey / Jakarta REST -->
    <dependency>
        <groupId>org.glassfish.jersey.containers</groupId>
        <artifactId>jersey-container-servlet-core</artifactId>
    </dependency>

    <dependency>
        <groupId>org.glassfish.jersey.inject</groupId>
        <artifactId>jersey-hk2</artifactId>
    </dependency>

    <dependency>
        <groupId>org.glassfish.jersey.media</groupId>
        <artifactId>jersey-media-json-jackson</artifactId>
    </dependency>

    <!-- Jakarta Validation API + implementation if not provided by runtime -->
    <dependency>
        <groupId>jakarta.validation</groupId>
        <artifactId>jakarta.validation-api</artifactId>
    </dependency>

    <!-- MyBatis -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
    </dependency>

    <!-- PostgreSQL JDBC -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>

    <!-- Jackson -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>

    <dependency>
        <groupId>com.fasterxml.jackson.datatype</groupId>
        <artifactId>jackson-datatype-jsr310</artifactId>
    </dependency>
</dependencies>
```

Jersey menyediakan user guide untuk modules/dependencies dan resource model seperti `@Path`, HTTP method annotations, `@Produces`, `@Consumes`, parameter annotations, dan lifecycle root resources. MyBatis mendukung konfigurasi global, mapper XML, dan `typeHandler` pada mapping/result/parameter level. ([Eclipse EE4J](https://eclipse-ee4j.github.io/jersey.github.io/documentation/latest3x/index.html?utm_source=chatgpt.com))

---

## 5. Database Baseline

Kita pakai tabel dari seri sebelumnya, disederhanakan sedikit untuk integrasi.

```sql id="g7xsfi"
CREATE TABLE app_jsonb_kv_store (
    tenant_id uuid NOT NULL,
    namespace text NOT NULL,
    key text NOT NULL,

    value jsonb NOT NULL,
    value_type text NOT NULL,
    schema_version integer NOT NULL DEFAULT 1,

    status text NOT NULL DEFAULT 'ACTIVE',
    version bigint NOT NULL DEFAULT 0,

    effective_from timestamptz NULL,
    effective_until timestamptz NULL,
    expires_at timestamptz NULL,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by text NULL,
    updated_by text NULL,

    PRIMARY KEY (tenant_id, namespace, key),

    CONSTRAINT ck_app_jsonb_kv_status
        CHECK (status IN ('DRAFT', 'ACTIVE', 'DISABLED', 'DELETED')),

    CONSTRAINT ck_app_jsonb_kv_value_is_object
        CHECK (jsonb_typeof(value) = 'object')
);

CREATE INDEX idx_app_jsonb_kv_namespace_active
    ON app_jsonb_kv_store (tenant_id, namespace, status, key)
    WHERE status = 'ACTIVE';

CREATE INDEX idx_app_jsonb_kv_expires_at
    ON app_jsonb_kv_store (expires_at)
    WHERE expires_at IS NOT NULL;
```

`jsonb` cocok untuk value yang perlu diproses dan di-query karena PostgreSQL menyimpan `jsonb` dalam format decomposed binary; PostgreSQL juga menyediakan operator/fungsi JSON dan SQL/JSON path untuk akses field, containment, dan query struktur JSON. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html?utm_source=chatgpt.com))

---

## 6. Domain DTO dan Envelope Pattern

### 6.1 Config Envelope

Jangan return raw JSON saja. Return metadata version agar client bisa melakukan optimistic update.

```java id="x8xmkd"
public record ConfigEnvelope<T>(
    T value,
    long version,
    int schemaVersion,
    String valueType,
    OffsetDateTime effectiveFrom,
    OffsetDateTime effectiveUntil,
    OffsetDateTime updatedAt
) {}
```

### 6.2 Feature Flag DTO

```java id="8s8mxy"
public record FeatureFlagConfig(
    boolean enabled,
    int rolloutPercentage,
    List<String> allowedRoles,
    String defaultTreatment
) {
    public FeatureFlagConfig {
        if (rolloutPercentage < 0 || rolloutPercentage > 100) {
            throw new IllegalArgumentException("rolloutPercentage must be between 0 and 100");
        }
        if (!Set.of("CONTROL", "TREATMENT").contains(defaultTreatment)) {
            throw new IllegalArgumentException("Invalid defaultTreatment");
        }
        allowedRoles = allowedRoles == null ? List.of() : List.copyOf(allowedRoles);
    }

    public static FeatureFlagConfig disabled() {
        return new FeatureFlagConfig(false, 0, List.of(), "CONTROL");
    }
}
```

### 6.3 Update Request

```java id="lwybql"
public record UpdateFeatureFlagRequest(
    long expectedVersion,
    FeatureFlagConfig config,
    String reason
) {
    public UpdateFeatureFlagRequest {
        if (config == null) {
            throw new IllegalArgumentException("config is required");
        }
        if (reason == null || reason.isBlank()) {
            throw new IllegalArgumentException("reason is required");
        }
    }
}
```

Practical rule: untuk config yang mempengaruhi behavior production, `reason` wajib agar audit berguna.

---

## 7. Persistence Record

```java id="lktn7x"
public record JsonbKvEntry(
    UUID tenantId,
    String namespace,
    String key,
    String valueJson,
    String valueType,
    int schemaVersion,
    String status,
    long version,
    OffsetDateTime effectiveFrom,
    OffsetDateTime effectiveUntil,
    OffsetDateTime expiresAt,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt,
    String createdBy,
    String updatedBy
) {}
```

Di sisi aplikasi, menyimpan `valueJson` sebagai `String` sering lebih sederhana dan eksplisit untuk MyBatis. Nanti SQL melakukan `CAST(#{valueJson} AS jsonb)` saat write dan `value::text AS value_json` saat read.

---

## 8. MyBatis Mapper Interface

```java id="ra6a13"
public interface JsonbKvStoreMapper {

    Optional<JsonbKvEntry> findActiveByKey(
        @Param("tenantId") UUID tenantId,
        @Param("namespace") String namespace,
        @Param("key") String key
    );

    List<JsonbKvEntry> findActiveByNamespace(
        @Param("tenantId") UUID tenantId,
        @Param("namespace") String namespace
    );

    int insert(JsonbKvEntry entry);

    int upsert(JsonbKvEntry entry);

    int compareAndSet(
        @Param("tenantId") UUID tenantId,
        @Param("namespace") String namespace,
        @Param("key") String key,
        @Param("expectedVersion") long expectedVersion,
        @Param("newValueJson") String newValueJson,
        @Param("valueType") String valueType,
        @Param("schemaVersion") int schemaVersion,
        @Param("effectiveFrom") OffsetDateTime effectiveFrom,
        @Param("effectiveUntil") OffsetDateTime effectiveUntil,
        @Param("expiresAt") OffsetDateTime expiresAt,
        @Param("actor") String actor
    );

    int softDelete(
        @Param("tenantId") UUID tenantId,
        @Param("namespace") String namespace,
        @Param("key") String key,
        @Param("expectedVersion") long expectedVersion,
        @Param("actor") String actor
    );
}
```

MyBatis Mapper XML bisa berisi SQL dan result mappings, sementara interface Java menjadi kontrak repository. Dokumentasi MyBatis menyebut mapper XML sebagai tempat SQL code dan mapping definitions, serta memungkinkan `typeHandler` pada mapping-by-mapping basis. ([MyBatis](https://mybatis.org/mybatis-3/getting-started.html?utm_source=chatgpt.com))

---

## 9. Mapper XML: Result Map

```xml id="pqvduv"
<mapper namespace="com.company.caseplatform.config.persistence.JsonbKvStoreMapper">

    <resultMap id="JsonbKvEntryResultMap"
               type="com.company.caseplatform.config.persistence.JsonbKvEntry">
        <constructor>
            <arg column="tenant_id" javaType="java.util.UUID"/>
            <arg column="namespace" javaType="string"/>
            <arg column="key" javaType="string"/>
            <arg column="value_json" javaType="string"/>
            <arg column="value_type" javaType="string"/>
            <arg column="schema_version" javaType="int"/>
            <arg column="status" javaType="string"/>
            <arg column="version" javaType="long"/>
            <arg column="effective_from" javaType="java.time.OffsetDateTime"/>
            <arg column="effective_until" javaType="java.time.OffsetDateTime"/>
            <arg column="expires_at" javaType="java.time.OffsetDateTime"/>
            <arg column="created_at" javaType="java.time.OffsetDateTime"/>
            <arg column="updated_at" javaType="java.time.OffsetDateTime"/>
            <arg column="created_by" javaType="string"/>
            <arg column="updated_by" javaType="string"/>
        </constructor>
    </resultMap>
```

---

## 10. Mapper XML: Read Query

```xml id="vb0qy0"
    <select id="findActiveByKey" resultMap="JsonbKvEntryResultMap">
        SELECT
            tenant_id,
            namespace,
            key,
            value::text AS value_json,
            value_type,
            schema_version,
            status,
            version,
            effective_from,
            effective_until,
            expires_at,
            created_at,
            updated_at,
            created_by,
            updated_by
        FROM app_jsonb_kv_store
        WHERE tenant_id = #{tenantId}
          AND namespace = #{namespace}
          AND key = #{key}
          AND status = 'ACTIVE'
          AND (expires_at IS NULL OR expires_at > now())
          AND (effective_from IS NULL OR effective_from <= now())
          AND (effective_until IS NULL OR effective_until > now())
    </select>
```

Key detail:

| Clause | Alasan |
|---|---|
| `tenant_id` | Security/ownership boundary |
| `namespace` + `key` | Logical KV identity |
| `status = 'ACTIVE'` | Lifecycle filter |
| `expires_at` | TTL-style safety |
| `effective_from/until` | Scheduled config activation |
| `value::text` | Mudah di-deserialize oleh Jackson |

---

## 11. Mapper XML: Namespace Listing

```xml id="6hnqcq"
    <select id="findActiveByNamespace" resultMap="JsonbKvEntryResultMap">
        SELECT
            tenant_id,
            namespace,
            key,
            value::text AS value_json,
            value_type,
            schema_version,
            status,
            version,
            effective_from,
            effective_until,
            expires_at,
            created_at,
            updated_at,
            created_by,
            updated_by
        FROM app_jsonb_kv_store
        WHERE tenant_id = #{tenantId}
          AND namespace = #{namespace}
          AND status = 'ACTIVE'
          AND (expires_at IS NULL OR expires_at > now())
        ORDER BY key
    </select>
```

---

## 12. Mapper XML: Insert

```xml id="u5wduv"
    <insert id="insert">
        INSERT INTO app_jsonb_kv_store (
            tenant_id,
            namespace,
            key,
            value,
            value_type,
            schema_version,
            status,
            version,
            effective_from,
            effective_until,
            expires_at,
            created_by,
            updated_by
        )
        VALUES (
            #{tenantId},
            #{namespace},
            #{key},
            CAST(#{valueJson} AS jsonb),
            #{valueType},
            #{schemaVersion},
            #{status},
            #{version},
            #{effectiveFrom},
            #{effectiveUntil},
            #{expiresAt},
            #{createdBy},
            #{updatedBy}
        )
    </insert>
```

`CAST(#{valueJson} AS jsonb)` membuat binding tetap sederhana dari Java string, sementara tipe database tetap `jsonb`.

---

## 13. Mapper XML: Upsert

```xml id="jop1ty"
    <insert id="upsert">
        INSERT INTO app_jsonb_kv_store (
            tenant_id,
            namespace,
            key,
            value,
            value_type,
            schema_version,
            status,
            version,
            effective_from,
            effective_until,
            expires_at,
            created_by,
            updated_by
        )
        VALUES (
            #{tenantId},
            #{namespace},
            #{key},
            CAST(#{valueJson} AS jsonb),
            #{valueType},
            #{schemaVersion},
            'ACTIVE',
            0,
            #{effectiveFrom},
            #{effectiveUntil},
            #{expiresAt},
            #{createdBy},
            #{updatedBy}
        )
        ON CONFLICT (tenant_id, namespace, key)
        DO UPDATE SET
            value = EXCLUDED.value,
            value_type = EXCLUDED.value_type,
            schema_version = EXCLUDED.schema_version,
            status = 'ACTIVE',
            effective_from = EXCLUDED.effective_from,
            effective_until = EXCLUDED.effective_until,
            expires_at = EXCLUDED.expires_at,
            version = app_jsonb_kv_store.version + 1,
            updated_at = now(),
            updated_by = EXCLUDED.updated_by
    </insert>
```

PostgreSQL `INSERT ... ON CONFLICT` dipakai untuk menentukan aksi alternatif saat terjadi unique/exclusion constraint conflict, misalnya `DO NOTHING` atau `DO UPDATE`; ini adalah pola utama untuk upsert KV. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-insert.html?utm_source=chatgpt.com))

---

## 14. Mapper XML: Compare-And-Set

```xml id="v285f1"
    <update id="compareAndSet">
        UPDATE app_jsonb_kv_store
        SET
            value = CAST(#{newValueJson} AS jsonb),
            value_type = #{valueType},
            schema_version = #{schemaVersion},
            effective_from = #{effectiveFrom},
            effective_until = #{effectiveUntil},
            expires_at = #{expiresAt},
            version = version + 1,
            updated_at = now(),
            updated_by = #{actor}
        WHERE tenant_id = #{tenantId}
          AND namespace = #{namespace}
          AND key = #{key}
          AND version = #{expectedVersion}
          AND status = 'ACTIVE'
          AND (expires_at IS NULL OR expires_at > now())
    </update>
```

Interpretasi `row count`:

| Row count | Makna |
|---:|---|
| `1` | Update berhasil |
| `0` | Version conflict, row tidak ada, row inactive, expired, atau tenant/key salah |

Jangan pernah mengabaikan return value update. Dalam service, `0` harus diubah menjadi conflict/not found sesuai context.

---

## 15. Mapper XML: Soft Delete

```xml id="k9io3p"
    <update id="softDelete">
        UPDATE app_jsonb_kv_store
        SET
            status = 'DELETED',
            version = version + 1,
            updated_at = now(),
            updated_by = #{actor}
        WHERE tenant_id = #{tenantId}
          AND namespace = #{namespace}
          AND key = #{key}
          AND version = #{expectedVersion}
          AND status <> 'DELETED'
    </update>

</mapper>
```

---

## 16. JSONB TypeHandler: Kapan Perlu?

Ada dua pendekatan:

| Pendekatan | Kapan cocok |
|---|---|
| `String valueJson` + `CAST(? AS jsonb)` di SQL | Paling sederhana, portable untuk MyBatis XML |
| Custom `TypeHandler` memakai `PGobject` | Cocok jika ingin Java object langsung bind sebagai `jsonb` |

pgJDBC menyediakan `PGobject` untuk mendeskripsikan tipe PostgreSQL yang tidak dikenal oleh standar JDBC; class ini umum dipakai untuk binding tipe seperti `jsonb` secara eksplisit. ([pgJDBC](https://jdbc.postgresql.org/documentation/publicapi/org/postgresql/util/PGobject.html?utm_source=chatgpt.com))

### 16.1 TypeHandler `PGobject` untuk JSONB

```java id="z96qi0"
@MappedJdbcTypes(JdbcType.OTHER)
@MappedTypes(String.class)
public final class JsonbStringTypeHandler extends BaseTypeHandler<String> {

    @Override
    public void setNonNullParameter(
        PreparedStatement ps,
        int i,
        String parameter,
        JdbcType jdbcType
    ) throws SQLException {
        PGobject jsonObject = new PGobject();
        jsonObject.setType("jsonb");
        jsonObject.setValue(parameter);
        ps.setObject(i, jsonObject);
    }

    @Override
    public String getNullableResult(ResultSet rs, String columnName)
        throws SQLException {
        Object value = rs.getObject(columnName);
        return value == null ? null : value.toString();
    }

    @Override
    public String getNullableResult(ResultSet rs, int columnIndex)
        throws SQLException {
        Object value = rs.getObject(columnIndex);
        return value == null ? null : value.toString();
    }

    @Override
    public String getNullableResult(CallableStatement cs, int columnIndex)
        throws SQLException {
        Object value = cs.getObject(columnIndex);
        return value == null ? null : value.toString();
    }
}
```

### 16.2 MyBatis Config

```xml id="x9q3zv"
<configuration>
    <typeHandlers>
        <typeHandler
            handler="com.company.caseplatform.config.persistence.JsonbStringTypeHandler"/>
    </typeHandlers>
</configuration>
```

MyBatis configuration mendukung registrasi `typeHandlers`, dan mapper XML dapat menunjuk handler secara eksplisit jika perlu. ([MyBatis](https://mybatis.org/mybatis-3/configuration.html?utm_source=chatgpt.com))

### 16.3 Mana yang Saya Rekomendasikan?

Untuk tim enterprise yang banyak memakai XML MyBatis:

```text id="2zt8jc"
Default:
  valueJson String + CAST(#{valueJson} AS jsonb)

Gunakan TypeHandler jika:
  banyak mapper butuh jsonb
  ingin mengurangi CAST berulang
  standar tim sudah matang
```

Saya cenderung mulai dari `CAST` eksplisit karena SQL-nya jelas, mudah di-debug, dan tidak menyembunyikan mapping magic.

---

## 17. hstore Integration Pattern

Untuk `hstore`, ada dua pola:

### 17.1 Patch Single Attribute dengan Function

```xml id="oxykxn"
<update id="patchAttribute">
    UPDATE provider_reference
    SET
        attributes = attributes || hstore(#{attributeKey}, #{attributeValue}),
        version = version + 1,
        updated_at = now(),
        updated_by = #{actor}
    WHERE tenant_id = #{tenantId}
      AND id = #{id}
      AND version = #{expectedVersion}
</update>
```

Ini lebih aman daripada membuat literal hstore manual di Java.

### 17.2 Read hstore sebagai JSONB Text

```xml id="3xl34x"
<select id="findProviderReference" resultMap="ProviderReferenceResultMap">
    SELECT
        id,
        tenant_id,
        provider_code,
        external_reference,
        hstore_to_jsonb(attributes)::text AS attributes_json,
        version,
        updated_at
    FROM provider_reference
    WHERE tenant_id = #{tenantId}
      AND id = #{id}
</select>
```

PostgreSQL `hstore` menyediakan operator/fungsi untuk key-value flat dan juga fungsi konversi ke JSON/JSONB seperti `hstore_to_jsonb`, sehingga API bisa tetap memakai JSON object walau penyimpanan internalnya `hstore`. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

---

## 18. Service Layer: Generic Storage, Typed API

### 18.1 Generic Store Service

```java id="sdpvp4"
public final class JsonbKvStoreService {

    private final JsonbKvStoreMapper mapper;
    private final ObjectMapper objectMapper;

    public JsonbKvStoreService(
        JsonbKvStoreMapper mapper,
        ObjectMapper objectMapper
    ) {
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }

    public <T> Optional<ConfigEnvelope<T>> find(
        UUID tenantId,
        String namespace,
        String key,
        Class<T> valueClass
    ) {
        return mapper.findActiveByKey(tenantId, namespace, key)
            .map(entry -> toEnvelope(entry, valueClass));
    }

    public <T> void updateWithVersion(
        UUID tenantId,
        String namespace,
        String key,
        long expectedVersion,
        T value,
        String valueType,
        int schemaVersion,
        String actor
    ) {
        String valueJson = serialize(value);

        int updated = mapper.compareAndSet(
            tenantId,
            namespace,
            key,
            expectedVersion,
            valueJson,
            valueType,
            schemaVersion,
            null,
            null,
            null,
            actor
        );

        if (updated == 0) {
            throw new KvConflictException(
                "Configuration was modified, expired, deleted, or not found"
            );
        }
    }

    private <T> ConfigEnvelope<T> toEnvelope(
        JsonbKvEntry entry,
        Class<T> valueClass
    ) {
        T value = deserialize(entry.valueJson(), valueClass);

        return new ConfigEnvelope<>(
            value,
            entry.version(),
            entry.schemaVersion(),
            entry.valueType(),
            entry.effectiveFrom(),
            entry.effectiveUntil(),
            entry.updatedAt()
        );
    }

    private String serialize(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new InvalidConfigException("Invalid config object", e);
        }
    }

    private <T> T deserialize(String json, Class<T> valueClass) {
        try {
            return objectMapper.readValue(json, valueClass);
        } catch (JsonProcessingException e) {
            throw new StoredConfigCorruptionException(
                "Stored config cannot be deserialized as " + valueClass.getSimpleName(),
                e
            );
        }
    }
}
```

### 18.2 Domain-Specific Service

```java id="44uv5l"
public final class FeatureFlagService {

    private static final String NAMESPACE = "feature.case-review";
    private static final String VALUE_TYPE = "FEATURE_FLAG";
    private static final int SCHEMA_VERSION = 1;

    private final JsonbKvStoreService kvStore;

    public Optional<ConfigEnvelope<FeatureFlagConfig>> find(
        UUID tenantId,
        String featureKey
    ) {
        validateFeatureKey(featureKey);
        return kvStore.find(tenantId, NAMESPACE, featureKey, FeatureFlagConfig.class);
    }

    public void update(
        UUID tenantId,
        String featureKey,
        long expectedVersion,
        FeatureFlagConfig config,
        String actor,
        String reason
    ) {
        validateFeatureKey(featureKey);
        validateReason(reason);

        kvStore.updateWithVersion(
            tenantId,
            NAMESPACE,
            featureKey,
            expectedVersion,
            config,
            VALUE_TYPE,
            SCHEMA_VERSION,
            actor
        );

        // In production, also write audit/outbox in same transaction.
    }

    private void validateFeatureKey(String featureKey) {
        if (featureKey == null || !featureKey.matches("[a-z0-9][a-z0-9-]{1,80}")) {
            throw new InvalidConfigException("Invalid feature key");
        }
    }

    private void validateReason(String reason) {
        if (reason == null || reason.isBlank()) {
            throw new InvalidConfigException("Update reason is required");
        }
    }
}
```

---

## 19. Transaction Boundary

Kalau menggunakan MyBatis tanpa Spring, pastikan `SqlSession` dikelola eksplisit.

```java id="phbcwp"
public final class TransactionExecutor {

    private final SqlSessionFactory sqlSessionFactory;

    public TransactionExecutor(SqlSessionFactory sqlSessionFactory) {
        this.sqlSessionFactory = sqlSessionFactory;
    }

    public <T> T inTransaction(Function<SqlSession, T> work) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            try {
                T result = work.apply(session);
                session.commit();
                return result;
            } catch (RuntimeException e) {
                session.rollback();
                throw e;
            }
        }
    }
}
```

Contoh pemakaian:

```java id="l81png"
public void updateFeatureFlag(UpdateCommand command) {
    transactionExecutor.inTransaction(session -> {
        JsonbKvStoreMapper kvMapper = session.getMapper(JsonbKvStoreMapper.class);
        AuditMapper auditMapper = session.getMapper(AuditMapper.class);

        int updated = kvMapper.compareAndSet(
            command.tenantId(),
            "feature.case-review",
            command.featureKey(),
            command.expectedVersion(),
            command.valueJson(),
            "FEATURE_FLAG",
            1,
            null,
            null,
            null,
            command.actor()
        );

        if (updated == 0) {
            throw new KvConflictException("Feature flag version conflict");
        }

        auditMapper.insertAudit(command.toAuditRecord());
        return null;
    });
}
```

Practical invariant:

```text id="ldfpvh"
Config update + audit insert + outbox insert
harus berada dalam satu transaction boundary.
```

MyBatis getting started documentation menjelaskan environment configuration untuk transaction management dan data source; dalam aplikasi production, Anda perlu memastikan lifecycle session/transaction tidak tersebar acak di resource layer. ([MyBatis](https://mybatis.org/mybatis-3/getting-started.html?utm_source=chatgpt.com))

---

## 20. Jersey Resource Pattern

```java id="11prc4"
@Path("/tenants/{tenantId}/features/{featureKey}")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class FeatureFlagResource {

    private final FeatureFlagService featureFlagService;

    public FeatureFlagResource(FeatureFlagService featureFlagService) {
        this.featureFlagService = featureFlagService;
    }

    @GET
    public Response get(
        @PathParam("tenantId") UUID tenantId,
        @PathParam("featureKey") String featureKey
    ) {
        return featureFlagService.find(tenantId, featureKey)
            .map(Response::ok)
            .orElseGet(() -> Response.status(Response.Status.NOT_FOUND))
            .build();
    }

    @PUT
    public Response update(
        @PathParam("tenantId") UUID tenantId,
        @PathParam("featureKey") String featureKey,
        @HeaderParam("Idempotency-Key") String idempotencyKey,
        UpdateFeatureFlagRequest request,
        @Context SecurityContext securityContext
    ) {
        String actor = securityContext.getUserPrincipal().getName();

        featureFlagService.update(
            tenantId,
            featureKey,
            request.expectedVersion(),
            request.config(),
            actor,
            request.reason()
        );

        return Response.noContent().build();
    }
}
```

Jersey/JAX-RS resource class memakai annotation seperti `@Path`, method HTTP annotations, `@Consumes`, `@Produces`, dan parameter annotations untuk mengikat request ke method resource. ([Eclipse EE4J](https://eclipse-ee4j.github.io/jersey.github.io/documentation/latest3x/index.html?utm_source=chatgpt.com))

---

## 21. Exception Mapping

Jangan biarkan exception persistence bocor sebagai `500` mentah.

```java id="dhy9gv"
@Provider
public final class KvExceptionMapper
    implements ExceptionMapper<RuntimeException> {

    @Override
    public Response toResponse(RuntimeException exception) {
        if (exception instanceof KvConflictException) {
            return Response.status(Response.Status.CONFLICT)
                .entity(error("KV_VERSION_CONFLICT", exception.getMessage()))
                .build();
        }

        if (exception instanceof InvalidConfigException) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(error("INVALID_CONFIG", exception.getMessage()))
                .build();
        }

        if (exception instanceof StoredConfigCorruptionException) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(error("STORED_CONFIG_CORRUPTION",
                    "Stored configuration is invalid; contact support"))
                .build();
        }

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
            .entity(error("INTERNAL_ERROR", "Unexpected error"))
            .build();
    }

    private Map<String, Object> error(String code, String message) {
        return Map.of(
            "code", code,
            "message", message
        );
    }
}
```

JAX-RS/Jersey mendukung provider seperti exception mapper untuk mengubah exception aplikasi menjadi HTTP response yang jelas; resource dan provider discovery harus dikonfigurasi sesuai runtime yang digunakan. ([Eclipse EE4J](https://eclipse-ee4j.github.io/jersey.github.io/documentation/latest3x/index.html?utm_source=chatgpt.com))

---

## 22. Idempotency Integration di Resource/Service

Untuk unsafe `PUT`/`POST`, terutama update config yang bisa diretry oleh gateway/client, tambahkan `Idempotency-Key`.

```java id="a4swhw"
public void updateFeatureFlagIdempotently(
    UUID tenantId,
    String featureKey,
    String idempotencyKey,
    UpdateFeatureFlagRequest request,
    String actor
) {
    if (idempotencyKey == null || idempotencyKey.isBlank()) {
        throw new InvalidConfigException("Idempotency-Key header is required");
    }

    String requestHash = requestHasher.hash(
        "PUT",
        "/tenants/" + tenantId + "/features/" + featureKey,
        request
    );

    idempotentCommandExecutor.execute(
        new IdempotentCommand(
            tenantId,
            "UPDATE_FEATURE_FLAG",
            idempotencyKey,
            requestHash,
            featureKey,
            actor
        ),
        () -> {
            update(
                tenantId,
                featureKey,
                request.expectedVersion(),
                request.config(),
                actor,
                request.reason()
            );

            return CommandResult.noContent();
        }
    );
}
```

PostgreSQL unique constraints plus `ON CONFLICT` adalah fondasi idempotency key acquire; untuk worker/recovery pattern, `FOR UPDATE SKIP LOCKED` dapat dipakai untuk melewati row yang sedang terkunci, tetapi PostgreSQL menegaskan bahwa `SKIP LOCKED` memberikan view data yang tidak konsisten sehingga cocok untuk queue-like worker, bukan general business query. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-insert.html?utm_source=chatgpt.com))

---

## 23. Audit Integration

### 23.1 Audit Table

```sql id="b0cfc2"
CREATE TABLE app_jsonb_kv_store_audit (
    audit_id bigserial PRIMARY KEY,

    tenant_id uuid NOT NULL,
    namespace text NOT NULL,
    key text NOT NULL,

    old_value jsonb NULL,
    new_value jsonb NULL,

    old_version bigint NULL,
    new_version bigint NULL,

    action text NOT NULL,
    actor text NOT NULL,
    reason text NOT NULL,

    changed_at timestamptz NOT NULL DEFAULT now()
);
```

### 23.2 Mapper Method

```java id="xbwxch"
public interface JsonbKvAuditMapper {
    int insertAudit(KvAuditRecord record);
}
```

```xml id="v8ft4x"
<insert id="insertAudit">
    INSERT INTO app_jsonb_kv_store_audit (
        tenant_id,
        namespace,
        key,
        old_value,
        new_value,
        old_version,
        new_version,
        action,
        actor,
        reason
    )
    VALUES (
        #{tenantId},
        #{namespace},
        #{key},
        CAST(#{oldValueJson} AS jsonb),
        CAST(#{newValueJson} AS jsonb),
        #{oldVersion},
        #{newVersion},
        #{action},
        #{actor},
        #{reason}
    )
</insert>
```

### 23.3 Better Pattern: SQL CTE Update + Audit

Jika ingin update dan audit benar-benar atomic dalam satu SQL:

```xml id="z5okng"
<insert id="compareAndSetWithAudit">
    WITH old_row AS (
        SELECT *
        FROM app_jsonb_kv_store
        WHERE tenant_id = #{tenantId}
          AND namespace = #{namespace}
          AND key = #{key}
          AND version = #{expectedVersion}
          AND status = 'ACTIVE'
    ),
    updated_row AS (
        UPDATE app_jsonb_kv_store kv
        SET
            value = CAST(#{newValueJson} AS jsonb),
            value_type = #{valueType},
            schema_version = #{schemaVersion},
            version = kv.version + 1,
            updated_at = now(),
            updated_by = #{actor}
        FROM old_row old
        WHERE kv.tenant_id = old.tenant_id
          AND kv.namespace = old.namespace
          AND kv.key = old.key
        RETURNING kv.*
    )
    INSERT INTO app_jsonb_kv_store_audit (
        tenant_id,
        namespace,
        key,
        old_value,
        new_value,
        old_version,
        new_version,
        action,
        actor,
        reason
    )
    SELECT
        old_row.tenant_id,
        old_row.namespace,
        old_row.key,
        old_row.value,
        updated_row.value,
        old_row.version,
        updated_row.version,
        'UPDATE',
        #{actor},
        #{reason}
    FROM old_row
    JOIN updated_row
      ON updated_row.tenant_id = old_row.tenant_id
     AND updated_row.namespace = old_row.namespace
     AND updated_row.key = old_row.key
</insert>
```

Jika insert count `0`, berarti update tidak terjadi. Service harus mengubahnya menjadi `409 Conflict`.

---

## 24. Caching Pattern

Jangan query PostgreSQL setiap request jika config dipakai di hot path.

```text id="puq1bz"
Recommended Runtime Read
│
├── Local cache
│   ├── key: tenantId + namespace + key
│   ├── value: ConfigEnvelope<T>
│   ├── TTL short
│   └── version-aware
│
├── PostgreSQL
│   ├── source of truth
│   ├── audit
│   └── transaction
│
└── Invalidation
    ├── outbox event
    ├── Kafka/RabbitMQ/Redis pubsub
    └── refresh affected key
```

Example cache wrapper:

```java id="89lwcs"
public final class CachedFeatureFlagReader {

    private final FeatureFlagService service;
    private final ConcurrentMap<String, ConfigEnvelope<FeatureFlagConfig>> cache =
        new ConcurrentHashMap<>();

    public FeatureFlagConfig getEffectiveFlag(UUID tenantId, String featureKey) {
        String cacheKey = tenantId + "|feature.case-review|" + featureKey;

        ConfigEnvelope<FeatureFlagConfig> envelope =
            cache.computeIfAbsent(cacheKey, ignored ->
                service.find(tenantId, featureKey)
                    .orElse(new ConfigEnvelope<>(
                        FeatureFlagConfig.disabled(),
                        0,
                        1,
                        "FEATURE_FLAG",
                        null,
                        null,
                        OffsetDateTime.now()
                    ))
            );

        return envelope.value();
    }

    public void invalidate(UUID tenantId, String featureKey) {
        cache.remove(tenantId + "|feature.case-review|" + featureKey);
    }
}
```

---

## 25. Validation Strategy

```text id="52i80f"
Validation Layers
│
├── HTTP DTO
│   ├── required field
│   ├── primitive range
│   └── request shape
│
├── Domain DTO
│   ├── business invariant
│   ├── enum whitelist
│   └── safe default
│
├── Service
│   ├── namespace/key whitelist
│   ├── permission check
│   ├── actor/reason required
│   └── optimistic version
│
├── Database
│   ├── NOT NULL
│   ├── CHECK status/type
│   ├── jsonb_typeof
│   └── unique/primary key
│
└── Runtime
    ├── deserialization failure detection
    ├── fallback behavior
    └── alerting
```

Jersey has Bean Validation support through dependencies/configuration/registration, and Jakarta RESTful Web Services defines the REST resource model that frameworks such as Jersey implement. ([Eclipse EE4J](https://eclipse-ee4j.github.io/jersey.github.io/documentation/2.11/bean-validation.html?utm_source=chatgpt.com))

---

## 26. Error Mapping Table

| Failure | Java exception | HTTP status | Response code |
|---|---|---:|---|
| Missing idempotency key | `InvalidConfigException` | `400` | `MISSING_IDEMPOTENCY_KEY` |
| Invalid config DTO | `InvalidConfigException` | `400` | `INVALID_CONFIG` |
| Version conflict | `KvConflictException` | `409` | `KV_VERSION_CONFLICT` |
| Same idempotency key different payload | `IdempotencyConflictException` | `409` | `IDEMPOTENCY_KEY_REUSED` |
| Config not found | `KvNotFoundException` | `404` | `CONFIG_NOT_FOUND` |
| Stored JSON cannot deserialize | `StoredConfigCorruptionException` | `500` | `STORED_CONFIG_CORRUPTION` |
| Database unavailable | `PersistenceException` | `503` | `DATABASE_UNAVAILABLE` |
| Duplicate key unexpected | `DuplicateKeyException` | `409` | `DUPLICATE_KEY` |

---

## 27. Testing Strategy

### 27.1 Unit Test

Target:

| Unit | Test |
|---|---|
| DTO | invalid rollout percentage rejected |
| Service | version conflict throws `KvConflictException` |
| Serializer | JSON round-trip stable |
| Request hasher | same payload same hash, different payload different hash |
| Feature evaluator | role/percentage logic correct |

### 27.2 Mapper Integration Test

Gunakan PostgreSQL asli via test container atau environment integration DB, bukan H2, karena `jsonb`, `hstore`, `ON CONFLICT`, dan PostgreSQL operator tidak identik dengan H2.

Test cases:

```text id="nkaog1"
1. insert config
2. read active config
3. update with correct version succeeds
4. update with stale version returns 0
5. expired config is not returned
6. upsert increments version
7. invalid JSON rejected by CAST jsonb
8. hstore patch updates one key
9. idempotency duplicate key returns existing
10. audit row inserted in same transaction
```

### 27.3 API Test

Target:

| Scenario | Expected |
|---|---|
| GET existing feature | `200` + envelope |
| GET missing feature | `404` |
| PUT valid update | `204` |
| PUT stale version | `409` |
| PUT invalid config | `400` |
| PUT missing reason | `400` |
| PUT same idempotency key same payload | same result |
| PUT same idempotency key different payload | `409` |

---

## 28. Observability

Minimal log fields:

```text id="h49lhp"
tenant_id
namespace
key
operation
actor
idempotency_key
request_hash
old_version
new_version
result
duration_ms
db_row_count
```

Metrics:

| Metric | Makna |
|---|---|
| `kv.read.count` | Volume read config |
| `kv.update.count` | Volume update |
| `kv.update.conflict.count` | Optimistic locking conflict |
| `kv.idempotency.replay.count` | Retry duplicate request |
| `kv.idempotency.conflict.count` | Same key different payload |
| `kv.deserialize.failure.count` | Stored config corruption |
| `kv.cache.hit.ratio` | Efektivitas cache |
| `kv.db.query.duration` | Latency query PostgreSQL |

Alert penting:

| Alert | Kenapa |
|---|---|
| Stored config corruption > 0 | Data production rusak |
| Conflict spike | UI/client stale version atau concurrent admin |
| DB query latency naik | Index/query issue |
| Cache hit rendah | Hot path terlalu sering ke DB |
| Idempotency conflict naik | Client bug/reuse key salah |

---

## 29. Production Failure Modes

| Failure mode | Penyebab | Mitigasi |
|---|---|---|
| Resource terlalu generic | Semua module menulis sembarang KV | Domain-specific API |
| Lost update | Tidak pakai expected version | Compare-and-set |
| Audit hilang | Update dan audit beda transaksi | Same transaction / CTE |
| JSONB binding error | Mapper kirim string tanpa cast/type | `CAST(? AS jsonb)` atau `PGobject` |
| Stored JSON tidak cocok DTO baru | Schema evolution buruk | `schema_version` + compatibility reader |
| Config update sukses tapi cache stale | Tidak ada invalidation | Outbox/event invalidation |
| Duplicate retry membuat double update | Tidak ada idempotency | `Idempotency-Key` + request hash |
| `hstore` escaping bug | Build literal manual | Gunakan `hstore(key,value)` |
| Error DB bocor ke client | Tidak ada ExceptionMapper | Error mapping standar |
| Transaction leak | SqlSession tidak ditutup | `try-with-resources` transaction executor |
| Slow JSON query | Filter JSON tanpa index | Expression/generated index |
| Sensitive config leak | Store raw secret di JSONB | Secret reference only |

---

## 30. End-to-End Flow: Update Feature Flag

```text id="t5efdd"
Client
  PUT /tenants/{tenantId}/features/{featureKey}
  Header: Idempotency-Key
  Body: expectedVersion + config + reason
    │
    ▼
Jersey Resource
  parse path/header/body
  get actor from security context
    │
    ▼
FeatureFlagService
  validate key
  validate config
  validate reason
  compute request hash
    │
    ▼
IdempotentCommandExecutor
  insert idempotency PROCESSING
  if duplicate:
    return cached result / conflict / processing
    │
    ▼
Transaction
  read current row
  compare-and-set update by version
  insert audit row
  insert outbox cache invalidation event
  mark idempotency SUCCEEDED
    │
    ▼
PostgreSQL
  app_jsonb_kv_store
  app_jsonb_kv_store_audit
  outbox_event
  api_idempotency_key
    │
    ▼
Response
  204 No Content
```

---

## 31. Minimal Production Template

### Resource

```java id="ouq9yd"
@Path("/tenants/{tenantId}/features/{featureKey}")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class FeatureFlagResource {
    private final FeatureFlagApplicationService service;

    @PUT
    public Response update(
        @PathParam("tenantId") UUID tenantId,
        @PathParam("featureKey") String featureKey,
        @HeaderParam("Idempotency-Key") String idempotencyKey,
        UpdateFeatureFlagRequest request,
        @Context SecurityContext securityContext
    ) {
        String actor = securityContext.getUserPrincipal().getName();

        service.updateFeatureFlag(
            tenantId,
            featureKey,
            idempotencyKey,
            request,
            actor
        );

        return Response.noContent().build();
    }
}
```

### Service

```java id="o7wt3e"
public void updateFeatureFlag(
    UUID tenantId,
    String featureKey,
    String idempotencyKey,
    UpdateFeatureFlagRequest request,
    String actor
) {
    validateIdempotencyKey(idempotencyKey);

    transactionExecutor.inTransaction(session -> {
        JsonbKvStoreMapper kv = session.getMapper(JsonbKvStoreMapper.class);
        JsonbKvAuditMapper audit = session.getMapper(JsonbKvAuditMapper.class);
        IdempotencyMapper idem = session.getMapper(IdempotencyMapper.class);

        // 1. acquire idempotency
        // 2. reject hash mismatch
        // 3. compare-and-set KV update
        // 4. insert audit
        // 5. insert outbox event
        // 6. mark idempotency success

        return null;
    });
}
```

### Mapper SQL

```xml id="je02n2"
<update id="compareAndSet">
    UPDATE app_jsonb_kv_store
    SET
        value = CAST(#{newValueJson} AS jsonb),
        value_type = #{valueType},
        schema_version = #{schemaVersion},
        version = version + 1,
        updated_at = now(),
        updated_by = #{actor}
    WHERE tenant_id = #{tenantId}
      AND namespace = #{namespace}
      AND key = #{key}
      AND version = #{expectedVersion}
      AND status = 'ACTIVE'
</update>
```

---

## 32. Practical Rules yang Harus Diingat

| Rule | Kenapa |
|---|---|
| API domain-specific, storage generic | Mencegah KV jadi dumping ground |
| `tenant_id`, `namespace`, `key` wajib eksplisit | Security dan identity jelas |
| `valueJson String + CAST AS jsonb` aman untuk awal | Debuggable dan jelas |
| `PGobject` boleh dipakai via TypeHandler | Lebih reusable tapi lebih magic |
| Update harus pakai `expectedVersion` | Hindari lost update |
| Row count `0` bukan sukses | Itu conflict/not found/expired |
| Config penting wajib audit | Regulatory defensibility |
| Idempotency key untuk unsafe command | Retry-safe |
| Jangan simpan secret raw di JSONB | Pakai secret reference |
| Jangan query DB di hot path tanpa cache | Latency dan load |
| Jangan expose arbitrary JSON filter | Bisa membunuh performance |
| Test pakai PostgreSQL asli | `jsonb/hstore/ON CONFLICT` harus diuji native |

---

# Status

**Seri 6/19 selesai.**

Blok **PostgreSQL Key-Value Database** selesai:

1. Seri 1 - PostgreSQL multi-model foundation  
2. Seri 2 - Simple KV table, namespace, metadata, TTL  
3. Seri 3 - `hstore`  
4. Seri 4 - `jsonb` as KV store  
5. Seri 5 - Idempotency key, lock-lite, optimistic concurrency  
6. Seri 6 - Java/Jersey/MyBatis integration for KV database  

Berikutnya masuk blok **PostgreSQL Document Database**:

**Seri 7/19 - Document Database Pattern dengan `jsonb`: document table design, metadata columns, payload strategy, status lifecycle, schema versioning, dan production query pattern.**

---

**Sources:**

- [Eclipse Jersey](https://jersey.github.io/?utm_source=chatgpt.com)
- [Jersey 3.1.1 User Guide](https://eclipse-ee4j.github.io/jersey.github.io/documentation/latest3x/index.html?utm_source=chatgpt.com)
- [Documentation: 18: 8.14. JSON Types](https://www.postgresql.org/docs/current/datatype-json.html?utm_source=chatgpt.com)
- [MyBatis 3 | Getting started](https://mybatis.org/mybatis-3/getting-started.html?utm_source=chatgpt.com)
- [Class PGobject](https://jdbc.postgresql.org/documentation/publicapi/org/postgresql/util/PGobject.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:38:48 PM

Saya lanjut ke **Seri 7/19**, mulai blok PostgreSQL Document Database. Fokusnya: desain tabel dokumen `jsonb`, metadata kolom, lifecycle status, schema versioning, query production, dan batas kapan dokumen harus dinormalisasi.

# Seri 7/19 - Document Database Pattern dengan `jsonb`: Document Table Design

## 1. Tujuan Seri Ini

Seri ini membuka blok **PostgreSQL Document Database**. Fokusnya adalah memakai PostgreSQL sebagai **document-style store** berbasis `jsonb`, tetapi tetap dengan disiplin relational design, constraint, lifecycle, audit, dan query governance.

Target praktisnya:

1. Mendesain table dokumen berbasis `jsonb`.
2. Memisahkan **metadata stabil** dari **payload fleksibel**.
3. Membuat lifecycle status dokumen.
4. Menambahkan schema versioning.
5. Mendesain query production.
6. Menentukan kapan field harus tetap di JSONB dan kapan harus dipromosikan menjadi kolom biasa.
7. Menyiapkan fondasi untuk integrasi Java/Jersey/MyBatis di seri berikutnya.

PostgreSQL menyediakan tipe `json` dan `jsonb`; `json` menyimpan teks JSON input, sedangkan `jsonb` menyimpan data dalam format binary decomposed sehingga tidak mempertahankan whitespace/order asli tetapi lebih efisien untuk pemrosesan dan dapat di-index. Untuk document database pattern yang perlu query/filter terhadap isi payload, `jsonb` biasanya menjadi default praktis. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html?utm_source=chatgpt.com))

---

## 2. Mental Model

```text
PostgreSQL Document Database Pattern
│
├── Relational Metadata
│   ├── id
│   ├── tenant_id
│   ├── document_type
│   ├── business_key
│   ├── status
│   ├── schema_version
│   ├── version
│   ├── created_at
│   └── updated_at
│
├── Flexible Payload
│   ├── payload jsonb
│   ├── nested object
│   ├── arrays
│   ├── provider-specific fields
│   ├── workflow-specific form data
│   └── dynamic attributes
│
├── Governance
│   ├── CHECK constraint
│   ├── schema version
│   ├── DTO validation
│   ├── migration/backfill
│   ├── audit
│   └── query whitelist
│
├── Query Pattern
│   ├── by id
│   ├── by business key
│   ├── by tenant/type/status
│   ├── by extracted JSON field
│   ├── containment query
│   └── JSONPath query
│
└── Performance Pattern
    ├── B-tree for metadata
    ├── expression index for hot JSON field
    ├── generated column for stable extracted field
    ├── partial index for hot subset
    └── GIN only for real containment/existence workload
```

---

## 3. Kapan PostgreSQL `jsonb` Cocok sebagai Document Database?

PostgreSQL `jsonb` cocok saat dokumen punya **core identity dan lifecycle yang stabil**, tetapi detail payload berubah-ubah.

| Use case | Contoh | Kenapa cocok |
|---|---|---|
| Case document | Form pengaduan, investigasi, evidence metadata | Metadata case stabil, detail form bisa bervariasi |
| Workflow document | Payload per BPMN process/task | Tiap workflow/task bisa punya struktur berbeda |
| External API snapshot | Response dari provider eksternal | Struktur bisa berubah antar provider/version |
| Regulatory submission | Submission payload dengan schema version | Perlu audit, versioning, dan validasi |
| Dynamic form data | Form internal yang field-nya configurable | Struktur semi-dinamis |
| Event/resource snapshot | Snapshot entity saat event terjadi | Fleksibel, immutable-ish, mudah diaudit |
| Integration staging | Raw-ish payload sebelum dinormalisasi | Berguna untuk ingestion dan debugging |

Pola yang paling aman bukan “semua field masuk `payload`”, tetapi:

```text
Relational columns = identity, lifecycle, ownership, query-critical fields
jsonb payload       = flexible document detail
```

---

## 4. Kapan Jangan Pakai Document Pattern?

| Kondisi | Kenapa berbahaya | Alternatif |
|---|---|---|
| Semua field perlu FK | JSONB tidak cocok untuk relational integrity berat | Normalisasi tabel |
| Semua field sering dipakai filter/sort/join | Query JSONB akan sulit dioptimalkan | Kolom relational / generated column |
| Payload menjadi satu-satunya sumber invariant | Constraint sulit | Relational schema |
| Update kecil sangat sering pada nested field | Bloat/write amplification | Tabel normal / event model |
| Dokumen sangat besar | Read/write mahal, index besar | Object storage + metadata table |
| Query arbitrary dari user | Bisa memicu seq scan/GIN bloat | Query whitelist/search engine |
| Analytics berat atas payload | JSONB kurang nyaman untuk OLAP | Projection/materialized view/warehouse |
| Butuh document DB horizontal scale native | PostgreSQL bisa terbatas | Dedicated document DB tergantung kebutuhan |

Rule praktis:

```text
Gunakan jsonb untuk flexibility.
Jangan gunakan jsonb untuk menghindari data modelling.
```

---

## 5. Anti-Pattern: “id + payload”

Desain yang terlalu bebas:

```sql
CREATE TABLE documents_bad (
    id uuid PRIMARY KEY,
    payload jsonb NOT NULL
);
```

Masalahnya:

| Masalah | Dampak |
|---|---|
| Tidak ada `tenant_id` | Security boundary kabur |
| Tidak ada `document_type` | Validasi dan indexing sulit |
| Tidak ada `business_key` | Idempotency dan lookup bisnis sulit |
| Tidak ada `status` | Lifecycle tersembunyi di JSON |
| Tidak ada `schema_version` | Evolusi payload kacau |
| Tidak ada `version` | Lost update |
| Tidak ada timestamp | Audit dan debugging sulit |
| Semua query harus masuk payload | Performance tidak predictable |

---

## 6. Recommended Document Table Design

```sql
CREATE TABLE app_document (
    document_id uuid PRIMARY KEY,

    tenant_id uuid NOT NULL,
    document_type text NOT NULL,
    business_key text NOT NULL,

    status text NOT NULL,
    schema_version integer NOT NULL,
    version bigint NOT NULL DEFAULT 0,

    payload jsonb NOT NULL,

    source_system text NULL,
    correlation_id text NULL,
    trace_id text NULL,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by text NULL,
    updated_by text NULL,

    CONSTRAINT uq_app_document_business_key
        UNIQUE (tenant_id, document_type, business_key),

    CONSTRAINT ck_app_document_status
        CHECK (status IN (
            'DRAFT',
            'SUBMITTED',
            'ACTIVE',
            'UNDER_REVIEW',
            'APPROVED',
            'REJECTED',
            'ARCHIVED',
            'DELETED'
        )),

    CONSTRAINT ck_app_document_type_not_blank
        CHECK (length(trim(document_type)) > 0),

    CONSTRAINT ck_app_document_business_key_not_blank
        CHECK (length(trim(business_key)) > 0),

    CONSTRAINT ck_app_document_schema_version_positive
        CHECK (schema_version > 0),

    CONSTRAINT ck_app_document_payload_object
        CHECK (jsonb_typeof(payload) = 'object')
);
```

### Kenapa ini lebih production-grade?

| Kolom | Alasan |
|---|---|
| `document_id` | Technical identity |
| `tenant_id` | Security, ownership, partitioning, RLS |
| `document_type` | Routing validation dan indexing |
| `business_key` | Idempotency/business identity |
| `status` | Lifecycle query tanpa bongkar JSON |
| `schema_version` | Payload evolution |
| `version` | Optimistic locking |
| `payload` | Detail fleksibel |
| `source_system` | Trace ingestion/integration |
| `correlation_id`, `trace_id` | Observability |
| `created_by`, `updated_by` | Audit dasar |

---

## 7. Document Type Design

`document_type` harus stabil dan domain-specific.

Contoh bagus:

```text
CASE_INTAKE_FORM
CASE_REVIEW_RESULT
CUSTOMER_RISK_PROFILE
PROVIDER_RESPONSE_SNAPSHOT
WORKFLOW_TASK_PAYLOAD
REGULATORY_SUBMISSION
INVESTIGATION_NOTE
```

Contoh buruk:

```text
DATA
JSON
FORM
PAYLOAD
MISC
TEMP
DOC1
```

Practical convention:

```text
<DOMAIN>_<PURPOSE>_<OPTIONAL_VARIANT>
```

Contoh:

```text
CASE_INTAKE_FORM
CASE_ESCALATION_POLICY
PAYMENT_PROVIDER_RESPONSE
CUSTOMER_KYC_SNAPSHOT
```

---

## 8. Business Key Design

`business_key` adalah identity yang dimengerti domain.

| Document type | Business key example |
|---|---|
| `CASE_INTAKE_FORM` | `CASE-2026-000123` |
| `CUSTOMER_RISK_PROFILE` | `CUSTOMER:C001:2026-07` |
| `PROVIDER_RESPONSE_SNAPSHOT` | `PROVIDER-X:REQ-998877` |
| `WORKFLOW_TASK_PAYLOAD` | `PROCESS:abc:TASK:review-1` |
| `REGULATORY_SUBMISSION` | `SUBMISSION:OJK:2026:0001` |

Jangan menjadikan `business_key` sebagai string acak tanpa makna. Kalau perlu lookup bisnis dan idempotency, key harus stabil.

---

## 9. Payload Design

### 9.1 Contoh Case Intake Payload

```json
{
  "applicant": {
    "name": "Budi Santoso",
    "identityNumberMasked": "3174********0001",
    "customerId": "C001"
  },
  "case": {
    "category": "DISPUTE",
    "priority": "HIGH",
    "description": "Customer reported unauthorized activity"
  },
  "channel": {
    "source": "WEB",
    "submittedAt": "2026-07-15T10:15:00+07:00"
  },
  "attachments": [
    {
      "attachmentId": "att-001",
      "fileName": "evidence.pdf",
      "contentType": "application/pdf"
    }
  ]
}
```

### 9.2 Mana yang Harus Jadi Kolom Biasa?

Dari payload di atas, field seperti ini sebaiknya **dipertimbangkan menjadi kolom** jika sering dipakai query:

| Field | Alasan |
|---|---|
| `customerId` | Lookup dan join ke customer |
| `category` | Filter/reporting |
| `priority` | Queue/sort |
| `source` | Reporting channel |
| `submittedAt` | Range query/time partition |

Desain hybrid:

```sql
CREATE TABLE case_document (
    document_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,
    case_number text NOT NULL,
    customer_id text NOT NULL,
    category text NOT NULL,
    priority text NOT NULL,
    channel text NOT NULL,

    status text NOT NULL,
    schema_version integer NOT NULL,
    version bigint NOT NULL DEFAULT 0,

    payload jsonb NOT NULL,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_case_document_case_number
        UNIQUE (tenant_id, case_number),

    CONSTRAINT ck_case_document_payload_object
        CHECK (jsonb_typeof(payload) = 'object')
);
```

Practical rule:

```text
Jika field sering dipakai WHERE / JOIN / ORDER BY / GROUP BY,
jangan sembunyikan field itu hanya di JSONB.
```

---

## 10. Status Lifecycle Pattern

Document database dalam enterprise system biasanya butuh lifecycle yang eksplisit.

```text
DRAFT
  │
  ▼
SUBMITTED
  │
  ├──► UNDER_REVIEW
  │       │
  │       ├──► APPROVED
  │       └──► REJECTED
  │
  └──► ARCHIVED
```

Contoh transition table opsional:

```sql
CREATE TABLE app_document_transition_log (
    transition_id bigserial PRIMARY KEY,

    document_id uuid NOT NULL,
    tenant_id uuid NOT NULL,

    old_status text NOT NULL,
    new_status text NOT NULL,

    reason text NULL,
    actor text NOT NULL,

    changed_at timestamptz NOT NULL DEFAULT now()
);
```

Transition update dengan optimistic locking:

```sql
UPDATE app_document
SET
    status = :newStatus,
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE document_id = :documentId
  AND tenant_id = :tenantId
  AND status = :expectedStatus
  AND version = :expectedVersion;
```

Interpretasi row count:

| Row count | Arti |
|---:|---|
| `1` | Transition sukses |
| `0` | Status berubah, version conflict, document tidak ada, atau tenant salah |

---

## 11. Schema Versioning Pattern

`schema_version` wajib jika payload berubah dari waktu ke waktu.

### 11.1 Contoh Version 1

```json
{
  "customerId": "C001",
  "riskScore": 75,
  "riskLevel": "HIGH"
}
```

### 11.2 Contoh Version 2

```json
{
  "customer": {
    "id": "C001"
  },
  "risk": {
    "score": 75,
    "level": "HIGH",
    "modelVersion": "risk-v2"
  }
}
```

Tanpa `schema_version`, reader akan bingung path mana yang benar.

---

## 12. Compatibility Reader Pattern

Di Java, reader harus bisa membaca beberapa schema version jika migration belum penuh.

```java
public CustomerRiskProfile readRiskProfile(JsonbDocument document) {
    return switch (document.schemaVersion()) {
        case 1 -> readRiskProfileV1(document.payloadJson());
        case 2 -> readRiskProfileV2(document.payloadJson());
        default -> throw new UnsupportedSchemaVersionException(
            "Unsupported schema version: " + document.schemaVersion()
        );
    };
}
```

Practical migration strategy:

```text
1. Add reader compatibility for v1 and v2
2. Start writing v2 for new documents
3. Backfill old v1 documents to v2
4. Monitor remaining v1 count
5. Remove v1 reader only after safe window
```

---

## 13. Query Pattern

PostgreSQL JSON functions/operators support field access, JSON processing, SQL/JSON path, and query functions such as JSON path operations. Use them carefully: they are powerful, but production query shape must be governed. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

### 13.1 Get by ID

```sql
SELECT
    document_id,
    tenant_id,
    document_type,
    business_key,
    status,
    schema_version,
    version,
    payload::text AS payload_json,
    created_at,
    updated_at
FROM app_document
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND status <> 'DELETED';
```

### 13.2 Get by Business Key

```sql
SELECT
    document_id,
    tenant_id,
    document_type,
    business_key,
    status,
    schema_version,
    version,
    payload::text AS payload_json
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = :documentType
  AND business_key = :businessKey
  AND status <> 'DELETED';
```

### 13.3 List by Type and Status

```sql
SELECT
    document_id,
    business_key,
    status,
    schema_version,
    created_at,
    updated_at
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = :documentType
  AND status = :status
ORDER BY updated_at DESC
LIMIT :limit
OFFSET :offset;
```

### 13.4 Filter by JSON Field

```sql
SELECT
    document_id,
    business_key,
    payload::text AS payload_json
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND status = 'SUBMITTED'
  AND payload -> 'case' ->> 'priority' = 'HIGH';
```

### 13.5 Containment Query

```sql
SELECT
    document_id,
    business_key
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND payload @> '{"case": {"category": "DISPUTE"}}'::jsonb;
```

### 13.6 JSONPath Query

```sql
SELECT
    document_id,
    business_key
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND jsonb_path_exists(
        payload,
        '$.attachments[*] ? (@.contentType == "application/pdf")'
      );
```

JSONPath cocok untuk predicate nested yang lebih ekspresif, tetapi jangan langsung expose JSONPath mentah dari API client.

---

## 14. Indexing Baseline

### 14.1 B-tree untuk Metadata

```sql
CREATE INDEX idx_app_document_tenant_type_status_updated
    ON app_document (tenant_id, document_type, status, updated_at DESC);
```

Untuk query list biasa, ini jauh lebih penting daripada GIN JSONB.

### 14.2 Unique Business Key

```sql
CREATE UNIQUE INDEX uq_app_document_business_key_idx
    ON app_document (tenant_id, document_type, business_key);
```

Kalau sudah dibuat sebagai constraint, index dibuat otomatis oleh PostgreSQL.

### 14.3 Partial Index untuk Active Documents

```sql
CREATE INDEX idx_app_document_active_by_type
    ON app_document (tenant_id, document_type, updated_at DESC)
    WHERE status IN ('SUBMITTED', 'ACTIVE', 'UNDER_REVIEW');
```

PostgreSQL mendukung partial index, termasuk untuk memperkecil index hanya pada subset row yang sering diakses. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createindex.html?utm_source=chatgpt.com))

---

## 15. Expression Index untuk Hot JSON Field

Jika sering query priority:

```sql
CREATE INDEX idx_app_document_case_priority
    ON app_document ((payload -> 'case' ->> 'priority'))
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED';
```

Query:

```sql
SELECT document_id, business_key
FROM app_document
WHERE document_type = 'CASE_INTAKE_FORM'
  AND status <> 'DELETED'
  AND payload -> 'case' ->> 'priority' = 'HIGH';
```

Expression index cocok jika field JSON tertentu sering dipakai filter.

---

## 16. Generated Column untuk Field Stabil

Jika field JSON mulai menjadi sangat penting, gunakan generated column atau promote ke kolom biasa.

Contoh generated column:

```sql
ALTER TABLE app_document
ADD COLUMN case_priority text
GENERATED ALWAYS AS (payload -> 'case' ->> 'priority') STORED;
```

Index:

```sql
CREATE INDEX idx_app_document_case_priority_generated
    ON app_document (tenant_id, document_type, case_priority)
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED';
```

Generated column adalah kolom yang dihitung dari kolom lain; PostgreSQL mendukung generated column stored dan virtual, dengan stored column dihitung saat write dan disimpan seperti kolom biasa. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-generated-columns.html?utm_source=chatgpt.com))

Decision:

| Kondisi | Pilihan |
|---|---|
| Field jarang dipakai | Tetap di JSONB |
| Field sering dipakai filter | Expression index |
| Field sering dipakai banyak query/reporting | Generated column atau kolom biasa |
| Field perlu FK/unique/check kuat | Kolom biasa |
| Field menjadi business invariant | Kolom biasa |

---

## 17. GIN Index: Jangan Jadikan Default

GIN index untuk `jsonb` berguna untuk containment/existence query. Tapi GIN bukan jawaban untuk semua query JSONB. PostgreSQL menyediakan GIN operator class untuk `jsonb`, termasuk `jsonb_ops` dan `jsonb_path_ops`; operator class yang dipilih menentukan operator yang didukung dan karakteristik index. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html?utm_source=chatgpt.com))

### 17.1 GIN Default

```sql
CREATE INDEX idx_app_document_payload_gin
    ON app_document
    USING gin (payload);
```

Cocok untuk query seperti:

```sql
WHERE payload @> '{"case": {"category": "DISPUTE"}}'::jsonb
```

atau existence query tertentu.

### 17.2 GIN dengan `jsonb_path_ops`

```sql
CREATE INDEX idx_app_document_payload_path_gin
    ON app_document
    USING gin (payload jsonb_path_ops);
```

Practical decision:

| Query pattern | Index |
|---|---|
| `tenant_id + document_type + status` | B-tree |
| `business_key` lookup | Unique B-tree |
| `payload -> 'case' ->> 'priority' = ?` | Expression index |
| Field stabil dan penting | Generated/normal column |
| `payload @> {...}` banyak | GIN |
| Banyak arbitrary JSON search | Rethink API/query design |
| Admin-only rare JSON search | Mungkin tidak perlu index |

---

## 18. Document Mutation Pattern

Ada tiga pendekatan utama.

---

### 18.1 Replace Whole Payload

```sql
UPDATE app_document
SET
    payload = CAST(:newPayloadJson AS jsonb),
    schema_version = :schemaVersion,
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion
  AND status <> 'DELETED';
```

Paling aman untuk validation dan audit.

Cocok untuk:

| Cocok | Alasan |
|---|---|
| Document form update | Validasi seluruh DTO |
| Config-like document | Payload kecil-menengah |
| Regulatory update | Full snapshot mudah diaudit |
| Version migration | Payload schema berubah |

---

### 18.2 Patch Field dengan `jsonb_set`

```sql
UPDATE app_document
SET
    payload = jsonb_set(
        payload,
        '{case,priority}',
        to_jsonb(:priority::text),
        true
    ),
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion
  AND status <> 'DELETED';
```

Cocok untuk patch kecil, tetapi rawan melewati validasi object penuh.

---

### 18.3 Merge Top-Level Object

```sql
UPDATE app_document
SET
    payload = payload || CAST(:patchJson AS jsonb),
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion
  AND status <> 'DELETED';
```

Hati-hati: merge top-level bukan deep merge semantik domain. Untuk nested document, patch behavior harus jelas.

---

## 19. Audit Pattern

Untuk document database, audit minimal harus menyimpan old/new atau delta.

### 19.1 Full Snapshot Audit

```sql
CREATE TABLE app_document_audit (
    audit_id bigserial PRIMARY KEY,

    document_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    document_type text NOT NULL,
    business_key text NOT NULL,

    old_status text NULL,
    new_status text NULL,

    old_payload jsonb NULL,
    new_payload jsonb NULL,

    old_version bigint NULL,
    new_version bigint NULL,

    action text NOT NULL,
    actor text NOT NULL,
    reason text NULL,

    changed_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_app_document_audit_action
        CHECK (action IN (
            'CREATE',
            'UPDATE',
            'PATCH',
            'STATUS_CHANGE',
            'ARCHIVE',
            'DELETE',
            'MIGRATE_SCHEMA'
        ))
);
```

### 19.2 CTE Update + Audit

```sql
WITH old_row AS (
    SELECT *
    FROM app_document
    WHERE tenant_id = :tenantId
      AND document_id = :documentId
      AND version = :expectedVersion
      AND status <> 'DELETED'
),
updated_row AS (
    UPDATE app_document d
    SET
        payload = CAST(:newPayloadJson AS jsonb),
        schema_version = :schemaVersion,
        version = d.version + 1,
        updated_at = now(),
        updated_by = :actor
    FROM old_row old
    WHERE d.document_id = old.document_id
      AND d.tenant_id = old.tenant_id
    RETURNING d.*
)
INSERT INTO app_document_audit (
    document_id,
    tenant_id,
    document_type,
    business_key,
    old_status,
    new_status,
    old_payload,
    new_payload,
    old_version,
    new_version,
    action,
    actor,
    reason
)
SELECT
    old_row.document_id,
    old_row.tenant_id,
    old_row.document_type,
    old_row.business_key,
    old_row.status,
    updated_row.status,
    old_row.payload,
    updated_row.payload,
    old_row.version,
    updated_row.version,
    'UPDATE',
    :actor,
    :reason
FROM old_row
JOIN updated_row
  ON updated_row.document_id = old_row.document_id
 AND updated_row.tenant_id = old_row.tenant_id;
```

Jika insert count `0`, update tidak terjadi karena version conflict/not found/deleted.

---

## 20. Document Creation Pattern

### 20.1 Insert

```sql
INSERT INTO app_document (
    document_id,
    tenant_id,
    document_type,
    business_key,
    status,
    schema_version,
    payload,
    created_by,
    updated_by
)
VALUES (
    :documentId,
    :tenantId,
    :documentType,
    :businessKey,
    'DRAFT',
    :schemaVersion,
    CAST(:payloadJson AS jsonb),
    :actor,
    :actor
);
```

### 20.2 Insert with Idempotency

Untuk `POST /documents`, pakai idempotency key store dari Seri 5.

```text
BEGIN
  acquire idempotency key
  insert app_document
  insert app_document_audit
  mark idempotency succeeded with document_id
COMMIT
```

Jangan hanya mengandalkan `business_key` unique constraint tanpa response caching, karena retry setelah timeout butuh mengembalikan hasil yang konsisten.

---

## 21. Document Read Model Pattern

Untuk API read, jangan selalu return full payload jika tidak perlu.

### 21.1 Summary Query

```sql
SELECT
    document_id,
    document_type,
    business_key,
    status,
    schema_version,
    version,
    created_at,
    updated_at
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = :documentType
  AND status = :status
ORDER BY updated_at DESC
LIMIT :limit;
```

### 21.2 Detail Query

```sql
SELECT
    document_id,
    tenant_id,
    document_type,
    business_key,
    status,
    schema_version,
    version,
    payload::text AS payload_json,
    created_at,
    updated_at
FROM app_document
WHERE tenant_id = :tenantId
  AND document_id = :documentId;
```

### 21.3 Projection Query

```sql
SELECT
    document_id,
    business_key,
    payload -> 'case' ->> 'priority' AS priority,
    payload -> 'case' ->> 'category' AS category,
    payload -> 'channel' ->> 'source' AS source
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND status = 'SUBMITTED';
```

---

## 22. API Design Pattern

### 22.1 Jangan Expose Generic JSON Query

Berbahaya:

```http
POST /documents/search
{
  "jsonPath": "$.case.priority",
  "operator": "=",
  "value": "HIGH"
}
```

Masalah:

- query mahal,
- sulit index,
- rawan injection-like abuse walau bukan SQL injection langsung,
- sulit governance,
- sulit observability.

### 22.2 Gunakan Whitelisted Search API

Lebih aman:

```http
GET /tenants/{tenantId}/case-documents?status=SUBMITTED&priority=HIGH&category=DISPUTE
```

Backend mapping:

```sql
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND status = :status
  AND payload -> 'case' ->> 'priority' = :priority
  AND payload -> 'case' ->> 'category' = :category
```

Dengan begitu field yang boleh dicari diketahui dan bisa di-index.

---

## 23. Java/Jersey/MyBatis Preview

Detail penuh untuk document database ada di **Seri 12**, tetapi pattern awalnya:

```java
public record JsonbDocumentRecord(
    UUID documentId,
    UUID tenantId,
    String documentType,
    String businessKey,
    String status,
    int schemaVersion,
    long version,
    String payloadJson,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {}
```

Mapper:

```java
public interface DocumentMapper {

    Optional<JsonbDocumentRecord> findById(
        @Param("tenantId") UUID tenantId,
        @Param("documentId") UUID documentId
    );

    Optional<JsonbDocumentRecord> findByBusinessKey(
        @Param("tenantId") UUID tenantId,
        @Param("documentType") String documentType,
        @Param("businessKey") String businessKey
    );

    int insert(JsonbDocumentRecord document);

    int replacePayload(
        @Param("tenantId") UUID tenantId,
        @Param("documentId") UUID documentId,
        @Param("expectedVersion") long expectedVersion,
        @Param("newPayloadJson") String newPayloadJson,
        @Param("schemaVersion") int schemaVersion,
        @Param("actor") String actor
    );
}
```

MyBatis XML:

```xml
<select id="findById" resultMap="DocumentResultMap">
    SELECT
        document_id,
        tenant_id,
        document_type,
        business_key,
        status,
        schema_version,
        version,
        payload::text AS payload_json,
        created_at,
        updated_at
    FROM app_document
    WHERE tenant_id = #{tenantId}
      AND document_id = #{documentId}
      AND status <> 'DELETED'
</select>
```

---

## 24. Data Lifecycle

Document table biasanya tumbuh cepat. Pikirkan lifecycle sejak awal.

| Lifecycle need | Pattern |
|---|---|
| Draft cleanup | Delete/archive draft lama |
| Active document | Keep indexed |
| Archived document | Partial index exclude archived |
| Regulatory retention | Archive table / partition |
| Large payload retention | Move full payload to cold storage, keep metadata |
| Audit retention | Separate retention policy |
| Schema migration | Backfill by document_type + schema_version |

Contoh archive status:

```sql
UPDATE app_document
SET
    status = 'ARCHIVED',
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND status IN ('APPROVED', 'REJECTED')
  AND version = :expectedVersion;
```

---

## 25. Partitioning Consideration

Untuk document table sangat besar, pertimbangkan partitioning.

Contoh partition by created month:

```sql
CREATE TABLE app_document_partitioned (
    document_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    document_type text NOT NULL,
    business_key text NOT NULL,
    status text NOT NULL,
    schema_version integer NOT NULL,
    version bigint NOT NULL DEFAULT 0,
    payload jsonb NOT NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL,

    PRIMARY KEY (document_id, created_at)
) PARTITION BY RANGE (created_at);
```

Partitioning berguna untuk:

| Use case | Benefit |
|---|---|
| Retention by time | Drop/detach partition |
| Large archive | Pisah hot/cold |
| Maintenance | Vacuum/index per partition |
| Query by time | Partition pruning |

Tapi jangan partition terlalu cepat. Partitioning menambah operational complexity.

---

## 26. Security Pattern

Jangan simpan security boundary hanya di JSON.

Buruk:

```json
{
  "tenantId": "..."
}
```

Lebih baik:

```sql
tenant_id uuid NOT NULL
payload jsonb NOT NULL
```

Security-critical fields sebaiknya kolom biasa:

| Field | Kenapa |
|---|---|
| `tenant_id` | RLS/security boundary |
| `created_by` | Audit |
| `status` | Access/lifecycle |
| `classification` | Data access policy |
| `document_type` | Authorization routing |

Kalau memakai Row-Level Security, RLS jauh lebih mudah dan aman jika boundary ada di kolom relational.

---

## 27. Sensitive Data Pattern

Document payload sering mengandung data sensitif. Jangan sembarang simpan raw PII/secret.

| Data | Pattern |
|---|---|
| Password/API key | Jangan simpan; pakai secret manager/reference |
| Identity number | Mask/tokenize/encrypt sesuai kebijakan |
| Attachment content | Object storage, bukan JSONB |
| Large binary | Object storage/bytea khusus, bukan JSONB |
| Personal data | Redaction dan retention policy |
| Audit payload | Pertimbangkan redacted snapshot |

Contoh payload aman:

```json
{
  "applicant": {
    "name": "Budi Santoso",
    "identityNumberMasked": "3174********0001",
    "identityTokenRef": "token://identity/abc123"
  }
}
```

---

## 28. Operational Checklist

| Checklist | Status |
|---|---|
| `tenant_id` sebagai kolom | Wajib |
| `document_type` sebagai kolom | Wajib |
| `business_key` sebagai kolom | Wajib |
| `status` sebagai kolom | Wajib |
| `schema_version` sebagai kolom | Wajib |
| `version` untuk optimistic locking | Wajib |
| `payload jsonb` object | Wajib |
| Field query-heavy dipromosikan/indexed | Wajib |
| Audit mutation | Wajib untuk dokumen penting |
| Idempotency untuk create/update command | Wajib |
| JSON query whitelist | Wajib |
| No secret raw in payload | Wajib |
| EXPLAIN query utama | Wajib |
| Retention/archive strategy | Wajib |
| Compatibility reader untuk schema lama | Sangat disarankan |
| Test native PostgreSQL, bukan H2 | Wajib |

---

## 29. Failure Modes

| Failure mode | Penyebab | Mitigasi |
|---|---|---|
| JSONB jadi dumping ground | Semua field dimasukkan payload | Metadata kolom + modelling review |
| Query lambat | Field JSON sering difilter tanpa index | Expression/generated/normal column |
| Lost update | Update tanpa version | Optimistic locking |
| Schema evolution rusak | Tidak ada `schema_version` | Compatibility reader + migration |
| Payload corrupt | Validasi lemah | DTO validation + CHECK constraint |
| Audit tidak lengkap | Replace tanpa history | Audit table |
| Tenant leakage | Tenant hanya di payload | `tenant_id` kolom + RLS |
| Sensitive data leak | PII/secret raw di JSONB | Mask/token/ref |
| GIN index bloat | Index semua payload | Index berdasarkan query nyata |
| API search liar | Arbitrary JSON filter | Whitelist search contract |
| Archive lambat | Tidak ada lifecycle strategy | Status, partition, archive job |
| Retry duplicate create | Tidak ada idempotency | Idempotency key store |

---

## 30. Ringkasan Praktis

```text
PostgreSQL Document Database Pattern
│
├── Table Design
│   ├── document_id
│   ├── tenant_id
│   ├── document_type
│   ├── business_key
│   ├── status
│   ├── schema_version
│   ├── version
│   └── payload jsonb
│
├── Rule
│   ├── metadata stable = relational column
│   ├── flexible detail = jsonb payload
│   ├── query-heavy field = expression/generated/normal column
│   └── invariant field = relational column
│
├── Query
│   ├── by id
│   ├── by business key
│   ├── by type/status
│   ├── by whitelisted JSON field
│   └── JSONPath only when justified
│
├── Safety
│   ├── schema_version
│   ├── optimistic version
│   ├── audit
│   ├── idempotency
│   ├── validation
│   └── sensitive data policy
│
└── Performance
    ├── B-tree metadata index first
    ├── expression index for hot JSON field
    ├── generated column for stable extracted field
    ├── partial index for hot subset
    └── GIN only for containment/existence workload
```

---

# Status

**Seri 7/19 selesai.**

Berikutnya: **Seri 8/19 - JSON/JSONB Operators, Functions, dan JSONPath: field access, containment, existence, array/object traversal, `jsonb_set`, `jsonb_path_exists`, query pattern, dan production caveats.**

---

**Sources:**

- [Documentation: 18: 8.14. JSON Types](https://www.postgresql.org/docs/current/datatype-json.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:40:50 PM

Saya lanjut ke **Seri 8/19**, fokus pada operator/fungsi JSON/JSONB dan JSONPath. Bagian ini akan dibuat praktis: pola query, update payload, validasi path, indexing implication, dan caveat production.

# Seri 8/19 - JSON/JSONB Operators, Functions, dan JSONPath

## 1. Tujuan Seri Ini

Seri ini membahas **cara membaca, memfilter, memodifikasi, dan mengoptimalkan payload `jsonb`** di PostgreSQL document database.

Fokusnya praktis:

1. Field access: `->`, `->>`, `#>`, `#>>`
2. Containment: `@>`, `<@`
3. Existence: `?`, `?|`, `?&`
4. Array/object traversal
5. JSONPath: `jsonb_path_exists`, `jsonb_path_query`, `@?`, `@@`
6. Mutation: `jsonb_set`, `jsonb_insert`, delete operator
7. Validation query
8. Indexing implication
9. Production caveats

PostgreSQL menyediakan operator dan fungsi JSON/JSONB untuk akses field, traversal, SQL/JSON path, containment, construction, dan mutation. PostgreSQL juga mengimplementasikan SQL/JSON path expression melalui tipe `jsonpath`. Untuk document workload, `jsonb` lebih cocok daripada `json` ketika data perlu diproses dan di-index karena `jsonb` disimpan dalam format binary decomposed. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

---

## 2. Sample Table dan Sample Payload

Kita pakai table dari Seri 7.

```sql
CREATE TABLE app_document (
    document_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,
    document_type text NOT NULL,
    business_key text NOT NULL,
    status text NOT NULL,
    schema_version integer NOT NULL,
    version bigint NOT NULL DEFAULT 0,
    payload jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_app_document_business_key
        UNIQUE (tenant_id, document_type, business_key),

    CONSTRAINT ck_app_document_payload_object
        CHECK (jsonb_typeof(payload) = 'object')
);
```

Sample payload:

```json
{
  "applicant": {
    "customerId": "C001",
    "name": "Budi Santoso",
    "riskLevel": "HIGH"
  },
  "case": {
    "category": "DISPUTE",
    "priority": "HIGH",
    "amount": 1500000,
    "manualReviewRequired": true
  },
  "channel": {
    "source": "WEB",
    "submittedAt": "2026-07-15T10:15:00+07:00"
  },
  "attachments": [
    {
      "attachmentId": "att-001",
      "fileName": "evidence.pdf",
      "contentType": "application/pdf"
    },
    {
      "attachmentId": "att-002",
      "fileName": "screenshot.png",
      "contentType": "image/png"
    }
  ],
  "tags": ["fraud-risk", "priority-review"]
}
```

---

## 3. Mental Model

```text
JSONB Query Mental Model
│
├── Access
│   ├── object field as json/jsonb
│   ├── object field as text
│   ├── nested path as json/jsonb
│   └── nested path as text
│
├── Predicate
│   ├── equality on extracted text
│   ├── containment
│   ├── key existence
│   ├── array membership
│   └── JSONPath predicate
│
├── Mutation
│   ├── replace whole payload
│   ├── set nested path
│   ├── insert into array
│   ├── delete key
│   └── merge object
│
├── Indexing
│   ├── B-tree metadata first
│   ├── expression index for extracted fields
│   ├── GIN for containment/existence
│   └── generated columns for stable extracted fields
│
└── Governance
    ├── whitelist queryable paths
    ├── validate schema_version
    ├── avoid arbitrary JSONPath from client
    ├── test with EXPLAIN ANALYZE
    └── control payload size
```

---

## 4. Operator Akses Field

### 4.1 `->` Ambil Field sebagai JSON/JSONB

```sql
SELECT payload -> 'case' AS case_object
FROM app_document
WHERE document_id = :documentId;
```

Hasilnya masih JSONB object:

```json
{
  "category": "DISPUTE",
  "priority": "HIGH",
  "amount": 1500000,
  "manualReviewRequired": true
}
```

Gunakan `->` kalau hasilnya masih ingin diproses sebagai JSON/JSONB.

---

### 4.2 `->>` Ambil Field sebagai Text

```sql
SELECT payload -> 'case' ->> 'priority' AS priority
FROM app_document
WHERE document_id = :documentId;
```

Hasil:

```text
HIGH
```

Gunakan `->>` kalau mau membandingkan sebagai text, cast ke number/boolean/date, atau return scalar ke API.

---

### 4.3 `#>` Ambil Nested Path sebagai JSON/JSONB

```sql
SELECT payload #> '{case,priority}' AS priority_json
FROM app_document
WHERE document_id = :documentId;
```

Hasil:

```json
"HIGH"
```

---

### 4.4 `#>>` Ambil Nested Path sebagai Text

```sql
SELECT payload #>> '{case,priority}' AS priority_text
FROM app_document
WHERE document_id = :documentId;
```

Hasil:

```text
HIGH
```

Practical rule:

| Kebutuhan | Operator |
|---|---|
| Ambil object/array sebagai JSONB | `->` atau `#>` |
| Ambil scalar sebagai text | `->>` atau `#>>` |
| Path pendek | `->`, `->>` |
| Path dinamis/lebih panjang | `#>`, `#>>` |
| Perlu cast ke number/boolean/date | Ambil text dulu dengan `->>` / `#>>` |

---

## 5. Equality Predicate pada Field JSON

### 5.1 Filter String

```sql
SELECT document_id, business_key
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND payload -> 'case' ->> 'priority' = 'HIGH';
```

### 5.2 Filter Number

```sql
SELECT document_id, business_key
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND (payload -> 'case' ->> 'amount')::numeric >= 1000000;
```

### 5.3 Filter Boolean

```sql
SELECT document_id, business_key
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND (payload -> 'case' ->> 'manualReviewRequired')::boolean = true;
```

Production caveat: cast bisa gagal jika value tidak sesuai tipe. Karena itu, untuk field yang sering dicast, lebih aman memakai constraint, generated column, atau data validation di application layer.

---

## 6. Safe Cast Pattern

Jika data lama bisa kotor, jangan langsung cast sembarangan.

Buruk:

```sql
(payload -> 'case' ->> 'amount')::numeric >= 1000000
```

Jika ada value `"N/A"`, query bisa gagal.

Lebih defensif:

```sql
SELECT document_id, business_key
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND jsonb_typeof(payload #> '{case,amount}') = 'number'
  AND (payload #>> '{case,amount}')::numeric >= 1000000;
```

PostgreSQL menyediakan `jsonb_typeof` untuk mengetahui tipe JSONB top-level value yang diberikan, misalnya object, array, string, number, boolean, atau null. Fungsi-fungsi JSON/JSONB seperti ini tersedia di dokumentasi JSON functions and operators. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

---

## 7. Containment Operator `@>`

Containment menjawab pertanyaan:

> Apakah JSONB kiri mengandung struktur JSONB kanan?

### 7.1 Object Contains Field

```sql
SELECT document_id, business_key
FROM app_document
WHERE payload @> '{"case": {"priority": "HIGH"}}'::jsonb;
```

### 7.2 Object Contains Multiple Fields

```sql
SELECT document_id, business_key
FROM app_document
WHERE payload @> '{
  "case": {
    "category": "DISPUTE",
    "priority": "HIGH"
  }
}'::jsonb;
```

### 7.3 Array Contains Element

Jika payload:

```json
{
  "tags": ["fraud-risk", "priority-review"]
}
```

Query:

```sql
SELECT document_id, business_key
FROM app_document
WHERE payload @> '{"tags": ["fraud-risk"]}'::jsonb;
```

Containment sering lebih cocok dengan GIN index dibanding extraction equality tertentu, terutama kalau query pattern memang mencari keberadaan struktur/value dalam dokumen. PostgreSQL menyediakan operator containment dan operator class GIN untuk `jsonb`. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html?utm_source=chatgpt.com))

---

## 8. Contained-By Operator `<@`

`<@` kebalikan dari `@>`.

```sql
SELECT '{"case": {"priority": "HIGH"}}'::jsonb <@ payload
FROM app_document
WHERE document_id = :documentId;
```

Secara praktis, `@>` lebih sering dipakai di query table:

```sql
payload @> :filterJson::jsonb
```

---

## 9. Key Existence Operator

Operator existence berlaku untuk key pada object atau string element pada array.

### 9.1 `?` Key Exists

```sql
SELECT document_id
FROM app_document
WHERE payload ? 'attachments';
```

Untuk nested object:

```sql
SELECT document_id
FROM app_document
WHERE payload -> 'case' ? 'priority';
```

### 9.2 `?|` Any Key Exists

```sql
SELECT document_id
FROM app_document
WHERE payload ?| ARRAY['attachments', 'tags'];
```

Artinya minimal salah satu key ada di top-level payload.

### 9.3 `?&` All Keys Exist

```sql
SELECT document_id
FROM app_document
WHERE payload ?& ARRAY['applicant', 'case', 'channel'];
```

Artinya semua key top-level harus ada.

---

## 10. Array Access

### 10.1 Ambil Element Pertama

```sql
SELECT payload -> 'attachments' -> 0 AS first_attachment
FROM app_document
WHERE document_id = :documentId;
```

### 10.2 Ambil Field dari Element Pertama

```sql
SELECT payload -> 'attachments' -> 0 ->> 'contentType' AS first_content_type
FROM app_document
WHERE document_id = :documentId;
```

### 10.3 Expand Array dengan `jsonb_array_elements`

```sql
SELECT
    d.document_id,
    attachment ->> 'attachmentId' AS attachment_id,
    attachment ->> 'fileName' AS file_name,
    attachment ->> 'contentType' AS content_type
FROM app_document d
CROSS JOIN LATERAL jsonb_array_elements(d.payload -> 'attachments') AS attachment
WHERE d.tenant_id = :tenantId
  AND d.document_type = 'CASE_INTAKE_FORM';
```

`jsonb_array_elements` mengubah JSON array menjadi set of JSON values, berguna untuk unnested query. Fungsi set-returning JSON seperti ini tersedia di PostgreSQL JSON functions. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

---

## 11. Array Predicate: Cari Dokumen dengan PDF Attachment

### 11.1 Dengan `EXISTS` + `jsonb_array_elements`

```sql
SELECT d.document_id, d.business_key
FROM app_document d
WHERE d.tenant_id = :tenantId
  AND d.document_type = 'CASE_INTAKE_FORM'
  AND EXISTS (
      SELECT 1
      FROM jsonb_array_elements(d.payload -> 'attachments') AS attachment
      WHERE attachment ->> 'contentType' = 'application/pdf'
  );
```

### 11.2 Dengan Containment

```sql
SELECT document_id, business_key
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND payload @> '{
    "attachments": [
      {
        "contentType": "application/pdf"
      }
    ]
  }'::jsonb;
```

Practical decision:

| Approach | Cocok untuk |
|---|---|
| `EXISTS + jsonb_array_elements` | Query eksplisit, transform/reporting, logic kompleks |
| `@>` containment | Predicate sederhana, bisa terbantu GIN |
| JSONPath | Predicate nested lebih ekspresif |
| Generated/projection table | Array query sering dan berat |

---

## 12. JSONPath

JSONPath berguna untuk predicate nested yang lebih ekspresif.

### 12.1 `jsonb_path_exists`

```sql
SELECT document_id, business_key
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND jsonb_path_exists(
      payload,
      '$.attachments[*] ? (@.contentType == "application/pdf")'
  );
```

### 12.2 `jsonb_path_query`

Mengambil item yang match:

```sql
SELECT
    document_id,
    jsonb_path_query(
        payload,
        '$.attachments[*] ? (@.contentType == "application/pdf")'
    ) AS pdf_attachment
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM';
```

### 12.3 `@?` JSONPath Exists Operator

```sql
SELECT document_id, business_key
FROM app_document
WHERE payload @? '$.attachments[*] ? (@.contentType == "application/pdf")';
```

### 12.4 `@@` JSONPath Predicate Operator

```sql
SELECT document_id, business_key
FROM app_document
WHERE payload @@ '$.case.amount > 1000000';
```

PostgreSQL implements SQL/JSON path expressions as the `jsonpath` data type; the docs describe JSONPath as a way to retrieve items from JSON values, similar in spirit to XPath for XML. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

---

## 13. JSONPath dengan Variables

Daripada membangun string JSONPath manual, gunakan variables.

```sql
SELECT document_id, business_key
FROM app_document
WHERE jsonb_path_exists(
    payload,
    '$.case ? (@.priority == $priority)',
    jsonb_build_object('priority', :priority)
);
```

Untuk array attachment:

```sql
SELECT document_id, business_key
FROM app_document
WHERE jsonb_path_exists(
    payload,
    '$.attachments[*] ? (@.contentType == $contentType)',
    jsonb_build_object('contentType', :contentType)
);
```

Practical rule: jangan concat raw user input ke JSONPath string.

Buruk:

```sql
jsonb_path_exists(payload, '$.case ? (@.priority == "' || :priority || '")')
```

Lebih aman:

```sql
jsonb_path_exists(
    payload,
    '$.case ? (@.priority == $priority)',
    jsonb_build_object('priority', :priority)
)
```

---

## 14. Object Construction Functions

### 14.1 `jsonb_build_object`

```sql
SELECT jsonb_build_object(
    'documentId', document_id,
    'businessKey', business_key,
    'status', status,
    'priority', payload #>> '{case,priority}'
) AS document_summary
FROM app_document
WHERE document_id = :documentId;
```

### 14.2 `jsonb_agg`

```sql
SELECT jsonb_agg(
    jsonb_build_object(
        'documentId', document_id,
        'businessKey', business_key,
        'status', status
    )
) AS documents
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM';
```

Gunakan dengan hati-hati untuk result besar. Aggregating JSON besar di database bisa memakan memory dan network payload besar.

---

## 15. Mutation: Replace Whole Payload

Ini pola paling aman untuk document update.

```sql
UPDATE app_document
SET
    payload = CAST(:newPayloadJson AS jsonb),
    schema_version = :schemaVersion,
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion
  AND status <> 'DELETED';
```

Kelebihan:

| Kelebihan | Penjelasan |
|---|---|
| Validasi mudah | DTO penuh divalidasi di Java |
| Audit mudah | old/new payload jelas |
| Conflict jelas | `version` melindungi lost update |
| Schema migration jelas | whole object bisa ditransform |

Kekurangan:

| Kekurangan | Penjelasan |
|---|---|
| Write lebih besar | Seluruh payload diganti |
| Tidak ideal untuk payload besar | Bloat/write amplification |
| Conflict lebih kasar | Dua patch field berbeda tetap conflict |

---

## 16. Mutation: `jsonb_set`

### 16.1 Update Field Sederhana

```sql
UPDATE app_document
SET
    payload = jsonb_set(
        payload,
        '{case,priority}',
        to_jsonb(:priority::text),
        true
    ),
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion;
```

### 16.2 Update Number

```sql
UPDATE app_document
SET
    payload = jsonb_set(
        payload,
        '{case,amount}',
        to_jsonb(:amount::numeric),
        true
    ),
    version = version + 1,
    updated_at = now()
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion;
```

### 16.3 Update Boolean

```sql
UPDATE app_document
SET
    payload = jsonb_set(
        payload,
        '{case,manualReviewRequired}',
        to_jsonb(:manualReviewRequired::boolean),
        true
    ),
    version = version + 1,
    updated_at = now()
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion;
```

`jsonb_set` is one of PostgreSQL’s JSONB mutation functions for returning a modified JSONB value based on a path and new value. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

---

## 17. Mutation: Insert ke Array dengan `jsonb_insert`

Contoh menambahkan attachment di awal array:

```sql
UPDATE app_document
SET
    payload = jsonb_insert(
        payload,
        '{attachments,0}',
        CAST(:attachmentJson AS jsonb),
        false
    ),
    version = version + 1,
    updated_at = now()
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion;
```

Menambahkan setelah index tertentu:

```sql
UPDATE app_document
SET
    payload = jsonb_insert(
        payload,
        '{attachments,0}',
        CAST(:attachmentJson AS jsonb),
        true
    ),
    version = version + 1,
    updated_at = now()
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion;
```

Caveat: mutation array berdasarkan index bisa rawan race/semantic bug jika beberapa actor mengedit array bersamaan. Untuk attachment penting, sering lebih baik buat table `document_attachment`.

---

## 18. Delete Key / Element

### 18.1 Delete Top-Level Key

```sql
UPDATE app_document
SET
    payload = payload - 'tags',
    version = version + 1,
    updated_at = now()
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion;
```

### 18.2 Delete Nested Path

```sql
UPDATE app_document
SET
    payload = payload #- '{case,manualReviewRequired}',
    version = version + 1,
    updated_at = now()
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion;
```

### 18.3 Delete Array Element by Index

```sql
UPDATE app_document
SET
    payload = payload #- '{attachments,0}',
    version = version + 1,
    updated_at = now()
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion;
```

Practical caveat: delete array by index mudah salah kalau urutan array berubah. Untuk data child entity yang penting, gunakan table terpisah.

---

## 19. Merge Object dengan `||`

```sql
UPDATE app_document
SET
    payload = payload || CAST(:patchJson AS jsonb),
    version = version + 1,
    updated_at = now()
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion;
```

Jika `patchJson`:

```json
{
  "case": {
    "priority": "LOW"
  }
}
```

Maka top-level key `case` bisa tertimpa sebagai object baru, bukan deep merge recursive sesuai ekspektasi domain. Jadi jangan menganggap `||` sebagai deep merge universal.

---

## 20. Validation Query dengan JSON Operators

### 20.1 Required Top-Level Keys

```sql
ALTER TABLE app_document
ADD CONSTRAINT ck_case_payload_required_keys
CHECK (
    document_type <> 'CASE_INTAKE_FORM'
    OR payload ?& ARRAY['applicant', 'case', 'channel']
);
```

### 20.2 Required Nested Key

```sql
ALTER TABLE app_document
ADD CONSTRAINT ck_case_payload_has_priority
CHECK (
    document_type <> 'CASE_INTAKE_FORM'
    OR payload -> 'case' ? 'priority'
);
```

### 20.3 Type Validation

```sql
ALTER TABLE app_document
ADD CONSTRAINT ck_case_payload_amount_number
CHECK (
    document_type <> 'CASE_INTAKE_FORM'
    OR jsonb_typeof(payload #> '{case,amount}') = 'number'
);
```

### 20.4 Allowed Enum

```sql
ALTER TABLE app_document
ADD CONSTRAINT ck_case_payload_priority_enum
CHECK (
    document_type <> 'CASE_INTAKE_FORM'
    OR payload #>> '{case,priority}' IN ('LOW', 'MEDIUM', 'HIGH')
);
```

Database constraints bagus untuk invariant minimum. Validasi domain kompleks tetap lebih baik di application layer.

---

## 21. Indexing Implication

### 21.1 Extraction Equality → Expression Index

Query:

```sql
WHERE payload #>> '{case,priority}' = 'HIGH'
```

Index:

```sql
CREATE INDEX idx_app_document_case_priority_expr
    ON app_document ((payload #>> '{case,priority}'))
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED';
```

### 21.2 Numeric Range → Expression Index dengan Cast

Query:

```sql
WHERE (payload #>> '{case,amount}')::numeric >= 1000000
```

Index:

```sql
CREATE INDEX idx_app_document_case_amount_expr
    ON app_document (((payload #>> '{case,amount}')::numeric))
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED'
      AND jsonb_typeof(payload #> '{case,amount}') = 'number';
```

### 21.3 Containment → GIN

Query:

```sql
WHERE payload @> '{"case": {"category": "DISPUTE"}}'::jsonb
```

Index:

```sql
CREATE INDEX idx_app_document_payload_gin
    ON app_document
    USING gin (payload);
```

### 21.4 Metadata First

Biasanya index metadata tetap yang paling penting:

```sql
CREATE INDEX idx_app_document_tenant_type_status_updated
    ON app_document (tenant_id, document_type, status, updated_at DESC);
```

Practical rule:

```text
Filter relational metadata dulu.
Baru filter JSON field.
Jangan berharap GIN payload menyelesaikan semua query.
```

---

## 22. `jsonb_ops` vs `jsonb_path_ops`

PostgreSQL menyediakan GIN operator class untuk `jsonb`. Default `jsonb_ops` mendukung operator lebih luas, sedangkan `jsonb_path_ops` mendukung operator lebih terbatas tetapi bisa lebih kecil/efisien untuk containment-heavy workload. Detail operator class dan JSON indexing dijelaskan dalam dokumentasi JSON types PostgreSQL. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html?utm_source=chatgpt.com))

| Operator class | Cocok untuk |
|---|---|
| `jsonb_ops` | General purpose, key existence, containment |
| `jsonb_path_ops` | Containment-heavy, workload lebih spesifik |
| Expression index | Equality/range pada path tertentu |
| Generated column | Field JSON menjadi stabil dan penting |

Contoh:

```sql
CREATE INDEX idx_app_document_payload_gin_ops
    ON app_document USING gin (payload);
```

```sql
CREATE INDEX idx_app_document_payload_gin_path_ops
    ON app_document USING gin (payload jsonb_path_ops);
```

Jangan buat dua-duanya tanpa alasan. Ukur dengan query nyata.

---

## 23. Query Governance Pattern

Jangan expose raw JSONPath dari API.

Buruk:

```http
POST /documents/search
{
  "jsonPath": "$.case.amount > 1000000"
}
```

Lebih aman:

```http
GET /case-documents?priority=HIGH&minAmount=1000000&hasPdfAttachment=true
```

Backend mapping:

```sql
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND (:priority IS NULL OR payload #>> '{case,priority}' = :priority)
  AND (:minAmount IS NULL OR (
      jsonb_typeof(payload #> '{case,amount}') = 'number'
      AND (payload #>> '{case,amount}')::numeric >= :minAmount
  ))
  AND (:hasPdfAttachment IS NULL OR jsonb_path_exists(
      payload,
      '$.attachments[*] ? (@.contentType == "application/pdf")'
  ));
```

Untuk production, lebih baik dynamic SQL berdasarkan parameter yang ada daripada `OR :param IS NULL` jika query harus memakai index secara optimal.

---

## 24. MyBatis Dynamic SQL Pattern

```xml
<select id="searchCaseDocuments" resultMap="DocumentSummaryResultMap">
    SELECT
        document_id,
        business_key,
        status,
        schema_version,
        version,
        updated_at
    FROM app_document
    WHERE tenant_id = #{tenantId}
      AND document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED'

    <if test="priority != null">
      AND payload #>> '{case,priority}' = #{priority}
    </if>

    <if test="category != null">
      AND payload #>> '{case,category}' = #{category}
    </if>

    <if test="minAmount != null">
      AND jsonb_typeof(payload #> '{case,amount}') = 'number'
      AND (payload #>> '{case,amount}')::numeric >= #{minAmount}
    </if>

    <if test="hasPdfAttachment != null and hasPdfAttachment">
      AND jsonb_path_exists(
          payload,
          '$.attachments[*] ? (@.contentType == "application/pdf")'
      )
    </if>

    ORDER BY updated_at DESC
    LIMIT #{limit}
</select>
```

Practical rule untuk MyBatis:

| Rule | Alasan |
|---|---|
| Whitelist path di XML | Mencegah arbitrary JSON query |
| Parameter value tetap bind `#{}` | Hindari injection |
| Jangan bind column/path raw dari client | Path harus controlled |
| Pakai `CAST(#{payloadJson} AS jsonb)` | Mapping eksplisit |
| Query berbeda untuk query penting | Planner lebih predictable |

---

## 25. Production Caveats

| Caveat | Penjelasan | Mitigasi |
|---|---|---|
| Cast runtime error | Value JSON tidak sesuai tipe | `jsonb_typeof`, validation, generated column |
| JSONPath terlalu bebas | Bisa mahal dan sulit di-index | Whitelist search field |
| `jsonb_set` bypass full validation | Patch nested tanpa validate semua object | Validate DTO atau validate after patch |
| Array mutation by index | Index berubah karena concurrent edit | Gunakan child table untuk entity penting |
| GIN index bloat | Payload besar/sering update | Partial/expression index, projection |
| Query plan buruk | Predicate tidak match index | `EXPLAIN (ANALYZE, BUFFERS)` |
| Deep nested query sering | JSONB bukan model optimal | Promote field atau normalisasi |
| Payload terlalu besar | Write amplification, TOAST, vacuum cost | Split document/object storage |
| Dynamic query liar | API terlalu generic | Query contract domain-specific |
| Duplicate semantics | JSON array/object semantics tidak selalu sesuai domain | Model child entity relational |

---

## 26. Practical Decision Table

| Need | Recommended pattern |
|---|---|
| Ambil nested scalar | `payload #>> '{a,b,c}'` |
| Ambil nested object | `payload #> '{a,b}'` |
| Filter scalar string | Expression equality |
| Filter scalar number | Safe cast + expression index |
| Cek field ada | `?`, `?&`, `?|` |
| Cek struktur mengandung value | `@>` |
| Cek item dalam array object | `@>` atau JSONPath |
| Query array kompleks | `jsonb_array_elements` / JSONPath |
| Update satu path | `jsonb_set` |
| Insert array item | `jsonb_insert` |
| Delete nested path | `#-` |
| Replace document | Full payload replace |
| Query sering pada path | Expression/generated column |
| Query arbitrary | Jangan expose; whitelist |

---

## 27. Cheat Sheet Singkat Operator/Fungsi

| Operator/Fungsi | Fungsi praktis | Contoh |
|---|---|---|
| `->` | Ambil field sebagai JSONB | `payload -> 'case'` |
| `->>` | Ambil field sebagai text | `payload ->> 'status'` |
| `#>` | Ambil nested path sebagai JSONB | `payload #> '{case,priority}'` |
| `#>>` | Ambil nested path sebagai text | `payload #>> '{case,priority}'` |
| `@>` | Contains | `payload @> '{"case":{"priority":"HIGH"}}'` |
| `<@` | Contained by | `'{"a":1}'::jsonb <@ payload` |
| `?` | Key/string exists | `payload ? 'case'` |
| `?|` | Any key exists | `payload ?| ARRAY['a','b']` |
| `?&` | All keys exist | `payload ?& ARRAY['case','channel']` |
| `jsonb_typeof` | Cek tipe JSONB | `jsonb_typeof(payload #> '{case,amount}')` |
| `jsonb_array_elements` | Expand array | `jsonb_array_elements(payload -> 'attachments')` |
| `jsonb_set` | Set nested value | `jsonb_set(payload, '{case,priority}', '"HIGH"')` |
| `jsonb_insert` | Insert value ke object/array | `jsonb_insert(payload, '{attachments,0}', :jsonb)` |
| `-` | Delete key/index | `payload - 'tags'` |
| `#-` | Delete nested path | `payload #- '{case,priority}'` |
| `jsonb_path_exists` | JSONPath predicate | `jsonb_path_exists(payload, '$.a ? (@ > 1)')` |
| `jsonb_path_query` | Return JSONPath matches | `jsonb_path_query(payload, '$.attachments[*]')` |
| `@?` | JSONPath exists operator | `payload @? '$.attachments[*]'` |
| `@@` | JSONPath predicate operator | `payload @@ '$.case.amount > 1000'` |
| `jsonb_build_object` | Build JSON object | `jsonb_build_object('id', document_id)` |
| `jsonb_agg` | Aggregate rows as JSON array | `jsonb_agg(jsonb_build_object(...))` |

---

## 28. End-to-End Example: Search Case Documents

### Request

```http
GET /tenants/{tenantId}/case-documents?priority=HIGH&hasPdfAttachment=true
```

### SQL

```sql
SELECT
    document_id,
    business_key,
    status,
    schema_version,
    version,
    payload #>> '{case,priority}' AS priority,
    updated_at
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND status <> 'DELETED'
  AND payload #>> '{case,priority}' = :priority
  AND jsonb_path_exists(
      payload,
      '$.attachments[*] ? (@.contentType == "application/pdf")'
  )
ORDER BY updated_at DESC
LIMIT :limit;
```

### Recommended indexes

```sql
CREATE INDEX idx_app_document_case_list
    ON app_document (tenant_id, document_type, status, updated_at DESC)
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED';

CREATE INDEX idx_app_document_case_priority
    ON app_document ((payload #>> '{case,priority}'))
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED';
```

Jika attachment PDF query sangat sering dan mahal, pertimbangkan projection/generate column/table:

```sql
CREATE TABLE app_document_attachment (
    document_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    attachment_id text NOT NULL,
    content_type text NOT NULL,
    file_name text NOT NULL,
    PRIMARY KEY (document_id, attachment_id)
);
```

---

## 29. Ringkasan Praktis

```text
JSONB Practical Query Rule
│
├── Access
│   ├── ->  for JSONB
│   ├── ->> for text
│   ├── #>  for nested JSONB path
│   └── #>> for nested text path
│
├── Predicate
│   ├── equality for known scalar path
│   ├── @> for containment
│   ├── ? ?| ?& for key existence
│   ├── JSONPath for nested/array complex predicate
│   └── safe cast for numeric/boolean/date
│
├── Mutation
│   ├── prefer full replace for critical document
│   ├── jsonb_set for controlled patch
│   ├── jsonb_insert for array/object insertion
│   ├── #- for nested delete
│   └── always use expectedVersion
│
├── Index
│   ├── B-tree metadata first
│   ├── expression index for hot path
│   ├── generated column for stable business field
│   └── GIN for containment/existence
│
└── Production
    ├── never expose arbitrary JSONPath
    ├── validate schema before casting
    ├── avoid index bloat
    ├── audit mutation
    └── verify with EXPLAIN ANALYZE
```

---

# Status

**Seri 8/19 selesai.**

Berikutnya: **Seri 9/19 - JSONB Indexing: GIN, expression index, partial index, generated column, query plan reading, dan production indexing strategy.**

---

**Sources:**

- [Documentation: 18: 9.16. JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:47:05 PM

# Seri 9/19 - JSONB Indexing: GIN, Expression Index, Partial Index, Generated Column, Query Plan

## 1. Tujuan Seri Ini

Seri ini fokus pada **strategi indexing untuk PostgreSQL `jsonb` document database**.

Target praktisnya:

1. Tahu kapan memakai **B-tree metadata index**.
2. Tahu kapan memakai **expression index** untuk field JSON tertentu.
3. Tahu kapan memakai **partial index**.
4. Tahu kapan memakai **generated column**.
5. Tahu kapan memakai **GIN index**.
6. Memahami beda praktis `jsonb_ops` vs `jsonb_path_ops`.
7. Bisa membaca `EXPLAIN (ANALYZE, BUFFERS)` untuk query JSONB.
8. Menghindari anti-pattern “semua payload JSONB langsung di-GIN”.

PostgreSQL menyediakan operator dan fungsi JSON/JSONB, serta dokumentasi resmi menyebut bahwa `jsonb` mendukung indexing dan operator class GIN seperti `jsonb_ops` dan `jsonb_path_ops`. PostgreSQL juga mendukung partial index, expression index, dan generated column, yang sering lebih tepat daripada satu GIN besar untuk semua query. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html?utm_source=chatgpt.com))

---

## 2. Mental Model

```text
JSONB Indexing Decision Model
│
├── Always start with relational metadata
│   ├── tenant_id
│   ├── document_type
│   ├── status
│   ├── business_key
│   └── updated_at / created_at
│
├── If query targets one known JSON path
│   ├── expression index
│   └── maybe generated column
│
├── If query targets active/hot subset only
│   └── partial index
│
├── If query uses containment/existence
│   ├── GIN jsonb_ops
│   └── GIN jsonb_path_ops
│
├── If field becomes business-critical
│   ├── promote to normal column
│   └── add constraint/index
│
└── Always verify
    ├── EXPLAIN
    ├── EXPLAIN ANALYZE
    ├── BUFFERS
    ├── pg_stat_statements
    └── real production-like data
```

---

## 3. Sample Table

```sql
CREATE TABLE app_document (
    document_id uuid PRIMARY KEY,

    tenant_id uuid NOT NULL,
    document_type text NOT NULL,
    business_key text NOT NULL,
    status text NOT NULL,

    schema_version integer NOT NULL,
    version bigint NOT NULL DEFAULT 0,

    payload jsonb NOT NULL,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_app_document_business_key
        UNIQUE (tenant_id, document_type, business_key),

    CONSTRAINT ck_app_document_payload_object
        CHECK (jsonb_typeof(payload) = 'object')
);
```

Sample payload:

```json
{
  "applicant": {
    "customerId": "C001",
    "riskLevel": "HIGH"
  },
  "case": {
    "category": "DISPUTE",
    "priority": "HIGH",
    "amount": 1500000,
    "manualReviewRequired": true
  },
  "channel": {
    "source": "WEB",
    "submittedAt": "2026-07-15T10:15:00+07:00"
  },
  "attachments": [
    {
      "attachmentId": "att-001",
      "contentType": "application/pdf"
    }
  ],
  "tags": ["fraud-risk", "priority-review"]
}
```

---

## 4. Rule Pertama: Index Metadata Dulu

Untuk document table, query production biasanya mulai dari:

```sql
tenant_id
document_type
status
updated_at
```

Maka index pertama sebaiknya bukan GIN JSONB, tetapi B-tree metadata.

```sql
CREATE INDEX idx_app_document_tenant_type_status_updated
    ON app_document (
        tenant_id,
        document_type,
        status,
        updated_at DESC
    );
```

Query:

```sql
SELECT
    document_id,
    business_key,
    status,
    updated_at
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND status = 'SUBMITTED'
ORDER BY updated_at DESC
LIMIT 50;
```

Kenapa ini penting?

| Alasan | Penjelasan |
|---|---|
| Tenant filter hampir selalu ada | Multi-tenant boundary |
| Document type membatasi schema | Query JSON path jadi lebih aman |
| Status membatasi lifecycle | Biasanya hanya active/submitted yang hot |
| `updated_at DESC` umum untuk listing | Query UI/API sering newest-first |
| Lebih murah dari GIN | B-tree lebih sederhana untuk metadata scalar |

Practical invariant:

```text
Jangan optimasi JSONB sebelum metadata query shape benar.
```

---

## 5. Business Key Index

Kalau business lookup sering:

```sql
SELECT *
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = :documentType
  AND business_key = :businessKey;
```

Gunakan unique constraint:

```sql
ALTER TABLE app_document
ADD CONSTRAINT uq_app_document_business_key
UNIQUE (tenant_id, document_type, business_key);
```

Atau index eksplisit jika belum menjadi constraint:

```sql
CREATE UNIQUE INDEX uq_app_document_business_key_idx
    ON app_document (tenant_id, document_type, business_key);
```

Ini jauh lebih kuat daripada mencari `businessKey` di dalam `payload`.

Buruk:

```sql
WHERE payload ->> 'businessKey' = :businessKey
```

Lebih baik:

```sql
WHERE tenant_id = :tenantId
  AND document_type = :documentType
  AND business_key = :businessKey
```

---

## 6. Expression Index untuk JSON Path Tertentu

Kalau query sering filter field JSON tertentu, gunakan expression index.

Query:

```sql
SELECT
    document_id,
    business_key
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND status = 'SUBMITTED'
  AND payload #>> '{case,priority}' = 'HIGH';
```

Index:

```sql
CREATE INDEX idx_app_document_case_priority_expr
    ON app_document ((payload #>> '{case,priority}'))
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED';
```

PostgreSQL expression index memungkinkan index column berupa function atau scalar expression, bukan hanya physical column. Ini cocok untuk extracted JSON path seperti `payload #>> '{case,priority}'`. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-expressional.html?utm_source=chatgpt.com))

---

## 7. Expression Index dengan Metadata Composite

Kadang expression index lebih baik digabung dengan metadata.

```sql
CREATE INDEX idx_app_document_case_priority_composite
    ON app_document (
        tenant_id,
        document_type,
        status,
        (payload #>> '{case,priority}'),
        updated_at DESC
    )
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED';
```

Query yang cocok:

```sql
SELECT
    document_id,
    business_key,
    updated_at
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND status = 'SUBMITTED'
  AND payload #>> '{case,priority}' = :priority
ORDER BY updated_at DESC
LIMIT :limit;
```

Ini sering lebih efektif daripada index hanya pada JSON expression, karena query production biasanya selalu punya `tenant_id`, `document_type`, dan `status`.

---

## 8. Numeric JSON Field Index

Jika amount sering dipakai range query:

```sql
SELECT
    document_id,
    business_key
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND jsonb_typeof(payload #> '{case,amount}') = 'number'
  AND (payload #>> '{case,amount}')::numeric >= 1000000;
```

Index:

```sql
CREATE INDEX idx_app_document_case_amount_numeric
    ON app_document (((payload #>> '{case,amount}')::numeric))
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED'
      AND jsonb_typeof(payload #> '{case,amount}') = 'number';
```

Caveat penting:

| Risiko | Mitigasi |
|---|---|
| Cast gagal karena value bukan number | `jsonb_typeof` constraint atau predicate |
| Planner tidak pakai index | Query predicate harus match expression/predicate index |
| Field makin penting | Promote ke generated/normal column |
| Range query besar | Pertimbangkan kolom numeric biasa |

---

## 9. Boolean JSON Field Index

Query:

```sql
SELECT document_id
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND (payload #>> '{case,manualReviewRequired}')::boolean = true;
```

Index:

```sql
CREATE INDEX idx_app_document_manual_review_required
    ON app_document (((payload #>> '{case,manualReviewRequired}')::boolean))
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status IN ('SUBMITTED', 'UNDER_REVIEW')
      AND jsonb_typeof(payload #> '{case,manualReviewRequired}') = 'boolean';
```

Namun hati-hati: index boolean sering tidak selective jika mayoritas row bernilai sama.

| Distribusi | Efektivitas index |
|---|---|
| 1% true | Bagus |
| 50% true | Sedang |
| 95% true | Mungkin buruk |
| Selalu true | Tidak berguna |

---

## 10. Partial Index

Partial index adalah index atas subset row yang ditentukan oleh predicate `WHERE`. PostgreSQL membuat partial index ketika `CREATE INDEX` memiliki klausa `WHERE`; ini berguna jika hanya sebagian data yang sering diakses. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createindex.html?utm_source=chatgpt.com))

Contoh: hanya dokumen aktif yang sering dicari.

```sql
CREATE INDEX idx_app_document_active_case
    ON app_document (
        tenant_id,
        document_type,
        updated_at DESC
    )
    WHERE status IN ('SUBMITTED', 'ACTIVE', 'UNDER_REVIEW');
```

Query:

```sql
SELECT
    document_id,
    business_key,
    status
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND status IN ('SUBMITTED', 'ACTIVE', 'UNDER_REVIEW')
ORDER BY updated_at DESC
LIMIT 100;
```

Partial index cocok jika:

| Kondisi | Contoh |
|---|---|
| Hot subset kecil | Status aktif hanya 10% data |
| Query selalu punya predicate yang sama | `status <> 'DELETED'` |
| Archive besar | Archived/deleted jarang dicari |
| Tabel tumbuh cepat | Index tidak perlu cover cold data |

---

## 11. Partial Expression Index

Gabungkan partial index + expression index.

```sql
CREATE INDEX idx_app_document_submitted_high_priority
    ON app_document (
        tenant_id,
        updated_at DESC
    )
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status = 'SUBMITTED'
      AND payload #>> '{case,priority}' = 'HIGH';
```

Query:

```sql
SELECT
    document_id,
    business_key
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND status = 'SUBMITTED'
  AND payload #>> '{case,priority}' = 'HIGH'
ORDER BY updated_at DESC
LIMIT 50;
```

Ini sangat efisien jika high priority submitted case adalah hot queue.

Tapi jangan membuat partial index terlalu banyak untuk setiap kombinasi filter.

---

## 12. Generated Column

Generated column adalah kolom yang selalu dihitung dari kolom lain; PostgreSQL mendukung generated column stored dan virtual. Stored generated column dihitung saat write dan menempati storage seperti kolom biasa, sedangkan virtual computed saat read. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-generated-columns.html?utm_source=chatgpt.com))

Contoh:

```sql
ALTER TABLE app_document
ADD COLUMN case_priority text
GENERATED ALWAYS AS (payload #>> '{case,priority}') STORED;
```

Index:

```sql
CREATE INDEX idx_app_document_case_priority_generated
    ON app_document (
        tenant_id,
        document_type,
        status,
        case_priority,
        updated_at DESC
    )
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED';
```

Query:

```sql
SELECT
    document_id,
    business_key
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND status = 'SUBMITTED'
  AND case_priority = 'HIGH'
ORDER BY updated_at DESC
LIMIT 50;
```

---

## 13. Expression Index vs Generated Column vs Normal Column

| Pilihan | Cocok jika | Kelebihan | Kekurangan |
|---|---|---|---|
| Expression index | Field JSON sering difilter tapi belum jadi domain column | Tidak ubah schema API/domain besar | Expression harus match query |
| Generated column | Field JSON stabil dan sering dipakai | Query lebih readable, bisa di-index seperti kolom | Tetap derived dari JSON, write cost |
| Normal column | Field jadi invariant/domain utama | Constraint, FK, unique, stats lebih jelas | Perlu sinkronisasi payload atau refactor |
| GIN | Containment/existence multi-key | Fleksibel untuk `@>`, `?`, JSONPath tertentu | Besar, write overhead, tidak cocok semua query |

Decision sederhana:

```text
Jarang query      → tetap di JSONB
Sering query path → expression index
Stabil & penting  → generated column
Business invariant/FK/reporting utama → normal column
Containment/existence fleksibel → GIN
```

---

## 14. GIN Index untuk JSONB

GIN cocok untuk query yang mencari keberadaan key/value di dalam composite value seperti JSONB. PostgreSQL mendokumentasikan bahwa `jsonb` GIN indexing mendukung operator class `jsonb_ops` dan `jsonb_path_ops`; perbedaannya, `jsonb_ops` membuat item index independen untuk setiap key dan value, sedangkan `jsonb_path_ops` membuat item berdasarkan value bersama path menuju value tersebut. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html?utm_source=chatgpt.com))

### 14.1 Default GIN `jsonb_ops`

```sql
CREATE INDEX idx_app_document_payload_gin_ops
    ON app_document
    USING gin (payload);
```

Query yang cocok:

```sql
SELECT document_id
FROM app_document
WHERE payload @> '{"case": {"category": "DISPUTE"}}'::jsonb;
```

Existence query:

```sql
SELECT document_id
FROM app_document
WHERE payload ? 'attachments';
```

---

## 15. GIN `jsonb_path_ops`

```sql
CREATE INDEX idx_app_document_payload_gin_path_ops
    ON app_document
    USING gin (payload jsonb_path_ops);
```

`jsonb_path_ops` tidak mendukung semua operator yang didukung default `jsonb_ops`, tetapi bisa lebih kecil dan lebih spesifik untuk containment-heavy workload. Dokumentasi PostgreSQL menyebut `jsonb_path_ops` biasanya lebih kecil dan performa search bisa lebih baik untuk operator yang didukung, tetapi tidak membuat index entry untuk struktur tanpa value seperti `{"a": {}}`, sehingga pencarian struktur semacam itu bisa buruk. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html?utm_source=chatgpt.com))

Decision:

| Workload | Pilihan |
|---|---|
| Butuh `?`, `?|`, `?&` key existence | `jsonb_ops` |
| Banyak containment `@>` pada path/value jelas | Pertimbangkan `jsonb_path_ops` |
| Query equality pada satu JSON path | Expression/generated index |
| Query array/object nested dengan containment | GIN bisa cocok |
| Query range numeric/date | B-tree expression/generated/normal column |
| Query full-text | PostgreSQL full-text / search engine, bukan GIN JSONB biasa |

---

## 16. GIN dengan Partial Predicate

Jangan GIN seluruh payload jika hanya satu document type yang butuh.

```sql
CREATE INDEX idx_app_document_case_payload_gin
    ON app_document
    USING gin (payload)
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED';
```

Atau containment-heavy:

```sql
CREATE INDEX idx_app_document_case_payload_path_gin
    ON app_document
    USING gin (payload jsonb_path_ops)
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED';
```

Ini mengurangi:

| Masalah | Dampak |
|---|---|
| Index size | Lebih kecil |
| Write overhead | Lebih rendah |
| Vacuum/maintenance cost | Lebih terkendali |
| Planning noise | Lebih spesifik ke workload |

---

## 17. GIN Bukan untuk Semua Query

Query ini kemungkinan tidak optimal hanya dengan GIN payload:

```sql
WHERE payload #>> '{case,priority}' = 'HIGH'
```

Lebih tepat:

```sql
CREATE INDEX idx_app_document_case_priority_expr
    ON app_document ((payload #>> '{case,priority}'));
```

Query ini juga bukan GIN JSONB ideal:

```sql
WHERE (payload #>> '{case,amount}')::numeric >= 1000000
```

Lebih tepat:

```sql
CREATE INDEX idx_app_document_case_amount_expr
    ON app_document (((payload #>> '{case,amount}')::numeric));
```

Rule:

```text
Equality/range pada satu path → B-tree expression/generated.
Containment/existence di dalam dokumen → GIN.
```

---

## 18. Index untuk Array Query

Query: dokumen punya attachment PDF.

```sql
SELECT document_id
FROM app_document
WHERE document_type = 'CASE_INTAKE_FORM'
  AND payload @> '{
    "attachments": [
      {
        "contentType": "application/pdf"
      }
    ]
  }'::jsonb;
```

Index:

```sql
CREATE INDEX idx_app_document_case_payload_gin
    ON app_document
    USING gin (payload)
    WHERE document_type = 'CASE_INTAKE_FORM';
```

Jika query attachment sering dan penting, lebih baik projection table:

```sql
CREATE TABLE app_document_attachment (
    document_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    attachment_id text NOT NULL,
    content_type text NOT NULL,
    file_name text NOT NULL,

    PRIMARY KEY (document_id, attachment_id)
);

CREATE INDEX idx_app_document_attachment_content_type
    ON app_document_attachment (tenant_id, content_type);
```

Decision:

| Array query | Pattern |
|---|---|
| Jarang/ad hoc | JSONB query |
| Sering/filter utama | Projection table |
| Child entity punya lifecycle | Normalisasi table |
| Butuh FK/audit per item | Normalisasi table |
| Simple containment | GIN JSONB mungkin cukup |

---

## 19. Multi-Column Index Order

Untuk B-tree composite index, urutan kolom penting.

Query:

```sql
WHERE tenant_id = ?
  AND document_type = ?
  AND status = ?
ORDER BY updated_at DESC
LIMIT 50
```

Index:

```sql
CREATE INDEX idx_app_document_listing
    ON app_document (
        tenant_id,
        document_type,
        status,
        updated_at DESC
    );
```

Jika query sering tanpa status:

```sql
WHERE tenant_id = ?
  AND document_type = ?
ORDER BY updated_at DESC
```

Index alternatif:

```sql
CREATE INDEX idx_app_document_type_listing
    ON app_document (
        tenant_id,
        document_type,
        updated_at DESC
    );
```

Jangan membuat semua kombinasi. Pilih berdasarkan query frequency.

---

## 20. Covering Index dengan `INCLUDE`

Jika listing hanya butuh beberapa kolom:

```sql
SELECT
    document_id,
    business_key,
    updated_at
FROM app_document
WHERE tenant_id = :tenantId
  AND document_type = 'CASE_INTAKE_FORM'
  AND status = 'SUBMITTED'
ORDER BY updated_at DESC
LIMIT 50;
```

Index:

```sql
CREATE INDEX idx_app_document_listing_cover
    ON app_document (
        tenant_id,
        document_type,
        status,
        updated_at DESC
    )
    INCLUDE (document_id, business_key);
```

`INCLUDE` dapat membantu index-only scan jika visibility map mendukung. Tapi jangan include `payload`; JSONB payload besar akan membuat index membengkak.

---

## 21. Query Plan Reading: EXPLAIN

Gunakan:

```sql
EXPLAIN
SELECT
    document_id,
    business_key
FROM app_document
WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
  AND document_type = 'CASE_INTAKE_FORM'
  AND status = 'SUBMITTED'
  AND payload #>> '{case,priority}' = 'HIGH'
ORDER BY updated_at DESC
LIMIT 50;
```

Untuk actual runtime:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    document_id,
    business_key
FROM app_document
WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
  AND document_type = 'CASE_INTAKE_FORM'
  AND status = 'SUBMITTED'
  AND payload #>> '{case,priority}' = 'HIGH'
ORDER BY updated_at DESC
LIMIT 50;
```

PostgreSQL `EXPLAIN` menunjukkan execution plan, dan opsi `ANALYZE` menjalankan statement untuk menampilkan actual run time/statistik. `BUFFERS` membantu melihat buffer usage, yang penting untuk membedakan CPU-bound vs I/O-heavy query. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createindex.html?utm_source=chatgpt.com))

---

## 22. Plan yang Diinginkan

Untuk query listing + priority, targetnya kira-kira:

```text
Limit
  -> Index Scan using idx_app_document_case_priority_composite
       Index Cond:
         tenant_id = ...
         document_type = ...
         status = ...
         payload_priority = ...
```

Plan yang mencurigakan:

```text
Seq Scan on app_document
  Filter:
    tenant_id = ...
    document_type = ...
    payload #>> '{case,priority}' = 'HIGH'
```

Masalah:

| Plan | Interpretasi |
|---|---|
| `Seq Scan` pada tabel besar | Index tidak cocok/tidak ada/selectivity buruk |
| `Bitmap Heap Scan` | Bisa baik untuk banyak row match |
| `Index Scan` | Baik untuk ordered/limited query |
| `Index Only Scan` | Bagus jika semua data ada di index dan visibility map mendukung |
| Banyak `Rows Removed by Filter` | Index terlalu longgar |
| Sort besar | Index tidak mendukung ORDER BY |
| Banyak shared read blocks | I/O heavy |
| Execution time jauh lebih besar dari planning | Runtime bottleneck |

---

## 23. Common Reason Index Tidak Dipakai

| Penyebab | Contoh | Solusi |
|---|---|---|
| Expression beda | Index `payload #>> '{case,priority}'`, query `payload -> 'case' ->> 'priority'` | Samakan expression |
| Predicate partial index tidak match | Index `status <> 'DELETED'`, query tidak menyebut status | Tambahkan predicate |
| Cast beda | Index numeric, query text | Samakan cast |
| Selectivity buruk | Banyak row match | Index tidak membantu; redesign |
| Statistik belum update | Setelah bulk load | `ANALYZE` |
| Parameterized generic plan | Prepared statement generic plan | Monitor/adjust query |
| GIN dipakai untuk query range | Tidak cocok | Expression/generated B-tree |
| OR terlalu kompleks | Planner sulit | Dynamic SQL per filter |
| Data terlalu kecil | Seq scan lebih murah | Tidak masalah |

---

## 24. MyBatis Query Shape: Hindari OR Parameter Pattern untuk Query Kritis

Kurang ideal:

```sql
WHERE tenant_id = #{tenantId}
  AND document_type = 'CASE_INTAKE_FORM'
  AND (#{priority} IS NULL OR payload #>> '{case,priority}' = #{priority})
  AND (#{status} IS NULL OR status = #{status})
```

Lebih baik gunakan dynamic SQL:

```xml
<select id="searchCaseDocuments" resultMap="DocumentSummaryResultMap">
    SELECT
        document_id,
        business_key,
        status,
        updated_at
    FROM app_document
    WHERE tenant_id = #{tenantId}
      AND document_type = 'CASE_INTAKE_FORM'

    <if test="status != null">
      AND status = #{status}
    </if>

    <if test="priority != null">
      AND payload #>> '{case,priority}' = #{priority}
    </if>

    ORDER BY updated_at DESC
    LIMIT #{limit}
</select>
```

Dynamic SQL memungkinkan query shape lebih dekat dengan index yang tersedia.

---

## 25. Index Governance

Setiap index harus punya “owner” dan query yang didukung.

Template review:

| Field | Isi |
|---|---|
| Index name | `idx_app_document_case_priority_composite` |
| Owner | Case service |
| Query supported | Search submitted case by priority |
| Columns/expression | `tenant_id, document_type, status, payload priority, updated_at` |
| Predicate | `document_type='CASE_INTAKE_FORM' AND status <> 'DELETED'` |
| Expected cardinality | Medium |
| Write overhead accepted? | Yes |
| Reviewed with EXPLAIN? | Yes |
| Remove if unused? | After 90 days no usage |

PostgreSQL punya banyak jenis index, tetapi index selalu membawa trade-off: storage, write overhead, vacuum/maintenance, dan planning complexity. Karena itu, jangan membuat index “untuk berjaga-jaga”.

---

## 26. Monitoring Index Usage

Query umum:

```sql
SELECT
    schemaname,
    relname AS table_name,
    indexrelname AS index_name,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE relname = 'app_document'
ORDER BY idx_scan ASC;
```

Cari index yang:

| Gejala | Makna |
|---|---|
| `idx_scan = 0` lama | Mungkin unused |
| `idx_scan` tinggi tapi query lambat | Index dipakai tapi tidak cukup selective |
| Banyak index pada table write-heavy | Insert/update bisa lambat |
| GIN besar | Storage/vacuum pressure |
| Index duplikat | Bisa dihapus setelah review |

Untuk query-level observability, biasanya gunakan `pg_stat_statements` jika tersedia.

---

## 27. Index Naming Convention

Gunakan nama yang menjelaskan table + purpose.

```text
idx_app_document_tenant_type_status_updated
idx_app_document_case_priority_expr
idx_app_document_case_amount_numeric
idx_app_document_case_payload_gin
idx_app_document_active_case_partial
```

Hindari:

```text
idx1
idx_payload
idx_json
idx_new
idx_test
```

Index name harus membantu incident analysis.

---

## 28. Migration Pattern untuk Index Besar

Untuk production table besar, gunakan concurrent index build.

```sql
CREATE INDEX CONCURRENTLY idx_app_document_case_priority_expr
    ON app_document ((payload #>> '{case,priority}'))
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED';
```

Caveat:

| Hal | Catatan |
|---|---|
| `CREATE INDEX CONCURRENTLY` | Mengurangi blocking write |
| Tidak boleh dalam transaction block biasa | Perlu migration tool support khusus |
| Lebih lama dari normal index build | Trade-off untuk availability |
| Failure bisa meninggalkan invalid index | Perlu cleanup |
| Test di staging dengan volume mirip | Wajib |

---

## 29. Anti-Pattern JSONB Indexing

### 29.1 Langsung GIN Semua Payload

```sql
CREATE INDEX idx_app_document_payload_gin
    ON app_document
    USING gin (payload);
```

Tanpa tahu query apa yang didukung.

Risiko:

- index besar,
- insert/update lambat,
- vacuum overhead,
- tidak membantu equality/range path tertentu,
- membuat false sense of optimization.

---

### 29.2 Query Field Penting Tetap di JSONB

Buruk:

```sql
WHERE payload #>> '{applicant,customerId}' = :customerId
```

Jika customerId adalah core lookup, lebih baik:

```sql
customer_id text NOT NULL
```

dan:

```sql
CREATE INDEX idx_app_document_customer
    ON app_document (tenant_id, customer_id);
```

---

### 29.3 Terlalu Banyak Expression Index

```sql
idx_payload_field_1
idx_payload_field_2
idx_payload_field_3
...
idx_payload_field_40
```

Kalau sudah begitu, artinya dokumen sebenarnya punya schema queryable yang perlu dimodelkan.

---

### 29.4 Index Tidak Match Query

Index:

```sql
CREATE INDEX idx_priority
    ON app_document ((payload #>> '{case,priority}'));
```

Query:

```sql
WHERE lower(payload #>> '{case,priority}') = 'high'
```

Index tidak otomatis sama. Kalau perlu lower-case search:

```sql
CREATE INDEX idx_priority_lower
    ON app_document (lower(payload #>> '{case,priority}'));
```

---

## 30. Practical Indexing Decision Table

| Query pattern | Recommended index |
|---|---|
| Lookup by document ID | Primary key |
| Lookup by business key | Unique B-tree `(tenant_id, document_type, business_key)` |
| List by type/status newest | B-tree `(tenant_id, document_type, status, updated_at DESC)` |
| Search by one JSON text field | Expression index |
| Search by JSON numeric range | Expression index with cast or generated numeric column |
| Search by JSON boolean rare true | Partial expression index |
| Search active subset only | Partial index |
| Search JSON containment `@>` | GIN |
| Search JSON key existence `?` | GIN `jsonb_ops` |
| Search containment-heavy only | Consider GIN `jsonb_path_ops` |
| Field becomes business-critical | Normal column |
| Query array child often | Projection/child table |
| Query arbitrary JSON path | Redesign API |

---

## 31. Recommended Index Set per Stage

### Stage 1 - Minimal Production Start

```sql
CREATE UNIQUE INDEX uq_app_document_business_key_idx
    ON app_document (tenant_id, document_type, business_key);

CREATE INDEX idx_app_document_listing
    ON app_document (tenant_id, document_type, status, updated_at DESC);
```

### Stage 2 - Add Hot JSON Field

```sql
CREATE INDEX idx_app_document_case_priority_expr
    ON app_document ((payload #>> '{case,priority}'))
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED';
```

### Stage 3 - Optimize Specific Queue

```sql
CREATE INDEX idx_app_document_case_submitted_priority_queue
    ON app_document (
        tenant_id,
        (payload #>> '{case,priority}'),
        updated_at DESC
    )
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status = 'SUBMITTED';
```

### Stage 4 - Add GIN Only When Needed

```sql
CREATE INDEX idx_app_document_case_payload_gin
    ON app_document
    USING gin (payload)
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED';
```

### Stage 5 - Promote Stable Field

```sql
ALTER TABLE app_document
ADD COLUMN case_priority text
GENERATED ALWAYS AS (payload #>> '{case,priority}') STORED;

CREATE INDEX idx_app_document_case_priority_generated
    ON app_document (
        tenant_id,
        document_type,
        status,
        case_priority,
        updated_at DESC
    )
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED';
```

---

## 32. Production Checklist

| Checklist | Status |
|---|---|
| Metadata B-tree index exists | Wajib |
| Business key unique index exists | Wajib |
| Query-heavy JSON path identified | Wajib sebelum expression index |
| Expression index exactly matches query | Wajib |
| Partial index predicate matches query | Wajib |
| Numeric/boolean cast guarded | Wajib |
| GIN only for containment/existence workload | Wajib |
| `jsonb_ops` vs `jsonb_path_ops` chosen intentionally | Wajib |
| `EXPLAIN (ANALYZE, BUFFERS)` checked | Wajib |
| Index size monitored | Wajib |
| Write overhead accepted | Wajib |
| Unused indexes reviewed periodically | Wajib |
| Hot path query not using arbitrary JSONPath | Wajib |
| Field promoted if becoming invariant | Wajib |
| Migration for large index uses concurrent strategy | Wajib di production besar |

---

## 33. Ringkasan Praktis

```text
JSONB Indexing Rule
│
├── Start with metadata
│   ├── tenant_id
│   ├── document_type
│   ├── status
│   └── updated_at
│
├── Use expression index when
│   └── one known JSON path is queried often
│
├── Use partial index when
│   └── hot subset is much smaller than full table
│
├── Use generated column when
│   └── JSON field is stable and important
│
├── Use normal column when
│   └── field is business invariant or needs FK/unique/check
│
├── Use GIN when
│   ├── containment @>
│   ├── key existence ?
│   └── JSON structure search
│
└── Validate with
    ├── EXPLAIN ANALYZE
    ├── BUFFERS
    ├── real data volume
    └── index usage stats
```

---

# Status

**Seri 9/19 selesai.**

Berikutnya: **Seri 10/19 - Document Schema Governance: validation, versioning, generated columns, compatibility reader, migration/backfill, dan contract evolution.**

---

**Sources:**

- [Documentation: 18: 8.14. JSON Types](https://www.postgresql.org/docs/current/datatype-json.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:49:59 PM

Saya lanjut ke **Seri 10/19**, fokus pada governance dokumen JSONB: validasi, versioning, compatibility reader, generated columns, migration/backfill, dan contract evolution supaya payload tidak menjadi schema liar di production.

# Seri 10/19 - Document Schema Governance: Validation, Versioning, Generated Columns, Migration/Backfill

## 1. Tujuan Seri Ini

Seri ini membahas **governance untuk PostgreSQL document database berbasis `jsonb`**.

Masalah utama document pattern bukan apakah PostgreSQL bisa menyimpan JSONB. Bisa. Masalahnya adalah:

```text
Tanpa governance, jsonb payload cepat berubah menjadi schema liar.
```

Target praktis seri ini:

1. Menentukan mana yang divalidasi di database dan mana di aplikasi.
2. Mendesain `schema_version`.
3. Membuat compatibility reader.
4. Menggunakan `CHECK constraint` untuk invariant minimum.
5. Menggunakan generated column untuk field JSON yang stabil.
6. Membuat migration/backfill payload.
7. Menjaga contract evolution agar tidak merusak reader lama.
8. Menghindari anti-pattern “semua bebas asal JSON valid”.

PostgreSQL menyediakan fungsi JSON/JSONB seperti `jsonb_typeof`, JSONPath, operator JSON, generated columns, expression/partial indexes, serta mekanisme constraint yang bisa ditambahkan dengan `NOT VALID` lalu divalidasi kemudian. Ini berguna untuk governance payload di tabel besar. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

---

## 2. Mental Model

```text
Document Schema Governance
│
├── Contract
│   ├── document_type
│   ├── schema_version
│   ├── payload shape
│   ├── required fields
│   ├── allowed enum
│   └── compatibility rule
│
├── Validation Layers
│   ├── API DTO validation
│   ├── domain validation
│   ├── database CHECK constraint
│   ├── generated column type safety
│   └── migration validation
│
├── Evolution
│   ├── additive change
│   ├── rename field
│   ├── split field
│   ├── type change
│   ├── nested structure change
│   └── deprecation
│
├── Migration
│   ├── expand
│   ├── dual read
│   ├── dual write
│   ├── backfill
│   ├── validate
│   └── cleanup
│
└── Operations
    ├── count by schema_version
    ├── invalid payload detection
    ├── stuck old-version monitoring
    ├── index/generation review
    └── rollback plan
```

---

## 3. Governance Principle: JSONB Bukan Tanpa Schema

Walaupun payload fleksibel, setiap `document_type` tetap harus punya contract.

Contoh:

```text
document_type: CASE_INTAKE_FORM
schema_version: 1

Required:
  applicant.customerId: string
  case.category: string enum
  case.priority: string enum
  channel.source: string enum

Optional:
  attachments[]: array
  case.amount: number
  case.manualReviewRequired: boolean
```

Artinya kita tetap punya schema, hanya saja schema-nya tidak seluruhnya berada di DDL relational.

Practical split:

| Layer | Tanggung jawab |
|---|---|
| Database DDL | Invariant minimum yang tidak boleh rusak |
| Java DTO/domain | Business validation dan schema detail |
| Migration script | Transform payload lama ke payload baru |
| Read compatibility | Membaca versi lama selama transisi |
| Audit | Bukti perubahan payload dan version |
| Observability | Deteksi payload invalid dan versi lama |

---

## 4. Baseline Table dengan Governance Columns

```sql
CREATE TABLE app_document (
    document_id uuid PRIMARY KEY,

    tenant_id uuid NOT NULL,
    document_type text NOT NULL,
    business_key text NOT NULL,

    status text NOT NULL,
    schema_version integer NOT NULL,
    version bigint NOT NULL DEFAULT 0,

    payload jsonb NOT NULL,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by text NULL,
    updated_by text NULL,

    CONSTRAINT uq_app_document_business_key
        UNIQUE (tenant_id, document_type, business_key),

    CONSTRAINT ck_app_document_status
        CHECK (status IN (
            'DRAFT',
            'SUBMITTED',
            'ACTIVE',
            'UNDER_REVIEW',
            'APPROVED',
            'REJECTED',
            'ARCHIVED',
            'DELETED'
        )),

    CONSTRAINT ck_app_document_schema_version_positive
        CHECK (schema_version > 0),

    CONSTRAINT ck_app_document_payload_object
        CHECK (jsonb_typeof(payload) = 'object')
);
```

`jsonb_typeof` mengembalikan tipe top-level JSONB seperti `object`, `array`, `string`, `number`, `boolean`, atau `null`, sehingga berguna untuk constraint minimal seperti memastikan payload dokumen selalu object. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

---

## 5. Validation Layering

Jangan menaruh semua validasi di satu tempat.

```text
Request masuk
  ↓
Jersey DTO validation
  ↓
Domain validation
  ↓
Service invariant validation
  ↓
MyBatis write
  ↓
PostgreSQL CHECK constraint
  ↓
Audit / outbox
```

| Validasi | Tempat terbaik | Contoh |
|---|---|---|
| Required request body | Jersey/DTO | `payload` tidak null |
| Enum domain | Java DTO/domain | `priority IN LOW/MEDIUM/HIGH` |
| Cross-field business rule | Service/domain | `amount > 0` jika `category=DISPUTE` |
| Minimal JSON shape | DB CHECK | payload object |
| Required key tertentu | DB CHECK atau app | `payload ? 'case'` |
| Version compatibility | Java reader | `schema_version` switch |
| Security boundary | DB column + service | `tenant_id` bukan di payload |
| Performance-critical field | Generated/normal column | `case_priority` |

Rule praktis:

```text
Database constraint menjaga impossible state.
Application validation menjaga business meaning.
```

---

## 6. Database CHECK Constraint untuk JSONB

### 6.1 Required Top-Level Keys

```sql
ALTER TABLE app_document
ADD CONSTRAINT ck_case_intake_required_top_level
CHECK (
    document_type <> 'CASE_INTAKE_FORM'
    OR payload ?& ARRAY['applicant', 'case', 'channel']
);
```

### 6.2 Required Nested Key

```sql
ALTER TABLE app_document
ADD CONSTRAINT ck_case_intake_required_customer_id
CHECK (
    document_type <> 'CASE_INTAKE_FORM'
    OR payload #>> '{applicant,customerId}' IS NOT NULL
);
```

### 6.3 Type Check

```sql
ALTER TABLE app_document
ADD CONSTRAINT ck_case_intake_amount_number
CHECK (
    document_type <> 'CASE_INTAKE_FORM'
    OR payload #> '{case,amount}' IS NULL
    OR jsonb_typeof(payload #> '{case,amount}') = 'number'
);
```

### 6.4 Enum Check

```sql
ALTER TABLE app_document
ADD CONSTRAINT ck_case_intake_priority_enum
CHECK (
    document_type <> 'CASE_INTAKE_FORM'
    OR payload #>> '{case,priority}' IN ('LOW', 'MEDIUM', 'HIGH')
);
```

### 6.5 Array Type Check

```sql
ALTER TABLE app_document
ADD CONSTRAINT ck_case_intake_attachments_array
CHECK (
    document_type <> 'CASE_INTAKE_FORM'
    OR payload -> 'attachments' IS NULL
    OR jsonb_typeof(payload -> 'attachments') = 'array'
);
```

---

## 7. Tambah Constraint di Tabel Besar: `NOT VALID`

Untuk tabel besar, menambahkan constraint langsung bisa mahal karena PostgreSQL harus memvalidasi data lama. PostgreSQL mendukung `ADD table_constraint NOT VALID` untuk constraint tertentu seperti foreign key, CHECK, dan not-null, sehingga constraint berlaku untuk data baru tetapi data lama bisa divalidasi belakangan. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-altertable.html?utm_source=chatgpt.com))

### 7.1 Add Constraint tanpa Validasi Data Lama

```sql
ALTER TABLE app_document
ADD CONSTRAINT ck_case_intake_priority_enum
CHECK (
    document_type <> 'CASE_INTAKE_FORM'
    OR payload #>> '{case,priority}' IN ('LOW', 'MEDIUM', 'HIGH')
) NOT VALID;
```

### 7.2 Cari Data Lama yang Melanggar

```sql
SELECT
    document_id,
    business_key,
    payload #>> '{case,priority}' AS priority
FROM app_document
WHERE document_type = 'CASE_INTAKE_FORM'
  AND NOT (
      payload #>> '{case,priority}' IN ('LOW', 'MEDIUM', 'HIGH')
  );
```

### 7.3 Backfill / Repair

```sql
UPDATE app_document
SET
    payload = jsonb_set(
        payload,
        '{case,priority}',
        to_jsonb('MEDIUM'::text),
        true
    ),
    version = version + 1,
    updated_at = now(),
    updated_by = 'migration'
WHERE document_type = 'CASE_INTAKE_FORM'
  AND payload #>> '{case,priority}' IS NULL;
```

### 7.4 Validate Constraint

```sql
ALTER TABLE app_document
VALIDATE CONSTRAINT ck_case_intake_priority_enum;
```

Practical rule:

```text
Untuk tabel besar:
  ADD CONSTRAINT ... NOT VALID
  → repair/backfill
  → VALIDATE CONSTRAINT
```

---

## 8. Schema Versioning

`schema_version` harus naik ketika reader lama tidak bisa lagi membaca payload baru tanpa adaptasi.

### Version 1

```json
{
  "customerId": "C001",
  "priority": "HIGH",
  "category": "DISPUTE"
}
```

### Version 2

```json
{
  "applicant": {
    "customerId": "C001"
  },
  "case": {
    "priority": "HIGH",
    "category": "DISPUTE"
  }
}
```

Ini perubahan breaking karena path berubah.

| Perubahan | Perlu naik `schema_version`? |
|---|---:|
| Tambah optional field | Biasanya tidak atau minor version |
| Tambah required field | Ya |
| Rename field | Ya |
| Pindah nested path | Ya |
| Ubah type string → number | Ya |
| Ubah enum meaning | Ya |
| Hapus field yang reader lama pakai | Ya |
| Tambah metadata internal yang diabaikan reader | Tidak selalu |

---

## 9. Version Compatibility Matrix

Gunakan matrix agar tim tahu reader/writer mendukung versi apa.

| App version | Can read v1 | Can read v2 | Writes v1 | Writes v2 |
|---|---:|---:|---:|---:|
| `1.0` | Ya | Tidak | Ya | Tidak |
| `1.1` | Ya | Ya | Ya | Tidak |
| `1.2` | Ya | Ya | Tidak | Ya |
| `1.3` | Tidak | Ya | Tidak | Ya |

Safe rollout:

```text
Deploy 1.1: read v1+v2, write v1
Backfill v1 → v2
Deploy 1.2: read v1+v2, write v2
Monitor remaining v1 = 0
Deploy 1.3: read v2 only
```

Jangan deploy writer v2 sebelum semua reader yang mungkin membaca sudah compatible.

---

## 10. Compatibility Reader di Java

```java
public final class CaseIntakePayloadReader {

    private final ObjectMapper objectMapper;

    public CaseIntakePayloadReader(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public CaseIntakeDocument read(JsonbDocumentRecord record) {
        return switch (record.schemaVersion()) {
            case 1 -> readV1(record.payloadJson());
            case 2 -> readV2(record.payloadJson());
            default -> throw new UnsupportedSchemaVersionException(
                "Unsupported CASE_INTAKE_FORM schema version: "
                    + record.schemaVersion()
            );
        };
    }

    private CaseIntakeDocument readV1(String payloadJson) {
        try {
            CaseIntakePayloadV1 v1 =
                objectMapper.readValue(payloadJson, CaseIntakePayloadV1.class);

            return new CaseIntakeDocument(
                v1.customerId(),
                v1.category(),
                v1.priority(),
                List.of()
            );
        } catch (JsonProcessingException e) {
            throw new StoredDocumentCorruptionException(
                "Cannot parse CASE_INTAKE_FORM v1", e
            );
        }
    }

    private CaseIntakeDocument readV2(String payloadJson) {
        try {
            CaseIntakePayloadV2 v2 =
                objectMapper.readValue(payloadJson, CaseIntakePayloadV2.class);

            return new CaseIntakeDocument(
                v2.applicant().customerId(),
                v2.caseInfo().category(),
                v2.caseInfo().priority(),
                v2.attachments()
            );
        } catch (JsonProcessingException e) {
            throw new StoredDocumentCorruptionException(
                "Cannot parse CASE_INTAKE_FORM v2", e
            );
        }
    }
}
```

Practical invariant:

```text
Reader harus lebih tolerant daripada writer.
Writer harus lebih strict daripada reader.
```

---

## 11. DTO Versioning

### 11.1 Payload V1

```java
public record CaseIntakePayloadV1(
    String customerId,
    String category,
    String priority
) {}
```

### 11.2 Payload V2

```java
public record CaseIntakePayloadV2(
    Applicant applicant,
    CaseInfo caseInfo,
    List<Attachment> attachments
) {
    public record Applicant(String customerId) {}
    public record CaseInfo(String category, String priority) {}
    public record Attachment(String attachmentId, String fileName, String contentType) {}
}
```

### 11.3 Canonical Domain Model

```java
public record CaseIntakeDocument(
    String customerId,
    String category,
    String priority,
    List<CaseAttachment> attachments
) {}
```

Tujuannya: downstream service tidak perlu tahu payload disimpan versi berapa.

```text
payload version DTO → canonical domain model → business logic
```

---

## 12. Schema Registry Internal Sederhana

Untuk governance, buat table catalog document type.

```sql
CREATE TABLE app_document_schema_catalog (
    document_type text NOT NULL,
    schema_version integer NOT NULL,

    status text NOT NULL,
    description text NOT NULL,

    introduced_at timestamptz NOT NULL DEFAULT now(),
    deprecated_at timestamptz NULL,
    retired_at timestamptz NULL,

    owner_team text NOT NULL,

    PRIMARY KEY (document_type, schema_version),

    CONSTRAINT ck_document_schema_catalog_status
        CHECK (status IN ('ACTIVE', 'DEPRECATED', 'RETIRED'))
);
```

Seed:

```sql
INSERT INTO app_document_schema_catalog (
    document_type,
    schema_version,
    status,
    description,
    owner_team
)
VALUES
(
    'CASE_INTAKE_FORM',
    1,
    'DEPRECATED',
    'Flat customerId/category/priority payload',
    'case-platform'
),
(
    'CASE_INTAKE_FORM',
    2,
    'ACTIVE',
    'Nested applicant/case/attachments payload',
    'case-platform'
);
```

Optional FK-like validation sulit karena `(document_type, schema_version)` sudah ada di `app_document`, bisa ditambah FK:

```sql
ALTER TABLE app_document
ADD CONSTRAINT fk_app_document_schema_catalog
FOREIGN KEY (document_type, schema_version)
REFERENCES app_document_schema_catalog (document_type, schema_version);
```

Ini bagus kalau schema catalog dikelola disiplin.

---

## 13. Generated Columns untuk Governance

Generated column membantu ketika field JSON mulai stabil dan sering dipakai query/validation.

```sql
ALTER TABLE app_document
ADD COLUMN case_priority text
GENERATED ALWAYS AS (
    CASE
        WHEN document_type = 'CASE_INTAKE_FORM'
        THEN payload #>> '{case,priority}'
        ELSE NULL
    END
) STORED;
```

PostgreSQL generated column dihitung dari kolom lain; dokumentasi PostgreSQL membedakan generated column dari column default karena generated column diperbarui saat row berubah dan tidak bisa langsung ditulis manual. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-generated-columns.html?utm_source=chatgpt.com))

Index:

```sql
CREATE INDEX idx_app_document_case_priority
    ON app_document (
        tenant_id,
        document_type,
        status,
        case_priority,
        updated_at DESC
    )
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED';
```

### Kapan Generated Column Cocok?

| Cocok | Tidak cocok |
|---|---|
| Field stabil | Field sering berubah path |
| Query sering | Query jarang |
| Field punya tipe jelas | Field polymorphic |
| Field belum cukup jadi kolom normal | Field sudah invariant utama |
| Ingin index lebih readable | Payload version sangat bervariasi |

---

## 14. Generated Column untuk Numeric Field

```sql
ALTER TABLE app_document
ADD COLUMN case_amount numeric
GENERATED ALWAYS AS (
    CASE
        WHEN document_type = 'CASE_INTAKE_FORM'
         AND jsonb_typeof(payload #> '{case,amount}') = 'number'
        THEN (payload #>> '{case,amount}')::numeric
        ELSE NULL
    END
) STORED;
```

Index:

```sql
CREATE INDEX idx_app_document_case_amount
    ON app_document (tenant_id, document_type, case_amount)
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND case_amount IS NOT NULL;
```

Ini lebih aman daripada setiap query melakukan cast manual.

---

## 15. Generated Column vs Normal Column

| Aspek | Generated column | Normal column |
|---|---|---|
| Sumber data | Derived dari payload | Data utama |
| Ditulis manual | Tidak | Ya |
| Cocok untuk | Projection dari JSON | Invariant business |
| Bisa di-index | Ya | Ya |
| Bisa FK | Umumnya lebih terbatas/tergantung kasus | Lebih natural |
| Risiko mismatch payload | Rendah karena derived | Ada jika dual storage |
| Refactor domain | Lebih kecil | Lebih eksplisit |

Rule:

```text
Generated column = extracted projection.
Normal column = business fact.
```

Jika field seperti `customer_id`, `status`, `tenant_id`, `business_key` sangat penting, jadikan kolom biasa, bukan generated dari payload.

---

## 16. Contract Evolution Patterns

### 16.1 Add Optional Field

V1:

```json
{
  "case": {
    "priority": "HIGH"
  }
}
```

V2 compatible:

```json
{
  "case": {
    "priority": "HIGH",
    "riskScore": 85
  }
}
```

Biasanya tidak perlu forced migration jika reader mengabaikan unknown field.

---

### 16.2 Add Required Field

Jika field wajib baru ditambahkan:

```json
{
  "case": {
    "priority": "HIGH",
    "riskScore": 85
  }
}
```

Strategy:

```text
1. Deploy reader that handles missing riskScore
2. Backfill riskScore
3. Add CHECK constraint NOT VALID
4. Validate constraint
5. Deploy writer that requires riskScore
```

---

### 16.3 Rename Field

V1:

```json
{
  "customerId": "C001"
}
```

V2:

```json
{
  "applicant": {
    "customerId": "C001"
  }
}
```

Strategy:

```text
1. Reader supports both old and new path
2. Writer continues old path or dual-write
3. Backfill old payload
4. Switch writer to new path
5. Remove old path after safe window
```

---

### 16.4 Type Change

V1:

```json
{
  "amount": "1500000"
}
```

V2:

```json
{
  "amount": 1500000
}
```

Strategy:

```sql
UPDATE app_document
SET
    payload = jsonb_set(
        payload,
        '{amount}',
        to_jsonb((payload #>> '{amount}')::numeric),
        true
    ),
    schema_version = 2,
    version = version + 1,
    updated_at = now(),
    updated_by = 'migration'
WHERE document_type = 'PAYMENT_DOCUMENT'
  AND schema_version = 1
  AND jsonb_typeof(payload #> '{amount}') = 'string'
  AND payload #>> '{amount}' ~ '^[0-9]+(\.[0-9]+)?$';
```

---

## 17. Migration Pattern: Expand → Backfill → Validate → Cutover

```text
Step 1: Expand
  Add new reader compatibility / new column / new constraint NOT VALID

Step 2: Backfill
  Update old payload in batches

Step 3: Validate
  Count invalid rows
  Validate constraints
  Compare old/new projections

Step 4: Cutover
  Switch writer to new schema version

Step 5: Cleanup
  Remove old compatibility after safe period
  Drop old generated/index/constraint if obsolete
```

Ini lebih aman daripada big-bang migration.

---

## 18. Backfill in Batches

Jangan update jutaan dokumen dalam satu transaksi besar.

```sql
WITH picked AS (
    SELECT document_id
    FROM app_document
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND schema_version = 1
    ORDER BY created_at
    LIMIT :batchSize
    FOR UPDATE SKIP LOCKED
)
UPDATE app_document d
SET
    payload = jsonb_build_object(
        'applicant', jsonb_build_object(
            'customerId', d.payload ->> 'customerId'
        ),
        'case', jsonb_build_object(
            'category', d.payload ->> 'category',
            'priority', d.payload ->> 'priority'
        ),
        'attachments', '[]'::jsonb
    ),
    schema_version = 2,
    version = version + 1,
    updated_at = now(),
    updated_by = 'migration'
FROM picked
WHERE d.document_id = picked.document_id
RETURNING d.document_id;
```

`FOR UPDATE SKIP LOCKED` cocok untuk worker batch/queue-like processing karena row yang terkunci worker lain dilewati, tetapi PostgreSQL memperingatkan bahwa ini memberikan view data yang tidak konsisten, sehingga jangan dipakai untuk query bisnis biasa. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-altertable.html?utm_source=chatgpt.com))

---

## 19. Backfill Audit

Untuk dokumen regulatory, migration juga perlu audit.

```sql
WITH old_row AS (
    SELECT *
    FROM app_document
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND schema_version = 1
    ORDER BY created_at
    LIMIT :batchSize
    FOR UPDATE SKIP LOCKED
),
updated_row AS (
    UPDATE app_document d
    SET
        payload = jsonb_build_object(
            'applicant', jsonb_build_object(
                'customerId', old_row.payload ->> 'customerId'
            ),
            'case', jsonb_build_object(
                'category', old_row.payload ->> 'category',
                'priority', old_row.payload ->> 'priority'
            ),
            'attachments', '[]'::jsonb
        ),
        schema_version = 2,
        version = d.version + 1,
        updated_at = now(),
        updated_by = 'migration'
    FROM old_row
    WHERE d.document_id = old_row.document_id
    RETURNING d.*
)
INSERT INTO app_document_audit (
    document_id,
    tenant_id,
    document_type,
    business_key,
    old_payload,
    new_payload,
    old_version,
    new_version,
    action,
    actor,
    reason
)
SELECT
    old_row.document_id,
    old_row.tenant_id,
    old_row.document_type,
    old_row.business_key,
    old_row.payload,
    updated_row.payload,
    old_row.version,
    updated_row.version,
    'MIGRATE_SCHEMA',
    'migration',
    'Migrate CASE_INTAKE_FORM v1 to v2'
FROM old_row
JOIN updated_row
  ON updated_row.document_id = old_row.document_id;
```

---

## 20. Migration Validation Queries

### 20.1 Count by Version

```sql
SELECT
    document_type,
    schema_version,
    count(*) AS total
FROM app_document
GROUP BY document_type, schema_version
ORDER BY document_type, schema_version;
```

### 20.2 Find Invalid v2 Payload

```sql
SELECT
    document_id,
    business_key
FROM app_document
WHERE document_type = 'CASE_INTAKE_FORM'
  AND schema_version = 2
  AND NOT (
      payload ?& ARRAY['applicant', 'case', 'attachments']
      AND payload #>> '{applicant,customerId}' IS NOT NULL
      AND payload #>> '{case,category}' IS NOT NULL
      AND payload #>> '{case,priority}' IN ('LOW', 'MEDIUM', 'HIGH')
      AND jsonb_typeof(payload -> 'attachments') = 'array'
  );
```

### 20.3 Compare Old and New Projection

Jika ada shadow/generated column atau migration table:

```sql
SELECT
    document_id,
    business_key,
    payload #>> '{applicant,customerId}' AS customer_id_v2
FROM app_document
WHERE document_type = 'CASE_INTAKE_FORM'
  AND schema_version = 2
  AND payload #>> '{applicant,customerId}' IS NULL;
```

---

## 21. MyBatis Mapper untuk Migration Batch

```java
public interface DocumentMigrationMapper {

    List<UUID> migrateCaseIntakeV1ToV2(
        @Param("batchSize") int batchSize
    );

    long countByTypeAndVersion(
        @Param("documentType") String documentType,
        @Param("schemaVersion") int schemaVersion
    );
}
```

Mapper XML:

```xml
<update id="migrateCaseIntakeV1ToV2">
    WITH picked AS (
        SELECT document_id
        FROM app_document
        WHERE document_type = 'CASE_INTAKE_FORM'
          AND schema_version = 1
        ORDER BY created_at
        LIMIT #{batchSize}
        FOR UPDATE SKIP LOCKED
    )
    UPDATE app_document d
    SET
        payload = jsonb_build_object(
            'applicant', jsonb_build_object(
                'customerId', d.payload ->> 'customerId'
            ),
            'case', jsonb_build_object(
                'category', d.payload ->> 'category',
                'priority', d.payload ->> 'priority'
            ),
            'attachments', '[]'::jsonb
        ),
        schema_version = 2,
        version = version + 1,
        updated_at = now(),
        updated_by = 'migration'
    FROM picked
    WHERE d.document_id = picked.document_id
</update>
```

Catatan: untuk migration yang butuh `RETURNING`, MyBatis bisa memakai `<select>` yang menjalankan statement `UPDATE ... RETURNING`, tergantung style mapper tim.

---

## 22. Application Contract: Strict Writer, Tolerant Reader

### Strict Writer

```java
public final class CaseIntakeWriter {

    private final ObjectMapper objectMapper;

    public NewDocumentPayload toPayload(CreateCaseIntakeRequest request) {
        validateRequired(request);
        validateEnum(request.priority());
        validateBusinessRules(request);

        CaseIntakePayloadV2 payload = new CaseIntakePayloadV2(
            new CaseIntakePayloadV2.Applicant(request.customerId()),
            new CaseIntakePayloadV2.CaseInfo(request.category(), request.priority()),
            request.attachments()
        );

        return new NewDocumentPayload(2, serialize(payload));
    }
}
```

### Tolerant Reader

```java
public CaseIntakeDocument read(JsonbDocumentRecord record) {
    return switch (record.schemaVersion()) {
        case 1 -> readLegacyV1(record.payloadJson());
        case 2 -> readCurrentV2(record.payloadJson());
        default -> throw new UnsupportedSchemaVersionException(
            "Unsupported schema version " + record.schemaVersion()
        );
    };
}
```

Rule:

```text
Writer hanya menulis versi aktif.
Reader membaca versi aktif + versi lama yang belum habis masa migrasinya.
```

---

## 23. Contract Test

Buat fixture payload untuk setiap schema version.

```text
src/test/resources/document-fixtures/
  case-intake-form-v1-valid.json
  case-intake-form-v1-minimal.json
  case-intake-form-v2-valid.json
  case-intake-form-v2-invalid-missing-priority.json
```

Test:

```java
class CaseIntakePayloadReaderTest {

    @Test
    void canReadV1Payload() {
        JsonbDocumentRecord record = fixtureRecord(
            "CASE_INTAKE_FORM",
            1,
            readFixture("case-intake-form-v1-valid.json")
        );

        CaseIntakeDocument doc = reader.read(record);

        assertEquals("C001", doc.customerId());
        assertEquals("HIGH", doc.priority());
    }

    @Test
    void canReadV2Payload() {
        JsonbDocumentRecord record = fixtureRecord(
            "CASE_INTAKE_FORM",
            2,
            readFixture("case-intake-form-v2-valid.json")
        );

        CaseIntakeDocument doc = reader.read(record);

        assertEquals("C001", doc.customerId());
        assertEquals("HIGH", doc.priority());
    }
}
```

---

## 24. Constraint Test

Uji constraint pakai PostgreSQL asli, bukan H2.

Test case:

| Test | Expected |
|---|---|
| Insert payload bukan object | Rejected |
| Insert priority invalid | Rejected |
| Insert missing required key | Rejected jika constraint ada |
| Insert schema_version <= 0 | Rejected |
| Insert unknown schema catalog | Rejected jika FK catalog ada |
| Backfill v1 to v2 | Succeeded |
| Validate constraint after repair | Succeeded |

---

## 25. Observability untuk Schema Governance

Metrics:

| Metric | Makna |
|---|---|
| `document.count.by_schema_version` | Distribusi versi payload |
| `document.invalid_payload.count` | Payload melanggar validator |
| `document.migration.batch.count` | Progress backfill |
| `document.migration.failure.count` | Migration gagal |
| `document.unsupported_schema_version.count` | Reader menemukan versi tak dikenal |
| `document.generated_column_null.count` | Extracted field kosong padahal wajib |
| `document.constraint_violation.count` | Write ditolak DB |

Query monitoring:

```sql
SELECT
    document_type,
    schema_version,
    count(*) AS total
FROM app_document
GROUP BY document_type, schema_version
ORDER BY document_type, schema_version;
```

---

## 26. Failure Modes

| Failure mode | Penyebab | Mitigasi |
|---|---|---|
| Reader gagal parse payload lama | Tidak ada compatibility reader | Reader multi-version |
| Writer menulis versi baru terlalu cepat | Reader lama belum support | Expand-read-first rollout |
| Constraint gagal saat ditambahkan | Data lama kotor | `NOT VALID`, repair, validate |
| Migration terlalu besar | Update jutaan row sekali jalan | Batch + `SKIP LOCKED` |
| Audit hilang saat migration | Backfill langsung update | CTE update + audit |
| Field penting tetap di JSON | Query/constraint sulit | Generated/normal column |
| Generated column cast error | Payload kotor | Guard dengan `jsonb_typeof` |
| Schema catalog tidak dipakai | Versi liar masuk | FK catalog |
| Enum berubah tanpa governance | Meaning drift | Version + deprecation |
| Unknown fields merusak reader | Deserializer strict berlebihan | Tolerant reader untuk read side |
| Sensitive payload ikut audit penuh | Audit bocor PII | Redaction/tokenization |

---

## 27. Anti-Pattern

### 27.1 No Schema Version

```sql
CREATE TABLE app_document_bad (
    document_id uuid PRIMARY KEY,
    payload jsonb NOT NULL
);
```

Tidak ada cara aman untuk tahu payload versi berapa.

---

### 27.2 Writer Breaking Change Tanpa Reader Compatibility

```text
Deploy writer v2
Reader lain masih v1-only
Result: production parse error
```

Safe pattern:

```text
Reader compatibility dulu, writer baru belakangan.
```

---

### 27.3 Semua Validasi Hanya di Java

Masalah:

- data bisa masuk dari migration/manual SQL,
- bug service bisa melewati validator,
- multi-service writer bisa tidak konsisten.

Minimal DB constraint tetap diperlukan.

---

### 27.4 Semua Validasi Hanya di DB

Masalah:

- CHECK constraint JSONB kompleks susah dirawat,
- error message buruk,
- business rule cross-entity sulit,
- migration menjadi berat.

DB constraint harus menjaga invariant minimum, bukan seluruh domain model.

---

### 27.5 Field JSON Query-Heavy Tidak Dipromosikan

Jika query seperti ini ada di banyak endpoint:

```sql
payload #>> '{applicant,customerId}' = :customerId
```

lebih baik buat `customer_id` sebagai kolom biasa atau generated column.

---

## 28. Production Checklist

| Checklist | Status |
|---|---|
| Setiap document type punya owner | Wajib |
| Setiap document type punya active schema version | Wajib |
| `schema_version` disimpan di kolom | Wajib |
| Reader support versi lama selama transisi | Wajib |
| Writer hanya menulis active version | Wajib |
| Payload object constraint | Wajib |
| Required key/type constraint untuk invariant minimum | Disarankan |
| Constraint besar memakai `NOT VALID` dulu | Wajib untuk tabel besar |
| Backfill batch-based | Wajib |
| Migration audit untuk dokumen penting | Wajib |
| Count by schema version dimonitor | Wajib |
| Generated/normal column untuk field stabil | Disarankan |
| Contract tests per schema version | Wajib |
| Sensitive payload redaction policy | Wajib |
| Rollback/cutover plan | Wajib |

---

## 29. Ringkasan Praktis

```text
Document Schema Governance Rule
│
├── Version every breaking payload change
│
├── Validate in layers
│   ├── Java DTO/domain for business rules
│   ├── DB CHECK for impossible states
│   └── migration validation for old data
│
├── Roll out safely
│   ├── reader compatibility first
│   ├── writer switch later
│   ├── backfill in batches
│   └── cleanup after monitoring
│
├── Promote stable fields
│   ├── expression index for query path
│   ├── generated column for stable projection
│   └── normal column for business invariant
│
└── Operate continuously
    ├── count schema versions
    ├── detect invalid payload
    ├── audit migration
    ├── validate constraints
    └── monitor parse failures
```

---

# Status

**Seri 10/19 selesai.**

Berikutnya: **Seri 11/19 - Document Mutation Pattern: replace, patch, merge, audit, event/outbox, optimistic locking, conflict handling, dan regulatory-safe change history.**

---

**Sources:**

- [Documentation: 18: 9.16. JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:52:39 PM

Saya lanjut ke **Seri 11/19**, fokus pada mutation pattern dokumen JSONB: full replace, controlled patch, merge, optimistic locking, audit trail, outbox event, conflict handling, dan pola aman untuk perubahan data yang defensible.

# Seri 11/19 - Document Mutation Pattern: Replace, Patch, Merge, Audit, Outbox, Conflict Handling

## 1. Tujuan Seri Ini

Seri ini membahas cara **mengubah dokumen JSONB di PostgreSQL** secara aman untuk production system.

Fokus utamanya:

1. **Full replace** payload.
2. **Controlled patch** dengan `jsonb_set`.
3. **Array mutation** dengan `jsonb_insert`.
4. **Delete nested path**.
5. **Merge object** dan caveat-nya.
6. **Optimistic locking** dengan `version`.
7. **Status transition** yang aman.
8. **Audit trail** untuk regulatory defensibility.
9. **Outbox event** untuk cache invalidation / event-driven integration.
10. **Conflict handling** di Java/Jersey/MyBatis.

PostgreSQL menyediakan banyak fungsi/operator JSONB seperti `jsonb_set`, `jsonb_insert`, JSON path functions, dan operator delete/containment. Untuk concurrency, PostgreSQL mendukung row-level locking, transaction isolation, dan `INSERT ... ON CONFLICT`. Row-level locks di PostgreSQL memblokir writer/locker lain terhadap row yang sama, tetapi tidak memblokir pembacaan data biasa. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

---

## 2. Mental Model

```text id="6ckix0"
Document Mutation Model
│
├── Mutation Type
│   ├── create document
│   ├── replace whole payload
│   ├── patch specific path
│   ├── merge object
│   ├── append/insert array item
│   ├── remove key/path
│   └── status transition
│
├── Safety Control
│   ├── tenant_id check
│   ├── document_type check
│   ├── status check
│   ├── expectedVersion
│   ├── expectedStatus
│   ├── schema_version
│   └── validation before write
│
├── Traceability
│   ├── audit old/new payload
│   ├── audit old/new status
│   ├── actor
│   ├── reason
│   ├── correlation_id
│   └── request_id / idempotency_key
│
├── Side Effect
│   ├── outbox event
│   ├── cache invalidation
│   ├── downstream projection update
│   └── workflow/event trigger
│
└── Conflict Handling
    ├── stale version
    ├── invalid transition
    ├── already deleted
    ├── schema mismatch
    ├── duplicate business key
    └── idempotency replay
```

---

## 3. Baseline Table

```sql id="p2bi32"
CREATE TABLE app_document (
    document_id uuid PRIMARY KEY,

    tenant_id uuid NOT NULL,
    document_type text NOT NULL,
    business_key text NOT NULL,

    status text NOT NULL,
    schema_version integer NOT NULL,
    version bigint NOT NULL DEFAULT 0,

    payload jsonb NOT NULL,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by text NULL,
    updated_by text NULL,

    CONSTRAINT uq_app_document_business_key
        UNIQUE (tenant_id, document_type, business_key),

    CONSTRAINT ck_app_document_status
        CHECK (status IN (
            'DRAFT',
            'SUBMITTED',
            'ACTIVE',
            'UNDER_REVIEW',
            'APPROVED',
            'REJECTED',
            'ARCHIVED',
            'DELETED'
        )),

    CONSTRAINT ck_app_document_payload_object
        CHECK (jsonb_typeof(payload) = 'object')
);
```

Audit table:

```sql id="m3nb8a"
CREATE TABLE app_document_audit (
    audit_id bigserial PRIMARY KEY,

    document_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    document_type text NOT NULL,
    business_key text NOT NULL,

    old_status text NULL,
    new_status text NULL,

    old_schema_version integer NULL,
    new_schema_version integer NULL,

    old_payload jsonb NULL,
    new_payload jsonb NULL,

    old_version bigint NULL,
    new_version bigint NULL,

    action text NOT NULL,
    actor text NOT NULL,
    reason text NULL,
    correlation_id text NULL,

    changed_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_app_document_audit_action
        CHECK (action IN (
            'CREATE',
            'REPLACE',
            'PATCH',
            'MERGE',
            'APPEND_ARRAY_ITEM',
            'REMOVE_PATH',
            'STATUS_CHANGE',
            'ARCHIVE',
            'DELETE',
            'MIGRATE_SCHEMA'
        ))
);
```

Outbox table:

```sql id="jk8d7n"
CREATE TABLE outbox_event (
    event_id uuid PRIMARY KEY,

    aggregate_type text NOT NULL,
    aggregate_id uuid NOT NULL,
    event_type text NOT NULL,

    payload jsonb NOT NULL,

    status text NOT NULL DEFAULT 'PENDING',
    retry_count integer NOT NULL DEFAULT 0,
    available_at timestamptz NOT NULL DEFAULT now(),

    created_at timestamptz NOT NULL DEFAULT now(),
    published_at timestamptz NULL,

    CONSTRAINT ck_outbox_event_status
        CHECK (status IN ('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED'))
);
```

---

## 4. Mutation Rule Utama

```text id="8nmlv1"
Setiap mutation dokumen penting harus punya:
  tenant_id
  document_id atau business_key
  expectedVersion
  expectedStatus jika status-sensitive
  actor
  reason
  audit row
  optional outbox event
```

Jangan update dokumen seperti ini:

```sql id="63xc56"
UPDATE app_document
SET payload = CAST(:payloadJson AS jsonb)
WHERE document_id = :documentId;
```

Masalah:

| Masalah | Dampak |
|---|---|
| Tidak cek tenant | Risiko cross-tenant access |
| Tidak cek version | Lost update |
| Tidak cek status | Bisa update dokumen archived/deleted |
| Tidak audit | Tidak defensible |
| Tidak event/outbox | Cache/projection downstream stale |
| Tidak schema version | Reader bisa rusak |

---

## 5. Pattern 1 - Create Document

### 5.1 Insert Dokumen Baru

```sql id="5f9n8f"
INSERT INTO app_document (
    document_id,
    tenant_id,
    document_type,
    business_key,
    status,
    schema_version,
    payload,
    created_by,
    updated_by
)
VALUES (
    :documentId,
    :tenantId,
    :documentType,
    :businessKey,
    'DRAFT',
    :schemaVersion,
    CAST(:payloadJson AS jsonb),
    :actor,
    :actor
);
```

### 5.2 Create + Audit + Outbox dalam Satu Transaksi

```sql id="ff8dwz"
WITH inserted_document AS (
    INSERT INTO app_document (
        document_id,
        tenant_id,
        document_type,
        business_key,
        status,
        schema_version,
        payload,
        created_by,
        updated_by
    )
    VALUES (
        :documentId,
        :tenantId,
        :documentType,
        :businessKey,
        'DRAFT',
        :schemaVersion,
        CAST(:payloadJson AS jsonb),
        :actor,
        :actor
    )
    RETURNING *
),
audit_insert AS (
    INSERT INTO app_document_audit (
        document_id,
        tenant_id,
        document_type,
        business_key,
        old_status,
        new_status,
        old_schema_version,
        new_schema_version,
        old_payload,
        new_payload,
        old_version,
        new_version,
        action,
        actor,
        reason,
        correlation_id
    )
    SELECT
        document_id,
        tenant_id,
        document_type,
        business_key,
        NULL,
        status,
        NULL,
        schema_version,
        NULL,
        payload,
        NULL,
        version,
        'CREATE',
        :actor,
        :reason,
        :correlationId
    FROM inserted_document
),
outbox_insert AS (
    INSERT INTO outbox_event (
        event_id,
        aggregate_type,
        aggregate_id,
        event_type,
        payload
    )
    SELECT
        :eventId,
        'DOCUMENT',
        document_id,
        'DOCUMENT_CREATED',
        jsonb_build_object(
            'documentId', document_id,
            'tenantId', tenant_id,
            'documentType', document_type,
            'businessKey', business_key,
            'status', status,
            'version', version
        )
    FROM inserted_document
)
SELECT
    document_id,
    tenant_id,
    document_type,
    business_key,
    status,
    schema_version,
    version,
    payload::text AS payload_json
FROM inserted_document;
```

PostgreSQL supports `RETURNING` from modified rows, including values affected by defaults, triggers, and `ON CONFLICT DO UPDATE`; this is useful for mutation statements that must return the canonical row after write. ([PostgreSQL](https://www.postgresql.org/docs/current/dml-returning.html?utm_source=chatgpt.com))

---

## 6. Create Conflict: Business Key Duplicate

Karena ada constraint:

```sql id="rrehl4"
UNIQUE (tenant_id, document_type, business_key)
```

duplicate create akan gagal.

Untuk API create, ada dua pilihan:

| Pattern | Kapan cocok |
|---|---|
| Reject duplicate `409 Conflict` | Create command biasa |
| Idempotency replay | Retry-safe create dengan `Idempotency-Key` |
| `ON CONFLICT DO NOTHING` | Insert-if-absent internal |
| `ON CONFLICT DO UPDATE` | Upsert-style document, hati-hati audit |

Untuk document penting, jangan sembarang upsert. Create dan update semestinya punya semantic berbeda.

---

## 7. Pattern 2 - Full Replace Payload

Full replace adalah pola paling aman untuk dokumen penting.

```sql id="7x1x4m"
WITH old_row AS (
    SELECT *
    FROM app_document
    WHERE tenant_id = :tenantId
      AND document_id = :documentId
      AND version = :expectedVersion
      AND status <> 'DELETED'
),
updated_row AS (
    UPDATE app_document d
    SET
        payload = CAST(:newPayloadJson AS jsonb),
        schema_version = :schemaVersion,
        version = d.version + 1,
        updated_at = now(),
        updated_by = :actor
    FROM old_row old
    WHERE d.tenant_id = old.tenant_id
      AND d.document_id = old.document_id
    RETURNING d.*
),
audit_insert AS (
    INSERT INTO app_document_audit (
        document_id,
        tenant_id,
        document_type,
        business_key,
        old_status,
        new_status,
        old_schema_version,
        new_schema_version,
        old_payload,
        new_payload,
        old_version,
        new_version,
        action,
        actor,
        reason,
        correlation_id
    )
    SELECT
        old_row.document_id,
        old_row.tenant_id,
        old_row.document_type,
        old_row.business_key,
        old_row.status,
        updated_row.status,
        old_row.schema_version,
        updated_row.schema_version,
        old_row.payload,
        updated_row.payload,
        old_row.version,
        updated_row.version,
        'REPLACE',
        :actor,
        :reason,
        :correlationId
    FROM old_row
    JOIN updated_row
      ON updated_row.document_id = old_row.document_id
     AND updated_row.tenant_id = old_row.tenant_id
),
outbox_insert AS (
    INSERT INTO outbox_event (
        event_id,
        aggregate_type,
        aggregate_id,
        event_type,
        payload
    )
    SELECT
        :eventId,
        'DOCUMENT',
        updated_row.document_id,
        'DOCUMENT_REPLACED',
        jsonb_build_object(
            'documentId', updated_row.document_id,
            'tenantId', updated_row.tenant_id,
            'documentType', updated_row.document_type,
            'businessKey', updated_row.business_key,
            'oldVersion', old_row.version,
            'newVersion', updated_row.version
        )
    FROM old_row
    JOIN updated_row
      ON updated_row.document_id = old_row.document_id
     AND updated_row.tenant_id = old_row.tenant_id
)
SELECT
    document_id,
    status,
    schema_version,
    version,
    payload::text AS payload_json
FROM updated_row;
```

### Kenapa full replace sering terbaik?

| Kelebihan | Penjelasan |
|---|---|
| Validasi mudah | Java validate seluruh DTO sebelum write |
| Audit jelas | old/new payload lengkap |
| Conflict jelas | `expectedVersion` melindungi lost update |
| Schema version jelas | Payload baru punya version eksplisit |
| Regulatory friendly | Bisa membuktikan state sebelum/sesudah |

Kekurangannya:

| Kekurangan | Dampak |
|---|---|
| Write payload penuh | Lebih mahal untuk payload besar |
| Conflict kasar | Dua edit field berbeda tetap conflict |
| Audit besar | old/new payload bisa besar |
| TOAST/bloat | Perlu monitor vacuum/storage |

---

## 8. Pattern 3 - Controlled Patch dengan `jsonb_set`

`jsonb_set` mengembalikan JSONB baru dengan nilai pada path tertentu diganti/ditambahkan sesuai parameter path dan create behavior; fungsi ini bagian dari fungsi JSONB PostgreSQL. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

Contoh patch priority:

```sql id="hpld33"
WITH old_row AS (
    SELECT *
    FROM app_document
    WHERE tenant_id = :tenantId
      AND document_id = :documentId
      AND document_type = 'CASE_INTAKE_FORM'
      AND status IN ('DRAFT', 'SUBMITTED')
      AND version = :expectedVersion
),
updated_row AS (
    UPDATE app_document d
    SET
        payload = jsonb_set(
            d.payload,
            '{case,priority}',
            to_jsonb(:priority::text),
            true
        ),
        version = d.version + 1,
        updated_at = now(),
        updated_by = :actor
    FROM old_row old
    WHERE d.tenant_id = old.tenant_id
      AND d.document_id = old.document_id
    RETURNING d.*
),
audit_insert AS (
    INSERT INTO app_document_audit (
        document_id,
        tenant_id,
        document_type,
        business_key,
        old_status,
        new_status,
        old_schema_version,
        new_schema_version,
        old_payload,
        new_payload,
        old_version,
        new_version,
        action,
        actor,
        reason,
        correlation_id
    )
    SELECT
        old_row.document_id,
        old_row.tenant_id,
        old_row.document_type,
        old_row.business_key,
        old_row.status,
        updated_row.status,
        old_row.schema_version,
        updated_row.schema_version,
        old_row.payload,
        updated_row.payload,
        old_row.version,
        updated_row.version,
        'PATCH',
        :actor,
        :reason,
        :correlationId
    FROM old_row
    JOIN updated_row
      ON updated_row.document_id = old_row.document_id
)
SELECT
    document_id,
    version,
    payload::text AS payload_json
FROM updated_row;
```

### Kapan patch cocok?

| Cocok | Contoh |
|---|---|
| Field kecil dan jelas | Update `case.priority` |
| Internal service controlled | Bukan arbitrary client patch |
| Path whitelist | Hanya path tertentu |
| Validasi bisa dilakukan | Enum/range/type check jelas |
| Payload besar | Menghindari transfer full payload dari client |

### Kapan patch berbahaya?

| Berbahaya jika | Risiko |
|---|---|
| Client bebas menentukan path | Arbitrary mutation |
| Tidak validasi object penuh | Payload menjadi invalid |
| Patch array by index | Race/semantic bug |
| Tidak audit old/new | Sulit investigasi |
| Tidak expectedVersion | Lost update |

---

## 9. Controlled Patch dengan Validasi Value

Patch priority harus membatasi enum.

```sql id="53w0dp"
WITH validated_input AS (
    SELECT :priority::text AS priority
    WHERE :priority::text IN ('LOW', 'MEDIUM', 'HIGH')
),
old_row AS (
    SELECT d.*
    FROM app_document d
    JOIN validated_input vi ON true
    WHERE d.tenant_id = :tenantId
      AND d.document_id = :documentId
      AND d.document_type = 'CASE_INTAKE_FORM'
      AND d.version = :expectedVersion
      AND d.status IN ('DRAFT', 'SUBMITTED')
),
updated_row AS (
    UPDATE app_document d
    SET
        payload = jsonb_set(
            d.payload,
            '{case,priority}',
            to_jsonb((SELECT priority FROM validated_input)),
            true
        ),
        version = d.version + 1,
        updated_at = now(),
        updated_by = :actor
    FROM old_row old
    WHERE d.document_id = old.document_id
      AND d.tenant_id = old.tenant_id
    RETURNING d.*
)
SELECT document_id, version
FROM updated_row;
```

Namun validasi utama tetap sebaiknya dilakukan di Java DTO/domain agar error message lebih baik.

---

## 10. Pattern 4 - Patch Numeric / Boolean

### Numeric

```sql id="eqmhid"
UPDATE app_document
SET
    payload = jsonb_set(
        payload,
        '{case,amount}',
        to_jsonb(:amount::numeric),
        true
    ),
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion
  AND status <> 'DELETED';
```

### Boolean

```sql id="jv1mdf"
UPDATE app_document
SET
    payload = jsonb_set(
        payload,
        '{case,manualReviewRequired}',
        to_jsonb(:manualReviewRequired::boolean),
        true
    ),
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion
  AND status <> 'DELETED';
```

Practical rule:

```text id="ojt13z"
Jangan membuat angka/boolean sebagai string JSON.
Gunakan to_jsonb(:value::numeric/boolean) agar tipe JSON benar.
```

---

## 11. Pattern 5 - Merge Object dengan `||`

Top-level merge:

```sql id="jvy80x"
UPDATE app_document
SET
    payload = payload || CAST(:patchJson AS jsonb),
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion
  AND status <> 'DELETED';
```

Caveat besar:

```json id="6ad7fj"
{
  "case": {
    "priority": "LOW"
  }
}
```

Jika di-merge ke payload lama, top-level key `case` bisa mengganti object `case` lama, bukan deep merge sesuai ekspektasi business.

Contoh payload awal:

```json id="l3xir4"
{
  "case": {
    "category": "DISPUTE",
    "priority": "HIGH",
    "amount": 1500000
  }
}
```

Patch:

```json id="ppbnm3"
{
  "case": {
    "priority": "LOW"
  }
}
```

Hasil top-level merge bisa menjadi:

```json id="y8zc65"
{
  "case": {
    "priority": "LOW"
  }
}
```

Field `category` dan `amount` hilang.

### Rule

| Need | Pattern |
|---|---|
| Replace seluruh payload | Full replace |
| Update path tertentu | `jsonb_set` |
| Merge top-level config sederhana | `||` boleh |
| Deep merge domain-sensitive | Implement explicit function/app logic |
| Patch dari client | Jangan langsung `payload || patch` |

---

## 12. Pattern 6 - Append / Insert Array Item

PostgreSQL menyediakan `jsonb_insert` untuk menyisipkan JSONB value ke path tertentu, termasuk array/object position. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

Contoh append attachment di akhir array. Karena `jsonb_insert` berbasis index, append yang aman biasanya lebih mudah dengan concat array:

```sql id="y2eh8b"
UPDATE app_document
SET
    payload = jsonb_set(
        payload,
        '{attachments}',
        COALESCE(payload -> 'attachments', '[]'::jsonb)
            || jsonb_build_array(CAST(:attachmentJson AS jsonb)),
        true
    ),
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion
  AND status <> 'DELETED';
```

Insert di index tertentu:

```sql id="md5q05"
UPDATE app_document
SET
    payload = jsonb_insert(
        payload,
        '{attachments,0}',
        CAST(:attachmentJson AS jsonb),
        false
    ),
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion
  AND status <> 'DELETED';
```

### Kapan array di JSONB masih aman?

| Aman jika | Contoh |
|---|---|
| Item kecil | attachment metadata |
| Tidak punya lifecycle sendiri | tag list |
| Tidak perlu FK | simple labels |
| Tidak sering update per item | static evidence list |
| Tidak perlu query berat per item | jarang dicari |

### Kapan harus jadi child table?

| Butuh | Alasan |
|---|---|
| Attachment lifecycle | uploaded/scanned/approved/deleted |
| Audit per item | siapa tambah/hapus attachment |
| Query by content type sering | index normal lebih baik |
| FK ke object storage | relational constraint |
| Concurrency per item | hindari conflict satu payload besar |

---

## 13. Pattern 7 - Remove Path

### Delete top-level key

```sql id="p7mqos"
UPDATE app_document
SET
    payload = payload - 'tags',
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion;
```

### Delete nested path

```sql id="ig0lm1"
UPDATE app_document
SET
    payload = payload #- '{case,manualReviewRequired}',
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion;
```

### Delete array item by index

```sql id="pysb3v"
UPDATE app_document
SET
    payload = payload #- '{attachments,0}',
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion;
```

Caveat: delete array item by index rawan salah kalau urutan array berubah. Lebih aman hapus berdasarkan ID lewat rebuild array.

---

## 14. Remove Array Item by `attachmentId`

```sql id="vl73pp"
UPDATE app_document
SET
    payload = jsonb_set(
        payload,
        '{attachments}',
        COALESCE(
            (
                SELECT jsonb_agg(attachment)
                FROM jsonb_array_elements(payload -> 'attachments') AS attachment
                WHERE attachment ->> 'attachmentId' <> :attachmentId
            ),
            '[]'::jsonb
        ),
        true
    ),
    version = version + 1,
    updated_at = now(),
    updated_by = :actor
WHERE tenant_id = :tenantId
  AND document_id = :documentId
  AND version = :expectedVersion
  AND status <> 'DELETED';
```

Ini lebih aman daripada index-based delete, tetapi untuk attachment yang benar-benar penting, tetap lebih baik pakai child table.

---

## 15. Pattern 8 - Status Transition

Status transition adalah mutation yang harus mengecek expected status, bukan hanya expected version.

```sql id="b9b9lc"
WITH old_row AS (
    SELECT *
    FROM app_document
    WHERE tenant_id = :tenantId
      AND document_id = :documentId
      AND status = :expectedStatus
      AND version = :expectedVersion
),
updated_row AS (
    UPDATE app_document d
    SET
        status = :newStatus,
        version = d.version + 1,
        updated_at = now(),
        updated_by = :actor
    FROM old_row old
    WHERE d.tenant_id = old.tenant_id
      AND d.document_id = old.document_id
    RETURNING d.*
),
audit_insert AS (
    INSERT INTO app_document_audit (
        document_id,
        tenant_id,
        document_type,
        business_key,
        old_status,
        new_status,
        old_schema_version,
        new_schema_version,
        old_payload,
        new_payload,
        old_version,
        new_version,
        action,
        actor,
        reason,
        correlation_id
    )
    SELECT
        old_row.document_id,
        old_row.tenant_id,
        old_row.document_type,
        old_row.business_key,
        old_row.status,
        updated_row.status,
        old_row.schema_version,
        updated_row.schema_version,
        old_row.payload,
        updated_row.payload,
        old_row.version,
        updated_row.version,
        'STATUS_CHANGE',
        :actor,
        :reason,
        :correlationId
    FROM old_row
    JOIN updated_row
      ON updated_row.document_id = old_row.document_id
),
outbox_insert AS (
    INSERT INTO outbox_event (
        event_id,
        aggregate_type,
        aggregate_id,
        event_type,
        payload
    )
    SELECT
        :eventId,
        'DOCUMENT',
        updated_row.document_id,
        'DOCUMENT_STATUS_CHANGED',
        jsonb_build_object(
            'documentId', updated_row.document_id,
            'tenantId', updated_row.tenant_id,
            'documentType', updated_row.document_type,
            'businessKey', updated_row.business_key,
            'oldStatus', old_row.status,
            'newStatus', updated_row.status,
            'oldVersion', old_row.version,
            'newVersion', updated_row.version
        )
    FROM old_row
    JOIN updated_row
      ON updated_row.document_id = old_row.document_id
)
SELECT
    document_id,
    status,
    version
FROM updated_row;
```

### Kenapa expected status penting?

Tanpa expected status, update ini berbahaya:

```sql id="v01ga0"
UPDATE app_document
SET status = 'APPROVED'
WHERE document_id = :documentId;
```

Bisa membuat transition ilegal:

```text id="dsh4h4"
DRAFT → APPROVED
REJECTED → APPROVED
DELETED → APPROVED
```

Transition harus mengikuti state machine.

---

## 16. Transition Validation Table Opsional

Untuk domain yang transition-nya kompleks:

```sql id="69o7tf"
CREATE TABLE app_document_status_transition_rule (
    document_type text NOT NULL,
    old_status text NOT NULL,
    new_status text NOT NULL,
    allowed boolean NOT NULL DEFAULT true,

    PRIMARY KEY (document_type, old_status, new_status)
);
```

Seed:

```sql id="pzrc8i"
INSERT INTO app_document_status_transition_rule (
    document_type,
    old_status,
    new_status
)
VALUES
('CASE_INTAKE_FORM', 'DRAFT', 'SUBMITTED'),
('CASE_INTAKE_FORM', 'SUBMITTED', 'UNDER_REVIEW'),
('CASE_INTAKE_FORM', 'UNDER_REVIEW', 'APPROVED'),
('CASE_INTAKE_FORM', 'UNDER_REVIEW', 'REJECTED'),
('CASE_INTAKE_FORM', 'APPROVED', 'ARCHIVED'),
('CASE_INTAKE_FORM', 'REJECTED', 'ARCHIVED');
```

Transition SQL:

```sql id="hq114j"
WITH old_row AS (
    SELECT d.*
    FROM app_document d
    JOIN app_document_status_transition_rule r
      ON r.document_type = d.document_type
     AND r.old_status = d.status
     AND r.new_status = :newStatus
     AND r.allowed = true
    WHERE d.tenant_id = :tenantId
      AND d.document_id = :documentId
      AND d.status = :expectedStatus
      AND d.version = :expectedVersion
),
updated_row AS (
    UPDATE app_document d
    SET
        status = :newStatus,
        version = d.version + 1,
        updated_at = now(),
        updated_by = :actor
    FROM old_row old
    WHERE d.tenant_id = old.tenant_id
      AND d.document_id = old.document_id
    RETURNING d.*
)
SELECT document_id, status, version
FROM updated_row;
```

---

## 17. Optimistic Locking Pattern

Setiap mutation harus memakai:

```sql id="fjkmek"
AND version = :expectedVersion
```

Lalu:

```sql id="1m9vub"
version = version + 1
```

Interpretasi result count:

| Row count | Makna |
|---:|---|
| `1` | Mutation berhasil |
| `0` | Not found, tenant mismatch, stale version, invalid status, deleted, atau transition tidak allowed |

Di service layer, jangan langsung return generic `500`. Mapping:

| Penyebab | HTTP |
|---|---:|
| Document tidak ada | `404` |
| Version stale | `409` |
| Status tidak sesuai | `409` |
| Transition tidak allowed | `409` / `422` |
| Validation gagal | `400` |
| Tenant tidak punya akses | `404` atau `403` sesuai policy |

PostgreSQL’s transaction isolation docs explain that PostgreSQL implements standard isolation levels with MVCC behavior; optimistic version checks remain a practical explicit concurrency control pattern even when the database handles isolation. ([PostgreSQL](https://www.postgresql.org/docs/current/transaction-iso.html?utm_source=chatgpt.com))

---

## 18. Row Locking dengan `SELECT ... FOR UPDATE`

Kadang perlu membaca current row, validasi kompleks, lalu update.

```sql id="lwje92"
SELECT *
FROM app_document
WHERE tenant_id = :tenantId
  AND document_id = :documentId
FOR UPDATE;
```

Kapan dipakai:

| Cocok | Contoh |
|---|---|
| Validasi kompleks sebelum update | Banyak field/status |
| Perlu serialize mutation per dokumen | Workflow transition |
| Perlu membaca current payload lalu compute patch | Business patch |
| Multi-table update dalam transaksi | Document + child table |

Namun jangan tahan row lock saat:

| Jangan | Kenapa |
|---|---|
| Call external HTTP | Transaksi lama |
| Tunggu user input | Lock terlalu lama |
| Proses file besar | DB lock contention |
| Publish message langsung | Gunakan outbox |

Row-level locks in PostgreSQL block conflicting writers/lockers to the same row and are released at transaction end; they do not block ordinary reads, but long transactions can still create contention. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html?utm_source=chatgpt.com))

---

## 19. Audit Strategy: Full Snapshot vs Delta

### Full Snapshot Audit

| Kelebihan | Kekurangan |
|---|---|
| Mudah reconstruct state | Storage besar |
| Mudah investigasi | PII exposure risk |
| Query sederhana | Perlu retention/redaction |
| Cocok regulatory | Audit table membesar |

### Delta/Patch Audit

| Kelebihan | Kekurangan |
|---|---|
| Lebih hemat storage | Sulit reconstruct |
| Fokus perubahan | Butuh patch semantic |
| Bagus untuk UI diff | Lebih kompleks |
| Minim PII duplication | Harus simpan context cukup |

Untuk regulatory/case-management, default saya:

```text id="aejtp6"
Critical document:
  full snapshot audit + redaction policy

Large/sensitive payload:
  metadata audit + redacted old/new + object storage reference
```

---

## 20. Audit dengan Trigger: Kapan Cocok?

PostgreSQL mendukung `CREATE TRIGGER`, yaitu trigger yang terhubung ke table/view/foreign table dan memanggil function saat event tertentu terjadi. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createtrigger.html?utm_source=chatgpt.com))

Trigger audit cocok jika:

| Cocok | Alasan |
|---|---|
| Banyak writer path | Mencegah writer lupa audit |
| Mutation sederhana | Insert/update/delete generic |
| Compliance minimal | Semua perubahan tercatat |
| Legacy system | Sulit ubah semua service |

Tapi untuk domain mutation yang rich, service-level audit sering lebih baik karena bisa menyimpan:

- `reason`,
- `correlation_id`,
- `idempotency_key`,
- business action,
- command type,
- actor context,
- validation result.

Trigger tidak selalu tahu semantic business.

### Trigger audit minimal

```sql id="qfj9fb"
CREATE OR REPLACE FUNCTION audit_app_document_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO app_document_audit (
        document_id,
        tenant_id,
        document_type,
        business_key,
        old_status,
        new_status,
        old_schema_version,
        new_schema_version,
        old_payload,
        new_payload,
        old_version,
        new_version,
        action,
        actor,
        reason
    )
    VALUES (
        OLD.document_id,
        OLD.tenant_id,
        OLD.document_type,
        OLD.business_key,
        OLD.status,
        NEW.status,
        OLD.schema_version,
        NEW.schema_version,
        OLD.payload,
        NEW.payload,
        OLD.version,
        NEW.version,
        'UPDATE',
        COALESCE(NEW.updated_by, 'unknown'),
        'trigger audit'
    );

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_audit_app_document_update
AFTER UPDATE ON app_document
FOR EACH ROW
EXECUTE FUNCTION audit_app_document_update();
```

Caveat: kalau service juga insert audit, jangan double-audit tanpa desain.

---

## 21. Outbox Pattern untuk Document Mutation

Gunakan outbox kalau mutation harus memicu:

- cache invalidation,
- projection update,
- downstream notification,
- workflow trigger,
- Kafka/RabbitMQ event,
- indexing/search update.

### Insert Outbox dalam Transaksi yang Sama

```sql id="y794uv"
INSERT INTO outbox_event (
    event_id,
    aggregate_type,
    aggregate_id,
    event_type,
    payload
)
VALUES (
    :eventId,
    'DOCUMENT',
    :documentId,
    'DOCUMENT_UPDATED',
    jsonb_build_object(
        'documentId', :documentId,
        'tenantId', :tenantId,
        'documentType', :documentType,
        'businessKey', :businessKey,
        'version', :newVersion
    )
);
```

### Worker Claim

```sql id="s7ke4i"
WITH picked AS (
    SELECT event_id
    FROM outbox_event
    WHERE status = 'PENDING'
      AND available_at <= now()
    ORDER BY created_at
    LIMIT :batchSize
    FOR UPDATE SKIP LOCKED
)
UPDATE outbox_event e
SET
    status = 'PROCESSING',
    retry_count = retry_count + 1
FROM picked
WHERE e.event_id = picked.event_id
RETURNING e.*;
```

`SKIP LOCKED` is useful for queue-like multi-worker processing because locked rows are skipped, but it gives an intentionally inconsistent view and is not suitable for normal business reads. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html?utm_source=chatgpt.com))

---

## 22. Conflict Handling: Diagnose Row Count 0

Kalau mutation CTE mengembalikan zero rows, jangan cuma bilang “failed”.

Lakukan diagnostic read:

```sql id="b6w9gz"
SELECT
    document_id,
    tenant_id,
    status,
    version,
    schema_version,
    updated_at
FROM app_document
WHERE tenant_id = :tenantId
  AND document_id = :documentId;
```

Decision:

| Kondisi | Response |
|---|---|
| Tidak ada row | `404 DOCUMENT_NOT_FOUND` |
| Status `DELETED` | `404` atau `410 GONE` |
| Version beda | `409 DOCUMENT_VERSION_CONFLICT` |
| Status beda dari expected | `409 INVALID_DOCUMENT_STATE` |
| Schema version unsupported | `409/422 UNSUPPORTED_SCHEMA_VERSION` |
| Tenant mismatch | Biasanya `404` untuk avoid leakage |

---

## 23. MyBatis Mapper: Replace Payload

```java id="7cdflv"
public interface DocumentMutationMapper {

    Optional<JsonbDocumentRecord> replacePayloadWithAudit(
        @Param("tenantId") UUID tenantId,
        @Param("documentId") UUID documentId,
        @Param("expectedVersion") long expectedVersion,
        @Param("newPayloadJson") String newPayloadJson,
        @Param("schemaVersion") int schemaVersion,
        @Param("actor") String actor,
        @Param("reason") String reason,
        @Param("correlationId") String correlationId,
        @Param("eventId") UUID eventId
    );

    Optional<JsonbDocumentRecord> patchCasePriority(
        @Param("tenantId") UUID tenantId,
        @Param("documentId") UUID documentId,
        @Param("expectedVersion") long expectedVersion,
        @Param("priority") String priority,
        @Param("actor") String actor,
        @Param("reason") String reason,
        @Param("correlationId") String correlationId,
        @Param("eventId") UUID eventId
    );

    Optional<DocumentStateRecord> transitionStatus(
        @Param("tenantId") UUID tenantId,
        @Param("documentId") UUID documentId,
        @Param("expectedVersion") long expectedVersion,
        @Param("expectedStatus") String expectedStatus,
        @Param("newStatus") String newStatus,
        @Param("actor") String actor,
        @Param("reason") String reason,
        @Param("correlationId") String correlationId,
        @Param("eventId") UUID eventId
    );
}
```

Mapper XML untuk replace:

```xml id="8eb3q2"
<select id="replacePayloadWithAudit" resultMap="JsonbDocumentResultMap">
    WITH old_row AS (
        SELECT *
        FROM app_document
        WHERE tenant_id = #{tenantId}
          AND document_id = #{documentId}
          AND version = #{expectedVersion}
          AND status <> 'DELETED'
    ),
    updated_row AS (
        UPDATE app_document d
        SET
            payload = CAST(#{newPayloadJson} AS jsonb),
            schema_version = #{schemaVersion},
            version = d.version + 1,
            updated_at = now(),
            updated_by = #{actor}
        FROM old_row old
        WHERE d.tenant_id = old.tenant_id
          AND d.document_id = old.document_id
        RETURNING d.*
    ),
    audit_insert AS (
        INSERT INTO app_document_audit (
            document_id,
            tenant_id,
            document_type,
            business_key,
            old_status,
            new_status,
            old_schema_version,
            new_schema_version,
            old_payload,
            new_payload,
            old_version,
            new_version,
            action,
            actor,
            reason,
            correlation_id
        )
        SELECT
            old_row.document_id,
            old_row.tenant_id,
            old_row.document_type,
            old_row.business_key,
            old_row.status,
            updated_row.status,
            old_row.schema_version,
            updated_row.schema_version,
            old_row.payload,
            updated_row.payload,
            old_row.version,
            updated_row.version,
            'REPLACE',
            #{actor},
            #{reason},
            #{correlationId}
        FROM old_row
        JOIN updated_row
          ON updated_row.document_id = old_row.document_id
         AND updated_row.tenant_id = old_row.tenant_id
    ),
    outbox_insert AS (
        INSERT INTO outbox_event (
            event_id,
            aggregate_type,
            aggregate_id,
            event_type,
            payload
        )
        SELECT
            #{eventId},
            'DOCUMENT',
            updated_row.document_id,
            'DOCUMENT_REPLACED',
            jsonb_build_object(
                'documentId', updated_row.document_id,
                'tenantId', updated_row.tenant_id,
                'documentType', updated_row.document_type,
                'businessKey', updated_row.business_key,
                'version', updated_row.version
            )
        FROM updated_row
    )
    SELECT
        document_id,
        tenant_id,
        document_type,
        business_key,
        status,
        schema_version,
        version,
        payload::text AS payload_json,
        created_at,
        updated_at
    FROM updated_row
</select>
```

MyBatis bisa menjalankan statement `WITH ... UPDATE ... RETURNING ... SELECT` sebagai `<select>` jika hasil row ingin dipetakan.

---

## 24. MyBatis Mapper: Patch Priority

```xml id="dsqult"
<select id="patchCasePriority" resultMap="JsonbDocumentResultMap">
    WITH old_row AS (
        SELECT *
        FROM app_document
        WHERE tenant_id = #{tenantId}
          AND document_id = #{documentId}
          AND document_type = 'CASE_INTAKE_FORM'
          AND status IN ('DRAFT', 'SUBMITTED')
          AND version = #{expectedVersion}
    ),
    updated_row AS (
        UPDATE app_document d
        SET
            payload = jsonb_set(
                d.payload,
                '{case,priority}',
                to_jsonb(#{priority}::text),
                true
            ),
            version = d.version + 1,
            updated_at = now(),
            updated_by = #{actor}
        FROM old_row old
        WHERE d.tenant_id = old.tenant_id
          AND d.document_id = old.document_id
          AND #{priority} IN ('LOW', 'MEDIUM', 'HIGH')
        RETURNING d.*
    ),
    audit_insert AS (
        INSERT INTO app_document_audit (
            document_id,
            tenant_id,
            document_type,
            business_key,
            old_status,
            new_status,
            old_schema_version,
            new_schema_version,
            old_payload,
            new_payload,
            old_version,
            new_version,
            action,
            actor,
            reason,
            correlation_id
        )
        SELECT
            old_row.document_id,
            old_row.tenant_id,
            old_row.document_type,
            old_row.business_key,
            old_row.status,
            updated_row.status,
            old_row.schema_version,
            updated_row.schema_version,
            old_row.payload,
            updated_row.payload,
            old_row.version,
            updated_row.version,
            'PATCH',
            #{actor},
            #{reason},
            #{correlationId}
        FROM old_row
        JOIN updated_row
          ON updated_row.document_id = old_row.document_id
    ),
    outbox_insert AS (
        INSERT INTO outbox_event (
            event_id,
            aggregate_type,
            aggregate_id,
            event_type,
            payload
        )
        SELECT
            #{eventId},
            'DOCUMENT',
            updated_row.document_id,
            'DOCUMENT_PATCHED',
            jsonb_build_object(
                'documentId', updated_row.document_id,
                'tenantId', updated_row.tenant_id,
                'documentType', updated_row.document_type,
                'businessKey', updated_row.business_key,
                'path', 'case.priority',
                'version', updated_row.version
            )
        FROM updated_row
    )
    SELECT
        document_id,
        tenant_id,
        document_type,
        business_key,
        status,
        schema_version,
        version,
        payload::text AS payload_json,
        created_at,
        updated_at
    FROM updated_row
</select>
```

---

## 25. Java Service: Replace Payload

```java id="rbb4h3"
public final class DocumentMutationService {

    private final DocumentMutationMapper mutationMapper;
    private final DocumentQueryMapper queryMapper;
    private final ObjectMapper objectMapper;

    public JsonbDocumentView replaceCaseIntakePayload(
        UUID tenantId,
        UUID documentId,
        long expectedVersion,
        CaseIntakePayloadV2 payload,
        String actor,
        String reason,
        String correlationId
    ) {
        requireReason(reason);
        validatePayload(payload);

        String payloadJson = serialize(payload);

        Optional<JsonbDocumentRecord> updated =
            mutationMapper.replacePayloadWithAudit(
                tenantId,
                documentId,
                expectedVersion,
                payloadJson,
                2,
                actor,
                reason,
                correlationId,
                UUID.randomUUID()
            );

        if (updated.isPresent()) {
            return toView(updated.get());
        }

        throw diagnoseMutationFailure(
            tenantId,
            documentId,
            expectedVersion,
            "REPLACE"
        );
    }

    private RuntimeException diagnoseMutationFailure(
        UUID tenantId,
        UUID documentId,
        long expectedVersion,
        String action
    ) {
        Optional<DocumentStateRecord> current =
            queryMapper.findState(tenantId, documentId);

        if (current.isEmpty()) {
            return new DocumentNotFoundException(documentId);
        }

        DocumentStateRecord state = current.get();

        if ("DELETED".equals(state.status())) {
            return new DocumentGoneException(documentId);
        }

        if (state.version() != expectedVersion) {
            return new DocumentVersionConflictException(
                documentId,
                expectedVersion,
                state.version()
            );
        }

        return new InvalidDocumentStateException(
            "Document cannot be mutated by action " + action
                + " in status " + state.status()
        );
    }

    private String serialize(Object payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            throw new InvalidDocumentPayloadException("Cannot serialize payload", e);
        }
    }
}
```

---

## 26. Java Service: Controlled Patch

```java id="grrgj1"
public JsonbDocumentView patchPriority(
    UUID tenantId,
    UUID documentId,
    long expectedVersion,
    String priority,
    String actor,
    String reason,
    String correlationId
) {
    requireReason(reason);

    if (!Set.of("LOW", "MEDIUM", "HIGH").contains(priority)) {
        throw new InvalidDocumentPayloadException("Invalid priority");
    }

    Optional<JsonbDocumentRecord> updated =
        mutationMapper.patchCasePriority(
            tenantId,
            documentId,
            expectedVersion,
            priority,
            actor,
            reason,
            correlationId,
            UUID.randomUUID()
        );

    if (updated.isPresent()) {
        return toView(updated.get());
    }

    throw diagnoseMutationFailure(
        tenantId,
        documentId,
        expectedVersion,
        "PATCH_PRIORITY"
    );
}
```

Practical rule:

```text id="xwensn"
Patch service harus method-specific:
  patchPriority()
  addAttachment()
  removeAttachment()
  transitionStatus()

Jangan:
  patch(String jsonPath, Object value)
```

---

## 27. Jersey Resource Pattern

### Replace Payload

```java id="e7xww4"
@Path("/tenants/{tenantId}/documents/{documentId}")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class DocumentResource {

    private final DocumentMutationService mutationService;

    @PUT
    public Response replacePayload(
        @PathParam("tenantId") UUID tenantId,
        @PathParam("documentId") UUID documentId,
        ReplaceCaseIntakeRequest request,
        @Context SecurityContext securityContext,
        @Context HttpHeaders headers
    ) {
        String actor = securityContext.getUserPrincipal().getName();
        String correlationId = firstHeader(headers, "X-Correlation-Id");

        JsonbDocumentView updated = mutationService.replaceCaseIntakePayload(
            tenantId,
            documentId,
            request.expectedVersion(),
            request.payload(),
            actor,
            request.reason(),
            correlationId
        );

        return Response.ok(updated).build();
    }
}
```

### Patch Priority

```java id="fytfmb"
@PATCH
@Path("/case-priority")
public Response patchPriority(
    @PathParam("tenantId") UUID tenantId,
    @PathParam("documentId") UUID documentId,
    PatchPriorityRequest request,
    @Context SecurityContext securityContext,
    @Context HttpHeaders headers
) {
    String actor = securityContext.getUserPrincipal().getName();
    String correlationId = firstHeader(headers, "X-Correlation-Id");

    JsonbDocumentView updated = mutationService.patchPriority(
        tenantId,
        documentId,
        request.expectedVersion(),
        request.priority(),
        actor,
        request.reason(),
        correlationId
    );

    return Response.ok(updated).build();
}
```

Endpoint patch dibuat domain-specific, bukan arbitrary JSON Patch bebas.

---

## 28. Error Mapping

```java id="epcr70"
@Provider
public final class DocumentExceptionMapper
    implements ExceptionMapper<RuntimeException> {

    @Override
    public Response toResponse(RuntimeException e) {
        if (e instanceof DocumentNotFoundException) {
            return error(404, "DOCUMENT_NOT_FOUND", e.getMessage());
        }

        if (e instanceof DocumentGoneException) {
            return error(410, "DOCUMENT_GONE", e.getMessage());
        }

        if (e instanceof DocumentVersionConflictException) {
            return error(409, "DOCUMENT_VERSION_CONFLICT", e.getMessage());
        }

        if (e instanceof InvalidDocumentStateException) {
            return error(409, "INVALID_DOCUMENT_STATE", e.getMessage());
        }

        if (e instanceof InvalidDocumentPayloadException) {
            return error(400, "INVALID_DOCUMENT_PAYLOAD", e.getMessage());
        }

        return error(500, "INTERNAL_ERROR", "Unexpected error");
    }

    private Response error(int status, String code, String message) {
        return Response.status(status)
            .entity(Map.of(
                "code", code,
                "message", message
            ))
            .build();
    }
}
```

---

## 29. Mutation API Contract

### Replace

```http id="9a8kcw"
PUT /tenants/{tenantId}/documents/{documentId}
Content-Type: application/json
Idempotency-Key: optional-but-recommended

{
  "expectedVersion": 7,
  "reason": "Correct submitted applicant data",
  "payload": {
    "applicant": {
      "customerId": "C001"
    },
    "case": {
      "category": "DISPUTE",
      "priority": "HIGH"
    },
    "attachments": []
  }
}
```

### Patch

```http id="63zl2f"
PATCH /tenants/{tenantId}/documents/{documentId}/case-priority
Content-Type: application/json

{
  "expectedVersion": 7,
  "priority": "MEDIUM",
  "reason": "Priority adjusted after supervisor review"
}
```

### Transition

```http id="xnum1u"
POST /tenants/{tenantId}/documents/{documentId}/transitions
Content-Type: application/json
Idempotency-Key: required

{
  "expectedVersion": 8,
  "expectedStatus": "SUBMITTED",
  "newStatus": "UNDER_REVIEW",
  "reason": "Start manual review"
}
```

---

## 30. Idempotency Integration

Untuk unsafe command, terutama `POST transition` dan external-triggered mutation, gunakan idempotency key dari Seri 5.

```text id="x4u9mo"
BEGIN
  acquire idempotency key
  validate request hash
  mutate document with expectedVersion
  insert audit
  insert outbox
  mark idempotency succeeded
COMMIT
```

Kalau client retry setelah timeout, service bisa return result yang sama tanpa double mutation.

`INSERT ... ON CONFLICT` gives an alternative action for unique/exclusion conflicts and is the common PostgreSQL primitive for idempotency-key acquire. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-insert.html?utm_source=chatgpt.com))

---

## 31. Transaction Boundary

Untuk mutation dokumen penting:

```text id="7q4g6w"
Single DB transaction:
  1. acquire idempotency key if needed
  2. read/validate current row if needed
  3. update app_document
  4. insert app_document_audit
  5. insert outbox_event
  6. mark idempotency success
```

Jangan:

```text id="dkfqgc"
BEGIN
  update document
COMMIT

then:
  insert audit
  publish event
```

Karena jika proses crash setelah commit update sebelum audit/event, state menjadi tidak defensible dan downstream stale.

---

## 32. External Side Effect Rule

Jangan call external HTTP/service di tengah transaksi dokumen.

Buruk:

```text id="u682bd"
BEGIN
  update document
  call external system
  insert audit
COMMIT
```

Lebih baik:

```text id="av9lvi"
BEGIN
  update document
  insert audit
  insert outbox event
COMMIT

Async worker:
  publish/call external system
```

PostgreSQL docs warn locks can block conflicting operations; long-running transactions increase contention risk. Keep DB transactions short and use outbox for external side effects. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html?utm_source=chatgpt.com))

---

## 33. Testing Strategy

### Unit Test

| Test | Expected |
|---|---|
| Replace validates payload | invalid rejected before DB |
| Patch priority validates enum | invalid rejected |
| Missing reason rejected | bad request |
| Stale version maps to conflict | `409` |
| Deleted document maps to gone/not found | `410/404` |
| Invalid status transition rejected | `409/422` |
| Unsupported schema version rejected | clear error |

### Integration Test dengan PostgreSQL Asli

| Test | Expected |
|---|---|
| Replace updates payload and increments version | success |
| Replace inserts audit row | audit exists |
| Replace inserts outbox event | outbox exists |
| Patch updates only intended field | other fields unchanged |
| Patch stale version returns no row | service maps conflict |
| Transition expected status mismatch fails | no update |
| Two concurrent updates same version | one success, one conflict |
| JSONB invalid type rejected | DB/app validation |
| Trigger audit if enabled | audit not duplicated |

### Concurrency Test

Simulasi dua request:

```text id="zw3810"
Both read version 7
Request A updates version 7 → success version 8
Request B updates version 7 → row count 0 → 409 conflict
```

---

## 34. Observability

Log minimal untuk mutation:

```text id="o3juix"
tenant_id
document_id
document_type
business_key
action
old_status
new_status
expected_version
new_version
actor
reason_present
correlation_id
idempotency_key
db_row_count
duration_ms
```

Metrics:

| Metric | Makna |
|---|---|
| `document.mutation.count` | Volume mutation |
| `document.mutation.conflict.count` | Stale version/status conflict |
| `document.mutation.validation_error.count` | Payload invalid |
| `document.audit.insert.count` | Audit written |
| `document.outbox.insert.count` | Event created |
| `document.transition.count` | Status transition volume |
| `document.patch.count` | Patch usage |
| `document.replace.count` | Full replace usage |
| `document.mutation.duration` | Latency |

Alert:

| Alert | Kenapa |
|---|---|
| Audit insert failed | Defensibility broken |
| Outbox insert failed | Downstream stale |
| Conflict spike | UI/client stale, concurrent edit issue |
| Mutation duration high | Lock contention / JSONB write cost |
| Stored document corruption | Schema governance issue |

---

## 35. Failure Modes

| Failure mode | Penyebab | Mitigasi |
|---|---|---|
| Lost update | Tidak pakai expectedVersion | Optimistic locking |
| Illegal transition | Tidak cek expectedStatus/rule | State machine validation |
| Audit gap | Audit terpisah dari update | Same transaction / CTE |
| Event gap | Publish di luar transaction tanpa outbox | Outbox pattern |
| Duplicate mutation | Retry tanpa idempotency | Idempotency key |
| Patch liar | Client bisa set arbitrary path | Domain-specific patch endpoint |
| Payload invalid setelah patch | Tidak validate full object | DTO validation / post-patch validation |
| Array race | Delete by index | Delete by ID or child table |
| Merge kehilangan field | Pakai `||` untuk nested object | Use `jsonb_set` or explicit deep merge |
| Lock contention | Long transaction | Short transaction, no external call inside |
| Audit PII leak | Full snapshot sensitive | Redaction/tokenization |
| GIN/index bloat | JSONB sering update | Reduce indexes, normalize hot fields |

---

## 36. Anti-Pattern

### 36.1 Generic JSON Patch Endpoint

```http id="3aicf1"
PATCH /documents/{id}
{
  "path": "$.anything.anywhere",
  "value": "whatever"
}
```

Risiko:

- arbitrary mutation,
- sulit audit semantic,
- sulit validation,
- breaking schema,
- security bug.

Lebih baik:

```http id="f7aqk5"
PATCH /documents/{id}/case-priority
POST /documents/{id}/attachments
DELETE /documents/{id}/attachments/{attachmentId}
POST /documents/{id}/transitions
```

---

### 36.2 Update Tanpa Version

```sql id="tam9w4"
UPDATE app_document
SET payload = CAST(:payloadJson AS jsonb)
WHERE document_id = :documentId;
```

Ini membuka lost update.

---

### 36.3 Audit via App Log Saja

App log bukan audit table. Log bisa sampling, rotate, tidak transactional, dan sulit query state change.

---

### 36.4 Publish Event Setelah Commit Tanpa Outbox

Jika service crash setelah commit sebelum publish, event hilang.

---

### 36.5 Full Snapshot Audit Tanpa Redaction

Jika payload berisi PII/sensitive data, audit table bisa menjadi duplikasi data sensitif yang lebih sulit dikontrol.

---

## 37. Practical Decision Table

| Mutation need | Recommended pattern |
|---|---|
| Create document | Insert + audit + outbox + idempotency |
| Update entire form | Full replace + version + audit |
| Update one controlled scalar field | `jsonb_set` controlled patch |
| Update nested object complex | Validate in Java, full replace or explicit patch |
| Append simple tag | JSONB array patch |
| Manage attachment lifecycle | Child table, not JSONB array |
| Delete array item | Prefer by item ID, not index |
| Status transition | expectedStatus + expectedVersion + transition rule |
| External side effect | Outbox |
| Retry-safe command | Idempotency key |
| High regulatory defensibility | Full audit snapshot or redacted snapshot |

---

## 38. Ringkasan Praktis

```text id="ydg9wn"
Document Mutation Production Rule
│
├── Prefer full replace for critical document
│   ├── easier validation
│   ├── clearer audit
│   └── simpler schema versioning
│
├── Use patch only when controlled
│   ├── whitelisted path
│   ├── typed value
│   ├── expectedVersion
│   └── audit old/new
│
├── Protect transitions
│   ├── expectedStatus
│   ├── transition rule
│   ├── expectedVersion
│   └── reason
│
├── Keep mutation transactional
│   ├── document update
│   ├── audit insert
│   ├── outbox insert
│   └── idempotency result
│
├── Avoid external calls inside DB transaction
│   └── use outbox worker
│
└── Diagnose conflicts carefully
    ├── not found
    ├── stale version
    ├── invalid status
    ├── deleted
    └── schema mismatch
```

---

# Status

**Seri 11/19 selesai.**

Berikutnya: **Seri 12/19 - Java/Jersey/MyBatis Integration Pattern for PostgreSQL Document Database**, mencakup resource design, DTO/schema versioning, mapper XML JSONB, transaction boundary, mutation/audit/outbox, idempotency, search API whitelist, dan integration testing.

---

**Sources:**

- [Documentation: 18: 9.16. JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:55:30 PM

Saya lanjut ke **Seri 12/19**, seri penutup blok document database: integrasi Java/Jersey/MyBatis untuk JSONB document store, termasuk DTO versioning, mapper XML, transaction boundary, audit/outbox, idempotency, search whitelist, dan testing.

# Seri 12/19 - Java/Jersey/MyBatis Integration Pattern for PostgreSQL Document Database

## 1. Tujuan Seri Ini

Seri ini adalah penutup blok **PostgreSQL Document Database**. Fokusnya adalah bagaimana document pattern berbasis `jsonb` dipakai dari aplikasi **Java 17+ / Jersey / MyBatis** secara production-grade.

Target praktis:

1. Mendesain Jersey Resource untuk document API.
2. Mendesain DTO, payload versioning, dan compatibility reader.
3. Membuat MyBatis Mapper XML untuk `jsonb`.
4. Membuat transaction boundary untuk create/update/patch/transition.
5. Mengintegrasikan audit table, outbox event, dan idempotency key.
6. Membuat search API berbasis whitelist, bukan arbitrary JSON query.
7. Menangani error mapping dan conflict handling.
8. Menyiapkan testing strategy dengan PostgreSQL asli.

Kita akan pakai fondasi dari seri 7-11: document table design, JSONB operator/function, indexing, schema governance, mutation/audit/outbox. PostgreSQL menyediakan fungsi JSONB seperti `jsonb_set`, `jsonb_path_exists`, operator JSON, `RETURNING`, `ON CONFLICT`, transaction isolation, dan row-level locking; MyBatis mendukung Mapper XML dan type handler; Jakarta REST/Jersey menyediakan model resource berbasis annotation seperti `@Path`, HTTP method annotation, `@Consumes`, `@Produces`, dan provider seperti exception mapper. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

---

## 2. Integration Architecture

```text id="s0ukzj"
PostgreSQL Document Database Integration
│
├── HTTP Layer
│   ├── Jersey Resource
│   ├── request/response DTO
│   ├── Idempotency-Key header
│   ├── X-Correlation-Id header
│   └── ExceptionMapper
│
├── Application Layer
│   ├── DocumentCommandService
│   ├── DocumentQueryService
│   ├── PayloadReader/Writer
│   ├── TransactionExecutor
│   ├── IdempotentCommandExecutor
│   └── Validation / authorization
│
├── Persistence Layer
│   ├── DocumentQueryMapper
│   ├── DocumentMutationMapper
│   ├── DocumentAuditMapper
│   ├── OutboxMapper
│   ├── IdempotencyMapper
│   └── MyBatis XML SQL
│
├── PostgreSQL
│   ├── app_document
│   ├── app_document_audit
│   ├── outbox_event
│   ├── api_idempotency_key
│   └── indexes / constraints
│
└── Async Layer
    ├── outbox publisher
    ├── cache invalidation
    ├── downstream projection update
    └── retry / dead-letter handling
```

Prinsip desain:

```text id="ji8d2s"
Document storage boleh fleksibel.
API contract tetap domain-specific.
SQL tetap eksplisit.
Mutation tetap transactional.
Audit dan outbox tidak boleh tertinggal.
```

---

## 3. Package Structure

```text id="y0qbf7"
com.company.caseplatform.document
│
├── api
│   ├── CaseDocumentResource.java
│   ├── DocumentSearchResource.java
│   ├── DocumentExceptionMapper.java
│   └── dto
│       ├── CreateCaseDocumentRequest.java
│       ├── ReplaceCaseDocumentRequest.java
│       ├── PatchPriorityRequest.java
│       ├── TransitionDocumentRequest.java
│       ├── CaseDocumentSearchRequest.java
│       └── DocumentResponse.java
│
├── application
│   ├── DocumentCommandService.java
│   ├── DocumentQueryService.java
│   ├── DocumentMutationService.java
│   ├── IdempotentCommandExecutor.java
│   ├── TransactionExecutor.java
│   └── DocumentSearchPolicy.java
│
├── domain
│   ├── CaseIntakeDocument.java
│   ├── CaseIntakePayloadV1.java
│   ├── CaseIntakePayloadV2.java
│   ├── CaseIntakePayloadReader.java
│   ├── CaseIntakePayloadWriter.java
│   ├── DocumentEnvelope.java
│   ├── DocumentState.java
│   └── exceptions
│
├── persistence
│   ├── JsonbDocumentRecord.java
│   ├── DocumentStateRecord.java
│   ├── DocumentSummaryRecord.java
│   ├── DocumentQueryMapper.java
│   ├── DocumentMutationMapper.java
│   ├── IdempotencyMapper.java
│   ├── OutboxMapper.java
│   └── mapper
│       ├── DocumentQueryMapper.xml
│       ├── DocumentMutationMapper.xml
│       ├── IdempotencyMapper.xml
│       └── OutboxMapper.xml
│
└── infrastructure
    ├── ObjectMapperFactory.java
    ├── SqlSessionFactoryProvider.java
    ├── RequestHasher.java
    ├── CorrelationIdProvider.java
    └── ClockProvider.java
```

---

## 4. Database Baseline

```sql id="6fsi29"
CREATE TABLE app_document (
    document_id uuid PRIMARY KEY,

    tenant_id uuid NOT NULL,
    document_type text NOT NULL,
    business_key text NOT NULL,

    status text NOT NULL,
    schema_version integer NOT NULL,
    version bigint NOT NULL DEFAULT 0,

    payload jsonb NOT NULL,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by text NULL,
    updated_by text NULL,

    CONSTRAINT uq_app_document_business_key
        UNIQUE (tenant_id, document_type, business_key),

    CONSTRAINT ck_app_document_status
        CHECK (status IN (
            'DRAFT',
            'SUBMITTED',
            'ACTIVE',
            'UNDER_REVIEW',
            'APPROVED',
            'REJECTED',
            'ARCHIVED',
            'DELETED'
        )),

    CONSTRAINT ck_app_document_schema_version_positive
        CHECK (schema_version > 0),

    CONSTRAINT ck_app_document_payload_object
        CHECK (jsonb_typeof(payload) = 'object')
);

CREATE INDEX idx_app_document_listing
    ON app_document (
        tenant_id,
        document_type,
        status,
        updated_at DESC
    );

CREATE INDEX idx_app_document_case_priority_expr
    ON app_document ((payload #>> '{case,priority}'))
    WHERE document_type = 'CASE_INTAKE_FORM'
      AND status <> 'DELETED';
```

PostgreSQL JSONB functions/operators include field extraction, path operations, JSONPath, and mutation functions such as `jsonb_set`; this is why the database can support document-like behavior while still using SQL and relational metadata. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

---

## 5. Audit dan Outbox Table

```sql id="ii6trc"
CREATE TABLE app_document_audit (
    audit_id bigserial PRIMARY KEY,

    document_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    document_type text NOT NULL,
    business_key text NOT NULL,

    old_status text NULL,
    new_status text NULL,

    old_schema_version integer NULL,
    new_schema_version integer NULL,

    old_payload jsonb NULL,
    new_payload jsonb NULL,

    old_version bigint NULL,
    new_version bigint NULL,

    action text NOT NULL,
    actor text NOT NULL,
    reason text NULL,
    correlation_id text NULL,

    changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE outbox_event (
    event_id uuid PRIMARY KEY,

    aggregate_type text NOT NULL,
    aggregate_id uuid NOT NULL,
    event_type text NOT NULL,

    payload jsonb NOT NULL,

    status text NOT NULL DEFAULT 'PENDING',
    retry_count integer NOT NULL DEFAULT 0,
    available_at timestamptz NOT NULL DEFAULT now(),

    created_at timestamptz NOT NULL DEFAULT now(),
    published_at timestamptz NULL
);
```

Outbox harus berada di transaksi yang sama dengan mutation dokumen. Kalau update dokumen commit tetapi event gagal dibuat, downstream projection/cache bisa stale.

---

## 6. Java Record untuk Persistence

```java id="8hnmay"
public record JsonbDocumentRecord(
    UUID documentId,
    UUID tenantId,
    String documentType,
    String businessKey,
    String status,
    int schemaVersion,
    long version,
    String payloadJson,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt,
    String createdBy,
    String updatedBy
) {}
```

```java id="b9yd7g"
public record DocumentStateRecord(
    UUID documentId,
    UUID tenantId,
    String documentType,
    String businessKey,
    String status,
    int schemaVersion,
    long version,
    OffsetDateTime updatedAt
) {}
```

```java id="0kqj8y"
public record DocumentSummaryRecord(
    UUID documentId,
    String businessKey,
    String status,
    int schemaVersion,
    long version,
    String priority,
    OffsetDateTime updatedAt
) {}
```

Pattern `payloadJson` sebagai `String` sengaja dibuat eksplisit: SQL melakukan `CAST(#{payloadJson} AS jsonb)` saat write dan `payload::text AS payload_json` saat read. Ini mudah di-debug dan cocok untuk MyBatis XML.

---

## 7. Domain Payload Versioning

### 7.1 Payload V1

```java id="qf37ey"
public record CaseIntakePayloadV1(
    String customerId,
    String category,
    String priority
) {}
```

### 7.2 Payload V2

```java id="wx7u65"
public record CaseIntakePayloadV2(
    Applicant applicant,
    CaseInfo caseInfo,
    List<Attachment> attachments
) {
    public CaseIntakePayloadV2 {
        if (applicant == null) {
            throw new IllegalArgumentException("applicant is required");
        }
        if (caseInfo == null) {
            throw new IllegalArgumentException("caseInfo is required");
        }
        attachments = attachments == null ? List.of() : List.copyOf(attachments);
    }

    public record Applicant(String customerId, String nameMasked) {}

    public record CaseInfo(
        String category,
        String priority,
        BigDecimal amount,
        boolean manualReviewRequired
    ) {}

    public record Attachment(
        String attachmentId,
        String fileName,
        String contentType
    ) {}
}
```

### 7.3 Canonical Domain Model

```java id="lfo6cg"
public record CaseIntakeDocument(
    String customerId,
    String category,
    String priority,
    BigDecimal amount,
    boolean manualReviewRequired,
    List<CaseAttachment> attachments
) {}

public record CaseAttachment(
    String attachmentId,
    String fileName,
    String contentType
) {}
```

Jangan biarkan business logic membaca raw payload version langsung. Gunakan canonical model.

---

## 8. Compatibility Reader

```java id="f4tdbu"
public final class CaseIntakePayloadReader {

    private final ObjectMapper objectMapper;

    public CaseIntakePayloadReader(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public CaseIntakeDocument read(JsonbDocumentRecord record) {
        if (!"CASE_INTAKE_FORM".equals(record.documentType())) {
            throw new IllegalArgumentException(
                "Unsupported document type: " + record.documentType()
            );
        }

        return switch (record.schemaVersion()) {
            case 1 -> readV1(record.payloadJson());
            case 2 -> readV2(record.payloadJson());
            default -> throw new UnsupportedSchemaVersionException(
                "Unsupported CASE_INTAKE_FORM schema version: "
                    + record.schemaVersion()
            );
        };
    }

    private CaseIntakeDocument readV1(String payloadJson) {
        try {
            CaseIntakePayloadV1 v1 =
                objectMapper.readValue(payloadJson, CaseIntakePayloadV1.class);

            return new CaseIntakeDocument(
                v1.customerId(),
                v1.category(),
                v1.priority(),
                null,
                false,
                List.of()
            );
        } catch (JsonProcessingException e) {
            throw new StoredDocumentCorruptionException(
                "Cannot parse CASE_INTAKE_FORM v1 payload", e
            );
        }
    }

    private CaseIntakeDocument readV2(String payloadJson) {
        try {
            CaseIntakePayloadV2 v2 =
                objectMapper.readValue(payloadJson, CaseIntakePayloadV2.class);

            return new CaseIntakeDocument(
                v2.applicant().customerId(),
                v2.caseInfo().category(),
                v2.caseInfo().priority(),
                v2.caseInfo().amount(),
                v2.caseInfo().manualReviewRequired(),
                v2.attachments().stream()
                    .map(a -> new CaseAttachment(
                        a.attachmentId(),
                        a.fileName(),
                        a.contentType()
                    ))
                    .toList()
            );
        } catch (JsonProcessingException e) {
            throw new StoredDocumentCorruptionException(
                "Cannot parse CASE_INTAKE_FORM v2 payload", e
            );
        }
    }
}
```

Rule:

```text id="5cfc78"
Reader harus mendukung versi lama selama migration window.
Writer hanya menulis active version.
```

---

## 9. Payload Writer

```java id="sn7jke"
public final class CaseIntakePayloadWriter {

    private static final int ACTIVE_SCHEMA_VERSION = 2;

    private final ObjectMapper objectMapper;

    public CaseIntakePayloadWriter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public NewPayload toNewPayload(CreateCaseDocumentRequest request) {
        validate(request);

        CaseIntakePayloadV2 payload = new CaseIntakePayloadV2(
            new CaseIntakePayloadV2.Applicant(
                request.customerId(),
                request.nameMasked()
            ),
            new CaseIntakePayloadV2.CaseInfo(
                request.category(),
                request.priority(),
                request.amount(),
                request.manualReviewRequired()
            ),
            request.attachments()
        );

        return new NewPayload(ACTIVE_SCHEMA_VERSION, serialize(payload));
    }

    private void validate(CreateCaseDocumentRequest request) {
        if (request.customerId() == null || request.customerId().isBlank()) {
            throw new InvalidDocumentPayloadException("customerId is required");
        }
        if (!Set.of("DISPUTE", "FRAUD", "KYC", "GENERAL").contains(request.category())) {
            throw new InvalidDocumentPayloadException("Invalid category");
        }
        if (!Set.of("LOW", "MEDIUM", "HIGH").contains(request.priority())) {
            throw new InvalidDocumentPayloadException("Invalid priority");
        }
    }

    private String serialize(Object payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            throw new InvalidDocumentPayloadException("Cannot serialize payload", e);
        }
    }

    public record NewPayload(int schemaVersion, String payloadJson) {}
}
```

---

## 10. MyBatis Mapper - Query Interface

```java id="449a06"
public interface DocumentQueryMapper {

    Optional<JsonbDocumentRecord> findById(
        @Param("tenantId") UUID tenantId,
        @Param("documentId") UUID documentId
    );

    Optional<JsonbDocumentRecord> findByBusinessKey(
        @Param("tenantId") UUID tenantId,
        @Param("documentType") String documentType,
        @Param("businessKey") String businessKey
    );

    Optional<DocumentStateRecord> findState(
        @Param("tenantId") UUID tenantId,
        @Param("documentId") UUID documentId
    );

    List<DocumentSummaryRecord> searchCaseDocuments(
        @Param("tenantId") UUID tenantId,
        @Param("status") String status,
        @Param("priority") String priority,
        @Param("category") String category,
        @Param("limit") int limit,
        @Param("offset") int offset
    );
}
```

MyBatis Mapper XML is the standard place to define SQL, result maps, and statement mappings; MyBatis also allows a `typeHandler` to be configured at mapping level when needed. ([MyBatis](https://mybatis.org/mybatis-3/sqlmap-xml.html?utm_source=chatgpt.com))

---

## 11. MyBatis Mapper XML - Result Maps

```xml id="hurm02"
<mapper namespace="com.company.caseplatform.document.persistence.DocumentQueryMapper">

    <resultMap id="JsonbDocumentResultMap"
               type="com.company.caseplatform.document.persistence.JsonbDocumentRecord">
        <constructor>
            <arg column="document_id" javaType="java.util.UUID"/>
            <arg column="tenant_id" javaType="java.util.UUID"/>
            <arg column="document_type" javaType="string"/>
            <arg column="business_key" javaType="string"/>
            <arg column="status" javaType="string"/>
            <arg column="schema_version" javaType="int"/>
            <arg column="version" javaType="long"/>
            <arg column="payload_json" javaType="string"/>
            <arg column="created_at" javaType="java.time.OffsetDateTime"/>
            <arg column="updated_at" javaType="java.time.OffsetDateTime"/>
            <arg column="created_by" javaType="string"/>
            <arg column="updated_by" javaType="string"/>
        </constructor>
    </resultMap>

    <resultMap id="DocumentStateResultMap"
               type="com.company.caseplatform.document.persistence.DocumentStateRecord">
        <constructor>
            <arg column="document_id" javaType="java.util.UUID"/>
            <arg column="tenant_id" javaType="java.util.UUID"/>
            <arg column="document_type" javaType="string"/>
            <arg column="business_key" javaType="string"/>
            <arg column="status" javaType="string"/>
            <arg column="schema_version" javaType="int"/>
            <arg column="version" javaType="long"/>
            <arg column="updated_at" javaType="java.time.OffsetDateTime"/>
        </constructor>
    </resultMap>

    <resultMap id="DocumentSummaryResultMap"
               type="com.company.caseplatform.document.persistence.DocumentSummaryRecord">
        <constructor>
            <arg column="document_id" javaType="java.util.UUID"/>
            <arg column="business_key" javaType="string"/>
            <arg column="status" javaType="string"/>
            <arg column="schema_version" javaType="int"/>
            <arg column="version" javaType="long"/>
            <arg column="priority" javaType="string"/>
            <arg column="updated_at" javaType="java.time.OffsetDateTime"/>
        </constructor>
    </resultMap>
```

---

## 12. MyBatis Mapper XML - Find by ID

```xml id="6vmon7"
    <select id="findById" resultMap="JsonbDocumentResultMap">
        SELECT
            document_id,
            tenant_id,
            document_type,
            business_key,
            status,
            schema_version,
            version,
            payload::text AS payload_json,
            created_at,
            updated_at,
            created_by,
            updated_by
        FROM app_document
        WHERE tenant_id = #{tenantId}
          AND document_id = #{documentId}
          AND status <> 'DELETED'
    </select>
```

---

## 13. MyBatis Mapper XML - Find by Business Key

```xml id="nzvn6i"
    <select id="findByBusinessKey" resultMap="JsonbDocumentResultMap">
        SELECT
            document_id,
            tenant_id,
            document_type,
            business_key,
            status,
            schema_version,
            version,
            payload::text AS payload_json,
            created_at,
            updated_at,
            created_by,
            updated_by
        FROM app_document
        WHERE tenant_id = #{tenantId}
          AND document_type = #{documentType}
          AND business_key = #{businessKey}
          AND status <> 'DELETED'
    </select>
```

---

## 14. MyBatis Mapper XML - State Diagnostic

```xml id="x4fin3"
    <select id="findState" resultMap="DocumentStateResultMap">
        SELECT
            document_id,
            tenant_id,
            document_type,
            business_key,
            status,
            schema_version,
            version,
            updated_at
        FROM app_document
        WHERE tenant_id = #{tenantId}
          AND document_id = #{documentId}
    </select>
```

Diagnostic query ini dipakai saat update CTE mengembalikan zero rows untuk membedakan not found, stale version, deleted, atau invalid status.

---

## 15. Search API Whitelist

Jangan expose raw JSONPath dari client. Buat search parameter yang eksplisit.

```java id="ve0leo"
public record CaseDocumentSearchRequest(
    String status,
    String priority,
    String category,
    int limit,
    int offset
) {
    public CaseDocumentSearchRequest {
        if (limit <= 0 || limit > 200) {
            limit = 50;
        }
        if (offset < 0) {
            offset = 0;
        }
        if (status != null && !Set.of(
            "DRAFT",
            "SUBMITTED",
            "UNDER_REVIEW",
            "APPROVED",
            "REJECTED"
        ).contains(status)) {
            throw new IllegalArgumentException("Invalid status");
        }
        if (priority != null && !Set.of("LOW", "MEDIUM", "HIGH").contains(priority)) {
            throw new IllegalArgumentException("Invalid priority");
        }
    }
}
```

Mapper XML:

```xml id="ahqsl7"
    <select id="searchCaseDocuments" resultMap="DocumentSummaryResultMap">
        SELECT
            document_id,
            business_key,
            status,
            schema_version,
            version,
            payload #>> '{case,priority}' AS priority,
            updated_at
        FROM app_document
        WHERE tenant_id = #{tenantId}
          AND document_type = 'CASE_INTAKE_FORM'
          AND status <> 'DELETED'

        <if test="status != null">
          AND status = #{status}
        </if>

        <if test="priority != null">
          AND payload #>> '{case,priority}' = #{priority}
        </if>

        <if test="category != null">
          AND payload #>> '{case,category}' = #{category}
        </if>

        ORDER BY updated_at DESC
        LIMIT #{limit}
        OFFSET #{offset}
    </select>

</mapper>
```

Query JSONB tetap whitelisted: path `case.priority` dan `case.category` didefinisikan di XML, bukan dikirim bebas oleh client.

---

## 16. MyBatis Mapper - Mutation Interface

```java id="gyst2j"
public interface DocumentMutationMapper {

    Optional<JsonbDocumentRecord> createWithAuditAndOutbox(
        @Param("documentId") UUID documentId,
        @Param("tenantId") UUID tenantId,
        @Param("documentType") String documentType,
        @Param("businessKey") String businessKey,
        @Param("schemaVersion") int schemaVersion,
        @Param("payloadJson") String payloadJson,
        @Param("actor") String actor,
        @Param("reason") String reason,
        @Param("correlationId") String correlationId,
        @Param("eventId") UUID eventId
    );

    Optional<JsonbDocumentRecord> replacePayloadWithAuditAndOutbox(
        @Param("tenantId") UUID tenantId,
        @Param("documentId") UUID documentId,
        @Param("expectedVersion") long expectedVersion,
        @Param("schemaVersion") int schemaVersion,
        @Param("newPayloadJson") String newPayloadJson,
        @Param("actor") String actor,
        @Param("reason") String reason,
        @Param("correlationId") String correlationId,
        @Param("eventId") UUID eventId
    );

    Optional<JsonbDocumentRecord> patchCasePriorityWithAuditAndOutbox(
        @Param("tenantId") UUID tenantId,
        @Param("documentId") UUID documentId,
        @Param("expectedVersion") long expectedVersion,
        @Param("priority") String priority,
        @Param("actor") String actor,
        @Param("reason") String reason,
        @Param("correlationId") String correlationId,
        @Param("eventId") UUID eventId
    );

    Optional<DocumentStateRecord> transitionStatusWithAuditAndOutbox(
        @Param("tenantId") UUID tenantId,
        @Param("documentId") UUID documentId,
        @Param("expectedVersion") long expectedVersion,
        @Param("expectedStatus") String expectedStatus,
        @Param("newStatus") String newStatus,
        @Param("actor") String actor,
        @Param("reason") String reason,
        @Param("correlationId") String correlationId,
        @Param("eventId") UUID eventId
    );
}
```

---

## 17. Mutation XML - Create + Audit + Outbox

```xml id="1bz4k6"
<mapper namespace="com.company.caseplatform.document.persistence.DocumentMutationMapper">

    <select id="createWithAuditAndOutbox" resultMap="JsonbDocumentResultMap">
        WITH inserted_document AS (
            INSERT INTO app_document (
                document_id,
                tenant_id,
                document_type,
                business_key,
                status,
                schema_version,
                payload,
                created_by,
                updated_by
            )
            VALUES (
                #{documentId},
                #{tenantId},
                #{documentType},
                #{businessKey},
                'DRAFT',
                #{schemaVersion},
                CAST(#{payloadJson} AS jsonb),
                #{actor},
                #{actor}
            )
            RETURNING *
        ),
        audit_insert AS (
            INSERT INTO app_document_audit (
                document_id,
                tenant_id,
                document_type,
                business_key,
                old_status,
                new_status,
                old_schema_version,
                new_schema_version,
                old_payload,
                new_payload,
                old_version,
                new_version,
                action,
                actor,
                reason,
                correlation_id
            )
            SELECT
                document_id,
                tenant_id,
                document_type,
                business_key,
                NULL,
                status,
                NULL,
                schema_version,
                NULL,
                payload,
                NULL,
                version,
                'CREATE',
                #{actor},
                #{reason},
                #{correlationId}
            FROM inserted_document
        ),
        outbox_insert AS (
            INSERT INTO outbox_event (
                event_id,
                aggregate_type,
                aggregate_id,
                event_type,
                payload
            )
            SELECT
                #{eventId},
                'DOCUMENT',
                document_id,
                'DOCUMENT_CREATED',
                jsonb_build_object(
                    'documentId', document_id,
                    'tenantId', tenant_id,
                    'documentType', document_type,
                    'businessKey', business_key,
                    'status', status,
                    'version', version
                )
            FROM inserted_document
        )
        SELECT
            document_id,
            tenant_id,
            document_type,
            business_key,
            status,
            schema_version,
            version,
            payload::text AS payload_json,
            created_at,
            updated_at,
            created_by,
            updated_by
        FROM inserted_document
    </select>
```

`RETURNING` membuat mutation bisa langsung mengembalikan row final dari database setelah insert/update, sehingga service tidak perlu query ulang hanya untuk mendapatkan version/status terbaru. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

---

## 18. Mutation XML - Replace Payload + Audit + Outbox

```xml id="xv2t8e"
    <select id="replacePayloadWithAuditAndOutbox"
            resultMap="JsonbDocumentResultMap">
        WITH old_row AS (
            SELECT *
            FROM app_document
            WHERE tenant_id = #{tenantId}
              AND document_id = #{documentId}
              AND version = #{expectedVersion}
              AND status <> 'DELETED'
        ),
        updated_row AS (
            UPDATE app_document d
            SET
                payload = CAST(#{newPayloadJson} AS jsonb),
                schema_version = #{schemaVersion},
                version = d.version + 1,
                updated_at = now(),
                updated_by = #{actor}
            FROM old_row old
            WHERE d.tenant_id = old.tenant_id
              AND d.document_id = old.document_id
            RETURNING d.*
        ),
        audit_insert AS (
            INSERT INTO app_document_audit (
                document_id,
                tenant_id,
                document_type,
                business_key,
                old_status,
                new_status,
                old_schema_version,
                new_schema_version,
                old_payload,
                new_payload,
                old_version,
                new_version,
                action,
                actor,
                reason,
                correlation_id
            )
            SELECT
                old_row.document_id,
                old_row.tenant_id,
                old_row.document_type,
                old_row.business_key,
                old_row.status,
                updated_row.status,
                old_row.schema_version,
                updated_row.schema_version,
                old_row.payload,
                updated_row.payload,
                old_row.version,
                updated_row.version,
                'REPLACE',
                #{actor},
                #{reason},
                #{correlationId}
            FROM old_row
            JOIN updated_row
              ON updated_row.document_id = old_row.document_id
             AND updated_row.tenant_id = old_row.tenant_id
        ),
        outbox_insert AS (
            INSERT INTO outbox_event (
                event_id,
                aggregate_type,
                aggregate_id,
                event_type,
                payload
            )
            SELECT
                #{eventId},
                'DOCUMENT',
                updated_row.document_id,
                'DOCUMENT_REPLACED',
                jsonb_build_object(
                    'documentId', updated_row.document_id,
                    'tenantId', updated_row.tenant_id,
                    'documentType', updated_row.document_type,
                    'businessKey', updated_row.business_key,
                    'oldVersion', old_row.version,
                    'newVersion', updated_row.version
                )
            FROM old_row
            JOIN updated_row
              ON updated_row.document_id = old_row.document_id
        )
        SELECT
            document_id,
            tenant_id,
            document_type,
            business_key,
            status,
            schema_version,
            version,
            payload::text AS payload_json,
            created_at,
            updated_at,
            created_by,
            updated_by
        FROM updated_row
    </select>
```

---

## 19. Mutation XML - Patch Priority

```xml id="7ephqw"
    <select id="patchCasePriorityWithAuditAndOutbox"
            resultMap="JsonbDocumentResultMap">
        WITH old_row AS (
            SELECT *
            FROM app_document
            WHERE tenant_id = #{tenantId}
              AND document_id = #{documentId}
              AND document_type = 'CASE_INTAKE_FORM'
              AND status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW')
              AND version = #{expectedVersion}
              AND #{priority} IN ('LOW', 'MEDIUM', 'HIGH')
        ),
        updated_row AS (
            UPDATE app_document d
            SET
                payload = jsonb_set(
                    d.payload,
                    '{case,priority}',
                    to_jsonb(#{priority}::text),
                    true
                ),
                version = d.version + 1,
                updated_at = now(),
                updated_by = #{actor}
            FROM old_row old
            WHERE d.tenant_id = old.tenant_id
              AND d.document_id = old.document_id
            RETURNING d.*
        ),
        audit_insert AS (
            INSERT INTO app_document_audit (
                document_id,
                tenant_id,
                document_type,
                business_key,
                old_status,
                new_status,
                old_schema_version,
                new_schema_version,
                old_payload,
                new_payload,
                old_version,
                new_version,
                action,
                actor,
                reason,
                correlation_id
            )
            SELECT
                old_row.document_id,
                old_row.tenant_id,
                old_row.document_type,
                old_row.business_key,
                old_row.status,
                updated_row.status,
                old_row.schema_version,
                updated_row.schema_version,
                old_row.payload,
                updated_row.payload,
                old_row.version,
                updated_row.version,
                'PATCH',
                #{actor},
                #{reason},
                #{correlationId}
            FROM old_row
            JOIN updated_row
              ON updated_row.document_id = old_row.document_id
        ),
        outbox_insert AS (
            INSERT INTO outbox_event (
                event_id,
                aggregate_type,
                aggregate_id,
                event_type,
                payload
            )
            SELECT
                #{eventId},
                'DOCUMENT',
                updated_row.document_id,
                'DOCUMENT_PATCHED',
                jsonb_build_object(
                    'documentId', updated_row.document_id,
                    'tenantId', updated_row.tenant_id,
                    'documentType', updated_row.document_type,
                    'businessKey', updated_row.business_key,
                    'path', 'case.priority',
                    'version', updated_row.version
                )
            FROM updated_row
        )
        SELECT
            document_id,
            tenant_id,
            document_type,
            business_key,
            status,
            schema_version,
            version,
            payload::text AS payload_json,
            created_at,
            updated_at,
            created_by,
            updated_by
        FROM updated_row
    </select>
```

`jsonb_set` returns a modified JSONB value with a target path replaced or added when allowed by `create_if_missing`; in document mutation APIs, keep the path whitelisted instead of accepting arbitrary paths from clients. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

---

## 20. Mutation XML - Status Transition

```xml id="mjxw0e"
    <select id="transitionStatusWithAuditAndOutbox"
            resultMap="DocumentStateResultMap">
        WITH old_row AS (
            SELECT *
            FROM app_document
            WHERE tenant_id = #{tenantId}
              AND document_id = #{documentId}
              AND status = #{expectedStatus}
              AND version = #{expectedVersion}
              AND status <> 'DELETED'
        ),
        updated_row AS (
            UPDATE app_document d
            SET
                status = #{newStatus},
                version = d.version + 1,
                updated_at = now(),
                updated_by = #{actor}
            FROM old_row old
            WHERE d.tenant_id = old.tenant_id
              AND d.document_id = old.document_id
              AND (
                    (old.status = 'DRAFT' AND #{newStatus} = 'SUBMITTED')
                 OR (old.status = 'SUBMITTED' AND #{newStatus} = 'UNDER_REVIEW')
                 OR (old.status = 'UNDER_REVIEW' AND #{newStatus} IN ('APPROVED', 'REJECTED'))
                 OR (old.status IN ('APPROVED', 'REJECTED') AND #{newStatus} = 'ARCHIVED')
              )
            RETURNING d.*
        ),
        audit_insert AS (
            INSERT INTO app_document_audit (
                document_id,
                tenant_id,
                document_type,
                business_key,
                old_status,
                new_status,
                old_schema_version,
                new_schema_version,
                old_payload,
                new_payload,
                old_version,
                new_version,
                action,
                actor,
                reason,
                correlation_id
            )
            SELECT
                old_row.document_id,
                old_row.tenant_id,
                old_row.document_type,
                old_row.business_key,
                old_row.status,
                updated_row.status,
                old_row.schema_version,
                updated_row.schema_version,
                old_row.payload,
                updated_row.payload,
                old_row.version,
                updated_row.version,
                'STATUS_CHANGE',
                #{actor},
                #{reason},
                #{correlationId}
            FROM old_row
            JOIN updated_row
              ON updated_row.document_id = old_row.document_id
        ),
        outbox_insert AS (
            INSERT INTO outbox_event (
                event_id,
                aggregate_type,
                aggregate_id,
                event_type,
                payload
            )
            SELECT
                #{eventId},
                'DOCUMENT',
                updated_row.document_id,
                'DOCUMENT_STATUS_CHANGED',
                jsonb_build_object(
                    'documentId', updated_row.document_id,
                    'tenantId', updated_row.tenant_id,
                    'documentType', updated_row.document_type,
                    'businessKey', updated_row.business_key,
                    'oldStatus', old_row.status,
                    'newStatus', updated_row.status,
                    'oldVersion', old_row.version,
                    'newVersion', updated_row.version
                )
            FROM old_row
            JOIN updated_row
              ON updated_row.document_id = old_row.document_id
        )
        SELECT
            document_id,
            tenant_id,
            document_type,
            business_key,
            status,
            schema_version,
            version,
            updated_at
        FROM updated_row
    </select>

</mapper>
```

Untuk state machine yang kompleks, pindahkan rule transition ke table `app_document_status_transition_rule`, bukan hard-code di XML.

---

## 21. Transaction Executor

Jika tidak memakai Spring transaction, jaga `SqlSession` lifecycle eksplisit.

```java id="qk0zae"
public final class TransactionExecutor {

    private final SqlSessionFactory sqlSessionFactory;

    public TransactionExecutor(SqlSessionFactory sqlSessionFactory) {
        this.sqlSessionFactory = sqlSessionFactory;
    }

    public <T> T inTransaction(Function<SqlSession, T> work) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            try {
                T result = work.apply(session);
                session.commit();
                return result;
            } catch (RuntimeException e) {
                session.rollback();
                throw e;
            }
        }
    }
}
```

PostgreSQL supports the standard transaction isolation levels but internally maps `READ UNCOMMITTED` to `READ COMMITTED`; explicit version checks are still useful for application-level lost-update prevention. ([PostgreSQL](https://www.postgresql.org/docs/current/transaction-iso.html?utm_source=chatgpt.com))

---

## 22. Document Command Service - Create

```java id="v1198t"
public final class DocumentCommandService {

    private static final String CASE_INTAKE_FORM = "CASE_INTAKE_FORM";

    private final TransactionExecutor tx;
    private final CaseIntakePayloadWriter payloadWriter;

    public DocumentCommandService(
        TransactionExecutor tx,
        CaseIntakePayloadWriter payloadWriter
    ) {
        this.tx = tx;
        this.payloadWriter = payloadWriter;
    }

    public DocumentResponse createCaseDocument(
        UUID tenantId,
        CreateCaseDocumentRequest request,
        String actor,
        String reason,
        String correlationId
    ) {
        requireReason(reason);

        CaseIntakePayloadWriter.NewPayload payload =
            payloadWriter.toNewPayload(request);

        UUID documentId = UUID.randomUUID();
        UUID eventId = UUID.randomUUID();

        return tx.inTransaction(session -> {
            DocumentMutationMapper mapper =
                session.getMapper(DocumentMutationMapper.class);

            JsonbDocumentRecord record = mapper.createWithAuditAndOutbox(
                documentId,
                tenantId,
                CASE_INTAKE_FORM,
                request.caseNumber(),
                payload.schemaVersion(),
                payload.payloadJson(),
                actor,
                reason,
                correlationId,
                eventId
            ).orElseThrow(() ->
                new IllegalStateException("Create document returned no row")
            );

            return DocumentResponse.from(record);
        });
    }

    private void requireReason(String reason) {
        if (reason == null || reason.isBlank()) {
            throw new InvalidDocumentPayloadException("reason is required");
        }
    }
}
```

---

## 23. Document Command Service - Replace with Diagnostics

```java id="dtcl2s"
public DocumentResponse replaceCaseDocument(
    UUID tenantId,
    UUID documentId,
    ReplaceCaseDocumentRequest request,
    String actor,
    String correlationId
) {
    requireReason(request.reason());

    CaseIntakePayloadWriter.NewPayload payload =
        payloadWriter.toNewPayload(request.toCreateShape());

    return tx.inTransaction(session -> {
        DocumentMutationMapper mutation =
            session.getMapper(DocumentMutationMapper.class);
        DocumentQueryMapper query =
            session.getMapper(DocumentQueryMapper.class);

        Optional<JsonbDocumentRecord> updated =
            mutation.replacePayloadWithAuditAndOutbox(
                tenantId,
                documentId,
                request.expectedVersion(),
                payload.schemaVersion(),
                payload.payloadJson(),
                actor,
                request.reason(),
                correlationId,
                UUID.randomUUID()
            );

        if (updated.isPresent()) {
            return DocumentResponse.from(updated.get());
        }

        throw diagnoseMutationFailure(
            query,
            tenantId,
            documentId,
            request.expectedVersion()
        );
    });
}

private RuntimeException diagnoseMutationFailure(
    DocumentQueryMapper query,
    UUID tenantId,
    UUID documentId,
    long expectedVersion
) {
    Optional<DocumentStateRecord> state = query.findState(tenantId, documentId);

    if (state.isEmpty()) {
        return new DocumentNotFoundException(documentId);
    }

    DocumentStateRecord current = state.get();

    if ("DELETED".equals(current.status())) {
        return new DocumentGoneException(documentId);
    }

    if (current.version() != expectedVersion) {
        return new DocumentVersionConflictException(
            documentId,
            expectedVersion,
            current.version()
        );
    }

    return new InvalidDocumentStateException(
        "Document cannot be mutated in status " + current.status()
    );
}
```

---

## 24. Document Command Service - Patch Priority

```java id="dmuqwv"
public DocumentResponse patchPriority(
    UUID tenantId,
    UUID documentId,
    PatchPriorityRequest request,
    String actor,
    String correlationId
) {
    requireReason(request.reason());

    if (!Set.of("LOW", "MEDIUM", "HIGH").contains(request.priority())) {
        throw new InvalidDocumentPayloadException("Invalid priority");
    }

    return tx.inTransaction(session -> {
        DocumentMutationMapper mutation =
            session.getMapper(DocumentMutationMapper.class);
        DocumentQueryMapper query =
            session.getMapper(DocumentQueryMapper.class);

        Optional<JsonbDocumentRecord> updated =
            mutation.patchCasePriorityWithAuditAndOutbox(
                tenantId,
                documentId,
                request.expectedVersion(),
                request.priority(),
                actor,
                request.reason(),
                correlationId,
                UUID.randomUUID()
            );

        if (updated.isPresent()) {
            return DocumentResponse.from(updated.get());
        }

        throw diagnoseMutationFailure(
            query,
            tenantId,
            documentId,
            request.expectedVersion()
        );
    });
}
```

Patch dibuat method-specific. Jangan membuat `patch(String jsonPath, Object value)` untuk client umum.

---

## 25. Document Query Service

```java id="zpm4r8"
public final class DocumentQueryService {

    private final DocumentQueryMapper queryMapper;
    private final CaseIntakePayloadReader payloadReader;

    public Optional<DocumentResponse> findById(UUID tenantId, UUID documentId) {
        return queryMapper.findById(tenantId, documentId)
            .map(record -> {
                CaseIntakeDocument canonical = payloadReader.read(record);
                return DocumentResponse.from(record, canonical);
            });
    }

    public List<DocumentSummaryResponse> searchCaseDocuments(
        UUID tenantId,
        CaseDocumentSearchRequest request
    ) {
        return queryMapper.searchCaseDocuments(
                tenantId,
                request.status(),
                request.priority(),
                request.category(),
                request.limit(),
                request.offset()
            )
            .stream()
            .map(DocumentSummaryResponse::from)
            .toList();
    }
}
```

Search response jangan selalu return full payload. Untuk list endpoint, pakai summary/projection.

---

## 26. Jersey Resource - Document CRUD/Mutation

```java id="0j1ccd"
@Path("/tenants/{tenantId}/case-documents")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CaseDocumentResource {

    private final DocumentCommandService commandService;
    private final DocumentQueryService queryService;

    public CaseDocumentResource(
        DocumentCommandService commandService,
        DocumentQueryService queryService
    ) {
        this.commandService = commandService;
        this.queryService = queryService;
    }

    @POST
    public Response create(
        @PathParam("tenantId") UUID tenantId,
        @HeaderParam("Idempotency-Key") String idempotencyKey,
        CreateCaseDocumentRequest request,
        @Context SecurityContext securityContext,
        @Context HttpHeaders headers
    ) {
        String actor = securityContext.getUserPrincipal().getName();
        String correlationId = header(headers, "X-Correlation-Id");

        DocumentResponse response = commandService.createCaseDocument(
            tenantId,
            request,
            actor,
            request.reason(),
            correlationId
        );

        return Response.status(Response.Status.CREATED)
            .entity(response)
            .build();
    }

    @GET
    @Path("/{documentId}")
    public Response get(
        @PathParam("tenantId") UUID tenantId,
        @PathParam("documentId") UUID documentId
    ) {
        return queryService.findById(tenantId, documentId)
            .map(Response::ok)
            .orElseGet(() -> Response.status(Response.Status.NOT_FOUND))
            .build();
    }

    @PUT
    @Path("/{documentId}")
    public Response replace(
        @PathParam("tenantId") UUID tenantId,
        @PathParam("documentId") UUID documentId,
        ReplaceCaseDocumentRequest request,
        @Context SecurityContext securityContext,
        @Context HttpHeaders headers
    ) {
        String actor = securityContext.getUserPrincipal().getName();
        String correlationId = header(headers, "X-Correlation-Id");

        DocumentResponse response = commandService.replaceCaseDocument(
            tenantId,
            documentId,
            request,
            actor,
            correlationId
        );

        return Response.ok(response).build();
    }

    @PATCH
    @Path("/{documentId}/priority")
    public Response patchPriority(
        @PathParam("tenantId") UUID tenantId,
        @PathParam("documentId") UUID documentId,
        PatchPriorityRequest request,
        @Context SecurityContext securityContext,
        @Context HttpHeaders headers
    ) {
        String actor = securityContext.getUserPrincipal().getName();
        String correlationId = header(headers, "X-Correlation-Id");

        DocumentResponse response = commandService.patchPriority(
            tenantId,
            documentId,
            request,
            actor,
            correlationId
        );

        return Response.ok(response).build();
    }

    private String header(HttpHeaders headers, String name) {
        return headers.getHeaderString(name);
    }
}
```

Jakarta RESTful Web Services is the foundational API for REST-style services; Jersey is an implementation with resource classes and annotation-driven request mapping. ([Jakarta EE](https://jakarta.ee/learn/docs/jakartaee-tutorial/current/websvcs/rest/rest.html?utm_source=chatgpt.com))

---

## 27. Jersey Resource - Search Endpoint

```java id="a5n2l7"
@GET
public Response search(
    @PathParam("tenantId") UUID tenantId,
    @QueryParam("status") String status,
    @QueryParam("priority") String priority,
    @QueryParam("category") String category,
    @DefaultValue("50") @QueryParam("limit") int limit,
    @DefaultValue("0") @QueryParam("offset") int offset
) {
    CaseDocumentSearchRequest request =
        new CaseDocumentSearchRequest(
            status,
            priority,
            category,
            limit,
            offset
        );

    List<DocumentSummaryResponse> results =
        queryService.searchCaseDocuments(tenantId, request);

    return Response.ok(results).build();
}
```

Search API ini sengaja tidak menerima `jsonPath`, `fieldPath`, atau raw SQL-like filter dari client.

---

## 28. Exception Mapper

```java id="57zjhw"
@Provider
public final class DocumentExceptionMapper
    implements ExceptionMapper<RuntimeException> {

    @Override
    public Response toResponse(RuntimeException e) {
        if (e instanceof DocumentNotFoundException) {
            return error(404, "DOCUMENT_NOT_FOUND", e.getMessage());
        }

        if (e instanceof DocumentGoneException) {
            return error(410, "DOCUMENT_GONE", e.getMessage());
        }

        if (e instanceof DocumentVersionConflictException) {
            return error(409, "DOCUMENT_VERSION_CONFLICT", e.getMessage());
        }

        if (e instanceof InvalidDocumentStateException) {
            return error(409, "INVALID_DOCUMENT_STATE", e.getMessage());
        }

        if (e instanceof InvalidDocumentPayloadException) {
            return error(400, "INVALID_DOCUMENT_PAYLOAD", e.getMessage());
        }

        if (e instanceof UnsupportedSchemaVersionException) {
            return error(500, "UNSUPPORTED_SCHEMA_VERSION",
                "Stored document schema version is not supported");
        }

        if (e instanceof StoredDocumentCorruptionException) {
            return error(500, "STORED_DOCUMENT_CORRUPTION",
                "Stored document payload is invalid");
        }

        return error(500, "INTERNAL_ERROR", "Unexpected error");
    }

    private Response error(int status, String code, String message) {
        return Response.status(status)
            .entity(Map.of(
                "code", code,
                "message", message
            ))
            .build();
    }
}
```

---

## 29. Idempotency Integration

Untuk `POST create` dan `POST transition`, idempotency sebaiknya wajib. Untuk `PUT replace`, bisa diwajibkan juga jika client/gateway sering retry.

Flow:

```text id="j29727"
Jersey Resource
  ↓
hash request method + path + normalized body
  ↓
IdempotentCommandExecutor
  ↓
BEGIN
  insert api_idempotency_key PROCESSING
  if duplicate:
    compare request_hash
    return cached response / conflict / processing
  mutate document
  insert audit
  insert outbox
  mark idempotency SUCCEEDED
COMMIT
```

Core PostgreSQL primitive:

```sql id="247j3r"
INSERT INTO api_idempotency_key (
    tenant_id,
    operation,
    idempotency_key,
    request_hash,
    request_method,
    request_path,
    business_key,
    actor_id,
    status,
    processing_started_at,
    expires_at
)
VALUES (
    :tenantId,
    :operation,
    :idempotencyKey,
    :requestHash,
    :method,
    :path,
    :businessKey,
    :actor,
    'PROCESSING',
    now(),
    now() + interval '24 hours'
)
ON CONFLICT (tenant_id, operation, idempotency_key)
DO NOTHING;
```

`INSERT ... ON CONFLICT` is the PostgreSQL mechanism for handling unique/exclusion conflict alternatives, making it a good fit for acquiring idempotency keys safely under retries. ([Stack Overflow](https://stackoverflow.com/questions/38980549/postgres-insert-on-conflict-with-jsonb?utm_source=chatgpt.com))

---

## 30. JSONB TypeHandler: Optional

Default yang saya sarankan untuk MyBatis XML:

```xml id="a552u4"
CAST(#{payloadJson} AS jsonb)
```

dan read:

```sql id="eqwhfn"
payload::text AS payload_json
```

Kalau tim ingin reusable type handler, gunakan `PGobject`.

```java id="o0233u"
@MappedJdbcTypes(JdbcType.OTHER)
@MappedTypes(String.class)
public final class JsonbStringTypeHandler extends BaseTypeHandler<String> {

    @Override
    public void setNonNullParameter(
        PreparedStatement ps,
        int i,
        String parameter,
        JdbcType jdbcType
    ) throws SQLException {
        PGobject pgObject = new PGobject();
        pgObject.setType("jsonb");
        pgObject.setValue(parameter);
        ps.setObject(i, pgObject);
    }

    @Override
    public String getNullableResult(ResultSet rs, String columnName)
        throws SQLException {
        Object value = rs.getObject(columnName);
        return value == null ? null : value.toString();
    }

    @Override
    public String getNullableResult(ResultSet rs, int columnIndex)
        throws SQLException {
        Object value = rs.getObject(columnIndex);
        return value == null ? null : value.toString();
    }

    @Override
    public String getNullableResult(CallableStatement cs, int columnIndex)
        throws SQLException {
        Object value = cs.getObject(columnIndex);
        return value == null ? null : value.toString();
    }
}
```

MyBatis supports type handlers both globally and on mapping-by-mapping basis, but explicit casts in mapper XML are often easier to debug in SQL-heavy teams. ([MyBatis](https://mybatis.org/mybatis-3/configuration.html?utm_source=chatgpt.com))

---

## 31. Outbox Publisher Worker

```java id="ri357g"
public final class OutboxPublisherJob {

    private final TransactionExecutor tx;
    private final EventPublisher publisher;

    public void runBatch(int batchSize) {
        List<OutboxEventRecord> events = tx.inTransaction(session -> {
            OutboxMapper mapper = session.getMapper(OutboxMapper.class);
            return mapper.claimPending(batchSize);
        });

        for (OutboxEventRecord event : events) {
            try {
                publisher.publish(event.eventType(), event.payloadJson());

                tx.inTransaction(session -> {
                    OutboxMapper mapper = session.getMapper(OutboxMapper.class);
                    mapper.markPublished(event.eventId());
                    return null;
                });

            } catch (RuntimeException ex) {
                tx.inTransaction(session -> {
                    OutboxMapper mapper = session.getMapper(OutboxMapper.class);
                    mapper.markFailedOrRetry(event.eventId(), ex.getMessage());
                    return null;
                });
            }
        }
    }
}
```

Claim SQL:

```xml id="6xudn5"
<select id="claimPending" resultMap="OutboxEventResultMap">
    WITH picked AS (
        SELECT event_id
        FROM outbox_event
        WHERE status = 'PENDING'
          AND available_at <= now()
        ORDER BY created_at
        LIMIT #{batchSize}
        FOR UPDATE SKIP LOCKED
    )
    UPDATE outbox_event e
    SET
        status = 'PROCESSING',
        retry_count = retry_count + 1
    FROM picked
    WHERE e.event_id = picked.event_id
    RETURNING
        e.event_id,
        e.aggregate_type,
        e.aggregate_id,
        e.event_type,
        e.payload::text AS payload_json,
        e.retry_count,
        e.created_at
</select>
```

`FOR UPDATE SKIP LOCKED` is appropriate for queue-like worker claiming because it skips rows locked by other transactions, but it intentionally gives an inconsistent view and should not be used for ordinary business reads. ([PostgreSQL](https://www.postgresql.org/docs/current/transaction-iso.html?utm_source=chatgpt.com))

---

## 32. HTTP Contract Examples

### Create

```http id="9zqjz3"
POST /tenants/{tenantId}/case-documents
Idempotency-Key: 9d68b33d-3c3e-4f85-9d39-95c4c4f65a0c
X-Correlation-Id: req-20260715-001
Content-Type: application/json
```

```json id="ve1h5a"
{
  "caseNumber": "CASE-2026-000123",
  "customerId": "C001",
  "nameMasked": "Budi S.",
  "category": "DISPUTE",
  "priority": "HIGH",
  "amount": 1500000,
  "manualReviewRequired": true,
  "attachments": [],
  "reason": "Initial case intake"
}
```

### Replace

```http id="54q1r5"
PUT /tenants/{tenantId}/case-documents/{documentId}
Content-Type: application/json
```

```json id="a9pj6o"
{
  "expectedVersion": 7,
  "customerId": "C001",
  "nameMasked": "Budi S.",
  "category": "DISPUTE",
  "priority": "MEDIUM",
  "amount": 1500000,
  "manualReviewRequired": true,
  "attachments": [],
  "reason": "Correct priority after review"
}
```

### Patch Priority

```http id="7n68cq"
PATCH /tenants/{tenantId}/case-documents/{documentId}/priority
Content-Type: application/json
```

```json id="uytw0o"
{
  "expectedVersion": 8,
  "priority": "LOW",
  "reason": "Risk score recalculated"
}
```

### Search

```http id="3mj951"
GET /tenants/{tenantId}/case-documents?status=SUBMITTED&priority=HIGH&limit=50
```

---

## 33. Error Response Contract

```json id="jss00f"
{
  "code": "DOCUMENT_VERSION_CONFLICT",
  "message": "Document version conflict. Expected 7 but current version is 8."
}
```

Recommended mapping:

| Condition | HTTP | Code |
|---|---:|---|
| Missing required field | `400` | `INVALID_DOCUMENT_PAYLOAD` |
| Invalid enum | `400` | `INVALID_DOCUMENT_PAYLOAD` |
| Document not found | `404` | `DOCUMENT_NOT_FOUND` |
| Deleted document | `410` | `DOCUMENT_GONE` |
| Stale version | `409` | `DOCUMENT_VERSION_CONFLICT` |
| Invalid status transition | `409` | `INVALID_DOCUMENT_STATE` |
| Duplicate business key | `409` | `DUPLICATE_DOCUMENT` |
| Idempotency key reused with different payload | `409` | `IDEMPOTENCY_KEY_REUSED` |
| Stored payload cannot parse | `500` | `STORED_DOCUMENT_CORRUPTION` |

---

## 34. Testing Strategy

### 34.1 Unit Tests

| Unit | Test |
|---|---|
| Payload writer | invalid priority rejected |
| Payload reader | can read v1 and v2 |
| Command service | stale version maps to conflict |
| Search request | invalid query param rejected |
| Request hasher | same canonical request same hash |
| Exception mapper | domain exception maps to correct HTTP |

### 34.2 Mapper Integration Tests

Gunakan PostgreSQL asli, bukan H2, karena `jsonb`, `jsonb_set`, JSONPath, `ON CONFLICT`, dan `FOR UPDATE SKIP LOCKED` spesifik PostgreSQL.

| Test | Expected |
|---|---|
| Create inserts document | row exists |
| Create inserts audit | audit row exists |
| Create inserts outbox | outbox row exists |
| Replace increments version | version + 1 |
| Replace stale version returns empty | service maps `409` |
| Patch priority only changes path | other payload fields unchanged |
| Transition validates expected status | invalid transition returns empty |
| Search priority uses JSON path | correct results |
| Invalid JSON rejected by cast/check | exception |
| Duplicate business key rejected | unique violation |

### 34.3 API Tests

| API scenario | Expected |
|---|---|
| POST create valid | `201` |
| POST duplicate business key | `409` |
| GET existing | `200` |
| GET missing | `404` |
| PUT stale version | `409` |
| PATCH invalid priority | `400` |
| Search whitelisted filters | `200` |
| Raw JSONPath unsupported | no such API |

### 34.4 Concurrency Test

```text id="q9x9vv"
Thread A reads version 7
Thread B reads version 7
Thread A replace version 7 -> success version 8
Thread B patch version 7 -> no row -> 409 conflict
```

---

## 35. Observability

Log fields:

```text id="gq6ok5"
tenant_id
document_id
document_type
business_key
operation
expected_version
new_version
status
actor
reason_present
correlation_id
idempotency_key
duration_ms
db_row_count
```

Metrics:

| Metric | Meaning |
|---|---|
| `document.create.count` | Created documents |
| `document.replace.count` | Full replace volume |
| `document.patch.count` | Patch volume |
| `document.transition.count` | Status transition volume |
| `document.conflict.count` | Version/status conflicts |
| `document.search.duration` | Search latency |
| `document.payload_parse.failure` | Stored payload corruption |
| `document.audit.insert.count` | Audit rows |
| `document.outbox.pending.count` | Backlog |
| `document.outbox.publish.failure` | Publishing problem |

Alert:

| Alert | Why |
|---|---|
| Stored payload corruption > 0 | Schema governance broken |
| Conflict spike | UI stale state or concurrent editing issue |
| Outbox pending grows | Downstream/event publisher stuck |
| Search latency spike | Index/query regression |
| Audit missing | Regulatory defensibility broken |

---

## 36. Production Guardrails

| Guardrail | Praktik |
|---|---|
| API domain-specific | `PATCH /priority`, bukan arbitrary JSON patch |
| Payload versioning | `schema_version` wajib |
| Reader compatibility | Support old versions during migration |
| Writer strict | Only write active schema version |
| Transaction boundary | document + audit + outbox + idempotency |
| Version check | Every mutation uses `expectedVersion` |
| Status check | Every transition uses `expectedStatus` |
| Search whitelist | No raw JSONPath from client |
| JSONB indexing | Expression/partial/GIN based on real query |
| Idempotency | Required for retry-prone commands |
| Redaction | Audit payload may contain PII |
| Testing | PostgreSQL native integration tests |

---

## 37. Anti-Pattern

### 37.1 Generic Document API for Everything

```http id="yg7byy"
POST /documents/{type}
PATCH /documents/{id}
{
  "path": "$.anything",
  "value": "anything"
}
```

Ini membuat service kehilangan domain contract.

---

### 37.2 Transaction Terpecah

```text id="a7e43r"
update document commit
insert audit later
publish event later
```

Jika crash di tengah, data, audit, dan downstream tidak konsisten.

---

### 37.3 Search API Menerima Raw JSONPath

```json id="t6t57u"
{
  "jsonPath": "$.case.amount > 1000000"
}
```

Masalah: sulit index, rawan query mahal, dan sulit governance.

---

### 37.4 Semua Field Tetap di Payload

Jika field sering dipakai filter, join, sort, atau constraint, promote menjadi generated/normal column.

---

### 37.5 Test Pakai H2

H2 tidak merepresentasikan behavior PostgreSQL JSONB, GIN, `ON CONFLICT`, row locking, atau `SKIP LOCKED`. Gunakan PostgreSQL asli untuk integration test.

---

## 38. Practical Decision Table

| Need | Pattern |
|---|---|
| Create document | POST + idempotency + insert + audit + outbox |
| Read detail | GET by ID + compatibility reader |
| List/search | Whitelisted query params + summary projection |
| Replace document | PUT + expectedVersion + full payload validation |
| Patch one field | Domain-specific PATCH + `jsonb_set` |
| Transition status | POST transition + expectedStatus + expectedVersion |
| Audit | Same transaction CTE or mapper transaction |
| Event | Outbox in same transaction |
| JSONB write | `CAST(#{payloadJson} AS jsonb)` |
| Stored payload parse | schema version reader |
| Conflict diagnosis | query state after zero-row mutation |
| Testing | PostgreSQL native integration test |

---

## 39. Ringkasan Praktis

```text id="hnjfy8"
Java/Jersey/MyBatis Document Integration
│
├── Jersey
│   ├── domain-specific resources
│   ├── explicit DTOs
│   ├── idempotency headers
│   └── exception mapper
│
├── Service
│   ├── strict writer
│   ├── tolerant reader
│   ├── transaction boundary
│   ├── conflict diagnosis
│   └── authorization/validation
│
├── MyBatis
│   ├── explicit Mapper XML
│   ├── payload::text on read
│   ├── CAST(? AS jsonb) on write
│   ├── CTE mutation with audit/outbox
│   └── dynamic SQL only for whitelisted filters
│
├── PostgreSQL
│   ├── metadata columns
│   ├── jsonb payload
│   ├── schema_version
│   ├── optimistic version
│   ├── audit table
│   └── outbox table
│
└── Production
    ├── idempotency
    ├── observability
    ├── PostgreSQL-native tests
    ├── query/index review
    └── migration compatibility
```

---

# Status

**Seri 12/19 selesai.**

Blok **PostgreSQL Document Database** selesai:

1. Seri 7 - Document table design  
2. Seri 8 - JSON/JSONB operators, functions, JSONPath  
3. Seri 9 - JSONB indexing  
4. Seri 10 - Schema governance  
5. Seri 11 - Mutation, audit, outbox  
6. Seri 12 - Java/Jersey/MyBatis integration for document database  

Berikutnya masuk blok **PostgreSQL Geospatial Database**:

**Seri 13/19 - PostGIS Foundation: geometry, geography, SRID, projection, spatial type, spatial function, dan basic indexing.**

---

**Sources:**

- [Documentation: 18: 9.16. JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com)
- [MyBatis 3 | Mapper XML Files](https://mybatis.org/mybatis-3/sqlmap-xml.html?utm_source=chatgpt.com)
- [Building RESTful Web Services with Jakarta REST](https://jakarta.ee/learn/docs/jakartaee-tutorial/current/websvcs/rest/rest.html?utm_source=chatgpt.com)
- [Postgres INSERT ON CONFLICT with JSONB](https://stackoverflow.com/questions/38980549/postgres-insert-on-conflict-with-jsonb?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:58:18 PM

Saya lanjut ke **Seri 13/19**, mulai blok PostgreSQL Geospatial Database. Fokusnya fondasi PostGIS: `geometry` vs `geography`, SRID/projection, tipe spatial, fungsi dasar, indexing awal, dan jebakan umum latitude/longitude.

# Seri 13/19 - PostGIS Foundation: Geometry, Geography, SRID, Projection, Spatial Type, Function, dan Basic Indexing

## 1. Tujuan Seri Ini

Seri ini membuka blok **PostgreSQL Geospatial Database**. Fokusnya adalah memahami fondasi **PostGIS**, yaitu extension PostgreSQL untuk menyimpan, mengindeks, dan melakukan query data geospatial. PostGIS menambahkan kemampuan penyimpanan, indexing, dan querying geospatial di atas PostgreSQL, termasuk dukungan spatial index berbasis GiST/R-tree dan fungsi GIS untuk analisis serta pemrosesan objek spatial. ([PostGIS](https://postgis.net/?utm_source=chatgpt.com))

Target praktis seri ini:

1. Mengaktifkan PostGIS dengan benar.
2. Memahami `geometry` vs `geography`.
3. Memahami SRID, projection, dan coordinate reference system.
4. Mengenal tipe spatial utama: `Point`, `LineString`, `Polygon`, `MultiPolygon`, dll.
5. Membuat tabel spatial production-ready.
6. Membuat query spatial dasar.
7. Memahami indexing awal dengan GiST.
8. Menghindari kesalahan klasik: salah urutan latitude/longitude, salah SRID, dan salah menghitung jarak.

---

## 2. Mental Model

```text
PostGIS Foundation Mental Model
│
├── PostgreSQL Core
│   ├── table
│   ├── transaction
│   ├── constraint
│   ├── index
│   └── SQL
│
├── PostGIS Extension
│   ├── geometry
│   ├── geography
│   ├── spatial function
│   ├── spatial predicate
│   ├── spatial index
│   └── spatial reference system
│
├── Spatial Data Type
│   ├── Point
│   ├── LineString
│   ├── Polygon
│   ├── MultiPoint
│   ├── MultiLineString
│   ├── MultiPolygon
│   └── GeometryCollection
│
├── Coordinate System
│   ├── SRID
│   ├── EPSG:4326
│   ├── projected coordinate system
│   ├── geographic coordinate system
│   └── transformation
│
├── Query Pattern
│   ├── find by exact location
│   ├── within radius
│   ├── inside polygon
│   ├── intersects boundary
│   ├── nearest location
│   └── spatial join
│
└── Production Concern
    ├── SRID consistency
    ├── index strategy
    ├── validation
    ├── import/export
    ├── query performance
    └── API boundary
```

---

## 3. Enable PostGIS

PostGIS adalah extension, jadi harus diaktifkan di database yang akan dipakai.

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

PostGIS perlu di-enable di setiap database yang akan memakai fitur geospatial; dokumentasi PostGIS menampilkan `CREATE EXTENSION postgis;` sebagai langkah aktivasi. ([PostGIS](https://postgis.net/documentation/getting_started/?utm_source=chatgpt.com))

Untuk migration production:

```sql
-- V001__enable_postgis.sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

Cek versi:

```sql
SELECT postgis_full_version();
```

Practical rule:

```text
Jangan enable PostGIS manual langsung di production.
Masukkan ke Flyway/Liquibase migration agar dev/staging/prod konsisten.
```

---

## 4. `geometry` vs `geography`

Ini keputusan paling penting di awal.

| Aspek | `geometry` | `geography` |
|---|---|---|
| Model bumi | Planar / Cartesian berdasarkan CRS | Spherical/spheroidal earth model |
| Unit jarak | Unit coordinate system / projection | Meter |
| Cocok untuk | Local/regional projected data, polygon, spatial analysis | Global lat/lon distance query |
| Performance | Umumnya lebih fleksibel dan cepat untuk banyak operasi | Bisa lebih mahal karena perhitungan geodesic |
| Fungsi | Dukungan fungsi sangat luas | Dukungan fungsi lebih terbatas dibanding geometry |
| Contoh tipe | `geometry(Point, 4326)` | `geography(Point, 4326)` |
| Risiko utama | Mengira derajat = meter | Lebih lambat/terbatas untuk operasi kompleks |

Dokumentasi `ST_DWithin` menyatakan bahwa untuk `geometry`, jarak menggunakan unit dari spatial reference system geometry, sedangkan untuk `geography`, unit jaraknya meter dan pengukuran default memakai spheroid. ([PostGIS](https://postgis.net/docs/ST_DWithin.html?utm_source=chatgpt.com))

### Rule praktis

```text
Gunakan geometry jika:
  - data berada di area lokal/regional
  - butuh banyak operasi GIS
  - bisa memakai projection yang benar
  - butuh polygon/boundary operation intensif

Gunakan geography jika:
  - data latitude/longitude global
  - query utama adalah jarak dalam meter
  - operasi spatial relatif sederhana
```

---

## 5. SRID dan Projection

**SRID** adalah identifier untuk spatial reference system. Contoh paling umum untuk GPS latitude/longitude adalah **EPSG:4326 / WGS84**.

Contoh `Point` dengan SRID 4326:

```sql
ST_SetSRID(ST_MakePoint(106.8456, -6.2088), 4326)
```

Urutan penting:

```text
ST_MakePoint(longitude, latitude)
```

Untuk Jakarta:

```text
longitude = 106.8456
latitude  = -6.2088
```

Bukan sebaliknya.

---

## 6. `ST_SetSRID` vs `ST_Transform`

Ini sering tertukar.

| Fungsi | Makna |
|---|---|
| `ST_SetSRID(geom, srid)` | Memberi label SRID ke geometry tanpa mengubah koordinat |
| `ST_Transform(geom, srid)` | Mengubah koordinat dari satu CRS ke CRS lain |

Dokumentasi PostGIS menegaskan bahwa `ST_Transform` benar-benar mengubah koordinat geometry dari satu spatial reference system ke yang lain, sedangkan `ST_SetSRID` hanya mengubah/menetapkan identifier SRID tanpa transformasi koordinat. ([PostGIS](https://postgis.net/docs/ST_Transform.html?utm_source=chatgpt.com))

### Contoh benar

```sql
-- Membuat point lon/lat WGS84
SELECT ST_SetSRID(ST_MakePoint(106.8456, -6.2088), 4326);
```

### Contoh transformasi

```sql
-- Transform geometry dari EPSG:4326 ke Web Mercator EPSG:3857
SELECT ST_Transform(
    ST_SetSRID(ST_MakePoint(106.8456, -6.2088), 4326),
    3857
);
```

### Anti-pattern

```sql
-- Salah: ini hanya mengganti label SRID, bukan mengubah koordinat
SELECT ST_SetSRID(existing_geom, 3857);
```

Jika `existing_geom` sebenarnya masih koordinat lon/lat EPSG:4326, query di atas membuat data misleading.

---

## 7. Spatial Type Utama

| Type | Contoh use case |
|---|---|
| `Point` | lokasi kantor, rumah, cabang, ATM, customer location |
| `LineString` | jalan, rute, pipa, kabel, boundary line |
| `Polygon` | area layanan, zona risiko, wilayah administrasi |
| `MultiPoint` | kumpulan titik |
| `MultiLineString` | beberapa line dalam satu entity |
| `MultiPolygon` | wilayah dengan banyak polygon, misalnya provinsi/kabupaten kepulauan |
| `GeometryCollection` | campuran beberapa geometry type |

Contoh table point:

```sql
CREATE TABLE service_location (
    location_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    status text NOT NULL,
    location geometry(Point, 4326) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_service_location_status
        CHECK (status IN ('ACTIVE', 'INACTIVE'))
);
```

Contoh table polygon:

```sql
CREATE TABLE service_area (
    area_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,
    area_code text NOT NULL,
    area_name text NOT NULL,
    status text NOT NULL,
    boundary geometry(MultiPolygon, 4326) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_service_area_code
        UNIQUE (tenant_id, area_code),

    CONSTRAINT ck_service_area_status
        CHECK (status IN ('ACTIVE', 'INACTIVE'))
);
```

---

## 8. `Point`: Lokasi Titik

### Insert point

```sql
INSERT INTO service_location (
    location_id,
    tenant_id,
    name,
    status,
    location
)
VALUES (
    gen_random_uuid(),
    :tenantId,
    'Jakarta Office',
    'ACTIVE',
    ST_SetSRID(ST_MakePoint(106.8456, -6.2088), 4326)
);
```

### Read lon/lat

```sql
SELECT
    location_id,
    name,
    ST_X(location) AS longitude,
    ST_Y(location) AS latitude
FROM service_location
WHERE tenant_id = :tenantId;
```

### Practical reminder

```text
ST_X = longitude
ST_Y = latitude
```

Banyak bug geospatial berasal dari `lat/lon` tertukar.

---

## 9. `Polygon` / `MultiPolygon`: Boundary Area

Boundary biasanya dipakai untuk:

| Use case | Contoh |
|---|---|
| Service area | area cabang melayani pelanggan |
| Jurisdiction | wilayah regulator/cabang/unit kerja |
| Risk zone | zona rawan fraud atau restricted area |
| Delivery area | cakupan pengiriman |
| Administrative boundary | provinsi/kota/kecamatan |

Contoh query point-in-polygon:

```sql
SELECT
    a.area_id,
    a.area_code,
    a.area_name
FROM service_area a
WHERE a.tenant_id = :tenantId
  AND a.status = 'ACTIVE'
  AND ST_Contains(
      a.boundary,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
  );
```

Untuk boundary matching, biasanya `ST_Contains`, `ST_Within`, atau `ST_Intersects` dipakai sesuai semantic:

| Function | Makna umum |
|---|---|
| `ST_Contains(a, b)` | `a` mengandung `b` |
| `ST_Within(a, b)` | `a` berada di dalam `b` |
| `ST_Intersects(a, b)` | `a` dan `b` bersinggungan/beririsan |

---

## 10. Basic Spatial Predicate

| Predicate | Use case |
|---|---|
| `ST_Intersects(a,b)` | cari area yang bersinggungan dengan area lain |
| `ST_Contains(a,b)` | polygon mengandung point/polygon lain |
| `ST_Within(a,b)` | point berada di dalam polygon |
| `ST_Touches(a,b)` | boundary bersentuhan |
| `ST_Overlaps(a,b)` | area overlap sebagian |
| `ST_Equals(a,b)` | geometry sama secara spatial |
| `ST_Disjoint(a,b)` | tidak beririsan |

Contoh `ST_Within`:

```sql
SELECT
    l.location_id,
    l.name,
    a.area_name
FROM service_location l
JOIN service_area a
  ON ST_Within(l.location, a.boundary)
WHERE l.tenant_id = :tenantId
  AND a.tenant_id = :tenantId
  AND l.status = 'ACTIVE'
  AND a.status = 'ACTIVE';
```

---

## 11. Distance Query: `ST_DWithin` vs `ST_Distance`

Untuk mencari lokasi dalam radius, gunakan `ST_DWithin`, bukan langsung `ST_Distance(...) <= radius`.

Contoh dengan `geography` supaya radius dalam meter:

```sql
SELECT
    location_id,
    name
FROM service_location
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND ST_DWithin(
      location::geography,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
      :radiusMeters
  );
```

Dokumentasi `ST_DWithin` menjelaskan bahwa untuk `geometry`, jarak memakai unit spatial reference system geometry; untuk `geography`, jarak dalam meter. ([PostGIS](https://postgis.net/docs/ST_DWithin.html?utm_source=chatgpt.com))

Untuk menghitung jarak:

```sql
SELECT
    location_id,
    name,
    ST_Distance(
        location::geography,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
    ) AS distance_meters
FROM service_location
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
ORDER BY distance_meters
LIMIT 10;
```

Dokumentasi `ST_Distance` menyatakan bahwa untuk `geometry`, hasilnya minimum 2D Cartesian distance dalam unit spatial reference; jadi jika memakai EPSG:4326 geometry langsung, unitnya derajat, bukan meter. ([PostGIS](https://postgis.net/docs/ST_Distance.html?utm_source=chatgpt.com))

---

## 12. Basic Spatial Indexing

Spatial index adalah fondasi performa PostGIS.

### GiST index untuk `geometry`

```sql
CREATE INDEX idx_service_location_location_gist
    ON service_location
    USING gist (location);
```

```sql
CREATE INDEX idx_service_area_boundary_gist
    ON service_area
    USING gist (boundary);
```

PostGIS memakai R-tree yang diimplementasikan di atas GiST untuk spatial indexing; GiST adalah index yang umum dan versatile untuk data multi-dimensional. ([pgEdge Documentation](https://docs.pgedge.com/postgis/development/data-management/spatial-indexes/?utm_source=chatgpt.com))

### B-tree tetap diperlukan

Jangan hanya spatial index. Query production biasanya juga punya filter tenant/status.

```sql
CREATE INDEX idx_service_location_tenant_status
    ON service_location (tenant_id, status);

CREATE INDEX idx_service_area_tenant_status
    ON service_area (tenant_id, status);
```

Practical rule:

```text
Spatial index mempercepat spatial predicate.
B-tree index mempercepat tenant/status/filter biasa.
Keduanya sering dibutuhkan bersama.
```

---

## 13. Partial Spatial Index

Jika hanya data aktif yang sering di-query:

```sql
CREATE INDEX idx_service_location_active_location_gist
    ON service_location
    USING gist (location)
    WHERE status = 'ACTIVE';
```

Untuk multi-tenant data besar, bisa juga:

```sql
CREATE INDEX idx_service_area_active_boundary_gist
    ON service_area
    USING gist (boundary)
    WHERE status = 'ACTIVE';
```

Partial spatial index berguna jika:

| Kondisi | Alasan |
|---|---|
| Banyak data archived/inactive | Index lebih kecil |
| Query hampir selalu `status='ACTIVE'` | Predicate match |
| Data spatial besar | Maintenance lebih murah |
| Hot subset kecil | Query lebih cepat |

---

## 14. Geometry Validity

Spatial data eksternal sering kotor: polygon self-intersect, ring salah, duplicate point, atau boundary invalid.

Cek validity:

```sql
SELECT
    area_id,
    area_code,
    ST_IsValid(boundary) AS is_valid,
    ST_IsValidReason(boundary) AS invalid_reason
FROM service_area
WHERE NOT ST_IsValid(boundary);
```

Repair sederhana:

```sql
UPDATE service_area
SET boundary = ST_MakeValid(boundary)
WHERE NOT ST_IsValid(boundary);
```

Practical caveat:

```text
ST_MakeValid membantu memperbaiki geometry invalid,
tetapi hasilnya tetap harus direview secara domain.
Jangan blindly repair regulatory boundary tanpa validasi.
```

---

## 15. SRID Consistency Constraint

Walaupun kolom sudah bertipe `geometry(Point, 4326)`, validasi eksplisit kadang berguna saat import/staging.

```sql
ALTER TABLE service_location
ADD CONSTRAINT ck_service_location_srid_4326
CHECK (ST_SRID(location) = 4326);
```

Untuk boundary:

```sql
ALTER TABLE service_area
ADD CONSTRAINT ck_service_area_srid_4326
CHECK (ST_SRID(boundary) = 4326);
```

Cek geometry type:

```sql
ALTER TABLE service_area
ADD CONSTRAINT ck_service_area_geometry_type
CHECK (GeometryType(boundary) IN ('MULTIPOLYGON', 'POLYGON'));
```

Namun jika kolom dideklarasikan `geometry(MultiPolygon, 4326)`, PostGIS sudah membantu membatasi tipe dan SRID saat insert.

---

## 16. Import Data Spatial

Format umum data spatial:

| Format | Use case |
|---|---|
| WKT | SQL/manual/debug sederhana |
| WKB | binary interchange |
| GeoJSON | API/web/map integration |
| Shapefile | legacy GIS dataset |
| KML | map/GIS interchange |
| CSV lon/lat | simple point import |

### Insert dari WKT

```sql
INSERT INTO service_area (
    area_id,
    tenant_id,
    area_code,
    area_name,
    status,
    boundary
)
VALUES (
    gen_random_uuid(),
    :tenantId,
    'JKT-CENTRAL',
    'Jakarta Central Area',
    'ACTIVE',
    ST_GeomFromText(
        'MULTIPOLYGON(((106.8 -6.2, 106.9 -6.2, 106.9 -6.1, 106.8 -6.1, 106.8 -6.2)))',
        4326
    )
);
```

### Insert dari GeoJSON

```sql
INSERT INTO service_area (
    area_id,
    tenant_id,
    area_code,
    area_name,
    status,
    boundary
)
VALUES (
    gen_random_uuid(),
    :tenantId,
    :areaCode,
    :areaName,
    'ACTIVE',
    ST_SetSRID(ST_GeomFromGeoJSON(:geojson), 4326)
);
```

Practical caveat:

```text
GeoJSON umumnya memakai lon/lat WGS84.
Tetap validasi SRID, type, dan validity setelah import.
```

---

## 17. API Boundary: Jangan Terima Geometry Bebas Tanpa Validasi

Buruk:

```http
POST /areas
{
  "wkt": "whatever user sends"
}
```

Lebih aman:

```http
POST /service-areas
{
  "areaCode": "JKT-CENTRAL",
  "areaName": "Jakarta Central Area",
  "boundaryGeoJson": {
    "type": "MultiPolygon",
    "coordinates": [...]
  }
}
```

Validasi di service:

| Validasi | Contoh |
|---|---|
| Geometry type | harus `Polygon` atau `MultiPolygon` |
| SRID | diasumsikan/ditetapkan 4326 |
| Validity | `ST_IsValid` |
| Size limit | coordinate count maksimum |
| Boundary extent | harus dalam negara/region yang valid |
| Area minimum/maksimum | mencegah geometry aneh |
| Tenant ownership | area milik tenant |

---

## 18. Production Table Pattern: Location

```sql
CREATE TABLE branch_location (
    branch_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    branch_code text NOT NULL,
    branch_name text NOT NULL,

    status text NOT NULL,
    location geometry(Point, 4326) NOT NULL,

    address_text text NULL,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_branch_location_code
        UNIQUE (tenant_id, branch_code),

    CONSTRAINT ck_branch_location_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'CLOSED')),

    CONSTRAINT ck_branch_location_metadata_object
        CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX idx_branch_location_tenant_status
    ON branch_location (tenant_id, status);

CREATE INDEX idx_branch_location_location_gist
    ON branch_location
    USING gist (location)
    WHERE status = 'ACTIVE';
```

---

## 19. Production Table Pattern: Area / Boundary

```sql
CREATE TABLE jurisdiction_area (
    jurisdiction_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    jurisdiction_code text NOT NULL,
    jurisdiction_name text NOT NULL,

    level text NOT NULL,
    status text NOT NULL,

    boundary geometry(MultiPolygon, 4326) NOT NULL,

    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_jurisdiction_area_code
        UNIQUE (tenant_id, jurisdiction_code),

    CONSTRAINT ck_jurisdiction_area_level
        CHECK (level IN ('COUNTRY', 'PROVINCE', 'CITY', 'DISTRICT', 'CUSTOM')),

    CONSTRAINT ck_jurisdiction_area_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),

    CONSTRAINT ck_jurisdiction_area_metadata_object
        CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX idx_jurisdiction_area_tenant_level_status
    ON jurisdiction_area (tenant_id, level, status);

CREATE INDEX idx_jurisdiction_area_boundary_gist
    ON jurisdiction_area
    USING gist (boundary)
    WHERE status = 'ACTIVE';
```

---

## 20. Query Pattern: Find Area for Point

```sql
SELECT
    a.jurisdiction_id,
    a.jurisdiction_code,
    a.jurisdiction_name,
    a.level
FROM jurisdiction_area a
WHERE a.tenant_id = :tenantId
  AND a.status = 'ACTIVE'
  AND ST_Contains(
      a.boundary,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
  )
ORDER BY
    CASE a.level
        WHEN 'DISTRICT' THEN 1
        WHEN 'CITY' THEN 2
        WHEN 'PROVINCE' THEN 3
        WHEN 'COUNTRY' THEN 4
        ELSE 9
    END
LIMIT 1;
```

Use case:

| Domain | Contoh |
|---|---|
| Regulatory | tentukan yurisdiksi kasus |
| Case routing | assign case ke regional office |
| Service coverage | cek apakah customer berada di area layanan |
| Risk control | cek apakah lokasi masuk restricted area |

---

## 21. Query Pattern: Find Nearby Branches

```sql
SELECT
    branch_id,
    branch_code,
    branch_name,
    ST_Distance(
        location::geography,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
    ) AS distance_meters
FROM branch_location
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND ST_DWithin(
      location::geography,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
      :radiusMeters
  )
ORDER BY distance_meters
LIMIT :limit;
```

Jika query jarak dalam meter dan data lon/lat global, casting ke `geography` sering lebih natural. Namun untuk workload besar, perlu benchmark dan mungkin gunakan kolom generated/stored geography atau projection sesuai kebutuhan.

---

## 22. Query Pattern: Spatial Join

Cari branch yang berada dalam jurisdiction area:

```sql
SELECT
    b.branch_id,
    b.branch_code,
    b.branch_name,
    a.jurisdiction_code,
    a.jurisdiction_name
FROM branch_location b
JOIN jurisdiction_area a
  ON b.tenant_id = a.tenant_id
 AND ST_Within(b.location, a.boundary)
WHERE b.tenant_id = :tenantId
  AND b.status = 'ACTIVE'
  AND a.status = 'ACTIVE';
```

Spatial join bisa mahal. Guardrail:

| Guardrail | Alasan |
|---|---|
| Filter tenant/status dulu | Kurangi candidate |
| Pastikan spatial index ada | Hindari full nested scan |
| Batasi level area | Jangan join semua boundary |
| Materialize mapping jika static | Branch-area mapping jarang berubah |
| Cek `EXPLAIN ANALYZE` | Validasi planner |

---

## 23. Basic EXPLAIN untuk Spatial Query

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    branch_id,
    branch_code,
    branch_name
FROM branch_location
WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
  AND status = 'ACTIVE'
  AND ST_DWithin(
      location::geography,
      ST_SetSRID(ST_MakePoint(106.8456, -6.2088), 4326)::geography,
      5000
  );
```

Hal yang dicari:

| Plan symptom | Interpretasi |
|---|---|
| Seq Scan pada tabel besar | Index/filter tidak efektif |
| Index Scan / Bitmap Index Scan | Lebih baik |
| Banyak rows removed by filter | Index terlalu longgar |
| Banyak shared read blocks | I/O heavy |
| Spatial predicate dievaluasi banyak row | Perlu bounding/filter awal |
| Sort besar | Perlu index/order strategy |

Untuk `geometry`, GiST index pada column geometry biasanya lebih langsung. Untuk `geography` cast on-the-fly, pertimbangkan strategi khusus jika query sangat sering.

---

## 24. Geometry vs Geography Storage Pattern

### Option A - Simpan `geometry(Point, 4326)`

```sql
location geometry(Point, 4326) NOT NULL
```

Kelebihan:

- fleksibel untuk GIS operation,
- index GiST umum,
- cocok untuk spatial join dengan polygon,
- umum dipakai untuk geometry data.

Kekurangan:

- distance unit dalam EPSG:4326 adalah derajat jika pakai geometry langsung,
- untuk meter perlu transformasi/projection atau cast geography.

### Option B - Simpan `geography(Point, 4326)`

```sql
location geography(Point, 4326) NOT NULL
```

Kelebihan:

- distance meter natural,
- cocok untuk radius query global.

Kekurangan:

- fungsi lebih terbatas,
- operasi bisa lebih mahal,
- spatial polygon/analysis sering lebih natural dengan geometry.

### Option C - Simpan geometry + generated geography

```sql
location geometry(Point, 4326) NOT NULL,
location_geog geography(Point, 4326)
    GENERATED ALWAYS AS (location::geography) STORED
```

Lalu:

```sql
CREATE INDEX idx_branch_location_geog_gist
    ON branch_location
    USING gist (location_geog);
```

Pattern ini bisa berguna jika butuh geometry untuk GIS operation dan geography untuk radius meter query.

---

## 25. Common Failure Modes

| Failure mode | Penyebab | Mitigasi |
|---|---|---|
| Lat/lon tertukar | `ST_MakePoint(lat, lon)` | Selalu `ST_MakePoint(lon, lat)` |
| Jarak salah | Pakai geometry EPSG:4326 lalu dianggap meter | Pakai geography atau transform projection |
| SRID salah | `ST_SetSRID` dipakai sebagai transform | Gunakan `ST_Transform` untuk ubah CRS |
| Spatial query lambat | Tidak ada GiST index | Buat spatial index |
| Index tidak dipakai | Cast/expression tidak match index | Sesuaikan storage/index/query |
| Polygon invalid | Data import kotor | `ST_IsValid`, `ST_MakeValid`, manual review |
| Boundary terlalu detail | Geometry besar | Simplify/materialize sesuai use case |
| Spatial join berat | Candidate terlalu banyak | Filter metadata, materialized mapping |
| Multi-tenant leakage | Tenant hanya di metadata JSON | `tenant_id` kolom wajib |
| API menerima geometry liar | Tidak ada validation | Type/SRID/size/validity checks |

---

## 26. Anti-Pattern

### 26.1 Simpan Latitude/Longitude Saja

```sql
CREATE TABLE location_bad (
    id uuid PRIMARY KEY,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL
);
```

Ini tidak selalu salah untuk storage sederhana, tetapi buruk jika perlu:

- radius query,
- spatial join,
- point-in-polygon,
- nearest neighbor,
- spatial index,
- GIS import/export.

Lebih baik:

```sql
location geometry(Point, 4326) NOT NULL
```

---

### 26.2 Hitung Distance dengan Geometry 4326 dan Menganggap Meter

```sql
SELECT ST_Distance(
    ST_SetSRID(ST_MakePoint(106.8456, -6.2088), 4326),
    ST_SetSRID(ST_MakePoint(106.9000, -6.2500), 4326)
);
```

Hasilnya dalam derajat, bukan meter, karena `geometry` memakai unit spatial reference system. Untuk meter, pakai `geography` atau transform ke projected CRS yang sesuai. ([PostGIS](https://postgis.net/docs/ST_Distance.html?utm_source=chatgpt.com))

---

### 26.3 `ST_SetSRID` untuk Mengubah Projection

```sql
-- Salah jika tujuannya mengubah koordinat
ST_SetSRID(geom, 3857)
```

Gunakan:

```sql
ST_Transform(geom, 3857)
```

Karena `ST_SetSRID` hanya menetapkan SRID identifier, sedangkan `ST_Transform` mengubah koordinat. ([PostGIS](https://postgis.net/docs/ST_Transform.html?utm_source=chatgpt.com))

---

## 27. Practical Decision Table

| Need | Recommended pattern |
|---|---|
| Simpan lokasi titik GPS | `geometry(Point, 4326)` |
| Radius query dalam meter global | `geography` atau `geometry::geography` |
| Banyak operation polygon/boundary | `geometry` |
| Point-in-polygon | `ST_Contains` / `ST_Within` |
| Cari objek dalam radius | `ST_DWithin` |
| Hitung jarak | `ST_Distance`, pahami unit |
| Transform CRS | `ST_Transform` |
| Set SRID setelah create point | `ST_SetSRID` |
| Index spatial geometry | `USING gist (geom)` |
| Filter tenant/status | B-tree index |
| Boundary data eksternal | Validate with `ST_IsValid` |
| Query spatial berat berulang | Materialized/projection table |

---

## 28. Minimal Cheat Sheet

| Function / Concept | Fungsi praktis |
|---|---|
| `CREATE EXTENSION postgis` | Enable PostGIS di database |
| `geometry(Point, 4326)` | Simpan point lon/lat WGS84 |
| `geography(Point, 4326)` | Simpan point untuk distance meter |
| `ST_MakePoint(lon, lat)` | Membuat point |
| `ST_SetSRID(geom, 4326)` | Menetapkan SRID |
| `ST_Transform(geom, srid)` | Transform koordinat ke CRS lain |
| `ST_X(point)` | Ambil longitude |
| `ST_Y(point)` | Ambil latitude |
| `ST_Contains(a,b)` | Cek geometry `a` mengandung `b` |
| `ST_Within(a,b)` | Cek geometry `a` di dalam `b` |
| `ST_Intersects(a,b)` | Cek geometry saling beririsan |
| `ST_DWithin(a,b,d)` | Cek jarak dalam radius |
| `ST_Distance(a,b)` | Hitung jarak |
| `ST_IsValid(geom)` | Cek geometry valid |
| `ST_MakeValid(geom)` | Perbaiki geometry invalid |
| `USING gist(geom)` | Spatial index umum |

---

## 29. Production Checklist

| Checklist | Status |
|---|---|
| PostGIS enabled via migration | Wajib |
| Spatial column typed dengan geometry/geography yang jelas | Wajib |
| SRID eksplisit | Wajib |
| Longitude/latitude order disepakati | Wajib |
| Spatial index GiST dibuat | Wajib untuk query spatial besar |
| B-tree tenant/status index dibuat | Wajib |
| Geometry validity dicek saat import | Wajib |
| API tidak menerima geometry bebas tanpa validasi | Wajib |
| Jarak meter tidak dihitung dari geometry 4326 mentah | Wajib |
| `ST_SetSRID` vs `ST_Transform` dipahami | Wajib |
| Query spatial diuji dengan `EXPLAIN ANALYZE` | Wajib |
| Boundary besar dimaterialize/simplify jika perlu | Disarankan |
| Spatial join dimonitor | Disarankan |

---

## 30. Ringkasan Praktis

```text
PostGIS Foundation Rule
│
├── Enable
│   └── CREATE EXTENSION postgis via migration
│
├── Choose type
│   ├── geometry for GIS operation and projected/local analysis
│   └── geography for meter-based global distance
│
├── Always control SRID
│   ├── ST_SetSRID labels geometry
│   └── ST_Transform changes coordinates
│
├── Store spatial data properly
│   ├── Point for location
│   ├── Polygon/MultiPolygon for area
│   └── avoid raw lat/lon-only model for spatial query
│
├── Query safely
│   ├── ST_DWithin for radius
│   ├── ST_Distance for distance calculation
│   ├── ST_Contains/ST_Within for boundary
│   └── ST_Intersects for overlap
│
├── Index correctly
│   ├── GiST for spatial column
│   ├── B-tree for tenant/status
│   └── partial index for active data
│
└── Validate data
    ├── SRID
    ├── geometry type
    ├── validity
    ├── coordinate order
    └── business boundary
```

---

# Status

**Seri 13/19 selesai.**

Berikutnya: **Seri 14/19 - Spatial Data Modeling: point, line, polygon, multipolygon, boundary, service area, jurisdiction, metadata, import pipeline, dan table design production-style.**

---

**Sources:**

- [PostGIS](https://postgis.net/?utm_source=chatgpt.com)
- [Spatial Indexes](https://docs.pgedge.com/postgis/development/data-management/spatial-indexes/?utm_source=chatgpt.com)

## Response:
7/15/2026, 9:00:00 PM

# Seri 14/19 - Spatial Data Modeling: Point, Line, Polygon, MultiPolygon, Boundary, Service Area, Jurisdiction, Metadata, Import Pipeline

## 1. Tujuan Seri Ini

Seri ini membahas **cara memodelkan data spatial di PostgreSQL/PostGIS** secara production-style.

Di Seri 13 kita membahas fondasi: `geometry`, `geography`, SRID, projection, spatial function, dan basic index. Seri 14 ini fokus pada desain model data:

1. Kapan memakai `Point`, `LineString`, `Polygon`, `MultiPolygon`.
2. Cara mendesain table lokasi, area layanan, jurisdiction, route/line, dan boundary.
3. Cara memisahkan metadata relational, geometry, dan flexible metadata JSONB.
4. Cara membuat import pipeline dari GeoJSON/WKT/CSV.
5. Cara validasi spatial data sebelum masuk production.
6. Cara menangani boundary besar, invalid geometry, dan multi-tenant ownership.
7. Cara menyiapkan data agar siap dipakai oleh Jersey/MyBatis API.

PostGIS menambahkan kemampuan PostgreSQL untuk menyimpan, mengindeks, dan melakukan query geospatial data. Fungsi seperti `ST_GeomFromGeoJSON`, `ST_IsValid`, `ST_MakeValid`, `ST_Subdivide`, dan spatial relationship functions adalah fondasi penting untuk data modeling dan import pipeline. ([PostGIS](https://postgis.net/?utm_source=chatgpt.com))

---

## 2. Mental Model

```text id="fsjkcq"
Spatial Data Modeling
│
├── Spatial Identity
│   ├── tenant_id
│   ├── business code
│   ├── spatial type
│   ├── status
│   └── version
│
├── Geometry Column
│   ├── Point
│   ├── LineString
│   ├── Polygon
│   ├── MultiPolygon
│   └── SRID
│
├── Relational Metadata
│   ├── name
│   ├── level/type
│   ├── ownership
│   ├── lifecycle status
│   ├── source system
│   └── effective date
│
├── Flexible Metadata
│   ├── metadata jsonb
│   ├── external attributes
│   ├── display config
│   └── source import details
│
├── Validation
│   ├── SRID check
│   ├── geometry type check
│   ├── validity check
│   ├── coordinate bounds
│   ├── duplicate check
│   └── business rule check
│
└── Operational Pattern
    ├── staging table
    ├── validation query
    ├── repair/review
    ├── promote to production
    ├── index
    └── audit/versioning
```

---

## 3. Pilihan Spatial Type

| Tipe | Cocok untuk | Contoh domain |
|---|---|---|
| `Point` | Lokasi tunggal | cabang, kantor, ATM, customer pin location, merchant |
| `LineString` | Jalur tunggal | jalan, route, pipa, kabel, jalur inspeksi |
| `MultiLineString` | Kumpulan jalur | jaringan jalan per area, multi-segment route |
| `Polygon` | Area tunggal sederhana | area layanan kecil, zona custom |
| `MultiPolygon` | Area banyak polygon | provinsi/kabupaten kepulauan, service area multi-cluster |
| `GeometryCollection` | Campuran geometry | jarang dipakai untuk model production utama |

Rule praktis:

```text id="orxje1"
Point       = lokasi
LineString  = jalur
Polygon     = area tunggal
MultiPolygon= area kompleks / multi-area
```

Untuk production schema, lebih baik deklarasikan tipe spesifik:

```sql id="xsafuc"
location geometry(Point, 4326)
boundary geometry(MultiPolygon, 4326)
route geometry(LineString, 4326)
```

daripada terlalu generic:

```sql id="vz8i4p"
geom geometry
```

Karena tipe spesifik membantu validasi, dokumentasi schema, dan mencegah data campur-aduk.

---

## 4. Rule Besar Spatial Modeling

```text id="jzejgl"
Jangan taruh semua hal spatial ke satu tabel generic "geo_object".
```

Anti-pattern:

```sql id="fk2k1t"
CREATE TABLE geo_object_bad (
    id uuid PRIMARY KEY,
    object_type text NOT NULL,
    geom geometry NOT NULL,
    metadata jsonb NOT NULL
);
```

Masalah:

| Masalah | Dampak |
|---|---|
| Semua tipe campur | Query dan index sulit |
| Tidak ada constraint domain | Point bisa masuk sebagai boundary |
| Metadata jadi dumping ground | Data governance lemah |
| Lifecycle tidak jelas | Active/archive/status campur |
| API sulit domain-specific | Semua endpoint jadi generic |
| Spatial predicate tidak optimal | Query harus cek type terus |

Lebih baik pisahkan berdasarkan domain:

```text id="aonroe"
branch_location
jurisdiction_area
service_area
route_segment
restricted_zone
customer_location_snapshot
```

---

## 5. Model 1 - Point Location

### Use case

| Use case | Contoh |
|---|---|
| Branch location | kantor cabang |
| Merchant location | lokasi merchant |
| Customer submitted location | lokasi pelaporan |
| Device location snapshot | lokasi perangkat |
| Facility location | gudang, ATM, agent outlet |

### Table

```sql id="f823p5"
CREATE TABLE branch_location (
    branch_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    branch_code text NOT NULL,
    branch_name text NOT NULL,

    status text NOT NULL,
    location geometry(Point, 4326) NOT NULL,

    address_text text NULL,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

    source_system text NULL,
    source_reference text NULL,

    version bigint NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by text NULL,
    updated_by text NULL,

    CONSTRAINT uq_branch_location_code
        UNIQUE (tenant_id, branch_code),

    CONSTRAINT ck_branch_location_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'CLOSED')),

    CONSTRAINT ck_branch_location_metadata_object
        CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX idx_branch_location_tenant_status
    ON branch_location (tenant_id, status);

CREATE INDEX idx_branch_location_location_gist
    ON branch_location
    USING gist (location)
    WHERE status = 'ACTIVE';
```

### Insert

```sql id="h73jdu"
INSERT INTO branch_location (
    branch_id,
    tenant_id,
    branch_code,
    branch_name,
    status,
    location,
    address_text,
    metadata,
    created_by,
    updated_by
)
VALUES (
    :branchId,
    :tenantId,
    :branchCode,
    :branchName,
    'ACTIVE',
    ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326),
    :addressText,
    CAST(:metadataJson AS jsonb),
    :actor,
    :actor
);
```

Ingat:

```text id="f6918g"
ST_MakePoint(longitude, latitude)
ST_X(point) = longitude
ST_Y(point) = latitude
```

---

## 6. Model 2 - Customer Location Snapshot

Untuk lokasi customer/user/device, jangan selalu update satu row saja. Kadang perlu snapshot historis.

```sql id="zqokdc"
CREATE TABLE customer_location_snapshot (
    snapshot_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    customer_id text NOT NULL,
    source text NOT NULL,

    location geometry(Point, 4326) NOT NULL,
    accuracy_meters numeric(12,2) NULL,

    captured_at timestamptz NOT NULL,
    received_at timestamptz NOT NULL DEFAULT now(),

    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

    CONSTRAINT ck_customer_location_source
        CHECK (source IN ('MOBILE_APP', 'WEB', 'BRANCH', 'IMPORT', 'PROVIDER')),

    CONSTRAINT ck_customer_location_accuracy
        CHECK (accuracy_meters IS NULL OR accuracy_meters >= 0),

    CONSTRAINT ck_customer_location_metadata_object
        CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX idx_customer_location_customer_time
    ON customer_location_snapshot (tenant_id, customer_id, captured_at DESC);

CREATE INDEX idx_customer_location_location_gist
    ON customer_location_snapshot
    USING gist (location);
```

Kapan pakai snapshot?

| Kondisi | Alasan |
|---|---|
| Lokasi berubah dari waktu ke waktu | Butuh histori |
| Butuh audit/tracing | Lokasi saat submit command penting |
| Butuh fraud/risk analysis | Pergerakan/lokasi historis |
| Data datang dari provider | Bisa duplicate/retry |
| Event-driven workflow | Snapshot immutable lebih aman |

---

## 7. Model 3 - Service Area / Coverage Area

Service area biasanya berupa polygon/multipolygon.

```sql id="5hp2es"
CREATE TABLE service_area (
    area_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    area_code text NOT NULL,
    area_name text NOT NULL,

    area_type text NOT NULL,
    status text NOT NULL,

    boundary geometry(MultiPolygon, 4326) NOT NULL,

    effective_from timestamptz NULL,
    effective_until timestamptz NULL,

    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

    version bigint NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_service_area_code
        UNIQUE (tenant_id, area_code),

    CONSTRAINT ck_service_area_type
        CHECK (area_type IN ('DELIVERY', 'BRANCH_COVERAGE', 'SALES', 'SUPPORT', 'CUSTOM')),

    CONSTRAINT ck_service_area_status
        CHECK (status IN ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED')),

    CONSTRAINT ck_service_area_effective_window
        CHECK (
            effective_from IS NULL
            OR effective_until IS NULL
            OR effective_from < effective_until
        ),

    CONSTRAINT ck_service_area_metadata_object
        CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX idx_service_area_tenant_type_status
    ON service_area (tenant_id, area_type, status);

CREATE INDEX idx_service_area_boundary_gist
    ON service_area
    USING gist (boundary)
    WHERE status = 'ACTIVE';
```

### Query: cek apakah titik masuk service area

```sql id="gm8v3u"
SELECT
    area_id,
    area_code,
    area_name
FROM service_area
WHERE tenant_id = :tenantId
  AND area_type = :areaType
  AND status = 'ACTIVE'
  AND (effective_from IS NULL OR effective_from <= now())
  AND (effective_until IS NULL OR effective_until > now())
  AND ST_Contains(
      boundary,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
  );
```

PostGIS spatial relationship functions seperti `ST_Contains`, `ST_Within`, dan `ST_Intersects` digunakan untuk menguji relasi spatial antar geometry. `ST_Intersects`, misalnya, bernilai true jika dua shape memiliki ruang yang sama, baik boundary maupun interior. ([PostGIS](https://postgis.net/workshops/postgis-intro/spatial_relationships.html?utm_source=chatgpt.com))

---

## 8. Model 4 - Jurisdiction / Administrative Boundary

Jurisdiction biasanya hierarchical: country → province → city → district.

```sql id="s2pxk9"
CREATE TABLE jurisdiction_area (
    jurisdiction_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    jurisdiction_code text NOT NULL,
    jurisdiction_name text NOT NULL,

    level text NOT NULL,
    parent_jurisdiction_id uuid NULL,

    status text NOT NULL,
    boundary geometry(MultiPolygon, 4326) NOT NULL,

    source_system text NULL,
    source_reference text NULL,
    source_version text NULL,

    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

    version bigint NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_jurisdiction_area_code
        UNIQUE (tenant_id, jurisdiction_code),

    CONSTRAINT fk_jurisdiction_parent
        FOREIGN KEY (parent_jurisdiction_id)
        REFERENCES jurisdiction_area (jurisdiction_id),

    CONSTRAINT ck_jurisdiction_area_level
        CHECK (level IN ('COUNTRY', 'PROVINCE', 'CITY', 'DISTRICT', 'SUBDISTRICT', 'CUSTOM')),

    CONSTRAINT ck_jurisdiction_area_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),

    CONSTRAINT ck_jurisdiction_area_metadata_object
        CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX idx_jurisdiction_area_tenant_level_status
    ON jurisdiction_area (tenant_id, level, status);

CREATE INDEX idx_jurisdiction_area_parent
    ON jurisdiction_area (tenant_id, parent_jurisdiction_id);

CREATE INDEX idx_jurisdiction_area_boundary_gist
    ON jurisdiction_area
    USING gist (boundary)
    WHERE status = 'ACTIVE';
```

### Query: cari jurisdiction paling spesifik untuk titik

```sql id="89z54f"
SELECT
    jurisdiction_id,
    jurisdiction_code,
    jurisdiction_name,
    level
FROM jurisdiction_area
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND ST_Contains(
      boundary,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
  )
ORDER BY
    CASE level
        WHEN 'SUBDISTRICT' THEN 1
        WHEN 'DISTRICT' THEN 2
        WHEN 'CITY' THEN 3
        WHEN 'PROVINCE' THEN 4
        WHEN 'COUNTRY' THEN 5
        ELSE 99
    END
LIMIT 1;
```

Jika boundary static dan query sering, pertimbangkan materialized mapping atau spatial cache.

---

## 9. Model 5 - Restricted Zone / Risk Zone

Restricted/risk zone sering dipakai untuk fraud, compliance, delivery, atau access policy.

```sql id="xjmufn"
CREATE TABLE risk_zone (
    zone_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    zone_code text NOT NULL,
    zone_name text NOT NULL,

    risk_type text NOT NULL,
    severity text NOT NULL,
    status text NOT NULL,

    boundary geometry(MultiPolygon, 4326) NOT NULL,

    effective_from timestamptz NULL,
    effective_until timestamptz NULL,

    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_risk_zone_code
        UNIQUE (tenant_id, zone_code),

    CONSTRAINT ck_risk_zone_risk_type
        CHECK (risk_type IN ('FRAUD', 'COMPLIANCE', 'DELIVERY_RESTRICTED', 'SECURITY', 'CUSTOM')),

    CONSTRAINT ck_risk_zone_severity
        CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),

    CONSTRAINT ck_risk_zone_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),

    CONSTRAINT ck_risk_zone_metadata_object
        CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX idx_risk_zone_tenant_type_status
    ON risk_zone (tenant_id, risk_type, status, severity);

CREATE INDEX idx_risk_zone_boundary_gist
    ON risk_zone
    USING gist (boundary)
    WHERE status = 'ACTIVE';
```

### Query: cek titik masuk risk zone

```sql id="fk7iha"
SELECT
    zone_id,
    zone_code,
    zone_name,
    risk_type,
    severity
FROM risk_zone
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND (effective_from IS NULL OR effective_from <= now())
  AND (effective_until IS NULL OR effective_until > now())
  AND ST_Contains(
      boundary,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
  )
ORDER BY
    CASE severity
        WHEN 'CRITICAL' THEN 1
        WHEN 'HIGH' THEN 2
        WHEN 'MEDIUM' THEN 3
        WHEN 'LOW' THEN 4
        ELSE 9
    END;
```

---

## 10. Model 6 - Route / LineString

Untuk jalur, gunakan `LineString` atau `MultiLineString`.

```sql id="4ywna4"
CREATE TABLE route_segment (
    route_segment_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    route_code text NOT NULL,
    segment_code text NOT NULL,
    route_name text NOT NULL,

    route_type text NOT NULL,
    status text NOT NULL,

    path geometry(LineString, 4326) NOT NULL,

    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_route_segment
        UNIQUE (tenant_id, route_code, segment_code),

    CONSTRAINT ck_route_segment_type
        CHECK (route_type IN ('DELIVERY', 'INSPECTION', 'TRANSPORT', 'PIPELINE', 'CUSTOM')),

    CONSTRAINT ck_route_segment_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),

    CONSTRAINT ck_route_segment_metadata_object
        CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX idx_route_segment_tenant_route_status
    ON route_segment (tenant_id, route_code, status);

CREATE INDEX idx_route_segment_path_gist
    ON route_segment
    USING gist (path)
    WHERE status = 'ACTIVE';
```

Use case:

| Query | Function |
|---|---|
| titik dekat jalur | `ST_DWithin(point, path, distance)` |
| jalur memotong area | `ST_Intersects(path, boundary)` |
| panjang jalur | `ST_Length` dengan projection/geography consideration |
| segment terdekat | KNN / distance query |

---

## 11. Metadata JSONB dalam Spatial Table

Spatial table tetap boleh punya `metadata jsonb`, tetapi jangan sembunyikan field penting.

Baik:

```json id="3ilrx1"
{
  "sourceFile": "boundary-2026-q3.geojson",
  "importBatchId": "batch-20260715-001",
  "displayColor": "#ffcc00",
  "externalTags": ["official", "reviewed"]
}
```

Buruk:

```json id="t9oz9p"
{
  "tenantId": "...",
  "status": "ACTIVE",
  "areaCode": "JKT-CENTRAL",
  "level": "CITY"
}
```

Field penting harus menjadi kolom:

| Field | Kenapa harus kolom |
|---|---|
| `tenant_id` | security/filter |
| `status` | lifecycle/filter |
| `area_code` | business identity |
| `level` | hierarchy/filter |
| `risk_type` | query/authorization |
| `effective_from/until` | activation window |

---

## 12. Staging Table untuk Import

Jangan langsung import GeoJSON/Shapefile ke production table. Gunakan staging.

```sql id="pljsw3"
CREATE TABLE spatial_import_staging (
    staging_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    import_batch_id text NOT NULL,
    source_system text NOT NULL,
    source_reference text NULL,

    target_entity text NOT NULL,
    external_code text NULL,
    external_name text NULL,

    raw_geojson jsonb NULL,
    raw_wkt text NULL,

    parsed_geometry geometry NULL,

    validation_status text NOT NULL DEFAULT 'PENDING',
    validation_errors jsonb NOT NULL DEFAULT '[]'::jsonb,

    created_at timestamptz NOT NULL DEFAULT now(),
    validated_at timestamptz NULL,

    CONSTRAINT ck_spatial_import_target_entity
        CHECK (target_entity IN ('SERVICE_AREA', 'JURISDICTION_AREA', 'RISK_ZONE', 'ROUTE_SEGMENT')),

    CONSTRAINT ck_spatial_import_validation_status
        CHECK (validation_status IN ('PENDING', 'VALID', 'INVALID', 'PROMOTED')),

    CONSTRAINT ck_spatial_import_errors_array
        CHECK (jsonb_typeof(validation_errors) = 'array')
);

CREATE INDEX idx_spatial_import_batch_status
    ON spatial_import_staging (tenant_id, import_batch_id, validation_status);
```

---

## 13. Parse GeoJSON di Staging

PostGIS menyediakan `ST_GeomFromGeoJSON`, yang menerima representasi GeoJSON geometry dan menghasilkan geometry PostGIS. ([PostGIS](https://postgis.net/docs/reference.html?utm_source=chatgpt.com))

```sql id="ec7ggq"
UPDATE spatial_import_staging
SET
    parsed_geometry = ST_SetSRID(
        ST_GeomFromGeoJSON(raw_geojson::text),
        4326
    )
WHERE import_batch_id = :batchId
  AND raw_geojson IS NOT NULL
  AND parsed_geometry IS NULL;
```

Untuk WKT:

```sql id="q7yd14"
UPDATE spatial_import_staging
SET
    parsed_geometry = ST_GeomFromText(raw_wkt, 4326)
WHERE import_batch_id = :batchId
  AND raw_wkt IS NOT NULL
  AND parsed_geometry IS NULL;
```

Practical caveat:

```text id="s8bwg1"
ST_SetSRID hanya menetapkan SRID.
Kalau source geometry berasal dari CRS lain, gunakan ST_Transform setelah SRID asal benar.
```

---

## 14. Validasi Staging

### 14.1 Cek geometry null

```sql id="kdx23r"
UPDATE spatial_import_staging
SET
    validation_status = 'INVALID',
    validation_errors = validation_errors || jsonb_build_array('GEOMETRY_IS_NULL'),
    validated_at = now()
WHERE import_batch_id = :batchId
  AND parsed_geometry IS NULL;
```

### 14.2 Cek SRID

```sql id="6dqexf"
UPDATE spatial_import_staging
SET
    validation_status = 'INVALID',
    validation_errors = validation_errors || jsonb_build_array('INVALID_SRID'),
    validated_at = now()
WHERE import_batch_id = :batchId
  AND parsed_geometry IS NOT NULL
  AND ST_SRID(parsed_geometry) <> 4326;
```

### 14.3 Cek validity

```sql id="ikz5r2"
UPDATE spatial_import_staging
SET
    validation_status = 'INVALID',
    validation_errors = validation_errors || jsonb_build_array(
        jsonb_build_object(
            'code', 'INVALID_GEOMETRY',
            'reason', ST_IsValidReason(parsed_geometry)
        )
    ),
    validated_at = now()
WHERE import_batch_id = :batchId
  AND parsed_geometry IS NOT NULL
  AND NOT ST_IsValid(parsed_geometry);
```

PostGIS menyediakan `ST_IsValid` dan `ST_IsValidReason` untuk memeriksa validitas geometry dan alasan invaliditas; invalid geometry umum terjadi dari data eksternal seperti polygon self-intersection. ([PostGIS](https://postgis.net/docs/reference.html?utm_source=chatgpt.com))

---

## 15. Repair Geometry dengan Review

Untuk beberapa data, bisa dicoba repair:

```sql id="oz719j"
UPDATE spatial_import_staging
SET parsed_geometry = ST_MakeValid(parsed_geometry)
WHERE import_batch_id = :batchId
  AND parsed_geometry IS NOT NULL
  AND NOT ST_IsValid(parsed_geometry);
```

Tapi hasil `ST_MakeValid` bisa berubah tipe, misalnya menjadi `GeometryCollection`. Ini penting karena kolom target mungkin `MultiPolygon`. Untuk memaksa polygonal component:

```sql id="bv0ot0"
UPDATE spatial_import_staging
SET parsed_geometry = ST_Multi(
    ST_CollectionExtract(ST_MakeValid(parsed_geometry), 3)
)
WHERE import_batch_id = :batchId
  AND target_entity IN ('SERVICE_AREA', 'JURISDICTION_AREA', 'RISK_ZONE');
```

Catatan: angka `3` pada `ST_CollectionExtract(..., 3)` berarti polygonal components. Tetap review hasilnya untuk boundary bisnis penting.

---

## 16. Validasi Geometry Type

```sql id="popz2y"
UPDATE spatial_import_staging
SET
    validation_status = 'INVALID',
    validation_errors = validation_errors || jsonb_build_array(
        jsonb_build_object(
            'code', 'INVALID_GEOMETRY_TYPE',
            'actualType', GeometryType(parsed_geometry)
        )
    ),
    validated_at = now()
WHERE import_batch_id = :batchId
  AND target_entity IN ('SERVICE_AREA', 'JURISDICTION_AREA', 'RISK_ZONE')
  AND GeometryType(parsed_geometry) NOT IN ('POLYGON', 'MULTIPOLYGON');
```

Untuk promote ke `MultiPolygon`, konversi:

```sql id="8erewy"
UPDATE spatial_import_staging
SET parsed_geometry = ST_Multi(parsed_geometry)
WHERE import_batch_id = :batchId
  AND target_entity IN ('SERVICE_AREA', 'JURISDICTION_AREA', 'RISK_ZONE')
  AND GeometryType(parsed_geometry) = 'POLYGON';
```

---

## 17. Validasi Coordinate Bounds

Jika sistem hanya menerima data Indonesia, tambahkan sanity check bounding box kasar.

```sql id="p4d620"
UPDATE spatial_import_staging
SET
    validation_status = 'INVALID',
    validation_errors = validation_errors || jsonb_build_array('OUT_OF_EXPECTED_BOUNDS'),
    validated_at = now()
WHERE import_batch_id = :batchId
  AND parsed_geometry IS NOT NULL
  AND NOT ST_Intersects(
      parsed_geometry,
      ST_MakeEnvelope(94.0, -12.0, 142.0, 7.0, 4326)
  );
```

Ini bukan validasi legal boundary, tetapi mencegah data jelas salah seperti koordinat tertukar atau CRS salah.

---

## 18. Promote Staging ke Production: Service Area

```sql id="dtgcj7"
INSERT INTO service_area (
    area_id,
    tenant_id,
    area_code,
    area_name,
    area_type,
    status,
    boundary,
    metadata,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    tenant_id,
    external_code,
    external_name,
    'CUSTOM',
    'DRAFT',
    ST_Multi(parsed_geometry)::geometry(MultiPolygon, 4326),
    jsonb_build_object(
        'importBatchId', import_batch_id,
        'sourceSystem', source_system,
        'sourceReference', source_reference
    ),
    now(),
    now()
FROM spatial_import_staging
WHERE import_batch_id = :batchId
  AND target_entity = 'SERVICE_AREA'
  AND validation_status = 'VALID';
```

Lalu mark staging:

```sql id="5o4w9m"
UPDATE spatial_import_staging
SET validation_status = 'PROMOTED'
WHERE import_batch_id = :batchId
  AND target_entity = 'SERVICE_AREA'
  AND validation_status = 'VALID';
```

---

## 19. Promote Staging ke Production: Jurisdiction

```sql id="dg8388"
INSERT INTO jurisdiction_area (
    jurisdiction_id,
    tenant_id,
    jurisdiction_code,
    jurisdiction_name,
    level,
    status,
    boundary,
    source_system,
    source_reference,
    metadata,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    tenant_id,
    external_code,
    external_name,
    :level,
    'ACTIVE',
    ST_Multi(parsed_geometry)::geometry(MultiPolygon, 4326),
    source_system,
    source_reference,
    jsonb_build_object(
        'importBatchId', import_batch_id
    ),
    now(),
    now()
FROM spatial_import_staging
WHERE import_batch_id = :batchId
  AND target_entity = 'JURISDICTION_AREA'
  AND validation_status = 'VALID';
```

---

## 20. Boundary Versioning

Boundary bisa berubah dari waktu ke waktu. Jangan selalu overwrite tanpa histori.

```sql id="a43hxu"
CREATE TABLE jurisdiction_area_version (
    version_id uuid PRIMARY KEY,
    jurisdiction_id uuid NOT NULL REFERENCES jurisdiction_area(jurisdiction_id),

    tenant_id uuid NOT NULL,
    version_number integer NOT NULL,

    boundary geometry(MultiPolygon, 4326) NOT NULL,

    effective_from timestamptz NOT NULL,
    effective_until timestamptz NULL,

    source_system text NULL,
    source_reference text NULL,

    created_at timestamptz NOT NULL DEFAULT now(),
    created_by text NULL,

    CONSTRAINT uq_jurisdiction_area_version
        UNIQUE (jurisdiction_id, version_number),

    CONSTRAINT ck_jurisdiction_area_version_window
        CHECK (
            effective_until IS NULL
            OR effective_from < effective_until
        )
);

CREATE INDEX idx_jurisdiction_area_version_effective
    ON jurisdiction_area_version (tenant_id, jurisdiction_id, effective_from, effective_until);

CREATE INDEX idx_jurisdiction_area_version_boundary_gist
    ON jurisdiction_area_version
    USING gist (boundary);
```

Query effective boundary:

```sql id="jks2zf"
SELECT
    v.version_id,
    v.boundary
FROM jurisdiction_area_version v
WHERE v.tenant_id = :tenantId
  AND v.jurisdiction_id = :jurisdictionId
  AND v.effective_from <= :atTime
  AND (v.effective_until IS NULL OR v.effective_until > :atTime)
ORDER BY v.effective_from DESC
LIMIT 1;
```

---

## 21. Handling Boundary Besar

Boundary sangat detail bisa memperlambat query. Beberapa opsi:

| Pattern | Fungsi |
|---|---|
| `ST_Subdivide` | memecah geometry besar menjadi bagian lebih kecil |
| simplified display geometry | untuk map display ringan |
| full precise geometry | untuk keputusan legal/operasional |
| materialized mapping | untuk relationship yang jarang berubah |
| partition by level/type | kurangi candidate |

`ST_Subdivide` mengembalikan set geometry hasil pembagian geometry input menjadi bagian-bagian dengan jumlah vertex maksimum tertentu, berguna untuk memecah geometry besar. ([PostGIS](https://postgis.net/docs/ST_Subdivide.html?utm_source=chatgpt.com))

### Table untuk subdivided boundary

```sql id="klqwda"
CREATE TABLE jurisdiction_area_boundary_part (
    part_id bigserial PRIMARY KEY,
    jurisdiction_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    part_no integer NOT NULL,
    boundary_part geometry(Polygon, 4326) NOT NULL
);

CREATE INDEX idx_jurisdiction_boundary_part_tenant
    ON jurisdiction_area_boundary_part (tenant_id, jurisdiction_id);

CREATE INDEX idx_jurisdiction_boundary_part_gist
    ON jurisdiction_area_boundary_part
    USING gist (boundary_part);
```

Populate:

```sql id="42swrc"
INSERT INTO jurisdiction_area_boundary_part (
    jurisdiction_id,
    tenant_id,
    part_no,
    boundary_part
)
SELECT
    jurisdiction_id,
    tenant_id,
    row_number() OVER (PARTITION BY jurisdiction_id ORDER BY jurisdiction_id),
    (ST_Dump(ST_Subdivide(boundary, 256))).geom::geometry(Polygon, 4326)
FROM jurisdiction_area
WHERE status = 'ACTIVE';
```

Query point-in-boundary via parts:

```sql id="u1m6wz"
SELECT DISTINCT
    a.jurisdiction_id,
    a.jurisdiction_code,
    a.jurisdiction_name
FROM jurisdiction_area a
JOIN jurisdiction_area_boundary_part p
  ON p.jurisdiction_id = a.jurisdiction_id
WHERE a.tenant_id = :tenantId
  AND a.status = 'ACTIVE'
  AND ST_Contains(
      p.boundary_part,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
  );
```

---

## 22. Display Geometry vs Decision Geometry

Untuk map UI, geometry sangat detail tidak selalu perlu.

```sql id="xv2ytx"
ALTER TABLE jurisdiction_area
ADD COLUMN display_boundary geometry(MultiPolygon, 4326) NULL;
```

Populate simplified geometry:

```sql id="5oh62b"
UPDATE jurisdiction_area
SET display_boundary = ST_Multi(
    ST_SimplifyPreserveTopology(boundary, 0.001)
)::geometry(MultiPolygon, 4326)
WHERE display_boundary IS NULL;
```

Gunakan:

| Geometry | Untuk |
|---|---|
| `boundary` | keputusan bisnis/legal/spatial query presisi |
| `display_boundary` | map preview/UI |
| `boundary_part` | query performa tinggi untuk geometry besar |

Jangan gunakan simplified geometry untuk keputusan legal/routing kritikal tanpa approval domain.

---

## 23. Spatial Relationship Precompute

Jika relationship jarang berubah tetapi sering dibaca, precompute.

Contoh branch → jurisdiction:

```sql id="m3wl15"
CREATE TABLE branch_jurisdiction_assignment (
    branch_id uuid NOT NULL,
    jurisdiction_id uuid NOT NULL,
    tenant_id uuid NOT NULL,

    assigned_at timestamptz NOT NULL DEFAULT now(),
    source text NOT NULL DEFAULT 'SPATIAL_JOIN',

    PRIMARY KEY (branch_id, jurisdiction_id)
);
```

Populate:

```sql id="qzxr6u"
INSERT INTO branch_jurisdiction_assignment (
    branch_id,
    jurisdiction_id,
    tenant_id
)
SELECT
    b.branch_id,
    a.jurisdiction_id,
    b.tenant_id
FROM branch_location b
JOIN jurisdiction_area a
  ON a.tenant_id = b.tenant_id
 AND ST_Within(b.location, a.boundary)
WHERE b.status = 'ACTIVE'
  AND a.status = 'ACTIVE';
```

Ini menghindari spatial join berat di setiap request.

---

## 24. Spatial Data Ownership dan Multi-Tenant

Selalu letakkan `tenant_id` di kolom biasa.

Buruk:

```json id="ixlwrt"
{
  "tenantId": "..."
}
```

Baik:

```sql id="2r4x3h"
tenant_id uuid NOT NULL,
boundary geometry(MultiPolygon, 4326) NOT NULL
```

Query selalu:

```sql id="nlv78j"
WHERE tenant_id = :tenantId
```

Jika memakai Row-Level Security, spatial table juga lebih aman jika tenant boundary ada di kolom.

---

## 25. Soft Delete vs Archive

Spatial data seperti boundary biasanya tidak boleh langsung hard delete.

```sql id="fo8hbm"
UPDATE service_area
SET
    status = 'ARCHIVED',
    version = version + 1,
    updated_at = now()
WHERE tenant_id = :tenantId
  AND area_id = :areaId
  AND version = :expectedVersion;
```

Hard delete cocok untuk:

| Cocok hard delete | Contoh |
|---|---|
| staging invalid | import batch salah |
| temporary scratch data | hasil proses sementara |
| test data | non-prod |
| duplicate before promotion | belum production |

Untuk production boundary, gunakan archive/versioning.

---

## 26. Audit Table untuk Spatial Data

```sql id="nrn4tj"
CREATE TABLE spatial_entity_audit (
    audit_id bigserial PRIMARY KEY,

    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    tenant_id uuid NOT NULL,

    old_status text NULL,
    new_status text NULL,

    old_geometry geometry NULL,
    new_geometry geometry NULL,

    old_metadata jsonb NULL,
    new_metadata jsonb NULL,

    old_version bigint NULL,
    new_version bigint NULL,

    action text NOT NULL,
    actor text NOT NULL,
    reason text NULL,

    changed_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_spatial_entity_audit_action
        CHECK (action IN ('CREATE', 'UPDATE_GEOMETRY', 'UPDATE_METADATA', 'ACTIVATE', 'ARCHIVE', 'IMPORT', 'REPAIR'))
);
```

Untuk geometry besar, full geometry audit bisa sangat berat. Alternatif:

| Pattern | Cocok untuk |
|---|---|
| full geometry audit | boundary kecil/regulatory |
| hash + external file reference | boundary besar |
| old/new metadata + source batch | import pipeline |
| version table | boundary evolution |

---

## 27. MyBatis Preview: Insert Point

Detail integrasi geospatial penuh ada di Seri 19, tetapi pattern awal:

```xml id="47g5nb"
<insert id="insertBranchLocation">
    INSERT INTO branch_location (
        branch_id,
        tenant_id,
        branch_code,
        branch_name,
        status,
        location,
        address_text,
        metadata,
        created_by,
        updated_by
    )
    VALUES (
        #{branchId},
        #{tenantId},
        #{branchCode},
        #{branchName},
        'ACTIVE',
        ST_SetSRID(ST_MakePoint(#{longitude}, #{latitude}), 4326),
        #{addressText},
        CAST(#{metadataJson} AS jsonb),
        #{actor},
        #{actor}
    )
</insert>
```

Read:

```xml id="7zcjo4"
<select id="findBranchLocation" resultMap="BranchLocationResultMap">
    SELECT
        branch_id,
        tenant_id,
        branch_code,
        branch_name,
        status,
        ST_X(location) AS longitude,
        ST_Y(location) AS latitude,
        address_text,
        metadata::text AS metadata_json,
        version,
        created_at,
        updated_at
    FROM branch_location
    WHERE tenant_id = #{tenantId}
      AND branch_id = #{branchId}
</select>
```

---

## 28. MyBatis Preview: Insert Boundary from GeoJSON

```xml id="b9a2i4"
<insert id="insertServiceAreaFromGeoJson">
    INSERT INTO service_area (
        area_id,
        tenant_id,
        area_code,
        area_name,
        area_type,
        status,
        boundary,
        metadata,
        created_at,
        updated_at
    )
    VALUES (
        #{areaId},
        #{tenantId},
        #{areaCode},
        #{areaName},
        #{areaType},
        'DRAFT',
        ST_Multi(
            ST_CollectionExtract(
                ST_MakeValid(
                    ST_SetSRID(ST_GeomFromGeoJSON(#{boundaryGeoJson}), 4326)
                ),
                3
            )
        )::geometry(MultiPolygon, 4326),
        CAST(#{metadataJson} AS jsonb),
        now(),
        now()
    )
</insert>
```

Untuk production, lebih baik lewat staging + validation, bukan langsung insert boundary dari API ke production.

---

## 29. API Design Pattern

### Create branch point

```http id="85iu0g"
POST /tenants/{tenantId}/branches/{branchCode}/location
```

```json id="gqqxz4"
{
  "branchName": "Jakarta Central Branch",
  "longitude": 106.8456,
  "latitude": -6.2088,
  "addressText": "Jakarta",
  "metadata": {
    "source": "admin"
  }
}
```

### Import service area boundary

```http id="18npvj"
POST /tenants/{tenantId}/spatial-imports/service-areas
```

```json id="uhyzx1"
{
  "importBatchId": "batch-20260715-001",
  "sourceSystem": "GIS_ADMIN",
  "items": [
    {
      "externalCode": "JKT-CENTRAL",
      "externalName": "Jakarta Central Area",
      "geoJson": {
        "type": "MultiPolygon",
        "coordinates": []
      }
    }
  ]
}
```

API sebaiknya memisahkan:

| API | Tujuan |
|---|---|
| location CRUD | point sederhana |
| boundary import | staging/import pipeline |
| validation result | review invalid geometry |
| promote import | production activation |
| spatial query | find area/nearby/intersection |

---

## 30. Validation Checklist untuk API

| Validasi | Point | Boundary |
|---|---:|---:|
| longitude range `-180..180` | Ya | Ya |
| latitude range `-90..90` | Ya | Ya |
| coordinate order | Ya | Ya |
| geometry type | Point | Polygon/MultiPolygon |
| SRID assumption | 4326 | 4326 |
| geometry validity | N/A/simple | Wajib |
| size limit | Ya | Wajib |
| coordinate count limit | Opsional | Wajib |
| allowed bounds | Opsional | Wajib |
| duplicate business code | Wajib | Wajib |
| tenant ownership | Wajib | Wajib |

---

## 31. Production Failure Modes

| Failure mode | Penyebab | Mitigasi |
|---|---|---|
| Lat/lon tertukar | API/SQL salah urutan | Contract jelas: lon, lat |
| Boundary invalid | Import external kotor | Staging + `ST_IsValid` |
| `ST_MakeValid` ubah tipe | GeometryCollection | `ST_CollectionExtract` + review |
| Query lambat | Boundary besar | GiST, `ST_Subdivide`, precompute |
| Data CRS salah | Source bukan 4326 | Track source SRID + `ST_Transform` |
| Geometry terlalu detail | File GIS besar | display vs decision geometry |
| Multi-tenant leak | Tenant di metadata | `tenant_id` column |
| Audit bengkak | Full geometry audit besar | version table / external reference |
| Status kacau | Hard delete/update langsung | lifecycle status + version |
| Search API mahal | Arbitrary spatial filter | domain-specific query API |

---

## 32. Anti-Pattern

### 32.1 Semua Boundary Langsung Production

```text id="0nb26t"
Upload GeoJSON → INSERT service_area ACTIVE
```

Lebih aman:

```text id="h37j81"
Upload → staging → parse → validate → review → promote DRAFT/ACTIVE
```

---

### 32.2 Pakai `geometry` Generic untuk Semua

```sql id="9aznao"
geom geometry NOT NULL
```

Lebih baik:

```sql id="vg3ou3"
location geometry(Point, 4326)
boundary geometry(MultiPolygon, 4326)
path geometry(LineString, 4326)
```

---

### 32.3 Boundary Hanya Satu Row Besar untuk Semua Wilayah

Satu giant `MultiPolygon` untuk semua wilayah bisa membuat query berat dan sulit update.

Lebih baik simpan per area/jurisdiction, lalu subdivide jika perlu.

---

### 32.4 Tidak Menyimpan Source Metadata

Tanpa `source_system`, `source_reference`, `source_version`, susah menelusuri asal boundary saat ada dispute.

---

## 33. Practical Decision Table

| Need | Recommended model |
|---|---|
| Cabang/merchant/customer location | `geometry(Point, 4326)` |
| Lokasi historis | snapshot table |
| Area layanan | `service_area` dengan `MultiPolygon` |
| Wilayah administrasi | `jurisdiction_area` hierarchy |
| Zona risiko | `risk_zone` dengan severity/type |
| Route/jalur | `LineString` atau `MultiLineString` |
| Boundary besar | subdivided boundary table |
| Map display ringan | simplified display geometry |
| Import external | staging table |
| Boundary berubah versi | version table |
| Spatial relationship sering dibaca | precompute assignment |
| Geometry regulatory | audit/version + source reference |

---

## 34. Ringkasan Praktis

```text id="xoskih"
Spatial Data Modeling Rule
│
├── Model by domain
│   ├── branch_location
│   ├── service_area
│   ├── jurisdiction_area
│   ├── risk_zone
│   └── route_segment
│
├── Use specific geometry type
│   ├── Point for location
│   ├── LineString for route
│   └── MultiPolygon for boundary
│
├── Keep important metadata relational
│   ├── tenant_id
│   ├── code
│   ├── name
│   ├── status
│   ├── type/level
│   └── effective window
│
├── Use JSONB metadata carefully
│   ├── source details
│   ├── display hints
│   └── external attributes
│
├── Import safely
│   ├── staging
│   ├── parse
│   ├── validate
│   ├── repair/review
│   └── promote
│
├── Optimize large boundary
│   ├── GiST index
│   ├── subdivide
│   ├── simplify for display
│   └── precompute relationships
│
└── Govern lifecycle
    ├── status
    ├── version
    ├── audit
    ├── source metadata
    └── effective dating
```

---

# Status

**Seri 14/19 selesai.**

Berikutnya: **Seri 15/19 - Spatial Query Pattern: `ST_Contains`, `ST_Within`, `ST_Intersects`, `ST_Overlaps`, spatial join, boundary matching, query semantics, dan performance caveats.**

---

**Sources:**

- [PostGIS](https://postgis.net/?utm_source=chatgpt.com)

## Response:
7/15/2026, 9:02:11 PM

# Seri 15/19 - Spatial Query Pattern: `ST_Contains`, `ST_Within`, `ST_Intersects`, `ST_Overlaps`, Spatial Join, Boundary Matching

## 1. Tujuan Seri Ini

Seri ini membahas **pola query spatial production-style** di PostgreSQL/PostGIS.

Di seri sebelumnya, kita sudah membahas:

- fondasi PostGIS,
- spatial data type,
- SRID,
- `geometry` vs `geography`,
- table design untuk `Point`, `Polygon`, `MultiPolygon`, `LineString`,
- import pipeline dan staging.

Seri ini fokus pada **query semantics**:

1. Kapan memakai `ST_Contains`.
2. Kapan memakai `ST_Within`.
3. Kapan memakai `ST_Intersects`.
4. Kapan memakai `ST_Overlaps`.
5. Kapan memakai `ST_Touches`, `ST_Covers`, `ST_CoveredBy`.
6. Bagaimana melakukan spatial join.
7. Bagaimana mencocokkan point dengan boundary.
8. Bagaimana menghindari hasil salah karena boundary edge case.
9. Bagaimana menjaga query tetap cepat.

PostGIS mendefinisikan spatial relationship menggunakan konsep interior, boundary, dan exterior. Untuk relasi yang lebih detail, PostGIS juga mendukung DE-9IM melalui `ST_Relate`. DE-9IM adalah model 9-intersection yang mendeskripsikan relasi antara interior, boundary, dan exterior dua geometry. ([PostGIS](https://postgis.net/docs/ST_Relate.html?utm_source=chatgpt.com))

---

## 2. Mental Model Spatial Relationship

```text id="s74fvw"
Spatial Relationship Model
│
├── Point vs Polygon
│   ├── point inside polygon
│   ├── point on polygon boundary
│   └── point outside polygon
│
├── Polygon vs Polygon
│   ├── one contains another
│   ├── one within another
│   ├── overlap partially
│   ├── touch boundary only
│   └── disjoint
│
├── Line vs Polygon
│   ├── line crosses area
│   ├── line fully inside area
│   ├── line touches boundary
│   └── line outside area
│
├── Query Semantics
│   ├── contains
│   ├── within
│   ├── intersects
│   ├── overlaps
│   ├── touches
│   ├── covers
│   └── disjoint
│
└── Production Concern
    ├── boundary edge case
    ├── invalid geometry
    ├── SRID mismatch
    ├── index usage
    ├── candidate filtering
    └── deterministic tie-breaking
```

---

## 3. Sample Tables

Kita pakai tiga table utama.

### 3.1 Branch Point

```sql id="o7c3c8"
CREATE TABLE branch_location (
    branch_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    branch_code text NOT NULL,
    branch_name text NOT NULL,

    status text NOT NULL,
    location geometry(Point, 4326) NOT NULL,

    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_branch_location_code
        UNIQUE (tenant_id, branch_code),

    CONSTRAINT ck_branch_location_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'CLOSED'))
);

CREATE INDEX idx_branch_location_tenant_status
    ON branch_location (tenant_id, status);

CREATE INDEX idx_branch_location_location_gist
    ON branch_location
    USING gist (location)
    WHERE status = 'ACTIVE';
```

### 3.2 Service Area Boundary

```sql id="qkri8h"
CREATE TABLE service_area (
    area_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    area_code text NOT NULL,
    area_name text NOT NULL,
    area_type text NOT NULL,

    status text NOT NULL,
    boundary geometry(MultiPolygon, 4326) NOT NULL,

    priority integer NOT NULL DEFAULT 100,

    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_service_area_code
        UNIQUE (tenant_id, area_code),

    CONSTRAINT ck_service_area_status
        CHECK (status IN ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED')),

    CONSTRAINT ck_service_area_type
        CHECK (area_type IN ('DELIVERY', 'BRANCH_COVERAGE', 'SALES', 'SUPPORT', 'CUSTOM'))
);

CREATE INDEX idx_service_area_tenant_type_status
    ON service_area (tenant_id, area_type, status, priority);

CREATE INDEX idx_service_area_boundary_gist
    ON service_area
    USING gist (boundary)
    WHERE status = 'ACTIVE';
```

### 3.3 Risk Zone Boundary

```sql id="x81vkv"
CREATE TABLE risk_zone (
    zone_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    zone_code text NOT NULL,
    zone_name text NOT NULL,

    risk_type text NOT NULL,
    severity text NOT NULL,
    status text NOT NULL,

    boundary geometry(MultiPolygon, 4326) NOT NULL,

    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_risk_zone_code
        UNIQUE (tenant_id, zone_code),

    CONSTRAINT ck_risk_zone_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),

    CONSTRAINT ck_risk_zone_severity
        CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

CREATE INDEX idx_risk_zone_tenant_type_status
    ON risk_zone (tenant_id, risk_type, status, severity);

CREATE INDEX idx_risk_zone_boundary_gist
    ON risk_zone
    USING gist (boundary)
    WHERE status = 'ACTIVE';
```

---

## 4. `ST_Contains`: Polygon Mengandung Object

`ST_Contains(A, B)` digunakan saat ingin bertanya:

```text id="zvbf5k"
Apakah geometry A mengandung geometry B?
```

Contoh: service area mengandung titik customer.

```sql id="rj7fyf"
SELECT
    area_id,
    area_code,
    area_name
FROM service_area
WHERE tenant_id = :tenantId
  AND area_type = 'DELIVERY'
  AND status = 'ACTIVE'
  AND ST_Contains(
      boundary,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
  );
```

Use case:

| Use case | Query |
|---|---|
| Customer berada dalam service area | `ST_Contains(area.boundary, point)` |
| Branch berada dalam jurisdiction | `ST_Contains(jurisdiction.boundary, branch.location)` |
| Risk zone mengandung case location | `ST_Contains(risk_zone.boundary, point)` |
| Polygon A mengandung polygon B | `ST_Contains(parent.boundary, child.boundary)` |

Caveat penting: `ST_Contains` punya semantic boundary yang ketat. Jika point tepat di boundary polygon, hasilnya bisa tidak sesuai ekspektasi bisnis “masih masuk area”. Untuk kasus boundary-inclusive, pertimbangkan `ST_Covers`.

---

## 5. `ST_Within`: Object Berada di Dalam Object Lain

`ST_Within(A, B)` bertanya:

```text id="jmupok"
Apakah geometry A berada di dalam geometry B?
```

Dokumentasi PostGIS mendefinisikan `ST_Within(A, B)` sebagai true jika geometry A berada di dalam geometry B; seluruh point A harus berada di interior atau boundary B, dan interior A dan B harus beririsan. ([PostGIS](https://postgis.net/docs/ST_Within.html?utm_source=chatgpt.com))

Contoh branch dalam service area:

```sql id="d780qs"
SELECT
    b.branch_id,
    b.branch_code,
    b.branch_name,
    a.area_code,
    a.area_name
FROM branch_location b
JOIN service_area a
  ON a.tenant_id = b.tenant_id
 AND ST_Within(b.location, a.boundary)
WHERE b.tenant_id = :tenantId
  AND b.status = 'ACTIVE'
  AND a.status = 'ACTIVE'
  AND a.area_type = 'BRANCH_COVERAGE';
```

`ST_Contains(a, b)` dan `ST_Within(b, a)` sering merupakan kebalikan secara konseptual:

```text id="9le2js"
ST_Contains(area, point)
≈
ST_Within(point, area)
```

Tetapi tetap pilih yang paling natural dibaca sesuai query.

---

## 6. `ST_Intersects`: Ada Irisan Spatial

`ST_Intersects(A, B)` bertanya:

```text id="1hbgt8"
Apakah A dan B memiliki setidaknya satu titik yang sama?
```

PostGIS mendefinisikan `ST_Intersects` sebagai true jika dua geometry memiliki titik yang sama; untuk geography ada tolerance kecil. ([PostGIS](https://postgis.net/docs/ST_Intersects.html?utm_source=chatgpt.com))

Contoh: route yang melewati risk zone.

```sql id="5pwblk"
SELECT
    r.route_segment_id,
    r.route_code,
    z.zone_code,
    z.zone_name,
    z.severity
FROM route_segment r
JOIN risk_zone z
  ON z.tenant_id = r.tenant_id
 AND ST_Intersects(r.path, z.boundary)
WHERE r.tenant_id = :tenantId
  AND r.status = 'ACTIVE'
  AND z.status = 'ACTIVE';
```

Use case:

| Use case | Kenapa `ST_Intersects` |
|---|---|
| Route melewati zona risiko | line dan polygon beririsan |
| Service area overlap dengan restricted zone | polygon dan polygon beririsan |
| Boundary saling bersinggungan | intersection true |
| Area candidate untuk spatial join luas | lebih broad daripada contains |

`ST_Intersects` lebih longgar daripada `ST_Contains`/`ST_Within`.

---

## 7. `ST_Overlaps`: Overlap Sebagian dengan Dimensi Sama

`ST_Overlaps(A, B)` cocok ketika dua geometry:

1. memiliki dimensi yang sama,
2. beririsan sebagian,
3. tetapi tidak saling mengandung secara penuh.

Contoh: dua service area overlap sebagian.

```sql id="i5ws54"
SELECT
    a.area_code AS area_a,
    b.area_code AS area_b
FROM service_area a
JOIN service_area b
  ON a.tenant_id = b.tenant_id
 AND a.area_id < b.area_id
 AND ST_Overlaps(a.boundary, b.boundary)
WHERE a.tenant_id = :tenantId
  AND a.status = 'ACTIVE'
  AND b.status = 'ACTIVE'
  AND a.area_type = b.area_type;
```

Use case:

| Use case | Fungsi |
|---|---|
| Cek service area overlap konflik | `ST_Overlaps` |
| Cek risk zone overlap | `ST_Overlaps` |
| Cek jurisdiction boundary abnormal | `ST_Overlaps` |
| Validasi polygon tidak saling tumpang tindih | `ST_Overlaps` / `ST_Intersects` + business rule |

Caveat: kalau satu polygon sepenuhnya mengandung polygon lain, `ST_Overlaps` bukan semantic yang tepat. Gunakan `ST_Contains`/`ST_Within`.

---

## 8. `ST_Touches`: Hanya Menyentuh Boundary

`ST_Touches(A, B)` cocok untuk adjacency.

Contoh: dua jurisdiction berbatasan langsung.

```sql id="ztj9km"
SELECT
    a.jurisdiction_code AS jurisdiction_a,
    b.jurisdiction_code AS jurisdiction_b
FROM jurisdiction_area a
JOIN jurisdiction_area b
  ON a.tenant_id = b.tenant_id
 AND a.jurisdiction_id < b.jurisdiction_id
 AND ST_Touches(a.boundary, b.boundary)
WHERE a.tenant_id = :tenantId
  AND a.status = 'ACTIVE'
  AND b.status = 'ACTIVE'
  AND a.level = 'CITY'
  AND b.level = 'CITY';
```

Use case:

| Use case | Contoh |
|---|---|
| Cari wilayah tetangga | adjacent jurisdictions |
| Route menyentuh boundary | checkpoint boundary |
| Validasi edge adjacency | wilayah administratif |
| Network/coverage planning | area bersentuhan |

---

## 9. `ST_Covers` dan `ST_CoveredBy`: Boundary-Inclusive Alternative

Dalam banyak aplikasi bisnis, titik di boundary tetap dianggap “masuk area”.

Contoh:

```sql id="dcfxe7"
SELECT
    area_id,
    area_code,
    area_name
FROM service_area
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND ST_Covers(
      boundary,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
  );
```

Kapan pakai:

| Need | Function |
|---|---|
| Boundary edge dianggap masuk | `ST_Covers(area, point)` |
| Butuh contains strict | `ST_Contains(area, point)` |
| Point within termasuk boundary | `ST_CoveredBy(point, area)` |
| Legal boundary butuh presisi jelas | definisikan semantic business |

Practical rule:

```text id="qg3af1"
Untuk point-in-area API bisnis,
sering lebih aman memilih ST_Covers daripada ST_Contains
jika titik di garis boundary tetap dianggap berada di area.
```

---

## 10. `ST_Disjoint`: Tidak Beririsan

`ST_Disjoint(A, B)` true jika tidak ada titik yang sama.

Contoh: cari service area yang tidak menyentuh risk zone tertentu.

```sql id="f9pgmb"
SELECT
    a.area_id,
    a.area_code,
    a.area_name
FROM service_area a
WHERE a.tenant_id = :tenantId
  AND a.status = 'ACTIVE'
  AND NOT EXISTS (
      SELECT 1
      FROM risk_zone z
      WHERE z.tenant_id = a.tenant_id
        AND z.zone_id = :zoneId
        AND ST_Intersects(a.boundary, z.boundary)
  );
```

Secara praktis, sering lebih baik pakai `NOT ST_Intersects` via `NOT EXISTS` daripada `ST_Disjoint` langsung, terutama agar query lebih mudah dikontrol dengan filter metadata.

---

## 11. Decision Table Spatial Predicate

| Pertanyaan bisnis | Predicate |
|---|---|
| Titik ada di dalam area? | `ST_Contains(area, point)` atau `ST_Covers(area, point)` |
| Titik dianggap masuk walau di boundary? | `ST_Covers(area, point)` |
| Object A berada dalam object B? | `ST_Within(A, B)` |
| Dua object punya irisan? | `ST_Intersects(A, B)` |
| Dua polygon overlap sebagian? | `ST_Overlaps(A, B)` |
| Dua boundary hanya bersentuhan? | `ST_Touches(A, B)` |
| Tidak ada irisan sama sekali? | `NOT ST_Intersects(A, B)` / `ST_Disjoint` |
| Butuh relasi sangat spesifik? | `ST_Relate` / DE-9IM |
| Dalam radius tertentu? | `ST_DWithin` |
| Terdekat? | KNN `<->` atau `ST_Distance` + limit |

---

## 12. Boundary Matching: Find Best Service Area for Point

Kasus umum: titik customer bisa masuk beberapa area. Butuh hasil deterministic.

```sql id="p269lh"
SELECT
    area_id,
    area_code,
    area_name,
    priority
FROM service_area
WHERE tenant_id = :tenantId
  AND area_type = 'DELIVERY'
  AND status = 'ACTIVE'
  AND ST_Covers(
      boundary,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
  )
ORDER BY priority ASC, area_code ASC
LIMIT 1;
```

Kenapa order penting?

| Kondisi | Tanpa ORDER |
|---|---|
| Area overlap | hasil bisa tidak deterministic |
| Ada area parent/child | bisa salah pilih parent |
| Ada boundary duplicate | hasil tidak stabil |
| Planner berubah | row pertama bisa berubah |

Untuk production, selalu tentukan tie-breaker:

```text id="8tnktl"
priority ASC
level specificity
effective_from DESC
area_code ASC
```

---

## 13. Boundary Matching: Find Most Specific Jurisdiction

```sql id="bdi5g9"
SELECT
    jurisdiction_id,
    jurisdiction_code,
    jurisdiction_name,
    level
FROM jurisdiction_area
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND ST_Covers(
      boundary,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
  )
ORDER BY
    CASE level
        WHEN 'SUBDISTRICT' THEN 1
        WHEN 'DISTRICT' THEN 2
        WHEN 'CITY' THEN 3
        WHEN 'PROVINCE' THEN 4
        WHEN 'COUNTRY' THEN 5
        ELSE 99
    END,
    jurisdiction_code
LIMIT 1;
```

Practical use:

| Domain | Use case |
|---|---|
| Case routing | pilih unit kerja paling spesifik |
| Compliance | tentukan jurisdiction |
| Reporting | assign wilayah |
| Risk scoring | cek area policy |

---

## 14. Spatial Join: Point to Polygon

Cari semua branch dan service area yang menaunginya.

```sql id="l9dmto"
SELECT
    b.branch_id,
    b.branch_code,
    b.branch_name,
    a.area_id,
    a.area_code,
    a.area_name
FROM branch_location b
JOIN service_area a
  ON a.tenant_id = b.tenant_id
 AND a.area_type = 'BRANCH_COVERAGE'
 AND a.status = 'ACTIVE'
 AND ST_Covers(a.boundary, b.location)
WHERE b.tenant_id = :tenantId
  AND b.status = 'ACTIVE';
```

Guardrail:

| Guardrail | Alasan |
|---|---|
| Filter tenant di join | Hindari cross-tenant join |
| Filter status/type sebelum spatial predicate | Kurangi candidate |
| GiST index boundary | Percepat spatial predicate |
| B-tree tenant/status | Percepat filter metadata |
| Deterministic handling jika multiple area | Overlap bisa terjadi |

---

## 15. Spatial Join: Polygon to Polygon

Cari service area yang beririsan dengan risk zone.

```sql id="z4nxb0"
SELECT
    a.area_id,
    a.area_code,
    a.area_name,
    z.zone_id,
    z.zone_code,
    z.severity
FROM service_area a
JOIN risk_zone z
  ON z.tenant_id = a.tenant_id
 AND z.status = 'ACTIVE'
 AND ST_Intersects(a.boundary, z.boundary)
WHERE a.tenant_id = :tenantId
  AND a.status = 'ACTIVE'
  AND a.area_type = 'DELIVERY';
```

Jika ingin hanya overlap area, bukan sekadar touching boundary:

```sql id="4bcusq"
AND ST_Area(ST_Intersection(a.boundary, z.boundary)) > 0
```

Caveat: `ST_Intersection` dan `ST_Area` lebih mahal. Gunakan setelah candidate dipersempit oleh `ST_Intersects`.

---

## 16. Spatial Join: Route to Zone

Cari route yang melewati risk zone.

```sql id="3meodu"
SELECT
    r.route_segment_id,
    r.route_code,
    r.segment_code,
    z.zone_code,
    z.severity
FROM route_segment r
JOIN risk_zone z
  ON z.tenant_id = r.tenant_id
 AND z.status = 'ACTIVE'
 AND ST_Intersects(r.path, z.boundary)
WHERE r.tenant_id = :tenantId
  AND r.status = 'ACTIVE'
  AND r.route_type = 'DELIVERY';
```

Jika ingin tahu panjang route di dalam zona, perlu intersection geometry dan length dengan projection/geography consideration.

```sql id="n0jsih"
SELECT
    r.route_segment_id,
    z.zone_code,
    ST_Length(
        ST_Intersection(r.path, z.boundary)::geography
    ) AS length_inside_zone_meters
FROM route_segment r
JOIN risk_zone z
  ON z.tenant_id = r.tenant_id
 AND ST_Intersects(r.path, z.boundary)
WHERE r.tenant_id = :tenantId
  AND r.status = 'ACTIVE'
  AND z.status = 'ACTIVE';
```

---

## 17. Candidate Filtering dengan Bounding Box

PostGIS spatial indexes memakai bounding box untuk mempercepat candidate search. Workshop PostGIS menyebut banyak fungsi umum seperti `ST_Contains`, `ST_Intersects`, dan `ST_DWithin` menyertakan index filter otomatis, sedangkan beberapa fungsi seperti `ST_Relate` tidak; operator `&&` berarti bounding boxes overlap/touch dan bisa dipakai untuk bounding-box search. ([PostGIS](https://postgis.net/workshops/postgis-intro/indexing.html?utm_source=chatgpt.com))

Pattern manual candidate filter:

```sql id="nyhlc9"
SELECT
    area_id,
    area_code
FROM service_area
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND boundary && ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
  AND ST_Covers(
      boundary,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
  );
```

Biasanya `ST_Covers`/`ST_Intersects` sudah memakai bbox internally untuk index-aware predicate, tetapi `&&` kadang dipakai untuk membuat candidate phase lebih eksplisit, terutama jika menggabungkan dengan function yang tidak otomatis index-aware.

---

## 18. Pattern: Two-Phase Spatial Query

Untuk query mahal, lakukan dua fase:

```text id="8i6bte"
Phase 1: cheap candidate filtering
  tenant/status/type
  bounding box / index-aware predicate

Phase 2: exact spatial calculation
  ST_Covers
  ST_Intersection
  ST_Area
  ST_Length
```

Contoh:

```sql id="tifiii"
WITH candidates AS (
    SELECT
        a.area_id,
        a.area_code,
        a.boundary
    FROM service_area a
    WHERE a.tenant_id = :tenantId
      AND a.status = 'ACTIVE'
      AND a.area_type = 'DELIVERY'
      AND ST_Intersects(
          a.boundary,
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
      )
)
SELECT
    area_id,
    area_code
FROM candidates
WHERE ST_Covers(
    boundary,
    ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
);
```

Untuk point-in-polygon, `ST_Covers` saja biasanya cukup. Two-phase lebih berguna untuk operation mahal seperti intersection area/length.

---

## 19. Overlap Area Calculation

Cari persentase overlap service area dengan risk zone.

```sql id="eiyjmr"
SELECT
    a.area_id,
    a.area_code,
    z.zone_id,
    z.zone_code,
    ST_Area(ST_Intersection(a.boundary, z.boundary)::geography) AS overlap_area_m2,
    ST_Area(a.boundary::geography) AS service_area_m2,
    ST_Area(ST_Intersection(a.boundary, z.boundary)::geography)
        / NULLIF(ST_Area(a.boundary::geography), 0) AS overlap_ratio
FROM service_area a
JOIN risk_zone z
  ON z.tenant_id = a.tenant_id
 AND z.status = 'ACTIVE'
 AND ST_Intersects(a.boundary, z.boundary)
WHERE a.tenant_id = :tenantId
  AND a.status = 'ACTIVE'
  AND a.area_type = 'DELIVERY';
```

Caveat:

| Caveat | Mitigasi |
|---|---|
| `ST_Intersection` mahal | Filter candidate dulu |
| Area geography vs geometry | Pastikan unit dan projection benar |
| Geometry invalid | Validate boundary |
| Boundary sangat detail | Subdivide/simplify/precompute |
| Overlap kecil karena boundary noise | Gunakan threshold |

Threshold example:

```sql id="3q26yk"
HAVING ST_Area(ST_Intersection(a.boundary, z.boundary)::geography) > 1000
```

---

## 20. Boundary Edge Case: Point on Border

Misalnya titik tepat di garis boundary dua area.

| Function | Biasanya |
|---|---|
| `ST_Contains(area, point)` | bisa false jika point hanya di boundary |
| `ST_Covers(area, point)` | boundary-inclusive |
| `ST_Within(point, area)` | tergantung semantic boundary/interior |
| `ST_Intersects(area, point)` | true jika point common |

Untuk API bisnis seperti “apakah titik berada dalam area layanan?”, tentukan contract:

```text id="0p9ba2"
Contract A:
  point on boundary counts as inside → use ST_Covers

Contract B:
  point must be strictly inside → use ST_Contains

Contract C:
  point on boundary returns ambiguous/multiple area → return candidates
```

Jika dua area berbagi boundary dan `ST_Covers` dipakai, satu point border bisa match dua area. Maka butuh tie-breaker.

---

## 21. Handling Multiple Matches

Point bisa match beberapa polygon karena:

- area overlap,
- parent-child jurisdiction,
- boundary shared,
- duplicate import,
- custom coverage override.

Pattern response:

### 21.1 Return Best Match

```sql id="ysbmjl"
SELECT
    area_id,
    area_code,
    area_name,
    priority
FROM service_area
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND ST_Covers(
      boundary,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
  )
ORDER BY priority ASC, area_code ASC
LIMIT 1;
```

### 21.2 Return All Matches

```sql id="3xbydp"
SELECT
    area_id,
    area_code,
    area_name,
    priority
FROM service_area
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND ST_Covers(
      boundary,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
  )
ORDER BY priority ASC, area_code ASC;
```

### 21.3 Detect Ambiguous Matches

```sql id="v2ku4m"
WITH matches AS (
    SELECT area_id, area_code, priority
    FROM service_area
    WHERE tenant_id = :tenantId
      AND status = 'ACTIVE'
      AND ST_Covers(
          boundary,
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
      )
)
SELECT
    count(*) AS match_count,
    jsonb_agg(
        jsonb_build_object(
            'areaId', area_id,
            'areaCode', area_code,
            'priority', priority
        )
        ORDER BY priority, area_code
    ) AS matches
FROM matches;
```

Service bisa return:

| match_count | Response |
|---:|---|
| `0` | outside coverage |
| `1` | matched |
| `>1` | matched best + ambiguity info, atau conflict sesuai domain |

---

## 22. Invalid Geometry dan Predicate Result

Spatial predicates mengasumsikan geometry valid. Jika polygon invalid, hasil query bisa salah atau error.

Validasi rutin:

```sql id="m74g7x"
SELECT
    area_id,
    area_code,
    ST_IsValid(boundary) AS is_valid,
    ST_IsValidReason(boundary) AS reason
FROM service_area
WHERE status = 'ACTIVE'
  AND NOT ST_IsValid(boundary);
```

Repair harus controlled:

```sql id="11gcw0"
UPDATE service_area
SET
    boundary = ST_Multi(
        ST_CollectionExtract(ST_MakeValid(boundary), 3)
    )::geometry(MultiPolygon, 4326)
WHERE status = 'ACTIVE'
  AND NOT ST_IsValid(boundary);
```

Untuk boundary regulatory, jangan repair otomatis tanpa review.

---

## 23. SRID Mismatch

Jangan join geometry dengan SRID berbeda.

Diagnostic:

```sql id="rtln4h"
SELECT DISTINCT ST_SRID(boundary)
FROM service_area;
```

```sql id="vbomv6"
SELECT DISTINCT ST_SRID(location)
FROM branch_location;
```

Constraint:

```sql id="ok5xir"
ALTER TABLE service_area
ADD CONSTRAINT ck_service_area_srid_4326
CHECK (ST_SRID(boundary) = 4326);

ALTER TABLE branch_location
ADD CONSTRAINT ck_branch_location_srid_4326
CHECK (ST_SRID(location) = 4326);
```

Jika source CRS berbeda, gunakan `ST_Transform`, bukan `ST_SetSRID`. `ST_Transform` mengubah koordinat antar spatial reference systems, sedangkan `ST_SetSRID` hanya menetapkan identifier SRID tanpa mengubah koordinat. ([PostGIS](https://postgis.net/docs/ST_Within.html?utm_source=chatgpt.com))

Catatan: citation di atas mendukung konsep fungsi PostGIS terkait, tetapi untuk detail `ST_SetSRID` vs `ST_Transform`, gunakan dokumentasi fungsi tersebut saat implementasi migration.

---

## 24. Query Performance Pattern

### 24.1 Index

```sql id="akzcpx"
CREATE INDEX idx_service_area_boundary_gist
    ON service_area
    USING gist (boundary)
    WHERE status = 'ACTIVE';

CREATE INDEX idx_service_area_tenant_type_status
    ON service_area (tenant_id, area_type, status, priority);
```

### 24.2 Query

```sql id="xp7uc5"
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    area_id,
    area_code
FROM service_area
WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
  AND area_type = 'DELIVERY'
  AND status = 'ACTIVE'
  AND ST_Covers(
      boundary,
      ST_SetSRID(ST_MakePoint(106.8456, -6.2088), 4326)
  )
ORDER BY priority
LIMIT 1;
```

Hal yang dicari:

| Plan signal | Makna |
|---|---|
| GiST index used | spatial predicate index-aware |
| B-tree filter used | tenant/type/status efektif |
| Rows removed by filter tinggi | candidate terlalu banyak |
| Seq scan pada boundary besar | index tidak cocok/tidak dipakai |
| Execution time tinggi di exact predicate | geometry terlalu kompleks |
| Buffers read tinggi | I/O heavy |

---

## 25. Performance Caveat: `ST_Relate`

`ST_Relate` dipakai untuk relasi DE-9IM yang sangat spesifik. Tetapi fungsi ini tidak selalu otomatis memakai index filter seperti predicate umum. Workshop PostGIS menyebut fungsi umum seperti `ST_Contains`, `ST_Intersects`, dan `ST_DWithin` menyertakan index filter otomatis, sedangkan `ST_Relate` tidak; gunakan `&&` untuk bounding-box prefilter bila perlu. ([PostGIS](https://postgis.net/workshops/postgis-intro/indexing.html?utm_source=chatgpt.com))

Pattern:

```sql id="55p3nk"
SELECT
    a.area_id,
    b.area_id
FROM service_area a
JOIN service_area b
  ON a.tenant_id = b.tenant_id
 AND a.boundary && b.boundary
 AND ST_Relate(a.boundary, b.boundary, 'T********')
WHERE a.tenant_id = :tenantId
  AND a.area_id <> b.area_id;
```

Gunakan `ST_Relate` hanya jika predicate umum tidak cukup.

---

## 26. Spatial Query API Design

### 26.1 Find Area by Point

```http id="y6gl1j"
GET /tenants/{tenantId}/service-areas/match?longitude=106.8456&latitude=-6.2088&type=DELIVERY
```

Response:

```json id="w9qc6o"
{
  "matched": true,
  "area": {
    "areaId": "8f6c...",
    "areaCode": "JKT-CENTRAL",
    "areaName": "Jakarta Central",
    "priority": 10
  },
  "ambiguous": false
}
```

### 26.2 Find Risk Zones by Point

```http id="k0q3zb"
GET /tenants/{tenantId}/risk-zones/contains-point?longitude=106.8456&latitude=-6.2088
```

### 26.3 Find Areas Intersecting Boundary

```http id="pob7r3"
POST /tenants/{tenantId}/service-areas/intersections
```

```json id="a7qpw1"
{
  "boundaryGeoJson": {
    "type": "Polygon",
    "coordinates": []
  }
}
```

Guardrail:

| API rule | Alasan |
|---|---|
| longitude/latitude eksplisit | hindari lat/lon tertukar |
| type/status whitelist | query predictable |
| geometry size limit | hindari payload besar |
| no arbitrary predicate name from client | governance |
| return ambiguity info | overlap/boundary case |
| correlation id | debugging spatial decision |

---

## 27. MyBatis Mapper Pattern: Point-in-Area

```java id="usv0j0"
public interface SpatialQueryMapper {

    Optional<ServiceAreaMatchRecord> findBestServiceAreaForPoint(
        @Param("tenantId") UUID tenantId,
        @Param("areaType") String areaType,
        @Param("longitude") BigDecimal longitude,
        @Param("latitude") BigDecimal latitude
    );

    List<ServiceAreaMatchRecord> findAllServiceAreasForPoint(
        @Param("tenantId") UUID tenantId,
        @Param("areaType") String areaType,
        @Param("longitude") BigDecimal longitude,
        @Param("latitude") BigDecimal latitude
    );
}
```

```xml id="32ch2j"
<select id="findBestServiceAreaForPoint" resultMap="ServiceAreaMatchResultMap">
    SELECT
        area_id,
        area_code,
        area_name,
        priority
    FROM service_area
    WHERE tenant_id = #{tenantId}
      AND area_type = #{areaType}
      AND status = 'ACTIVE'
      AND ST_Covers(
          boundary,
          ST_SetSRID(ST_MakePoint(#{longitude}, #{latitude}), 4326)
      )
    ORDER BY priority ASC, area_code ASC
    LIMIT 1
</select>
```

---

## 28. MyBatis Mapper Pattern: Spatial Join

```xml id="aybi2m"
<select id="findBranchesInServiceAreas" resultMap="BranchAreaResultMap">
    SELECT
        b.branch_id,
        b.branch_code,
        b.branch_name,
        a.area_id,
        a.area_code,
        a.area_name
    FROM branch_location b
    JOIN service_area a
      ON a.tenant_id = b.tenant_id
     AND a.area_type = #{areaType}
     AND a.status = 'ACTIVE'
     AND ST_Covers(a.boundary, b.location)
    WHERE b.tenant_id = #{tenantId}
      AND b.status = 'ACTIVE'
    ORDER BY b.branch_code, a.priority
</select>
```

---

## 29. Jersey Service Pattern

```java id="k6ld8j"
public final class SpatialQueryService {

    private final SpatialQueryMapper mapper;

    public ServiceAreaMatchResponse findBestArea(
        UUID tenantId,
        String areaType,
        BigDecimal longitude,
        BigDecimal latitude
    ) {
        validateLongitudeLatitude(longitude, latitude);
        validateAreaType(areaType);

        List<ServiceAreaMatchRecord> matches =
            mapper.findAllServiceAreasForPoint(
                tenantId,
                areaType,
                longitude,
                latitude
            );

        if (matches.isEmpty()) {
            return ServiceAreaMatchResponse.noMatch();
        }

        ServiceAreaMatchRecord best = matches.get(0);

        return new ServiceAreaMatchResponse(
            true,
            best,
            matches.size() > 1,
            matches
        );
    }

    private void validateLongitudeLatitude(
        BigDecimal longitude,
        BigDecimal latitude
    ) {
        if (longitude.compareTo(BigDecimal.valueOf(-180)) < 0
            || longitude.compareTo(BigDecimal.valueOf(180)) > 0) {
            throw new IllegalArgumentException("longitude must be -180..180");
        }

        if (latitude.compareTo(BigDecimal.valueOf(-90)) < 0
            || latitude.compareTo(BigDecimal.valueOf(90)) > 0) {
            throw new IllegalArgumentException("latitude must be -90..90");
        }
    }

    private void validateAreaType(String areaType) {
        if (!Set.of("DELIVERY", "BRANCH_COVERAGE", "SALES", "SUPPORT", "CUSTOM")
            .contains(areaType)) {
            throw new IllegalArgumentException("Invalid area type");
        }
    }
}
```

---

## 30. Jersey Resource Pattern

```java id="5mgl6d"
@Path("/tenants/{tenantId}/service-areas")
@Produces(MediaType.APPLICATION_JSON)
public class ServiceAreaQueryResource {

    private final SpatialQueryService spatialQueryService;

    @GET
    @Path("/match")
    public Response matchPoint(
        @PathParam("tenantId") UUID tenantId,
        @QueryParam("areaType") String areaType,
        @QueryParam("longitude") BigDecimal longitude,
        @QueryParam("latitude") BigDecimal latitude
    ) {
        ServiceAreaMatchResponse response =
            spatialQueryService.findBestArea(
                tenantId,
                areaType,
                longitude,
                latitude
            );

        return Response.ok(response).build();
    }
}
```

---

## 31. Testing Strategy

### 31.1 Unit Test

| Unit | Test |
|---|---|
| longitude/latitude validation | reject out-of-range |
| area type validation | reject unknown type |
| multiple matches | ambiguous true |
| no match | matched false |
| best match | priority ASC |

### 31.2 PostgreSQL Integration Test

Gunakan polygon sederhana:

```sql id="66v150"
INSERT INTO service_area (
    area_id,
    tenant_id,
    area_code,
    area_name,
    area_type,
    status,
    priority,
    boundary
)
VALUES (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000001',
    'AREA-A',
    'Area A',
    'DELIVERY',
    'ACTIVE',
    10,
    ST_GeomFromText(
      'MULTIPOLYGON(((106.0 -6.0, 107.0 -6.0, 107.0 -7.0, 106.0 -7.0, 106.0 -6.0)))',
      4326
    )
);
```

Test cases:

| Test | Expected |
|---|---|
| point inside polygon | match |
| point outside polygon | no match |
| point on boundary | match jika pakai `ST_Covers` |
| overlapping areas | multiple matches |
| inactive area | ignored |
| wrong tenant | ignored |
| invalid lat/lon | rejected before DB |

---

## 32. Observability

Log fields:

```text id="1a9544"
tenant_id
query_type
longitude
latitude
area_type
match_count
best_area_code
ambiguous
duration_ms
```

Metrics:

| Metric | Meaning |
|---|---|
| `spatial.point_match.count` | total point matching query |
| `spatial.point_match.no_match.count` | outside coverage |
| `spatial.point_match.ambiguous.count` | multiple areas matched |
| `spatial.query.duration` | latency |
| `spatial.join.duration` | spatial join cost |
| `spatial.invalid_input.count` | invalid lon/lat/type |
| `spatial.geometry.invalid.count` | invalid production geometry |

Alert:

| Alert | Why |
|---|---|
| ambiguous match spike | overlap/import issue |
| no match spike | boundary coverage issue |
| query latency spike | index/geometry complexity |
| invalid geometry > 0 | data quality issue |

---

## 33. Production Failure Modes

| Failure mode | Penyebab | Mitigasi |
|---|---|---|
| Point on boundary tidak match | Pakai `ST_Contains` strict | Pakai `ST_Covers` jika boundary-inclusive |
| Multiple match tak terdeteksi | Area overlap | Return ambiguity / tie-breaker |
| Cross-tenant match | Join tanpa tenant condition | Always `tenant_id` in join |
| Query lambat | Spatial join terlalu luas | Filter metadata dulu |
| Index tidak dipakai | Function/cast tidak cocok | EXPLAIN, GiST index, bbox filter |
| Boundary invalid | Import buruk | `ST_IsValid` pipeline |
| SRID mismatch | Source CRS beda | Constraint + transform |
| Geometry terlalu besar | Boundary detail tinggi | `ST_Subdivide`, simplify, precompute |
| Semantic salah | Pilih predicate tidak sesuai | Contract table / predicate review |
| Result nondeterministic | No ORDER BY | Tie-breaker explicit |

---

## 34. Anti-Pattern

### 34.1 Semua Pakai `ST_Intersects`

```sql id="pgxbmu"
WHERE ST_Intersects(area.boundary, point)
```

Ini bisa benar untuk banyak kasus, tetapi semantic-nya terlalu longgar jika sebenarnya butuh “area mengandung point” atau boundary-inclusive “covers”.

---

### 34.2 Tidak Menangani Multiple Match

```sql id="tt66sc"
SELECT *
FROM service_area
WHERE ST_Covers(boundary, point)
LIMIT 1;
```

Tanpa `ORDER BY`, hasil tidak deterministic.

---

### 34.3 Spatial Join Tanpa Metadata Filter

```sql id="ls4cst"
SELECT *
FROM branch_location b
JOIN service_area a
  ON ST_Covers(a.boundary, b.location);
```

Ini berbahaya di multi-tenant table besar. Tambahkan tenant/status/type filter.

---

### 34.4 Menghitung Intersection untuk Semua Row

```sql id="80dp8p"
WHERE ST_Area(ST_Intersection(a.boundary, z.boundary)::geography) > 1000
```

Tanpa `ST_Intersects` candidate filter, ini mahal.

---

## 35. Practical Decision Table

| Problem | Recommended query |
|---|---|
| Point inside area strict | `ST_Contains(area, point)` |
| Point inside area including boundary | `ST_Covers(area, point)` |
| Branch in area | `ST_Covers(area.boundary, branch.location)` |
| Area intersects risk zone | `ST_Intersects(area.boundary, zone.boundary)` |
| Area overlaps partially | `ST_Overlaps(a.boundary, b.boundary)` |
| Neighboring areas | `ST_Touches(a.boundary, b.boundary)` |
| Route crosses area | `ST_Intersects(route.path, area.boundary)` |
| Overlap area ratio | `ST_Intersects` then `ST_Intersection` + `ST_Area` |
| Very specific relation | `ST_Relate` + bbox prefilter |
| Multiple matches | `ORDER BY priority/level` + ambiguity handling |
| Heavy repeated join | Precompute relationship |

---

## 36. Ringkasan Praktis

```text id="sb8j71"
Spatial Query Production Rule
│
├── Choose predicate by business meaning
│   ├── ST_Contains = strict containment
│   ├── ST_Covers = boundary-inclusive containment
│   ├── ST_Within = inverse containment
│   ├── ST_Intersects = any common point
│   ├── ST_Overlaps = partial overlap same dimension
│   └── ST_Touches = boundary contact
│
├── Always filter metadata
│   ├── tenant_id
│   ├── status
│   ├── type/level
│   └── effective window
│
├── Handle ambiguity
│   ├── overlap
│   ├── shared boundary
│   ├── parent-child area
│   └── duplicate import
│
├── Optimize query
│   ├── GiST spatial index
│   ├── B-tree metadata index
│   ├── bbox/candidate filter
│   ├── two-phase exact calculation
│   └── precompute repeated joins
│
└── Guard data quality
    ├── valid geometry
    ├── consistent SRID
    ├── deterministic ordering
    ├── boundary semantics
    └── production EXPLAIN
```

---

# Status

**Seri 15/19 selesai.**

Berikutnya: **Seri 16/19 - Distance & Nearest Neighbor: `ST_DWithin`, `ST_Distance`, geography vs geometry distance, KNN `<->`, radius search, ranking, dan performance tuning.**

---

**Sources:**

- [ST_Relate](https://postgis.net/docs/ST_Relate.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 9:04:46 PM

# Seri 16/19 - Distance & Nearest Neighbor: `ST_DWithin`, `ST_Distance`, Geography vs Geometry, KNN `<->`, Radius Search, Ranking

## 1. Tujuan Seri Ini

Seri ini membahas pola query **jarak dan nearest-neighbor** di PostgreSQL/PostGIS.

Fokus praktis:

1. Mencari objek dalam radius tertentu.
2. Mengurutkan lokasi berdasarkan jarak.
3. Memilih cabang/merchant/facility terdekat.
4. Memahami `ST_DWithin` vs `ST_Distance`.
5. Memilih `geometry` atau `geography` untuk distance.
6. Menggunakan KNN operator `<->`.
7. Membuat query radius search yang index-friendly.
8. Menghindari bug klasik: jarak derajat dianggap meter.
9. Mendesain query nearest-neighbor untuk API Java/Jersey/MyBatis.

PostGIS `ST_DWithin` mengembalikan true jika dua geometry/geography berada dalam jarak tertentu. Untuk `geometry`, unit jarak mengikuti spatial reference system geometry; untuk `geography`, unitnya meter dan default measurement memakai spheroid. ([PostGIS](https://postgis.net/docs/ST_DWithin.html?utm_source=chatgpt.com))

---

## 2. Mental Model

```text id="fe845l"
Distance & Nearest Neighbor Model
│
├── Input
│   ├── longitude
│   ├── latitude
│   ├── radiusMeters
│   ├── tenant_id
│   ├── status/type filter
│   └── limit
│
├── Spatial Representation
│   ├── geometry(Point, 4326)
│   ├── geography(Point, 4326)
│   ├── projected geometry
│   └── generated geography
│
├── Query Pattern
│   ├── radius search
│   ├── nearest N
│   ├── nearest per group
│   ├── nearest within category
│   ├── distance ranking
│   └── fallback if no match
│
├── Function / Operator
│   ├── ST_DWithin
│   ├── ST_Distance
│   ├── <-> KNN
│   ├── ST_Transform
│   └── ST_MakePoint
│
└── Performance
    ├── GiST index
    ├── geography index
    ├── metadata B-tree index
    ├── candidate filtering
    ├── ORDER BY strategy
    └── EXPLAIN ANALYZE
```

---

## 3. Sample Table

Kita pakai contoh `branch_location`.

```sql id="gg51am"
CREATE TABLE branch_location (
    branch_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    branch_code text NOT NULL,
    branch_name text NOT NULL,

    branch_type text NOT NULL,
    status text NOT NULL,

    location geometry(Point, 4326) NOT NULL,

    address_text text NULL,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_branch_location_code
        UNIQUE (tenant_id, branch_code),

    CONSTRAINT ck_branch_location_type
        CHECK (branch_type IN ('MAIN', 'REGULAR', 'AGENT', 'ATM', 'PARTNER')),

    CONSTRAINT ck_branch_location_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'CLOSED')),

    CONSTRAINT ck_branch_location_metadata_object
        CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX idx_branch_location_tenant_type_status
    ON branch_location (tenant_id, branch_type, status);

CREATE INDEX idx_branch_location_location_gist
    ON branch_location
    USING gist (location)
    WHERE status = 'ACTIVE';
```

---

## 4. `ST_DWithin` vs `ST_Distance`

### 4.1 `ST_DWithin`

Gunakan untuk **filter radius**.

```sql id="vs9a5z"
SELECT
    branch_id,
    branch_code,
    branch_name
FROM branch_location
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND ST_DWithin(
      location::geography,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
      :radiusMeters
  );
```

### 4.2 `ST_Distance`

Gunakan untuk **menghitung nilai jarak** atau ranking.

```sql id="4x85ch"
SELECT
    branch_id,
    branch_code,
    branch_name,
    ST_Distance(
        location::geography,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
    ) AS distance_meters
FROM branch_location
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
ORDER BY distance_meters
LIMIT 10;
```

PostGIS `ST_Distance` untuk `geometry` mengembalikan minimum 2D Cartesian distance dalam unit spatial reference system, sedangkan untuk `geography` mengembalikan jarak geodesic dalam meter secara default. ([PostGIS](https://postgis.net/docs/ST_Distance.html?utm_source=chatgpt.com))

### Rule praktis

```text id="zr96rs"
Filter radius:
  gunakan ST_DWithin

Tampilkan/ranking jarak:
  gunakan ST_Distance

Jangan:
  WHERE ST_Distance(...) <= radius
  untuk query besar
```

Kenapa?

| Pattern | Masalah |
|---|---|
| `WHERE ST_Distance(...) <= radius` | Sering memaksa hitung distance ke banyak row |
| `WHERE ST_DWithin(...)` | Lebih cocok untuk index-assisted radius filtering |
| `ORDER BY ST_Distance(...)` tanpa filter | Bisa mahal jika kandidat sangat banyak |
| `ST_DWithin + ST_Distance ORDER BY` | Umum untuk radius + ranking |

---

## 5. Geometry Distance: Unit Bukan Meter Jika EPSG:4326

Contoh berbahaya:

```sql id="cm6qgf"
SELECT ST_Distance(
    ST_SetSRID(ST_MakePoint(106.8456, -6.2088), 4326),
    ST_SetSRID(ST_MakePoint(106.9000, -6.2500), 4326)
);
```

Jika memakai `geometry(Point, 4326)`, unit hasilnya adalah derajat, bukan meter. Ini bukan jarak meter yang bisa dipakai untuk radius 5000 meter.

Buruk:

```sql id="14ssdd"
WHERE ST_DWithin(
    location,
    ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326),
    5000
)
```

Kalau `location` adalah `geometry(Point, 4326)`, angka `5000` berarti 5000 derajat, bukan 5000 meter.

Lebih aman untuk GPS lon/lat global:

```sql id="y8e0n1"
WHERE ST_DWithin(
    location::geography,
    ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
    5000
)
```

---

## 6. Geography Distance: Meter Natural

Untuk API umum seperti:

```http id="bp5plu"
GET /branches/nearby?longitude=106.8456&latitude=-6.2088&radiusMeters=5000
```

`geography` sangat natural karena unit radius meter.

```sql id="ak6d33"
SELECT
    branch_id,
    branch_code,
    branch_name,
    ST_Distance(
        location::geography,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
    ) AS distance_meters
FROM branch_location
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND ST_DWithin(
      location::geography,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
      :radiusMeters
  )
ORDER BY distance_meters ASC
LIMIT :limit;
```

Untuk `geography`, `ST_DWithin` memakai meter dan default `use_spheroid = true`; ada opsi `use_spheroid = false` untuk evaluasi lebih cepat memakai model sphere. ([PostGIS](https://postgis.net/docs/ST_DWithin.html?utm_source=chatgpt.com))

---

## 7. Storage Pattern untuk Distance Query

### Option A - Simpan `geometry(Point, 4326)` dan Cast ke Geography Saat Query

```sql id="9inxa9"
location geometry(Point, 4326) NOT NULL
```

Query:

```sql id="3c4xep"
ST_DWithin(location::geography, :point::geography, :radiusMeters)
```

Kelebihan:

| Kelebihan | Catatan |
|---|---|
| Geometry fleksibel | Cocok untuk spatial join, polygon, GIS function |
| Schema umum | Banyak data spatial pakai geometry |
| Mudah extract lon/lat | `ST_X`, `ST_Y` |

Kekurangan:

| Kekurangan | Catatan |
|---|---|
| Cast per query | Bisa menghambat index kalau tidak ada expression index |
| Distance meter perlu cast | Developer harus disiplin |
| Query berat bisa lambat | Perlu benchmark |

---

### Option B - Simpan `geography(Point, 4326)`

```sql id="ge665z"
location_geog geography(Point, 4326) NOT NULL
```

Index:

```sql id="5a63rm"
CREATE INDEX idx_branch_location_geog_gist
    ON branch_location
    USING gist (location_geog);
```

Query:

```sql id="81fxow"
ST_DWithin(location_geog, :point_geog, :radiusMeters)
```

Kelebihan:

| Kelebihan | Catatan |
|---|---|
| Meter natural | API radius lebih sederhana |
| Bisa index geography langsung | Cocok untuk nearby lookup |
| Mengurangi bug derajat vs meter | Lebih aman untuk dev |

Kekurangan:

| Kekurangan | Catatan |
|---|---|
| Fungsi lebih terbatas dibanding geometry | Beberapa GIS operation lebih natural di geometry |
| Bisa lebih mahal | Distance geodesic |
| Spatial join polygon bisa kurang fleksibel | Geometry sering lebih nyaman |

---

### Option C - Simpan Geometry + Generated Geography

```sql id="h3h2nw"
ALTER TABLE branch_location
ADD COLUMN location_geog geography(Point, 4326)
GENERATED ALWAYS AS (location::geography) STORED;

CREATE INDEX idx_branch_location_location_geog_gist
    ON branch_location
    USING gist (location_geog)
    WHERE status = 'ACTIVE';
```

Query:

```sql id="k02xxl"
SELECT
    branch_id,
    branch_code,
    branch_name,
    ST_Distance(
        location_geog,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
    ) AS distance_meters
FROM branch_location
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND ST_DWithin(
      location_geog,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
      :radiusMeters
  )
ORDER BY distance_meters
LIMIT :limit;
```

Ini sering menjadi pattern enterprise yang enak:

```text id="psw7xm"
geometry column:
  untuk spatial modeling dan GIS operation

generated geography column:
  untuk nearby/radius query dalam meter
```

---

## 8. Radius Search Pattern

### 8.1 Basic Radius Search

```sql id="hrx0b3"
SELECT
    branch_id,
    branch_code,
    branch_name,
    ST_Distance(
        location_geog,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
    ) AS distance_meters
FROM branch_location
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND ST_DWithin(
      location_geog,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
      :radiusMeters
  )
ORDER BY distance_meters ASC
LIMIT :limit;
```

### 8.2 Dengan Type Filter

```sql id="iqrjdb"
SELECT
    branch_id,
    branch_code,
    branch_name,
    branch_type,
    ST_Distance(
        location_geog,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
    ) AS distance_meters
FROM branch_location
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND branch_type = :branchType
  AND ST_DWithin(
      location_geog,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
      :radiusMeters
  )
ORDER BY distance_meters ASC
LIMIT :limit;
```

### 8.3 Dengan Max Result dan Fallback

Practical API sering butuh fallback jika radius kecil tidak ada hasil.

```text id="lkloy6"
Try radius 2km
If none:
  try radius 5km
If none:
  try radius 20km
If none:
  return no nearby branch
```

Jangan langsung radius sangat besar jika data banyak.

---

## 9. `ST_DWithin` sebagai Candidate Filter, `ST_Distance` sebagai Ranking

Pattern production paling umum:

```sql id="9sdf0c"
WITH candidates AS (
    SELECT
        branch_id,
        branch_code,
        branch_name,
        location_geog
    FROM branch_location
    WHERE tenant_id = :tenantId
      AND status = 'ACTIVE'
      AND ST_DWithin(
          location_geog,
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
          :radiusMeters
      )
)
SELECT
    branch_id,
    branch_code,
    branch_name,
    ST_Distance(
        location_geog,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
    ) AS distance_meters
FROM candidates
ORDER BY distance_meters ASC
LIMIT :limit;
```

Ini memisahkan:

| Phase | Fungsi |
|---|---|
| Candidate filter | `ST_DWithin` |
| Ranking | `ST_Distance` |

---

## 10. Nearest N tanpa Radius

Jika ingin “10 cabang terdekat” tanpa radius, ada dua pola.

### 10.1 Direct Distance Sort

```sql id="o6mmbt"
SELECT
    branch_id,
    branch_code,
    branch_name,
    ST_Distance(
        location_geog,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
    ) AS distance_meters
FROM branch_location
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
ORDER BY distance_meters ASC
LIMIT 10;
```

Ini sederhana, tapi bisa mahal jika kandidat banyak.

### 10.2 KNN `<->` untuk Geometry

PostGIS distance operator `<->` mengembalikan 2D distance antara geometry dan, jika dipakai dalam `ORDER BY`, dapat memberikan result nearest-neighbor yang dibantu index. ([PostGIS](https://postgis.net/docs/geometry_distance_knn.html?utm_source=chatgpt.com))

```sql id="w43gkm"
SELECT
    branch_id,
    branch_code,
    branch_name,
    location <-> ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326) AS knn_distance
FROM branch_location
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
ORDER BY location <-> ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
LIMIT 10;
```

Caveat besar:

```text id="mb5obz"
Untuk geometry(Point, 4326), <-> distance dalam derajat,
bukan meter.
```

Pattern yang sering aman:

1. gunakan KNN `<->` untuk candidate cepat,
2. hitung jarak meter sebenarnya dengan geography,
3. reorder final berdasarkan meter.

---

## 11. KNN Candidate + Accurate Distance Ranking

```sql id="nnfzwa"
WITH nearest_candidates AS (
    SELECT
        branch_id,
        branch_code,
        branch_name,
        location,
        location_geog
    FROM branch_location
    WHERE tenant_id = :tenantId
      AND status = 'ACTIVE'
    ORDER BY location <-> ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
    LIMIT 100
)
SELECT
    branch_id,
    branch_code,
    branch_name,
    ST_Distance(
        location_geog,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
    ) AS distance_meters
FROM nearest_candidates
ORDER BY distance_meters ASC
LIMIT :limit;
```

Kelebihan:

| Kelebihan | Penjelasan |
|---|---|
| Candidate search cepat | KNN GiST geometry |
| Final distance akurat meter | Geography distance |
| Tidak hitung semua row | Hanya top candidate |
| Cocok untuk nearest tanpa radius | Praktis untuk API “nearest branch” |

Caveat:

| Caveat | Mitigasi |
|---|---|
| Candidate limit terlalu kecil | Bisa miss nearest meter di area tertentu |
| Derajat KNN tidak sama persis meter | Pakai candidate cukup besar |
| Data global lintas lintang ekstrem | Pertimbangkan geography-native strategy |
| Query harus di-benchmark | `EXPLAIN ANALYZE` |

---

## 12. KNN dengan LATERAL: Nearest Branch per Customer

Misalnya ingin mencari branch terdekat untuk setiap customer location.

```sql id="s3bbfh"
SELECT
    c.customer_id,
    c.snapshot_id,
    nearest.branch_id,
    nearest.branch_code,
    nearest.branch_name,
    nearest.distance_meters
FROM customer_location_snapshot c
CROSS JOIN LATERAL (
    SELECT
        b.branch_id,
        b.branch_code,
        b.branch_name,
        ST_Distance(b.location_geog, c.location::geography) AS distance_meters
    FROM branch_location b
    WHERE b.tenant_id = c.tenant_id
      AND b.status = 'ACTIVE'
    ORDER BY b.location <-> c.location
    LIMIT 1
) nearest
WHERE c.tenant_id = :tenantId
  AND c.captured_at >= :fromTime
  AND c.captured_at < :toTime;
```

Use case:

| Use case | Contoh |
|---|---|
| Assign customer to nearest branch | customer service routing |
| Nearest facility per incident | case dispatch |
| Nearest agent per request | field operation |
| Nearest merchant/service point | recommendation |

---

## 13. Nearest within Radius

Kadang requirement:

> Cari cabang terdekat, tapi hanya jika dalam 5 km.

```sql id="1krngx"
SELECT
    branch_id,
    branch_code,
    branch_name,
    ST_Distance(
        location_geog,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
    ) AS distance_meters
FROM branch_location
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND ST_DWithin(
      location_geog,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
      :radiusMeters
  )
ORDER BY distance_meters ASC
LIMIT 1;
```

Jika tidak ada hasil, return:

```json id="rskadn"
{
  "matched": false,
  "reason": "NO_BRANCH_WITHIN_RADIUS",
  "radiusMeters": 5000
}
```

---

## 14. Ranking dengan Business Priority + Distance

Nearest tidak selalu satu-satunya faktor. Kadang perlu ranking:

```text id="9sv9p0"
eligible first
branch_type priority
capacity available
distance
```

Contoh:

```sql id="wuydxy"
SELECT
    branch_id,
    branch_code,
    branch_name,
    branch_type,
    ST_Distance(
        location_geog,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
    ) AS distance_meters
FROM branch_location
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND branch_type IN ('MAIN', 'REGULAR', 'AGENT')
  AND ST_DWithin(
      location_geog,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
      :radiusMeters
  )
ORDER BY
    CASE branch_type
        WHEN 'MAIN' THEN 1
        WHEN 'REGULAR' THEN 2
        WHEN 'AGENT' THEN 3
        ELSE 9
    END,
    distance_meters ASC
LIMIT :limit;
```

Jika business ingin “terdekat absolut”, order by distance dulu. Jika ingin “prioritas tipe, lalu jarak”, order seperti di atas.

Pastikan requirement jelas.

---

## 15. Avoid Repeating Point Expression

Buruk:

```sql id="7ciqey"
ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
```

ditulis berkali-kali.

Lebih rapi:

```sql id="s0wtlf"
WITH input_point AS (
    SELECT
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326) AS geom,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography AS geog
)
SELECT
    b.branch_id,
    b.branch_code,
    b.branch_name,
    ST_Distance(b.location_geog, p.geog) AS distance_meters
FROM branch_location b
CROSS JOIN input_point p
WHERE b.tenant_id = :tenantId
  AND b.status = 'ACTIVE'
  AND ST_DWithin(b.location_geog, p.geog, :radiusMeters)
ORDER BY distance_meters
LIMIT :limit;
```

Ini juga membuat MyBatis XML lebih mudah dibaca.

---

## 16. Generated Geography Column

DDL:

```sql id="qu97l3"
ALTER TABLE branch_location
ADD COLUMN location_geog geography(Point, 4326)
GENERATED ALWAYS AS (location::geography) STORED;
```

Index:

```sql id="1vfi9x"
CREATE INDEX idx_branch_location_geog_active_gist
    ON branch_location
    USING gist (location_geog)
    WHERE status = 'ACTIVE';
```

Query:

```sql id="h373xi"
WITH input_point AS (
    SELECT ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography AS geog
)
SELECT
    b.branch_id,
    b.branch_code,
    b.branch_name,
    ST_Distance(b.location_geog, p.geog) AS distance_meters
FROM branch_location b
CROSS JOIN input_point p
WHERE b.tenant_id = :tenantId
  AND b.status = 'ACTIVE'
  AND ST_DWithin(b.location_geog, p.geog, :radiusMeters)
ORDER BY distance_meters
LIMIT :limit;
```

Production note:

| Hal | Catatan |
|---|---|
| Generated column | Konsisten dengan geometry |
| GiST geography index | Membantu radius query |
| Storage tambahan | Ada cost |
| Write cost | Ada cost saat insert/update location |
| API lebih aman | Tidak perlu cast column per query |

---

## 17. Expression Index Jika Tidak Pakai Generated Column

Jika tidak ingin tambah column:

```sql id="pzoyhu"
CREATE INDEX idx_branch_location_location_geog_expr
    ON branch_location
    USING gist ((location::geography))
    WHERE status = 'ACTIVE';
```

Query harus match expression:

```sql id="x2eipm"
WHERE ST_DWithin(
    location::geography,
    ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
    :radiusMeters
)
```

Generated column biasanya lebih readable, tetapi expression index bisa cukup.

---

## 18. Bounding Box Pre-Filter untuk Geometry

Untuk local/regional projected CRS, bisa pakai geometry dengan meter jika data ditransform ke projection yang sesuai.

Contoh kasar untuk geometry 4326 tidak boleh menganggap meter. Tapi untuk candidate kasar, bounding box derajat kadang dipakai dengan hati-hati.

Lebih benar jika punya projected geometry:

```sql id="2xzb4v"
location_utm geometry(Point, 32748) -- contoh, tergantung zona/proyeksi
```

Query:

```sql id="ws6a85"
SELECT
    branch_id,
    branch_code
FROM branch_location_projected
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND ST_DWithin(
      location_utm,
      ST_Transform(
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326),
          32748
      ),
      :radiusMeters
  );
```

Untuk sistem yang hanya beroperasi di area lokal tertentu, projected geometry bisa sangat efisien. Untuk multi-region/global, geography lebih sederhana.

---

## 19. Pagination untuk Nearby Query

Jangan gunakan `OFFSET` besar untuk nearby query yang mahal.

Kurang ideal:

```sql id="68l7ag"
ORDER BY distance_meters
LIMIT 20 OFFSET 10000
```

Lebih baik gunakan cursor berbasis distance + id:

```sql id="jyie8y"
WITH input_point AS (
    SELECT ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography AS geog
),
ranked AS (
    SELECT
        b.branch_id,
        b.branch_code,
        b.branch_name,
        ST_Distance(b.location_geog, p.geog) AS distance_meters
    FROM branch_location b
    CROSS JOIN input_point p
    WHERE b.tenant_id = :tenantId
      AND b.status = 'ACTIVE'
      AND ST_DWithin(b.location_geog, p.geog, :radiusMeters)
)
SELECT *
FROM ranked
WHERE
    (:afterDistanceMeters IS NULL OR distance_meters > :afterDistanceMeters)
    OR (
        distance_meters = :afterDistanceMeters
        AND branch_id > :afterBranchId
    )
ORDER BY distance_meters ASC, branch_id ASC
LIMIT :limit;
```

Caveat: floating distance cursor perlu hati-hati. Banyak API cukup membatasi `limit <= 100` dan radius reasonable.

---

## 20. Radius Limit Guardrail

Jangan biarkan client request radius arbitrarily besar.

```text id="8pjdye"
max radius:
  ATM search: 10 km
  branch search: 50 km
  delivery service: 25 km
  admin analysis: 200 km with permission
```

Java validation:

```java id="7rtaeg"
public record NearbyBranchRequest(
    BigDecimal longitude,
    BigDecimal latitude,
    int radiusMeters,
    int limit,
    String branchType
) {
    public NearbyBranchRequest {
        if (longitude.compareTo(BigDecimal.valueOf(-180)) < 0
            || longitude.compareTo(BigDecimal.valueOf(180)) > 0) {
            throw new IllegalArgumentException("longitude must be between -180 and 180");
        }
        if (latitude.compareTo(BigDecimal.valueOf(-90)) < 0
            || latitude.compareTo(BigDecimal.valueOf(90)) > 0) {
            throw new IllegalArgumentException("latitude must be between -90 and 90");
        }
        if (radiusMeters <= 0 || radiusMeters > 50_000) {
            throw new IllegalArgumentException("radiusMeters must be 1..50000");
        }
        if (limit <= 0 || limit > 100) {
            limit = 20;
        }
    }
}
```

---

## 21. MyBatis Mapper: Nearby Search

```java id="h8h82r"
public interface BranchSpatialQueryMapper {

    List<NearbyBranchRecord> findNearbyBranches(
        @Param("tenantId") UUID tenantId,
        @Param("longitude") BigDecimal longitude,
        @Param("latitude") BigDecimal latitude,
        @Param("radiusMeters") int radiusMeters,
        @Param("branchType") String branchType,
        @Param("limit") int limit
    );

    List<NearbyBranchRecord> findNearestBranchCandidates(
        @Param("tenantId") UUID tenantId,
        @Param("longitude") BigDecimal longitude,
        @Param("latitude") BigDecimal latitude,
        @Param("candidateLimit") int candidateLimit,
        @Param("limit") int limit
    );
}
```

Record:

```java id="m52g9y"
public record NearbyBranchRecord(
    UUID branchId,
    String branchCode,
    String branchName,
    String branchType,
    BigDecimal longitude,
    BigDecimal latitude,
    BigDecimal distanceMeters
) {}
```

---

## 22. MyBatis XML: Radius Search

```xml id="8xoub9"
<select id="findNearbyBranches" resultMap="NearbyBranchResultMap">
    WITH input_point AS (
        SELECT
            ST_SetSRID(
                ST_MakePoint(#{longitude}, #{latitude}),
                4326
            )::geography AS geog
    )
    SELECT
        b.branch_id,
        b.branch_code,
        b.branch_name,
        b.branch_type,
        ST_X(b.location) AS longitude,
        ST_Y(b.location) AS latitude,
        ST_Distance(b.location_geog, p.geog) AS distance_meters
    FROM branch_location b
    CROSS JOIN input_point p
    WHERE b.tenant_id = #{tenantId}
      AND b.status = 'ACTIVE'

    <if test="branchType != null">
      AND b.branch_type = #{branchType}
    </if>

      AND ST_DWithin(
          b.location_geog,
          p.geog,
          #{radiusMeters}
      )
    ORDER BY distance_meters ASC, b.branch_code ASC
    LIMIT #{limit}
</select>
```

Result map:

```xml id="lggoec"
<resultMap id="NearbyBranchResultMap"
           type="com.company.spatial.persistence.NearbyBranchRecord">
    <constructor>
        <arg column="branch_id" javaType="java.util.UUID"/>
        <arg column="branch_code" javaType="string"/>
        <arg column="branch_name" javaType="string"/>
        <arg column="branch_type" javaType="string"/>
        <arg column="longitude" javaType="java.math.BigDecimal"/>
        <arg column="latitude" javaType="java.math.BigDecimal"/>
        <arg column="distance_meters" javaType="java.math.BigDecimal"/>
    </constructor>
</resultMap>
```

---

## 23. MyBatis XML: KNN Candidate + Accurate Distance

```xml id="1cwio9"
<select id="findNearestBranchCandidates" resultMap="NearbyBranchResultMap">
    WITH input_point AS (
        SELECT
            ST_SetSRID(ST_MakePoint(#{longitude}, #{latitude}), 4326) AS geom,
            ST_SetSRID(ST_MakePoint(#{longitude}, #{latitude}), 4326)::geography AS geog
    ),
    nearest_candidates AS (
        SELECT
            b.branch_id,
            b.branch_code,
            b.branch_name,
            b.branch_type,
            b.location,
            b.location_geog
        FROM branch_location b
        CROSS JOIN input_point p
        WHERE b.tenant_id = #{tenantId}
          AND b.status = 'ACTIVE'
        ORDER BY b.location <-> p.geom
        LIMIT #{candidateLimit}
    )
    SELECT
        c.branch_id,
        c.branch_code,
        c.branch_name,
        c.branch_type,
        ST_X(c.location) AS longitude,
        ST_Y(c.location) AS latitude,
        ST_Distance(c.location_geog, p.geog) AS distance_meters
    FROM nearest_candidates c
    CROSS JOIN input_point p
    ORDER BY distance_meters ASC, c.branch_code ASC
    LIMIT #{limit}
</select>
```

Gunakan ini saat user meminta nearest N tanpa radius, tetapi tetap ingin final distance dalam meter.

---

## 24. Jersey Resource

```java id="x1ijxn"
@Path("/tenants/{tenantId}/branches")
@Produces(MediaType.APPLICATION_JSON)
public class BranchSpatialResource {

    private final BranchSpatialService branchSpatialService;

    @GET
    @Path("/nearby")
    public Response nearby(
        @PathParam("tenantId") UUID tenantId,
        @QueryParam("longitude") BigDecimal longitude,
        @QueryParam("latitude") BigDecimal latitude,
        @DefaultValue("5000") @QueryParam("radiusMeters") int radiusMeters,
        @QueryParam("branchType") String branchType,
        @DefaultValue("20") @QueryParam("limit") int limit
    ) {
        NearbyBranchRequest request = new NearbyBranchRequest(
            longitude,
            latitude,
            radiusMeters,
            limit,
            branchType
        );

        List<NearbyBranchResponse> result =
            branchSpatialService.findNearbyBranches(tenantId, request);

        return Response.ok(result).build();
    }
}
```

---

## 25. Service Layer

```java id="ms27jk"
public final class BranchSpatialService {

    private final BranchSpatialQueryMapper mapper;

    public BranchSpatialService(BranchSpatialQueryMapper mapper) {
        this.mapper = mapper;
    }

    public List<NearbyBranchResponse> findNearbyBranches(
        UUID tenantId,
        NearbyBranchRequest request
    ) {
        validateBranchType(request.branchType());

        List<NearbyBranchRecord> records = mapper.findNearbyBranches(
            tenantId,
            request.longitude(),
            request.latitude(),
            request.radiusMeters(),
            request.branchType(),
            request.limit()
        );

        return records.stream()
            .map(NearbyBranchResponse::from)
            .toList();
    }

    private void validateBranchType(String branchType) {
        if (branchType == null) {
            return;
        }

        if (!Set.of("MAIN", "REGULAR", "AGENT", "ATM", "PARTNER").contains(branchType)) {
            throw new IllegalArgumentException("Invalid branchType");
        }
    }
}
```

---

## 26. Response Contract

```json id="8tq3c6"
[
  {
    "branchId": "f7e4...",
    "branchCode": "JKT-001",
    "branchName": "Jakarta Central Branch",
    "branchType": "REGULAR",
    "longitude": 106.8456,
    "latitude": -6.2088,
    "distanceMeters": 1250.42
  }
]
```

Untuk no result:

```json id="2uou4h"
[]
```

Atau richer response:

```json id="z73v3s"
{
  "matched": false,
  "radiusMeters": 5000,
  "items": []
}
```

Pilih satu contract dan konsisten.

---

## 27. `use_spheroid=false`: Kapan Dipakai?

`ST_DWithin` dan `ST_Distance` untuk geography punya opsi `use_spheroid`. Default-nya lebih akurat menggunakan spheroid; `false` memakai sphere dan bisa lebih cepat. ([PostGIS](https://postgis.net/docs/ST_DWithin.html?utm_source=chatgpt.com))

Contoh:

```sql id="fitzt6"
ST_DWithin(
    location_geog,
    p.geog,
    :radiusMeters,
    false
)
```

```sql id="6e3p1c"
ST_Distance(
    location_geog,
    p.geog,
    false
)
```

Decision:

| Need | Setting |
|---|---|
| Akurasi lebih penting | default / `true` |
| Radius kecil dan toleransi error acceptable | benchmark `false` |
| Compliance/legal distance | jangan pakai approximation tanpa approval |
| High-throughput nearby suggestion | boleh benchmark `false` |
| Reporting/analytics kasar | bisa dipertimbangkan |

---

## 28. EXPLAIN untuk Radius Query

```sql id="ppq1e8"
EXPLAIN (ANALYZE, BUFFERS)
WITH input_point AS (
    SELECT ST_SetSRID(ST_MakePoint(106.8456, -6.2088), 4326)::geography AS geog
)
SELECT
    b.branch_id,
    b.branch_code,
    ST_Distance(b.location_geog, p.geog) AS distance_meters
FROM branch_location b
CROSS JOIN input_point p
WHERE b.tenant_id = '00000000-0000-0000-0000-000000000001'
  AND b.status = 'ACTIVE'
  AND ST_DWithin(b.location_geog, p.geog, 5000)
ORDER BY distance_meters
LIMIT 20;
```

Hal yang dicari:

| Plan signal | Makna |
|---|---|
| GiST index scan / bitmap scan | Spatial index dipakai |
| Seq scan table besar | Index tidak efektif |
| Rows removed high | Candidate terlalu banyak |
| Sort costly | Kandidat besar, perlu limit/radius/filter |
| Buffers read tinggi | I/O bottleneck |
| Execution time naik seiring radius | Radius terlalu besar/candidate banyak |

---

## 29. Index Strategy

### 29.1 Metadata Index

```sql id="eow8qu"
CREATE INDEX idx_branch_location_tenant_type_status
    ON branch_location (tenant_id, branch_type, status);
```

### 29.2 Geography GiST Index

```sql id="u82r56"
CREATE INDEX idx_branch_location_geog_active_gist
    ON branch_location
    USING gist (location_geog)
    WHERE status = 'ACTIVE';
```

### 29.3 Geometry GiST Index untuk KNN

```sql id="tv2qyk"
CREATE INDEX idx_branch_location_geom_active_gist
    ON branch_location
    USING gist (location)
    WHERE status = 'ACTIVE';
```

### 29.4 Partial Index

Jika query hampir selalu active:

```sql id="skorzg"
CREATE INDEX idx_branch_location_active_geog_gist
    ON branch_location
    USING gist (location_geog)
    WHERE status = 'ACTIVE';
```

Practical note:

```text id="23xqy1"
GiST spatial index membantu spatial search.
B-tree tenant/type/status membantu metadata filtering.
Untuk query multi-tenant besar, keduanya penting.
```

---

## 30. Nearest Search dengan Category dan Capacity

Misalnya nearest branch hanya yang masih punya capacity.

```sql id="4yjr9n"
WITH input_point AS (
    SELECT ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography AS geog
)
SELECT
    b.branch_id,
    b.branch_code,
    b.branch_name,
    c.available_slots,
    ST_Distance(b.location_geog, p.geog) AS distance_meters
FROM branch_location b
JOIN branch_capacity c
  ON c.branch_id = b.branch_id
CROSS JOIN input_point p
WHERE b.tenant_id = :tenantId
  AND b.status = 'ACTIVE'
  AND c.available_slots > 0
  AND ST_DWithin(b.location_geog, p.geog, :radiusMeters)
ORDER BY distance_meters ASC
LIMIT :limit;
```

Jika capacity sering berubah, index spatial tetap di branch table, tapi filter dynamic join bisa menjadi bottleneck. Pertimbangkan materialized availability snapshot jika throughput tinggi.

---

## 31. Nearest Per Group

Cari cabang terdekat per `branch_type`.

```sql id="dpd7cz"
WITH input_point AS (
    SELECT ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography AS geog
),
ranked AS (
    SELECT
        b.branch_id,
        b.branch_code,
        b.branch_name,
        b.branch_type,
        ST_Distance(b.location_geog, p.geog) AS distance_meters,
        row_number() OVER (
            PARTITION BY b.branch_type
            ORDER BY ST_Distance(b.location_geog, p.geog)
        ) AS rn
    FROM branch_location b
    CROSS JOIN input_point p
    WHERE b.tenant_id = :tenantId
      AND b.status = 'ACTIVE'
      AND ST_DWithin(b.location_geog, p.geog, :radiusMeters)
)
SELECT *
FROM ranked
WHERE rn = 1
ORDER BY distance_meters;
```

Use case:

| Use case | Contoh |
|---|---|
| nearest ATM + nearest branch | group by type |
| nearest agent per partner | group by partner |
| nearest facility per capability | group by capability |
| fallback routing | nearest per service level |

---

## 32. Avoid Common Distance Bugs

| Bug | Contoh | Fix |
|---|---|---|
| Lat/lon tertukar | `ST_MakePoint(lat, lon)` | `ST_MakePoint(lon, lat)` |
| Derajat dianggap meter | `geometry 4326` + radius `5000` | cast/use `geography` |
| `ST_Distance` untuk filter | `WHERE ST_Distance <= r` | `ST_DWithin` |
| Tidak ada radius cap | client kirim 5.000 km | validate max radius |
| Tidak ada status filter | semua branch termasuk closed | filter status |
| No deterministic order | distance tie random | add `branch_code/id` |
| Cast column mismatch index | expression index tidak match | generated geography column |
| KNN `<->` dianggap meter | geometry 4326 KNN | final reorder with geography distance |
| External API pakai lat/lng | backend expect lon/lat | explicit field names |
| Direct large OFFSET | slow pagination | small limit/cursor |

---

## 33. Testing Strategy

### 33.1 PostgreSQL Integration Test

Seed:

```sql id="bpc7qe"
INSERT INTO branch_location (
    branch_id,
    tenant_id,
    branch_code,
    branch_name,
    branch_type,
    status,
    location
)
VALUES
(
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000001',
    'JKT-001',
    'Jakarta Central',
    'REGULAR',
    'ACTIVE',
    ST_SetSRID(ST_MakePoint(106.8456, -6.2088), 4326)
),
(
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000001',
    'BDG-001',
    'Bandung',
    'REGULAR',
    'ACTIVE',
    ST_SetSRID(ST_MakePoint(107.6191, -6.9175), 4326)
);
```

Test cases:

| Test | Expected |
|---|---|
| radius 1 km from Jakarta point | JKT match |
| radius too small | no match |
| Bandung not match Jakarta 5 km | excluded |
| inactive branch ignored | excluded |
| wrong tenant ignored | excluded |
| ordered by distance | nearest first |
| lat/lon swapped gives no/wrong result | validation catches if possible |
| radius > max | rejected by service |
| branchType filter | only selected type |

### 33.2 Performance Test

| Test | Expected |
|---|---|
| 100k points radius query | uses GiST |
| large radius | acceptable latency/capped |
| KNN nearest | uses geometry GiST |
| metadata filter | B-tree helps |
| no index baseline | slower, confirms index value |

---

## 34. Observability

Log fields:

```text id="icwoje"
tenant_id
query_type
longitude
latitude
radius_meters
limit
branch_type
result_count
min_distance_meters
max_distance_meters
duration_ms
```

Metrics:

| Metric | Meaning |
|---|---|
| `spatial.nearby.query.count` | total nearby query |
| `spatial.nearby.query.duration` | latency |
| `spatial.nearby.result.count` | returned result size |
| `spatial.nearby.no_result.count` | no match |
| `spatial.nearby.radius_meters` | requested radius distribution |
| `spatial.nearby.invalid_input.count` | bad lon/lat/radius |
| `spatial.nearby.large_radius.count` | possible expensive query |

Alert:

| Alert | Why |
|---|---|
| latency spike | index/plan/data growth issue |
| no-result spike | coverage/location issue |
| large radius spike | abuse/client bug |
| invalid input spike | API integration bug |

---

## 35. API Contract

### Request

```http id="1mcn7s"
GET /tenants/{tenantId}/branches/nearby?longitude=106.8456&latitude=-6.2088&radiusMeters=5000&limit=10
```

### Response

```json id="czzhms"
{
  "query": {
    "longitude": 106.8456,
    "latitude": -6.2088,
    "radiusMeters": 5000
  },
  "items": [
    {
      "branchId": "00000000-0000-0000-0000-000000000101",
      "branchCode": "JKT-001",
      "branchName": "Jakarta Central",
      "branchType": "REGULAR",
      "longitude": 106.8456,
      "latitude": -6.2088,
      "distanceMeters": 125.32
    }
  ]
}
```

### Error

```json id="3zjsdt"
{
  "code": "INVALID_RADIUS",
  "message": "radiusMeters must be between 1 and 50000"
}
```

---

## 36. Production Checklist

| Checklist | Status |
|---|---|
| Longitude/latitude validation | Wajib |
| Radius max limit | Wajib |
| `ST_DWithin` untuk radius filter | Wajib |
| `ST_Distance` untuk ranking/display | Wajib |
| Geometry 4326 tidak dianggap meter | Wajib |
| Geography/generated geography untuk meter query | Disarankan |
| GiST index untuk spatial column | Wajib |
| B-tree index untuk tenant/status/type | Wajib |
| Deterministic order by distance + id/code | Wajib |
| EXPLAIN ANALYZE dicek | Wajib |
| KNN `<->` dipakai dengan pemahaman unit | Wajib |
| Large radius monitored | Wajib |
| Integration test pakai PostgreSQL/PostGIS asli | Wajib |

---

## 37. Anti-Pattern

### 37.1 Filter Distance dengan `ST_Distance`

```sql id="q3xt5v"
WHERE ST_Distance(location_geog, p.geog) <= :radiusMeters
```

Gunakan:

```sql id="qq9oax"
WHERE ST_DWithin(location_geog, p.geog, :radiusMeters)
```

---

### 37.2 `geometry 4326` dengan Radius Meter

```sql id="2ho5lz"
ST_DWithin(location, point4326, 5000)
```

Ini salah jika maksudnya 5000 meter.

---

### 37.3 Nearest Tanpa Tenant/Status Filter

```sql id="0415xq"
SELECT *
FROM branch_location
ORDER BY location <-> point
LIMIT 10;
```

Di multi-tenant system, ini bisa cross-tenant leakage dan hasil salah.

---

### 37.4 Radius Tidak Dibatasi

Client bisa mengirim:

```text id="xuj812"
radiusMeters = 999999999
```

Ini bisa membuat query sangat mahal.

---

## 38. Practical Decision Table

| Need | Recommended query |
|---|---|
| Cari dalam radius meter | `ST_DWithin(geography, geography, meters)` |
| Tampilkan jarak meter | `ST_Distance(geography, geography)` |
| Nearest N tanpa radius | KNN `<->` candidate + final geography distance |
| Nearest within radius | `ST_DWithin` + `ORDER BY ST_Distance` |
| Local projected data | `geometry` dengan projected CRS |
| Global lon/lat simple nearby | `geography` |
| Banyak GIS operation + nearby | geometry + generated geography |
| Ranking dengan business priority | `ORDER BY priority, distance` |
| Nearest per group | window function + distance |
| Query sangat sering | precompute/cache/materialized view jika perlu |

---

## 39. Ringkasan Praktis

```text id="u2fun5"
Distance & Nearest Neighbor Rule
│
├── Use ST_DWithin for filtering
│   └── radius search
│
├── Use ST_Distance for ranking/display
│   └── distance_meters response
│
├── Understand units
│   ├── geometry = CRS units
│   └── geography = meters
│
├── For GPS lon/lat APIs
│   ├── use geography
│   ├── or generated geography column
│   └── validate lon/lat/radius
│
├── For nearest N
│   ├── KNN <-> for fast geometry candidates
│   ├── final ST_Distance geography for meter ranking
│   └── deterministic tie-breaker
│
├── Optimize
│   ├── GiST spatial index
│   ├── B-tree tenant/status/type index
│   ├── radius cap
│   ├── candidate filtering
│   └── EXPLAIN ANALYZE
│
└── API safety
    ├── explicit longitude/latitude
    ├── max radius
    ├── limit cap
    ├── no raw spatial expression
    └── clear no-result contract
```

---

# Status

**Seri 16/19 selesai.**

Berikutnya: **Seri 17/19 - Spatial Indexing & Performance: GiST, SP-GiST, BRIN, KNN index usage, partial spatial index, expression/generated geography index, EXPLAIN, bloat, dan tuning query spatial production.**

---

**Sources:**

- [ST_DWithin](https://postgis.net/docs/ST_DWithin.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 9:06:58 PM

# Seri 17/19 - Spatial Indexing & Performance: GiST, SP-GiST, BRIN, KNN, Partial Index, Generated Geography, EXPLAIN, Bloat, Tuning

## 1. Tujuan Seri Ini

Seri ini fokus pada **performance dan indexing untuk PostGIS** di PostgreSQL production.

Di seri sebelumnya kita sudah membahas:

1. fondasi PostGIS,
2. spatial data modeling,
3. spatial relationship query,
4. distance dan nearest-neighbor query.

Sekarang kita masuk ke pertanyaan production:

```text id="4xsx5i"
Kenapa query spatial lambat?
Index apa yang tepat?
Kenapa index tidak dipakai?
Kapan pakai GiST, SP-GiST, BRIN?
Bagaimana membaca EXPLAIN?
Bagaimana menghindari bloat dan query plan buruk?
```

PostgreSQL menyediakan beberapa index type seperti B-tree, Hash, GiST, SP-GiST, GIN, dan BRIN; tiap index type memakai algoritma berbeda dan cocok untuk jenis predicate yang berbeda. Untuk spatial workload PostGIS, yang paling sering dibahas adalah GiST, SP-GiST, dan BRIN, ditambah B-tree untuk metadata seperti `tenant_id`, `status`, `type`, dan timestamp. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-types.html?utm_source=chatgpt.com))

---

## 2. Mental Model

```text id="bt0vca"
Spatial Performance Mental Model
│
├── Query Shape
│   ├── tenant/status/type filter
│   ├── spatial predicate
│   ├── distance/ranking
│   ├── ORDER BY
│   ├── LIMIT
│   └── join cardinality
│
├── Index Layer
│   ├── B-tree metadata index
│   ├── GiST geometry/geography index
│   ├── SP-GiST spatial index
│   ├── BRIN spatial index
│   ├── partial spatial index
│   └── expression/generated geography index
│
├── Data Shape
│   ├── point count
│   ├── polygon complexity
│   ├── geometry size
│   ├── distribution/clustering
│   ├── active vs archived ratio
│   └── tenant cardinality
│
├── Query Plan
│   ├── Index Scan
│   ├── Bitmap Index Scan
│   ├── Bitmap Heap Scan
│   ├── Seq Scan
│   ├── Nested Loop
│   ├── Sort
│   └── Buffers
│
└── Operations
    ├── EXPLAIN ANALYZE
    ├── VACUUM / ANALYZE
    ├── REINDEX CONCURRENTLY
    ├── index usage monitoring
    ├── bloat review
    └── migration strategy
```

---

## 3. Sample Table

Kita pakai `branch_location` untuk point dan `service_area` untuk boundary.

```sql id="oxqacj"
CREATE TABLE branch_location (
    branch_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    branch_code text NOT NULL,
    branch_name text NOT NULL,
    branch_type text NOT NULL,
    status text NOT NULL,

    location geometry(Point, 4326) NOT NULL,

    location_geog geography(Point, 4326)
        GENERATED ALWAYS AS (location::geography) STORED,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_branch_location_code
        UNIQUE (tenant_id, branch_code),

    CONSTRAINT ck_branch_location_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'CLOSED')),

    CONSTRAINT ck_branch_location_type
        CHECK (branch_type IN ('MAIN', 'REGULAR', 'AGENT', 'ATM', 'PARTNER'))
);
```

```sql id="fsvhqp"
CREATE TABLE service_area (
    area_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    area_code text NOT NULL,
    area_name text NOT NULL,
    area_type text NOT NULL,
    status text NOT NULL,

    boundary geometry(MultiPolygon, 4326) NOT NULL,

    priority integer NOT NULL DEFAULT 100,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_service_area_code
        UNIQUE (tenant_id, area_code),

    CONSTRAINT ck_service_area_status
        CHECK (status IN ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED')),

    CONSTRAINT ck_service_area_type
        CHECK (area_type IN ('DELIVERY', 'BRANCH_COVERAGE', 'SALES', 'SUPPORT', 'CUSTOM'))
);
```

---

## 4. Index Pertama: Metadata B-tree

Spatial index bukan pengganti index metadata.

```sql id="6xw17c"
CREATE INDEX idx_branch_location_tenant_type_status
    ON branch_location (tenant_id, branch_type, status);
```

```sql id="99izga"
CREATE INDEX idx_service_area_tenant_type_status_priority
    ON service_area (tenant_id, area_type, status, priority);
```

Kenapa metadata B-tree penting?

| Query filter | Kenapa penting |
|---|---|
| `tenant_id` | multi-tenant boundary |
| `status` | biasanya hanya `ACTIVE` yang hot |
| `branch_type` / `area_type` | memperkecil candidate |
| `priority` | deterministic best match |
| `updated_at` | listing/admin query |

Contoh query:

```sql id="1s31fw"
SELECT
    area_id,
    area_code,
    area_name
FROM service_area
WHERE tenant_id = :tenantId
  AND area_type = 'DELIVERY'
  AND status = 'ACTIVE'
  AND ST_Covers(
      boundary,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
  )
ORDER BY priority ASC, area_code ASC
LIMIT 1;
```

Query ini butuh:

1. B-tree untuk `tenant_id`, `area_type`, `status`, `priority`.
2. GiST/SP-GiST untuk `boundary`.

---

## 5. GiST Spatial Index

GiST adalah default practical choice untuk banyak PostGIS workload.

```sql id="ryq5cc"
CREATE INDEX idx_branch_location_location_gist
    ON branch_location
    USING gist (location);
```

```sql id="vcqjcz"
CREATE INDEX idx_service_area_boundary_gist
    ON service_area
    USING gist (boundary);
```

PostGIS menyebut spatial index sebagai salah satu fondasi high-performance spatial querying; PostGIS juga menyediakan kemampuan storing, indexing, dan querying geospatial data di PostgreSQL. ([PostGIS](https://postgis.net/?utm_source=chatgpt.com))

### Query yang cocok dengan GiST

| Query | Contoh |
|---|---|
| Point-in-polygon | `ST_Covers(boundary, point)` |
| Intersects | `ST_Intersects(a.boundary, b.boundary)` |
| Radius geometry/geography | `ST_DWithin(...)` |
| KNN nearest | `ORDER BY geom <-> point` |
| Spatial join | `JOIN ... ON ST_Intersects(...)` |

### GiST partial index

Biasanya query production hanya pakai active data.

```sql id="0t6up3"
CREATE INDEX idx_branch_location_active_location_gist
    ON branch_location
    USING gist (location)
    WHERE status = 'ACTIVE';
```

```sql id="szs0s2"
CREATE INDEX idx_service_area_active_boundary_gist
    ON service_area
    USING gist (boundary)
    WHERE status = 'ACTIVE';
```

Partial index mengurangi index size dan write overhead untuk archived/inactive rows.

---

## 6. Geography GiST Index

Untuk radius query dalam meter, gunakan `geography`.

Jika punya generated geography column:

```sql id="m42dtj"
CREATE INDEX idx_branch_location_active_geog_gist
    ON branch_location
    USING gist (location_geog)
    WHERE status = 'ACTIVE';
```

Query:

```sql id="sqqnn7"
WITH input_point AS (
    SELECT ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography AS geog
)
SELECT
    b.branch_id,
    b.branch_code,
    b.branch_name,
    ST_Distance(b.location_geog, p.geog) AS distance_meters
FROM branch_location b
CROSS JOIN input_point p
WHERE b.tenant_id = :tenantId
  AND b.status = 'ACTIVE'
  AND ST_DWithin(b.location_geog, p.geog, :radiusMeters)
ORDER BY distance_meters ASC
LIMIT :limit;
```

`ST_DWithin` untuk `geography` memakai meter, sementara untuk `geometry` unitnya mengikuti spatial reference system geometry. Ini sangat penting agar radius seperti `5000` benar-benar berarti 5 km, bukan 5000 derajat. ([PostGIS](https://postgis.net/docs/geometry_distance_knn.html?utm_source=chatgpt.com))

---

## 7. Expression Index untuk Geography Cast

Jika belum mau menambah generated column:

```sql id="1h1r93"
CREATE INDEX idx_branch_location_active_geog_expr_gist
    ON branch_location
    USING gist ((location::geography))
    WHERE status = 'ACTIVE';
```

Query harus match expression:

```sql id="gc5bxk"
WHERE status = 'ACTIVE'
  AND ST_DWithin(
      location::geography,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
      :radiusMeters
  )
```

Decision:

| Pilihan | Cocok jika |
|---|---|
| `location::geography` expression index | ingin cepat tanpa ubah schema besar |
| generated `location_geog` | query banyak, readability penting |
| native `geography` column | workload utama adalah radius/distance meter |
| projected geometry | area lokal dan butuh meter planar cepat |

---

## 8. KNN Index Usage dengan `<->`

PostGIS operator `<->` mengembalikan 2D distance antara dua geometry. Jika dipakai dalam `ORDER BY`, operator ini bisa menghasilkan nearest-neighbor result set yang dibantu index. ([PostGIS](https://postgis.net/docs/geometry_distance_knn.html?utm_source=chatgpt.com))

```sql id="t6ne8x"
SELECT
    branch_id,
    branch_code,
    branch_name
FROM branch_location
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
ORDER BY location <-> ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
LIMIT 10;
```

Index:

```sql id="v36tov"
CREATE INDEX idx_branch_location_active_location_gist
    ON branch_location
    USING gist (location)
    WHERE status = 'ACTIVE';
```

Caveat:

```text id="smx8sg"
Jika geometry adalah EPSG:4326,
KNN <-> distance berada dalam derajat,
bukan meter.
```

Pattern production yang lebih aman:

```sql id="pq4284"
WITH input_point AS (
    SELECT
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326) AS geom,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography AS geog
),
nearest_candidates AS (
    SELECT
        b.branch_id,
        b.branch_code,
        b.branch_name,
        b.location,
        b.location_geog
    FROM branch_location b
    CROSS JOIN input_point p
    WHERE b.tenant_id = :tenantId
      AND b.status = 'ACTIVE'
    ORDER BY b.location <-> p.geom
    LIMIT 100
)
SELECT
    c.branch_id,
    c.branch_code,
    c.branch_name,
    ST_Distance(c.location_geog, p.geog) AS distance_meters
FROM nearest_candidates c
CROSS JOIN input_point p
ORDER BY distance_meters ASC, branch_code ASC
LIMIT :limit;
```

---

## 9. SP-GiST Spatial Index

SP-GiST adalah index type PostgreSQL untuk struktur data yang bisa dipartisi secara space-partitioned. PostgreSQL menyediakan SP-GiST sebagai salah satu index type resmi, bersama GiST, GIN, BRIN, dan lainnya. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-types.html?utm_source=chatgpt.com))

Dalam PostGIS, SP-GiST bisa berguna untuk beberapa workload spatial tertentu, terutama point data atau data yang cocok dengan partitioning strategy. Namun default enterprise choice biasanya tetap mulai dari GiST, lalu benchmark SP-GiST jika query/data shape cocok.

Contoh:

```sql id="ex0xon"
CREATE INDEX idx_branch_location_location_spgist
    ON branch_location
    USING spgist (location);
```

Kapan dipertimbangkan?

| Kondisi | Catatan |
|---|---|
| Data banyak berupa point | Branch/merchant/device point |
| Query bounding/range/nearest tertentu | Benchmark |
| GiST kurang optimal | Bandingkan plan |
| Data distribusi spatial tertentu | SP-GiST bisa lebih cocok |
| Butuh write/query trade-off berbeda | Uji di staging |

Jangan langsung mengganti semua GiST dengan SP-GiST tanpa benchmark.

---

## 10. BRIN Spatial Index

BRIN menyimpan summary per block range, bukan entry detail per row. Ini bisa sangat kecil dan murah dibanding GiST, tetapi cocok hanya jika data punya locality/clustering yang baik.

PostGIS documentation notes that BRIN index build can be much less intensive than GiST and can consume far less disk space because it stores one bounding box for many table blocks, with `pages_per_range` controlling granularity. ([PostGIS](https://www.postgis.net/docs/manual-3.0/using_postgis_dbmanagement.html?utm_source=chatgpt.com))

Contoh:

```sql id="e1iycf"
CREATE INDEX idx_customer_location_location_brin
    ON customer_location_snapshot
    USING brin (location);
```

Atau dengan option:

```sql id="pcald8"
CREATE INDEX idx_customer_location_location_brin
    ON customer_location_snapshot
    USING brin (location)
    WITH (pages_per_range = 32);
```

Kapan BRIN cocok?

| Cocok jika | Contoh |
|---|---|
| Tabel sangat besar | ratusan juta snapshot |
| Data clustered by location/time | import per region/time |
| Query kasar | filter region besar |
| Index size harus kecil | storage concern |
| Query tidak butuh exact nearest | candidate pruning |

Kapan BRIN kurang cocok?

| Kurang cocok jika | Alasan |
|---|---|
| Data spatial random | summary block terlalu luas |
| Butuh nearest N cepat | GiST/KNN lebih cocok |
| Query radius kecil | false positive banyak |
| Data sering update random | clustering rusak |

---

## 11. GiST vs SP-GiST vs BRIN

| Index | Cocok untuk | Kelebihan | Kekurangan |
|---|---|---|---|
| GiST | general spatial workload | paling umum, PostGIS-friendly, KNN | index size/write cost |
| SP-GiST | point/partitionable spatial data tertentu | bisa cepat untuk data shape tertentu | perlu benchmark, tidak selalu cocok |
| BRIN | huge table dengan locality | sangat kecil, build murah | false positive tinggi jika data random |
| B-tree | metadata | cepat untuk tenant/status/type | bukan spatial predicate |
| Expression GiST | cast/geography expression | tanpa ubah schema | query expression harus match |
| Generated geography + GiST | radius meter frequent | readable, safer | storage/write cost tambahan |

Rule praktis:

```text id="fz4avw"
Mulai dengan:
  B-tree metadata + GiST spatial

Lalu optimasi:
  generated geography untuk radius meter
  SP-GiST jika point workload perlu benchmark
  BRIN jika huge append-only spatial snapshots dengan locality
```

---

## 12. Partial Spatial Index

Jika 90% query hanya `status='ACTIVE'`, partial index adalah default bagus.

```sql id="vsz175"
CREATE INDEX idx_service_area_active_boundary_gist
    ON service_area
    USING gist (boundary)
    WHERE status = 'ACTIVE';
```

Query harus menyertakan predicate yang compatible:

```sql id="sgs3mc"
WHERE status = 'ACTIVE'
  AND ST_Covers(boundary, point)
```

Jika query tidak menyebut `status='ACTIVE'`, planner mungkin tidak bisa memakai partial index.

Buruk:

```sql id="npb7fz"
WHERE ST_Covers(boundary, point)
```

Lebih baik:

```sql id="ukbfnv"
WHERE status = 'ACTIVE'
  AND ST_Covers(boundary, point)
```

---

## 13. Composite Strategy: B-tree + Spatial Index

PostgreSQL tidak otomatis “menggabungkan” semua index secara sempurna untuk setiap kasus. Kadang planner memakai BitmapAnd, kadang memilih satu index lalu filter sisanya, kadang seq scan.

Index set umum:

```sql id="5xkbvx"
CREATE INDEX idx_service_area_tenant_type_status_priority
    ON service_area (tenant_id, area_type, status, priority);

CREATE INDEX idx_service_area_active_boundary_gist
    ON service_area
    USING gist (boundary)
    WHERE status = 'ACTIVE';
```

Query:

```sql id="g9xv2t"
SELECT
    area_id,
    area_code,
    area_name
FROM service_area
WHERE tenant_id = :tenantId
  AND area_type = :areaType
  AND status = 'ACTIVE'
  AND ST_Covers(boundary, :point)
ORDER BY priority ASC
LIMIT 1;
```

Performance issue yang sering muncul:

| Gejala | Solusi |
|---|---|
| Spatial index cari terlalu banyak row | perkuat metadata filter |
| B-tree filter banyak row lalu spatial exact mahal | partial spatial index |
| Sort mahal | index/order atau candidate limit |
| Multi-tenant besar | partitioning/tenant sharding optional |
| Area boundary kompleks | subdivide/materialize |

---

## 14. Boundary Besar: Subdivide untuk Performance

Boundary polygon yang sangat besar/kompleks bisa membuat spatial predicate mahal. Pattern yang umum: simpan geometry asli untuk keputusan/audit, tetapi buat table part hasil `ST_Subdivide` untuk query cepat.

`ST_Subdivide` membagi geometry menjadi set geometry dengan jumlah vertex maksimum tertentu, sehingga object besar bisa dipecah menjadi bagian lebih kecil untuk indexing dan query. ([PostGIS](https://www.postgis.net/docs/manual-3.0/using_postgis_dbmanagement.html?utm_source=chatgpt.com))

```sql id="mxbpfa"
CREATE TABLE service_area_boundary_part (
    part_id bigserial PRIMARY KEY,
    area_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    part_no integer NOT NULL,
    boundary_part geometry(Polygon, 4326) NOT NULL
);

CREATE INDEX idx_service_area_boundary_part_area
    ON service_area_boundary_part (tenant_id, area_id);

CREATE INDEX idx_service_area_boundary_part_gist
    ON service_area_boundary_part
    USING gist (boundary_part);
```

Populate:

```sql id="tefl3h"
INSERT INTO service_area_boundary_part (
    area_id,
    tenant_id,
    part_no,
    boundary_part
)
SELECT
    area_id,
    tenant_id,
    row_number() OVER (PARTITION BY area_id ORDER BY area_id) AS part_no,
    (ST_Dump(ST_Subdivide(boundary, 256))).geom::geometry(Polygon, 4326)
FROM service_area
WHERE status = 'ACTIVE';
```

Query:

```sql id="g9mnml"
SELECT DISTINCT
    a.area_id,
    a.area_code,
    a.area_name
FROM service_area a
JOIN service_area_boundary_part p
  ON p.area_id = a.area_id
WHERE a.tenant_id = :tenantId
  AND a.area_type = :areaType
  AND a.status = 'ACTIVE'
  AND ST_Covers(
      p.boundary_part,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
  )
ORDER BY a.priority, a.area_code
LIMIT 1;
```

---

## 15. EXPLAIN Basics untuk Spatial Query

Gunakan:

```sql id="4ugr4e"
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    area_id,
    area_code,
    area_name
FROM service_area
WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
  AND area_type = 'DELIVERY'
  AND status = 'ACTIVE'
  AND ST_Covers(
      boundary,
      ST_SetSRID(ST_MakePoint(106.8456, -6.2088), 4326)
  )
ORDER BY priority
LIMIT 1;
```

PostgreSQL `EXPLAIN` shows the execution plan; `ANALYZE` executes the statement and adds actual runtime statistics, while `BUFFERS` shows I/O buffer activity. Current PostgreSQL docs note that `ANALYZE` implicitly enables `BUFFERS` unless disabled. ([PostgreSQL](https://www.postgresql.org/docs/current/using-explain.html?utm_source=chatgpt.com))

---

## 16. Plan Reading Cheat Sheet

| Plan node/signal | Arti |
|---|---|
| `Seq Scan` | baca table sequential; bisa buruk jika table besar |
| `Index Scan using ...gist` | spatial index dipakai |
| `Bitmap Index Scan` | index menghasilkan bitmap candidate |
| `Bitmap Heap Scan` | fetch heap rows dari bitmap |
| `Rows Removed by Filter` tinggi | candidate terlalu banyak |
| `Sort` besar | ORDER BY tidak didukung index/candidate besar |
| `Nested Loop` dengan banyak loops | join bisa mahal |
| `shared hit` tinggi | data mostly cache |
| `shared read` tinggi | I/O dari disk/OS cache |
| actual rows jauh dari estimated | statistics/selectivity issue |
| execution time besar di predicate | geometry exact calculation mahal |

Contoh buruk:

```text id="hv6vby"
Seq Scan on service_area
  Filter: ST_Covers(boundary, point)
  Rows Removed by Filter: 500000
```

Kemungkinan penyebab:

1. tidak ada spatial index,
2. predicate tidak index-aware,
3. partial index predicate tidak match,
4. statistics stale,
5. table kecil sehingga seq scan memang murah,
6. function/cast membuat index tidak match.

---

## 17. Kenapa Spatial Index Tidak Dipakai?

| Penyebab | Contoh | Solusi |
|---|---|---|
| Partial predicate tidak match | index `WHERE status='ACTIVE'`, query tanpa status | tambah `status='ACTIVE'` |
| Expression beda | index `(location::geography)`, query `location_geog` atau sebaliknya | samakan expression |
| Cast pada column | index `location`, query `location::geography` | geography index/generated column |
| Table kecil | seq scan lebih murah | bukan masalah |
| Statistik stale | setelah bulk import | `ANALYZE` |
| Predicate tidak index-aware | custom function tanpa bbox | pakai `&&` prefilter |
| SRID transform on column | `ST_Transform(location, ...)` | generated transformed column/index |
| Radius terlalu besar | hampir semua row match | batasi radius/filter metadata |
| Boundary terlalu kompleks | exact predicate mahal | `ST_Subdivide` |

---

## 18. Index-Aware Predicate dan Bounding Box

Banyak predicate umum seperti `ST_Intersects`, `ST_Contains`, dan `ST_DWithin` memiliki spatial index behavior. PostGIS workshop menjelaskan bahwa beberapa fungsi umum secara otomatis menyertakan bounding-box filter yang memakai spatial index, sedangkan fungsi seperti `ST_Relate` tidak otomatis melakukannya; operator `&&` bisa dipakai untuk bounding-box overlap prefilter. ([PostGIS](https://www.postgis.net/docs/manual-3.0/using_postgis_dbmanagement.html?utm_source=chatgpt.com))

Manual prefilter pattern:

```sql id="3x5plt"
WITH input AS (
    SELECT ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326) AS point
)
SELECT
    area_id,
    area_code
FROM service_area a
CROSS JOIN input p
WHERE a.tenant_id = :tenantId
  AND a.status = 'ACTIVE'
  AND a.boundary && p.point
  AND ST_Covers(a.boundary, p.point);
```

Biasanya tidak perlu menambahkan `&&` untuk predicate umum, tetapi berguna untuk:

1. query dengan `ST_Relate`,
2. custom expensive exact calculation,
3. readability two-phase candidate filtering,
4. eksperimen tuning.

---

## 19. Two-Phase Query untuk Spatial Calculation Mahal

Jangan langsung hitung `ST_Intersection` terhadap semua row.

Buruk:

```sql id="iksl54"
WHERE ST_Area(ST_Intersection(a.boundary, z.boundary)::geography) > 1000
```

Lebih baik:

```sql id="jdnhft"
WITH candidates AS (
    SELECT
        a.area_id,
        a.area_code,
        a.boundary AS area_boundary,
        z.zone_id,
        z.zone_code,
        z.boundary AS zone_boundary
    FROM service_area a
    JOIN risk_zone z
      ON z.tenant_id = a.tenant_id
     AND z.status = 'ACTIVE'
     AND ST_Intersects(a.boundary, z.boundary)
    WHERE a.tenant_id = :tenantId
      AND a.status = 'ACTIVE'
      AND a.area_type = 'DELIVERY'
)
SELECT
    area_id,
    area_code,
    zone_id,
    zone_code,
    ST_Area(ST_Intersection(area_boundary, zone_boundary)::geography) AS overlap_m2
FROM candidates
WHERE ST_Area(ST_Intersection(area_boundary, zone_boundary)::geography) > :minOverlapM2;
```

Untuk query sangat sering, precompute overlap relationship.

---

## 20. Generated Transformed Geometry untuk Local Projection

Jika sistem beroperasi dalam area lokal dan sering menghitung meter dengan `geometry`, gunakan projected geometry.

Contoh konseptual:

```sql id="1smgo3"
ALTER TABLE branch_location
ADD COLUMN location_projected geometry(Point, 3857)
GENERATED ALWAYS AS (ST_Transform(location, 3857)) STORED;

CREATE INDEX idx_branch_location_projected_gist
    ON branch_location
    USING gist (location_projected)
    WHERE status = 'ACTIVE';
```

Namun Web Mercator EPSG:3857 tidak selalu cocok untuk akurasi distance/area. Untuk akurasi lokal, pilih projected CRS yang sesuai wilayah operasi.

Pattern:

| Need | Pattern |
|---|---|
| meter radius global sederhana | geography |
| meter radius lokal high performance | projected geometry |
| polygon operation di CRS tertentu | `ST_Transform` ke CRS yang sesuai |
| query sering transform | generated transformed column |
| ad-hoc transform | acceptable untuk query jarang |

---

## 21. Partitioning dan Spatial Performance

Partitioning bisa membantu jika table sangat besar dan query selalu punya partition key.

Contoh partition by time untuk snapshot:

```sql id="eg1ssu"
CREATE TABLE customer_location_snapshot (
    snapshot_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    customer_id text NOT NULL,
    location geometry(Point, 4326) NOT NULL,
    captured_at timestamptz NOT NULL,
    PRIMARY KEY (snapshot_id, captured_at)
) PARTITION BY RANGE (captured_at);
```

Per partition:

```sql id="2qp7l5"
CREATE INDEX idx_customer_location_2026_07_location_gist
    ON customer_location_snapshot_2026_07
    USING gist (location);
```

Partitioning cocok jika:

| Cocok jika | Contoh |
|---|---|
| query selalu range waktu | location snapshot |
| retention drop per bulan | event/location history |
| table sangat besar | ratusan juta rows |
| active/cold split jelas | current vs archive |
| maintenance per partition | vacuum/reindex manageable |

Tidak cocok jika query selalu global tanpa partition filter.

---

## 22. CLUSTER / Data Locality

Spatial query bisa terbantu jika heap rows punya locality, tapi PostgreSQL tidak otomatis menjaga physical order selamanya.

Pattern untuk append/import batch:

1. import staging,
2. sort/order by spatial key atau region,
3. insert ke production,
4. analyze,
5. index.

Untuk huge mostly-read table, bisa pertimbangkan `CLUSTER`, tetapi ini operationally heavy dan tidak otomatis maintained setelah update/insert.

Practical note:

| Workload | Approach |
|---|---|
| static boundary table | cluster/repack optional |
| frequently updated point table | hindari heavy clustering |
| append-only snapshot | partition + BRIN/GiST |
| active operational table | index + vacuum/analyze lebih penting |

---

## 23. Maintenance: VACUUM, ANALYZE, REINDEX

Spatial table yang sering update bisa mengalami bloat, terutama jika geometry besar.

Checklist:

```sql id="vfd2d4"
VACUUM (ANALYZE) branch_location;
```

```sql id="6y1msx"
ANALYZE service_area;
```

Untuk index rebuild production:

```sql id="ri7l7i"
REINDEX INDEX CONCURRENTLY idx_service_area_active_boundary_gist;
```

Gunakan `CONCURRENTLY` untuk mengurangi blocking, tetapi tetap rencanakan maintenance window dan monitor.

---

## 24. Monitoring Index Usage

```sql id="poctcf"
SELECT
    schemaname,
    relname AS table_name,
    indexrelname AS index_name,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE relname IN ('branch_location', 'service_area', 'risk_zone')
ORDER BY idx_scan ASC;
```

Interpretasi:

| Gejala | Arti |
|---|---|
| `idx_scan = 0` lama | index mungkin tidak dipakai |
| `idx_scan` tinggi, query tetap lambat | index kurang selective/candidate banyak |
| banyak spatial index duplikat | write overhead |
| GiST index sangat besar | cek geometry size/update rate |
| index partial tidak dipakai | predicate query tidak match |

---

## 25. Monitoring Table dan Index Size

```sql id="sevxkd"
SELECT
    relname AS relation_name,
    pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
    pg_size_pretty(pg_relation_size(relid)) AS table_size
FROM pg_catalog.pg_statio_user_tables
WHERE relname IN ('branch_location', 'service_area', 'risk_zone')
ORDER BY pg_total_relation_size(relid) DESC;
```

Index size:

```sql id="itx1zx"
SELECT
    indexrelname AS index_name,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE relname = 'service_area'
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## 26. Query-Level Observability

Idealnya aktifkan `pg_stat_statements` di environment yang sesuai.

Query pattern yang perlu dimonitor:

| Query | Metric |
|---|---|
| point-in-area | latency, no-match, ambiguous |
| nearby search | radius, result count, duration |
| spatial join | duration, rows |
| import validation | invalid geometry count |
| intersection area | duration, candidate count |
| KNN nearest | duration, candidate limit |

Log fields:

```text id="cnd4s4"
tenant_id
query_type
longitude
latitude
radius_meters
area_type
result_count
candidate_count
duration_ms
```

---

## 27. Index Migration Strategy

Untuk table besar, jangan asal `CREATE INDEX` blocking.

```sql id="mzxtho"
CREATE INDEX CONCURRENTLY idx_service_area_active_boundary_gist
    ON service_area
    USING gist (boundary)
    WHERE status = 'ACTIVE';
```

Caveat:

| Hal | Catatan |
|---|---|
| concurrent build lebih aman untuk writes | blocking lebih rendah |
| lebih lama | trade-off availability |
| tidak boleh di transaction block biasa | penting untuk Flyway/Liquibase |
| failure bisa meninggalkan invalid index | butuh cleanup |
| test staging volume mirip | wajib |

---

## 28. Query Tuning Pattern: Nearby Search

### Baseline

```sql id="q1m99e"
WITH input_point AS (
    SELECT ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography AS geog
)
SELECT
    b.branch_id,
    b.branch_code,
    ST_Distance(b.location_geog, p.geog) AS distance_meters
FROM branch_location b
CROSS JOIN input_point p
WHERE b.tenant_id = :tenantId
  AND b.status = 'ACTIVE'
  AND ST_DWithin(b.location_geog, p.geog, :radiusMeters)
ORDER BY distance_meters
LIMIT :limit;
```

Index:

```sql id="az8lfd"
CREATE INDEX idx_branch_location_active_geog_gist
    ON branch_location
    USING gist (location_geog)
    WHERE status = 'ACTIVE';

CREATE INDEX idx_branch_location_tenant_status_type
    ON branch_location (tenant_id, status, branch_type);
```

If slow:

| Symptom | Action |
|---|---|
| too many candidates | reduce radius/add branch_type |
| sort expensive | lower limit / two-phase candidate |
| index not used | check expression/generated match |
| high shared read | cache/I/O/index size |
| radius abuse | max radius validation |
| candidate all active rows | data sparse or radius too large |

---

## 29. Query Tuning Pattern: Point-in-Polygon

Baseline:

```sql id="u8ia08"
WITH input_point AS (
    SELECT ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326) AS geom
)
SELECT
    a.area_id,
    a.area_code
FROM service_area a
CROSS JOIN input_point p
WHERE a.tenant_id = :tenantId
  AND a.area_type = :areaType
  AND a.status = 'ACTIVE'
  AND ST_Covers(a.boundary, p.geom)
ORDER BY a.priority, a.area_code
LIMIT 1;
```

If slow:

| Symptom | Action |
|---|---|
| many polygons exact-tested | filter by area_type/status/level |
| huge polygons | subdivide boundary |
| active index huge | partial per type/status if justified |
| multiple matches | deterministic order |
| no index | GiST boundary |
| invalid geometry | validate/import pipeline |

---

## 30. Query Tuning Pattern: Spatial Join

Baseline:

```sql id="cae1dm"
SELECT
    b.branch_id,
    a.area_id
FROM branch_location b
JOIN service_area a
  ON a.tenant_id = b.tenant_id
 AND a.status = 'ACTIVE'
 AND ST_Covers(a.boundary, b.location)
WHERE b.tenant_id = :tenantId
  AND b.status = 'ACTIVE'
  AND a.area_type = 'BRANCH_COVERAGE';
```

If repeated often, do not run on-demand every request. Precompute:

```sql id="p3ap5z"
CREATE TABLE branch_area_assignment (
    branch_id uuid NOT NULL,
    area_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    assigned_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (branch_id, area_id)
);
```

Populate batch:

```sql id="dgwxxf"
INSERT INTO branch_area_assignment (
    branch_id,
    area_id,
    tenant_id
)
SELECT
    b.branch_id,
    a.area_id,
    b.tenant_id
FROM branch_location b
JOIN service_area a
  ON a.tenant_id = b.tenant_id
 AND a.status = 'ACTIVE'
 AND ST_Covers(a.boundary, b.location)
WHERE b.tenant_id = :tenantId
  AND b.status = 'ACTIVE'
  AND a.area_type = 'BRANCH_COVERAGE';
```

---

## 31. Common Anti-Pattern

### 31.1 Only Spatial Index, No Metadata Index

```sql id="2ao1rg"
CREATE INDEX idx_area_boundary_gist ON service_area USING gist(boundary);
```

Tapi query selalu:

```sql id="l0yy3g"
WHERE tenant_id = ?
  AND area_type = ?
  AND status = ?
```

Tambahkan B-tree metadata.

---

### 31.2 Cast Column Without Matching Index

```sql id="r0bba7"
WHERE ST_DWithin(location::geography, p.geog, 5000)
```

Tapi index hanya:

```sql id="7gr9mu"
USING gist(location)
```

Solusi:

```sql id="n4o0aw"
USING gist((location::geography))
```

atau generated `location_geog`.

---

### 31.3 `ST_Distance` untuk Radius Filter

```sql id="oj8cex"
WHERE ST_Distance(location_geog, p.geog) <= 5000
```

Gunakan:

```sql id="lm0lct"
WHERE ST_DWithin(location_geog, p.geog, 5000)
```

---

### 31.4 `ST_Intersection` Tanpa Candidate Filter

```sql id="t6uwuw"
ST_Area(ST_Intersection(a.boundary, z.boundary))
```

Tambahkan `ST_Intersects` dan metadata filter dulu.

---

### 31.5 Boundary Giant Tidak Dipecah

Satu polygon sangat besar bisa membuat predicate exact mahal. Gunakan `ST_Subdivide` untuk query-heavy boundary.

---

## 32. Java/Jersey/MyBatis Performance Guardrail

Di service layer:

```java id="frnv1m"
public record NearbyRequest(
    BigDecimal longitude,
    BigDecimal latitude,
    int radiusMeters,
    int limit,
    String branchType
) {
    public NearbyRequest {
        if (radiusMeters <= 0 || radiusMeters > 50_000) {
            throw new IllegalArgumentException("radiusMeters must be 1..50000");
        }
        if (limit <= 0 || limit > 100) {
            limit = 20;
        }
        if (longitude.compareTo(BigDecimal.valueOf(-180)) < 0
            || longitude.compareTo(BigDecimal.valueOf(180)) > 0) {
            throw new IllegalArgumentException("longitude must be -180..180");
        }
        if (latitude.compareTo(BigDecimal.valueOf(-90)) < 0
            || latitude.compareTo(BigDecimal.valueOf(90)) > 0) {
            throw new IllegalArgumentException("latitude must be -90..90");
        }
    }
}
```

Guardrail penting:

| Guardrail | Alasan |
|---|---|
| radius cap | mencegah full-table candidate |
| limit cap | mencegah result besar |
| type/status whitelist | query predictable |
| no raw spatial predicate from client | governance |
| no raw GeoJSON heavy query tanpa size limit | DoS/performance risk |
| timeout statement | prevent runaway query |

---

## 33. PostgreSQL Statement Timeout untuk Spatial Query

Untuk endpoint user-facing, pertimbangkan statement timeout di session/transaction.

```sql id="spiwpc"
SET LOCAL statement_timeout = '3s';
```

Di MyBatis transaction:

```xml id="7jzpyp"
<select id="findNearbyBranches" resultMap="NearbyBranchResultMap" timeout="3">
    ...
</select>
```

MyBatis mapper statement punya `timeout` attribute untuk membatasi waktu statement menunggu database response. Gunakan sesuai standar tim.

---

## 34. Testing Performance

### 34.1 Dataset Test

Minimal siapkan:

| Dataset | Ukuran |
|---|---:|
| branch point | 100k+ rows |
| service area | ribuan polygon |
| large boundary | polygon high-vertex |
| risk zone | overlap cases |
| customer snapshots | jutaan rows jika relevant |

### 34.2 Test Query

| Query | Expected |
|---|---|
| nearby 5 km | uses geography GiST |
| nearby 50 km | still acceptable |
| nearest KNN | uses geometry GiST |
| point-in-area | uses boundary GiST |
| spatial join branch-area | acceptable or precompute |
| intersection area | candidate filtered |
| import validation | bounded time |

### 34.3 Regression Criteria

| Metric | Example threshold |
|---|---|
| p95 nearby query | < 100 ms internal / depends |
| p95 point-in-area | < 100 ms |
| spatial join batch | acceptable batch SLA |
| index size | below storage target |
| no seq scan on large table | except planned analytics |
| no unbounded radius | API rejects |

---

## 35. Production Checklist

| Checklist | Status |
|---|---|
| B-tree metadata index exists | Wajib |
| GiST index for geometry/geography exists | Wajib |
| Partial spatial index for active data | Disarankan |
| Generated geography for frequent radius meter query | Disarankan |
| Expression index matches query if used | Wajib |
| KNN query has geometry GiST index | Wajib |
| KNN final distance in meter if needed | Wajib |
| Radius and limit capped in API | Wajib |
| Large boundary subdivided if slow | Disarankan |
| Spatial join precomputed if frequent | Disarankan |
| EXPLAIN ANALYZE BUFFERS checked | Wajib |
| ANALYZE after import/backfill | Wajib |
| Index usage monitored | Wajib |
| Index size monitored | Wajib |
| CREATE INDEX CONCURRENTLY for large prod table | Wajib |
| Statement timeout for user-facing query | Disarankan |
| Native PostgreSQL/PostGIS perf test | Wajib |

---

## 36. Practical Decision Table

| Problem | Recommended action |
|---|---|
| Nearby radius slow | generated geography + GiST + radius cap |
| KNN nearest slow | geometry GiST + `ORDER BY geom <-> point` |
| KNN distance not meter | candidate KNN + final geography distance |
| Point-in-polygon slow | GiST boundary + metadata filter |
| Huge polygon slow | `ST_Subdivide` boundary parts |
| Spatial join slow | precompute assignment |
| Index not used | match expression/predicate, ANALYZE |
| Table huge append-only | consider BRIN/partitioning |
| Point workload GiST not ideal | benchmark SP-GiST |
| GIN-style thinking on geometry | use GiST/SP-GiST/BRIN, not GIN |
| Unused index | review/drop after observation |
| Write-heavy table slow | reduce duplicate/unused indexes |

---

## 37. Ringkasan Praktis

```text id="ebdokk"
Spatial Indexing & Performance Rule
│
├── Start simple
│   ├── B-tree tenant/status/type
│   └── GiST geometry/geography
│
├── Match index to query
│   ├── geometry index for geometry predicate
│   ├── geography index for meter radius
│   ├── expression index for cast expression
│   └── partial predicate must match WHERE
│
├── Tune nearest query
│   ├── ST_DWithin for radius
│   ├── ST_Distance for display/ranking
│   ├── <-> for KNN candidates
│   └── final meter distance if needed
│
├── Handle large geometry
│   ├── ST_Subdivide
│   ├── simplified display geometry
│   ├── materialized relationship
│   └── precomputed assignments
│
├── Read EXPLAIN
│   ├── scan type
│   ├── rows estimated vs actual
│   ├── buffers
│   ├── sort
│   └── loops
│
└── Operate continuously
    ├── ANALYZE after import
    ├── monitor index usage
    ├── monitor index size
    ├── reindex when needed
    └── cap API query cost
```

---

# Status

**Seri 17/19 selesai.**

Berikutnya: **Seri 18/19 - Production Hardening: migration, partitioning, observability, security, retention, import pipeline, data quality, operational runbook, dan governance untuk PostgreSQL geospatial.**

---

**Sources:**

- [Documentation: 18: 11.2. Index Types](https://www.postgresql.org/docs/current/indexes-types.html?utm_source=chatgpt.com)
- [PostGIS](https://postgis.net/?utm_source=chatgpt.com)

## Response:
7/15/2026, 9:09:46 PM

# Seri 18/19 - Production Hardening: Migration, Partitioning, Observability, Security, Retention, Import Pipeline, Data Quality, Operational Runbook

## 1. Tujuan Seri Ini

Seri ini membahas **hardening production untuk PostgreSQL Geospatial Database**.

Di blok geospatial sebelumnya kita sudah membahas:

1. PostGIS foundation.
2. Spatial data modeling.
3. Spatial query pattern.
4. Distance & nearest-neighbor.
5. Spatial indexing & performance.

Sekarang fokusnya adalah:

```text id="9sm3c5"
Bagaimana membuat sistem geospatial aman, stabil, observable,
mudah dimigrasikan, dan siap dioperasikan di production?
```

PostGIS adalah extension PostgreSQL untuk menyimpan, mengindeks, dan melakukan query objek GIS; PostGIS juga menyediakan dukungan GiST-based R-tree spatial indexes serta fungsi analisis/pemrosesan GIS. Untuk production, kemampuan ini harus dibungkus dengan governance, migration, validation, observability, dan runbook yang disiplin. ([PostGIS](https://postgis.net/docs/manual-3.5/postgis-en.html?utm_source=chatgpt.com))

---

## 2. Mental Model Production Hardening

```text id="dx0qne"
Geospatial Production Hardening
│
├── Migration Governance
│   ├── CREATE EXTENSION postgis
│   ├── spatial table DDL
│   ├── indexes concurrently
│   ├── generated geography
│   ├── constraints
│   └── rollback/roll-forward
│
├── Import Pipeline
│   ├── staging
│   ├── parse GeoJSON/WKT/CSV
│   ├── validate SRID/type/validity
│   ├── repair/review
│   ├── promote
│   └── audit/source tracking
│
├── Data Quality
│   ├── ST_IsValid
│   ├── ST_IsValidReason
│   ├── ST_MakeValid
│   ├── coordinate bounds
│   ├── overlap/duplicate detection
│   └── ambiguity detection
│
├── Performance & Scale
│   ├── GiST/SP-GiST/BRIN
│   ├── partial indexes
│   ├── partitioning
│   ├── ST_Subdivide
│   ├── EXPLAIN ANALYZE BUFFERS
│   └── pg_stat_statements
│
├── Security
│   ├── tenant_id column
│   ├── RLS optional
│   ├── input size limits
│   ├── no raw spatial SQL
│   ├── PII/location sensitivity
│   └── audit access
│
└── Operations
    ├── metrics
    ├── alerts
    ├── runbook
    ├── cleanup/retention
    ├── backup/restore drill
    └── incident response
```

---

## 3. Migration Governance

### 3.1 Enable PostGIS via Migration

Jangan enable manual langsung di production.

```sql id="m8t2b6"
-- V001__enable_postgis.sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

Cek versi:

```sql id="sj02oz"
SELECT postgis_full_version();
```

Checklist:

| Checklist | Kenapa |
|---|---|
| Extension ada di dev/staging/prod | Environment parity |
| Migration idempotent | Aman rerun |
| Version dicatat | Debug compatibility |
| Tidak enable manual | Auditability |
| Permission jelas | DBA/platform governance |

---

## 4. Spatial Table Migration Pattern

Contoh migration untuk `branch_location`.

```sql id="r7ssxc"
CREATE TABLE branch_location (
    branch_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    branch_code text NOT NULL,
    branch_name text NOT NULL,
    branch_type text NOT NULL,
    status text NOT NULL,

    location geometry(Point, 4326) NOT NULL,

    location_geog geography(Point, 4326)
        GENERATED ALWAYS AS (location::geography) STORED,

    address_text text NULL,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

    version bigint NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by text NULL,
    updated_by text NULL,

    CONSTRAINT uq_branch_location_code
        UNIQUE (tenant_id, branch_code),

    CONSTRAINT ck_branch_location_type
        CHECK (branch_type IN ('MAIN', 'REGULAR', 'AGENT', 'ATM', 'PARTNER')),

    CONSTRAINT ck_branch_location_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'CLOSED')),

    CONSTRAINT ck_branch_location_metadata_object
        CHECK (jsonb_typeof(metadata) = 'object')
);
```

Indexes:

```sql id="p2n6dt"
CREATE INDEX idx_branch_location_tenant_type_status
    ON branch_location (tenant_id, branch_type, status);

CREATE INDEX idx_branch_location_active_location_gist
    ON branch_location
    USING gist (location)
    WHERE status = 'ACTIVE';

CREATE INDEX idx_branch_location_active_geog_gist
    ON branch_location
    USING gist (location_geog)
    WHERE status = 'ACTIVE';
```

Generated geography membantu radius query dalam meter tanpa melakukan cast `location::geography` berulang di query.

---

## 5. Index Migration untuk Table Besar

Untuk table besar, gunakan concurrent index build.

```sql id="mmh90y"
CREATE INDEX CONCURRENTLY idx_service_area_active_boundary_gist
    ON service_area
    USING gist (boundary)
    WHERE status = 'ACTIVE';
```

PostgreSQL documentation mencatat bahwa concurrent index build untuk partitioned table tidak langsung didukung di parent; pendekatan yang direkomendasikan adalah membangun index secara concurrent di masing-masing partition, lalu membuat partitioned index di parent sebagai metadata-only operation. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createindex.html?utm_source=chatgpt.com))

Practical caveat:

| Hal | Catatan |
|---|---|
| `CREATE INDEX CONCURRENTLY` | Mengurangi blocking write |
| Tidak boleh di transaction block biasa | Penting untuk Flyway/Liquibase |
| Lebih lama | Trade-off availability |
| Bisa gagal dan meninggalkan invalid index | Perlu cleanup |
| Test di staging dengan data besar | Wajib |

---

## 6. Migration Strategy: Expand → Backfill → Validate → Cutover

Untuk perubahan spatial besar, hindari big-bang.

```text id="npxl66"
1. Expand
   Tambah kolom baru / table baru / index baru

2. Backfill
   Isi data dalam batch

3. Validate
   Cek count, SRID, type, validity, sample business case

4. Cutover
   Ubah service/query ke struktur baru

5. Cleanup
   Drop kolom/index lama setelah safe window
```

Contoh tambah generated geography:

```sql id="pds4wb"
ALTER TABLE branch_location
ADD COLUMN location_geog geography(Point, 4326)
GENERATED ALWAYS AS (location::geography) STORED;
```

Lalu index:

```sql id="o50u1b"
CREATE INDEX CONCURRENTLY idx_branch_location_active_geog_gist
    ON branch_location
    USING gist (location_geog)
    WHERE status = 'ACTIVE';
```

---

## 7. Partitioning Strategy

Partitioning cocok untuk table spatial yang sangat besar dan query hampir selalu punya partition filter.

PostgreSQL declarative partitioning mensyaratkan partition punya set kolom yang sama dengan parent table. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html?utm_source=chatgpt.com))

### 7.1 Partition by Time untuk Location Snapshot

```sql id="hnqmdo"
CREATE TABLE customer_location_snapshot (
    snapshot_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    customer_id text NOT NULL,

    source text NOT NULL,
    location geometry(Point, 4326) NOT NULL,

    accuracy_meters numeric(12,2) NULL,
    captured_at timestamptz NOT NULL,
    received_at timestamptz NOT NULL DEFAULT now(),

    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

    PRIMARY KEY (snapshot_id, captured_at)
) PARTITION BY RANGE (captured_at);
```

Partition monthly:

```sql id="n3h4zq"
CREATE TABLE customer_location_snapshot_2026_07
PARTITION OF customer_location_snapshot
FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
```

Indexes per partition:

```sql id="jf8iin"
CREATE INDEX idx_customer_location_2026_07_tenant_customer_time
    ON customer_location_snapshot_2026_07
    (tenant_id, customer_id, captured_at DESC);

CREATE INDEX idx_customer_location_2026_07_location_gist
    ON customer_location_snapshot_2026_07
    USING gist (location);
```

---

## 8. Partitioning Decision Table

| Table | Partition? | Reason |
|---|---:|---|
| `branch_location` | Biasanya tidak | Master data relatif kecil/sedang |
| `service_area` | Biasanya tidak | Boundary relatif kecil, lebih cocok index/subdivide |
| `jurisdiction_area` | Biasanya tidak | Master data |
| `risk_zone` | Mungkin | Jika sangat banyak dan effective time penting |
| `customer_location_snapshot` | Ya, jika besar | Time-series spatial snapshot |
| `device_location_event` | Ya | Append-only event |
| `spatial_import_staging` | Mungkin | Berdasarkan batch/time untuk cleanup |
| `spatial_audit` | Mungkin | Audit besar, retention by time |

Rule:

```text id="ywv3ln"
Partition jika query dan retention punya partition key jelas.
Jangan partition hanya karena "tabel akan besar".
```

---

## 9. Retention Strategy

Spatial data punya lifecycle berbeda.

| Data | Retention pattern |
|---|---|
| Branch/current location | Keep current + audit history |
| Service area boundary | Archive/version, jangan hard delete |
| Jurisdiction boundary | Versioned historical retention |
| Risk zone | Effective dating + archive |
| Customer location snapshot | Retain sesuai privacy/compliance |
| Device events | Time-based retention |
| Import staging | Short retention setelah promoted |
| Invalid staging | Retain cukup untuk debugging lalu purge |
| Audit | Retain sesuai regulatory policy |

### Staging Cleanup

```sql id="h9nqdd"
DELETE FROM spatial_import_staging
WHERE validation_status IN ('PROMOTED', 'INVALID')
  AND created_at < now() - interval '30 days';
```

### Snapshot Retention dengan Partition Drop

```sql id="74y5i3"
DROP TABLE customer_location_snapshot_2025_01;
```

Partition drop jauh lebih cepat daripada delete massal, jika retention memang by partition.

---

## 10. Import Pipeline Production

Jangan insert boundary external langsung ke production.

```text id="2istfy"
Upload file/API
  ↓
spatial_import_batch
  ↓
spatial_import_staging
  ↓
parse geometry
  ↓
validate SRID/type/validity/bounds
  ↓
repair optional
  ↓
human/domain review optional
  ↓
promote to production
  ↓
audit + outbox
```

### Batch Table

```sql id="jqrbaz"
CREATE TABLE spatial_import_batch (
    import_batch_id text PRIMARY KEY,
    tenant_id uuid NOT NULL,

    target_entity text NOT NULL,
    source_system text NOT NULL,
    source_reference text NULL,

    status text NOT NULL DEFAULT 'UPLOADED',

    total_items integer NOT NULL DEFAULT 0,
    valid_items integer NOT NULL DEFAULT 0,
    invalid_items integer NOT NULL DEFAULT 0,
    promoted_items integer NOT NULL DEFAULT 0,

    created_at timestamptz NOT NULL DEFAULT now(),
    validated_at timestamptz NULL,
    promoted_at timestamptz NULL,

    created_by text NOT NULL,

    CONSTRAINT ck_spatial_import_batch_status
        CHECK (status IN ('UPLOADED', 'PARSING', 'VALIDATED', 'FAILED', 'PROMOTED', 'CANCELLED')),

    CONSTRAINT ck_spatial_import_batch_target
        CHECK (target_entity IN ('SERVICE_AREA', 'JURISDICTION_AREA', 'RISK_ZONE', 'ROUTE_SEGMENT'))
);
```

### Staging Table

```sql id="0glk65"
CREATE TABLE spatial_import_staging (
    staging_id uuid PRIMARY KEY,
    import_batch_id text NOT NULL REFERENCES spatial_import_batch(import_batch_id),
    tenant_id uuid NOT NULL,

    external_code text NULL,
    external_name text NULL,

    raw_geojson jsonb NULL,
    raw_wkt text NULL,

    parsed_geometry geometry NULL,

    validation_status text NOT NULL DEFAULT 'PENDING',
    validation_errors jsonb NOT NULL DEFAULT '[]'::jsonb,

    created_at timestamptz NOT NULL DEFAULT now(),
    validated_at timestamptz NULL,

    CONSTRAINT ck_spatial_import_validation_status
        CHECK (validation_status IN ('PENDING', 'VALID', 'INVALID', 'PROMOTED')),

    CONSTRAINT ck_spatial_import_errors_array
        CHECK (jsonb_typeof(validation_errors) = 'array')
);
```

---

## 11. Data Quality Validation

PostGIS menyediakan fungsi validasi geometry seperti `ST_IsValid`, `ST_IsValidReason`, dan `ST_MakeValid`; `ST_MakeValid` berusaha membuat representasi geometry yang valid tanpa kehilangan vertex input. ([PostGIS](https://postgis.net/docs/reference.html?utm_source=chatgpt.com))

### 11.1 Null Geometry

```sql id="746b42"
UPDATE spatial_import_staging
SET
    validation_status = 'INVALID',
    validation_errors = validation_errors || jsonb_build_array('GEOMETRY_IS_NULL'),
    validated_at = now()
WHERE import_batch_id = :batchId
  AND parsed_geometry IS NULL;
```

### 11.2 Invalid Geometry

```sql id="q73dx1"
UPDATE spatial_import_staging
SET
    validation_status = 'INVALID',
    validation_errors = validation_errors || jsonb_build_array(
        jsonb_build_object(
            'code', 'INVALID_GEOMETRY',
            'reason', ST_IsValidReason(parsed_geometry)
        )
    ),
    validated_at = now()
WHERE import_batch_id = :batchId
  AND parsed_geometry IS NOT NULL
  AND NOT ST_IsValid(parsed_geometry);
```

### 11.3 SRID Check

```sql id="fc0u1p"
UPDATE spatial_import_staging
SET
    validation_status = 'INVALID',
    validation_errors = validation_errors || jsonb_build_array('INVALID_SRID'),
    validated_at = now()
WHERE import_batch_id = :batchId
  AND parsed_geometry IS NOT NULL
  AND ST_SRID(parsed_geometry) <> 4326;
```

### 11.4 Coordinate Bounds

```sql id="uh01g0"
UPDATE spatial_import_staging
SET
    validation_status = 'INVALID',
    validation_errors = validation_errors || jsonb_build_array('OUT_OF_EXPECTED_BOUNDS'),
    validated_at = now()
WHERE import_batch_id = :batchId
  AND parsed_geometry IS NOT NULL
  AND NOT ST_Intersects(
      parsed_geometry,
      ST_MakeEnvelope(94.0, -12.0, 142.0, 7.0, 4326)
  );
```

---

## 12. Repair Policy

Repair jangan otomatis untuk semua data production.

```sql id="vfmh6v"
UPDATE spatial_import_staging
SET parsed_geometry = ST_MakeValid(parsed_geometry)
WHERE import_batch_id = :batchId
  AND parsed_geometry IS NOT NULL
  AND NOT ST_IsValid(parsed_geometry);
```

Untuk polygonal target:

```sql id="z3jzc4"
UPDATE spatial_import_staging
SET parsed_geometry = ST_Multi(
    ST_CollectionExtract(ST_MakeValid(parsed_geometry), 3)
)
WHERE import_batch_id = :batchId
  AND parsed_geometry IS NOT NULL
  AND NOT ST_IsValid(parsed_geometry);
```

Policy:

| Data | Repair policy |
|---|---|
| Display/custom map area | Auto-repair mungkin boleh |
| Service coverage | Repair + review |
| Jurisdiction/regulatory boundary | Manual/domain review wajib |
| Risk zone critical | Review wajib |
| Route segment | Repair tergantung source |
| Customer point | Usually no repair; validate lon/lat |

---

## 13. Overlap dan Ambiguity Detection

### 13.1 Service Area Overlap

```sql id="0qejpo"
SELECT
    a.area_code AS area_a,
    b.area_code AS area_b
FROM service_area a
JOIN service_area b
  ON a.tenant_id = b.tenant_id
 AND a.area_id < b.area_id
 AND a.area_type = b.area_type
 AND ST_Overlaps(a.boundary, b.boundary)
WHERE a.tenant_id = :tenantId
  AND a.status = 'ACTIVE'
  AND b.status = 'ACTIVE';
```

### 13.2 Multiple Match Test Points

```sql id="ix2ika"
WITH test_points AS (
    SELECT
        test_id,
        ST_SetSRID(ST_MakePoint(longitude, latitude), 4326) AS point
    FROM spatial_test_point
    WHERE tenant_id = :tenantId
),
matches AS (
    SELECT
        p.test_id,
        count(*) AS match_count
    FROM test_points p
    JOIN service_area a
      ON a.tenant_id = :tenantId
     AND a.status = 'ACTIVE'
     AND ST_Covers(a.boundary, p.point)
    GROUP BY p.test_id
)
SELECT *
FROM matches
WHERE match_count > 1;
```

Overlap tidak selalu salah, tapi harus disengaja dan punya tie-breaker.

---

## 14. Promote Valid Data ke Production

```sql id="x0k6km"
INSERT INTO service_area (
    area_id,
    tenant_id,
    area_code,
    area_name,
    area_type,
    status,
    boundary,
    metadata,
    version,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    tenant_id,
    external_code,
    external_name,
    :areaType,
    'DRAFT',
    ST_Multi(parsed_geometry)::geometry(MultiPolygon, 4326),
    jsonb_build_object(
        'importBatchId', import_batch_id,
        'source', 'spatial_import'
    ),
    0,
    now(),
    now()
FROM spatial_import_staging
WHERE import_batch_id = :batchId
  AND validation_status = 'VALID';
```

Mark promoted:

```sql id="g5jzjy"
UPDATE spatial_import_staging
SET validation_status = 'PROMOTED'
WHERE import_batch_id = :batchId
  AND validation_status = 'VALID';
```

Update batch summary:

```sql id="wx1r9v"
UPDATE spatial_import_batch
SET
    status = 'PROMOTED',
    promoted_items = (
        SELECT count(*)
        FROM spatial_import_staging
        WHERE import_batch_id = :batchId
          AND validation_status = 'PROMOTED'
    ),
    promoted_at = now()
WHERE import_batch_id = :batchId;
```

---

## 15. Audit dan Versioning

Spatial boundary sebaiknya versioned.

```sql id="j1c9qh"
CREATE TABLE spatial_entity_audit (
    audit_id bigserial PRIMARY KEY,

    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    tenant_id uuid NOT NULL,

    old_status text NULL,
    new_status text NULL,

    old_geometry geometry NULL,
    new_geometry geometry NULL,

    old_metadata jsonb NULL,
    new_metadata jsonb NULL,

    old_version bigint NULL,
    new_version bigint NULL,

    action text NOT NULL,
    actor text NOT NULL,
    reason text NULL,
    correlation_id text NULL,

    changed_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_spatial_entity_audit_action
        CHECK (action IN (
            'CREATE',
            'UPDATE_GEOMETRY',
            'UPDATE_METADATA',
            'ACTIVATE',
            'ARCHIVE',
            'IMPORT',
            'REPAIR'
        ))
);
```

Untuk geometry sangat besar, pertimbangkan audit ringan:

| Audit style | Isi |
|---|---|
| full geometry | old/new geometry |
| geometry hash | `md5(ST_AsEWKB(geom)::text)` |
| source reference | file/import batch |
| version table | boundary per version |
| redacted/minimal | metadata tanpa geometry penuh |

---

## 16. Security Hardening

### 16.1 Tenant Boundary

Selalu kolom biasa:

```sql id="9e9giu"
tenant_id uuid NOT NULL
```

Jangan simpan tenant di JSON metadata.

Setiap query:

```sql id="76r0nl"
WHERE tenant_id = :tenantId
```

### 16.2 Optional Row-Level Security

```sql id="1z3j18"
ALTER TABLE service_area ENABLE ROW LEVEL SECURITY;

CREATE POLICY service_area_tenant_policy
ON service_area
USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

Aplikasi harus set:

```sql id="caq83g"
SET LOCAL app.tenant_id = '...';
```

Gunakan RLS hanya jika tim siap mengelola session settings, pooling, dan testing security. Jangan jadikan RLS sebagai pengganti validasi service layer.

---

## 17. Location Data Sensitivity

Data lokasi bisa sensitif.

| Data | Risiko |
|---|---|
| Customer location | Privacy/PII |
| Device location | Tracking risk |
| Branch location | Public-ish tapi tetap operational |
| Risk zones | Security/business sensitive |
| Jurisdiction | Public/official, tergantung source |
| Import source files | Bisa mengandung metadata sensitif |

Guardrail:

| Guardrail | Praktik |
|---|---|
| Access control | Role/tenant-based |
| Data minimization | Simpan yang perlu |
| Retention | Jangan simpan location snapshot selamanya |
| Masking | Untuk response publik |
| Audit access | Query sensitif dicatat |
| Encryption | Disk/TLS/secrets policy |
| Export control | Batasi bulk export |

---

## 18. API Security Guardrail

Jangan expose raw spatial query.

Buruk:

```http id="wlpelo"
POST /spatial/query
{
  "sql": "ST_Intersects(...)"
}
```

Lebih aman:

```http id="7z8j9i"
GET /branches/nearby?longitude=...&latitude=...&radiusMeters=...
GET /service-areas/match?longitude=...&latitude=...
POST /spatial-imports/service-areas
```

Validasi API:

| Input | Validasi |
|---|---|
| longitude | `-180..180` |
| latitude | `-90..90` |
| radiusMeters | max cap |
| limit | max cap |
| GeoJSON | size/type/depth limit |
| areaType | enum whitelist |
| status | enum whitelist |
| import batch | ownership |

---

## 19. Observability

PostgreSQL `pg_stat_statements` menyediakan tracking statistik planning dan execution untuk semua SQL statement yang dieksekusi server, sehingga berguna untuk mengidentifikasi query spatial mahal. ([PostgreSQL](https://www.postgresql.org/docs/current/pgstatstatements.html?utm_source=chatgpt.com))

### 19.1 Metrics

| Metric | Meaning |
|---|---|
| `spatial.query.duration` | Latency query spatial |
| `spatial.nearby.count` | Nearby API calls |
| `spatial.nearby.no_result.count` | No nearby result |
| `spatial.match.ambiguous.count` | Multiple area match |
| `spatial.import.batch.count` | Import batches |
| `spatial.import.invalid.count` | Invalid geometry |
| `spatial.import.promoted.count` | Promoted records |
| `spatial.geometry.invalid.production.count` | Invalid active geometry |
| `spatial.query.timeout.count` | Query timeout |
| `spatial.out_of_bounds.count` | Bad coordinates |
| `spatial.large_radius.count` | Expensive query risk |

### 19.2 Log Fields

```text id="z3rw4l"
tenant_id
operation
longitude
latitude
radius_meters
area_type
result_count
match_count
ambiguous
import_batch_id
duration_ms
correlation_id
actor
```

### 19.3 Slow Query Review

Gunakan:

```sql id="d52g6v"
EXPLAIN (ANALYZE, BUFFERS)
SELECT ...
```

`EXPLAIN ANALYZE` menjalankan statement dan menambahkan actual runtime statistics; opsi `BUFFERS` memperlihatkan buffer usage untuk melihat kerja I/O query. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-explain.html?utm_source=chatgpt.com))

---

## 20. Operational Health Queries

### 20.1 Invalid Active Geometry

```sql id="54lxbx"
SELECT
    area_id,
    area_code,
    ST_IsValidReason(boundary) AS invalid_reason
FROM service_area
WHERE status = 'ACTIVE'
  AND NOT ST_IsValid(boundary);
```

### 20.2 Area Tanpa Index? Manual Review

```sql id="6g4063"
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('service_area', 'branch_location', 'risk_zone');
```

### 20.3 Index Usage

```sql id="01ehec"
SELECT
    relname AS table_name,
    indexrelname AS index_name,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE relname IN ('service_area', 'branch_location', 'risk_zone')
ORDER BY idx_scan ASC;
```

### 20.4 Table/Index Size

```sql id="uyy6ah"
SELECT
    relname AS table_name,
    pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
    pg_size_pretty(pg_relation_size(relid)) AS table_size
FROM pg_catalog.pg_statio_user_tables
WHERE relname IN ('service_area', 'branch_location', 'risk_zone')
ORDER BY pg_total_relation_size(relid) DESC;
```

---

## 21. Statement Timeout

Untuk endpoint user-facing:

```sql id="ko0qsy"
SET LOCAL statement_timeout = '3s';
```

MyBatis statement timeout:

```xml id="9163hl"
<select id="findNearbyBranches"
        resultMap="NearbyBranchResultMap"
        timeout="3">
    ...
</select>
```

Gunakan timeout sesuai SLA. Query spatial admin/import boleh punya timeout lebih panjang daripada public API.

---

## 22. Backup dan Restore Consideration

Spatial data sering besar dan penting untuk keputusan operasional.

Checklist:

| Checklist | Kenapa |
|---|---|
| Backup include extension metadata | Restore harus bisa PostGIS |
| Restore drill | Pastikan PostGIS tersedia |
| Import source retained | Bisa rebuild boundary |
| Audit/version retained | Trace changes |
| Staging retention cukup | Debug import |
| Restore performance tested | Geometry/index rebuild bisa lama |
| Index rebuild plan | GiST index besar butuh waktu |
| Disaster recovery docs | Operasional jelas |

Setelah restore/import besar:

```sql id="8fpqt7"
ANALYZE service_area;
ANALYZE branch_location;
```

---

## 23. Deployment Checklist

Sebelum deploy geospatial feature:

| Checklist | Status |
|---|---|
| PostGIS extension migration ada | Wajib |
| DDL table spatial reviewed | Wajib |
| SRID/type eksplisit | Wajib |
| GiST/geography index ada | Wajib |
| Metadata B-tree index ada | Wajib |
| Query tested with EXPLAIN | Wajib |
| Radius/limit cap di API | Wajib |
| Geometry import staging ada | Wajib untuk boundary |
| Data validation queries ada | Wajib |
| Invalid geometry handling jelas | Wajib |
| Observability metrics/logs ada | Wajib |
| Slow query timeout ada | Disarankan |
| Rollback/roll-forward plan ada | Wajib |
| PostGIS integration test jalan | Wajib |
| Security/privacy review untuk location data | Wajib |

---

## 24. Operational Runbook: Nearby Query Lambat

Symptoms:

```text id="fjmkg9"
GET /branches/nearby latency naik
DB CPU naik
query timeout meningkat
```

Check:

```sql id="smygm0"
EXPLAIN (ANALYZE, BUFFERS)
WITH input_point AS (...)
SELECT ...
```

Review:

| Check | Pertanyaan |
|---|---|
| Radius | Apakah client kirim radius besar? |
| Index | Apakah GiST geography index dipakai? |
| Predicate | Apakah query pakai `ST_DWithin`? |
| Metadata | Apakah tenant/status/type filter ada? |
| Stats | Perlu `ANALYZE`? |
| Data growth | Apakah active branches naik drastis? |
| Plan | Seq scan atau index scan? |

Mitigation:

1. cap radius lebih ketat,
2. tambah branch type filter,
3. pastikan generated geography index,
4. `ANALYZE`,
5. review index predicate,
6. fallback KNN candidate strategy,
7. cache frequently requested area jika cocok.

---

## 25. Operational Runbook: Point-in-Area Salah

Symptoms:

```text id="n5mzu6"
Customer harusnya masuk area, tapi API return no match.
Atau titik boundary return hasil tidak sesuai.
```

Check:

| Check | Query/Action |
|---|---|
| Lat/lon order | Pastikan `ST_MakePoint(lon, lat)` |
| SRID | `ST_SRID(boundary)` |
| Valid geometry | `ST_IsValid(boundary)` |
| Predicate | `ST_Contains` vs `ST_Covers` |
| Boundary overlap | multiple match detection |
| Effective status | active/effective window |
| Tenant | tenant_id benar |
| Import source | batch/source version benar |

Diagnostic SQL:

```sql id="q2e2m0"
WITH p AS (
    SELECT ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326) AS point
)
SELECT
    area_id,
    area_code,
    status,
    ST_Covers(boundary, p.point) AS covers,
    ST_Contains(boundary, p.point) AS contains,
    ST_Intersects(boundary, p.point) AS intersects,
    ST_Distance(boundary::geography, p.point::geography) AS distance_to_boundary_m
FROM service_area
CROSS JOIN p
WHERE tenant_id = :tenantId
  AND area_type = :areaType
ORDER BY distance_to_boundary_m
LIMIT 10;
```

---

## 26. Operational Runbook: Import Boundary Gagal

Symptoms:

```text id="gberrv"
Import batch INVALID tinggi.
Geometry parse error.
Boundary tidak bisa promoted.
```

Check:

| Check | Query/Action |
|---|---|
| Raw format | GeoJSON/WKT valid? |
| CRS | Source benar 4326? |
| Geometry type | Polygon/MultiPolygon? |
| Validity | `ST_IsValidReason` |
| Bounds | coordinate masuk area expected? |
| Size | terlalu banyak vertex? |
| Repair | `ST_MakeValid` hasil apa? |

Diagnostic:

```sql id="jpqtp4"
SELECT
    staging_id,
    external_code,
    validation_status,
    validation_errors
FROM spatial_import_staging
WHERE import_batch_id = :batchId
ORDER BY created_at;
```

Repair candidate:

```sql id="fek2rw"
SELECT
    staging_id,
    external_code,
    GeometryType(parsed_geometry) AS before_type,
    GeometryType(ST_MakeValid(parsed_geometry)) AS after_type,
    ST_IsValidReason(parsed_geometry) AS reason
FROM spatial_import_staging
WHERE import_batch_id = :batchId
  AND parsed_geometry IS NOT NULL
  AND NOT ST_IsValid(parsed_geometry);
```

---

## 27. Security Runbook: Suspected Cross-Tenant Spatial Leak

Check service logs:

```text id="f16xkv"
tenant_id in request
tenant_id in SQL bind
result tenant_id
actor
correlation_id
```

Database check:

```sql id="8k0xdu"
SELECT
    tenant_id,
    count(*)
FROM service_area
GROUP BY tenant_id;
```

Code review checklist:

| Check | Status |
|---|---|
| Every spatial query filters tenant_id | Wajib |
| Every join includes tenant equality | Wajib |
| API path tenant matches auth tenant | Wajib |
| Metadata JSON not used as tenant source | Wajib |
| RLS/session tenant if used | Verified |
| Tests include wrong-tenant no match | Wajib |

---

## 28. Testing Strategy

### 28.1 Integration Test with PostGIS

Gunakan PostgreSQL + PostGIS asli.

Test cases:

| Test | Expected |
|---|---|
| PostGIS extension available | `postgis_full_version()` works |
| insert point valid | success |
| insert invalid geometry | rejected/staged invalid |
| point-in-area boundary case | contract correct |
| nearby radius meter | correct |
| lat/lon swapped | test catches |
| import valid GeoJSON | staged valid/promoted |
| import invalid polygon | staged invalid |
| migration index exists | checked |
| RLS/wrong tenant | no leak |
| statement timeout | long query fails gracefully |

### 28.2 Data Quality Regression Test

Simpan fixture:

```text id="6tc5cp"
fixtures/spatial/
  service-area-valid.geojson
  service-area-invalid-self-intersect.geojson
  service-area-out-of-bounds.geojson
  service-area-boundary-case.geojson
  points-inside-outside-boundary.csv
```

### 28.3 Performance Regression Test

| Query | Dataset |
|---|---|
| nearby branch | 100k points |
| point-in-area | thousands polygons |
| risk overlap | polygon intersection |
| import validation | large GeoJSON batch |
| KNN nearest | 100k+ points |

---

## 29. Production Failure Modes

| Failure mode | Penyebab | Mitigasi |
|---|---|---|
| Query radius sangat mahal | radius tanpa cap | API max radius |
| Index tidak dipakai | expression/predicate mismatch | EXPLAIN + index fix |
| Wrong distance | geometry 4326 dianggap meter | geography/generated geography |
| Wrong match boundary | `ST_Contains` strict | `ST_Covers` jika boundary-inclusive |
| Invalid geometry masuk prod | bypass staging | validation + constraints |
| Import source CRS salah | source metadata tidak jelas | source_srid + transform |
| Cross-tenant leak | join tanpa tenant | tenant filter + tests |
| Audit bengkak | full geometry audit besar | hash/source reference/version table |
| Retention breach | location snapshot disimpan selamanya | partition retention |
| Outbox/caches stale | mutation tanpa event | transactional outbox |
| Slow after bulk import | stats stale | ANALYZE |
| Index build blocking | non-concurrent index | concurrent strategy |

---

## 30. Anti-Pattern

### 30.1 Direct Boundary Insert to Active Production

```text id="ou3j70"
Upload GeoJSON → INSERT service_area ACTIVE
```

Lebih aman:

```text id="h64etz"
Upload → staging → validate → review → promote DRAFT/ACTIVE
```

---

### 30.2 No Radius Limit

```http id="z07bt6"
GET /branches/nearby?radiusMeters=999999999
```

Harus ditolak.

---

### 30.3 No Tenant Predicate in Spatial Join

```sql id="gbopar"
JOIN service_area a
  ON ST_Covers(a.boundary, b.location)
```

Wajib:

```sql id="8iuv53"
JOIN service_area a
  ON a.tenant_id = b.tenant_id
 AND ST_Covers(a.boundary, b.location)
```

---

### 30.4 Repair Geometry Tanpa Review

```sql id="mfzua2"
UPDATE service_area
SET boundary = ST_MakeValid(boundary);
```

Berbahaya untuk boundary regulatory/service coverage.

---

### 30.5 Observability Hanya dari App Logs

Spatial query perlu DB-level visibility juga: `EXPLAIN`, index usage, `pg_stat_statements`, table/index size, invalid geometry checks.

---

## 31. Practical Decision Table

| Concern | Production pattern |
|---|---|
| Enable PostGIS | migration, not manual |
| Boundary import | staging → validate → promote |
| Invalid geometry | reject/repair with policy |
| Service area version | archive/version table |
| Customer location history | time partition + retention |
| Nearby API | radius/limit cap + geography index |
| Point-in-area | `ST_Covers`/`ST_Contains` contract |
| Large boundary | `ST_Subdivide` / display geometry |
| Spatial join frequent | precompute assignment |
| Query performance | EXPLAIN + pg_stat_statements |
| Multi-tenant | tenant_id column + tests |
| Sensitive location | access control + retention |
| Index migration | `CREATE INDEX CONCURRENTLY` |
| Post-import | `ANALYZE` |
| Incident | runbook with diagnostics |

---

## 32. Ringkasan Praktis

```text id="ty7hxc"
Geospatial Production Hardening Rule
│
├── Migrate safely
│   ├── extension via migration
│   ├── typed spatial columns
│   ├── generated geography if needed
│   ├── indexes concurrently
│   └── expand/backfill/validate/cutover
│
├── Import safely
│   ├── staging
│   ├── parse
│   ├── validate SRID/type/validity/bounds
│   ├── repair only by policy
│   └── promote with audit
│
├── Operate safely
│   ├── EXPLAIN ANALYZE BUFFERS
│   ├── pg_stat_statements
│   ├── invalid geometry checks
│   ├── index usage/size monitoring
│   └── statement timeout
│
├── Secure data
│   ├── tenant_id everywhere
│   ├── no raw spatial query API
│   ├── radius/limit/GeoJSON size caps
│   ├── location privacy review
│   └── audit access/change
│
├── Scale consciously
│   ├── partial GiST indexes
│   ├── partition time-series snapshots
│   ├── ST_Subdivide large boundary
│   ├── precompute repeated spatial joins
│   └── retention by partition/drop/archive
│
└── Prepare runbooks
    ├── nearby query slow
    ├── point-in-area mismatch
    ├── import failure
    ├── invalid geometry
    └── cross-tenant leak investigation
```

---

# Status

**Seri 18/19 selesai.**

Berikutnya: **Seri 19/19 - Java/Jersey/MyBatis Integration Pattern for PostgreSQL Geospatial Database**, seri penutup blok geospatial sekaligus penutup seluruh seri PostgreSQL multi-model ini.

---

**Sources:**

- [PostGIS 3.5.7dev Manual](https://postgis.net/docs/manual-3.5/postgis-en.html?utm_source=chatgpt.com)
- [Documentation: 18: CREATE INDEX](https://www.postgresql.org/docs/current/sql-createindex.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 9:11:55 PM

# Seri 19/19 - Java/Jersey/MyBatis Integration Pattern for PostgreSQL Geospatial Database

## 1. Tujuan Seri Ini

Seri ini adalah penutup blok **PostgreSQL Geospatial Database** sekaligus penutup seluruh seri **PostgreSQL Multi-Model: Key-Value, Document, dan Geospatial Database**.

Fokusnya adalah bagaimana PostGIS dipakai dari aplikasi **Java 17+ / Jersey / MyBatis** secara practical dan production-grade.

Target praktis:

1. Mendesain Jersey Resource untuk spatial API.
2. Mendesain DTO request/response untuk point, boundary, nearby, dan area matching.
3. Membuat MyBatis Mapper XML untuk PostGIS SQL.
4. Menangani `geometry`, `geography`, GeoJSON, lon/lat, dan distance meter.
5. Membuat service layer dengan validation, transaction, audit, dan outbox.
6. Membuat import pipeline untuk GeoJSON boundary.
7. Membuat query nearby, point-in-area, spatial join, dan boundary CRUD.
8. Membuat error handling, testing, observability, dan production guardrail.

PostGIS memperluas PostgreSQL dengan kemampuan menyimpan, mengindeks, dan melakukan query geospatial data. Fungsi seperti `ST_DWithin` memakai unit sesuai tipe data: untuk `geometry`, unit mengikuti spatial reference system; untuk `geography`, unitnya meter dan default pengukuran memakai spheroid. Ini penting untuk desain API radius/nearby di aplikasi. ([PostGIS](https://postgis.net/?utm_source=chatgpt.com))

---

## 2. Integration Architecture

```text id="15qzyc"
Java/Jersey/MyBatis Geospatial Integration
│
├── HTTP Layer
│   ├── BranchSpatialResource
│   ├── ServiceAreaResource
│   ├── SpatialImportResource
│   ├── DTO validation
│   ├── ExceptionMapper
│   └── correlation/idempotency header
│
├── Application Layer
│   ├── BranchLocationService
│   ├── ServiceAreaQueryService
│   ├── SpatialImportService
│   ├── SpatialValidationService
│   ├── TransactionExecutor
│   └── Authorization / tenant boundary
│
├── Persistence Layer
│   ├── BranchLocationMapper.xml
│   ├── ServiceAreaMapper.xml
│   ├── SpatialImportMapper.xml
│   ├── SpatialAuditMapper.xml
│   └── OutboxMapper.xml
│
├── PostgreSQL/PostGIS
│   ├── branch_location
│   ├── service_area
│   ├── risk_zone
│   ├── spatial_import_batch
│   ├── spatial_import_staging
│   ├── spatial_entity_audit
│   └── outbox_event
│
└── Operations
    ├── EXPLAIN ANALYZE
    ├── metrics/logging
    ├── index usage
    ├── invalid geometry checks
    └── import runbook
```

Core rule:

```text id="04ikfs"
API menerima longitude/latitude/GeoJSON secara eksplisit.
Service melakukan validasi domain.
MyBatis XML menjalankan SQL PostGIS eksplisit.
Database menjaga SRID/type/index/constraint.
```

---

## 3. Database Baseline

### 3.1 Branch Location

```sql id="cyglz2"
CREATE TABLE branch_location (
    branch_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    branch_code text NOT NULL,
    branch_name text NOT NULL,
    branch_type text NOT NULL,
    status text NOT NULL,

    location geometry(Point, 4326) NOT NULL,

    location_geog geography(Point, 4326)
        GENERATED ALWAYS AS (location::geography) STORED,

    address_text text NULL,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

    version bigint NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by text NULL,
    updated_by text NULL,

    CONSTRAINT uq_branch_location_code
        UNIQUE (tenant_id, branch_code),

    CONSTRAINT ck_branch_location_type
        CHECK (branch_type IN ('MAIN', 'REGULAR', 'AGENT', 'ATM', 'PARTNER')),

    CONSTRAINT ck_branch_location_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'CLOSED')),

    CONSTRAINT ck_branch_location_metadata_object
        CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX idx_branch_location_tenant_type_status
    ON branch_location (tenant_id, branch_type, status);

CREATE INDEX idx_branch_location_active_location_gist
    ON branch_location
    USING gist (location)
    WHERE status = 'ACTIVE';

CREATE INDEX idx_branch_location_active_geog_gist
    ON branch_location
    USING gist (location_geog)
    WHERE status = 'ACTIVE';
```

### 3.2 Service Area

```sql id="qyv5y5"
CREATE TABLE service_area (
    area_id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,

    area_code text NOT NULL,
    area_name text NOT NULL,
    area_type text NOT NULL,
    status text NOT NULL,

    boundary geometry(MultiPolygon, 4326) NOT NULL,

    priority integer NOT NULL DEFAULT 100,

    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

    version bigint NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by text NULL,
    updated_by text NULL,

    CONSTRAINT uq_service_area_code
        UNIQUE (tenant_id, area_code),

    CONSTRAINT ck_service_area_type
        CHECK (area_type IN ('DELIVERY', 'BRANCH_COVERAGE', 'SALES', 'SUPPORT', 'CUSTOM')),

    CONSTRAINT ck_service_area_status
        CHECK (status IN ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED')),

    CONSTRAINT ck_service_area_metadata_object
        CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX idx_service_area_tenant_type_status_priority
    ON service_area (tenant_id, area_type, status, priority);

CREATE INDEX idx_service_area_active_boundary_gist
    ON service_area
    USING gist (boundary)
    WHERE status = 'ACTIVE';
```

Untuk table besar, index production sebaiknya dibuat dengan `CREATE INDEX CONCURRENTLY` agar blocking write lebih rendah; PostgreSQL juga punya caveat khusus untuk partitioned table: concurrent build dilakukan per partition, lalu index parent dibuat non-concurrent sebagai metadata-only operation. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createindex.html?utm_source=chatgpt.com))

---

## 4. DTO: Longitude/Latitude Contract

Jangan pakai field ambigu `x`, `y`, `latLng`, atau `coordinate`.

```java id="9cdjx4"
public record GeoPointRequest(
    BigDecimal longitude,
    BigDecimal latitude
) {
    public GeoPointRequest {
        if (longitude == null) {
            throw new IllegalArgumentException("longitude is required");
        }
        if (latitude == null) {
            throw new IllegalArgumentException("latitude is required");
        }
        if (longitude.compareTo(BigDecimal.valueOf(-180)) < 0
            || longitude.compareTo(BigDecimal.valueOf(180)) > 0) {
            throw new IllegalArgumentException("longitude must be between -180 and 180");
        }
        if (latitude.compareTo(BigDecimal.valueOf(-90)) < 0
            || latitude.compareTo(BigDecimal.valueOf(90)) > 0) {
            throw new IllegalArgumentException("latitude must be between -90 and 90");
        }
    }
}
```

Rule penting:

```text id="vjouqf"
API contract:
  longitude dulu
  latitude kedua

SQL:
  ST_MakePoint(longitude, latitude)
```

---

## 5. DTO: Branch Location

### 5.1 Create/Update Request

```java id="50osxb"
public record UpsertBranchLocationRequest(
    String branchCode,
    String branchName,
    String branchType,
    BigDecimal longitude,
    BigDecimal latitude,
    String addressText,
    Map<String, Object> metadata,
    Long expectedVersion,
    String reason
) {
    public UpsertBranchLocationRequest {
        if (branchCode == null || branchCode.isBlank()) {
            throw new IllegalArgumentException("branchCode is required");
        }
        if (branchName == null || branchName.isBlank()) {
            throw new IllegalArgumentException("branchName is required");
        }
        if (!Set.of("MAIN", "REGULAR", "AGENT", "ATM", "PARTNER").contains(branchType)) {
            throw new IllegalArgumentException("Invalid branchType");
        }
        new GeoPointRequest(longitude, latitude);

        metadata = metadata == null ? Map.of() : Map.copyOf(metadata);

        if (reason == null || reason.isBlank()) {
            throw new IllegalArgumentException("reason is required");
        }
    }
}
```

### 5.2 Response

```java id="nvtzmq"
public record BranchLocationResponse(
    UUID branchId,
    String branchCode,
    String branchName,
    String branchType,
    String status,
    BigDecimal longitude,
    BigDecimal latitude,
    String addressText,
    Map<String, Object> metadata,
    long version,
    OffsetDateTime updatedAt
) {}
```

---

## 6. DTO: Nearby Search

```java id="1zohni"
public record NearbyBranchRequest(
    BigDecimal longitude,
    BigDecimal latitude,
    int radiusMeters,
    int limit,
    String branchType
) {
    public NearbyBranchRequest {
        new GeoPointRequest(longitude, latitude);

        if (radiusMeters <= 0 || radiusMeters > 50_000) {
            throw new IllegalArgumentException("radiusMeters must be between 1 and 50000");
        }

        if (limit <= 0 || limit > 100) {
            limit = 20;
        }

        if (branchType != null
            && !Set.of("MAIN", "REGULAR", "AGENT", "ATM", "PARTNER").contains(branchType)) {
            throw new IllegalArgumentException("Invalid branchType");
        }
    }
}
```

```java id="yz56zu"
public record NearbyBranchResponse(
    UUID branchId,
    String branchCode,
    String branchName,
    String branchType,
    BigDecimal longitude,
    BigDecimal latitude,
    BigDecimal distanceMeters
) {}
```

---

## 7. DTO: Service Area / Boundary

PostGIS `ST_GeomFromGeoJSON` membangun geometry dari representasi GeoJSON geometry. Catatan penting: fungsi ini bekerja untuk fragment geometry, bukan seluruh Feature/FeatureCollection; mulai PostGIS 3.0, parsed geometry default ke SRID 4326 jika tidak ditentukan, tetapi tetap lebih aman melakukan validasi dan casting eksplisit sesuai kolom target. ([PostGIS](https://postgis.net/docs/ST_GeomFromGeoJSON.html?utm_source=chatgpt.com))

```java id="x8p9np"
public record CreateServiceAreaRequest(
    String areaCode,
    String areaName,
    String areaType,
    Integer priority,
    String boundaryGeoJson,
    Map<String, Object> metadata,
    String reason
) {
    public CreateServiceAreaRequest {
        if (areaCode == null || areaCode.isBlank()) {
            throw new IllegalArgumentException("areaCode is required");
        }
        if (areaName == null || areaName.isBlank()) {
            throw new IllegalArgumentException("areaName is required");
        }
        if (!Set.of("DELIVERY", "BRANCH_COVERAGE", "SALES", "SUPPORT", "CUSTOM").contains(areaType)) {
            throw new IllegalArgumentException("Invalid areaType");
        }
        if (boundaryGeoJson == null || boundaryGeoJson.isBlank()) {
            throw new IllegalArgumentException("boundaryGeoJson is required");
        }
        if (boundaryGeoJson.length() > 5_000_000) {
            throw new IllegalArgumentException("boundaryGeoJson too large");
        }
        if (priority == null) {
            priority = 100;
        }
        metadata = metadata == null ? Map.of() : Map.copyOf(metadata);
        if (reason == null || reason.isBlank()) {
            throw new IllegalArgumentException("reason is required");
        }
    }
}
```

Response untuk boundary sebaiknya tidak selalu mengembalikan full GeoJSON besar. Pisahkan summary vs detail.

```java id="0gn2uh"
public record ServiceAreaSummaryResponse(
    UUID areaId,
    String areaCode,
    String areaName,
    String areaType,
    String status,
    int priority,
    long version,
    OffsetDateTime updatedAt
) {}
```

```java id="05vun5"
public record ServiceAreaDetailResponse(
    UUID areaId,
    String areaCode,
    String areaName,
    String areaType,
    String status,
    int priority,
    String boundaryGeoJson,
    Map<String, Object> metadata,
    long version,
    OffsetDateTime updatedAt
) {}
```

`ST_AsGeoJSON` menghasilkan GeoJSON geometry/feature representation dan memiliki opsi seperti `maxdecimaldigits`; dokumentasi PostGIS mencatat GeoJSON output sebaiknya WGS84 longitude/latitude untuk kompatibilitas RFC 7946. ([PostGIS](https://postgis.net/docs/ST_AsGeoJSON.html?utm_source=chatgpt.com))

---

## 8. Persistence Records

```java id="jxm9yr"
public record BranchLocationRecord(
    UUID branchId,
    UUID tenantId,
    String branchCode,
    String branchName,
    String branchType,
    String status,
    BigDecimal longitude,
    BigDecimal latitude,
    String addressText,
    String metadataJson,
    long version,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {}
```

```java id="0il5dh"
public record NearbyBranchRecord(
    UUID branchId,
    String branchCode,
    String branchName,
    String branchType,
    BigDecimal longitude,
    BigDecimal latitude,
    BigDecimal distanceMeters
) {}
```

```java id="e55meb"
public record ServiceAreaRecord(
    UUID areaId,
    UUID tenantId,
    String areaCode,
    String areaName,
    String areaType,
    String status,
    int priority,
    String boundaryGeoJson,
    String metadataJson,
    long version,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {}
```

```java id="1io6n0"
public record ServiceAreaMatchRecord(
    UUID areaId,
    String areaCode,
    String areaName,
    String areaType,
    int priority
) {}
```

---

## 9. MyBatis Mapper: Branch Location Interface

```java id="zl43wa"
public interface BranchLocationMapper {

    Optional<BranchLocationRecord> findById(
        @Param("tenantId") UUID tenantId,
        @Param("branchId") UUID branchId
    );

    Optional<BranchLocationRecord> findByCode(
        @Param("tenantId") UUID tenantId,
        @Param("branchCode") String branchCode
    );

    int insertBranchLocation(
        @Param("branchId") UUID branchId,
        @Param("tenantId") UUID tenantId,
        @Param("branchCode") String branchCode,
        @Param("branchName") String branchName,
        @Param("branchType") String branchType,
        @Param("longitude") BigDecimal longitude,
        @Param("latitude") BigDecimal latitude,
        @Param("addressText") String addressText,
        @Param("metadataJson") String metadataJson,
        @Param("actor") String actor
    );

    int updateBranchLocation(
        @Param("tenantId") UUID tenantId,
        @Param("branchId") UUID branchId,
        @Param("expectedVersion") long expectedVersion,
        @Param("branchName") String branchName,
        @Param("branchType") String branchType,
        @Param("longitude") BigDecimal longitude,
        @Param("latitude") BigDecimal latitude,
        @Param("addressText") String addressText,
        @Param("metadataJson") String metadataJson,
        @Param("actor") String actor
    );

    List<NearbyBranchRecord> findNearbyBranches(
        @Param("tenantId") UUID tenantId,
        @Param("longitude") BigDecimal longitude,
        @Param("latitude") BigDecimal latitude,
        @Param("radiusMeters") int radiusMeters,
        @Param("branchType") String branchType,
        @Param("limit") int limit
    );
}
```

---

## 10. MyBatis XML: Branch Result Map

MyBatis Mapper XML mendukung `resultMap`, constructor mapping, statement mapping, dan mapping-level `typeHandler`. Untuk PostGIS integration, pattern paling mudah di-debug adalah return geometry sebagai scalar lon/lat atau GeoJSON text dari SQL. ([MyBatis](https://mybatis.org/mybatis-3/sqlmap-xml.html?utm_source=chatgpt.com))

```xml id="fpozws"
<mapper namespace="com.company.spatial.persistence.BranchLocationMapper">

    <resultMap id="BranchLocationResultMap"
               type="com.company.spatial.persistence.BranchLocationRecord">
        <constructor>
            <arg column="branch_id" javaType="java.util.UUID"/>
            <arg column="tenant_id" javaType="java.util.UUID"/>
            <arg column="branch_code" javaType="string"/>
            <arg column="branch_name" javaType="string"/>
            <arg column="branch_type" javaType="string"/>
            <arg column="status" javaType="string"/>
            <arg column="longitude" javaType="java.math.BigDecimal"/>
            <arg column="latitude" javaType="java.math.BigDecimal"/>
            <arg column="address_text" javaType="string"/>
            <arg column="metadata_json" javaType="string"/>
            <arg column="version" javaType="long"/>
            <arg column="created_at" javaType="java.time.OffsetDateTime"/>
            <arg column="updated_at" javaType="java.time.OffsetDateTime"/>
        </constructor>
    </resultMap>

    <resultMap id="NearbyBranchResultMap"
               type="com.company.spatial.persistence.NearbyBranchRecord">
        <constructor>
            <arg column="branch_id" javaType="java.util.UUID"/>
            <arg column="branch_code" javaType="string"/>
            <arg column="branch_name" javaType="string"/>
            <arg column="branch_type" javaType="string"/>
            <arg column="longitude" javaType="java.math.BigDecimal"/>
            <arg column="latitude" javaType="java.math.BigDecimal"/>
            <arg column="distance_meters" javaType="java.math.BigDecimal"/>
        </constructor>
    </resultMap>
```

---

## 11. MyBatis XML: Read Branch

```xml id="2aufpd"
    <select id="findById" resultMap="BranchLocationResultMap">
        SELECT
            branch_id,
            tenant_id,
            branch_code,
            branch_name,
            branch_type,
            status,
            ST_X(location) AS longitude,
            ST_Y(location) AS latitude,
            address_text,
            metadata::text AS metadata_json,
            version,
            created_at,
            updated_at
        FROM branch_location
        WHERE tenant_id = #{tenantId}
          AND branch_id = #{branchId}
          AND status <> 'CLOSED'
    </select>

    <select id="findByCode" resultMap="BranchLocationResultMap">
        SELECT
            branch_id,
            tenant_id,
            branch_code,
            branch_name,
            branch_type,
            status,
            ST_X(location) AS longitude,
            ST_Y(location) AS latitude,
            address_text,
            metadata::text AS metadata_json,
            version,
            created_at,
            updated_at
        FROM branch_location
        WHERE tenant_id = #{tenantId}
          AND branch_code = #{branchCode}
          AND status <> 'CLOSED'
    </select>
```

---

## 12. MyBatis XML: Insert/Update Branch Point

```xml id="o6h1a5"
    <insert id="insertBranchLocation">
        INSERT INTO branch_location (
            branch_id,
            tenant_id,
            branch_code,
            branch_name,
            branch_type,
            status,
            location,
            address_text,
            metadata,
            created_by,
            updated_by
        )
        VALUES (
            #{branchId},
            #{tenantId},
            #{branchCode},
            #{branchName},
            #{branchType},
            'ACTIVE',
            ST_SetSRID(ST_MakePoint(#{longitude}, #{latitude}), 4326),
            #{addressText},
            CAST(#{metadataJson} AS jsonb),
            #{actor},
            #{actor}
        )
    </insert>
```

```xml id="o1s70k"
    <update id="updateBranchLocation">
        UPDATE branch_location
        SET
            branch_name = #{branchName},
            branch_type = #{branchType},
            location = ST_SetSRID(ST_MakePoint(#{longitude}, #{latitude}), 4326),
            address_text = #{addressText},
            metadata = CAST(#{metadataJson} AS jsonb),
            version = version + 1,
            updated_at = now(),
            updated_by = #{actor}
        WHERE tenant_id = #{tenantId}
          AND branch_id = #{branchId}
          AND version = #{expectedVersion}
          AND status <> 'CLOSED'
    </update>
```

Important:

```text id="taf0ek"
ST_MakePoint(longitude, latitude)
Bukan ST_MakePoint(latitude, longitude)
```

---

## 13. MyBatis XML: Nearby Branch Search

```xml id="zdsuhd"
    <select id="findNearbyBranches" resultMap="NearbyBranchResultMap" timeout="3">
        WITH input_point AS (
            SELECT
                ST_SetSRID(
                    ST_MakePoint(#{longitude}, #{latitude}),
                    4326
                )::geography AS geog
        )
        SELECT
            b.branch_id,
            b.branch_code,
            b.branch_name,
            b.branch_type,
            ST_X(b.location) AS longitude,
            ST_Y(b.location) AS latitude,
            ST_Distance(b.location_geog, p.geog) AS distance_meters
        FROM branch_location b
        CROSS JOIN input_point p
        WHERE b.tenant_id = #{tenantId}
          AND b.status = 'ACTIVE'

        <if test="branchType != null">
          AND b.branch_type = #{branchType}
        </if>

          AND ST_DWithin(
              b.location_geog,
              p.geog,
              #{radiusMeters}
          )
        ORDER BY distance_meters ASC, b.branch_code ASC
        LIMIT #{limit}
    </select>

</mapper>
```

`ST_DWithin` adalah filter radius yang tepat; untuk menampilkan ranking jarak, pakai `ST_Distance`. Untuk `geography`, nilai jarak dalam meter. ([PostGIS](https://postgis.net/docs/ST_DWithin.html?utm_source=chatgpt.com))

---

## 14. Service Layer: Branch Location

```java id="n6src8"
public final class BranchLocationService {

    private final BranchLocationMapper mapper;
    private final ObjectMapper objectMapper;

    public BranchLocationService(
        BranchLocationMapper mapper,
        ObjectMapper objectMapper
    ) {
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }

    public BranchLocationResponse create(
        UUID tenantId,
        UpsertBranchLocationRequest request,
        String actor
    ) {
        String metadataJson = serialize(request.metadata());
        UUID branchId = UUID.randomUUID();

        int inserted = mapper.insertBranchLocation(
            branchId,
            tenantId,
            request.branchCode(),
            request.branchName(),
            request.branchType(),
            request.longitude(),
            request.latitude(),
            request.addressText(),
            metadataJson,
            actor
        );

        if (inserted != 1) {
            throw new IllegalStateException("Branch location insert failed");
        }

        BranchLocationRecord record = mapper.findById(tenantId, branchId)
            .orElseThrow(() -> new IllegalStateException("Inserted branch not found"));

        return toResponse(record);
    }

    public BranchLocationResponse update(
        UUID tenantId,
        UUID branchId,
        UpsertBranchLocationRequest request,
        String actor
    ) {
        if (request.expectedVersion() == null) {
            throw new IllegalArgumentException("expectedVersion is required");
        }

        int updated = mapper.updateBranchLocation(
            tenantId,
            branchId,
            request.expectedVersion(),
            request.branchName(),
            request.branchType(),
            request.longitude(),
            request.latitude(),
            request.addressText(),
            serialize(request.metadata()),
            actor
        );

        if (updated != 1) {
            throw new SpatialEntityConflictException(
                "Branch location not found or version conflict"
            );
        }

        return mapper.findById(tenantId, branchId)
            .map(this::toResponse)
            .orElseThrow(() -> new SpatialEntityNotFoundException("Branch not found"));
    }

    public List<NearbyBranchResponse> nearby(
        UUID tenantId,
        NearbyBranchRequest request
    ) {
        return mapper.findNearbyBranches(
                tenantId,
                request.longitude(),
                request.latitude(),
                request.radiusMeters(),
                request.branchType(),
                request.limit()
            )
            .stream()
            .map(this::toNearbyResponse)
            .toList();
    }

    private String serialize(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Cannot serialize metadata", e);
        }
    }

    private BranchLocationResponse toResponse(BranchLocationRecord r) {
        return new BranchLocationResponse(
            r.branchId(),
            r.branchCode(),
            r.branchName(),
            r.branchType(),
            r.status(),
            r.longitude(),
            r.latitude(),
            r.addressText(),
            deserializeMap(r.metadataJson()),
            r.version(),
            r.updatedAt()
        );
    }

    private NearbyBranchResponse toNearbyResponse(NearbyBranchRecord r) {
        return new NearbyBranchResponse(
            r.branchId(),
            r.branchCode(),
            r.branchName(),
            r.branchType(),
            r.longitude(),
            r.latitude(),
            r.distanceMeters()
        );
    }

    private Map<String, Object> deserializeMap(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            throw new StoredSpatialMetadataCorruptionException(e);
        }
    }
}
```

---

## 15. Jersey Resource: Branch Location

```java id="vgesgk"
@Path("/tenants/{tenantId}/branches")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class BranchLocationResource {

    private final BranchLocationService branchLocationService;

    public BranchLocationResource(BranchLocationService branchLocationService) {
        this.branchLocationService = branchLocationService;
    }

    @POST
    @Path("/locations")
    public Response createLocation(
        @PathParam("tenantId") UUID tenantId,
        UpsertBranchLocationRequest request,
        @Context SecurityContext securityContext
    ) {
        String actor = securityContext.getUserPrincipal().getName();

        BranchLocationResponse response =
            branchLocationService.create(tenantId, request, actor);

        return Response.status(Response.Status.CREATED)
            .entity(response)
            .build();
    }

    @PUT
    @Path("/locations/{branchId}")
    public Response updateLocation(
        @PathParam("tenantId") UUID tenantId,
        @PathParam("branchId") UUID branchId,
        UpsertBranchLocationRequest request,
        @Context SecurityContext securityContext
    ) {
        String actor = securityContext.getUserPrincipal().getName();

        BranchLocationResponse response =
            branchLocationService.update(tenantId, branchId, request, actor);

        return Response.ok(response).build();
    }

    @GET
    @Path("/nearby")
    public Response nearby(
        @PathParam("tenantId") UUID tenantId,
        @QueryParam("longitude") BigDecimal longitude,
        @QueryParam("latitude") BigDecimal latitude,
        @DefaultValue("5000") @QueryParam("radiusMeters") int radiusMeters,
        @QueryParam("branchType") String branchType,
        @DefaultValue("20") @QueryParam("limit") int limit
    ) {
        NearbyBranchRequest request = new NearbyBranchRequest(
            longitude,
            latitude,
            radiusMeters,
            limit,
            branchType
        );

        List<NearbyBranchResponse> response =
            branchLocationService.nearby(tenantId, request);

        return Response.ok(response).build();
    }
}
```

---

## 16. Service Area Mapper Interface

```java id="2k9dau"
public interface ServiceAreaMapper {

    Optional<ServiceAreaRecord> findById(
        @Param("tenantId") UUID tenantId,
        @Param("areaId") UUID areaId
    );

    int insertServiceAreaFromGeoJson(
        @Param("areaId") UUID areaId,
        @Param("tenantId") UUID tenantId,
        @Param("areaCode") String areaCode,
        @Param("areaName") String areaName,
        @Param("areaType") String areaType,
        @Param("priority") int priority,
        @Param("boundaryGeoJson") String boundaryGeoJson,
        @Param("metadataJson") String metadataJson,
        @Param("actor") String actor
    );

    List<ServiceAreaMatchRecord> findAllServiceAreasForPoint(
        @Param("tenantId") UUID tenantId,
        @Param("areaType") String areaType,
        @Param("longitude") BigDecimal longitude,
        @Param("latitude") BigDecimal latitude
    );

    int archiveServiceArea(
        @Param("tenantId") UUID tenantId,
        @Param("areaId") UUID areaId,
        @Param("expectedVersion") long expectedVersion,
        @Param("actor") String actor
    );
}
```

---

## 17. Service Area Mapper XML

```xml id="6p3z92"
<mapper namespace="com.company.spatial.persistence.ServiceAreaMapper">

    <resultMap id="ServiceAreaResultMap"
               type="com.company.spatial.persistence.ServiceAreaRecord">
        <constructor>
            <arg column="area_id" javaType="java.util.UUID"/>
            <arg column="tenant_id" javaType="java.util.UUID"/>
            <arg column="area_code" javaType="string"/>
            <arg column="area_name" javaType="string"/>
            <arg column="area_type" javaType="string"/>
            <arg column="status" javaType="string"/>
            <arg column="priority" javaType="int"/>
            <arg column="boundary_geojson" javaType="string"/>
            <arg column="metadata_json" javaType="string"/>
            <arg column="version" javaType="long"/>
            <arg column="created_at" javaType="java.time.OffsetDateTime"/>
            <arg column="updated_at" javaType="java.time.OffsetDateTime"/>
        </constructor>
    </resultMap>

    <resultMap id="ServiceAreaMatchResultMap"
               type="com.company.spatial.persistence.ServiceAreaMatchRecord">
        <constructor>
            <arg column="area_id" javaType="java.util.UUID"/>
            <arg column="area_code" javaType="string"/>
            <arg column="area_name" javaType="string"/>
            <arg column="area_type" javaType="string"/>
            <arg column="priority" javaType="int"/>
        </constructor>
    </resultMap>
```

### Find by ID

```xml id="q2c0x7"
    <select id="findById" resultMap="ServiceAreaResultMap">
        SELECT
            area_id,
            tenant_id,
            area_code,
            area_name,
            area_type,
            status,
            priority,
            ST_AsGeoJSON(boundary)::text AS boundary_geojson,
            metadata::text AS metadata_json,
            version,
            created_at,
            updated_at
        FROM service_area
        WHERE tenant_id = #{tenantId}
          AND area_id = #{areaId}
          AND status <> 'ARCHIVED'
    </select>
```

### Insert GeoJSON Boundary

```xml id="3hidd2"
    <insert id="insertServiceAreaFromGeoJson">
        INSERT INTO service_area (
            area_id,
            tenant_id,
            area_code,
            area_name,
            area_type,
            status,
            priority,
            boundary,
            metadata,
            created_by,
            updated_by
        )
        VALUES (
            #{areaId},
            #{tenantId},
            #{areaCode},
            #{areaName},
            #{areaType},
            'DRAFT',
            #{priority},
            ST_Multi(
                ST_CollectionExtract(
                    ST_MakeValid(
                        ST_SetSRID(
                            ST_GeomFromGeoJSON(#{boundaryGeoJson}),
                            4326
                        )
                    ),
                    3
                )
            )::geometry(MultiPolygon, 4326),
            CAST(#{metadataJson} AS jsonb),
            #{actor},
            #{actor}
        )
    </insert>
```

Catatan production: untuk boundary besar/critical, jangan langsung insert dari API ke `service_area`. Lebih aman lewat staging + validation + review + promote.

### Point-in-Area Matching

```xml id="3gi0pk"
    <select id="findAllServiceAreasForPoint" resultMap="ServiceAreaMatchResultMap">
        SELECT
            area_id,
            area_code,
            area_name,
            area_type,
            priority
        FROM service_area
        WHERE tenant_id = #{tenantId}
          AND area_type = #{areaType}
          AND status = 'ACTIVE'
          AND ST_Covers(
              boundary,
              ST_SetSRID(ST_MakePoint(#{longitude}, #{latitude}), 4326)
          )
        ORDER BY priority ASC, area_code ASC
    </select>
```

`ST_Covers` sering lebih cocok untuk API bisnis point-in-area jika titik di boundary tetap dianggap masuk area. Bila butuh strict containment, pakai `ST_Contains`.

### Archive

```xml id="xqeyl5"
    <update id="archiveServiceArea">
        UPDATE service_area
        SET
            status = 'ARCHIVED',
            version = version + 1,
            updated_at = now(),
            updated_by = #{actor}
        WHERE tenant_id = #{tenantId}
          AND area_id = #{areaId}
          AND version = #{expectedVersion}
          AND status <> 'ARCHIVED'
    </update>

</mapper>
```

---

## 18. Service Area Service

```java id="8i6q6g"
public final class ServiceAreaService {

    private final ServiceAreaMapper mapper;
    private final ObjectMapper objectMapper;

    public ServiceAreaService(ServiceAreaMapper mapper, ObjectMapper objectMapper) {
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }

    public ServiceAreaDetailResponse createDraftArea(
        UUID tenantId,
        CreateServiceAreaRequest request,
        String actor
    ) {
        String metadataJson = serialize(request.metadata());
        UUID areaId = UUID.randomUUID();

        int inserted = mapper.insertServiceAreaFromGeoJson(
            areaId,
            tenantId,
            request.areaCode(),
            request.areaName(),
            request.areaType(),
            request.priority(),
            request.boundaryGeoJson(),
            metadataJson,
            actor
        );

        if (inserted != 1) {
            throw new IllegalStateException("Service area insert failed");
        }

        return mapper.findById(tenantId, areaId)
            .map(this::toDetailResponse)
            .orElseThrow(() -> new IllegalStateException("Inserted area not found"));
    }

    public ServiceAreaMatchResponse matchPoint(
        UUID tenantId,
        String areaType,
        BigDecimal longitude,
        BigDecimal latitude
    ) {
        validateAreaType(areaType);
        new GeoPointRequest(longitude, latitude);

        List<ServiceAreaMatchRecord> matches =
            mapper.findAllServiceAreasForPoint(
                tenantId,
                areaType,
                longitude,
                latitude
            );

        if (matches.isEmpty()) {
            return ServiceAreaMatchResponse.noMatch();
        }

        return ServiceAreaMatchResponse.matched(
            matches.get(0),
            matches.size() > 1,
            matches
        );
    }

    public void archive(
        UUID tenantId,
        UUID areaId,
        long expectedVersion,
        String actor
    ) {
        int updated = mapper.archiveServiceArea(
            tenantId,
            areaId,
            expectedVersion,
            actor
        );

        if (updated != 1) {
            throw new SpatialEntityConflictException(
                "Service area not found or version conflict"
            );
        }
    }

    private void validateAreaType(String areaType) {
        if (!Set.of("DELIVERY", "BRANCH_COVERAGE", "SALES", "SUPPORT", "CUSTOM").contains(areaType)) {
            throw new IllegalArgumentException("Invalid areaType");
        }
    }

    private String serialize(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Cannot serialize metadata", e);
        }
    }

    private ServiceAreaDetailResponse toDetailResponse(ServiceAreaRecord r) {
        return new ServiceAreaDetailResponse(
            r.areaId(),
            r.areaCode(),
            r.areaName(),
            r.areaType(),
            r.status(),
            r.priority(),
            r.boundaryGeoJson(),
            deserializeMap(r.metadataJson()),
            r.version(),
            r.updatedAt()
        );
    }

    private Map<String, Object> deserializeMap(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            throw new StoredSpatialMetadataCorruptionException(e);
        }
    }
}
```

---

## 19. Jersey Resource: Service Area

```java id="ut0rm8"
@Path("/tenants/{tenantId}/service-areas")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ServiceAreaResource {

    private final ServiceAreaService serviceAreaService;

    public ServiceAreaResource(ServiceAreaService serviceAreaService) {
        this.serviceAreaService = serviceAreaService;
    }

    @POST
    public Response createDraft(
        @PathParam("tenantId") UUID tenantId,
        CreateServiceAreaRequest request,
        @Context SecurityContext securityContext
    ) {
        String actor = securityContext.getUserPrincipal().getName();

        ServiceAreaDetailResponse response =
            serviceAreaService.createDraftArea(tenantId, request, actor);

        return Response.status(Response.Status.CREATED)
            .entity(response)
            .build();
    }

    @GET
    @Path("/match")
    public Response matchPoint(
        @PathParam("tenantId") UUID tenantId,
        @QueryParam("areaType") String areaType,
        @QueryParam("longitude") BigDecimal longitude,
        @QueryParam("latitude") BigDecimal latitude
    ) {
        ServiceAreaMatchResponse response =
            serviceAreaService.matchPoint(
                tenantId,
                areaType,
                longitude,
                latitude
            );

        return Response.ok(response).build();
    }

    @DELETE
    @Path("/{areaId}")
    public Response archive(
        @PathParam("tenantId") UUID tenantId,
        @PathParam("areaId") UUID areaId,
        @QueryParam("expectedVersion") long expectedVersion,
        @Context SecurityContext securityContext
    ) {
        String actor = securityContext.getUserPrincipal().getName();

        serviceAreaService.archive(
            tenantId,
            areaId,
            expectedVersion,
            actor
        );

        return Response.noContent().build();
    }
}
```

---

## 20. Import Pipeline Mapper

Untuk boundary production, pakai staging.

```java id="jz32vp"
public interface SpatialImportMapper {

    int createImportBatch(
        @Param("importBatchId") String importBatchId,
        @Param("tenantId") UUID tenantId,
        @Param("targetEntity") String targetEntity,
        @Param("sourceSystem") String sourceSystem,
        @Param("sourceReference") String sourceReference,
        @Param("createdBy") String createdBy
    );

    int insertStagingGeoJson(
        @Param("stagingId") UUID stagingId,
        @Param("importBatchId") String importBatchId,
        @Param("tenantId") UUID tenantId,
        @Param("externalCode") String externalCode,
        @Param("externalName") String externalName,
        @Param("rawGeoJson") String rawGeoJson
    );

    int parseGeoJson(
        @Param("importBatchId") String importBatchId
    );

    int validateGeometry(
        @Param("importBatchId") String importBatchId
    );

    int promoteServiceAreas(
        @Param("importBatchId") String importBatchId,
        @Param("areaType") String areaType,
        @Param("actor") String actor
    );
}
```

---

## 21. Import Pipeline XML

### Create Batch

```xml id="uh0fo3"
<insert id="createImportBatch">
    INSERT INTO spatial_import_batch (
        import_batch_id,
        tenant_id,
        target_entity,
        source_system,
        source_reference,
        status,
        created_by
    )
    VALUES (
        #{importBatchId},
        #{tenantId},
        #{targetEntity},
        #{sourceSystem},
        #{sourceReference},
        'UPLOADED',
        #{createdBy}
    )
</insert>
```

### Insert Staging

```xml id="etwbvy"
<insert id="insertStagingGeoJson">
    INSERT INTO spatial_import_staging (
        staging_id,
        import_batch_id,
        tenant_id,
        external_code,
        external_name,
        raw_geojson
    )
    VALUES (
        #{stagingId},
        #{importBatchId},
        #{tenantId},
        #{externalCode},
        #{externalName},
        CAST(#{rawGeoJson} AS jsonb)
    )
</insert>
```

### Parse GeoJSON

```xml id="3b0qgw"
<update id="parseGeoJson">
    UPDATE spatial_import_staging
    SET parsed_geometry = ST_SetSRID(
        ST_GeomFromGeoJSON(raw_geojson::text),
        4326
    )
    WHERE import_batch_id = #{importBatchId}
      AND raw_geojson IS NOT NULL
      AND parsed_geometry IS NULL
</update>
```

### Validate Geometry

```xml id="b4hx4t"
<update id="validateGeometry">
    UPDATE spatial_import_staging
    SET
        validation_status = CASE
            WHEN parsed_geometry IS NULL THEN 'INVALID'
            WHEN ST_SRID(parsed_geometry) <> 4326 THEN 'INVALID'
            WHEN GeometryType(parsed_geometry) NOT IN ('POLYGON', 'MULTIPOLYGON') THEN 'INVALID'
            WHEN NOT ST_IsValid(parsed_geometry) THEN 'INVALID'
            ELSE 'VALID'
        END,
        validation_errors = CASE
            WHEN parsed_geometry IS NULL
                THEN jsonb_build_array('GEOMETRY_IS_NULL')
            WHEN ST_SRID(parsed_geometry) <> 4326
                THEN jsonb_build_array('INVALID_SRID')
            WHEN GeometryType(parsed_geometry) NOT IN ('POLYGON', 'MULTIPOLYGON')
                THEN jsonb_build_array(
                    jsonb_build_object(
                        'code', 'INVALID_GEOMETRY_TYPE',
                        'actualType', GeometryType(parsed_geometry)
                    )
                )
            WHEN NOT ST_IsValid(parsed_geometry)
                THEN jsonb_build_array(
                    jsonb_build_object(
                        'code', 'INVALID_GEOMETRY',
                        'reason', ST_IsValidReason(parsed_geometry)
                    )
                )
            ELSE '[]'::jsonb
        END,
        validated_at = now()
    WHERE import_batch_id = #{importBatchId}
</update>
```

### Promote Service Areas

```xml id="y1sk4u"
<insert id="promoteServiceAreas">
    INSERT INTO service_area (
        area_id,
        tenant_id,
        area_code,
        area_name,
        area_type,
        status,
        boundary,
        metadata,
        created_by,
        updated_by
    )
    SELECT
        gen_random_uuid(),
        tenant_id,
        external_code,
        external_name,
        #{areaType},
        'DRAFT',
        ST_Multi(parsed_geometry)::geometry(MultiPolygon, 4326),
        jsonb_build_object(
            'importBatchId', import_batch_id,
            'source', 'spatial_import'
        ),
        #{actor},
        #{actor}
    FROM spatial_import_staging
    WHERE import_batch_id = #{importBatchId}
      AND validation_status = 'VALID'
</insert>
```

---

## 22. Transaction Boundary

Untuk import:

```text id="rvgscc"
Transaction 1:
  create batch
  insert staging rows

Transaction 2:
  parse
  validate
  update batch summary

Transaction 3:
  promote valid rows
  insert audit/outbox
  mark staging promoted
  update batch promoted
```

Untuk branch location update:

```text id="2q4qec"
Transaction:
  update branch_location with expectedVersion
  insert spatial_entity_audit
  insert outbox_event if downstream depends on location
```

Untuk service area activation:

```text id="gkr4ka"
Transaction:
  validate no critical invalid geometry
  set status ACTIVE
  version + 1
  audit
  outbox event: SERVICE_AREA_ACTIVATED
```

---

## 23. Audit + Outbox Pattern

```sql id="xol88s"
CREATE TABLE spatial_entity_audit (
    audit_id bigserial PRIMARY KEY,

    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    tenant_id uuid NOT NULL,

    old_status text NULL,
    new_status text NULL,

    old_geometry geometry NULL,
    new_geometry geometry NULL,

    old_metadata jsonb NULL,
    new_metadata jsonb NULL,

    old_version bigint NULL,
    new_version bigint NULL,

    action text NOT NULL,
    actor text NOT NULL,
    reason text NULL,
    correlation_id text NULL,

    changed_at timestamptz NOT NULL DEFAULT now()
);
```

Untuk geometry besar, audit full geometry bisa berat. Pattern alternatif:

```text id="jxky45"
Audit metadata:
  entity_type
  entity_id
  old_version
  new_version
  action
  actor
  source/import_batch_id
  old_geometry_hash
  new_geometry_hash
```

Outbox event payload:

```sql id="z7d5c2"
jsonb_build_object(
    'entityType', 'SERVICE_AREA',
    'entityId', area_id,
    'tenantId', tenant_id,
    'areaCode', area_code,
    'newVersion', version,
    'event', 'SERVICE_AREA_UPDATED'
)
```

---

## 24. Exception Mapper

```java id="6bqv64"
@Provider
public final class SpatialExceptionMapper
    implements ExceptionMapper<RuntimeException> {

    @Override
    public Response toResponse(RuntimeException e) {
        if (e instanceof IllegalArgumentException) {
            return error(400, "INVALID_SPATIAL_REQUEST", e.getMessage());
        }

        if (e instanceof SpatialEntityNotFoundException) {
            return error(404, "SPATIAL_ENTITY_NOT_FOUND", e.getMessage());
        }

        if (e instanceof SpatialEntityConflictException) {
            return error(409, "SPATIAL_ENTITY_CONFLICT", e.getMessage());
        }

        if (e instanceof InvalidGeometryException) {
            return error(400, "INVALID_GEOMETRY", e.getMessage());
        }

        if (e instanceof StoredSpatialMetadataCorruptionException) {
            return error(500, "STORED_SPATIAL_METADATA_CORRUPTION",
                "Stored spatial metadata is invalid");
        }

        return error(500, "INTERNAL_ERROR", "Unexpected error");
    }

    private Response error(int status, String code, String message) {
        return Response.status(status)
            .entity(Map.of(
                "code", code,
                "message", message
            ))
            .build();
    }
}
```

---

## 25. API Contract Examples

### 25.1 Create Branch Location

```http id="z3kjf1"
POST /tenants/{tenantId}/branches/locations
Content-Type: application/json
```

```json id="6cc07v"
{
  "branchCode": "JKT-001",
  "branchName": "Jakarta Central Branch",
  "branchType": "REGULAR",
  "longitude": 106.8456,
  "latitude": -6.2088,
  "addressText": "Jakarta",
  "metadata": {
    "source": "admin"
  },
  "reason": "Initial branch setup"
}
```

### 25.2 Nearby Branch

```http id="d3v9sv"
GET /tenants/{tenantId}/branches/nearby?longitude=106.8456&latitude=-6.2088&radiusMeters=5000&limit=10
```

```json id="l6hx83"
[
  {
    "branchId": "f7e4...",
    "branchCode": "JKT-001",
    "branchName": "Jakarta Central Branch",
    "branchType": "REGULAR",
    "longitude": 106.8456,
    "latitude": -6.2088,
    "distanceMeters": 125.32
  }
]
```

### 25.3 Match Service Area

```http id="7f74q5"
GET /tenants/{tenantId}/service-areas/match?areaType=DELIVERY&longitude=106.8456&latitude=-6.2088
```

```json id="0icjuv"
{
  "matched": true,
  "ambiguous": false,
  "bestMatch": {
    "areaId": "9a3d...",
    "areaCode": "JKT-CENTRAL",
    "areaName": "Jakarta Central",
    "areaType": "DELIVERY",
    "priority": 10
  },
  "matches": []
}
```

### 25.4 Import Service Area Boundary

```http id="zpil2t"
POST /tenants/{tenantId}/spatial-imports/service-areas
Content-Type: application/json
```

```json id="o0tjsw"
{
  "importBatchId": "batch-20260715-001",
  "sourceSystem": "GIS_ADMIN",
  "sourceReference": "service-area-q3.geojson",
  "items": [
    {
      "externalCode": "JKT-CENTRAL",
      "externalName": "Jakarta Central",
      "geoJson": {
        "type": "MultiPolygon",
        "coordinates": []
      }
    }
  ]
}
```

---

## 26. Testing Strategy

Gunakan PostgreSQL + PostGIS asli, bukan H2.

### 26.1 Unit Tests

| Unit | Test |
|---|---|
| `GeoPointRequest` | reject invalid longitude/latitude |
| `NearbyBranchRequest` | reject huge radius |
| Service area request | reject huge GeoJSON |
| Branch service | version conflict |
| Service area match | ambiguous response |
| Exception mapper | correct HTTP code |

### 26.2 Mapper Integration Tests

| Test | Expected |
|---|---|
| insert branch point | `ST_X/ST_Y` return lon/lat |
| nearby radius 5 km | returns expected branch |
| radius too small | returns empty |
| point-in-area boundary | matches if using `ST_Covers` |
| insert service area GeoJSON | stored as MultiPolygon |
| invalid GeoJSON | rejected or staging invalid |
| archive with stale version | row count 0 |
| wrong tenant | no result |

### 26.3 Import Pipeline Tests

| Test | Expected |
|---|---|
| create batch | status uploaded |
| parse valid GeoJSON | parsed geometry not null |
| invalid geometry | validation_status invalid |
| wrong geometry type | invalid type |
| promote valid | service_area rows created |
| invalid not promoted | no production row |
| duplicate area code | conflict |
| batch summary | counts correct |

### 26.4 Performance Tests

| Query | Dataset |
|---|---|
| nearby branch | 100k+ points |
| point-in-area | thousands of polygons |
| service area match | boundary edge cases |
| import validate | large GeoJSON |
| KNN candidate | 100k+ points |

---

## 27. Observability

### Logs

```text id="fxzoxm"
tenant_id
operation
longitude
latitude
radius_meters
area_type
result_count
match_count
ambiguous
import_batch_id
duration_ms
actor
correlation_id
```

### Metrics

| Metric | Meaning |
|---|---|
| `spatial.branch.create.count` | branch location created |
| `spatial.branch.nearby.count` | nearby query volume |
| `spatial.branch.nearby.duration` | nearby latency |
| `spatial.branch.nearby.no_result.count` | no nearby branch |
| `spatial.service_area.match.count` | point-in-area query volume |
| `spatial.service_area.match.ambiguous.count` | multiple match |
| `spatial.import.batch.count` | import volume |
| `spatial.import.invalid.count` | invalid geometry |
| `spatial.query.timeout.count` | query timed out |
| `spatial.invalid_input.count` | bad lon/lat/radius |

### DB Observability

Use:

```sql id="boqk62"
EXPLAIN (ANALYZE, BUFFERS)
SELECT ...
```

and monitor index usage:

```sql id="detcnc"
SELECT
    relname AS table_name,
    indexrelname AS index_name,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE relname IN ('branch_location', 'service_area')
ORDER BY idx_scan ASC;
```

---

## 28. Production Guardrails

| Guardrail | Practice |
|---|---|
| Longitude/latitude explicit | API field names |
| Max radius | e.g. `<= 50_000` meters |
| Max limit | e.g. `<= 100` |
| GeoJSON size limit | reject large payload |
| No raw spatial SQL from client | domain endpoint only |
| Tenant predicate always | `tenant_id = :tenantId` |
| Join tenant equality | `a.tenant_id = b.tenant_id` |
| Geometry validation | staging pipeline |
| Boundary activation | DRAFT → ACTIVE after validation |
| Version check | update/archive with expectedVersion |
| Audit/outbox | for important spatial changes |
| Statement timeout | user-facing query |
| EXPLAIN before production | required for hot query |
| Native PostGIS tests | required |

---

## 29. Common Failure Modes

| Failure mode | Cause | Mitigation |
|---|---|---|
| Radius query returns wrong result | geometry 4326 treated as meter | use geography/generated geography |
| Nearby query slow | radius too large/index mismatch | radius cap + geography GiST |
| Point-in-area no match on border | `ST_Contains` strict | use `ST_Covers` if boundary-inclusive |
| Cross-tenant leak | missing tenant predicate | enforce tenant in mapper |
| Invalid boundary | direct production insert | staging validation |
| GeoJSON parse failure | whole FeatureCollection passed | expect geometry fragment or preprocess |
| Index not used | query expression mismatch | generated column or matching expression index |
| Audit too large | full geometry audit | hash/source/version table |
| Import duplicates | no unique code check | unique constraints + batch validation |
| Query timeout | no cap/filter | API guardrail + statement timeout |

---

## 30. Anti-Pattern

### 30.1 Generic Spatial Query Endpoint

```http id="npqhnf"
POST /spatial/query
{
  "predicate": "ST_Intersects",
  "geometry": "...",
  "table": "service_area"
}
```

Lebih baik:

```http id="pnflmf"
GET /branches/nearby
GET /service-areas/match
POST /spatial-imports/service-areas
```

### 30.2 Direct Active Boundary Insert

```text id="cftogy"
API GeoJSON → service_area ACTIVE
```

Lebih aman:

```text id="dm5ivv"
API GeoJSON → staging → validate → review → promote DRAFT/ACTIVE
```

### 30.3 Returning Full Boundary in List API

List endpoint sebaiknya summary. Detail boundary hanya di endpoint detail.

### 30.4 MyBatis Dynamic Raw Path/Predicate

Jangan membuat mapper menerima raw spatial function name dari request. Path dan function harus coded/whitelisted.

---

## 31. Practical Decision Table

| Need | Java/Jersey/MyBatis pattern |
|---|---|
| Create point location | DTO lon/lat → `ST_MakePoint(lon, lat)` |
| Update point | expectedVersion + audit |
| Nearby search | `ST_DWithin(location_geog, point_geog, radius)` |
| Distance output | `ST_Distance(... ) AS distance_meters` |
| Point-in-area | `ST_Covers(boundary, point)` |
| Strict containment | `ST_Contains(boundary, point)` |
| Boundary import | staging pipeline |
| Boundary output | `ST_AsGeoJSON(boundary)` |
| GeoJSON input | `ST_GeomFromGeoJSON` |
| Large boundary | import validate + subdivide if needed |
| Query safety | radius/limit/type whitelist |
| Multi-tenant | tenant predicate in every mapper |
| Testing | PostgreSQL/PostGIS integration tests |

---

## 32. Ringkasan Praktis

```text id="w9g304"
Java/Jersey/MyBatis Geospatial Integration Rule
│
├── API layer
│   ├── explicit longitude/latitude
│   ├── radius and limit caps
│   ├── domain-specific endpoints
│   └── no raw spatial query
│
├── Service layer
│   ├── validate lon/lat/type/radius
│   ├── enforce tenant/auth boundary
│   ├── expectedVersion for mutation
│   ├── audit important changes
│   └── route boundary import via staging
│
├── MyBatis layer
│   ├── explicit PostGIS SQL
│   ├── ST_MakePoint(lon, lat)
│   ├── ST_DWithin for radius
│   ├── ST_Distance for response
│   ├── ST_Covers/ST_Contains for area
│   └── ST_AsGeoJSON/ST_GeomFromGeoJSON for boundary IO
│
├── Database layer
│   ├── geometry/geography typed columns
│   ├── SRID 4326
│   ├── GiST indexes
│   ├── metadata B-tree indexes
│   ├── constraints
│   └── staging/import tables
│
└── Production
    ├── EXPLAIN hot queries
    ├── monitor index usage
    ├── validate geometry quality
    ├── cap query cost
    ├── PostGIS-native tests
    └── operational runbooks
```

---

# Status Akhir

**Seri 19/19 selesai.**

Seluruh seri **PostgreSQL Multi-Model Database** selesai:

## Blok Foundation & Key-Value

1. Seri 1 - PostgreSQL as Multi-Model Database  
2. Seri 2 - Key-Value Pattern: simple KV table, namespace, metadata, TTL  
3. Seri 3 - PostgreSQL `hstore`  
4. Seri 4 - `jsonb` as Key-Value Store  
5. Seri 5 - Idempotency Key Store, distributed lock-lite, optimistic concurrency  
6. Seri 6 - Java/Jersey/MyBatis Integration for PostgreSQL Key-Value Database  

## Blok Document Database

7. Seri 7 - Document Database Pattern dengan `jsonb`  
8. Seri 8 - JSON/JSONB Operators, Functions, JSONPath  
9. Seri 9 - JSONB Indexing  
10. Seri 10 - Document Schema Governance  
11. Seri 11 - Document Mutation, Audit, Outbox  
12. Seri 12 - Java/Jersey/MyBatis Integration for PostgreSQL Document Database  

## Blok Geospatial Database

13. Seri 13 - PostGIS Foundation  
14. Seri 14 - Spatial Data Modeling  
15. Seri 15 - Spatial Query Pattern  
16. Seri 16 - Distance & Nearest Neighbor  
17. Seri 17 - Spatial Indexing & Performance  
18. Seri 18 - Production Hardening  
19. Seri 19 - Java/Jersey/MyBatis Integration for PostgreSQL Geospatial Database  

Terima kasih juga. Seri ini sudah selesai semua.

---

**Sources:**

- [PostGIS](https://postgis.net/?utm_source=chatgpt.com)
- [Documentation: 18: CREATE INDEX](https://www.postgresql.org/docs/current/sql-createindex.html?utm_source=chatgpt.com)
- [MyBatis 3 | Mapper XML Files](https://mybatis.org/mybatis-3/sqlmap-xml.html?utm_source=chatgpt.com)



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)