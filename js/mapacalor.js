// ========================================
// 🗺️ MAPA BASE
// ========================================
const map = L.map("map").setView([-12.097, -77.035], 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// ========================================
// 📊 FUNCIÓN PARA CARGAR EXCEL
// ========================================
async function cargarExcel() {
  try {
    const response = await fetch("./puntosdecalor.xlsx");
    const data = await response.arrayBuffer();

    const workbook = XLSX.read(data, { type: "array" });

    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(hoja);

    console.log("Datos cargados:", json);

    generarHeatmap(json);

  } catch (error) {
    console.error("Error cargando Excel:", error);
  }
}

// ========================================
// 🔥 GENERAR HEATMAP
// ========================================
function generarHeatmap(data) {

  const puntos = [];

  data.forEach(item => {
    const lat = parseFloat(item.LATITUD);
    const lng = parseFloat(item.LONGITUD);

    if (!isNaN(lat) && !isNaN(lng)) {
      puntos.push([lat, lng, 0.5]); // intensidad base
    }
  });

  console.log("Puntos para calor:", puntos.length);

  L.heatLayer(puntos, {
    radius: 25,
    blur: 20,
    maxZoom: 17,
    gradient: {
      0.2: "blue",
      0.4: "cyan",
      0.6: "lime",
      0.8: "yellow",
      1.0: "red"
    }
  }).addTo(map);
}

// ========================================
// 🚀 INICIAR
// ========================================
cargarExcel();
