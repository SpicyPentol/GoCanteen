// =========================================================================
// SCRIPT.JS - LOGIKA APLIKASI KANTIN SEKOLAH
// Semua data disimpan di memori browser (tanpa database / tanpa backend)
// Tampilan bersih dan rapi tanpa emoji
// =========================================================================

// =========================================================================
// 1. DATA MENU KANTIN
// Terbagi dalam 3 kategori: Makanan, Camilan, dan Minuman.
// =========================================================================
const DAFTAR_MENU = [
  // --- KATEGORI 1: MAKANAN ---
  {
    id: "mkn-1",
    nama: "Nasi Ayam Geprek",
    kategori: "makanan",
    harga: 10000,
    deskripsi: "Nasi dengan ayam goreng dan sambal yang pedas gurih",
    gambar: "images/Geprek.png"  // <-- Letak path foto produk
  },
  {
    id: "mkn-2",
    nama: "Nasi Jamur Krispi",
    kategori: "makanan",
    harga: 5000,
    deskripsi: "Nasi dengan jamur krispi dan sambal yang pedas gurih",
    gambar: "images/Jamur.png" // <-- Letak path foto produk
  },
  {
    id: "mkn-3",
    nama: "Mie Instan",
    kategori: "makanan",
    harga: 6000,
    deskripsi: "Mie instan dengan berbagai varian rasa",
    gambar: "images/Mie.png"// <-- Letak path foto produk
  },

  // --- KATEGORI 2: CAMILAN ---
  {
    id: "cml-1",
    nama: "Risol",
    kategori: "camilan",
    harga: 2500,
    deskripsi: "Risol goreng dengan berbagai varian rasa",
    gambar: "images/Risol.png"// <-- Letak path foto produk
  },
  {
    id: "cml-2",
    nama: "Wonton Kuah",
    kategori: "camilan",
    harga: 5000,
    deskripsi: "Wonton rebus dengan kuah pedas",
    gambar: "images/Wonton.png"// <-- Letak path foto produk
  },
  {
    id: "cml-3",
    nama: "Basreng Pedas Daun Jeruk",
    kategori: "camilan",
    harga: 2000,
    deskripsi: "Bakso goreng renyah dengan aroma harum daun jeruk dan cabai merah",
    gambar: "images/Basreng.png"// <-- Letak path foto produk
  },

  // --- KATEGORI 3: MINUMAN ---
  // (Tanpa kata "Es" di nama, pembeli bebas pilih opsi Es di dropdown)
  {
    id: "mnm-1",
    nama: "Es Teh Manis",
    kategori: "minuman",
    harga: 3000,
    deskripsi: "Teh melati wangi dan manis menyegarkan dahaga",
    gambar: "images/Es Teh.png"// <-- Letak path foto produk
  },
  {
    id: "mnm-2",
    nama: "Es Jeruk Peras Segar",
    kategori: "minuman",
    harga: 5000,
    deskripsi: "Perasan jeruk asli segar kaya vitamin C alami",
    gambar: "images/Es Jeruk.png" // <-- Letak path foto produk
  },
  {
    id: "mnm-3",
    nama: "Cappucino Cincau",
    kategori: "minuman",
    harga: 4000,
    deskripsi: "Es cappucino cincau yang segar",
    gambar: "images/Capcin.png"// <-- Letak path foto produk
  }
];

// =========================================================================
// 2. STATE (MEMORI PENYIMPANAN DATA DI BROWSER)
// =========================================================================
// Array untuk menyimpan item pesanan di keranjang
let keranjang = [];

// =========================================================================
// 3. FUNGSI FORMAT MATA UANG RUPIAH
// Mengubah angka 12000 menjadi Rp12.000
// =========================================================================
function formatRupiah(angka) {
  return "Rp" + Number(angka).toLocaleString("id-ID");
}

// =========================================================================
// 4. MENAMPILKAN MENU KE HALAMAN (RENDER MENU)
// =========================================================================
function renderMenu() {
  const containerMakanan = document.getElementById("grid-makanan");
  const containerCamilan = document.getElementById("grid-camilan");
  const containerMinuman = document.getElementById("grid-minuman");

  containerMakanan.innerHTML = "";
  containerCamilan.innerHTML = "";
  containerMinuman.innerHTML = "";

  DAFTAR_MENU.forEach((item) => {
    // Buat elemen pembungkus kartu
    const kartu = document.createElement("div");
    kartu.className = "menu-card";

    // =========================================================================
    // SLOT FOTO PRODUK (LETAK FOTO: DI BAGIAN ATAS KARTU, DI ATAS NAMA PRODUK)
    // - Lebar penuh kartu, rasio 4:3, seragam di semua kartu
    // - Sudut atas melengkung mengikuti kartu (overflow: hidden pada kartu)
    // - Tampilan kosong: kotak hijau muda (#e8f8e8) dengan border putus-putus
    //   dan teks kecil di tengah "Letakkan foto di sini"
    // - onerror: sembunyikan gambar jika file belum dimasukkan
    // =========================================================================
    let htmlKonten = `
      <!-- 1. SLOT FOTO PRODUK (BAGIAN PALING ATAS KARTU) -->
      <div class="menu-foto-slot">
        <div class="menu-foto-placeholder">
          <span>Letakkan foto di sini</span>
        </div>
        <img 
          src="${item.gambar}" 
          alt="${item.nama}" 
          class="menu-foto-img" 
          loading="lazy"
          onerror="this.style.display='none'; this.onerror=null;"
        >
      </div>

      <!-- 2. KONTEN KARTU LAINNYA (Digeser ke bawah slot foto) -->
      <div class="menu-body">
        <div>
          <div class="menu-top">
            <div class="menu-info">
              <div class="menu-nama">${item.nama}</div>
              <div class="menu-deskripsi">${item.deskripsi}</div>
              <div class="menu-harga">${formatRupiah(item.harga)}</div>
            </div>
          </div>
    `;

    // KHUSUS MINUMAN: Tambahkan dropdown pilihan Gula dan pilihan Es
    if (item.kategori === "minuman") {
      htmlKonten += `
        <div class="opsi-minuman">
          <div class="opsi-group">
            <label for="gula-${item.id}">Pilihan Gula</label>
            <select id="gula-${item.id}" class="opsi-select">
              <option value="Gula normal">Gula normal</option>
              <option value="Gula sedikit">Gula sedikit</option>
              <option value="Tanpa gula">Tanpa gula</option>
            </select>
          </div>
          <div class="opsi-group">
            <label for="es-${item.id}">Pilihan Es</label>
            <select id="es-${item.id}" class="opsi-select">
              <option value="Es normal">Es normal</option>
              <option value="Es sedikit">Es sedikit</option>
              <option value="Tanpa es">Tanpa es</option>
            </select>
          </div>
        </div>
      `;
    }

    htmlKonten += `
        </div> <!-- Tutup div info & opsi -->

        <!-- Tombol Tambah ke Pesanan -->
        <button type="button" class="btn-tambah" onclick="tambahKeKeranjang('${item.id}')">
          <span>+</span> Tambah ke Pesanan
        </button>
      </div> <!-- Tutup .menu-body -->
    `;

    kartu.innerHTML = htmlKonten;

    // Masukkan kartu ke wadah yang sesuai dengan kategorinya
    if (item.kategori === "makanan") {
      containerMakanan.appendChild(kartu);
    } else if (item.kategori === "camilan") {
      containerCamilan.appendChild(kartu);
    } else if (item.kategori === "minuman") {
      containerMinuman.appendChild(kartu);
    }
  });
}

// =========================================================================
// 5. MENAMBAH ITEM KE KERANJANG
// =========================================================================
function tambahKeKeranjang(menuId) {
  const menu = DAFTAR_MENU.find((m) => m.id === menuId);
  if (!menu) return;

  let gula = null;
  let es = null;
  let cartKey = menu.id;

  // Jika minuman, baca pilihan gula dan es yang aktif saat tombol ditekan
  if (menu.kategori === "minuman") {
    const selectGula = document.getElementById(`gula-${menu.id}`);
    const selectEs = document.getElementById(`es-${menu.id}`);
    gula = selectGula ? selectGula.value : "Gula normal";
    es = selectEs ? selectEs.value : "Es normal";

    // Minuman yang sama dengan variasi gula/es berbeda menjadi baris terpisah
    cartKey = `${menu.id}_${gula}_${es}`;
  }

  // Cek apakah item dengan kunci unik ini sudah ada di keranjang
  const existingItem = keranjang.find((item) => item.key === cartKey);

  if (existingItem) {
    existingItem.jumlah += 1;
  } else {
    keranjang.push({
      key: cartKey,
      id: menu.id,
      nama: menu.nama,
      kategori: menu.kategori,
      harga: menu.harga,
      gula: gula,
      es: es,
      jumlah: 1
    });
  }

  // Perbarui tampilan antarmuka
  renderKeranjang();
  updateTotalBar();
}

// =========================================================================
// 6. MENGUBAH JUMLAH ITEM (+ ATAU -)
// =========================================================================
function ubahJumlah(cartKey, delta) {
  const itemIndex = keranjang.findIndex((item) => item.key === cartKey);
  if (itemIndex === -1) return;

  keranjang[itemIndex].jumlah += delta;

  // Jika jumlah menjadi 0 atau kurang, hapus item dari keranjang
  if (keranjang[itemIndex].jumlah <= 0) {
    keranjang.splice(itemIndex, 1);
  }

  renderKeranjang();
  updateTotalBar();
}

// =========================================================================
// 7. MEMPERBARUI TAMPILAN KERANJANG (RENDER KERANJANG)
// =========================================================================
function renderKeranjang() {
  const containerKeranjang = document.getElementById("daftar-keranjang");
  const badgeTotalItem = document.getElementById("badge-total-item");

  const totalItemCount = keranjang.reduce((sum, item) => sum + item.jumlah, 0);
  badgeTotalItem.textContent = `${totalItemCount} item`;

  // Jika keranjang masih kosong
  if (keranjang.length === 0) {
    containerKeranjang.innerHTML = `
      <div class="keranjang-kosong">
        <p><strong>Keranjang masih kosong.</strong></p>
        <p style="font-size: 0.85rem; margin-top: 4px;">Pilih makanan, camilan, atau minuman di atas untuk memesan.</p>
      </div>
    `;
    return;
  }

  // Tampilkan daftar item di keranjang
  let htmlList = `<div class="cart-list">`;

  keranjang.forEach((item) => {
    const subtotal = item.harga * item.jumlah;

    htmlList += `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.nama}</div>
    `;

    // Tampilkan label gula dan es khusus untuk minuman
    if (item.kategori === "minuman") {
      htmlList += `
        <div class="cart-item-badge">
          <span class="badge-opsi">${item.gula}</span>
          <span class="badge-opsi">${item.es}</span>
        </div>
      `;
    }

    htmlList += `
          <div class="cart-item-price">
            ${formatRupiah(subtotal)} 
            <small style="font-weight: normal; color: var(--text-muted); font-size: 0.75rem;">
              (${formatRupiah(item.harga)} × ${item.jumlah})
            </small>
          </div>
        </div>

        <!-- Tombol Jumlah: - dan + -->
        <div class="cart-qty-control">
          <button type="button" class="btn-qty btn-minus" title="Kurangi" onclick="ubahJumlah('${item.key}', -1)">−</button>
          <span class="qty-number">${item.jumlah}</span>
          <button type="button" class="btn-qty btn-plus" title="Tambah" onclick="ubahJumlah('${item.key}', 1)">+</button>
        </div>
      </div>
    `;
  });

  htmlList += `</div>`;
  containerKeranjang.innerHTML = htmlList;
}

// =========================================================================
// 8. MEMPERBARUI BAR TOTAL DI BAGIAN BAWAH LAYAR
// =========================================================================
function updateTotalBar() {
  const labelTotalHarga = document.getElementById("label-total-harga");
  const labelSubCount = document.getElementById("label-sub-count");
  const btnCheckout = document.getElementById("btn-checkout");

  let totalHarga = 0;
  let totalKuantitas = 0;

  keranjang.forEach((item) => {
    totalHarga += item.harga * item.jumlah;
    totalKuantitas += item.jumlah;
  });

  labelTotalHarga.textContent = formatRupiah(totalHarga);
  labelSubCount.textContent = `${totalKuantitas} item dipilih`;

  // Tombol Checkout nonaktif jika belum ada pesanan
  btnCheckout.disabled = keranjang.length === 0;
}

// =========================================================================
// 9. EVENT PERUBAHAN METODE PENGAMBILAN & VALIDASI CATATAN
// =========================================================================
function handleOpsiAmbilChange() {
  const opsiAmbil = document.querySelector('input[name="opsi-ambil"]:checked').value;
  const labelKeterangan = document.getElementById("label-keterangan-catatan");
  const errorCatatan = document.getElementById("error-catatan");
  const inputCatatan = document.getElementById("catatan-pembeli");

  if (opsiAmbil === "Diantar") {
    labelKeterangan.innerHTML = "<b style='color: var(--danger-color);'>* Wajib diisi lokasi antar!</b>";
    inputCatatan.placeholder = "WAJIB: Tulis ruangan kelas atau meja antar (misal: Ruang 10-IPA-2, meja depan)...";
  } else {
    labelKeterangan.innerHTML = "";
    inputCatatan.placeholder = "Opsional";
    errorCatatan.classList.remove("aktif");
    inputCatatan.classList.remove("input-error");
  }
}

// =========================================================================
// 10. PROSES Checkout & MENAMPILKAN RINGKASAN PESANAN (STRUK)
// =========================================================================
function handleCheckout() {
  if (keranjang.length === 0) {
    alert("Keranjang masih kosong. Silakan pilih menu terlebih dahulu!");
    return;
  }

  const metodeBayar = document.querySelector('input[name="metode-bayar"]:checked').value;
  const opsiAmbil = document.querySelector('input[name="opsi-ambil"]:checked').value;
  const inputCatatan = document.getElementById("catatan-pembeli");
  const errorCatatan = document.getElementById("error-catatan");
  const catatan = inputCatatan.value.trim();

  // Validasi: Catatan wajib diisi jika opsi Diantar dipilih
  if (opsiAmbil === "Diantar" && catatan === "") {
    errorCatatan.classList.add("aktif");
    inputCatatan.classList.add("input-error");
    inputCatatan.focus();
    document.getElementById("section-detail").scrollIntoView({ behavior: "smooth" });
    return;
  } else {
    errorCatatan.classList.remove("aktif");
    inputCatatan.classList.remove("input-error");
  }

  // Hitung total harga
  const totalHarga = keranjang.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);

  // Buat tampilan struk
  const kontenStruk = document.getElementById("konten-struk");
  let htmlStruk = `<div class="struk-item-list">`;

  keranjang.forEach((item) => {
    const subtotal = item.harga * item.jumlah;
    htmlStruk += `
      <div class="struk-item-row">
        <div class="struk-item-detail">
          <strong>${item.nama}</strong> × ${item.jumlah}
    `;

    if (item.kategori === "minuman") {
      htmlStruk += `
        <div class="struk-item-subopsi">(${item.gula}, ${item.es})</div>
      `;
    }

    htmlStruk += `
        </div>
        <div class="struk-item-subtotal">${formatRupiah(subtotal)}</div>
      </div>
    `;
  });

  htmlStruk += `</div>`;

  // Ringkasan Pembayaran & Pengambilan (tanpa emoji)
  htmlStruk += `
    <div class="struk-info-row">
      <span>Metode Bayar:</span>
      <strong>${metodeBayar === 'QRIS' ? 'QRIS' : 'Cash (Tunai)'}</strong>
    </div>
    <div class="struk-info-row">
      <span>Pengambilan:</span>
      <strong>${opsiAmbil === 'Diantar' ? 'Diantar ke Lokasi' : 'Ambil Sendiri di Kantin'}</strong>
    </div>
    <div class="struk-info-row">
      <span>Catatan:</span>
      <strong>${catatan ? catatan : '<em>(Tidak ada catatan)</em>'}</strong>
    </div>
    <div class="struk-total-row">
      <span>Total Akhir</span>
      <span>${formatRupiah(totalHarga)}</span>
    </div>
  `;

  kontenStruk.innerHTML = htmlStruk;

  // Buka modal ringkasan
  document.getElementById("modal-ringkasan").classList.add("buka");
}

// =========================================================================
// 11. TUTUP MODAL & RESET PESANAN SETELAH SELESAI
// =========================================================================
function tutupModalDanReset() {
  document.getElementById("modal-ringkasan").classList.remove("buka");

  // Kosongkan keranjang
  keranjang = [];

  // Reset input form
  document.getElementById("catatan-pembeli").value = "";
  document.getElementById("bayar-qris").checked = true;
  document.getElementById("ambil-sendiri").checked = true;
  handleOpsiAmbilChange();

  // Perbarui UI
  renderKeranjang();
  updateTotalBar();

  // Kembali ke atas layar
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Event listener saat pengguna mengetik di kolom catatan untuk menghapus tanda error
document.getElementById("catatan-pembeli").addEventListener("input", function() {
  if (this.value.trim() !== "") {
    document.getElementById("error-catatan").classList.remove("aktif");
    this.classList.remove("input-error");
  }
});

// =========================================================================
// 12. INISIALISASI HALAMAN
// =========================================================================
window.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  renderKeranjang();
  updateTotalBar();
  handleOpsiAmbilChange();
});