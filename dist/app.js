    
    // --- UTILITIES ---

    // Fungsi utilitas untuk menampilkan notifikasi custom (menggantikan alert/confirm)
  const showNotification = (message, type) => {
      const container = document.getElementById('notification-container');
      container.textContent = message;
      
      container.classList.remove('notification-success', 'notification-error');
      
      if (type === 'success') {
          container.classList.add('notification-success');
      } else if (type === 'error') {
          container.classList.add('notification-error');
      }

      container.classList.add('show');
      
      // Sembunyikan setelah 4 detik
      setTimeout(() => {
          container.classList.remove('show');
      }, 4000);
  };
  
  // Fungsi utilitas untuk memformat saldo menjadi mata uang
  const formatCurrency = (amount) => {
      return new Intl.NumberFormat('id-ID', {
          minimumFractionDigits: 0
      }).format(amount);
  };

  // Fungsi utilitas untuk memperbarui tampilan saldo dengan animasi
  const updateSaldoDisplay = (newAmount) => {
      const saldoElement = document.getElementById('saldo');
      if (saldoElement) {
          saldoElement.textContent = formatCurrency(newAmount);
          
          // Tambahkan animasi pulse
          saldoElement.classList.add('saldo-update');
          setTimeout(() => {
              saldoElement.classList.remove('saldo-update');
          }, 500);
      }
  };
  
  // --- LOGIKA JAVASCRIPT ASLI DARI USER ---

  async function loadSaldo() {
    try {
      const res = await fetch("/api/saldo");
      if (!res.ok) throw new Error(`Status HTTP: ${res.status}`);
      
      const data = await res.json();
      const currentSaldo = data.saldo ?? 0;

      const saldoElement = document.getElementById("saldo");

      if (!saldoElement) {
        console.warn("Element #saldo tidak ditemukan");
        return;
      }

      updateSaldoDisplay(currentSaldo); // Menggunakan fungsi display futuristik
      showNotification("Status akun dimuat.", 'success');

    } catch (error) {
      console.error("Gagal memuat saldo:", error);

      const saldoElement = document.getElementById("saldo");
      if (saldoElement) {
          updateSaldoDisplay(0);
          showNotification("Gagal memuat saldo. Cek koneksi API.", 'error');
      }
    }
  }

  async function setor() {
    const inputElement = document.getElementById("jumlah");
    const jumlahStr = inputElement.value;
    const jumlah = parseInt(jumlahStr);

    if (isNaN(jumlah) || jumlah <= 0) {
      return showNotification("Masukkan jumlah setoran yang valid (> 0).", 'error');
    }

    try {
      const res = await fetch("/api/setor", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ jumlah: jumlah })
      });
      
      if (!res.ok) throw new Error(`Status HTTP: ${res.status}`);
      
      showNotification(`Setoran Rp ${formatCurrency(jumlah)} berhasil diproses.`, 'success');
      
    } catch (error) {
       console.error("Gagal Setor:", error);
       showNotification(`Setor Gagal. Cek API: ${error.message}`, 'error');
    }
    
    loadSaldo();
    inputElement.value = "";
  }

  async function tarik() {
    const inputElement = document.getElementById("jumlah");
    const jumlahStr = inputElement.value;
    const jumlah = parseInt(jumlahStr);

    if (isNaN(jumlah) || jumlah <= 0) {
      return showNotification("Masukkan jumlah penarikan yang valid (> 0).", 'error');
    }
    
    try {
      const res = await fetch("/api/tarik", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ jumlah: jumlah })
      });
      
      if (!res.ok) {
          // Coba ambil pesan error dari body jika ada
          const errorData = await res.json().catch(() => ({ message: 'Kesalahan server.' }));
          throw new Error(errorData.message || `Status HTTP: ${res.status}`);
      }
      
      showNotification(`Penarikan Rp ${formatCurrency(jumlah)} berhasil diproses.`, 'success');
      
    } catch (error) {
      console.error("Gagal Tarik:", error);
      showNotification(`Tarik Gagal: ${error.message}`, 'error');
    }

    loadSaldo();
    inputElement.value = "";
  }

  // Memastikan fungsi-fungsi dapat diakses dari tombol
  window.setor = setor;
  window.tarik = tarik;

  // Memuat saldo saat aplikasi dimuat
  document.addEventListener('DOMContentLoaded', loadSaldo);
