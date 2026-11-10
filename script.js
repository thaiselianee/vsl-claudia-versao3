/* ==========================================
   ELEMENTOS DA PRIMEIRA PÁGINA
========================================== */

const introScreen = document.getElementById("introScreen");
const laptopScreen = document.getElementById("laptopScreen");
const closeNotice = document.getElementById("closeNotice");
const soundNotice = document.getElementById("soundNotice");
const videoPreview = document.getElementById("videoPreview");


/* ==========================================
   REPRODUÇÃO DA PRÉVIA
========================================== */

if (videoPreview) {

    videoPreview.muted = true;

    const playPreview = videoPreview.play();

    if (playPreview !== undefined) {

        playPreview.catch(function(error) {
            console.log("A prévia não iniciou automaticamente:", error);
        });

    }

}


/* ==========================================
   FECHAR O AVISO DE SOM
========================================== */

if (closeNotice && soundNotice) {

    closeNotice.addEventListener("click", function(event) {

        event.stopPropagation();

        soundNotice.classList.add("hidden");

    });

}


/* ==========================================
   ENTRAR NA SEGUNDA PÁGINA
========================================== */

let enteringPage = false;

if (laptopScreen && introScreen) {

    laptopScreen.addEventListener("click", function() {

        if (enteringPage) {
            return;
        }

        enteringPage = true;

        introScreen.classList.add("leaving");

        setTimeout(function() {

            window.location.href = "segundatela.html";

        }, 500);

    });

}


/* ==========================================
   ELEMENTOS DA SEGUNDA PÁGINA
========================================== */

(function() {

    const video = document.getElementById("mainVideo");
    const videoContainer = document.getElementById("videoContainer");

    const soundButton = document.getElementById("soundButton");
    const soundIcon = document.getElementById("soundIcon");

    const fullscreenButton = document.getElementById("fullscreenButton");

    const menuButton = document.getElementById("menuButton");
    const menuOptions = document.getElementById("menuOptions");


    // Se não estiver na segunda página, encerra esta parte.
    if (!video) {
        return;
    }

    /* ==========================================
      BARRA DE PROGRESSO
    ========================================== */

    const progressFill = document.getElementById("videoProgressFill");

    function updateVideoProgress() {

        if (!progressFill || !video.duration) {
            return;
        }

        const progress = (video.currentTime / video.duration) * 100;

        progressFill.style.width = progress + "%";

    }

    video.addEventListener("timeupdate", updateVideoProgress);

    video.addEventListener("loadedmetadata", updateVideoProgress);

    video.addEventListener("durationchange", updateVideoProgress);

    video.addEventListener("ended", function() {

        progressFill.style.width = "100%";

    });

    /* ==========================================
       REPRODUÇÃO DO VÍDEO
    ========================================== */

    video.muted = true;
    video.volume = 1;

    video.play().catch(function(error) {

        console.log("Autoplay não permitido pelo navegador:", error);

    });


    /* ==========================================
       CONTROLE DE ÁUDIO
    ========================================== */

    function updateSoundIcon() {

        if (video.muted) {

            soundIcon.innerHTML = `
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
            `;

            soundButton.setAttribute("aria-label", "Ativar som");
            soundButton.title = "Ativar som";

        } else {

            soundIcon.innerHTML = `
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.5 8.5a5 5 0 0 1 0 7"></path>
                <path d="M19 5a10 10 0 0 1 0 14"></path>
            `;

            soundButton.setAttribute("aria-label", "Silenciar som");
            soundButton.title = "Silenciar som";

        }

    }


    if (soundButton && soundIcon) {

        soundButton.addEventListener("click", function() {

            video.muted = !video.muted;

            updateSoundIcon();

        });

        updateSoundIcon();

    }


    /* ==========================================
       TELA CHEIA
    ========================================== */

    if (fullscreenButton && videoContainer) {

        fullscreenButton.addEventListener("click", async function() {

            try {

                if (!document.fullscreenElement) {

                    if (videoContainer.requestFullscreen) {
                        await videoContainer.requestFullscreen();
                    }

                    else if (videoContainer.webkitRequestFullscreen) {
                        videoContainer.webkitRequestFullscreen();
                    }

                } else {

                    if (document.exitFullscreen) {
                        await document.exitFullscreen();
                    }

                    else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }

                }

            } catch (error) {

                console.log("Não foi possível abrir a tela cheia:", error);

            }

        });

    }


    /* ==========================================
       MENU HAMBÚRGUER
    ========================================== */

    if (menuButton && menuOptions) {

        menuButton.addEventListener("click", function(event) {

            event.stopPropagation();

            const menuAberto = menuOptions.classList.toggle("active");

            menuButton.setAttribute("aria-expanded", menuAberto);

        });


        document.addEventListener("click", function(event) {

            if (
                !menuOptions.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {

                menuOptions.classList.remove("active");

                menuButton.setAttribute("aria-expanded", "false");

            }

        });


        menuOptions.querySelectorAll("a").forEach(function(link) {

            link.addEventListener("click", function() {

                menuOptions.classList.remove("active");

                menuButton.setAttribute("aria-expanded", "false");

            });

        });

    }

})();


/* NAVEGAÇÃO HORIZONTAL DAS SEÇÕES */
(function () {

    const video = document.getElementById("mainVideo");
    const videoContainer = document.getElementById("videoContainer");
    const salesHorizontal = document.getElementById("salesHorizontal");
    const header = document.querySelector(".video-header");

    if (!video || !videoContainer || !salesHorizontal) return;

    const panels = Array.from(
        salesHorizontal.querySelectorAll(":scope > .sales-panel")
    );

    if (!panels.length) return;

    const methodPanel = document.querySelector(".method-section");
    const methodViewport = document.querySelector(".method-viewport");
    const methodTrack = document.getElementById("methodTrack");

    const methodItems = methodTrack
        ? Array.from(methodTrack.querySelectorAll(".method-item"))
        : [];

    let currentPanel = 0;
    let currentMethodStep = 0;
    let isAnimating = false;
    let wheelLocked = false;
    let wheelTimer;
    let animationTimer;
    let touchStartX = 0;
    let touchStartY = 0;

    salesHorizontal.hidden = true;
    salesHorizontal.style.display = "none";

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    function isMethodPanel() {
        return panels[currentPanel] === methodPanel;
    }

    /* POSICIONAMENTO DAS ETAPAS DO MÉTODO */
function updateMethodPosition() {
    if (!methodTrack || !methodViewport || !methodItems.length) return;

    const item = methodItems[currentMethodStep];

    const trackStyle = window.getComputedStyle(methodTrack);
    const paddingLeft = parseFloat(trackStyle.paddingLeft) || 0;

    const maxOffset = Math.max(
        0,
        methodTrack.scrollWidth - methodViewport.clientWidth
    );

    const desiredOffset = Math.min(
        Math.max(0, item.offsetLeft - paddingLeft),
        maxOffset
    );

    methodTrack.style.transform =
        `translate3d(-${desiredOffset}px, 0, 0)`;
}


    /* POSICIONAMENTO DAS SEÇÕES */

 function updatePanelPosition() {

    const screenWidth =
        document.documentElement.clientWidth || window.innerWidth;

    const position = currentPanel * screenWidth;

    salesHorizontal.style.transform =
        `translate3d(-${position}px, 0, 0)`;

}
    /* CONFIGURAÇÃO DO TAMANHO DAS SEÇÕES */

    function prepareSections() {

    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const screenWidth = document.documentElement.clientWidth || window.innerWidth;
    const screenHeight = document.documentElement.clientHeight - headerHeight;
        salesHorizontal.hidden = false;
        salesHorizontal.style.display = "flex";

        salesHorizontal.style.position = "fixed";
        salesHorizontal.style.top = `${headerHeight}px`;
        salesHorizontal.style.left = "0";
        salesHorizontal.style.right = "auto";
        salesHorizontal.style.bottom = "auto";

        salesHorizontal.style.flexDirection = "row";
        salesHorizontal.style.flexWrap = "nowrap";

        salesHorizontal.style.width =
            `${panels.length * screenWidth}px`;

        salesHorizontal.style.height = `${screenHeight}px`;
        salesHorizontal.style.minHeight = "0";
        salesHorizontal.style.maxWidth = "none";

        salesHorizontal.style.margin = "0";
        salesHorizontal.style.padding = "0";

        salesHorizontal.style.overflow = "visible";

        salesHorizontal.style.transition =
            "transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)";

        salesHorizontal.style.willChange = "transform";

        panels.forEach(function (panel) {

            panel.style.flex = `0 0 ${screenWidth}px`;

            panel.style.width = `${screenWidth}px`;
            panel.style.minWidth = `${screenWidth}px`;
            panel.style.maxWidth = `${screenWidth}px`;

            panel.style.height = `${screenHeight}px`;
            panel.style.minHeight = "0";
            panel.style.maxHeight = `${screenHeight}px`;

            panel.style.boxSizing = "border-box";
            panel.style.overflow = "hidden";

        });

        /* AJUSTE DO MÉTODO */

        if (methodViewport) {

            methodViewport.style.width = "100%";
            methodViewport.style.maxWidth = "100%";
            methodViewport.style.overflow = "hidden";

        }

        if (methodTrack) {

            methodTrack.style.display = "flex";
            methodTrack.style.flexDirection = "row";
            methodTrack.style.flexWrap = "nowrap";
            methodTrack.style.width = "max-content";
            methodTrack.style.maxWidth = "none";

            methodTrack.style.transition =
                "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)";

            methodTrack.style.willChange = "transform";

        }

        methodItems.forEach(function (item) {

            item.style.flexShrink = "0";

        });

        updateMethodPosition();
        updatePanelPosition();

    }

    /* TEMPO DE ANIMAÇÃO */

    function animateLock() {

        isAnimating = true;

        clearTimeout(animationTimer);

        animationTimer = setTimeout(function () {

            isAnimating = false;

        }, 750);

    }

    /* MUDAR DE SEÇÃO */

    function changePanel(direction) {

        if (salesHorizontal.hidden || isAnimating) return;

        const nextPanel = currentPanel + direction;

        if (nextPanel < 0 || nextPanel >= panels.length) return;

        currentPanel = nextPanel;

        if (isMethodPanel()) {

            currentMethodStep = direction > 0
                ? 0
                : methodItems.length - 1;

            updateMethodPosition();

        }

        updatePanelPosition();
        animateLock();

    }

    /* MUDAR ETAPA DO MÉTODO */

    function changeMethodStep(direction) {

        if (isAnimating || !methodItems.length) return false;

        const nextStep = currentMethodStep + direction;

        if (nextStep < 0 || nextStep >= methodItems.length) {
            return false;
        }

        currentMethodStep = nextStep;

        updateMethodPosition();
        animateLock();

        return true;

    }

    /* QUANDO O VÍDEO TERMINAR */

    video.addEventListener("ended", function () {

        videoContainer.style.display = "none";

        currentPanel = 0;
        currentMethodStep = 0;

        prepareSections();

    }, { once: true });

    /* ROLAGEM DO MOUSE */

    window.addEventListener("wheel", function (event) {

        if (salesHorizontal.hidden) return;

        event.preventDefault();

        if (
            Math.abs(event.deltaY) < 15 ||
            wheelLocked ||
            isAnimating
        ) {
            return;
        }

        const direction = event.deltaY > 0 ? 1 : -1;

        wheelLocked = true;

        clearTimeout(wheelTimer);

        wheelTimer = setTimeout(function () {

            wheelLocked = false;

        }, 420);

        /* No método, percorre as cinco etapas primeiro */

        if (isMethodPanel()) {

            const changedStep = changeMethodStep(direction);

            if (changedStep) return;

        }

        /* Nas demais situações, muda de seção horizontalmente */

        changePanel(direction);

    }, { passive: false });

    /* MOVIMENTO NO CELULAR E TABLET */

    salesHorizontal.addEventListener("touchstart", function (event) {

        const touch = event.touches[0];

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

    }, { passive: true });

    salesHorizontal.addEventListener("touchend", function (event) {

        if (salesHorizontal.hidden || isAnimating) return;

        const touch = event.changedTouches[0];

        const differenceX = touch.clientX - touchStartX;
        const differenceY = touch.clientY - touchStartY;

        if (Math.abs(differenceX) < 50) return;

        if (Math.abs(differenceX) < Math.abs(differenceY)) return;

        const direction = differenceX < 0 ? 1 : -1;

        if (isMethodPanel()) {

            const changedStep = changeMethodStep(direction);

            if (changedStep) return;

        }

        changePanel(direction);

    }, { passive: true });

    /* REDIMENSIONAMENTO DA TELA */

    window.addEventListener("resize", function () {

        if (!salesHorizontal.hidden) {

            prepareSections();

        }

    });

})();