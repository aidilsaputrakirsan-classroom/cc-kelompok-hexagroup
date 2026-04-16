# 📄 Dokumentasi Pengujian UI Sistem

Dokumentasi ini berisikan hasil pengujian antarmuka pengguna (*User Interface*) untuk memastikan bahwa setiap fitur utama seperti menampilkan data, menambah data, mengedit data, mencari data, dan menghapus data dapat berjalan dengan baik sesuai dengan alur sistem.

---

Terdapat 10 test case pada sistem yang perlu dilakukan testing yaitu sebagai berikut.

1. **Cek status API** <br>
Pada tahap ini dilakukan pengecekan apakah sistem berhasil terhubung dengan API atau *backend*.
<img src="image/test1-api-connected.png">
Berdasarkan gambar tersebut menunjukkan bahwa sistem menampilkan status API Connected yang menandakan bahwa sistem telah berhasil terhubung dengan API atau frontend berhasil berkomunikasi dengan backend.<p>

2. **Items dari Modul 2 muncul di daftar** <br>
Setelah koneksi API berhasil, sistem akan mengambil data item dari database dan menampilkannya pada daftar item di halaman utama. 
<img src="image/test2-items-modul2.png">
Berdasarkan gambar tersebut menunjukkan bahwa sistem berhasil mengambil data item dari database modul 2 dan menampilkannya pada daftar item di manajemen surat. <p>

3. **Tambah item baru via form** <br>
Pada tahap ini, pengguna mencoba menambahkan data item baru melalui form input surat baru.
<img src="image/test3-tambah-item.png">
Berdasarkan gambar tersebut, saya mencoba menambahkan item baru yaitu Surat Izin dengan jenis surat izin dan berdeskripsikan alasan berupa permohonan izin tidak dapat hadir karena ada acara keluarga. Kemudian mengklik tambah item untuk menyimpan data item tersebut dan sistem memproses permintaan penambahan item surat baru.

4. **Item muncul di daftar** <br>
Setelah permintaan penambahan item surat baru sebelumnya telah berhasil maka item tersebut akan tersimpan dalam daftar item pada sistem manajemen surat. 
<img src="image/test4-item-baru-muncul.png">
Berdasarkan gambar tersebut menunjukkan bahwa item surat baru berhasil ditampilkan pada daftar item yang ada pada sistem manajemen surat, item tersebut berupa Surat Izin dengan jenis surat izin dan berdeskripsikan alasan berupa permohonan izin tidak dapat hadir karena ada acara keluarga.

5. **Klik Edit pada item** <br>
Pada tahap ini pengguna memilih salah satu item yang ada pada daftar dan mengklik tombol Edit untuk mengubah isi dari item tersebut.
<img src="image/test5-klik-edit.png">
Berdasarkan gambar tersebut, setelah saya mengklik tombol edit maka sistem menampilkan halaman edit berupa form edit dari item yang telah dipilih. Melalui halaman ini saya dapat mengubah data pada item Surat izin.

