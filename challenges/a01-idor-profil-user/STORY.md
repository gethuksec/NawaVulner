# Studi kasus (fiksi): a01-idor-profil-user

## ID

**Portal Layanan Mandiri — Kota Sariwangi (fiksi)**  
Aplikasi web untuk warga mengajukan perizinan dan melacak status. Setiap pemohon punya **halaman profil ringkas** (nama, nomor tiket, status berkas). Karena kesalahan desain akses, parameter identitas pengguna dalam URL/API dapat disalahgunakan untuk melihat profil pemohon lain — klasik **Insecure Direct Object Reference (IDOR)**.

*Lingkungan ini hanya untuk pelatihan keamanan.*

## EN

**Self-service citizen portal — fictional “Sariwangi City”**  
Residents submit permits and track status. Each applicant has a **short profile page** (name, ticket id, file status). Access controls are flawed so that **user identifiers in URLs or API calls can be manipulated** to view other applicants’ profiles — a textbook **IDOR** case.

*Training use only.*
