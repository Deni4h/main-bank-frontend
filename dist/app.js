async function loadSaldo() {
  try {
    const res = await fetch("/api/saldo");
    const data = await res.json();

    const saldo = document.getElementById("saldo");

    if (!saldo) {
      console.warn("Element #saldo tidak ditemukan");
      return;
    }

    saldo.innerText = data.saldo ?? 0;
  } catch (error) {
    console.error("Gagal memuat saldo:", error);

    const saldo = document.getElementById("saldo");
    if (saldo) saldo.innerText = 0;
  }
}

async function setor() {
  const jumlah = document.getElementById("jumlah").value;
  await fetch("/api/setor", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ jumlah: parseInt(jumlah) })
  });
  loadSaldo();
  document.getElementById("jumlah").value = ""
}

async function tarik() {
  const jumlah = document.getElementById("jumlah").value;
  await fetch("/api/tarik", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ jumlah: parseInt(jumlah) })
  });
  loadSaldo();
  document.getElementById("jumlah").value = ""
}

loadSaldo();
