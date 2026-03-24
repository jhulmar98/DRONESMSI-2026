/* =====================================================
   🔥 FIREBASE + INTERFAZ - ESCUADRÓN DE DRONES
   LISTO PARA PRODUCCIÓN
===================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  collectionGroup,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

/* =====================================================
   🔐 CONFIG FIREBASE
===================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyAUSuxryQ_TUu2zep40lRmeSWag3InWR1E",
  authDomain: "escuadron-de-drones.firebaseapp.com",
  projectId: "escuadron-de-drones",
  storageBucket: "escuadron-de-drones.firebasestorage.app",
  messagingSenderId: "429468499741",
  appId: "1:429468499741:web:6c4e63a04b05d146ccebf4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

/* =====================================================
   🚀 APP
===================================================== */

(() => {
  "use strict";

  /* =====================================================
     📌 ELEMENTOS FORMULARIO
  ===================================================== */

  const form = document.getElementById("formMision");

  const tipoMision = document.getElementById("tipoMision");
  const subtipo = document.getElementById("subtipo");
  const sector = document.getElementById("sector");
  const direccion = document.getElementById("direccion");
  const motivo = document.getElementById("motivo");
  const detalle = document.getElementById("detalle");
  const tiempoVuelo = document.getElementById("tiempoVuelo");
  const inputArchivo = document.getElementById("foto");

  const grupoColegio = document.getElementById("grupoColegio");
  const buscarColegio = document.getElementById("buscarColegio");
  const listaColegios = document.getElementById("listaColegios");

  const grupoSector = document.getElementById("grupoSector");
  const grupoDireccion = document.getElementById("grupoDireccion");
  const grupoSubtipo = document.getElementById("grupoSubtipo");
  const grupoMotivo = document.getElementById("grupoMotivo");
  const grupoDetalle = document.getElementById("grupoDetalle");

  /* =====================================================
     📌 ELEMENTOS HISTORIAL
  ===================================================== */

  const tabla = document.getElementById("tablaMisiones");
  const filtroFecha = document.getElementById("filtroFecha");
  const btnHoy = document.getElementById("btnHoy");
  const btnTodo = document.getElementById("btnTodo");

  /* =====================================================
     📌 ELEMENTOS KPI
  ===================================================== */

  const kpiHoy = document.getElementById("kpiHoy");
  const kpiTotal = document.getElementById("kpiTotal");
  const kpiTiempo = document.getElementById("kpiTiempo");

  /* =====================================================
     📌 ESTADO
  ===================================================== */

  let cacheMisiones = [];
  let filtroActual = "hoy"; // "hoy" | "todo" | "fecha"
  let fechaSeleccionada = obtenerFechaHoy();

  /* =====================================================
     🏫 COLEGIOS
  ===================================================== */

  const colegios = [
    "1051 EL OLIVAR",
    "1071 ALFONSO UGARTE",
    "138 MI CASITA DE SORPRESAS",
    "ALMA MATER",
    "AMIGOS DE GONZAGA",
    "BERKELEY SCHOOL",
    "BRIGHTON NURSERY SCHOOL",
    "CAMINITO",
    "CHIQUITINES",
    "CRI - ARTE",
    "CRISTO REDENTOR",
    "DE LOS SAGRADOS CORAZONES BELEN",
    "FRIENDSHIP HIGH SCHOOL",
    "GARABATOS",
    "GARABATOS 3",
    "ISABEL FLORES DE OLIVA",
    "JESUALDO",
    "JOHN NEPER",
    "KANGURITO",
    "LA TIA CARMELA",
    "LAS GARZAS",
    "LEON PINELO",
    "LITTLE ONES",
    "MAGIC WORLD",
    "MARIA REINA MARIANISTAS",
    "MONTEALTO",
    "MY WORLD",
    "NIDO KILLA",
    "NIDO PAIND",
    "NUESTRA SEÑORA DE LA LUZ",
    "PALITROQUES",
    "REINA DE LA PAZ",
    "RUDOLF STEINER",
    "SAGRADO CORAZON SOPHIANUM",
    "SAN AGUSTIN",
    "SANTA ROSA",
    "SANTA URSULA",
    "SMART KIDS",
    "TPJ EN FESTINI",
    "TRILCE DE SAN ISIDRO",
    "SOR ROSA LARRABURE",
    "CIFO"
  ];

  /* =====================================================
     ⚙️ CONFIG INICIAL
  ===================================================== */

  if (inputArchivo) {
    inputArchivo.accept = "image/*,video/*";
  }

  // Cambia el título visual del KPI si quieres reflejar lo solicitado
  if (kpiTiempo && kpiTiempo.previousElementSibling) {
    kpiTiempo.previousElementSibling.textContent = "Tiempo de Vuelo Total";
  }

  /* =====================================================
     🧰 HELPERS
  ===================================================== */

  function obtenerFechaHoy() {
    return new Date().toISOString().split("T")[0];
  }

  function escapeHtml(valor) {
    return String(valor ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatearFechaHora(fechaISO) {
    if (!fechaISO) return "-";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString("es-PE", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  function formatearMinutos(minutos) {
    const total = Number(minutos) || 0;
    const horas = Math.floor(total / 60);
    const mins = total % 60;
    return `${horas} h ${mins} min`;
  }

  function nombreArchivoSeguro(nombre) {
    return (nombre || "archivo")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_");
  }

  function getCheckedValues(containerId) {
    return [...document.querySelectorAll(`#${containerId} input:checked`)]
      .map(el => el.value);
  }

  function resetUI() {
    grupoSector.style.display = "none";
    grupoDireccion.style.display = "none";
    grupoSubtipo.style.display = "none";
    grupoMotivo.style.display = "none";
    grupoDetalle.style.display = "none";
    grupoColegio.style.display = "none";
  }

  function limpiarFormulario() {
    form.reset();
    resetUI();
    direccion.value = "";
    buscarColegio.value = "";
    listaColegios.innerHTML = "";
  }

  function renderColegios(filtro = "") {
    listaColegios.innerHTML = "";

    colegios
      .filter(c => c.toLowerCase().includes(filtro.toLowerCase()))
      .forEach(c => {
        const option = document.createElement("option");
        option.value = c;
        option.textContent = c;
        listaColegios.appendChild(option);
      });
  }

  function construirDescripcionMision(m) {
    const partes = [];

    if (m.tipo) partes.push(`<strong>Tipo:</strong> ${escapeHtml(m.tipo)}`);
    if (m.sector) partes.push(`<strong>Sector:</strong> ${escapeHtml(m.sector)}`);
    if (m.direccion) partes.push(`<strong>Dirección:</strong> ${escapeHtml(m.direccion)}`);
    if (m.subtipo) partes.push(`<strong>Subtipo:</strong> ${escapeHtml(m.subtipo)}`);
    if (m.motivo) partes.push(`<strong>Motivo:</strong> ${escapeHtml(m.motivo)}`);
    if (m.detalle) partes.push(`<strong>Detalle:</strong> ${escapeHtml(m.detalle)}`);

    return partes.join("<br>");
  }

  function obtenerPilotosBase() {
    return [
      "Fernando Brusco",
      "Julio Callan",
      "Jhulmar Márquez"
    ];
  }

  function filtrarMisionesSegunVista(lista) {
    if (filtroActual === "todo") return [...lista];

    const fechaFiltro = filtroActual === "hoy" ? obtenerFechaHoy() : fechaSeleccionada;
    return lista.filter(m => m.fechaDia === fechaFiltro);
  }

  /* =====================================================
     🎛️ EVENTOS UI FORM
  ===================================================== */

  buscarColegio?.addEventListener("input", () => {
    renderColegios(buscarColegio.value);
  });

  listaColegios?.addEventListener("change", () => {
    direccion.value = listaColegios.value;
  });

  tipoMision?.addEventListener("change", () => {
    const valor = tipoMision.value;

    resetUI();
    if (!valor) return;

    grupoSector.style.display = "block";

    if (valor === "colegio") {
      grupoColegio.style.display = "block";
      grupoDireccion.style.display = "none";
      renderColegios();
      direccion.value = "";
    } else {
      grupoDireccion.style.display = "block";
    }

    if (valor === "emergencia") {
      grupoSubtipo.style.display = "block";
    } else {
      grupoMotivo.style.display = "block";
    }
  });

  subtipo?.addEventListener("change", () => {
    grupoDetalle.style.display = subtipo.value === "Otros" ? "block" : "none";
  });

  /* =====================================================
     🧪 VALIDACIÓN
  ===================================================== */

  function validar() {
    if (!tipoMision.value) {
      alert("Seleccione tipo de misión");
      return false;
    }

    if (!sector.value) {
      alert("Seleccione sector");
      return false;
    }

    if (tipoMision.value === "colegio") {
      if (!direccion.value) {
        alert("Seleccione un colegio");
        return false;
      }
    } else {
      if (!direccion.value.trim()) {
        alert("Ingrese dirección");
        return false;
      }
    }

    if (tipoMision.value === "emergencia") {
      if (!subtipo.value) {
        alert("Seleccione subtipo de emergencia");
        return false;
      }

      if (subtipo.value === "Otros" && !detalle.value.trim()) {
        alert("Ingrese detalle de la emergencia");
        return false;
      }
    } else {
      if (!motivo.value.trim()) {
        alert("Ingrese motivo de la misión");
        return false;
      }
    }

    const pilotos = getCheckedValues("pilotos");
    if (pilotos.length === 0) {
      alert("Seleccione al menos un piloto");
      return false;
    }

    const drones = getCheckedValues("drones");
    if (drones.length === 0) {
      alert("Seleccione al menos un dron");
      return false;
    }

    return true;
  }

  /* =====================================================
     📦 DATA
  ===================================================== */

  function construirData() {
    const ahora = new Date();
    const fechaDia = ahora.toISOString().split("T")[0];

    return {
      tipo: tipoMision.value,
      sector: sector.value,
      direccion: direccion.value,
      motivo: motivo.value?.trim() || null,
      subtipo: subtipo.value || null,
      detalle: detalle.value?.trim() || null,
      pilotos: getCheckedValues("pilotos"),
      drones: getCheckedValues("drones"),
      tiempoVuelo: parseInt(tiempoVuelo.value, 10) || 0,
      fecha: ahora.toISOString(),
      fechaDia,
      archivoUrl: null,
      archivoNombre: null,
      archivoTipo: null,
      storagePath: null
    };
  }

  /* =====================================================
     📤 SUBIR ARCHIVO A STORAGE
  ===================================================== */

  async function subirArchivoDeMision(file, fechaDia, misionId, docPath) {
    if (!file) return null;

    const nombreSeguro = `${Date.now()}_${nombreArchivoSeguro(file.name)}`;
    const rutaStorage = `misiones/${fechaDia}/${misionId}/${nombreSeguro}`;

    const archivoRef = storageRef(storage, rutaStorage);
    await uploadBytes(archivoRef, file);
    const url = await getDownloadURL(archivoRef);

    await updateDoc(doc(db, docPath), {
      archivoUrl: url,
      archivoNombre: file.name,
      archivoTipo: file.type || "application/octet-stream",
      storagePath: rutaStorage,
      archivoActualizadoAt: serverTimestamp()
    });

    return {
      archivoUrl: url,
      archivoNombre: file.name,
      archivoTipo: file.type || "application/octet-stream",
      storagePath: rutaStorage
    };
  }

  /* =====================================================
     💾 GUARDAR MISIÓN
  ===================================================== */

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validar()) return;

    const btnSubmit = form.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit ? btnSubmit.textContent : "Guardar";

    try {
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Guardando...";
      }

      const data = construirData();
      const archivo = inputArchivo?.files?.[0] || null;

      const refColeccion = collection(db, "misiones_por_dia", data.fechaDia, "misiones");

      const docRef = await addDoc(refColeccion, {
        ...data,
        createdAt: serverTimestamp()
      });

      if (archivo) {
        await subirArchivoDeMision(archivo, data.fechaDia, docRef.id, docRef.path);
      }

      alert("✅ Misión registrada correctamente");
      limpiarFormulario();
      await refrescarTodo();

    } catch (error) {
      console.error("❌ Error al guardar misión:", error);
      alert("❌ Error al guardar en Firebase");
    } finally {
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.textContent = textoOriginal;
      }
    }
  });

  /* =====================================================
     📥 CARGA GENERAL
  ===================================================== */

  async function obtenerTodasLasMisiones() {
    const snap = await getDocs(collectionGroup(db, "misiones"));

    const lista = snap.docs.map(d => ({
      id: d.id,
      __path: d.ref.path,
      ...d.data()
    }));

    lista.sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));
    return lista;
  }

  /* =====================================================
     📊 HISTORIAL
  ===================================================== */

  function renderTabla(lista) {
    tabla.innerHTML = "";

    if (!lista.length) {
      tabla.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;">Sin registros</td>
        </tr>
      `;
      return;
    }

    const filas = lista.map((m, index) => {
      const tieneArchivo = !!m.archivoUrl;
      const textoBoton = tieneArchivo ? "Cambiar archivo" : "Subir archivo";
      const textoVer = tieneArchivo ? "Ver archivo" : "Sin archivo";

      const infoArchivo = tieneArchivo
        ? `<div style="margin-top:6px; font-size:12px; color:#64748b;">${escapeHtml(m.archivoNombre || "Archivo adjunto")}</div>`
        : `<div style="margin-top:6px; font-size:12px; color:#94a3b8;">No adjunto</div>`;

      return `
        <tr>
          <td>${formatearFechaHora(m.fecha)}</td>

          <td>
            <div style="line-height:1.45;">
              ${construirDescripcionMision(m)}
            </div>
          </td>

          <td>${escapeHtml((m.pilotos || []).join(", ")) || "-"}</td>

          <td>${escapeHtml((m.drones || []).join(", ")) || "-"}</td>

          <td>${escapeHtml(m.tiempoVuelo || 0)} min</td>

          <td>
            <div style="display:flex; flex-direction:column; gap:6px;">
              ${
                tieneArchivo
                  ? `<a href="${m.archivoUrl}" target="_blank" rel="noopener" class="btn">${textoVer}</a>`
                  : `<button type="button" class="btn" disabled>${textoVer}</button>`
              }

              <button
                type="button"
                class="btn btn-subir-archivo"
                data-path="${escapeHtml(m.__path)}"
                data-id="${escapeHtml(m.id)}"
                data-fecha="${escapeHtml(m.fechaDia || "")}"
              >
                ${textoBoton}
              </button>

              ${infoArchivo}

              <input
                type="file"
                accept="image/*,video/*"
                style="display:none;"
                id="archivo-mision-${index}"
                class="input-archivo-mision"
                data-path="${escapeHtml(m.__path)}"
                data-id="${escapeHtml(m.id)}"
                data-fecha="${escapeHtml(m.fechaDia || "")}"
              />
            </div>
          </td>
        </tr>
      `;
    }).join("");

    tabla.innerHTML = filas;
  }

  /* =====================================================
     📈 KPIs
  ===================================================== */

  function actualizarKPIs(listaTotal) {
    const hoy = obtenerFechaHoy();
    const misionesHoy = listaTotal.filter(m => m.fechaDia === hoy);

    const totalMisiones = listaTotal.length;
    const totalHoy = misionesHoy.length;
    const totalTiempoGeneral = listaTotal.reduce((acc, m) => acc + (Number(m.tiempoVuelo) || 0), 0);

    if (kpiHoy) kpiHoy.textContent = String(totalHoy);
    if (kpiTotal) kpiTotal.textContent = String(totalMisiones);
    if (kpiTiempo) kpiTiempo.textContent = formatearMinutos(totalTiempoGeneral);
  }

  function actualizarReportePilotos(listaTotal) {
    const pilotosBase = obtenerPilotosBase();

    const resumen = {};
    pilotosBase.forEach(nombre => {
      resumen[nombre] = {
        misiones: 0,
        tiempo: 0
      };
    });

    listaTotal.forEach(mision => {
      const tiempo = Number(mision.tiempoVuelo) || 0;
      const pilotos = Array.isArray(mision.pilotos) ? mision.pilotos : [];

      pilotos.forEach(nombre => {
        if (!resumen[nombre]) {
          resumen[nombre] = { misiones: 0, tiempo: 0 };
        }
        resumen[nombre].misiones += 1;
        resumen[nombre].tiempo += tiempo;
      });
    });

    const cards = document.querySelectorAll(".pilot-card");

    cards.forEach(card => {
      const nombre = card.querySelector("h3")?.textContent?.trim();
      const p = card.querySelector("p");
      const span = card.querySelector("span");

      const data = resumen[nombre] || { misiones: 0, tiempo: 0 };

      if (p) {
        p.textContent = `${data.misiones} ${data.misiones === 1 ? "mision" : "misiones"}`;
      }

      if (span) {
        span.textContent = formatearMinutos(data.tiempo);
      }
    });
  }

  /* =====================================================
     🔄 REFRESCO GENERAL
  ===================================================== */

  function aplicarFiltroYRender() {
    const listaFiltrada = filtrarMisionesSegunVista(cacheMisiones);
    renderTabla(listaFiltrada);
  }

  async function refrescarTodo() {
    try {
      tabla.innerHTML = `<tr><td colspan="6" style="text-align:center;">Cargando...</td></tr>`;
      cacheMisiones = await obtenerTodasLasMisiones();

      actualizarKPIs(cacheMisiones);
      actualizarReportePilotos(cacheMisiones);
      aplicarFiltroYRender();
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      tabla.innerHTML = `<tr><td colspan="6" style="text-align:center;">Error al cargar</td></tr>`;
    }
  }

  /* =====================================================
     📅 FILTROS HISTORIAL
  ===================================================== */

  filtroFecha?.addEventListener("change", () => {
    if (!filtroFecha.value) return;
    filtroActual = "fecha";
    fechaSeleccionada = filtroFecha.value;
    aplicarFiltroYRender();
  });

  btnHoy?.addEventListener("click", () => {
    filtroActual = "hoy";
    fechaSeleccionada = obtenerFechaHoy();
    if (filtroFecha) filtroFecha.value = fechaSeleccionada;
    aplicarFiltroYRender();
  });

  btnTodo?.addEventListener("click", () => {
    filtroActual = "todo";
    if (filtroFecha) filtroFecha.value = "";
    aplicarFiltroYRender();
  });

  /* =====================================================
     📎 SUBIR / CAMBIAR ARCHIVO DESDE HISTORIAL
  ===================================================== */

  tabla?.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-subir-archivo");
    if (!btn) return;

    const path = btn.dataset.path;
    const fecha = btn.dataset.fecha;
    const id = btn.dataset.id;

    const input = [...tabla.querySelectorAll(".input-archivo-mision")]
      .find(el =>
        el.dataset.path === path &&
        el.dataset.fecha === fecha &&
        el.dataset.id === id
      );

    if (input) input.click();
  });

  tabla?.addEventListener("change", async (e) => {
    const input = e.target.closest(".input-archivo-mision");
    if (!input) return;

    const file = input.files?.[0];
    if (!file) return;

    const path = input.dataset.path;
    const fecha = input.dataset.fecha;
    const id = input.dataset.id;

    try {
      const btn = tabla.querySelector(`.btn-subir-archivo[data-path="${CSS.escape(path)}"][data-id="${CSS.escape(id)}"]`);
      const textoOriginal = btn ? btn.textContent : "";

      if (btn) {
        btn.disabled = true;
        btn.textContent = "Subiendo...";
      }

      await subirArchivoDeMision(file, fecha, id, path);

      alert("✅ Archivo subido correctamente");
      await refrescarTodo();

      if (btn) {
        btn.disabled = false;
        btn.textContent = textoOriginal;
      }
    } catch (error) {
      console.error("❌ Error al subir archivo:", error);
      alert("❌ Error al subir el archivo");
    } finally {
      input.value = "";
    }
  });

  /* =====================================================
     🚀 INIT
  ===================================================== */

  function init() {
    resetUI();

    if (filtroFecha) {
      filtroFecha.value = obtenerFechaHoy();
    }

    refrescarTodo();
  }

  init();

})();