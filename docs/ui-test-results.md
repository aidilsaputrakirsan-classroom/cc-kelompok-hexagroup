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
    Berdasarkan gambar tersebut, saya mencoba menambahkan item baru yaitu Surat Izin dengan jenis surat izin dan berdeskripsikan alasan berupa permohonan izin tidak dapat hadir karena ada acara keluarga. Kemudian mengklik tambah item untuk menyimpan data item tersebut dan sistem memproses permintaan penambahan item surat baru. <p>

4. **Item muncul di daftar** <br>
    Setelah permintaan penambahan item surat baru sebelumnya telah berhasil maka item tersebut akan tersimpan dalam daftar item pada sistem manajemen surat. 
    <img src="image/test4-item-baru-muncul.png">
    Berdasarkan gambar tersebut menunjukkan bahwa item surat baru berhasil ditampilkan pada daftar item yang ada pada sistem manajemen surat, item tersebut berupa Surat Izin dengan jenis surat izin dan berdeskripsikan alasan berupa permohonan izin tidak dapat hadir karena ada acara keluarga.<p>

5. **Klik Edit pada item** <br>
    Pada tahap ini pengguna memilih salah satu item yang ada pada daftar dan mengklik tombol Edit untuk mengubah isi dari item tersebut.
    <img src="image/test5-klik-edit.png">
    Berdasarkan gambar tersebut, setelah saya mengklik tombol edit maka sistem menampilkan halaman edit berupa form edit dari item yang telah dipilih. Melalui halaman ini saya dapat mengubah data pada item Surat izin.<p>

6. **Form edit terisi data lama, ubah harga dan klik update** <br>
    Berdasarkan gambar pada test 5 menunjukkan bahwa sistem menampilkan halaman form edit yang berisikan data lama dari item yang telah dipilih sebelumnya.
    <img src="image/test6-ubah-harga-item.png">
    Selanjutnya saya ingin mengubah deskripsi pada Surat Izin yang awalnya berupa permohonan izin tidak dapat hadir karena ada acara keluarga menjadi permohonan izin tidak dapat hadir karena ada acara keluarga di luar kota. Setelah selesai mengubah, klik tombol simpan perubahan agar sistem dapat mengirimkan permintaan untuk mengubah data item surat tersebut.
    <img src="image/test6-item-ubah-muncul.png">
    Setelah sistem menerima permintaan pengubahan data item surat, maka item surat tersebut akan muncul pada daftar item manajemen surat.<p>

7. **Mencari item via SearchBar** <br>
    Pada tahap ini pengguna mencoba menggunakan fitur SearchBar untuk memudahkan dalam pencarian item tertentu dengan memasukkan kata kunci.
    <img src="image/test7-cari-item.png">
    Berdasarkan gambar tersebut, saya ingin mencari item Suart Izin menggunakan fitur SearchBar dengan memasukkan kata kunci berupa Surat Izin. Sistem akan menampilkan daftar item yang sesuai dengan kata kunci pencarian, disini saya mencari Surat Izin sehingga yang tampil pada daftar item hanya Surat Izin saja yang menandakan bahwa SearchBar berhasil dijalankan.<p>

8. **Hapus item, confirm dialog muncul** <br>
    Pada tahap ini pengguna menghapus item dengan mengklik tombol delete pada item yang ingin dihapus.
    <img src="image/test8-hapus-item.png">
    Berdasarkan gambar tersebut, saya memilih item Surat Izin untuk dihapus dengan mengklik tombol delete dan sistem akan menampilkan sebuah konfirmasi kepada saya untuk menyetujui penghapusan pada item tersebut.<p>

9. **Item hilang dari daftar** <br>
    <img src="image/test9-item-hilang.png">
    Setelah saya menyetujui konfirmasi penghapusan item laptop, sistem akan memproses permintaan penghapusan yang telah saya kirimkan. Selanjutnya jika proses tersebut berhasil maka sistem akan memperbarui daftar item,  dimana item yang telah dipilih untuk penghapusan sebelumnya akan hilang dari daftar item.<p>

10. **Hapus semua item, empty state muncul** <br>
    Pada tahap ini pengguna mencoba untuk menghapus semua item yang ada pada daftar item dalam sistem dengan mengklik tombol delete dan melakukan konfirmasi persetujuan penghapusan item. 
    <img src="image/test10-hapus-item.png">
    Disini saya mencoba untuk menghapus semua item yang tersisa sebelumnya berupa surat permohonan, pemberitahuan libur, undangan delegasi, dan surat izin dengan melakukan konfirmasi persetujuan penghapusan item-item. Kemudian sistem akan memproses permintaan tersebut.
    <img src="image/test10-empty-state.png">
    Setelah proses penghapusan yang dilakukan sistem berhasil, maka sistem tidak akan menampilkan daftar item kembali karena item yang ada sebelumnya telah dihapus dan saat ini sistem menampilkan sebuah empty state yang menunjukkan bahwa tidak ada item dalam sistem ini. <p>

---

## (Tambahan) Dokumentasi Komponen Notifikasi/Toast
Penambahan fitur notifikasi/toast ini adalah untuk memberikan respon secara langsung ke pengguna ketika pengguna melakukan aktifitas menambahkan, mengedit, atau menghapus. Dengan notifikasi akan muncul secara otomatis dan menghilang otomatis dalam 3 detik. Dengan adanya fitur ini, pengguna dapat mengetahui status dari aktifitas yang dilakukan.

1. Menambahkan Items
<img src="image/notif-tambah.png">
Ini dokumentasi yang menunjukkan notifikasi toast yang muncul ketika pengguna berhasil menambahkan item baru. Sistem menampilkan pesan “Item berhasil ditambahkan” sebagai tanda bahwa data telah berhasil diproses dan disimpan oleh sistem.

2. Edit Items
<img src="image/notif-edit.png">
Ini dokumentasi yang menunjukkan notifikasi toast yang muncul setelah pengguna berhasil mengedit data item. Pesan “Item berhasil diperbarui” ditampilkan sebagai konfirmasi bahwa perubahan data telah berhasil disimpan oleh sistem.

3. Hapus Items
<img src="image/notif-hapus.png">
Ini dokumentasi yang menunjukkan notifikasi toast yang muncul setelah pengguna berhasil menghapus item dari daftar. Sistem menampilkan pesan “Item berhasil dihapus” sebagai konfirmasi bahwa data item telah berhasil dihapus dari sistem.