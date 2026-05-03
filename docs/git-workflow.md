# Git Workflow Guide
Dokumen ini menjelaskan standar alur kerja Git untuk memastikan konsistensi kode, kemudahan tracking perubahan, dan kualitas deployment.

## Branch Naming
Branch Naming merupakan aturan pemberian nama untuk setiap cabang (branch) yang kita buat di Git.

| Tipe | Kapan Digunakan | Contoh |
|------|-----------------|--------|
| `feature/` | Menambah fitur baru yang sebelumnya belum ada | `feature/user-profile` |
| `fix/` | Memperbaiki bug atau error yang ditemukan | `fix/login-token-expired` |
| `docs/` | Perubahan pada dokumentasi (README, Guide, API docs) | `docs/api-docs-update` |
| `refactor/` | Perbaikan kode tanpa mengubah fungsi/fitur | `refactor/split-crud-service` |
| `chore/` | Maintenance, config, dependencies | `chore/update-requirements` |


## Commit Convention
Commit Convention adalah aturan cara menulis pesan saat kamu melakukan `git commit -m "..."`.

| Tipe | Kapan | Contoh |
|------|-------|--------|
| `feat` | Fitur baru | `feat: add user profile page` |
| `fix` | Bug fix | `fix: resolve JWT token expiry issue` |
| `docs` | Dokumentasi | `docs: update API endpoint list in README` |
| `refactor` | Refactoring | `refactor: extract auth logic to separate module` |
| `chore` | Maintenance | `chore: update python dependencies` |
| `test` | Testing | `test: add unit tests for CRUD operations` |
| `style` | Formatting | `style: fix indentation in docker-compose.yml` |


## PR Process
**Pull Request (PR)** adalah permintaan untuk menggabungkan (merge) kode dari satu branch ke branch lain. PR bukan sekadar "merge button" — PR adalah **tempat diskusi, review, dan quality gate**.

Adapun Tahapan untuk Pull Request (PR) : 
1. Pastikan branch kamu sudah mengambil perubahan terbaru dari branch tujuan.
    ```
    # 1. Pastikan main terbaru
    git checkout main
    git pull origin main

    # 2. Buat branch baru
    git checkout -b chore/add-codeowners

    # 3. Buat folder & file
    mkdir -p .github
    # Buat file .github/CODEOWNERS (isi sesuai di atas)

    # 4. Commit & push
    git add .github/CODEOWNERS
    git commit -m "chore: add CODEOWNERS for automatic reviewer assignment"
    git push origin chore/add-codeowners
    ```
2. Buka GitHub → repository tim
3. Akan muncul banner: "chore/add-codeowners had recent pushes — Compare & pull request"
4. Klik Compare & pull request
5. Isi PR:
    - Title: chore: add CODEOWNERS for automatic reviewer assignment
    - Description:
        ```
        ## Perubahan
        - Menambahkan file `.github/CODEOWNERS`
        - Setiap area kode memiliki reviewer otomatis sesuai peran tim

        ## Checklist
        - [x] Username GitHub sudah benar
        - [x] Semua area tercakup (backend, frontend, docker, docs)
        ```
6. Klik Create pull request
7. Minta 1 anggota tim untuk review & approve
8. Setelah approved → Squash and merge
9. Hapus branch setelah merge (klik "Delete branch")


## Review Guidelines
### Langkah 1 : Review PR Teman
Cara review di GitHub:
1. Buka PR yang perlu Anda review
2. Klik tab **Files changed**
3. Baca kode yang berubah (hijau = tambahan, merah = dihapus)
4. **Tambahkan komentar** pada baris tertentu:
   - Klik ikon `+` di sebelah kiri nomor baris
   - Tulis komentar review
   - Klik **Start a review** (BUKAN "Add single comment")
5. Setelah selesai review semua file, klik **Review changes** (tombol hijau di kanan atas)
6. Pilih salah satu:
   - **Comment** — komentar umum, tidak approve/reject
   - **Approve** ✅ — kode sudah bagus, boleh merge
   - **Request changes** ❌ — perlu perbaikan sebelum merge
7. Klik **Submit review**

#### Contoh Review Comments

Setiap reviewer **WAJIB** memberikan minimal 3 komentar:

```
✅ CONTOH REVIEW YANG BAIK:

1. [Praise] "Nice! Error handling di health endpoint ini solid 👍"

2. [Suggestion] "Saran: tambahkan try-catch di sini untuk handle 
   kasus database timeout. Sekarang kalau DB lambat, endpoint bisa hang."

3. [Question] "Kenapa pakai status code 503? Apakah lebih tepat 
   pakai 500 Internal Server Error?"

❌ CONTOH REVIEW YANG BURUK:

1. "Kodenya salah" (tidak jelaskan apa yang salah)
2. "LGTM" tanpa benar-benar membaca kode
3. "..." (komentar kosong / tidak bermakna)
```

### Langkah 2: Perbaikan Berdasarkan Review (10 menit)

Setelah menerima feedback, perbaiki kode:

```bash
# Pastikan masih di branch fitur Anda
git checkout feature/health-endpoint

# Lakukan perbaikan sesuai feedback
# ... edit kode ...

# Commit perbaikan
git add .
git commit -m "fix: address review feedback — add error handling"
git push origin feature/health-endpoint
```

PR di GitHub otomatis ter-update dengan commit baru.

### Langkah 3: Approve & Merge (10 menit)

Setelah perbaikan, reviewer melakukan:
1. Cek perbaikan di tab **Files changed**
2. Klik **Review changes** → **Approve** ✅
3. Developer (pembuat PR) klik **Squash and merge**
4. Edit squash commit message jika perlu
5. Klik **Confirm squash and merge**
6. Klik **Delete branch** untuk cleanup


