/* ============================================
   loader.js — Danielandrei · Fotografía & IT
   ============================================
   Animación de carga al entrar en la web.
   Pantalla dividida en dos paneles con fotos
   que se abren hacia los lados revelando la web.

   CÓMO USAR:
   1. Añade este archivo a tu repositorio
   2. En index.html, antes de </body>, pon:
         <script src="loader.js"></script>
   3. El loader se inyecta solo, no necesitas
      tocar el HTML ni el CSS.

   CAMBIAR LAS FOTOS:
   - Sube tus fotos al repositorio de GitHub
   - Cambia las variables FOTO_IZQUIERDA y
     FOTO_DERECHA de abajo por el nombre
     de tus archivos.
   ============================================ */


/* ──────────────────────────────────────────
   CONFIGURACIÓN — cambia esto a tu gusto
   ────────────────────────────────────────── */

var CONFIG = {

  /* Rutas de las fotos.
     Cuando tengas tus propias fotos, súbelas
     al repositorio y pon aquí su nombre.
     Ejemplo: 'fotos/arquitectura.jpg'        */
  FOTO_IZQUIERDA: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85',
  FOTO_DERECHA:   'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85',

  /* Textos de cada panel */
  TEXTO_IZQUIERDA:    'Fotógrafo',
  SUBTEXTO_IZQUIERDA: 'Paisaje · Arquitectura · Urbano',
  TEXTO_DERECHA:      'Técnico IT',
  SUBTEXTO_DERECHA:   'Reparación · Mantenimiento',

  /* Tiempos en milisegundos */
  TIEMPO_TEXTOS:      200,   // cuándo aparecen los textos
  TIEMPO_LINEA:       500,   // cuándo aparece la línea central
  TIEMPO_APERTURA:    1500,  // cuándo se abren los paneles
  TIEMPO_OCULTAR:     2700,  // cuándo desaparece el loader del DOM

  /* Color del overlay sobre las fotos (rgba) */
  COLOR_OVERLAY: 'rgba(18, 12, 6, 0.52)',
};


/* ──────────────────────────────────────────
   ESTILOS — se inyectan automáticamente
   ────────────────────────────────────────── */

var estilos = document.createElement('style');
estilos.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&family=Jost:wght@300&display=swap');

  #da-loader {
    position: fixed;
    inset: 0;
    display: flex;
    z-index: 9999;
    pointer-events: all;
  }

  #da-loader.oculto {
    pointer-events: none;
  }

  /* Línea vertical central */
  #da-linea {
    position: fixed;
    left: 50%;
    top: 0; bottom: 0;
    width: 1px;
    background: rgba(200, 191, 171, 0.45);
    z-index: 10000;
    transform: scaleY(0);
    transform-origin: center;
    transition: transform 0.5s ease;
  }

  #da-linea.visible {
    transform: scaleY(1);
  }

  /* Paneles */
  .da-panel {
    width: 50%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 1.1s cubic-bezier(0.76, 0, 0.24, 1);
  }

  .da-panel-izq { transform: translateX(0); }
  .da-panel-der { transform: translateX(0); }

  .da-panel-izq.abierto { transform: translateX(-100%); }
  .da-panel-der.abierto { transform: translateX(100%); }

  /* Foto de fondo */
  .da-panel-foto {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transition: transform 8s ease;
  }

  /* Efecto zoom suave en la foto mientras espera */
  .da-panel-foto.zoom {
    transform: scale(1.06);
  }

  /* Overlay oscuro */
  .da-panel-overlay {
    position: absolute;
    inset: 0;
  }

  /* Contenido de texto */
  .da-panel-contenido {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    text-align: center;
    padding: 2rem;
  }

  .da-numero {
    font-family: 'Jost', sans-serif;
    font-size: 0.58rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #c8bfab;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .da-titulo {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.2rem, 5vw, 4rem);
    font-weight: 300;
    font-style: italic;
    line-height: 1;
    color: #f5f0e8;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.6s ease 0.12s, transform 0.6s ease 0.12s;
  }

  .da-linea-h {
    width: 0;
    height: 1px;
    background: #9c8060;
    transition: width 0.6s ease 0.28s;
  }

  .da-subtitulo {
    font-family: 'Jost', sans-serif;
    font-size: 0.58rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #c8bfab;
    opacity: 0;
    transition: opacity 0.5s ease 0.38s;
  }

  /* Estado activo — textos aparecen */
  #da-loader.activo .da-numero    { opacity: 1; transform: translateY(0); }
  #da-loader.activo .da-titulo    { opacity: 1; transform: translateY(0); }
  #da-loader.activo .da-linea-h   { width: 48px; }
  #da-loader.activo .da-subtitulo { opacity: 1; }
`;
document.head.appendChild(estilos);


/* ──────────────────────────────────────────
   HTML — se inyecta automáticamente
   ────────────────────────────────────────── */

// Línea central
var lineaCentral = document.createElement('div');
lineaCentral.id = 'da-linea';
document.body.appendChild(lineaCentral);

// Loader principal
var loader = document.createElement('div');
loader.id = 'da-loader';
loader.innerHTML = `
  <div class="da-panel da-panel-izq">
    <div class="da-panel-foto" style="background-image: url('${CONFIG.FOTO_IZQUIERDA}');"></div>
    <div class="da-panel-overlay" style="background: ${CONFIG.COLOR_OVERLAY};"></div>
    <div class="da-panel-contenido">
      <span class="da-numero">01</span>
      <div class="da-titulo">${CONFIG.TEXTO_IZQUIERDA}</div>
      <div class="da-linea-h"></div>
      <span class="da-subtitulo">${CONFIG.SUBTEXTO_IZQUIERDA}</span>
    </div>
  </div>
  <div class="da-panel da-panel-der">
    <div class="da-panel-foto" style="background-image: url('${CONFIG.FOTO_DERECHA}');"></div>
    <div class="da-panel-overlay" style="background: ${CONFIG.COLOR_OVERLAY};"></div>
    <div class="da-panel-contenido">
      <span class="da-numero">02</span>
      <div class="da-titulo">${CONFIG.TEXTO_DERECHA}</div>
      <div class="da-linea-h"></div>
      <span class="da-subtitulo">${CONFIG.SUBTEXTO_DERECHA}</span>
    </div>
  </div>
`;
document.body.appendChild(loader);


/* ──────────────────────────────────────────
   SECUENCIA DE ANIMACIÓN
   ────────────────────────────────────────── */

var panelIzq  = loader.querySelector('.da-panel-izq');
var panelDer  = loader.querySelector('.da-panel-der');
var fotos     = loader.querySelectorAll('.da-panel-foto');

// Paso 1 — zoom suave en las fotos desde el inicio
setTimeout(function() {
  fotos.forEach(function(foto) { foto.classList.add('zoom'); });
}, 50);

// Paso 2 — textos aparecen
setTimeout(function() {
  loader.classList.add('activo');
}, CONFIG.TIEMPO_TEXTOS);

// Paso 3 — línea central aparece
setTimeout(function() {
  lineaCentral.classList.add('visible');
}, CONFIG.TIEMPO_LINEA);

// Paso 4 — paneles se abren hacia los lados
setTimeout(function() {
  panelIzq.classList.add('abierto');
  panelDer.classList.add('abierto');
  loader.classList.add('oculto');
}, CONFIG.TIEMPO_APERTURA);

// Paso 5 — eliminar del DOM para no bloquear la web
setTimeout(function() {
  if (loader.parentNode)     loader.parentNode.removeChild(loader);
  if (lineaCentral.parentNode) lineaCentral.parentNode.removeChild(lineaCentral);
}, CONFIG.TIEMPO_OCULTAR);


/* ──────────────────────────────────────────
   ESPACIO PARA FUTURAS MEJORAS
   ──────────────────────────────────────────

  IDEA A — Que cada panel sea clickable para
  ir directamente a esa sección:
  ----------------------------------------
  panelIzq.style.cursor = 'pointer';
  panelIzq.addEventListener('click', function() {
    window.location.hash = '#portfolio';
  });
  panelDer.style.cursor = 'pointer';
  panelDer.addEventListener('click', function() {
    window.location.hash = '#servicios-it';
  });

  IDEA B — Solo mostrar el loader la primera vez
  (no cada vez que recargan la página):
  ----------------------------------------
  if (sessionStorage.getItem('loaderVisto')) {
    loader.remove();
    lineaCentral.remove();
  } else {
    sessionStorage.setItem('loaderVisto', 'true');
    // ... aquí va la secuencia de animación
  }

  IDEA C — Añadir un sonido suave al abrirse:
  ----------------------------------------
  var audio = new Audio('sonido-apertura.mp3');
  audio.volume = 0.3;
  audio.play();

   ────────────────────────────────────────── */
