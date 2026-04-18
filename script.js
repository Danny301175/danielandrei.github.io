/* ============================================
   script.js — Danielandrei · Fotografía & IT
   ============================================
   Aquí va toda la lógica e interactividad.
   Cada sección está comentada para que puedas
   aprender y añadir tus propias animaciones.
   ============================================ */


/* ──────────────────────────────────────────
   1. ANIMACIONES AL HACER SCROLL
   ──────────────────────────────────────────
   IntersectionObserver detecta cuando un
   elemento entra en pantalla y le añade la
   clase "visible", que dispara la animación
   definida en styles.css (.reveal → .reveal.visible)
   ────────────────────────────────────────── */

// Seleccionamos todos los elementos que queremos animar
const elementosAnimados = document.querySelectorAll(
  '.series-card, .pricing-card, .about-strip, .contact-section, .pricing-section'
);

// Añadimos la clase "reveal" a cada uno para que empiece invisible
elementosAnimados.forEach(function(el) {
  el.classList.add('reveal');
});

// Creamos el observador
const observador = new IntersectionObserver(function(entradas) {
  entradas.forEach(function(entrada) {
    // Cuando el elemento entra en pantalla...
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible'); // ...lo hacemos visible
    }
  });
}, {
  threshold: 0.1  // Se activa cuando el 10% del elemento es visible
});

// Le decimos al observador que vigile cada elemento
elementosAnimados.forEach(function(el) {
  observador.observe(el);
});


/* ──────────────────────────────────────────
   2. FORMULARIO DE CONTACTO
   ──────────────────────────────────────────
   Al enviar el formulario, construye un email
   con los datos y abre el cliente de correo.
   ────────────────────────────────────────── */

var formulario = document.getElementById('contactForm');

if (formulario) {
  formulario.addEventListener('submit', function(evento) {
    evento.preventDefault(); // Evita que la página se recargue

    // Recogemos los valores del formulario
    var nombre  = document.getElementById('nombre').value;
    var email   = document.getElementById('email').value;
    var asunto  = document.getElementById('asunto').value || 'Consulta';
    var mensaje = document.getElementById('mensaje').value;

    // Construimos el cuerpo del email
    var cuerpo = 'Nombre: ' + nombre + '\nEmail: ' + email + '\n\n' + mensaje;

    // Abrimos el cliente de correo con los datos rellenados
    window.location.href = 'mailto:hola@danielandrei.com'
      + '?subject=' + encodeURIComponent(asunto + ' - ' + nombre)
      + '&body='    + encodeURIComponent(cuerpo);

    // Mostramos el mensaje de confirmación
    var mensajeExito = document.getElementById('form-success');
    if (mensajeExito) {
      mensajeExito.style.display = 'block';
    }
  });
}


/* ──────────────────────────────────────────
   3. NAV ACTIVO AL HACER SCROLL
   ──────────────────────────────────────────
   Detecta en qué sección estás y marca el
   enlace del nav correspondiente.
   ────────────────────────────────────────── */

var secciones = document.querySelectorAll('section[id], div[id]');
var enlacesNav = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', function() {
  var scrollActual = window.scrollY + 120; // margen para el nav sticky

  secciones.forEach(function(seccion) {
    var inicio = seccion.offsetTop;
    var fin    = inicio + seccion.offsetHeight;

    if (scrollActual >= inicio && scrollActual < fin) {
      enlacesNav.forEach(function(enlace) {
        enlace.classList.remove('active');
        if (enlace.getAttribute('href') === '#' + seccion.id) {
          enlace.classList.add('active');
        }
      });
    }
  });
});


/* ──────────────────────────────────────────
   4. ESPACIO PARA TUS ANIMACIONES
   ──────────────────────────────────────────
   Aquí puedes añadir nuevas animaciones en
   el futuro. Algunos ejemplos comentados:
   ────────────────────────────────────────── */

/*
  EJEMPLO A — Parallax suave en el hero:
  ----------------------------------------
  window.addEventListener('scroll', function() {
    var heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
      heroVisual.style.transform = 'translateY(' + (window.scrollY * 0.2) + 'px)';
    }
  });
*/

/*
  EJEMPLO B — Cursor personalizado:
  ----------------------------------------
  var cursor = document.createElement('div');
  cursor.style.cssText = 'position:fixed;width:8px;height:8px;background:#9c8060;border-radius:50%;pointer-events:none;z-index:9999;transition:transform 0.15s ease;';
  document.body.appendChild(cursor);
  document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX - 4 + 'px';
    cursor.style.top  = e.clientY - 4 + 'px';
  });
*/

/*
  EJEMPLO C — Animación de contador en estadísticas:
  ----------------------------------------
  function animarNumero(elemento, hasta, duracion) {
    var inicio = 0;
    var paso = duracion / hasta;
    var timer = setInterval(function() {
      inicio++;
      elemento.textContent = inicio;
      if (inicio >= hasta) clearInterval(timer);
    }, paso);
  }
*/

/* ──────────────────────────────────────────
   5. INTRO CON FLASH AL CLIC
   ──────────────────────────────────────────
   Al cargar, bloquea scroll. Al clic en hero,
   hace flash y luego permite scroll y va a categorías.
   ────────────────────────────────────────── */

var hero = document.getElementById('hero-immersive');
var flash = document.getElementById('flash-overlay');
var introDone = false;

if (hero) {
  hero.addEventListener('click', function() {
    if (introDone) return; // Evitar múltiples clics
    introDone = true;

    // Buscar el audio en el momento del clic, después del DOM completo
    var flashSound = document.getElementById('flash-sound');
    if (flashSound) {
      flashSound.currentTime = 0;
      flashSound.volume = 0.6;
      flashSound.play().catch(function(error) {
        console.log('Audio no pudo reproducirse:', error);
      });
    }

    // Activar flash
    flash.classList.add('active');

    // Cambiar hero a relative para permitir scroll
    hero.style.position = 'relative';

    // Después de flash, remover overflow hidden y scroll a portfolio
    setTimeout(function() {
      document.body.style.overflow = 'auto'; // Permitir scroll
      flash.classList.remove('active');

      // Scroll suave a la sección de portfolio
      var portfolio = document.getElementById('portfolio');
      if (portfolio) {
        portfolio.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200); // Tiempo del flash
  });
}

/* ──────────────────────────────────────────
   6. MENÚ HAMBURGUESA EN MÓVIL
   ────────────────────────────────────────── */
var navToggle = document.getElementById('nav-toggle');
var navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', function(event) {
    event.stopPropagation();
    navLinks.classList.toggle('open');
  });

  document.addEventListener('click', function(event) {
    if (!navLinks.contains(event.target) && event.target !== navToggle) {
      navLinks.classList.remove('open');
    }
  });

  navLinks.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      navLinks.classList.remove('open');
    });
  });
}
