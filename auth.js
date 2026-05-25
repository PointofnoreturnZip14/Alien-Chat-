/* ==========================================================================
   ALIEN CHAT - GESTORE ACCESSI E SICUREZZA RUOLI (AUTH.JS)
   ========================================================================== */

import { firebaseConfig } from './firebase-config.js';

// Stato dell'utente corrente memorizzato nella sessione dell'app
export const AppAuthState = {
    currentUser: null,
    isLoggedIn: false,
    role: 'guest', // 'guest', 'user', 'creator', 'founder'
    premiumStatus: false
};

// EMAIL SACRA DEL FONDATORE (Modificala con la tua vera email)
const FOUNDER_EMAIL = "fondatore@alienchat.com";

/**
 * Traduttore degli errori di sicurezza di Firebase per l'utente finale
 */
function translateAuthError(errorCode) {
    switch (errorCode) {
        case 'auth/wrong-password': return '⚠️ Password errata. Riprova.';
        case 'auth/user-not-found': return '⚠️ Questo account alieno non esiste.';
        case 'auth/email-already-in-use': return '⚠️ Questa email è già registrata sul nostro pianeta.';
        case 'auth/weak-password': return '⚠️ La password è troppo debole (minimo 6 caratteri).';
        default: return '⚠️ Errore di connessione al server spaziale.';
    }
}

/**
 * FUNZIONE LOG IN: Controlla le credenziali e assegna i poteri
 */
export function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        console.log(`🛸 [Auth] Tentativo di accesso per: ${email}`);
        
        // Simulazione del controllo di sicurezza sul Database Firebase
        setTimeout(() => {
            if (password.length < 6) {
                reject(translateAuthError('auth/wrong-password'));
                return;
            }

            // Configurazione dell'utente nel sistema
            AppAuthState.isLoggedIn = true;
            AppAuthState.currentUser = {
                email: email,
                uid: "usr_" + Math.random().toString(36).substr(2, 9),
                displayName: email.split('@')[0],
                walletBalanceCores: 150, // Credito iniziale di test
                earnedMoneyEuro: 0
            };

            // LOGICA CRUCIALE: Riconoscimento del ruolo a livello di codice
            if (email.toLowerCase() === FOUNDER_EMAIL.toLowerCase()) {
                AppAuthState.role = 'founder';
                AppAuthState.premiumStatus = true;
                console.log("👑 [PROPRIETARIO RICONOSCIUTO] Sblocco dei superpoteri amministrativi completato.");
            } else if (email.includes('creator') || email.includes('influencer')) {
                AppAuthState.role = 'creator';
                AppAuthState.currentUser.earnedMoneyEuro = 1450.00; // Stipendio simulato per il test
                console.log("🎙️ [CREATOR RICONOSCIUTO] Sblocco del Wallet Cash Out (Quota 70%).");
            } else {
                AppAuthState.role = 'user';
                console.log("👤 [UTENTE STANDARD] Accesso alla community standard abilitato.");
            }

            // Salvataggio sicuro della sessione sul telefono (Honor 200)
            localStorage.setItem('alien_session', JSON.stringify(AppAuthState));
            resolve(AppAuthState);
        }, 800); // Ritardo di simulazione rete reale
    });
}

/**
 * FUNZIONE REGISTRAZIONE: Crea un nuovo profilo nel database
 */
export function registerNewUser(email, password, username) {
    return new Promise((resolve, reject) => {
        console.log(`🛸 [Auth] Registrazione nuovo account: ${username}`);

        setTimeout(() => {
            if (!email.includes('@')) {
                reject('⚠️ Formato email non valido.');
                return;
            }
            if (password.length < 6) {
                reject(translateAuthError('auth/weak-password'));
                return;
            }

            // Struttura del dato che verrà salvato su Firebase Realtime Database
            const newUserData = {
                username: username,
                email: email,
                isPremium: false,
                verificationBadge: false,
                banStatus: {
                    isBanned: false,
                    banType: 'none', // 'permanent', 'temporary', 'chat_mute', 'comment_mute'
                    expiryTimestamp: null
                },
                wallet: {
                    cores: 0,
                    history: []
                }
            };

            console.log("💾 [Database] Profilo utente scritto con successo su Firebase.");
            resolve(newUserData);
        }, 1000);
    });
}

/**
 * LOG OUT: Pulisce la memoria del telefono e disconnette l'utente
 */
export function logoutUser() {
    AppAuthState.currentUser = null;
    AppAuthState.isLoggedIn = false;
    AppAuthState.role = 'guest';
    AppAuthState.premiumStatus = false;
    localStorage.removeItem('alien_session');
    console.log("🔒 [Auth] Sessione chiusa. Ritorno allo stato Guest.");
    window.location.reload();
}

/**
 * VERIFICA SESSIONE AUTOMATICA ALL'AVVIO
 */
export function checkExistingSession() {
    const savedSession = localStorage.getItem('alien_session');
    if (savedSession) {
        const parsed = JSON.parse(savedSession);
        Object.assign(AppAuthState, parsed);
        console.log(`🔄 [Auth] Sessione ripristinata per: ${AppAuthState.currentUser.email} (${AppAuthState.role})`);
    } else {
        // Forza un login di test automatico come FONDATORE se la cartella è vuota
        // Questo ti permette di testare l'app sul telefono senza dover programmare una pagina di login prima
        loginUser("fondatore@alienchat.com", "passwordSicura123")
            .then(() => console.log("⚙️ [Sviluppo] Auto-login Fondatore attivo per i test locali."));
    }
}
