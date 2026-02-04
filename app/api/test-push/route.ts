import { NextRequest, NextResponse } from 'next/server';
import { sendPushNotification } from '@/lib/push';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID missing' }, { status: 400 });
        }

        console.log("[TestAPI] Sending push to", userId);
        const result = await sendPushNotification({
            userId,
            title: "Test de Production 🚀",
            body: "Si vous voyez ceci, les notifications fonctionnent !",
            url: "/test-notifications"
        });

        return NextResponse.json(result);
    } catch (err: any) {
        console.error("[TestAPI] Error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
