# Production Testing

## 📊 Perbandingan Dev vs Production 
Berdasarkan hasil pengujian manual (*smoke testing*) yang telah dilakukan, seluruh fungsionalitas utama pada lingkungan produksi (Railway) telah berjalan setara dengan lingkungan lokal (localhost).

| Fitur / Test | Development (localhost) | Production (Railway) | Status | Catatan |
| :--- | :---: | :---: | :---: | :--- |
| **Backend `/health`** | ✅ | ✅ | PASS | Database berstatus `connected` |
| **Register User** | ✅ | ✅ | PASS | Berhasil membuat user baru di cloud DB |
| **Login** | ✅ | ✅ | PASS | JWT Token berhasil digenerate dan disimpan |
| **Create Item** | ✅ | ✅ | PASS | Data tersimpan langsung ke PostgreSQL |
| **Read Items** | ✅ | ✅ | PASS | Komponen frontend berhasil me-render list |
| **Update Item** | ✅ | ✅ | PASS | Perubahan berhasil dikirim via metode PUT/PATCH |
| **Delete Item** | ✅ | ✅ | PASS | Data terhapus via metode DELETE |
| **Search** | ✅ | ✅ | PASS | Query pencarian berfungsi normal |

Dokumentasi

### **Backend `/health`**

| Fitur / Test | Development (localhost) | Production (Railway) |
| :--- | :---: | :---: |
| **Backend `/health`** | <img src="image/production_test/1_localhost.png"> | <img src="image/production_test/1_localhost.png"> |
| **Register User** | <img src="image/production_test/2_localhost.png"> <br> <img src="image/production_test/2_localhost_berhasil.png"> | <img src="image/production_test/2_railway.png"> <br> <img src="image/production_test/2_railway_berhasil.png"> |
| **Login** | <img src="image/production_test/3_localhost.png"> <br> <img src="image/production_test/3_localhost_berhasil.png"> | <img src="image/production_test/3_railway.png"> <br> <img src="image/production_test/3_railway_berhasil.png"> |
| **Create Item** | <img src="image/production_test/4_localhost.png"> <br> <img src="image/production_test/4_localhost_berhasil.png"> | <img src="image/production_test/4_railway.png"> <br> <img src="image/production_test/4_railway_berhasil.png"> |
| **Read Items** | <img src="image/production_test/5_localhost.png"> | <img src="image/production_test/5_railway.png"> |
| **Update Item** | <img src="image/production_test/6_localhost.png"> <br> <img src="image/production_test/6_localhost_berhasil.png"> | <img src="image/production_test/6_railway.png"> <br> <img src="image/production_test/6_railway_berhasil.png"> |
| **Delete Item** | <img src="image/production_test/7_localhost.png"> <br> <img src="image/production_test/7_localhost_berhasil.png"> | <img src="image/production_test/7_railway.png"> <br> <img src="image/production_test/7_railway_berhasil.png"> |
| **Search** | <img src="image/production_test/8_localhost.png"> | <img src="image/production_test/8_railway.png"> |
