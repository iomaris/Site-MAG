/* =====================================================================
   MAG PEÇAS E SERVIÇOS — SOMENTE MOVIMENTO
   Sem elementos decorativos novos, sem mudanças de cores ou de layout.
   ===================================================================== */

(() => {
    'use strict';

    const doc = document;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const qsa = (selector, root = doc) => [...root.querySelectorAll(selector)];

    function initScrollReveal() {
        const groups = [
            ['.section-title, .product-catalog__header, .clients-showcase__header, .experience-header', ''],
            ['.differential-card, .service-card, .advantage, .google-review-card', 'mag-motion-scale'],
            ['.brand-item, .gallery-grid img, .contact-information article', ''],
            ['.about-image, .leadership-card', 'mag-motion-left'],
            ['.about-content, .contact-right form, .map-location__card', 'mag-motion-right']
        ];

        const items = [];

        groups.forEach(([selector, direction]) => {
            qsa(selector).forEach((element, index) => {
                // Os cards de produtos já possuem sua própria animação no app.js original.
                if (element.matches('[data-product-reveal]')) return;
                if (element.classList.contains('mag-motion-reveal')) return;

                element.classList.add('mag-motion-reveal');
                if (direction) element.classList.add(direction);
                element.style.setProperty('--mag-motion-delay', `${Math.min((index % 5) * 75, 300)}ms`);
                items.push(element);
            });
        });

        if (reduceMotion || !('IntersectionObserver' in window)) {
            items.forEach(item => item.classList.add('mag-motion-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('mag-motion-visible');
                currentObserver.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -7% 0px'
        });

        items.forEach(item => observer.observe(item));
    }

    function initCardTilt() {
        if (!finePointer || reduceMotion) return;

        const cards = qsa([
            '.product-hero-card',
            '.product-category-card',
            '.differential-card',
            '.service-card',
            '.google-review-card',
            '.leadership-card',
            '.brand-item'
        ].join(','));

        cards.forEach(card => {
            card.classList.add('mag-motion-tilt');

            const image = card.querySelector('img');
            if (image) image.classList.add('mag-motion-image');

            card.addEventListener('pointermove', event => {
                const rect = card.getBoundingClientRect();
                if (!rect.width || !rect.height) return;

                const px = (event.clientX - rect.left) / rect.width;
                const py = (event.clientY - rect.top) / rect.height;
                const strength = card.matches('.product-hero-card') ? 1.5 : 3.2;
                const rotateY = (px - .5) * strength;
                const rotateX = (.5 - py) * strength;
                const lift = card.matches('.brand-item') ? 2 : 5;

                card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-${lift}px)`;

                if (image) {
                    const moveX = (px - .5) * -8;
                    const moveY = (py - .5) * -6;
                    image.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.035)`;
                }
            }, { passive: true });

            card.addEventListener('pointerleave', () => {
                card.style.transform = '';
                if (image) image.style.transform = '';
            });
        });
    }

    function initMagneticControls() {
        if (!finePointer || reduceMotion) return;

        qsa('.btn-outline, .google-reviews__link, .map-location__button').forEach(control => {
            control.addEventListener('pointermove', event => {
                const rect = control.getBoundingClientRect();
                const x = event.clientX - rect.left - rect.width / 2;
                const y = event.clientY - rect.top - rect.height / 2;
                control.style.transform = `translate3d(${x * .08}px, ${y * .10}px, 0)`;
            }, { passive: true });

            control.addEventListener('pointerleave', () => {
                control.style.transform = '';
            });
        });
    }

    function improveControls() {
        qsa('a[target="_blank"]').forEach(link => {
            const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
            rel.add('noopener');
            rel.add('noreferrer');
            link.setAttribute('rel', [...rel].join(' '));
        });
    }

    function init() {
        initScrollReveal();
        initCardTilt();
        initMagneticControls();
        improveControls();
    }

    if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
