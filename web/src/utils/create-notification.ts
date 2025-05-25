export default function createNotification(title: string, message: string) {
	if (Notification.permission === "granted") {
		const notification = new Notification(title, {
			body: message,
			lang: "pt-BR",
			requireInteraction: true,
			icon: "/logo-icon-nexo.svg",
			tag: "nexo-notification",
			badge: "/logo-icon-nexo.svg",
		});
		return notification;
	}
}
