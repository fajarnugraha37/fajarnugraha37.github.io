# postgresql-time-series

**User:** Anonymous  
**Created:** 7/15/2026 19:50:02  
**Updated:** 7/15/2026 21:07:37  
**Exported:** 7/15/2026 21:25:34  
**Link:** [https://chatgpt.com/g/g-p-6a539ddc858881919467b6da20df4567-cheatsheet/c/6a5781f6-29a8-83ec-adec-599a4d13eef7](https://chatgpt.com/g/g-p-6a539ddc858881919467b6da20df4567-cheatsheet/c/6a5781f6-29a8-83ec-adec-599a4d13eef7)  

## Response:
7/15/2026, 7:50:41 PM

Saya akan buat sebagai peta kemampuan praktis PostgreSQL untuk workload time-series, dengan pemisahan jelas antara fitur native PostgreSQL, pola desain schema/query, dan opsi ekstensi seperti TimescaleDB agar tidak tercampur.

Saya sudah cek dokumentasi PostgreSQL dan ekosistem terkait yang relevan. Kerangka di bawah akan saya posisikan sebagai onboarding map: apa yang harus dipahami dulu, kapan cukup native PostgreSQL, dan kapan ekstensi time-series layak dipertimbangkan.

## Introduction

**PostgreSQL sebagai time-series database** berarti menggunakan PostgreSQL untuk menyimpan data yang dominan berbentuk **timestamp + entity/sensor/source + metric/value/event**, dengan pola umum: **append-heavy ingest**, query berbasis **rentang waktu**, agregasi per interval, retensi data lama, downsampling, dan optimasi storage.

Secara native, PostgreSQL sudah punya fondasi penting untuk workload ini: **range partitioning**, index seperti **B-tree/BRIN**, `date_bin`, `date_trunc`, `generate_series`, window functions, materialized view, `COPY`, dan monitoring internal. Declarative partitioning membagi table menjadi partition fisik, dan cocok untuk data yang sering diakses berdasarkan rentang waktu serta perlu dihapus per periode retensi. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html))

Untuk workload time-series yang lebih berat, **TimescaleDB** bisa dipertimbangkan karena menyediakan hypertable, automatic chunking, continuous aggregate, retention, compression/columnstore, dan lifecycle policy di atas PostgreSQL. Hypertable adalah table PostgreSQL dengan fitur khusus untuk real-time analytics pada time-series/event data, sedangkan continuous aggregate membantu menjaga agregasi berjalan di background. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/hypertables/))

---

## Diagram

```text
PostgreSQL Time-Series Database
│
├─ 1. Workload & Time Semantics
│  ├─ metric vs event vs state history
│  ├─ event_time vs ingest_time
│  ├─ timezone, clock skew, late-arriving data
│  └─ retention SLA, query SLA, freshness SLA
│
├─ 2. Data Modeling
│  ├─ narrow metric table
│  ├─ wide fact table
│  ├─ event log table
│  ├─ dimension/tag modeling
│  └─ deduplication & idempotency key
│
├─ 3. Physical Layout
│  ├─ native RANGE partitioning by time
│  ├─ subpartition by tenant/source/device
│  ├─ pg_partman automation
│  └─ TimescaleDB hypertable/chunking
│
├─ 4. Indexing Strategy
│  ├─ B-tree: recent lookup, entity + timestamp
│  ├─ BRIN: huge append-ordered tables
│  ├─ partial indexes: hot/recent data
│  ├─ covering indexes: dashboard queries
│  └─ JSONB/GIN only when tags are flexible
│
├─ 5. Ingestion Path
│  ├─ JDBC batch / MyBatis batch
│  ├─ COPY / staging table
│  ├─ upsert / ON CONFLICT
│  ├─ backfill handling
│  └─ validation & rejection path
│
├─ 6. Query & Analytics
│  ├─ range query
│  ├─ bucket aggregation
│  ├─ rolling window
│  ├─ gap filling
│  ├─ last-known-value
│  └─ anomaly/trend query
│
├─ 7. Pre-Aggregation & Downsampling
│  ├─ materialized views
│  ├─ scheduled refresh
│  ├─ TimescaleDB continuous aggregates
│  └─ multi-resolution rollups
│
├─ 8. Lifecycle & Operations
│  ├─ retention/drop old partition/chunk
│  ├─ vacuum/autovacuum
│  ├─ backup/restore/PITR
│  ├─ monitoring pg_stat*
│  └─ capacity planning
│
└─ 9. Integration Patterns
   ├─ Java/Jersey ingestion API
   ├─ MyBatis mapper/query layer
   ├─ Kafka/RabbitMQ/Redis ingestion buffer
   ├─ dashboard/reporting API
   └─ alerting/anomaly workflow
```

---

## Tabular Decomposition Map

| Area | Practical skill | Yang perlu dipahami | Production focus |
|---|---|---|---|
| **Workload classification** | Bedakan metric, event, state history, audit trail, observability signal | Time-series bukan hanya “ada timestamp”; karakter pentingnya adalah ingest rate, cardinality entity, retention, query range, dan agregasi | Jangan desain semua sebagai satu table generik kalau pola query dan lifecycle berbeda |
| **Time semantics** | Pilih `timestamptz`, `timestamp`, event time, ingest time | `date_bin` bisa membucket timestamp ke interval arbitrary, sedangkan `date_trunc` cocok untuk boundary standar seperti hour/day/month. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-datetime.html)) | Simpan event time dan ingest time bila data bisa telat masuk, replay, atau backfill |
| **Schema pattern: narrow metric table** | Model seperti `(ts, entity_id, metric_name, value, tags)` | Fleksibel untuk banyak metric, tetapi query bisa lebih mahal karena butuh filter `metric_name` dan pivot | Cocok untuk observability/IoT generic metric, bukan semua domain business fact |
| **Schema pattern: wide fact table** | Model seperti `(ts, device_id, cpu, memory, temperature, status)` | Lebih cepat untuk query dashboard stabil karena column jelas | Cocok jika metric set relatif stabil dan query sering mengambil beberapa metric sekaligus |
| **Schema pattern: event table** | Model append-only event dengan payload | Untuk clickstream, lifecycle event, workflow event, sensor event | Pisahkan event immutable dari snapshot/current-state table |
| **Dimension/tag modeling** | Tentukan mana yang column normal, FK dimension table, atau JSONB tags | Tag dengan cardinality tinggi bisa merusak index selectivity dan membuat query tidak stabil | Untuk filter utama seperti tenant, device, region, status: jadikan column eksplisit |
| **Partitioning native** | Gunakan `PARTITION BY RANGE (time_column)` | PostgreSQL declarative partitioning membagi partitioned table menjadi partition fisik, dan row diarahkan berdasarkan partition key. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html)) | Umumnya partition per hari/minggu/bulan tergantung volume, retention, dan query window |
| **Partition retention** | Drop/detach partition lama | PostgreSQL docs memberi contoh time partition bulanan untuk memudahkan penghapusan data lama. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html)) | Drop partition jauh lebih aman dan cepat daripada delete jutaan row, tapi perlu backup/retention policy jelas |
| **Partition automation** | Pakai automation untuk membuat future partition dan menghapus old partition | `pg_partman` mengelola time-based dan number-based partition set, serta membantu maintenance child table dan retention. ([GitHub](https://github.com/pgpartman/pg_partman)) | Hindari incident “insert gagal karena partition masa depan belum dibuat” |
| **TimescaleDB hypertable** | Gunakan hypertable bila ekstensi diizinkan dan workload TSDB berat | Hypertable adalah PostgreSQL table dengan automatic partitioning by time dan optional dimension lain. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/hypertables/)) | Cocok untuk high-ingest, chunk management, retention, compression, dan rollup yang sering |
| **Index: B-tree** | Index `(entity_id, ts DESC)` atau `(tenant_id, ts DESC)` | PostgreSQL menyediakan beberapa index method termasuk B-tree, hash, GiST, SP-GiST, GIN, dan BRIN. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createindex.html)) | Pakai untuk lookup recent data per entity, dashboard latest reading, pagination by time |
| **Index: BRIN** | Pakai BRIN untuk table sangat besar yang secara fisik berkorelasi dengan waktu | BRIN didesain untuk very large tables ketika column punya korelasi natural dengan physical location; ini cocok untuk append-ordered timestamp. ([PostgreSQL](https://www.postgresql.org/docs/current/brin.html)) | BRIN kecil dan murah, tapi bukan pengganti B-tree untuk lookup highly selective |
| **Partial/covering index** | Buat index khusus untuk hot window atau query utama | `CREATE INDEX` mendukung partial index dengan `WHERE`, expression index, dan `INCLUDE`. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createindex.html)) | Jangan index semua kombinasi; ukur dengan `EXPLAIN ANALYZE` dan workload nyata |
| **Bulk ingestion** | Gunakan `COPY`, staging table, atau batch insert | `COPY FROM` mengimpor data dari file/stdin ke table; PostgreSQL 18 docs juga mencatat opsi error handling seperti `ON_ERROR` dan `REJECT_LIMIT`. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-copy.html)) | Untuk Java service: batch kecil untuk API online, `COPY`/staging untuk bulk/backfill |
| **Idempotent ingestion** | Gunakan unique key dan `ON CONFLICT` | `ON CONFLICT DO NOTHING/DO UPDATE` adalah mekanisme PostgreSQL untuk alternatif saat unique/exclusion constraint conflict, dan menjamin atomic insert/update outcome. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-insert.html)) | Penting untuk retry, replay Kafka/RabbitMQ, duplicate sensor data, dan exactly-once illusion |
| **Bucket aggregation** | Query per menit/jam/hari | Gunakan `date_bin` untuk bucket arbitrary seperti 5 menit/15 menit; gunakan `date_trunc` untuk bucket kalender standar. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-datetime.html)) | Pastikan bucket boundary, timezone, dan origin konsisten antara backend dan dashboard |
| **Gap filling** | Buat deret waktu lengkap lalu left join data aktual | `generate_series` mendukung timestamp/timestamptz dengan step interval, sehingga bisa dipakai membuat slot waktu kosong. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-srf.html)) | Penting untuk chart agar missing data tidak terlihat sebagai zero tanpa sengaja |
| **Window analytics** | Rolling average, delta, lag/lead, rank, rate-of-change | Window functions menghitung across row set yang terkait dengan current row dan dipakai dengan `OVER`. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-window.html)) | Untuk alerting: bedakan spike sesaat, moving average, sustained breach |
| **Materialized view** | Precompute expensive aggregation | PostgreSQL materialized view menyimpan hasil query seperti relation dan bisa di-refresh dengan `REFRESH MATERIALIZED VIEW`; hasilnya bisa lebih cepat tetapi tidak selalu current. ([PostgreSQL](https://www.postgresql.org/docs/current/rules-materializedviews.html)) | Cocok untuk report periodik, bukan real-time dashboard dengan freshness ketat |
| **Continuous aggregate** | Incremental rollup dengan TimescaleDB | TimescaleDB continuous aggregate diperbarui background saat data baru masuk/berubah, dan maintenance-nya lebih rendah dibanding refresh penuh materialized view. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/)) | Cocok untuk rollup menit→jam→hari pada data volume besar |
| **Retention & downsampling** | Simpan raw data pendek, aggregate lebih lama | Timescale docs menjelaskan data retention untuk menghapus data lama dan bisa dikombinasikan dengan continuous aggregates untuk downsampling. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/data-retention/)) | Desain policy: raw 7/30/90 hari, hourly 1 tahun, daily beberapa tahun |
| **Vacuum/autovacuum** | Jaga table/index tetap sehat | PostgreSQL membutuhkan VACUUM reguler untuk reuse disk space, update planner statistics, visibility map, dan mencegah wraparound. ([PostgreSQL](https://www.postgresql.org/docs/current/routine-vacuuming.html)) | Append-only lebih mudah; workload update/delete besar butuh tuning autovacuum |
| **Monitoring database** | Pantau table/index IO, vacuum, WAL, query | Cumulative statistics system PostgreSQL mencatat akses table/index, row count, vacuum/analyze, dan metrik aktivitas server lain. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html)) | Buat dashboard untuk ingest lag, partition growth, slow query, WAL growth, replication lag |
| **Failure model** | Antisipasi late data, duplicate, partition miss, index bloat, retention accident | Time-series sering gagal bukan karena SQL, tapi karena lifecycle dan ingest pipeline | Harus ada runbook: backfill, replay, reindex, detach/attach partition, restore partition |
| **Java integration** | Jersey API + MyBatis mapper + batch ingestion | Service layer harus memisahkan online query, bulk ingest, backfill, dan admin operation | Hindari endpoint sinkron yang melakukan agregasi full-scan atas raw table besar |

---

## Roadmap Alur Belajar Singkat

1. **Fondasi time-series concept**  
   Pahami metric/event/state-history, event time vs ingest time, retention, cardinality, dan query SLA.

2. **Native PostgreSQL design**  
   Mulai dari schema modeling, `timestamptz`, range partitioning, B-tree/BRIN, `date_bin`, `generate_series`, dan window functions.

3. **Ingestion & idempotency**  
   Pelajari batch insert, `COPY`, staging table, `ON CONFLICT`, dedup key, retry, replay, dan late-arriving data.

4. **Query optimization**  
   Latih query range, bucket aggregation, rolling window, gap filling, last-known-value, dan `EXPLAIN ANALYZE`.

5. **Lifecycle management**  
   Masuk ke partition automation, retention, vacuum/autovacuum, backup/restore, monitoring, dan capacity planning.

6. **Pre-aggregation**  
   Pelajari materialized view native PostgreSQL, lalu bandingkan dengan TimescaleDB continuous aggregates bila butuh incremental refresh.

7. **Production architecture**  
   Integrasikan dengan Java/Jersey/MyBatis, message broker, dashboard API, alerting, dan runbook operasional.

---

## Rekomendasi materi selanjutnya

Lanjut ke **Cheatsheet PostgreSQL Time-Series Seri 1: Data Modeling, Timestamp Semantics, Partition Key, dan Entity/Metric/Tag Design untuk Production Workload**.

---

**Sources:**

- [PostgreSQL: Documentation: 18: 5.12. Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)
- [Understand hypertables | Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/hypertables/)
- [GitHub - pgpartman/pg_partman: Partition management extension for PostgreSQL · GitHub](https://github.com/pgpartman/pg_partman)

## Response:
7/15/2026, 7:52:22 PM

Saya rekomendasikan **16 seri utama** untuk PostgreSQL Time-Series Database.

| Seri | Materi |
|---:|---|
| 1 | Time-Series Data Modeling: metric, event, state history, tag, dimension |
| 2 | Timestamp Semantics: `timestamptz`, event time, ingest time, timezone, late data |
| 3 | Native Partitioning Strategy: range partition by time, tenant/source subpartition |
| 4 | Partition Lifecycle: create future partition, detach/drop old partition, retention |
| 5 | Indexing Strategy: B-tree, BRIN, partial index, covering index |
| 6 | High-Throughput Ingestion: batch insert, `COPY`, staging table, MyBatis batch |
| 7 | Idempotency & Deduplication: unique key, `ON CONFLICT`, replay-safe ingest |
| 8 | Query Pattern: range query, latest value, last-known-value, entity timeline |
| 9 | Time Bucket Aggregation: `date_bin`, `date_trunc`, hourly/daily/monthly rollup |
| 10 | Gap Filling & Series Completion: `generate_series`, missing data handling |
| 11 | Window Analytics: moving average, lag/lead, delta, rate-of-change |
| 12 | Materialized View & Native Rollup Strategy |
| 13 | TimescaleDB Hypertable, Chunking, Compression/Columnstore |
| 14 | TimescaleDB Continuous Aggregates, Retention Policy, Downsampling |
| 15 | Operational Monitoring: vacuum, bloat, WAL, slow query, partition growth |
| 16 | Production Architecture: Java/Jersey/MyBatis API, ingestion pipeline, dashboard, alerting, runbook |

Tambahan opsional kalau ingin lebih enterprise-grade: **4 seri bonus**:

| Bonus | Materi |
|---:|---|
| B1 | Backfill & Historical Replay Strategy |
| B2 | Multi-Tenant Time-Series Design |
| B3 | HA/Backup/Restore/PITR untuk Time-Series Workload |
| B4 | Performance Benchmarking & Capacity Planning |

Jadi totalnya:

**16 seri utama**  
atau  
**20 seri jika termasuk bonus production-grade**.

## Response:
7/15/2026, 7:58:27 PM

Saya mulai dari **Seri 1/16** dan akan menjaga fokusnya tetap implementatif: desain tabel, trade-off model, query awal, constraint, dan pola yang cocok untuk Java/Jersey/MyBatis production service.

# PostgreSQL Time-Series Database - Seri 1/16  
## Data Modeling, Timestamp Semantics, Partition Key, dan Entity/Metric/Tag Design

**Status seri:** dimulai dari fondasi desain data. Fokus seri ini bukan teori TSDB umum, tetapi bagaimana mendesain table PostgreSQL yang siap dipakai untuk ingestion, query range, dashboard, retention, dan integrasi Java/Jersey/MyBatis.

---

## 1. Core Mental Model

Time-series database di PostgreSQL biasanya menyimpan data dengan pola:

```text
who / what generated the data
+ when it happened
+ what was measured / observed
+ value / payload
+ metadata for filtering
```

Contoh domain:

| Domain | Bentuk time-series |
|---|---|
| IoT / sensor | device mengirim temperatur, pressure, voltage |
| observability | service mengirim latency, error count, CPU, memory |
| workflow / Camunda | process instance state berubah dari waktu ke waktu |
| audit / regulatory | case status, decision, escalation, SLA event |
| business metric | transaction count, active users, queue depth per waktu |

PostgreSQL menyediakan tipe date/time seperti `timestamp` dan `timestamp with time zone`, serta fungsi waktu seperti `date_trunc` dan `date_bin` yang penting untuk bucketing dan analitik berbasis waktu. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-datetime.html?utm_source=chatgpt.com))

---

## 2. Prinsip Desain Praktis

Untuk time-series production, jangan langsung mulai dari “table apa?”. Mulai dari **query dan lifecycle**.

Pertanyaan desain utama:

| Pertanyaan | Kenapa penting |
|---|---|
| Data ditulis seberapa sering? | Menentukan batch insert, partition size, index cost |
| Query paling sering berdasarkan apa? | Menentukan primary index dan partition key |
| Apakah data immutable? | Menentukan apakah table append-only atau perlu update |
| Apakah data bisa telat masuk? | Menentukan pemisahan `event_time` dan `ingest_time` |
| Retention berapa lama? | Menentukan strategi partition/drop old data |
| Apakah perlu dashboard real-time? | Menentukan raw query vs pre-aggregation |
| Cardinality entity tinggi atau rendah? | Menentukan index, tag model, dan storage growth |

**Rule of thumb:**  
Time-series table yang sehat biasanya **append-heavy**, query-nya selalu punya **time range**, dan data lama bisa dihapus berdasarkan **time partition**.

---

## 3. Timestamp Semantics

Ini bagian yang sering dianggap kecil, padahal bisa membuat sistem rusak secara diam-diam.

### 3.1 Gunakan dua timestamp utama

```sql
event_time   timestamptz not null,
ingest_time  timestamptz not null default clock_timestamp()
```

| Column | Arti | Digunakan untuk |
|---|---|---|
| `event_time` | waktu kejadian sebenarnya | dashboard, analitik, SLA, ordering domain |
| `ingest_time` | waktu data masuk ke database | debugging pipeline, late data, replay, ingestion lag |

Jangan hanya punya satu `created_at` kalau datanya bisa berasal dari device, message broker, batch replay, atau sistem eksternal.

Contoh:

```text
event_time  = 2026-07-15 10:00:00+07
ingest_time = 2026-07-15 10:05:34+07
```

Artinya data kejadian jam 10:00 baru masuk 5 menit 34 detik kemudian.

---

### 3.2 `timestamptz` vs `timestamp`

Rekomendasi umum untuk sistem enterprise/microservice: gunakan **`timestamptz`** untuk waktu kejadian lintas sistem, lintas region, atau lintas timezone.

```sql
event_time timestamptz not null
```

Gunakan `timestamp without time zone` hanya jika waktu memang konsep lokal murni, misalnya jam operasional cabang tanpa makna global. PostgreSQL mendukung tipe date/time SQL standar, termasuk timestamp dengan dan tanpa timezone. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-datetime.html?utm_source=chatgpt.com))

---

## 4. Model Utama Time-Series di PostgreSQL

Ada 4 model praktis yang paling sering dipakai.

---

## Model A - Narrow Metric Table

Cocok untuk metric fleksibel, observability, sensor generic, atau banyak jenis metric.

```sql
create table metric_sample (
    tenant_id      bigint not null,
    source_id      bigint not null,
    metric_name    text not null,
    event_time     timestamptz not null,
    ingest_time    timestamptz not null default clock_timestamp(),
    value_numeric  numeric,
    value_text     text,
    quality        text not null default 'GOOD',
    tags           jsonb not null default '{}'::jsonb,

    constraint metric_sample_quality_chk
        check (quality in ('GOOD', 'BAD', 'ESTIMATED', 'MISSING')),

    constraint metric_sample_value_chk
        check (
            value_numeric is not null
            or value_text is not null
        )
);
```

### Kapan pakai?

| Cocok | Tidak cocok |
|---|---|
| Jumlah metric dinamis | Query sangat fixed dan butuh performa maksimal |
| Observability metric | Banyak query perlu mengambil banyak metric sekaligus |
| Sensor berbeda-beda | Metric name terlalu bebas tanpa governance |
| Schema perlu fleksibel | Validasi domain sangat ketat |

### Contoh data

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time,
    value_numeric,
    tags
)
values
(10, 1001, 'temperature_celsius', '2026-07-15 10:00:00+07', 31.5, '{"region":"jakarta","floor":"2"}'),
(10, 1001, 'humidity_percent',    '2026-07-15 10:00:00+07', 68.2, '{"region":"jakarta","floor":"2"}');
```

### Query contoh

```sql
select
    event_time,
    value_numeric
from metric_sample
where tenant_id = 10
  and source_id = 1001
  and metric_name = 'temperature_celsius'
  and event_time >= now() - interval '1 hour'
order by event_time;
```

### Catatan production

`metric_name` jangan dibiarkan liar. Buat registry:

```sql
create table metric_definition (
    metric_name     text primary key,
    unit            text not null,
    value_type      text not null,
    description     text,
    is_active       boolean not null default true,

    constraint metric_definition_value_type_chk
        check (value_type in ('NUMERIC', 'TEXT', 'BOOLEAN', 'JSON'))
);
```

---

## Model B - Wide Metric Table

Cocok untuk metric tetap, dashboard cepat, dan query predictable.

```sql
create table device_reading (
    tenant_id       bigint not null,
    device_id       bigint not null,
    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    temperature_c   numeric(8,3),
    humidity_pct    numeric(8,3),
    pressure_kpa    numeric(10,3),
    battery_pct     numeric(5,2),
    signal_strength integer,

    quality         text not null default 'GOOD',

    constraint device_reading_pk
        primary key (tenant_id, device_id, event_time),

    constraint device_reading_quality_chk
        check (quality in ('GOOD', 'BAD', 'ESTIMATED', 'MISSING'))
);
```

### Kapan pakai?

| Cocok | Tidak cocok |
|---|---|
| Metric set stabil | Metric sering berubah |
| Query dashboard fixed | Butuh generic metric engine |
| Banyak metric dibaca bersama | Banyak column nullable tidak terkendali |
| Validasi tipe jelas | Butuh dynamic tags-heavy analytics |

### Query contoh

```sql
select
    event_time,
    temperature_c,
    humidity_pct,
    battery_pct
from device_reading
where tenant_id = 10
  and device_id = 1001
  and event_time >= now() - interval '24 hours'
order by event_time;
```

### Catatan production

Model wide biasanya lebih cepat dan lebih mudah divalidasi, tetapi schema evolution lebih sering. Cocok kalau Anda punya kontrak data yang jelas.

---

## Model C - Event Log Table

Cocok untuk workflow, lifecycle, audit, case management, regulatory event, dan process history.

```sql
create table case_timeline_event (
    tenant_id       bigint not null,
    case_id         uuid not null,
    event_id        uuid not null,
    event_type      text not null,
    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    actor_type      text,
    actor_id        text,
    previous_state  text,
    new_state       text,
    payload         jsonb not null default '{}'::jsonb,

    constraint case_timeline_event_pk
        primary key (tenant_id, case_id, event_time, event_id),

    constraint case_timeline_event_uniq
        unique (tenant_id, event_id)
);
```

### Kapan pakai?

| Cocok | Tidak cocok |
|---|---|
| Case lifecycle | Numeric metric high-frequency |
| Audit trail | Dashboard aggregation murni |
| Camunda/process event | Data sensor per detik |
| Regulatory defensibility | Data yang sering di-update in-place |

### Query timeline case

```sql
select
    event_time,
    event_type,
    previous_state,
    new_state,
    actor_type,
    actor_id
from case_timeline_event
where tenant_id = 10
  and case_id = '018f7d42-7b7c-7b1a-9e58-8b2ffbb7b111'
order by event_time, event_id;
```

### Catatan production

Untuk regulatory/case management, event log sebaiknya **immutable**. Koreksi dilakukan dengan event baru, bukan update event lama.

---

## Model D - State History Table

Cocok untuk menyimpan perubahan state dengan interval validitas.

```sql
create table case_state_history (
    tenant_id       bigint not null,
    case_id         uuid not null,
    state           text not null,
    valid_from      timestamptz not null,
    valid_to        timestamptz,
    changed_by      text,
    change_reason   text,

    constraint case_state_history_pk
        primary key (tenant_id, case_id, valid_from),

    constraint case_state_history_valid_range_chk
        check (valid_to is null or valid_to > valid_from)
);
```

### Query current state

```sql
select *
from case_state_history
where tenant_id = 10
  and case_id = '018f7d42-7b7c-7b1a-9e58-8b2ffbb7b111'
  and valid_to is null;
```

### Query state at specific time

```sql
select *
from case_state_history
where tenant_id = 10
  and case_id = '018f7d42-7b7c-7b1a-9e58-8b2ffbb7b111'
  and valid_from <= '2026-07-15 12:00:00+07'
  and (
      valid_to > '2026-07-15 12:00:00+07'
      or valid_to is null
  );
```

### Catatan production

Model ini bagus untuk pertanyaan:

```text
Status case ini pada jam tertentu apa?
Berapa lama case berada di state tertentu?
SLA breach dimulai kapan?
```

---

# 5. Pilihan Model: Decision Matrix

| Kebutuhan | Model yang disarankan |
|---|---|
| Banyak sensor/metric dinamis | Narrow metric table |
| Metric fixed dan dashboard cepat | Wide metric table |
| Audit/case/workflow timeline | Event log table |
| Current state + historical state | State history table |
| High-frequency numeric data | Narrow atau wide + partition |
| Regulatory defensibility | Event log + state history |
| Query latest reading per entity | Wide table atau narrow dengan index kuat |
| Data bisa replay/duplicate | Semua model harus punya idempotency key |

---

# 6. Entity, Metric, dan Tag Design

## 6.1 Jangan semua metadata dimasukkan ke JSONB

Anti-pattern:

```sql
tags jsonb
```

lalu semua filter penting disimpan di dalam `tags`, misalnya:

```json
{
  "tenant_id": 10,
  "device_id": 1001,
  "region": "jakarta",
  "service": "payment",
  "severity": "critical"
}
```

Ini membuat query sulit distabilkan dan index bisa membengkak.

Lebih baik:

```sql
tenant_id   bigint not null,
device_id   bigint not null,
region      text,
service     text,
severity    text,
tags        jsonb not null default '{}'::jsonb
```

Gunakan column eksplisit untuk filter utama.

---

## 6.2 Praktik klasifikasi metadata

| Metadata | Simpan sebagai | Alasan |
|---|---|---|
| `tenant_id` | column | selalu dipakai untuk isolation/filter |
| `device_id` / `source_id` | column | query utama dan indexing |
| `event_time` | column | partition dan range query |
| `metric_name` | column | filter utama pada narrow table |
| `region` | column kalau sering difilter | dashboard/filter umum |
| `service_name` | column kalau observability | query operasional |
| `firmware_version` | JSONB/tag atau dimension | filter kadang-kadang |
| arbitrary label | JSONB | fleksibel, tidak selalu di-index |
| unit metric | registry table | governance dan validasi |

---

# 7. Partition Key Design

Untuk time-series, partition key utama hampir selalu **waktu**.

PostgreSQL declarative partitioning mendukung range, list, dan hash partitioning; untuk time-series, range partitioning berdasarkan timestamp adalah pola paling umum. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html?utm_source=chatgpt.com))

Contoh parent table:

```sql
create table device_reading_partitioned (
    tenant_id       bigint not null,
    device_id       bigint not null,
    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    temperature_c   numeric(8,3),
    humidity_pct    numeric(8,3),
    battery_pct     numeric(5,2),

    quality         text not null default 'GOOD',

    constraint device_reading_partitioned_quality_chk
        check (quality in ('GOOD', 'BAD', 'ESTIMATED', 'MISSING'))
)
partition by range (event_time);
```

Contoh partition harian:

```sql
create table device_reading_2026_07_15
partition of device_reading_partitioned
for values from ('2026-07-15 00:00:00+07')
to              ('2026-07-16 00:00:00+07');
```

Contoh index per partition biasanya dibuat dari parent:

```sql
create index device_reading_partitioned_device_time_idx
on device_reading_partitioned (tenant_id, device_id, event_time desc);
```

PostgreSQL mendukung beberapa tipe index seperti B-tree, Hash, GiST, SP-GiST, GIN, dan BRIN; default `CREATE INDEX` adalah B-tree. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-types.html?utm_source=chatgpt.com))

---

# 8. Primary Key dan Idempotency

Untuk time-series ingestion, primary key harus mendukung retry/replay.

## Option 1 - Natural-ish key

```sql
constraint device_reading_pk
primary key (tenant_id, device_id, event_time)
```

Cocok jika satu device hanya boleh punya satu reading pada satu waktu.

## Option 2 - Event id key

```sql
event_id uuid not null,

constraint device_reading_event_uniq
unique (tenant_id, event_id)
```

Cocok untuk data dari message broker, external event, atau replay.

## Option 3 - Metric key untuk narrow table

```sql
constraint metric_sample_uniq
unique (tenant_id, source_id, metric_name, event_time)
```

Cocok jika satu metric per source per timestamp hanya boleh satu value.

---

## Rekomendasi production

Untuk sistem enterprise, sering kali pakai kombinasi:

```sql
event_id uuid not null,
tenant_id bigint not null,
source_id bigint not null,
metric_name text not null,
event_time timestamptz not null,

unique (tenant_id, event_id),
unique (tenant_id, source_id, metric_name, event_time)
```

Alasannya:

| Constraint | Fungsi |
|---|---|
| `(tenant_id, event_id)` | idempotency terhadap replay message |
| `(tenant_id, source_id, metric_name, event_time)` | mencegah duplicate logical reading |

---

# 9. Practical Implementation Example

## 9.1 Final table: production-style narrow metric

```sql
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_id        uuid not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    value_numeric   numeric,
    value_text      text,
    quality         text not null default 'GOOD',
    tags            jsonb not null default '{}'::jsonb,

    constraint metric_sample_quality_chk
        check (quality in ('GOOD', 'BAD', 'ESTIMATED', 'MISSING')),

    constraint metric_sample_value_chk
        check (
            value_numeric is not null
            or value_text is not null
        ),

    constraint metric_sample_event_uniq
        unique (tenant_id, event_id),

    constraint metric_sample_logical_uniq
        unique (tenant_id, source_id, metric_name, event_time)
)
partition by range (event_time);
```

---

## 9.2 Partition contoh

```sql
create table metric_sample_2026_07_15
partition of metric_sample
for values from ('2026-07-15 00:00:00+07')
to              ('2026-07-16 00:00:00+07');

create table metric_sample_2026_07_16
partition of metric_sample
for values from ('2026-07-16 00:00:00+07')
to              ('2026-07-17 00:00:00+07');
```

---

## 9.3 Index contoh

```sql
create index metric_sample_source_time_idx
on metric_sample (tenant_id, source_id, metric_name, event_time desc);

create index metric_sample_time_idx
on metric_sample (event_time desc);
```

Untuk table besar yang append-ordered berdasarkan waktu, BRIN bisa dipertimbangkan karena didesain untuk table sangat besar ketika nilai column berkorelasi dengan lokasi fisik data. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-types.html?utm_source=chatgpt.com))

Contoh BRIN:

```sql
create index metric_sample_event_time_brin_idx
on metric_sample using brin (event_time);
```

---

# 10. Query Praktis

## 10.1 Ambil metric 1 jam terakhir

```sql
select
    event_time,
    value_numeric
from metric_sample
where tenant_id = 10
  and source_id = 1001
  and metric_name = 'temperature_celsius'
  and event_time >= now() - interval '1 hour'
order by event_time;
```

---

## 10.2 Ambil latest value

```sql
select
    event_time,
    value_numeric,
    quality
from metric_sample
where tenant_id = 10
  and source_id = 1001
  and metric_name = 'temperature_celsius'
order by event_time desc
limit 1;
```

---

## 10.3 Hitung ingestion lag

```sql
select
    event_time,
    ingest_time,
    ingest_time - event_time as ingest_lag
from metric_sample
where tenant_id = 10
  and source_id = 1001
  and metric_name = 'temperature_celsius'
order by ingest_time desc
limit 100;
```

---

## 10.4 Detect late-arriving data

```sql
select
    count(*) as late_data_count
from metric_sample
where tenant_id = 10
  and ingest_time >= now() - interval '1 hour'
  and ingest_time - event_time > interval '5 minutes';
```

---

# 11. Java/Jersey/MyBatis Integration Sketch

## 11.1 DTO request

```java
public record MetricSampleRequest(
    UUID eventId,
    long tenantId,
    long sourceId,
    String metricName,
    OffsetDateTime eventTime,
    BigDecimal valueNumeric,
    String valueText,
    String quality,
    Map<String, Object> tags
) {}
```

Gunakan `OffsetDateTime` atau `Instant` di Java layer. Hindari `LocalDateTime` untuk event lintas timezone karena tidak membawa offset/timezone.

---

## 11.2 Jersey resource

```java
@Path("/v1/metrics")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class MetricResource {

    private final MetricService metricService;

    public MetricResource(MetricService metricService) {
        this.metricService = metricService;
    }

    @POST
    public Response ingest(MetricSampleRequest request) {
        metricService.ingest(request);
        return Response.accepted().build();
    }
}
```

---

## 11.3 MyBatis mapper interface

```java
public interface MetricSampleMapper {
    int insertMetricSample(MetricSampleRow row);
}
```

---

## 11.4 MyBatis XML insert dengan idempotency

```xml
<insert id="insertMetricSample">
    insert into metric_sample (
        tenant_id,
        source_id,
        event_id,
        metric_name,
        event_time,
        value_numeric,
        value_text,
        quality,
        tags
    )
    values (
        #{tenantId},
        #{sourceId},
        #{eventId},
        #{metricName},
        #{eventTime},
        #{valueNumeric},
        #{valueText},
        #{quality},
        #{tags, typeHandler=com.example.JsonbTypeHandler}::jsonb
    )
    on conflict (tenant_id, event_id)
    do nothing
</insert>
```

Untuk replay-safe ingestion, `ON CONFLICT DO NOTHING` cocok jika duplicate event harus diabaikan. Kalau duplicate harus memperbaiki value, gunakan `ON CONFLICT DO UPDATE`, tetapi itu harus diputuskan hati-hati karena raw time-series biasanya lebih aman immutable.

---

# 12. Anti-Patterns yang Harus Dihindari

| Anti-pattern | Dampak |
|---|---|
| Hanya punya `created_at`, tidak ada `event_time` | Analitik salah saat data telat masuk |
| Semua metadata dimasukkan ke JSONB | Query sulit cepat dan sulit dioptimasi |
| Tidak ada idempotency key | Retry menghasilkan duplicate data |
| Tidak ada partition | Retention dan query table besar menjadi berat |
| Primary key hanya `id bigserial` | Tidak mencegah duplicate logical event |
| Update raw event lama | Auditability dan replay semantics rusak |
| Query dashboard langsung scan raw data besar | Dashboard lambat dan mahal |
| Tidak ada metric registry | Metric name kacau, unit tidak konsisten |
| Menggunakan `LocalDateTime` untuk event global | Risiko interpretasi timezone salah |
| Partition berdasarkan `ingest_time` padahal query berdasarkan `event_time` | Partition pruning tidak efektif untuk query utama |

---

# 13. Checklist Desain Sebelum Implementasi

Gunakan checklist ini sebelum membuat table time-series baru.

| Checklist | Ya/Tidak |
|---|---|
| Sudah jelas `event_time` dan `ingest_time`? |  |
| Sudah jelas apakah data immutable atau bisa update? |  |
| Sudah jelas query utama berdasarkan tenant/entity/time? |  |
| Sudah jelas retention raw data? |  |
| Sudah jelas apakah perlu rollup/agregasi? |  |
| Sudah jelas cardinality `source_id`, `metric_name`, tag? |  |
| Sudah ada idempotency key? |  |
| Sudah ada constraint untuk mencegah duplicate logical data? |  |
| Sudah jelas column mana yang wajib eksplisit, bukan JSONB? |  |
| Sudah jelas partition granularity harian/mingguan/bulanan? |  |

---

# 14. Recommended Baseline untuk Enterprise Microservice

Untuk permulaan, saya rekomendasikan baseline ini:

```text
Model:
- gunakan wide table jika metric stabil
- gunakan narrow table jika metric dinamis

Timestamp:
- event_time timestamptz not null
- ingest_time timestamptz default clock_timestamp()

Partition:
- range partition by event_time

Identity:
- event_id uuid untuk idempotency
- logical unique key untuk mencegah duplicate semantic data

Metadata:
- tenant_id, source_id, metric_name sebagai column eksplisit
- JSONB hanya untuk optional tags

Index:
- (tenant_id, source_id, metric_name, event_time desc)
- BRIN(event_time) untuk very large append-heavy table jika cocok

Integration:
- Jersey endpoint menerima batch kecil
- MyBatis batch untuk ingestion
- COPY/staging table untuk backfill besar
```

---

# 15. Seri 1 Selesai

**Seri 1/16 selesai.**

Materi ini membangun fondasi model data time-series di PostgreSQL: schema pattern, timestamp semantics, entity/metric/tag modeling, partition key, idempotency, dan contoh implementasi awal dengan Java/Jersey/MyBatis.

## Rekomendasi materi selanjutnya

Lanjut ke **Seri 2/16 - Timestamp Semantics Deep Dive: `timestamptz`, event time, ingest time, timezone, clock skew, late-arriving data, dan replay-safe ingestion**.

---

**Sources:**

- [Documentation: 18: 8.5. Date/Time Types](https://www.postgresql.org/docs/current/datatype-datetime.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:28:12 PM

Saya lanjut ke **Seri 2/16**. Fokusnya timestamp semantics secara praktis: pilihan tipe waktu, timezone, late data, clock skew, replay, dan dampaknya ke query/partition/index.

# PostgreSQL Time-Series Database - Seri 2/16  
## Timestamp Semantics Deep Dive: `timestamptz`, Event Time, Ingest Time, Timezone, Late Data, Clock Skew, dan Replay-Safe Ingestion

**Status:** Seri 2 dari 16.  
Fokus seri ini: membuat desain waktu yang **tidak ambigu**, aman untuk **multi-service**, **multi-timezone**, **replay**, **late-arriving data**, dan **audit/regulatory timeline**.

---

## 1. Problem Utama Timestamp di Time-Series

Kesalahan umum di time-series bukan sekadar “query lambat”, tapi **waktu yang salah dimaknai**.

Contoh masalah nyata:

```text
Sensor mengirim data jam 10:00.
Message broker delay 5 menit.
Service baru menyimpan data jam 10:05.
Dashboard ingin menampilkan kejadian berdasarkan jam kejadian, bukan jam masuk database.
```

Kalau hanya punya satu column `created_at`, sistem akan bingung:

| Pertanyaan | Butuh timestamp apa? |
|---|---|
| “Kejadian sebenarnya kapan?” | `event_time` |
| “Data masuk sistem kapan?” | `ingest_time` |
| “Message diterima service kapan?” | `received_time` |
| “Data diproses batch kapan?” | `processed_time` |
| “Data valid untuk business period mana?” | `business_date` / `effective_time` |

PostgreSQL mendukung `timestamp with time zone` dan `timestamp without time zone`; `timestamptz` adalah alias PostgreSQL untuk `timestamp with time zone`. PostgreSQL juga mencatat bahwa penulisan `timestamp` saja berarti `timestamp without time zone`, sesuai SQL standard. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-datetime.html))

---

## 2. Baseline Rule untuk Enterprise Time-Series

Untuk microservice modern, default aman:

```sql
event_time      timestamptz not null,
ingest_time     timestamptz not null default clock_timestamp(),
received_time   timestamptz,
processed_time  timestamptz
```

Rekomendasi:

| Column | Mandatory? | Arti | Dipakai untuk |
|---|---:|---|---|
| `event_time` | Ya | waktu kejadian domain | analytics, dashboard, SLA, partition |
| `ingest_time` | Ya | waktu row masuk DB | lag monitoring, debugging |
| `received_time` | Opsional | waktu service menerima request/message | API latency / broker latency |
| `processed_time` | Opsional | waktu selesai diproses | pipeline monitoring |
| `business_date` | Opsional | tanggal bisnis lokal | reporting/regulatory close |
| `source_time` | Opsional | timestamp asli dari source | forensic/debugging bila source clock tidak dipercaya |

**Prinsip penting:**  
Untuk time-series, **partition dan analytics biasanya berdasarkan `event_time`**, bukan `ingest_time`.

---

## 3. `timestamptz` vs `timestamp`

## 3.1 `timestamptz`

Gunakan untuk waktu kejadian lintas sistem.

```sql
event_time timestamptz not null
```

Untuk `timestamp with time zone`, PostgreSQL mengonversi input yang punya timezone eksplisit ke UTC, menyimpan nilainya secara internal sebagai UTC, dan menampilkan kembali sesuai timezone session saat output. Timezone asli yang ditulis di input tidak disimpan. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-datetime.html))

Implikasi penting:

```sql
select
    timestamptz '2026-07-15 10:00:00+07',
    timestamptz '2026-07-15 03:00:00+00';
```

Keduanya merepresentasikan instant yang sama.

### Cocok untuk

| Use case | Kenapa |
|---|---|
| event dari microservice | lintas server/timezone |
| sensor/IoT | source bisa beda lokasi |
| message broker | replay/order lintas sistem |
| audit event | perlu instant global |
| SLA timeline | durasi harus konsisten |

---

## 3.2 `timestamp without time zone`

```sql
business_cutoff_time timestamp not null
```

Gunakan hanya jika nilai waktu memang **local wall-clock time** dan tidak merepresentasikan instant global.

Contoh cocok:

| Use case | Contoh |
|---|---|
| jadwal operasional lokal | cabang buka jam 08:00 waktu lokal |
| business calendar | cutoff harian lokal |
| template jadwal | “setiap Senin jam 09:00” |
| input kalender tanpa instant | local appointment sebelum dikonversi |

Hati-hati: untuk `timestamp without time zone`, PostgreSQL akan mengabaikan indikasi timezone pada input, karena nilainya dianggap tanggal/jam “apa adanya” dan tidak disesuaikan ke timezone. ([PostgreSQL](https://www.postgresql.org/docs/current/datatype-datetime.html))

---

## 4. Jangan Pakai `LocalDateTime` untuk Event Global

Di Java:

| Java type | Cocok untuk | Catatan |
|---|---|---|
| `Instant` | instant global UTC | paling aman untuk event machine-to-machine |
| `OffsetDateTime` | instant dengan offset input | cocok untuk API boundary |
| `ZonedDateTime` | waktu dengan zone rule IANA | cocok untuk kalender/business timezone |
| `LocalDateTime` | waktu lokal tanpa timezone | jangan untuk event global |
| `LocalDate` | business date | cocok untuk reporting date |

### DTO rekomendasi

```java
public record MetricSampleRequest(
    UUID eventId,
    long tenantId,
    long sourceId,
    String metricName,
    OffsetDateTime eventTime,
    BigDecimal valueNumeric,
    Map<String, Object> tags
) {}
```

### Internal domain rekomendasi

```java
public record MetricSampleCommand(
    UUID eventId,
    long tenantId,
    long sourceId,
    String metricName,
    Instant eventTime,
    Instant receivedTime,
    BigDecimal valueNumeric,
    Map<String, Object> tags
) {}
```

API boleh menerima `OffsetDateTime`, tetapi domain internal lebih aman memakai `Instant`.

---

## 5. Event Time vs Ingest Time

## 5.1 Table design

```sql
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_id        uuid not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    value_numeric   numeric,
    tags            jsonb not null default '{}'::jsonb,

    constraint metric_sample_event_uniq
        unique (tenant_id, event_id),

    constraint metric_sample_logical_uniq
        unique (tenant_id, source_id, metric_name, event_time)
)
partition by range (event_time);
```

Untuk default `ingest_time`, saya lebih suka `clock_timestamp()` dibanding `now()` kalau ingin waktu aktual saat fungsi dipanggil. PostgreSQL menjelaskan bahwa `now()` setara dengan `transaction_timestamp()` dan bernilai waktu awal transaksi, sedangkan `clock_timestamp()` mengembalikan waktu aktual dan dapat berubah bahkan di dalam satu statement. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-datetime.html))

---

## 5.2 Query ingestion lag

```sql
select
    tenant_id,
    source_id,
    metric_name,
    event_time,
    ingest_time,
    ingest_time - event_time as ingest_lag
from metric_sample
where ingest_time >= clock_timestamp() - interval '1 hour'
order by ingest_lag desc
limit 100;
```

Gunanya:

| Lag | Interpretasi |
|---|---|
| kecil | pipeline sehat |
| besar | source terlambat, broker delay, batch replay, network issue |
| negatif | source clock kemungkinan lebih cepat daripada server DB |

---

## 6. `now()`, `current_timestamp`, `statement_timestamp()`, `clock_timestamp()`

Ini penting untuk audit dan ingestion.

| Function | Makna | Kapan dipakai |
|---|---|---|
| `now()` | awal transaksi | konsistensi timestamp dalam satu transaksi |
| `current_timestamp` | awal transaksi | sama seperti `now()` dalam praktik |
| `transaction_timestamp()` | awal transaksi | eksplisit |
| `statement_timestamp()` | awal statement | debugging eksekusi statement |
| `clock_timestamp()` | waktu aktual saat dipanggil | ingest timestamp, latency measurement |

PostgreSQL menyatakan `CURRENT_TIMESTAMP`/`transaction_timestamp()` tidak berubah selama transaksi, sedangkan `clock_timestamp()` berubah sesuai waktu aktual saat dipanggil. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-datetime.html))

### Contoh perbedaan

```sql
begin;

select now(), clock_timestamp();

select pg_sleep(2);

select now(), clock_timestamp();

commit;
```

Ekspektasi:

```text
now()             tetap sama dalam transaksi
clock_timestamp() berubah setelah sleep
```

### Rekomendasi praktis

| Use case | Function |
|---|---|
| `created_at` untuk semua row dalam satu transaksi harus sama | `now()` |
| `ingest_time` akurat per row/per call | `clock_timestamp()` |
| audit perubahan batch sebagai satu unit | `transaction_timestamp()` |
| latency measurement | `clock_timestamp()` |

---

## 7. Timezone Handling

## 7.1 Set timezone aplikasi ke UTC

Di connection/session PostgreSQL:

```sql
set time zone 'UTC';
```

Di JDBC URL:

```properties
jdbc:postgresql://db-host:5432/appdb?options=-c%20TimeZone=UTC
```

Di HikariCP:

```properties
dataSource.properties.options=-c TimeZone=UTC
```

Tujuannya bukan karena `timestamptz` “menyimpan timezone”, tetapi agar output, log, dan debugging konsisten.

---

## 7.2 Display timezone di query

Untuk menampilkan waktu dalam timezone user/business:

```sql
select
    event_time,
    event_time at time zone 'Asia/Jakarta' as event_time_jakarta
from metric_sample
where tenant_id = 10
limit 10;
```

`AT TIME ZONE` punya dua arah konversi: dari `timestamp without time zone` menjadi `timestamp with time zone` dengan asumsi zone tertentu, dan dari `timestamp with time zone` menjadi local timestamp di zone tertentu. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-datetime.html))

### Praktik aman

| Tujuan | Simpan | Tampilkan |
|---|---|---|
| machine event | `timestamptz` | convert saat output |
| business day lokal | `date` / generated column | hitung berdasarkan business timezone |
| audit instant | `timestamptz` | tampilkan dengan timezone user |
| local schedule | `timestamp without time zone` + timezone id | convert saat menjadi event |

---

## 8. Business Date vs Event Time

Untuk reporting/regulatory, kadang “tanggal bisnis” tidak sama dengan UTC date.

Contoh: event terjadi:

```text
2026-07-15 00:30:00+07
```

Dalam UTC:

```text
2026-07-14 17:30:00+00
```

Kalau report mengikuti tanggal Indonesia, business date adalah **2026-07-15**, bukan UTC date.

### Solusi eksplisit

```sql
business_date date generated always as (
    (event_time at time zone 'Asia/Jakarta')::date
) stored
```

Contoh table:

```sql
create table metric_sample_jakarta (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_time      timestamptz not null,
    business_date   date generated always as (
        (event_time at time zone 'Asia/Jakarta')::date
    ) stored,
    value_numeric   numeric
);
```

### Query report harian

```sql
select
    business_date,
    count(*) as sample_count,
    avg(value_numeric) as avg_value
from metric_sample_jakarta
where tenant_id = 10
  and business_date between date '2026-07-01' and date '2026-07-31'
group by business_date
order by business_date;
```

---

## 9. Bucket Time-Series: `date_trunc` vs `date_bin`

## 9.1 `date_trunc`

Gunakan untuk bucket kalender standar:

```sql
select
    date_trunc('hour', event_time, 'Asia/Jakarta') as hour_bucket,
    avg(value_numeric) as avg_value
from metric_sample
where tenant_id = 10
  and event_time >= timestamptz '2026-07-15 00:00:00+07'
  and event_time <  timestamptz '2026-07-16 00:00:00+07'
group by hour_bucket
order by hour_bucket;
```

`date_trunc` bisa melakukan truncation terhadap `timestamp with time zone` berdasarkan timezone tertentu; misalnya truncation ke `day` menghasilkan midnight pada timezone itu. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-datetime.html))

---

## 9.2 `date_bin`

Gunakan untuk interval arbitrary seperti 5 menit, 15 menit, 30 menit.

```sql
select
    date_bin(
        interval '15 minutes',
        event_time,
        timestamptz '2026-01-01 00:00:00+00'
    ) as bucket_15m,
    avg(value_numeric) as avg_value
from metric_sample
where tenant_id = 10
  and event_time >= now() - interval '24 hours'
group by bucket_15m
order by bucket_15m;
```

`date_bin(stride, source, origin)` membinning timestamp ke interval tertentu yang disejajarkan dengan origin; untuk unit seperti menit/jam ia mirip `date_trunc`, tetapi `date_bin` mendukung interval arbitrary. Stride harus lebih besar dari nol dan tidak boleh mengandung unit bulan atau lebih besar. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-datetime.html))

---

## 10. Late-Arriving Data

Late data adalah data yang `event_time`-nya lama, tapi baru `ingest_time` sekarang.

### 10.1 Detect late data

```sql
select
    count(*) as late_count
from metric_sample
where ingest_time >= clock_timestamp() - interval '1 hour'
  and ingest_time - event_time > interval '5 minutes';
```

### 10.2 Distribusi lateness

```sql
select
    case
        when ingest_time - event_time <= interval '1 minute' then '<=1m'
        when ingest_time - event_time <= interval '5 minutes' then '<=5m'
        when ingest_time - event_time <= interval '1 hour' then '<=1h'
        else '>1h'
    end as lateness_bucket,
    count(*) as row_count
from metric_sample
where ingest_time >= clock_timestamp() - interval '24 hours'
group by lateness_bucket
order by lateness_bucket;
```

### 10.3 Production implication

| Masalah | Dampak |
|---|---|
| late data masuk partition lama | partition lama harus masih writable |
| materialized view sudah refresh | perlu refresh ulang window terdampak |
| alert real-time sudah terkirim | perlu policy koreksi atau compensating event |
| dashboard cache sudah terisi | perlu invalidasi window |
| retention terlalu agresif | late data tidak bisa masuk |

---

## 11. Clock Skew

Clock skew terjadi ketika waktu source tidak sinkron dengan waktu server.

Contoh:

```text
source event_time = 10:10
database ingest_time = 10:00
lag = -10 menit
```

Ini bukan “data dari masa depan” secara domain; mungkin clock source maju 10 menit.

### Query detect future event

```sql
select
    tenant_id,
    source_id,
    metric_name,
    event_time,
    ingest_time,
    event_time - ingest_time as future_skew
from metric_sample
where event_time > ingest_time + interval '2 minutes'
order by future_skew desc
limit 100;
```

### Policy praktis

| Kondisi | Action |
|---|---|
| `event_time <= ingest_time + 2 minutes` | accept |
| `event_time > ingest_time + 2 minutes` | accept dengan flag `CLOCK_SKEW` atau reject |
| `event_time terlalu lama` | route ke backfill path |
| source sering skew | alert ke device/service owner |

---

## 12. Data Quality Field untuk Time Semantics

Tambahkan status waktu, jangan hanya status value.

```sql
alter table metric_sample
add column time_quality text not null default 'NORMAL';

alter table metric_sample
add constraint metric_sample_time_quality_chk
check (
    time_quality in (
        'NORMAL',
        'LATE',
        'FUTURE_SKEW',
        'MISSING_SOURCE_TIME',
        'REPLAYED',
        'CORRECTED'
    )
);
```

### Insert dengan klasifikasi time quality

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    time_quality,
    tags
)
values (
    #{tenantId},
    #{sourceId},
    #{eventId},
    #{metricName},
    #{eventTime},
    #{valueNumeric},
    case
        when #{eventTime} > clock_timestamp() + interval '2 minutes'
            then 'FUTURE_SKEW'
        when clock_timestamp() - #{eventTime} > interval '5 minutes'
            then 'LATE'
        else 'NORMAL'
    end,
    #{tags, typeHandler=com.example.JsonbTypeHandler}::jsonb
);
```

Lebih rapi lagi: klasifikasi di service layer Java supaya threshold bisa dikonfigurasi.

---

## 13. Replay-Safe Ingestion

Replay bisa datang dari:

| Source | Contoh |
|---|---|
| Kafka / RabbitMQ | consumer restart |
| batch file | file diproses ulang |
| API client | retry karena timeout |
| outbox/inbox | event dipublish ulang |
| manual backfill | historical correction |

PostgreSQL `ON CONFLICT` memberikan alternatif terhadap unique violation: `DO NOTHING` mengabaikan insert yang konflik, sedangkan `DO UPDATE` memperbarui row yang konflik. Untuk `DO UPDATE`, PostgreSQL menjamin outcome atomic insert/update dalam kondisi concurrency tinggi. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-insert.html))

---

## 13.1 Immutable raw event: `DO NOTHING`

Cocok untuk raw event yang tidak boleh berubah.

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    tags
)
values (
    #{tenantId},
    #{sourceId},
    #{eventId},
    #{metricName},
    #{eventTime},
    #{valueNumeric},
    #{tags, typeHandler=com.example.JsonbTypeHandler}::jsonb
)
on conflict (tenant_id, event_id)
do nothing;
```

### Kapan cocok?

| Cocok | Alasan |
|---|---|
| audit event | event lama tidak diubah |
| raw sensor sample | duplicate replay cukup diabaikan |
| broker retry | idempotent |
| append-only compliance | aman untuk defensibility |

---

## 13.2 Correctable metric: `DO UPDATE`

Cocok jika source bisa mengirim koreksi.

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    tags
)
values (
    #{tenantId},
    #{sourceId},
    #{eventId},
    #{metricName},
    #{eventTime},
    #{valueNumeric},
    #{tags, typeHandler=com.example.JsonbTypeHandler}::jsonb
)
on conflict (tenant_id, source_id, metric_name, event_time)
do update set
    value_numeric = excluded.value_numeric,
    tags = metric_sample.tags || excluded.tags,
    ingest_time = clock_timestamp();
```

### Risiko

| Risiko | Mitigasi |
|---|---|
| raw history berubah diam-diam | simpan correction event |
| dashboard berubah tanpa audit | tulis audit table |
| concurrent update overwrite | pakai version/source sequence |
| correction dari source lama menimpa data baru | cek `source_sequence` atau `source_updated_at` |

---

## 14. Recommended Table: Time-Aware Metric Sample

```sql
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_id        uuid not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),
    received_time   timestamptz,

    value_numeric   numeric,
    value_text      text,

    value_quality   text not null default 'GOOD',
    time_quality    text not null default 'NORMAL',

    source_sequence bigint,
    source_time     timestamptz,

    tags            jsonb not null default '{}'::jsonb,

    constraint metric_sample_value_quality_chk
        check (value_quality in ('GOOD', 'BAD', 'ESTIMATED', 'MISSING')),

    constraint metric_sample_time_quality_chk
        check (time_quality in (
            'NORMAL',
            'LATE',
            'FUTURE_SKEW',
            'MISSING_SOURCE_TIME',
            'REPLAYED',
            'CORRECTED'
        )),

    constraint metric_sample_value_chk
        check (
            value_numeric is not null
            or value_text is not null
        ),

    constraint metric_sample_event_uniq
        unique (tenant_id, event_id),

    constraint metric_sample_logical_uniq
        unique (tenant_id, source_id, metric_name, event_time)
)
partition by range (event_time);
```

---

## 15. MyBatis Type Handling untuk Waktu

## 15.1 Java row object

```java
public record MetricSampleRow(
    long tenantId,
    long sourceId,
    UUID eventId,
    String metricName,
    Instant eventTime,
    Instant receivedTime,
    BigDecimal valueNumeric,
    String valueText,
    String valueQuality,
    String timeQuality,
    Long sourceSequence,
    Instant sourceTime,
    Map<String, Object> tags
) {}
```

## 15.2 Mapper XML

```xml
<insert id="insertMetricSample">
    insert into metric_sample (
        tenant_id,
        source_id,
        event_id,
        metric_name,
        event_time,
        received_time,
        value_numeric,
        value_text,
        value_quality,
        time_quality,
        source_sequence,
        source_time,
        tags
    )
    values (
        #{tenantId},
        #{sourceId},
        #{eventId},
        #{metricName},
        #{eventTime},
        #{receivedTime},
        #{valueNumeric},
        #{valueText},
        #{valueQuality},
        #{timeQuality},
        #{sourceSequence},
        #{sourceTime},
        #{tags, typeHandler=com.example.JsonbTypeHandler}::jsonb
    )
    on conflict (tenant_id, event_id)
    do nothing
</insert>
```

## 15.3 Service layer classification

```java
public final class TimeQualityClassifier {

    private final Duration lateThreshold;
    private final Duration futureSkewThreshold;

    public TimeQualityClassifier(Duration lateThreshold, Duration futureSkewThreshold) {
        this.lateThreshold = lateThreshold;
        this.futureSkewThreshold = futureSkewThreshold;
    }

    public String classify(Instant eventTime, Instant receivedTime) {
        if (eventTime == null) {
            return "MISSING_SOURCE_TIME";
        }

        if (eventTime.isAfter(receivedTime.plus(futureSkewThreshold))) {
            return "FUTURE_SKEW";
        }

        if (eventTime.isBefore(receivedTime.minus(lateThreshold))) {
            return "LATE";
        }

        return "NORMAL";
    }
}
```

---

## 16. Jersey API: Validasi Timestamp

```java
@Path("/v1/metrics")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class MetricResource {

    private final MetricService metricService;

    @POST
    public Response ingest(MetricSampleRequest request) {
        metricService.ingest(request);
        return Response.accepted().build();
    }
}
```

Service:

```java
public void ingest(MetricSampleRequest request) {
    Instant receivedTime = Instant.now();

    if (request.eventTime() == null) {
        throw new BadRequestException("eventTime is required");
    }

    Instant eventTime = request.eventTime().toInstant();

    String timeQuality = timeQualityClassifier.classify(eventTime, receivedTime);

    MetricSampleRow row = new MetricSampleRow(
        request.tenantId(),
        request.sourceId(),
        request.eventId(),
        request.metricName(),
        eventTime,
        receivedTime,
        request.valueNumeric(),
        request.valueText(),
        "GOOD",
        timeQuality,
        request.sourceSequence(),
        request.sourceTime() == null ? null : request.sourceTime().toInstant(),
        request.tags()
    );

    metricSampleMapper.insertMetricSample(row);
}
```

---

## 17. Query Pattern: Timezone-Safe Dashboard

### Input dari API

```text
from = 2026-07-15T00:00:00+07:00
to   = 2026-07-16T00:00:00+07:00
```

### Java convert ke Instant

```java
Instant from = OffsetDateTime.parse(fromText).toInstant();
Instant to = OffsetDateTime.parse(toText).toInstant();
```

### SQL query

```sql
select
    date_bin(
        interval '15 minutes',
        event_time,
        timestamptz '2026-01-01 00:00:00+00'
    ) as bucket,
    avg(value_numeric) as avg_value
from metric_sample
where tenant_id = #{tenantId}
  and source_id = #{sourceId}
  and metric_name = #{metricName}
  and event_time >= #{from}
  and event_time < #{to}
group by bucket
order by bucket;
```

**Gunakan half-open interval:**

```sql
event_time >= :from
and event_time <  :to
```

Bukan:

```sql
event_time between :from and :to
```

Alasannya: half-open interval mencegah overlap antar window berurutan.

---

## 18. Partition Implication

Kalau table dipartisi berdasarkan `event_time`, query ini bagus:

```sql
where event_time >= :from
  and event_time <  :to
```

Query ini buruk untuk partition pruning bila filter waktu utamanya bukan partition key:

```sql
where ingest_time >= :from
  and ingest_time <  :to
```

Karena partition by `event_time`, filter `ingest_time` tidak cukup untuk memangkas partition berdasarkan waktu kejadian.

### Solusi

Untuk monitoring ingestion, bisa butuh index terpisah:

```sql
create index metric_sample_ingest_time_idx
on metric_sample (ingest_time desc);
```

Tetapi jangan mengganti partition key ke `ingest_time` kalau query bisnis utama berdasarkan `event_time`.

---

## 19. Time Semantics untuk Regulatory / Case Management

Untuk domain enforcement lifecycle/case management, biasanya butuh beberapa jenis waktu:

| Column | Arti |
|---|---|
| `occurred_at` | event domain terjadi |
| `recorded_at` | dicatat oleh sistem |
| `effective_from` | mulai berlaku secara hukum/proses |
| `effective_to` | selesai berlaku |
| `decided_at` | keputusan dibuat |
| `notified_at` | pihak terkait diberi tahu |
| `sla_due_at` | deadline SLA |
| `breached_at` | breach terjadi |
| `corrected_at` | koreksi dibuat |

Contoh event table:

```sql
create table enforcement_case_event (
    tenant_id       bigint not null,
    case_id         uuid not null,
    event_id        uuid not null,
    event_type      text not null,

    occurred_at     timestamptz not null,
    recorded_at     timestamptz not null default clock_timestamp(),
    effective_from  timestamptz,
    effective_to    timestamptz,

    actor_id        text,
    payload         jsonb not null default '{}'::jsonb,

    constraint enforcement_case_event_pk
        primary key (tenant_id, case_id, occurred_at, event_id),

    constraint enforcement_case_event_event_uniq
        unique (tenant_id, event_id),

    constraint enforcement_case_event_effective_chk
        check (
            effective_to is null
            or effective_from is null
            or effective_to > effective_from
        )
)
partition by range (occurred_at);
```

### Kenapa penting?

Karena dalam domain regulatory:

```text
waktu keputusan dibuat
≠ waktu keputusan dicatat
≠ waktu keputusan berlaku
≠ waktu pihak diberi notifikasi
```

Kalau semua dipaksa menjadi `created_at`, audit trail akan lemah.

---

## 20. Anti-Patterns

| Anti-pattern | Dampak |
|---|---|
| Hanya punya `created_at` | event time dan ingest time tercampur |
| Pakai `timestamp` tanpa sadar | timezone offset bisa diabaikan |
| Pakai `LocalDateTime` di API event global | ambiguous, tidak ada offset |
| Query dashboard pakai local string tanpa offset | hasil beda antar timezone/session |
| Partition by `ingest_time`, query by `event_time` | partition pruning tidak efektif |
| `now()` untuk latency per row | nilainya tetap dalam transaksi |
| Tidak menyimpan late/skew status | debugging pipeline sulit |
| `between` untuk window berurutan | risiko double-count boundary |
| Report harian pakai UTC date padahal business timezone lokal | angka harian meleset |
| Correction update tanpa audit | raw history tidak defensible |

---

## 21. Production Checklist

| Checklist | Rekomendasi |
|---|---|
| Event global lintas service | gunakan `timestamptz` |
| API input | wajib ISO-8601 dengan offset |
| Java boundary | `OffsetDateTime` |
| Java internal | `Instant` |
| DB session timezone | UTC |
| Partition key | `event_time` / `occurred_at` |
| Dashboard interval | half-open interval `[from, to)` |
| Ingest default timestamp | `clock_timestamp()` |
| Business date | generated column berdasarkan business timezone |
| Late data | simpan `time_quality` |
| Replay | `event_id` + `ON CONFLICT` |
| Correction | audit event atau correction table |

---

## 22. Minimal Standard yang Saya Rekomendasikan

Untuk semua table time-series production, minimal punya:

```sql
event_id       uuid not null,
event_time     timestamptz not null,
ingest_time    timestamptz not null default clock_timestamp(),
time_quality   text not null default 'NORMAL',

unique (tenant_id, event_id)
```

Untuk query interval:

```sql
where event_time >= :from
  and event_time <  :to
```

Untuk Java:

```java
OffsetDateTime inputTime = request.eventTime();
Instant eventTime = inputTime.toInstant();
```

Untuk API contract:

```json
{
  "eventId": "018f7d42-7b7c-7b1a-9e58-8b2ffbb7b111",
  "eventTime": "2026-07-15T10:00:00+07:00",
  "metricName": "temperature_celsius",
  "valueNumeric": 31.5
}
```

---

# Seri 2/16 Selesai

**Seri 2 selesai.**  
Materi ini menutup fondasi timestamp semantics: `timestamptz`, event time, ingest time, timezone handling, `now()` vs `clock_timestamp()`, late-arriving data, clock skew, replay-safe ingestion, dan dampaknya ke query/partition.

## Rekomendasi materi selanjutnya

Lanjut ke **Seri 3/16 - Native Partitioning Strategy: range partition by time, partition granularity, tenant/source subpartition, constraint, index per partition, dan query pruning**.

---

**Sources:**

- [PostgreSQL: Documentation: 18: 8.5. Date/Time Types](https://www.postgresql.org/docs/current/datatype-datetime.html)

## Response:
7/15/2026, 8:29:55 PM

Saya lanjut ke **Seri 3/16**. Fokusnya native PostgreSQL partitioning yang benar-benar operasional: desain parent/child table, granularity, index, pruning, automation risk, dan pola query yang membuat partitioning bekerja.

# PostgreSQL Time-Series Database - Seri 3/16  
## Native Partitioning Strategy: Range Partition by Time, Granularity, Subpartition, Constraint, Index, dan Query Pruning

**Status:** Seri 3 dari 16.  
Fokus seri ini: cara memakai **native PostgreSQL declarative partitioning** untuk table time-series production, terutama agar query range cepat, retention mudah, dan ingestion tetap aman.

---

## 1. Mental Model Partitioning

Partitioning berarti satu logical table dipecah menjadi beberapa physical table kecil. Di PostgreSQL, table utama disebut **partitioned table**, sedangkan table fisiknya disebut **partition**. Declarative partitioning mendukung metode seperti `RANGE`, `LIST`, dan `HASH`; untuk time-series, pola paling umum adalah `RANGE` berdasarkan timestamp. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html?utm_source=chatgpt.com))

```text
metric_sample
│
├── metric_sample_2026_07_15
├── metric_sample_2026_07_16
├── metric_sample_2026_07_17
└── metric_sample_2026_07_18
```

Untuk time-series, tujuan partitioning biasanya:

| Tujuan | Manfaat |
|---|---|
| Query range lebih cepat | PostgreSQL bisa skip partition yang tidak relevan |
| Retention lebih murah | Drop/detach partition lama, bukan delete jutaan row |
| Maintenance lebih manageable | Vacuum, analyze, index maintenance lebih kecil per partition |
| Data lifecycle jelas | Raw data, hot data, old data bisa diperlakukan berbeda |

---

## 2. Kapan Time-Series Perlu Partitioning?

Partitioning tidak otomatis membuat semua query lebih cepat. Ia paling berguna jika table besar, query selalu punya filter waktu, dan lifecycle data berbasis periode.

| Kondisi | Partitioning? |
|---|---|
| Table kecil, < beberapa juta row | Belum wajib |
| Query selalu by `event_time` range | Ya, cocok |
| Retention perlu hapus data lama | Ya, sangat cocok |
| High ingest per hari | Ya, biasanya perlu |
| Query mostly by `id` tanpa time range | Partitioning by time kurang berguna |
| Data sering update random | Hati-hati, maintenance bisa naik |
| Data append-only | Sangat cocok |

**Rule praktis:**  
Partitioning time-series efektif jika hampir semua query penting punya predicate seperti:

```sql
where event_time >= :from
  and event_time <  :to
```

---

## 3. Parent Table Design

Contoh baseline table time-series:

```sql
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_id        uuid not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    value_numeric   numeric,
    value_quality   text not null default 'GOOD',
    time_quality    text not null default 'NORMAL',
    tags            jsonb not null default '{}'::jsonb,

    constraint metric_sample_value_quality_chk
        check (value_quality in ('GOOD', 'BAD', 'ESTIMATED', 'MISSING')),

    constraint metric_sample_time_quality_chk
        check (time_quality in (
            'NORMAL',
            'LATE',
            'FUTURE_SKEW',
            'MISSING_SOURCE_TIME',
            'REPLAYED',
            'CORRECTED'
        ))
)
partition by range (event_time);
```

Deklarasi `PARTITION BY RANGE (event_time)` membuat `metric_sample` menjadi partitioned table, bukan table biasa yang menyimpan data langsung. Row akan diarahkan ke partition yang range-nya cocok. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html?utm_source=chatgpt.com))

---

## 4. Membuat Partition Harian

Untuk workload high-ingest, partition harian sering menjadi baseline awal.

```sql
create table metric_sample_2026_07_15
partition of metric_sample
for values from ('2026-07-15 00:00:00+00')
to              ('2026-07-16 00:00:00+00');

create table metric_sample_2026_07_16
partition of metric_sample
for values from ('2026-07-16 00:00:00+00')
to              ('2026-07-17 00:00:00+00');
```

Gunakan boundary UTC agar konsisten lintas service. Untuk reporting lokal seperti Asia/Jakarta, lakukan konversi di query/reporting layer, bukan dengan mengganti partition boundary menjadi lokal tanpa alasan kuat.

---

## 5. Granularity: Harian, Mingguan, Bulanan?

Pilihan partition granularity harus mengikuti **volume data**, **query window**, **retention**, dan **jumlah partition aktif**.

| Granularity | Cocok untuk | Risiko |
|---|---|---|
| Hourly | sangat high ingest, observability ekstrem | terlalu banyak partition |
| Daily | umum untuk high-volume time-series | butuh automation rapi |
| Weekly | volume sedang, query mingguan | drop retention kurang presisi |
| Monthly | volume kecil/sedang, reporting bulanan | partition terlalu besar jika ingest tinggi |

Rekomendasi awal:

| Volume ingest | Rekomendasi awal |
|---|---|
| < 1 juta row/hari | monthly atau weekly |
| 1-50 juta row/hari | daily |
| > 50 juta row/hari | daily, atau hourly jika query/maintenance menuntut |
| Retention sangat presisi harian | daily |
| Query selalu 15 menit-24 jam | daily biasanya aman |
| Query mayoritas bulanan/tahunan | daily + rollup, jangan scan raw bulanan terus |

**Jangan pilih hourly partition hanya karena terlihat “lebih scalable”.** Terlalu banyak partition bisa memperberat planning, maintenance, dan operasi schema.

---

## 6. Partition Key: Biasanya `event_time`, Bukan `ingest_time`

Untuk time-series domain, partition key biasanya:

```sql
partition by range (event_time)
```

Karena query utama biasanya:

```sql
where event_time >= :from
  and event_time <  :to
```

Jangan memakai `ingest_time` sebagai partition key jika dashboard, analytics, retention domain, dan SLA query semuanya berdasarkan `event_time`.

| Partition key | Cocok untuk |
|---|---|
| `event_time` | analytics, dashboard, metric/event timeline |
| `ingest_time` | ingestion monitoring, raw pipeline log |
| `business_date` | reporting regulatory berbasis tanggal bisnis |
| `created_at` | audit internal sederhana, bukan event time-series utama |

Kalau data bisa late-arriving, partition lama harus tetap bisa menerima insert sampai lateness window selesai.

---

## 7. Default Partition: Perlu atau Tidak?

Default partition menangkap row yang tidak masuk ke range partition mana pun.

```sql
create table metric_sample_default
partition of metric_sample
default;
```

### Kapan berguna?

| Berguna | Tidak ideal |
|---|---|
| mencegah ingest gagal saat partition belum dibuat | bisa menyembunyikan masalah automation |
| emergency safety net | query default partition bisa membesar diam-diam |
| debugging out-of-range data | perlu monitoring ketat |

Rekomendasi production: boleh ada default partition, tetapi harus dimonitor. Kalau ada row masuk default partition, itu harus dianggap **operational warning**, bukan kondisi normal.

```sql
select count(*)
from metric_sample_default;
```

---

## 8. Constraint dan Unique Key pada Partitioned Table

Ini bagian penting. Pada PostgreSQL partitioned table, unique/primary key di parent memiliki batasan: constraint unik harus mencakup semua partition key agar uniqueness bisa ditegakkan dengan benar lintas partition. PostgreSQL documentation menjelaskan bahwa unique/primary key pada partitioned table harus menyertakan semua partition key columns dan partition key tidak boleh berupa expression/function untuk constraint tersebut. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html?utm_source=chatgpt.com))

Artinya ini **bermasalah** jika table dipartisi by `event_time`:

```sql
-- Tidak cocok sebagai global uniqueness di partitioned table by event_time
unique (tenant_id, event_id)
```

Karena tidak menyertakan `event_time`.

Yang valid secara native:

```sql
unique (tenant_id, event_id, event_time)
```

atau:

```sql
primary key (tenant_id, source_id, metric_name, event_time)
```

### Design implication

Kalau Anda butuh global uniqueness untuk `event_id` tanpa memasukkan `event_time`, opsinya:

| Opsi | Penjelasan |
|---|---|
| Sertakan `event_time` di unique key | paling native dan sederhana |
| Buat idempotency table terpisah | cocok untuk replay detection global |
| Gunakan unpartitioned inbox table | dedup dulu sebelum masuk raw partitioned table |
| Gunakan trigger/custom logic | bisa, tapi lebih kompleks |
| Gunakan partition key yang ikut unique key | kadang tidak cocok untuk query |

---

## 9. Pattern: Idempotency Table Terpisah

Untuk enterprise ingestion, saya sering lebih suka memisahkan dedup dari raw data.

```sql
create table ingestion_event_registry (
    tenant_id       bigint not null,
    event_id        uuid not null,
    first_seen_at   timestamptz not null default clock_timestamp(),

    constraint ingestion_event_registry_pk
        primary key (tenant_id, event_id)
);
```

Lalu service melakukan:

```sql
insert into ingestion_event_registry (
    tenant_id,
    event_id
)
values (
    #{tenantId},
    #{eventId}
)
on conflict do nothing;
```

Jika insert menghasilkan row count `1`, lanjut insert ke `metric_sample`. Jika row count `0`, berarti duplicate/replay.

### Kenapa ini praktis?

| Keuntungan | Trade-off |
|---|---|
| global dedup lebih jelas | butuh tambahan write |
| tidak tergantung partition key | perlu lifecycle registry |
| bagus untuk Kafka/RabbitMQ retry | perlu transaction boundary benar |
| mudah diaudit | storage tambahan |

---

## 10. Index pada Partitioned Table

Saat membuat index pada parent partitioned table:

```sql
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
);
```

PostgreSQL akan membuat partitioned index di parent dan index terkait pada partition. Index tetap bekerja di level partition fisik. Dokumentasi `ALTER TABLE ATTACH PARTITION` juga menjelaskan bahwa unique dan primary key constraint dari parent dibuat di partition jika belum ada. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-altertable.html?utm_source=chatgpt.com))

### Index baseline untuk time-series

```sql
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
);

create index metric_sample_event_time_brin_idx
on metric_sample using brin (
    event_time
);

create index metric_sample_ingest_time_idx
on metric_sample (
    ingest_time desc
);
```

| Index | Fungsi |
|---|---|
| `(tenant_id, source_id, metric_name, event_time desc)` | query timeline/latest value |
| `BRIN(event_time)` | scan range besar pada append-heavy table |
| `(ingest_time desc)` | monitoring ingestion terbaru |
| partial index hot data | mempercepat query recent data tertentu |

---

## 11. Partition Pruning

Partition pruning adalah optimasi agar PostgreSQL hanya membaca partition yang relevan. Planner dapat mengeliminasi partition dari query plan jika predicate query cocok dengan partition key. Setting `enable_partition_pruning` mengontrol kemampuan planner/executor untuk menghapus partition yang tidak diperlukan, dan default-nya `on`. ([PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-query.html?utm_source=chatgpt.com))

Query bagus:

```sql
select
    event_time,
    value_numeric
from metric_sample
where tenant_id = 10
  and source_id = 1001
  and metric_name = 'temperature_celsius'
  and event_time >= timestamptz '2026-07-15 00:00:00+00'
  and event_time <  timestamptz '2026-07-16 00:00:00+00'
order by event_time;
```

Query buruk untuk pruning:

```sql
select *
from metric_sample
where date(event_time) = date '2026-07-15';
```

Kenapa buruk? Karena partition key dibungkus fungsi `date(event_time)`. Lebih aman pakai range eksplisit:

```sql
where event_time >= timestamptz '2026-07-15 00:00:00+00'
  and event_time <  timestamptz '2026-07-16 00:00:00+00'
```

---

## 12. Cek Partition Pruning dengan `EXPLAIN`

Gunakan:

```sql
explain analyze
select
    event_time,
    value_numeric
from metric_sample
where tenant_id = 10
  and source_id = 1001
  and metric_name = 'temperature_celsius'
  and event_time >= timestamptz '2026-07-15 00:00:00+00'
  and event_time <  timestamptz '2026-07-16 00:00:00+00';
```

Yang ingin Anda lihat: hanya partition tanggal terkait yang disentuh.

Contoh shape yang baik:

```text
Index Scan using metric_sample_2026_07_15_lookup_idx
on metric_sample_2026_07_15
```

Shape yang mencurigakan:

```text
Append
  -> Seq Scan on metric_sample_2026_07_01
  -> Seq Scan on metric_sample_2026_07_02
  -> Seq Scan on metric_sample_2026_07_03
  ...
```

Kalau banyak partition discan padahal query hanya satu hari, kemungkinan predicate tidak cocok dengan partition key.

---

## 13. Subpartition: Perlu atau Tidak?

Subpartition bisa dilakukan, misalnya partition by `event_time`, lalu subpartition by `tenant_id` atau hash `source_id`.

```sql
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_time      timestamptz not null,
    value_numeric   numeric
)
partition by range (event_time);
```

Partition harian yang di-subpartition hash tenant:

```sql
create table metric_sample_2026_07_15
partition of metric_sample
for values from ('2026-07-15 00:00:00+00')
to              ('2026-07-16 00:00:00+00')
partition by hash (tenant_id);

create table metric_sample_2026_07_15_h0
partition of metric_sample_2026_07_15
for values with (modulus 4, remainder 0);

create table metric_sample_2026_07_15_h1
partition of metric_sample_2026_07_15
for values with (modulus 4, remainder 1);

create table metric_sample_2026_07_15_h2
partition of metric_sample_2026_07_15
for values with (modulus 4, remainder 2);

create table metric_sample_2026_07_15_h3
partition of metric_sample_2026_07_15
for values with (modulus 4, remainder 3);
```

### Kapan subpartition layak?

| Layak | Jangan dulu |
|---|---|
| multi-tenant sangat besar | volume masih sedang |
| tenant/source sangat skewed | belum punya evidence |
| maintenance per tenant perlu dipisah | query belum stabil |
| partition harian masih terlalu besar | operational complexity belum siap |

**Rekomendasi:** mulai dengan single-level range partition by time. Tambahkan subpartition hanya setelah ada bukti bottleneck.

---

## 14. Partition Creation Automation

Masalah production klasik:

```text
ERROR: no partition of relation "metric_sample" found for row
```

Ini terjadi saat data masuk untuk waktu yang belum punya partition.

### Buat future partition secara scheduled

Misalnya create partition 7 hari ke depan:

```sql
create table if not exists metric_sample_2026_07_17
partition of metric_sample
for values from ('2026-07-17 00:00:00+00')
to              ('2026-07-18 00:00:00+00');
```

Di production, DDL seperti ini biasanya dijalankan oleh:

| Mekanisme | Cocok untuk |
|---|---|
| migration tool | partition awal / bootstrap |
| scheduled DB job | rolling future partition |
| admin service | controlled operation |
| pg_partman | automation khusus partition management |
| Kubernetes CronJob | environment cloud/on-prem hybrid |

Untuk sistem enterprise, saya sarankan minimal punya job yang membuat partition **N hari ke depan** dan alert jika partition masa depan belum tersedia.

---

## 15. Retention: Drop Partition, Bukan Delete Row

Untuk menghapus data lama, jangan:

```sql
delete from metric_sample
where event_time < now() - interval '90 days';
```

Lebih baik:

```sql
drop table metric_sample_2026_04_01;
```

Atau lebih aman bertahap:

```sql
alter table metric_sample
detach partition metric_sample_2026_04_01;

-- backup/archive/verify if needed

drop table metric_sample_2026_04_01;
```

PostgreSQL docs juga menekankan partitioning dapat membantu penghapusan data lama secara cepat melalui penghapusan partition yang tidak lagi diperlukan, dibanding operasi delete besar pada table monolitik. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html?utm_source=chatgpt.com))

### Retention pattern

| Data | Retention |
|---|---|
| raw metric | 7-90 hari |
| hourly rollup | 6-24 bulan |
| daily rollup | beberapa tahun |
| regulatory event | sesuai legal/regulatory retention |
| ingestion registry | minimal sepanjang replay window |

---

## 16. Late-Arriving Data dan Partition

Kalau data bisa datang terlambat 7 hari, maka partition 7 hari ke belakang harus tetap ada dan writable.

Contoh policy:

```text
raw data retention        = 90 hari
late arrival max accepted = 7 hari
future skew accepted      = 2 menit
future partitions         = 7 hari ke depan
```

### Query late data

```sql
select
    count(*) as late_count
from metric_sample
where ingest_time >= clock_timestamp() - interval '1 hour'
  and event_time < ingest_time - interval '5 minutes';
```

### Reject terlalu lama

Di service layer:

```java
if (eventTime.isBefore(receivedTime.minus(Duration.ofDays(7)))) {
    throw new BadRequestException("eventTime is outside accepted lateness window");
}
```

Atau route ke backfill path, bukan online ingest endpoint.

---

## 17. Backfill Strategy dengan Partition

Backfill data historis harus hati-hati karena bisa menghantam partition lama.

### Pattern aman

```text
1. Create/verify historical partitions
2. Load ke staging table
3. Validate row count, min/max event_time, duplicate
4. Insert ke partitioned table
5. Analyze affected partitions
6. Refresh rollup/materialized view untuk window terdampak
```

Contoh staging:

```sql
create table metric_sample_staging (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_id        uuid not null,
    metric_name     text not null,
    event_time      timestamptz not null,
    value_numeric   numeric,
    tags            jsonb not null default '{}'::jsonb
);
```

Insert dari staging:

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    tags
)
select
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    tags
from metric_sample_staging
where event_time >= timestamptz '2026-07-01 00:00:00+00'
  and event_time <  timestamptz '2026-07-02 00:00:00+00';
```

---

## 18. MyBatis Mapper untuk Query Partition-Friendly

### Mapper method

```java
public interface MetricSampleMapper {

    List<MetricSamplePoint> findMetricSeries(
        @Param("tenantId") long tenantId,
        @Param("sourceId") long sourceId,
        @Param("metricName") String metricName,
        @Param("from") Instant from,
        @Param("to") Instant to
    );
}
```

### XML mapper

```xml
<select id="findMetricSeries" resultType="com.example.MetricSamplePoint">
    select
        event_time as eventTime,
        value_numeric as valueNumeric,
        value_quality as valueQuality,
        time_quality as timeQuality
    from metric_sample
    where tenant_id = #{tenantId}
      and source_id = #{sourceId}
      and metric_name = #{metricName}
      and event_time >= #{from}
      and event_time <  #{to}
    order by event_time
</select>
```

Ini partition-friendly karena filter `event_time` berupa range langsung.

---

## 19. Anti-Pattern Query di MyBatis

### Anti-pattern 1: convert column di WHERE

```xml
where date(event_time) = #{date}
```

Lebih baik:

```xml
where event_time >= #{from}
  and event_time <  #{to}
```

### Anti-pattern 2: optional time predicate

```xml
<where>
    tenant_id = #{tenantId}
    <if test="from != null">
        and event_time >= #{from}
    </if>
</where>
```

Untuk time-series endpoint, jangan buat `from/to` opsional jika table besar. Wajibkan range.

### Anti-pattern 3: unlimited dashboard query

```sql
select *
from metric_sample
where tenant_id = 10
order by event_time desc;
```

Lebih baik:

```sql
where tenant_id = 10
  and event_time >= now() - interval '24 hours'
order by event_time desc
limit 1000;
```

---

## 20. Jersey API Contract untuk Query Range

Endpoint:

```java
@GET
@Path("/v1/metrics/{sourceId}/{metricName}")
public Response getSeries(
    @PathParam("sourceId") long sourceId,
    @PathParam("metricName") String metricName,
    @QueryParam("from") String fromText,
    @QueryParam("to") String toText
) {
    Instant from = OffsetDateTime.parse(fromText).toInstant();
    Instant to = OffsetDateTime.parse(toText).toInstant();

    if (!from.isBefore(to)) {
        throw new BadRequestException("from must be before to");
    }

    Duration range = Duration.between(from, to);
    if (range.compareTo(Duration.ofDays(31)) > 0) {
        throw new BadRequestException("range too large; use rollup endpoint");
    }

    return Response.ok(metricService.findSeries(sourceId, metricName, from, to)).build();
}
```

### Production rule

| Endpoint | Max range |
|---|---|
| raw data query | 1-31 hari |
| dashboard recent | 24 jam-7 hari |
| rollup hourly | 1-12 bulan |
| rollup daily | multi-year |

Jangan biarkan endpoint raw time-series menjadi reporting API tak terbatas.

---

## 21. Operational Checks

### 21.1 Cek partition list

```sql
select
    inhrelid::regclass as partition_name
from pg_inherits
where inhparent = 'metric_sample'::regclass
order by partition_name;
```

### 21.2 Cek partition size

```sql
select
    inhrelid::regclass as partition_name,
    pg_size_pretty(pg_total_relation_size(inhrelid)) as total_size
from pg_inherits
where inhparent = 'metric_sample'::regclass
order by pg_total_relation_size(inhrelid) desc;
```

### 21.3 Cek partition masa depan

```sql
select
    count(*) as future_partition_count
from pg_inherits
where inhparent = 'metric_sample'::regclass
  and inhrelid::regclass::text >= 'metric_sample_2026_07_16';
```

Untuk production, query ini biasanya dibuat lebih robust dengan metadata table khusus.

---

## 22. Metadata Table untuk Partition Management

Buat table metadata agar operasi tidak hanya bergantung pada parsing nama partition.

```sql
create table time_partition_registry (
    table_name       text not null,
    partition_name   text not null,
    range_from       timestamptz not null,
    range_to         timestamptz not null,
    status           text not null default 'ACTIVE',
    created_at       timestamptz not null default clock_timestamp(),

    constraint time_partition_registry_pk
        primary key (table_name, partition_name),

    constraint time_partition_registry_status_chk
        check (status in ('PLANNED', 'ACTIVE', 'DETACHED', 'DROPPED'))
);
```

Contoh isi:

```sql
insert into time_partition_registry (
    table_name,
    partition_name,
    range_from,
    range_to
)
values (
    'metric_sample',
    'metric_sample_2026_07_15',
    '2026-07-15 00:00:00+00',
    '2026-07-16 00:00:00+00'
);
```

Manfaat:

| Manfaat | Penjelasan |
|---|---|
| audit DDL | tahu partition dibuat kapan |
| automation safety | tahu partition mana yang expected |
| retention safety | bisa mark sebelum drop |
| monitoring | cek future partition lebih mudah |

---

## 23. Production Runbook: Missing Partition

### Gejala

```text
ERROR: no partition of relation "metric_sample" found for row
```

### Langkah respon

```text
1. Ambil event_time dari error/log
2. Cek apakah partition range tersebut ada
3. Jika tidak ada, create partition
4. Reprocess failed messages
5. Cek default partition jika ada
6. Perbaiki scheduled partition job
7. Tambahkan alert untuk future partition coverage
```

### SQL emergency

```sql
create table metric_sample_2026_07_20
partition of metric_sample
for values from ('2026-07-20 00:00:00+00')
to              ('2026-07-21 00:00:00+00');
```

---

## 24. Production Runbook: Query Tidak Pakai Partition Pruning

### Gejala

```text
Query lambat
EXPLAIN menunjukkan Append scan banyak partition
```

### Investigasi

```text
1. Apakah WHERE punya event_time range?
2. Apakah event_time dibungkus function?
3. Apakah parameter bertipe benar?
4. Apakah query memakai OR yang mengaburkan predicate?
5. Apakah partition key sesuai query utama?
6. Apakah statistics/analyze terbaru?
```

### Fix umum

Ubah:

```sql
where date(event_time) = date '2026-07-15'
```

Menjadi:

```sql
where event_time >= timestamptz '2026-07-15 00:00:00+00'
  and event_time <  timestamptz '2026-07-16 00:00:00+00'
```

---

## 25. Design Pattern Final: Native Partitioned Metric Table

```sql
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_id        uuid not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    value_numeric   numeric,
    value_text      text,
    value_quality   text not null default 'GOOD',
    time_quality    text not null default 'NORMAL',
    tags            jsonb not null default '{}'::jsonb,

    constraint metric_sample_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            event_time,
            event_id
        ),

    constraint metric_sample_value_chk
        check (
            value_numeric is not null
            or value_text is not null
        ),

    constraint metric_sample_value_quality_chk
        check (value_quality in ('GOOD', 'BAD', 'ESTIMATED', 'MISSING')),

    constraint metric_sample_time_quality_chk
        check (time_quality in (
            'NORMAL',
            'LATE',
            'FUTURE_SKEW',
            'MISSING_SOURCE_TIME',
            'REPLAYED',
            'CORRECTED'
        ))
)
partition by range (event_time);
```

Indexes:

```sql
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
);

create index metric_sample_event_time_brin_idx
on metric_sample using brin (
    event_time
);

create index metric_sample_ingest_time_idx
on metric_sample (
    ingest_time desc
);
```

Sample partition:

```sql
create table metric_sample_2026_07_15
partition of metric_sample
for values from ('2026-07-15 00:00:00+00')
to              ('2026-07-16 00:00:00+00');
```

---

## 26. Checklist Native Partitioning

| Checklist | Target |
|---|---|
| Partition key jelas | `event_time` untuk analytics |
| Query pakai half-open interval | `>= from and < to` |
| Granularity jelas | daily/weekly/monthly berdasarkan volume |
| Future partition tersedia | minimal N hari ke depan |
| Retention strategy jelas | detach/drop partition |
| Default partition dimonitor | tidak boleh jadi tempat data normal |
| Unique constraint valid | mencakup partition key |
| Idempotency global | pakai registry jika perlu |
| Index parent dibuat | lookup index + BRIN bila cocok |
| `EXPLAIN ANALYZE` dicek | pastikan pruning terjadi |
| Backfill path terpisah | jangan campur online ingest besar |
| Runbook tersedia | missing partition, query slow, retention mistake |

---

# Seri 3/16 Selesai

**Seri 3 selesai.**  
Materi ini menutup native partitioning strategy: range partition by time, granularity, default partition, unique constraint limitation, index strategy, query pruning, subpartition, partition automation, retention, backfill, serta integrasi query dengan Jersey/MyBatis.

## Rekomendasi materi selanjutnya

Lanjut ke **Seri 4/16 - Partition Lifecycle: create future partition, detach/drop old partition, retention policy, partition automation, migration tooling, dan operational safety**.

---

**Sources:**

- [Documentation: 18: 5.12. Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:31:41 PM

Saya lanjut ke **Seri 4/16**. Bagian ini akan lebih operasional: lifecycle partition dari creation, future coverage, detach/drop retention, automation job, safety guard, sampai runbook incident.

# PostgreSQL Time-Series Database - Seri 4/16  
## Partition Lifecycle: Future Partition, Retention, Detach/Drop, Automation, Migration Tooling, dan Operational Safety

**Status:** Seri 4 dari 16.  
Fokus seri ini: bagaimana partition time-series dikelola setelah table dibuat. Di production, partitioning bukan hanya DDL awal; ia adalah **operational lifecycle** yang harus otomatis, terukur, aman terhadap data loss, dan punya runbook incident.

---

## 1. Mental Model Partition Lifecycle

Partition lifecycle untuk time-series biasanya seperti ini:

```text id="dlu2ax"
PLANNED
  │
  ├─ create future partition
  │
ACTIVE
  │
  ├─ menerima insert/query
  │
CLOSED
  │
  ├─ tidak lagi menerima normal ingest
  │
  ├─ masih bisa menerima late/backfill jika policy mengizinkan
  │
RETENTION_CANDIDATE
  │
  ├─ siap diarsipkan / detached
  │
DETACHED
  │
  ├─ keluar dari parent table
  │
  ├─ bisa di-backup/export/verify
  │
DROPPED / ARCHIVED
```

PostgreSQL documentation menyatakan bahwa menghapus data lama dengan `DROP TABLE` pada partition atau `ALTER TABLE DETACH PARTITION` jauh lebih cepat daripada bulk `DELETE`, dan menghindari overhead `VACUUM` dari delete besar. Ini alasan utama partition lifecycle sangat penting untuk time-series. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html))

---

## 2. Core Lifecycle Responsibilities

Untuk PostgreSQL time-series production, minimal ada 6 tanggung jawab lifecycle:

| Responsibility | Tujuan |
|---|---|
| **Create future partitions** | insert masa depan tidak gagal |
| **Monitor missing/default partition** | deteksi automation failure |
| **Close old hot partitions** | kurangi maintenance aktif |
| **Detach retention candidate** | keluarkan data lama dari parent secara aman |
| **Drop/archive old partitions** | kontrol storage |
| **Audit lifecycle operation** | defensibility dan incident analysis |

---

## 3. Baseline Partition Registry

Jangan hanya mengandalkan nama table seperti `metric_sample_2026_07_15`. Buat registry agar lifecycle bisa diaudit.

```sql id="zdr5xf"
create table time_partition_registry (
    parent_table      text not null,
    partition_table   text not null,
    range_from        timestamptz not null,
    range_to          timestamptz not null,

    lifecycle_status  text not null default 'PLANNED',
    created_at        timestamptz not null default clock_timestamp(),
    activated_at      timestamptz,
    detached_at       timestamptz,
    dropped_at        timestamptz,

    row_count_snapshot bigint,
    size_snapshot      bigint,

    note              text,

    constraint time_partition_registry_pk
        primary key (parent_table, partition_table),

    constraint time_partition_registry_status_chk
        check (
            lifecycle_status in (
                'PLANNED',
                'ACTIVE',
                'CLOSED',
                'RETENTION_CANDIDATE',
                'DETACHED',
                'DROPPED',
                'FAILED'
            )
        ),

    constraint time_partition_registry_range_chk
        check (range_to > range_from)
);
```

### Kenapa registry penting?

| Tanpa registry | Dengan registry |
|---|---|
| Sulit tahu partition mana expected | Ada daftar planned/active |
| Retention rawan salah drop | Bisa validasi status sebelum drop |
| Incident sulit diinvestigasi | Ada audit trail lifecycle |
| Automation tergantung parsing nama | Query metadata lebih stabil |

---

## 4. Naming Convention Partition

Gunakan naming yang predictable dan sortable.

```text id="md7qpg"
metric_sample_YYYY_MM_DD
metric_sample_2026_07_15
metric_sample_2026_07_16
```

Untuk monthly:

```text id="7az6ob"
metric_sample_2026_07
metric_sample_2026_08
```

Untuk hourly:

```text id="j0894v"
metric_sample_2026_07_15_13
```

### Rule praktis

| Rule | Alasan |
|---|---|
| Sertakan parent table prefix | mudah dicari |
| Gunakan UTC boundary | konsisten lintas service |
| Hindari nama terlalu panjang | PostgreSQL identifier limit bisa jadi masalah |
| Jangan encode tenant/source jika tidak subpartition | lifecycle makin rumit |
| Registry tetap jadi source of truth | nama table hanya convenience |

---

## 5. Create Future Partition: Manual Baseline

Misalnya parent table:

```sql id="gkrf3x"
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    metric_name     text not null,
    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),
    value_numeric   numeric
)
partition by range (event_time);
```

Create partition harian:

```sql id="wukifa"
create table if not exists metric_sample_2026_07_15
partition of metric_sample
for values from ('2026-07-15 00:00:00+00')
to              ('2026-07-16 00:00:00+00');
```

Kalau parent punya index, PostgreSQL akan membuat index terkait pada partition ketika partition dibuat dari parent structure/index yang relevan. Saat `ATTACH PARTITION`, PostgreSQL juga membuat atau menghubungkan index partition yang sesuai dengan index pada parent table. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-altertable.html))

---

## 6. Create Future Partition: PL/pgSQL Function

Contoh function untuk membuat partition harian satu tanggal.

```sql id="2z1l5x"
create or replace function create_metric_sample_daily_partition(
    p_day date
)
returns void
language plpgsql
as $$
declare
    v_partition_name text;
    v_from timestamptz;
    v_to timestamptz;
begin
    v_partition_name := format(
        'metric_sample_%s',
        to_char(p_day, 'YYYY_MM_DD')
    );

    v_from := p_day::timestamptz;
    v_to := (p_day + 1)::timestamptz;

    execute format(
        'create table if not exists %I partition of metric_sample
         for values from (%L) to (%L)',
        v_partition_name,
        v_from,
        v_to
    );

    insert into time_partition_registry (
        parent_table,
        partition_table,
        range_from,
        range_to,
        lifecycle_status,
        activated_at
    )
    values (
        'metric_sample',
        v_partition_name,
        v_from,
        v_to,
        'ACTIVE',
        clock_timestamp()
    )
    on conflict (parent_table, partition_table)
    do update set
        lifecycle_status = 'ACTIVE',
        activated_at = coalesce(
            time_partition_registry.activated_at,
            excluded.activated_at
        );
end;
$$;
```

### Catatan penting

`p_day::timestamptz` memakai timezone session. Untuk production, pastikan session/job timezone diset ke UTC atau buat boundary secara eksplisit.

Lebih aman:

```sql id="lxg52p"
v_from := make_timestamptz(
    extract(year from p_day)::int,
    extract(month from p_day)::int,
    extract(day from p_day)::int,
    0, 0, 0,
    'UTC'
);
```

---

## 7. Create N Future Partitions

Contoh procedure untuk membuat partition 14 hari ke depan.

```sql id="l0bcb1"
create or replace function ensure_metric_sample_future_partitions(
    p_days_ahead integer default 14
)
returns void
language plpgsql
as $$
declare
    v_day date;
begin
    if p_days_ahead < 1 or p_days_ahead > 90 then
        raise exception 'p_days_ahead must be between 1 and 90';
    end if;

    for v_day in
        select generate_series(
            current_date,
            current_date + p_days_ahead,
            interval '1 day'
        )::date
    loop
        perform create_metric_sample_daily_partition(v_day);
    end loop;
end;
$$;
```

Run manual:

```sql id="ueqams"
select ensure_metric_sample_future_partitions(14);
```

---

## 8. Future Partition Coverage Check

Buat health check agar service tahu apakah partition masa depan aman.

```sql id="wdd78g"
create or replace view metric_sample_partition_coverage as
select
    min(range_from) filter (
        where range_from <= clock_timestamp()
          and range_to > clock_timestamp()
    ) as current_partition_from,

    max(range_to) filter (
        where lifecycle_status = 'ACTIVE'
    ) as active_covered_until,

    count(*) filter (
        where lifecycle_status = 'ACTIVE'
          and range_from >= date_trunc('day', clock_timestamp())
    ) as future_active_partition_count
from time_partition_registry
where parent_table = 'metric_sample';
```

Query:

```sql id="lo964l"
select *
from metric_sample_partition_coverage;
```

Interpretasi:

| Kondisi | Status |
|---|---|
| `active_covered_until >= now() + interval '7 days'` | sehat |
| coverage kurang dari 2 hari | warning |
| tidak ada current partition | critical |
| future partition count = 0 | critical |

---

## 9. Scheduling Partition Maintenance

Ada tiga pola umum:

```text id="zkxmtm"
Option A: external scheduler
  - Kubernetes CronJob
  - Linux cron
  - CI/CD scheduled job
  - Airflow/Control-M/etc

Option B: database scheduler
  - pg_cron

Option C: partition manager extension
  - pg_partman
```

### Decision matrix

| Approach | Cocok untuk | Catatan |
|---|---|---|
| Kubernetes CronJob | service on-prem/cloud hybrid | mudah diobservasi via platform |
| Linux cron | on-prem sederhana | rawan snowflake server |
| CI/CD scheduled pipeline | controlled DDL | kurang cocok untuk frequent job |
| `pg_cron` | job ringan dalam DB | butuh extension dan permission |
| `pg_partman` | partition lifecycle otomatis | bagus jika extension diizinkan |

`pg_cron` adalah job scheduler berbasis cron yang berjalan di dalam PostgreSQL sebagai extension, dengan background worker yang melacak job pada table `cron.job`; ia juga memastikan satu instance dari job yang sama tidak berjalan bersamaan, melainkan queue jika trigger berikutnya datang sebelum run sebelumnya selesai. ([GitHub](https://github.com/citusdata/pg_cron))

---

## 10. Scheduling dengan `pg_cron`

Contoh enable extension:

```sql id="fj8fqh"
create extension if not exists pg_cron;
```

Pada managed service seperti Amazon RDS, setup `pg_cron` memerlukan konfigurasi `shared_preload_libraries`, restart DB instance, lalu `CREATE EXTENSION pg_cron`; AWS juga mencatat metadata `pg_cron` berada di database default `postgres` dan permission perlu diberikan dengan hati-hati. ([AWS Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL_pg_cron.html))

Contoh schedule harian jam 00:05 UTC:

```sql id="vqh2ne"
select cron.schedule(
    'metric-sample-create-future-partitions',
    '5 0 * * *',
    $$select ensure_metric_sample_future_partitions(14);$$
);
```

Cek job:

```sql id="e5gky7"
select *
from cron.job
where jobname = 'metric-sample-create-future-partitions';
```

Cek run detail:

```sql id="jzhchf"
select *
from cron.job_run_details
where jobid = (
    select jobid
    from cron.job
    where jobname = 'metric-sample-create-future-partitions'
)
order by start_time desc
limit 20;
```

---

## 11. Scheduling dengan Kubernetes CronJob

Untuk environment Docker/Kubernetes, pola ini sering lebih mudah diaudit oleh tim platform.

```yaml id="qcfsxf"
apiVersion: batch/v1
kind: CronJob
metadata:
  name: metric-sample-partition-maintenance
spec:
  schedule: "5 0 * * *"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 5
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: partition-maintenance
              image: postgres:17
              env:
                - name: PGHOST
                  valueFrom:
                    secretKeyRef:
                      name: app-db
                      key: host
                - name: PGDATABASE
                  value: appdb
                - name: PGUSER
                  valueFrom:
                    secretKeyRef:
                      name: app-db
                      key: username
                - name: PGPASSWORD
                  valueFrom:
                    secretKeyRef:
                      name: app-db
                      key: password
              command:
                - /bin/sh
                - -c
                - |
                  psql -v ON_ERROR_STOP=1 \
                    -c "set time zone 'UTC'; select ensure_metric_sample_future_partitions(14);"
```

### Production notes

| Setting | Rekomendasi |
|---|---|
| `concurrencyPolicy` | `Forbid` agar tidak overlap |
| `ON_ERROR_STOP=1` | fail fast |
| Secret | pakai Kubernetes Secret/External Secret |
| DB role | role khusus maintenance, bukan app superuser |
| Observability | log job ke stdout + DB registry |

---

## 12. pg_partman sebagai Opsi Automation

`pg_partman` adalah extension untuk mengelola partition set berbasis waktu atau number-based. Dokumentasi project-nya menyebut versi modern hanya mendukung built-in declarative partitioning, dan menyediakan automation untuk membuat child partition baru serta drop old partitions berdasarkan retention policy. ([GitHub](https://github.com/pgpartman/pg_partman))

### Kapan pilih pg_partman?

| Pilih pg_partman jika | Hindari jika |
|---|---|
| extension diizinkan oleh platform | environment tidak boleh install extension |
| banyak table partitioned | hanya 1-2 table sederhana |
| ingin retention otomatis | retention butuh approval manual |
| tim DBA familiar | tim belum punya ownership extension |
| ingin mengurangi custom PL/pgSQL | perlu kontrol penuh lifecycle |

### Catatan praktis

`pg_partman` bagus untuk mengurangi custom code, tapi tetap butuh:

```text id="4rqa4f"
- monitoring partition coverage
- monitoring retention action
- backup policy sebelum drop
- change management
- testing di staging
```

Jangan anggap extension menghilangkan kebutuhan runbook.

---

## 13. Retention Policy Design

Retention bukan cuma “hapus data > 90 hari”. Retention harus menjawab:

| Pertanyaan | Contoh jawaban |
|---|---|
| Raw data disimpan berapa lama? | 30/90/180 hari |
| Late data diterima maksimal berapa lama? | 7 hari |
| Setelah raw dihapus, rollup masih ada? | hourly 1 tahun, daily 5 tahun |
| Apakah ada legal hold? | case/regulatory event jangan drop otomatis |
| Apakah perlu archive sebelum drop? | export ke object storage |
| Siapa approve retention? | DBA/data owner/compliance |

Contoh policy:

```text id="99r7pk"
raw_metric_sample:
  retention: 90 days
  late_acceptance: 7 days
  archive_before_drop: false

hourly_metric_rollup:
  retention: 24 months
  archive_before_drop: true

regulatory_case_event:
  retention: controlled by legal policy
  auto_drop: disabled
```

---

## 14. Mark Retention Candidate

Jangan langsung drop. Tandai dulu partition yang eligible.

```sql id="bblkej"
create or replace function mark_metric_sample_retention_candidates(
    p_retention interval default interval '90 days'
)
returns integer
language plpgsql
as $$
declare
    v_count integer;
begin
    update time_partition_registry
    set
        lifecycle_status = 'RETENTION_CANDIDATE',
        note = concat(
            coalesce(note, ''),
            ' | marked retention candidate at ',
            clock_timestamp()
        )
    where parent_table = 'metric_sample'
      and lifecycle_status in ('ACTIVE', 'CLOSED')
      and range_to < clock_timestamp() - p_retention;

    get diagnostics v_count = row_count;
    return v_count;
end;
$$;
```

Run:

```sql id="yazqxb"
select mark_metric_sample_retention_candidates(interval '90 days');
```

---

## 15. Snapshot Sebelum Detach/Drop

Sebelum detach/drop, simpan row count dan size snapshot.

```sql id="gd3743"
create or replace function snapshot_partition_before_retention(
    p_partition_table text
)
returns void
language plpgsql
as $$
declare
    v_row_count bigint;
    v_size bigint;
begin
    execute format(
        'select count(*) from %I',
        p_partition_table
    )
    into v_row_count;

    select pg_total_relation_size(p_partition_table::regclass)
    into v_size;

    update time_partition_registry
    set
        row_count_snapshot = v_row_count,
        size_snapshot = v_size
    where partition_table = p_partition_table;
end;
$$;
```

### Catatan

`count(*)` pada partition besar bisa mahal. Alternatifnya pakai estimasi `pg_class.reltuples`, tetapi untuk audit sebelum drop, exact count kadang diperlukan.

Estimasi:

```sql id="tcjyoa"
select
    relname,
    reltuples::bigint as estimated_rows,
    pg_total_relation_size(oid) as total_size_bytes
from pg_class
where relname = 'metric_sample_2026_04_01';
```

---

## 16. Detach Partition

Detach mengeluarkan partition dari parent table, tetapi table fisiknya tetap ada sebagai standalone table. Dokumentasi `ALTER TABLE` menyatakan `DETACH PARTITION` membuat partition tidak lagi punya hubungan dengan parent table; index yang tadinya attached ikut detached, dan trigger clone dari parent dihapus. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-altertable.html))

```sql id="kpgr3y"
alter table metric_sample
detach partition metric_sample_2026_04_01;
```

Setelah detach:

```sql id="vu89q6"
select count(*)
from metric_sample_2026_04_01;
```

Data masih ada, tetapi query ke parent `metric_sample` tidak lagi membaca partition itu.

---

## 17. Detach Concurrently

Untuk mengurangi blocking, PostgreSQL menyediakan:

```sql id="jhoqah"
alter table metric_sample
detach partition metric_sample_2026_04_01 concurrently;
```

`DETACH PARTITION CONCURRENTLY` memakai lock yang lebih rendah pada parent/partition dan berjalan dengan dua transaksi internal; dokumentasi juga mencatat mode ini tidak bisa dijalankan dalam transaction block dan tidak diperbolehkan jika partitioned table memiliki default partition. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-altertable.html))

### Decision matrix

| Mode | Cocok untuk |
|---|---|
| `DETACH PARTITION` biasa | maintenance window, low traffic |
| `DETACH PARTITION CONCURRENTLY` | production traffic, ingin mengurangi blocking |
| `DROP TABLE` langsung | data tidak perlu archive dan lock impact diterima |
| `DETACH` lalu `DROP` | lebih aman, ada verifikasi/backup window |

---

## 18. Drop Partition

Setelah detached dan diverifikasi:

```sql id="7a1s1s"
drop table metric_sample_2026_04_01;
```

Atau kalau langsung ingin drop partition tanpa detach:

```sql id="vrq4g3"
drop table metric_sample_2026_04_01;
```

### Rekomendasi praktis

Untuk enterprise production, lebih aman:

```text id="l81uwr"
1. mark RETENTION_CANDIDATE
2. snapshot row count/size
3. detach partition
4. optional export/archive
5. wait verification window
6. drop detached table
7. mark DROPPED
```

---

## 19. Retention Function: Detach Candidate

```sql id="hhsbbq"
create or replace function detach_metric_sample_retention_candidates(
    p_limit integer default 5
)
returns integer
language plpgsql
as $$
declare
    r record;
    v_count integer := 0;
begin
    for r in
        select partition_table
        from time_partition_registry
        where parent_table = 'metric_sample'
          and lifecycle_status = 'RETENTION_CANDIDATE'
        order by range_to
        limit p_limit
    loop
        perform snapshot_partition_before_retention(r.partition_table);

        execute format(
            'alter table metric_sample detach partition %I',
            r.partition_table
        );

        update time_partition_registry
        set
            lifecycle_status = 'DETACHED',
            detached_at = clock_timestamp()
        where parent_table = 'metric_sample'
          and partition_table = r.partition_table;

        v_count := v_count + 1;
    end loop;

    return v_count;
end;
$$;
```

Run:

```sql id="kct4ka"
select detach_metric_sample_retention_candidates(3);
```

### Note

Function ini memakai `DETACH PARTITION` biasa, bukan `CONCURRENTLY`, karena `CONCURRENTLY` tidak bisa dijalankan dalam transaction block. Untuk `CONCURRENTLY`, gunakan external script/job yang menjalankan per command di luar explicit transaction.

---

## 20. Retention Script untuk `DETACH CONCURRENTLY`

Contoh shell job:

```bash id="uln80f"
#!/usr/bin/env bash
set -euo pipefail

PARENT_TABLE="metric_sample"

PARTITIONS=$(psql -At -v ON_ERROR_STOP=1 <<SQL
select partition_table
from time_partition_registry
where parent_table = '${PARENT_TABLE}'
  and lifecycle_status = 'RETENTION_CANDIDATE'
order by range_to
limit 3;
SQL
)

for PARTITION in ${PARTITIONS}; do
  echo "Detaching ${PARTITION} concurrently..."

  psql -v ON_ERROR_STOP=1 \
    -c "alter table ${PARENT_TABLE} detach partition ${PARTITION} concurrently;"

  psql -v ON_ERROR_STOP=1 <<SQL
update time_partition_registry
set lifecycle_status = 'DETACHED',
    detached_at = clock_timestamp()
where parent_table = '${PARENT_TABLE}'
  and partition_table = '${PARTITION}';
SQL
done
```

### Hardening

| Risiko | Mitigasi |
|---|---|
| SQL injection dari nama table | validasi registry hanya diisi trusted job |
| detach gagal di tengah | status tetap candidate, bisa retry |
| one partition terlalu besar | limit batch kecil |
| blocking masih terjadi | jadwalkan off-peak |
| default partition ada | `DETACH CONCURRENTLY` tidak bisa dipakai |

---

## 21. Drop Detached Partition

```sql id="i7wqsy"
create or replace function drop_metric_sample_detached_partitions(
    p_detached_older_than interval default interval '7 days',
    p_limit integer default 5
)
returns integer
language plpgsql
as $$
declare
    r record;
    v_count integer := 0;
begin
    for r in
        select partition_table
        from time_partition_registry
        where parent_table = 'metric_sample'
          and lifecycle_status = 'DETACHED'
          and detached_at < clock_timestamp() - p_detached_older_than
        order by range_to
        limit p_limit
    loop
        execute format(
            'drop table if exists %I',
            r.partition_table
        );

        update time_partition_registry
        set
            lifecycle_status = 'DROPPED',
            dropped_at = clock_timestamp()
        where parent_table = 'metric_sample'
          and partition_table = r.partition_table;

        v_count := v_count + 1;
    end loop;

    return v_count;
end;
$$;
```

Run:

```sql id="j08btm"
select drop_metric_sample_detached_partitions(interval '7 days', 3);
```

---

## 22. Archive Before Drop

Jika perlu archive ke object storage, pola umum:

```text id="j0maee"
1. detach partition
2. export detached table
3. checksum / row count validation
4. upload to S3/Azure Blob/on-prem object storage
5. mark ARCHIVED
6. drop table after verification
```

Contoh export server-side dengan `COPY`:

```sql id="yut58s"
copy metric_sample_2026_04_01
to '/var/lib/postgresql/export/metric_sample_2026_04_01.csv'
with (
    format csv,
    header true
);
```

Contoh client-side dari shell:

```bash id="9umfv0"
psql -v ON_ERROR_STOP=1 \
  -c "\copy metric_sample_2026_04_01 to 'metric_sample_2026_04_01.csv' csv header"
```

### Production note

| Mode | Catatan |
|---|---|
| server-side `COPY` | butuh akses filesystem DB server |
| client-side `\copy` | file ada di client/job container |
| logical export | cocok untuk archive portable |
| compressed CSV/Parquet pipeline | lebih cocok untuk analytics lake |

---

## 23. Default Partition Handling

Default partition bisa menyelamatkan ingest saat partition belum dibuat, tetapi berbahaya jika dibiarkan membesar.

```sql id="ct69la"
create table metric_sample_default
partition of metric_sample
default;
```

Monitoring:

```sql id="dlrhkp"
select count(*)
from metric_sample_default;
```

Kalau ada row di default partition:

```text id="x0of5y"
1. Identifikasi min/max event_time
2. Buat partition yang hilang
3. Pindahkan row dari default ke parent
4. Validasi default kosong
5. Perbaiki automation future partition
```

Contoh pindah data:

```sql id="jce0o1"
insert into metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time,
    ingest_time,
    value_numeric
)
select
    tenant_id,
    source_id,
    metric_name,
    event_time,
    ingest_time,
    value_numeric
from metric_sample_default
where event_time >= timestamptz '2026-07-15 00:00:00+00'
  and event_time <  timestamptz '2026-07-16 00:00:00+00';

delete from metric_sample_default
where event_time >= timestamptz '2026-07-15 00:00:00+00'
  and event_time <  timestamptz '2026-07-16 00:00:00+00';
```

---

## 24. Migration Tooling: Flyway/Liquibase Boundary

Untuk partition lifecycle, jangan semua dimasukkan ke migration statis.

| Aktivitas | Cocok di migration? | Catatan |
|---|---:|---|
| Create parent partitioned table | Ya | versi schema |
| Create baseline indexes | Ya | deterministic |
| Create lifecycle functions | Ya | schema-managed |
| Create initial partitions | Ya, untuk bootstrap | misal 30 hari pertama |
| Create daily future partition | Tidak ideal | pakai scheduled maintenance |
| Retention detach/drop | Tidak | operational job, bukan migration |
| Backfill historical partition | Tergantung | migration data khusus atau batch job |

### Flyway example

```text id="07oflc"
V001__create_metric_sample_parent.sql
V002__create_partition_registry.sql
V003__create_partition_lifecycle_functions.sql
V004__create_initial_metric_sample_partitions.sql
```

### Liquibase example concept

```yaml id="m14ejv"
databaseChangeLog:
  - changeSet:
      id: create-metric-sample-parent
      author: platform
      changes:
        - sqlFile:
            path: db/changelog/sql/create_metric_sample_parent.sql

  - changeSet:
      id: create-partition-functions
      author: platform
      changes:
        - sqlFile:
            path: db/changelog/sql/create_partition_functions.sql
```

---

## 25. Java Admin Endpoint: Biasanya Jangan Public

Kadang tim membuat endpoint admin untuk memastikan partition.

```java id="y0uubm"
@Path("/internal/admin/partitions")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class PartitionAdminResource {

    private final PartitionMaintenanceService service;

    @POST
    @Path("/metric-sample/ensure-future")
    public Response ensureFuturePartitions(EnsureFuturePartitionsRequest request) {
        service.ensureFuturePartitions(request.daysAhead());
        return Response.accepted().build();
    }
}
```

### Guard wajib

| Guard | Kenapa |
|---|---|
| internal network only | DDL operation berisiko |
| strong authz | bukan endpoint user biasa |
| rate limit | hindari DDL spam |
| audit log | siapa trigger apa |
| idempotent | aman dipanggil ulang |
| max days ahead | cegah create ribuan partition |

---

## 26. MyBatis Mapper untuk Maintenance Function

```java id="cg1e1e"
public interface PartitionMaintenanceMapper {

    void ensureMetricSampleFuturePartitions(@Param("daysAhead") int daysAhead);

    int markMetricSampleRetentionCandidates(@Param("retentionDays") int retentionDays);

    List<PartitionCandidateRow> findRetentionCandidates(
        @Param("limit") int limit
    );
}
```

XML:

```xml id="inl5it"
<select id="ensureMetricSampleFuturePartitions">
    select ensure_metric_sample_future_partitions(#{daysAhead})
</select>

<select id="markMetricSampleRetentionCandidates" resultType="int">
    select mark_metric_sample_retention_candidates(
        (#{retentionDays} || ' days')::interval
    )
</select>

<select id="findRetentionCandidates" resultType="com.example.PartitionCandidateRow">
    select
        parent_table as parentTable,
        partition_table as partitionTable,
        range_from as rangeFrom,
        range_to as rangeTo,
        lifecycle_status as lifecycleStatus
    from time_partition_registry
    where parent_table = 'metric_sample'
      and lifecycle_status = 'RETENTION_CANDIDATE'
    order by range_to
    limit #{limit}
</select>
```

---

## 27. Safety Guard: Advisory Lock

Maintenance job harus menghindari double-run.

```sql id="d0o7yj"
create or replace function ensure_metric_sample_future_partitions_locked(
    p_days_ahead integer default 14
)
returns void
language plpgsql
as $$
declare
    v_lock_acquired boolean;
begin
    v_lock_acquired := pg_try_advisory_lock(
        hashtext('metric_sample_partition_maintenance')
    );

    if not v_lock_acquired then
        raise notice 'partition maintenance already running';
        return;
    end if;

    begin
        perform ensure_metric_sample_future_partitions(p_days_ahead);
    exception
        when others then
            perform pg_advisory_unlock(
                hashtext('metric_sample_partition_maintenance')
            );
            raise;
    end;

    perform pg_advisory_unlock(
        hashtext('metric_sample_partition_maintenance')
    );
end;
$$;
```

Run scheduled job ke locked function:

```sql id="fa9y0e"
select ensure_metric_sample_future_partitions_locked(14);
```

---

## 28. Observability untuk Partition Lifecycle

Minimal metrics:

| Metric | Alert |
|---|---|
| future partition coverage | `< 2 hari` critical |
| default partition row count | `> 0` warning/critical |
| failed maintenance job | `> 0` critical |
| retention candidate count | terlalu banyak = backlog |
| detached-not-dropped count | growth storage |
| partition size growth | anomaly |
| DDL duration | makin lama = lock/contention |
| lock wait saat detach | production risk |

Query coverage:

```sql id="fw4i21"
select
    active_covered_until,
    active_covered_until - clock_timestamp() as coverage_remaining
from metric_sample_partition_coverage;
```

Query retention backlog:

```sql id="y36hk1"
select
    lifecycle_status,
    count(*) as partition_count
from time_partition_registry
where parent_table = 'metric_sample'
group by lifecycle_status
order by lifecycle_status;
```

Query size per partition:

```sql id="ysu2yz"
select
    partition_table,
    pg_size_pretty(pg_total_relation_size(partition_table::regclass)) as size
from time_partition_registry
where parent_table = 'metric_sample'
  and lifecycle_status in ('ACTIVE', 'CLOSED', 'RETENTION_CANDIDATE')
order by pg_total_relation_size(partition_table::regclass) desc
limit 20;
```

---

## 29. Runbook: Future Partition Missing

### Symptom

```text id="bljujj"
ERROR: no partition of relation "metric_sample" found for row
```

### Response

```text id="kboafb"
1. Ambil event_time dari failed message/request.
2. Cek apakah partition untuk event_time tersedia.
3. Jalankan ensure future partition atau create manual partition.
4. Reprocess message/request yang gagal.
5. Cek apakah ada row masuk default partition.
6. Cek scheduler terakhir sukses kapan.
7. Tambahkan alert coverage bila belum ada.
```

SQL check:

```sql id="ut9saa"
select *
from time_partition_registry
where parent_table = 'metric_sample'
  and range_from <= timestamptz '2026-07-20 10:00:00+00'
  and range_to   >  timestamptz '2026-07-20 10:00:00+00';
```

Manual recovery:

```sql id="j3u1oy"
select create_metric_sample_daily_partition(date '2026-07-20');
```

---

## 30. Runbook: Retention Accident

### Symptom

```text id="xj2rgn"
Data lama tidak muncul dari parent table.
Partition ternyata sudah detached/drop.
```

### Jika detached, belum dropped

```sql id="c8pwn3"
alter table metric_sample
attach partition metric_sample_2026_04_01
for values from ('2026-04-01 00:00:00+00')
to              ('2026-04-02 00:00:00+00');
```

`ATTACH PARTITION` dapat melakukan scan untuk memastikan row pada table yang di-attach memenuhi partition constraint; scan bisa dihindari jika table sudah punya `CHECK` constraint valid yang sesuai dengan boundary partition. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-altertable.html))

Update registry:

```sql id="qab5wa"
update time_partition_registry
set
    lifecycle_status = 'ACTIVE',
    note = concat(coalesce(note, ''), ' | reattached after retention recovery')
where parent_table = 'metric_sample'
  and partition_table = 'metric_sample_2026_04_01';
```

### Jika sudah dropped

```text id="irbl4w"
1. Restore dari backup/PITR/archive.
2. Recreate partition/table.
3. Load restored data.
4. Attach partition jika perlu.
5. Refresh rollup/materialized view.
6. RCA: kenapa retention guard gagal?
```

---

## 31. Runbook: Retention Job Blocking Production

### Symptom

```text id="2zqa3m"
DDL lock wait tinggi
insert/query melambat saat detach/drop
```

### Investigasi lock

```sql id="4lufns"
select
    blocked_locks.pid as blocked_pid,
    blocked_activity.query as blocked_query,
    blocking_locks.pid as blocking_pid,
    blocking_activity.query as blocking_query
from pg_catalog.pg_locks blocked_locks
join pg_catalog.pg_stat_activity blocked_activity
    on blocked_activity.pid = blocked_locks.pid
join pg_catalog.pg_locks blocking_locks
    on blocking_locks.locktype = blocked_locks.locktype
   and blocking_locks.database is not distinct from blocked_locks.database
   and blocking_locks.relation is not distinct from blocked_locks.relation
   and blocking_locks.page is not distinct from blocked_locks.page
   and blocking_locks.tuple is not distinct from blocked_locks.tuple
   and blocking_locks.virtualxid is not distinct from blocked_locks.virtualxid
   and blocking_locks.transactionid is not distinct from blocked_locks.transactionid
   and blocking_locks.classid is not distinct from blocked_locks.classid
   and blocking_locks.objid is not distinct from blocked_locks.objid
   and blocking_locks.objsubid is not distinct from blocked_locks.objsubid
   and blocking_locks.pid != blocked_locks.pid
join pg_catalog.pg_stat_activity blocking_activity
    on blocking_activity.pid = blocking_locks.pid
where not blocked_locks.granted;
```

### Mitigation

```text id="fcq4sn"
1. Stop maintenance job.
2. Jangan drop banyak partition sekaligus.
3. Pakai detach concurrently jika memungkinkan.
4. Jalankan off-peak.
5. Kurangi batch limit.
6. Evaluasi default partition karena bisa menghambat detach concurrently.
```

---

## 32. Production Lifecycle Checklist

| Checklist | Target |
|---|---|
| Parent table dibuat via migration | Ya |
| Lifecycle functions versioned | Ya |
| Future partition job scheduled | Ya |
| Coverage alert | Minimal 2-7 hari |
| Default partition monitored | Row count harus 0 |
| Retention policy terdokumentasi | Raw/rollup/regulatory beda |
| Detach sebelum drop | Untuk data penting |
| Snapshot row count/size | Sebelum retention |
| Archive path jelas | Jika compliance butuh |
| Advisory lock | Hindari double-run |
| Batch limit | Hindari DDL storm |
| Runbook missing partition | Ada |
| Runbook retention accident | Ada |
| Runbook lock incident | Ada |
| Staging test | Wajib sebelum production |

---

## 33. Anti-Patterns

| Anti-pattern | Dampak |
|---|---|
| Membuat partition manual tanpa scheduler | incident saat tanggal berganti |
| Retention pakai `DELETE` besar | bloat, WAL besar, vacuum berat |
| Drop partition tanpa registry/audit | sulit forensic |
| Tidak ada default partition dan tidak ada coverage alert | ingest gagal total saat partition miss |
| Ada default partition tapi tidak dimonitor | data menumpuk diam-diam |
| `DETACH CONCURRENTLY` dipanggil dalam transaction block | gagal |
| Retention raw event regulatory otomatis | risiko compliance |
| Semua DDL via app endpoint public | security risk |
| Create ribuan future partition | planning/maintenance overhead |
| Tidak test attach/detach di staging | lock surprise di production |
| Backfill historis tanpa create partition dulu | gagal atau masuk default |
| Rollup tidak refresh setelah late/backfill | angka dashboard salah |

---

# Seri 4/16 Selesai

**Seri 4 selesai.**  
Materi ini menutup lifecycle partition secara praktis: future partition creation, partition registry, scheduler, `pg_cron`, Kubernetes CronJob, `pg_partman`, retention candidate, detach/drop, archive, default partition handling, advisory lock, observability, dan runbook incident.

## Rekomendasi materi selanjutnya

Lanjut ke **Seri 5/16 - Indexing Strategy untuk PostgreSQL Time-Series: B-tree, BRIN, partial index, covering index, descending index, index bloat, dan query-driven index design**.

---

**Sources:**

- [PostgreSQL: Documentation: 18: 5.12. Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)
- [GitHub - citusdata/pg_cron: Run periodic jobs in PostgreSQL · GitHub](https://github.com/citusdata/pg_cron)
- [Scheduling maintenance with the PostgreSQL pg_cron extension - Amazon Relational Database Service](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL_pg_cron.html)

## Response:
7/15/2026, 8:33:55 PM

Saya lanjut ke **Seri 5/16**. Fokusnya index yang benar-benar dipakai query time-series: B-tree untuk lookup spesifik, BRIN untuk range besar, partial/covering index untuk dashboard, dan cara menghindari index bloat.

# PostgreSQL Time-Series Database - Seri 5/16  
## Indexing Strategy: B-tree, BRIN, Partial Index, Covering Index, Descending Index, Bloat, dan Query-Driven Index Design

**Status:** Seri 5 dari 16.  
Fokus seri ini: memilih index berdasarkan **query nyata** untuk workload time-series, bukan sekadar “tambahkan index agar cepat”.

---

## 1. Mental Model Index untuk Time-Series

Pada PostgreSQL time-series, index biasanya dipakai untuk 5 pola utama:

```text
1. Lookup satu entity/source dalam rentang waktu
2. Ambil latest value per entity/source
3. Scan range besar untuk agregasi
4. Filter hot/recent data
5. Query dashboard/reporting yang sering dipanggil
```

PostgreSQL menyediakan beberapa tipe index seperti **B-tree, Hash, GiST, SP-GiST, GIN, BRIN**, dan extension bloom. Secara default, `CREATE INDEX` membuat **B-tree index**, yang cocok untuk equality dan range query umum. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-types.html?utm_source=chatgpt.com))

Untuk time-series, yang paling sering dipakai:

| Index | Peran utama |
|---|---|
| **B-tree** | lookup spesifik, latest value, range kecil-menengah |
| **BRIN** | scan range besar pada table append-ordered |
| **Partial index** | index subset data penting, misalnya hot/recent/active |
| **Covering index / INCLUDE** | kurangi heap access untuk query dashboard |
| **GIN** | JSONB tags search, hanya jika benar-benar perlu |
| **Expression index** | query dengan expression yang stabil dan sering dipakai |

---

## 2. Query-Driven Index Design

Jangan mulai dari column. Mulai dari query.

Contoh table:

```sql
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    metric_name     text not null,
    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    value_numeric   numeric,
    value_quality   text not null default 'GOOD',
    time_quality    text not null default 'NORMAL',
    tags            jsonb not null default '{}'::jsonb
)
partition by range (event_time);
```

Query utama:

```sql
select
    event_time,
    value_numeric
from metric_sample
where tenant_id = 10
  and source_id = 1001
  and metric_name = 'temperature_celsius'
  and event_time >= timestamptz '2026-07-15 00:00:00+00'
  and event_time <  timestamptz '2026-07-16 00:00:00+00'
order by event_time;
```

Index yang natural:

```sql
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time
);
```

Kenapa urutannya begitu?

| Posisi column | Alasan |
|---|---|
| `tenant_id` | filter isolation, hampir selalu ada |
| `source_id` | filter entity/source |
| `metric_name` | filter metric |
| `event_time` | range scan dan ordering |

---

## 3. B-tree Index untuk Lookup Time-Series

B-tree cocok untuk query dengan equality prefix + range waktu.

```sql
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time
);
```

Query yang cocok:

```sql
select
    event_time,
    value_numeric
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
order by event_time;
```

PostgreSQL B-tree dapat menangani query equality dan range pada data yang bisa diurutkan; ini menjadikannya default yang paling aman untuk banyak query application-level. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-types.html?utm_source=chatgpt.com))

---

## 4. Descending Index untuk Latest Value

Query latest value sangat umum:

```sql
select
    event_time,
    value_numeric,
    value_quality
from metric_sample
where tenant_id = 10
  and source_id = 1001
  and metric_name = 'temperature_celsius'
order by event_time desc
limit 1;
```

Index:

```sql
create index metric_sample_latest_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
);
```

### Kapan index `DESC` berguna?

| Query | Index |
|---|---|
| `order by event_time desc limit 1` | `event_time desc` |
| latest N points | `event_time desc` |
| dashboard recent-first | `event_time desc` |
| pagination backward | `event_time desc` |

Namun jangan langsung membuat dua index:

```sql
event_time asc
event_time desc
```

B-tree bisa di-scan maju/mundur. Buat index descending eksplisit jika query ordering multi-column atau pattern latest sangat dominan.

---

## 5. Composite Index: Urutan Column Sangat Penting

Index:

```sql
create index metric_sample_idx_a
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time
);
```

Bagus untuk:

```sql
where tenant_id = ?
  and source_id = ?
  and metric_name = ?
  and event_time >= ?
  and event_time < ?
```

Kurang bagus untuk:

```sql
where metric_name = ?
  and event_time >= ?
  and event_time < ?
```

Karena `tenant_id` dan `source_id` di kiri tidak dipakai.

### Rule praktis composite index

```text
Equality columns dulu,
lalu range/order column terakhir.
```

Contoh:

```sql
-- Baik
(tenant_id, source_id, metric_name, event_time)

-- Biasanya buruk untuk lookup source
(event_time, tenant_id, source_id, metric_name)
```

Kenapa `event_time` tidak selalu di depan?  
Karena kalau `event_time` di depan, query “source tertentu dalam 1 hari” akan menemukan semua data hari itu dulu, lalu filter source. Untuk high-cardinality source, itu bisa mahal.

---

## 6. Index untuk Multi-Tenant Time-Series

Untuk sistem enterprise multi-tenant, hampir semua query harus membawa `tenant_id`.

Baseline:

```sql
create index metric_sample_tenant_source_metric_time_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
);
```

Query:

```sql
select *
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
order by event_time desc;
```

### Anti-pattern

```sql
create index metric_sample_source_metric_time_idx
on metric_sample (
    source_id,
    metric_name,
    event_time
);
```

Kalau `source_id` tidak globally unique antar tenant, index ini bisa menyebabkan data antar tenant tercampur dalam search space.

---

## 7. Index untuk Query “Latest per Source”

Misalnya ingin latest value untuk banyak source:

```sql
select distinct on (source_id)
    source_id,
    event_time,
    value_numeric
from metric_sample
where tenant_id = 10
  and metric_name = 'temperature_celsius'
  and event_time >= now() - interval '1 day'
order by source_id, event_time desc;
```

Index:

```sql
create index metric_sample_latest_per_source_idx
on metric_sample (
    tenant_id,
    metric_name,
    source_id,
    event_time desc
);
```

Perhatikan urutan `source_id` sebelum `event_time desc`, karena `distinct on (source_id)` dan `order by source_id, event_time desc`.

---

## 8. BRIN Index untuk Table Besar Append-Ordered

BRIN adalah **Block Range Index**. PostgreSQL menjelaskan bahwa BRIN dirancang untuk table sangat besar ketika column punya korelasi natural dengan lokasi fisik data dalam table; ini sangat cocok untuk data append-heavy berdasarkan waktu. ([PostgreSQL](https://www.postgresql.org/docs/current/brin.html?utm_source=chatgpt.com))

Index:

```sql
create index metric_sample_event_time_brin_idx
on metric_sample using brin (
    event_time
);
```

### Kapan BRIN cocok?

| Cocok | Tidak cocok |
|---|---|
| table sangat besar | table kecil |
| data insert mostly ordered by time | event_time acak/random |
| query scan range besar | lookup satu entity kecil |
| index size harus kecil | butuh exact seek cepat |
| append-only/raw history | update random sering |

### B-tree vs BRIN

| Aspek | B-tree | BRIN |
|---|---|---|
| Lookup spesifik | Sangat baik | Kurang |
| Range besar | Baik, tapi index besar | Baik jika data terurut |
| Ukuran index | Lebih besar | Sangat kecil |
| Write overhead | Lebih tinggi | Rendah |
| Cocok untuk latest per source | Ya | Tidak |
| Cocok untuk scan raw 30 hari | Tergantung | Bisa sangat cocok |

---

## 9. BRIN dengan `pages_per_range`

Default BRIN membagi table ke block range. Untuk tuning, bisa set `pages_per_range`.

```sql
create index metric_sample_event_time_brin_idx
on metric_sample using brin (event_time)
with (pages_per_range = 128);
```

Trade-off:

| `pages_per_range` | Dampak |
|---|---|
| lebih kecil | index lebih besar, pruning lebih presisi |
| lebih besar | index lebih kecil, pruning kurang presisi |

Praktisnya: mulai dari default, ukur dengan `EXPLAIN (ANALYZE, BUFFERS)`.

---

## 10. B-tree + BRIN Bersamaan?

Boleh, asal perannya jelas.

```sql
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
);

create index metric_sample_event_time_brin_idx
on metric_sample using brin (
    event_time
);
```

| Query | Index yang diharapkan |
|---|---|
| latest source metric | B-tree |
| source metric 1 jam | B-tree |
| scan semua metric 30 hari | BRIN atau partition pruning + seq scan |
| daily aggregate semua source | BRIN/seq scan per partition |
| dashboard per source | B-tree |

Jangan takut PostgreSQL memilih sequential scan pada partition kecil. Itu bisa benar.

---

## 11. Partial Index untuk Hot Data

Partial index adalah index atas subset rows, dengan subset didefinisikan oleh predicate `WHERE`. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-partial.html?utm_source=chatgpt.com))

Contoh: index hanya data kualitas baik.

```sql
create index metric_sample_good_quality_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
)
where value_quality = 'GOOD';
```

Query harus cocok dengan predicate:

```sql
select
    event_time,
    value_numeric
from metric_sample
where tenant_id = 10
  and source_id = 1001
  and metric_name = 'temperature_celsius'
  and value_quality = 'GOOD'
  and event_time >= now() - interval '1 day'
order by event_time desc;
```

### Partial index cocok untuk

| Use case | Contoh |
|---|---|
| filter umum dengan subset kecil | `where status = 'ACTIVE'` |
| data good quality saja | `where value_quality = 'GOOD'` |
| alert unresolved | `where resolved_at is null` |
| unprocessed ingestion | `where processed_at is null` |
| recent operational table | jangan pakai `now()` langsung di predicate |

---

## 12. Partial Index dan Masalah `now()`

Anti-pattern:

```sql
create index metric_sample_recent_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
)
where event_time >= now() - interval '7 days';
```

Ini bukan desain yang baik karena predicate index seharusnya stabil/immutable secara operasional. `now()` bergerak seiring waktu, sedangkan isi index tidak otomatis “menggeser dirinya” seperti sliding window.

Alternatif yang lebih aman:

### Option A - Partition sudah membatasi recent data

Untuk recent query, cukup query partition terbaru + B-tree index.

### Option B - Gunakan status/lifecycle column

```sql
alter table metric_sample
add column lifecycle_bucket text not null default 'HOT';

create index metric_sample_hot_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
)
where lifecycle_bucket = 'HOT';
```

Lalu update lifecycle via job bila memang perlu.

### Option C - Pisahkan hot table

```text
metric_sample_hot
metric_sample_archive
```

Namun ini menambah kompleksitas ingestion dan query.

---

## 13. Covering Index dengan `INCLUDE`

Covering index memungkinkan query mengambil semua column yang dibutuhkan dari index tanpa membaca heap, jika syarat index-only scan terpenuhi. PostgreSQL mendukung `INCLUDE` untuk menambahkan non-key column ke index; dokumentasi `CREATE INDEX` juga mencatat batas jumlah column index termasuk `INCLUDE`, dan hanya B-tree yang mendukung unique index. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createindex.html?utm_source=chatgpt.com))

Contoh query dashboard:

```sql
select
    event_time,
    value_numeric,
    value_quality
from metric_sample
where tenant_id = 10
  and source_id = 1001
  and metric_name = 'temperature_celsius'
  and event_time >= now() - interval '1 day'
order by event_time desc;
```

Covering index:

```sql
create index metric_sample_dashboard_cover_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
)
include (
    value_numeric,
    value_quality
);
```

PostgreSQL menjelaskan bahwa B-tree selalu mendukung index-only scan, tetapi index-only scan hanya bisa benar-benar menghindari heap access ketika visibility map menunjukkan page heap terkait sudah all-visible. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-index-only-scans.html?utm_source=chatgpt.com))

### Kapan covering index cocok?

| Cocok | Tidak cocok |
|---|---|
| query dashboard sangat sering | query jarang |
| select column sedikit dan stabil | select banyak column besar |
| table mostly append-only | table sering update |
| latency penting | write overhead sensitif |

### Risiko

| Risiko | Penjelasan |
|---|---|
| index membesar | `INCLUDE` column tetap disimpan di index |
| write lebih mahal | insert/update harus maintain index |
| index-only tidak selalu terjadi | tergantung visibility map/vacuum |
| terlalu banyak covering index | storage dan bloat naik |

---

## 14. Index untuk Aggregation Query

Query:

```sql
select
    date_bin(interval '15 minutes', event_time, timestamptz '2026-01-01 00:00:00+00') as bucket,
    avg(value_numeric) as avg_value
from metric_sample
where tenant_id = 10
  and source_id = 1001
  and metric_name = 'temperature_celsius'
  and event_time >= :from
  and event_time <  :to
group by bucket
order by bucket;
```

Index:

```sql
create index metric_sample_agg_source_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time
)
include (
    value_numeric
);
```

Namun untuk range besar, PostgreSQL mungkin tetap memilih sequential scan per partition. Itu tidak selalu salah, karena aggregation sering perlu membaca banyak row.

### Rule praktis

| Range | Kemungkinan index berguna |
|---|---|
| 1 menit-1 jam | B-tree sangat berguna |
| 1 hari per source | B-tree masih berguna |
| 30 hari semua source | BRIN/seq scan/rollup lebih cocok |
| 1 tahun raw data | jangan query raw; pakai rollup |

---

## 15. GIN Index untuk JSONB Tags

Kalau `tags` dipakai untuk query:

```sql
select *
from metric_sample
where tenant_id = 10
  and tags @> '{"region":"jakarta"}';
```

Index:

```sql
create index metric_sample_tags_gin_idx
on metric_sample using gin (
    tags
);
```

Tapi hati-hati: jangan jadikan JSONB tags sebagai tempat semua filter utama.

Lebih baik:

```sql
tenant_id   bigint not null,
source_id   bigint not null,
region      text,
service     text,
tags        jsonb not null default '{}'::jsonb
```

Index eksplisit:

```sql
create index metric_sample_region_time_idx
on metric_sample (
    tenant_id,
    region,
    event_time desc
);
```

### Decision

| Metadata | Index |
|---|---|
| filter utama | column + B-tree |
| arbitrary label | JSONB + GIN opsional |
| high-cardinality free-form | hati-hati |
| dashboard dimension | column eksplisit |

---

## 16. Expression Index

Kalau query sering memakai expression yang sama:

```sql
where lower(metric_name) = lower(:metricName)
```

Bisa buat:

```sql
create index metric_sample_lower_metric_name_idx
on metric_sample (
    tenant_id,
    source_id,
    lower(metric_name),
    event_time desc
);
```

Namun untuk production, lebih baik normalize data saat write:

```sql
metric_name text not null check (metric_name = lower(metric_name))
```

Expression index cocok jika expression benar-benar stabil dan dipakai sering.

---

## 17. Unique Index dan Partitioned Table

Untuk partitioned table, unique/primary constraint di parent harus mencakup semua partition key. Jika table dipartisi by `event_time`, maka unique key harus memasukkan `event_time`; ini adalah constraint penting dalam desain idempotency native PostgreSQL partitioning. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createindex.html?utm_source=chatgpt.com))

Valid:

```sql
alter table metric_sample
add constraint metric_sample_pk
primary key (
    tenant_id,
    source_id,
    metric_name,
    event_time,
    event_id
);
```

Problematis sebagai global unique di parent partitioned table:

```sql
unique (tenant_id, event_id)
```

Solusi production:

```sql
create table ingestion_event_registry (
    tenant_id      bigint not null,
    event_id       uuid not null,
    first_seen_at  timestamptz not null default clock_timestamp(),

    constraint ingestion_event_registry_pk
        primary key (tenant_id, event_id)
);
```

---

## 18. Index pada Parent vs Partition

Biasanya buat index di parent:

```sql
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
);
```

PostgreSQL akan mengelola index terkait di partition. Namun pada operasi besar seperti attach historical partition, kadang lebih efisien membuat index di table yang akan di-attach terlebih dahulu, lalu attach partition/index sesuai prosedur operasional.

### Praktik aman

| Aktivitas | Rekomendasi |
|---|---|
| table baru | create index di parent |
| partition harian otomatis | ikut parent |
| attach partition historis besar | build index sebelum attach jika perlu |
| rebuild index partition tertentu | lakukan per partition |
| drop old partition | index ikut drop karena table partition drop |

---

## 19. Index untuk Ingestion Monitoring

Query:

```sql
select
    ingest_time,
    event_time,
    ingest_time - event_time as lag,
    tenant_id,
    source_id,
    metric_name
from metric_sample
where ingest_time >= now() - interval '1 hour'
order by ingest_time desc
limit 1000;
```

Index:

```sql
create index metric_sample_ingest_time_idx
on metric_sample (
    ingest_time desc
);
```

Karena table dipartisi by `event_time`, query berbasis `ingest_time` tidak banyak terbantu oleh partition pruning. Index ini khusus untuk observability ingestion.

---

## 20. Index untuk Late Data Detection

Query:

```sql
select
    tenant_id,
    source_id,
    metric_name,
    event_time,
    ingest_time,
    ingest_time - event_time as lag
from metric_sample
where ingest_time >= now() - interval '1 hour'
  and ingest_time - event_time > interval '5 minutes'
order by ingest_time desc;
```

Index:

```sql
create index metric_sample_ingest_time_late_idx
on metric_sample (
    ingest_time desc
)
include (
    tenant_id,
    source_id,
    metric_name,
    event_time
);
```

Kalau late data monitoring sering dijalankan, covering index bisa membantu. Kalau hanya ad-hoc, jangan buat index khusus.

---

## 21. Index untuk Alert Table

Lebih baik alert/anomaly disimpan di table terpisah, bukan selalu query raw metric.

```sql
create table metric_alert (
    tenant_id       bigint not null,
    alert_id        uuid not null,
    source_id       bigint not null,
    metric_name     text not null,
    severity        text not null,
    status          text not null,
    opened_at       timestamptz not null,
    resolved_at     timestamptz,

    constraint metric_alert_pk
        primary key (tenant_id, alert_id)
);
```

Index unresolved:

```sql
create index metric_alert_open_idx
on metric_alert (
    tenant_id,
    severity,
    opened_at desc
)
where resolved_at is null;
```

Ini contoh partial index yang sangat berguna, karena unresolved alerts biasanya subset kecil tetapi sering dibaca.

---

## 22. Index untuk Materialized/Rollup Table

Raw table:

```text
metric_sample
```

Rollup table:

```sql
create table metric_rollup_15m (
    tenant_id      bigint not null,
    source_id      bigint not null,
    metric_name    text not null,
    bucket_start   timestamptz not null,

    avg_value      numeric,
    min_value      numeric,
    max_value      numeric,
    sample_count   bigint not null,

    constraint metric_rollup_15m_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            bucket_start
        )
);
```

Index untuk dashboard:

```sql
create index metric_rollup_15m_lookup_idx
on metric_rollup_15m (
    tenant_id,
    source_id,
    metric_name,
    bucket_start
)
include (
    avg_value,
    min_value,
    max_value,
    sample_count
);
```

Rollup table biasanya jauh lebih kecil daripada raw table, sehingga B-tree covering index sering lebih efektif.

---

## 23. Avoid Over-Indexing

Setiap index mempercepat sebagian read, tapi memperlambat write dan menambah storage.

Untuk table time-series high-ingest, ini sangat penting.

| Tambahan index | Dampak |
|---|---|
| insert lebih lambat | setiap row harus masuk ke semua index |
| WAL lebih besar | index changes juga ditulis |
| storage naik | index bisa sebesar data |
| vacuum/index cleanup naik | maintenance berat |
| cache pressure | memory dipakai index yang mungkin jarang dipakai |
| migration lebih lama | create/reindex butuh waktu |

Rule praktis:

```text
Mulai dari 1-3 index utama.
Tambahkan index hanya berdasarkan query penting yang terbukti lambat.
```

Baseline yang masuk akal:

```sql
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
);

create index metric_sample_event_time_brin_idx
on metric_sample using brin (
    event_time
);

create index metric_sample_ingest_time_idx
on metric_sample (
    ingest_time desc
);
```

---

## 24. Index Bloat

Index bloat terjadi saat index menyimpan banyak page tidak efisien akibat update/delete/churn. Untuk raw append-only time-series, bloat relatif lebih terkendali. Namun bloat bisa muncul jika:

| Penyebab | Contoh |
|---|---|
| banyak update | correction in-place |
| banyak delete | retention pakai `DELETE`, bukan drop partition |
| high churn status | update `processed_at`, `status` |
| index terlalu banyak | write amplification |
| long transaction | vacuum tidak bisa membersihkan |

### Mitigasi

| Problem | Mitigasi |
|---|---|
| retention delete besar | drop/detach partition |
| update raw metric | append correction event |
| old partition immutable | jangan vacuum agresif terus |
| bloat partition tertentu | reindex per partition |
| index tidak dipakai | drop index |

---

## 25. REINDEX per Partition

Kalau hanya satu partition bloat, jangan reindex semua.

```sql
reindex table metric_sample_2026_07_15;
```

Atau index tertentu:

```sql
reindex index metric_sample_2026_07_15_lookup_idx;
```

Untuk operasi production, pertimbangkan:

```sql
reindex index concurrently metric_sample_2026_07_15_lookup_idx;
```

Catatan: `CONCURRENTLY` mengurangi blocking, tetapi lebih lama dan tetap butuh resource. Test di staging.

---

## 26. Monitoring Index Usage

Gunakan `pg_stat_user_indexes`.

```sql
select
    schemaname,
    relname as table_name,
    indexrelname as index_name,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
from pg_stat_user_indexes
where relname like 'metric_sample%'
order by idx_scan asc, indexrelname;
```

Interpretasi:

| Metric | Arti |
|---|---|
| `idx_scan` | berapa kali index dipakai |
| `idx_tup_read` | index entries dibaca |
| `idx_tup_fetch` | heap rows diambil |

Index dengan `idx_scan = 0` dalam waktu lama adalah kandidat review, bukan langsung drop. Bisa saja dipakai query bulanan/incident.

---

## 27. Monitoring Index Size

```sql
select
    indexrelid::regclass as index_name,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
from pg_index
where indrelid = 'metric_sample_2026_07_15'::regclass
order by pg_relation_size(indexrelid) desc;
```

Untuk semua partition:

```sql
select
    schemaname,
    relname as table_name,
    indexrelname as index_name,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
    idx_scan
from pg_stat_user_indexes
where relname like 'metric_sample_%'
order by pg_relation_size(indexrelid) desc
limit 30;
```

---

## 28. EXPLAIN untuk Validasi Index

Gunakan:

```sql
explain (analyze, buffers)
select
    event_time,
    value_numeric
from metric_sample
where tenant_id = 10
  and source_id = 1001
  and metric_name = 'temperature_celsius'
  and event_time >= timestamptz '2026-07-15 00:00:00+00'
  and event_time <  timestamptz '2026-07-16 00:00:00+00'
order by event_time;
```

Yang dicari:

```text
Index Scan
Index Only Scan
Bitmap Index Scan
Bitmap Heap Scan
Seq Scan pada partition kecil
Partition pruning terjadi
Buffers tidak berlebihan
```

### Jangan hanya melihat “pakai index atau tidak”

Sequential scan bisa benar jika:

| Kondisi | Kenapa |
|---|---|
| partition kecil | scan full lebih murah |
| query baca mayoritas rows | index tidak membantu |
| aggregate besar | sequential scan efisien |
| statistics memperkirakan index mahal | planner bisa benar |

---

## 29. Common Query → Recommended Index

| Query pattern | Index |
|---|---|
| source metric range | `(tenant_id, source_id, metric_name, event_time)` |
| latest source metric | `(tenant_id, source_id, metric_name, event_time desc)` |
| latest per source | `(tenant_id, metric_name, source_id, event_time desc)` |
| tenant range all sources | `(tenant_id, event_time)` atau BRIN |
| ingestion monitoring | `(ingest_time desc)` |
| unresolved alert | partial index `where resolved_at is null` |
| good quality only | partial index `where value_quality = 'GOOD'` |
| dashboard value query | covering index with `include (value_numeric, value_quality)` |
| huge range scan | BRIN on `event_time` |
| JSONB tag contains | GIN on `tags`, only if needed |
| rollup dashboard | B-tree on `(tenant_id, source_id, metric_name, bucket_start)` |

---

## 30. MyBatis Query yang Index-Friendly

### Mapper

```java
public interface MetricSampleMapper {

    List<MetricPoint> findSeries(
        @Param("tenantId") long tenantId,
        @Param("sourceId") long sourceId,
        @Param("metricName") String metricName,
        @Param("from") Instant from,
        @Param("to") Instant to
    );

    MetricPoint findLatest(
        @Param("tenantId") long tenantId,
        @Param("sourceId") long sourceId,
        @Param("metricName") String metricName
    );
}
```

### XML

```xml
<select id="findSeries" resultType="com.example.MetricPoint">
    select
        event_time as eventTime,
        value_numeric as valueNumeric,
        value_quality as valueQuality
    from metric_sample
    where tenant_id = #{tenantId}
      and source_id = #{sourceId}
      and metric_name = #{metricName}
      and event_time >= #{from}
      and event_time <  #{to}
    order by event_time
</select>

<select id="findLatest" resultType="com.example.MetricPoint">
    select
        event_time as eventTime,
        value_numeric as valueNumeric,
        value_quality as valueQuality
    from metric_sample
    where tenant_id = #{tenantId}
      and source_id = #{sourceId}
      and metric_name = #{metricName}
    order by event_time desc
    limit 1
</select>
```

Index pendukung:

```sql
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
)
include (
    value_numeric,
    value_quality
);
```

---

## 31. Jersey API Guard agar Index Tidak Dirusak

```java
@GET
@Path("/v1/metrics/{sourceId}/{metricName}")
public Response findSeries(
    @PathParam("sourceId") long sourceId,
    @PathParam("metricName") String metricName,
    @QueryParam("from") String fromText,
    @QueryParam("to") String toText
) {
    Instant from = OffsetDateTime.parse(fromText).toInstant();
    Instant to = OffsetDateTime.parse(toText).toInstant();

    if (!from.isBefore(to)) {
        throw new BadRequestException("from must be before to");
    }

    Duration range = Duration.between(from, to);

    if (range.compareTo(Duration.ofDays(31)) > 0) {
        throw new BadRequestException("range too large; use rollup endpoint");
    }

    return Response.ok(
        metricService.findSeries(sourceId, metricName, from, to)
    ).build();
}
```

Index strategy tidak cukup kalau API mengizinkan query liar:

```text
/v1/metrics?from=2020-01-01&to=2026-07-15
```

Untuk range besar, redirect ke rollup endpoint.

---

## 32. Anti-Patterns

| Anti-pattern | Dampak |
|---|---|
| Membuat index untuk semua column | write lambat, storage besar |
| `event_time` selalu column pertama | lookup per source bisa buruk |
| Query pakai `date(event_time)` | partition pruning dan index range bisa terganggu |
| Partial index pakai `now()` | bukan sliding window yang aman |
| JSONB tags untuk filter utama | index membengkak dan query tidak stabil |
| Banyak covering index | index size dan write amplification naik |
| Tidak cek `EXPLAIN` | index bisa tidak dipakai |
| Drop index hanya karena `idx_scan = 0` sesaat | bisa merusak query periodik |
| Retention pakai delete | index bloat dan WAL besar |
| Query raw data untuk report tahunan | index bukan solusi; pakai rollup |

---

## 33. Production Baseline Index Set

Untuk table raw metric partitioned by `event_time`, baseline awal:

```sql
-- 1. Main lookup/latest query
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
)
include (
    value_numeric,
    value_quality,
    time_quality
);

-- 2. Large time-range scan helper
create index metric_sample_event_time_brin_idx
on metric_sample using brin (
    event_time
);

-- 3. Ingestion observability
create index metric_sample_ingest_time_idx
on metric_sample (
    ingest_time desc
);
```

Tambahkan ini hanya jika terbukti perlu:

```sql
-- JSONB tag search
create index metric_sample_tags_gin_idx
on metric_sample using gin (
    tags
);

-- Good quality dashboard
create index metric_sample_good_quality_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
)
where value_quality = 'GOOD';
```

---

## 34. Index Review Checklist

| Checklist | Target |
|---|---|
| Query utama sudah diketahui | Ya |
| Setiap index punya query owner | Ya |
| Equality columns di kiri | Ya |
| Range/order column setelah equality | Ya |
| `tenant_id` ada untuk multi-tenant query | Ya |
| `event_time` predicate half-open | Ya |
| Partition pruning terjadi | Validasi `EXPLAIN` |
| Index size dimonitor | Ya |
| `idx_scan` dimonitor | Ya |
| BRIN diuji untuk range besar | Ya |
| Covering index hanya untuk query hot | Ya |
| JSONB GIN tidak menggantikan column utama | Ya |
| Retention pakai drop/detach partition | Ya |
| Reindex strategy per partition | Ada |
| Query raw range besar diarahkan ke rollup | Ya |

---

# Seri 5/16 Selesai

**Seri 5 selesai.**  
Materi ini menutup indexing strategy untuk PostgreSQL time-series: B-tree, BRIN, composite index order, descending index, partial index, covering index, JSONB/GIN, expression index, index bloat, monitoring index usage, dan integrasi query-friendly dengan MyBatis/Jersey.

## Rekomendasi materi selanjutnya

Lanjut ke **Seri 6/16 - High-Throughput Ingestion: JDBC batch, MyBatis batch, `COPY`, staging table, retry-safe insert, backpressure, dan bulk backfill pipeline**.

---

**Sources:**

- [PostgreSQL: Documentation: 18: 11.2. Index Types](https://www.postgresql.org/docs/current/indexes-types.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:35:52 PM

Saya lanjut ke **Seri 6/16**. Bagian ini fokus ke ingestion path: kapan pakai single insert, JDBC/MyBatis batch, `COPY`, staging table, retry/idempotency, dan backpressure agar write path tidak menjadi bottleneck.

# PostgreSQL Time-Series Database - Seri 6/16  
## High-Throughput Ingestion: JDBC Batch, MyBatis Batch, `COPY`, Staging Table, Retry-Safe Insert, Backpressure, dan Bulk Backfill Pipeline

**Status:** Seri 6 dari 16.  
Fokus seri ini: bagaimana memasukkan data time-series ke PostgreSQL secara **cepat, aman, idempotent, observable**, dan tetap cocok untuk arsitektur **Java/Jersey/MyBatis**.

---

## 1. Mental Model Ingestion Time-Series

Workload time-series biasanya:

```text
many writes
mostly append
ordered or semi-ordered by time
can arrive late
can be duplicated by retry/replay
queried by time range
```

Maka ingestion path harus memikirkan:

| Concern | Pertanyaan praktis |
|---|---|
| Throughput | Berapa row/detik yang harus diterima? |
| Latency | Apakah harus real-time atau boleh micro-batch? |
| Idempotency | Bagaimana jika request/message diulang? |
| Ordering | Apakah event harus masuk sesuai waktu kejadian? |
| Late data | Apakah data lama masih diterima? |
| Validation | Row invalid ditolak, disimpan, atau dipisahkan? |
| Backpressure | Apa yang terjadi jika DB lambat? |
| Observability | Bisa tahu ingestion lag, error rate, duplicate rate? |

---

## 2. Pilihan Ingestion Path

```text
Ingestion Options
│
├─ Single Insert
│  └─ aman, sederhana, latency rendah, throughput terbatas
│
├─ Multi-row INSERT
│  └─ cocok batch kecil-menengah dari API/service
│
├─ JDBC/MyBatis Batch
│  └─ cocok service Java dengan mapper normal
│
├─ COPY FROM STDIN
│  └─ cocok bulk ingest/backfill/high-throughput stream
│
├─ Staging Table + Merge
│  └─ cocok validasi, dedup, backfill, transform
│
└─ Queue/Broker Buffered Ingestion
   └─ cocok burst traffic, retry, decoupling, backpressure
```

PostgreSQL `COPY` memang ditujukan untuk memindahkan data antara file/stdin/stdout dan table; `COPY FROM` menyalin data ke table, dan PostgreSQL 18 documentation juga mendokumentasikan opsi `ON_ERROR` untuk best-effort load ketika sebagian row bermasalah. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-copy.html?utm_source=chatgpt.com))

---

## 3. Decision Matrix

| Kebutuhan | Pilihan utama |
|---|---|
| 1 row per request, low traffic | single insert |
| 10-1.000 row per request | JDBC/MyBatis batch atau multi-row insert |
| puluhan ribu sampai jutaan row | `COPY` |
| data perlu divalidasi dulu | staging table |
| data bisa duplicate/replay | registry + `ON CONFLICT` |
| data dari Kafka/RabbitMQ | consumer micro-batch |
| data dari file historis | `COPY` ke staging lalu merge |
| strict per-row error report | staging table + validation |
| latency real-time | small batch dengan flush cepat |
| throughput maksimal | `COPY` + staging + partition-ready |

---

## 4. Baseline Table untuk Raw Time-Series

```sql
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_id        uuid not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    value_numeric   numeric,
    value_text      text,
    value_quality   text not null default 'GOOD',
    time_quality    text not null default 'NORMAL',
    tags            jsonb not null default '{}'::jsonb,

    constraint metric_sample_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            event_time,
            event_id
        ),

    constraint metric_sample_value_chk
        check (
            value_numeric is not null
            or value_text is not null
        )
)
partition by range (event_time);
```

Index baseline:

```sql
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
);

create index metric_sample_event_time_brin_idx
on metric_sample using brin (
    event_time
);

create index metric_sample_ingest_time_idx
on metric_sample (
    ingest_time desc
);
```

---

# 5. Pattern 1 - Single Insert

Single insert cocok untuk traffic rendah atau command penting yang harus langsung divalidasi.

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    value_quality,
    time_quality,
    tags
)
values (
    #{tenantId},
    #{sourceId},
    #{eventId},
    #{metricName},
    #{eventTime},
    #{valueNumeric},
    #{valueQuality},
    #{timeQuality},
    #{tags, typeHandler=com.example.JsonbTypeHandler}::jsonb
);
```

### Kapan cocok?

| Cocok | Tidak cocok |
|---|---|
| low volume | high-frequency metric |
| command penting | bulk sensor data |
| perlu response cepat per event | backfill |
| validasi detail per row | jutaan row |

### Anti-pattern

```text
1 HTTP request = 1 DB transaction = 1 row insert
```

Ini akan cepat menjadi bottleneck kalau data masuk ratusan/ribuan row per detik.

---

# 6. Pattern 2 - Multi-row INSERT

Multi-row insert mengurangi round-trip.

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    tags
)
values
    (10, 1001, '018f7d42-7b7c-7b1a-9e58-8b2ffbb7b111', 'temperature_celsius', '2026-07-15 10:00:00+07', 31.5, '{}'::jsonb),
    (10, 1001, '018f7d42-7b7c-7b1a-9e58-8b2ffbb7b112', 'temperature_celsius', '2026-07-15 10:00:10+07', 31.6, '{}'::jsonb),
    (10, 1001, '018f7d42-7b7c-7b1a-9e58-8b2ffbb7b113', 'temperature_celsius', '2026-07-15 10:00:20+07', 31.7, '{}'::jsonb);
```

### Kapan cocok?

| Cocok | Catatan |
|---|---|
| API menerima array kecil | misal 100-1.000 row |
| micro-batch dari broker | flush per N row atau T ms |
| validasi dilakukan di service | row invalid dipisahkan sebelum insert |
| tidak ingin pakai `COPY` | tetap SQL biasa |

---

## 7. MyBatis Multi-row Insert dengan `<foreach>`

Mapper:

```java
public interface MetricSampleMapper {
    int insertMetricSamples(@Param("rows") List<MetricSampleRow> rows);
}
```

XML:

```xml
<insert id="insertMetricSamples">
    insert into metric_sample (
        tenant_id,
        source_id,
        event_id,
        metric_name,
        event_time,
        value_numeric,
        value_text,
        value_quality,
        time_quality,
        tags
    )
    values
    <foreach collection="rows" item="row" separator=",">
        (
            #{row.tenantId},
            #{row.sourceId},
            #{row.eventId},
            #{row.metricName},
            #{row.eventTime},
            #{row.valueNumeric},
            #{row.valueText},
            #{row.valueQuality},
            #{row.timeQuality},
            #{row.tags, typeHandler=com.example.JsonbTypeHandler}::jsonb
        )
    </foreach>
</insert>
```

### Guard penting

| Guard | Kenapa |
|---|---|
| Batasi ukuran list | query terlalu besar bisa gagal/boros memory |
| Validasi empty list | hindari SQL invalid |
| Jangan batch terlalu besar | lock/WAL/transaction latency naik |
| Pisahkan row invalid | jangan satu row buruk menggagalkan semua |
| Ukur payload size | JSONB tags bisa besar |

Rekomendasi awal:

```text
batch size API online: 100-1.000 rows
batch size broker consumer: 500-5.000 rows
bulk backfill: COPY, bukan MyBatis foreach
```

---

# 8. Pattern 3 - JDBC / MyBatis Batch Executor

MyBatis punya `SqlSession` sebagai interface utama, dan `SqlSessionFactory` dapat membuat session dengan opsi executor yang berbeda; `ExecutorType.BATCH` digunakan saat ingin menunda eksekusi statement dan mengirim batch. ([MyBatis](https://mybatis.org/mybatis-3/java-api.html?utm_source=chatgpt.com))

Contoh manual MyBatis batch:

```java
try (SqlSession session = sqlSessionFactory.openSession(ExecutorType.BATCH, false)) {
    MetricSampleMapper mapper = session.getMapper(MetricSampleMapper.class);

    int count = 0;

    for (MetricSampleRow row : rows) {
        mapper.insertMetricSample(row);
        count++;

        if (count % 1000 == 0) {
            session.flushStatements();
            session.commit();
        }
    }

    session.flushStatements();
    session.commit();
} catch (RuntimeException ex) {
    throw ex;
}
```

Mapper insert single row:

```xml
<insert id="insertMetricSample">
    insert into metric_sample (
        tenant_id,
        source_id,
        event_id,
        metric_name,
        event_time,
        value_numeric,
        value_text,
        value_quality,
        time_quality,
        tags
    )
    values (
        #{tenantId},
        #{sourceId},
        #{eventId},
        #{metricName},
        #{eventTime},
        #{valueNumeric},
        #{valueText},
        #{valueQuality},
        #{timeQuality},
        #{tags, typeHandler=com.example.JsonbTypeHandler}::jsonb
    )
</insert>
```

### Kapan pakai MyBatis batch?

| Cocok | Tidak cocok |
|---|---|
| existing codebase MyBatis | throughput ekstrem |
| batch sedang | file jutaan row |
| ingin tetap pakai mapper | butuh fastest path |
| transaksi per batch | strict row-level rejection report |

---

## 9. pgJDBC `reWriteBatchedInserts`

pgJDBC punya connection property `reWriteBatchedInserts`, default `false`, yang dapat mengubah batch insert menjadi multi-values insert dan dokumentasi pgJDBC menyebut potensi improvement 2-3x; ada juga `reWriteBatchedInsertsSize` untuk membatasi jumlah row yang digabung, dengan batas terkait jumlah bind parameter. ([pgJDBC](https://jdbc.postgresql.org/documentation/use/))

JDBC URL:

```properties
jdbc:postgresql://db-host:5432/appdb?reWriteBatchedInserts=true
```

HikariCP:

```properties
dataSource.reWriteBatchedInserts=true
dataSource.reWriteBatchedInsertsSize=1000
```

### Catatan production

| Catatan | Implikasi |
|---|---|
| Tidak semua statement bisa direwrite optimal | ukur dengan benchmark nyata |
| Terlalu besar batch bisa membebani memory/WAL | batasi batch size |
| Banyak column berarti banyak bind parameter | perhatikan limit parameter |
| `ON CONFLICT` bisa mempengaruhi rewrite | test dengan SQL final yang dipakai |
| Observability tetap wajib | ukur throughput, latency, error, WAL |

---

# 10. Pattern 4 - `COPY FROM STDIN`

Untuk bulk load, `COPY` biasanya jauh lebih tepat daripada ribuan/milions insert statement. PostgreSQL `COPY FROM` membaca data dari file, program, atau stdin ke table; untuk `COPY FROM STDIN`, data dikirim dari client ke server. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-copy.html?utm_source=chatgpt.com))

Contoh SQL:

```sql
copy metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    value_text,
    value_quality,
    time_quality,
    tags
)
from stdin
with (
    format csv,
    header true
);
```

### Kapan pakai `COPY`?

| Cocok | Tidak cocok |
|---|---|
| backfill historis | request kecil |
| file ingestion | validasi business kompleks per row di Java |
| jutaan row | strict per-row API response |
| migration data | butuh immediate per-row result |
| pipeline batch | data sangat tidak bersih tanpa staging |

---

## 11. Java pgJDBC `CopyManager`

pgJDBC menyediakan `CopyManager` sebagai API untuk PostgreSQL `COPY` bulk data transfer. ([pgJDBC](https://jdbc.postgresql.org/documentation/publicapi/org/postgresql/copy/CopyManager.html?utm_source=chatgpt.com))

Contoh Java:

```java
import org.postgresql.PGConnection;
import org.postgresql.copy.CopyManager;

import java.io.Reader;
import java.sql.Connection;

public final class MetricCopyImporter {

    public long copyCsv(Connection connection, Reader csvReader) throws Exception {
        PGConnection pgConnection = connection.unwrap(PGConnection.class);
        CopyManager copyManager = pgConnection.getCopyAPI();

        String sql = """
            copy metric_sample_staging (
                tenant_id,
                source_id,
                event_id,
                metric_name,
                event_time,
                value_numeric,
                value_text,
                value_quality,
                time_quality,
                tags
            )
            from stdin
            with (
                format csv,
                header true
            )
            """;

        return copyManager.copyIn(sql, csvReader);
    }
}
```

### Kenapa ke staging, bukan langsung raw table?

Karena `COPY` ke raw table yang punya constraints/index/partition bisa gagal total jika ada row buruk. Staging memberi ruang untuk validasi, dedup, dan error isolation.

---

# 12. Pattern 5 - Staging Table + Merge

Staging adalah pola paling aman untuk ingestion besar.

```text
Input file/message batch
      │
      ▼
metric_sample_staging
      │
      ├─ validate
      ├─ reject invalid rows
      ├─ deduplicate
      ├─ classify time_quality
      ▼
metric_sample partitioned raw table
```

Staging table:

```sql
create table metric_sample_staging (
    batch_id        uuid not null,
    row_number      bigint not null,

    tenant_id       bigint,
    source_id       bigint,
    event_id        uuid,
    metric_name     text,
    event_time      timestamptz,

    value_numeric   numeric,
    value_text      text,
    value_quality   text,
    time_quality    text,
    tags            jsonb,

    loaded_at       timestamptz not null default clock_timestamp(),

    constraint metric_sample_staging_pk
        primary key (batch_id, row_number)
);
```

Reject table:

```sql
create table metric_sample_reject (
    batch_id       uuid not null,
    row_number     bigint not null,
    reject_reason  text not null,
    raw_payload     jsonb,
    rejected_at     timestamptz not null default clock_timestamp(),

    constraint metric_sample_reject_pk
        primary key (batch_id, row_number, reject_reason)
);
```

---

## 13. Validate Staging Rows

```sql
insert into metric_sample_reject (
    batch_id,
    row_number,
    reject_reason,
    raw_payload
)
select
    batch_id,
    row_number,
    case
        when tenant_id is null then 'TENANT_ID_REQUIRED'
        when source_id is null then 'SOURCE_ID_REQUIRED'
        when event_id is null then 'EVENT_ID_REQUIRED'
        when metric_name is null then 'METRIC_NAME_REQUIRED'
        when event_time is null then 'EVENT_TIME_REQUIRED'
        when value_numeric is null and value_text is null then 'VALUE_REQUIRED'
        else 'UNKNOWN'
    end as reject_reason,
    to_jsonb(metric_sample_staging)
from metric_sample_staging
where batch_id = :batchId
  and (
      tenant_id is null
      or source_id is null
      or event_id is null
      or metric_name is null
      or event_time is null
      or (value_numeric is null and value_text is null)
  );
```

Valid rows:

```sql
select s.*
from metric_sample_staging s
where s.batch_id = :batchId
  and not exists (
      select 1
      from metric_sample_reject r
      where r.batch_id = s.batch_id
        and r.row_number = s.row_number
  );
```

---

## 14. Merge dari Staging ke Raw Table

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    value_text,
    value_quality,
    time_quality,
    tags
)
select
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    value_text,
    coalesce(value_quality, 'GOOD'),
    coalesce(time_quality, 'NORMAL'),
    coalesce(tags, '{}'::jsonb)
from metric_sample_staging s
where s.batch_id = :batchId
  and not exists (
      select 1
      from metric_sample_reject r
      where r.batch_id = s.batch_id
        and r.row_number = s.row_number
  )
on conflict (
    tenant_id,
    source_id,
    metric_name,
    event_time,
    event_id
)
do nothing;
```

PostgreSQL `INSERT ... ON CONFLICT` mendukung `DO NOTHING` atau `DO UPDATE` sebagai aksi alternatif saat terjadi unique/exclusion constraint conflict; untuk ingestion replay-safe raw event, `DO NOTHING` biasanya lebih defensible daripada update diam-diam. ([Stack Overflow](https://stackoverflow.com/questions/36359440/postgresql-insert-on-conflict-update-upsert-use-all-excluded-values?utm_source=chatgpt.com))

---

# 15. Idempotency Registry untuk Replay-Safe Ingestion

Karena unique constraint pada partitioned table perlu memasukkan partition key, dedup global lebih rapi memakai registry terpisah.

```sql
create table ingestion_event_registry (
    tenant_id      bigint not null,
    event_id       uuid not null,
    first_seen_at  timestamptz not null default clock_timestamp(),
    source_name    text,

    constraint ingestion_event_registry_pk
        primary key (tenant_id, event_id)
);
```

Insert registry:

```sql
insert into ingestion_event_registry (
    tenant_id,
    event_id,
    source_name
)
select distinct
    tenant_id,
    event_id,
    'metric-sample-ingest'
from metric_sample_staging s
where batch_id = :batchId
on conflict do nothing;
```

Lalu insert hanya event yang berhasil register:

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    value_text,
    value_quality,
    time_quality,
    tags
)
select
    s.tenant_id,
    s.source_id,
    s.event_id,
    s.metric_name,
    s.event_time,
    s.value_numeric,
    s.value_text,
    coalesce(s.value_quality, 'GOOD'),
    coalesce(s.time_quality, 'NORMAL'),
    coalesce(s.tags, '{}'::jsonb)
from metric_sample_staging s
join ingestion_event_registry r
  on r.tenant_id = s.tenant_id
 and r.event_id = s.event_id
where s.batch_id = :batchId
  and not exists (
      select 1
      from metric_sample_reject rej
      where rej.batch_id = s.batch_id
        and rej.row_number = s.row_number
  )
on conflict do nothing;
```

Catatan: query di atas belum membedakan event registry yang baru dibuat vs sudah ada. Jika perlu strict “hanya newly registered”, gunakan temporary table/result table untuk menangkap inserted registry rows.

---

## 16. Better Registry Pattern: Capture Newly Accepted Events

Accepted table:

```sql
create temporary table accepted_ingestion_event (
    tenant_id bigint not null,
    event_id uuid not null,
    primary key (tenant_id, event_id)
) on commit drop;
```

Insert registry dan capture:

```sql
with inserted as (
    insert into ingestion_event_registry (
        tenant_id,
        event_id,
        source_name
    )
    select distinct
        tenant_id,
        event_id,
        'metric-sample-ingest'
    from metric_sample_staging
    where batch_id = :batchId
    on conflict do nothing
    returning tenant_id, event_id
)
insert into accepted_ingestion_event (
    tenant_id,
    event_id
)
select
    tenant_id,
    event_id
from inserted;
```

Insert raw hanya event baru:

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    value_text,
    value_quality,
    time_quality,
    tags
)
select
    s.tenant_id,
    s.source_id,
    s.event_id,
    s.metric_name,
    s.event_time,
    s.value_numeric,
    s.value_text,
    coalesce(s.value_quality, 'GOOD'),
    coalesce(s.time_quality, 'NORMAL'),
    coalesce(s.tags, '{}'::jsonb)
from metric_sample_staging s
join accepted_ingestion_event a
  on a.tenant_id = s.tenant_id
 and a.event_id = s.event_id
where s.batch_id = :batchId
  and not exists (
      select 1
      from metric_sample_reject r
      where r.batch_id = s.batch_id
        and r.row_number = s.row_number
  );
```

---

# 17. Transaction Boundary

Ada dua strategi utama.

## Option A - All-or-nothing per batch

```text
begin
  copy to staging
  validate
  merge
commit
```

| Cocok | Risiko |
|---|---|
| batch kecil-menengah | satu error bisa rollback semua |
| consistency kuat | transaction lama |
| operationally simple | lock/WAL spike |

## Option B - Chunked transaction

```text
batch 1.000-10.000 rows:
  copy/insert staging chunk
  validate chunk
  merge chunk
  commit
```

| Cocok | Risiko |
|---|---|
| file besar | partial success |
| mengurangi lock/WAL pressure | perlu tracking checkpoint |
| lebih recoverable | perlu batch status table |

Rekomendasi praktis: **online ingestion pakai chunked batch**, bukan transaction raksasa.

---

## 18. Batch Status Table

```sql
create table ingestion_batch (
    batch_id        uuid primary key,
    source_name     text not null,
    status          text not null,
    received_at     timestamptz not null default clock_timestamp(),
    started_at      timestamptz,
    completed_at    timestamptz,

    total_rows       bigint,
    accepted_rows    bigint,
    rejected_rows    bigint,
    duplicate_rows   bigint,

    error_message    text,

    constraint ingestion_batch_status_chk
        check (status in (
            'RECEIVED',
            'LOADING',
            'VALIDATING',
            'MERGING',
            'COMPLETED',
            'PARTIAL_FAILED',
            'FAILED'
        ))
);
```

Update lifecycle:

```sql
update ingestion_batch
set
    status = 'COMPLETED',
    completed_at = clock_timestamp(),
    total_rows = :totalRows,
    accepted_rows = :acceptedRows,
    rejected_rows = :rejectedRows,
    duplicate_rows = :duplicateRows
where batch_id = :batchId;
```

---

# 19. API Design: Jersey Batch Ingestion

Request:

```java
public record MetricSampleBatchRequest(
    UUID batchId,
    List<MetricSampleRequest> samples
) {}
```

Resource:

```java
@Path("/v1/metric-samples")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class MetricSampleResource {

    private final MetricIngestionService ingestionService;

    @POST
    @Path("/batch")
    public Response ingestBatch(MetricSampleBatchRequest request) {
        if (request.samples() == null || request.samples().isEmpty()) {
            throw new BadRequestException("samples must not be empty");
        }

        if (request.samples().size() > 1000) {
            throw new BadRequestException("batch too large; max 1000 samples");
        }

        MetricIngestionResult result = ingestionService.ingestOnlineBatch(request);

        return Response.accepted(result).build();
    }
}
```

Response:

```java
public record MetricIngestionResult(
    UUID batchId,
    int receivedRows,
    int acceptedRows,
    int rejectedRows,
    int duplicateRows
) {}
```

---

## 20. Online Batch Service Flow

```java
public MetricIngestionResult ingestOnlineBatch(MetricSampleBatchRequest request) {
    UUID batchId = request.batchId() != null
        ? request.batchId()
        : UUID.randomUUID();

    List<MetricSampleRow> validRows = new ArrayList<>();
    List<MetricRejectRow> rejectedRows = new ArrayList<>();

    Instant receivedTime = Instant.now();

    int rowNumber = 0;
    for (MetricSampleRequest sample : request.samples()) {
        rowNumber++;

        ValidationResult validation = validator.validate(sample);
        if (!validation.valid()) {
            rejectedRows.add(MetricRejectRow.from(batchId, rowNumber, validation.reason(), sample));
            continue;
        }

        validRows.add(toRow(batchId, rowNumber, sample, receivedTime));
    }

    int accepted = metricSampleMapper.insertMetricSamplesIgnoreDuplicates(validRows);
    metricRejectMapper.insertRejects(rejectedRows);

    return new MetricIngestionResult(
        batchId,
        request.samples().size(),
        accepted,
        rejectedRows.size(),
        validRows.size() - accepted
    );
}
```

---

## 21. MyBatis Insert Ignore Duplicate

```xml
<insert id="insertMetricSamplesIgnoreDuplicates">
    insert into metric_sample (
        tenant_id,
        source_id,
        event_id,
        metric_name,
        event_time,
        value_numeric,
        value_text,
        value_quality,
        time_quality,
        tags
    )
    values
    <foreach collection="rows" item="row" separator=",">
        (
            #{row.tenantId},
            #{row.sourceId},
            #{row.eventId},
            #{row.metricName},
            #{row.eventTime},
            #{row.valueNumeric},
            #{row.valueText},
            #{row.valueQuality},
            #{row.timeQuality},
            #{row.tags, typeHandler=com.example.JsonbTypeHandler}::jsonb
        )
    </foreach>
    on conflict (
        tenant_id,
        source_id,
        metric_name,
        event_time,
        event_id
    )
    do nothing
</insert>
```

### Catatan

`executeUpdate()`/mapper return count untuk multi-row insert dengan conflict bisa menunjukkan jumlah row yang benar-benar inserted, bukan semua input. Pakai batch status untuk menghitung duplicate.

---

# 22. Backpressure

Backpressure berarti service tidak menerima lebih banyak data daripada yang bisa diproses.

Tanpa backpressure:

```text
traffic spike
  → connection pool penuh
  → DB latency naik
  → request timeout
  → client retry
  → duplicate/replay
  → DB makin berat
```

Dengan backpressure:

```text
traffic spike
  → queue/buffer bounded
  → batch flush terkendali
  → reject/429 saat overload
  → DB tetap stabil
```

### Guard di API

| Guard | Contoh |
|---|---|
| max batch size | 1.000 rows |
| max payload size | 1-10 MB |
| request timeout | 2-10 sec |
| connection pool limit | bounded |
| queue limit | bounded |
| rate limit per tenant/source | wajib multi-tenant |
| circuit breaker | jika DB unhealthy |
| 429 response | overload bukan 500 |

---

## 23. Bounded Queue Ingestion Worker

```java
public final class MetricIngestionBuffer {

    private final BlockingQueue<MetricSampleRequest> queue =
        new ArrayBlockingQueue<>(100_000);

    public boolean offer(MetricSampleRequest sample) {
        return queue.offer(sample);
    }

    public List<MetricSampleRequest> drainBatch(int maxRows, Duration maxWait) throws InterruptedException {
        List<MetricSampleRequest> batch = new ArrayList<>(maxRows);

        MetricSampleRequest first = queue.poll(maxWait.toMillis(), TimeUnit.MILLISECONDS);
        if (first == null) {
            return batch;
        }

        batch.add(first);
        queue.drainTo(batch, maxRows - 1);
        return batch;
    }
}
```

Worker:

```java
public final class MetricIngestionWorker implements Runnable {

    private final MetricIngestionBuffer buffer;
    private final MetricIngestionService service;

    @Override
    public void run() {
        while (!Thread.currentThread().isInterrupted()) {
            try {
                List<MetricSampleRequest> batch =
                    buffer.drainBatch(1000, Duration.ofMillis(200));

                if (!batch.isEmpty()) {
                    service.ingestWorkerBatch(batch);
                }
            } catch (Exception ex) {
                // log, metric, retry strategy
            }
        }
    }
}
```

### Production warning

In-memory queue hilang saat pod restart. Untuk critical data, gunakan durable broker seperti Kafka/RabbitMQ atau simpan inbox table.

---

# 24. Broker Consumer Micro-Batch

Untuk Kafka/RabbitMQ:

```text
poll messages
  → validate
  → group into batch
  → insert with idempotency
  → commit offset/ack only after DB commit
```

Pseudo-flow:

```java
while (running) {
    List<Message> messages = consumer.poll(maxRecords, pollTimeout);

    List<MetricSampleRow> rows = messages.stream()
        .map(this::toMetricSampleRow)
        .toList();

    try {
        transactionTemplate.execute(() -> {
            metricSampleMapper.insertMetricSamplesIgnoreDuplicates(rows);
            return null;
        });

        consumer.ack(messages);
    } catch (Exception ex) {
        consumer.nackOrRetry(messages);
    }
}
```

### Ack rule

| Rule | Alasan |
|---|---|
| Ack setelah DB commit | mencegah data hilang |
| Idempotency wajib | retry bisa duplicate |
| Batch size bounded | hindari transaksi besar |
| Poison message route | jangan blocking partition/queue |
| Lag metric | ukur broker lag + DB lag |

---

# 25. Bulk Backfill Pipeline

Backfill historis jangan lewat endpoint online biasa.

```text
File/object storage
  → import job
  → COPY to staging
  → validate
  → ensure historical partitions
  → merge to raw
  → analyze affected partitions
  → refresh rollup
  → mark batch complete
```

### Step 1 - create batch

```sql
insert into ingestion_batch (
    batch_id,
    source_name,
    status
)
values (
    :batchId,
    'historical-backfill',
    'RECEIVED'
);
```

### Step 2 - ensure partition

```sql
select create_metric_sample_daily_partition(date '2026-07-15');
```

### Step 3 - COPY to staging

```sql
copy metric_sample_staging (
    batch_id,
    row_number,
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    value_text,
    value_quality,
    time_quality,
    tags
)
from stdin
with (
    format csv,
    header true
);
```

### Step 4 - validate, merge, analyze

```sql
analyze metric_sample_2026_07_15;
```

`ANALYZE` penting setelah bulk load agar planner punya statistik yang lebih akurat untuk partition terdampak.

---

## 26. PostgreSQL `COPY ON_ERROR` dan `REJECT_LIMIT`

Di PostgreSQL current documentation, `COPY FROM` mendukung `ON_ERROR` untuk best-effort load dan `REJECT_LIMIT` untuk menghentikan load setelah jumlah error tertentu; ini berguna untuk file kotor, tetapi bukan pengganti validasi business rule yang rapi. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-copy.html?utm_source=chatgpt.com))

Contoh:

```sql
copy metric_sample_staging (
    batch_id,
    row_number,
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    value_text,
    value_quality,
    time_quality,
    tags
)
from stdin
with (
    format csv,
    header true,
    on_error ignore,
    reject_limit 100
);
```

### Catatan penting

| Fitur | Gunakan untuk |
|---|---|
| `ON_ERROR ignore` | skip row yang gagal parsing/input conversion |
| `REJECT_LIMIT` | batasi jumlah row error |
| reject table custom | business validation error |
| staging validation | domain quality, duplicate, late/skew |

Untuk enterprise ingestion, saya tetap sarankan **staging + reject table** karena Anda butuh alasan reject yang eksplisit dan auditable.

---

# 27. Handling Bad Rows

Ada tiga level error:

| Level | Contoh | Handling |
|---|---|---|
| Parse error | CSV rusak, timestamp invalid | `COPY ON_ERROR` atau fail batch |
| Schema error | null required field | staging reject |
| Business error | event terlalu lama, unknown metric | reject table |
| Duplicate | replay event_id | registry / `ON CONFLICT DO NOTHING` |
| Partition error | partition belum ada | create partition + retry |
| DB overload | timeout/deadlock | backoff retry |

Reject row example:

```sql
insert into metric_sample_reject (
    batch_id,
    row_number,
    reject_reason,
    raw_payload
)
values (
    :batchId,
    :rowNumber,
    'EVENT_TIME_OUTSIDE_ACCEPTED_WINDOW',
    :rawPayload::jsonb
);
```

---

## 28. Partition Readiness Before Insert

Sebelum batch merge, pastikan partition tersedia untuk min/max event_time.

```sql
select
    min(event_time) as min_event_time,
    max(event_time) as max_event_time
from metric_sample_staging
where batch_id = :batchId;
```

Lalu buat partition harian yang diperlukan.

Pseudo Java:

```java
public void ensurePartitionsForBatch(UUID batchId) {
    TimeRange range = stagingMapper.findEventTimeRange(batchId);

    LocalDate start = range.from().atZone(ZoneOffset.UTC).toLocalDate();
    LocalDate end = range.to().atZone(ZoneOffset.UTC).toLocalDate();

    for (LocalDate day = start; !day.isAfter(end); day = day.plusDays(1)) {
        partitionMapper.createMetricSampleDailyPartition(day);
    }
}
```

---

# 29. Transaction Retry Strategy

Retry semua error secara buta itu berbahaya.

| Error | Retry? | Catatan |
|---|---:|---|
| network timeout | Ya | idempotency wajib |
| deadlock | Ya | exponential backoff |
| serialization failure | Ya | jika isolation tinggi |
| unique violation | Tidak/handled | pakai `ON CONFLICT` |
| check constraint violation | Tidak | data invalid |
| no partition | Setelah fix partition | operational recovery |
| connection pool exhausted | Backpressure | jangan spam retry |
| disk full | Tidak | incident DB |

Pseudo retry:

```java
public <T> T retryDbOperation(Supplier<T> operation) {
    int attempts = 0;

    while (true) {
        try {
            return operation.get();
        } catch (TransientDatabaseException ex) {
            attempts++;

            if (attempts >= 3) {
                throw ex;
            }

            sleepBackoff(attempts);
        }
    }
}
```

---

## 30. Insert Performance Knobs

| Knob | Efek |
|---|---|
| batch size | throughput naik sampai titik tertentu |
| transaction size | terlalu besar meningkatkan WAL/lock/recovery cost |
| index count | makin banyak index, insert makin berat |
| partition count | terlalu banyak partition bisa memperberat planning/DDL |
| synchronous commit | durability vs latency trade-off |
| connection pool size | terlalu besar bisa membebani DB |
| `COPY` | fastest bulk path |
| staging table | validasi lebih aman |
| autovacuum/analyze | statistik dan bloat control |
| WAL/storage IOPS | bottleneck utama high ingest |

### Jangan langsung tuning DB global

Mulai dari desain ingestion:

```text
batching benar
partition tersedia
index tidak berlebihan
transaction bounded
staging untuk bulk
backpressure ada
```

Baru setelah itu tuning parameter DB.

---

## 31. `synchronous_commit` untuk Ingestion

Untuk data yang boleh kehilangan beberapa transaksi saat crash, `synchronous_commit = off` bisa menurunkan commit latency. Tetapi untuk data regulatory/audit/critical, jangan matikan durability secara sembarangan.

Session-level:

```sql
set local synchronous_commit = off;
```

Use case:

| Use case | `synchronous_commit` |
|---|---|
| audit/regulatory event | on |
| billing/financial event | on |
| sensor metric non-critical | bisa dipertimbangkan off |
| backfill yang bisa diulang | bisa dipertimbangkan off |
| queue-backed replayable event | bisa dipertimbangkan off jika replay aman |

---

## 32. Connection Pool Strategy

Untuk high ingest, connection pool besar bukan selalu lebih baik.

```text
too many app connections
  → DB context switching naik
  → lock contention naik
  → latency naik
  → timeout
```

Rekomendasi praktis:

| Workload | Pool |
|---|---|
| API online | bounded small-medium |
| batch worker | dedicated write pool |
| reporting query | separate read pool |
| admin/maintenance | separate role/pool |
| backfill | controlled job, not app pool |

Hikari example:

```properties
maximumPoolSize=20
minimumIdle=5
connectionTimeout=2000
idleTimeout=300000
maxLifetime=1800000
dataSource.reWriteBatchedInserts=true
dataSource.options=-c TimeZone=UTC
```

---

# 33. Observability Ingestion

Minimal metrics:

| Metric | Meaning |
|---|---|
| rows received/sec | input pressure |
| rows inserted/sec | DB throughput |
| rejected rows/sec | data quality |
| duplicate rows/sec | replay/idempotency |
| ingestion lag | `ingest_time - event_time` |
| DB insert latency p95/p99 | write health |
| batch size distribution | batching health |
| queue depth | backpressure |
| broker lag | consumer health |
| partition miss count | lifecycle issue |
| copy duration | bulk load health |
| WAL growth | DB pressure |

SQL ingestion lag:

```sql
select
    percentile_cont(0.50) within group (order by ingest_time - event_time) as p50_lag,
    percentile_cont(0.95) within group (order by ingest_time - event_time) as p95_lag,
    percentile_cont(0.99) within group (order by ingest_time - event_time) as p99_lag
from metric_sample
where ingest_time >= clock_timestamp() - interval '1 hour';
```

Batch status summary:

```sql
select
    status,
    count(*) as batch_count,
    sum(total_rows) as total_rows,
    sum(accepted_rows) as accepted_rows,
    sum(rejected_rows) as rejected_rows,
    sum(duplicate_rows) as duplicate_rows
from ingestion_batch
where received_at >= clock_timestamp() - interval '24 hours'
group by status
order by status;
```

---

# 34. Production Runbook: Ingestion Slowing Down

## Symptoms

```text
API latency naik
DB insert p95 naik
queue depth naik
broker lag naik
connection pool penuh
WAL growth naik
```

## Investigation

```text
1. Cek DB CPU/IO/WAL.
2. Cek active query dan lock.
3. Cek batch size aktual.
4. Cek apakah partition masa depan tersedia.
5. Cek apakah default partition menerima row.
6. Cek index count dan index bloat.
7. Cek apakah ada backfill berjalan bersamaan.
8. Cek reject/duplicate spike.
```

SQL active ingestion query:

```sql
select
    pid,
    now() - query_start as duration,
    wait_event_type,
    wait_event,
    state,
    left(query, 300) as query_sample
from pg_stat_activity
where datname = current_database()
  and state <> 'idle'
order by duration desc;
```

---

## 35. Production Runbook: Duplicate Spike

## Symptoms

```text
duplicate_rows meningkat
ON CONFLICT DO NOTHING banyak
consumer retry meningkat
client timeout meningkat
```

## Likely causes

| Cause | Check |
|---|---|
| client retry karena timeout | API logs |
| broker redelivery | consumer lag/ack logs |
| idempotency key salah | event_id generation |
| batch replay manual | ingestion_batch source |
| DB transaction timeout | DB logs |
| partition error causing retry | partition miss logs |

Mitigation:

```text
1. Pastikan event_id deterministic dari source jika memungkinkan.
2. Jangan generate event_id baru pada retry.
3. Ack broker hanya setelah DB commit.
4. Return accepted batch id ke client.
5. Buat duplicate metric per tenant/source.
```

---

## 36. Production Runbook: Partition Missing During Ingestion

## Symptoms

```text
ERROR: no partition of relation found for row
```

## Response

```text
1. Ambil min/max event_time dari failed batch.
2. Create missing partition.
3. Retry failed batch dengan idempotency.
4. Cek default partition jika ada.
5. Cek future partition job.
6. Tambah coverage alert.
```

SQL:

```sql
select ensure_metric_sample_future_partitions(14);
```

Historical:

```sql
select create_metric_sample_daily_partition(date '2026-07-15');
```

---

# 37. Anti-Patterns

| Anti-pattern | Dampak |
|---|---|
| 1 request = 1 row insert untuk high-frequency data | throughput rendah |
| Tidak ada idempotency key | retry menghasilkan duplicate |
| Batch terlalu besar | timeout, WAL spike, rollback mahal |
| Batch terlalu kecil | round-trip overhead besar |
| Backfill lewat endpoint online | mengganggu traffic normal |
| `COPY` langsung ke raw tanpa staging | row buruk bisa menggagalkan load |
| Tidak ada reject table | data quality tidak auditable |
| Ack broker sebelum DB commit | data bisa hilang |
| Retry semua error | memperparah overload |
| Connection pool terlalu besar | DB makin berat |
| Terlalu banyak index raw table | insert lambat |
| Tidak monitor ingestion lag | late data tidak terlihat |
| Tidak ensure partition sebelum backfill | gagal saat merge |
| Update raw event untuk correction | auditability lemah |

---

# 38. Practical Baseline Architecture

```text
Online API path
  Jersey endpoint
    → validate request
    → bounded batch size
    → MyBatis multi-row insert
    → ON CONFLICT DO NOTHING
    → response accepted/rejected/duplicate count

Broker path
  Kafka/RabbitMQ consumer
    → poll bounded records
    → validate
    → insert batch
    → commit offset/ack after DB commit
    → retry with idempotency

Bulk backfill path
  file/object storage
    → COPY to staging
    → validate to reject table
    → ensure partitions
    → merge to raw
    → analyze partitions
    → refresh rollups
```

---

# 39. Recommended Defaults

| Parameter | Starting point |
|---|---|
| API batch max | 1.000 rows |
| Worker batch max | 1.000-5.000 rows |
| Flush interval | 100-500 ms |
| Backfill method | `COPY` to staging |
| Online insert | MyBatis multi-row or batch executor |
| Duplicate handling | `ON CONFLICT DO NOTHING` |
| Critical data durability | `synchronous_commit=on` |
| Replayable metric data | consider bounded relaxed durability only after risk review |
| Connection pool | bounded; separate API/backfill/admin |
| Reject handling | reject table with reason |
| Partition readiness | check before merge/backfill |
| Observability | rows/sec, lag, reject, duplicate, latency, queue depth |

---

# Seri 6/16 Selesai

**Seri 6 selesai.**  
Materi ini menutup high-throughput ingestion untuk PostgreSQL time-series: single insert, multi-row insert, MyBatis batch, pgJDBC batch rewrite, `COPY`, `CopyManager`, staging table, reject table, idempotency registry, transaction boundary, backpressure, broker micro-batch, bulk backfill, observability, dan runbook ingestion incident.

## Rekomendasi materi selanjutnya

Lanjut ke **Seri 7/16 - Idempotency & Deduplication: unique key, `ON CONFLICT`, event registry, retry/replay safety, duplicate detection, correction event, dan exactly-once illusion**.

---

**Sources:**

- [Documentation: 18: COPY](https://www.postgresql.org/docs/current/sql-copy.html?utm_source=chatgpt.com)
- [Java API - MyBatis 3](https://mybatis.org/mybatis-3/java-api.html?utm_source=chatgpt.com)
- [Initializing the Driver | pgJDBC](https://jdbc.postgresql.org/documentation/use/)
- [PostgreSQL INSERT ON CONFLICT UPDATE (upsert) use ...](https://stackoverflow.com/questions/36359440/postgresql-insert-on-conflict-update-upsert-use-all-excluded-values?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:38:15 PM

Saya lanjut ke **Seri 7/16**. Fokusnya idempotency dan deduplication secara production: apa yang harus unik, kapan `ON CONFLICT` cukup, kapan perlu event registry, dan bagaimana menangani retry/replay/correction tanpa merusak audit trail.

# PostgreSQL Time-Series Database - Seri 7/16  
## Idempotency & Deduplication: Unique Key, `ON CONFLICT`, Event Registry, Retry/Replay Safety, Correction Event, dan Exactly-Once Illusion

**Status:** Seri 7 dari 16.  
Fokus seri ini: membuat ingestion time-series aman terhadap **retry**, **duplicate message**, **client timeout**, **broker replay**, **backfill ulang**, dan **correction** tanpa membuat data raw menjadi tidak defensible.

---

## 1. Mental Model Idempotency

**Idempotency** berarti operasi yang sama boleh dipanggil berulang kali, tetapi hasil akhirnya tetap sama.

```text
Request/message yang sama dikirim 1x
= hasil akhir A

Request/message yang sama dikirim 10x karena retry
= hasil akhir tetap A
```

Dalam time-series, duplicate bisa datang dari:

| Sumber duplicate | Contoh |
|---|---|
| HTTP client retry | client timeout lalu kirim ulang |
| message broker replay | Kafka consumer restart, RabbitMQ redelivery |
| batch reprocessing | file historis diproses ulang |
| scheduler double-run | job backfill jalan dua kali |
| network failure | DB commit sukses, response gagal |
| source system bug | device mengirim sample sama berkali-kali |
| manual replay | operator replay event setelah incident |

Tanpa idempotency, retry akan menghasilkan data ganda, agregasi salah, alert palsu, dan dashboard menipu.

---

## 2. Bedakan Duplicate Fisik vs Duplicate Semantik

Ini penting.

| Jenis | Arti | Contoh |
|---|---|---|
| **Physical duplicate** | event yang sama dikirim ulang | `event_id` sama |
| **Semantic duplicate** | kejadian logis sama tapi `event_id` beda | source sama, metric sama, timestamp sama |
| **Near duplicate** | timestamp sangat dekat, value mirip | sensor mengirim ulang dengan rounded timestamp |
| **Correction** | event baru memperbaiki event lama | sample lama dikoreksi karena source recalculation |
| **Compensating event** | event baru membatalkan/mengimbangi event lama | regulatory decision revoked |

Untuk production, jangan hanya mengandalkan satu jenis key. Biasanya butuh minimal:

```text
1. event_id untuk physical duplicate
2. logical key untuk semantic duplicate
3. correction model untuk perubahan yang sah
```

---

## 3. PostgreSQL Building Blocks

PostgreSQL `ON CONFLICT` menyediakan alternatif terhadap error unique/exclusion constraint, yaitu `DO NOTHING` atau `DO UPDATE`. Ini hanya bekerja jika ada constraint/index unik yang bisa menjadi conflict target. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-insert.html?utm_source=chatgpt.com))

PostgreSQL juga otomatis membuat unique index saat `UNIQUE` constraint atau `PRIMARY KEY` didefinisikan. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-unique.html?utm_source=chatgpt.com))

Namun pada **partitioned table**, ada batasan penting: unique/primary key pada partitioned table harus mencakup semua partition key column, karena uniqueness secara fisik ditegakkan oleh index per partition. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html?utm_source=chatgpt.com))

Implikasinya untuk table time-series partition by `event_time`:

```sql
-- Valid karena mencakup event_time sebagai partition key
unique (tenant_id, source_id, metric_name, event_time, event_id)

-- Bermasalah sebagai unique constraint parent partitioned table
-- karena tidak mencakup event_time
unique (tenant_id, event_id)
```

---

## 4. Baseline Raw Table

```sql
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_id        uuid not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    value_numeric   numeric,
    value_text      text,
    value_quality   text not null default 'GOOD',
    time_quality    text not null default 'NORMAL',

    correction_of_event_id uuid,
    correction_reason      text,

    tags            jsonb not null default '{}'::jsonb,

    constraint metric_sample_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            event_time,
            event_id
        ),

    constraint metric_sample_value_chk
        check (
            value_numeric is not null
            or value_text is not null
        ),

    constraint metric_sample_value_quality_chk
        check (
            value_quality in (
                'GOOD',
                'BAD',
                'ESTIMATED',
                'MISSING',
                'CORRECTED'
            )
        )
)
partition by range (event_time);
```

Primary key di atas aman untuk partitioned table karena mencakup `event_time`.

---

## 5. Pattern 1 - Simple `ON CONFLICT DO NOTHING`

Ini pola paling sederhana untuk raw immutable event.

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    value_text,
    value_quality,
    time_quality,
    tags
)
values (
    #{tenantId},
    #{sourceId},
    #{eventId},
    #{metricName},
    #{eventTime},
    #{valueNumeric},
    #{valueText},
    #{valueQuality},
    #{timeQuality},
    #{tags, typeHandler=com.example.JsonbTypeHandler}::jsonb
)
on conflict (
    tenant_id,
    source_id,
    metric_name,
    event_time,
    event_id
)
do nothing;
```

### Kapan cocok?

| Cocok | Alasan |
|---|---|
| raw sensor/event immutable | duplicate cukup diabaikan |
| broker retry | idempotent |
| HTTP retry | aman jika event_id sama |
| batch replay | tidak insert ulang |
| audit-like append event | tidak overwrite history |

### Kelemahan

| Kelemahan | Dampak |
|---|---|
| Hanya mendeteksi duplicate yang key-nya sama | semantic duplicate bisa lolos |
| Tidak tahu duplicate count detail | perlu metric tambahan |
| Tidak menangani correction | correction butuh event baru |
| Tidak cocok jika duplicate punya `event_id` beda | perlu logical unique atau registry |

---

## 6. Pattern 2 - Logical Unique Key

Untuk narrow metric table, logical duplicate biasanya:

```text
tenant_id + source_id + metric_name + event_time
```

Constraint:

```sql
alter table metric_sample
add constraint metric_sample_logical_uniq
unique (
    tenant_id,
    source_id,
    metric_name,
    event_time
);
```

Karena constraint ini mencakup `event_time`, ia cocok untuk partitioned table by `event_time`.

Insert:

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    value_quality,
    time_quality,
    tags
)
values (
    #{tenantId},
    #{sourceId},
    #{eventId},
    #{metricName},
    #{eventTime},
    #{valueNumeric},
    #{valueQuality},
    #{timeQuality},
    #{tags, typeHandler=com.example.JsonbTypeHandler}::jsonb
)
on conflict (
    tenant_id,
    source_id,
    metric_name,
    event_time
)
do nothing;
```

### Cocok jika

| Kondisi | Penjelasan |
|---|---|
| satu source hanya boleh punya satu metric per timestamp | sensor sample fixed |
| timestamp precision stabil | misal per detik/per menit |
| source tidak mengirim event_id reliable | logical key lebih stabil |
| correction diperlakukan sebagai event terpisah | bukan update row lama |

### Risiko

| Risiko | Contoh |
|---|---|
| timestamp terlalu presisi | duplicate beda nanosecond lolos |
| timestamp dibulatkan beda | `10:00:00.000` vs `10:00:00.001` |
| source mengirim dua reading sah di waktu sama | constraint terlalu ketat |
| correction tidak bisa masuk | karena logical key sudah ada |

---

## 7. Pattern 3 - Event Registry Terpisah

Karena unique `(tenant_id, event_id)` tidak bisa langsung menjadi global unique constraint di parent partitioned table by `event_time`, solusi yang sering lebih bersih adalah **event registry** terpisah.

```sql
create table ingestion_event_registry (
    tenant_id        bigint not null,
    event_id         uuid not null,

    source_name      text not null,
    first_seen_at    timestamptz not null default clock_timestamp(),
    first_batch_id   uuid,
    first_event_time timestamptz,

    duplicate_count  bigint not null default 0,
    last_seen_at     timestamptz,

    constraint ingestion_event_registry_pk
        primary key (tenant_id, event_id)
);
```

### Register event

```sql
insert into ingestion_event_registry (
    tenant_id,
    event_id,
    source_name,
    first_batch_id,
    first_event_time
)
values (
    #{tenantId},
    #{eventId},
    #{sourceName},
    #{batchId},
    #{eventTime}
)
on conflict (tenant_id, event_id)
do update set
    duplicate_count = ingestion_event_registry.duplicate_count + 1,
    last_seen_at = clock_timestamp()
returning
    (xmax = 0) as inserted;
```

### Catatan penting soal `xmax`

Pattern `(xmax = 0)` sering dipakai untuk membedakan insert vs update, tetapi itu bergantung pada detail MVCC internal. Untuk sistem enterprise yang defensible, lebih baik gunakan CTE yang eksplisit.

---

## 8. Registry Pattern yang Lebih Eksplisit

```sql
with inserted as (
    insert into ingestion_event_registry (
        tenant_id,
        event_id,
        source_name,
        first_batch_id,
        first_event_time
    )
    values (
        #{tenantId},
        #{eventId},
        #{sourceName},
        #{batchId},
        #{eventTime}
    )
    on conflict (tenant_id, event_id)
    do nothing
    returning tenant_id, event_id
)
select
    exists(select 1 from inserted) as accepted;
```

Jika `accepted = true`, lanjut insert raw event.  
Jika `accepted = false`, event adalah duplicate/replay.

### Flow

```text
receive message/request
  │
  ▼
insert registry ON CONFLICT DO NOTHING
  │
  ├─ inserted = true
  │    └─ insert raw metric_sample
  │
  └─ inserted = false
       └─ count duplicate / ignore / return idempotent success
```

---

## 9. Transaction Boundary Registry + Raw Insert

Agar aman, registry insert dan raw insert harus satu transaksi.

```sql
begin;

-- 1. register event
with inserted as (
    insert into ingestion_event_registry (
        tenant_id,
        event_id,
        source_name,
        first_batch_id,
        first_event_time
    )
    values (
        :tenantId,
        :eventId,
        :sourceName,
        :batchId,
        :eventTime
    )
    on conflict (tenant_id, event_id)
    do nothing
    returning tenant_id, event_id
)

-- 2. insert raw only if registry accepted
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    value_quality,
    time_quality,
    tags
)
select
    :tenantId,
    :sourceId,
    :eventId,
    :metricName,
    :eventTime,
    :valueNumeric,
    :valueQuality,
    :timeQuality,
    :tags::jsonb
where exists (
    select 1 from inserted
);

commit;
```

### Kenapa satu transaksi?

| Jika tidak satu transaksi | Risiko |
|---|---|
| registry sukses, raw insert gagal | event dianggap sudah diterima padahal data tidak ada |
| raw insert sukses, registry gagal | replay bisa masuk ulang |
| service crash di tengah | state tidak konsisten |
| broker ack terlalu cepat | data hilang |

---

## 10. MyBatis Mapper: Register Event

```java
public interface IngestionRegistryMapper {

    boolean tryRegisterEvent(
        @Param("tenantId") long tenantId,
        @Param("eventId") UUID eventId,
        @Param("sourceName") String sourceName,
        @Param("batchId") UUID batchId,
        @Param("eventTime") Instant eventTime
    );

    int markDuplicateEvent(
        @Param("tenantId") long tenantId,
        @Param("eventId") UUID eventId
    );
}
```

XML:

```xml
<select id="tryRegisterEvent" resultType="boolean">
    with inserted as (
        insert into ingestion_event_registry (
            tenant_id,
            event_id,
            source_name,
            first_batch_id,
            first_event_time
        )
        values (
            #{tenantId},
            #{eventId},
            #{sourceName},
            #{batchId},
            #{eventTime}
        )
        on conflict (tenant_id, event_id)
        do nothing
        returning tenant_id, event_id
    )
    select exists(select 1 from inserted)
</select>

<update id="markDuplicateEvent">
    update ingestion_event_registry
    set
        duplicate_count = duplicate_count + 1,
        last_seen_at = clock_timestamp()
    where tenant_id = #{tenantId}
      and event_id = #{eventId}
</update>
```

---

## 11. MyBatis Service Flow

```java
public MetricIngestOutcome ingestOne(MetricSampleRequest request) {
    Instant receivedAt = Instant.now();

    MetricSampleRow row = mapper.toRow(request, receivedAt);

    return transactionTemplate.execute(() -> {
        boolean accepted = registryMapper.tryRegisterEvent(
            row.tenantId(),
            row.eventId(),
            "metric-api",
            row.batchId(),
            row.eventTime()
        );

        if (!accepted) {
            registryMapper.markDuplicateEvent(row.tenantId(), row.eventId());
            return MetricIngestOutcome.duplicate(row.eventId());
        }

        metricSampleMapper.insertMetricSample(row);
        return MetricIngestOutcome.accepted(row.eventId());
    });
}
```

### Important invariant

```text
Jika registry accepted = true, raw insert harus berhasil dalam transaksi yang sama.
Jika raw insert gagal karena partition miss/constraint, seluruh transaksi rollback.
```

---

## 12. Batch Registry Pattern

Untuk batch ingestion, jangan loop satu per satu kalau bisa di-set-based.

### Temporary accepted table

```sql
create temporary table accepted_ingestion_event (
    tenant_id bigint not null,
    event_id uuid not null,
    primary key (tenant_id, event_id)
) on commit drop;
```

### Insert registry dari staging

```sql
with inserted as (
    insert into ingestion_event_registry (
        tenant_id,
        event_id,
        source_name,
        first_batch_id,
        first_event_time
    )
    select distinct
        tenant_id,
        event_id,
        'metric-batch',
        batch_id,
        event_time
    from metric_sample_staging
    where batch_id = :batchId
      and event_id is not null
    on conflict (tenant_id, event_id)
    do nothing
    returning tenant_id, event_id
)
insert into accepted_ingestion_event (
    tenant_id,
    event_id
)
select
    tenant_id,
    event_id
from inserted;
```

### Insert raw only accepted

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    value_text,
    value_quality,
    time_quality,
    tags
)
select
    s.tenant_id,
    s.source_id,
    s.event_id,
    s.metric_name,
    s.event_time,
    s.value_numeric,
    s.value_text,
    coalesce(s.value_quality, 'GOOD'),
    coalesce(s.time_quality, 'NORMAL'),
    coalesce(s.tags, '{}'::jsonb)
from metric_sample_staging s
join accepted_ingestion_event a
  on a.tenant_id = s.tenant_id
 and a.event_id = s.event_id
where s.batch_id = :batchId;
```

---

## 13. Duplicate Audit Table

Kadang duplicate perlu diabaikan, tapi tetap dicatat.

```sql
create table ingestion_duplicate_event (
    tenant_id        bigint not null,
    event_id         uuid not null,
    duplicate_seen_at timestamptz not null default clock_timestamp(),

    source_name      text,
    batch_id         uuid,
    received_payload jsonb,

    reason           text not null default 'EVENT_ID_ALREADY_SEEN'
);
```

Insert duplicate audit:

```sql
insert into ingestion_duplicate_event (
    tenant_id,
    event_id,
    source_name,
    batch_id,
    received_payload
)
values (
    #{tenantId},
    #{eventId},
    #{sourceName},
    #{batchId},
    #{payload, typeHandler=com.example.JsonbTypeHandler}::jsonb
);
```

### Kapan duplicate audit perlu?

| Perlu | Tidak perlu |
|---|---|
| regulatory/event defensibility | metric high-volume trivial |
| source quality monitoring | duplicate sangat sering dan tidak penting |
| client integration debugging | storage budget ketat |
| SLA dengan upstream | duplicate cukup jadi counter metric |

---

## 14. Duplicate Detection Without Event ID

Kadang upstream tidak menyediakan event id. Jangan langsung menyerah.

### Opsi 1 - Generate deterministic event id

Java:

```java
public UUID deterministicEventId(
    long tenantId,
    long sourceId,
    String metricName,
    Instant eventTime
) {
    String key = tenantId + "|" + sourceId + "|" + metricName + "|" + eventTime;
    return UUID.nameUUIDFromBytes(key.getBytes(StandardCharsets.UTF_8));
}
```

### Opsi 2 - Hash payload

```java
public String payloadHash(String canonicalJson) {
    MessageDigest digest = MessageDigest.getInstance("SHA-256");
    byte[] hash = digest.digest(canonicalJson.getBytes(StandardCharsets.UTF_8));
    return HexFormat.of().formatHex(hash);
}
```

Table:

```sql
alter table ingestion_event_registry
add column payload_hash text;
```

Unique:

```sql
create unique index ingestion_event_payload_hash_uniq
on ingestion_event_registry (
    tenant_id,
    payload_hash
)
where payload_hash is not null;
```

### Risiko deterministic key

| Risiko | Mitigasi |
|---|---|
| canonicalization beda | normalize JSON/key ordering |
| timestamp precision beda | define timestamp rounding policy |
| hash collision | SHA-256 praktis aman, tetap simpan raw key |
| semantic correction dianggap duplicate | correction harus punya correction id/type |

---

## 15. Timestamp Rounding Policy

Semantic duplicate sering gagal terdeteksi karena timestamp precision.

Contoh:

```text
2026-07-15T10:00:00.000Z
2026-07-15T10:00:00.001Z
```

Bisa jadi sample yang sama, bisa jadi sample berbeda. Harus ada policy.

### Generated bucket column

```sql
alter table metric_sample
add column event_second timestamptz generated always as (
    date_trunc('second', event_time)
) stored;
```

Logical unique per second:

```sql
create unique index metric_sample_logical_second_uniq
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_second
);
```

### Hati-hati

Ini hanya benar kalau domain menyatakan **maksimal satu reading per second per source/metric**.

---

## 16. `DO UPDATE`: Kapan Boleh?

`ON CONFLICT DO UPDATE` mengganti atau memperbarui row saat conflict. PostgreSQL menjamin untuk `DO UPDATE` bahwa dalam kondisi concurrency, outcome-nya atomic insert atau update pada conflict row. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-insert.html?utm_source=chatgpt.com))

Contoh:

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    value_quality,
    time_quality,
    tags
)
values (
    #{tenantId},
    #{sourceId},
    #{eventId},
    #{metricName},
    #{eventTime},
    #{valueNumeric},
    #{valueQuality},
    #{timeQuality},
    #{tags, typeHandler=com.example.JsonbTypeHandler}::jsonb
)
on conflict (
    tenant_id,
    source_id,
    metric_name,
    event_time
)
do update set
    value_numeric = excluded.value_numeric,
    value_quality = excluded.value_quality,
    time_quality = excluded.time_quality,
    tags = metric_sample.tags || excluded.tags,
    ingest_time = clock_timestamp();
```

### Kapan boleh?

| Boleh jika | Contoh |
|---|---|
| table adalah current/latest state | current device reading |
| row memang mutable by design | aggregate cache |
| correction tidak perlu raw immutability | operational metric non-audit |
| update punya source version | only newer update wins |

### Jangan untuk

| Jangan jika | Kenapa |
|---|---|
| raw audit event | history berubah |
| regulatory timeline | defensibility lemah |
| event-sourced model | append-only invariant rusak |
| message replay biasa | replay bisa overwrite data benar |
| source tidak punya version | old retry bisa menimpa new data |

---

## 17. Safer `DO UPDATE` dengan Version Guard

Tambahkan source version:

```sql
alter table metric_sample
add column source_sequence bigint;
```

Upsert hanya jika incoming lebih baru:

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    source_sequence
)
values (
    #{tenantId},
    #{sourceId},
    #{eventId},
    #{metricName},
    #{eventTime},
    #{valueNumeric},
    #{sourceSequence}
)
on conflict (
    tenant_id,
    source_id,
    metric_name,
    event_time
)
do update set
    value_numeric = excluded.value_numeric,
    source_sequence = excluded.source_sequence,
    ingest_time = clock_timestamp()
where metric_sample.source_sequence is null
   or excluded.source_sequence > metric_sample.source_sequence;
```

### Invariant

```text
Update hanya boleh terjadi jika incoming version lebih baru.
```

Tanpa invariant ini, retry lama bisa overwrite data baru.

---

## 18. Correction Event Pattern

Untuk raw time-series yang audit-friendly, jangan update row lama. Tambahkan event koreksi.

Original:

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    value_quality
)
values (
    10,
    1001,
    '018f7d42-7b7c-7b1a-9e58-8b2ffbb7b111',
    'temperature_celsius',
    '2026-07-15 10:00:00+07',
    31.5,
    'GOOD'
);
```

Correction:

```sql
insert into metric_sample (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    value_numeric,
    value_quality,
    correction_of_event_id,
    correction_reason
)
values (
    10,
    1001,
    '018f7d42-7b7c-7b1a-9e58-8b2ffbb7b222',
    'temperature_celsius',
    '2026-07-15 10:00:00+07',
    30.9,
    'CORRECTED',
    '018f7d42-7b7c-7b1a-9e58-8b2ffbb7b111',
    'SOURCE_RECALCULATION'
);
```

### Query effective value

```sql
with ranked as (
    select
        tenant_id,
        source_id,
        metric_name,
        event_time,
        value_numeric,
        value_quality,
        event_id,
        correction_of_event_id,
        row_number() over (
            partition by tenant_id, source_id, metric_name, event_time
            order by
                case when correction_of_event_id is not null then 1 else 0 end desc,
                ingest_time desc
        ) as rn
    from metric_sample
    where tenant_id = 10
      and source_id = 1001
      and metric_name = 'temperature_celsius'
      and event_time >= timestamptz '2026-07-15 00:00:00+07'
      and event_time <  timestamptz '2026-07-16 00:00:00+07'
)
select *
from ranked
where rn = 1
order by event_time;
```

---

## 19. Better Correction Model: Separate Correction Table

Untuk audit yang lebih jelas, pisahkan correction.

```sql
create table metric_sample_correction (
    tenant_id          bigint not null,
    correction_id      uuid not null,
    original_event_id  uuid not null,

    corrected_event_time timestamptz not null,
    corrected_value_numeric numeric,
    corrected_value_text    text,

    correction_reason text not null,
    corrected_by      text,
    corrected_at      timestamptz not null default clock_timestamp(),

    correction_payload jsonb not null default '{}'::jsonb,

    constraint metric_sample_correction_pk
        primary key (tenant_id, correction_id)
);
```

Query effective value:

```sql
select
    m.tenant_id,
    m.source_id,
    m.metric_name,
    m.event_time,
    coalesce(c.corrected_value_numeric, m.value_numeric) as effective_value_numeric,
    case
        when c.correction_id is not null then 'CORRECTED'
        else m.value_quality
    end as effective_quality
from metric_sample m
left join lateral (
    select *
    from metric_sample_correction c
    where c.tenant_id = m.tenant_id
      and c.original_event_id = m.event_id
    order by c.corrected_at desc
    limit 1
) c on true
where m.tenant_id = 10
  and m.source_id = 1001
  and m.metric_name = 'temperature_celsius'
  and m.event_time >= :from
  and m.event_time <  :to;
```

### Trade-off

| Inline correction event | Separate correction table |
|---|---|
| append-only sederhana | audit koreksi lebih eksplisit |
| query effective agak kompleks | join lebih jelas |
| raw table menampung semua | correction lifecycle terpisah |
| bagus untuk event-sourcing | bagus untuk regulated correction workflow |

---

## 20. Exactly-Once Illusion

Dalam distributed system, “exactly once” end-to-end sering merupakan ilusi. Yang realistis adalah:

```text
at-least-once delivery
+ idempotent consumer
+ transactional write
+ dedup key
+ observable duplicates
= effectively-once result
```

Untuk ingestion:

| Layer | Prinsip |
|---|---|
| HTTP client | retry boleh, event id harus sama |
| broker | ack setelah DB commit |
| service | idempotency key wajib |
| database | unique constraint / registry |
| raw table | append-only atau guarded update |
| monitoring | duplicate count terlihat |
| correction | event eksplisit, bukan overwrite diam-diam |

---

## 21. Broker Consumer Idempotency

Pseudo-flow:

```java
while (running) {
    List<Message> messages = consumer.poll();

    try {
        transactionTemplate.execute(() -> {
            List<MetricSampleRow> rows = messages.stream()
                .map(this::toRow)
                .toList();

            ingestionService.ingestBatchIdempotently(rows);
            return null;
        });

        consumer.ack(messages);
    } catch (Exception ex) {
        consumer.nack(messages);
    }
}
```

### Invariant

```text
Broker ack/offset commit hanya setelah DB transaction commit.
```

Kalau ack dulu lalu DB gagal, data hilang.  
Kalau DB commit lalu ack gagal, message akan replay, dan idempotency harus menahan duplicate.

---

## 22. HTTP API Idempotency

Untuk HTTP ingestion, client harus mengirim `eventId` atau `Idempotency-Key`.

Request:

```http
POST /v1/metric-samples
Idempotency-Key: 018f7d42-7b7c-7b1a-9e58-8b2ffbb7b111
Content-Type: application/json
```

Body:

```json
{
  "tenantId": 10,
  "sourceId": 1001,
  "eventId": "018f7d42-7b7c-7b1a-9e58-8b2ffbb7b111",
  "metricName": "temperature_celsius",
  "eventTime": "2026-07-15T10:00:00+07:00",
  "valueNumeric": 31.5
}
```

Jersey:

```java
@POST
@Path("/v1/metric-samples")
public Response ingest(
    @HeaderParam("Idempotency-Key") String idempotencyKey,
    MetricSampleRequest request
) {
    UUID eventId = request.eventId();

    if (eventId == null && idempotencyKey != null) {
        eventId = UUID.fromString(idempotencyKey);
    }

    if (eventId == null) {
        throw new BadRequestException("eventId or Idempotency-Key is required");
    }

    MetricIngestOutcome outcome = service.ingest(request.withEventId(eventId));

    return switch (outcome.status()) {
        case ACCEPTED -> Response.accepted(outcome).build();
        case DUPLICATE -> Response.ok(outcome).build();
        case REJECTED -> Response.status(422).entity(outcome).build();
    };
}
```

### Response duplicate sebaiknya apa?

| Response | Cocok |
|---|---|
| `200 OK` duplicate | idempotent success |
| `202 Accepted` accepted new | async ingestion |
| `409 Conflict` | jika payload beda untuk idempotency key sama |
| `422 Unprocessable Entity` | data invalid |

---

## 23. Payload Mismatch untuk Idempotency Key Sama

Kasus berbahaya:

```text
event_id sama
payload berbeda
```

Ini bisa terjadi karena bug client atau misuse idempotency key.

Tambahkan payload hash di registry:

```sql
alter table ingestion_event_registry
add column payload_hash text;
```

Register:

```sql
with existing as (
    select payload_hash
    from ingestion_event_registry
    where tenant_id = :tenantId
      and event_id = :eventId
),
inserted as (
    insert into ingestion_event_registry (
        tenant_id,
        event_id,
        source_name,
        first_batch_id,
        first_event_time,
        payload_hash
    )
    select
        :tenantId,
        :eventId,
        :sourceName,
        :batchId,
        :eventTime,
        :payloadHash
    where not exists (select 1 from existing)
    returning payload_hash
)
select
    case
        when exists (select 1 from inserted)
            then 'ACCEPTED'
        when exists (
            select 1
            from existing
            where payload_hash = :payloadHash
        )
            then 'DUPLICATE_SAME_PAYLOAD'
        else 'DUPLICATE_PAYLOAD_MISMATCH'
    end as status;
```

### Policy

| Status | Action |
|---|---|
| `ACCEPTED` | insert raw |
| `DUPLICATE_SAME_PAYLOAD` | return idempotent success |
| `DUPLICATE_PAYLOAD_MISMATCH` | reject/409 + audit |

---

## 24. Registry Retention

Registry juga butuh lifecycle.

| Registry purpose | Retention |
|---|---|
| HTTP idempotency key | sesuai retry window, misalnya 7-30 hari |
| broker event id | selama replay window |
| batch import | selama audit kebutuhan |
| regulatory event | bisa panjang/permanent |
| raw metric non-critical | lebih pendek |

Jangan drop registry terlalu cepat. Jika registry lebih pendek dari retry/replay window, duplicate lama bisa masuk ulang.

### Partition registry by first_seen_at

```sql
create table ingestion_event_registry_partitioned (
    tenant_id        bigint not null,
    event_id         uuid not null,
    source_name      text not null,
    first_seen_at    timestamptz not null default clock_timestamp(),
    payload_hash     text,

    constraint ingestion_event_registry_partitioned_pk
        primary key (tenant_id, event_id, first_seen_at)
)
partition by range (first_seen_at);
```

Catatan: primary key harus mencakup partition key `first_seen_at` bila registry ikut dipartisi by `first_seen_at`. Untuk global `(tenant_id, event_id)`, gunakan unpartitioned registry atau desain lain.

---

## 25. Duplicate Metrics

Buat metrik operasional:

```sql
create view ingestion_duplicate_summary_1h as
select
    source_name,
    count(*) as duplicate_count,
    min(duplicate_seen_at) as first_duplicate_seen_at,
    max(duplicate_seen_at) as last_duplicate_seen_at
from ingestion_duplicate_event
where duplicate_seen_at >= clock_timestamp() - interval '1 hour'
group by source_name;
```

Query duplicate by tenant/source:

```sql
select
    r.tenant_id,
    r.source_name,
    count(*) filter (where r.duplicate_count > 0) as events_with_duplicates,
    sum(r.duplicate_count) as total_duplicate_attempts
from ingestion_event_registry r
where r.first_seen_at >= clock_timestamp() - interval '24 hours'
group by r.tenant_id, r.source_name
order by total_duplicate_attempts desc;
```

---

## 26. Runbook: Duplicate Spike

### Symptoms

```text
duplicate_count naik tajam
HTTP retry naik
broker redelivery naik
ON CONFLICT DO NOTHING insert count turun
```

### Investigasi

| Check | Pertanyaan |
|---|---|
| API timeout | client retry karena response lambat? |
| DB latency | commit lambat membuat client retry? |
| broker ack | ack setelah commit atau sebelum? |
| consumer restart | ada deployment/incident? |
| event id generation | event id deterministic atau random per retry? |
| partition miss | insert gagal lalu message replay? |
| payload mismatch | idempotency key digunakan ulang untuk payload beda? |

### Mitigasi

```text
1. Pastikan event_id/idempotency-key stabil antar retry.
2. Return idempotent success untuk duplicate payload sama.
3. Reject payload mismatch dengan 409.
4. Ack broker hanya setelah DB commit.
5. Tambahkan exponential backoff client/consumer.
6. Perbaiki bottleneck DB/API yang menyebabkan timeout.
```

---

## 27. Runbook: Semantic Duplicate

### Symptoms

```text
event_id beda
source_id sama
metric_name sama
event_time sama
value sama/berbeda
```

### Query detection

```sql
select
    tenant_id,
    source_id,
    metric_name,
    event_time,
    count(*) as row_count,
    count(distinct event_id) as event_id_count,
    min(value_numeric) as min_value,
    max(value_numeric) as max_value
from metric_sample
where event_time >= clock_timestamp() - interval '24 hours'
group by
    tenant_id,
    source_id,
    metric_name,
    event_time
having count(*) > 1
order by row_count desc
limit 100;
```

### Fix options

| Option | Cocok |
|---|---|
| add logical unique key | jika duplicate tidak sah |
| deterministic event id | jika upstream tidak punya id |
| timestamp rounding | jika precision mismatch |
| correction event | jika value baru sah sebagai correction |
| source contract fix | jika root cause di upstream |

---

## 28. Runbook: Payload Mismatch

### Symptoms

```text
event_id sama
payload_hash berbeda
```

### Action

```text
1. Jangan overwrite raw data otomatis.
2. Catat mismatch event.
3. Return 409 untuk HTTP client.
4. Untuk broker, route ke dead-letter/poison topic jika berulang.
5. Investigasi source event id generation.
6. Jika correction sah, minta correction event eksplisit.
```

Mismatch table:

```sql
create table ingestion_payload_mismatch (
    tenant_id       bigint not null,
    event_id        uuid not null,
    first_payload_hash text,
    new_payload_hash   text,
    source_name     text,
    batch_id        uuid,
    received_payload jsonb,
    detected_at     timestamptz not null default clock_timestamp()
);
```

---

## 29. Production Design Decision Matrix

| Need | Recommended pattern |
|---|---|
| simple raw immutable metric | `ON CONFLICT DO NOTHING` |
| partitioned table + global event id dedup | event registry |
| dedup per source/metric/time | logical unique key |
| upstream no event id | deterministic event id / payload hash |
| HTTP retry safety | Idempotency-Key + registry |
| broker replay safety | registry + ack after DB commit |
| correction allowed | correction event/table |
| mutable latest state | guarded `DO UPDATE` |
| regulated audit | append-only, no silent update |
| high-volume duplicate audit | counters, not full payload forever |
| payload mismatch | reject/409 + mismatch audit |
| late backfill replay | staging + registry + merge |

---

## 30. Anti-Patterns

| Anti-pattern | Dampak |
|---|---|
| Generate `event_id` baru pada retry | idempotency gagal |
| Mengandalkan `bigserial id` saja | duplicate semantic tetap masuk |
| `ON CONFLICT DO UPDATE` untuk raw audit event | history berubah diam-diam |
| Ack broker sebelum DB commit | data bisa hilang |
| Tidak menyimpan payload hash | mismatch tidak terdeteksi |
| Registry retention terlalu pendek | duplicate lama bisa masuk ulang |
| Logical unique tanpa pahami domain | event sah bisa ditolak |
| Timestamp rounding sembarangan | data valid bisa dianggap duplicate |
| Duplicate dianggap error 500 | client makin retry |
| Tidak expose duplicate metrics | source problem tidak terlihat |
| Correction dilakukan dengan update row lama | auditability lemah |
| Idempotency table tidak satu transaksi dengan raw insert | state bisa inkonsisten |

---

## 31. Recommended Baseline untuk Java/Jersey/MyBatis

```text
Online HTTP ingestion:
  - require eventId or Idempotency-Key
  - compute payloadHash
  - registry check in same transaction
  - insert raw only if accepted
  - duplicate same payload => 200 OK / idempotent success
  - duplicate different payload => 409 Conflict

Broker ingestion:
  - event id from message key/header/body
  - DB transaction includes registry + raw insert
  - ack/commit offset only after DB commit
  - duplicate same payload ignored
  - payload mismatch to DLQ/reject table

Backfill:
  - COPY to staging
  - validate
  - register distinct events
  - insert accepted rows
  - summarize duplicate/reject count
  - refresh affected rollups
```

---

# Seri 7/16 Selesai

**Seri 7 selesai.**  
Materi ini menutup idempotency dan deduplication untuk PostgreSQL time-series: `ON CONFLICT`, unique key, batasan partitioned table, event registry, batch dedup, deterministic event id, payload hash, correction event, broker/HTTP retry safety, dan exactly-once illusion.

## Rekomendasi materi selanjutnya

Lanjut ke **Seri 8/16 - Query Pattern: range query, latest value, last-known-value, entity timeline, pagination by time, dan API query guard untuk raw time-series**.

---

**Sources:**

- [Documentation: 18: INSERT](https://www.postgresql.org/docs/current/sql-insert.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:41:02 PM

Saya lanjut ke **Seri 8/16**. Fokusnya query pattern raw time-series yang paling sering dipakai aplikasi: range query, latest value, last-known-value, timeline, pagination, dan guard API supaya query tidak berubah jadi full-scan mahal.

# PostgreSQL Time-Series Database - Seri 8/16  
## Query Pattern: Range Query, Latest Value, Last-Known-Value, Entity Timeline, Pagination by Time, dan API Query Guard

**Status:** Seri 8 dari 16.  
Fokus seri ini: pola query raw time-series yang paling sering dipakai di aplikasi production, terutama untuk **Jersey API + MyBatis + PostgreSQL partitioned table**.

---

## 1. Mental Model Query Time-Series

Query time-series yang sehat hampir selalu punya bentuk dasar:

```sql
where tenant_id = :tenantId
  and event_time >= :from
  and event_time <  :to
```

Untuk table partitioned by `event_time`, predicate waktu seperti ini membantu PostgreSQL melakukan partition pruning, yaitu menghindari membaca partition yang tidak relevan. PostgreSQL documentation menjelaskan bahwa partition pruning dapat mengurangi jumlah partition yang perlu discan saat query punya predicate yang cocok dengan partition key. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html?utm_source=chatgpt.com))

Pola query utama:

```text
Time-Series Query Patterns
│
├─ 1. Range query
├─ 2. Latest value
├─ 3. Latest value per entity
├─ 4. Last-known-value as-of time
├─ 5. Entity timeline
├─ 6. Cursor pagination by time
├─ 7. Bucket aggregation
├─ 8. Gap filling
├─ 9. Quality-aware query
└─ 10. API query guard
```

---

## 2. Baseline Table

```sql
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_id        uuid not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    value_numeric   numeric,
    value_text      text,
    value_quality   text not null default 'GOOD',
    time_quality    text not null default 'NORMAL',

    tags            jsonb not null default '{}'::jsonb,

    constraint metric_sample_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            event_time,
            event_id
        )
)
partition by range (event_time);
```

Baseline index:

```sql
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
)
include (
    value_numeric,
    value_quality,
    time_quality
);

create index metric_sample_event_time_brin_idx
on metric_sample using brin (
    event_time
);

create index metric_sample_ingest_time_idx
on metric_sample (
    ingest_time desc
);
```

---

# 3. Pattern 1 - Basic Range Query

Ini pola paling dasar untuk chart, timeline, dan API read.

```sql
select
    event_time,
    value_numeric,
    value_quality,
    time_quality
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
order by event_time;
```

Gunakan **half-open interval**:

```sql
event_time >= :from
and event_time <  :to
```

Jangan:

```sql
event_time between :from and :to
```

Alasannya: `between` bersifat inclusive di dua sisi. Untuk window berurutan seperti `[10:00, 11:00]` dan `[11:00, 12:00]`, boundary `11:00` bisa terhitung dua kali. Half-open interval menghindari overlap.

---

## 4. MyBatis Range Query

Mapper:

```java
public interface MetricSampleMapper {

    List<MetricPoint> findSeries(
        @Param("tenantId") long tenantId,
        @Param("sourceId") long sourceId,
        @Param("metricName") String metricName,
        @Param("from") Instant from,
        @Param("to") Instant to,
        @Param("limit") int limit
    );
}
```

XML:

```xml
<select id="findSeries" resultType="com.example.MetricPoint">
    select
        event_time as eventTime,
        value_numeric as valueNumeric,
        value_quality as valueQuality,
        time_quality as timeQuality
    from metric_sample
    where tenant_id = #{tenantId}
      and source_id = #{sourceId}
      and metric_name = #{metricName}
      and event_time >= #{from}
      and event_time <  #{to}
    order by event_time
    limit #{limit}
</select>
```

Practical guard:

| Guard | Rekomendasi |
|---|---|
| `from` wajib | Ya |
| `to` wajib | Ya |
| max range raw query | misalnya 1-31 hari |
| max row limit | misalnya 1.000-10.000 |
| order deterministic | pakai `event_time, event_id` jika perlu |
| timezone input | ISO-8601 dengan offset |

---

# 5. Pattern 2 - Latest Value untuk Satu Entity

Query:

```sql
select
    event_time,
    value_numeric,
    value_quality,
    time_quality
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
order by event_time desc
limit 1;
```

Index pendukung:

```sql
create index metric_sample_latest_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
)
include (
    value_numeric,
    value_quality,
    time_quality
);
```

### Catatan penting

Query latest tanpa batas waktu bisa tetap mahal jika entity punya data sangat panjang dan partition sangat banyak. Untuk production, lebih aman punya batas waktu realistis:

```sql
select
    event_time,
    value_numeric,
    value_quality,
    time_quality
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= clock_timestamp() - interval '30 days'
order by event_time desc
limit 1;
```

Kalau latest value sangat sering dibaca, pertimbangkan **current-state table** terpisah.

---

# 6. Pattern 3 - Current-State Table untuk Latest Value

Raw table bagus untuk history. Tapi latest value yang sangat sering dibaca sebaiknya diproyeksikan ke table kecil.

```sql
create table metric_current_value (
    tenant_id       bigint not null,
    source_id       bigint not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null,

    value_numeric   numeric,
    value_text      text,
    value_quality   text not null,
    time_quality    text not null,

    updated_at      timestamptz not null default clock_timestamp(),

    constraint metric_current_value_pk
        primary key (
            tenant_id,
            source_id,
            metric_name
        )
);
```

Upsert current value:

```sql
insert into metric_current_value (
    tenant_id,
    source_id,
    metric_name,
    event_time,
    ingest_time,
    value_numeric,
    value_text,
    value_quality,
    time_quality
)
values (
    :tenantId,
    :sourceId,
    :metricName,
    :eventTime,
    :ingestTime,
    :valueNumeric,
    :valueText,
    :valueQuality,
    :timeQuality
)
on conflict (
    tenant_id,
    source_id,
    metric_name
)
do update set
    event_time = excluded.event_time,
    ingest_time = excluded.ingest_time,
    value_numeric = excluded.value_numeric,
    value_text = excluded.value_text,
    value_quality = excluded.value_quality,
    time_quality = excluded.time_quality,
    updated_at = clock_timestamp()
where excluded.event_time >= metric_current_value.event_time;
```

### Kenapa pakai `where excluded.event_time >= current.event_time`?

Agar late-arriving old data tidak menimpa current value yang lebih baru.

| Raw table | Current table |
|---|---|
| history lengkap | latest state cepat |
| append-heavy | mutable/upsert |
| partitioned by time | primary key by entity |
| cocok untuk analytics | cocok untuk dashboard summary |
| jangan sering update | memang dirancang update |

---

# 7. Pattern 4 - Latest Value per Source

Misalnya ingin latest temperature untuk semua source di tenant tertentu.

```sql
select distinct on (source_id)
    source_id,
    event_time,
    value_numeric,
    value_quality
from metric_sample
where tenant_id = :tenantId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
order by source_id, event_time desc;
```

`DISTINCT ON` adalah fitur PostgreSQL untuk mengambil row pertama dari setiap group berdasarkan urutan `ORDER BY`. Untuk hasil yang predictable, expression `DISTINCT ON` harus cocok dengan expression paling kiri di `ORDER BY`. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-explain.html?utm_source=chatgpt.com))

Index pendukung:

```sql
create index metric_sample_latest_per_source_idx
on metric_sample (
    tenant_id,
    metric_name,
    source_id,
    event_time desc
)
include (
    value_numeric,
    value_quality
);
```

### Kapan pakai?

| Cocok | Tidak cocok |
|---|---|
| latest per source dalam window terbatas | latest global multi-tahun |
| jumlah source manageable | jutaan source tanpa precompute |
| dashboard fleet/device | heavy real-time monitoring skala besar |
| query ad-hoc | endpoint sangat sering dipanggil |

Untuk endpoint yang sangat sering, gunakan `metric_current_value`.

---

# 8. Pattern 5 - Last-Known-Value As-Of Time

Pertanyaan:

```text
Nilai terakhir sebelum atau pada waktu X berapa?
```

Query satu source:

```sql
select
    event_time,
    value_numeric,
    value_quality
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time <= :asOfTime
order by event_time desc
limit 1;
```

Agar tidak scan terlalu jauh ke masa lalu, tambahkan lookback window:

```sql
select
    event_time,
    value_numeric,
    value_quality
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time <= :asOfTime
  and event_time >= :asOfTime - interval '7 days'
order by event_time desc
limit 1;
```

### Production rule

| Use case | Lookback |
|---|---|
| sensor per detik | menit/jam |
| business metric harian | 30-90 hari |
| case state | tidak boleh arbitrary; pakai state history |
| device heartbeat | berdasarkan expected heartbeat interval |

---

# 9. Pattern 6 - Last-Known-Value per Source As-Of Time

Untuk banyak source:

```sql
select distinct on (source_id)
    source_id,
    event_time,
    value_numeric,
    value_quality
from metric_sample
where tenant_id = :tenantId
  and metric_name = :metricName
  and event_time <= :asOfTime
  and event_time >= :asOfTime - interval '7 days'
order by source_id, event_time desc;
```

Index:

```sql
create index metric_sample_lkv_per_source_idx
on metric_sample (
    tenant_id,
    metric_name,
    source_id,
    event_time desc
)
include (
    value_numeric,
    value_quality
);
```

Jika query ini sangat sering, jangan hitung dari raw table setiap kali. Gunakan projection/current table atau rollup/state table.

---

# 10. Pattern 7 - Entity Timeline

Untuk regulatory/case/workflow event, timeline harus deterministic.

```sql
select
    event_time,
    event_id,
    metric_name,
    value_numeric,
    value_text,
    value_quality,
    time_quality,
    tags
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and event_time >= :from
  and event_time <  :to
order by event_time, event_id;
```

Kenapa `event_id` ikut `ORDER BY`? Karena dua event bisa punya `event_time` sama. Timeline yang hanya `order by event_time` bisa tidak deterministic.

Index:

```sql
create index metric_sample_timeline_idx
on metric_sample (
    tenant_id,
    source_id,
    event_time,
    event_id
);
```

Untuk domain case management:

```sql
select
    occurred_at,
    event_id,
    event_type,
    previous_state,
    new_state,
    actor_id,
    payload
from enforcement_case_event
where tenant_id = :tenantId
  and case_id = :caseId
  and occurred_at >= :from
  and occurred_at <  :to
order by occurred_at, event_id;
```

---

# 11. Pattern 8 - Cursor Pagination by Time

Offset pagination buruk untuk time-series besar.

Anti-pattern:

```sql
select *
from metric_sample
where tenant_id = :tenantId
order by event_time desc
offset 100000
limit 100;
```

Semakin besar offset, semakin mahal karena database tetap harus melewati banyak row.

Gunakan keyset/cursor pagination:

```sql
select
    event_time,
    event_id,
    source_id,
    metric_name,
    value_numeric
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
  and (
      event_time < :cursorEventTime
      or (
          event_time = :cursorEventTime
          and event_id < :cursorEventId
      )
  )
order by event_time desc, event_id desc
limit :limit;
```

First page tanpa cursor:

```sql
select
    event_time,
    event_id,
    source_id,
    metric_name,
    value_numeric
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
order by event_time desc, event_id desc
limit :limit;
```

Index:

```sql
create index metric_sample_cursor_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc,
    event_id desc
);
```

---

## 12. Cursor Format untuk API

Jangan expose cursor sebagai raw SQL state yang mudah dimanipulasi tanpa validasi. Minimal encode:

```json
{
  "eventTime": "2026-07-15T10:00:00Z",
  "eventId": "018f7d42-7b7c-7b1a-9e58-8b2ffbb7b111"
}
```

Lalu Base64 URL-safe:

```java
public record MetricCursor(
    Instant eventTime,
    UUID eventId
) {}
```

Pseudo-code:

```java
public String encodeCursor(MetricCursor cursor) {
    String json = objectMapper.writeValueAsString(cursor);
    return Base64.getUrlEncoder()
        .withoutPadding()
        .encodeToString(json.getBytes(StandardCharsets.UTF_8));
}

public MetricCursor decodeCursor(String token) {
    byte[] bytes = Base64.getUrlDecoder().decode(token);
    return objectMapper.readValue(bytes, MetricCursor.class);
}
```

Untuk environment lebih ketat, sign cursor dengan HMAC agar user tidak bisa mengubah cursor sembarangan.

---

# 13. Pattern 9 - Quality-Aware Query

Raw data sering punya kualitas berbeda:

```text
GOOD
BAD
ESTIMATED
MISSING
CORRECTED
```

Query dashboard biasanya hanya mau data valid:

```sql
select
    event_time,
    value_numeric
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and value_quality = 'GOOD'
  and time_quality in ('NORMAL', 'LATE')
  and event_time >= :from
  and event_time <  :to
order by event_time;
```

Index opsional jika query ini sangat sering:

```sql
create index metric_sample_good_quality_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
)
include (
    value_numeric
)
where value_quality = 'GOOD';
```

Partial index seperti ini berguna jika subset `GOOD` jauh lebih kecil atau query dashboard selalu memfilter quality. Kalau hampir semua row `GOOD`, partial index manfaatnya kecil.

---

# 14. Pattern 10 - Bucket Aggregation

Untuk chart, jangan selalu kirim semua raw point. Gunakan bucket.

```sql
select
    date_bin(
        interval '15 minutes',
        event_time,
        timestamptz '2026-01-01 00:00:00+00'
    ) as bucket_start,
    avg(value_numeric) as avg_value,
    min(value_numeric) as min_value,
    max(value_numeric) as max_value,
    count(*) as sample_count
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
  and value_quality = 'GOOD'
group by bucket_start
order by bucket_start;
```

`date_bin(stride, source, origin)` membagi timestamp ke interval tertentu berdasarkan origin, cocok untuk bucket arbitrary seperti 5 menit atau 15 menit. PostgreSQL documentation juga menjelaskan bahwa `date_bin` tidak mendukung stride yang mengandung month atau unit lebih besar. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-datetime.html?utm_source=chatgpt.com))

Untuk bucket kalender standar, gunakan `date_trunc`:

```sql
select
    date_trunc('hour', event_time, 'Asia/Jakarta') as hour_bucket,
    avg(value_numeric) as avg_value
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
group by hour_bucket
order by hour_bucket;
```

---

# 15. Pattern 11 - Gap Filling dengan `generate_series`

Chart sering butuh bucket kosong tetap muncul.

```sql
with buckets as (
    select generate_series(
        :from::timestamptz,
        :to::timestamptz - interval '15 minutes',
        interval '15 minutes'
    ) as bucket_start
),
agg as (
    select
        date_bin(
            interval '15 minutes',
            event_time,
            :from::timestamptz
        ) as bucket_start,
        avg(value_numeric) as avg_value,
        count(*) as sample_count
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from
      and event_time <  :to
      and value_quality = 'GOOD'
    group by bucket_start
)
select
    b.bucket_start,
    a.avg_value,
    coalesce(a.sample_count, 0) as sample_count
from buckets b
left join agg a
  on a.bucket_start = b.bucket_start
order by b.bucket_start;
```

PostgreSQL `generate_series` adalah set-returning function yang dapat menghasilkan series timestamp/timestamptz dengan step interval, sehingga cocok untuk membuat bucket kosong sebelum di-left-join ke aggregate. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-datetime.html?utm_source=chatgpt.com))

### Penting

Missing data ≠ zero.

| Nilai | Arti |
|---|---|
| `null` | tidak ada sample |
| `0` | ada sample bernilai nol |
| `sample_count = 0` | bucket kosong |
| `sample_count > 0, avg_value null` | kemungkinan value null/invalid |

---

# 16. Pattern 12 - Moving Average / Rolling Window

Window function menghitung nilai terhadap sekumpulan row yang terkait dengan row saat ini tanpa menggabungkan semua row menjadi satu output group. PostgreSQL documentation menjelaskan window function dipakai dengan klausa `OVER`. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-window.html?utm_source=chatgpt.com))

Contoh moving average 10 sample terakhir:

```sql
select
    event_time,
    value_numeric,
    avg(value_numeric) over (
        order by event_time
        rows between 9 preceding and current row
    ) as moving_avg_10
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
  and value_quality = 'GOOD'
order by event_time;
```

Untuk per source:

```sql
select
    source_id,
    event_time,
    value_numeric,
    avg(value_numeric) over (
        partition by source_id
        order by event_time
        rows between 9 preceding and current row
    ) as moving_avg_10
from metric_sample
where tenant_id = :tenantId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
  and value_quality = 'GOOD'
order by source_id, event_time;
```

### Catatan

Window function bisa mahal untuk range besar. Untuk dashboard jangka panjang, precompute rollup.

---

# 17. Pattern 13 - Delta dan Rate of Change

Untuk counter metric:

```sql
with ordered as (
    select
        event_time,
        value_numeric,
        lag(value_numeric) over (
            order by event_time
        ) as prev_value,
        lag(event_time) over (
            order by event_time
        ) as prev_event_time
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from
      and event_time <  :to
      and value_quality = 'GOOD'
)
select
    event_time,
    value_numeric,
    value_numeric - prev_value as delta_value,
    extract(epoch from event_time - prev_event_time) as delta_seconds,
    case
        when prev_value is null then null
        when event_time = prev_event_time then null
        when value_numeric < prev_value then null -- counter reset
        else
            (value_numeric - prev_value)
            / nullif(extract(epoch from event_time - prev_event_time), 0)
    end as rate_per_second
from ordered
order by event_time;
```

`lag()` adalah window function PostgreSQL untuk mengambil nilai dari row sebelumnya dalam window partition. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-window.html?utm_source=chatgpt.com))

---

# 18. Pattern 14 - Entity Activity / Heartbeat Query

Untuk mencari source yang tidak mengirim data sejak waktu tertentu:

```sql
select
    source_id,
    max(event_time) as last_event_time
from metric_sample
where tenant_id = :tenantId
  and metric_name = :metricName
  and event_time >= clock_timestamp() - interval '7 days'
group by source_id
having max(event_time) < clock_timestamp() - interval '15 minutes'
order by last_event_time;
```

Untuk production skala besar, lebih baik pakai current-state table:

```sql
select
    source_id,
    event_time as last_event_time
from metric_current_value
where tenant_id = :tenantId
  and metric_name = :metricName
  and event_time < clock_timestamp() - interval '15 minutes'
order by event_time;
```

Ini jauh lebih murah karena tidak scan raw data.

---

# 19. Pattern 15 - Query by Ingest Time

Untuk observability ingestion:

```sql
select
    ingest_time,
    event_time,
    ingest_time - event_time as ingest_lag,
    tenant_id,
    source_id,
    metric_name,
    time_quality
from metric_sample
where ingest_time >= clock_timestamp() - interval '1 hour'
order by ingest_time desc
limit 1000;
```

Index:

```sql
create index metric_sample_ingest_time_desc_idx
on metric_sample (
    ingest_time desc
)
include (
    event_time,
    tenant_id,
    source_id,
    metric_name,
    time_quality
);
```

Catatan: jika table dipartisi by `event_time`, query berbasis `ingest_time` tidak selalu mendapat manfaat partition pruning. Index `ingest_time` dipakai untuk observability, bukan query domain utama.

---

# 20. Pattern 16 - Late-Arriving Data Query

```sql
select
    tenant_id,
    source_id,
    metric_name,
    event_time,
    ingest_time,
    ingest_time - event_time as lag
from metric_sample
where ingest_time >= clock_timestamp() - interval '1 hour'
  and ingest_time - event_time > interval '5 minutes'
order by ingest_time desc;
```

Summary:

```sql
select
    case
        when ingest_time - event_time <= interval '1 minute' then '<=1m'
        when ingest_time - event_time <= interval '5 minutes' then '<=5m'
        when ingest_time - event_time <= interval '1 hour' then '<=1h'
        else '>1h'
    end as lag_bucket,
    count(*) as row_count
from metric_sample
where ingest_time >= clock_timestamp() - interval '24 hours'
group by lag_bucket
order by lag_bucket;
```

---

# 21. Pattern 17 - Timeline With Corrections

Kalau correction event disimpan inline:

```sql
with ranked as (
    select
        tenant_id,
        source_id,
        metric_name,
        event_time,
        event_id,
        value_numeric,
        value_quality,
        correction_of_event_id,
        ingest_time,
        row_number() over (
            partition by tenant_id, source_id, metric_name, event_time
            order by
                case when correction_of_event_id is not null then 1 else 0 end desc,
                ingest_time desc,
                event_id desc
        ) as rn
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from
      and event_time <  :to
)
select
    event_time,
    event_id,
    value_numeric,
    value_quality
from ranked
where rn = 1
order by event_time;
```

Untuk range besar, query effective-correction dari raw table bisa mahal. Lebih baik siapkan projection table seperti:

```text
metric_effective_sample
metric_current_value
metric_rollup_15m
```

---

# 22. API Query Guard untuk Jersey

Endpoint raw query jangan terlalu bebas.

```java
@GET
@Path("/v1/metrics/{sourceId}/{metricName}/series")
@Produces(MediaType.APPLICATION_JSON)
public Response findSeries(
    @PathParam("sourceId") long sourceId,
    @PathParam("metricName") String metricName,
    @QueryParam("from") String fromText,
    @QueryParam("to") String toText,
    @QueryParam("limit") @DefaultValue("5000") int limit
) {
    if (fromText == null || toText == null) {
        throw new BadRequestException("from and to are required");
    }

    Instant from = OffsetDateTime.parse(fromText).toInstant();
    Instant to = OffsetDateTime.parse(toText).toInstant();

    if (!from.isBefore(to)) {
        throw new BadRequestException("from must be before to");
    }

    Duration range = Duration.between(from, to);

    if (range.compareTo(Duration.ofDays(31)) > 0) {
        throw new BadRequestException("raw query range too large; use rollup endpoint");
    }

    if (limit < 1 || limit > 10_000) {
        throw new BadRequestException("limit must be between 1 and 10000");
    }

    List<MetricPoint> points = metricService.findSeries(
        sourceId,
        metricName,
        from,
        to,
        limit
    );

    return Response.ok(points).build();
}
```

### Guard yang saya rekomendasikan

| Guard | Kenapa |
|---|---|
| `from` dan `to` wajib | mencegah full-table scan |
| max range raw | raw table bukan reporting jangka panjang |
| max limit | lindungi memory/API |
| ISO-8601 offset | hindari timezone ambiguity |
| tenant dari auth context | jangan dari query param bebas |
| reject unsupported sort | index harus predictable |
| cursor pagination | hindari `offset` besar |
| rollup endpoint untuk range besar | kontrol biaya query |

---

# 23. MyBatis Dynamic SQL: Gunakan Secara Ketat

Anti-pattern:

```xml
<select id="searchMetricSamples">
    select *
    from metric_sample
    <where>
        <if test="tenantId != null">
            tenant_id = #{tenantId}
        </if>
        <if test="sourceId != null">
            and source_id = #{sourceId}
        </if>
        <if test="from != null">
            and event_time >= #{from}
        </if>
        <if test="to != null">
            and event_time < #{to}
        </if>
    </where>
</select>
```

Masalah: query bisa berjalan tanpa `event_time` dan tanpa `tenant_id`.

Lebih baik pisahkan endpoint/method:

```xml
<select id="findMetricSeries" resultType="com.example.MetricPoint">
    select
        event_time as eventTime,
        value_numeric as valueNumeric,
        value_quality as valueQuality
    from metric_sample
    where tenant_id = #{tenantId}
      and source_id = #{sourceId}
      and metric_name = #{metricName}
      and event_time >= #{from}
      and event_time <  #{to}
    order by event_time
    limit #{limit}
</select>
```

Dynamic SQL boleh, tetapi jangan membuat predicate paling penting menjadi opsional.

---

# 24. Validate dengan `EXPLAIN`

PostgreSQL `EXPLAIN` menunjukkan execution plan yang dipilih planner. Dokumentasi PostgreSQL menekankan bahwa memilih plan yang cocok dengan struktur query dan data sangat penting untuk performa, dan `EXPLAIN` adalah alat untuk melihat plan tersebut. ([PostgreSQL](https://www.postgresql.org/docs/current/using-explain.html?utm_source=chatgpt.com))

Gunakan:

```sql
explain (analyze, buffers)
select
    event_time,
    value_numeric
from metric_sample
where tenant_id = 10
  and source_id = 1001
  and metric_name = 'temperature_celsius'
  and event_time >= timestamptz '2026-07-15 00:00:00+00'
  and event_time <  timestamptz '2026-07-16 00:00:00+00'
order by event_time;
```

Yang ingin dicek:

| Check | Target |
|---|---|
| partition pruning | hanya partition relevan |
| index usage | lookup index dipakai bila selektif |
| buffers | tidak membaca terlalu banyak page |
| sort | hindari sort besar jika index sudah ordered |
| rows estimate | tidak terlalu meleset |
| execution time | sesuai SLA |
| heap fetch | cek apakah covering index membantu |

---

# 25. Query Pattern Decision Matrix

| Kebutuhan | Query pattern | Storage/index pendukung |
|---|---|---|
| Chart raw 1 jam | range query | `(tenant, source, metric, event_time)` |
| Latest satu source | latest value | descending index atau current table |
| Latest semua source | `distinct on` | `(tenant, metric, source, event_time desc)` |
| Last-known-value | as-of query | descending time + lookback |
| Timeline case/entity | ordered timeline | `(tenant, entity, event_time, event_id)` |
| Infinite scroll | cursor pagination | `(tenant, source, metric, event_time desc, event_id desc)` |
| Dashboard long range | bucket aggregation | rollup table/materialized view |
| Missing data chart | gap filling | `generate_series` + aggregate |
| Anomaly/rate | window function | bounded range |
| Ingestion monitoring | ingest_time query | `(ingest_time desc)` |
| Heartbeat | current table | `metric_current_value` |
| Corrected effective view | correction pattern | projection table if frequent |

---

# 26. Anti-Patterns

| Anti-pattern | Dampak |
|---|---|
| Query raw tanpa `from/to` | full scan / many partition scan |
| `date(event_time) = :date` | partition pruning/index range bisa terganggu |
| Offset pagination besar | makin lambat saat page jauh |
| Latest query multi-tahun tanpa current table | scan banyak partition |
| `select *` untuk chart | payload besar dan heap access mahal |
| Semua filter optional di MyBatis | query liar |
| `between` untuk window berurutan | boundary double-count |
| Missing bucket diisi `0` otomatis | salah interpretasi data |
| Query raw untuk report tahunan | harus pakai rollup |
| Window function di range besar | CPU/memory berat |
| Correction dihitung dari raw setiap request | latency tidak stabil |
| Tenant dari query param tanpa auth guard | data isolation risk |
| Tidak cek `EXPLAIN` | index/partition mungkin tidak bekerja |

---

# 27. Recommended API Surface

```text
Raw query API:
  GET /v1/metrics/{sourceId}/{metricName}/series?from=&to=&limit=

Latest API:
  GET /v1/metrics/{sourceId}/{metricName}/latest

Current fleet API:
  GET /v1/metrics/{metricName}/current?sourceGroup=

Rollup API:
  GET /v1/metrics/{sourceId}/{metricName}/rollups?from=&to=&bucket=15m

Timeline API:
  GET /v1/entities/{entityId}/timeline?from=&to=&cursor=

Ingestion monitoring API:
  GET /internal/ingestion/lag?from=&to=
```

Pisahkan raw endpoint dari rollup endpoint. Jangan satu endpoint menerima semua kombinasi query karena query plan-nya akan sulit dijaga.

---

# 28. Production Checklist

| Checklist | Target |
|---|---|
| Semua raw query punya `tenant_id` | Ya |
| Semua raw query punya `event_time >= from` | Ya |
| Semua raw query punya `event_time < to` | Ya |
| Max raw range dibatasi | Ya |
| Max limit dibatasi | Ya |
| Offset pagination dihindari | Pakai cursor |
| Latest high-frequency pakai current table | Ya |
| Long-range chart pakai rollup | Ya |
| Gap filling bedakan null vs zero | Ya |
| Query correction-heavy diproyeksikan | Ya |
| `EXPLAIN ANALYZE` dicek | Ya |
| Index sesuai query owner | Ya |
| MyBatis dynamic predicate dikontrol | Ya |
| API timezone pakai ISO-8601 offset | Ya |
| Partition pruning tervalidasi | Ya |

---

# Seri 8/16 Selesai

**Seri 8 selesai.**  
Materi ini menutup query pattern untuk PostgreSQL time-series: range query, latest value, current-state projection, latest per source, last-known-value, entity timeline, cursor pagination, bucket aggregation, gap filling, moving average, rate-of-change, ingestion monitoring, correction query, MyBatis query design, Jersey API guard, dan validasi `EXPLAIN`.

## Rekomendasi materi selanjutnya

Lanjut ke **Seri 9/16 - Time Bucket Aggregation: `date_bin`, `date_trunc`, bucket boundary, timezone-aware aggregation, rollup table, dan dashboard query design**.

---

**Sources:**

- [Documentation: 18: 5.12. Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:47:28 PM

# PostgreSQL Time-Series Database - Seri 9/16  
## Time Bucket Aggregation: `date_bin`, `date_trunc`, Bucket Boundary, Timezone-Aware Aggregation, Rollup Table, dan Dashboard Query Design

**Status:** Seri 9 dari 16.  
Fokus seri ini: bagaimana mengubah raw time-series menjadi data agregat yang siap untuk **dashboard**, **reporting**, **alerting**, dan **API query yang stabil**.

---

## 1. Mental Model Time Bucket Aggregation

Raw time-series biasanya terlalu detail untuk dashboard.

Contoh raw:

```text
10:00:01 → 31.1
10:00:02 → 31.2
10:00:03 → 31.3
...
```

Dashboard biasanya butuh bucket:

```text
10:00 - 10:15 → avg 31.4, min 31.1, max 31.8, count 900
10:15 - 10:30 → avg 31.6, min 31.2, max 32.0, count 900
```

PostgreSQL menyediakan fungsi penting untuk ini:

| Function | Cocok untuk |
|---|---|
| `date_bin` | bucket arbitrary: 5 menit, 15 menit, 30 menit |
| `date_trunc` | bucket kalender: hour, day, week, month, quarter, year |
| `generate_series` | membuat bucket kosong untuk gap filling |
| aggregate function | `avg`, `min`, `max`, `count`, `sum`, `percentile_cont` |
| materialized view / rollup table | menyimpan hasil agregasi agar dashboard tidak scan raw data terus |

`date_bin(stride, source, origin)` membagi timestamp ke interval tertentu yang disejajarkan dengan origin; stride harus lebih besar dari nol dan tidak boleh mengandung unit bulan atau lebih besar. `date_trunc` men-truncate timestamp ke presisi seperti hour/day/month, dan untuk `timestamptz` bisa memakai argument timezone eksplisit. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-datetime.html?utm_source=chatgpt.com))

---

## 2. Diagram

```text
Raw Metric Table
metric_sample
│
├─ event_time
├─ tenant_id
├─ source_id
├─ metric_name
├─ value_numeric
└─ quality fields
      │
      ▼
Bucket Aggregation Query
│
├─ date_bin('15 minutes', event_time, origin)
├─ date_trunc('hour', event_time, timezone)
├─ avg/min/max/count/sum
└─ group by bucket
      │
      ▼
Rollup Storage
│
├─ metric_rollup_1m
├─ metric_rollup_15m
├─ metric_rollup_1h
└─ metric_rollup_1d
      │
      ▼
Dashboard / API
│
├─ short range → raw or 1m rollup
├─ medium range → 15m/1h rollup
└─ long range → daily rollup
```

---

## 3. Baseline Raw Table

```sql
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_id        uuid not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    value_numeric   numeric,
    value_quality   text not null default 'GOOD',
    time_quality    text not null default 'NORMAL',

    tags            jsonb not null default '{}'::jsonb,

    constraint metric_sample_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            event_time,
            event_id
        )
)
partition by range (event_time);
```

Index umum:

```sql
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time
)
include (
    value_numeric,
    value_quality,
    time_quality
);

create index metric_sample_event_time_brin_idx
on metric_sample using brin (
    event_time
);
```

---

# 4. Pattern 1 - `date_bin` untuk Bucket 5/15/30 Menit

Gunakan `date_bin` ketika bucket interval bukan unit kalender standar.

Contoh bucket 15 menit:

```sql
select
    date_bin(
        interval '15 minutes',
        event_time,
        timestamptz '2026-01-01 00:00:00+00'
    ) as bucket_start,
    avg(value_numeric) as avg_value,
    min(value_numeric) as min_value,
    max(value_numeric) as max_value,
    count(*) as sample_count
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
  and value_quality = 'GOOD'
group by bucket_start
order by bucket_start;
```

### Kenapa pakai `origin`?

`origin` menentukan alignment bucket.

```text
origin = 2026-01-01 00:00:00+00

bucket:
00:00 - 00:15
00:15 - 00:30
00:30 - 00:45
00:45 - 01:00
```

Kalau origin berbeda, boundary bucket juga bisa berbeda. Untuk production, tentukan origin secara konsisten dan jangan berubah antar endpoint.

---

## 5. Pattern 2 - `date_trunc` untuk Hour/Day/Month

Gunakan `date_trunc` untuk bucket kalender.

Hourly:

```sql
select
    date_trunc('hour', event_time) as hour_bucket,
    avg(value_numeric) as avg_value,
    count(*) as sample_count
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
group by hour_bucket
order by hour_bucket;
```

Daily berdasarkan timezone bisnis:

```sql
select
    date_trunc('day', event_time, 'Asia/Jakarta') as jakarta_day_bucket,
    avg(value_numeric) as avg_value,
    count(*) as sample_count
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
group by jakarta_day_bucket
order by jakarta_day_bucket;
```

Untuk `timestamp with time zone`, `date_trunc` dapat melakukan truncation berdasarkan timezone tertentu; misalnya truncation ke `day` menghasilkan midnight pada timezone tersebut. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-datetime.html?utm_source=chatgpt.com))

---

## 6. `date_bin` vs `date_trunc`

| Kebutuhan | Pakai |
|---|---|
| bucket 5 menit | `date_bin` |
| bucket 15 menit | `date_bin` |
| bucket 30 menit | `date_bin` |
| bucket per jam | `date_trunc('hour', ...)` atau `date_bin('1 hour', ...)` |
| bucket per hari kalender lokal | `date_trunc('day', event_time, 'Asia/Jakarta')` |
| bucket per bulan | `date_trunc('month', ...)` |
| bucket quarter/year | `date_trunc` |
| interval “setiap 7 menit” | `date_bin` |
| calendar-aware month | `date_trunc`, bukan `date_bin` |

**Rule praktis:**  
Untuk dashboard operational seperti 5m/15m/1h, gunakan `date_bin`. Untuk reporting kalender seperti harian/bulanan/kuartalan, gunakan `date_trunc`.

---

# 7. Bucket Boundary: Half-Open Interval

Selalu gunakan:

```sql
event_time >= :from
and event_time <  :to
```

Jangan:

```sql
event_time between :from and :to
```

Alasan:

```text
Window A: 10:00 <= t < 11:00
Window B: 11:00 <= t < 12:00

Event tepat 11:00 hanya masuk Window B.
```

Kalau memakai `between`, event tepat di boundary bisa terhitung dua kali antar window.

---

# 8. Gap Filling dengan `generate_series`

Masalah umum dashboard: bucket kosong tidak muncul.

Query agregasi biasa:

```sql
select
    date_bin(interval '15 minutes', event_time, :from::timestamptz) as bucket_start,
    avg(value_numeric) as avg_value
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
group by bucket_start
order by bucket_start;
```

Kalau tidak ada data di bucket tertentu, row bucket itu hilang.

Solusi:

```sql
with buckets as (
    select generate_series(
        :from::timestamptz,
        :to::timestamptz - interval '15 minutes',
        interval '15 minutes'
    ) as bucket_start
),
agg as (
    select
        date_bin(
            interval '15 minutes',
            event_time,
            :from::timestamptz
        ) as bucket_start,
        avg(value_numeric) as avg_value,
        min(value_numeric) as min_value,
        max(value_numeric) as max_value,
        count(*) as sample_count
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from
      and event_time <  :to
      and value_quality = 'GOOD'
    group by bucket_start
)
select
    b.bucket_start,
    a.avg_value,
    a.min_value,
    a.max_value,
    coalesce(a.sample_count, 0) as sample_count
from buckets b
left join agg a
  on a.bucket_start = b.bucket_start
order by b.bucket_start;
```

`generate_series` adalah set-returning function PostgreSQL yang bisa menghasilkan rangkaian timestamp/timestamptz dengan step interval, sehingga cocok untuk membuat daftar bucket sebelum di-left-join dengan hasil agregasi. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-srf.html?utm_source=chatgpt.com))

---

## 9. Jangan Samakan Missing Data dengan Zero

Ini penting untuk dashboard dan alerting.

| Kondisi | Representasi benar |
|---|---|
| Tidak ada sample | `avg_value = null`, `sample_count = 0` |
| Ada sample bernilai 0 | `avg_value = 0`, `sample_count > 0` |
| Data invalid | `value_quality != 'GOOD'` |
| Data telat masuk | `time_quality = 'LATE'` |
| Bucket kosong | row bucket ada, metric null |

Anti-pattern:

```sql
coalesce(avg(value_numeric), 0) as avg_value
```

Ini berbahaya karena membuat “tidak ada data” terlihat seperti “nilai aktual nol”.

Lebih aman:

```sql
avg(value_numeric) as avg_value,
count(*) as sample_count
```

Biarkan frontend memutuskan cara menggambar missing bucket.

---

# 10. Aggregation Metrics yang Umum

Untuk dashboard production, jangan hanya `avg`.

```sql
select
    date_bin(interval '15 minutes', event_time, :origin) as bucket_start,

    count(*) as sample_count,
    avg(value_numeric) as avg_value,
    min(value_numeric) as min_value,
    max(value_numeric) as max_value,
    sum(value_numeric) as sum_value,

    percentile_cont(0.50) within group (order by value_numeric) as p50_value,
    percentile_cont(0.95) within group (order by value_numeric) as p95_value,
    percentile_cont(0.99) within group (order by value_numeric) as p99_value
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
  and value_quality = 'GOOD'
group by bucket_start
order by bucket_start;
```

| Metric | Cocok untuk |
|---|---|
| `count` | sample completeness |
| `avg` | nilai rata-rata |
| `min/max` | range/spike |
| `sum` | total volume |
| `p50` | median |
| `p95/p99` | latency/spike behavior |
| `stddev` | volatility |
| `bool_or` / `bool_and` | status/health aggregate |

Ordered-set aggregates seperti `percentile_cont` tersedia di PostgreSQL untuk menghitung percentile berdasarkan urutan nilai. ([PostgreSQL](https://www.postgresql.org/docs/9.5/functions-aggregate.html?utm_source=chatgpt.com))

---

# 11. Counter Metric: Jangan Salah Pakai `avg`

Untuk counter yang selalu naik seperti request count, byte count, event count, biasanya yang dibutuhkan adalah delta/rate, bukan average raw value.

Contoh raw counter:

```text
10:00 counter = 1000
10:01 counter = 1600
10:02 counter = 1900
```

Yang menarik:

```text
10:00-10:01 delta = 600
10:01-10:02 delta = 300
```

Query delta:

```sql
with ordered as (
    select
        event_time,
        value_numeric,
        lag(value_numeric) over (
            order by event_time
        ) as prev_value,
        lag(event_time) over (
            order by event_time
        ) as prev_event_time
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from
      and event_time <  :to
      and value_quality = 'GOOD'
),
delta as (
    select
        event_time,
        case
            when prev_value is null then null
            when value_numeric < prev_value then null -- counter reset
            else value_numeric - prev_value
        end as delta_value
    from ordered
)
select
    date_bin(interval '15 minutes', event_time, :from::timestamptz) as bucket_start,
    sum(delta_value) as total_delta
from delta
where delta_value is not null
group by bucket_start
order by bucket_start;
```

Window function seperti `lag()` mengambil nilai dari row sebelumnya dalam window dan dipakai dengan klausa `OVER`, sehingga cocok untuk menghitung delta/rate. ([Crunchy Data](https://www.crunchydata.com/blog/window-functions-for-data-analysis-with-postgres?utm_source=chatgpt.com))

---

# 12. Gauge vs Counter vs Event Count

| Metric type | Contoh | Aggregation benar |
|---|---|---|
| Gauge | temperature, CPU usage, queue depth | avg/min/max/p95 |
| Counter | total request, total bytes | delta/sum/rate |
| Event count | number of transactions | count/sum per bucket |
| Status | up/down, active/inactive | last value, bool aggregate |
| Duration | latency, processing time | p50/p95/p99/avg |
| Monetary amount | transaction amount | sum/avg/count, hati-hati currency |

Sebelum membuat rollup, definisikan `aggregation_type` di metric registry.

```sql
create table metric_definition (
    metric_name       text primary key,
    unit              text not null,
    metric_kind       text not null,
    default_aggregate text not null,

    constraint metric_definition_kind_chk
        check (metric_kind in ('GAUGE', 'COUNTER', 'EVENT', 'STATUS', 'DURATION')),

    constraint metric_definition_aggregate_chk
        check (default_aggregate in ('AVG', 'SUM', 'COUNT', 'MIN_MAX', 'PERCENTILE', 'LAST'))
);
```

---

# 13. Rollup Table Design

Jangan terus-menerus menghitung dashboard dari raw table untuk range besar.

Buat rollup table.

```sql
create table metric_rollup_15m (
    tenant_id      bigint not null,
    source_id      bigint not null,
    metric_name    text not null,
    bucket_start   timestamptz not null,
    bucket_end     timestamptz not null,

    sample_count   bigint not null,
    good_count     bigint not null,
    late_count     bigint not null,

    avg_value      numeric,
    min_value      numeric,
    max_value      numeric,
    sum_value      numeric,
    p50_value      numeric,
    p95_value      numeric,
    p99_value      numeric,

    calculated_at  timestamptz not null default clock_timestamp(),

    constraint metric_rollup_15m_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            bucket_start
        ),

    constraint metric_rollup_15m_bucket_chk
        check (bucket_end > bucket_start)
);
```

Index:

```sql
create index metric_rollup_15m_lookup_idx
on metric_rollup_15m (
    tenant_id,
    source_id,
    metric_name,
    bucket_start
)
include (
    avg_value,
    min_value,
    max_value,
    sample_count,
    p95_value
);
```

---

## 14. Rollup Insert / Refresh per Window

Contoh hitung ulang rollup 15 menit untuk window tertentu:

```sql
insert into metric_rollup_15m (
    tenant_id,
    source_id,
    metric_name,
    bucket_start,
    bucket_end,

    sample_count,
    good_count,
    late_count,

    avg_value,
    min_value,
    max_value,
    sum_value,
    p50_value,
    p95_value,
    p99_value,
    calculated_at
)
select
    tenant_id,
    source_id,
    metric_name,

    date_bin(
        interval '15 minutes',
        event_time,
        timestamptz '2026-01-01 00:00:00+00'
    ) as bucket_start,

    date_bin(
        interval '15 minutes',
        event_time,
        timestamptz '2026-01-01 00:00:00+00'
    ) + interval '15 minutes' as bucket_end,

    count(*) as sample_count,
    count(*) filter (where value_quality = 'GOOD') as good_count,
    count(*) filter (where time_quality = 'LATE') as late_count,

    avg(value_numeric) filter (where value_quality = 'GOOD') as avg_value,
    min(value_numeric) filter (where value_quality = 'GOOD') as min_value,
    max(value_numeric) filter (where value_quality = 'GOOD') as max_value,
    sum(value_numeric) filter (where value_quality = 'GOOD') as sum_value,

    percentile_cont(0.50) within group (order by value_numeric)
        filter (where value_quality = 'GOOD') as p50_value,

    percentile_cont(0.95) within group (order by value_numeric)
        filter (where value_quality = 'GOOD') as p95_value,

    percentile_cont(0.99) within group (order by value_numeric)
        filter (where value_quality = 'GOOD') as p99_value,

    clock_timestamp() as calculated_at
from metric_sample
where event_time >= :from
  and event_time <  :to
group by
    tenant_id,
    source_id,
    metric_name,
    bucket_start
on conflict (
    tenant_id,
    source_id,
    metric_name,
    bucket_start
)
do update set
    bucket_end = excluded.bucket_end,
    sample_count = excluded.sample_count,
    good_count = excluded.good_count,
    late_count = excluded.late_count,
    avg_value = excluded.avg_value,
    min_value = excluded.min_value,
    max_value = excluded.max_value,
    sum_value = excluded.sum_value,
    p50_value = excluded.p50_value,
    p95_value = excluded.p95_value,
    p99_value = excluded.p99_value,
    calculated_at = clock_timestamp();
```

---

# 15. Late-Arriving Data dan Rollup Recalculation

Late data membuat rollup yang sudah dihitung bisa menjadi stale.

Contoh:

```text
10:00 bucket sudah dihitung jam 10:16
lalu jam 10:30 masuk event_time 10:05
bucket 10:00-10:15 harus dihitung ulang
```

Tambahkan dirty bucket table:

```sql
create table metric_rollup_dirty_bucket (
    tenant_id       bigint not null,
    source_id       bigint not null,
    metric_name     text not null,
    bucket_start    timestamptz not null,
    bucket_size     interval not null,

    reason          text not null,
    marked_at       timestamptz not null default clock_timestamp(),

    constraint metric_rollup_dirty_bucket_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            bucket_start,
            bucket_size
        )
);
```

Saat late data masuk:

```sql
insert into metric_rollup_dirty_bucket (
    tenant_id,
    source_id,
    metric_name,
    bucket_start,
    bucket_size,
    reason
)
values (
    :tenantId,
    :sourceId,
    :metricName,
    date_bin(interval '15 minutes', :eventTime::timestamptz, timestamptz '2026-01-01 00:00:00+00'),
    interval '15 minutes',
    'LATE_ARRIVING_DATA'
)
on conflict do update set
    reason = excluded.reason,
    marked_at = clock_timestamp();
```

Worker rollup kemudian menghitung ulang dirty bucket.

---

# 16. Rollup Job Function

```sql
create or replace function refresh_metric_rollup_15m_window(
    p_from timestamptz,
    p_to   timestamptz
)
returns void
language plpgsql
as $$
begin
    insert into metric_rollup_15m (
        tenant_id,
        source_id,
        metric_name,
        bucket_start,
        bucket_end,
        sample_count,
        good_count,
        late_count,
        avg_value,
        min_value,
        max_value,
        sum_value,
        calculated_at
    )
    select
        tenant_id,
        source_id,
        metric_name,
        date_bin(
            interval '15 minutes',
            event_time,
            timestamptz '2026-01-01 00:00:00+00'
        ) as bucket_start,
        date_bin(
            interval '15 minutes',
            event_time,
            timestamptz '2026-01-01 00:00:00+00'
        ) + interval '15 minutes' as bucket_end,

        count(*) as sample_count,
        count(*) filter (where value_quality = 'GOOD') as good_count,
        count(*) filter (where time_quality = 'LATE') as late_count,

        avg(value_numeric) filter (where value_quality = 'GOOD') as avg_value,
        min(value_numeric) filter (where value_quality = 'GOOD') as min_value,
        max(value_numeric) filter (where value_quality = 'GOOD') as max_value,
        sum(value_numeric) filter (where value_quality = 'GOOD') as sum_value,

        clock_timestamp()
    from metric_sample
    where event_time >= p_from
      and event_time <  p_to
    group by
        tenant_id,
        source_id,
        metric_name,
        bucket_start
    on conflict (
        tenant_id,
        source_id,
        metric_name,
        bucket_start
    )
    do update set
        bucket_end = excluded.bucket_end,
        sample_count = excluded.sample_count,
        good_count = excluded.good_count,
        late_count = excluded.late_count,
        avg_value = excluded.avg_value,
        min_value = excluded.min_value,
        max_value = excluded.max_value,
        sum_value = excluded.sum_value,
        calculated_at = clock_timestamp();
end;
$$;
```

Run:

```sql
select refresh_metric_rollup_15m_window(
    timestamptz '2026-07-15 10:00:00+00',
    timestamptz '2026-07-15 11:00:00+00'
);
```

---

# 17. Multi-Resolution Rollup

Untuk dashboard, biasanya perlu beberapa resolusi.

```text
raw metric_sample
  │
  ├─ metric_rollup_1m
  │    └─ dashboard last 1-6 hours
  │
  ├─ metric_rollup_15m
  │    └─ dashboard last 1-30 days
  │
  ├─ metric_rollup_1h
  │    └─ dashboard last 1-12 months
  │
  └─ metric_rollup_1d
       └─ dashboard multi-year
```

### Decision matrix

| Query range | Recommended source |
|---|---|
| 0-1 hour | raw or 1m |
| 1-24 hours | 1m / 5m |
| 1-30 days | 15m / 1h |
| 1-12 months | 1h / 1d |
| > 12 months | 1d / monthly reporting table |

Jangan pakai raw table untuk semua range.

---

## 18. Rollup dari Raw vs Rollup dari Rollup

Ada dua strategi.

### Strategy A - semua rollup dari raw

```text
raw → 1m
raw → 15m
raw → 1h
raw → 1d
```

| Kelebihan | Kekurangan |
|---|---|
| akurat dari source utama | mahal untuk 1h/1d |
| sederhana secara correctness | scan raw berulang |
| cocok volume sedang | tidak ideal volume sangat besar |

### Strategy B - hierarchical rollup

```text
raw → 1m → 15m → 1h → 1d
```

| Kelebihan | Kekurangan |
|---|---|
| lebih murah | perlu hati-hati formula |
| scalable | percentile tidak bisa digabung sederhana |
| cocok volume besar | avg harus weighted by count |

### Weighted average dari rollup

```sql
select
    tenant_id,
    source_id,
    metric_name,
    date_bin(interval '1 hour', bucket_start, timestamptz '2026-01-01 00:00:00+00') as hour_bucket,
    sum(avg_value * sample_count) / nullif(sum(sample_count), 0) as weighted_avg_value,
    min(min_value) as min_value,
    max(max_value) as max_value,
    sum(sample_count) as sample_count
from metric_rollup_15m
where bucket_start >= :from
  and bucket_start <  :to
group by
    tenant_id,
    source_id,
    metric_name,
    hour_bucket;
```

**Important:** percentile seperti p95/p99 tidak bisa digabung dengan mengambil rata-rata p95. Kalau butuh percentile akurat, hitung dari raw atau pakai teknik approximate percentile/histogram yang memang didesain untuk merge.

---

# 19. Dashboard API Query Design

Jangan biarkan frontend menentukan query raw secara liar. Backend harus memilih source berdasarkan range dan resolusi.

Request:

```http
GET /v1/metrics/1001/temperature_celsius/series?from=2026-07-15T00:00:00%2B07:00&to=2026-07-16T00:00:00%2B07:00&resolution=auto
```

Response:

```json
{
  "source": "metric_rollup_15m",
  "bucketSize": "PT15M",
  "timezone": "Asia/Jakarta",
  "points": [
    {
      "bucketStart": "2026-07-14T17:00:00Z",
      "avgValue": 31.4,
      "minValue": 30.9,
      "maxValue": 32.1,
      "sampleCount": 900
    }
  ]
}
```

Backend decision:

```java
public enum MetricQuerySource {
    RAW,
    ROLLUP_1M,
    ROLLUP_15M,
    ROLLUP_1H,
    ROLLUP_1D
}

public MetricQuerySource chooseSource(Duration range, String requestedResolution) {
    if (!"auto".equals(requestedResolution)) {
        return parseRequestedResolution(requestedResolution);
    }

    if (range.compareTo(Duration.ofHours(1)) <= 0) {
        return MetricQuerySource.RAW;
    }

    if (range.compareTo(Duration.ofDays(1)) <= 0) {
        return MetricQuerySource.ROLLUP_1M;
    }

    if (range.compareTo(Duration.ofDays(30)) <= 0) {
        return MetricQuerySource.ROLLUP_15M;
    }

    if (range.compareTo(Duration.ofDays(365)) <= 0) {
        return MetricQuerySource.ROLLUP_1H;
    }

    return MetricQuerySource.ROLLUP_1D;
}
```

---

# 20. MyBatis Mapper untuk Rollup Query

Mapper:

```java
public interface MetricRollupMapper {

    List<MetricRollupPoint> find15mRollup(
        @Param("tenantId") long tenantId,
        @Param("sourceId") long sourceId,
        @Param("metricName") String metricName,
        @Param("from") Instant from,
        @Param("to") Instant to
    );
}
```

XML:

```xml
<select id="find15mRollup" resultType="com.example.MetricRollupPoint">
    select
        bucket_start as bucketStart,
        bucket_end as bucketEnd,
        sample_count as sampleCount,
        good_count as goodCount,
        late_count as lateCount,
        avg_value as avgValue,
        min_value as minValue,
        max_value as maxValue,
        sum_value as sumValue,
        p95_value as p95Value
    from metric_rollup_15m
    where tenant_id = #{tenantId}
      and source_id = #{sourceId}
      and metric_name = #{metricName}
      and bucket_start >= #{from}
      and bucket_start <  #{to}
    order by bucket_start
</select>
```

---

# 21. Jersey Endpoint untuk Aggregated Series

```java
@GET
@Path("/v1/metrics/{sourceId}/{metricName}/series")
@Produces(MediaType.APPLICATION_JSON)
public Response getSeries(
    @PathParam("sourceId") long sourceId,
    @PathParam("metricName") String metricName,
    @QueryParam("from") String fromText,
    @QueryParam("to") String toText,
    @QueryParam("resolution") @DefaultValue("auto") String resolution,
    @QueryParam("timezone") @DefaultValue("UTC") String timezone
) {
    Instant from = OffsetDateTime.parse(fromText).toInstant();
    Instant to = OffsetDateTime.parse(toText).toInstant();

    if (!from.isBefore(to)) {
        throw new BadRequestException("from must be before to");
    }

    Duration range = Duration.between(from, to);

    MetricSeriesResponse response = metricQueryService.querySeries(
        sourceId,
        metricName,
        from,
        to,
        resolution,
        ZoneId.of(timezone)
    );

    return Response.ok(response).build();
}
```

Guard tambahan:

| Guard | Rekomendasi |
|---|---|
| max raw range | 1-24 jam atau 1-7 hari tergantung volume |
| max returned points | misalnya 2.000-10.000 |
| allowed resolution | `raw`, `1m`, `15m`, `1h`, `1d`, `auto` |
| allowed timezone | whitelist/validate IANA timezone |
| tenant | dari auth context |
| unsupported metric | cek `metric_definition` |

---

# 22. Bucket Count Guard

Jangan hanya batasi range. Batasi jumlah bucket.

```java
public void validateBucketCount(Instant from, Instant to, Duration bucketSize) {
    long seconds = Duration.between(from, to).getSeconds();
    long bucketSeconds = bucketSize.getSeconds();

    long bucketCount = (seconds + bucketSeconds - 1) / bucketSeconds;

    if (bucketCount > 10_000) {
        throw new BadRequestException("too many buckets requested");
    }
}
```

Contoh:

| Range | Bucket | Bucket count |
|---|---:|---:|
| 24 jam | 1 menit | 1.440 |
| 30 hari | 1 menit | 43.200 |
| 30 hari | 15 menit | 2.880 |
| 1 tahun | 1 jam | 8.760 |
| 5 tahun | 1 hari | 1.825 |

Untuk dashboard, 2.000-10.000 point biasanya sudah banyak.

---

# 23. Timezone-Aware Daily Report

Untuk report harian lokal, jangan hanya group by UTC date jika bisnisnya mengikuti timezone lokal.

```sql
select
    (event_time at time zone 'Asia/Jakarta')::date as business_date,
    count(*) as sample_count,
    avg(value_numeric) as avg_value
from metric_sample
where tenant_id = :tenantId
  and event_time >= :fromUtc
  and event_time <  :toUtc
group by business_date
order by business_date;
```

Lebih baik untuk reporting berat: simpan generated column atau rollup khusus business date.

```sql
create table metric_daily_business_rollup (
    tenant_id      bigint not null,
    source_id      bigint not null,
    metric_name    text not null,
    business_date  date not null,
    timezone_name  text not null,

    sample_count   bigint not null,
    avg_value      numeric,
    min_value      numeric,
    max_value      numeric,
    sum_value      numeric,

    calculated_at  timestamptz not null default clock_timestamp(),

    constraint metric_daily_business_rollup_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            business_date,
            timezone_name
        )
);
```

---

# 24. Materialized View sebagai Alternatif

PostgreSQL materialized view menyimpan hasil query secara fisik dan dapat di-refresh menggunakan `REFRESH MATERIALIZED VIEW`; ini bisa membantu query mahal, tetapi hasilnya tidak otomatis selalu current. ([postgresql.org](https://www.postgresql.org/docs/current/rules-materializedviews.html))

Contoh:

```sql
create materialized view metric_rollup_1h_mv as
select
    tenant_id,
    source_id,
    metric_name,
    date_trunc('hour', event_time) as bucket_start,
    count(*) as sample_count,
    avg(value_numeric) as avg_value,
    min(value_numeric) as min_value,
    max(value_numeric) as max_value
from metric_sample
where value_quality = 'GOOD'
group by
    tenant_id,
    source_id,
    metric_name,
    bucket_start
with no data;
```

Refresh:

```sql
refresh materialized view metric_rollup_1h_mv;
```

Agar bisa `REFRESH MATERIALIZED VIEW CONCURRENTLY`, materialized view perlu unique index yang mencakup seluruh row hasil secara unik.

```sql
create unique index metric_rollup_1h_mv_uniq
on metric_rollup_1h_mv (
    tenant_id,
    source_id,
    metric_name,
    bucket_start
);
```

### Kapan materialized view cocok?

| Cocok | Tidak cocok |
|---|---|
| report periodik | real-time dashboard |
| data tidak terlalu besar | high-ingest continuous refresh |
| refresh window jelas | late data sering |
| query definisi stabil | rollup incremental butuh kontrol |
| simple architecture | banyak correction/backfill |

Untuk time-series high-volume, rollup table manual atau TimescaleDB continuous aggregate biasanya lebih fleksibel daripada materialized view full refresh.

---

# 25. Quality-Aware Rollup

Jangan hanya menyimpan `avg_value`. Simpan kualitas agregasi.

```sql
select
    date_bin(interval '15 minutes', event_time, :origin) as bucket_start,

    count(*) as sample_count,
    count(*) filter (where value_quality = 'GOOD') as good_count,
    count(*) filter (where value_quality <> 'GOOD') as bad_count,
    count(*) filter (where time_quality = 'LATE') as late_count,

    avg(value_numeric) filter (where value_quality = 'GOOD') as avg_value
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
group by bucket_start
order by bucket_start;
```

Dashboard bisa menampilkan warning jika:

```text
good_count / sample_count < threshold
late_count > 0
sample_count terlalu rendah
```

---

# 26. Completeness Ratio

Misalnya expected sample interval adalah 10 detik. Untuk bucket 15 menit:

```text
expected samples = 15 minutes / 10 seconds = 90 samples
```

Tambahkan ke metric definition:

```sql
alter table metric_definition
add column expected_sample_interval interval;
```

Query completeness:

```sql
select
    r.bucket_start,
    r.sample_count,
    extract(epoch from interval '15 minutes')
      / nullif(extract(epoch from d.expected_sample_interval), 0)
      as expected_sample_count,
    r.sample_count
      / nullif(
          extract(epoch from interval '15 minutes')
          / extract(epoch from d.expected_sample_interval),
          0
        ) as completeness_ratio
from metric_rollup_15m r
join metric_definition d
  on d.metric_name = r.metric_name
where r.tenant_id = :tenantId
  and r.source_id = :sourceId
  and r.metric_name = :metricName
  and r.bucket_start >= :from
  and r.bucket_start <  :to;
```

---

# 27. Rollup Observability

Minimal monitor:

| Metric | Tujuan |
|---|---|
| rollup lag | seberapa tertinggal dari raw ingest |
| dirty bucket count | backlog recalculation |
| rollup job duration | job makin lambat atau tidak |
| affected row count | volume per run |
| late data count | seberapa sering re-aggregation |
| stale bucket count | bucket yang belum dihitung ulang |
| rollup table size | storage growth |
| dashboard query latency | user impact |

Query rollup lag:

```sql
select
    max(bucket_start) as latest_rollup_bucket,
    clock_timestamp() - max(bucket_start) as rollup_lag
from metric_rollup_15m;
```

Dirty bucket backlog:

```sql
select
    bucket_size,
    reason,
    count(*) as dirty_bucket_count,
    min(marked_at) as oldest_marked_at
from metric_rollup_dirty_bucket
group by bucket_size, reason
order by dirty_bucket_count desc;
```

---

# 28. Anti-Patterns

| Anti-pattern | Dampak |
|---|---|
| Dashboard selalu query raw table | lambat, mahal, tidak stabil |
| `coalesce(avg, 0)` untuk missing bucket | missing data terlihat seperti nilai nol |
| Tidak simpan `sample_count` | tidak tahu kualitas aggregate |
| Average dari average tanpa weighting | angka salah |
| Rata-rata p95 antar bucket | percentile salah |
| Tidak handle late data | rollup stale |
| Tidak batasi bucket count | API bisa menghasilkan puluhan ribu point |
| Group by UTC date untuk report lokal | tanggal bisnis salah |
| Satu endpoint untuk raw dan semua rollup tanpa guard | query plan sulit dikontrol |
| Materialized view full refresh untuk high-ingest | refresh mahal |
| Tidak menyimpan metric kind | counter/gauge/event diperlakukan sama |
| Tidak ada dirty bucket tracking | backfill/correction tidak terpropagasi |
| Rollup table tanpa primary key | refresh idempotency sulit |
| Tidak `ANALYZE` setelah bulk rollup | planner bisa salah estimasi |

---

# 29. Production Checklist

| Checklist | Target |
|---|---|
| Bucket interval jelas | 1m/5m/15m/1h/1d |
| Boundary pakai half-open interval | `>= from and < to` |
| Origin `date_bin` konsisten | Ya |
| Timezone report eksplisit | Ya |
| Raw query range dibatasi | Ya |
| Bucket count dibatasi | Ya |
| Missing bucket tidak dipaksa zero | Ya |
| `sample_count` selalu disimpan | Ya |
| Quality count disimpan | `good_count`, `late_count` |
| Metric kind didefinisikan | gauge/counter/event/status |
| Counter pakai delta/rate | bukan avg raw counter |
| Long range pakai rollup | Ya |
| Rollup idempotent | `ON CONFLICT DO UPDATE` |
| Late data menandai dirty bucket | Ya |
| Rollup lag dimonitor | Ya |
| MyBatis query pakai rollup table sesuai range | Ya |
| Jersey API punya resolution guard | Ya |

---

# 30. Recommended Baseline

Untuk production awal, saya sarankan:

```text
Raw:
- metric_sample partitioned by event_time

Rollup:
- metric_rollup_15m untuk dashboard harian/mingguan
- metric_rollup_1h untuk dashboard bulanan/tahunan
- metric_rollup_1d untuk long-term trend

Query:
- raw hanya untuk short-range
- rollup untuk range besar
- bucket count maksimal 10.000
- missing bucket = null + sample_count 0
- timezone report eksplisit

Operational:
- dirty bucket table untuk late/backfill/correction
- scheduled rollup job
- rollup lag alert
- refresh affected window setelah backfill
```

---

# Seri 9/16 Selesai

**Seri 9 selesai.**  
Materi ini menutup time bucket aggregation untuk PostgreSQL time-series: `date_bin`, `date_trunc`, bucket boundary, timezone-aware daily aggregation, gap filling, aggregate metrics, counter/gauge handling, rollup table, dirty bucket, dashboard API design, MyBatis query, materialized view, dan operational monitoring.

## Rekomendasi materi selanjutnya

Lanjut ke **Seri 10/16 - Gap Filling & Series Completion: `generate_series`, missing bucket, null vs zero, interpolation, last-known-value fill, dan dashboard-safe query design**.

---

**Sources:**

- [Documentation: 18: 9.9. Date/Time Functions and Operators](https://www.postgresql.org/docs/current/functions-datetime.html?utm_source=chatgpt.com)
- [Window Functions for Data Analysis with Postgres](https://www.crunchydata.com/blog/window-functions-for-data-analysis-with-postgres?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:50:09 PM

Saya lanjut ke **Seri 10/16**. Fokusnya gap filling dan series completion: bagaimana membuat bucket kosong tetap muncul, membedakan null vs zero, last-known-value fill, interpolation, dan query yang aman untuk dashboard.

# PostgreSQL Time-Series Database - Seri 10/16  
## Gap Filling & Series Completion: `generate_series`, Missing Bucket, Null vs Zero, Interpolation, Last-Known-Value Fill, dan Dashboard-Safe Query Design

**Status:** Seri 10 dari 16.  
Fokus seri ini: membuat hasil query time-series **lengkap secara visual dan semantik**, terutama untuk chart/dashboard yang butuh bucket waktu konsisten walaupun raw data tidak selalu lengkap.

---

## 1. Mental Model Gap Filling

Gap filling adalah teknik untuk membuat bucket waktu tetap muncul walaupun tidak ada data di bucket tersebut.

Raw data:

```text id="u0cyqt"
10:00 → 31.2
10:15 → 31.5
10:45 → 32.0
```

Tanpa gap filling, query chart menghasilkan:

```text id="go8l3c"
10:00 → 31.2
10:15 → 31.5
10:45 → 32.0
```

Dengan gap filling:

```text id="v04rm5"
10:00 → 31.2
10:15 → 31.5
10:30 → null
10:45 → 32.0
```

PostgreSQL menyediakan `generate_series` untuk menghasilkan rangkaian nilai, termasuk timestamp dan `timestamptz` dengan interval tertentu; pada bentuk timezone-aware, PostgreSQL menghitung adjustment berdasarkan timezone argument atau setting `TimeZone` saat argument timezone tidak diberikan. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-srf.html))

---

## 2. Kapan Gap Filling Diperlukan?

| Use case | Perlu gap filling? | Alasan |
|---|---:|---|
| Line chart metric | Ya | agar missing data terlihat |
| Bar chart event count | Ya | bucket kosong harus muncul sebagai count 0 |
| SLA/availability chart | Ya | missing sample harus dibedakan dari down/up |
| Raw timeline audit | Tidak selalu | timeline event memang sparse |
| Latest value endpoint | Tidak | cukup ambil row terbaru |
| Rollup dashboard | Ya | bucket rollup kosong harus eksplisit |
| Alert evaluation | Ya, hati-hati | missing data bisa berarti sensor mati, bukan nilai normal |

---

## 3. Core Pattern: Bucket Series + Aggregate + Left Join

Pola dasarnya:

```text id="to7gyw"
generate all expected buckets
        │
        ▼
aggregate actual raw data
        │
        ▼
left join buckets to aggregate
        │
        ▼
return bucket even when actual data is missing
```

SQL:

```sql id="ccw1u7"
with buckets as (
    select generate_series(
        :from::timestamptz,
        :to::timestamptz - interval '15 minutes',
        interval '15 minutes'
    ) as bucket_start
),
agg as (
    select
        date_bin(
            interval '15 minutes',
            event_time,
            :from::timestamptz
        ) as bucket_start,
        avg(value_numeric) as avg_value,
        count(*) as sample_count
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from
      and event_time <  :to
      and value_quality = 'GOOD'
    group by bucket_start
)
select
    b.bucket_start,
    a.avg_value,
    coalesce(a.sample_count, 0) as sample_count
from buckets b
left join agg a
  on a.bucket_start = b.bucket_start
order by b.bucket_start;
```

`generate_series` akan menghasilkan zero rows jika input `NULL`, jika step positif tetapi start lebih besar dari stop, atau jika step bernilai nol maka error; ini penting untuk validasi parameter API. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-srf.html))

---

## 4. Null vs Zero: Jangan Salah Semantik

Ini salah satu sumber bug dashboard paling umum.

| Situasi | `avg_value` | `sample_count` | Makna |
|---|---:|---:|---|
| Tidak ada sample | `null` | `0` | missing data |
| Ada sample bernilai nol | `0` | `> 0` | nilai aktual nol |
| Semua sample invalid | `null` | `0` atau `bad_count > 0` | data ada tapi tidak valid |
| Ada sample valid dan invalid | angka | `good_count > 0` | aggregate valid sebagian |
| Sensor down tapi tidak mengirim event | `null` | `0` | absence of signal |

PostgreSQL aggregate seperti `avg`, `sum`, `min`, dan `max` bekerja atas input non-null; `count(*)` menghitung row input, sedangkan `count(expression)` menghitung row yang expression-nya tidak null. Dokumentasi PostgreSQL juga mencatat bahwa kecuali `count`, aggregate mengembalikan `NULL` ketika tidak ada row input; `sum` tanpa row bukan `0`. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-aggregate.html?utm_source=chatgpt.com))

Anti-pattern:

```sql id="xw445s"
coalesce(avg(value_numeric), 0) as avg_value
```

Lebih aman:

```sql id="onl6ml"
avg(value_numeric) as avg_value,
count(*) as sample_count
```

Untuk event count, `0` memang bisa benar:

```sql id="x6zcks"
coalesce(a.event_count, 0) as event_count
```

Untuk gauge seperti temperatur, CPU usage, latency, pressure, voltage, `null` lebih benar daripada `0`.

---

## 5. Baseline Table

```sql id="uzfvx3"
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_id        uuid not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    value_numeric   numeric,
    value_quality   text not null default 'GOOD',
    time_quality    text not null default 'NORMAL',

    tags            jsonb not null default '{}'::jsonb,

    constraint metric_sample_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            event_time,
            event_id
        )
)
partition by range (event_time);
```

Index:

```sql id="jveehs"
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time
)
include (
    value_numeric,
    value_quality,
    time_quality
);
```

---

# 6. Pattern 1 - Gap Filling untuk Gauge Metric

Gauge metric: temperatur, CPU usage, memory usage, queue depth, battery percentage.

```sql id="qf9vs6"
with buckets as (
    select generate_series(
        :from::timestamptz,
        :to::timestamptz - :bucketSize::interval,
        :bucketSize::interval
    ) as bucket_start
),
agg as (
    select
        date_bin(
            :bucketSize::interval,
            event_time,
            :from::timestamptz
        ) as bucket_start,
        avg(value_numeric) filter (where value_quality = 'GOOD') as avg_value,
        min(value_numeric) filter (where value_quality = 'GOOD') as min_value,
        max(value_numeric) filter (where value_quality = 'GOOD') as max_value,
        count(*) as raw_count,
        count(*) filter (where value_quality = 'GOOD') as good_count,
        count(*) filter (where value_quality <> 'GOOD') as bad_count
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from
      and event_time <  :to
    group by bucket_start
)
select
    b.bucket_start,
    a.avg_value,
    a.min_value,
    a.max_value,
    coalesce(a.raw_count, 0) as raw_count,
    coalesce(a.good_count, 0) as good_count,
    coalesce(a.bad_count, 0) as bad_count,
    case
        when coalesce(a.raw_count, 0) = 0 then 'MISSING'
        when coalesce(a.good_count, 0) = 0 then 'NO_GOOD_SAMPLE'
        when coalesce(a.bad_count, 0) > 0 then 'PARTIAL_QUALITY'
        else 'OK'
    end as bucket_quality
from buckets b
left join agg a
  on a.bucket_start = b.bucket_start
order by b.bucket_start;
```

Output semantik:

```text id="ayxnsl"
bucket_start | avg_value | sample_count | bucket_quality
10:00        | 31.2      | 90           | OK
10:15        | null      | 0            | MISSING
10:30        | null      | 10           | NO_GOOD_SAMPLE
10:45        | 31.7      | 80           | PARTIAL_QUALITY
```

---

# 7. Pattern 2 - Gap Filling untuk Event Count

Untuk event count, bucket kosong boleh menjadi `0`.

```sql id="goz5it"
with buckets as (
    select generate_series(
        :from::timestamptz,
        :to::timestamptz - interval '15 minutes',
        interval '15 minutes'
    ) as bucket_start
),
agg as (
    select
        date_bin(
            interval '15 minutes',
            event_time,
            :from::timestamptz
        ) as bucket_start,
        count(*) as event_count
    from metric_sample
    where tenant_id = :tenantId
      and metric_name = :metricName
      and event_time >= :from
      and event_time <  :to
    group by bucket_start
)
select
    b.bucket_start,
    coalesce(a.event_count, 0) as event_count
from buckets b
left join agg a
  on a.bucket_start = b.bucket_start
order by b.bucket_start;
```

### Kenapa `0` benar di sini?

Karena yang diukur adalah **jumlah event dalam bucket**. Jika tidak ada row event, jumlahnya memang 0.

Bandingkan dengan temperatur: tidak ada sample temperatur bukan berarti temperatur 0.

---

# 8. Pattern 3 - Gap Filling Multi-Source

Misalnya ingin chart semua source dalam satu tenant, setiap source harus punya bucket lengkap.

```sql id="hvr16e"
with selected_sources as (
    select unnest(:sourceIds::bigint[]) as source_id
),
buckets as (
    select generate_series(
        :from::timestamptz,
        :to::timestamptz - interval '15 minutes',
        interval '15 minutes'
    ) as bucket_start
),
source_buckets as (
    select
        s.source_id,
        b.bucket_start
    from selected_sources s
    cross join buckets b
),
agg as (
    select
        source_id,
        date_bin(
            interval '15 minutes',
            event_time,
            :from::timestamptz
        ) as bucket_start,
        avg(value_numeric) as avg_value,
        count(*) as sample_count
    from metric_sample
    where tenant_id = :tenantId
      and source_id = any(:sourceIds::bigint[])
      and metric_name = :metricName
      and event_time >= :from
      and event_time <  :to
      and value_quality = 'GOOD'
    group by source_id, bucket_start
)
select
    sb.source_id,
    sb.bucket_start,
    a.avg_value,
    coalesce(a.sample_count, 0) as sample_count
from source_buckets sb
left join agg a
  on a.source_id = sb.source_id
 and a.bucket_start = sb.bucket_start
order by sb.source_id, sb.bucket_start;
```

### Warning

`source_buckets = number_of_sources × number_of_buckets`.

| Source count | Bucket count | Result rows |
|---:|---:|---:|
| 10 | 96 | 960 |
| 1.000 | 96 | 96.000 |
| 10.000 | 2.880 | 28.800.000 |

Jangan gunakan cross join besar tanpa guard API.

---

# 9. Pattern 4 - Gap Filling dari Rollup Table

Untuk dashboard range panjang, gap filling sebaiknya dari rollup table, bukan raw.

```sql id="rpef7i"
with buckets as (
    select generate_series(
        :from::timestamptz,
        :to::timestamptz - interval '15 minutes',
        interval '15 minutes'
    ) as bucket_start
)
select
    b.bucket_start,
    r.avg_value,
    r.min_value,
    r.max_value,
    coalesce(r.sample_count, 0) as sample_count,
    coalesce(r.good_count, 0) as good_count,
    coalesce(r.late_count, 0) as late_count
from buckets b
left join metric_rollup_15m r
  on r.tenant_id = :tenantId
 and r.source_id = :sourceId
 and r.metric_name = :metricName
 and r.bucket_start = b.bucket_start
order by b.bucket_start;
```

Ini lebih stabil karena `metric_rollup_15m` jauh lebih kecil daripada raw table.

---

# 10. Pattern 5 - Last-Known-Value Fill

Last-known-value fill berarti bucket kosong diisi dengan nilai terakhir yang diketahui sebelumnya.

Contoh:

```text id="acv8hy"
10:00 → 31.2
10:15 → null
10:30 → null
10:45 → 32.0
```

Setelah LKV fill:

```text id="cq1b6p"
10:00 → 31.2
10:15 → 31.2
10:30 → 31.2
10:45 → 32.0
```

Cocok untuk:

| Cocok | Jangan gunakan |
|---|---|
| state/status | temperatur yang harus real-time |
| current configuration | alert threshold tanpa expiry |
| workflow state | sensor yang bisa mati |
| last heartbeat display | compliance numeric measurement tanpa flag |
| stock level snapshot | event count |

---

## 11. LKV Fill dengan Correlated Subquery

Sederhana dan mudah dipahami:

```sql id="ja8ft6"
with buckets as (
    select generate_series(
        :from::timestamptz,
        :to::timestamptz - interval '15 minutes',
        interval '15 minutes'
    ) as bucket_start
)
select
    b.bucket_start,
    lkv.event_time as last_event_time,
    lkv.value_numeric as filled_value,
    case
        when lkv.event_time is null then 'MISSING'
        when b.bucket_start - lkv.event_time > interval '1 hour' then 'STALE'
        else 'FILLED'
    end as fill_status
from buckets b
left join lateral (
    select
        event_time,
        value_numeric
    from metric_sample m
    where m.tenant_id = :tenantId
      and m.source_id = :sourceId
      and m.metric_name = :metricName
      and m.value_quality = 'GOOD'
      and m.event_time <= b.bucket_start
      and m.event_time >= b.bucket_start - interval '1 hour'
    order by m.event_time desc
    limit 1
) lkv on true
order by b.bucket_start;
```

### Index penting

```sql id="vdqfns"
create index metric_sample_lkv_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
)
include (
    value_numeric,
    value_quality
);
```

### Kenapa ada lookback?

Tanpa lookback, bucket hari ini bisa diisi nilai minggu lalu. Itu sering salah.

```sql id="b7w1ys"
m.event_time >= b.bucket_start - interval '1 hour'
```

---

# 12. LKV Fill dengan Actual Bucket + Window Grouping

PostgreSQL belum mengimplementasikan opsi SQL standard `IGNORE NULLS` untuk `lead`, `lag`, `first_value`, `last_value`, dan `nth_value`; perilakunya selalu seperti `RESPECT NULLS`. Karena itu, `last_value(value) ignore nulls` tidak bisa langsung dipakai seperti di beberapa database lain. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-window.html))

Workaround: buat group bertambah setiap kali ada nilai aktual, lalu ambil `max()` dalam group.

```sql id="keya86"
with buckets as (
    select generate_series(
        :from::timestamptz,
        :to::timestamptz - interval '15 minutes',
        interval '15 minutes'
    ) as bucket_start
),
agg as (
    select
        date_bin(
            interval '15 minutes',
            event_time,
            :from::timestamptz
        ) as bucket_start,
        avg(value_numeric) as avg_value,
        count(*) as sample_count
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from - interval '1 hour'
      and event_time <  :to
      and value_quality = 'GOOD'
    group by bucket_start
),
joined as (
    select
        b.bucket_start,
        a.avg_value,
        coalesce(a.sample_count, 0) as sample_count
    from buckets b
    left join agg a
      on a.bucket_start = b.bucket_start
),
grouped as (
    select
        *,
        sum(case when avg_value is not null then 1 else 0 end)
            over (order by bucket_start) as value_group
    from joined
)
select
    bucket_start,
    avg_value,
    max(avg_value) over (
        partition by value_group
        order by bucket_start
        rows between unbounded preceding and current row
    ) as filled_value,
    sample_count,
    case
        when avg_value is not null then 'ACTUAL'
        when value_group = 0 then 'MISSING'
        else 'FILLED'
    end as fill_status
from grouped
order by bucket_start;
```

Window functions di PostgreSQL harus dipakai dengan klausa `OVER`; fungsi seperti `lag`, `lead`, `first_value`, dan `last_value` bergantung pada ordering dalam window definition. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-window.html))

---

# 13. Pattern 6 - Forward Fill dengan Expiry

Forward fill tanpa expiry sering berbahaya.

Tambahkan umur nilai terakhir:

```sql id="w36597"
with buckets as (
    select generate_series(
        :from::timestamptz,
        :to::timestamptz - interval '15 minutes',
        interval '15 minutes'
    ) as bucket_start
)
select
    b.bucket_start,
    lkv.value_numeric as filled_value,
    lkv.event_time as last_event_time,
    b.bucket_start - lkv.event_time as value_age,
    case
        when lkv.event_time is null then 'MISSING'
        when b.bucket_start - lkv.event_time > interval '1 hour' then 'STALE'
        else 'FILLED'
    end as fill_status
from buckets b
left join lateral (
    select
        event_time,
        value_numeric
    from metric_sample m
    where m.tenant_id = :tenantId
      and m.source_id = :sourceId
      and m.metric_name = :metricName
      and m.value_quality = 'GOOD'
      and m.event_time <= b.bucket_start
    order by event_time desc
    limit 1
) lkv on true
order by b.bucket_start;
```

Frontend sebaiknya menerima `fill_status`, bukan hanya angka.

```json id="q2gnny"
{
  "bucketStart": "2026-07-15T10:15:00Z",
  "value": 31.2,
  "fillStatus": "FILLED",
  "lastEventTime": "2026-07-15T10:00:00Z",
  "valueAgeSeconds": 900
}
```

---

# 14. Pattern 7 - Backward Fill

Backward fill mengisi bucket kosong dengan nilai berikutnya.

```sql id="jvad17"
with buckets as (
    select generate_series(
        :from::timestamptz,
        :to::timestamptz - interval '15 minutes',
        interval '15 minutes'
    ) as bucket_start
)
select
    b.bucket_start,
    next_value.event_time as next_event_time,
    next_value.value_numeric as backfilled_value,
    case
        when next_value.event_time is null then 'MISSING'
        when next_value.event_time - b.bucket_start > interval '1 hour' then 'STALE'
        else 'BACKFILLED'
    end as fill_status
from buckets b
left join lateral (
    select
        event_time,
        value_numeric
    from metric_sample m
    where m.tenant_id = :tenantId
      and m.source_id = :sourceId
      and m.metric_name = :metricName
      and m.value_quality = 'GOOD'
      and m.event_time >= b.bucket_start
      and m.event_time <  b.bucket_start + interval '1 hour'
    order by event_time asc
    limit 1
) next_value on true
order by b.bucket_start;
```

Backward fill lebih jarang dipakai untuk real-time dashboard, tetapi berguna untuk data cleaning/offline analytics.

---

# 15. Pattern 8 - Linear Interpolation

Linear interpolation memperkirakan nilai di bucket kosong berdasarkan nilai sebelum dan sesudah.

```text id="q4hz4m"
10:00 → 30
10:15 → null
10:30 → 36

Interpolated 10:15 = 33
```

Cocok untuk:

| Cocok | Jangan gunakan |
|---|---|
| sensor kontinu | event count |
| telemetry numerik stabil | status enum |
| visual smoothing | compliance raw value |
| offline analytics | alerting kritikal tanpa flag |
| chart trend | audit timeline |

---

## 16. Linear Interpolation SQL

```sql id="yqxpt7"
with buckets as (
    select generate_series(
        :from::timestamptz,
        :to::timestamptz - interval '15 minutes',
        interval '15 minutes'
    ) as bucket_start
),
agg as (
    select
        date_bin(
            interval '15 minutes',
            event_time,
            :from::timestamptz
        ) as bucket_start,
        avg(value_numeric) as avg_value,
        count(*) as sample_count
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from
      and event_time <  :to
      and value_quality = 'GOOD'
    group by bucket_start
),
joined as (
    select
        b.bucket_start,
        a.avg_value,
        coalesce(a.sample_count, 0) as sample_count
    from buckets b
    left join agg a
      on a.bucket_start = b.bucket_start
),
nearest as (
    select
        j.*,

        prev.bucket_start as prev_time,
        prev.avg_value as prev_value,

        next.bucket_start as next_time,
        next.avg_value as next_value

    from joined j
    left join lateral (
        select
            bucket_start,
            avg_value
        from joined p
        where p.bucket_start <= j.bucket_start
          and p.avg_value is not null
        order by p.bucket_start desc
        limit 1
    ) prev on true

    left join lateral (
        select
            bucket_start,
            avg_value
        from joined n
        where n.bucket_start >= j.bucket_start
          and n.avg_value is not null
        order by n.bucket_start asc
        limit 1
    ) next on true
)
select
    bucket_start,
    avg_value as actual_value,
    case
        when avg_value is not null then avg_value
        when prev_value is null or next_value is null then null
        when next_time = prev_time then prev_value
        else
            prev_value
            + (
                (extract(epoch from bucket_start - prev_time)
                 / nullif(extract(epoch from next_time - prev_time), 0))
                * (next_value - prev_value)
              )
    end as interpolated_value,
    sample_count,
    case
        when avg_value is not null then 'ACTUAL'
        when prev_value is null or next_value is null then 'MISSING'
        else 'INTERPOLATED'
    end as fill_status
from nearest
order by bucket_start;
```

### Catatan production

Query ini mudah dipahami, tetapi bisa mahal untuk bucket banyak karena lateral lookup dilakukan per bucket. Untuk dashboard besar, lebih baik lakukan interpolation di application layer atau gunakan rollup/projection yang sudah disiapkan.

---

# 17. Pattern 9 - Gap Detection

Kadang bukan ingin mengisi gap, tapi menemukan gap.

Contoh: cari jeda antar sample lebih dari 5 menit.

```sql id="nlfey0"
with ordered as (
    select
        event_time,
        lag(event_time) over (
            order by event_time
        ) as previous_event_time
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from
      and event_time <  :to
)
select
    previous_event_time,
    event_time,
    event_time - previous_event_time as gap_duration
from ordered
where previous_event_time is not null
  and event_time - previous_event_time > interval '5 minutes'
order by gap_duration desc;
```

`lag()` mengambil nilai dari row sebelumnya dalam partition window; jika tidak ada row sebelumnya, hasil default-nya `NULL` bila default tidak diberikan. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-window.html))

---

# 18. Pattern 10 - Expected Sample Completeness

Jika metric harus masuk setiap 10 detik, maka bucket 15 menit punya ekspektasi 90 sample.

```sql id="iwjqta"
create table metric_definition (
    metric_name text primary key,
    metric_kind text not null,
    expected_sample_interval interval,

    constraint metric_definition_kind_chk
        check (metric_kind in ('GAUGE', 'COUNTER', 'EVENT', 'STATUS', 'DURATION'))
);
```

Completeness query:

```sql id="wyq85h"
with buckets as (
    select generate_series(
        :from::timestamptz,
        :to::timestamptz - interval '15 minutes',
        interval '15 minutes'
    ) as bucket_start
),
agg as (
    select
        date_bin(interval '15 minutes', event_time, :from::timestamptz) as bucket_start,
        count(*) filter (where value_quality = 'GOOD') as good_count
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from
      and event_time <  :to
    group by bucket_start
)
select
    b.bucket_start,
    coalesce(a.good_count, 0) as good_count,
    (
        extract(epoch from interval '15 minutes')
        / nullif(extract(epoch from d.expected_sample_interval), 0)
    ) as expected_count,
    coalesce(a.good_count, 0)
    / nullif(
        extract(epoch from interval '15 minutes')
        / extract(epoch from d.expected_sample_interval),
        0
    ) as completeness_ratio,
    case
        when d.expected_sample_interval is null then 'UNKNOWN_EXPECTATION'
        when coalesce(a.good_count, 0) = 0 then 'MISSING'
        when coalesce(a.good_count, 0)
             < (
                 extract(epoch from interval '15 minutes')
                 / extract(epoch from d.expected_sample_interval)
               ) * 0.8 then 'INCOMPLETE'
        else 'OK'
    end as completeness_status
from buckets b
cross join metric_definition d
left join agg a
  on a.bucket_start = b.bucket_start
where d.metric_name = :metricName
order by b.bucket_start;
```

---

# 19. Pattern 11 - Gap Filling untuk Status / State

Status biasanya lebih cocok memakai LKV fill daripada average.

Raw status table:

```sql id="whn9z6"
create table source_status_event (
    tenant_id    bigint not null,
    source_id    bigint not null,
    event_id     uuid not null,
    status       text not null,
    event_time   timestamptz not null,
    ingest_time  timestamptz not null default clock_timestamp(),

    constraint source_status_event_pk
        primary key (tenant_id, source_id, event_time, event_id),

    constraint source_status_event_status_chk
        check (status in ('UP', 'DOWN', 'DEGRADED', 'UNKNOWN'))
)
partition by range (event_time);
```

Status per bucket:

```sql id="t8s895"
with buckets as (
    select generate_series(
        :from::timestamptz,
        :to::timestamptz - interval '1 minute',
        interval '1 minute'
    ) as bucket_start
)
select
    b.bucket_start,
    s.status,
    s.event_time as last_status_time,
    case
        when s.event_time is null then 'UNKNOWN'
        when b.bucket_start - s.event_time > interval '10 minutes' then 'STALE'
        else 'FILLED'
    end as fill_status
from buckets b
left join lateral (
    select
        status,
        event_time
    from source_status_event e
    where e.tenant_id = :tenantId
      and e.source_id = :sourceId
      and e.event_time <= b.bucket_start
    order by e.event_time desc
    limit 1
) s on true
order by b.bucket_start;
```

---

# 20. Pattern 12 - Gap Filling untuk Regulatory / Case Timeline

Untuk case/event timeline, jangan “isi gap” dengan nilai palsu. Lebih tepat gunakan **state history**.

```sql id="iq8adm"
create table case_state_history (
    tenant_id   bigint not null,
    case_id     uuid not null,
    state       text not null,
    valid_from  timestamptz not null,
    valid_to    timestamptz,

    constraint case_state_history_pk
        primary key (tenant_id, case_id, valid_from),

    constraint case_state_history_valid_chk
        check (valid_to is null or valid_to > valid_from)
);
```

State per bucket:

```sql id="ex198d"
with buckets as (
    select generate_series(
        :from::timestamptz,
        :to::timestamptz - interval '1 hour',
        interval '1 hour'
    ) as bucket_start
)
select
    b.bucket_start,
    h.state
from buckets b
left join case_state_history h
  on h.tenant_id = :tenantId
 and h.case_id = :caseId
 and h.valid_from <= b.bucket_start
 and (
     h.valid_to > b.bucket_start
     or h.valid_to is null
 )
order by b.bucket_start;
```

Ini bukan interpolasi. Ini evaluasi state berdasarkan interval validitas.

---

# 21. Timezone-Aware Bucket Series

Untuk report harian lokal, gunakan timezone secara eksplisit.

PostgreSQL `generate_series` untuk `timestamptz` mendukung argument timezone opsional, sehingga adjustment waktu dan daylight saving dihitung berdasarkan timezone tersebut. Walaupun Asia/Jakarta tidak memakai DST, pattern ini penting jika sistem enterprise melayani region lain. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-srf.html))

Contoh daily buckets di timezone Jakarta:

```sql id="o4q1jl"
with local_days as (
    select generate_series(
        timestamptz '2026-07-01 00:00:00+07',
        timestamptz '2026-07-31 00:00:00+07',
        interval '1 day',
        'Asia/Jakarta'
    ) as day_start
)
select
    day_start,
    day_start + interval '1 day' as day_end
from local_days
order by day_start;
```

Untuk query raw:

```sql id="gf059v"
with days as (
    select generate_series(
        :fromLocal::timestamptz,
        :toLocal::timestamptz - interval '1 day',
        interval '1 day',
        :timezone
    ) as day_start
),
agg as (
    select
        date_trunc('day', event_time, :timezone) as day_start,
        count(*) as sample_count,
        avg(value_numeric) as avg_value
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :fromUtc
      and event_time <  :toUtc
    group by day_start
)
select
    d.day_start,
    a.avg_value,
    coalesce(a.sample_count, 0) as sample_count
from days d
left join agg a
  on a.day_start = d.day_start
order by d.day_start;
```

---

# 22. Dashboard Response Contract

Jangan hanya return angka. Return metadata agar frontend tidak salah menggambar.

```json id="z1k1ef"
{
  "source": "metric_rollup_15m",
  "bucketSize": "PT15M",
  "fillMode": "NONE",
  "points": [
    {
      "bucketStart": "2026-07-15T03:00:00Z",
      "value": 31.2,
      "sampleCount": 90,
      "bucketQuality": "OK",
      "fillStatus": "ACTUAL"
    },
    {
      "bucketStart": "2026-07-15T03:15:00Z",
      "value": null,
      "sampleCount": 0,
      "bucketQuality": "MISSING",
      "fillStatus": "MISSING"
    }
  ]
}
```

Untuk LKV/interpolation:

```json id="xsyx7j"
{
  "bucketStart": "2026-07-15T03:15:00Z",
  "actualValue": null,
  "displayValue": 31.2,
  "sampleCount": 0,
  "fillStatus": "FILLED",
  "fillMethod": "LAST_KNOWN_VALUE",
  "lastActualTime": "2026-07-15T03:00:00Z",
  "valueAgeSeconds": 900
}
```

---

# 23. Jersey API Design

```java id="l8n74y"
@GET
@Path("/v1/metrics/{sourceId}/{metricName}/series")
@Produces(MediaType.APPLICATION_JSON)
public Response getSeries(
    @PathParam("sourceId") long sourceId,
    @PathParam("metricName") String metricName,
    @QueryParam("from") String fromText,
    @QueryParam("to") String toText,
    @QueryParam("bucket") @DefaultValue("15m") String bucket,
    @QueryParam("fill") @DefaultValue("none") String fill,
    @QueryParam("timezone") @DefaultValue("UTC") String timezone
) {
    Instant from = OffsetDateTime.parse(fromText).toInstant();
    Instant to = OffsetDateTime.parse(toText).toInstant();

    BucketSize bucketSize = BucketSize.parse(bucket);
    FillMode fillMode = FillMode.parse(fill);

    validateRangeAndBucket(from, to, bucketSize);
    validateFillModeForMetric(metricName, fillMode);

    MetricSeriesResponse response = metricQueryService.querySeries(
        sourceId,
        metricName,
        from,
        to,
        bucketSize,
        fillMode,
        ZoneId.of(timezone)
    );

    return Response.ok(response).build();
}
```

Fill mode enum:

```java id="szzbgb"
public enum FillMode {
    NONE,
    ZERO_FOR_COUNT,
    LAST_KNOWN_VALUE,
    LINEAR_INTERPOLATION
}
```

Validation:

```java id="lhl635"
private void validateFillModeForMetric(String metricName, FillMode fillMode) {
    MetricDefinition definition = metricDefinitionService.get(metricName);

    if (fillMode == FillMode.ZERO_FOR_COUNT
        && definition.kind() != MetricKind.EVENT) {
        throw new BadRequestException("zero fill is only allowed for event/count metrics");
    }

    if (fillMode == FillMode.LINEAR_INTERPOLATION
        && definition.kind() != MetricKind.GAUGE) {
        throw new BadRequestException("linear interpolation is only allowed for gauge metrics");
    }

    if (fillMode == FillMode.LAST_KNOWN_VALUE
        && !(definition.kind() == MetricKind.STATUS
             || definition.kind() == MetricKind.GAUGE)) {
        throw new BadRequestException("last-known-value fill is not allowed for this metric");
    }
}
```

---

# 24. MyBatis Mapper Strategy

Pisahkan query berdasarkan fill mode. Jangan buat satu XML dinamis yang terlalu kompleks dan sulit dioptimasi.

```java id="r75r0o"
public interface MetricSeriesMapper {

    List<MetricSeriesPoint> findGaugeSeriesNoFill(
        @Param("tenantId") long tenantId,
        @Param("sourceId") long sourceId,
        @Param("metricName") String metricName,
        @Param("from") Instant from,
        @Param("to") Instant to,
        @Param("bucketSize") String bucketSize
    );

    List<MetricSeriesPoint> findGaugeSeriesWithGaps(
        @Param("tenantId") long tenantId,
        @Param("sourceId") long sourceId,
        @Param("metricName") String metricName,
        @Param("from") Instant from,
        @Param("to") Instant to,
        @Param("bucketSize") String bucketSize
    );

    List<MetricSeriesPoint> findGaugeSeriesLastKnownValue(
        @Param("tenantId") long tenantId,
        @Param("sourceId") long sourceId,
        @Param("metricName") String metricName,
        @Param("from") Instant from,
        @Param("to") Instant to,
        @Param("bucketSize") String bucketSize,
        @Param("maxStaleness") String maxStaleness
    );
}
```

MyBatis XML untuk gap filling:

```xml id="gp0xma"
<select id="findGaugeSeriesWithGaps" resultType="com.example.MetricSeriesPoint">
    with buckets as (
        select generate_series(
            #{from}::timestamptz,
            #{to}::timestamptz - #{bucketSize}::interval,
            #{bucketSize}::interval
        ) as bucket_start
    ),
    agg as (
        select
            date_bin(
                #{bucketSize}::interval,
                event_time,
                #{from}::timestamptz
            ) as bucket_start,
            avg(value_numeric) filter (where value_quality = 'GOOD') as avg_value,
            count(*) as raw_count,
            count(*) filter (where value_quality = 'GOOD') as good_count
        from metric_sample
        where tenant_id = #{tenantId}
          and source_id = #{sourceId}
          and metric_name = #{metricName}
          and event_time >= #{from}
          and event_time &lt; #{to}
        group by bucket_start
    )
    select
        b.bucket_start as bucketStart,
        a.avg_value as value,
        coalesce(a.raw_count, 0) as rawCount,
        coalesce(a.good_count, 0) as goodCount,
        case
            when coalesce(a.raw_count, 0) = 0 then 'MISSING'
            when coalesce(a.good_count, 0) = 0 then 'NO_GOOD_SAMPLE'
            else 'OK'
        end as bucketQuality,
        case
            when a.avg_value is null then 'MISSING'
            else 'ACTUAL'
        end as fillStatus
    from buckets b
    left join agg a
      on a.bucket_start = b.bucket_start
    order by b.bucket_start
</select>
```

---

# 25. Performance Guard

Gap filling bisa sangat mahal kalau jumlah bucket besar.

```java id="4qt3mf"
public void validateRangeAndBucket(
    Instant from,
    Instant to,
    BucketSize bucketSize
) {
    if (!from.isBefore(to)) {
        throw new BadRequestException("from must be before to");
    }

    long rangeSeconds = Duration.between(from, to).getSeconds();
    long bucketSeconds = bucketSize.duration().getSeconds();

    long bucketCount = (rangeSeconds + bucketSeconds - 1) / bucketSeconds;

    if (bucketCount > 10_000) {
        throw new BadRequestException("too many buckets requested");
    }
}
```

Multi-source guard:

```java id="9b2w1w"
long outputRows = bucketCount * sourceIds.size();

if (outputRows > 100_000) {
    throw new BadRequestException("too many output points requested");
}
```

---

# 26. Query Source Selection

Jangan selalu gap-fill dari raw table.

```text id="v1f0k3"
range <= 1 hour
  → raw or 1m rollup

range <= 1 day
  → 1m / 5m rollup

range <= 30 days
  → 15m rollup

range <= 1 year
  → 1h rollup

range > 1 year
  → 1d rollup
```

Service decision:

```java id="89w6nt"
public MetricQuerySource chooseSource(Duration range, BucketSize bucketSize) {
    if (range.compareTo(Duration.ofHours(1)) <= 0) {
        return MetricQuerySource.RAW;
    }

    if (bucketSize.duration().compareTo(Duration.ofMinutes(15)) >= 0
        && range.compareTo(Duration.ofDays(30)) <= 0) {
        return MetricQuerySource.ROLLUP_15M;
    }

    if (bucketSize.duration().compareTo(Duration.ofHours(1)) >= 0
        && range.compareTo(Duration.ofDays(365)) <= 0) {
        return MetricQuerySource.ROLLUP_1H;
    }

    return MetricQuerySource.ROLLUP_1D;
}
```

---

# 27. Gap Filling in Rollup Job

Gap filling tidak selalu hanya dilakukan saat read. Untuk beberapa dashboard, kita bisa materialize empty bucket.

Namun hati-hati: menyimpan semua empty bucket untuk semua source bisa meledakkan storage.

| Strategy | Kapan cocok |
|---|---|
| Fill saat read | fleksibel, storage hemat |
| Materialize empty bucket | dashboard ultra-cepat, jumlah source kecil |
| Current-state projection | latest/status lebih murah |
| Completeness rollup | monitoring data quality |
| Alert-specific projection | alert evaluation stabil |

Contoh completeness rollup:

```sql id="c1enwd"
create table metric_completeness_15m (
    tenant_id bigint not null,
    source_id bigint not null,
    metric_name text not null,
    bucket_start timestamptz not null,

    expected_count numeric,
    actual_good_count bigint not null,
    completeness_ratio numeric,
    completeness_status text not null,

    calculated_at timestamptz not null default clock_timestamp(),

    constraint metric_completeness_15m_pk
        primary key (tenant_id, source_id, metric_name, bucket_start)
);
```

---

# 28. Alerting: Missing Data adalah Signal

Untuk monitoring/IoT, missing data sering lebih penting daripada nilai data.

Contoh alert rule:

```text id="pu1ppj"
Jika completeness_ratio < 0.8 selama 3 bucket berturut-turut
→ sensor ingestion degraded

Jika sample_count = 0 selama 10 menit
→ source silent

Jika fill_status = STALE
→ jangan evaluasi threshold numeric biasa
```

SQL contoh:

```sql id="nkomdn"
with recent as (
    select
        bucket_start,
        completeness_ratio,
        completeness_status
    from metric_completeness_15m
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and bucket_start >= clock_timestamp() - interval '1 hour'
    order by bucket_start desc
    limit 4
)
select
    count(*) filter (
        where completeness_status in ('MISSING', 'INCOMPLETE')
    ) as bad_bucket_count
from recent;
```

---

# 29. Testing Gap Filling

Test cases minimal:

| Test | Ekspektasi |
|---|---|
| tidak ada raw data sama sekali | semua bucket muncul dengan null/count 0 |
| raw data lengkap | semua bucket actual |
| satu bucket kosong | bucket kosong muncul MISSING |
| value aktual 0 | value 0, sample_count > 0 |
| semua sample invalid | NO_GOOD_SAMPLE |
| late data masuk | bucket berubah setelah refresh |
| LKV fill tanpa previous value | MISSING |
| LKV fill terlalu lama | STALE |
| interpolation tanpa prev/next | MISSING |
| event count bucket kosong | count 0 |
| timezone harian | bucket sesuai timezone |
| range besar | request ditolak oleh guard |

---

# 30. Anti-Patterns

| Anti-pattern | Dampak |
|---|---|
| Missing value otomatis diisi 0 | metric gauge jadi salah |
| Tidak return `sample_count` | dashboard tidak tahu kualitas data |
| LKV fill tanpa max staleness | nilai lama terlihat valid |
| Interpolation untuk status/event count | semantik salah |
| Gap filling raw untuk range panjang | query mahal |
| Cross join source × bucket tanpa guard | result set meledak |
| Satu query dynamic untuk semua fill mode | sulit dioptimasi |
| Tidak membedakan `actualValue` vs `displayValue` | user tidak tahu nilai diisi |
| Tidak expose `fillStatus` | dashboard menipu |
| Tidak test timezone bucket | report lokal bisa salah |
| Alert threshold memakai filled stale value | false positive/negative |
| Materialize empty bucket untuk semua source tanpa kalkulasi | storage explosion |

---

# 31. Production Checklist

| Checklist | Target |
|---|---|
| Bucket series dibuat dengan `generate_series` | Ya |
| `from/to/bucket` divalidasi | Ya |
| Max bucket count dibatasi | Ya |
| Multi-source output rows dibatasi | Ya |
| Gauge missing tetap `null` | Ya |
| Event count missing boleh `0` | Ya |
| `sample_count` selalu dikirim | Ya |
| `good_count` / quality count dikirim | Ya |
| `fillStatus` dikirim | Ya |
| LKV punya max staleness | Ya |
| Interpolation hanya untuk gauge yang valid | Ya |
| Raw vs rollup source dipilih otomatis | Ya |
| Query gap filling punya index pendukung | Ya |
| Timezone bucket eksplisit | Ya |
| Alert membedakan missing/stale/actual | Ya |
| MyBatis query dipisah per fill mode | Ya |

---

# 32. Recommended Baseline

Untuk production awal, saya rekomendasikan:

```text id="xhys2u"
Fill mode:
- default: NONE
- event/count metric: ZERO_FOR_COUNT
- status/state metric: LAST_KNOWN_VALUE with staleness
- gauge metric: NONE by default, optional LKV/interpolation only for display

Response:
- actualValue
- displayValue
- sampleCount
- bucketQuality
- fillStatus
- lastActualTime
- valueAgeSeconds

Guard:
- max bucket count 10.000
- max multi-source output 100.000 rows
- raw only for short range
- rollup for medium/long range
```

---

# Seri 10/16 Selesai

**Seri 10 selesai.**  
Materi ini menutup gap filling dan series completion untuk PostgreSQL time-series: `generate_series`, null vs zero, gauge/event/status semantics, multi-source gap filling, rollup-based gap filling, last-known-value fill, stale value guard, backward fill, interpolation, gap detection, completeness ratio, Jersey API guard, MyBatis mapper, dan dashboard-safe response contract.

## Rekomendasi materi selanjutnya

Lanjut ke **Seri 11/16 - Window Analytics: moving average, lag/lead, delta, rate-of-change, rolling SLA, anomaly detection, dan query boundary yang aman untuk production dashboard/alerting**.

---

**Sources:**

- [PostgreSQL: Documentation: 18: 9.26. Set Returning Functions](https://www.postgresql.org/docs/current/functions-srf.html)

## Response:
7/15/2026, 8:52:36 PM

Saya lanjut ke **Seri 11/16**. Fokusnya window analytics praktis: moving average, `lag/lead`, delta/rate, rolling SLA, anomaly sederhana, dan batasan query agar aman untuk dashboard/alerting production.

# PostgreSQL Time-Series Database - Seri 11/16  
## Window Analytics: Moving Average, `lag/lead`, Delta, Rate-of-Change, Rolling SLA, Anomaly Detection, dan Query Boundary yang Aman

**Status:** Seri 11 dari 16.  
Fokus seri ini: memakai **PostgreSQL window functions** untuk analitik time-series yang lebih maju, tetapi tetap aman untuk production dashboard dan alerting.

PostgreSQL window function menghitung nilai across row set yang berhubungan dengan current row tanpa menggabungkan row menjadi satu output seperti aggregate biasa. Window function harus dipanggil dengan klausa `OVER`. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-window.html?utm_source=chatgpt.com))

---

## 1. Mental Model Window Analytics

Window analytics menjawab pertanyaan seperti:

```text id="woxw4g"
Nilai sebelumnya apa?
Perubahan dari sample sebelumnya berapa?
Rata-rata 10 sample terakhir berapa?
Apakah 3 bucket terakhir melanggar SLA?
Apakah nilai sekarang menyimpang dari baseline?
Berapa rate per detik dari counter?
```

Secara konseptual:

```text id="ph7ld1"
Raw / Rollup Time-Series
        │
        ▼
Ordered rows by entity + time
        │
        ▼
Window functions
        │
        ├─ lag / lead
        ├─ avg over window
        ├─ min / max over window
        ├─ stddev over window
        ├─ row_number / rank
        └─ rolling count/filter
        │
        ▼
Derived signal
        │
        ├─ delta
        ├─ rate
        ├─ moving average
        ├─ rolling SLA breach
        ├─ anomaly score
        └─ trend direction
```

---

## 2. Baseline Table

```sql id="ypz94a"
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_id        uuid not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    value_numeric   numeric,
    value_quality   text not null default 'GOOD',
    time_quality    text not null default 'NORMAL',

    tags            jsonb not null default '{}'::jsonb,

    constraint metric_sample_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            event_time,
            event_id
        )
)
partition by range (event_time);
```

Index pendukung:

```sql id="jrlbk7"
create index metric_sample_window_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time
)
include (
    value_numeric,
    value_quality,
    time_quality
);
```

Untuk window analytics, **ordering by time** adalah inti. Kalau query Anda tidak punya filter entity + time range, window analytics bisa berubah menjadi sort besar yang mahal.

---

# 3. Pattern 1 - `lag()` untuk Nilai Sebelumnya

`lag(value)` mengambil nilai dari row sebelumnya dalam window partition. PostgreSQL mendokumentasikan `lag`, `lead`, `first_value`, `last_value`, `nth_value`, `row_number`, dan fungsi ranking sebagai built-in window functions. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-window.html?utm_source=chatgpt.com))

```sql id="zp0plk"
select
    event_time,
    value_numeric,
    lag(value_numeric) over (
        order by event_time
    ) as previous_value,
    lag(event_time) over (
        order by event_time
    ) as previous_event_time
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
  and value_quality = 'GOOD'
order by event_time;
```

Output konseptual:

```text id="7jf57h"
event_time | value | previous_value
10:00      | 31.2  | null
10:01      | 31.5  | 31.2
10:02      | 31.4  | 31.5
```

---

# 4. Pattern 2 - Delta Antar Sample

Delta adalah selisih nilai sekarang dengan nilai sebelumnya.

```sql id="gtr8po"
with ordered as (
    select
        event_time,
        value_numeric,
        lag(value_numeric) over (
            order by event_time
        ) as previous_value
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from
      and event_time <  :to
      and value_quality = 'GOOD'
)
select
    event_time,
    value_numeric,
    previous_value,
    value_numeric - previous_value as delta_value
from ordered
order by event_time;
```

### Cocok untuk

| Metric | Delta berguna? |
|---|---:|
| temperature gauge | kadang, untuk perubahan cepat |
| counter total request | ya, tapi harus handle reset |
| queue depth | ya, untuk trend naik/turun |
| latency | biasanya bukan delta utama |
| case count cumulative | ya |
| status enum | tidak |

---

# 5. Pattern 3 - Rate-of-Change per Detik

Rate mengubah delta menjadi perubahan per unit waktu.

```sql id="tep1qk"
with ordered as (
    select
        event_time,
        value_numeric,
        lag(value_numeric) over (
            order by event_time
        ) as previous_value,
        lag(event_time) over (
            order by event_time
        ) as previous_event_time
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from
      and event_time <  :to
      and value_quality = 'GOOD'
)
select
    event_time,
    value_numeric,
    previous_value,
    value_numeric - previous_value as delta_value,
    extract(epoch from event_time - previous_event_time) as delta_seconds,
    case
        when previous_value is null then null
        when previous_event_time is null then null
        when event_time = previous_event_time then null
        else
            (value_numeric - previous_value)
            / nullif(extract(epoch from event_time - previous_event_time), 0)
    end as rate_per_second
from ordered
order by event_time;
```

### Production notes

| Guard | Kenapa |
|---|---|
| `nullif(delta_seconds, 0)` | hindari division by zero |
| filter `value_quality = 'GOOD'` | rate dari data buruk menyesatkan |
| deterministic order | tambah `event_id` jika timestamp bisa sama |
| bounded range | window query bisa mahal |
| handle counter reset | counter bisa turun karena reset/restart |

---

# 6. Pattern 4 - Counter Rate dengan Reset Handling

Counter biasanya selalu naik. Jika turun, kemungkinan reset.

```sql id="dig605"
with ordered as (
    select
        event_time,
        value_numeric,
        lag(value_numeric) over (
            order by event_time
        ) as previous_value,
        lag(event_time) over (
            order by event_time
        ) as previous_event_time
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from
      and event_time <  :to
      and value_quality = 'GOOD'
),
delta as (
    select
        event_time,
        value_numeric,
        previous_value,
        previous_event_time,
        case
            when previous_value is null then null
            when value_numeric < previous_value then null -- counter reset
            else value_numeric - previous_value
        end as counter_delta
    from ordered
)
select
    event_time,
    value_numeric,
    counter_delta,
    case
        when counter_delta is null then null
        else counter_delta
             / nullif(extract(epoch from event_time - previous_event_time), 0)
    end as rate_per_second,
    case
        when previous_value is null then 'FIRST_SAMPLE'
        when value_numeric < previous_value then 'COUNTER_RESET'
        else 'OK'
    end as rate_status
from delta
order by event_time;
```

Untuk dashboard, return `rate_status`. Jangan hanya return angka.

---

# 7. Pattern 5 - Moving Average Berdasarkan Jumlah Row

Moving average 10 sample terakhir:

```sql id="dasynn"
select
    event_time,
    value_numeric,
    avg(value_numeric) over (
        order by event_time
        rows between 9 preceding and current row
    ) as moving_avg_10
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
  and value_quality = 'GOOD'
order by event_time;
```

### Arti window frame

```text id="fl4aiq"
rows between 9 preceding and current row
```

Artinya: untuk setiap row, hitung dari 9 row sebelumnya + current row, total maksimum 10 row.

### Cocok jika

| Cocok | Tidak cocok |
|---|---|
| sample interval stabil | sample interval sangat tidak teratur |
| dashboard smoothing | SLA time-based |
| telemetry frequent | data sparse |
| ingin smoothing sederhana | perlu window “15 menit terakhir” |

---

# 8. Pattern 6 - Moving Average Berdasarkan Waktu

Jika sample interval tidak stabil, row-based moving average bisa menipu. Gunakan time bucket dulu, lalu window per bucket.

Contoh dari rollup 1 menit:

```sql id="s21d7u"
select
    bucket_start,
    avg_value,
    avg(avg_value) over (
        order by bucket_start
        rows between 14 preceding and current row
    ) as moving_avg_15m
from metric_rollup_1m
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and bucket_start >= :from
  and bucket_start <  :to
order by bucket_start;
```

Ini lebih stabil karena setiap row = 1 menit.

### Untuk raw data sparse

Lebih baik:

```text id="r5rdwp"
raw sample
  → bucket 1m
  → gap fill
  → moving average over 15 bucket
```

Daripada langsung moving average atas raw rows.

---

# 9. Pattern 7 - Weighted Moving Average dari Rollup

Kalau rollup punya `avg_value` dan `sample_count`, jangan average dari average secara buta. Gunakan weighted average.

```sql id="m33e0r"
select
    bucket_start,
    avg_value,
    sample_count,
    sum(avg_value * sample_count) over (
        order by bucket_start
        rows between 14 preceding and current row
    )
    / nullif(
        sum(sample_count) over (
            order by bucket_start
            rows between 14 preceding and current row
        ),
        0
    ) as weighted_moving_avg_15_bucket
from metric_rollup_1m
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and bucket_start >= :from
  and bucket_start <  :to
order by bucket_start;
```

### Kenapa weighted?

Bucket A punya 100 sample, bucket B punya 2 sample. Average keduanya tidak boleh diberi bobot sama jika ingin rata-rata seluruh sample.

---

# 10. Pattern 8 - Moving Min/Max

```sql id="mmnxis"
select
    event_time,
    value_numeric,
    min(value_numeric) over (
        order by event_time
        rows between 9 preceding and current row
    ) as moving_min_10,
    max(value_numeric) over (
        order by event_time
        rows between 9 preceding and current row
    ) as moving_max_10
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
  and value_quality = 'GOOD'
order by event_time;
```

Cocok untuk melihat local range/spike.

---

# 11. Pattern 9 - Rolling Standard Deviation

Untuk anomaly sederhana, hitung deviasi terhadap window sebelumnya.

```sql id="dg1f0n"
select
    event_time,
    value_numeric,
    avg(value_numeric) over (
        order by event_time
        rows between 29 preceding and current row
    ) as rolling_avg_30,
    stddev_samp(value_numeric) over (
        order by event_time
        rows between 29 preceding and current row
    ) as rolling_stddev_30
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
  and value_quality = 'GOOD'
order by event_time;
```

PostgreSQL aggregate functions seperti `avg`, `min`, `max`, `count`, dan statistical aggregates bisa dipakai sebagai window functions ketika diberi klausa `OVER`. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-window.html?utm_source=chatgpt.com))

---

# 12. Pattern 10 - Z-Score Anomaly Sederhana

Z-score:

```text id="a5jkk6"
z = (current_value - rolling_avg) / rolling_stddev
```

Query:

```sql id="rgwr8k"
with stats as (
    select
        event_time,
        value_numeric,
        avg(value_numeric) over (
            order by event_time
            rows between 29 preceding and current row
        ) as rolling_avg_30,
        stddev_samp(value_numeric) over (
            order by event_time
            rows between 29 preceding and current row
        ) as rolling_stddev_30,
        count(*) over (
            order by event_time
            rows between 29 preceding and current row
        ) as window_sample_count
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from
      and event_time <  :to
      and value_quality = 'GOOD'
)
select
    event_time,
    value_numeric,
    rolling_avg_30,
    rolling_stddev_30,
    case
        when window_sample_count < 10 then null
        when rolling_stddev_30 is null then null
        when rolling_stddev_30 = 0 then null
        else (value_numeric - rolling_avg_30) / rolling_stddev_30
    end as z_score,
    case
        when window_sample_count < 10 then 'INSUFFICIENT_DATA'
        when rolling_stddev_30 is null or rolling_stddev_30 = 0 then 'NO_VARIANCE'
        when abs((value_numeric - rolling_avg_30) / rolling_stddev_30) >= 3 then 'ANOMALY'
        else 'NORMAL'
    end as anomaly_status
from stats
order by event_time;
```

### Production caution

Z-score sederhana bukan “AI anomaly detection”. Ia berguna sebagai guard awal, tetapi bisa salah pada data musiman, data non-normal, atau distribusi yang punya outlier berat.

---

# 13. Pattern 11 - Rolling SLA Breach

Contoh SLA: latency p95 harus < 500 ms selama 3 bucket berturut-turut.

Misalnya dari rollup 1 menit:

```sql id="j3om0t"
with evaluated as (
    select
        bucket_start,
        p95_value,
        case
            when p95_value is null then 0
            when p95_value > 500 then 1
            else 0
        end as breach_flag
    from metric_rollup_1m
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = 'request_latency_ms'
      and bucket_start >= :from
      and bucket_start <  :to
),
rolling as (
    select
        bucket_start,
        p95_value,
        breach_flag,
        sum(breach_flag) over (
            order by bucket_start
            rows between 2 preceding and current row
        ) as breach_count_3_bucket
    from evaluated
)
select
    bucket_start,
    p95_value,
    breach_flag,
    breach_count_3_bucket,
    case
        when breach_count_3_bucket = 3 then 'SUSTAINED_BREACH'
        when breach_flag = 1 then 'SINGLE_BUCKET_BREACH'
        else 'OK'
    end as sla_status
from rolling
order by bucket_start;
```

### Kenapa rolling breach?

Karena alert berdasarkan satu bucket sering noisy. Rolling breach membantu membedakan spike sesaat dari gangguan berkelanjutan.

---

# 14. Pattern 12 - Consecutive Breach Streak

Untuk menghitung streak breach berturut-turut:

```sql id="jpp0tr"
with evaluated as (
    select
        bucket_start,
        p95_value,
        case
            when p95_value > 500 then 1
            else 0
        end as breach_flag
    from metric_rollup_1m
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = 'request_latency_ms'
      and bucket_start >= :from
      and bucket_start <  :to
),
grouped as (
    select
        *,
        sum(case when breach_flag = 0 then 1 else 0 end) over (
            order by bucket_start
        ) as ok_group
    from evaluated
),
streaked as (
    select
        *,
        case
            when breach_flag = 1 then
                count(*) over (
                    partition by ok_group
                    order by bucket_start
                    rows between unbounded preceding and current row
                )
            else 0
        end as consecutive_breach_count
    from grouped
)
select
    bucket_start,
    p95_value,
    breach_flag,
    consecutive_breach_count,
    case
        when consecutive_breach_count >= 3 then 'SUSTAINED_BREACH'
        when breach_flag = 1 then 'BREACH'
        else 'OK'
    end as sla_status
from streaked
order by bucket_start;
```

---

# 15. Pattern 13 - Rolling Error Rate

Contoh rollup punya `request_count` dan `error_count`.

```sql id="oqmsj7"
select
    bucket_start,
    request_count,
    error_count,
    error_count::numeric / nullif(request_count, 0) as error_rate,
    sum(error_count) over (
        order by bucket_start
        rows between 4 preceding and current row
    )
    / nullif(
        sum(request_count) over (
            order by bucket_start
            rows between 4 preceding and current row
        ),
        0
    ) as rolling_error_rate_5_bucket
from service_request_rollup_1m
where tenant_id = :tenantId
  and service_name = :serviceName
  and bucket_start >= :from
  and bucket_start <  :to
order by bucket_start;
```

### Jangan average error rate biasa

Anti-pattern:

```sql id="f1nj7x"
avg(error_count::numeric / request_count)
```

Lebih benar:

```sql id="n7nqec"
sum(error_count)::numeric / nullif(sum(request_count), 0)
```

Karena bucket dengan 10 request dan bucket dengan 10.000 request tidak boleh punya bobot sama.

---

# 16. Pattern 14 - Rolling Availability

Misalnya availability per bucket dihitung dari heartbeat completeness.

```sql id="wlyb2e"
select
    bucket_start,
    completeness_ratio,
    case
        when completeness_ratio >= 0.95 then 1
        else 0
    end as available_flag,
    avg(
        case
            when completeness_ratio >= 0.95 then 1.0
            else 0.0
        end
    ) over (
        order by bucket_start
        rows between 59 preceding and current row
    ) as rolling_availability_60_bucket
from metric_completeness_1m
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and bucket_start >= :from
  and bucket_start <  :to
order by bucket_start;
```

Jika bucket = 1 menit, `rolling_availability_60_bucket` mewakili rolling 60 menit.

---

# 17. Pattern 15 - Trend Direction

Sederhana: bandingkan moving average sekarang vs moving average sebelumnya.

```sql id="cgkou1"
with ma as (
    select
        bucket_start,
        avg_value,
        avg(avg_value) over (
            order by bucket_start
            rows between 4 preceding and current row
        ) as moving_avg_5
    from metric_rollup_1m
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and bucket_start >= :from
      and bucket_start <  :to
),
trend as (
    select
        bucket_start,
        avg_value,
        moving_avg_5,
        lag(moving_avg_5) over (
            order by bucket_start
        ) as previous_moving_avg_5
    from ma
)
select
    bucket_start,
    avg_value,
    moving_avg_5,
    previous_moving_avg_5,
    case
        when previous_moving_avg_5 is null then 'UNKNOWN'
        when moving_avg_5 > previous_moving_avg_5 then 'UP'
        when moving_avg_5 < previous_moving_avg_5 then 'DOWN'
        else 'FLAT'
    end as trend_direction
from trend
order by bucket_start;
```

---

# 18. Pattern 16 - Percentile-Based Window Analytics

PostgreSQL punya ordered-set aggregate `percentile_cont`, yang menghitung continuous percentile untuk fraction tertentu berdasarkan ordered values. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-aggregate.html?utm_source=chatgpt.com))

Untuk percentile per bucket:

```sql id="kzwm7v"
select
    date_bin(
        interval '15 minutes',
        event_time,
        timestamptz '2026-01-01 00:00:00+00'
    ) as bucket_start,
    percentile_cont(0.95) within group (
        order by value_numeric
    ) as p95_value
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = 'request_latency_ms'
  and event_time >= :from
  and event_time <  :to
  and value_quality = 'GOOD'
group by bucket_start
order by bucket_start;
```

### Important

Percentile dari percentile tidak bisa digabung sederhana.

Anti-pattern:

```sql id="dglk9w"
avg(p95_value)
```

Untuk multi-bucket percentile yang akurat, hitung dari raw values, atau gunakan pendekatan histogram/approximate percentile yang memang mergeable.

---

# 19. Pattern 17 - Comparing Current Window vs Previous Window

Contoh: rata-rata 15 menit terakhir dibanding 15 menit sebelumnya.

```sql id="j4qqia"
with current_window as (
    select
        avg(value_numeric) as current_avg,
        count(*) as current_count
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :now::timestamptz - interval '15 minutes'
      and event_time <  :now::timestamptz
      and value_quality = 'GOOD'
),
previous_window as (
    select
        avg(value_numeric) as previous_avg,
        count(*) as previous_count
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :now::timestamptz - interval '30 minutes'
      and event_time <  :now::timestamptz - interval '15 minutes'
      and value_quality = 'GOOD'
)
select
    current_avg,
    previous_avg,
    current_count,
    previous_count,
    current_avg - previous_avg as avg_delta,
    case
        when previous_avg is null or previous_avg = 0 then null
        else (current_avg - previous_avg) / previous_avg
    end as relative_change
from current_window, previous_window;
```

Ini sering lebih murah dan lebih jelas daripada window function jika hanya perlu dua window agregat.

---

# 20. Pattern 18 - Multi-Entity Window Analytics

Untuk banyak source, gunakan `partition by source_id`.

```sql id="bnb808"
select
    source_id,
    event_time,
    value_numeric,
    avg(value_numeric) over (
        partition by source_id
        order by event_time
        rows between 9 preceding and current row
    ) as moving_avg_10
from metric_sample
where tenant_id = :tenantId
  and source_id = any(:sourceIds::bigint[])
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
  and value_quality = 'GOOD'
order by source_id, event_time;
```

### Guard

| Guard | Kenapa |
|---|---|
| batasi jumlah source | output bisa meledak |
| batasi range | sort/window besar mahal |
| pakai rollup untuk range panjang | raw terlalu berat |
| partition by entity | jangan campur source |
| order deterministic | tambah `event_id` jika perlu |

---

# 21. Boundary Problem: Window Butuh Data Sebelum `from`

Moving average di awal range bisa salah karena tidak punya data sebelum `from`.

Contoh ingin moving average 10 sample mulai jam 10:00. Row jam 10:00 butuh 9 sample sebelum jam 10:00.

Solusi: query internal mengambil lookback, output tetap difilter.

```sql id="xm8ozb"
with base as (
    select
        event_time,
        value_numeric
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from::timestamptz - interval '1 hour'
      and event_time <  :to
      and value_quality = 'GOOD'
),
calculated as (
    select
        event_time,
        value_numeric,
        avg(value_numeric) over (
            order by event_time
            rows between 9 preceding and current row
        ) as moving_avg_10
    from base
)
select
    event_time,
    value_numeric,
    moving_avg_10
from calculated
where event_time >= :from
order by event_time;
```

### Invariant

```text id="q7jkov"
Filter calculation window boleh lebih luas daripada output window.
Output tetap hanya [from, to).
```

---

# 22. Boundary Problem untuk Rate

Rate pada first row dalam output butuh previous sample sebelum `from`.

```sql id="4s9hpl"
with base as (
    select
        event_time,
        value_numeric
    from metric_sample
    where tenant_id = :tenantId
      and source_id = :sourceId
      and metric_name = :metricName
      and event_time >= :from::timestamptz - interval '10 minutes'
      and event_time <  :to
      and value_quality = 'GOOD'
),
ordered as (
    select
        event_time,
        value_numeric,
        lag(value_numeric) over (
            order by event_time
        ) as previous_value,
        lag(event_time) over (
            order by event_time
        ) as previous_event_time
    from base
)
select
    event_time,
    value_numeric,
    case
        when previous_value is null then null
        when value_numeric < previous_value then null
        else
            (value_numeric - previous_value)
            / nullif(extract(epoch from event_time - previous_event_time), 0)
    end as rate_per_second
from ordered
where event_time >= :from
order by event_time;
```

---

# 23. Using Rollup Table for Window Analytics

Untuk dashboard production, window analytics sering lebih aman atas rollup.

```sql id="gb6bpt"
select
    bucket_start,
    avg_value,
    avg(avg_value) over (
        order by bucket_start
        rows between 14 preceding and current row
    ) as moving_avg_15_bucket,
    max(max_value) over (
        order by bucket_start
        rows between 14 preceding and current row
    ) as rolling_max_15_bucket
from metric_rollup_1m
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and bucket_start >= :from
  and bucket_start <  :to
order by bucket_start;
```

### Kenapa rollup lebih aman?

| Raw window | Rollup window |
|---|---|
| row count bisa sangat besar | row count terkendali |
| sample interval tidak stabil | bucket stabil |
| query mahal | lebih predictable |
| raw quality rumit | quality sudah diringkas |
| cocok investigasi detail | cocok dashboard |

---

# 24. MyBatis Mapper untuk Window Analytics

Pisahkan query berdasarkan use case. Jangan satu endpoint/query dinamis untuk semua analytics.

```java id="icql8p"
public interface MetricAnalyticsMapper {

    List<MovingAveragePoint> findMovingAverage(
        @Param("tenantId") long tenantId,
        @Param("sourceId") long sourceId,
        @Param("metricName") String metricName,
        @Param("from") Instant from,
        @Param("to") Instant to,
        @Param("lookback") String lookback
    );

    List<RatePoint> findCounterRate(
        @Param("tenantId") long tenantId,
        @Param("sourceId") long sourceId,
        @Param("metricName") String metricName,
        @Param("from") Instant from,
        @Param("to") Instant to,
        @Param("lookback") String lookback
    );
}
```

XML moving average:

```xml id="ydr13l"
<select id="findMovingAverage" resultType="com.example.MovingAveragePoint">
    with base as (
        select
            event_time,
            value_numeric
        from metric_sample
        where tenant_id = #{tenantId}
          and source_id = #{sourceId}
          and metric_name = #{metricName}
          and event_time >= #{from}::timestamptz - #{lookback}::interval
          and event_time &lt; #{to}
          and value_quality = 'GOOD'
    ),
    calculated as (
        select
            event_time,
            value_numeric,
            avg(value_numeric) over (
                order by event_time
                rows between 9 preceding and current row
            ) as moving_avg_10
        from base
    )
    select
        event_time as eventTime,
        value_numeric as value,
        moving_avg_10 as movingAverage
    from calculated
    where event_time >= #{from}
    order by event_time
</select>
```

---

# 25. Jersey API untuk Analytics

```java id="tgypgx"
@GET
@Path("/v1/metrics/{sourceId}/{metricName}/analytics/moving-average")
@Produces(MediaType.APPLICATION_JSON)
public Response movingAverage(
    @PathParam("sourceId") long sourceId,
    @PathParam("metricName") String metricName,
    @QueryParam("from") String fromText,
    @QueryParam("to") String toText,
    @QueryParam("window") @DefaultValue("10") int window
) {
    Instant from = OffsetDateTime.parse(fromText).toInstant();
    Instant to = OffsetDateTime.parse(toText).toInstant();

    if (!from.isBefore(to)) {
        throw new BadRequestException("from must be before to");
    }

    if (window < 2 || window > 500) {
        throw new BadRequestException("window must be between 2 and 500");
    }

    Duration range = Duration.between(from, to);
    if (range.compareTo(Duration.ofDays(7)) > 0) {
        throw new BadRequestException("raw analytics range too large; use rollup analytics");
    }

    return Response.ok(
        metricAnalyticsService.movingAverage(sourceId, metricName, from, to, window)
    ).build();
}
```

### Guard yang wajib

| Guard | Target |
|---|---|
| `from/to` wajib | mencegah scan besar |
| max raw analytics range | misalnya 1-7 hari |
| max window size | misalnya 500 rows/buckets |
| metric kind validation | counter/gauge/status beda |
| source count limit | multi-entity query dibatasi |
| rollup fallback | range panjang wajib rollup |
| timeout | query analytics bisa berat |
| output limit | lindungi API memory |

---

# 26. Alert Evaluation: Jangan Selalu dari API Query

Untuk alerting production, sebaiknya punya job/projection khusus, bukan setiap alert menjalankan query raw kompleks.

```text id="b28n36"
raw metric
  → rollup 1m
  → alert evaluation job
  → alert state table
  → notification/workflow
```

Alert state table:

```sql id="yxa3of"
create table metric_alert_state (
    tenant_id       bigint not null,
    source_id       bigint not null,
    metric_name     text not null,
    rule_id         text not null,

    status          text not null,
    last_evaluated_bucket timestamptz not null,
    breach_count    integer not null default 0,
    last_value      numeric,
    updated_at      timestamptz not null default clock_timestamp(),

    constraint metric_alert_state_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            rule_id
        ),

    constraint metric_alert_state_status_chk
        check (status in ('OK', 'BREACHING', 'INSUFFICIENT_DATA', 'STALE'))
);
```

---

# 27. Persisting Derived Analytics

Kalau query analytics sering dipakai, simpan hasilnya.

```sql id="9w3090"
create table metric_analytics_1m (
    tenant_id       bigint not null,
    source_id       bigint not null,
    metric_name     text not null,
    bucket_start    timestamptz not null,

    avg_value       numeric,
    moving_avg_15m  numeric,
    rolling_stddev_15m numeric,
    z_score         numeric,
    anomaly_status  text,

    calculated_at   timestamptz not null default clock_timestamp(),

    constraint metric_analytics_1m_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            bucket_start
        )
);
```

### Kapan persist?

| Persist jika | Hitung on-demand jika |
|---|---|
| dashboard populer | query jarang |
| alerting butuh stabil | investigasi ad-hoc |
| range besar | range pendek |
| query mahal | query ringan |
| banyak user | satu-dua operator |

---

# 28. Performance Validation dengan `EXPLAIN`

Gunakan:

```sql id="rbcl6w"
explain (analyze, buffers)
with base as (
    select
        event_time,
        value_numeric
    from metric_sample
    where tenant_id = 10
      and source_id = 1001
      and metric_name = 'temperature_celsius'
      and event_time >= timestamptz '2026-07-15 00:00:00+00'
      and event_time <  timestamptz '2026-07-16 00:00:00+00'
      and value_quality = 'GOOD'
)
select
    event_time,
    value_numeric,
    avg(value_numeric) over (
        order by event_time
        rows between 9 preceding and current row
    ) as moving_avg_10
from base
order by event_time;
```

`EXPLAIN ANALYZE` benar-benar mengeksekusi statement dan menambahkan runtime statistics; opsi `BUFFERS` memberi detail operasi buffer/I/O, dan pada dokumentasi PostgreSQL current, `ANALYZE` secara implisit mengaktifkan buffer reporting kecuali dimatikan. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-explain.html?utm_source=chatgpt.com))

Yang dicek:

| Check | Target |
|---|---|
| partition pruning | hanya partition relevan |
| sort size | tidak spill besar ke disk |
| buffers read | tidak membaca terlalu banyak page |
| execution time | sesuai SLA |
| rows estimate | tidak meleset jauh |
| temp files | warning untuk sort/window besar |
| index scan | sesuai query selektivitas |

---

# 29. Window Analytics Decision Matrix

| Kebutuhan | Pattern | Source yang disarankan |
|---|---|---|
| nilai sebelumnya | `lag()` | raw atau rollup |
| nilai berikutnya | `lead()` | raw atau rollup |
| delta gauge | current - previous | raw bounded |
| counter rate | delta + reset guard | raw atau rollup counter |
| smoothing | moving average | rollup untuk dashboard |
| spike detection | rolling max / z-score | rollup |
| SLA sustained breach | rolling sum/streak | rollup |
| error rate | weighted rolling rate | service rollup |
| availability | rolling average flag | completeness rollup |
| anomaly simple | z-score | rollup + threshold |
| detailed investigation | raw window query | bounded range |
| production alert | persisted alert state | rollup/projection |

---

# 30. Anti-Patterns

| Anti-pattern | Dampak |
|---|---|
| Window analytics tanpa `from/to` | scan/sort besar |
| Moving average raw untuk range panjang | query mahal |
| Row-based average pada sample interval tidak stabil | hasil bias |
| Average dari average tanpa sample weighting | angka salah |
| Average error rate antar bucket | salah bobot |
| Percentile dari percentile dirata-rata | percentile salah |
| Counter rate tanpa reset handling | spike palsu |
| LKV/stale value dipakai untuk alert numeric | false alert |
| Tidak ambil lookback sebelum `from` | awal grafik salah |
| Multi-source window tanpa limit | output meledak |
| Query alert langsung ke raw table untuk semua rule | DB overload |
| Dynamic query MyBatis terlalu generik | plan sulit dikontrol |
| Tidak cek `EXPLAIN ANALYZE` | query bisa tidak aman |
| Tidak return status seperti `COUNTER_RESET`/`INSUFFICIENT_DATA` | dashboard menipu |

---

# 31. Production Checklist

| Checklist | Target |
|---|---|
| Window query selalu bounded by time | Ya |
| Entity filter jelas | tenant/source/metric |
| Query memakai order deterministic | `event_time`, plus `event_id` jika perlu |
| Lookback ditambahkan untuk moving/rate awal range | Ya |
| Counter reset ditangani | Ya |
| Missing/stale/insufficient data diberi status | Ya |
| Long range pakai rollup | Ya |
| Error rate dihitung weighted | Ya |
| Average dari rollup weighted by count | Ya |
| Alert pakai projection/state | Ya |
| API punya max range/window/source count | Ya |
| `EXPLAIN (ANALYZE, BUFFERS)` dicek | Ya |
| Slow analytics dimaterialize | Ya |
| MyBatis query dipisah per use case | Ya |

---

# 32. Recommended Baseline

Untuk production awal:

```text id="1pdgvf"
Dashboard:
- moving average dari rollup table
- z-score sederhana dari rollup, bukan raw
- max bucket/window count dibatasi
- return analytics status, bukan hanya angka

Alerting:
- pakai rollup 1m/5m
- rolling breach dengan sustained threshold
- simpan alert state
- missing/stale data jadi status sendiri

Investigation:
- raw window query hanya untuk range pendek
- wajib source_id + metric_name + from/to
- EXPLAIN query sebelum dijadikan endpoint umum
```

---

# Seri 11/16 Selesai

**Seri 11 selesai.**  
Materi ini menutup window analytics untuk PostgreSQL time-series: `lag/lead`, delta, rate-of-change, counter reset, moving average, weighted moving average, rolling min/max/stddev, z-score anomaly, rolling SLA breach, error rate, availability, trend direction, query boundary, MyBatis/Jersey integration, dan production guard.

## Rekomendasi materi selanjutnya

Lanjut ke **Seri 12/16 - Materialized View & Native Rollup Strategy: materialized view, refresh strategy, concurrent refresh, rollup table manual, dirty bucket, late data refresh, dan operational safety**.

---

**Sources:**

- [Documentation: 18: 9.22. Window Functions](https://www.postgresql.org/docs/current/functions-window.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:55:53 PM

# PostgreSQL Time-Series Database - Seri 12/16  
## Materialized View & Native Rollup Strategy: Refresh, Concurrent Refresh, Manual Rollup Table, Dirty Bucket, Late Data, dan Operational Safety

**Status:** Seri 12 dari 16.  
Fokus seri ini: strategi native PostgreSQL untuk menyimpan hasil agregasi time-series agar dashboard/reporting tidak terus-menerus menghitung dari raw table besar.

---

## 1. Mental Model

Untuk time-series, raw table biasanya besar dan append-heavy. Query dashboard seperti:

```sql
select
    date_bin(interval '15 minutes', event_time, :origin) as bucket_start,
    avg(value_numeric),
    min(value_numeric),
    max(value_numeric),
    count(*)
from metric_sample
where event_time >= :from
  and event_time < :to
group by bucket_start;
```

akan mahal jika dijalankan terus-menerus ke raw table. Solusinya adalah **pre-aggregation**.

Ada dua pendekatan native PostgreSQL:

```text
Native PostgreSQL Rollup Strategy
│
├─ A. Materialized View
│  ├─ hasil query disimpan secara fisik
│  ├─ refresh periodik
│  ├─ cocok untuk report periodik/stabil
│  └─ kurang fleksibel untuk partial/incremental refresh kompleks
│
└─ B. Manual Rollup Table
   ├─ table agregasi biasa
   ├─ refresh per window/bucket
   ├─ lebih cocok untuk time-series production
   ├─ bisa handle late data via dirty bucket
   └─ lebih mudah dikontrol secara operasional
```

PostgreSQL materialized view menyimpan hasil query dalam bentuk table-like storage, berbeda dari view biasa yang menjalankan query setiap kali dibaca. `CREATE MATERIALIZED VIEW` menjalankan query dan menggunakan hasilnya untuk mengisi materialized view saat dibuat, kecuali memakai `WITH NO DATA`. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-creatematerializedview.html?utm_source=chatgpt.com))

---

## 2. Kapan Pakai Materialized View vs Manual Rollup Table?

| Kebutuhan | Materialized view | Manual rollup table |
|---|---:|---:|
| Report periodik | Bagus | Bagus |
| Dashboard near-real-time | Kurang ideal | Lebih cocok |
| Refresh seluruh hasil | Bagus | Bisa, tapi tidak perlu |
| Refresh hanya window terdampak | Sulit | Bagus |
| Late-arriving data | Perlu refresh ulang luas | Bisa dirty bucket |
| Backfill historis | Bisa berat | Bisa refresh affected window |
| Idempotent partial recompute | Terbatas | Bagus |
| Kontrol status refresh | Terbatas | Bagus |
| Operational audit | Perlu tambahan | Mudah dengan job table |
| Query sederhana dan stabil | Bagus | Bagus |
| High-volume time-series | Hati-hati | Lebih fleksibel |

**Rekomendasi praktis:**  
Untuk PostgreSQL time-series production, gunakan **manual rollup table** sebagai default. Gunakan **materialized view** untuk report periodik yang definisinya stabil dan refresh-nya tidak terlalu sering.

---

# 3. Baseline Raw Table

```sql
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_id        uuid not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    value_numeric   numeric,
    value_quality   text not null default 'GOOD',
    time_quality    text not null default 'NORMAL',

    tags            jsonb not null default '{}'::jsonb,

    constraint metric_sample_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            event_time,
            event_id
        )
)
partition by range (event_time);
```

Index:

```sql
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time
)
include (
    value_numeric,
    value_quality,
    time_quality
);

create index metric_sample_event_time_brin_idx
on metric_sample using brin (
    event_time
);
```

---

# 4. Pattern A - Materialized View

## 4.1 Create materialized view

```sql
create materialized view metric_rollup_1h_mv as
select
    tenant_id,
    source_id,
    metric_name,
    date_trunc('hour', event_time) as bucket_start,

    count(*) as sample_count,
    count(*) filter (where value_quality = 'GOOD') as good_count,
    count(*) filter (where time_quality = 'LATE') as late_count,

    avg(value_numeric) filter (where value_quality = 'GOOD') as avg_value,
    min(value_numeric) filter (where value_quality = 'GOOD') as min_value,
    max(value_numeric) filter (where value_quality = 'GOOD') as max_value,
    sum(value_numeric) filter (where value_quality = 'GOOD') as sum_value,

    clock_timestamp() as calculated_at
from metric_sample
group by
    tenant_id,
    source_id,
    metric_name,
    bucket_start
with no data;
```

`WITH NO DATA` membuat materialized view belum terisi, sehingga harus di-refresh sebelum bisa dibaca. Ini berguna saat membuat view besar agar creation tidak langsung menjalankan query berat. PostgreSQL `REFRESH MATERIALIZED VIEW` dipakai untuk mengganti isi materialized view dengan hasil query underlying-nya. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-refreshmaterializedview.html?utm_source=chatgpt.com))

---

## 4.2 Unique index untuk concurrent refresh

```sql
create unique index metric_rollup_1h_mv_uniq
on metric_rollup_1h_mv (
    tenant_id,
    source_id,
    metric_name,
    bucket_start
);
```

`REFRESH MATERIALIZED VIEW CONCURRENTLY` hanya boleh digunakan jika materialized view sudah populated dan punya setidaknya satu unique index yang memakai nama column saja, mencakup semua row, bukan expression index dan bukan partial index. PostgreSQL juga membatasi hanya satu refresh pada satu materialized view yang sama dalam satu waktu. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-refreshmaterializedview.html?utm_source=chatgpt.com))

---

## 4.3 Initial refresh

```sql
refresh materialized view metric_rollup_1h_mv;
```

Setelah itu, untuk refresh tanpa memblokir concurrent select:

```sql
refresh materialized view concurrently metric_rollup_1h_mv;
```

### Catatan production

| Mode | Dampak |
|---|---|
| `REFRESH MATERIALIZED VIEW` | lebih sederhana, tetapi bisa mengunci pembacaan |
| `REFRESH MATERIALIZED VIEW CONCURRENTLY` | pembaca tetap bisa membaca, tetapi butuh unique index dan view sudah populated |
| Full refresh | menghitung ulang semua data |
| Frequent refresh | bisa mahal untuk raw table besar |

---

## 4.4 Query materialized view

```sql
select
    bucket_start,
    avg_value,
    min_value,
    max_value,
    sample_count,
    good_count,
    late_count
from metric_rollup_1h_mv
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and bucket_start >= :from
  and bucket_start <  :to
order by bucket_start;
```

Index tambahan untuk read:

```sql
create index metric_rollup_1h_mv_lookup_idx
on metric_rollup_1h_mv (
    tenant_id,
    source_id,
    metric_name,
    bucket_start
)
include (
    avg_value,
    min_value,
    max_value,
    sample_count
);
```

`CREATE INDEX` bisa dibuat pada table maupun materialized view, dan index digunakan untuk meningkatkan performa query jika sesuai dengan predicate/order yang dipakai. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createindex.html?utm_source=chatgpt.com))

---

# 5. Kelemahan Materialized View untuk Time-Series

Materialized view native PostgreSQL tidak otomatis incremental per bucket. Refresh normal mengganti isi view dengan hasil query underlying. Untuk time-series besar dengan late data dan backfill, ini bisa terlalu mahal jika setiap perubahan kecil memaksa refresh besar. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-refreshmaterializedview.html?utm_source=chatgpt.com))

| Problem | Dampak |
|---|---|
| Full refresh mahal | raw table besar discan ulang |
| Late data | bucket lama perlu refresh ulang |
| Backfill | refresh bisa menyentuh range besar |
| Tidak ada built-in dirty bucket | harus custom tracking |
| Concurrent refresh tetap resource-heavy | pembaca tidak blocked, tapi DB tetap kerja berat |
| Refresh tidak per-window | sulit near-real-time |

Karena itu, untuk production time-series, manual rollup table biasanya lebih defensible.

---

# 6. Pattern B - Manual Rollup Table

## 6.1 Rollup table 15 menit

```sql
create table metric_rollup_15m (
    tenant_id      bigint not null,
    source_id      bigint not null,
    metric_name    text not null,

    bucket_start   timestamptz not null,
    bucket_end     timestamptz not null,

    sample_count   bigint not null,
    good_count     bigint not null,
    bad_count      bigint not null,
    late_count     bigint not null,

    avg_value      numeric,
    min_value      numeric,
    max_value      numeric,
    sum_value      numeric,

    calculated_at  timestamptz not null default clock_timestamp(),

    constraint metric_rollup_15m_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            bucket_start
        ),

    constraint metric_rollup_15m_bucket_chk
        check (bucket_end > bucket_start)
);
```

Index:

```sql
create index metric_rollup_15m_lookup_idx
on metric_rollup_15m (
    tenant_id,
    source_id,
    metric_name,
    bucket_start
)
include (
    avg_value,
    min_value,
    max_value,
    sample_count,
    good_count,
    late_count
);
```

---

## 6.2 Refresh satu window

```sql
insert into metric_rollup_15m (
    tenant_id,
    source_id,
    metric_name,
    bucket_start,
    bucket_end,

    sample_count,
    good_count,
    bad_count,
    late_count,

    avg_value,
    min_value,
    max_value,
    sum_value,
    calculated_at
)
select
    tenant_id,
    source_id,
    metric_name,

    date_bin(
        interval '15 minutes',
        event_time,
        timestamptz '2026-01-01 00:00:00+00'
    ) as bucket_start,

    date_bin(
        interval '15 minutes',
        event_time,
        timestamptz '2026-01-01 00:00:00+00'
    ) + interval '15 minutes' as bucket_end,

    count(*) as sample_count,
    count(*) filter (where value_quality = 'GOOD') as good_count,
    count(*) filter (where value_quality <> 'GOOD') as bad_count,
    count(*) filter (where time_quality = 'LATE') as late_count,

    avg(value_numeric) filter (where value_quality = 'GOOD') as avg_value,
    min(value_numeric) filter (where value_quality = 'GOOD') as min_value,
    max(value_numeric) filter (where value_quality = 'GOOD') as max_value,
    sum(value_numeric) filter (where value_quality = 'GOOD') as sum_value,

    clock_timestamp() as calculated_at
from metric_sample
where event_time >= :from
  and event_time <  :to
group by
    tenant_id,
    source_id,
    metric_name,
    bucket_start
on conflict (
    tenant_id,
    source_id,
    metric_name,
    bucket_start
)
do update set
    bucket_end = excluded.bucket_end,
    sample_count = excluded.sample_count,
    good_count = excluded.good_count,
    bad_count = excluded.bad_count,
    late_count = excluded.late_count,
    avg_value = excluded.avg_value,
    min_value = excluded.min_value,
    max_value = excluded.max_value,
    sum_value = excluded.sum_value,
    calculated_at = clock_timestamp();
```

### Kenapa `ON CONFLICT DO UPDATE`?

Karena refresh rollup harus **idempotent**. Job boleh dijalankan ulang untuk window yang sama dan hasil akhirnya tetap benar.

---

# 7. PL/pgSQL Function untuk Refresh Window

```sql
create or replace function refresh_metric_rollup_15m_window(
    p_from timestamptz,
    p_to   timestamptz
)
returns void
language plpgsql
as $$
begin
    if p_to <= p_from then
        raise exception 'p_to must be greater than p_from';
    end if;

    insert into metric_rollup_15m (
        tenant_id,
        source_id,
        metric_name,
        bucket_start,
        bucket_end,
        sample_count,
        good_count,
        bad_count,
        late_count,
        avg_value,
        min_value,
        max_value,
        sum_value,
        calculated_at
    )
    select
        tenant_id,
        source_id,
        metric_name,

        date_bin(
            interval '15 minutes',
            event_time,
            timestamptz '2026-01-01 00:00:00+00'
        ) as bucket_start,

        date_bin(
            interval '15 minutes',
            event_time,
            timestamptz '2026-01-01 00:00:00+00'
        ) + interval '15 minutes' as bucket_end,

        count(*) as sample_count,
        count(*) filter (where value_quality = 'GOOD') as good_count,
        count(*) filter (where value_quality <> 'GOOD') as bad_count,
        count(*) filter (where time_quality = 'LATE') as late_count,

        avg(value_numeric) filter (where value_quality = 'GOOD') as avg_value,
        min(value_numeric) filter (where value_quality = 'GOOD') as min_value,
        max(value_numeric) filter (where value_quality = 'GOOD') as max_value,
        sum(value_numeric) filter (where value_quality = 'GOOD') as sum_value,

        clock_timestamp()
    from metric_sample
    where event_time >= p_from
      and event_time <  p_to
    group by
        tenant_id,
        source_id,
        metric_name,
        bucket_start
    on conflict (
        tenant_id,
        source_id,
        metric_name,
        bucket_start
    )
    do update set
        bucket_end = excluded.bucket_end,
        sample_count = excluded.sample_count,
        good_count = excluded.good_count,
        bad_count = excluded.bad_count,
        late_count = excluded.late_count,
        avg_value = excluded.avg_value,
        min_value = excluded.min_value,
        max_value = excluded.max_value,
        sum_value = excluded.sum_value,
        calculated_at = clock_timestamp();
end;
$$;
```

Run:

```sql
select refresh_metric_rollup_15m_window(
    timestamptz '2026-07-15 10:00:00+00',
    timestamptz '2026-07-15 11:00:00+00'
);
```

---

# 8. Delete Empty Buckets Saat Refresh

Masalah: jika sebelumnya bucket punya data, lalu raw data dikoreksi/dihapus/reprocessed sehingga bucket menjadi kosong, `INSERT ... SELECT` tidak akan menghasilkan row untuk bucket itu. Rollup lama bisa tertinggal.

Solusi: hapus affected bucket dulu, lalu insert ulang.

```sql
create or replace function refresh_metric_rollup_15m_window_replace(
    p_from timestamptz,
    p_to   timestamptz
)
returns void
language plpgsql
as $$
begin
    if p_to <= p_from then
        raise exception 'p_to must be greater than p_from';
    end if;

    delete from metric_rollup_15m
    where bucket_start >= p_from
      and bucket_start <  p_to;

    insert into metric_rollup_15m (
        tenant_id,
        source_id,
        metric_name,
        bucket_start,
        bucket_end,
        sample_count,
        good_count,
        bad_count,
        late_count,
        avg_value,
        min_value,
        max_value,
        sum_value,
        calculated_at
    )
    select
        tenant_id,
        source_id,
        metric_name,
        date_bin(
            interval '15 minutes',
            event_time,
            timestamptz '2026-01-01 00:00:00+00'
        ) as bucket_start,
        date_bin(
            interval '15 minutes',
            event_time,
            timestamptz '2026-01-01 00:00:00+00'
        ) + interval '15 minutes' as bucket_end,

        count(*) as sample_count,
        count(*) filter (where value_quality = 'GOOD') as good_count,
        count(*) filter (where value_quality <> 'GOOD') as bad_count,
        count(*) filter (where time_quality = 'LATE') as late_count,

        avg(value_numeric) filter (where value_quality = 'GOOD') as avg_value,
        min(value_numeric) filter (where value_quality = 'GOOD') as min_value,
        max(value_numeric) filter (where value_quality = 'GOOD') as max_value,
        sum(value_numeric) filter (where value_quality = 'GOOD') as sum_value,

        clock_timestamp()
    from metric_sample
    where event_time >= p_from
      and event_time <  p_to
    group by
        tenant_id,
        source_id,
        metric_name,
        bucket_start;
end;
$$;
```

### Trade-off

| Approach | Cocok |
|---|---|
| `ON CONFLICT DO UPDATE` | normal append-only refresh |
| delete + insert window | reprocessing/correction/backfill yang bisa mengubah bucket menjadi kosong |
| delete per tenant/source/metric | lebih aman untuk large rollup table |
| full delete window semua tenant | sederhana, tapi bisa mahal |

---

# 9. Dirty Bucket Pattern

Late-arriving data, correction, atau backfill harus menandai bucket yang perlu dihitung ulang.

```sql
create table metric_rollup_dirty_bucket (
    tenant_id       bigint not null,
    source_id       bigint not null,
    metric_name     text not null,

    bucket_start    timestamptz not null,
    bucket_size     interval not null,

    reason          text not null,
    marked_at       timestamptz not null default clock_timestamp(),
    attempt_count   integer not null default 0,
    last_attempt_at timestamptz,
    last_error      text,

    constraint metric_rollup_dirty_bucket_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            bucket_start,
            bucket_size
        ),

    constraint metric_rollup_dirty_bucket_reason_chk
        check (
            reason in (
                'LATE_ARRIVING_DATA',
                'BACKFILL',
                'CORRECTION',
                'REPROCESS',
                'MANUAL'
            )
        )
);
```

Saat data masuk:

```sql
insert into metric_rollup_dirty_bucket (
    tenant_id,
    source_id,
    metric_name,
    bucket_start,
    bucket_size,
    reason
)
values (
    :tenantId,
    :sourceId,
    :metricName,
    date_bin(
        interval '15 minutes',
        :eventTime::timestamptz,
        timestamptz '2026-01-01 00:00:00+00'
    ),
    interval '15 minutes',
    :reason
)
on conflict (
    tenant_id,
    source_id,
    metric_name,
    bucket_start,
    bucket_size
)
do update set
    reason = excluded.reason,
    marked_at = clock_timestamp();
```

---

# 10. Refresh Dirty Buckets

Function refresh satu dirty bucket:

```sql
create or replace function refresh_metric_rollup_15m_dirty_bucket(
    p_tenant_id bigint,
    p_source_id bigint,
    p_metric_name text,
    p_bucket_start timestamptz
)
returns void
language plpgsql
as $$
declare
    v_bucket_end timestamptz;
begin
    v_bucket_end := p_bucket_start + interval '15 minutes';

    delete from metric_rollup_15m
    where tenant_id = p_tenant_id
      and source_id = p_source_id
      and metric_name = p_metric_name
      and bucket_start = p_bucket_start;

    insert into metric_rollup_15m (
        tenant_id,
        source_id,
        metric_name,
        bucket_start,
        bucket_end,
        sample_count,
        good_count,
        bad_count,
        late_count,
        avg_value,
        min_value,
        max_value,
        sum_value,
        calculated_at
    )
    select
        tenant_id,
        source_id,
        metric_name,
        p_bucket_start,
        v_bucket_end,

        count(*) as sample_count,
        count(*) filter (where value_quality = 'GOOD') as good_count,
        count(*) filter (where value_quality <> 'GOOD') as bad_count,
        count(*) filter (where time_quality = 'LATE') as late_count,

        avg(value_numeric) filter (where value_quality = 'GOOD') as avg_value,
        min(value_numeric) filter (where value_quality = 'GOOD') as min_value,
        max(value_numeric) filter (where value_quality = 'GOOD') as max_value,
        sum(value_numeric) filter (where value_quality = 'GOOD') as sum_value,

        clock_timestamp()
    from metric_sample
    where tenant_id = p_tenant_id
      and source_id = p_source_id
      and metric_name = p_metric_name
      and event_time >= p_bucket_start
      and event_time <  v_bucket_end
    group by
        tenant_id,
        source_id,
        metric_name;
end;
$$;
```

Process dirty queue:

```sql
create or replace function process_metric_rollup_15m_dirty_buckets(
    p_limit integer default 100
)
returns integer
language plpgsql
as $$
declare
    r record;
    v_processed integer := 0;
begin
    for r in
        select
            tenant_id,
            source_id,
            metric_name,
            bucket_start,
            bucket_size
        from metric_rollup_dirty_bucket
        where bucket_size = interval '15 minutes'
        order by marked_at
        limit p_limit
        for update skip locked
    loop
        begin
            perform refresh_metric_rollup_15m_dirty_bucket(
                r.tenant_id,
                r.source_id,
                r.metric_name,
                r.bucket_start
            );

            delete from metric_rollup_dirty_bucket
            where tenant_id = r.tenant_id
              and source_id = r.source_id
              and metric_name = r.metric_name
              and bucket_start = r.bucket_start
              and bucket_size = r.bucket_size;

            v_processed := v_processed + 1;

        exception
            when others then
                update metric_rollup_dirty_bucket
                set
                    attempt_count = attempt_count + 1,
                    last_attempt_at = clock_timestamp(),
                    last_error = sqlerrm
                where tenant_id = r.tenant_id
                  and source_id = r.source_id
                  and metric_name = r.metric_name
                  and bucket_start = r.bucket_start
                  and bucket_size = r.bucket_size;
        end;
    end loop;

    return v_processed;
end;
$$;
```

`FOR UPDATE SKIP LOCKED` membantu beberapa worker mengambil pekerjaan berbeda tanpa saling menunggu row yang sedang diproses worker lain. Ini cocok untuk queue table internal, tetapi tetap harus dibatasi agar tidak menimbulkan tekanan lock dan write berlebihan.

---

# 11. Rollup Job Table

Agar refresh bisa diaudit, buat job table.

```sql
create table metric_rollup_job (
    job_id          uuid primary key,
    rollup_name     text not null,
    status          text not null,

    window_from     timestamptz,
    window_to       timestamptz,

    started_at      timestamptz not null default clock_timestamp(),
    completed_at    timestamptz,

    processed_count integer not null default 0,
    error_message   text,

    constraint metric_rollup_job_status_chk
        check (
            status in (
                'RUNNING',
                'COMPLETED',
                'FAILED',
                'PARTIAL_FAILED'
            )
        )
);
```

Example run:

```sql
insert into metric_rollup_job (
    job_id,
    rollup_name,
    status,
    window_from,
    window_to
)
values (
    gen_random_uuid(),
    'metric_rollup_15m',
    'RUNNING',
    :from,
    :to
);
```

---

# 12. Scheduling Rollup Refresh

## Option 1 - fixed trailing window

Misalnya setiap 5 menit, refresh 1 jam terakhir:

```sql
select refresh_metric_rollup_15m_window(
    date_bin(
        interval '15 minutes',
        clock_timestamp() - interval '1 hour',
        timestamptz '2026-01-01 00:00:00+00'
    ),
    date_bin(
        interval '15 minutes',
        clock_timestamp(),
        timestamptz '2026-01-01 00:00:00+00'
    )
);
```

### Cocok untuk

| Cocok | Catatan |
|---|---|
| late data kecil | refresh trailing window cukup |
| dashboard near-real-time | window pendek |
| simple operation | mudah dijadwalkan |
| data volume sedang | scanning 1 jam masih aman |

---

## Option 2 - dirty bucket worker

```sql
select process_metric_rollup_15m_dirty_buckets(500);
```

### Cocok untuk

| Cocok | Catatan |
|---|---|
| late data sering | refresh hanya affected bucket |
| backfill historis | tandai bucket terdampak |
| correction event | recompute tepat sasaran |
| high-volume table | lebih efisien daripada trailing refresh besar |

---

## Option 3 - hybrid

```text
Every 5 minutes:
  - refresh trailing 1 hour

Every minute:
  - process dirty bucket queue

After backfill:
  - mark affected buckets
  - process dirty buckets in batch
```

Hybrid biasanya paling praktis untuk production.

---

# 13. Advisory Lock untuk Rollup Job

Hindari double-run job yang sama.

```sql
create or replace function process_metric_rollup_15m_dirty_buckets_locked(
    p_limit integer default 500
)
returns integer
language plpgsql
as $$
declare
    v_lock_acquired boolean;
    v_processed integer;
begin
    v_lock_acquired := pg_try_advisory_lock(
        hashtext('metric_rollup_15m_dirty_worker')
    );

    if not v_lock_acquired then
        raise notice 'metric_rollup_15m_dirty_worker already running';
        return 0;
    end if;

    begin
        v_processed := process_metric_rollup_15m_dirty_buckets(p_limit);
        perform pg_advisory_unlock(hashtext('metric_rollup_15m_dirty_worker'));
        return v_processed;
    exception
        when others then
            perform pg_advisory_unlock(hashtext('metric_rollup_15m_dirty_worker'));
            raise;
    end;
end;
$$;
```

---

# 14. Rollup Query dari API

```sql
select
    bucket_start,
    bucket_end,
    sample_count,
    good_count,
    bad_count,
    late_count,
    avg_value,
    min_value,
    max_value,
    sum_value
from metric_rollup_15m
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and bucket_start >= :from
  and bucket_start <  :to
order by bucket_start;
```

MyBatis mapper:

```java
public interface MetricRollupMapper {

    List<MetricRollupPoint> find15mRollup(
        @Param("tenantId") long tenantId,
        @Param("sourceId") long sourceId,
        @Param("metricName") String metricName,
        @Param("from") Instant from,
        @Param("to") Instant to
    );
}
```

XML:

```xml
<select id="find15mRollup" resultType="com.example.MetricRollupPoint">
    select
        bucket_start as bucketStart,
        bucket_end as bucketEnd,
        sample_count as sampleCount,
        good_count as goodCount,
        bad_count as badCount,
        late_count as lateCount,
        avg_value as avgValue,
        min_value as minValue,
        max_value as maxValue,
        sum_value as sumValue
    from metric_rollup_15m
    where tenant_id = #{tenantId}
      and source_id = #{sourceId}
      and metric_name = #{metricName}
      and bucket_start >= #{from}
      and bucket_start &lt; #{to}
    order by bucket_start
</select>
```

---

# 15. Jersey Query Source Selection

```java
public enum MetricQuerySource {
    RAW,
    ROLLUP_15M,
    ROLLUP_1H,
    ROLLUP_1D
}
```

```java
public MetricQuerySource chooseSource(Duration range, Duration requestedBucket) {
    if (range.compareTo(Duration.ofHours(1)) <= 0
        && requestedBucket.compareTo(Duration.ofMinutes(1)) <= 0) {
        return MetricQuerySource.RAW;
    }

    if (range.compareTo(Duration.ofDays(30)) <= 0
        && requestedBucket.compareTo(Duration.ofMinutes(15)) >= 0) {
        return MetricQuerySource.ROLLUP_15M;
    }

    if (range.compareTo(Duration.ofDays(365)) <= 0
        && requestedBucket.compareTo(Duration.ofHours(1)) >= 0) {
        return MetricQuerySource.ROLLUP_1H;
    }

    return MetricQuerySource.ROLLUP_1D;
}
```

Endpoint:

```java
@GET
@Path("/v1/metrics/{sourceId}/{metricName}/series")
@Produces(MediaType.APPLICATION_JSON)
public Response getSeries(
    @PathParam("sourceId") long sourceId,
    @PathParam("metricName") String metricName,
    @QueryParam("from") String fromText,
    @QueryParam("to") String toText,
    @QueryParam("bucket") @DefaultValue("auto") String bucket
) {
    Instant from = OffsetDateTime.parse(fromText).toInstant();
    Instant to = OffsetDateTime.parse(toText).toInstant();

    if (!from.isBefore(to)) {
        throw new BadRequestException("from must be before to");
    }

    MetricSeriesResponse response = metricQueryService.querySeries(
        sourceId,
        metricName,
        from,
        to,
        bucket
    );

    return Response.ok(response).build();
}
```

---

# 16. Multi-Resolution Rollup Tables

```text
metric_sample raw
│
├─ metric_rollup_1m
│  └─ last few hours / operational dashboard
│
├─ metric_rollup_15m
│  └─ daily / weekly dashboard
│
├─ metric_rollup_1h
│  └─ monthly / yearly dashboard
│
└─ metric_rollup_1d
   └─ long-term reporting
```

## 16.1 Rollup 1 hour from 15 minute

```sql
insert into metric_rollup_1h (
    tenant_id,
    source_id,
    metric_name,
    bucket_start,
    bucket_end,
    sample_count,
    good_count,
    bad_count,
    late_count,
    avg_value,
    min_value,
    max_value,
    sum_value,
    calculated_at
)
select
    tenant_id,
    source_id,
    metric_name,

    date_bin(
        interval '1 hour',
        bucket_start,
        timestamptz '2026-01-01 00:00:00+00'
    ) as bucket_start,

    date_bin(
        interval '1 hour',
        bucket_start,
        timestamptz '2026-01-01 00:00:00+00'
    ) + interval '1 hour' as bucket_end,

    sum(sample_count) as sample_count,
    sum(good_count) as good_count,
    sum(bad_count) as bad_count,
    sum(late_count) as late_count,

    sum(avg_value * good_count) / nullif(sum(good_count), 0) as avg_value,
    min(min_value) as min_value,
    max(max_value) as max_value,
    sum(sum_value) as sum_value,

    clock_timestamp()
from metric_rollup_15m
where bucket_start >= :from
  and bucket_start <  :to
group by
    tenant_id,
    source_id,
    metric_name,
    date_bin(
        interval '1 hour',
        bucket_start,
        timestamptz '2026-01-01 00:00:00+00'
    )
on conflict (
    tenant_id,
    source_id,
    metric_name,
    bucket_start
)
do update set
    bucket_end = excluded.bucket_end,
    sample_count = excluded.sample_count,
    good_count = excluded.good_count,
    bad_count = excluded.bad_count,
    late_count = excluded.late_count,
    avg_value = excluded.avg_value,
    min_value = excluded.min_value,
    max_value = excluded.max_value,
    sum_value = excluded.sum_value,
    calculated_at = clock_timestamp();
```

### Important

Average dari rollup harus **weighted**:

```sql
sum(avg_value * good_count) / nullif(sum(good_count), 0)
```

Jangan:

```sql
avg(avg_value)
```

karena bucket dengan 10 sample dan bucket dengan 10.000 sample tidak boleh punya bobot sama.

---

# 17. Percentile Rollup: Hati-Hati

Untuk p95/p99, jangan gabungkan percentile seperti ini:

```sql
avg(p95_value)
```

atau:

```sql
max(p95_value)
```

Itu bukan p95 global yang benar.

| Metric | Bisa digabung dari rollup? | Cara |
|---|---:|---|
| `count` | Ya | `sum(count)` |
| `sum` | Ya | `sum(sum_value)` |
| `min` | Ya | `min(min_value)` |
| `max` | Ya | `max(max_value)` |
| `avg` | Ya | weighted average |
| `p95/p99` | Tidak sederhana | raw, histogram, approximate sketch |

Untuk PostgreSQL native tanpa extension/sketch, hitung percentile dari raw atau simpan histogram bucket jika benar-benar perlu percentile multi-level.

---

# 18. Quality-Aware Rollup

Rollup harus menyimpan kualitas data, bukan hanya angka.

```sql
select
    bucket_start,
    sample_count,
    good_count,
    bad_count,
    late_count,
    good_count::numeric / nullif(sample_count, 0) as good_ratio,
    late_count::numeric / nullif(sample_count, 0) as late_ratio
from metric_rollup_15m
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and bucket_start >= :from
  and bucket_start <  :to
order by bucket_start;
```

Dashboard bisa menandai bucket:

```text
OK              good_ratio >= 0.95
PARTIAL         good_ratio between 0.5 and 0.95
BAD_QUALITY     good_ratio < 0.5
MISSING         sample_count = 0
LATE_AFFECTED   late_count > 0
```

---

# 19. Completeness Rollup

Jika metric punya expected interval, hitung completeness.

```sql
create table metric_completeness_15m (
    tenant_id       bigint not null,
    source_id       bigint not null,
    metric_name     text not null,
    bucket_start    timestamptz not null,
    bucket_end      timestamptz not null,

    expected_count  numeric,
    actual_count    bigint not null,
    good_count      bigint not null,
    completeness_ratio numeric,
    completeness_status text not null,

    calculated_at   timestamptz not null default clock_timestamp(),

    constraint metric_completeness_15m_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            bucket_start
        )
);
```

Refresh:

```sql
insert into metric_completeness_15m (
    tenant_id,
    source_id,
    metric_name,
    bucket_start,
    bucket_end,
    expected_count,
    actual_count,
    good_count,
    completeness_ratio,
    completeness_status,
    calculated_at
)
select
    r.tenant_id,
    r.source_id,
    r.metric_name,
    r.bucket_start,
    r.bucket_end,

    extract(epoch from interval '15 minutes')
      / nullif(extract(epoch from d.expected_sample_interval), 0) as expected_count,

    r.sample_count as actual_count,
    r.good_count,

    r.good_count::numeric
      / nullif(
            extract(epoch from interval '15 minutes')
            / extract(epoch from d.expected_sample_interval),
            0
        ) as completeness_ratio,

    case
        when d.expected_sample_interval is null then 'UNKNOWN_EXPECTATION'
        when r.sample_count = 0 then 'MISSING'
        when r.good_count::numeric
             / nullif(
                   extract(epoch from interval '15 minutes')
                   / extract(epoch from d.expected_sample_interval),
                   0
               ) < 0.8 then 'INCOMPLETE'
        else 'OK'
    end as completeness_status,

    clock_timestamp()
from metric_rollup_15m r
join metric_definition d
  on d.metric_name = r.metric_name
where r.bucket_start >= :from
  and r.bucket_start <  :to
on conflict (
    tenant_id,
    source_id,
    metric_name,
    bucket_start
)
do update set
    bucket_end = excluded.bucket_end,
    expected_count = excluded.expected_count,
    actual_count = excluded.actual_count,
    good_count = excluded.good_count,
    completeness_ratio = excluded.completeness_ratio,
    completeness_status = excluded.completeness_status,
    calculated_at = clock_timestamp();
```

---

# 20. Refresh After Backfill

Backfill historis harus memberi tahu rollup window mana yang terdampak.

## 20.1 Cari affected bucket dari staging

```sql
insert into metric_rollup_dirty_bucket (
    tenant_id,
    source_id,
    metric_name,
    bucket_start,
    bucket_size,
    reason
)
select distinct
    tenant_id,
    source_id,
    metric_name,
    date_bin(
        interval '15 minutes',
        event_time,
        timestamptz '2026-01-01 00:00:00+00'
    ) as bucket_start,
    interval '15 minutes',
    'BACKFILL'
from metric_sample_staging
where batch_id = :batchId
on conflict (
    tenant_id,
    source_id,
    metric_name,
    bucket_start,
    bucket_size
)
do update set
    reason = excluded.reason,
    marked_at = clock_timestamp();
```

## 20.2 Process dirty buckets

```sql
select process_metric_rollup_15m_dirty_buckets_locked(1000);
```

---

# 21. Refresh After Correction

Correction event harus menandai bucket original dan bucket corrected jika waktunya berubah.

```sql
insert into metric_rollup_dirty_bucket (
    tenant_id,
    source_id,
    metric_name,
    bucket_start,
    bucket_size,
    reason
)
values
(
    :tenantId,
    :sourceId,
    :metricName,
    date_bin(interval '15 minutes', :originalEventTime::timestamptz, timestamptz '2026-01-01 00:00:00+00'),
    interval '15 minutes',
    'CORRECTION'
),
(
    :tenantId,
    :sourceId,
    :metricName,
    date_bin(interval '15 minutes', :correctedEventTime::timestamptz, timestamptz '2026-01-01 00:00:00+00'),
    interval '15 minutes',
    'CORRECTION'
)
on conflict (
    tenant_id,
    source_id,
    metric_name,
    bucket_start,
    bucket_size
)
do update set
    reason = excluded.reason,
    marked_at = clock_timestamp();
```

---

# 22. Refresh Safety: Jangan Refresh Bucket yang Masih Terbuka?

Untuk dashboard real-time, bucket saat ini sering belum lengkap.

Contoh bucket 10:00-10:15 saat jam 10:07: data belum lengkap.

Policy:

| Policy | Cocok untuk |
|---|---|
| include open bucket | real-time dashboard |
| exclude open bucket | reporting stabil |
| mark open bucket | dashboard perlu tahu partial |
| refresh trailing window | handle bucket open dan late data |

Tambahkan flag di response:

```sql
select
    bucket_start,
    bucket_end,
    avg_value,
    sample_count,
    case
        when bucket_end > clock_timestamp() then true
        else false
    end as is_open_bucket
from metric_rollup_15m
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and bucket_start >= :from
  and bucket_start < :to
order by bucket_start;
```

---

# 23. Scheduling dengan Kubernetes CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: metric-rollup-15m-refresh
spec:
  schedule: "*/5 * * * *"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 5
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: rollup-refresh
              image: postgres:17
              env:
                - name: PGHOST
                  valueFrom:
                    secretKeyRef:
                      name: app-db
                      key: host
                - name: PGDATABASE
                  value: appdb
                - name: PGUSER
                  valueFrom:
                    secretKeyRef:
                      name: app-db
                      key: username
                - name: PGPASSWORD
                  valueFrom:
                    secretKeyRef:
                      name: app-db
                      key: password
              command:
                - /bin/sh
                - -c
                - |
                  psql -v ON_ERROR_STOP=1 \
                    -c "select process_metric_rollup_15m_dirty_buckets_locked(500);"
```

---

# 24. Scheduling dengan Application Worker

```java
public final class MetricRollupWorker implements Runnable {

    private final MetricRollupMapper mapper;

    @Override
    public void run() {
        while (!Thread.currentThread().isInterrupted()) {
            try {
                int processed = mapper.processDirtyBuckets(500);

                if (processed == 0) {
                    Thread.sleep(Duration.ofSeconds(10).toMillis());
                }
            } catch (Exception ex) {
                // log error, emit metric, backoff
                sleepBackoff();
            }
        }
    }
}
```

Mapper:

```java
public interface MetricRollupMapper {
    int processDirtyBuckets(@Param("limit") int limit);
}
```

XML:

```xml
<select id="processDirtyBuckets" resultType="int">
    select process_metric_rollup_15m_dirty_buckets_locked(#{limit})
</select>
```

---

# 25. Rollup Observability

Minimal metrics:

| Metric | Kenapa penting |
|---|---|
| dirty bucket count | backlog refresh |
| oldest dirty bucket age | staleness |
| rollup lag | dashboard freshness |
| refresh duration p95/p99 | job health |
| refresh error count | reliability |
| processed bucket/sec | throughput |
| rollup table size | storage growth |
| late data count | cause of refresh |
| open bucket status | dashboard interpretation |
| row count per rollup bucket | data completeness |

SQL:

```sql
select
    bucket_size,
    reason,
    count(*) as dirty_bucket_count,
    min(marked_at) as oldest_marked_at,
    clock_timestamp() - min(marked_at) as oldest_age
from metric_rollup_dirty_bucket
group by bucket_size, reason
order by dirty_bucket_count desc;
```

Rollup lag:

```sql
select
    max(bucket_start) as latest_bucket,
    clock_timestamp() - max(bucket_start) as rollup_lag
from metric_rollup_15m;
```

Job error:

```sql
select
    rollup_name,
    status,
    count(*) as job_count,
    max(started_at) as last_started_at
from metric_rollup_job
where started_at >= clock_timestamp() - interval '24 hours'
group by rollup_name, status
order by rollup_name, status;
```

---

# 26. Materialized View Observability

Check size:

```sql
select
    pg_size_pretty(pg_total_relation_size('metric_rollup_1h_mv')) as mv_size;
```

Check indexes:

```sql
select
    indexrelid::regclass as index_name,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
from pg_index
where indrelid = 'metric_rollup_1h_mv'::regclass
order by pg_relation_size(indexrelid) desc;
```

Check refresh duration harus dilakukan di job table/application logs, karena PostgreSQL tidak otomatis menyimpan histori refresh materialized view.

---

# 27. Operational Runbook: Rollup Stale

## Symptoms

```text
dashboard angka tidak berubah
rollup_lag besar
dirty bucket backlog naik
job failed
```

## Investigation

```sql
select
    bucket_size,
    count(*) as dirty_count,
    min(marked_at) as oldest_marked_at
from metric_rollup_dirty_bucket
group by bucket_size;
```

```sql
select *
from metric_rollup_job
order by started_at desc
limit 20;
```

## Mitigation

```text
1. Cek error job terakhir.
2. Cek lock / long query.
3. Jalankan dirty bucket worker dengan limit kecil.
4. Jika backlog sangat besar, proses per tenant/source/window.
5. Untuk dashboard penting, refresh trailing window dulu.
6. Setelah stabil, proses historical dirty bucket.
```

---

# 28. Operational Runbook: Rollup Wrong After Backfill

## Symptoms

```text
raw data sudah masuk
rollup/dashboard belum berubah
```

## Fix

```sql
insert into metric_rollup_dirty_bucket (
    tenant_id,
    source_id,
    metric_name,
    bucket_start,
    bucket_size,
    reason
)
select distinct
    tenant_id,
    source_id,
    metric_name,
    date_bin(interval '15 minutes', event_time, timestamptz '2026-01-01 00:00:00+00'),
    interval '15 minutes',
    'BACKFILL'
from metric_sample
where event_time >= :backfillFrom
  and event_time <  :backfillTo
on conflict (
    tenant_id,
    source_id,
    metric_name,
    bucket_start,
    bucket_size
)
do update set
    reason = excluded.reason,
    marked_at = clock_timestamp();
```

Then:

```sql
select process_metric_rollup_15m_dirty_buckets_locked(5000);
```

---

# 29. Operational Runbook: Materialized View Refresh Blocking/Slow

## Symptoms

```text
refresh lama
DB CPU/IO naik
dashboard stale
query lain melambat
```

## Check

```sql
select
    pid,
    now() - query_start as duration,
    wait_event_type,
    wait_event,
    left(query, 300) as query_sample
from pg_stat_activity
where query ilike '%refresh materialized view%'
order by duration desc;
```

## Mitigation

```text
1. Pastikan MV punya unique index jika memakai CONCURRENTLY.
2. Jadwalkan refresh off-peak.
3. Kurangi scope dengan manual rollup table jika MV terlalu besar.
4. Jangan refresh terlalu sering.
5. Pertimbangkan mengganti full MV refresh dengan dirty bucket rollup.
```

---

# 30. Native PostgreSQL vs TimescaleDB Continuous Aggregate

| Aspek | Native materialized view | Manual rollup table | TimescaleDB continuous aggregate |
|---|---:|---:|---:|
| Built-in PostgreSQL | Ya | Ya | Perlu extension |
| Incremental-like behavior | Tidak native | Custom | Ya, via extension |
| Refresh per bucket | Sulit | Ya | Ya |
| Late data handling | Manual | Dirty bucket | Policy/refresh window |
| Operational control | Medium | Tinggi | Tinggi tapi extension-specific |
| Portability | Tinggi | Tinggi | Lebih rendah |
| Complexity | Rendah awal | Medium | Medium |
| High-volume TSDB | Terbatas | Baik | Baik |

Untuk environment yang tidak boleh memakai extension, manual rollup table adalah pendekatan native paling fleksibel.

---

# 31. Anti-Patterns

| Anti-pattern | Dampak |
|---|---|
| Dashboard selalu hit raw table | mahal dan tidak stabil |
| Materialized view full refresh terlalu sering | DB overload |
| Tidak punya unique index untuk concurrent refresh | `CONCURRENTLY` tidak bisa dipakai |
| Menganggap materialized view auto-update | data stale |
| Tidak track refresh job | sulit debugging |
| Tidak handle late data | rollup salah |
| Tidak ada dirty bucket | backfill/correction tidak propagasi |
| Average dari average tanpa weighting | angka salah |
| Percentile dari percentile | statistik salah |
| Tidak simpan `sample_count` | quality tidak bisa dinilai |
| Refresh bucket open tanpa flag | dashboard bisa salah interpretasi |
| Delete+insert rollup besar tanpa limit | lock/WAL spike |
| Satu rollup table untuk semua resolusi | query tidak efisien |
| Tidak punya runbook stale rollup | incident lama diselesaikan |

---

# 32. Production Checklist

| Checklist | Target |
|---|---|
| Raw table tidak dipakai untuk long-range dashboard | Ya |
| Rollup table punya primary key | Ya |
| Refresh rollup idempotent | Ya |
| Dirty bucket tersedia | Ya |
| Late data menandai dirty bucket | Ya |
| Backfill menandai affected buckets | Ya |
| Correction menandai original/corrected bucket | Ya |
| Rollup job punya status/audit | Ya |
| Advisory lock untuk worker | Ya |
| Refresh batch size dibatasi | Ya |
| Rollup lag dimonitor | Ya |
| Dirty bucket backlog dimonitor | Ya |
| Materialized view punya unique index jika concurrent refresh | Ya |
| Open bucket diberi flag | Ya |
| Multi-resolution rollup strategy jelas | Ya |
| Average rollup dihitung weighted | Ya |
| Percentile tidak digabung sembarangan | Ya |

---

# 33. Recommended Baseline

Untuk production awal PostgreSQL time-series:

```text
Use manual rollup table:
- metric_rollup_15m
- metric_rollup_1h
- metric_rollup_1d

Use materialized view only for:
- stable report
- low/medium data volume
- refresh periodik yang bisa dijadwalkan

Refresh strategy:
- trailing window refresh untuk near-real-time
- dirty bucket untuk late/backfill/correction
- rollup job table untuk audit
- advisory lock untuk mencegah double-run

API:
- raw hanya short range
- rollup untuk medium/long range
- response menyertakan sample_count, good_count, late_count, is_open_bucket
```

---

# Seri 12/16 Selesai

**Seri 12 selesai.**  
Materi ini menutup materialized view dan native rollup strategy untuk PostgreSQL time-series: materialized view, concurrent refresh requirement, manual rollup table, idempotent refresh, delete+insert window, dirty bucket, late data, backfill, correction, job audit, scheduling, MyBatis/Jersey integration, observability, dan operational runbook.

## Rekomendasi materi selanjutnya

Lanjut ke **Seri 13/16 - TimescaleDB Hypertable, Chunking, Compression/Columnstore: kapan layak dipakai, bagaimana migrasi dari native partitioning, dan trade-off operasional di PostgreSQL ecosystem**.

---

**Sources:**

- [Documentation: 18: CREATE MATERIALIZED VIEW](https://www.postgresql.org/docs/current/sql-creatematerializedview.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:58:36 PM

# PostgreSQL Time-Series Database - Seri 13/16  
## TimescaleDB Hypertable, Chunking, Compression/Columnstore: Kapan Layak Dipakai, Migrasi dari Native Partitioning, dan Trade-off Operasional

**Status:** Seri 13 dari 16.  
Fokus seri ini: memahami kapan **TimescaleDB** layak dipakai di atas PostgreSQL untuk workload time-series, terutama fitur **hypertable**, **chunk**, **compression/columnstore**, lifecycle policy, dan implikasinya untuk Java/Jersey/MyBatis.

---

## 1. Posisi TimescaleDB dalam Ekosistem PostgreSQL

TimescaleDB bukan database terpisah seperti sistem TSDB standalone. Ia adalah **PostgreSQL extension** untuk time-series dan event analytics, sehingga tetap memakai SQL, driver, table, index, stored procedure, dan object PostgreSQL biasa. Dokumentasi Timescale/TigerData menjelaskan bahwa TimescaleDB adalah extension PostgreSQL, bukan fork atau database terpisah, sehingga client dan SQL PostgreSQL tetap bisa dipakai. ([tigerdata.com](https://www.tigerdata.com/docs?utm_source=chatgpt.com))

Secara praktis:

```text id="1hj3st"
PostgreSQL biasa
  │
  ├─ normal table
  ├─ partitioned table
  ├─ indexes
  ├─ views/materialized views
  ├─ PL/pgSQL
  └─ JDBC/MyBatis/Jersey tetap sama

PostgreSQL + TimescaleDB
  │
  ├─ hypertable
  ├─ automatic chunking
  ├─ columnstore/compression
  ├─ retention policy
  ├─ continuous aggregate
  └─ time-series helper functions
```

**Mental model:**  
TimescaleDB memberi automation dan optimasi khusus time-series di atas PostgreSQL. Ia tidak menghapus kebutuhan desain data, idempotency, query guard, retention policy, observability, dan operational runbook.

---

## 2. Native Partitioning vs TimescaleDB Hypertable

| Aspek | Native PostgreSQL partitioning | TimescaleDB hypertable |
|---|---|---|
| Teknologi | built-in PostgreSQL | PostgreSQL extension |
| Partition/chunk creation | manual/scheduler/pg_partman | otomatis via hypertable chunking |
| DDL portability | tinggi | tergantung extension availability |
| Query SQL | PostgreSQL SQL | PostgreSQL SQL |
| Java/JDBC/MyBatis | sama | sama |
| Compression/columnstore | native PostgreSQL tidak punya built-in TS columnstore | tersedia melalui TimescaleDB/hypercore |
| Continuous aggregate | manual/materialized view | fitur khusus TimescaleDB |
| Retention policy | manual job/drop partition | built-in policy/helper |
| Operational control | sangat eksplisit | lebih otomatis tapi extension-specific |
| Cloud/on-prem compatibility | selalu tersedia jika PostgreSQL | tergantung boleh install extension |
| Learning curve | PostgreSQL murni | perlu paham Timescale object/policy/job |

TimescaleDB hypertable adalah PostgreSQL table dengan fitur khusus untuk real-time analytics pada time-series/event data. Hypertable otomatis mempartisi data berdasarkan waktu ke child table yang disebut **chunks**. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/hypertables/?utm_source=chatgpt.com))

---

## 3. Kapan TimescaleDB Layak Dipakai?

Gunakan TimescaleDB jika beberapa kondisi ini benar:

| Kondisi | Kenapa TimescaleDB membantu |
|---|---|
| data time-series besar dan terus tumbuh | hypertable/chunking mengurangi beban manual partition |
| retention raw data perlu otomatis | policy bisa menghapus data lama |
| dashboard butuh aggregate cepat | continuous aggregate lebih cocok daripada full materialized view refresh |
| storage raw data mahal | compression/columnstore bisa menghemat storage |
| banyak query range/agregasi | chunk pruning + columnstore membantu |
| tim boleh memakai extension | deployment feasible |
| workload TSDB menjadi core product | investasi operasional worth it |

Tetap pakai native PostgreSQL jika:

| Kondisi | Kenapa native cukup |
|---|---|
| volume kecil/sedang | partition manual cukup |
| extension tidak diizinkan | compliance/platform constraint |
| cloud managed DB tidak support TimescaleDB | portability constraint |
| tim DBA belum siap | operational risk |
| query time-series tidak dominan | overhead tidak sepadan |
| data lebih OLTP biasa | hypertable tidak menyelesaikan problem utama |

---

## 4. Diagram

```text id="y59lvx"
TimescaleDB Time-Series Architecture
│
├─ PostgreSQL database
│  ├─ normal relational tables
│  ├─ dimensions/reference tables
│  ├─ user/tenant/config tables
│  └─ TimescaleDB extension
│
├─ Hypertable
│  ├─ logical table queried by app
│  ├─ time dimension
│  ├─ optional space dimension
│  └─ automatic chunks
│
├─ Chunks
│  ├─ physical child tables
│  ├─ time range based
│  ├─ can be compressed/columnstore
│  └─ target of retention/compression policies
│
├─ Columnstore / Compression
│  ├─ older/cold chunks converted
│  ├─ storage reduction
│  ├─ faster analytical scans
│  └─ trade-off for write/update patterns
│
├─ Rollup Layer
│  ├─ continuous aggregates
│  ├─ refresh policy
│  └─ dashboard API
│
└─ Java/Jersey/MyBatis
   ├─ same JDBC driver
   ├─ same SQL style
   ├─ ingestion/query endpoints
   └─ operational admin endpoints/scripts
```

---

## 5. Hypertable: Konsep Utama

Hypertable adalah logical table yang dipakai aplikasi, tetapi secara fisik data disimpan dalam chunks.

```text id="qz0uz7"
metric_sample hypertable
│
├─ chunk 2026-07-15
├─ chunk 2026-07-16
├─ chunk 2026-07-17
└─ chunk 2026-07-18
```

Dokumentasi Timescale menyebut hypertable otomatis mempartisi data time-series berdasarkan waktu, dan setiap hypertable terdiri dari child table bernama chunks yang masing-masing punya range waktu. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/hypertables/?utm_source=chatgpt.com))

Aplikasi tetap query table utama:

```sql id="rwe2cz"
select
    event_time,
    value_numeric
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and event_time >= :from
  and event_time <  :to
order by event_time;
```

---

## 6. Setup Extension

Self-hosted PostgreSQL harus punya TimescaleDB terinstall dan loaded.

```sql id="p94ufz"
create extension if not exists timescaledb;
```

Di environment managed cloud, support extension berbeda-beda. Untuk on-prem, Docker, Kubernetes, AWS, Azure, atau hybrid, pastikan:

| Check | Detail |
|---|---|
| extension tersedia | TimescaleDB package/image tersedia |
| versi PostgreSQL compatible | sesuai support matrix platform |
| versi TimescaleDB compatible | cek release/platform |
| policy perusahaan | extension C boleh/tidak |
| backup/restore tested | pg_dump/pg_restore/PITR |
| observability | job, chunks, compression, cagg |
| rollback plan | migrasi balik ke PostgreSQL native sulit |

---

## 7. Membuat Hypertable Baru

Table biasa dulu:

```sql id="hqtw3k"
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_id        uuid not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    value_numeric   double precision,
    value_quality   text not null default 'GOOD',
    time_quality    text not null default 'NORMAL',

    tags            jsonb not null default '{}'::jsonb
);
```

Lalu convert menjadi hypertable:

```sql id="r9a2bg"
select create_hypertable(
    'metric_sample',
    by_range('event_time')
);
```

Dokumentasi terbaru Timescale menunjukkan pembuatan hypertable dengan `create_hypertable` dan time dimension seperti `by_range('time')`; untuk table PostgreSQL yang sudah berisi data, `migrate_data` dapat dipakai ketika convert. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/hypertables/create/?utm_source=chatgpt.com))

---

## 8. Hypertable dengan Chunk Interval

Chunk interval menentukan rentang waktu per chunk.

```sql id="m7hhmz"
select create_hypertable(
    'metric_sample',
    by_range('event_time', interval '1 day')
);
```

### Pilihan chunk interval

| Workload | Starting chunk interval |
|---|---|
| high ingest, jutaan row/hari | 1 day |
| medium volume | 7 days |
| low volume | 1 month |
| observability high-cardinality | 1 day atau lebih kecil |
| report monthly | 1 week / 1 month |
| compression cepat | chunk lebih pendek bisa lebih cepat eligible |

**Rule praktis:** chunk jangan terlalu besar sampai query/maintenance berat, tapi jangan terlalu kecil sampai jumlah chunk terlalu banyak.

---

## 9. Space Dimension / Secondary Dimension

Selain time dimension, hypertable bisa memakai dimension tambahan, misalnya hash by tenant/source, agar data tersebar lebih baik.

Contoh konsep:

```sql id="2co2mt"
select create_hypertable(
    'metric_sample',
    by_range('event_time', interval '1 day'),
    create_default_indexes => false
);
```

Lalu atur index sesuai query:

```sql id="1f9j8b"
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
);
```

Gunakan space dimension jika ada evidence:

| Layak | Jangan dulu |
|---|---|
| tenant/source sangat skewed | volume masih rendah |
| satu chunk terlalu besar | belum ada bottleneck |
| query banyak by tenant/source | query pattern belum stabil |
| parallelism/distribution butuh | operational complexity belum siap |

---

## 10. Index di Hypertable

Index tetap PostgreSQL index.

```sql id="thggq9"
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
)
include (
    value_numeric,
    value_quality,
    time_quality
);
```

Untuk latest query:

```sql id="515m10"
select
    event_time,
    value_numeric
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
order by event_time desc
limit 1;
```

Index:

```sql id="g0x69e"
create index metric_sample_latest_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
);
```

**Catatan:** hypertable/chunking tidak menggantikan query-driven index design. Equality columns tetap di kiri, time range/order di kanan.

---

## 11. Unique Constraint di Hypertable

TimescaleDB juga punya batasan uniqueness yang mirip secara konsep dengan partitioning: unique index pada hypertable harus mencakup semua partitioning dimensions. Dokumentasi Timescale menjelaskan bahwa unique index pada hypertable harus berisi semua partitioning columns agar Timescale bisa menjamin uniqueness. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/hypertables/hypertables-and-unique-indexes/?utm_source=chatgpt.com))

Valid jika partition by `event_time`:

```sql id="mj70q9"
alter table metric_sample
add constraint metric_sample_pk
primary key (
    tenant_id,
    source_id,
    metric_name,
    event_time,
    event_id
);
```

Problematis jika ingin global event id:

```sql id="qh44hg"
-- tidak cukup jika tidak mencakup event_time dimension
unique (tenant_id, event_id)
```

Solusi tetap sama seperti native partitioning:

```sql id="lusf7f"
create table ingestion_event_registry (
    tenant_id      bigint not null,
    event_id       uuid not null,
    first_seen_at  timestamptz not null default clock_timestamp(),

    constraint ingestion_event_registry_pk
        primary key (tenant_id, event_id)
);
```

---

## 12. Migrasi Existing PostgreSQL Table ke Hypertable

Jika table PostgreSQL sudah ada dan berisi data:

```sql id="ecn5rl"
select create_hypertable(
    'metric_sample',
    by_range('event_time'),
    migrate_data => true
);
```

Dokumentasi Timescale menyebut table PostgreSQL yang sudah berisi data bisa dikonversi dengan `create_hypertable(..., migrate_data => true)`, tetapi migrasi data bisa memakan waktu dan perlu perhatian terhadap constraint/foreign key. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/hypertables/create/?utm_source=chatgpt.com))

### Checklist sebelum migrasi

| Checklist | Alasan |
|---|---|
| backup tersedia | rollback safety |
| test di staging | ukur durasi dan lock |
| cek unique constraints | harus mencakup time dimension |
| cek foreign key | bisa membatasi migrasi |
| cek index existing | mungkin perlu rebuild/adjust |
| cek query plan | sebelum/sesudah |
| cek ingestion pause/downtime | migrasi bisa berat |
| cek chunk interval | jangan default tanpa desain |
| cek extension availability | semua env sama |
| runbook rollback | penting untuk production |

---

## 13. Migrasi dari Native Partitioning ke TimescaleDB

Migrasi dari native partitioned table ke hypertable tidak selalu “satu command”. Karena hypertable sendiri mengelola chunking internal, pendekatan yang lebih aman biasanya:

```text id="tmu84l"
1. Create new hypertable metric_sample_ts
2. Create indexes/constraints
3. Backfill data dari old partitioned table
4. Dual-write atau pause ingestion
5. Validate row count/checksum
6. Switch read/write app ke hypertable
7. Keep old table read-only for rollback window
8. Drop/archive old table setelah stabil
```

Contoh:

```sql id="vqnw0m"
create table metric_sample_ts (
    like metric_sample including defaults including constraints
);
```

Convert:

```sql id="acqz3v"
select create_hypertable(
    'metric_sample_ts',
    by_range('event_time', interval '1 day')
);
```

Backfill:

```sql id="9kn9pf"
insert into metric_sample_ts (
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    ingest_time,
    value_numeric,
    value_quality,
    time_quality,
    tags
)
select
    tenant_id,
    source_id,
    event_id,
    metric_name,
    event_time,
    ingest_time,
    value_numeric,
    value_quality,
    time_quality,
    tags
from metric_sample
where event_time >= :from
  and event_time <  :to
on conflict do nothing;
```

---

## 14. Chunk Observability

TimescaleDB menyediakan informational views, termasuk `timescaledb_information.chunks`, untuk melihat metadata chunk hypertable, termasuk informasi chunk berdasarkan primary time dimension. ([Tiger Data Docs](https://docs.timescale.com/api/latest/informational-views/chunks/?utm_source=chatgpt.com))

Contoh:

```sql id="cvqlku"
select
    hypertable_schema,
    hypertable_name,
    chunk_schema,
    chunk_name,
    range_start,
    range_end
from timescaledb_information.chunks
where hypertable_name = 'metric_sample'
order by range_start desc;
```

Cek ukuran chunk:

```sql id="d1tmhi"
select
    chunk_schema,
    chunk_name,
    pg_size_pretty(
        pg_total_relation_size(
            format('%I.%I', chunk_schema, chunk_name)::regclass
        )
    ) as total_size
from timescaledb_information.chunks
where hypertable_name = 'metric_sample'
order by range_start desc;
```

---

## 15. Chunk Sizing Practical Guide

Chunk terlalu besar:

```text id="3qwh89"
- compression lambat
- retention/drop lebih berat
- query scan chunk besar
- maintenance lebih mahal
```

Chunk terlalu kecil:

```text id="o4c8bf"
- terlalu banyak chunk
- planning overhead
- metadata overhead
- policy job lebih banyak
```

Starting point:

| Volume | Chunk interval awal |
|---|---|
| rendah | 1 week / 1 month |
| sedang | 1 day / 1 week |
| tinggi | 1 day |
| sangat tinggi | 6-12 hours, setelah benchmark |
| heavy late data | jangan terlalu agresif compress/drop |
| dashboard mostly recent | chunk kecil-menengah |

Ukur dengan:

```sql id="997jqk"
select
    range_start,
    range_end,
    pg_size_pretty(
        pg_total_relation_size(
            format('%I.%I', chunk_schema, chunk_name)::regclass
        )
    ) as size
from timescaledb_information.chunks
where hypertable_name = 'metric_sample'
order by range_start desc;
```

---

# 16. Compression / Columnstore / Hypercore

TimescaleDB modern memperkenalkan **hypercore**, hybrid row-columnar storage engine. Dokumentasi menyebut data baru berada di rowstore, lalu saat data mendingin, TimescaleDB dapat mengonversinya ke columnstore untuk scanning/agregasi lebih cepat dan storage lebih hemat. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/hypercore/?utm_source=chatgpt.com))

Dokumentasi compression juga menyebut Timescale menggunakan built-in job scheduler untuk mengonversi data ke bentuk compressed columns across chunks hypertable. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/compression/?utm_source=chatgpt.com))

Mental model:

```text id="c6rbzq"
Recent/hot data
  → rowstore
  → fast insert/update
  → query recent

Older/cold data
  → columnstore/compressed
  → storage saving
  → faster analytics scans
  → less suited for high-churn writes
```

---

## 17. Mengaktifkan Columnstore Policy

Contoh pola umum:

```sql id="6auvxe"
alter table metric_sample
set (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'tenant_id, source_id, metric_name',
    timescaledb.compress_orderby = 'event_time DESC'
);
```

Pada TimescaleDB versi baru, API hypercore/columnstore mulai menggantikan API compression lama pada beberapa area. Dokumentasi terbaru menyebut `convert_to_columnstore()` menggantikan `compress_chunk()` yang deprecated sejak TimescaleDB 2.18.0. ([Tiger Data Docs](https://docs.timescale.com/api/latest/hypercore/convert_to_columnstore/?utm_source=chatgpt.com))

Karena versi API bisa berbeda antar TimescaleDB release, pastikan style konfigurasi sesuai versi yang dipakai di environment Anda.

---

## 18. Manual Convert Chunk ke Columnstore

Contoh manual:

```sql id="rp7r68"
select convert_to_columnstore('_timescaledb_internal._hyper_1_2_chunk');
```

Atau cek chunk dulu:

```sql id="70zy5o"
select
    chunk_schema,
    chunk_name,
    range_start,
    range_end
from timescaledb_information.chunks
where hypertable_name = 'metric_sample'
order by range_start;
```

Lalu:

```sql id="mm9qfc"
select convert_to_columnstore(
    format('%I.%I', chunk_schema, chunk_name)::regclass
)
from timescaledb_information.chunks
where hypertable_name = 'metric_sample'
  and range_end < clock_timestamp() - interval '7 days';
```

---

## 19. Columnstore Policy: Segment By dan Order By

Untuk time-series query, pilih columnstore layout berdasarkan query.

### `segmentby`

Biasanya entity/filter utama:

```text id="j53840"
tenant_id
source_id
metric_name
```

### `orderby`

Biasanya waktu:

```text id="e7m7zw"
event_time DESC
```

Trade-off:

| Setting | Dampak |
|---|---|
| segmentby tenant/source/metric | query per entity lebih efisien |
| orderby event_time desc | latest/range scan lebih baik |
| segment terlalu high-cardinality | compression bisa kurang optimal |
| segment terlalu sedikit | query per entity bisa baca banyak data |
| compress terlalu cepat | late data/update bisa mahal |
| compress terlalu lambat | storage savings tertunda |

---

## 20. Compression/Columnstore Savings

Timescale docs menyebut columnstore conversion dapat mengompres hypertable chunks secara signifikan dan mengorganisasi data untuk query skala besar; dokumentasi compression juga menjelaskan bahwa saat chunk dikompresi, banyak record dikelompokkan ke satu row dengan struktur array-like sehingga storage lebih kecil dan beberapa query bisa lebih cepat. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/hypercore/real-time-analytics-in-hypercore/?utm_source=chatgpt.com))

Cek statistik compression/columnstore sesuai versi TimescaleDB Anda. Dokumentasi lama mencatat `chunk_compression_stats()` digantikan oleh `chunk_columnstore_stats()` sejak API baru di sekitar TimescaleDB 2.18.0. ([Tiger Data Docs](https://docs.timescale.com/api/latest/compression/chunk_compression_stats/?utm_source=chatgpt.com))

Contoh konsep:

```sql id="lebgda"
select *
from chunk_columnstore_stats('metric_sample');
```

Jika environment masih memakai API lama:

```sql id="x518jj"
select *
from chunk_compression_stats('metric_sample');
```

---

# 21. Retention Policy

Retention di TimescaleDB biasanya menghapus chunk lama, bukan delete row satu per satu.

Contoh konsep:

```sql id="2yaj7r"
select add_retention_policy(
    'metric_sample',
    interval '90 days'
);
```

Keuntungan:

| Benefit | Penjelasan |
|---|---|
| drop chunk cepat | mirip drop partition |
| storage terkendali | raw data tidak tumbuh tanpa batas |
| lifecycle otomatis | job scheduler |
| query recent lebih ringan | data lama hilang dari raw |
| operational consistency | policy eksplisit |

Tetap perlu policy:

```text id="ao8rcd"
raw metric: 90 hari
rollup 15m: 12 bulan
rollup 1h: 3 tahun
regulatory events: jangan auto-drop tanpa legal policy
```

---

## 22. Retention vs Compression Order

Biasanya:

```text id="gzzxn9"
hot data:
  0-7 hari
  rowstore, writable

warm data:
  7-90 hari
  compressed/columnstore

expired data:
  >90 hari
  retention drop chunk
```

Contoh policy konseptual:

```sql id="76e15g"
-- convert/compress chunks older than 7 days
-- drop chunks older than 90 days
```

Jangan compress data terlalu cepat jika late-arriving data normalnya bisa datang 3-7 hari kemudian.

| Late data window | Compression after |
|---|---|
| 5 menit | 1 hari bisa aman |
| 1 hari | >2 hari |
| 7 hari | >8-14 hari |
| unpredictable backfill | manual compression setelah backfill |

---

## 23. Continuous Aggregate: Preview untuk Seri 14

TimescaleDB continuous aggregate adalah fitur khusus untuk menyimpan hasil agregasi yang diperbarui otomatis/incremental-ish, lebih cocok untuk rollup time-series daripada materialized view PostgreSQL full refresh. Dokumentasi Timescale menyebut continuous aggregates diperbarui secara background ketika data baru masuk/berubah dan maintenance-nya lebih rendah dibanding refresh penuh materialized view. ([tigerdata.com](https://www.tigerdata.com/timescaledb?utm_source=chatgpt.com))

Detail continuous aggregate akan dibahas di Seri 14. Untuk Seri 13, cukup pahami posisinya:

```text id="n95b24"
Native PostgreSQL:
  raw table → manual rollup/materialized view

TimescaleDB:
  hypertable → continuous aggregate → dashboard
```

---

# 24. Java/Jersey/MyBatis Integration

Dari sisi aplikasi, query hypertable tetap SQL biasa.

## 24.1 Mapper query range

```java id="u5xtar"
public interface MetricSampleMapper {

    List<MetricPoint> findSeries(
        @Param("tenantId") long tenantId,
        @Param("sourceId") long sourceId,
        @Param("metricName") String metricName,
        @Param("from") Instant from,
        @Param("to") Instant to,
        @Param("limit") int limit
    );
}
```

XML:

```xml id="j8ii56"
<select id="findSeries" resultType="com.example.MetricPoint">
    select
        event_time as eventTime,
        value_numeric as valueNumeric,
        value_quality as valueQuality,
        time_quality as timeQuality
    from metric_sample
    where tenant_id = #{tenantId}
      and source_id = #{sourceId}
      and metric_name = #{metricName}
      and event_time >= #{from}
      and event_time &lt; #{to}
    order by event_time
    limit #{limit}
</select>
```

## 24.2 Admin mapper untuk chunk info

```java id="mzf9gz"
public interface TimescaleAdminMapper {

    List<ChunkInfo> findMetricSampleChunks();

    List<ColumnstoreStats> findColumnstoreStats();
}
```

XML:

```xml id="uordmz"
<select id="findMetricSampleChunks" resultType="com.example.ChunkInfo">
    select
        hypertable_name as hypertableName,
        chunk_schema as chunkSchema,
        chunk_name as chunkName,
        range_start as rangeStart,
        range_end as rangeEnd
    from timescaledb_information.chunks
    where hypertable_name = 'metric_sample'
    order by range_start desc
</select>
```

---

# 25. Jersey Guard Tetap Sama

Hypertable bukan alasan untuk membebaskan query.

```java id="2rr30q"
@GET
@Path("/v1/metrics/{sourceId}/{metricName}/series")
@Produces(MediaType.APPLICATION_JSON)
public Response findSeries(
    @PathParam("sourceId") long sourceId,
    @PathParam("metricName") String metricName,
    @QueryParam("from") String fromText,
    @QueryParam("to") String toText,
    @QueryParam("limit") @DefaultValue("5000") int limit
) {
    Instant from = OffsetDateTime.parse(fromText).toInstant();
    Instant to = OffsetDateTime.parse(toText).toInstant();

    if (!from.isBefore(to)) {
        throw new BadRequestException("from must be before to");
    }

    if (Duration.between(from, to).compareTo(Duration.ofDays(31)) > 0) {
        throw new BadRequestException("raw range too large; use aggregate endpoint");
    }

    if (limit < 1 || limit > 10_000) {
        throw new BadRequestException("limit must be between 1 and 10000");
    }

    return Response.ok(
        metricService.findSeries(sourceId, metricName, from, to, limit)
    ).build();
}
```

---

# 26. TimescaleDB di Docker untuk Local Development

Contoh `docker-compose.yml` sederhana:

```yaml id="mhnw79"
services:
  postgres-timescale:
    image: timescale/timescaledb:latest-pg17
    container_name: postgres-timescale
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
    ports:
      - "5432:5432"
    volumes:
      - timescale-data:/var/lib/postgresql/data

volumes:
  timescale-data:
```

Catatan: pin image version untuk production. Jangan gunakan `latest` di production.

```yaml id="51d28y"
image: timescale/timescaledb:2.x.x-pg17
```

---

# 27. Migration Tooling: Flyway/Liquibase

Migration files:

```text id="84sn9l"
V001__enable_timescaledb_extension.sql
V002__create_metric_sample_table.sql
V003__convert_metric_sample_to_hypertable.sql
V004__create_metric_sample_indexes.sql
V005__configure_columnstore_policy.sql
V006__configure_retention_policy.sql
```

Example:

```sql id="cpip9d"
-- V001
create extension if not exists timescaledb;
```

```sql id="03iw8t"
-- V002
create table metric_sample (
    tenant_id bigint not null,
    source_id bigint not null,
    event_id uuid not null,
    metric_name text not null,
    event_time timestamptz not null,
    ingest_time timestamptz not null default clock_timestamp(),
    value_numeric double precision,
    value_quality text not null default 'GOOD',
    time_quality text not null default 'NORMAL',
    tags jsonb not null default '{}'::jsonb
);
```

```sql id="iffgt2"
-- V003
select create_hypertable(
    'metric_sample',
    by_range('event_time', interval '1 day')
);
```

```sql id="3d6ppb"
-- V004
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
);
```

---

# 28. Operational Monitoring

Monitor minimal:

| Area | Query/metric |
|---|---|
| chunk count | `timescaledb_information.chunks` |
| chunk size | `pg_total_relation_size(chunk)` |
| compressed/columnstore stats | `chunk_columnstore_stats` / version-specific |
| policy job status | Timescale job views |
| hypertable size | relation size |
| raw ingestion lag | `ingest_time - event_time` |
| query latency | app/APM/pg_stat_statements |
| retention success | oldest chunk range |
| compression lag | oldest uncompressed eligible chunk |
| cagg refresh lag | Seri 14 |
| extension version | `select extversion from pg_extension` |

Extension version:

```sql id="qfa8gk"
select
    extname,
    extversion
from pg_extension
where extname = 'timescaledb';
```

Chunk count:

```sql id="8cren4"
select
    hypertable_name,
    count(*) as chunk_count,
    min(range_start) as oldest_chunk_start,
    max(range_end) as newest_chunk_end
from timescaledb_information.chunks
group by hypertable_name
order by chunk_count desc;
```

---

# 29. Runbook: Too Many Chunks

## Symptoms

```text id="6zmeq7"
planning lambat
query metadata lambat
policy job lama
chunk count sangat tinggi
```

## Possible causes

| Cause | Penjelasan |
|---|---|
| chunk interval terlalu kecil | hourly padahal volume rendah |
| retention tidak jalan | chunk lama menumpuk |
| backfill membuat banyak historical chunks | perlu lifecycle |
| multi-dimension chunking terlalu granular | chunk explosion |

## Mitigation

```text id="mbyagj"
1. Cek chunk count per hypertable.
2. Cek chunk size rata-rata.
3. Cek retention policy/job.
4. Evaluasi chunk interval.
5. Untuk future table, adjust chunk interval.
6. Untuk old chunks, retention/archive jika boleh.
```

---

# 30. Runbook: Compression/Columnstore Job Bermasalah

## Symptoms

```text id="1jd7ff"
storage tidak turun
eligible old chunks belum compressed/converted
job error
query cold data lambat
```

## Investigation

```text id="dwfb1s"
1. Cek TimescaleDB version/API.
2. Cek policy job status.
3. Cek chunk yang eligible.
4. Cek apakah chunk masih menerima late data/update.
5. Cek lock/long-running transactions.
6. Cek disk/IO pressure.
```

## Mitigation

```text id="ga28y1"
1. Jangan convert chunk yang masih aktif menerima writes.
2. Jalankan manual convert per chunk untuk test.
3. Kurangi batch/policy aggressiveness.
4. Sesuaikan compression_after dengan late data window.
5. Jika API berubah antar versi, update migration/runbook.
```

---

# 31. Runbook: Query Lambat Setelah Compression

## Possible causes

| Cause | Penjelasan |
|---|---|
| segmentby salah | query per entity tetap baca banyak segment |
| orderby salah | range/latest tidak optimal |
| query terlalu selective tapi data columnstore | rowstore mungkin lebih cocok |
| function/filter tidak pushdown-friendly | plan buruk |
| stats kurang | analyze/update stats |
| cagg lebih cocok | raw cold scan tetap mahal |

## Mitigation

```text id="j23qsz"
1. EXPLAIN ANALYZE query.
2. Cek apakah query harus diarahkan ke continuous aggregate.
3. Evaluasi segmentby/orderby.
4. Hindari query raw cold range besar.
5. Buat rollup/cagg untuk dashboard.
```

---

# 32. Anti-Patterns

| Anti-pattern | Dampak |
|---|---|
| Menganggap TimescaleDB otomatis menyelesaikan semua query lambat | index/query guard tetap wajib |
| Chunk interval default tanpa benchmark | chunk terlalu besar/kecil |
| Compress terlalu cepat | late data/update menjadi mahal |
| Retention policy tanpa legal review | data hilang |
| Unique key tidak mencakup time dimension | constraint gagal |
| Migrasi langsung production tanpa staging | lock/downtime risk |
| Tidak monitor chunk count | metadata/plan overhead |
| Tidak monitor policy job | compression/retention silently stale |
| Pakai `latest` Docker image di production | versi berubah tanpa kontrol |
| Query dashboard long-range ke raw hypertable | tetap mahal |
| Tidak punya rollback path dari migration | operational risk |
| Menggunakan API lama/baru tanpa cek versi | migration gagal |
| TimescaleDB dipakai padahal extension tidak supported di semua env | deployment inconsistency |

---

# 33. Production Checklist

| Checklist | Target |
|---|---|
| Extension support diverifikasi | dev/staging/prod |
| Version TimescaleDB dipin | Ya |
| Hypertable time dimension jelas | `event_time` |
| Chunk interval didesain | Ya |
| Index query utama dibuat | Ya |
| Unique constraints mencakup partition dimension | Ya |
| Registry idempotency tetap ada | Ya |
| Compression/columnstore policy sesuai late window | Ya |
| Retention policy sesuai compliance | Ya |
| Chunk count dimonitor | Ya |
| Compression stats dimonitor | Ya |
| Policy jobs dimonitor | Ya |
| Query raw tetap dibatasi | Ya |
| Continuous aggregate dipakai untuk dashboard besar | Seri 14 |
| Migration staging tested | Ya |
| Backup/restore tested | Ya |
| Rollback plan ada | Ya |

---

# 34. Recommended Baseline

Untuk workload PostgreSQL time-series yang mulai berat:

```text id="kav95g"
Hypertable:
- time dimension: event_time
- chunk interval: mulai 1 day untuk high ingest
- indexes:
  (tenant_id, source_id, metric_name, event_time desc)

Idempotency:
- tetap gunakan ingestion_event_registry
- jangan bergantung hanya pada hypertable PK

Storage lifecycle:
- rowstore hot data: 7-14 hari
- columnstore/compressed warm data: setelah late window selesai
- retention raw: 90 hari / sesuai policy

Query:
- raw hypertable hanya untuk short range
- continuous aggregate / rollup untuk dashboard medium-long range
- API guard tetap wajib

Operations:
- monitor chunk count, chunk size, policy jobs, compression lag, retention lag
- pin TimescaleDB version
- test migration dan restore
```

---

# Seri 13/16 Selesai

**Seri 13 selesai.**  
Materi ini menutup TimescaleDB hypertable, chunking, compression/columnstore, migration dari PostgreSQL native table/partitioning, unique constraint implications, Java/Jersey/MyBatis integration, Docker/local setup, migration tooling, monitoring, runbook, dan anti-patterns.

## Rekomendasi materi selanjutnya

Lanjut ke **Seri 14/16 - TimescaleDB Continuous Aggregates, Retention Policy, Downsampling: refresh policy, invalidation, late data, query dashboard, dan operational safety**.

---

**Sources:**

- [Tiger Data Documentation](https://www.tigerdata.com/docs?utm_source=chatgpt.com)
- [Understand hypertables | Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/hypertables/?utm_source=chatgpt.com)

## Response:
7/15/2026, 9:00:35 PM

Saya lanjut ke **Seri 14/16**. Bagian ini fokus ke TimescaleDB continuous aggregates: refresh policy, real-time aggregate, invalidation/late data, retention/downsampling, dan pola query dashboard yang aman.

# PostgreSQL Time-Series Database - Seri 14/16  
## TimescaleDB Continuous Aggregates, Retention Policy, Downsampling, Late Data, dan Operational Safety

**Status:** Seri 14 dari 16.  
Fokus seri ini: memakai **TimescaleDB continuous aggregate** untuk rollup/downsampling time-series yang lebih otomatis daripada native materialized view/manual rollup table PostgreSQL.

Continuous aggregate di TimescaleDB menyimpan rollup yang sudah dihitung sebelumnya, sehingga query analitik tidak perlu scan ulang raw rows setiap kali. Polanya adalah: buat materialized view dengan `WITH (timescaledb.continuous)`, lalu tambahkan refresh policy atau refresh manual. TimescaleDB juga mendukung continuous aggregate di atas hypertable atau di atas continuous aggregate lain. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/create-a-continuous-aggregate/))

---

## 1. Mental Model

```text id="m06mw4"
Raw Hypertable
metric_sample
│
├─ event_time
├─ tenant_id
├─ source_id
├─ metric_name
├─ value_numeric
└─ quality fields
      │
      ▼
Continuous Aggregate
metric_rollup_15m_cagg
│
├─ time_bucket('15 minutes', event_time)
├─ avg/min/max/sum/count
├─ good_count / late_count
└─ materialized rollup data
      │
      ▼
Refresh Policy
│
├─ refresh trailing window
├─ skip still-open recent bucket
├─ reprocess invalidated buckets
└─ handle late-arriving data eventually
      │
      ▼
Dashboard / API
│
├─ short range → raw or real-time aggregate
├─ medium range → 15m cagg
└─ long range → 1h/1d hierarchical cagg
```

Continuous aggregate berbeda dari PostgreSQL materialized view biasa karena TimescaleDB menyimpan dan menyegarkan rollup berdasarkan time buckets. Tetapi ia tetap **eventually consistent**, bukan magic real-time truth untuk semua historical changes. Real-time aggregates bisa menambahkan raw data terbaru saat query, tetapi historical data yang masuk ke bucket yang sudah materialized tetap perlu scheduled refresh atau manual refresh. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/real-time-aggregates/))

---

## 2. Kapan Continuous Aggregate Layak Dipakai?

| Kondisi | Continuous aggregate cocok? | Catatan |
|---|---:|---|
| Dashboard range panjang | Ya | Hindari scan raw hypertable |
| Rollup 1m/15m/1h/1d | Ya | Use case utama |
| Data append-heavy | Ya | Sangat cocok |
| Late-arriving data masih ada | Ya, dengan refresh window benar | Jangan end_offset terlalu kecil |
| Backfill historis | Ya, dengan manual refresh | Refresh affected window |
| Report regulatory strict | Hati-hati | Perlu policy dan audit refresh |
| Query ad-hoc sangat dinamis | Tidak selalu | Cagg butuh definisi tetap |
| Multi-join kompleks | Tidak cocok | Cagg query punya batasan |
| Need exact latest raw value | Tidak | Pakai raw/current table |

---

## 3. Baseline Hypertable

```sql id="74z5g6"
create extension if not exists timescaledb;

create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_id        uuid not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    value_numeric   double precision,
    value_quality   text not null default 'GOOD',
    time_quality    text not null default 'NORMAL',

    tags            jsonb not null default '{}'::jsonb
);

select create_hypertable(
    'metric_sample',
    by_range('event_time', interval '1 day')
);
```

Index:

```sql id="rxlbg9"
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
)
include (
    value_numeric,
    value_quality,
    time_quality
);
```

---

# 4. Membuat Continuous Aggregate 15 Menit

Continuous aggregate dibuat dengan `CREATE MATERIALIZED VIEW ... WITH (timescaledb.continuous)`. Timescale docs menyebut continuous aggregate membutuhkan `time_bucket` pada time partitioning column hypertable, dan pembuatan cagg umumnya dua tahap: buat view, lalu tambahkan policy refresh. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/create-a-continuous-aggregate/))

```sql id="10spb6"
create materialized view metric_rollup_15m_cagg
with (
    timescaledb.continuous
) as
select
    tenant_id,
    source_id,
    metric_name,

    time_bucket(
        interval '15 minutes',
        event_time
    ) as bucket_start,

    count(*) as sample_count,
    count(*) filter (where value_quality = 'GOOD') as good_count,
    count(*) filter (where value_quality <> 'GOOD') as bad_count,
    count(*) filter (where time_quality = 'LATE') as late_count,

    avg(value_numeric) filter (where value_quality = 'GOOD') as avg_value,
    min(value_numeric) filter (where value_quality = 'GOOD') as min_value,
    max(value_numeric) filter (where value_quality = 'GOOD') as max_value,
    sum(value_numeric) filter (where value_quality = 'GOOD') as sum_value

from metric_sample
group by
    tenant_id,
    source_id,
    metric_name,
    bucket_start
with no data;
```

`WITH NO DATA` berguna saat view besar dibuat via migration, karena continuous aggregate default-nya `WITH DATA`, yang berarti saat dibuat ia langsung refresh semua data underlying. Jika tidak ingin initial refresh langsung, gunakan `WITH NO DATA`. ([Tiger Data Docs](https://docs.timescale.com/api/latest/continuous-aggregates/create_materialized_view/))

---

## 5. Initial Manual Refresh

```sql id="4yj9i2"
call refresh_continuous_aggregate(
    'metric_rollup_15m_cagg',
    timestamptz '2026-07-01 00:00:00+00',
    timestamptz '2026-07-15 00:00:00+00'
);
```

`refresh_continuous_aggregate()` melakukan manual refresh buckets continuous aggregate dalam refresh window. TimescaleDB hanya me-refresh bucket yang sepenuhnya masuk dalam window; bucket yang incomplete dalam window tidak dihitung. ([Tiger Data Docs](https://docs.timescale.com/api/latest/continuous-aggregates/refresh_continuous_aggregate/))

### Practical implication

Jika bucket size 15 menit:

```text id="drclhs"
refresh window:
10:00 → 11:00

bucket refreshed:
10:00-10:15
10:15-10:30
10:30-10:45
10:45-11:00

Jika window end = 10:52,
bucket 10:45-11:00 tidak complete, jadi tidak dihitung.
```

---

# 6. Refresh Policy

Refresh policy mengontrol kapan continuous aggregate mengejar perubahan dari source hypertable. Timescale docs menjelaskan refresh policy bisa scheduled atau manual untuk catch-up satu kali. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/refresh-policies/))

Contoh policy:

```sql id="gsz6d1"
select add_continuous_aggregate_policy(
    'metric_rollup_15m_cagg',
    start_offset => interval '7 days',
    end_offset   => interval '15 minutes',
    schedule_interval => interval '5 minutes'
);
```

Interpretasi:

```text id="hr89em"
Setiap 5 menit:
  refresh data dari now() - 7 days
  sampai now() - 15 minutes
```

### Kenapa `end_offset` tidak 0?

Karena bucket terbaru sering masih terbuka dan data masih datang. Dengan `end_offset => 15 minutes`, refresh policy tidak buru-buru materialize bucket yang mungkin belum lengkap.

---

## 7. Memilih `start_offset`, `end_offset`, dan `schedule_interval`

| Parameter | Arti | Rekomendasi awal |
|---|---|---|
| `start_offset` | seberapa jauh ke belakang policy refresh | lebih besar dari late-arrival window |
| `end_offset` | jarak dari now ke batas akhir refresh | minimal 1 bucket, atau sesuai lateness |
| `schedule_interval` | seberapa sering job jalan | 1-15 menit, tergantung SLA |

### Contoh policy berdasarkan late data

| Late data normal | Bucket | Policy awal |
|---:|---:|---|
| < 1 menit | 1m | `start_offset 1h`, `end_offset 2m` |
| < 15 menit | 15m | `start_offset 1d`, `end_offset 15m` |
| < 1 hari | 15m/1h | `start_offset 7d`, `end_offset 1h` |
| sampai 7 hari | 1h/1d | `start_offset 14d`, `end_offset 1d` |
| backfill historis | any | manual refresh affected window |

Timescale docs juga menyebut jika raw retention menghapus data lama dan Anda ingin cagg tetap menyimpan hasil lama, refresh policy perlu diatur agar tidak refresh data yang sudah di-drop dari source; misalnya menyesuaikan `start_offset` dengan retention policy. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/refresh-policies/?utm_source=chatgpt.com))

---

# 8. Real-Time Aggregates

Real-time aggregates menggabungkan materialized cagg dengan raw data terbaru saat query. TimescaleDB v2.13 dan yang lebih baru men-disable real-time aggregates secara default; versi sebelumnya enable secara default. Anda bisa mengubahnya dengan `timescaledb.materialized_only`. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/real-time-aggregates/))

Enable:

```sql id="6mwv98"
alter materialized view metric_rollup_15m_cagg
set (
    timescaledb.materialized_only = false
);
```

Disable:

```sql id="e36fgk"
alter materialized view metric_rollup_15m_cagg
set (
    timescaledb.materialized_only = true
);
```

### Kapan enable real-time aggregate?

| Enable jika | Disable jika |
|---|---|
| dashboard ingin data terbaru | report harus stabil |
| query recent range sering | raw recent data terlalu berat |
| freshness lebih penting dari repeatability | audit/regulatory report |
| raw latest window kecil | ingin hanya materialized result |
| open bucket boleh tampil | ingin exclude open bucket |

### Catatan penting

Real-time aggregate hanya otomatis menambahkan data yang lebih baru dari last materialized bucket. Jika historical data masuk ke bucket yang sudah materialized, data itu tidak otomatis muncul sampai scheduled refresh atau manual `refresh_continuous_aggregate()` dijalankan. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/real-time-aggregates/))

---

# 9. Query Continuous Aggregate

```sql id="2yyive"
select
    bucket_start,
    sample_count,
    good_count,
    bad_count,
    late_count,
    avg_value,
    min_value,
    max_value,
    sum_value
from metric_rollup_15m_cagg
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName
  and bucket_start >= :from
  and bucket_start <  :to
order by bucket_start;
```

Index pada continuous aggregate bisa dibuat seperti materialized view/table biasa:

```sql id="v1y6e4"
create index metric_rollup_15m_cagg_lookup_idx
on metric_rollup_15m_cagg (
    tenant_id,
    source_id,
    metric_name,
    bucket_start
);
```

---

# 10. Gap Filling dengan Continuous Aggregate

Timescale docs mencatat `time_bucket_gapfill` tidak bisa langsung dipakai dalam definisi continuous aggregate; workaround-nya adalah buat cagg dengan `time_bucket`, lalu lakukan gapfill saat query ke cagg. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/create-a-continuous-aggregate/?utm_source=chatgpt.com))

Query gap fill dari cagg:

```sql id="gczt06"
with buckets as (
    select generate_series(
        :from::timestamptz,
        :to::timestamptz - interval '15 minutes',
        interval '15 minutes'
    ) as bucket_start
)
select
    b.bucket_start,
    c.avg_value,
    coalesce(c.sample_count, 0) as sample_count,
    coalesce(c.good_count, 0) as good_count,
    coalesce(c.late_count, 0) as late_count,
    case
        when c.bucket_start is null then 'MISSING'
        when c.good_count = 0 then 'NO_GOOD_SAMPLE'
        when c.late_count > 0 then 'LATE_AFFECTED'
        else 'OK'
    end as bucket_quality
from buckets b
left join metric_rollup_15m_cagg c
  on c.tenant_id = :tenantId
 and c.source_id = :sourceId
 and c.metric_name = :metricName
 and c.bucket_start = b.bucket_start
order by b.bucket_start;
```

---

# 11. Late-Arriving Data

Continuous aggregates track invalidations from writes to source hypertables so refresh knows which time ranges changed. Timescale docs mention that every write to a hypertable with continuous aggregates records an invalidation entry for the next refresh. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/write-data/insert/?utm_source=chatgpt.com))

Namun dari sisi desain aplikasi, Anda tetap perlu policy:

```text id="8kxhg3"
late data <= refresh start_offset
  → akan ter-refresh oleh scheduled policy

late data older than start_offset
  → butuh manual refresh affected window

late data after raw retention drop
  → tidak bisa dihitung dari raw lagi
```

### Detect late data

```sql id="rs1qkw"
select
    count(*) as late_count
from metric_sample
where ingest_time >= clock_timestamp() - interval '1 hour'
  and ingest_time - event_time > interval '15 minutes';
```

### Manual refresh affected historical range

```sql id="2xzp3y"
call refresh_continuous_aggregate(
    'metric_rollup_15m_cagg',
    timestamptz '2026-07-01 00:00:00+00',
    timestamptz '2026-07-02 00:00:00+00'
);
```

---

# 12. Backfill Strategy dengan Cagg

Backfill historis harus diikuti refresh affected window.

```text id="m09psg"
1. Load historical data ke hypertable
2. Validate row count
3. Identify min/max event_time
4. Manual refresh continuous aggregate untuk affected window
5. Refresh hierarchical cagg di atasnya jika ada
6. Validate dashboard result
```

SQL affected range:

```sql id="eb1vcq"
select
    min(event_time) as min_event_time,
    max(event_time) as max_event_time
from metric_sample_staging
where batch_id = :batchId;
```

Manual refresh:

```sql id="4xa2f0"
call refresh_continuous_aggregate(
    'metric_rollup_15m_cagg',
    :minEventTime,
    :maxEventTime + interval '15 minutes'
);
```

Tambahkan `+ interval '15 minutes'` agar bucket terakhir masuk fully ke refresh window.

---

# 13. Hierarchical Continuous Aggregates

TimescaleDB memungkinkan continuous aggregate dibuat di atas continuous aggregate lain, misalnya 15m → 1h → 1d. Docs menyebut fitur hierarchical continuous aggregates tersedia sejak TimescaleDB 2.9 dan dapat menghemat resource karena daily summary bisa memakai hourly aggregate, bukan raw hypertable. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/hierarchical-continuous-aggregates/))

## 13.1 1-hour cagg dari 15-minute cagg

```sql id="hjmnzi"
create materialized view metric_rollup_1h_cagg
with (
    timescaledb.continuous
) as
select
    tenant_id,
    source_id,
    metric_name,

    time_bucket(
        interval '1 hour',
        bucket_start
    ) as bucket_start,

    sum(sample_count) as sample_count,
    sum(good_count) as good_count,
    sum(bad_count) as bad_count,
    sum(late_count) as late_count,

    sum(avg_value * good_count)
        / nullif(sum(good_count), 0) as avg_value,

    min(min_value) as min_value,
    max(max_value) as max_value,
    sum(sum_value) as sum_value

from metric_rollup_15m_cagg
group by
    tenant_id,
    source_id,
    metric_name,
    time_bucket(interval '1 hour', bucket_start)
with no data;
```

### Important

Average harus weighted:

```sql id="r6f5u0"
sum(avg_value * good_count) / nullif(sum(good_count), 0)
```

Jangan:

```sql id="wioet4"
avg(avg_value)
```

---

## 14. 1-Day Cagg dari 1-Hour Cagg

```sql id="wms0gk"
create materialized view metric_rollup_1d_cagg
with (
    timescaledb.continuous
) as
select
    tenant_id,
    source_id,
    metric_name,

    time_bucket(
        interval '1 day',
        bucket_start
    ) as bucket_start,

    sum(sample_count) as sample_count,
    sum(good_count) as good_count,
    sum(bad_count) as bad_count,
    sum(late_count) as late_count,

    sum(avg_value * good_count)
        / nullif(sum(good_count), 0) as avg_value,

    min(min_value) as min_value,
    max(max_value) as max_value,
    sum(sum_value) as sum_value

from metric_rollup_1h_cagg
group by
    tenant_id,
    source_id,
    metric_name,
    time_bucket(interval '1 day', bucket_start)
with no data;
```

Policy:

```sql id="h2ow36"
select add_continuous_aggregate_policy(
    'metric_rollup_1h_cagg',
    start_offset => interval '30 days',
    end_offset   => interval '1 hour',
    schedule_interval => interval '15 minutes'
);

select add_continuous_aggregate_policy(
    'metric_rollup_1d_cagg',
    start_offset => interval '1 year',
    end_offset   => interval '1 day',
    schedule_interval => interval '1 hour'
);
```

---

# 15. Percentile Warning

Percentile tidak bisa digabung sederhana. Jangan membuat 1h p95 dari 15m p95 dengan `avg(p95_value)` atau `max(p95_value)` jika Anda butuh p95 statistik yang benar.

| Aggregate | Hierarchical-safe? | Cara |
|---|---:|---|
| count | Ya | sum |
| sum | Ya | sum |
| min | Ya | min |
| max | Ya | max |
| avg | Ya | weighted by count |
| p95/p99 | Tidak sederhana | raw/histogram/approx sketch |

Jika p95/p99 critical, tentukan apakah dashboard butuh **approximate trend** atau **statistik exact**. Untuk exact p95 long range, sering tetap perlu raw/histogram/sketch design, bukan percentile-of-percentile.

---

# 16. Retention Policy untuk Raw Hypertable

Retention di TimescaleDB bekerja di level chunks, bukan row-by-row. Timescale docs menyatakan data retention membantu menghemat storage dengan menghapus data lama, dan bisa dikombinasikan dengan continuous aggregates untuk downsampling. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/data-retention/))

```sql id="co2ina"
select add_retention_policy(
    'metric_sample',
    drop_after => interval '90 days'
);
```

`add_retention_policy` membuat policy untuk membuang chunks lebih tua dari interval tertentu; `drop_after` memilih target chunk berdasarkan time range pada partitioning time column. ([Tiger Data Docs](https://docs.timescale.com/api/latest/data-retention/add_retention_policy/))

### Policy umum

```text id="d9y9a7"
raw hypertable:
  retain 90 days

15m continuous aggregate:
  retain 12 months

1h continuous aggregate:
  retain 3 years

1d continuous aggregate:
  retain 5+ years
```

---

# 17. Retention Policy untuk Continuous Aggregate

Retention juga bisa dipasang pada continuous aggregate.

```sql id="hzqijp"
select add_retention_policy(
    'metric_rollup_15m_cagg',
    drop_after => interval '12 months'
);
```

Cagg retention harus diselaraskan dengan dashboard/reporting kebutuhan. Jangan drop rollup yang masih dibutuhkan setelah raw data di-drop.

### Downsampling pattern

```text id="fv4erj"
raw data
  0-90 days

15m cagg
  0-12 months

1h cagg
  0-3 years

1d cagg
  0-7 years
```

---

# 18. Retention + Refresh Window Interaction

Ini kritikal.

Jika raw data di-drop setelah 90 hari, tapi cagg refresh policy `start_offset` = 180 hari, refresh policy bisa mencoba refresh range yang raw-nya sudah tidak ada. Ini bisa menyebabkan historical aggregate berubah menjadi kosong atau tidak sesuai tujuan.

Rekomendasi:

```text id="urodjb"
Raw retention = 90 days

Cagg refresh policy:
  start_offset <= 90 days
  atau lebih kecil sesuai late data window

Cagg retention:
  lebih panjang dari raw jika ingin downsampling
```

Timescale docs juga menyinggung bahwa jika Anda ingin continuous aggregate tetap menyimpan data saat underlying hypertable dihapus oleh retention, set `start_offset` agar policy tidak refresh data yang sudah di-drop. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/refresh-policies/?utm_source=chatgpt.com))

---

# 19. Columnstore Policy untuk Cagg

TimescaleDB hypercore mendukung memindahkan chunks ke columnstore. Untuk continuous aggregate, dokumentasi `add_columnstore_policy()` menyebut Anda perlu `ALTER MATERIALIZED VIEW` untuk enable columnstore pada cagg, lalu panggil `add_columnstore_policy`; API ini menggantikan `add_compression_policy()` yang deprecated sejak TimescaleDB 2.18.0. ([Tiger Data Docs](https://docs.timescale.com/api/latest/hypercore/add_columnstore_policy/))

Enable columnstore:

```sql id="xtrv12"
alter materialized view metric_rollup_15m_cagg
set (
    timescaledb.enable_columnstore = true,
    timescaledb.segmentby = 'tenant_id, source_id, metric_name',
    timescaledb.orderby = 'bucket_start DESC'
);
```

Add policy:

```sql id="i69ow1"
call add_columnstore_policy(
    'metric_rollup_15m_cagg',
    after => interval '30 days'
);
```

### Kapan cagg columnstore berguna?

| Berguna jika | Hati-hati jika |
|---|---|
| cagg besar | cagg kecil |
| query long-range analytic | query always recent |
| historical rollup jarang berubah | late refresh sering |
| storage pressure | policy/operation belum siap |
| dashboard scan banyak buckets | query sangat selective per row |

---

# 20. Query Source Selection di API

```text id="vjkazw"
range <= 1 hour
  → raw hypertable atau 1m cagg

range <= 30 days
  → 15m cagg

range <= 1 year
  → 1h cagg

range > 1 year
  → 1d cagg
```

Java:

```java id="bcx8xx"
public enum TimeseriesSource {
    RAW,
    CAGG_15M,
    CAGG_1H,
    CAGG_1D
}

public TimeseriesSource chooseSource(Duration range, Duration bucket) {
    if (range.compareTo(Duration.ofHours(1)) <= 0
        && bucket.compareTo(Duration.ofMinutes(1)) <= 0) {
        return TimeseriesSource.RAW;
    }

    if (range.compareTo(Duration.ofDays(30)) <= 0
        && bucket.compareTo(Duration.ofMinutes(15)) >= 0) {
        return TimeseriesSource.CAGG_15M;
    }

    if (range.compareTo(Duration.ofDays(365)) <= 0
        && bucket.compareTo(Duration.ofHours(1)) >= 0) {
        return TimeseriesSource.CAGG_1H;
    }

    return TimeseriesSource.CAGG_1D;
}
```

---

# 21. MyBatis Mapper untuk Cagg

```java id="7nc863"
public interface MetricCaggMapper {

    List<MetricRollupPoint> find15m(
        @Param("tenantId") long tenantId,
        @Param("sourceId") long sourceId,
        @Param("metricName") String metricName,
        @Param("from") Instant from,
        @Param("to") Instant to
    );

    List<MetricRollupPoint> find1h(
        @Param("tenantId") long tenantId,
        @Param("sourceId") long sourceId,
        @Param("metricName") String metricName,
        @Param("from") Instant from,
        @Param("to") Instant to
    );
}
```

XML:

```xml id="z5rqhe"
<select id="find15m" resultType="com.example.MetricRollupPoint">
    select
        bucket_start as bucketStart,
        sample_count as sampleCount,
        good_count as goodCount,
        bad_count as badCount,
        late_count as lateCount,
        avg_value as avgValue,
        min_value as minValue,
        max_value as maxValue,
        sum_value as sumValue
    from metric_rollup_15m_cagg
    where tenant_id = #{tenantId}
      and source_id = #{sourceId}
      and metric_name = #{metricName}
      and bucket_start >= #{from}
      and bucket_start &lt; #{to}
    order by bucket_start
</select>
```

---

# 22. Jersey Endpoint

```java id="zhq650"
@GET
@Path("/v1/metrics/{sourceId}/{metricName}/series")
@Produces(MediaType.APPLICATION_JSON)
public Response getSeries(
    @PathParam("sourceId") long sourceId,
    @PathParam("metricName") String metricName,
    @QueryParam("from") String fromText,
    @QueryParam("to") String toText,
    @QueryParam("bucket") @DefaultValue("auto") String bucketText
) {
    Instant from = OffsetDateTime.parse(fromText).toInstant();
    Instant to = OffsetDateTime.parse(toText).toInstant();

    if (!from.isBefore(to)) {
        throw new BadRequestException("from must be before to");
    }

    Duration range = Duration.between(from, to);
    BucketSize bucket = BucketSize.parseOrAuto(bucketText, range);

    validateBucketCount(from, to, bucket);

    MetricSeriesResponse response = metricQueryService.query(
        sourceId,
        metricName,
        from,
        to,
        bucket
    );

    return Response.ok(response).build();
}
```

Response:

```json id="gngeqe"
{
  "source": "metric_rollup_15m_cagg",
  "bucketSize": "PT15M",
  "materializedOnly": true,
  "points": [
    {
      "bucketStart": "2026-07-15T03:00:00Z",
      "avgValue": 31.4,
      "minValue": 30.9,
      "maxValue": 32.1,
      "sampleCount": 900,
      "goodCount": 895,
      "lateCount": 2
    }
  ]
}
```

---

# 23. Manual Refresh Admin Operation

Untuk backfill/correction, sediakan operation internal.

```java id="0ajoyg"
@Path("/internal/admin/timeseries/continuous-aggregates")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ContinuousAggregateAdminResource {

    private final ContinuousAggregateAdminService service;

    @POST
    @Path("/{name}/refresh")
    public Response refresh(
        @PathParam("name") String name,
        RefreshCaggRequest request
    ) {
        service.refresh(name, request.from(), request.to());
        return Response.accepted().build();
    }
}
```

Request:

```java id="3as481"
public record RefreshCaggRequest(
    OffsetDateTime from,
    OffsetDateTime to,
    String reason
) {}
```

Guard wajib:

| Guard | Alasan |
|---|---|
| internal only | refresh bisa mahal |
| allowlist cagg name | cegah SQL injection |
| max refresh window | hindari DB overload |
| audit log | siapa refresh apa |
| off-peak support | untuk refresh besar |
| chunk/window validation | jangan refresh raw retention dropped data |

---

# 24. MyBatis Admin Mapper

```java id="0ewif4"
public interface ContinuousAggregateAdminMapper {

    void refresh15m(
        @Param("from") Instant from,
        @Param("to") Instant to
    );

    void refresh1h(
        @Param("from") Instant from,
        @Param("to") Instant to
    );
}
```

XML:

```xml id="9tidiy"
<select id="refresh15m">
    call refresh_continuous_aggregate(
        'metric_rollup_15m_cagg',
        #{from},
        #{to}
    )
</select>

<select id="refresh1h">
    call refresh_continuous_aggregate(
        'metric_rollup_1h_cagg',
        #{from},
        #{to}
    )
</select>
```

Jangan menerima nama cagg bebas dari user lalu dimasukkan ke SQL dynamic tanpa allowlist.

---

# 25. Policy Observability

Timescale menyediakan informational views untuk policies/job di versi modern, dan docs `alter_policies` merujuk fungsi untuk melihat policy yang ada. Karena nama view/fungsi bisa berbeda antar versi TimescaleDB, buat abstraction di runbook dan cek docs versi yang dipakai. ([Tiger Data Docs](https://docs.timescale.com/api/latest/continuous-aggregates/alter_policies/))

Minimal yang perlu dimonitor:

| Metric | Makna |
|---|---|
| last successful refresh | freshness |
| failed job count | reliability |
| refresh duration | job cost |
| cagg lag | dashboard staleness |
| raw retention oldest chunk | raw availability |
| cagg retention oldest bucket | historical reporting |
| columnstore conversion lag | storage optimization |
| late data count | policy adequacy |
| manual refresh count | operational workload |

Cagg lag query:

```sql id="1ttxpf"
select
    max(bucket_start) as latest_bucket,
    clock_timestamp() - max(bucket_start) as cagg_lag
from metric_rollup_15m_cagg;
```

Late data summary:

```sql id="067v1t"
select
    case
        when ingest_time - event_time <= interval '15 minutes' then '<=15m'
        when ingest_time - event_time <= interval '1 day' then '<=1d'
        when ingest_time - event_time <= interval '7 days' then '<=7d'
        else '>7d'
    end as lateness_bucket,
    count(*) as row_count
from metric_sample
where ingest_time >= clock_timestamp() - interval '24 hours'
group by lateness_bucket
order by lateness_bucket;
```

---

# 26. Cagg Audit Table

Native policy/job metadata bisa cukup untuk operational monitoring, tapi untuk enterprise audit, buat table audit internal.

```sql id="8c5slk"
create table cagg_refresh_audit (
    refresh_id      uuid primary key,
    cagg_name       text not null,
    window_from     timestamptz not null,
    window_to       timestamptz not null,
    reason          text not null,
    requested_by    text,
    status          text not null,
    started_at      timestamptz not null default clock_timestamp(),
    completed_at    timestamptz,
    error_message   text,

    constraint cagg_refresh_audit_status_chk
        check (status in ('RUNNING', 'COMPLETED', 'FAILED'))
);
```

---

# 27. Runbook: Dashboard Stale

## Symptoms

```text id="pqupen"
dashboard tidak update
latest cagg bucket tertinggal
cagg_lag membesar
refresh policy job failed
```

## Investigation

```sql id="wbvnny"
select
    max(bucket_start) as latest_bucket,
    clock_timestamp() - max(bucket_start) as cagg_lag
from metric_rollup_15m_cagg;
```

Check raw data exists:

```sql id="kliohh"
select
    max(event_time) as latest_raw_event_time,
    max(ingest_time) as latest_ingest_time
from metric_sample
where tenant_id = :tenantId
  and source_id = :sourceId
  and metric_name = :metricName;
```

## Mitigation

```text id="jujpmu"
1. Cek apakah raw data masih masuk.
2. Cek refresh policy/job error.
3. Manual refresh trailing window kecil.
4. Jika late data banyak, perluas start_offset.
5. Jika job terlalu berat, kurangi frequency atau naikkan bucket size.
6. Untuk historical gap, manual refresh affected range.
```

Manual refresh:

```sql id="bqg2v7"
call refresh_continuous_aggregate(
    'metric_rollup_15m_cagg',
    clock_timestamp() - interval '1 day',
    clock_timestamp() - interval '15 minutes'
);
```

---

# 28. Runbook: Backfill Tidak Muncul di Cagg

## Symptoms

```text id="kzydqh"
raw backfill sudah masuk
query raw benar
query cagg belum berubah
```

## Cause

Backfill masuk ke bucket lama yang mungkin tidak tercakup scheduled refresh window. Real-time aggregate tidak otomatis memperbaiki already-materialized historical bucket. ([Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/real-time-aggregates/))

## Fix

```sql id="oi4h4x"
call refresh_continuous_aggregate(
    'metric_rollup_15m_cagg',
    :backfillFrom,
    :backfillTo + interval '15 minutes'
);
```

Jika hierarchical cagg:

```sql id="eyc0uo"
call refresh_continuous_aggregate(
    'metric_rollup_1h_cagg',
    :backfillFrom,
    :backfillTo + interval '1 hour'
);

call refresh_continuous_aggregate(
    'metric_rollup_1d_cagg',
    :backfillFrom,
    :backfillTo + interval '1 day'
);
```

---

# 29. Runbook: Refresh Job Terlalu Berat

## Symptoms

```text id="nm02em"
refresh duration lama
DB CPU/IO naik
query aplikasi ikut lambat
job overlap/backlog
```

## Likely causes

| Cause | Explanation |
|---|---|
| bucket terlalu kecil | terlalu banyak bucket |
| `start_offset` terlalu besar | refresh window terlalu luas |
| `schedule_interval` terlalu sering | job belum selesai sudah dijadwalkan lagi |
| cagg terlalu granular | group by terlalu banyak cardinality |
| raw data late sangat banyak | invalidation range luas |
| hierarchical refresh tidak efisien | refresh berantai salah window |
| query cagg definisi kompleks | aggregate mahal |

## Mitigation

```text id="rl1z1a"
1. Perbesar bucket size jika dashboard tidak butuh detail kecil.
2. Perpendek start_offset sesuai late window nyata.
3. Tambah end_offset agar open bucket tidak sering direfresh.
4. Jalankan manual refresh historical off-peak.
5. Gunakan hierarchical cagg untuk 1h/1d.
6. Kurangi cardinality group by jika memungkinkan.
7. Gunakan columnstore untuk cagg lama.
```

---

# 30. Runbook: Raw Retention Menghapus Data yang Masih Dibutuhkan Refresh

## Symptoms

```text id="v8xqi9"
historical cagg berubah/berlubang
manual refresh window lama tidak bisa benar
raw chunks sudah di-drop
```

## Prevention

```text id="9qz94y"
1. Set raw retention sesuai kebutuhan recompute.
2. Jangan refresh cagg untuk data yang raw-nya sudah di-drop.
3. Set cagg retention lebih panjang dari raw.
4. Export/archive raw sebelum retention jika recompute legal/reporting diperlukan.
5. Untuk regulated data, jangan auto-drop tanpa policy compliance.
```

---

# 31. Migration Tooling

Flyway example:

```text id="i4z506"
V001__enable_timescaledb.sql
V002__create_metric_sample_hypertable.sql
V003__create_metric_rollup_15m_cagg.sql
V004__refresh_metric_rollup_15m_initial.sql
V005__add_metric_rollup_15m_policy.sql
V006__create_metric_rollup_1h_cagg.sql
V007__add_retention_policies.sql
```

SQL:

```sql id="rxcyub"
-- V003
create materialized view metric_rollup_15m_cagg
with (timescaledb.continuous) as
select
    tenant_id,
    source_id,
    metric_name,
    time_bucket(interval '15 minutes', event_time) as bucket_start,
    count(*) as sample_count,
    avg(value_numeric) filter (where value_quality = 'GOOD') as avg_value
from metric_sample
group by
    tenant_id,
    source_id,
    metric_name,
    bucket_start
with no data;
```

```sql id="d6jlk3"
-- V005
select add_continuous_aggregate_policy(
    'metric_rollup_15m_cagg',
    start_offset => interval '7 days',
    end_offset => interval '15 minutes',
    schedule_interval => interval '5 minutes'
);
```

### Migration note

Initial refresh besar jangan selalu dimasukkan ke migration transaction utama. Untuk data besar, jalankan sebagai controlled operational job.

---

# 32. Anti-Patterns

| Anti-pattern | Dampak |
|---|---|
| Menganggap cagg selalu real-time | data terbaru/historical bisa stale |
| Tidak menambahkan refresh policy | cagg tidak update periodik |
| `end_offset = 0` tanpa alasan | bucket terbuka sering tidak stabil |
| `start_offset` lebih kecil dari late window | late data tidak masuk aggregate |
| Refresh window lebih tua dari raw retention | aggregate bisa berubah/berlubang |
| Backfill tanpa manual refresh cagg | dashboard tidak berubah |
| Percentile-of-percentile | statistik salah |
| Average-of-average tanpa weighting | angka salah |
| Satu cagg granular untuk semua range | query/storage tidak efisien |
| Cagg dengan group by cardinality terlalu tinggi | refresh mahal |
| Membuat cagg query terlalu kompleks/unsupported | create/refresh gagal |
| Nama cagg bebas dari API admin | SQL injection/operational risk |
| Tidak monitor refresh job | stale silently |
| Retention cagg lebih pendek dari kebutuhan report | data summary hilang |
| Columnstore policy terlalu agresif | refresh historical/late bisa mahal |

---

# 33. Production Checklist

| Checklist | Target |
|---|---|
| Hypertable sudah benar | `event_time` sebagai time dimension |
| Cagg memakai `time_bucket` | Ya |
| Cagg dibuat `WITH NO DATA` untuk data besar | Ya |
| Initial refresh controlled | Ya |
| Refresh policy ada | Ya |
| `start_offset` >= late data window | Ya |
| `end_offset` >= bucket/open-window tolerance | Ya |
| Backfill/correction trigger manual refresh | Ya |
| Real-time aggregate setting eksplisit | Ya |
| Gap filling dilakukan saat query | Ya |
| Hierarchical cagg untuk 1h/1d | Ya |
| Weighted average untuk rollup bertingkat | Ya |
| Percentile tidak digabung sembarangan | Ya |
| Retention raw dan cagg diselaraskan | Ya |
| Columnstore policy sesuai data age | Ya |
| Job/cagg lag dimonitor | Ya |
| Admin refresh diaudit | Ya |
| API query source selection jelas | Ya |

---

# 34. Recommended Baseline

Untuk production awal TimescaleDB time-series:

```text id="73pi7g"
Hypertable:
- metric_sample partitioned by event_time
- chunk interval 1 day untuk high ingest

Continuous aggregates:
- metric_rollup_15m_cagg dari raw
- metric_rollup_1h_cagg dari 15m
- metric_rollup_1d_cagg dari 1h

Refresh:
- 15m cagg: start_offset 7d, end_offset 15m, schedule 5m
- 1h cagg: start_offset 30d, end_offset 1h, schedule 15m
- 1d cagg: start_offset 1y, end_offset 1d, schedule 1h/daily

Retention:
- raw: 90d
- 15m: 12mo
- 1h: 3y
- 1d: 5y+

API:
- raw only short range
- 15m/1h/1d cagg by range
- response includes source, bucketSize, sampleCount, goodCount, lateCount
```

---

# Seri 14/16 Selesai

**Seri 14 selesai.**  
Materi ini menutup TimescaleDB continuous aggregates, refresh policy, real-time aggregate, late-arriving data, backfill refresh, hierarchical cagg, retention/downsampling, columnstore policy, MyBatis/Jersey integration, observability, runbook, dan anti-patterns.

## Rekomendasi materi selanjutnya

Lanjut ke **Seri 15/16 - Operational Monitoring: vacuum, bloat, WAL, slow query, partition/chunk growth, cagg lag, ingestion lag, backup/restore, dan production runbook untuk PostgreSQL time-series**.

---

**Sources:**

- [Create a continuous aggregate | Tiger Data Docs](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/create-a-continuous-aggregate/)

## Response:
7/15/2026, 9:02:45 PM

Saya lanjut ke **Seri 15/16**. Fokusnya operasional production: monitoring vacuum/autovacuum, bloat, WAL, slow query, partition/chunk growth, ingestion lag, rollup/cagg lag, backup/restore, dan runbook incident.

# PostgreSQL Time-Series Database - Seri 15/16  
## Operational Monitoring: Vacuum, Bloat, WAL, Slow Query, Partition/Chunk Growth, Cagg Lag, Ingestion Lag, Backup/Restore, dan Production Runbook

**Status:** Seri 15 dari 16.  
Fokus seri ini: cara mengoperasikan PostgreSQL time-series di production supaya tidak hanya “jalan”, tetapi juga **terpantau, cepat didiagnosis, aman di-recovery, dan tidak diam-diam rusak**.

---

## 1. Mental Model Monitoring Time-Series

Time-series workload punya karakteristik:

```text id="7h3vy9"
High ingest
  → WAL besar
  → index write overhead
  → autovacuum/analyze pressure
  → partition/chunk growth
  → storage growth
  → rollup/cagg lag
  → dashboard stale risk
```

Monitoring harus mencakup 8 area:

```text id="qcsnho"
Operational Monitoring
│
├─ 1. Ingestion health
├─ 2. Query performance
├─ 3. Vacuum / autovacuum
├─ 4. Bloat / dead tuples
├─ 5. WAL / checkpoint / replication
├─ 6. Partition / chunk / retention
├─ 7. Rollup / continuous aggregate lag
└─ 8. Backup / restore / PITR readiness
```

PostgreSQL menyediakan banyak view statistik seperti `pg_stat_activity`, `pg_stat_database`, `pg_stat_wal`, `pg_stat_user_tables`, `pg_stat_user_indexes`, `pg_statio_*`, dan progress views seperti `pg_stat_progress_vacuum`, `pg_stat_progress_create_index`, dan `pg_stat_progress_basebackup`. Dokumentasi PostgreSQL juga menekankan bahwa statistics views perlu digabung dengan OS-level monitoring untuk gambaran I/O yang lengkap. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html))

---

# 2. Monitoring Dashboard Minimal

Untuk time-series production, minimal dashboard harus punya:

| Area | Metric penting |
|---|---|
| Ingestion | rows/sec, batch latency, reject count, duplicate count |
| Ingestion lag | `ingest_time - event_time` p50/p95/p99 |
| Query | slow query, p95 latency, buffer read, temp file |
| Table health | live rows, dead rows, last vacuum, last analyze |
| Index | index size, index usage, index bloat suspicion |
| WAL | WAL bytes, WAL records, archive/replication lag |
| Storage | table/index/partition/chunk size |
| Partition/chunk | newest coverage, oldest retained, count growth |
| Rollup/cagg | latest bucket, lag, job failure |
| Backup | last backup time, backup verification, WAL archive continuity |
| Locks | blocked query, blocking query, long transaction |
| Connection | active/idle-in-transaction, pool saturation |

---

# 3. Ingestion Health

## 3.1 Latest ingest

```sql id="j5nwi7"
select
    max(ingest_time) as latest_ingest_time,
    clock_timestamp() - max(ingest_time) as ingest_staleness
from metric_sample;
```

## 3.2 Rows inserted per minute

```sql id="fj4pm6"
select
    date_trunc('minute', ingest_time) as minute_bucket,
    count(*) as row_count
from metric_sample
where ingest_time >= clock_timestamp() - interval '1 hour'
group by minute_bucket
order by minute_bucket;
```

## 3.3 Ingestion lag percentile

```sql id="k8m7rz"
select
    percentile_cont(0.50) within group (
        order by ingest_time - event_time
    ) as p50_lag,
    percentile_cont(0.95) within group (
        order by ingest_time - event_time
    ) as p95_lag,
    percentile_cont(0.99) within group (
        order by ingest_time - event_time
    ) as p99_lag
from metric_sample
where ingest_time >= clock_timestamp() - interval '1 hour';
```

## 3.4 Late data summary

```sql id="z7axel"
select
    case
        when ingest_time - event_time <= interval '1 minute' then '<=1m'
        when ingest_time - event_time <= interval '5 minutes' then '<=5m'
        when ingest_time - event_time <= interval '1 hour' then '<=1h'
        when ingest_time - event_time <= interval '1 day' then '<=1d'
        else '>1d'
    end as lateness_bucket,
    count(*) as row_count
from metric_sample
where ingest_time >= clock_timestamp() - interval '24 hours'
group by lateness_bucket
order by lateness_bucket;
```

### Alert awal

| Signal | Alert |
|---|---|
| latest ingest stale | tidak ada data baru > expected interval |
| p95 ingestion lag naik | pipeline delay |
| late data spike | source/broker/backfill issue |
| duplicate spike | retry/redelivery/client timeout |
| reject spike | upstream contract/data quality issue |

---

# 4. Duplicate / Reject Monitoring

Jika memakai `ingestion_batch`, `metric_sample_reject`, dan `ingestion_event_registry`:

```sql id="8y1vl8"
select
    status,
    count(*) as batch_count,
    sum(total_rows) as total_rows,
    sum(accepted_rows) as accepted_rows,
    sum(rejected_rows) as rejected_rows,
    sum(duplicate_rows) as duplicate_rows
from ingestion_batch
where received_at >= clock_timestamp() - interval '24 hours'
group by status
order by status;
```

Duplicate by source:

```sql id="w8mg5e"
select
    source_name,
    count(*) filter (where duplicate_count > 0) as events_with_duplicates,
    sum(duplicate_count) as duplicate_attempts
from ingestion_event_registry
where first_seen_at >= clock_timestamp() - interval '24 hours'
group by source_name
order by duplicate_attempts desc nulls last;
```

Reject reason:

```sql id="g36qqi"
select
    reject_reason,
    count(*) as reject_count
from metric_sample_reject
where rejected_at >= clock_timestamp() - interval '24 hours'
group by reject_reason
order by reject_count desc;
```

---

# 5. Active Query Monitoring

`pg_stat_activity` menampilkan satu row per server process dan berisi state, query, wait event, query start, transaction start, dan informasi koneksi. Ini adalah view utama untuk melihat aktivitas real-time PostgreSQL. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html))

```sql id="fubvu1"
select
    pid,
    usename,
    application_name,
    client_addr,
    state,
    wait_event_type,
    wait_event,
    now() - query_start as query_duration,
    now() - xact_start as transaction_duration,
    left(query, 500) as query_sample
from pg_stat_activity
where datname = current_database()
  and state <> 'idle'
order by query_duration desc nulls last;
```

### Yang dicari

| Signal | Kemungkinan masalah |
|---|---|
| query aktif lama | slow query / lock / bad plan |
| `idle in transaction` lama | vacuum tertahan, bloat naik |
| wait event lock | blocking transaction |
| banyak active query | pool terlalu besar / traffic spike |
| banyak query sama | endpoint noisy / retry storm |

---

# 6. Blocking Lock Detection

```sql id="g0zssg"
select
    blocked.pid as blocked_pid,
    blocked.usename as blocked_user,
    blocked.query as blocked_query,
    blocking.pid as blocking_pid,
    blocking.usename as blocking_user,
    blocking.query as blocking_query,
    now() - blocked.query_start as blocked_duration
from pg_stat_activity blocked
join pg_locks blocked_locks
  on blocked_locks.pid = blocked.pid
join pg_locks blocking_locks
  on blocking_locks.locktype = blocked_locks.locktype
 and blocking_locks.database is not distinct from blocked_locks.database
 and blocking_locks.relation is not distinct from blocked_locks.relation
 and blocking_locks.page is not distinct from blocked_locks.page
 and blocking_locks.tuple is not distinct from blocked_locks.tuple
 and blocking_locks.virtualxid is not distinct from blocked_locks.virtualxid
 and blocking_locks.transactionid is not distinct from blocked_locks.transactionid
 and blocking_locks.classid is not distinct from blocked_locks.classid
 and blocking_locks.objid is not distinct from blocked_locks.objid
 and blocking_locks.objsubid is not distinct from blocked_locks.objsubid
 and blocking_locks.pid <> blocked_locks.pid
join pg_stat_activity blocking
  on blocking.pid = blocking_locks.pid
where not blocked_locks.granted
order by blocked_duration desc;
```

### Runbook singkat

```text id="ui08up"
1. Identifikasi blocking_pid.
2. Cek query blocking dan transaction_duration.
3. Jika aman, terminate blocking backend.
4. Investigasi kenapa transaction lama.
5. Tambahkan timeout/guard di app.
```

Terminate hati-hati:

```sql id="h2wd6x"
select pg_terminate_backend(:blocking_pid);
```

---

# 7. Slow Query Monitoring dengan `pg_stat_statements`

`pg_stat_statements` adalah extension PostgreSQL untuk tracking planning dan execution statistics dari SQL statements. Extension ini perlu dimuat melalui `shared_preload_libraries`, membutuhkan restart untuk enable/disable di level server, dan diaktifkan di database dengan `CREATE EXTENSION pg_stat_statements`. ([PostgreSQL](https://www.postgresql.org/docs/current/pgstatstatements.html))

Setup:

```sql id="5jhz20"
create extension if not exists pg_stat_statements;
```

Top total time:

```sql id="6d4tvz"
select
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time,
    rows,
    shared_blks_hit,
    shared_blks_read,
    temp_blks_read,
    temp_blks_written,
    left(query, 500) as query_sample
from pg_stat_statements
order by total_exec_time desc
limit 20;
```

Top average latency:

```sql id="8se9yd"
select
    calls,
    mean_exec_time,
    max_exec_time,
    rows,
    left(query, 500) as query_sample
from pg_stat_statements
where calls >= 10
order by mean_exec_time desc
limit 20;
```

High temp usage:

```sql id="gyldxb"
select
    calls,
    temp_blks_read,
    temp_blks_written,
    mean_exec_time,
    left(query, 500) as query_sample
from pg_stat_statements
where temp_blks_written > 0
order by temp_blks_written desc
limit 20;
```

### Interpretasi

| Signal | Arti |
|---|---|
| high `total_exec_time` | query total paling mahal |
| high `mean_exec_time` | query per call lambat |
| high `calls` | query sangat sering |
| high `shared_blks_read` | banyak baca disk/cache miss |
| high `temp_blks_written` | sort/hash/window spill ke disk |
| high rows | result besar atau scan besar |

---

# 8. Validasi Query dengan `EXPLAIN`

`EXPLAIN` menampilkan execution plan. Opsi `ANALYZE` benar-benar mengeksekusi query dan menambahkan runtime statistics; karena itu, untuk statement yang mengubah data, gunakan transaction dan `ROLLBACK` jika ingin menganalisis tanpa menyimpan efeknya. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-explain.html))

```sql id="s2r0lx"
explain (analyze, buffers, wal, settings)
select
    bucket_start,
    avg_value,
    sample_count
from metric_rollup_15m
where tenant_id = 10
  and source_id = 1001
  and metric_name = 'temperature_celsius'
  and bucket_start >= timestamptz '2026-07-01 00:00:00+00'
  and bucket_start <  timestamptz '2026-07-02 00:00:00+00'
order by bucket_start;
```

Untuk DML:

```sql id="877tyn"
begin;

explain (analyze, buffers, wal)
insert into metric_sample (...)
values (...);

rollback;
```

### Yang dicek

| Check | Target |
|---|---|
| partition/chunk pruning | hanya range relevan |
| index scan | sesuai query owner |
| sort | tidak besar/spill |
| buffers read | tidak terlalu banyak disk read |
| WAL | insert/update menghasilkan WAL wajar |
| rows estimate | tidak meleset jauh |
| execution time | sesuai SLA |

---

# 9. Vacuum / Autovacuum Monitoring

PostgreSQL memakai `VACUUM` untuk membersihkan dead tuples dan menjaga kesehatan table; autovacuum otomatis bekerja berdasarkan aktivitas update/delete/insert dan statistik table. Untuk table yang dominan INSERT dan hampir tidak UPDATE/DELETE, dokumentasi PostgreSQL menyebut freeze tuning seperti `autovacuum_freeze_min_age` bisa relevan agar tuple lebih awal di-freeze oleh vacuum. ([PostgreSQL](https://www.postgresql.org/docs/current/routine-vacuuming.html?utm_source=chatgpt.com))

## 9.1 Table health

```sql id="h7h3pq"
select
    schemaname,
    relname,
    n_live_tup,
    n_dead_tup,
    n_mod_since_analyze,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze,
    vacuum_count,
    autovacuum_count,
    analyze_count,
    autoanalyze_count
from pg_stat_user_tables
where relname like 'metric_sample%'
order by n_dead_tup desc;
```

## 9.2 Dead tuple ratio

```sql id="1xxvk4"
select
    schemaname,
    relname,
    n_live_tup,
    n_dead_tup,
    round(
        100.0 * n_dead_tup / nullif(n_live_tup + n_dead_tup, 0),
        2
    ) as dead_tuple_pct,
    last_autovacuum,
    last_autoanalyze
from pg_stat_user_tables
where relname like 'metric_sample%'
order by dead_tuple_pct desc nulls last;
```

## 9.3 Progress vacuum

PostgreSQL memiliki progress views seperti `pg_stat_progress_vacuum` untuk backend yang sedang menjalankan `VACUUM`, termasuk autovacuum worker. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html))

```sql id="477wo1"
select
    pid,
    datname,
    relid::regclass as table_name,
    phase,
    heap_blks_total,
    heap_blks_scanned,
    heap_blks_vacuumed,
    index_vacuum_count,
    max_dead_tuples,
    num_dead_tuples
from pg_stat_progress_vacuum;
```

---

# 10. Autovacuum Tuning untuk Time-Series

Untuk append-heavy time-series, masalah utama sering bukan banyak dead tuples, tetapi:

```text id="8mzdi1"
- analyze terlambat setelah bulk ingest
- freeze age pada old partitions/chunks
- old idle transaction menahan vacuum
- delete-based retention menyebabkan bloat
- update current-state/alert table menghasilkan dead tuples
```

### Per-table setting contoh

```sql id="0hsjby"
alter table metric_sample
set (
    autovacuum_analyze_scale_factor = 0.02,
    autovacuum_analyze_threshold = 50000
);
```

Untuk table update-heavy seperti `metric_current_value`:

```sql id="4y3mux"
alter table metric_current_value
set (
    autovacuum_vacuum_scale_factor = 0.02,
    autovacuum_vacuum_threshold = 10000,
    autovacuum_analyze_scale_factor = 0.02,
    autovacuum_analyze_threshold = 10000
);
```

### Rule praktis

| Table type | Tuning |
|---|---|
| raw append-only partition | analyze lebih penting |
| current-state table | vacuum + analyze penting |
| staging table | truncate/drop lebih baik |
| rollup table | analyze setelah refresh besar |
| alert state table | vacuum penting karena update |
| registry table | vacuum jika duplicate update sering |

---

# 11. Bloat Detection

PostgreSQL core tidak menyediakan satu angka “bloat exact” yang sempurna tanpa extension/query estimasi. Untuk monitoring praktis, gunakan indikasi:

```text id="n9q3cw"
n_dead_tup tinggi
table/index size tumbuh tidak sejalan dengan rows
autovacuum tidak jalan
long transaction
retention pakai DELETE
update-heavy table
```

Table size:

```sql id="0m1wbj"
select
    relname as table_name,
    pg_size_pretty(pg_relation_size(relid)) as table_size,
    pg_size_pretty(pg_total_relation_size(relid)) as total_size,
    n_live_tup,
    n_dead_tup
from pg_stat_user_tables
where relname like 'metric%'
order by pg_total_relation_size(relid) desc;
```

Index size:

```sql id="znfcff"
select
    schemaname,
    relname as table_name,
    indexrelname as index_name,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
from pg_stat_user_indexes
where relname like 'metric%'
order by pg_relation_size(indexrelid) desc
limit 30;
```

### Mitigasi bloat

| Problem | Mitigasi |
|---|---|
| retention pakai `DELETE` | detach/drop partition/chunk |
| raw correction update | append correction event |
| current table update-heavy | vacuum tuning |
| index jarang dipakai besar | review/drop |
| partition tertentu bloat | `REINDEX CONCURRENTLY` per partition |
| long transaction | timeout dan app fix |

---

# 12. REINDEX Strategy

Untuk partition/chunk tertentu:

```sql id="dsow39"
reindex table metric_sample_2026_07_15;
```

Untuk index tertentu:

```sql id="uuvkj4"
reindex index concurrently metric_sample_2026_07_15_lookup_idx;
```

### Jangan langsung `REINDEX DATABASE`

| Lebih aman | Kenapa |
|---|---|
| reindex per partition/chunk | dampak kecil |
| jalankan off-peak | resource tinggi |
| gunakan concurrently jika perlu | kurangi blocking |
| monitor progress | long operation |
| validasi query setelahnya | pastikan index dipakai |

PostgreSQL menyediakan progress reporting untuk `CREATE INDEX` dan `REINDEX` melalui `pg_stat_progress_create_index`. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html))

```sql id="kwdcv5"
select
    pid,
    datname,
    relid::regclass as table_name,
    index_relid::regclass as index_name,
    command,
    phase,
    blocks_total,
    blocks_done,
    tuples_total,
    tuples_done
from pg_stat_progress_create_index;
```

---

# 13. WAL Monitoring

Time-series high-ingest menghasilkan WAL besar. PostgreSQL memiliki `pg_stat_wal`, satu row view yang menampilkan statistik aktivitas WAL. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html))

```sql id="eb50ab"
select
    wal_records,
    wal_fpi,
    wal_bytes,
    wal_buffers_full,
    wal_write,
    wal_sync,
    wal_write_time,
    wal_sync_time,
    stats_reset
from pg_stat_wal;
```

WAL bytes per time interval sebaiknya dihitung oleh monitoring system dengan mengambil delta `wal_bytes` antar scrape.

### WAL pressure signals

| Signal | Kemungkinan |
|---|---|
| `wal_bytes` naik tajam | ingest/backfill/index build |
| `wal_buffers_full` naik | WAL buffers pressure |
| `wal_sync_time` naik | fsync/storage latency |
| archive lag | archive destination lambat |
| replication lag | standby tertinggal |
| disk usage pg_wal naik | archive/replication slot issue |

PostgreSQL menyediakan parameter seperti `track_wal_io_timing` untuk monitoring WAL read/write/fsync time, namun ini perlu konfigurasi dan punya overhead sehingga harus diputuskan secara sadar. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html?utm_source=chatgpt.com))

---

# 14. Checkpoint / Background Writer

```sql id="v9m1qi"
select
    checkpoints_timed,
    checkpoints_req,
    checkpoint_write_time,
    checkpoint_sync_time,
    buffers_checkpoint,
    buffers_clean,
    maxwritten_clean,
    buffers_backend,
    buffers_backend_fsync,
    buffers_alloc,
    stats_reset
from pg_stat_bgwriter;
```

Pada PostgreSQL versi modern, `pg_stat_checkpointer` juga tersedia sebagai statistics view terpisah untuk checkpointer activity. ([PostgreSQL](https://www.postgresql.org/docs/current/monitoring-stats.html))

```sql id="xf272s"
select *
from pg_stat_checkpointer;
```

### Signal

| Signal | Kemungkinan |
|---|---|
| checkpoints_req tinggi | checkpoint terlalu sering karena WAL pressure |
| checkpoint_sync_time tinggi | disk fsync lambat |
| buffers_backend_fsync > 0 | backend ikut fsync, bisa latency spike |
| WAL disk cepat penuh | archive/replication lag atau ingest spike |

---

# 15. Replication / Archive Monitoring

Jika menggunakan streaming replication:

```sql id="s8gb39"
select
    application_name,
    client_addr,
    state,
    sync_state,
    write_lag,
    flush_lag,
    replay_lag,
    sent_lsn,
    write_lsn,
    flush_lsn,
    replay_lsn
from pg_stat_replication;
```

Jika menggunakan WAL archive:

```sql id="c1e0ix"
select
    archived_count,
    last_archived_wal,
    last_archived_time,
    failed_count,
    last_failed_wal,
    last_failed_time,
    stats_reset
from pg_stat_archiver;
```

Untuk PITR, PostgreSQL membutuhkan sequence WAL archive yang berkelanjutan minimal sejak awal base backup agar recovery berhasil. Karena itu WAL archiving harus disetup dan diuji sebelum base backup pertama. ([PostgreSQL](https://www.postgresql.org/docs/current/continuous-archiving.html?utm_source=chatgpt.com))

---

# 16. Partition Monitoring - Native PostgreSQL

## 16.1 Partition count

```sql id="pqfy5b"
select
    inhparent::regclass as parent_table,
    count(*) as partition_count
from pg_inherits
where inhparent = 'metric_sample'::regclass
group by inhparent;
```

## 16.2 Partition size

```sql id="n8x148"
select
    inhrelid::regclass as partition_name,
    pg_size_pretty(pg_total_relation_size(inhrelid)) as total_size
from pg_inherits
where inhparent = 'metric_sample'::regclass
order by pg_total_relation_size(inhrelid) desc
limit 30;
```

## 16.3 Future partition coverage

Jika memakai `time_partition_registry`:

```sql id="cc0pj1"
select
    max(range_to) as active_covered_until,
    max(range_to) - clock_timestamp() as coverage_remaining
from time_partition_registry
where parent_table = 'metric_sample'
  and lifecycle_status = 'ACTIVE';
```

Alert:

| Condition | Severity |
|---|---|
| coverage < 2 hari | warning |
| coverage < 1 hari | critical |
| current partition missing | critical |
| default partition rows > 0 | warning/critical |

---

# 17. TimescaleDB Chunk Monitoring

TimescaleDB menyediakan informational views untuk melihat metadata hypertable, chunk, continuous aggregate, dan job automation. `timescaledb_information.job_stats` berisi statistik job automation framework, termasuk job dari policies, sementara `timescaledb_information.continuous_aggregates` menyimpan metadata/settings continuous aggregate. ([TigerData](https://www.tigerdata.com/docs/reference/timescaledb/informational-views/job_stats?utm_source=chatgpt.com))

Chunk list:

```sql id="b6n5q3"
select
    hypertable_schema,
    hypertable_name,
    chunk_schema,
    chunk_name,
    range_start,
    range_end
from timescaledb_information.chunks
where hypertable_name = 'metric_sample'
order by range_start desc;
```

Chunk count:

```sql id="qczcrf"
select
    hypertable_name,
    count(*) as chunk_count,
    min(range_start) as oldest_chunk_start,
    max(range_end) as newest_chunk_end
from timescaledb_information.chunks
group by hypertable_name
order by chunk_count desc;
```

Job stats:

```sql id="m6yndu"
select
    job_id,
    application_name,
    schedule_interval,
    last_start,
    last_finish,
    last_successful_finish,
    last_run_status,
    total_runs,
    total_successes,
    total_failures
from timescaledb_information.job_stats
order by last_start desc nulls last;
```

Cagg metadata:

```sql id="mp7ohc"
select
    view_schema,
    view_name,
    materialized_only,
    compression_enabled
from timescaledb_information.continuous_aggregates
order by view_schema, view_name;
```

---

# 18. Rollup / Cagg Lag Monitoring

Native rollup table:

```sql id="of1n0c"
select
    max(bucket_start) as latest_rollup_bucket,
    clock_timestamp() - max(bucket_start) as rollup_lag
from metric_rollup_15m;
```

Timescale continuous aggregate:

```sql id="kes3ru"
select
    max(bucket_start) as latest_cagg_bucket,
    clock_timestamp() - max(bucket_start) as cagg_lag
from metric_rollup_15m_cagg;
```

Dirty bucket backlog:

```sql id="dlo33u"
select
    bucket_size,
    reason,
    count(*) as dirty_bucket_count,
    min(marked_at) as oldest_marked_at,
    clock_timestamp() - min(marked_at) as oldest_age
from metric_rollup_dirty_bucket
group by bucket_size, reason
order by dirty_bucket_count desc;
```

### Alert

| Signal | Alert |
|---|---|
| rollup/cagg lag > SLA | dashboard stale |
| dirty bucket backlog naik | late/backfill/worker issue |
| job failure > 0 | refresh broken |
| latest raw ada tapi latest cagg tidak maju | cagg policy issue |
| cagg refresh duration naik | query/storage pressure |

---

# 19. Storage Monitoring

Total database size:

```sql id="h9mtkk"
select
    pg_size_pretty(pg_database_size(current_database())) as database_size;
```

Largest relations:

```sql id="0dprhh"
select
    n.nspname as schema_name,
    c.relname as relation_name,
    c.relkind,
    pg_size_pretty(pg_total_relation_size(c.oid)) as total_size,
    pg_total_relation_size(c.oid) as total_size_bytes
from pg_class c
join pg_namespace n
  on n.oid = c.relnamespace
where n.nspname not in ('pg_catalog', 'information_schema')
order by pg_total_relation_size(c.oid) desc
limit 30;
```

Table vs index size:

```sql id="hcsuqn"
select
    relname as table_name,
    pg_size_pretty(pg_relation_size(relid)) as heap_size,
    pg_size_pretty(pg_indexes_size(relid)) as index_size,
    pg_size_pretty(pg_total_relation_size(relid)) as total_size
from pg_stat_user_tables
order by pg_total_relation_size(relid) desc
limit 30;
```

---

# 20. Backup / Restore / PITR Readiness

`pg_basebackup` mengambil base backup dari running PostgreSQL cluster tanpa mengganggu client database lain dan bisa digunakan untuk PITR atau membuat standby streaming/log-shipping. ([PostgreSQL](https://www.postgresql.org/docs/current/app-pgbasebackup.html?utm_source=chatgpt.com))

Backup command example:

```bash id="1q20zb"
pg_basebackup \
  -h primary-db \
  -U replicator \
  -D /backups/base/2026-07-15 \
  -Fp \
  -Xs \
  -P \
  -R
```

Verifikasi backup:

```bash id="2ixkh5"
pg_verifybackup /backups/base/2026-07-15
```

`pg_verifybackup` memeriksa integritas backup yang dibuat `pg_basebackup` menggunakan backup manifest dari server. ([PostgreSQL](https://www.postgresql.org/docs/current/app-pgverifybackup.html?utm_source=chatgpt.com))

### Checklist backup

| Checklist | Target |
|---|---|
| base backup terjadwal | Ya |
| WAL archiving aktif | Ya |
| WAL archive continuity | Ya |
| backup manifest diverifikasi | Ya |
| restore drill | minimal periodik |
| PITR target diuji | Ya |
| RPO/RTO terdokumentasi | Ya |
| backup encryption | sesuai policy |
| offsite/object storage | Ya |
| retention backup | jelas |
| runbook restore | tersedia |

---

# 21. PITR Runbook Singkat

```text id="tfp9vk"
1. Tentukan target recovery time.
2. Siapkan base backup sebelum target time.
3. Pastikan WAL archive lengkap.
4. Restore base backup ke server baru.
5. Configure restore_command.
6. Set recovery_target_time.
7. Start PostgreSQL.
8. Validate data.
9. Promote jika benar.
10. Repoint aplikasi jika perlu.
```

Contoh recovery config modern biasanya memakai file konfigurasi dan signal file sesuai versi PostgreSQL. Detail restore harus disesuaikan dengan deployment: bare metal, VM, Kubernetes StatefulSet, managed cloud, atau backup operator.

---

# 22. Java/Jersey/MyBatis Operational Health Endpoint

Endpoint internal health tidak boleh expose data sensitif, tapi boleh expose status ringkas.

```java id="un2sqw"
@Path("/internal/health/timeseries")
@Produces(MediaType.APPLICATION_JSON)
public class TimeseriesHealthResource {

    private final TimeseriesHealthService service;

    @GET
    public Response health() {
        return Response.ok(service.getHealth()).build();
    }
}
```

Response:

```json id="twg45p"
{
  "ingestion": {
    "latestIngestTime": "2026-07-15T12:00:00Z",
    "ingestStalenessSeconds": 12,
    "p95LagSeconds": 8
  },
  "rollup": {
    "latestBucket": "2026-07-15T11:45:00Z",
    "lagSeconds": 900,
    "dirtyBucketCount": 0
  },
  "storage": {
    "databaseSizeBytes": 1234567890
  },
  "status": "OK"
}
```

### Guard

| Guard | Alasan |
|---|---|
| internal only | security |
| no raw query text | avoid leakage |
| no secrets | obvious |
| aggregate status only | safe |
| fast query only | health endpoint tidak boleh membebani DB |
| timeout pendek | fail fast |

---

# 23. MyBatis Health Mapper

```java id="97vtbs"
public interface TimeseriesHealthMapper {

    IngestionHealthRow findIngestionHealth();

    RollupHealthRow findRollupHealth();

    List<TableHealthRow> findLargestTables();
}
```

XML:

```xml id="aojrsp"
<select id="findIngestionHealth" resultType="com.example.IngestionHealthRow">
    select
        max(ingest_time) as latestIngestTime,
        extract(epoch from clock_timestamp() - max(ingest_time)) as ingestStalenessSeconds
    from metric_sample
    where ingest_time >= clock_timestamp() - interval '1 day'
</select>

<select id="findRollupHealth" resultType="com.example.RollupHealthRow">
    select
        max(bucket_start) as latestBucket,
        extract(epoch from clock_timestamp() - max(bucket_start)) as lagSeconds
    from metric_rollup_15m
</select>
```

---

# 24. Production Alert Threshold Starting Point

| Alert | Starting threshold |
|---|---|
| ingest stale | > 2-5× expected interval |
| p95 ingest lag | > SLA |
| reject rate | > baseline + anomaly |
| duplicate rate | sudden spike |
| cagg/rollup lag | > 2 bucket intervals |
| dirty bucket oldest age | > 15-60 min |
| future partition coverage | < 2 days |
| default partition rows | > 0 |
| dead tuple pct current table | > 20-30% |
| long transaction | > 5-15 min |
| blocked query | > 30-60 sec |
| WAL archive failure | any recent failure |
| replication lag | > RPO tolerance |
| disk usage | > 80%, critical > 90% |
| backup age | > schedule + tolerance |
| restore drill age | too old per policy |

Threshold harus di-tuning berdasarkan baseline real production, bukan angka generik saja.

---

# 25. Runbook: Ingestion Stale

## Symptoms

```text id="nypt8n"
latestIngestTime lama
rows/sec turun ke 0
dashboard data tidak update
```

## Investigation

```sql id="nd4gj7"
select
    max(ingest_time) as latest_ingest,
    clock_timestamp() - max(ingest_time) as staleness
from metric_sample;
```

Check active sessions:

```sql id="x4ftc5"
select
    pid,
    state,
    wait_event_type,
    wait_event,
    now() - query_start as duration,
    left(query, 300) as query_sample
from pg_stat_activity
where datname = current_database()
  and state <> 'idle'
order by duration desc;
```

## Mitigation

```text id="k8cwx0"
1. Cek app ingestion worker/API.
2. Cek broker lag atau upstream feed.
3. Cek DB connection pool saturation.
4. Cek partition/chunk availability.
5. Cek lock/blocking query.
6. Cek disk/WAL full.
7. Reprocess from broker/staging setelah stabil.
```

---

# 26. Runbook: Query Lambat

## Symptoms

```text id="6rz3lr"
API p95 naik
dashboard lambat
pg_stat_statements menunjukkan query mahal
```

## Investigation

```sql id="qshg3n"
select
    calls,
    mean_exec_time,
    max_exec_time,
    shared_blks_read,
    temp_blks_written,
    left(query, 500) as query_sample
from pg_stat_statements
order by mean_exec_time desc
limit 20;
```

Then:

```sql id="5c9vrh"
explain (analyze, buffers)
-- paste normalized query with representative params
select ...;
```

## Common fixes

```text id="1rr1sr"
1. Tambahkan mandatory from/to.
2. Pakai rollup/cagg untuk range panjang.
3. Perbaiki index order.
4. Hindari function pada event_time di WHERE.
5. Batasi output/bucket count.
6. Jalankan ANALYZE pada partition/chunk baru.
7. Revisit query source selection.
```

---

# 27. Runbook: Autovacuum Tidak Mengejar

## Symptoms

```text id="xsx2sx"
n_dead_tup naik
table/index size tumbuh
query melambat
autovacuum jarang/terlambat
```

## Investigation

```sql id="d9adpn"
select
    relname,
    n_live_tup,
    n_dead_tup,
    last_autovacuum,
    autovacuum_count,
    now() - last_autovacuum as since_last_autovacuum
from pg_stat_user_tables
where n_dead_tup > 0
order by n_dead_tup desc;
```

Check long transactions:

```sql id="u6q9nl"
select
    pid,
    state,
    now() - xact_start as xact_age,
    left(query, 300) as query_sample
from pg_stat_activity
where xact_start is not null
order by xact_age desc;
```

## Mitigation

```text id="i9zyym"
1. Kill/fix idle-in-transaction yang lama.
2. Tuning autovacuum per table update-heavy.
3. Hindari delete retention besar.
4. Jalankan manual VACUUM/ANALYZE jika perlu.
5. Reindex partition/index bloat jika perlu.
```

---

# 28. Runbook: WAL / Disk Pressure

## Symptoms

```text id="psxsm4"
disk pg_wal membesar
archive failure
replication lag
write latency naik
```

## Investigation

```sql id="oijxd3"
select *
from pg_stat_wal;
```

```sql id="xkclrt"
select *
from pg_stat_archiver;
```

```sql id="t9t8fn"
select
    application_name,
    state,
    write_lag,
    flush_lag,
    replay_lag
from pg_stat_replication;
```

## Mitigation

```text id="fphyn0"
1. Cek archive destination.
2. Cek replication slot/standby lag.
3. Stop/slow backfill besar sementara.
4. Pastikan disk tidak penuh.
5. Scale storage/I/O jika bottleneck.
6. Review batch size dan index count.
```

---

# 29. Runbook: Rollup / Cagg Stale

## Symptoms

```text id="5kjb83"
raw data masuk
rollup/cagg tidak update
dashboard stale
```

## Investigation

```sql id="eczmk4"
select
    max(event_time) as latest_raw,
    max(ingest_time) as latest_ingest
from metric_sample;
```

```sql id="u1o8qn"
select
    max(bucket_start) as latest_rollup,
    clock_timestamp() - max(bucket_start) as lag
from metric_rollup_15m;
```

Timescale job stats:

```sql id="gjtv5v"
select
    job_id,
    application_name,
    last_start,
    last_finish,
    last_successful_finish,
    last_run_status,
    total_failures
from timescaledb_information.job_stats
order by last_start desc nulls last;
```

## Mitigation

```text id="ycjdyw"
1. Jika native rollup, proses dirty bucket.
2. Jika Timescale cagg, manual refresh affected window.
3. Cek refresh policy/job failure.
4. Cek late data melebihi refresh start_offset.
5. Cek raw retention belum menghapus source data.
```

---

# 30. Runbook: Partition/Chunk Explosion

## Symptoms

```text id="tc71al"
planning lambat
metadata query lambat
partition/chunk count sangat tinggi
```

## Native partition check

```sql id="yhwvs4"
select
    count(*) as partition_count
from pg_inherits
where inhparent = 'metric_sample'::regclass;
```

## Timescale chunk check

```sql id="d87fli"
select
    hypertable_name,
    count(*) as chunk_count
from timescaledb_information.chunks
group by hypertable_name
order by chunk_count desc;
```

## Mitigation

```text id="wyjj7u"
1. Evaluasi granularity partition/chunk interval.
2. Cek retention policy.
3. Drop/archive old partition/chunk jika policy mengizinkan.
4. Hindari hourly partition jika volume tidak butuh.
5. Untuk Timescale, adjust future chunk interval setelah benchmark.
```

---

# 31. Anti-Patterns

| Anti-pattern | Dampak |
|---|---|
| Tidak memakai `pg_stat_statements` | sulit tahu query mahal |
| Health check menjalankan query berat | health endpoint memperparah incident |
| Monitoring hanya CPU/RAM | DB-level issue tidak terlihat |
| Tidak monitor ingestion lag | pipeline delay tidak ketahuan |
| Tidak monitor cagg/rollup lag | dashboard diam-diam stale |
| Retention pakai `DELETE` besar | bloat, WAL spike |
| Tidak cek long transaction | vacuum tertahan |
| Backfill production tanpa throttle | WAL/disk/query latency spike |
| Tidak test restore | backup belum tentu usable |
| Tidak monitor WAL archive | PITR bisa gagal |
| Tidak punya future partition coverage alert | ingest bisa tiba-tiba gagal |
| Membuat terlalu banyak index | write overhead dan storage naik |
| Query raw untuk dashboard long-range | DB overload |
| Tidak `ANALYZE` setelah bulk load | planner salah estimasi |
| Terminate query tanpa RCA | incident berulang |

---

# 32. Production Checklist

| Checklist | Target |
|---|---|
| `pg_stat_statements` enabled | Ya |
| Ingestion lag p50/p95/p99 monitored | Ya |
| Reject/duplicate monitored | Ya |
| Active/blocked query dashboard | Ya |
| Long transaction alert | Ya |
| Dead tuple and autovacuum monitored | Ya |
| Table/index size monitored | Ya |
| WAL bytes/archive/replication monitored | Ya |
| Partition/chunk count monitored | Ya |
| Future partition coverage monitored | Ya |
| Rollup/cagg lag monitored | Ya |
| Dirty bucket backlog monitored | Ya |
| Timescale job stats monitored jika pakai TimescaleDB | Ya |
| Backup age monitored | Ya |
| WAL archive continuity checked | Ya |
| Restore drill scheduled | Ya |
| Runbook incident tersedia | Ya |
| Health endpoint lightweight | Ya |
| Query source selection raw vs rollup/cagg enforced | Ya |

---

# 33. Recommended Monitoring Stack

Untuk stack Java/Jersey/MyBatis + PostgreSQL:

```text id="szacm0"
Application:
- request latency
- DB query latency
- ingestion rows/sec
- batch size
- reject/duplicate count
- queue depth/broker lag

PostgreSQL:
- pg_stat_activity
- pg_stat_statements
- pg_stat_user_tables
- pg_stat_user_indexes
- pg_stat_wal
- pg_stat_archiver
- pg_stat_replication
- pg_stat_progress_*

Time-series domain:
- latest ingest
- ingestion lag
- partition/chunk coverage
- rollup/cagg lag
- dirty bucket backlog
- late data distribution
- completeness ratio

Infrastructure:
- disk usage
- disk IOPS/latency
- CPU
- memory
- network
- backup storage
```

---

# Seri 15/16 Selesai

**Seri 15 selesai.**  
Materi ini menutup operational monitoring PostgreSQL time-series: ingestion health, duplicate/reject monitoring, active query, lock, `pg_stat_statements`, `EXPLAIN`, vacuum/autovacuum, bloat, WAL, checkpoint, replication/archive, partition/chunk growth, rollup/cagg lag, backup/PITR, Java/Jersey/MyBatis health endpoint, alert threshold, dan runbook incident.

## Rekomendasi materi selanjutnya

Lanjut ke **Seri 16/16 - Production Architecture: Java/Jersey/MyBatis API, ingestion pipeline, dashboard query layer, alerting, runbook, deployment topology on Docker/Kubernetes/On-Prem/AWS/Azure, dan final end-to-end reference architecture**.

---

**Sources:**

- [PostgreSQL: Documentation: 18: 27.2. The Cumulative Statistics System](https://www.postgresql.org/docs/current/monitoring-stats.html)
- [timescaledb_information.job_stats | Tiger Data Docs](https://www.tigerdata.com/docs/reference/timescaledb/informational-views/job_stats?utm_source=chatgpt.com)

## Response:
7/15/2026, 9:05:45 PM

# PostgreSQL Time-Series Database - Seri 16/16  
## Production Architecture: Java/Jersey/MyBatis API, Ingestion Pipeline, Dashboard Query Layer, Alerting, Runbook, Docker/Kubernetes/On-Prem/AWS/Azure, dan End-to-End Reference Architecture

**Status:** Seri 16 dari 16 - seri terakhir.  
Fokus seri ini: menyatukan semua materi PostgreSQL time-series menjadi **arsitektur production end-to-end** yang bisa dipakai sebagai reference saat onboarding atau desain sistem.

---

## 1. Big Picture Architecture

```text
Client / Device / Upstream System
        │
        ▼
API Gateway / Load Balancer
        │
        ▼
Jersey / JAX-RS Ingestion API
        │
        ├─ request validation
        ├─ tenant/auth context
        ├─ idempotency key
        ├─ payload hash
        ├─ batch size guard
        └─ backpressure
        │
        ▼
Ingestion Service
        │
        ├─ online small batch
        ├─ broker consumer batch
        ├─ file/backfill import
        ├─ reject table
        ├─ duplicate registry
        └─ partition/chunk readiness
        │
        ▼
PostgreSQL / TimescaleDB
        │
        ├─ raw metric/event table
        ├─ current-state table
        ├─ rollup / continuous aggregate
        ├─ alert state
        ├─ operational audit
        └─ backup / PITR
        │
        ▼
Query API / Dashboard / Alerting / Reports
```

Kubernetes cocok sebagai runtime aplikasi karena menyediakan mekanisme deployment, scaling, dan management containerized workloads; untuk maintenance berkala seperti rollup refresh, retention, dan partition job, Kubernetes `CronJob` memang dirancang untuk menjalankan Job berulang sesuai jadwal cron. ([Kubernetes](https://kubernetes.io/?utm_source=chatgpt.com))

---

## 2. Komponen Utama

| Komponen | Tanggung jawab |
|---|---|
| **Jersey API** | menerima ingest/query request, validasi, auth, guard |
| **Ingestion Service** | batching, idempotency, retry, reject, duplicate handling |
| **MyBatis Mapper** | SQL eksplisit, query owner jelas, tidak dynamic liar |
| **Raw Table** | immutable append-heavy time-series |
| **Current Table** | latest/current value per entity |
| **Rollup/Cagg** | dashboard/reporting range medium-long |
| **Alert Evaluator** | evaluasi SLA/anomaly/completeness |
| **Operational Tables** | batch status, reject, duplicate, refresh audit |
| **Scheduler** | partition/rollup/cagg/retention/backup job |
| **Observability** | metrics, logs, traces, DB stats, runbook |
| **Backup/Restore** | base backup, WAL archive, PITR drill |

---

# 3. Production Data Model

## 3.1 Raw time-series table

```sql
create table metric_sample (
    tenant_id       bigint not null,
    source_id       bigint not null,
    event_id        uuid not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null default clock_timestamp(),

    value_numeric   double precision,
    value_text      text,

    value_quality   text not null default 'GOOD',
    time_quality    text not null default 'NORMAL',

    correction_of_event_id uuid,
    correction_reason      text,

    tags            jsonb not null default '{}'::jsonb,

    constraint metric_sample_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            event_time,
            event_id
        ),

    constraint metric_sample_value_chk
        check (
            value_numeric is not null
            or value_text is not null
        ),

    constraint metric_sample_value_quality_chk
        check (
            value_quality in (
                'GOOD',
                'BAD',
                'ESTIMATED',
                'MISSING',
                'CORRECTED'
            )
        ),

    constraint metric_sample_time_quality_chk
        check (
            time_quality in (
                'NORMAL',
                'LATE',
                'FUTURE_SKEW',
                'MISSING_SOURCE_TIME',
                'REPLAYED',
                'CORRECTED'
            )
        )
)
partition by range (event_time);
```

Untuk native PostgreSQL, gunakan range partition by `event_time`. Untuk TimescaleDB, table ini bisa dijadikan hypertable. TimescaleDB hypertable otomatis mempartisi data time-series berdasarkan waktu ke chunks, sedangkan continuous aggregates menyimpan analytic summaries yang di-refresh di background. ([TigerData](https://www.tigerdata.com/docs/learn/continuous-aggregates?utm_source=chatgpt.com))

---

## 3.2 Index baseline

```sql
create index metric_sample_lookup_idx
on metric_sample (
    tenant_id,
    source_id,
    metric_name,
    event_time desc
)
include (
    value_numeric,
    value_quality,
    time_quality
);

create index metric_sample_event_time_brin_idx
on metric_sample using brin (
    event_time
);

create index metric_sample_ingest_time_idx
on metric_sample (
    ingest_time desc
);
```

Baseline ini mendukung:

| Query | Index |
|---|---|
| range query per source/metric | `metric_sample_lookup_idx` |
| latest value | `event_time desc` |
| large time scan | BRIN |
| ingestion observability | `ingest_time desc` |

---

## 3.3 Idempotency registry

```sql
create table ingestion_event_registry (
    tenant_id        bigint not null,
    event_id         uuid not null,

    source_name      text not null,
    first_seen_at    timestamptz not null default clock_timestamp(),
    first_batch_id   uuid,
    first_event_time timestamptz,

    payload_hash     text,

    duplicate_count  bigint not null default 0,
    last_seen_at     timestamptz,

    constraint ingestion_event_registry_pk
        primary key (tenant_id, event_id)
);
```

Pattern:

```text
event diterima
  → register tenant_id + event_id
  → jika baru: insert raw
  → jika duplicate same payload: idempotent success
  → jika duplicate beda payload: reject / 409 / DLQ
```

---

## 3.4 Current-state table

```sql
create table metric_current_value (
    tenant_id       bigint not null,
    source_id       bigint not null,
    metric_name     text not null,

    event_time      timestamptz not null,
    ingest_time     timestamptz not null,

    value_numeric   double precision,
    value_text      text,

    value_quality   text not null,
    time_quality    text not null,

    updated_at      timestamptz not null default clock_timestamp(),

    constraint metric_current_value_pk
        primary key (
            tenant_id,
            source_id,
            metric_name
        )
);
```

Upsert:

```sql
insert into metric_current_value (
    tenant_id,
    source_id,
    metric_name,
    event_time,
    ingest_time,
    value_numeric,
    value_text,
    value_quality,
    time_quality
)
values (
    :tenantId,
    :sourceId,
    :metricName,
    :eventTime,
    :ingestTime,
    :valueNumeric,
    :valueText,
    :valueQuality,
    :timeQuality
)
on conflict (
    tenant_id,
    source_id,
    metric_name
)
do update set
    event_time = excluded.event_time,
    ingest_time = excluded.ingest_time,
    value_numeric = excluded.value_numeric,
    value_text = excluded.value_text,
    value_quality = excluded.value_quality,
    time_quality = excluded.time_quality,
    updated_at = clock_timestamp()
where excluded.event_time >= metric_current_value.event_time;
```

Gunakan current table untuk:

```text
latest value
heartbeat
current dashboard card
fleet overview
alert current state
```

Jangan hitung latest dari raw table terus-menerus jika endpoint sering dipanggil.

---

# 4. Ingestion Architecture

## 4.1 Online API path

```text
POST /v1/metric-samples/batch
        │
        ▼
Jersey Resource
        │
        ├─ auth tenant
        ├─ validate payload
        ├─ max 1.000 rows
        ├─ eventId/idempotency key required
        └─ parse OffsetDateTime → Instant
        │
        ▼
MetricIngestionService
        │
        ├─ classify time quality
        ├─ compute payload hash
        ├─ register event ids
        ├─ insert raw rows
        ├─ update current table
        ├─ mark dirty rollup bucket
        └─ return accepted/rejected/duplicate count
```

Jersey resource:

```java
@Path("/v1/metric-samples")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class MetricSampleResource {

    private final MetricIngestionService ingestionService;

    @POST
    @Path("/batch")
    public Response ingestBatch(MetricSampleBatchRequest request) {
        if (request.samples() == null || request.samples().isEmpty()) {
            throw new BadRequestException("samples must not be empty");
        }

        if (request.samples().size() > 1000) {
            throw new BadRequestException("batch too large; max 1000 samples");
        }

        MetricIngestionResult result = ingestionService.ingestOnlineBatch(request);

        return Response.accepted(result).build();
    }
}
```

---

## 4.2 Broker ingestion path

```text
Kafka/RabbitMQ
  → poll messages
  → validate
  → group batch
  → DB transaction
      → registry
      → raw insert
      → current table update
      → dirty bucket mark
  → ack/commit offset after DB commit
```

Pseudo-code:

```java
while (running) {
    List<Message> messages = consumer.poll(maxRecords, pollTimeout);

    try {
        transactionTemplate.execute(() -> {
            List<MetricSampleRow> rows = messages.stream()
                .map(this::toMetricSampleRow)
                .toList();

            ingestionService.ingestBatchIdempotently(rows);
            return null;
        });

        consumer.ack(messages);
    } catch (Exception ex) {
        consumer.nackOrRetry(messages);
    }
}
```

Invariant penting:

```text
Ack broker hanya setelah DB commit.
Jika DB commit sukses tapi ack gagal, message replay harus aman karena idempotency.
```

---

## 4.3 Backfill path

```text
Historical file/object storage
  → import job
  → COPY to staging
  → validate
  → reject bad rows
  → ensure partition/chunk
  → register accepted events
  → insert raw
  → refresh affected rollup/cagg
  → analyze affected partition/chunk
  → mark batch complete
```

Staging table:

```sql
create table metric_sample_staging (
    batch_id        uuid not null,
    row_number      bigint not null,

    tenant_id       bigint,
    source_id       bigint,
    event_id        uuid,
    metric_name     text,
    event_time      timestamptz,

    value_numeric   double precision,
    value_text      text,
    value_quality   text,
    time_quality    text,
    tags            jsonb,

    loaded_at       timestamptz not null default clock_timestamp(),

    constraint metric_sample_staging_pk
        primary key (batch_id, row_number)
);
```

Reject table:

```sql
create table metric_sample_reject (
    batch_id       uuid not null,
    row_number     bigint not null,
    reject_reason  text not null,
    raw_payload     jsonb,
    rejected_at     timestamptz not null default clock_timestamp(),

    constraint metric_sample_reject_pk
        primary key (batch_id, row_number, reject_reason)
);
```

---

# 5. Query Architecture

## 5.1 API surface

```text
Raw short range:
GET /v1/metrics/{sourceId}/{metricName}/series?from=&to=&limit=

Latest:
GET /v1/metrics/{sourceId}/{metricName}/latest

Current fleet:
GET /v1/metrics/{metricName}/current?sourceGroup=

Rollup:
GET /v1/metrics/{sourceId}/{metricName}/rollups?from=&to=&bucket=

Analytics:
GET /v1/metrics/{sourceId}/{metricName}/analytics/moving-average

Timeline:
GET /v1/entities/{entityId}/timeline?from=&to=&cursor=

Internal:
GET /internal/health/timeseries
POST /internal/admin/rollups/refresh
```

---

## 5.2 Query source selection

```java
public enum TimeSeriesQuerySource {
    RAW,
    CURRENT,
    ROLLUP_15M,
    ROLLUP_1H,
    ROLLUP_1D,
    CAGG_15M,
    CAGG_1H,
    CAGG_1D
}
```

```java
public TimeSeriesQuerySource chooseSeriesSource(
    Duration range,
    Duration requestedBucket,
    boolean timescaleEnabled
) {
    if (range.compareTo(Duration.ofHours(1)) <= 0
        && requestedBucket.compareTo(Duration.ofMinutes(1)) <= 0) {
        return TimeSeriesQuerySource.RAW;
    }

    if (range.compareTo(Duration.ofDays(30)) <= 0
        && requestedBucket.compareTo(Duration.ofMinutes(15)) >= 0) {
        return timescaleEnabled
            ? TimeSeriesQuerySource.CAGG_15M
            : TimeSeriesQuerySource.ROLLUP_15M;
    }

    if (range.compareTo(Duration.ofDays(365)) <= 0
        && requestedBucket.compareTo(Duration.ofHours(1)) >= 0) {
        return timescaleEnabled
            ? TimeSeriesQuerySource.CAGG_1H
            : TimeSeriesQuerySource.ROLLUP_1H;
    }

    return timescaleEnabled
        ? TimeSeriesQuerySource.CAGG_1D
        : TimeSeriesQuerySource.ROLLUP_1D;
}
```

---

## 5.3 Query guard

```java
public void validateSeriesQuery(
    Instant from,
    Instant to,
    Duration bucketSize,
    int limit
) {
    if (!from.isBefore(to)) {
        throw new BadRequestException("from must be before to");
    }

    if (limit < 1 || limit > 10_000) {
        throw new BadRequestException("limit must be between 1 and 10000");
    }

    long rangeSeconds = Duration.between(from, to).getSeconds();
    long bucketSeconds = bucketSize.getSeconds();

    long bucketCount = (rangeSeconds + bucketSeconds - 1) / bucketSeconds;

    if (bucketCount > 10_000) {
        throw new BadRequestException("too many buckets requested");
    }
}
```

Guard wajib:

| Guard | Alasan |
|---|---|
| `from/to` wajib | cegah full scan |
| half-open interval | cegah double-count boundary |
| max raw range | raw bukan untuk long-range dashboard |
| max bucket count | cegah response meledak |
| max limit | lindungi memory |
| source count limit | multi-source output bisa besar |
| timezone valid | cegah ambiguity |
| tenant dari auth | cegah data leak |
| query source enforced | raw vs rollup/cagg jelas |

---

# 6. MyBatis Strategy

## 6.1 Jangan satu mapper untuk semua query

Anti-pattern:

```xml
<select id="searchAnything">
    select *
    from metric_sample
    <where>
        <if test="tenantId != null">tenant_id = #{tenantId}</if>
        <if test="sourceId != null">and source_id = #{sourceId}</if>
        <if test="from != null">and event_time >= #{from}</if>
        <if test="to != null">and event_time &lt; #{to}</if>
    </where>
</select>
```

Lebih baik pisahkan query by use case:

```java
public interface MetricSeriesMapper {
    List<MetricPoint> findRawSeries(...);
    MetricPoint findLatestFromRaw(...);
    List<MetricRollupPoint> find15mRollup(...);
    List<MetricRollupPoint> find1hRollup(...);
}
```

---

## 6.2 Raw query mapper

```xml
<select id="findRawSeries" resultType="com.example.MetricPoint">
    select
        event_time as eventTime,
        value_numeric as valueNumeric,
        value_quality as valueQuality,
        time_quality as timeQuality
    from metric_sample
    where tenant_id = #{tenantId}
      and source_id = #{sourceId}
      and metric_name = #{metricName}
      and event_time >= #{from}
      and event_time &lt; #{to}
    order by event_time
    limit #{limit}
</select>
```

---

## 6.3 Rollup query mapper

```xml
<select id="find15mRollup" resultType="com.example.MetricRollupPoint">
    select
        bucket_start as bucketStart,
        bucket_end as bucketEnd,
        sample_count as sampleCount,
        good_count as goodCount,
        late_count as lateCount,
        avg_value as avgValue,
        min_value as minValue,
        max_value as maxValue,
        sum_value as sumValue
    from metric_rollup_15m
    where tenant_id = #{tenantId}
      and source_id = #{sourceId}
      and metric_name = #{metricName}
      and bucket_start >= #{from}
      and bucket_start &lt; #{to}
    order by bucket_start
</select>
```

---

# 7. Alerting Architecture

```text
Raw / Current / Rollup / Cagg
        │
        ▼
Alert Evaluation Job
        │
        ├─ completeness check
        ├─ threshold check
        ├─ rolling SLA check
        ├─ anomaly check
        ├─ stale data check
        └─ duplicate/reject spike check
        │
        ▼
metric_alert_state
        │
        ▼
Notification / Camunda / Incident Workflow
```

Alert state:

```sql
create table metric_alert_state (
    tenant_id       bigint not null,
    source_id       bigint not null,
    metric_name     text not null,
    rule_id         text not null,

    status          text not null,
    last_evaluated_bucket timestamptz not null,

    breach_count    integer not null default 0,
    last_value      double precision,

    updated_at      timestamptz not null default clock_timestamp(),

    constraint metric_alert_state_pk
        primary key (
            tenant_id,
            source_id,
            metric_name,
            rule_id
        ),

    constraint metric_alert_state_status_chk
        check (
            status in (
                'OK',
                'BREACHING',
                'INSUFFICIENT_DATA',
                'STALE'
            )
        )
);
```

Alerting rule:

| Rule type | Source |
|---|---|
| latest threshold | current table |
| sustained SLA breach | rollup/cagg |
| missing data | completeness rollup |
| ingestion stale | raw ingest metadata |
| duplicate spike | registry |
| reject spike | reject table |
| anomaly trend | analytics projection |

---

# 8. Deployment Topology

## 8.1 Local development with Docker Compose

Docker Compose files define top-level `services`; each service contains the configuration applied to a container, such as image, ports, environment, volumes, and dependencies. ([Docker Documentation](https://docs.docker.com/reference/compose-file/services/?utm_source=chatgpt.com))

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      JDBC_URL: jdbc:postgresql://postgres:5432/appdb
      JDBC_USER: app
      JDBC_PASSWORD: app
    ports:
      - "8080:8080"
    depends_on:
      - postgres

  postgres:
    image: postgres:17
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

Untuk TimescaleDB local:

```yaml
services:
  postgres:
    image: timescale/timescaledb:2.x.x-pg17
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
```

Pin versi image. Jangan gunakan `latest` untuk production.

---

## 8.2 Kubernetes application deployment

Kubernetes probes digunakan untuk memonitor health container dalam Pod; liveness, readiness, dan startup probes memiliki fungsi berbeda untuk restart, traffic routing, dan startup gating. ([Kubernetes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/?utm_source=chatgpt.com))

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: metric-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: metric-api
  template:
    metadata:
      labels:
        app: metric-api
    spec:
      containers:
        - name: metric-api
          image: registry.example.com/metric-api:1.0.0
          ports:
            - containerPort: 8080
          env:
            - name: JDBC_URL
              valueFrom:
                secretKeyRef:
                  name: metric-api-db
                  key: jdbc-url
            - name: JDBC_USER
              valueFrom:
                secretKeyRef:
                  name: metric-api-db
                  key: username
            - name: JDBC_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: metric-api-db
                  key: password
          readinessProbe:
            httpGet:
              path: /internal/health/readiness
              port: 8080
            periodSeconds: 10
            failureThreshold: 3
          livenessProbe:
            httpGet:
              path: /internal/health/liveness
              port: 8080
            periodSeconds: 30
            failureThreshold: 3
          startupProbe:
            httpGet:
              path: /internal/health/startup
              port: 8080
            periodSeconds: 10
            failureThreshold: 30
```

---

## 8.3 Kubernetes scheduled job

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: metric-rollup-refresh
spec:
  schedule: "*/5 * * * *"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 5
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: refresh
              image: postgres:17
              env:
                - name: PGHOST
                  valueFrom:
                    secretKeyRef:
                      name: app-db
                      key: host
                - name: PGDATABASE
                  value: appdb
                - name: PGUSER
                  valueFrom:
                    secretKeyRef:
                      name: app-db
                      key: username
                - name: PGPASSWORD
                  valueFrom:
                    secretKeyRef:
                      name: app-db
                      key: password
              command:
                - /bin/sh
                - -c
                - |
                  psql -v ON_ERROR_STOP=1 \
                    -c "select process_metric_rollup_15m_dirty_buckets_locked(500);"
```

Gunakan `concurrencyPolicy: Forbid` agar job refresh yang sama tidak overlap.

---

## 8.4 Database deployment options

| Environment | Recommended approach |
|---|---|
| Local dev | Docker Compose |
| Kubernetes app + managed DB | app di K8s, PostgreSQL managed |
| On-prem PostgreSQL | VM/bare metal dengan backup/PITR jelas |
| Kubernetes PostgreSQL | StatefulSet/operator, hanya jika tim siap |
| AWS/Azure managed PostgreSQL | cocok jika ingin reduce ops burden |
| TimescaleDB | pastikan extension supported di target environment |

Kubernetes `StatefulSet` menyediakan identitas Pod yang stabil dan persistent storage semantics untuk aplikasi stateful. Ini berguna untuk database di Kubernetes, tetapi tetap memerlukan operational maturity tinggi. ([Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/?utm_source=chatgpt.com))

---

# 9. Configuration Baseline

## 9.1 HikariCP

```properties
maximumPoolSize=20
minimumIdle=5
connectionTimeout=2000
idleTimeout=300000
maxLifetime=1800000

dataSource.reWriteBatchedInserts=true
dataSource.options=-c TimeZone=UTC
```

Rule:

| Setting | Catatan |
|---|---|
| `maximumPoolSize` | jangan terlalu besar |
| `connectionTimeout` | fail fast saat DB overload |
| `reWriteBatchedInserts` | bantu batch insert pgJDBC |
| `TimeZone=UTC` | konsisten untuk `timestamptz` |
| separate write/read pool | optional untuk beban tinggi |
| separate admin pool | untuk maintenance |

---

## 9.2 Application config

```yaml
timeseries:
  raw-query:
    max-range: PT24H
    max-limit: 10000
  batch-ingest:
    max-rows: 1000
    max-payload-bytes: 10485760
  rollup:
    enabled: true
    dirty-bucket-limit: 500
  fill:
    max-buckets: 10000
    max-output-points: 100000
  late-data:
    threshold: PT15M
    future-skew-threshold: PT2M
```

---

# 10. Security Baseline

| Area | Practice |
|---|---|
| Tenant isolation | `tenant_id` dari auth context, bukan request bebas |
| DB credentials | Secret manager / Kubernetes Secret |
| DB role | least privilege |
| Admin endpoint | internal only + allowlist + audit |
| Raw SQL | no user-controlled table/view names |
| Cursor | sign/HMAC jika bisa dimanipulasi |
| Logs | jangan log full payload sensitif |
| Reject table | akses dibatasi |
| Backup | encrypted + access controlled |
| Migration | reviewed + runbook |
| TLS | app ↔ DB sesuai policy |
| PII/tags | jangan bebas masuk JSONB tanpa governance |

---

# 11. Observability Baseline

## 11.1 App metrics

```text
http_request_duration
db_query_duration
ingestion_rows_received_total
ingestion_rows_inserted_total
ingestion_rows_rejected_total
ingestion_rows_duplicate_total
ingestion_batch_size
ingestion_queue_depth
rollup_refresh_duration
rollup_dirty_bucket_count
alert_evaluation_duration
```

## 11.2 DB metrics

```text
pg_stat_activity active sessions
pg_stat_statements slow query
pg_stat_user_tables dead tuples
pg_stat_user_indexes index usage
pg_stat_wal WAL bytes
pg_stat_archiver archive failures
pg_stat_replication lag
partition/chunk count
rollup/cagg lag
backup age
```

PostgreSQL backup and recovery has three fundamental approaches: SQL dump, file system level backup, and continuous archiving. For production time-series with PITR requirement, base backup plus continuous WAL archiving is usually the important pattern. ([PostgreSQL](https://www.postgresql.org/docs/current/backup.html?utm_source=chatgpt.com))

---

# 12. Backup and Restore Architecture

```text
Primary PostgreSQL
      │
      ├─ base backup schedule
      ├─ WAL archive continuous
      ├─ backup verification
      ├─ restore drill
      └─ PITR runbook
```

`pg_basebackup` can take a base backup from a running PostgreSQL cluster without affecting other database clients and can be used for point-in-time recovery or standby setup. ([PostgreSQL](https://www.postgresql.org/docs/current/app-pgbasebackup.html?utm_source=chatgpt.com))

Example:

```bash
pg_basebackup \
  -h primary-db \
  -U replicator \
  -D /backups/base/2026-07-15 \
  -Fp \
  -Xs \
  -P \
  -R
```

Backup checklist:

| Checklist | Target |
|---|---|
| base backup scheduled | yes |
| WAL archive continuous | yes |
| restore drill | yes |
| PITR tested | yes |
| backup encrypted | yes |
| offsite copy | yes |
| backup retention | clear |
| restore runbook | clear |
| RPO/RTO | documented |

---

# 13. Production Runbooks

## 13.1 Ingestion stale

Symptoms:

```text
latest ingest time tidak bergerak
dashboard tidak update
broker lag naik
API accepted rows turun
```

Action:

```text
1. Check app ingestion worker/API.
2. Check broker lag.
3. Check DB active query and locks.
4. Check partition/chunk availability.
5. Check disk/WAL pressure.
6. Check reject/duplicate spike.
7. Reprocess from broker/staging after stable.
```

---

## 13.2 Query slow

Action:

```text
1. Check pg_stat_statements top mean/total time.
2. Run EXPLAIN ANALYZE with representative params.
3. Check from/to predicate exists.
4. Check raw vs rollup/cagg routing.
5. Check index and partition/chunk pruning.
6. Check output/bucket count.
7. Add/revise index only if query owner is clear.
```

---

## 13.3 Rollup/cagg stale

Action:

```text
1. Compare latest raw event_time vs latest rollup bucket.
2. Check dirty bucket backlog or Timescale job stats.
3. Refresh trailing window.
4. Manual refresh affected backfill/correction window.
5. Check late data distribution.
6. Check retention did not remove source raw data.
```

---

## 13.4 WAL/disk pressure

Action:

```text
1. Check pg_stat_wal.
2. Check pg_stat_archiver.
3. Check replication lag/slot.
4. Pause large backfill if needed.
5. Reduce batch size temporarily.
6. Check index count and write amplification.
7. Scale storage/IOPS if sustained.
```

---

## 13.5 Partition/chunk coverage issue

Action:

```text
1. Identify failing event_time.
2. Create missing future/historical partition.
3. Retry failed batch with idempotency.
4. Check default partition rows.
5. Fix scheduler/CronJob.
6. Add coverage alert.
```

---

## 13.6 Backfill incident

Action:

```text
1. Pause online-heavy backfill if DB degraded.
2. Check WAL growth and locks.
3. Check batch status.
4. Validate inserted row count.
5. Mark affected rollup/cagg windows.
6. Refresh in controlled chunks.
7. Analyze affected partitions/chunks.
8. Resume with smaller batch size.
```

---

# 14. End-to-End Reference Flow

## 14.1 Ingest request

```text
POST /v1/metric-samples/batch
  → parse request
  → validate eventId/eventTime/value
  → classify time_quality
  → compute payload_hash
  → transaction:
      → insert registry
      → insert raw rows
      → upsert current table
      → mark dirty bucket
      → write batch audit
  → return accepted/rejected/duplicate count
```

---

## 14.2 Dashboard query

```text
GET /v1/metrics/{sourceId}/{metricName}/series?from=&to=&bucket=auto
  → validate from/to
  → compute range
  → choose query source:
      raw for short range
      rollup/cagg for medium/long range
  → optional gap fill
  → return points with sampleCount/goodCount/lateCount/fillStatus
```

---

## 14.3 Alert evaluation

```text
scheduled alert worker
  → read current/rollup/completeness
  → evaluate rule
  → update alert state
  → emit notification / Camunda workflow
  → audit transition
```

---

## 14.4 Backfill

```text
operator starts backfill
  → create ingestion_batch
  → COPY to staging
  → validate + reject
  → ensure partitions/chunks
  → insert raw idempotently
  → update current where applicable
  → mark/refresh rollups or cagg
  → analyze affected table
  → compare counts
  → complete batch
```

---

# 15. Final Architecture Checklist

| Area | Checklist |
|---|---|
| Data model | raw, current, rollup/cagg, registry, reject, batch |
| Time semantics | `event_time`, `ingest_time`, timezone UTC, half-open interval |
| Ingestion | batch, idempotency, retry, reject, backpressure |
| Query | raw vs rollup/cagg routing, max range, max bucket |
| Index | lookup, latest, BRIN, ingest observability |
| Partition/chunk | lifecycle, future coverage, retention |
| Rollup/cagg | refresh policy, dirty bucket, late data |
| Alerting | current/rollup-based, alert state, missing/stale handling |
| Observability | ingestion lag, DB stats, slow query, WAL, cagg lag |
| Backup | base backup, WAL archive, PITR drill |
| Deployment | Docker local, K8s app, CronJob scheduler, managed/on-prem DB |
| Security | tenant isolation, secrets, least privilege, admin audit |
| Runbook | ingestion, query, rollup, WAL, backfill, restore |
| Migration | Flyway/Liquibase separated from heavy operational refresh |
| Testing | unit, integration, performance, restore drill |

---

# 16. Recommended Production Baseline

```text
Application:
- Java 17+
- Jersey/JAX-RS resource layer
- MyBatis explicit SQL mapper
- HikariCP bounded pool
- OpenTelemetry/logging/metrics

Database:
- PostgreSQL native partitioning or TimescaleDB hypertable
- raw metric_sample
- ingestion_event_registry
- metric_current_value
- metric_rollup_15m / 1h / 1d or Timescale continuous aggregates
- reject/batch/audit tables

Ingestion:
- online batch max 1.000 rows
- broker micro-batch
- COPY + staging for backfill
- idempotency registry
- payload hash mismatch detection

Query:
- raw only short range
- current table for latest
- rollup/cagg for dashboard
- gap filling with explicit fillStatus
- bucket count guard

Operations:
- partition/chunk coverage alert
- ingestion lag alert
- rollup/cagg lag alert
- pg_stat_statements
- WAL/archive/replication monitoring
- backup + PITR drill
```

---

# Seri 16/16 Selesai

**Seri 16 selesai. Seluruh seri utama PostgreSQL Time-Series Database selesai: 16/16.**

Yang sudah selesai:

```text
1. Data Modeling
2. Timestamp Semantics
3. Native Partitioning Strategy
4. Partition Lifecycle
5. Indexing Strategy
6. High-Throughput Ingestion
7. Idempotency & Deduplication
8. Query Pattern
9. Time Bucket Aggregation
10. Gap Filling & Series Completion
11. Window Analytics
12. Materialized View & Native Rollup Strategy
13. TimescaleDB Hypertable, Chunking, Compression/Columnstore
14. TimescaleDB Continuous Aggregates, Retention Policy, Downsampling
15. Operational Monitoring
16. Production Architecture
```

Terima kasih juga. Untuk materi lanjutan yang tidak mengulang seri utama, rekomendasi berikutnya adalah **Bonus B1 - Backfill & Historical Replay Strategy**: desain job backfill enterprise-grade dengan staging, checkpoint, resume, throttling, validation, reconciliation, dan refresh rollup/cagg setelah replay.

---

**Sources:**

- [Kubernetes](https://kubernetes.io/?utm_source=chatgpt.com)
- [Understand continuous aggregates | Tiger Data Docs](https://www.tigerdata.com/docs/learn/continuous-aggregates?utm_source=chatgpt.com)
- [Define services in Docker Compose](https://docs.docker.com/reference/compose-file/services/?utm_source=chatgpt.com)
- [Documentation: 18: Chapter 25. Backup and Restore](https://www.postgresql.org/docs/current/backup.html?utm_source=chatgpt.com)



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)