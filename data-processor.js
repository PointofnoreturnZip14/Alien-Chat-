/* ==========================================================================
   ALIEN CHAT - MOTORE DI ELABORAZIONE DATI (DATA-PROCESSOR.JS)
   Gestione pesi, formati JSON e ottimizzazione Database
   ========================================================================== */

export const DataProcessor = {
    // Trasforma i dati grezzi del database in formati leggibili dall'interfaccia
    formatCurrency(amount) {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
    },

    parseDatabaseResponse(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            console.log("🔄 [Data] Dati normalizzati correttamente.");
            return data;
        } catch (e) {
            console.error("⚠️ [Data] Errore di parsing, attivazione protocollo di emergenza.");
            return null;
        }
    },

    validateUserPermission(user, requiredLevel) {
        const hierarchy = { 'user': 1, 'creator': 2, 'founder': 3 };
        return hierarchy[user.role] >= requiredLevel;
    }
};

export function initDataProcessor() {
    console.log("⚙️ [Processor] Motore dati sincronizzato.");
}
