import { ref } from "vue";
import { defineStore } from "pinia";

import type { Notify } from "../models/Notification.model";

export const useNotificationStore = defineStore("NotificationStore", () => {
  const notifications = ref<Notify[]>([]);

  const ShowNotification = ({
    type,
    icon,
    title,
    description,
    timeout,
    closable,
    reject,
    accept,
  }: Omit<Notify, "id">) => {
    const notify = {
      id: Math.floor(Math.random() * 10000),
      type,
      icon,
      title,
      description,
      timeout: timeout || 10,
      closable,
      accept: accept
        ? () => {
            const idx = notifications.value.findIndex((n) => n.id === notify.id);
            if (idx > -1) notifications.value.splice(idx, 1);
            if (accept) accept();
          }
        : undefined,
      reject: () => {
        const idx = notifications.value.findIndex((n) => n.id === notify.id);
        if (idx > -1) notifications.value.splice(idx, 1);
        if (reject) reject();
      },
    };
    setTimeout(() => {
      notify.reject();
    }, (timeout || 10) * 1000);
    notifications.value.push(notify);
  };

  return {
    notifications,
    ShowNotification,
  };
});
