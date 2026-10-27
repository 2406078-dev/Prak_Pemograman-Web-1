
let daftarProyek = [
    {
        id: Date.now() + 1,
        judul: "Sistem Manajemen Inventori Database",
        kategori: "Web App",
        anggaran: 7500000,
        selesai: true
    },
    {
        id: Date.now() + 2,
        judul: "Aplikasi Kasir & Perhitungan Transaksi",
        kategori: "Desktop App",
        anggaran: 3000000,
        selesai: false
    },
    {
        id: Date.now() + 3,
        judul: "Website Portofolio Pribadi",
        kategori: "Web App",
        anggaran: 1500000,
        selesai: true
    }
];

let kataKunci = ""; 

const formProyek       = document.getElementById("form-proyek");
const inputJudul       = document.getElementById("judul-proyek");
const inputKategori    = document.getElementById("kategori-proyek");
const inputAnggaran    = document.getElementById("anggaran-proyek");
const inputStatus      = document.getElementById("status-proyek");
const inputCari        = document.getElementById("cari-proyek");

const errorJudul       = document.getElementById("error-judul");
const errorAnggaran    = document.getElementById("error-anggaran");

const containerKartu   = document.getElementById("daftar-kartu-proyek");
const statTotal        = document.getElementById("stat-total");
const statSelesai      = document.getElementById("stat-selesai");
const statProses       = document.getElementById("stat-proses");
const statAnggaran     = document.getElementById("stat-anggaran");


function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// ============================================================
// FITUR 3: RENDER KARTU + AKSI (toggle & hapus)
// ============================================================
function renderKartu() {
    // FITUR 2: filter berdasarkan kata kunci
    const proyekTampil = daftarProyek.filter(p =>
        p.judul.toLowerCase().includes(kataKunci.toLowerCase())
    );

    // empty state
    if (proyekTampil.length === 0) {
        containerKartu.innerHTML = `
            <div class="empty-state">
                <p>Tidak ada proyek yang cocok${kataKunci ? ` dengan kata kunci "<b>${escapeHTML(kataKunci)}</b>"` : ""}.</p>
            </div>`;
        renderStatistik();
        return;
    }

    containerKartu.innerHTML = proyekTampil.map(p => `
        <article class="kartu-proyek" data-id="${p.id}">
            <header>
                <h3>${escapeHTML(p.judul)}</h3>
                <p>
                    Kategori: <b>${escapeHTML(p.kategori)}</b> |
                    Anggaran: <b>${formatRupiah(p.anggaran)}</b>
                </p>
                <span class="badge ${p.selesai ? "badge-selesai" : "badge-proses"}">
                    ${p.selesai ? "Selesai" : "Dalam Pengerjaan"}
                </span>
            </header>
            <div class="aksi-kartu">
                <button class="btn-toggle" data-id="${p.id}">
                    ${p.selesai ? "Tandai Dalam Pengerjaan" : "Tandai Selesai"}
                </button>
                <button class="btn-hapus" data-id="${p.id}">Hapus Proyek</button>
            </div>
        </article>
    `).join("");

    // pasang listener tombol aksi (event delegation)
    containerKartu.querySelectorAll(".btn-toggle").forEach(btn => {
        btn.addEventListener("click", () => toggleStatus(Number(btn.dataset.id)));
    });
    containerKartu.querySelectorAll(".btn-hapus").forEach(btn => {
        btn.addEventListener("click", () => hapusProyek(Number(btn.dataset.id)));
    });

    renderStatistik();
}

// ============================================================
// STATISTIK
// ============================================================
function renderStatistik() {
    const total     = daftarProyek.length;
    const selesai   = daftarProyek.filter(p => p.selesai).length;
    const proses    = total - selesai;
    const anggaran  = daftarProyek.reduce((sum, p) => sum + p.anggaran, 0);

    statTotal.textContent    = total;
    statSelesai.textContent  = selesai;
    statProses.textContent   = proses;
    statAnggaran.textContent = formatRupiah(anggaran);
}

// ============================================================
// FITUR 3a: Toggle status
// ============================================================
function toggleStatus(id) {
    daftarProyek = daftarProyek.map(p =>
        p.id === id ? { ...p, selesai: !p.selesai } : p
    );
    renderKartu();
}

// ============================================================
// FITUR 3b: Hapus proyek
// ============================================================
function hapusProyek(id) {
    if (!confirm("Yakin ingin menghapus proyek ini?")) return;
    daftarProyek = daftarProyek.filter(p => p.id !== id);
    renderKartu();
}

// ============================================================
// FITUR 1: Submit form + validasi
// ============================================================
formProyek.addEventListener("submit", function (e) {
    e.preventDefault(); // cegah reload

    const judul    = inputJudul.value.trim();
    const kategori = inputKategori.value;
    const anggaran = Number(inputAnggaran.value);
    const selesai  = inputStatus.checked;

    // reset error
    errorJudul.style.display = "none";
    errorAnggaran.style.display = "none";
    inputJudul.classList.remove("input-error");
    inputAnggaran.classList.remove("input-error");

    let valid = true;

    // validasi judul
    if (judul === "") {
        errorJudul.textContent = "Judul proyek tidak boleh kosong.";
        errorJudul.style.display = "block";
        inputJudul.classList.add("input-error");
        valid = false;
    }

    // validasi anggaran
    if (isNaN(anggaran) || anggaran <= 0) {
        errorAnggaran.textContent = "Estimasi anggaran harus lebih besar dari 0.";
        errorAnggaran.style.display = "block";
        inputAnggaran.classList.add("input-error");
        valid = false;
    }

    if (!valid) return;

    // buat objek proyek baru
    const proyekBaru = {
        id: Date.now(),
        judul: judul,
        kategori: kategori,
        anggaran: anggaran,
        selesai: selesai
    };

    // masukkan ke array (spread operator)
    daftarProyek = [...daftarProyek, proyekBaru];

    // reset form
    formProyek.reset();

    // render ulang
    renderKartu();
});

// ============================================================
// FITUR 2: Live search
// ============================================================
inputCari.addEventListener("input", function (e) {
    kataKunci = e.target.value;
    renderKartu();
});

// ============================================================
// INIT
// ============================================================
renderKartu();