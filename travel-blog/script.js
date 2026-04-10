const destinations = [
    {
        id: "mountains",
        theme: "theme-mountains",
        title: "Majestic Mountains",
        subtitle: "Conquer the highest peaks",
        badge: "Alpine Expedition",
        cta: "Discover Peaks",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
        tabs: [
            { id: "overview", label: "Overview", content: "Experience the thin air and breathtaking horizons of the world's highest peaks. A true test of endurance and spirit. Let the silence of the alpine wilderness restore your sense of wonder and connection with nature.", image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1000&auto=format&fit=crop" },
            { id: "details", label: "Expedition Details", content: "Your journey includes 5 days of guided high-altitude trekking, acclimatization stops, and summit attempts guided by seasoned sherpas. Expect temperatures to dip below freezing at night.", image: "https://images.unsplash.com/photo-1516858178149-74d6cce42813?q=80&w=1000&auto=format&fit=crop" },
            { id: "info", label: "Travel Info", content: "Best time to visit: May through September. Required gear: Crampons, insulated parkas, and a 4-season tent. A high level of physical fitness is required.", image: "https://images.unsplash.com/photo-1531366935537-f6be662b662a?q=80&w=1000&auto=format&fit=crop" }
        ],
        highlights: [
            "Guided Alpine Treks",
            "High-Altitude Camping",
            "Ice Climbing Encounters",
            "Panoramic Helicopter Tours"
        ]
    },
    {
        id: "beaches",
        theme: "theme-beaches",
        title: "Pristine Beaches",
        subtitle: "Endless azure waters",
        badge: "Coastal Paradise",
        cta: "Explore Shores",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
        tabs: [
            { id: "overview", label: "Overview", content: "Relax on the white sands of secluded tropical paradises. Dive into crystal clear waters and discover vibrant marine life. Let the rhythmic crash of the waves wash away your worries in ultimate luxury.", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1000&auto=format&fit=crop" },
            { id: "details", label: "Resort Details", content: "Stay in ultra-luxurious overwater bungalows equipped with glass floors. Enjoy private beach access, 24/7 butler service, and an infinity pool overlooking the ocean.", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop" },
            { id: "info", label: "Travel Info", content: "Best time to visit: November to April for dry weather. Pack light, breathable clothing and reef-safe sunscreen. Visa-on-arrival is available for most countries.", image: "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?q=80&w=1000&auto=format&fit=crop" }
        ],
        highlights: [
            "Deep Sea Scuba Diving",
            "Private Coastal Cabanas",
            "Sunset Yacht Cruises",
            "Coral Reef Snorkeling"
        ]
    },
    {
        id: "cities",
        theme: "theme-cities",
        title: "Vibrant Cities",
        subtitle: "The pulse of civilization",
        badge: "Urban Culture",
        cta: "Enter the City",
        image: "vibrant_cities.png",
        tabs: [
            { id: "overview", label: "Overview", content: "Immerse yourself in the bustling energy of the world's most dynamic urban centers. Culinary delights, historical marvels, and a rich, vibrant culture await at every vibrant city corner.", image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1000&auto=format&fit=crop" },
            { id: "details", label: "Cultural Experience", content: "Explore ancient temples nestled between modern skyscrapers. Join guided culinary tours through neon-lit night markets, and secure VIP access to world-renowned modern art exhibits.", image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1000&auto=format&fit=crop" },
            { id: "info", label: "Travel Info", content: "Best time to visit: Spring and Autumn for moderate climates. Excellent public transit systems available. English is widely spoken in central commercial districts.", image: "https://images.unsplash.com/photo-1525362081669-2b476bb628c3?q=80&w=1000&auto=format&fit=crop" }
        ],
        highlights: [
            "Exclusive Culinary Tours",
            "Historical District Walks",
            "High-Energy Nightlife",
            "Modern Art Galleries"
        ]
    }
];

// Determine random entry
const randomIndex = Math.floor(Math.random() * destinations.length);
const firstDest = destinations.splice(randomIndex, 1)[0];
// Shuffle remaining
destinations.sort(() => Math.random() - 0.5);
const finalDestinations = [firstDest, ...destinations];

// Global State
const state = {
    overlayOpen: false,
    scrollRevealed: false
};

// Initialize DOM
const appContainer = document.getElementById('app-container');

function buildSection(dest, index) {
    const isFirst = index === 0;
    
    const sectionHtml = `
        <section class="app-section ${dest.theme} ${isFirst ? 'visible-section first-load' : 'hidden-section inactive'}" data-index="${index}">
            <div class="section-container">
                <div class="section-card">
                    <div class="section-card-inner">
                        <div class="parallax-bg" style="background-image: url('${dest.image}');"></div>
                        <div class="gradient-overlay"></div>
                        <div class="slide-badge">${dest.badge}</div>
                        <div class="content">
                            <h2>${dest.title}</h2>
                            <p>${dest.subtitle}</p>
                            <div class="content-cta">&#x25B6;&nbsp; ${dest.cta}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section-divider-glow"></div>
        </section>
    `;
    appContainer.insertAdjacentHTML('beforeend', sectionHtml);
}

// Build all sections
finalDestinations.forEach((dest, idx) => {
    const isFirst = idx === 0;
    const bgHtml = `<div class="bg-layer ${isFirst ? 'active' : ''}" id="main-bg-${idx}" style="background-image: url('${dest.image}');"></div>`;
    document.getElementById('cinematic-bg').insertAdjacentHTML('afterbegin', bgHtml);
    buildSection(dest, idx);
});


// --- LERP PARALLAX AND ANIMATION SYSTEM ---
// Cache DOM nodes array for massive performance gains
const sectionsNodes = Array.from(document.querySelectorAll('.app-section'));
const cards = sectionsNodes.map(sec => sec.querySelector('.section-card'));
const bgs = sectionsNodes.map(sec => sec.querySelector('.parallax-bg'));
const inners = sectionsNodes.map(sec => sec.querySelector('.section-card-inner'));
const contents = sectionsNodes.map(sec => sec.querySelector('.content'));

// Maintain independent LERP targets
const lerpData = sectionsNodes.map((_, i) => ({
    bgOffset: 0,
    rotX: i === 0 ? 0 : 15,
    scale: i === 0 ? 0.95 : 0.85,
    transY: i === 0 ? 40 : 100,
    opacity: i === 0 ? 0 : 0
}));

// Utility to limit values
function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}


// Active / Inactive states based on viewport center (Triggers Blur & Hierarchy)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5  // Element is active if at least 50% is visible
};

const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const card = entry.target.querySelector('.section-card');
        if (entry.isIntersecting) {
            card.classList.remove('blurred');
        } else {
            card.classList.add('blurred');
        }
    });
}, observerOptions);

sectionsNodes.forEach(sec => intersectionObserver.observe(sec));


// Advanced Reveal Logic (Fade remaining sections natively)
window.addEventListener('scroll', () => {
    if (!state.scrollRevealed && window.scrollY > window.innerHeight * 0.2) {
        state.scrollRevealed = true;
        sectionsNodes.forEach((sec, idx) => {
            if (idx > 0) {
                setTimeout(() => {
                    sec.classList.remove('hidden-section');
                    sec.classList.add('visible-section');
                }, idx * 250);
            }
        });
    }
}, { passive: true });


// Core Engine Loop
function render() {
    if (!state.overlayOpen) {
        const vh = window.innerHeight;

        sectionsNodes.forEach((sec, i) => {
            // Get instantaneous true DOM rect positions (as affected by native scroll-snap)
            const rect = sec.getBoundingClientRect();
            
            // Measure distance from the exact center of screen
            const sectionCenter = rect.top + (rect.height / 2);
            const viewportCenter = vh / 2;
            const distFromCenter = sectionCenter - viewportCenter;
            
            // Normalized distance (-1 above screen, 0 center, 1 below screen)
            const nDist = clamp(distFromCenter / vh, -1, 1);
            
            // Dynamic Background Switching Logic
            if (Math.abs(nDist) < 0.35) {
                document.querySelectorAll('.bg-layer').forEach(layer => layer.classList.remove('active'));
                const activeLayer = document.getElementById(`main-bg-${i}`);
                if (activeLayer) activeLayer.classList.add('active');
            }
            
            // Targets for Parallax
            const targetBgOffset = distFromCenter * 0.2; 
            
            // Targets for 3D cinematic depth
            const activeThreshold = 1 - Math.abs(nDist); // 1 when center, 0 when far
            
            // Scale peaks at 1 in center, drops gently when scrolling away
            const targetScale = clamp(0.9 + (0.1 * activeThreshold), 0.8, 1);
            
            // Rotates purely based on up/down positioning (-10 to +10 range is subtle but cinematic)
            const targetRotX = clamp(nDist * 12, -15, 15);
            
            // Positional offset to give weight to scroll
            const targetTransY = nDist * 50; 
            
            // Start fading out when pushed too far out
            const targetOp = clamp(activeThreshold * 1.5, 0, 1);

            // Interpolate values using smoothing factor
            const sd = lerpData[i];
            const LERP_SPEED = 0.08;
            
            sd.bgOffset += (targetBgOffset - sd.bgOffset) * LERP_SPEED;
            sd.scale += (targetScale - sd.scale) * LERP_SPEED;
            sd.rotX += (targetRotX - sd.rotX) * LERP_SPEED;
            sd.transY += (targetTransY - sd.transY) * LERP_SPEED;
            
            // Only control opacity manually for First Load
            // Since CSS transition handles reveal opacity for idx > 0, we only lerp opacity for idx=0 initially
            if(i === 0 && !state.scrollRevealed) {
                sd.opacity += (1 - sd.opacity) * (LERP_SPEED * 0.5); 
            } else {
                sd.opacity = targetOp; 
            }

            // Apply specific GPU accelerated styles directly
            if(bgs[i]) {
                bgs[i].style.transform = `translateY(${sd.bgOffset}px) scale(1.15)`;
            }
            
            if(cards[i]) {
                // If the section hasn't been revealed, let the CSS hide it via .hidden-section
                if (sec.classList.contains('hidden-section')) return;

                cards[i].style.transform = `perspective(2000px) rotateX(${sd.rotX}deg) scale(${sd.scale}) translateY(${sd.transY}px)`;
                
                // Allow CSS 'visible-section' class to fade naturally, but apply LERP constraint if needed
                if(i === 0 && !state.scrollRevealed) {
                    cards[i].style.opacity = sd.opacity;
                }
            }
        });
    }
    requestAnimationFrame(render);
}
// Start smooth render loop
requestAnimationFrame(render);


// --- MICRO-INTERACTIONS: 3D HOVER TILT & DEPTH ---
sectionsNodes.forEach((sec, idx) => {
    const card = cards[idx];
    const inner = inners[idx];
    const content = contents[idx];

    card.addEventListener('mousemove', (e) => {
        if (state.overlayOpen) return;
        
        const rect = card.getBoundingClientRect();
        const xNorm = ((e.clientX - rect.left) / rect.width) - 0.5;
        const yNorm = ((e.clientY - rect.top) / rect.height) - 0.5;
        
        // Tilt Effect
        const rotateX = -yNorm * 8; 
        const rotateY = xNorm * 8;
        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        // Depth Parallax for content on hover
        content.style.transform = `translateZ(60px) translateX(${xNorm * -15}px) translateY(${yNorm * -15}px)`;
    });

    card.addEventListener('mouseleave', () => {
        inner.style.transform = `rotateX(0deg) rotateY(0deg)`;
        content.style.transform = `translateZ(60px) translateX(0) translateY(0)`; // Return to baseline 3d state
    });

    // --- CLICK TO EXPAND ---
    sec.addEventListener('click', () => {
        const destination = finalDestinations[idx];
        openOverlay(destination);
    });
});


// --- DYNAMIC OVERLAY SYSTEM ---
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('close-btn');

function openOverlay(data) {
    state.overlayOpen = true;
    document.body.style.overflow = 'hidden'; 

    document.getElementById('overlay-img').src = data.image;
    document.getElementById('overlay-title').innerText = data.title;
    
    // Setup Tabs
    const tabsHeader = document.getElementById('overlay-tabs-header');
    const tabsContent = document.getElementById('overlay-tabs-content');
    tabsHeader.innerHTML = '';
    tabsContent.innerHTML = '';

    data.tabs.forEach((tab, index) => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${index === 0 ? 'active' : ''}`;
        btn.innerText = tab.label;
        btn.dataset.target = `tab-${tab.id}`;
        
        const panel = document.createElement('div');
        panel.className = `tab-panel ${index === 0 ? 'active' : ''}`;
        panel.id = `tab-${tab.id}`;
        panel.innerHTML = `<div class="tab-img-wrap"><img src="${tab.image}" class="tab-inline-img" alt="${tab.label}"></div><p>${tab.content}</p>`;

        btn.addEventListener('click', () => {
            tabsHeader.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tabsContent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            panel.classList.add('active');
        });

        tabsHeader.appendChild(btn);
        tabsContent.appendChild(panel);
    });
    
    // Inject Highlights
    const ul = document.getElementById('overlay-highlights');
    ul.innerHTML = '';
    data.highlights.forEach(h => {
        const li = document.createElement('li');
        li.innerText = h;
        ul.appendChild(li);
    });

    // Activate Overlay
    overlay.classList.remove('hidden');
    void overlay.offsetWidth; // Force Reflow
    overlay.classList.add('active');
}

closeBtn.addEventListener('click', () => {
    state.overlayOpen = false;
    overlay.classList.remove('active');
    
    setTimeout(() => {
        document.body.style.overflow = '';
    }, 600);
});
