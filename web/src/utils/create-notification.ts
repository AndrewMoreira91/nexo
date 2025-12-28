export default function createNotification(title: string, message: string) {
	if (Notification.permission === "granted") {
		const notification = new Notification(title, {
			body: message,
			lang: "pt-BR",
			requireInteraction: true,
			icon: "/logo-icon-nekso.svg",
			tag: "nekso-notification",
			badge: "/logo-icon-nekso.svg",
		});
		return notification;
	}
}
