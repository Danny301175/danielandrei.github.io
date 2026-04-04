/* ============================================
   loader.js — Danielandrei · Fotografía & IT
   ============================================
   Pantalla de bienvenida dividida en dos paneles.
   El usuario elige a qué sección ir haciendo
   clic en el panel que le interesa.

   CÓMO USAR:
   Añade esta línea en tu index.html antes de </body>:
       <script src="loader.js"></script>

   CAMBIAR LAS FOTOS:
   Sube tus fotos al repositorio y cambia
   FOTO_IZQUIERDA y FOTO_DERECHA abajo.
   Ejemplo: 'fotos/arquitectura.jpg'

   CAMBIAR LOS DESTINOS:
   Cambia DESTINO_IZQUIERDA y DESTINO_DERECHA
   por el id de la sección a la que quieres ir.
   ============================================ */


/* ──────────────────────────────────────────
   CONFIGURACIÓN
   ────────────────────────────────────────── */

var CONFIG = {

  /* Fotos de fondo de cada panel.
     Cámbialas por tus propias fotos cuando las tengas. */
  FOTO_IZQUIERDA: 'IMG/Fotografo.jpg',
  FOTO_DERECHA:   'IMG/Tecnico IT.jpg',

  /* Textos */
  NUMERO_IZQUIERDA:    '01',
  TEXTO_IZQUIERDA:     'Fotógrafo',
  SUBTEXTO_IZQUIERDA:  'Paisaje · Arquitectura · Urbano',

  NUMERO_DERECHA:      '02',
  TEXTO_DERECHA:       'Técnico IT',
  SUBTEXTO_DERECHA:    'Reparación · Mantenimiento',

  TEXTO_CTA: 'Entrar →',

  /* Secciones destino al hacer clic */
  DESTINO_IZQUIERDA: '#portfolio',
  DESTINO_DERECHA:   '#servicios-it',

  /* Color del overlay sobre las fotos */
  COLOR_OVERLAY: 'rgba(18, 12, 6, 0.52)',

  /* Tiempos de entrada (milisegundos) */
  TIEMPO_TEXTOS: 200,
  TIEMPO_LINEA:  500,

  /* Duración de la animación de salida al elegir */
  TIEMPO_SALIDA: 1100,
};


/* ──────────────────────────────────────────
   ESTILOS
   ────────────────────────────────────────── */

var estilos = document.createElement('style');
estilos.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&family=Jost:wght@300&display=swap');

  #da-loader {
    position: fixed;
    inset: 0;
    display: flex;
    z-index: 9999;
  }

  #da-linea {
    position: fixed;
    left: 50%;
    top: 0; bottom: 0;
    width: 1px;
    background: rgba(200, 191, 171, 0.45);
    z-index: 10000;
    pointer-events: none;
    transform: scaleY(0);
    transform-origin: center;
    transition: transform 0.5s ease;
  }
  #da-linea.visible { transform: scaleY(1); }

  .da-panel {
    width: 50%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 1s cubic-bezier(0.76, 0, 0.24, 1),
                width 0.4s ease;
  }

  /* Al hacer hover, el panel activo se expande */
  .da-panel:hover { width: 56%; }
  .da-panel:hover ~ .da-panel { width: 44%; }

  .da-panel-izq { transform: translateX(0); }
  .da-panel-der { transform: translateX(0); }
  .da-panel-izq.abierto { transform: translateX(-100%); }
  .da-panel-der.abierto { transform: translateX(100%); }

  .da-foto {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transition: transform 8s ease;
  }
  .da-foto.zoom { transform: scale(1.07); }

  .da-overlay {
    position: absolute;
    inset: 0;
    transition: background 0.4s ease;
  }
  .da-panel:hover .da-overlay {
    background: rgba(18, 12, 6, 0.32) !important;
  }

  .da-contenido {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    text-align: center;
    padding: 2rem;
    pointer-events: none;
    user-select: none;
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
    transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
  }

  .da-linea-h {
    width: 0;
    height: 1px;
    background: #9c8060;
    transition: width 0.6s ease 0.25s;
  }

  .da-subtitulo {
    font-family: 'Jost', sans-serif;
    font-size: 0.58rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #c8bfab;
    opacity: 0;
    transition: opacity 0.5s ease 0.35s;
  }

  /* Botón CTA — solo visible al hacer hover */
  .da-cta {
    font-family: 'Jost', sans-serif;
    font-size: 0.62rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #f5f0e8;
    border: 1px solid rgba(200, 191, 171, 0.4);
    padding: 9px 22px;
    margin-top: 0.4rem;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease;
  }
  .da-panel:hover .da-cta {
    opacity: 1;
    transform: translateY(0);
    background: rgba(200, 191, 171, 0.12);
  }

  /* Activar textos cuando el loader está listo */
  #da-loader.activo .da-numero    { opacity: 1; transform: translateY(0); }
  #da-loader.activo .da-titulo    { opacity: 1; transform: translateY(0); }
  #da-loader.activo .da-linea-h   { width: 48px; }
  #da-loader.activo .da-subtitulo { opacity: 1; }
`;
document.head.appendChild(estilos);


/* ──────────────────────────────────────────
   HTML
   ────────────────────────────────────────── */

var lineaCentral = document.createElement('div');
lineaCentral.id = 'da-linea';
document.body.appendChild(lineaCentral);

var loader = document.createElement('div');
loader.id = 'da-loader';
loader.innerHTML =
  '<div class="da-panel da-panel-izq" id="da-izq">' +
    '<div class="da-foto" id="da-foto-izq" style="background-image: url(\'' + CONFIG.FOTO_IZQUIERDA + '\');"></div>' +
    '<div class="da-overlay" style="background: ' + CONFIG.COLOR_OVERLAY + ';"></div>' +
    '<div class="da-contenido">' +
      '<span class="da-numero">' + CONFIG.NUMERO_IZQUIERDA + '</span>' +
      '<div class="da-titulo">' + CONFIG.TEXTO_IZQUIERDA + '</div>' +
      '<div class="da-linea-h"></div>' +
      '<span class="da-subtitulo">' + CONFIG.SUBTEXTO_IZQUIERDA + '</span>' +
      '<div class="da-cta">' + CONFIG.TEXTO_CTA + '</div>' +
    '</div>' +
  '</div>' +
  '<div class="da-panel da-panel-der" id="da-der">' +
    '<div class="da-foto" id="da-foto-der" style="background-image: url(\'' + CONFIG.FOTO_DERECHA + '\');"></div>' +
    '<div class="da-overlay" style="background: ' + CONFIG.COLOR_OVERLAY + ';"></div>' +
    '<div class="da-contenido">' +
      '<span class="da-numero">' + CONFIG.NUMERO_DERECHA + '</span>' +
      '<div class="da-titulo">' + CONFIG.TEXTO_DERECHA + '</div>' +
      '<div class="da-linea-h"></div>' +
      '<span class="da-subtitulo">' + CONFIG.SUBTEXTO_DERECHA + '</span>' +
      '<div class="da-cta">' + CONFIG.TEXTO_CTA + '</div>' +
    '</div>' +
  '</div>';
document.body.appendChild(loader);


/* ──────────────────────────────────────────
   ANIMACIÓN DE ENTRADA
   ────────────────────────────────────────── */

var panelIzq = document.getElementById('da-izq');
var panelDer = document.getElementById('da-der');

// Zoom suave en las fotos
setTimeout(function() {
  document.getElementById('da-foto-izq').classList.add('zoom');
  document.getElementById('da-foto-der').classList.add('zoom');
}, 60);

// Textos aparecen
setTimeout(function() {
  loader.classList.add('activo');
}, CONFIG.TIEMPO_TEXTOS);

// Línea central
setTimeout(function() {
  lineaCentral.classList.add('visible');
}, CONFIG.TIEMPO_LINEA);

// NO hay cierre automático — el usuario elige haciendo clic


/* ──────────────────────────────────────────
   ELECCIÓN DEL USUARIO
   ────────────────────────────────────────── */

function elegir(destino) {
  var duracion = CONFIG.TIEMPO_SALIDA / 1000;

  panelIzq.style.transition = 'transform ' + duracion + 's cubic-bezier(0.76, 0, 0.24, 1)';
  panelDer.style.transition = 'transform ' + duracion + 's cubic-bezier(0.76, 0, 0.24, 1)';

  panelIzq.classList.add('abierto');
  panelDer.classList.add('abierto');

  lineaCentral.style.transition = 'transform 0.4s ease';
  lineaCentral.style.transform  = 'scaleY(0)';

  setTimeout(function() {
    if (loader.parentNode)       loader.parentNode.removeChild(loader);
    if (lineaCentral.parentNode) lineaCentral.parentNode.removeChild(lineaCentral);

    var seccion = document.querySelector(destino);
    if (seccion) {
      seccion.scrollIntoView({ behavior: 'smooth' });
    }
  }, CONFIG.TIEMPO_SALIDA);
}

panelIzq.addEventListener('click', function() { elegir(CONFIG.DESTINO_IZQUIERDA); });
panelDer.addEventListener('click', function() { elegir(CONFIG.DESTINO_DERECHA); });


/* ──────────────────────────────────────────
   IDEAS PARA EL FUTURO
   ──────────────────────────────────────────

  IDEA A — Mostrar el loader solo la primera vez
  (no cada vez que el usuario recarga la página):
  ----------------------------------------
  Envuelve todo el código de animación así:

  if (sessionStorage.getItem('loaderVisto')) {
    loader.remove();
    lineaCentral.remove();
  } else {
    sessionStorage.setItem('loaderVisto', 'true');
    // aquí el código de animación de entrada
  }


  IDEA B — Nombre en la línea central:
  ----------------------------------------
  Añade esto después de crear lineaCentral:

  var nombreLinea = document.createElement('span');
  nombreLinea.textContent = 'Danielandrei';
  nombreLinea.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-90deg);font-family:"Cormorant Garamond",serif;font-size:0.7rem;letter-spacing:3px;color:#c8bfab;white-space:nowrap;';
  lineaCentral.appendChild(nombreLinea);


  IDEA C — Sonido suave al elegir:
  ----------------------------------------
  Al inicio de la función elegir() añade:

  var audio = new Audio('click.mp3');
  audio.volume = 0.2;
  audio.play().catch(function() {});

   ────────────────────────────────────────── */
