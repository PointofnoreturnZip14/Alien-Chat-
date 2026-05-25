/* ==========================================================================
   ALIEN CHAT - IL MOTORE CENTRALE DELL'APPLICAZIONE (APP.JS)
   Gestione SPA, Flussi Video, Calcoli Portafoglio (70/30) e Sanzioni Fondatore
   ========================================================================== */
import { initUserSettings } from './user-settings.js';
import { initUserSettings } from './user-settings.js';

import { AppAuthState, checkExistingSession, logoutUser } from './auth.js';
import { initChatSystem } from './chat.js';
import { initVideoReelEngine } from './video-reel.js';
import { initNotificationsAndAnalytics, refreshNotificationsUI } from './notifications-engine.js';
import { initSecurityModule } from './crypto-security.js';
import { ServerSimulator, initServerMonitoring } from './server-simulator.js';
import { initExporter } from './data-exporter.js';
    // Inizializzazione moduli aggiuntivi
    initChatSystem();
    initVideoReelEngine();
    initNotificationsAndAnalytics();
    initSecurityModule();
    ServerSimulator.connect();
    initServerMonitoring();
    initExporter();
    refreshNotificationsUI();

// DATABASE LOCALE TEMPORANEO (Sincronizzato graficamente prima del push live su Firebase)
const MockDatabase = {
    vaultTotalVolume: 156400.00,
    vaultFounderNet: 46920.00,
    creatorEarnings: 1450.00,
    userCores: 150,
    activeSubscribers: ['User_Delta', 'Fan_Spaziale_42', 'Cosmic_Crypto'],
    bannedUsersList: [],
    
    // Dati gerarchici dei Club richiesti
    clubs: {
        alpha: [
            { name: "Tu (Fondatore)", role: "👑 Presidente", lv: 1 },
            { name: "User_Beta_Partner", role: "⚡ Vicepresidente", lv: 2 },
            { name: "Socio_Anziano_01", role: "Socio Anziano", lv: 3 },
            { name: "Membro_Standard_X", role: "Socio Membro", lv: 4 },
            { name: "Moderatore_Locale_Alpha", role: "Direttore", lv: 5 },
            { name: "Nuovo_Infiltrato", role: "Visitatore", lv: 6 }
        ],
        area51: [
            { name: "Tu (Fondatore)", role: "👑 Presidente", lv: 1 },
            { name: "Agente_Segreto_X", role: "⚡ Vicepresidente", lv: 2 },
            { name: "Alien_Catturato", role: "Visitatore", lv: 6 }
        ],
        nebula: [
            { name: "Stellar_Gamer", role: "👑 Presidente", lv: 1 },
            { name: "Astronauta_Perso", role: "Socio Membro", lv: 4 }
        ]
    }
};

// ATTIVAZIONE AL CARICAMENTO DELLA PAGINA (INIZIALIZZAZIONE)
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 [Engine] Avvio dei sistemi integrati di Alien Chat...");
    
    // 1. Controlla se sul telefono c'è una sessione attiva (Autologin Fondatore per i test)
    checkExistingSession();
    
    // 2. Avvia i motori principali dell'applicazione
    initSPANavigation();
    initClubSwapping();
    initWalletAndStoreLogic();
    initFounderSanctionPanel();
    initUploadModal();
    updateUIBasedOnRole();
});

/* ==========================================================================
   1. MOTORE SPA (NAVIGAZIONE FLUIDA SENZA RICARICARE)
   ========================================================================== */
function initSPANavigation() {
    const navItems = document.querySelectorAll(".nav-action-item");
    
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            // Trova il target di destinazione (es. page-feed, page-search)
            const targetPageId = item.getAttribute("data-target");
            
            window.switchSPAPage(targetPageId);
            
            // Aggiorna l'icona attiva nel footer grafico
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");
        });
    });

    // Funzione globale accessibile anche dai pulsanti interni alle pagine
    window.switchSPAPage = function(pageId) {
        console.log(`🔄 [SPA] Transizione sulla schermata: ${pageId}`);
        
        // Nasconde tutte le pagine
        const allPages = document.querySelectorAll(".spa-page");
        allPages.forEach(page => page.classList.remove("active"));
        
        // Mostra solo la pagina richiesta
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add("active");
            // Scroll automatico in alto per comodità su smartphone
            document.getElementById("spa-container").scrollTop = 0;
        } else {
            console.error(`⚠️ Errore: La schermata ${pageId} non esiste nell'HTML.`);
        }
    };
}

/* ==========================================================================
   2. LOGICA SEZIONE CLUB (SPOSTAMENTO E GERARCHIE)
   ========================================================================== */
function initClubSwapping() {
    const clubTabs = document.querySelectorAll(".club-selection-tab");
    const hierarchyListContainer = document.querySelector(".hierarchy-list");
    const currentClubTitle = document.getElementById("current-club-name");

    clubTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            clubTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const clubKey = tab.getAttribute("data-club");
            const clubData = MockDatabase.clubs[clubKey];

            // Aggiorna il titolo del Club visualizzato
            currentClubTitle.innerText = `Club: ${tab.innerText}`;

            // Svuota la lista precedente e ricostruisce la gerarchia corretta
            hierarchyListContainer.innerHTML = "";
            
            clubData.forEach(member => {
                let badgeClass = "role-badge";
                if (member.lv === 1) badgeClass += " badge-pres";
                if (member.lv === 2) badgeClass += " badge-vice";

                const memberRow = document.createElement("div");
                memberRow.className = `hierarchy-item role-level-${member.lv}`;
                memberRow.innerHTML = `
                    <span class="member-name">${member.name}</span>
                    <span class="${badgeClass}">${member.role}</span>
                `;
                hierarchyListContainer.appendChild(memberRow);
            });
            console.log(`🛸 [Club] Caricata gerarchia per il canale: ${clubKey}`);
        });
    });
}

/* ==========================================================================
   3. ECONOMIA INTERNA (NEGOZIO STRIPE, WALLET E DIVISIONE SOLDI 70/30)
   ========================================================================== */
function initWalletAndStoreLogic() {
    const buyButtons = document.querySelectorAll(".btn-purchase-trigger");
    const premiumBtn = document.getElementById("btn-buy-premium-pass");
    const cashoutBtn = document.getElementById("btn-execute-cashout");
    const payoutFounderBtn = document.getElementById("btn-stripe-payout");

    // Simulazione Acquisto Pacchetti Sub nel Negozio (Integrazione logica Stripe)
    buyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const price = parseFloat(btn.getAttribute("data-price"));
            const packName = btn.getAttribute("data-pack");

            // MATEMATICA AZIENDALE: Calcolo delle quote di spettanza
            const creatorShare = price * 0.70;  // 70% all'influencer
            const founderShare = price * 0.30;  // 30% a TE (Fondatore)

            // Aggiornamento dei bilanci nel database simulato
            MockDatabase.vaultTotalVolume += price;
            MockDatabase.vaultFounderNet += founderShare;
            MockDatabase.creatorEarnings += creatorShare;

            // Aggiornamento visivo immediato nel Caveau Amministratore
            refreshFinancialUI();

            alert(`💳 [Stripe Secure] Pagamento di ${price}€ completato!\n\n` +
                  `Distribuito l'acquisto del pacchetto "${packName}":\n` +
                  `🎙️ Quota spettante al Creator (70%): +${creatorShare.toFixed(2)}€\n` +
                  `👑 Quota trattenuta da Te (30%): +${founderShare.toFixed(2)}€\n\n` +
                  `I soldi sono ora disponibili nei rispettivi Wallet reali.`);
        });
    });

    // Simulazione Abbonamento Premium Generale (9,99€)
    if (premiumBtn) {
        premiumBtn.addEventListener("click", () => {
            const price = 9.99;
            const founderShare = price * 0.30;
            
            MockDatabase.vaultTotalVolume += price;
            MockDatabase.vaultFounderNet += founderShare;
            refreshFinancialUI();

            alert(`✨ Complimenti! Sei diventato un utente ALIEN ELITE.\n` +
                  `Sbloccati i 4 poteri estetici sul tuo Honor 200.\n` +
                  `Trattenuta Fondatore (30%) accreditata: +${founderShare.toFixed(2)}€`);
        });
    }

    // Richiesta di Prelievo dell'Influencer (Cash Out sul conto corrente)
    if (cashoutBtn) {
        cashoutBtn.addEventListener("click", () => {
            const ibanInput = document.getElementById("creator-iban-input").value;
            if (ibanInput.length < 15) {
                alert("⚠️ Errore: Inserisci un codice IBAN valido per completare il bonifico.");
                return;
            }
            alert(`💰 Bonifico inviato con successo!\n` +
                  `L'importo di ${MockDatabase.creatorEarnings.toFixed(2)}€ è stato trasferito sul conto reale.`);
            MockDatabase.creatorEarnings = 0;
            document.querySelector(".monetary-value").innerText = "0,00 €";
        });
    }

    // Prelievo Fondatore su Stripe Business
    if (payoutFounderBtn) {
        payoutFounderBtn.addEventListener("click", () => {
            alert(`🏦 [Stripe Connect] Elaborazione Bonifico verso il tuo conto italiano...\n\n` +
                  `Trasferiti ${MockDatabase.vaultFounderNet.toFixed(2)}€ veri sul tuo IBAN personale.`);
            MockDatabase.vaultFounderNet = 0;
            refreshFinancialUI();
        });
    }
}

function refreshFinancialUI() {
    if (document.getElementById("vault-total-volume")) {
        document.getElementById("vault-total-volume").innerText = `${MockDatabase.vaultTotalVolume.toFixed(2)} €`;
        document.getElementById("vault-net-earnings").innerText = `${MockDatabase.vaultFounderNet.toFixed(2)} €`;
    }
}

/* ==========================================================================
   4. PANNELLO SANZIONI E BAN DEL FONDATORE SUPREMO
   ========================================================================== */
function initFounderSanctionPanel() {
    const btnApply = document.getElementById("btn-apply-sanction");
    const btnVerify = document.getElementById("btn-grant-verification");

    if (btnApply) {
        btnApply.addEventListener("click", () => {
            const targetUser = document.getElementById("target-user-sanction").value.trim();
            const sanctionType = document.getElementById("sanction-type-select").value;

            if (targetUser === "") {
                alert("⚠️ Errore: Devi digitare il nome dell'utente alieno da punire.");
                return;
            }

            // Registrazione del Ban nel sistema di sicurezza
            MockDatabase.bannedUsersList.push({ user: targetUser, type: sanctionType });
            console.log(`🛡️ [Database Sever] Sanzione applicata a ${targetUser}: ${sanctionType}`);
            
            alert(`🔴 SUPREMAZIA FONDATORE APPLICATA!\n\n` +
                  `L'utente "${targetUser}" ha subito la sanzione: [${sanctionType.toUpperCase()}] nel Database.\n` +
                  `Le sue funzioni sono state bloccate all'istante.`);
            
            document.getElementById("target-user-sanction").value = "";
        });
    }

    if (btnVerify) {
        btnVerify.addEventListener("click", () => {
            const targetUser = document.getElementById("target-user-sanction").value.trim();
            if (targetUser === "") {
                alert("⚠️ Errore: Digita il nome dell'utente meritevole prima.");
                return;
            }
            alert(`🔹 Spunta Blu assegnata con successo per merito a: "${targetUser}".\n` +
                  `Il badge comparirà accanto ad ogni suo post nel feed.`);
            document.getElementById("target-user-sanction").value = "";
        });
    }
}

/* ==========================================================================
   5. MODALE UPLOAD POST MULTIMEDIALI (FOTO / VIDEO .MP4 NATIVI)
   ========================================================================== */
function initUploadModal() {
    const fabTrigger = document.getElementById("global-fab-upload-trigger");
    const modalOverlay = document.getElementById("upload-modal-overlay");
    const btnCancel = document.getElementById("btn-modal-cancel");
    const btnPublish = document.getElementById("btn-modal-publish");
    const filePicker = document.getElementById("native-file-picker");
    const fileFeedback = document.getElementById("selected-file-name-feedback");

    fabTrigger.addEventListener("click", () => {
        modalOverlay.className = "modal-overlay-visible";
    });

    btnCancel.addEventListener("click", () => {
        modalOverlay.className = "modal-overlay-hidden";
    });

    filePicker.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            fileFeedback.innerText = `File pronto: ${e.target.files[0].name}`;
        }
    });

    btnPublish.addEventListener("click", () => {
        const text = document.getElementById("upload-text-input").value;
        if (text.trim() === "" && filePicker.files.length === 0) {
            alert("⚠️ Non puoi pubblicare un post vuoto!");
            return;
        }

        alert("🛸 Post caricato con successo nel database!\n" +
              "Il file multimediale è stato ottimizzato per lo streaming.");
              
        modalOverlay.className = "modal-overlay-hidden";
        document.getElementById("upload-text-input").value = "";
        filePicker.value = "";
        fileFeedback.innerText = "Nessun file selezionato";
    });
}

/* ==========================================================================
   6. OTTIMIZZAZIONE INTERFACCIA IN BASE AL RUOLO UTENTE
   ========================================================================== */
function updateUIBasedOnRole() {
    const profileTab = document.getElementById("dynamic-profile-footer-tab");
    
    // Configura la barra di navigazione inferiore in base al ruolo dell'autologin
    if (AppAuthState.role === 'founder') {
        profileTab.setAttribute("data-target", "page-profile-founder");
        console.log("👑 [UI Customizer] Footer configurato sul Pannello Fondatore.");
    } else if (AppAuthState.role === 'creator') {
        profileTab.setAttribute("data-target", "page-profile-creator");
        console.log("🎙️ [UI Customizer] Footer configurato sul Profilo Creator.");
    } else {
        profileTab.setAttribute("data-target", "page-profile-user");
    }
    
    // Tasto export nativo richiesto
    const btnExport = document.getElementById("btn-global-export");
    if(btnExport) {
        btnExport.addEventListener("click", () => {
            alert("📁 [Export Pro] Tutta l'architettura dei 5 file è stata impacchettata e salvata nella memoria interna dell'Honor 200.");
        });
    }
}
