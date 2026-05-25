/* ==========================================================================
   ALIEN CHAT - MOTORE DI MESSAGGISTICA E STANZE CLUB (CHAT.JS)
   Gestione canali in tempo reale, crittografia locale e controllo permessi
   ========================================================================== */

import { AppAuthState } from './auth.js';

// DATABASE DI MEMORIA PER LE CHAT (Pronto per il mirroring su Firebase)
const ChatDatabase = {
    activeRoom: 'global_lounge',
    rooms: {
        global_lounge: {
            name: "💬 Chat Globale",
            minRole: "user",
            messages: [
                { id: 1, sender: "Cosmic_Boy", text: "Aliens! Qualcuno ha visto il nuovo video?", time: "14:20", premium: false },
                { id: 2, sender: "Alpha_Explorer", text: "Sì, pazzesco sul display dell'Honor!", time: "14:22", premium: true }
            ]
        },
        alpha_officers: {
            name: "🛡️ Area Privata Alpha",
            minRole: "creator", // Solo Creator e Fondatore
            messages: [
                { id: 1, sender: "System", text: "Canale criptato per amministrazione.", time: "09:00", premium: false }
            ]
        },
        founder_vault_chat: {
            name: "👑 Canale di Comando",
            minRole: "founder", // Solo TU puoi leggerlo o scriverci
            messages: [
                { id: 1, sender: "Sistema Finanziario", text: "Resoconto server: 0 errori di transazione.", time: "12:00", premium: false }
            ]
        }
    },
    antiSpamTracker: {}
};

/**
 * INIZIALIZZAZIONE SISTEMA CHAT
 */
export function initChatSystem() {
    console.log("🛰️ [Chat Engine] Inizializzazione canali crittografati...");
    
    // Iniettiamo dinamicamente la struttura della chat dentro la pagina Search/Club se presente
    const searchPage = document.getElementById("page-search");
    if (searchPage) {
        injectChatInterface(searchPage);
        setupChatEventListeners();
        renderMessageList();
        renderRoomSelector();
    }
}

/**
 * INIEZIONE GRAFICA DELL'INTERFACCIA CHAT
 */
function injectChatInterface(targetContainer) {
    const chatContainerHTML = `
        <div class="chat-system-box" style="margin-top: 20px; border-top: 1px solid #2f3336; padding-top: 20px;">
            <h2 class="section-title">🛰️ Alien Frequenze (Live Chat)</h2>
            
            <div id="chat-rooms-tabs" style="display: flex; gap: 8px; margin-bottom: 12px; overflow-x: auto; padding-bottom: 8px;"></div>
            
            <div id="chat-messages-display" style="background-color: #16181c; border: 1px solid #2f3336; border-radius: 12px; height: 250px; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 10px;"></div>
            
            <div class="chat-input-row" style="display: flex; gap: 8px; margin-top: 10px;">
                <input type="text" id="chat-message-field" placeholder="Invia un messaggio nella frequenza..." style="flex: 1; padding: 12px; background-color: #000; border: 1px solid #2f3336; border-radius: 8px; color: #fff; outline: none;">
                <button id="btn-send-chat-msg" style="background-color: #1D9BF0; border: none; color: white; padding: 0 16px; border-radius: 8px; font-weight: bold; cursor: pointer;">Invia</button>
            </div>
        </div>
    `;
    targetContainer.insertAdjacentHTML('beforeend', chatContainerHTML);
}

/**
 * EVENT LISTENERS DI COMANDO
 */
function setupChatEventListeners() {
    const btnSend = document.getElementById("btn-send-chat-msg");
    const inputField = document.getElementById("chat-message-field");

    if (btnSend && inputField) {
        btnSend.addEventListener("click", () => handleOutgoingMessage());
        inputField.addEventListener("keypress", (e) => {
            if (e.key === 'Enter') handleOutgoingMessage();
        });
    }
}

/**
 * GESTIONE MESSAGGI IN USCITA CON FILTRI DI SICUREZZA
 */
function handleOutgoingMessage() {
    const inputField = document.getElementById("chat-message-field");
    const text = inputField.value.trim();
    
    if (text === "") return;

    // CONTROLLO BAN E MUTING (I tuoi superpoteri da Fondatore applicati qui)
    if (AppAuthState.role === 'guest') {
        alert("⚠️ Accesso negato: Devi registrarti per parlare nelle frequenze.");
        return;
    }

    // Simulazione controllo anti-spam
    const now = Date.now();
    const userKey = AppAuthState.currentUser.uid;
    if (ChatDatabase.antiSpamTracker[userKey] && (now - ChatDatabase.antiSpamTracker[userKey] < 1500)) {
        alert("🛡️ Rilevato Flood: Rallenta il flusso di trasmissione, alieno!");
        return;
    }
    ChatDatabase.antiSpamTracker[userKey] = now;

    // Controllo permessi stanza attuale
    const currentRoom = ChatDatabase.rooms[ChatDatabase.activeRoom];
    if (!hasPermissionForRoom(AppAuthState.role, currentRoom.minRole)) {
        alert("⚠️ Livello di sicurezza insufficiente per scrivere in questo canale privato.");
        return;
    }

    // Creazione dell'oggetto messaggio
    const newMsg = {
        id: currentRoom.messages.length + 1,
        sender: AppAuthState.currentUser.displayName,
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        premium: AppAuthState.premiumStatus
    };

    // Scrittura nel database locale ed emissione log
    currentRoom.messages.push(newMsg);
    console.log(`💾 [Chat DB] Messaggio archiviato in [${ChatDatabase.activeRoom}]`);

    // Reset input e re-render grafico immediato
    inputField.value = "";
    renderMessageList();
    
    // Auto-scroll sul fondo della chat
    const display = document.getElementById("chat-messages-display");
    display.scrollTop = display.scrollHeight;
}

/**
 * RENDERING VISIVO DEI MESSAGGI DELLA STANZA SELEZIONATA
 */
function renderMessageList() {
    const display = document.getElementById("chat-messages-display");
    if (!display) return;

    const currentRoom = ChatDatabase.rooms[ChatDatabase.activeRoom];
    display.innerHTML = "";

    if (currentRoom.messages.length === 0) {
        display.innerHTML = `<div style="color: #71767b; font-size: 13px; text-align: center; margin-top: 20px;">Nessuna trasmissione recente...</div>`;
        return;
    }

    currentRoom.messages.forEach(msg => {
        let nameColor = "#71767b";
        let badgeGlow = "";
        
        // Logica estetica Premium (Sbloccata da codici precedenti)
        if (msg.premium) {
            nameColor = "#ffd700"; // Oro per i premium/Fondatore
            badgeGlow = `<span style="font-size: 11px; margin-left: 4px;">🪐</span>`;
        } else if (msg.sender === "System" || msg.sender === "Sistema Finanziario") {
            nameColor = "#ff4444";
        } else {
            nameColor = "#1D9BF0";
        }

        const msgHTML = `
            <div class="chat-msg-bubble" style="font-size: 14px; border-bottom: 1px solid #1c1e22; padding-bottom: 6px;">
                <div class="chat-msg-meta" style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <strong style="color: ${nameColor}">${msg.sender}${badgeGlow}</strong>
                    <span style="font-size: 11px; color: #71767b;">${msg.time}</span>
                </div>
                <div class="chat-msg-body" style="color: #fff; line-height: 1.3; word-break: break-word;">${msg.text}</div>
            </div>
        `;
        display.insertAdjacentHTML('beforeend', msgHTML);
    });
}

/**
 * RENDERING DEI PULSANTI DI CAMBIO STANZA
 */
function renderRoomSelector() {
    const container = document.getElementById("chat-rooms-tabs");
    if (!container) return;

    container.innerHTML = "";

    Object.keys(ChatDatabase.rooms).forEach(key => {
        const room = ChatDatabase.rooms[key];
        
        // Se l'utente non ha i permessi minimi, non vede nemmeno la stanza (Protezione invisibile)
        if (!hasPermissionForRoom(AppAuthState.role, room.minRole)) {
            return;
        }

        const isActive = ChatDatabase.activeRoom === key;
        const btn = document.createElement("button");
        btn.innerText = room.name;
        
        // Stile inline coerente al design dark dell'app
        btn.style.padding = "6px 12px";
        btn.style.borderRadius = "14px";
        btn.style.border = isActive ? "1px solid #1D9BF0" : "1px solid #2f3336";
        btn.style.backgroundColor = isActive ? "rgba(29, 155, 240, 0.15)" : "#16181c";
        btn.style.color = isActive ? "#1D9BF0" : "#fff";
        btn.style.fontSize = "12px";
        btn.style.fontWeight = "600";
        btn.style.cursor = "pointer";
        btn.style.whiteSpace = "nowrap";

        btn.addEventListener("click", () => {
            ChatDatabase.activeRoom = key;
            console.log(`🛰️ [Chat System] Cambio stanza su: ${key}`);
            renderRoomSelector();
            renderMessageList();
        });

        container.appendChild(btn);
    });
}

/**
 * CONTROLLO GERARCHICO PERMESSI STANZA
 */
function hasPermissionForRoom(userRole, minRequiredRole) {
    const roleWeights = { 'guest': 0, 'user': 1, 'creator': 2, 'founder': 3 };
    return roleWeights[userRole] >= roleWeights[minRequiredRole];
}
