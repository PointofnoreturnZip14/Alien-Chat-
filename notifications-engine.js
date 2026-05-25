/* ==========================================================================
   ALIEN CHAT - MOTORE NOTIFICHE E ALGORITMO ANALYTICS (NOTIFICATIONS-ENGINE.JS)
   ========================================================================== */

const NotificationCenterDatabase = [
    { id: "nt_01", type: "like", message: "A @User_Delta piace il tuo video spaziale!", read: false, time: "Ora" }
];

export function initNotificationsAndAnalytics() {
    console.log("📈 [Analytics Engine] Tracciamento telemetrico attivo.");
    startLiveNotificationSim();
}

function startLiveNotificationSim() {
    setInterval(() => {
        const triggers = [
            { type: "premium", message: "👑 Nuovo utente Premium! +3.00€ nel tuo Caveau." },
            { type: "mention", message: "👽 @Cosmic_Gamer ti ha menzionato nel Club Alpha." }
        ];
        const newNotif = triggers[Math.floor(Math.random() * triggers.length)];
        showFloatingPushBanner(newNotif.message);
    }, 25000);
}

function showFloatingPushBanner(message) {
    const bannerHTML = `
        <div id="live-push-popup" style="position: fixed; top: 15px; left: 15px; right: 15px; background: #1D9BF0; color: #fff; padding: 14px; border-radius: 12px; z-index: 99999;">
            <p style="margin: 0; font-size: 13px;">${message}</p>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', bannerHTML);
    setTimeout(() => document.getElementById("live-push-popup").remove(), 4000);
}

export function refreshNotificationsUI() {
    const container = document.querySelector(".notifications-list");
    if (container) container.innerHTML = `<p>Nessuna nuova notifica.</p>`;
}
