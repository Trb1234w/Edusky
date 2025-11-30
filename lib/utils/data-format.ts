export const normalizeArray = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'object' && data !== null) {
        // Si c'est un objet avec des clés numériques (ex: {0: "a", 1: "b"}), on prend les valeurs
        return Object.values(data);
    }
    if (typeof data === 'string') {
        try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) return parsed;
            if (typeof parsed === 'object' && parsed !== null) return Object.values(parsed);
            return [data];
        } catch {
            return [data];
        }
    }
    return [data];
};
