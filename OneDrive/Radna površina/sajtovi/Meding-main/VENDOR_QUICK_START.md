# 🚀 Vendor Management - Quick Start (5 minuta)

## 1️⃣ Pokreni Aplikaciju

```bash
npm run dev
```

## 2️⃣ Uloguj Se

Otvori: **http://localhost:5173/admin/login**

Uloguj se sa admin kredencijalima.

## 3️⃣ Otvori Vendor Management

U Admin Panelu klikni na **"🏢 Vendori"** karticu.

Ili direktno: **http://localhost:5173/admin/vendors**

---

## ✨ Šta Možeš Raditi?

### ➕ Dodaj Novog Vendora
1. Klikni **"Dodaj Novog Vendora"** dugme (gore desno)
2. Popuni **Naziv** (obavezno)
3. Opciono: Dodaj telefon, email, adresu, grad, državu, PIB, MB, website
4. Klikni **"Dodaj Vendora"**
5. ✅ Vendor je kreiran!

### 🔍 Pretraži Vendore
1. Kucaj u **Search bar** na vrhu
2. Pretraga radi automatski dok kucaš
3. Pretraga kroz: Naziv, Grad, Državu, Email, Kontakt osobu

### ✏️ Izmeni Vendora
1. Pronađi vendora u tabeli
2. Klikni **✏️** (Edit) ikonu
3. Izmeni potrebna polja
4. Klikni **"Sačuvaj Izmene"**
5. ✅ Izmene su sačuvane!

### 🗑️ Obriši Vendora
1. Pronađi vendora u tabeli
2. Klikni **🗑️** (Delete) ikonu
3. Potvrdi brisanje u dijalogu
4. ✅ Vendor je obrisan!

---

## 📋 Vendor Polja

| Polje | Tip | Obavezno |
|-------|-----|----------|
| **Naziv** | Text | ✅ DA |
| Kontakt Osoba | Text | ❌ Ne |
| Telefon | Text | ❌ Ne |
| Email | Email | ❌ Ne |
| Adresa | Text | ❌ Ne |
| Grad | Text | ❌ Ne |
| PTT Broj | Number | ❌ Ne |
| Država | Text | ❌ Ne |
| PIB | Text | ❌ Ne |
| Matični Broj | Text | ❌ Ne |
| Website | URL | ❌ Ne |

---

## 🎨 Features

- ✅ Real-time pretraga
- ✅ Sortiranje po nazivu (A-Z)
- ✅ Loading stanja
- ✅ Error handling
- ✅ Responsive dizajn (Mobile + Desktop)
- ✅ Modern UI sa animacijama
- ✅ Modal forme za Add/Edit

---

## ❓ Problemi?

### Modal se ne otvara?
**Rešenje:** Refresh stranicu (Ctrl+R)

### Nema vendora u tabeli?
**Rešenje:** 
1. Proveri da li je Supabase konekcija aktivna
2. Dodaj prvog vendora koristeći "Dodaj Novog Vendora" dugme

### Greška pri čuvanju?
**Rešenje:**
1. Proveri da li si uneo **Naziv** (obavezno polje)
2. Proveri Supabase RLS policies

---

## 📞 Support

Za detaljna uputstva, proveri:
- **VENDOR_MANAGEMENT_UPUTSTVO.md** - Kompletna dokumentacija
- **VENDOR_MANAGEMENT_README.md** - Tehnički pregled

---

**Gotovo! Srećno korišćenje! 🎉**
