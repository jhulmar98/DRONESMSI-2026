/* =====================================================
   🔥 API FIREBASE - ESCUADRÓN DE DRONES
   TODO CENTRALIZADO (SIN firebase.js)
   PRODUCCIÓN READY
===================================================== */

/* =====================================================
   🔌 IMPORTS FIREBASE
===================================================== */

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  collectionGroup
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

/* =====================================================
   🚀 INIT APP (ANTI-ERROR)
===================================================== */

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);
const storage = getStorage(app);

/* =====================================================
   ➕ GUARDAR MISIÓN POR DÍA
===================================================== */

export async function guardarMision(data, archivo = null) {
  try {
    const hoy = new Date();
    const fechaId = hoy.toISOString().split("T")[0];

    const ref = collection(db, "misiones_por_dia", fechaId, "misiones");

    const docRef = await addDoc(ref, {
      ...data,
      fechaDia: fechaId,
      createdAt: serverTimestamp()
    });

    /* ================= SUBIR ARCHIVO ================= */

    if (archivo) {
      const nombre = `${Date.now()}_${archivo.name}`;
      const ruta = `misiones/${fechaId}/${docRef.id}/${nombre}`;

      const fileRef = storageRef(storage, ruta);

      await uploadBytes(fileRef, archivo);
      const url = await getDownloadURL(fileRef);

      // actualizar documento
      await addDoc(ref, {
        archivoUrl: url
      });
    }

    return docRef.id;

  } catch (error) {
    console.error("❌ Error al guardar:", error);
    throw error;
  }
}

/* =====================================================
   📥 OBTENER TODAS LAS MISIONES (CORRECTO)
===================================================== */

export async function obtenerMisiones() {
  try {
    const snap = await getDocs(collectionGroup(db, "misiones"));

    const lista = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    lista.sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));

    return lista;

  } catch (error) {
    console.error("❌ Error al obtener:", error);
    return [];
  }
}

/* =====================================================
   ❌ ELIMINAR MISIÓN
===================================================== */

export async function eliminarMision(path) {
  try {
    await deleteDoc(doc(db, path));
  } catch (error) {
    console.error("❌ Error al eliminar:", error);
  }
}

/* =====================================================
   📤 EXPORTAR CSV (CON ; PARA EXCEL)
===================================================== */

export async function exportarMisionesCSV(onProgress = null) {
  try {
    const snap = await getDocs(collectionGroup(db, "misiones"));

    if (snap.empty) return null;

    const total = snap.size;
    let procesados = 0;

    const filas = [];

    filas.push([
      "Fecha",
      "Tipo",
      "Sector",
      "Direccion",
      "Subtipo",
      "Motivo",
      "Detalle",
      "Pilotos",
      "Drones",
      "Tiempo"
    ].join(";"));

    snap.forEach(doc => {
      const m = doc.data();

      filas.push([
        new Date(m.fecha).toLocaleString("es-PE"),
        m.tipo || "",
        m.sector || "",
        (m.direccion || "").replaceAll(";", ","),
        m.subtipo || "",
        m.motivo || "",
        m.detalle || "",
        (m.pilotos || []).join(", "),
        (m.drones || []).join(", "),
        m.tiempoVuelo || 0
      ].join(";"));

      procesados++;

      if (onProgress) {
        onProgress(Math.floor((procesados / total) * 100));
      }
    });

    return filas.join("\n");

  } catch (error) {
    console.error("❌ Error exportando:", error);
    throw error;
  }
}
/* =====================================================
   🔐 AUTH FIREBASE
===================================================== */

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth(app);

/* =====================================================
   🔑 LOGIN
===================================================== */

export async function loginUsuario(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    return {
      uid: cred.user.uid,
      email: cred.user.email
    };

  } catch (error) {
    throw error;
  }
}
/* =====================================================
   EXPORTS
===================================================== */

export { db, storage };