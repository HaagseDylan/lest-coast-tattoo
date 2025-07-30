// Laad vertalingen uit JSON-bestand
async function loadTranslations() {
    const response = await fetch('translations.json');
    return await response.json();
}

// Pas de inhoud van de pagina aan op basis van de geselecteerde taal
function applyTranslations(translations, lang) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translations[lang][key];
    });
    document.documentElement.lang = lang;
    document.title = translations[lang].title;
}

// Laad media voor de portfolio
async function loadPortfolio() {
    const response = await fetch('media.json');
    const mediaItems = await response.json();
    const gallery = document.getElementById('portfolio-gallery');
    gallery.innerHTML = '';

    mediaItems.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');

        const link = document.createElement('a');
        link.classList.add('glightbox');
        link.href = item.src;
        link.setAttribute('data-type', item.type);

        if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt;
            link.appendChild(img);
        } else if (item.type === 'video') {
            const video = document.createElement('video');
            video.src = item.src;
            video.poster = item.poster || '';
            video.controls = true;
            link.setAttribute('data-type', 'video');
            link.appendChild(video);
        }

        galleryItem.appendChild(link);
        gallery.appendChild(galleryItem);
    });

    // Initialize GLightbox
    const lightbox = GLightbox({
        touchNavigation: true,
        loop: true,
        autoplayVideos: false
    });

    // Trigger fade-in animations on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.gallery-item').forEach(item => {
        observer.observe(item);
    });
}

// Hoofd functie om de taal in te stellen
async function setLanguage(lang) {
    const translations = await loadTranslations();
    applyTranslations(translations, lang);
    localStorage.setItem('preferredLanguage', lang);
    document.getElementById('language-select').value = lang;
}

// Sticky navigation on scroll
function handleScroll() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Laad de opgeslagen taal en portfolio bij het laden van de pagina
document.addEventListener('DOMContentLoaded', async () => {
    const savedLang = localStorage.getItem('preferredLanguage') || 'nl';
    await setLanguage(savedLang);
    await loadPortfolio();

    document.getElementById('language-select').addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });

    document.getElementById('contact-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const translations = await loadTranslations();
        const lang = localStorage.getItem('preferredLanguage') || 'nl';
        alert(translations[lang].form_success);
        e.target.reset();
    });

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
});