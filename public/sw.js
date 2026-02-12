// AMOREA Brain Care Service Worker
const CACHE_NAME = "amorea-brain-v1";
const urlsToCache = [
  "/brain",
  "/brain/games",
  "/brain/habits",
];

// 설치 시 캐시
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 활성화 시 이전 캐시 정리
self.addEventListener("activate", (event) => {
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
  self.clients.claim();
});

// 푸시 알림 수신
self.addEventListener("push", (event) => {
  const options = {
    body: "오늘의 뇌 운동을 시작해보세요! 🧠",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      url: "/brain",
    },
    actions: [
      { action: "open", title: "시작하기" },
      { action: "close", title: "나중에" },
    ],
  };

  if (event.data) {
    try {
      const data = event.data.json();
      options.body = data.body || options.body;
      options.data.url = data.url || options.data.url;
    } catch (e) {
      options.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification("AMOREA Brain Care", options)
  );
});

// 알림 클릭 처리
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  const url = event.notification.data?.url || "/brain";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // 이미 열린 창이 있으면 포커스
      for (const client of clientList) {
        if (client.url.includes("/brain") && "focus" in client) {
          return client.focus();
        }
      }
      // 없으면 새 창 열기
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// 네트워크 요청 처리 (오프라인 지원)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 캐시에 있으면 캐시에서 반환
      if (response) {
        return response;
      }
      // 없으면 네트워크 요청
      return fetch(event.request).catch(() => {
        // 오프라인이고 HTML 요청이면 오프라인 페이지 반환
        if (event.request.mode === "navigate") {
          return caches.match("/brain");
        }
      });
    })
  );
});
