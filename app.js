/**
 * LOGIKA SISTEM DASHBOARD EWS HYDROVISION, SUHU ESP32-S3, REALTIME CHART & MQTT
 */

let lastTelemetryTime = 0;
let heartbeatInterval = null;
let phChartInstance = null;
let turbChartInstance = null;
let client = null;

const MAX_CHART_POINTS = 20;

// Inisialisasi saat DOM Selesai Dimuat
document.addEventListener("DOMContentLoaded", () => {
  renderLogos();
  renderTeamInfo();
  initCharts();
});

// Render 7 Logo Resmi
function renderLogos() {
  const loginLogoRow = document.getElementById("login-logo-row");
  const hdrLogoRow = document.getElementById("hdr-logo-row");

  if (loginLogoRow && typeof CONFIG !== 'undefined') {
    loginLogoRow.innerHTML = "";
    CONFIG.LOGOS.forEach((logo) => {
      loginLogoRow.insertAdjacentHTML(
        "beforeend",
        `<img src="${logo.src}" alt="${logo.alt}" title="${logo.alt}" class="h-8 sm:h-9 object-contain shrink-0 hover:scale-110 transition">`
      );
    });
  }

  if (hdrLogoRow && typeof CONFIG !== 'undefined') {
    hdrLogoRow.innerHTML = "";
    CONFIG.LOGOS.forEach((logo) => {
      hdrLogoRow.insertAdjacentHTML(
        "beforeend",
        `<img src="${logo.src}" alt="${logo.alt}" title="${logo.alt}" class="h-7 sm:h-8 object-contain shrink-0 hover:scale-110 transition">`
      );
    });
  }
}

// Render Data Dosen, Tim, & Kontak Sosial Media
function renderTeamInfo() {
  if (typeof CONFIG === 'undefined') return;

  const igLink = document.getElementById("link-team-ig");
  const tiktokLink = document.getElementById("link-team-tiktok");
  const emailLink = document.getElementById("link-team-email");

  if (igLink) {
    igLink.href = CONFIG.SOSIAL_MEDIA.INSTAGRAM_URL;
    const txt = document.getElementById("txt-team-ig");
    if (txt) txt.innerText = CONFIG.SOSIAL_MEDIA.INSTAGRAM_USERNAME;
  }
  if (tiktokLink) {
    tiktokLink.href = CONFIG.SOSIAL_MEDIA.TIKTOK_URL;
    const txt = document.getElementById("txt-team-tiktok");
    if (txt) txt.innerText = CONFIG.SOSIAL_MEDIA.TIKTOK_USERNAME;
  }
  if (emailLink) {
    emailLink.href = `mailto:${CONFIG.SOSIAL_MEDIA.EMAIL_TIM}`;
    const txt = document.getElementById("txt-team-email");
    if (txt) txt.innerText = CONFIG.SOSIAL_MEDIA.EMAIL_TIM;
  }

  // Profil Dosen
  const dosenImg = document.getElementById("dosen-foto");
  if (dosenImg) dosenImg.src = CONFIG.DOSEN.FOTO;
  const dNama = document.getElementById("dosen-nama");
  if (dNama) dNama.innerText = CONFIG.DOSEN.NAMA;
  const dJab = document.getElementById("dosen-jabatan");
  if (dJab) dJab.innerText = CONFIG.DOSEN.JABATAN;
  const dInst = document.getElementById("dosen-instansi");
  if (dInst) dInst.innerText = CONFIG.DOSEN.INSTANSI;

  // Profil 5 Anggota Tim
  const teamGrid = document.getElementById("team-grid-container");
  if (teamGrid) {
    teamGrid.innerHTML = "";
    CONFIG.TIM.forEach((member) => {
      const borderCard = member.IS_KETUA ? "border-blue-500/60 bg-slate-900/90 shadow-blue-500/20" : "border-slate-800 bg-slate-900";
      const borderImg = member.IS_KETUA ? "border-blue-500 ring-2 ring-blue-500/30" : "border-slate-700";
      const badgeRole = member.IS_KETUA 
        ? `<span class="bg-blue-600/30 text-blue-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-500/40">Ketua Tim</span>`
        : `<span class="bg-slate-800 text-slate-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">Anggota</span>`;

      const cardHTML = `
        <div class="flex flex-col items-center text-center p-4 rounded-3xl border ${borderCard} shadow-lg transition hover:scale-[1.02]">
          <div class="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 ${borderImg} mb-3 shadow-inner bg-slate-950">
            <img src="${member.FOTO}" alt="${member.NAMA}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/200/1e293b/ffffff?text=${encodeURIComponent(member.NAMA.split(' ')[0])}'">
          </div>
          <h4 class="font-bold text-slate-100 text-xs sm:text-sm line-clamp-1">${member.NAMA}</h4>
          <div class="mt-1 mb-2">${badgeRole}</div>
          <p class="text-[10px] sm:text-[11px] text-slate-400 leading-snug line-clamp-2">${member.PRODI}</p>
        </div>
      `;
      teamGrid.insertAdjacentHTML("beforeend", cardHTML);
    });
  }

  // Link Google Spreadsheet
  const gsheetLink = document.getElementById("link-gsheet-btn");
  if (gsheetLink) {
    gsheetLink.href = CONFIG.SPREADSHEET_URL;
  }
}

// Inisialisasi Grafik Real-Time
function initCharts() {
  const ctxPH = document.getElementById("chart-ph")?.getContext("2d");
  const ctxTurb = document.getElementById("chart-turb")?.getContext("2d");

  if (ctxPH) {
    phChartInstance = new Chart(ctxPH, {
      type: "line",
      data: {
        labels: [],
        datasets: [{
          label: "pH Air",
          data: [],
          borderColor: "#60a5fa",
          backgroundColor: "rgba(96, 165, 250, 0.15)",
          borderWidth: 2,
          fill: true,
          tension: 0.35,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 4, max: 10, grid: { color: "rgba(148, 163, 184, 0.1)" }, ticks: { color: "#94a3b8" } },
          x: { grid: { color: "rgba(148, 163, 184, 0.05)" }, ticks: { color: "#94a3b8" } }
        },
        plugins: { legend: { labels: { color: "#cbd5e1" } } }
      }
    });
  }

  if (ctxTurb) {
    turbChartInstance = new Chart(ctxTurb, {
      type: "line",
      data: {
        labels: [],
        datasets: [{
          label: "Turbidity (NTU)",
          data: [],
          borderColor: "#22d3ee",
          backgroundColor: "rgba(34, 211, 238, 0.15)",
          borderWidth: 2,
          fill: true,
          tension: 0.35,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: "rgba(148, 163, 184, 0.1)" }, ticks: { color: "#94a3b8" } },
          x: { grid: { color: "rgba(148, 163, 184, 0.05)" }, ticks: { color: "#94a3b8" } }
        },
        plugins: { legend: { labels: { color: "#cbd5e1" } } }
      }
    });
  }
}

function pushChartData(phVal, turbVal) {
  const now = new Date().toLocaleTimeString('id-ID', { hour12: false });
  if (phChartInstance) {
    if (phChartInstance.data.labels.length > MAX_CHART_POINTS) {
      phChartInstance.data.labels.shift();
      phChartInstance.data.datasets[0].data.shift();
    }
    phChartInstance.data.labels.push(now);
    phChartInstance.data.datasets[0].data.push(phVal);
    phChartInstance.update();
  }

  if (turbChartInstance) {
    if (turbChartInstance.data.labels.length > MAX_CHART_POINTS) {
      turbChartInstance.data.labels.shift();
      turbChartInstance.data.datasets[0].data.shift();
    }
    turbChartInstance.data.labels.push(now);
    turbChartInstance.data.datasets[0].data.push(turbVal);
    turbChartInstance.update();
  }
}

// Navigasi Menu Tab
function switchTab(tabId) {
  const tabs = ["tab-telemetry", "tab-charts", "tab-sheets", "tab-team"];
  const navBtns = ["nav-btn-telemetry", "nav-btn-charts", "nav-btn-sheets", "nav-btn-team"];

  tabs.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("hidden", id !== tabId);
  });

  navBtns.forEach((btnId) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      const isActive = btnId === `nav-btn-${tabId.replace('tab-', '')}`;
      btn.className = isActive
        ? "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition whitespace-nowrap"
        : "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition whitespace-nowrap";
    }
  });
}

function togglePasswordVisibility() {
  const passInput = document.getElementById("login-pass");
  const icon = document.getElementById("toggle-pass-icon");
  if (passInput.type === "password") {
    passInput.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    passInput.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

function handleLogin(e) {
  e.preventDefault();
  const role = document.getElementById("login-role").value;
  const pass = document.getElementById("login-pass").value;
  const errorDiv = document.getElementById("login-error");

  const isUserValid = (role === "user" && pass === CONFIG.AUTH.USER_PASSWORD);
  const isAdminValid = (role === "admin" && pass === CONFIG.AUTH.ADMIN_PASSWORD);

  if (isUserValid || isAdminValid) {
    errorDiv.classList.add("hidden");
    document.getElementById("login-modal").classList.add("hidden");
    document.getElementById("dashboard-content").classList.remove("hidden");

    const badge = document.getElementById("role-badge");
    const adminPanel = document.getElementById("admin-panel");

    if (role === "admin") {
      badge.innerText = "Admin Mode";
      badge.className = "bg-purple-600 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow";
      if (adminPanel) adminPanel.classList.remove("hidden");
    } else {
      badge.innerText = "User Mode";
      badge.className = "bg-emerald-600 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow";
      if (adminPanel) adminPanel.classList.add("hidden");
    }

    initMQTT();
    startESPHeartbeatChecker();
  } else {
    errorDiv.classList.remove("hidden");
  }
}

function handleLogout() {
  document.getElementById("login-modal").classList.remove("hidden");
  document.getElementById("dashboard-content").classList.add("hidden");
  document.getElementById("login-pass").value = "";
  if (heartbeatInterval) clearInterval(heartbeatInterval);
}

function startESPHeartbeatChecker() {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(() => {
    const now = Date.now();
    const espPing = document.getElementById("esp-status-ping");
    const espText = document.getElementById("esp-status-text");

    if (now - lastTelemetryTime > 6000) {
      if (espPing) espPing.className = "w-2.5 h-2.5 rounded-full bg-red-500";
      if (espText) {
        espText.innerText = "ESP32 Offline";
        espText.className = "text-xs font-bold text-red-400";
      }
    }
  }, 1000);
}

// MQTT Logics (WSS Secure untuk Vercel HTTPS)
function initMQTT() {
  const clientID = "Web_EWS_Musi_" + Math.random().toString(16).substr(2, 8);
  client = new Paho.MQTT.Client(CONFIG.MQTT.BROKER, CONFIG.MQTT.PORT, clientID);

  client.onConnectionLost = (responseObject) => {
    const mqttPing = document.getElementById("mqtt-status-ping");
    const mqttText = document.getElementById("mqtt-status-text");
    if (mqttPing) mqttPing.className = "w-2.5 h-2.5 rounded-full bg-red-500";
    if (mqttText) mqttText.innerText = "Server Putus";
    setTimeout(initMQTT, 3000);
  };

  client.onMessageArrived = (message) => {
    if (message.destinationName === CONFIG.MQTT.TOPIC_TELEMETRY) {
      try {
        const data = JSON.parse(message.payloadString);
        lastTelemetryTime = Date.now();

        // Update Indikator ESP32 Online
        const espPing = document.getElementById("esp-status-ping");
        const espText = document.getElementById("esp-status-text");
        if (espPing) espPing.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse";
        if (espText) {
          espText.innerText = "ESP32 Online";
          espText.className = "text-xs font-bold text-emerald-400";
        }

        // Telemetri Sensor Kualitas Air & Tegangan
        if (data.ph !== undefined) document.getElementById("val-ph").innerText = data.ph.toFixed(2);
        if (data.turb !== undefined) document.getElementById("val-turb").innerText = data.turb.toFixed(1) + " NTU";
        if (data.dosis !== undefined) document.getElementById("val-dosis").innerText = data.dosis.toFixed(2);
        if (data.v_bat !== undefined) document.getElementById("val-vbat").innerText = data.v_bat.toFixed(1) + " V";
        if (data.v_pan !== undefined) document.getElementById("val-vpan").innerText = (data.v_pan ? data.v_pan.toFixed(1) : "0.0") + " V";
        if (data.v_esp !== undefined) document.getElementById("val-vesp").innerText = (data.v_esp ? data.v_esp.toFixed(1) : "5.0") + " V";

        // LOGIKA SUHU INTERNAL ESP32-S3 (HIJAU AMAN, MERAH JIKA >= 65°C)
        if (data.temp_esp !== undefined) {
          const tempVal = data.temp_esp;
          const tempEl = document.getElementById("val-temp-esp");
          const descEl = document.getElementById("desc-temp-esp");

          if (tempEl && descEl) {
            tempEl.innerText = tempVal.toFixed(1) + " °C";

            if (tempVal >= 65.0) {
              // MERAH: OVERHEAT / MELEBIHI BATAS
              tempEl.className = "text-2xl font-black text-red-500 transition-colors";
              descEl.className = "text-[10px] font-bold text-red-400 mt-0.5";
              descEl.innerText = "! SUHU TINGGI !";
            } else {
              // HIJAU: AMAN / NORMAL
              tempEl.className = "text-2xl font-black text-emerald-400 transition-colors";
              descEl.className = "text-[10px] font-medium text-emerald-400 mt-0.5";
              descEl.innerText = "Suhu Normal";
            }
          }
        }

        // Status Sumber Listrik Relay (false: Baterai/Solar, true: PLN)
        const relayTxt = document.getElementById("val-relay-status");
        if (relayTxt && data.relay !== undefined) {
          if (data.relay) {
            relayTxt.innerText = "SUMBER CADANGAN: PLN";
            relayTxt.className = "text-sm font-black text-amber-400 mt-0.5";
          } else {
            relayTxt.innerText = "SUMBER UTAMA: BATERAI / SOLAR PANEL";
            relayTxt.className = "text-sm font-black text-emerald-400 mt-0.5";
          }
        }

        // Push data ke grafik
        if (data.ph !== undefined && data.turb !== undefined) {
          pushChartData(data.ph, data.turb);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  client.connect({
    useSSL: true, // Wajib true untuk Vercel HTTPS
    timeout: 10,
    keepAliveInterval: 30,
    cleanSession: true,
    onSuccess: () => {
      const mqttPing = document.getElementById("mqtt-status-ping");
      const mqttText = document.getElementById("mqtt-status-text");
      if (mqttPing) mqttPing.className = "w-2.5 h-2.5 rounded-full bg-emerald-500";
      if (mqttText) mqttText.innerText = "Server OK";
      client.subscribe(CONFIG.MQTT.TOPIC_TELEMETRY);
    },
    onFailure: () => {
      const mqttText = document.getElementById("mqtt-status-text");
      if (mqttText) mqttText.innerText = "Gagal Konek";
      setTimeout(initMQTT, 5000);
    }
  });
}

function triggerRelayRemote() {
  if (!client || !client.isConnected()) {
    alert("MQTT belum terhubung!");
    return;
  }
  const message = new Paho.MQTT.Message("TRIGGER_RELAY");
  message.destinationName = CONFIG.MQTT.TOPIC_COMMAND;
  client.send(message);
  alert("Perintah Pergantian Sumber Listrik Relay Terkirim ke ESP32-S3!");
}

function updateCoefficientsRemote() {
  if (!client || !client.isConnected()) {
    alert("MQTT belum terhubung!");
    return;
  }
  const c0 = document.getElementById("input-c0").value;
  const c1 = document.getElementById("input-c1").value;
  const c2 = document.getElementById("input-c2").value;

  if (!c0 || !c1 || !c2) {
    alert("Harap isi ketiga parameter terlebih dahulu!");
    return;
  }

  const payload = `${c0},${c1},${c2}`;
  const message = new Paho.MQTT.Message(payload);
  message.destinationName = CONFIG.MQTT.TOPIC_UPDATE_COEF;
  client.send(message);
  alert(`Parameter ML Baru (${payload}) berhasil dikirim ke ESP32-S3!`);
}