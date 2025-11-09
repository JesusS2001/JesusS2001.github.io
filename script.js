// Optimización de rendimiento - Lazy loading y debouncing
const lazyLoadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            lazyLoadObserver.unobserve(img);
        }
    });
});

// Debounce para optimizar eventos
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Función para ocultar preloader
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    
    // Ocultar preloader después de que todo esté cargado
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 300);
    });
    
    // Fallback: ocultar después de 3 segundos máximo
    setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 3000);
});

// Función para alternar entre modo claro y oscuro
document.addEventListener('DOMContentLoaded', () => {
    const backgroundVideo = document.querySelector('.background-video');
    
    // Inicializar componentes con prioridad
    initCriticalComponents();
    
    // Cargar componentes no críticos después
    setTimeout(() => {
        initBackgroundVideo();
        initTracking();
    }, 100);
    
    // Función para inicializar componentes críticos primero
    function initCriticalComponents() {
        // Configurar lazy loading para imágenes
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => lazyLoadObserver.observe(img));
        
        // Animaciones de entrada optimizadas
        requestAnimationFrame(() => {
            const links = document.querySelectorAll('.link-btn');
            links.forEach((link, index) => {
                link.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
                link.style.opacity = '0';
            });
        });
    }
    
    // Función para inicializar el sistema de tracking
    function initTracking() {
        // Registrar visita
        recordVisit();
        
        // Configurar tracking de clics
        setupClickTracking();
    }
    
    // Función para registrar una visita
    function recordVisit() {
        const today = new Date().toDateString();
        let visits = JSON.parse(localStorage.getItem('biolink_visits') || '{}');
        
        // Incrementar contador de visitas del día
        visits[today] = (visits[today] || 0) + 1;
        
        // Mantener solo los últimos 30 días
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        Object.keys(visits).forEach(date => {
            if (new Date(date) < thirtyDaysAgo) {
                delete visits[date];
            }
        });
        
        localStorage.setItem('biolink_visits', JSON.stringify(visits));
        
        // Registrar visita total
        let totalVisits = parseInt(localStorage.getItem('biolink_total_visits') || '0');
        totalVisits++;
        localStorage.setItem('biolink_total_visits', totalVisits.toString());
    }
    
    // Función para configurar el tracking de clics
    function setupClickTracking() {
        const trackableLinks = document.querySelectorAll('.trackable-link');
        
        trackableLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const platform = this.getAttribute('data-platform');
                recordClick(platform);
            });
        });
    }
    
    // Función para registrar un clic
    function recordClick(platform) {
        let clicks = JSON.parse(localStorage.getItem('biolink_clicks') || '{}');
        const today = new Date().toDateString();
        
        // Inicializar estructura si no existe
        if (!clicks[today]) {
            clicks[today] = {};
        }
        
        // Incrementar contador de clics para la plataforma
        clicks[today][platform] = (clicks[today][platform] || 0) + 1;
        
        // Mantener solo los últimos 30 días
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        Object.keys(clicks).forEach(date => {
            if (new Date(date) < thirtyDaysAgo) {
                delete clicks[date];
            }
        });
        
        localStorage.setItem('biolink_clicks', JSON.stringify(clicks));
        
    }
    
    // Función para inicializar el fondo animado
    function initBackgroundVideo() {
        // Asegurarse de que el fondo se cargue correctamente
        if (backgroundVideo) {
            backgroundVideo.addEventListener('load', () => {
                console.log('Fondo animado cargado correctamente');
            });
        }
    }
    
    // Efectos de ondulación optimizados para enlaces
    const setupRippleEffect = debounce(() => {
        const links = document.querySelectorAll('.link-btn');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                this.appendChild(ripple);
                
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                requestAnimationFrame(() => {
                    setTimeout(() => ripple.remove(), 600);
                });
            });
        });
    }, 100);
    
    // Efecto hover optimizado para foto de perfil
    const setupProfileHover = debounce(() => {
        const profilePhoto = document.querySelector('.profile-photo');
        if (profilePhoto) {
            profilePhoto.addEventListener('mouseenter', () => {
                profilePhoto.style.transform = 'scale(1.05) rotate(5deg)';
            });
            
            profilePhoto.addEventListener('mouseleave', () => {
                profilePhoto.style.transform = 'scale(1)';
            });
        }
    }, 100);
    
    // Inicializar efectos
    setupRippleEffect();
    setupProfileHover();
});

// Scroll animado optimizado con Intersection Observer
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observar elementos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.link-btn, .profile-header, .social-icons');
    elements.forEach(element => scrollObserver.observe(element));
});