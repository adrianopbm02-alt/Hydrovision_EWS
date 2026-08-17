// ==========================================
// MQTT LOGICS (WSS SECURE & AUTO RECONNECT)
// ==========================================
function initMQTT() {
  const clientID = "Web_EWS_Musi_" + Math.random().toString(16).substr(2, 8);
  client = new Paho.MQTT.Client(CONFIG.MQTT.BROKER, CONFIG.MQTT.PORT, clientID);

  client.onConnectionLost = (responseObject) => {
    console.warn("[MQTT] Koneksi terputus:", responseObject.errorMessage);
    const mqttPing = document.getElementById("mqtt-status-ping");
    const mqttText = document.getElementById("mqtt-status-text");
    if (mqttPing) mqttPing.className = "w-2.5 h-2.5 rounded-full bg-red-500";
    if (mqttText) mqttText.innerText = "Server Putus";

    // Reconnect otomatis setelah 3 detik
    setTimeout(initMQTT, 3000);
  };

  client.onMessageArrived = (message) => {
    if (message.destinationName === CONFIG.MQTT.TOPIC_TELEMETRY) {
      try {
        const data = JSON.parse(message.payloadString);
        lastTelemetryTime = Date.now();

        // Status ESP Online
        const espPing = document.getElementById("esp-status-ping");
        const espText = document.getElementById("esp-status-text");
        if (espPing) espPing.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse";
        if (espText) {
          espText.innerText = "ESP32 Online";
          espText.className = "text-xs font-bold text-emerald-400";
        }

        // Data Sensor
        if (data.ph !== undefined) document.getElementById("val-ph").innerText = data.ph.toFixed(2);
        if (data.turb !== undefined) document.getElementById("val-turb").innerText = data.turb.toFixed(1) + " NTU";
        if (data.dosis !== undefined) document.getElementById("val-dosis").innerText = data.dosis.toFixed(2);
        if (data.v_bat !== undefined) document.getElementById("val-vbat").innerText = data.v_bat.toFixed(1) + " V";
        if (data.v_pan !== undefined) document.getElementById("val-vpan").innerText = data.v_pan.toFixed(1) + " V";
        if (data.v_esp !== undefined) document.getElementById("val-vesp").innerText = data.v_esp.toFixed(1) + " V";

        // Status Sumber Listrik Relay
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

        // Update Grafik
        if (data.ph !== undefined && data.turb !== undefined) {
          pushChartData(data.ph, data.turb);
        }
      } catch (e) {
        console.error("[JSON Error] Format payload tidak valid:", e);
      }
    }
  };

  // Deteksi otomatis SSL: jika dibuka di Vercel/HTTPS gunakan SSL port 8884
  const isHttps = window.location.protocol === "https:";

  client.connect({
    useSSL: isHttps || CONFIG.MQTT.PORT === 8884,
    timeout: 10,
    keepAliveInterval: 30,
    cleanSession: true,
    onSuccess: () => {
      console.log("[MQTT] Terhubung ke Broker!");
      const mqttPing = document.getElementById("mqtt-status-ping");
      const mqttText = document.getElementById("mqtt-status-text");
      if (mqttPing) mqttPing.className = "w-2.5 h-2.5 rounded-full bg-emerald-500";
      if (mqttText) mqttText.innerText = "Server OK";

      client.subscribe(CONFIG.MQTT.TOPIC_TELEMETRY);
    },
    onFailure: (err) => {
      console.error("[MQTT] Gagal Terhubung:", err);
      const mqttText = document.getElementById("mqtt-status-text");
      if (mqttText) mqttText.innerText = "Gagal Konek";

      // Reconnect jika gagal
      setTimeout(initMQTT, 5000);
    }
  });
}