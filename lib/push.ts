// OneSignal Server-Side Utility for Edusky
export async function sendPushNotification({
    userId,
    title,
    body,
    url
}: {
    userId: string,
    title: string,
    body: string,
    url?: string
}) {
    const appId = (process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "").replace(/"/g, "").trim();
    const apiKey = (process.env.ONESIGNAL_REST_API_KEY || "").replace(/"/g, "").trim();

    if (!appId || !apiKey) {
        console.error("OneSignal keys missing in env");
        return { success: false, error: "Missing keys" };
    }

    try {
        console.log(`[OneSignal] Sending push to target external_id: ${userId}`);
        const response = await fetch("https://onesignal.com/api/v1/notifications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Basic ${apiKey}`
            },
            body: JSON.stringify({
                app_id: appId,
                include_external_user_ids: [userId],
                contents: { "en": body, "fr": body },
                headings: { "en": title, "fr": title },
                url: url || "https://edusky-platform.vercel.app"
            })
        });

        const data = await response.json();
        console.log("OneSignal Server Response:", data);

        if (data.errors) {
            return { success: false, error: data.errors };
        }

        return { success: true, count: data.recipients || 0 };
    } catch (err) {
        console.error("OneSignal Server Error:", err);
        return { success: false, error: err };
    }
}
