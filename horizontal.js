document.addEventListener("DOMContentLoaded", () => {

  const video = document.getElementById("vslVideo");
  const experience = document.getElementById("horizontalExperience");
  const track = document.getElementById("horizontalTrack");

  let unlocked = false;

  // =====================================
  // LIBERAR TODAS AS SESSÕES AO TERMINAR O VÍDEO
  // =====================================

  function unlockExperience() {

    if (unlocked || !experience || !track) return;

    unlocked = true;

    // Libera a experiência
    experience.classList.add("is-unlocked");

    // Ativa o modo de navegação horizontal
    document.documentElement.classList.add("hx-active");
    document.body.classList.add("hx-active");

    // Começa na primeira sessão
    track.scrollLeft = 0;

    // Permite navegação pelo teclado
    track.setAttribute("tabindex", "0");

    // Aguarda a exibição do conteúdo para colocar o foco
    requestAnimationFrame(() => {
      track.focus({ preventScroll: true });
    });

    console.log("Vídeo finalizado. Todas as sessões foram liberadas!");

  }

  if (video) {
    video.addEventListener("ended", unlockExperience);
  }

  // =====================================
  // NAVEGAÇÃO HORIZONTAL COM A RODINHA
  // =====================================

  if (track) {

    track.addEventListener("wheel", (event) => {

      if (!unlocked) return;

      // No celular, mantém o movimento natural pelo toque
      if (window.innerWidth <= 760) return;

      event.preventDefault();

      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

      track.scrollLeft += delta;

    }, { passive: false });

  }

  // =====================================
  // NAVEGAÇÃO PELO TECLADO
  // =====================================

  if (track) {

    track.addEventListener("keydown", (event) => {

      if (!unlocked) return;

      const amount = window.innerWidth * 0.85;

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        track.scrollBy({
          left: amount,
          behavior: "smooth"
        });
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        track.scrollBy({
          left: -amount,
          behavior: "smooth"
        });
      }

      if (event.key === "Home") {
        event.preventDefault();
        track.scrollTo({
          left: 0,
          behavior: "smooth"
        });
      }

      if (event.key === "End") {
        event.preventDefault();
        track.scrollTo({
          left: track.scrollWidth,
          behavior: "smooth"
        });
      }

    });

  }

  // =====================================
  // FAQ: UMA PERGUNTA ABERTA POR VEZ
  // =====================================

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {

    item.addEventListener("toggle", () => {

      if (!item.open) return;

      faqItems.forEach((otherItem) => {

        if (otherItem !== item) {
          otherItem.open = false;
        }

      });

    });

  });

});
