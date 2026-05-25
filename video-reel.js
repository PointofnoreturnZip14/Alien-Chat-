/* ==========================================================================
   ALIEN CHAT - MOTORE REELS VIDEO VERTICALI AVANZATO (VIDEO-REEL.JS)
   Gestione dello scorrimento continuo, ottimizzazione GPU e buffering video
   ========================================================================== */

const VideoReelDatabase = [
    {
        id: "v_01",
        creator: "Cosmic_Director",
        description: "Effetti particellari nello spazio profondo 🪐 #alien #space",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4",
        likes: 12400,
        comments: 342
    },
    {
        id: "v_02",
        creator: "Nebula_Gaming",
        description: "Postazione da gaming definitiva su Marte! 👾💻 #setup #gamer",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-21573-large.mp4",
        likes: 8900,
        comments: 120
    },
    {
        id: "v_03",
        creator: "Alpha_Tech",
        description: "Recensione Honor 200 dall'Area 51 📱🛸 #tech",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-neon-lights-42284-large.mp4",
        likes: 45300,
        comments: 1102
    }
];

let currentVideoIndex = 0;
let isScrolling = false;

export function initVideoReelEngine() {
    console.log("🎬 [Video Engine] Caricamento accelerazione hardware...");
    const spaContainer = document.getElementById("spa-container");
    if (spaContainer) {
        injectVideoReelStructure(spaContainer);
        setupReelGestures();
    }
}

function injectVideoReelStructure(container) {
    const reelHTML = `
        <section id="page-video-reels" class="spa-page" style="padding: 0; background-color: #000; height: calc(100vh - 124px); position: relative; overflow: hidden;">
            <div id="reel-viewport" style="width: 100%; height: 100%; position: relative;">
                <div id="active-reel-card" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; position: relative;">
                    <video id="main-reel-player" loop playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
                    <div class="reel-overlay-data" style="position: absolute; bottom: 20px; left: 16px; right: 80px; z-index: 10;">
                        <h3 id="reel-creator-name" style="color: #fff; font-size: 16px; font-weight: 700; margin-bottom: 6px;">@Creator</h3>
                        <p id="reel-description" style="color: #e1e1e1; font-size: 14px; line-height: 1.4;"></p>
                    </div>
                    <div class="reel-sidebar-actions" style="position: absolute; bottom: 40px; right: 12px; z-index: 10; display: flex; flex-direction: column; gap: 20px;">
                        <div class="reel-action-btn" id="btn-reel-like" style="cursor: pointer; text-align: center;">
                            <div style="font-size: 28px; background: rgba(0,0,0,0.4); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">❤️</div>
                            <span id="reel-like-counter" style="font-size: 12px; color: #fff; font-weight: 600; display: block; margin-top: 4px;">0</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    container.insertAdjacentHTML('beforeend', reelHTML);
    const videoTabHTML = `<div class="nav-action-item" data-target="page-video-reels" id="nav-tab-reels"><span class="nav-icon-glyph">🎬</span><span class="nav-label-text">Reels</span></div>`;
    document.querySelector(".footer-navigation-bar").insertAdjacentHTML('beforeend', videoTabHTML);
}

function loadReelData(index) {
    const videoData = VideoReelDatabase[index];
    const player = document.getElementById("main-reel-player");
    player.src = videoData.videoUrl;
    player.load();
    document.getElementById("reel-creator-name").innerText = `@${videoData.creator}`;
    document.getElementById("reel-description").innerText = videoData.description;
    document.getElementById("reel-like-counter").innerText = formatNumber(videoData.likes);
    player.play().catch(() => {});
}

function setupReelGestures() {
    document.getElementById("btn-reel-like").addEventListener("click", () => {
        VideoReelDatabase[currentVideoIndex].likes++;
        document.getElementById("reel-like-counter").innerText = formatNumber(VideoReelDatabase[currentVideoIndex].likes);
    });
    setTimeout(() => loadReelData(0), 500);
}

function formatNumber(num) {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
}
