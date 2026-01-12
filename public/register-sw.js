// Script para registrar o Service Worker
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado:', registration.scope);

        // Verificar atualizações a cada hora
        setInterval(() => {
          registration.update();
        }, 3600000);
      })
      .catch((error) => {
        console.log('❌ Erro ao registrar Service Worker:', error);
      });

    // Listener para atualizações disponíveis
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}
