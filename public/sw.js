// Service Worker para LED Escala
// Habilita caching e suporte offline

const CACHE_NAME = 'led-escala-v1';
const URLS_TO_CACHE = [
  '/',
  '/calendario',
  '/voluntarios',
  '/dashboard',
  '/notificacoes',
  '/configuracoes',
  '/restricoes',
  '/auditoria',
  '/tema'
];

// Instalar o Service Worker e cachear recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE).catch((err) => {
        console.log('Erro ao cachear URLs:', err);
      });
    })
  );
});

// Ativar e limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estratégia: Cache First, Fall back to Network
self.addEventListener('fetch', (event) => {
  // Ignorar requisições que não são GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retornar do cache se encontrado
      if (response) {
        return response;
      }

      // Caso contrário, tentar fazer requisição de rede
      return fetch(event.request)
        .then((response) => {
          // Não cachear respostas inválidas
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clonar a resposta
          const responseToCache = response.clone();

          // Cachear para próximas vezes
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Retornar página offline se tudo falhar
          return caches.match('/') || new Response('Offline');
        });
    })
  );
});

// Listener para mensagens
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
