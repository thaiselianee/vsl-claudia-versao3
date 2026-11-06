
document.addEventListener('DOMContentLoaded', () => {

  // =====================================
  // ELEMENTOS
  // =====================================

  const introScreen = document.querySelector('.intro-screen');
  const laptopEntry = document.getElementById('laptopEntry');
  const entryHint = document.getElementById('entryHint');

  const videoHint = document.getElementById('videoHint');
  const vslVideo = document.getElementById('vslVideo');
  const videoPlaceholder = document.getElementById('videoPlaceholder');

  const soundButton = document.getElementById('soundButton');
  const soundLabel = document.getElementById('soundLabel');
  const soundIcon = document.getElementById('soundIcon');

  const fullscreenButton = document.getElementById('fullscreenButton');

  // =====================================
  // PRIMEIRA TELA: FECHAR AVISO
  // =====================================

  const closeEntryHint = document.getElementById('closeEntryHint');

  if (closeEntryHint) {
    closeEntryHint.addEventListener('click', (event) => {
      event.stopPropagation();

      entryHint.hidden = true;
    });
  }

  // =====================================
  // PRIMEIRA TELA: ABRIR NOTEBOOK
  // =====================================

  let opening = false;

  function openVideoScreen() {

    if (!introScreen || !laptopEntry || opening) return;

    opening = true;

    laptopEntry.classList.add('opening');
    introScreen.classList.add('is-transitioning');

    // Pequeno tempo para a animação do notebook
    // antes de abrir a segunda página.

    setTimeout(() => {
      window.location.href = 'segundatela.html';
    }, 850);

  }

  if (laptopEntry) {

    laptopEntry.addEventListener('click', openVideoScreen);

    laptopEntry.addEventListener('keydown', (event) => {

      if (event.key === 'Enter' || event.key === ' ') {

        event.preventDefault();
        openVideoScreen();

      }

    });

  }

  // =====================================
  // SEGUNDA TELA: FECHAR AVISO
  // =====================================


const closeVideoHint = document.getElementById('closeVideoHint');

if (closeVideoHint) {

  closeVideoHint.addEventListener('click', () => {

    if (videoHint) {
      videoHint.hidden = true;
    }

    if (vslVideo) {
      vslVideo.play().catch(() => {
        console.log('Clique no vídeo para iniciar a reprodução.');
      });
    }

  });

}


  // =====================================
  // SEGUNDA TELA: VÍDEO
  // =====================================

  if (vslVideo) {

    vslVideo.addEventListener('error', () => {

      if (videoPlaceholder) {
        videoPlaceholder.classList.add('visible');
      }

    });

    vslVideo.addEventListener('loadeddata', () => {

      if (videoPlaceholder) {
        videoPlaceholder.classList.remove('visible');
      }

    });

    // Tenta iniciar o vídeo.
    // Se o navegador bloquear o autoplay,
    // a pessoa poderá iniciar pelo próprio vídeo.

    vslVideo.play().catch(() => {
      console.log('O navegador aguardará uma interação para iniciar o vídeo.');
    });

    vslVideo.addEventListener('click', () => {

      if (vslVideo.paused) {
        vslVideo.play().catch(() => {});
      } else {
        vslVideo.pause();
      }

    });

  }

  // =====================================
  // CONTROLE DE SOM
  // =====================================

  if (soundButton && vslVideo) {

    soundButton.addEventListener('click', () => {

      vslVideo.muted = !vslVideo.muted;

      const muted = vslVideo.muted;

      soundLabel.textContent = muted ? 'Som desligado' : 'Som ligado';

      soundButton.setAttribute(
        'aria-label',
        muted ? 'Ativar som' : 'Silenciar som'
      );

      soundIcon.innerHTML = muted

        ? `
          <path d="M11 5 6 9H3v6h3l5 4V5Z"></path>
          <path d="m16 9 5 6m0-6-5 6"></path>
        `

        : `
          <path d="M11 5 6 9H3v6h3l5 4V5Z"></path>
          <path d="M15 9a5 5 0 0 1 0 6"></path>
          <path d="M18 6a9 9 0 0 1 0 12"></path>
        `;

      if (!muted && vslVideo.paused) {
        vslVideo.play().catch(() => {});
      }

    });

  }

  // =====================================
  // TELA CHEIA
  // =====================================

  if (fullscreenButton && vslVideo) {

    fullscreenButton.addEventListener('click', async () => {

      try {

        if (document.fullscreenElement) {

          await document.exitFullscreen();

        } else if (vslVideo.requestFullscreen) {

          await vslVideo.requestFullscreen();

        } else if (vslVideo.webkitEnterFullscreen) {

          vslVideo.webkitEnterFullscreen();

        }

      } catch (error) {

        console.warn('Erro ao abrir tela cheia:', error);

      }

    });

  }

});
