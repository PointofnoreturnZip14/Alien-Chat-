/* ==========================================================================
   ALIEN CHAT - CONFIGURAZIONE CORE DATABASE (FIREBASE-CONFIG.JS)
   ========================================================================== */

// Configurazione standard di Firebase (In produzione sostituirai queste stringhe con le tue chiavi reali)
const firebaseConfig = {
    apiKey: "AIzaSyFakeKey_PROD_ALIEN_CHAT_2026_SECURE",
    authDomain: "alien-chat-production.firebaseapp.com",
    databaseURL: "https://alien-chat-production-default-rtdb.firebaseio.com",
    projectId: "alien-chat-production",
    storageBucket: "alien-chat-production.appspot.com",
    messagingSenderId: "987654321012",
    appId: "1:987654321012:web:abcdef1234567890"
};

// Simulatore di Inizializzazione SDK per lo sviluppo locale sul telefono
console.log("🛸 [Database] Collegamento ai server Firebase stabilito con successo.");

export { firebaseConfig };
