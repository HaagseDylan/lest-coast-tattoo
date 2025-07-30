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
    document.documentElement.lang = lang; // Update de HTML lang-attribuut
    document.title = translations[lang].title; // Update de pagina titel
}

// Laad media voor de portfolio
async function loadPortfolio() {
    const response = await fetch('media.json');
    const mediaItems = await response.json();
    const gallery = document.getElementById('portfolio-gallery');
    gallery.innerHTML = ''; // Leeg de galerij

    mediaItems.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');

        if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt;
            galleryItem.appendChild(img);
        } else if (item.type === 'video') {
            const video = document.createElement('video');
            video.src = item.src;
            video.poster = item.poster || '';
            video.controls = true;
            galleryItem.appendChild(video);
        }

        gallery.appendChild(galleryItem);
    });
}

// Hoofd functie om de taal in te stellen
async function setLanguage(lang) {
    const translations = await loadTranslations();
    applyTranslations(translations, lang);
    localStorage.setItem('preferredLanguage', lang); // Sla de voorkeur op
    document.getElementById('language-select').value = lang; // Update dropdown
}

// Laad de opgeslagen taal en portfolio bij het laden van de pagina
document.addEventListener('DOMContentLoaded', async () => {
    const savedLang = localStorage.getItem('preferredLanguage') || 'nl';
    await setLanguage(savedLang);
    await loadPortfolio(); // Laad de portfolio

    // Event listener voor taalwijziging
    document.getElementById('language-select').addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });

    // Contactformulier verzending
    document.getElementById('contact-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const translations = await loadTranslations();
        const lang = localStorage.getItem('preferredLanguage') || 'nl';
        alert(translations[lang].form_success);
        e.target.reset();
    });
});