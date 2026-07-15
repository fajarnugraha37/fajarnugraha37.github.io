# postgresql-oltp

**User:** Anonymous  
**Created:** 7/15/2026 19:39:47  
**Updated:** 7/15/2026 21:00:35  
**Exported:** 7/15/2026 21:24:42  
**Link:** [https://chatgpt.com/g/g-p-6a539ddc858881919467b6da20df4567-cheatsheet/c/6a577f89-950c-83ec-852f-094b3d1670b4](https://chatgpt.com/g/g-p-6a539ddc858881919467b6da20df4567-cheatsheet/c/6a577f89-950c-83ec-852f-094b3d1670b4)  

## Response:
7/15/2026, 7:41:05 PM

Saya akan susun sebagai peta skill praktis OLTP, bukan tutorial query satu-per-satu. Saya pisahkan area desain transaksi, schema, indexing, concurrency, reliability, operasional, dan integrasi Java/MyBatis supaya relevan untuk microservice production.

## Introduction

PostgreSQL for **OLTP** berfokus pada sistem transaksi harian: create order, approve case, update status, reserve balance/quota, workflow task claim, audit event, user action, dan integrasi antar-service. Bedanya dengan OLAP: OLTP mengejar **correctness, low-latency, high-concurrency, integrity, retry-safety, dan operability**, bukan scan besar atau agregasi berat.

Saya gunakan baseline dokumentasi **PostgreSQL current = 18.x**; dokumentasi resmi saat ini menampilkan PostgreSQL 18 sebagai current, dengan supported versions 18/17/16/15/14 dan PostgreSQL 19 masih development/beta. ([PostgreSQL](https://www.postgresql.org/docs/current/index.html?utm_source=chatgpt.com))

PostgreSQL cocok untuk OLTP karena punya fondasi transaksi kuat: **MVCC**, isolation level, locking, constraint, WAL, indexing, partitioning, replication, dan observability. MVCC membuat setiap statement membaca snapshot data yang konsisten, sehingga reader dan writer dapat berjalan lebih paralel dibanding model lock-heavy tradisional. ([PostgreSQL](https://www.postgresql.org/docs/current/mvcc-intro.html?utm_source=chatgpt.com))

---

## Diagram

```text
PostgreSQL for OLTP
│
├─ 1. Workload & Transaction Model
│  ├─ ACID boundary
│  ├─ short transaction
│  ├─ idempotency
│  ├─ retry policy
│  └─ unit-of-work design
│
├─ 2. Relational Domain Modelling
│  ├─ entity modelling
│  ├─ aggregate boundary
│  ├─ normalization
│  ├─ reference/master data
│  └─ lifecycle/status modelling
│
├─ 3. Integrity & Constraint Design
│  ├─ primary key
│  ├─ foreign key
│  ├─ unique constraint
│  ├─ check constraint
│  ├─ exclusion constraint
│  └─ generated column
│
├─ 4. Data Types for Transactional Systems
│  ├─ bigint / identity
│  ├─ uuid / uuidv7
│  ├─ numeric vs money
│  ├─ timestamp / timestamptz
│  ├─ enum / lookup table
│  ├─ jsonb
│  └─ range / multirange
│
├─ 5. Query & Mutation Design
│  ├─ SELECT by key
│  ├─ INSERT / UPDATE / DELETE
│  ├─ UPSERT
│  ├─ RETURNING
│  ├─ optimistic update
│  ├─ pagination
│  └─ batch write
│
├─ 6. Indexing for OLTP
│  ├─ B-tree
│  ├─ composite index
│  ├─ covering index / INCLUDE
│  ├─ partial index
│  ├─ unique index
│  ├─ expression index
│  ├─ GIN for jsonb/search
│  └─ BRIN for append-heavy table
│
├─ 7. Concurrency Control
│  ├─ MVCC
│  ├─ isolation level
│  ├─ row lock
│  ├─ advisory lock
│  ├─ deadlock handling
│  ├─ serialization failure retry
│  └─ SELECT ... FOR UPDATE / SKIP LOCKED
│
├─ 8. Contention & Hotspot Management
│  ├─ hot row
│  ├─ sequence hotspot
│  ├─ queue table
│  ├─ inventory/reservation
│  ├─ counter design
│  └─ shard-by-tenant/key strategy
│
├─ 9. Stored Logic & PL/pgSQL
│  ├─ function
│  ├─ procedure
│  ├─ trigger
│  ├─ audit trigger
│  ├─ validation trigger
│  └─ transactional stored operation
│
├─ 10. Partitioning for OLTP
│  ├─ time partition
│  ├─ tenant partition
│  ├─ lifecycle partition
│  ├─ archival partition
│  └─ partition pruning
│
├─ 11. Vacuum, Bloat & Storage Health
│  ├─ autovacuum
│  ├─ analyze
│  ├─ dead tuples
│  ├─ visibility map
│  ├─ freeze / XID wraparound
│  └─ table/index bloat
│
├─ 12. Performance Diagnostics
│  ├─ EXPLAIN / EXPLAIN ANALYZE
│  ├─ pg_stat_statements
│  ├─ pg_stat_activity
│  ├─ wait event
│  ├─ lock inspection
│  └─ slow query triage
│
├─ 13. Connection & Session Management
│  ├─ connection pool
│  ├─ transaction timeout
│  ├─ idle-in-transaction control
│  ├─ prepared statement behavior
│  └─ session-level settings
│
├─ 14. Reliability, WAL, Backup & Recovery
│  ├─ WAL
│  ├─ checkpoint
│  ├─ base backup
│  ├─ PITR
│  ├─ streaming replication
│  └─ failover readiness
│
├─ 15. Replication, CDC & Integration
│  ├─ physical replication
│  ├─ logical replication
│  ├─ publication/subscription
│  ├─ replication slot
│  ├─ outbox pattern
│  └─ Debezium/Kafka integration
│
├─ 16. Security & Governance
│  ├─ role
│  ├─ schema privilege
│  ├─ least privilege
│  ├─ RLS
│  ├─ auditability
│  └─ secret/config boundary
│
├─ 17. Schema Change & Release Safety
│  ├─ backward-compatible migration
│  ├─ zero/low-downtime DDL
│  ├─ expand-contract pattern
│  ├─ index concurrently
│  └─ rollback strategy
│
└─ 18. Java/MyBatis/Jersey Integration
   ├─ transaction boundary
   ├─ connection pool config
   ├─ mapper query design
   ├─ retryable SQL state handling
   ├─ idempotent command handler
   └─ observability propagation
```

---

## Tabular Decomposition Map

| Area | Skill praktis | Yang perlu dikuasai | Relevansi OLTP |
|---|---|---|---|
| 1. Workload & transaction model | Mendesain batas transaksi | Tentukan mana operasi yang harus atomic, mana yang eventual, mana yang boleh retry | Ini fondasi correctness. Jangan semua proses bisnis panjang dimasukkan ke satu DB transaction |
| 2. ACID & MVCC | Memahami snapshot, visibility, commit, rollback | PostgreSQL memakai MVCC; statement melihat snapshot data yang konsisten walaupun ada transaksi lain berjalan. ([PostgreSQL](https://www.postgresql.org/docs/current/mvcc-intro.html?utm_source=chatgpt.com)) | Penting untuk menganalisis stale read, lost update, phantom, dan bloat |
| 3. Isolation level | Read Committed, Repeatable Read, Serializable | PostgreSQL mendukung isolation level SQL termasuk Serializable. ([PostgreSQL](https://www.postgresql.org/about/?utm_source=chatgpt.com)) | Membantu memilih trade-off antara throughput dan strict consistency |
| 4. Locking | Row lock, table lock, advisory lock | PostgreSQL menyediakan lock mode eksplisit untuk mengontrol akses concurrent. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html?utm_source=chatgpt.com)) | Wajib untuk queue claim, reservation, approval workflow, dan hotspot row |
| 5. Relational modelling | Entity, aggregate, lifecycle state | Modelkan tabel sesuai invariant bisnis: order, case, task, transition, audit | OLTP buruk biasanya bukan karena SQL-nya, tapi karena invariant domain bocor |
| 6. Constraint design | PK, FK, UNIQUE, CHECK, EXCLUDE | Constraint menjaga data tetap valid meskipun bug terjadi di service layer | Untuk sistem regulatori/enforcement, constraint adalah bagian dari defensibility |
| 7. Generated columns | Kolom turunan dari kolom lain | Generated column selalu dihitung dari kolom lain; PostgreSQL 18 mendukung virtual dan stored generated columns. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-generated-columns.html?utm_source=chatgpt.com)) | Cocok untuk derived value yang harus konsisten, misalnya normalized key atau computed status |
| 8. Data type discipline | `bigint`, `uuid`, `numeric`, `timestamptz`, `jsonb`, range | Pilih tipe berdasarkan operasi, indexing, storage, dan audit need | Tipe salah menyebabkan bug uang, timezone, ordering, dan indexing |
| 9. UUID strategy | UUID random vs time-ordered UUID | PostgreSQL 18 menambahkan `uuidv7()` untuk timestamp-ordered UUID. ([PostgreSQL](https://www.postgresql.org/docs/current/release-18.html?utm_source=chatgpt.com)) | Berguna untuk distributed ID yang lebih index-friendly dibanding UUID random murni |
| 10. Query shape | Point lookup, range lookup, filtered list | Biasakan desain query dari access pattern: by id, by tenant, by status, by created_at | OLTP butuh query kecil, stabil, dan predictable |
| 11. Mutation pattern | INSERT, UPDATE, DELETE, UPSERT, RETURNING | Gunakan mutation yang atomic dan mengembalikan state terbaru | Mengurangi race condition dan round-trip aplikasi |
| 12. Optimistic concurrency | `version`, `updated_at`, compare-and-set update | `UPDATE ... WHERE id = ? AND version = ?` lalu cek affected row | Cocok untuk edit form, approval, dan lifecycle transition |
| 13. Pessimistic concurrency | `SELECT ... FOR UPDATE`, `SKIP LOCKED` | Lock row saat claim/update harus eksklusif | Cocok untuk worker queue, task assignment, inventory reservation |
| 14. Indexing dasar | B-tree, composite, unique | B-tree adalah index utama untuk equality/range lookup OLTP | Kebanyakan query transactional harus selesai via index scan kecil |
| 15. Partial index | Index subset data | PostgreSQL mendukung partial index dengan predicate; query harus cocok dengan predicate agar index bermanfaat. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-partial.html?utm_source=chatgpt.com)) | Sangat berguna untuk `WHERE status = 'OPEN'`, active row, unpaid invoice |
| 16. Covering index | Index-only scan, `INCLUDE` | PostgreSQL bisa menjawab query dari index saja jika kolom tercakup dan visibility map memungkinkan. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-index-only-scans.html?utm_source=chatgpt.com)) | Mengurangi heap fetch untuk list screen yang sering dibuka |
| 17. JSONB usage | Flexible attributes, metadata, payload snapshot | `jsonb` mendukung operasi akses/modifikasi nested data. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html?utm_source=chatgpt.com)) | Berguna untuk metadata/audit payload, tapi jangan mengganti relational core invariant |
| 18. Range types | Periode berlaku, booking, assignment interval | Range/multirange bisa diindex dengan GiST/SP-GiST. ([PostgreSQL](https://www.postgresql.org/docs/current/rangetypes.html?utm_source=chatgpt.com)) | Cocok untuk validity period, schedule conflict, effective-dated rules |
| 19. PL/pgSQL | Function, procedure, trigger | Pindahkan logic dekat data jika harus atomic, reusable, atau enforcement-heavy | Cocok untuk audit trigger, status transition guard, batch correction |
| 20. Trigger design | Audit, validation, denormalized projection | Gunakan hati-hati; trigger kuat tapi bisa menyembunyikan side effect | Baik untuk invariant DB-level, buruk jika terlalu banyak business flow tersembunyi |
| 21. Partitioning | Time/tenant/lifecycle partition | Table partition dapat dibuat sebagai partition dari parent; index, constraint, dan trigger tertentu dari parent dapat diwariskan/di-clone ke partition. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createtable.html?utm_source=chatgpt.com)) | Berguna untuk tabel besar: audit log, event, history, transaction ledger |
| 22. Vacuum & bloat | Autovacuum, dead tuples, analyze | Vacuum membersihkan tuple lama akibat MVCC; autovacuum bisa menangani ini otomatis. ([PostgreSQL](https://www.postgresql.org/docs/current/glossary.html?utm_source=chatgpt.com)) | OLTP update-heavy mudah bloat jika autovacuum tidak sehat |
| 23. Statistics | Planner stats, analyze, pg statistics | Statistik outdated bisa membuat query kecil berubah jadi scan besar | Critical untuk latency stabil |
| 24. Monitoring | `pg_stat_activity`, `pg_stat_statements`, wait event | PostgreSQL menyediakan cumulative statistics untuk aktivitas backend, vacuum worker, replication worker, dan lainnya. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html?utm_source=chatgpt.com)) | Membantu triage lock, slow query, blocking session, idle transaction |
| 25. Runtime statistics config | I/O timing, WAL timing, progress view | Statistik runtime seperti I/O wait dapat ditampilkan di `pg_stat_*`, `EXPLAIN`, `VACUUM`, dan `pg_stat_statements` jika konfigurasi relevan aktif. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-statistics.html?utm_source=chatgpt.com)) | Berguna saat debugging bottleneck disk/WAL |
| 26. WAL & durability | Write-ahead log, checkpoint, crash recovery | WAL mencatat perubahan data dan dipakai untuk crash safety serta recovery. ([PostgreSQL](https://www.postgresql.org/docs/current/continuous-archiving.html?utm_source=chatgpt.com)) | Fondasi durability; penting untuk memahami latency commit dan recovery |
| 27. Backup & PITR | Base backup + WAL archive | Kombinasi base backup dan WAL archive memungkinkan point-in-time recovery. ([PostgreSQL](https://www.postgresql.org/docs/current/continuous-archiving.html?utm_source=chatgpt.com)) | OLTP production wajib punya recovery objective yang diuji |
| 28. Replication | Streaming, hot standby, logical replication | Hot standby memungkinkan query read-only saat server standby/recovery. ([PostgreSQL](https://www.postgresql.org/docs/current/hot-standby.html?utm_source=chatgpt.com)) | Untuk HA, read scaling terbatas, dan DR |
| 29. Logical replication / CDC | Publication, subscription, slot | Logical replication mengirim stream perubahan data berbasis WAL pada level tabel. ([PostgreSQL](https://www.postgresql.org/docs/current/different-replication-solutions.html?utm_source=chatgpt.com)) | Cocok untuk outbox, CDC, integrasi Kafka, migration, read model |
| 30. Connection management | Pooling, timeout, transaction lifetime | Kontrol jumlah koneksi, durasi transaksi, dan idle-in-transaction | Tanpa ini, service Java bisa menghabiskan backend connection dan menahan vacuum |
| 31. Security | Role, schema privilege, least privilege, RLS | Pisahkan owner, migrator, runtime user, read-only user | Menurunkan blast radius jika service compromised |
| 32. Migration safety | Expand-contract, backfill, concurrent index | Hindari breaking DDL langsung di production | Penting saat microservice dan DB schema evolve bersama |
| 33. Java/MyBatis integration | Mapper design, transaction boundary, SQL state retry | Pahami kapan transaction dimulai/commit/rollback, bagaimana retry serialization/deadlock | Menghubungkan correctness DB dengan service-layer behavior |
| 34. Operational readiness | Runbook, SLO, alert, capacity, incident query | Siapkan query untuk lock, bloat, replication lag, connection saturation | Senior engineer perlu bisa diagnose production, bukan hanya menulis SQL |

---

## Roadmap Alur Belajar yang Direkomendasikan

### Phase 1 - Core OLTP foundation

Mulai dari **transaction model, MVCC, isolation level, locking, dan constraint**. Targetnya: bisa menjawab pertanyaan “apakah invariant bisnis ini benar-benar aman saat concurrent request masuk bersamaan?”

### Phase 2 - Schema & access-pattern design

Lanjut ke **relational modelling, data type, key design, query shape, mutation pattern, optimistic/pessimistic concurrency**. Targetnya: setiap tabel dan index punya alasan berdasarkan use case nyata.

### Phase 3 - Indexing & query performance

Masuk ke **B-tree, composite index, partial index, covering index, EXPLAIN, pg_stat_statements, slow-query triage**. Targetnya: bisa membedakan query lambat karena index salah, statistik buruk, lock, bloat, atau workload spike.

### Phase 4 - Write-heavy production behavior

Pelajari **vacuum, autovacuum, bloat, WAL, checkpoint, transaction lifetime, connection pool, timeout**. Targetnya: paham kenapa OLTP production bisa melambat walaupun query terlihat sederhana.

### Phase 5 - Reliability & integration

Akhiri dengan **backup/PITR, replication, logical replication/CDC, outbox pattern, migration safety, Java/MyBatis transaction integration**. Targetnya: bisa mendesain PostgreSQL sebagai bagian dari platform microservice yang recoverable, observable, dan evolvable.

---

## Rekomendasi materi selanjutnya

Materi paling tepat berikutnya:

**Cheatsheet PostgreSQL OLTP Seri 1 - Transaction Boundary, MVCC, Isolation Level, Locking, Deadlock, dan Retry Pattern untuk Java/Jersey/MyBatis Microservice.**

---

**Sources:**

- [PostgreSQL 18.4 Documentation](https://www.postgresql.org/docs/current/index.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 7:42:39 PM

Saya rekomendasikan **22 seri** untuk PostgreSQL OLTP agar cakupannya practical, production-grade, dan tidak terlalu melebar ke OLAP.

| Seri | Topik |
|---:|---|
| 1 | Transaction Boundary, ACID, MVCC, Isolation Level |
| 2 | Locking, Deadlock, Retry, Timeout, `SELECT FOR UPDATE`, `SKIP LOCKED` |
| 3 | Relational Domain Modelling untuk OLTP |
| 4 | Constraint Design: PK, FK, UNIQUE, CHECK, EXCLUDE |
| 5 | PostgreSQL Data Types untuk Transactional System |
| 6 | Key Design: `bigserial`, identity, UUID, UUIDv7, natural key, surrogate key |
| 7 | Query Shape & Mutation Pattern: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `UPSERT`, `RETURNING` |
| 8 | Optimistic & Pessimistic Concurrency Control |
| 9 | Indexing for OLTP: B-tree, Composite, Partial, Covering, Expression, GIN/BRIN |
| 10 | Pagination, Sorting, Filtering, Search Screen Pattern |
| 11 | PL/pgSQL for OLTP: Function, Procedure, Trigger |
| 12 | Audit Trail, History Table, Temporal Validity, Lifecycle State Tracking |
| 13 | Queue Table, Worker Claiming, Reservation, Idempotency, Outbox |
| 14 | Partitioning for OLTP: Time, Tenant, Lifecycle, Archival |
| 15 | Vacuum, Autovacuum, Bloat, Analyze, Statistics |
| 16 | Performance Diagnostics: `EXPLAIN`, `pg_stat_statements`, Locks, Wait Events |
| 17 | Connection Pooling, Session Settings, Timeout, Prepared Statement Behavior |
| 18 | WAL, Checkpoint, Backup, PITR, Recovery |
| 19 | Replication, Read Replica, Logical Replication, CDC |
| 20 | Security, Role Design, Schema Privilege, RLS, Auditability |
| 21 | Schema Migration Safety: Liquibase/Flyway, Expand-Contract, Zero/Low-Downtime DDL |
| 22 | Java/Jersey/MyBatis Integration Pattern for PostgreSQL OLTP |

Rekomendasi mulai dari **Seri 1**, karena transaksi, MVCC, isolation, dan locking adalah fondasi utama untuk memahami semua problem OLTP berikutnya.

## Response:
7/15/2026, 7:56:01 PM

Saya mulai dari **Seri 1/22** karena ini fondasi semua keputusan OLTP: batas transaksi, MVCC, isolation level, dan pola implementasi di service Java/MyBatis. Fokusnya saya buat praktis: kapan dipakai, SQL/Java pattern, failure mode, dan checklist production.

# PostgreSQL OLTP - Seri 1/22  
## Transaction Boundary, ACID, MVCC, Isolation Level, dan Practical Transaction Pattern

Baseline versi: dokumentasi resmi PostgreSQL saat ini menunjukkan **PostgreSQL 18 sebagai current**, PostgreSQL 14-18 sebagai supported versions, dan PostgreSQL 19 masih development/beta. Jadi seri ini saya rujuk ke PostgreSQL 18/current, bukan PostgreSQL 19 production. ([PostgreSQL](https://www.postgresql.org/docs/current/mvcc-serialization-failure-handling.html))

---

## 1. Tujuan Seri Ini

Seri ini menjawab pertanyaan praktis:

> Di aplikasi Java/Jersey/MyBatis, kapan sebuah operasi harus berada dalam satu transaksi PostgreSQL, bagaimana memilih isolation level, bagaimana menghindari race condition, dan bagaimana menangani failure seperti serialization failure/deadlock?

Fokusnya bukan teori database murni, tapi cara berpikir dan implementasi untuk **OLTP production system** seperti case management, approval workflow, enforcement lifecycle, payment-like ledger, task claiming, reservation, audit trail, dan service command handler.

---

## 2. Mental Model Utama

Dalam PostgreSQL, transaksi eksplisit dibuat dengan `BEGIN` atau `START TRANSACTION`, lalu ditutup dengan `COMMIT` atau `ROLLBACK`; statement SQL di luar transaksi eksplisit otomatis berjalan sebagai single-statement transaction. ([PostgreSQL](https://www.postgresql.org/docs/current/transaction-id.html))

```text
HTTP Request / Message / Job
        │
        ▼
Application Command
        │
        ▼
Transaction Boundary
        │
        ├─ validate current DB state
        ├─ mutate business state
        ├─ insert audit/outbox/idempotency record
        └─ commit atomically
```

Rule praktis:

```text
Satu transaksi = satu perubahan state bisnis yang harus atomic.
Jangan gunakan satu transaksi untuk seluruh workflow panjang.
```

Contoh benar:

```text
Submit case
Approve case
Claim task
Reserve inventory/quota
Create payment instruction
Record decision + audit log
```

Contoh salah:

```text
Open transaction
→ call service lain
→ wait user input
→ send email
→ call external API
→ update DB
→ commit
```

PostgreSQL sendiri memperingatkan bahwa transaksi yang menunggu lock bisa menunggu tanpa batas jika tidak ada deadlock, sehingga transaksi panjang atau transaksi yang menunggu input user adalah desain buruk. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html))

---

## 3. Diagram Praktis Transaction Boundary

```text
Jersey Resource
│
├─ parse request
├─ authn/authz
├─ request validation ringan
│
└─ Service Command Handler
   │
   ├─ open transaction
   │  │
   │  ├─ read current row/state
   │  ├─ validate transition/invariant
   │  ├─ update business table
   │  ├─ insert audit trail
   │  ├─ insert outbox/event record
   │  └─ commit
   │
   ├─ after commit:
   │  ├─ publish async event
   │  ├─ call external system
   │  └─ build response
   │
   └─ on failure:
      ├─ rollback
      ├─ map SQLSTATE/business conflict
      └─ retry only when safe
```

---

## 4. ACID dalam Bahasa Implementasi

| ACID | Makna praktis | Contoh OLTP |
|---|---|---|
| Atomicity | Semua berhasil atau semua batal | Status case berubah + audit tercatat dalam satu transaksi |
| Consistency | Constraint dan invariant tetap valid | Tidak bisa approve case yang belum submitted |
| Isolation | Transaksi concurrent tidak saling merusak state | Dua officer tidak bisa claim task yang sama |
| Durability | Setelah commit, perubahan survive crash sesuai konfigurasi durability | Decision final tetap ada setelah restart DB |

Untuk senior engineer, ACID bukan sekadar definisi. Yang penting adalah: **business invariant mana yang harus dijaga oleh transaksi dan constraint database, bukan hanya oleh service code.**

---

## 5. MVCC: Kenapa Reader Tidak Selalu Memblok Writer

PostgreSQL memakai **MVCC / Multi-Version Concurrency Control**. Keunggulan utamanya: lock untuk membaca data tidak conflict dengan lock untuk menulis data; secara umum read tidak memblok write dan write tidak memblok read. PostgreSQL mempertahankan karakteristik ini bahkan untuk Serializable isolation melalui Serializable Snapshot Isolation. ([PostgreSQL](https://www.postgresql.org/docs/current/mvcc-intro.html?utm_source=chatgpt.com))

Mental model:

```text
Row logical: case_id = C-001
│
├─ version lama terlihat oleh transaksi yang mulai lebih awal
└─ version baru terlihat oleh transaksi setelah commit
```

Implikasi praktis:

| Situasi | Dampak |
|---|---|
| Banyak `SELECT` biasa | Umumnya tidak mengunci row untuk writer |
| Banyak `UPDATE` pada row sama | Tetap akan saling menunggu karena writer conflict |
| Transaksi terlalu lama | Snapshot lama tertahan, vacuum/bloat bisa terdampak |
| Read lalu update tanpa guard | Bisa lost update jika tidak pakai lock/version/status condition |

---

## 6. Isolation Level: Kapan Pakai Apa

PostgreSQL mendukung isolation level seperti `Read Committed`, `Repeatable Read`, dan `Serializable`. Pada Serializable, PostgreSQL dapat membatalkan salah satu transaksi jika tidak ada serial order yang valid; aplikasi harus retry transaksi yang gagal karena serialization anomaly. ([PostgreSQL](https://www.postgresql.org/docs/current/transaction-iso.html))

| Isolation level | Kapan cocok | Risiko / catatan |
|---|---|---|
| `READ COMMITTED` | Default untuk mayoritas OLTP command pendek | Setiap statement melihat snapshot terbaru yang sudah committed |
| `REPEATABLE READ` | Report kecil dalam satu transaksi, proses yang butuh snapshot stabil | Bisa terkena serialization-like failure pada konflik tertentu |
| `SERIALIZABLE` | Invariant kompleks lintas row/table yang sulit dikunci manual | Wajib punya retry transaction karena bisa SQLSTATE `40001` |
| Explicit row lock | Saat update harus eksklusif terhadap row tertentu | Bisa blocking/deadlock kalau order lock tidak konsisten |

Practical recommendation:

```text
Default: READ COMMITTED + constraint + optimistic/pessimistic guard.
Naik ke SERIALIZABLE hanya untuk invariant yang memang sulit diamankan manual.
```

---

## 7. Praktik 1 - Basic Transaction di PostgreSQL

```sql
BEGIN;

UPDATE regulatory_case
SET status = 'SUBMITTED',
    updated_at = clock_timestamp(),
    version = version + 1
WHERE case_id = '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1001'
  AND status = 'DRAFT';

INSERT INTO case_status_audit (
    case_id,
    from_status,
    to_status,
    action_by,
    action_at
)
VALUES (
    '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1001',
    'DRAFT',
    'SUBMITTED',
    'user-123',
    clock_timestamp()
);

COMMIT;
```

Kalau insert audit gagal, update status juga harus batal. Itu sebabnya keduanya berada di satu transaksi.

---

## 8. Practical Schema untuk Contoh Seri Ini

Contoh domain: **regulatory case lifecycle**.

```sql
CREATE TYPE case_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'APPROVED',
    'REJECTED',
    'CLOSED'
);

CREATE TABLE regulatory_case (
    case_id        uuid PRIMARY KEY,
    tenant_id      bigint NOT NULL,
    case_number    text NOT NULL,
    status         case_status NOT NULL,
    title          text NOT NULL,
    version        bigint NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT clock_timestamp(),
    updated_at     timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT uq_regulatory_case_tenant_number
        UNIQUE (tenant_id, case_number),

    CONSTRAINT chk_case_number_not_blank
        CHECK (length(trim(case_number)) > 0)
);

CREATE TABLE case_status_audit (
    audit_id     bigserial PRIMARY KEY,
    case_id      uuid NOT NULL REFERENCES regulatory_case(case_id),
    from_status  case_status,
    to_status    case_status NOT NULL,
    action        text NOT NULL,
    action_by     text NOT NULL,
    action_at     timestamptz NOT NULL DEFAULT clock_timestamp(),
    reason        text
);
```

Catatan praktis: enum PostgreSQL nyaman untuk status stabil, tapi untuk status yang sering berubah lintas release, lookup table bisa lebih aman secara migration. Detail ini cocok dibahas di seri data type dan migration.

---

## 9. Praktik 2 - Atomic State Transition dengan Guard Condition

Jangan lakukan ini:

```sql
SELECT status FROM regulatory_case WHERE case_id = :caseId;

-- aplikasi cek status
-- lalu aplikasi update
UPDATE regulatory_case SET status = 'UNDER_REVIEW' WHERE case_id = :caseId;
```

Problem: di antara `SELECT` dan `UPDATE`, transaksi lain bisa mengubah status.

Lebih aman:

```sql
UPDATE regulatory_case
SET status = 'UNDER_REVIEW',
    version = version + 1,
    updated_at = clock_timestamp()
WHERE case_id = :caseId
  AND status = 'SUBMITTED'
RETURNING case_id, status, version;
```

Interpretasi hasil:

| Result | Makna |
|---|---|
| 1 row returned | Transition sukses |
| 0 row returned | Case tidak ditemukan atau status tidak valid |
| Exception constraint | Ada invariant database yang dilanggar |

Ini pattern penting untuk OLTP:

```text
State transition = UPDATE dengan expected current state di WHERE clause.
```

---

## 10. Praktik 3 - Optimistic Locking

Gunakan saat banyak user bisa membaca data yang sama, tapi conflict update relatif jarang.

```sql
UPDATE regulatory_case
SET title = :newTitle,
    version = version + 1,
    updated_at = clock_timestamp()
WHERE case_id = :caseId
  AND version = :expectedVersion
RETURNING case_id, version;
```

Jika hasil `0 row`, berarti data sudah diubah transaksi lain.

Mapping ke HTTP/Jersey:

| DB result | HTTP response |
|---|---|
| updated 1 row | `200 OK` |
| updated 0 row karena version mismatch | `409 Conflict` |
| invalid input | `400 Bad Request` |
| unauthorized | `403 Forbidden` |
| unexpected SQL exception | `500 Internal Server Error` |

Optimistic locking cocok untuk:

```text
edit metadata
update form
change assignment note
approve berdasarkan version yang user lihat
```

Kurang cocok untuk:

```text
worker queue claim
inventory reservation tinggi
single counter hotspot
task yang harus eksklusif sekarang juga
```

---

## 11. Praktik 4 - Pessimistic Locking dengan `SELECT ... FOR UPDATE`

PostgreSQL row-level lock tidak memblok pembacaan biasa; ia memblok writer/locker lain terhadap row yang sama, dan lock dilepas saat transaksi berakhir. `SELECT ... FOR UPDATE` mengunci row yang dibaca sehingga transaksi lain yang ingin update/delete/lock row yang sama harus menunggu. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html))

Contoh: officer ingin mengambil satu case untuk review.

```sql
BEGIN;

SELECT case_id, status, version
FROM regulatory_case
WHERE case_id = :caseId
FOR UPDATE;

-- aplikasi validasi:
-- status harus SUBMITTED

UPDATE regulatory_case
SET status = 'UNDER_REVIEW',
    version = version + 1,
    updated_at = clock_timestamp()
WHERE case_id = :caseId;

INSERT INTO case_status_audit (
    case_id,
    from_status,
    to_status,
    action,
    action_by
)
VALUES (
    :caseId,
    'SUBMITTED',
    'UNDER_REVIEW',
    'CLAIM_FOR_REVIEW',
    :userId
);

COMMIT;
```

Gunakan `FOR UPDATE` saat:

```text
- row harus diproses eksklusif
- logic butuh baca beberapa kolom dulu sebelum update
- update berikutnya bergantung pada state yang baru saja dibaca
```

Hindari `FOR UPDATE` saat:

```text
- hanya read-only screen
- query mengambil banyak row
- transaksi bisa lama
- user interaction terjadi di dalam transaksi
```

---

## 12. Praktik 5 - MyBatis Transaction Boundary Tanpa Spring

MyBatis menyatakan `SqlSession` adalah interface utama untuk mengeksekusi command, mengambil mapper, dan mengelola transaksi. `SqlSession` dibuat dari `SqlSessionFactory`. ([MyBatis](https://mybatis.org/mybatis-3/java-api.html))

Contoh pattern manual untuk Java SE/Jersey:

```java
public final class CaseCommandService {
    private final SqlSessionFactory sqlSessionFactory;

    public CaseCommandService(SqlSessionFactory sqlSessionFactory) {
        this.sqlSessionFactory = sqlSessionFactory;
    }

    public SubmitCaseResult submitCase(SubmitCaseCommand command) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            CaseMapper caseMapper = session.getMapper(CaseMapper.class);
            CaseAuditMapper auditMapper = session.getMapper(CaseAuditMapper.class);

            CaseRow updated = caseMapper.submitCase(
                command.caseId(),
                command.expectedStatus(),
                command.actor()
            );

            if (updated == null) {
                session.rollback();
                throw new BusinessConflictException(
                    "Case is not in a submit-able state or does not exist"
                );
            }

            auditMapper.insertStatusAudit(
                command.caseId(),
                "DRAFT",
                "SUBMITTED",
                "SUBMIT_CASE",
                command.actor(),
                command.reason()
            );

            session.commit();

            return new SubmitCaseResult(
                updated.caseId(),
                updated.status(),
                updated.version()
            );
        } catch (BusinessConflictException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new PersistenceCommandException("Failed to submit case", e);
        }
    }
}
```

Mapper XML:

```xml
<update id="submitCase" resultType="com.example.CaseRow">
  UPDATE regulatory_case
  SET status = 'SUBMITTED',
      version = version + 1,
      updated_at = clock_timestamp()
  WHERE case_id = #{caseId}
    AND status = #{expectedStatus}
  RETURNING case_id, status, version
</update>
```

Catatan penting:

```text
openSession(false) = jangan auto-commit.
Commit hanya setelah semua mutation dalam command berhasil.
Rollback eksplisit untuk business conflict sebelum keluar dari method.
```

---

## 13. Praktik 6 - Retry Transaction untuk SQLSTATE Tertentu

PostgreSQL mendokumentasikan bahwa `serialization_failure` selalu memakai SQLSTATE `40001`, deadlock memakai SQLSTATE `40P01`, dan retry harus mengulang **seluruh transaksi**, termasuk logic yang menentukan SQL/value yang digunakan. PostgreSQL tidak menyediakan automatic retry karena database tidak bisa menjamin correctness logic aplikasi. ([PostgreSQL](https://www.postgresql.org/docs/current/mvcc-serialization-failure-handling.html))

Retry wrapper praktis:

```java
public final class TransactionRetrier {
    private static final Set<String> RETRYABLE_SQL_STATES = Set.of(
        "40001", // serialization_failure
        "40P01"  // deadlock_detected
    );

    public <T> T runWithRetry(Supplier<T> operation) {
        int maxAttempts = 3;
        RuntimeException lastFailure = null;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return operation.get();
            } catch (RuntimeException e) {
                if (!isRetryable(e) || attempt == maxAttempts) {
                    throw e;
                }

                lastFailure = e;
                sleepBackoff(attempt);
            }
        }

        throw lastFailure;
    }

    private boolean isRetryable(Throwable throwable) {
        Throwable current = throwable;

        while (current != null) {
            if (current instanceof java.sql.SQLException sqlException) {
                return RETRYABLE_SQL_STATES.contains(sqlException.getSQLState());
            }
            current = current.getCause();
        }

        return false;
    }

    private void sleepBackoff(int attempt) {
        try {
            long delayMs = 25L * attempt * attempt;
            Thread.sleep(delayMs);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted during transaction retry backoff", e);
        }
    }
}
```

Cara pakai:

```java
SubmitCaseResult result = transactionRetrier.runWithRetry(
    () -> caseCommandService.submitCase(command)
);
```

Rule penting:

```text
Retry hanya aman jika command idempotent atau seluruh efek eksternal terjadi setelah commit.
```

Jangan retry command yang sudah mengirim email, publish Kafka, atau call external API di tengah transaksi.

---

## 14. Praktik 7 - Idempotency Key untuk Command dari HTTP/API

Untuk endpoint seperti `POST /cases/{id}/submit`, client bisa retry karena timeout. Tanpa idempotency, operasi bisa dobel.

Tambahkan table:

```sql
CREATE TABLE idempotency_request (
    tenant_id       bigint NOT NULL,
    idempotency_key text NOT NULL,
    command_name    text NOT NULL,
    request_hash    text NOT NULL,
    response_code   integer,
    response_body   jsonb,
    status          text NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT clock_timestamp(),
    completed_at    timestamptz,

    PRIMARY KEY (tenant_id, idempotency_key)
);
```

Pattern transaksi:

```sql
INSERT INTO idempotency_request (
    tenant_id,
    idempotency_key,
    command_name,
    request_hash,
    status
)
VALUES (
    :tenantId,
    :idempotencyKey,
    'SUBMIT_CASE',
    :requestHash,
    'PROCESSING'
)
ON CONFLICT (tenant_id, idempotency_key)
DO NOTHING;
```

Jika insert menghasilkan 1 row:

```text
Request pertama → lanjut proses command.
```

Jika insert menghasilkan 0 row:

```text
Request duplicate → baca record sebelumnya.
Jika completed → return response yang sama.
Jika processing → return 409/425/202 tergantung desain API.
```

Ini akan dibahas lebih dalam di seri idempotency/outbox, tapi fondasinya tetap transaksi.

---

## 15. Praktik 8 - Deadlock Prevention

PostgreSQL bisa mendeteksi deadlock dan membatalkan salah satu transaksi; transaksi yang menjadi korban tidak boleh diasumsikan predictable. Cara terbaik menghindari deadlock adalah memastikan semua aplikasi mengambil lock pada banyak object dengan urutan konsisten. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html))

Buruk:

```text
Transaction A:
1. lock case A
2. lock case B

Transaction B:
1. lock case B
2. lock case A
```

Lebih aman:

```text
Selalu lock berdasarkan urutan deterministic:
ORDER BY case_id ASC
```

Contoh SQL:

```sql
SELECT case_id
FROM regulatory_case
WHERE case_id = ANY(:caseIds)
ORDER BY case_id ASC
FOR UPDATE;
```

Checklist deadlock prevention:

| Rule | Penjelasan |
|---|---|
| Lock dengan urutan konsisten | Misalnya selalu by `tenant_id`, lalu `case_id` ascending |
| Ambil lock paling spesifik | Row lock lebih baik daripada table lock |
| Jangan lock row terlalu banyak | Batch besar pecah menjadi chunk |
| Jangan call external API di dalam transaksi | Membuat lock tertahan lama |
| Pasang timeout | Hindari thread aplikasi menggantung terlalu lama |
| Retry SQLSTATE `40P01` | Tapi tetap perbaiki root cause deadlock |

---

## 16. Practical Transaction Decision Table

| Use case | Pattern yang disarankan |
|---|---|
| Submit case dari `DRAFT` ke `SUBMITTED` | Atomic `UPDATE ... WHERE status = 'DRAFT' RETURNING` |
| User edit case metadata | Optimistic locking dengan `version` |
| Officer claim task | `SELECT ... FOR UPDATE` atau atomic update dengan `WHERE assignee IS NULL` |
| Worker ambil job | `FOR UPDATE SKIP LOCKED`, dibahas lebih dalam di seri queue |
| Cek invariant lintas banyak row | Constraint jika bisa; jika tidak, explicit lock atau `SERIALIZABLE` |
| Request API bisa retry | Idempotency key dalam transaksi |
| Publish event setelah state berubah | Outbox record dalam transaksi, publish setelah commit |
| Update counter tinggi | Hindari hot row; gunakan aggregation/event pattern |
| Workflow panjang | Pecah menjadi beberapa transaksi kecil per state transition |
| External API call | Setelah commit atau via outbox/saga |

---

## 17. Anti-Pattern yang Sering Terjadi

### Anti-pattern 1 - Transaksi terlalu panjang

```text
BEGIN
→ update row
→ call external API 5 detik
→ insert audit
→ COMMIT
```

Risiko:

```text
lock tertahan
connection pool habis
deadlock meningkat
latency naik
vacuum terdampak
```

Lebih baik:

```text
BEGIN
→ update state
→ insert outbox
→ COMMIT
→ async worker call external API
```

---

### Anti-pattern 2 - Read then update tanpa guard

```sql
SELECT status FROM regulatory_case WHERE case_id = :caseId;

UPDATE regulatory_case
SET status = 'APPROVED'
WHERE case_id = :caseId;
```

Lebih aman:

```sql
UPDATE regulatory_case
SET status = 'APPROVED',
    version = version + 1
WHERE case_id = :caseId
  AND status = 'UNDER_REVIEW'
RETURNING case_id, status, version;
```

---

### Anti-pattern 3 - Mengandalkan application validation saja

Buruk:

```text
Service memastikan case_number unique dengan SELECT dulu.
```

Lebih aman:

```sql
CONSTRAINT uq_regulatory_case_tenant_number
    UNIQUE (tenant_id, case_number)
```

Lalu aplikasi menangani unique violation sebagai conflict.

---

### Anti-pattern 4 - Retry hanya SQL statement, bukan transaksi penuh

PostgreSQL menekankan bahwa retry harus mengulang transaksi lengkap, bukan hanya statement terakhir. ([PostgreSQL](https://www.postgresql.org/docs/current/mvcc-serialization-failure-handling.html))

Buruk:

```text
INSERT audit gagal serialization
→ retry insert audit saja
```

Benar:

```text
Retry seluruh command:
read/decide/update/audit/outbox/commit
```

---

## 18. Production Checklist

Gunakan checklist ini saat review code OLTP:

| Checklist | Pertanyaan review |
|---|---|
| Transaction boundary jelas | Apakah satu command = satu transaksi pendek? |
| No external call inside transaction | Ada HTTP/gRPC/Kafka/email di dalam transaksi? |
| Guard condition | Apakah update memakai expected state/version? |
| Constraint | Apakah invariant penting dijaga DB? |
| Retry policy | Apakah SQLSTATE `40001` dan `40P01` ditangani? |
| Idempotency | Apakah POST command aman saat client retry? |
| Lock ordering | Jika lock banyak row, apakah urutannya deterministic? |
| Timeout | Apakah ada `statement_timeout`, `lock_timeout`, atau app timeout? |
| Error mapping | Conflict DB dipetakan ke `409`, bukan selalu `500`? |
| Audit consistency | Apakah audit ikut commit bersama state change? |

---

## 19. Mini Lab untuk Onboarding

Coba jalankan dua session PostgreSQL.

Session A:

```sql
BEGIN;

UPDATE regulatory_case
SET title = 'Changed by A'
WHERE case_id = '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1001';

-- Jangan commit dulu
```

Session B:

```sql
BEGIN;

UPDATE regulatory_case
SET title = 'Changed by B'
WHERE case_id = '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1001';
```

Yang akan terlihat:

```text
Session B menunggu Session A selesai karena update row yang sama conflict.
```

Lalu di Session A:

```sql
COMMIT;
```

Session B akan lanjut, tergantung kondisi dan isolation level.

Tujuan lab:

```text
Merasakan langsung bahwa MVCC tidak berarti writer bebas conflict.
MVCC membantu read/write concurrency, tapi update row yang sama tetap harus dikontrol.
```

---

## 20. Ringkasan Praktis

```text
1. OLTP correctness dimulai dari batas transaksi.
2. Transaksi harus pendek, atomic, dan tidak menunggu external system/user.
3. Untuk state transition, gunakan UPDATE dengan expected state di WHERE.
4. Untuk edit concurrent, gunakan optimistic locking dengan version.
5. Untuk exclusive processing, gunakan row lock atau atomic claim pattern.
6. Retry hanya untuk error transient seperti 40001/40P01, dan retry seluruh transaksi.
7. Semua efek eksternal harus terjadi setelah commit atau melalui outbox.
8. Constraint database adalah safety net utama untuk invariant penting.
```

---

# Status Seri

**Seri 1/22 selesai.**

Rekomendasi lanjut ke:

**Seri 2 - Locking, Deadlock, Retry, Timeout, `SELECT FOR UPDATE`, `FOR NO KEY UPDATE`, `SKIP LOCKED`, Advisory Lock, dan Lock Inspection untuk PostgreSQL OLTP.**

---

**Sources:**

- [PostgreSQL: Documentation: 18: 13.5. Serialization Failure Handling](https://www.postgresql.org/docs/current/mvcc-serialization-failure-handling.html)
- [MyBatis 3 | Java API – mybatis](https://mybatis.org/mybatis-3/java-api.html)

## Response:
7/15/2026, 7:59:23 PM

Saya lanjut ke **Seri 2/22**. Fokus seri ini lebih operasional-praktis: jenis lock, kapan memakai `FOR UPDATE` vs `FOR NO KEY UPDATE`, `SKIP LOCKED`, advisory lock, timeout, retry, dan cara inspeksi blocking di production.

# PostgreSQL OLTP - Seri 2/22  
## Locking, Deadlock, Retry, Timeout, `FOR UPDATE`, `SKIP LOCKED`, Advisory Lock, dan Lock Inspection

Seri ini fokus pada **kontrol concurrency praktis**. Di OLTP, masalah utama bukan hanya “query cepat”, tapi:

```text
Apakah dua transaksi concurrent bisa menghasilkan state yang salah?
Apakah request bisa menggantung karena lock?
Apakah worker bisa double-process job?
Apakah deadlock dipahami dan ditangani?
Apakah engineer bisa melihat siapa memblok siapa di production?
```

PostgreSQL menyediakan table-level lock, row-level lock, dan advisory lock. Dokumentasi current PostgreSQL 18 menyebut bahwa explicit lock digunakan saat MVCC saja tidak cukup untuk perilaku concurrency yang diinginkan. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html))

---

## 1. Mental Model Locking

```text
MVCC
│
├─ SELECT biasa
│  └─ umumnya tidak memblok writer
│
├─ UPDATE / DELETE
│  └─ conflict dengan writer/locker lain pada row yang sama
│
├─ SELECT ... FOR UPDATE
│  └─ membaca sambil mengunci row untuk mutation berikutnya
│
├─ SKIP LOCKED
│  └─ skip row yang sedang dikunci, cocok untuk queue worker
│
└─ Advisory lock
   └─ lock buatan aplikasi, bukan lock otomatis berbasis row/table
```

Row-level lock di PostgreSQL tidak memblok query pembacaan biasa; ia memblok writer atau locker lain terhadap row yang sama, dan lock dilepas saat transaksi selesai. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html))

---

## 2. Diagram Praktis

```text
Concurrent OLTP Command
│
├─ Case A: update satu row by id
│  └─ atomic UPDATE ... WHERE expected_state RETURNING
│
├─ Case B: baca dulu lalu update
│  └─ SELECT ... FOR UPDATE
│
├─ Case C: banyak worker ambil task
│  └─ FOR UPDATE SKIP LOCKED
│
├─ Case D: tidak mau menunggu lock
│  └─ NOWAIT atau lock_timeout
│
├─ Case E: resource tidak punya row natural
│  └─ pg_advisory_xact_lock / pg_try_advisory_xact_lock
│
└─ Case F: production incident
   └─ pg_stat_activity + pg_locks + pg_blocking_pids
```

---

## 3. Jenis Lock yang Perlu Dikenal

| Jenis | Dipakai oleh | Kapan relevan |
|---|---|---|
| Table-level lock | `SELECT`, `INSERT`, `UPDATE`, `DELETE`, DDL, `LOCK TABLE` | DDL, migration, `CREATE INDEX`, `ALTER TABLE`, blocking besar |
| Row-level lock | `UPDATE`, `DELETE`, `SELECT ... FOR UPDATE` | Claim task, update status, reservation, state transition |
| Advisory lock | `pg_advisory_*` functions | Lock resource aplikasi yang tidak cocok direpresentasikan sebagai row |
| Predicate lock | Serializable isolation | Deteksi anomaly serializable; tidak sama dengan row lock biasa |

`SELECT` biasa mengambil `ACCESS SHARE` lock pada table, dan hanya `ACCESS EXCLUSIVE` lock yang memblok `SELECT` biasa. Sebaliknya, `UPDATE`, `DELETE`, `INSERT`, dan `MERGE` mengambil `ROW EXCLUSIVE` lock pada table target. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html))

---

## 4. Row Lock Mode: Kapan Pakai Apa

| Lock clause | Makna praktis | Kapan dipakai |
|---|---|---|
| `FOR UPDATE` | Lock kuat untuk row yang akan diubah/dihapus atau diklaim eksklusif | Claim task, transfer ownership, approve final decision |
| `FOR NO KEY UPDATE` | Mirip `FOR UPDATE`, tapi lebih lemah; tidak memblok `FOR KEY SHARE` | Update non-key column, status, metadata |
| `FOR SHARE` | Shared lock; mencegah update/delete tertentu oleh transaksi lain | Jarang untuk service command, kadang untuk validasi parent row |
| `FOR KEY SHARE` | Lock paling lemah terkait key/FK | Validasi row parent agar key tidak berubah/hilang |

`FOR UPDATE` mencegah row yang dipilih dikunci, diubah, atau dihapus transaksi lain sampai transaksi saat ini selesai. `FOR NO KEY UPDATE` lebih lemah dan tidak memblok `SELECT FOR KEY SHARE`; update biasa yang tidak mengubah key tertentu juga mengambil mode ini. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html))

---

## 5. Pattern 1 - Atomic Update Tanpa Explicit `SELECT FOR UPDATE`

Untuk banyak state transition, **tidak perlu `SELECT FOR UPDATE`**. Cukup gunakan `UPDATE` dengan guard condition.

```sql
UPDATE regulatory_case
SET status = 'UNDER_REVIEW',
    reviewer_id = :reviewerId,
    version = version + 1,
    updated_at = clock_timestamp()
WHERE case_id = :caseId
  AND status = 'SUBMITTED'
  AND reviewer_id IS NULL
RETURNING case_id, status, reviewer_id, version;
```

Interpretasi:

| Result | Makna |
|---|---|
| 1 row | Claim berhasil |
| 0 row | Sudah diklaim, status tidak valid, atau case tidak ada |
| Exception | Ada constraint/DB error |

Ini pattern utama untuk OLTP karena singkat, atomic, dan tidak menahan lock lebih lama dari perlu.

---

## 6. Pattern 2 - `SELECT ... FOR UPDATE` Saat Logic Butuh Baca Dulu

Gunakan `FOR UPDATE` kalau aplikasi harus membaca state lengkap, mengevaluasi beberapa invariant, lalu melakukan beberapa mutation.

```sql
BEGIN;

SELECT case_id, status, reviewer_id, version
FROM regulatory_case
WHERE case_id = :caseId
FOR UPDATE;

-- application logic:
-- - status harus SUBMITTED
-- - reviewer_id harus null
-- - actor harus punya role tertentu
-- - tenant harus cocok

UPDATE regulatory_case
SET status = 'UNDER_REVIEW',
    reviewer_id = :reviewerId,
    version = version + 1,
    updated_at = clock_timestamp()
WHERE case_id = :caseId;

INSERT INTO case_status_audit (
    case_id,
    action,
    from_status,
    to_status,
    action_by,
    action_at
)
VALUES (
    :caseId,
    'CLAIM_REVIEW',
    'SUBMITTED',
    'UNDER_REVIEW',
    :reviewerId,
    clock_timestamp()
);

COMMIT;
```

Rule praktis:

```text
Kalau bisa diselesaikan dengan satu UPDATE ... WHERE ... RETURNING, pilih itu.
Kalau harus baca banyak state dan mutate beberapa object, gunakan FOR UPDATE.
```

---

## 7. Pattern 3 - `FOR NO KEY UPDATE` untuk Update Non-Key

Kalau aplikasi hanya ingin mencegah update concurrent terhadap row yang sama, tapi tidak perlu lock sekuat `FOR UPDATE`, gunakan `FOR NO KEY UPDATE`.

```sql
BEGIN;

SELECT case_id, title, version
FROM regulatory_case
WHERE case_id = :caseId
FOR NO KEY UPDATE;

UPDATE regulatory_case
SET title = :newTitle,
    version = version + 1,
    updated_at = clock_timestamp()
WHERE case_id = :caseId;

COMMIT;
```

`FOR NO KEY UPDATE` berguna untuk operasi seperti update title, note, description, metadata, atau status non-key. Ia lebih ramah terhadap operasi yang hanya membutuhkan key-share lock, misalnya validasi foreign key tertentu. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html))

---

## 8. Pattern 4 - `NOWAIT` untuk Fail-Fast

Gunakan `NOWAIT` jika user-facing command tidak boleh menggantung menunggu lock.

```sql
SELECT case_id, status, version
FROM regulatory_case
WHERE case_id = :caseId
FOR UPDATE NOWAIT;
```

Jika row sedang dikunci transaksi lain, statement gagal segera, bukan menunggu. Dokumentasi `SELECT` menyebut `NOWAIT` membuat statement melaporkan error jika row tidak bisa dikunci segera. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-select.html?utm_source=chatgpt.com))

Mapping praktis:

| Kondisi | Response |
|---|---|
| Lock tersedia | lanjut proses |
| Lock tidak tersedia | `409 Conflict` atau `423 Locked` |
| User bisa retry | tampilkan pesan “record sedang diproses” |
| Job internal | retry dengan backoff |

Contoh error handling:

```text
SQLSTATE 55P03 lock_not_available
→ jangan treat sebagai 500 murni
→ map ke conflict / retryable busy condition
```

PostgreSQL error codes stabil untuk aplikasi; dokumentasi menyarankan aplikasi mengecek SQLSTATE, bukan teks error yang bisa berubah/lokal. ([PostgreSQL](https://www.postgresql.org/docs/current/errcodes-appendix.html?utm_source=chatgpt.com))

---

## 9. Pattern 5 - `SKIP LOCKED` untuk Worker Queue

`SKIP LOCKED` cocok untuk banyak worker yang mengambil job dari table yang sama.

Schema:

```sql
CREATE TABLE ol_queue_job (
    job_id        bigserial PRIMARY KEY,
    tenant_id     bigint NOT NULL,
    job_type      text NOT NULL,
    payload       jsonb NOT NULL,
    status        text NOT NULL CHECK (status IN ('READY', 'PROCESSING', 'DONE', 'FAILED')),
    available_at  timestamptz NOT NULL DEFAULT clock_timestamp(),
    locked_by     text,
    locked_at     timestamptz,
    attempt_count integer NOT NULL DEFAULT 0,
    created_at    timestamptz NOT NULL DEFAULT clock_timestamp(),
    updated_at    timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX idx_ol_queue_ready
ON ol_queue_job (available_at, job_id)
WHERE status = 'READY';
```

Claim query:

```sql
WITH candidate AS (
    SELECT job_id
    FROM ol_queue_job
    WHERE status = 'READY'
      AND available_at <= clock_timestamp()
    ORDER BY available_at, job_id
    LIMIT :batchSize
    FOR UPDATE SKIP LOCKED
)
UPDATE ol_queue_job j
SET status = 'PROCESSING',
    locked_by = :workerId,
    locked_at = clock_timestamp(),
    attempt_count = attempt_count + 1,
    updated_at = clock_timestamp()
FROM candidate c
WHERE j.job_id = c.job_id
RETURNING j.job_id, j.tenant_id, j.job_type, j.payload, j.attempt_count;
```

Dokumentasi `SELECT` menjelaskan bahwa `SKIP LOCKED` melewati row yang tidak bisa segera dikunci. Ini menghasilkan view data yang tidak konsisten, sehingga tidak cocok untuk general-purpose query, tetapi cocok untuk pola queue dengan banyak consumer. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-select.html?utm_source=chatgpt.com))

Rule queue:

```text
SKIP LOCKED cocok untuk worker queue.
SKIP LOCKED tidak cocok untuk layar user yang butuh hasil lengkap dan konsisten.
```

---

## 10. Pattern 6 - Requeue Job yang Worker-nya Mati

Kalau worker crash setelah claim, job bisa tertahan di `PROCESSING`.

```sql
UPDATE ol_queue_job
SET status = 'READY',
    locked_by = NULL,
    locked_at = NULL,
    available_at = clock_timestamp() + interval '30 seconds',
    updated_at = clock_timestamp()
WHERE status = 'PROCESSING'
  AND locked_at < clock_timestamp() - interval '5 minutes'
RETURNING job_id;
```

Tambahkan guard:

```sql
AND attempt_count < 5
```

Untuk job yang gagal berkali-kali:

```sql
UPDATE ol_queue_job
SET status = 'FAILED',
    updated_at = clock_timestamp()
WHERE status = 'PROCESSING'
  AND attempt_count >= 5
  AND locked_at < clock_timestamp() - interval '5 minutes';
```

---

## 11. Pattern 7 - Advisory Lock untuk Resource Aplikasi

Advisory lock adalah lock dengan makna yang ditentukan aplikasi. PostgreSQL tidak memaksa semua query menghormatinya; aplikasi harus konsisten menggunakan lock tersebut. Dokumentasi juga membedakan session-level advisory lock dan transaction-level advisory lock; transaction-level advisory lock otomatis dilepas saat transaksi selesai. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html))

Gunakan advisory lock untuk resource seperti:

```text
tenant-level maintenance
single active recalculation per account
single workflow transition per business key
prevent duplicate scheduler execution
coordinate migration-like operation
```

Contoh transaction-level advisory lock:

```sql
BEGIN;

SELECT pg_advisory_xact_lock(hashtext(:tenantId || ':monthly-recalculation'));

-- only one transaction per tenant/monthly-recalculation proceeds

UPDATE tenant_recalculation
SET status = 'RUNNING',
    started_at = clock_timestamp()
WHERE tenant_id = :tenantId
  AND status = 'PENDING';

COMMIT;
```

Fail-fast variant:

```sql
SELECT pg_try_advisory_xact_lock(hashtext(:lockKey)) AS acquired;
```

Jika `acquired = false`, proses lain sedang memegang lock. PostgreSQL menyediakan fungsi `pg_advisory_xact_lock`, `pg_try_advisory_xact_lock`, shared/exclusive variants, dan session-level variants. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-admin.html?utm_source=chatgpt.com))

Rekomendasi praktis:

| Pilihan | Rekomendasi |
|---|---|
| `pg_advisory_xact_lock` | Default untuk service command pendek |
| `pg_try_advisory_xact_lock` | Untuk fail-fast / avoid waiting |
| `pg_advisory_lock` session-level | Hindari kecuali benar-benar perlu |
| Key lock | Gunakan format deterministic dan terdokumentasi |

Hati-hati dengan connection pool: session-level advisory lock bisa bocor secara konseptual jika koneksi dikembalikan ke pool tetapi lock belum dilepas. Untuk aplikasi Java/Jersey/MyBatis, transaction-level advisory lock jauh lebih aman.

---

## 12. Pattern 8 - Lock Banyak Row dengan Urutan Konsisten

Deadlock sering muncul karena dua transaksi mengunci resource yang sama dalam urutan berbeda. PostgreSQL mendeteksi deadlock dan membatalkan salah satu transaksi; dokumentasi menyebut pertahanan terbaik adalah memastikan aplikasi mengambil lock pada banyak object dalam urutan konsisten. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html))

Buruk:

```text
Transaction A: lock case 10 → lock case 20
Transaction B: lock case 20 → lock case 10
```

Lebih aman:

```sql
SELECT case_id
FROM regulatory_case
WHERE case_id = ANY(:caseIds)
ORDER BY case_id ASC
FOR UPDATE;
```

Rule:

```text
Kalau lock lebih dari satu row:
1. tentukan ordering global
2. lock semua target di awal transaksi
3. jangan campur ordering antar use case
```

---

## 13. Timeout yang Wajib Dipakai

Tanpa timeout, transaksi yang menunggu lock bisa menunggu lama. PostgreSQL sendiri menyebut transaksi yang mencari table-level atau row-level lock akan menunggu tanpa batas selama deadlock tidak terdeteksi; transaksi panjang atau menunggu input user adalah ide buruk. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html))

Gunakan `SET LOCAL` di awal transaksi:

```sql
SET LOCAL lock_timeout = '500ms';
SET LOCAL statement_timeout = '5s';
SET LOCAL idle_in_transaction_session_timeout = '10s';
```

Makna praktis:

| Setting | Fungsi |
|---|---|
| `lock_timeout` | Batalkan statement jika menunggu lock terlalu lama |
| `statement_timeout` | Batalkan statement jika total eksekusi terlalu lama |
| `idle_in_transaction_session_timeout` | Putus session yang idle dalam transaksi terlalu lama |
| `transaction_timeout` | Batasi durasi total transaksi |

Dokumentasi PostgreSQL menjelaskan `lock_timeout` hanya berlaku saat menunggu lock, sedangkan `statement_timeout` membatasi durasi statement; dokumentasi juga tidak merekomendasikan menyetel beberapa timeout ini secara global di `postgresql.conf` karena berdampak ke semua session. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-client.html?utm_source=chatgpt.com))

Pattern service:

```sql
BEGIN;

SET LOCAL lock_timeout = '500ms';
SET LOCAL statement_timeout = '5s';

-- business mutation

COMMIT;
```

---

## 14. Error Classification untuk Retry

| SQLSTATE | Condition | Treatment |
|---|---|---|
| `40001` | `serialization_failure` | Retry seluruh transaksi |
| `40P01` | `deadlock_detected` | Retry seluruh transaksi + investigasi ordering lock |
| `55P03` | `lock_not_available` | Biasanya fail-fast/retry tergantung endpoint |
| `23505` | `unique_violation` | Biasanya business conflict/idempotency, bukan blind retry |
| `23503` | `foreign_key_violation` | Bug/invariant/input issue, bukan retry biasa |

PostgreSQL mendokumentasikan error code sebagai lima karakter SQLSTATE, dan aplikasi dianjurkan mengecek kode tersebut daripada pesan teks. Untuk class transaction rollback, error yang relevan termasuk `40001 serialization_failure` dan `40P01 deadlock_detected`. ([PostgreSQL](https://www.postgresql.org/docs/current/errcodes-appendix.html?utm_source=chatgpt.com))

Retry rule:

```text
Retry seluruh transaction boundary.
Jangan retry hanya statement terakhir.
Jangan retry kalau transaksi sudah melakukan external side effect.
```

---

## 15. Java/MyBatis Practical Implementation

### 15.1 Mapper untuk timeout lokal

```xml
<update id="setLocalTimeouts">
  SET LOCAL lock_timeout = '500ms';
  SET LOCAL statement_timeout = '5s';
</update>
```

### 15.2 Mapper untuk claim case atomic

```xml
<select id="claimCase" resultType="com.example.CaseRow">
  UPDATE regulatory_case
  SET status = 'UNDER_REVIEW',
      reviewer_id = #{reviewerId},
      version = version + 1,
      updated_at = clock_timestamp()
  WHERE case_id = #{caseId}
    AND status = 'SUBMITTED'
    AND reviewer_id IS NULL
  RETURNING case_id, status, reviewer_id, version
</select>
```

### 15.3 Mapper untuk queue claim

```xml
<select id="claimJobs" resultType="com.example.JobRow">
  WITH candidate AS (
      SELECT job_id
      FROM ol_queue_job
      WHERE status = 'READY'
        AND available_at &lt;= clock_timestamp()
      ORDER BY available_at, job_id
      LIMIT #{batchSize}
      FOR UPDATE SKIP LOCKED
  )
  UPDATE ol_queue_job j
  SET status = 'PROCESSING',
      locked_by = #{workerId},
      locked_at = clock_timestamp(),
      attempt_count = attempt_count + 1,
      updated_at = clock_timestamp()
  FROM candidate c
  WHERE j.job_id = c.job_id
  RETURNING j.job_id, j.tenant_id, j.job_type, j.payload, j.attempt_count
</select>
```

### 15.4 Service transaction boundary

```java
public final class CaseClaimService {
    private final SqlSessionFactory sqlSessionFactory;

    public CaseClaimService(SqlSessionFactory sqlSessionFactory) {
        this.sqlSessionFactory = sqlSessionFactory;
    }

    public CaseRow claimCase(UUID caseId, String reviewerId) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            DbSessionMapper db = session.getMapper(DbSessionMapper.class);
            CaseMapper cases = session.getMapper(CaseMapper.class);

            db.setLocalTimeouts();

            CaseRow claimed = cases.claimCase(caseId, reviewerId);

            if (claimed == null) {
                session.rollback();
                throw new BusinessConflictException(
                    "Case is not available for review claim"
                );
            }

            session.commit();
            return claimed;
        } catch (RuntimeException e) {
            throw e;
        }
    }
}
```

Catatan: `SET LOCAL` hanya berlaku dalam transaksi saat ini, sehingga cocok untuk command-specific timeout.

---

## 16. Retry Wrapper Java

```java
public final class PostgresTransactionRetrier {
    private static final Set<String> RETRYABLE = Set.of(
        "40001", // serialization_failure
        "40P01"  // deadlock_detected
    );

    private static final Set<String> BUSY = Set.of(
        "55P03"  // lock_not_available
    );

    public <T> T run(Supplier<T> operation) {
        RuntimeException last = null;

        for (int attempt = 1; attempt <= 3; attempt++) {
            try {
                return operation.get();
            } catch (RuntimeException e) {
                String sqlState = findSqlState(e);

                if (sqlState == null) {
                    throw e;
                }

                if (RETRYABLE.contains(sqlState) && attempt < 3) {
                    last = e;
                    sleepBackoff(attempt);
                    continue;
                }

                if (BUSY.contains(sqlState)) {
                    throw new ResourceBusyException("Resource is locked", e);
                }

                throw e;
            }
        }

        throw last;
    }

    private String findSqlState(Throwable error) {
        Throwable current = error;

        while (current != null) {
            if (current instanceof java.sql.SQLException sqlException) {
                return sqlException.getSQLState();
            }
            current = current.getCause();
        }

        return null;
    }

    private void sleepBackoff(int attempt) {
        try {
            long delayMs = 25L * attempt * attempt;
            Thread.sleep(delayMs);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted during retry backoff", e);
        }
    }
}
```

Usage:

```java
CaseRow result = retrier.run(() -> caseClaimService.claimCase(caseId, reviewerId));
```

Jangan bungkus operasi yang sudah mengirim email, publish Kafka, atau call external API sebelum commit.

---

## 17. Lock Inspection di Production

### 17.1 Lihat session aktif yang sedang menunggu

```sql
SELECT
    pid,
    usename,
    application_name,
    client_addr,
    state,
    wait_event_type,
    wait_event,
    now() - xact_start AS xact_age,
    now() - query_start AS query_age,
    left(query, 500) AS query
FROM pg_stat_activity
WHERE wait_event IS NOT NULL
ORDER BY query_start;
```

Di `pg_stat_activity`, `state = active` dan `wait_event` non-null berarti query sedang dieksekusi tetapi tertahan di suatu tempat di sistem. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html?utm_source=chatgpt.com))

---

### 17.2 Cari siapa memblok siapa

```sql
SELECT
    blocked.pid AS blocked_pid,
    blocked.usename AS blocked_user,
    blocked.application_name AS blocked_app,
    blocked.state AS blocked_state,
    blocked.wait_event_type,
    blocked.wait_event,
    now() - blocked.query_start AS blocked_duration,
    left(blocked.query, 500) AS blocked_query,

    blocker.pid AS blocker_pid,
    blocker.usename AS blocker_user,
    blocker.application_name AS blocker_app,
    blocker.state AS blocker_state,
    now() - blocker.xact_start AS blocker_xact_age,
    left(blocker.query, 500) AS blocker_query
FROM pg_stat_activity blocked
JOIN LATERAL unnest(pg_blocking_pids(blocked.pid)) AS blocker_pid ON true
JOIN pg_stat_activity blocker ON blocker.pid = blocker_pid
ORDER BY blocked.query_start;
```

`pg_locks` digunakan untuk melihat outstanding locks, dan dokumentasi explicit locking menyebut view ini sebagai cara memeriksa lock yang sedang ada di server. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html))

---

### 17.3 Lihat lock yang belum granted

```sql
SELECT
    l.pid,
    a.usename,
    a.application_name,
    l.locktype,
    l.mode,
    l.granted,
    l.relation::regclass AS relation_name,
    l.page,
    l.tuple,
    l.virtualxid,
    l.transactionid,
    l.waitstart,
    now() - l.waitstart AS wait_age,
    left(a.query, 500) AS query
FROM pg_locks l
JOIN pg_stat_activity a ON a.pid = l.pid
WHERE l.granted = false
ORDER BY l.waitstart NULLS LAST;
```

---

### 17.4 Cari idle transaction yang berbahaya

```sql
SELECT
    pid,
    usename,
    application_name,
    client_addr,
    state,
    now() - xact_start AS xact_age,
    now() - state_change AS idle_age,
    left(query, 500) AS last_query
FROM pg_stat_activity
WHERE state = 'idle in transaction'
ORDER BY xact_start;
```

`idle_in_transaction_session_timeout` berguna karena session idle dalam transaksi bisa menahan lock dan juga mencegah vacuum membersihkan dead tuples yang masih mungkin terlihat transaksi tersebut. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-client.html?utm_source=chatgpt.com))

---

## 18. Incident Decision Tree

```text
Query lambat
│
├─ Apakah wait_event_type = 'Lock'?
│  │
│  ├─ Ya
│  │  ├─ cari blocker dengan pg_blocking_pids
│  │  ├─ cek blocker idle in transaction?
│  │  ├─ cek blocker DDL / migration?
│  │  ├─ cek blocker transaksi panjang?
│  │  └─ decide: wait, cancel, terminate, rollback migration
│  │
│  └─ Tidak
│     ├─ cek query plan
│     ├─ cek I/O wait
│     ├─ cek CPU
│     └─ cek connection saturation
│
└─ Apakah deadlock meningkat?
   ├─ cek order lock antar service
   ├─ cek batch update multi-row
   ├─ cek foreign key/index missing
   └─ tambahkan retry + perbaiki ordering
```

---

## 19. Practical Design Rules

| Rule | Penjelasan |
|---|---|
| Pilih atomic update dulu | `UPDATE ... WHERE expected_state RETURNING` sering cukup |
| Gunakan `FOR UPDATE` hanya jika perlu baca lalu mutate | Jangan lock read-only screen |
| Gunakan `SKIP LOCKED` hanya untuk queue/worker | Bukan untuk hasil user-facing yang harus lengkap |
| Gunakan `NOWAIT` untuk fail-fast | Cocok untuk command yang tidak boleh menggantung |
| Gunakan transaction-level advisory lock | Lebih aman dibanding session-level di connection pool |
| Selalu lock multi-row dengan urutan konsisten | Mencegah deadlock klasik |
| Pasang timeout per transaksi | Jangan biarkan request menunggu lock tanpa batas |
| Retry hanya transaksi penuh | Terutama untuk `40001` dan `40P01` |
| Jangan external call di dalam transaction | Lock jadi tertahan dan outage mudah terjadi |
| Simpan lock inspection query | Wajib ada di runbook production |

---

## 20. Anti-Pattern

### Anti-pattern 1 - `SELECT FOR UPDATE` untuk semua hal

```sql
SELECT *
FROM regulatory_case
WHERE tenant_id = :tenantId
FOR UPDATE;
```

Masalah:

```text
mengunci terlalu banyak row
menurunkan concurrency
menciptakan lock queue
berisiko deadlock
```

Lebih baik:

```sql
UPDATE regulatory_case
SET status = 'UNDER_REVIEW'
WHERE case_id = :caseId
  AND status = 'SUBMITTED'
RETURNING *;
```

---

### Anti-pattern 2 - Queue tanpa `SKIP LOCKED`

```sql
SELECT job_id
FROM ol_queue_job
WHERE status = 'READY'
ORDER BY available_at
LIMIT 10
FOR UPDATE;
```

Masalah: worker lain menunggu worker pertama, bukan mengambil job lain.

Lebih baik:

```sql
SELECT job_id
FROM ol_queue_job
WHERE status = 'READY'
ORDER BY available_at
LIMIT 10
FOR UPDATE SKIP LOCKED;
```

---

### Anti-pattern 3 - Session-level advisory lock di aplikasi pool

```sql
SELECT pg_advisory_lock(123);
```

Masalah: lock bisa bertahan selama session/connection, bukan selama transaksi bisnis.

Lebih baik:

```sql
SELECT pg_advisory_xact_lock(123);
```

---

### Anti-pattern 4 - Deadlock dianggap random

Deadlock biasanya bukan random. Biasanya ada pola:

```text
service A lock resource X lalu Y
service B lock resource Y lalu X
```

Fix utamanya bukan hanya retry. Fix utamanya adalah **global lock ordering**.

---

## 21. Mini Lab

### Session A

```sql
BEGIN;

UPDATE regulatory_case
SET title = 'Locked by session A'
WHERE case_id = '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1001';

-- jangan commit dulu
```

### Session B

```sql
SET lock_timeout = '1s';

UPDATE regulatory_case
SET title = 'Updated by session B'
WHERE case_id = '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1001';
```

Expected result:

```text
Session B gagal karena menunggu lock lebih dari 1 detik.
```

### Session C - inspection

```sql
SELECT
    blocked.pid AS blocked_pid,
    blocker.pid AS blocker_pid,
    blocked.wait_event_type,
    blocked.wait_event,
    left(blocked.query, 200) AS blocked_query,
    left(blocker.query, 200) AS blocker_query
FROM pg_stat_activity blocked
JOIN LATERAL unnest(pg_blocking_pids(blocked.pid)) AS blocker_pid ON true
JOIN pg_stat_activity blocker ON blocker.pid = blocker_pid;
```

Tujuan lab:

```text
1. Melihat row update conflict secara nyata.
2. Melihat lock timeout bekerja.
3. Melihat blocker dan blocked session.
```

---

## 22. Ringkasan

```text
1. Lock adalah alat correctness, tapi bisa menjadi sumber outage.
2. Untuk state transition sederhana, gunakan atomic UPDATE dengan guard.
3. Untuk baca-lalu-mutate, gunakan FOR UPDATE atau FOR NO KEY UPDATE.
4. Untuk worker queue, gunakan FOR UPDATE SKIP LOCKED.
5. Untuk fail-fast, gunakan NOWAIT atau lock_timeout.
6. Untuk resource aplikasi non-row, gunakan transaction-level advisory lock.
7. Deadlock dicegah dengan lock ordering konsisten.
8. Retry 40001/40P01 harus mengulang seluruh transaksi.
9. Lock incident harus dianalisis dengan pg_stat_activity, pg_locks, dan pg_blocking_pids.
```

---

# Status Seri

**Seri 2/22 selesai.**

Rekomendasi lanjut ke:

**Seri 3 - Relational Domain Modelling untuk PostgreSQL OLTP: aggregate boundary, lifecycle table, reference/master data, tenant boundary, status modelling, auditability, dan schema pattern untuk Java/Jersey/MyBatis microservice.**

---

**Sources:**

- [PostgreSQL: Documentation: 18: 13.3. Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html)

## Response:
7/15/2026, 8:01:29 PM

Saya lanjut ke **Seri 3/22**. Seri ini akan fokus ke desain domain relasional untuk OLTP: bagaimana memecah aggregate, lifecycle/status, master data, auditability, tenant boundary, dan konsekuensi implementasinya di PostgreSQL serta MyBatis.

# PostgreSQL OLTP - Seri 3/22  
## Relational Domain Modelling untuk OLTP: Aggregate Boundary, Lifecycle Table, Master Data, Tenant Boundary, Auditability, dan Schema Pattern

Seri ini fokus pada **cara memodelkan domain transaksi** di PostgreSQL agar aman untuk production OLTP. Targetnya bukan sekadar “membuat tabel”, tapi membuat model yang:

```text
1. menjaga invariant bisnis
2. aman saat concurrent transaction
3. mudah diaudit
4. mudah dimigrasikan
5. cocok untuk Java/Jersey/MyBatis microservice
6. tidak cepat rusak saat domain berkembang
```

PostgreSQL menyediakan constraint penting seperti `CHECK`, `NOT NULL`, `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY`, dan `EXCLUDE`; ini harus dipakai sebagai lapisan defensif, bukan digantikan sepenuhnya oleh validasi aplikasi. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-constraints.html?utm_source=chatgpt.com))

---

# 1. Mental Model

Untuk OLTP, desain domain relational sebaiknya dimulai dari **business transition**, bukan dari UI screen.

```text
Business Command
│
├─ Create case
├─ Submit case
├─ Assign reviewer
├─ Approve / reject case
├─ Close case
├─ Add party
├─ Add evidence
├─ Record decision
└─ Emit audit/outbox event
```

Setiap command perlu dijawab:

| Pertanyaan | Kenapa penting |
|---|---|
| Entity apa yang berubah? | Menentukan tabel utama |
| Invariant apa yang harus selalu benar? | Menentukan constraint, FK, unique, check |
| State transition apa yang legal? | Menentukan status model dan transition guard |
| Apa yang harus bisa diaudit? | Menentukan audit/history table |
| Apakah multi-tenant? | Menentukan tenant boundary dan composite key |
| Apakah data akan tumbuh besar? | Menentukan partitioning/archive strategy |
| Apakah update sering atau append-only? | Menentukan storage/index/vacuum impact |

---

# 2. Diagram Domain Modelling OLTP

```text
PostgreSQL OLTP Domain Model
│
├─ Aggregate Root
│  ├─ regulatory_case
│  ├─ enforcement_action
│  ├─ workflow_task
│  └─ payment_instruction
│
├─ Child Entity
│  ├─ case_party
│  ├─ case_document
│  ├─ case_note
│  └─ case_assignment
│
├─ Lifecycle / State
│  ├─ status column
│  ├─ status transition table
│  ├─ status history
│  └─ current-state guard
│
├─ Reference / Master Data
│  ├─ reference table
│  ├─ effective dating
│  ├─ active/inactive flag
│  └─ versioned rule code
│
├─ Auditability
│  ├─ audit table
│  ├─ event table
│  ├─ changed_by / changed_at
│  ├─ before/after snapshot
│  └─ append-only history
│
├─ Tenant Boundary
│  ├─ tenant_id on transactional tables
│  ├─ tenant-scoped uniqueness
│  ├─ tenant-aware FK
│  └─ optional RLS
│
├─ Integrity Boundary
│  ├─ PK
│  ├─ FK
│  ├─ UNIQUE
│  ├─ CHECK
│  ├─ EXCLUDE
│  └─ NOT NULL
│
└─ Application Mapping
   ├─ Java record / DTO
   ├─ MyBatis mapper
   ├─ command handler
   ├─ transaction boundary
   └─ error mapping
```

---

# 3. Practical Decomposition Table

| Area | Skill | Praktik PostgreSQL | Kapan penting |
|---|---|---|---|
| Aggregate root | Menentukan tabel utama transaksi | `regulatory_case`, `workflow_task`, `enforcement_action` | Saat entity punya lifecycle sendiri |
| Child entity | Memisahkan detail dari root | `case_party`, `case_document`, `case_note` | Saat data bergantung pada root |
| Lifecycle modelling | Mendesain status dan transition | `status`, `version`, `status_history` | Untuk approval, review, enforcement lifecycle |
| Transition guard | Menghindari illegal state change | `UPDATE ... WHERE status = ? RETURNING` | Saat banyak request concurrent |
| Reference data | Master/lookup table | `ref_case_type`, `ref_action_type` | Saat kode dipakai banyak transaksi |
| Effective-dated reference | Reference berubah per waktu | `valid_from`, `valid_to`, `is_active` | Untuk aturan/regulasi yang berubah |
| Constraint design | Menjaga invariant di DB | `UNIQUE`, `CHECK`, `FK`, `EXCLUDE` | Untuk safety net production |
| Tenant boundary | Multi-tenant correctness | `tenant_id` di PK/FK/index | Untuk isolasi data antar tenant |
| Audit trail | Append-only evidence | `case_status_audit`, `case_change_log` | Untuk defensibility dan forensic |
| History table | Tracking perubahan domain | `case_status_history` | Untuk melihat timeline lifecycle |
| Outbox | Integrasi event setelah commit | `outbox_event` | Untuk Kafka/CDC/event publishing |
| Soft delete | Lifecycle removal | `deleted_at`, `deleted_by` | Untuk data yang tidak boleh hilang |
| Hard delete | Physical removal | `DELETE` | Hanya untuk data sementara/non-regulated |
| Partitioning candidate | Memecah tabel besar | partition by `created_at` / `tenant_id` | Untuk audit/event/history besar |
| RLS candidate | Tenant/security enforcement DB-level | `CREATE POLICY` | Untuk tambahan isolasi tenant/security |

---

# 4. Pattern 1 - Aggregate Root Table

Contoh domain: **regulatory case**.

```sql
CREATE TABLE regulatory_case (
    tenant_id       bigint NOT NULL,
    case_id         uuid NOT NULL,
    case_number     text NOT NULL,
    case_type_code  text NOT NULL,
    status          text NOT NULL,
    title           text NOT NULL,
    priority        text NOT NULL DEFAULT 'NORMAL',
    version         bigint NOT NULL DEFAULT 0,
    created_by      text NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT clock_timestamp(),
    updated_by      text NOT NULL,
    updated_at      timestamptz NOT NULL DEFAULT clock_timestamp(),
    deleted_at      timestamptz,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case_number
        UNIQUE (tenant_id, case_number),

    CONSTRAINT chk_regulatory_case_status
        CHECK (status IN (
            'DRAFT',
            'SUBMITTED',
            'UNDER_REVIEW',
            'APPROVED',
            'REJECTED',
            'CLOSED'
        )),

    CONSTRAINT chk_regulatory_case_priority
        CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'CRITICAL')),

    CONSTRAINT chk_regulatory_case_title_not_blank
        CHECK (length(trim(title)) > 0)
);
```

Kenapa `PRIMARY KEY (tenant_id, case_id)`?

Karena untuk sistem multi-tenant, hampir semua query transactional biasanya punya `tenant_id`. Dengan composite primary key, child table bisa membuat FK yang juga tenant-aware.

```text
tenant_id + case_id = identity dalam boundary tenant
case_id saja        = identity teknis global, tapi kurang defensif untuk FK multi-tenant
```

---

# 5. Pattern 2 - Child Entity dengan Tenant-Aware Foreign Key

Contoh: pihak yang terkait dengan case.

```sql
CREATE TABLE case_party (
    tenant_id       bigint NOT NULL,
    case_id         uuid NOT NULL,
    party_id        uuid NOT NULL,
    party_role      text NOT NULL,
    display_name    text NOT NULL,
    identity_number text,
    created_at      timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_case_party
        PRIMARY KEY (tenant_id, case_id, party_id),

    CONSTRAINT fk_case_party_case
        FOREIGN KEY (tenant_id, case_id)
        REFERENCES regulatory_case (tenant_id, case_id),

    CONSTRAINT chk_case_party_role
        CHECK (party_role IN (
            'COMPLAINANT',
            'RESPONDENT',
            'WITNESS',
            'REPRESENTATIVE',
            'INTERNAL_OFFICER'
        )),

    CONSTRAINT chk_case_party_display_name_not_blank
        CHECK (length(trim(display_name)) > 0)
);
```

Practical benefit:

```text
Child row tidak mungkin nyasar ke tenant lain.
Query selalu bisa filter by tenant_id.
Index locality lebih baik untuk tenant-scoped access.
```

---

# 6. Pattern 3 - Status sebagai Column + History sebagai Append-Only Table

Untuk OLTP, biasanya butuh dua hal:

```text
1. current status untuk query cepat
2. status history untuk audit dan timeline
```

Table utama:

```sql
status text NOT NULL
```

History table:

```sql
CREATE TABLE case_status_history (
    tenant_id       bigint NOT NULL,
    case_id         uuid NOT NULL,
    history_id      bigint GENERATED ALWAYS AS IDENTITY,
    from_status     text,
    to_status       text NOT NULL,
    action          text NOT NULL,
    reason          text,
    changed_by      text NOT NULL,
    changed_at      timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_case_status_history
        PRIMARY KEY (tenant_id, case_id, history_id),

    CONSTRAINT fk_case_status_history_case
        FOREIGN KEY (tenant_id, case_id)
        REFERENCES regulatory_case (tenant_id, case_id),

    CONSTRAINT chk_case_status_history_action_not_blank
        CHECK (length(trim(action)) > 0)
);
```

PostgreSQL identity column dibuat dengan `GENERATED ... AS IDENTITY` dan memakai implicit sequence untuk menghasilkan key value. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-identity-columns.html?utm_source=chatgpt.com))

Practical rule:

```text
Current state disimpan di root table.
History disimpan append-only.
Jangan menghitung current status dari history untuk setiap request OLTP.
```

---

# 7. Pattern 4 - Transition Table untuk Workflow yang Bisa Berubah

Kalau lifecycle sederhana dan stabil, `CHECK status IN (...)` cukup.

Kalau lifecycle sering berubah atau perlu permission per transition, gunakan transition table.

```sql
CREATE TABLE ref_case_status_transition (
    from_status      text NOT NULL,
    to_status        text NOT NULL,
    action           text NOT NULL,
    required_role    text NOT NULL,
    is_active        boolean NOT NULL DEFAULT true,

    CONSTRAINT pk_ref_case_status_transition
        PRIMARY KEY (from_status, to_status, action),

    CONSTRAINT chk_transition_no_blank_action
        CHECK (length(trim(action)) > 0)
);
```

Contoh data:

```sql
INSERT INTO ref_case_status_transition (
    from_status,
    to_status,
    action,
    required_role
)
VALUES
    ('DRAFT', 'SUBMITTED', 'SUBMIT', 'CASE_OFFICER'),
    ('SUBMITTED', 'UNDER_REVIEW', 'CLAIM_REVIEW', 'REVIEWER'),
    ('UNDER_REVIEW', 'APPROVED', 'APPROVE', 'APPROVER'),
    ('UNDER_REVIEW', 'REJECTED', 'REJECT', 'APPROVER'),
    ('APPROVED', 'CLOSED', 'CLOSE', 'CASE_OFFICER'),
    ('REJECTED', 'CLOSED', 'CLOSE', 'CASE_OFFICER');
```

Lalu transition command bisa validasi:

```sql
SELECT 1
FROM ref_case_status_transition
WHERE from_status = :currentStatus
  AND to_status = :targetStatus
  AND action = :action
  AND required_role = :actorRole
  AND is_active = true;
```

Namun untuk update tetap gunakan guard:

```sql
UPDATE regulatory_case
SET status = :targetStatus,
    version = version + 1,
    updated_by = :actor,
    updated_at = clock_timestamp()
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND status = :expectedCurrentStatus
RETURNING tenant_id, case_id, status, version;
```

---

# 8. Pattern 5 - Reference/Master Data

Reference data jangan selalu dibuat enum. Untuk domain enterprise/regulatory, lookup table sering lebih aman.

```sql
CREATE TABLE ref_case_type (
    case_type_code text PRIMARY KEY,
    display_name   text NOT NULL,
    description    text,
    is_active      boolean NOT NULL DEFAULT true,
    sort_order     integer NOT NULL DEFAULT 100,
    created_at     timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT chk_ref_case_type_code_not_blank
        CHECK (length(trim(case_type_code)) > 0),

    CONSTRAINT chk_ref_case_type_name_not_blank
        CHECK (length(trim(display_name)) > 0)
);
```

Tambahkan FK dari `regulatory_case`:

```sql
ALTER TABLE regulatory_case
ADD CONSTRAINT fk_regulatory_case_type
FOREIGN KEY (case_type_code)
REFERENCES ref_case_type (case_type_code);
```

Kapan pilih enum vs lookup table?

| Pilihan | Cocok untuk | Hindari jika |
|---|---|---|
| PostgreSQL enum | Nilai sangat stabil, jarang berubah | Nilai sering berubah, perlu active flag, perlu metadata |
| Lookup table | Master data bisnis, perlu display name, sort order, effective date | Nilai benar-benar internal dan sangat stabil |
| Plain text + CHECK | Status sederhana dalam satu table | Banyak table perlu referensi status yang sama |

---

# 9. Pattern 6 - Effective-Dated Reference Data

Untuk sistem regulatori, aturan dan klasifikasi sering berubah per tanggal.

```sql
CREATE TABLE ref_violation_type (
    violation_type_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    violation_code    text NOT NULL,
    display_name      text NOT NULL,
    severity          text NOT NULL,
    valid_from        date NOT NULL,
    valid_to          date,
    is_active         boolean NOT NULL DEFAULT true,

    CONSTRAINT uq_ref_violation_type_version
        UNIQUE (violation_code, valid_from),

    CONSTRAINT chk_ref_violation_valid_range
        CHECK (valid_to IS NULL OR valid_to > valid_from),

    CONSTRAINT chk_ref_violation_severity
        CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);
```

Query reference pada tanggal kejadian:

```sql
SELECT violation_type_id, violation_code, display_name, severity
FROM ref_violation_type
WHERE violation_code = :violationCode
  AND valid_from <= :eventDate
  AND (valid_to IS NULL OR valid_to > :eventDate)
  AND is_active = true;
```

Practical rule:

```text
Jangan hanya menyimpan current master data jika keputusan masa lalu harus tetap bisa diaudit berdasarkan aturan saat itu.
```

---

# 10. Pattern 7 - Snapshot untuk Audit Defensibility

Kadang FK ke reference data tidak cukup. Jika display name/severity/rule berubah, keputusan lama bisa tampak berubah.

Solusi: simpan snapshot penting saat transaksi dibuat.

```sql
CREATE TABLE case_violation (
    tenant_id              bigint NOT NULL,
    case_id                uuid NOT NULL,
    case_violation_id      uuid NOT NULL,
    violation_type_id      bigint NOT NULL,
    violation_code_snapshot text NOT NULL,
    severity_snapshot       text NOT NULL,
    rule_version_snapshot   text,
    description             text,
    created_at              timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_case_violation
        PRIMARY KEY (tenant_id, case_id, case_violation_id),

    CONSTRAINT fk_case_violation_case
        FOREIGN KEY (tenant_id, case_id)
        REFERENCES regulatory_case (tenant_id, case_id),

    CONSTRAINT fk_case_violation_type
        FOREIGN KEY (violation_type_id)
        REFERENCES ref_violation_type (violation_type_id)
);
```

Pattern:

```text
FK menyimpan relasi teknis.
Snapshot menyimpan konteks keputusan pada waktu itu.
```

---

# 11. Pattern 8 - Audit Trail Append-Only

Audit table harus append-only secara desain aplikasi.

```sql
CREATE TABLE case_audit_log (
    tenant_id       bigint NOT NULL,
    audit_id        bigint GENERATED ALWAYS AS IDENTITY,
    case_id         uuid NOT NULL,
    event_type      text NOT NULL,
    actor_id        text NOT NULL,
    actor_type      text NOT NULL,
    occurred_at     timestamptz NOT NULL DEFAULT clock_timestamp(),
    request_id      text,
    correlation_id  text,
    before_state    jsonb,
    after_state     jsonb,
    metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,

    CONSTRAINT pk_case_audit_log
        PRIMARY KEY (tenant_id, audit_id),

    CONSTRAINT fk_case_audit_log_case
        FOREIGN KEY (tenant_id, case_id)
        REFERENCES regulatory_case (tenant_id, case_id),

    CONSTRAINT chk_case_audit_event_type_not_blank
        CHECK (length(trim(event_type)) > 0)
);
```

Practical recommendations:

```text
1. Jangan update audit row kecuali untuk koreksi administratif yang sangat terkendali.
2. Simpan actor, request_id, correlation_id.
3. Simpan before/after hanya untuk field penting atau snapshot ringkas.
4. Jangan simpan data sensitif tanpa masking/encryption policy.
```

---

# 12. Pattern 9 - Outbox Table untuk Event Integration

Untuk microservice, jangan publish event langsung sebelum commit. Simpan outbox dalam transaksi yang sama.

```sql
CREATE TABLE outbox_event (
    tenant_id        bigint NOT NULL,
    outbox_id        uuid NOT NULL,
    aggregate_type   text NOT NULL,
    aggregate_id     uuid NOT NULL,
    event_type       text NOT NULL,
    event_version    integer NOT NULL DEFAULT 1,
    payload          jsonb NOT NULL,
    status           text NOT NULL DEFAULT 'NEW',
    created_at       timestamptz NOT NULL DEFAULT clock_timestamp(),
    published_at     timestamptz,
    attempt_count    integer NOT NULL DEFAULT 0,

    CONSTRAINT pk_outbox_event
        PRIMARY KEY (tenant_id, outbox_id),

    CONSTRAINT chk_outbox_status
        CHECK (status IN ('NEW', 'PROCESSING', 'PUBLISHED', 'FAILED'))
);
```

Dalam command transaction:

```sql
INSERT INTO outbox_event (
    tenant_id,
    outbox_id,
    aggregate_type,
    aggregate_id,
    event_type,
    payload
)
VALUES (
    :tenantId,
    :outboxId,
    'REGULATORY_CASE',
    :caseId,
    'CASE_SUBMITTED',
    :payload::jsonb
);
```

Practical rule:

```text
State change + audit + outbox harus commit bersama.
Publish ke Kafka/HTTP/gRPC dilakukan setelah commit oleh worker.
```

---

# 13. Pattern 10 - Tenant Boundary

Minimal rule untuk multi-tenant OLTP:

```text
Semua transactional table punya tenant_id.
Semua unique business key harus tenant-scoped.
Semua child FK harus membawa tenant_id.
Semua query dari aplikasi harus filter tenant_id.
```

Contoh unique:

```sql
CONSTRAINT uq_regulatory_case_number
UNIQUE (tenant_id, case_number)
```

Contoh FK tenant-aware:

```sql
FOREIGN KEY (tenant_id, case_id)
REFERENCES regulatory_case (tenant_id, case_id)
```

Tambahan opsional: Row Level Security.

PostgreSQL Row-Level Security policy bisa dibuat spesifik untuk command seperti `SELECT`, `INSERT`, `UPDATE`, `DELETE`, dan juga bisa dibatasi per role. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-rowsecurity.html?utm_source=chatgpt.com))

Contoh:

```sql
ALTER TABLE regulatory_case ENABLE ROW LEVEL SECURITY;

CREATE POLICY regulatory_case_tenant_policy
ON regulatory_case
USING (tenant_id = current_setting('app.tenant_id')::bigint)
WITH CHECK (tenant_id = current_setting('app.tenant_id')::bigint);
```

Aplikasi harus set session context dalam transaksi:

```sql
SET LOCAL app.tenant_id = '1001';
```

Catatan penting:

```text
RLS bagus sebagai defense-in-depth, tapi jangan menjadikannya satu-satunya tenant control.
Tetap gunakan tenant_id di query, FK, unique key, dan index.
```

---

# 14. Pattern 11 - Soft Delete vs Hard Delete

Untuk domain regulatori, deletion biasanya bukan benar-benar hapus.

Soft delete:

```sql
ALTER TABLE regulatory_case
ADD COLUMN deleted_by text,
ADD COLUMN delete_reason text;
```

Query aktif:

```sql
SELECT *
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND deleted_at IS NULL;
```

Partial unique untuk business key aktif:

```sql
CREATE UNIQUE INDEX uq_regulatory_case_active_number
ON regulatory_case (tenant_id, case_number)
WHERE deleted_at IS NULL;
```

Gunakan soft delete jika:

```text
1. data perlu audit
2. ada legal/regulatory retention
3. user boleh restore
4. data pernah menjadi dasar keputusan
```

Gunakan hard delete jika:

```text
1. data sementara
2. data tidak punya audit/legal value
3. retention policy memang mengharuskan purge
4. sudah lewat masa retention
```

---

# 15. Pattern 12 - Partition Candidate untuk Tabel Besar

Tidak semua tabel OLTP perlu partitioning.

Candidate yang masuk akal:

| Table | Partition key umum | Alasan |
|---|---|---|
| `case_audit_log` | `occurred_at` | Append-only, tumbuh cepat |
| `outbox_event` | `created_at` | Worker scan recent data |
| `case_status_history` | `changed_at` | Timeline historis |
| `idempotency_request` | `created_at` | Bisa cleanup berdasarkan umur |
| `workflow_job` | `created_at` / `status` | Tergantung workload |

Hati-hati: PostgreSQL punya batasan untuk unique/primary key pada partitioned table: kolom constraint harus mencakup semua partition key agar uniqueness dapat ditegakkan lintas partition. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html?utm_source=chatgpt.com))

Contoh audit partition:

```sql
CREATE TABLE case_audit_log_partitioned (
    tenant_id       bigint NOT NULL,
    audit_id        bigint GENERATED ALWAYS AS IDENTITY,
    case_id         uuid NOT NULL,
    event_type      text NOT NULL,
    actor_id        text NOT NULL,
    occurred_at     timestamptz NOT NULL,
    payload         jsonb NOT NULL,

    PRIMARY KEY (tenant_id, occurred_at, audit_id)
)
PARTITION BY RANGE (occurred_at);
```

---

# 16. Java Model Pattern

Untuk Java 17+, gunakan `record` untuk read model/command kecil.

```java
public record CaseRow(
    long tenantId,
    UUID caseId,
    String caseNumber,
    String caseTypeCode,
    String status,
    String title,
    String priority,
    long version,
    Instant createdAt,
    Instant updatedAt
) {}
```

Command:

```java
public record SubmitCaseCommand(
    long tenantId,
    UUID caseId,
    String actorId,
    String requestId,
    String correlationId,
    long expectedVersion
) {}
```

Result:

```java
public record SubmitCaseResult(
    long tenantId,
    UUID caseId,
    String status,
    long version
) {}
```

Practical rule:

```text
Command object ≠ DB row.
DB row ≠ API response.
Pisahkan model agar schema evolution tidak langsung merusak API contract.
```

---

# 17. MyBatis Mapper Pattern

Mapper interface:

```java
public interface RegulatoryCaseMapper {
    CaseRow findById(
        @Param("tenantId") long tenantId,
        @Param("caseId") UUID caseId
    );

    CaseRow submitCase(
        @Param("tenantId") long tenantId,
        @Param("caseId") UUID caseId,
        @Param("actorId") String actorId,
        @Param("expectedVersion") long expectedVersion
    );

    int insertStatusHistory(CaseStatusHistoryInsert row);

    int insertAuditLog(CaseAuditInsert row);

    int insertOutboxEvent(OutboxEventInsert row);
}
```

XML mapper untuk transition:

```xml
<select id="submitCase" resultType="com.example.CaseRow">
  UPDATE regulatory_case
  SET status = 'SUBMITTED',
      version = version + 1,
      updated_by = #{actorId},
      updated_at = clock_timestamp()
  WHERE tenant_id = #{tenantId}
    AND case_id = #{caseId}
    AND status = 'DRAFT'
    AND version = #{expectedVersion}
    AND deleted_at IS NULL
  RETURNING
      tenant_id       AS tenantId,
      case_id         AS caseId,
      case_number     AS caseNumber,
      case_type_code  AS caseTypeCode,
      status,
      title,
      priority,
      version,
      created_at      AS createdAt,
      updated_at      AS updatedAt
</select>
```

Kenapa `<select>`?

```text
Karena PostgreSQL UPDATE ... RETURNING menghasilkan result set.
Di MyBatis, statement yang mengembalikan rows lebih praktis dimodelkan sebagai select mapper.
```

---

# 18. Service Command Handler Pattern

```java
public final class SubmitCaseService {
    private final SqlSessionFactory sqlSessionFactory;

    public SubmitCaseService(SqlSessionFactory sqlSessionFactory) {
        this.sqlSessionFactory = sqlSessionFactory;
    }

    public SubmitCaseResult submit(SubmitCaseCommand command) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            RegulatoryCaseMapper mapper =
                session.getMapper(RegulatoryCaseMapper.class);

            CaseRow updated = mapper.submitCase(
                command.tenantId(),
                command.caseId(),
                command.actorId(),
                command.expectedVersion()
            );

            if (updated == null) {
                session.rollback();
                throw new BusinessConflictException(
                    "Case is not in DRAFT state, version changed, deleted, or not found"
                );
            }

            mapper.insertStatusHistory(new CaseStatusHistoryInsert(
                command.tenantId(),
                command.caseId(),
                "DRAFT",
                "SUBMITTED",
                "SUBMIT",
                command.actorId()
            ));

            mapper.insertAuditLog(CaseAuditInsert.caseSubmitted(
                command.tenantId(),
                command.caseId(),
                command.actorId(),
                command.requestId(),
                command.correlationId()
            ));

            mapper.insertOutboxEvent(OutboxEventInsert.caseSubmitted(
                command.tenantId(),
                command.caseId(),
                command.correlationId()
            ));

            session.commit();

            return new SubmitCaseResult(
                updated.tenantId(),
                updated.caseId(),
                updated.status(),
                updated.version()
            );
        }
    }
}
```

Invariant penting:

```text
status update
+ status history
+ audit log
+ outbox event
harus berada dalam satu transaksi.
```

---

# 19. Design Choice: Normalized vs Denormalized

| Pilihan | Kelebihan | Risiko |
|---|---|---|
| Normalized | Integrity kuat, update master data mudah | Join lebih banyak |
| Denormalized snapshot | Audit stabil, query cepat | Duplikasi data |
| JSONB metadata | Fleksibel | Invariant sulit dijaga |
| Lookup table | Evolvable, bisa active/inactive | Perlu join/FK |
| Enum | Sederhana dan strict | Migration lebih kaku |

Rule praktis:

```text
Core invariant → relational column + constraint.
Flexible metadata → jsonb.
Audit context → snapshot.
Frequently queried field → column/index, jangan sembunyikan di jsonb.
```

---

# 20. Anti-Pattern

## Anti-pattern 1 - Semua disimpan di satu table besar

```text
regulatory_case
- case data
- party data
- document data
- decision data
- audit data
- workflow data
```

Masalah:

```text
1. row terlalu lebar
2. update conflict meningkat
3. audit sulit
4. schema sulit evolve
5. index kacau
```

Lebih baik:

```text
regulatory_case
case_party
case_document
case_decision
case_status_history
case_audit_log
```

---

## Anti-pattern 2 - Semua status hanya divalidasi di Java

Buruk:

```text
Java cek status valid
Database menerima text apa pun
```

Lebih baik:

```sql
CONSTRAINT chk_regulatory_case_status
CHECK (status IN (
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'APPROVED',
    'REJECTED',
    'CLOSED'
))
```

---

## Anti-pattern 3 - FK tanpa tenant boundary

Buruk:

```sql
FOREIGN KEY (case_id)
REFERENCES regulatory_case (case_id)
```

Untuk multi-tenant, lebih defensif:

```sql
FOREIGN KEY (tenant_id, case_id)
REFERENCES regulatory_case (tenant_id, case_id)
```

---

## Anti-pattern 4 - Audit dihitung dari current table

Buruk:

```text
Tidak ada audit table.
Hanya ada updated_at dan updated_by.
```

Masalah:

```text
Tidak tahu field apa berubah.
Tidak tahu from_status.
Tidak tahu request/correlation id.
Sulit forensic.
Sulit regulatory defensibility.
```

Lebih baik:

```text
append-only audit/event/history table.
```

---

## Anti-pattern 5 - Reference data di-hardcode di aplikasi

Buruk:

```java
if (caseType.equals("AML")) { ... }
```

Lebih baik:

```text
ref_case_type
ref_violation_type
ref_status_transition
```

Aplikasi tetap boleh punya enum internal untuk branching tertentu, tapi source of truth bisnis sebaiknya jelas.

---

# 21. Review Checklist untuk Domain Modelling OLTP

| Checklist | Pertanyaan |
|---|---|
| Aggregate root jelas | Apa tabel utama yang merepresentasikan lifecycle? |
| Child table benar | Apakah child entity punya lifecycle sendiri atau bergantung pada root? |
| Tenant boundary aman | Apakah semua table/FK/index penting membawa `tenant_id`? |
| Business key unique | Apakah nomor case unik per tenant? |
| State transition aman | Apakah update memakai expected status/version? |
| Audit tersedia | Apakah setiap perubahan penting terekam append-only? |
| Reference data tepat | Apakah pakai enum, lookup, atau plain check dengan alasan jelas? |
| Snapshot audit tersedia | Apakah keputusan historis tetap bisa dijelaskan walau master data berubah? |
| Soft delete konsisten | Apakah query aktif selalu filter `deleted_at IS NULL`? |
| Outbox tersedia | Apakah event external tidak dikirim sebelum commit? |
| Partitioning tidak prematur | Apakah hanya table besar/append-only yang dipartisi? |
| MyBatis mapping aman | Apakah mapper tidak mencampur API DTO dengan DB row terlalu ketat? |

---

# 22. Mini Lab

## Step 1 - Buat case

```sql
INSERT INTO regulatory_case (
    tenant_id,
    case_id,
    case_number,
    case_type_code,
    status,
    title,
    created_by,
    updated_by
)
VALUES (
    1001,
    '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1001',
    'CASE-2026-0001',
    'AML',
    'DRAFT',
    'Suspicious transaction review',
    'user-001',
    'user-001'
);
```

## Step 2 - Submit dengan guard

```sql
UPDATE regulatory_case
SET status = 'SUBMITTED',
    version = version + 1,
    updated_by = 'user-001',
    updated_at = clock_timestamp()
WHERE tenant_id = 1001
  AND case_id = '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1001'
  AND status = 'DRAFT'
  AND version = 0
RETURNING tenant_id, case_id, status, version;
```

## Step 3 - Insert history

```sql
INSERT INTO case_status_history (
    tenant_id,
    case_id,
    from_status,
    to_status,
    action,
    changed_by
)
VALUES (
    1001,
    '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1001',
    'DRAFT',
    'SUBMITTED',
    'SUBMIT',
    'user-001'
);
```

## Step 4 - Coba submit lagi

```sql
UPDATE regulatory_case
SET status = 'SUBMITTED',
    version = version + 1,
    updated_by = 'user-001',
    updated_at = clock_timestamp()
WHERE tenant_id = 1001
  AND case_id = '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1001'
  AND status = 'DRAFT'
  AND version = 0
RETURNING tenant_id, case_id, status, version;
```

Expected:

```text
0 rows returned.
Artinya transition tidak valid lagi atau version sudah berubah.
Aplikasi harus map ke 409 Conflict.
```

---

# 23. Ringkasan Praktis

```text
1. Desain OLTP dimulai dari business command dan invariant.
2. Aggregate root menyimpan current state.
3. History/audit table menyimpan timeline append-only.
4. Tenant boundary harus muncul di table, FK, unique key, query, dan index.
5. Reference data pilih berdasarkan volatility: enum, CHECK, atau lookup table.
6. Transition aman memakai UPDATE dengan expected status/version.
7. Snapshot penting diperlukan untuk audit defensibility.
8. Outbox dipakai agar event external sinkron dengan commit database.
9. Partitioning berguna untuk table besar/append-only, bukan semua table.
10. Java/MyBatis model harus memisahkan command, row, result, dan API DTO.
```

---

# Status Seri

**Seri 3/22 selesai.**

Rekomendasi lanjut ke:

**Seri 4 - Constraint Design untuk PostgreSQL OLTP: Primary Key, Foreign Key, Unique, Check, Exclusion Constraint, Deferrable Constraint, dan cara mapping error ke Java/Jersey/MyBatis production API.**

---

**Sources:**

- [Documentation: 18: 5.5. Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:03:33 PM

Saya lanjut ke **Seri 4/22**. Fokusnya constraint sebagai “garis pertahanan terakhir” untuk invariant OLTP: PK, FK, unique, check, exclusion, deferrable constraint, dan mapping error SQLSTATE ke API/service layer.

# PostgreSQL OLTP - Seri 4/22  
## Constraint Design: Primary Key, Foreign Key, Unique, Check, Exclusion, Deferrable Constraint, dan Error Mapping ke Java/Jersey/MyBatis

Seri ini membahas constraint sebagai **lapisan defensif untuk invariant bisnis**. Di OLTP production, validasi aplikasi tetap perlu, tetapi constraint database adalah pengaman terakhir saat ada bug, race condition, retry ganda, job duplicate, atau integrasi antar-service yang tidak sinkron.

PostgreSQL mendukung constraint seperti `CHECK`, `NOT NULL`, `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY`, dan `EXCLUDE`; constraint ini adalah bagian utama dari data definition untuk menjaga validitas data. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl.html?utm_source=chatgpt.com))

---

## 1. Mental Model

```text id="ge0ls8"
Application validation
│
├─ cepat gagal sebelum akses DB
├─ pesan error lebih ramah
└─ mudah berubah mengikuti API
        │
        ▼
Database constraint
│
├─ menjaga invariant final
├─ aman terhadap race condition
├─ berlaku untuk semua writer
├─ berlaku untuk migration/script/job
└─ menghasilkan SQLSTATE yang bisa dipetakan aplikasi
```

Rule praktis:

```text id="bclh7g"
Semua invariant yang benar-benar tidak boleh dilanggar harus punya constraint DB,
bukan hanya if-statement di Java.
```

Contoh invariant yang harus turun ke DB:

| Invariant | Constraint |
|---|---|
| Case number unik per tenant | `UNIQUE (tenant_id, case_number)` |
| Child case tidak boleh beda tenant | Composite `FOREIGN KEY (tenant_id, case_id)` |
| Status hanya nilai legal | `CHECK (status IN (...))` atau FK ke reference table |
| Amount tidak boleh negatif | `CHECK (amount >= 0)` |
| Period validity tidak boleh overlap | `EXCLUDE USING gist (...)` |
| Party identity unik untuk active row | Partial unique index |
| Parent harus ada | `FOREIGN KEY` |
| Required field wajib ada | `NOT NULL` |

---

## 2. Diagram Constraint Layer

```text id="3gj0wh"
PostgreSQL OLTP Constraint Design
│
├─ Identity Constraint
│  ├─ PRIMARY KEY
│  ├─ identity column
│  ├─ UUID / UUIDv7
│  └─ composite tenant key
│
├─ Business Uniqueness
│  ├─ UNIQUE constraint
│  ├─ UNIQUE NULLS NOT DISTINCT
│  ├─ partial unique index
│  └─ natural business key
│
├─ Referential Integrity
│  ├─ FOREIGN KEY
│  ├─ composite FK
│  ├─ tenant-aware FK
│  ├─ ON DELETE behavior
│  └─ deferrable FK
│
├─ Value Integrity
│  ├─ NOT NULL
│  ├─ CHECK
│  ├─ domain type
│  └─ generated column + constraint
│
├─ Temporal / Range Integrity
│  ├─ EXCLUDE constraint
│  ├─ range type
│  ├─ no-overlap validity period
│  └─ resource booking/reservation
│
├─ Timing Behavior
│  ├─ NOT DEFERRABLE
│  ├─ DEFERRABLE INITIALLY IMMEDIATE
│  ├─ DEFERRABLE INITIALLY DEFERRED
│  └─ SET CONSTRAINTS
│
└─ Application Mapping
   ├─ SQLSTATE
   ├─ constraint name
   ├─ 400 / 404 / 409 mapping
   ├─ MyBatis exception unwrap
   └─ Jersey ExceptionMapper
```

---

## 3. Constraint Decomposition Table

| Constraint | Fungsi | Praktik OLTP | Error SQLSTATE umum |
|---|---|---|---|
| `NOT NULL` | Field wajib | Required business field | `23502 not_null_violation` |
| `CHECK` | Validasi nilai dalam row | Status, amount, date range, non-blank text | `23514 check_violation` |
| `UNIQUE` | Nilai/kombinasi unik | Business key, idempotency key, case number | `23505 unique_violation` |
| `PRIMARY KEY` | Identitas row | Technical key atau composite tenant key | `23505 unique_violation` |
| `FOREIGN KEY` | Referential integrity | Parent-child, tenant-aware relation | `23503 foreign_key_violation` |
| `EXCLUDE` | Mencegah konflik berdasarkan operator | No-overlap date/range/resource | `23P01 exclusion_violation` |
| Deferrable constraint | Tunda pengecekan sampai akhir transaksi | Reorder list, circular reference, batch import | Bergantung jenis constraint |
| Partial unique index | Unique hanya subset row | Active record, open task, one current assignment | `23505 unique_violation` |

PostgreSQL mendokumentasikan error code constraint seperti `23502`, `23503`, `23505`, `23514`, dan `23P01`; aplikasi sebaiknya mengecek SQLSTATE, bukan teks error, karena kode lebih stabil dan tidak terdampak lokalisasi pesan. ([PostgreSQL](https://www.postgresql.org/docs/current/errcodes-appendix.html?utm_source=chatgpt.com))

---

## 4. Pattern 1 - Primary Key untuk OLTP Multi-Tenant

Untuk sistem multi-tenant, ada dua pola umum.

### Opsi A - Global UUID PK

```sql id="rr67nx"
CREATE TABLE regulatory_case (
    case_id      uuid PRIMARY KEY,
    tenant_id    bigint NOT NULL,
    case_number  text NOT NULL,
    status       text NOT NULL,
    created_at   timestamptz NOT NULL DEFAULT clock_timestamp()
);
```

Kelebihan:

```text id="s4rj7j"
simple FK
case_id global unique
mudah untuk public API identifier
```

Kekurangan:

```text id="pec91g"
tenant boundary tidak otomatis masuk ke FK
developer bisa lupa filter tenant_id
unique business key tetap perlu tenant_id
```

### Opsi B - Composite PK dengan `tenant_id`

```sql id="i72ct1"
CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL,
    case_number  text NOT NULL,
    status       text NOT NULL,
    created_at   timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id)
);
```

Kelebihan:

```text id="25fdb5"
tenant boundary ikut terbawa ke child FK
query OLTP lebih eksplisit tenant-aware
lebih defensif terhadap cross-tenant bug
```

Kekurangan:

```text id="cwlnk9"
FK lebih panjang
mapper parameter lebih banyak
semua join perlu tenant_id
```

Rekomendasi praktis untuk sistem enterprise multi-tenant:

```text id="ft2f1v"
Gunakan tenant_id di semua transactional table.
Untuk root table, boleh punya UUID global, tapi child FK sebaiknya tenant-aware.
```

PostgreSQL primary key memastikan kolom key unik dan tidak null, serta otomatis membuat unique B-tree index untuk kolom primary key. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-constraints.html?utm_source=chatgpt.com))

---

## 5. Pattern 2 - Unique Business Key

Contoh: nomor case harus unik per tenant.

```sql id="79cpyj"
ALTER TABLE regulatory_case
ADD CONSTRAINT uq_regulatory_case_tenant_case_number
UNIQUE (tenant_id, case_number);
```

Untuk insert:

```sql id="21pue5"
INSERT INTO regulatory_case (
    tenant_id,
    case_id,
    case_number,
    status,
    created_at
)
VALUES (
    :tenantId,
    :caseId,
    :caseNumber,
    'DRAFT',
    clock_timestamp()
);
```

Jika duplicate:

```text id="g9hfiv"
SQLSTATE 23505 unique_violation
constraint = uq_regulatory_case_tenant_case_number
→ map ke HTTP 409 Conflict
```

Unique constraint di PostgreSQL memastikan nilai kolom atau kombinasi kolom unik, dan unique constraint otomatis membuat unique B-tree index. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-constraints.html?utm_source=chatgpt.com))

---

## 6. Pattern 3 - Unique dengan Nullable Column

Secara default, PostgreSQL menganggap `NULL` tidak sama dengan `NULL` dalam unique constraint, sehingga beberapa row dengan nilai `NULL` pada kolom unique masih bisa masuk. PostgreSQL mendukung `NULLS NOT DISTINCT` agar `NULL` diperlakukan sama untuk uniqueness. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-constraints.html?utm_source=chatgpt.com))

Contoh: satu user hanya boleh punya satu active external reference, termasuk jika `external_ref` null.

```sql id="6qpf64"
CREATE TABLE customer_profile (
    tenant_id     bigint NOT NULL,
    customer_id   uuid NOT NULL,
    external_ref  text,
    created_at    timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_customer_profile
        PRIMARY KEY (tenant_id, customer_id),

    CONSTRAINT uq_customer_profile_external_ref
        UNIQUE NULLS NOT DISTINCT (tenant_id, external_ref)
);
```

Tanpa `NULLS NOT DISTINCT`, beberapa row dengan `(tenant_id = 1001, external_ref = NULL)` masih bisa lolos.

Rule praktis:

```text id="bj9eud"
Kalau NULL berarti “belum ada nilai” dan multiple NULL boleh, pakai default.
Kalau NULL berarti satu state bisnis yang juga harus unik, pakai NULLS NOT DISTINCT.
```

---

## 7. Pattern 4 - Partial Unique Index untuk Active Row

PostgreSQL tidak menulis uniqueness subset sebagai unique constraint biasa, tetapi bisa menegakkannya dengan unique partial index. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-constraints.html?utm_source=chatgpt.com))

Contoh: nomor case boleh dipakai ulang hanya setelah case lama dihapus secara soft-delete.

```sql id="xfuqzw"
CREATE TABLE regulatory_case (
    tenant_id     bigint NOT NULL,
    case_id       uuid NOT NULL,
    case_number   text NOT NULL,
    status        text NOT NULL,
    deleted_at    timestamptz,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id)
);

CREATE UNIQUE INDEX uq_regulatory_case_active_number
ON regulatory_case (tenant_id, case_number)
WHERE deleted_at IS NULL;
```

Contoh lain: satu case hanya boleh punya satu active assignment.

```sql id="8cijn4"
CREATE TABLE case_assignment (
    tenant_id      bigint NOT NULL,
    case_id        uuid NOT NULL,
    assignment_id  uuid NOT NULL,
    officer_id     text NOT NULL,
    assigned_at    timestamptz NOT NULL DEFAULT clock_timestamp(),
    released_at    timestamptz,

    CONSTRAINT pk_case_assignment
        PRIMARY KEY (tenant_id, case_id, assignment_id)
);

CREATE UNIQUE INDEX uq_case_assignment_one_active
ON case_assignment (tenant_id, case_id)
WHERE released_at IS NULL;
```

Practical consequence:

```text id="sknq45"
Partial unique index sangat cocok untuk current/active/open state.
Tapi karena ini index, bukan table constraint biasa, naming dan migration harus disiplin.
```

---

## 8. Pattern 5 - Foreign Key Tenant-Aware

Buruk untuk multi-tenant:

```sql id="u49c7k"
CREATE TABLE case_party (
    tenant_id  bigint NOT NULL,
    case_id    uuid NOT NULL,
    party_id   uuid NOT NULL,

    CONSTRAINT fk_case_party_case
        FOREIGN KEY (case_id)
        REFERENCES regulatory_case (case_id)
);
```

Lebih defensif:

```sql id="p56xob"
CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL,
    case_number  text NOT NULL,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id)
);

CREATE TABLE case_party (
    tenant_id  bigint NOT NULL,
    case_id    uuid NOT NULL,
    party_id   uuid NOT NULL,
    role_code  text NOT NULL,

    CONSTRAINT pk_case_party
        PRIMARY KEY (tenant_id, case_id, party_id),

    CONSTRAINT fk_case_party_case
        FOREIGN KEY (tenant_id, case_id)
        REFERENCES regulatory_case (tenant_id, case_id)
);
```

Foreign key memastikan nilai pada kolom child cocok dengan row pada tabel parent, sehingga menjaga referential integrity antar-tabel. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-constraints.html?utm_source=chatgpt.com))

---

## 9. Pattern 6 - `ON DELETE` Behavior

| Behavior | Makna | Kapan cocok |
|---|---|---|
| `ON DELETE RESTRICT` / default no action | Parent tidak bisa dihapus jika child masih ada | Regulatory/financial core data |
| `ON DELETE CASCADE` | Child ikut dihapus | Temporary/session/cache-like child |
| `ON DELETE SET NULL` | Child tetap ada, relasi dikosongkan | Optional relation, bukan ownership kuat |
| Soft delete | Parent tidak dihapus fisik | Audit/legal/regulatory record |

Contoh untuk domain regulatori biasanya jangan cascade:

```sql id="7y6id8"
ALTER TABLE case_party
ADD CONSTRAINT fk_case_party_case
FOREIGN KEY (tenant_id, case_id)
REFERENCES regulatory_case (tenant_id, case_id)
ON DELETE RESTRICT;
```

Contoh yang boleh cascade:

```sql id="s60wqr"
CREATE TABLE import_staging_row_error (
    import_id   uuid NOT NULL,
    row_number  integer NOT NULL,
    error_text  text NOT NULL,

    CONSTRAINT fk_import_error_import
        FOREIGN KEY (import_id)
        REFERENCES import_staging_job (import_id)
        ON DELETE CASCADE
);
```

Rule praktis:

```text id="tc1zrr"
Untuk regulated transactional data, default-kan RESTRICT/NO ACTION.
Gunakan CASCADE hanya jika child benar-benar tidak punya nilai tanpa parent.
```

---

## 10. Pattern 7 - Check Constraint untuk Value Integrity

Contoh:

```sql id="45d1qq"
CREATE TABLE payment_instruction (
    tenant_id       bigint NOT NULL,
    instruction_id  uuid NOT NULL,
    amount          numeric(18, 2) NOT NULL,
    currency_code   char(3) NOT NULL,
    status          text NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_payment_instruction
        PRIMARY KEY (tenant_id, instruction_id),

    CONSTRAINT chk_payment_amount_positive
        CHECK (amount > 0),

    CONSTRAINT chk_payment_currency_uppercase
        CHECK (currency_code = upper(currency_code)),

    CONSTRAINT chk_payment_status
        CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED'))
);
```

Check constraint cocok untuk invariant dalam satu row. PostgreSQL mendokumentasikan `CHECK` sebagai constraint yang mengekspresikan kondisi boolean yang harus dipenuhi row. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl.html?utm_source=chatgpt.com))

Hindari `CHECK` untuk invariant lintas row, misalnya:

```text id="y47tku"
“hanya boleh ada satu assignment aktif per case”
```

Gunakan partial unique index:

```sql id="yiryhp"
CREATE UNIQUE INDEX uq_one_active_assignment
ON case_assignment (tenant_id, case_id)
WHERE released_at IS NULL;
```

---

## 11. Pattern 8 - Non-Blank Text Constraint

`NOT NULL` tidak cukup untuk text.

```sql id="384oxf"
CREATE TABLE ref_case_type (
    case_type_code text PRIMARY KEY,
    display_name   text NOT NULL,

    CONSTRAINT chk_case_type_code_not_blank
        CHECK (length(trim(case_type_code)) > 0),

    CONSTRAINT chk_case_type_display_name_not_blank
        CHECK (length(trim(display_name)) > 0)
);
```

Practical rule:

```text id="al34jj"
Untuk text business field:
NOT NULL + CHECK trim length > 0
```

---

## 12. Pattern 9 - Date/Period Constraint

Contoh validity period:

```sql id="ovjiq1"
CREATE TABLE ref_rule_version (
    rule_version_id  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rule_code        text NOT NULL,
    valid_from       date NOT NULL,
    valid_to         date,

    CONSTRAINT chk_rule_valid_range
        CHECK (valid_to IS NULL OR valid_to > valid_from)
);
```

Ini mencegah periode negatif, tetapi belum mencegah overlap antar row. Untuk overlap, gunakan exclusion constraint.

---

## 13. Pattern 10 - Exclusion Constraint untuk No-Overlap

Exclusion constraint memastikan tidak ada dua row yang memiliki konflik berdasarkan operator tertentu. PostgreSQL menyediakan exclusion constraint sebagai salah satu jenis constraint dalam data definition. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl.html?utm_source=chatgpt.com))

Use case:

```text id="v4ziyh"
1. satu officer tidak boleh punya assignment waktu yang overlap
2. satu rule_code tidak boleh punya effective period overlap
3. satu room/resource tidak boleh dibooking overlap
4. satu case tidak boleh punya active decision period overlap
```

Aktifkan extension GiST helper untuk equality text/bigint bila perlu:

```sql id="k19hhj"
CREATE EXTENSION IF NOT EXISTS btree_gist;
```

Contoh no-overlap rule version:

```sql id="ydw1qi"
CREATE TABLE ref_rule_version (
    rule_version_id  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rule_code        text NOT NULL,
    valid_from       date NOT NULL,
    valid_to         date,
    rule_payload     jsonb NOT NULL,

    CONSTRAINT chk_rule_valid_range
        CHECK (valid_to IS NULL OR valid_to > valid_from),

    CONSTRAINT ex_rule_version_no_overlap
        EXCLUDE USING gist (
            rule_code WITH =,
            daterange(valid_from, COALESCE(valid_to, 'infinity'::date), '[)') WITH &&
        )
);
```

Makna:

```text id="n5j222"
Untuk rule_code yang sama,
daterange tidak boleh overlap.
```

Jika overlap:

```text id="ppqen2"
SQLSTATE 23P01 exclusion_violation
→ map ke 409 Conflict
```

---

## 14. Pattern 11 - Deferrable Constraint

Constraint biasanya dicek segera per statement. PostgreSQL mendukung constraint timing seperti `DEFERRABLE INITIALLY DEFERRED`, `DEFERRABLE INITIALLY IMMEDIATE`, dan `NOT DEFERRABLE`; `SET CONSTRAINTS` dapat mengubah mode deferrable constraint dalam transaksi. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-set-constraints.html?utm_source=chatgpt.com))

Deferrable cocok untuk:

```text id="1zd3xy"
1. reorder list dengan unique position
2. circular reference sementara dalam satu transaksi
3. batch import parent-child yang urutannya sulit
4. swap business key antara dua row
```

Contoh reorder:

```sql id="ikhc3c"
CREATE TABLE workflow_step (
    tenant_id     bigint NOT NULL,
    workflow_id   uuid NOT NULL,
    step_id       uuid NOT NULL,
    position_no   integer NOT NULL,
    title         text NOT NULL,

    CONSTRAINT pk_workflow_step
        PRIMARY KEY (tenant_id, workflow_id, step_id),

    CONSTRAINT uq_workflow_step_position
        UNIQUE (tenant_id, workflow_id, position_no)
        DEFERRABLE INITIALLY IMMEDIATE
);
```

Tanpa deferrable, swap posisi bisa gagal di tengah:

```sql id="djsjiz"
BEGIN;

UPDATE workflow_step
SET position_no = 2
WHERE tenant_id = 1001
  AND workflow_id = '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1001'
  AND position_no = 1;

UPDATE workflow_step
SET position_no = 1
WHERE tenant_id = 1001
  AND workflow_id = '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1001'
  AND position_no = 2;

COMMIT;
```

Dengan deferrable:

```sql id="x8xlsb"
BEGIN;

SET CONSTRAINTS uq_workflow_step_position DEFERRED;

UPDATE workflow_step
SET position_no = CASE position_no
    WHEN 1 THEN 2
    WHEN 2 THEN 1
END
WHERE tenant_id = 1001
  AND workflow_id = '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1001'
  AND position_no IN (1, 2);

COMMIT;
```

Important constraint:

```text id="wq7zem"
Deferrable bukan cara untuk mengabaikan constraint.
Ia hanya menunda pengecekan sampai akhir transaksi.
Saat COMMIT, data akhir tetap harus valid.
```

PostgreSQL `CREATE TABLE` mendokumentasikan opsi `DEFERRABLE`, `NOT DEFERRABLE`, `INITIALLY IMMEDIATE`, dan `INITIALLY DEFERRED` pada constraint yang mendukungnya. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createtable.html?utm_source=chatgpt.com))

---

## 15. Pattern 12 - Constraint Naming Convention

Jangan biarkan nama constraint random/default jika aplikasinya perlu mapping error.

Rekomendasi format:

```text id="t7n9bs"
pk_<table>
fk_<child_table>__<parent_table>
uq_<table>__<business_meaning>
chk_<table>__<business_rule>
ex_<table>__<business_rule>
```

Contoh:

```sql id="2cnx1y"
CONSTRAINT pk_regulatory_case
    PRIMARY KEY (tenant_id, case_id),

CONSTRAINT uq_regulatory_case__case_number
    UNIQUE (tenant_id, case_number),

CONSTRAINT chk_regulatory_case__status_valid
    CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CLOSED')),

CONSTRAINT fk_case_party__regulatory_case
    FOREIGN KEY (tenant_id, case_id)
    REFERENCES regulatory_case (tenant_id, case_id)
```

Manfaat:

```text id="v2pfpy"
1. error mapping lebih stabil
2. logs lebih mudah dibaca
3. migration review lebih jelas
4. DBA/SRE lebih cepat mendiagnosis incident
```

---

## 16. Error Mapping SQLSTATE ke API

PostgreSQL error messages memiliki SQLSTATE lima karakter; aplikasi yang perlu tahu kondisi error sebaiknya mengecek error code, bukan pesan teks. ([PostgreSQL](https://www.postgresql.org/docs/current/errcodes-appendix.html?utm_source=chatgpt.com))

| SQLSTATE | PostgreSQL condition | Biasanya berarti | HTTP mapping praktis |
|---|---|---|---|
| `23502` | `not_null_violation` | Bug mapping/input kosong | `400` atau `500`, tergantung sumber |
| `23503` | `foreign_key_violation` | Parent tidak ada / stale reference | `400`, `404`, atau `409` |
| `23505` | `unique_violation` | Duplicate business key/idempotency | `409 Conflict` |
| `23514` | `check_violation` | Nilai invalid | `400 Bad Request` |
| `23P01` | `exclusion_violation` | Overlap/conflict resource | `409 Conflict` |
| `40001` | `serialization_failure` | Concurrent transaction conflict | Retry internal, lalu `409/503` jika gagal |
| `40P01` | `deadlock_detected` | Lock ordering conflict | Retry + investigate |
| `55P03` | `lock_not_available` | `NOWAIT`/`lock_timeout` | `409`, `423`, atau retry |

Practical rule:

```text id="bnsh05"
SQLSTATE memberi kategori.
Constraint name memberi konteks bisnis.
Gabungkan keduanya untuk response yang benar.
```

---

## 17. Java Exception Unwrapping

pgJDBC menyediakan `PSQLException`, dan `PSQLState` adalah class untuk menyimpan SQLState codes. ([pgJDBC](https://jdbc.postgresql.org/documentation/publicapi/org/postgresql/util/PSQLException.html?utm_source=chatgpt.com))

Helper umum:

```java id="cmxwfe"
public final class SqlExceptionUtil {
    private SqlExceptionUtil() {}

    public static Optional<SQLException> findSqlException(Throwable error) {
        Throwable current = error;

        while (current != null) {
            if (current instanceof SQLException sqlException) {
                return Optional.of(sqlException);
            }
            current = current.getCause();
        }

        return Optional.empty();
    }

    public static Optional<String> findSqlState(Throwable error) {
        return findSqlException(error).map(SQLException::getSQLState);
    }
}
```

Untuk PostgreSQL constraint name, biasanya bisa diambil dari `PSQLException#getServerErrorMessage()` jika exception chain masih membawa `PSQLException`.

```java id="ax8eap"
public final class PostgresExceptionUtil {
    private PostgresExceptionUtil() {}

    public static Optional<String> findConstraintName(Throwable error) {
        Throwable current = error;

        while (current != null) {
            if (current instanceof org.postgresql.util.PSQLException psqlException) {
                var serverError = psqlException.getServerErrorMessage();
                if (serverError != null && serverError.getConstraint() != null) {
                    return Optional.of(serverError.getConstraint());
                }
            }
            current = current.getCause();
        }

        return Optional.empty();
    }
}
```

---

## 18. Domain Error Mapper

```java id="146e0e"
public final class PersistenceErrorMapper {
    public RuntimeException map(RuntimeException error) {
        String sqlState = SqlExceptionUtil.findSqlState(error).orElse(null);
        String constraint = PostgresExceptionUtil.findConstraintName(error).orElse(null);

        if (sqlState == null) {
            return error;
        }

        return switch (sqlState) {
            case "23505" -> mapUniqueViolation(constraint, error);
            case "23503" -> mapForeignKeyViolation(constraint, error);
            case "23514" -> mapCheckViolation(constraint, error);
            case "23P01" -> new BusinessConflictException(
                "Requested period or resource overlaps with existing data", error
            );
            case "23502" -> new BadRequestException(
                "Required field is missing", error
            );
            default -> error;
        };
    }

    private RuntimeException mapUniqueViolation(String constraint, RuntimeException error) {
        if ("uq_regulatory_case__case_number".equals(constraint)) {
            return new BusinessConflictException("Case number already exists", error);
        }

        if ("uq_idempotency_request__key".equals(constraint)) {
            return new DuplicateRequestException("Duplicate idempotency key", error);
        }

        return new BusinessConflictException("Duplicate data violates uniqueness rule", error);
    }

    private RuntimeException mapForeignKeyViolation(String constraint, RuntimeException error) {
        if ("fk_case_party__regulatory_case".equals(constraint)) {
            return new NotFoundException("Case does not exist", error);
        }

        return new BusinessConflictException("Referenced data does not exist", error);
    }

    private RuntimeException mapCheckViolation(String constraint, RuntimeException error) {
        if ("chk_payment_instruction__amount_positive".equals(constraint)) {
            return new BadRequestException("Amount must be greater than zero", error);
        }

        return new BadRequestException("Input violates a validation rule", error);
    }
}
```

---

## 19. Jersey `ExceptionMapper`

```java id="0rtrwd"
@Provider
public final class BusinessExceptionMapper
        implements ExceptionMapper<BusinessException> {

    @Override
    public Response toResponse(BusinessException exception) {
        ErrorResponse body = new ErrorResponse(
            exception.errorCode(),
            exception.getMessage(),
            exception.correlationId()
        );

        return Response
            .status(exception.httpStatus())
            .type(MediaType.APPLICATION_JSON_TYPE)
            .entity(body)
            .build();
    }
}
```

Example domain exception:

```java id="a73z35"
public class BusinessConflictException extends BusinessException {
    public BusinessConflictException(String message, Throwable cause) {
        super("BUSINESS_CONFLICT", message, 409, cause);
    }
}
```

Practical rule:

```text id="vc59vj"
Jangan bocorkan raw database error ke API response.
Log detail constraint/SQLSTATE secara internal.
Return business-safe message ke client.
```

---

## 20. MyBatis Service Pattern

```java id="r1nfpa"
public final class CreateCaseService {
    private final SqlSessionFactory sqlSessionFactory;
    private final PersistenceErrorMapper errorMapper;

    public CreateCaseService(
            SqlSessionFactory sqlSessionFactory,
            PersistenceErrorMapper errorMapper
    ) {
        this.sqlSessionFactory = sqlSessionFactory;
        this.errorMapper = errorMapper;
    }

    public CreateCaseResult create(CreateCaseCommand command) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            RegulatoryCaseMapper mapper = session.getMapper(RegulatoryCaseMapper.class);

            mapper.insertCase(new RegulatoryCaseInsert(
                command.tenantId(),
                command.caseId(),
                command.caseNumber(),
                command.caseTypeCode(),
                "DRAFT",
                command.title(),
                command.actorId()
            ));

            session.commit();

            return new CreateCaseResult(
                command.tenantId(),
                command.caseId(),
                command.caseNumber()
            );
        } catch (RuntimeException error) {
            throw errorMapper.map(error);
        }
    }
}
```

Mapper XML:

```xml id="m8v2sp"
<insert id="insertCase">
  INSERT INTO regulatory_case (
      tenant_id,
      case_id,
      case_number,
      case_type_code,
      status,
      title,
      created_by,
      updated_by
  )
  VALUES (
      #{tenantId},
      #{caseId},
      #{caseNumber},
      #{caseTypeCode},
      #{status},
      #{title},
      #{actorId},
      #{actorId}
  )
</insert>
```

---

## 21. Migration Pattern: Add Constraint Safely

Menambah constraint di table besar bisa berat. Untuk PostgreSQL production, strategi umum:

```text id="i0yyc0"
1. bersihkan data lama dulu
2. add constraint dengan nama eksplisit
3. gunakan NOT VALID jika cocok untuk FK/CHECK
4. validate constraint terpisah
5. deploy aplikasi yang mengandalkan constraint
```

Contoh `CHECK`:

```sql id="7o67xy"
ALTER TABLE regulatory_case
ADD CONSTRAINT chk_regulatory_case__status_valid
CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CLOSED'))
NOT VALID;

ALTER TABLE regulatory_case
VALIDATE CONSTRAINT chk_regulatory_case__status_valid;
```

Contoh FK:

```sql id="om0dzp"
ALTER TABLE case_party
ADD CONSTRAINT fk_case_party__regulatory_case
FOREIGN KEY (tenant_id, case_id)
REFERENCES regulatory_case (tenant_id, case_id)
NOT VALID;

ALTER TABLE case_party
VALIDATE CONSTRAINT fk_case_party__regulatory_case;
```

PostgreSQL menyediakan `ALTER TABLE ... ADD CONSTRAINT` untuk menambah constraint, dan dokumentasi `ALTER TABLE` mencakup variasi constraint seperti `UNIQUE`, `PRIMARY KEY`, dan `FOREIGN KEY`. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-alter.html?utm_source=chatgpt.com))

Catatan praktis:

```text id="sfsdcu"
NOT VALID tidak berarti constraint nonaktif untuk data baru.
Ia dipakai agar validasi data lama bisa dipisah dari penambahan constraint.
```

---

## 22. Constraint vs Index: Jangan Campur Secara Mental

| Kebutuhan | Gunakan |
|---|---|
| Identitas row | `PRIMARY KEY` |
| Uniqueness business key semua row | `UNIQUE constraint` |
| Uniqueness subset row | `UNIQUE partial index` |
| Query acceleration | Index biasa |
| Referential integrity | `FOREIGN KEY` |
| Range overlap prevention | `EXCLUDE constraint` |
| Nilai dalam row valid | `CHECK` / `NOT NULL` |

Important distinction:

```text id="nwvu4p"
Constraint = aturan kebenaran data.
Index = struktur akses/performance, kecuali unique/exclusion yang juga menegakkan aturan.
```

---

## 23. Anti-Pattern

### Anti-pattern 1 - Validasi unik dengan `SELECT` dulu

Buruk:

```sql id="q8a69f"
SELECT 1
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND case_number = :caseNumber;

-- kalau tidak ada, aplikasi insert
```

Race condition:

```text id="6og8v1"
Dua request concurrent sama-sama melihat belum ada.
Dua-duanya insert.
Tanpa UNIQUE, duplicate masuk.
```

Benar:

```sql id="o49sg2"
ALTER TABLE regulatory_case
ADD CONSTRAINT uq_regulatory_case__case_number
UNIQUE (tenant_id, case_number);
```

Aplikasi tetap boleh pre-check untuk UX, tapi correctness harus dari unique constraint.

---

### Anti-pattern 2 - Semua constraint diberi nama default

Buruk:

```text id="945yvw"
regulatory_case_tenant_id_case_number_key
case_party_tenant_id_case_id_fkey
```

Masalah:

```text id="4einz6"
1. nama bisa berubah antar migration
2. mapping error sulit
3. log kurang jelas
```

Benar:

```sql id="s1s4qg"
CONSTRAINT uq_regulatory_case__case_number
UNIQUE (tenant_id, case_number)
```

---

### Anti-pattern 3 - `ON DELETE CASCADE` di domain regulated

Buruk:

```sql id="7eql2a"
FOREIGN KEY (tenant_id, case_id)
REFERENCES regulatory_case (tenant_id, case_id)
ON DELETE CASCADE
```

Risiko:

```text id="6y4tju"
satu delete parent bisa menghapus party, evidence, decision, audit-like detail
```

Lebih aman:

```sql id="6al4lm"
ON DELETE RESTRICT
```

atau soft delete:

```sql id="7bpxzc"
UPDATE regulatory_case
SET deleted_at = clock_timestamp(),
    deleted_by = :actorId
WHERE tenant_id = :tenantId
  AND case_id = :caseId;
```

---

### Anti-pattern 4 - `CHECK` terlalu kompleks

Buruk:

```sql id="z253xk"
CHECK (
  status != 'APPROVED'
  OR complex_business_logic(...)
)
```

Lebih baik:

```text id="zdz3q5"
1. constraint untuk invariant sederhana dan stabil
2. trigger/function untuk invariant yang butuh logic DB-side
3. service command handler untuk business flow kompleks
```

---

### Anti-pattern 5 - Deferrable dipakai untuk menutupi desain buruk

Deferrable bukan “mode longgar”. Ia hanya menunda check sampai commit. Kalau data akhir invalid, commit tetap gagal. `SET CONSTRAINTS` mengontrol kapan constraint deferrable diperiksa dalam transaksi. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-set-constraints.html?utm_source=chatgpt.com))

---

## 24. Review Checklist Constraint OLTP

| Checklist | Pertanyaan |
|---|---|
| PK jelas | Apakah setiap table punya identity yang tepat? |
| Tenant-aware | Apakah PK/FK/unique key penting membawa `tenant_id`? |
| Business uniqueness | Apakah uniqueness bisnis ditegakkan DB? |
| Nullable uniqueness | Apakah perilaku `NULL` sudah sesuai business meaning? |
| Active uniqueness | Apakah current/active row memakai partial unique index? |
| FK benar | Apakah child tidak bisa nyasar parent tenant lain? |
| Delete behavior aman | Apakah `CASCADE` hanya dipakai jika benar-benar aman? |
| Check cukup | Apakah value invariant sederhana sudah punya `CHECK`? |
| Temporal overlap | Apakah overlap harus dicegah dengan exclusion constraint? |
| Deferrable perlu | Apakah reorder/swap/circular relation butuh deferrable? |
| Constraint names stabil | Apakah nama constraint cocok untuk error mapping? |
| Error mapping | Apakah SQLSTATE + constraint name dipetakan ke domain error? |
| Migration aman | Apakah constraint baru pada table besar memakai strategi aman? |

---

## 25. Mini Lab

### Step 1 - Buat table

```sql id="46s2qx"
CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL,
    case_number  text NOT NULL,
    status       text NOT NULL,
    title        text NOT NULL,
    deleted_at   timestamptz,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT chk_regulatory_case__status_valid
        CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CLOSED')),

    CONSTRAINT chk_regulatory_case__title_not_blank
        CHECK (length(trim(title)) > 0)
);

CREATE UNIQUE INDEX uq_regulatory_case__active_number
ON regulatory_case (tenant_id, case_number)
WHERE deleted_at IS NULL;
```

### Step 2 - Insert valid row

```sql id="98p37u"
INSERT INTO regulatory_case (
    tenant_id,
    case_id,
    case_number,
    status,
    title
)
VALUES (
    1001,
    '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1001',
    'CASE-2026-0001',
    'DRAFT',
    'Suspicious activity review'
);
```

### Step 3 - Coba duplicate active number

```sql id="mb2zie"
INSERT INTO regulatory_case (
    tenant_id,
    case_id,
    case_number,
    status,
    title
)
VALUES (
    1001,
    '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1002',
    'CASE-2026-0001',
    'DRAFT',
    'Duplicate case number'
);
```

Expected:

```text id="q22gcp"
Gagal dengan unique violation.
Aplikasi harus map ke 409 Conflict.
```

### Step 4 - Coba status invalid

```sql id="q5qh5v"
INSERT INTO regulatory_case (
    tenant_id,
    case_id,
    case_number,
    status,
    title
)
VALUES (
    1001,
    '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1003',
    'CASE-2026-0002',
    'INVALID_STATUS',
    'Invalid status test'
);
```

Expected:

```text id="fksvt2"
Gagal dengan check violation.
Aplikasi harus map ke 400 Bad Request atau internal validation bug,
tergantung apakah status berasal dari client atau aplikasi.
```

### Step 5 - Soft delete lalu reuse number

```sql id="pw65fx"
UPDATE regulatory_case
SET deleted_at = clock_timestamp()
WHERE tenant_id = 1001
  AND case_number = 'CASE-2026-0001';

INSERT INTO regulatory_case (
    tenant_id,
    case_id,
    case_number,
    status,
    title
)
VALUES (
    1001,
    '018f3b4e-7c0e-7a2a-8f1b-3e2c5b0d1004',
    'CASE-2026-0001',
    'DRAFT',
    'Reused number after soft delete'
);
```

Expected:

```text id="d3g3i2"
Berhasil karena unique partial index hanya berlaku saat deleted_at IS NULL.
```

---

## 26. Ringkasan Praktis

```text id="xaab6s"
1. Constraint adalah safety net utama untuk invariant OLTP.
2. Application validation bagus untuk UX, tetapi DB constraint menjaga correctness.
3. Gunakan composite tenant-aware FK untuk multi-tenant system.
4. Gunakan UNIQUE untuk business key yang harus selalu unik.
5. Gunakan partial unique index untuk active/current/open uniqueness.
6. Gunakan NULLS NOT DISTINCT jika NULL juga harus dianggap sama.
7. Gunakan CHECK untuk invariant sederhana dalam satu row.
8. Gunakan EXCLUDE untuk no-overlap range/resource.
9. Gunakan DEFERRABLE hanya saat transaksi perlu state sementara yang invalid.
10. Error handling harus membaca SQLSTATE dan constraint name.
```

---

# Status Seri

**Seri 4/22 selesai.**

Rekomendasi lanjut ke:

**Seri 5 - PostgreSQL Data Types untuk Transactional System: `bigint`, identity, UUID/UUIDv7, `numeric`, `money`, `text`, enum, lookup table, `timestamptz`, `jsonb`, array, range, dan trade-off praktis untuk Java/Jersey/MyBatis.**

---

**Sources:**

- [PostgreSQL: Documentation: 18: Chapter 5. Data Definition](https://www.postgresql.org/docs/current/ddl.html?utm_source=chatgpt.com)
- [Class PSQLException](https://jdbc.postgresql.org/documentation/publicapi/org/postgresql/util/PSQLException.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:07:55 PM

Saya lanjut ke **Seri 5/22**. Fokusnya pemilihan tipe data untuk sistem transaksi: dampaknya ke correctness, indexing, Java mapping, storage, audit, dan migration.

# PostgreSQL OLTP - Seri 5/22  
## PostgreSQL Data Types untuk Transactional System: `bigint`, Identity, UUID/UUIDv7, `numeric`, `money`, `text`, Enum, Lookup Table, `timestamptz`, `jsonb`, Array, Range, dan Java/MyBatis Mapping

Seri ini fokus ke keputusan praktis:

> Tipe data apa yang harus dipakai untuk sistem OLTP production, apa konsekuensinya terhadap correctness, indexing, storage, query, audit, migration, dan mapping ke Java/Jersey/MyBatis?

PostgreSQL punya banyak native data type, dan user juga bisa membuat tipe sendiri dengan `CREATE TYPE`. Ini powerful, tapi untuk OLTP enterprise, prinsipnya bukan “pakai tipe paling canggih”, melainkan **pakai tipe yang menjaga invariant, mudah di-query, mudah di-index, dan aman saat schema berkembang**. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype.html?utm_source=chatgpt.com))

---

## 1. Mental Model Pemilihan Data Type

```text
Data type decision
│
├─ Correctness
│  ├─ apakah nilai bisa salah?
│  ├─ apakah perlu exact precision?
│  ├─ apakah timezone penting?
│  └─ apakah invariant bisa dikunci DB?
│
├─ Access pattern
│  ├─ equality lookup
│  ├─ range lookup
│  ├─ sorting
│  ├─ filtering
│  └─ join
│
├─ Evolution
│  ├─ apakah nilai sering berubah?
│  ├─ apakah butuh metadata?
│  ├─ apakah butuh backward compatibility?
│  └─ apakah migration murah?
│
├─ Java/MyBatis mapping
│  ├─ UUID ↔ java.util.UUID
│  ├─ numeric ↔ BigDecimal
│  ├─ timestamptz ↔ OffsetDateTime / Instant
│  ├─ jsonb ↔ String / JsonNode / PGobject
│  └─ enum/text ↔ Java enum/String
│
└─ Operational effect
   ├─ index size
   ├─ bloat
   ├─ vacuum pressure
   ├─ partition key suitability
   └─ replication/CDC payload
```

Rule utama:

```text
Core business field  → typed relational column.
Flexible metadata    → jsonb.
List kecil internal  → CHECK / enum.
Master data bisnis   → lookup/reference table.
Money/amount         → numeric, not float.
Time instant         → timestamptz.
```

---

## 2. Diagram Practical Data Type Map

```text
PostgreSQL OLTP Data Types
│
├─ Identity / Key
│  ├─ bigint
│  ├─ GENERATED AS IDENTITY
│  ├─ uuid
│  ├─ uuidv4
│  └─ uuidv7
│
├─ Numeric / Amount
│  ├─ integer
│  ├─ bigint
│  ├─ numeric(p, s)
│  ├─ double precision
│  └─ money
│
├─ Text / Code
│  ├─ text
│  ├─ varchar(n)
│  ├─ char(n)
│  ├─ citext extension
│  └─ CHECK non-blank
│
├─ Status / Classification
│  ├─ text + CHECK
│  ├─ enum
│  ├─ lookup table
│  └─ effective-dated lookup
│
├─ Date / Time
│  ├─ date
│  ├─ time
│  ├─ timestamp
│  ├─ timestamptz
│  └─ interval
│
├─ Semi-Structured
│  ├─ json
│  ├─ jsonb
│  ├─ array
│  └─ hstore extension
│
├─ Range / Temporal
│  ├─ daterange
│  ├─ tsrange
│  ├─ tstzrange
│  ├─ int8range
│  └─ multirange
│
├─ Binary / Large Object
│  ├─ bytea
│  └─ external object storage reference
│
└─ Java/MyBatis Mapping
   ├─ TypeHandler
   ├─ JDBC object mapping
   ├─ explicit casts
   ├─ resultMap
   └─ null handling
```

---

## 3. Practical Data Type Table

| Kategori | PostgreSQL type | Java type umum | Cocok untuk | Catatan praktis |
|---|---|---|---|---|
| Technical integer key | `bigint` | `Long` / `long` | Internal sequence ID, audit ID, history ID | Aman untuk growth besar |
| Generated key | `GENERATED ... AS IDENTITY` | `Long` | Surrogate key modern | Lebih standar daripada `serial` untuk schema baru |
| Distributed ID | `uuid` | `UUID` | Public ID, cross-service ID, idempotency ID | Hindari expose sequential ID jika security/privacy penting |
| Time-ordered UUID | `uuid` + `uuidv7()` | `UUID` | ID distributed yang lebih index-friendly | PostgreSQL current mendukung UUIDv4 dan UUIDv7 generation. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-uuid.html?utm_source=chatgpt.com)) |
| Exact amount | `numeric(p,s)` | `BigDecimal` | Uang, fee, penalty, percentage exact | Jangan pakai `double precision` untuk uang |
| Approximate metric | `double precision` | `Double` | Scientific/telemetry approximate | Bukan untuk balance/amount |
| Money | `money` | Biasanya dihindari | Legacy monetary display | Output locale-sensitive; dump/restore perlu `lc_monetary` kompatibel. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-money.html?utm_source=chatgpt.com)) |
| Text umum | `text` | `String` | Nama, title, description | Di PostgreSQL, `text` sering lebih praktis daripada `varchar(n)` tanpa alasan bisnis |
| Fixed code | `char(n)` / `text` + CHECK | `String` | ISO currency code, country code | `char(n)` punya padding behavior; sering lebih aman `text` + CHECK length |
| Status sederhana | `text` + CHECK | Java enum/String | Lifecycle kecil/stabil | Mudah migration dibanding PostgreSQL enum |
| Status sangat stabil | PostgreSQL `enum` | Java enum/String | Internal fixed state | Migration enum lebih kaku |
| Master data | Lookup table | String/code object | Case type, violation type, rule type | Bisa punya display name, active flag, effective date |
| Instant waktu | `timestamptz` | `Instant` / `OffsetDateTime` | Created/updated/occurred_at | Stored internally as UTC, displayed sesuai timezone session. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-datetime.html?utm_source=chatgpt.com)) |
| Local date | `date` | `LocalDate` | Tanggal lahir, tanggal dokumen, business date | Tidak merepresentasikan instant |
| Local date-time | `timestamp` | `LocalDateTime` | Jadwal lokal tanpa timezone | Berbahaya jika sebenarnya instant global |
| Duration | `interval` | `Duration` / custom | SLA, timeout, retention | Hati-hati month/year interval tidak sama dengan fixed duration |
| Semi-structured | `jsonb` | `JsonNode` / `String` / `PGobject` | Metadata, snapshot, payload | Bagus untuk fleksibilitas, buruk untuk core invariant |
| List kecil | Array | Java array/List | Tag internal, small list | Jangan mengganti child table jika perlu query/join/integrity |
| Period validity | `daterange`, `tstzrange` | custom/String/PGobject | Effective date, booking, no-overlap | Bisa dipakai dengan exclusion constraint |
| File bytes kecil | `bytea` | `byte[]` | Small binary payload | Untuk dokumen besar biasanya simpan object storage reference |
| Soft delete marker | `timestamptz` | `Instant` | `deleted_at` | Index partial `WHERE deleted_at IS NULL` |

---

# 4. Identity dan Key Type

## 4.1 `bigint` untuk internal monotonik ID

Contoh:

```sql
CREATE TABLE case_audit_log (
    tenant_id   bigint NOT NULL,
    audit_id    bigint GENERATED ALWAYS AS IDENTITY,
    case_id     uuid NOT NULL,
    event_type  text NOT NULL,
    occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_case_audit_log
        PRIMARY KEY (tenant_id, audit_id)
);
```

Identity column adalah mekanisme SQL-standard untuk generated value dan PostgreSQL mendukung `GENERATED ALWAYS AS IDENTITY` serta `GENERATED BY DEFAULT AS IDENTITY`. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createtable.html?utm_source=chatgpt.com))

Practical rule:

```text
Use bigint identity for internal append-only tables:
- audit
- history
- queue job
- outbox sequence
- import staging row
```

Kelebihan:

```text
compact
fast index
natural ordering
easy pagination by id
```

Kekurangan:

```text
not globally unique across systems
predictable if exposed externally
can become hot insert point under extreme write load
```

---

## 4.2 `uuid` untuk public/distributed ID

Contoh:

```sql
CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL,
    status       text NOT NULL,
    created_at   timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id)
);
```

PostgreSQL current menyediakan native `uuid` type dan native generation untuk UUIDv4 serta UUIDv7; `uuid` bisa menyimpan UUID dari algoritma apa pun. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-uuid.html?utm_source=chatgpt.com))

Practical comparison:

| ID type | Cocok untuk | Risiko |
|---|---|---|
| `bigint identity` | Internal DB-local ID, audit, history | Predictable, tidak distributed |
| `uuidv4` | Random public ID, cross-service generated ID | Random insert pattern lebih buruk untuk B-tree locality |
| `uuidv7` | Distributed ID dengan time-ordering | Masih perlu standardisasi antar-service/runtime |
| Natural key | Business key seperti `case_number` | Bisa berubah, bisa bocor, sering butuh format migration |

Rekomendasi:

```text
Root aggregate public ID       → uuid, prefer uuidv7 untuk schema baru di PostgreSQL 18+.
Internal append-only sequence  → bigint identity.
Business identifier            → separate unique column, jangan jadi satu-satunya PK.
```

---

## 4.3 Jangan Campur Technical ID dan Business Number

Buruk:

```sql
CREATE TABLE regulatory_case (
    case_number text PRIMARY KEY,
    title       text NOT NULL
);
```

Masalah:

```text
business number bisa berubah
format number bisa berubah
tenant scoping bisa berubah
external reference bisa expose internal domain
FK ikut membawa business semantics
```

Lebih aman:

```sql
CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL,
    title        text NOT NULL,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number)
);
```

---

# 5. Numeric Type untuk Transactional System

## 5.1 Integer family

| Type | Java | Cocok untuk |
|---|---|---|
| `smallint` | `Short` | enum-like numeric kecil, jarang perlu |
| `integer` | `Integer` | counter kecil, sort order |
| `bigint` | `Long` | ID, high-volume counter, audit sequence |

Rekomendasi OLTP:

```text
Untuk ID dan counter production: prefer bigint.
Untuk sort_order/priority kecil: integer cukup.
```

---

## 5.2 `numeric(p,s)` untuk uang/amount

Contoh:

```sql
CREATE TABLE penalty_assessment (
    tenant_id        bigint NOT NULL,
    assessment_id    uuid NOT NULL DEFAULT uuidv7(),
    case_id          uuid NOT NULL,
    penalty_amount   numeric(18, 2) NOT NULL,
    currency_code    text NOT NULL,
    created_at       timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_penalty_assessment
        PRIMARY KEY (tenant_id, assessment_id),

    CONSTRAINT chk_penalty_amount_positive
        CHECK (penalty_amount >= 0),

    CONSTRAINT chk_currency_code_iso_like
        CHECK (currency_code ~ '^[A-Z]{3}$')
);
```

Rule:

```text
Money/penalty/balance/rate exact → numeric + BigDecimal.
Jangan double/float untuk uang.
```

Java:

```java
public record PenaltyAssessmentRow(
    long tenantId,
    UUID assessmentId,
    UUID caseId,
    BigDecimal penaltyAmount,
    String currencyCode,
    Instant createdAt
) {}
```

---

## 5.3 Kenapa tidak pakai `money`?

PostgreSQL punya tipe `money`, tetapi output-nya locale-sensitive, dan dokumentasi memperingatkan dump/restore ke database dengan `lc_monetary` berbeda bisa bermasalah. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-money.html?utm_source=chatgpt.com))

Rekomendasi praktis:

```text
Untuk sistem enterprise/regulatory/financial:
- simpan amount sebagai numeric(precision, scale)
- simpan currency sebagai char/text code terpisah
- format currency di application/UI layer
```

Contoh:

```sql
amount        numeric(18, 2) NOT NULL,
currency_code text NOT NULL CHECK (currency_code ~ '^[A-Z]{3}$')
```

---

# 6. Text, `varchar`, `char`, dan Code Field

## 6.1 `text` sebagai default string umum

PostgreSQL punya `character varying`, `character`, dan `text`; untuk banyak field bisnis, `text` + constraint lebih jelas daripada `varchar(n)` tanpa alasan domain. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype.html?utm_source=chatgpt.com))

Contoh:

```sql
title text NOT NULL,
description text,
```

Tambahkan non-blank check:

```sql
CONSTRAINT chk_regulatory_case__title_not_blank
CHECK (length(trim(title)) > 0)
```

---

## 6.2 Kapan `varchar(n)` berguna?

Gunakan kalau limit adalah bagian dari contract bisnis atau integrasi:

```sql
external_reference varchar(64) NOT NULL,
swift_code varchar(11),
```

Bukan karena “lebih cepat”. Pakai karena:

```text
external system hanya menerima 64 char
regulation membatasi field length
legacy system contract fixed
```

---

## 6.3 Kapan `char(n)`?

Hati-hati, `char(n)` blank-padded. Untuk kode seperti currency/country, saya lebih suka:

```sql
currency_code text NOT NULL
    CHECK (currency_code ~ '^[A-Z]{3}$')
```

Daripada:

```sql
currency_code char(3)
```

Kecuali tim sudah paham padding behavior dan punya alasan konsisten.

---

# 7. Status, Enum, Lookup Table

## 7.1 Opsi A - `text` + `CHECK`

```sql
CREATE TABLE regulatory_case (
    tenant_id bigint NOT NULL,
    case_id uuid NOT NULL,
    status text NOT NULL,

    CONSTRAINT chk_regulatory_case__status_valid
    CHECK (status IN (
        'DRAFT',
        'SUBMITTED',
        'UNDER_REVIEW',
        'APPROVED',
        'REJECTED',
        'CLOSED'
    ))
);
```

Cocok untuk:

```text
status kecil
perubahan jarang
tidak butuh display name
tidak butuh active flag
tidak butuh effective dating
```

Kelebihan:

```text
migration sederhana
mudah dibaca
Java mapping fleksibel
```

---

## 7.2 Opsi B - PostgreSQL enum

```sql
CREATE TYPE case_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'APPROVED',
    'REJECTED',
    'CLOSED'
);

CREATE TABLE regulatory_case (
    tenant_id bigint NOT NULL,
    case_id uuid NOT NULL,
    status case_status NOT NULL
);
```

PostgreSQL mendukung enumerated types sebagai static ordered set of values. ([PostgreSQL](https://www.postgresql.org/docs/current/bookindex.html?utm_source=chatgpt.com))

Cocok untuk:

```text
nilai sangat stabil
domain internal kuat
ingin type safety di DB
```

Hindari jika:

```text
status sering ditambah/diubah
butuh disable status lama
butuh metadata/display name
butuh effective date
butuh banyak environment migration fleksibel
```

---

## 7.3 Opsi C - Lookup/reference table

```sql
CREATE TABLE ref_case_status (
    status_code  text PRIMARY KEY,
    display_name text NOT NULL,
    sort_order   integer NOT NULL DEFAULT 100,
    is_active    boolean NOT NULL DEFAULT true
);

CREATE TABLE regulatory_case (
    tenant_id bigint NOT NULL,
    case_id uuid NOT NULL,
    status_code text NOT NULL,

    CONSTRAINT fk_regulatory_case__status
    FOREIGN KEY (status_code)
    REFERENCES ref_case_status (status_code)
);
```

Cocok untuk:

```text
master data bisnis
perlu display label
perlu sort order
perlu active/inactive
perlu governance/admin UI
```

Practical recommendation:

| Use case | Pilihan |
|---|---|
| Internal fixed lifecycle | `text` + `CHECK` atau enum |
| Master data regulasi | Lookup table |
| Status yang perlu transition matrix | Lookup + transition table |
| Status yang perlu metadata | Lookup table |
| Field API yang harus fleksibel | `text` + validation layer + DB constraint |

---

# 8. Date and Time

## 8.1 `timestamptz` untuk instant global

PostgreSQL `timestamp with time zone` disimpan secara internal sebagai UTC dan ditampilkan sesuai timezone session; original timezone input tidak disimpan. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-datetime.html?utm_source=chatgpt.com))

Gunakan untuk:

```text
created_at
updated_at
deleted_at
occurred_at
submitted_at
approved_at
locked_at
published_at
```

Contoh:

```sql
created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
```

Java:

```java
public record CaseRow(
    UUID caseId,
    Instant createdAt,
    Instant updatedAt
) {}
```

atau:

```java
public record CaseRow(
    UUID caseId,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {}
```

Practical rule:

```text
Jika field merepresentasikan moment aktual di dunia → timestamptz.
```

---

## 8.2 `timestamp without time zone` untuk local date-time

Gunakan hanya jika memang local civil time tanpa instant global.

Contoh:

```text
kantor buka jam lokal tertentu
jadwal event lokal sebelum timezone diketahui
template schedule
```

Hindari untuk:

```text
created_at
updated_at
audit occurred_at
event published_at
SLA deadline global
```

Karena `timestamp without time zone` tidak menyimpan timezone dan PostgreSQL akan mengabaikan timezone indication pada input yang sudah ditentukan sebagai timestamp without time zone. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-datetime.html?utm_source=chatgpt.com))

---

## 8.3 `date` untuk business date

Cocok untuk:

```text
effective_date
birth_date
document_date
business_date
valid_from / valid_to berbasis hari
```

Contoh:

```sql
valid_from date NOT NULL,
valid_to date,
CONSTRAINT chk_valid_range
CHECK (valid_to IS NULL OR valid_to > valid_from)
```

---

## 8.4 Jangan terlalu bebas pakai `now()`

Dalam PostgreSQL, beberapa fungsi waktu memiliki semantics berbeda. Untuk audit mutation, saya biasanya pilih eksplisit:

```sql
clock_timestamp()
```

Untuk consistency seluruh transaksi, bisa pakai:

```sql
transaction_timestamp()
```

Practical distinction:

| Function | Makna praktis |
|---|---|
| `transaction_timestamp()` / `now()` | waktu start transaksi |
| `statement_timestamp()` | waktu start statement |
| `clock_timestamp()` | waktu real saat function dipanggil |

Untuk audit per-row dalam transaksi panjang, `clock_timestamp()` lebih mencerminkan waktu actual operation. Untuk semua row dalam satu command ingin timestamp sama, pakai value dari aplikasi atau `transaction_timestamp()`.

---

# 9. JSON vs JSONB

PostgreSQL mendukung tipe `json` dan `jsonb`; `jsonb` adalah pilihan umum untuk query/index karena disimpan dalam binary decomposed form dan mendukung operator/indexing yang lebih praktis. Fungsi dan operator JSON/JSONB didokumentasikan resmi di PostgreSQL current. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html?utm_source=chatgpt.com))

Gunakan `jsonb` untuk:

```text
metadata
audit before/after snapshot
outbox payload
request/response snapshot
external system raw payload
feature-specific flexible attributes
```

Contoh:

```sql
CREATE TABLE case_audit_log (
    tenant_id      bigint NOT NULL,
    audit_id       bigint GENERATED ALWAYS AS IDENTITY,
    case_id        uuid NOT NULL,
    event_type     text NOT NULL,
    before_state   jsonb,
    after_state    jsonb,
    metadata       jsonb NOT NULL DEFAULT '{}'::jsonb,
    occurred_at    timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_case_audit_log
        PRIMARY KEY (tenant_id, audit_id),

    CONSTRAINT chk_metadata_is_object
        CHECK (jsonb_typeof(metadata) = 'object')
);
```

Query:

```sql
SELECT audit_id, event_type, occurred_at
FROM case_audit_log
WHERE tenant_id = :tenantId
  AND metadata ->> 'correlationId' = :correlationId;
```

Index expression:

```sql
CREATE INDEX idx_case_audit_correlation_id
ON case_audit_log ((metadata ->> 'correlationId'));
```

GIN index untuk query containment:

```sql
CREATE INDEX idx_case_audit_metadata_gin
ON case_audit_log
USING gin (metadata);
```

Practical rule:

```text
jsonb boleh untuk payload fleksibel.
jsonb jangan dipakai untuk field yang sering di-filter, di-join, atau menjadi invariant utama tanpa alasan kuat.
```

Buruk:

```sql
payload jsonb -- menyimpan status, case_number, tenant_id, amount, semua core field
```

Lebih baik:

```sql
tenant_id bigint,
case_number text,
status text,
amount numeric(18,2),
payload jsonb -- metadata tambahan
```

---

# 10. Array Type

PostgreSQL mendukung array dengan menambahkan `[]` pada tipe elemen. ([PostgreSQL](https://www.postgresql.org/docs/current/arrays.html?utm_source=chatgpt.com))

Contoh:

```sql
CREATE TABLE notification_preference (
    tenant_id   bigint NOT NULL,
    user_id     uuid NOT NULL,
    channels    text[] NOT NULL DEFAULT ARRAY[]::text[],

    CONSTRAINT pk_notification_preference
        PRIMARY KEY (tenant_id, user_id)
);
```

Cocok untuk:

```text
small list
tidak perlu FK per item
tidak perlu audit per item
tidak sering join
```

Hindari array untuk:

```text
case parties
assigned officers
document references
role membership yang perlu FK
data yang perlu row-level audit
```

Buruk:

```sql
assigned_officer_ids uuid[]
```

Lebih baik:

```sql
CREATE TABLE case_assignment (
    tenant_id uuid,
    case_id uuid,
    officer_id uuid,
    assigned_at timestamptz
);
```

Rule:

```text
Jika item dalam list punya lifecycle, permission, audit, atau FK → pakai child table.
```

---

# 11. Range dan Multirange Type

PostgreSQL punya range dan multirange types, termasuk built-in range seperti `int4range`, `int8range`, `numrange`, `tsrange`, `tstzrange`, dan `daterange`; range dapat di-index dan dipakai dalam constraint seperti no-overlap. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype.html?utm_source=chatgpt.com))

Use case OLTP:

```text
rule effective period
assignment validity
booking/reservation
case ownership period
SLA window
blackout period
```

Contoh effective-dated rule:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE ref_rule_version (
    rule_version_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rule_code       text NOT NULL,
    valid_period    daterange NOT NULL,
    rule_payload    jsonb NOT NULL,

    CONSTRAINT chk_rule_period_not_empty
        CHECK (NOT isempty(valid_period)),

    CONSTRAINT ex_rule_version__no_overlap
        EXCLUDE USING gist (
            rule_code WITH =,
            valid_period WITH &&
        )
);
```

Insert:

```sql
INSERT INTO ref_rule_version (
    rule_code,
    valid_period,
    rule_payload
)
VALUES (
    'AML-RISK-SCORE',
    daterange(date '2026-01-01', date '2027-01-01', '[)'),
    '{"version": "2026.1"}'::jsonb
);
```

Query active rule:

```sql
SELECT rule_version_id, rule_payload
FROM ref_rule_version
WHERE rule_code = :ruleCode
  AND valid_period @> :businessDate::date;
```

Practical recommendation:

```text
Untuk periode yang harus anti-overlap, range + exclusion constraint jauh lebih aman
daripada valid_from/valid_to dengan validasi Java saja.
```

---

# 12. Boolean Type

`boolean` cocok untuk flag sederhana:

```sql
is_active boolean NOT NULL DEFAULT true
```

Tapi jangan pakai boolean untuk lifecycle yang akan berkembang.

Buruk:

```sql
is_approved boolean NOT NULL DEFAULT false
```

Nanti muncul:

```text
draft
submitted
under_review
approved
rejected
cancelled
closed
```

Lebih baik:

```sql
status text NOT NULL CHECK (status IN (...))
```

Rule:

```text
Boolean hanya untuk state benar-benar binary dan stabil.
Lifecycle bisnis hampir selalu butuh status, bukan boolean.
```

---

# 13. Binary / Document Storage

Untuk binary kecil:

```sql
content bytea NOT NULL
```

Untuk dokumen besar enterprise:

```sql
CREATE TABLE case_document (
    tenant_id       bigint NOT NULL,
    document_id     uuid NOT NULL DEFAULT uuidv7(),
    case_id         uuid NOT NULL,
    storage_bucket  text NOT NULL,
    storage_key     text NOT NULL,
    sha256_hash     text NOT NULL,
    mime_type       text NOT NULL,
    size_bytes      bigint NOT NULL,
    uploaded_at     timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_case_document
        PRIMARY KEY (tenant_id, document_id),

    CONSTRAINT chk_case_document__size_positive
        CHECK (size_bytes > 0)
);
```

Practical rule:

```text
Small binary config/template → bytea boleh.
Large uploaded document      → object storage + metadata in PostgreSQL.
```

Alasan:

```text
backup size
replication overhead
DB bloat
streaming/download performance
retention policy
malware scanning pipeline
```

---

# 14. Domain Type

PostgreSQL mendukung domain types, yaitu tipe berbasis tipe lain dengan constraint tambahan. Ini berguna jika validasi yang sama dipakai banyak tempat. ([PostgreSQL](https://www.postgresql.org/docs/current/bookindex.html?utm_source=chatgpt.com))

Contoh:

```sql
CREATE DOMAIN currency_code AS text
CHECK (VALUE ~ '^[A-Z]{3}$');

CREATE TABLE payment_instruction (
    tenant_id     bigint NOT NULL,
    instruction_id uuid NOT NULL,
    amount        numeric(18,2) NOT NULL,
    currency      currency_code NOT NULL
);
```

Kapan cocok:

```text
validasi sangat stabil
dipakai luas
ingin consistency lintas table
```

Hati-hati:

```text
migration domain constraint berdampak banyak table
beberapa tooling/mapping perlu dites
```

---

# 15. Generated Column

Generated column berguna untuk derived value yang harus konsisten. PostgreSQL current mendukung generated columns, termasuk virtual dan stored generated columns. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype.html?utm_source=chatgpt.com))

Contoh normalized search key:

```sql
CREATE TABLE customer_profile (
    tenant_id       bigint NOT NULL,
    customer_id     uuid NOT NULL DEFAULT uuidv7(),
    display_name    text NOT NULL,
    normalized_name text GENERATED ALWAYS AS (lower(trim(display_name))) STORED,

    CONSTRAINT pk_customer_profile
        PRIMARY KEY (tenant_id, customer_id)
);

CREATE INDEX idx_customer_profile__normalized_name
ON customer_profile (tenant_id, normalized_name);
```

Use case:

```text
normalized code
lowercase email
computed partition helper
derived invariant sederhana
```

Hindari untuk:

```text
logic kompleks
logic butuh query table lain
business rule sering berubah
```

---

# 16. Practical Schema Example: OLTP Case Core

```sql
CREATE TABLE regulatory_case (
    tenant_id       bigint NOT NULL,
    case_id         uuid NOT NULL DEFAULT uuidv7(),
    case_number     text NOT NULL,
    case_type_code  text NOT NULL,
    status          text NOT NULL,
    title           text NOT NULL,
    priority        text NOT NULL DEFAULT 'NORMAL',
    risk_score      numeric(8, 4),
    metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
    version         bigint NOT NULL DEFAULT 0,
    submitted_at    timestamptz,
    created_by      text NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT clock_timestamp(),
    updated_by      text NOT NULL,
    updated_at      timestamptz NOT NULL DEFAULT clock_timestamp(),
    deleted_at      timestamptz,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number),

    CONSTRAINT chk_regulatory_case__status_valid
        CHECK (status IN (
            'DRAFT',
            'SUBMITTED',
            'UNDER_REVIEW',
            'APPROVED',
            'REJECTED',
            'CLOSED'
        )),

    CONSTRAINT chk_regulatory_case__priority_valid
        CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'CRITICAL')),

    CONSTRAINT chk_regulatory_case__title_not_blank
        CHECK (length(trim(title)) > 0),

    CONSTRAINT chk_regulatory_case__metadata_object
        CHECK (jsonb_typeof(metadata) = 'object'),

    CONSTRAINT chk_regulatory_case__risk_score_range
        CHECK (risk_score IS NULL OR risk_score BETWEEN 0 AND 1)
);
```

Index:

```sql
CREATE INDEX idx_regulatory_case__tenant_status_created
ON regulatory_case (tenant_id, status, created_at DESC)
WHERE deleted_at IS NULL;

CREATE INDEX idx_regulatory_case__metadata_gin
ON regulatory_case
USING gin (metadata);
```

---

# 17. Java/MyBatis Mapping Table

| PostgreSQL | Java recommended | Catatan |
|---|---|---|
| `bigint` | `Long` / `long` | Primitive jika `NOT NULL`, wrapper jika nullable |
| `integer` | `Integer` / `int` | Sama |
| `numeric` | `BigDecimal` | Jangan `double` untuk exact amount |
| `text` | `String` | Default untuk string |
| `uuid` | `UUID` | pgJDBC mendukung tipe UUID |
| `date` | `LocalDate` | Business date |
| `timestamp` | `LocalDateTime` | Local timestamp |
| `timestamptz` | `OffsetDateTime` / `Instant` | Standardisasi satu pendekatan di codebase |
| `jsonb` | `String`, `JsonNode`, atau `PGobject` | Butuh TypeHandler jika ingin `JsonNode` |
| `text[]` | `List<String>` / `String[]` | Butuh TypeHandler/Array handling |
| `enum` | `String` / Java enum | Pastikan migration enum DB dan Java sinkron |
| range | custom value object | Biasanya perlu TypeHandler custom |

pgJDBC adalah driver resmi yang memungkinkan program Java terhubung ke PostgreSQL menggunakan standard database-independent Java code, dan API publiknya menyediakan class seperti `PGobject`, OID constants, serta utility untuk tipe PostgreSQL tertentu. ([pgJDBC](https://jdbc.postgresql.org/?utm_source=chatgpt.com))

---

# 18. MyBatis TypeHandler untuk `jsonb`

## 18.1 Simpan `JsonNode` sebagai `jsonb`

```java
@MappedTypes(JsonNode.class)
@MappedJdbcTypes(JdbcType.OTHER)
public final class JsonNodeTypeHandler extends BaseTypeHandler<JsonNode> {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Override
    public void setNonNullParameter(
            PreparedStatement ps,
            int i,
            JsonNode parameter,
            JdbcType jdbcType
    ) throws SQLException {
        PGobject jsonObject = new PGobject();
        jsonObject.setType("jsonb");
        jsonObject.setValue(parameter.toString());
        ps.setObject(i, jsonObject);
    }

    @Override
    public JsonNode getNullableResult(ResultSet rs, String columnName)
            throws SQLException {
        return parse(rs.getString(columnName));
    }

    @Override
    public JsonNode getNullableResult(ResultSet rs, int columnIndex)
            throws SQLException {
        return parse(rs.getString(columnIndex));
    }

    @Override
    public JsonNode getNullableResult(CallableStatement cs, int columnIndex)
            throws SQLException {
        return parse(cs.getString(columnIndex));
    }

    private JsonNode parse(String value) throws SQLException {
        if (value == null) {
            return null;
        }

        try {
            return OBJECT_MAPPER.readTree(value);
        } catch (JsonProcessingException e) {
            throw new SQLException("Failed to parse jsonb value", e);
        }
    }
}
```

Mapper:

```xml
<insert id="insertAuditLog">
  INSERT INTO case_audit_log (
      tenant_id,
      case_id,
      event_type,
      metadata
  )
  VALUES (
      #{tenantId},
      #{caseId},
      #{eventType},
      #{metadata, typeHandler=com.example.JsonNodeTypeHandler}
  )
</insert>
```

Practical rule:

```text
Kalau jsonb hanya lewat tanpa diproses Java → String cukup.
Kalau Java perlu inspect/transform → JsonNode + TypeHandler.
```

---

# 19. MyBatis Mapping untuk UUID dan Time

Row model:

```java
public record RegulatoryCaseRow(
    long tenantId,
    UUID caseId,
    String caseNumber,
    String caseTypeCode,
    String status,
    String title,
    String priority,
    BigDecimal riskScore,
    JsonNode metadata,
    long version,
    OffsetDateTime submittedAt,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {}
```

Mapper XML:

```xml
<resultMap id="RegulatoryCaseRowMap" type="com.example.RegulatoryCaseRow">
  <constructor>
    <arg column="tenant_id" javaType="long"/>
    <arg column="case_id" javaType="java.util.UUID"/>
    <arg column="case_number" javaType="string"/>
    <arg column="case_type_code" javaType="string"/>
    <arg column="status" javaType="string"/>
    <arg column="title" javaType="string"/>
    <arg column="priority" javaType="string"/>
    <arg column="risk_score" javaType="java.math.BigDecimal"/>
    <arg column="metadata" javaType="com.fasterxml.jackson.databind.JsonNode"
         typeHandler="com.example.JsonNodeTypeHandler"/>
    <arg column="version" javaType="long"/>
    <arg column="submitted_at" javaType="java.time.OffsetDateTime"/>
    <arg column="created_at" javaType="java.time.OffsetDateTime"/>
    <arg column="updated_at" javaType="java.time.OffsetDateTime"/>
  </constructor>
</resultMap>
```

Select:

```xml
<select id="findById" resultMap="RegulatoryCaseRowMap">
  SELECT
      tenant_id,
      case_id,
      case_number,
      case_type_code,
      status,
      title,
      priority,
      risk_score,
      metadata,
      version,
      submitted_at,
      created_at,
      updated_at
  FROM regulatory_case
  WHERE tenant_id = #{tenantId}
    AND case_id = #{caseId}
    AND deleted_at IS NULL
</select>
```

---

# 20. Explicit Casts di MyBatis untuk PostgreSQL

Kadang PostgreSQL perlu cast eksplisit, terutama untuk `jsonb`, enum, range, array.

Contoh JSONB:

```xml
<update id="patchCaseMetadata">
  UPDATE regulatory_case
  SET metadata = metadata || #{patchJson}::jsonb,
      version = version + 1,
      updated_at = clock_timestamp()
  WHERE tenant_id = #{tenantId}
    AND case_id = #{caseId}
  RETURNING tenant_id, case_id, metadata, version
</update>
```

Masalah: `#{patchJson}::jsonb` kadang tidak aman tergantung parser MyBatis. Alternatif lebih aman:

```xml
<update id="patchCaseMetadata">
  UPDATE regulatory_case
  SET metadata = metadata || CAST(#{patchJson} AS jsonb),
      version = version + 1,
      updated_at = clock_timestamp()
  WHERE tenant_id = #{tenantId}
    AND case_id = #{caseId}
</update>
```

Enum cast:

```xml
<update id="updateStatus">
  UPDATE regulatory_case
  SET status = CAST(#{status} AS case_status)
  WHERE tenant_id = #{tenantId}
    AND case_id = #{caseId}
</update>
```

Array cast:

```xml
<select id="findByStatuses" resultMap="RegulatoryCaseRowMap">
  SELECT *
  FROM regulatory_case
  WHERE tenant_id = #{tenantId}
    AND status = ANY(CAST(#{statuses} AS text[]))
</select>
```

---

# 21. Data Type Decision Matrix

| Pertanyaan | Pilihan praktis |
|---|---|
| Apakah nilai butuh exact precision? | `numeric`, Java `BigDecimal` |
| Apakah nilai adalah money? | `numeric(p,s)` + `currency_code`, bukan `money` |
| Apakah nilai adalah instant waktu? | `timestamptz` |
| Apakah nilai hanya tanggal bisnis? | `date` |
| Apakah nilai adalah lifecycle yang bisa bertambah? | `text` + `CHECK` atau lookup |
| Apakah nilai adalah master data dengan metadata? | Lookup table |
| Apakah ID akan dibuat lintas service? | `uuid`, prefer UUIDv7 jika tersedia/standardized |
| Apakah ID hanya internal append-only? | `bigint identity` |
| Apakah list punya lifecycle/FK/audit? | Child table, bukan array |
| Apakah metadata fleksibel? | `jsonb` |
| Apakah field sering difilter/join? | Relational column, bukan JSON-only |
| Apakah periode tidak boleh overlap? | Range + exclusion constraint |
| Apakah binary besar? | Object storage reference + DB metadata |

---

# 22. Anti-Pattern

## Anti-pattern 1 - `double precision` untuk uang

Buruk:

```sql
amount double precision NOT NULL
```

Lebih baik:

```sql
amount numeric(18, 2) NOT NULL
```

Java:

```java
BigDecimal amount
```

---

## Anti-pattern 2 - Semua ID pakai UUID random tanpa alasan

UUIDv4 bagus untuk distributed uniqueness, tapi random insert pattern bisa memperbesar index churn dibanding ID yang lebih ordered. Untuk PostgreSQL 18+, pertimbangkan `uuidv7()` jika cocok dengan standard platform. PostgreSQL current mendokumentasikan native UUIDv4 dan UUIDv7 generation. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-uuid.html?utm_source=chatgpt.com))

---

## Anti-pattern 3 - `timestamp without time zone` untuk audit

Buruk:

```sql
created_at timestamp NOT NULL
```

Lebih aman:

```sql
created_at timestamptz NOT NULL DEFAULT clock_timestamp()
```

PostgreSQL menyimpan timezone-aware timestamp secara internal sebagai UTC dan mengonversinya saat output sesuai timezone session. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-datetime.html?utm_source=chatgpt.com))

---

## Anti-pattern 4 - Core domain field disembunyikan di `jsonb`

Buruk:

```sql
CREATE TABLE regulatory_case (
    tenant_id bigint,
    payload jsonb
);
```

Lalu query:

```sql
WHERE payload ->> 'status' = 'SUBMITTED'
```

Lebih baik:

```sql
status text NOT NULL,
metadata jsonb NOT NULL DEFAULT '{}'::jsonb
```

---

## Anti-pattern 5 - Boolean untuk lifecycle

Buruk:

```sql
is_submitted boolean,
is_approved boolean,
is_rejected boolean
```

Lebih baik:

```sql
status text NOT NULL CHECK (status IN (...))
```

---

## Anti-pattern 6 - Array untuk child entity

Buruk:

```sql
party_names text[]
```

Lebih baik:

```sql
case_party (
    tenant_id,
    case_id,
    party_id,
    party_role,
    display_name
)
```

---

# 23. Production Checklist

| Checklist | Pertanyaan |
|---|---|
| ID strategy jelas | Root aggregate pakai UUID/identity dengan alasan? |
| Business key terpisah | Apakah business number tidak dijadikan satu-satunya PK? |
| Amount exact | Apakah uang/penalty/rate pakai `numeric`? |
| No float for money | Apakah tidak ada `double precision` untuk amount? |
| Timezone aman | Apakah audit timestamp pakai `timestamptz`? |
| Status evolvable | Apakah enum/CHECK/lookup dipilih dengan alasan volatility? |
| Text constraint | Apakah field wajib punya non-blank check? |
| JSONB terkendali | Apakah core query field tetap column biasa? |
| Array tidak disalahgunakan | Apakah list dengan lifecycle jadi child table? |
| Range dipakai bila perlu | Apakah no-overlap memakai range/exclusion? |
| Java mapping aman | Apakah `numeric` ke `BigDecimal`, UUID ke `UUID`, timestamp ke `java.time`? |
| TypeHandler tersedia | Apakah `jsonb`, array, range punya handler/test? |
| Cast eksplisit | Apakah mapper PostgreSQL-specific punya cast yang jelas? |
| Migration impact | Apakah perubahan type sudah diuji pada data besar? |

---

# 24. Mini Lab

## Step 1 - Buat table case

```sql
CREATE TABLE regulatory_case (
    tenant_id       bigint NOT NULL,
    case_id         uuid NOT NULL DEFAULT uuidv7(),
    case_number     text NOT NULL,
    status          text NOT NULL,
    amount          numeric(18, 2),
    metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
    valid_period    daterange,
    created_at      timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number),

    CONSTRAINT chk_regulatory_case__status_valid
        CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED')),

    CONSTRAINT chk_regulatory_case__amount_non_negative
        CHECK (amount IS NULL OR amount >= 0),

    CONSTRAINT chk_regulatory_case__metadata_object
        CHECK (jsonb_typeof(metadata) = 'object')
);
```

## Step 2 - Insert valid row

```sql
INSERT INTO regulatory_case (
    tenant_id,
    case_number,
    status,
    amount,
    metadata,
    valid_period
)
VALUES (
    1001,
    'CASE-2026-0001',
    'DRAFT',
    125000.50,
    '{"source": "portal", "riskLevel": "HIGH"}'::jsonb,
    daterange(date '2026-01-01', date '2026-12-31', '[)')
)
RETURNING tenant_id, case_id, created_at;
```

## Step 3 - Coba invalid amount

```sql
INSERT INTO regulatory_case (
    tenant_id,
    case_number,
    status,
    amount
)
VALUES (
    1001,
    'CASE-2026-0002',
    'DRAFT',
    -10.00
);
```

Expected:

```text
check violation
```

## Step 4 - Query JSONB metadata

```sql
SELECT case_number, metadata ->> 'riskLevel' AS risk_level
FROM regulatory_case
WHERE tenant_id = 1001
  AND metadata @> '{"riskLevel": "HIGH"}'::jsonb;
```

## Step 5 - Query date range

```sql
SELECT case_number
FROM regulatory_case
WHERE tenant_id = 1001
  AND valid_period @> date '2026-06-01';
```

---

# 25. Ringkasan Praktis

```text
1. Untuk OLTP, data type adalah bagian dari correctness model.
2. Root aggregate ID: uuid; internal append-only ID: bigint identity.
3. PostgreSQL 18 current mendukung UUIDv4 dan UUIDv7 generation.
4. Amount/money: numeric + BigDecimal, bukan float/double.
5. Hindari money untuk sistem enterprise karena locale-sensitive.
6. Audit timestamp: timestamptz.
7. Local business date: date.
8. Status: pilih text+CHECK, enum, atau lookup berdasarkan volatility.
9. jsonb cocok untuk metadata/payload/snapshot, bukan core invariant utama.
10. Array hanya untuk list kecil tanpa lifecycle; child entity tetap pakai table.
11. Range type kuat untuk effective period dan no-overlap.
12. MyBatis butuh mapping/type handler/cast eksplisit untuk tipe PostgreSQL-specific.
```

---

# Status Seri

**Seri 5/22 selesai.**

Rekomendasi lanjut ke:

**Seri 6 - Key Design untuk PostgreSQL OLTP: `bigserial` vs identity, UUIDv4 vs UUIDv7, natural key vs surrogate key, business number generator, tenant-scoped sequence, idempotency key, dan impact terhadap indexing/concurrency di Java/Jersey/MyBatis.**

---

**Sources:**

- [Documentation: 18: Chapter 8. Data Types](https://www.postgresql.org/docs/current/datatype.html?utm_source=chatgpt.com)
- [PostgreSQL JDBC Driver](https://jdbc.postgresql.org/?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:10:27 PM

Saya lanjut ke **Seri 6/22**. Seri ini akan fokus ke desain key yang sering jadi akar masalah OLTP: surrogate vs natural key, identity vs UUID, UUIDv7, business number generator, tenant-scoped sequence, idempotency key, dan dampaknya ke index/concurrency.

# PostgreSQL OLTP - Seri 6/22  
## Key Design: Identity, Sequence, UUIDv4/UUIDv7, Natural Key, Surrogate Key, Business Number, Tenant-Scoped Number, dan Idempotency Key

Seri ini membahas desain key untuk OLTP production. Ini sering terlihat sederhana, tapi dampaknya besar ke:

```text id="ipetmo"
1. correctness
2. index locality
3. concurrency
4. public API design
5. auditability
6. migration
7. multi-tenant isolation
8. idempotency
9. integration antar-service
```

PostgreSQL current saat ini adalah dokumentasi PostgreSQL 18; di dokumentasi tersebut PostgreSQL 19 masih development version, jadi contoh production di seri ini saya rujuk ke PostgreSQL 18/current. Dokumentasi PostgreSQL 18 juga menyebut native UUID generation untuk UUIDv4 dan UUIDv7. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-uuid.html))

---

## 1. Mental Model

```text id="n7yrgl"
Key Design
│
├─ Technical identity
│  ├─ row identity
│  ├─ FK target
│  ├─ internal join
│  └─ immutable
│
├─ Business identity
│  ├─ case number
│  ├─ customer number
│  ├─ invoice number
│  ├─ external reference
│  └─ may change / may be formatted
│
├─ Public identity
│  ├─ URL/API identifier
│  ├─ non-guessable
│  ├─ cross-service safe
│  └─ privacy-conscious
│
├─ Ordering identity
│  ├─ audit sequence
│  ├─ job sequence
│  ├─ outbox ordering
│  └─ pagination cursor
│
└─ Idempotency identity
   ├─ request key
   ├─ command deduplication
   ├─ retry-safe POST
   └─ external callback dedupe
```

Rule utama:

```text id="4kv64"
Jangan memaksa satu key untuk semua kebutuhan.
Technical ID, business number, public ID, dan idempotency key sering harus dipisah.
```

---

## 2. Practical Key Taxonomy

| Key type | Contoh | Fungsi | Rekomendasi |
|---|---|---|---|
| Surrogate technical key | `case_id uuid`, `audit_id bigint` | Identitas internal row | Stabil, immutable, tidak bergantung format bisnis |
| Natural/business key | `case_number`, `invoice_number`, `external_ref` | Identitas bisnis/manusia | Unique constraint, tapi jangan selalu jadi PK |
| Public API key | UUID di URL | Identifier aman untuk client/API | UUIDv7/UUIDv4 lebih aman daripada integer sequence |
| Tenant-scoped key | `(tenant_id, case_id)` | Isolasi multi-tenant | Bagus untuk FK dan query OLTP |
| Sequence key | `bigint identity`, `nextval()` | Ordering internal | Bagus untuk audit/history/job |
| Business number | `CASE-2026-000123` | Nomor yang dibaca manusia | Generate terpisah dari PK |
| Idempotency key | Client-supplied UUID/string | Dedup request | Unique `(tenant_id, key, command_name)` |
| External system key | `external_system`, `external_id` | Integrasi | Unique composite + source system |

---

## 3. Diagram Key Design OLTP

```text id="h58frx"
regulatory_case
│
├─ tenant_id bigint
│  └─ tenant boundary
│
├─ case_id uuid default uuidv7()
│  └─ technical/public aggregate ID
│
├─ case_number text
│  └─ human/business number
│
├─ external_reference text
│  └─ optional external system identifier
│
├─ version bigint
│  └─ optimistic concurrency key
│
└─ constraints
   ├─ PRIMARY KEY (tenant_id, case_id)
   ├─ UNIQUE (tenant_id, case_number)
   ├─ UNIQUE (tenant_id, external_system, external_reference)
   └─ CHECK business format
```

---

## 4. Identity Column vs Sequence vs UUID

| Mechanism | PostgreSQL example | Cocok untuk | Hindari untuk |
|---|---|---|---|
| Identity column | `bigint GENERATED ALWAYS AS IDENTITY` | Internal numeric ID | Public URL yang tidak boleh guessable |
| Explicit sequence | `nextval('case_number_seq')` | Business number generator, ticket number | Gapless/legal invoice number jika gap dilarang |
| UUIDv4 | `uuidv4()` / `gen_random_uuid()` | Random public ID | Write-heavy table yang butuh index locality tinggi |
| UUIDv7 | `uuidv7()` | Public/distributed ID dengan time ordering | Jika platform masih PostgreSQL < 18 tanpa generator setara |
| Natural key | `case_number` as identifier | Lookup manusia | Primary key/fk jika format bisa berubah |
| Composite key | `(tenant_id, case_id)` | Multi-tenant integrity | Sistem single-tenant sederhana yang tidak perlu tenant boundary |

Identity column adalah kolom khusus yang otomatis diisi dari implicit sequence, dan PostgreSQL mendukung `GENERATED ALWAYS AS IDENTITY` serta `GENERATED BY DEFAULT AS IDENTITY`. Identity column otomatis `NOT NULL`, tetapi uniqueness tetap harus ditegakkan dengan `PRIMARY KEY` atau `UNIQUE`. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-identity-columns.html))

---

## 5. Pattern 1 - Root Aggregate dengan UUIDv7 + Tenant-Aware PK

Untuk root aggregate seperti `regulatory_case`, gunakan UUID sebagai stable aggregate identifier.

```sql id="yy738z"
CREATE TABLE regulatory_case (
    tenant_id     bigint NOT NULL,
    case_id       uuid NOT NULL DEFAULT uuidv7(),
    case_number   text NOT NULL,
    status        text NOT NULL,
    title         text NOT NULL,
    version       bigint NOT NULL DEFAULT 0,
    created_at    timestamptz NOT NULL DEFAULT clock_timestamp(),
    updated_at    timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number),

    CONSTRAINT chk_regulatory_case__title_not_blank
        CHECK (length(trim(title)) > 0)
);
```

Kenapa UUIDv7?

PostgreSQL 18 menyediakan `uuidv7()` untuk menghasilkan UUID version 7 yang time-ordered; dokumentasi menjelaskan timestamp UUIDv7 dihitung dari UNIX timestamp dengan presisi millisecond, sub-millisecond timestamp, dan random component. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-uuid.html))

Practical benefit:

```text id="kkmgph"
1. non-guessable enough untuk public identifier
2. bisa dibuat di database
3. lebih ordered daripada UUIDv4
4. cocok untuk distributed aggregate ID
5. tetap disimpan sebagai native uuid type
```

Tetap simpan `created_at`; jangan mengandalkan UUID timestamp sebagai satu-satunya waktu bisnis.

---

## 6. Pattern 2 - Identity untuk Audit/History Internal

Untuk table append-only internal, `bigint identity` sangat cocok.

```sql id="s1xn6y"
CREATE TABLE case_status_history (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL,
    history_id   bigint GENERATED ALWAYS AS IDENTITY,
    from_status  text,
    to_status    text NOT NULL,
    action       text NOT NULL,
    changed_by   text NOT NULL,
    changed_at   timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_case_status_history
        PRIMARY KEY (tenant_id, history_id),

    CONSTRAINT fk_case_status_history__case
        FOREIGN KEY (tenant_id, case_id)
        REFERENCES regulatory_case (tenant_id, case_id)
);
```

Kenapa bukan UUID?

```text id="q5i5w7"
Audit/history sering butuh:
- append ordering
- compact index
- pagination internal
- cheaper FK/index
```

Identity column cocok untuk generated key value dari implicit sequence. Namun identity saja tidak menjamin uniqueness jika sequence di-reset atau explicit value diinsert; tetap gunakan `PRIMARY KEY`/`UNIQUE`. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-identity-columns.html))

---

## 7. Pattern 3 - Business Number Terpisah dari Primary Key

Jangan jadikan business number sebagai PK utama.

Buruk:

```sql id="gvcgrr"
CREATE TABLE regulatory_case (
    case_number text PRIMARY KEY,
    title text NOT NULL
);
```

Lebih aman:

```sql id="mo7syp"
CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL,
    title        text NOT NULL,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number)
);
```

Alasan:

```text id="6txzq7"
Business number bisa:
1. berubah format
2. perlu reset per tahun/per tenant
3. mengandung info sensitif
4. punya aturan legal/audit sendiri
5. perlu reuse setelah void/cancel dalam domain tertentu
6. butuh display prefix/suffix
```

Rule praktis:

```text id="pem188"
PK = immutable technical identity.
Business number = unique business identifier.
Jangan campur kecuali domain benar-benar menjamin immutability jangka panjang.
```

---

## 8. Pattern 4 - Simple Business Number dengan Sequence

Contoh nomor case global:

```sql id="v50zt9"
CREATE SEQUENCE case_number_seq
AS bigint
START WITH 1
INCREMENT BY 1
CACHE 50;
```

PostgreSQL `CREATE SEQUENCE` membuat generator angka khusus; setelah sequence dibuat, nilai dapat diambil memakai `nextval`, `currval`, dan `setval`. Sequence memiliki opsi seperti data type, increment, start, dan cache. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createsequence.html))

Function generator:

```sql id="n22lik"
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS text
LANGUAGE sql
AS $$
    SELECT 'CASE-' ||
           to_char(clock_timestamp(), 'YYYY') ||
           '-' ||
           lpad(nextval('case_number_seq')::text, 8, '0')
$$;
```

Insert:

```sql id="l2h7wv"
INSERT INTO regulatory_case (
    tenant_id,
    case_id,
    case_number,
    status,
    title
)
VALUES (
    :tenantId,
    uuidv7(),
    generate_case_number(),
    'DRAFT',
    :title
)
RETURNING tenant_id, case_id, case_number;
```

Hasil:

```text id="3f6v6k"
CASE-2026-00000001
CASE-2026-00000002
CASE-2026-00000003
```

---

## 9. Penting: Sequence Tidak Gapless

Ini sering disalahpahami.

PostgreSQL secara eksplisit menyebut nilai dari `nextval` tidak direclaim jika transaksi abort, karena sequence didesain agar transaksi concurrent tidak saling memblok. Akibatnya transaction abort, crash, atau `INSERT ... ON CONFLICT` dapat menghasilkan gap; sequence PostgreSQL tidak bisa dipakai untuk gapless numbering. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-sequence.html))

Implikasi:

```text id="36827l"
Sequence cocok untuk:
- technical ID
- audit ID
- job ID
- non-gapless ticket/case number

Sequence tidak cocok jika hukum/bisnis mensyaratkan:
- nomor invoice legal benar-benar gapless
- tidak boleh ada nomor hilang
- nomor harus hanya muncul setelah final commit
```

Kalau bisnis menuntut “gapless”, challenge requirement-nya dulu:

```text id="nvjnsz"
Apakah benar-benar gapless?
Atau cukup explainable gaps?
Apakah void/cancel number boleh tercatat?
Apakah draft number boleh beda dengan official number?
Apakah nomor baru diterbitkan saat final approval, bukan saat draft?
```

---

## 10. Pattern 5 - Tenant-Scoped Business Number

Case number sering perlu reset per tenant atau per tahun.

Table counter:

```sql id="lkn2ll"
CREATE TABLE tenant_case_number_counter (
    tenant_id      bigint NOT NULL,
    number_year    integer NOT NULL,
    last_number    bigint NOT NULL,
    updated_at     timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_tenant_case_number_counter
        PRIMARY KEY (tenant_id, number_year)
);
```

Atomic increment dengan UPSERT:

```sql id="4e0db1"
INSERT INTO tenant_case_number_counter (
    tenant_id,
    number_year,
    last_number
)
VALUES (
    :tenantId,
    :numberYear,
    1
)
ON CONFLICT (tenant_id, number_year)
DO UPDATE
SET last_number = tenant_case_number_counter.last_number + 1,
    updated_at = clock_timestamp()
RETURNING last_number;
```

Generate number di aplikasi atau SQL:

```text id="l2ye47"
CASE-{tenantCode}-{year}-{last_number padded}
```

Contoh:

```text id="bljwbu"
CASE-IDJKT-2026-000001
```

Kelebihan:

```text id="ly5oqq"
1. tenant/year scoped
2. mudah audit
3. bisa format sesuai domain
4. atomic karena row counter di-update dalam transaksi
```

Risiko:

```text id="xk8fw3"
1. hot row per tenant/year
2. contention tinggi jika request create case sangat banyak
3. tetap bisa gap jika transaksi rollback setelah counter naik,
   kecuali desain official number diterbitkan dan disimpan dengan status void/cancel
```

---

## 11. Pattern 6 - Gapless-ish Official Number dengan Ledger

Kalau nomor legal harus explainable, jangan hanya pakai sequence. Gunakan number ledger.

```sql id="rjybqu"
CREATE TABLE official_number_ledger (
    tenant_id       bigint NOT NULL,
    number_type     text NOT NULL,
    number_year     integer NOT NULL,
    number_value    bigint NOT NULL,
    formatted_value text NOT NULL,
    status          text NOT NULL,
    aggregate_type  text,
    aggregate_id    uuid,
    issued_by       text NOT NULL,
    issued_at       timestamptz NOT NULL DEFAULT clock_timestamp(),
    void_reason     text,

    CONSTRAINT pk_official_number_ledger
        PRIMARY KEY (tenant_id, number_type, number_year, number_value),

    CONSTRAINT uq_official_number_ledger__formatted
        UNIQUE (tenant_id, formatted_value),

    CONSTRAINT chk_official_number_ledger__status
        CHECK (status IN ('ISSUED', 'VOIDED', 'ASSIGNED'))
);
```

Counter table:

```sql id="mpw62q"
CREATE TABLE official_number_counter (
    tenant_id    bigint NOT NULL,
    number_type  text NOT NULL,
    number_year  integer NOT NULL,
    last_number  bigint NOT NULL,

    CONSTRAINT pk_official_number_counter
        PRIMARY KEY (tenant_id, number_type, number_year)
);
```

Issuing transaction:

```sql id="rwq7ra"
BEGIN;

WITH next_number AS (
    INSERT INTO official_number_counter (
        tenant_id,
        number_type,
        number_year,
        last_number
    )
    VALUES (
        :tenantId,
        :numberType,
        :numberYear,
        1
    )
    ON CONFLICT (tenant_id, number_type, number_year)
    DO UPDATE
    SET last_number = official_number_counter.last_number + 1
    RETURNING last_number
)
INSERT INTO official_number_ledger (
    tenant_id,
    number_type,
    number_year,
    number_value,
    formatted_value,
    status,
    aggregate_type,
    aggregate_id,
    issued_by
)
SELECT
    :tenantId,
    :numberType,
    :numberYear,
    last_number,
    :formattedValue,
    'ASSIGNED',
    :aggregateType,
    :aggregateId,
    :actorId
FROM next_number;

COMMIT;
```

Practical semantics:

```text id="gx4c0x"
Gapless secara fisik sulit dan mahal.
Explainable number ledger lebih realistis:
- number issued
- number assigned
- number voided
- reason recorded
```

Untuk sistem regulatori/financial, biasanya yang penting adalah **auditability of gaps**, bukan mustahil ada gap secara teknis.

---

## 12. Pattern 7 - Idempotency Key untuk Retry-Safe Command

Untuk endpoint `POST`, client/network bisa retry. Gunakan idempotency key.

```sql id="3vjyae"
CREATE TABLE idempotency_request (
    tenant_id         bigint NOT NULL,
    idempotency_key  text NOT NULL,
    command_name     text NOT NULL,
    request_hash     text NOT NULL,
    status           text NOT NULL,
    response_code    integer,
    response_body    jsonb,
    created_at       timestamptz NOT NULL DEFAULT clock_timestamp(),
    completed_at     timestamptz,

    CONSTRAINT pk_idempotency_request
        PRIMARY KEY (tenant_id, idempotency_key, command_name),

    CONSTRAINT chk_idempotency_request__status
        CHECK (status IN ('PROCESSING', 'COMPLETED', 'FAILED'))
);
```

Start command:

```sql id="axlevn"
INSERT INTO idempotency_request (
    tenant_id,
    idempotency_key,
    command_name,
    request_hash,
    status
)
VALUES (
    :tenantId,
    :idempotencyKey,
    :commandName,
    :requestHash,
    'PROCESSING'
)
ON CONFLICT (tenant_id, idempotency_key, command_name)
DO NOTHING
RETURNING tenant_id, idempotency_key, command_name;
```

Interpretasi:

| Result | Makna |
|---|---|
| 1 row returned | Request pertama, lanjutkan command |
| 0 row returned | Duplicate, baca status sebelumnya |
| Existing `COMPLETED` same hash | Return cached response |
| Existing `PROCESSING` | Return `409`, `425`, atau `202` tergantung API policy |
| Existing same key different hash | `409 Conflict` / invalid idempotency reuse |

Complete command:

```sql id="k1lpci"
UPDATE idempotency_request
SET status = 'COMPLETED',
    response_code = :responseCode,
    response_body = CAST(:responseBody AS jsonb),
    completed_at = clock_timestamp()
WHERE tenant_id = :tenantId
  AND idempotency_key = :idempotencyKey
  AND command_name = :commandName
  AND request_hash = :requestHash;
```

Rule praktis:

```text id="g74fug"
Idempotency key bukan primary business key.
Idempotency key adalah dedupe key untuk request/command.
```

---

## 13. Pattern 8 - External Reference Key

Untuk integrasi dengan sistem lain, jangan jadikan external ID sebagai PK utama.

```sql id="ax6h9a"
CREATE TABLE external_reference_mapping (
    tenant_id        bigint NOT NULL,
    source_system    text NOT NULL,
    external_id      text NOT NULL,
    aggregate_type   text NOT NULL,
    aggregate_id     uuid NOT NULL,
    first_seen_at    timestamptz NOT NULL DEFAULT clock_timestamp(),
    last_seen_at     timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_external_reference_mapping
        PRIMARY KEY (tenant_id, source_system, external_id),

    CONSTRAINT uq_external_reference_mapping__aggregate
        UNIQUE (tenant_id, source_system, aggregate_type, aggregate_id)
);
```

Use case:

```text id="ak6n0i"
1. webhook dedupe
2. external ticket mapping
3. migration from legacy system
4. reconciliation
5. CDC/integration join
```

Insert idempotent mapping:

```sql id="oegmsk"
INSERT INTO external_reference_mapping (
    tenant_id,
    source_system,
    external_id,
    aggregate_type,
    aggregate_id
)
VALUES (
    :tenantId,
    :sourceSystem,
    :externalId,
    :aggregateType,
    :aggregateId
)
ON CONFLICT (tenant_id, source_system, external_id)
DO UPDATE
SET last_seen_at = clock_timestamp()
RETURNING aggregate_id;
```

---

## 14. Pattern 9 - Version Key untuk Optimistic Concurrency

`version` bukan identity key, tapi concurrency key.

```sql id="qeyfan"
ALTER TABLE regulatory_case
ADD COLUMN version bigint NOT NULL DEFAULT 0;
```

Update:

```sql id="19zst4"
UPDATE regulatory_case
SET title = :title,
    version = version + 1,
    updated_at = clock_timestamp()
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND version = :expectedVersion
RETURNING tenant_id, case_id, version;
```

Interpretasi:

```text id="9vcq5v"
1 row → update sukses.
0 row → stale version / row tidak ada / tenant mismatch.
```

API mapping:

| DB result | API |
|---|---|
| 1 row | `200 OK` |
| 0 row karena stale version | `409 Conflict` |
| 0 row karena not found | `404 Not Found`, jika pre-check membedakan |
| constraint violation | `400/409` tergantung constraint |

---

## 15. Pattern 10 - Cursor Key untuk Pagination

Offset pagination buruk untuk table besar OLTP. Lebih baik keyset pagination dengan key stabil.

```sql id="jh76lp"
SELECT tenant_id, case_id, case_number, status, created_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND deleted_at IS NULL
  AND (
      created_at, case_id
  ) < (
      :lastCreatedAt, :lastCaseId
  )
ORDER BY created_at DESC, case_id DESC
LIMIT :limit;
```

Index:

```sql id="xxqb2h"
CREATE INDEX idx_regulatory_case__tenant_created_case
ON regulatory_case (tenant_id, created_at DESC, case_id DESC)
WHERE deleted_at IS NULL;
```

Rule:

```text id="8yopzf"
Cursor harus:
1. deterministic
2. unique enough untuk tie-break
3. sesuai ORDER BY
4. didukung composite index
```

Jika pakai UUIDv7, `case_id` bisa membantu ordering teknis, tapi untuk business list tetap simpan `created_at` eksplisit.

---

## 16. Practical Schema: Key Design Lengkap

```sql id="6z497g"
CREATE TABLE regulatory_case (
    tenant_id          bigint NOT NULL,
    case_id            uuid NOT NULL DEFAULT uuidv7(),
    case_number        text NOT NULL,
    source_system      text,
    external_reference text,
    status             text NOT NULL,
    title              text NOT NULL,
    version            bigint NOT NULL DEFAULT 0,
    created_by         text NOT NULL,
    created_at         timestamptz NOT NULL DEFAULT clock_timestamp(),
    updated_at         timestamptz NOT NULL DEFAULT clock_timestamp(),
    deleted_at         timestamptz,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number),

    CONSTRAINT uq_regulatory_case__external_reference
        UNIQUE NULLS NOT DISTINCT (
            tenant_id,
            source_system,
            external_reference
        ),

    CONSTRAINT chk_regulatory_case__status
        CHECK (status IN (
            'DRAFT',
            'SUBMITTED',
            'UNDER_REVIEW',
            'APPROVED',
            'REJECTED',
            'CLOSED'
        )),

    CONSTRAINT chk_regulatory_case__title_not_blank
        CHECK (length(trim(title)) > 0)
);

CREATE INDEX idx_regulatory_case__tenant_status_created
ON regulatory_case (tenant_id, status, created_at DESC, case_id DESC)
WHERE deleted_at IS NULL;
```

Catatan: `UNIQUE NULLS NOT DISTINCT` berguna saat `NULL` juga harus dianggap sebagai nilai yang tidak boleh duplicate dalam unique constraint. Ini sudah dibahas di Seri 4.

---

## 17. Java Record Model

```java id="iqy8jm"
public record RegulatoryCaseRow(
    long tenantId,
    UUID caseId,
    String caseNumber,
    String sourceSystem,
    String externalReference,
    String status,
    String title,
    long version,
    String createdBy,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {}
```

Command create:

```java id="fkg10y"
public record CreateCaseCommand(
    long tenantId,
    String title,
    String actorId,
    String idempotencyKey,
    String requestHash,
    String sourceSystem,
    String externalReference
) {}
```

Result:

```java id="5c8op6"
public record CreateCaseResult(
    long tenantId,
    UUID caseId,
    String caseNumber,
    long version
) {}
```

Practical separation:

```text id="qjxip8"
caseId        → technical/public identity
caseNumber    → human/business identity
version       → concurrency identity
idempotencyKey → request identity
externalReference → integration identity
```

---

## 18. MyBatis Mapper - Create Case dengan Generated Keys dari PostgreSQL

Karena kita memakai `uuidv7()` dan `generate_case_number()` di database, gunakan `RETURNING`.

```xml id="7t1ncv"
<select id="insertCase" resultMap="RegulatoryCaseRowMap">
  INSERT INTO regulatory_case (
      tenant_id,
      case_id,
      case_number,
      source_system,
      external_reference,
      status,
      title,
      created_by
  )
  VALUES (
      #{tenantId},
      uuidv7(),
      generate_case_number(),
      #{sourceSystem},
      #{externalReference},
      'DRAFT',
      #{title},
      #{actorId}
  )
  RETURNING
      tenant_id,
      case_id,
      case_number,
      source_system,
      external_reference,
      status,
      title,
      version,
      created_by,
      created_at,
      updated_at
</select>
```

Kenapa `<select>`?

```text id="kwzjjr"
Di MyBatis, PostgreSQL INSERT/UPDATE ... RETURNING menghasilkan result set.
Praktis dimodelkan sebagai select statement.
```

---

## 19. MyBatis Mapper - Idempotency Start

```xml id="3ax5iz"
<select id="startIdempotencyRequest" resultType="com.example.IdempotencyStartRow">
  INSERT INTO idempotency_request (
      tenant_id,
      idempotency_key,
      command_name,
      request_hash,
      status
  )
  VALUES (
      #{tenantId},
      #{idempotencyKey},
      #{commandName},
      #{requestHash},
      'PROCESSING'
  )
  ON CONFLICT (tenant_id, idempotency_key, command_name)
  DO NOTHING
  RETURNING tenant_id, idempotency_key, command_name, request_hash, status
</select>
```

Read existing:

```xml id="rjff10"
<select id="findIdempotencyRequest" resultMap="IdempotencyRequestMap">
  SELECT
      tenant_id,
      idempotency_key,
      command_name,
      request_hash,
      status,
      response_code,
      response_body,
      created_at,
      completed_at
  FROM idempotency_request
  WHERE tenant_id = #{tenantId}
    AND idempotency_key = #{idempotencyKey}
    AND command_name = #{commandName}
</select>
```

Complete:

```xml id="k0j729"
<update id="completeIdempotencyRequest">
  UPDATE idempotency_request
  SET status = 'COMPLETED',
      response_code = #{responseCode},
      response_body = CAST(#{responseBody} AS jsonb),
      completed_at = clock_timestamp()
  WHERE tenant_id = #{tenantId}
    AND idempotency_key = #{idempotencyKey}
    AND command_name = #{commandName}
    AND request_hash = #{requestHash}
</update>
```

---

## 20. Service Pattern - Create Case Retry-Safe

```java id="idsssk"
public final class CreateCaseService {
    private final SqlSessionFactory sqlSessionFactory;

    public CreateCaseResult create(CreateCaseCommand command) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            IdempotencyMapper idem = session.getMapper(IdempotencyMapper.class);
            RegulatoryCaseMapper cases = session.getMapper(RegulatoryCaseMapper.class);

            IdempotencyStartRow started = idem.startIdempotencyRequest(
                command.tenantId(),
                command.idempotencyKey(),
                "CREATE_CASE",
                command.requestHash()
            );

            if (started == null) {
                IdempotencyRequestRow existing = idem.findIdempotencyRequest(
                    command.tenantId(),
                    command.idempotencyKey(),
                    "CREATE_CASE"
                );

                if (!existing.requestHash().equals(command.requestHash())) {
                    session.rollback();
                    throw new BusinessConflictException(
                        "Idempotency key was reused with different request body"
                    );
                }

                if ("COMPLETED".equals(existing.status())) {
                    session.rollback();
                    return deserializeCreateCaseResult(existing.responseBody());
                }

                session.rollback();
                throw new ResourceBusyException("Request is already processing");
            }

            RegulatoryCaseRow inserted = cases.insertCase(
                command.tenantId(),
                command.title(),
                command.actorId(),
                command.sourceSystem(),
                command.externalReference()
            );

            CreateCaseResult result = new CreateCaseResult(
                inserted.tenantId(),
                inserted.caseId(),
                inserted.caseNumber(),
                inserted.version()
            );

            idem.completeIdempotencyRequest(
                command.tenantId(),
                command.idempotencyKey(),
                "CREATE_CASE",
                command.requestHash(),
                201,
                serialize(result)
            );

            session.commit();
            return result;
        }
    }
}
```

Practical invariant:

```text id="koymd8"
Idempotency row + business row + response cache harus commit bersama.
Kalau commit gagal, request berikutnya boleh retry dengan aman.
```

---

## 21. Business Number Generator: DB vs Application

| Generator location | Kelebihan | Risiko |
|---|---|---|
| PostgreSQL function | Atomic, dekat data, mudah pakai `RETURNING` | Logic format ada di DB |
| Java service | Testable, versioned bersama app | Harus hati-hati concurrency |
| Dedicated number service | Centralized across systems | Adds network dependency |
| Sequence only | Simple, fast | Not gapless, format terbatas |
| Ledger table | Auditable, explainable | More complex, possible hotspot |

Rekomendasi praktis:

```text id="yckxoq"
Untuk case number internal per service:
DB function + unique constraint cukup.

Untuk legal/official number:
gunakan ledger table + audit rule + explicit lifecycle.
```

---

## 22. Indexing Impact of Key Choices

| Key | Index behavior | Practical note |
|---|---|---|
| `bigint identity` | Compact, ordered insert | Bagus untuk append-heavy internal table |
| `uuidv4` | Random distribution | Bisa memperbesar index churn pada write-heavy table |
| `uuidv7` | Time-ordered | Lebih baik untuk locality dibanding random UUID |
| Natural text key | Larger index | Cocok sebagai unique business key, bukan FK utama |
| Composite `(tenant_id, uuid)` | Lebih besar dari uuid-only | Bagus untuk tenant boundary dan query filter |
| Business number text | Larger index | Index hanya jika lookup/filter sering |

Index example:

```sql id="639ce3"
CREATE INDEX idx_regulatory_case__tenant_case_id
ON regulatory_case (tenant_id, case_id);

CREATE INDEX idx_regulatory_case__tenant_case_number
ON regulatory_case (tenant_id, case_number);

CREATE INDEX idx_regulatory_case__tenant_status_created
ON regulatory_case (tenant_id, status, created_at DESC, case_id DESC)
WHERE deleted_at IS NULL;
```

Rule:

```text id="brn7ho"
Primary key bukan satu-satunya index.
Desain index harus mengikuti access pattern:
- by id
- by business number
- by status list
- by created_at pagination
- by external reference
```

---

## 23. Key Design Decision Matrix

| Pertanyaan | Pilihan praktis |
|---|---|
| Apakah ID akan muncul di API URL? | UUID, bukan bigint sequential |
| Apakah ID perlu dibuat lintas service? | UUID, prefer UUIDv7 jika platform mendukung |
| Apakah row append-only internal? | `bigint identity` |
| Apakah nomor dibaca manusia? | Separate `case_number` dengan unique constraint |
| Apakah nomor harus tenant/year scoped? | Counter table `(tenant_id, year)` |
| Apakah nomor harus explainable/legal? | Number ledger, bukan sequence polos |
| Apakah request bisa retry? | Idempotency key table |
| Apakah update concurrent perlu dideteksi? | `version bigint` |
| Apakah integrasi butuh external ID? | External reference mapping table |
| Apakah multi-tenant? | Masukkan `tenant_id` ke PK/FK/unique/index penting |
| Apakah pagination besar? | Cursor key `(created_at, id)` |

---

## 24. Anti-Pattern

### Anti-pattern 1 - Business number sebagai primary key

Buruk:

```sql id="7b4oic"
case_number text PRIMARY KEY
```

Lebih aman:

```sql id="uav1eo"
case_id uuid PRIMARY KEY,
case_number text UNIQUE
```

Untuk multi-tenant:

```sql id="t09pco"
PRIMARY KEY (tenant_id, case_id),
UNIQUE (tenant_id, case_number)
```

---

### Anti-pattern 2 - Menganggap sequence gapless

Salah:

```text id="te8sos"
"Pakailah sequence untuk nomor invoice legal, pasti tidak ada gap."
```

Faktanya, PostgreSQL menyatakan nilai `nextval` tidak direclaim saat transaksi abort, dan sequence tidak bisa dipakai untuk gapless sequence. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-sequence.html))

---

### Anti-pattern 3 - Expose `bigint id` di public API

Contoh:

```text id="m7zovo"
GET /cases/12345
GET /cases/12346
GET /cases/12347
```

Risiko:

```text id="953ggy"
enumeration
information leakage
scraping
guessable volume
cross-tenant bug lebih berbahaya jika filter tenant gagal
```

Lebih baik:

```text id="zcu92p"
GET /cases/019535d9-3df7-79fb-b466-fa907fa17f9e
```

Tetap wajib check tenant/authorization.

---

### Anti-pattern 4 - Tidak punya idempotency key untuk POST command

Buruk:

```text id="5g6t5z"
Client timeout
client retry POST /cases
dua case terbentuk
```

Lebih aman:

```text id="gkfdyw"
Idempotency-Key header
unique idempotency_request table
same response returned for duplicate completed request
```

---

### Anti-pattern 5 - Satu table pakai terlalu banyak unique business identifier tanpa ownership jelas

Buruk:

```sql id="okadry"
UNIQUE (case_number)
UNIQUE (external_ref)
UNIQUE (legacy_id)
UNIQUE (display_code)
```

Lebih baik:

```text id="00am49"
Pisahkan:
- case_number: business number
- external_reference_mapping: external IDs
- display_code: derived/view concern jika tidak invariant utama
```

---

## 25. Production Checklist

| Checklist | Pertanyaan |
|---|---|
| Technical ID immutable | Apakah PK tidak bergantung format bisnis? |
| Business key unique | Apakah business number punya unique constraint? |
| Public ID aman | Apakah API tidak expose sequential internal ID? |
| Tenant boundary | Apakah key penting tenant-aware? |
| UUID version jelas | Apakah pakai UUIDv4/UUIDv7 dengan alasan? |
| Sequence gap understood | Apakah tim tahu sequence bisa gap? |
| Legal numbering safe | Apakah official number punya ledger/void semantics? |
| Idempotency | Apakah POST command punya idempotency key? |
| Optimistic lock | Apakah update form/command punya `version`? |
| External reference | Apakah external ID tidak dijadikan PK utama sembarangan? |
| Index sesuai access | Apakah ada index untuk lookup by business number/external ref/status? |
| MyBatis uses RETURNING | Apakah generated DB value dikembalikan secara atomic? |
| Error mapping | Apakah duplicate key dipetakan ke `409 Conflict`? |

---

## 26. Mini Lab

### Step 1 - Buat table dan sequence

```sql id="3v72yz"
CREATE SEQUENCE case_number_seq AS bigint START WITH 1 CACHE 50;

CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS text
LANGUAGE sql
AS $$
    SELECT 'CASE-' ||
           to_char(clock_timestamp(), 'YYYY') ||
           '-' ||
           lpad(nextval('case_number_seq')::text, 8, '0')
$$;

CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL DEFAULT generate_case_number(),
    status       text NOT NULL,
    title        text NOT NULL,
    version      bigint NOT NULL DEFAULT 0,
    created_at   timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number)
);
```

### Step 2 - Insert tanpa supply ID/number

```sql id="jijemf"
INSERT INTO regulatory_case (
    tenant_id,
    status,
    title
)
VALUES (
    1001,
    'DRAFT',
    'Case created with generated UUID and number'
)
RETURNING tenant_id, case_id, case_number, version, created_at;
```

Expected:

```text id="lj3iby"
case_id terisi uuidv7()
case_number terisi CASE-2026-00000001
version = 0
```

### Step 3 - Buktikan sequence bisa gap

```sql id="25sc5f"
BEGIN;

SELECT nextval('case_number_seq');

ROLLBACK;

SELECT nextval('case_number_seq');
```

Expected:

```text id="n2vkri"
Nilai setelah rollback tetap melompat.
Ini normal dan documented behavior.
```

### Step 4 - Optimistic update

```sql id="1ie7k3"
UPDATE regulatory_case
SET title = 'Updated title',
    version = version + 1
WHERE tenant_id = 1001
  AND case_number = 'CASE-2026-00000001'
  AND version = 0
RETURNING tenant_id, case_id, case_number, version;
```

Run lagi dengan `version = 0`.

Expected:

```text id="27gf9z"
0 rows returned → stale update → map ke 409 Conflict.
```

---

## 27. Ringkasan Praktis

```text id="mfwobp"
1. Pisahkan technical ID, business number, public ID, external ID, dan idempotency key.
2. Root aggregate cocok memakai UUID; untuk PostgreSQL 18+, uuidv7() adalah opsi native time-ordered.
3. Internal append-only table cocok memakai bigint identity.
4. Identity column menggunakan implicit sequence, tetapi uniqueness tetap perlu PK/UNIQUE.
5. Sequence cepat dan concurrent-friendly, tapi tidak gapless.
6. Business number sebaiknya unique, tenant-scoped, dan terpisah dari PK.
7. Legal/official number butuh ledger dan void semantics, bukan sequence polos.
8. Idempotency key wajib untuk retry-safe POST/command.
9. Version column adalah concurrency key, bukan identity key.
10. Keyset pagination butuh cursor key stabil dan index yang sesuai.
```

---

# Status Seri

**Seri 6/22 selesai.**

Rekomendasi lanjut ke:

**Seri 7 - Query Shape & Mutation Pattern untuk PostgreSQL OLTP: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `UPSERT`, `RETURNING`, CTE, batch write, dan MyBatis mapper pattern production-grade.**

---

**Sources:**

- [PostgreSQL: Documentation: 18: 9.14. UUID Functions](https://www.postgresql.org/docs/current/functions-uuid.html)

## Response:
7/15/2026, 8:12:35 PM

# PostgreSQL OLTP - Seri 7/22  
## Query Shape & Mutation Pattern: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `UPSERT`, `RETURNING`, CTE, Batch Write, dan MyBatis Mapper Pattern

Seri ini fokus pada **bentuk query dan mutation yang production-grade untuk OLTP**. Di sistem transaksi, query yang benar bukan hanya “hasilnya benar”, tapi juga:

```text id="yv8wtu"
1. atomic
2. predictable latency
3. aman saat concurrent request
4. mudah di-index
5. mudah dipetakan ke Java/MyBatis
6. tidak menghasilkan side effect ambigu
7. mudah diobservasi saat incident
```

PostgreSQL mendukung `RETURNING` pada `INSERT`, `UPDATE`, `DELETE`, dan `MERGE`; `RETURNING` berguna karena aplikasi bisa mendapatkan data hasil mutation tanpa query tambahan, terutama saat row yang berubah sulit diidentifikasi ulang secara aman. ([PostgreSQL](https://www.postgresql.org/docs/current/dml-returning.html?utm_source=chatgpt.com))

---

## 1. Mental Model Query Shape OLTP

```text id="s5f5ih"
OLTP Query Shape
│
├─ Read path
│  ├─ point lookup by PK
│  ├─ lookup by business key
│  ├─ filtered list
│  ├─ keyset pagination
│  └─ existence check
│
├─ Write path
│  ├─ insert aggregate
│  ├─ guarded update
│  ├─ optimistic update
│  ├─ soft delete
│  ├─ upsert idempotency/external ref
│  └─ insert audit/outbox
│
├─ Atomic mutation
│  ├─ UPDATE ... WHERE expected_state
│  ├─ INSERT ... ON CONFLICT
│  ├─ DELETE ... RETURNING
│  └─ WITH mutation chain
│
├─ Batch operation
│  ├─ batch insert
│  ├─ update from values
│  ├─ staging table
│  └─ chunked processing
│
└─ Java/MyBatis mapping
   ├─ mapper XML
   ├─ resultMap
   ├─ select for RETURNING
   ├─ parameter object
   └─ exception mapping
```

Rule besar:

```text id="tdrh7t"
OLTP query harus didesain dari access pattern, bukan dari “semua field yang mungkin dibutuhkan UI”.
```

---

## 2. Practical Query Pattern Table

| Pattern | SQL shape | Cocok untuk | Catatan |
|---|---|---|---|
| Point lookup | `SELECT ... WHERE tenant_id=? AND id=?` | Detail page, command validation | Harus kena PK/index |
| Business lookup | `WHERE tenant_id=? AND case_number=?` | Search by case number | Perlu unique/index |
| Filtered list | `WHERE tenant_id=? AND status=? ORDER BY created_at DESC LIMIT ?` | Worklist | Perlu composite index |
| Keyset pagination | `(created_at, id) < (?, ?)` | Large list | Lebih stabil dari offset |
| Existence check | `SELECT EXISTS (...)` | Validasi cepat | Jangan ambil kolom tidak perlu |
| Insert root | `INSERT ... RETURNING` | Create command | Ambil generated ID/number/version |
| Guarded update | `UPDATE ... WHERE status=? RETURNING` | State transition | Atomic, race-safe |
| Optimistic update | `WHERE version=? RETURNING` | Edit concurrent | 0 row = conflict |
| Soft delete | `UPDATE ... SET deleted_at... RETURNING` | Domain delete | Jangan hard delete regulated data |
| Upsert | `INSERT ... ON CONFLICT ... DO UPDATE` | Idempotency/external ref | Hati-hati side effect update |
| Data-modifying CTE | `WITH changed AS (...) INSERT ... SELECT ...` | Mutation chain | Gunakan ketika perlu atomic chaining |
| Batch write | `INSERT multi-row`, `COPY`, staging | Import / bulk command | Chunking dan constraint handling penting |

---

## 3. Pattern 1 - Point Lookup by Technical Key

```sql id="g1jv4p"
SELECT
    tenant_id,
    case_id,
    case_number,
    status,
    title,
    version,
    created_at,
    updated_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND deleted_at IS NULL;
```

Index yang mendukung:

```sql id="d344fs"
-- biasanya sudah tercakup oleh PK
PRIMARY KEY (tenant_id, case_id)
```

Kapan dipakai:

```text id="xe8u7x"
1. detail screen
2. command handler pre-read
3. authorization check
4. API GET by ID
```

Practical rule:

```text id="f3s1m5"
Point lookup OLTP harus selalu deterministic dan index-backed.
Jika point lookup melakukan sequential scan, schema/index/query shape salah.
```

MyBatis:

```xml id="av4nl4"
<select id="findCaseById" resultMap="RegulatoryCaseRowMap">
  SELECT
      tenant_id,
      case_id,
      case_number,
      status,
      title,
      version,
      created_at,
      updated_at
  FROM regulatory_case
  WHERE tenant_id = #{tenantId}
    AND case_id = #{caseId}
    AND deleted_at IS NULL
</select>
```

---

## 4. Pattern 2 - Lookup by Business Key

```sql id="r7vq3g"
SELECT
    tenant_id,
    case_id,
    case_number,
    status,
    title,
    version
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND case_number = :caseNumber
  AND deleted_at IS NULL;
```

Constraint/index:

```sql id="rvvi2j"
CREATE UNIQUE INDEX uq_regulatory_case__active_case_number
ON regulatory_case (tenant_id, case_number)
WHERE deleted_at IS NULL;
```

Cocok untuk:

```text id="p9vm31"
1. user search exact case number
2. external support lookup
3. duplicate prevention UX
4. import reconciliation
```

Jangan jadikan lookup by business key sebagai pengganti technical ID untuk internal relation. Business number bisa berubah format atau policy.

---

## 5. Pattern 3 - Worklist Query

Contoh: daftar case yang perlu direview.

```sql id="y4p6rf"
SELECT
    tenant_id,
    case_id,
    case_number,
    title,
    priority,
    status,
    created_at,
    updated_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY priority DESC, created_at ASC, case_id ASC
LIMIT :limit;
```

Index:

```sql id="ebgepy"
CREATE INDEX idx_regulatory_case__worklist_submitted
ON regulatory_case (
    tenant_id,
    status,
    priority DESC,
    created_at ASC,
    case_id ASC
)
WHERE deleted_at IS NULL;
```

Practical rule:

```text id="h0y57z"
WHERE + ORDER BY + LIMIT harus dipikirkan sebagai satu paket index design.
```

Kesalahan umum:

```text id="3sjt1b"
1. index hanya di status, tapi sort by created_at tetap mahal
2. query ambil semua status lalu filter di Java
3. LIMIT tanpa ORDER BY deterministic
4. OFFSET besar untuk pagination
```

---

## 6. Pattern 4 - Keyset Pagination

Offset pagination:

```sql id="sq26ki"
SELECT *
FROM regulatory_case
WHERE tenant_id = :tenantId
ORDER BY created_at DESC
OFFSET 100000
LIMIT 50;
```

Masalah:

```text id="ry8gqm"
database tetap harus melewati banyak row
hasil bisa bergeser saat ada insert/update baru
latency memburuk seiring page jauh
```

Keyset pagination:

```sql id="6i40uw"
SELECT
    tenant_id,
    case_id,
    case_number,
    status,
    title,
    created_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND deleted_at IS NULL
  AND (
      :lastCreatedAt IS NULL
      OR (created_at, case_id) < (:lastCreatedAt, :lastCaseId)
  )
ORDER BY created_at DESC, case_id DESC
LIMIT :limit;
```

Index:

```sql id="b1m2mn"
CREATE INDEX idx_regulatory_case__tenant_created_case
ON regulatory_case (tenant_id, created_at DESC, case_id DESC)
WHERE deleted_at IS NULL;
```

Cursor payload:

```json id="evfki7"
{
  "lastCreatedAt": "2026-07-15T10:30:00Z",
  "lastCaseId": "019535d9-3df7-79fb-b466-fa907fa17f9e"
}
```

Rule:

```text id="u6w6yk"
ORDER BY harus deterministic.
Tambahkan unique tie-breaker seperti case_id.
```

---

## 7. Pattern 5 - Existence Check

Buruk:

```sql id="yj1c50"
SELECT *
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND case_number = :caseNumber;
```

Lebih baik:

```sql id="vi8gjw"
SELECT EXISTS (
    SELECT 1
    FROM regulatory_case
    WHERE tenant_id = :tenantId
      AND case_number = :caseNumber
      AND deleted_at IS NULL
) AS exists;
```

Kapan dipakai:

```text id="g8edcj"
1. quick validation
2. feature toggle data presence
3. permission pre-check
4. duplicate warning before final submit
```

Tapi untuk correctness uniqueness, tetap wajib unique constraint. Existence check hanya untuk UX/performance.

---

## 8. Pattern 6 - Insert Root Aggregate dengan `RETURNING`

```sql id="99v4x0"
INSERT INTO regulatory_case (
    tenant_id,
    case_id,
    case_number,
    status,
    title,
    priority,
    created_by,
    updated_by
)
VALUES (
    :tenantId,
    uuidv7(),
    generate_case_number(),
    'DRAFT',
    :title,
    :priority,
    :actorId,
    :actorId
)
RETURNING
    tenant_id,
    case_id,
    case_number,
    status,
    title,
    priority,
    version,
    created_at,
    updated_at;
```

`INSERT ... RETURNING` dapat mengembalikan nilai yang dihasilkan database, termasuk default values dan generated columns; pada `ON CONFLICT DO UPDATE`, `RETURNING` juga dapat mengembalikan row yang di-update. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-insert.html?utm_source=chatgpt.com))

MyBatis:

```xml id="nv5s4u"
<select id="insertCase" resultMap="RegulatoryCaseRowMap">
  INSERT INTO regulatory_case (
      tenant_id,
      case_id,
      case_number,
      status,
      title,
      priority,
      created_by,
      updated_by
  )
  VALUES (
      #{tenantId},
      uuidv7(),
      generate_case_number(),
      'DRAFT',
      #{title},
      #{priority},
      #{actorId},
      #{actorId}
  )
  RETURNING
      tenant_id,
      case_id,
      case_number,
      status,
      title,
      priority,
      version,
      created_at,
      updated_at
</select>
```

Kenapa MyBatis `<select>`?

MyBatis Mapper XML menyediakan mapped statement seperti `select`, `insert`, `update`, dan `delete`; untuk PostgreSQL mutation yang mengembalikan result set melalui `RETURNING`, praktiknya sering lebih sederhana memetakannya sebagai `<select>` agar hasil row langsung menjadi object. ([MyBatis](https://mybatis.org/mybatis-3/sqlmap-xml.html?utm_source=chatgpt.com))

---

## 9. Pattern 7 - Guarded State Transition

Ini pattern paling penting untuk OLTP lifecycle.

```sql id="7g5dzh"
UPDATE regulatory_case
SET status = 'SUBMITTED',
    submitted_at = clock_timestamp(),
    version = version + 1,
    updated_by = :actorId,
    updated_at = clock_timestamp()
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND status = 'DRAFT'
  AND deleted_at IS NULL
RETURNING
    tenant_id,
    case_id,
    status,
    version,
    submitted_at,
    updated_at;
```

Interpretasi:

| Result | Makna |
|---|---|
| 1 row | Transition sukses |
| 0 row | Case tidak ada, deleted, atau state sudah berubah |
| Constraint error | Invariant DB dilanggar |

Rule:

```text id="0hc7wa"
Jangan SELECT status lalu UPDATE tanpa guard.
Gabungkan expected state di WHERE.
```

MyBatis:

```xml id="g1ajpk"
<select id="submitCase" resultMap="CaseTransitionResultMap">
  UPDATE regulatory_case
  SET status = 'SUBMITTED',
      submitted_at = clock_timestamp(),
      version = version + 1,
      updated_by = #{actorId},
      updated_at = clock_timestamp()
  WHERE tenant_id = #{tenantId}
    AND case_id = #{caseId}
    AND status = 'DRAFT'
    AND deleted_at IS NULL
  RETURNING
      tenant_id,
      case_id,
      status,
      version,
      submitted_at,
      updated_at
</select>
```

Service logic:

```java id="7kj5qd"
CaseTransitionResult result = mapper.submitCase(
    command.tenantId(),
    command.caseId(),
    command.actorId()
);

if (result == null) {
    throw new BusinessConflictException(
        "Case is not available for submit"
    );
}
```

---

## 10. Pattern 8 - Optimistic Update dengan `version`

```sql id="ky1e1o"
UPDATE regulatory_case
SET title = :title,
    priority = :priority,
    version = version + 1,
    updated_by = :actorId,
    updated_at = clock_timestamp()
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND version = :expectedVersion
  AND deleted_at IS NULL
RETURNING
    tenant_id,
    case_id,
    title,
    priority,
    version,
    updated_at;
```

Mapping:

| Result | Response |
|---|---|
| 1 row | `200 OK` |
| 0 row | `409 Conflict` jika expected version stale |
| pre-check row absent | `404 Not Found` |

Practical rule:

```text id="ov827k"
Untuk edit form / concurrent update:
version di WHERE wajib.
```

Jika user membaca version `5`, lalu submit update dengan expected `5`, update hanya berhasil kalau row masih version `5`.

---

## 11. Pattern 9 - `UPDATE ... FROM` untuk Join-Based Mutation

Contoh: assign reviewer berdasarkan role membership.

```sql id="i0p7si"
UPDATE regulatory_case c
SET reviewer_id = r.user_id,
    status = 'UNDER_REVIEW',
    version = c.version + 1,
    updated_at = clock_timestamp()
FROM reviewer_pool r
WHERE c.tenant_id = :tenantId
  AND c.case_id = :caseId
  AND c.status = 'SUBMITTED'
  AND r.tenant_id = c.tenant_id
  AND r.user_id = :reviewerId
  AND r.is_active = true
RETURNING
    c.tenant_id,
    c.case_id,
    c.reviewer_id,
    c.status,
    c.version;
```

Kapan dipakai:

```text id="u63oju"
1. mutation bergantung pada lookup table
2. validasi existence aktif
3. update butuh data dari table lain
```

Hati-hati:

```text id="2erzca"
Pastikan join menghasilkan maksimal satu matching row per target row.
Kalau join menghasilkan banyak match, hasil UPDATE bisa ambigu secara konseptual.
```

---

## 12. Pattern 10 - Soft Delete dengan `RETURNING`

Regulated data biasanya tidak dihapus fisik.

```sql id="1xbn4q"
UPDATE regulatory_case
SET deleted_at = clock_timestamp(),
    deleted_by = :actorId,
    delete_reason = :reason,
    version = version + 1,
    updated_at = clock_timestamp()
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND deleted_at IS NULL
  AND status IN ('DRAFT', 'REJECTED', 'CLOSED')
RETURNING
    tenant_id,
    case_id,
    status,
    deleted_at,
    version;
```

Kapan hard delete boleh?

```text id="9ecy9s"
1. staging/import temporary data
2. expired idempotency cache
3. ephemeral worker queue lama
4. test/sandbox data
5. data yang retention policy memang izinkan purge
```

Untuk hard delete dengan audit:

```sql id="h5bgmc"
DELETE FROM import_staging_row
WHERE import_id = :importId
  AND created_at < clock_timestamp() - interval '30 days'
RETURNING import_id, row_number;
```

PostgreSQL `DELETE` menghapus row yang memenuhi `WHERE`; jika `WHERE` tidak ada, semua row pada table target akan dihapus, sehingga production delete harus sangat disiplin dengan predicate. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-delete.html?utm_source=chatgpt.com))

---

## 13. Pattern 11 - UPSERT untuk Idempotency

```sql id="cl03ke"
INSERT INTO idempotency_request (
    tenant_id,
    idempotency_key,
    command_name,
    request_hash,
    status,
    created_at
)
VALUES (
    :tenantId,
    :idempotencyKey,
    :commandName,
    :requestHash,
    'PROCESSING',
    clock_timestamp()
)
ON CONFLICT (tenant_id, idempotency_key, command_name)
DO NOTHING
RETURNING
    tenant_id,
    idempotency_key,
    command_name,
    request_hash,
    status;
```

Pattern ini sengaja `DO NOTHING`, bukan `DO UPDATE`.

Alasan:

```text id="zs1lt9"
Duplicate request tidak boleh diam-diam mengubah request_hash/status lama.
Aplikasi harus membaca existing row dan memutuskan:
- completed same hash → return cached response
- processing same hash → resource busy
- different hash → conflict
```

PostgreSQL `INSERT ... ON CONFLICT` mendukung `DO NOTHING` atau `DO UPDATE`, dan `RETURNING` pada insert/upsert dapat mengembalikan row yang benar-benar inserted atau updated. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-insert.html?utm_source=chatgpt.com))

---

## 14. Pattern 12 - UPSERT untuk External Reference Mapping

Untuk mapping external ID, `DO UPDATE` kadang masuk akal.

```sql id="0g958y"
INSERT INTO external_reference_mapping (
    tenant_id,
    source_system,
    external_id,
    aggregate_type,
    aggregate_id,
    first_seen_at,
    last_seen_at
)
VALUES (
    :tenantId,
    :sourceSystem,
    :externalId,
    :aggregateType,
    :aggregateId,
    clock_timestamp(),
    clock_timestamp()
)
ON CONFLICT (tenant_id, source_system, external_id)
DO UPDATE
SET last_seen_at = clock_timestamp()
RETURNING
    tenant_id,
    source_system,
    external_id,
    aggregate_type,
    aggregate_id;
```

Hati-hati: `DO UPDATE` tidak boleh mengubah mapping ke aggregate lain secara diam-diam.

Lebih defensif:

```sql id="4n2yd9"
INSERT INTO external_reference_mapping (
    tenant_id,
    source_system,
    external_id,
    aggregate_type,
    aggregate_id
)
VALUES (
    :tenantId,
    :sourceSystem,
    :externalId,
    :aggregateType,
    :aggregateId
)
ON CONFLICT (tenant_id, source_system, external_id)
DO UPDATE
SET last_seen_at = clock_timestamp()
WHERE external_reference_mapping.aggregate_type = EXCLUDED.aggregate_type
  AND external_reference_mapping.aggregate_id = EXCLUDED.aggregate_id
RETURNING
    tenant_id,
    source_system,
    external_id,
    aggregate_type,
    aggregate_id;
```

Jika `RETURNING` kosong saat conflict, bisa berarti external ID sudah terikat ke aggregate lain.

---

## 15. Pattern 13 - Data-Modifying CTE untuk Atomic Chaining

PostgreSQL `WITH` dapat digunakan untuk CTE, dan data-modifying statements dalam `WITH` biasanya memakai `RETURNING`; output `RETURNING` dari statement itulah yang menjadi temporary table untuk statement berikutnya. ([PostgreSQL](https://www.postgresql.org/docs/current/queries-with.html?utm_source=chatgpt.com))

Contoh: submit case + insert history + outbox dalam satu SQL.

```sql id="ai4stg"
WITH submitted AS (
    UPDATE regulatory_case
    SET status = 'SUBMITTED',
        submitted_at = clock_timestamp(),
        version = version + 1,
        updated_by = :actorId,
        updated_at = clock_timestamp()
    WHERE tenant_id = :tenantId
      AND case_id = :caseId
      AND status = 'DRAFT'
      AND deleted_at IS NULL
    RETURNING
        tenant_id,
        case_id,
        'DRAFT'::text AS from_status,
        status AS to_status,
        version
),
history AS (
    INSERT INTO case_status_history (
        tenant_id,
        case_id,
        from_status,
        to_status,
        action,
        changed_by
    )
    SELECT
        tenant_id,
        case_id,
        from_status,
        to_status,
        'SUBMIT',
        :actorId
    FROM submitted
    RETURNING tenant_id, case_id, history_id
),
outbox AS (
    INSERT INTO outbox_event (
        tenant_id,
        outbox_id,
        aggregate_type,
        aggregate_id,
        event_type,
        payload
    )
    SELECT
        tenant_id,
        uuidv7(),
        'REGULATORY_CASE',
        case_id,
        'CASE_SUBMITTED',
        jsonb_build_object(
            'caseId', case_id,
            'version', version
        )
    FROM submitted
    RETURNING tenant_id, outbox_id
)
SELECT
    s.tenant_id,
    s.case_id,
    s.to_status AS status,
    s.version
FROM submitted s;
```

Interpretasi:

| Result | Makna |
|---|---|
| 1 row | Case submitted, history/outbox inserted |
| 0 row | Case tidak eligible untuk submit |

Practical note:

```text id="ptw5uz"
CTE mutation bagus saat perlu atomic chain yang sangat jelas.
Tapi jangan overuse sampai mapper menjadi sulit dibaca dan di-debug.
```

---

## 16. Pattern 14 - Batch Insert Multi-Row

Untuk batch kecil dari aplikasi:

```sql id="q2a9zy"
INSERT INTO case_tag (
    tenant_id,
    case_id,
    tag_code,
    created_by
)
VALUES
    (:tenantId, :caseId, :tag1, :actorId),
    (:tenantId, :caseId, :tag2, :actorId),
    (:tenantId, :caseId, :tag3, :actorId)
ON CONFLICT (tenant_id, case_id, tag_code)
DO NOTHING
RETURNING tag_code;
```

MyBatis `<foreach>`:

```xml id="01hofq"
<select id="insertCaseTags" resultType="string">
  INSERT INTO case_tag (
      tenant_id,
      case_id,
      tag_code,
      created_by
  )
  VALUES
  <foreach collection="tags" item="tag" separator=",">
    (
      #{tenantId},
      #{caseId},
      #{tag},
      #{actorId}
    )
  </foreach>
  ON CONFLICT (tenant_id, case_id, tag_code)
  DO NOTHING
  RETURNING tag_code
</select>
```

MyBatis dynamic SQL supports elements such as `if`, `choose`, `trim`, `where`, `set`, and `foreach`, which are commonly used to build SQL dynamically in mapper XML. ([MyBatis](https://mybatis.org/mybatis-3/sqlmap-xml.html?utm_source=chatgpt.com))

Rule:

```text id="3f6twf"
Batch kecil: multi-row INSERT.
Batch besar: staging table / COPY / chunked import.
```

---

## 17. Pattern 15 - Batch Update via `VALUES`

```sql id="n2rfao"
UPDATE regulatory_case c
SET priority = v.priority,
    version = c.version + 1,
    updated_by = :actorId,
    updated_at = clock_timestamp()
FROM (
    VALUES
        (:caseId1::uuid, :priority1::text),
        (:caseId2::uuid, :priority2::text),
        (:caseId3::uuid, :priority3::text)
) AS v(case_id, priority)
WHERE c.tenant_id = :tenantId
  AND c.case_id = v.case_id
  AND c.deleted_at IS NULL
RETURNING
    c.case_id,
    c.priority,
    c.version;
```

Cocok untuk:

```text id="hfh2zq"
1. update prioritas banyak case
2. bulk assignment kecil
3. reorder item
4. patch metadata terkontrol
```

Hati-hati:

```text id="xjhbpx"
1. batasi jumlah row
2. log jumlah affected rows
3. gunakan expected version jika update berasal dari user state
4. jangan batch besar dalam satu transaksi tanpa chunking
```

---

## 18. Pattern 16 - Staging Table untuk Import Besar

Untuk import banyak row, jangan langsung mutate domain core tanpa staging.

```sql id="l4z9ta"
CREATE TABLE case_import_staging (
    import_id      uuid NOT NULL,
    row_number     integer NOT NULL,
    tenant_id      bigint NOT NULL,
    case_number    text,
    title          text,
    raw_payload    jsonb NOT NULL,
    validation_status text NOT NULL DEFAULT 'PENDING',
    validation_error  text,
    created_at     timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_case_import_staging
        PRIMARY KEY (import_id, row_number)
);
```

Validate:

```sql id="esvuj3"
UPDATE case_import_staging
SET validation_status = 'INVALID',
    validation_error = 'title is required'
WHERE import_id = :importId
  AND (title IS NULL OR length(trim(title)) = 0);
```

Insert valid:

```sql id="ow2vvp"
INSERT INTO regulatory_case (
    tenant_id,
    case_id,
    case_number,
    status,
    title,
    created_by,
    updated_by
)
SELECT
    tenant_id,
    uuidv7(),
    case_number,
    'DRAFT',
    title,
    :actorId,
    :actorId
FROM case_import_staging
WHERE import_id = :importId
  AND validation_status = 'PENDING'
ON CONFLICT (tenant_id, case_number)
DO NOTHING
RETURNING tenant_id, case_id, case_number;
```

Rule:

```text id="rr9g4c"
Import besar:
raw → staging → validation → domain mutation → audit/outbox.
```

---

## 19. Pattern 17 - Avoid `SELECT *`

Buruk:

```sql id="rwspft"
SELECT *
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND status = 'SUBMITTED';
```

Lebih baik:

```sql id="6gm60i"
SELECT
    case_id,
    case_number,
    title,
    priority,
    created_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY created_at ASC
LIMIT :limit;
```

Alasan:

```text id="v76iuj"
1. payload lebih kecil
2. index-only scan lebih mungkin
3. mapper lebih stabil
4. API tidak ikut berubah saat kolom baru ditambah
5. sensitive column tidak bocor
```

---

## 20. Pattern 18 - Projection per Use Case

Detail page:

```sql id="i6a0fo"
SELECT
    tenant_id,
    case_id,
    case_number,
    status,
    title,
    description,
    priority,
    version,
    created_at,
    updated_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND case_id = :caseId;
```

Worklist:

```sql id="dc6w4y"
SELECT
    case_id,
    case_number,
    title,
    priority,
    created_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND status = 'SUBMITTED'
ORDER BY priority DESC, created_at ASC
LIMIT :limit;
```

Audit export:

```sql id="vyfe8l"
SELECT
    audit_id,
    event_type,
    actor_id,
    occurred_at,
    metadata
FROM case_audit_log
WHERE tenant_id = :tenantId
  AND case_id = :caseId
ORDER BY audit_id ASC;
```

Rule:

```text id="qbg0sn"
Satu mapper method = satu access pattern.
Jangan satu query monster dipakai untuk semua layar.
```

---

## 21. Pattern 19 - Search Screen Query Shape

Search screen umum:

```sql id="mk3c3a"
SELECT
    case_id,
    case_number,
    status,
    title,
    priority,
    created_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND deleted_at IS NULL
  AND (:status IS NULL OR status = :status)
  AND (:priority IS NULL OR priority = :priority)
  AND (:createdFrom IS NULL OR created_at >= :createdFrom)
  AND (:createdTo IS NULL OR created_at < :createdTo)
ORDER BY created_at DESC, case_id DESC
LIMIT :limit;
```

Masalah dengan banyak optional predicate:

```text id="g6b1du"
1. planner bisa sulit memilih index terbaik
2. query generic prepared statement bisa kurang optimal
3. index tunggal tidak cocok semua kombinasi
4. OR parameter nullable bisa mengurangi sargability
```

Praktik lebih baik untuk search penting:

```text id="my6k92"
1. punya query shape khusus untuk filter utama
2. pakai dynamic SQL untuk hanya menyertakan predicate aktif
3. buat index untuk kombinasi filter paling sering
4. batasi page size
5. jangan support semua kombinasi liar tanpa observability
```

MyBatis dynamic SQL:

```xml id="vmu2d5"
<select id="searchCases" resultMap="CaseListItemMap">
  SELECT
      case_id,
      case_number,
      status,
      title,
      priority,
      created_at
  FROM regulatory_case
  <where>
    tenant_id = #{tenantId}
    AND deleted_at IS NULL

    <if test="status != null">
      AND status = #{status}
    </if>

    <if test="priority != null">
      AND priority = #{priority}
    </if>

    <if test="createdFrom != null">
      AND created_at &gt;= #{createdFrom}
    </if>

    <if test="createdTo != null">
      AND created_at &lt; #{createdTo}
    </if>
  </where>
  ORDER BY created_at DESC, case_id DESC
  LIMIT #{limit}
</select>
```

---

## 22. Pattern 20 - Safe Dynamic Sorting

Jangan lakukan ini:

```xml id="wpoeqn"
ORDER BY ${sortColumn} ${sortDirection}
```

`${}` di MyBatis melakukan string substitution, bukan parameter binding. Ini riskan jika input user tidak di-whitelist.

Lebih aman:

```xml id="zwewij"
<choose>
  <when test="sort == 'CREATED_AT_ASC'">
    ORDER BY created_at ASC, case_id ASC
  </when>
  <when test="sort == 'PRIORITY_DESC'">
    ORDER BY priority DESC, created_at ASC, case_id ASC
  </when>
  <otherwise>
    ORDER BY created_at DESC, case_id DESC
  </otherwise>
</choose>
```

Rule:

```text id="h2pybo"
Parameter binding untuk value.
Whitelist untuk identifier, column name, direction, dan SQL fragment.
```

---

## 23. Pattern 21 - Mutation + Audit dalam Service Transaction

Service-side transaction lebih mudah dibaca daripada CTE besar untuk banyak tim.

```java id="ba80g0"
public SubmitCaseResult submit(SubmitCaseCommand command) {
    try (SqlSession session = sqlSessionFactory.openSession(false)) {
        DbSessionMapper db = session.getMapper(DbSessionMapper.class);
        RegulatoryCaseMapper cases = session.getMapper(RegulatoryCaseMapper.class);
        CaseAuditMapper audit = session.getMapper(CaseAuditMapper.class);
        OutboxMapper outbox = session.getMapper(OutboxMapper.class);

        db.setLocalTimeouts();

        CaseTransitionResult updated = cases.submitCase(
            command.tenantId(),
            command.caseId(),
            command.actorId()
        );

        if (updated == null) {
            session.rollback();
            throw new BusinessConflictException("Case cannot be submitted");
        }

        audit.insertStatusHistory(
            command.tenantId(),
            command.caseId(),
            "DRAFT",
            "SUBMITTED",
            "SUBMIT",
            command.actorId()
        );

        outbox.insertCaseSubmitted(
            command.tenantId(),
            command.caseId(),
            updated.version(),
            command.correlationId()
        );

        session.commit();

        return new SubmitCaseResult(
            updated.tenantId(),
            updated.caseId(),
            updated.status(),
            updated.version()
        );
    }
}
```

Rule:

```text id="zrrbnj"
Gunakan CTE jika atomic chain perlu sangat dekat di SQL.
Gunakan service transaction jika readability dan domain orchestration lebih penting.
Keduanya valid selama satu transaction boundary.
```

---

## 24. Pattern 22 - `MERGE`: Kapan Dipertimbangkan

PostgreSQL `MERGE` menyediakan satu SQL statement yang dapat melakukan conditional `INSERT`, `UPDATE`, atau `DELETE` terhadap target table berdasarkan data source. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-merge.html?utm_source=chatgpt.com))

Cocok untuk:

```text id="kz1or7"
1. synchronizing data dari staging
2. import/reconciliation
3. conditional update/insert/delete multi-branch
```

Untuk OLTP single-row idempotency, `INSERT ... ON CONFLICT` biasanya lebih sederhana dan lebih jelas.

Contoh staging sync:

```sql id="apbd63"
MERGE INTO ref_case_type t
USING case_type_staging s
ON t.case_type_code = s.case_type_code
WHEN MATCHED THEN
  UPDATE SET
      display_name = s.display_name,
      is_active = s.is_active
WHEN NOT MATCHED THEN
  INSERT (case_type_code, display_name, is_active)
  VALUES (s.case_type_code, s.display_name, s.is_active);
```

Rule:

```text id="dwpvgg"
Use MERGE untuk sync/reconciliation multi-branch.
Use ON CONFLICT untuk simple upsert berbasis unique constraint.
```

---

## 25. Anti-Pattern

### Anti-pattern 1 - Read-modify-write tanpa guard

Buruk:

```sql id="kh66a4"
SELECT status FROM regulatory_case WHERE case_id = :caseId;
UPDATE regulatory_case SET status = 'SUBMITTED' WHERE case_id = :caseId;
```

Lebih aman:

```sql id="ypxfxl"
UPDATE regulatory_case
SET status = 'SUBMITTED'
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND status = 'DRAFT'
RETURNING case_id, status;
```

---

### Anti-pattern 2 - `INSERT ... ON CONFLICT DO UPDATE` untuk semua duplicate

Buruk:

```sql id="dbx48l"
ON CONFLICT (tenant_id, idempotency_key)
DO UPDATE SET request_hash = EXCLUDED.request_hash
```

Masalah:

```text id="v5c9fj"
Duplicate request dengan body berbeda bisa overwrite hash lama.
Idempotency rusak.
```

Lebih aman:

```sql id="8ykr8e"
ON CONFLICT DO NOTHING
```

Lalu aplikasi baca existing row dan compare hash.

---

### Anti-pattern 3 - Soft delete tapi query lupa filter

Buruk:

```sql id="2li75e"
SELECT *
FROM regulatory_case
WHERE tenant_id = :tenantId;
```

Lebih aman:

```sql id="5w2l2q"
WHERE tenant_id = :tenantId
  AND deleted_at IS NULL
```

Tambahkan partial index:

```sql id="6jefum"
CREATE INDEX idx_regulatory_case__active
ON regulatory_case (tenant_id, status, created_at DESC)
WHERE deleted_at IS NULL;
```

---

### Anti-pattern 4 - Dynamic SQL unsafe

Buruk:

```xml id="fnxovp"
ORDER BY ${sortColumn}
```

Lebih aman:

```xml id="ll1qbi"
<choose>
  <when test="sort == 'CREATED_AT_DESC'">
    ORDER BY created_at DESC, case_id DESC
  </when>
  <otherwise>
    ORDER BY case_id DESC
  </otherwise>
</choose>
```

---

### Anti-pattern 5 - Batch terlalu besar dalam satu transaksi

Masalah:

```text id="tgjqwv"
1. lock lama
2. WAL spike
3. replication lag
4. autovacuum pressure
5. rollback mahal
6. connection tertahan
```

Lebih aman:

```text id="h40e6n"
chunk 500-5000 rows, tergantung row size dan workload
commit per chunk
staging table untuk validasi
observability per batch
```

---

## 26. Production Checklist Query & Mutation

| Checklist | Pertanyaan |
|---|---|
| Point lookup index-backed | Apakah query by ID memakai PK/composite index? |
| Business lookup punya unique/index | Apakah `case_number` lookup tidak scan? |
| List query deterministic | Apakah `ORDER BY` punya tie-breaker? |
| Pagination aman | Apakah list besar memakai keyset, bukan offset besar? |
| No `SELECT *` | Apakah projection eksplisit per use case? |
| Mutation guarded | Apakah update state punya expected status/version? |
| `RETURNING` dipakai | Apakah generated/updated value tidak di-query ulang terpisah? |
| Upsert aman | Apakah `ON CONFLICT DO UPDATE` tidak overwrite data penting diam-diam? |
| Soft delete konsisten | Apakah semua active query filter `deleted_at IS NULL`? |
| Batch chunked | Apakah batch besar tidak satu transaksi raksasa? |
| Dynamic sort whitelist | Apakah tidak ada `${userInput}` untuk SQL fragment? |
| Mapper jelas | Apakah satu mapper method mewakili satu access pattern? |
| Error mapped | Apakah 0 row update menjadi conflict/not found sesuai konteks? |
| Audit/outbox atomic | Apakah mutation + audit + outbox dalam satu transaksi? |

---

## 27. Mini Lab

### Step 1 - Create table

```sql id="62w3rg"
CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL,
    status       text NOT NULL,
    title        text NOT NULL,
    priority     text NOT NULL DEFAULT 'NORMAL',
    version      bigint NOT NULL DEFAULT 0,
    created_by   text NOT NULL,
    updated_by   text NOT NULL,
    submitted_at timestamptz,
    created_at   timestamptz NOT NULL DEFAULT clock_timestamp(),
    updated_at   timestamptz NOT NULL DEFAULT clock_timestamp(),
    deleted_at   timestamptz,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number),

    CONSTRAINT chk_regulatory_case__status
        CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CLOSED'))
);

CREATE INDEX idx_regulatory_case__tenant_status_created
ON regulatory_case (tenant_id, status, created_at DESC, case_id DESC)
WHERE deleted_at IS NULL;
```

### Step 2 - Insert with returning

```sql id="yjj9ea"
INSERT INTO regulatory_case (
    tenant_id,
    case_number,
    status,
    title,
    created_by,
    updated_by
)
VALUES (
    1001,
    'CASE-2026-0001',
    'DRAFT',
    'Suspicious activity review',
    'user-001',
    'user-001'
)
RETURNING tenant_id, case_id, case_number, status, version;
```

### Step 3 - Guarded submit

```sql id="4hoy7e"
UPDATE regulatory_case
SET status = 'SUBMITTED',
    submitted_at = clock_timestamp(),
    version = version + 1,
    updated_by = 'user-001',
    updated_at = clock_timestamp()
WHERE tenant_id = 1001
  AND case_number = 'CASE-2026-0001'
  AND status = 'DRAFT'
RETURNING case_id, status, version, submitted_at;
```

### Step 4 - Submit again

```sql id="1y4zce"
UPDATE regulatory_case
SET status = 'SUBMITTED',
    submitted_at = clock_timestamp(),
    version = version + 1,
    updated_by = 'user-001',
    updated_at = clock_timestamp()
WHERE tenant_id = 1001
  AND case_number = 'CASE-2026-0001'
  AND status = 'DRAFT'
RETURNING case_id, status, version, submitted_at;
```

Expected:

```text id="oqcytw"
0 rows returned.
Aplikasi harus treat sebagai conflict.
```

### Step 5 - Worklist query

```sql id="18t3mm"
SELECT
    case_id,
    case_number,
    title,
    priority,
    created_at
FROM regulatory_case
WHERE tenant_id = 1001
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY created_at DESC, case_id DESC
LIMIT 20;
```

---

## 28. Ringkasan Praktis

```text id="fp3m9c"
1. Query OLTP harus dibentuk dari access pattern.
2. Point lookup harus index-backed dan tenant-aware.
3. List query butuh WHERE + ORDER BY + LIMIT yang cocok dengan index.
4. Gunakan keyset pagination untuk list besar.
5. Hindari SELECT *; buat projection per use case.
6. Gunakan INSERT/UPDATE/DELETE ... RETURNING untuk generated/changed values.
7. State transition harus guarded dengan expected state/version.
8. UPSERT harus didesain sesuai semantics, terutama untuk idempotency.
9. Data-modifying CTE berguna untuk atomic mutation chain.
10. Batch besar harus lewat staging/chunking, bukan transaksi raksasa.
11. Dynamic SQL harus whitelist untuk identifier/sort, bukan raw substitution user input.
12. MyBatis mapper sebaiknya merepresentasikan query shape yang eksplisit dan production-readable.
```

---

# Status Seri

**Seri 7/22 selesai.**

Rekomendasi lanjut ke:

**Seri 8 - Optimistic & Pessimistic Concurrency Control untuk PostgreSQL OLTP: version column, compare-and-set update, row lock, `NOWAIT`, `SKIP LOCKED`, advisory lock, conflict mapping, dan retry pattern di Java/Jersey/MyBatis.**

---

**Sources:**

- [Documentation: 18: 6.4. Returning Data from Modified Rows](https://www.postgresql.org/docs/current/dml-returning.html?utm_source=chatgpt.com)
- [MyBatis 3 | Mapper XML Files](https://mybatis.org/mybatis-3/sqlmap-xml.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:14:58 PM

Saya lanjut ke **Seri 8/22**. Fokusnya bukan mengulang locking seri 2, tapi membedakan kapan pakai optimistic control, pessimistic lock, advisory lock, retry, dan bagaimana mapping conflict ke service/API.

# PostgreSQL OLTP - Seri 8/22  
## Optimistic & Pessimistic Concurrency Control: Version Column, Compare-and-Set Update, Row Lock, `NOWAIT`, `SKIP LOCKED`, Advisory Lock, Conflict Mapping, dan Retry Pattern

Seri ini menjawab pertanyaan praktis:

```text id="ehtfns"
Saat dua request/job mengubah data yang sama,
bagaimana memastikan hasilnya benar,
tanpa membuat semua transaksi saling menunggu terlalu lama?
```

PostgreSQL menyediakan beberapa fondasi concurrency: MVCC, isolation level, row-level lock, explicit lock clause, advisory lock, timeout, dan SQLSTATE untuk error handling. Row-level lock di PostgreSQL tidak memblok pembacaan biasa; ia memblok writer atau locker lain terhadap row yang sama sampai transaksi selesai. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html?utm_source=chatgpt.com))

---

## 1. Mental Model

```text id="3xfrn0"
Concurrency Control
│
├─ Optimistic
│  ├─ asumsi conflict jarang
│  ├─ update pakai expected version/state
│  ├─ 0 row affected = conflict
│  └─ cocok untuk edit form / metadata update
│
├─ Pessimistic
│  ├─ asumsi conflict mungkin/mahal
│  ├─ lock row sebelum proses
│  ├─ transaksi lain menunggu/fail/skip
│  └─ cocok untuk claim task / reservation / exclusive decision
│
├─ Atomic Guarded Mutation
│  ├─ UPDATE ... WHERE expected_state
│  ├─ INSERT ... ON CONFLICT
│  ├─ DELETE ... WHERE expected_state
│  └─ RETURNING
│
├─ Retryable Transaction
│  ├─ serialization_failure 40001
│  ├─ deadlock_detected 40P01
│  ├─ retry seluruh transaksi
│  └─ external side effect harus setelah commit
│
└─ Conflict Mapping
   ├─ 409 Conflict
   ├─ 423 Locked
   ├─ 404 Not Found
   ├─ retry internal
   └─ business-safe error response
```

Rule utama:

```text id="wbf1wz"
Optimistic control = deteksi conflict.
Pessimistic control = cegah conflict dengan lock.
Atomic guarded update = sering cukup tanpa SELECT FOR UPDATE.
```

---

## 2. Decision Table

| Use case | Pattern | Kenapa |
|---|---|---|
| User edit title/description | Optimistic `version` | Conflict jarang, UX bisa minta reload |
| Submit case dari `DRAFT` | Guarded update by status | Atomic dan sederhana |
| Approve final decision | `FOR UPDATE` atau guarded update + version | Keputusan final harus eksklusif |
| Claim workflow task | Atomic claim atau `FOR UPDATE SKIP LOCKED` | Hindari double-claim |
| Worker queue | `FOR UPDATE SKIP LOCKED` | Worker lain skip row locked |
| Inventory/quota reservation | Pessimistic lock atau atomic decrement guard | Oversell/over-reserve harus dicegah |
| One job per tenant | Advisory transaction lock | Resource tidak selalu cocok sebagai row |
| Complex invariant lintas row | Explicit lock atau `SERIALIZABLE` + retry | Butuh serial behavior |
| High-contention counter | Hindari hot row; shard/ledger/event | Lock akan bottleneck |
| Duplicate API retry | Idempotency key + unique constraint | Retry-safe POST |

---

## 3. Optimistic Concurrency Control

Optimistic concurrency cocok saat collision jarang, contohnya user membuka form lalu menyimpan perubahan.

### Schema

```sql id="63qd9h"
CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL,
    status       text NOT NULL,
    title        text NOT NULL,
    version      bigint NOT NULL DEFAULT 0,
    updated_by   text NOT NULL,
    updated_at   timestamptz NOT NULL DEFAULT clock_timestamp(),
    deleted_at   timestamptz,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number)
);
```

### Update dengan compare-and-set

```sql id="2jv97c"
UPDATE regulatory_case
SET title = :newTitle,
    version = version + 1,
    updated_by = :actorId,
    updated_at = clock_timestamp()
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND version = :expectedVersion
  AND deleted_at IS NULL
RETURNING
    tenant_id,
    case_id,
    title,
    version,
    updated_at;
```

Interpretasi:

| Result | Makna |
|---|---|
| 1 row | Update sukses |
| 0 row | Row tidak ada, deleted, tenant mismatch, atau version stale |
| Constraint error | Input/domain invariant dilanggar |

Untuk API:

```text id="oa2798"
0 row karena stale version → 409 Conflict
0 row karena not found     → 404 Not Found
```

Kalau tidak ingin query tambahan untuk membedakan `404` vs `409`, boleh treat sebagai `409/404` sesuai policy endpoint, tapi untuk UX enterprise biasanya lebih baik dibedakan.

---

## 4. Optimistic Update dengan Status Guard

Untuk lifecycle transition, `version` saja sering kurang eksplisit. Tambahkan expected state.

```sql id="97x2l7"
UPDATE regulatory_case
SET status = 'SUBMITTED',
    version = version + 1,
    updated_by = :actorId,
    updated_at = clock_timestamp()
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND status = 'DRAFT'
  AND version = :expectedVersion
  AND deleted_at IS NULL
RETURNING
    tenant_id,
    case_id,
    status,
    version;
```

Pattern ini menyatukan dua guard:

```text id="w2lu04"
state guard   → hanya DRAFT yang boleh SUBMITTED
version guard → user/action berbasis state yang masih sama
```

Cocok untuk:

```text id="a7h7l5"
submit case
cancel draft
edit metadata
approve berdasarkan screen version
change priority
assign manual dari UI
```

---

## 5. Pessimistic Concurrency Control

Pessimistic concurrency dipakai ketika conflict bukan sekadar “kemungkinan kecil”, tetapi harus dicegah saat proses berlangsung.

PostgreSQL `SELECT ... FOR UPDATE` mengunci row yang dipilih sehingga transaksi lain yang ingin update/delete/lock row yang sama harus menunggu; `NOWAIT` membuat statement gagal bila lock tidak bisa diperoleh segera, sedangkan `SKIP LOCKED` melewati row yang tidak bisa dikunci. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html?utm_source=chatgpt.com))

### Basic `FOR UPDATE`

```sql id="iqut1b"
BEGIN;

SELECT
    tenant_id,
    case_id,
    status,
    reviewer_id,
    version
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND case_id = :caseId
FOR UPDATE;

-- application validates current state

UPDATE regulatory_case
SET status = 'UNDER_REVIEW',
    reviewer_id = :reviewerId,
    version = version + 1,
    updated_at = clock_timestamp()
WHERE tenant_id = :tenantId
  AND case_id = :caseId;

COMMIT;
```

Gunakan jika:

```text id="a307w5"
1. harus baca current state dulu
2. logic terlalu kompleks untuk satu UPDATE guard
3. beberapa mutation bergantung pada row yang sama
4. double-processing sangat mahal
```

Hindari jika:

```text id="xxge31"
1. hanya read-only detail screen
2. transaksi bisa lama
3. ada external API call di dalam transaksi
4. query mengunci banyak row tanpa batas
```

---

## 6. Atomic Claim Tanpa `SELECT FOR UPDATE`

Untuk claim sederhana, sering lebih baik satu `UPDATE`.

```sql id="134ols"
UPDATE workflow_task
SET assignee_id = :actorId,
    status = 'CLAIMED',
    claimed_at = clock_timestamp(),
    version = version + 1
WHERE tenant_id = :tenantId
  AND task_id = :taskId
  AND status = 'READY'
  AND assignee_id IS NULL
RETURNING
    tenant_id,
    task_id,
    assignee_id,
    status,
    version;
```

Kenapa ini bagus:

```text id="ldovtc"
1. satu statement
2. atomic
3. tidak perlu transaksi panjang
4. 0 row langsung berarti task sudah tidak available
```

Ini adalah default pattern untuk state transition yang sederhana.

---

## 7. `NOWAIT` untuk Fail-Fast User Command

Kalau user action tidak boleh menggantung menunggu lock:

```sql id="b0amvg"
SELECT
    tenant_id,
    case_id,
    status,
    version
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND case_id = :caseId
FOR UPDATE NOWAIT;
```

Jika row sedang dikunci, PostgreSQL mengembalikan error `55P03 lock_not_available`; dokumentasi error code PostgreSQL menyarankan aplikasi mengecek SQLSTATE, bukan teks error, karena kode lebih stabil dan tidak tergantung lokalisasi pesan. ([PostgreSQL](https://www.postgresql.org/docs/current/errcodes-appendix.html))

Mapping:

| SQLSTATE | Meaning | API |
|---|---|---|
| `55P03` | `lock_not_available` | `409 Conflict`, `423 Locked`, atau retry internal |
| `40001` | `serialization_failure` | retry seluruh transaksi |
| `40P01` | `deadlock_detected` | retry + investigasi lock ordering |

---

## 8. `SKIP LOCKED` untuk Queue Worker

`SKIP LOCKED` berguna untuk banyak worker yang mengambil pekerjaan dari table yang sama. Dokumentasi PostgreSQL menjelaskan bahwa `SKIP LOCKED` melewati row yang tidak bisa segera dikunci; hasilnya tidak cocok untuk general-purpose consistent view, tetapi cocok untuk workload queue. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-select.html))

### Schema

```sql id="hlr81x"
CREATE TABLE workflow_job (
    tenant_id      bigint NOT NULL,
    job_id         bigint GENERATED ALWAYS AS IDENTITY,
    job_type       text NOT NULL,
    payload        jsonb NOT NULL,
    status         text NOT NULL,
    available_at   timestamptz NOT NULL DEFAULT clock_timestamp(),
    locked_by      text,
    locked_at      timestamptz,
    attempt_count  integer NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_workflow_job
        PRIMARY KEY (tenant_id, job_id),

    CONSTRAINT chk_workflow_job__status
        CHECK (status IN ('READY', 'PROCESSING', 'DONE', 'FAILED'))
);

CREATE INDEX idx_workflow_job__ready
ON workflow_job (tenant_id, available_at, job_id)
WHERE status = 'READY';
```

### Claim batch

```sql id="d1b6rw"
WITH candidate AS (
    SELECT tenant_id, job_id
    FROM workflow_job
    WHERE tenant_id = :tenantId
      AND status = 'READY'
      AND available_at <= clock_timestamp()
    ORDER BY available_at ASC, job_id ASC
    LIMIT :batchSize
    FOR UPDATE SKIP LOCKED
)
UPDATE workflow_job j
SET status = 'PROCESSING',
    locked_by = :workerId,
    locked_at = clock_timestamp(),
    attempt_count = attempt_count + 1
FROM candidate c
WHERE j.tenant_id = c.tenant_id
  AND j.job_id = c.job_id
RETURNING
    j.tenant_id,
    j.job_id,
    j.job_type,
    j.payload,
    j.attempt_count;
```

Rule:

```text id="4g45av"
SKIP LOCKED = bagus untuk worker pool.
SKIP LOCKED = buruk untuk user-facing list yang harus lengkap/konsisten.
```

---

## 9. Requeue Stuck Job

Worker bisa mati setelah claim.

```sql id="omndgk"
UPDATE workflow_job
SET status = 'READY',
    locked_by = NULL,
    locked_at = NULL,
    available_at = clock_timestamp() + interval '30 seconds'
WHERE status = 'PROCESSING'
  AND locked_at < clock_timestamp() - interval '5 minutes'
  AND attempt_count < 5
RETURNING tenant_id, job_id;
```

Mark failed:

```sql id="7bpjbg"
UPDATE workflow_job
SET status = 'FAILED'
WHERE status = 'PROCESSING'
  AND locked_at < clock_timestamp() - interval '5 minutes'
  AND attempt_count >= 5
RETURNING tenant_id, job_id;
```

Production note:

```text id="zn46jd"
Queue table harus punya:
- lease timeout
- attempt counter
- dead-letter / FAILED state
- idempotent job execution
- observability per job_type
```

---

## 10. Advisory Lock untuk Resource Non-Row

Advisory lock adalah lock yang maknanya ditentukan aplikasi; PostgreSQL menyediakan session-level dan transaction-level advisory lock, dan transaction-level advisory lock otomatis dilepas di akhir transaksi. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-admin.html))

Gunakan untuk:

```text id="7kdpc2"
1. hanya satu scheduler per tenant
2. hanya satu recalculation untuk account tertentu
3. prevent duplicate monthly closing
4. coordinate maintenance job
5. resource tidak punya row natural untuk di-lock
```

### Transaction-level advisory lock

```sql id="8ug7bx"
BEGIN;

SELECT pg_advisory_xact_lock(hashtext(:tenantId || ':monthly-closing'));

-- critical section

UPDATE tenant_monthly_closing
SET status = 'RUNNING',
    started_at = clock_timestamp()
WHERE tenant_id = :tenantId
  AND closing_month = :closingMonth
  AND status = 'PENDING';

COMMIT;
```

### Try-lock fail-fast

```sql id="zos91m"
SELECT pg_try_advisory_xact_lock(hashtext(:lockKey)) AS acquired;
```

Interpretasi:

| `acquired` | Makna |
|---|---|
| `true` | lanjut proses |
| `false` | proses lain sedang memegang lock |

Rule untuk aplikasi dengan connection pool:

```text id="q4jq78"
Prefer pg_advisory_xact_lock / pg_try_advisory_xact_lock.
Hindari session-level advisory lock kecuali lifecycle connection benar-benar dikontrol.
```

---

## 11. Isolation Level dan Retry

PostgreSQL mendukung isolation level SQL standard, tetapi secara internal hanya tiga level berbeda yang diimplementasikan; `Read Uncommitted` diperlakukan seperti `Read Committed`. ([PostgreSQL](https://www.postgresql.org/docs/current/transaction-iso.html?utm_source=chatgpt.com))

Practical default:

```text id="k35bed"
Default OLTP: READ COMMITTED + constraint + guarded update.
Naik ke SERIALIZABLE hanya saat invariant lintas row/table sulit dikunci manual.
```

PostgreSQL menyatakan aplikasi yang memakai serializable transactions harus siap mengulang transaksi akibat `serialization_failure` dengan SQLSTATE `40001`; deadlock failure memakai SQLSTATE `40P01` dan juga layak diretry pada banyak kasus. Retry harus mengulang seluruh transaction logic, bukan hanya statement terakhir. ([PostgreSQL](https://www.postgresql.org/docs/current/mvcc-serialization-failure-handling.html?utm_source=chatgpt.com))

---

## 12. Error Classification

| SQLSTATE | Condition | Treatment |
|---|---|---|
| `40001` | `serialization_failure` | Retry seluruh transaksi |
| `40P01` | `deadlock_detected` | Retry seluruh transaksi + perbaiki lock ordering |
| `55P03` | `lock_not_available` | Fail-fast/resource busy atau retry pendek |
| `23505` | `unique_violation` | Business conflict/idempotency, bukan blind retry |
| `23503` | `foreign_key_violation` | Stale reference/not found/invalid request |
| `23514` | `check_violation` | Invalid state/input |
| `25P03` | `idle_in_transaction_session_timeout` | Bug transaksi/session handling |
| `25P04` | `transaction_timeout` | Transaksi terlalu lama |

PostgreSQL mendokumentasikan SQLSTATE `23505`, `23503`, `23514`, `40001`, `40P01`, `55P03`, `25P03`, dan `25P04` dalam Appendix A PostgreSQL 18.4. ([PostgreSQL](https://www.postgresql.org/docs/current/errcodes-appendix.html))

---

## 13. Java Retry Wrapper

```java id="xk71in"
public final class PostgresConcurrencyRetrier {
    private static final Set<String> RETRYABLE_TRANSACTION_STATES = Set.of(
        "40001", // serialization_failure
        "40P01"  // deadlock_detected
    );

    private static final Set<String> RESOURCE_BUSY_STATES = Set.of(
        "55P03"  // lock_not_available
    );

    public <T> T execute(Supplier<T> operation) {
        RuntimeException last = null;

        for (int attempt = 1; attempt <= 3; attempt++) {
            try {
                return operation.get();
            } catch (RuntimeException e) {
                String sqlState = findSqlState(e);

                if (sqlState == null) {
                    throw e;
                }

                if (RETRYABLE_TRANSACTION_STATES.contains(sqlState) && attempt < 3) {
                    last = e;
                    sleep(attempt);
                    continue;
                }

                if (RESOURCE_BUSY_STATES.contains(sqlState)) {
                    throw new ResourceBusyException("Resource is currently locked", e);
                }

                throw e;
            }
        }

        throw last;
    }

    private String findSqlState(Throwable error) {
        Throwable current = error;

        while (current != null) {
            if (current instanceof SQLException sqlException) {
                return sqlException.getSQLState();
            }

            current = current.getCause();
        }

        return null;
    }

    private void sleep(int attempt) {
        try {
            long delayMs = 25L * attempt * attempt;
            Thread.sleep(delayMs);
        } catch (InterruptedException interrupted) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted during retry backoff", interrupted);
        }
    }
}
```

Rule penting:

```text id="kj41uw"
Retry harus membungkus seluruh command transaction.
Jangan retry jika external side effect sudah dilakukan sebelum commit.
```

---

## 14. MyBatis Transaction Pattern

MyBatis `SqlSession` adalah objek utama untuk menjalankan statement, commit/rollback transaction, dan mengambil mapper instance. ([MyBatis](https://mybatis.org/mybatis-3/java-api.html?utm_source=chatgpt.com))

```java id="b164dn"
public final class CaseEditService {
    private final SqlSessionFactory sqlSessionFactory;

    public CaseEditService(SqlSessionFactory sqlSessionFactory) {
        this.sqlSessionFactory = sqlSessionFactory;
    }

    public CaseRow updateTitle(UpdateCaseTitleCommand command) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            DbSessionMapper db = session.getMapper(DbSessionMapper.class);
            RegulatoryCaseMapper cases = session.getMapper(RegulatoryCaseMapper.class);

            db.setLocalTimeouts();

            CaseRow updated = cases.updateTitleOptimistic(
                command.tenantId(),
                command.caseId(),
                command.newTitle(),
                command.expectedVersion(),
                command.actorId()
            );

            if (updated == null) {
                session.rollback();
                throw new BusinessConflictException(
                    "Case was changed by another transaction"
                );
            }

            session.commit();
            return updated;
        }
    }
}
```

Mapper:

```xml id="l1vran"
<select id="updateTitleOptimistic" resultMap="RegulatoryCaseRowMap">
  UPDATE regulatory_case
  SET title = #{newTitle},
      version = version + 1,
      updated_by = #{actorId},
      updated_at = clock_timestamp()
  WHERE tenant_id = #{tenantId}
    AND case_id = #{caseId}
    AND version = #{expectedVersion}
    AND deleted_at IS NULL
  RETURNING
      tenant_id,
      case_id,
      case_number,
      status,
      title,
      version,
      updated_at
</select>
```

---

## 15. Timeout Per Transaction

PostgreSQL menyediakan client-connection settings seperti `lock_timeout`, `statement_timeout`, `idle_in_transaction_session_timeout`, dan `transaction_timeout`; `lock_timeout` berlaku saat menunggu lock, sedangkan `statement_timeout` membatasi durasi statement. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-client.html))

```sql id="it1ux3"
SET LOCAL lock_timeout = '500ms';
SET LOCAL statement_timeout = '5s';
SET LOCAL idle_in_transaction_session_timeout = '10s';
```

Mapper:

```xml id="iyzj6o"
<update id="setLocalTimeouts">
  SET LOCAL lock_timeout = '500ms';
  SET LOCAL statement_timeout = '5s';
  SET LOCAL idle_in_transaction_session_timeout = '10s'
</update>
```

Rule:

```text id="ow5935"
SET LOCAL hanya berlaku dalam transaksi saat ini.
Cocok untuk command-level safety.
```

---

## 16. Pattern: Reservation / Quota

### Atomic decrement guard

```sql id="u0cnso"
UPDATE quota_bucket
SET available_quota = available_quota - :requested,
    version = version + 1,
    updated_at = clock_timestamp()
WHERE tenant_id = :tenantId
  AND quota_key = :quotaKey
  AND available_quota >= :requested
RETURNING
    tenant_id,
    quota_key,
    available_quota,
    version;
```

Interpretasi:

| Result | Makna |
|---|---|
| 1 row | reservation sukses |
| 0 row | quota tidak cukup / bucket tidak ada |
| conflict tinggi | pertimbangkan sharding bucket/ledger |

### Dengan ledger

```sql id="3jyp2l"
WITH reserved AS (
    UPDATE quota_bucket
    SET available_quota = available_quota - :requested,
        version = version + 1,
        updated_at = clock_timestamp()
    WHERE tenant_id = :tenantId
      AND quota_key = :quotaKey
      AND available_quota >= :requested
    RETURNING tenant_id, quota_key, version
)
INSERT INTO quota_reservation_ledger (
    tenant_id,
    reservation_id,
    quota_key,
    amount,
    actor_id,
    created_at
)
SELECT
    tenant_id,
    uuidv7(),
    quota_key,
    :requested,
    :actorId,
    clock_timestamp()
FROM reserved
RETURNING
    tenant_id,
    reservation_id,
    quota_key,
    amount;
```

Rule:

```text id="y2ldd3"
Untuk resource berjumlah:
guard condition di UPDATE adalah concurrency control utama.
Ledger membuat hasilnya auditable.
```

---

## 17. Pattern: One Active Assignment

Constraint dulu:

```sql id="cg6rwr"
CREATE TABLE case_assignment (
    tenant_id      bigint NOT NULL,
    case_id        uuid NOT NULL,
    assignment_id  uuid NOT NULL DEFAULT uuidv7(),
    officer_id     text NOT NULL,
    assigned_at    timestamptz NOT NULL DEFAULT clock_timestamp(),
    released_at    timestamptz,

    CONSTRAINT pk_case_assignment
        PRIMARY KEY (tenant_id, case_id, assignment_id)
);

CREATE UNIQUE INDEX uq_case_assignment__one_active
ON case_assignment (tenant_id, case_id)
WHERE released_at IS NULL;
```

Insert assignment:

```sql id="u7ph9d"
INSERT INTO case_assignment (
    tenant_id,
    case_id,
    officer_id
)
VALUES (
    :tenantId,
    :caseId,
    :officerId
)
RETURNING
    tenant_id,
    case_id,
    assignment_id,
    officer_id,
    assigned_at;
```

Jika sudah ada active assignment, unique violation `23505` terjadi. Ini bukan sekadar error teknis; ini business conflict.

Mapping:

```text id="dp4c79"
23505 + uq_case_assignment__one_active
→ 409 Conflict: case already assigned
```

PostgreSQL melaporkan constraint-related SQLSTATE dan, untuk class 23 integrity constraint violation, dapat menyertakan nama constraint dalam field error report sehingga aplikasi tidak perlu parsing text message. ([PostgreSQL](https://www.postgresql.org/docs/current/errcodes-appendix.html))

---

## 18. Pattern: Complex Approval with Lock

Jika approval harus membaca banyak child row dan membuat decision final, explicit lock lebih aman.

```sql id="k9z5mi"
BEGIN;

SET LOCAL lock_timeout = '500ms';
SET LOCAL statement_timeout = '5s';

SELECT
    tenant_id,
    case_id,
    status,
    version
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND case_id = :caseId
FOR UPDATE NOWAIT;

-- validate evidence, party, scoring, rule snapshot

UPDATE regulatory_case
SET status = 'APPROVED',
    version = version + 1,
    updated_by = :actorId,
    updated_at = clock_timestamp()
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND status = 'UNDER_REVIEW';

INSERT INTO case_decision (
    tenant_id,
    decision_id,
    case_id,
    decision_type,
    decided_by,
    decided_at
)
VALUES (
    :tenantId,
    uuidv7(),
    :caseId,
    'APPROVAL',
    :actorId,
    clock_timestamp()
);

COMMIT;
```

Kenapa `FOR UPDATE NOWAIT`?

```text id="rp302w"
Final decision sebaiknya tidak diam-diam menunggu lama.
Kalau case sedang diproses transaksi lain, API bisa fail-fast sebagai resource busy.
```

---

## 19. Conflict Mapping untuk Jersey API

| Domain condition | DB signal | HTTP |
|---|---|---|
| Version stale | `UPDATE RETURNING` 0 row | `409 Conflict` |
| Task already claimed | `UPDATE RETURNING` 0 row | `409 Conflict` |
| Row locked by another command | `55P03` | `423 Locked` atau `409 Conflict` |
| Duplicate active assignment | `23505` + constraint name | `409 Conflict` |
| Serialization/deadlock after retries | `40001` / `40P01` | `503` atau `409`, tergantung command |
| Parent missing | `23503` atau pre-check | `404` / `409` |
| Invalid state | `CHECK` / 0 row guard | `400` atau `409` |

Jersey mapper:

```java id="31ys05"
@Provider
public final class DomainExceptionMapper
        implements ExceptionMapper<DomainException> {

    @Override
    public Response toResponse(DomainException exception) {
        ErrorBody body = new ErrorBody(
            exception.code(),
            exception.getMessage(),
            exception.correlationId()
        );

        return Response
            .status(exception.httpStatus())
            .type(MediaType.APPLICATION_JSON_TYPE)
            .entity(body)
            .build();
    }
}
```

Business exception:

```java id="px8n2q"
public final class BusinessConflictException extends DomainException {
    public BusinessConflictException(String message) {
        super("BUSINESS_CONFLICT", message, 409);
    }
}
```

---

## 20. Anti-Pattern

### Anti-pattern 1 - Read then write tanpa guard

Buruk:

```sql id="2cf07g"
SELECT version FROM regulatory_case WHERE case_id = :caseId;

UPDATE regulatory_case
SET title = :title
WHERE case_id = :caseId;
```

Lebih aman:

```sql id="xsewuq"
UPDATE regulatory_case
SET title = :title,
    version = version + 1
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND version = :expectedVersion
RETURNING case_id, version;
```

---

### Anti-pattern 2 - `SELECT FOR UPDATE` terlalu luas

Buruk:

```sql id="v7zehp"
SELECT *
FROM regulatory_case
WHERE tenant_id = :tenantId
FOR UPDATE;
```

Masalah:

```text id="yinz7s"
mengunci banyak row
menurunkan concurrency
meningkatkan deadlock risk
mengganggu user/job lain
```

Lebih aman:

```sql id="8sbod0"
SELECT *
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND case_id = :caseId
FOR UPDATE;
```

---

### Anti-pattern 3 - Retry statement terakhir saja

Buruk:

```text id="s8i4zd"
UPDATE sukses
INSERT audit gagal 40001
retry INSERT audit saja
```

Benar:

```text id="iqp8s0"
retry seluruh command transaction:
read → decide → update → audit → outbox → commit
```

PostgreSQL secara eksplisit menekankan bahwa retry serialization failure harus mengulang transaksi lengkap, termasuk semua logic yang menentukan SQL/value di dalam transaksi. ([PostgreSQL](https://www.postgresql.org/docs/current/mvcc-serialization-failure-handling.html?utm_source=chatgpt.com))

---

### Anti-pattern 4 - External call dalam transaction

Buruk:

```text id="1odb0s"
BEGIN
  lock case
  call external service
  update DB
COMMIT
```

Risiko:

```text id="13twxq"
lock tertahan
connection tertahan
timeout meningkat
deadlock/blocked session lebih mungkin
external latency menjadi DB contention
```

Lebih baik:

```text id="jcxinb"
BEGIN
  update state
  insert outbox
COMMIT

worker publish/call external system
```

---

### Anti-pattern 5 - Blind retry semua error

Jangan retry:

```text id="i10fg9"
23505 unique_violation
23503 foreign_key_violation
23514 check_violation
invalid input
authorization failure
```

Retry hanya transient/concurrency-specific error yang aman, terutama `40001` dan `40P01`, dengan batas attempt dan backoff. ([PostgreSQL](https://www.postgresql.org/docs/current/errcodes-appendix.html))

---

## 21. Production Checklist

| Checklist | Pertanyaan |
|---|---|
| Version column | Apakah editable aggregate punya `version`? |
| Guarded update | Apakah state transition pakai expected state/version? |
| 0 row mapping | Apakah `0 row` tidak dianggap sukses diam-diam? |
| Lock scope | Apakah `FOR UPDATE` hanya mengunci row yang perlu? |
| Fail-fast | Apakah command user-sensitive memakai `NOWAIT`/`lock_timeout` bila perlu? |
| Queue safe | Apakah worker claim memakai `SKIP LOCKED` dan lease timeout? |
| Retry safe | Apakah retry mengulang seluruh transaksi? |
| Side effect safe | Apakah external call/publish terjadi setelah commit/outbox? |
| SQLSTATE handling | Apakah app mengecek SQLSTATE, bukan pesan teks? |
| Constraint mapping | Apakah unique/FK/check/exclusion dipetakan ke domain error? |
| Advisory lock | Apakah memakai transaction-level lock untuk connection pool? |
| Timeout | Apakah `lock_timeout` dan `statement_timeout` diset per command penting? |
| Deadlock ordering | Jika lock banyak resource, apakah urutannya deterministic? |
| Observability | Apakah log mencatat SQLSTATE, constraint, command, tenant, correlation ID? |

---

## 22. Mini Lab

### Step 1 - Setup

```sql id="gibm4j"
CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL,
    status       text NOT NULL,
    title        text NOT NULL,
    version      bigint NOT NULL DEFAULT 0,
    updated_at   timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number)
);

INSERT INTO regulatory_case (
    tenant_id,
    case_number,
    status,
    title
)
VALUES (
    1001,
    'CASE-2026-0001',
    'DRAFT',
    'Initial title'
)
RETURNING tenant_id, case_id, version;
```

### Step 2 - Optimistic update pertama

```sql id="16zypy"
UPDATE regulatory_case
SET title = 'Updated by user A',
    version = version + 1,
    updated_at = clock_timestamp()
WHERE tenant_id = 1001
  AND case_number = 'CASE-2026-0001'
  AND version = 0
RETURNING case_number, title, version;
```

Expected:

```text id="zvx1zq"
1 row, version menjadi 1.
```

### Step 3 - Optimistic update kedua dengan stale version

```sql id="6z8snc"
UPDATE regulatory_case
SET title = 'Updated by user B',
    version = version + 1,
    updated_at = clock_timestamp()
WHERE tenant_id = 1001
  AND case_number = 'CASE-2026-0001'
  AND version = 0
RETURNING case_number, title, version;
```

Expected:

```text id="h2urq9"
0 row.
Aplikasi map ke 409 Conflict.
```

### Step 4 - Pessimistic lock

Session A:

```sql id="t9w4mi"
BEGIN;

SELECT *
FROM regulatory_case
WHERE tenant_id = 1001
  AND case_number = 'CASE-2026-0001'
FOR UPDATE;

-- jangan commit dulu
```

Session B:

```sql id="76xvzz"
SET lock_timeout = '1s';

UPDATE regulatory_case
SET title = 'Blocked update'
WHERE tenant_id = 1001
  AND case_number = 'CASE-2026-0001';
```

Expected:

```text id="s8aghg"
Session B gagal karena lock_timeout.
SQLSTATE biasanya 55P03 lock_not_available.
```

---

## 23. Ringkasan Praktis

```text id="85y24j"
1. Optimistic concurrency cocok untuk conflict jarang dan user edit flow.
2. Pessimistic concurrency cocok untuk claim/reservation/final decision.
3. Atomic UPDATE dengan expected state sering lebih baik dari SELECT FOR UPDATE.
4. FOR UPDATE dipakai saat harus baca state lalu mutate dengan aman.
5. NOWAIT/lock_timeout cocok untuk fail-fast user command.
6. SKIP LOCKED cocok untuk worker queue, bukan general list.
7. Advisory transaction lock cocok untuk resource non-row.
8. Retry hanya untuk error transient seperti 40001 dan 40P01.
9. Retry harus mengulang seluruh transaction boundary.
10. Semua external side effect harus setelah commit atau lewat outbox.
11. API harus map conflict berdasarkan 0-row result, SQLSTATE, dan constraint name.
```

---

# Status Seri

**Seri 8/22 selesai.**

Rekomendasi lanjut ke:

**Seri 9 - Indexing for PostgreSQL OLTP: B-tree, Composite, Partial, Covering/INCLUDE, Expression Index, GIN/BRIN, index-only scan, selectivity, dan practical index review untuk Java/MyBatis query pattern.**

---

**Sources:**

- [Documentation: 18: 13.3. Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html?utm_source=chatgpt.com)
- [Java API - MyBatis 3](https://mybatis.org/mybatis-3/java-api.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:17:40 PM

Saya lanjut ke **Seri 9/22**. Fokusnya indexing OLTP secara praktis: bukan daftar tipe index saja, tapi bagaimana memilih index dari query shape, membaca risiko write overhead, dan review index untuk mapper MyBatis.

# PostgreSQL OLTP - Seri 9/22  
## Indexing for OLTP: B-tree, Composite, Partial, Covering/INCLUDE, Expression Index, GIN/BRIN, Index-Only Scan, Selectivity, dan Practical Index Review untuk Java/MyBatis Query Pattern

Seri ini fokus ke **indexing yang praktis untuk OLTP**, bukan sekadar daftar tipe index. Di production, index yang bagus harus menjawab:

```text id="afo0vk"
1. query apa yang dilayani?
2. predicate mana yang paling selektif?
3. apakah ORDER BY ikut terbantu?
4. apakah LIMIT bisa berhenti cepat?
5. apakah write overhead masih masuk akal?
6. apakah index ini benar-benar dipakai?
7. apakah index ini aman dibuat di table besar?
```

PostgreSQL menyediakan beberapa tipe index seperti **B-tree, Hash, GiST, SP-GiST, GIN, BRIN**, dan extension bloom; default `CREATE INDEX` adalah B-tree, yang cocok untuk kebanyakan query equality/range OLTP. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-types.html?utm_source=chatgpt.com))

---

## 1. Mental Model Indexing OLTP

```text id="upjz4f"
Index Design
│
├─ Query shape
│  ├─ WHERE
│  ├─ JOIN
│  ├─ ORDER BY
│  ├─ LIMIT
│  └─ RETURNING / projection
│
├─ Data distribution
│  ├─ cardinality
│  ├─ selectivity
│  ├─ skew
│  ├─ active vs historical rows
│  └─ tenant distribution
│
├─ Index type
│  ├─ B-tree
│  ├─ GIN
│  ├─ GiST / SP-GiST
│  ├─ BRIN
│  └─ Hash, rarely needed
│
├─ Index shape
│  ├─ single-column
│  ├─ composite
│  ├─ partial
│  ├─ covering / INCLUDE
│  ├─ expression
│  └─ unique
│
├─ Operational cost
│  ├─ insert/update/delete overhead
│  ├─ index bloat
│  ├─ vacuum pressure
│  ├─ disk size
│  └─ migration/build impact
│
└─ Review loop
   ├─ EXPLAIN
   ├─ pg_stat_statements
   ├─ pg_stat_user_indexes
   ├─ slow query log
   └─ remove duplicate/unused indexes carefully
```

Rule utama:

```text id="9cnmma"
Index bukan dekorasi schema.
Index adalah kontrak antara query shape dan data distribution.
```

PostgreSQL sendiri menekankan bahwa index mempercepat pencarian row, tetapi menambah overhead ke sistem secara keseluruhan, sehingga harus dipakai secara masuk akal. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes.html?utm_source=chatgpt.com))

---

## 2. Practical Index Decision Table

| Query pattern | Index shape umum | Contoh |
|---|---|---|
| Detail by ID | PK / unique B-tree | `(tenant_id, case_id)` |
| Lookup by business number | Unique B-tree | `(tenant_id, case_number)` |
| Worklist by status | Composite partial B-tree | `(tenant_id, status, created_at DESC)` where active |
| Keyset pagination | Composite B-tree sesuai order | `(tenant_id, created_at DESC, case_id DESC)` |
| One active child | Partial unique index | `(tenant_id, case_id) WHERE released_at IS NULL` |
| Case-insensitive lookup | Expression index | `lower(email)` |
| JSONB containment | GIN | `USING gin(metadata)` |
| Append-heavy time table | BRIN | `created_at` / `occurred_at` |
| Text search | GIN/GiST tsvector | Dibahas lebih cocok di seri full-text |
| Range overlap | GiST exclusion/index | `tstzrange`, `daterange` |
| Covering list projection | B-tree + `INCLUDE` | key columns + payload columns |

---

## 3. B-tree: Default Workhorse OLTP

B-tree cocok untuk query equality dan range pada data yang bisa diurutkan; planner PostgreSQL mempertimbangkan B-tree untuk operator seperti `<`, `<=`, `=`, `>=`, dan `>`. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-types.html?utm_source=chatgpt.com))

Contoh table:

```sql id="u3u4ea"
CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL,
    status       text NOT NULL,
    title        text NOT NULL,
    priority     text NOT NULL DEFAULT 'NORMAL',
    version      bigint NOT NULL DEFAULT 0,
    created_at   timestamptz NOT NULL DEFAULT clock_timestamp(),
    updated_at   timestamptz NOT NULL DEFAULT clock_timestamp(),
    deleted_at   timestamptz,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number)
);
```

Index dari PK/unique sudah otomatis membantu:

```text id="t0co03"
PRIMARY KEY (tenant_id, case_id)
UNIQUE (tenant_id, case_number)
```

Query:

```sql id="9p4pw1"
SELECT *
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND case_id = :caseId;
```

Query business number:

```sql id="fetvw7"
SELECT *
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND case_number = :caseNumber;
```

Rule praktis:

```text id="p31qbx"
Untuk OLTP normal, mulai dari B-tree.
Baru pilih GIN/GiST/BRIN kalau query operator/data pattern memang membutuhkan.
```

---

## 4. Composite Index: Urutan Kolom Itu Penting

PostgreSQL menjelaskan bahwa multicolumn B-tree paling efektif ketika constraint ada pada kolom leading atau leftmost; equality pada leading columns plus inequality pada kolom pertama setelah equality dapat membatasi bagian index yang discan. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-multicolumn.html?utm_source=chatgpt.com))

Contoh worklist:

```sql id="c1uulo"
SELECT
    case_id,
    case_number,
    title,
    priority,
    created_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY created_at ASC, case_id ASC
LIMIT :limit;
```

Index:

```sql id="s26ve7"
CREATE INDEX idx_regulatory_case__tenant_status_created
ON regulatory_case (
    tenant_id,
    status,
    created_at ASC,
    case_id ASC
)
WHERE deleted_at IS NULL;
```

Kenapa urutannya begitu?

```text id="l4umhm"
tenant_id  → selalu difilter, boundary utama
status     → filter worklist
created_at → ORDER BY
case_id    → tie-breaker deterministic
```

Kalau index-nya begini:

```sql id="g7ob88"
CREATE INDEX idx_bad_case_created_status
ON regulatory_case (created_at, status, tenant_id);
```

Query `WHERE tenant_id=? AND status=? ORDER BY created_at` kemungkinan kurang optimal karena leading column `created_at` bukan filter equality utama.

Rule praktis:

```text id="rxvcc7"
Composite B-tree:
1. equality filter yang selalu ada di depan
2. range/sort column setelahnya
3. tie-breaker terakhir
4. jangan asal masukkan semua kolom
```

Dokumentasi PostgreSQL juga mengingatkan multicolumn indexes sebaiknya dipakai hemat; index lebih dari tiga kolom jarang berguna kecuali pola penggunaan tabel sangat terstruktur. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-multicolumn.html?utm_source=chatgpt.com))

---

## 5. Composite Index untuk Keyset Pagination

Query:

```sql id="s6sg04"
SELECT
    case_id,
    case_number,
    status,
    title,
    created_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND deleted_at IS NULL
  AND (
      :lastCreatedAt IS NULL
      OR (created_at, case_id) < (:lastCreatedAt, :lastCaseId)
  )
ORDER BY created_at DESC, case_id DESC
LIMIT :limit;
```

Index:

```sql id="iqx470"
CREATE INDEX idx_regulatory_case__tenant_created_case
ON regulatory_case (
    tenant_id,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

B-tree index dapat dipakai untuk `ORDER BY`; PostgreSQL bisa melakukan scan index maju atau mundur, dan ordering index dapat dikontrol dengan `ASC`, `DESC`, `NULLS FIRST`, atau `NULLS LAST`. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-ordering.html?utm_source=chatgpt.com))

Rule:

```text id="tdm2a0"
Keyset pagination index harus match:
WHERE tenant_id
ORDER BY created_at, case_id
cursor predicate created_at, case_id
```

---

## 6. Partial Index: Index Hanya Row yang Relevan

Partial index adalah index yang dibangun hanya atas subset row; subset tersebut ditentukan oleh predicate index. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-partial.html?utm_source=chatgpt.com))

Ini sangat penting untuk OLTP karena banyak tabel punya data historis, deleted, closed, published, atau archived yang tidak sering diakses.

Contoh active case:

```sql id="wmpsnz"
CREATE INDEX idx_regulatory_case__active_status_created
ON regulatory_case (
    tenant_id,
    status,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

Query harus sesuai predicate:

```sql id="rzoivc"
SELECT
    case_id,
    case_number,
    status,
    created_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY created_at DESC, case_id DESC
LIMIT :limit;
```

Jika query lupa:

```sql id="vvgues"
WHERE tenant_id = :tenantId
  AND status = 'SUBMITTED'
```

Index partial `WHERE deleted_at IS NULL` mungkin tidak bisa dipakai seperti yang diharapkan, karena query tidak membuktikan predicate tersebut.

Practical use case:

| Partial predicate | Cocok untuk |
|---|---|
| `WHERE deleted_at IS NULL` | active row |
| `WHERE status = 'READY'` | queue ready jobs |
| `WHERE status IN ('SUBMITTED','UNDER_REVIEW')` | active workflow |
| `WHERE released_at IS NULL` | active assignment |
| `WHERE published_at IS NULL` | outbox pending |
| `WHERE processed_at IS NULL` | inbox/CDC pending |

---

## 7. Partial Unique Index untuk Invariant Aktif

Constraint bisnis: satu case hanya boleh punya satu assignment aktif.

```sql id="hghk38"
CREATE TABLE case_assignment (
    tenant_id      bigint NOT NULL,
    case_id        uuid NOT NULL,
    assignment_id  uuid NOT NULL DEFAULT uuidv7(),
    officer_id     text NOT NULL,
    assigned_at    timestamptz NOT NULL DEFAULT clock_timestamp(),
    released_at    timestamptz,

    CONSTRAINT pk_case_assignment
        PRIMARY KEY (tenant_id, case_id, assignment_id)
);

CREATE UNIQUE INDEX uq_case_assignment__one_active
ON case_assignment (tenant_id, case_id)
WHERE released_at IS NULL;
```

Insert:

```sql id="wwq3h7"
INSERT INTO case_assignment (
    tenant_id,
    case_id,
    officer_id
)
VALUES (
    :tenantId,
    :caseId,
    :officerId
);
```

Jika sudah ada active assignment:

```text id="i178cz"
SQLSTATE 23505 unique_violation
constraint/index name uq_case_assignment__one_active
→ map ke 409 Conflict
```

Rule:

```text id="tdg07t"
Partial unique index sangat cocok untuk:
one active assignment
one open workflow
one pending approval
one current version
```

---

## 8. Covering Index dan `INCLUDE`

PostgreSQL mendukung covering index melalui `INCLUDE`, yaitu kolom payload non-key yang disimpan di index agar query tertentu bisa dilayani lebih dekat dari index. Dokumentasi menyebut index-only scan bisa terjadi jika index menyimpan semua data yang dibutuhkan query dan visibility map menunjukkan heap page terkait sudah all-visible; B-tree selalu mendukung index-only scan. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-index-only-scans.html?utm_source=chatgpt.com))

Query worklist:

```sql id="8fuw94"
SELECT
    case_id,
    case_number,
    title,
    priority,
    created_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY created_at ASC, case_id ASC
LIMIT :limit;
```

Covering index:

```sql id="wxko0a"
CREATE INDEX idx_regulatory_case__submitted_worklist_covering
ON regulatory_case (
    tenant_id,
    status,
    created_at ASC,
    case_id ASC
)
INCLUDE (
    case_number,
    title,
    priority
)
WHERE deleted_at IS NULL;
```

Kapan cocok:

```text id="offohf"
1. query list sangat sering
2. kolom projection kecil
3. table besar
4. update pada included columns tidak terlalu sering
5. latency target ketat
```

Kapan tidak cocok:

```text id="xmoftf"
1. included columns besar seperti jsonb/description panjang
2. kolom sering di-update
3. query jarang dipakai
4. index size sudah besar
```

Catatan penting: index-only scan bukan jaminan hanya karena memakai `INCLUDE`; visibility map dan kondisi vacuum juga memengaruhi apakah heap fetch masih diperlukan. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-index-only-scans.html?utm_source=chatgpt.com))

---

## 9. Expression Index

Expression index berguna saat query memakai expression yang sama berulang-ulang.

Contoh case-insensitive email:

```sql id="kmxcvg"
CREATE TABLE user_account (
    tenant_id  bigint NOT NULL,
    user_id    uuid NOT NULL DEFAULT uuidv7(),
    email      text NOT NULL,
    full_name  text NOT NULL,

    CONSTRAINT pk_user_account
        PRIMARY KEY (tenant_id, user_id)
);
```

Index:

```sql id="wk2miz"
CREATE UNIQUE INDEX uq_user_account__tenant_lower_email
ON user_account (tenant_id, lower(email));
```

Query:

```sql id="htz0yk"
SELECT
    user_id,
    email,
    full_name
FROM user_account
WHERE tenant_id = :tenantId
  AND lower(email) = lower(:email);
```

Contoh normalized business number:

```sql id="jjm6mv"
CREATE INDEX idx_regulatory_case__normalized_case_number
ON regulatory_case (
    tenant_id,
    lower(trim(case_number))
);
```

Rule:

```text id="9xsfrw"
Expression di query harus match expression di index.
Kalau query memakai lower(email), index plain email tidak cukup.
```

---

## 10. Generated Column + Index sebagai Alternatif Expression Index

Untuk expression yang penting secara domain, generated column bisa membuat intent lebih eksplisit.

```sql id="2brstm"
CREATE TABLE user_account (
    tenant_id        bigint NOT NULL,
    user_id          uuid NOT NULL DEFAULT uuidv7(),
    email            text NOT NULL,
    normalized_email text GENERATED ALWAYS AS (lower(trim(email))) STORED,

    CONSTRAINT pk_user_account
        PRIMARY KEY (tenant_id, user_id),

    CONSTRAINT uq_user_account__normalized_email
        UNIQUE (tenant_id, normalized_email)
);
```

Kelebihan:

```text id="ykizv2"
1. query lebih mudah dibaca
2. mapper tidak perlu menulis expression berulang
3. constraint bisa memakai kolom eksplisit
4. bagus untuk normalized key domain
```

Kekurangan:

```text id="1jzdcp"
1. schema lebih banyak kolom
2. expression harus immutable/stabil
3. perubahan logic normalisasi perlu migration
```

---

## 11. GIN Index untuk `jsonb`, Array, dan Full-Text

GIN cocok untuk struktur yang menghasilkan banyak key per item, misalnya array atau `jsonb`; dokumentasi PostgreSQL menjelaskan GIN index menyimpan key yang berasal dari indexed item, seperti elemen array. ([PostgreSQL](https://www.postgresql.org/docs/current/gin.html?utm_source=chatgpt.com))

Contoh metadata JSONB:

```sql id="eczdi1"
CREATE TABLE case_audit_log (
    tenant_id   bigint NOT NULL,
    audit_id    bigint GENERATED ALWAYS AS IDENTITY,
    case_id     uuid NOT NULL,
    event_type  text NOT NULL,
    metadata    jsonb NOT NULL DEFAULT '{}'::jsonb,
    occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_case_audit_log
        PRIMARY KEY (tenant_id, audit_id)
);
```

GIN index:

```sql id="1rpj9e"
CREATE INDEX idx_case_audit_log__metadata_gin
ON case_audit_log
USING gin (metadata);
```

Query containment:

```sql id="j8z6hk"
SELECT
    audit_id,
    event_type,
    occurred_at
FROM case_audit_log
WHERE tenant_id = :tenantId
  AND metadata @> '{"riskLevel": "HIGH"}'::jsonb;
```

Namun untuk lookup equality field tertentu yang sering dipakai, expression B-tree bisa lebih kecil dan spesifik:

```sql id="rv7css"
CREATE INDEX idx_case_audit_log__correlation_id
ON case_audit_log (
    tenant_id,
    (metadata ->> 'correlationId')
);
```

Query:

```sql id="za9vhi"
SELECT
    audit_id,
    event_type,
    occurred_at
FROM case_audit_log
WHERE tenant_id = :tenantId
  AND metadata ->> 'correlationId' = :correlationId;
```

Decision:

```text id="a4jpzz"
jsonb containment banyak key/flexible → GIN
jsonb satu field sering equality lookup → expression B-tree
core field sering difilter → jadikan column biasa
```

---

## 12. BRIN Index untuk Append-Heavy Table

BRIN cocok untuk tabel besar yang datanya punya korelasi dengan physical order, misalnya log/audit/event berdasarkan waktu. PostgreSQL memasukkan BRIN sebagai salah satu index type built-in. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-types.html?utm_source=chatgpt.com))

Contoh audit log sangat besar:

```sql id="a041fk"
CREATE TABLE case_audit_log (
    tenant_id    bigint NOT NULL,
    audit_id     bigint GENERATED ALWAYS AS IDENTITY,
    case_id      uuid NOT NULL,
    event_type   text NOT NULL,
    occurred_at  timestamptz NOT NULL DEFAULT clock_timestamp(),
    payload      jsonb NOT NULL,

    CONSTRAINT pk_case_audit_log
        PRIMARY KEY (tenant_id, audit_id)
);
```

BRIN:

```sql id="7s7col"
CREATE INDEX idx_case_audit_log__occurred_brin
ON case_audit_log
USING brin (occurred_at);
```

Query:

```sql id="7hmt95"
SELECT
    audit_id,
    case_id,
    event_type,
    occurred_at
FROM case_audit_log
WHERE occurred_at >= :from
  AND occurred_at < :to
ORDER BY occurred_at;
```

Kapan cocok:

```text id="y61gvq"
1. table sangat besar
2. append-mostly
3. filter berdasarkan time range
4. physical order berkorelasi dengan timestamp
5. index kecil lebih penting daripada lookup sangat presisi
```

Kapan tidak cocok:

```text id="bsk4ho"
1. point lookup by id
2. data tidak berurutan
3. update acak tinggi
4. range kecil butuh presisi tinggi
```

---

## 13. Hash Index: Jarang Jadi Pilihan Utama

PostgreSQL punya hash index, tetapi untuk OLTP biasa B-tree equality sudah cukup dan lebih fleksibel karena juga mendukung ordering/range. Jadi hash index jarang menjadi default pilihan.

```sql id="42cxgk"
CREATE INDEX idx_example_hash
ON some_table
USING hash (some_column);
```

Rule:

```text id="h7twgm"
Default-kan B-tree untuk equality lookup.
Pertimbangkan hash hanya jika sudah terbukti ada alasan spesifik lewat benchmark.
```

---

## 14. Index untuk Foreign Key

PostgreSQL tidak otomatis membuat index pada child-side foreign key. Untuk OLTP, child FK sering perlu index agar delete/update parent dan join child lookup tidak mahal.

Parent:

```sql id="pymk1h"
CREATE TABLE regulatory_case (
    tenant_id bigint NOT NULL,
    case_id uuid NOT NULL,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id)
);
```

Child:

```sql id="2zedq3"
CREATE TABLE case_party (
    tenant_id bigint NOT NULL,
    case_id uuid NOT NULL,
    party_id uuid NOT NULL,

    CONSTRAINT pk_case_party
        PRIMARY KEY (tenant_id, case_id, party_id),

    CONSTRAINT fk_case_party__case
        FOREIGN KEY (tenant_id, case_id)
        REFERENCES regulatory_case (tenant_id, case_id)
);
```

PK child `(tenant_id, case_id, party_id)` sudah membantu lookup by case:

```sql id="jt77j9"
SELECT *
FROM case_party
WHERE tenant_id = :tenantId
  AND case_id = :caseId;
```

Tapi jika child PK bukan diawali FK, tambahkan index:

```sql id="upxf8h"
CREATE INDEX idx_case_party__case_fk
ON case_party (tenant_id, case_id);
```

Rule:

```text id="rwabn5"
Setiap FK yang sering dipakai untuk join/delete/update parent harus punya index efektif di child side.
```

---

## 15. Index untuk Queue Table

Queue OLTP sering salah index.

Schema:

```sql id="bxk8zu"
CREATE TABLE workflow_job (
    tenant_id      bigint NOT NULL,
    job_id         bigint GENERATED ALWAYS AS IDENTITY,
    job_type       text NOT NULL,
    status         text NOT NULL,
    available_at   timestamptz NOT NULL DEFAULT clock_timestamp(),
    locked_by      text,
    locked_at      timestamptz,
    attempt_count  integer NOT NULL DEFAULT 0,
    payload        jsonb NOT NULL,

    CONSTRAINT pk_workflow_job
        PRIMARY KEY (tenant_id, job_id)
);
```

Claim query:

```sql id="gi7k3k"
WITH candidate AS (
    SELECT tenant_id, job_id
    FROM workflow_job
    WHERE tenant_id = :tenantId
      AND status = 'READY'
      AND available_at <= clock_timestamp()
    ORDER BY available_at ASC, job_id ASC
    LIMIT :batchSize
    FOR UPDATE SKIP LOCKED
)
UPDATE workflow_job j
SET status = 'PROCESSING',
    locked_by = :workerId,
    locked_at = clock_timestamp(),
    attempt_count = attempt_count + 1
FROM candidate c
WHERE j.tenant_id = c.tenant_id
  AND j.job_id = c.job_id
RETURNING j.*;
```

Index:

```sql id="6xodqr"
CREATE INDEX idx_workflow_job__ready_claim
ON workflow_job (
    tenant_id,
    available_at ASC,
    job_id ASC
)
WHERE status = 'READY';
```

Kenapa bukan `(tenant_id, status, available_at)`?

Karena partial predicate sudah membatasi `status = 'READY'`, jadi `status` tidak perlu lagi menjadi key column.

Rule:

```text id="280d0v"
Jika status sudah fixed di partial predicate,
jangan ulang status sebagai leading index column kecuali ada alasan lain.
```

---

## 16. Index untuk Outbox Pattern

Outbox worker biasanya mencari event baru.

```sql id="x2k90n"
CREATE TABLE outbox_event (
    tenant_id      bigint NOT NULL,
    outbox_id      uuid NOT NULL DEFAULT uuidv7(),
    aggregate_type text NOT NULL,
    aggregate_id   uuid NOT NULL,
    event_type     text NOT NULL,
    payload        jsonb NOT NULL,
    status         text NOT NULL DEFAULT 'NEW',
    created_at     timestamptz NOT NULL DEFAULT clock_timestamp(),
    published_at   timestamptz,
    attempt_count  integer NOT NULL DEFAULT 0,

    CONSTRAINT pk_outbox_event
        PRIMARY KEY (tenant_id, outbox_id)
);
```

Worker claim:

```sql id="dymgrh"
SELECT
    tenant_id,
    outbox_id,
    event_type,
    payload
FROM outbox_event
WHERE tenant_id = :tenantId
  AND status = 'NEW'
ORDER BY created_at ASC, outbox_id ASC
LIMIT :limit
FOR UPDATE SKIP LOCKED;
```

Index:

```sql id="af92jg"
CREATE INDEX idx_outbox_event__new_publish_order
ON outbox_event (
    tenant_id,
    created_at ASC,
    outbox_id ASC
)
WHERE status = 'NEW';
```

Monitoring failed:

```sql id="ruwf8x"
CREATE INDEX idx_outbox_event__failed
ON outbox_event (
    tenant_id,
    created_at DESC
)
WHERE status = 'FAILED';
```

---

## 17. Index-Only Scan: Jangan Salah Paham

Index-only scan hanya mungkin jika index menyimpan semua kolom yang dibutuhkan query dan visibility map memungkinkan PostgreSQL memastikan row terlihat tanpa mengunjungi heap. B-tree index selalu mendukung index-only scan, tetapi visibility map tetap menentukan apakah heap fetch bisa dihindari. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-index-only-scans.html?utm_source=chatgpt.com))

Contoh:

```sql id="6ih63y"
SELECT
    case_id,
    case_number,
    title
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 20;
```

Index:

```sql id="lrls13"
CREATE INDEX idx_case_worklist_cover
ON regulatory_case (
    tenant_id,
    status,
    created_at DESC,
    case_id DESC
)
INCLUDE (
    case_number,
    title
)
WHERE deleted_at IS NULL;
```

Tetap cek:

```sql id="uzjxc7"
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    case_id,
    case_number,
    title
FROM regulatory_case
WHERE tenant_id = 1001
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 20;
```

Yang perlu dilihat:

```text id="cwfw7n"
Index Only Scan?
Heap Fetches rendah?
Buffers read/hit masuk akal?
Rows removed by filter sedikit?
```

---

## 18. Selectivity dan Cardinality

Index paling berguna ketika predicate cukup selektif.

Contoh buruk:

```sql id="mj0hih"
CREATE INDEX idx_case_status
ON regulatory_case (status);
```

Jika 80% row status = `CLOSED`, index `status` saja mungkin kurang berguna untuk:

```sql id="4mp1pf"
WHERE status = 'CLOSED'
```

Lebih baik untuk query tenant worklist:

```sql id="lt0yxb"
CREATE INDEX idx_case_tenant_status_created
ON regulatory_case (
    tenant_id,
    status,
    created_at DESC
)
WHERE deleted_at IS NULL;
```

Rule:

```text id="h3pc5r"
Low-cardinality column seperti status/boolean jarang bagus sendirian.
Gabungkan dengan tenant_id, time/order, atau jadikan partial index.
```

---

## 19. Index dan Write Overhead

Setiap index harus ikut diperbarui saat insert/update/delete. Karena itu:

```text id="h7j60a"
lebih banyak index = write lebih mahal
lebih banyak index = vacuum lebih berat
lebih banyak index = storage lebih besar
lebih banyak index = migration lebih lama
lebih banyak index = bloat surface lebih luas
```

Contoh anti-pattern:

```sql id="cxyc0p"
CREATE INDEX idx_case_tenant ON regulatory_case (tenant_id);
CREATE INDEX idx_case_status ON regulatory_case (status);
CREATE INDEX idx_case_created ON regulatory_case (created_at);
CREATE INDEX idx_case_tenant_status ON regulatory_case (tenant_id, status);
CREATE INDEX idx_case_tenant_status_created ON regulatory_case (tenant_id, status, created_at);
```

Mungkin yang cukup:

```sql id="vrh5mq"
CREATE INDEX idx_case_tenant_status_created
ON regulatory_case (tenant_id, status, created_at DESC)
WHERE deleted_at IS NULL;
```

Rule:

```text id="c0br0n"
Jangan index semua kolom.
Index query shape utama.
```

---

## 20. Duplicate dan Redundant Index

Contoh:

```sql id="5ao3mj"
CREATE INDEX idx_a ON regulatory_case (tenant_id);
CREATE INDEX idx_b ON regulatory_case (tenant_id, status);
CREATE INDEX idx_c ON regulatory_case (tenant_id, status, created_at DESC);
```

`idx_a` atau `idx_b` mungkin masih berguna untuk query tertentu, tapi bisa juga redundant jika semua query utama memakai `idx_c`.

Review dengan:

```sql id="gduuzf"
SELECT
    schemaname,
    relname AS table_name,
    indexrelname AS index_name,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC, indexrelname;
```

Jangan langsung drop index hanya karena `idx_scan = 0`; bisa saja index dipakai untuk constraint, query bulanan, batch job, atau belum lama stats reset.

---

## 21. EXPLAIN untuk Validasi Index

PostgreSQL menggunakan planner untuk memilih query plan, dan `EXPLAIN` memperlihatkan plan yang dipilih. Dokumentasi resmi menekankan bahwa pemilihan plan yang cocok terhadap struktur query dan sifat data sangat penting untuk performa. ([PostgreSQL](https://www.postgresql.org/docs/current/using-explain.html?utm_source=chatgpt.com))

Basic:

```sql id="74e3ii"
EXPLAIN
SELECT
    case_id,
    case_number,
    title
FROM regulatory_case
WHERE tenant_id = 1001
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY created_at DESC, case_id DESC
LIMIT 20;
```

Production-style diagnostic:

```sql id="c8rt3k"
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    case_id,
    case_number,
    title
FROM regulatory_case
WHERE tenant_id = 1001
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY created_at DESC, case_id DESC
LIMIT 20;
```

Perhatikan:

| Signal | Artinya |
|---|---|
| `Seq Scan` | Bisa normal untuk table kecil; buruk untuk table besar dengan selective predicate |
| `Index Scan` | Index dipakai, masih fetch heap |
| `Index Only Scan` | Index mencakup data, heap fetch mungkin rendah |
| `Bitmap Heap Scan` | Beberapa kondisi/index digabung atau banyak row |
| `Rows Removed by Filter` tinggi | Index kurang tepat atau predicate tidak masuk index |
| `Sort` mahal | Index belum membantu ORDER BY |
| `Buffers read` tinggi | Banyak disk read |
| actual rows jauh dari estimate | Statistik/selectivity bermasalah |

---

## 22. Create Index di Table Besar

Untuk production table besar, hindari build index biasa yang mengunci write terlalu lama. PostgreSQL `CREATE INDEX` mendukung opsi `CONCURRENTLY`, yang dibuat untuk mengurangi blocking write, meskipun prosesnya lebih lama dan ada batasan tertentu. Dokumentasi `CREATE INDEX` juga menyebut detail index method, multicolumn, dan `INCLUDE`. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createindex.html?utm_source=chatgpt.com))

Contoh:

```sql id="lmlgxr"
CREATE INDEX CONCURRENTLY idx_regulatory_case__tenant_status_created
ON regulatory_case (
    tenant_id,
    status,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

Practical rule migration:

```text id="7rlz77"
Development/small table   → CREATE INDEX biasa OK.
Production large table    → CREATE INDEX CONCURRENTLY.
Unique constraint rollout → sering perlu create unique index concurrently lalu attach/validate sesuai strategi migration.
```

Catatan: detail locking dan strategi rollout low-downtime akan dibahas lebih dalam di seri schema migration safety.

---

## 23. MyBatis Query Shape dan Index Review

Mapper query:

```xml id="aqanjy"
<select id="findSubmittedCases" resultMap="CaseListItemMap">
  SELECT
      case_id,
      case_number,
      title,
      priority,
      created_at
  FROM regulatory_case
  WHERE tenant_id = #{tenantId}
    AND status = 'SUBMITTED'
    AND deleted_at IS NULL
  ORDER BY created_at DESC, case_id DESC
  LIMIT #{limit}
</select>
```

Index review:

```sql id="ko4wsa"
CREATE INDEX idx_regulatory_case__submitted_list
ON regulatory_case (
    tenant_id,
    created_at DESC,
    case_id DESC
)
INCLUDE (
    case_number,
    title,
    priority
)
WHERE status = 'SUBMITTED'
  AND deleted_at IS NULL;
```

Kenapa status tidak di key?

```text id="n3rgzp"
Karena status sudah fixed di partial predicate.
Index hanya berisi SUBMITTED active rows.
```

Kalau query status dynamic:

```xml id="f2gg3s"
<select id="findCasesByStatus" resultMap="CaseListItemMap">
  SELECT
      case_id,
      case_number,
      title,
      priority,
      created_at
  FROM regulatory_case
  WHERE tenant_id = #{tenantId}
    AND status = #{status}
    AND deleted_at IS NULL
  ORDER BY created_at DESC, case_id DESC
  LIMIT #{limit}
</select>
```

Index lebih cocok:

```sql id="n519rn"
CREATE INDEX idx_regulatory_case__status_list
ON regulatory_case (
    tenant_id,
    status,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

Rule:

```text id="gmb65a"
Jika value predicate fixed dan high-volume → partial index.
Jika value predicate dynamic → composite index dengan kolom itu.
```

---

## 24. Dynamic Search: Jangan Berharap Satu Index Menangani Semua

Mapper dynamic:

```xml id="2qsgn0"
<select id="searchCases" resultMap="CaseListItemMap">
  SELECT
      case_id,
      case_number,
      status,
      title,
      priority,
      created_at
  FROM regulatory_case
  <where>
    tenant_id = #{tenantId}
    AND deleted_at IS NULL

    <if test="status != null">
      AND status = #{status}
    </if>

    <if test="priority != null">
      AND priority = #{priority}
    </if>

    <if test="createdFrom != null">
      AND created_at &gt;= #{createdFrom}
    </if>

    <if test="createdTo != null">
      AND created_at &lt; #{createdTo}
    </if>
  </where>
  ORDER BY created_at DESC, case_id DESC
  LIMIT #{limit}
</select>
```

Candidate indexes:

```sql id="qo95qg"
CREATE INDEX idx_case_search__status_created
ON regulatory_case (
    tenant_id,
    status,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;

CREATE INDEX idx_case_search__priority_created
ON regulatory_case (
    tenant_id,
    priority,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;

CREATE INDEX idx_case_search__created
ON regulatory_case (
    tenant_id,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

Tapi jangan langsung buat semua. Gunakan data:

```text id="t1706k"
1. filter mana paling sering?
2. filter mana paling selective?
3. query mana latency-sensitive?
4. berapa write overhead tambahan?
5. apakah bisa batasi fitur search?
```

---

## 25. Index Naming Convention

Format yang readable:

```text id="g4ufbx"
idx_<table>__<purpose>
uq_<table>__<business_rule>
pk_<table>
ex_<table>__<business_rule>
```

Contoh:

```sql id="hba1d0"
CREATE INDEX idx_regulatory_case__active_worklist
ON regulatory_case (tenant_id, status, created_at DESC, case_id DESC)
WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX uq_case_assignment__one_active
ON case_assignment (tenant_id, case_id)
WHERE released_at IS NULL;

CREATE INDEX idx_outbox_event__new_publish_order
ON outbox_event (tenant_id, created_at ASC, outbox_id ASC)
WHERE status = 'NEW';
```

Manfaat:

```text id="6qwli4"
1. EXPLAIN mudah dibaca
2. error mapping constraint/index lebih jelas
3. migration review lebih mudah
4. incident response lebih cepat
```

---

## 26. Practical Index Patterns by Table Type

| Table type | Index utama | Index tambahan umum |
|---|---|---|
| Aggregate root | PK `(tenant_id, id)` | business key, status list, created pagination |
| Child table | PK `(tenant_id, parent_id, child_id)` | lookup by child id jika perlu |
| Audit/history | PK / BRIN time | `(tenant_id, case_id, audit_id)` |
| Queue | ready partial index | stuck processing index |
| Outbox | new partial index | failed partial index |
| Idempotency | PK `(tenant_id, key, command)` | cleanup by created_at |
| External mapping | unique external key | aggregate reverse lookup |
| Reference table | PK code | active/sort order if needed |
| Assignment | active unique partial | officer workload index |
| Document metadata | PK document id | case lookup, hash lookup |

---

## 27. Anti-Pattern

### Anti-pattern 1 - Index hanya karena kolom ada di WHERE

Buruk:

```sql id="cn0t2g"
CREATE INDEX idx_status ON regulatory_case (status);
```

Kalau query sebenarnya:

```sql id="rv9m0f"
WHERE tenant_id = ?
  AND status = ?
  AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 20
```

Lebih baik:

```sql id="hm9yhe"
CREATE INDEX idx_case_worklist
ON regulatory_case (tenant_id, status, created_at DESC, case_id DESC)
WHERE deleted_at IS NULL;
```

---

### Anti-pattern 2 - Index terlalu banyak untuk satu table write-heavy

Masalah:

```text id="xkgxva"
INSERT lambat
UPDATE lambat
WAL besar
vacuum lebih berat
disk boros
migration lebih lambat
```

Solusi:

```text id="va2y7t"
Review query utama.
Gabungkan index redundant.
Drop unused index setelah observasi cukup.
```

---

### Anti-pattern 3 - Composite index salah urutan

Buruk:

```sql id="ef9ey9"
CREATE INDEX idx_case_bad
ON regulatory_case (created_at, tenant_id, status);
```

Untuk query:

```sql id="4zfzqq"
WHERE tenant_id = ?
  AND status = ?
ORDER BY created_at DESC
```

Lebih baik:

```sql id="thlrhz"
CREATE INDEX idx_case_good
ON regulatory_case (tenant_id, status, created_at DESC);
```

---

### Anti-pattern 4 - `LOWER(email)` query tanpa expression index

Buruk:

```sql id="4vtmth"
WHERE lower(email) = lower(:email)
```

Index biasa:

```sql id="t5s428"
CREATE INDEX idx_email ON user_account (email);
```

Tidak cukup optimal untuk expression tersebut.

Lebih baik:

```sql id="wojzcg"
CREATE INDEX idx_user_account__lower_email
ON user_account (tenant_id, lower(email));
```

---

### Anti-pattern 5 - GIN JSONB untuk semua masalah

Buruk:

```text id="qfrend"
Semua field domain dimasukkan ke jsonb.
Lalu semua query mengandalkan GIN.
```

Lebih baik:

```text id="srnp0a"
Core filter/join/sort field → column biasa + B-tree.
Flexible metadata/search containment → jsonb + GIN.
```

---

## 28. Production Checklist Index Review

| Checklist | Pertanyaan |
|---|---|
| Query shape jelas | Index dibuat untuk query apa? |
| WHERE cocok | Apakah leading columns match equality filter utama? |
| ORDER BY terbantu | Apakah index bisa menghindari sort mahal? |
| LIMIT berhenti cepat | Apakah index order mendukung early stop? |
| Partial predicate cocok | Apakah query selalu menyertakan predicate partial index? |
| Selectivity masuk akal | Apakah kolom low-cardinality tidak berdiri sendiri? |
| Write overhead diterima | Apakah table write-heavy masih aman? |
| Covering tidak berlebihan | Apakah `INCLUDE` hanya kolom kecil dan sering dibaca? |
| Expression match | Apakah query expression sama dengan index expression? |
| JSONB tepat | Apakah GIN hanya untuk metadata/containment yang memang perlu? |
| BRIN tepat | Apakah table append-heavy dan time-correlated? |
| FK child indexed | Apakah FK penting punya child-side index efektif? |
| Duplicate index dicek | Apakah ada redundant/overlapping index? |
| EXPLAIN divalidasi | Apakah index benar-benar dipakai pada data realistis? |
| Concurrent build | Apakah index besar dibuat dengan strategi low-downtime? |

---

## 29. Mini Lab

### Step 1 - Buat table

```sql id="ws7khc"
CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL,
    status       text NOT NULL,
    title        text NOT NULL,
    priority     text NOT NULL DEFAULT 'NORMAL',
    metadata     jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at   timestamptz NOT NULL DEFAULT clock_timestamp(),
    updated_at   timestamptz NOT NULL DEFAULT clock_timestamp(),
    deleted_at   timestamptz,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number)
);
```

### Step 2 - Buat index worklist

```sql id="bz0kbl"
CREATE INDEX idx_regulatory_case__active_worklist
ON regulatory_case (
    tenant_id,
    status,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

### Step 3 - Query worklist

```sql id="1czoq5"
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    case_id,
    case_number,
    title,
    priority,
    created_at
FROM regulatory_case
WHERE tenant_id = 1001
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY created_at DESC, case_id DESC
LIMIT 20;
```

Expected:

```text id="044bxi"
Planner idealnya memakai idx_regulatory_case__active_worklist,
terutama jika data cukup besar dan predicate selective.
```

### Step 4 - Buat expression index JSON field

```sql id="6k3kas"
CREATE INDEX idx_regulatory_case__risk_level
ON regulatory_case (
    tenant_id,
    (metadata ->> 'riskLevel')
)
WHERE deleted_at IS NULL;
```

Query:

```sql id="c2q2as"
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    case_id,
    case_number,
    metadata ->> 'riskLevel' AS risk_level
FROM regulatory_case
WHERE tenant_id = 1001
  AND metadata ->> 'riskLevel' = 'HIGH'
  AND deleted_at IS NULL;
```

### Step 5 - Compare dengan GIN

```sql id="bqf8oo"
CREATE INDEX idx_regulatory_case__metadata_gin
ON regulatory_case
USING gin (metadata);
```

Query containment:

```sql id="w6tcel"
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    case_id,
    case_number
FROM regulatory_case
WHERE metadata @> '{"riskLevel": "HIGH"}'::jsonb;
```

Tujuan lab:

```text id="rgd30m"
Bandingkan:
1. B-tree expression index untuk equality field tertentu
2. GIN index untuk JSONB containment
3. worklist composite index untuk WHERE + ORDER BY + LIMIT
```

---

## 30. Ringkasan Praktis

```text id="4k5ks4"
1. Index harus mengikuti query shape, bukan sekadar kolom.
2. B-tree adalah default utama untuk OLTP equality/range/order.
3. Composite B-tree paling efektif dengan leading equality columns.
4. Partial index sangat kuat untuk active/open/ready/new rows.
5. Covering index dengan INCLUDE bisa membantu read-heavy list, tapi menambah size/write cost.
6. Expression index cocok untuk lower(email), normalized key, dan jsonb field tertentu.
7. GIN cocok untuk jsonb/array/full-text containment-style query.
8. BRIN cocok untuk table besar append-heavy yang time-correlated.
9. Low-cardinality column seperti status jarang bagus sebagai index tunggal.
10. Jangan membuat terlalu banyak index di write-heavy table.
11. Validasi index dengan EXPLAIN, bukan asumsi.
12. Untuk table besar production, rencanakan CREATE INDEX CONCURRENTLY.
```

---

# Status Seri

**Seri 9/22 selesai.**

Rekomendasi lanjut ke:

**Seri 10 - Pagination, Sorting, Filtering, dan Search Screen Pattern untuk PostgreSQL OLTP: keyset pagination, dynamic filters, safe sorting di MyBatis, index strategy, dan UX/API contract untuk large transactional list.**

---

**Sources:**

- [PostgreSQL: Documentation: 18: 11.2. Index Types](https://www.postgresql.org/docs/current/indexes-types.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:20:39 PM

Saya lanjut ke **Seri 10/22**. Fokusnya search/list screen OLTP: pagination yang tidak rusak di data besar, dynamic filter yang tetap index-friendly, safe sorting di MyBatis, dan contract API/UX untuk transactional list.

# PostgreSQL OLTP - Seri 10/22  
## Pagination, Sorting, Filtering, dan Search Screen Pattern: Keyset Pagination, Dynamic Filters, Safe Sorting MyBatis, Index Strategy, dan API/UX Contract untuk Large Transactional List

Seri ini fokus pada masalah yang sering muncul di aplikasi enterprise:

```text id="dfrg5t"
List screen awalnya cepat.
Data tumbuh.
Filter bertambah.
Sorting bertambah.
User minta export.
Query jadi lambat.
Index makin banyak.
Pagination tidak stabil.
```

Untuk OLTP, screen seperti **case list, task inbox, approval queue, audit timeline, document list, external reconciliation list, dan outbox monitor** harus didesain sebagai access pattern yang eksplisit, bukan query bebas.

PostgreSQL bisa memakai B-tree index untuk memenuhi `ORDER BY`; arah index dapat ditentukan dengan `ASC`, `DESC`, `NULLS FIRST`, dan `NULLS LAST`, dan index juga bisa discan maju atau mundur tergantung kebutuhan order. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-ordering.html?utm_source=chatgpt.com))

---

## 1. Mental Model

```text id="62aw47"
Transactional List/Search Screen
│
├─ Query contract
│  ├─ required filters
│  ├─ optional filters
│  ├─ allowed sort options
│  ├─ page size limit
│  └─ cursor format
│
├─ Data access pattern
│  ├─ point lookup
│  ├─ worklist
│  ├─ search by business key
│  ├─ audit timeline
│  ├─ queue monitor
│  └─ export/batch
│
├─ Pagination
│  ├─ offset pagination
│  ├─ keyset/cursor pagination
│  ├─ deterministic ordering
│  └─ tie-breaker column
│
├─ Filtering
│  ├─ mandatory tenant boundary
│  ├─ status / lifecycle
│  ├─ date range
│  ├─ assignee / owner
│  ├─ exact business key
│  └─ controlled text search
│
├─ Sorting
│  ├─ whitelist sort option
│  ├─ index-compatible order
│  ├─ stable tie-breaker
│  └─ null ordering
│
└─ Implementation
   ├─ MyBatis dynamic SQL
   ├─ no raw user SQL fragment
   ├─ composite / partial index
   ├─ EXPLAIN validation
   └─ response metadata
```

Rule utama:

```text id="8tw6n4"
Search screen OLTP harus dibatasi oleh contract.
Kalau semua kombinasi filter/sort dibebaskan, index strategy akan runtuh.
```

---

## 2. Offset vs Keyset Pagination

### Offset pagination

```sql id="kekugu"
SELECT
    case_id,
    case_number,
    title,
    status,
    created_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND deleted_at IS NULL
ORDER BY created_at DESC
OFFSET :offset
LIMIT :limit;
```

Kelebihan:

```text id="x3n4ab"
1. sederhana
2. bisa lompat ke page N
3. familiar untuk UI
```

Masalah:

```text id="y3oj2j"
1. page jauh makin mahal
2. hasil bisa bergeser saat ada insert/update baru
3. database tetap harus melewati row yang di-skip
4. tidak ideal untuk table OLTP besar
```

### Keyset/cursor pagination

```sql id="5nawtc"
SELECT
    case_id,
    case_number,
    title,
    status,
    created_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND deleted_at IS NULL
  AND (
      :lastCreatedAt IS NULL
      OR (created_at, case_id) < (:lastCreatedAt, :lastCaseId)
  )
ORDER BY created_at DESC, case_id DESC
LIMIT :limit;
```

Index:

```sql id="vfcpaf"
CREATE INDEX idx_case__tenant_created_cursor
ON regulatory_case (
    tenant_id,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

Kelebihan:

```text id="ngz7wu"
1. stabil untuk table besar
2. latency lebih predictable
3. cocok untuk infinite scroll / next page
4. bekerja baik dengan composite index
```

Kekurangan:

```text id="ctbslj"
1. tidak mudah lompat ke page 100
2. cursor harus disimpan client
3. ORDER BY harus deterministic
4. setiap sort option butuh cursor dan index yang sesuai
```

PostgreSQL menyediakan `EXPLAIN` untuk melihat query plan yang dipilih planner; dokumentasi resmi menekankan bahwa memilih plan yang cocok terhadap struktur query dan properti data sangat penting untuk performa. ([PostgreSQL](https://www.postgresql.org/docs/current/using-explain.html?utm_source=chatgpt.com))

---

## 3. Deterministic Ordering: Wajib Ada Tie-Breaker

Buruk:

```sql id="69wh0b"
ORDER BY created_at DESC
```

Kalau banyak row punya timestamp sama, urutan bisa tidak stabil.

Lebih baik:

```sql id="3sjt23"
ORDER BY created_at DESC, case_id DESC
```

Cursor predicate juga harus memakai pasangan yang sama:

```sql id="tl4uib"
AND (created_at, case_id) < (:lastCreatedAt, :lastCaseId)
```

Rule:

```text id="jkyvv3"
ORDER BY untuk pagination harus:
1. stable
2. deterministic
3. punya tie-breaker unik
4. match dengan cursor predicate
5. match dengan index order
```

Tie-breaker umum:

| Sort utama | Tie-breaker |
|---|---|
| `created_at DESC` | `case_id DESC` |
| `updated_at DESC` | `case_id DESC` |
| `priority DESC` | `created_at ASC`, `case_id ASC` |
| `audit_id ASC` | biasanya sudah unique |
| `job_id ASC` | biasanya sudah unique |
| `case_number ASC` | `case_id ASC` |

---

## 4. API Contract untuk Cursor Pagination

Request:

```http id="4r7mqj"
GET /api/cases?status=SUBMITTED&limit=50&sort=CREATED_AT_DESC&cursor=...
```

Response:

```json id="k4rygf"
{
  "items": [
    {
      "caseId": "019535d9-3df7-79fb-b466-fa907fa17f9e",
      "caseNumber": "CASE-2026-0001",
      "title": "Suspicious activity review",
      "status": "SUBMITTED",
      "createdAt": "2026-07-15T10:30:00Z"
    }
  ],
  "page": {
    "limit": 50,
    "hasMore": true,
    "nextCursor": "base64url-json-payload"
  }
}
```

Cursor payload sebelum encoding:

```json id="y8l3e3"
{
  "sort": "CREATED_AT_DESC",
  "lastCreatedAt": "2026-07-15T10:30:00Z",
  "lastCaseId": "019535d9-3df7-79fb-b466-fa907fa17f9e"
}
```

Practical cursor rules:

```text id="nf7y5k"
1. cursor harus terkait sort option
2. cursor sebaiknya opaque untuk client
3. cursor tidak boleh dipercaya tanpa validasi
4. limit tetap dibatasi server
5. cursor boleh expired jika filter/sort berubah
```

---

## 5. Page Size Contract

Jangan biarkan client menentukan limit bebas.

```text id="cf5ikl"
default limit: 25 / 50
max limit: 100 / 200
export: endpoint/job berbeda
```

Contoh validasi Java:

```java id="9zd10v"
public int normalizeLimit(Integer requestedLimit) {
    int defaultLimit = 50;
    int maxLimit = 100;

    if (requestedLimit == null) {
        return defaultLimit;
    }

    if (requestedLimit < 1) {
        return defaultLimit;
    }

    return Math.min(requestedLimit, maxLimit);
}
```

Rule:

```text id="dq3s52"
List endpoint bukan export endpoint.
Export besar harus async/batch/staging, bukan limit=100000.
```

---

## 6. Filtering: Mandatory vs Optional

### Mandatory filter

Untuk multi-tenant OLTP:

```sql id="psyby4"
WHERE tenant_id = :tenantId
```

Untuk active screen:

```sql id="x90b2k"
AND deleted_at IS NULL
```

Untuk worklist:

```sql id="qpeuva"
AND status = 'SUBMITTED'
```

### Optional filter

```sql id="z25151"
AND (:priority IS NULL OR priority = :priority)
AND (:assigneeId IS NULL OR assignee_id = :assigneeId)
AND (:createdFrom IS NULL OR created_at >= :createdFrom)
```

Masalah optional filter gaya `:param IS NULL OR column = :param`:

```text id="31guko"
1. query shape menjadi terlalu generic
2. planner bisa lebih sulit memilih index terbaik
3. index strategy kabur
4. predicate bisa kurang sargable dalam praktik
```

Untuk search penting, lebih baik gunakan dynamic SQL agar predicate hanya muncul saat aktif.

MyBatis menyediakan dynamic SQL dengan elemen seperti `if`, `choose`, `trim`, `where`, `set`, dan `foreach`, sehingga mapper XML dapat membuat SQL sesuai parameter aktif. ([MyBatis](https://mybatis.org/mybatis-3/dynamic-sql.html?utm_source=chatgpt.com))

---

## 7. MyBatis Dynamic Filter Pattern

```xml id="whl1vc"
<select id="searchCases" resultMap="CaseListItemMap">
  SELECT
      case_id,
      case_number,
      title,
      status,
      priority,
      assignee_id,
      created_at,
      updated_at
  FROM regulatory_case
  <where>
    tenant_id = #{tenantId}
    AND deleted_at IS NULL

    <if test="status != null">
      AND status = #{status}
    </if>

    <if test="priority != null">
      AND priority = #{priority}
    </if>

    <if test="assigneeId != null">
      AND assignee_id = #{assigneeId}
    </if>

    <if test="createdFrom != null">
      AND created_at &gt;= #{createdFrom}
    </if>

    <if test="createdTo != null">
      AND created_at &lt; #{createdTo}
    </if>
  </where>

  ORDER BY created_at DESC, case_id DESC
  LIMIT #{limit}
</select>
```

Manfaat:

```text id="2xbtyo"
SQL yang dikirim ke PostgreSQL lebih spesifik.
Predicate yang tidak dipakai tidak muncul.
Index matching lebih mudah dianalisis.
```

Catatan:

```text id="myu8mr"
Dynamic SQL bukan alasan membuat search bebas tanpa batas.
Tetap batasi kombinasi filter/sort yang didukung.
```

---

## 8. Safe Sorting di MyBatis

Jangan lakukan ini:

```xml id="hqkxqf"
ORDER BY ${sortColumn} ${sortDirection}
```

`${}` adalah string substitution. Untuk sort column/direction dari user, ini raw SQL fragment dan berbahaya jika tidak di-whitelist.

Lebih aman:

```xml id="b83087"
<choose>
  <when test="sort == 'CREATED_AT_DESC'">
    ORDER BY created_at DESC, case_id DESC
  </when>
  <when test="sort == 'CREATED_AT_ASC'">
    ORDER BY created_at ASC, case_id ASC
  </when>
  <when test="sort == 'UPDATED_AT_DESC'">
    ORDER BY updated_at DESC, case_id DESC
  </when>
  <when test="sort == 'PRIORITY_DESC'">
    ORDER BY priority DESC, created_at ASC, case_id ASC
  </when>
  <otherwise>
    ORDER BY created_at DESC, case_id DESC
  </otherwise>
</choose>
```

Rule:

```text id="5u5bhz"
Value → #{param}
Identifier / SQL fragment → whitelist, bukan direct user input
```

---

## 9. Sort Option Harus Punya Index Strategy

Setiap sort penting butuh index.

### Sort 1 - `CREATED_AT_DESC`

Query:

```sql id="kasz95"
WHERE tenant_id = :tenantId
  AND deleted_at IS NULL
ORDER BY created_at DESC, case_id DESC
LIMIT :limit
```

Index:

```sql id="87d6mi"
CREATE INDEX idx_case__created_desc
ON regulatory_case (
    tenant_id,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

### Sort 2 - `UPDATED_AT_DESC`

```sql id="wxrol0"
CREATE INDEX idx_case__updated_desc
ON regulatory_case (
    tenant_id,
    updated_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

### Sort 3 - `PRIORITY_DESC`

```sql id="8k8e2k"
CREATE INDEX idx_case__priority_worklist
ON regulatory_case (
    tenant_id,
    priority DESC,
    created_at ASC,
    case_id ASC
)
WHERE deleted_at IS NULL
  AND status = 'SUBMITTED';
```

Rule:

```text id="2nm960"
Jangan menawarkan 12 sort option kalau hanya 2 yang punya index strategy.
```

PostgreSQL multicolumn indexes paling efektif ketika query memberi constraint pada leading columns; B-tree multicolumn index juga perlu didesain mengikuti equality filter dan sort/range yang akan dipakai. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-multicolumn.html?utm_source=chatgpt.com))

---

## 10. Pattern: Worklist Screen

Use case:

```text id="tp9hsc"
Reviewer membuka daftar case SUBMITTED yang belum diklaim,
diurutkan berdasarkan oldest first.
```

SQL:

```sql id="5g3srk"
SELECT
    case_id,
    case_number,
    title,
    priority,
    created_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND status = 'SUBMITTED'
  AND assignee_id IS NULL
  AND deleted_at IS NULL
  AND (
      :lastCreatedAt IS NULL
      OR (created_at, case_id) > (:lastCreatedAt, :lastCaseId)
  )
ORDER BY created_at ASC, case_id ASC
LIMIT :limit;
```

Index:

```sql id="b3l7qt"
CREATE INDEX idx_case__submitted_unassigned_worklist
ON regulatory_case (
    tenant_id,
    created_at ASC,
    case_id ASC
)
WHERE status = 'SUBMITTED'
  AND assignee_id IS NULL
  AND deleted_at IS NULL;
```

Kenapa partial?

```text id="r5orxg"
Screen hanya menampilkan SUBMITTED + unassigned + active.
Index hanya perlu menyimpan subset itu.
```

---

## 11. Pattern: “My Tasks” Screen

Use case:

```text id="t7ih76"
User melihat task miliknya, active, sorted by due date.
```

SQL:

```sql id="dva5bn"
SELECT
    task_id,
    case_id,
    task_type,
    status,
    due_at,
    created_at
FROM workflow_task
WHERE tenant_id = :tenantId
  AND assignee_id = :userId
  AND status IN ('CLAIMED', 'IN_PROGRESS')
  AND deleted_at IS NULL
  AND (
      :lastDueAt IS NULL
      OR (due_at, task_id) > (:lastDueAt, :lastTaskId)
  )
ORDER BY due_at ASC NULLS LAST, task_id ASC
LIMIT :limit;
```

Index:

```sql id="96f6yj"
CREATE INDEX idx_workflow_task__my_active_due
ON workflow_task (
    tenant_id,
    assignee_id,
    due_at ASC NULLS LAST,
    task_id ASC
)
WHERE status IN ('CLAIMED', 'IN_PROGRESS')
  AND deleted_at IS NULL;
```

PostgreSQL B-tree indexes dapat dibuat dengan `NULLS FIRST` atau `NULLS LAST`, dan index ordering dapat memengaruhi apakah `ORDER BY` bisa dipenuhi oleh index. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-ordering.html?utm_source=chatgpt.com))

---

## 12. Pattern: Audit Timeline

Use case:

```text id="1nk82k"
Menampilkan audit event sebuah case dari awal sampai akhir.
```

SQL:

```sql id="w1e3f8"
SELECT
    audit_id,
    event_type,
    actor_id,
    occurred_at,
    metadata
FROM case_audit_log
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND (
      :lastAuditId IS NULL
      OR audit_id > :lastAuditId
  )
ORDER BY audit_id ASC
LIMIT :limit;
```

Index:

```sql id="e2wn9i"
CREATE INDEX idx_case_audit_log__case_timeline
ON case_audit_log (
    tenant_id,
    case_id,
    audit_id ASC
);
```

Kalau `audit_id` global/tenant-scoped identity sudah ada di PK, cek apakah PK order mendukung query. Jika PK `(tenant_id, audit_id)` saja, query by `(tenant_id, case_id)` tetap butuh index tambahan.

---

## 13. Pattern: Exact Search by Business Key

Search exact case number:

```sql id="go7x1k"
SELECT
    case_id,
    case_number,
    status,
    title,
    created_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND case_number = :caseNumber
  AND deleted_at IS NULL;
```

Index:

```sql id="io9410"
CREATE UNIQUE INDEX uq_case__active_case_number
ON regulatory_case (
    tenant_id,
    case_number
)
WHERE deleted_at IS NULL;
```

Rule:

```text id="5do6bd"
Exact search by business key harus berbeda dari fuzzy search.
Exact search harus cepat dan unique/index-backed.
```

---

## 14. Pattern: Prefix Search yang Terkontrol

Untuk prefix search case number:

```sql id="97kkm7"
SELECT
    case_id,
    case_number,
    status,
    title
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND case_number LIKE :prefix || '%'
  AND deleted_at IS NULL
ORDER BY case_number ASC, case_id ASC
LIMIT :limit;
```

Index option umum:

```sql id="5j39vf"
CREATE INDEX idx_case__case_number_prefix
ON regulatory_case (
    tenant_id,
    case_number text_pattern_ops,
    case_id
)
WHERE deleted_at IS NULL;
```

Catatan:

```text id="r59egu"
Prefix search masih bisa dikontrol.
Contains search '%abc%' berbeda masalah dan biasanya butuh trigram/full-text/search engine.
```

---

## 15. Pattern: Controlled Text Search

Untuk OLTP search screen, jangan langsung memberi wildcard bebas pada semua kolom.

Buruk:

```sql id="zp1m8q"
WHERE title ILIKE '%' || :keyword || '%'
   OR description ILIKE '%' || :keyword || '%'
   OR metadata::text ILIKE '%' || :keyword || '%'
```

Masalah:

```text id="j0yqlt"
1. sulit di-index
2. mudah scan besar
3. latency tidak predictable
4. user bisa mengirim keyword terlalu pendek
5. query bisa mengganggu workload transaksi utama
```

Lebih aman untuk OLTP core:

```text id="aicj3q"
1. exact business key search
2. prefix search untuk nomor/kode
3. controlled status/owner/date filter
4. text search khusus dengan index/endpoint berbeda
5. minimum keyword length
6. limit kecil
```

Full-text/trigram/vector search sebaiknya dipisahkan sebagai seri/search capability tersendiri, bukan dicampur liar ke worklist OLTP.

---

## 16. Dynamic Filter Index Strategy

Contoh query dynamic:

```text id="76eycc"
tenant_id wajib
deleted_at IS NULL wajib
optional:
- status
- assignee_id
- priority
- created_at range
sort:
- created_at desc
```

Jangan otomatis buat semua kombinasi index.

Mulai dari query utama:

### Index A - default list

```sql id="1k70z9"
CREATE INDEX idx_case_search__default
ON regulatory_case (
    tenant_id,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

### Index B - status list

```sql id="9clcg5"
CREATE INDEX idx_case_search__status
ON regulatory_case (
    tenant_id,
    status,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

### Index C - assignee active list

```sql id="a2hw7d"
CREATE INDEX idx_case_search__assignee
ON regulatory_case (
    tenant_id,
    assignee_id,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL
  AND assignee_id IS NOT NULL;
```

Review berdasarkan actual usage:

```sql id="rz41w3"
SELECT
    schemaname,
    relname AS table_name,
    indexrelname AS index_name,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE relname = 'regulatory_case'
ORDER BY idx_scan DESC;
```

Rule:

```text id="mq9yfb"
Index strategy harus dipandu oleh:
1. top query dari pg_stat_statements
2. screen traffic
3. cardinality/selectivity
4. latency SLO
5. write overhead
```

---

## 17. Handling Nullable Sort Columns

Contoh sort by `due_at`, nullable.

SQL:

```sql id="czj3dv"
ORDER BY due_at ASC NULLS LAST, task_id ASC
```

Cursor predicate untuk ASC NULLS LAST lebih tricky kalau `due_at` bisa null. Solusi praktis:

### Opsi A - Pisahkan null dan non-null

Untuk active task, buat due date mandatory jika memang workflow butuh SLA:

```sql id="qj5xpp"
due_at timestamptz NOT NULL
```

### Opsi B - Gunakan generated effective sort column

```sql id="hukbmx"
ALTER TABLE workflow_task
ADD COLUMN due_sort_at timestamptz
GENERATED ALWAYS AS (
    COALESCE(due_at, 'infinity'::timestamptz)
) STORED;

CREATE INDEX idx_task__due_sort
ON workflow_task (
    tenant_id,
    assignee_id,
    due_sort_at ASC,
    task_id ASC
)
WHERE deleted_at IS NULL;
```

Query:

```sql id="15drxf"
WHERE tenant_id = :tenantId
  AND assignee_id = :userId
  AND deleted_at IS NULL
  AND (
      :lastDueSortAt IS NULL
      OR (due_sort_at, task_id) > (:lastDueSortAt, :lastTaskId)
  )
ORDER BY due_sort_at ASC, task_id ASC
LIMIT :limit;
```

Rule:

```text id="af6xqk"
Nullable sort column membuat cursor logic lebih kompleks.
Untuk workflow critical, lebih baik punya normalized/generated sort key.
```

---

## 18. Counting Results: Jangan Default `COUNT(*)` Setiap Request

UI sering minta:

```text id="goauy6"
"Page 1 of 12579"
```

Query count:

```sql id="wi9ft4"
SELECT count(*)
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND status = :status
  AND deleted_at IS NULL;
```

Masalah:

```text id="q9z8zg"
count besar bisa mahal
filter dynamic membuat count makin berat
count berubah terus di OLTP
sering tidak diperlukan untuk user action
```

Alternatif:

```text id="1f7te6"
1. hasMore dengan fetch limit + 1
2. approximate count dari statistik/reporting
3. count async/cache untuk dashboard
4. no total count untuk infinite scroll
```

Fetch `limit + 1`:

```sql id="ufx22t"
SELECT
    case_id,
    case_number,
    title,
    created_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND deleted_at IS NULL
ORDER BY created_at DESC, case_id DESC
LIMIT :limitPlusOne;
```

Application:

```text id="6i4s82"
if rows.size > requestedLimit:
  hasMore = true
  return first requestedLimit rows
else:
  hasMore = false
```

---

## 19. API Search DTO

Request object:

```java id="km1wkp"
public record CaseSearchRequest(
    Long tenantId,
    String status,
    String priority,
    String assigneeId,
    OffsetDateTime createdFrom,
    OffsetDateTime createdTo,
    CaseSort sort,
    String cursor,
    Integer limit
) {}
```

Sort enum:

```java id="k512vd"
public enum CaseSort {
    CREATED_AT_DESC,
    CREATED_AT_ASC,
    UPDATED_AT_DESC,
    PRIORITY_DESC
}
```

Cursor object:

```java id="0b38g5"
public sealed interface CaseCursor permits CreatedAtCursor, UpdatedAtCursor, PriorityCursor {}

public record CreatedAtCursor(
    OffsetDateTime lastCreatedAt,
    UUID lastCaseId
) implements CaseCursor {}

public record UpdatedAtCursor(
    OffsetDateTime lastUpdatedAt,
    UUID lastCaseId
) implements CaseCursor {}

public record PriorityCursor(
    String lastPriority,
    OffsetDateTime lastCreatedAt,
    UUID lastCaseId
) implements CaseCursor {}
```

Rule:

```text id="jvb8un"
Sort option menentukan cursor type.
Jangan pakai satu cursor generic untuk semua sort jika kolom order berbeda.
```

---

## 20. MyBatis Mapper: Sort-Specific Cursor Predicate

```xml id="qapv1k"
<select id="searchCases" resultMap="CaseListItemMap">
  SELECT
      case_id,
      case_number,
      title,
      status,
      priority,
      assignee_id,
      created_at,
      updated_at
  FROM regulatory_case
  <where>
    tenant_id = #{tenantId}
    AND deleted_at IS NULL

    <if test="status != null">
      AND status = #{status}
    </if>

    <if test="priority != null">
      AND priority = #{priority}
    </if>

    <if test="assigneeId != null">
      AND assignee_id = #{assigneeId}
    </if>

    <choose>
      <when test="sort == 'CREATED_AT_DESC' and cursor != null">
        AND (created_at, case_id) &lt; (#{cursor.lastCreatedAt}, #{cursor.lastCaseId})
      </when>
      <when test="sort == 'CREATED_AT_ASC' and cursor != null">
        AND (created_at, case_id) &gt; (#{cursor.lastCreatedAt}, #{cursor.lastCaseId})
      </when>
      <when test="sort == 'UPDATED_AT_DESC' and cursor != null">
        AND (updated_at, case_id) &lt; (#{cursor.lastUpdatedAt}, #{cursor.lastCaseId})
      </when>
    </choose>
  </where>

  <choose>
    <when test="sort == 'CREATED_AT_ASC'">
      ORDER BY created_at ASC, case_id ASC
    </when>
    <when test="sort == 'UPDATED_AT_DESC'">
      ORDER BY updated_at DESC, case_id DESC
    </when>
    <otherwise>
      ORDER BY created_at DESC, case_id DESC
    </otherwise>
  </choose>

  LIMIT #{limitPlusOne}
</select>
```

Catatan praktis:

```text id="prq8d2"
Untuk mapper kompleks, lebih baik punya beberapa mapper method khusus
daripada satu XML raksasa yang sulit dites dan di-review.
```

---

## 21. DTO Response Pattern

```java id="h2lo3t"
public record PageResponse<T>(
    List<T> items,
    PageInfo page
) {}

public record PageInfo(
    int limit,
    boolean hasMore,
    String nextCursor
) {}
```

Build response:

```java id="h3qr4h"
public PageResponse<CaseListItem> toPage(
        List<CaseListItem> rows,
        int requestedLimit,
        CaseSort sort
) {
    boolean hasMore = rows.size() > requestedLimit;

    List<CaseListItem> items = hasMore
            ? rows.subList(0, requestedLimit)
            : rows;

    String nextCursor = null;

    if (hasMore && !items.isEmpty()) {
        CaseListItem last = items.get(items.size() - 1);
        nextCursor = encodeCursor(sort, last);
    }

    return new PageResponse<>(
        items,
        new PageInfo(requestedLimit, hasMore, nextCursor)
    );
}
```

---

## 22. Search Endpoint Design

Good contract:

```http id="8k3n2w"
GET /api/cases?status=SUBMITTED&sort=CREATED_AT_DESC&limit=50
```

Next page:

```http id="0xsp9g"
GET /api/cases?status=SUBMITTED&sort=CREATED_AT_DESC&limit=50&cursor=eyJ...
```

Bad contract:

```http id="bdtd8e"
GET /api/cases?q=a&sort=anything&offset=100000&limit=10000
```

Why bad:

```text id="4dvrp6"
1. q terlalu bebas
2. sort tidak dikontrol
3. offset besar
4. limit besar
5. query plan sulit dikontrol
6. bisa mengganggu OLTP workload
```

---

## 23. Export Pattern: Jangan Campur dengan List Endpoint

List endpoint:

```text id="2gpwx7"
- low latency
- page kecil
- user interactive
- current state
```

Export endpoint:

```text id="6mmwe0"
- async
- batch/chunk
- snapshot-ish
- file/object storage
- progress tracking
```

Schema export job:

```sql id="khy25z"
CREATE TABLE export_job (
    tenant_id       bigint NOT NULL,
    export_id       uuid NOT NULL DEFAULT uuidv7(),
    export_type     text NOT NULL,
    filter_payload  jsonb NOT NULL,
    status          text NOT NULL DEFAULT 'PENDING',
    requested_by    text NOT NULL,
    requested_at    timestamptz NOT NULL DEFAULT clock_timestamp(),
    completed_at    timestamptz,
    storage_key     text,

    CONSTRAINT pk_export_job
        PRIMARY KEY (tenant_id, export_id),

    CONSTRAINT chk_export_job__status
        CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'))
);
```

Rule:

```text id="t5ygb2"
Kalau user butuh semua data, jangan paksa interactive list endpoint jadi export engine.
```

---

## 24. Read Consistency untuk Multi-Page Result

Di OLTP, data berubah saat user berpindah page.

Kemungkinan:

```text id="vc2gwe"
1. row baru muncul di page sebelumnya
2. row berubah status dan hilang dari filter
3. row yang sudah dilihat muncul lagi jika sort key berubah
4. row deleted tidak muncul lagi
```

Approach praktis:

| Approach | Kapan cocok |
|---|---|
| Accept eventual list movement | Worklist umum |
| Cursor by immutable key | Audit timeline |
| Freeze by `asOf` timestamp | Review/export tertentu |
| Snapshot table/export job | Audit/export/regulatory extract |
| Locking list result | Hampir selalu buruk untuk OLTP UI |

Contoh `asOf`:

```sql id="l7pjsd"
SELECT
    case_id,
    case_number,
    status,
    created_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND deleted_at IS NULL
  AND created_at <= :asOf
  AND (
      :lastCreatedAt IS NULL
      OR (created_at, case_id) < (:lastCreatedAt, :lastCaseId)
  )
ORDER BY created_at DESC, case_id DESC
LIMIT :limit;
```

Rule:

```text id="mxq4ww"
Jangan menjanjikan list yang frozen/stabil kecuali query contract memang mendukung snapshot/asOf.
```

---

## 25. Index Validation with EXPLAIN

Contoh query:

```sql id="jthqps"
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    case_id,
    case_number,
    title,
    created_at
FROM regulatory_case
WHERE tenant_id = 1001
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY created_at DESC, case_id DESC
LIMIT 50;
```

Yang dicari:

```text id="ko935b"
1. Index Scan / Index Only Scan pada index yang diharapkan
2. tidak ada Sort mahal jika index order cocok
3. rows removed by filter rendah
4. actual rows mendekati estimate
5. buffers read/hit masuk akal
6. execution time sesuai SLO
```

PostgreSQL `CREATE INDEX` mendukung index pada kolom atau expression, multicolumn index, dan `INCLUDE`; dokumentasi juga mengingatkan bahwa index yang tidak tepat dapat memperlambat performa karena overhead maintenance. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createindex.html?utm_source=chatgpt.com))

---

## 26. Search Screen Review Checklist

| Area | Pertanyaan review |
|---|---|
| Required filter | Apakah `tenant_id` selalu wajib? |
| Active predicate | Apakah `deleted_at IS NULL` konsisten? |
| Sort whitelist | Apakah sort hanya enum yang didukung? |
| Tie-breaker | Apakah semua sort punya tie-breaker unik? |
| Cursor match | Apakah cursor predicate match dengan `ORDER BY`? |
| Limit bound | Apakah server membatasi max limit? |
| Offset avoided | Apakah table besar pakai keyset/cursor? |
| Dynamic SQL safe | Apakah tidak ada `${userInput}`? |
| Index strategy | Apakah setiap screen utama punya index yang cocok? |
| Optional filter | Apakah filter liar dibatasi? |
| Count avoided | Apakah tidak selalu `COUNT(*)` untuk setiap request? |
| Export separated | Apakah export besar async dan tidak pakai list endpoint? |
| EXPLAIN checked | Apakah query diuji dengan data realistis? |
| UX expectation | Apakah user tahu list bisa berubah antar-page? |

---

## 27. Anti-Pattern

### Anti-pattern 1 - Offset besar di table besar

```sql id="l0uljs"
OFFSET 500000 LIMIT 50
```

Lebih baik:

```sql id="kygt44"
WHERE (created_at, case_id) < (:lastCreatedAt, :lastCaseId)
ORDER BY created_at DESC, case_id DESC
LIMIT 50
```

---

### Anti-pattern 2 - Semua filter optional dalam satu query generic

```sql id="l2s9ny"
AND (:status IS NULL OR status = :status)
AND (:priority IS NULL OR priority = :priority)
AND (:assignee IS NULL OR assignee_id = :assignee)
```

Lebih baik:

```text id="meclzz"
Gunakan dynamic SQL atau query-specific endpoint untuk search penting.
```

---

### Anti-pattern 3 - User bebas sort column

```xml id="cwmnrn"
ORDER BY ${sortColumn}
```

Lebih baik:

```text id="0czsi2"
Sort enum → whitelist SQL fragment.
```

---

### Anti-pattern 4 - List endpoint dipakai export

```http id="kpx2t7"
GET /api/cases?limit=100000
```

Lebih baik:

```http id="e7ddgd"
POST /api/case-exports
GET /api/case-exports/{exportId}
```

---

### Anti-pattern 5 - Search text bebas di OLTP core

```sql id="tsr71c"
ILIKE '%keyword%' across many columns
```

Lebih baik:

```text id="t5x5yw"
Exact lookup / prefix lookup / indexed full-text endpoint terpisah.
```

---

## 28. Mini Lab

### Step 1 - Table

```sql id="tvuo6b"
CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL,
    status       text NOT NULL,
    title        text NOT NULL,
    priority     text NOT NULL DEFAULT 'NORMAL',
    assignee_id  text,
    created_at   timestamptz NOT NULL DEFAULT clock_timestamp(),
    updated_at   timestamptz NOT NULL DEFAULT clock_timestamp(),
    deleted_at   timestamptz,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number)
);
```

### Step 2 - Index default list

```sql id="80fj6d"
CREATE INDEX idx_case__default_list
ON regulatory_case (
    tenant_id,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

### Step 3 - Index submitted worklist

```sql id="5woqlu"
CREATE INDEX idx_case__submitted_unassigned
ON regulatory_case (
    tenant_id,
    created_at ASC,
    case_id ASC
)
WHERE status = 'SUBMITTED'
  AND assignee_id IS NULL
  AND deleted_at IS NULL;
```

### Step 4 - Keyset query

```sql id="365mq6"
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    case_id,
    case_number,
    title,
    created_at
FROM regulatory_case
WHERE tenant_id = 1001
  AND deleted_at IS NULL
  AND (
      TIMESTAMPTZ '2026-07-15 10:30:00+00' IS NULL
      OR (created_at, case_id) < (
          TIMESTAMPTZ '2026-07-15 10:30:00+00',
          '019535d9-3df7-79fb-b466-fa907fa17f9e'::uuid
      )
  )
ORDER BY created_at DESC, case_id DESC
LIMIT 50;
```

### Step 5 - Worklist query

```sql id="b26i0e"
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    case_id,
    case_number,
    title,
    priority,
    created_at
FROM regulatory_case
WHERE tenant_id = 1001
  AND status = 'SUBMITTED'
  AND assignee_id IS NULL
  AND deleted_at IS NULL
ORDER BY created_at ASC, case_id ASC
LIMIT 50;
```

Expected:

```text id="zlrt48"
Query default list memakai idx_case__default_list.
Query submitted worklist memakai idx_case__submitted_unassigned.
Tidak ada sort mahal jika index order match.
```

---

## 29. Ringkasan Praktis

```text id="v7la69"
1. Search/list screen OLTP harus punya query contract yang jelas.
2. Untuk table besar, keyset pagination lebih aman daripada OFFSET besar.
3. Semua pagination harus punya ORDER BY deterministic dan tie-breaker unik.
4. Cursor harus match sort option dan tidak boleh dipercaya mentah.
5. Limit harus dibatasi server.
6. Dynamic filters boleh, tapi kombinasi filter/sort harus dikendalikan.
7. Safe sorting di MyBatis harus pakai whitelist, bukan ${userInput}.
8. Setiap sort utama butuh index strategy.
9. Partial index sangat cocok untuk worklist: active/open/ready/submitted.
10. Jangan selalu COUNT(*) untuk setiap list request.
11. Export besar harus dipisah dari interactive list endpoint.
12. Validasi performa dengan EXPLAIN pada data realistis.
```

---

# Status Seri

**Seri 10/22 selesai.**

Rekomendasi lanjut ke:

**Seri 11 - PL/pgSQL for PostgreSQL OLTP: Function, Procedure, Trigger, Stored Operation, Audit Trigger, Validation Trigger, Error Handling, dan integrasi Java/Jersey/MyBatis.**

---

**Sources:**

- [Documentation: 18: 11.4. Indexes and ORDER BY](https://www.postgresql.org/docs/current/indexes-ordering.html?utm_source=chatgpt.com)
- [MyBatis 3 | Dynamic SQL](https://mybatis.org/mybatis-3/dynamic-sql.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:25:18 PM

Saya lanjut ke **Seri 11/22**. Fokusnya PL/pgSQL secara praktis: kapan logic layak masuk DB, function vs procedure, trigger audit/validation, error handling, transaction behavior, dan cara dipanggil dari MyBatis.

# PostgreSQL OLTP - Seri 11/22  
## PL/pgSQL for OLTP: Function, Procedure, Trigger, Stored Operation, Audit Trigger, Validation Trigger, Error Handling, dan Integrasi Java/Jersey/MyBatis

Seri ini membahas **kapan logic layak ditempatkan di PostgreSQL**, bukan sekadar cara menulis PL/pgSQL. Untuk OLTP production, PL/pgSQL paling berguna saat logic harus:

```text id="v9bpez"
1. atomic bersama perubahan data
2. dekat dengan invariant database
3. reusable oleh beberapa writer
4. sulit dijaga hanya dari aplikasi
5. membutuhkan audit/validation otomatis
6. mengurangi round-trip aplikasi untuk operasi kecil tapi kritis
```

PostgreSQL menyediakan PL/pgSQL sebagai procedural language; trigger function PL/pgSQL dibuat dengan `CREATE FUNCTION`, tidak punya argumen biasa, dan mengembalikan `trigger` untuk data-change trigger. PostgreSQL juga menyediakan `CREATE TRIGGER` untuk menjalankan function saat operasi tertentu terjadi pada table/view/foreign table. ([PostgreSQL](https://www.postgresql.org/docs/current/plpgsql-trigger.html?utm_source=chatgpt.com))

---

## 1. Mental Model

```text id="33h3bq"
PL/pgSQL in OLTP
│
├─ Function
│  ├─ reusable calculation
│  ├─ validation helper
│  ├─ stored operation returning result
│  └─ can be called from SQL/MyBatis
│
├─ Procedure
│  ├─ called via CALL
│  ├─ operational/batch routine
│  ├─ can have transaction control in limited contexts
│  └─ not ideal for normal HTTP transaction command
│
├─ Trigger Function
│  ├─ BEFORE trigger
│  ├─ AFTER trigger
│  ├─ audit/logging
│  ├─ invariant enforcement
│  └─ automatic side effect inside same transaction
│
├─ Error Handling
│  ├─ RAISE EXCEPTION
│  ├─ SQLSTATE / ERRCODE
│  ├─ EXCEPTION block
│  └─ subtransaction behavior
│
└─ Java/MyBatis Integration
   ├─ SELECT function(...)
   ├─ CALL procedure(...)
   ├─ mapper resultMap
   ├─ SQLSTATE mapping
   └─ transaction boundary in service layer
```

Rule utama:

```text id="hewpz7"
PL/pgSQL bagus untuk invariant dekat data.
PL/pgSQL buruk jika dipakai sebagai tempat menyembunyikan seluruh business workflow aplikasi.
```

---

## 2. Function vs Procedure vs Trigger

| Bentuk | Dipanggil dengan | Return | Cocok untuk | Catatan |
|---|---|---|---|---|
| SQL function | `SELECT fn(...)` | scalar/table/record | reusable operation, calculation, mutation with result | Umum dipanggil dari MyBatis |
| Procedure | `CALL proc(...)` | tidak seperti function; bisa `INOUT` | maintenance/batch/admin routine | Transaction control punya aturan khusus |
| Trigger function | otomatis oleh trigger | `trigger` | audit, validation, denormalized field, invariant | Side effect tersembunyi; harus dijaga |
| Plain SQL query | langsung `INSERT/UPDATE` | rowcount/returning | mayoritas command sederhana | Prefer ini jika cukup |
| Application service | Java method | object/API response | orchestration, auth, external call, workflow panjang | Jangan masukkan external call ke DB |

PostgreSQL `CREATE FUNCTION` membuat function baru; `CREATE OR REPLACE FUNCTION` dapat mengubah definisi tanpa memutus object yang mereferensikannya, sedangkan drop-recreate dianggap object baru dan bisa memutus rule/view/trigger yang bergantung padanya. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createfunction.html?utm_source=chatgpt.com))

---

## 3. Decision Table: Logic di DB atau Java?

| Logic | Tempat yang disarankan | Alasan |
|---|---|---|
| Non-blank, amount positive | Constraint | Simpel, invariant row-level |
| One active assignment | Partial unique index | Invariant lintas row sederhana |
| Status transition simple | SQL guarded update | Atomic dan eksplisit |
| Audit row otomatis untuk setiap update | Trigger | Dekat data, berlaku untuk semua writer |
| Business command submit case | Java service + SQL/PL function | Service tetap jelas, DB menjaga atomic mutation |
| External API call | Java/outbox worker | Jangan di DB transaction |
| Email/Kafka publish | Outbox + worker | Setelah commit |
| Complex approval workflow | Java/Camunda + DB transaction | Workflow panjang tidak cocok tersembunyi di function |
| Monthly recalculation batch | Procedure/job atau service worker | Bisa operasional/batch |
| Validasi effective rule no-overlap | Exclusion constraint/range | Lebih kuat daripada function |
| Derived search key | Generated column / trigger | Tergantung kompleksitas |

---

## 4. Anti-Golden Hammer Rule

Jangan menjadikan PL/pgSQL sebagai tempat semua logic.

```text id="bkft69"
Good PL/pgSQL:
- pendek
- deterministik
- dekat dengan data
- mudah dites via SQL
- tidak call external system
- tidak memegang lock terlalu lama
- error-nya punya SQLSTATE jelas

Bad PL/pgSQL:
- ribuan baris workflow
- banyak hidden side effect
- mengirim HTTP/email
- melakukan loop row-by-row untuk operasi set-based
- sulit dipahami aplikasi
- sulit dimonitor
```

---

# 5. Pattern 1 - Function untuk Business Number Generator

Contoh sederhana: generate case number.

```sql id="gz3ynq"
CREATE SEQUENCE IF NOT EXISTS case_number_seq
AS bigint
START WITH 1
INCREMENT BY 1
CACHE 50;

CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    next_number bigint;
BEGIN
    next_number := nextval('case_number_seq');

    RETURN 'CASE-' ||
           to_char(clock_timestamp(), 'YYYY') ||
           '-' ||
           lpad(next_number::text, 8, '0');
END;
$$;
```

Pakai saat insert:

```sql id="2067hk"
INSERT INTO regulatory_case (
    tenant_id,
    case_id,
    case_number,
    status,
    title,
    created_by,
    updated_by
)
VALUES (
    :tenantId,
    uuidv7(),
    generate_case_number(),
    'DRAFT',
    :title,
    :actorId,
    :actorId
)
RETURNING tenant_id, case_id, case_number;
```

Catatan penting:

```text id="lhu6tf"
Sequence tidak gapless.
Function ini cocok untuk case/ticket number biasa,
bukan legal numbering yang mensyaratkan gapless absolut.
```

---

# 6. Pattern 2 - Function untuk Stored Operation `submit_case`

Untuk command yang selalu harus melakukan beberapa mutation bersama, function bisa membantu menjaga atomicity.

Schema ringkas:

```sql id="w5sdcl"
CREATE TABLE regulatory_case (
    tenant_id     bigint NOT NULL,
    case_id       uuid NOT NULL DEFAULT uuidv7(),
    case_number   text NOT NULL,
    status        text NOT NULL,
    title         text NOT NULL,
    version       bigint NOT NULL DEFAULT 0,
    submitted_at  timestamptz,
    updated_by    text NOT NULL,
    updated_at    timestamptz NOT NULL DEFAULT clock_timestamp(),
    deleted_at    timestamptz,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number),

    CONSTRAINT chk_regulatory_case__status
        CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CLOSED'))
);

CREATE TABLE case_status_history (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL,
    history_id   bigint GENERATED ALWAYS AS IDENTITY,
    from_status  text,
    to_status    text NOT NULL,
    action       text NOT NULL,
    changed_by   text NOT NULL,
    changed_at   timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_case_status_history
        PRIMARY KEY (tenant_id, history_id)
);
```

Function:

```sql id="t1469w"
CREATE OR REPLACE FUNCTION submit_case(
    p_tenant_id bigint,
    p_case_id uuid,
    p_actor_id text,
    p_expected_version bigint
)
RETURNS TABLE (
    tenant_id bigint,
    case_id uuid,
    status text,
    version bigint,
    submitted_at timestamptz
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_from_status text := 'DRAFT';
BEGIN
    RETURN QUERY
    WITH updated AS (
        UPDATE regulatory_case c
        SET status = 'SUBMITTED',
            submitted_at = clock_timestamp(),
            version = c.version + 1,
            updated_by = p_actor_id,
            updated_at = clock_timestamp()
        WHERE c.tenant_id = p_tenant_id
          AND c.case_id = p_case_id
          AND c.status = v_from_status
          AND c.version = p_expected_version
          AND c.deleted_at IS NULL
        RETURNING
            c.tenant_id,
            c.case_id,
            c.status,
            c.version,
            c.submitted_at
    ),
    inserted_history AS (
        INSERT INTO case_status_history (
            tenant_id,
            case_id,
            from_status,
            to_status,
            action,
            changed_by
        )
        SELECT
            u.tenant_id,
            u.case_id,
            v_from_status,
            u.status,
            'SUBMIT',
            p_actor_id
        FROM updated u
        RETURNING tenant_id, case_id
    )
    SELECT
        u.tenant_id,
        u.case_id,
        u.status,
        u.version,
        u.submitted_at
    FROM updated u;
END;
$$;
```

Panggil:

```sql id="p4chdj"
SELECT *
FROM submit_case(
    :tenantId,
    :caseId,
    :actorId,
    :expectedVersion
);
```

Interpretasi:

| Result | Makna |
|---|---|
| 1 row | Submit berhasil |
| 0 row | Case tidak eligible/stale/not found |
| Exception | Constraint/error DB |

Rule praktis:

```text id="j4j7dv"
Stored operation bagus jika operasi sering dipanggil banyak writer
dan harus selalu menyertakan history/audit/outbox.
```

Tapi jangan sembunyikan authorization, API mapping, dan external side effect di function.

---

# 7. MyBatis Mapping untuk Function Returning Table

Mapper XML:

```xml id="2h6u4z"
<select id="submitCase" resultMap="SubmitCaseResultMap">
  SELECT
      tenant_id,
      case_id,
      status,
      version,
      submitted_at
  FROM submit_case(
      #{tenantId},
      #{caseId},
      #{actorId},
      #{expectedVersion}
  )
</select>
```

Mapper interface:

```java id="14888r"
public interface CaseCommandMapper {
    SubmitCaseResult submitCase(
        @Param("tenantId") long tenantId,
        @Param("caseId") UUID caseId,
        @Param("actorId") String actorId,
        @Param("expectedVersion") long expectedVersion
    );
}
```

Service:

```java id="5t0mlf"
public SubmitCaseResult submit(SubmitCaseCommand command) {
    try (SqlSession session = sqlSessionFactory.openSession(false)) {
        CaseCommandMapper mapper = session.getMapper(CaseCommandMapper.class);

        SubmitCaseResult result = mapper.submitCase(
            command.tenantId(),
            command.caseId(),
            command.actorId(),
            command.expectedVersion()
        );

        if (result == null) {
            session.rollback();
            throw new BusinessConflictException(
                "Case is not in DRAFT state or version is stale"
            );
        }

        session.commit();
        return result;
    }
}
```

---

# 8. Pattern 3 - Function dengan Explicit Business Error

Kadang `0 row` cukup. Kadang lebih baik function melempar error dengan custom SQLSTATE supaya aplikasi bisa mapping lebih jelas.

PostgreSQL `RAISE` mendukung severity seperti `DEBUG`, `INFO`, `NOTICE`, `WARNING`, dan `EXCEPTION`; `EXCEPTION` adalah default dan biasanya membatalkan transaksi saat ini. ([PostgreSQL](https://www.postgresql.org/docs/current/plpgsql-errors-and-messages.html?utm_source=chatgpt.com))

```sql id="89hy1y"
CREATE OR REPLACE FUNCTION submit_case_strict(
    p_tenant_id bigint,
    p_case_id uuid,
    p_actor_id text,
    p_expected_version bigint
)
RETURNS TABLE (
    tenant_id bigint,
    case_id uuid,
    status text,
    version bigint
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_status text;
    v_current_version bigint;
BEGIN
    SELECT c.status, c.version
    INTO v_current_status, v_current_version
    FROM regulatory_case c
    WHERE c.tenant_id = p_tenant_id
      AND c.case_id = p_case_id
      AND c.deleted_at IS NULL;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Case % not found', p_case_id
            USING ERRCODE = 'P0002',
                  DETAIL = 'No active case exists for the given tenant and case_id',
                  HINT = 'Check tenant_id and case_id';
    END IF;

    IF v_current_status <> 'DRAFT' THEN
        RAISE EXCEPTION 'Case % cannot be submitted from status %', p_case_id, v_current_status
            USING ERRCODE = 'P0001',
                  DETAIL = 'Submit requires DRAFT status',
                  HINT = 'Reload the case before retrying';
    END IF;

    IF v_current_version <> p_expected_version THEN
        RAISE EXCEPTION 'Case % version conflict', p_case_id
            USING ERRCODE = 'P0001',
                  DETAIL = 'Expected version does not match current version',
                  HINT = 'Reload latest case state';
    END IF;

    RETURN QUERY
    UPDATE regulatory_case c
    SET status = 'SUBMITTED',
        submitted_at = clock_timestamp(),
        version = c.version + 1,
        updated_by = p_actor_id,
        updated_at = clock_timestamp()
    WHERE c.tenant_id = p_tenant_id
      AND c.case_id = p_case_id
      AND c.status = 'DRAFT'
      AND c.version = p_expected_version
      AND c.deleted_at IS NULL
    RETURNING
        c.tenant_id,
        c.case_id,
        c.status,
        c.version;
END;
$$;
```

Catatan praktis:

```text id="bg6dzl"
P0001 raise_exception dan P0002 no_data_found adalah PL/pgSQL-related SQLSTATE.
Untuk API, sering lebih baik mapping berdasarkan SQLSTATE + context + constraint/function.
```

Namun jangan terlalu banyak custom error code jika 0-row result sudah cukup.

---

# 9. Function Error Handling dengan `EXCEPTION`

PostgreSQL menjelaskan bahwa secara default error dalam PL/pgSQL function membatalkan function dan surrounding transaction; error bisa ditangkap dengan `BEGIN ... EXCEPTION ... END`. ([PostgreSQL](https://www.postgresql.org/docs/current/plpgsql-control-structures.html?utm_source=chatgpt.com))

Contoh dedupe insert yang menangkap unique violation:

```sql id="k3j90h"
CREATE OR REPLACE FUNCTION create_idempotency_request(
    p_tenant_id bigint,
    p_idempotency_key text,
    p_command_name text,
    p_request_hash text
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO idempotency_request (
        tenant_id,
        idempotency_key,
        command_name,
        request_hash,
        status
    )
    VALUES (
        p_tenant_id,
        p_idempotency_key,
        p_command_name,
        p_request_hash,
        'PROCESSING'
    );

    RETURN true;

EXCEPTION
    WHEN unique_violation THEN
        RETURN false;
END;
$$;
```

Tetapi untuk kasus ini, SQL biasa lebih baik:

```sql id="0pl8c5"
INSERT INTO idempotency_request (
    tenant_id,
    idempotency_key,
    command_name,
    request_hash,
    status
)
VALUES (
    :tenantId,
    :idempotencyKey,
    :commandName,
    :requestHash,
    'PROCESSING'
)
ON CONFLICT DO NOTHING
RETURNING tenant_id;
```

Rule:

```text id="a3xlff"
Jangan pakai EXCEPTION untuk control flow jika SQL declarative seperti ON CONFLICT sudah cukup.
EXCEPTION block lebih mahal secara konseptual dan membuat flow tersembunyi.
```

Selain itu, blok dengan exception handler membentuk subtransaction; PostgreSQL menyatakan transaction tidak bisa diakhiri di dalam block seperti itu. ([PostgreSQL](https://www.postgresql.org/docs/current/plpgsql-transactions.html?utm_source=chatgpt.com))

---

# 10. Pattern 4 - BEFORE Trigger untuk Maintain `updated_at`

Trigger function:

```sql id="9g147k"
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := clock_timestamp();
    RETURN NEW;
END;
$$;
```

Trigger:

```sql id="4vgc98"
CREATE TRIGGER trg_regulatory_case__set_updated_at
BEFORE UPDATE ON regulatory_case
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
```

PostgreSQL trigger function untuk data changes harus mengembalikan `trigger`, dan special variables seperti `NEW`, `OLD`, `TG_OP`, `TG_NAME`, dan lain-lain tersedia di trigger function. ([PostgreSQL](https://www.postgresql.org/docs/current/plpgsql-trigger.html?utm_source=chatgpt.com))

Kapan cocok:

```text id="3t510c"
1. updated_at harus konsisten untuk semua update
2. banyak writer menulis table yang sama
3. developer sering lupa set timestamp
```

Kapan tidak cocok:

```text id="pugdl9"
1. ingin explicit timestamp dari aplikasi
2. butuh deterministic timestamp untuk testing
3. update massal dan clock_timestamp per row tidak diinginkan
```

---

# 11. Pattern 5 - BEFORE Trigger untuk Validation

Contoh: case tidak boleh berpindah dari `CLOSED` ke status lain.

```sql id="3h9qj9"
CREATE OR REPLACE FUNCTION validate_case_status_transition()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'UPDATE'
       AND OLD.status = 'CLOSED'
       AND NEW.status <> 'CLOSED' THEN
        RAISE EXCEPTION 'Closed case cannot be reopened: %', OLD.case_id
            USING ERRCODE = 'P0001',
                  DETAIL = 'CLOSED is terminal status';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_regulatory_case__validate_status_transition
BEFORE UPDATE OF status ON regulatory_case
FOR EACH ROW
EXECUTE FUNCTION validate_case_status_transition();
```

Cocok untuk:

```text id="8af02z"
terminal status
immutable field
cross-writer invariant
basic lifecycle guard
```

Tapi jika transition matrix kompleks, lebih baik pakai:

```text id="ghr8el"
1. transition reference table
2. guarded update in command
3. service-level workflow validation
4. optional trigger sebagai final safety net
```

---

# 12. Pattern 6 - BEFORE Trigger untuk Immutable Field

Misalnya `case_number` tidak boleh diubah setelah dibuat.

```sql id="0vr0ug"
CREATE OR REPLACE FUNCTION prevent_case_number_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.case_number IS DISTINCT FROM OLD.case_number THEN
        RAISE EXCEPTION 'case_number cannot be changed'
            USING ERRCODE = 'P0001',
                  DETAIL = 'case_number is immutable after creation';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_regulatory_case__immutable_case_number
BEFORE UPDATE OF case_number ON regulatory_case
FOR EACH ROW
EXECUTE FUNCTION prevent_case_number_change();
```

Rule praktis:

```text id="ay47nq"
Immutable business fields yang legal/audit-critical layak punya DB trigger,
bukan hanya Java setter policy.
```

---

# 13. Pattern 7 - AFTER Trigger untuk Audit Log

Audit trigger otomatis mencatat perubahan status.

Audit table:

```sql id="m45e4w"
CREATE TABLE case_status_audit (
    tenant_id     bigint NOT NULL,
    audit_id      bigint GENERATED ALWAYS AS IDENTITY,
    case_id       uuid NOT NULL,
    from_status   text,
    to_status     text NOT NULL,
    changed_by    text,
    changed_at    timestamptz NOT NULL DEFAULT clock_timestamp(),
    request_id    text,
    metadata      jsonb NOT NULL DEFAULT '{}'::jsonb,

    CONSTRAINT pk_case_status_audit
        PRIMARY KEY (tenant_id, audit_id)
);
```

Trigger function:

```sql id="jft4qa"
CREATE OR REPLACE FUNCTION audit_case_status_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'UPDATE'
       AND NEW.status IS DISTINCT FROM OLD.status THEN

        INSERT INTO case_status_audit (
            tenant_id,
            case_id,
            from_status,
            to_status,
            changed_by,
            request_id,
            metadata
        )
        VALUES (
            NEW.tenant_id,
            NEW.case_id,
            OLD.status,
            NEW.status,
            current_setting('app.actor_id', true),
            current_setting('app.request_id', true),
            jsonb_build_object(
                'trigger', TG_NAME,
                'operation', TG_OP
            )
        );
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_regulatory_case__audit_status_change
AFTER UPDATE OF status ON regulatory_case
FOR EACH ROW
EXECUTE FUNCTION audit_case_status_change();
```

Aplikasi set context:

```sql id="6jm6qd"
SET LOCAL app.actor_id = 'user-123';
SET LOCAL app.request_id = 'req-abc-123';
```

Kelebihan:

```text id="n8ocle"
1. semua writer otomatis diaudit
2. audit ikut rollback jika transaksi gagal
3. audit tidak bergantung developer ingat insert manual
```

Risiko:

```text id="zvru9d"
1. side effect tersembunyi dari mapper
2. sulit tahu dari Java bahwa audit dibuat
3. bulk update bisa membuat banyak audit row
4. current_setting context harus konsisten diset
```

---

# 14. Trigger Timing: BEFORE vs AFTER

| Trigger | Cocok untuk | Return |
|---|---|---|
| `BEFORE INSERT/UPDATE` | modify `NEW`, validation, default derived value | `RETURN NEW` atau `NULL` untuk skip row |
| `AFTER INSERT/UPDATE/DELETE` | audit, outbox, derived side effect setelah row berubah | return value diabaikan untuk row-level AFTER |
| `INSTEAD OF` | view update behavior | digunakan pada view |
| Statement-level | batch audit/check once per statement | tidak per-row |
| Row-level | audit/validation per row | bisa mahal untuk batch besar |

PostgreSQL `CREATE TRIGGER` mendefinisikan timing `BEFORE`, `AFTER`, atau `INSTEAD OF`, event seperti `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, serta row-level atau statement-level trigger. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createtrigger.html?utm_source=chatgpt.com))

---

# 15. Pattern 8 - Outbox Trigger: Gunakan Hati-Hati

Trigger bisa insert outbox saat status berubah.

```sql id="4cvmmn"
CREATE OR REPLACE FUNCTION outbox_case_status_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
        INSERT INTO outbox_event (
            tenant_id,
            outbox_id,
            aggregate_type,
            aggregate_id,
            event_type,
            payload,
            status
        )
        VALUES (
            NEW.tenant_id,
            uuidv7(),
            'REGULATORY_CASE',
            NEW.case_id,
            'CASE_STATUS_CHANGED',
            jsonb_build_object(
                'caseId', NEW.case_id,
                'fromStatus', OLD.status,
                'toStatus', NEW.status,
                'version', NEW.version
            ),
            'NEW'
        );
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_regulatory_case__outbox_status_change
AFTER UPDATE OF status ON regulatory_case
FOR EACH ROW
EXECUTE FUNCTION outbox_case_status_change();
```

Kapan cocok:

```text id="8ta1y2"
1. setiap status change wajib punya event
2. banyak writer bisa update status
3. event payload sederhana
4. outbox semantics stabil
```

Kapan lebih baik manual insert di service:

```text id="drac93"
1. event tergantung command/action, bukan hanya row diff
2. payload butuh data dari banyak source
3. ada beberapa jenis event berbeda untuk status yang sama
4. developer perlu visibility eksplisit di command handler
```

Rule:

```text id="hrrvvl"
Audit trigger lebih sering aman.
Outbox trigger harus sangat hati-hati karena event semantics adalah contract antar-service.
```

---

# 16. Pattern 9 - Statement-Level Trigger dengan Transition Table

Untuk audit batch, row-level trigger bisa terlalu mahal atau terlalu verbose. PostgreSQL mendukung transition relations untuk AFTER triggers dengan `REFERENCING OLD TABLE` atau `NEW TABLE` pada statement-level trigger. `CREATE TRIGGER` mendokumentasikan opsi `REFERENCING` untuk old/new transition relations pada trigger tertentu. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createtrigger.html?utm_source=chatgpt.com))

Contoh audit jumlah row batch update:

```sql id="xyywge"
CREATE TABLE bulk_case_update_audit (
    audit_id      bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id     bigint,
    operation     text NOT NULL,
    affected_rows bigint NOT NULL,
    actor_id      text,
    occurred_at   timestamptz NOT NULL DEFAULT clock_timestamp()
);
```

Trigger function:

```sql id="qnj2hu"
CREATE OR REPLACE FUNCTION audit_bulk_case_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_count bigint;
    v_tenant_id bigint;
BEGIN
    SELECT count(*), min(tenant_id)
    INTO v_count, v_tenant_id
    FROM new_rows;

    INSERT INTO bulk_case_update_audit (
        tenant_id,
        operation,
        affected_rows,
        actor_id
    )
    VALUES (
        v_tenant_id,
        TG_OP,
        v_count,
        current_setting('app.actor_id', true)
    );

    RETURN NULL;
END;
$$;
```

Trigger:

```sql id="19lxze"
CREATE TRIGGER trg_regulatory_case__bulk_update_audit
AFTER UPDATE ON regulatory_case
REFERENCING NEW TABLE AS new_rows
FOR EACH STATEMENT
EXECUTE FUNCTION audit_bulk_case_update();
```

Cocok untuk:

```text id="e0thjo"
1. audit batch operation
2. aggregate-level logging
3. menghindari audit row per row pada batch administratif
```

---

# 17. Procedure untuk Batch / Maintenance

Procedure dibuat dengan `CREATE PROCEDURE` dan dipanggil dengan `CALL`. Function biasanya lebih cocok untuk normal query/mutation returning result, sedangkan procedure cocok untuk routine operasional/batch.

Contoh procedure cleanup idempotency cache:

```sql id="hu0t3i"
CREATE OR REPLACE PROCEDURE cleanup_idempotency_request(
    p_before timestamptz,
    p_limit integer DEFAULT 10000
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_deleted integer;
BEGIN
    DELETE FROM idempotency_request
    WHERE ctid IN (
        SELECT ctid
        FROM idempotency_request
        WHERE created_at < p_before
          AND status IN ('COMPLETED', 'FAILED')
        ORDER BY created_at
        LIMIT p_limit
    );

    GET DIAGNOSTICS v_deleted = ROW_COUNT;

    RAISE NOTICE 'Deleted % idempotency rows before %', v_deleted, p_before;
END;
$$;
```

Call:

```sql id="c5hoxx"
CALL cleanup_idempotency_request(
    clock_timestamp() - interval '30 days',
    5000
);
```

PostgreSQL PL/pgSQL transaction management punya aturan khusus: transaction control dapat dilakukan dalam `CALL` atau `DO` dari top level tertentu, tetapi tidak secara sembarang dari function; block dengan exception handler juga membentuk subtransaction sehingga transaksi tidak bisa diakhiri di dalam block tersebut. ([PostgreSQL](https://www.postgresql.org/docs/current/plpgsql-transactions.html?utm_source=chatgpt.com))

Practical rule:

```text id="e4yjo1"
Untuk HTTP request Java/Jersey:
biarkan Java service mengontrol transaction boundary.

Untuk admin/batch/maintenance:
procedure bisa berguna, tetapi pahami aturan CALL dan transaction control.
```

---

# 18. Transaction Behavior: Function vs Procedure

| Behavior | Function | Procedure |
|---|---|---|
| Dipanggil dari SQL expression | Ya | Tidak |
| Dipanggil dengan `CALL` | Tidak | Ya |
| Umum dipakai dari mapper result | Ya | Bisa, tapi kurang natural |
| Commit/rollback internal | Tidak untuk function biasa | Bisa dalam kondisi tertentu |
| Cocok untuk OLTP command returning row | Ya | Biasanya function/query lebih nyaman |
| Cocok untuk maintenance batch | Bisa, tapi procedure lebih natural | Ya |

PL/pgSQL `BEGIN ... END` adalah block procedural, bukan transaction `BEGIN`; untuk transaction boundary aplikasi, jangan disamakan dengan block PL/pgSQL. Dokumentasi current menyatakan PL/pgSQL punya transaction management rules khusus dan exception block membentuk subtransaction. ([PostgreSQL](https://www.postgresql.org/docs/current/plpgsql-transactions.html?utm_source=chatgpt.com))

---

# 19. Security Definer: Powerful tapi Berisiko

Function default-nya berjalan dengan privilege caller. `SECURITY DEFINER` membuat function berjalan dengan privilege owner function. Ini berguna untuk controlled access, tapi berbahaya jika `search_path` tidak dikunci.

Contoh aman-ish:

```sql id="um1hcq"
CREATE OR REPLACE FUNCTION app_submit_case(
    p_tenant_id bigint,
    p_case_id uuid,
    p_actor_id text,
    p_expected_version bigint
)
RETURNS TABLE (
    tenant_id bigint,
    case_id uuid,
    status text,
    version bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    UPDATE regulatory_case c
    SET status = 'SUBMITTED',
        version = c.version + 1,
        updated_by = p_actor_id,
        updated_at = clock_timestamp()
    WHERE c.tenant_id = p_tenant_id
      AND c.case_id = p_case_id
      AND c.status = 'DRAFT'
      AND c.version = p_expected_version
    RETURNING c.tenant_id, c.case_id, c.status, c.version;
END;
$$;
```

Rule:

```text id="p28v0p"
Gunakan SECURITY DEFINER hanya jika benar-benar perlu.
Selalu set search_path.
Grant EXECUTE secara eksplisit.
Jangan membuat function definer yang menerima SQL fragment bebas.
```

Grant:

```sql id="89obf0"
REVOKE ALL ON FUNCTION app_submit_case(bigint, uuid, text, bigint) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION app_submit_case(bigint, uuid, text, bigint)
TO app_runtime_role;
```

---

# 20. Observability dalam PL/pgSQL

Gunakan `RAISE NOTICE` secukupnya untuk admin/batch, bukan untuk hot OLTP path.

```sql id="5sc2c4"
RAISE NOTICE 'Processing tenant %, batch %', p_tenant_id, p_batch_id;
```

Untuk error:

```sql id="o8aonw"
RAISE EXCEPTION 'Invalid transition from % to %', v_from_status, p_to_status
    USING ERRCODE = 'P0001',
          DETAIL = 'Transition is not allowed by ref_case_status_transition',
          HINT = 'Check transition configuration';
```

PostgreSQL `RAISE` mendukung `USING` option seperti `MESSAGE`, `DETAIL`, `HINT`, dan `ERRCODE`; `EXCEPTION` normalnya abort transaksi saat ini. ([PostgreSQL](https://www.postgresql.org/docs/current/plpgsql-errors-and-messages.html?utm_source=chatgpt.com))

Practical observability rule:

```text id="rf3fd2"
Di Java log:
- SQLSTATE
- constraint/function name jika ada
- command name
- tenant_id
- aggregate id
- correlation_id
- elapsed time
```

Jangan hanya log “database error”.

---

# 21. PL/pgSQL dan Set-Based Thinking

Anti-pattern paling umum:

```sql id="08iqam"
FOR r IN SELECT * FROM regulatory_case WHERE status = 'DRAFT'
LOOP
    UPDATE regulatory_case
    SET status = 'EXPIRED'
    WHERE case_id = r.case_id;
END LOOP;
```

Lebih baik:

```sql id="x7w2dn"
UPDATE regulatory_case
SET status = 'EXPIRED',
    updated_at = clock_timestamp()
WHERE status = 'DRAFT'
  AND created_at < clock_timestamp() - interval '30 days';
```

Rule:

```text id="mg9dz4"
PostgreSQL kuat di set-based SQL.
PL/pgSQL loop dipakai jika benar-benar perlu procedural branching,
bukan mengganti UPDATE/INSERT set-based.
```

---

# 22. Testing PL/pgSQL

Minimal test via SQL:

```sql id="6a52df"
BEGIN;

INSERT INTO regulatory_case (
    tenant_id,
    case_id,
    case_number,
    status,
    title,
    version,
    updated_by
)
VALUES (
    1001,
    '019535d9-3df7-79fb-b466-fa907fa17f9e',
    'CASE-2026-0001',
    'DRAFT',
    'PL/pgSQL test case',
    0,
    'test-user'
);

SELECT *
FROM submit_case(
    1001,
    '019535d9-3df7-79fb-b466-fa907fa17f9e',
    'test-user',
    0
);

SELECT *
FROM case_status_history
WHERE tenant_id = 1001
  AND case_id = '019535d9-3df7-79fb-b466-fa907fa17f9e';

ROLLBACK;
```

Test negative:

```sql id="e1rnhx"
SELECT *
FROM submit_case(
    1001,
    '019535d9-3df7-79fb-b466-fa907fa17f9e',
    'test-user',
    0
);
```

Expected jika sudah submitted:

```text id="9qmyt5"
0 row atau custom exception,
tergantung function design.
```

---

# 23. Versioning dan Migration Function

Gunakan `CREATE OR REPLACE FUNCTION` untuk perubahan body yang tidak mengubah signature.

```sql id="wvowht"
CREATE OR REPLACE FUNCTION submit_case(...)
RETURNS TABLE (...)
LANGUAGE plpgsql
AS $$
...
$$;
```

Jika signature berubah, buat function baru atau migration bertahap:

```text id="g5t0rd"
submit_case_v1(...)
submit_case_v2(...)
deploy app using v2
remove v1 after no callers
```

Jangan drop function yang masih dipakai trigger/view/mapper.

PostgreSQL mendokumentasikan bahwa drop dan recreate function menghasilkan object berbeda dan bisa memutus object yang mereferensikan function lama; `CREATE OR REPLACE FUNCTION` digunakan untuk mengganti definisi tanpa memutus object yang merujuk function tersebut. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createfunction.html?utm_source=chatgpt.com))

---

# 24. MyBatis Procedure Call

Procedure:

```sql id="mhs5oi"
CREATE OR REPLACE PROCEDURE mark_old_jobs_failed(
    p_before timestamptz,
    p_limit integer
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE workflow_job
    SET status = 'FAILED'
    WHERE job_id IN (
        SELECT job_id
        FROM workflow_job
        WHERE status = 'PROCESSING'
          AND locked_at < p_before
        ORDER BY locked_at
        LIMIT p_limit
    );
END;
$$;
```

MyBatis:

```xml id="kkz3fy"
<update id="markOldJobsFailed">
  CALL mark_old_jobs_failed(
      #{before},
      #{limit}
  )
</update>
```

Mapper:

```java id="4f4m89"
public interface JobMaintenanceMapper {
    void markOldJobsFailed(
        @Param("before") OffsetDateTime before,
        @Param("limit") int limit
    );
}
```

Untuk procedure yang perlu result, sering lebih mudah gunakan function returning table daripada procedure, karena mapping result set lebih natural.

---

# 25. PL/pgSQL Error Mapping ke Java

Helper SQLSTATE:

```java id="omz8ut"
public final class SqlStateUtil {
    private SqlStateUtil() {}

    public static Optional<String> findSqlState(Throwable error) {
        Throwable current = error;

        while (current != null) {
            if (current instanceof SQLException sqlException) {
                return Optional.ofNullable(sqlException.getSQLState());
            }
            current = current.getCause();
        }

        return Optional.empty();
    }
}
```

Mapper:

```java id="2nfx83"
public RuntimeException mapDatabaseError(RuntimeException error) {
    String sqlState = SqlStateUtil.findSqlState(error).orElse(null);

    if (sqlState == null) {
        return error;
    }

    return switch (sqlState) {
        case "P0001" -> new BusinessConflictException(
            "Business rule violation", error
        );
        case "P0002" -> new NotFoundException(
            "Requested data was not found", error
        );
        case "23505" -> new BusinessConflictException(
            "Duplicate data", error
        );
        case "23514" -> new BadRequestException(
            "Invalid data", error
        );
        default -> error;
    };
}
```

Rule:

```text id="cvugz9"
Custom PL/pgSQL exception harus punya mapping yang disepakati.
Kalau tidak, aplikasi akan melihat semuanya sebagai 500.
```

---

# 26. Practical Patterns by Use Case

| Use case | Recommended DB pattern |
|---|---|
| Generate case number | Function |
| Maintain updated_at | BEFORE trigger atau explicit app update |
| Audit status change | AFTER trigger atau service insert |
| Insert outbox event | Service insert; trigger hanya jika event semantics sangat stabil |
| Validate immutable field | BEFORE trigger |
| Validate one active row | Partial unique index, bukan trigger |
| Validate no-overlap period | Exclusion constraint, bukan trigger |
| Submit command | Guarded SQL or function returning table |
| Batch cleanup | Procedure/job |
| Complex workflow | Java/Camunda/service orchestration, not PL/pgSQL monolith |
| Retry handling | Java service transaction wrapper |

---

# 27. Anti-Pattern

## Anti-pattern 1 - Trigger dengan side effect tidak terlihat

```text id="v2217q"
UPDATE regulatory_case SET status = 'APPROVED'
```

Ternyata trigger:

```text id="bv39th"
- insert audit
- insert outbox
- update summary
- call extension
- mutate unrelated table
```

Masalah:

```text id="4n1nnh"
developer tidak tahu dampak update
bulk update meledakkan side effect
debugging sulit
test tidak jelas
```

Solusi:

```text id="p9z1j8"
Batasi trigger untuk invariant/audit yang jelas.
Dokumentasikan trigger sebagai bagian dari table contract.
```

---

## Anti-pattern 2 - PL/pgSQL loop menggantikan SQL set-based

Buruk:

```text id="xdbq2r"
loop 100000 row
update satu per satu
```

Lebih baik:

```text id="66z319"
single UPDATE set-based
atau chunked batch jika terlalu besar
```

---

## Anti-pattern 3 - Function melakukan authorization penuh

Authorization biasanya butuh context aplikasi, role, policy, request info.

Lebih baik:

```text id="mhvggf"
Java/Jersey:
- authentication
- authorization
- command validation

PostgreSQL:
- tenant boundary
- constraint
- transaction mutation
- optional RLS/trigger safety
```

---

## Anti-pattern 4 - Procedure dipanggil dari HTTP untuk long-running operation

Buruk:

```text id="829duf"
HTTP request
CALL recalculate_all_cases()
wait 10 minutes
```

Lebih baik:

```text id="nrazjd"
HTTP creates job
worker runs procedure/function in chunks
status tracked in job table
```

---

## Anti-pattern 5 - SECURITY DEFINER tanpa `search_path`

Berbahaya karena object resolution bisa dimanipulasi jika search path tidak dikunci.

Lebih aman:

```sql id="qj8mep"
SECURITY DEFINER
SET search_path = public, pg_temp
```

---

# 28. Production Checklist PL/pgSQL

| Checklist | Pertanyaan |
|---|---|
| Need DB logic? | Apakah logic memang harus dekat data? |
| Simplicity | Apakah function pendek dan jelas? |
| Set-based | Apakah tidak loop row-by-row tanpa alasan? |
| Transaction clarity | Apakah Java tetap mengontrol boundary untuk HTTP command? |
| Error mapping | Apakah `RAISE EXCEPTION` punya SQLSTATE/mapping? |
| Trigger visibility | Apakah trigger terdokumentasi sebagai table contract? |
| Audit safety | Apakah trigger audit tidak bocor context actor/request? |
| Outbox semantics | Apakah outbox trigger benar-benar stabil? |
| Security | Apakah `SECURITY DEFINER` dikunci search_path? |
| Migration | Apakah function signature tidak merusak caller? |
| Testability | Apakah ada SQL tests untuk success/failure? |
| Observability | Apakah app log SQLSTATE/function/tenant/correlation? |
| Performance | Apakah function tidak menahan lock terlalu lama? |
| Bulk behavior | Apakah trigger aman untuk batch update? |

---

# 29. Mini Lab

## Step 1 - Setup table

```sql id="ij1w1j"
CREATE TABLE regulatory_case (
    tenant_id     bigint NOT NULL,
    case_id       uuid NOT NULL DEFAULT uuidv7(),
    case_number   text NOT NULL,
    status        text NOT NULL,
    title         text NOT NULL,
    version       bigint NOT NULL DEFAULT 0,
    submitted_at  timestamptz,
    updated_by    text NOT NULL,
    updated_at    timestamptz NOT NULL DEFAULT clock_timestamp(),
    deleted_at    timestamptz,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number)
);

CREATE TABLE case_status_history (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL,
    history_id   bigint GENERATED ALWAYS AS IDENTITY,
    from_status  text,
    to_status    text NOT NULL,
    action       text NOT NULL,
    changed_by   text NOT NULL,
    changed_at   timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_case_status_history
        PRIMARY KEY (tenant_id, history_id)
);
```

## Step 2 - Create function

```sql id="5p2z9m"
CREATE OR REPLACE FUNCTION submit_case(
    p_tenant_id bigint,
    p_case_id uuid,
    p_actor_id text,
    p_expected_version bigint
)
RETURNS TABLE (
    tenant_id bigint,
    case_id uuid,
    status text,
    version bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH updated AS (
        UPDATE regulatory_case c
        SET status = 'SUBMITTED',
            submitted_at = clock_timestamp(),
            version = c.version + 1,
            updated_by = p_actor_id,
            updated_at = clock_timestamp()
        WHERE c.tenant_id = p_tenant_id
          AND c.case_id = p_case_id
          AND c.status = 'DRAFT'
          AND c.version = p_expected_version
          AND c.deleted_at IS NULL
        RETURNING c.tenant_id, c.case_id, c.status, c.version
    ),
    history AS (
        INSERT INTO case_status_history (
            tenant_id,
            case_id,
            from_status,
            to_status,
            action,
            changed_by
        )
        SELECT
            u.tenant_id,
            u.case_id,
            'DRAFT',
            u.status,
            'SUBMIT',
            p_actor_id
        FROM updated u
        RETURNING tenant_id, case_id
    )
    SELECT
        u.tenant_id,
        u.case_id,
        u.status,
        u.version
    FROM updated u;
END;
$$;
```

## Step 3 - Insert draft

```sql id="7d3zar"
INSERT INTO regulatory_case (
    tenant_id,
    case_id,
    case_number,
    status,
    title,
    updated_by
)
VALUES (
    1001,
    '019535d9-3df7-79fb-b466-fa907fa17f9e',
    'CASE-2026-0001',
    'DRAFT',
    'PL/pgSQL practical lab',
    'user-001'
);
```

## Step 4 - Submit

```sql id="62xh97"
SELECT *
FROM submit_case(
    1001,
    '019535d9-3df7-79fb-b466-fa907fa17f9e',
    'user-001',
    0
);
```

Expected:

```text id="h14rfp"
1 row returned.
status = SUBMITTED.
version = 1.
history row inserted.
```

## Step 5 - Submit ulang

```sql id="xevws1"
SELECT *
FROM submit_case(
    1001,
    '019535d9-3df7-79fb-b466-fa907fa17f9e',
    'user-001',
    0
);
```

Expected:

```text id="7n96yc"
0 row returned.
Aplikasi map ke 409 Conflict.
```

---

## 30. Ringkasan Praktis

```text id="kf7d37"
1. PL/pgSQL cocok untuk invariant, audit, stored operation pendek, dan batch routine.
2. Jangan memindahkan seluruh workflow aplikasi ke PL/pgSQL.
3. Function cocok untuk operasi yang mengembalikan result dan dipanggil dari MyBatis.
4. Procedure cocok untuk maintenance/batch/admin routine.
5. Trigger cocok untuk audit/validation otomatis, tapi harus terdokumentasi.
6. BEFORE trigger cocok untuk modify NEW/validation.
7. AFTER trigger cocok untuk audit/outbox-like insert setelah row berubah.
8. RAISE EXCEPTION harus punya SQLSTATE/mapping yang jelas.
9. EXCEPTION block membentuk subtransaction; jangan pakai sembarangan untuk control flow.
10. Untuk HTTP command, Java service sebaiknya tetap mengontrol transaction boundary.
11. Gunakan set-based SQL; hindari loop row-by-row jika tidak perlu.
12. SECURITY DEFINER harus dikunci dengan search_path dan grant yang ketat.
```

---

# Status Seri

**Seri 11/22 selesai.**

Rekomendasi lanjut ke:

**Seri 12 - Audit Trail, History Table, Temporal Validity, Lifecycle State Tracking, dan Regulatory Defensibility Pattern untuk PostgreSQL OLTP.**

---

**Sources:**

- [Documentation: 18: 41.10. Trigger Functions](https://www.postgresql.org/docs/current/plpgsql-trigger.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:28:29 PM

Saya lanjut ke **Seri 12/22**. Fokusnya audit dan defensibility: bagaimana menyimpan current state, history, audit log, temporal validity, snapshot keputusan, dan evidence trail agar perubahan state bisa dipertanggungjawabkan.

# PostgreSQL OLTP - Seri 12/22  
## Audit Trail, History Table, Temporal Validity, Lifecycle State Tracking, dan Regulatory Defensibility Pattern

Seri ini fokus pada pertanyaan praktis:

```text
Kalau suatu keputusan, status, assignment, rule, atau data penting berubah,
apakah kita bisa menjelaskan:
- apa yang berubah?
- dari nilai apa ke nilai apa?
- siapa yang mengubah?
- kapan?
- lewat request/proses apa?
- berdasarkan rule versi apa?
- apakah data saat keputusan dibuat masih bisa direkonstruksi?
```

Untuk sistem regulatori, enforcement, workflow approval, payment-like operation, atau case management, audit bukan fitur tambahan. Audit adalah bagian dari **data correctness dan defensibility**.

PostgreSQL menyediakan fondasi yang relevan: constraint, trigger, `RETURNING`, `jsonb`, range type, generated column, row-level security, dan statistics/monitoring. `RETURNING` pada `INSERT`, `UPDATE`, `DELETE`, dan `MERGE` berguna untuk mengambil row hasil mutation tanpa query tambahan, terutama ketika row yang berubah perlu langsung dipakai untuk audit/history/outbox. ([PostgreSQL](https://www.postgresql.org/docs/current/dml-returning.html?utm_source=chatgpt.com))

---

## 1. Mental Model

```text
Audit & History Model
│
├─ Current State
│  ├─ regulatory_case.status
│  ├─ workflow_task.status
│  ├─ assignment.current_assignee
│  └─ decision.current_outcome
│
├─ State History
│  ├─ from_status
│  ├─ to_status
│  ├─ action
│  ├─ actor
│  └─ changed_at
│
├─ Change Audit
│  ├─ operation
│  ├─ changed fields
│  ├─ before snapshot
│  ├─ after snapshot
│  ├─ request_id
│  └─ correlation_id
│
├─ Temporal Validity
│  ├─ valid_from
│  ├─ valid_to
│  ├─ effective rule version
│  ├─ assignment period
│  └─ no-overlap invariant
│
├─ Decision Snapshot
│  ├─ rule code snapshot
│  ├─ rule version snapshot
│  ├─ severity snapshot
│  ├─ amount snapshot
│  └─ evidence snapshot
│
├─ Integration Trail
│  ├─ outbox_event
│  ├─ inbox_event
│  ├─ external_reference
│  └─ delivery attempt
│
└─ Defensibility
   ├─ reproducible timeline
   ├─ immutable core audit
   ├─ actor attribution
   ├─ tenant boundary
   ├─ retention policy
   └─ operational evidence
```

Rule utama:

```text
Current table menjawab: “state sekarang apa?”
History table menjawab: “bagaimana state sampai ke sini?”
Audit table menjawab: “siapa mengubah apa, kapan, dan lewat proses apa?”
Snapshot menjawab: “keputusan dulu dibuat berdasarkan data/rule apa saat itu?”
```

---

## 2. Audit Pattern Decision Table

| Kebutuhan | Pattern | Contoh |
|---|---|---|
| Query state saat ini cepat | Current state column | `regulatory_case.status` |
| Timeline lifecycle | Status history table | `case_status_history` |
| Field-level forensic | Audit log with before/after | `case_audit_log` |
| Rule berubah seiring waktu | Effective-dated reference | `ref_rule_version.valid_period` |
| Keputusan historis stabil | Decision snapshot | `severity_snapshot`, `rule_version_snapshot` |
| Integrasi event after commit | Outbox table | `outbox_event` |
| Incoming event dedupe | Inbox table | `inbox_event` |
| Satu active assignment | Partial unique index/history | `released_at IS NULL` |
| No overlapping validity | Range + exclusion | `daterange`, `tstzrange` |
| Actor/request context DB-side | `SET LOCAL app.actor_id` | trigger audit |
| Tenant isolation | `tenant_id`, optional RLS | PostgreSQL RLS can restrict rows per user/query. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-rowsecurity.html?utm_source=chatgpt.com)) |

---

## 3. Current State vs History vs Audit

Jangan pakai satu table untuk semua tujuan.

### Current state

```sql
CREATE TABLE regulatory_case (
    tenant_id     bigint NOT NULL,
    case_id       uuid NOT NULL DEFAULT uuidv7(),
    case_number   text NOT NULL,
    status        text NOT NULL,
    title         text NOT NULL,
    version       bigint NOT NULL DEFAULT 0,
    submitted_at  timestamptz,
    approved_at   timestamptz,
    closed_at     timestamptz,
    created_by    text NOT NULL,
    created_at    timestamptz NOT NULL DEFAULT clock_timestamp(),
    updated_by    text NOT NULL,
    updated_at    timestamptz NOT NULL DEFAULT clock_timestamp(),
    deleted_at    timestamptz,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number),

    CONSTRAINT chk_regulatory_case__status
        CHECK (status IN (
            'DRAFT',
            'SUBMITTED',
            'UNDER_REVIEW',
            'APPROVED',
            'REJECTED',
            'CLOSED'
        ))
);
```

Current table harus kecil dan cepat untuk OLTP read/write.

### Status history

```sql
CREATE TABLE case_status_history (
    tenant_id      bigint NOT NULL,
    case_id        uuid NOT NULL,
    history_id     bigint GENERATED ALWAYS AS IDENTITY,
    from_status    text,
    to_status      text NOT NULL,
    action         text NOT NULL,
    reason         text,
    changed_by     text NOT NULL,
    changed_at     timestamptz NOT NULL DEFAULT clock_timestamp(),
    request_id     text,
    correlation_id text,

    CONSTRAINT pk_case_status_history
        PRIMARY KEY (tenant_id, history_id),

    CONSTRAINT fk_case_status_history__case
        FOREIGN KEY (tenant_id, case_id)
        REFERENCES regulatory_case (tenant_id, case_id)
);
```

### Audit log

```sql
CREATE TABLE case_audit_log (
    tenant_id      bigint NOT NULL,
    audit_id       bigint GENERATED ALWAYS AS IDENTITY,
    case_id        uuid NOT NULL,
    event_type     text NOT NULL,
    operation      text NOT NULL,
    actor_id       text,
    actor_type     text,
    occurred_at    timestamptz NOT NULL DEFAULT clock_timestamp(),
    request_id     text,
    correlation_id text,
    before_state   jsonb,
    after_state    jsonb,
    metadata       jsonb NOT NULL DEFAULT '{}'::jsonb,

    CONSTRAINT pk_case_audit_log
        PRIMARY KEY (tenant_id, audit_id),

    CONSTRAINT fk_case_audit_log__case
        FOREIGN KEY (tenant_id, case_id)
        REFERENCES regulatory_case (tenant_id, case_id),

    CONSTRAINT chk_case_audit_log__metadata_object
        CHECK (jsonb_typeof(metadata) = 'object')
);
```

`jsonb` cocok untuk snapshot/audit metadata karena struktur audit bisa berkembang, tetapi field yang sering difilter seperti `tenant_id`, `case_id`, `event_type`, `occurred_at`, `actor_id`, dan `correlation_id` sebaiknya tetap relational column.

---

## 4. Pattern 1 - Lifecycle State Tracking

Command submit case:

```sql
WITH updated AS (
    UPDATE regulatory_case c
    SET status = 'SUBMITTED',
        submitted_at = clock_timestamp(),
        version = c.version + 1,
        updated_by = :actorId,
        updated_at = clock_timestamp()
    WHERE c.tenant_id = :tenantId
      AND c.case_id = :caseId
      AND c.status = 'DRAFT'
      AND c.version = :expectedVersion
      AND c.deleted_at IS NULL
    RETURNING
        c.tenant_id,
        c.case_id,
        'DRAFT'::text AS from_status,
        c.status AS to_status,
        c.version,
        c.submitted_at
),
history AS (
    INSERT INTO case_status_history (
        tenant_id,
        case_id,
        from_status,
        to_status,
        action,
        reason,
        changed_by,
        request_id,
        correlation_id
    )
    SELECT
        tenant_id,
        case_id,
        from_status,
        to_status,
        'SUBMIT',
        :reason,
        :actorId,
        :requestId,
        :correlationId
    FROM updated
    RETURNING tenant_id, case_id, history_id
)
SELECT
    tenant_id,
    case_id,
    to_status AS status,
    version,
    submitted_at
FROM updated;
```

Interpretasi:

| Result | Meaning |
|---|---|
| 1 row | Status berubah dan history masuk |
| 0 row | State/version tidak valid, map ke `409 Conflict` |
| Exception | Constraint/invariant dilanggar |

Pattern ini bagus karena `UPDATE ... RETURNING` membuat state yang benar-benar berubah langsung dipakai untuk insert history tanpa query ulang. PostgreSQL mendukung `RETURNING` pada DML untuk mengambil row hasil mutation dan menghindari query tambahan. ([PostgreSQL](https://www.postgresql.org/docs/current/dml-returning.html?utm_source=chatgpt.com))

---

## 5. Pattern 2 - Audit Log Manual di Service Transaction

Untuk audit yang semantics-nya bergantung command, lebih eksplisit jika audit diinsert dari service transaction.

```sql
INSERT INTO case_audit_log (
    tenant_id,
    case_id,
    event_type,
    operation,
    actor_id,
    actor_type,
    request_id,
    correlation_id,
    before_state,
    after_state,
    metadata
)
VALUES (
    :tenantId,
    :caseId,
    'CASE_SUBMITTED',
    'UPDATE',
    :actorId,
    'USER',
    :requestId,
    :correlationId,
    :beforeState::jsonb,
    :afterState::jsonb,
    jsonb_build_object(
        'command', 'SubmitCase',
        'source', 'case-api',
        'ipAddress', :ipAddress
    )
);
```

Service transaction shape:

```text
BEGIN
  SET LOCAL app.actor_id = ...
  SET LOCAL app.request_id = ...

  guarded update current state
  insert status history
  insert audit log
  insert outbox event
COMMIT
```

Kelebihan manual audit:

```text
1. command intent jelas
2. payload bisa command-specific
3. mudah dites dari service layer
4. tidak ada hidden side effect
```

Kekurangan:

```text
1. developer bisa lupa insert audit
2. writer selain service bisa bypass
3. perlu review discipline
```

---

## 6. Pattern 3 - Audit Trigger untuk Cross-Writer Safety

Jika semua update status harus selalu diaudit, trigger bisa menjadi safety net.

Trigger function PostgreSQL memakai special variables seperti `NEW`, `OLD`, dan `TG_OP`; untuk `INSERT`/`UPDATE`, trigger function dapat mengembalikan `NEW`, sedangkan untuk `DELETE` dapat mengembalikan `OLD`. ([PostgreSQL](https://www.postgresql.org/docs/current/plpgsql-trigger.html?utm_source=chatgpt.com))

```sql
CREATE OR REPLACE FUNCTION audit_case_status_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'UPDATE'
       AND NEW.status IS DISTINCT FROM OLD.status THEN

        INSERT INTO case_status_history (
            tenant_id,
            case_id,
            from_status,
            to_status,
            action,
            reason,
            changed_by,
            request_id,
            correlation_id
        )
        VALUES (
            NEW.tenant_id,
            NEW.case_id,
            OLD.status,
            NEW.status,
            COALESCE(current_setting('app.action', true), 'UNKNOWN'),
            current_setting('app.reason', true),
            COALESCE(current_setting('app.actor_id', true), NEW.updated_by),
            current_setting('app.request_id', true),
            current_setting('app.correlation_id', true)
        );
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_regulatory_case__audit_status_change
AFTER UPDATE OF status ON regulatory_case
FOR EACH ROW
EXECUTE FUNCTION audit_case_status_change();
```

Aplikasi set context:

```sql
SET LOCAL app.actor_id = 'user-123';
SET LOCAL app.request_id = 'req-abc';
SET LOCAL app.correlation_id = 'corr-xyz';
SET LOCAL app.action = 'SUBMIT';
SET LOCAL app.reason = 'Initial submission';
```

Kelebihan trigger:

```text
1. semua writer otomatis diaudit
2. audit ikut rollback jika transaksi gagal
3. tidak bergantung pada developer ingat insert history
```

Risiko trigger:

```text
1. side effect tersembunyi dari mapper
2. bulk update bisa menghasilkan banyak audit
3. audit context bisa kosong jika app lupa SET LOCAL
4. event semantics bisa terlalu generic
```

Rule praktis:

```text
Trigger audit bagus sebagai safety net.
Untuk event bisnis antar-service, manual outbox dari command handler sering lebih jelas.
```

---

## 7. Pattern 4 - Field-Level Change Audit

Kalau perlu tahu field apa yang berubah, simpan diff ringkas.

```sql
CREATE TABLE case_change_audit (
    tenant_id      bigint NOT NULL,
    audit_id       bigint GENERATED ALWAYS AS IDENTITY,
    case_id        uuid NOT NULL,
    operation      text NOT NULL,
    changed_fields text[] NOT NULL,
    before_state   jsonb NOT NULL,
    after_state    jsonb NOT NULL,
    actor_id       text,
    request_id     text,
    correlation_id text,
    changed_at     timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_case_change_audit
        PRIMARY KEY (tenant_id, audit_id),

    CONSTRAINT chk_case_change_audit__before_object
        CHECK (jsonb_typeof(before_state) = 'object'),

    CONSTRAINT chk_case_change_audit__after_object
        CHECK (jsonb_typeof(after_state) = 'object')
);
```

Contoh insert audit dari service:

```sql
INSERT INTO case_change_audit (
    tenant_id,
    case_id,
    operation,
    changed_fields,
    before_state,
    after_state,
    actor_id,
    request_id,
    correlation_id
)
VALUES (
    :tenantId,
    :caseId,
    'UPDATE_CASE_METADATA',
    ARRAY['title', 'priority'],
    jsonb_build_object(
        'title', :oldTitle,
        'priority', :oldPriority,
        'version', :oldVersion
    ),
    jsonb_build_object(
        'title', :newTitle,
        'priority', :newPriority,
        'version', :newVersion
    ),
    :actorId,
    :requestId,
    :correlationId
);
```

Practical rule:

```text
Audit snapshot jangan selalu menyimpan seluruh row besar.
Simpan field penting, before/after value, dan context yang cukup untuk forensic.
```

---

## 8. Pattern 5 - Current Assignment + Assignment History

Jangan hanya update `assignee_id` di case tanpa history.

### Current assignment column

```sql
ALTER TABLE regulatory_case
ADD COLUMN assignee_id text,
ADD COLUMN assigned_at timestamptz;
```

### Assignment history table

```sql
CREATE TABLE case_assignment_history (
    tenant_id       bigint NOT NULL,
    case_id         uuid NOT NULL,
    assignment_id   uuid NOT NULL DEFAULT uuidv7(),
    assignee_id     text NOT NULL,
    assigned_by     text NOT NULL,
    assigned_at     timestamptz NOT NULL DEFAULT clock_timestamp(),
    released_by     text,
    released_at     timestamptz,
    release_reason  text,

    CONSTRAINT pk_case_assignment_history
        PRIMARY KEY (tenant_id, assignment_id),

    CONSTRAINT fk_case_assignment_history__case
        FOREIGN KEY (tenant_id, case_id)
        REFERENCES regulatory_case (tenant_id, case_id)
);
```

Unique active assignment:

```sql
CREATE UNIQUE INDEX uq_case_assignment_history__one_active
ON case_assignment_history (tenant_id, case_id)
WHERE released_at IS NULL;
```

Assign command:

```sql
WITH updated_case AS (
    UPDATE regulatory_case
    SET assignee_id = :assigneeId,
        assigned_at = clock_timestamp(),
        version = version + 1,
        updated_by = :actorId,
        updated_at = clock_timestamp()
    WHERE tenant_id = :tenantId
      AND case_id = :caseId
      AND assignee_id IS NULL
      AND deleted_at IS NULL
    RETURNING tenant_id, case_id
),
assignment AS (
    INSERT INTO case_assignment_history (
        tenant_id,
        case_id,
        assignee_id,
        assigned_by
    )
    SELECT
        tenant_id,
        case_id,
        :assigneeId,
        :actorId
    FROM updated_case
    RETURNING tenant_id, case_id, assignment_id
)
SELECT *
FROM assignment;
```

Release command:

```sql
WITH released_assignment AS (
    UPDATE case_assignment_history
    SET released_by = :actorId,
        released_at = clock_timestamp(),
        release_reason = :reason
    WHERE tenant_id = :tenantId
      AND case_id = :caseId
      AND released_at IS NULL
    RETURNING tenant_id, case_id
),
updated_case AS (
    UPDATE regulatory_case c
    SET assignee_id = NULL,
        assigned_at = NULL,
        version = version + 1,
        updated_by = :actorId,
        updated_at = clock_timestamp()
    FROM released_assignment r
    WHERE c.tenant_id = r.tenant_id
      AND c.case_id = r.case_id
    RETURNING c.tenant_id, c.case_id, c.version
)
SELECT *
FROM updated_case;
```

---

## 9. Pattern 6 - Temporal Validity untuk Reference/Rule

Untuk regulasi, aturan bisa berubah per waktu. Jangan hanya menyimpan “current rule”.

```sql
CREATE TABLE ref_rule_version (
    rule_version_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rule_code       text NOT NULL,
    valid_period    daterange NOT NULL,
    severity        text NOT NULL,
    rule_payload    jsonb NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT chk_ref_rule_version__valid_period
        CHECK (NOT isempty(valid_period)),

    CONSTRAINT chk_ref_rule_version__payload_object
        CHECK (jsonb_typeof(rule_payload) = 'object')
);
```

Query rule aktif pada tanggal kejadian:

```sql
SELECT
    rule_version_id,
    rule_code,
    severity,
    rule_payload
FROM ref_rule_version
WHERE rule_code = :ruleCode
  AND valid_period @> :eventDate::date;
```

PostgreSQL mendukung range type dan operator range, yang cocok untuk validity period dan temporal rule modelling. Untuk no-overlap, biasanya range dikombinasikan dengan GiST/exclusion constraint. Generated/derived columns juga tersedia dan pada PostgreSQL 18 virtual generated columns menjadi default untuk generated columns baru. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-generated-columns.html?utm_source=chatgpt.com))

Untuk mencegah overlap antar versi rule yang sama:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE ref_rule_version
ADD CONSTRAINT ex_ref_rule_version__no_overlap
EXCLUDE USING gist (
    rule_code WITH =,
    valid_period WITH &&
);
```

Rule:

```text
Jika keputusan historis harus bisa dijelaskan,
gunakan effective-dated reference + snapshot pada transaksi keputusan.
```

---

## 10. Pattern 7 - Decision Snapshot

Keputusan tidak boleh berubah makna hanya karena reference data berubah.

```sql
CREATE TABLE case_decision (
    tenant_id              bigint NOT NULL,
    decision_id            uuid NOT NULL DEFAULT uuidv7(),
    case_id                uuid NOT NULL,
    decision_type          text NOT NULL,
    decision_status        text NOT NULL,
    decided_by             text NOT NULL,
    decided_at             timestamptz NOT NULL DEFAULT clock_timestamp(),

    rule_code_snapshot     text NOT NULL,
    rule_version_id        bigint NOT NULL,
    severity_snapshot      text NOT NULL,
    rule_payload_snapshot  jsonb NOT NULL,
    evidence_snapshot      jsonb NOT NULL DEFAULT '[]'::jsonb,

    decision_reason        text,
    version                bigint NOT NULL DEFAULT 0,

    CONSTRAINT pk_case_decision
        PRIMARY KEY (tenant_id, decision_id),

    CONSTRAINT fk_case_decision__case
        FOREIGN KEY (tenant_id, case_id)
        REFERENCES regulatory_case (tenant_id, case_id),

    CONSTRAINT fk_case_decision__rule_version
        FOREIGN KEY (rule_version_id)
        REFERENCES ref_rule_version (rule_version_id),

    CONSTRAINT chk_case_decision__rule_payload_object
        CHECK (jsonb_typeof(rule_payload_snapshot) = 'object'),

    CONSTRAINT chk_case_decision__evidence_array
        CHECK (jsonb_typeof(evidence_snapshot) = 'array')
);
```

Approve command shape:

```sql
WITH selected_rule AS (
    SELECT
        rule_version_id,
        rule_code,
        severity,
        rule_payload
    FROM ref_rule_version
    WHERE rule_code = :ruleCode
      AND valid_period @> :decisionDate::date
),
updated_case AS (
    UPDATE regulatory_case
    SET status = 'APPROVED',
        approved_at = clock_timestamp(),
        version = version + 1,
        updated_by = :actorId,
        updated_at = clock_timestamp()
    WHERE tenant_id = :tenantId
      AND case_id = :caseId
      AND status = 'UNDER_REVIEW'
      AND deleted_at IS NULL
    RETURNING tenant_id, case_id
),
inserted_decision AS (
    INSERT INTO case_decision (
        tenant_id,
        case_id,
        decision_type,
        decision_status,
        decided_by,
        rule_code_snapshot,
        rule_version_id,
        severity_snapshot,
        rule_payload_snapshot,
        evidence_snapshot,
        decision_reason
    )
    SELECT
        c.tenant_id,
        c.case_id,
        'APPROVAL',
        'FINAL',
        :actorId,
        r.rule_code,
        r.rule_version_id,
        r.severity,
        r.rule_payload,
        :evidenceSnapshot::jsonb,
        :decisionReason
    FROM updated_case c
    CROSS JOIN selected_rule r
    RETURNING tenant_id, decision_id, case_id
)
SELECT *
FROM inserted_decision;
```

Defensibility principle:

```text
FK ke rule_version menjaga referential link.
Snapshot menjaga makna keputusan pada waktu itu.
```

---

## 11. Pattern 8 - Audit Context dari Java ke PostgreSQL

Jika trigger audit digunakan, aplikasi perlu mengirim context ke session transaction.

MyBatis mapper:

```xml
<update id="setAuditContext">
  SELECT
      set_config('app.actor_id', #{actorId}, true),
      set_config('app.request_id', #{requestId}, true),
      set_config('app.correlation_id', #{correlationId}, true),
      set_config('app.action', #{action}, true)
</update>
```

`set_config(..., true)` membuat setting berlaku lokal pada current transaction. Trigger dapat membacanya dengan:

```sql
current_setting('app.actor_id', true)
```

Service pattern:

```java
public SubmitCaseResult submit(SubmitCaseCommand command) {
    try (SqlSession session = sqlSessionFactory.openSession(false)) {
        DbContextMapper context = session.getMapper(DbContextMapper.class);
        CaseMapper cases = session.getMapper(CaseMapper.class);

        context.setAuditContext(
            command.actorId(),
            command.requestId(),
            command.correlationId(),
            "SUBMIT"
        );

        SubmitCaseResult result = cases.submitCase(
            command.tenantId(),
            command.caseId(),
            command.expectedVersion()
        );

        if (result == null) {
            session.rollback();
            throw new BusinessConflictException("Case cannot be submitted");
        }

        session.commit();
        return result;
    }
}
```

Rule:

```text
Kalau trigger audit bergantung pada session context,
set context harus menjadi bagian wajib dari transaction bootstrap.
```

---

## 12. Pattern 9 - Audit Timeline Query

Timeline case biasanya gabungan status history, audit event, decision, document, assignment.

Simpler pattern: satu audit log unified.

```sql
SELECT
    audit_id,
    event_type,
    operation,
    actor_id,
    occurred_at,
    request_id,
    correlation_id,
    metadata
FROM case_audit_log
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND (
      :lastAuditId IS NULL
      OR audit_id > :lastAuditId
  )
ORDER BY audit_id ASC
LIMIT :limit;
```

Index:

```sql
CREATE INDEX idx_case_audit_log__case_timeline
ON case_audit_log (
    tenant_id,
    case_id,
    audit_id ASC
);
```

Alternative: event union view.

```sql
CREATE VIEW case_timeline_view AS
SELECT
    tenant_id,
    case_id,
    changed_at AS occurred_at,
    'STATUS_CHANGE' AS timeline_type,
    jsonb_build_object(
        'fromStatus', from_status,
        'toStatus', to_status,
        'action', action,
        'reason', reason
    ) AS payload
FROM case_status_history

UNION ALL

SELECT
    tenant_id,
    case_id,
    decided_at AS occurred_at,
    'DECISION' AS timeline_type,
    jsonb_build_object(
        'decisionId', decision_id,
        'decisionType', decision_type,
        'decisionStatus', decision_status,
        'severity', severity_snapshot
    ) AS payload
FROM case_decision;
```

Practical recommendation:

```text
Untuk timeline UI: view boleh.
Untuk audit source of truth: table asli tetap jelas dan immutable-ish.
```

---

## 13. Pattern 10 - Append-Only Audit Discipline

PostgreSQL tidak punya native “immutable table” sederhana untuk semua kasus. Gunakan kombinasi desain, privilege, trigger, dan process.

### Revoke update/delete dari app runtime

```sql
REVOKE UPDATE, DELETE ON case_audit_log FROM app_runtime_role;
GRANT INSERT, SELECT ON case_audit_log TO app_runtime_role;
```

### Optional trigger prevent update/delete

```sql
CREATE OR REPLACE FUNCTION prevent_audit_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'Audit table is append-only'
        USING ERRCODE = 'P0001',
              DETAIL = 'UPDATE/DELETE is not allowed on audit log';
END;
$$;

CREATE TRIGGER trg_case_audit_log__prevent_update
BEFORE UPDATE OR DELETE ON case_audit_log
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_mutation();
```

For emergency correction, use privileged role and correction event:

```sql
CREATE TABLE audit_correction_log (
    correction_id   uuid NOT NULL DEFAULT uuidv7(),
    tenant_id       bigint NOT NULL,
    target_table    text NOT NULL,
    target_id       text NOT NULL,
    correction_type text NOT NULL,
    reason          text NOT NULL,
    corrected_by    text NOT NULL,
    corrected_at    timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_audit_correction_log
        PRIMARY KEY (correction_id)
);
```

Rule:

```text
Audit correction should be additive, not silent overwrite.
```

---

## 14. Pattern 11 - Inbox/Outbox for Integration Audit

### Outbox event

```sql
CREATE TABLE outbox_event (
    tenant_id       bigint NOT NULL,
    outbox_id       uuid NOT NULL DEFAULT uuidv7(),
    aggregate_type  text NOT NULL,
    aggregate_id    uuid NOT NULL,
    event_type      text NOT NULL,
    event_version   integer NOT NULL DEFAULT 1,
    payload         jsonb NOT NULL,
    status          text NOT NULL DEFAULT 'NEW',
    created_at      timestamptz NOT NULL DEFAULT clock_timestamp(),
    published_at    timestamptz,
    attempt_count   integer NOT NULL DEFAULT 0,
    last_error      text,

    CONSTRAINT pk_outbox_event
        PRIMARY KEY (tenant_id, outbox_id),

    CONSTRAINT chk_outbox_event__status
        CHECK (status IN ('NEW', 'PROCESSING', 'PUBLISHED', 'FAILED'))
);

CREATE INDEX idx_outbox_event__new
ON outbox_event (tenant_id, created_at ASC, outbox_id ASC)
WHERE status = 'NEW';
```

### Inbox event for dedupe

```sql
CREATE TABLE inbox_event (
    tenant_id        bigint NOT NULL,
    source_system    text NOT NULL,
    message_id       text NOT NULL,
    event_type       text NOT NULL,
    payload          jsonb NOT NULL,
    received_at      timestamptz NOT NULL DEFAULT clock_timestamp(),
    processed_at     timestamptz,
    processing_status text NOT NULL DEFAULT 'RECEIVED',
    last_error       text,

    CONSTRAINT pk_inbox_event
        PRIMARY KEY (tenant_id, source_system, message_id),

    CONSTRAINT chk_inbox_event__status
        CHECK (processing_status IN ('RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED'))
);
```

Why this matters:

```text
Outbox proves what this service intended to publish.
Inbox proves what this service received and whether it processed it.
Together they form integration audit trail.
```

---

## 15. Pattern 12 - Temporal Table Style: Valid From / Valid To

Untuk assignment, rule, ownership, atau classification yang berlaku pada periode tertentu.

```sql
CREATE TABLE case_owner_period (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL,
    owner_id     text NOT NULL,
    valid_from   timestamptz NOT NULL,
    valid_to     timestamptz,
    assigned_by  text NOT NULL,
    reason       text,

    CONSTRAINT pk_case_owner_period
        PRIMARY KEY (tenant_id, case_id, valid_from),

    CONSTRAINT chk_case_owner_period__valid_range
        CHECK (valid_to IS NULL OR valid_to > valid_from)
);
```

Query owner pada waktu tertentu:

```sql
SELECT owner_id
FROM case_owner_period
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND valid_from <= :asOf
  AND (valid_to IS NULL OR valid_to > :asOf);
```

Range-based version:

```sql
CREATE TABLE case_owner_period_v2 (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL,
    owner_id     text NOT NULL,
    valid_period tstzrange NOT NULL,
    assigned_by  text NOT NULL,

    CONSTRAINT pk_case_owner_period_v2
        PRIMARY KEY (tenant_id, case_id, valid_period),

    CONSTRAINT chk_case_owner_period_v2__not_empty
        CHECK (NOT isempty(valid_period))
);
```

No-overlap:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE case_owner_period_v2
ADD CONSTRAINT ex_case_owner_period_v2__no_overlap
EXCLUDE USING gist (
    tenant_id WITH =,
    case_id WITH =,
    valid_period WITH &&
);
```

---

## 16. Pattern 13 - Audit Partitioning Candidate

Audit/history/outbox bisa tumbuh besar. Candidate partition:

| Table | Partition key | Reason |
|---|---|---|
| `case_audit_log` | `occurred_at` monthly | append-only, retention |
| `case_status_history` | `changed_at` monthly | timeline large |
| `outbox_event` | `created_at` monthly | worker + cleanup |
| `inbox_event` | `received_at` monthly | dedupe + retention |
| `idempotency_request` | `created_at` daily/monthly | cleanup |
| `case_change_audit` | `changed_at` monthly | forensic |

Example:

```sql
CREATE TABLE case_audit_log_partitioned (
    tenant_id      bigint NOT NULL,
    audit_id       bigint GENERATED ALWAYS AS IDENTITY,
    case_id        uuid NOT NULL,
    event_type     text NOT NULL,
    occurred_at    timestamptz NOT NULL,
    actor_id       text,
    metadata       jsonb NOT NULL DEFAULT '{}'::jsonb,

    CONSTRAINT pk_case_audit_log_partitioned
        PRIMARY KEY (tenant_id, occurred_at, audit_id)
)
PARTITION BY RANGE (occurred_at);
```

PostgreSQL partitioning can help manage very large tables and lifecycle/retention operations, but uniqueness constraints on partitioned tables have important restrictions: unique/primary constraints generally must include the partition key to enforce uniqueness across partitions. Design audit PK accordingly.

---

## 17. Pattern 14 - Retention & Archival

Audit does not mean retain everything forever in the hot OLTP database.

Retention classes:

| Data | Hot retention | Archive |
|---|---:|---|
| Current case | Active lifetime | N/A |
| Status history | Long | Cold storage after case closed |
| Audit log | Medium/long | Object storage / archive DB |
| Outbox published | Short/medium | Usually purge after safe retention |
| Inbox processed | Medium | Purge/archive after dedupe window |
| Idempotency request | Short | Purge after retry window |
| Import staging | Short | Purge after validation/export |

Example cleanup idempotency:

```sql
DELETE FROM idempotency_request
WHERE created_at < clock_timestamp() - interval '30 days'
  AND status IN ('COMPLETED', 'FAILED');
```

Safer chunked cleanup:

```sql
DELETE FROM idempotency_request
WHERE ctid IN (
    SELECT ctid
    FROM idempotency_request
    WHERE created_at < clock_timestamp() - interval '30 days'
      AND status IN ('COMPLETED', 'FAILED')
    ORDER BY created_at
    LIMIT 5000
);
```

Rule:

```text
Retention policy harus eksplisit:
- data apa
- berapa lama hot
- kapan archive
- kapan purge
- siapa boleh purge
- bagaimana audit purge dicatat
```

---

## 18. Pattern 15 - Regulatory Defensibility Checklist

Untuk setiap decision/final state, pastikan bisa menjawab:

| Question | Data source |
|---|---|
| Case current status? | `regulatory_case.status` |
| Timeline status? | `case_status_history` |
| Who changed status? | `changed_by`, `actor_id` |
| Request/process origin? | `request_id`, `correlation_id`, `event_type` |
| What changed? | `before_state`, `after_state`, `changed_fields` |
| Rule at decision time? | `rule_version_id`, snapshot columns |
| Evidence considered? | `evidence_snapshot`, document metadata |
| External event sent? | `outbox_event` |
| External event received? | `inbox_event` |
| Was data corrected? | `audit_correction_log` |
| Was tenant boundary preserved? | `tenant_id`, FK/constraint/RLS |
| Can timeline be reconstructed? | timeline query/index |

---

## 19. MyBatis Mapper Patterns

### Insert audit log

```xml
<insert id="insertCaseAuditLog">
  INSERT INTO case_audit_log (
      tenant_id,
      case_id,
      event_type,
      operation,
      actor_id,
      actor_type,
      request_id,
      correlation_id,
      before_state,
      after_state,
      metadata
  )
  VALUES (
      #{tenantId},
      #{caseId},
      #{eventType},
      #{operation},
      #{actorId},
      #{actorType},
      #{requestId},
      #{correlationId},
      CAST(#{beforeState} AS jsonb),
      CAST(#{afterState} AS jsonb),
      CAST(#{metadata} AS jsonb)
  )
</insert>
```

### Timeline query

```xml
<select id="findCaseAuditTimeline" resultMap="CaseAuditTimelineMap">
  SELECT
      audit_id,
      event_type,
      operation,
      actor_id,
      actor_type,
      occurred_at,
      request_id,
      correlation_id,
      metadata
  FROM case_audit_log
  WHERE tenant_id = #{tenantId}
    AND case_id = #{caseId}
    <if test="lastAuditId != null">
      AND audit_id &gt; #{lastAuditId}
    </if>
  ORDER BY audit_id ASC
  LIMIT #{limit}
</select>
```

### Set audit context

```xml
<update id="setAuditContext">
  SELECT
      set_config('app.actor_id', #{actorId}, true),
      set_config('app.request_id', #{requestId}, true),
      set_config('app.correlation_id', #{correlationId}, true),
      set_config('app.action', #{action}, true),
      set_config('app.reason', #{reason}, true)
</update>
```

---

## 20. Java Service Transaction Pattern

```java
public final class ApproveCaseService {
    private final SqlSessionFactory sqlSessionFactory;

    public ApproveCaseResult approve(ApproveCaseCommand command) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            DbContextMapper context = session.getMapper(DbContextMapper.class);
            CaseMapper cases = session.getMapper(CaseMapper.class);
            DecisionMapper decisions = session.getMapper(DecisionMapper.class);
            AuditMapper audit = session.getMapper(AuditMapper.class);
            OutboxMapper outbox = session.getMapper(OutboxMapper.class);

            context.setAuditContext(
                command.actorId(),
                command.requestId(),
                command.correlationId(),
                "APPROVE",
                command.reason()
            );

            CaseRow before = cases.findForUpdateNowait(
                command.tenantId(),
                command.caseId()
            );

            if (before == null) {
                session.rollback();
                throw new NotFoundException("Case not found");
            }

            if (!"UNDER_REVIEW".equals(before.status())) {
                session.rollback();
                throw new BusinessConflictException("Case is not under review");
            }

            CaseRow after = cases.approveCase(
                command.tenantId(),
                command.caseId(),
                command.actorId(),
                before.version()
            );

            DecisionRow decision = decisions.insertDecisionSnapshot(
                command.tenantId(),
                command.caseId(),
                command.actorId(),
                command.ruleCode(),
                command.evidenceSnapshot(),
                command.reason()
            );

            audit.insertCaseAuditLog(
                CaseAuditLogInsert.approval(
                    before,
                    after,
                    decision,
                    command.requestId(),
                    command.correlationId()
                )
            );

            outbox.insertCaseApproved(
                command.tenantId(),
                command.caseId(),
                after.version(),
                command.correlationId()
            );

            session.commit();

            return new ApproveCaseResult(
                after.tenantId(),
                after.caseId(),
                after.status(),
                after.version(),
                decision.decisionId()
            );
        }
    }
}
```

Transaction invariant:

```text
state update
+ decision snapshot
+ audit log
+ outbox event
commit together or rollback together
```

---

## 21. Anti-Pattern

### Anti-pattern 1 - Only `updated_at` and `updated_by`

```text
regulatory_case.updated_at
regulatory_case.updated_by
```

Masalah:

```text
Tidak tahu field apa berubah.
Tidak tahu old value.
Tidak tahu action/command.
Tidak tahu request/correlation id.
Tidak tahu rule/evidence yang dipakai.
```

Lebih baik:

```text
status_history + audit_log + decision_snapshot
```

---

### Anti-pattern 2 - Current state dihitung dari audit setiap request

Buruk:

```sql
SELECT to_status
FROM case_status_history
WHERE case_id = :caseId
ORDER BY changed_at DESC
LIMIT 1;
```

Untuk setiap detail case.

Lebih baik:

```text
Current state di root table.
History untuk timeline/audit.
```

---

### Anti-pattern 3 - Audit row bisa di-update/delete oleh app runtime

Risiko:

```text
Audit bisa dimanipulasi bug/application compromise.
Forensic trail tidak defensible.
```

Lebih baik:

```text
Grant INSERT/SELECT only.
Correction additive.
Privileged maintenance path terpisah.
```

---

### Anti-pattern 4 - Decision hanya FK ke current reference

Jika reference data berubah, keputusan lama berubah makna secara tampilan.

Lebih baik:

```text
FK ke rule_version + snapshot rule/severity/payload/evidence.
```

---

### Anti-pattern 5 - Outbox event tanpa audit context

Buruk:

```json
{
  "eventType": "CASE_APPROVED",
  "caseId": "..."
}
```

Lebih baik:

```json
{
  "eventType": "CASE_APPROVED",
  "caseId": "...",
  "version": 12,
  "actorId": "user-123",
  "correlationId": "corr-abc",
  "occurredAt": "2026-07-15T10:30:00Z"
}
```

---

## 22. Production Checklist

| Checklist | Pertanyaan |
|---|---|
| Current state | Apakah current state query cepat dan jelas? |
| Status history | Apakah setiap transition penting tercatat? |
| Actor attribution | Apakah `actor_id`, `actor_type`, `changed_by` ada? |
| Request trace | Apakah `request_id` dan `correlation_id` ikut tersimpan? |
| Before/after | Apakah perubahan penting punya before/after snapshot? |
| Decision snapshot | Apakah rule/evidence saat keputusan disnapshot? |
| Temporal validity | Apakah rule/assignment/ownership punya valid period? |
| No-overlap | Apakah periode aktif dicegah overlap? |
| Append-only audit | Apakah app runtime tidak bisa update/delete audit? |
| Correction model | Apakah koreksi audit bersifat additive? |
| Outbox/inbox | Apakah integrasi punya delivery/processing trail? |
| Index timeline | Apakah timeline query punya index? |
| Retention | Apakah audit/history punya hot/archive/purge policy? |
| Trigger context | Jika pakai trigger, apakah `SET LOCAL` context wajib? |
| Tenant boundary | Apakah audit/history tetap membawa `tenant_id`? |

---

## 23. Mini Lab

### Step 1 - Setup current + history

```sql
CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL,
    status       text NOT NULL,
    title        text NOT NULL,
    version      bigint NOT NULL DEFAULT 0,
    updated_by   text NOT NULL,
    updated_at   timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id)
);

CREATE TABLE case_status_history (
    tenant_id      bigint NOT NULL,
    case_id        uuid NOT NULL,
    history_id     bigint GENERATED ALWAYS AS IDENTITY,
    from_status    text,
    to_status      text NOT NULL,
    action         text NOT NULL,
    changed_by     text NOT NULL,
    changed_at     timestamptz NOT NULL DEFAULT clock_timestamp(),
    request_id     text,
    correlation_id text,

    CONSTRAINT pk_case_status_history
        PRIMARY KEY (tenant_id, history_id)
);
```

### Step 2 - Insert draft

```sql
INSERT INTO regulatory_case (
    tenant_id,
    case_id,
    case_number,
    status,
    title,
    updated_by
)
VALUES (
    1001,
    '019535d9-3df7-79fb-b466-fa907fa17f9e',
    'CASE-2026-0001',
    'DRAFT',
    'Audit trail lab',
    'user-001'
);
```

### Step 3 - Submit with history

```sql
WITH updated AS (
    UPDATE regulatory_case
    SET status = 'SUBMITTED',
        version = version + 1,
        updated_by = 'user-001',
        updated_at = clock_timestamp()
    WHERE tenant_id = 1001
      AND case_id = '019535d9-3df7-79fb-b466-fa907fa17f9e'
      AND status = 'DRAFT'
    RETURNING tenant_id, case_id, 'DRAFT'::text AS from_status, status AS to_status
)
INSERT INTO case_status_history (
    tenant_id,
    case_id,
    from_status,
    to_status,
    action,
    changed_by,
    request_id,
    correlation_id
)
SELECT
    tenant_id,
    case_id,
    from_status,
    to_status,
    'SUBMIT',
    'user-001',
    'req-001',
    'corr-001'
FROM updated
RETURNING *;
```

### Step 4 - Timeline

```sql
SELECT
    history_id,
    from_status,
    to_status,
    action,
    changed_by,
    changed_at,
    request_id,
    correlation_id
FROM case_status_history
WHERE tenant_id = 1001
  AND case_id = '019535d9-3df7-79fb-b466-fa907fa17f9e'
ORDER BY history_id ASC;
```

Expected:

```text
Timeline menunjukkan transition DRAFT → SUBMITTED,
actor user-001,
request req-001,
correlation corr-001.
```

---

## 24. Ringkasan Praktis

```text
1. Current state, history, audit, dan snapshot punya tujuan berbeda.
2. Current state harus cepat untuk OLTP query.
3. History menjelaskan lifecycle transition.
4. Audit menjelaskan siapa mengubah apa, kapan, dan melalui proses apa.
5. Decision snapshot menjaga makna historis saat reference/rule berubah.
6. Temporal validity penting untuk rule, assignment, ownership, dan classification.
7. Range + exclusion constraint kuat untuk no-overlap validity.
8. Trigger audit berguna sebagai safety net, tapi harus terdokumentasi.
9. Outbox/inbox adalah bagian dari integration audit.
10. Audit correction sebaiknya additive, bukan silent overwrite.
11. Audit table perlu privilege dan retention policy yang jelas.
12. Java/MyBatis transaction harus menyatukan state update, history, audit, snapshot, dan outbox.
```

---

# Status Seri

**Seri 12/22 selesai.**

Rekomendasi lanjut ke:

**Seri 13 - Queue Table, Worker Claiming, Reservation, Idempotency, dan Outbox Pattern untuk PostgreSQL OLTP: `SKIP LOCKED`, lease timeout, retry attempt, dedupe, dan integration-safe worker design.**

---

**Sources:**

- [Documentation: 18: 6.4. Returning Data from Modified Rows](https://www.postgresql.org/docs/current/dml-returning.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:30:26 PM

# PostgreSQL OLTP - Seri 13/22  
## Queue Table, Worker Claiming, Reservation, Idempotency, dan Outbox Pattern: `SKIP LOCKED`, Lease Timeout, Retry Attempt, Dedupe, dan Integration-Safe Worker Design

Seri ini fokus ke pola OLTP yang sering muncul di microservice:

```text id="spk7m5"
1. job queue berbasis PostgreSQL
2. worker claiming aman tanpa double-processing
3. reservation/quota/inventory-style update
4. idempotency untuk retry-safe API
5. outbox untuk publish event setelah commit
6. inbox untuk dedupe incoming event
7. retry, lease timeout, dead-letter, dan observability
```

PostgreSQL mendukung `SELECT ... FOR UPDATE SKIP LOCKED`; dokumentasi menjelaskan bahwa row yang tidak bisa segera dikunci akan dilewati, tetapi hasilnya memberikan view data yang tidak konsisten sehingga cocok untuk workload queue, bukan general-purpose list biasa. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-select.html?utm_source=chatgpt.com))

---

## 1. Mental Model

```text id="v40o9j"
PostgreSQL OLTP Worker Patterns
│
├─ Queue Table
│  ├─ READY
│  ├─ PROCESSING
│  ├─ DONE
│  ├─ FAILED
│  └─ DEAD_LETTER
│
├─ Worker Claiming
│  ├─ FOR UPDATE SKIP LOCKED
│  ├─ batch claim
│  ├─ lease timeout
│  ├─ attempt count
│  └─ idempotent execution
│
├─ Reservation
│  ├─ atomic UPDATE guard
│  ├─ available >= requested
│  ├─ ledger insert
│  ├─ release/expire
│  └─ no oversell
│
├─ Idempotency
│  ├─ client idempotency key
│  ├─ request hash
│  ├─ response cache
│  ├─ duplicate detection
│  └─ retry-safe POST
│
├─ Outbox
│  ├─ state change + event row in same transaction
│  ├─ publisher worker
│  ├─ publish retry
│  ├─ delivery status
│  └─ CDC-friendly design
│
└─ Inbox
   ├─ incoming message dedupe
   ├─ source system + message id
   ├─ processing status
   ├─ retry attempt
   └─ exactly-once effect via idempotent DB mutation
```

Rule utama:

```text id="6h2x68"
PostgreSQL queue/outbox/inbox bisa memberi exactly-once effect di database,
tetapi tidak memberi exactly-once delivery di dunia luar.
Desain worker harus idempotent.
```

---

## 2. Pattern Decision Table

| Kebutuhan | Pattern | SQL utama |
|---|---|---|
| Banyak worker ambil job | Queue table + `FOR UPDATE SKIP LOCKED` | Claim batch |
| Job tidak hilang saat worker mati | Lease timeout | Requeue stale `PROCESSING` |
| Retry job gagal | `attempt_count`, `available_at` | Backoff |
| Job gagal permanen | Dead-letter | `status = 'DEAD_LETTER'` |
| API POST retry-safe | Idempotency table | `INSERT ... ON CONFLICT DO NOTHING` |
| Publish event setelah commit | Outbox table | Insert outbox dalam transaksi bisnis |
| Publish outbox async | Publisher worker | Claim `NEW` event |
| Consume event idempotent | Inbox table | PK `(tenant_id, source, message_id)` |
| Reserve quota/inventory | Atomic decrement guard | `UPDATE ... WHERE available >= requested` |
| Release/expire reservation | Ledger + status | Update reservation state |
| Single job per tenant | Advisory lock | `pg_try_advisory_xact_lock` |

PostgreSQL `INSERT ... ON CONFLICT` bisa dipakai untuk mengubah unique/exclusion violation menjadi `DO NOTHING` atau `DO UPDATE`, dan `RETURNING` dapat mengembalikan row yang benar-benar inserted/updated. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-insert.html?utm_source=chatgpt.com))

---

# 3. Queue Table Design

## 3.1 Schema

```sql id="1ilwvb"
CREATE TABLE workflow_job (
    tenant_id        bigint NOT NULL,
    job_id           bigint GENERATED ALWAYS AS IDENTITY,
    job_type         text NOT NULL,
    business_key     text,
    payload          jsonb NOT NULL,
    status           text NOT NULL DEFAULT 'READY',
    available_at     timestamptz NOT NULL DEFAULT clock_timestamp(),
    locked_by        text,
    locked_at        timestamptz,
    lock_token       uuid,
    attempt_count    integer NOT NULL DEFAULT 0,
    max_attempts     integer NOT NULL DEFAULT 5,
    last_error       text,
    created_at       timestamptz NOT NULL DEFAULT clock_timestamp(),
    updated_at       timestamptz NOT NULL DEFAULT clock_timestamp(),
    completed_at     timestamptz,

    CONSTRAINT pk_workflow_job
        PRIMARY KEY (tenant_id, job_id),

    CONSTRAINT chk_workflow_job__status
        CHECK (status IN (
            'READY',
            'PROCESSING',
            'DONE',
            'FAILED',
            'DEAD_LETTER'
        )),

    CONSTRAINT chk_workflow_job__attempt_count
        CHECK (attempt_count >= 0),

    CONSTRAINT chk_workflow_job__max_attempts
        CHECK (max_attempts > 0),

    CONSTRAINT chk_workflow_job__payload_object
        CHECK (jsonb_typeof(payload) = 'object')
);
```

## 3.2 Index untuk claim

```sql id="84ao41"
CREATE INDEX idx_workflow_job__ready_claim
ON workflow_job (
    tenant_id,
    available_at ASC,
    job_id ASC
)
WHERE status = 'READY';
```

Kenapa partial index?

```text id="qlqewc"
Worker hanya mencari READY job.
Index tidak perlu menyimpan DONE/FAILED/DEAD_LETTER.
```

## 3.3 Optional unique business key untuk dedupe job

```sql id="p91huk"
CREATE UNIQUE INDEX uq_workflow_job__ready_or_processing_key
ON workflow_job (
    tenant_id,
    job_type,
    business_key
)
WHERE status IN ('READY', 'PROCESSING')
  AND business_key IS NOT NULL;
```

Use case:

```text id="twz3hp"
Jangan enqueue dua job aktif untuk tenant + job_type + business_key yang sama.
```

---

# 4. Worker Claiming dengan `FOR UPDATE SKIP LOCKED`

Claim batch:

```sql id="p7g3sy"
WITH candidate AS (
    SELECT
        tenant_id,
        job_id
    FROM workflow_job
    WHERE tenant_id = :tenantId
      AND status = 'READY'
      AND available_at <= clock_timestamp()
    ORDER BY available_at ASC, job_id ASC
    LIMIT :batchSize
    FOR UPDATE SKIP LOCKED
)
UPDATE workflow_job j
SET status = 'PROCESSING',
    locked_by = :workerId,
    locked_at = clock_timestamp(),
    lock_token = uuidv7(),
    attempt_count = attempt_count + 1,
    updated_at = clock_timestamp()
FROM candidate c
WHERE j.tenant_id = c.tenant_id
  AND j.job_id = c.job_id
RETURNING
    j.tenant_id,
    j.job_id,
    j.job_type,
    j.business_key,
    j.payload,
    j.lock_token,
    j.attempt_count,
    j.max_attempts;
```

Kenapa update langsung setelah select?

```text id="68eacu"
SELECT ... FOR UPDATE SKIP LOCKED memilih row.
UPDATE ... FROM candidate mengubah status menjadi PROCESSING dalam transaksi yang sama.
Worker lain tidak akan mengambil row yang sama.
```

PostgreSQL row-level lock tidak memblok pembacaan biasa, tetapi memblok writer/locker lain terhadap row yang sama sampai transaksi berakhir; advisory lock juga tersedia bila lock yang dibutuhkan tidak cocok direpresentasikan sebagai row. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html?utm_source=chatgpt.com))

---

# 5. Worker Execution Flow

```text id="t6yzwx"
Loop worker
│
├─ claim batch
│
├─ commit claim transaction
│
├─ for each job:
│  ├─ execute job idempotently
│  ├─ success → mark DONE
│  ├─ retryable failure → mark READY with backoff
│  └─ permanent failure/max attempts → DEAD_LETTER
│
└─ repeat
```

Important choice:

```text id="mzu9f1"
Claim transaction sebaiknya pendek.
Jangan claim lalu memproses external API panjang di transaction yang sama.
```

Buruk:

```text id="0ssj5i"
BEGIN
  claim job FOR UPDATE
  call external API 30s
  update job DONE
COMMIT
```

Lebih baik:

```text id="wvw1cm"
BEGIN
  claim job → PROCESSING + lock_token
COMMIT

execute outside DB transaction

BEGIN
  mark DONE/READY/DEAD_LETTER using lock_token
COMMIT
```

---

# 6. Mark Job DONE dengan Lock Token

```sql id="d0n8no"
UPDATE workflow_job
SET status = 'DONE',
    completed_at = clock_timestamp(),
    updated_at = clock_timestamp(),
    last_error = NULL
WHERE tenant_id = :tenantId
  AND job_id = :jobId
  AND status = 'PROCESSING'
  AND lock_token = :lockToken
RETURNING
    tenant_id,
    job_id,
    status,
    completed_at;
```

Kenapa `lock_token` penting?

```text id="7s4g7m"
Worker A claim job.
Worker A lambat.
Lease timeout membuat job di-requeue.
Worker B claim job.
Worker A selesai belakangan.
Tanpa lock_token, Worker A bisa mark DONE untuk job yang sudah dimiliki Worker B.
```

Rule:

```text id="w987fd"
Semua update hasil worker harus membawa:
tenant_id + job_id + status PROCESSING + lock_token.
```

---

# 7. Retry Job dengan Backoff

```sql id="u6um71"
UPDATE workflow_job
SET status = CASE
        WHEN attempt_count >= max_attempts THEN 'DEAD_LETTER'
        ELSE 'READY'
    END,
    available_at = CASE
        WHEN attempt_count >= max_attempts THEN available_at
        ELSE clock_timestamp()
             + make_interval(secs => LEAST(300, POWER(2, attempt_count)::integer))
    END,
    locked_by = NULL,
    locked_at = NULL,
    lock_token = NULL,
    last_error = left(:errorMessage, 4000),
    updated_at = clock_timestamp()
WHERE tenant_id = :tenantId
  AND job_id = :jobId
  AND status = 'PROCESSING'
  AND lock_token = :lockToken
RETURNING
    tenant_id,
    job_id,
    status,
    attempt_count,
    available_at,
    last_error;
```

Backoff strategy:

| Attempt | Delay example |
|---:|---:|
| 1 | 2s |
| 2 | 4s |
| 3 | 8s |
| 4 | 16s |
| 5 | dead-letter / max |

Practical rule:

```text id="egkq35"
Retry cepat tanpa backoff bisa membuat database dan external dependency makin rusak saat outage.
```

---

# 8. Requeue Stale PROCESSING Jobs

Worker bisa crash setelah claim. Gunakan lease timeout.

```sql id="ou38uz"
UPDATE workflow_job
SET status = 'READY',
    locked_by = NULL,
    locked_at = NULL,
    lock_token = NULL,
    available_at = clock_timestamp() + interval '10 seconds',
    updated_at = clock_timestamp(),
    last_error = COALESCE(last_error, 'Lease expired; job requeued')
WHERE status = 'PROCESSING'
  AND locked_at < clock_timestamp() - interval '5 minutes'
  AND attempt_count < max_attempts
RETURNING
    tenant_id,
    job_id,
    attempt_count;
```

Move to dead-letter if too many attempts:

```sql id="2p01np"
UPDATE workflow_job
SET status = 'DEAD_LETTER',
    locked_by = NULL,
    locked_at = NULL,
    lock_token = NULL,
    updated_at = clock_timestamp(),
    last_error = COALESCE(last_error, 'Max attempts reached after lease expiry')
WHERE status = 'PROCESSING'
  AND locked_at < clock_timestamp() - interval '5 minutes'
  AND attempt_count >= max_attempts
RETURNING
    tenant_id,
    job_id,
    attempt_count,
    last_error;
```

Index untuk stale scan:

```sql id="1jxv1a"
CREATE INDEX idx_workflow_job__processing_stale
ON workflow_job (
    locked_at ASC,
    tenant_id,
    job_id
)
WHERE status = 'PROCESSING';
```

---

# 9. Java Worker Skeleton

```java id="qu7kd8"
public final class WorkflowJobWorker implements Runnable {
    private final SqlSessionFactory sqlSessionFactory;
    private final String workerId;
    private final JobExecutorRegistry executorRegistry;

    public WorkflowJobWorker(
            SqlSessionFactory sqlSessionFactory,
            String workerId,
            JobExecutorRegistry executorRegistry
    ) {
        this.sqlSessionFactory = sqlSessionFactory;
        this.workerId = workerId;
        this.executorRegistry = executorRegistry;
    }

    @Override
    public void run() {
        while (!Thread.currentThread().isInterrupted()) {
            List<WorkflowJobRow> jobs = claimJobs(1001L, 25);

            if (jobs.isEmpty()) {
                sleepQuietly(500);
                continue;
            }

            for (WorkflowJobRow job : jobs) {
                executeOne(job);
            }
        }
    }

    private List<WorkflowJobRow> claimJobs(long tenantId, int batchSize) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            WorkflowJobMapper mapper = session.getMapper(WorkflowJobMapper.class);

            List<WorkflowJobRow> jobs = mapper.claimReadyJobs(
                tenantId,
                workerId,
                batchSize
            );

            session.commit();
            return jobs;
        }
    }

    private void executeOne(WorkflowJobRow job) {
        try {
            JobExecutor executor = executorRegistry.find(job.jobType());
            executor.execute(job);

            markDone(job);
        } catch (RetryableJobException e) {
            markRetry(job, e);
        } catch (Exception e) {
            markFailed(job, e);
        }
    }

    private void markDone(WorkflowJobRow job) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            WorkflowJobMapper mapper = session.getMapper(WorkflowJobMapper.class);

            int updated = mapper.markDone(
                job.tenantId(),
                job.jobId(),
                job.lockToken()
            );

            session.commit();

            if (updated == 0) {
                // Job lease changed; do not treat as success.
                // Log and let current owner/lease handler deal with it.
            }
        }
    }

    private void markRetry(WorkflowJobRow job, Exception error) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            WorkflowJobMapper mapper = session.getMapper(WorkflowJobMapper.class);

            mapper.markRetryOrDeadLetter(
                job.tenantId(),
                job.jobId(),
                job.lockToken(),
                error.getMessage()
            );

            session.commit();
        }
    }

    private void markFailed(WorkflowJobRow job, Exception error) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            WorkflowJobMapper mapper = session.getMapper(WorkflowJobMapper.class);

            mapper.markDeadLetter(
                job.tenantId(),
                job.jobId(),
                job.lockToken(),
                error.getMessage()
            );

            session.commit();
        }
    }

    private void sleepQuietly(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException interrupted) {
            Thread.currentThread().interrupt();
        }
    }
}
```

Key point:

```text id="s3d66s"
Execution harus idempotent.
Mark DONE harus guarded by lock_token.
Claim transaction harus cepat.
```

---

# 10. MyBatis Mapper untuk Queue

```xml id="hjyl33"
<select id="claimReadyJobs" resultMap="WorkflowJobRowMap">
  WITH candidate AS (
      SELECT
          tenant_id,
          job_id
      FROM workflow_job
      WHERE tenant_id = #{tenantId}
        AND status = 'READY'
        AND available_at &lt;= clock_timestamp()
      ORDER BY available_at ASC, job_id ASC
      LIMIT #{batchSize}
      FOR UPDATE SKIP LOCKED
  )
  UPDATE workflow_job j
  SET status = 'PROCESSING',
      locked_by = #{workerId},
      locked_at = clock_timestamp(),
      lock_token = uuidv7(),
      attempt_count = attempt_count + 1,
      updated_at = clock_timestamp()
  FROM candidate c
  WHERE j.tenant_id = c.tenant_id
    AND j.job_id = c.job_id
  RETURNING
      j.tenant_id,
      j.job_id,
      j.job_type,
      j.business_key,
      j.payload,
      j.status,
      j.lock_token,
      j.attempt_count,
      j.max_attempts,
      j.available_at,
      j.locked_at
</select>
```

```xml id="oypyrd"
<update id="markDone">
  UPDATE workflow_job
  SET status = 'DONE',
      completed_at = clock_timestamp(),
      updated_at = clock_timestamp(),
      last_error = NULL
  WHERE tenant_id = #{tenantId}
    AND job_id = #{jobId}
    AND status = 'PROCESSING'
    AND lock_token = #{lockToken}
</update>
```

```xml id="r419z1"
<update id="markRetryOrDeadLetter">
  UPDATE workflow_job
  SET status = CASE
          WHEN attempt_count >= max_attempts THEN 'DEAD_LETTER'
          ELSE 'READY'
      END,
      available_at = CASE
          WHEN attempt_count >= max_attempts THEN available_at
          ELSE clock_timestamp()
               + make_interval(secs => LEAST(300, POWER(2, attempt_count)::integer))
      END,
      locked_by = NULL,
      locked_at = NULL,
      lock_token = NULL,
      last_error = left(#{errorMessage}, 4000),
      updated_at = clock_timestamp()
  WHERE tenant_id = #{tenantId}
    AND job_id = #{jobId}
    AND status = 'PROCESSING'
    AND lock_token = #{lockToken}
</update>
```

---

# 11. Reservation Pattern

Reservation dipakai untuk resource terbatas:

```text id="f6wplj"
quota
inventory
case capacity
daily submission limit
officer workload slot
batch processing slot
```

## 11.1 Schema bucket

```sql id="zun8tw"
CREATE TABLE quota_bucket (
    tenant_id        bigint NOT NULL,
    quota_key        text NOT NULL,
    total_quota      integer NOT NULL,
    reserved_quota   integer NOT NULL DEFAULT 0,
    consumed_quota   integer NOT NULL DEFAULT 0,
    version          bigint NOT NULL DEFAULT 0,
    updated_at       timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_quota_bucket
        PRIMARY KEY (tenant_id, quota_key),

    CONSTRAINT chk_quota_bucket__non_negative
        CHECK (
            total_quota >= 0
            AND reserved_quota >= 0
            AND consumed_quota >= 0
        ),

    CONSTRAINT chk_quota_bucket__capacity
        CHECK (reserved_quota + consumed_quota <= total_quota)
);
```

## 11.2 Reservation ledger

```sql id="3qwamc"
CREATE TABLE quota_reservation (
    tenant_id        bigint NOT NULL,
    reservation_id   uuid NOT NULL DEFAULT uuidv7(),
    quota_key        text NOT NULL,
    amount           integer NOT NULL,
    status           text NOT NULL DEFAULT 'RESERVED',
    reserved_by      text NOT NULL,
    reserved_at      timestamptz NOT NULL DEFAULT clock_timestamp(),
    expires_at       timestamptz NOT NULL,
    consumed_at      timestamptz,
    released_at      timestamptz,

    CONSTRAINT pk_quota_reservation
        PRIMARY KEY (tenant_id, reservation_id),

    CONSTRAINT fk_quota_reservation__bucket
        FOREIGN KEY (tenant_id, quota_key)
        REFERENCES quota_bucket (tenant_id, quota_key),

    CONSTRAINT chk_quota_reservation__amount
        CHECK (amount > 0),

    CONSTRAINT chk_quota_reservation__status
        CHECK (status IN ('RESERVED', 'CONSUMED', 'RELEASED', 'EXPIRED'))
);
```

## 11.3 Atomic reserve

```sql id="7ox6te"
WITH reserved AS (
    UPDATE quota_bucket
    SET reserved_quota = reserved_quota + :amount,
        version = version + 1,
        updated_at = clock_timestamp()
    WHERE tenant_id = :tenantId
      AND quota_key = :quotaKey
      AND total_quota - reserved_quota - consumed_quota >= :amount
    RETURNING
        tenant_id,
        quota_key,
        version
),
ledger AS (
    INSERT INTO quota_reservation (
        tenant_id,
        quota_key,
        amount,
        reserved_by,
        expires_at
    )
    SELECT
        tenant_id,
        quota_key,
        :amount,
        :actorId,
        clock_timestamp() + interval '15 minutes'
    FROM reserved
    RETURNING
        tenant_id,
        reservation_id,
        quota_key,
        amount,
        status,
        expires_at
)
SELECT *
FROM ledger;
```

Interpretasi:

| Result | Meaning |
|---|---|
| 1 row | Reservation sukses |
| 0 row | Quota tidak cukup / bucket tidak ada |
| Constraint error | Invariant rusak / bug |

Rule:

```text id="1tvzm0"
Oversell dicegah oleh guarded UPDATE:
available >= requested.
Ledger memberi audit.
```

---

# 12. Consume dan Release Reservation

## 12.1 Consume

```sql id="l0k4ik"
WITH consumed_reservation AS (
    UPDATE quota_reservation
    SET status = 'CONSUMED',
        consumed_at = clock_timestamp()
    WHERE tenant_id = :tenantId
      AND reservation_id = :reservationId
      AND status = 'RESERVED'
      AND expires_at > clock_timestamp()
    RETURNING tenant_id, quota_key, amount
),
updated_bucket AS (
    UPDATE quota_bucket b
    SET reserved_quota = b.reserved_quota - r.amount,
        consumed_quota = b.consumed_quota + r.amount,
        version = b.version + 1,
        updated_at = clock_timestamp()
    FROM consumed_reservation r
    WHERE b.tenant_id = r.tenant_id
      AND b.quota_key = r.quota_key
    RETURNING b.tenant_id, b.quota_key, b.version
)
SELECT *
FROM updated_bucket;
```

## 12.2 Release

```sql id="xbg1q5"
WITH released_reservation AS (
    UPDATE quota_reservation
    SET status = 'RELEASED',
        released_at = clock_timestamp()
    WHERE tenant_id = :tenantId
      AND reservation_id = :reservationId
      AND status = 'RESERVED'
    RETURNING tenant_id, quota_key, amount
),
updated_bucket AS (
    UPDATE quota_bucket b
    SET reserved_quota = b.reserved_quota - r.amount,
        version = b.version + 1,
        updated_at = clock_timestamp()
    FROM released_reservation r
    WHERE b.tenant_id = r.tenant_id
      AND b.quota_key = r.quota_key
    RETURNING b.tenant_id, b.quota_key, b.version
)
SELECT *
FROM updated_bucket;
```

## 12.3 Expire stale reservation

```sql id="dghmgg"
WITH expired AS (
    UPDATE quota_reservation
    SET status = 'EXPIRED',
        released_at = clock_timestamp()
    WHERE status = 'RESERVED'
      AND expires_at <= clock_timestamp()
    RETURNING tenant_id, quota_key, amount
),
bucket_update AS (
    UPDATE quota_bucket b
    SET reserved_quota = b.reserved_quota - e.amount,
        version = b.version + 1,
        updated_at = clock_timestamp()
    FROM expired e
    WHERE b.tenant_id = e.tenant_id
      AND b.quota_key = e.quota_key
    RETURNING b.tenant_id, b.quota_key
)
SELECT count(*)
FROM bucket_update;
```

Caution:

```text id="uvugp7"
Jika banyak reservation expired sekaligus, lakukan chunking.
Jangan update jutaan row dalam satu transaksi.
```

---

# 13. Idempotency Pattern untuk HTTP POST

## 13.1 Schema

```sql id="yec0n7"
CREATE TABLE idempotency_request (
    tenant_id         bigint NOT NULL,
    idempotency_key  text NOT NULL,
    command_name     text NOT NULL,
    request_hash     text NOT NULL,
    status           text NOT NULL DEFAULT 'PROCESSING',
    response_code    integer,
    response_body    jsonb,
    created_at       timestamptz NOT NULL DEFAULT clock_timestamp(),
    completed_at     timestamptz,
    last_error       text,

    CONSTRAINT pk_idempotency_request
        PRIMARY KEY (tenant_id, idempotency_key, command_name),

    CONSTRAINT chk_idempotency_request__status
        CHECK (status IN ('PROCESSING', 'COMPLETED', 'FAILED')),

    CONSTRAINT chk_idempotency_request__response_consistency
        CHECK (
            (status = 'COMPLETED' AND response_code IS NOT NULL AND response_body IS NOT NULL)
            OR status <> 'COMPLETED'
        )
);
```

## 13.2 Start idempotency

```sql id="fqlmwt"
INSERT INTO idempotency_request (
    tenant_id,
    idempotency_key,
    command_name,
    request_hash,
    status
)
VALUES (
    :tenantId,
    :idempotencyKey,
    :commandName,
    :requestHash,
    'PROCESSING'
)
ON CONFLICT (tenant_id, idempotency_key, command_name)
DO NOTHING
RETURNING
    tenant_id,
    idempotency_key,
    command_name,
    request_hash,
    status;
```

If no row returned, read existing:

```sql id="dwf8n6"
SELECT
    tenant_id,
    idempotency_key,
    command_name,
    request_hash,
    status,
    response_code,
    response_body,
    completed_at
FROM idempotency_request
WHERE tenant_id = :tenantId
  AND idempotency_key = :idempotencyKey
  AND command_name = :commandName;
```

Decision:

| Existing state | Same hash? | Response |
|---|---|---|
| `COMPLETED` | yes | return stored response |
| `PROCESSING` | yes | `409 Conflict`, `425 Too Early`, or `202 Accepted` |
| `FAILED` | yes | allow retry or return previous failure, depending policy |
| any | no | `409 Conflict`: key reused with different request |

## 13.3 Complete idempotency

```sql id="1c8fpq"
UPDATE idempotency_request
SET status = 'COMPLETED',
    response_code = :responseCode,
    response_body = CAST(:responseBody AS jsonb),
    completed_at = clock_timestamp(),
    last_error = NULL
WHERE tenant_id = :tenantId
  AND idempotency_key = :idempotencyKey
  AND command_name = :commandName
  AND request_hash = :requestHash
  AND status = 'PROCESSING';
```

Rule:

```text id="fq0mif"
Idempotency row + business mutation + response cache
harus commit bersama.
```

---

# 14. Java Service dengan Idempotency

```java id="hbzr5i"
public final class CreateCaseService {
    private final SqlSessionFactory sqlSessionFactory;

    public CreateCaseResult create(CreateCaseCommand command) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            IdempotencyMapper idem = session.getMapper(IdempotencyMapper.class);
            CaseMapper cases = session.getMapper(CaseMapper.class);
            OutboxMapper outbox = session.getMapper(OutboxMapper.class);

            IdempotencyStartRow started = idem.start(
                command.tenantId(),
                command.idempotencyKey(),
                "CREATE_CASE",
                command.requestHash()
            );

            if (started == null) {
                IdempotencyRow existing = idem.find(
                    command.tenantId(),
                    command.idempotencyKey(),
                    "CREATE_CASE"
                );

                session.rollback();

                if (!existing.requestHash().equals(command.requestHash())) {
                    throw new BusinessConflictException(
                        "Idempotency key was reused with a different request"
                    );
                }

                if ("COMPLETED".equals(existing.status())) {
                    return decodeCreateCaseResult(existing.responseBody());
                }

                throw new ResourceBusyException("Request is still processing");
            }

            CaseRow inserted = cases.insertCase(
                command.tenantId(),
                command.title(),
                command.actorId()
            );

            outbox.insert(
                command.tenantId(),
                inserted.caseId(),
                "CASE_CREATED",
                buildCaseCreatedPayload(inserted)
            );

            CreateCaseResult result = new CreateCaseResult(
                inserted.tenantId(),
                inserted.caseId(),
                inserted.caseNumber(),
                inserted.version()
            );

            idem.complete(
                command.tenantId(),
                command.idempotencyKey(),
                "CREATE_CASE",
                command.requestHash(),
                201,
                encodeJson(result)
            );

            session.commit();
            return result;
        }
    }
}
```

Important:

```text id="7mxxvu"
External publish tidak dilakukan dalam transaksi ini.
Outbox row disimpan dalam transaksi ini.
Publisher worker memproses outbox setelah commit.
```

---

# 15. Outbox Pattern

## 15.1 Schema

```sql id="zoepqu"
CREATE TABLE outbox_event (
    tenant_id        bigint NOT NULL,
    outbox_id        uuid NOT NULL DEFAULT uuidv7(),
    aggregate_type   text NOT NULL,
    aggregate_id     uuid NOT NULL,
    aggregate_version bigint,
    event_type       text NOT NULL,
    event_version    integer NOT NULL DEFAULT 1,
    payload          jsonb NOT NULL,
    headers          jsonb NOT NULL DEFAULT '{}'::jsonb,
    status           text NOT NULL DEFAULT 'NEW',
    available_at     timestamptz NOT NULL DEFAULT clock_timestamp(),
    locked_by        text,
    locked_at        timestamptz,
    lock_token       uuid,
    attempt_count    integer NOT NULL DEFAULT 0,
    max_attempts     integer NOT NULL DEFAULT 10,
    last_error       text,
    created_at       timestamptz NOT NULL DEFAULT clock_timestamp(),
    published_at     timestamptz,

    CONSTRAINT pk_outbox_event
        PRIMARY KEY (tenant_id, outbox_id),

    CONSTRAINT chk_outbox_event__status
        CHECK (status IN ('NEW', 'PROCESSING', 'PUBLISHED', 'FAILED')),

    CONSTRAINT chk_outbox_event__payload_object
        CHECK (jsonb_typeof(payload) = 'object'),

    CONSTRAINT chk_outbox_event__headers_object
        CHECK (jsonb_typeof(headers) = 'object')
);
```

## 15.2 Index

```sql id="4z86wd"
CREATE INDEX idx_outbox_event__new_claim
ON outbox_event (
    tenant_id,
    available_at ASC,
    created_at ASC,
    outbox_id ASC
)
WHERE status = 'NEW';
```

## 15.3 Insert outbox in business transaction

```sql id="4metcf"
INSERT INTO outbox_event (
    tenant_id,
    aggregate_type,
    aggregate_id,
    aggregate_version,
    event_type,
    event_version,
    payload,
    headers
)
VALUES (
    :tenantId,
    'REGULATORY_CASE',
    :caseId,
    :caseVersion,
    'CASE_SUBMITTED',
    1,
    jsonb_build_object(
        'tenantId', :tenantId,
        'caseId', :caseId,
        'caseNumber', :caseNumber,
        'status', 'SUBMITTED',
        'version', :caseVersion,
        'occurredAt', clock_timestamp()
    ),
    jsonb_build_object(
        'correlationId', :correlationId,
        'causationId', :requestId
    )
);
```

Rule:

```text id="hjdyzo"
Business state update + outbox insert harus satu transaction.
Publish ke Kafka/RabbitMQ/HTTP dilakukan setelah commit.
```

---

# 16. Outbox Publisher Worker

Claim:

```sql id="qxn1fk"
WITH candidate AS (
    SELECT
        tenant_id,
        outbox_id
    FROM outbox_event
    WHERE tenant_id = :tenantId
      AND status = 'NEW'
      AND available_at <= clock_timestamp()
    ORDER BY available_at ASC, created_at ASC, outbox_id ASC
    LIMIT :batchSize
    FOR UPDATE SKIP LOCKED
)
UPDATE outbox_event e
SET status = 'PROCESSING',
    locked_by = :workerId,
    locked_at = clock_timestamp(),
    lock_token = uuidv7(),
    attempt_count = attempt_count + 1
FROM candidate c
WHERE e.tenant_id = c.tenant_id
  AND e.outbox_id = c.outbox_id
RETURNING
    e.tenant_id,
    e.outbox_id,
    e.aggregate_type,
    e.aggregate_id,
    e.event_type,
    e.event_version,
    e.payload,
    e.headers,
    e.lock_token,
    e.attempt_count;
```

After publish success:

```sql id="jq03dw"
UPDATE outbox_event
SET status = 'PUBLISHED',
    published_at = clock_timestamp(),
    locked_by = NULL,
    locked_at = NULL,
    lock_token = NULL,
    last_error = NULL
WHERE tenant_id = :tenantId
  AND outbox_id = :outboxId
  AND status = 'PROCESSING'
  AND lock_token = :lockToken;
```

After publish failure:

```sql id="pmxwwh"
UPDATE outbox_event
SET status = CASE
        WHEN attempt_count >= max_attempts THEN 'FAILED'
        ELSE 'NEW'
    END,
    available_at = CASE
        WHEN attempt_count >= max_attempts THEN available_at
        ELSE clock_timestamp()
             + make_interval(secs => LEAST(600, POWER(2, attempt_count)::integer))
    END,
    locked_by = NULL,
    locked_at = NULL,
    lock_token = NULL,
    last_error = left(:errorMessage, 4000)
WHERE tenant_id = :tenantId
  AND outbox_id = :outboxId
  AND status = 'PROCESSING'
  AND lock_token = :lockToken;
```

Delivery semantics:

```text id="nx8y72"
Outbox publisher is at-least-once.
Consumer must be idempotent.
```

---

# 17. Inbox Pattern untuk Consumer Idempotency

## 17.1 Schema

```sql id="2odxni"
CREATE TABLE inbox_event (
    tenant_id          bigint NOT NULL,
    source_system      text NOT NULL,
    message_id         text NOT NULL,
    event_type         text NOT NULL,
    event_version      integer NOT NULL DEFAULT 1,
    payload            jsonb NOT NULL,
    headers            jsonb NOT NULL DEFAULT '{}'::jsonb,
    status             text NOT NULL DEFAULT 'RECEIVED',
    received_at        timestamptz NOT NULL DEFAULT clock_timestamp(),
    processing_started_at timestamptz,
    processed_at       timestamptz,
    attempt_count      integer NOT NULL DEFAULT 0,
    last_error         text,

    CONSTRAINT pk_inbox_event
        PRIMARY KEY (tenant_id, source_system, message_id),

    CONSTRAINT chk_inbox_event__status
        CHECK (status IN ('RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED')),

    CONSTRAINT chk_inbox_event__payload_object
        CHECK (jsonb_typeof(payload) = 'object')
);
```

## 17.2 Insert dedupe

```sql id="jj6kcw"
INSERT INTO inbox_event (
    tenant_id,
    source_system,
    message_id,
    event_type,
    event_version,
    payload,
    headers,
    status
)
VALUES (
    :tenantId,
    :sourceSystem,
    :messageId,
    :eventType,
    :eventVersion,
    CAST(:payload AS jsonb),
    CAST(:headers AS jsonb),
    'RECEIVED'
)
ON CONFLICT (tenant_id, source_system, message_id)
DO NOTHING
RETURNING
    tenant_id,
    source_system,
    message_id;
```

If no row:

```text id="d27f6t"
Duplicate incoming message.
Do not process again unless policy explicitly allows replay.
```

## 17.3 Process inbox event with state mutation

```sql id="xadylr"
WITH claimed AS (
    UPDATE inbox_event
    SET status = 'PROCESSING',
        processing_started_at = clock_timestamp(),
        attempt_count = attempt_count + 1
    WHERE tenant_id = :tenantId
      AND source_system = :sourceSystem
      AND message_id = :messageId
      AND status = 'RECEIVED'
    RETURNING *
),
business_update AS (
    UPDATE external_case_projection p
    SET external_status = claimed.payload ->> 'status',
        updated_at = clock_timestamp()
    FROM claimed
    WHERE p.tenant_id = claimed.tenant_id
      AND p.external_case_id = claimed.payload ->> 'caseId'
    RETURNING p.tenant_id
)
UPDATE inbox_event i
SET status = 'PROCESSED',
    processed_at = clock_timestamp()
WHERE i.tenant_id = :tenantId
  AND i.source_system = :sourceSystem
  AND i.message_id = :messageId
  AND EXISTS (SELECT 1 FROM claimed)
RETURNING i.tenant_id, i.source_system, i.message_id, i.status;
```

Rule:

```text id="f4w5qu"
Inbox row + business effect harus satu transaction.
Duplicate message tidak boleh menggandakan effect.
```

---

# 18. Advisory Lock untuk Single Worker per Tenant/Job Type

Advisory locks cocok untuk mutual exclusion yang maknanya ditentukan aplikasi. PostgreSQL menjelaskan advisory lock dapat lebih cepat daripada table-flag pattern, menghindari bloat, dan otomatis dibersihkan server pada kondisi tertentu; transaction-level advisory lock dilepas saat transaksi selesai. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html?utm_source=chatgpt.com))

Contoh: hanya satu scheduler per tenant yang melakukan requeue stale jobs.

```sql id="4gd2gi"
SELECT pg_try_advisory_xact_lock(
    hashtext(:tenantId || ':workflow-job-requeue')
) AS acquired;
```

Jika `acquired = false`:

```text id="5a3qow"
Scheduler lain sedang menjalankan requeue untuk tenant ini.
Skip run ini.
```

Gunakan transaction-level lock:

```sql id="pi2sgp"
BEGIN;

SELECT pg_try_advisory_xact_lock(hashtext('tenant:1001:outbox-maintenance'));

-- if acquired, run maintenance query

COMMIT;
```

Hindari session-level advisory lock di app dengan connection pool kecuali benar-benar paham lifecycle koneksi.

---

# 19. Error Classification untuk Worker

PostgreSQL error code memakai lima karakter SQLSTATE; aplikasi disarankan mengecek kode, bukan pesan teks error. ([PostgreSQL](https://www.postgresql.org/docs/current/errcodes-appendix.html?utm_source=chatgpt.com))

| SQLSTATE | Condition | Worker action |
|---|---|---|
| `40001` | serialization failure | retry transaction |
| `40P01` | deadlock detected | retry transaction + inspect lock order |
| `55P03` | lock not available | skip/retry later |
| `23505` | unique violation | dedupe/business conflict |
| `23503` | foreign key violation | stale reference; maybe dead-letter |
| `23514` | check violation | invalid payload/bug; dead-letter |
| network/external timeout | outside DB | retry with backoff |
| non-retryable API response | outside DB | failed/dead-letter |

Rule:

```text id="5tiy02"
DB transient error → retry transaction.
Business/data error → mark failed/dead-letter.
External transient error → retry job with backoff.
```

---

# 20. Monitoring Queries

## 20.1 Queue depth by status

```sql id="6jxcxi"
SELECT
    tenant_id,
    job_type,
    status,
    count(*) AS job_count,
    min(created_at) AS oldest_created_at,
    min(available_at) AS oldest_available_at
FROM workflow_job
GROUP BY tenant_id, job_type, status
ORDER BY tenant_id, job_type, status;
```

## 20.2 Oldest READY job

```sql id="oh0x4r"
SELECT
    tenant_id,
    job_type,
    min(available_at) AS oldest_ready_at,
    count(*) AS ready_count
FROM workflow_job
WHERE status = 'READY'
GROUP BY tenant_id, job_type
ORDER BY oldest_ready_at;
```

## 20.3 Stale processing jobs

```sql id="ue10e7"
SELECT
    tenant_id,
    job_id,
    job_type,
    locked_by,
    locked_at,
    attempt_count,
    now() - locked_at AS processing_age,
    left(last_error, 500) AS last_error
FROM workflow_job
WHERE status = 'PROCESSING'
  AND locked_at < clock_timestamp() - interval '5 minutes'
ORDER BY locked_at ASC
LIMIT 100;
```

## 20.4 Outbox lag

```sql id="pjwndw"
SELECT
    tenant_id,
    event_type,
    status,
    count(*) AS event_count,
    min(created_at) AS oldest_created_at,
    max(attempt_count) AS max_attempts
FROM outbox_event
GROUP BY tenant_id, event_type, status
ORDER BY tenant_id, event_type, status;
```

## 20.5 Lock wait check

```sql id="7zb5t2"
SELECT
    pid,
    usename,
    application_name,
    state,
    wait_event_type,
    wait_event,
    now() - query_start AS query_age,
    left(query, 500) AS query
FROM pg_stat_activity
WHERE wait_event_type = 'Lock'
ORDER BY query_start;
```

PostgreSQL monitoring stats expose wait event information; `wait_event_type = 'Lock'` means the server process is waiting for a heavyweight lock. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html?utm_source=chatgpt.com))

---

# 21. Cleanup dan Retention

## 21.1 Published outbox cleanup

```sql id="2zbb3t"
DELETE FROM outbox_event
WHERE ctid IN (
    SELECT ctid
    FROM outbox_event
    WHERE status = 'PUBLISHED'
      AND published_at < clock_timestamp() - interval '14 days'
    ORDER BY published_at
    LIMIT 5000
);
```

## 21.2 Completed idempotency cleanup

```sql id="x6c0ki"
DELETE FROM idempotency_request
WHERE ctid IN (
    SELECT ctid
    FROM idempotency_request
    WHERE status IN ('COMPLETED', 'FAILED')
      AND created_at < clock_timestamp() - interval '30 days'
    ORDER BY created_at
    LIMIT 5000
);
```

## 21.3 Processed inbox cleanup

```sql id="z9p17i"
DELETE FROM inbox_event
WHERE ctid IN (
    SELECT ctid
    FROM inbox_event
    WHERE status = 'PROCESSED'
      AND processed_at < clock_timestamp() - interval '30 days'
    ORDER BY processed_at
    LIMIT 5000
);
```

Rule:

```text id="mae5r3"
Cleanup harus chunked.
Large delete satu transaksi bisa membuat bloat, WAL spike, replication lag, dan lock pressure.
```

---

# 22. Exactly-Once Reality Check

Misleading claim:

```text id="1qf05b"
“Outbox membuat exactly-once messaging.”
```

Lebih tepat:

```text id="c09nd2"
Outbox membuat state change dan intent-to-publish atomic di DB.
Publisher biasanya at-least-once.
Consumer wajib idempotent.
Exactly-once effect dicapai melalui dedupe key dan guarded mutation.
```

Contoh consumer idempotent:

```sql id="cmz1x9"
INSERT INTO processed_business_event (
    tenant_id,
    source_system,
    message_id,
    processed_at
)
VALUES (
    :tenantId,
    :sourceSystem,
    :messageId,
    clock_timestamp()
)
ON CONFLICT DO NOTHING
RETURNING tenant_id;
```

Jika no row returned:

```text id="qbhgia"
Event sudah pernah diproses.
Skip business effect.
```

---

# 23. Anti-Pattern

## Anti-pattern 1 - Worker memproses job di dalam lock transaction

Buruk:

```text id="ffxwws"
BEGIN
  SELECT ... FOR UPDATE SKIP LOCKED
  call external API
  update DONE
COMMIT
```

Masalah:

```text id="vpcu70"
lock lama
connection lama
deadlock/blocked risk
external latency menjadi DB contention
```

Lebih baik:

```text id="ox36kb"
claim short transaction
execute outside transaction
mark result short transaction
```

---

## Anti-pattern 2 - Tidak memakai lock token

Risiko:

```text id="cf86ac"
Worker lama bisa mark DONE job yang lease-nya sudah berpindah.
```

Solusi:

```text id="g4drrq"
PROCESSING update menghasilkan lock_token.
Semua mark DONE/FAILED harus match lock_token.
```

---

## Anti-pattern 3 - Queue tanpa lease timeout

Risiko:

```text id="6k3wtb"
Worker crash membuat job stuck PROCESSING selamanya.
```

Solusi:

```text id="gw9seh"
locked_at + requeue stale PROCESSING.
```

---

## Anti-pattern 4 - Idempotency key tanpa request hash

Risiko:

```text id="r9x1k9"
Client reuse key untuk body berbeda.
Server mengembalikan response lama untuk request berbeda.
```

Solusi:

```text id="z722bs"
Simpan request_hash.
Duplicate key + different hash = 409 Conflict.
```

---

## Anti-pattern 5 - Outbox publish sebelum commit

Buruk:

```text id="t5r7ld"
publish event
then commit DB
```

Jika commit gagal:

```text id="c1mm1g"
event sudah tersebar tapi state tidak ada.
```

Benar:

```text id="9on4df"
DB transaction:
  mutate state
  insert outbox
commit

publisher:
  publish outbox event
```

---

## Anti-pattern 6 - Consumer tidak idempotent

Risiko:

```text id="q5uq89"
At-least-once delivery membuat duplicate effect:
- double debit
- duplicate task
- duplicate notification
- duplicate status transition
```

Solusi:

```text id="7fin2p"
Inbox/dedupe key + guarded mutation + unique constraint.
```

---

# 24. Production Checklist

| Checklist | Pertanyaan |
|---|---|
| Claim safety | Apakah worker memakai `FOR UPDATE SKIP LOCKED`? |
| Short transaction | Apakah claim dan mark result transaksi pendek? |
| Lock token | Apakah result update memakai `lock_token`? |
| Lease timeout | Apakah stuck `PROCESSING` bisa direqueue? |
| Attempt count | Apakah retry dibatasi? |
| Backoff | Apakah retry punya delay? |
| Dead-letter | Apakah failure permanen terpisah? |
| Idempotency | Apakah POST command punya key + request hash? |
| Response cache | Apakah idempotent completed request mengembalikan response sama? |
| Outbox atomic | Apakah state change + outbox commit bersama? |
| Publisher idempotency | Apakah publish retry aman? |
| Inbox dedupe | Apakah incoming event punya unique message key? |
| Reservation guard | Apakah quota/inventory update memakai available guard? |
| Ledger | Apakah reservation/consume/release auditable? |
| Index | Apakah queue/outbox/inbox claim query punya partial index? |
| Monitoring | Apakah queue depth, lag, stale, failed bisa dimonitor? |
| Cleanup | Apakah old rows dibersihkan chunked? |
| Error classification | Apakah worker membedakan transient vs business failure? |

---

# 25. Mini Lab

## Step 1 - Create queue table

```sql id="fh1nju"
CREATE TABLE workflow_job (
    tenant_id      bigint NOT NULL,
    job_id         bigint GENERATED ALWAYS AS IDENTITY,
    job_type       text NOT NULL,
    payload        jsonb NOT NULL,
    status         text NOT NULL DEFAULT 'READY',
    available_at   timestamptz NOT NULL DEFAULT clock_timestamp(),
    locked_by      text,
    locked_at      timestamptz,
    lock_token     uuid,
    attempt_count  integer NOT NULL DEFAULT 0,
    max_attempts   integer NOT NULL DEFAULT 3,
    last_error     text,
    created_at     timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_workflow_job
        PRIMARY KEY (tenant_id, job_id),

    CONSTRAINT chk_workflow_job__status
        CHECK (status IN ('READY', 'PROCESSING', 'DONE', 'DEAD_LETTER'))
);

CREATE INDEX idx_workflow_job__ready_claim
ON workflow_job (tenant_id, available_at ASC, job_id ASC)
WHERE status = 'READY';
```

## Step 2 - Insert jobs

```sql id="flpfbu"
INSERT INTO workflow_job (
    tenant_id,
    job_type,
    payload
)
SELECT
    1001,
    'SEND_NOTIFICATION',
    jsonb_build_object('caseId', uuidv7(), 'recipient', 'user-' || g)
FROM generate_series(1, 10) AS g;
```

## Step 3 - Claim from Session A

```sql id="5ogdkz"
BEGIN;

WITH candidate AS (
    SELECT tenant_id, job_id
    FROM workflow_job
    WHERE tenant_id = 1001
      AND status = 'READY'
    ORDER BY available_at, job_id
    LIMIT 3
    FOR UPDATE SKIP LOCKED
)
UPDATE workflow_job j
SET status = 'PROCESSING',
    locked_by = 'worker-A',
    locked_at = clock_timestamp(),
    lock_token = uuidv7(),
    attempt_count = attempt_count + 1
FROM candidate c
WHERE j.tenant_id = c.tenant_id
  AND j.job_id = c.job_id
RETURNING j.job_id, j.status, j.locked_by, j.lock_token;

COMMIT;
```

## Step 4 - Claim from Session B

```sql id="u5kyo6"
WITH candidate AS (
    SELECT tenant_id, job_id
    FROM workflow_job
    WHERE tenant_id = 1001
      AND status = 'READY'
    ORDER BY available_at, job_id
    LIMIT 3
    FOR UPDATE SKIP LOCKED
)
UPDATE workflow_job j
SET status = 'PROCESSING',
    locked_by = 'worker-B',
    locked_at = clock_timestamp(),
    lock_token = uuidv7(),
    attempt_count = attempt_count + 1
FROM candidate c
WHERE j.tenant_id = c.tenant_id
  AND j.job_id = c.job_id
RETURNING j.job_id, j.status, j.locked_by, j.lock_token;
```

Expected:

```text id="r1plmc"
Session B mendapatkan job berbeda dari worker-A.
Tidak double-claim job yang sama.
```

## Step 5 - Mark one done

```sql id="8cf5es"
UPDATE workflow_job
SET status = 'DONE',
    locked_by = NULL,
    locked_at = NULL,
    lock_token = NULL
WHERE tenant_id = 1001
  AND job_id = :jobId
  AND status = 'PROCESSING'
  AND lock_token = :lockToken
RETURNING job_id, status;
```

---

## 26. Ringkasan Praktis

```text id="xs4d30"
1. PostgreSQL queue cocok untuk workload kecil-menengah dan transactional worker pattern.
2. Worker claim harus memakai FOR UPDATE SKIP LOCKED untuk menghindari double-claim.
3. Claim transaction harus pendek; proses external dilakukan setelah claim commit.
4. Gunakan lock_token agar worker lama tidak menulis hasil setelah lease berpindah.
5. Gunakan lease timeout untuk requeue job stuck PROCESSING.
6. Retry harus punya attempt_count, backoff, dan dead-letter.
7. Reservation aman memakai atomic UPDATE dengan available guard + ledger.
8. Idempotency key wajib untuk retry-safe POST; simpan request_hash.
9. Outbox membuat state change + intent-to-publish atomic di DB.
10. Outbox publisher biasanya at-least-once; consumer harus idempotent.
11. Inbox table memberi dedupe dan audit untuk incoming event.
12. Monitoring queue depth, outbox lag, stale processing, dan failed jobs wajib ada.
```

---

# Status Seri

**Seri 13/22 selesai.**

Rekomendasi lanjut ke:

**Seri 14 - Partitioning for PostgreSQL OLTP: time/tenant/lifecycle partitioning, audit/outbox/history partition, partition pruning, index strategy, retention, dan trade-off production.**

---

**Sources:**

- [Documentation: 18: SELECT - PostgreSQL](https://www.postgresql.org/docs/current/sql-select.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:32:39 PM

# PostgreSQL OLTP - Seri 14/22  
## Partitioning for PostgreSQL OLTP: Time/Tenant/Lifecycle Partitioning, Audit/Outbox/History Partition, Partition Pruning, Index Strategy, Retention, dan Trade-off Production

Seri ini fokus pada **partitioning yang praktis untuk OLTP production**. Partitioning bukan “performance magic”; partitioning adalah teknik untuk memecah satu logical table besar menjadi physical partitions yang lebih kecil agar query, maintenance, retention, dan archival lebih terkendali. PostgreSQL mendokumentasikan bahwa salah satu benefit penting partitioning adalah maintenance: old data bisa dihapus/di-detach cepat dengan manipulasi struktur partition, bukan delete jutaan row satu per satu. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html))

---

## 1. Kapan Partitioning Layak Dipertimbangkan?

```text id="ri1e5k"
Partitioning layak jika:
1. table tumbuh sangat besar
2. query sering menyentuh subset waktu/tenant/status tertentu
3. retention/archival butuh drop/detach data lama
4. index global table terlalu besar
5. vacuum/bloat pada table besar mulai berat
6. audit/history/outbox/inbox/idempotency tumbuh cepat
```

Jangan partition hanya karena “best practice”. Banyak OLTP table lebih baik tetap normal table + index yang benar.

| Table | Partitioning? | Alasan |
|---|---:|---|
| `regulatory_case` current state | Mungkin, hati-hati | Current table aktif; partition bisa menambah kompleksitas |
| `case_audit_log` | Ya, sering cocok | Append-only, time-based retention |
| `case_status_history` | Ya, jika besar | Timeline/history tumbuh terus |
| `outbox_event` | Mungkin | Jika event volume tinggi dan retention pendek |
| `inbox_event` | Mungkin | Dedup window + cleanup |
| `idempotency_request` | Mungkin | TTL pendek, cleanup rutin |
| `workflow_job` | Jarang dulu | Biasanya partial index cukup |
| `import_staging` | Mungkin | Per import/date cleanup |
| `ref_case_type` | Tidak | Small reference table |
| `case_party` | Jarang | Biasanya child table by parent ID cukup |

---

## 2. Mental Model Partitioning

```text id="i4h1dy"
Partitioned Table
│
├─ Parent table
│  ├─ logical table
│  ├─ no actual row storage
│  ├─ owns partition definition
│  └─ can have virtual indexes/constraints
│
├─ Child partitions
│  ├─ actual data storage
│  ├─ each partition has its own physical index
│  ├─ can be attached/detached
│  └─ can be dropped/archived independently
│
├─ Partition key
│  ├─ time: occurred_at / created_at
│  ├─ tenant: tenant_id
│  ├─ lifecycle: status
│  └─ composite / subpartition
│
├─ Query pruning
│  ├─ WHERE constrains partition key
│  ├─ planner excludes irrelevant partitions
│  └─ bad query scans too many partitions
│
└─ Maintenance
   ├─ create future partitions
   ├─ attach partition
   ├─ detach old partition
   ├─ archive detached table
   └─ drop partition
```

PostgreSQL declarative partitioning supports partitioned tables whose data is stored in child partitions; indexes declared on a partitioned table are “virtual”, while actual indexes exist on child partitions. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html))

---

## 3. Partitioning Strategy Table

| Strategy | PostgreSQL shape | Cocok untuk | Risiko |
|---|---|---|---|
| Range by time | `PARTITION BY RANGE (occurred_at)` | audit, history, outbox, inbox, time-series-ish OLTP | query wajib filter time agar pruning efektif |
| List by tenant | `PARTITION BY LIST (tenant_id)` | few large tenants, tenant isolation | tenant baru perlu partition; banyak tenant bisa ribet |
| Hash by tenant | `PARTITION BY HASH (tenant_id)` | banyak tenant, distribute load | retention per tenant/time lebih sulit |
| Range by lifecycle time | `PARTITION BY RANGE (created_at)` + partial index status | outbox/inbox/job retention | status update bisa pindah partition jika key status; hindari partition by mutable status |
| Composite | range time + hash/list tenant | very large data | operational complexity tinggi |
| Default partition | `DEFAULT` | safety net for unexpected values | bisa menyembunyikan missing partition dan mengganggu attach/pruning |

Rule praktis:

```text id="vaow09"
Untuk OLTP enterprise:
1. audit/history/outbox/inbox → range by time biasanya paling natural
2. tenant partitioning hanya jika tenant distribution memang ekstrem
3. jangan partition by kolom yang sering berubah seperti status
4. current state table jangan dipartisi terlalu cepat
```

---

## 4. Pattern 1 - Audit Log Partition by Month

Audit log adalah kandidat paling aman.

```sql id="26b7zl"
CREATE TABLE case_audit_log (
    tenant_id      bigint NOT NULL,
    audit_id       bigint GENERATED ALWAYS AS IDENTITY,
    case_id        uuid NOT NULL,
    event_type     text NOT NULL,
    operation      text NOT NULL,
    actor_id       text,
    occurred_at    timestamptz NOT NULL,
    request_id     text,
    correlation_id text,
    metadata       jsonb NOT NULL DEFAULT '{}'::jsonb,

    CONSTRAINT chk_case_audit_log__metadata_object
        CHECK (jsonb_typeof(metadata) = 'object'),

    CONSTRAINT pk_case_audit_log
        PRIMARY KEY (tenant_id, occurred_at, audit_id)
)
PARTITION BY RANGE (occurred_at);
```

Kenapa primary key memasukkan `occurred_at`?

PostgreSQL punya limitation penting: unique/primary key constraint pada partitioned table harus mencakup semua kolom partition key; ini karena tiap child index hanya bisa menegakkan uniqueness di partition masing-masing, sehingga partition structure harus ikut menjamin tidak ada duplicate lintas partition. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html))

Partition bulanan:

```sql id="jrlj0x"
CREATE TABLE case_audit_log_2026_07
PARTITION OF case_audit_log
FOR VALUES FROM ('2026-07-01 00:00:00+00')
TO ('2026-08-01 00:00:00+00');

CREATE TABLE case_audit_log_2026_08
PARTITION OF case_audit_log
FOR VALUES FROM ('2026-08-01 00:00:00+00')
TO ('2026-09-01 00:00:00+00');
```

Index timeline per case:

```sql id="7fktps"
CREATE INDEX idx_case_audit_log__case_timeline
ON case_audit_log (
    tenant_id,
    case_id,
    occurred_at ASC,
    audit_id ASC
);
```

PostgreSQL akan membuat matching index pada partitions jika index dibuat di parent partitioned table; parent index bersifat virtual dan child indexes yang benar-benar menyimpan data. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html))

---

## 5. Query dengan Partition Pruning

Query bagus:

```sql id="r6x5rd"
SELECT
    audit_id,
    event_type,
    actor_id,
    occurred_at,
    metadata
FROM case_audit_log
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND occurred_at >= :from
  AND occurred_at < :to
ORDER BY occurred_at ASC, audit_id ASC
LIMIT :limit;
```

Kenapa bagus?

```text id="lindbz"
WHERE membatasi partition key occurred_at.
Planner bisa exclude partitions di luar range.
Index case timeline bisa dipakai di partition yang relevan.
```

Query buruk:

```sql id="n1ko6u"
SELECT *
FROM case_audit_log
WHERE tenant_id = :tenantId
  AND case_id = :caseId
ORDER BY occurred_at DESC
LIMIT 100;
```

Masalah:

```text id="rabk7t"
Tidak ada filter partition key.
PostgreSQL mungkin harus mempertimbangkan banyak partition.
```

PostgreSQL docs mengingatkan agar `enable_partition_pruning` tidak dimatikan karena tanpa partition pruning query tidak dioptimalkan seperti yang diharapkan. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html))

---

## 6. Pattern 2 - Status History Partition by Changed Time

```sql id="syrh21"
CREATE TABLE case_status_history (
    tenant_id      bigint NOT NULL,
    history_id     bigint GENERATED ALWAYS AS IDENTITY,
    case_id        uuid NOT NULL,
    from_status    text,
    to_status      text NOT NULL,
    action         text NOT NULL,
    changed_by     text NOT NULL,
    changed_at     timestamptz NOT NULL,
    request_id     text,
    correlation_id text,

    CONSTRAINT pk_case_status_history
        PRIMARY KEY (tenant_id, changed_at, history_id)
)
PARTITION BY RANGE (changed_at);
```

Monthly partitions:

```sql id="dg4n34"
CREATE TABLE case_status_history_2026_07
PARTITION OF case_status_history
FOR VALUES FROM ('2026-07-01 00:00:00+00')
TO ('2026-08-01 00:00:00+00');
```

Timeline index:

```sql id="o67jij"
CREATE INDEX idx_case_status_history__case_timeline
ON case_status_history (
    tenant_id,
    case_id,
    changed_at ASC,
    history_id ASC
);
```

Query:

```sql id="pk3vzv"
SELECT
    history_id,
    from_status,
    to_status,
    action,
    changed_by,
    changed_at
FROM case_status_history
WHERE tenant_id = :tenantId
  AND case_id = :caseId
  AND changed_at >= :from
  AND changed_at < :to
ORDER BY changed_at ASC, history_id ASC;
```

Practical rule:

```text id="3ce54n"
Untuk partitioned history/audit, API timeline sebaiknya meminta time range.
Tanpa time range, query bisa menyentuh banyak partition.
```

---

## 7. Pattern 3 - Outbox Partition by Created Time

Outbox bisa partitioned jika event volume tinggi.

```sql id="fumrl3"
CREATE TABLE outbox_event (
    tenant_id         bigint NOT NULL,
    outbox_id         uuid NOT NULL DEFAULT uuidv7(),
    aggregate_type    text NOT NULL,
    aggregate_id      uuid NOT NULL,
    aggregate_version bigint,
    event_type        text NOT NULL,
    payload           jsonb NOT NULL,
    status            text NOT NULL DEFAULT 'NEW',
    available_at      timestamptz NOT NULL DEFAULT clock_timestamp(),
    locked_by         text,
    locked_at         timestamptz,
    lock_token        uuid,
    attempt_count     integer NOT NULL DEFAULT 0,
    max_attempts      integer NOT NULL DEFAULT 10,
    last_error        text,
    created_at        timestamptz NOT NULL,
    published_at      timestamptz,

    CONSTRAINT pk_outbox_event
        PRIMARY KEY (tenant_id, created_at, outbox_id),

    CONSTRAINT chk_outbox_event__status
        CHECK (status IN ('NEW', 'PROCESSING', 'PUBLISHED', 'FAILED')),

    CONSTRAINT chk_outbox_event__payload_object
        CHECK (jsonb_typeof(payload) = 'object')
)
PARTITION BY RANGE (created_at);
```

Partition:

```sql id="9as8sq"
CREATE TABLE outbox_event_2026_07
PARTITION OF outbox_event
FOR VALUES FROM ('2026-07-01 00:00:00+00')
TO ('2026-08-01 00:00:00+00');
```

Claim index:

```sql id="1u6w03"
CREATE INDEX idx_outbox_event__new_claim
ON outbox_event (
    tenant_id,
    available_at ASC,
    created_at ASC,
    outbox_id ASC
)
WHERE status = 'NEW';
```

Worker query:

```sql id="cvi764"
WITH candidate AS (
    SELECT
        tenant_id,
        created_at,
        outbox_id
    FROM outbox_event
    WHERE tenant_id = :tenantId
      AND status = 'NEW'
      AND available_at <= clock_timestamp()
      AND created_at >= clock_timestamp() - interval '7 days'
    ORDER BY available_at ASC, created_at ASC, outbox_id ASC
    LIMIT :batchSize
    FOR UPDATE SKIP LOCKED
)
UPDATE outbox_event e
SET status = 'PROCESSING',
    locked_by = :workerId,
    locked_at = clock_timestamp(),
    lock_token = uuidv7(),
    attempt_count = attempt_count + 1
FROM candidate c
WHERE e.tenant_id = c.tenant_id
  AND e.created_at = c.created_at
  AND e.outbox_id = c.outbox_id
RETURNING
    e.tenant_id,
    e.created_at,
    e.outbox_id,
    e.event_type,
    e.payload,
    e.lock_token,
    e.attempt_count;
```

Catatan penting:

```text id="vumrwm"
Jika outbox retention pendek, partitioning by created_at membantu detach/drop published event lama.
Tetapi worker query harus tetap diberi window created_at agar pruning efektif.
```

---

## 8. Pattern 4 - Idempotency Request Partition by Created Time

Idempotency table biasanya TTL pendek.

```sql id="e0tn44"
CREATE TABLE idempotency_request (
    tenant_id        bigint NOT NULL,
    idempotency_key text NOT NULL,
    command_name    text NOT NULL,
    request_hash    text NOT NULL,
    status          text NOT NULL,
    response_code   integer,
    response_body   jsonb,
    created_at      timestamptz NOT NULL,
    completed_at    timestamptz,

    CONSTRAINT pk_idempotency_request
        PRIMARY KEY (
            tenant_id,
            created_at,
            idempotency_key,
            command_name
        ),

    CONSTRAINT chk_idempotency_request__status
        CHECK (status IN ('PROCESSING', 'COMPLETED', 'FAILED'))
)
PARTITION BY RANGE (created_at);
```

Potential issue:

```text id="93b1n9"
Natural lookup idempotency biasanya:
tenant_id + idempotency_key + command_name

Tetapi primary/unique pada partitioned table harus include created_at
jika partition key adalah created_at.
```

Artinya, untuk idempotency, time partitioning punya trade-off serius: lookup duplicate by key harus tahu `created_at` atau harus scan recent partitions.

Practical alternatives:

| Option | Design |
|---|---|
| Keep normal table | Simpler; cleanup chunked |
| Partition by hash idempotency key | Better lookup distribution, worse TTL cleanup |
| Partition by created_at | Great TTL cleanup, but duplicate lookup needs recent-window scan |
| Use separate small key table + partitioned response/history | More complex, better large scale |

Untuk banyak sistem, idempotency table cukup normal table + index + chunked cleanup.

---

## 9. Pattern 5 - Tenant Partitioning

Tenant partitioning hanya masuk akal jika:

```text id="yckwpx"
1. ada sedikit tenant sangat besar
2. tenant isolation operasional penting
3. query hampir selalu tenant-scoped
4. retention/migration per tenant berbeda
5. tenant besar butuh tablespace berbeda
```

List partition:

```sql id="x09fn7"
CREATE TABLE regulatory_case_tenant_partitioned (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL,
    status       text NOT NULL,
    title        text NOT NULL,
    created_at   timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_regulatory_case_tenant_partitioned
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case_tenant_partitioned__case_number
        UNIQUE (tenant_id, case_number)
)
PARTITION BY LIST (tenant_id);
```

Partitions:

```sql id="ue6tox"
CREATE TABLE regulatory_case_tenant_1001
PARTITION OF regulatory_case_tenant_partitioned
FOR VALUES IN (1001);

CREATE TABLE regulatory_case_tenant_1002
PARTITION OF regulatory_case_tenant_partitioned
FOR VALUES IN (1002);
```

Masalah list tenant:

```text id="m0e9e2"
Tenant baru butuh DDL partition baru.
Jika tenant ribuan, management berat.
Jika tenant kecil-kecil, overhead partition bisa lebih buruk.
```

Hash partition by tenant:

```sql id="ayiw8e"
CREATE TABLE case_audit_log_hash_tenant (
    tenant_id    bigint NOT NULL,
    audit_id     bigint GENERATED ALWAYS AS IDENTITY,
    case_id      uuid NOT NULL,
    occurred_at  timestamptz NOT NULL,
    event_type   text NOT NULL,

    CONSTRAINT pk_case_audit_log_hash_tenant
        PRIMARY KEY (tenant_id, audit_id)
)
PARTITION BY HASH (tenant_id);
```

Partitions:

```sql id="h3of2i"
CREATE TABLE case_audit_log_hash_tenant_p0
PARTITION OF case_audit_log_hash_tenant
FOR VALUES WITH (MODULUS 8, REMAINDER 0);

CREATE TABLE case_audit_log_hash_tenant_p1
PARTITION OF case_audit_log_hash_tenant
FOR VALUES WITH (MODULUS 8, REMAINDER 1);
```

Hash partitioning distributes tenants, tetapi retention by time menjadi lebih sulit.

---

## 10. Pattern 6 - Composite Partitioning: Range by Time + Hash by Tenant

Untuk audit/event volume sangat besar:

```sql id="nc477j"
CREATE TABLE case_audit_log_large (
    tenant_id    bigint NOT NULL,
    audit_id     bigint GENERATED ALWAYS AS IDENTITY,
    case_id      uuid NOT NULL,
    occurred_at  timestamptz NOT NULL,
    event_type   text NOT NULL,
    metadata     jsonb NOT NULL DEFAULT '{}'::jsonb,

    CONSTRAINT pk_case_audit_log_large
        PRIMARY KEY (tenant_id, occurred_at, audit_id)
)
PARTITION BY RANGE (occurred_at);
```

Monthly partition subpartitioned by hash tenant:

```sql id="pnhny5"
CREATE TABLE case_audit_log_large_2026_07
PARTITION OF case_audit_log_large
FOR VALUES FROM ('2026-07-01 00:00:00+00')
TO ('2026-08-01 00:00:00+00')
PARTITION BY HASH (tenant_id);

CREATE TABLE case_audit_log_large_2026_07_p0
PARTITION OF case_audit_log_large_2026_07
FOR VALUES WITH (MODULUS 4, REMAINDER 0);

CREATE TABLE case_audit_log_large_2026_07_p1
PARTITION OF case_audit_log_large_2026_07
FOR VALUES WITH (MODULUS 4, REMAINDER 1);
```

Kapan cocok:

```text id="zfpkfi"
1. audit/event table sangat besar
2. query selalu punya time range
3. tenant skew besar
4. maintenance automation sudah matang
```

Kapan hindari:

```text id="prp8st"
1. tim belum siap automation partition
2. volume belum besar
3. query sering tanpa time range
4. schema migration masih sering
```

---

## 11. Partition Maintenance: Create Future Partitions

Jangan tunggu insert gagal karena partition belum ada. PostgreSQL menyatakan insert ke parent partitioned table yang tidak cocok dengan partition yang ada akan error; partition baru perlu dibuat/ditambahkan. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html))

Contoh create next month:

```sql id="4upwfi"
CREATE TABLE IF NOT EXISTS case_audit_log_2026_09
PARTITION OF case_audit_log
FOR VALUES FROM ('2026-09-01 00:00:00+00')
TO ('2026-10-01 00:00:00+00');
```

Operational rule:

```text id="yr6h9y"
Buat partition minimal 1-3 periode ke depan:
- daily partition: buat beberapa hari ke depan
- monthly partition: buat 2-3 bulan ke depan
- yearly partition: buat tahun depan sebelum pergantian tahun
```

Automation bisa berupa:

```text id="y36as5"
1. migration script
2. scheduled DBA job
3. application admin job
4. CI/CD release migration
5. PostgreSQL extension/maintenance tool jika disetujui platform
```

---

## 12. Attach Partition untuk Low-Downtime Load

PostgreSQL mendokumentasikan bahwa `ATTACH PARTITION` bisa lebih friendly terhadap operasi concurrent daripada membuat partition langsung dengan `CREATE TABLE ... PARTITION OF`; attach mengambil `SHARE UPDATE EXCLUSIVE` lock pada parent, sedangkan table yang di-attach dicek terhadap partition constraint. Scan validasi bisa dihindari dengan CHECK constraint yang sesuai. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html))

Pattern:

```sql id="9w6r34"
CREATE TABLE case_audit_log_2026_10_staging
(LIKE case_audit_log INCLUDING DEFAULTS INCLUDING CONSTRAINTS);

ALTER TABLE case_audit_log_2026_10_staging
ADD CONSTRAINT chk_case_audit_log_2026_10_bounds
CHECK (
    occurred_at >= TIMESTAMPTZ '2026-10-01 00:00:00+00'
    AND occurred_at < TIMESTAMPTZ '2026-11-01 00:00:00+00'
);

-- load/check data if needed

ALTER TABLE case_audit_log
ATTACH PARTITION case_audit_log_2026_10_staging
FOR VALUES FROM ('2026-10-01 00:00:00+00')
TO ('2026-11-01 00:00:00+00');
```

Rule:

```text id="v48kcv"
Untuk attach existing large table:
tambahkan CHECK constraint yang match partition bound
agar PostgreSQL tidak perlu scan penuh saat attach.
```

---

## 13. Detach / Drop Partition untuk Retention

Drop old partition:

```sql id="b1rgau"
DROP TABLE case_audit_log_2025_01;
```

Cepat karena tidak delete row satu per satu, tetapi PostgreSQL docs mencatat `DROP TABLE` partition lama membutuhkan `ACCESS EXCLUSIVE` lock pada parent. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html))

Detach untuk archive dulu:

```sql id="4rdok7"
ALTER TABLE case_audit_log
DETACH PARTITION case_audit_log_2025_01;
```

Detach concurrently:

```sql id="ko2jyf"
ALTER TABLE case_audit_log
DETACH PARTITION case_audit_log_2025_01 CONCURRENTLY;
```

`DETACH PARTITION CONCURRENTLY` memakai lock level lebih rendah untuk menghindari blocking session yang mengakses parent, tetapi ada restriction: tidak bisa dijalankan dalam transaction block dan tidak diperbolehkan jika partitioned table punya default partition. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-altertable.html))

Setelah detach:

```sql id="6lb0mn"
-- optional backup/archive
COPY case_audit_log_2025_01 TO '/archive/case_audit_log_2025_01.csv' CSV HEADER;

-- after archive verification
DROP TABLE case_audit_log_2025_01;
```

---

## 14. Index Strategy pada Partitioned Table

### Parent index

```sql id="z9j0wb"
CREATE INDEX idx_case_audit_log__case_timeline
ON case_audit_log (
    tenant_id,
    case_id,
    occurred_at ASC,
    audit_id ASC
);
```

PostgreSQL akan membuat matching index pada existing partitions dan partition baru/attached nanti akan mendapat index yang sesuai; parent index virtual, child index aktual. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html))

### Masalah create index di table partitioned besar

PostgreSQL docs menyatakan `CREATE INDEX CONCURRENTLY` tidak bisa digunakan langsung pada partitioned table parent; workaround-nya adalah `CREATE INDEX ON ONLY` parent agar invalid, lalu buat index pada tiap partition dengan `CONCURRENTLY`, attach child indexes ke parent index, dan parent index akan valid setelah semua partition attached. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html))

Pattern high-level:

```sql id="npe2f6"
CREATE INDEX idx_case_audit_log__case_timeline_new
ON ONLY case_audit_log (
    tenant_id,
    case_id,
    occurred_at ASC,
    audit_id ASC
);

CREATE INDEX CONCURRENTLY idx_case_audit_log_2026_07__case_timeline_new
ON case_audit_log_2026_07 (
    tenant_id,
    case_id,
    occurred_at ASC,
    audit_id ASC
);

ALTER INDEX idx_case_audit_log__case_timeline_new
ATTACH PARTITION idx_case_audit_log_2026_07__case_timeline_new;
```

Practical note:

```text id="vqdu3j"
Index rollout partitioned table perlu runbook.
Jangan asal CREATE INDEX besar di parent production.
```

---

## 15. BRIN Index untuk Partitioned Audit

BRIN cocok untuk table sangat besar yang kolomnya berkorelasi dengan physical location, seperti append-only timestamp. BRIN menyimpan summary per block range, kecil, lossy, dan executor akan recheck tuples yang match summary. ([PostgreSQL](https://www.postgresql.org/docs/current/brin.html))

Contoh per-partition BRIN:

```sql id="4cktlr"
CREATE INDEX idx_case_audit_log_2026_07__occurred_brin
ON case_audit_log_2026_07
USING brin (occurred_at);
```

Atau parent BRIN jika cocok:

```sql id="8pvdki"
CREATE INDEX idx_case_audit_log__occurred_brin
ON case_audit_log
USING brin (occurred_at);
```

Kapan cocok:

```text id="v6nykl"
1. append-only audit/event
2. query range waktu besar
3. data physically roughly ordered by time
4. index size harus kecil
```

Kapan B-tree lebih cocok:

```text id="ww8ths"
1. point lookup
2. timeline per case
3. small range dengan high selectivity
4. ORDER BY + LIMIT
```

---

## 16. Partition Key Design: Jangan Salah Pilih

| Candidate key | Cocok untuk | Risiko |
|---|---|---|
| `created_at` | append data, retention by creation | updates by lifecycle tidak pindah partition |
| `occurred_at` | audit/event actual occurrence | ingestion late event butuh partition lama tetap ada |
| `published_at` | retention published outbox | NULL saat NEW, bukan key bagus |
| `status` | lifecycle table | status berubah → row movement/complexity; hindari |
| `tenant_id` | tenant isolation/skew | tenant onboarding/too many partitions |
| `(created_at, tenant_id)` | huge multi-tenant event | complexity |
| expression partition key | special cases | unique/PK limitation lebih sulit |

Rule:

```text id="koj30g"
Partition key harus:
1. sering muncul di WHERE
2. stabil/immutable-ish
3. cocok untuk retention
4. tidak sering di-update
5. masuk akal untuk future partition creation
```

PostgreSQL docs juga menyatakan `BEFORE ROW` trigger pada `INSERT` tidak bisa mengubah partition tujuan final row, jadi jangan bergantung pada trigger untuk memindahkan partition key saat insert. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html))

---

## 17. Default Partition: Safety Net atau Trap?

```sql id="ahksp1"
CREATE TABLE case_audit_log_default
PARTITION OF case_audit_log DEFAULT;
```

Kelebihan:

```text id="a35iye"
1. insert tidak langsung gagal saat partition missing
2. safety net untuk unexpected timestamp
3. bisa membantu incident response
```

Risiko:

```text id="qpqs6d"
1. data nyasar ke default dan tidak ter-prune baik
2. attach partition baru bisa perlu scan default partition
3. operasional bisa lalai membuat partition sebenarnya
```

PostgreSQL docs menyarankan memberi CHECK constraint pada default partition untuk mengecualikan partition baru yang akan di-attach; tanpa itu, default partition bisa discan untuk memastikan tidak ada row yang seharusnya berada di partition baru. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html))

Practical rule:

```text id="ly7r7z"
Default partition boleh sebagai safety net,
tetapi harus dimonitor dan dikosongkan/ditertibkan.
Jangan jadikan default partition tempat data normal.
```

Monitoring:

```sql id="d40r0k"
SELECT count(*)
FROM case_audit_log_default;
```

---

## 18. Foreign Key dan Partitioning

Beberapa caution praktis:

```text id="70kgxn"
1. FK dari child ke partitioned parent bisa valid, tetapi lock/maintenance harus dipahami.
2. FK yang mereferensi partitioned audit/history jarang perlu.
3. Partitioned table parent constraint/index bersifat virtual.
4. Unique/PK pada partitioned table harus include partition key.
5. Attach/detach partition dapat berinteraksi dengan FK locks.
```

Untuk audit/history, sering lebih praktis:

```text id="l4xkft"
- simpan tenant_id dan case_id untuk trace
- gunakan FK hanya jika kebutuhan integrity kuat dan maintenance impact diterima
- jangan FK semua audit/event besar secara membabi-buta jika mengganggu retention
```

---

## 19. MyBatis Query Pattern untuk Partition Pruning

Mapper timeline yang baik:

```xml id="lssdw5"
<select id="findCaseAuditTimeline" resultMap="CaseAuditLogMap">
  SELECT
      audit_id,
      event_type,
      operation,
      actor_id,
      occurred_at,
      request_id,
      correlation_id,
      metadata
  FROM case_audit_log
  WHERE tenant_id = #{tenantId}
    AND case_id = #{caseId}
    AND occurred_at &gt;= #{from}
    AND occurred_at &lt; #{to}
    <if test="lastOccurredAt != null and lastAuditId != null">
      AND (occurred_at, audit_id) &gt; (#{lastOccurredAt}, #{lastAuditId})
    </if>
  ORDER BY occurred_at ASC, audit_id ASC
  LIMIT #{limit}
</select>
```

Bad mapper:

```xml id="td7cne"
<select id="findCaseAuditTimelineBad" resultMap="CaseAuditLogMap">
  SELECT *
  FROM case_audit_log
  WHERE tenant_id = #{tenantId}
    AND case_id = #{caseId}
  ORDER BY occurred_at ASC
  LIMIT #{limit}
</select>
```

Rule:

```text id="4f7nax"
Untuk partitioned time table,
mapper method harus membawa time range sebagai required parameter,
bukan optional afterthought.
```

---

## 20. Partition Maintenance Table

Untuk automation, simpan metadata maintenance.

```sql id="wa9lba"
CREATE TABLE partition_maintenance_log (
    maintenance_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    table_name     text NOT NULL,
    partition_name text NOT NULL,
    operation      text NOT NULL,
    period_from    timestamptz,
    period_to      timestamptz,
    status         text NOT NULL,
    message        text,
    executed_by    text NOT NULL,
    executed_at    timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT chk_partition_maintenance_log__operation
        CHECK (operation IN ('CREATE', 'ATTACH', 'DETACH', 'DROP', 'ARCHIVE')),

    CONSTRAINT chk_partition_maintenance_log__status
        CHECK (status IN ('STARTED', 'SUCCESS', 'FAILED'))
);
```

Automation checklist:

```text id="745tr8"
1. create future partitions
2. verify no missing partition
3. monitor default partition row count
4. detach partitions past retention
5. archive detached partitions
6. drop after archive verified
7. log every operation
```

---

## 21. EXPLAIN untuk Partition Pruning

Test query:

```sql id="pxdkc2"
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    audit_id,
    event_type,
    occurred_at
FROM case_audit_log
WHERE tenant_id = 1001
  AND case_id = '019535d9-3df7-79fb-b466-fa907fa17f9e'
  AND occurred_at >= TIMESTAMPTZ '2026-07-01 00:00:00+00'
  AND occurred_at < TIMESTAMPTZ '2026-08-01 00:00:00+00'
ORDER BY occurred_at ASC, audit_id ASC
LIMIT 100;
```

Yang dicari:

```text id="axfgjh"
1. hanya partition bulan terkait yang discan
2. tidak semua partitions muncul di plan
3. index scan di partition yang relevan
4. tidak ada sort mahal jika index order cocok
5. buffers read/hit wajar
```

Jika banyak partition tersentuh:

```text id="xgojc0"
cek:
- WHERE tidak constrain partition key
- parameter type/cast salah
- function pada partition key menghalangi pruning
- generic plan/prepared statement issue
- enable_partition_pruning off
```

---

## 22. Migration dari Non-Partitioned ke Partitioned Table

High-level safe path:

```text id="lcbkj1"
1. buat table partitioned baru
2. buat partitions sesuai historical range
3. buat indexes/constraints
4. backfill data per chunk/per partition
5. dual-write atau maintenance window
6. validate row counts/checksum
7. switch application/view/synonym/rename
8. monitor query plan
9. drop old table setelah confidence
```

Example skeleton:

```sql id="2d6hyy"
CREATE TABLE case_audit_log_new (
    LIKE case_audit_log INCLUDING DEFAULTS INCLUDING CONSTRAINTS
)
PARTITION BY RANGE (occurred_at);
```

Backfill per month:

```sql id="hb8abh"
INSERT INTO case_audit_log_new (
    tenant_id,
    audit_id,
    case_id,
    event_type,
    operation,
    actor_id,
    occurred_at,
    request_id,
    correlation_id,
    metadata
)
SELECT
    tenant_id,
    audit_id,
    case_id,
    event_type,
    operation,
    actor_id,
    occurred_at,
    request_id,
    correlation_id,
    metadata
FROM case_audit_log_old
WHERE occurred_at >= TIMESTAMPTZ '2026-07-01'
  AND occurred_at < TIMESTAMPTZ '2026-08-01';
```

Rule:

```text id="f3v7xo"
Migration partitioning bukan ALTER ringan untuk table besar.
Perlu runbook, validation, rollback, dan observability.
```

---

## 23. Anti-Pattern

### Anti-pattern 1 - Partition current table terlalu dini

```text id="1uqhb3"
regulatory_case current state baru 5 juta row,
query sudah punya index bagus,
retention tidak butuh drop partition.
```

Partitioning bisa menambah:

```text id="l3r2k3"
DDL maintenance
query complexity
PK/unique limitation
migration complexity
operational runbook
```

Mulai dari index yang benar dulu.

---

### Anti-pattern 2 - Partition by status

Status berubah:

```text id="uu2kc5"
DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED
```

Jika status menjadi partition key, update status bisa menyebabkan row movement antar partition dan memperumit lock/index/maintenance.

Lebih baik:

```text id="ybub6d"
partition by stable time key
index/partial index by status
```

---

### Anti-pattern 3 - Query partitioned table tanpa partition key

Buruk:

```sql id="k0gyd5"
SELECT *
FROM case_audit_log
WHERE case_id = :caseId
ORDER BY occurred_at DESC
LIMIT 100;
```

Lebih baik:

```sql id="pbtj0m"
WHERE case_id = :caseId
  AND occurred_at >= :from
  AND occurred_at < :to
```

---

### Anti-pattern 4 - Unique key lupa partition key

Buruk:

```sql id="adwcjk"
CREATE TABLE outbox_event (
    outbox_id uuid PRIMARY KEY,
    created_at timestamptz NOT NULL
)
PARTITION BY RANGE (created_at);
```

Akan bermasalah karena primary/unique key pada partitioned table harus include partition key. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html))

Lebih aman:

```sql id="scl0si"
PRIMARY KEY (created_at, outbox_id)
```

atau:

```text id="osv0hi"
jangan partition table tersebut jika key model tidak cocok.
```

---

### Anti-pattern 5 - Terlalu banyak partitions kecil

Risiko:

```text id="i3sd0v"
planning overhead
maintenance overhead
DDL bloat
index management rumit
monitoring lebih sulit
```

Rule kasar:

```text id="o0mrqg"
Pilih granularity berdasarkan volume dan retention:
- daily: hanya jika volume sangat tinggi / retention harian
- monthly: umum untuk audit/event enterprise
- yearly: untuk volume moderate dengan retention panjang
```

---

### Anti-pattern 6 - Default partition tidak dimonitor

Default partition yang terisi terus berarti automation gagal.

```sql id="ki49pi"
SELECT count(*) FROM case_audit_log_default;
```

Jika count > 0, harus ada alert.

---

## 24. Production Checklist

| Checklist | Pertanyaan |
|---|---|
| Need proven | Apakah table memang cukup besar dan punya retention/query problem? |
| Key stable | Apakah partition key tidak sering berubah? |
| Query pruning | Apakah query utama selalu filter partition key? |
| PK/unique valid | Apakah primary/unique constraint include partition key? |
| Index strategy | Apakah parent/child indexes sesuai query? |
| Future partitions | Apakah partition masa depan dibuat otomatis? |
| Missing partition | Apakah insert tidak akan gagal saat periode baru? |
| Default partition | Jika ada, apakah dimonitor? |
| Attach runbook | Apakah attach pakai CHECK constraint untuk avoid scan? |
| Detach/drop runbook | Apakah retention memakai detach/drop dengan lock awareness? |
| Archive | Apakah data detached di-backup sebelum drop? |
| FK impact | Apakah FK dan detach/drop sudah dianalisis? |
| EXPLAIN | Apakah pruning tervalidasi dengan data realistis? |
| MyBatis | Apakah mapper memaksa time range untuk partitioned table? |
| Migration | Apakah non-partitioned → partitioned punya backfill/validation plan? |
| Monitoring | Apakah partition count, default rows, old partitions, future partitions dimonitor? |

---

## 25. Mini Lab

### Step 1 - Create partitioned audit table

```sql id="0frw65"
CREATE TABLE case_audit_log (
    tenant_id    bigint NOT NULL,
    audit_id     bigint GENERATED ALWAYS AS IDENTITY,
    case_id      uuid NOT NULL,
    event_type   text NOT NULL,
    occurred_at  timestamptz NOT NULL,
    metadata     jsonb NOT NULL DEFAULT '{}'::jsonb,

    CONSTRAINT pk_case_audit_log
        PRIMARY KEY (tenant_id, occurred_at, audit_id)
)
PARTITION BY RANGE (occurred_at);
```

### Step 2 - Create partitions

```sql id="39hxu8"
CREATE TABLE case_audit_log_2026_07
PARTITION OF case_audit_log
FOR VALUES FROM ('2026-07-01 00:00:00+00')
TO ('2026-08-01 00:00:00+00');

CREATE TABLE case_audit_log_2026_08
PARTITION OF case_audit_log
FOR VALUES FROM ('2026-08-01 00:00:00+00')
TO ('2026-09-01 00:00:00+00');
```

### Step 3 - Create timeline index

```sql id="w2kxx9"
CREATE INDEX idx_case_audit_log__case_timeline
ON case_audit_log (
    tenant_id,
    case_id,
    occurred_at ASC,
    audit_id ASC
);
```

### Step 4 - Insert data

```sql id="ahmgid"
INSERT INTO case_audit_log (
    tenant_id,
    case_id,
    event_type,
    occurred_at,
    metadata
)
VALUES
(
    1001,
    '019535d9-3df7-79fb-b466-fa907fa17f9e',
    'CASE_CREATED',
    '2026-07-15 10:00:00+00',
    '{"source": "api"}'
),
(
    1001,
    '019535d9-3df7-79fb-b466-fa907fa17f9e',
    'CASE_SUBMITTED',
    '2026-08-01 09:00:00+00',
    '{"source": "api"}'
);
```

### Step 5 - Explain with time range

```sql id="jr7wkb"
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    audit_id,
    event_type,
    occurred_at
FROM case_audit_log
WHERE tenant_id = 1001
  AND case_id = '019535d9-3df7-79fb-b466-fa907fa17f9e'
  AND occurred_at >= TIMESTAMPTZ '2026-07-01 00:00:00+00'
  AND occurred_at < TIMESTAMPTZ '2026-08-01 00:00:00+00'
ORDER BY occurred_at ASC, audit_id ASC;
```

Expected:

```text id="gz3mao"
Hanya partition case_audit_log_2026_07 yang relevan.
```

### Step 6 - Detach old partition

```sql id="zj9na5"
ALTER TABLE case_audit_log
DETACH PARTITION case_audit_log_2026_07;
```

Setelah detach, table berdiri sendiri dan bisa di-archive/drop.

---

## 26. Ringkasan Praktis

```text id="34chcw"
1. Partitioning berguna untuk table besar, retention, archival, dan query subset yang jelas.
2. Audit/history/outbox/inbox lebih sering cocok dipartisi daripada current state table.
3. Range by time adalah strategy paling natural untuk append-only OLTP tables.
4. Tenant partitioning hanya cocok jika tenant skew/isolasi memang kuat.
5. Hindari partition by mutable status; gunakan partial index untuk status.
6. Query harus filter partition key agar pruning efektif.
7. Primary/unique key pada partitioned table harus include partition key.
8. Parent index partitioned bersifat virtual; actual index ada di child partitions.
9. `CREATE INDEX CONCURRENTLY` tidak langsung di parent partitioned table; perlu rollout per-partition.
10. Retention lebih aman dengan detach/archive/drop partition daripada delete jutaan row.
11. Default partition harus dimonitor agar tidak menjadi tempat data normal.
12. MyBatis mapper untuk partitioned time table sebaiknya mewajibkan time range.
```

---

# Status Seri

**Seri 14/22 selesai.**

Rekomendasi lanjut ke:

**Seri 15 - Vacuum, Autovacuum, Bloat, Analyze, dan Statistics untuk PostgreSQL OLTP: MVCC cleanup, dead tuples, table/index bloat, autovacuum tuning, planner statistics, dan operational health check.**

---

**Sources:**

- [PostgreSQL: Documentation: 18: 5.12. Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

## Response:
7/15/2026, 8:35:00 PM

Saya lanjut ke **Seri 15/22**. Fokusnya operasional OLTP: MVCC cleanup, dead tuples, autovacuum, bloat, `ANALYZE`, statistics planner, dan query health check yang praktis untuk production.

# PostgreSQL OLTP - Seri 15/22  
## Vacuum, Autovacuum, Bloat, Analyze, dan Statistics: MVCC Cleanup, Dead Tuples, Planner Stats, dan Operational Health Check

Seri ini fokus ke hal yang sering baru terasa saat production sudah ramai:

```text id="pys6ai"
Query tiba-tiba melambat.
Table makin besar padahal data aktif tidak banyak.
Index makin gemuk.
Autovacuum seperti tidak mengejar.
Planner salah pilih plan.
Update/delete terasa makin mahal.
```

Di PostgreSQL, `UPDATE` dan `DELETE` tidak langsung menghapus versi row lama karena MVCC. Versi row lama baru bisa dibersihkan ketika tidak lagi mungkin terlihat oleh transaksi lain; proses pembersihan ini dilakukan oleh `VACUUM`. Standard `VACUUM` membersihkan dead row versions agar space bisa dipakai ulang, sedangkan `VACUUM FULL` menulis ulang table agar space kembali ke OS, tetapi jauh lebih berat dan membutuhkan `ACCESS EXCLUSIVE` lock. ([PostgreSQL](https://www.postgresql.org/docs/current/routine-vacuuming.html))

---

## 1. Mental Model

```text id="xhnb2j"
PostgreSQL MVCC Maintenance
│
├─ INSERT
│  └─ creates new tuple
│
├─ UPDATE
│  ├─ creates new tuple version
│  └─ old version becomes dead later
│
├─ DELETE
│  └─ old tuple becomes dead later
│
├─ VACUUM
│  ├─ removes dead tuple versions
│  ├─ cleans indexes
│  ├─ marks space reusable
│  ├─ advances freeze metadata
│  └─ usually does not shrink file to OS
│
├─ ANALYZE
│  ├─ samples table data
│  ├─ updates planner statistics
│  ├─ improves row estimate
│  └─ affects query plan choice
│
├─ Autovacuum
│  ├─ automatic VACUUM
│  ├─ automatic ANALYZE
│  ├─ threshold-based
│  ├─ per-table tunable
│  └─ anti-wraparound safety
│
└─ Bloat / Stats Problems
   ├─ too many dead tuples
   ├─ stale statistics
   ├─ long transactions
   ├─ idle in transaction
   ├─ high-churn indexes
   └─ vacuum cannot keep up
```

Rule utama:

```text id="w3o5fp"
Untuk OLTP, vacuum bukan housekeeping opsional.
Vacuum adalah bagian dari write-path health.
```

---

## 2. Practical Table

| Area | Apa yang terjadi | Gejala | Action |
|---|---|---|---|
| Dead tuples | Row lama dari update/delete menumpuk | Table/index membesar, query lambat | Pastikan autovacuum mengejar |
| Bloat | Space tidak efisien terpakai | Table size jauh > active data | Vacuum lebih sering; redesign churn; last resort rewrite |
| Stale stats | Planner punya estimasi salah | Seq scan tidak wajar, join buruk | `ANALYZE`, stats target, extended stats |
| Long transaction | Vacuum tidak bisa bersihkan tuple lama | Dead tuples tidak turun | Cari `idle in transaction`, batasi timeout |
| Hot table | Update/delete tinggi | autovacuum sering tertinggal | Per-table autovacuum tuning |
| Hot index | Banyak update indexed column | index bloat/write overhead | Kurangi index, partial index, rebuild bila perlu |
| Partition parent stats | Parent jarang dianalyze | Plan partitioned query buruk | Manual `ANALYZE` parent |
| Queue/outbox churn | READY→PROCESSING→DONE update tinggi | bloat cepat | Partial index, retention, partition, tuning |
| Audit append-only | Banyak insert, sedikit update | freeze/analyze tetap penting | Analyze/BRIN/partition/retention |
| GIN pending | JSONB/FTS insert tinggi | query spike | Vacuum helps GIN pending list cleanup |

`VACUUM` reguler direkomendasikan untuk semua database agar dead rows dibersihkan, dan PostgreSQL punya fasilitas autovacuum untuk mengotomatisasi maintenance rutin ini. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-vacuum.html?utm_source=chatgpt.com))

---

## 3. VACUUM Basics

### Standard `VACUUM`

```sql id="nl4q82"
VACUUM regulatory_case;
```

Fungsi praktis:

```text id="6fp49j"
1. membersihkan dead tuples
2. membersihkan index entries yang sudah tidak diperlukan
3. membuat space bisa dipakai ulang oleh row baru
4. membantu visibility map untuk index-only scan
5. membantu freeze untuk mencegah transaction ID wraparound
```

### `VACUUM (ANALYZE)`

```sql id="pmj5w4"
VACUUM (ANALYZE) regulatory_case;
```

Dipakai ketika ingin membersihkan dead tuples sekaligus update planner statistics.

### `VACUUM FULL`

```sql id="vlwa2p"
VACUUM FULL regulatory_case;
```

Gunakan sangat hati-hati. `VACUUM FULL` menulis ulang seluruh table ke file baru, mengembalikan unused space ke OS, jauh lebih lambat, dan membutuhkan `ACCESS EXCLUSIVE` lock pada table yang diproses. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-vacuum.html))

Rule:

```text id="e4idlo"
Routine maintenance → standard VACUUM / autovacuum.
Emergency shrink setelah massive delete/update → VACUUM FULL/CLUSTER/rewrite dengan maintenance window.
```

---

## 4. Kenapa Long Transaction Merusak Vacuum

Jika ada transaksi lama, PostgreSQL harus mempertahankan versi row yang mungkin masih terlihat oleh transaksi tersebut.

Cari transaksi lama:

```sql id="az74m9"
SELECT
    pid,
    usename,
    application_name,
    client_addr,
    state,
    now() - xact_start AS xact_age,
    now() - query_start AS query_age,
    wait_event_type,
    wait_event,
    left(query, 500) AS query
FROM pg_stat_activity
WHERE xact_start IS NOT NULL
ORDER BY xact_start ASC
LIMIT 20;
```

Cari `idle in transaction`:

```sql id="xgk09g"
SELECT
    pid,
    usename,
    application_name,
    client_addr,
    now() - xact_start AS xact_age,
    now() - state_change AS idle_age,
    left(query, 500) AS last_query
FROM pg_stat_activity
WHERE state = 'idle in transaction'
ORDER BY xact_start ASC;
```

PostgreSQL documentation menyatakan bahwa session yang idle dalam transaksi dapat mencegah vacuum membuang recently-dead tuples yang mungkin masih terlihat oleh transaksi itu, sehingga bisa berkontribusi pada table bloat. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-client.html?utm_source=chatgpt.com))

Practical Java/MyBatis implication:

```text id="fcl8mq"
1. Jangan buka SqlSession transaction lalu menunggu external API.
2. Jangan stream result besar sambil transaction terbuka lama.
3. Pastikan commit/rollback selalu terjadi di finally/try-with-resources.
4. Set idle_in_transaction_session_timeout untuk safety.
```

---

## 5. Autovacuum: Cara Kerja Praktis

Autovacuum secara otomatis menjalankan `VACUUM` dan `ANALYZE`. PostgreSQL menjelaskan bahwa autovacuum memeriksa table yang memiliki banyak inserted/updated/deleted tuples; autovacuum membutuhkan statistics collection, sehingga `track_counts` harus aktif. Default-nya autovacuum aktif. ([PostgreSQL](https://www.postgresql.org/docs/current/routine-vacuuming.html))

Threshold vacuum secara konseptual:

```text id="w4kiqc"
vacuum threshold =
autovacuum_vacuum_threshold
+ autovacuum_vacuum_scale_factor * table_size
```

PostgreSQL current mendokumentasikan formula autovacuum threshold dengan base threshold, scale factor, dan optional max threshold; analyze threshold juga dihitung berdasarkan inserted/updated/deleted tuples sejak analyze terakhir. ([PostgreSQL](https://www.postgresql.org/docs/current/routine-vacuuming.html))

Default penting yang perlu dikenal:

| Parameter | Default umum PostgreSQL 18 | Makna |
|---|---:|---|
| `autovacuum_vacuum_threshold` | 50 | base updated/deleted tuples |
| `autovacuum_vacuum_scale_factor` | 0.2 | 20% table size tambahan |
| `autovacuum_analyze_threshold` | 50 | base changed tuples untuk analyze |
| `autovacuum_analyze_scale_factor` | 0.1 | 10% table size tambahan |
| `autovacuum_vacuum_insert_threshold` | 1000 | inserted tuples trigger |
| `autovacuum_freeze_max_age` | 200M transactions | forced vacuum anti-wraparound |

Defaults scale factor bisa terlalu lambat untuk table besar. Misal table 100 juta row dengan scale factor 0.2, vacuum bisa menunggu sekitar 20 juta obsolete tuples sebelum trigger; untuk OLTP high-churn, ini sering terlalu besar.

---

## 6. Per-Table Autovacuum Tuning

Untuk table high-churn seperti queue/outbox/session/idempotency, gunakan table storage parameters.

```sql id="4tmcll"
ALTER TABLE workflow_job SET (
    autovacuum_vacuum_scale_factor = 0.02,
    autovacuum_vacuum_threshold = 1000,
    autovacuum_analyze_scale_factor = 0.02,
    autovacuum_analyze_threshold = 1000
);
```

Untuk outbox:

```sql id="2b493k"
ALTER TABLE outbox_event SET (
    autovacuum_vacuum_scale_factor = 0.01,
    autovacuum_vacuum_threshold = 5000,
    autovacuum_analyze_scale_factor = 0.02,
    autovacuum_analyze_threshold = 5000
);
```

Untuk audit append-only besar:

```sql id="fbx9fv"
ALTER TABLE case_audit_log SET (
    autovacuum_vacuum_insert_scale_factor = 0.05,
    autovacuum_vacuum_insert_threshold = 10000,
    autovacuum_analyze_scale_factor = 0.02,
    autovacuum_analyze_threshold = 10000
);
```

PostgreSQL vacuum parameters dapat di-set global di config, dan banyak parameter autovacuum bisa dioverride per table lewat storage parameters. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-vacuum.html))

Rule praktis:

```text id="cs4p0j"
Autovacuum tuning jangan seragam untuk semua table.
Tuning berdasarkan churn pattern:
- high update/delete
- append-only
- queue/outbox
- large partitioned history
```

---

## 7. Detect Dead Tuples dan Vacuum Lag

Table health:

```sql id="7qdwf1"
SELECT
    schemaname,
    relname AS table_name,
    n_live_tup,
    n_dead_tup,
    round(
        100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0),
        2
    ) AS dead_tuple_pct,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze,
    vacuum_count,
    autovacuum_count,
    analyze_count,
    autoanalyze_count
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC
LIMIT 30;
```

Interpretasi kasar:

| Signal | Meaning |
|---|---|
| `n_dead_tup` naik terus | vacuum tidak mengejar atau long tx menahan cleanup |
| `last_autovacuum` null | table belum pernah autovacuum atau stats reset |
| `last_autoanalyze` lama | planner stats mungkin stale |
| `dead_tuple_pct` tinggi | kandidat bloat/high churn |
| autovacuum sering tapi dead tetap tinggi | vacuum terhambat, table terlalu churn, atau config terlalu lambat |

PostgreSQL cumulative statistics system melaporkan akses table/index, jumlah row, serta informasi vacuum dan analyze per table. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html?utm_source=chatgpt.com))

---

## 8. Monitor Vacuum yang Sedang Berjalan

```sql id="ewcoiy"
SELECT
    p.pid,
    a.usename,
    a.application_name,
    p.datname,
    p.relid::regclass AS table_name,
    p.phase,
    p.heap_blks_total,
    p.heap_blks_scanned,
    p.heap_blks_vacuumed,
    round(
        100.0 * p.heap_blks_scanned / NULLIF(p.heap_blks_total, 0),
        2
    ) AS scanned_pct,
    p.index_vacuum_count,
    p.num_dead_tuples,
    p.max_dead_tuples,
    now() - a.query_start AS running_for
FROM pg_stat_progress_vacuum p
JOIN pg_stat_activity a ON a.pid = p.pid
ORDER BY running_for DESC;
```

PostgreSQL menyediakan `pg_stat_progress_vacuum`; setiap backend yang menjalankan `VACUUM`, termasuk autovacuum worker, akan muncul satu row di view ini. `VACUUM FULL` progress dilaporkan melalui `pg_stat_progress_cluster`, bukan `pg_stat_progress_vacuum`. ([PostgreSQL](https://www.postgresql.org/docs/current/progress-reporting.html?utm_source=chatgpt.com))

---

## 9. Detect Autovacuum Worker dan Activity

```sql id="bryfj1"
SELECT
    pid,
    backend_type,
    datname,
    usename,
    application_name,
    state,
    wait_event_type,
    wait_event,
    now() - query_start AS running_for,
    left(query, 500) AS query
FROM pg_stat_activity
WHERE backend_type IN ('autovacuum launcher', 'autovacuum worker')
ORDER BY query_start NULLS LAST;
```

PostgreSQL `pg_stat_activity.backend_type` dapat menunjukkan tipe backend seperti `autovacuum launcher` dan `autovacuum worker`. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html?utm_source=chatgpt.com))

---

## 10. ANALYZE dan Planner Statistics

`ANALYZE` mengumpulkan statistics untuk planner. Jika statistics stale, PostgreSQL bisa salah memperkirakan jumlah row dan memilih plan yang buruk.

```sql id="74h5o0"
ANALYZE regulatory_case;
```

Atau:

```sql id="kxogf1"
VACUUM (ANALYZE) regulatory_case;
```

PostgreSQL documentation menyatakan planner bergantung pada statistical information untuk membuat query plan yang baik; statistics dikumpulkan oleh `ANALYZE`, dan statistik yang tidak akurat dapat menyebabkan pilihan plan buruk. ([PostgreSQL](https://www.postgresql.org/docs/current/routine-vacuuming.html))

Cek estimasi vs aktual:

```sql id="99tjya"
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    case_id,
    case_number,
    status,
    created_at
FROM regulatory_case
WHERE tenant_id = 1001
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY created_at DESC, case_id DESC
LIMIT 50;
```

Yang dicari:

```text id="pvi7ot"
1. estimated rows jauh dari actual rows?
2. planner memilih Seq Scan padahal index harusnya selective?
3. Sort mahal padahal ada index sesuai ORDER BY?
4. Bitmap/Index Scan membaca jauh lebih banyak row dari yang dikembalikan?
```

---

## 11. Statistics Target

Default statistics target PostgreSQL current adalah 100. Nilai lebih besar bisa meningkatkan kualitas estimasi planner, tetapi membuat `ANALYZE` lebih lama dan metadata statistik lebih besar. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-analyze.html?utm_source=chatgpt.com))

Untuk kolom skewed atau sering dipakai filter:

```sql id="mzdtcn"
ALTER TABLE regulatory_case
ALTER COLUMN status SET STATISTICS 1000;

ALTER TABLE regulatory_case
ALTER COLUMN tenant_id SET STATISTICS 1000;

ALTER TABLE regulatory_case
ALTER COLUMN assignee_id SET STATISTICS 1000;

ANALYZE regulatory_case;
```

Kapan dinaikkan:

```text id="63rr3p"
1. tenant distribution sangat skewed
2. status sangat skewed
3. assignee/worklist filter penting
4. planner sering salah estimate
5. filter column punya many distinct values atau skew besar
```

Jangan asal naikkan semua kolom.

```text id="ftyv1q"
Naikkan hanya kolom yang memengaruhi WHERE/JOIN/ORDER BY penting.
```

---

## 12. Extended Statistics

Jika planner salah estimate kombinasi kolom, pakai extended statistics.

Contoh query sering:

```sql id="hy56oj"
WHERE tenant_id = :tenantId
  AND status = :status
  AND assignee_id = :assigneeId
```

Buat statistics:

```sql id="5rf462"
CREATE STATISTICS st_case_tenant_status_assignee
ON tenant_id, status, assignee_id
FROM regulatory_case;

ANALYZE regulatory_case;
```

PostgreSQL `CREATE STATISTICS` membuat extended statistics object; actual collected values baru tersedia setelah `ANALYZE` dijalankan. ([PostgreSQL](https://www.postgresql.org/docs/current/planner-stats.html?utm_source=chatgpt.com))

Cek stats object:

```sql id="3bkr65"
SELECT
    schemaname,
    tablename,
    statistics_name,
    attnames,
    kinds
FROM pg_stats_ext
WHERE tablename = 'regulatory_case';
```

---

## 13. Partitioned Table dan ANALYZE

Untuk partitioned table, autovacuum memproses partition child seperti table biasa, tetapi parent partitioned table tidak langsung menyimpan tuple dan tidak diproses autovacuum dengan cara yang sama. PostgreSQL docs menyatakan autovacuum tidak menjalankan `ANALYZE` pada partitioned tables parent, sehingga query yang refer ke parent bisa punya plan suboptimal; workaround-nya adalah manual `ANALYZE` parent saat pertama populated dan saat distribusi data berubah signifikan. ([PostgreSQL](https://www.postgresql.org/docs/current/routine-vacuuming.html))

Manual analyze parent:

```sql id="b9zdq7"
ANALYZE case_audit_log;
```

Analyze partition tertentu:

```sql id="zj7u9w"
ANALYZE case_audit_log_2026_07;
```

Rule:

```text id="r0axvr"
Setelah load/backfill partition besar:
1. ANALYZE partition
2. ANALYZE parent
3. cek EXPLAIN query utama
```

---

## 14. Bloat: Apa dan Bagaimana Membacanya

Bloat adalah space yang tidak efektif digunakan akibat dead tuples, page fragmentation, atau index entries yang tidak lagi berguna.

Cek size table/index:

```sql id="neoa5j"
SELECT
    n.nspname AS schema_name,
    c.relname AS table_name,
    pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size,
    pg_size_pretty(pg_relation_size(c.oid)) AS table_size,
    pg_size_pretty(pg_indexes_size(c.oid)) AS indexes_size
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind = 'r'
  AND n.nspname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(c.oid) DESC
LIMIT 30;
```

Dead tuple ratio:

```sql id="rhzlnu"
SELECT
    relname,
    n_live_tup,
    n_dead_tup,
    pg_size_pretty(pg_relation_size(relid)) AS table_size,
    round(
        100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0),
        2
    ) AS dead_tuple_pct
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC
LIMIT 30;
```

Caution:

```text id="clycmb"
n_live_tup dan n_dead_tup adalah estimasi statistik.
Gunakan sebagai signal awal, bukan angka absolut forensic.
```

Untuk estimasi lebih detail, beberapa tim memakai extension seperti `pgstattuple`, tetapi gunakan dengan hati-hati karena bisa membaca banyak data.

---

## 15. Hot Tables: Queue, Outbox, Idempotency

Tabel seperti queue/outbox/idempotency sering high-churn.

### Gejala

```text id="u0nd8k"
READY → PROCESSING → DONE
NEW → PROCESSING → PUBLISHED
PROCESSING → COMPLETED
```

Banyak update status berarti:

```text id="77g9sh"
1. dead tuples cepat terbentuk
2. partial index berubah
3. index entries lama perlu cleanup
4. autovacuum harus lebih agresif
```

### Practical tuning

```sql id="x6w191"
ALTER TABLE workflow_job SET (
    autovacuum_vacuum_scale_factor = 0.01,
    autovacuum_vacuum_threshold = 1000,
    autovacuum_analyze_scale_factor = 0.02,
    autovacuum_analyze_threshold = 1000
);

ALTER TABLE outbox_event SET (
    autovacuum_vacuum_scale_factor = 0.01,
    autovacuum_vacuum_threshold = 5000,
    autovacuum_analyze_scale_factor = 0.02,
    autovacuum_analyze_threshold = 5000
);
```

### Index design

```sql id="6d2gaa"
CREATE INDEX idx_workflow_job__ready_claim
ON workflow_job (tenant_id, available_at, job_id)
WHERE status = 'READY';

CREATE INDEX idx_outbox_event__new_claim
ON outbox_event (tenant_id, available_at, created_at, outbox_id)
WHERE status = 'NEW';
```

Rule:

```text id="rybxuj"
High-churn table:
1. partial index untuk active rows
2. cleanup/retention chunked
3. autovacuum threshold lebih rendah
4. jangan terlalu banyak index
5. hindari long transaction
```

---

## 16. Avoid Update Churn Bila Bisa

Buruk:

```text id="nfu57h"
Setiap worker heartbeat:
UPDATE workflow_job SET last_seen_at = now()
setiap 2 detik
```

Dampak:

```text id="ydh7to"
1. dead tuples terus-menerus
2. index update jika kolom indexed
3. vacuum pressure tinggi
```

Alternatif:

```text id="mf4wov"
1. lease dengan locked_at saat claim saja
2. worker heartbeat di Redis/observability system
3. update DB hanya state transition penting
4. batasi kolom indexed yang sering berubah
```

---

## 17. HOT Update Awareness

PostgreSQL bisa melakukan Heap-Only Tuple update dalam kondisi tertentu, terutama jika kolom yang diupdate tidak memengaruhi index. Praktisnya:

```text id="eyyc09"
Jika kolom sering di-update masuk ke banyak index,
update menjadi lebih mahal dan index bloat lebih besar.
```

Contoh buruk:

```sql id="2unv8x"
CREATE INDEX idx_job_locked_at ON workflow_job (locked_at);
CREATE INDEX idx_job_updated_at ON workflow_job (updated_at);
CREATE INDEX idx_job_attempt_count ON workflow_job (attempt_count);
```

Padahal kolom itu sering berubah.

Lebih baik:

```sql id="c40isr"
CREATE INDEX idx_workflow_job__processing_stale
ON workflow_job (locked_at, tenant_id, job_id)
WHERE status = 'PROCESSING';

CREATE INDEX idx_workflow_job__ready_claim
ON workflow_job (tenant_id, available_at, job_id)
WHERE status = 'READY';
```

Rule:

```text id="g93wuk"
Index hanya access pattern penting.
Jangan index kolom high-churn tanpa alasan query jelas.
```

---

## 18. Logging Autovacuum

Aktifkan logging autovacuum untuk diagnosis.

```conf id="dfkkd8"
log_autovacuum_min_duration = '1s'
```

Untuk investigasi sementara:

```conf id="fikc0e"
log_autovacuum_min_duration = 0
```

PostgreSQL `log_autovacuum_min_duration` membuat aktivitas autovacuum dilog bila durasinya minimal nilai tersebut; `0` melog semua autovacuum action, dan `-1` menonaktifkan logging. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-logging.html?utm_source=chatgpt.com))

Gunakan untuk menjawab:

```text id="1yl85r"
1. table mana sering divacuum?
2. vacuum berapa lama?
3. dead tuples berapa banyak?
4. index cleanup berat?
5. autovacuum dibatalkan karena lock?
```

---

## 19. Query Health dengan `pg_stat_statements`

`pg_stat_statements` melacak planning dan execution statistics untuk SQL statements yang dijalankan server. Ini sangat penting untuk tahu query mana yang menyumbang latency, I/O, dan total time. ([PostgreSQL](https://www.postgresql.org/docs/current/pgstatstatements.html?utm_source=chatgpt.com))

Top total time:

```sql id="3g1uum"
SELECT
    queryid,
    calls,
    round(total_exec_time::numeric, 2) AS total_exec_ms,
    round(mean_exec_time::numeric, 2) AS mean_exec_ms,
    rows,
    left(query, 500) AS query
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;
```

High mean latency:

```sql id="iqfoa3"
SELECT
    queryid,
    calls,
    round(mean_exec_time::numeric, 2) AS mean_exec_ms,
    round(max_exec_time::numeric, 2) AS max_exec_ms,
    rows,
    left(query, 500) AS query
FROM pg_stat_statements
WHERE calls > 100
ORDER BY mean_exec_time DESC
LIMIT 20;
```

Use with:

```text id="12or3u"
1. EXPLAIN representative query
2. table/index stats
3. autovacuum logs
4. application endpoint metrics
```

---

## 20. Manual Maintenance Commands

### Manual vacuum analyze satu table

```sql id="jk5ep5"
VACUUM (ANALYZE, VERBOSE) workflow_job;
```

### Analyze after bulk load

```sql id="ywrcvv"
ANALYZE case_audit_log_2026_07;
ANALYZE case_audit_log;
```

### Vacuum database via CLI

```bash id="bvtugh"
vacuumdb --analyze --verbose --table=public.workflow_job mydb
```

### Analyze only via CLI

```bash id="ksqb4g"
vacuumdb --analyze-only --verbose mydb
```

Practical rule:

```text id="6tp415"
Manual vacuum/analyze adalah tool diagnosis/maintenance.
Jangan menjadikannya pengganti autovacuum yang sehat.
```

---

## 21. Table-Specific Health Dashboard Query

```sql id="4yzqib"
WITH table_stats AS (
    SELECT
        s.relid,
        s.schemaname,
        s.relname,
        s.n_live_tup,
        s.n_dead_tup,
        s.last_autovacuum,
        s.last_autoanalyze,
        s.autovacuum_count,
        s.autoanalyze_count,
        pg_relation_size(s.relid) AS table_bytes,
        pg_indexes_size(s.relid) AS index_bytes,
        pg_total_relation_size(s.relid) AS total_bytes
    FROM pg_stat_user_tables s
)
SELECT
    schemaname,
    relname,
    n_live_tup,
    n_dead_tup,
    round(
        100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0),
        2
    ) AS dead_pct,
    pg_size_pretty(table_bytes) AS table_size,
    pg_size_pretty(index_bytes) AS index_size,
    pg_size_pretty(total_bytes) AS total_size,
    last_autovacuum,
    last_autoanalyze,
    autovacuum_count,
    autoanalyze_count
FROM table_stats
ORDER BY total_bytes DESC
LIMIT 50;
```

Use this weekly/daily for:

```text id="piu1ne"
1. top growing tables
2. dead tuple hotspots
3. missing autovacuum
4. missing autoanalyze
5. abnormal index-to-table ratio
```

---

## 22. Java/Jersey/MyBatis Operational Implications

### Bad transaction pattern

```java id="a0u384"
try (SqlSession session = sqlSessionFactory.openSession(false)) {
    CaseMapper mapper = session.getMapper(CaseMapper.class);

    CaseRow row = mapper.findForUpdate(tenantId, caseId);

    externalClient.callSomething(); // dangerous inside transaction

    mapper.updateCase(...);

    session.commit();
}
```

Masalah:

```text id="r27tjp"
1. row lock ditahan selama external call
2. transaction lama menahan vacuum cleanup
3. connection pool terpakai lama
4. dead tuples bisa tertahan
```

### Better pattern

```java id="tutv8g"
try (SqlSession session = sqlSessionFactory.openSession(false)) {
    CaseMapper mapper = session.getMapper(CaseMapper.class);
    OutboxMapper outbox = session.getMapper(OutboxMapper.class);

    CaseRow updated = mapper.submitCase(...);
    outbox.insertCaseSubmitted(...);

    session.commit();
}

// external publish by outbox worker after commit
```

### Guardrails

```text id="vzjz1f"
1. enforce transaction timeout
2. enforce idle_in_transaction_session_timeout
3. no external call inside DB transaction
4. no user think-time inside transaction
5. close SqlSession deterministically
6. log slow SQL with correlation id
```

---

## 23. Timeout Safety

```sql id="rqbflw"
SET LOCAL lock_timeout = '500ms';
SET LOCAL statement_timeout = '5s';
SET LOCAL idle_in_transaction_session_timeout = '10s';
```

For service transaction bootstrap:

```xml id="4yaxt9"
<update id="setTransactionSafety">
  SET LOCAL lock_timeout = '500ms';
  SET LOCAL statement_timeout = '5s';
  SET LOCAL idle_in_transaction_session_timeout = '10s'
</update>
```

Use in command service:

```java id="9r7thz"
try (SqlSession session = sqlSessionFactory.openSession(false)) {
    DbSessionMapper db = session.getMapper(DbSessionMapper.class);
    db.setTransactionSafety();

    // command mutation

    session.commit();
}
```

---

## 24. VACUUM FULL, REINDEX, CLUSTER: Kapan Dipikirkan?

Gunakan setelah diagnosis, bukan default.

| Tool | Kapan | Risiko |
|---|---|---|
| `VACUUM` | routine cleanup | I/O load |
| `VACUUM (ANALYZE)` | cleanup + stats | I/O + analyze |
| `VACUUM FULL` | massive bloat, need shrink to OS | `ACCESS EXCLUSIVE`, rewrite, extra disk |
| `REINDEX` | index corruption/bloat severe | lock/rollout concern |
| `CLUSTER` | physically reorder table | rewrite + lock |
| Partition detach/drop | retention besar | DDL/lock planning |

PostgreSQL docs menyarankan standard `VACUUM` rutin cukup sering agar tidak perlu `VACUUM FULL`; autovacuum dirancang bekerja seperti ini dan tidak pernah menjalankan `VACUUM FULL`. ([PostgreSQL](https://www.postgresql.org/docs/current/routine-vacuuming.html))

---

## 25. Anti-Pattern

### Anti-pattern 1 - Disable autovacuum

```sql id="wmvclp"
ALTER TABLE workflow_job SET (autovacuum_enabled = false);
```

Buruk kecuali ada runbook manual yang sangat matang. Bahkan jika autovacuum dinonaktifkan, PostgreSQL tetap dapat memaksa vacuum untuk mencegah transaction ID wraparound. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createtable.html?utm_source=chatgpt.com))

---

### Anti-pattern 2 - Mengandalkan nightly vacuum saja

Masalah:

```text id="88d1xx"
Spike update/delete siang hari bisa membuat bloat sebelum vacuum malam.
Autovacuum lebih adaptif karena trigger berdasarkan aktivitas table.
```

---

### Anti-pattern 3 - `VACUUM FULL` sebagai routine job

Buruk:

```text id="9u52zo"
VACUUM FULL setiap malam pada table aktif besar.
```

Risiko:

```text id="61k3kq"
ACCESS EXCLUSIVE lock
rewrite table
butuh extra disk
mengganggu availability
```

---

### Anti-pattern 4 - Long transaction di API

```text id="f1qc0d"
Open transaction
call external system
wait user/browser
commit later
```

Ini mengganggu vacuum dan concurrency.

---

### Anti-pattern 5 - Semua table pakai autovacuum config sama

High-churn queue dan append-only audit tidak punya behavior sama.

```text id="evi17y"
Tuning harus per-table.
```

---

### Anti-pattern 6 - Analyze dilupakan setelah bulk load/backfill

Setelah import besar, planner bisa pakai statistik lama.

```sql id="vfbfju"
ANALYZE imported_table;
```

Untuk partitioned parent, jalankan analyze parent juga bila query refer ke parent. ([PostgreSQL](https://www.postgresql.org/docs/current/routine-vacuuming.html))

---

## 26. Production Checklist

| Checklist | Pertanyaan |
|---|---|
| Autovacuum on | Apakah autovacuum aktif dan tidak dimatikan sembarangan? |
| Dead tuples monitored | Apakah `n_dead_tup` dipantau? |
| Long transactions | Apakah `idle in transaction` dimonitor dan dibatasi? |
| High-churn tuning | Apakah queue/outbox/idempotency punya per-table tuning? |
| Analyze freshness | Apakah `last_autoanalyze` wajar untuk table penting? |
| Stats target | Apakah kolom skewed punya statistics target cukup? |
| Extended stats | Apakah kombinasi filter penting punya `CREATE STATISTICS`? |
| Partition parent | Apakah parent partitioned table di-`ANALYZE` manual? |
| Autovacuum logs | Apakah `log_autovacuum_min_duration` aktif untuk diagnosis? |
| Vacuum progress | Apakah `pg_stat_progress_vacuum` dipakai saat incident? |
| Query stats | Apakah `pg_stat_statements` aktif? |
| Index overhead | Apakah high-churn table tidak punya index berlebihan? |
| Cleanup chunked | Apakah delete retention dilakukan chunked/partition detach? |
| No external in tx | Apakah service tidak call external API dalam transaksi? |
| No routine FULL | Apakah `VACUUM FULL` hanya maintenance window/last resort? |

---

## 27. Mini Lab

### Step 1 - Buat table high-churn

```sql id="6ln1ib"
CREATE TABLE workflow_job (
    tenant_id      bigint NOT NULL,
    job_id         bigint GENERATED ALWAYS AS IDENTITY,
    status         text NOT NULL DEFAULT 'READY',
    payload        jsonb NOT NULL DEFAULT '{}'::jsonb,
    available_at   timestamptz NOT NULL DEFAULT clock_timestamp(),
    locked_at      timestamptz,
    attempt_count  integer NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_workflow_job
        PRIMARY KEY (tenant_id, job_id),

    CONSTRAINT chk_workflow_job__status
        CHECK (status IN ('READY', 'PROCESSING', 'DONE', 'FAILED'))
);

CREATE INDEX idx_workflow_job__ready
ON workflow_job (tenant_id, available_at, job_id)
WHERE status = 'READY';
```

### Step 2 - Set autovacuum table tuning

```sql id="zy2klx"
ALTER TABLE workflow_job SET (
    autovacuum_vacuum_scale_factor = 0.01,
    autovacuum_vacuum_threshold = 1000,
    autovacuum_analyze_scale_factor = 0.02,
    autovacuum_analyze_threshold = 1000
);
```

### Step 3 - Generate churn

```sql id="cfnu55"
INSERT INTO workflow_job (tenant_id, payload)
SELECT
    1001,
    jsonb_build_object('n', g)
FROM generate_series(1, 100000) AS g;

UPDATE workflow_job
SET status = 'PROCESSING',
    locked_at = clock_timestamp(),
    attempt_count = attempt_count + 1
WHERE tenant_id = 1001
  AND job_id <= 50000;

UPDATE workflow_job
SET status = 'DONE'
WHERE tenant_id = 1001
  AND job_id <= 50000;
```

### Step 4 - Cek dead tuples

```sql id="iv0mo0"
SELECT
    relname,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
WHERE relname = 'workflow_job';
```

### Step 5 - Manual vacuum analyze

```sql id="bkmpg8"
VACUUM (ANALYZE, VERBOSE) workflow_job;
```

### Step 6 - Cek ulang

```sql id="tuvdia"
SELECT
    relname,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
WHERE relname = 'workflow_job';
```

Expected:

```text id="2mn6ik"
Dead tuple estimate turun setelah vacuum.
Analyze timestamp berubah.
Planner punya stats lebih fresh.
```

---

## 28. Ringkasan Praktis

```text id="44fbia"
1. PostgreSQL MVCC membuat UPDATE/DELETE menghasilkan dead tuples.
2. VACUUM membersihkan dead tuples agar space bisa dipakai ulang.
3. VACUUM FULL bukan routine; ia rewrite table dan butuh ACCESS EXCLUSIVE lock.
4. Autovacuum harus aktif dan biasanya cukup, tapi high-churn table perlu tuning.
5. Long transaction dan idle-in-transaction bisa menahan cleanup dan memicu bloat.
6. ANALYZE menjaga planner statistics agar query plan tetap baik.
7. Naikkan statistics target hanya untuk kolom penting dan skewed.
8. Extended statistics membantu kombinasi filter yang sering salah estimasi.
9. Partitioned parent table sering perlu ANALYZE manual.
10. Queue/outbox/idempotency perlu perhatian khusus karena update churn tinggi.
11. Monitor `pg_stat_user_tables`, `pg_stat_progress_vacuum`, `pg_stat_activity`, dan `pg_stat_statements`.
12. Di Java/MyBatis, transaksi harus pendek, deterministic, dan tidak menunggu external call.
```

---

# Status Seri

**Seri 15/22 selesai.**

Rekomendasi lanjut ke:

**Seri 16 - Performance Diagnostics untuk PostgreSQL OLTP: `EXPLAIN (ANALYZE, BUFFERS)`, `pg_stat_statements`, locks, wait events, slow query triage, dan incident playbook untuk Java/Jersey/MyBatis microservice.**

---

**Sources:**

- [PostgreSQL: Documentation: 18: 24.1. Routine Vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

## Response:
7/15/2026, 8:37:52 PM

# PostgreSQL OLTP - Seri 16/22  
## Performance Diagnostics: `EXPLAIN (ANALYZE, BUFFERS)`, `pg_stat_statements`, Locks, Wait Events, Slow Query Triage, dan Incident Playbook untuk Java/Jersey/MyBatis

Seri ini fokus pada **cara mendiagnosis performa PostgreSQL OLTP secara sistematis**, terutama saat microservice Java/Jersey/MyBatis mulai mengalami:

```text id="q4ak13"
1. endpoint lambat
2. query tiba-tiba melambat
3. connection pool penuh
4. lock wait meningkat
5. deadlock muncul
6. CPU database tinggi
7. disk I/O tinggi
8. index tidak dipakai
9. row estimate planner salah
10. worker queue/outbox stuck
```

Untuk diagnosis production, jangan mulai dari “tambah index dulu”. Mulai dari **signal**, lalu turunkan ke **query**, **plan**, **wait**, **lock**, **table/index health**, dan akhirnya **fix**.

PostgreSQL menyediakan `EXPLAIN` untuk melihat execution plan; `EXPLAIN ANALYZE` benar-benar menjalankan query dan menampilkan actual runtime statistics, sehingga untuk `INSERT/UPDATE/DELETE` harus dipakai dengan hati-hati, biasanya dalam transaksi yang di-rollback jika hanya untuk diagnosis. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html?utm_source=chatgpt.com))

---

## 1. Mental Model Performance Diagnostics

```text id="t5igvk"
Performance Diagnostics
│
├─ Application symptom
│  ├─ endpoint latency
│  ├─ timeout
│  ├─ connection pool exhausted
│  ├─ worker lag
│  └─ error SQLSTATE
│
├─ Database workload view
│  ├─ pg_stat_statements
│  ├─ slow query log
│  ├─ active queries
│  ├─ wait events
│  └─ locks/blockers
│
├─ Query plan analysis
│  ├─ EXPLAIN
│  ├─ EXPLAIN ANALYZE
│  ├─ BUFFERS
│  ├─ row estimate vs actual
│  ├─ scan type
│  ├─ join strategy
│  └─ sort/hash spill
│
├─ Storage/table/index health
│  ├─ table size
│  ├─ index size
│  ├─ dead tuples
│  ├─ stale stats
│  ├─ bloat symptoms
│  └─ autovacuum activity
│
├─ Concurrency health
│  ├─ locks
│  ├─ blockers
│  ├─ idle in transaction
│  ├─ long transaction
│  ├─ deadlock
│  └─ timeout config
│
└─ Fix loop
   ├─ query rewrite
   ├─ index change
   ├─ stats/analyze
   ├─ transaction shortening
   ├─ batching/chunking
   ├─ pool tuning
   └─ schema/pattern change
```

Rule utama:

```text id="p016sx"
Diagnose by evidence:
metric → query → plan → wait/lock → table/index health → fix → verify.
```

---

## 2. Diagnostic Decision Table

| Symptom | First check | Likely area |
|---|---|---|
| Endpoint slow but DB CPU low | `pg_stat_activity`, wait events | lock wait, pool wait, network, app |
| DB CPU high | `pg_stat_statements` top total/mean time | expensive query, bad plan |
| Disk I/O high | `EXPLAIN BUFFERS`, cache hit/read | missing index, scan too broad |
| Sudden query regression | row estimate, `ANALYZE`, plan diff | stale stats, data skew |
| Only write endpoints slow | locks, dead tuples, index count | contention, bloat, write overhead |
| Worker queue lag | queue depth, claim query, locks | bad partial index, stuck processing |
| Deadlocks | SQLSTATE `40P01`, lock order | inconsistent lock ordering |
| Lock timeout | SQLSTATE `55P03`, blockers | long transaction, DDL, row contention |
| Connection pool exhausted | active vs idle sessions, long tx | leaked/long transactions |
| Random timeout | slow query log + app trace | missing correlation between app and DB |

---

# 3. `pg_stat_statements`: Cari Query Mahal Dulu

`pg_stat_statements` melacak planning dan execution statistics dari SQL statements yang dijalankan server. Ini sangat berguna untuk menemukan query dengan total cost tinggi, average latency tinggi, atau query yang sering dipanggil. ([PostgreSQL](https://www.postgresql.org/docs/current/pgstatstatements.html?utm_source=chatgpt.com))

## 3.1 Enable extension

Biasanya butuh config `shared_preload_libraries`.

```sql id="7qobzu"
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

Cek:

```sql id="df7gwr"
SELECT *
FROM pg_extension
WHERE extname = 'pg_stat_statements';
```

## 3.2 Top total execution time

```sql id="ofof4h"
SELECT
    queryid,
    calls,
    round(total_exec_time::numeric, 2) AS total_exec_ms,
    round(mean_exec_time::numeric, 2) AS mean_exec_ms,
    round(max_exec_time::numeric, 2) AS max_exec_ms,
    rows,
    left(query, 800) AS query
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;
```

Interpretasi:

```text id="zwqpl2"
High total_exec_time = query besar dampak totalnya.
Bisa karena sering dipanggil atau memang lambat.
```

## 3.3 Top average latency

```sql id="crdbeh"
SELECT
    queryid,
    calls,
    round(mean_exec_time::numeric, 2) AS mean_exec_ms,
    round(max_exec_time::numeric, 2) AS max_exec_ms,
    round(stddev_exec_time::numeric, 2) AS stddev_exec_ms,
    rows,
    left(query, 800) AS query
FROM pg_stat_statements
WHERE calls >= 50
ORDER BY mean_exec_time DESC
LIMIT 20;
```

Interpretasi:

```text id="x8gsx9"
High mean_exec_time = query individual lambat.
High max/stddev = latency spike; bisa lock, I/O, bad parameter, atau plan instability.
```

## 3.4 Top rows scanned/returned signal

```sql id="6xvte8"
SELECT
    queryid,
    calls,
    rows,
    round(rows::numeric / NULLIF(calls, 0), 2) AS rows_per_call,
    round(mean_exec_time::numeric, 2) AS mean_exec_ms,
    left(query, 800) AS query
FROM pg_stat_statements
ORDER BY rows DESC
LIMIT 20;
```

Cocok untuk mencari:

```text id="e6eq06"
1. list endpoint yang terlalu banyak row
2. export memakai endpoint OLTP
3. query tanpa LIMIT
4. batch yang tidak chunked
```

---

# 4. Correlate Query dengan Java/Jersey/MyBatis Endpoint

Masalah umum: DBA melihat SQL, developer melihat endpoint. Keduanya tidak nyambung.

## 4.1 Set `application_name`

JDBC URL:

```text id="503xqh"
jdbc:postgresql://db-host:5432/appdb?ApplicationName=case-service
```

Atau pool config:

```properties id="ou7fcf"
dataSource.ApplicationName=case-service
```

Lebih detail bisa di-set per transaction:

```sql id="qz54tb"
SET LOCAL application_name = 'case-service SubmitCase';
```

Namun hati-hati jika connection pool reuse connection; gunakan `SET LOCAL` di transaction.

## 4.2 Set context untuk audit/diagnostic

```sql id="pugdbg"
SELECT
    set_config('app.endpoint', :endpoint, true),
    set_config('app.request_id', :requestId, true),
    set_config('app.correlation_id', :correlationId, true);
```

Log di application:

```text id="sgxf6w"
endpoint=POST /api/cases/{id}/submit
request_id=req-123
correlation_id=corr-456
sql_mapper=CaseMapper.submitCase
sqlstate=40001
duration_ms=842
```

Rule:

```text id="fda42t"
Tanpa correlation ID, slow query investigation akan menjadi tebak-tebakan.
```

---

# 5. Active Query Snapshot: `pg_stat_activity`

`pg_stat_activity` menampilkan satu row per server process dengan informasi aktivitas saat ini, termasuk state, query, wait event, query start, transaction start, dan application name. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html?utm_source=chatgpt.com))

## 5.1 Query yang sedang aktif

```sql id="upzhye"
SELECT
    pid,
    usename,
    application_name,
    client_addr,
    state,
    wait_event_type,
    wait_event,
    now() - query_start AS query_age,
    now() - xact_start AS xact_age,
    left(query, 1000) AS query
FROM pg_stat_activity
WHERE state <> 'idle'
ORDER BY query_start ASC;
```

Interpretasi:

| Signal | Meaning |
|---|---|
| `active` + long query age | query sedang berjalan lama |
| `idle in transaction` | aplikasi membuka transaksi tapi idle |
| `wait_event_type = Lock` | menunggu lock |
| `wait_event_type = IO` | menunggu I/O |
| `xact_age` jauh lebih tua dari `query_age` | transaksi panjang dengan banyak statement |
| banyak connection idle | pool terlalu besar atau normal tergantung workload |
| banyak active sama | endpoint burst atau query stuck |

## 5.2 Idle in transaction

```sql id="hznwcc"
SELECT
    pid,
    usename,
    application_name,
    client_addr,
    now() - xact_start AS xact_age,
    now() - state_change AS idle_age,
    left(query, 1000) AS last_query
FROM pg_stat_activity
WHERE state = 'idle in transaction'
ORDER BY xact_start ASC;
```

Impact:

```text id="016ha6"
Idle-in-transaction bisa:
1. menahan row/table locks
2. menghambat vacuum cleanup
3. memperbesar bloat
4. menghabiskan connection pool
```

---

# 6. Wait Events: Tahu Query Menunggu Apa

`pg_stat_activity` memiliki kolom `wait_event_type` dan `wait_event`; dokumentasi PostgreSQL membagi wait event ke banyak kategori, dan ini membantu membedakan query yang benar-benar bekerja vs sedang menunggu lock/I/O/client. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html?utm_source=chatgpt.com))

```sql id="sij8eu"
SELECT
    wait_event_type,
    wait_event,
    count(*) AS session_count
FROM pg_stat_activity
WHERE state <> 'idle'
GROUP BY wait_event_type, wait_event
ORDER BY session_count DESC;
```

Interpretasi praktis:

| Wait type | Kemungkinan |
|---|---|
| `Lock` | blocked by transaction/DDL/row lock |
| `IO` | disk read/write bottleneck |
| `Client` | backend menunggu client mengirim/membaca data |
| `LWLock` | internal lightweight lock contention |
| `BufferPin` | buffer pinned oleh proses lain |
| null wait + active | query sedang CPU/executing |

Rule:

```text id="itpq4j"
CPU tinggi dan wait null → query CPU-heavy.
Wait Lock tinggi → cari blocker.
Wait IO tinggi → cek scan, cache, storage, index.
Wait Client tinggi → cek app/network/fetch behavior.
```

---

# 7. Lock Diagnostics

PostgreSQL menyediakan `pg_locks` untuk melihat lock aktif, tetapi dokumentasi menyarankan `pg_blocking_pids()` untuk mengidentifikasi proses yang memblokir proses lain. ([PostgreSQL](https://www.postgresql.org/docs/current/view-pg-locks.html?utm_source=chatgpt.com))

## 7.1 Siapa memblokir siapa?

```sql id="zrut02"
SELECT
    blocked.pid AS blocked_pid,
    blocked.application_name AS blocked_app,
    blocked.usename AS blocked_user,
    now() - blocked.query_start AS blocked_for,
    blocked.wait_event_type,
    blocked.wait_event,
    left(blocked.query, 800) AS blocked_query,

    blocker.pid AS blocker_pid,
    blocker.application_name AS blocker_app,
    blocker.usename AS blocker_user,
    blocker.state AS blocker_state,
    now() - blocker.xact_start AS blocker_xact_age,
    left(blocker.query, 800) AS blocker_query
FROM pg_stat_activity blocked
JOIN LATERAL unnest(pg_blocking_pids(blocked.pid)) AS bpid(blocker_pid)
    ON true
JOIN pg_stat_activity blocker
    ON blocker.pid = bpid.blocker_pid
ORDER BY blocked.query_start ASC;
```

## 7.2 Waiting locks

```sql id="npq29q"
SELECT
    l.pid,
    a.application_name,
    a.usename,
    l.locktype,
    l.mode,
    l.granted,
    l.relation::regclass AS relation_name,
    l.page,
    l.tuple,
    l.transactionid,
    now() - a.query_start AS query_age,
    left(a.query, 800) AS query
FROM pg_locks l
JOIN pg_stat_activity a ON a.pid = l.pid
WHERE NOT l.granted
ORDER BY a.query_start ASC;
```

## 7.3 Blocker yang idle in transaction

```sql id="ct9z10"
SELECT
    blocker.pid,
    blocker.application_name,
    blocker.usename,
    blocker.state,
    now() - blocker.xact_start AS xact_age,
    now() - blocker.state_change AS state_age,
    left(blocker.query, 1000) AS last_query
FROM pg_stat_activity blocked
JOIN LATERAL unnest(pg_blocking_pids(blocked.pid)) AS bpid(blocker_pid)
    ON true
JOIN pg_stat_activity blocker
    ON blocker.pid = bpid.blocker_pid
WHERE blocker.state = 'idle in transaction'
ORDER BY blocker.xact_start ASC;
```

Decision:

```text id="q6mqap"
Jika blocker adalah idle-in-transaction lama dari aplikasi:
1. identifikasi endpoint/application_name
2. capture query/request id
3. pertimbangkan pg_cancel_backend atau pg_terminate_backend sesuai SOP
4. fix code agar transaksi pendek
```

---

# 8. Cancel vs Terminate

Untuk query aktif yang masih jalan:

```sql id="8ax7bk"
SELECT pg_cancel_backend(:pid);
```

Untuk session yang harus diputus:

```sql id="9ckm4g"
SELECT pg_terminate_backend(:pid);
```

Practical rule:

```text id="b34qf4"
pg_cancel_backend → membatalkan query aktif, session tetap hidup.
pg_terminate_backend → memutus koneksi/session.
Gunakan sesuai SOP, jangan sembarang di production.
```

Sebelum terminate:

```text id="387o2f"
1. pastikan PID benar
2. tahu application_name/user/client_addr
3. tahu query dan xact_age
4. koordinasi jika proses maintenance/migration
5. capture evidence untuk RCA
```

---

# 9. `EXPLAIN`: Baca Plan dengan Benar

Basic:

```sql id="h45bkh"
EXPLAIN
SELECT
    case_id,
    case_number,
    title,
    created_at
FROM regulatory_case
WHERE tenant_id = 1001
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY created_at DESC, case_id DESC
LIMIT 50;
```

Production diagnosis:

```sql id="5kvfsp"
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    case_id,
    case_number,
    title,
    created_at
FROM regulatory_case
WHERE tenant_id = 1001
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY created_at DESC, case_id DESC
LIMIT 50;
```

`BUFFERS` membantu melihat buffer hits/reads/writes; ini penting untuk membedakan query CPU-bound vs I/O-heavy. PostgreSQL `EXPLAIN` mendukung banyak opsi termasuk `ANALYZE`, `BUFFERS`, `VERBOSE`, `SETTINGS`, dan format output seperti text/json/yaml/xml. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html?utm_source=chatgpt.com))

---

## 10. Baca Node Plan Umum

| Plan node | Meaning | Diagnostic |
|---|---|---|
| `Seq Scan` | scan seluruh table/partition | OK untuk table kecil; buruk jika selective large table |
| `Index Scan` | pakai index, fetch heap | umum OLTP |
| `Index Only Scan` | pakai index saja sebagian/banyak | bagus jika heap fetch rendah |
| `Bitmap Index Scan` + `Bitmap Heap Scan` | kumpulkan banyak pointer row lalu fetch heap | cocok medium selectivity |
| `Nested Loop` | loop outer ke inner | bagus untuk small outer + indexed inner |
| `Hash Join` | build hash table | bagus untuk larger join; memory penting |
| `Merge Join` | join sorted inputs | perlu order/index/sort |
| `Sort` | explicit sort | mahal jika large; bisa dihindari dengan index |
| `HashAggregate` | aggregate via hash | bisa spill jika memory kurang |
| `Gather` | parallel query | sering lebih OLAP; cek apakah OLTP query terlalu besar |

---

## 11. Estimate vs Actual Rows

Contoh signal buruk:

```text id="hy41cf"
estimated rows = 10
actual rows = 500000
```

Dampak:

```text id="c7tktg"
planner bisa memilih nested loop padahal hash join lebih cocok
planner bisa memilih index scan yang membaca terlalu banyak row
planner bisa salah urutan join
```

Cek dengan:

```sql id="7tc67x"
EXPLAIN (ANALYZE, BUFFERS)
SELECT ...
```

Penyebab umum:

```text id="9u6cx9"
1. stale statistics
2. data skew per tenant/status
3. correlation antar kolom
4. expression predicate tanpa stats
5. parameterized query generic plan
6. partition parent belum ANALYZE
```

Fix candidate:

```text id="zti2de"
1. ANALYZE table/partition
2. naikkan statistics target kolom penting
3. CREATE STATISTICS untuk kombinasi kolom
4. rewrite predicate agar sargable
5. index sesuai query shape
```

---

# 12. `ANALYZE`, Statistics Target, Extended Stats

Jika plan buruk karena estimasi salah:

```sql id="hhpudq"
ANALYZE regulatory_case;
```

Naikkan stats target kolom skewed:

```sql id="i3fmm5"
ALTER TABLE regulatory_case
ALTER COLUMN tenant_id SET STATISTICS 1000;

ALTER TABLE regulatory_case
ALTER COLUMN status SET STATISTICS 1000;

ANALYZE regulatory_case;
```

Extended stats untuk kombinasi filter:

```sql id="80cvr7"
CREATE STATISTICS st_case_tenant_status_assignee
ON tenant_id, status, assignee_id
FROM regulatory_case;

ANALYZE regulatory_case;
```

PostgreSQL `CREATE STATISTICS` membuat object statistik tambahan, dan statistik aktual baru dikumpulkan setelah `ANALYZE`. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html?utm_source=chatgpt.com))

---

# 13. Slow Query Logging

Konfigurasi:

```conf id="ac6js4"
log_min_duration_statement = '500ms'
```

`log_min_duration_statement` membuat PostgreSQL melog statement yang berjalan minimal selama durasi tersebut; nilai `-1` menonaktifkan, dan `0` melog semua statement. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-logging.html?utm_source=chatgpt.com))

Untuk production OLTP:

```text id="wpnj46"
Common starting point:
- 500ms untuk OLTP latency-sensitive
- 1s untuk general service
- 5s untuk noisy/batch environment
```

Tambahkan log line prefix yang membantu correlation:

```conf id="lqergq"
log_line_prefix = '%m [%p] user=%u db=%d app=%a client=%h '
```

Rule:

```text id="6tt0g3"
Slow query log memberi evidence episodic.
pg_stat_statements memberi aggregate view.
Keduanya saling melengkapi.
```

---

# 14. `auto_explain` untuk Plan Query Lambat

`auto_explain` bisa otomatis melog execution plan untuk statement lambat; parameter pentingnya `auto_explain.log_min_duration`, dengan `-1` sebagai default disabled dan `0` untuk log semua plan. ([PostgreSQL](https://www.postgresql.org/docs/current/auto-explain.html?utm_source=chatgpt.com))

Contoh session-level diagnosis:

```sql id="jycxrd"
LOAD 'auto_explain';

SET auto_explain.log_min_duration = '500ms';
SET auto_explain.log_analyze = on;
SET auto_explain.log_buffers = on;
SET auto_explain.log_verbose = on;
SET auto_explain.log_nested_statements = on;
```

Cocok untuk:

```text id="le6t5e"
1. query lambat sulit direproduce
2. function/trigger nested query
3. ORM/MyBatis query dynamic
4. incident sementara
```

Caution:

```text id="pt1elb"
auto_explain dengan log_analyze mengeksekusi overhead tambahan.
Jangan aktifkan terlalu agresif tanpa batas di production.
```

---

# 15. Incident Playbook: Endpoint Lambat

## Step 1 - Dari aplikasi

Ambil:

```text id="tfmcig"
1. endpoint
2. request_id/correlation_id
3. tenant_id
4. mapper method
5. SQLSTATE jika error
6. DB time vs app time
7. pool wait time
```

## Step 2 - Active query

```sql id="48swff"
SELECT
    pid,
    application_name,
    state,
    wait_event_type,
    wait_event,
    now() - query_start AS query_age,
    now() - xact_start AS xact_age,
    left(query, 1000) AS query
FROM pg_stat_activity
WHERE application_name ILIKE '%case-service%'
ORDER BY query_start ASC;
```

## Step 3 - Jika wait lock

```sql id="y6a2zh"
SELECT
    blocked.pid AS blocked_pid,
    now() - blocked.query_start AS blocked_for,
    left(blocked.query, 500) AS blocked_query,
    blocker.pid AS blocker_pid,
    blocker.state AS blocker_state,
    now() - blocker.xact_start AS blocker_xact_age,
    left(blocker.query, 500) AS blocker_query
FROM pg_stat_activity blocked
JOIN LATERAL unnest(pg_blocking_pids(blocked.pid)) bpid(blocker_pid)
    ON true
JOIN pg_stat_activity blocker
    ON blocker.pid = bpid.blocker_pid;
```

## Step 4 - Jika query active lama tanpa lock

Cari queryid di `pg_stat_statements`, ambil normalized query, reproduce dengan representative bind values, lalu:

```sql id="ud4mkg"
EXPLAIN (ANALYZE, BUFFERS)
...
```

## Step 5 - Fix candidate

| Finding | Fix |
|---|---|
| Seq scan large table | index/query rewrite/required filter |
| Sort huge | index matching order/keyset pagination |
| rows estimate wrong | ANALYZE/stats target/extended stats |
| many rows returned | limit/pagination/API contract |
| lock wait | shorter transaction/lock ordering/NOWAIT/timeout |
| idle-in-transaction blocker | fix transaction lifecycle |
| high heap fetch in index-only query | vacuum/visibility/index coverage |
| high I/O | index/prune/partition/cache/storage |
| high write overhead | reduce indexes/partial index/batch |

---

# 16. Incident Playbook: Connection Pool Exhausted

Database snapshot:

```sql id="8hqeyu"
SELECT
    application_name,
    state,
    wait_event_type,
    wait_event,
    count(*) AS session_count,
    max(now() - xact_start) AS max_xact_age,
    max(now() - query_start) AS max_query_age
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY application_name, state, wait_event_type, wait_event
ORDER BY session_count DESC;
```

Look for:

```text id="a902dx"
1. many active long queries
2. many idle in transaction
3. many sessions waiting lock
4. app pool size too high vs DB max_connections
5. leaked sessions
```

Java/MyBatis checks:

```text id="ihmhk7"
1. try-with-resources SqlSession?
2. commit/rollback on all paths?
3. external call inside transaction?
4. streaming result not closed?
5. batch job monopolizing pool?
6. connection leak detection enabled?
```

Recommended app metrics:

```text id="n2365k"
HikariCP:
- active connections
- idle connections
- pending threads
- connection acquisition time
- usage time
- timeout count
```

---

# 17. Incident Playbook: Deadlock

SQLSTATE:

```text id="kih5q3"
40P01 deadlock_detected
```

PostgreSQL reports deadlock as SQLSTATE `40P01`; SQLSTATE codes are designed to be stable for application handling. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-logging.html?utm_source=chatgpt.com))

Immediate response:

```text id="ilff4r"
1. capture app logs with SQLSTATE 40P01
2. identify involved mapper methods
3. inspect transaction lock order
4. retry whole transaction if command idempotent
5. fix deterministic ordering
```

Common cause:

```text id="vfx3us"
Transaction A locks case 1 then case 2.
Transaction B locks case 2 then case 1.
Deadlock.
```

Fix:

```sql id="jnst1e"
SELECT case_id
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND case_id = ANY(:caseIds)
ORDER BY case_id ASC
FOR UPDATE;
```

Rule:

```text id="yd2315"
Jika mengunci banyak resource, lock dalam urutan deterministic.
```

---

# 18. Incident Playbook: Worker Queue Lag

Queue depth:

```sql id="qxuaxe"
SELECT
    job_type,
    status,
    count(*) AS count,
    min(created_at) AS oldest_created_at,
    min(available_at) AS oldest_available_at
FROM workflow_job
GROUP BY job_type, status
ORDER BY job_type, status;
```

Stale processing:

```sql id="3rwkji"
SELECT
    tenant_id,
    job_id,
    job_type,
    locked_by,
    locked_at,
    now() - locked_at AS locked_age,
    attempt_count,
    left(last_error, 500) AS last_error
FROM workflow_job
WHERE status = 'PROCESSING'
  AND locked_at < clock_timestamp() - interval '5 minutes'
ORDER BY locked_at ASC
LIMIT 100;
```

Claim query plan:

```sql id="lrl6x7"
EXPLAIN (ANALYZE, BUFFERS)
WITH candidate AS (
    SELECT tenant_id, job_id
    FROM workflow_job
    WHERE tenant_id = 1001
      AND status = 'READY'
      AND available_at <= clock_timestamp()
    ORDER BY available_at ASC, job_id ASC
    LIMIT 25
    FOR UPDATE SKIP LOCKED
)
SELECT *
FROM candidate;
```

Check index:

```sql id="70vluv"
CREATE INDEX idx_workflow_job__ready_claim
ON workflow_job (tenant_id, available_at ASC, job_id ASC)
WHERE status = 'READY';
```

Typical fixes:

```text id="2bk7ic"
1. add/fix partial ready index
2. requeue stale processing
3. improve worker throughput
4. reduce external dependency latency
5. backoff retry storms
6. partition/archive old DONE rows
7. tune autovacuum high-churn table
```

---

# 19. Query Pattern Triage Examples

## 19.1 Bad list query

```sql id="bs7fa8"
SELECT *
FROM regulatory_case
WHERE tenant_id = :tenantId
ORDER BY created_at DESC
OFFSET 100000
LIMIT 50;
```

Symptoms:

```text id="psagah"
large sort/scan
high buffers
latency grows by page number
```

Fix:

```sql id="gzz563"
SELECT
    case_id,
    case_number,
    title,
    status,
    created_at
FROM regulatory_case
WHERE tenant_id = :tenantId
  AND deleted_at IS NULL
  AND (created_at, case_id) < (:lastCreatedAt, :lastCaseId)
ORDER BY created_at DESC, case_id DESC
LIMIT :limit;
```

Index:

```sql id="pdf3ld"
CREATE INDEX idx_case__tenant_created_cursor
ON regulatory_case (tenant_id, created_at DESC, case_id DESC)
WHERE deleted_at IS NULL;
```

## 19.2 Bad optional filter query

```sql id="zfrk18"
WHERE tenant_id = :tenantId
  AND (:status IS NULL OR status = :status)
  AND (:assigneeId IS NULL OR assignee_id = :assigneeId)
```

Fix:

```text id="n50c8u"
Use dynamic SQL so active predicates appear explicitly.
Create indexes for supported query shapes.
```

## 19.3 Bad JSONB core field query

```sql id="7dxdsl"
WHERE payload ->> 'status' = 'SUBMITTED'
```

Fix:

```text id="c7ke3h"
Promote status to relational column.
Use jsonb for metadata/payload, not core filter fields.
```

---

# 20. MyBatis-Specific Diagnostics

## 20.1 Know generated SQL

For dynamic mapper:

```xml id="fa3irb"
<select id="searchCases" resultMap="CaseListItemMap">
  SELECT ...
  <where>
    tenant_id = #{tenantId}
    <if test="status != null">
      AND status = #{status}
    </if>
  </where>
</select>
```

During incident, capture actual SQL shape:

```text id="d0ke8t"
1. which optional predicates were included?
2. which sort branch was selected?
3. actual limit?
4. cursor present?
5. tenant/status cardinality?
```

## 20.2 Beware unsafe `${}`

Bad:

```xml id="t6hyob"
ORDER BY ${sortColumn}
```

Performance and security risk:

```text id="gk7tm4"
1. SQL injection risk
2. too many query shapes
3. unpredictable plans
4. hard to aggregate stats
```

Use whitelist `<choose>`.

## 20.3 Large `IN` list

Bad:

```sql id="xgmxv4"
WHERE case_id IN (...)
```

with thousands of IDs.

Options:

```text id="cnsw24"
1. temporary table/staging table
2. unnest array and join
3. batch chunks
4. redesign endpoint
```

---

# 21. Table/Index Health During Performance Incident

Top table size:

```sql id="6sob15"
SELECT
    n.nspname AS schema_name,
    c.relname AS table_name,
    pg_size_pretty(pg_relation_size(c.oid)) AS table_size,
    pg_size_pretty(pg_indexes_size(c.oid)) AS indexes_size,
    pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind = 'r'
  AND n.nspname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(c.oid) DESC
LIMIT 30;
```

Dead tuples:

```sql id="u8q1hd"
SELECT
    relname,
    n_live_tup,
    n_dead_tup,
    round(
        100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0),
        2
    ) AS dead_pct,
    last_autovacuum,
    last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC
LIMIT 30;
```

Unused/low-used indexes:

```sql id="0bgg5o"
SELECT
    schemaname,
    relname AS table_name,
    indexrelname AS index_name,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC, pg_relation_size(indexrelid) DESC
LIMIT 50;
```

Caution:

```text id="25nmh2"
Jangan drop index hanya karena idx_scan rendah.
Cek constraint, rare query, reporting, migration, dan stats reset.
```

---

# 22. Logging dan Guardrail yang Direkomendasikan

## PostgreSQL logging

```conf id="j7wiwu"
log_min_duration_statement = '500ms'
log_lock_waits = on
deadlock_timeout = '1s'
log_autovacuum_min_duration = '1s'
log_line_prefix = '%m [%p] user=%u db=%d app=%a client=%h '
```

`log_min_duration_statement` melog statement lambat, `log_autovacuum_min_duration` melog autovacuum yang melebihi threshold tertentu, dan `auto_explain` dapat melog execution plan untuk query lambat. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-logging.html?utm_source=chatgpt.com))

## Per-transaction guardrail

```sql id="8wjfrz"
SET LOCAL lock_timeout = '500ms';
SET LOCAL statement_timeout = '5s';
SET LOCAL idle_in_transaction_session_timeout = '10s';
```

## App-level guardrail

```text id="wxp1lx"
1. endpoint timeout < upstream gateway timeout
2. DB statement timeout < app request timeout
3. pool connection timeout monitored
4. circuit breaker untuk external dependency
5. no external call inside DB transaction
```

---

# 23. Root Cause Categories

| Category | Evidence | Fix |
|---|---|---|
| Missing index | Seq scan large selective query | Add index matching query shape |
| Wrong index order | Sort still happens | Composite index with order/tie-breaker |
| Stale stats | estimate vs actual far | ANALYZE / stats target / extended stats |
| Data skew | plan bad for specific tenant/status | partial index, tenant-aware stats, query split |
| Lock contention | wait_event Lock, blockers | shorten tx, deterministic lock order |
| Long transaction | high xact_age, idle in tx | fix app transaction lifecycle |
| Bloat | dead tuples high, table/index huge | autovacuum tuning, cleanup, rewrite if needed |
| Bad pagination | high OFFSET, many rows skipped | keyset pagination |
| Over-fetching | rows per call high | projection, limit, endpoint contract |
| Write overhead | many indexes high-churn table | reduce indexes, partial indexes |
| Queue stuck | PROCESSING stale, READY lag | lease/requeue/index/worker scaling |
| External dependency | DB tx waits while external call | outbox pattern |

---

# 24. Java/Jersey/MyBatis Incident Checklist

| Layer | Check |
|---|---|
| Jersey resource | endpoint, request timeout, correlation id |
| Service | transaction boundary, external calls inside transaction |
| MyBatis mapper | actual SQL shape, dynamic filters, sort branch |
| SqlSession | closed properly, commit/rollback all paths |
| JDBC pool | active, idle, pending, acquisition time |
| PostgreSQL sessions | `application_name`, active query, wait event |
| Query plan | `EXPLAIN (ANALYZE, BUFFERS)` |
| Locks | blockers, idle transaction, DDL |
| Stats | `ANALYZE`, row estimate, extended stats |
| Index | correct composite/partial/covering index |
| Queue/outbox | lag, stale processing, retry storms |
| Logs | SQLSTATE, mapper id, tenant id, request id |

---

## 25. Mini Lab

### Step 1 - Setup table

```sql id="9v7vbo"
CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL,
    status       text NOT NULL,
    title        text NOT NULL,
    created_at   timestamptz NOT NULL DEFAULT clock_timestamp(),
    deleted_at   timestamptz,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id)
);
```

### Step 2 - Insert sample data

```sql id="8b1tab"
INSERT INTO regulatory_case (
    tenant_id,
    case_number,
    status,
    title,
    created_at
)
SELECT
    1001,
    'CASE-' || g,
    CASE WHEN g % 10 = 0 THEN 'SUBMITTED' ELSE 'CLOSED' END,
    'Case ' || g,
    clock_timestamp() - make_interval(secs => g)
FROM generate_series(1, 200000) AS g;
```

### Step 3 - Run bad query

```sql id="3wasmz"
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    case_id,
    case_number,
    title,
    created_at
FROM regulatory_case
WHERE tenant_id = 1001
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY created_at DESC, case_id DESC
LIMIT 50;
```

Expected before index:

```text id="jwc1k5"
Seq Scan or expensive Sort may appear,
depending data/stats.
```

### Step 4 - Add index

```sql id="h2wh47"
CREATE INDEX idx_regulatory_case__submitted_list
ON regulatory_case (
    tenant_id,
    created_at DESC,
    case_id DESC
)
WHERE status = 'SUBMITTED'
  AND deleted_at IS NULL;
```

### Step 5 - Analyze and rerun

```sql id="2ckbix"
ANALYZE regulatory_case;

EXPLAIN (ANALYZE, BUFFERS)
SELECT
    case_id,
    case_number,
    title,
    created_at
FROM regulatory_case
WHERE tenant_id = 1001
  AND status = 'SUBMITTED'
  AND deleted_at IS NULL
ORDER BY created_at DESC, case_id DESC
LIMIT 50;
```

Expected after index:

```text id="ljuouv"
Index Scan using idx_regulatory_case__submitted_list
lebih sedikit buffer read/hit
tidak perlu sort besar
latency turun
```

### Step 6 - Inspect pg_stat_activity

```sql id="ltd4d8"
SELECT
    pid,
    application_name,
    state,
    wait_event_type,
    wait_event,
    now() - query_start AS query_age,
    left(query, 500) AS query
FROM pg_stat_activity
WHERE state <> 'idle'
ORDER BY query_start;
```

---

## 26. Ringkasan Praktis

```text id="4ktp8b"
1. Mulai diagnosis dari symptom dan evidence, bukan langsung menambah index.
2. pg_stat_statements menunjukkan query mahal secara aggregate.
3. pg_stat_activity menunjukkan query/session yang sedang aktif.
4. wait_event_type membantu membedakan CPU, I/O, lock, client wait.
5. pg_blocking_pids lebih praktis untuk mencari blocker daripada membaca pg_locks mentah.
6. EXPLAIN (ANALYZE, BUFFERS) wajib untuk validasi plan dan I/O behavior.
7. Row estimate vs actual adalah signal utama stale stats/data skew.
8. Slow query log dan auto_explain membantu menangkap query lambat episodic.
9. Lock incident sering berakar dari long transaction atau idle in transaction.
10. Queue/outbox lag perlu dicek dari depth, stale PROCESSING, claim query plan, dan retry storm.
11. Java/MyBatis harus punya correlation id, mapper id, SQLSTATE, dan transaction discipline.
12. Fix harus diverifikasi ulang dengan EXPLAIN, pg_stat_statements, dan endpoint metrics.
```

---

# Status Seri

**Seri 16/22 selesai.**

Rekomendasi lanjut ke:

**Seri 17 - Connection Pooling, Session Settings, Timeout, Prepared Statement Behavior, dan Transaction Boundary untuk PostgreSQL OLTP dengan Java/Jersey/MyBatis.**

---

**Sources:**

- [Documentation: 18: 27.2. The Cumulative Statistics System](https://www.postgresql.org/docs/current/monitoring-stats.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:40:14 PM

# PostgreSQL OLTP - Seri 17/22  
## Connection Pooling, Session Settings, Timeout, Prepared Statement Behavior, dan Transaction Boundary untuk PostgreSQL OLTP dengan Java/Jersey/MyBatis

Seri ini fokus pada lapisan yang sering menjadi sumber incident di microservice Java:

```text id="4il0f2"
1. connection pool terlalu besar/kecil
2. connection pool exhausted
3. transaksi terlalu lama
4. idle in transaction
5. statement tidak punya timeout
6. lock wait menggantung
7. prepared statement behavior membingungkan
8. session setting bocor antar-request
9. MyBatis SqlSession tidak ditutup/commit/rollback benar
10. database max_connections habis
```

PostgreSQL `max_connections` menentukan jumlah maksimum koneksi concurrent ke server database; default biasanya 100, tetapi bisa lebih kecil bergantung kernel settings dan hanya bisa diubah saat server start. Ini penting karena setiap pool dari setiap service/replica ikut mengonsumsi connection budget. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-connection.html?utm_source=chatgpt.com))

---

## 1. Mental Model

```text id="zc92db"
Java/Jersey/MyBatis → PostgreSQL Connection Lifecycle
│
├─ HTTP request / worker job
│
├─ Service method
│  ├─ decide transaction boundary
│  ├─ acquire SqlSession / Connection
│  ├─ SET LOCAL safety settings
│  ├─ execute mapper statements
│  ├─ commit or rollback
│  └─ close session
│
├─ Connection pool
│  ├─ max pool size
│  ├─ min idle
│  ├─ connection timeout
│  ├─ idle timeout
│  ├─ max lifetime
│  └─ leak detection
│
├─ JDBC / pgJDBC
│  ├─ prepared statement cache
│  ├─ server prepared statement threshold
│  ├─ binary transfer
│  ├─ fetch size / streaming
│  └─ connection/session properties
│
├─ PostgreSQL session
│  ├─ application_name
│  ├─ search_path
│  ├─ statement_timeout
│  ├─ lock_timeout
│  ├─ idle_in_transaction_session_timeout
│  ├─ transaction_timeout
│  └─ current_setting / set_config context
│
└─ PostgreSQL backend
   ├─ active query
   ├─ transaction state
   ├─ locks
   ├─ wait events
   ├─ prepared statements
   └─ resource usage
```

Rule utama:

```text id="cl7w9k"
Connection pool bukan sekadar konfigurasi performa.
Pool adalah concurrency limiter untuk database.
```

---

## 2. Practical Decision Table

| Area | Default aman | Kapan diubah |
|---|---|---|
| Pool size | kecil dulu, ukur | jika DB punya headroom dan app benar-benar butuh concurrency |
| Transaction boundary | service method command | jangan transaction per DAO kecil yang terpisah |
| `autoCommit` | `false` untuk command transaction | read-only single query boleh auto-commit via policy |
| `statement_timeout` | set per command | beda untuk OLTP, batch, maintenance |
| `lock_timeout` | pendek untuk user command | lebih panjang untuk batch/migration tertentu |
| `idle_in_transaction_session_timeout` | selalu ada | cegah idle tx merusak vacuum/lock |
| `transaction_timeout` | gunakan untuk guardrail global/role | hati-hati dengan batch panjang |
| `application_name` | wajib | untuk diagnose `pg_stat_activity` |
| `SET LOCAL` | untuk request context | tidak bocor setelah transaction |
| prepared statement cache | default pgJDBC sering cukup | tune jika many unique SQL atau memory pressure |
| MyBatis local cache | `SESSION` default; hati-hati | `STATEMENT` jika long session/large reads |
| fetch size | default fetch all | set untuk streaming/batch read besar |

---

# 3. Pool Sizing: Jangan Semua Service Pakai 50 Koneksi

Misal:

```text id="h61dzz"
case-service       8 pods × pool 20 = 160 connections
workflow-service   6 pods × pool 20 = 120 connections
outbox-worker      4 pods × pool 10 = 40 connections
admin-service      2 pods × pool 10 = 20 connections
---------------------------------------------------
total application pool capacity = 340 connections
```

Jika PostgreSQL `max_connections = 200`, ini sudah oversubscribe.

Practical formula:

```text id="ns8fk5"
Total possible connections =
sum(service replicas × max pool size)
+ migration/admin connections
+ monitoring connections
+ DBA emergency reserve
```

Rule:

```text id="ltm997"
Pool size harus direncanakan global, bukan per-service secara terisolasi.
```

PostgreSQL connection budget terbatas oleh `max_connections`; meningkatkan nilai ini bukan solusi gratis karena tiap backend connection mengonsumsi resource server. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-connection.html?utm_source=chatgpt.com))

---

## 4. Initial Pool Size Recommendation

Untuk microservice OLTP, mulai konservatif:

| Service type | Starting pool size |
|---|---:|
| API service ringan | 5-10 per pod |
| API service heavy DB | 10-20 per pod, ukur |
| Worker queue | 2-10 per worker pod |
| Outbox publisher | 2-5 per pod |
| Batch/import | dedicated pool kecil |
| Admin/maintenance | dedicated, controlled |

Jangan copy paste:

```properties id="df9f1l"
maximumPoolSize=50
```

ke semua service.

Lebih baik:

```properties id="bficor"
maximumPoolSize=10
minimumIdle=2
connectionTimeout=3000
idleTimeout=600000
maxLifetime=1800000
leakDetectionThreshold=10000
```

HikariCP adalah JDBC connection pool production-ready; dokumentasinya menekankan konfigurasi seperti `maximumPoolSize`, `minimumIdle`, `connectionTimeout`, `idleTimeout`, `maxLifetime`, dan `leakDetectionThreshold` sebagai parameter utama yang perlu dipahami. ([GitHub](https://github.com/brettwooldridge/hikaricp?utm_source=chatgpt.com))

---

## 5. Pool Size Tuning: Signal yang Dilihat

| Signal | Makna |
|---|---|
| Pool active selalu penuh | DB lambat, pool terlalu kecil, atau request terlalu banyak |
| Pool pending threads tinggi | request menunggu koneksi |
| DB CPU rendah tapi pool penuh | kemungkinan lock wait/long tx/leak |
| DB CPU tinggi dan pool penuh | DB saturation; jangan tambah pool dulu |
| Banyak idle DB sessions | pool terlalu besar/minIdle tinggi |
| Many `idle in transaction` | bug transaction lifecycle |
| Query mean time naik saat pool naik | DB contention; pool kebesaran |
| Hikari connection acquisition timeout | app gagal mendapat connection |

Rule:

```text id="ok1xf5"
Jika pool habis, jangan otomatis tambah pool.
Cari dulu apakah connection sedang active, lock-wait, idle-in-transaction, atau query lambat.
```

Database snapshot:

```sql id="82s4j3"
SELECT
    application_name,
    state,
    wait_event_type,
    wait_event,
    count(*) AS session_count,
    max(now() - xact_start) AS max_xact_age,
    max(now() - query_start) AS max_query_age
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY application_name, state, wait_event_type, wait_event
ORDER BY session_count DESC;
```

---

# 6. HikariCP Configuration Example

```properties id="abgsjd"
# Pool identity
dataSourceClassName=org.postgresql.ds.PGSimpleDataSource
dataSource.serverName=db-host
dataSource.portNumber=5432
dataSource.databaseName=appdb
dataSource.user=app_runtime
dataSource.password=${DB_PASSWORD}
dataSource.ApplicationName=case-service

# Pool sizing
maximumPoolSize=10
minimumIdle=2

# Timeouts
connectionTimeout=3000
validationTimeout=1000
idleTimeout=600000
maxLifetime=1800000

# Leak detection for investigation; tune carefully
leakDetectionThreshold=10000

# PostgreSQL JDBC options
dataSource.reWriteBatchedInserts=true
dataSource.prepareThreshold=5
dataSource.preparedStatementCacheQueries=256
dataSource.preparedStatementCacheSizeMiB=5
```

Notes:

```text id="p5z25n"
connectionTimeout = berapa lama app menunggu koneksi dari pool.
statement_timeout = berapa lama query boleh berjalan di PostgreSQL.
request timeout = berapa lama HTTP request boleh hidup.
Ketiganya berbeda.
```

---

# 7. Timeout Layering

Timeout harus berlapis dari luar ke dalam.

```text id="rwxi5q"
Client / Gateway timeout
  > Jersey request timeout
    > service command budget
      > DB statement_timeout
        > lock_timeout
```

Contoh practical:

| Timeout | Example |
|---|---:|
| Gateway timeout | 30s |
| App request timeout | 25s |
| Service command DB budget | 5s |
| `statement_timeout` | 5s |
| `lock_timeout` | 500ms |
| `idle_in_transaction_session_timeout` | 10s |
| Pool `connectionTimeout` | 3s |

PostgreSQL `statement_timeout` membatalkan statement yang berjalan lebih lama dari durasi yang ditentukan; `lock_timeout` membatalkan statement jika menunggu lock lebih lama dari durasi itu, dan `idle_in_transaction_session_timeout` mengakhiri session yang idle di dalam transaksi terlalu lama. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-client.html?utm_source=chatgpt.com))

---

## 8. PostgreSQL Timeout Cheat Sheet

| Setting | Scope | Fungsi | Recommended use |
|---|---|---|---|
| `statement_timeout` | session/transaction | batasi durasi statement | OLTP command guardrail |
| `lock_timeout` | session/transaction | batasi waktu menunggu lock | fail-fast user command |
| `idle_in_transaction_session_timeout` | session/transaction | kill session idle dalam transaction | cegah long idle transaction |
| `transaction_timeout` | session/transaction | batasi total durasi transaction | guardrail PostgreSQL 17+ / 18 |
| `idle_session_timeout` | session | kill idle session non-transaction | hati-hati dengan pool |
| JDBC `socketTimeout` | driver/network | timeout socket read | network guardrail |
| Hikari `connectionTimeout` | pool | wait mendapatkan connection | pool pressure signal |
| Hikari `maxLifetime` | pool | recycle connection | hindari stale connection |

`idle_in_transaction_session_timeout` penting karena session idle dalam transaksi bisa menahan locks dan juga mencegah vacuum membuang tuple lama yang masih mungkin terlihat oleh transaksi tersebut, sehingga berkontribusi pada bloat. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-client.html?utm_source=chatgpt.com))

---

# 9. `SET LOCAL` Safety per Transaction

Gunakan `SET LOCAL`, bukan `SET`, untuk request/transaction-specific settings.

```sql id="j6pu0g"
SET LOCAL lock_timeout = '500ms';
SET LOCAL statement_timeout = '5s';
SET LOCAL idle_in_transaction_session_timeout = '10s';
SET LOCAL application_name = 'case-service SubmitCase';
```

MyBatis mapper:

```xml id="to8b7e"
<update id="setTransactionSafety">
  SET LOCAL lock_timeout = '500ms';
  SET LOCAL statement_timeout = '5s';
  SET LOCAL idle_in_transaction_session_timeout = '10s'
</update>
```

Context mapper:

```xml id="ljf450"
<update id="setRequestContext">
  SELECT
      set_config('app.actor_id', #{actorId}, true),
      set_config('app.request_id', #{requestId}, true),
      set_config('app.correlation_id', #{correlationId}, true),
      set_config('app.endpoint', #{endpoint}, true)
</update>
```

`set_config(name, value, true)` membuat setting berlaku lokal pada current transaction.

Rule:

```text id="vyudcu"
Di connection pool, session dipakai ulang.
Jangan pakai SET untuk request-specific context kecuali selalu di-reset.
Pakai SET LOCAL / set_config(..., true).
```

---

# 10. Transaction Boundary di Java/MyBatis

MyBatis `SqlSession` adalah interface utama untuk menjalankan command, mengambil mapper, dan mengelola transaction. `SqlSessionFactory` membuat instance `SqlSession`, dan MyBatis menyediakan variasi `openSession`, termasuk mode auto-commit atau manual transaction. ([MyBatis](https://mybatis.org/mybatis-3/java-api.html?utm_source=chatgpt.com))

Pattern command transaction:

```java id="3mx1iv"
public SubmitCaseResult submit(SubmitCaseCommand command) {
    try (SqlSession session = sqlSessionFactory.openSession(false)) {
        DbSessionMapper db = session.getMapper(DbSessionMapper.class);
        CaseMapper cases = session.getMapper(CaseMapper.class);
        AuditMapper audit = session.getMapper(AuditMapper.class);
        OutboxMapper outbox = session.getMapper(OutboxMapper.class);

        db.setTransactionSafety();
        db.setRequestContext(
            command.actorId(),
            command.requestId(),
            command.correlationId(),
            "POST /api/cases/{id}/submit"
        );

        CaseTransitionResult updated = cases.submitCase(
            command.tenantId(),
            command.caseId(),
            command.expectedVersion(),
            command.actorId()
        );

        if (updated == null) {
            session.rollback();
            throw new BusinessConflictException("Case cannot be submitted");
        }

        audit.insertStatusHistory(...);
        outbox.insertCaseSubmitted(...);

        session.commit();

        return new SubmitCaseResult(
            updated.tenantId(),
            updated.caseId(),
            updated.status(),
            updated.version()
        );
    } catch (RuntimeException e) {
        throw mapDatabaseError(e);
    }
}
```

Rule:

```text id="vqc4xz"
Service layer owns transaction.
Mapper/DAO should not independently commit/rollback.
```

---

## 11. Transaction Boundary Anti-Pattern

### Anti-pattern 1 - External call inside transaction

```java id="a57ttl"
try (SqlSession session = sqlSessionFactory.openSession(false)) {
    CaseMapper cases = session.getMapper(CaseMapper.class);

    CaseRow row = cases.findForUpdate(tenantId, caseId);

    externalClient.callPartnerSystem(row); // bad inside DB transaction

    cases.updateAfterExternalCall(...);

    session.commit();
}
```

Masalah:

```text id="3o8ksa"
1. connection ditahan
2. row lock ditahan
3. vacuum cleanup bisa tertahan
4. pool cepat habis
5. latency external menjadi DB contention
```

Lebih baik:

```text id="qxs0to"
BEGIN
  update DB state
  insert outbox event
COMMIT

worker publishes/calls external system after commit
```

---

### Anti-pattern 2 - User think-time inside transaction

```text id="6cjy3u"
BEGIN
load form data
wait user edit 10 minutes
submit update
COMMIT
```

Benar:

```text id="15lxuh"
GET form data without long transaction
client sends expectedVersion
UPDATE ... WHERE version = expectedVersion
```

---

### Anti-pattern 3 - Session tidak ditutup

Buruk:

```java id="31xvov"
SqlSession session = sqlSessionFactory.openSession(false);
// exception occurs
// session not closed
```

Benar:

```java id="ro2446"
try (SqlSession session = sqlSessionFactory.openSession(false)) {
    ...
}
```

---

# 12. Read-Only Query Pattern

Untuk simple point lookup tanpa multi-statement consistency:

```java id="hjdgyj"
public CaseDetail findById(long tenantId, UUID caseId) {
    try (SqlSession session = sqlSessionFactory.openSession(true)) {
        CaseMapper mapper = session.getMapper(CaseMapper.class);
        return mapper.findById(tenantId, caseId);
    }
}
```

Namun banyak tim tetap memakai manual session untuk konsistensi setting:

```java id="q58esu"
try (SqlSession session = sqlSessionFactory.openSession(false)) {
    DbSessionMapper db = session.getMapper(DbSessionMapper.class);
    CaseMapper mapper = session.getMapper(CaseMapper.class);

    db.setReadOnlyTransactionSafety();

    CaseDetail result = mapper.findById(tenantId, caseId);

    session.commit();
    return result;
}
```

SQL settings:

```sql id="w9tajk"
SET LOCAL statement_timeout = '2s';
SET LOCAL lock_timeout = '200ms';
SET TRANSACTION READ ONLY;
```

Practical rule:

```text id="smz4ez"
Read endpoint boleh auto-commit jika satu query dan tidak perlu context/SET LOCAL.
Jika butuh request context, timeout, atau multi-query consistency, gunakan transaction eksplisit pendek.
```

---

# 13. Session Settings yang Sering Dipakai

| Setting | Use case |
|---|---|
| `application_name` | observability di `pg_stat_activity` |
| `search_path` | schema resolution |
| `statement_timeout` | query guardrail |
| `lock_timeout` | fail-fast lock wait |
| `idle_in_transaction_session_timeout` | safety long idle tx |
| `transaction_timeout` | batas total transaction |
| custom `app.actor_id` | audit trigger |
| custom `app.request_id` | traceability |
| custom `app.tenant_id` | RLS/current tenant context |
| `work_mem` | specific heavy query, hati-hati |
| `TimeZone` | display/session timestamp behavior |

Untuk service runtime, hindari session-level setting permanen yang bisa bocor antar-request lewat pool. Gunakan:

```sql id="ya7l75"
SET LOCAL ...
```

atau set default di role/database untuk setting yang memang global.

Contoh role defaults:

```sql id="v8f1f4"
ALTER ROLE app_runtime SET statement_timeout = '5s';
ALTER ROLE app_runtime SET idle_in_transaction_session_timeout = '10s';
ALTER ROLE app_runtime SET lock_timeout = '500ms';
```

Catatan:

```text id="rvsfyt"
Role-level defaults bagus untuk safety baseline.
SET LOCAL bagus untuk command-specific override.
```

---

# 14. `search_path` Safety

Security best practice:

```sql id="rdxoyb"
ALTER ROLE app_runtime SET search_path = app, public;
```

Untuk function `SECURITY DEFINER`, selalu set:

```sql id="ls158b"
SECURITY DEFINER
SET search_path = app, pg_temp
```

Application query sebaiknya schema-qualified jika environment kompleks:

```sql id="k0r4uv"
SELECT *
FROM app.regulatory_case
WHERE tenant_id = #{tenantId}
  AND case_id = #{caseId}
```

Rule:

```text id="x87xda"
search_path yang tidak jelas bisa menyebabkan object resolution salah,
terutama pada SECURITY DEFINER function dan multi-schema deployment.
```

---

# 15. Prepared Statement Behavior pgJDBC

pgJDBC mendukung server-prepared statements. Driver menggunakan `prepareThreshold`; default umumnya 5, artinya statement baru diprepare di server setelah dieksekusi beberapa kali. Server-prepared statement memakai memori di client dan server, sehingga pgJDBC membatasi cache via `preparedStatementCacheQueries` dan `preparedStatementCacheSizeMiB`; dokumentasi pgJDBC menyebut default `preparedStatementCacheQueries=256` dan `preparedStatementCacheSizeMiB=5` per connection. ([pgJDBC](https://jdbc.postgresql.org/documentation/server-prepare/?utm_source=chatgpt.com))

Properties umum:

```properties id="smg4e0"
dataSource.prepareThreshold=5
dataSource.preparedStatementCacheQueries=256
dataSource.preparedStatementCacheSizeMiB=5
```

Mental model:

```text id="gkpotj"
PreparedStatement Java
│
├─ pgJDBC client-side cache
│
├─ after prepareThreshold executions
│
├─ server-prepared statement may be created
│
└─ per connection, not global across pool
```

Important:

```text id="tgtx27"
Jika pool size 20 dan setiap connection punya cache 256,
potensi prepared statement footprint = 20 × 256 per service instance.
```

---

## 16. Prepared Statement Problems yang Sering Muncul

| Problem | Penyebab | Mitigasi |
|---|---|---|
| Many unique SQL texts | dynamic SQL terlalu variatif | whitelist sort, batasi dynamic fragment |
| Server memory pressure | cache per connection besar | kecilkan cache/pool |
| Bad generic/custom plan | parameter distribution skew | cek plan, query split, stats, mungkin tune prepareThreshold |
| DDL changes break prepared statement | schema berubah | recycle connections/deploy carefully |
| PgBouncer transaction pooling | server prepared statement tidak cocok | configure pgJDBC/PgBouncer accordingly |
| MyBatis dynamic SQL explosion | banyak kombinasi literal SQL | konsolidasikan query shape |

Dynamic SQL aman tetapi harus terkendali.

Buruk:

```xml id="h4f353"
ORDER BY ${sortColumn} ${sortDirection}
```

Lebih aman:

```xml id="8c8yez"
<choose>
  <when test="sort == 'CREATED_AT_DESC'">
    ORDER BY created_at DESC, case_id DESC
  </when>
  <otherwise>
    ORDER BY case_id DESC
  </otherwise>
</choose>
```

Rule:

```text id="nfj9av"
Prepared statement caching bekerja baik jika SQL shape terbatas dan stabil.
Jika SQL text unik terus-menerus, cache justru kurang berguna.
```

---

# 17. MyBatis Local Cache

MyBatis punya local cache untuk mencegah circular references dan mempercepat nested query berulang; default `localCacheScope=SESSION`, artinya query dalam satu `SqlSession` dapat memakai cache lokal. Jika diset `STATEMENT`, cache lokal hanya berlaku selama statement execution dan tidak dibagi antar-call dalam session. ([MyBatis](https://mybatis.org/mybatis-3/configuration.html?utm_source=chatgpt.com))

Config:

```xml id="91p4t3"
<settings>
  <setting name="localCacheScope" value="STATEMENT"/>
</settings>
```

Kapan pertimbangkan `STATEMENT`:

```text id="edjipu"
1. SqlSession dipakai untuk banyak statement panjang
2. memory pressure dari local cache
3. query read-after-write membingungkan
4. ingin behavior lebih sederhana di service command
```

Kapan `SESSION` OK:

```text id="h6ulyw"
1. session pendek per request
2. mapper nested query butuh cache
3. tidak ada memory issue
```

Rule:

```text id="i3u365"
SqlSession harus pendek.
Jangan menyelesaikan masalah long session dengan mengandalkan cache behavior.
```

---

# 18. MyBatis Statement Timeout

MyBatis punya setting `defaultStatementTimeout` di configuration. Ini berbeda dari PostgreSQL `statement_timeout`.

```xml id="tn3c7h"
<settings>
  <setting name="defaultStatementTimeout" value="5"/>
</settings>
```

Atau per mapper statement:

```xml id="54n05v"
<select id="findSubmittedCases"
        resultMap="CaseListItemMap"
        timeout="3">
  SELECT ...
</select>
```

Practical rule:

```text id="ho4pyh"
Gunakan dua lapis:
1. MyBatis/JDBC statement timeout sebagai client-side guardrail.
2. PostgreSQL statement_timeout sebagai server-side guardrail.
```

Jika hanya client timeout, query di server bisa tetap berjalan tergantung kondisi cancel/network. Server-side `statement_timeout` lebih eksplisit di PostgreSQL.

---

# 19. Fetch Size dan Streaming Result

Default behavior sering mengambil result set cukup besar ke memory. Untuk export/batch read besar, gunakan fetch size dan transaction boundary yang benar.

pgJDBC mendokumentasikan bahwa cursor-based result set dapat dipakai dengan `setFetchSize`, tetapi connection harus tidak auto-commit agar cursor bisa bekerja. ([pgJDBC](https://jdbc.postgresql.org/documentation/use/?utm_source=chatgpt.com))

MyBatis mapper:

```xml id="xtgz6z"
<select id="streamAuditRows"
        resultMap="AuditRowMap"
        fetchSize="1000">
  SELECT
      tenant_id,
      audit_id,
      case_id,
      event_type,
      occurred_at,
      metadata
  FROM case_audit_log
  WHERE tenant_id = #{tenantId}
    AND occurred_at &gt;= #{from}
    AND occurred_at &lt; #{to}
  ORDER BY occurred_at ASC, audit_id ASC
</select>
```

Caution:

```text id="3na4y7"
Streaming keeps transaction/connection open while consuming rows.
Do not stream huge result through slow HTTP response directly.
Prefer export job / batch writer.
```

Better export pattern:

```text id="iid2e2"
worker transaction reads chunk
write to file/object storage
commit
repeat with cursor
```

---

# 20. Batch Inserts and `reWriteBatchedInserts`

pgJDBC supports `reWriteBatchedInserts=true`, which can rewrite compatible batched inserts into more efficient multi-row form.

Properties:

```properties id="z3di5n"
dataSource.reWriteBatchedInserts=true
```

MyBatis batch executor:

```java id="misnuf"
try (SqlSession session = sqlSessionFactory.openSession(ExecutorType.BATCH, false)) {
    ImportMapper mapper = session.getMapper(ImportMapper.class);

    int count = 0;
    for (ImportRow row : rows) {
        mapper.insertStagingRow(row);
        count++;

        if (count % 1000 == 0) {
            session.flushStatements();
            session.commit();
        }
    }

    session.flushStatements();
    session.commit();
}
```

Rule:

```text id="5nvcvg"
Batch besar:
1. pakai chunk
2. flush/commit berkala
3. hindari satu transaksi raksasa
4. measure WAL/replication lag
5. analyze setelah bulk load bila perlu
```

---

# 21. PgBouncer / Pooler Awareness

Jika environment memakai PgBouncer atau pooler lain:

| Mode | Impact |
|---|---|
| Session pooling | session settings/prepared statements lebih aman |
| Transaction pooling | session state tidak stabil antar transaction |
| Statement pooling | sangat terbatas untuk transaction semantics |

Practical warning:

```text id="5ctra8"
Transaction pooling bisa bermasalah dengan:
- server-side prepared statements
- session-level SET
- temporary tables
- advisory session locks
- LISTEN/NOTIFY
```

Mitigasi:

```text id="5x4ywl"
1. gunakan SET LOCAL, bukan SET
2. hindari session-level advisory lock
3. pertimbangkan prepareThreshold=0 jika server prepared statements tidak compatible
4. gunakan transaction-level advisory lock
5. test MyBatis/pgJDBC behavior di environment pooler yang sama
```

---

# 22. Connection Leak Detection

HikariCP `leakDetectionThreshold` bisa membantu menemukan connection yang dipinjam terlalu lama.

```properties id="7f6eup"
leakDetectionThreshold=10000
```

Gunakan saat investigasi:

```text id="x09txc"
1. pool exhausted
2. suspected session leak
3. slow endpoint holds connection
4. missing close/commit/rollback path
```

Jangan jadikan noisy default terlalu rendah.

Java guardrail:

```java id="8zl48j"
try (SqlSession session = sqlSessionFactory.openSession(false)) {
    ...
    session.commit();
} catch (RuntimeException e) {
    // try-with-resources closes, but explicit rollback inside block
    // is still clearer when handling known business failure paths.
    throw e;
}
```

Safer pattern with rollback:

```java id="dshjqk"
try (SqlSession session = sqlSessionFactory.openSession(false)) {
    try {
        ...
        session.commit();
        return result;
    } catch (RuntimeException e) {
        session.rollback();
        throw e;
    }
}
```

---

# 23. Connection Pool Exhausted Playbook

## Step 1 - App metrics

Check:

```text id="9apt35"
Hikari active connections
Hikari idle connections
Hikari pending threads
connection acquisition time
connection timeout count
request duration
DB query duration
```

## Step 2 - DB session snapshot

```sql id="vjgg5d"
SELECT
    application_name,
    state,
    wait_event_type,
    wait_event,
    count(*) AS session_count,
    max(now() - xact_start) AS max_xact_age,
    max(now() - query_start) AS max_query_age
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY application_name, state, wait_event_type, wait_event
ORDER BY session_count DESC;
```

## Step 3 - Long sessions

```sql id="5wymfu"
SELECT
    pid,
    application_name,
    state,
    wait_event_type,
    wait_event,
    now() - xact_start AS xact_age,
    now() - query_start AS query_age,
    left(query, 1000) AS query
FROM pg_stat_activity
WHERE application_name ILIKE '%case-service%'
ORDER BY xact_start NULLS LAST, query_start NULLS LAST;
```

## Step 4 - Diagnosis matrix

| Evidence | Likely cause |
|---|---|
| many `active`, wait null, CPU high | heavy queries |
| many `Lock` wait | blockers/long transaction |
| many `idle in transaction` | app transaction lifecycle bug |
| many `Client` wait | app not consuming result / network |
| DB sessions normal but app pending high | pool too small or app leak elsewhere |
| max query age high | slow query / missing index |
| max xact age high | long transaction |

---

# 24. Recommended Production Baseline

## PostgreSQL role baseline

```sql id="glbcy7"
ALTER ROLE app_runtime SET statement_timeout = '5s';
ALTER ROLE app_runtime SET lock_timeout = '500ms';
ALTER ROLE app_runtime SET idle_in_transaction_session_timeout = '10s';
ALTER ROLE app_runtime SET application_name = 'app-runtime';
```

## Per-command override

```sql id="u8w22i"
SET LOCAL statement_timeout = '2s';
SET LOCAL lock_timeout = '200ms';
SET LOCAL application_name = 'case-service SearchCases';
```

## Hikari baseline

```properties id="m2x10d"
maximumPoolSize=10
minimumIdle=2
connectionTimeout=3000
validationTimeout=1000
idleTimeout=600000
maxLifetime=1800000
leakDetectionThreshold=10000
```

## pgJDBC baseline

```properties id="syyl8f"
ApplicationName=case-service
prepareThreshold=5
preparedStatementCacheQueries=256
preparedStatementCacheSizeMiB=5
reWriteBatchedInserts=true
```

Adjust based on measured workload.

---

# 25. Security and Role Pattern

Runtime role:

```sql id="vsy2tk"
CREATE ROLE app_runtime LOGIN PASSWORD '...';

GRANT CONNECT ON DATABASE appdb TO app_runtime;
GRANT USAGE ON SCHEMA app TO app_runtime;

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA app
TO app_runtime;

ALTER DEFAULT PRIVILEGES IN SCHEMA app
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_runtime;
```

More restrictive pattern:

```text id="8lkstv"
1. app_runtime_dml
2. app_runtime_readonly
3. app_migration
4. app_maintenance
5. app_reporting
```

Avoid app runtime owning schema objects. Migration role should own DDL; runtime role should execute DML.

---

# 26. Anti-Pattern

## Anti-pattern 1 - Pool size besar untuk “mengatasi lambat”

```properties id="a0eh4s"
maximumPoolSize=100
```

Jika query lambat karena lock/I/O/bad plan, pool besar membuat database makin padat.

Better:

```text id="0p1uk8"
diagnose slow query/wait
tune query/index/transaction
then adjust pool if DB has headroom
```

---

## Anti-pattern 2 - `SET` request context di pooled connection

Buruk:

```sql id="hoov22"
SET app.tenant_id = '1001';
```

Bisa bocor ke request berikutnya.

Better:

```sql id="xqk82i"
SET LOCAL app.tenant_id = '1001';
```

atau:

```sql id="sgqvon"
SELECT set_config('app.tenant_id', '1001', true);
```

---

## Anti-pattern 3 - Tidak ada statement timeout

Tanpa timeout, query salah bisa berjalan terlalu lama dan menahan resource.

Better:

```sql id="aajyxx"
SET LOCAL statement_timeout = '5s';
```

---

## Anti-pattern 4 - Session-level advisory lock di connection pool

Buruk:

```sql id="9rsurf"
SELECT pg_advisory_lock(...);
```

Jika connection kembali ke pool sebelum unlock, lock bisa bertahan.

Better:

```sql id="ggrku9"
SELECT pg_advisory_xact_lock(...);
```

atau:

```sql id="ibvl9f"
SELECT pg_try_advisory_xact_lock(...);
```

---

## Anti-pattern 5 - Streaming result besar ke HTTP response

Risiko:

```text id="zailim"
connection dan transaction terbuka selama client download lambat
vacuum cleanup bisa tertahan
pool terpakai lama
```

Better:

```text id="yfh4df"
async export job
chunked DB reads
write to object storage
return download link/status
```

---

## Anti-pattern 6 - Dynamic SQL explosion

Terlalu banyak SQL shape mengurangi manfaat prepared statement cache dan mempersulit `pg_stat_statements`.

Better:

```text id="pkwutg"
whitelist filter/sort
query-specific mapper
batasi kombinasi search
```

---

# 27. Production Checklist

| Checklist | Pertanyaan |
|---|---|
| Pool budget | Apakah total pool semua pod <= DB connection budget? |
| Pool metrics | Apakah active/idle/pending/acquisition time dimonitor? |
| Transaction owner | Apakah service layer mengontrol commit/rollback? |
| Session close | Apakah `SqlSession` selalu try-with-resources? |
| Timeout baseline | Apakah role/app punya `statement_timeout`? |
| Lock timeout | Apakah user command punya `lock_timeout` pendek? |
| Idle tx timeout | Apakah `idle_in_transaction_session_timeout` aktif? |
| `SET LOCAL` | Apakah request context tidak bocor antar-connection? |
| application_name | Apakah service/endpoint terlihat di `pg_stat_activity`? |
| Prepared cache | Apakah pgJDBC cache disesuaikan dengan pool size/memory? |
| Dynamic SQL | Apakah SQL shape terkendali? |
| Fetch size | Apakah export/batch besar tidak load semua row ke memory? |
| Batch chunking | Apakah batch insert/update commit per chunk? |
| Pooler compatibility | Jika PgBouncer, apakah prepared/session features aman? |
| Leak detection | Apakah leak detection tersedia saat incident? |
| No external in tx | Apakah external API tidak dipanggil dalam DB transaction? |
| Role separation | Apakah runtime role bukan migration owner? |

---

# 28. Mini Lab

## Step 1 - Cek koneksi aktif per application

```sql id="gny8br"
SELECT
    application_name,
    state,
    count(*) AS count,
    max(now() - xact_start) AS max_xact_age,
    max(now() - query_start) AS max_query_age
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY application_name, state
ORDER BY count DESC;
```

## Step 2 - Simulasikan transaction safety

```sql id="vxugdn"
BEGIN;

SET LOCAL lock_timeout = '500ms';
SET LOCAL statement_timeout = '5s';
SET LOCAL idle_in_transaction_session_timeout = '10s';

SELECT current_setting('statement_timeout') AS statement_timeout,
       current_setting('lock_timeout') AS lock_timeout,
       current_setting('idle_in_transaction_session_timeout') AS idle_tx_timeout;

COMMIT;
```

## Step 3 - Buktikan `SET LOCAL` tidak bocor

```sql id="xnwrs7"
SHOW statement_timeout;
```

Expected:

```text id="ucsdw1"
Kembali ke default role/session setelah transaction selesai.
```

## Step 4 - Cek prepared statements dalam session

```sql id="p40s2e"
SELECT
    name,
    statement,
    prepare_time,
    parameter_types,
    from_sql
FROM pg_prepared_statements;
```

Catatan:

```text id="9q2mz5"
Ini hanya menunjukkan prepared statements di session saat ini.
Prepared statement pgJDBC bersifat per connection.
```

## Step 5 - Cek idle in transaction

```sql id="kmioyr"
SELECT
    pid,
    application_name,
    state,
    now() - xact_start AS xact_age,
    now() - state_change AS idle_age,
    left(query, 500) AS last_query
FROM pg_stat_activity
WHERE state = 'idle in transaction'
ORDER BY xact_start ASC;
```

---

## 29. Ringkasan Praktis

```text id="4ky7og"
1. Connection pool adalah concurrency limiter, bukan sekadar performance booster.
2. Total pool semua service/pod harus masuk DB connection budget.
3. Jika pool exhausted, diagnosis dulu active sessions, locks, idle transaction, dan slow queries.
4. Gunakan timeout berlapis: request, pool, statement, lock, idle transaction.
5. Untuk pooled connection, request context harus SET LOCAL atau set_config(..., true).
6. MyBatis service layer harus mengontrol SqlSession transaction boundary.
7. Jangan external call di dalam DB transaction.
8. pgJDBC server-prepared statements dan cache bersifat per connection; pool size memengaruhi memory footprint.
9. Dynamic SQL harus terkendali agar prepared cache dan pg_stat_statements tetap berguna.
10. Streaming/fetch size perlu hati-hati karena connection/transaction tetap terbuka selama konsumsi result.
11. Batch harus chunked, bukan satu transaksi raksasa.
12. application_name, request_id, SQLSTATE, dan mapper id wajib untuk incident diagnosis.
```

---

# Status Seri

**Seri 17/22 selesai.**

Rekomendasi lanjut ke:

**Seri 18 - WAL, Checkpoint, Backup, PITR, dan Recovery untuk PostgreSQL OLTP: write-ahead logging, checkpoint tuning, base backup, archive WAL, restore drill, dan reliability runbook.**

---

**Sources:**

- [Documentation: 18: 19.3. Connections and Authentication](https://www.postgresql.org/docs/current/runtime-config-connection.html?utm_source=chatgpt.com)
- [brettwooldridge/HikariCP: 光 HikariCP・A solid, high- ...](https://github.com/brettwooldridge/hikaricp?utm_source=chatgpt.com)
- [Java API - MyBatis 3](https://mybatis.org/mybatis-3/java-api.html?utm_source=chatgpt.com)
- [PostgreSQL® Extensions to the JDBC API](https://jdbc.postgresql.org/documentation/server-prepare/?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:47:16 PM

Saya lanjut ke **Seri 18/22**. Fokusnya reliability operasional: WAL, checkpoint, backup, PITR, restore drill, dan runbook recovery yang relevan untuk OLTP microservice.

# PostgreSQL OLTP - Seri 18/22  
## WAL, Checkpoint, Backup, PITR, dan Recovery: Write-Ahead Logging, Base Backup, WAL Archive, Restore Drill, dan Reliability Runbook

Seri ini fokus pada **reliability operasional PostgreSQL OLTP**. Targetnya bukan sekadar “punya backup”, tapi bisa menjawab:

```text id="pz7w0v"
1. Kalau database crash, apa yang terjadi?
2. Kalau storage corrupt, bisa restore?
3. Kalau user salah delete data, bisa balik ke waktu sebelum kejadian?
4. Berapa data loss maksimal yang bisa diterima?
5. Berapa lama sistem boleh down?
6. Kapan terakhir restore benar-benar dites?
7. Apakah backup dan WAL archive bisa dipakai saat incident?
```

PostgreSQL menyimpan **Write-Ahead Log / WAL** di subdirectory `pg_wal` dalam data directory; WAL merekam perubahan data dan dipakai untuk crash recovery serta Point-In-Time Recovery / PITR melalui continuous archiving. ([PostgreSQL](https://www.postgresql.org/docs/current/continuous-archiving.html?utm_source=chatgpt.com))

---

## 1. Mental Model

```text id="c3ewr3"
PostgreSQL Reliability Chain
│
├─ WAL
│  ├─ every change written to WAL
│  ├─ crash recovery
│  ├─ replication stream
│  └─ PITR replay source
│
├─ Checkpoint
│  ├─ sync dirty pages to disk
│  ├─ recovery starting point
│  ├─ affects crash recovery time
│  └─ affects write I/O burst
│
├─ Base Backup
│  ├─ physical copy of cluster
│  ├─ starting point for restore
│  ├─ created online via pg_basebackup
│  └─ must be paired with WAL
│
├─ WAL Archive
│  ├─ archive_mode
│  ├─ archive_command / archive_library
│  ├─ stores WAL segments safely
│  └─ required for PITR
│
├─ Restore / PITR
│  ├─ restore base backup
│  ├─ configure restore_command
│  ├─ create recovery.signal
│  ├─ set recovery target
│  └─ replay WAL until target
│
└─ Reliability Runbook
   ├─ RPO
   ├─ RTO
   ├─ backup validation
   ├─ restore drill
   ├─ monitoring
   └─ incident decision tree
```

Rule utama:

```text id="cf9kdz"
Backup yang belum pernah di-restore adalah asumsi, bukan reliability.
```

---

## 2. RPO dan RTO

| Istilah | Arti | Contoh |
|---|---|---|
| RPO | Recovery Point Objective, data loss maksimum yang diterima | “maksimal hilang 5 menit data” |
| RTO | Recovery Time Objective, downtime maksimum yang diterima | “database harus kembali dalam 30 menit” |
| Base backup | snapshot fisik awal | backup harian |
| WAL archive | perubahan setelah base backup | archive setiap WAL segment |
| PITR | restore ke waktu tertentu | sebelum accidental delete |
| Restore drill | latihan restore berkala | bulanan/kuartalan |

Practical mapping:

```text id="mdj2t6"
RPO kecil → WAL archive harus reliable dan sering.
RTO kecil → restore automation, standby, dan drill harus matang.
```

---

## 3. WAL: Apa yang Harus Dipahami Engineer

WAL adalah log perubahan sebelum data page dianggap aman. Jika server crash, PostgreSQL bisa replay WAL dari checkpoint terakhir untuk mengembalikan database ke state konsisten. Untuk PITR, base backup + WAL archive dipakai untuk restore sampai titik waktu tertentu. ([PostgreSQL](https://www.postgresql.org/docs/current/continuous-archiving.html?utm_source=chatgpt.com))

```text id="d6i305"
Data change
│
├─ write WAL record
├─ commit can be acknowledged according to durability settings
├─ dirty data page later flushed to disk
└─ checkpoint records recovery boundary
```

Yang relevan untuk OLTP:

| Area | Kenapa penting |
|---|---|
| `pg_wal` penuh | database bisa berhenti menerima write |
| WAL archive gagal | PITR gap; restore tidak lengkap |
| checkpoint terlalu sering | I/O spike |
| checkpoint terlalu jarang | crash recovery lebih lama |
| large batch/write burst | WAL volume besar |
| replication slot stuck | WAL tertahan dan disk penuh |
| unlogged table | tidak aman untuk crash/PITR seperti logged table |
| `synchronous_commit` | trade-off latency vs durability |

---

## 4. Checkpoint

Checkpoint adalah proses ketika PostgreSQL memastikan data file telah mencapai titik konsisten tertentu sehingga crash recovery bisa mulai dari checkpoint tersebut, bukan dari awal WAL. Parameter WAL/checkpoint seperti `checkpoint_timeout`, `max_wal_size`, `min_wal_size`, dan `checkpoint_completion_target` dikonfigurasi di bagian Write-Ahead Log configuration PostgreSQL. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-wal.html?utm_source=chatgpt.com))

Contoh baseline:

```conf id="t1n3ip"
checkpoint_timeout = '15min'
max_wal_size = '8GB'
min_wal_size = '2GB'
checkpoint_completion_target = 0.9
```

Interpretasi:

| Parameter | Fungsi |
|---|---|
| `checkpoint_timeout` | maksimum waktu antar checkpoint |
| `max_wal_size` | WAL size yang dapat memicu checkpoint lebih cepat |
| `min_wal_size` | WAL retained minimum untuk recycle |
| `checkpoint_completion_target` | menyebar I/O checkpoint agar tidak terlalu bursty |

Rule praktis:

```text id="l0b7ny"
Checkpoint terlalu sering → write I/O spike.
Checkpoint terlalu jarang → crash recovery lebih lama dan WAL lebih besar.
Tuning harus melihat write workload, storage, dan recovery target.
```

Monitoring checkpoint log:

```conf id="6edb6r"
log_checkpoints = on
```

Useful saat investigasi:

```text id="qpmmz1"
1. checkpoint terlalu sering?
2. checkpoint selesai tepat waktu?
3. berapa buffers written?
4. apakah terjadi karena timeout atau max_wal_size?
```

---

## 5. Backup Strategy: Logical vs Physical

| Backup type | Tool | Cocok untuk | Tidak cocok untuk |
|---|---|---|---|
| Logical dump | `pg_dump`, `pg_dumpall` | object/table-level export, migration, small/medium DB | fast full cluster recovery besar |
| Physical base backup | `pg_basebackup`, file-system backup protocol | full cluster restore, PITR, standby seed | selective object restore |
| Continuous archiving | WAL archive | PITR | tanpa base backup |
| Snapshot storage | disk/cloud snapshot with PostgreSQL-safe procedure | infra-level backup | tanpa WAL consistency/PITR plan |
| Third-party backup manager | pgBackRest/Barman/WAL-G class tools | automation, retention, cloud archive | tetap harus diuji restore |

PostgreSQL chapter “Backup and Restore” membahas dump SQL, file-system-level backup, dan continuous archiving/PITR sebagai pendekatan backup utama. ([PostgreSQL](https://www.postgresql.org/docs/current/backup.html?utm_source=chatgpt.com))

Practical recommendation untuk OLTP production:

```text id="j3xj16"
Minimum production-grade:
1. physical base backup berkala
2. continuous WAL archiving
3. retention policy
4. monitoring archive failure
5. restore drill berkala
6. documented RPO/RTO
```

---

## 6. WAL Archiving Setup

PostgreSQL continuous archiving membutuhkan WAL archive yang lengkap. Parameter utama adalah `archive_mode` dan `archive_command`; `archive_command` adalah shell command yang menerima `%p` sebagai path WAL file dan `%f` sebagai nama file tujuan. ([PostgreSQL](https://www.postgresql.org/docs/current/continuous-archiving.html?utm_source=chatgpt.com))

Contoh konsep:

```conf id="52ozwb"
wal_level = replica
archive_mode = on
archive_command = 'test ! -f /pg-wal-archive/%f && cp %p /pg-wal-archive/%f'
archive_timeout = '5min'
```

Catatan:

```text id="9emr72"
archive_command harus return success hanya jika WAL benar-benar aman tersimpan.
Jika command gagal, PostgreSQL akan retry.
Jangan membuat archive_command yang diam-diam sukses padahal copy gagal.
```

Production biasanya archive ke storage durable:

```text id="k6c6sz"
On-prem:
- dedicated backup server
- replicated storage
- object storage compatible system

Cloud:
- S3 / Azure Blob / GCS equivalent
- immutable/versioned bucket jika memungkinkan
- encryption + lifecycle retention
```

---

## 7. Monitoring WAL Archive

Cek archiver:

```sql id="ak6p2o"
SELECT
    archived_count,
    last_archived_wal,
    last_archived_time,
    failed_count,
    last_failed_wal,
    last_failed_time,
    stats_reset
FROM pg_stat_archiver;
```

Alert penting:

```text id="xc6aem"
1. failed_count meningkat
2. last_archived_time terlalu lama
3. pg_wal disk usage naik cepat
4. archive destination penuh
5. WAL archive gap
```

Jika archive gagal lama:

```text id="co3e6g"
Risiko:
- pg_wal membesar
- disk primary penuh
- write database terganggu
- PITR tidak lengkap
```

---

## 8. Base Backup dengan `pg_basebackup`

`pg_basebackup` dipakai untuk mengambil base backup dari PostgreSQL cluster yang sedang berjalan tanpa mengganggu client lain; hasilnya bisa dipakai untuk PITR atau sebagai starting point standby server. ([PostgreSQL](https://www.postgresql.org/docs/current/app-pgbasebackup.html?utm_source=chatgpt.com))

Contoh backup directory format:

```bash id="lyz24b"
pg_basebackup \
  -h primary-db \
  -p 5432 \
  -U backup_user \
  -D /backups/base/2026-07-15_230000 \
  -Fp \
  -Xs \
  -P \
  --checkpoint=fast
```

Penjelasan singkat:

| Option | Arti |
|---|---|
| `-D` | destination directory |
| `-Fp` | plain format |
| `-Xs` | stream WAL during backup |
| `-P` | progress |
| `--checkpoint=fast` | request checkpoint cepat saat backup start |

Contoh tar format:

```bash id="p20is3"
pg_basebackup \
  -h primary-db \
  -U backup_user \
  -D /backups/base/2026-07-15_230000 \
  -Ft \
  -Xs \
  -z \
  -P
```

Practical rule:

```text id="r6yke1"
Base backup harus disimpan terpisah dari server primary.
Backup di disk yang sama dengan primary bukan disaster recovery.
```

---

## 9. Backup User / Role

Contoh role backup:

```sql id="5xyy78"
CREATE ROLE backup_user
WITH LOGIN REPLICATION PASSWORD 'change-me';

GRANT pg_read_all_settings TO backup_user;
GRANT pg_read_all_stats TO backup_user;
```

Untuk `pg_basebackup`, role biasanya perlu privilege replication atau superuser-equivalent sesuai konfigurasi akses. Pastikan `pg_hba.conf` mengizinkan koneksi replication dari host backup.

Contoh `pg_hba.conf` konseptual:

```conf id="p1t262"
host    replication     backup_user     10.10.10.20/32     scram-sha-256
```

Rule:

```text id="rn7ifo"
Backup user harus minimal privilege yang cukup.
Jangan pakai app_runtime role untuk backup.
```

---

## 10. Backup Manifest dan Validasi

Base backup modern bisa menyertakan manifest untuk verifikasi integritas backup.

Contoh:

```bash id="f70kn4"
pg_basebackup \
  -h primary-db \
  -U backup_user \
  -D /backups/base/2026-07-15_230000 \
  -Fp \
  -Xs \
  -P \
  --manifest-checksums=SHA256
```

Validasi:

```bash id="r8111n"
pg_verifybackup /backups/base/2026-07-15_230000
```

Practical rule:

```text id="54iqh1"
Backup validation punya dua level:
1. verify backup files/checksum
2. restore drill dan query aplikasi berjalan
```

File valid belum tentu restore process siap.

---

## 11. Restore / PITR Mental Model

```text id="cx9j26"
PITR restore
│
├─ choose base backup before target time
├─ restore data directory from base backup
├─ configure restore_command
├─ configure recovery target
├─ create recovery.signal
├─ start PostgreSQL
├─ PostgreSQL replays archived WAL
├─ stop at target
└─ promote / pause / inspect
```

Untuk archive recovery, PostgreSQL membutuhkan `restore_command`, yaitu command untuk mengambil WAL archived segment; recovery target bisa berupa waktu, LSN, restore point name, transaction id, atau immediate. ([PostgreSQL](https://www.postgresql.org/docs/current/continuous-archiving.html?utm_source=chatgpt.com))

---

## 12. PITR by Timestamp

Contoh `postgresql.conf` pada restore target:

```conf id="24be3e"
restore_command = 'cp /pg-wal-archive/%f %p'
recovery_target_time = '2026-07-15 10:30:00+07'
recovery_target_action = 'pause'
```

Buat signal file:

```bash id="hlgn29"
touch /var/lib/postgresql/data/recovery.signal
```

Start PostgreSQL:

```bash id="nw6e29"
pg_ctl -D /var/lib/postgresql/data start
```

Setelah recovery mencapai target dan pause, inspeksi data:

```sql id="yft3e1"
SELECT pg_is_in_recovery();
```

Jika sudah benar dan ingin promote:

```sql id="5z6mc2"
SELECT pg_wal_replay_resume();
```

atau gunakan action promote sesuai recovery target action.

Caution:

```text id="g27q84"
Restore ke waktu tertentu harus memakai timezone eksplisit.
Jangan pakai timestamp ambigu saat incident.
```

---

## 13. PITR by Named Restore Point

Sebelum release/migration besar:

```sql id="3z2iqk"
SELECT pg_create_restore_point('before_release_2026_07_15');
```

PostgreSQL menyediakan `pg_create_restore_point(name)`; nama ini bisa dipakai dengan `recovery_target_name` untuk menentukan titik recovery. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-admin.html?utm_source=chatgpt.com))

Recovery config:

```conf id="oq1y3t"
restore_command = 'cp /pg-wal-archive/%f %p'
recovery_target_name = 'before_release_2026_07_15'
recovery_target_action = 'pause'
```

Use case:

```text id="24h5p5"
1. sebelum migration besar
2. sebelum bulk data fix
3. sebelum release risky
4. sebelum maintenance administratif
```

Rule:

```text id="untiyj"
Restore point bukan pengganti backup.
Restore point hanya marker dalam WAL stream.
```

---

## 14. PITR by LSN

Ambil current LSN:

```sql id="zsfriw"
SELECT pg_current_wal_lsn();
```

Recovery config:

```conf id="3fnnz5"
restore_command = 'cp /pg-wal-archive/%f %p'
recovery_target_lsn = '0/50000A0'
recovery_target_action = 'pause'
```

Use case:

```text id="0f2lz6"
1. forensic recovery
2. restore before/after known WAL position
3. coordination dengan replication/CDC team
```

---

## 15. Restore Drill Runbook

Restore drill minimal bulanan/kuartalan tergantung kritikalitas.

```text id="fd4ysr"
Restore Drill
│
├─ pick latest base backup
├─ provision isolated restore environment
├─ restore base backup
├─ configure WAL restore_command
├─ recover to latest or target time
├─ run validation SQL
├─ run application smoke test
├─ measure RTO
├─ estimate RPO
├─ document issues
└─ fix backup/runbook gaps
```

Validation SQL:

```sql id="s89awg"
SELECT current_database();

SELECT
    count(*) AS case_count
FROM regulatory_case;

SELECT
    max(created_at) AS latest_case_created_at
FROM regulatory_case;

SELECT
    count(*) AS outbox_new_count
FROM outbox_event
WHERE status = 'NEW';

SELECT
    pg_is_in_recovery();
```

Application smoke test:

```text id="b3bhgg"
1. service can connect
2. read key endpoint
3. run representative query
4. verify tenant boundary
5. verify latest expected data exists
6. verify no migration mismatch
```

Record result:

| Metric | Example |
|---|---|
| backup chosen | `base_2026-07-15_230000` |
| target time | `2026-07-15 23:30:00+07` |
| restore duration | 42 minutes |
| WAL replay duration | 8 minutes |
| total RTO observed | 50 minutes |
| latest recovered transaction | 23:29:48 |
| estimated RPO | 12 seconds |
| issues | missing WAL segment? permission? slow download? |

---

## 16. Backup Retention Policy

Contoh retention:

```text id="f6eu1u"
Base backup:
- daily for 7 days
- weekly for 4 weeks
- monthly for 6-12 months

WAL archive:
- retain at least from oldest retained base backup
- never delete WAL needed by retained base backups
- lifecycle archive after compliance window
```

Rule:

```text id="3mc0w5"
WAL archive retention harus konsisten dengan base backup retention.
Base backup tanpa WAL setelahnya tidak bisa PITR ke waktu target.
WAL tanpa base backup yang relevan tidak cukup untuk restore.
```

---

## 17. WAL Disk Full Playbook

Gejala:

```text id="e44ka4"
1. pg_wal directory membesar
2. disk hampir penuh
3. archive failure
4. replication slot menahan WAL
5. database write mulai gagal/terhenti
```

Cek archive:

```sql id="fdjyvj"
SELECT
    archived_count,
    last_archived_wal,
    last_archived_time,
    failed_count,
    last_failed_wal,
    last_failed_time
FROM pg_stat_archiver;
```

Cek replication slot:

```sql id="2dnky7"
SELECT
    slot_name,
    slot_type,
    database,
    active,
    restart_lsn,
    confirmed_flush_lsn,
    wal_status,
    safe_wal_size
FROM pg_replication_slots;
```

Cek WAL dir size dari OS:

```bash id="exmkvs"
du -sh "$PGDATA/pg_wal"
```

Decision tree:

```text id="no3g0b"
If archive failing:
  fix archive destination / permission / storage full
  do not delete pg_wal manually

If replication slot inactive and retaining WAL:
  confirm slot owner/use
  drop slot only after approval

If disk critical:
  add disk / extend volume first if possible
  then fix root cause
```

Rule keras:

```text id="w5gox4"
Jangan delete file dari pg_wal secara manual.
Itu bisa merusak database/recovery chain.
```

---

## 18. Replication Slot dan WAL Retention

Replication slots menjaga WAL yang masih dibutuhkan subscriber/standby. Ini berguna agar standby/CDC tidak kehilangan WAL, tetapi slot yang inactive bisa membuat WAL menumpuk. PostgreSQL menyediakan konfigurasi seperti `max_slot_wal_keep_size` untuk membatasi WAL yang ditahan oleh replication slot. ([PostgreSQL](https://www.postgresql.org/docs/current/bookindex.html?utm_source=chatgpt.com))

Cek slot:

```sql id="zh9az3"
SELECT
    slot_name,
    slot_type,
    active,
    restart_lsn,
    confirmed_flush_lsn,
    pg_size_pretty(
        pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)
    ) AS retained_wal
FROM pg_replication_slots
WHERE restart_lsn IS NOT NULL;
```

Operational rule:

```text id="d9j7sp"
Setiap replication slot harus punya owner:
- standby mana?
- CDC connector mana?
- kapan boleh drop?
- alert jika inactive/lag tinggi?
```

---

## 19. `synchronous_commit`: Durability vs Latency

`synchronous_commit` mengatur kapan PostgreSQL menganggap commit sukses relatif terhadap WAL flush/replication. Setting ini memengaruhi trade-off latency dan durability. Parameter ini dibahas di runtime WAL configuration PostgreSQL. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-wal.html?utm_source=chatgpt.com))

Common policy:

| Workload | Suggested policy |
|---|---|
| financial/regulatory core transaction | keep durable default / evaluate synchronous replication |
| audit/outbox critical | durable |
| ephemeral queue cache | maybe relaxed only if acceptable |
| import staging | maybe relaxed per session if rebuildable |
| test/dev | flexible |

Contoh per transaction, jika benar-benar bisa menerima risiko:

```sql id="qj2p87"
SET LOCAL synchronous_commit = off;
```

Caution:

```text id="5m6q5e"
Jangan disable durability untuk core OLTP tanpa explicit risk acceptance.
Latency turun bisa dibayar dengan data loss pada crash.
```

---

## 20. Unlogged Table: Cepat tapi Tidak untuk Durable Data

`UNLOGGED` table tidak menulis WAL untuk data seperti normal logged table, sehingga lebih cepat untuk staging/cache tertentu, tetapi tidak crash-safe seperti regular table dan tidak cocok untuk data durable.

Use case:

```text id="5v1lp5"
boleh:
- temporary import staging yang bisa diulang
- cache lokal database
- transient computation

jangan:
- regulatory_case
- audit_log
- outbox_event
- idempotency_request penting
- financial/decision data
```

Contoh:

```sql id="p20c4o"
CREATE UNLOGGED TABLE import_staging_unlogged (
    import_id uuid NOT NULL,
    row_number integer NOT NULL,
    payload jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT clock_timestamp(),

    PRIMARY KEY (import_id, row_number)
);
```

---

## 21. Backup dan Kubernetes / Cloud / On-Prem

Practical concerns:

| Environment | Concern |
|---|---|
| Kubernetes | pod restart bukan backup; PV snapshot harus PostgreSQL-safe |
| On-prem | backup server/storage terpisah, fire/failure domain |
| AWS/Azure | managed backup settings perlu dipahami RPO/RTO-nya |
| Self-managed cloud VM | WAL archive ke object storage, test restore to new VM |
| Hybrid | network bandwidth restore, encryption, IAM, data residency |

Rule:

```text id="0rtrw4"
Backup harus keluar dari failure domain primary:
- beda disk
- beda host
- beda availability zone / data center
- immutable / versioned storage jika memungkinkan
```

---

## 22. App-Level Recovery Concerns

Saat restore ke waktu lampau, aplikasi bisa melihat efek samping yang sudah terjadi di luar database.

Contoh:

```text id="j9322h"
Database restored to 10:30.
Kafka/RabbitMQ/external API already received events until 10:45.
Payment gateway already processed request.
Email already sent.
```

Artinya PITR bukan hanya database problem.

Runbook harus mencakup:

```text id="shvjy2"
1. pause app writers
2. pause outbox publishers
3. pause consumers if needed
4. identify external side effects after target time
5. reconcile outbox/inbox
6. handle duplicate/replayed events idempotently
7. coordinate with downstream services
```

Outbox/inbox membantu karena event trail ada di database, tetapi jika restore mundur, downstream mungkin sudah memproses event yang “hilang” dari restored DB. Ini perlu reconciliation.

---

## 23. Recovery Decision Tree

```text id="jtuuuv"
Incident: data issue / crash / corruption
│
├─ Can primary continue safely?
│  ├─ yes → stop writers if needed, take forensic snapshot
│  └─ no → failover/restore path
│
├─ Is issue logical data mistake?
│  ├─ small scope → forward fix / compensating transaction
│  └─ large scope → PITR candidate
│
├─ Is issue physical failure?
│  ├─ standby available → failover
│  └─ no standby → restore backup + WAL
│
├─ Choose recovery target
│  ├─ timestamp
│  ├─ restore point
│  ├─ LSN
│  └─ latest
│
├─ Restore in isolated environment first
│
├─ Validate data
│
├─ Decide cutover
│
└─ Reconcile external systems
```

Rule:

```text id="y7dues"
Untuk logical mistake, PITR bukan selalu pilihan terbaik.
Kadang forward correction lebih aman daripada rollback seluruh database.
```

---

## 24. Java/Jersey/MyBatis Implication

### 24.1 Transactional outbox wajib untuk recovery consistency

```text id="c0kgwh"
Business state + outbox event commit bersama.
Jika restore/PITR dilakukan, outbox bisa dipakai untuk reconcile intent-to-publish.
```

### 24.2 Idempotency key membantu replay

```text id="x5mlaa"
Jika client retry setelah failover/restore,
idempotency table mencegah duplicate business effect.
```

### 24.3 Service startup setelah restore

Checklist service:

```text id="fv99ft"
1. verify schema migration version
2. pause workers until DB validation selesai
3. resume API read-only dulu jika perlu
4. resume writers setelah cutover approved
5. resume outbox/inbox workers carefully
6. monitor duplicate/conflict SQLSTATE
```

### 24.4 MyBatis migration compatibility

Jika restore ke waktu sebelum migration tertentu:

```text id="mx4mxo"
App version dan DB schema bisa tidak match.
Runbook harus menentukan:
- restore DB ke target time
- deploy matching app version
- or apply forward migration after restore
```

---

## 25. Monitoring Queries

### WAL generation rate approximation

```sql id="j8nonj"
SELECT
    pg_current_wal_lsn() AS current_lsn;
```

Ambil dua sample dalam interval, lalu:

```sql id="cu6dpe"
SELECT
    pg_size_pretty(
        pg_wal_lsn_diff(:lsn_after, :lsn_before)
    ) AS wal_generated;
```

### Checkpoint activity

```sql id="e7vg5a"
SELECT
    checkpoints_timed,
    checkpoints_req,
    checkpoint_write_time,
    checkpoint_sync_time,
    buffers_checkpoint,
    buffers_clean,
    maxwritten_clean,
    buffers_backend,
    buffers_backend_fsync
FROM pg_stat_bgwriter;
```

### WAL archive status

```sql id="fe1o6q"
SELECT
    archived_count,
    last_archived_wal,
    last_archived_time,
    failed_count,
    last_failed_wal,
    last_failed_time
FROM pg_stat_archiver;
```

### Replication slots retaining WAL

```sql id="zvpbxh"
SELECT
    slot_name,
    slot_type,
    active,
    pg_size_pretty(
        pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)
    ) AS retained_wal
FROM pg_replication_slots
WHERE restart_lsn IS NOT NULL;
```

---

## 26. Backup Runbook Template

```text id="n723gc"
Daily Backup Runbook
│
├─ verify archive_command success
├─ run pg_basebackup
├─ verify backup manifest
├─ upload/copy to durable storage
├─ record backup metadata
├─ test WAL availability range
├─ update retention catalog
└─ alert on failure
```

Metadata table example:

```sql id="cf97j7"
CREATE TABLE backup_catalog (
    backup_id          uuid NOT NULL DEFAULT uuidv7(),
    backup_type        text NOT NULL,
    started_at         timestamptz NOT NULL,
    completed_at       timestamptz,
    status             text NOT NULL,
    base_backup_path   text,
    wal_start_lsn      pg_lsn,
    wal_end_lsn        pg_lsn,
    manifest_verified  boolean NOT NULL DEFAULT false,
    restore_tested_at  timestamptz,
    notes              text,

    CONSTRAINT pk_backup_catalog
        PRIMARY KEY (backup_id),

    CONSTRAINT chk_backup_catalog__status
        CHECK (status IN ('STARTED', 'SUCCESS', 'FAILED'))
);
```

---

## 27. Restore Drill Checklist

| Step | Check |
|---|---|
| Pick target | latest / timestamp / restore point |
| Find base backup | backup before target |
| Confirm WAL coverage | all WAL from backup start to target available |
| Restore isolated | never overwrite primary during drill |
| Configure recovery | `restore_command`, target, `recovery.signal` |
| Start database | watch logs |
| Validate recovery | `pg_is_in_recovery`, target reached |
| Validate data | key tables, latest expected row |
| App smoke test | read endpoint, critical query |
| Measure RTO | total time |
| Estimate RPO | target vs latest recovered |
| Document gaps | missing permissions, slow archive, schema mismatch |

---

## 28. Anti-Pattern

### Anti-pattern 1 - Backup di disk primary yang sama

```text id="7nx82h"
Primary disk rusak → database dan backup hilang bersama.
```

Lebih baik:

```text id="ry3zbs"
backup ke storage terpisah dan durable.
```

---

### Anti-pattern 2 - WAL archive tidak dimonitor

```text id="k3m20i"
Base backup sukses,
archive_command gagal 3 hari,
PITR ternyata tidak bisa ke target.
```

Wajib monitor `pg_stat_archiver`.

---

### Anti-pattern 3 - Tidak pernah restore drill

```text id="0yu0i1"
Backup file ada,
tetapi:
- permission salah
- WAL missing
- restore_command salah
- app schema mismatch
- RTO jauh lebih lama dari target
```

---

### Anti-pattern 4 - Manual delete `pg_wal`

```text id="89ncnf"
Jangan pernah menghapus file pg_wal manual untuk “mengosongkan disk”.
Fix root cause: archive failure, slot lag, WAL volume, disk capacity.
```

---

### Anti-pattern 5 - PITR untuk semua logical mistake

Jika hanya beberapa row salah, forward correction lebih aman daripada rollback seluruh database dan semua side effect external.

---

### Anti-pattern 6 - Outbox publisher tetap jalan saat restore/cutover

Saat recovery/cutover:

```text id="fdtjpl"
pause outbox publisher dulu.
Validasi restored outbox state.
Baru resume dengan idempotency/reconciliation.
```

---

## 29. Production Checklist

| Checklist | Pertanyaan |
|---|---|
| RPO defined | Berapa data loss maksimum yang diterima? |
| RTO defined | Berapa downtime maksimum yang diterima? |
| Base backup | Apakah base backup berjalan berkala? |
| WAL archive | Apakah `archive_mode` dan archive command reliable? |
| Archive monitoring | Apakah `pg_stat_archiver.failed_count` dimonitor? |
| Offsite storage | Apakah backup keluar dari failure domain primary? |
| Manifest verify | Apakah backup diverifikasi? |
| Restore drill | Kapan terakhir restore benar-benar dilakukan? |
| WAL retention | Apakah WAL retained sepanjang base backup retention? |
| Slot monitoring | Apakah replication slot inactive/lag dimonitor? |
| Checkpoint logs | Apakah checkpoint behavior terlihat? |
| Disk alert | Apakah `pg_wal` dan data disk punya alert? |
| Recovery target | Apakah tim tahu timestamp/name/LSN target? |
| App coordination | Apakah writers/workers/outbox/inbox punya pause runbook? |
| Schema compatibility | Apakah app version vs DB restore time dipikirkan? |
| Security | Apakah backup encrypted dan access controlled? |
| Audit | Apakah backup/restore operation tercatat? |

---

## 30. Mini Lab: PITR Konseptual di Environment Non-Production

### Step 1 - Enable archive

```conf id="ybbz60"
wal_level = replica
archive_mode = on
archive_command = 'test ! -f /tmp/pg-wal-archive/%f && cp %p /tmp/pg-wal-archive/%f'
archive_timeout = '1min'
```

Restart PostgreSQL jika parameter membutuhkan restart.

### Step 2 - Create test table

```sql id="q52c2e"
CREATE TABLE pitr_lab (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    label       text NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT clock_timestamp()
);

INSERT INTO pitr_lab (label) VALUES ('before backup');
```

### Step 3 - Take base backup

```bash id="csmj43"
pg_basebackup \
  -h localhost \
  -U backup_user \
  -D /tmp/pg-basebackup-lab \
  -Fp \
  -Xs \
  -P
```

### Step 4 - Create restore point

```sql id="ke3gpg"
SELECT pg_create_restore_point('before_bad_change');
```

### Step 5 - Make bad change

```sql id="83kwst"
INSERT INTO pitr_lab (label) VALUES ('bad data after restore point');

DELETE FROM pitr_lab WHERE label = 'before backup';
```

### Step 6 - Restore to isolated data directory

```text id="k62s5a"
1. stop isolated PostgreSQL instance
2. replace its data directory with base backup copy
3. configure restore_command
4. set recovery_target_name = 'before_bad_change'
5. create recovery.signal
6. start isolated PostgreSQL
7. validate pitr_lab contents
```

Recovery config example:

```conf id="eqms0b"
restore_command = 'cp /tmp/pg-wal-archive/%f %p'
recovery_target_name = 'before_bad_change'
recovery_target_action = 'pause'
```

Expected:

```text id="nuc2cd"
Database recovers to restore point before bad insert/delete.
Validate in isolated environment, not primary.
```

---

## 31. Ringkasan Praktis

```text id="802l44"
1. WAL adalah fondasi crash recovery, replication, dan PITR.
2. Checkpoint memengaruhi write I/O dan crash recovery time.
3. Production backup minimal butuh base backup + continuous WAL archive.
4. pg_basebackup bisa mengambil base backup dari running PostgreSQL cluster.
5. PITR membutuhkan base backup sebelum target dan WAL archive lengkap sampai target.
6. restore_command adalah konfigurasi wajib untuk mengambil archived WAL saat recovery.
7. recovery target bisa timestamp, named restore point, LSN, XID, atau immediate.
8. Backup harus dimonitor, diverifikasi, dan diuji restore.
9. WAL archive failure dan replication slot lag bisa membuat pg_wal penuh.
10. Jangan pernah delete pg_wal manual.
11. RPO/RTO harus jelas dan diuji lewat restore drill.
12. Restore database harus dikoordinasikan dengan app, outbox/inbox, worker, dan external side effect.
```

---

# Status Seri

**Seri 18/22 selesai.**

Rekomendasi lanjut ke:

**Seri 19 - Replication, Read Replica, Logical Replication, dan CDC untuk PostgreSQL OLTP: streaming replication, replication slots, read scaling, failover concern, logical decoding, outbox vs CDC, dan integration pattern dengan Java/Jersey/MyBatis.**

---

**Sources:**

- [25.3. Continuous Archiving and Point-in-Time Recovery ...](https://www.postgresql.org/docs/current/continuous-archiving.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:49:47 PM

# PostgreSQL OLTP - Seri 19/22  
## Replication, Read Replica, Logical Replication, dan CDC: Streaming Replication, Replication Slots, Read Scaling, Failover Concern, Logical Decoding, Outbox vs CDC, dan Integration Pattern dengan Java/Jersey/MyBatis

Seri ini fokus pada **replication dan change data capture** untuk OLTP production. Targetnya bukan hanya “punya replica”, tapi memahami:

```text id="iyh6ct"
1. replication dipakai untuk apa?
2. read replica boleh dipakai untuk query apa?
3. apa risiko stale read?
4. apa beda physical replication vs logical replication?
5. kapan pakai CDC?
6. kapan cukup outbox pattern?
7. bagaimana monitoring replication lag?
8. apa risiko replication slot terhadap pg_wal?
9. bagaimana aplikasi Java/Jersey/MyBatis harus routing read/write?
10. bagaimana failover memengaruhi app, outbox, CDC, dan slot?
```

PostgreSQL mendukung physical/streaming replication dan logical replication secara bersamaan. Streaming replication mengirim WAL record dari primary ke standby saat WAL dihasilkan, sedangkan logical replication mereplikasi perubahan data berdasarkan publication/subscription dan replication identity. ([PostgreSQL](https://www.postgresql.org/docs/current/warm-standby.html))

---

## 1. Mental Model

```text id="zktbuz"
PostgreSQL Replication & CDC
│
├─ Physical / Streaming Replication
│  ├─ WAL-based byte/block-level replication
│  ├─ primary → standby
│  ├─ hot standby read-only queries
│  ├─ read replica
│  ├─ HA/failover base
│  └─ standby delay / replication lag
│
├─ Read Replica Pattern
│  ├─ read-only workload
│  ├─ eventual consistency
│  ├─ stale read risk
│  ├─ query conflict with recovery
│  └─ app-level read routing
│
├─ Logical Replication
│  ├─ publication
│  ├─ subscription
│  ├─ table-level replication
│  ├─ initial snapshot + ongoing changes
│  ├─ replica identity
│  └─ cross-version / selective replication use cases
│
├─ Logical Decoding / CDC
│  ├─ logical replication slot
│  ├─ output plugin
│  ├─ WAL → logical change stream
│  ├─ Debezium-style consumers
│  └─ external integration
│
├─ Replication Slots
│  ├─ retain required WAL
│  ├─ prevent consumer from missing changes
│  ├─ can fill disk if consumer stuck
│  └─ must be monitored/dropped when unused
│
└─ Application Integration
   ├─ write primary
   ├─ read primary when read-your-write needed
   ├─ read replica for tolerant reads
   ├─ outbox for domain events
   ├─ CDC for data movement
   └─ failover-aware datasource
```

Rule utama:

```text id="5zgk2m"
Replication bukan pengganti transaction design.
Read replica bukan pengganti indexing.
CDC bukan pengganti domain event contract.
```

---

## 2. Pattern Decision Table

| Kebutuhan | Pattern | Catatan |
|---|---|---|
| HA standby | Physical streaming replication | Standby bisa dipromote |
| Read scaling | Hot standby read replica | Stale read harus diterima |
| Reporting ringan | Read replica | Jangan ganggu primary |
| Query setelah write harus fresh | Read primary | Hindari stale read |
| Cross-service domain event | Outbox pattern | Intent eksplisit, payload stabil |
| Data lake/search indexing | CDC/logical decoding | Consumer idempotent |
| Table subset replication | Logical replication | Publication/subscription |
| Version upgrade migration | Logical replication sometimes | Perlu runbook detail |
| Consumer tidak boleh kehilangan WAL | Replication slot | Monitor disk retention |
| Disaster recovery | Backup + WAL + standby | Replication saja bukan backup |
| Multi-master write | Bukan built-in simple pattern | Hindari kecuali tooling khusus |

---

# 3. Physical / Streaming Replication

Streaming replication membuat standby lebih up-to-date daripada file-based log shipping karena standby terhubung ke primary dan menerima WAL record saat dihasilkan, tanpa menunggu WAL file penuh. PostgreSQL menyatakan streaming replication asynchronous by default; karena itu ada delay kecil antara commit di primary dan visibility di standby. ([PostgreSQL](https://www.postgresql.org/docs/current/warm-standby.html))

```text id="uhqrjc"
Primary
│
├─ accepts read/write
├─ generates WAL
├─ streams WAL to standby
└─ can also archive WAL
    │
    ▼
Standby
│
├─ receives WAL
├─ replays WAL
├─ can accept read-only queries if hot_standby = on
└─ can be promoted during failover
```

Use case:

```text id="depu6c"
1. HA standby
2. read replica
3. backup source
4. disaster recovery site
5. failover candidate
```

Not a replacement for:

```text id="23a57o"
1. backup/PITR
2. application idempotency
3. domain event design
4. query optimization
5. logical integration contract
```

---

## 4. Minimal Physical Standby Config Concept

Primary settings:

```conf id="gzljvv"
wal_level = replica
max_wal_senders = 10
max_replication_slots = 10
wal_keep_size = '2GB'
```

Access:

```conf id="lm542d"
# pg_hba.conf
host replication repl_user 10.10.10.20/32 scram-sha-256
```

Replication role:

```sql id="ob7df7"
CREATE ROLE repl_user
WITH LOGIN REPLICATION PASSWORD 'change-me';
```

Standby `primary_conninfo` concept:

```conf id="mybrz1"
primary_conninfo = 'host=primary-db port=5432 user=repl_user password=change-me application_name=standby-1'
primary_slot_name = 'standby_1_slot'
```

Create physical slot on primary:

```sql id="in3odn"
SELECT pg_create_physical_replication_slot('standby_1_slot');
```

Important:

```text id="rgzoyk"
Jika streaming replication tanpa WAL archive, primary bisa recycle WAL lama sebelum standby menerimanya.
PostgreSQL menyarankan wal_keep_size cukup besar atau replication slot; WAL archive yang accessible juga bisa membantu standby catch up.
```

Hal tersebut sesuai dokumentasi PostgreSQL tentang streaming replication dan WAL retention. ([PostgreSQL](https://www.postgresql.org/docs/current/warm-standby.html))

---

# 5. Hot Standby / Read Replica

Hot standby memungkinkan standby menerima koneksi dan menjalankan query read-only saat standby berada dalam archive recovery atau standby mode. Semua koneksi semacam itu strictly read-only; bahkan temporary table tidak boleh ditulis. Data standby juga bisa tertinggal dari primary, sehingga query yang sama di primary dan standby hampir bersamaan dapat menghasilkan data berbeda. ([PostgreSQL](https://www.postgresql.org/docs/current/hot-standby.html))

Read replica cocok untuk:

```text id="3mfge7"
1. dashboard read-only yang toleran stale
2. list/search non-critical
3. reporting ringan
4. export job
5. analytics operational kecil
6. read traffic burst yang tidak butuh read-your-write
```

Tidak cocok untuk:

```text id="hwc67u"
1. read setelah submit/create/update yang harus fresh
2. authorization decision yang harus latest
3. idempotency check
4. payment/quota/reservation decision
5. workflow claim
6. command precondition validation
```

Rule:

```text id="s31913"
Write path dan consistency-sensitive read harus ke primary.
Replica read hanya untuk stale-tolerant read.
```

---

## 6. Stale Read Problem

Contoh:

```text id="y0r6nj"
T0: User submit case di primary.
T0+10ms: API redirect ke detail page.
T0+20ms: Detail page baca dari replica.
Replica belum replay WAL commit.
User melihat status masih DRAFT.
```

Solusi praktis:

| Use case | Routing |
|---|---|
| setelah POST/PUT/PATCH/DELETE | read primary for redirect/detail |
| detail critical | primary |
| dashboard count | replica boleh |
| audit timeline setelah update | primary jika fresh required |
| public search/list | replica boleh |
| export | replica boleh |
| command validation | primary |

Application rule:

```text id="0s86be"
Read-your-write requirement harus eksplisit di service/API contract.
```

---

# 7. Java/Jersey/MyBatis Read Routing Pattern

Pisahkan datasource:

```text id="4x2g1v"
primaryDataSource  → write + strong read
replicaDataSource  → stale-tolerant read
```

Service pattern:

```java id="oez0no"
public final class CaseQueryService {
    private final SqlSessionFactory primarySqlSessionFactory;
    private final SqlSessionFactory replicaSqlSessionFactory;

    public CaseDetail getCaseDetail(
            long tenantId,
            UUID caseId,
            ReadConsistency consistency
    ) {
        SqlSessionFactory factory = switch (consistency) {
            case STRONG -> primarySqlSessionFactory;
            case STALE_OK -> replicaSqlSessionFactory;
        };

        try (SqlSession session = factory.openSession(true)) {
            CaseQueryMapper mapper = session.getMapper(CaseQueryMapper.class);
            return mapper.findCaseDetail(tenantId, caseId);
        }
    }
}
```

Enum:

```java id="ivmtc8"
public enum ReadConsistency {
    STRONG,
    STALE_OK
}
```

Jersey resource:

```java id="14xdnj"
@GET
@Path("/cases/{caseId}")
public Response getCase(
        @PathParam("caseId") UUID caseId,
        @QueryParam("consistency") @DefaultValue("STRONG") String consistency
) {
    ReadConsistency readConsistency =
        "STALE_OK".equals(consistency)
            ? ReadConsistency.STALE_OK
            : ReadConsistency.STRONG;

    CaseDetail detail = caseQueryService.getCaseDetail(
        currentTenantId(),
        caseId,
        readConsistency
    );

    return Response.ok(detail).build();
}
```

Practical default:

```text id="8sgozj"
API detail setelah user action → STRONG default.
Background reporting/export → STALE_OK explicit.
```

---

# 8. Read Replica Query Conflict

Hot standby read queries can conflict with recovery. Karena standby harus replay WAL dari primary, query panjang di standby bisa dibatalkan jika menghambat recovery. PostgreSQL memiliki statistics `pg_stat_database_conflicts` untuk melihat database-wide query cancels karena konflik recovery di standby. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html))

Cek standby conflicts:

```sql id="auuppv"
SELECT
    datname,
    confl_tablespace,
    confl_lock,
    confl_snapshot,
    confl_bufferpin,
    confl_deadlock
FROM pg_stat_database_conflicts
ORDER BY datname;
```

Cek recovery state:

```sql id="uagz9a"
SELECT
    pg_is_in_recovery() AS is_standby,
    pg_last_wal_receive_lsn(),
    pg_last_wal_replay_lsn(),
    pg_last_xact_replay_timestamp();
```

Read replica query rule:

```text id="2qpzer"
Jangan jalankan query panjang tanpa batas di replica.
Tetap pakai LIMIT, time range, statement_timeout, dan index.
Replica bukan tempat query liar.
```

---

# 9. Replication Lag Monitoring

Primary view `pg_stat_replication` menampilkan satu row per WAL sender process untuk standby yang terkoneksi langsung; kolomnya termasuk state, sent/write/flush/replay LSN, dan metadata connection. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html))

Primary lag query:

```sql id="2y5m8f"
SELECT
    application_name,
    client_addr,
    state,
    sync_state,
    sent_lsn,
    write_lsn,
    flush_lsn,
    replay_lsn,
    pg_size_pretty(pg_wal_lsn_diff(sent_lsn, replay_lsn)) AS sent_replay_lag_bytes,
    write_lag,
    flush_lag,
    replay_lag
FROM pg_stat_replication
ORDER BY application_name;
```

Standby lag query:

```sql id="06vrh7"
SELECT
    now() AS standby_now,
    pg_is_in_recovery() AS is_standby,
    pg_last_xact_replay_timestamp() AS last_replay_ts,
    now() - pg_last_xact_replay_timestamp() AS replay_delay;
```

Caution:

```text id="h9v03c"
Time-based lag bisa NULL atau misleading jika primary idle.
Byte lag dan replay timestamp sebaiknya dilihat bersama.
```

Alert ideas:

```text id="95e5cg"
1. standby disconnected
2. replay lag bytes terlalu tinggi
3. replay delay terlalu lama
4. replication slot retained WAL terlalu besar
5. read replica serving stale beyond SLA
```

---

# 10. Synchronous vs Asynchronous Replication

Streaming replication asynchronous by default. Dalam synchronous replication, commit dapat menunggu standby tertentu mengonfirmasi WAL sesuai konfigurasi, sehingga durability meningkat tetapi write latency bisa naik dan availability dapat terdampak jika standby bermasalah. PostgreSQL runtime replication settings mengatur sender/standby/subscriber behavior dan logical replication sender juga memakai konsep publisher/subscriber. ([PostgreSQL](https://www.postgresql.org/docs/current/warm-standby.html))

Decision table:

| Mode | Pro | Kontra |
|---|---|---|
| Async | latency rendah, primary tidak menunggu standby | risk data loss saat primary hilang sebelum standby catch up |
| Sync | lebih kuat terhadap data loss | write latency lebih tinggi, primary bisa menunggu standby |
| Quorum sync | kompromi beberapa standby | konfigurasi lebih kompleks |
| Remote async DR | good DR distance | lag lebih besar |

Practical rule:

```text id="35an0j"
Untuk regulatory/financial critical writes, diskusikan RPO dengan bisnis.
Jika RPO harus mendekati nol, synchronous replication atau managed HA design perlu dievaluasi.
```

---

# 11. Replication Slots

Replication slot membuat primary menahan WAL yang dibutuhkan consumer agar consumer tidak kehilangan perubahan. Ini berguna, tapi berbahaya jika consumer mati lama. PostgreSQL logical decoding docs menyatakan replication slots persist across crashes, tidak tahu status consumer, dan akan mencegah removal resource yang dibutuhkan; jika slot tidak lagi diperlukan, slot harus di-drop. ([PostgreSQL](https://www.postgresql.org/docs/current/logicaldecoding-explanation.html))

Cek slots:

```sql id="ghf4gy"
SELECT
    slot_name,
    slot_type,
    database,
    active,
    restart_lsn,
    confirmed_flush_lsn,
    wal_status,
    safe_wal_size,
    pg_size_pretty(
        pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)
    ) AS retained_wal
FROM pg_replication_slots
WHERE restart_lsn IS NOT NULL
ORDER BY pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn) DESC;
```

Risk:

```text id="3x3e02"
inactive slot + high WAL generation
→ pg_wal grows
→ disk fills
→ database write outage risk
```

Operational rule:

```text id="4kqvoy"
Setiap slot harus punya:
1. owner
2. consumer name
3. purpose
4. alert threshold
5. drop/runbook
6. failover behavior
```

Drop unused slot:

```sql id="n7y4hr"
SELECT pg_drop_replication_slot('old_unused_slot');
```

Jangan drop tanpa verifikasi consumer.

---

# 12. Logical Replication

Logical replication memakai publish/subscribe model. Publisher mendefinisikan publication, subscriber membuat subscription. Saat logical replication mulai, PostgreSQL biasanya mengambil snapshot data table di publisher dan menyalinnya ke subscriber; setelah itu perubahan yang terjadi dikirim terus-menerus, dan subscriber menerapkan data dalam urutan yang sama sehingga transactional consistency dijamin untuk publication dalam satu subscription. ([PostgreSQL](https://www.postgresql.org/docs/current/logical-replication.html))

```text id="zgb6it"
Publisher DB
│
├─ CREATE PUBLICATION
├─ table changes
├─ WAL logical stream
└─ replication slot
    │
    ▼
Subscriber DB
│
├─ CREATE SUBSCRIPTION
├─ initial copy
├─ apply worker
└─ target tables updated
```

Use case:

```text id="nwcc3l"
1. replicate subset table
2. migration/upgrade strategy
3. regional read model
4. data consolidation
5. selective integration
6. cross-version movement in controlled runbook
```

Not ideal for:

```text id="v1zrpz"
1. enforcing domain event contract
2. arbitrary schema transformation
3. high-level business semantics
4. multi-master conflict-free writes without extra tooling
```

---

## 13. Publication

A publication is a set of changes generated from one table or a group of tables; each publication exists in one database, and tables can be added to multiple publications. ([PostgreSQL](https://www.postgresql.org/docs/current/logical-replication-publication.html))

Create publication:

```sql id="9jtskp"
CREATE PUBLICATION case_publication
FOR TABLE regulatory_case, case_status_history;
```

Publication for selected operations:

```sql id="mtfroe"
CREATE PUBLICATION case_insert_update_publication
FOR TABLE regulatory_case
WITH (publish = 'insert, update');
```

Publication for all tables:

```sql id="w9q0d9"
CREATE PUBLICATION all_tables_publication
FOR ALL TABLES;
```

Caution:

```text id="jhwurp"
FOR ALL TABLES terlihat mudah, tapi production sering lebih aman explicit table list.
```

---

## 14. Subscription

Create subscription:

```sql id="5fquuq"
CREATE SUBSCRIPTION case_subscription
CONNECTION 'host=publisher-db port=5432 dbname=appdb user=repl_user password=change-me'
PUBLICATION case_publication;
```

Disable subscription:

```sql id="hxu6t0"
ALTER SUBSCRIPTION case_subscription DISABLE;
```

Enable:

```sql id="dntzcd"
ALTER SUBSCRIPTION case_subscription ENABLE;
```

Refresh publication table list:

```sql id="gndy5n"
ALTER SUBSCRIPTION case_subscription REFRESH PUBLICATION;
```

Monitoring subscriber:

```sql id="do80rd"
SELECT
    subid,
    subname,
    pid,
    relid::regclass AS relname,
    received_lsn,
    last_msg_send_time,
    last_msg_receipt_time,
    latest_end_lsn,
    latest_end_time
FROM pg_stat_subscription;
```

PostgreSQL statistics include `pg_stat_subscription` for subscription workers and `pg_stat_subscription_stats` for errors/conflicts. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html))

---

# 15. Replica Identity

Logical replication needs to identify rows, especially for `UPDATE` and `DELETE`. Logical decoding docs note that availability of old row versions for `UPDATE` and `DELETE` depends on configured replica identity. ([PostgreSQL](https://www.postgresql.org/docs/current/logicaldecoding.html))

Default:

```text id="6g288w"
REPLICA IDENTITY DEFAULT
→ primary key used if exists.
```

For table without primary key, `UPDATE`/`DELETE` logical replication is problematic. Better: always have primary key on OLTP tables.

Set replica identity using index:

```sql id="pp2dv3"
ALTER TABLE regulatory_case
REPLICA IDENTITY USING INDEX pk_regulatory_case;
```

Full old row identity:

```sql id="ezlr53"
ALTER TABLE regulatory_case
REPLICA IDENTITY FULL;
```

Caution:

```text id="y5k434"
REPLICA IDENTITY FULL can increase WAL/logical output size.
Use only when needed.
Best OLTP design: every replicated table has stable primary key.
```

---

# 16. Logical Decoding / CDC

Logical decoding provides infrastructure to stream SQL modifications to external consumers for replication, auditing, and other uses. Changes are sent in streams identified by logical replication slots, and output format is determined by output plugin. ([PostgreSQL](https://www.postgresql.org/docs/current/logicaldecoding.html))

```text id="svivc1"
WAL
│
├─ logical decoding slot
├─ output plugin
├─ change stream
└─ external consumer
   ├─ Debezium-like connector
   ├─ search indexer
   ├─ data lake pipeline
   ├─ cache invalidator
   └─ audit pipeline
```

Create logical slot example:

```sql id="5loee5"
SELECT *
FROM pg_create_logical_replication_slot(
    'case_cdc_slot',
    'pgoutput'
);
```

Peek changes depends on plugin/output mode. For SQL-level examples, PostgreSQL also provides logical decoding functions and `pg_recvlogical` for controlling logical decoding slots and streaming data. ([PostgreSQL](https://www.postgresql.org/docs/current/app-pgrecvlogical.html?utm_source=chatgpt.com))

Drop slot when no longer needed:

```sql id="if6rmq"
SELECT pg_drop_replication_slot('case_cdc_slot');
```

Operational warning:

```text id="jzzlxa"
CDC slot yang stuck bisa menahan WAL dan catalog rows.
Monitor retained_wal dan consumer lag.
```

---

# 17. Outbox vs CDC

Ini sering membingungkan.

| Aspect | Outbox | CDC |
|---|---|---|
| Purpose | domain event intent | database change stream |
| Payload | explicit business event | row-level/table-level changes |
| Contract | stable API/event contract | tied to schema/table changes |
| Producer | application transaction | database WAL/logical decoding |
| Consumer | messaging/event bus | connector/pipeline |
| Best for | microservice integration | data lake/search/cache/projection |
| Schema coupling | lower if well-designed | higher |
| Replay | from outbox table | from WAL/slot retention |
| Event semantics | `CASE_APPROVED` | `UPDATE regulatory_case status=APPROVED` |

Rule:

```text id="3oir6n"
Use outbox for business/domain events.
Use CDC for data movement, projections, analytics, and technical synchronization.
```

Example:

```text id="ld0dgv"
Domain event:
CASE_APPROVED {
  caseId,
  decisionId,
  actorId,
  approvedAt,
  version
}

CDC row change:
regulatory_case.status changed UNDER_REVIEW → APPROVED
```

CDC cannot always infer business meaning:

```text id="tk0v0m"
status APPROVED due to:
- manual approval
- auto approval
- migration correction
- replay
- admin override

Outbox event can encode intent.
```

---

# 18. CDC Consumer Idempotency

CDC/outbox consumers are usually at-least-once. Consumer must dedupe.

Dedupe table:

```sql id="bkm7d1"
CREATE TABLE processed_cdc_event (
    consumer_name text NOT NULL,
    source_slot   text NOT NULL,
    message_key   text NOT NULL,
    processed_at  timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_processed_cdc_event
        PRIMARY KEY (consumer_name, source_slot, message_key)
);
```

Insert dedupe:

```sql id="vjj3ce"
INSERT INTO processed_cdc_event (
    consumer_name,
    source_slot,
    message_key
)
VALUES (
    :consumerName,
    :sourceSlot,
    :messageKey
)
ON CONFLICT DO NOTHING
RETURNING consumer_name;
```

If no row returned:

```text id="bokwhq"
duplicate event, skip side effect.
```

Business projection update should be idempotent:

```sql id="pwv7az"
INSERT INTO case_search_projection (
    tenant_id,
    case_id,
    case_number,
    status,
    title,
    updated_at
)
VALUES (
    :tenantId,
    :caseId,
    :caseNumber,
    :status,
    :title,
    :updatedAt
)
ON CONFLICT (tenant_id, case_id)
DO UPDATE
SET case_number = EXCLUDED.case_number,
    status = EXCLUDED.status,
    title = EXCLUDED.title,
    updated_at = GREATEST(case_search_projection.updated_at, EXCLUDED.updated_at)
WHERE case_search_projection.updated_at <= EXCLUDED.updated_at;
```

---

# 19. Read Replica Routing in Jersey/MyBatis

DAO/Mapper should not decide read consistency alone. Service should decide.

```java id="80huge"
public final class ReadRoutingSqlSessionProvider {
    private final SqlSessionFactory primary;
    private final SqlSessionFactory replica;

    public SqlSession open(ReadConsistency consistency) {
        SqlSessionFactory selected = switch (consistency) {
            case STRONG -> primary;
            case STALE_OK -> replica;
        };

        return selected.openSession(true);
    }
}
```

Service:

```java id="7dd05i"
public List<CaseListItem> searchCases(CaseSearchCommand command) {
    ReadConsistency consistency = command.staleOk()
        ? ReadConsistency.STALE_OK
        : ReadConsistency.STRONG;

    try (SqlSession session = sessionProvider.open(consistency)) {
        CaseSearchMapper mapper = session.getMapper(CaseSearchMapper.class);

        return mapper.searchCases(
            command.tenantId(),
            command.status(),
            command.cursor(),
            command.limit()
        );
    }
}
```

Command path always primary:

```java id="s5ph71"
public SubmitCaseResult submit(SubmitCaseCommand command) {
    try (SqlSession session = primarySqlSessionFactory.openSession(false)) {
        ...
        session.commit();
        return result;
    }
}
```

Rule:

```text id="nviz75"
Writes never go to replica.
Consistency-sensitive reads default primary.
Replica must be opt-in by use case.
```

---

# 20. Failover Concerns

Failover is not just database promotion.

```text id="9j5l93"
Failover checklist
│
├─ promote standby
├─ route writes to new primary
├─ prevent old primary split-brain
├─ recreate/validate replication slots
├─ validate read replicas
├─ validate logical subscriptions/CDC
├─ pause/resume workers safely
├─ check outbox publisher duplicate behavior
├─ app pool reconnect
├─ DNS/service discovery update
└─ post-failover consistency checks
```

Application risks:

| Risk | Mitigation |
|---|---|
| old primary still accepts writes | fencing / infrastructure control |
| app keeps stale connection | pool validation/retry/reconnect |
| write fails during promotion | retry idempotent command |
| outbox duplicates after retry | idempotent publish/consumer |
| CDC slot not on new primary | slot failover/sync runbook |
| replica reads stale from old topology | service discovery refresh |
| sequence/cache anomalies | design accepts gaps |

Logical slot failover has its own complexity. PostgreSQL 18 docs describe logical slot synchronization to hot standby with failover-related options and note that replication slots persist and retain required WAL/catalog resources; correct configuration is required if logical replication must resume after failover. ([PostgreSQL](https://www.postgresql.org/docs/current/logicaldecoding-explanation.html))

---

# 21. Replication Lag and Application Policy

Define business policy:

| Lag | App behavior |
|---:|---|
| `< 1s` | replica OK for normal stale-tolerant reads |
| `1-10s` | replica OK for reporting, not fresh UI |
| `> 10s` | route most reads primary or degrade |
| `> 60s` | alert, disable replica routing |
| disconnected | do not route to replica |

Lag guard query on standby:

```sql id="sg6twi"
SELECT
    now() - pg_last_xact_replay_timestamp() AS replay_delay;
```

App health check idea:

```text id="mglb7r"
replica is healthy only if:
1. can connect
2. pg_is_in_recovery() = true
3. replay_delay below threshold
4. optional: latest heartbeat table row fresh enough
```

Heartbeat table:

```sql id="qvdqgl"
CREATE TABLE replication_heartbeat (
    id integer PRIMARY KEY,
    updated_at timestamptz NOT NULL
);

INSERT INTO replication_heartbeat (id, updated_at)
VALUES (1, clock_timestamp())
ON CONFLICT (id)
DO UPDATE SET updated_at = EXCLUDED.updated_at;
```

Primary scheduled update:

```sql id="0ab57u"
UPDATE replication_heartbeat
SET updated_at = clock_timestamp()
WHERE id = 1;
```

Replica check:

```sql id="0cn0zy"
SELECT
    now() - updated_at AS heartbeat_lag
FROM replication_heartbeat
WHERE id = 1;
```

---

# 22. Logical Replication Monitoring

Publisher side:

```sql id="aul7g5"
SELECT
    application_name,
    client_addr,
    state,
    sent_lsn,
    write_lsn,
    flush_lsn,
    replay_lsn,
    pg_size_pretty(pg_wal_lsn_diff(sent_lsn, replay_lsn)) AS lag
FROM pg_stat_replication
ORDER BY application_name;
```

Slot side:

```sql id="9navct"
SELECT
    slot_name,
    slot_type,
    active,
    wal_status,
    safe_wal_size,
    restart_lsn,
    confirmed_flush_lsn,
    pg_size_pretty(
        pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)
    ) AS retained_wal
FROM pg_replication_slots;
```

Subscriber side:

```sql id="mf0cqi"
SELECT
    subname,
    pid,
    received_lsn,
    last_msg_send_time,
    last_msg_receipt_time,
    latest_end_lsn,
    latest_end_time
FROM pg_stat_subscription;
```

Subscription stats/errors:

```sql id="2d1zuj"
SELECT *
FROM pg_stat_subscription_stats;
```

PostgreSQL cumulative statistics docs list `pg_stat_replication`, `pg_stat_wal_receiver`, `pg_stat_subscription`, `pg_stat_replication_slots`, and `pg_stat_subscription_stats` as replication-related monitoring views. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html))

---

# 23. Schema Change and Logical Replication

Logical replication is sensitive to table shape and replica identity. Practical rules:

```text id="78e18i"
1. Add nullable column first.
2. Deploy subscriber schema before publisher sends new data shape.
3. Avoid breaking column type changes without staged migration.
4. Ensure replicated tables have primary keys.
5. Coordinate publication/subscription refresh.
6. Test DDL in staging with realistic replication.
```

Safe-ish expand/contract:

```text id="vqeyq3"
Phase 1: add new nullable column on publisher + subscriber
Phase 2: app writes both old/new
Phase 3: backfill
Phase 4: app reads new
Phase 5: stop old
Phase 6: drop old after subscribers safe
```

Publication refresh:

```sql id="0upvrh"
ALTER SUBSCRIPTION case_subscription REFRESH PUBLICATION;
```

Rule:

```text id="1ow6uz"
Logical replication does not remove the need for schema migration discipline.
```

---

# 24. Security

Replication user should be separate.

Physical replication role:

```sql id="2z5v8c"
CREATE ROLE physical_repl
WITH LOGIN REPLICATION PASSWORD 'change-me';
```

Logical replication role needs enough privileges:

```sql id="cqb3g9"
CREATE ROLE logical_repl
WITH LOGIN REPLICATION PASSWORD 'change-me';

GRANT CONNECT ON DATABASE appdb TO logical_repl;
GRANT USAGE ON SCHEMA app TO logical_repl;
GRANT SELECT ON app.regulatory_case TO logical_repl;
GRANT SELECT ON app.case_status_history TO logical_repl;
```

`pg_hba.conf` example:

```conf id="bx33fi"
host replication physical_repl 10.10.10.20/32 scram-sha-256
host appdb       logical_repl  10.10.10.30/32 scram-sha-256
```

Security checklist:

```text id="yd5uf8"
1. separate replication users
2. least privilege
3. TLS for network if required
4. monitor replication connections
5. rotate credentials
6. do not reuse app_runtime role
```

---

# 25. Replication and Backup: Jangan Disamakan

Replication:

```text id="ma4c4t"
Good for:
- HA
- read scaling
- fast failover
```

Backup/PITR:

```text id="kb8evb"
Good for:
- accidental delete recovery
- corruption recovery
- historical restore
- ransomware/logical damage recovery
```

If user runs bad SQL:

```sql id="54o4si"
DELETE FROM regulatory_case;
```

Physical replica will replicate the delete.

Rule:

```text id="ib9m9a"
Replication replicates mistakes.
Backup/PITR recovers from mistakes.
```

---

# 26. Anti-Pattern

## Anti-pattern 1 - Read-after-write dari replica

```text id="v867pv"
POST /cases → INSERT primary
GET /cases/{id} → read replica
```

User bisa melihat 404 atau old status.

Better:

```text id="4s8dxw"
After write, read primary or return updated state from write command.
```

---

## Anti-pattern 2 - Slot tidak dimonitor

```text id="4qf75p"
CDC connector mati.
Logical slot tetap menahan WAL.
pg_wal penuh.
Database write outage.
```

Monitor retained WAL and active state.

---

## Anti-pattern 3 - CDC sebagai domain event tanpa contract

Bad:

```text id="kxqbho"
Consumer infer CASE_APPROVED from UPDATE status.
```

Better:

```text id="ey3lls"
Use outbox event CASE_APPROVED with explicit payload and version.
Use CDC for moving data/projections.
```

---

## Anti-pattern 4 - Reporting berat di replica tanpa batas

Replica bisa lag, conflict, atau I/O heavy. Query tetap harus indexed, bounded, dan monitored.

---

## Anti-pattern 5 - Logical replication tanpa primary key

UPDATE/DELETE replication becomes painful. Ensure stable primary key and replica identity.

---

## Anti-pattern 6 - Failover tanpa CDC/outbox runbook

After promotion, logical slots/subscriptions/outbox workers may need special handling. Test it.

---

# 27. Production Checklist

| Checklist | Pertanyaan |
|---|---|
| Purpose clear | Replica untuk HA, read scaling, CDC, atau migration? |
| Read policy | Apakah read primary vs replica jelas per use case? |
| Stale read | Apakah API contract mengakui eventual consistency? |
| Lag monitoring | Apakah replay delay/byte lag dimonitor? |
| Slot monitoring | Apakah retained WAL per slot dimonitor? |
| Slot ownership | Apakah setiap slot punya owner/runbook? |
| Read-only safety | Apakah app write tidak mungkin ke replica? |
| Failover tested | Apakah app reconnect dan routing diuji? |
| Outbox/inbox | Apakah event/consumer idempotent saat failover/retry? |
| Logical repl PK | Apakah replicated tables punya PK/replica identity? |
| Schema migration | Apakah publisher/subscriber DDL terkoordinasi? |
| Security | Apakah replication users terpisah dan least privilege? |
| Backup still exists | Apakah backup/PITR tetap tersedia? |
| Replica queries | Apakah read replica query punya timeout/index/LIMIT? |
| CDC lag | Apakah connector lag dan slot WAL retention dimonitor? |

---

# 28. Mini Lab: Logical Replication Concept

> Jalankan di environment non-production dengan dua database/cluster: publisher dan subscriber.

## Step 1 - Publisher table

```sql id="shuusv"
CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL,
    status       text NOT NULL,
    title        text NOT NULL,
    updated_at   timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id)
);
```

## Step 2 - Publisher publication

```sql id="nfpd6r"
CREATE PUBLICATION case_publication
FOR TABLE regulatory_case;
```

## Step 3 - Subscriber table

```sql id="drdrl4"
CREATE TABLE regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL,
    case_number  text NOT NULL,
    status       text NOT NULL,
    title        text NOT NULL,
    updated_at   timestamptz NOT NULL,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id)
);
```

## Step 4 - Subscriber subscription

```sql id="3keayt"
CREATE SUBSCRIPTION case_subscription
CONNECTION 'host=publisher-db port=5432 dbname=appdb user=logical_repl password=change-me'
PUBLICATION case_publication;
```

## Step 5 - Insert on publisher

```sql id="34ojvf"
INSERT INTO regulatory_case (
    tenant_id,
    case_number,
    status,
    title
)
VALUES (
    1001,
    'CASE-2026-0001',
    'DRAFT',
    'Logical replication lab'
)
RETURNING tenant_id, case_id;
```

## Step 6 - Read on subscriber

```sql id="slc5ik"
SELECT *
FROM regulatory_case
WHERE tenant_id = 1001
  AND case_number = 'CASE-2026-0001';
```

Expected:

```text id="5x5k34"
Row appears after initial sync/change replication delay.
```

## Step 7 - Monitor subscription

```sql id="w5ult2"
SELECT
    subname,
    pid,
    received_lsn,
    last_msg_send_time,
    last_msg_receipt_time,
    latest_end_lsn,
    latest_end_time
FROM pg_stat_subscription;
```

---

## 29. Mini Lab: Read Replica Routing Policy

Create enum:

```java id="sfz6co"
public enum ReadConsistency {
    STRONG,
    STALE_OK
}
```

Service method:

```java id="33h979"
public CaseDetail findCase(
        long tenantId,
        UUID caseId,
        ReadConsistency consistency
) {
    SqlSessionFactory factory =
        consistency == ReadConsistency.STRONG
            ? primarySqlSessionFactory
            : replicaSqlSessionFactory;

    try (SqlSession session = factory.openSession(true)) {
        CaseMapper mapper = session.getMapper(CaseMapper.class);
        return mapper.findCase(tenantId, caseId);
    }
}
```

Policy tests:

```text id="7ckld7"
1. after create → STRONG
2. after submit → STRONG
3. dashboard list → STALE_OK
4. export job → STALE_OK
5. command validation → STRONG
```

---

## 30. Ringkasan Praktis

```text id="fq624d"
1. Streaming replication streams WAL from primary to standby and is asynchronous by default.
2. Hot standby/read replica is read-only and eventually consistent with primary.
3. Read-after-write and command validation should read primary.
4. Read replica is useful for stale-tolerant reads, reporting, export, and dashboards.
5. Replication lag must be monitored from primary and standby.
6. Replication slots prevent missing WAL but can fill disk if consumers stop.
7. Logical replication uses publication/subscription and replicates table-level changes.
8. Logical decoding streams changes through logical replication slots and output plugins.
9. Replica identity matters for UPDATE/DELETE in logical replication.
10. Outbox is best for domain events; CDC is best for data movement/projections.
11. Consumers must be idempotent because delivery is usually at-least-once.
12. Failover requires app routing, slot, CDC, outbox, and worker runbook-not just promote standby.
13. Replication replicates mistakes; backup/PITR is still required.
```

---

# Status Seri

**Seri 19/22 selesai.**

Rekomendasi lanjut ke:

**Seri 20 - Security, Role Design, Schema Privilege, Row-Level Security, Auditability, Secret Handling, dan Least-Privilege Pattern untuk PostgreSQL OLTP dengan Java/Jersey/MyBatis.**

---

**Sources:**

- [PostgreSQL: Documentation: 18: 26.2. Log-Shipping Standby Servers](https://www.postgresql.org/docs/current/warm-standby.html)

## Response:
7/15/2026, 8:52:07 PM

Saya lanjut ke **Seri 20/22**. Fokusnya security production: role design, schema privilege, RLS, least privilege, auditability, secret handling, dan mapping pola ini ke Java/Jersey/MyBatis.

# PostgreSQL OLTP - Seri 20/22  
## Security, Role Design, Schema Privilege, Row-Level Security, Auditability, Secret Handling, dan Least-Privilege Pattern untuk Java/Jersey/MyBatis

Seri ini fokus ke **database security yang praktis untuk aplikasi OLTP enterprise**. Tujuannya bukan hanya “aplikasi bisa connect”, tapi:

```text id="opfrsn"
1. role runtime tidak punya privilege berlebihan
2. migration role terpisah dari app role
3. schema ownership jelas
4. object privilege eksplisit
5. tenant boundary tidak hanya bergantung pada Java
6. secret tidak hardcoded
7. audit dan observability cukup untuk incident
8. koneksi terenkripsi jika melewati network tidak trusted
9. SECURITY DEFINER tidak menjadi celah privilege escalation
10. production DBA punya runbook revoke/rotate/lockdown
```

PostgreSQL mengelola permission menggunakan konsep **roles**; role bisa dipakai sebagai user, group, atau keduanya. Setiap koneksi dibuat dengan role tertentu, dan role itu menentukan privilege awal untuk command di koneksi tersebut. ([PostgreSQL](https://www.postgresql.org/docs/current/user-manag.html?utm_source=chatgpt.com))

---

## 1. Mental Model

```text id="9c0und"
PostgreSQL Security Model for OLTP
│
├─ Authentication
│  ├─ pg_hba.conf
│  ├─ SCRAM password
│  ├─ TLS/SSL
│  ├─ client certificate if required
│  └─ network boundary
│
├─ Roles
│  ├─ owner role
│  ├─ migration role
│  ├─ runtime role
│  ├─ readonly role
│  ├─ reporting role
│  ├─ maintenance role
│  └─ break-glass role
│
├─ Privileges
│  ├─ database CONNECT
│  ├─ schema USAGE / CREATE
│  ├─ table SELECT/INSERT/UPDATE/DELETE
│  ├─ sequence USAGE/SELECT/UPDATE
│  ├─ function EXECUTE
│  └─ default privileges
│
├─ Tenant Boundary
│  ├─ tenant_id in every transactional table
│  ├─ tenant-aware FK/unique
│  ├─ app-level filter
│  ├─ optional RLS
│  └─ audit context
│
├─ Execution Safety
│  ├─ search_path
│  ├─ SECURITY DEFINER
│  ├─ SET LOCAL request context
│  ├─ no dynamic SQL fragments from user
│  └─ least privilege
│
└─ Operations
   ├─ secret rotation
   ├─ privilege review
   ├─ connection monitoring
   ├─ failed login monitoring
   ├─ audit trail
   └─ incident lockdown
```

Rule utama:

```text id="x1z6fq"
Aplikasi production tidak boleh connect sebagai owner schema, migration role, superuser, atau DBA role.
```

---

## 2. Practical Role Design

| Role | Login? | Owns objects? | Purpose |
|---|---:|---:|---|
| `app_owner` | no | yes | owner schema/table/function |
| `app_migration` | yes | maybe via owner handoff | run Flyway/Liquibase migrations |
| `app_runtime` | yes | no | Java/Jersey runtime DML |
| `app_readonly` | yes | no | read-only support/reporting ringan |
| `app_worker` | yes | no | background queue/outbox worker |
| `app_maintenance` | yes | no/limited | vacuum/analyze/admin routines |
| `app_observer` | yes | no | monitoring stats only |
| `break_glass_dba` | yes | admin | emergency, audited |

PostgreSQL `CREATE ROLE` membuat role database cluster; role dapat memiliki database objects dan database privileges. `CREATE USER` hanyalah alias untuk `CREATE ROLE` dengan `LOGIN` assumed by default. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createrole.html?utm_source=chatgpt.com))

---

## 3. Baseline Role Setup

```sql id="hccj63"
CREATE ROLE app_owner
    NOLOGIN;

CREATE ROLE app_migration
    LOGIN
    PASSWORD 'replace-with-secret'
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    NOINHERIT;

CREATE ROLE app_runtime
    LOGIN
    PASSWORD 'replace-with-secret'
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    NOINHERIT;

CREATE ROLE app_readonly
    LOGIN
    PASSWORD 'replace-with-secret'
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    NOINHERIT;

CREATE ROLE app_worker
    LOGIN
    PASSWORD 'replace-with-secret'
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    NOINHERIT;
```

Practical notes:

```text id="xxbpyr"
1. app_owner tidak login.
2. app_runtime tidak create/drop/alter object.
3. app_migration hanya dipakai pipeline migration.
4. app_readonly tidak dipakai aplikasi write path.
5. app_worker bisa dipisah jika queue/outbox butuh privilege berbeda.
```

Role attribute seperti `CREATEROLE` dan `SUPERUSER` harus sangat dibatasi; PostgreSQL menjelaskan bahwa superuser melewati semua permission checks, sedangkan `CREATEROLE` memberi kemampuan role management tertentu. ([PostgreSQL](https://www.postgresql.org/docs/current/role-attributes.html?utm_source=chatgpt.com))

---

## 4. Database dan Schema Privilege

Buat schema aplikasi:

```sql id="fubpft"
CREATE SCHEMA app AUTHORIZATION app_owner;
```

Revoke akses default yang terlalu luas:

```sql id="5nq4yq"
REVOKE ALL ON DATABASE appdb FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM PUBLIC;

GRANT CONNECT ON DATABASE appdb TO app_runtime;
GRANT CONNECT ON DATABASE appdb TO app_readonly;
GRANT CONNECT ON DATABASE appdb TO app_worker;
GRANT CONNECT ON DATABASE appdb TO app_migration;

GRANT USAGE ON SCHEMA app TO app_runtime;
GRANT USAGE ON SCHEMA app TO app_readonly;
GRANT USAGE ON SCHEMA app TO app_worker;

GRANT USAGE, CREATE ON SCHEMA app TO app_migration;
```

PostgreSQL punya special role name `PUBLIC` yang berarti semua role; privilege bisa diberikan dengan `GRANT` dan dicabut dengan `REVOKE`, jadi privilege default ke `PUBLIC` perlu direview eksplisit. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-priv.html?utm_source=chatgpt.com))

Rule:

```text id="2h8hmu"
Schema USAGE berarti role boleh resolve object di schema.
Schema CREATE berarti role boleh membuat object di schema.
Runtime app biasanya butuh USAGE, bukan CREATE.
```

---

## 5. Table Privilege: Runtime vs Readonly vs Worker

Runtime role:

```sql id="42r8ki"
GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA app
TO app_runtime;
```

Readonly role:

```sql id="0fwv37"
GRANT SELECT
ON ALL TABLES IN SCHEMA app
TO app_readonly;
```

Worker role bisa lebih spesifik:

```sql id="fdlvx9"
GRANT SELECT, UPDATE
ON app.workflow_job
TO app_worker;

GRANT SELECT, UPDATE
ON app.outbox_event
TO app_worker;

GRANT INSERT
ON app.outbox_publish_audit
TO app_worker;
```

PostgreSQL privilege model mencakup object-level privileges seperti `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REFERENCES`, `TRIGGER`, `USAGE`, dan `EXECUTE`, tergantung jenis object-nya. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-priv.html?utm_source=chatgpt.com))

Practical rule:

```text id="wrvaui"
Jangan otomatis grant DELETE ke app_runtime jika domain memakai soft delete.
Grant privilege sesuai operasi yang benar-benar dilakukan role.
```

---

## 6. Sequence Privilege

Jika table memakai identity/sequence, role runtime perlu privilege sequence yang sesuai.

```sql id="e1h5dz"
GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA app
TO app_runtime;

GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA app
TO app_worker;
```

Untuk future sequences:

```sql id="06nxmd"
ALTER DEFAULT PRIVILEGES
FOR ROLE app_owner
IN SCHEMA app
GRANT USAGE, SELECT ON SEQUENCES TO app_runtime;

ALTER DEFAULT PRIVILEGES
FOR ROLE app_owner
IN SCHEMA app
GRANT USAGE, SELECT ON SEQUENCES TO app_worker;
```

`ALTER DEFAULT PRIVILEGES` hanya memengaruhi object yang dibuat di masa depan, bukan object yang sudah ada. Karena itu migration awal biasanya butuh kombinasi `GRANT ON ALL ...` dan default privileges. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-alterdefaultprivileges.html?utm_source=chatgpt.com))

---

## 7. Function / Procedure Privilege

Revoke default execute dari `PUBLIC` jika fungsi sensitif:

```sql id="4swa2o"
REVOKE ALL ON FUNCTION app.submit_case(bigint, uuid, text, bigint)
FROM PUBLIC;

GRANT EXECUTE ON FUNCTION app.submit_case(bigint, uuid, text, bigint)
TO app_runtime;
```

Untuk semua function existing:

```sql id="pbz895"
GRANT EXECUTE
ON ALL FUNCTIONS IN SCHEMA app
TO app_runtime;
```

Default untuk future functions:

```sql id="2tthpm"
ALTER DEFAULT PRIVILEGES
FOR ROLE app_owner
IN SCHEMA app
GRANT EXECUTE ON FUNCTIONS TO app_runtime;
```

Caution:

```text id="qy6awz"
Jangan grant EXECUTE semua function ke runtime jika ada admin/maintenance/security function di schema yang sama.
Pisahkan schema: app, admin, internal, audit, maintenance.
```

---

## 8. Object Ownership Pattern

Ideal:

```text id="bhvs2y"
app_owner owns tables/functions.
app_migration creates/changes objects through controlled pipeline.
app_runtime only reads/writes allowed objects.
```

Set owner:

```sql id="4xo4kt"
ALTER TABLE app.regulatory_case OWNER TO app_owner;
ALTER TABLE app.case_audit_log OWNER TO app_owner;
ALTER FUNCTION app.submit_case(bigint, uuid, text, bigint) OWNER TO app_owner;
```

Ownership matters because object owner can alter/drop/grant privileges. PostgreSQL `ALTER TABLE` requires object ownership for structural changes; changing owner also has privilege requirements. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-altertable.html?utm_source=chatgpt.com))

Practical migration model:

```text id="ka8d21"
Option A:
- migration connects as app_migration
- app_migration owns created objects
- after creation, ALTER OWNER TO app_owner

Option B:
- migration role can SET ROLE app_owner
- migration runs controlled DDL as app_owner
- app_owner remains NOLOGIN
```

---

## 9. Default Privileges Template

Run as object creator/owner context:

```sql id="dlc29h"
ALTER DEFAULT PRIVILEGES
FOR ROLE app_owner
IN SCHEMA app
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_runtime;

ALTER DEFAULT PRIVILEGES
FOR ROLE app_owner
IN SCHEMA app
GRANT SELECT ON TABLES TO app_readonly;

ALTER DEFAULT PRIVILEGES
FOR ROLE app_owner
IN SCHEMA app
GRANT USAGE, SELECT ON SEQUENCES TO app_runtime;

ALTER DEFAULT PRIVILEGES
FOR ROLE app_owner
IN SCHEMA app
GRANT EXECUTE ON FUNCTIONS TO app_runtime;
```

Important:

```text id="c7ou8r"
Default privileges harus diset untuk role yang membuat object.
Jika migration membuat object sebagai app_migration, tetapi default privileges diset FOR ROLE app_owner, privilege future objects tidak otomatis sesuai.
```

---

# 10. Row-Level Security / RLS

Row-Level Security membatasi row mana yang bisa dikembalikan oleh query atau dimodifikasi oleh data modification commands. Setelah RLS enabled pada table, jika tidak ada policy yang berlaku, default-nya adalah deny access; table owner biasanya bypass RLS kecuali `FORCE ROW LEVEL SECURITY` digunakan. Superuser dan role dengan `BYPASSRLS` juga bypass RLS. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-rowsecurity.html?utm_source=chatgpt.com))

RLS cocok sebagai defense-in-depth untuk multi-tenant OLTP:

```text id="k4hgoq"
Java filter tenant_id tetap wajib.
RLS menambah guardrail jika query lupa tenant_id atau bug mapper terjadi.
```

---

## 11. RLS Basic Pattern dengan `app.tenant_id`

Table:

```sql id="3jfjlq"
CREATE TABLE app.regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL,
    status       text NOT NULL,
    title        text NOT NULL,
    created_at   timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id)
);
```

Enable RLS:

```sql id="afgdvn"
ALTER TABLE app.regulatory_case ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.regulatory_case FORCE ROW LEVEL SECURITY;
```

Policy:

```sql id="579a56"
CREATE POLICY regulatory_case_tenant_isolation
ON app.regulatory_case
USING (
    tenant_id = current_setting('app.tenant_id', true)::bigint
)
WITH CHECK (
    tenant_id = current_setting('app.tenant_id', true)::bigint
);
```

Grant:

```sql id="24ru7x"
GRANT SELECT, INSERT, UPDATE, DELETE
ON app.regulatory_case
TO app_runtime;
```

App transaction must set tenant context:

```sql id="8ylwpf"
SELECT set_config('app.tenant_id', :tenantId::text, true);
```

`USING` controls row visibility/target rows, while `WITH CHECK` controls allowed new/updated rows. PostgreSQL RLS policies can be permissive or restrictive, and multiple policies are combined according to their policy type. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-rowsecurity.html?utm_source=chatgpt.com))

---

## 12. Java/MyBatis RLS Context Bootstrap

Mapper:

```xml id="zlpsp5"
<update id="setTenantContext">
  SELECT set_config('app.tenant_id', #{tenantId}, true)
</update>

<update id="setRequestContext">
  SELECT
      set_config('app.tenant_id', #{tenantId}, true),
      set_config('app.actor_id', #{actorId}, true),
      set_config('app.request_id', #{requestId}, true),
      set_config('app.correlation_id', #{correlationId}, true)
</update>
```

Service:

```java id="ez89pw"
public CaseDetail findCase(long tenantId, UUID caseId, RequestContext ctx) {
    try (SqlSession session = sqlSessionFactory.openSession(false)) {
        DbContextMapper context = session.getMapper(DbContextMapper.class);
        CaseMapper cases = session.getMapper(CaseMapper.class);

        context.setRequestContext(
            String.valueOf(tenantId),
            ctx.actorId(),
            ctx.requestId(),
            ctx.correlationId()
        );

        CaseDetail detail = cases.findById(caseId);

        session.commit();
        return detail;
    }
}
```

Mapper query can still include tenant_id:

```xml id="7sd0w7"
<select id="findById" resultMap="CaseDetailMap">
  SELECT
      tenant_id,
      case_id,
      case_number,
      status,
      title
  FROM app.regulatory_case
  WHERE tenant_id = #{tenantId}
    AND case_id = #{caseId}
</select>
```

Rule:

```text id="kmeza5"
Even with RLS, keep tenant_id in SQL.
Reason:
1. index usage clearer
2. query intent explicit
3. easier debugging
4. RLS is safety net, not excuse for sloppy mapper
```

---

## 13. RLS Failure Modes

| Failure | Symptom | Prevention |
|---|---|---|
| `app.tenant_id` not set | no rows or cast error | transaction bootstrap wajib |
| `SET` not `SET LOCAL` | tenant leaks between pooled requests | use `set_config(..., true)` |
| runtime role owns table | owner bypasses RLS | app_runtime must not own tables |
| forgot `FORCE RLS` | owner bypass in tests | use non-owner runtime role |
| role has `BYPASSRLS` | policy ignored | never grant to app role |
| query without tenant_id | may still work via RLS but inefficient | enforce mapper pattern |
| SECURITY DEFINER bypass surprise | privilege context changed | design carefully |
| partitioned/inherited tables | policy behavior must be tested | integration test |

RLS is powerful, but PostgreSQL explicitly notes that superusers and roles with `BYPASSRLS` always bypass row security; table owners also normally bypass unless forced. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-rowsecurity.html?utm_source=chatgpt.com))

---

# 14. Authentication: SCRAM, `pg_hba.conf`, dan TLS

PostgreSQL supports several password-based authentication methods; `scram-sha-256` is a challenge-response mechanism that prevents password sniffing on untrusted connections, and MD5-encrypted password support is deprecated and will be removed in a future PostgreSQL release. ([PostgreSQL](https://www.postgresql.org/docs/current/auth-password.html?utm_source=chatgpt.com))

`pg_hba.conf` selects authentication based on connection type, database, user, and address. PostgreSQL also supports `hostssl` rules that match TCP/IP connections only when SSL/TLS encryption is used. ([PostgreSQL](https://www.postgresql.org/docs/current/auth-pg-hba-conf.html?utm_source=chatgpt.com))

Example:

```conf id="hwuuos"
# Require TLS and SCRAM for app runtime from Kubernetes subnet
hostssl appdb app_runtime 10.20.0.0/16 scram-sha-256
hostssl appdb app_worker  10.20.0.0/16 scram-sha-256

# Migration only from CI/CD subnet
hostssl appdb app_migration 10.30.10.0/24 scram-sha-256

# Reject broad access explicitly if needed
host    all   all         0.0.0.0/0 reject
```

Avoid `trust` except highly controlled local scenarios; PostgreSQL docs warn that `trust` is seldom reasonable for TCP/IP connections other than localhost. ([PostgreSQL](https://www.postgresql.org/docs/current/auth-trust.html?utm_source=chatgpt.com))

---

## 15. TLS / SSL

PostgreSQL has native support for SSL/TLS to encrypt client/server communication. Server-side SSL must be enabled/configured, and client drivers can require TLS via connection options such as `sslmode`. ([PostgreSQL](https://www.postgresql.org/docs/current/ssl-tcp.html?utm_source=chatgpt.com))

JDBC URL examples:

```text id="zq6gka"
jdbc:postgresql://db-host:5432/appdb?sslmode=require
```

Stronger verification:

```text id="6x6ph3"
jdbc:postgresql://db-host:5432/appdb?sslmode=verify-full&sslrootcert=/etc/db/ca.crt
```

Practical rule:

```text id="qmb9s0"
On-prem atau cloud private network bukan otomatis berarti bebas TLS.
Ikuti security baseline perusahaan: encryption in transit, certificate rotation, dan hostname verification jika diwajibkan.
```

---

# 16. Secret Handling

Jangan:

```properties id="m3ydum"
db.password=super-secret-password
```

di GitHub repo, Docker image, atau plain config.

Recommended sources:

```text id="a5md0v"
1. Kubernetes Secret / external secret operator
2. AWS Secrets Manager / Azure Key Vault / HashiCorp Vault equivalent
3. environment variable injected at runtime
4. short-lived credentials if platform supports
5. rotation runbook
```

Example environment:

```properties id="vzz2uz"
DB_HOST=db-host
DB_PORT=5432
DB_NAME=appdb
DB_USER=app_runtime
DB_PASSWORD=${injected-secret}
```

Hikari config:

```java id="k91qd8"
HikariConfig config = new HikariConfig();
config.setJdbcUrl(System.getenv("DB_JDBC_URL"));
config.setUsername(System.getenv("DB_USER"));
config.setPassword(System.getenv("DB_PASSWORD"));
config.setMaximumPoolSize(10);
```

Secret rotation pattern:

```text id="m4rquw"
1. create new password/credential
2. update secret manager
3. rolling restart app pods
4. verify new connections
5. revoke old password
6. monitor failed logins
```

---

# 17. Runtime Role vs Migration Role

Runtime role must not run DDL:

```sql id="2nzxcv"
REVOKE CREATE ON SCHEMA app FROM app_runtime;
REVOKE ALL ON SCHEMA public FROM app_runtime;
```

Migration role:

```sql id="23z6yr"
GRANT USAGE, CREATE ON SCHEMA app TO app_migration;
```

But do not give migration role broad power forever from runtime pods:

```text id="undsa3"
Migration credential should exist only in CI/CD or migration job,
not in application deployment.
```

Liquibase/Flyway pattern:

```text id="t67kay"
CI/CD migration job:
  connects as app_migration
  runs DDL
  applies grants/default privileges
  exits

Application:
  connects as app_runtime
  DML only
```

---

# 18. Auditability: Who Did What?

PostgreSQL role tells you database account, but application user is usually inside JWT/session, not DB role. Store app actor context explicitly.

Audit context:

```sql id="0l63qc"
SELECT
    set_config('app.actor_id', :actorId, true),
    set_config('app.actor_type', :actorType, true),
    set_config('app.request_id', :requestId, true),
    set_config('app.correlation_id', :correlationId, true),
    set_config('app.endpoint', :endpoint, true);
```

Audit table:

```sql id="6mvy0e"
CREATE TABLE app.case_audit_log (
    tenant_id      bigint NOT NULL,
    audit_id       bigint GENERATED ALWAYS AS IDENTITY,
    case_id        uuid NOT NULL,
    event_type     text NOT NULL,
    actor_id       text,
    actor_type     text,
    db_user_name   text NOT NULL DEFAULT current_user,
    request_id     text,
    correlation_id text,
    endpoint       text,
    occurred_at    timestamptz NOT NULL DEFAULT clock_timestamp(),
    before_state   jsonb,
    after_state    jsonb,
    metadata       jsonb NOT NULL DEFAULT '{}'::jsonb,

    CONSTRAINT pk_case_audit_log
        PRIMARY KEY (tenant_id, audit_id)
);
```

Trigger example:

```sql id="sl0iwn"
CREATE OR REPLACE FUNCTION app.audit_case_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO app.case_audit_log (
        tenant_id,
        case_id,
        event_type,
        actor_id,
        actor_type,
        db_user_name,
        request_id,
        correlation_id,
        endpoint,
        before_state,
        after_state
    )
    VALUES (
        NEW.tenant_id,
        NEW.case_id,
        'CASE_UPDATED',
        current_setting('app.actor_id', true),
        current_setting('app.actor_type', true),
        current_user,
        current_setting('app.request_id', true),
        current_setting('app.correlation_id', true),
        current_setting('app.endpoint', true),
        to_jsonb(OLD),
        to_jsonb(NEW)
    );

    RETURN NEW;
END;
$$;
```

`current_user` is the role used for permission checking, and it can change with `SET ROLE` or inside `SECURITY DEFINER`; `session_user` is normally the role that initiated the connection. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-info.html?utm_source=chatgpt.com))

---

# 19. Append-Only Audit Protection

```sql id="f6gh67"
REVOKE UPDATE, DELETE ON app.case_audit_log FROM app_runtime;
GRANT INSERT, SELECT ON app.case_audit_log TO app_runtime;
```

Optional trigger:

```sql id="sa8lux"
CREATE OR REPLACE FUNCTION app.prevent_audit_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'Audit log is append-only'
        USING ERRCODE = 'P0001',
              DETAIL = 'UPDATE/DELETE is not allowed on audit log';
END;
$$;

CREATE TRIGGER trg_case_audit_log__append_only
BEFORE UPDATE OR DELETE ON app.case_audit_log
FOR EACH ROW
EXECUTE FUNCTION app.prevent_audit_mutation();
```

Correction pattern:

```sql id="nuhmxl"
CREATE TABLE app.audit_correction_log (
    correction_id uuid NOT NULL DEFAULT uuidv7(),
    tenant_id     bigint NOT NULL,
    target_audit_id bigint NOT NULL,
    reason        text NOT NULL,
    corrected_by  text NOT NULL,
    corrected_at  timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_audit_correction_log
        PRIMARY KEY (correction_id)
);
```

Rule:

```text id="9ou06s"
Audit correction should be additive, not silent overwrite.
```

---

# 20. SECURITY DEFINER: Kapan dan Cara Aman

`SECURITY DEFINER` membuat function berjalan dengan privilege owner function, bukan caller. PostgreSQL docs secara eksplisit menyarankan agar `search_path` di-set untuk mengecualikan schema yang bisa ditulis user tidak tepercaya, karena object berbahaya dapat dibuat untuk menutupi object yang ingin dipakai function. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createfunction.html?utm_source=chatgpt.com))

Example controlled function:

```sql id="xq0k41"
CREATE OR REPLACE FUNCTION app.secure_submit_case(
    p_tenant_id bigint,
    p_case_id uuid,
    p_actor_id text,
    p_expected_version bigint
)
RETURNS TABLE (
    tenant_id bigint,
    case_id uuid,
    status text,
    version bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = app, pg_temp
AS $$
BEGIN
    RETURN QUERY
    UPDATE app.regulatory_case c
    SET status = 'SUBMITTED',
        version = c.version + 1,
        updated_by = p_actor_id,
        updated_at = clock_timestamp()
    WHERE c.tenant_id = p_tenant_id
      AND c.case_id = p_case_id
      AND c.status = 'DRAFT'
      AND c.version = p_expected_version
    RETURNING c.tenant_id, c.case_id, c.status, c.version;
END;
$$;

ALTER FUNCTION app.secure_submit_case(bigint, uuid, text, bigint)
OWNER TO app_owner;

REVOKE ALL ON FUNCTION app.secure_submit_case(bigint, uuid, text, bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.secure_submit_case(bigint, uuid, text, bigint) TO app_runtime;
```

Checklist:

```text id="2ouggq"
1. Owner is non-login app_owner.
2. SET search_path explicitly.
3. Function uses schema-qualified objects.
4. No user-provided SQL fragments.
5. EXECUTE revoked from PUBLIC.
6. Input validation explicit.
7. Function small and testable.
```

---

# 21. SQL Injection Prevention with MyBatis

Safe:

```xml id="vg1ahv"
<select id="findByCaseNumber" resultMap="CaseDetailMap">
  SELECT
      tenant_id,
      case_id,
      case_number,
      status,
      title
  FROM app.regulatory_case
  WHERE tenant_id = #{tenantId}
    AND case_number = #{caseNumber}
</select>
```

Dangerous:

```xml id="rw54du"
<select id="searchBad" resultMap="CaseDetailMap">
  SELECT *
  FROM app.regulatory_case
  WHERE ${whereClause}
</select>
```

Safe sort whitelist:

```xml id="l3ps8y"
<choose>
  <when test="sort == 'CREATED_AT_DESC'">
    ORDER BY created_at DESC, case_id DESC
  </when>
  <when test="sort == 'CASE_NUMBER_ASC'">
    ORDER BY case_number ASC, case_id ASC
  </when>
  <otherwise>
    ORDER BY created_at DESC, case_id DESC
  </otherwise>
</choose>
```

Rule:

```text id="19vfwn"
Use #{...} for values.
Use whitelist for identifiers and SQL fragments.
Never pass raw user SQL to ${...}.
```

---

# 22. Column-Level Privilege and Sensitive Data

Jika table memiliki sensitive column:

```sql id="6ty422"
CREATE TABLE app.customer_profile (
    tenant_id     bigint NOT NULL,
    customer_id   uuid NOT NULL DEFAULT uuidv7(),
    full_name     text NOT NULL,
    email         text NOT NULL,
    national_id   text,
    phone_number  text,
    created_at    timestamptz NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT pk_customer_profile
        PRIMARY KEY (tenant_id, customer_id)
);
```

Expose safe view:

```sql id="a35z8c"
CREATE VIEW app.customer_profile_safe AS
SELECT
    tenant_id,
    customer_id,
    full_name,
    email,
    created_at
FROM app.customer_profile;
```

Grant readonly only on view:

```sql id="jrg538"
REVOKE ALL ON app.customer_profile FROM app_readonly;

GRANT SELECT
ON app.customer_profile_safe
TO app_readonly;
```

Alternative column-level grant:

```sql id="6q4vpk"
GRANT SELECT (
    tenant_id,
    customer_id,
    full_name,
    email,
    created_at
)
ON app.customer_profile
TO app_readonly;
```

Practical rule:

```text id="geykoi"
For sensitive data, prefer explicit projection view/API DTO.
Do not rely on SELECT * anywhere.
```

---

# 23. Readonly Reporting Role

```sql id="cp86ei"
CREATE ROLE app_reporting
    LOGIN
    PASSWORD 'replace-with-secret'
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE;

GRANT CONNECT ON DATABASE appdb TO app_reporting;
GRANT USAGE ON SCHEMA app TO app_reporting;

GRANT SELECT ON app.customer_profile_safe TO app_reporting;
GRANT SELECT ON app.case_timeline_view TO app_reporting;
```

Add timeout defaults:

```sql id="h2c5x7"
ALTER ROLE app_reporting SET statement_timeout = '30s';
ALTER ROLE app_reporting SET idle_in_transaction_session_timeout = '10s';
ALTER ROLE app_reporting SET default_transaction_read_only = on;
```

Practical rule:

```text id="nn57pp"
Reporting role should be read-only and preferably routed to replica.
Do not use app_runtime for BI/reporting tools.
```

---

# 24. Monitoring Security-Relevant State

Roles:

```sql id="yc8cem"
SELECT
    rolname,
    rolsuper,
    rolinherit,
    rolcreaterole,
    rolcreatedb,
    rolcanlogin,
    rolreplication,
    rolbypassrls
FROM pg_roles
ORDER BY rolname;
```

Grants on tables:

```sql id="xef6ox"
SELECT
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'app'
ORDER BY grantee, table_name, privilege_type;
```

RLS-enabled tables:

```sql id="2uxqky"
SELECT
    schemaname,
    tablename,
    rowsecurity,
    forcerowsecurity
FROM pg_tables
WHERE schemaname = 'app'
ORDER BY tablename;
```

Policies:

```sql id="23l5to"
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'app'
ORDER BY tablename, policyname;
```

`pg_hba_file_rules` provides a summary of `pg_hba.conf` contents with parse/applicability annotations, useful for auditing authentication rules. ([PostgreSQL](https://www.postgresql.org/docs/current/view-pg-hba-file-rules.html?utm_source=chatgpt.com))

```sql id="wvvvcq"
SELECT
    line_number,
    type,
    database,
    user_name,
    address,
    auth_method,
    error
FROM pg_hba_file_rules
ORDER BY line_number;
```

---

# 25. Predefined Roles: Gunakan Hati-Hati

PostgreSQL provides predefined roles for commonly needed privileged capabilities, such as reading stats or signaling backend processes. These should be granted intentionally, not casually. ([PostgreSQL](https://www.postgresql.org/docs/current/predefined-roles.html?utm_source=chatgpt.com))

Examples:

```sql id="s3egx5"
GRANT pg_read_all_stats TO app_observer;
```

Maybe for operations role:

```sql id="ybwfzp"
GRANT pg_signal_backend TO app_maintenance;
```

Caution:

```text id="k9r6am"
pg_signal_backend allows cancel/terminate-like operational capability.
Grant only to trusted operational role, not app runtime.
```

---

# 26. Incident Lockdown Playbook

If application credential leaked:

```text id="jwtj80"
1. revoke/rotate credential immediately
2. disable old login or change password
3. kill existing sessions for that role
4. review audit logs and pg_stat_activity
5. rotate dependent secrets
6. redeploy apps
7. check privilege scope and data access
```

SQL:

```sql id="29o2ig"
ALTER ROLE app_runtime NOLOGIN;
```

Terminate sessions:

```sql id="b2a8rm"
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE usename = 'app_runtime';
```

Rotate password:

```sql id="nqoobs"
ALTER ROLE app_runtime LOGIN PASSWORD 'new-rotated-secret';
```

Re-enable:

```sql id="29h5h0"
ALTER ROLE app_runtime LOGIN;
```

Practical rule:

```text id="h77i69"
Credential rotation must be tested before incident.
Otherwise lockdown can become outage.
```

---

# 27. Java/Jersey Security Integration

Request flow:

```text id="w9afj7"
Jersey filter
│
├─ authenticate JWT/session
├─ extract tenant_id, actor_id, roles
├─ authorize endpoint/action
├─ create RequestContext
└─ service opens DB transaction
   ├─ SET LOCAL app.tenant_id
   ├─ SET LOCAL app.actor_id
   ├─ SET LOCAL app.request_id
   ├─ execute mapper SQL
   └─ commit/rollback
```

Example request context:

```java id="on89ja"
public record RequestContext(
    long tenantId,
    String actorId,
    String actorType,
    String requestId,
    String correlationId,
    Set<String> permissions
) {}
```

Transaction bootstrap:

```java id="ab9gw3"
public void setDbContext(SqlSession session, RequestContext ctx, String endpoint) {
    DbContextMapper db = session.getMapper(DbContextMapper.class);
    db.setRequestContext(
        String.valueOf(ctx.tenantId()),
        ctx.actorId(),
        ctx.actorType(),
        ctx.requestId(),
        ctx.correlationId(),
        endpoint
    );
}
```

Rule:

```text id="q2dvk3"
Authorization remains in Java/service layer.
RLS/DB privilege is defense-in-depth, not replacement for app authorization.
```

---

# 28. Recommended Production Baseline

```sql id="drhgwc"
-- 1. No public access
REVOKE ALL ON DATABASE appdb FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- 2. Schema
CREATE SCHEMA IF NOT EXISTS app AUTHORIZATION app_owner;

-- 3. Runtime grants
GRANT CONNECT ON DATABASE appdb TO app_runtime;
GRANT USAGE ON SCHEMA app TO app_runtime;

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA app TO app_runtime;

GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA app TO app_runtime;

-- 4. Readonly grants
GRANT CONNECT ON DATABASE appdb TO app_readonly;
GRANT USAGE ON SCHEMA app TO app_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA app TO app_readonly;

-- 5. Runtime safety
ALTER ROLE app_runtime SET statement_timeout = '5s';
ALTER ROLE app_runtime SET lock_timeout = '500ms';
ALTER ROLE app_runtime SET idle_in_transaction_session_timeout = '10s';
ALTER ROLE app_runtime SET search_path = app, pg_temp;

-- 6. Future grants, run as object creator/owner context
ALTER DEFAULT PRIVILEGES
FOR ROLE app_owner
IN SCHEMA app
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_runtime;

ALTER DEFAULT PRIVILEGES
FOR ROLE app_owner
IN SCHEMA app
GRANT USAGE, SELECT ON SEQUENCES TO app_runtime;
```

Adjust:

```text id="n5z4hn"
Do not copy blindly.
Review DELETE, TRUNCATE, EXECUTE, CREATE, and schema grants by actual use case.
```

---

# 29. Anti-Pattern

## Anti-pattern 1 - App connects as superuser

```text id="bu3lxi"
app uses postgres user
```

Risiko:

```text id="x6r9wv"
bug SQL bisa drop schema
SQL injection jadi catastrophic
RLS bypass
privilege separation hilang
```

---

## Anti-pattern 2 - Runtime role owns tables

Jika runtime role owner table, banyak permission guardrail melemah, dan RLS bisa bypass kecuali forced.

Better:

```text id="ckmwkn"
app_owner owns object.
app_runtime only gets explicit grants.
```

---

## Anti-pattern 3 - Grant all on schema/table forever

```sql id="ohmjv3"
GRANT ALL ON SCHEMA app TO app_runtime;
GRANT ALL ON ALL TABLES IN SCHEMA app TO app_runtime;
```

Masalah:

```text id="9d0imh"
CREATE/TRUNCATE/TRIGGER/REFERENCES/privilege lain bisa terlalu luas.
```

Grant only what is needed.

---

## Anti-pattern 4 - RLS tanpa testing

RLS can cause:

```text id="7xrnfc"
1. no rows returned
2. insert rejected by WITH CHECK
3. query plan changes
4. test passes as owner but fails as runtime
```

Always test as `app_runtime`.

---

## Anti-pattern 5 - SECURITY DEFINER tanpa `search_path`

PostgreSQL specifically warns to set `search_path` safely for `SECURITY DEFINER` functions to avoid object masking by untrusted schemas. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createfunction.html?utm_source=chatgpt.com))

---

## Anti-pattern 6 - Secret in GitHub / Docker image

Credentials must come from secret manager/runtime injection, not source code or image layers.

---

## Anti-pattern 7 - Reporting tools use app_runtime

Reporting should use readonly/reporting role, usually with statement timeout and ideally replica routing.

---

# 30. Production Checklist

| Checklist | Pertanyaan |
|---|---|
| No superuser app | Apakah aplikasi tidak connect sebagai `postgres`/superuser? |
| Owner separated | Apakah object owner role `NOLOGIN`? |
| Migration separated | Apakah migration credential tidak ada di runtime app? |
| Runtime least privilege | Apakah app_runtime hanya punya privilege yang diperlukan? |
| Public revoked | Apakah unnecessary `PUBLIC` privileges dicabut? |
| Schema grants | Apakah runtime hanya `USAGE`, bukan `CREATE`? |
| Default privileges | Apakah future object grants benar untuk role creator? |
| Sequence grants | Apakah identity/sequence grants cukup tapi tidak berlebihan? |
| Function grants | Apakah sensitive function `EXECUTE` tidak terbuka ke `PUBLIC`? |
| RLS tested | Apakah RLS dites sebagai non-owner runtime role? |
| Tenant context | Apakah `SET LOCAL app.tenant_id` wajib di transaction bootstrap? |
| TLS/auth | Apakah `pg_hba.conf` memakai SCRAM/TLS sesuai baseline? |
| Secret rotation | Apakah credential rotation sudah diuji? |
| SECURITY DEFINER | Apakah `search_path` aman dan EXECUTE terbatas? |
| Audit context | Apakah actor/request/correlation tersimpan? |
| Readonly/reporting | Apakah reporting pakai role terpisah? |
| Monitoring | Apakah roles/grants/RLS/policies direview berkala? |
| Incident lockdown | Apakah ada runbook disable/rotate/terminate sessions? |

---

# 31. Mini Lab

## Step 1 - Create roles and schema

```sql id="4w4q2u"
CREATE ROLE app_owner NOLOGIN;

CREATE ROLE app_runtime
    LOGIN PASSWORD 'runtime-secret'
    NOSUPERUSER NOCREATEDB NOCREATEROLE;

CREATE ROLE app_readonly
    LOGIN PASSWORD 'readonly-secret'
    NOSUPERUSER NOCREATEDB NOCREATEROLE;

CREATE SCHEMA app AUTHORIZATION app_owner;
```

## Step 2 - Create table as owner

```sql id="hfqp3d"
CREATE TABLE app.regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL,
    status       text NOT NULL,
    title        text NOT NULL,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id)
);

ALTER TABLE app.regulatory_case OWNER TO app_owner;
```

## Step 3 - Grant runtime

```sql id="oj6jlz"
REVOKE ALL ON SCHEMA public FROM PUBLIC;

GRANT CONNECT ON DATABASE appdb TO app_runtime;
GRANT USAGE ON SCHEMA app TO app_runtime;

GRANT SELECT, INSERT, UPDATE, DELETE
ON app.regulatory_case
TO app_runtime;

GRANT CONNECT ON DATABASE appdb TO app_readonly;
GRANT USAGE ON SCHEMA app TO app_readonly;

GRANT SELECT
ON app.regulatory_case
TO app_readonly;
```

## Step 4 - Enable RLS

```sql id="0hhxx5"
ALTER TABLE app.regulatory_case ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.regulatory_case FORCE ROW LEVEL SECURITY;

CREATE POLICY regulatory_case_tenant_policy
ON app.regulatory_case
USING (
    tenant_id = current_setting('app.tenant_id', true)::bigint
)
WITH CHECK (
    tenant_id = current_setting('app.tenant_id', true)::bigint
);
```

## Step 5 - Test as runtime

```sql id="z1kw3l"
SET ROLE app_runtime;

BEGIN;

SELECT set_config('app.tenant_id', '1001', true);

INSERT INTO app.regulatory_case (
    tenant_id,
    case_number,
    status,
    title
)
VALUES (
    1001,
    'CASE-2026-0001',
    'DRAFT',
    'RLS lab case'
);

SELECT *
FROM app.regulatory_case;

COMMIT;

RESET ROLE;
```

Expected:

```text id="rfhlpj"
Insert tenant 1001 berhasil.
Select melihat tenant 1001.
```

## Step 6 - Test cross-tenant blocked

```sql id="806jr7"
SET ROLE app_runtime;

BEGIN;

SELECT set_config('app.tenant_id', '1001', true);

INSERT INTO app.regulatory_case (
    tenant_id,
    case_number,
    status,
    title
)
VALUES (
    2002,
    'CASE-2026-0002',
    'DRAFT',
    'Should fail due to RLS WITH CHECK'
);

ROLLBACK;

RESET ROLE;
```

Expected:

```text id="ogc8i2"
INSERT ditolak karena WITH CHECK policy tidak terpenuhi.
```

---

## 32. Ringkasan Praktis

```text id="9kdfsc"
1. PostgreSQL security dimulai dari role design yang benar.
2. App runtime tidak boleh superuser, owner object, atau migration role.
3. Revoke unnecessary PUBLIC access.
4. Runtime biasanya butuh CONNECT, schema USAGE, dan object-level DML grants.
5. Migration role dan runtime role harus dipisah.
6. Default privileges penting untuk future tables/sequences/functions.
7. RLS bagus sebagai defense-in-depth multi-tenant, tetapi app tetap wajib filter tenant_id.
8. RLS harus dites sebagai non-owner runtime role, bukan sebagai table owner.
9. SECURITY DEFINER harus punya search_path aman dan EXECUTE terbatas.
10. SCRAM, pg_hba.conf, TLS, dan secret rotation adalah bagian dari security baseline.
11. Audit harus menyimpan actor_id, request_id, correlation_id, db user, dan before/after jika perlu.
12. Least privilege harus dimonitor dan direview berkala, bukan sekali setup lalu dilupakan.
```

---

# Status Seri

**Seri 20/22 selesai.**

Rekomendasi lanjut ke:

**Seri 21 - Schema Migration Safety untuk PostgreSQL OLTP: Liquibase/Flyway, expand-contract, zero/low-downtime DDL, backfill, constraint validation, index concurrently, dan rollback-forward strategy.**

---

**Sources:**

- [Documentation: 18: Chapter 21. Database Roles](https://www.postgresql.org/docs/current/user-manag.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:54:52 PM

# PostgreSQL OLTP - Seri 21/22  
## Schema Migration Safety: Liquibase/Flyway, Expand-Contract, Zero/Low-Downtime DDL, Backfill, Constraint Validation, Index Concurrently, dan Rollback-Forward Strategy

Seri ini fokus ke **cara mengubah schema PostgreSQL tanpa merusak production OLTP**. Masalah migration biasanya bukan hanya SQL-nya benar atau salah, tapi:

```text id="2dezi2"
1. apakah DDL mengunci table terlalu lama?
2. apakah app versi lama dan app versi baru bisa hidup bersamaan saat rolling deployment?
3. apakah data lama valid untuk constraint baru?
4. apakah index besar dibuat tanpa memblok write?
5. apakah backfill dilakukan chunked?
6. apakah rollback realistis?
7. apakah Flyway/Liquibase checksum/history konsisten?
8. apakah migration bisa diulang aman di staging/production?
9. apakah perubahan schema kompatibel dengan MyBatis mapper?
10. apakah ada observability saat migration berjalan?
```

PostgreSQL `ALTER TABLE` adalah tool utama untuk perubahan schema, tetapi lock, table scan, dan validation behavior harus dipahami. PostgreSQL mendokumentasikan opsi seperti `NOT VALID` dan `VALIDATE CONSTRAINT`, serta berbagai subcommand `ALTER TABLE` yang memiliki implikasi locking berbeda. ([postgresql.org](https://www.postgresql.org/docs/current/sql-altertable.html))

---

## 1. Mental Model

```text id="wqaqg2"
Safe Schema Migration
│
├─ Migration tool
│  ├─ Flyway
│  ├─ Liquibase
│  ├─ versioned migration
│  ├─ repeatable migration
│  ├─ checksum/history
│  └─ CI/CD gate
│
├─ Compatibility strategy
│  ├─ expand
│  ├─ dual-read / dual-write
│  ├─ backfill
│  ├─ validate
│  ├─ switch reads
│  └─ contract
│
├─ PostgreSQL DDL safety
│  ├─ ADD COLUMN nullable
│  ├─ ADD CONSTRAINT NOT VALID
│  ├─ VALIDATE CONSTRAINT
│  ├─ CREATE INDEX CONCURRENTLY
│  ├─ DROP INDEX CONCURRENTLY
│  ├─ avoid table rewrite
│  └─ lock_timeout / statement_timeout
│
├─ Data migration
│  ├─ chunked backfill
│  ├─ idempotent update
│  ├─ progress table
│  ├─ retryable worker
│  └─ verification query
│
├─ App compatibility
│  ├─ old app works with new schema
│  ├─ new app works before backfill complete
│  ├─ MyBatis mapper not broken
│  ├─ feature flag
│  └─ rollback-forward
│
└─ Operations
   ├─ dry run
   ├─ migration window
   ├─ monitoring locks
   ├─ incident stop condition
   ├─ post-migration validation
   └─ cleanup
```

Rule utama:

```text id="m7crlg"
Production migration aman bukan satu langkah besar.
Gunakan expand → backfill → validate → switch → contract.
```

---

## 2. Tooling: Flyway vs Liquibase

| Area | Flyway | Liquibase |
|---|---|---|
| Mental model | versioned SQL migrations | changelog + changeset |
| File umum | `V1__init.sql`, `R__view.sql` | XML/YAML/JSON/SQL changelog |
| Repeatable object | repeatable migration | `runOnChange`, `runAlways` |
| Checksums | schema history table | DATABASECHANGELOG |
| Native SQL style | sangat natural | bisa pakai formatted SQL atau change types |
| Rollback | undo migration available in paid/teams variants; banyak tim pakai forward fix | rollback block tersedia tapi tetap harus diuji |
| Precondition/context | lebih sederhana | kuat: preconditions, contexts, labels |
| Best fit | SQL-first teams | policy-rich enterprise workflow |

Flyway mendefinisikan migration sebagai versioned, repeatable, atau baseline; repeatable migration dijalankan setelah versioned migration yang pending dan harus dibuat idempotent, biasanya dengan `CREATE OR REPLACE`. ([documentation.red-gate.com](https://documentation.red-gate.com/fd/migrations-271585107.html)) Liquibase menggunakan changelog berisi ordered changesets; changeset tidak dijalankan ulang setelah berhasil kecuali memakai opsi seperti `runAlways` atau `runOnChange`, dan changeset default-nya berjalan dalam satu transaction jika database mendukung. ([docs.liquibase.com](https://docs.liquibase.com/secure/user-guide-5-2-1/what-is-a-changeset))

---

## 3. Migration Repository Structure

### Flyway

```text id="9kvb0n"
src/main/resources/db/migration/
├─ V001__create_core_tables.sql
├─ V002__add_case_priority.sql
├─ V003__create_case_priority_index.sql
├─ V004__backfill_case_priority.sql
├─ V005__validate_case_priority.sql
└─ R__case_timeline_view.sql
```

### Liquibase

```text id="75mgdn"
src/main/resources/db/changelog/
├─ db.changelog-master.yaml
├─ 001-create-core-tables.yaml
├─ 002-add-case-priority.yaml
├─ 003-create-case-priority-index.yaml
├─ 004-backfill-case-priority.yaml
├─ 005-validate-case-priority.yaml
└─ repeatable-case-timeline-view.sql
```

Practical rule:

```text id="sae905"
Migration file harus kecil, terurut, reviewable, dan punya purpose tunggal.
Jangan satu migration berisi 50 unrelated changes.
```

---

# 4. Expand-Contract Pattern

## 4.1 Expand

Tambah schema yang kompatibel dengan app lama.

```sql id="lm76sg"
ALTER TABLE app.regulatory_case
ADD COLUMN priority text;
```

App lama masih bisa jalan karena kolom baru nullable dan tidak dibaca.

## 4.2 Dual-write / app support

App baru mulai mengisi `priority`.

```sql id="e2i9c1"
INSERT INTO app.regulatory_case (
    tenant_id,
    case_id,
    case_number,
    status,
    title,
    priority
)
VALUES (
    :tenantId,
    :caseId,
    :caseNumber,
    'DRAFT',
    :title,
    COALESCE(:priority, 'NORMAL')
);
```

## 4.3 Backfill

Isi data lama secara chunked.

```sql id="mzz56b"
UPDATE app.regulatory_case
SET priority = 'NORMAL'
WHERE priority IS NULL
  AND ctid IN (
      SELECT ctid
      FROM app.regulatory_case
      WHERE priority IS NULL
      LIMIT 5000
  );
```

## 4.4 Validate

```sql id="36o28b"
SELECT count(*)
FROM app.regulatory_case
WHERE priority IS NULL;
```

## 4.5 Add constraints safely

```sql id="0qiw9k"
ALTER TABLE app.regulatory_case
ADD CONSTRAINT chk_regulatory_case__priority
CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT'))
NOT VALID;

ALTER TABLE app.regulatory_case
VALIDATE CONSTRAINT chk_regulatory_case__priority;
```

## 4.6 Contract

Set stricter schema after all app versions compatible.

```sql id="oy6z08"
ALTER TABLE app.regulatory_case
ALTER COLUMN priority SET NOT NULL;
```

Contract phase bisa dilakukan di release terpisah.

---

## 5. Compatibility Timeline

```text id="a6guv1"
Release N
│
├─ migration expand:
│  └─ add nullable priority
│
├─ deploy app N:
│  ├─ writes priority for new rows
│  └─ still tolerates null old rows
│
├─ background backfill:
│  └─ old rows priority = NORMAL
│
├─ migration validate:
│  ├─ add CHECK NOT VALID
│  ├─ validate constraint
│  └─ verify null count = 0
│
├─ deploy app N+1:
│  └─ assumes priority available
│
└─ migration contract:
   └─ SET NOT NULL / drop old column / drop old behavior
```

Rule:

```text id="blalxk"
Rolling deployment means old app and new app overlap.
Schema migration must support both during transition.
```

---

# 6. Adding Column Safely

## 6.1 Safe: nullable column

```sql id="mx1s75"
ALTER TABLE app.regulatory_case
ADD COLUMN priority text;
```

## 6.2 Usually okay: default constant on modern PostgreSQL

PostgreSQL current docs note that adding a column with a constant default no longer rewrites each row at `ALTER TABLE` time; the default is returned when row is accessed and applied as rows are updated. However, volatile defaults like `clock_timestamp()` require updating each row and can lock/rewrite more heavily. ([postgresql.org](https://www.postgresql.org/docs/current/ddl-alter.html))

```sql id="my62yg"
ALTER TABLE app.regulatory_case
ADD COLUMN priority text DEFAULT 'NORMAL';
```

Still, practical enterprise pattern often prefers:

```sql id="dkwucx"
ALTER TABLE app.regulatory_case
ADD COLUMN priority text;

ALTER TABLE app.regulatory_case
ALTER COLUMN priority SET DEFAULT 'NORMAL';
```

Then backfill old rows chunked.

## 6.3 Dangerous: add `NOT NULL` immediately on big table

```sql id="gtjioy"
ALTER TABLE app.regulatory_case
ADD COLUMN priority text NOT NULL DEFAULT 'NORMAL';
```

Could be okay in some versions/cases, but production review should ask:

```text id="v4luiu"
1. PostgreSQL version?
2. default constant or volatile?
3. table size?
4. lock duration?
5. old app compatibility?
6. rollback plan?
```

---

# 7. Adding Constraints Safely

PostgreSQL allows foreign key and check constraints to be added with `NOT VALID`, meaning existing rows are not scanned immediately; new rows must still satisfy the constraint, and later `VALIDATE CONSTRAINT` checks existing data. ([postgresql.org](https://www.postgresql.org/docs/current/sql-altertable.html))

## 7.1 Check constraint

```sql id="r7n3op"
ALTER TABLE app.regulatory_case
ADD CONSTRAINT chk_regulatory_case__priority
CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT'))
NOT VALID;
```

Validate later:

```sql id="9hjibj"
ALTER TABLE app.regulatory_case
VALIDATE CONSTRAINT chk_regulatory_case__priority;
```

## 7.2 Foreign key

```sql id="724fx8"
ALTER TABLE app.case_party
ADD CONSTRAINT fk_case_party__case
FOREIGN KEY (tenant_id, case_id)
REFERENCES app.regulatory_case (tenant_id, case_id)
NOT VALID;
```

Validate later:

```sql id="2e82ub"
ALTER TABLE app.case_party
VALIDATE CONSTRAINT fk_case_party__case;
```

## 7.3 Validation checklist

```text id="4tptas"
Before VALIDATE:
1. run query to find invalid rows
2. fix invalid rows
3. set lock_timeout
4. run during lower traffic if large
5. monitor pg_stat_activity and locks
```

---

# 8. `SET NOT NULL` Safely

Adding `NOT NULL` can require validation. PostgreSQL current `ALTER TABLE` docs mention `SET NOT NULL` validates if there is an invalid not-null constraint; newer PostgreSQL versions also have mechanisms around not-null constraints, but safest operational pattern remains: prove data first, then contract. ([postgresql.org](https://www.postgresql.org/docs/current/sql-altertable.html))

Validation query:

```sql id="4kbi56"
SELECT count(*)
FROM app.regulatory_case
WHERE priority IS NULL;
```

If zero:

```sql id="680ryu"
ALTER TABLE app.regulatory_case
ALTER COLUMN priority SET NOT NULL;
```

Safer phased pattern:

```text id="w8dqsb"
1. add nullable column
2. app writes non-null
3. backfill old nulls
4. verify null count = 0
5. add NOT NULL during controlled window
```

---

# 9. Create Index Safely

## 9.1 Normal create index

```sql id="2jq338"
CREATE INDEX idx_regulatory_case__priority
ON app.regulatory_case (tenant_id, priority, created_at DESC);
```

This can block writes depending context and table size.

## 9.2 Concurrent index

PostgreSQL `CREATE INDEX CONCURRENTLY` builds the index without locking out concurrent inserts, updates, and deletes, though it takes longer and has caveats; it cannot run inside a transaction block. ([postgresql.org](https://www.postgresql.org/docs/current/sql-createindex.html))

```sql id="pa4ecf"
CREATE INDEX CONCURRENTLY idx_regulatory_case__priority
ON app.regulatory_case (
    tenant_id,
    priority,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

Important:

```text id="si9dnp"
CREATE INDEX CONCURRENTLY cannot run inside transaction block.
Migration tools often wrap migrations in transactions by default.
Configure migration file/changeset accordingly.
```

---

## 10. Flyway + `CREATE INDEX CONCURRENTLY`

Flyway SQL migration example:

```sql id="xiy59a"
-- V021__create_priority_index_concurrently.sql

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_regulatory_case__priority_list
ON app.regulatory_case (
    tenant_id,
    priority,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

Because PostgreSQL does not allow `CREATE INDEX CONCURRENTLY` inside a transaction block, make sure this migration runs without transactional wrapping if your Flyway setup wraps SQL migrations transactionally in your environment.

Practical note:

```text id="1hx1is"
For Flyway:
- isolate concurrent index migration in its own file
- configure mixed/transaction behavior carefully
- test in staging against same PostgreSQL version
```

---

## 11. Liquibase + `runInTransaction=false`

Liquibase changesets run in a single transaction by default when possible; `runInTransaction` controls whether a changeset is run in a transaction, with default `true`. ([docs.liquibase.com](https://docs.liquibase.com/secure/reference-guide-5-2/changelog-attributes/runintransaction))

Formatted SQL example:

```sql id="nzir99"
--liquibase formatted sql

--changeset app:021-create-priority-index runInTransaction:false
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_regulatory_case__priority_list
ON app.regulatory_case (
    tenant_id,
    priority,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

Rule:

```text id="f6scdw"
Any PostgreSQL DDL that cannot run inside transaction block
must be isolated and configured explicitly in migration tool.
```

---

# 12. Drop Index Safely

Normal:

```sql id="8ogpqr"
DROP INDEX app.idx_old_index;
```

Concurrent:

```sql id="hlonq6"
DROP INDEX CONCURRENTLY IF EXISTS app.idx_old_index;
```

PostgreSQL `DROP INDEX CONCURRENTLY` drops an index without locking out concurrent selects, inserts, updates, and deletes on the table, but it also cannot run inside a transaction block and has restrictions. ([postgresql.org](https://www.postgresql.org/docs/current/sql-dropindex.html))

Use cases:

```text id="23ghkh"
1. removing old large index
2. replacing index with better index
3. reducing write overhead
```

Safe replace pattern:

```text id="pyrr0e"
1. create new index concurrently
2. deploy/read query validated
3. monitor new index usage
4. drop old index concurrently later
```

---

# 13. Unique Constraint with Concurrent Index

For large table, create unique index concurrently first:

```sql id="wri2vk"
CREATE UNIQUE INDEX CONCURRENTLY uq_regulatory_case__tenant_external_ref_idx
ON app.regulatory_case (
    tenant_id,
    external_reference
)
WHERE external_reference IS NOT NULL;
```

Then attach as constraint if needed:

```sql id="pbf469"
ALTER TABLE app.regulatory_case
ADD CONSTRAINT uq_regulatory_case__tenant_external_ref
UNIQUE USING INDEX uq_regulatory_case__tenant_external_ref_idx;
```

Caveat:

```text id="4r25n7"
Partial unique index cannot always be represented as table constraint the same way.
Partial unique index itself is still valid for enforcing partial uniqueness.
```

Use partial unique index directly:

```sql id="b5ka2o"
CREATE UNIQUE INDEX CONCURRENTLY uq_case_assignment__one_active
ON app.case_assignment (
    tenant_id,
    case_id
)
WHERE released_at IS NULL;
```

---

# 14. Backfill Strategy

Bad:

```sql id="2rj2ww"
UPDATE app.regulatory_case
SET priority = 'NORMAL'
WHERE priority IS NULL;
```

On large table, this can:

```text id="j3i1g9"
1. update millions of rows in one transaction
2. create huge WAL
3. hold locks longer
4. cause replication lag
5. generate bloat
6. trigger autovacuum pressure
```

Better chunked backfill:

```sql id="bzju71"
WITH batch AS (
    SELECT ctid
    FROM app.regulatory_case
    WHERE priority IS NULL
    LIMIT 5000
)
UPDATE app.regulatory_case c
SET priority = 'NORMAL'
FROM batch b
WHERE c.ctid = b.ctid
RETURNING c.tenant_id, c.case_id;
```

Repeat until zero.

Verification:

```sql id="xse5l0"
SELECT count(*)
FROM app.regulatory_case
WHERE priority IS NULL;
```

---

## 15. Backfill Progress Table

```sql id="6cuq0w"
CREATE TABLE app.migration_backfill_progress (
    migration_name text PRIMARY KEY,
    status         text NOT NULL,
    started_at     timestamptz NOT NULL DEFAULT clock_timestamp(),
    updated_at     timestamptz NOT NULL DEFAULT clock_timestamp(),
    completed_at   timestamptz,
    rows_processed bigint NOT NULL DEFAULT 0,
    last_error     text,

    CONSTRAINT chk_migration_backfill_progress__status
        CHECK (status IN ('RUNNING', 'COMPLETED', 'FAILED'))
);
```

Worker updates progress:

```sql id="a5acv1"
INSERT INTO app.migration_backfill_progress (
    migration_name,
    status
)
VALUES (
    'backfill_regulatory_case_priority',
    'RUNNING'
)
ON CONFLICT (migration_name)
DO NOTHING;
```

After each batch:

```sql id="8iez56"
UPDATE app.migration_backfill_progress
SET rows_processed = rows_processed + :batchCount,
    updated_at = clock_timestamp()
WHERE migration_name = 'backfill_regulatory_case_priority';
```

Mark complete:

```sql id="k63pyz"
UPDATE app.migration_backfill_progress
SET status = 'COMPLETED',
    completed_at = clock_timestamp(),
    updated_at = clock_timestamp()
WHERE migration_name = 'backfill_regulatory_case_priority';
```

---

# 16. Java/MyBatis Backfill Worker

```java id="hr6oxn"
public final class PriorityBackfillJob implements Runnable {
    private final SqlSessionFactory sqlSessionFactory;
    private final int batchSize;

    public PriorityBackfillJob(SqlSessionFactory sqlSessionFactory, int batchSize) {
        this.sqlSessionFactory = sqlSessionFactory;
        this.batchSize = batchSize;
    }

    @Override
    public void run() {
        while (!Thread.currentThread().isInterrupted()) {
            int updated = runOneBatch();

            if (updated == 0) {
                markCompleted();
                return;
            }

            sleepQuietly(200);
        }
    }

    private int runOneBatch() {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            DbSessionMapper db = session.getMapper(DbSessionMapper.class);
            CaseMigrationMapper mapper = session.getMapper(CaseMigrationMapper.class);

            db.setMigrationSafety();

            int updated = mapper.backfillPriority(batchSize);

            session.commit();
            return updated;
        } catch (RuntimeException e) {
            // log, metric, retry by scheduler
            throw e;
        }
    }

    private void markCompleted() {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            CaseMigrationMapper mapper = session.getMapper(CaseMigrationMapper.class);
            mapper.markPriorityBackfillCompleted();
            session.commit();
        }
    }

    private void sleepQuietly(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException interrupted) {
            Thread.currentThread().interrupt();
        }
    }
}
```

Mapper:

```xml id="3xfawm"
<update id="setMigrationSafety">
  SET LOCAL lock_timeout = '500ms';
  SET LOCAL statement_timeout = '10s';
  SET LOCAL idle_in_transaction_session_timeout = '15s'
</update>

<update id="backfillPriority">
  WITH batch AS (
      SELECT ctid
      FROM app.regulatory_case
      WHERE priority IS NULL
      LIMIT #{batchSize}
  )
  UPDATE app.regulatory_case c
  SET priority = 'NORMAL',
      updated_at = clock_timestamp()
  FROM batch b
  WHERE c.ctid = b.ctid
</update>
```

Rule:

```text id="zneod2"
Backfill app worker harus:
1. chunked
2. retryable
3. idempotent
4. observable
5. pause-able
6. tidak mengganggu OLTP SLO
```

---

# 17. Avoiding Table Rewrite

Common risky operations:

| Operation | Risk |
|---|---|
| add column with volatile default | table rewrite |
| change column type with `USING` | rewrite likely |
| set not null on huge unproven data | table scan/lock |
| add FK/check without `NOT VALID` | table scan during DDL |
| create index normal on big table | blocks writes |
| drop column | metadata mostly, but app compatibility risk |
| rename column | breaks old app immediately |
| rename enum value | app compatibility risk |
| partition migration | large rewrite/backfill |

Safer alternative:

```text id="4jn101"
1. add new column
2. dual-write
3. backfill
4. switch reads
5. contract old column later
```

---

# 18. Changing Column Type Safely

Dangerous direct change:

```sql id="wnrts0"
ALTER TABLE app.regulatory_case
ALTER COLUMN external_reference TYPE bigint
USING external_reference::bigint;
```

Safer expand-contract:

```sql id="ugswl6"
ALTER TABLE app.regulatory_case
ADD COLUMN external_reference_bigint bigint;
```

Backfill:

```sql id="axoozi"
WITH batch AS (
    SELECT ctid
    FROM app.regulatory_case
    WHERE external_reference_bigint IS NULL
      AND external_reference ~ '^[0-9]+$'
    LIMIT 5000
)
UPDATE app.regulatory_case c
SET external_reference_bigint = c.external_reference::bigint
FROM batch b
WHERE c.ctid = b.ctid;
```

Add constraint:

```sql id="uq01a1"
ALTER TABLE app.regulatory_case
ADD CONSTRAINT chk_regulatory_case__external_reference_numeric
CHECK (external_reference IS NULL OR external_reference ~ '^[0-9]+$')
NOT VALID;

ALTER TABLE app.regulatory_case
VALIDATE CONSTRAINT chk_regulatory_case__external_reference_numeric;
```

Switch app to read new column, then contract old column later.

---

# 19. Renaming Column Safely

Direct rename breaks old app:

```sql id="o903hd"
ALTER TABLE app.regulatory_case
RENAME COLUMN title TO case_title;
```

Safer:

```text id="fli982"
1. add new column case_title
2. dual-write title and case_title
3. backfill case_title from title
4. switch reads to case_title
5. stop writing title
6. drop title in later release
```

Optional compatibility view for read-only clients:

```sql id="53ccct"
CREATE OR REPLACE VIEW app.regulatory_case_compat AS
SELECT
    tenant_id,
    case_id,
    case_number,
    status,
    case_title AS title,
    case_title,
    created_at
FROM app.regulatory_case;
```

But for write path, prefer app migration rather than relying on complex updatable views.

---

# 20. Enum Migration

Adding enum value:

```sql id="g2dny8"
ALTER TYPE app.case_status ADD VALUE IF NOT EXISTS 'CANCELLED';
```

PostgreSQL `ALTER TYPE ... ADD VALUE` adds enum values and supports `IF NOT EXISTS`, and placement can be specified `BEFORE` or `AFTER` existing values. ([postgresql.org](https://www.postgresql.org/docs/current/sql-altertype.html))

Caution:

```text id="v6ve4e"
Adding enum value is easier than removing/renaming.
For business statuses that change often, lookup table or text + CHECK may be more migration-friendly.
```

Safer alternative for evolving domain:

```sql id="x1bdlt"
CREATE TABLE app.ref_case_status (
    status_code text PRIMARY KEY,
    display_name text NOT NULL,
    active boolean NOT NULL DEFAULT true
);
```

Then FK or check strategy depending performance/domain.

---

# 21. Dropping Column/Table Safely

Never drop immediately after app change.

Contract phase checklist:

```text id="x0iqns"
1. verify no app version reads/writes old column
2. verify no report/view/job uses old column
3. search codebase and SQL files
4. check pg_stat_statements if possible
5. deploy contract migration separately
6. have forward-fix plan
```

Drop column:

```sql id="vb5ffd"
ALTER TABLE app.regulatory_case
DROP COLUMN old_priority;
```

Safer pre-drop:

```sql id="8qwprh"
ALTER TABLE app.regulatory_case
RENAME COLUMN old_priority TO old_priority__deprecated_20260715;
```

Then wait one release cycle. If nothing breaks, drop later.

---

# 22. Repeatable Objects: Views, Functions, Procedures

Flyway repeatable migrations are applied after pending versioned migrations and must be safely repeatable, usually using `CREATE OR REPLACE`. ([documentation.red-gate.com](https://documentation.red-gate.com/fd/repeatable-migrations-273973335.html))

Flyway:

```sql id="z74kuc"
-- R__case_timeline_view.sql

CREATE OR REPLACE VIEW app.case_timeline_view AS
SELECT
    tenant_id,
    case_id,
    changed_at AS occurred_at,
    'STATUS_CHANGE'::text AS event_type
FROM app.case_status_history;
```

Liquibase formatted SQL:

```sql id="0zjlgb"
--liquibase formatted sql

--changeset app:repeatable-case-timeline-view runOnChange:true
CREATE OR REPLACE VIEW app.case_timeline_view AS
SELECT
    tenant_id,
    case_id,
    changed_at AS occurred_at,
    'STATUS_CHANGE'::text AS event_type
FROM app.case_status_history;
```

Caution:

```text id="pz29f9"
CREATE OR REPLACE VIEW tidak selalu bisa mengubah struktur view secara bebas.
Jika column order/type berubah, mungkin perlu drop/recreate dengan dependency plan.
```

---

# 23. Migration Transaction Behavior

PostgreSQL transactional DDL is powerful, but not all commands can run in transaction block.

Examples that need special handling:

```text id="dxs4lx"
1. CREATE INDEX CONCURRENTLY
2. DROP INDEX CONCURRENTLY
3. VACUUM
4. some ALTER TYPE / operational commands depending version/context
```

Liquibase default:

```text id="9j4sod"
changeset runInTransaction=true by default.
Set runInTransaction=false for commands like CREATE INDEX CONCURRENTLY.
```

Flyway:

```text id="oi521v"
Isolate non-transactional migration commands in their own migration.
Configure transaction behavior according to Flyway version/config.
Test in staging.
```

---

# 24. Lock Guardrails for Migration

Before risky DDL:

```sql id="44jmp1"
SET lock_timeout = '2s';
SET statement_timeout = '5min';
```

Example:

```sql id="jmvtyl"
SET lock_timeout = '2s';

ALTER TABLE app.regulatory_case
ADD COLUMN priority text;
```

If migration cannot acquire lock quickly, fail rather than block production.

Monitor blockers:

```sql id="qduuvo"
SELECT
    blocked.pid AS blocked_pid,
    now() - blocked.query_start AS blocked_for,
    left(blocked.query, 500) AS blocked_query,
    blocker.pid AS blocker_pid,
    blocker.state AS blocker_state,
    now() - blocker.xact_start AS blocker_xact_age,
    left(blocker.query, 500) AS blocker_query
FROM pg_stat_activity blocked
JOIN LATERAL unnest(pg_blocking_pids(blocked.pid)) bpid(blocker_pid)
    ON true
JOIN pg_stat_activity blocker
    ON blocker.pid = bpid.blocker_pid;
```

PostgreSQL explicit locking docs explain lock modes and conflicts; `ACCESS EXCLUSIVE` is the most restrictive table lock and conflicts with all other lock modes. ([postgresql.org](https://www.postgresql.org/docs/current/explicit-locking.html))

---

# 25. Migration Preflight Checklist

```text id="ob191r"
Before production migration:
1. migration tested on restored production-like data
2. lock impact reviewed
3. table size checked
4. index build time estimated
5. WAL generation estimated
6. replication lag impact considered
7. old/new app compatibility verified
8. rollback-forward plan written
9. monitoring dashboard ready
10. stop condition defined
```

Table size:

```sql id="e0igrw"
SELECT
    pg_size_pretty(pg_relation_size('app.regulatory_case')) AS table_size,
    pg_size_pretty(pg_indexes_size('app.regulatory_case')) AS indexes_size,
    pg_size_pretty(pg_total_relation_size('app.regulatory_case')) AS total_size;
```

Row estimates:

```sql id="rnkios"
SELECT
    reltuples::bigint AS estimated_rows
FROM pg_class
WHERE oid = 'app.regulatory_case'::regclass;
```

Potential invalid rows before constraint:

```sql id="jtrvdf"
SELECT count(*)
FROM app.regulatory_case
WHERE priority IS NOT NULL
  AND priority NOT IN ('LOW', 'NORMAL', 'HIGH', 'URGENT');
```

---

# 26. Deployment Ordering Patterns

## 26.1 Additive column

```text id="zjkkt7"
1. DB migration: add nullable column
2. App deploy: write new column, tolerate null
3. Backfill
4. DB migration: add constraint / not null
5. App deploy: require new column
```

## 26.2 Remove column

```text id="xtb5vn"
1. App deploy: stop reading column
2. App deploy: stop writing column
3. Verify no usage
4. DB migration: rename deprecated column
5. Wait
6. DB migration: drop column
```

## 26.3 Change semantics

```text id="xl8xez"
1. Add new column/table
2. Dual-write
3. Backfill
4. Dual-read compare
5. Switch read
6. Stop old write
7. Drop old later
```

## 26.4 Add unique business rule

```text id="k0b21i"
1. Detect duplicates
2. Clean duplicates
3. Create unique index concurrently
4. Add app error mapping
5. Validate behavior
```

---

# 27. Rollback vs Rollback-Forward

Traditional rollback:

```text id="oaa0tw"
deploy bad app/schema
rollback app and schema
```

In databases, destructive rollback is often risky.

Prefer rollback-forward:

```text id="xs0ics"
1. stop bad behavior
2. deploy forward fix
3. keep compatible schema
4. correct data with audited script
5. contract later
```

Examples:

| Bad change | Safer response |
|---|---|
| app writes wrong status | deploy app fix + corrective migration |
| new column unused | leave column; remove later |
| index bad | drop concurrently later |
| constraint too strict | drop constraint or add exception forward |
| column dropped too early | restore from backup is painful; avoid by delayed contract |
| backfill wrong | audited compensating update |

Rule:

```text id="yf8jqn"
Avoid irreversible schema changes in same release as app behavior change.
```

---

# 28. Flyway Safety Practices

```text id="wo9q05"
1. Never edit applied migration files.
2. Use new migration for fixes.
3. Use validate in CI/CD.
4. Use repair only with clear runbook and approval.
5. Isolate non-transactional PostgreSQL DDL.
6. Keep repeatable migrations idempotent.
7. Tag release artifact with migration version.
```

Flyway’s `validate` command compares applied migrations against resolved migrations and fails if checksums, names, types, or applied/resolved status differ; this helps detect accidental changes to applied migrations. ([brunomendola.github.io](https://brunomendola.github.io/flywaydb.org/documentation/commandline/validate))

Example commands:

```bash id="0a1cjd"
flyway validate
flyway migrate
flyway info
flyway repair
```

Caution:

```text id="brhcwk"
repair is not a casual fix.
It changes schema history metadata; use only when you understand why history differs.
```

---

# 29. Liquibase Safety Practices

```text id="8va7lq"
1. Use preconditions for safety checks.
2. Use contexts/labels to separate env-specific changes.
3. Avoid editing applied changesets unless runOnChange policy intended.
4. Use runInTransaction=false only when required.
5. Use rollback blocks only if tested.
6. Use changelog include structure to reduce conflicts.
7. Review generated SQL before production.
```

Liquibase contexts are tags that control whether changesets run; they are filtered at runtime using context filters. ([docs.liquibase.com](https://docs.liquibase.com/secure/reference-guide-5-2-1/changelog-attributes/what-are-contexts)) Liquibase changelogs can include preconditions, contexts, labels, and other attributes to control which changesets run and where. ([docs.liquibase.com](https://docs.liquibase.com/secure/user-guide-5-2-1/what-is-a-changelog))

Example formatted SQL:

```sql id="nxfy73"
--liquibase formatted sql

--changeset app:022-add-priority-column context:prod
ALTER TABLE app.regulatory_case
ADD COLUMN priority text;

--rollback ALTER TABLE app.regulatory_case DROP COLUMN priority;
```

Caution:

```text id="fnpaj8"
Rollback block yang syntactically ada belum tentu operationally aman.
Dropping column rollback bisa hilangkan data.
```

---

# 30. Migration Observability

During migration:

```sql id="ow6fez"
SELECT
    pid,
    application_name,
    state,
    wait_event_type,
    wait_event,
    now() - query_start AS query_age,
    left(query, 1000) AS query
FROM pg_stat_activity
WHERE state <> 'idle'
ORDER BY query_start ASC;
```

Index progress:

```sql id="y0ykzg"
SELECT
    pid,
    datname,
    relid::regclass AS table_name,
    index_relid::regclass AS index_name,
    phase,
    blocks_total,
    blocks_done,
    round(100.0 * blocks_done / NULLIF(blocks_total, 0), 2) AS blocks_pct,
    tuples_total,
    tuples_done
FROM pg_stat_progress_create_index;
```

PostgreSQL provides progress reporting views including `pg_stat_progress_create_index`, which reports progress for `CREATE INDEX` and `REINDEX` operations. ([postgresql.org](https://www.postgresql.org/docs/current/progress-reporting.html))

Autovacuum/backfill side effects:

```sql id="qv7tei"
SELECT
    relname,
    n_live_tup,
    n_dead_tup,
    last_autovacuum,
    last_autoanalyze
FROM pg_stat_user_tables
WHERE relname IN ('regulatory_case', 'case_audit_log');
```

Replication lag during migration:

```sql id="dhcs58"
SELECT
    application_name,
    state,
    pg_size_pretty(pg_wal_lsn_diff(sent_lsn, replay_lsn)) AS sent_replay_lag,
    write_lag,
    flush_lag,
    replay_lag
FROM pg_stat_replication;
```

---

# 31. MyBatis Compatibility Checklist

| Change | Mapper risk | Safe pattern |
|---|---|---|
| Add nullable column | low | mapper ignores unknown column |
| Add NOT NULL column | insert mapper may fail | add nullable first, update mapper, backfill |
| Rename column | resultMap/select breaks | add new column + dual-read |
| Drop column | select/resultMap breaks | stop reading first, deploy, drop later |
| Change type | TypeHandler/resultMap breaks | new column + backfill |
| Add enum value | Java enum may fail if unknown | deploy Java enum support first |
| Add constraint | existing writes may fail | validate app behavior before enforcing |
| Add RLS | missing context causes no rows | set tenant context bootstrap |
| Add index | no mapper risk | validate query plan |
| Change view | resultMap risk | versioned view or compatible columns |

Java enum caution:

```java id="tvzfir"
public enum CaseStatus {
    DRAFT,
    SUBMITTED,
    UNDER_REVIEW,
    APPROVED,
    REJECTED,
    CLOSED,
    CANCELLED // deploy support before DB/app writes this value
}
```

Rule:

```text id="np5w73"
If DB can produce new value, Java must tolerate it before production writes it.
```

---

# 32. Example End-to-End Migration: Add `priority`

## Migration 1 - Expand

```sql id="b0g78l"
-- V021__add_case_priority_column.sql
SET lock_timeout = '2s';

ALTER TABLE app.regulatory_case
ADD COLUMN priority text;

ALTER TABLE app.regulatory_case
ALTER COLUMN priority SET DEFAULT 'NORMAL';
```

## App release

```text id="1mzruy"
- insert writes priority
- update preserves priority
- read DTO treats null as NORMAL during transition
```

## Migration 2 - Index concurrently

```sql id="piyfv6"
-- V022__create_case_priority_index.sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_regulatory_case__priority_list
ON app.regulatory_case (
    tenant_id,
    priority,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

## Backfill worker

```sql id="jkyg51"
WITH batch AS (
    SELECT ctid
    FROM app.regulatory_case
    WHERE priority IS NULL
    LIMIT 5000
)
UPDATE app.regulatory_case c
SET priority = 'NORMAL'
FROM batch b
WHERE c.ctid = b.ctid;
```

## Migration 3 - Add check constraint not valid

```sql id="d4w9cq"
-- V023__add_case_priority_check_not_valid.sql
ALTER TABLE app.regulatory_case
ADD CONSTRAINT chk_regulatory_case__priority
CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT'))
NOT VALID;
```

## Migration 4 - Validate

```sql id="ip0a7r"
-- V024__validate_case_priority_check.sql
ALTER TABLE app.regulatory_case
VALIDATE CONSTRAINT chk_regulatory_case__priority;
```

## Migration 5 - Contract

```sql id="c3xl5y"
-- V025__set_case_priority_not_null.sql
ALTER TABLE app.regulatory_case
ALTER COLUMN priority SET NOT NULL;
```

---

# 33. Anti-Pattern

## Anti-pattern 1 - Rename/drop column in same release

```sql id="zaq3ft"
ALTER TABLE app.regulatory_case
RENAME COLUMN title TO case_title;
```

Breaks old app during rolling deploy.

Better:

```text id="oit2hq"
add case_title → dual-write → backfill → switch read → drop title later
```

---

## Anti-pattern 2 - Big backfill in migration transaction

```sql id="x7z66y"
UPDATE huge_table SET new_col = ...;
```

Better:

```text id="l3e09h"
background chunked backfill with progress and pause/retry.
```

---

## Anti-pattern 3 - Create index normally on huge hot table

```sql id="0u79rb"
CREATE INDEX idx_big ON huge_hot_table (...);
```

Better:

```sql id="vx3cug"
CREATE INDEX CONCURRENTLY idx_big ON huge_hot_table (...);
```

---

## Anti-pattern 4 - Add FK/check directly on dirty big table

```sql id="6e9pl2"
ALTER TABLE child
ADD CONSTRAINT fk_child_parent
FOREIGN KEY (...) REFERENCES parent (...);
```

Better:

```sql id="bxswjy"
ALTER TABLE child
ADD CONSTRAINT fk_child_parent
FOREIGN KEY (...) REFERENCES parent (...)
NOT VALID;

-- fix invalid data

ALTER TABLE child VALIDATE CONSTRAINT fk_child_parent;
```

---

## Anti-pattern 5 - Editing applied Flyway/Liquibase migration

Applied migration history should be immutable. Fix with a new migration unless your tool/runbook specifically calls for repair.

---

## Anti-pattern 6 - Rollback script drops new column with data

Rollback that destroys data is not safe rollback.

Better:

```text id="gujjm0"
rollback-forward:
disable feature flag
deploy app fix
leave schema
clean up later
```

---

# 34. Production Checklist

| Checklist | Pertanyaan |
|---|---|
| Expand-contract | Apakah migration dibagi expand/backfill/contract? |
| Rolling compatible | Apakah old app dan new app bisa jalan bersama? |
| Lock reviewed | Apakah DDL lock impact diketahui? |
| `lock_timeout` | Apakah migration fail-fast jika lock tidak tersedia? |
| Big index | Apakah pakai `CREATE INDEX CONCURRENTLY`? |
| Non-transactional DDL | Apakah migration tool dikonfigurasi tepat? |
| Constraint | Apakah FK/CHECK besar pakai `NOT VALID` lalu `VALIDATE`? |
| Backfill | Apakah backfill chunked, idempotent, observable? |
| WAL/replica | Apakah backfill/migration impact ke WAL dan replication lag dipantau? |
| MyBatis | Apakah mapper/resultMap/TypeHandler kompatibel? |
| Java enum | Apakah app support enum/value baru sebelum DB menulis? |
| Rollback-forward | Apakah forward fix plan tersedia? |
| Preflight | Apakah migration diuji di data production-like? |
| Observability | Apakah locks, index progress, lag, dead tuples dipantau? |
| Ownership/grants | Apakah grants/default privileges untuk object baru benar? |
| Post-check | Apakah constraint/index/query plan divalidasi setelah migration? |

---

# 35. Mini Lab

## Step 1 - Existing table

```sql id="vyfmjc"
CREATE TABLE app.regulatory_case (
    tenant_id    bigint NOT NULL,
    case_id      uuid NOT NULL DEFAULT uuidv7(),
    case_number  text NOT NULL,
    status       text NOT NULL,
    title        text NOT NULL,
    created_at   timestamptz NOT NULL DEFAULT clock_timestamp(),
    deleted_at   timestamptz,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id)
);
```

## Step 2 - Expand

```sql id="0u9ycg"
ALTER TABLE app.regulatory_case
ADD COLUMN priority text;

ALTER TABLE app.regulatory_case
ALTER COLUMN priority SET DEFAULT 'NORMAL';
```

## Step 3 - Backfill chunk

```sql id="gg602v"
WITH batch AS (
    SELECT ctid
    FROM app.regulatory_case
    WHERE priority IS NULL
    LIMIT 1000
)
UPDATE app.regulatory_case c
SET priority = 'NORMAL'
FROM batch b
WHERE c.ctid = b.ctid;
```

Repeat until:

```sql id="y5aph4"
SELECT count(*)
FROM app.regulatory_case
WHERE priority IS NULL;
```

## Step 4 - Add check not valid

```sql id="iqkwf2"
ALTER TABLE app.regulatory_case
ADD CONSTRAINT chk_regulatory_case__priority
CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT'))
NOT VALID;
```

## Step 5 - Validate

```sql id="oygf6s"
ALTER TABLE app.regulatory_case
VALIDATE CONSTRAINT chk_regulatory_case__priority;
```

## Step 6 - Create index concurrently

```sql id="if73cy"
CREATE INDEX CONCURRENTLY idx_regulatory_case__priority_list
ON app.regulatory_case (
    tenant_id,
    priority,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;
```

## Step 7 - Contract

```sql id="timdwb"
ALTER TABLE app.regulatory_case
ALTER COLUMN priority SET NOT NULL;
```

Expected:

```text id="fd2qd0"
Schema berhasil berubah dengan risiko lock/write-blocking lebih rendah,
dan app bisa rolling deploy secara kompatibel.
```

---

## 36. Ringkasan Praktis

```text id="69pkxr"
1. Schema migration production harus kompatibel dengan rolling deployment.
2. Gunakan expand-contract: add new schema, dual-write, backfill, validate, switch, contract.
3. Add nullable column lebih aman daripada add NOT NULL langsung.
4. CHECK/FK besar sebaiknya ADD NOT VALID lalu VALIDATE CONSTRAINT.
5. Index besar di hot table gunakan CREATE INDEX CONCURRENTLY.
6. DROP INDEX CONCURRENTLY lebih aman untuk mengurangi blocking.
7. Non-transactional DDL harus dikonfigurasi khusus di Flyway/Liquibase.
8. Backfill besar jangan satu transaksi; gunakan chunked worker.
9. Rename/drop/change type langsung sering breaking; gunakan new column + backfill.
10. Rollback database yang destruktif sering tidak realistis; prefer rollback-forward.
11. Migration harus punya preflight, lock timeout, observability, stop condition, dan post-check.
12. MyBatis mapper, Java enum, TypeHandler, dan DTO harus ikut compatibility plan.
```

---

# Status Seri

**Seri 21/22 selesai.**

Rekomendasi lanjut ke seri terakhir:

**Seri 22 - Java/Jersey/MyBatis Integration Pattern for PostgreSQL OLTP: transaction boundary, mapper design, SQLSTATE mapping, idempotency, outbox, pagination, retry, connection pool, observability, dan production-ready service template.**

## Response:
7/15/2026, 8:58:03 PM

Saya lanjut ke **Seri 22/22**, seri penutup. Ini akan menggabungkan seluruh pattern OLTP ke template praktis Java/Jersey/MyBatis: transaction boundary, mapper design, SQLSTATE/error mapping, idempotency, outbox, retry, pagination, connection pool, dan observability.

# PostgreSQL OLTP - Seri 22/22  
## Java/Jersey/MyBatis Integration Pattern for PostgreSQL OLTP: Transaction Boundary, Mapper Design, SQLSTATE Mapping, Idempotency, Outbox, Pagination, Retry, Connection Pool, Observability, dan Production-Ready Service Template

Seri terakhir ini menyatukan seluruh seri PostgreSQL OLTP menjadi **template implementasi Java/Jersey/MyBatis**. Fokusnya adalah pola yang bisa langsung dipakai di service production:

```text id="5xr6rb"
1. Jersey Resource tipis
2. Service sebagai transaction boundary
3. MyBatis mapper eksplisit per use case
4. PostgreSQL sebagai source of truth untuk invariant
5. SQLSTATE mapping ke API error
6. optimistic/pessimistic concurrency
7. idempotency untuk retry-safe POST
8. outbox untuk integration event
9. keyset pagination untuk list besar
10. retry transaction untuk error yang tepat
11. connection/session safety
12. observability end-to-end
```

MyBatis menjadikan `SqlSession` sebagai interface utama untuk eksekusi command, memperoleh mapper, dan mengelola transaksi; default `openSession()` membuat transaction scope non-auto-commit, sementara varian `openSession(false)` biasa dipakai untuk transaksi manual eksplisit. ([MyBatis](https://mybatis.org/mybatis-3/java-api.html?utm_source=chatgpt.com)) PostgreSQL sendiri merekomendasikan aplikasi mengecek **SQLSTATE** daripada teks error, karena SQLSTATE lebih stabil dan tidak bergantung lokalisasi pesan. ([PostgreSQL](https://www.postgresql.org/docs/current/errcodes-appendix.html))

---

## 1. Architecture Mental Model

```text id="r8697e"
Jersey API Layer
│
├─ Resource
│  ├─ parse path/query/body
│  ├─ validate syntactic request
│  ├─ get authenticated principal
│  ├─ build command/query object
│  └─ call service
│
├─ Filter / Context
│  ├─ request_id
│  ├─ correlation_id
│  ├─ tenant_id
│  ├─ actor_id
│  └─ permissions
│
└─ ExceptionMapper
   ├─ DomainException → HTTP
   ├─ DatabaseException → HTTP
   └─ fallback → 500

Service Layer
│
├─ owns transaction boundary
├─ calls mapper methods
├─ interprets 0-row mutation
├─ inserts audit/outbox/idempotency
├─ commits/rollbacks
└─ maps domain result

Persistence Layer / MyBatis
│
├─ mapper interface
├─ mapper XML
├─ SQL shape explicit
├─ resultMap explicit
├─ TypeHandler if needed
└─ no hidden business transaction

PostgreSQL
│
├─ constraints
├─ indexes
├─ guarded UPDATE
├─ RETURNING
├─ triggers/functions where appropriate
├─ audit/history/outbox tables
└─ SQLSTATE / constraint names
```

Rule utama:

```text id="uwfm23"
Resource tidak memulai logic transaksi.
Mapper tidak memutuskan business workflow.
Service adalah boundary utama untuk transaction + domain command.
```

---

## 2. Layer Responsibility Table

| Layer | Tanggung jawab | Jangan lakukan |
|---|---|---|
| Jersey Resource | HTTP mapping, request parsing, call service | SQL, transaction, retry DB detail |
| Filter | auth context, request/correlation id | business mutation |
| Service | transaction boundary, command orchestration | raw HTTP response construction |
| Mapper | exact SQL per use case | business decision tersembunyi |
| PostgreSQL | constraints, indexes, atomic mutation, audit/outbox storage | external API call |
| ExceptionMapper | domain error → HTTP response | swallowing root cause |
| Worker | outbox/queue processing | long DB transaction with external call |
| Migration | DDL/data backfill | runtime application mutation |

---

# 3. Reference Package Structure

```text id="pvn7na"
com.company.caseapi
│
├─ api
│  ├─ CaseResource.java
│  ├─ dto
│  │  ├─ SubmitCaseRequest.java
│  │  ├─ CaseResponse.java
│  │  └─ ErrorResponse.java
│  ├─ filter
│  │  ├─ RequestContextFilter.java
│  │  └─ AuthenticationFilter.java
│  └─ exception
│     ├─ DomainExceptionMapper.java
│     └─ ThrowableExceptionMapper.java
│
├─ application
│  ├─ SubmitCaseService.java
│  ├─ CreateCaseService.java
│  ├─ SearchCaseService.java
│  ├─ OutboxPublisher.java
│  └─ TransactionRetrier.java
│
├─ domain
│  ├─ command
│  │  ├─ SubmitCaseCommand.java
│  │  └─ CreateCaseCommand.java
│  ├─ error
│  │  ├─ DomainException.java
│  │  ├─ BusinessConflictException.java
│  │  ├─ ResourceBusyException.java
│  │  └─ ValidationException.java
│  └─ model
│     ├─ CaseStatus.java
│     └─ ReadConsistency.java
│
├─ persistence
│  ├─ mapper
│  │  ├─ DbSessionMapper.java
│  │  ├─ CaseCommandMapper.java
│  │  ├─ CaseQueryMapper.java
│  │  ├─ AuditMapper.java
│  │  ├─ OutboxMapper.java
│  │  └─ IdempotencyMapper.java
│  ├─ row
│  │  ├─ CaseRow.java
│  │  ├─ SubmitCaseResultRow.java
│  │  └─ OutboxEventRow.java
│  ├─ typehandler
│  │  └─ JsonNodeTypeHandler.java
│  └─ DatabaseErrorMapper.java
│
└─ infrastructure
   ├─ SqlSessionFactories.java
   ├─ DataSourceFactory.java
   └─ Observability.java
```

---

# 4. Database Schema Baseline

```sql id="pl7hsc"
CREATE TABLE regulatory_case (
    tenant_id      bigint NOT NULL,
    case_id        uuid NOT NULL DEFAULT uuidv7(),
    case_number    text NOT NULL,
    status         text NOT NULL,
    title          text NOT NULL,
    priority       text NOT NULL DEFAULT 'NORMAL',
    version        bigint NOT NULL DEFAULT 0,
    submitted_at   timestamptz,
    approved_at    timestamptz,
    created_by     text NOT NULL,
    created_at     timestamptz NOT NULL DEFAULT clock_timestamp(),
    updated_by     text NOT NULL,
    updated_at     timestamptz NOT NULL DEFAULT clock_timestamp(),
    deleted_at     timestamptz,

    CONSTRAINT pk_regulatory_case
        PRIMARY KEY (tenant_id, case_id),

    CONSTRAINT uq_regulatory_case__case_number
        UNIQUE (tenant_id, case_number),

    CONSTRAINT chk_regulatory_case__status
        CHECK (status IN (
            'DRAFT',
            'SUBMITTED',
            'UNDER_REVIEW',
            'APPROVED',
            'REJECTED',
            'CLOSED'
        )),

    CONSTRAINT chk_regulatory_case__priority
        CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),

    CONSTRAINT chk_regulatory_case__title_not_blank
        CHECK (length(trim(title)) > 0)
);
```

History:

```sql id="x66vjy"
CREATE TABLE case_status_history (
    tenant_id      bigint NOT NULL,
    history_id     bigint GENERATED ALWAYS AS IDENTITY,
    case_id        uuid NOT NULL,
    from_status    text,
    to_status      text NOT NULL,
    action         text NOT NULL,
    reason         text,
    changed_by     text NOT NULL,
    changed_at     timestamptz NOT NULL DEFAULT clock_timestamp(),
    request_id     text,
    correlation_id text,

    CONSTRAINT pk_case_status_history
        PRIMARY KEY (tenant_id, history_id),

    CONSTRAINT fk_case_status_history__case
        FOREIGN KEY (tenant_id, case_id)
        REFERENCES regulatory_case (tenant_id, case_id)
);
```

Outbox:

```sql id="mypnih"
CREATE TABLE outbox_event (
    tenant_id         bigint NOT NULL,
    outbox_id         uuid NOT NULL DEFAULT uuidv7(),
    aggregate_type    text NOT NULL,
    aggregate_id      uuid NOT NULL,
    aggregate_version bigint,
    event_type        text NOT NULL,
    event_version     integer NOT NULL DEFAULT 1,
    payload           jsonb NOT NULL,
    headers           jsonb NOT NULL DEFAULT '{}'::jsonb,
    status            text NOT NULL DEFAULT 'NEW',
    available_at      timestamptz NOT NULL DEFAULT clock_timestamp(),
    locked_by         text,
    locked_at         timestamptz,
    lock_token        uuid,
    attempt_count     integer NOT NULL DEFAULT 0,
    max_attempts      integer NOT NULL DEFAULT 10,
    last_error        text,
    created_at        timestamptz NOT NULL DEFAULT clock_timestamp(),
    published_at      timestamptz,

    CONSTRAINT pk_outbox_event
        PRIMARY KEY (tenant_id, outbox_id),

    CONSTRAINT chk_outbox_event__status
        CHECK (status IN ('NEW', 'PROCESSING', 'PUBLISHED', 'FAILED')),

    CONSTRAINT chk_outbox_event__payload_object
        CHECK (jsonb_typeof(payload) = 'object'),

    CONSTRAINT chk_outbox_event__headers_object
        CHECK (jsonb_typeof(headers) = 'object')
);
```

Indexes:

```sql id="88vxsl"
CREATE INDEX idx_regulatory_case__submitted_worklist
ON regulatory_case (
    tenant_id,
    created_at ASC,
    case_id ASC
)
WHERE status = 'SUBMITTED'
  AND deleted_at IS NULL;

CREATE INDEX idx_regulatory_case__list_created
ON regulatory_case (
    tenant_id,
    created_at DESC,
    case_id DESC
)
WHERE deleted_at IS NULL;

CREATE INDEX idx_case_status_history__case_timeline
ON case_status_history (
    tenant_id,
    case_id,
    history_id ASC
);

CREATE INDEX idx_outbox_event__new_claim
ON outbox_event (
    tenant_id,
    available_at ASC,
    created_at ASC,
    outbox_id ASC
)
WHERE status = 'NEW';
```

---

# 5. DTO dan Command Model

Resource request DTO:

```java id="lcvyhz"
public record SubmitCaseRequest(
    long expectedVersion,
    String reason
) {}
```

Command object:

```java id="pkbo9c"
public record SubmitCaseCommand(
    long tenantId,
    UUID caseId,
    String actorId,
    String requestId,
    String correlationId,
    long expectedVersion,
    String reason
) {}
```

Response:

```java id="erw1mo"
public record CaseResponse(
    long tenantId,
    UUID caseId,
    String caseNumber,
    String status,
    long version
) {}
```

Error response:

```java id="ezbbkl"
public record ErrorResponse(
    String code,
    String message,
    String requestId,
    String correlationId,
    Map<String, Object> details
) {}
```

Rule:

```text id="d1qe8k"
DTO untuk HTTP tidak harus sama dengan DB row.
Command object membawa semua context yang dibutuhkan service.
```

---

# 6. Jersey Resource Pattern

Jakarta REST/JAX-RS resource class adalah class yang memakai annotation seperti `@Path` untuk root resource, dan request method designator seperti `@GET`, `@POST`, dan lainnya untuk method resource. ([Jakarta EE](https://jakarta.ee/specifications/restful-ws/3.0/jakarta-restful-ws-spec-3.0.html?utm_source=chatgpt.com)) Jersey sendiri adalah framework Jakarta RESTful Web Services open source/production quality untuk membangun RESTful services di Java. ([Jersey](https://jersey.github.io/?utm_source=chatgpt.com))

```java id="a9emao"
@Path("/cases")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public final class CaseResource {
    private final SubmitCaseService submitCaseService;
    private final SearchCaseService searchCaseService;
    private final RequestContextProvider requestContextProvider;

    public CaseResource(
            SubmitCaseService submitCaseService,
            SearchCaseService searchCaseService,
            RequestContextProvider requestContextProvider
    ) {
        this.submitCaseService = submitCaseService;
        this.searchCaseService = searchCaseService;
        this.requestContextProvider = requestContextProvider;
    }

    @POST
    @Path("/{caseId}/submit")
    public Response submitCase(
            @PathParam("caseId") UUID caseId,
            SubmitCaseRequest request
    ) {
        RequestContext ctx = requestContextProvider.current();

        SubmitCaseCommand command = new SubmitCaseCommand(
            ctx.tenantId(),
            caseId,
            ctx.actorId(),
            ctx.requestId(),
            ctx.correlationId(),
            request.expectedVersion(),
            request.reason()
        );

        CaseResponse response = submitCaseService.submit(command);

        return Response.ok(response).build();
    }

    @GET
    public Response searchCases(
            @QueryParam("status") String status,
            @QueryParam("cursor") String cursor,
            @QueryParam("limit") @DefaultValue("50") int limit
    ) {
        RequestContext ctx = requestContextProvider.current();

        CaseSearchResult result = searchCaseService.search(
            new CaseSearchCommand(
                ctx.tenantId(),
                status,
                cursor,
                Math.min(Math.max(limit, 1), 100)
            )
        );

        return Response.ok(result).build();
    }
}
```

Resource rule:

```text id="j3y1s1"
Resource:
- validasi request syntax
- bangun command
- panggil service
- return response

Resource tidak:
- membuka SqlSession
- menulis SQL
- retry transaction
- melakukan mapping SQLSTATE
```

---

# 7. Request Context Filter

Jersey user guide menjelaskan bahwa custom authentication request filter bisa membuat `SecurityContext` sendiri dan filter authentication sebaiknya dieksekusi awal, misalnya dengan priority `AUTHENTICATION`. ([Eclipse EE4J](https://eclipse-ee4j.github.io/jersey.github.io/documentation/latest/user-guide.html?utm_source=chatgpt.com))

```java id="z8th3g"
@Provider
@Priority(Priorities.AUTHENTICATION)
public final class RequestContextFilter implements ContainerRequestFilter {
    private final RequestContextHolder holder;

    public RequestContextFilter(RequestContextHolder holder) {
        this.holder = holder;
    }

    @Override
    public void filter(ContainerRequestContext requestContext) {
        String requestId = Optional
            .ofNullable(requestContext.getHeaderString("X-Request-Id"))
            .orElse(UUID.randomUUID().toString());

        String correlationId = Optional
            .ofNullable(requestContext.getHeaderString("X-Correlation-Id"))
            .orElse(requestId);

        // Example only. In production, get these from authenticated principal/JWT/session.
        long tenantId = Long.parseLong(requestContext.getHeaderString("X-Tenant-Id"));
        String actorId = requestContext.getSecurityContext().getUserPrincipal().getName();

        holder.set(new RequestContext(
            tenantId,
            actorId,
            "USER",
            requestId,
            correlationId,
            requestContext.getMethod() + " " + requestContext.getUriInfo().getPath()
        ));
    }
}
```

Context:

```java id="bugvm1"
public record RequestContext(
    long tenantId,
    String actorId,
    String actorType,
    String requestId,
    String correlationId,
    String endpoint
) {}
```

---

# 8. MyBatis Mapper Design Principles

MyBatis XML mapper supports statement elements such as `select`, `insert`, `update`, `delete`, result maps, dynamic SQL, statement timeout/fetch size attributes, and mapping between SQL results and Java objects. ([MyBatis](https://mybatis.org/mybatis-3/sqlmap-xml.html))

Practical rules:

```text id="xdin96"
1. Mapper method name = use case, not generic repository.
2. SELECT projection explicit, avoid SELECT *.
3. Mutation uses guarded WHERE + RETURNING.
4. 0-row result is business signal.
5. Use resultMap for non-trivial mapping.
6. Dynamic SQL only with safe whitelist.
7. SQL fragments with ${} only from trusted enum/constant.
8. TypeHandler for jsonb/uuid/custom types.
9. No commit/rollback in mapper.
10. Mapper XML reviewed like application code.
```

Bad generic repository:

```java id="62krxy"
CaseRow save(CaseRow row);
CaseRow update(CaseRow row);
List<CaseRow> find(Map<String, Object> filters);
```

Better use-case mapper:

```java id="37t2ey"
SubmitCaseResultRow submitCase(...);
CaseRow findCaseForUpdate(...);
List<CaseListItemRow> searchSubmittedCases(...);
int insertStatusHistory(...);
int insertOutboxEvent(...);
```

---

# 9. Db Session Context Mapper

```java id="n3d2me"
public interface DbSessionMapper {
    void setTransactionSafety();

    void setRequestContext(
        @Param("tenantId") String tenantId,
        @Param("actorId") String actorId,
        @Param("actorType") String actorType,
        @Param("requestId") String requestId,
        @Param("correlationId") String correlationId,
        @Param("endpoint") String endpoint
    );
}
```

XML:

```xml id="a5uy3k"
<mapper namespace="com.company.caseapi.persistence.mapper.DbSessionMapper">

  <update id="setTransactionSafety">
    SET LOCAL lock_timeout = '500ms';
    SET LOCAL statement_timeout = '5s';
    SET LOCAL idle_in_transaction_session_timeout = '10s'
  </update>

  <update id="setRequestContext">
    SELECT
        set_config('app.tenant_id', #{tenantId}, true),
        set_config('app.actor_id', #{actorId}, true),
        set_config('app.actor_type', #{actorType}, true),
        set_config('app.request_id', #{requestId}, true),
        set_config('app.correlation_id', #{correlationId}, true),
        set_config('app.endpoint', #{endpoint}, true)
  </update>

</mapper>
```

PostgreSQL provides `statement_timeout`, `lock_timeout`, and `idle_in_transaction_session_timeout`; these settings are useful guardrails for OLTP transaction safety, especially to avoid unbounded query runtime, lock waits, and idle transactions. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-client.html))

---

# 10. Submit Case Mapper

Interface:

```java id="t1sgx8"
public interface CaseCommandMapper {
    SubmitCaseResultRow submitCase(
        @Param("tenantId") long tenantId,
        @Param("caseId") UUID caseId,
        @Param("expectedVersion") long expectedVersion,
        @Param("actorId") String actorId
    );
}
```

XML:

```xml id="s0swxs"
<mapper namespace="com.company.caseapi.persistence.mapper.CaseCommandMapper">

  <resultMap id="SubmitCaseResultMap"
             type="com.company.caseapi.persistence.row.SubmitCaseResultRow">
    <id property="tenantId" column="tenant_id"/>
    <id property="caseId" column="case_id"/>
    <result property="caseNumber" column="case_number"/>
    <result property="status" column="status"/>
    <result property="version" column="version"/>
    <result property="submittedAt" column="submitted_at"/>
  </resultMap>

  <select id="submitCase" resultMap="SubmitCaseResultMap">
    UPDATE regulatory_case
    SET status = 'SUBMITTED',
        submitted_at = clock_timestamp(),
        version = version + 1,
        updated_by = #{actorId},
        updated_at = clock_timestamp()
    WHERE tenant_id = #{tenantId}
      AND case_id = #{caseId}
      AND status = 'DRAFT'
      AND version = #{expectedVersion}
      AND deleted_at IS NULL
    RETURNING
        tenant_id,
        case_id,
        case_number,
        status,
        version,
        submitted_at
  </select>

</mapper>
```

Kenapa `<select>` untuk `UPDATE ... RETURNING`?

```text id="fyvkzk"
Karena statement mengembalikan row result.
Di MyBatis, mapping result object lebih natural dengan <select>.
```

---

# 11. Audit dan Outbox Mapper

Audit:

```java id="ppqe8k"
public interface AuditMapper {
    int insertStatusHistory(
        @Param("tenantId") long tenantId,
        @Param("caseId") UUID caseId,
        @Param("fromStatus") String fromStatus,
        @Param("toStatus") String toStatus,
        @Param("action") String action,
        @Param("reason") String reason,
        @Param("actorId") String actorId,
        @Param("requestId") String requestId,
        @Param("correlationId") String correlationId
    );
}
```

```xml id="fzu6oa"
<insert id="insertStatusHistory">
  INSERT INTO case_status_history (
      tenant_id,
      case_id,
      from_status,
      to_status,
      action,
      reason,
      changed_by,
      request_id,
      correlation_id
  )
  VALUES (
      #{tenantId},
      #{caseId},
      #{fromStatus},
      #{toStatus},
      #{action},
      #{reason},
      #{actorId},
      #{requestId},
      #{correlationId}
  )
</insert>
```

Outbox:

```java id="d75c6d"
public interface OutboxMapper {
    int insertCaseSubmitted(
        @Param("tenantId") long tenantId,
        @Param("caseId") UUID caseId,
        @Param("caseVersion") long caseVersion,
        @Param("payload") String payloadJson,
        @Param("headers") String headersJson
    );
}
```

```xml id="32gd4g"
<insert id="insertCaseSubmitted">
  INSERT INTO outbox_event (
      tenant_id,
      aggregate_type,
      aggregate_id,
      aggregate_version,
      event_type,
      event_version,
      payload,
      headers
  )
  VALUES (
      #{tenantId},
      'REGULATORY_CASE',
      #{caseId},
      #{caseVersion},
      'CASE_SUBMITTED',
      1,
      CAST(#{payload} AS jsonb),
      CAST(#{headers} AS jsonb)
  )
</insert>
```

Rule:

```text id="pzwfw7"
State mutation + history + audit + outbox harus commit bersama.
Event publish dilakukan setelah commit oleh worker.
```

---

# 12. Submit Service Transaction Boundary

```java id="vwh8f4"
public final class SubmitCaseService {
    private final SqlSessionFactory sqlSessionFactory;
    private final TransactionRetrier transactionRetrier;
    private final JsonWriter jsonWriter;

    public SubmitCaseService(
            SqlSessionFactory sqlSessionFactory,
            TransactionRetrier transactionRetrier,
            JsonWriter jsonWriter
    ) {
        this.sqlSessionFactory = sqlSessionFactory;
        this.transactionRetrier = transactionRetrier;
        this.jsonWriter = jsonWriter;
    }

    public CaseResponse submit(SubmitCaseCommand command) {
        return transactionRetrier.execute("SubmitCase", () -> submitOnce(command));
    }

    private CaseResponse submitOnce(SubmitCaseCommand command) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            try {
                DbSessionMapper db = session.getMapper(DbSessionMapper.class);
                CaseCommandMapper cases = session.getMapper(CaseCommandMapper.class);
                AuditMapper audit = session.getMapper(AuditMapper.class);
                OutboxMapper outbox = session.getMapper(OutboxMapper.class);

                db.setTransactionSafety();
                db.setRequestContext(
                    String.valueOf(command.tenantId()),
                    command.actorId(),
                    "USER",
                    command.requestId(),
                    command.correlationId(),
                    "POST /cases/{caseId}/submit"
                );

                SubmitCaseResultRow updated = cases.submitCase(
                    command.tenantId(),
                    command.caseId(),
                    command.expectedVersion(),
                    command.actorId()
                );

                if (updated == null) {
                    session.rollback();
                    throw new BusinessConflictException(
                        "CASE_NOT_SUBMITTABLE",
                        "Case is not in DRAFT state, version is stale, or case does not exist"
                    );
                }

                audit.insertStatusHistory(
                    command.tenantId(),
                    command.caseId(),
                    "DRAFT",
                    updated.status(),
                    "SUBMIT",
                    command.reason(),
                    command.actorId(),
                    command.requestId(),
                    command.correlationId()
                );

                String payload = jsonWriter.write(Map.of(
                    "tenantId", command.tenantId(),
                    "caseId", updated.caseId().toString(),
                    "caseNumber", updated.caseNumber(),
                    "status", updated.status(),
                    "version", updated.version(),
                    "submittedAt", updated.submittedAt().toString()
                ));

                String headers = jsonWriter.write(Map.of(
                    "correlationId", command.correlationId(),
                    "causationId", command.requestId()
                ));

                outbox.insertCaseSubmitted(
                    command.tenantId(),
                    command.caseId(),
                    updated.version(),
                    payload,
                    headers
                );

                session.commit();

                return new CaseResponse(
                    updated.tenantId(),
                    updated.caseId(),
                    updated.caseNumber(),
                    updated.status(),
                    updated.version()
                );
            } catch (RuntimeException e) {
                session.rollback();
                throw e;
            }
        }
    }
}
```

Pattern penting:

```text id="251umh"
1. openSession(false)
2. SET LOCAL safety + context
3. guarded update
4. 0-row → business conflict
5. insert history/outbox
6. commit
7. rollback on any exception
8. retry wrapper outside transaction attempt
```

---

# 13. Transaction Retry Wrapper

PostgreSQL documentation states that serialization failures use SQLSTATE `40001`, and applications using serializable/repeatable-read patterns must be prepared to retry the entire transaction. ([PostgreSQL](https://www.postgresql.org/docs/current/mvcc-serialization-failure-handling.html?utm_source=chatgpt.com)) PostgreSQL error codes also list `40P01` for deadlock detected and `55P03` for lock not available, while integrity constraint violations like unique, foreign key, and check violations are in class 23. ([PostgreSQL](https://www.postgresql.org/docs/current/errcodes-appendix.html))

```java id="za8q4e"
public final class TransactionRetrier {
    private static final Set<String> RETRYABLE_SQLSTATES = Set.of(
        "40001", // serialization_failure
        "40P01"  // deadlock_detected
    );

    private static final Set<String> BUSY_SQLSTATES = Set.of(
        "55P03"  // lock_not_available
    );

    private final int maxAttempts;
    private final Duration baseBackoff;

    public TransactionRetrier(int maxAttempts, Duration baseBackoff) {
        this.maxAttempts = maxAttempts;
        this.baseBackoff = baseBackoff;
    }

    public <T> T execute(String operationName, Supplier<T> operation) {
        RuntimeException lastError = null;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return operation.get();
            } catch (RuntimeException error) {
                String sqlState = SqlStateUtil.findSqlState(error).orElse(null);

                if (BUSY_SQLSTATES.contains(sqlState)) {
                    throw new ResourceBusyException(
                        "RESOURCE_BUSY",
                        "Resource is currently locked; retry later",
                        error
                    );
                }

                if (!RETRYABLE_SQLSTATES.contains(sqlState) || attempt == maxAttempts) {
                    throw error;
                }

                lastError = error;
                sleep(backoff(attempt));
            }
        }

        throw lastError;
    }

    private Duration backoff(int attempt) {
        long millis = baseBackoff.toMillis() * (1L << Math.min(attempt - 1, 4));
        long jitter = ThreadLocalRandom.current().nextLong(0, 50);
        return Duration.ofMillis(millis + jitter);
    }

    private void sleep(Duration duration) {
        try {
            Thread.sleep(duration.toMillis());
        } catch (InterruptedException interrupted) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted during transaction retry", interrupted);
        }
    }
}
```

SQLSTATE helper:

```java id="axrjk0"
public final class SqlStateUtil {
    private SqlStateUtil() {}

    public static Optional<String> findSqlState(Throwable error) {
        Throwable current = error;

        while (current != null) {
            if (current instanceof SQLException sqlException) {
                return Optional.ofNullable(sqlException.getSQLState());
            }
            current = current.getCause();
        }

        return Optional.empty();
    }
}
```

Rule:

```text id="7pvsl0"
Retry harus mengulang seluruh transaction attempt.
Jangan retry statement terakhir saja.
External side effect harus setelah commit atau lewat outbox.
```

---

# 14. SQLSTATE to Domain/API Mapping

```java id="y7b7c2"
public final class DatabaseErrorMapper {
    public RuntimeException map(RuntimeException error) {
        String sqlState = SqlStateUtil.findSqlState(error).orElse(null);

        if (sqlState == null) {
            return error;
        }

        return switch (sqlState) {
            case "23505" -> new BusinessConflictException(
                "DUPLICATE_VALUE",
                "A unique business rule was violated",
                error
            );
            case "23503" -> new BusinessConflictException(
                "REFERENCE_NOT_FOUND_OR_IN_USE",
                "Related data is missing or still referenced",
                error
            );
            case "23514" -> new ValidationException(
                "CHECK_CONSTRAINT_VIOLATION",
                "Submitted data violates a database rule",
                error
            );
            case "23502" -> new ValidationException(
                "NOT_NULL_VIOLATION",
                "Required data is missing",
                error
            );
            case "23P01" -> new BusinessConflictException(
                "EXCLUSION_CONSTRAINT_VIOLATION",
                "Requested period/range overlaps existing data",
                error
            );
            case "40001", "40P01" -> new RetryExhaustedException(
                "TRANSACTION_RETRY_EXHAUSTED",
                "Transaction could not be completed after retries",
                error
            );
            case "55P03" -> new ResourceBusyException(
                "RESOURCE_BUSY",
                "Resource is currently locked",
                error
            );
            case "57014" -> new ServiceTimeoutException(
                "DATABASE_STATEMENT_TIMEOUT",
                "Database statement timed out",
                error
            );
            case "53300" -> new ServiceUnavailableException(
                "TOO_MANY_DATABASE_CONNECTIONS",
                "Database connection limit reached",
                error
            );
            default -> error;
        };
    }
}
```

Mapping ke HTTP:

| Condition | SQLSTATE/signal | HTTP |
|---|---|---:|
| stale version / invalid state | 0-row guarded update | `409 Conflict` |
| duplicate business key | `23505` | `409 Conflict` |
| FK invalid | `23503` | `409` or `404` depending context |
| check violation | `23514` | `400 Bad Request` |
| lock not available | `55P03` | `423 Locked` or `409` |
| statement timeout | `57014` | `503` or `504` |
| retry exhausted | `40001` / `40P01` after retry | `503` or `409` |
| missing resource | explicit null read | `404 Not Found` |

---

# 15. Jersey ExceptionMapper

```java id="6v5cz1"
@Provider
public final class DomainExceptionMapper implements ExceptionMapper<DomainException> {
    private final RequestContextProvider contextProvider;

    public DomainExceptionMapper(RequestContextProvider contextProvider) {
        this.contextProvider = contextProvider;
    }

    @Override
    public Response toResponse(DomainException exception) {
        RequestContext ctx = contextProvider.currentOrEmpty();

        ErrorResponse error = new ErrorResponse(
            exception.code(),
            exception.getMessage(),
            ctx.requestId(),
            ctx.correlationId(),
            exception.details()
        );

        return Response
            .status(toStatus(exception))
            .entity(error)
            .type(MediaType.APPLICATION_JSON_TYPE)
            .build();
    }

    private Response.Status toStatus(DomainException exception) {
        if (exception instanceof ValidationException) {
            return Response.Status.BAD_REQUEST;
        }
        if (exception instanceof NotFoundException) {
            return Response.Status.NOT_FOUND;
        }
        if (exception instanceof BusinessConflictException) {
            return Response.Status.CONFLICT;
        }
        if (exception instanceof ResourceBusyException) {
            return Response.Status.CONFLICT;
        }
        if (exception instanceof ServiceUnavailableException) {
            return Response.Status.SERVICE_UNAVAILABLE;
        }
        return Response.Status.INTERNAL_SERVER_ERROR;
    }
}
```

Fallback:

```java id="gdbcar"
@Provider
public final class ThrowableExceptionMapper implements ExceptionMapper<Throwable> {
    private final RequestContextProvider contextProvider;

    public ThrowableExceptionMapper(RequestContextProvider contextProvider) {
        this.contextProvider = contextProvider;
    }

    @Override
    public Response toResponse(Throwable exception) {
        RequestContext ctx = contextProvider.currentOrEmpty();

        // log full exception internally with request/correlation id

        ErrorResponse error = new ErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "Unexpected server error",
            ctx.requestId(),
            ctx.correlationId(),
            Map.of()
        );

        return Response
            .status(Response.Status.INTERNAL_SERVER_ERROR)
            .entity(error)
            .type(MediaType.APPLICATION_JSON_TYPE)
            .build();
    }
}
```

---

# 16. Idempotency for Create POST

Schema:

```sql id="kj4xca"
CREATE TABLE idempotency_request (
    tenant_id         bigint NOT NULL,
    idempotency_key  text NOT NULL,
    command_name     text NOT NULL,
    request_hash     text NOT NULL,
    status           text NOT NULL DEFAULT 'PROCESSING',
    response_code    integer,
    response_body    jsonb,
    created_at       timestamptz NOT NULL DEFAULT clock_timestamp(),
    completed_at     timestamptz,
    last_error       text,

    CONSTRAINT pk_idempotency_request
        PRIMARY KEY (tenant_id, idempotency_key, command_name),

    CONSTRAINT chk_idempotency_request__status
        CHECK (status IN ('PROCESSING', 'COMPLETED', 'FAILED'))
);
```

Mapper:

```xml id="txccto"
<select id="startIdempotency" resultMap="IdempotencyStartMap">
  INSERT INTO idempotency_request (
      tenant_id,
      idempotency_key,
      command_name,
      request_hash,
      status
  )
  VALUES (
      #{tenantId},
      #{idempotencyKey},
      #{commandName},
      #{requestHash},
      'PROCESSING'
  )
  ON CONFLICT (tenant_id, idempotency_key, command_name)
  DO NOTHING
  RETURNING
      tenant_id,
      idempotency_key,
      command_name,
      request_hash,
      status
</select>
```

Read existing:

```xml id="jdrux9"
<select id="findIdempotency" resultMap="IdempotencyRowMap">
  SELECT
      tenant_id,
      idempotency_key,
      command_name,
      request_hash,
      status,
      response_code,
      response_body,
      completed_at
  FROM idempotency_request
  WHERE tenant_id = #{tenantId}
    AND idempotency_key = #{idempotencyKey}
    AND command_name = #{commandName}
</select>
```

Complete:

```xml id="ev8n1s"
<update id="completeIdempotency">
  UPDATE idempotency_request
  SET status = 'COMPLETED',
      response_code = #{responseCode},
      response_body = CAST(#{responseBodyJson} AS jsonb),
      completed_at = clock_timestamp(),
      last_error = NULL
  WHERE tenant_id = #{tenantId}
    AND idempotency_key = #{idempotencyKey}
    AND command_name = #{commandName}
    AND request_hash = #{requestHash}
    AND status = 'PROCESSING'
</update>
```

Rule:

```text id="c6vz6c"
Idempotency row, business insert, audit, outbox, dan cached response harus commit bersama.
```

---

# 17. Create Service with Idempotency

```java id="yynzzm"
public final class CreateCaseService {
    private final SqlSessionFactory sqlSessionFactory;
    private final DatabaseErrorMapper databaseErrorMapper;
    private final JsonWriter jsonWriter;

    public CaseResponse create(CreateCaseCommand command) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            try {
                DbSessionMapper db = session.getMapper(DbSessionMapper.class);
                IdempotencyMapper idem = session.getMapper(IdempotencyMapper.class);
                CaseCommandMapper cases = session.getMapper(CaseCommandMapper.class);
                OutboxMapper outbox = session.getMapper(OutboxMapper.class);

                db.setTransactionSafety();
                db.setRequestContext(
                    String.valueOf(command.tenantId()),
                    command.actorId(),
                    "USER",
                    command.requestId(),
                    command.correlationId(),
                    "POST /cases"
                );

                IdempotencyStartRow started = idem.startIdempotency(
                    command.tenantId(),
                    command.idempotencyKey(),
                    "CREATE_CASE",
                    command.requestHash()
                );

                if (started == null) {
                    IdempotencyRow existing = idem.findIdempotency(
                        command.tenantId(),
                        command.idempotencyKey(),
                        "CREATE_CASE"
                    );

                    session.rollback();

                    if (!existing.requestHash().equals(command.requestHash())) {
                        throw new BusinessConflictException(
                            "IDEMPOTENCY_KEY_REUSED",
                            "Idempotency key was reused with different request body"
                        );
                    }

                    if ("COMPLETED".equals(existing.status())) {
                        return jsonWriter.read(existing.responseBody(), CaseResponse.class);
                    }

                    throw new ResourceBusyException(
                        "REQUEST_STILL_PROCESSING",
                        "Request with this idempotency key is still processing"
                    );
                }

                CaseRow inserted = cases.insertCase(
                    command.tenantId(),
                    command.title(),
                    command.priority(),
                    command.actorId()
                );

                CaseResponse response = new CaseResponse(
                    inserted.tenantId(),
                    inserted.caseId(),
                    inserted.caseNumber(),
                    inserted.status(),
                    inserted.version()
                );

                outbox.insertCaseCreated(
                    command.tenantId(),
                    inserted.caseId(),
                    inserted.version(),
                    jsonWriter.write(Map.of(
                        "tenantId", inserted.tenantId(),
                        "caseId", inserted.caseId().toString(),
                        "caseNumber", inserted.caseNumber(),
                        "status", inserted.status(),
                        "version", inserted.version()
                    )),
                    jsonWriter.write(Map.of(
                        "correlationId", command.correlationId(),
                        "causationId", command.requestId()
                    ))
                );

                idem.completeIdempotency(
                    command.tenantId(),
                    command.idempotencyKey(),
                    "CREATE_CASE",
                    command.requestHash(),
                    201,
                    jsonWriter.write(response)
                );

                session.commit();
                return response;
            } catch (RuntimeException e) {
                session.rollback();
                throw databaseErrorMapper.map(e);
            }
        }
    }
}
```

---

# 18. Keyset Pagination Mapper

Request:

```java id="59mtae"
public record CaseSearchCommand(
    long tenantId,
    String status,
    String cursor,
    int limit
) {}
```

SQL:

```xml id="k7w9kd"
<select id="searchCases" resultMap="CaseListItemMap">
  SELECT
      tenant_id,
      case_id,
      case_number,
      status,
      title,
      priority,
      created_at,
      version
  FROM regulatory_case
  WHERE tenant_id = #{tenantId}
    AND deleted_at IS NULL
    <if test="status != null">
      AND status = #{status}
    </if>
    <if test="lastCreatedAt != null and lastCaseId != null">
      AND (created_at, case_id) &lt; (#{lastCreatedAt}, #{lastCaseId})
    </if>
  ORDER BY created_at DESC, case_id DESC
  LIMIT #{limitPlusOne}
</select>
```

Service:

```java id="pwef6z"
public CaseSearchResult search(CaseSearchCommand command) {
    int limit = Math.min(Math.max(command.limit(), 1), 100);
    Cursor decoded = Cursor.decode(command.cursor());

    try (SqlSession session = replicaOrPrimary(command).openSession(true)) {
        CaseQueryMapper mapper = session.getMapper(CaseQueryMapper.class);

        List<CaseListItemRow> rows = mapper.searchCases(
            command.tenantId(),
            command.status(),
            decoded.lastCreatedAt(),
            decoded.lastCaseId(),
            limit + 1
        );

        boolean hasMore = rows.size() > limit;
        List<CaseListItemRow> page = hasMore ? rows.subList(0, limit) : rows;

        String nextCursor = null;
        if (hasMore) {
            CaseListItemRow last = page.get(page.size() - 1);
            nextCursor = Cursor.encode(last.createdAt(), last.caseId());
        }

        return new CaseSearchResult(
            page.stream().map(CaseListItem::from).toList(),
            hasMore,
            nextCursor
        );
    }
}
```

Rule:

```text id="v1e1p3"
Large OLTP list:
- keyset pagination
- deterministic ORDER BY
- unique tie-breaker
- LIMIT bounded
- projection explicit
- index aligned
```

---

# 19. Outbox Publisher Worker

Claim SQL:

```xml id="p3xnkm"
<select id="claimOutboxEvents" resultMap="OutboxEventMap">
  WITH candidate AS (
      SELECT
          tenant_id,
          outbox_id
      FROM outbox_event
      WHERE tenant_id = #{tenantId}
        AND status = 'NEW'
        AND available_at &lt;= clock_timestamp()
      ORDER BY available_at ASC, created_at ASC, outbox_id ASC
      LIMIT #{batchSize}
      FOR UPDATE SKIP LOCKED
  )
  UPDATE outbox_event e
  SET status = 'PROCESSING',
      locked_by = #{workerId},
      locked_at = clock_timestamp(),
      lock_token = uuidv7(),
      attempt_count = attempt_count + 1
  FROM candidate c
  WHERE e.tenant_id = c.tenant_id
    AND e.outbox_id = c.outbox_id
  RETURNING
      e.tenant_id,
      e.outbox_id,
      e.aggregate_type,
      e.aggregate_id,
      e.event_type,
      e.event_version,
      e.payload,
      e.headers,
      e.lock_token,
      e.attempt_count,
      e.max_attempts
</select>
```

Worker skeleton:

```java id="7dyhtv"
public final class OutboxPublisher implements Runnable {
    private final SqlSessionFactory sqlSessionFactory;
    private final EventPublisher publisher;
    private final String workerId;

    @Override
    public void run() {
        while (!Thread.currentThread().isInterrupted()) {
            List<OutboxEventRow> events = claim(1001L, 50);

            if (events.isEmpty()) {
                sleep(500);
                continue;
            }

            for (OutboxEventRow event : events) {
                publishOne(event);
            }
        }
    }

    private List<OutboxEventRow> claim(long tenantId, int batchSize) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            OutboxMapper mapper = session.getMapper(OutboxMapper.class);
            List<OutboxEventRow> rows = mapper.claimOutboxEvents(
                tenantId,
                workerId,
                batchSize
            );
            session.commit();
            return rows;
        }
    }

    private void publishOne(OutboxEventRow event) {
        try {
            publisher.publish(event.eventType(), event.payload(), event.headers());
            markPublished(event);
        } catch (Exception e) {
            markRetryOrFailed(event, e);
        }
    }
}
```

PostgreSQL row locking supports `FOR UPDATE` and `SKIP LOCKED`; `SKIP LOCKED` is especially suitable for queue-like workloads because competing workers can skip rows already locked by other workers rather than block. ([PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html))

Rule:

```text id="l61ot0"
Outbox worker:
- claim short transaction
- publish outside transaction
- mark result short transaction
- use lock_token
- consumer must be idempotent
```

---

# 20. pgJDBC and Connection Pool Baseline

pgJDBC supports server-side prepared statements and caches prepared statements per connection; the documentation describes `prepareThreshold`, `preparedStatementCacheQueries`, and `preparedStatementCacheSizeMiB` as relevant settings. ([pgJDBC](https://jdbc.postgresql.org/documentation/server-prepare/)) pgJDBC also documents connection/default fetch size behavior and driver options for PostgreSQL JDBC usage. ([pgJDBC](https://jdbc.postgresql.org/documentation/use/?utm_source=chatgpt.com))

Hikari/JDBC properties example:

```properties id="8u2v4f"
dataSourceClassName=org.postgresql.ds.PGSimpleDataSource
dataSource.serverName=db-host
dataSource.portNumber=5432
dataSource.databaseName=appdb
dataSource.user=app_runtime
dataSource.password=${DB_PASSWORD}
dataSource.ApplicationName=case-service

maximumPoolSize=10
minimumIdle=2
connectionTimeout=3000
validationTimeout=1000
idleTimeout=600000
maxLifetime=1800000
leakDetectionThreshold=10000

dataSource.prepareThreshold=5
dataSource.preparedStatementCacheQueries=256
dataSource.preparedStatementCacheSizeMiB=5
dataSource.reWriteBatchedInserts=true
```

Rule:

```text id="euihj4"
Pool size = database concurrency budget.
Bukan tombol ajaib untuk mempercepat query lambat.
```

---

# 21. Observability Contract

Minimum log fields:

```text id="efwzef"
request_id
correlation_id
tenant_id
actor_id
endpoint
service_method
mapper_id
sqlstate
constraint_name
duration_ms
retry_attempt
pool_wait_ms
db_time_ms
result_count
```

Example structured log:

```json id="26hsih"
{
  "level": "WARN",
  "event": "database_conflict",
  "service": "case-service",
  "endpoint": "POST /cases/{caseId}/submit",
  "operation": "SubmitCase",
  "mapper": "CaseCommandMapper.submitCase",
  "tenantId": 1001,
  "caseId": "019535d9-3df7-79fb-b466-fa907fa17f9e",
  "sqlState": "23505",
  "constraint": "uq_regulatory_case__case_number",
  "requestId": "req-123",
  "correlationId": "corr-456",
  "durationMs": 42
}
```

PostgreSQL error reports can include database object names like constraint names for certain errors, especially integrity constraint violations, so application logs should capture SQLSTATE and constraint name when available. ([PostgreSQL](https://www.postgresql.org/docs/current/errcodes-appendix.html))

---

# 22. Health Queries to Keep in Runbook

Active DB sessions:

```sql id="p216q6"
SELECT
    application_name,
    state,
    wait_event_type,
    wait_event,
    count(*) AS session_count,
    max(now() - xact_start) AS max_xact_age,
    max(now() - query_start) AS max_query_age
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY application_name, state, wait_event_type, wait_event
ORDER BY session_count DESC;
```

Blockers:

```sql id="jsx7lc"
SELECT
    blocked.pid AS blocked_pid,
    now() - blocked.query_start AS blocked_for,
    left(blocked.query, 500) AS blocked_query,
    blocker.pid AS blocker_pid,
    blocker.state AS blocker_state,
    now() - blocker.xact_start AS blocker_xact_age,
    left(blocker.query, 500) AS blocker_query
FROM pg_stat_activity blocked
JOIN LATERAL unnest(pg_blocking_pids(blocked.pid)) AS bpid(blocker_pid)
    ON true
JOIN pg_stat_activity blocker
    ON blocker.pid = bpid.blocker_pid;
```

Dead tuples:

```sql id="lzyloj"
SELECT
    relname,
    n_live_tup,
    n_dead_tup,
    last_autovacuum,
    last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC
LIMIT 30;
```

Outbox lag:

```sql id="pphsd5"
SELECT
    tenant_id,
    event_type,
    status,
    count(*) AS event_count,
    min(created_at) AS oldest_created_at,
    max(attempt_count) AS max_attempts
FROM outbox_event
GROUP BY tenant_id, event_type, status
ORDER BY tenant_id, event_type, status;
```

---

# 23. Production-Ready Command Checklist

| Checklist | Done? |
|---|---|
| Command has request id/correlation id |  |
| Service owns transaction boundary |  |
| `openSession(false)` for command |  |
| `SET LOCAL` timeout/context set |  |
| Guarded mutation uses expected state/version |  |
| 0-row result mapped to domain conflict |  |
| Constraint SQLSTATE mapped |  |
| History/audit inserted if needed |  |
| Outbox inserted for integration event |  |
| Idempotency key for retry-safe POST |  |
| External side effect not inside transaction |  |
| Retry wrapper only for `40001`/`40P01` |  |
| SQL projection explicit |  |
| Index exists for query shape |  |
| Logs include SQLSTATE/constraint/mapper/request |  |
| Metrics expose latency/error/retry/pool |  |
| Integration test covers conflict and duplicate |  |

---

# 24. Integration Tests Worth Having

```text id="6ahb25"
1. create case success
2. create case duplicate idempotency same body returns same response
3. create case duplicate idempotency different body returns 409
4. submit DRAFT success
5. submit stale version returns 409
6. submit already SUBMITTED returns 409
7. duplicate business key maps 409
8. CHECK violation maps 400
9. outbox row exists after command commit
10. outbox row absent after transaction rollback
11. SQLSTATE 40001 retry wrapper retries whole transaction
12. lock busy maps resource busy
13. keyset pagination stable with tie-breaker
14. RLS/tenant context prevents cross-tenant read/write
15. migration compatibility: old mapper works with expanded schema
```

For PostgreSQL integration tests, prefer real PostgreSQL via container/test environment rather than mocking SQL behavior, because constraints, locking, `RETURNING`, SQLSTATE, `jsonb`, and transaction behavior are database-specific.

---

# 25. Anti-Pattern Penutup

## Anti-pattern 1 - Generic repository hides SQL shape

```text id="gw02d8"
repository.update(case)
repository.save(case)
repository.find(filters)
```

Masalah:

```text id="mdwy4z"
- SQL tidak jelas
- index review sulit
- concurrency guard hilang
- 0-row semantics tidak eksplisit
```

---

## Anti-pattern 2 - External call inside DB transaction

```text id="stfav4"
BEGIN
  update case
  call external service
  insert outbox maybe
COMMIT
```

Solusi:

```text id="p8up4m"
BEGIN
  update case
  insert outbox
COMMIT

worker publishes after commit
```

---

## Anti-pattern 3 - Blind retry semua exception

Buruk:

```text id="xu0ipo"
retry SQLException apapun
```

Benar:

```text id="2w531y"
retry transaction only for known transient/retryable SQLSTATE:
- 40001
- 40P01

treat constraint violations as business/data errors.
```

---

## Anti-pattern 4 - Mapper query list tanpa pagination contract

```text id="xp7nwl"
SELECT * FROM regulatory_case WHERE tenant_id = ?
```

Benar:

```text id="pshatk"
explicit projection
required filters
keyset pagination
bounded limit
matching index
```

---

## Anti-pattern 5 - Rely only on Java validation

```text id="8bptc3"
Java checks uniqueness before insert.
No unique constraint.
```

Race condition tetap bisa terjadi.

Benar:

```text id="0slz9t"
Java validation for friendly error.
PostgreSQL constraint for final invariant.
```

---

## Anti-pattern 6 - App logs only “database error”

Minimal harus ada:

```text id="hj5c7r"
SQLSTATE
constraint name if any
mapper id
tenant id
request/correlation id
operation name
```

---

# 26. Final Production Template Summary

```text id="k5rwgb"
HTTP Request
│
├─ Jersey Filter
│  ├─ authenticate
│  ├─ tenant_id
│  ├─ actor_id
│  ├─ request_id
│  └─ correlation_id
│
├─ Jersey Resource
│  ├─ parse request
│  ├─ build command
│  └─ call service
│
├─ Service
│  ├─ retry wrapper
│  ├─ open SqlSession(false)
│  ├─ SET LOCAL safety/context
│  ├─ guarded mutation
│  ├─ audit/history
│  ├─ outbox
│  ├─ idempotency if needed
│  ├─ commit
│  └─ rollback on error
│
├─ MyBatis Mapper
│  ├─ explicit SQL
│  ├─ RETURNING
│  ├─ resultMap
│  └─ safe dynamic SQL
│
├─ PostgreSQL
│  ├─ constraints
│  ├─ indexes
│  ├─ transaction isolation
│  ├─ locks
│  ├─ SQLSTATE
│  └─ WAL durability
│
└─ Observability
   ├─ logs
   ├─ metrics
   ├─ traces
   ├─ pg_stat_activity
   ├─ pg_stat_statements
   └─ outbox/queue lag
```

---

# 27. Roadmap Setelah Seri OLTP Ini

Setelah 22 seri OLTP ini, urutan lanjutan yang tidak mengulang materi dan paling relevan untuk onboarding adalah:

```text id="vnj2ri"
1. PostgreSQL OLTP Hands-on Labs:
   build mini case-management service dengan Java/Jersey/MyBatis.

2. PostgreSQL Production Review Checklist:
   review schema, index, transaction, migration, vacuum, security, backup.

3. PostgreSQL Incident Playbook:
   lock incident, slow query, connection pool exhaustion, WAL disk full, replication lag.

4. PostgreSQL + MyBatis SQL Review Practice:
   baca mapper XML dan tentukan index/transaction/error mapping.

5. Java/Jersey/MyBatis Integration Testing with PostgreSQL:
   Testcontainers-style integration test, transaction conflict, SQLSTATE, outbox worker.
```

---

# 28. Ringkasan Akhir Seri 22

```text id="s3csh6"
1. Service layer adalah transaction boundary utama.
2. MyBatis mapper harus eksplisit per use case, bukan generic repository.
3. PostgreSQL constraint adalah final invariant guard.
4. Guarded UPDATE + RETURNING adalah pola utama OLTP command.
5. 0-row mutation adalah business conflict signal.
6. SQLSTATE harus dimapping ke domain/API error.
7. Retry hanya untuk transaction-level transient errors seperti 40001 dan 40P01.
8. Idempotency wajib untuk retry-safe POST.
9. Outbox wajib untuk external side effect setelah commit.
10. Keyset pagination wajib untuk list besar.
11. Connection/session safety harus memakai timeout dan SET LOCAL context.
12. Observability harus menyambungkan endpoint, mapper, SQLSTATE, constraint, tenant, dan request id.
13. Integration test harus memakai PostgreSQL nyata agar locking, constraints, SQLSTATE, jsonb, dan transaction behavior tervalidasi.
```

---

# Status Seri

**Seri 22/22 selesai.**

Dengan ini, **seluruh seri PostgreSQL OLTP selesai**. Terima kasih juga - seri ini sudah lengkap dari foundation transaksi sampai integration pattern Java/Jersey/MyBatis production-grade.

---

**Sources:**

- [Java API - MyBatis 3](https://mybatis.org/mybatis-3/java-api.html?utm_source=chatgpt.com)
- [PostgreSQL: Documentation: 18: Appendix A. PostgreSQL Error Codes](https://www.postgresql.org/docs/current/errcodes-appendix.html)
- [Jakarta RESTful Web Services](https://jakarta.ee/specifications/restful-ws/3.0/jakarta-restful-ws-spec-3.0.html?utm_source=chatgpt.com)
- [Eclipse Jersey](https://jersey.github.io/?utm_source=chatgpt.com)
- [Jersey 2.47 User Guide](https://eclipse-ee4j.github.io/jersey.github.io/documentation/latest/user-guide.html?utm_source=chatgpt.com)
- [PostgreSQL® Extensions to the JDBC API | pgJDBC](https://jdbc.postgresql.org/documentation/server-prepare/)



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)