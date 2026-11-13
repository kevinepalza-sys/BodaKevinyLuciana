// --- 1. EFECTO 3D INTERACTIVO EN EL SOBRE ---
const cartaSobre = document.getElementById("invitationLetter");
if (cartaSobre) {
    cartaSobre.addEventListener("mousemove", (e) => {
        const rect = cartaSobre.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        cartaSobre.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
    });
    cartaSobre.addEventListener("mouseleave", () => {
        cartaSobre.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
}

// --- 2. APERTURA DEL SOBRE CON EXPLOSIÓN FLORAL MASIVA Y TRANSICIÓN FLUIDA ---
function abrirInvitacion() {
    const overlay = document.getElementById("overlay");
    const seal = document.getElementById("openInvitation");
    const contenido = document.getElementById("contenido");
    const hero = document.querySelector(".hero");
    const musica = document.getElementById("musica");

    seal.classList.add("broken");
    lanzarExplosionFloralMasiva();

    setTimeout(() => {
        overlay.style.background = "radial-gradient(circle at center, #24050a 0%, #080102 100%)";
        overlay.classList.add("opening");
    }, 280);

    setTimeout(() => {
        overlay.style.display = "none";
        contenido.style.display = "block";
        hero.classList.add("hero-visible");

        musica.play()
            .then(() => actualizarEstadoVisualMusica(true))
            .catch(() => actualizarEstadoVisualMusica(false));

        iniciarPetalosConstantes();
        actualizarAlHacerScroll();
    }, 1450);
}

// --- 3. REPRODUCTORES SINCRONIZADOS CON ECUALIZADOR Y ANIMACIÓN ---
const audio = document.getElementById("musica");
const discoPrincipal = document.getElementById("vinyl");
const reproductorPrincipal = document.getElementById("musicPlayer");
const floatingPlayer = document.getElementById("floatingPlayer");
const floatingVinyl = document.getElementById("floatingVinyl");
const heroEq = document.getElementById("heroEq");
const floatingEq = document.getElementById("floatingEq");
const floatingStatus = document.getElementById("floatingStatus");

function actualizarEstadoVisualMusica(reproduciendo) {
    if (reproduciendo) {
        discoPrincipal.classList.add("spinning");
        floatingVinyl.classList.add("spinning");
        reproductorPrincipal.classList.add("playing");
        floatingPlayer.classList.add("is-playing");
        if (heroEq) heroEq.classList.add("active");
        if (floatingEq) floatingEq.classList.add("active");
        if (floatingStatus) floatingStatus.innerText = "Sonando ahora";
    } else {
        discoPrincipal.classList.remove("spinning");
        floatingVinyl.classList.remove("spinning");
        reproductorPrincipal.classList.remove("playing");
        floatingPlayer.classList.remove("is-playing");
        if (heroEq) heroEq.classList.remove("active");
        if (floatingEq) floatingEq.classList.remove("active");
        if (floatingStatus) floatingStatus.innerText = "En pausa · Tocar";
    }
}

function alternarMusica() {
    if (audio.paused) {
        audio.play().then(() => actualizarEstadoVisualMusica(true));
    } else {
        audio.pause();
        actualizarEstadoVisualMusica(false);
    }
}

reproductorPrincipal.onclick = alternarMusica;
floatingPlayer.onclick = alternarMusica;

// --- 4. SCROLL: BARRA SUPERIOR, REPRODUCTOR FLOTANTE Y CRONOGRAMA ---
function actualizarAlHacerScroll() {
    const scrollY = window.scrollY;
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const progreso = scrollTotal > 0 ? (scrollY / scrollTotal) * 100 : 0;

    const barra = document.getElementById("scrollProgress");
    if (barra) barra.style.width = `${progreso}%`;

    const topbar = document.getElementById("topbar");
    if (topbar) {
        topbar.classList.toggle("scrolled", scrollY > 60);
    }

    const overlay = document.getElementById("overlay");
    if (overlay.style.display === "none" && scrollY > 250) {
        floatingPlayer.classList.add("show");
    } else {
        floatingPlayer.classList.remove("show");
    }

    const timelineWrapper = document.getElementById("timelineWrapper");
    const timelineLine = document.getElementById("timelineLine");
    if (timelineWrapper && timelineLine) {
        const rect = timelineWrapper.getBoundingClientRect();
        const centroPantalla = window.innerHeight * 0.65;
        const avance = Math.min(Math.max((centroPantalla - rect.top) / rect.height, 0), 1);
        timelineLine.style.height = `${avance * 100}%`;

        const entradas = timelineWrapper.querySelectorAll(".timeline-entry");
        entradas.forEach((entrada) => {
            const entradaRect = entrada.getBoundingClientRect();
            if (entradaRect.top < centroPantalla) {
                entrada.classList.add("lit");
            } else {
                entrada.classList.remove("lit");
            }
        });
    }

    revelarAlHacerScroll();
}

window.addEventListener("scroll", actualizarAlHacerScroll, { passive: true });

// --- 5. GALERÍA Y VISOR DE FOTOS PROFESIONAL (LIGHTBOX) ---
let fotosGaleria = [];
let indiceFotoActual = 0;

function inicializarGaleria() {
    const items = document.querySelectorAll("#photoGallery .gallery-item");
    const dotsContainer = document.getElementById("lightboxDots");
    if (!items.length || !dotsContainer) return;

    fotosGaleria = Array.from(items).map((item) => ({
        src: item.querySelector("img").src,
        caption: item.querySelector(".gallery-caption span")?.innerText || ""
    }));

    dotsContainer.innerHTML = "";
    fotosGaleria.forEach((_, idx) => {
        const dot = document.createElement("span");
        dot.className = "lightbox-dot";
        dot.onclick = (e) => {
            e.stopPropagation();
            mostrarFotoEnIndice(idx);
        };
        dotsContainer.appendChild(dot);
    });
}

function mostrarFotoEnIndice(indice) {
    if (!fotosGaleria.length) inicializarGaleria();

    indiceFotoActual = (indice + fotosGaleria.length) % fotosGaleria.length;
    const foto = fotosGaleria[indiceFotoActual];

    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxCounter = document.getElementById("lightboxCounter");
    const dots = document.querySelectorAll(".lightbox-dot");

    lightboxImg.classList.add("switching");

    setTimeout(() => {
        lightboxImg.src = foto.src;
        lightboxCaption.innerText = foto.caption;
        lightboxCounter.innerText = `${indiceFotoActual + 1} / ${fotosGaleria.length}`;

        dots.forEach((d, i) => d.classList.toggle("active", i === indiceFotoActual));
        lightboxImg.classList.remove("switching");
    }, 150);
}

function abrirFoto(indice) {
    if (!fotosGaleria.length) inicializarGaleria();
    const lightbox = document.getElementById("lightbox");
    mostrarFotoEnIndice(indice);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
}

function cambiarFoto(direccion) {
    mostrarFotoEnIndice(indiceFotoActual + direccion);
}

function cerrarFoto() {
    document.getElementById("lightbox").classList.remove("open");
    document.body.style.overflow = "";
}

function cerrarFotoDesdeFondo(event) {
    if (event.target.id === "lightbox" || event.target.id === "lightboxStage") {
        cerrarFoto();
    }
}

document.addEventListener("keydown", (e) => {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox || !lightbox.classList.contains("open")) return;

    if (e.key === "Escape") cerrarFoto();
    if (e.key === "ArrowRight") cambiarFoto(1);
    if (e.key === "ArrowLeft") cambiarFoto(-1);
});

const lightboxStage = document.getElementById("lightboxStage");
let touchStartX = 0;
if (lightboxStage) {
    lightboxStage.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxStage.addEventListener("touchend", (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 45) {
            cambiarFoto(diff > 0 ? 1 : -1);
        }
    }, { passive: true });
}

inicializarGaleria();

// --- 6. ANIMACIÓN SUAVE EN CASCADA AL HACER SCROLL ---
function revelarAlHacerScroll() {
    const elementos = document.querySelectorAll(".reveal");
    const alturaVentana = window.innerHeight;

    elementos.forEach((el) => {
        const distanciaTop = el.getBoundingClientRect().top;
        if (distanciaTop < alturaVentana - 65) {
            el.classList.add("active");
        }
    });
}

// --- 7. CUENTA REGRESIVA CON LATIDO EN SEGUNDOS ---
const fechaEvento = new Date("November 28, 2026 18:00:00").getTime();

function actualizarCuentaRegresiva() {
    const ahora = new Date().getTime();
    const diferencia = fechaEvento - ahora;

    if (diferencia < 0) return;

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(dias).padStart(2, '0');
    document.getElementById("hours").innerText = String(horas).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutos).padStart(2, '0');

    const secEl = document.getElementById("seconds");
    secEl.innerText = String(segundos).padStart(2, '0');
    secEl.classList.add("tick-pulse");
    setTimeout(() => secEl.classList.remove("tick-pulse"), 200);
}

setInterval(actualizarCuentaRegresiva, 1000);
actualizarCuentaRegresiva();

// --- 8. CAMPOS DINÁMICOS DE INVITADOS PARA RSVP ---
function actualizarCamposInvitados() {
    const cantidadSelect = document.getElementById("cantidad");
    const container = document.getElementById("dynamicGuestsContainer");
    if (!cantidadSelect || !container) return;

    const numPersonas = parseInt(cantidadSelect.value, 10);
    container.innerHTML = "";

    for (let i = 1; i <= numPersonas; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.id = `invitado_${i}`;
        input.placeholder = i === 1 ? "Nombre y Apellido (Titular)" : `Nombre y Apellido (Invitado ${i})`;
        input.required = true;
        input.className = "guest-input-field";
        container.appendChild(input);
    }
}

// Ejecutar al cargar la página para inicializar con 1 campo
window.addEventListener("DOMContentLoaded", () => {
    actualizarCamposInvitados();
});

// --- 9. COPIAR ALIAS CON TOAST ---
function copyAlias() {
    const aliasText = document.getElementById("aliasText").innerText;
    const btn = document.getElementById("copyBtn");
    const toast = document.getElementById("luxuryToast");

    navigator.clipboard.writeText(aliasText).then(() => {
        const textoOriginal = btn.innerText;
        btn.innerText = "¡Alias Copiado! ✓";
        btn.style.background = "#6F7B4D";

        if (toast) toast.classList.add("visible");

        setTimeout(() => {
            btn.innerText = textoOriginal;
            btn.style.background = "";
            if (toast) toast.classList.remove("visible");
        }, 2500);
    });
}

// --- 10. ENVÍO DE CONFIRMACIÓN POR WHATSAPP CON TODOS LOS NOMBRES ---
function enviarWhatsApp(event) {
    event.preventDefault();

    const numPersonas = parseInt(document.getElementById("cantidad").value, 10);
    const telefono = document.getElementById("telefono").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    let nombresList = [];
    for (let i = 1; i <= numPersonas; i++) {
        const val = document.getElementById(`invitado_${i}`).value.trim();
        if (val) nombresList.push(val);
    }

    const numeroWhatsApp = "5493435097919";

    let texto = `¡Hola! Confirmo mi asistencia a la Boda Civil de Kevin y Luciana.%0A%0A`;
    texto += `*Cantidad de asistentes:* ${numPersonas}%0A`;
    texto += `*Asistentes:*%0A- ${nombresList.join('%0A- ')}%0A`;
    texto += `*Teléfono:* ${telefono}`;
    if (mensaje) {
        texto += `%0A*Mensaje:* ${mensaje}`;
    }

    window.open(`https://wa.me/${numeroWhatsApp}?text=${texto}`, '_blank');
}

// --- 11. EXPLOSIÓN FLORAL Y ESTELAR MASIVA (240 PARTÍCULAS) ---
function lanzarExplosionFloralMasiva() {
    const canvas = document.getElementById("petals");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particulas = [];
    const centroX = canvas.width / 2;
    const centroY = canvas.height / 2;

    const paletaExplosion = [
        "rgba(255, 255, 255, 1)",      // Blanco nupcial puro
        "rgba(245, 238, 226, 0.98)",   // Marfil luminoso
        "rgba(215, 180, 120, 0.96)",   // Oro puro brillante
        "rgba(255, 240, 180, 0.95)",   // Destello estelar dorado
        "rgba(107, 31, 42, 0.98)",     // Bordó profundo
        "rgba(74, 19, 28, 1)"          // Bordó oscuro de alta gama
    ];

    // Despliegue explosivo masivo y arrollador de 240 partículas
    for (let i = 0; i < 240; i++) {
        const angulo = Math.random() * Math.PI * 2;
        const velocidad = Math.random() * 22 + 4;
        particulas.push({
            x: centroX,
            y: centroY,
            vx: Math.cos(angulo) * velocidad,
            vy: Math.sin(angulo) * velocidad,
            r: Math.random() * 9 + 3,
            color: paletaExplosion[Math.floor(Math.random() * paletaExplosion.length)],
            alpha: 1,
            rotacion: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.18
        });
    }

    function animarExplosion() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let activas = false;

        particulas.forEach((p) => {
            if (p.alpha > 0) {
                activas = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotacion);
                ctx.beginPath();
                ctx.ellipse(0, 0, p.r, p.r * 0.65, 0, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 14;
                ctx.shadowColor = "rgba(197, 160, 89, 0.65)";
                ctx.fill();
                ctx.restore();

                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.13; // Gravedad suave
                p.vx *= 0.978; // Fricción elegante
                p.rotacion += p.vRot;
                p.alpha -= 0.0065; // Desvanecimiento lento para máxima duración visual
            }
        });

        if (activas) {
            requestAnimationFrame(animarExplosion);
        }
    }
    animarExplosion();
}

function iniciarPetalosConstantes() {
    const canvas = document.getElementById("petals");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const petalos = [];
    const coloresConstantes = [
        "rgba(197, 160, 89, 0.45)", 
        "rgba(255, 255, 255, 0.58)", 
        "rgba(107, 31, 42, 0.3)"
    ];

    for (let i = 0; i < 45; i++) {
        petalos.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 6 + 2.5,
            d: Math.random() * 1.4 + 0.6,
            color: coloresConstantes[Math.floor(Math.random() * coloresConstantes.length)],
            angulo: Math.random() * Math.PI * 2
        });
    }

    function dibujarLluvia() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petalos.forEach((p) => {
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.r, p.r * 0.6, p.angulo, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            p.y += p.d;
            p.x += Math.sin(p.angulo) * 0.5;
            p.angulo += 0.015;

            if (p.y > canvas.height) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(dibujarLluvia);
    }
    dibujarLluvia();
}
