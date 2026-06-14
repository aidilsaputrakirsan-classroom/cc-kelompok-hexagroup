# Reflection Paper – Lead CI/CD & Deploy

## Pendahuluan
Di proyek SIKASI ini, saya mendapat role sebagai Lead CI/CD & Deploy. Kalau simplenya, tugas saya adalah "memastikan kode bisa otomatis ditest, di-build, dan di-jalankan tanpa error". Proyek dimulai dari sistem monolith biasa pakai FastAPI dan React, terus berkembang jadi Docker containers, setup automation di GitHub Actions, dan akhirnya jadi microservices yang lebih rumit dan kompleks tapi tidak sampai dideploy.

## Refleksi atas Keputusan Teknis dan Kontribusi Tim

Dalam membangun infrastruktur CI/CD, saya mengambil keputusan untuk menggunakan Docker sebagai foundation containerization dengan image yang lean. Pilihan image `python:3.12-slim` untuk backend dan `node:20-alpine` untuk frontend mempertimbangkan efisiensi ukuran dan kecepatan pull time. Keputusan ini sejalan dengan arahan modul dan best practices industri.

Pada tahap implementasi GitHub Actions, saya merancang workflow dengan tahapan yang terstruktur: test → build → deploy. Pendekatan ini mencegah deployment kode yang tidak lulus validasi otomatis. Namun, saya menyadari bahwa testing otomatis ini tidak akan berjalan maksimal tanpa kontribusi dari Lead Backend dan Lead QA. Khususnya:

- **Lead Backend** (Achmad Bayhaqi) berkontribusi dalam memastikan setiap service memiliki endpoint health check yang tepat, yang menjadi fondasi dari orchestration yang baik.
- **Lead QA** (Nilam Ayu) menyediakan test suite yang komprehensif, sehingga CI pipeline memiliki kriteria validasi yang jelas

Pada fase microservices, saya membuat strategi configuration management dengan tiga file docker-compose terpisah (base, development, production). Namun, implementasi deployment ke production terkendala oleh limitation Railway yang hanya menerima maksimal 3 service, sementara project SIKASI membutuhkan 4 service (auth, item, finance, letters) plus database dan frontend.

Struktur logging terstruktur (JSON) yang akhirnya saya implementasikan adalah hasil kolaborasi—meskipun awalnya merupakan tanggung jawab Lead Backend, saya membantu menyelesaikannya agar observability system tercapai. Kontribusi Lead Backend dalam memahami requirement logging dan Lead QA dalam testing correlation ID flow sangat membantu kesuksesan fitur ini.

## Tantangan, Solusi, dan Pembelajaran Teknis

**Masalah Line Ending Windows dengan Bash Scripts**

Pada tahap awal setup, entrypoint script `.sh` mengalami kegagalan eksekusi karena perbedaan line ending antara Windows (CRLF) dan Linux/Bash (LF). Docker menghasilkan error `no such file or directory` meskipun file jelas ada. Solusi yang diterapkan adalah memodifikasi Dockerfile untuk menjalankan `dos2unix` sebelum execution, atau mengkonfigurasi Git dengan `core.autocrlf=true` di workstation Windows. Pembelajaran dari incident ini adalah pentingnya standardisasi developer environment specification di dalam dokumentasi.

**Database Initialization Timeout di GitHub Actions**

Ketika mengimplementasikan automated testing di GitHub Actions, test suite sering gagal dengan timeout error karena PostgreSQL service container belum selesai initialization saat test mulai dijalankan. Solusi melibatkan konfigurasi service container eksplisit dalam workflow YAML dengan health check yang tepat dan `start_period: 10s` untuk memberikan database waktu startup yang memadai. Ini menunjukkan pentingnya understanding terhadap Docker health check lifecycle.

**Docker Compose YAML Structure Validation**

Saat menambahkan item-service ke docker-compose.yml, terjadi error validasi karena indentasi yang tidak konsisten menyebabkan service ter-nesting di dalam logging section service lain. Error yang dihasilkan (`additional properties not allowed`) cukup cryptic untuk diagnosis cepat. Pembelajaran dari incident ini adalah necessity dari pre-deployment validation menggunakan `docker compose config`. Hal ini juga mengungkapkan perlunya code review process yang lebih ketat untuk infrastructure-as-code.

**Service Dependency Restart Loop**

Pada implementasi awal microservices, dependency chain yang circular (A depends B, B depends C, C depends A) menyebabkan restart loop berkelanjutan. Root cause analysis menunjukkan bahwa health check command di database service tidak optimal. Setelah memperbaiki health check specification dan merestruktur dependency graph menjadi linear, sistem stabilitas meningkat signifikan. Learning point ini relevan dengan prinsip system design yang fundamental.

**Import Statement Missing dalam Logging Integration**

Incident sederhana namun signifikan terjadi ketika logging middleware implementation tidak didahului oleh `import logging` di main.py, menghasilkan `NameError` runtime. Meskipun terlihat trivial, incident ini mengungkapkan pentingnya pre-deployment checklist dan code review rigor.

## Analisis Kontribusi Anggota Tim dalam Konteks CI/CD

Dalam konteks CI/CD pipeline, saya mengobservasi kontribusi penting dari berbagai role:

- **Lead Frontend** (Indah Nur Fortuna) memastikan bahwa dependency resolution dan build process frontend dapat ter-integrate dengan workflow CI, dan menyediakan artifact yang siap untuk deployment
- **Lead Backend** (Achmad Bayhaqi) membantu dalam struktur application yang mendukung containerization, serta endpoint health check yang menjadi prerequisite untuk orchestration. Namun kendala dari kontribusi backend sendiri masih kurang dalam hal komunikasi dan di minggu-minggu terakhir dalam project ini, karena tidak merespons anggota lain dan tidak mengerjakan tanggung jawabnya di 2 minggu terakhir. Sehingga menyulitkan anggota yang lain.
- **Lead QA** (Nilam Ayu) menyediakan test automation framework yang komprehensif sehingga pipeline memiliki validation criteria yang jelas
- **Lead DevOps** (Alfiani Dwiyuniarti) fokus pada environment configuration dan deployment orchestration, yang komplementer dengan fokus CI/CD saya

Interdependensi antar role ini menunjukkan bahwa CI/CD pipeline quality tidak dapat dicapai melalui effort single person, melainkan melalui koordinasi lintas tim yang baik.

## Pembelajaran dan Implikasi untuk Praktik Industri

Dari pengalaman ini, ada beberapa hal penting yang saya belajar yang bisa diterapkan di proyek lain:

1. **Otomasi itu alat bantu, bukan jaminan kesuksesan**: Otomasi testing dan deployment hanya berfungsi baik kalau aplikasi sudah dirancang dengan baik dan test yang ada memang comprehensive. Tidak bisa hanya andalkan otomasi tanpa kerja sama tim Backend dan QA yang solid.

2. **Konfigurasi harus flexible, bukan hard-coded**: Jangan "hard-code" nilai-nilai langsung di kode. Gunakan file konfigurasi atau environment variable sehingga kode yang sama bisa berjalan di local, staging, atau production hanya dengan mengubah file konfigurasi. Ini membuat deployment jauh lebih aman dan terhindar dari mistake.

3. **Logging yang bagus harus direncanakan dari awal**: Jangan menambahkan logging hanya saat ada masalah. Rencanakan dari awal bagaimana sistem akan di-monitor—JSON logging dan correlation ID sangat membantu saat debugging production, terutama di microservices yang kompleks.

4. **Perhatikan detail environment developer**: Masalah line ending Windows vs Linux terlihat kecil tapi bisa membuang waktu debugging. Sebaiknya dokumentasikan environment setup secara jelas: versi tools mana yang dipakai, bagaimana Git dikonfigurasi, dll.

5. **Validasi sebelum apply**: Sebelum deploy, gunakan tools untuk validasi konfigurasi (seperti `docker compose config`). Ini simple tapi sangat efektif—early feedback mencegah banyak masalah di production.

## Kesimpulan

Perjalanan implementasi CI/CD pipeline dalam project SIKASI melalui berbagai fase—dari monolith, containerization, automation, hingga microservices—mengajarkan pentingnya systematic approach terhadap infrastructure quality. Meskipun menghadapi berbagai tantangan teknis, learning agility dan collaboration dengan tim yang solid memungkinkan kami untuk mencapai status quo yang reasonably robust.

Tidak ada fase deployment yang sempurna pertama kali; yang penting adalah establishing feedback loop yang cepat dan continuous improvement mindset. Pengalaman ini memberikan confidence bahwa DevOps practices dapat difundamentalan dengan baik, meskipun infrastruktur production yang full-scale masih tertunda karena constraint eksternal (Railway service limit).

Untuk project-project mendatang, rekomendasi saya adalah: invest time dalam automation dari awal phase, establish clear code review standard untuk infrastructure-as-code, dan maintain close collaboration dengan cross-functional team, terutama QA dan Backend untuk memastikan pipeline quality.