# Planning Implementasi: Registrasi User (Junior-Friendly)

## Tujuan
Menambahkan fitur registrasi user baru pada project Bun + Elysia + Drizzle + MySQL, dengan struktur kode yang rapi dan mudah dipelihara.

## Kebutuhan Fitur

### 1) Tabel `users`
Buat/ubah tabel `users` dengan kolom berikut:
- `id` : integer, auto increment, primary key
- `name` : varchar(255), not null
- `email` : varchar(255), not null, unique
- `password` : varchar(255), not null (isi harus hash bcrypt, bukan plain text)
- `created_at` : timestamp, default current_timestamp, not null

### 2) API Registrasi User
Buat endpoint:
- **Method**: `POST`
- **Path**: `/api/users`

Request body (contoh):
```json
{
  "name": "helmi",
  "email": "helmi@gmail.com",
  "password": "12345678"
}
```

Response success:
```json
{
  "data": "OK"
}
```

Response error (email sudah terdaftar):
```json
{
  "error": "email sudah terdaftar"
}
```

## Struktur Folder yang Diinginkan
Di dalam `src/`:
- `routes/` → untuk routing Elysia
- `services/` → untuk business logic

Format nama file:
- route: `user-route.ts`
- service: `user-service.ts`

## Tahapan Implementasi (High-Level)

### Tahap 1 — Persiapan Dependency
1. Pastikan dependency untuk hash password tersedia (`bcrypt` atau `bcryptjs`).
2. Pastikan type/development dependency pendukung juga sesuai kebutuhan project.

**Output tahap ini:** Library hashing siap dipakai.

---

### Tahap 2 — Update Schema Database
1. Tambahkan field `password` pada schema `users` di Drizzle.
2. Pastikan `email` diberi constraint unique.
3. Pastikan `created_at` memiliki default timestamp saat row dibuat.

**Output tahap ini:** Definisi tabel `users` sesuai requirement.

---

### Tahap 3 — Generate & Jalankan Migrasi
1. Generate migrasi dari perubahan schema.
2. Jalankan migrasi ke database lokal MySQL.
3. Verifikasi tabel/kolom sudah terbentuk sesuai spesifikasi.

**Output tahap ini:** Database sudah sinkron dengan schema terbaru.

---

### Tahap 4 — Buat Layer Service (`src/services/user-service.ts`)
1. Buat fungsi service untuk registrasi user.
2. Alur utama service:
   - cek apakah email sudah ada,
   - jika ada → return/throw error `email sudah terdaftar`,
   - jika belum ada → hash password dengan bcrypt,
   - simpan user baru ke database.
3. Pastikan password yang disimpan adalah hasil hash.

**Output tahap ini:** Business logic registrasi terpusat di service.

---

### Tahap 5 — Buat Layer Route (`src/routes/user-route.ts`)
1. Buat route Elysia untuk `POST /api/users`.
2. Validasi body request minimal:
   - `name` wajib,
   - `email` format valid,
   - `password` minimal panjang aman (mis. 8 karakter).
3. Panggil service registrasi dari route.
4. Mapping response:
   - sukses → `{ "data": "OK" }`
   - email duplikat → `{ "error": "email sudah terdaftar" }`

**Output tahap ini:** Endpoint registrasi aktif dan response sesuai kontrak.

---

### Tahap 6 — Registrasi Route ke App Utama
1. Import `user-route.ts` ke entrypoint aplikasi (`src/index.ts`).
2. Daftarkan route agar endpoint `/api/users` bisa diakses.

**Output tahap ini:** Endpoint terhubung ke server.

---

### Tahap 7 — Testing Manual End-to-End
1. Jalankan MySQL (docker compose) dan aplikasi.
2. Uji skenario:
   - registrasi email baru → sukses,
   - registrasi email yang sama → error `email sudah terdaftar`.
3. Pastikan data tersimpan di DB dan kolom `password` berisi hash (bukan plain text).

**Output tahap ini:** Fitur tervalidasi secara fungsional.

---

## Catatan Implementasi untuk Junior/AI Model Ringan
- Ikuti urutan tahapan; jangan lompat ke route sebelum migrasi selesai.
- Pisahkan logic database dari route handler (jangan campur di satu file).
- Jaga response tetap konsisten dengan kontrak issue.
- Fokus implementasi minimal yang bekerja dulu; hindari over-engineering.

## Definition of Done
- Tabel `users` sesuai spesifikasi (termasuk `password` hash dan `created_at`).
- Endpoint `POST /api/users` berjalan sesuai request/response yang ditentukan.
- Duplicate email ditangani dengan pesan error yang tepat.
- Struktur folder dan penamaan file mengikuti ketentuan (`routes/`, `services/`, `user-route.ts`, `user-service.ts`).
- Uji end-to-end berhasil di environment lokal.
