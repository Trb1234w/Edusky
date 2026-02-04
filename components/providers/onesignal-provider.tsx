"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";
import { createClient } from "@/lib/supabase/client";

export function OneSignalProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const initOneSignal = async () => {
            try {
                const appId = (process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "").replace(/"/g, "").trim();

                if (!appId) {
                    console.warn("OneSignal App ID missing");
                    return;
                }

                await OneSignal.init({
                    appId: appId,
                    safari_web_id: "web.onesignal.auto.1881b8be-1ae3-4d80-a99d-32f491a07c07",
                    notifyButton: {
                        enable: true,
                    } as any, // Bypass strict type check for brevity or add all required fields
                    allowLocalhostAsSecureOrigin: true,
                });

                // Get current user and sync with OneSignal
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    console.log("[OneSignal] Logging in user:", user.id);
                    await OneSignal.login(user.id);
                }

            } catch (err) {
                console.error("OneSignal Init Error:", err);
            }
        };

        if (typeof window !== "undefined") {
            initOneSignal();
        }
    }, []);

    return <>{children}</>;
}
