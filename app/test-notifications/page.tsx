"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebPush } from "@/hooks/use-web-push";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function TestNotificationsPage() {
    const { isSubscribed, subscribeUser, loading: pushLoading, error: pushError } = useWebPush();
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState<string>("");

    const sendTestPush = async () => {
        setSending(true);
        setResult("");
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setResult("Erreur: Vous devez être connecté.");
                return;
            }

            // Call a server action directly
            const response = await fetch('/api/test-push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });

            const data = await response.json();
            setResult(JSON.stringify(data, null, 2));

            if (data.success) {
                toast.success("Push envoyé ! Vérifiez votre téléphone/PC");
            } else {
                toast.error("Erreur lors de l'envoi");
            }

        } catch (err: any) {
            setResult("Erreur Client: " + err.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle>Test Notifications Production</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-md space-y-2">
                        <p><strong>État Permission Navigateur :</strong> <span className="font-mono bg-yellow-100 px-1 rounded">{typeof Notification !== 'undefined' ? Notification.permission : 'Unknown'}</span></p>
                        <p><strong>Statut Abonnement Push :</strong> {isSubscribed ? "✅ Actif" : "❌ Inactif"}</p>
                        {!isSubscribed && (
                            <Button onClick={subscribeUser} disabled={pushLoading} variant="outline" className="w-full">
                                {pushLoading ? "Activation..." : "Activer les Notifications"}
                            </Button>
                        )}
                        {pushError && <p className="text-xs text-red-500">{pushError}</p>}
                    </div>

                    <Button onClick={sendTestPush} disabled={sending || !isSubscribed} className="w-full">
                        {sending ? "Envoi en cours..." : "Envoyer un Test Push Maintenant"}
                    </Button>

                    {result && (
                        <pre className="p-4 bg-black text-green-400 text-xs rounded overflow-auto max-h-40">
                            {result}
                        </pre>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
