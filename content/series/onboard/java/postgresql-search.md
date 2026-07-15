# postgresql-search

**User:** Anonymous  
**Created:** 7/15/2026 19:47:02  
**Updated:** 7/15/2026 20:24:50  
**Exported:** 7/15/2026 21:23:22  
**Link:** [https://chatgpt.com/g/g-p-6a539ddc858881919467b6da20df4567-cheatsheet/c/6a57813e-cad0-83ec-a659-aaefa5c24beb](https://chatgpt.com/g/g-p-6a539ddc858881919467b6da20df4567-cheatsheet/c/6a57813e-cad0-83ec-a659-aaefa5c24beb)  

## Response:
7/15/2026, 7:48:02 PM

Saya akan susun sebagai peta onboarding praktis, dengan pemisahan jelas antara PostgreSQL Full Text Search dan Vector Search, lalu saya cek referensi resmi/primer supaya tidak mengandalkan ingatan lama.

Saya sudah cek baseline: PostgreSQL current docs yang terbuka adalah PostgreSQL 18.4; PostgreSQL 19 masih ditandai sebagai development/beta, jadi peta ini saya basis-kan ke PostgreSQL 18 + pgvector current README.

## Introduction

Topik ini fokus pada **PostgreSQL sebagai search database**, bukan sekadar relational database. Ada dua domain besar:

1. **Full Text Search / lexical search**  
   Cocok untuk pencarian berbasis kata, istilah legal/regulasi, nama dokumen, nomor perkara, status, deskripsi, keyword, phrase, Boolean query, ranking, dan highlighting. PostgreSQL menyediakan `tsvector`, `tsquery`, konfigurasi bahasa, dictionary, ranking, dan headline/highlighting untuk kebutuhan ini. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html))

2. **Vector Search / semantic search**  
   Cocok untuk pencarian berbasis makna: “dokumen yang mirip”, RAG, knowledge search, semantic case lookup, rekomendasi, deduplication berbasis embedding, dan similarity search. Di PostgreSQL, pendekatan production umum memakai extension **pgvector**, yang mendukung tipe `vector`, `halfvec`, `bit`, `sparsevec`, distance operator, exact nearest-neighbor, serta approximate indexes seperti HNSW dan IVFFlat. ([GitHub](https://github.com/pgvector/pgvector))

Yang penting: **Full Text Search dan Vector Search bukan saling menggantikan**. Full text unggul untuk lexical precision; vector unggul untuk semantic recall. Untuk enterprise search modern, biasanya keduanya digabung menjadi **hybrid search**: lexical score + vector distance + metadata filter + optional reranker. pgvector sendiri mendokumentasikan penggunaan bersama PostgreSQL full-text search untuk hybrid search, termasuk opsi Reciprocal Rank Fusion atau cross-encoder. ([GitHub](https://github.com/pgvector/pgvector))

---

## Diagram

```text
PostgreSQL Search Database
│
├── 1. Full Text Search / Lexical Search
│   │
│   ├── Document Modeling
│   │   ├── title
│   │   ├── body / description
│   │   ├── tags / keywords
│   │   ├── tenant_id / org_id
│   │   ├── status / category / date
│   │   └── language / text_search_config
│   │
│   ├── Text Processing
│   │   ├── to_tsvector()
│   │   ├── parser
│   │   ├── dictionary
│   │   ├── stop words
│   │   ├── stemming / normalization
│   │   ├── synonym / thesaurus
│   │   └── unaccent / custom config
│   │
│   ├── Query Processing
│   │   ├── to_tsquery()
│   │   ├── plainto_tsquery()
│   │   ├── phraseto_tsquery()
│   │   ├── websearch_to_tsquery()
│   │   ├── prefix search
│   │   └── phrase / boolean query
│   │
│   ├── Ranking & Result UX
│   │   ├── ts_rank()
│   │   ├── ts_rank_cd()
│   │   ├── field weighting A/B/C/D
│   │   ├── freshness boost
│   │   ├── business boost
│   │   └── ts_headline()
│   │
│   ├── Indexing
│   │   ├── GIN index
│   │   ├── GiST index
│   │   ├── expression index
│   │   ├── generated tsvector column
│   │   ├── partial index
│   │   └── partition-aware search
│   │
│   └── Fuzzy / Typo / Partial Matching
│       ├── pg_trgm
│       ├── similarity()
│       ├── LIKE / ILIKE acceleration
│       ├── trigram GIN/GiST
│       └── fallback autocomplete/search-as-you-type
│
├── 2. Vector Search / Semantic Search
│   │
│   ├── Embedding Modeling
│   │   ├── source entity: document / chunk / case / event
│   │   ├── embedding model
│   │   ├── dimension
│   │   ├── model version
│   │   ├── chunking strategy
│   │   └── metadata schema
│   │
│   ├── Vector Storage
│   │   ├── vector
│   │   ├── halfvec
│   │   ├── bit
│   │   ├── sparsevec
│   │   ├── embedding column
│   │   └── metadata columns
│   │
│   ├── Similarity Query
│   │   ├── L2 distance: <->
│   │   ├── inner product: <#>
│   │   ├── cosine distance: <=>
│   │   ├── L1 distance: <+>
│   │   ├── Hamming distance: <~>
│   │   └── Jaccard distance: <%>
│   │
│   ├── Indexing
│   │   ├── exact search
│   │   ├── HNSW
│   │   ├── IVFFlat
│   │   ├── index per distance function
│   │   ├── partial index
│   │   └── partitioned vector search
│   │
│   ├── Filtered Vector Search
│   │   ├── tenant filter
│   │   ├── category filter
│   │   ├── status filter
│   │   ├── date filter
│   │   ├── iterative index scan
│   │   └── recall validation
│   │
│   └── Performance / Scaling
│       ├── maintenance_work_mem
│       ├── max_parallel_maintenance_workers
│       ├── work_mem
│       ├── binary quantization
│       ├── re-ranking
│       ├── recall benchmark
│       └── index rebuild / vacuum strategy
│
└── 3. Hybrid Search
    │
    ├── Lexical retrieval
    ├── Vector retrieval
    ├── Metadata filtering
    ├── Score normalization
    ├── Reciprocal Rank Fusion
    ├── Cross-encoder reranking
    ├── Pagination stability
    └── Observability: latency, recall, zero-result rate, top-k quality
```

---

## Tabular Decomposition Map

| Area | Practical skill / domain | Yang perlu dikuasai | Artifact PostgreSQL yang relevan | Production concern |
|---|---|---|---|---|
| **Search workload modeling** | Bedakan lexical, semantic, fuzzy, dan hybrid search | Jangan semua search dipaksa jadi `LIKE '%keyword%'`; tentukan apakah user mencari kata persis, phrase, dokumen mirip, typo, atau intent/makna. | FTS, `pg_trgm`, pgvector, metadata filters | Salah memilih search primitive akan bikin ranking buruk, index tidak efektif, dan UX search terasa “aneh”. |
| **Document modeling** | Tentukan “document” yang dicari | Bisa berupa row utama, gabungan beberapa kolom, chunk dokumen, case note, attachment text, atau event log. | `title`, `body`, `tags`, `tenant_id`, `status`, `language`, `created_at` | Search index harus mengikuti boundary domain, bukan sekadar tabel fisik. |
| **FTS data type** | Pahami `tsvector` dan `tsquery` | `to_tsvector()` mengubah dokumen menjadi lexeme ter-normalisasi; `tsquery` merepresentasikan query yang akan dicocokkan. PostgreSQL menyediakan fungsi parsing dokumen, parsing query, ranking, dan highlighting. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html)) | `tsvector`, `tsquery`, `@@` | Simpan hasil FTS sebagai generated column untuk workload yang sering dicari. |
| **Text normalization** | Parser, dictionary, stemming, stop words | Dictionary dipakai untuk menghapus stop words dan menormalisasi kata agar variasi bentuk kata bisa match ke lexeme yang sama. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-dictionaries.html)) | Text search configuration, dictionary, stop words, synonym, thesaurus | Bahasa Indonesia/English/mixed-language perlu strategi khusus; default `english` belum tentu cocok. |
| **FTS query parsing** | Pilih parser query sesuai UX | `to_tsquery()` cocok untuk query terstruktur; `plainto_tsquery()` untuk input polos; `phraseto_tsquery()` untuk phrase; `websearch_to_tsquery()` lebih aman untuk raw user input karena tidak melempar syntax error untuk input aneh. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html)) | `to_tsquery`, `plainto_tsquery`, `phraseto_tsquery`, `websearch_to_tsquery` | Untuk search box umum, biasanya mulai dari `websearch_to_tsquery()` atau `plainto_tsquery()`, bukan langsung `to_tsquery()`. |
| **Boolean / phrase search** | AND, OR, NOT, FOLLOWED BY | `tsquery` mendukung operator `&`, `|`, `!`, dan `<->` untuk phrase/proximity-style query. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html)) | `tsquery`, `<->`, `&`, `|`, `!` | Berguna untuk advanced search internal/regulatory/legal, tapi perlu validasi input. |
| **Field weighting** | Ranking title lebih tinggi dari body | Gunakan `setweight()` dengan label `A`, `B`, `C`, `D` untuk membedakan pentingnya title, keyword, abstract, body. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html)) | `setweight()`, `||`, weighted `tsvector` | Title match biasanya harus menang dari body match; ini sering menentukan kualitas UX. |
| **FTS ranking** | Relevance ordering | PostgreSQL menyediakan `ts_rank()` dan `ts_rank_cd()`; `ts_rank_cd()` mempertimbangkan proximity/cover density. Ranking bisa dikombinasikan dengan faktor aplikasi seperti recency atau business priority. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html)) | `ts_rank`, `ts_rank_cd`, custom score | Ranking mahal untuk result besar; batasi kandidat dulu dengan index/filter. |
| **Highlighting** | Search result snippet | `ts_headline()` membuat excerpt dengan term yang di-highlight, tetapi output-nya tidak dijamin aman untuk langsung dimasukkan ke web page; tetap butuh sanitization. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html)) | `ts_headline()` | Jangan langsung render HTML dari untrusted content tanpa sanitizer. |
| **FTS indexing** | GIN vs GiST | PostgreSQL mendukung GIN dan GiST untuk full text search; GIN adalah preferred index type untuk FTS, sedangkan GiST bersifat lossy dan dapat menghasilkan false matches yang perlu recheck. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-indexes.html)) | `CREATE INDEX ... USING GIN/GIST` | Mayoritas production FTS mulai dari GIN. GiST dipilih hanya jika ada alasan khusus. |
| **Expression index** | Index langsung dari ekspresi text | Bisa membuat GIN index atas `to_tsvector('english', body)`. Konfigurasi harus eksplisit agar index konsisten dan dapat dipakai query. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-tables.html)) | Expression GIN index | Hindari bergantung pada `default_text_search_config` untuk expression index. |
| **Generated column / trigger sync** | Menjaga `tsvector` tetap update | Dokumentasi PostgreSQL menyebut trigger `tsvector_update_trigger`, tetapi juga mencatat metode trigger ini sudah di-obsolete oleh stored generated columns untuk kasus tersebut. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-features.html)) | Generated column, trigger fallback | Untuk desain baru, prefer generated column bila cocok; trigger masih berguna untuk logic custom. |
| **GIN maintenance** | Stabilitas latency search | GIN menyimpan key/posting-list; update GIN bisa mahal karena satu row dapat menghasilkan banyak key. GIN punya pending list via `fastupdate`, tetapi pending list besar dapat memperlambat search. ([PostgreSQL](https://www.postgresql.org/docs/current/gin.html)) | `fastupdate`, `gin_pending_list_limit`, autovacuum | Autovacuum dan pending-list cleanup perlu dipantau pada tabel high-write. |
| **Fuzzy / typo search** | Trigram search | `pg_trgm` menyediakan fungsi/operator similarity berbasis trigram dan index operator classes untuk similarity, `LIKE`, `ILIKE`, regex, dan equality search. ([PostgreSQL](https://www.postgresql.org/docs/current/pgtrgm.html)) | `pg_trgm`, `similarity()`, `%`, `<->`, trigram GIN/GiST | Cocok untuk typo/name search; jangan disamakan dengan semantic search. |
| **Autocomplete / prefix search** | Search-as-you-type | Bisa memakai prefix `tsquery`, trigram, atau desain n-gram/custom index tergantung UX. | `to_tsquery('term:*')`, `pg_trgm` | Prefix search bisa mahal; batasi minimum karakter dan gunakan index yang tepat. |
| **Multilingual search** | Per-language config | PostgreSQL mendukung banyak text search configuration; config bisa eksplisit atau per-row via kolom `regconfig`. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-tables.html)) | `regconfig`, per-row config | Mixed Indonesian-English biasanya butuh eksperimen dictionary dan stop words. |
| **Vector extension setup** | Enable pgvector | pgvector diaktifkan per database dengan `CREATE EXTENSION vector`, lalu tabel dapat memiliki kolom `vector(n)`. ([GitHub](https://github.com/pgvector/pgvector)) | `CREATE EXTENSION vector`, `vector(n)` | Pastikan extension tersedia di on-prem/AWS/Azure flavor yang dipakai. |
| **Embedding domain modeling** | Tentukan unit embedding | Embedding bisa dibuat per dokumen, chunk, case, ticket, comment, atau paragraph. Simpan juga `embedding_model`, `embedding_version`, dan metadata filter. | `embedding`, `model_version`, `chunk_id`, `document_id` | Re-embedding saat model berubah harus dianggap migration/backfill production. |
| **Vector data types** | Pilih tipe storage | pgvector mendukung `vector`, `halfvec`, `bit`, dan `sparsevec`; README mencatat batas dimensi/indexed type berbeda untuk masing-masing tipe. ([GitHub](https://github.com/pgvector/pgvector)) | `vector`, `halfvec`, `bit`, `sparsevec` | `halfvec`/binary quantization bisa mengurangi working set, tapi perlu validasi kualitas. |
| **Distance metrics** | Pilih metric sesuai embedding model | pgvector mendukung L2 `<->`, negative inner product `<#>`, cosine distance `<=>`, L1 `<+>`, Hamming `<~>`, dan Jaccard `<%>`. ([GitHub](https://github.com/pgvector/pgvector)) | Distance operators | Jangan asal pakai cosine; ikuti rekomendasi embedding model dan normalisasi vector. |
| **Exact vector search** | Baseline recall sempurna | pgvector melakukan exact nearest-neighbor search secara default; approximate index menukar sebagian recall untuk speed. ([GitHub](https://github.com/pgvector/pgvector)) | `ORDER BY embedding <=> query LIMIT k` | Selalu punya exact-search benchmark untuk mengukur recall ANN. |
| **HNSW index** | ANN untuk latency rendah | HNSW membuat multilayer graph; umumnya lebih baik dari IVFFlat dalam speed-recall tradeoff, tetapi build lebih lambat dan memakai lebih banyak memory. ([GitHub](https://github.com/pgvector/pgvector)) | `USING hnsw`, `m`, `ef_construction`, `hnsw.ef_search` | Tuning `ef_search` menaikkan recall tetapi memperlambat query. |
| **IVFFlat index** | ANN dengan build lebih ringan | IVFFlat membagi vector ke list dan mencari subset list terdekat; build lebih cepat dan memory lebih rendah daripada HNSW, tetapi query performance/recall tradeoff biasanya lebih rendah. ([GitHub](https://github.com/pgvector/pgvector)) | `USING ivfflat`, `lists`, `ivfflat.probes` | Perlu data training; buat index setelah initial load untuk kualitas recall lebih baik. |
| **Filtered vector search** | Vector + WHERE clause | Dengan approximate indexes, filtering diterapkan setelah index scan; pgvector 0.8.0+ mendukung iterative index scans agar scan dapat diperluas sampai cukup result ditemukan. ([GitHub](https://github.com/pgvector/pgvector)) | `WHERE tenant_id = ?`, `hnsw.iterative_scan`, partial index, partitioning | Sangat penting untuk multi-tenant/case-management workload. |
| **Tenant isolation** | Search per tenant/org | pgvector README menyarankan list partitioning atau separate tables untuk tenant isolation karena shared approximate index bisa memengaruhi recall/speed antar tenant. ([GitHub](https://github.com/pgvector/pgvector)) | Partitioning, partial index, separate table | Jangan biarkan tenant besar merusak recall tenant kecil. |
| **Vector index build tuning** | Build-time performance | HNSW index build lebih cepat saat graph muat di `maintenance_work_mem`; pgvector juga menyarankan parallel maintenance workers dan index dibuat setelah bulk load. ([GitHub](https://github.com/pgvector/pgvector)) | `maintenance_work_mem`, `max_parallel_maintenance_workers` | Jangan menaikkan memory sampai menghabiskan RAM server. |
| **Vector storage optimization** | Working set reduction | pgvector menyarankan `halfvec` untuk working set lebih kecil dan binary quantization untuk index lebih kecil/build lebih cepat pada skala besar. ([GitHub](https://github.com/pgvector/pgvector)) | `halfvec`, `binary_quantize()`, expression index | Wajib ukur recall sebelum dan sesudah optimasi. |
| **Hybrid search** | Gabungkan lexical + semantic | pgvector mendokumentasikan penggunaan bersama PostgreSQL full-text search, lalu hasil dapat dikombinasikan dengan Reciprocal Rank Fusion atau cross-encoder. ([GitHub](https://github.com/pgvector/pgvector)) | FTS query + vector query + RRF/rerank | Biasanya paling bagus untuk enterprise knowledge/case search. |
| **Query validation** | Hindari query kosong/tidak indexable | PostgreSQL menyediakan fungsi seperti `numnode()` untuk mengecek apakah `tsquery` meaningful dan `querytree()` untuk melihat bagian query yang bisa memakai index. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-features.html)) | `numnode`, `querytree` | Penting untuk user input yang hanya berisi stop words atau negasi. |
| **Synonym / query rewrite** | Domain vocabulary expansion | `ts_rewrite()` dapat mengganti/menambah rule query berbasis table-driven rewrite, misalnya alias/sinonim domain. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-features.html)) | `ts_rewrite`, alias table | Berguna untuk istilah regulasi, singkatan internal, kode proses. |
| **Observability search** | Ukur kualitas dan latency | Pantau p95/p99 latency, zero-result rate, top-k click-through, recall@k, query distribution, index size, slow query, autovacuum, dan recheck. | `EXPLAIN ANALYZE`, `pg_stat_statements`, app metrics | Search bukan hanya “query cepat”; kualitas ranking harus diukur. |
| **Java/Jersey integration** | API search contract | Desain endpoint `GET /search?q=&type=&filters=&page=`, DTO result, score explanation, highlight fragment, dan tracing. | JDBC/MyBatis mapper, DTO, OpenAPI | Jangan expose raw SQL search syntax tanpa boundary dan validation. |

---

## Roadmap Alur Belajar Singkat

| Tahap | Fokus | Output praktis |
|---|---|---|
| 1 | **FTS basic**: `tsvector`, `tsquery`, `@@`, `to_tsvector`, `plainto_tsquery` | Bisa membuat search sederhana atas `title/body`. |
| 2 | **FTS production indexing**: generated column, GIN index, `setweight`, `ts_rank_cd` | Search lexical cepat dengan ranking masuk akal. |
| 3 | **FTS UX**: `websearch_to_tsquery`, phrase search, highlight, zero-query handling | Search box aman dan nyaman untuk user. |
| 4 | **Fuzzy search**: `pg_trgm`, similarity, typo/name matching | Bisa handle typo, nama orang/perusahaan, partial match. |
| 5 | **Vector basic**: pgvector extension, `vector(n)`, cosine/L2 query | Bisa simpan embedding dan cari dokumen mirip. |
| 6 | **Vector indexing**: HNSW vs IVFFlat, exact-vs-ANN benchmark | Bisa memilih index berdasarkan latency/recall/cost. |
| 7 | **Filtered vector search**: tenant/category/status/date filter, partial index, partitioning, iterative scan | Search semantic tetap benar pada data multi-tenant. |
| 8 | **Hybrid search**: FTS + vector + RRF/reranker | Search enterprise yang kuat untuk keyword + semantic intent. |
| 9 | **Production hardening**: observability, recall test, migration, re-embedding, vacuum/index maintenance | Search siap masuk microservice production. |

---

## Rekomendasi materi selanjutnya

Materi berikutnya yang belum terlihat dibuat di project ini dan paling nyambung adalah:

**Cheatsheet PostgreSQL Full Text Search Production Pattern: `tsvector`, generated column, GIN index, ranking, highlight, `pg_trgm`, dan contoh query MyBatis/Jersey production-style.**

---

**Sources:**

- [PostgreSQL: Documentation: 18: 12.3. Controlling Text Search](https://www.postgresql.org/docs/current/textsearch-controls.html)
- [GitHub - pgvector/pgvector: Open-source vector similarity search for Postgres · GitHub](https://github.com/pgvector/pgvector)

## Response:
7/15/2026, 7:49:55 PM

Total untuk topik **PostgreSQL Full Text Search + Vector Search Database** saya rekomendasikan **9 seri**.

| Seri | Materi |
|---:|---|
| 1 | PostgreSQL Full Text Search Fundamentals |
| 2 | FTS Document Modeling, `tsvector`, `tsquery`, dan Generated Column |
| 3 | FTS Indexing, Ranking, Weighting, Highlighting |
| 4 | Fuzzy Search dengan `pg_trgm`, Similarity, Typo Search, Autocomplete |
| 5 | PostgreSQL Vector Search Fundamentals dengan pgvector |
| 6 | Embedding Storage Design, Chunking, Metadata, Versioning |
| 7 | Vector Indexing: Exact Search, HNSW, IVFFlat, Recall vs Latency |
| 8 | Filtered Vector Search: Tenant, Category, Status, Date, Partitioning |
| 9 | Hybrid Search Production Pattern: FTS + Vector + RRF/Reranking + Observability |

Rekomendasi mulai dari **Seri 1 — PostgreSQL Full Text Search Fundamentals**.

## Response:
7/15/2026, 7:56:30 PM

Baik, saya tambahkan seri terakhir menjadi integrasi Java/Jersey/MyBatis. Saya mulai dari seri 1/10 dan akan menjaga formatnya praktis: konsep minimum, SQL runnable, pola implementasi, dan jebakan production.

Total seri sekarang menjadi **10 seri**.

| Seri | Materi |
|---:|---|
| 1 | PostgreSQL Full Text Search Fundamentals |
| 2 | FTS Document Modeling, `tsvector`, `tsquery`, dan Generated Column |
| 3 | FTS Indexing, Ranking, Weighting, Highlighting |
| 4 | Fuzzy Search dengan `pg_trgm`, Similarity, Typo Search, Autocomplete |
| 5 | PostgreSQL Vector Search Fundamentals dengan pgvector |
| 6 | Embedding Storage Design, Chunking, Metadata, Versioning |
| 7 | Vector Indexing: Exact Search, HNSW, IVFFlat, Recall vs Latency |
| 8 | Filtered Vector Search: Tenant, Category, Status, Date, Partitioning |
| 9 | Hybrid Search Production Pattern: FTS + Vector + RRF/Reranking + Observability |
| 10 | Java/Jersey/MyBatis Integration Pattern for PostgreSQL Search |

# Seri 1/10 - PostgreSQL Full Text Search Fundamentals

## 1. Core idea

PostgreSQL Full Text Search / FTS adalah mekanisme pencarian berbasis **lexical matching**, bukan semantic matching. Artinya, PostgreSQL memecah teks menjadi token, menormalisasi token menjadi lexeme, lalu mencocokkannya dengan query. Komponen dasarnya adalah `tsvector` untuk representasi dokumen, `tsquery` untuk representasi query, dan operator `@@` untuk matching. PostgreSQL juga menyediakan parsing query, ranking, dan highlighting untuk hasil pencarian. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch.html?utm_source=chatgpt.com))

Gunakan FTS ketika user mencari:

| Use case | Cocok dengan FTS? | Catatan |
|---|---:|---|
| Cari dokumen berisi kata tertentu | Ya | Misalnya `"enforcement notice"` |
| Cari phrase | Ya | Gunakan phrase query |
| Cari keyword di title/body/tag | Ya | Gunakan weighted `tsvector` |
| Cari typo nama orang/perusahaan | Tidak ideal | Pakai `pg_trgm`, seri 4 |
| Cari makna/intent mirip | Tidak ideal | Pakai vector search, seri 5+ |
| Search hybrid keyword + semantic | Ya, sebagai salah satu komponen | Seri 9 |

---

## 2. Mental model

```text
Raw document text
   │
   ▼
to_tsvector(config, text)
   │
   ▼
tsvector
   │
   ├── normalized lexemes
   ├── optional positions
   └── optional weights
       
User search input
   │
   ▼
plainto_tsquery / websearch_to_tsquery / to_tsquery / phraseto_tsquery
   │
   ▼
tsquery
   │
   ▼
document_tsvector @@ search_tsquery
   │
   ├── matched rows
   ├── ranked rows
   └── highlighted snippets
```

Dalam desain production, jangan langsung berpikir “search = `ILIKE '%keyword%'`”. Untuk teks panjang, `ILIKE` sulit diskalakan dan tidak punya ranking lexical yang layak. FTS memberi model yang lebih eksplisit: dokumen diproses menjadi `tsvector`, query diproses menjadi `tsquery`, lalu hasil bisa diurutkan dengan ranking seperti `ts_rank` atau `ts_rank_cd`. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html?utm_source=chatgpt.com))

---

## 3. Minimum runnable example

### 3.1 Buat tabel contoh

```sql
CREATE TABLE case_documents (
    id           BIGSERIAL PRIMARY KEY,
    tenant_id    BIGINT NOT NULL,
    case_no      TEXT NOT NULL,
    title        TEXT NOT NULL,
    body         TEXT NOT NULL,
    status       TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.2 Insert sample data

```sql
INSERT INTO case_documents
    (tenant_id, case_no, title, body, status)
VALUES
    (
        1001,
        'CASE-2026-0001',
        'Enforcement notice for late reporting',
        'The regulated entity failed to submit the required periodic reporting documents.',
        'OPEN'
    ),
    (
        1001,
        'CASE-2026-0002',
        'License suspension due to non-compliance',
        'The license holder violated reporting obligations and failed to remediate compliance findings.',
        'UNDER_REVIEW'
    ),
    (
        1002,
        'CASE-2026-0003',
        'Customer complaint about service delay',
        'The complaint concerns delayed response and missing case update notification.',
        'OPEN'
    );
```

### 3.3 Basic FTS query

```sql
SELECT
    id,
    case_no,
    title
FROM case_documents
WHERE to_tsvector('english', title || ' ' || body)
      @@ plainto_tsquery('english', 'reporting compliance');
```

`plainto_tsquery` cocok untuk input polos dari user karena tanda baca tidak dianggap sebagai operator query; hasilnya adalah query yang mencocokkan semua non-stopword dari input. PostgreSQL juga menyediakan `phraseto_tsquery`, `websearch_to_tsquery`, dan `to_tsquery` untuk kebutuhan parsing query yang berbeda. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-textsearch.html?utm_source=chatgpt.com))

---

## 4. Pilih parser query yang benar

| Function | Cocok untuk | Contoh input | Karakteristik |
|---|---|---|---|
| `plainto_tsquery(config, text)` | Search box sederhana | `late reporting compliance` | Input polos; cocok sebagai default awal |
| `phraseto_tsquery(config, text)` | Phrase/proximity search | `late reporting` | Mencari kata dengan urutan/proximity |
| `websearch_to_tsquery(config, text)` | Search box mirip Google | `"late reporting" OR compliance -draft` | Lebih ramah untuk user-facing search |
| `to_tsquery(config, text)` | Advanced/internal query | `reporting & compliance` | Butuh syntax valid; cocok untuk admin/internal DSL |

Practical rule: untuk public/internal search box biasa, mulai dari `websearch_to_tsquery()` atau `plainto_tsquery()`. Jangan langsung expose `to_tsquery()` ke user umum karena user harus tahu operator `tsquery` seperti `&`, `|`, `!`, dan `<->`. Operator dan fungsi text search ini didokumentasikan sebagai bagian dari fungsi/operator FTS PostgreSQL. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-textsearch.html?utm_source=chatgpt.com))

---

## 5. Tambahkan ranking

Query sebelumnya hanya menjawab “match atau tidak”. Dalam search production, hasil perlu diurutkan berdasarkan relevansi.

```sql
SELECT
    id,
    case_no,
    title,
    ts_rank_cd(
        to_tsvector('english', title || ' ' || body),
        plainto_tsquery('english', 'reporting compliance')
    ) AS rank_score
FROM case_documents
WHERE to_tsvector('english', title || ' ' || body)
      @@ plainto_tsquery('english', 'reporting compliance')
ORDER BY rank_score DESC, created_at DESC
LIMIT 20;
```

PostgreSQL menyediakan `ts_rank()` dan `ts_rank_cd()` untuk ranking hasil FTS; `ts_rank_cd()` memakai cover-density ranking, sehingga proximity antar-term dapat memengaruhi skor. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html?utm_source=chatgpt.com))

---

## 6. Production-style: jangan hitung `to_tsvector` berulang terus

Untuk query ad-hoc kecil, expression langsung masih oke. Untuk tabel besar, lebih baik punya kolom search vector yang bisa di-index.

```sql
ALTER TABLE case_documents
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    to_tsvector(
        'english',
        coalesce(case_no, '') || ' ' ||
        coalesce(title, '')   || ' ' ||
        coalesce(body, '')
    )
) STORED;
```

Lalu buat GIN index:

```sql
CREATE INDEX idx_case_documents_search_vector
ON case_documents
USING GIN (search_vector);
```

PostgreSQL menyatakan full text search bisa berjalan tanpa index, tetapi penggunaan praktis pada tabel yang sering dicari biasanya membutuhkan index. Untuk FTS, PostgreSQL mendukung GIN dan GiST; dokumentasi menyebut GIN sebagai preferred index type untuk text search. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-tables.html?utm_source=chatgpt.com))

---

## 7. Query production-style dengan filter tenant

Search di enterprise system hampir selalu punya filter domain: `tenant_id`, `status`, `date range`, `visibility`, `case type`, dan authorization boundary.

```sql
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    d.id,
    d.case_no,
    d.title,
    d.status,
    ts_rank_cd(d.search_vector, q.query) AS rank_score
FROM case_documents d
CROSS JOIN q
WHERE d.tenant_id = :tenantId
  AND d.status IN ('OPEN', 'UNDER_REVIEW')
  AND d.search_vector @@ q.query
ORDER BY rank_score DESC, d.created_at DESC
LIMIT :limit
OFFSET :offset;
```

Practical invariant:

```text
Search result must never cross tenant/security boundary.
```

Jadi filter authorization harus dianggap bagian dari query utama, bukan post-filter di Java.

---

## 8. Weighted search: title lebih penting dari body

Dalam banyak aplikasi, match di `title` harus lebih tinggi daripada match di `body`.

```sql
ALTER TABLE case_documents
ADD COLUMN weighted_search_vector tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(case_no, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(title,   '')), 'A') ||
    setweight(to_tsvector('english', coalesce(body,    '')), 'B')
) STORED;

CREATE INDEX idx_case_documents_weighted_search_vector
ON case_documents
USING GIN (weighted_search_vector);
```

Query:

```sql
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    d.id,
    d.case_no,
    d.title,
    ts_rank_cd(d.weighted_search_vector, q.query) AS rank_score
FROM case_documents d
CROSS JOIN q
WHERE d.tenant_id = :tenantId
  AND d.weighted_search_vector @@ q.query
ORDER BY rank_score DESC, d.created_at DESC
LIMIT :limit;
```

`setweight()` dapat memberi label bobot `A`, `B`, `C`, atau `D` pada bagian `tsvector`; ini memungkinkan kolom seperti title atau case number diberi bobot lebih tinggi daripada body. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html?utm_source=chatgpt.com))

---

## 9. Highlighting snippet

Untuk UX search, tampilkan potongan teks yang menjelaskan kenapa row match.

```sql
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    d.id,
    d.case_no,
    d.title,
    ts_headline(
        'english',
        d.body,
        q.query,
        'StartSel=<mark>, StopSel=</mark>, MaxWords=35, MinWords=10'
    ) AS snippet,
    ts_rank_cd(d.weighted_search_vector, q.query) AS rank_score
FROM case_documents d
CROSS JOIN q
WHERE d.tenant_id = :tenantId
  AND d.weighted_search_vector @@ q.query
ORDER BY rank_score DESC
LIMIT :limit;
```

`ts_headline()` menghasilkan excerpt dengan highlight untuk term yang match, tetapi output-nya tetap perlu diperlakukan hati-hati pada web UI karena dokumentasi PostgreSQL memperingatkan hasil headline tidak dijamin aman langsung untuk rendering web tanpa sanitization. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html?utm_source=chatgpt.com))

---

## 10. Practical query patterns

### Pattern A - Simple search endpoint

```sql
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    d.id,
    d.case_no,
    d.title,
    d.status,
    ts_rank_cd(d.weighted_search_vector, q.query) AS score
FROM case_documents d
CROSS JOIN q
WHERE d.tenant_id = :tenantId
  AND d.weighted_search_vector @@ q.query
ORDER BY score DESC, d.created_at DESC
LIMIT :limit;
```

Use when:

```text
User enters keyword/phrase in normal search box.
```

---

### Pattern B - Search with status filter

```sql
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    d.id,
    d.case_no,
    d.title,
    d.status,
    ts_rank_cd(d.weighted_search_vector, q.query) AS score
FROM case_documents d
CROSS JOIN q
WHERE d.tenant_id = :tenantId
  AND d.status = ANY(:statuses)
  AND d.weighted_search_vector @@ q.query
ORDER BY score DESC, d.created_at DESC
LIMIT :limit;
```

Use when:

```text
Search is combined with dashboard filters.
```

---

### Pattern C - Search with recency tie-breaker

```sql
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    d.id,
    d.case_no,
    d.title,
    d.created_at,
    ts_rank_cd(d.weighted_search_vector, q.query) AS lexical_score
FROM case_documents d
CROSS JOIN q
WHERE d.tenant_id = :tenantId
  AND d.weighted_search_vector @@ q.query
ORDER BY lexical_score DESC, d.created_at DESC
LIMIT :limit;
```

Use when:

```text
Relevance is primary, but newer documents should win when relevance is similar.
```

---

## 11. MyBatis mapper preview

Detail integrasi Java/MyBatis akan dibahas penuh di seri 10, tetapi dari awal desain SQL sebaiknya sudah dibuat parameterized dan mapper-friendly.

```xml
<select id="searchCaseDocuments" resultMap="CaseSearchResultMap">
    WITH q AS (
        SELECT websearch_to_tsquery('english', #{query}) AS query
    )
    SELECT
        d.id,
        d.case_no,
        d.title,
        d.status,
        ts_headline(
            'english',
            d.body,
            q.query,
            'StartSel=&lt;mark&gt;, StopSel=&lt;/mark&gt;, MaxWords=35, MinWords=10'
        ) AS snippet,
        ts_rank_cd(d.weighted_search_vector, q.query) AS score
    FROM case_documents d
    CROSS JOIN q
    WHERE d.tenant_id = #{tenantId}
      AND d.weighted_search_vector @@ q.query
    ORDER BY score DESC, d.created_at DESC
    LIMIT #{limit}
    OFFSET #{offset}
</select>
```

DTO minimal:

```java
public record CaseSearchResult(
    long id,
    String caseNo,
    String title,
    String status,
    String snippet,
    double score
) {}
```

JAX-RS endpoint preview:

```java
@Path("/cases/search")
@Produces(MediaType.APPLICATION_JSON)
public class CaseSearchResource {

    private final CaseSearchService searchService;

    public CaseSearchResource(CaseSearchService searchService) {
        this.searchService = searchService;
    }

    @GET
    public List<CaseSearchResult> search(
            @QueryParam("q") String query,
            @QueryParam("limit") @DefaultValue("20") int limit,
            @QueryParam("offset") @DefaultValue("0") int offset
    ) {
        long tenantId = resolveTenantIdFromSecurityContext();

        return searchService.search(tenantId, query, limit, offset);
    }

    private long resolveTenantIdFromSecurityContext() {
        // Placeholder: resolve from JWT/session/request context.
        return 1001L;
    }
}
```

Practical rule untuk service layer:

```java
public List<CaseSearchResult> search(
        long tenantId,
        String query,
        int limit,
        int offset
) {
    if (query == null || query.isBlank()) {
        return List.of();
    }

    int safeLimit = Math.min(Math.max(limit, 1), 50);
    int safeOffset = Math.max(offset, 0);

    return mapper.searchCaseDocuments(
        tenantId,
        query.trim(),
        safeLimit,
        safeOffset
    );
}
```

---

## 12. Common mistakes

| Mistake | Dampak | Solusi |
|---|---|---|
| Pakai `ILIKE '%keyword%'` untuk semua search | Lambat, tidak ranking-aware | Pakai FTS untuk long text |
| Langsung expose `to_tsquery()` ke user | Query error / syntax coupling | Pakai `websearch_to_tsquery()` atau `plainto_tsquery()` |
| Tidak pakai tenant/security filter di SQL | Risiko data leak | Filter authorization wajib di query |
| Tidak pakai generated column/index | Query lambat saat data besar | Pakai stored `tsvector` + GIN |
| Ranking hanya berdasarkan `created_at` | Search terasa tidak relevan | Pakai `ts_rank` / `ts_rank_cd` |
| Title dan body bobotnya sama | Result penting bisa tenggelam | Pakai `setweight()` |
| Highlight langsung dirender tanpa sanitization | Risiko HTML/script issue | Sanitize output sebelum UI render |
| Tidak memonitor slow search | Latency naik diam-diam | Pakai `EXPLAIN ANALYZE`, metrics, slow query log |

---

## 13. Checklist implementasi Seri 1

| Checklist | Status target |
|---|---|
| Tabel punya kolom teks yang jelas untuk search | Ada |
| Search vector dibuat dari field penting | Ada |
| Case number/title diberi bobot lebih tinggi | Ada |
| Query parser memakai `websearch_to_tsquery()` atau `plainto_tsquery()` | Ada |
| Query selalu include `tenant_id` / authorization filter | Ada |
| GIN index dibuat untuk `tsvector` | Ada |
| Ranking memakai `ts_rank_cd()` | Ada |
| Limit dibatasi di service layer | Ada |
| Highlight disanitasi sebelum render | Ada |
| Query dites dengan `EXPLAIN ANALYZE` | Ada |

---

## 14. Mini exercise

Buat tabel `knowledge_articles`:

```sql
CREATE TABLE knowledge_articles (
    id          BIGSERIAL PRIMARY KEY,
    tenant_id   BIGINT NOT NULL,
    code        TEXT NOT NULL,
    title       TEXT NOT NULL,
    summary     TEXT NOT NULL,
    content     TEXT NOT NULL,
    category    TEXT NOT NULL,
    published   BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Tambahkan:

```sql
ALTER TABLE knowledge_articles
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(code, '')),    'A') ||
    setweight(to_tsvector('english', coalesce(title, '')),   'A') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
) STORED;

CREATE INDEX idx_knowledge_articles_search_vector
ON knowledge_articles
USING GIN (search_vector);
```

Lalu buat query:

```sql
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    a.id,
    a.code,
    a.title,
    a.category,
    ts_headline(
        'english',
        a.summary || ' ' || a.content,
        q.query,
        'StartSel=<mark>, StopSel=</mark>, MaxWords=30'
    ) AS snippet,
    ts_rank_cd(a.search_vector, q.query) AS score
FROM knowledge_articles a
CROSS JOIN q
WHERE a.tenant_id = :tenantId
  AND a.published = true
  AND a.search_vector @@ q.query
ORDER BY score DESC, a.created_at DESC
LIMIT 20;
```

---

## Seri 1 selesai

Seri berikutnya yang direkomendasikan:

**Seri 2/10 - FTS Document Modeling, `tsvector`, `tsquery`, dan Generated Column**

Fokusnya: desain dokumen search yang benar untuk sistem enterprise, multi-column search, generated column vs expression index vs trigger, multi-language config, dan pola migrasi schema PostgreSQL production-grade.

---

**Sources:**

- [Documentation: 18: Chapter 12. Full Text Search](https://www.postgresql.org/docs/current/textsearch.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 7:59:13 PM

# Seri 2/10 - FTS Document Modeling, `tsvector`, `tsquery`, dan Generated Column

Seri ini fokus pada hal yang sering salah di production: **apa sebenarnya “dokumen” yang dicari**, bagaimana menyusun `tsvector`, bagaimana memilih `tsquery`, dan kapan memakai **generated column**, **expression index**, **trigger**, atau **search projection table**.

Basis versi: dokumentasi current PostgreSQL yang terbuka saat ini adalah **PostgreSQL 18**, sementara PostgreSQL 19 masih berada di jalur development/beta. Jadi pola di bawah aman untuk PostgreSQL modern, terutama 17/18, dengan catatan selalu test di versi runtime perusahaan. PostgreSQL docs juga menegaskan FTS bisa berjalan tanpa index, tetapi penggunaan praktis pada tabel yang sering dicari biasanya membutuhkan index. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-tables.html))

---

## 1. Core problem

Dalam Full Text Search, kesalahan paling umum bukan SQL syntax, tapi **document modeling**.

Misalnya ada sistem case management:

```text
case
├── case_no
├── title
├── description
├── complainant
├── regulated_entity
├── findings
├── decision
├── attachments
├── comments
└── workflow events
```

Pertanyaannya: ketika user mengetik `late reporting non compliance`, search harus mencari di mana?

| Pilihan | Dampak |
|---|---|
| Hanya `title` | Cepat, tapi recall rendah |
| `title + body` | Simple, cocok untuk awal |
| `case_no + title + body + entity name` | Lebih berguna untuk case search |
| Semua related table digabung | Lebih lengkap, tapi sinkronisasi lebih kompleks |
| Attachment/chunk per paragraph | Cocok untuk knowledge/RAG, tapi butuh search projection |
| Per event/comment | Cocok untuk audit trail search, tapi result boundary berbeda |

Practical rule:

```text
Tentukan search result unit lebih dulu, baru desain tsvector.
```

Jangan mulai dari “kolom apa yang ada di tabel”, mulai dari **apa yang user harapkan keluar sebagai hasil search**.

---

## 2. Mental model

```text
User search intent
│
├── Search result unit
│   ├── Case
│   ├── Document
│   ├── Article
│   ├── Attachment
│   ├── Comment
│   └── Workflow event
│
├── Searchable fields
│   ├── Exact identifiers
│   ├── High-value title/name fields
│   ├── Summary/body fields
│   ├── Tags/category fields
│   └── Optional related text
│
├── Text normalization
│   ├── language config
│   ├── stop words
│   ├── stemming
│   └── synonym strategy
│
├── tsvector construction
│   ├── generated column
│   ├── expression index
│   ├── trigger-maintained column
│   └── search projection table
│
└── Query contract
    ├── plainto_tsquery
    ├── websearch_to_tsquery
    ├── phraseto_tsquery
    └── to_tsquery for controlled advanced syntax
```

---

## 3. `tsvector` vs `tsquery`

### `tsvector`

`tsvector` adalah representasi dokumen yang sudah diproses menjadi lexeme. `to_tsvector()` menormalisasi text berdasarkan configuration yang diberikan, dan menyimpan position information. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-textsearch.html))

Contoh:

```sql
SELECT to_tsvector('english', 'The regulated entities failed reporting obligations');
```

Kira-kira hasilnya akan menyimpan lexeme seperti:

```text
'entiti' 'fail' 'oblig' 'regul' 'report'
```

Artinya, FTS bukan menyimpan text mentah. Ia menyimpan bentuk lexical yang sudah dinormalisasi.

---

### `tsquery`

`tsquery` adalah representasi query user. Contoh parser:

```sql
SELECT plainto_tsquery('english', 'late reporting compliance');
SELECT websearch_to_tsquery('english', '"late reporting" OR compliance -draft');
SELECT phraseto_tsquery('english', 'late reporting');
SELECT to_tsquery('english', 'reporting & compliance');
```

PostgreSQL mendokumentasikan bahwa `plainto_tsquery()` mengubah text biasa menjadi query yang mencocokkan semua non-stopword, `phraseto_tsquery()` mencari phrase, `websearch_to_tsquery()` memahami quoted phrase, `OR`, dan dash sebagai negasi, sedangkan `to_tsquery()` membutuhkan operator `tsquery` yang valid. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-textsearch.html))

---

## 4. Search document design pattern

### Pattern A - Single-table document

Cocok untuk:

```text
knowledge_articles
case_documents
announcements
policies
faq_entries
```

Contoh schema:

```sql
CREATE TABLE knowledge_articles (
    id           BIGSERIAL PRIMARY KEY,
    tenant_id    BIGINT NOT NULL,
    code         TEXT NOT NULL,
    title        TEXT NOT NULL,
    summary      TEXT,
    content      TEXT,
    category     TEXT NOT NULL,
    status       TEXT NOT NULL,
    language     REGCONFIG NOT NULL DEFAULT 'english',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Design intent:

| Field | Search role | Weight |
|---|---|---|
| `code` | Exact-ish lookup, strong signal | A |
| `title` | Highest lexical relevance | A |
| `summary` | Medium signal | B |
| `content` | Broad recall | C |
| `category` | Filter lebih baik daripada search text | biasanya filter |
| `status` | Filter, bukan text search | filter |
| `tenant_id` | Security boundary | mandatory filter |

---

## 5. Generated column pattern

Untuk single-table document, **stored generated column** biasanya pilihan default yang paling bersih.

```sql
ALTER TABLE knowledge_articles
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector(language, coalesce(code, '')), 'A') ||
    setweight(to_tsvector(language, coalesce(title, '')), 'A') ||
    setweight(to_tsvector(language, coalesce(summary, '')), 'B') ||
    setweight(to_tsvector(language, coalesce(content, '')), 'C')
) STORED;
```

Lalu index:

```sql
CREATE INDEX idx_knowledge_articles_search_vector
ON knowledge_articles
USING GIN (search_vector);
```

Kenapa `STORED`?

PostgreSQL 18 punya generated column stored dan virtual; stored generated column dihitung saat write dan disimpan, sedangkan virtual dihitung saat read. Untuk FTS production, stored lebih cocok karena targetnya adalah menghindari hitung ulang `to_tsvector()` saat query dan membuat kolom `tsvector` bisa di-index seperti kolom biasa. Dokumentasi PostgreSQL juga memberi contoh stored generated column untuk `tsvector`, lalu membuat GIN index di atas kolom tersebut. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-generated-columns.html?utm_source=chatgpt.com))

Practical invariant:

```text
Search vector harus deterministic terhadap row yang sama.
```

Generated column PostgreSQL punya batasan: expression hanya boleh memakai immutable functions, tidak boleh memakai subquery, dan tidak boleh mereferensikan selain current row. Jadi generated column cocok untuk text dari row yang sama, bukan gabungan dari child table/related table. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-generated-columns.html?utm_source=chatgpt.com))

---

## 6. Expression index pattern

Expression index cocok kalau:

```text
- schema tidak ingin ditambah kolom search_vector
- dokumen search sederhana
- query selalu memakai expression yang sama
- tidak butuh inspect/debug search_vector per row
```

Contoh:

```sql
CREATE INDEX idx_knowledge_articles_search_expr
ON knowledge_articles
USING GIN (
    (
        setweight(to_tsvector('english', coalesce(code, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(content, '')), 'C')
    )
);
```

Query harus konsisten dengan expression index:

```sql
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    id,
    code,
    title,
    ts_rank_cd(
        setweight(to_tsvector('english', coalesce(code, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(content, '')), 'C'),
        q.query
    ) AS score
FROM knowledge_articles
CROSS JOIN q
WHERE tenant_id = :tenantId
  AND status = 'PUBLISHED'
  AND (
        setweight(to_tsvector('english', coalesce(code, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(content, '')), 'C')
      ) @@ q.query
ORDER BY score DESC, updated_at DESC
LIMIT :limit;
```

PostgreSQL docs menekankan bahwa expression index untuk FTS perlu memakai konfigurasi yang eksplisit, misalnya `to_tsvector('english', body)`, agar isi index tidak bergantung pada `default_text_search_config`. Query yang ingin memakai index juga harus memakai bentuk expression/config yang sesuai. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-tables.html))

Production verdict:

| Aspect | Generated column | Expression index |
|---|---:|---:|
| Query SQL clean | Lebih baik | Lebih verbose |
| Bisa inspect `search_vector` | Ya | Tidak langsung |
| Cocok untuk ranking reuse | Ya | Bisa, tapi repetitif |
| Schema berubah | Tambah kolom | Tidak tambah kolom |
| Risk expression mismatch | Rendah | Lebih tinggi |
| Recommended default | Ya | Untuk kasus simple/legacy |

---

## 7. Trigger-maintained `tsvector` pattern

Trigger cocok jika:

```text
- perlu logic custom yang tidak cocok di generated column
- perlu update search vector dari beberapa field dengan transformasi kompleks
- butuh compatibility dengan versi/aturan tertentu
- perlu side effect atau condition tertentu saat update
```

Contoh custom trigger:

```sql
ALTER TABLE knowledge_articles
ADD COLUMN search_vector_triggered tsvector;
```

```sql
CREATE OR REPLACE FUNCTION knowledge_articles_search_vector_sync()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.search_vector_triggered :=
        setweight(to_tsvector(NEW.language, coalesce(NEW.code, '')), 'A') ||
        setweight(to_tsvector(NEW.language, coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector(NEW.language, coalesce(NEW.summary, '')), 'B') ||
        setweight(to_tsvector(NEW.language, coalesce(NEW.content, '')), 'C');

    NEW.updated_at := now();

    RETURN NEW;
END;
$$;
```

```sql
CREATE TRIGGER trg_knowledge_articles_search_vector_sync
BEFORE INSERT OR UPDATE OF code, title, summary, content, language
ON knowledge_articles
FOR EACH ROW
EXECUTE FUNCTION knowledge_articles_search_vector_sync();
```

```sql
CREATE INDEX idx_knowledge_articles_search_vector_triggered
ON knowledge_articles
USING GIN (search_vector_triggered);
```

PostgreSQL menyediakan built-in trigger untuk update `tsvector`, tetapi dokumentasinya juga mencatat keterbatasan: built-in trigger memperlakukan semua input column sama; jika ingin memberi bobot berbeda, misalnya title lebih penting daripada body, perlu custom trigger PL/pgSQL. Dokumentasi juga menekankan konfigurasi FTS perlu dispesifikasikan eksplisit dalam trigger agar hasil tidak berubah akibat `default_text_search_config`. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-features.html))

Production verdict:

| Aspect | Trigger |
|---|---|
| Kelebihan | Fleksibel |
| Kekurangan | Ada hidden write-time logic |
| Risiko | Bug sinkronisasi kalau trigger tidak mencakup semua update path |
| Cocok untuk | Complex weighting, transformasi custom, legacy schema |
| Hindari jika | Generated column sudah cukup |

---

## 8. Search projection table pattern

Generated column tidak bisa membaca related table karena expression generated column hanya boleh bergantung pada current row. Untuk search yang menggabungkan parent + child + attachment + comment, gunakan **search projection table**. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-generated-columns.html?utm_source=chatgpt.com))

Contoh domain:

```text
cases
case_parties
case_findings
case_decisions
case_comments
attachments_text
```

Daripada memaksa `cases.search_vector` membaca semua table, buat table khusus:

```sql
CREATE TABLE case_search_documents (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       BIGINT NOT NULL,
    case_id         BIGINT NOT NULL,
    document_type   TEXT NOT NULL,
    source_id       BIGINT NOT NULL,
    title           TEXT NOT NULL,
    body            TEXT NOT NULL,
    status          TEXT NOT NULL,
    language        REGCONFIG NOT NULL DEFAULT 'english',
    source_updated_at TIMESTAMPTZ NOT NULL,
    indexed_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    search_vector   tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector(language, coalesce(title, '')), 'A') ||
        setweight(to_tsvector(language, coalesce(body,  '')), 'B')
    ) STORED,

    UNIQUE (tenant_id, document_type, source_id)
);
```

Index:

```sql
CREATE INDEX idx_case_search_documents_tenant_status
ON case_search_documents (tenant_id, status);

CREATE INDEX idx_case_search_documents_case_id
ON case_search_documents (case_id);

CREATE INDEX idx_case_search_documents_search_vector
ON case_search_documents
USING GIN (search_vector);
```

Query:

```sql
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    s.case_id,
    s.document_type,
    s.source_id,
    s.title,
    ts_rank_cd(s.search_vector, q.query) AS score
FROM case_search_documents s
CROSS JOIN q
WHERE s.tenant_id = :tenantId
  AND s.status IN ('OPEN', 'UNDER_REVIEW', 'PUBLISHED')
  AND s.search_vector @@ q.query
ORDER BY score DESC, s.source_updated_at DESC
LIMIT :limit
OFFSET :offset;
```

Practical use:

| Source | Projection `document_type` |
|---|---|
| Case main record | `CASE` |
| Finding | `FINDING` |
| Decision | `DECISION` |
| Comment | `COMMENT` |
| Attachment text | `ATTACHMENT` |
| Knowledge article | `ARTICLE` |

This is often the cleanest production design because search has its own read model.

---

## 9. Multi-language modeling

Jika data hanya English, cukup:

```sql
to_tsvector('english', content)
websearch_to_tsquery('english', :query)
```

Jika multi-language, simpan config per row:

```sql
CREATE TABLE document_language_config (
    language_code TEXT PRIMARY KEY,
    text_search_config REGCONFIG NOT NULL
);

INSERT INTO document_language_config(language_code, text_search_config)
VALUES
    ('en', 'english'),
    ('simple', 'simple');
```

Pada tabel document:

```sql
ALTER TABLE knowledge_articles
ADD COLUMN text_search_config REGCONFIG NOT NULL DEFAULT 'english';
```

Generated column:

```sql
ALTER TABLE knowledge_articles
ADD COLUMN search_vector_i18n tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector(text_search_config, coalesce(title, '')), 'A') ||
    setweight(to_tsvector(text_search_config, coalesce(summary, '')), 'B') ||
    setweight(to_tsvector(text_search_config, coalesce(content, '')), 'C')
) STORED;
```

Query harus memakai config yang sesuai. Untuk search lintas bahasa, jangan asal memakai satu `tsquery` untuk semua row. Salah satu pola aman:

```sql
WITH q AS (
    SELECT
        websearch_to_tsquery('english', :query) AS q_english,
        websearch_to_tsquery('simple',  :query) AS q_simple
)
SELECT
    a.id,
    a.title,
    ts_rank_cd(
        a.search_vector_i18n,
        CASE
            WHEN a.text_search_config = 'english'::regconfig THEN q.q_english
            ELSE q.q_simple
        END
    ) AS score
FROM knowledge_articles a
CROSS JOIN q
WHERE a.tenant_id = :tenantId
  AND (
        (a.text_search_config = 'english'::regconfig AND a.search_vector_i18n @@ q.q_english)
     OR (a.text_search_config = 'simple'::regconfig  AND a.search_vector_i18n @@ q.q_simple)
  )
ORDER BY score DESC
LIMIT :limit;
```

PostgreSQL docs menunjukkan text search configuration dapat dibuat eksplisit dan bahkan bisa berasal dari kolom, misalnya untuk koleksi dokumen multi-bahasa. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-tables.html))

Practical note untuk Bahasa Indonesia:

```text
Jangan asumsikan 'english' config cocok untuk semua data.
```

Untuk data Indonesia-English campuran, sering kali mulai dari `simple` untuk field tertentu, lalu naik ke custom dictionary/synonym bila kebutuhan search domain sudah jelas.

---

## 10. Modeling exact identifiers vs text search

FTS tidak ideal untuk semua field. Beberapa field lebih baik diperlakukan sebagai exact/prefix/trigram search.

| Field | Search strategy |
|---|---|
| `case_no = CASE-2026-0001` | B-tree equality / prefix |
| `nik`, `npwp`, `license_no` | B-tree equality, normalized value |
| `title`, `summary`, `body` | FTS |
| `person_name`, `company_name` | FTS + trigram fallback |
| `tags` | array/jsonb/filter table atau FTS tergantung UX |
| `status`, `category`, `tenant_id` | filter, bukan FTS |
| `attachment_text` | projection table atau chunk table |

Contoh query gabungan identifier + FTS:

```sql
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    a.id,
    a.code,
    a.title,
    ts_rank_cd(a.search_vector, q.query) AS score
FROM knowledge_articles a
CROSS JOIN q
WHERE a.tenant_id = :tenantId
  AND a.status = 'PUBLISHED'
  AND (
        a.code = :query
        OR a.code ILIKE :queryPrefix
        OR a.search_vector @@ q.query
  )
ORDER BY
    CASE
        WHEN a.code = :query THEN 0
        WHEN a.code ILIKE :queryPrefix THEN 1
        ELSE 2
    END,
    score DESC NULLS LAST,
    a.updated_at DESC
LIMIT :limit;
```

Practical reason: user yang mengetik kode perkara biasanya ingin exact hit menang atas relevance ranking biasa.

---

## 11. Safe query construction

### Jangan lakukan ini

```sql
-- BAD: raw user syntax masuk ke to_tsquery
SELECT *
FROM knowledge_articles
WHERE search_vector @@ to_tsquery('english', :rawUserQuery);
```

Masalahnya: `to_tsquery()` mengharapkan syntax `tsquery` valid.

### Lebih aman untuk search box biasa

```sql
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT *
FROM knowledge_articles a
CROSS JOIN q
WHERE a.tenant_id = :tenantId
  AND a.search_vector @@ q.query;
```

`websearch_to_tsquery()` memang dirancang mendekati perilaku search engine umum: quoted text menjadi phrase, `or` menjadi OR, dash menjadi NOT, dan punctuation lain diabaikan. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-textsearch.html))

---

## 12. Handling empty / stop-word-only query

User bisa mengetik:

```text
the and of
```

Untuk English config, ini bisa jadi query kosong/kurang bermakna. Gunakan guard di application layer dan SQL layer.

Application guard:

```java
public String normalizeSearchQuery(String raw) {
    if (raw == null) {
        return "";
    }
    return raw.trim().replaceAll("\\s+", " ");
}
```

SQL guard:

```sql
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    a.id,
    a.title
FROM knowledge_articles a
CROSS JOIN q
WHERE :query <> ''
  AND numnode(q.query) > 0
  AND a.tenant_id = :tenantId
  AND a.search_vector @@ q.query
LIMIT :limit;
```

`querytree()` dapat menunjukkan bagian `tsquery` yang indexable; hasil kosong atau `T` menunjukkan query non-indexable. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-textsearch.html))

---

## 13. Practical migration path

### Step 1 - Add generated column

```sql
ALTER TABLE knowledge_articles
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(code, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
) STORED;
```

### Step 2 - Create index concurrently

```sql
CREATE INDEX CONCURRENTLY idx_knowledge_articles_search_vector
ON knowledge_articles
USING GIN (search_vector);
```

### Step 3 - Add tenant/status helper index

```sql
CREATE INDEX CONCURRENTLY idx_knowledge_articles_tenant_status_updated
ON knowledge_articles (tenant_id, status, updated_at DESC);
```

### Step 4 - Deploy query path behind feature flag

```text
old_search = ILIKE
new_search = FTS
```

### Step 5 - Compare result quality

Track:

```text
- zero-result rate
- top result clicked
- search latency p95/p99
- query count by tenant
- most common query
- slowest query
- queries returning too many rows
```

---

## 14. MyBatis mapper example

```xml
<resultMap id="KnowledgeSearchResultMap" type="com.example.search.KnowledgeSearchResult">
    <id property="id" column="id"/>
    <result property="code" column="code"/>
    <result property="title" column="title"/>
    <result property="category" column="category"/>
    <result property="snippet" column="snippet"/>
    <result property="score" column="score"/>
</resultMap>

<select id="searchKnowledgeArticles" resultMap="KnowledgeSearchResultMap">
    WITH q AS (
        SELECT websearch_to_tsquery('english', #{query}) AS query
    )
    SELECT
        a.id,
        a.code,
        a.title,
        a.category,
        ts_headline(
            'english',
            coalesce(a.summary, '') || ' ' || coalesce(a.content, ''),
            q.query,
            'StartSel=&lt;mark&gt;, StopSel=&lt;/mark&gt;, MaxWords=35, MinWords=10'
        ) AS snippet,
        ts_rank_cd(a.search_vector, q.query) AS score
    FROM knowledge_articles a
    CROSS JOIN q
    WHERE #{query} &lt;&gt; ''
      AND numnode(q.query) &gt; 0
      AND a.tenant_id = #{tenantId}
      AND a.status = 'PUBLISHED'
      AND a.search_vector @@ q.query
    ORDER BY score DESC, a.updated_at DESC
    LIMIT #{limit}
    OFFSET #{offset}
</select>
```

DTO:

```java
package com.example.search;

public record KnowledgeSearchResult(
    long id,
    String code,
    String title,
    String category,
    String snippet,
    double score
) {}
```

Mapper interface:

```java
package com.example.search;

import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface KnowledgeSearchMapper {

    List<KnowledgeSearchResult> searchKnowledgeArticles(
        @Param("tenantId") long tenantId,
        @Param("query") String query,
        @Param("limit") int limit,
        @Param("offset") int offset
    );
}
```

Service guard:

```java
package com.example.search;

import java.util.List;

public class KnowledgeSearchService {

    private final KnowledgeSearchMapper mapper;

    public KnowledgeSearchService(KnowledgeSearchMapper mapper) {
        this.mapper = mapper;
    }

    public List<KnowledgeSearchResult> search(
        long tenantId,
        String rawQuery,
        int requestedLimit,
        int requestedOffset
    ) {
        String query = normalize(rawQuery);

        if (query.isBlank()) {
            return List.of();
        }

        int limit = Math.min(Math.max(requestedLimit, 1), 50);
        int offset = Math.max(requestedOffset, 0);

        return mapper.searchKnowledgeArticles(
            tenantId,
            query,
            limit,
            offset
        );
    }

    private String normalize(String raw) {
        if (raw == null) {
            return "";
        }
        return raw.trim().replaceAll("\\s+", " ");
    }
}
```

---

## 15. Decision matrix

| Need | Recommended pattern |
|---|---|
| Search one table, few text fields | Stored generated `tsvector` |
| Search one table, avoid schema column | Expression GIN index |
| Need custom logic beyond generated column | Trigger-maintained `tsvector` |
| Search parent + child tables | Search projection table |
| Multi-language per row | `regconfig` column + matching query config |
| Search attachments/chunks | Search projection table / chunk table |
| Exact case number lookup | B-tree, not FTS |
| Typo/fuzzy person/company name | `pg_trgm`, not pure FTS |
| User-facing search box | `websearch_to_tsquery()` |
| Controlled admin DSL | `to_tsquery()` with validation |

---

## 16. Production checklist

| Checklist | Why it matters |
|---|---|
| Search result unit sudah jelas | Mencegah result ambigu |
| `tenant_id` selalu masuk SQL filter | Mencegah data leak |
| `status/visibility` masuk SQL filter | Mencegah hasil unauthorized |
| Field bobot A/B/C/D ditentukan | Ranking lebih masuk akal |
| `coalesce()` dipakai di vector expression | NULL tidak mematikan concatenation |
| Config FTS eksplisit | Index konsisten |
| Stored generated column dipilih untuk default production | Query lebih clean dan indexable |
| Expression index hanya jika expression stabil | Hindari mismatch query-index |
| Trigger hanya jika butuh logic custom | Mengurangi hidden complexity |
| Projection table untuk multi-table search | Menjaga boundary indexing jelas |
| Query kosong/stopword ditangani | Hindari scan/query tidak bermakna |
| `EXPLAIN ANALYZE` wajib untuk query final | Validasi index benar-benar dipakai |

---

## 17. Mini exercise

Buat search untuk domain **regulatory enforcement case**.

### Table

```sql
CREATE TABLE enforcement_cases (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       BIGINT NOT NULL,
    case_no         TEXT NOT NULL,
    subject_name    TEXT NOT NULL,
    title           TEXT NOT NULL,
    allegation      TEXT,
    investigation_summary TEXT,
    decision_summary TEXT,
    status          TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Generated column

```sql
ALTER TABLE enforcement_cases
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(case_no, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(subject_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(allegation, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(investigation_summary, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(decision_summary, '')), 'C')
) STORED;
```

### Index

```sql
CREATE INDEX CONCURRENTLY idx_enforcement_cases_search_vector
ON enforcement_cases
USING GIN (search_vector);

CREATE INDEX CONCURRENTLY idx_enforcement_cases_tenant_status_updated
ON enforcement_cases (tenant_id, status, updated_at DESC);
```

### Query

```sql
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    c.id,
    c.case_no,
    c.subject_name,
    c.title,
    c.status,
    ts_headline(
        'english',
        coalesce(c.allegation, '') || ' ' ||
        coalesce(c.investigation_summary, '') || ' ' ||
        coalesce(c.decision_summary, ''),
        q.query,
        'StartSel=<mark>, StopSel=</mark>, MaxWords=40, MinWords=10'
    ) AS snippet,
    ts_rank_cd(c.search_vector, q.query) AS score
FROM enforcement_cases c
CROSS JOIN q
WHERE numnode(q.query) > 0
  AND c.tenant_id = :tenantId
  AND c.status IN ('OPEN', 'UNDER_REVIEW', 'DECIDED')
  AND c.search_vector @@ q.query
ORDER BY score DESC, c.updated_at DESC
LIMIT :limit
OFFSET :offset;
```

---

## Seri 2 selesai

Seri berikutnya:

**Seri 3/10 - FTS Indexing, Ranking, Weighting, Highlighting**

Fokusnya akan lebih dalam ke GIN/GiST, weighted ranking, `ts_rank` vs `ts_rank_cd`, pagination, result explainability, `ts_headline`, dan pola query yang lebih production-grade.

---

**Sources:**

- [PostgreSQL: Documentation: 18: 12.2. Tables and Indexes](https://www.postgresql.org/docs/current/textsearch-tables.html)

## Response:
7/15/2026, 8:03:13 PM

Saya lanjut ke seri 3/10 dengan fokus indexing dan ranking. Bagian ini saya buat lebih operational: kapan index dipakai, cara membaca trade-off GIN/GiST, dan pola ranking/highlight yang aman untuk endpoint search.

# Seri 3/10 - FTS Indexing, Ranking, Weighting, Highlighting

Seri ini membahas bagian yang paling menentukan apakah PostgreSQL Full Text Search akan terasa **production-grade** atau hanya “sekadar bisa search”: index, ranking, weighting, highlighting, pagination, dan cara membaca trade-off operasionalnya.

Basis referensi: dokumentasi current PostgreSQL yang terbuka saat ini adalah **PostgreSQL 18**, dengan PostgreSQL 19 masih tercatat sebagai development version. Jadi contoh di bawah aman untuk PostgreSQL modern 17/18, dan tetap perlu divalidasi terhadap versi runtime perusahaan. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html))

---

## 1. Core idea

FTS production biasanya terdiri dari 4 lapisan:

```text id="7qustg"
Searchable document
   │
   ▼
Weighted tsvector
   │
   ▼
GIN / GiST index
   │
   ▼
Query match + ranking + highlighting
   │
   ▼
Stable API result
```

PostgreSQL sendiri memecah kebutuhan FTS menjadi: membuat `tsvector` dari dokumen, membuat `tsquery` dari query user, mengurutkan hasil berdasarkan relevansi, dan menampilkan hasil secara usable. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html))

Dalam praktik enterprise, query search yang baik harus menjawab:

| Pertanyaan | Contoh keputusan |
|---|---|
| Dokumen apa yang dicari? | Case, article, attachment, finding |
| Field mana yang lebih penting? | `case_no/title` > `summary` > `body` |
| Index apa yang dipakai? | Biasanya GIN untuk FTS |
| Ranking apa yang dipakai? | `ts_rank_cd` untuk proximity-aware ranking |
| Filter apa yang wajib? | `tenant_id`, visibility, status |
| Result UX apa yang diberikan? | score, snippet, highlight, stable pagination |

---

## 2. Mental model indexing

```text id="7k9ffg"
PostgreSQL FTS index strategy
│
├── GIN index
│   ├── Preferred default for full text search
│   ├── Inverted-index style
│   ├── Fast lookup for lexeme containment
│   ├── Can have pending list via fastupdate
│   └── Needs vacuum/autovacuum awareness
│
├── GiST index
│   ├── Alternative FTS index
│   ├── Can be useful in special cases
│   ├── Signature-based / lossy behavior
│   └── May require recheck
│
├── Expression index
│   ├── Index over to_tsvector(...)
│   ├── No physical search_vector column
│   └── Query expression must match carefully
│
├── Generated column + GIN
│   ├── Recommended practical default
│   ├── Search vector inspectable
│   ├── Query simpler
│   └── Good fit for single-row document model
│
└── Projection table + GIN
    ├── Best for multi-table search
    ├── Search read model
    ├── Attachment/chunk/event search
    └── Good for enterprise boundaries
```

---

## 3. GIN vs GiST untuk FTS

PostgreSQL mendukung **GIN** dan **GiST** untuk full text search. Untuk kebanyakan workload FTS, **GIN adalah default yang lebih tepat** karena dirancang seperti inverted index: lexeme → daftar row yang mengandung lexeme. GIN cocok untuk operator containment seperti `search_vector @@ query`.

| Aspek | GIN | GiST |
|---|---|---|
| Default recommendation untuk FTS | Ya | Tidak biasanya |
| Read/search performance | Umumnya kuat | Bisa bagus, tergantung kasus |
| Write overhead | Lebih terasa | Biasanya lebih ringan |
| Index behavior | Inverted index | Signature/lossy index |
| Recheck | Bisa terjadi, tapi GIN lebih presisi | Lebih mungkin karena lossy |
| Cocok untuk | Search teks umum, document search | Special case, combined search strategy |
| Practical default | **Pakai ini dulu** | Pakai kalau ada alasan terukur |

GIN update bisa lambat karena satu row dapat menghasilkan banyak key di index. PostgreSQL mengatasi ini dengan mekanisme pending list saat `fastupdate` aktif; pending entries akan dipindahkan ke struktur utama saat vacuum/autoanalyze, pemanggilan `gin_clean_pending_list`, atau ketika pending list melewati `gin_pending_list_limit`. Pending list yang besar bisa memperlambat search karena query harus scan pending list juga. ([PostgreSQL](https://www.postgresql.org/docs/current/gin.html))

---

## 4. Schema baseline production

Kita pakai contoh **enforcement case search**.

```sql id="lrqdcg"
CREATE TABLE enforcement_cases (
    id                      BIGSERIAL PRIMARY KEY,
    tenant_id               BIGINT NOT NULL,
    case_no                 TEXT NOT NULL,
    subject_name            TEXT NOT NULL,
    title                   TEXT NOT NULL,
    allegation              TEXT,
    investigation_summary   TEXT,
    decision_summary        TEXT,
    status                  TEXT NOT NULL,
    visibility              TEXT NOT NULL DEFAULT 'INTERNAL',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Tambahkan generated weighted `tsvector`:

```sql id="atz6yi"
ALTER TABLE enforcement_cases
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(case_no, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(subject_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(allegation, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(investigation_summary, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(decision_summary, '')), 'C')
) STORED;
```

`setweight()` memberi label bobot `A`, `B`, `C`, atau `D` pada bagian `tsvector`; PostgreSQL menjelaskan pola ini sebagai cara umum untuk membedakan bagian dokumen seperti title versus body. `coalesce()` juga penting karena `to_tsvector(NULL)` menghasilkan `NULL`. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html))

---

## 5. Index baseline

### 5.1 GIN index utama

```sql id="xnhqsu"
CREATE INDEX CONCURRENTLY idx_enforcement_cases_search_vector
ON enforcement_cases
USING GIN (search_vector);
```

### 5.2 Helper index untuk filter domain

```sql id="6yp0mr"
CREATE INDEX CONCURRENTLY idx_enforcement_cases_tenant_status_updated
ON enforcement_cases (
    tenant_id,
    status,
    updated_at DESC
);
```

### 5.3 Optional partial index

Jika hanya case aktif yang sering dicari:

```sql id="5w5j4b"
CREATE INDEX CONCURRENTLY idx_enforcement_cases_active_search_vector
ON enforcement_cases
USING GIN (search_vector)
WHERE status IN ('OPEN', 'UNDER_REVIEW');
```

Practical note:

```text id="k2u9je"
GIN index mempercepat text match.
B-tree index mempercepat tenant/status/date filtering.
Keduanya sering dibutuhkan bersama.
```

Jangan berharap satu GIN index menyelesaikan semua filter relational.

---

## 6. Query baseline: indexed match + ranking

```sql id="fg7pmq"
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    c.id,
    c.case_no,
    c.subject_name,
    c.title,
    c.status,
    ts_rank_cd(c.search_vector, q.query) AS lexical_score
FROM enforcement_cases c
CROSS JOIN q
WHERE numnode(q.query) > 0
  AND c.tenant_id = :tenantId
  AND c.status IN ('OPEN', 'UNDER_REVIEW', 'DECIDED')
  AND c.search_vector @@ q.query
ORDER BY lexical_score DESC, c.updated_at DESC
LIMIT :limit
OFFSET :offset;
```

`websearch_to_tsquery()` cocok untuk search box karena mendukung quoted phrase, `or`, dash sebagai negasi, dan mengabaikan punctuation lain. `numnode()` bisa dipakai sebagai guard agar query kosong atau stop-word-only tidak menjadi query yang tidak berguna. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-textsearch.html))

---

## 7. `ts_rank` vs `ts_rank_cd`

PostgreSQL menyediakan dua ranking function utama:

| Function | Karakter | Cocok untuk |
|---|---|---|
| `ts_rank()` | Menghitung seberapa baik `tsvector` match dengan `tsquery` | General relevance |
| `ts_rank_cd()` | Cover-density ranking; mempertimbangkan proximity/kerapatan match | Search dokumen natural language |

`ts_rank_cd()` memakai cover-density algorithm, sehingga biasanya lebih cocok untuk search dokumen karena term yang berdekatan cenderung lebih relevan daripada term yang tersebar jauh. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-textsearch.html))

Contoh membandingkan dua ranking:

```sql id="pgws2g"
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    c.id,
    c.case_no,
    c.title,
    ts_rank(c.search_vector, q.query) AS rank_plain,
    ts_rank_cd(c.search_vector, q.query) AS rank_cover_density
FROM enforcement_cases c
CROSS JOIN q
WHERE c.tenant_id = :tenantId
  AND c.search_vector @@ q.query
ORDER BY rank_cover_density DESC
LIMIT 20;
```

Practical recommendation:

```text id="uy1cmr"
Mulai dari ts_rank_cd untuk document search.
Gunakan ts_rank jika hasil ts_rank_cd tidak sesuai ekspektasi domain.
Validasi dengan query nyata, bukan teori saja.
```

---

## 8. Weighting strategy

Bobot default PostgreSQL memakai label `A`, `B`, `C`, `D`. Strateginya adalah: semakin kuat sinyal field, semakin tinggi bobotnya.

| Weight | Field contoh | Reason |
|---|---|---|
| `A` | `case_no`, `title`, `subject_name` | Strong identity signal |
| `B` | `allegation`, `summary`, `keywords` | Strong descriptive signal |
| `C` | `investigation_summary`, `decision_summary`, body | Broad recall |
| `D` | comments, long attachment text | Lowest precision / noisy |

Contoh custom ranking weight:

```sql id="xuhjlp"
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    c.id,
    c.case_no,
    c.title,
    ts_rank_cd(
        ARRAY[0.05, 0.2, 0.6, 1.0]::real[],
        c.search_vector,
        q.query
    ) AS lexical_score
FROM enforcement_cases c
CROSS JOIN q
WHERE c.tenant_id = :tenantId
  AND c.search_vector @@ q.query
ORDER BY lexical_score DESC
LIMIT 20;
```

Urutan array weight PostgreSQL untuk ranking adalah `{D, C, B, A}`. Jadi contoh di atas berarti:

```text id="5hv1yh"
D = 0.05
C = 0.20
B = 0.60
A = 1.00
```

---

## 9. Ranking dengan business boost

FTS score murni sering belum cukup. Dalam sistem enterprise, ranking biasanya perlu tambahan faktor bisnis:

| Faktor | Contoh |
|---|---|
| Lexical relevance | `ts_rank_cd()` |
| Freshness | case terbaru lebih tinggi |
| Status priority | `OPEN` > `CLOSED` |
| Entity importance | high-risk regulated entity |
| User permission | hanya authorized result |
| Exact identifier match | `case_no = query` menang mutlak |

Contoh ranking gabungan:

```sql id="91ayqb"
WITH q AS (
    SELECT
        :query::text AS raw_query,
        websearch_to_tsquery('english', :query) AS ts_query
)
SELECT
    c.id,
    c.case_no,
    c.subject_name,
    c.title,
    c.status,

    ts_rank_cd(c.search_vector, q.ts_query) AS lexical_score,

    CASE
        WHEN c.case_no = q.raw_query THEN 100.0
        WHEN c.case_no ILIKE q.raw_query || '%' THEN 25.0
        ELSE 0.0
    END AS identifier_boost,

    CASE
        WHEN c.status = 'OPEN' THEN 2.0
        WHEN c.status = 'UNDER_REVIEW' THEN 1.0
        ELSE 0.0
    END AS status_boost,

    (
        ts_rank_cd(c.search_vector, q.ts_query)
        + CASE
            WHEN c.case_no = q.raw_query THEN 100.0
            WHEN c.case_no ILIKE q.raw_query || '%' THEN 25.0
            ELSE 0.0
          END
        + CASE
            WHEN c.status = 'OPEN' THEN 2.0
            WHEN c.status = 'UNDER_REVIEW' THEN 1.0
            ELSE 0.0
          END
    ) AS final_score

FROM enforcement_cases c
CROSS JOIN q
WHERE numnode(q.ts_query) > 0
  AND c.tenant_id = :tenantId
  AND c.visibility IN ('INTERNAL', 'PUBLIC')
  AND (
        c.search_vector @@ q.ts_query
        OR c.case_no = q.raw_query
        OR c.case_no ILIKE q.raw_query || '%'
  )
ORDER BY final_score DESC, c.updated_at DESC
LIMIT :limit
OFFSET :offset;
```

Practical invariant:

```text id="dhbxj3"
Exact identifier match should beat fuzzy relevance.
```

Kalau user mengetik `CASE-2026-0001`, hasil case tersebut harus menang, meskipun dokumen lain punya body yang lebih panjang dan score lexical lebih tinggi.

---

## 10. Highlighting dengan `ts_headline`

Search result yang baik perlu menjawab: **kenapa hasil ini muncul?**

```sql id="j0u4id"
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    c.id,
    c.case_no,
    c.title,
    ts_headline(
        'english',
        concat_ws(
            ' ',
            c.allegation,
            c.investigation_summary,
            c.decision_summary
        ),
        q.query,
        'StartSel=<mark>, StopSel=</mark>, MaxWords=40, MinWords=10, ShortWord=3'
    ) AS snippet,
    ts_rank_cd(c.search_vector, q.query) AS score
FROM enforcement_cases c
CROSS JOIN q
WHERE c.tenant_id = :tenantId
  AND c.search_vector @@ q.query
ORDER BY score DESC
LIMIT :limit;
```

`ts_headline()` menampilkan match dalam bentuk ringkasan dari raw document text, bukan dari `tsvector`. PostgreSQL menyediakan varian untuk `text`, `json`, dan `jsonb`, serta opsi formatting untuk hasil highlight. ([PostgreSQL](https://www.postgresql.org/docs/current/functions-textsearch.html))

Important security note:

```text id="z70q68"
Snippet/highlight tetap harus disanitasi sebelum dirender di UI.
```

Jangan menganggap `<mark>` aman hanya karena dibuat dari SQL. Raw content dokumen tetap bisa mengandung HTML/script-like text.

---

## 11. Highlight pattern yang lebih aman untuk API

Daripada membuat HTML final di database, salah satu pola lebih aman adalah memakai marker netral, lalu UI melakukan rendering aman.

```sql id="a3wp3w"
ts_headline(
    'english',
    concat_ws(' ', c.allegation, c.investigation_summary, c.decision_summary),
    q.query,
    'StartSel=<<<HL>>>, StopSel=<<<ENDHL>>>, MaxWords=40, MinWords=10'
) AS snippet
```

Lalu di Java/UI:

```java id="ulevee"
public record SearchSnippet(
    String rawSnippetWithMarkers
) {
    public String toSafeHtml() {
        // 1. HTML escape entire raw snippet
        // 2. Replace escaped marker text with safe <mark>
        // 3. Never trust original body as HTML
        return HtmlEscaper.escape(rawSnippetWithMarkers)
            .replace("&lt;&lt;&lt;HL&gt;&gt;&gt;", "<mark>")
            .replace("&lt;&lt;&lt;ENDHL&gt;&gt;&gt;", "</mark>");
    }
}
```

Atau lebih baik, return plain text + ranges bila tim frontend butuh kontrol penuh.

---

## 12. Pagination: OFFSET vs keyset

### OFFSET pagination

```sql id="c0mae9"
ORDER BY score DESC, c.updated_at DESC
LIMIT :limit
OFFSET :offset;
```

Kelebihan:

| Kelebihan | Kekurangan |
|---|---|
| Simple | Makin lambat untuk page dalam |
| Mudah diintegrasikan | Bisa tidak stabil jika data berubah |
| Cocok untuk awal | Tidak ideal untuk infinite scroll |

### Keyset pagination untuk search

Karena ranking score bisa sama, butuh tie-breaker stabil:

```sql id="1ughna"
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
),
ranked AS (
    SELECT
        c.id,
        c.case_no,
        c.title,
        c.updated_at,
        ts_rank_cd(c.search_vector, q.query) AS score
    FROM enforcement_cases c
    CROSS JOIN q
    WHERE c.tenant_id = :tenantId
      AND c.search_vector @@ q.query
)
SELECT *
FROM ranked
WHERE
    (
        :afterScore IS NULL
        OR (score, updated_at, id) < (:afterScore, :afterUpdatedAt, :afterId)
    )
ORDER BY score DESC, updated_at DESC, id DESC
LIMIT :limit;
```

Practical note:

```text id="wjy2m4"
Keyset pagination lebih stabil, tapi API contract lebih kompleks.
OFFSET cukup untuk page awal; keyset lebih baik untuk infinite scroll atau dataset besar.
```

---

## 13. Explainability: tampilkan kenapa hasil muncul

Untuk internal/admin search, sering berguna menampilkan metadata score:

```sql id="5npy6c"
WITH q AS (
    SELECT websearch_to_tsquery('english', :query) AS query
)
SELECT
    c.id,
    c.case_no,
    c.title,

    ts_rank_cd(c.search_vector, q.query) AS score_all,

    ts_rank_cd(
        to_tsvector('english', coalesce(c.title, '')),
        q.query
    ) AS score_title,

    ts_rank_cd(
        to_tsvector('english', coalesce(c.allegation, '')),
        q.query
    ) AS score_allegation,

    ts_rank_cd(
        to_tsvector('english', coalesce(c.investigation_summary, '')),
        q.query
    ) AS score_investigation

FROM enforcement_cases c
CROSS JOIN q
WHERE c.tenant_id = :tenantId
  AND c.search_vector @@ q.query
ORDER BY score_all DESC
LIMIT 20;
```

Jangan aktifkan explainability lengkap untuk endpoint publik tanpa kebutuhan, karena computation tambahan bisa mahal. Gunakan untuk debug, admin, atau observability sampling.

---

## 14. GIN operational tuning

### 14.1 `fastupdate`

Default GIN memakai pending list untuk mempercepat write. Ini bagus untuk write-heavy workload, tetapi pending list besar bisa memperlambat query search. PostgreSQL menjelaskan bahwa jika consistent response time lebih penting daripada update speed, pending entries bisa dinonaktifkan dengan `fastupdate = off`. ([PostgreSQL](https://www.postgresql.org/docs/current/gin.html))

```sql id="sbln4r"
ALTER INDEX idx_enforcement_cases_search_vector
SET (fastupdate = off);
```

Kapan dipertimbangkan?

| Kondisi | `fastupdate` |
|---|---|
| Write-heavy, search latency masih aman | Keep on |
| Search latency harus sangat stabil | Consider off |
| Bulk load besar | Drop/recreate index atau tune build |
| Pending list sering besar | Tune autovacuum / pending limit |

---

### 14.2 `gin_pending_list_limit`

```sql id="04s5ik"
ALTER INDEX idx_enforcement_cases_search_vector
SET (gin_pending_list_limit = '64MB');
```

Trade-off:

| Lebih besar | Lebih kecil |
|---|---|
| Write lebih sering ringan | Cleanup lebih sering |
| Foreground cleanup bisa lebih mahal | Search latency lebih stabil |
| Pending scan bisa membesar | Lebih banyak maintenance overhead |

PostgreSQL menyebut build time GIN sensitif terhadap `maintenance_work_mem`; untuk bulk insert besar, membuat index setelah load sering lebih baik. ([PostgreSQL](https://www.postgresql.org/docs/current/gin.html))

---

## 15. Bulk load pattern

Untuk import jutaan dokumen:

```text id="7qy8ry"
1. Load data ke table tanpa GIN index
2. Populate/generated search_vector
3. CREATE INDEX setelah data masuk
4. ANALYZE table
5. Enable API search
```

Contoh:

```sql id="dksda6"
-- setelah bulk load selesai
CREATE INDEX CONCURRENTLY idx_enforcement_cases_search_vector
ON enforcement_cases
USING GIN (search_vector);

ANALYZE enforcement_cases;
```

Kalau maintenance window tersedia dan table belum dipakai production traffic:

```sql id="l20r5v"
CREATE INDEX idx_enforcement_cases_search_vector
ON enforcement_cases
USING GIN (search_vector);
```

`CONCURRENTLY` mengurangi blocking terhadap write/read production, tetapi biasanya lebih lambat dan tidak boleh dijalankan dalam transaction block biasa.

---

## 16. Query anti-patterns

| Anti-pattern | Masalah | Ganti dengan |
|---|---|---|
| `to_tsvector(...) @@ query` tanpa index | Hitung ulang per row | Generated column + GIN |
| Search tanpa `tenant_id` | Data leak risk | Mandatory tenant filter |
| `ORDER BY created_at` saja | Result tidak relevan | `ORDER BY score DESC, created_at DESC` |
| `OFFSET` sangat dalam | Lambat | Keyset pagination |
| `ts_headline()` untuk semua candidate sebelum filter | Mahal | Filter + limit candidate dulu |
| Exact ID search dicampur tanpa boost | ID exact kalah oleh body panjang | Identifier boost |
| Semua text field weight sama | Title tenggelam | `setweight()` |
| Tidak ada guard stop-word query | Query tidak bermakna | `numnode(q.query) > 0` |
| `to_tsquery()` dari raw user input | Syntax error / poor UX | `websearch_to_tsquery()` |

---

## 17. Production query template

Ini template yang cukup aman untuk endpoint search umum:

```sql id="0gtyg4"
WITH q AS (
    SELECT
        :query::text AS raw_query,
        websearch_to_tsquery('english', :query) AS ts_query
),
matched AS (
    SELECT
        c.id,
        c.case_no,
        c.subject_name,
        c.title,
        c.status,
        c.updated_at,

        ts_rank_cd(
            ARRAY[0.05, 0.2, 0.6, 1.0]::real[],
            c.search_vector,
            q.ts_query
        ) AS lexical_score,

        CASE
            WHEN c.case_no = q.raw_query THEN 100.0
            WHEN c.case_no ILIKE q.raw_query || '%' THEN 25.0
            ELSE 0.0
        END AS identifier_boost,

        CASE
            WHEN c.status = 'OPEN' THEN 2.0
            WHEN c.status = 'UNDER_REVIEW' THEN 1.0
            ELSE 0.0
        END AS status_boost,

        ts_headline(
            'english',
            concat_ws(
                ' ',
                c.allegation,
                c.investigation_summary,
                c.decision_summary
            ),
            q.ts_query,
            'StartSel=<<<HL>>>, StopSel=<<<ENDHL>>>, MaxWords=40, MinWords=10'
        ) AS snippet

    FROM enforcement_cases c
    CROSS JOIN q
    WHERE numnode(q.ts_query) > 0
      AND c.tenant_id = :tenantId
      AND c.visibility IN ('INTERNAL', 'PUBLIC')
      AND c.status = ANY(:statuses)
      AND (
            c.search_vector @@ q.ts_query
            OR c.case_no = q.raw_query
            OR c.case_no ILIKE q.raw_query || '%'
      )
)
SELECT
    id,
    case_no,
    subject_name,
    title,
    status,
    snippet,
    lexical_score,
    identifier_boost,
    status_boost,
    lexical_score + identifier_boost + status_boost AS final_score
FROM matched
ORDER BY final_score DESC, updated_at DESC, id DESC
LIMIT :limit
OFFSET :offset;
```

---

## 18. MyBatis mapper production-style

```xml id="mvluf8"
<resultMap id="EnforcementCaseSearchResultMap"
           type="com.example.search.EnforcementCaseSearchResult">
    <id property="id" column="id"/>
    <result property="caseNo" column="case_no"/>
    <result property="subjectName" column="subject_name"/>
    <result property="title" column="title"/>
    <result property="status" column="status"/>
    <result property="snippet" column="snippet"/>
    <result property="lexicalScore" column="lexical_score"/>
    <result property="identifierBoost" column="identifier_boost"/>
    <result property="statusBoost" column="status_boost"/>
    <result property="finalScore" column="final_score"/>
</resultMap>

<select id="searchCases" resultMap="EnforcementCaseSearchResultMap">
    WITH q AS (
        SELECT
            #{query}::text AS raw_query,
            websearch_to_tsquery('english', #{query}) AS ts_query
    ),
    matched AS (
        SELECT
            c.id,
            c.case_no,
            c.subject_name,
            c.title,
            c.status,
            c.updated_at,

            ts_rank_cd(
                ARRAY[0.05, 0.2, 0.6, 1.0]::real[],
                c.search_vector,
                q.ts_query
            ) AS lexical_score,

            CASE
                WHEN c.case_no = q.raw_query THEN 100.0
                WHEN c.case_no ILIKE q.raw_query || '%' THEN 25.0
                ELSE 0.0
            END AS identifier_boost,

            CASE
                WHEN c.status = 'OPEN' THEN 2.0
                WHEN c.status = 'UNDER_REVIEW' THEN 1.0
                ELSE 0.0
            END AS status_boost,

            ts_headline(
                'english',
                concat_ws(
                    ' ',
                    c.allegation,
                    c.investigation_summary,
                    c.decision_summary
                ),
                q.ts_query,
                'StartSel=&lt;&lt;&lt;HL&gt;&gt;&gt;, StopSel=&lt;&lt;&lt;ENDHL&gt;&gt;&gt;, MaxWords=40, MinWords=10'
            ) AS snippet

        FROM enforcement_cases c
        CROSS JOIN q
        WHERE numnode(q.ts_query) &gt; 0
          AND c.tenant_id = #{tenantId}
          AND c.visibility IN ('INTERNAL', 'PUBLIC')

          <if test="statuses != null and statuses.size() > 0">
            AND c.status IN
            <foreach collection="statuses"
                     item="status"
                     open="("
                     separator=","
                     close=")">
                #{status}
            </foreach>
          </if>

          AND (
                c.search_vector @@ q.ts_query
                OR c.case_no = q.raw_query
                OR c.case_no ILIKE q.raw_query || '%'
          )
    )
    SELECT
        id,
        case_no,
        subject_name,
        title,
        status,
        snippet,
        lexical_score,
        identifier_boost,
        status_boost,
        lexical_score + identifier_boost + status_boost AS final_score
    FROM matched
    ORDER BY final_score DESC, updated_at DESC, id DESC
    LIMIT #{limit}
    OFFSET #{offset}
</select>
```

DTO:

```java id="j2jub6"
package com.example.search;

public record EnforcementCaseSearchResult(
    long id,
    String caseNo,
    String subjectName,
    String title,
    String status,
    String snippet,
    double lexicalScore,
    double identifierBoost,
    double statusBoost,
    double finalScore
) {}
```

Mapper interface:

```java id="khyetm"
package com.example.search;

import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface EnforcementCaseSearchMapper {

    List<EnforcementCaseSearchResult> searchCases(
        @Param("tenantId") long tenantId,
        @Param("query") String query,
        @Param("statuses") List<String> statuses,
        @Param("limit") int limit,
        @Param("offset") int offset
    );
}
```

---

## 19. Service-layer guard

```java id="p5vni1"
package com.example.search;

import java.util.List;
import java.util.Set;

public class EnforcementCaseSearchService {

    private static final int DEFAULT_LIMIT = 20;
    private static final int MAX_LIMIT = 50;

    private static final Set<String> ALLOWED_STATUSES = Set.of(
        "OPEN",
        "UNDER_REVIEW",
        "DECIDED",
        "CLOSED"
    );

    private final EnforcementCaseSearchMapper mapper;

    public EnforcementCaseSearchService(EnforcementCaseSearchMapper mapper) {
        this.mapper = mapper;
    }

    public List<EnforcementCaseSearchResult> search(
        long tenantId,
        String rawQuery,
        List<String> requestedStatuses,
        Integer requestedLimit,
        Integer requestedOffset
    ) {
        String query = normalizeQuery(rawQuery);
        if (query.isBlank()) {
            return List.of();
        }

        List<String> statuses = sanitizeStatuses(requestedStatuses);
        int limit = sanitizeLimit(requestedLimit);
        int offset = Math.max(requestedOffset == null ? 0 : requestedOffset, 0);

        return mapper.searchCases(
            tenantId,
            query,
            statuses,
            limit,
            offset
        );
    }

    private String normalizeQuery(String raw) {
        if (raw == null) {
            return "";
        }
        return raw.trim().replaceAll("\\s+", " ");
    }

    private List<String> sanitizeStatuses(List<String> statuses) {
        if (statuses == null || statuses.isEmpty()) {
            return List.of("OPEN", "UNDER_REVIEW", "DECIDED");
        }

        return statuses.stream()
            .filter(ALLOWED_STATUSES::contains)
            .distinct()
            .toList();
    }

    private int sanitizeLimit(Integer requestedLimit) {
        if (requestedLimit == null) {
            return DEFAULT_LIMIT;
        }
        return Math.min(Math.max(requestedLimit, 1), MAX_LIMIT);
    }
}
```

---

## 20. EXPLAIN checklist

Gunakan:

```sql id="ndmw5x"
EXPLAIN (ANALYZE, BUFFERS)
WITH q AS (
    SELECT websearch_to_tsquery('english', 'late reporting compliance') AS query
)
SELECT
    c.id,
    c.case_no,
    c.title,
    ts_rank_cd(c.search_vector, q.query) AS score
FROM enforcement_cases c
CROSS JOIN q
WHERE c.tenant_id = 1001
  AND c.status IN ('OPEN', 'UNDER_REVIEW')
  AND c.search_vector @@ q.query
ORDER BY score DESC
LIMIT 20;
```

Yang dicari:

| Hal | Interpretasi |
|---|---|
| Ada `Bitmap Index Scan` pada GIN index | Bagus |
| Banyak `Rows Removed by Filter` | Filter tenant/status mungkin perlu index tambahan |
| Sort mahal | Ranking result terlalu banyak sebelum limit |
| Buffers read tinggi | Working set besar / cache miss |
| Planning memilih seq scan | Statistik, selectivity, atau query terlalu broad |
| Query broad menghasilkan ribuan candidate | Perlu guard, filter, atau limit strategi |

---

## 21. Observability metrics

Search production minimal harus punya metrik:

| Metric | Kenapa penting |
|---|---|
| `search.request.count` | Volume search |
| `search.latency.p50/p95/p99` | UX dan SLO |
| `search.result.count` | Deteksi query terlalu broad/sempit |
| `search.zero_result.rate` | Kualitas search |
| `search.query.length` | Deteksi abuse/noise |
| `search.top_query` | Tuning synonym/dictionary |
| `search.timeout.count` | Stabilitas |
| `search.index.size` | Capacity |
| `search.slow_query.sample` | Debug query nyata |

Log structured minimal:

```json id="n7cmbx"
{
  "event": "case_search",
  "tenantId": 1001,
  "queryLength": 26,
  "statusCount": 2,
  "limit": 20,
  "offset": 0,
  "resultCount": 17,
  "durationMs": 43,
  "usedMode": "fts",
  "requestId": "req-123"
}
```

Jangan log raw query jika mengandung data sensitif, atau minimal mask/anonymize sesuai kebijakan compliance.

---

## 22. Practical tuning playbook

| Symptom | Kemungkinan penyebab | Action |
|---|---|---|
| Search lambat saat write tinggi | GIN pending list besar | Tune autovacuum, `gin_pending_list_limit`, cek `fastupdate` |
| Search lambat untuk query umum | Candidate terlalu banyak | Tambah filter, query guard, limit, stop-word handling |
| Ranking terasa buruk | Weight salah | Naikkan bobot title/identifier |
| Exact code tidak muncul paling atas | FTS bukan exact lookup | Tambah identifier boost |
| Highlight mahal | `ts_headline()` dipanggil terlalu banyak | Generate snippet setelah candidate dibatasi |
| Page 10+ lambat | `OFFSET` dalam | Pindah ke keyset pagination |
| Index tidak dipakai | Expression mismatch/statistik/query broad | Pakai generated column, `ANALYZE`, cek query |
| Write melambat setelah index | GIN write overhead | Batch write, tune pending list, review index count |

---

## 23. Mini exercise

Buat endpoint search untuk `regulatory_documents`.

### Table

```sql id="upnyt6"
CREATE TABLE regulatory_documents (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       BIGINT NOT NULL,
    doc_no          TEXT NOT NULL,
    title           TEXT NOT NULL,
    abstract        TEXT,
    content         TEXT,
    document_type   TEXT NOT NULL,
    status          TEXT NOT NULL,
    effective_date  DATE,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Search vector

```sql id="qrb40y"
ALTER TABLE regulatory_documents
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(doc_no, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(abstract, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
) STORED;
```

### Index

```sql id="zgg7n6"
CREATE INDEX CONCURRENTLY idx_regulatory_documents_search_vector
ON regulatory_documents
USING GIN (search_vector);

CREATE INDEX CONCURRENTLY idx_regulatory_documents_tenant_status_type
ON regulatory_documents (
    tenant_id,
    status,
    document_type,
    updated_at DESC
);
```

### Search query

```sql id="vgej7e"
WITH q AS (
    SELECT
        :query::text AS raw_query,
        websearch_to_tsquery('english', :query) AS ts_query
)
SELECT
    d.id,
    d.doc_no,
    d.title,
    d.document_type,
    d.status,
    ts_rank_cd(d.search_vector, q.ts_query) AS lexical_score,
    CASE
        WHEN d.doc_no = q.raw_query THEN 100.0
        WHEN d.doc_no ILIKE q.raw_query || '%' THEN 25.0
        ELSE 0.0
    END AS identifier_boost,
    ts_headline(
        'english',
        concat_ws(' ', d.abstract, d.content),
        q.ts_query,
        'StartSel=<<<HL>>>, StopSel=<<<ENDHL>>>, MaxWords=35, MinWords=8'
    ) AS snippet
FROM regulatory_documents d
CROSS JOIN q
WHERE numnode(q.ts_query) > 0
  AND d.tenant_id = :tenantId
  AND d.status = 'PUBLISHED'
  AND d.document_type = ANY(:documentTypes)
  AND (
        d.search_vector @@ q.ts_query
        OR d.doc_no = q.raw_query
        OR d.doc_no ILIKE q.raw_query || '%'
  )
ORDER BY
    lexical_score + identifier_boost DESC,
    d.effective_date DESC NULLS LAST,
    d.id DESC
LIMIT :limit
OFFSET :offset;
```

---

## 24. Checklist Seri 3

| Checklist | Target |
|---|---|
| GIN index dibuat untuk `search_vector` | Ya |
| Helper B-tree index dibuat untuk tenant/status/date | Ya |
| `setweight()` dipakai untuk field penting | Ya |
| `ts_rank_cd()` dipakai sebagai baseline ranking | Ya |
| Exact identifier boost tersedia | Ya |
| `ts_headline()` hanya dipakai untuk result yang sudah match | Ya |
| Query kosong/stop-word-only ditangani | Ya |
| Pagination punya tie-breaker stabil | Ya |
| `EXPLAIN (ANALYZE, BUFFERS)` dijalankan | Ya |
| GIN pending list/autovacuum dipantau | Ya |
| Search metrics/logging disiapkan | Ya |

---

## Seri 3 selesai

Seri berikutnya:

**Seri 4/10 - Fuzzy Search dengan `pg_trgm`, Similarity, Typo Search, dan Autocomplete**

Fokusnya: pencarian nama orang/perusahaan, typo tolerance, partial matching, `LIKE/ILIKE` acceleration, trigram GIN/GiST index, search-as-you-type, dan kapan fuzzy search digabung dengan FTS.

---

**Sources:**

- [PostgreSQL: Documentation: 18: 12.3. Controlling Text Search](https://www.postgresql.org/docs/current/textsearch-controls.html)

## Response:
7/15/2026, 8:07:43 PM

Saya lanjut ke seri 4/10. Fokusnya bukan mengganti FTS, tetapi menutup gap FTS: typo, nama orang/perusahaan, partial match, dan autocomplete/search-as-you-type.

# Seri 4/10 - Fuzzy Search dengan `pg_trgm`, Similarity, Typo Search, dan Autocomplete

Seri ini fokus pada gap yang tidak diselesaikan dengan baik oleh Full Text Search murni: **typo tolerance**, **nama orang/perusahaan**, **partial match**, **search-as-you-type**, dan fallback ketika user tidak mengetik kata lengkap.

FTS bagus untuk lexical document search seperti `late reporting compliance`, tetapi kurang ideal untuk kasus seperti:

```text id="0kyy2n"
"muhamad" vs "muhammad"
"pt nusantara regulasi" vs "nusantara regulatory"
"jon smit" vs "john smith"
"lic suspen" vs "license suspension"
"CASE-2026-00" prefix lookup
```

Untuk kebutuhan seperti ini, PostgreSQL menyediakan extension **`pg_trgm`**, yaitu modul trigram similarity untuk text search berbasis kemiripan string. Modul ini menyediakan fungsi/operator similarity dan operator class GIN/GiST untuk mempercepat similarity search, `LIKE`, `ILIKE`, regex, dan equality query pada kolom text. ([PostgreSQL](https://www.postgresql.org/docs/current/pgtrgm.html?utm_source=chatgpt.com))

---

## 1. Core idea

`pg_trgm` memecah string menjadi potongan 3-karakter atau **trigram**. Dua string dianggap mirip jika mereka berbagi cukup banyak trigram.

Contoh intuitif:

```text id="vgji8w"
"compliance"
→ "com", "omp", "mpl", "pli", "lia", "ian", "anc", "nce"

"complaince" typo
→ masih punya banyak trigram yang overlap
```

Jadi `pg_trgm` cocok untuk:

| Use case | Cocok dengan `pg_trgm`? | Catatan |
|---|---:|---|
| Typo search | Ya | Nama, title pendek, company name |
| Partial name search | Ya | Terutama dengan `ILIKE` dan trigram index |
| Search-as-you-type | Ya, dengan guard minimum length | Jangan query terlalu pendek |
| Similar company/person name | Ya | Perlu threshold tuning |
| Exact identifier lookup | Kadang | B-tree tetap lebih baik untuk exact |
| Long document relevance | Tidak utama | FTS lebih cocok |
| Semantic meaning | Tidak | Vector search lebih cocok |

Practical rule:

```text id="fh8n7s"
FTS = lexical document relevance.
pg_trgm = fuzzy string similarity.
Vector = semantic similarity.
```

Jangan pakai satu teknologi untuk semua jenis search.

---

## 2. Mental model

```text id="5zr20z"
User query
│
├── Looks like exact ID?
│   └── B-tree equality / prefix lookup
│
├── Looks like document keywords?
│   └── Full Text Search
│
├── Looks like typo/name/partial text?
│   └── pg_trgm similarity / ILIKE
│
└── Looks like intent/meaning?
    └── Vector search

Production search
│
├── exact match boost
├── FTS lexical result
├── trigram fuzzy fallback
├── optional vector semantic result
└── merged/ranked API response
```

---

## 3. Enable `pg_trgm`

```sql id="xec67o"
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

Biasanya extension ini dibuat lewat migration tool seperti Flyway/Liquibase:

```sql id="5xzhbg"
-- V20260715_001__enable_pg_trgm.sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

Di environment managed database, pastikan extension ini allowed oleh platform yang dipakai. Untuk on-prem PostgreSQL, extension contrib biasanya tersedia, tetapi tetap perlu diverifikasi di image/package PostgreSQL yang dipakai.

---

## 4. Fungsi dasar `pg_trgm`

### 4.1 `similarity(text, text)`

```sql id="hqtols"
SELECT similarity('muhammad', 'muhamad') AS score;
```

Semakin tinggi score, semakin mirip. `pg_trgm` menyediakan fungsi `similarity`, `word_similarity`, dan `strict_word_similarity`, serta operator yang memakai threshold untuk menentukan apakah dua string “cukup mirip”. ([PostgreSQL](https://www.postgresql.org/docs/current/pgtrgm.html?utm_source=chatgpt.com))

---

### 4.2 Operator `%`

Operator `%` bernilai true jika similarity dua string melewati threshold `pg_trgm.similarity_threshold`.

```sql id="t51ku1"
SELECT 'muhammad' % 'muhamad' AS is_similar;
```

Threshold default dapat diatur di session:

```sql id="o01kgi"
SET pg_trgm.similarity_threshold = 0.3;
```

Practical use:

```sql id="axau1m"
SELECT
    id,
    subject_name,
    similarity(subject_name, :query) AS sim_score
FROM enforcement_cases
WHERE subject_name % :query
ORDER BY sim_score DESC
LIMIT 20;
```

---

### 4.3 Distance operator `<->`

`<->` merepresentasikan distance berbasis trigram; semakin kecil nilainya, semakin mirip.

```sql id="oa8of1"
SELECT
    id,
    subject_name,
    subject_name <-> :query AS distance
FROM enforcement_cases
ORDER BY subject_name <-> :query
LIMIT 20;
```

Practical difference:

| Approach | Meaning |
|---|---|
| `similarity(a, b) DESC` | Makin besar makin mirip |
| `a <-> b ASC` | Makin kecil makin mirip |
| `a % b` | Boolean filter berdasarkan threshold |

---

## 5. Schema contoh: party/entity search

Fuzzy search paling sering dipakai untuk nama subjek, perusahaan, complainant, license holder, atau regulated entity.

```sql id="in2ec1"
CREATE TABLE regulated_entities (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       BIGINT NOT NULL,
    entity_no       TEXT NOT NULL,
    legal_name      TEXT NOT NULL,
    trading_name    TEXT,
    registration_no TEXT,
    status          TEXT NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Tambahkan normalized search field agar fuzzy search lebih stabil:

```sql id="88eql2"
ALTER TABLE regulated_entities
ADD COLUMN normalized_name TEXT
GENERATED ALWAYS AS (
    lower(
        regexp_replace(
            coalesce(legal_name, '') || ' ' || coalesce(trading_name, ''),
            '\s+',
            ' ',
            'g'
        )
    )
) STORED;
```

Kenapa normalized field?

| Reason | Dampak |
|---|---|
| Case-insensitive | `PT Nusantara` dan `pt nusantara` konsisten |
| Gabung legal + trading name | Search user lebih fleksibel |
| Hilangkan whitespace berlebih | Similarity lebih stabil |
| Bisa di-index | Query lebih cepat |

---

## 6. Index untuk `pg_trgm`

`pg_trgm` menyediakan operator class **GIN** dan **GiST** untuk text column. Keduanya dapat mempercepat similarity search dan pattern matching tertentu seperti `LIKE`/`ILIKE`. ([PostgreSQL](https://www.postgresql.org/docs/current/pgtrgm.html?utm_source=chatgpt.com))

### 6.1 GIN trigram index

```sql id="87aiv1"
CREATE INDEX CONCURRENTLY idx_regulated_entities_normalized_name_trgm
ON regulated_entities
USING GIN (normalized_name gin_trgm_ops);
```

Practical default:

```text id="z19o92"
Mulai dari GIN + gin_trgm_ops untuk fuzzy lookup umum.
```

---

### 6.2 GiST trigram index

```sql id="l9t973"
CREATE INDEX CONCURRENTLY idx_regulated_entities_normalized_name_gist_trgm
ON regulated_entities
USING GiST (normalized_name gist_trgm_ops);
```

GiST trigram index mendukung signature length parameter `siglen`; signature lebih panjang dapat membuat search lebih presisi dengan biaya index lebih besar. ([PostgreSQL](https://www.postgresql.org/docs/current/pgtrgm.html?utm_source=chatgpt.com))

Contoh:

```sql id="r9qh8s"
CREATE INDEX CONCURRENTLY idx_regulated_entities_name_gist_trgm_siglen
ON regulated_entities
USING GiST (normalized_name gist_trgm_ops(siglen=32));
```

---

## 7. GIN vs GiST untuk trigram

| Aspek | GIN trigram | GiST trigram |
|---|---:|---:|
| Default umum | Ya | Tidak selalu |
| Cocok untuk | Similarity lookup, `ILIKE`, broad fuzzy search | KNN-style distance ordering, special tuning |
| Index size | Bisa lebih besar | Bisa lebih compact tergantung `siglen` |
| Query `LIKE/ILIKE` | Didukung | Didukung |
| Similarity operator `%` | Didukung | Didukung |
| Distance ordering `<->` | Tergantung planner/use case | Sering relevan untuk nearest-neighbor style |
| Practical start | **Pakai GIN dulu** | Pakai jika hasil benchmark lebih baik |

Production rule:

```text id="l5s049"
Jangan pilih GiST/GIN karena preferensi teoretis.
Bandingkan dengan EXPLAIN ANALYZE pada query nyata.
```

---

## 8. Fuzzy search query pattern

### 8.1 Basic fuzzy search

```sql id="e46rso"
SELECT
    id,
    entity_no,
    legal_name,
    trading_name,
    status,
    similarity(normalized_name, lower(:query)) AS similarity_score
FROM regulated_entities
WHERE tenant_id = :tenantId
  AND normalized_name % lower(:query)
ORDER BY similarity_score DESC, updated_at DESC
LIMIT :limit;
```

Cocok untuk:

```text id="kgss12"
User mengetik nama subjek/perusahaan dengan kemungkinan typo.
```

---

### 8.2 Fuzzy search dengan threshold session-local

```sql id="g8ag12"
BEGIN;

SET LOCAL pg_trgm.similarity_threshold = 0.25;

SELECT
    id,
    entity_no,
    legal_name,
    similarity(normalized_name, lower(:query)) AS score
FROM regulated_entities
WHERE tenant_id = :tenantId
  AND normalized_name % lower(:query)
ORDER BY score DESC
LIMIT :limit;

COMMIT;
```

Gunakan `SET LOCAL` di transaction agar threshold tidak bocor ke session lain, terutama jika aplikasi memakai connection pool.

Practical warning:

```text id="onv7o2"
Jangan SET threshold global dari aplikasi web request.
Gunakan SET LOCAL dalam transaction atau hindari threshold session dengan expression eksplisit.
```

---

### 8.3 Fuzzy search tanpa bergantung pada threshold operator

```sql id="5m56gd"
SELECT
    id,
    entity_no,
    legal_name,
    trading_name,
    similarity(normalized_name, lower(:query)) AS score
FROM regulated_entities
WHERE tenant_id = :tenantId
  AND similarity(normalized_name, lower(:query)) >= :minScore
ORDER BY score DESC, updated_at DESC
LIMIT :limit;
```

Ini lebih eksplisit, tetapi belum tentu memakai trigram index sebaik operator `%`. Untuk production, bandingkan dengan `EXPLAIN (ANALYZE, BUFFERS)`.

---

## 9. Partial match dan `ILIKE`

`pg_trgm` tidak hanya untuk similarity. Operator classes-nya juga bisa membantu query pattern matching seperti `LIKE`, `ILIKE`, dan regex pada kolom text. ([PostgreSQL](https://www.postgresql.org/docs/current/pgtrgm.html?utm_source=chatgpt.com))

Contoh:

```sql id="l9wo7r"
SELECT
    id,
    entity_no,
    legal_name
FROM regulated_entities
WHERE tenant_id = :tenantId
  AND normalized_name ILIKE '%' || lower(:query) || '%'
ORDER BY updated_at DESC
LIMIT :limit;
```

Dengan index:

```sql id="potlpn"
CREATE INDEX CONCURRENTLY idx_regulated_entities_normalized_name_trgm
ON regulated_entities
USING GIN (normalized_name gin_trgm_ops);
```

Pattern ini cocok untuk:

| Query user | Tujuan |
|---|---|
| `nusantara` | contains match |
| `regulasi` | nama perusahaan/alias |
| `smith` | nama belakang |
| `lic sus` | partial phrase |

Namun:

```text id="2p1l1x"
ILIKE '%x%' untuk query sangat pendek tetap bisa buruk.
```

Tambahkan minimum length guard di service layer.

---

## 10. Autocomplete / search-as-you-type

Autocomplete tidak sama dengan full search. Ia harus cepat, pendek, dan agresif dibatasi.

### 10.1 Prefix autocomplete untuk identifier

```sql id="mxq12u"
SELECT
    id,
    entity_no,
    legal_name
FROM regulated_entities
WHERE tenant_id = :tenantId
  AND entity_no ILIKE upper(:query) || '%'
ORDER BY entity_no
LIMIT 10;
```

Untuk identifier seperti `CASE-2026-`, B-tree/prefix strategy sering lebih baik daripada trigram.

---

### 10.2 Name autocomplete dengan trigram

```sql id="nfvnjp"
SELECT
    id,
    entity_no,
    legal_name,
    similarity(normalized_name, lower(:query)) AS score
FROM regulated_entities
WHERE tenant_id = :tenantId
  AND length(:query) >= 3
  AND (
        normalized_name ILIKE lower(:query) || '%'
        OR normalized_name ILIKE '% ' || lower(:query) || '%'
        OR normalized_name % lower(:query)
  )
ORDER BY
    CASE
        WHEN normalized_name ILIKE lower(:query) || '%' THEN 0
        WHEN normalized_name ILIKE '% ' || lower(:query) || '%' THEN 1
        ELSE 2
    END,
    score DESC,
    legal_name ASC
LIMIT 10;
```

Practical API rule:

```text id="z23pp2"
Autocomplete:
- minimum 2-3 characters
- limit kecil, misalnya 10
- debounce di frontend
- no OFFSET
- jangan generate highlight mahal
```

---

## 11. Gabungan exact + fuzzy + FTS

Untuk search enterprise, query sering perlu gabungan:

```text id="ys3ti3"
1. Exact identifier match
2. Prefix identifier match
3. FTS document match
4. Fuzzy name/title fallback
```

Contoh untuk enforcement cases:

```sql id="r8926q"
WITH q AS (
    SELECT
        :query::text AS raw_query,
        lower(:query) AS normalized_query,
        websearch_to_tsquery('english', :query) AS ts_query
),
candidate AS (
    SELECT
        c.id,
        c.case_no,
        c.subject_name,
        c.title,
        c.status,
        c.updated_at,

        CASE
            WHEN c.case_no = q.raw_query THEN 100.0
            WHEN c.case_no ILIKE q.raw_query || '%' THEN 50.0
            ELSE 0.0
        END AS identifier_score,

        CASE
            WHEN numnode(q.ts_query) > 0 AND c.search_vector @@ q.ts_query
            THEN ts_rank_cd(c.search_vector, q.ts_query)
            ELSE 0.0
        END AS fts_score,

        similarity(
            lower(coalesce(c.subject_name, '') || ' ' || coalesce(c.title, '')),
            q.normalized_query
        ) AS trigram_score

    FROM enforcement_cases c
    CROSS JOIN q
    WHERE c.tenant_id = :tenantId
      AND c.status = ANY(:statuses)
      AND (
            c.case_no = q.raw_query
            OR c.case_no ILIKE q.raw_query || '%'
            OR (
                numnode(q.ts_query) > 0
                AND c.search_vector @@ q.ts_query
            )
            OR lower(coalesce(c.subject_name, '') || ' ' || coalesce(c.title, '')) % q.normalized_query
      )
)
SELECT
    id,
    case_no,
    subject_name,
    title,
    status,
    identifier_score,
    fts_score,
    trigram_score,
    (
        identifier_score
        + fts_score
        + trigram_score
    ) AS final_score
FROM candidate
ORDER BY final_score DESC, updated_at DESC, id DESC
LIMIT :limit
OFFSET :offset;
```

Kelebihan:

| Komponen | Menangkap |
|---|---|
| Exact ID | `CASE-2026-0001` |
| Prefix ID | `CASE-2026` |
| FTS | `late reporting compliance` |
| Trigram | `muhamad`, `nusantaraa`, `licence suspnsion` |

---

## 12. Better pattern: pisahkan search mode

Daripada satu query super kompleks untuk semua kebutuhan, endpoint bisa menentukan mode:

```text id="2kdxx1"
q = "CASE-2026-0001"   → exact/prefix identifier mode
q = "john smit"        → fuzzy person/entity mode
q = "late reporting"   → FTS mode
q = "lic susp"         → autocomplete/fuzzy mode
```

Heuristic sederhana di Java:

```java id="28tobw"
public enum SearchMode {
    IDENTIFIER,
    AUTOCOMPLETE,
    FUZZY_NAME,
    FULL_TEXT
}
```

```java id="1nnxev"
public SearchMode detectMode(String rawQuery) {
    String q = normalize(rawQuery);

    if (q.matches("(?i)^(CASE|DOC|ENT)-\\d{4}.*")) {
        return SearchMode.IDENTIFIER;
    }

    if (q.length() < 4) {
        return SearchMode.AUTOCOMPLETE;
    }

    if (q.split("\\s+").length <= 3 && !q.matches(".*\\b(and|or|not)\\b.*")) {
        return SearchMode.FUZZY_NAME;
    }

    return SearchMode.FULL_TEXT;
}

private String normalize(String raw) {
    if (raw == null) {
        return "";
    }
    return raw.trim().replaceAll("\\s+", " ");
}
```

Practical reason:

```text id="ntti0g"
Search mode separation makes SQL simpler, safer, and easier to tune.
```

---

## 13. MyBatis mapper: fuzzy entity search

```xml id="dm8oxf"
<resultMap id="EntityFuzzySearchResultMap"
           type="com.example.search.EntityFuzzySearchResult">
    <id property="id" column="id"/>
    <result property="entityNo" column="entity_no"/>
    <result property="legalName" column="legal_name"/>
    <result property="tradingName" column="trading_name"/>
    <result property="status" column="status"/>
    <result property="similarityScore" column="similarity_score"/>
</resultMap>

<select id="searchEntitiesFuzzy" resultMap="EntityFuzzySearchResultMap">
    SELECT
        e.id,
        e.entity_no,
        e.legal_name,
        e.trading_name,
        e.status,
        similarity(e.normalized_name, lower(#{query})) AS similarity_score
    FROM regulated_entities e
    WHERE e.tenant_id = #{tenantId}
      AND length(#{query}) &gt;= 3
      AND e.status IN
      <foreach collection="statuses"
               item="status"
               open="("
               separator=","
               close=")">
          #{status}
      </foreach>
      AND e.normalized_name % lower(#{query})
    ORDER BY similarity_score DESC, e.updated_at DESC, e.id DESC
    LIMIT #{limit}
</select>
```

DTO:

```java id="743jmr"
package com.example.search;

public record EntityFuzzySearchResult(
    long id,
    String entityNo,
    String legalName,
    String tradingName,
    String status,
    double similarityScore
) {}
```

Mapper interface:

```java id="vm6h82"
package com.example.search;

import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface EntitySearchMapper {

    List<EntityFuzzySearchResult> searchEntitiesFuzzy(
        @Param("tenantId") long tenantId,
        @Param("query") String query,
        @Param("statuses") List<String> statuses,
        @Param("limit") int limit
    );
}
```

---

## 14. MyBatis mapper: autocomplete

```xml id="pvwql2"
<resultMap id="EntityAutocompleteResultMap"
           type="com.example.search.EntityAutocompleteResult">
    <id property="id" column="id"/>
    <result property="entityNo" column="entity_no"/>
    <result property="displayName" column="display_name"/>
    <result property="matchType" column="match_type"/>
    <result property="score" column="score"/>
</resultMap>

<select id="autocompleteEntities" resultMap="EntityAutocompleteResultMap">
    SELECT
        e.id,
        e.entity_no,
        coalesce(e.trading_name, e.legal_name) AS display_name,
        CASE
            WHEN e.entity_no ILIKE upper(#{query}) || '%' THEN 'ENTITY_NO_PREFIX'
            WHEN e.normalized_name ILIKE lower(#{query}) || '%' THEN 'NAME_PREFIX'
            WHEN e.normalized_name ILIKE '% ' || lower(#{query}) || '%' THEN 'WORD_PREFIX'
            ELSE 'FUZZY'
        END AS match_type,
        similarity(e.normalized_name, lower(#{query})) AS score
    FROM regulated_entities e
    WHERE e.tenant_id = #{tenantId}
      AND length(#{query}) &gt;= 3
      AND e.status = 'ACTIVE'
      AND (
            e.entity_no ILIKE upper(#{query}) || '%'
            OR e.normalized_name ILIKE lower(#{query}) || '%'
            OR e.normalized_name ILIKE '% ' || lower(#{query}) || '%'
            OR e.normalized_name % lower(#{query})
      )
    ORDER BY
        CASE
            WHEN e.entity_no ILIKE upper(#{query}) || '%' THEN 0
            WHEN e.normalized_name ILIKE lower(#{query}) || '%' THEN 1
            WHEN e.normalized_name ILIKE '% ' || lower(#{query}) || '%' THEN 2
            ELSE 3
        END,
        score DESC,
        display_name ASC
    LIMIT #{limit}
</select>
```

DTO:

```java id="hykzol"
package com.example.search;

public record EntityAutocompleteResult(
    long id,
    String entityNo,
    String displayName,
    String matchType,
    double score
) {}
```

---

## 15. Service layer guard

```java id="km6dgv"
package com.example.search;

import java.util.List;
import java.util.Set;

public class EntitySearchService {

    private static final int AUTOCOMPLETE_MAX_LIMIT = 10;
    private static final int FUZZY_MAX_LIMIT = 25;

    private static final Set<String> ALLOWED_STATUSES = Set.of(
        "ACTIVE",
        "SUSPENDED",
        "REVOKED",
        "INACTIVE"
    );

    private final EntitySearchMapper mapper;

    public EntitySearchService(EntitySearchMapper mapper) {
        this.mapper = mapper;
    }

    public List<EntityFuzzySearchResult> fuzzySearch(
        long tenantId,
        String rawQuery,
        List<String> requestedStatuses,
        Integer requestedLimit
    ) {
        String query = normalize(rawQuery);

        if (query.length() < 3) {
            return List.of();
        }

        List<String> statuses = sanitizeStatuses(requestedStatuses);
        int limit = sanitizeLimit(requestedLimit, FUZZY_MAX_LIMIT);

        return mapper.searchEntitiesFuzzy(
            tenantId,
            query,
            statuses,
            limit
        );
    }

    public List<EntityAutocompleteResult> autocomplete(
        long tenantId,
        String rawQuery,
        Integer requestedLimit
    ) {
        String query = normalize(rawQuery);

        if (query.length() < 3) {
            return List.of();
        }

        int limit = sanitizeLimit(requestedLimit, AUTOCOMPLETE_MAX_LIMIT);

        return mapper.autocompleteEntities(
            tenantId,
            query,
            limit
        );
    }

    private String normalize(String raw) {
        if (raw == null) {
            return "";
        }
        return raw.trim().replaceAll("\\s+", " ");
    }

    private List<String> sanitizeStatuses(List<String> statuses) {
        if (statuses == null || statuses.isEmpty()) {
            return List.of("ACTIVE", "SUSPENDED");
        }

        return statuses.stream()
            .filter(ALLOWED_STATUSES::contains)
            .distinct()
            .toList();
    }

    private int sanitizeLimit(Integer requestedLimit, int maxLimit) {
        if (requestedLimit == null) {
            return maxLimit;
        }
        return Math.min(Math.max(requestedLimit, 1), maxLimit);
    }
}
```

---

## 16. Jersey resource contoh

```java id="45iaa2"
package com.example.search;

import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/entities/search")
@Produces(MediaType.APPLICATION_JSON)
public class EntitySearchResource {

    private final EntitySearchService service;

    public EntitySearchResource(EntitySearchService service) {
        this.service = service;
    }

    @GET
    @Path("/fuzzy")
    public List<EntityFuzzySearchResult> fuzzySearch(
        @QueryParam("q") String query,
        @QueryParam("status") List<String> statuses,
        @QueryParam("limit") @DefaultValue("25") int limit
    ) {
        long tenantId = resolveTenantId();

        return service.fuzzySearch(
            tenantId,
            query,
            statuses,
            limit
        );
    }

    @GET
    @Path("/autocomplete")
    public List<EntityAutocompleteResult> autocomplete(
        @QueryParam("q") String query,
        @QueryParam("limit") @DefaultValue("10") int limit
    ) {
        long tenantId = resolveTenantId();

        return service.autocomplete(
            tenantId,
            query,
            limit
        );
    }

    private long resolveTenantId() {
        // Resolve from JWT/session/security context.
        return 1001L;
    }
}
```

---

## 17. Threshold tuning

Tidak ada threshold universal. Threshold tergantung domain.

| Domain | Suggested starting threshold | Catatan |
|---|---:|---|
| Nama orang | 0.25-0.35 | Banyak variasi ejaan |
| Nama perusahaan | 0.25-0.40 | Legal suffix bisa noise |
| Title pendek | 0.30-0.45 | Lebih strict |
| Identifier | Jangan pakai trigram utama | Prefix/exact lebih baik |
| Autocomplete | Jangan terlalu rendah | Result bisa noisy |

Contoh eksperimen:

```sql id="5mb3ug"
SELECT
    legal_name,
    similarity(normalized_name, lower('nusantara regulsi')) AS score
FROM regulated_entities
WHERE tenant_id = 1001
ORDER BY score DESC
LIMIT 20;
```

Lalu bandingkan:

```sql id="n2e8zd"
SELECT
    legal_name,
    similarity(normalized_name, lower('nusantara regulsi')) AS score
FROM regulated_entities
WHERE tenant_id = 1001
  AND similarity(normalized_name, lower('nusantara regulsi')) >= 0.25
ORDER BY score DESC
LIMIT 20;
```

```sql id="jrkzwf"
SELECT
    legal_name,
    similarity(normalized_name, lower('nusantara regulsi')) AS score
FROM regulated_entities
WHERE tenant_id = 1001
  AND similarity(normalized_name, lower('nusantara regulsi')) >= 0.40
ORDER BY score DESC
LIMIT 20;
```

Practical process:

```text id="h9knlt"
1. Ambil 50-100 query nyata
2. Label manual top-5 result
3. Coba threshold 0.25 / 0.30 / 0.35 / 0.40
4. Pilih threshold berdasarkan precision/recall domain
5. Pisahkan threshold untuk autocomplete dan full fuzzy search
```

---

## 18. Normalization strategy

Fuzzy search sangat sensitif terhadap noise. Normalisasi sering lebih penting daripada index.

### 18.1 Basic normalization

```sql id="piwu3o"
lower(regexp_replace(input, '\s+', ' ', 'g'))
```

### 18.2 Hilangkan legal suffix untuk company name

Contoh table alias/suffix:

```sql id="l46vj2"
CREATE TABLE company_name_stopwords (
    word TEXT PRIMARY KEY
);

INSERT INTO company_name_stopwords(word)
VALUES
    ('pt'),
    ('tbk'),
    ('ltd'),
    ('limited'),
    ('inc'),
    ('corp'),
    ('corporation');
```

Untuk production, biasanya lebih aman normalisasi di application layer atau ETL/indexing layer agar logic bisa dites jelas.

Contoh Java normalizer sederhana:

```java id="qfrfbh"
package com.example.search;

import java.text.Normalizer;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.Arrays;

public final class SearchTextNormalizer {

    private static final Pattern NON_ALNUM_SPACE =
        Pattern.compile("[^\\p{IsAlphabetic}\\p{IsDigit}\\s]");

    private static final Pattern MULTI_SPACE =
        Pattern.compile("\\s+");

    private static final Set<String> COMPANY_SUFFIXES = Set.of(
        "pt", "tbk", "ltd", "limited", "inc", "corp", "corporation"
    );

    private SearchTextNormalizer() {}

    public static String normalizeName(String raw) {
        if (raw == null) {
            return "";
        }

        String normalized = Normalizer.normalize(raw, Normalizer.Form.NFKD)
            .toLowerCase()
            .replaceAll("\\p{M}", "");

        normalized = NON_ALNUM_SPACE.matcher(normalized).replaceAll(" ");
        normalized = MULTI_SPACE.matcher(normalized).replaceAll(" ").trim();

        return Arrays.stream(normalized.split(" "))
            .filter(token -> !COMPANY_SUFFIXES.contains(token))
            .collect(Collectors.joining(" "));
    }
}
```

---

## 19. `unaccent` untuk accent-insensitive search

Jika data punya diacritic/accent, PostgreSQL menyediakan extension `unaccent`, yaitu dictionary yang menghapus accent/diacritic dari lexeme dan dapat dipakai untuk accent-insensitive full text search. ([PostgreSQL](https://www.postgresql.org/docs/current/unaccent.html?utm_source=chatgpt.com))

Enable:

```sql id="zzkp5x"
CREATE EXTENSION IF NOT EXISTS unaccent;
```

Untuk trigram, bisa pakai expression index:

```sql id="lpa7pz"
CREATE INDEX CONCURRENTLY idx_entities_name_unaccent_trgm
ON regulated_entities
USING GIN (lower(unaccent(normalized_name)) gin_trgm_ops);
```

Query:

```sql id="27x59x"
SELECT
    id,
    legal_name,
    similarity(lower(unaccent(normalized_name)), lower(unaccent(:query))) AS score
FROM regulated_entities
WHERE tenant_id = :tenantId
  AND lower(unaccent(normalized_name)) % lower(unaccent(:query))
ORDER BY score DESC
LIMIT :limit;
```

Practical warning:

```text id="15s3kj"
Expression index hanya dipakai jika query memakai expression yang compatible.
```

---

## 20. EXPLAIN checklist

Gunakan:

```sql id="fs4evc"
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    id,
    legal_name,
    similarity(normalized_name, lower('nusantara regulsi')) AS score
FROM regulated_entities
WHERE tenant_id = 1001
  AND normalized_name % lower('nusantara regulsi')
ORDER BY score DESC
LIMIT 20;
```

Yang dicari:

| Signal | Interpretasi |
|---|---|
| `Bitmap Index Scan` pada trigram GIN | Bagus |
| Seq scan pada table besar | Index tidak dipakai atau query terlalu broad |
| Banyak rows removed by tenant filter | Butuh index/filter strategy tambahan |
| Sort mahal | Candidate terlalu banyak |
| Buffers tinggi | Working set/index besar |
| Query pendek lambat | Tambah minimum length guard |

---

## 21. Anti-pattern

| Anti-pattern | Masalah | Solusi |
|---|---|---|
| `ILIKE '%a%'` untuk autocomplete | Terlalu broad | Minimum 3 chars |
| Semua fuzzy query threshold sama | Precision/recall buruk | Threshold per mode/domain |
| Fuzzy search untuk exact ID | Bisa salah ranking | B-tree exact/prefix |
| Tidak normalize text | Similarity tidak stabil | Lowercase, whitespace cleanup, suffix handling |
| Tidak pakai tenant filter di SQL | Data leak | Tenant/security filter wajib |
| Menggabungkan FTS + trigram tanpa scoring jelas | Ranking kacau | Pisahkan score dan boost eksplisit |
| Log raw query sensitif | Compliance risk | Mask/anonymize |
| Tidak benchmark GIN vs GiST | Pilihan index spekulatif | EXPLAIN pada data nyata |
| Search-as-you-type tanpa debounce | Beban DB tinggi | Debounce + limit kecil + cache optional |

---

## 22. Production design pattern

Untuk search endpoint enterprise, saya sarankan punya 3 endpoint atau 3 mode internal:

```text id="3fc9ch"
GET /cases/search?q=
→ full case search: exact + FTS + fuzzy fallback

GET /entities/search/fuzzy?q=
→ fuzzy name/entity search

GET /entities/search/autocomplete?q=
→ search-as-you-type, limit kecil
```

Jangan semua UI search diarahkan ke satu query besar jika behavior-nya berbeda.

---

## 23. Practical ranking formula

Contoh formula sederhana:

```text id="oekz8x"
final_score =
    identifier_score
  + lexical_score
  + trigram_score
  + status_boost
  + recency_boost
```

Contoh interpretasi:

| Score | Range contoh | Meaning |
|---|---:|---|
| `identifier_score` | 0 / 50 / 100 | Exact/prefix match menang |
| `lexical_score` | 0.0-1.0+ | FTS relevance |
| `trigram_score` | 0.0-1.0 | Fuzzy similarity |
| `status_boost` | 0-2 | Business priority |
| `recency_boost` | kecil | Tie breaker |

Practical invariant:

```text id="zwq3lp"
Jangan biarkan trigram typo match mengalahkan exact identifier match.
```

---

## 24. Mini exercise

Buat fuzzy search untuk `case_parties`.

### Table

```sql id="aqji66"
CREATE TABLE case_parties (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       BIGINT NOT NULL,
    case_id         BIGINT NOT NULL,
    party_type      TEXT NOT NULL,
    party_name      TEXT NOT NULL,
    normalized_name TEXT GENERATED ALWAYS AS (
        lower(regexp_replace(coalesce(party_name, ''), '\s+', ' ', 'g'))
    ) STORED,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Index

```sql id="mg1jg0"
CREATE INDEX CONCURRENTLY idx_case_parties_tenant_type
ON case_parties (tenant_id, party_type);

CREATE INDEX CONCURRENTLY idx_case_parties_normalized_name_trgm
ON case_parties
USING GIN (normalized_name gin_trgm_ops);
```

### Query

```sql id="5b6ojp"
SELECT
    p.id,
    p.case_id,
    p.party_type,
    p.party_name,
    similarity(p.normalized_name, lower(:query)) AS score
FROM case_parties p
WHERE p.tenant_id = :tenantId
  AND length(:query) >= 3
  AND p.party_type = ANY(:partyTypes)
  AND p.normalized_name % lower(:query)
ORDER BY score DESC, p.created_at DESC
LIMIT :limit;
```

### MyBatis mapper

```xml id="wv41li"
<select id="searchCasePartiesFuzzy" resultType="com.example.search.CasePartySearchResult">
    SELECT
        p.id,
        p.case_id AS caseId,
        p.party_type AS partyType,
        p.party_name AS partyName,
        similarity(p.normalized_name, lower(#{query})) AS score
    FROM case_parties p
    WHERE p.tenant_id = #{tenantId}
      AND length(#{query}) &gt;= 3
      AND p.party_type IN
      <foreach collection="partyTypes"
               item="partyType"
               open="("
               separator=","
               close=")">
          #{partyType}
      </foreach>
      AND p.normalized_name % lower(#{query})
    ORDER BY score DESC, p.created_at DESC
    LIMIT #{limit}
</select>
```

---

## 25. Checklist Seri 4

| Checklist | Target |
|---|---|
| `pg_trgm` extension enabled | Ya |
| Kolom searchable dinormalisasi | Ya |
| Trigram GIN/GiST index dibuat | Ya |
| Minimum query length diterapkan | Ya |
| Threshold similarity diuji dengan data nyata | Ya |
| Exact identifier tidak bergantung pada fuzzy search | Ya |
| Autocomplete limit kecil dan tanpa deep pagination | Ya |
| Tenant/security filter selalu di SQL | Ya |
| `EXPLAIN ANALYZE` dilakukan untuk query utama | Ya |
| FTS dan trigram score dipisah saat hybrid lexical-fuzzy | Ya |

---

## Seri 4 selesai

Seri berikutnya:

**Seri 5/10 - PostgreSQL Vector Search Fundamentals dengan pgvector**

Fokusnya: konsep embedding, `vector(n)`, distance operator seperti cosine/L2/inner product, exact nearest-neighbor query, schema dasar embedding table, dan cara mulai membuat semantic search di PostgreSQL tanpa langsung masuk ANN index.

---

**Sources:**

- [F.35. pg_trgm — support for similarity of text using trigram ...](https://www.postgresql.org/docs/current/pgtrgm.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:09:38 PM

# Seri 5/10 - PostgreSQL Vector Search Fundamentals dengan pgvector

Seri ini masuk ke **semantic search**: pencarian berdasarkan **kemiripan makna**, bukan hanya kemiripan kata. Di PostgreSQL, pola yang paling umum adalah memakai extension **pgvector**, yang menambahkan tipe data vector, operator distance, exact nearest-neighbor search, dan index approximate seperti HNSW/IVFFlat. pgvector diaktifkan per database dengan `CREATE EXTENSION vector`, lalu kolom embedding bisa dibuat dengan tipe `vector(n)`. ([GitHub](https://github.com/pgvector/pgvector))

---

## 1. Core idea

Full Text Search menjawab:

```text
“Dokumen mana yang mengandung kata/phrase ini?”
```

Vector search menjawab:

```text
“Dokumen mana yang maknanya paling dekat dengan query ini?”
```

Contoh:

| Query user | FTS bisa gagal karena | Vector search bisa membantu |
|---|---|---|
| `company failed to submit report` | Dokumen pakai istilah `non-compliance with periodic filing` | Maknanya tetap dekat |
| `license risk` | Dokumen pakai istilah `suspension`, `revocation`, `regulatory action` | Semantic similarity menangkap relasi |
| `complaint delay response` | Dokumen pakai `service-level breach` | Intent masih mirip |
| `dokumen mirip kasus ini` | Tidak ada keyword eksplisit | Vector by existing document |

Vector search biasanya dipakai untuk:

```text
- semantic document search
- RAG / retrieval augmented generation
- similar case lookup
- duplicate / near-duplicate detection
- recommendation
- knowledge base search
- semantic clustering
```

---

## 2. Mental model

```text
Raw text / document / case note
        │
        ▼
Embedding model
        │
        ▼
High-dimensional vector
        │
        ▼
PostgreSQL table with vector column
        │
        ▼
ORDER BY embedding <=> query_embedding
        │
        ▼
Nearest semantic neighbors
```

Dalam PostgreSQL, vector search bukan berarti PostgreSQL “memahami bahasa”. PostgreSQL hanya menyimpan angka vector dan menghitung jarak antar-vector. Makna berasal dari **embedding model** yang dipakai di luar database.

---

## 3. Enable pgvector

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Contoh paling kecil:

```sql
CREATE TABLE items (
    id BIGSERIAL PRIMARY KEY,
    embedding vector(3)
);

INSERT INTO items (embedding)
VALUES
    ('[1,2,3]'),
    ('[4,5,6]');

SELECT *
FROM items
ORDER BY embedding <-> '[3,1,2]'
LIMIT 5;
```

pgvector mendokumentasikan nearest-neighbor query memakai `ORDER BY embedding <-> '[3,1,2]' LIMIT 5`, dan mendukung beberapa operator distance seperti L2, inner product, cosine, L1, Hamming, dan Jaccard. ([GitHub](https://github.com/pgvector/pgvector))

---

## 4. Operator distance penting

| Operator | Meaning | Biasanya dipakai untuk |
|---|---|---|
| `<->` | L2 / Euclidean distance | General vector distance |
| `<#>` | Negative inner product | Embedding model yang direkomendasikan inner product |
| `<=>` | Cosine distance | Semantic text embedding umum |
| `<+>` | L1 / taxicab distance | Niche/eksperimen |
| `<~>` | Hamming distance | Binary vectors |
| `<%>` | Jaccard distance | Binary vectors |

Untuk cosine similarity:

```sql
SELECT
    id,
    1 - (embedding <=> :queryEmbedding::vector) AS cosine_similarity
FROM document_embeddings
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT 10;
```

Important detail: untuk memakai index vector, `ORDER BY` harus berupa distance operator secara langsung dan ascending dengan `LIMIT`; contoh `ORDER BY embedding <=> '[3,1,2]' LIMIT 5` indexable, sedangkan `ORDER BY 1 - (embedding <=> '[3,1,2]') DESC` tidak memakai index dengan cara yang sama. ([GitHub](https://github.com/pgvector/pgvector))

---

## 5. Schema dasar semantic document search

Contoh domain: **regulatory knowledge/case search**.

```sql
CREATE TABLE semantic_documents (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       BIGINT NOT NULL,
    source_type     TEXT NOT NULL,
    source_id       BIGINT NOT NULL,
    chunk_no        INTEGER NOT NULL,
    title           TEXT NOT NULL,
    content         TEXT NOT NULL,
    language        TEXT NOT NULL DEFAULT 'en',
    status          TEXT NOT NULL,
    embedding_model TEXT NOT NULL,
    embedding_dim   INTEGER NOT NULL,
    embedding       vector(1536) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (tenant_id, source_type, source_id, chunk_no)
);
```

Catatan praktis:

| Column | Fungsi |
|---|---|
| `tenant_id` | Security boundary wajib |
| `source_type` | `CASE`, `ARTICLE`, `ATTACHMENT`, `DECISION`, dll |
| `source_id` | ID row asal |
| `chunk_no` | Urutan potongan dokumen |
| `title` | Display / metadata |
| `content` | Text yang di-embed |
| `embedding_model` | Tracking model/version |
| `embedding_dim` | Validasi dimensi |
| `embedding` | Vector yang dicari |
| `status` | Filter visibility/publish state |

Practical invariant:

```text
Embedding row adalah search projection, bukan selalu row domain utama.
```

Untuk dokumen panjang, jangan embed seluruh dokumen sebagai satu vector jika hasil yang diharapkan adalah paragraf/chunk spesifik. Gunakan chunk table.

---

## 6. Insert embedding

Misalnya aplikasi Java menghasilkan embedding 1536 dimensi dari model embedding. Di SQL, bentuk literal vector:

```sql
INSERT INTO semantic_documents (
    tenant_id,
    source_type,
    source_id,
    chunk_no,
    title,
    content,
    language,
    status,
    embedding_model,
    embedding_dim,
    embedding
)
VALUES (
    1001,
    'ARTICLE',
    501,
    1,
    'License suspension policy',
    'A license may be suspended when the regulated entity fails to comply with reporting obligations.',
    'en',
    'PUBLISHED',
    'text-embedding-model-v1',
    1536,
    :embedding::vector
);
```

Di aplikasi, parameter `:embedding` biasanya dikirim sebagai string:

```text
[0.0123,-0.0456,0.0789,...]
```

Untuk production, validasi:

```text
- dimensi vector cocok dengan kolom vector(n)
- embedding tidak null
- embedding berasal dari model yang benar
- content dan embedding_model disimpan bersama
- re-embedding path tersedia ketika model berubah
```

---

## 7. Exact nearest-neighbor search

Tanpa index approximate, pgvector melakukan **exact nearest-neighbor search**, sehingga recall sempurna tetapi bisa mahal untuk tabel besar. pgvector menyatakan default-nya adalah exact nearest neighbor, dan approximate index menukar sebagian recall demi speed. ([GitHub](https://github.com/pgvector/pgvector))

Query cosine distance:

```sql
SELECT
    id,
    source_type,
    source_id,
    chunk_no,
    title,
    content,
    embedding <=> :queryEmbedding::vector AS distance,
    1 - (embedding <=> :queryEmbedding::vector) AS similarity
FROM semantic_documents
WHERE tenant_id = :tenantId
  AND status = 'PUBLISHED'
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT :limit;
```

Interpretasi:

| Field | Meaning |
|---|---|
| `distance` | Semakin kecil semakin dekat |
| `similarity` | Semakin besar semakin mirip, jika pakai cosine |
| `LIMIT` | Top-k semantic result |

Practical rule:

```text
Gunakan exact search sebagai baseline kualitas sebelum membuat ANN index.
```

Kalau sudah membuat HNSW/IVFFlat nanti, bandingkan top-k ANN vs exact untuk mengukur recall.

---

## 8. Query by existing document

Mirip “find similar cases/articles”.

```sql
SELECT
    target.id,
    target.source_type,
    target.source_id,
    target.chunk_no,
    target.title,
    target.content,
    target.embedding <=> anchor.embedding AS distance
FROM semantic_documents anchor
JOIN semantic_documents target
  ON target.tenant_id = anchor.tenant_id
WHERE anchor.id = :anchorDocumentId
  AND target.id <> anchor.id
  AND target.tenant_id = :tenantId
  AND target.status = 'PUBLISHED'
ORDER BY target.embedding <=> anchor.embedding
LIMIT :limit;
```

Use case:

```text
- cari case mirip
- cari knowledge article terkait
- cari attachment yang membahas topik serupa
- duplicate detection
```

---

## 9. Metadata filter wajib

Vector search tidak boleh dilakukan tanpa filter domain/security.

```sql
SELECT
    id,
    source_type,
    source_id,
    title,
    content,
    embedding <=> :queryEmbedding::vector AS distance
FROM semantic_documents
WHERE tenant_id = :tenantId
  AND source_type = ANY(:sourceTypes)
  AND status = 'PUBLISHED'
  AND updated_at >= :updatedAfter
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT :limit;
```

Practical invariant:

```text
Vector similarity tidak boleh mengalahkan authorization boundary.
```

Filtering ini akan dibahas lebih dalam di seri 8, karena ANN index + filter punya behavior khusus: pada approximate index, filter bisa diterapkan setelah index scan, sehingga jumlah result bisa lebih sedikit dari limit jika candidate yang discan tidak cukup. pgvector 0.8.0+ menyediakan iterative index scan untuk membantu kasus seperti ini. ([GitHub](https://github.com/pgvector/pgvector))

---

## 10. Jangan mulai dari index dulu

Untuk onboarding praktis, urutannya sebaiknya:

```text
1. Desain schema embedding
2. Tentukan chunking
3. Simpan embedding + metadata
4. Jalankan exact nearest-neighbor
5. Validasi hasil top-k secara manual
6. Baru tambah HNSW/IVFFlat kalau latency/volume membutuhkan
```

Kenapa?

| Kalau langsung indexing | Risiko |
|---|---|
| Hasil sulit dievaluasi | Tidak tahu recall turun karena index atau embedding jelek |
| Salah metric | Cosine/L2/inner product tertukar |
| Salah chunking | Result semantik terlalu luas |
| Salah filter | Result bocor lintas tenant/status |
| Salah model version | Embedding campur antar-model |

---

## 11. Chunking fundamentals

Untuk dokumen panjang, embedding per dokumen penuh sering terlalu kasar. Lebih baik embed chunk.

```text
Document
│
├── chunk 1: title + summary
├── chunk 2: paragraph 1-3
├── chunk 3: paragraph 4-6
├── chunk 4: decision section
└── chunk 5: remedy / sanction section
```

Contoh schema chunk:

```sql
CREATE TABLE document_chunks (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       BIGINT NOT NULL,
    document_id     BIGINT NOT NULL,
    chunk_no        INTEGER NOT NULL,
    section_name    TEXT,
    content         TEXT NOT NULL,
    token_count     INTEGER,
    embedding_model TEXT NOT NULL,
    embedding       vector(1536) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (tenant_id, document_id, chunk_no)
);
```

Practical chunking rules:

| Rule | Reason |
|---|---|
| Chunk jangan terlalu kecil | Kehilangan konteks |
| Chunk jangan terlalu besar | Embedding terlalu rata/noisy |
| Simpan `section_name` | Bisa boost/rerank |
| Simpan `chunk_no` | Bisa susun kembali context |
| Simpan `token_count` | Kontrol biaya dan kualitas |
| Simpan model version | Re-embedding manageable |

---

## 12. Embedding model versioning

Jangan hanya simpan `embedding vector(1536)`. Simpan informasi model.

```sql
ALTER TABLE semantic_documents
ADD COLUMN embedding_provider TEXT,
ADD COLUMN embedding_model_version TEXT,
ADD COLUMN embedded_at TIMESTAMPTZ;
```

Contoh query validasi:

```sql
SELECT
    embedding_model,
    embedding_model_version,
    embedding_dim,
    count(*) AS row_count
FROM semantic_documents
GROUP BY
    embedding_model,
    embedding_model_version,
    embedding_dim
ORDER BY row_count DESC;
```

Practical invariant:

```text
Jangan campur embedding dari model/dimensi berbeda dalam satu ranking tanpa kontrol.
```

Model berbeda bisa menghasilkan vector space yang tidak kompatibel. Jika model berubah, buat migration/backfill strategy.

---

## 13. Similarity threshold

Top-k saja belum tentu cukup. Kadang perlu threshold agar result yang terlalu jauh tidak dikembalikan.

```sql
WITH nearest AS (
    SELECT
        id,
        source_type,
        source_id,
        title,
        content,
        embedding <=> :queryEmbedding::vector AS distance
    FROM semantic_documents
    WHERE tenant_id = :tenantId
      AND status = 'PUBLISHED'
    ORDER BY embedding <=> :queryEmbedding::vector
    LIMIT 50
)
SELECT
    *,
    1 - distance AS cosine_similarity
FROM nearest
WHERE distance <= :maxDistance
ORDER BY distance
LIMIT :limit;
```

Practical note:

```text
Threshold tidak universal.
Tentukan dari evaluasi query nyata dan label manual.
```

Contoh interpretasi kasar untuk cosine similarity:

| Similarity | Interpretasi awal |
|---:|---|
| `> 0.85` | Sangat mirip |
| `0.75-0.85` | Mungkin relevan |
| `0.60-0.75` | Perlu rerank/filter |
| `< 0.60` | Sering noisy |

Angka ini sangat tergantung model embedding dan domain, jadi jangan jadikan aturan permanen tanpa evaluasi.

---

## 14. Vector type choices

pgvector mendukung `vector`, `halfvec`, `bit`, dan `sparsevec`; untuk indexing, README mencatat batas dimensi berbeda, seperti `vector` sampai 2.000 dimensi untuk HNSW/IVFFlat operator class umum, `halfvec` sampai 4.000, `bit` sampai 64.000, dan `sparsevec` sampai 1.000 non-zero elements untuk HNSW. ([GitHub](https://github.com/pgvector/pgvector))

| Type | Use case praktis |
|---|---|
| `vector(n)` | Default untuk dense embedding |
| `halfvec(n)` | Optimasi memory/index, perlu validasi kualitas |
| `bit(n)` | Binary vector / quantized representation |
| `sparsevec` | Sparse embedding / niche retrieval |
| array `double precision[]` | Jika butuh precision lebih tinggi, tapi index biasanya via cast/expression |

Untuk seri ini, gunakan `vector(n)` dulu.

---

## 15. Exact search performance baseline

Sebelum ANN index, ukur exact query:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    id,
    title,
    embedding <=> '[0.1,0.2,0.3]'::vector AS distance
FROM semantic_documents
WHERE tenant_id = 1001
  AND status = 'PUBLISHED'
ORDER BY embedding <=> '[0.1,0.2,0.3]'::vector
LIMIT 10;
```

Yang dicari:

| Signal | Meaning |
|---|---|
| Seq scan | Normal untuk exact search tanpa ANN index |
| Sort top-N | Normal, tapi bisa mahal |
| Buffers tinggi | Working set besar |
| p95 latency naik | Saatnya evaluasi ANN index |
| Filter tenant sangat selektif | B-tree filter bisa cukup membantu |
| Candidate kecil | Exact search bisa tetap acceptable |

---

## 16. MyBatis mapper basic vector search

### 16.1 DTO

```java
package com.example.search;

public record SemanticSearchResult(
    long id,
    String sourceType,
    long sourceId,
    int chunkNo,
    String title,
    String content,
    double distance,
    double similarity
) {}
```

### 16.2 Mapper XML

```xml
<resultMap id="SemanticSearchResultMap"
           type="com.example.search.SemanticSearchResult">
    <id property="id" column="id"/>
    <result property="sourceType" column="source_type"/>
    <result property="sourceId" column="source_id"/>
    <result property="chunkNo" column="chunk_no"/>
    <result property="title" column="title"/>
    <result property="content" column="content"/>
    <result property="distance" column="distance"/>
    <result property="similarity" column="similarity"/>
</resultMap>

<select id="semanticSearch" resultMap="SemanticSearchResultMap">
    SELECT
        d.id,
        d.source_type,
        d.source_id,
        d.chunk_no,
        d.title,
        d.content,
        d.embedding &lt;=&gt; #{queryEmbedding}::vector AS distance,
        1 - (d.embedding &lt;=&gt; #{queryEmbedding}::vector) AS similarity
    FROM semantic_documents d
    WHERE d.tenant_id = #{tenantId}
      AND d.status = 'PUBLISHED'

      <if test="sourceTypes != null and sourceTypes.size() > 0">
        AND d.source_type IN
        <foreach collection="sourceTypes"
                 item="sourceType"
                 open="("
                 separator=","
                 close=")">
            #{sourceType}
        </foreach>
      </if>

    ORDER BY d.embedding &lt;=&gt; #{queryEmbedding}::vector
    LIMIT #{limit}
</select>
```

### 16.3 Mapper interface

```java
package com.example.search;

import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface SemanticSearchMapper {

    List<SemanticSearchResult> semanticSearch(
        @Param("tenantId") long tenantId,
        @Param("queryEmbedding") String queryEmbedding,
        @Param("sourceTypes") List<String> sourceTypes,
        @Param("limit") int limit
    );
}
```

Kenapa `queryEmbedding` string?

```text
MyBatis/JDBC belum punya tipe Java standar untuk pgvector.
Pola paling sederhana: kirim literal vector string valid lalu cast ::vector.
```

Di seri 10 nanti, kita bahas TypeHandler agar lebih rapi.

---

## 17. Java helper untuk vector literal

```java
package com.example.search;

import java.util.Locale;

public final class PgVectorLiteral {

    private PgVectorLiteral() {}

    public static String fromFloatArray(float[] values) {
        if (values == null || values.length == 0) {
            throw new IllegalArgumentException("Embedding must not be empty");
        }

        StringBuilder sb = new StringBuilder();
        sb.append('[');

        for (int i = 0; i < values.length; i++) {
            float value = values[i];

            if (!Float.isFinite(value)) {
                throw new IllegalArgumentException("Embedding contains non-finite value at index " + i);
            }

            if (i > 0) {
                sb.append(',');
            }

            sb.append(String.format(Locale.ROOT, "%.8f", value));
        }

        sb.append(']');
        return sb.toString();
    }
}
```

Practical validation:

```java
public static void validateDimension(float[] embedding, int expectedDimension) {
    if (embedding == null) {
        throw new IllegalArgumentException("Embedding must not be null");
    }
    if (embedding.length != expectedDimension) {
        throw new IllegalArgumentException(
            "Invalid embedding dimension: expected " + expectedDimension
                + ", got " + embedding.length
        );
    }
}
```

---

## 18. Service layer basic semantic search

```java
package com.example.search;

import java.util.List;
import java.util.Set;

public class SemanticSearchService {

    private static final int EXPECTED_DIMENSION = 1536;
    private static final int DEFAULT_LIMIT = 10;
    private static final int MAX_LIMIT = 30;

    private static final Set<String> ALLOWED_SOURCE_TYPES = Set.of(
        "CASE",
        "ARTICLE",
        "ATTACHMENT",
        "DECISION"
    );

    private final EmbeddingClient embeddingClient;
    private final SemanticSearchMapper mapper;

    public SemanticSearchService(
        EmbeddingClient embeddingClient,
        SemanticSearchMapper mapper
    ) {
        this.embeddingClient = embeddingClient;
        this.mapper = mapper;
    }

    public List<SemanticSearchResult> search(
        long tenantId,
        String query,
        List<String> requestedSourceTypes,
        Integer requestedLimit
    ) {
        String normalizedQuery = normalizeQuery(query);
        if (normalizedQuery.isBlank()) {
            return List.of();
        }

        int limit = sanitizeLimit(requestedLimit);
        List<String> sourceTypes = sanitizeSourceTypes(requestedSourceTypes);

        float[] embedding = embeddingClient.embed(normalizedQuery);
        validateDimension(embedding, EXPECTED_DIMENSION);

        String embeddingLiteral = PgVectorLiteral.fromFloatArray(embedding);

        return mapper.semanticSearch(
            tenantId,
            embeddingLiteral,
            sourceTypes,
            limit
        );
    }

    private String normalizeQuery(String raw) {
        if (raw == null) {
            return "";
        }
        return raw.trim().replaceAll("\\s+", " ");
    }

    private int sanitizeLimit(Integer requestedLimit) {
        if (requestedLimit == null) {
            return DEFAULT_LIMIT;
        }
        return Math.min(Math.max(requestedLimit, 1), MAX_LIMIT);
    }

    private List<String> sanitizeSourceTypes(List<String> sourceTypes) {
        if (sourceTypes == null || sourceTypes.isEmpty()) {
            return List.of("ARTICLE", "CASE");
        }

        return sourceTypes.stream()
            .filter(ALLOWED_SOURCE_TYPES::contains)
            .distinct()
            .toList();
    }

    private void validateDimension(float[] embedding, int expectedDimension) {
        if (embedding == null || embedding.length != expectedDimension) {
            throw new IllegalArgumentException("Invalid embedding dimension");
        }
    }
}
```

Interface embedding client:

```java
package com.example.search;

public interface EmbeddingClient {
    float[] embed(String text);
}
```

---

## 19. Jersey resource

```java
package com.example.search;

import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/semantic-search")
@Produces(MediaType.APPLICATION_JSON)
public class SemanticSearchResource {

    private final SemanticSearchService service;

    public SemanticSearchResource(SemanticSearchService service) {
        this.service = service;
    }

    @GET
    public List<SemanticSearchResult> search(
        @QueryParam("q") String query,
        @QueryParam("sourceType") List<String> sourceTypes,
        @QueryParam("limit") @DefaultValue("10") int limit
    ) {
        long tenantId = resolveTenantId();

        return service.search(
            tenantId,
            query,
            sourceTypes,
            limit
        );
    }

    private long resolveTenantId() {
        // Resolve from JWT/session/request context.
        return 1001L;
    }
}
```

---

## 20. Common mistakes

| Mistake | Dampak | Solusi |
|---|---|---|
| Menganggap vector search menggantikan FTS | Keyword exact menjadi buruk | Pakai hybrid search nanti |
| Tidak simpan model version | Re-embedding kacau | Simpan `embedding_model/version` |
| Campur embedding beda model | Ranking tidak valid | Pisahkan index/model |
| Tidak chunk dokumen panjang | Result terlalu kasar | Gunakan chunk table |
| Tidak filter tenant/status | Risiko data leak | Filter wajib di SQL |
| Pakai similarity expression untuk `ORDER BY` | Index tidak terpakai nanti | `ORDER BY embedding <=> vector LIMIT k` |
| Langsung ANN index tanpa baseline exact | Tidak tahu recall turun | Benchmark exact dulu |
| Tidak validasi dimensi | Insert/query error | Validasi di app dan DB |
| Limit terlalu besar | Latency/cost naik | Batasi top-k |
| Query kosong tetap di-embed | Biaya embedding sia-sia | Guard di service layer |

---

## 21. Production checklist Seri 5

| Checklist | Target |
|---|---|
| `CREATE EXTENSION vector` tersedia | Ya |
| Table embedding punya metadata domain | Ya |
| `tenant_id` selalu dipakai | Ya |
| `embedding_model` dan version disimpan | Ya |
| Dimensi embedding divalidasi | Ya |
| Exact search baseline dibuat | Ya |
| Cosine/L2/IP dipilih sesuai model | Ya |
| Query memakai `ORDER BY distance_operator LIMIT k` | Ya |
| Result menyimpan `distance` dan/atau `similarity` | Ya |
| Dokumen panjang dipotong menjadi chunk | Ya |
| Re-embedding strategy dipikirkan | Ya |
| Belum terburu-buru membuat ANN index | Ya |

---

## 22. Mini exercise

Buat semantic search untuk `case_knowledge_chunks`.

### Table

```sql
CREATE TABLE case_knowledge_chunks (
    id                BIGSERIAL PRIMARY KEY,
    tenant_id         BIGINT NOT NULL,
    case_id           BIGINT NOT NULL,
    chunk_no          INTEGER NOT NULL,
    section_name      TEXT NOT NULL,
    content           TEXT NOT NULL,
    status            TEXT NOT NULL,
    embedding_model   TEXT NOT NULL,
    embedding_version TEXT NOT NULL,
    embedding         vector(1536) NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (tenant_id, case_id, chunk_no)
);
```

### Query exact semantic search

```sql
SELECT
    id,
    case_id,
    chunk_no,
    section_name,
    content,
    embedding <=> :queryEmbedding::vector AS distance,
    1 - (embedding <=> :queryEmbedding::vector) AS similarity
FROM case_knowledge_chunks
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT :limit;
```

### Query similar chunks from existing chunk

```sql
SELECT
    target.id,
    target.case_id,
    target.chunk_no,
    target.section_name,
    target.content,
    target.embedding <=> anchor.embedding AS distance
FROM case_knowledge_chunks anchor
JOIN case_knowledge_chunks target
  ON target.tenant_id = anchor.tenant_id
WHERE anchor.id = :anchorChunkId
  AND anchor.tenant_id = :tenantId
  AND target.id <> anchor.id
  AND target.status = 'ACTIVE'
ORDER BY target.embedding <=> anchor.embedding
LIMIT :limit;
```

---

## Seri 5 selesai

Seri berikutnya:

**Seri 6/10 - Embedding Storage Design, Chunking, Metadata, Versioning**

Fokusnya: desain tabel embedding/chunk yang enterprise-grade, model versioning, idempotent upsert, re-embedding pipeline, attachment text extraction boundary, deduplication, metadata filter, dan pola migration/backfill.

---

**Sources:**

- [GitHub - pgvector/pgvector: Open-source vector similarity search for Postgres · GitHub](https://github.com/pgvector/pgvector)

## Response:
7/15/2026, 8:12:39 PM

Saya lanjut ke seri 6/10. Bagian ini akan lebih banyak ke desain data dan lifecycle: chunking, metadata, idempotent upsert, re-embedding, dan cara menjaga embedding tetap defensible di production.

# Seri 6/10 - Embedding Storage Design, Chunking, Metadata, Versioning

Seri ini fokus ke hal yang sering menentukan apakah vector search bisa dipakai serius di production: **desain storage embedding**, **chunking**, **metadata**, **idempotent upsert**, **model versioning**, **re-embedding**, dan **pipeline lifecycle**.

Di seri 5 kita sudah mulai dari query dasar `ORDER BY embedding <=> :queryEmbedding LIMIT k`. Sekarang kita naik satu level: bagaimana menyiapkan data agar vector search tidak menjadi “kolom angka misterius” yang sulit diaudit, sulit dimigrasi, dan sulit dijaga kualitasnya.

---

## 1. Core idea

Vector search production bukan hanya soal kolom:

```sql
embedding vector(1536)
```

Yang lebih penting adalah:

```text
Apa yang di-embed?
Dipotong menjadi chunk seperti apa?
Embedding dibuat oleh model apa?
Versi modelnya apa?
Apakah embedding masih sinkron dengan content?
Bagaimana kalau model diganti?
Bagaimana mencegah duplikasi saat re-run pipeline?
Bagaimana filter tenant/status/security diterapkan?
Bagaimana tahu result semantic search masih berkualitas?
```

pgvector menyediakan storage dan query vector di PostgreSQL, termasuk tipe `vector`, `halfvec`, `bit`, `sparsevec`, operator distance, exact nearest-neighbor search, serta approximate indexes seperti HNSW dan IVFFlat. Namun semantic quality tetap bergantung pada **embedding model**, **chunking strategy**, dan **metadata design** yang dibuat di aplikasi/pipeline. ([GitHub](https://github.com/pgvector/pgvector?utm_source=chatgpt.com))

---

## 2. Mental model

```text
Source domain data
│
├── cases
├── articles
├── attachments
├── decisions
├── comments
└── audit/workflow events
        │
        ▼
Extraction
│
├── clean text
├── remove boilerplate
├── normalize whitespace
├── preserve section/title/source metadata
└── detect changed source content
        │
        ▼
Chunking
│
├── chunk_no
├── section_name
├── content
├── token_count
├── content_hash
└── chunk_strategy_version
        │
        ▼
Embedding generation
│
├── embedding_provider
├── embedding_model
├── embedding_model_version
├── embedding_dim
├── embedding_status
└── embedded_at
        │
        ▼
PostgreSQL semantic index table
│
├── tenant/security metadata
├── source metadata
├── chunk metadata
├── embedding vector
├── lifecycle status
└── quality/diagnostic metadata
        │
        ▼
Search
│
├── metadata filter
├── vector distance
├── threshold
├── reranking/hybrid later
└── observability
```

---

## 3. Jangan simpan embedding tanpa lineage

Minimal table yang buruk:

```sql
CREATE TABLE bad_embeddings (
    id BIGSERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(1536)
);
```

Masalahnya:

| Problem | Dampak |
|---|---|
| Tidak tahu source data | Sulit trace result ke entity asli |
| Tidak tahu model | Re-embedding tidak aman |
| Tidak tahu versi chunking | Result berubah tanpa audit |
| Tidak ada tenant/security boundary | Risiko data leak |
| Tidak ada content hash | Tidak tahu embedding stale atau tidak |
| Tidak ada status | Gagal embedding sulit diproses ulang |
| Tidak ada idempotency key | Pipeline bisa duplicate row |

Production vector storage harus memperlakukan embedding sebagai **derived read model** yang bisa dibangun ulang.

---

## 4. Recommended core table: `semantic_search_chunks`

Ini pattern yang cukup fleksibel untuk case, article, attachment, decision, dan knowledge base.

```sql
CREATE TABLE semantic_search_chunks (
    id                       BIGSERIAL PRIMARY KEY,

    -- Security / tenancy
    tenant_id                BIGINT NOT NULL,

    -- Source identity
    source_type              TEXT NOT NULL,
    source_id                BIGINT NOT NULL,
    source_version           BIGINT,
    source_updated_at        TIMESTAMPTZ,

    -- Chunk identity
    chunk_no                 INTEGER NOT NULL,
    section_name             TEXT,
    title                    TEXT,
    content                  TEXT NOT NULL,
    content_hash             TEXT NOT NULL,
    token_count              INTEGER,
    chunk_strategy           TEXT NOT NULL,
    chunk_strategy_version   TEXT NOT NULL,

    -- Embedding lineage
    embedding_provider       TEXT NOT NULL,
    embedding_model          TEXT NOT NULL,
    embedding_model_version  TEXT NOT NULL,
    embedding_dim            INTEGER NOT NULL,
    embedding                vector(1536),

    -- Lifecycle
    embedding_status         TEXT NOT NULL DEFAULT 'PENDING',
    embedding_error          TEXT,
    embedded_at              TIMESTAMPTZ,
    indexed_at               TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Visibility / filtering
    visibility               TEXT NOT NULL DEFAULT 'INTERNAL',
    status                   TEXT NOT NULL DEFAULT 'ACTIVE',
    language                 TEXT NOT NULL DEFAULT 'en',

    created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_semantic_chunk_identity UNIQUE (
        tenant_id,
        source_type,
        source_id,
        chunk_no,
        chunk_strategy,
        chunk_strategy_version,
        embedding_provider,
        embedding_model,
        embedding_model_version
    ),

    CONSTRAINT chk_semantic_embedding_status CHECK (
        embedding_status IN ('PENDING', 'EMBEDDED', 'FAILED', 'STALE', 'DISABLED')
    ),

    CONSTRAINT chk_semantic_status CHECK (
        status IN ('ACTIVE', 'INACTIVE', 'DELETED')
    )
);
```

Kenapa `embedding` nullable? Karena row chunk bisa dibuat dulu dengan status `PENDING`, lalu worker embedding mengisi vector setelah call ke embedding service selesai. Ini membuat pipeline bisa retry dan observability-nya lebih jelas.

---

## 5. Index dasar

### 5.1 Metadata index

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_tenant_status_source
ON semantic_search_chunks (
    tenant_id,
    status,
    visibility,
    source_type,
    updated_at DESC
);
```

### 5.2 Idempotency / lookup index

Unique constraint di atas sudah membuat unique index. Berguna untuk idempotent upsert.

### 5.3 Pending worker index

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_pending
ON semantic_search_chunks (
    embedding_status,
    tenant_id,
    updated_at
)
WHERE embedding_status IN ('PENDING', 'STALE', 'FAILED');
```

### 5.4 Optional content hash index

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_content_hash
ON semantic_search_chunks (
    tenant_id,
    source_type,
    source_id,
    content_hash
);
```

### 5.5 Vector index nanti

Untuk seri ini, vector index belum menjadi fokus utama. Index HNSW/IVFFlat kita bahas di seri 7. pgvector sendiri menyatakan exact nearest-neighbor search adalah default, sedangkan approximate index menukar sebagian recall demi speed. ([GitHub](https://github.com/pgvector/pgvector?utm_source=chatgpt.com))

---

## 6. Chunking design

Chunking adalah keputusan domain, bukan hanya keputusan teknis.

### 6.1 Chunk terlalu besar

```text
Satu attachment 30 halaman → satu embedding
```

Dampaknya:

| Problem | Dampak |
|---|---|
| Banyak topik bercampur | Embedding jadi rata/noisy |
| Result tidak spesifik | User tidak tahu bagian mana yang relevan |
| RAG context terlalu panjang | Token waste |
| Ranking kurang presisi | Semantic distance kehilangan fokus |

### 6.2 Chunk terlalu kecil

```text
Satu kalimat → satu embedding
```

Dampaknya:

| Problem | Dampak |
|---|---|
| Kehilangan konteks | Similarity bisa misleading |
| Terlalu banyak row | Storage/index membesar |
| Query candidate membesar | Latency naik |
| RAG context terfragmentasi | Perlu chunk stitching |

### 6.3 Practical starting point

| Source type | Chunking awal yang masuk akal |
|---|---|
| Knowledge article | Title + section-based chunks |
| Legal/regulatory document | Heading/section/subsection |
| Case summary | Per section: allegation, finding, decision, remedy |
| Attachment OCR | Paragraph/page-window chunks |
| Comment/thread | Per comment atau grouped comments |
| Workflow event | Biasanya bukan vector utama, lebih cocok metadata/FTS |

Contoh chunking untuk enforcement case:

```text
CASE-2026-0001
│
├── chunk 1: Case title + subject + allegation summary
├── chunk 2: Investigation findings
├── chunk 3: Evidence summary
├── chunk 4: Decision rationale
└── chunk 5: Sanction/remedy/action required
```

---

## 7. Chunk identity dan idempotency

Pipeline embedding harus bisa di-run ulang tanpa membuat duplikasi.

Bad identity:

```text
source_id + random chunk id
```

Good identity:

```text
tenant_id
source_type
source_id
chunk_no
chunk_strategy
chunk_strategy_version
embedding_model_version
```

Kenapa `chunk_strategy_version` masuk identity?

Karena perubahan chunking dapat menghasilkan jumlah chunk dan boundary yang berbeda. Misalnya:

| Version | Behavior |
|---|---|
| `case-section-v1` | Split per field besar |
| `case-section-v2` | Split per subsection |
| `attachment-page-v1` | Split per page |
| `attachment-window-v2` | Split sliding window 800 token overlap 100 |

Kalau strategy berubah, sebaiknya hasil lama dan baru bisa coexist sementara sampai rollout selesai.

---

## 8. Content hash

Gunakan hash untuk mendeteksi apakah chunk berubah.

```sql
ALTER TABLE semantic_search_chunks
ADD COLUMN source_content_hash TEXT;
```

Contoh di aplikasi:

```java
package com.example.search;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

public final class ContentHash {

    private ContentHash() {}

    public static String sha256(String text) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(
                normalize(text).getBytes(StandardCharsets.UTF_8)
            );
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }

    private static String normalize(String text) {
        if (text == null) {
            return "";
        }
        return text.trim().replaceAll("\\s+", " ");
    }
}
```

Practical invariant:

```text
Kalau content_hash tidak berubah, embedding tidak perlu dibuat ulang.
```

---

## 9. Idempotent upsert chunk

```sql
INSERT INTO semantic_search_chunks (
    tenant_id,
    source_type,
    source_id,
    source_version,
    source_updated_at,
    chunk_no,
    section_name,
    title,
    content,
    content_hash,
    token_count,
    chunk_strategy,
    chunk_strategy_version,
    embedding_provider,
    embedding_model,
    embedding_model_version,
    embedding_dim,
    embedding_status,
    visibility,
    status,
    language,
    updated_at
)
VALUES (
    :tenantId,
    :sourceType,
    :sourceId,
    :sourceVersion,
    :sourceUpdatedAt,
    :chunkNo,
    :sectionName,
    :title,
    :content,
    :contentHash,
    :tokenCount,
    :chunkStrategy,
    :chunkStrategyVersion,
    :embeddingProvider,
    :embeddingModel,
    :embeddingModelVersion,
    :embeddingDim,
    'PENDING',
    :visibility,
    'ACTIVE',
    :language,
    now()
)
ON CONFLICT (
    tenant_id,
    source_type,
    source_id,
    chunk_no,
    chunk_strategy,
    chunk_strategy_version,
    embedding_provider,
    embedding_model,
    embedding_model_version
)
DO UPDATE SET
    source_version     = EXCLUDED.source_version,
    source_updated_at  = EXCLUDED.source_updated_at,
    section_name       = EXCLUDED.section_name,
    title              = EXCLUDED.title,
    content            = EXCLUDED.content,
    token_count        = EXCLUDED.token_count,
    visibility         = EXCLUDED.visibility,
    status             = EXCLUDED.status,
    language           = EXCLUDED.language,
    updated_at         = now(),

    embedding_status = CASE
        WHEN semantic_search_chunks.content_hash <> EXCLUDED.content_hash
        THEN 'STALE'
        ELSE semantic_search_chunks.embedding_status
    END,

    content_hash = EXCLUDED.content_hash,

    embedding = CASE
        WHEN semantic_search_chunks.content_hash <> EXCLUDED.content_hash
        THEN NULL
        ELSE semantic_search_chunks.embedding
    END,

    embedded_at = CASE
        WHEN semantic_search_chunks.content_hash <> EXCLUDED.content_hash
        THEN NULL
        ELSE semantic_search_chunks.embedded_at
    END;
```

Pola ini menjaga:

| Condition | Result |
|---|---|
| Chunk baru | Insert `PENDING` |
| Chunk sama | Tidak re-embed |
| Chunk berubah | Mark `STALE`, clear embedding |
| Metadata berubah | Update metadata |
| Model version berubah | Row baru karena identity berbeda |

---

## 10. Worker claim pattern

Kalau ada beberapa worker embedding, jangan sampai dua worker memproses chunk yang sama.

Gunakan `FOR UPDATE SKIP LOCKED`:

```sql
WITH picked AS (
    SELECT id
    FROM semantic_search_chunks
    WHERE embedding_status IN ('PENDING', 'STALE', 'FAILED')
      AND status = 'ACTIVE'
    ORDER BY updated_at ASC
    LIMIT :batchSize
    FOR UPDATE SKIP LOCKED
)
UPDATE semantic_search_chunks s
SET embedding_status = 'PENDING'
FROM picked
WHERE s.id = picked.id
RETURNING
    s.id,
    s.tenant_id,
    s.source_type,
    s.source_id,
    s.chunk_no,
    s.title,
    s.content,
    s.embedding_provider,
    s.embedding_model,
    s.embedding_model_version,
    s.embedding_dim;
```

Practical notes:

| Concern | Recommendation |
|---|---|
| Worker concurrency | `FOR UPDATE SKIP LOCKED` |
| Retry failed jobs | Status `FAILED`, retry count optional |
| Poison message | Simpan `embedding_error` |
| External API rate limit | Batch kecil + backoff |
| Idempotency | Update by chunk `id`, not by mutable fields |

---

## 11. Update embedding result

Setelah worker berhasil membuat embedding:

```sql
UPDATE semantic_search_chunks
SET
    embedding = :embedding::vector,
    embedding_status = 'EMBEDDED',
    embedding_error = NULL,
    embedded_at = now(),
    indexed_at = now(),
    updated_at = now()
WHERE id = :id
  AND embedding_dim = :expectedDim;
```

Jika gagal:

```sql
UPDATE semantic_search_chunks
SET
    embedding_status = 'FAILED',
    embedding_error = left(:errorMessage, 2000),
    updated_at = now()
WHERE id = :id;
```

Tambahkan retry count jika diperlukan:

```sql
ALTER TABLE semantic_search_chunks
ADD COLUMN embedding_retry_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN next_retry_at TIMESTAMPTZ;
```

Failure update:

```sql
UPDATE semantic_search_chunks
SET
    embedding_status = 'FAILED',
    embedding_error = left(:errorMessage, 2000),
    embedding_retry_count = embedding_retry_count + 1,
    next_retry_at = now() + make_interval(mins => least(60, power(2, embedding_retry_count)::int)),
    updated_at = now()
WHERE id = :id;
```

---

## 12. Search hanya chunk yang valid

Semantic search query harus hanya membaca row yang sudah embedded.

```sql
SELECT
    id,
    source_type,
    source_id,
    chunk_no,
    title,
    content,
    embedding <=> :queryEmbedding::vector AS distance,
    1 - (embedding <=> :queryEmbedding::vector) AS similarity
FROM semantic_search_chunks
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND visibility IN ('INTERNAL', 'PUBLIC')
  AND embedding_status = 'EMBEDDED'
  AND embedding_model = :embeddingModel
  AND embedding_model_version = :embeddingModelVersion
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT :limit;
```

Critical invariant:

```text
Query embedding dan stored embedding harus berasal dari vector space yang sama.
```

Jadi filter `embedding_model` dan `embedding_model_version` sering perlu eksplisit, terutama saat migration model berlangsung.

---

## 13. Model versioning strategy

### 13.1 Same table, multi-version coexistence

```text
semantic_search_chunks
├── model=v1 rows
└── model=v2 rows
```

Kelebihan:

| Kelebihan | Kekurangan |
|---|---|
| Migration lebih mudah | Table lebih besar |
| Bisa A/B test | Query harus filter model |
| Rollback mudah | Index per model mungkin perlu partial index |

Partial index bisa dibuat nanti:

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_v2_metadata
ON semantic_search_chunks (
    tenant_id,
    status,
    visibility,
    source_type
)
WHERE embedding_model_version = 'v2'
  AND embedding_status = 'EMBEDDED';
```

### 13.2 Separate table per model family

```text
semantic_search_chunks_v1
semantic_search_chunks_v2
```

Kelebihan:

| Kelebihan | Kekurangan |
|---|---|
| Isolasi jelas | Migration lebih kompleks |
| Index lebih bersih | Query layer harus route |
| Drop old model mudah | Schema duplication |

Practical recommendation:

```text
Mulai dari same table + explicit model filter.
Pindah ke separate table hanya jika volume/index lifecycle menuntut.
```

---

## 14. Re-embedding lifecycle

Saat embedding model berubah:

```text
1. Tambahkan config model baru
2. Generate chunk dengan embedding_model_version baru
3. Backfill embedding secara bertahap
4. Jalankan shadow search v1 vs v2
5. Bandingkan quality metrics
6. Switch read traffic ke v2
7. Retain v1 sementara untuk rollback
8. Cleanup v1 saat aman
```

Contoh status table:

```sql
CREATE TABLE embedding_model_registry (
    id                       BIGSERIAL PRIMARY KEY,
    provider                 TEXT NOT NULL,
    model                    TEXT NOT NULL,
    model_version            TEXT NOT NULL,
    embedding_dim            INTEGER NOT NULL,
    distance_metric          TEXT NOT NULL,
    status                   TEXT NOT NULL,
    active_for_query         BOOLEAN NOT NULL DEFAULT false,
    active_for_indexing      BOOLEAN NOT NULL DEFAULT false,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (provider, model, model_version),

    CONSTRAINT chk_embedding_model_status CHECK (
        status IN ('DRAFT', 'BACKFILLING', 'SHADOW', 'ACTIVE', 'DEPRECATED', 'DISABLED')
    ),

    CONSTRAINT chk_embedding_distance_metric CHECK (
        distance_metric IN ('COSINE', 'L2', 'INNER_PRODUCT')
    )
);
```

Query active model:

```sql
SELECT
    provider,
    model,
    model_version,
    embedding_dim,
    distance_metric
FROM embedding_model_registry
WHERE active_for_query = true
  AND status = 'ACTIVE'
LIMIT 1;
```

---

## 15. Chunk soft delete / stale cleanup

Jika source document berubah dan jumlah chunk berkurang, chunk lama perlu dinonaktifkan.

Misalnya pipeline menghasilkan chunk_no 1-4, tapi sebelumnya ada 1-7. Mark chunk 5-7 sebagai inactive:

```sql
UPDATE semantic_search_chunks
SET
    status = 'INACTIVE',
    embedding_status = 'DISABLED',
    updated_at = now()
WHERE tenant_id = :tenantId
  AND source_type = :sourceType
  AND source_id = :sourceId
  AND chunk_strategy = :chunkStrategy
  AND chunk_strategy_version = :chunkStrategyVersion
  AND embedding_model = :embeddingModel
  AND embedding_model_version = :embeddingModelVersion
  AND chunk_no > :maxCurrentChunkNo;
```

Practical rule:

```text
Jangan langsung hard delete embedding lama saat pipeline berubah.
Soft delete dulu agar rollback dan audit lebih mudah.
```

---

## 16. Attachment extraction boundary

Untuk attachment, jangan langsung berpikir embedding. Pisahkan tahap:

```text
attachment file
│
├── metadata extraction
├── text extraction / OCR
├── text cleanup
├── chunking
├── embedding
└── search indexing
```

Recommended table:

```sql
CREATE TABLE attachment_text_extractions (
    id                    BIGSERIAL PRIMARY KEY,
    tenant_id             BIGINT NOT NULL,
    attachment_id         BIGINT NOT NULL,
    extraction_engine     TEXT NOT NULL,
    extraction_version    TEXT NOT NULL,
    content_text          TEXT,
    content_hash          TEXT,
    extraction_status     TEXT NOT NULL DEFAULT 'PENDING',
    extraction_error      TEXT,
    extracted_at          TIMESTAMPTZ,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (
        tenant_id,
        attachment_id,
        extraction_engine,
        extraction_version
    ),

    CONSTRAINT chk_extraction_status CHECK (
        extraction_status IN ('PENDING', 'EXTRACTED', 'FAILED', 'STALE', 'DISABLED')
    )
);
```

Kenapa dipisah?

| Alasan | Manfaat |
|---|---|
| OCR/extraction bisa gagal | Retry terpisah |
| Extraction engine bisa berubah | Versioned pipeline |
| Content hash bisa dihitung sebelum embedding | Hindari re-embed |
| Attachment text bisa dipakai FTS juga | Hybrid-ready |
| Audit lebih jelas | Defensible pipeline |

---

## 17. Combining FTS and vector-ready storage

Agar siap untuk hybrid search seri 9, table chunk bisa punya FTS vector juga.

```sql
ALTER TABLE semantic_search_chunks
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(section_name, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
) STORED;
```

Index:

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_search_vector
ON semantic_search_chunks
USING GIN (search_vector);
```

PostgreSQL generated column current docs menjelaskan stored generated column dihitung saat write dan disimpan seperti kolom biasa, sedangkan virtual generated column dihitung saat read. Untuk search vector yang ingin di-index dan dipakai berulang, stored generated column tetap pola yang jelas untuk production. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-generated-columns.html?utm_source=chatgpt.com))

---

## 18. MyBatis mapper: upsert chunk

```xml
<insert id="upsertSemanticChunk">
    INSERT INTO semantic_search_chunks (
        tenant_id,
        source_type,
        source_id,
        source_version,
        source_updated_at,
        chunk_no,
        section_name,
        title,
        content,
        content_hash,
        token_count,
        chunk_strategy,
        chunk_strategy_version,
        embedding_provider,
        embedding_model,
        embedding_model_version,
        embedding_dim,
        embedding_status,
        visibility,
        status,
        language,
        updated_at
    )
    VALUES (
        #{tenantId},
        #{sourceType},
        #{sourceId},
        #{sourceVersion},
        #{sourceUpdatedAt},
        #{chunkNo},
        #{sectionName},
        #{title},
        #{content},
        #{contentHash},
        #{tokenCount},
        #{chunkStrategy},
        #{chunkStrategyVersion},
        #{embeddingProvider},
        #{embeddingModel},
        #{embeddingModelVersion},
        #{embeddingDim},
        'PENDING',
        #{visibility},
        'ACTIVE',
        #{language},
        now()
    )
    ON CONFLICT (
        tenant_id,
        source_type,
        source_id,
        chunk_no,
        chunk_strategy,
        chunk_strategy_version,
        embedding_provider,
        embedding_model,
        embedding_model_version
    )
    DO UPDATE SET
        source_version = EXCLUDED.source_version,
        source_updated_at = EXCLUDED.source_updated_at,
        section_name = EXCLUDED.section_name,
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        token_count = EXCLUDED.token_count,
        visibility = EXCLUDED.visibility,
        status = EXCLUDED.status,
        language = EXCLUDED.language,
        updated_at = now(),
        embedding_status = CASE
            WHEN semantic_search_chunks.content_hash &lt;&gt; EXCLUDED.content_hash
            THEN 'STALE'
            ELSE semantic_search_chunks.embedding_status
        END,
        content_hash = EXCLUDED.content_hash,
        embedding = CASE
            WHEN semantic_search_chunks.content_hash &lt;&gt; EXCLUDED.content_hash
            THEN NULL
            ELSE semantic_search_chunks.embedding
        END,
        embedded_at = CASE
            WHEN semantic_search_chunks.content_hash &lt;&gt; EXCLUDED.content_hash
            THEN NULL
            ELSE semantic_search_chunks.embedded_at
        END
</insert>
```

---

## 19. Java DTO: chunk indexing command

```java
package com.example.search.indexing;

import java.time.OffsetDateTime;

public record SemanticChunkUpsertCommand(
    long tenantId,
    String sourceType,
    long sourceId,
    Long sourceVersion,
    OffsetDateTime sourceUpdatedAt,
    int chunkNo,
    String sectionName,
    String title,
    String content,
    String contentHash,
    Integer tokenCount,
    String chunkStrategy,
    String chunkStrategyVersion,
    String embeddingProvider,
    String embeddingModel,
    String embeddingModelVersion,
    int embeddingDim,
    String visibility,
    String language
) {}
```

Mapper interface:

```java
package com.example.search.indexing;

public interface SemanticChunkIndexingMapper {
    void upsertSemanticChunk(SemanticChunkUpsertCommand command);
}
```

---

## 20. Java chunker sederhana

```java
package com.example.search.indexing;

import java.util.ArrayList;
import java.util.List;

public class SimpleParagraphChunker {

    private final int maxCharactersPerChunk;

    public SimpleParagraphChunker(int maxCharactersPerChunk) {
        if (maxCharactersPerChunk < 500) {
            throw new IllegalArgumentException("maxCharactersPerChunk too small");
        }
        this.maxCharactersPerChunk = maxCharactersPerChunk;
    }

    public List<TextChunk> chunk(String title, String content) {
        String normalized = normalize(content);
        if (normalized.isBlank()) {
            return List.of();
        }

        String[] paragraphs = normalized.split("\\n\\s*\\n");
        List<TextChunk> chunks = new ArrayList<>();

        StringBuilder current = new StringBuilder();
        int chunkNo = 1;

        for (String paragraph : paragraphs) {
            String p = paragraph.trim();
            if (p.isBlank()) {
                continue;
            }

            if (current.length() + p.length() + 2 > maxCharactersPerChunk
                    && current.length() > 0) {
                chunks.add(new TextChunk(chunkNo++, title, current.toString().trim()));
                current.setLength(0);
            }

            if (current.length() > 0) {
                current.append("\n\n");
            }
            current.append(p);
        }

        if (current.length() > 0) {
            chunks.add(new TextChunk(chunkNo, title, current.toString().trim()));
        }

        return chunks;
    }

    private String normalize(String raw) {
        if (raw == null) {
            return "";
        }

        return raw
            .replace("\r\n", "\n")
            .replace("\r", "\n")
            .replaceAll("[ \\t]+", " ")
            .trim();
    }

    public record TextChunk(
        int chunkNo,
        String title,
        String content
    ) {}
}
```

Catatan: chunker sederhana ini cukup untuk onboarding, tapi production untuk dokumen legal/regulatory sebaiknya berbasis struktur: heading, section, subsection, page, atau semantic boundary.

---

## 21. Indexing service pattern

```java
package com.example.search.indexing;

import java.time.OffsetDateTime;
import java.util.List;

public class SemanticIndexingService {

    private static final String CHUNK_STRATEGY = "paragraph-window";
    private static final String CHUNK_STRATEGY_VERSION = "v1";
    private static final String EMBEDDING_PROVIDER = "internal";
    private static final String EMBEDDING_MODEL = "text-embedding";
    private static final String EMBEDDING_MODEL_VERSION = "v1";
    private static final int EMBEDDING_DIM = 1536;

    private final SimpleParagraphChunker chunker;
    private final SemanticChunkIndexingMapper mapper;

    public SemanticIndexingService(
        SimpleParagraphChunker chunker,
        SemanticChunkIndexingMapper mapper
    ) {
        this.chunker = chunker;
        this.mapper = mapper;
    }

    public void indexArticle(
        long tenantId,
        long articleId,
        long sourceVersion,
        OffsetDateTime sourceUpdatedAt,
        String title,
        String content,
        String visibility,
        String language
    ) {
        List<SimpleParagraphChunker.TextChunk> chunks =
            chunker.chunk(title, content);

        for (SimpleParagraphChunker.TextChunk chunk : chunks) {
            String chunkContent = chunk.content();
            String contentHash = ContentHash.sha256(chunkContent);

            mapper.upsertSemanticChunk(
                new SemanticChunkUpsertCommand(
                    tenantId,
                    "ARTICLE",
                    articleId,
                    sourceVersion,
                    sourceUpdatedAt,
                    chunk.chunkNo(),
                    "body",
                    title,
                    chunkContent,
                    contentHash,
                    estimateTokenCount(chunkContent),
                    CHUNK_STRATEGY,
                    CHUNK_STRATEGY_VERSION,
                    EMBEDDING_PROVIDER,
                    EMBEDDING_MODEL,
                    EMBEDDING_MODEL_VERSION,
                    EMBEDDING_DIM,
                    visibility,
                    language
                )
            );
        }

        // Optional: call mapper to disable chunks with chunk_no > chunks.size()
    }

    private int estimateTokenCount(String text) {
        if (text == null || text.isBlank()) {
            return 0;
        }
        return Math.max(1, text.length() / 4);
    }
}
```

---

## 22. Worker mapper: claim pending chunks

```xml
<select id="claimPendingChunks" resultMap="EmbeddingJobMap">
    WITH picked AS (
        SELECT id
        FROM semantic_search_chunks
        WHERE embedding_status IN ('PENDING', 'STALE')
          AND status = 'ACTIVE'
          AND embedding IS NULL
        ORDER BY updated_at ASC
        LIMIT #{batchSize}
        FOR UPDATE SKIP LOCKED
    )
    SELECT
        s.id,
        s.tenant_id,
        s.source_type,
        s.source_id,
        s.chunk_no,
        s.title,
        s.content,
        s.embedding_provider,
        s.embedding_model,
        s.embedding_model_version,
        s.embedding_dim
    FROM semantic_search_chunks s
    JOIN picked p ON p.id = s.id
</select>
```

DTO:

```java
package com.example.search.embedding;

public record EmbeddingJob(
    long id,
    long tenantId,
    String sourceType,
    long sourceId,
    int chunkNo,
    String title,
    String content,
    String embeddingProvider,
    String embeddingModel,
    String embeddingModelVersion,
    int embeddingDim
) {}
```

---

## 23. Worker mapper: store embedding

```xml
<update id="markEmbedded">
    UPDATE semantic_search_chunks
    SET
        embedding = #{embeddingLiteral}::vector,
        embedding_status = 'EMBEDDED',
        embedding_error = NULL,
        embedded_at = now(),
        indexed_at = now(),
        updated_at = now()
    WHERE id = #{id}
      AND embedding_dim = #{embeddingDim}
</update>

<update id="markEmbeddingFailed">
    UPDATE semantic_search_chunks
    SET
        embedding_status = 'FAILED',
        embedding_error = left(#{errorMessage}, 2000),
        embedding_retry_count = embedding_retry_count + 1,
        next_retry_at = now() + make_interval(mins =&gt; least(60, power(2, embedding_retry_count)::int)),
        updated_at = now()
    WHERE id = #{id}
</update>
```

---

## 24. Embedding worker service

```java
package com.example.search.embedding;

import com.example.search.PgVectorLiteral;
import java.util.List;

public class EmbeddingWorkerService {

    private final EmbeddingJobMapper mapper;
    private final EmbeddingClient embeddingClient;

    public EmbeddingWorkerService(
        EmbeddingJobMapper mapper,
        EmbeddingClient embeddingClient
    ) {
        this.mapper = mapper;
        this.embeddingClient = embeddingClient;
    }

    public int processBatch(int batchSize) {
        List<EmbeddingJob> jobs = mapper.claimPendingChunks(batchSize);

        for (EmbeddingJob job : jobs) {
            try {
                float[] embedding = embeddingClient.embed(buildEmbeddingInput(job));
                validateDimension(embedding, job.embeddingDim());

                mapper.markEmbedded(
                    job.id(),
                    PgVectorLiteral.fromFloatArray(embedding),
                    job.embeddingDim()
                );
            } catch (Exception ex) {
                mapper.markEmbeddingFailed(
                    job.id(),
                    safeErrorMessage(ex)
                );
            }
        }

        return jobs.size();
    }

    private String buildEmbeddingInput(EmbeddingJob job) {
        return (job.title() == null ? "" : job.title())
            + "\n\n"
            + job.content();
    }

    private void validateDimension(float[] embedding, int expected) {
        if (embedding == null || embedding.length != expected) {
            throw new IllegalArgumentException(
                "Invalid embedding dimension. Expected " + expected
            );
        }
    }

    private String safeErrorMessage(Exception ex) {
        String message = ex.getMessage();
        if (message == null || message.isBlank()) {
            return ex.getClass().getSimpleName();
        }
        return message;
    }
}
```

---

## 25. Reconciliation query

Cari chunk yang stale atau belum embedded:

```sql
SELECT
    embedding_status,
    count(*) AS count
FROM semantic_search_chunks
GROUP BY embedding_status
ORDER BY count DESC;
```

Cari source dengan chunk campur model:

```sql
SELECT
    tenant_id,
    source_type,
    source_id,
    count(DISTINCT embedding_model_version) AS model_versions
FROM semantic_search_chunks
WHERE status = 'ACTIVE'
GROUP BY tenant_id, source_type, source_id
HAVING count(DISTINCT embedding_model_version) > 1
ORDER BY model_versions DESC;
```

Cari embedding null yang seharusnya embedded:

```sql
SELECT
    id,
    tenant_id,
    source_type,
    source_id,
    chunk_no,
    embedding_status,
    embedding_error
FROM semantic_search_chunks
WHERE status = 'ACTIVE'
  AND embedding_status = 'EMBEDDED'
  AND embedding IS NULL
LIMIT 100;
```

---

## 26. Data quality checks

| Check | Query / signal | Expected |
|---|---|---|
| Null embedding | `embedding_status='EMBEDDED' AND embedding IS NULL` | 0 |
| Wrong dim | App validation + DB type | 0 |
| Stale chunks | `embedding_status='STALE'` | Temporary only |
| Failed chunks | `embedding_status='FAILED'` | Monitored |
| Duplicate chunk identity | Unique constraint | 0 |
| Mixed model in query | Explicit model filter | Controlled |
| Deleted source still active | Reconciliation with source table | 0 |
| Empty content | `length(content)=0` | 0 |
| Huge chunk | `token_count > threshold` | Investigate |
| Too many chunks/source | source-level distribution | Investigate |

---

## 27. Observability metrics

Minimal metrics:

```text
embedding.chunk.created.count
embedding.chunk.stale.count
embedding.job.pending.count
embedding.job.failed.count
embedding.job.retry.count
embedding.job.duration.p95
embedding.provider.latency.p95
embedding.provider.error.rate
embedding.row.embedded.count
embedding.model.active.version
semantic_search.embedded.coverage.percent
```

Coverage query:

```sql
SELECT
    source_type,
    embedding_model_version,
    count(*) FILTER (WHERE embedding_status = 'EMBEDDED') AS embedded_count,
    count(*) AS total_count,
    round(
        100.0 * count(*) FILTER (WHERE embedding_status = 'EMBEDDED')
        / nullif(count(*), 0),
        2
    ) AS embedded_percent
FROM semantic_search_chunks
WHERE status = 'ACTIVE'
GROUP BY source_type, embedding_model_version
ORDER BY source_type, embedding_model_version;
```

---

## 28. Filtered vector search warning

Saat nanti memakai approximate index, filter metadata seperti `tenant_id`, `status`, `category`, atau `source_type` perlu diuji serius. pgvector 0.8.0 menambahkan **iterative index scans** untuk membantu kasus approximate index + filtering: jika scan awal belum memenuhi filter, index scan bisa lanjut sampai cukup result ditemukan atau mencapai batas konfigurasi. ([PostgreSQL](https://www.postgresql.org/about/news/pgvector-080-released-2952/?utm_source=chatgpt.com))

Ini alasan kenapa sejak desain storage kita selalu menyimpan metadata filter eksplisit:

```text
tenant_id
status
visibility
source_type
language
embedding_model_version
```

Tanpa metadata yang baik, ANN index tuning nanti akan sulit.

---

## 29. Anti-pattern

| Anti-pattern | Dampak | Solusi |
|---|---|---|
| Embedding langsung di tabel domain utama | Sulit multi-version dan re-embedding | Pakai projection table |
| Tidak simpan `embedding_model_version` | Query campur vector space | Filter model/version |
| Tidak punya `content_hash` | Re-embed boros atau stale | Hash per chunk |
| Chunk pakai random ID | Tidak idempotent | Deterministic chunk identity |
| Hard delete embedding lama saat rollout | Rollback sulit | Soft delete / disable |
| Tidak ada worker status | Retry tidak jelas | `PENDING/EMBEDDED/FAILED/STALE` |
| Embedding attachment tanpa extraction table | Pipeline sulit diaudit | Pisahkan extraction dan embedding |
| Tidak simpan source metadata | Result sulit trace | `source_type/source_id/chunk_no` |
| Search row `FAILED/PENDING` | Result rusak/null | Filter `EMBEDDED` |
| Langsung ANN index tanpa exact baseline | Recall tidak terukur | Exact search benchmark dulu |

---

## 30. Checklist Seri 6

| Checklist | Target |
|---|---|
| Embedding disimpan di projection/chunk table | Ya |
| Chunk identity deterministic | Ya |
| `content_hash` ada | Ya |
| `embedding_model_version` ada | Ya |
| `embedding_status` ada | Ya |
| Idempotent upsert tersedia | Ya |
| Worker claim pakai `FOR UPDATE SKIP LOCKED` | Ya |
| Failed/retry path tersedia | Ya |
| Source deletion/stale cleanup tersedia | Ya |
| Attachment extraction dipisah dari embedding | Ya |
| Query search hanya membaca `EMBEDDED` row | Ya |
| Metadata filter lengkap | Ya |
| Re-embedding lifecycle jelas | Ya |
| Observability dan reconciliation query tersedia | Ya |

---

## Seri 6 selesai

Seri berikutnya:

**Seri 7/10 - Vector Indexing: Exact Search, HNSW, IVFFlat, Recall vs Latency**

Fokusnya: kapan exact search cukup, kapan perlu HNSW/IVFFlat, cara membuat index pgvector, tuning `hnsw.ef_search`, `ivfflat.probes`, build memory, recall benchmark, dan jebakan filtering + approximate nearest neighbor.

---

**Sources:**

- [pgvector/pgvector: Open-source vector similarity search for ...](https://github.com/pgvector/pgvector?utm_source=chatgpt.com)
- [Documentation: 18: 5.4. Generated Columns](https://www.postgresql.org/docs/current/ddl-generated-columns.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:14:48 PM

# Seri 7/10 - Vector Indexing: Exact Search, HNSW, IVFFlat, Recall vs Latency

Seri ini fokus pada **kapan vector search PostgreSQL cukup dengan exact search**, kapan perlu **approximate nearest neighbor / ANN index**, bagaimana memakai **HNSW** dan **IVFFlat**, serta cara mengukur **recall vs latency** supaya tuning tidak spekulatif.

pgvector default-nya melakukan **exact nearest-neighbor search** tanpa approximate index. Index seperti HNSW dan IVFFlat dipakai ketika data/latency/QPS sudah menuntut trade-off: query lebih cepat, tetapi recall bisa tidak 100%. pgvector mendukung HNSW dan IVFFlat untuk approximate nearest-neighbor search, dengan trade-off yang berbeda. ([GitHub](https://github.com/pgvector/pgvector?utm_source=chatgpt.com))

---

## 1. Core idea

Vector search punya 3 level maturity:

```text
Level 1 - Exact Search
PostgreSQL scan/filter + ORDER BY distance LIMIT k
Recall 100%, latency naik saat data membesar

Level 2 - ANN Index
HNSW / IVFFlat
Latency lebih rendah, recall perlu diukur

Level 3 - Filtered + Tuned ANN
Tenant/status/category/date filter + iterative scan + partition/partial index
Production-grade untuk multi-tenant enterprise search
```

Practical rule:

```text
Jangan membuat HNSW/IVFFlat sebelum punya exact-search baseline.
```

Kalau baseline exact belum ada, kita tidak tahu apakah hasil buruk disebabkan oleh embedding model, chunking, distance metric, metadata filter, atau ANN index.

---

## 2. Mental model

```text
semantic_search_chunks
│
├── Exact vector search
│   ├── no vector ANN index
│   ├── ORDER BY embedding <=> query_embedding
│   ├── recall 100%
│   └── slower at scale
│
├── HNSW index
│   ├── graph-based ANN
│   ├── better speed-recall tradeoff than IVFFlat in many pgvector docs/examples
│   ├── slower build
│   ├── more memory
│   └── no training step
│
├── IVFFlat index
│   ├── inverted-list ANN
│   ├── needs data before build/training
│   ├── faster/lighter build than HNSW
│   ├── tune lists/probes
│   └── recall depends heavily on probes
│
└── Filtered ANN
    ├── tenant_id/status/source_type filters
    ├── filter may apply after ANN scan
    ├── can return fewer rows than LIMIT
    ├── partial index / partitioning may help
    └── pgvector 0.8+ iterative scan can scan further
```

---

## 3. Baseline table

Kita lanjutkan table dari seri 6.

```sql
CREATE TABLE semantic_search_chunks (
    id                       BIGSERIAL PRIMARY KEY,
    tenant_id                BIGINT NOT NULL,

    source_type              TEXT NOT NULL,
    source_id                BIGINT NOT NULL,
    chunk_no                 INTEGER NOT NULL,

    section_name             TEXT,
    title                    TEXT,
    content                  TEXT NOT NULL,

    embedding_provider       TEXT NOT NULL,
    embedding_model          TEXT NOT NULL,
    embedding_model_version  TEXT NOT NULL,
    embedding_dim            INTEGER NOT NULL,
    embedding                vector(1536),

    embedding_status         TEXT NOT NULL DEFAULT 'PENDING',
    visibility               TEXT NOT NULL DEFAULT 'INTERNAL',
    status                   TEXT NOT NULL DEFAULT 'ACTIVE',
    language                 TEXT NOT NULL DEFAULT 'en',

    created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Metadata index tetap penting:

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_filter
ON semantic_search_chunks (
    tenant_id,
    status,
    visibility,
    source_type,
    embedding_model_version
)
WHERE embedding_status = 'EMBEDDED';
```

Vector index mempercepat distance search, tetapi metadata filter tetap perlu index relational sendiri.

---

## 4. Exact search baseline

Exact search:

```sql
SELECT
    id,
    source_type,
    source_id,
    chunk_no,
    title,
    content,
    embedding <=> :queryEmbedding::vector AS distance,
    1 - (embedding <=> :queryEmbedding::vector) AS similarity
FROM semantic_search_chunks
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND visibility IN ('INTERNAL', 'PUBLIC')
  AND embedding_status = 'EMBEDDED'
  AND embedding_model_version = :embeddingModelVersion
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT :limit;
```

Untuk cosine distance, semakin kecil `embedding <=> query_vector`, semakin dekat. Jika ingin similarity display, bisa pakai `1 - distance`, tetapi untuk indexable ordering tetap gunakan `ORDER BY embedding <=> query_vector LIMIT k`. pgvector README menekankan query nearest-neighbor indexable memakai distance operator langsung di `ORDER BY` dengan `LIMIT`. ([GitHub](https://github.com/pgvector/pgvector?utm_source=chatgpt.com))

---

## 5. Kapan exact search cukup?

Exact search bisa cukup kalau:

| Kondisi | Exact search masih masuk akal |
|---|---|
| Jumlah embedded chunks kecil | Misalnya ribuan sampai puluhan ribu |
| Query frequency rendah | Internal admin tool / low QPS |
| Filter sangat selektif | Per tenant hanya sedikit chunk |
| Recall harus 100% | Audit, legal, regulatory defensibility |
| Latency masih memenuhi SLO | p95 masih aman |
| ANN recall belum divalidasi | Wajib exact dulu |

Query untuk melihat ukuran kandidat per tenant/model:

```sql
SELECT
    tenant_id,
    embedding_model_version,
    count(*) AS embedded_chunks
FROM semantic_search_chunks
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
GROUP BY tenant_id, embedding_model_version
ORDER BY embedded_chunks DESC
LIMIT 20;
```

Practical decision:

```text
Kalau per-tenant candidate hanya 5.000-20.000 rows dan latency masih aman, exact search mungkin lebih defensible daripada ANN.
```

---

## 6. Kapan mulai butuh ANN index?

Mulai evaluasi HNSW/IVFFlat kalau:

| Signal | Artinya |
|---|---|
| p95/p99 exact search mulai melewati SLO | Butuh ANN |
| Candidate per filter besar | Exact scan/sort mahal |
| QPS semantic search naik | CPU pressure |
| Top-k kecil tapi corpus besar | ANN cocok |
| Query banyak tanpa filter sangat selektif | Exact makin berat |
| RAG retrieval butuh latency rendah | ANN biasanya perlu |

Tapi tetap ukur recall. ANN yang cepat tetapi sering melewatkan dokumen penting bisa berbahaya untuk case/regulatory search.

---

## 7. HNSW overview

HNSW membuat multilayer graph untuk approximate nearest-neighbor search. pgvector README menyatakan HNSW biasanya punya query performance lebih baik daripada IVFFlat dalam speed-recall trade-off, tetapi build lebih lambat dan memakai lebih banyak memory; HNSW juga tidak membutuhkan training step, sehingga index bisa dibuat sebelum data ada. ([GitHub](https://github.com/pgvector/pgvector/blob/master/README.md?utm_source=chatgpt.com))

### 7.1 HNSW cosine index

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_embedding_hnsw_cosine
ON semantic_search_chunks
USING hnsw (embedding vector_cosine_ops)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1';
```

Untuk operator class:

| Distance | Operator | HNSW operator class |
|---|---|---|
| L2 | `<->` | `vector_l2_ops` |
| Inner product | `<#>` | `vector_ip_ops` |
| Cosine | `<=>` | `vector_cosine_ops` |
| L1 | `<+>` | `vector_l1_ops` |

Buat index sesuai distance metric yang benar untuk embedding model. Jangan membuat cosine index lalu query dengan L2.

---

## 8. HNSW build options

Contoh:

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_embedding_hnsw_cosine
ON semantic_search_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (
    m = 16,
    ef_construction = 64
)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1';
```

Makna praktis:

| Option | Fungsi | Trade-off |
|---|---|---|
| `m` | Jumlah koneksi maksimum per layer graph | Lebih tinggi bisa menaikkan recall, tapi memory/build cost naik |
| `ef_construction` | Candidate list saat build graph | Lebih tinggi bisa menaikkan kualitas index, build lebih lambat |
| `hnsw.ef_search` | Candidate list saat query | Lebih tinggi bisa menaikkan recall, query lebih lambat |

pgvector README mendokumentasikan `m`, `ef_construction`, dan `hnsw.ef_search` sebagai parameter HNSW, dengan contoh `SET hnsw.ef_search = 100` untuk menaikkan dynamic candidate list saat search. ([GitHub](https://github.com/pgvector/pgvector/blob/master/README.md?utm_source=chatgpt.com))

---

## 9. HNSW query tuning

Default query:

```sql
SELECT
    id,
    title,
    embedding <=> :queryEmbedding::vector AS distance
FROM semantic_search_chunks
WHERE tenant_id = :tenantId
  AND embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1'
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT 10;
```

Tuning per transaction:

```sql
BEGIN;

SET LOCAL hnsw.ef_search = 100;

SELECT
    id,
    title,
    embedding <=> :queryEmbedding::vector AS distance
FROM semantic_search_chunks
WHERE tenant_id = :tenantId
  AND embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1'
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT 10;

COMMIT;
```

Practical rule:

```text
Naikkan hnsw.ef_search untuk recall.
Turunkan hnsw.ef_search untuk latency.
Ukur keduanya, jangan pilih berdasarkan feeling.
```

---

## 10. IVFFlat overview

IVFFlat membagi vector ke beberapa list/cluster, lalu query mencari hanya subset list terdekat. pgvector README menyatakan IVFFlat punya build lebih cepat dan memakai memory lebih sedikit daripada HNSW, tetapi query performance biasanya lebih rendah dalam speed-recall trade-off; IVFFlat juga membutuhkan training step, sehingga index sebaiknya dibuat setelah tabel punya data. ([GitHub](https://github.com/pgvector/pgvector/blob/master/README.md?utm_source=chatgpt.com))

### 10.1 IVFFlat cosine index

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_embedding_ivfflat_cosine
ON semantic_search_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1';
```

---

## 11. IVFFlat tuning

| Option | Fungsi | Trade-off |
|---|---|---|
| `lists` | Jumlah cluster/list saat index build | Terlalu kecil: recall buruk; terlalu besar: build/index lebih mahal |
| `ivfflat.probes` | Berapa list discan saat query | Lebih tinggi: recall naik, latency naik |

Contoh query dengan probes:

```sql
BEGIN;

SET LOCAL ivfflat.probes = 10;

SELECT
    id,
    title,
    embedding <=> :queryEmbedding::vector AS distance
FROM semantic_search_chunks
WHERE tenant_id = :tenantId
  AND embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1'
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT 10;

COMMIT;
```

Practical rule:

```text
IVFFlat tuning = lists saat build + probes saat query.
HNSW tuning = m/ef_construction saat build + ef_search saat query.
```

---

## 12. HNSW vs IVFFlat decision matrix

| Kebutuhan | Pilihan awal |
|---|---|
| Best practical speed-recall | HNSW |
| Index bisa dibuat sebelum data ada | HNSW |
| Build lebih ringan / memory lebih rendah | IVFFlat |
| Corpus besar tapi update relatif stabil | HNSW atau IVFFlat, benchmark |
| Banyak rebuild saat re-embedding | IVFFlat bisa dipertimbangkan |
| Query filtered multi-tenant | HNSW + iterative scan / partition / partial index; tetap benchmark |
| Recall sangat penting | Exact baseline + HNSW tuned, atau exact untuk subset kecil |
| Simplicity awal | Exact search dulu |

HNSW sering menjadi pilihan awal untuk pgvector production search karena speed-recall trade-off-nya baik, tetapi pada workload tertentu IVFFlat bisa lebih masuk akal, terutama bila build/rebuild cost dan memory menjadi constraint. pgvector sendiri menyajikan keduanya sebagai approximate index dengan trade-off berbeda. ([GitHub](https://github.com/pgvector/pgvector/blob/master/README.md?utm_source=chatgpt.com))

---

## 13. Build-time tuning

Untuk HNSW build besar, perhatikan memory.

```sql
SET maintenance_work_mem = '2GB';
SET max_parallel_maintenance_workers = 4;
```

Lalu:

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_embedding_hnsw_cosine
ON semantic_search_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1';
```

pgvector README menyebut HNSW index build jauh lebih cepat ketika graph muat di `maintenance_work_mem`, tetapi jangan menyetel memory terlalu tinggi sampai menghabiskan RAM server. README juga mendokumentasikan penggunaan parallel maintenance workers untuk mempercepat index build. ([GitHub](https://github.com/pgvector/pgvector/blob/master/README.md?utm_source=chatgpt.com))

Practical warning:

```text
CREATE INDEX CONCURRENTLY lebih aman untuk production traffic, tetapi lebih lambat.
CREATE INDEX biasa lebih cepat, tetapi lebih blocking.
```

---

## 14. Index per model version

Jangan satu ANN index mencampur embedding model version yang berbeda.

Partial index per active model:

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_hnsw_v1_cosine
ON semantic_search_chunks
USING hnsw (embedding vector_cosine_ops)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1';
```

Saat model `v2` masuk:

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_hnsw_v2_cosine
ON semantic_search_chunks
USING hnsw (embedding vector_cosine_ops)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v2';
```

Query harus filter versi:

```sql
AND embedding_model_version = :embeddingModelVersion
```

Invariant:

```text
ANN index harus align dengan vector space yang sama.
```

---

## 15. Filtered ANN problem

Ini bagian penting untuk enterprise/multi-tenant.

Query seperti ini terlihat benar:

```sql
SELECT
    id,
    title,
    embedding <=> :queryEmbedding::vector AS distance
FROM semantic_search_chunks
WHERE tenant_id = :tenantId
  AND source_type = 'ARTICLE'
  AND status = 'ACTIVE'
  AND embedding_status = 'EMBEDDED'
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT 10;
```

Tetapi pada approximate index, filter bisa diterapkan setelah index scan. Akibatnya, index mengambil kandidat nearest-neighbor global terlebih dahulu, lalu filter tenant/status/source_type diterapkan setelah itu. pgvector README menjelaskan bahwa dengan approximate indexes, query dengan filtering dapat mengembalikan hasil lebih sedikit karena filtering diterapkan setelah index scan. ([GitHub](https://github.com/pgvector/pgvector?utm_source=chatgpt.com))

Contoh konsekuensi:

```text
hnsw.ef_search = 40
tenant filter match rate = 10%

Expected matching rows from initial candidate ≈ 4
LIMIT 10 mungkin tidak terpenuhi
```

Ini bukan bug SQL; ini nature filtered ANN.

---

## 16. Solusi filtered ANN

### 16.1 Naikkan `hnsw.ef_search`

```sql
BEGIN;

SET LOCAL hnsw.ef_search = 200;

SELECT ...
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT 10;

COMMIT;
```

Trade-off:

| Efek | Dampak |
|---|---|
| Candidate lebih banyak | Recall/filter hit lebih baik |
| Query lebih lambat | CPU/latency naik |
| Bisa tetap tidak cukup | Jika filter sangat selektif |

---

### 16.2 Iterative index scan pgvector 0.8+

pgvector 0.8.0 menambahkan **iterative index scans**: jika hasil awal belum memenuhi filter, scan dapat dilanjutkan sampai cukup result ditemukan atau mencapai limit internal seperti `hnsw.max_scan_tuples` atau `ivfflat.max_probes`. Ini bisa diaktifkan dengan `hnsw.iterative_scan` atau `ivfflat.iterative_scan`. ([GitHub](https://github.com/pgvector/pgvector?utm_source=chatgpt.com))

HNSW:

```sql
BEGIN;

SET LOCAL hnsw.iterative_scan = 'strict_order';
SET LOCAL hnsw.ef_search = 100;
SET LOCAL hnsw.max_scan_tuples = 20000;

SELECT
    id,
    title,
    embedding <=> :queryEmbedding::vector AS distance
FROM semantic_search_chunks
WHERE tenant_id = :tenantId
  AND source_type = 'ARTICLE'
  AND status = 'ACTIVE'
  AND embedding_status = 'EMBEDDED'
  AND embedding_model_version = 'v1'
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT 10;

COMMIT;
```

IVFFlat:

```sql
BEGIN;

SET LOCAL ivfflat.iterative_scan = 'strict_order';
SET LOCAL ivfflat.probes = 10;
SET LOCAL ivfflat.max_probes = 100;

SELECT
    id,
    title,
    embedding <=> :queryEmbedding::vector AS distance
FROM semantic_search_chunks
WHERE tenant_id = :tenantId
  AND source_type = 'ARTICLE'
  AND status = 'ACTIVE'
  AND embedding_status = 'EMBEDDED'
  AND embedding_model_version = 'v1'
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT 10;

COMMIT;
```

Use `strict_order` kalau ordering distance harus lebih akurat; `relaxed_order` bisa lebih cepat tetapi ordering bisa kurang strict. pgvector README menyebut iterative scans mendukung strict dan relaxed ordering. ([GitHub](https://github.com/pgvector/pgvector?utm_source=chatgpt.com))

---

### 16.3 Partial index untuk filter tetap

Kalau filter sering tetap, partial index bisa membantu.

Misalnya search hanya artikel published:

```sql
CREATE INDEX CONCURRENTLY idx_semantic_articles_hnsw_v1
ON semantic_search_chunks
USING hnsw (embedding vector_cosine_ops)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND visibility = 'PUBLIC'
  AND source_type = 'ARTICLE'
  AND embedding_model_version = 'v1';
```

Query:

```sql
SELECT
    id,
    title,
    embedding <=> :queryEmbedding::vector AS distance
FROM semantic_search_chunks
WHERE source_type = 'ARTICLE'
  AND visibility = 'PUBLIC'
  AND status = 'ACTIVE'
  AND embedding_status = 'EMBEDDED'
  AND embedding_model_version = 'v1'
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT 10;
```

Partial index cocok kalau filter domain relatif stabil dan cardinality tidak terlalu banyak.

---

### 16.4 Partitioning untuk tenant/source besar

Jika ada tenant besar atau source type besar:

```sql
CREATE TABLE semantic_search_chunks_partitioned (
    LIKE semantic_search_chunks INCLUDING ALL
) PARTITION BY LIST (tenant_id);
```

Contoh partition:

```sql
CREATE TABLE semantic_search_chunks_tenant_1001
PARTITION OF semantic_search_chunks_partitioned
FOR VALUES IN (1001);
```

Index per partition:

```sql
CREATE INDEX idx_semantic_chunks_t1001_hnsw_v1
ON semantic_search_chunks_tenant_1001
USING hnsw (embedding vector_cosine_ops)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1';
```

Partitioning cocok jika:

| Kondisi | Partitioning membantu |
|---|---|
| Tenant besar sangat dominan | Ya |
| Tenant isolation kuat | Ya |
| ANN recall terganggu filter tenant | Ya |
| Jumlah tenant ribuan kecil-kecil | Hati-hati, terlalu banyak partition |
| Operasional index per tenant siap | Ya jika dikelola |

---

## 17. Recall benchmark

ANN tuning tanpa recall benchmark itu spekulasi.

Target benchmark:

```text
Bandingkan top-k exact search vs top-k ANN search untuk query sample nyata.
```

### 17.1 Buat tabel query benchmark

```sql
CREATE TABLE vector_search_benchmark_queries (
    id                  BIGSERIAL PRIMARY KEY,
    tenant_id           BIGINT NOT NULL,
    query_text          TEXT NOT NULL,
    query_embedding     vector(1536) NOT NULL,
    source_type_filter  TEXT[],
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 17.2 Exact result table

```sql
CREATE TABLE vector_search_exact_results (
    benchmark_query_id  BIGINT NOT NULL,
    rank_no             INTEGER NOT NULL,
    chunk_id            BIGINT NOT NULL,
    distance            DOUBLE PRECISION NOT NULL,
    PRIMARY KEY (benchmark_query_id, rank_no)
);
```

### 17.3 ANN result table

```sql
CREATE TABLE vector_search_ann_results (
    benchmark_query_id  BIGINT NOT NULL,
    index_name          TEXT NOT NULL,
    setting_name        TEXT NOT NULL,
    rank_no             INTEGER NOT NULL,
    chunk_id            BIGINT NOT NULL,
    distance            DOUBLE PRECISION NOT NULL,
    duration_ms         DOUBLE PRECISION,
    PRIMARY KEY (benchmark_query_id, index_name, setting_name, rank_no)
);
```

---

## 18. Generate exact top-k

Untuk exact benchmark, paksa planner tidak memakai ANN index saat perlu membandingkan. Salah satu pattern praktis adalah menjalankan query dalam transaction dengan index scan dimatikan sementara untuk baseline pembanding. pgvector README juga menunjukkan pola membandingkan approximate search dengan exact search memakai setting lokal seperti `enable_indexscan = off`. ([GitHub](https://github.com/pgvector/pgvector?utm_source=chatgpt.com))

```sql
BEGIN;

SET LOCAL enable_indexscan = off;

INSERT INTO vector_search_exact_results (
    benchmark_query_id,
    rank_no,
    chunk_id,
    distance
)
SELECT
    b.id AS benchmark_query_id,
    row_number() OVER (
        PARTITION BY b.id
        ORDER BY c.embedding <=> b.query_embedding
    ) AS rank_no,
    c.id AS chunk_id,
    c.embedding <=> b.query_embedding AS distance
FROM vector_search_benchmark_queries b
JOIN semantic_search_chunks c
  ON c.tenant_id = b.tenant_id
WHERE c.embedding_status = 'EMBEDDED'
  AND c.status = 'ACTIVE'
  AND c.embedding_model_version = 'v1'
  AND (
        b.source_type_filter IS NULL
        OR c.source_type = ANY(b.source_type_filter)
  )
ORDER BY b.id, distance
LIMIT 1000;

COMMIT;
```

Untuk produksi benchmark yang lebih rapi, generate exact result per query satu per satu supaya `LIMIT` tidak salah secara global.

---

## 19. Recall@k calculation

Recall@10:

```sql
WITH exact_topk AS (
    SELECT
        benchmark_query_id,
        chunk_id
    FROM vector_search_exact_results
    WHERE rank_no <= 10
),
ann_topk AS (
    SELECT
        benchmark_query_id,
        index_name,
        setting_name,
        chunk_id
    FROM vector_search_ann_results
    WHERE rank_no <= 10
)
SELECT
    a.index_name,
    a.setting_name,
    count(*) FILTER (WHERE e.chunk_id IS NOT NULL)::double precision
        / nullif(count(*), 0) AS recall_at_10
FROM ann_topk a
LEFT JOIN exact_topk e
  ON e.benchmark_query_id = a.benchmark_query_id
 AND e.chunk_id = a.chunk_id
GROUP BY a.index_name, a.setting_name
ORDER BY recall_at_10 DESC;
```

Interpretasi:

| Recall@10 | Arti |
|---:|---|
| `1.00` | ANN top-10 sama dengan exact top-10 |
| `0.90` | 9 dari 10 exact result muncul di ANN |
| `0.70` | Banyak miss; tuning/strategy perlu diperbaiki |
| `<0.50` | Tidak layak untuk search penting |

Untuk RAG atau knowledge search, recall sering lebih penting daripada ranking internal urutan pertama, karena reranker bisa memperbaiki urutan setelah kandidat diambil.

---

## 20. Latency benchmark

Gunakan `EXPLAIN (ANALYZE, BUFFERS)`:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    id,
    title,
    embedding <=> '[...]'::vector AS distance
FROM semantic_search_chunks
WHERE tenant_id = 1001
  AND embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1'
ORDER BY embedding <=> '[...]'::vector
LIMIT 10;
```

Yang dicari:

| Signal | Interpretasi |
|---|---|
| ANN index scan muncul | Index dipakai |
| Seq scan muncul | Index tidak dipakai / planner memilih exact |
| Buffers tinggi | Working set besar |
| Rows returned < LIMIT | Filtered ANN problem |
| Planning time tinggi | Query/partition/index terlalu kompleks |
| Execution time stabil | Kandidat/filter cukup baik |
| p99 tinggi | Perlu tuning memory, ef/probes, filter strategy |

---

## 21. Query pattern yang index-friendly

Baik:

```sql
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT 10
```

Buruk untuk ANN index usage:

```sql
ORDER BY 1 - (embedding <=> :queryEmbedding::vector) DESC
LIMIT 10
```

Baik:

```sql
SELECT
    id,
    embedding <=> :queryEmbedding::vector AS distance,
    1 - (embedding <=> :queryEmbedding::vector) AS similarity
FROM semantic_search_chunks
WHERE ...
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT 10;
```

Distance operator langsung tetap dipakai di `ORDER BY`, similarity hanya untuk output.

---

## 22. MyBatis mapper: HNSW with query setting

Karena `SET LOCAL` harus berada dalam transaction, service layer perlu memastikan mapper call berjalan dalam transaction.

### 22.1 Mapper XML

```xml
<select id="semanticSearchHnsw" resultMap="SemanticSearchResultMap">
    SELECT
        c.id,
        c.source_type,
        c.source_id,
        c.chunk_no,
        c.title,
        c.content,
        c.embedding &lt;=&gt; #{queryEmbedding}::vector AS distance,
        1 - (c.embedding &lt;=&gt; #{queryEmbedding}::vector) AS similarity
    FROM semantic_search_chunks c
    WHERE c.tenant_id = #{tenantId}
      AND c.embedding_status = 'EMBEDDED'
      AND c.status = 'ACTIVE'
      AND c.visibility IN ('INTERNAL', 'PUBLIC')
      AND c.embedding_model_version = #{embeddingModelVersion}

      <if test="sourceTypes != null and sourceTypes.size() > 0">
        AND c.source_type IN
        <foreach collection="sourceTypes"
                 item="sourceType"
                 open="("
                 separator=","
                 close=")">
            #{sourceType}
        </foreach>
      </if>

    ORDER BY c.embedding &lt;=&gt; #{queryEmbedding}::vector
    LIMIT #{limit}
</select>
```

### 22.2 Mapper untuk setting lokal

```xml
<update id="setHnswEfSearch">
    SET LOCAL hnsw.ef_search = ${efSearch}
</update>

<update id="setHnswIterativeScan">
    SET LOCAL hnsw.iterative_scan = '${mode}'
</update>

<update id="setHnswMaxScanTuples">
    SET LOCAL hnsw.max_scan_tuples = ${maxScanTuples}
</update>
```

Important MyBatis warning:

```text
${} adalah string substitution, bukan parameter binding.
Jangan isi dari user input langsung.
Gunakan enum/whitelist di service layer.
```

Lebih aman buat method khusus dengan nilai fixed:

```xml
<update id="setHnswProductionProfile">
    SET LOCAL hnsw.iterative_scan = 'strict_order';
    SET LOCAL hnsw.ef_search = 100;
    SET LOCAL hnsw.max_scan_tuples = 20000;
</update>
```

Namun beberapa driver/config tidak mengizinkan multi-statement dalam satu call. Kalau begitu pisahkan menjadi beberapa mapper method.

---

## 23. Java service pattern

```java
package com.example.search;

import java.util.List;
import java.util.Set;

public class SemanticSearchService {

    private static final int EXPECTED_DIMENSION = 1536;
    private static final int DEFAULT_LIMIT = 10;
    private static final int MAX_LIMIT = 30;

    private static final Set<String> ALLOWED_SOURCE_TYPES = Set.of(
        "CASE",
        "ARTICLE",
        "ATTACHMENT",
        "DECISION"
    );

    private final EmbeddingClient embeddingClient;
    private final SemanticSearchMapper mapper;

    public SemanticSearchService(
        EmbeddingClient embeddingClient,
        SemanticSearchMapper mapper
    ) {
        this.embeddingClient = embeddingClient;
        this.mapper = mapper;
    }

    // Must run inside one DB transaction if SET LOCAL is used.
    public List<SemanticSearchResult> searchWithHnsw(
        long tenantId,
        String rawQuery,
        List<String> requestedSourceTypes,
        Integer requestedLimit
    ) {
        String query = normalize(rawQuery);
        if (query.isBlank()) {
            return List.of();
        }

        int limit = sanitizeLimit(requestedLimit);
        List<String> sourceTypes = sanitizeSourceTypes(requestedSourceTypes);

        float[] embedding = embeddingClient.embed(query);
        validateDimension(embedding, EXPECTED_DIMENSION);

        String vectorLiteral = PgVectorLiteral.fromFloatArray(embedding);

        mapper.setHnswIterativeScanStrictOrder();
        mapper.setHnswEfSearch(100);
        mapper.setHnswMaxScanTuples(20_000);

        return mapper.semanticSearchHnsw(
            tenantId,
            vectorLiteral,
            "v1",
            sourceTypes,
            limit
        );
    }

    private String normalize(String raw) {
        if (raw == null) {
            return "";
        }
        return raw.trim().replaceAll("\\s+", " ");
    }

    private int sanitizeLimit(Integer requestedLimit) {
        if (requestedLimit == null) {
            return DEFAULT_LIMIT;
        }
        return Math.min(Math.max(requestedLimit, 1), MAX_LIMIT);
    }

    private List<String> sanitizeSourceTypes(List<String> sourceTypes) {
        if (sourceTypes == null || sourceTypes.isEmpty()) {
            return List.of("ARTICLE", "CASE");
        }

        return sourceTypes.stream()
            .filter(ALLOWED_SOURCE_TYPES::contains)
            .distinct()
            .toList();
    }

    private void validateDimension(float[] embedding, int expected) {
        if (embedding == null || embedding.length != expected) {
            throw new IllegalArgumentException("Invalid embedding dimension");
        }
    }
}
```

Transaction boundary penting karena `SET LOCAL` hanya berlaku dalam transaction saat ini.

---

## 24. Mapper interface

```java
package com.example.search;

import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface SemanticSearchMapper {

    void setHnswIterativeScanStrictOrder();

    void setHnswEfSearch(@Param("efSearch") int efSearch);

    void setHnswMaxScanTuples(@Param("maxScanTuples") int maxScanTuples);

    List<SemanticSearchResult> semanticSearchHnsw(
        @Param("tenantId") long tenantId,
        @Param("queryEmbedding") String queryEmbedding,
        @Param("embeddingModelVersion") String embeddingModelVersion,
        @Param("sourceTypes") List<String> sourceTypes,
        @Param("limit") int limit
    );
}
```

---

## 25. Jersey endpoint

```java
package com.example.search;

import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/semantic-search")
@Produces(MediaType.APPLICATION_JSON)
public class SemanticSearchResource {

    private final SemanticSearchService service;

    public SemanticSearchResource(SemanticSearchService service) {
        this.service = service;
    }

    @GET
    public List<SemanticSearchResult> search(
        @QueryParam("q") String query,
        @QueryParam("sourceType") List<String> sourceTypes,
        @QueryParam("limit") @DefaultValue("10") int limit
    ) {
        long tenantId = resolveTenantId();

        return service.searchWithHnsw(
            tenantId,
            query,
            sourceTypes,
            limit
        );
    }

    private long resolveTenantId() {
        return 1001L;
    }
}
```

---

## 26. Production index profiles

### Profile A - Conservative exact

Use when recall/auditability lebih penting daripada latency.

```sql
-- No ANN index
-- Use exact ORDER BY embedding <=> query LIMIT k
```

### Profile B - HNSW balanced

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_hnsw_v1_cosine
ON semantic_search_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1';
```

Query setting:

```sql
SET LOCAL hnsw.ef_search = 100;
SET LOCAL hnsw.iterative_scan = 'strict_order';
```

### Profile C - HNSW high recall

```sql
SET LOCAL hnsw.ef_search = 200;
SET LOCAL hnsw.iterative_scan = 'strict_order';
SET LOCAL hnsw.max_scan_tuples = 50000;
```

### Profile D - IVFFlat cost-sensitive

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_ivfflat_v1_cosine
ON semantic_search_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1';
```

Query setting:

```sql
SET LOCAL ivfflat.probes = 10;
SET LOCAL ivfflat.iterative_scan = 'strict_order';
```

---

## 27. Operational metrics

| Metric | Kenapa penting |
|---|---|
| `semantic_search.latency.p50/p95/p99` | SLO |
| `semantic_search.result_count` | Filtered ANN issue |
| `semantic_search.returned_less_than_limit.count` | Recall/filter warning |
| `semantic_search.distance.top1` | Quality signal |
| `semantic_search.distance.topk.avg` | Query drift |
| `semantic_search.ef_search` | Tuning trace |
| `semantic_search.iterative_scan.enabled` | Explain performance |
| `semantic_search.index_type` | HNSW/IVFFlat/exact |
| `semantic_search.recall_at_10` | ANN quality |
| `semantic_search.embedding_model_version` | Model isolation |
| `semantic_search.timeout.count` | Stability |

Structured log contoh:

```json
{
  "event": "semantic_search",
  "tenantId": 1001,
  "indexType": "hnsw",
  "embeddingModelVersion": "v1",
  "sourceTypes": ["ARTICLE", "CASE"],
  "limit": 10,
  "resultCount": 10,
  "durationMs": 42,
  "top1Distance": 0.184,
  "efSearch": 100,
  "iterativeScan": "strict_order",
  "requestId": "req-123"
}
```

Jangan log raw query jika berpotensi mengandung data sensitif.

---

## 28. Common mistakes

| Mistake | Dampak | Solusi |
|---|---|---|
| Langsung HNSW tanpa exact baseline | Tidak tahu recall turun | Simpan exact benchmark |
| Salah operator class | Index tidak relevan | Cocokkan cosine/L2/IP |
| Query pakai similarity expression di `ORDER BY` | Index tidak optimal | `ORDER BY embedding <=> vector` |
| Tidak filter model version | Campur vector space | `embedding_model_version = ?` |
| ANN + tenant filter tanpa evaluasi | Result kurang dari LIMIT / recall turun | Iterative scan, partial index, partition |
| `SET` bukan `SET LOCAL` di pool | Setting bocor antar request | Gunakan transaction + `SET LOCAL` |
| `ef_search` terlalu rendah | Recall buruk | Benchmark recall@k |
| `ef_search` terlalu tinggi | Latency naik | Cari titik optimal |
| IVFFlat dibuat sebelum data ada | Training/index buruk | Build setelah data cukup |
| HNSW build memory terlalu kecil | Build lambat | Tune `maintenance_work_mem` hati-hati |
| Terlalu banyak partial index | Write/build overhead | Pilih filter yang benar-benar stabil |
| ANN untuk audit-critical tanpa fallback | Risky | Exact fallback atau high-recall profile |

---

## 29. Tuning workflow praktis

```text
1. Ambil 50-200 query nyata atau representatif
2. Generate query embedding
3. Jalankan exact top-20
4. Buat HNSW index baseline
5. Test ef_search = 40, 80, 100, 200
6. Hitung recall@10, recall@20, p95 latency
7. Test dengan filter tenant/source/status nyata
8. Enable iterative scan bila filtered result kurang
9. Bandingkan partial index / partition bila perlu
10. Pilih profile berdasarkan SLO + recall threshold
```

Contoh target awal:

| Search type | Recall target | Latency target |
|---|---:|---:|
| Internal knowledge search | Recall@10 ≥ 0.85 | p95 < 300 ms |
| RAG retrieval | Recall@20 ≥ 0.90 | p95 < 500 ms |
| Regulatory/case critical search | Recall@10 ≥ 0.95 atau exact fallback | Domain-specific |
| Autocomplete semantic | Biasanya tidak disarankan | Gunakan lexical/fuzzy |

---

## 30. Mini exercise

### 30.1 Buat HNSW index untuk `case_knowledge_chunks`

```sql
CREATE INDEX CONCURRENTLY idx_case_knowledge_chunks_hnsw_cosine
ON case_knowledge_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64)
WHERE status = 'ACTIVE'
  AND embedding_model_version = 'v1';
```

### 30.2 Query dengan high-recall profile

```sql
BEGIN;

SET LOCAL hnsw.iterative_scan = 'strict_order';
SET LOCAL hnsw.ef_search = 150;
SET LOCAL hnsw.max_scan_tuples = 30000;

SELECT
    id,
    case_id,
    chunk_no,
    section_name,
    content,
    embedding <=> :queryEmbedding::vector AS distance,
    1 - (embedding <=> :queryEmbedding::vector) AS similarity
FROM case_knowledge_chunks
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1'
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT 10;

COMMIT;
```

### 30.3 Exact comparison

```sql
BEGIN;

SET LOCAL enable_indexscan = off;

SELECT
    id,
    case_id,
    chunk_no,
    section_name,
    content,
    embedding <=> :queryEmbedding::vector AS distance
FROM case_knowledge_chunks
WHERE tenant_id = :tenantId
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1'
ORDER BY embedding <=> :queryEmbedding::vector
LIMIT 10;

COMMIT;
```

Bandingkan `id` hasil HNSW vs exact. Kalau banyak top result hilang, naikkan `ef_search`, aktifkan iterative scan, atau evaluasi partition/partial index.

---

## 31. Checklist Seri 7

| Checklist | Target |
|---|---|
| Exact-search baseline tersedia | Ya |
| Distance metric sesuai embedding model | Ya |
| HNSW/IVFFlat dipilih berdasarkan benchmark | Ya |
| Index dibuat per model version | Ya |
| Query memakai `ORDER BY distance_operator LIMIT` | Ya |
| `SET LOCAL` dipakai untuk tuning per request | Ya |
| Recall@k dihitung | Ya |
| p95/p99 latency diukur | Ya |
| Filtered ANN diuji dengan tenant/status/source filter nyata | Ya |
| Iterative scan dipertimbangkan untuk pgvector 0.8+ | Ya |
| Partial index / partitioning dipakai hanya jika datanya mendukung | Ya |
| Exact fallback tersedia untuk search critical | Ya |

---

## Seri 7 selesai

Seri berikutnya:

**Seri 8/10 - Filtered Vector Search: Tenant, Category, Status, Date, Partitioning**

Fokusnya: desain vector search multi-tenant, filter selectivity, partial index, partitioning strategy, query planner behavior, iterative scan operational profile, exact fallback untuk subset kecil, dan pola defensible untuk regulatory/case search.

---

**Sources:**

- [pgvector/pgvector: Open-source vector similarity search for ...](https://github.com/pgvector/pgvector?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:17:48 PM

# Seri 8/10 - Filtered Vector Search: Tenant, Category, Status, Date, Partitioning

Seri ini membahas bagian paling penting untuk **enterprise semantic search**: vector search yang tidak hanya mencari “nearest vector”, tetapi juga tetap patuh pada filter domain seperti `tenant_id`, `status`, `visibility`, `source_type`, `category`, `date range`, dan `embedding_model_version`.

Di workload nyata, query seperti ini hampir selalu salah kalau tidak dipikirkan serius:

```sql
ORDER BY embedding <=> :queryEmbedding
LIMIT 10
```

Karena production search biasanya bukan “cari 10 vector terdekat dari seluruh database”, melainkan:

```text
Cari 10 chunk paling relevan
untuk tenant ini,
yang user berhak lihat,
dari source type tertentu,
dengan status aktif,
pada model embedding yang benar,
dan tetap punya recall yang cukup.
```

---

## 1. Core problem

Pada approximate vector index seperti HNSW/IVFFlat, filter dapat diterapkan **setelah** index scan. pgvector menjelaskan bahwa query dengan filtering bisa mengembalikan hasil lebih sedikit karena approximate index mengambil kandidat lebih dulu, lalu filter diterapkan setelahnya; mulai pgvector 0.8.0 tersedia iterative index scans agar index dapat terus discan sampai cukup hasil ditemukan atau mencapai batas seperti `hnsw.max_scan_tuples` / `ivfflat.max_probes`. ([GitHub](https://github.com/pgvector/pgvector?utm_source=chatgpt.com))

Contoh masalah:

```text
LIMIT 10
hnsw.ef_search = 40
tenant_id match rate = 10%

Expected result after filter ≈ 4 rows
```

Jadi walaupun query meminta `LIMIT 10`, hasil bisa kurang dari 10 atau recall turun.

---

## 2. Mental model

```text
Filtered Vector Search
│
├── Mandatory security filters
│   ├── tenant_id
│   ├── visibility
│   ├── authorization scope
│   └── status
│
├── Domain filters
│   ├── source_type
│   ├── category
│   ├── language
│   ├── date range
│   └── case/workflow state
│
├── Embedding-space filters
│   ├── embedding_provider
│   ├── embedding_model
│   ├── embedding_model_version
│   └── embedding_status = EMBEDDED
│
├── Execution strategy
│   ├── exact search
│   ├── HNSW approximate search
│   ├── IVFFlat approximate search
│   ├── iterative scan
│   ├── partial index
│   └── partitioning
│
└── Defensibility
    ├── recall benchmark
    ├── result count monitoring
    ├── exact fallback
    ├── tenant isolation
    └── audit/logging
```

---

## 3. Baseline table

Kita gunakan table dari seri sebelumnya:

```sql
CREATE TABLE semantic_search_chunks (
    id                       BIGSERIAL PRIMARY KEY,

    tenant_id                BIGINT NOT NULL,

    source_type              TEXT NOT NULL,
    source_id                BIGINT NOT NULL,
    chunk_no                 INTEGER NOT NULL,

    category                 TEXT,
    section_name             TEXT,
    title                    TEXT,
    content                  TEXT NOT NULL,

    embedding_provider       TEXT NOT NULL,
    embedding_model          TEXT NOT NULL,
    embedding_model_version  TEXT NOT NULL,
    embedding_dim            INTEGER NOT NULL,
    embedding                vector(1536),

    embedding_status         TEXT NOT NULL DEFAULT 'PENDING',
    visibility               TEXT NOT NULL DEFAULT 'INTERNAL',
    status                   TEXT NOT NULL DEFAULT 'ACTIVE',
    language                 TEXT NOT NULL DEFAULT 'en',

    source_updated_at        TIMESTAMPTZ,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Minimal invariant:

```text
Search query tidak boleh membaca row:
- tenant berbeda
- visibility tidak authorized
- status inactive/deleted
- embedding belum EMBEDDED
- embedding model/version berbeda
```

---

## 4. Exact filtered vector search

Exact search adalah baseline paling defensible karena tidak ada approximate recall loss.

```sql
SELECT
    c.id,
    c.source_type,
    c.source_id,
    c.chunk_no,
    c.title,
    c.content,
    c.embedding <=> :queryEmbedding::vector AS distance,
    1 - (c.embedding <=> :queryEmbedding::vector) AS similarity
FROM semantic_search_chunks c
WHERE c.tenant_id = :tenantId
  AND c.embedding_status = 'EMBEDDED'
  AND c.status = 'ACTIVE'
  AND c.visibility = ANY(:allowedVisibility)
  AND c.embedding_model_version = :embeddingModelVersion
  AND c.source_type = ANY(:sourceTypes)
ORDER BY c.embedding <=> :queryEmbedding::vector
LIMIT :limit;
```

Gunakan exact search ketika kandidat setelah filter relatif kecil, recall harus sangat tinggi, atau query berada di area audit/regulatory yang lebih membutuhkan defensibility daripada latency minimum. pgvector menyatakan exact nearest-neighbor adalah default, sedangkan approximate index mempercepat query dengan trade-off recall. ([GitHub](https://github.com/pgvector/pgvector/blob/master/README.md?utm_source=chatgpt.com))

---

## 5. Metadata index untuk filter

Walaupun ada vector index, metadata filter tetap butuh index relational.

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_filter_core
ON semantic_search_chunks (
    tenant_id,
    embedding_model_version,
    status,
    visibility,
    source_type,
    updated_at DESC
)
WHERE embedding_status = 'EMBEDDED';
```

Untuk filter kategori:

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_filter_category
ON semantic_search_chunks (
    tenant_id,
    category,
    source_type,
    updated_at DESC
)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE';
```

Tujuannya bukan selalu membuat planner menggabungkan B-tree dan HNSW secara sempurna, tetapi menjaga query exact/filter-heavy tetap punya jalur eksekusi yang baik, dan membantu query non-vector seperti count, reconciliation, dan fallback.

---

## 6. Approximate filtered search dengan HNSW

### 6.1 Index HNSW umum

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_hnsw_v1_cosine
ON semantic_search_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (
    m = 16,
    ef_construction = 64
)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1';
```

Query:

```sql
BEGIN;

SET LOCAL hnsw.ef_search = 100;

SELECT
    c.id,
    c.source_type,
    c.source_id,
    c.chunk_no,
    c.title,
    c.content,
    c.embedding <=> :queryEmbedding::vector AS distance
FROM semantic_search_chunks c
WHERE c.tenant_id = :tenantId
  AND c.embedding_status = 'EMBEDDED'
  AND c.status = 'ACTIVE'
  AND c.visibility = ANY(:allowedVisibility)
  AND c.embedding_model_version = 'v1'
  AND c.source_type = ANY(:sourceTypes)
ORDER BY c.embedding <=> :queryEmbedding::vector
LIMIT :limit;

COMMIT;
```

`hnsw.ef_search` menaikkan jumlah kandidat saat query; makin tinggi biasanya recall lebih baik tetapi latency naik. pgvector mendokumentasikan parameter HNSW seperti `m`, `ef_construction`, dan `hnsw.ef_search`. ([GitHub](https://github.com/pgvector/pgvector/blob/master/README.md?utm_source=chatgpt.com))

---

## 7. Iterative scan untuk filtered ANN

Untuk filter yang cukup selektif, aktifkan iterative scan.

```sql
BEGIN;

SET LOCAL hnsw.iterative_scan = 'strict_order';
SET LOCAL hnsw.ef_search = 100;
SET LOCAL hnsw.max_scan_tuples = 20000;

SELECT
    c.id,
    c.source_type,
    c.source_id,
    c.chunk_no,
    c.title,
    c.content,
    c.embedding <=> :queryEmbedding::vector AS distance
FROM semantic_search_chunks c
WHERE c.tenant_id = :tenantId
  AND c.embedding_status = 'EMBEDDED'
  AND c.status = 'ACTIVE'
  AND c.visibility = ANY(:allowedVisibility)
  AND c.embedding_model_version = 'v1'
  AND c.source_type = ANY(:sourceTypes)
ORDER BY c.embedding <=> :queryEmbedding::vector
LIMIT :limit;

COMMIT;
```

Mode `strict_order` menjaga ordering lebih ketat, sedangkan `relaxed_order` bisa lebih cepat tetapi ordering tidak selalu strict. pgvector 0.8.0 mendokumentasikan iterative scans untuk HNSW dan IVFFlat, termasuk parameter `hnsw.iterative_scan`, `ivfflat.iterative_scan`, `hnsw.max_scan_tuples`, dan `ivfflat.max_probes`. ([GitHub](https://github.com/pgvector/pgvector?utm_source=chatgpt.com))

---

## 8. IVFFlat filtered search

IVFFlat juga bisa dipakai, terutama jika build cost dan memory lebih penting. pgvector menjelaskan IVFFlat membagi vector ke beberapa list dan mencari subset list terdekat; build lebih cepat dan memakai lebih sedikit memory daripada HNSW, tetapi speed-recall trade-off biasanya lebih rendah. ([GitHub](https://github.com/pgvector/pgvector/blob/master/README.md?utm_source=chatgpt.com))

Index:

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_ivfflat_v1_cosine
ON semantic_search_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1';
```

Query:

```sql
BEGIN;

SET LOCAL ivfflat.iterative_scan = 'strict_order';
SET LOCAL ivfflat.probes = 10;
SET LOCAL ivfflat.max_probes = 100;

SELECT
    c.id,
    c.source_type,
    c.source_id,
    c.chunk_no,
    c.title,
    c.content,
    c.embedding <=> :queryEmbedding::vector AS distance
FROM semantic_search_chunks c
WHERE c.tenant_id = :tenantId
  AND c.embedding_status = 'EMBEDDED'
  AND c.status = 'ACTIVE'
  AND c.visibility = ANY(:allowedVisibility)
  AND c.embedding_model_version = 'v1'
  AND c.source_type = ANY(:sourceTypes)
ORDER BY c.embedding <=> :queryEmbedding::vector
LIMIT :limit;

COMMIT;
```

---

## 9. Partial index strategy

PostgreSQL partial index adalah index atas subset table yang didefinisikan oleh predicate. Ini berguna kalau workload search selalu berulang pada subset tertentu, misalnya hanya `ACTIVE`, `PUBLIC`, `ARTICLE`, atau model version tertentu. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes-partial.html?utm_source=chatgpt.com))

### 9.1 Partial HNSW untuk public article

```sql
CREATE INDEX CONCURRENTLY idx_semantic_public_articles_hnsw_v1
ON semantic_search_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND visibility = 'PUBLIC'
  AND source_type = 'ARTICLE'
  AND embedding_model_version = 'v1';
```

Query harus konsisten dengan predicate:

```sql
SELECT
    c.id,
    c.title,
    c.content,
    c.embedding <=> :queryEmbedding::vector AS distance
FROM semantic_search_chunks c
WHERE c.embedding_status = 'EMBEDDED'
  AND c.status = 'ACTIVE'
  AND c.visibility = 'PUBLIC'
  AND c.source_type = 'ARTICLE'
  AND c.embedding_model_version = 'v1'
ORDER BY c.embedding <=> :queryEmbedding::vector
LIMIT :limit;
```

### 9.2 Partial index per source type

```sql
CREATE INDEX CONCURRENTLY idx_semantic_case_hnsw_v1
ON semantic_search_chunks
USING hnsw (embedding vector_cosine_ops)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND source_type = 'CASE'
  AND embedding_model_version = 'v1';
```

```sql
CREATE INDEX CONCURRENTLY idx_semantic_article_hnsw_v1
ON semantic_search_chunks
USING hnsw (embedding vector_cosine_ops)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND source_type = 'ARTICLE'
  AND embedding_model_version = 'v1';
```

Practical rule:

```text
Partial index bagus jika predicate stabil dan sering dipakai.
Partial index buruk jika terlalu banyak kombinasi filter.
```

---

## 10. Partitioning strategy

PostgreSQL declarative partitioning memungkinkan table dibagi menjadi partition berdasarkan key tertentu, seperti list/range/hash partition. Partitioning membantu jika data sangat besar, filter sangat kuat, atau isolation per tenant/source diperlukan. ([PostgreSQL](https://www.postgresql.org/docs/current/ddl-partitioning.html?utm_source=chatgpt.com))

### 10.1 Partition by tenant untuk tenant besar

```sql
CREATE TABLE semantic_search_chunks_p (
    id                       BIGSERIAL,
    tenant_id                BIGINT NOT NULL,
    source_type              TEXT NOT NULL,
    source_id                BIGINT NOT NULL,
    chunk_no                 INTEGER NOT NULL,
    title                    TEXT,
    content                  TEXT NOT NULL,
    embedding_model_version  TEXT NOT NULL,
    embedding                vector(1536),
    embedding_status         TEXT NOT NULL,
    visibility               TEXT NOT NULL,
    status                   TEXT NOT NULL,
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
)
PARTITION BY LIST (tenant_id);
```

Partition:

```sql
CREATE TABLE semantic_search_chunks_t1001
PARTITION OF semantic_search_chunks_p
FOR VALUES IN (1001);

CREATE TABLE semantic_search_chunks_t1002
PARTITION OF semantic_search_chunks_p
FOR VALUES IN (1002);
```

Index per partition:

```sql
CREATE INDEX idx_semantic_chunks_t1001_hnsw_v1
ON semantic_search_chunks_t1001
USING hnsw (embedding vector_cosine_ops)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1';
```

### 10.2 Partition by source type

```sql
CREATE TABLE semantic_search_chunks_by_source (
    LIKE semantic_search_chunks INCLUDING ALL
)
PARTITION BY LIST (source_type);
```

```sql
CREATE TABLE semantic_search_chunks_case
PARTITION OF semantic_search_chunks_by_source
FOR VALUES IN ('CASE');

CREATE TABLE semantic_search_chunks_article
PARTITION OF semantic_search_chunks_by_source
FOR VALUES IN ('ARTICLE');
```

Use partitioning jika filter utama selalu sama dan cardinality manageable. Jangan membuat ribuan partition kecil tanpa operational plan.

---

## 11. Partition choice matrix

| Partition key | Cocok ketika | Risiko |
|---|---|---|
| `tenant_id` | Tenant besar, isolation kuat, query selalu per tenant | Banyak tenant kecil bisa membuat partition explosion |
| `source_type` | Query sering dipisah `CASE`, `ARTICLE`, `ATTACHMENT` | Cross-source search butuh scan banyak partition |
| `embedding_model_version` | Re-embedding besar, model lifecycle kompleks | Query model aktif harus selalu filter |
| `created_at` / date range | Data time-series/archive | Semantic search biasanya tidak selalu date-first |
| Hash partition | Distribusi data besar tapi filter tidak natural | Kurang membantu filter semantic jika query tidak pakai partition key |

Practical recommendation:

```text
Mulai dari non-partitioned + partial index.
Naik ke partitioning jika data volume, tenant skew, atau recall/filter issue sudah terbukti.
```

---

## 12. Filter selectivity classification

Sebelum memilih index/partition, ukur selectivity.

```sql
SELECT
    tenant_id,
    count(*) AS total_embedded,
    count(*) FILTER (WHERE source_type = 'ARTICLE') AS article_count,
    count(*) FILTER (WHERE source_type = 'CASE') AS case_count,
    count(*) FILTER (WHERE visibility = 'PUBLIC') AS public_count
FROM semantic_search_chunks
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1'
GROUP BY tenant_id
ORDER BY total_embedded DESC
LIMIT 20;
```

Interpretasi:

| Selectivity | Contoh | Strategy |
|---|---|---|
| Sangat selektif | tenant hanya punya 1.000 chunk | Exact search cukup |
| Moderat | tenant punya 50.000 chunk | HNSW + iterative scan |
| Rendah | filter match 50% table | HNSW umum cukup |
| Sangat rendah | source/category luas | ANN normal |
| Sangat skewed | 1 tenant punya 80% data | Partition tenant besar |

---

## 13. Exact fallback untuk subset kecil

Gunakan exact search jika candidate count kecil.

### 13.1 Count candidate dulu

```sql
SELECT count(*) AS candidate_count
FROM semantic_search_chunks
WHERE tenant_id = :tenantId
  AND embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND visibility = ANY(:allowedVisibility)
  AND embedding_model_version = :embeddingModelVersion
  AND source_type = ANY(:sourceTypes);
```

### 13.2 Pilih mode

```text
candidate_count <= 20_000
→ exact search

candidate_count > 20_000
→ HNSW/IVFFlat approximate search with iterative scan
```

Threshold harus diuji dengan data dan SLO perusahaan, bukan angka absolut.

---

## 14. Two-phase filtered retrieval

Untuk search critical, gunakan two-phase pattern:

```text
Phase 1:
Ambil kandidat lebih banyak dengan ANN:
top 100 / top 200

Phase 2:
Filter/rerank/scoring ulang di SQL atau aplikasi:
- permission
- status
- distance
- recency
- business rules
```

SQL:

```sql
WITH ann_candidates AS (
    SELECT
        c.id,
        c.source_type,
        c.source_id,
        c.chunk_no,
        c.title,
        c.content,
        c.status,
        c.visibility,
        c.updated_at,
        c.embedding <=> :queryEmbedding::vector AS distance
    FROM semantic_search_chunks c
    WHERE c.tenant_id = :tenantId
      AND c.embedding_status = 'EMBEDDED'
      AND c.status = 'ACTIVE'
      AND c.visibility = ANY(:allowedVisibility)
      AND c.embedding_model_version = :embeddingModelVersion
    ORDER BY c.embedding <=> :queryEmbedding::vector
    LIMIT :candidateLimit
)
SELECT
    *,
    1 - distance AS similarity
FROM ann_candidates
WHERE source_type = ANY(:sourceTypes)
ORDER BY distance ASC, updated_at DESC
LIMIT :limit;
```

Trade-off:

| Kelebihan | Kekurangan |
|---|---|
| Lebih mudah kontrol reranking | Candidate limit harus cukup |
| Bisa tambah business score | Latency naik |
| Cocok untuk hybrid nanti | Masih bisa miss jika ANN candidate kurang |

---

## 15. Date filter strategy

Date filter dapat mengganggu ANN recall jika sangat selektif.

```sql
SELECT
    c.id,
    c.title,
    c.content,
    c.embedding <=> :queryEmbedding::vector AS distance
FROM semantic_search_chunks c
WHERE c.tenant_id = :tenantId
  AND c.embedding_status = 'EMBEDDED'
  AND c.status = 'ACTIVE'
  AND c.embedding_model_version = :embeddingModelVersion
  AND c.source_updated_at >= :fromDate
  AND c.source_updated_at < :toDate
ORDER BY c.embedding <=> :queryEmbedding::vector
LIMIT :limit;
```

Strategy:

| Date filter | Strategy |
|---|---|
| Optional broad range | ANN + iterative scan |
| Narrow range | Exact search after date filter |
| Archive search | Partition by time only if query mostly time-bounded |
| Recent boost, not strict filter | Ranking boost lebih baik daripada hard filter |

Contoh recency boost setelah candidate:

```sql
WITH candidates AS (
    SELECT
        c.id,
        c.title,
        c.content,
        c.updated_at,
        c.embedding <=> :queryEmbedding::vector AS distance
    FROM semantic_search_chunks c
    WHERE c.tenant_id = :tenantId
      AND c.embedding_status = 'EMBEDDED'
      AND c.status = 'ACTIVE'
      AND c.embedding_model_version = :embeddingModelVersion
    ORDER BY c.embedding <=> :queryEmbedding::vector
    LIMIT 100
)
SELECT
    *,
    (
        (1 - distance)
        + CASE
            WHEN updated_at >= now() - interval '30 days' THEN 0.03
            WHEN updated_at >= now() - interval '180 days' THEN 0.01
            ELSE 0
          END
    ) AS final_score
FROM candidates
ORDER BY final_score DESC
LIMIT :limit;
```

---

## 16. Authorization filter pattern

Jangan post-filter authorization di Java setelah mengambil vector result lintas tenant/scope.

Bad:

```text
1. Query top 100 nearest chunks globally
2. Java remove unauthorized rows
3. Return remaining rows
```

Risiko:

| Risiko | Dampak |
|---|---|
| Data leak through timing/logging/debug | Security incident |
| Result kurang dari limit | UX buruk |
| Recall authorized result rendah | Relevant result tidak muncul |
| Audit sulit | Query tidak defensible |

Good:

```sql
SELECT
    c.id,
    c.title,
    c.content,
    c.embedding <=> :queryEmbedding::vector AS distance
FROM semantic_search_chunks c
JOIN user_search_scopes s
  ON s.tenant_id = c.tenant_id
 AND s.source_type = c.source_type
 AND s.allowed = true
WHERE s.user_id = :userId
  AND c.tenant_id = :tenantId
  AND c.embedding_status = 'EMBEDDED'
  AND c.status = 'ACTIVE'
  AND c.embedding_model_version = :embeddingModelVersion
ORDER BY c.embedding <=> :queryEmbedding::vector
LIMIT :limit;
```

Untuk performance, scope bisa dipre-resolve di aplikasi menjadi `allowedVisibility`, `sourceTypes`, atau `authorizedCaseIds` jika cardinality kecil.

---

## 17. Handling authorized IDs

Jika user hanya boleh melihat subset case tertentu:

```sql
WITH authorized_cases AS (
    SELECT case_id
    FROM user_authorized_cases
    WHERE user_id = :userId
      AND tenant_id = :tenantId
),
candidate AS (
    SELECT
        c.id,
        c.source_id AS case_id,
        c.title,
        c.content,
        c.embedding <=> :queryEmbedding::vector AS distance
    FROM semantic_search_chunks c
    JOIN authorized_cases a
      ON a.case_id = c.source_id
    WHERE c.tenant_id = :tenantId
      AND c.source_type = 'CASE'
      AND c.embedding_status = 'EMBEDDED'
      AND c.status = 'ACTIVE'
      AND c.embedding_model_version = :embeddingModelVersion
    ORDER BY c.embedding <=> :queryEmbedding::vector
    LIMIT :limit
)
SELECT *
FROM candidate
ORDER BY distance;
```

Jika `authorized_cases` sangat kecil, exact search bisa lebih baik daripada ANN karena filter sangat selektif.

---

## 18. Query mode decision engine

Gunakan routing internal, bukan satu query untuk semua.

```text
Input:
- tenant_id
- sourceTypes
- visibility
- date range
- category
- authorized IDs
- candidate count
- limit
- criticality

Decision:
- exact
- hnsw balanced
- hnsw high recall
- ivfflat
- two-phase
- exact fallback
```

Java enum:

```java
public enum VectorSearchMode {
    EXACT,
    HNSW_BALANCED,
    HNSW_HIGH_RECALL,
    IVFFLAT_BALANCED,
    TWO_PHASE,
    EXACT_FALLBACK
}
```

Decision sederhana:

```java
public VectorSearchMode chooseMode(
    long candidateCount,
    boolean hasHighlySelectiveAuthorization,
    boolean auditCritical,
    boolean hasNarrowDateRange
) {
    if (auditCritical) {
        return VectorSearchMode.EXACT_FALLBACK;
    }

    if (candidateCount <= 20_000) {
        return VectorSearchMode.EXACT;
    }

    if (hasHighlySelectiveAuthorization || hasNarrowDateRange) {
        return VectorSearchMode.HNSW_HIGH_RECALL;
    }

    return VectorSearchMode.HNSW_BALANCED;
}
```

---

## 19. MyBatis mapper: candidate count

```xml
<select id="countSemanticCandidates" resultType="long">
    SELECT count(*)
    FROM semantic_search_chunks c
    WHERE c.tenant_id = #{tenantId}
      AND c.embedding_status = 'EMBEDDED'
      AND c.status = 'ACTIVE'
      AND c.visibility IN
      <foreach collection="allowedVisibility"
               item="visibility"
               open="("
               separator=","
               close=")">
          #{visibility}
      </foreach>
      AND c.embedding_model_version = #{embeddingModelVersion}

      <if test="sourceTypes != null and sourceTypes.size() > 0">
        AND c.source_type IN
        <foreach collection="sourceTypes"
                 item="sourceType"
                 open="("
                 separator=","
                 close=")">
            #{sourceType}
        </foreach>
      </if>

      <if test="category != null">
        AND c.category = #{category}
      </if>

      <if test="fromDate != null">
        AND c.source_updated_at &gt;= #{fromDate}
      </if>

      <if test="toDate != null">
        AND c.source_updated_at &lt; #{toDate}
      </if>
</select>
```

---

## 20. MyBatis mapper: exact search

```xml
<select id="semanticSearchExact" resultMap="SemanticSearchResultMap">
    SELECT
        c.id,
        c.source_type,
        c.source_id,
        c.chunk_no,
        c.title,
        c.content,
        c.embedding &lt;=&gt; #{queryEmbedding}::vector AS distance,
        1 - (c.embedding &lt;=&gt; #{queryEmbedding}::vector) AS similarity
    FROM semantic_search_chunks c
    WHERE c.tenant_id = #{tenantId}
      AND c.embedding_status = 'EMBEDDED'
      AND c.status = 'ACTIVE'
      AND c.visibility IN
      <foreach collection="allowedVisibility"
               item="visibility"
               open="("
               separator=","
               close=")">
          #{visibility}
      </foreach>
      AND c.embedding_model_version = #{embeddingModelVersion}

      <if test="sourceTypes != null and sourceTypes.size() > 0">
        AND c.source_type IN
        <foreach collection="sourceTypes"
                 item="sourceType"
                 open="("
                 separator=","
                 close=")">
            #{sourceType}
        </foreach>
      </if>

      <if test="category != null">
        AND c.category = #{category}
      </if>

      <if test="fromDate != null">
        AND c.source_updated_at &gt;= #{fromDate}
      </if>

      <if test="toDate != null">
        AND c.source_updated_at &lt; #{toDate}
      </if>

    ORDER BY c.embedding &lt;=&gt; #{queryEmbedding}::vector
    LIMIT #{limit}
</select>
```

---

## 21. MyBatis mapper: HNSW high recall

```xml
<update id="setHnswHighRecallProfile">
    SET LOCAL hnsw.iterative_scan = 'strict_order'
</update>

<update id="setHnswEfSearch">
    SET LOCAL hnsw.ef_search = ${efSearch}
</update>

<update id="setHnswMaxScanTuples">
    SET LOCAL hnsw.max_scan_tuples = ${maxScanTuples}
</update>

<select id="semanticSearchHnsw" resultMap="SemanticSearchResultMap">
    SELECT
        c.id,
        c.source_type,
        c.source_id,
        c.chunk_no,
        c.title,
        c.content,
        c.embedding &lt;=&gt; #{queryEmbedding}::vector AS distance,
        1 - (c.embedding &lt;=&gt; #{queryEmbedding}::vector) AS similarity
    FROM semantic_search_chunks c
    WHERE c.tenant_id = #{tenantId}
      AND c.embedding_status = 'EMBEDDED'
      AND c.status = 'ACTIVE'
      AND c.visibility IN
      <foreach collection="allowedVisibility"
               item="visibility"
               open="("
               separator=","
               close=")">
          #{visibility}
      </foreach>
      AND c.embedding_model_version = #{embeddingModelVersion}

      <if test="sourceTypes != null and sourceTypes.size() > 0">
        AND c.source_type IN
        <foreach collection="sourceTypes"
                 item="sourceType"
                 open="("
                 separator=","
                 close=")">
            #{sourceType}
        </foreach>
      </if>

      <if test="category != null">
        AND c.category = #{category}
      </if>

      <if test="fromDate != null">
        AND c.source_updated_at &gt;= #{fromDate}
      </if>

      <if test="toDate != null">
        AND c.source_updated_at &lt; #{toDate}
      </if>

    ORDER BY c.embedding &lt;=&gt; #{queryEmbedding}::vector
    LIMIT #{limit}
</select>
```

Catatan penting: `${}` di MyBatis adalah string substitution. Jangan isi dari user input. Untuk `efSearch` dan `maxScanTuples`, gunakan konstanta aplikasi atau whitelist.

---

## 22. Java request object

```java
package com.example.search;

import java.time.OffsetDateTime;
import java.util.List;

public record SemanticSearchRequest(
    long tenantId,
    long userId,
    String query,
    List<String> sourceTypes,
    List<String> allowedVisibility,
    String category,
    OffsetDateTime fromDate,
    OffsetDateTime toDate,
    int limit,
    boolean auditCritical
) {}
```

Result DTO:

```java
package com.example.search;

public record SemanticSearchResult(
    long id,
    String sourceType,
    long sourceId,
    int chunkNo,
    String title,
    String content,
    double distance,
    double similarity
) {}
```

---

## 23. Java service routing

```java
package com.example.search;

import java.util.List;
import java.util.Set;

public class FilteredSemanticSearchService {

    private static final int EXPECTED_DIMENSION = 1536;
    private static final int MAX_LIMIT = 30;
    private static final long EXACT_THRESHOLD = 20_000;

    private static final Set<String> ALLOWED_SOURCE_TYPES = Set.of(
        "CASE",
        "ARTICLE",
        "ATTACHMENT",
        "DECISION"
    );

    private final EmbeddingClient embeddingClient;
    private final SemanticSearchMapper mapper;

    public FilteredSemanticSearchService(
        EmbeddingClient embeddingClient,
        SemanticSearchMapper mapper
    ) {
        this.embeddingClient = embeddingClient;
        this.mapper = mapper;
    }

    public List<SemanticSearchResult> search(SemanticSearchRequest request) {
        String query = normalize(request.query());
        if (query.isBlank()) {
            return List.of();
        }

        int limit = sanitizeLimit(request.limit());
        List<String> sourceTypes = sanitizeSourceTypes(request.sourceTypes());
        List<String> visibility = sanitizeVisibility(request.allowedVisibility());

        float[] embedding = embeddingClient.embed(query);
        validateDimension(embedding, EXPECTED_DIMENSION);

        String vectorLiteral = PgVectorLiteral.fromFloatArray(embedding);

        long candidateCount = mapper.countSemanticCandidates(
            request.tenantId(),
            "v1",
            sourceTypes,
            visibility,
            request.category(),
            request.fromDate(),
            request.toDate()
        );

        VectorSearchMode mode = chooseMode(
            candidateCount,
            request.auditCritical(),
            request.fromDate() != null || request.toDate() != null
        );

        return switch (mode) {
            case EXACT, EXACT_FALLBACK -> mapper.semanticSearchExact(
                request.tenantId(),
                vectorLiteral,
                "v1",
                sourceTypes,
                visibility,
                request.category(),
                request.fromDate(),
                request.toDate(),
                limit
            );

            case HNSW_HIGH_RECALL -> {
                mapper.setHnswHighRecallProfile();
                mapper.setHnswEfSearch(200);
                mapper.setHnswMaxScanTuples(50_000);

                yield mapper.semanticSearchHnsw(
                    request.tenantId(),
                    vectorLiteral,
                    "v1",
                    sourceTypes,
                    visibility,
                    request.category(),
                    request.fromDate(),
                    request.toDate(),
                    limit
                );
            }

            case HNSW_BALANCED -> {
                mapper.setHnswHighRecallProfile();
                mapper.setHnswEfSearch(100);
                mapper.setHnswMaxScanTuples(20_000);

                yield mapper.semanticSearchHnsw(
                    request.tenantId(),
                    vectorLiteral,
                    "v1",
                    sourceTypes,
                    visibility,
                    request.category(),
                    request.fromDate(),
                    request.toDate(),
                    limit
                );
            }

            default -> throw new IllegalStateException("Unsupported mode: " + mode);
        };
    }

    private VectorSearchMode chooseMode(
        long candidateCount,
        boolean auditCritical,
        boolean hasDateFilter
    ) {
        if (auditCritical) {
            return VectorSearchMode.EXACT_FALLBACK;
        }

        if (candidateCount <= EXACT_THRESHOLD) {
            return VectorSearchMode.EXACT;
        }

        if (hasDateFilter) {
            return VectorSearchMode.HNSW_HIGH_RECALL;
        }

        return VectorSearchMode.HNSW_BALANCED;
    }

    private String normalize(String raw) {
        if (raw == null) {
            return "";
        }
        return raw.trim().replaceAll("\\s+", " ");
    }

    private int sanitizeLimit(int requestedLimit) {
        return Math.min(Math.max(requestedLimit, 1), MAX_LIMIT);
    }

    private List<String> sanitizeSourceTypes(List<String> sourceTypes) {
        if (sourceTypes == null || sourceTypes.isEmpty()) {
            return List.of("ARTICLE", "CASE");
        }

        return sourceTypes.stream()
            .filter(ALLOWED_SOURCE_TYPES::contains)
            .distinct()
            .toList();
    }

    private List<String> sanitizeVisibility(List<String> visibility) {
        if (visibility == null || visibility.isEmpty()) {
            return List.of("PUBLIC");
        }

        return visibility.stream()
            .filter(v -> v.equals("PUBLIC") || v.equals("INTERNAL"))
            .distinct()
            .toList();
    }

    private void validateDimension(float[] embedding, int expected) {
        if (embedding == null || embedding.length != expected) {
            throw new IllegalArgumentException("Invalid embedding dimension");
        }
    }
}
```

---

## 24. Jersey endpoint

```java
package com.example.search;

import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

import java.time.OffsetDateTime;
import java.util.List;

@Path("/semantic-search")
@Produces(MediaType.APPLICATION_JSON)
public class FilteredSemanticSearchResource {

    private final FilteredSemanticSearchService service;

    public FilteredSemanticSearchResource(FilteredSemanticSearchService service) {
        this.service = service;
    }

    @GET
    public List<SemanticSearchResult> search(
        @QueryParam("q") String query,
        @QueryParam("sourceType") List<String> sourceTypes,
        @QueryParam("category") String category,
        @QueryParam("from") String from,
        @QueryParam("to") String to,
        @QueryParam("limit") @DefaultValue("10") int limit
    ) {
        long tenantId = resolveTenantId();
        long userId = resolveUserId();

        List<String> allowedVisibility = resolveAllowedVisibility(userId);

        SemanticSearchRequest request = new SemanticSearchRequest(
            tenantId,
            userId,
            query,
            sourceTypes,
            allowedVisibility,
            category,
            parseDateTime(from),
            parseDateTime(to),
            limit,
            false
        );

        return service.search(request);
    }

    private long resolveTenantId() {
        return 1001L;
    }

    private long resolveUserId() {
        return 9001L;
    }

    private List<String> resolveAllowedVisibility(long userId) {
        return List.of("PUBLIC", "INTERNAL");
    }

    private OffsetDateTime parseDateTime(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return OffsetDateTime.parse(value);
    }
}
```

---

## 25. Operational monitoring

Filtered vector search perlu metric khusus, bukan hanya latency.

| Metric | Kenapa penting |
|---|---|
| `semantic_search.candidate_count` | Menjelaskan kenapa mode exact/ANN dipilih |
| `semantic_search.mode` | Exact/HNSW/high-recall/two-phase |
| `semantic_search.result_count` | Deteksi hasil kurang dari limit |
| `semantic_search.returned_less_than_limit` | Gejala filtered ANN |
| `semantic_search.filter.tenant` | Debug tenant skew |
| `semantic_search.filter.source_type_count` | Debug selectivity |
| `semantic_search.ef_search` | Trace tuning HNSW |
| `semantic_search.max_scan_tuples` | Trace iterative scan |
| `semantic_search.top1_distance` | Quality drift |
| `semantic_search.recall_at_10` | Validasi ANN |
| `semantic_search.exact_fallback_count` | Biaya defensibility |

Structured log:

```json
{
  "event": "semantic_search",
  "tenantId": 1001,
  "mode": "HNSW_HIGH_RECALL",
  "candidateCount": 184230,
  "limit": 10,
  "resultCount": 10,
  "sourceTypes": ["ARTICLE", "CASE"],
  "hasDateFilter": false,
  "embeddingModelVersion": "v1",
  "efSearch": 200,
  "maxScanTuples": 50000,
  "durationMs": 86,
  "top1Distance": 0.176
}
```

---

## 26. Recall validation untuk filtered search

Benchmark harus mencakup filter nyata, bukan hanya global vector search.

```sql
CREATE TABLE semantic_filtered_benchmark_queries (
    id                       BIGSERIAL PRIMARY KEY,
    tenant_id                BIGINT NOT NULL,
    query_text               TEXT NOT NULL,
    query_embedding          vector(1536) NOT NULL,
    source_types             TEXT[],
    category                 TEXT,
    from_date                TIMESTAMPTZ,
    to_date                  TIMESTAMPTZ,
    embedding_model_version  TEXT NOT NULL,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Exact benchmark query:

```sql
SELECT
    c.id,
    c.embedding <=> b.query_embedding AS distance
FROM semantic_filtered_benchmark_queries b
JOIN semantic_search_chunks c
  ON c.tenant_id = b.tenant_id
WHERE b.id = :benchmarkQueryId
  AND c.embedding_status = 'EMBEDDED'
  AND c.status = 'ACTIVE'
  AND c.embedding_model_version = b.embedding_model_version
  AND (
        b.source_types IS NULL
        OR c.source_type = ANY(b.source_types)
  )
  AND (
        b.category IS NULL
        OR c.category = b.category
  )
  AND (
        b.from_date IS NULL
        OR c.source_updated_at >= b.from_date
  )
  AND (
        b.to_date IS NULL
        OR c.source_updated_at < b.to_date
  )
ORDER BY c.embedding <=> b.query_embedding
LIMIT 20;
```

ANN benchmark harus memakai filter yang sama, lalu bandingkan recall@k.

---

## 27. Failure modes

| Failure mode | Gejala | Mitigasi |
|---|---|---|
| Filtered ANN returns < limit | `resultCount < limit` sering | Iterative scan, higher `ef_search`, exact fallback |
| Tenant besar mendominasi index | Tenant kecil recall buruk | Partition tenant besar / partial index |
| Date filter sangat sempit | Relevant result hilang | Exact after date filter |
| Model version tidak difilter | Result aneh | Mandatory `embedding_model_version` |
| Too many partial indexes | Write/build overhead | Batasi pada predicate stabil |
| Query planner pilih path buruk | Latency tidak konsisten | `EXPLAIN`, benchmark, mode routing |
| Authorization post-filter | Data leak / recall rendah | Authorization di SQL |
| Candidate count mahal | Extra overhead | Cache count / approximate threshold / skip count untuk default mode |
| HNSW high recall terlalu mahal | p99 naik | Balanced profile + fallback |
| Partition explosion | Operasional rumit | Partition hanya untuk skew besar |

---

## 28. Decision matrix

| Situation | Recommended strategy |
|---|---|
| Candidate setelah filter kecil | Exact search |
| Candidate besar, filter ringan | HNSW balanced |
| Candidate besar, filter selektif | HNSW + iterative scan high recall |
| Rebuild sering dan memory ketat | IVFFlat benchmark |
| Query selalu public article | Partial HNSW index |
| Tenant besar sangat dominan | Partition by tenant untuk tenant besar |
| Search audit-critical | Exact fallback atau exact-only |
| Date range sangat sempit | Exact after date filter |
| Cross-source general search | HNSW global + source rerank |
| Multi-model rollout | Partial index per model version |

---

## 29. Mini exercise

### 29.1 Buat index metadata

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_core_filter_v1
ON semantic_search_chunks (
    tenant_id,
    source_type,
    category,
    status,
    visibility,
    source_updated_at DESC
)
WHERE embedding_status = 'EMBEDDED'
  AND embedding_model_version = 'v1';
```

### 29.2 Buat HNSW partial index active model

```sql
CREATE INDEX CONCURRENTLY idx_semantic_chunks_hnsw_active_v1
ON semantic_search_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1';
```

### 29.3 Query high-recall filtered vector search

```sql
BEGIN;

SET LOCAL hnsw.iterative_scan = 'strict_order';
SET LOCAL hnsw.ef_search = 200;
SET LOCAL hnsw.max_scan_tuples = 50000;

SELECT
    c.id,
    c.source_type,
    c.source_id,
    c.chunk_no,
    c.title,
    c.content,
    c.embedding <=> :queryEmbedding::vector AS distance,
    1 - (c.embedding <=> :queryEmbedding::vector) AS similarity
FROM semantic_search_chunks c
WHERE c.tenant_id = :tenantId
  AND c.embedding_status = 'EMBEDDED'
  AND c.status = 'ACTIVE'
  AND c.visibility = ANY(:allowedVisibility)
  AND c.embedding_model_version = 'v1'
  AND c.source_type = ANY(:sourceTypes)
  AND (:category IS NULL OR c.category = :category)
  AND (:fromDate IS NULL OR c.source_updated_at >= :fromDate)
  AND (:toDate IS NULL OR c.source_updated_at < :toDate)
ORDER BY c.embedding <=> :queryEmbedding::vector
LIMIT :limit;

COMMIT;
```

### 29.4 Exact fallback query

```sql
BEGIN;

SET LOCAL enable_indexscan = off;

SELECT
    c.id,
    c.source_type,
    c.source_id,
    c.chunk_no,
    c.title,
    c.content,
    c.embedding <=> :queryEmbedding::vector AS distance
FROM semantic_search_chunks c
WHERE c.tenant_id = :tenantId
  AND c.embedding_status = 'EMBEDDED'
  AND c.status = 'ACTIVE'
  AND c.visibility = ANY(:allowedVisibility)
  AND c.embedding_model_version = 'v1'
  AND c.source_type = ANY(:sourceTypes)
ORDER BY c.embedding <=> :queryEmbedding::vector
LIMIT :limit;

COMMIT;
```

---

## 30. Checklist Seri 8

| Checklist | Target |
|---|---|
| `tenant_id` selalu menjadi SQL filter | Ya |
| `visibility/status` tidak dipost-filter di Java | Ya |
| `embedding_model_version` wajib difilter | Ya |
| Candidate count / selectivity diketahui | Ya |
| Exact search tersedia untuk subset kecil | Ya |
| HNSW/IVFFlat dipakai dengan `ORDER BY distance LIMIT` | Ya |
| Iterative scan dipakai untuk filtered ANN | Ya |
| Partial index hanya untuk predicate stabil | Ya |
| Partitioning hanya jika skew/volume terbukti | Ya |
| Date filter diuji terhadap recall | Ya |
| Authorization dilakukan di SQL | Ya |
| Result count `< limit` dimonitor | Ya |
| Recall benchmark memakai filter nyata | Ya |
| Exact fallback tersedia untuk audit-critical search | Ya |

---

## Seri 8 selesai

Seri berikutnya:

**Seri 9/10 - Hybrid Search Production Pattern: FTS + Vector + RRF/Reranking + Observability**

Fokusnya: menggabungkan lexical search, fuzzy search, vector search, metadata filter, Reciprocal Rank Fusion, optional reranker, score normalization, stable pagination, explainability, dan observability search production.

---

**Sources:**

- [pgvector/pgvector: Open-source vector similarity search for ...](https://github.com/pgvector/pgvector?utm_source=chatgpt.com)
- [Documentation: 18: 11.8. Partial Indexes](https://www.postgresql.org/docs/current/indexes-partial.html?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:20:27 PM

Saya lanjut ke seri 9/10. Ini bagian penggabungan: lexical precision dari FTS, semantic recall dari vector, fuzzy fallback, lalu ranking yang bisa dijelaskan dan dimonitor.

# Seri 9/10 - Hybrid Search Production Pattern: FTS + Vector + RRF/Reranking + Observability

Seri ini menyatukan semua komponen sebelumnya:

```text id="7q6cl0"
Full Text Search  → lexical precision
pg_trgm           → typo / fuzzy fallback
pgvector          → semantic recall
metadata filter   → security + domain boundary
fusion/reranking  → final result ordering
observability     → quality + latency control
```

Hybrid search penting karena **FTS dan vector search punya failure mode berbeda**. FTS bagus untuk keyword, identifier, phrase, dan exact-ish lexical matching. Vector search bagus untuk semantic similarity, paraphrase, dan “dokumen yang maknanya mirip”. PostgreSQL menyediakan ranking FTS seperti `ts_rank` dan `ts_rank_cd`, sementara pgvector menyediakan exact/approximate vector search, distance operators, dan monitoring recall dengan membandingkan approximate search terhadap exact search. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html))

---

## 1. Core idea

Hybrid search menjawab pertanyaan:

```text id="rn8x26"
Bagaimana menggabungkan hasil keyword search dan semantic search
tanpa membuat ranking kacau?
```

Masalahnya, score FTS dan score vector **tidak berada pada skala yang sama**.

| Search type | Score / distance | Semakin baik |
|---|---|---|
| FTS | `ts_rank_cd()` | Semakin besar |
| Vector cosine distance | `embedding <=> query_vector` | Semakin kecil |
| Vector cosine similarity | `1 - distance` | Semakin besar |
| Trigram similarity | `similarity()` | Semakin besar |
| Exact ID boost | custom score | Semakin besar |

Jadi jangan asal:

```sql id="71j0uk"
final_score = ts_rank_cd + cosine_similarity
```

Bisa, tetapi perlu normalisasi dan validasi. Untuk baseline production yang lebih stabil, pakai **rank fusion**, terutama **Reciprocal Rank Fusion / RRF**.

---

## 2. Mental model

```text id="zsh0qy"
User query
│
├── Normalize input
│
├── Generate lexical query
│   ├── websearch_to_tsquery()
│   ├── FTS match
│   └── lexical rank
│
├── Generate query embedding
│   ├── embedding client
│   ├── vector nearest-neighbor
│   └── vector rank
│
├── Optional fuzzy query
│   ├── pg_trgm similarity
│   └── fuzzy rank
│
├── Apply mandatory filters
│   ├── tenant_id
│   ├── visibility
│   ├── status
│   ├── source_type
│   └── embedding_model_version
│
├── Candidate fusion
│   ├── RRF
│   ├── weighted score
│   ├── exact identifier boost
│   └── business boost
│
├── Optional reranking
│   ├── cross-encoder
│   ├── LLM reranker
│   ├── domain rule reranker
│   └── duplicate collapse
│
└── API response
    ├── title
    ├── snippet / highlight
    ├── source reference
    ├── score explanation
    └── trace metadata
```

---

## 3. Why hybrid search?

| Query | FTS behavior | Vector behavior | Hybrid result |
|---|---|---|---|
| `CASE-2026-0001` | Excellent if identifier indexed | Usually irrelevant | Exact ID wins |
| `"late reporting"` | Excellent phrase match | Good semantic match | FTS strong |
| `company did not file periodic report` | Might miss if terms differ | Good semantic match | Vector helps |
| `licence suspnsion` typo | FTS may miss | Maybe weak | Trigram helps |
| `cases similar to this decision rationale` | Weak | Strong | Vector wins |
| `non-compliance reporting obligation` | Strong | Strong | Hybrid robust |

Practical invariant:

```text id="90kgpd"
Hybrid search is not “vector search plus keyword search”.
It is a controlled retrieval pipeline with explicit ranking rules.
```

---

## 4. Baseline schema

Kita gunakan satu table search projection yang siap untuk FTS + vector.

```sql id="4v25n7"
CREATE TABLE search_documents (
    id                       BIGSERIAL PRIMARY KEY,

    tenant_id                BIGINT NOT NULL,

    source_type              TEXT NOT NULL,
    source_id                BIGINT NOT NULL,
    chunk_no                 INTEGER NOT NULL,

    title                    TEXT NOT NULL,
    content                  TEXT NOT NULL,
    category                 TEXT,
    section_name             TEXT,

    status                   TEXT NOT NULL DEFAULT 'ACTIVE',
    visibility               TEXT NOT NULL DEFAULT 'INTERNAL',
    language                 REGCONFIG NOT NULL DEFAULT 'english',

    embedding_provider       TEXT NOT NULL,
    embedding_model          TEXT NOT NULL,
    embedding_model_version  TEXT NOT NULL,
    embedding_dim            INTEGER NOT NULL,
    embedding_status         TEXT NOT NULL DEFAULT 'PENDING',
    embedding                vector(1536),

    source_updated_at        TIMESTAMPTZ,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),

    search_vector            tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector(language, coalesce(title, '')), 'A') ||
        setweight(to_tsvector(language, coalesce(section_name, '')), 'B') ||
        setweight(to_tsvector(language, coalesce(content, '')), 'C')
    ) STORED,

    normalized_title         TEXT GENERATED ALWAYS AS (
        lower(regexp_replace(coalesce(title, ''), '\s+', ' ', 'g'))
    ) STORED,

    UNIQUE (
        tenant_id,
        source_type,
        source_id,
        chunk_no,
        embedding_model_version
    )
);
```

PostgreSQL FTS ranking functions consider lexical frequency, proximity, and document structure, but the docs explicitly warn that relevance is application-specific and often needs additional ranking factors such as modification time. That is exactly why hybrid search should expose lexical, semantic, and business scores separately before producing the final score. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html))

---

## 5. Index baseline

### 5.1 FTS index

```sql id="c48r0b"
CREATE INDEX CONCURRENTLY idx_search_documents_fts
ON search_documents
USING GIN (search_vector);
```

### 5.2 Trigram index

```sql id="dqndsk"
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX CONCURRENTLY idx_search_documents_title_trgm
ON search_documents
USING GIN (normalized_title gin_trgm_ops);
```

### 5.3 Metadata filter index

```sql id="bzjvzb"
CREATE INDEX CONCURRENTLY idx_search_documents_filter
ON search_documents (
    tenant_id,
    status,
    visibility,
    source_type,
    embedding_model_version,
    source_updated_at DESC
)
WHERE embedding_status = 'EMBEDDED';
```

### 5.4 Vector HNSW index

```sql id="4zud64"
CREATE INDEX CONCURRENTLY idx_search_documents_hnsw_v1_cosine
ON search_documents
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64)
WHERE embedding_status = 'EMBEDDED'
  AND status = 'ACTIVE'
  AND embedding_model_version = 'v1';
```

pgvector supports exact and approximate nearest-neighbor search and distance metrics including L2, inner product, cosine distance, L1, Hamming, and Jaccard. It also notes that vector index usage requires `ORDER BY` on the distance operator directly with `LIMIT`; ordering by a transformed expression such as `1 - distance` is not the index-friendly form. ([GitHub](https://github.com/pgvector/pgvector))

---

## 6. Hybrid strategy options

| Strategy | Cara kerja | Kelebihan | Kekurangan |
|---|---|---|---|
| Union + manual score | Gabungkan FTS/vector lalu hitung final score | Flexible | Perlu normalisasi score |
| RRF | Gabungkan berdasarkan rank position | Stabil, tidak perlu score normalization | Parameter perlu tuning |
| Weighted normalized score | Normalize lexical/vector/fuzzy lalu weighted sum | Bisa sangat bagus jika dilabeli | Butuh evaluation data |
| Cross-encoder rerank | Ambil kandidat hybrid lalu model rerank | Kualitas tinggi | Mahal/latency/cost |
| LLM rerank | Model menilai relevance | Bisa explainable | Mahal, non-deterministic jika tidak dikontrol |
| Rule-based rerank | Exact ID/status/recency/business rules | Defensible | Tidak menangkap semantic quality penuh |

Rekomendasi practical:

```text id="9bw42c"
Baseline production:
1. Retrieve lexical top N
2. Retrieve vector top N
3. Optional fuzzy top N
4. Fuse with RRF
5. Add exact/business boost
6. Optional rerank only for top 20-50
```

---

## 7. RRF formula

**Reciprocal Rank Fusion** memakai posisi ranking, bukan raw score.

```text id="rh7hay"
rrf_score(doc) =
    1 / (k + lexical_rank)
  + 1 / (k + vector_rank)
  + 1 / (k + fuzzy_rank)
```

Umumnya `k = 60` dipakai sebagai starting point, tetapi tetap harus divalidasi dengan query nyata. RRF populer karena tidak perlu menyamakan skala `ts_rank_cd`, cosine similarity, dan trigram similarity. Studi retrieval juga menunjukkan fusion lexical + semantic memang berguna karena keduanya menangkap sinyal relevance yang berbeda, meskipun metode fusion dan parameternya tetap perlu dievaluasi terhadap domain. ([arXiv](https://arxiv.org/abs/2210.11934?utm_source=chatgpt.com))

Practical interpretation:

| Kondisi | Efek RRF |
|---|---|
| Dokumen muncul di FTS dan vector | Score naik |
| Dokumen rank tinggi di salah satu retriever | Tetap bisa menang |
| Score FTS/vector beda skala | Tidak masalah |
| Retriever noisy | Candidate bisa masuk, tapi tidak otomatis menang |
| Exact ID | Tetap perlu boost terpisah |

---

## 8. SQL pattern: lexical candidates

```sql id="vk7wyk"
WITH q AS (
    SELECT
        :query::text AS raw_query,
        websearch_to_tsquery('english', :query) AS ts_query
),
lexical AS (
    SELECT
        d.id,
        row_number() OVER (
            ORDER BY ts_rank_cd(d.search_vector, q.ts_query) DESC,
                     d.source_updated_at DESC,
                     d.id DESC
        ) AS lexical_rank,
        ts_rank_cd(d.search_vector, q.ts_query) AS lexical_score
    FROM search_documents d
    CROSS JOIN q
    WHERE numnode(q.ts_query) > 0
      AND d.tenant_id = :tenantId
      AND d.status = 'ACTIVE'
      AND d.visibility = ANY(:allowedVisibility)
      AND d.source_type = ANY(:sourceTypes)
      AND d.search_vector @@ q.ts_query
    LIMIT :lexicalCandidateLimit
)
SELECT *
FROM lexical;
```

`websearch_to_tsquery()` is useful for user-facing search boxes because it turns quoted text into phrase search, `OR` into the `|` operator, dash into negation, and ignores other punctuation rather than treating it as raw `tsquery` syntax. ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html))

---

## 9. SQL pattern: vector candidates

```sql id="90nahy"
WITH vector_candidates AS (
    SELECT
        d.id,
        row_number() OVER (
            ORDER BY d.embedding <=> :queryEmbedding::vector,
                     d.source_updated_at DESC,
                     d.id DESC
        ) AS vector_rank,
        d.embedding <=> :queryEmbedding::vector AS vector_distance,
        1 - (d.embedding <=> :queryEmbedding::vector) AS vector_similarity
    FROM search_documents d
    WHERE d.tenant_id = :tenantId
      AND d.status = 'ACTIVE'
      AND d.visibility = ANY(:allowedVisibility)
      AND d.source_type = ANY(:sourceTypes)
      AND d.embedding_status = 'EMBEDDED'
      AND d.embedding_model_version = :embeddingModelVersion
    ORDER BY d.embedding <=> :queryEmbedding::vector
    LIMIT :vectorCandidateLimit
)
SELECT *
FROM vector_candidates;
```

Kalau memakai HNSW/IVFFlat + filter, aktifkan iterative scan untuk mengurangi risiko hasil kurang dari limit akibat over-filtering. pgvector 0.8.0 menambahkan `hnsw.iterative_scan` dan `ivfflat.iterative_scan`; jika scan awal belum memenuhi kondisi query, pgvector dapat melanjutkan scan sampai threshold seperti `hnsw.max_scan_tuples` atau `ivfflat.max_probes`. ([PostgreSQL](https://www.postgresql.org/about/news/pgvector-080-released-2952/))

---

## 10. SQL pattern: fuzzy candidates

```sql id="p7km3s"
WITH fuzzy AS (
    SELECT
        d.id,
        row_number() OVER (
            ORDER BY similarity(d.normalized_title, lower(:query)) DESC,
                     d.source_updated_at DESC,
                     d.id DESC
        ) AS fuzzy_rank,
        similarity(d.normalized_title, lower(:query)) AS fuzzy_score
    FROM search_documents d
    WHERE length(:query) >= 3
      AND d.tenant_id = :tenantId
      AND d.status = 'ACTIVE'
      AND d.visibility = ANY(:allowedVisibility)
      AND d.source_type = ANY(:sourceTypes)
      AND d.normalized_title % lower(:query)
    LIMIT :fuzzyCandidateLimit
)
SELECT *
FROM fuzzy;
```

Fuzzy candidates sebaiknya dipakai sebagai fallback/supporting signal, bukan ranking utama untuk semua dokumen panjang.

---

## 11. Full hybrid SQL with RRF

```sql id="lwppjv"
BEGIN;

SET LOCAL hnsw.iterative_scan = 'strict_order';
SET LOCAL hnsw.ef_search = 150;
SET LOCAL hnsw.max_scan_tuples = 30000;

WITH q AS (
    SELECT
        :query::text AS raw_query,
        lower(:query) AS normalized_query,
        websearch_to_tsquery('english', :query) AS ts_query
),

lexical AS (
    SELECT
        d.id,
        row_number() OVER (
            ORDER BY ts_rank_cd(d.search_vector, q.ts_query) DESC,
                     d.source_updated_at DESC,
                     d.id DESC
        ) AS lexical_rank,
        ts_rank_cd(d.search_vector, q.ts_query) AS lexical_score
    FROM search_documents d
    CROSS JOIN q
    WHERE numnode(q.ts_query) > 0
      AND d.tenant_id = :tenantId
      AND d.status = 'ACTIVE'
      AND d.visibility = ANY(:allowedVisibility)
      AND d.source_type = ANY(:sourceTypes)
      AND d.search_vector @@ q.ts_query
    LIMIT :lexicalCandidateLimit
),

semantic AS (
    SELECT
        d.id,
        row_number() OVER (
            ORDER BY d.embedding <=> :queryEmbedding::vector,
                     d.source_updated_at DESC,
                     d.id DESC
        ) AS vector_rank,
        d.embedding <=> :queryEmbedding::vector AS vector_distance,
        1 - (d.embedding <=> :queryEmbedding::vector) AS vector_similarity
    FROM search_documents d
    WHERE d.tenant_id = :tenantId
      AND d.status = 'ACTIVE'
      AND d.visibility = ANY(:allowedVisibility)
      AND d.source_type = ANY(:sourceTypes)
      AND d.embedding_status = 'EMBEDDED'
      AND d.embedding_model_version = :embeddingModelVersion
    ORDER BY d.embedding <=> :queryEmbedding::vector
    LIMIT :vectorCandidateLimit
),

fuzzy AS (
    SELECT
        d.id,
        row_number() OVER (
            ORDER BY similarity(d.normalized_title, q.normalized_query) DESC,
                     d.source_updated_at DESC,
                     d.id DESC
        ) AS fuzzy_rank,
        similarity(d.normalized_title, q.normalized_query) AS fuzzy_score
    FROM search_documents d
    CROSS JOIN q
    WHERE length(q.raw_query) >= 3
      AND d.tenant_id = :tenantId
      AND d.status = 'ACTIVE'
      AND d.visibility = ANY(:allowedVisibility)
      AND d.source_type = ANY(:sourceTypes)
      AND d.normalized_title % q.normalized_query
    LIMIT :fuzzyCandidateLimit
),

all_candidates AS (
    SELECT id FROM lexical
    UNION
    SELECT id FROM semantic
    UNION
    SELECT id FROM fuzzy
),

fused AS (
    SELECT
        d.id,
        d.source_type,
        d.source_id,
        d.chunk_no,
        d.title,
        d.content,
        d.category,
        d.section_name,
        d.source_updated_at,

        l.lexical_rank,
        l.lexical_score,

        s.vector_rank,
        s.vector_distance,
        s.vector_similarity,

        f.fuzzy_rank,
        f.fuzzy_score,

        CASE
            WHEN d.source_id::text = q.raw_query THEN 100.0
            WHEN d.title ILIKE q.raw_query || '%' THEN 10.0
            ELSE 0.0
        END AS exact_boost,

        CASE
            WHEN d.source_updated_at >= now() - interval '30 days' THEN 0.03
            WHEN d.source_updated_at >= now() - interval '180 days' THEN 0.01
            ELSE 0.0
        END AS recency_boost,

        (
            COALESCE(1.0 / (:rrfK + l.lexical_rank), 0.0)
          + COALESCE(1.0 / (:rrfK + s.vector_rank), 0.0)
          + COALESCE(1.0 / (:rrfK + f.fuzzy_rank), 0.0)
        ) AS rrf_score

    FROM all_candidates c
    JOIN search_documents d ON d.id = c.id
    CROSS JOIN q
    LEFT JOIN lexical l ON l.id = d.id
    LEFT JOIN semantic s ON s.id = d.id
    LEFT JOIN fuzzy f ON f.id = d.id
)

SELECT
    id,
    source_type,
    source_id,
    chunk_no,
    title,
    category,
    section_name,
    content,
    lexical_rank,
    lexical_score,
    vector_rank,
    vector_distance,
    vector_similarity,
    fuzzy_rank,
    fuzzy_score,
    exact_boost,
    recency_boost,
    rrf_score,
    (
        rrf_score
        + exact_boost
        + recency_boost
    ) AS final_score
FROM fused
ORDER BY final_score DESC, source_updated_at DESC NULLS LAST, id DESC
LIMIT :limit;

COMMIT;
```

Important:

```text id="vm1hqm"
RRF score sebaiknya kecil dan stabil.
Exact identifier boost boleh besar agar ID exact selalu menang.
Business boost harus eksplisit dan bisa dijelaskan.
```

---

## 12. Weighted RRF

Kadang FTS perlu lebih dominan daripada vector, atau sebaliknya.

```sql id="la22sp"
(
    :lexicalWeight * COALESCE(1.0 / (:rrfK + l.lexical_rank), 0.0)
  + :vectorWeight  * COALESCE(1.0 / (:rrfK + s.vector_rank), 0.0)
  + :fuzzyWeight   * COALESCE(1.0 / (:rrfK + f.fuzzy_rank), 0.0)
) AS weighted_rrf_score
```

Starting profile:

| Profile | lexicalWeight | vectorWeight | fuzzyWeight | Cocok untuk |
|---|---:|---:|---:|---|
| Balanced | 1.0 | 1.0 | 0.5 | Default knowledge search |
| Keyword-heavy | 1.5 | 0.8 | 0.5 | Legal/regulatory exact terms |
| Semantic-heavy | 0.8 | 1.5 | 0.3 | RAG / paraphrase-heavy search |
| Fuzzy support | 1.0 | 1.0 | 0.8 | Title/name typo-heavy |

Practical rule:

```text id="7x0lrp"
Weight bukan preference developer.
Weight harus divalidasi dengan query nyata dan expected top results.
```

---

## 13. Candidate limit tuning

| Candidate type | Starting limit |
|---|---:|
| lexicalCandidateLimit | 50-200 |
| vectorCandidateLimit | 50-200 |
| fuzzyCandidateLimit | 20-100 |
| final limit | 10-30 |
| reranker input | 20-50 |

Trade-off:

| Lebih besar | Lebih kecil |
|---|---|
| Recall naik | Latency turun |
| Fusion lebih kaya | Risiko miss lebih tinggi |
| Reranker punya kandidat lebih baik | DB/app cost turun |
| Query lebih mahal | UX lebih cepat |

Untuk RAG, ambil kandidat lebih banyak lalu rerank biasanya lebih baik daripada langsung top-5 dari satu retriever.

---

## 14. Score normalization alternative

Jika punya labeled evaluation data, bisa pakai weighted normalized score.

```text id="r5z981"
final_score =
    lexical_weight * normalized_lexical_score
  + vector_weight  * normalized_vector_similarity
  + fuzzy_weight   * normalized_fuzzy_score
  + exact_boost
  + recency_boost
```

Contoh SQL min-max per candidate set:

```sql id="2vnrfm"
WITH scored AS (...),
normalized AS (
    SELECT
        *,
        (lexical_score - min(lexical_score) OVER ())
            / nullif(max(lexical_score) OVER () - min(lexical_score) OVER (), 0)
            AS lexical_norm,

        (vector_similarity - min(vector_similarity) OVER ())
            / nullif(max(vector_similarity) OVER () - min(vector_similarity) OVER (), 0)
            AS vector_norm,

        (fuzzy_score - min(fuzzy_score) OVER ())
            / nullif(max(fuzzy_score) OVER () - min(fuzzy_score) OVER (), 0)
            AS fuzzy_norm
    FROM scored
)
SELECT *
FROM normalized;
```

Tapi hati-hati:

| Problem | Dampak |
|---|---|
| Candidate set kecil | Normalisasi tidak stabil |
| Query mudah vs sulit | Skala berubah-ubah |
| Outlier score | Ranking bisa distorsi |
| FTS score bukan probabilitas | Interpretasi misleading |

RRF lebih aman sebagai baseline karena tidak membutuhkan score normalization.

---

## 15. Reranking pattern

Reranking dilakukan setelah hybrid candidate retrieval.

```text id="oxmdt2"
Hybrid retrieval:
top 100 candidates

RRF fusion:
top 30 candidates

Reranker:
top 10 final results
```

Reranker bisa berupa:

| Reranker | Kapan dipakai |
|---|---|
| Cross-encoder | Search quality sangat penting |
| Domain rule reranker | Regulatory defensibility |
| LLM reranker | Natural-language explanation / RAG |
| Exact phrase reranker | Legal phrase precision |
| Diversity reranker | Avoid duplicate chunks |
| Source collapse | Hindari 10 chunk dari dokumen sama |

Practical warning:

```text id="b23s94"
Reranker tidak boleh memperbaiki authorization.
Authorization harus sudah benar di SQL retrieval.
```

---

## 16. Source collapse / de-duplication

Masalah umum semantic chunk search:

```text id="b82y2p"
Top 10 hasil semuanya chunk dari dokumen yang sama.
```

Jika UX ingin dokumen unik, lakukan collapse.

```sql id="mgc6tg"
WITH ranked AS (
    SELECT
        *,
        row_number() OVER (
            PARTITION BY source_type, source_id
            ORDER BY final_score DESC, source_updated_at DESC, id DESC
        ) AS source_rank
    FROM fused_results
)
SELECT *
FROM ranked
WHERE source_rank = 1
ORDER BY final_score DESC
LIMIT :limit;
```

Alternatif:

| UX | Strategy |
|---|---|
| Search dokumen | Collapse per `source_type/source_id` |
| RAG context | Boleh beberapa chunk, tapi batasi per source |
| Similar case | Collapse per case |
| Attachment search | Tampilkan chunk + parent document |
| Investigation search | Tampilkan section-level result |

---

## 17. Highlighting hybrid results

Untuk hasil yang punya FTS match, gunakan `ts_headline()`.

```sql id="1t3k8y"
ts_headline(
    'english',
    d.content,
    q.ts_query,
    'StartSel=<<<HL>>>, StopSel=<<<ENDHL>>>, MaxWords=40, MinWords=10'
) AS lexical_snippet
```

Untuk hasil vector-only, `ts_headline()` mungkin tidak berguna karena tidak ada lexical match. Gunakan snippet strategy lain:

```text id="h4xtd2"
- return chunk content awal
- return best section chunk
- return surrounding paragraph
- optional semantic explanation from reranker
```

API response bisa membedakan:

```json id="vzqs7x"
{
  "title": "License suspension policy",
  "snippetType": "LEXICAL_HIGHLIGHT",
  "snippet": "... <<<HL>>>reporting obligation<<<ENDHL>>> ..."
}
```

atau:

```json id="la9xwd"
{
  "title": "License suspension policy",
  "snippetType": "SEMANTIC_CHUNK",
  "snippet": "A license may be suspended when the entity fails to comply..."
}
```

---

## 18. Explainability fields

Hybrid result production sebaiknya punya score breakdown, minimal untuk debug/internal.

```json id="vo8p2m"
{
  "id": 123,
  "sourceType": "ARTICLE",
  "sourceId": 501,
  "title": "License suspension policy",
  "finalScore": 0.0472,
  "scoreBreakdown": {
    "rrfScore": 0.0472,
    "lexicalRank": 3,
    "vectorRank": 7,
    "fuzzyRank": null,
    "lexicalScore": 0.183,
    "vectorSimilarity": 0.812,
    "fuzzyScore": null,
    "exactBoost": 0,
    "recencyBoost": 0.01
  }
}
```

Untuk public API, breakdown bisa disembunyikan. Untuk internal engineering/admin, breakdown sangat membantu saat user bertanya “kenapa result ini muncul?”.

---

## 19. MyBatis mapper: hybrid search

### 19.1 Result DTO

```java id="pmq0mz"
package com.example.search;

public record HybridSearchResult(
    long id,
    String sourceType,
    long sourceId,
    int chunkNo,
    String title,
    String category,
    String sectionName,
    String content,

    Integer lexicalRank,
    Double lexicalScore,

    Integer vectorRank,
    Double vectorDistance,
    Double vectorSimilarity,

    Integer fuzzyRank,
    Double fuzzyScore,

    double exactBoost,
    double recencyBoost,
    double rrfScore,
    double finalScore
) {}
```

### 19.2 Mapper XML

```xml id="o3zttq"
<resultMap id="HybridSearchResultMap"
           type="com.example.search.HybridSearchResult">
    <id property="id" column="id"/>
    <result property="sourceType" column="source_type"/>
    <result property="sourceId" column="source_id"/>
    <result property="chunkNo" column="chunk_no"/>
    <result property="title" column="title"/>
    <result property="category" column="category"/>
    <result property="sectionName" column="section_name"/>
    <result property="content" column="content"/>

    <result property="lexicalRank" column="lexical_rank"/>
    <result property="lexicalScore" column="lexical_score"/>

    <result property="vectorRank" column="vector_rank"/>
    <result property="vectorDistance" column="vector_distance"/>
    <result property="vectorSimilarity" column="vector_similarity"/>

    <result property="fuzzyRank" column="fuzzy_rank"/>
    <result property="fuzzyScore" column="fuzzy_score"/>

    <result property="exactBoost" column="exact_boost"/>
    <result property="recencyBoost" column="recency_boost"/>
    <result property="rrfScore" column="rrf_score"/>
    <result property="finalScore" column="final_score"/>
</resultMap>

<select id="hybridSearch" resultMap="HybridSearchResultMap">
    WITH q AS (
        SELECT
            #{query}::text AS raw_query,
            lower(#{query}) AS normalized_query,
            websearch_to_tsquery('english', #{query}) AS ts_query
    ),

    lexical AS (
        SELECT
            d.id,
            row_number() OVER (
                ORDER BY ts_rank_cd(d.search_vector, q.ts_query) DESC,
                         d.source_updated_at DESC,
                         d.id DESC
            ) AS lexical_rank,
            ts_rank_cd(d.search_vector, q.ts_query) AS lexical_score
        FROM search_documents d
        CROSS JOIN q
        WHERE numnode(q.ts_query) &gt; 0
          AND d.tenant_id = #{tenantId}
          AND d.status = 'ACTIVE'
          AND d.visibility IN
          <foreach collection="allowedVisibility"
                   item="visibility"
                   open="("
                   separator=","
                   close=")">
              #{visibility}
          </foreach>
          AND d.source_type IN
          <foreach collection="sourceTypes"
                   item="sourceType"
                   open="("
                   separator=","
                   close=")">
              #{sourceType}
          </foreach>
          AND d.search_vector @@ q.ts_query
        LIMIT #{lexicalCandidateLimit}
    ),

    semantic AS (
        SELECT
            d.id,
            row_number() OVER (
                ORDER BY d.embedding &lt;=&gt; #{queryEmbedding}::vector,
                         d.source_updated_at DESC,
                         d.id DESC
            ) AS vector_rank,
            d.embedding &lt;=&gt; #{queryEmbedding}::vector AS vector_distance,
            1 - (d.embedding &lt;=&gt; #{queryEmbedding}::vector) AS vector_similarity
        FROM search_documents d
        WHERE d.tenant_id = #{tenantId}
          AND d.status = 'ACTIVE'
          AND d.visibility IN
          <foreach collection="allowedVisibility"
                   item="visibility"
                   open="("
                   separator=","
                   close=")">
              #{visibility}
          </foreach>
          AND d.source_type IN
          <foreach collection="sourceTypes"
                   item="sourceType"
                   open="("
                   separator=","
                   close=")">
              #{sourceType}
          </foreach>
          AND d.embedding_status = 'EMBEDDED'
          AND d.embedding_model_version = #{embeddingModelVersion}
        ORDER BY d.embedding &lt;=&gt; #{queryEmbedding}::vector
        LIMIT #{vectorCandidateLimit}
    ),

    fuzzy AS (
        SELECT
            d.id,
            row_number() OVER (
                ORDER BY similarity(d.normalized_title, q.normalized_query) DESC,
                         d.source_updated_at DESC,
                         d.id DESC
            ) AS fuzzy_rank,
            similarity(d.normalized_title, q.normalized_query) AS fuzzy_score
        FROM search_documents d
        CROSS JOIN q
        WHERE length(q.raw_query) &gt;= 3
          AND d.tenant_id = #{tenantId}
          AND d.status = 'ACTIVE'
          AND d.visibility IN
          <foreach collection="allowedVisibility"
                   item="visibility"
                   open="("
                   separator=","
                   close=")">
              #{visibility}
          </foreach>
          AND d.source_type IN
          <foreach collection="sourceTypes"
                   item="sourceType"
                   open="("
                   separator=","
                   close=")">
              #{sourceType}
          </foreach>
          AND d.normalized_title % q.normalized_query
        LIMIT #{fuzzyCandidateLimit}
    ),

    all_candidates AS (
        SELECT id FROM lexical
        UNION
        SELECT id FROM semantic
        UNION
        SELECT id FROM fuzzy
    ),

    fused AS (
        SELECT
            d.id,
            d.source_type,
            d.source_id,
            d.chunk_no,
            d.title,
            d.category,
            d.section_name,
            d.content,
            d.source_updated_at,

            l.lexical_rank,
            l.lexical_score,

            s.vector_rank,
            s.vector_distance,
            s.vector_similarity,

            f.fuzzy_rank,
            f.fuzzy_score,

            CASE
                WHEN d.source_id::text = q.raw_query THEN 100.0
                WHEN d.title ILIKE q.raw_query || '%' THEN 10.0
                ELSE 0.0
            END AS exact_boost,

            CASE
                WHEN d.source_updated_at &gt;= now() - interval '30 days' THEN 0.03
                WHEN d.source_updated_at &gt;= now() - interval '180 days' THEN 0.01
                ELSE 0.0
            END AS recency_boost,

            (
                #{lexicalWeight} * COALESCE(1.0 / (#{rrfK} + l.lexical_rank), 0.0)
              + #{vectorWeight}  * COALESCE(1.0 / (#{rrfK} + s.vector_rank), 0.0)
              + #{fuzzyWeight}   * COALESCE(1.0 / (#{rrfK} + f.fuzzy_rank), 0.0)
            ) AS rrf_score

        FROM all_candidates c
        JOIN search_documents d ON d.id = c.id
        CROSS JOIN q
        LEFT JOIN lexical l ON l.id = d.id
        LEFT JOIN semantic s ON s.id = d.id
        LEFT JOIN fuzzy f ON f.id = d.id
    )

    SELECT
        id,
        source_type,
        source_id,
        chunk_no,
        title,
        category,
        section_name,
        content,

        lexical_rank,
        lexical_score,

        vector_rank,
        vector_distance,
        vector_similarity,

        fuzzy_rank,
        fuzzy_score,

        exact_boost,
        recency_boost,
        rrf_score,

        rrf_score + exact_boost + recency_boost AS final_score

    FROM fused
    ORDER BY final_score DESC, source_updated_at DESC NULLS LAST, id DESC
    LIMIT #{limit}
</select>
```

---

## 20. Mapper interface

```java id="cywqea"
package com.example.search;

import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface HybridSearchMapper {

    void setHnswIterativeScanStrictOrder();

    void setHnswEfSearch(@Param("efSearch") int efSearch);

    void setHnswMaxScanTuples(@Param("maxScanTuples") int maxScanTuples);

    List<HybridSearchResult> hybridSearch(
        @Param("tenantId") long tenantId,
        @Param("query") String query,
        @Param("queryEmbedding") String queryEmbedding,
        @Param("embeddingModelVersion") String embeddingModelVersion,

        @Param("allowedVisibility") List<String> allowedVisibility,
        @Param("sourceTypes") List<String> sourceTypes,

        @Param("lexicalCandidateLimit") int lexicalCandidateLimit,
        @Param("vectorCandidateLimit") int vectorCandidateLimit,
        @Param("fuzzyCandidateLimit") int fuzzyCandidateLimit,

        @Param("rrfK") double rrfK,
        @Param("lexicalWeight") double lexicalWeight,
        @Param("vectorWeight") double vectorWeight,
        @Param("fuzzyWeight") double fuzzyWeight,

        @Param("limit") int limit
    );
}
```

---

## 21. Java service

```java id="lg8rxj"
package com.example.search;

import java.util.List;
import java.util.Set;

public class HybridSearchService {

    private static final int EXPECTED_DIMENSION = 1536;
    private static final int DEFAULT_LIMIT = 10;
    private static final int MAX_LIMIT = 30;

    private static final int DEFAULT_LEXICAL_CANDIDATES = 100;
    private static final int DEFAULT_VECTOR_CANDIDATES = 100;
    private static final int DEFAULT_FUZZY_CANDIDATES = 50;

    private static final double DEFAULT_RRF_K = 60.0;

    private static final Set<String> ALLOWED_SOURCE_TYPES = Set.of(
        "CASE",
        "ARTICLE",
        "ATTACHMENT",
        "DECISION"
    );

    private final EmbeddingClient embeddingClient;
    private final HybridSearchMapper mapper;

    public HybridSearchService(
        EmbeddingClient embeddingClient,
        HybridSearchMapper mapper
    ) {
        this.embeddingClient = embeddingClient;
        this.mapper = mapper;
    }

    public List<HybridSearchResult> search(
        long tenantId,
        String rawQuery,
        List<String> requestedSourceTypes,
        List<String> allowedVisibility,
        Integer requestedLimit
    ) {
        String query = normalize(rawQuery);
        if (query.isBlank()) {
            return List.of();
        }

        int limit = sanitizeLimit(requestedLimit);
        List<String> sourceTypes = sanitizeSourceTypes(requestedSourceTypes);
        List<String> visibility = sanitizeVisibility(allowedVisibility);

        float[] embedding = embeddingClient.embed(query);
        validateDimension(embedding, EXPECTED_DIMENSION);
        String vectorLiteral = PgVectorLiteral.fromFloatArray(embedding);

        // Must run in same DB transaction when SET LOCAL is used.
        mapper.setHnswIterativeScanStrictOrder();
        mapper.setHnswEfSearch(150);
        mapper.setHnswMaxScanTuples(30_000);

        return mapper.hybridSearch(
            tenantId,
            query,
            vectorLiteral,
            "v1",
            visibility,
            sourceTypes,
            DEFAULT_LEXICAL_CANDIDATES,
            DEFAULT_VECTOR_CANDIDATES,
            DEFAULT_FUZZY_CANDIDATES,
            DEFAULT_RRF_K,
            1.0,
            1.0,
            0.5,
            limit
        );
    }

    private String normalize(String raw) {
        if (raw == null) {
            return "";
        }
        return raw.trim().replaceAll("\\s+", " ");
    }

    private int sanitizeLimit(Integer requestedLimit) {
        if (requestedLimit == null) {
            return DEFAULT_LIMIT;
        }
        return Math.min(Math.max(requestedLimit, 1), MAX_LIMIT);
    }

    private List<String> sanitizeSourceTypes(List<String> sourceTypes) {
        if (sourceTypes == null || sourceTypes.isEmpty()) {
            return List.of("ARTICLE", "CASE");
        }

        return sourceTypes.stream()
            .filter(ALLOWED_SOURCE_TYPES::contains)
            .distinct()
            .toList();
    }

    private List<String> sanitizeVisibility(List<String> visibility) {
        if (visibility == null || visibility.isEmpty()) {
            return List.of("PUBLIC");
        }

        return visibility.stream()
            .filter(v -> v.equals("PUBLIC") || v.equals("INTERNAL"))
            .distinct()
            .toList();
    }

    private void validateDimension(float[] embedding, int expected) {
        if (embedding == null || embedding.length != expected) {
            throw new IllegalArgumentException("Invalid embedding dimension");
        }
    }
}
```

---

## 22. Jersey endpoint

```java id="a7q6cv"
package com.example.search;

import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/search/hybrid")
@Produces(MediaType.APPLICATION_JSON)
public class HybridSearchResource {

    private final HybridSearchService service;

    public HybridSearchResource(HybridSearchService service) {
        this.service = service;
    }

    @GET
    public List<HybridSearchResult> search(
        @QueryParam("q") String query,
        @QueryParam("sourceType") List<String> sourceTypes,
        @QueryParam("limit") @DefaultValue("10") int limit
    ) {
        long tenantId = resolveTenantId();
        List<String> visibility = resolveAllowedVisibility();

        return service.search(
            tenantId,
            query,
            sourceTypes,
            visibility,
            limit
        );
    }

    private long resolveTenantId() {
        return 1001L;
    }

    private List<String> resolveAllowedVisibility() {
        return List.of("PUBLIC", "INTERNAL");
    }
}
```

---

## 23. Reranker interface

```java id="7ciqkm"
package com.example.search.rerank;

import com.example.search.HybridSearchResult;
import java.util.List;

public interface SearchReranker {
    List<HybridSearchResult> rerank(
        String query,
        List<HybridSearchResult> candidates,
        int limit
    );
}
```

Rule-based collapse reranker:

```java id="38qnlw"
package com.example.search.rerank;

import com.example.search.HybridSearchResult;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class SourceCollapseReranker implements SearchReranker {

    private final int maxChunksPerSource;

    public SourceCollapseReranker(int maxChunksPerSource) {
        this.maxChunksPerSource = maxChunksPerSource;
    }

    @Override
    public List<HybridSearchResult> rerank(
        String query,
        List<HybridSearchResult> candidates,
        int limit
    ) {
        Map<String, Integer> countsBySource = new LinkedHashMap<>();

        return candidates.stream()
            .sorted(Comparator.comparingDouble(HybridSearchResult::finalScore).reversed())
            .filter(result -> {
                String key = result.sourceType() + ":" + result.sourceId();
                int current = countsBySource.getOrDefault(key, 0);

                if (current >= maxChunksPerSource) {
                    return false;
                }

                countsBySource.put(key, current + 1);
                return true;
            })
            .limit(limit)
            .toList();
    }
}
```

---

## 24. API response shaping

Internal DTO boleh punya banyak score. Public response sebaiknya lebih bersih.

```java id="4j43tn"
package com.example.search.api;

public record SearchResponseItem(
    String sourceType,
    long sourceId,
    int chunkNo,
    String title,
    String snippet,
    String category,
    double score,
    SearchMatchReason matchReason
) {}
```

```java id="q07fhn"
package com.example.search.api;

public enum SearchMatchReason {
    EXACT_IDENTIFIER,
    LEXICAL,
    SEMANTIC,
    FUZZY,
    HYBRID
}
```

Mapping reason:

```java id="aqvsok"
public SearchMatchReason determineReason(HybridSearchResult r) {
    if (r.exactBoost() > 0) {
        return SearchMatchReason.EXACT_IDENTIFIER;
    }
    if (r.lexicalRank() != null && r.vectorRank() != null) {
        return SearchMatchReason.HYBRID;
    }
    if (r.lexicalRank() != null) {
        return SearchMatchReason.LEXICAL;
    }
    if (r.vectorRank() != null) {
        return SearchMatchReason.SEMANTIC;
    }
    if (r.fuzzyRank() != null) {
        return SearchMatchReason.FUZZY;
    }
    return SearchMatchReason.HYBRID;
}
```

---

## 25. Observability metrics

Hybrid search harus dimonitor dari sisi **latency** dan **quality**.

| Metric | Meaning |
|---|---|
| `hybrid_search.request.count` | Volume |
| `hybrid_search.latency.p50/p95/p99` | SLO |
| `hybrid_search.lexical.candidate_count` | FTS recall |
| `hybrid_search.vector.candidate_count` | Vector recall |
| `hybrid_search.fuzzy.candidate_count` | Typo/fuzzy fallback |
| `hybrid_search.final.result_count` | UX |
| `hybrid_search.zero_result.rate` | Quality |
| `hybrid_search.top1.match_reason` | Dominant mode |
| `hybrid_search.returned_less_than_limit` | Candidate/filter issue |
| `hybrid_search.embedding.duration_ms` | Embedding cost |
| `hybrid_search.db.duration_ms` | DB cost |
| `hybrid_search.rerank.duration_ms` | Reranker cost |
| `hybrid_search.rrf.k` | Ranking config trace |
| `hybrid_search.weights` | Ranking config trace |
| `hybrid_search.exact_boost.count` | Identifier behavior |
| `hybrid_search.recall_at_10` | Offline quality |

pgvector recommends monitoring recall by comparing approximate-search results with exact-search results, using a local setting such as `enable_indexscan = off` to run exact search for comparison. ([GitHub](https://github.com/pgvector/pgvector))

---

## 26. Structured log

```json id="msjqkk"
{
  "event": "hybrid_search",
  "tenantId": 1001,
  "queryLength": 34,
  "sourceTypes": ["ARTICLE", "CASE"],
  "allowedVisibility": ["PUBLIC", "INTERNAL"],
  "embeddingModelVersion": "v1",
  "lexicalCandidateCount": 73,
  "vectorCandidateCount": 100,
  "fuzzyCandidateCount": 12,
  "finalResultCount": 10,
  "top1MatchReason": "HYBRID",
  "top1LexicalRank": 2,
  "top1VectorRank": 5,
  "rrfK": 60,
  "lexicalWeight": 1.0,
  "vectorWeight": 1.0,
  "fuzzyWeight": 0.5,
  "durationMs": 142,
  "requestId": "req-123"
}
```

Jangan log raw query jika mengandung data sensitif. Simpan `queryLength`, hash query, atau sampled anonymized query sesuai kebijakan compliance.

---

## 27. Offline evaluation

Buat dataset kecil:

```sql id="zkf8sq"
CREATE TABLE search_evaluation_queries (
    id              BIGSERIAL PRIMARY KEY,
    query_text      TEXT NOT NULL,
    tenant_id       BIGINT NOT NULL,
    source_types    TEXT[],
    expected_source_type TEXT,
    expected_source_id   BIGINT,
    relevance_grade INTEGER NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Metric sederhana:

| Metric | Meaning |
|---|---|
| Recall@10 | Expected result muncul di top 10 |
| MRR | Expected result rank berapa |
| NDCG@10 | Quality dengan graded relevance |
| Zero-result rate | Query gagal total |
| Click-through top result | Online proxy |
| Reformulation rate | User harus query ulang |
| Time-to-result | UX |

Practical evaluation flow:

```text id="byrx2o"
1. Ambil 100 query nyata
2. Label expected relevant result
3. Jalankan FTS only
4. Jalankan vector only
5. Jalankan hybrid RRF
6. Bandingkan Recall@10 / MRR / NDCG
7. Tuning candidate limit + weight + RRF k
8. Lock baseline config
9. Monitor drift
```

---

## 28. A/B testing ranking config

Ranking config table:

```sql id="8fodkn"
CREATE TABLE search_ranking_profiles (
    profile_name              TEXT PRIMARY KEY,
    embedding_model_version   TEXT NOT NULL,
    rrf_k                     DOUBLE PRECISION NOT NULL,
    lexical_weight            DOUBLE PRECISION NOT NULL,
    vector_weight             DOUBLE PRECISION NOT NULL,
    fuzzy_weight              DOUBLE PRECISION NOT NULL,
    lexical_candidate_limit   INTEGER NOT NULL,
    vector_candidate_limit    INTEGER NOT NULL,
    fuzzy_candidate_limit     INTEGER NOT NULL,
    hnsw_ef_search            INTEGER NOT NULL,
    hnsw_max_scan_tuples      INTEGER NOT NULL,
    active                    BOOLEAN NOT NULL DEFAULT false,
    created_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Contoh profile:

```sql id="t3bcmr"
INSERT INTO search_ranking_profiles (
    profile_name,
    embedding_model_version,
    rrf_k,
    lexical_weight,
    vector_weight,
    fuzzy_weight,
    lexical_candidate_limit,
    vector_candidate_limit,
    fuzzy_candidate_limit,
    hnsw_ef_search,
    hnsw_max_scan_tuples,
    active
)
VALUES
    ('balanced-v1', 'v1', 60, 1.0, 1.0, 0.5, 100, 100, 50, 150, 30000, true),
    ('keyword-heavy-v1', 'v1', 60, 1.5, 0.8, 0.5, 150, 80, 50, 120, 25000, false),
    ('semantic-heavy-v1', 'v1', 60, 0.8, 1.5, 0.3, 80, 150, 30, 200, 50000, false);
```

---

## 29. Failure modes

| Failure mode | Gejala | Mitigasi |
|---|---|---|
| Vector-only result terlalu abstrak | Result semantic tapi tidak menjawab keyword | Naikkan lexical weight / RRF |
| FTS-only result terlalu literal | Paraphrase tidak ketemu | Naikkan vector candidate |
| Fuzzy result noisy | Typo result mengganggu | Turunkan fuzzy weight / threshold |
| Exact ID kalah | User cari kode tapi result lain muncul | Exact boost besar |
| Semua result dari satu source | Chunk duplication | Source collapse |
| Result kurang dari limit | Filtered ANN issue | Iterative scan / larger candidate / exact fallback |
| Latency tinggi | Terlalu banyak candidates/rerank | Kurangi candidate limit / cache / profile |
| Ranking tidak bisa dijelaskan | Score dicampur tanpa breakdown | Simpan score breakdown |
| Model version drift | Result berubah aneh | Filter `embedding_model_version` |
| Query sensitif bocor di log | Compliance risk | Mask/hash/anonymize |

---

## 30. Production checklist

| Checklist | Target |
|---|---|
| FTS candidate query ada | Ya |
| Vector candidate query ada | Ya |
| Fuzzy fallback opsional ada | Ya |
| Mandatory filter diterapkan di semua candidate query | Ya |
| `embedding_model_version` difilter | Ya |
| RRF atau fusion eksplisit dipakai | Ya |
| Exact identifier boost tersedia | Ya |
| Score breakdown tersedia untuk debug | Ya |
| Source collapse dipertimbangkan | Ya |
| Reranker optional setelah top candidates | Ya |
| Query setting HNSW pakai `SET LOCAL` dalam transaction | Ya |
| Candidate limit dikonfigurasi | Ya |
| Ranking profile bisa diubah terkontrol | Ya |
| Observability latency + quality tersedia | Ya |
| Offline evaluation dataset tersedia | Ya |
| Approximate recall dibandingkan exact baseline | Ya |

---

## 31. Mini exercise

Buat hybrid search untuk `regulatory_documents`.

### Candidate policy

```text id="hpa43x"
lexicalCandidateLimit = 100
vectorCandidateLimit  = 100
fuzzyCandidateLimit   = 30
rrfK                  = 60
lexicalWeight         = 1.3
vectorWeight          = 1.0
fuzzyWeight           = 0.4
```

### Expected behavior

| Query | Expected winner |
|---|---|
| `DOC-2026-001` | Exact document number |
| `"reporting obligation"` | FTS phrase |
| `company failed to submit periodic filing` | Vector + FTS |
| `licence suspnsion` | Fuzzy + vector |
| `documents similar to enforcement decision` | Vector |

### Validation

```text id="vkygfv"
1. Jalankan FTS-only
2. Jalankan vector-only
3. Jalankan hybrid
4. Bandingkan top-10
5. Catat result yang buruk
6. Tuning weight atau candidate limit
7. Simpan profile final
```

---

## Seri 9 selesai

Seri berikutnya sekaligus seri terakhir:

**Seri 10/10 - Java/Jersey/MyBatis Integration Pattern for PostgreSQL Search**

Fokusnya: desain endpoint search production, request/response contract, MyBatis mapper organization, transaction boundary untuk `SET LOCAL`, pgvector TypeHandler/literal strategy, pagination, error handling, timeout, observability, testing, dan deployment checklist.

---

**Sources:**

- [PostgreSQL: Documentation: 18: 12.3. Controlling Text Search](https://www.postgresql.org/docs/current/textsearch-controls.html)
- [GitHub - pgvector/pgvector: Open-source vector similarity search for Postgres · GitHub](https://github.com/pgvector/pgvector)
- [An Analysis of Fusion Functions for Hybrid Retrieval](https://arxiv.org/abs/2210.11934?utm_source=chatgpt.com)

## Response:
7/15/2026, 8:22:43 PM

Sama-sama. Saya lanjut ke seri terakhir 10/10, fokusnya integrasi end-to-end di service Java/Jersey/MyBatis: boundary API, mapper, transaction untuk `SET LOCAL`, vector parameter handling, observability, dan testing.

# Seri 10/10 - Java/Jersey/MyBatis Integration Pattern for PostgreSQL Search

Terima kasih juga. Ini seri terakhir, fokusnya **end-to-end integration pattern** untuk search service berbasis:

```text
Java 17+
Jersey / Jakarta REST
MyBatis
PostgreSQL Full Text Search
pg_trgm
pgvector
```

Inti integrasinya: **PostgreSQL yang mengerjakan retrieval/ranking**, Java yang mengatur **API contract, authorization boundary, query normalization, embedding generation, transaction boundary, timeout, observability, dan result shaping**.

Beberapa prinsip teknis yang perlu dikunci: Jakarta REST memakai annotation seperti `@Path`, `@GET`, `@POST`, dan `@QueryParam` untuk membentuk resource HTTP; MyBatis memang didesain agar SQL tetap eksplisit di mapper XML, dengan `#{}` menjadi prepared-statement parameter; pgvector dapat dipakai dari bahasa apa pun yang punya PostgreSQL client, termasuk Java, selama query tetap mengikuti bentuk index-friendly seperti `ORDER BY embedding <=> ? LIMIT k`; dan PostgreSQL `SET LOCAL` hanya berlaku sampai akhir transaction, jadi profile HNSW/IVFFlat harus dijalankan dalam transaction yang sama dengan query search. ([jakarta.ee](https://jakarta.ee/learn/docs/jakartaee-tutorial/current/websvcs/rest/rest.html))

---

## 1. Target architecture

```text
HTTP Client
   │
   ▼
Jersey Resource
   │
   ├── parse query params
   ├── resolve tenant/user/security scope
   ├── validate limit/filter
   └── call service
       │
       ▼
Search Service
   │
   ├── normalize query
   ├── detect search mode
   ├── generate embedding if needed
   ├── choose ranking profile
   ├── open transaction
   ├── SET LOCAL pgvector profile
   └── call MyBatis mapper
       │
       ▼
MyBatis Mapper
   │
   ├── FTS SQL
   ├── trigram SQL
   ├── vector SQL
   ├── hybrid SQL / RRF
   └── resultMap mapping
       │
       ▼
PostgreSQL
   │
   ├── GIN FTS index
   ├── pg_trgm index
   ├── HNSW / IVFFlat vector index
   ├── metadata filters
   └── ranking / fusion
       │
       ▼
Search Response
   │
   ├── result list
   ├── snippet
   ├── score/reason
   ├── pagination cursor
   └── observability metadata
```

Practical invariant:

```text
Authorization, tenant, visibility, status, and model-version filters must be inside SQL retrieval,
not post-filtered after PostgreSQL returns results.
```

---

## 2. Recommended module/package layout

```text
com.company.search
│
├── api
│   ├── SearchResource.java
│   ├── SearchRequest.java
│   ├── SearchResponse.java
│   ├── SearchResponseItem.java
│   └── SearchMatchReason.java
│
├── service
│   ├── SearchService.java
│   ├── SearchMode.java
│   ├── SearchProfile.java
│   ├── SearchProfileResolver.java
│   ├── SearchRequestValidator.java
│   └── SearchResultAssembler.java
│
├── mapper
│   ├── SearchMapper.java
│   ├── SearchMapper.xml
│   ├── SearchIndexingMapper.java
│   └── SearchIndexingMapper.xml
│
├── embedding
│   ├── EmbeddingClient.java
│   ├── EmbeddingRequest.java
│   ├── EmbeddingResponse.java
│   ├── PgVectorLiteral.java
│   └── FloatArrayVectorTypeHandler.java
│
├── indexing
│   ├── SearchDocumentIndexer.java
│   ├── Chunker.java
│   ├── ContentHash.java
│   └── ReembeddingWorker.java
│
├── observability
│   ├── SearchMetrics.java
│   ├── SearchAuditLogger.java
│   └── SearchTrace.java
│
└── transaction
    ├── TransactionRunner.java
    └── MyBatisTransactionRunner.java
```

Kenapa dipisah seperti ini?

| Layer | Responsibility |
|---|---|
| `api` | HTTP contract, query param, response format |
| `service` | orchestration, validation, mode/profile selection |
| `mapper` | SQL retrieval/ranking |
| `embedding` | embedding generation and vector binding |
| `indexing` | chunk/upsert/re-embedding lifecycle |
| `observability` | metrics, logs, trace |
| `transaction` | memastikan `SET LOCAL` dan query berada di connection/transaction yang sama |

---

## 3. API contract

Untuk production, jangan hanya punya satu endpoint mentah. Minimal punya tiga mode:

```text
GET /search
GET /search/hybrid
GET /search/autocomplete
```

Contoh practical endpoint:

```http
GET /search/hybrid?q=late%20reporting%20obligation&sourceType=CASE&sourceType=ARTICLE&limit=10
```

Response shape:

```json
{
  "query": "late reporting obligation",
  "mode": "HYBRID",
  "profile": "balanced-v1",
  "items": [
    {
      "sourceType": "ARTICLE",
      "sourceId": 501,
      "chunkNo": 2,
      "title": "License suspension policy",
      "snippet": "A license may be suspended when the entity fails to comply with reporting obligations...",
      "matchReason": "HYBRID",
      "score": 0.0472
    }
  ],
  "meta": {
    "limit": 10,
    "resultCount": 1,
    "durationMs": 83
  }
}
```

Untuk internal/admin debugging, tambahkan optional score breakdown:

```json
{
  "scoreBreakdown": {
    "lexicalRank": 3,
    "vectorRank": 7,
    "fuzzyRank": null,
    "lexicalScore": 0.183,
    "vectorSimilarity": 0.812,
    "rrfScore": 0.0472,
    "exactBoost": 0.0,
    "recencyBoost": 0.01
  }
}
```

---

## 4. DTO API

```java
package com.company.search.api;

import java.util.List;

public record SearchResponse(
    String query,
    String mode,
    String profile,
    List<SearchResponseItem> items,
    SearchResponseMeta meta
) {}
```

```java
package com.company.search.api;

public record SearchResponseItem(
    String sourceType,
    long sourceId,
    int chunkNo,
    String title,
    String snippet,
    String matchReason,
    double score
) {}
```

```java
package com.company.search.api;

public record SearchResponseMeta(
    int limit,
    int resultCount,
    long durationMs
) {}
```

```java
package com.company.search.api;

public enum SearchMatchReason {
    EXACT_IDENTIFIER,
    LEXICAL,
    SEMANTIC,
    FUZZY,
    HYBRID
}
```

---

## 5. Jersey resource

Jakarta REST resource class biasanya berupa POJO dengan annotation seperti `@Path`; method HTTP memakai annotation seperti `@GET`, dan query string dapat diekstrak dengan `@QueryParam`. Ini cocok untuk search endpoint yang parameter utamanya berada di query string. ([jakarta.ee](https://jakarta.ee/learn/docs/jakartaee-tutorial/current/websvcs/rest/rest.html))

```java
package com.company.search.api;

import com.company.search.service.SearchService;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/search")
@Produces(MediaType.APPLICATION_JSON)
public class SearchResource {

    private final SearchService searchService;

    public SearchResource(SearchService searchService) {
        this.searchService = searchService;
    }

    @GET
    @Path("/hybrid")
    public SearchResponse hybridSearch(
        @QueryParam("q") String query,
        @QueryParam("sourceType") List<String> sourceTypes,
        @QueryParam("limit") @DefaultValue("10") int limit,
        @QueryParam("debug") @DefaultValue("false") boolean debug
    ) {
        long tenantId = resolveTenantId();
        long userId = resolveUserId();
        List<String> allowedVisibility = resolveAllowedVisibility(userId);

        return searchService.hybridSearch(
            tenantId,
            userId,
            query,
            sourceTypes,
            allowedVisibility,
            limit,
            debug
        );
    }

    @GET
    @Path("/autocomplete")
    public SearchResponse autocomplete(
        @QueryParam("q") String query,
        @QueryParam("sourceType") List<String> sourceTypes,
        @QueryParam("limit") @DefaultValue("10") int limit
    ) {
        long tenantId = resolveTenantId();
        long userId = resolveUserId();

        return searchService.autocomplete(
            tenantId,
            userId,
            query,
            sourceTypes,
            limit
        );
    }

    private long resolveTenantId() {
        // Resolve from JWT/session/security context.
        return 1001L;
    }

    private long resolveUserId() {
        // Resolve from JWT/session/security context.
        return 9001L;
    }

    private List<String> resolveAllowedVisibility(long userId) {
        // Resolve from RBAC/ABAC/security scope.
        return List.of("PUBLIC", "INTERNAL");
    }
}
```

---

## 6. Search mode

```java
package com.company.search.service;

public enum SearchMode {
    IDENTIFIER,
    LEXICAL,
    FUZZY,
    SEMANTIC,
    HYBRID,
    AUTOCOMPLETE
}
```

```java
package com.company.search.service;

public final class SearchModeDetector {

    public SearchMode detect(String rawQuery, boolean semanticEnabled) {
        String query = normalize(rawQuery);

        if (query.isBlank()) {
            return SearchMode.LEXICAL;
        }

        if (query.matches("(?i)^(CASE|DOC|ENT|ART)-\\d{4}.*")) {
            return SearchMode.IDENTIFIER;
        }

        if (query.length() < 3) {
            return SearchMode.AUTOCOMPLETE;
        }

        if (!semanticEnabled) {
            return query.split("\\s+").length <= 3
                ? SearchMode.FUZZY
                : SearchMode.LEXICAL;
        }

        return SearchMode.HYBRID;
    }

    private String normalize(String raw) {
        if (raw == null) {
            return "";
        }
        return raw.trim().replaceAll("\\s+", " ");
    }
}
```

---

## 7. Search profile

Ranking dan ANN tuning jangan hardcode tersebar di service. Jadikan profile.

```java
package com.company.search.service;

public record SearchProfile(
    String name,
    String embeddingModelVersion,

    int lexicalCandidateLimit,
    int vectorCandidateLimit,
    int fuzzyCandidateLimit,

    double rrfK,
    double lexicalWeight,
    double vectorWeight,
    double fuzzyWeight,

    int hnswEfSearch,
    int hnswMaxScanTuples,
    String hnswIterativeScanMode
) {
    public static SearchProfile balancedV1() {
        return new SearchProfile(
            "balanced-v1",
            "v1",
            100,
            100,
            50,
            60.0,
            1.0,
            1.0,
            0.5,
            150,
            30_000,
            "strict_order"
        );
    }
}
```

Profile ini bisa juga disimpan di PostgreSQL table seperti di seri 9 agar bisa A/B testing tanpa redeploy.

---

## 8. Vector parameter handling

Ada dua pola praktis.

### Option A - String literal + `::vector`

Ini paling sederhana dan cukup aman selama string dibuat oleh kode internal, bukan raw user input.

```java
package com.company.search.embedding;

import java.util.Locale;

public final class PgVectorLiteral {

    private PgVectorLiteral() {}

    public static String fromFloatArray(float[] values) {
        if (values == null || values.length == 0) {
            throw new IllegalArgumentException("Embedding must not be empty");
        }

        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < values.length; i++) {
            float value = values[i];

            if (!Float.isFinite(value)) {
                throw new IllegalArgumentException("Embedding contains non-finite value at index " + i);
            }

            if (i > 0) {
                sb.append(',');
            }

            sb.append(String.format(Locale.ROOT, "%.8f", value));
        }
        sb.append(']');
        return sb.toString();
    }
}
```

MyBatis:

```xml
ORDER BY d.embedding &lt;=&gt; #{queryEmbedding}::vector
```

Kelebihan:

| Kelebihan | Kekurangan |
|---|---|
| Simple | Vector dikirim sebagai string |
| Tidak perlu custom TypeHandler | Butuh validasi dimensi di Java |
| Mudah debug | Sedikit overhead serialization |

pgvector README menyatakan pgvector dapat digunakan dari bahasa apa pun dengan PostgreSQL client, sehingga string-literal + cast adalah pendekatan lintas client yang praktis selama parameter tetap dibind dengan prepared statement. ([GitHub](https://github.com/pgvector/pgvector))

---

### Option B - MyBatis TypeHandler

MyBatis mendukung custom `TypeHandler` pada parameter/result mapping; dokumentasi MyBatis menunjukkan parameter dapat menentukan `typeHandler`, dan `resultMap` juga dapat override `typeHandler` per mapping. ([MyBatis](https://mybatis.org/mybatis-3/sqlmap-xml.html))

Contoh TypeHandler berbasis `PGobject`:

```java
package com.company.search.embedding;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.postgresql.util.PGobject;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class FloatArrayVectorTypeHandler extends BaseTypeHandler<float[]> {

    @Override
    public void setNonNullParameter(
        PreparedStatement ps,
        int i,
        float[] parameter,
        JdbcType jdbcType
    ) throws SQLException {
        PGobject vector = new PGobject();
        vector.setType("vector");
        vector.setValue(PgVectorLiteral.fromFloatArray(parameter));
        ps.setObject(i, vector);
    }

    @Override
    public float[] getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return parseVector(rs.getString(columnName));
    }

    @Override
    public float[] getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return parseVector(rs.getString(columnIndex));
    }

    @Override
    public float[] getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return parseVector(cs.getString(columnIndex));
    }

    private float[] parseVector(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String clean = value.trim();
        if (clean.startsWith("[") && clean.endsWith("]")) {
            clean = clean.substring(1, clean.length() - 1);
        }

        if (clean.isBlank()) {
            return new float[0];
        }

        String[] parts = clean.split(",");
        float[] result = new float[parts.length];

        for (int i = 0; i < parts.length; i++) {
            result[i] = Float.parseFloat(parts[i].trim());
        }

        return result;
    }
}
```

Mapper usage:

```xml
ORDER BY d.embedding &lt;=&gt; #{queryEmbedding,typeHandler=com.company.search.embedding.FloatArrayVectorTypeHandler}
```

Practical recommendation:

```text
Start with String literal + ::vector.
Move to TypeHandler when vector usage spreads across many mappers or you need cleaner signatures.
```

---

## 9. MyBatis mapper organization

MyBatis Mapper XML supports top-level elements like `resultMap`, reusable `sql`, `insert`, `update`, `delete`, and `select`; this fits search well because advanced PostgreSQL query should remain explicit instead of being hidden in ORM abstraction. ([MyBatis](https://mybatis.org/mybatis-3/sqlmap-xml.html))

```text
SearchMapper.xml
│
├── resultMap
│   └── HybridSearchResultMap
│
├── sql fragments
│   ├── BaseSearchFilter
│   ├── AllowedVisibilityFilter
│   ├── SourceTypeFilter
│   └── HybridCandidateQuery
│
├── update statements
│   ├── setHnswIterativeScanStrictOrder
│   ├── setHnswEfSearch
│   └── setHnswMaxScanTuples
│
└── select statements
    ├── searchIdentifier
    ├── searchLexical
    ├── searchSemantic
    ├── searchHybrid
    └── autocomplete
```

---

## 10. Result map

```xml
<resultMap id="HybridSearchResultMap"
           type="com.company.search.service.HybridSearchRow">
    <id property="id" column="id"/>

    <result property="sourceType" column="source_type"/>
    <result property="sourceId" column="source_id"/>
    <result property="chunkNo" column="chunk_no"/>
    <result property="title" column="title"/>
    <result property="content" column="content"/>
    <result property="snippet" column="snippet"/>

    <result property="lexicalRank" column="lexical_rank"/>
    <result property="lexicalScore" column="lexical_score"/>

    <result property="vectorRank" column="vector_rank"/>
    <result property="vectorDistance" column="vector_distance"/>
    <result property="vectorSimilarity" column="vector_similarity"/>

    <result property="fuzzyRank" column="fuzzy_rank"/>
    <result property="fuzzyScore" column="fuzzy_score"/>

    <result property="rrfScore" column="rrf_score"/>
    <result property="exactBoost" column="exact_boost"/>
    <result property="recencyBoost" column="recency_boost"/>
    <result property="finalScore" column="final_score"/>
</resultMap>
```

MyBatis `resultMap` adalah mekanisme mapping yang paling kuat untuk memetakan result set ke object Java, termasuk mapping eksplisit column-to-property dan nested structure jika nanti diperlukan. ([MyBatis](https://mybatis.org/mybatis-3/sqlmap-xml.html))

---

## 11. SQL filter fragment

```xml
<sql id="BaseSearchFilter">
    d.tenant_id = #{tenantId}
    AND d.status = 'ACTIVE'
    AND d.visibility IN
    <foreach collection="allowedVisibility"
             item="visibility"
             open="("
             separator=","
             close=")">
        #{visibility}
    </foreach>
    AND d.source_type IN
    <foreach collection="sourceTypes"
             item="sourceType"
             open="("
             separator=","
             close=")">
        #{sourceType}
    </foreach>
</sql>
```

MyBatis `foreach` memang umum dipakai untuk menghasilkan daftar parameter, seperti batch values atau `IN (...)`; tetap gunakan `#{}` untuk value agar menjadi prepared-statement parameter. ([MyBatis](https://mybatis.org/mybatis-3/sqlmap-xml.html))

---

## 12. HNSW settings mapper

`SET LOCAL` hanya berlaku sampai akhir transaction; kalau dipakai di luar transaction block, PostgreSQL memberi warning dan efeknya tidak berlaku seperti yang diharapkan. Karena itu, method ini harus dipanggil dalam transaction yang sama dengan query search. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-set.html))

```xml
<update id="setHnswIterativeScanStrictOrder">
    SET LOCAL hnsw.iterative_scan = 'strict_order'
</update>

<update id="setHnswEfSearch">
    SET LOCAL hnsw.ef_search = ${efSearch}
</update>

<update id="setHnswMaxScanTuples">
    SET LOCAL hnsw.max_scan_tuples = ${maxScanTuples}
</update>
```

Important:

```text
${} is string substitution.
Never pass user-controlled values into ${}.
Only pass whitelisted application constants.
```

Safer alternative:

```xml
<update id="setHnswBalancedProfile">
    SET LOCAL hnsw.iterative_scan = 'strict_order'
</update>

<update id="setHnswBalancedEfSearch">
    SET LOCAL hnsw.ef_search = 150
</update>

<update id="setHnswBalancedMaxScanTuples">
    SET LOCAL hnsw.max_scan_tuples = 30000
</update>
```

---

## 13. Hybrid search mapper

Ringkas tapi production-oriented:

```xml
<select id="searchHybrid" resultMap="HybridSearchResultMap">
    WITH q AS (
        SELECT
            #{query}::text AS raw_query,
            lower(#{query}) AS normalized_query,
            websearch_to_tsquery('english', #{query}) AS ts_query
    ),

    lexical AS (
        SELECT
            d.id,
            row_number() OVER (
                ORDER BY ts_rank_cd(d.search_vector, q.ts_query) DESC,
                         d.source_updated_at DESC,
                         d.id DESC
            ) AS lexical_rank,
            ts_rank_cd(d.search_vector, q.ts_query) AS lexical_score
        FROM search_documents d
        CROSS JOIN q
        WHERE numnode(q.ts_query) &gt; 0
          AND <include refid="BaseSearchFilter"/>
          AND d.search_vector @@ q.ts_query
        LIMIT #{lexicalCandidateLimit}
    ),

    semantic AS (
        SELECT
            d.id,
            row_number() OVER (
                ORDER BY d.embedding &lt;=&gt; #{queryEmbedding}::vector,
                         d.source_updated_at DESC,
                         d.id DESC
            ) AS vector_rank,
            d.embedding &lt;=&gt; #{queryEmbedding}::vector AS vector_distance,
            1 - (d.embedding &lt;=&gt; #{queryEmbedding}::vector) AS vector_similarity
        FROM search_documents d
        WHERE <include refid="BaseSearchFilter"/>
          AND d.embedding_status = 'EMBEDDED'
          AND d.embedding_model_version = #{embeddingModelVersion}
        ORDER BY d.embedding &lt;=&gt; #{queryEmbedding}::vector
        LIMIT #{vectorCandidateLimit}
    ),

    fuzzy AS (
        SELECT
            d.id,
            row_number() OVER (
                ORDER BY similarity(d.normalized_title, q.normalized_query) DESC,
                         d.source_updated_at DESC,
                         d.id DESC
            ) AS fuzzy_rank,
            similarity(d.normalized_title, q.normalized_query) AS fuzzy_score
        FROM search_documents d
        CROSS JOIN q
        WHERE length(q.raw_query) &gt;= 3
          AND <include refid="BaseSearchFilter"/>
          AND d.normalized_title % q.normalized_query
        LIMIT #{fuzzyCandidateLimit}
    ),

    all_candidates AS (
        SELECT id FROM lexical
        UNION
        SELECT id FROM semantic
        UNION
        SELECT id FROM fuzzy
    ),

    fused AS (
        SELECT
            d.id,
            d.source_type,
            d.source_id,
            d.chunk_no,
            d.title,
            d.content,

            CASE
                WHEN l.id IS NOT NULL THEN
                    ts_headline(
                        'english',
                        d.content,
                        q.ts_query,
                        'StartSel=&lt;&lt;&lt;HL&gt;&gt;&gt;, StopSel=&lt;&lt;&lt;ENDHL&gt;&gt;&gt;, MaxWords=40, MinWords=10'
                    )
                ELSE substring(d.content from 1 for 500)
            END AS snippet,

            l.lexical_rank,
            l.lexical_score,

            s.vector_rank,
            s.vector_distance,
            s.vector_similarity,

            f.fuzzy_rank,
            f.fuzzy_score,

            CASE
                WHEN d.source_id::text = q.raw_query THEN 100.0
                WHEN d.title ILIKE q.raw_query || '%' THEN 10.0
                ELSE 0.0
            END AS exact_boost,

            CASE
                WHEN d.source_updated_at &gt;= now() - interval '30 days' THEN 0.03
                WHEN d.source_updated_at &gt;= now() - interval '180 days' THEN 0.01
                ELSE 0.0
            END AS recency_boost,

            (
                #{lexicalWeight} * COALESCE(1.0 / (#{rrfK} + l.lexical_rank), 0.0)
              + #{vectorWeight}  * COALESCE(1.0 / (#{rrfK} + s.vector_rank), 0.0)
              + #{fuzzyWeight}   * COALESCE(1.0 / (#{rrfK} + f.fuzzy_rank), 0.0)
            ) AS rrf_score

        FROM all_candidates c
        JOIN search_documents d ON d.id = c.id
        CROSS JOIN q
        LEFT JOIN lexical l ON l.id = d.id
        LEFT JOIN semantic s ON s.id = d.id
        LEFT JOIN fuzzy f ON f.id = d.id
    )

    SELECT
        *,
        rrf_score + exact_boost + recency_boost AS final_score
    FROM fused
    ORDER BY final_score DESC, id DESC
    LIMIT #{limit}
</select>
```

pgvector index usage perlu `ORDER BY` distance operator langsung dan `LIMIT`; jangan ubah ordering menjadi `ORDER BY 1 - distance DESC` kalau ingin ANN index dipakai secara benar. ([GitHub](https://github.com/pgvector/pgvector))

---

## 14. Mapper interface

```java
package com.company.search.mapper;

import com.company.search.service.HybridSearchRow;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SearchMapper {

    void setHnswIterativeScanStrictOrder();

    void setHnswEfSearch(@Param("efSearch") int efSearch);

    void setHnswMaxScanTuples(@Param("maxScanTuples") int maxScanTuples);

    List<HybridSearchRow> searchHybrid(
        @Param("tenantId") long tenantId,
        @Param("query") String query,
        @Param("queryEmbedding") String queryEmbedding,
        @Param("embeddingModelVersion") String embeddingModelVersion,

        @Param("allowedVisibility") List<String> allowedVisibility,
        @Param("sourceTypes") List<String> sourceTypes,

        @Param("lexicalCandidateLimit") int lexicalCandidateLimit,
        @Param("vectorCandidateLimit") int vectorCandidateLimit,
        @Param("fuzzyCandidateLimit") int fuzzyCandidateLimit,

        @Param("rrfK") double rrfK,
        @Param("lexicalWeight") double lexicalWeight,
        @Param("vectorWeight") double vectorWeight,
        @Param("fuzzyWeight") double fuzzyWeight,

        @Param("limit") int limit
    );
}
```

---

## 15. Internal row model

```java
package com.company.search.service;

public record HybridSearchRow(
    long id,
    String sourceType,
    long sourceId,
    int chunkNo,
    String title,
    String content,
    String snippet,

    Integer lexicalRank,
    Double lexicalScore,

    Integer vectorRank,
    Double vectorDistance,
    Double vectorSimilarity,

    Integer fuzzyRank,
    Double fuzzyScore,

    double rrfScore,
    double exactBoost,
    double recencyBoost,
    double finalScore
) {}
```

---

## 16. Transaction runner

Karena `SET LOCAL` harus berada di transaction yang sama, jangan panggil `mapper.setHnsw...()` di satu connection lalu query di connection lain.

Untuk plain MyBatis:

```java
package com.company.search.transaction;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import java.util.function.Function;

public class MyBatisTransactionRunner {

    private final SqlSessionFactory sqlSessionFactory;

    public MyBatisTransactionRunner(SqlSessionFactory sqlSessionFactory) {
        this.sqlSessionFactory = sqlSessionFactory;
    }

    public <T> T required(Function<SqlSession, T> callback) {
        try (SqlSession session = sqlSessionFactory.openSession(false)) {
            try {
                T result = callback.apply(session);
                session.commit();
                return result;
            } catch (RuntimeException | Error ex) {
                session.rollback();
                throw ex;
            }
        }
    }
}
```

Usage:

```java
return transactionRunner.required(session -> {
    SearchMapper mapper = session.getMapper(SearchMapper.class);

    mapper.setHnswIterativeScanStrictOrder();
    mapper.setHnswEfSearch(profile.hnswEfSearch());
    mapper.setHnswMaxScanTuples(profile.hnswMaxScanTuples());

    return mapper.searchHybrid(...);
});
```

This is critical for connection pools. Session-local settings leaking between requests are exactly the kind of issue `SET LOCAL` avoids, because PostgreSQL discards the local value at transaction end. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-set.html))

---

## 17. Search service

```java
package com.company.search.service;

import com.company.search.api.SearchResponse;
import com.company.search.api.SearchResponseItem;
import com.company.search.api.SearchResponseMeta;
import com.company.search.embedding.EmbeddingClient;
import com.company.search.embedding.PgVectorLiteral;
import com.company.search.mapper.SearchMapper;
import com.company.search.transaction.MyBatisTransactionRunner;
import org.apache.ibatis.session.SqlSession;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Set;

public class SearchService {

    private static final int EXPECTED_DIMENSION = 1536;
    private static final int DEFAULT_LIMIT = 10;
    private static final int MAX_LIMIT = 30;

    private static final Set<String> ALLOWED_SOURCE_TYPES = Set.of(
        "CASE",
        "ARTICLE",
        "ATTACHMENT",
        "DECISION"
    );

    private final EmbeddingClient embeddingClient;
    private final MyBatisTransactionRunner transactionRunner;
    private final SearchResultAssembler assembler;

    public SearchService(
        EmbeddingClient embeddingClient,
        MyBatisTransactionRunner transactionRunner,
        SearchResultAssembler assembler
    ) {
        this.embeddingClient = embeddingClient;
        this.transactionRunner = transactionRunner;
        this.assembler = assembler;
    }

    public SearchResponse hybridSearch(
        long tenantId,
        long userId,
        String rawQuery,
        List<String> requestedSourceTypes,
        List<String> allowedVisibility,
        int requestedLimit,
        boolean debug
    ) {
        Instant start = Instant.now();

        String query = normalizeQuery(rawQuery);
        if (query.isBlank()) {
            return emptyResponse(rawQuery, start);
        }

        int limit = sanitizeLimit(requestedLimit);
        List<String> sourceTypes = sanitizeSourceTypes(requestedSourceTypes);
        List<String> visibility = sanitizeVisibility(allowedVisibility);

        SearchProfile profile = SearchProfile.balancedV1();

        float[] embedding = embeddingClient.embed(query);
        validateEmbedding(embedding, EXPECTED_DIMENSION);
        String embeddingLiteral = PgVectorLiteral.fromFloatArray(embedding);

        List<HybridSearchRow> rows = transactionRunner.required((SqlSession session) -> {
            SearchMapper mapper = session.getMapper(SearchMapper.class);

            mapper.setHnswIterativeScanStrictOrder();
            mapper.setHnswEfSearch(profile.hnswEfSearch());
            mapper.setHnswMaxScanTuples(profile.hnswMaxScanTuples());

            return mapper.searchHybrid(
                tenantId,
                query,
                embeddingLiteral,
                profile.embeddingModelVersion(),
                visibility,
                sourceTypes,
                profile.lexicalCandidateLimit(),
                profile.vectorCandidateLimit(),
                profile.fuzzyCandidateLimit(),
                profile.rrfK(),
                profile.lexicalWeight(),
                profile.vectorWeight(),
                profile.fuzzyWeight(),
                limit
            );
        });

        List<SearchResponseItem> items = rows.stream()
            .map(assembler::toResponseItem)
            .toList();

        long durationMs = Duration.between(start, Instant.now()).toMillis();

        return new SearchResponse(
            query,
            "HYBRID",
            profile.name(),
            items,
            new SearchResponseMeta(limit, items.size(), durationMs)
        );
    }

    public SearchResponse autocomplete(
        long tenantId,
        long userId,
        String rawQuery,
        List<String> sourceTypes,
        int limit
    ) {
        // Implement separately with pg_trgm / prefix search.
        // Avoid embedding generation for autocomplete.
        return emptyResponse(rawQuery, Instant.now());
    }

    private SearchResponse emptyResponse(String query, Instant start) {
        return new SearchResponse(
            query == null ? "" : query,
            "EMPTY",
            "none",
            List.of(),
            new SearchResponseMeta(
                0,
                0,
                Duration.between(start, Instant.now()).toMillis()
            )
        );
    }

    private String normalizeQuery(String raw) {
        if (raw == null) {
            return "";
        }
        return raw.trim().replaceAll("\\s+", " ");
    }

    private int sanitizeLimit(int requestedLimit) {
        return Math.min(Math.max(requestedLimit, 1), MAX_LIMIT);
    }

    private List<String> sanitizeSourceTypes(List<String> sourceTypes) {
        if (sourceTypes == null || sourceTypes.isEmpty()) {
            return List.of("ARTICLE", "CASE");
        }

        return sourceTypes.stream()
            .filter(ALLOWED_SOURCE_TYPES::contains)
            .distinct()
            .toList();
    }

    private List<String> sanitizeVisibility(List<String> visibility) {
        if (visibility == null || visibility.isEmpty()) {
            return List.of("PUBLIC");
        }

        return visibility.stream()
            .filter(v -> v.equals("PUBLIC") || v.equals("INTERNAL"))
            .distinct()
            .toList();
    }

    private void validateEmbedding(float[] embedding, int expectedDimension) {
        if (embedding == null || embedding.length != expectedDimension) {
            throw new IllegalArgumentException("Invalid embedding dimension");
        }

        for (int i = 0; i < embedding.length; i++) {
            if (!Float.isFinite(embedding[i])) {
                throw new IllegalArgumentException("Embedding contains non-finite value at index " + i);
            }
        }
    }
}
```

---

## 18. Response assembler

```java
package com.company.search.service;

import com.company.search.api.SearchMatchReason;
import com.company.search.api.SearchResponseItem;

public class SearchResultAssembler {

    public SearchResponseItem toResponseItem(HybridSearchRow row) {
        return new SearchResponseItem(
            row.sourceType(),
            row.sourceId(),
            row.chunkNo(),
            row.title(),
            sanitizeSnippet(row.snippet()),
            determineReason(row).name(),
            row.finalScore()
        );
    }

    private SearchMatchReason determineReason(HybridSearchRow row) {
        if (row.exactBoost() > 0) {
            return SearchMatchReason.EXACT_IDENTIFIER;
        }

        if (row.lexicalRank() != null && row.vectorRank() != null) {
            return SearchMatchReason.HYBRID;
        }

        if (row.lexicalRank() != null) {
            return SearchMatchReason.LEXICAL;
        }

        if (row.vectorRank() != null) {
            return SearchMatchReason.SEMANTIC;
        }

        if (row.fuzzyRank() != null) {
            return SearchMatchReason.FUZZY;
        }

        return SearchMatchReason.HYBRID;
    }

    private String sanitizeSnippet(String snippet) {
        if (snippet == null) {
            return "";
        }

        // Minimum practical placeholder:
        // In production, HTML-escape all raw text, then convert safe markers to <mark>.
        return snippet;
    }
}
```

Important:

```text
Do not directly trust ts_headline output as safe HTML.
Prefer neutral markers like <<<HL>>> and convert safely in the presentation layer.
```

---

## 19. Timeout and failure handling

Search service perlu punya batas waktu. Failure mode yang harus dibedakan:

| Failure | Response strategy |
|---|---|
| Query kosong | Return empty result |
| Embedding provider timeout | Fallback lexical-only jika acceptable |
| PostgreSQL timeout | 503/timeout response |
| Invalid filter | 400 |
| Invalid source type | Ignore invalid or 400, pilih satu policy |
| Vector dimension mismatch | 500/internal config error |
| Search profile missing | 500/config error |
| Result less than limit | Not error; log/metric |

Pattern fallback:

```java
try {
    return hybridSearch(...);
} catch (EmbeddingTimeoutException ex) {
    return lexicalOnlyFallback(...);
}
```

Untuk regulatory/case search, fallback harus transparan di internal logs:

```json
{
  "event": "search_fallback",
  "reason": "EMBEDDING_TIMEOUT",
  "fallbackMode": "LEXICAL_ONLY"
}
```

---

## 20. Statement timeout per search transaction

PostgreSQL runtime setting dapat diubah dengan `SET LOCAL` dalam transaction. Ini bisa dipakai untuk membatasi query search tertentu tanpa mengubah session global. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-set.html))

Mapper:

```xml
<update id="setSearchStatementTimeout">
    SET LOCAL statement_timeout = '2s'
</update>
```

Usage:

```java
mapper.setSearchStatementTimeout();
mapper.setHnswIterativeScanStrictOrder();
mapper.setHnswEfSearch(profile.hnswEfSearch());
mapper.setHnswMaxScanTuples(profile.hnswMaxScanTuples());
return mapper.searchHybrid(...);
```

---

## 21. Observability

Minimal metrics:

```text
search.request.count
search.latency.p50/p95/p99
search.embedding.duration
search.db.duration
search.result.count
search.zero_result.count
search.fallback.count
search.mode.count
search.profile.count
search.top1.match_reason
search.returned_less_than_limit
search.error.count
```

For pgvector, recall monitoring should compare approximate search to exact search; pgvector README explicitly recommends comparing approximate results with exact results and shows a transaction using `SET LOCAL enable_indexscan = off` to force exact comparison. ([GitHub](https://github.com/pgvector/pgvector))

Structured log:

```json
{
  "event": "hybrid_search",
  "tenantId": 1001,
  "userId": 9001,
  "queryLength": 27,
  "sourceTypes": ["ARTICLE", "CASE"],
  "profile": "balanced-v1",
  "mode": "HYBRID",
  "limit": 10,
  "resultCount": 10,
  "top1MatchReason": "HYBRID",
  "durationMs": 83,
  "embeddingModelVersion": "v1",
  "hnswEfSearch": 150,
  "hnswMaxScanTuples": 30000,
  "requestId": "req-123"
}
```

Jangan log raw query jika query bisa berisi data sensitif.

---

## 22. Test strategy

| Test type | Fokus |
|---|---|
| Unit test | query normalization, mode detection, limit sanitization |
| Mapper test | SQL syntax, resultMap, filter correctness |
| Integration test | PostgreSQL Testcontainer/local DB with extensions |
| Security test | tenant/visibility/status cannot leak |
| Performance test | p95/p99 latency under realistic candidate size |
| Recall test | ANN vs exact comparison |
| Regression test | known query → expected result appears in top-k |
| Failure test | embedding timeout, DB timeout, bad vector dimension |

Example unit test target:

```java
assertEquals(SearchMode.IDENTIFIER, detector.detect("CASE-2026-0001", true));
assertEquals(SearchMode.AUTOCOMPLETE, detector.detect("li", true));
assertEquals(SearchMode.HYBRID, detector.detect("late reporting obligation", true));
```

---

## 23. Integration test seed

```sql
INSERT INTO search_documents (
    tenant_id,
    source_type,
    source_id,
    chunk_no,
    title,
    content,
    status,
    visibility,
    language,
    embedding_provider,
    embedding_model,
    embedding_model_version,
    embedding_dim,
    embedding_status,
    embedding
)
VALUES
(
    1001,
    'ARTICLE',
    501,
    1,
    'License suspension policy',
    'A license may be suspended when the regulated entity fails to submit periodic reporting.',
    'ACTIVE',
    'INTERNAL',
    'english',
    'test',
    'test-embedding',
    'v1',
    3,
    'EMBEDDED',
    '[0.1,0.2,0.3]'::vector
),
(
    1001,
    'CASE',
    701,
    1,
    'Late reporting enforcement case',
    'The regulated entity failed reporting obligations and remediation deadline.',
    'ACTIVE',
    'INTERNAL',
    'english',
    'test',
    'test-embedding',
    'v1',
    3,
    'EMBEDDED',
    '[0.1,0.2,0.31]'::vector
);
```

For real 1536-dimensional embeddings, use generated fixtures or mock embedding client.

---

## 24. Deployment checklist

| Area | Checklist |
|---|---|
| PostgreSQL extension | `vector`, `pg_trgm`, optional `unaccent` enabled |
| Schema | `search_documents` / chunk projection table created |
| FTS | generated `search_vector` and GIN index |
| Trigram | normalized title/name + trigram index |
| Vector | HNSW/IVFFlat index per model version |
| Metadata | B-tree indexes for tenant/status/source/visibility |
| MyBatis | mapper XML registered and tested |
| Transaction | `SET LOCAL` and query in same transaction |
| Embedding | dimension validated, timeout configured |
| Security | tenant/user/visibility filter in SQL |
| Observability | metrics/logs/traces ready |
| Fallback | lexical fallback for embedding failure |
| Benchmark | exact vs ANN recall baseline |
| Migration | re-embedding lifecycle documented |
| Rollback | old model/index retained until validation passes |

---

## 25. Anti-pattern final

| Anti-pattern | Kenapa buruk | Ganti dengan |
|---|---|---|
| Search authorization di Java setelah DB result | Data leak + recall buruk | Filter di SQL |
| `SET hnsw...` session global | Setting bocor di connection pool | `SET LOCAL` dalam transaction |
| `ORDER BY 1 - distance DESC` | Vector index tidak dipakai sesuai pgvector guidance | `ORDER BY embedding <=> vector LIMIT k` |
| `${query}` di MyBatis | SQL injection risk | `#{query}` |
| Semua search lewat vector | Exact keyword/ID buruk | Hybrid |
| Semua search lewat FTS | Paraphrase/semantic miss | Hybrid |
| Autocomplete generate embedding | Mahal dan lambat | Prefix/trigram |
| Tidak filter `embedding_model_version` | Campur vector space | Mandatory model filter |
| Tidak punya exact baseline | Recall ANN tidak diketahui | ANN vs exact benchmark |
| Raw query di log | Compliance risk | hash/mask/anonymize |

---

## 26. Ringkasan integration invariant

```text
1. Jersey hanya boundary HTTP, bukan tempat SQL logic.
2. Service menentukan mode, profile, validation, embedding, transaction.
3. MyBatis menyimpan SQL search yang eksplisit dan reviewable.
4. PostgreSQL melakukan retrieval, filtering, ranking, fusion.
5. SET LOCAL harus satu transaction dengan query.
6. Vector ORDER BY harus distance operator langsung + LIMIT.
7. Authorization selalu di SQL.
8. Search result harus explainable.
9. ANN recall harus dibandingkan dengan exact baseline.
10. Observability wajib mencakup latency dan quality.
```

---

## Seri 10 selesai - seluruh seri 10/10 selesai

Rangkaian **PostgreSQL Full Text Search + Vector Search Database** sudah selesai:

1. PostgreSQL Full Text Search Fundamentals  
2. FTS Document Modeling, `tsvector`, `tsquery`, Generated Column  
3. FTS Indexing, Ranking, Weighting, Highlighting  
4. Fuzzy Search dengan `pg_trgm`, Similarity, Typo Search, Autocomplete  
5. PostgreSQL Vector Search Fundamentals dengan pgvector  
6. Embedding Storage Design, Chunking, Metadata, Versioning  
7. Vector Indexing: Exact Search, HNSW, IVFFlat, Recall vs Latency  
8. Filtered Vector Search: Tenant, Category, Status, Date, Partitioning  
9. Hybrid Search Production Pattern: FTS + Vector + RRF/Reranking + Observability  
10. Java/Jersey/MyBatis Integration Pattern for PostgreSQL Search  

Rekomendasi materi berikutnya yang tidak mengulang seri ini:

**Cheatsheet PostgreSQL Search Operations & Troubleshooting: `EXPLAIN ANALYZE`, GIN pending list, HNSW recall testing, slow query diagnostics, autovacuum impact, index rebuild strategy, and production runbook.**

---

**Sources:**

- [Building RESTful Web Services with Jakarta REST :: Jakarta EE Tutorial :: Jakarta EE Documentation](https://jakarta.ee/learn/docs/jakartaee-tutorial/current/websvcs/rest/rest.html)
- [GitHub - pgvector/pgvector: Open-source vector similarity search for Postgres · GitHub](https://github.com/pgvector/pgvector)
- [MyBatis 3 | Mapper XML Files – mybatis](https://mybatis.org/mybatis-3/sqlmap-xml.html)
- [PostgreSQL: Documentation: 18: SET](https://www.postgresql.org/docs/current/sql-set.html)



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)