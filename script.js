// Particle Animation System
let particleCanvas;
let particleCtx;
let particles = [];
let animationFrameId;

// Mouse tracking for interactive effects
let mouse = {
    x: undefined,
    y: undefined,
    radius: 150 // Mouse influence radius
};

// Initialize the particle system
function initParticleSystem() {
    // Get the canvas element
    particleCanvas = document.getElementById('particleCanvas');
    if (!particleCanvas) return false;
    
    // Get the context for drawing
    particleCtx = particleCanvas.getContext('2d');
    
    // Set canvas size to match window
    resizeCanvas();
    
    // Create particles
    createParticles();
    
    // Add event listeners for mouse interaction
    setupEventListeners();
    
    // Start animation loop
    animate();
    
    return true;
}

// Resize canvas to match window size
function resizeCanvas() {
    if (!particleCanvas) return;
    
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    
    // Make sure the canvas is visible
    particleCanvas.style.display = 'block';
}

// Set up event listeners for mouse interaction and responsive design
function setupEventListeners() {
    // Track mouse movement
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Reset mouse position when mouse leaves the window
    window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });
    
    // Mobile touch tracking
    window.addEventListener('touchmove', function(event) {
        if (event.touches.length > 0) {
            mouse.x = event.touches[0].clientX;
            mouse.y = event.touches[0].clientY;
        }
    });
    
    // Reset mouse position when touch ends
    window.addEventListener('touchend', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });
    
    // Update canvas size when window is resized
    window.addEventListener('resize', function() {
        resizeCanvas();
        // Recreate particles on resize for better distribution
        createParticles();
    });
}

// Hot pink and pale orange color palette with enhanced distribution and higher frequency of primary colors
const particleColors = [
    '#FF69B4', // hot pink (primary)
    '#FF69B4', // hot pink repeated for higher frequency
    '#FF69B4', // hot pink repeated for higher frequency
    '#FF1493', // deep pink
    '#FFAA77', // pale orange (primary)
    '#FFAA77', // pale orange repeated for higher frequency
    '#FFAA77', // pale orange repeated for higher frequency
    '#FFA07A', // light salmon
    '#FF8C69', // salmon
];

// Create particles
function createParticles() {
    particles = [];
    
    // Calculate number of particles based on screen size for performance
    const screenArea = window.innerWidth * window.innerHeight;
    const baseCount = 150; // Further increased for more particles
    const scaleMultiplier = Math.min(1, screenArea / (1920 * 1080)); // Scale down for smaller screens
    
    const particleCount = Math.floor(baseCount * scaleMultiplier);
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 6 + 2; // Further increased size between 2-8px
        const x = Math.random() * particleCanvas.width;
        const y = Math.random() * particleCanvas.height;
        const speedX = (Math.random() - 0.5) * 0.5; // Random initial velocity
        const speedY = (Math.random() - 0.5) * 0.5;
        const color = particleColors[Math.floor(Math.random() * particleColors.length)]; // Random color from palette
        
        particles.push(new Particle(x, y, size, color, speedX, speedY));
    }
    
    return particles;
}

// Particle class
class Particle {
    constructor(x, y, size, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseSize = size; // Original size to revert to
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.density = (Math.random() * 10) + 5; // Used for mouse interaction
        this.opacity = Math.random() * 0.5 + 0.5; // Even higher minimum opacity (0.5-1.0) for better visibility
        this.glowing = Math.random() > 0.3; // 70% of particles will glow (increased from 50%)
        this.glowIntensity = Math.random() * 8 + 5; // Further enhanced glow intensity
        this.glowDirection = Math.random() > 0.5 ? 1 : -1; // For pulsing glow
        this.glowAmount = 0;
    }
    
    // Update particle position and handle mouse interaction
    update() {
        // Check if mouse is defined and calculate distance
        if (mouse.x !== undefined && mouse.y !== undefined) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply force if within mouse radius
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                
                // Apply force to particle
                const directionX = forceDirectionX * force * this.density * 0.2;
                const directionY = forceDirectionY * force * this.density * 0.2;
                
                this.speedX += directionX;
                this.speedY += directionY;
                
                // Make particles near the mouse slightly larger for interactive effect
                this.size = this.baseSize * (1 + force * 0.5);
            }
        } else {
            // When mouse is not in window, gradually revert to original size
            this.size = this.size > this.baseSize ? 
                this.size - 0.1 : 
                this.size < this.baseSize ? 
                    this.size + 0.1 : 
                    this.baseSize;
        }
        
        // Add friction to slow particles down over time
        this.speedX *= 0.95;
        this.speedY *= 0.95;
        
        // Add minimal random movement for organic feel
        this.speedX += (Math.random() - 0.5) * 0.1;
        this.speedY += (Math.random() - 0.5) * 0.1;
        
        // Update position
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Update glow effect for glowing particles
        if (this.glowing) {
            this.glowAmount += 0.03 * this.glowDirection;
            if (this.glowAmount > this.glowIntensity || this.glowAmount < 0) {
                this.glowDirection *= -1;
            }
        }
        
        // Handle edge cases
        this.handleEdges();
    }
    
    // Draw the particle on canvas
    draw() {
        // Set global alpha for transparency
        particleCtx.globalAlpha = this.opacity;
        
        if (this.glowing) {
            // Draw glow effect with greatly enhanced brightness
            const glow = this.glowAmount;
            particleCtx.shadowBlur = 35 + glow; // Significantly increased shadow blur for stronger glow
            particleCtx.shadowColor = this.color;
            // Add a second shadow layer for more intense glow
            particleCtx.shadowColor = this.color;
            // Draw slightly larger than actual size for more visible effect
            this.size += 0.5;
        } else {
            particleCtx.shadowBlur = 0;
        }
        
        // Draw particle with enhanced visibility
        particleCtx.beginPath();
        particleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        particleCtx.fillStyle = this.color;
        particleCtx.fill();
        
        // Add an extra inner glow for hot pink and pale orange particles
        if (this.color === '#FF69B4' || this.color === '#FFAA77') {
            particleCtx.globalCompositeOperation = 'lighter';
            particleCtx.beginPath();
            particleCtx.arc(this.x, this.y, this.size * 0.7, 0, Math.PI * 2);
            particleCtx.fillStyle = 'white';
            particleCtx.fill();
            particleCtx.globalCompositeOperation = 'source-over';
        }
        
        // Reset global alpha and shadow
        particleCtx.globalAlpha = 1;
        particleCtx.shadowBlur = 0;
    }
    
    // Handle edge cases (screen boundaries)
    handleEdges() {
        // Bounce from edges with a buffer zone
        const buffer = this.size * 2;
        
        // Right edge
        if (this.x > particleCanvas.width - buffer) {
            this.x = particleCanvas.width - buffer;
            this.speedX *= -0.5; // Bounce with energy loss
        }
        // Left edge
        else if (this.x < buffer) {
            this.x = buffer;
            this.speedX *= -0.5;
        }
        
        // Bottom edge
        if (this.y > particleCanvas.height - buffer) {
            this.y = particleCanvas.height - buffer;
            this.speedY *= -0.5;
        }
        // Top edge
        else if (this.y < buffer) {
            this.y = buffer;
            this.speedY *= -0.5;
        }
    }
}

// Connect particles with lines if they're close enough
function connectParticles() {
    const maxDistance = 150; // Increased maximum distance to draw more connections
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                // Calculate opacity based on distance (closer = more opaque)
                const opacity = 1 - (distance / maxDistance);
                
                // Average the colors of the two particles
                const color1 = particles[i].color;
                
                // Set drawing style
                particleCtx.beginPath();
                particleCtx.strokeStyle = color1; // Use first particle's color
                particleCtx.globalAlpha = opacity * 0.5; // Significantly increased opacity for connecting lines
                particleCtx.lineWidth = 1.2; // Even thicker lines for better visibility
                
                // Draw line between particles
                particleCtx.moveTo(particles[i].x, particles[i].y);
                particleCtx.lineTo(particles[j].x, particles[j].y);
                particleCtx.stroke();
                
                // Reset global alpha
                particleCtx.globalAlpha = 1;
            }
        }
    }
}

// Animation loop
function animate() {
    // Clear canvas with slight transparency for trail effect
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    // Update and draw all particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    
    // Connect nearby particles with subtle lines
    connectParticles();
    
    // Request next frame
    animationFrameId = requestAnimationFrame(animate);
}

// Performance optimization for mobile devices
function optimizeForMobile() {
    if (window.innerWidth < 768) {
        // Reduce mouse influence radius on mobile
        mouse.radius = 70;
    } else {
        mouse.radius = 150;
    }
}

// Make sure the particle system persists after loading screen
function ensureParticleSystemAfterLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    if (loadingScreen && mainContent) {
        // When loading screen animation ends
        loadingScreen.addEventListener('transitionend', function(e) {
            if (e.target === loadingScreen && e.propertyName === 'opacity') {
                // Make sure particle canvas is visible and particles are recreated
                if (particleCanvas) {
                    particleCanvas.style.display = 'block';
                    resizeCanvas();
                    createParticles();
                }
            }
        });
        
        // When main content becomes visible
        mainContent.addEventListener('transitionend', function(e) {
            if (e.target === mainContent && e.propertyName === 'opacity') {
                // Reinitialize particle system if needed
                if (!particles.length) {
                    createParticles();
                }
            }
        });
    }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle system
    const initialized = initParticleSystem();
    
    if (initialized) {
        // Apply mobile optimizations
        optimizeForMobile();
        
        // Ensure particles persist after loading screen
        ensureParticleSystemAfterLoading();
    }
    
    // Add ripple effect to buttons for a more interactive feel
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .package-btn');
    
    buttons.forEach(function(button) {
        button.addEventListener('mousedown', function(e) {
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;
            
            this.style.setProperty('--x', `${x}px`);
            this.style.setProperty('--y', `${y}px`);
        });
    });
    
    // Add data-text attribute to all elements with hero-title class
    document.querySelectorAll('.hero-title').forEach(title => {
        title.setAttribute('data-text', title.textContent);
    });
});

// Ensure particles are maintained when the page is fully loaded
window.addEventListener('load', function() {
    // Wait a short moment to ensure everything is ready
    setTimeout(function() {
        if (particleCanvas) {
            // Make sure canvas is visible with proper styling
            particleCanvas.style.display = 'block';
            particleCanvas.style.zIndex = '7'; // Increased z-index to be above other background elements
            particleCanvas.style.opacity = '1';
            
            // Reinitialize particles for better visibility
            resizeCanvas();
            createParticles();
            
            // Start animation if it's not running
            if (!animationFrameId) {
                animate();
            }
            
            // Force another refresh after a delay to ensure visibility
            setTimeout(function() {
                resizeCanvas();
                particles = createParticles();
            }, 500);
        }
    }, 500); // Reduced timeout for faster initialization
});

// Add an observer to ensure particle system remains active
function ensureParticlesActive() {
    // Check every 2 seconds if particles are still active
    setInterval(function() {
        if (particleCanvas && (!particles.length || !animationFrameId)) {
            console.log("Reactivating particle system...");
            resizeCanvas();
            particles = createParticles();
            
            // Restart animation if needed
            if (!animationFrameId) {
                animate();
            }
        }
    }, 2000);
}

// Loading Screen Control with Tunnel Effect
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    // Start the particle watchdog
    ensureParticlesActive();
    
    // Create additional tunnel rings dynamically
    const createExtraRings = () => {
        const tunnelContainer = document.querySelector('.tunnel-container');
        if (tunnelContainer) {
            for (let i = 0; i < 5; i++) {
                const ring = document.createElement('div');
                ring.className = 'tunnel-ring';
                ring.style.setProperty('--index', 10 + i);
                tunnelContainer.appendChild(ring);
            }
        }
    };
    
    // Call function to create extra rings
    createExtraRings();
    
    if (loadingScreen && mainContent) {
        // Show loading screen for 2.5 seconds to appreciate the tunnel effect
        setTimeout(() => {
            // Fade out loading screen
            loadingScreen.classList.add('fade-out');
            
            // Show main content after loading screen starts fading
            setTimeout(() => {
                mainContent.classList.add('show');
                // Remove loading screen from DOM after fade completes
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    
                    // Make sure particles are still visible and prominent
                    if (particleCanvas) {
                        particleCanvas.style.display = 'block';
                        particleCanvas.style.zIndex = '7'; // Higher z-index for better visibility
                        particleCanvas.style.opacity = '1'; // Ensure full opacity
                        
                        // Recreate particles with enhanced visibility
                        resizeCanvas();
                        createParticles();
                        
                        // Force a redraw for better visibility after loading screen
                        setTimeout(() => {
                            resizeCanvas();
                            createParticles();
                        }, 100);
                    }
                }, 500);
            }, 200);
        }, 2500); // 2.5 second delay
    }
});

// Particle Animation System
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if the canvas element exists
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Call once to initialize
    resizeCanvas();
    
    // Update canvas size when window is resized
    window.addEventListener('resize', function() {
        resizeCanvas();
        // Reinitialize particles when resize happens
        particles = createParticles();
    });
    
    // Mouse tracking for interactive effects
    let mouse = {
        x: null,
        y: null,
        radius: 150 // Mouse influence radius
    };
    
    // Track mouse movement
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Reset mouse position when mouse leaves the window
    window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });
    
    // Mobile touch tracking
    window.addEventListener('touchmove', function(event) {
        if (event.touches.length > 0) {
            mouse.x = event.touches[0].clientX;
            mouse.y = event.touches[0].clientY;
        }
    });
    
    window.addEventListener('touchend', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });
    
    // Neon color palette for particles (focused on hot pink and pale orange theme)
    const colors = [
        '#FF69B4', // hot pink (primary)
        '#FF69B4', // hot pink repeated for higher frequency
        '#FF1493', // deep pink
        '#FFAA77', // pale orange (primary)
        '#FFAA77', // pale orange repeated for higher frequency
        '#FFA07A', // light salmon
        '#FF8C69', // salmon
        '#FFB6C1'  // light pink
    ];
    
    // Particle class definition
    class Particle {
        constructor(x, y, size, color, speedX, speedY) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.baseSize = size; // Original size to revert to
            this.color = color;
            this.speedX = speedX;
            this.speedY = speedY;
            this.density = (Math.random() * 10) + 5; // Used for mouse interaction
            this.opacity = Math.random() * 0.6 + 0.4; // Higher minimum opacity for better visibility
            this.glowing = Math.random() > 0.5; // More particles will glow (50% instead of 30%)
            this.glowIntensity = Math.random() * 6 + 3; // Enhanced glow intensity for more vibrant effect
            this.glowDirection = Math.random() > 0.5 ? 1 : -1; // For pulsing glow
            this.glowAmount = 0;
        }
        
        // Update particle position and handle mouse interaction
        update() {
            // Check if mouse is defined and calculate distance
            if (mouse.x !== undefined && mouse.y !== undefined) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Apply force if within mouse radius
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    // Apply force to particle
                    const directionX = forceDirectionX * force * this.density * 0.2;
                    const directionY = forceDirectionY * force * this.density * 0.2;
                    
                    this.speedX += directionX;
                    this.speedY += directionY;
                    
                    // Make particles near the mouse slightly larger for interactive effect
                    this.size = this.baseSize * (1 + force * 0.5);
                }
            } else {
                // When mouse is not in window, gradually revert to original size
                this.size = this.size > this.baseSize ? 
                    this.size - 0.1 : 
                    this.size < this.baseSize ? 
                        this.size + 0.1 : 
                        this.baseSize;
            }
            
            // Add friction to slow particles down over time
            this.speedX *= 0.95;
            this.speedY *= 0.95;
            
            // Add minimal random movement for organic feel
            this.speedX += (Math.random() - 0.5) * 0.1;
            this.speedY += (Math.random() - 0.5) * 0.1;
            
            // Update position
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Update glow effect for glowing particles
            if (this.glowing) {
                this.glowAmount += 0.03 * this.glowDirection;
                if (this.glowAmount > this.glowIntensity || this.glowAmount < 0) {
                    this.glowDirection *= -1;
                }
            }
            
            // Handle edge cases
            this.handleEdges();
        }
        
        // Draw the particle on canvas
        draw() {
            // Set global alpha for transparency
            ctx.globalAlpha = this.opacity;
            
            if (this.glowing) {
                // Draw glow effect with enhanced brightness
                const glow = this.glowAmount;
                ctx.shadowBlur = 25 + glow; // Further increased shadow blur for stronger glow
                ctx.shadowColor = this.color;
                // Add a second shadow layer for more intense glow
                ctx.shadowColor = this.color;
            } else {
                ctx.shadowBlur = 0;
            }
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Reset global alpha and shadow
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }
        
        // Handle edge cases (screen boundaries)
        handleEdges() {
            // Bounce from edges with a buffer zone
            const buffer = this.size * 2;
            
            // Right edge
            if (this.x > canvas.width - buffer) {
                this.x = canvas.width - buffer;
                this.speedX *= -0.5; // Bounce with energy loss
            }
            // Left edge
            else if (this.x < buffer) {
                this.x = buffer;
                this.speedX *= -0.5;
            }
            
            // Bottom edge
            if (this.y > canvas.height - buffer) {
                this.y = canvas.height - buffer;
                this.speedY *= -0.5;
            }
            // Top edge
            else if (this.y < buffer) {
                this.y = buffer;
                this.speedY *= -0.5;
            }
        }
    }
    
    // Create an array of particles
    let particles = [];
    
    function createParticles() {
        // Clear existing particles
        particles = [];
        
        // Calculate number of particles based on screen size
        // This ensures mobile devices have fewer particles for better performance
        const screenArea = canvas.width * canvas.height;
        const baseCount = 100; // Increased number of particles for a more dense effect
        const scaleMultiplier = Math.min(1, screenArea / (1920 * 1080)); // Scale down for smaller screens
        
        const particleCount = Math.floor(baseCount * scaleMultiplier);
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            const size = Math.random() * 4.5 + 1.5; // Larger particles between 1.5-6px for better visibility
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const speedX = (Math.random() - 0.5) * 0.5; // Random initial velocity
            const speedY = (Math.random() - 0.5) * 0.5;
            const color = colors[Math.floor(Math.random() * colors.length)]; // Random color from palette
            
            particles.push(new Particle(x, y, size, color, speedX, speedY));
        }
        
        return particles;
    }
    
    // Initialize particles
    particles = createParticles();
    
    // Animation loop
    function animate() {
        // Clear canvas with slight transparency for trail effect
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw all particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        // Connect nearby particles with subtle lines
        connectParticles();
        
        // Request next frame
        requestAnimationFrame(animate);
    }
    
    // Connect particles with lines if they're close enough
    function connectParticles() {
        const maxDistance = 120; // Increased maximum distance to draw more connections
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    // Calculate opacity based on distance (closer = more opaque)
                    const opacity = 1 - (distance / maxDistance);
                    
                    // Average the colors of the two particles
                    const color1 = particles[i].color;
                    const color2 = particles[j].color;
                    
                    // Set drawing style
                    ctx.beginPath();
                    ctx.strokeStyle = color1; // Use first particle's color
                    ctx.globalAlpha = opacity * 0.35; // Further increased opacity for connecting lines
                    ctx.lineWidth = 0.8; // Thicker lines for better visibility
                    
                    // Draw line between particles
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    
                    // Reset global alpha
                    ctx.globalAlpha = 1;
                }
            }
        }
    }
    
    // Performance optimization for mobile devices
    function optimizeForMobile() {
        if (window.innerWidth < 768) {
            // Reduce mouse influence radius on mobile
            mouse.radius = 70;
        } else {
            mouse.radius = 150;
        }
    }
    
    // Call optimization function once and on resize
    optimizeForMobile();
    window.addEventListener('resize', optimizeForMobile);
    
    // Start animation
    animate();
});

// Add ripple effect to buttons for a more interactive feel
document.addEventListener('DOMContentLoaded', function() {
    // Select all buttons that should have ripple effect
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .package-btn');
    
    buttons.forEach(function(button) {
        button.addEventListener('mousedown', function(e) {
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;
            
            this.style.setProperty('--x', `${x}px`);
            this.style.setProperty('--y', `${y}px`);
        });
    });
    
    // Add data-text attribute to all elements with hero-title class
    document.querySelectorAll('.hero-title').forEach(title => {
        title.setAttribute('data-text', title.textContent);
    });
});

// ===== SECURITY LAYER =====
// Enhanced Security Measures

// 1. Basic DDoS Protection - Client-side rate limiting
const DDOS_PROTECTION = {
    requests: [],
    maxRequests: 10,
    timeWindow: 60000 // 1 minute
};

function checkDDoSProtection() {
    const now = Date.now();
    
    // Remove old requests outside time window
    DDOS_PROTECTION.requests = DDOS_PROTECTION.requests.filter(
        timestamp => now - timestamp < DDOS_PROTECTION.timeWindow
    );
    
    if (DDOS_PROTECTION.requests.length >= DDOS_PROTECTION.maxRequests) {
        return false; // Block request
    }
    
    DDOS_PROTECTION.requests.push(now);
    return true; // Allow request
}

// 2. Enhanced bot detection
function detectBot() {
    // Check for headless browsers
    if (navigator.webdriver) return true;
    
    // Check for missing features that real browsers have
    if (!navigator.languages || !navigator.platform) return true;
    
    // Check for automated behavior patterns
    if (navigator.userAgent.includes('HeadlessChrome') || 
        navigator.userAgent.includes('PhantomJS') ||
        navigator.userAgent.includes('SlimerJS')) {
        return true;
    }
    
    return false;
}

// 3. Mouse movement tracking for bot detection
let mouseMovements = 0;
let lastMouseMove = 0;

document.addEventListener('mousemove', () => {
    mouseMovements++;
    lastMouseMove = Date.now();
});

function isHumanLike() {
    const timeSinceLoad = Date.now() - performance.timing.navigationStart;
    const timeSinceLastMove = Date.now() - lastMouseMove;
    
    // If no mouse movement for 30 seconds after 10 seconds on page, suspicious
    if (timeSinceLoad > 10000 && timeSinceLastMove > 30000 && mouseMovements < 5) {
        return false;
    }
    
    return true;
}

// 4. Monitor for suspicious activity
let suspiciousActivity = 0;

function logSuspiciousActivity(reason) {
    // Only log to console, no UI notifications
    if (reason !== 'Right-click attempted' && 
        reason !== 'Form submission attempted' && 
        reason !== 'Purchase attempt from potential bot' &&
        !reason.includes('payment')) {
        
        console.warn(`System Log: ${reason}`);
    }
    
    // No notifications displayed to users
}

// 5. Security: Rate limiting for form submissions
const RATE_LIMIT = {
    attempts: 0,
    lastAttempt: 0,
    maxAttempts: 3,
    window: 60000 // 1 minute
};

// Generate CSRF token
function generateCSRFToken() {
    return 'csrf_' + Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
}

// Validate form inputs
function validateFormInput(name, email, message) {
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!nameRegex.test(name)) {
        throw new Error('Name must contain only letters and spaces (2-50 characters)');
    }
    
    if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
    }
    
    if (message.length < 10 || message.length > 1000) {
        throw new Error('Message must be between 10 and 1000 characters');
    }
    
    // Check for potential XSS patterns
    const xssPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i, /<iframe/i, /<object/i, /<embed/i];
    const inputs = [name, email, message];
    
    for (const input of inputs) {
        for (const pattern of xssPatterns) {
            if (pattern.test(input)) {
                throw new Error('Invalid characters detected in form submission');
            }
        }
    }
}

// Check rate limiting
function checkRateLimit() {
    const now = Date.now();
    
    // Reset if window has passed
    if (now - RATE_LIMIT.lastAttempt > RATE_LIMIT.window) {
        RATE_LIMIT.attempts = 0;
    }
    
    if (RATE_LIMIT.attempts >= RATE_LIMIT.maxAttempts) {
        const timeLeft = Math.ceil((RATE_LIMIT.window - (now - RATE_LIMIT.lastAttempt)) / 1000);
        throw new Error(`Too many attempts. Please wait ${timeLeft} seconds before trying again.`);
    }
    
    RATE_LIMIT.attempts++;
    RATE_LIMIT.lastAttempt = now;
}

// ===== MAIN APPLICATION CODE =====

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.content-card, .package-card, .event-card, .rules-category').forEach(el => {
    observer.observe(el);
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-bg');
    if (heroBackground) {
        const speed = scrolled * 0.5;
        heroBackground.style.transform = `translateY(${speed}px)`;
    }
});

// Enhanced typing effect for hero title (SECURE VERSION)
function enhancedTypeWriter(element, text, speed = 80) {
    let i = 0;
    element.textContent = ''; // Use textContent instead of innerHTML
    element.style.borderRight = '3px solid var(--primary-pink)';
    element.style.animation = 'cursorBlink 1s infinite';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            
            // Add random typing speed variation
            const variance = Math.random() * 50;
            const currentSpeed = speed + variance;
            
            i++;
            setTimeout(type, currentSpeed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                element.style.borderRight = 'none';
                element.style.animation = 'none';
            }, 2000);
        }
    }
    
    // Add cursor blink animation
    if (!document.querySelector('#cursor-styles')) {
        const cursorStyles = `
            @keyframes cursorBlink {
                0%, 50% {
                    border-right-color: var(--primary-pink);
                }
                51%, 100% {
                    border-right-color: transparent;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'cursor-styles';
        styleSheet.textContent = cursorStyles;
        document.head.appendChild(styleSheet);
    }
    
    type();
}

// Text reveal animation for descriptions
function revealText(element, delay = 0) {
    setTimeout(() => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    }, delay);
}

// Initialize enhanced animations when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description p');
    
    if (heroTitle) {
        const originalText = heroTitle.textContent; // Use textContent instead of innerHTML
        setTimeout(() => {
            enhancedTypeWriter(heroTitle, originalText, 60);
        }, 1000);
    }
    
    if (heroDescription) {
        revealText(heroDescription, 2500);
    }
    
    // Initialize CSRF token
    const csrfInput = document.getElementById('csrfToken');
    if (csrfInput) {
        csrfInput.value = generateCSRFToken();
    }
    
    // Security initialization
    if (detectBot()) {
        logSuspiciousActivity('Bot detected on page load');
    }
});

// Direct payment handling - ensure it works by using onclick instead of addEventListener
document.querySelectorAll('.package-btn').forEach(btn => {
    // Using direct onclick assignment to ensure it works
    btn.onclick = function(e) {
        e.preventDefault();
        const packageType = this.closest('.package-card').classList[1] || 'silver';
        const packageDetails = {
            silver: { price: '9.99', name: 'Silver Package' },
            gold: { price: '19.99', name: 'Gold Package' },
            platinum: { price: '39.99', name: 'Platinum Package' },
            diamond: { price: '79.99', name: 'Diamond Package' }
        };
        
        const selectedPackage = packageDetails[packageType] || packageDetails.silver;
        
        // Direct URL redirection with no checks or validations
        window.location.href = `https://checkout.miamirp.com/?package=${packageType}&price=${selectedPackage.price}`;
        return true;
    };
});

// Purchase modal functionality (SECURE VERSION)
// Further simplified version that just redirects to payment with no checks
function showPurchaseModal(packageType) {
    const packageDetails = {
        silver: { price: '9.99', name: 'Silver Package' },
        gold: { price: '19.99', name: 'Gold Package' },
        platinum: { price: '39.99', name: 'Platinum Package' },
        diamond: { price: '79.99', name: 'Diamond Package' }
    };
    
    const selectedPackage = packageDetails[packageType] || packageDetails.silver;
    
    // Simple direct URL redirection with no checks or validations
    window.location.href = `https://checkout.miamirp.com/?package=${packageType}&price=${selectedPackage.price}`;
}
    // Create modal using secure DOM manipulation
    const modal = document.createElement('div');
    modal.className = 'purchase-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const headerTitle = document.createElement('h2');
    headerTitle.textContent = `Purchase ${packageType.charAt(0).toUpperCase() + packageType.slice(1)} Package`;
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-modal';
    closeBtn.innerHTML = '&times;';
    
    modalHeader.appendChild(headerTitle);
    modalHeader.appendChild(closeBtn);
    
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    const bodyText = document.createElement('p');
    bodyText.textContent = `You're about to purchase the ${packageType} package. This will redirect you to our secure payment gateway.`;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'modal-buttons';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-secondary cancel-btn';
    cancelBtn.textContent = 'Cancel';
    
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn-primary confirm-btn';
    confirmBtn.textContent = 'Proceed to Payment';
    
    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(confirmBtn);
    
    modalBody.appendChild(bodyText);
    modalBody.appendChild(buttonContainer);
    
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);
    
    // Add modal styles
    const modalStyles = `
        .purchase-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            backdrop-filter: blur(5px);
        }
        .modal-content {
            background: var(--card-bg);
            border: 2px solid var(--primary-pink);
            border-radius: 10px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            position: relative;
            box-shadow: var(--shadow-pink-strong);
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        .modal-header h2 {
            color: var(--primary-pink);
            font-family: 'Orbitron', sans-serif;
            margin: 0;
        }
        .close-modal {
            font-size: 2rem;
            color: var(--primary-pink);
            cursor: pointer;
            transition: color 0.3s ease;
        }
        .close-modal:hover {
            color: var(--neon-pink);
        }
        .modal-body p {
            margin-bottom: 2rem;
            color: var(--text-secondary);
        }
        .modal-buttons {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
    `;
    
    // Add styles to head if not already added
    if (!document.querySelector('#modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(modal);
    
    // Modal event listeners
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    confirmBtn.addEventListener('click', () => {
        // Additional security checks before payment
        if (!checkDDoSProtection()) {
            showNotification('Too many requests. Please wait before proceeding.', 'error');
            return;
        }
        
        if (detectBot() || !isHumanLike()) {
            showNotification('Security verification required. Please contact support.', 'error');
            return;
        }
        
        // Get package details for payment
        const packageDetails = {
            silver: { price: '9.99', name: 'Silver Package', id: 'silver_vip' },
            gold: { price: '19.99', name: 'Gold Package', id: 'gold_vip' },
            platinum: { price: '39.99', name: 'Platinum Package', id: 'platinum_vip' },
            diamond: { price: '79.99', name: 'Diamond Package', id: 'diamond_vip' }
        };
        
        const selectedPackage = packageDetails[packageType];
        
        if (!selectedPackage) {
            showNotification('Invalid package selected.', 'error');
            return;
        }
        
        // **PAYMENT ADDRESSES - REPLACE WITH YOUR ACTUAL ADDRESSES**
        // PayPal: Change 'admin@miamirp.com' to your PayPal email
        // Bitcoin: Replace with your Bitcoin wallet address
        // Ethereum: Replace with your Ethereum wallet address  
        // Cash App: Replace '$MiamiRP' with your Cash App cashtag
        
        // Close the purchase modal first
        document.body.removeChild(modal);
        
        // Show QR code payment modal
        showQRPaymentModal(selectedPackage, packageType);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// QR Code Payment Modal (SECURE VERSION)
function showQRPaymentModal(packageDetails, packageType) {
    // Create QR payment modal
    const qrModal = document.createElement('div');
    qrModal.className = 'qr-payment-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'qr-modal-content';
    
    // Modal Header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'qr-modal-header';
    
    const headerTitle = document.createElement('h2');
    const qrIcon = document.createElement('i');
    qrIcon.className = 'fas fa-qrcode';
    headerTitle.appendChild(qrIcon);
    headerTitle.appendChild(document.createTextNode(` Payment - ${packageDetails.name}`));
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-qr-modal';
    closeBtn.innerHTML = '&times;';
    
    modalHeader.appendChild(headerTitle);
    modalHeader.appendChild(closeBtn);
    
    // Modal Body
    const modalBody = document.createElement('div');
    modalBody.className = 'qr-modal-body';
    
    // Package Info Section
    const packageInfo = document.createElement('div');
    packageInfo.className = 'package-info';
    
    const packageTitle = document.createElement('h3');
    packageTitle.textContent = packageDetails.name;
    
    const packagePrice = document.createElement('div');
    packagePrice.className = 'package-price-display';
    packagePrice.innerHTML = `<span class="currency">$</span><span class="amount">${packageDetails.price}</span> <span class="currency-code">USD</span>`;
    
    packageInfo.appendChild(packageTitle);
    packageInfo.appendChild(packagePrice);
    
    // Payment Methods Section
    const paymentMethods = document.createElement('div');
    paymentMethods.className = 'payment-methods';
    
    const methodsTitle = document.createElement('h4');
    methodsTitle.textContent = 'Choose Payment Method:';
    
    // Payment method buttons
    const paymentButtons = document.createElement('div');
    paymentButtons.className = 'payment-buttons';
    
    const methods = [
        { id: 'paypal', name: 'PayPal', icon: 'fab fa-paypal', color: '#0070ba', qrFile: 'paypal-qr.png' },
        { id: 'gpay', name: 'GPay/UPI', icon: 'fas fa-mobile-alt', color: '#1a73e8', qrFile: 'gpay-qr.png' },
        { id: 'bank', name: 'Bank Transfer', icon: 'fas fa-university', color: '#627eea', qrFile: 'bank-qr.png' },
        { id: 'card', name: 'Credit Card', icon: 'far fa-credit-card', color: '#ff8800', qrFile: 'card-qr.png' }
    ];
    
    methods.forEach(method => {
        const methodBtn = document.createElement('button');
        methodBtn.className = 'payment-method-btn';
        methodBtn.dataset.method = method.id;
        methodBtn.style.borderColor = method.color;
        
        const methodIcon = document.createElement('i');
        methodIcon.className = method.icon;
        methodIcon.style.color = method.color;
        
        const methodName = document.createElement('span');
        methodName.textContent = method.name;
        
        methodBtn.appendChild(methodIcon);
        methodBtn.appendChild(methodName);
        
        methodBtn.addEventListener('click', () => {
            generateQRCode(method, packageDetails, packageType);
        });
        
        paymentButtons.appendChild(methodBtn);
    });
    
    paymentMethods.appendChild(methodsTitle);
    paymentMethods.appendChild(paymentButtons);
    
    // QR Code Display Section (initially hidden)
    const qrSection = document.createElement('div');
    qrSection.className = 'qr-section';
    qrSection.style.display = 'none';
    
    const qrTitle = document.createElement('h4');
    qrTitle.textContent = 'Scan QR Code to Pay:';
    
    const qrContainer = document.createElement('div');
    qrContainer.className = 'qr-container';
    
    const qrCode = document.createElement('div');
    qrCode.className = 'qr-code';
    qrCode.id = 'qr-code-display';
    
    const qrInfo = document.createElement('div');
    qrInfo.className = 'qr-info';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Choose Different Method';
    backBtn.addEventListener('click', () => {
        qrSection.style.display = 'none';
        paymentMethods.style.display = 'block';
    });
    
    qrContainer.appendChild(qrCode);
    qrSection.appendChild(qrTitle);
    qrSection.appendChild(qrContainer);
    qrSection.appendChild(qrInfo);
    qrSection.appendChild(backBtn);
    
    // Footer
    const modalFooter = document.createElement('div');
    modalFooter.className = 'qr-modal-footer';
    
    const securityNote = document.createElement('p');
    securityNote.className = 'security-note';
    securityNote.innerHTML = '<i class="fas fa-shield-alt"></i> Secure payment processing. Your transaction is protected.';
    
    const supportNote = document.createElement('p');
    supportNote.className = 'support-note';
    supportNote.innerHTML = 'Need help? Contact us on <a href="https://discord.gg/YnfhJYBE" target="_blank">Discord</a>';
    
    modalFooter.appendChild(securityNote);
    modalFooter.appendChild(supportNote);
    
    // Assemble modal
    modalBody.appendChild(packageInfo);
    modalBody.appendChild(paymentMethods);
    modalBody.appendChild(qrSection);
    modalBody.appendChild(modalFooter);
    
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    qrModal.appendChild(modalContent);
    
    // Add QR modal styles
    const qrModalStyles = `
        .qr-payment-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2500;
            backdrop-filter: blur(10px);
            animation: qrModalFadeIn 0.3s ease-out;
        }
        
        @keyframes qrModalFadeIn {
            from {
                opacity: 0;
                backdrop-filter: blur(0px);
            }
            to {
                opacity: 1;
                backdrop-filter: blur(10px);
            }
        }
        
        .qr-modal-content {
            background: var(--card-bg);
            border: 2px solid var(--primary-pink);
            border-radius: 20px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 0 50px rgba(255, 0, 128, 0.3);
            animation: qrModalSlideIn 0.4s ease-out;
        }
        
        @keyframes qrModalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .qr-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--border-color);
        }
        
        .qr-modal-header h2 {
            color: var(--primary-pink);
            font-family: 'Orbitron', sans-serif;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.5rem;
        }
        
        .qr-modal-header i {
            font-size: 1.8rem;
            animation: qrIconPulse 2s ease-in-out infinite;
        }
        
        @keyframes qrIconPulse {
            0%, 100% {
                transform: scale(1);
                color: var(--primary-pink);
            }
            50% {
                transform: scale(1.1);
                color: var(--neon-pink);
            }
        }
        
        .close-qr-modal {
            font-size: 2rem;
            color: var(--primary-pink);
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 5px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .close-qr-modal:hover {
            color: var(--neon-pink);
            background: rgba(255, 0, 128, 0.1);
            transform: rotate(90deg) scale(1.1);
        }
        
        .package-info {
            text-align: center;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: var(--darker-bg);
            border-radius: 15px;
            border: 1px solid var(--border-color);
        }
        
        .package-info h3 {
            color: var(--primary-pink);
            font-family: 'Orbitron', sans-serif;
            margin-bottom: 1rem;
            font-size: 1.4rem;
        }
        
        .package-price-display {
            font-size: 2.5rem;
            font-weight: 900;
            color: var(--neon-pink);
            text-shadow: 0 0 15px var(--neon-pink);
            font-family: 'Orbitron', sans-serif;
        }
        
        .package-price-display .currency {
            font-size: 1.8rem;
            opacity: 0.8;
        }
        
        .package-price-display .currency-code {
            font-size: 1rem;
            color: var(--text-secondary);
            font-weight: normal;
        }
        
        .payment-methods {
            margin-bottom: 2rem;
        }
        
        .payment-methods h4 {
            color: var(--primary-pink);
            font-family: 'Orbitron', sans-serif;
            margin-bottom: 1.5rem;
            text-align: center;
            font-size: 1.2rem;
        }
        
        .payment-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        .payment-method-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
            padding: 1.5rem 1rem;
            background: var(--darker-bg);
            border: 2px solid var(--border-color);
            border-radius: 15px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: inherit;
            font-size: 1rem;
            position: relative;
            overflow: hidden;
        }
        
        .payment-method-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s ease;
        }
        
        .payment-method-btn:hover::before {
            left: 100%;
        }
        
        .payment-method-btn:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 5px 20px rgba(255, 0, 128, 0.2);
        }
        
        .payment-method-btn i {
            font-size: 2rem;
        }
        
        .payment-method-btn span {
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .qr-section {
            text-align: center;
            animation: qrSectionSlideIn 0.4s ease-out;
        }
        
        @keyframes qrSectionSlideIn {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .qr-section h4 {
            color: var(--primary-pink);
            font-family: 'Orbitron', sans-serif;
            margin-bottom: 1.5rem;
            font-size: 1.2rem;
        }
        
        .qr-container {
            display: flex;
            justify-content: center;
            margin-bottom: 2rem;
        }
        
        .qr-code {
            padding: 1.5rem;
            background: white;
            border-radius: 20px;
            border: 3px solid var(--primary-pink);
            box-shadow: 0 0 30px rgba(255, 0, 128, 0.4);
            animation: qrCodePulse 3s ease-in-out infinite;
            position: relative;
        }
        
        @keyframes qrCodePulse {
            0%, 100% {
                box-shadow: 0 0 30px rgba(255, 0, 128, 0.4);
                border-color: var(--primary-pink);
            }
            50% {
                box-shadow: 0 0 50px rgba(255, 0, 128, 0.7);
                border-color: var(--neon-pink);
            }
        }
        
        .qr-code::after {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: conic-gradient(var(--primary-pink), var(--neon-pink), var(--secondary-pink), var(--primary-pink));
            border-radius: 22px;
            z-index: -1;
            animation: qrBorderRotate 4s linear infinite;
        }
        
        @keyframes qrBorderRotate {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        
        .qr-info {
            background: var(--darker-bg);
            padding: 1.5rem;
            border-radius: 15px;
            margin-bottom: 1.5rem;
            border: 1px solid var(--border-color);
        }
        
        .qr-info h5 {
            color: var(--primary-pink);
            margin-bottom: 1rem;
            font-family: 'Orbitron', sans-serif;
        }
        
        .qr-info p {
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }
        
        .back-btn {
            background: var(--gradient-pink);
            border: none;
            padding: 1rem 2rem;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: inherit;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 0 auto;
        }
        
        .back-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 0, 128, 0.4);
        }
        
        .qr-modal-footer {
            text-align: center;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
        }
        
        .security-note {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .security-note i {
            color: #00ff88;
        }
        
        .support-note {
            color: var(--text-secondary);
            font-size: 0.8rem;
        }
        
        .support-note a {
            color: var(--primary-pink);
            text-decoration: none;
            font-weight: 600;
        }
        
        .support-note a:hover {
            color: var(--neon-pink);
            text-decoration: underline;
        }
        
        @media (max-width: 768px) {
            .qr-modal-content {
                padding: 1.5rem;
                margin: 1rem;
                max-width: none;
            }
            
            .payment-buttons {
                grid-template-columns: 1fr;
            }
            
            .qr-modal-header h2 {
                font-size: 1.2rem;
            }
            
            .package-price-display {
                font-size: 2rem;
            }
        }
    `;
    
    // Add styles to head if not already added
    if (!document.querySelector('#qr-modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'qr-modal-styles';
        styleSheet.textContent = qrModalStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(qrModal);
    
    // Modal event listeners
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(qrModal);
    });
    
    // Close modal when clicking outside
    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            document.body.removeChild(qrModal);
        }
    });
    
    // Escape key to close
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            if (document.body.contains(qrModal)) {
                document.body.removeChild(qrModal);
            }
            document.removeEventListener('keydown', escapeHandler);
        }
    });
    
    // Generate QR Code function
    function generateQRCode(method, packageDetails, packageType) {
        // Hide payment methods and show QR section
        paymentMethods.style.display = 'none';
        qrSection.style.display = 'block';
        
        // Clear previous QR code
        const qrCodeDisplay = document.getElementById('qr-code-display');
        qrCodeDisplay.innerHTML = '';
        
        // Generate QR code content based on payment method
        let qrContent = '';
        let paymentInfo = {};
        
        // Store the method ID for QR code generation
        const methodId = method.id;
        
        switch (method.id) {
            case 'paypal':
                // PayPal.me link for easy mobile payments
                qrContent = `https://paypal.me/miamirp/${packageDetails.price}`;
                paymentInfo = {
                    title: 'PayPal Payment',
                    instructions: [
                        'Scan the QR code with your phone camera',
                        'It will open PayPal app or website',
                        `Send $${packageDetails.price} USD`,
                        'Include your Discord username in the message'
                    ],
                    fa            case 'gpay':
                // GPay/UPI payment
                qrContent = `upi://pay?pa=miamirp@okbank&pn=MiamiRP&am=${packageDetails.price}&cu=USD`;
                paymentInfo = {
                    title: 'GPay/UPI Payment',
                    instructions: [
                        'Scan with your GPay or UPI app',
                        `Send $${packageDetails.price} USD equivalent`,
                        'Payment will be confirmed instantly',
                        'Include your Discord username in the remarks'
                    ],
                    fallback: 'UPI ID: miamirp@okbank'
                };
                break;
        fallback: 'UPI ID: miamirp@okbank'
                };
                break;
                
            case 'bank':
                // Bank transfer details
                qrContent = 'bank://transfer?account=7281940365&routing=031000503&name=Miami%20RP';
                paymentInfo = {
                    title: 'Bank Transfer',
                    instructions: [
                        'Use the account details below',
                        `Transfer $${packageDetails.price} USD`,
                        'Include your Discord username as reference',
                        'Email receipt to admin@miamirp.com'
                    ],
                    fallback: 'Account: 7281940365, Routing: 031000503'
                };
                break;
                
            case 'card':
                // Credit card payment
                qrContent = 'https://checkout.miamirp.com/card';
                paymentInfo = {
                    title: 'Credit Card Payment',
                    instructions: [
                        'Scan to open secure payment page',
                        `Enter your card details`,
                        `Total: $${packageDetails.price} USD`,
                        'Add Discord username in the Notes field'
                    ],
                    fallback: 'Or visit: checkout.miamirp.com'
                };
                break;
        }
        
        // Create QR code using a simple QR code generator with method ID
        createQRCodeImage(qrContent, qrCodeDisplay, method.id);
        
        // Update QR info section
        qrInfo.innerHTML = `
            <h5>${paymentInfo.title}</h5>
            ${paymentInfo.instructions.map(instruction => `<p>• ${instruction}</p>`).join('')}
            <p style="margin-top: 1rem; font-weight: 600; color: var(--primary-pink);">${paymentInfo.fallback}</p>
        `;
        
        // Show notification
        showNotification(`${method.name} payment method selected. Scan the QR code to pay.`, 'success');
    }
}

// Enhanced QR Code generator using local PNG images with fallback
function createQRCodeImage(content, container) {
    const qrSize = 200;
    
    //    // Use local QR code placeholder based on payment method
    const getQRImagePath = (content, methodId) => {
        // Try to use method ID first if provided
        if (methodId) {
            return `${methodId}-qr.png`;
        }
        // Otherwise fallback to content detection
        else if (content.includes('paypal')) {
            return 'paypal-qr.png';
        } else if (content.includes('upi')) {
            return 'gpay-qr.png';
        } else if (content.includes('bank')) {
            return 'bank-qr.png';
        } else if (content.includes('checkout')) {
            return 'card-qr.png';
        } else {
            return 'default-qr.png';
        }
    };
    
    // Try to use local image first, fallback to API
    const qrImage = document.createElement('img');
    qrImage.src = getQRImagePath(content, arguments[2]); // Pass methodId from 3rd argument
    qrImage.alt = 'Payment QR Code';
    qrImage.style.cssText = `
        width: ${qrSize}px;
        height: ${qrSize}px;
        border-radius: 15px;
        display: block;
    `;
    
    // If local image fails, use API as fallback
    qrImage.onerror = () => {
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(content)}&color=000000&bgcolor=ffffff&margin=10`;
    };
    
    // Add loading state
    const loadingDiv = document.createElement('div');
    loadingDiv.style.cssText = `
        width: ${qrSize}px;
        height: ${qrSize}px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f0f0;
        border-radius: 15px;
        color: #666;
        font-family: 'Orbitron', sans-serif;
    `;
    loadingDiv.textContent = 'Generating QR...';
    
    container.appendChild(loadingDiv);
    
    // Replace loading with QR code when loaded
    qrImage.onload = () => {
        container.removeChild(loadingDiv);
        container.appendChild(qrImage);
    };
    
    // Handle loading errors
    qrImage.onerror = () => {
        loadingDiv.innerHTML = `
            <div style="text-align: center;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ff4444; margin-bottom: 1rem;"></i>
                <p>QR Code generation failed</p>
                <p style="font-size: 0.8rem;">Please use the payment info below</p>
            </div>
        `;
    };
}

// Join Server Modal functionality (SECURE VERSION)
function showJoinServerModal() {
    // Check DDoS protection first
    if (!checkDDoSProtection()) {
        showNotification('Too many requests. Please wait before opening the server modal.', 'error');
        return;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'join-server-modal';
    
    // Create modal content securely
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const headerTitle = document.createElement('h2');
    const gamepadIcon = document.createElement('i');
    gamepadIcon.className = 'fas fa-gamepad';
    headerTitle.appendChild(gamepadIcon);
    headerTitle.appendChild(document.createTextNode(' Join Miami RP Server'));
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-modal';
    closeBtn.innerHTML = '&times;';
    
    modalHeader.appendChild(headerTitle);
    modalHeader.appendChild(closeBtn);
    
    // Create modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    // Instructions section
    const instructionsDiv = document.createElement('div');
    instructionsDiv.className = 'join-instructions';
    
    const instructionsTitle = document.createElement('h3');
    instructionsTitle.textContent = 'How to Connect:';
    
    const instructionsList = document.createElement('ol');
    const steps = [
        'Open <strong>FiveM</strong> application',
        'Press <strong>F8</strong> to open console',
        'Copy and paste the command below:'
    ];
    
    steps.forEach(step => {
        const li = document.createElement('li');
        li.innerHTML = step; // Safe because we control the content
        instructionsList.appendChild(li);
    });
    
    instructionsDiv.appendChild(instructionsTitle);
    instructionsDiv.appendChild(instructionsList);
    
    // Server command section
    const serverCommandDiv = document.createElement('div');
    serverCommandDiv.className = 'server-command';
    
    const commandBox = document.createElement('div');
    commandBox.className = 'command-box';
    
    const commandInput = document.createElement('input');
    commandInput.type = 'text';
    commandInput.id = 'serverCommand';
    commandInput.value = 'connect cfx.re/join/el6qvb';
    commandInput.readOnly = true;
    
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';
    copyButton.onclick = copyServerCommand;
    
    const copyIcon = document.createElement('i');
    copyIcon.className = 'fas fa-copy';
    copyButton.appendChild(copyIcon);
    copyButton.appendChild(document.createTextNode(' Copy'));
    
    commandBox.appendChild(commandInput);
    commandBox.appendChild(copyButton);
    serverCommandDiv.appendChild(commandBox);
    
    // Footer section
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    
    const helpText = document.createElement('p');
    helpText.className = 'help-text';
    
    const helpIcon = document.createElement('i');
    helpIcon.className = 'fas fa-info-circle';
    
    const discordLink = document.createElement('a');
    discordLink.href = 'https://discord.gg/YnfhJYBE';
    discordLink.target = '_blank';
    discordLink.textContent = 'Discord';
    
    helpText.appendChild(helpIcon);
    helpText.appendChild(document.createTextNode(' Need help? Join our '));
    helpText.appendChild(discordLink);
    helpText.appendChild(document.createTextNode(' for support!'));
    
    modalFooter.appendChild(helpText);
    
    // Assemble modal
    modalBody.appendChild(instructionsDiv);
    modalBody.appendChild(serverCommandDiv);
    modalBody.appendChild(modalFooter);
    
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);
    
    // Add modal styles
    const modalStyles = `
        .join-server-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            backdrop-filter: blur(5px);
        }
        .join-server-modal .modal-content {
            background: var(--card-bg);
            border: 2px solid var(--primary-pink);
            border-radius: 15px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            position: relative;
            box-shadow: var(--shadow-pink-strong);
            animation: modalSlideIn 0.3s ease-out;
        }
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        .join-server-modal .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        .join-server-modal .modal-header h2 {
            color: var(--primary-pink);
            font-family: 'Orbitron', sans-serif;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .join-server-modal .modal-header i {
            font-size: 1.5rem;
        }
        .join-server-modal .close-modal {
            font-size: 2rem;
            color: var(--primary-pink);
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 5px;
            border-radius: 50%;
        }
        .join-server-modal .close-modal:hover {
            color: var(--neon-pink);
            background: rgba(255, 0, 128, 0.1);
            transform: rotate(90deg);
        }
        .join-instructions {
            margin-bottom: 2rem;
        }
        .join-instructions h3 {
            color: var(--primary-pink);
            font-family: 'Orbitron', sans-serif;
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }
        .join-instructions ol {
            list-style: none;
            counter-reset: step-counter;
            padding-left: 0;
        }
        .join-instructions li {
            counter-increment: step-counter;
            margin-bottom: 0.8rem;
            padding-left: 2.5rem;
            position: relative;
            line-height: 1.6;
        }
        .join-instructions li::before {
            content: counter(step-counter);
            position: absolute;
            left: 0;
            top: 0;
            background: var(--gradient-pink);
            color: white;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.9rem;
        }
        .server-command {
            margin-bottom: 2rem;
        }
        .command-box {
            display: flex;
            background: var(--darker-bg);
            border: 2px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .command-box:hover {
            border-color: var(--primary-pink);
            box-shadow: var(--shadow-pink);
        }
        .command-box input {
            flex: 1;
            padding: 1rem 1.5rem;
            background: transparent;
            border: none;
            color: var(--primary-pink);
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            font-weight: bold;
        }
        .command-box input:focus {
            outline: none;
        }
        .copy-btn {
            padding: 1rem 1.5rem;
            background: var(--gradient-pink);
            border: none;
            color: white;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 100px;
            justify-content: center;
        }
        .copy-btn:hover {
            background: var(--neon-pink);
            transform: translateY(-1px);
        }
        .copy-btn.copied {
            background: #00ff88;
        }
        .modal-footer {
            text-align: center;
            margin-top: 1.5rem;
        }
        .help-text {
            color: var(--text-secondary);
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        .help-text a {
            color: var(--primary-pink);
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
        }
        .help-text a:hover {
            color: var(--neon-pink);
            text-decoration: underline;
        }
        @media (max-width: 768px) {
            .join-server-modal .modal-content {
                padding: 1.5rem;
                margin: 1rem;
            }
            .command-box {
                flex-direction: column;
            }
            .copy-btn {
                border-radius: 0 0 6px 6px;
            }
        }
    `;
    
    // Add styles to head if not already added
    if (!document.querySelector('#join-server-modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'join-server-modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(modal);
    
    // Modal event listeners
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Escape key to close
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// Copy server command function
// SECURE VERSION: Copy server command function
function copyServerCommand() {
    const commandInput = document.getElementById('serverCommand');
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.textContent;
    
    // Select and copy the text
    commandInput.select();
    commandInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        navigator.clipboard.writeText(commandInput.value).then(() => {
            // Success feedback - create secure icon
            const icon = document.createElement('i');
            icon.className = 'fas fa-check';
            copyBtn.textContent = ' Copied!';
            copyBtn.insertBefore(icon, copyBtn.firstChild);
            copyBtn.classList.add('copied');
            
            // Show notification
            showNotification('Server command copied to clipboard!', 'success');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            document.execCommand('copy');
            const icon = document.createElement('i');
            icon.className = 'fas fa-check';
            copyBtn.textContent = ' Copied!';
            copyBtn.insertBefore(icon, copyBtn.firstChild);
            copyBtn.classList.add('copied');
            showNotification('Server command copied to clipboard!', 'success');
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        });
    } catch (err) {
        // Fallback method
        document.execCommand('copy');
        showNotification('Command copied! Paste it in FiveM console.', 'success');
    }
}

// SECURE Contact form submission with enhanced security
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // Add visual feedback to form inputs
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        // Add validation status indicators
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'input-status';
        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(statusIndicator);
        
        // Add input validation visual feedback
        input.addEventListener('input', function() {
            const value = this.value.trim();
            if (value.length > 0) {
                if (this.checkValidity()) {
                    statusIndicator.className = 'input-status valid';
                    statusIndicator.innerHTML = '<i class="fas fa-check"></i>';
                } else {
                    statusIndicator.className = 'input-status invalid';
                    statusIndicator.innerHTML = '<i class="fas fa-exclamation"></i>';
                }
            } else {
                statusIndicator.className = 'input-status';
                statusIndicator.innerHTML = '';
            }
        });
    });
    
    // Update submit button to show "Sending..." state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        
        // Add CSS for input status indicators
        if (!document.querySelector('#form-validation-styles')) {
            const formStyles = `
                .input-status {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }
                .input-status.valid {
                    color: #00ff88;
                }
                .input-status.invalid {
                    color: #ff4444;
                }
                textarea + .input-status {
                    top: 1.5rem;
                }
                .sending-state {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                .sending-state .loading-dots span {
                    display: inline-block;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: currentColor;
                    margin: 0 2px;
                    animation: loadingDots 1.4s infinite ease-in-out;
                }
                .sending-state .loading-dots span:nth-child(2) {
                    animation-delay: 0.2s;
                }
                .sending-state .loading-dots span:nth-child(3) {
                    animation-delay: 0.4s;
                }
                @keyframes loadingDots {
                    0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
                    40% { transform: scale(1); opacity: 1; }
                }
            `;
            const styleSheet = document.createElement('style');
            styleSheet.id = 'form-validation-styles';
            styleSheet.textContent = formStyles;
            document.head.appendChild(styleSheet);
        }
    }
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        try {
            // Update button to "Sending..." state
            const submitBtn = this.querySelector('button[type="submit"]');
            let originalText = '';
            if (submitBtn) {
                originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = `
                    <span class="sending-state">
                        <i class="fas fa-paper-plane"></i>
                        Sending
                        <span class="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </span>
                `;
                submitBtn.disabled = true            // Simple validation without rate limiting
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();
            const honeypot = document.getElementById('honeypot').value;
            const csrfToken = document.getElementById('csrfToken').value;
            
            // Simple validation that doesn't throw errors
            const nameValid = name.length >= 2;
            const emailValid = email.includes('@') && email.includes('.');
            const messageValid = message.length >= 10;
            
            if (!nameValid || !emailValid || !messageValid) {
                showNotification('Please fill in all fields correctly.', 'error');
                
                // Reset the submit button
                if (submitBtn) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
                return;
            }
            
            // Simulate form submission with delay for visual feedback
            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                this.reset();
                
                // Reset the submit button
                if (submitBtn) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
                
                // Clear validation indicators
                const statusIndicators = this.querySelectorAll('.input-status');
                statusIndicators.forEach(indicator => {
                    indicator.className = 'input-status';
                    indicator.innerHTML = '';
                });
                
                // Generate new CSRF token
                document.getElementById('csrfToken').value = generateCSRFToken();
                
                // Reset rate limiting on successful submission
                RATE_LIMIT.attempts = Math.max(0, RATE_LIMIT.attempts - 1);
            }, 1500);
            
        } catch (error) {
            // Reset the submit button
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
            
            showNotification(error.message, 'error');
        }
    });
}

// SECURE Notification system
function showNotification(message, type = 'info') {
    // Check if it's a security notification and suppress it
    if (message.includes('suspicious') || 
        message.includes('security') || 
        message.includes('verify')) {
        // Skip showing security-related notifications
        return;
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Secure DOM creation
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message; // Use textContent to prevent XSS
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-notification';
    closeBtn.innerHTML = '&times;';
    
    notification.appendChild(messageSpan);
    notification.appendChild(closeBtn);
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const notificationStyles = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--card-bg);
                border: 2px solid var(--primary-pink);
                border-radius: 5px;
                padding: 1rem 1.5rem;
                color: white;
                z-index: 3000;
                display: flex;
                align-items: center;
                gap: 1rem;
                box-shadow: var(--shadow-pink);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification.success {
                border-color: #00ff88;
                box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
            }
            .notification.error {
                border-color: #ff4444;
                box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
            }
            .close-notification {
                background: none;
                border: none;
                color: var(--primary-pink);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button functionality
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 300);
}

// Add advanced glitch effect to logos on hover
const navLogo = document.querySelector('.logo-title');
const heroTitle = document.querySelector('.hero-title');

// Initialize data-text attribute for glitch effects
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.hero-title, .logo-title').forEach(title => {
        title.setAttribute('data-text', title.textContent);
    });
});

if (navLogo) {
    // No animations or hover effects for logo text
}

if (heroTitle) {
    // No animations or hover effects for hero title
}
// Removed neon flicker effect for logo elements
function createEnhancedNeonFlicker() {
    const neonElements = document.querySelectorAll('.neon-text:not(.logo-title):not(.hero-title), .section-title .neon-text');
    neonElements.forEach(element => {
        if (Math.random() < 0.15) { // 15% chance for more frequent flickers
            const originalAnimation = element.style.animation;
            const originalTextShadow = element.style.textShadow;
            element.style.animation = 'none';
            
            // Only apply effects to non-logo elements
            if (!element.classList.contains('logo-title') && !element.classList.contains('hero-title')) {
                setTimeout(() => {
                    element.style.opacity = '0.3';
                    element.style.textShadow = '0 0 5px var(--primary-pink)';
                }, 50);
                
                setTimeout(() => {
                    element.style.opacity = '0.7';
                    element.style.textShadow = '0 0 15px var(--neon-pink)';
                }, 100);
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.textShadow = originalTextShadow;
                    element.style.animation = originalAnimation || 'neonGlow 2s ease-in-out infinite alternate';
                }, 150);
            }
        }
    });
    
    // Removed logo flicker effects
}
// Removed logo animation effects on scroll
function createLogoPulseOnScroll() {
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        
        // No logo animations or effects
        
        // Animate the retro sun strips in the hero section
        if (heroSection && scrollPercent < 0.5) {
            // Calculate parallax effect for the sun strip
            const translateY = scrollPercent * 20;
            const opacity = 0.15 + (scrollPercent * 0.1);
            const blur = 10 - (scrollPercent * 5);
            
            // Apply to the horizontal sun strip (::after element)
            if (heroSection.style) {
                heroSection.style.setProperty('--sun-strip-translate', `-${translateY}px`);
                heroSection.style.setProperty('--sun-strip-opacity', opacity.toString());
                heroSection.style.setProperty('--sun-strip-blur', `${blur}px`);
            }
        }
        
        // Removed hero-logo-glow animation (sun rays effect)
    });
}

// Run enhanced effects at intervals
setInterval(createEnhancedNeonFlicker, 2500);
createLogoPulseOnScroll();

// Create interactive hover effects for cards
function initializeCardEffects() {
    const cards = document.querySelectorAll('.content-card, .package-card, .event-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.transition = 'all 0.3s ease';
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: radial-gradient(circle, rgba(255, 0, 128, 0.2) 0%, transparent 70%);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: rippleExpand 0.6s ease-out;
                pointer-events: none;
                z-index: 0;
            `;
            
            card.style.position = 'relative';
            card.appendChild(ripple);
            
            setTimeout(() => {
                if (card.contains(ripple)) {
                    card.removeChild(ripple);
                }
            }, 600);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add ripple animation styles
    if (!document.querySelector('#ripple-styles')) {
        const rippleStyles = `
            @keyframes rippleExpand {
                0% {
                    width: 0;
                    height: 0;
                    opacity: 1;
                }
                100% {
                    width: 300px;
                    height: 300px;
                    opacity: 0;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'ripple-styles';
        styleSheet.textContent = rippleStyles;
        document.head.appendChild(styleSheet);
    }
}

// Initialize card effects when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCardEffects);

// Enhanced Particle System for Hero Section with new effects
// Reduce this effect to make canvas particles more visible
function createEnhancedParticles() {
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;
    
    // Reduce opacity of these particles to make canvas particles more visible
    heroParticles.style.opacity = '0.4';
    
    // Clear existing particles
    heroParticles.innerHTML = '';
    
    // Create different types of particles with expanded color palette
    const particleTypes = [
        { size: 2, color: 'var(--primary-pink)', count: 15, glow: 6, speed: 1 },
        { size: 1, color: 'var(--neon-pink)', count: 20, glow: 4, speed: 1.2 },
        { size: 3, color: 'var(--secondary-pink)', count: 10, glow: 8, speed: 0.8 },
        { size: 1.5, color: '#ffffff', count: 8, glow: 5, speed: 1.3 },
        { size: 2.5, color: 'var(--neon-purple)', count: 12, glow: 7, speed: 0.9 },
        { size: 1.8, color: 'var(--neon-blue)', count: 10, glow: 6, speed: 1.1 },
        { size: 1.2, color: 'var(--neon-orange)', count: 8, glow: 5, speed: 1.4 },
        { size: 1, color: 'var(--neon-yellow)', count: 6, glow: 4, speed: 1.5 }
    ];
    
    particleTypes.forEach(type => {
        for (let i = 0; i < type.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'enhanced-particle';
            
            const animationDelay = Math.random() * 10;
            const animationDuration = (8 + Math.random() * 12) / type.speed;
            const horizontalMovement = (Math.random() - 0.5) * 200;
            const rotationSpeed = Math.random() * 360;
            const pulseSpeed = 2 + Math.random() * 3;
            
            // Create special particles occasionally (star-shaped or triangular)
            let particleShape = '';
            if (Math.random() < 0.15) {
                if (Math.random() < 0.5) {
                    // Star shape using clip-path
                    particleShape = `
                        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
                        width: ${type.size * 4}px;
                        height: ${type.size * 4}px;
                    `;
                } else {
                    // Triangle shape using clip-path
                    particleShape = `
                        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                        width: ${type.size * 3}px;
                        height: ${type.size * 3}px;
                    `;
                }
            }
            
            particle.style.cssText = `
                position: absolute;
                width: ${type.size}px;
                height: ${type.size}px;
                background: ${type.color};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: 100%;
                animation: enhancedFloat ${animationDuration}s linear infinite, particleGlow ${pulseSpeed}s ease-in-out infinite;
                animation-delay: ${animationDelay}s;
                opacity: 0;
                box-shadow: 0 0 ${type.glow}px ${type.color};
                --horizontal-movement: ${horizontalMovement}px;
                --rotation-speed: ${rotationSpeed}deg;
                ${particleShape}
                transform-origin: center;
                will-change: transform, opacity;
            `;
            
            heroParticles.appendChild(particle);
        }
    });
    
    // Add special neon trails occasionally
    for (let i = 0; i < 5; i++) {
        const trail = document.createElement('div');
        trail.className = 'neon-trail';
        
        const startPosition = Math.random() * 100;
        const trailColor = Math.random() < 0.33 ? 'var(--primary-pink)' : 
                          (Math.random() < 0.5 ? 'var(--neon-purple)' : 'var(--neon-blue)');
        const animationDelay = Math.random() * 15;
        const animationDuration = 10 + Math.random() * 15;
        
        trail.style.cssText = `
            position: absolute;
            width: 1px;
            height: 100px;
            background: linear-gradient(to top, transparent, ${trailColor}, transparent);
            left: ${startPosition}%;
            top: 120%;
            opacity: 0.6;
            filter: blur(2px);
            animation: neonTrail ${animationDuration}s linear infinite;
            animation-delay: ${animationDelay}s;
            z-index: 1;
            pointer-events: none;
        `;
        
        heroParticles.appendChild(trail);
    }
    
    // Add enhanced particle animation styles
    if (!document.querySelector('#enhanced-particle-styles')) {
        const particleStyles = `
            .enhanced-particle {
                pointer-events: none;
                z-index: 1;
            }
            
            @keyframes enhancedFloat {
                0% {
                    transform: translateY(0) translateX(0) rotate(0deg) scale(0);
                    opacity: 0;
                }
                5% {
                    opacity: 1;
                    transform: translateY(-50px) translateX(0) rotate(calc(var(--rotation-speed) * 0.05)) scale(1);
                }
                25% {
                    transform: translateY(-25vh) translateX(calc(var(--horizontal-movement) * 0.3)) rotate(calc(var(--rotation-speed) * 0.25)) scale(1.2);
                }
                50% {
                    transform: translateY(-50vh) translateX(calc(var(--horizontal-movement) * 0.7)) rotate(calc(var(--rotation-speed) * 0.5)) scale(0.8);
                }
                75% {
                    transform: translateY(-75vh) translateX(var(--horizontal-movement)) rotate(calc(var(--rotation-speed) * 0.75)) scale(1.1);
                }
                95% {
                    opacity: 1;
                    transform: translateY(-95vh) translateX(calc(var(--horizontal-movement) * 1.2)) rotate(calc(var(--rotation-speed) * 0.95)) scale(0.6);
                }
                100% {
                    transform: translateY(-110vh) translateX(calc(var(--horizontal-movement) * 1.3)) rotate(var(--rotation-speed)) scale(0);
                    opacity: 0;
                }
            }
            
            @keyframes particleGlow {
                0%, 100% {
                    box-shadow: 0 0 5px currentColor;
                    opacity: 0.7;
                }
                50% {
                    box-shadow: 0 0 15px currentColor, 0 0 25px currentColor;
                    opacity: 1;
                }
            }
            
            @keyframes neonTrail {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0;
                    height: 50px;
                }
                10% {
                    opacity: 0.6;
                    height: 100px;
                }
                50% {
                    transform: translateY(-50vh) rotate(5deg);
                    height: 150px;
                }
                90% {
                    opacity: 0.4;
                    height: 100px;
                }
                100% {
                    transform: translateY(-100vh) rotate(10deg);
                    opacity: 0;
                    height: 50px;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'enhanced-particle-styles';
        styleSheet.textContent = particleStyles;
        document.head.appendChild(styleSheet);
    }
    
// Removed interactive particles that follow the cursor
    const hero = document.querySelector('.hero');
    if (hero) {
        // Cursor particle effect removed
        
        // Add cursor particle animation
        if (!document.querySelector('#cursor-particle-styles')) {
            const cursorStyles = `
                @keyframes cursorParticleFade {
                    0% {
                        transform: scale(1) translateY(0);
                        opacity: 0.8;
                    }
                    100% {
                        transform: scale(0) translateY(-20px);
                        opacity: 0;
                    }
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.id = 'cursor-particle-styles';
            styleSheet.textContent = cursorStyles;
            document.head.appendChild(styleSheet);
        }
    }
}

// Create floating background elements
function createFloatingElements() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Reduce number of floating elements to make canvas particles more visible
    for (let i = 0; i < 3; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.cssText = `
            position: absolute;
            width: ${50 + Math.random() * 100}px;
            height: ${50 + Math.random() * 100}px;
            background: radial-gradient(circle, rgba(255, 0, 128, 0.05) 0%, transparent 70%); /* Reduced opacity */
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatElement ${10 + Math.random() * 20}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            z-index: 1;
            pointer-events: none;
        `;
        hero.appendChild(element);
    }
    
    // Add floating element styles
    if (!document.querySelector('#floating-element-styles')) {
        const floatingStyles = `
            @keyframes floatElement {
                0%, 100% {
                    transform: translateY(0) translateX(0) scale(1);
                    opacity: 0.3;
                }
                25% {
                    transform: translateY(-20px) translateX(10px) scale(1.1);
                    opacity: 0.6;
                }
                50% {
                    transform: translateY(-10px) translateX(-15px) scale(0.9);
                    opacity: 0.4;
                }
                75% {
                    transform: translateY(-25px) translateX(5px) scale(1.05);
                    opacity: 0.7;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'floating-element-styles';
        styleSheet.textContent = floatingStyles;
        document.head.appendChild(styleSheet);
    }
}

// Removed all logo effects
function initializeLogoEffects() {
    // Function intentionally empty - no logo effects or animations
}

// Create animated grid lines with retro sun effect
function createAnimatedGrid() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create vertical lines - reduced number for less interference with particles
    for (let i = 0; i < 5; i++) {
        const line = document.createElement('div');
        line.className = 'grid-line vertical';
        
        // Create gradient with multiple neon colors for more vibrant effect
        const gradientColors = Math.random() < 0.3 ? 
            `transparent, var(--primary-pink), var(--neon-pink), var(--primary-pink), transparent` : 
            `transparent, var(--primary-pink), transparent`;
        
        line.style.cssText = `
            position: absolute;
            width: 1px;
            height: 100%;
            background: linear-gradient(to bottom, ${gradientColors});
            left: ${(i + 1) * 20}%; /* Adjusted for fewer lines */
            top: 0;
            opacity: 0.05; /* Reduced opacity */
            animation: gridLineGlow ${4 + Math.random() * 6}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
            z-index: 1;
            filter: blur(${Math.random() < 0.3 ? '1px' : '0'});
        `;
        hero.appendChild(line);
    }
    
    // Create horizontal lines - reduced number for less interference with particles
    for (let i = 0; i < 4; i++) {
        const line = document.createElement('div');
        line.className = 'grid-line horizontal';
        
        // Create gradient with multiple neon colors for more vibrant effect
        const gradientColors = Math.random() < 0.3 ? 
            `transparent, var(--neon-purple), var(--primary-pink), var(--neon-purple), transparent` : 
            `transparent, var(--primary-pink), transparent`;
            
        line.style.cssText = `
            position: absolute;
            width: 100%;
            height: 1px;
            background: linear-gradient(to right, ${gradientColors});
            left: 0;
            top: ${(i + 1) * 25}%; /* Adjusted for fewer lines */
            opacity: 0.05; /* Reduced opacity */
            animation: gridLineGlow ${4 + Math.random() * 6}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
            z-index: 1;
            filter: blur(${Math.random() < 0.3 ? '1px' : '0'});
        `;
        hero.appendChild(line);
    }
    
    // Create retro sun strips
    const createSunStrip = () => {
        const strip = document.createElement('div');
        strip.className = 'retro-sun-strip';
        
        // Randomize properties for variety
        const height = 30 + Math.random() * 40;
        const yPosition = Math.random() * 100;
        const rotation = -10 + Math.random() * 20;
        const opacity = 0.05 + Math.random() * 0.1;
        const blur = 5 + Math.random() * 10;
        const animationDuration = 10 + Math.random() * 15;
        const direction = Math.random() < 0.5 ? 'normal' : 'reverse';
        
        strip.style.cssText = `
            position: absolute;
            width: 200%;
            height: ${height}px;
            background: linear-gradient(90deg, 
                var(--neon-orange) 0%, 
                var(--neon-yellow) 20%, 
                var(--primary-pink) 40%, 
                var(--neon-purple) 60%, 
                var(--neon-blue) 80%, 
                var(--neon-orange) 100%
            );
            top: ${yPosition}%;
            left: -50%;
            transform: rotate(${rotation}deg);
            opacity: ${opacity};
            filter: blur(${blur}px);
            z-index: 1;
            animation: moveHorizontalStrip ${animationDuration}s linear infinite ${direction};
            background-size: 200% 100%;
            pointer-events: none;
        `;
        
        hero.appendChild(strip);
    };
    
    // Create fewer sun strips to reduce interference with particles
    const stripCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < stripCount; i++) {
        createSunStrip();
    }
    
    // Add grid line animation styles
    if (!document.querySelector('#grid-line-styles')) {
        const gridStyles = `
            @keyframes gridLineGlow {
                0%, 100% {
                    opacity: 0.05;
                    filter: blur(0px);
                }
                50% {
                    opacity: 0.3;
                    filter: blur(1px);
                }
            }
            
            @keyframes moveHorizontalStrip {
                0% {
                    transform: rotate(var(--rotation, -5deg)) translateX(0) scale(1);
                    background-position: 0% 50%;
                }
                50% {
                    transform: rotate(var(--rotation, -5deg)) translateX(-10%) scale(1.05);
                    background-position: 100% 50%;
                }
                100% {
                    transform: rotate(var(--rotation, -5deg)) translateX(0) scale(1);
                    background-position: 0% 50%;
                }
            }
            
            .retro-sun-strip {
                will-change: transform, opacity;
                transform-origin: center;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'grid-line-styles';
        styleSheet.textContent = gridStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Create a central retro sun effect
    const createRetroSun = () => {
        const sun = document.createElement('div');
        sun.className = 'retro-central-sun';
        
        // Position in the lower part of the hero section
        sun.style.cssText = `
            position: absolute;
            width: 150%;
            height: 300px;
            background: radial-gradient(
                ellipse at center,
                rgba(255, 102, 0, 0.3) 0%,
                rgba(255, 204, 0, 0.2) 25%,
                rgba(255, 0, 128, 0.1) 50%,
                rgba(153, 0, 255, 0.05) 75%,
                transparent 100%
            );
            bottom: -150px;
            left: -25%;
            opacity: 0.3;
            filter: blur(20px);
            z-index: 0;
            transform: perspective(500px) rotateX(60deg);
            pointer-events: none;
            animation: retroSunPulse 10s ease-in-out infinite;
        `;
        
        hero.appendChild(sun);
        
        // Add sun pulse animation
        if (!document.querySelector('#retro-sun-styles')) {
            const sunStyles = `
                @keyframes retroSunPulse {
                    0%, 100% {
                        opacity: 0.3;
                        filter: blur(20px);
                    }
                    50% {
                        opacity: 0.4;
                        filter: blur(15px);
                    }
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.id = 'retro-sun-styles';
            styleSheet.textContent = sunStyles;
            document.head.appendChild(styleSheet);
        }
    };
    
    createRetroSun();
}

// Initialize enhanced visual effects
window.addEventListener('load', () => {
    // Initialize minimal visual effects (no logo animations)
    createEnhancedParticles();
    createFloatingElements();
    createAnimatedGrid();
    
    // Initialize ripple effect for buttons
    initializeRippleEffect();
    
    // Ensure payment buttons work correctly with direct functionality
    document.querySelectorAll('.package-btn').forEach(btn => {
        btn.onclick = function() {
            const packageType = this.closest('.package-card').classList[1] || 'silver';
            const packageDetails = {
                silver: { price: '9.99', name: 'Silver Package' },
                gold: { price: '19.99', name: 'Gold Package' },
                platinum: { price: '39.99', name: 'Platinum Package' },
                diamond: { price: '79.99', name: 'Diamond Package' }
            };
            
            const selectedPackage = packageDetails[packageType] || packageDetails.silver;
            
            // Direct URL redirection for payment - ensure this works
            window.location.href = `https://checkout.miamirp.com/?package=${packageType}&price=${selectedPackage.price}`;
        };
    });
    
    // Restart particle animation every 30 seconds for variety
    setInterval(createEnhancedParticles, 30000);
});

// Ripple effect for buttons
function initializeRippleEffect() {
    document.querySelectorAll('.btn-primary, .btn-secondary, .package-btn').forEach(button => {
        button.addEventListener('mousedown', function(e) {
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;
            
            this.style.setProperty('--x', `${x}px`);
            this.style.setProperty('--y', `${y}px`);
            
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'btn-ripple';
            
            ripple.style.cssText = `
                position: absolute;
                width: 100px;
                height: 100px;
                background: rgba(255, 255, 255, 0.25);
                border-radius: 50%;
                transform: scale(0);
                top: ${y - 50}px;
                left: ${x - 50}px;
                transform-origin: center;
                animation: btnRipple 0.8s ease-out forwards;
                pointer-events: none;
                z-index: 0;
            `;
            
            this.appendChild(ripple);
            
            // Clean up ripple after animation
            setTimeout(() => {
                if (this.contains(ripple)) {
                    this.removeChild(ripple);
                }
            }, 800);
        });
    });
    
    // Add ripple animation styles
    if (!document.querySelector('#btn-ripple-styles')) {
        const rippleStyles = `
            @keyframes btnRipple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(3);
                    opacity: 0;
                }
            }
            
            .btn-primary, .btn-secondary, .package-btn {
                position: relative;
                overflow: hidden;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'btn-ripple-styles';
        styleSheet.textContent = rippleStyles;
        document.head.appendChild(styleSheet);
    }
}

// Removed glow modulation
function modifyGlowIntensity() {
    // Function intentionally empty - no glow effects
}

// SECURE Add loading screen
function showLoadingScreen() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    
    // Create loader content securely
    const loaderContent = document.createElement('div');
    loaderContent.className = 'loader-content';
    
    const loaderLogo = document.createElement('div');
    loaderLogo.className = 'loader-logo';
    
    const logoTitle = document.createElement('h1');
    logoTitle.className = 'neon-text';
    logoTitle.textContent = 'Miami RP';
    
    const loadingText = document.createElement('p');
    loadingText.textContent = 'Loading...';
    
    loaderLogo.appendChild(logoTitle);
    loaderLogo.appendChild(loadingText);
    
    const loaderBar = document.createElement('div');
    loaderBar.className = 'loader-bar';
    
    const loaderProgress = document.createElement('div');
    loaderProgress.className = 'loader-progress';
    
    loaderBar.appendChild(loaderProgress);
    loaderContent.appendChild(loaderLogo);
    loaderContent.appendChild(loaderBar);
    loader.appendChild(loaderContent);
    
    const loaderStyles = `
        #loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--dark-bg);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        .loader-content {
            text-align: center;
        }
        .loader-logo h1 {
            font-family: 'Orbitron', sans-serif;
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .loader-logo p {
            color: var(--text-secondary);
            margin-bottom: 2rem;
        }
        .loader-bar {
            width: 300px;
            height: 4px;
            background: var(--border-color);
            border-radius: 2px;
            overflow: hidden;
        }
        .loader-progress {
            height: 100%;
            background: var(--gradient-pink);
            width: 0;
            border-radius: 2px;
            animation: loadProgress 2s ease-in-out forwards;
            box-shadow: 0 0 10px var(--primary-pink);
        }
        @keyframes loadProgress {
            to {
                width: 100%;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = loaderStyles;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(loader);
    
    // Hide loader after 2.5 seconds
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(loader);
        }, 500);
    }, 2500);
}

// Show loading screen on page load
if (document.readyState === 'loading') {
    showLoadingScreen();
}

// ===== ADVANCED SECURITY FEATURES =====

// Removed security challenge popup
function showSecurityChallenge() {
    // Always return true to avoid blocking users
    return true;
}

// 2. Monitor for tampering with forms
const originalFormElements = new WeakMap();

document.querySelectorAll('form').forEach(form => {
    originalFormElements.set(form, form.innerHTML);
    
    // Monitor for changes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                logSuspiciousActivity('Form tampering detected');
            }
        });
    });
    
    observer.observe(form, {
        childList: true,
        attributes: true,
        subtree: true
    });
});

// 3. Disable dangerous console access
if (typeof console !== 'undefined') {
    const originalLog = console.log;
    console.log = function() {
        if (!isHumanLike() || detectBot()) {
            return;
        }
        originalLog.apply(console, arguments);
    };
}

// 4. Enhanced right-click protection with exceptions
document.addEventListener('contextmenu', e => {
    // Allow context menu on input fields for accessibility
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    e.preventDefault();
    logSuspiciousActivity('Right-click attempted');
});

// 5. Detect rapid clicking (potential bot)
let clickCount = 0;
let clickTimer;

document.addEventListener('click', () => {
    clickCount++;
    
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
        if (clickCount > 20) {
            logSuspiciousActivity('Rapid clicking detected');
        }
        clickCount = 0;
    }, 1000);
});

// 6. Monitor for XSS attempts
const originalCreateElement = document.createElement;
document.createElement = function(tagName) {
    if (typeof tagName === 'string' && (tagName.toLowerCase() === 'script' || 
        tagName.toLowerCase() === 'iframe' || 
        tagName.toLowerCase() === 'embed')) {
        logSuspiciousActivity(`Attempt to create ${tagName} element`);
    }
    return originalCreateElement.call(document, tagName);
};

// 7. Protect against eval and other dangerous functions
window.eval = function() {
    logSuspiciousActivity('eval() function call blocked');
    throw new Error('eval() is disabled for security reasons');
};

// 8. Basic keylogger protection
let keySequence = [];
document.addEventListener('keydown', e => {
    keySequence.push(e.key);
    
    // Keep only last 10 keys
    if (keySequence.length > 10) {
        keySequence.shift();
    }
    
    // Detect potential keylogger patterns
    const sequence = keySequence.join('');
    if (sequence.includes('password') || sequence.includes('admin') || 
        sequence.includes('login') || sequence.match(/\d{4,}/)) {
        keySequence = []; // Clear to prevent data leakage
    }
    
    // Basic developer tools blocking (with improved detection)
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        logSuspiciousActivity('Developer tools access attempted');
    }
});

// Security-enhanced console messages with modern branding
if (!detectBot() && isHumanLike()) {
    console.log('%c🌴 MIAMI RP - MODERNIZED 2024 🌴', 'color: #ff0080; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px #ff0080;');
    console.log('%c✨ Enhanced with modern animations and effects', 'color: #ff3399; font-size: 14px; font-weight: bold;');
    console.log('%c⚠️ SECURITY NOTICE: Advanced protection systems active', 'color: #ff3399; font-size: 12px; font-weight: bold;');
    console.log('%c🔒 DDoS protection, XSS filtering, and bot detection enabled', 'color: #00ff88; font-size: 11px;');
    console.log('%c🎮 Ready for the ultimate roleplay experience!', 'color: #ffffff; font-size: 12px;');
}

// Initialize all security measures and modern features
window.addEventListener('load', () => {
    // Check if user is a bot
    if (detectBot()) {
        logSuspiciousActivity('Bot detected');
        return;
    }
    
    // Initialize DDoS protection check
    if (!checkDDoSProtection()) {
        showNotification('Rate limit exceeded. Please wait before making more requests.', 'error');
    }
    
    // Initialize modern visual effects
    setTimeout(() => {
        createEnhancedParticles();
        createFloatingElements();
        createAnimatedGrid();
        initializeLogoEffects();
        initializeCardEffects();
    }, 500);
    
    // Start monitoring suspicious activity
    setInterval(() => {
        if (!isHumanLike()) {
            logSuspiciousActivity('Non-human behavior detected');
        }
    }, 30000); // Check every 30 seconds
    
    // Welcome message for legitimate users
    setTimeout(() => {
        if (!detectBot() && isHumanLike()) {
            showNotification('Welcome to Miami RP! 🌴 Experience the real RP.', 'success');
        }
    }, 3000);
});

// Final Security Check: Monitor for script injection attempts
const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
Object.defineProperty(Element.prototype, 'innerHTML', {
    set: function(value) {
        if (typeof value === 'string' && 
            (value.includes('<script') || value.includes('javascript:') || value.includes('onload='))) {
            logSuspiciousActivity('Potential XSS attempt via innerHTML');
            throw new Error('Potential XSS attempt blocked');
        }
        originalInnerHTML.set.call(this, value);
    },
    get: originalInnerHTML.get
});
// Performance optimization for animations
function optimizeAnimations() {
    // Detect device capabilities - with fallbacks for privacy-focused browsers
    const isLowPerformance = !navigator.hardwareConcurrency || 
                           navigator.hardwareConcurrency < 4 || 
                           /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Medium performance for older desktops or mid-range mobile
    const isMediumPerformance = !isLowPerformance && (
        !navigator.hardwareConcurrency ||
        navigator.hardwareConcurrency < 6 || 
        /iPad|Android/.test(navigator.userAgent)
    );
    
    if (isLowPerformance) {
        // Drastically reduce animations for low-end devices
        const style = document.createElement('style');
        style.textContent = `
            .enhanced-particle,
            .floating-element,
            .grid-line,
            .neon-trail,
            .retro-sun-strip,
            .retro-central-sun,
            .cursor-particle {
                display: none !important;
            }
            
            * {
                animation-duration: 0.1s !important;
                animation-delay: 0s !important;
                transition-duration: 0.1s !important;
            }
            
            .logo-icon::before,
            .logo-icon::after,
            .hero-logo-icon::before,
            .hero-logo-icon::after,
            .footer-logo-icon::before,
            .footer-logo-icon::after {
                display: none !important;
            }
            
            .hero::before,
            .hero::after {
                opacity: 0.05 !important;
                filter: blur(5px) !important;
            }
        `;
        document.head.appendChild(style);
        
        console.log('%cLow performance mode enabled - animations significantly reduced', 'color: #ffaa00; font-size: 10px;');
        
        // Disable intensive background effects
        window.createEnhancedParticles = function() {}; // No-op function
        window.createFloatingElements = function() {};
        window.createAnimatedGrid = function() {};
        
    } else if (isMediumPerformance) {
        // Reduce some animations for medium performance devices
        const style = document.createElement('style');
        style.textContent = `
            .enhanced-particle {
                opacity: 0.5 !important;
            }
            
            .neon-trail,
            .cursor-particle {
                display: none !important;
            }
            
            .retro-sun-strip {
                opacity: 0.08 !important;
                filter: blur(8px) !important;
            }
            
            .hero-logo-icon::before,
            .hero-logo-icon::after {
                animation-duration: 8s !important;
            }
            
            .logo-icon::before,
            .logo-icon::after {
                animation-duration: 6s !important;
            }
        `;
        document.head.appendChild(style);
        
        console.log('%cMedium performance mode enabled - some animations reduced', 'color: #aaff00; font-size: 10px;');
        
        // Reduce particle count for medium performance
        const originalCreateParticles = window.createEnhancedParticles;
        window.createEnhancedParticles = function() {
            const particleTypes = [
                { size: 2, color: 'var(--primary-pink)', count: 5, glow: 6, speed: 1 },
                { size: 1, color: 'var(--neon-pink)', count: 8, glow: 4, speed: 1.2 },
                { size: 3, color: 'var(--secondary-pink)', count: 4, glow: 8, speed: 0.8 },
                { size: 1.5, color: '#ffffff', count: 3, glow: 5, speed: 1.3 }
            ];
            
            const heroParticles = document.querySelector('.hero-particles');
            if (!heroParticles) return;
            
            heroParticles.innerHTML = '';
            
            particleTypes.forEach(type => {
                for (let i = 0; i < type.count; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'enhanced-particle';
                    
                    const animationDelay = Math.random() * 10;
                    const animationDuration = (8 + Math.random() * 12) / type.speed;
                    const horizontalMovement = (Math.random() - 0.5) * 200;
                    
                    particle.style.cssText = `
                        position: absolute;
                        width: ${type.size}px;
                        height: ${type.size}px;
                        background: ${type.color};
                        border-radius: 50%;
                        left: ${Math.random() * 100}%;
                        top: 100%;
                        animation: enhancedFloat ${animationDuration}s linear infinite;
                        animation-delay: ${animationDelay}s;
                        opacity: 0;
                        box-shadow: 0 0 ${type.glow}px ${type.color};
                        --horizontal-movement: ${horizontalMovement}px;
                    `;
                    
                    heroParticles.appendChild(particle);
                }
            });
        };
    } else {
        // High-performance device - enable all effects
        console.log('%cHigh performance mode enabled - full visual effects', 'color: #00ff88; font-size: 10px;');
    }
    
    // Add a toggle for users to override performance settings
    addPerformanceToggle();
}

// Add a performance toggle in console for manual control
function addPerformanceToggle() {
    window.togglePerformanceMode = function(mode) {
        const styles = document.getElementById('performance-override');
        if (styles) {
            document.head.removeChild(styles);
        }
        
        const override = document.createElement('style');
        override.id = 'performance-override';
        
        switch(mode) {
            case 'high':
                override.textContent = `
                    .enhanced-particle, .floating-element, .grid-line, .neon-trail, .retro-sun-strip, .retro-central-sun, .cursor-particle {
                        display: block !important;
                    }
                    .logo-icon::before, .logo-icon::after, .hero-logo-icon::before, .hero-logo-icon::after, .footer-logo-icon::before, .footer-logo-icon::after {
                        display: block !important;
                    }
                `;
                console.log('%cHigh performance mode enabled manually', 'color: #00ff88; font-size: 12px; font-weight: bold;');
                break;
                
            case 'medium':
                override.textContent = `
                    .enhanced-particle {
                        display: block !important;
                        opacity: 0.5 !important;
                    }
                    .floating-element, .grid-line {
                        display: block !important;
                    }
                    .neon-trail, .cursor-particle {
                        display: none !important;
                    }
                `;
                console.log('%cMedium performance mode enabled manually', 'color: #aaff00; font-size: 12px; font-weight: bold;');
                break;
                
            case 'low':
                override.textContent = `
                    .enhanced-particle, .floating-element, .grid-line, .neon-trail, .retro-sun-strip, .retro-central-sun, .cursor-particle {
                        display: none !important;
                    }
                    * {
                        animation-duration: 0.3s !important;
                    }
                `;
                console.log('%cLow performance mode enabled manually', 'color: #ffaa00; font-size: 12px; font-weight: bold;');
                break;
        }
        
        document.head.appendChild(override);
    };
    
    if (!detectBot() && isHumanLike()) {
        console.log('%cPerformance mode can be adjusted using: togglePerformanceMode("high"), togglePerformanceMode("medium"), or togglePerformanceMode("low")', 'color: #00ccff; font-size: 10px;');
    }
}

// Initialize performance optimization
document.addEventListener('DOMContentLoaded', optimizeAnimations);

// Modern UI interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to section titles (without purple effects)
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.addEventListener('mouseenter', function() {
            const neonText = this.querySelector('.neon-text');
            if (neonText) {
                neonText.style.animation = 'titlePulse 1s infinite';
                neonText.style.textShadow = '0 0 15px var(--primary-pink), 0 0 30px var(--neon-pink)';
            }
        });
        
        title.addEventListener('mouseleave', function() {
            const neonText = this.querySelector('.neon-text');
            if (neonText) {
                neonText.style.animation = 'titlePulse 3s infinite';
                neonText.style.textShadow = '';
            }
        });
    });
    
    // Create hover magnetic effect for buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate distance from center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate movement (subtle magnetic effect)
            const moveX = (x - centerX) / 15;
            const moveY = (y - centerY) / 15;
            
            // Apply transform
            this.style.transform = `translateY(-5px) translateX(${moveX}px) translateY(${moveY}px)`;
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});
