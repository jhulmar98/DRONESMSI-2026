

// ===============================
// 🎓 ICONO PERSONALIZADO COLEGIO
// ===============================
const iconoColegio = L.icon({
  iconUrl: "../casa1.png",

  iconSize: [30, 30],     // tamaño del icono
  iconAnchor: [15, 30],   // punto exacto del marcador
  popupAnchor: [0, -30]   // posición del popup
});

// ===============================
// 📊 DATA AGRUPADA (SIN DUPLICADOS)
// ===============================
const colegios = [
  
  {
    nombre: "1051 EL OLIVAR",
    direccion: "Calle Prolong Arenales 300",
    niveles: ["Primaria", "Inicial - Jardín"],
    lat: -12.1021,
    lng: -77.0332
  },
  {
    nombre: "1071 ALFONSO UGARTE",
    direccion: "Av. Paseo de la Republica 3530",
    niveles: ["Inicial - Jardín", "Primaria", "Secundaria"],
    lat: -12.09907859,
    lng: -77.02698547
  },
  {
    nombre: "138 MI CASITA DE SORPRESAS",
    direccion: "Calle 32 174",
    niveles: ["Inicial - Cuna Jardín"],
    lat: -12.10804,
    lng: -77.01388
  },
  {
    nombre: "ALMA MATER",
    direccion: "Avenida Cadiz 280",
    niveles: ["Inicial - Cuna Jardín"],
    lat: -12.0882,
    lng: -77.04895
  },
  {
    nombre: "AMIGOS DE GONZAGA",
    direccion: "Jiron Juan Polar 130",
    niveles: ["Inicial - Jardín"],
    lat: -12.0954,
    lng: -77.05703
  },
  {
    nombre: "BERKELEY SCHOOL",
    direccion: "Jiron Juan Elespuru 402",
    niveles: ["Inicial - Jardín", "Primaria", "Secundaria"],
    lat: -12.09638,
    lng: -77.05388
  },
  {
    nombre: "BRIGHTON NURSERY SCHOOL",
    direccion: "Calle Juan Dellepiani 655",
    niveles: ["Inicial - Jardín"],
    lat: -12.10471,
    lng: -77.05572
  },
  {
    nombre: "CAMINITO",
    direccion: "Calle 32 225",
    niveles: ["Inicial - Jardín"],
    lat: -12.10765,
    lng: -77.01321
  },
  {
    nombre: "CHIQUITINES",
    direccion: "Calle Ugarte y Moscoso 958",
    niveles: ["Inicial - Cuna Jardín"],
    lat: -12.10145,
    lng: -77.05891
  },
  {
    nombre: "CRI - ARTE",
    direccion: "Calle Juan Cavero 180",
    niveles: ["Inicial - Cuna Jardín"],
    lat: -12.10197,
    lng: -77.03653
  },
  {
    nombre: "CRISTO REDENTOR",
    direccion: "Av. Juan Dellepiani 151",
    niveles: ["Primaria", "Secundaria"],
    lat: -12.09918,
    lng: -77.05464
  },
  {
    nombre: "DE LOS SAGRADOS CORAZONES BELEN",
    direccion: "Av. Alvarez Calderon 761",
    niveles: ["Inicial - Jardín", "Primaria", "Secundaria"],
    lat: -12.10346,
    lng: -77.04653
  },
  {
    nombre: "FRIENDSHIP HIGH SCHOOL",
    direccion: "Calle La Habana 155",
    niveles: ["Primaria", "Secundaria"],
    lat: -12.09952,
    lng: -77.03157
  },
  {
    nombre: "GARABATOS",
    direccion: "Av. Los Laureles 447",
    niveles: ["Inicial - Cuna Jardín"],
    lat: -12.09664,
    lng: -77.0457
  },
  {
    nombre: "GARABATOS 3",
    direccion: "Calle Manuel Ugarte y Moscoso 620",
    niveles: ["Inicial - Cuna Jardín"],
    lat: -12.09787477,
    lng: -77.05709696
  },
  {
    nombre: "ISABEL FLORES DE OLIVA",
    direccion: "Calle Dellepiane 530",
    niveles: ["Inicial - Jardín", "Primaria", "Secundaria"],
    lat: -12.10351,
    lng: -77.05583
  },
  {
    nombre: "JESUALDO",
    direccion: "Av. Guillermo Prescott 336",
    niveles: ["Inicial - Jardín", "Primaria"],
    lat: -12.08901,
    lng: -77.04798
  },
  {
    nombre: "JOHN NEPER",
    direccion: "Av. Jose Galvez Barrenechea 525",
    niveles: ["Inicial - Jardín", "Primaria", "Secundaria"],
    lat: -12.09636,
    lng: -77.01262
  },
  {
    nombre: "KANGURITO",
    direccion: "Calle Carlos Concha 190",
    niveles: ["Inicial - Cuna Jardín"],
    lat: -12.10421,
    lng: -77.05665
  },
  {
    nombre: "LA TIA CARMELA",
    direccion: "Calle Los Cedros 625",
    niveles: ["Inicial - Cuna Jardín"],
    lat: -12.09781,
    lng: -77.04334
  },
  {
    nombre: "LAS GARZAS",
    direccion: "Calle Las Garzas 421",
    niveles: ["Inicial - Jardín"],
    lat: -12.1013,
    lng: -77.02511
  },
  {
    nombre: "LEON PINELO",
    direccion: "Calle Maimonides 610",
    niveles: ["Inicial - Cuna Jardín", "Primaria", "Secundaria"],
    lat: -12.10241651,
    lng: -77.05289582
  },
  {
    nombre: "LITTLE ONES",
    direccion: "Calle Hermilio Hernandez 154-160",
    niveles: ["Inicial - Cuna Jardín"],
    lat: -12.10075,
    lng: -77.03303
  },
  {
    nombre: "MAGIC WORLD",
    direccion: "Calle 26 170",
    niveles: ["Inicial - Cuna Jardín"],
    lat: -12.10596,
    lng: -77.01399
  },
  {
    nombre: "MARIA REINA MARIANISTAS",
    direccion: "Av. Pardo y Aliaga 321",
    niveles: ["Inicial - Jardín", "Primaria", "Secundaria"],
    lat: -12.10816462,
    lng: -77.03626399
  },
  {
    nombre: "MONTEALTO",
    direccion: "Av. Los Eucaliptos 491",
    niveles: ["Primaria", "Secundaria"],
    lat: -12.09696,
    lng: -77.04796
  },
  {
    nombre: "MY WORLD",
    direccion: "Calle 19 105",
    niveles: ["Inicial - Jardín"],
    lat: -12.09607,
    lng: -77.01449
  },
  {
    nombre: "NIDO KILLA",
    direccion: "Calle Los Cedros 432",
    niveles: ["Inicial - Cuna Jardín"],
    lat: -12.09622,
    lng: -77.04369
  },
  {
    nombre: "NIDO PAIND",
    direccion: "Av. Guillermo Prescott 145",
    niveles: ["Inicial - Cuna Jardín"],
    lat: -12.09223,
    lng: -77.0477
  },
  {
    nombre: "NUESTRA SEÑORA DE LA LUZ",
    direccion: "Calle Coronel Odriozola 580 / Av. Republica de Colombia 460",
    niveles: ["Inicial - Cuna Jardín", "Primaria", "Secundaria"],
    lat: -12.09777,
    lng: -77.02996
  },
  {
    nombre: "PALITROQUES",
    direccion: "Av. Jose Galvez Barrenechea 191",
    niveles: ["Inicial - Cuna Jardín"],
    lat: -12.09142,
    lng: -77.01356
  },
  {
    nombre: "REINA DE LA PAZ",
    direccion: "Av. Alfredo Salazar 1290",
    niveles: ["Inicial - Jardín", "Primaria", "Secundaria"],
    lat: -12.10651,
    lng: -77.04741
  },
  {
    nombre: "RUDOLF STEINER",
    direccion: "Plaza Padre Constancio Bollar 200",
    niveles: ["Inicial - Jardín", "Primaria"],
    lat: -12.09286,
    lng: -77.0337
  },
  {
    nombre: "SAGRADO CORAZON SOPHIANUM",
    direccion: "Av. Salaverry 2100",
    niveles: ["Inicial - Jardín", "Primaria", "Secundaria"],
    lat: -12.08606,
    lng: -77.04934
  },
  {
    nombre: "SAN AGUSTIN",
    direccion: "Av. Javier Prado Este 980",
    niveles: ["Inicial - Jardín", "Primaria", "Secundaria"],
    lat: -12.09073,
    lng: -77.02077
  },
  {
    nombre: "SANTA ROSA",
    direccion: "Av. Prolong Arenales 420",
    niveles: ["Inicial - Jardín", "Primaria", "Secundaria"],
    lat: -12.1032,
    lng: -77.0332
  },
  {
    nombre: "SANTA URSULA",
    direccion: "Calle Salamanca 125",
    niveles: ["Inicial - Jardín", "Primaria", "Secundaria"],
    lat: -12.09634404,
    lng: -77.03943582
  },
  {
    nombre: "SMART KIDS",
    direccion: "Calle 16 148",
    niveles: ["Inicial - Cuna Jardín"],
    lat: -12.09368,
    lng: -77.01521
  },
  {
    nombre: "TPJ EN FESTINI",
    direccion: "Jiron Antequera 719",
    niveles: ["Inicial - Cuna Jardín"],
    lat: -12.09492,
    lng: -77.02861
  },
  {
    nombre: "TRILCE DE SAN ISIDRO",
    direccion: "Calle Rio de la Plata 120",
    niveles: ["Secundaria"],
    lat: -12.10077,
    lng: -77.0317
  },
  {
    nombre: "SOR ROSA LARRABURE",
    direccion: "Calle Samuel Velarde 110",
    niveles: ["Primaria"],
    lat: -12.100615,
    lng: -77.059546
  },
  {
    nombre: "CIFO",
    direccion: "Calle Manuel Salazar 220",
    niveles: ["Nido"],
    lat: -12.103938,
    lng: -77.056115
  }
];


// ===============================
// 📍 AGREGAR MARCADORES
// ===============================
colegios.forEach((col) => {

  const marker = L.marker([col.lat, col.lng], {
    icon: iconoColegio
  }).addTo(map);
  marker.setZIndexOffset(1000);
  // ===============================
  // 🪟 POPUP BONITO
  // ===============================
  const popupHTML = `
    <div style="font-family:sans-serif; min-width:200px;">
      <h3 style="margin:0; color:#1D4E89;">${col.nombre}</h3>
      <p style="margin:5px 0; font-size:13px;">
        📍 ${col.direccion}
      </p>
      <p style="margin:5px 0; font-size:13px;">
        🎓 ${col.niveles.join(", ")}
      </p>

      
    </div>
  `;

  marker.bindPopup(popupHTML);

  // ===============================
  // 🧠 CLICK EVENTO
  // ===============================
  marker.on("click", () => {
    console.log("Colegio:", col.nombre);
  });
 
});