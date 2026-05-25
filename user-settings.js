/* ==========================================================================
   ALIEN CHAT - MOTORE PREFERENZE UTENTE (USER-SETTINGS.JS)
   Gestione tema, notifiche, privacy e persistenza dati locale
   ========================================================================== */

export const UserSettings = {
    preferences: {
        theme: 'dark', // 'dark' o 'light'
        notificationsEnabled: true,
        privacyMode: 'public',
        fontSize: 'medium'
    },

    // Salva le impostazioni nel browser (Local Storage)
    saveSettings() {
        console.log("💾 [Settings] Salvataggio preferenze in corso...");
        localStorage.setItem('alien_chat_prefs', JSON.stringify(this.preferences));
    },

    // Carica le impostazioni al riavvio
    loadSettings() {
        const saved = localStorage.getItem('alien_chat_prefs');
        if (saved) {
            this.preferences = JSON.parse(saved);
            console.log("⚙️ [Settings] Preferenze utente caricate.");
        }
    },

    toggleTheme() {
        this.preferences.theme = this.preferences.theme === 'dark' ? 'light' : 'dark';
        document.body.className = this.preferences.theme + "-theme";
        this.saveSettings();
        console.log(`🎨 [Settings] Tema cambiato in: ${this.preferences.theme}`);
    }
};

/**
 * INIZIALIZZAZIONE DEL MODULO IMPOSTAZIONI
 */
export function initUserSettings() {
    UserSettings.loadSettings();
    
    // Applica il tema al caricamento
    document.body.className = UserSettings.preferences.theme + "-theme";
    console.log("🛠️ [Module] User Settings inizializzato.");
}
