"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  registerServiceWorker,
  requestNotificationPermission,
  getNotificationPermissionStatus,
  showLocalNotification,
} from "@/lib/notifications";

interface NotificationTime {
  hour: number;
  minute: number;
  enabled: boolean;
}

const DEFAULT_TIMES: NotificationTime[] = [
  { hour: 8, minute: 0, enabled: true }, // 아침
  { hour: 14, minute: 0, enabled: false }, // 오후
  { hour: 20, minute: 0, enabled: true }, // 저녁
];

export function NotificationSettings() {
  const [permission, setPermission] = useState<string>("default");
  const [isSupported, setIsSupported] = useState(true);
  const [times, setTimes] = useState<NotificationTime[]>(DEFAULT_TIMES);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkPermission();
    loadSavedTimes();
  }, []);

  const checkPermission = async () => {
    const status = await getNotificationPermissionStatus();
    setIsSupported(status.supported);
    setPermission(status.permission);
  };

  const loadSavedTimes = () => {
    const saved = localStorage.getItem("notificationTimes");
    if (saved) {
      setTimes(JSON.parse(saved));
    }
  };

  const saveTimes = (newTimes: NotificationTime[]) => {
    localStorage.setItem("notificationTimes", JSON.stringify(newTimes));
    setTimes(newTimes);
  };

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      // Service Worker 등록
      await registerServiceWorker();

      // 알림 권한 요청
      const perm = await requestNotificationPermission();
      setPermission(perm);

      if (perm === "granted") {
        // 테스트 알림 표시
        showLocalNotification("알림이 활성화되었습니다! 🎉", {
          body: "이제 뇌 운동 알림을 받을 수 있어요.",
        });
      }
    } catch (error) {
      console.error("Failed to enable notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTime = (index: number) => {
    const newTimes = [...times];
    newTimes[index].enabled = !newTimes[index].enabled;
    saveTimes(newTimes);
  };

  const formatTime = (hour: number, minute: number): string => {
    const period = hour < 12 ? "오전" : "오후";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${period} ${displayHour}:${minute.toString().padStart(2, "0")}`;
  };

  const getTimeLabel = (index: number): string => {
    const labels = ["아침 알림", "오후 알림", "저녁 알림"];
    return labels[index] || "알림";
  };

  if (!isSupported) {
    return (
      <Card className="bg-vb-subtle">
        <div className="text-center py-4">
          <span className="text-3xl block mb-2">🔕</span>
          <p className="text-vb-muted text-sm">
            이 브라우저는 알림을 지원하지 않습니다
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔔</span>
          <h3 className="font-bold text-vb-black">알림 설정</h3>
        </div>
        {permission === "granted" && (
          <span className="text-xs px-2 py-0.5 bg-vb-teal/10 text-vb-teal rounded-full">
            활성화됨
          </span>
        )}
      </div>

      {permission !== "granted" ? (
        <div className="text-center py-4">
          <p className="text-sm text-vb-charcoal mb-4">
            뇌 운동 시간에 알림을 받아보세요!
            <br />
            꾸준한 습관 형성에 도움이 됩니다.
          </p>
          <Button
            onClick={handleEnableNotifications}
            isLoading={isLoading}
            disabled={permission === "denied"}
          >
            {permission === "denied" ? "브라우저 설정에서 허용 필요" : "알림 허용하기"}
          </Button>
          {permission === "denied" && (
            <p className="text-xs text-vb-muted mt-2">
              브라우저 설정에서 알림을 허용해주세요
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {times.map((time, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-vb-lightsilver last:border-0"
            >
              <div>
                <p className="font-medium text-vb-black">
                  {getTimeLabel(index)}
                </p>
                <p className="text-sm text-vb-muted">
                  {formatTime(time.hour, time.minute)}
                </p>
              </div>
              <button
                onClick={() => toggleTime(index)}
                className={`
                  w-12 h-6 rounded-full transition-colors relative
                  ${time.enabled ? "bg-vb-teal" : "bg-vb-lightsilver"}
                `}
              >
                <div
                  className={`
                    absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform
                    ${time.enabled ? "translate-x-7" : "translate-x-1"}
                  `}
                />
              </button>
            </div>
          ))}

          <p className="text-xs text-vb-muted text-center pt-2">
            설정한 시간에 뇌 운동 알림을 보내드려요
          </p>
        </div>
      )}
    </Card>
  );
}
