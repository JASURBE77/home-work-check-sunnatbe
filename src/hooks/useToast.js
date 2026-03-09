import { App } from "antd";

/**
 * Antd App.useApp() orqali toast/notification chiqaruvchi hook.
 * Faqat AntApp ichida ishlaydi (main.jsx da o'rnatilgan).
 */
export function useToast() {
  const { message, notification } = App.useApp();

  return {
    success: (content, duration = 3) => message.success(content, duration),
    error: (content, duration = 4) => message.error(content, duration),
    warning: (content, duration = 3) => message.warning(content, duration),
    info: (content, duration = 3) => message.info(content, duration),
    loading: (content, duration = 0) => message.loading(content, duration),

    notify: {
      success: (title, desc) =>
        notification.success({ message: title, description: desc, placement: "topRight" }),
      error: (title, desc) =>
        notification.error({ message: title, description: desc, placement: "topRight" }),
      warning: (title, desc) =>
        notification.warning({ message: title, description: desc, placement: "topRight" }),
      info: (title, desc) =>
        notification.info({ message: title, description: desc, placement: "topRight" }),
    },
  };
}
