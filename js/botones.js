/* =====================================================
   🎛️ BOTONES UI - ESCUADRÓN DE DRONES
   Exportación + Barra de progreso + Logout
   USANDO api.js
===================================================== */

import { exportarMisionesCSV } from "../Backend/api.js";

/* =====================================================
   📌 ELEMENTOS UI
===================================================== */

const btnExportar = document.getElementById("btnExportar");
const btnSalir = document.getElementById("btnSalir");

const progressContainer = document.getElementById("exportProgressContainer");
const progressBar = document.getElementById("exportProgressBar");
const progressText = document.getElementById("exportText");

/* =====================================================
   📤 EXPORTAR CSV (DESDE FIREBASE)
===================================================== */

btnExportar?.addEventListener("click", async () => {

  let textoOriginal = btnExportar.textContent;

  try {
    // 🔒 bloquear botón
    btnExportar.disabled = true;
    btnExportar.textContent = "Exportando...";

    // 📊 mostrar barra
    progressContainer.style.display = "block";
    progressBar.style.width = "0%";
    progressText.textContent = "Conectando con Firebase...";

    // 📥 obtener CSV desde API
    const contenido = await exportarMisionesCSV((porcentaje) => {
      progressBar.style.width = porcentaje + "%";
      progressText.textContent = `Procesando ${porcentaje}%`;
    });

    if (!contenido) {
      alert("No hay datos para exportar");
      return;
    }

    // 📁 crear archivo
    progressText.textContent = "Generando archivo...";

    const blob = new Blob(["\uFEFF" + contenido], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    const fecha = new Date().toISOString().split("T")[0];

    link.href = url;
    link.download = `misiones_${fecha}.csv`;
    link.click();

    URL.revokeObjectURL(url);

    // ✅ final
    progressBar.style.width = "100%";
    progressText.textContent = "✅ Exportación completada";

    setTimeout(() => {
      progressContainer.style.display = "none";
    }, 2000);

  } catch (error) {
    console.error("❌ Error exportando:", error);
    alert("Error al exportar");

    progressContainer.style.display = "none";

  } finally {
    btnExportar.disabled = false;
    btnExportar.textContent = textoOriginal;
  }
});

/* =====================================================
   🚪 SALIR (LOGOUT)
===================================================== */

btnSalir?.addEventListener("click", () => {

  const confirmar = confirm("¿Deseas cerrar sesión?");
  if (!confirmar) return;

  // 🔥 limpiar sesión
  localStorage.clear();
  sessionStorage.clear();

  // 🔁 redirección
  window.location.href = "login.html"; // ajusta si tienes otra ruta
});