// ========================================
// 🟪 CARGAR GEOCERCAS DESDE EXCEL
// ========================================
async function cargarGeocercas() {
  try {
    const response = await fetch("../geocercas_msi.xlsx");
    const data = await response.arrayBuffer();

    const workbook = XLSX.read(data, { type: "array" });
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(hoja);

    console.log("Geocercas cargadas:", json);

    generarGeocercas(json);

  } catch (error) {
    console.error("Error cargando geocercas:", error);
  }
}

// ========================================
// 🟣 GENERAR POLÍGONOS
// ========================================
function generarGeocercas(data) {

  const geocercas = {};

  // 🔥 AGRUPAR POR ID
  data.forEach(item => {
    const id = item.geocerca_id;

    if (!id) return;

    if (!geocercas[id]) {
      geocercas[id] = [];
    }

    geocercas[id].push([
      parseFloat(item.latitud),
      parseFloat(item.longitud)
    ]);
  });

  console.log("Geocercas agrupadas:", geocercas);

  // 🎨 COLORES AUTOMÁTICOS
  const colores = [
    "#ef4444", "#22c55e", "#3b82f6",
    "#eab308", "#a855f7", "#06b6d4"
  ];

  let indexColor = 0;

  // 🗺️ DIBUJAR
  Object.keys(geocercas).forEach(id => {

    const puntos = geocercas[id];

    if (puntos.length < 3) return; // mínimo para polígono

    const color = colores[indexColor % colores.length];
    indexColor++;

    const polygon = L.polygon(puntos, {
      color: color,
      fillOpacity: 0.2,
      weight: 2
    }).addTo(map);

    polygon.bindPopup(`
      <b>Geocerca:</b> ${id}<br>
      <b>Puntos:</b> ${puntos.length}
    `);

  });

}

// ========================================
// 🚀 INICIAR
// ========================================
cargarGeocercas();