/* ============================================
   galeria.js — Danielandrei · Páginas de galería
   ============================================
   Controla el lightbox y la navegación entre
   fotos. No necesitas tocarlo para el uso básico.

   FUNCIONES DISPONIBLES:
   - abrirLightbox(indice)  → abre una foto por su número
   - cerrarLightbox()       → cierra el lightbox
   - navLightbox(dir)       → navega: dir=1 siguiente, dir=-1 anterior
   ============================================ */


/* ──────────────────────────────────────────
   RECOGER TODAS LAS FOTOS DE LA PÁGINA
   ────────────────────────────────────────── */

var todasLasFotos = Array.from(document.querySelectorAll('.foto'));
var indiceActual  = 0;
var lightbox      = document.getElementById('lightbox');
var lbImg         = document.getElementById('lb-img');
var lbTitulo      = document.getElementById('lb-titulo');
var lbMeta        = document.getElementById('lb-meta');
var lbContador    = document.getElementById('lb-contador');


/* ──────────────────────────────────────────
   HACER CADA FOTO CLICKABLE
   ────────────────────────────────────────── */

todasLasFotos.forEach(function(foto, i) {
  // Aseguramos que el índice está guardado en el elemento
  foto.dataset.idx = i;

  foto.addEventListener('click', function() {
    abrirLightbox(i);
  });
});


/* ──────────────────────────────────────────
   ABRIR LIGHTBOX
   ────────────────────────────────────────── */

function abrirLightbox(indice) {
  indiceActual = indice;
  mostrarFoto(indice);
  lightbox.classList.add('activo');
  document.body.style.overflow = 'hidden'; // evita scroll de fondo
}


/* ──────────────────────────────────────────
   MOSTRAR FOTO EN LIGHTBOX
   ────────────────────────────────────────── */

function mostrarFoto(indice) {
  var fotoEl  = todasLasFotos[indice];
  var imgEl   = fotoEl.querySelector('.foto-img');
  var titulo  = fotoEl.dataset.titulo || '';
  var meta    = fotoEl.dataset.meta   || '';

  // Actualizar textos
  lbTitulo.textContent  = titulo;
  lbMeta.textContent    = meta;
  lbContador.textContent = (indice + 1) + ' / ' + todasLasFotos.length;

  // Cargar imagen
  if (imgEl && imgEl.getAttribute('src')) {
    lbImg.src = imgEl.getAttribute('src');
    lbImg.alt = titulo;

    // Reinicia la animación de entrada
    lbImg.style.animation = 'none';
    lbImg.offsetHeight; // fuerza reflow
    lbImg.style.animation = '';
  }
}


/* ──────────────────────────────────────────
   CERRAR LIGHTBOX
   ────────────────────────────────────────── */

function cerrarLightbox() {
  lightbox.classList.remove('activo');
  document.body.style.overflow = ''; // restaura el scroll
  lbImg.src = ''; // libera memoria
}


/* ──────────────────────────────────────────
   NAVEGAR ENTRE FOTOS
   ────────────────────────────────────────── */

function navLightbox(dir) {
  indiceActual = (indiceActual + dir + todasLasFotos.length) % todasLasFotos.length;
  mostrarFoto(indiceActual);
}


/* ──────────────────────────────────────────
   EVENTOS
   ────────────────────────────────────────── */

// Botón cerrar
document.getElementById('lb-cerrar').addEventListener('click', cerrarLightbox);

// Botones anterior / siguiente
document.getElementById('lb-prev').addEventListener('click', function() { navLightbox(-1); });
document.getElementById('lb-next').addEventListener('click', function() { navLightbox(1); });

// Teclado: Escape para cerrar, flechas para navegar
document.addEventListener('keydown', function(e) {
  if (!lightbox.classList.contains('activo')) return;
  if (e.key === 'Escape')      cerrarLightbox();
  if (e.key === 'ArrowRight')  navLightbox(1);
  if (e.key === 'ArrowLeft')   navLightbox(-1);
});

// Clic fuera de la imagen (en el fondo oscuro) cierra el lightbox
lightbox.addEventListener('click', function(e) {
  if (e.target === lightbox) cerrarLightbox();
});

// Swipe táctil en móvil
var touchInicioX = null;

lightbox.addEventListener('touchstart', function(e) {
  touchInicioX = e.touches[0].clientX;
}, { passive: true });

lightbox.addEventListener('touchend', function(e) {
  if (touchInicioX === null) return;
  var diff = touchInicioX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {  // umbral mínimo de 50px
    navLightbox(diff > 0 ? 1 : -1);
  }
  touchInicioX = null;
}, { passive: true });


/* ──────────────────────────────────────────
   ESPACIO PARA FUTURAS MEJORAS
   ──────────────────────────────────────────

  IDEA A — Precargar las fotos vecinas para
  que la navegación sea más fluida:
  ----------------------------------------
  function precargar(indice) {
    var siguiente = (indice + 1) % todasLasFotos.length;
    var anterior  = (indice - 1 + todasLasFotos.length) % todasLasFotos.length;
    [siguiente, anterior].forEach(function(i) {
      var img = todasLasFotos[i].querySelector('.foto-img');
      if (img) { new Image().src = img.getAttribute('src'); }
    });
  }
  // Llama a precargar(indiceActual) dentro de mostrarFoto()


  IDEA B — Mostrar EXIF de la foto (si lo añades
  como data-exif en el HTML):
  ----------------------------------------
  var lbExif = document.getElementById('lb-exif');
  // En mostrarFoto():
  var exif = fotoEl.dataset.exif || '';
  if (lbExif) lbExif.textContent = exif;
  // En el HTML añade: data-exif="f/8 · 1/250s · ISO 200"
  // Y en el lightbox: <div class="lb-exif" id="lb-exif"></div>


  IDEA C — Compartir la foto directamente:
  ----------------------------------------
  function compartirFoto() {
    if (navigator.share) {
      navigator.share({
        title: lbTitulo.textContent,
        url: window.location.href
      });
    }
  }

   ────────────────────────────────────────── */
