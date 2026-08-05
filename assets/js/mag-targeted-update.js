/* =====================================================================
   MAG — ATUALIZAÇÃO DIRECIONADA 32.0
   Interações restritas a Quem Somos e Avaliações.
   ===================================================================== */

(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    function initAboutSection() {
        const section = document.querySelector('.about--waves');
        if (!section) return;

        section.classList.add('about-targeted-motion');

        if (reduceMotion || !('IntersectionObserver' in window)) {
            section.classList.add('is-in-view');
        } else {
            const observer = new IntersectionObserver((entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-in-view');
                    currentObserver.unobserve(entry.target);
                });
            }, {
                threshold: 0.12,
                rootMargin: '0px 0px -7% 0px'
            });

            observer.observe(section);
        }

        if (!finePointer || reduceMotion) return;

        const visual = section.querySelector('.about-waves__visual');
        const image = section.querySelector('.about-waves__image-shell');
        if (!visual || !image) return;

        visual.addEventListener('pointermove', (event) => {
            const rect = visual.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            const rotateY = ((event.clientX - rect.left) / rect.width - .5) * 5;
            const rotateX = ((event.clientY - rect.top) / rect.height - .5) * -4;

            image.style.setProperty('--about-tilt-x', `${rotateY}deg`);
            image.style.setProperty('--about-tilt-y', `${rotateX}deg`);
        }, { passive:true });

        visual.addEventListener('pointerleave', () => {
            image.style.setProperty('--about-tilt-x', '0deg');
            image.style.setProperty('--about-tilt-y', '0deg');
        });
    }

    function initReviewStack() {
        const section = document.querySelector('.google-reviews--stacked');
        const carousel = section?.querySelector('[data-reviews-carousel]');
        const viewport = carousel?.querySelector('.reviews-carousel__viewport');
        const track = carousel?.querySelector('.reviews-carousel__track');
        const cards = track ? [...track.querySelectorAll('.google-review-card')] : [];
        const previousButton = carousel?.querySelector('.reviews-carousel__button--prev');
        const nextButton = carousel?.querySelector('.reviews-carousel__button--next');
        const dotsContainer = section?.querySelector('.reviews-carousel__dots');

        if (!section || !carousel || !viewport || !track || !cards.length || !dotsContainer) return;

        const desktopMedia = window.matchMedia('(min-width: 801px)');
        let currentIndex = 0;
        let autoplayTimer = 0;
        let scrollFrame = 0;
        let pointerStartX = null;

        const stackPositions = {
            0:  { x: 0,    y: 42,  r: 0,    s: 1,    z: 12, opacity: 1 },
            '-1': { x: -245, y: 74,  r: -8.5, s: .94, z: 9,  opacity: 1 },
            1:  { x: 245,  y: 74,  r: 8.5,  s: .94, z: 9,  opacity: 1 },
            '-2': { x: -118, y: -105, r: -3.5, s: .875, z: 5, opacity: .88 },
            2:  { x: 128,  y: -108, r: 4.2,  s: .875, z: 5, opacity: .88 }
        };

        function circularDifference(index, active) {
            let difference = index - active;
            const half = cards.length / 2;

            if (difference > half) difference -= cards.length;
            if (difference < -half) difference += cards.length;

            return difference;
        }

        function createDots() {
            dotsContainer.innerHTML = '';

            cards.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'reviews-carousel__dot';
                dot.setAttribute('aria-label', `Ir para avaliação ${index + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    render(true);
                    restartAutoplay();
                });
                dotsContainer.appendChild(dot);
            });
        }

        function updateDots() {
            [...dotsContainer.children].forEach((dot, index) => {
                const active = index === currentIndex;
                dot.classList.toggle('active', active);
                dot.setAttribute('aria-current', active ? 'true' : 'false');
            });
        }

        function applyDesktopStack() {
            cards.forEach((card, index) => {
                const position = circularDifference(index, currentIndex);
                const config = stackPositions[position];
                const visible = Boolean(config);

                card.dataset.stackPosition = visible ? String(position) : 'hidden';
                card.dataset.stackVisible = visible ? 'true' : 'false';
                card.setAttribute('aria-hidden', visible ? 'false' : 'true');
                card.tabIndex = visible ? 0 : -1;

                card.style.setProperty('--stack-x', `${config?.x ?? 0}px`);
                card.style.setProperty('--stack-y', `${config?.y ?? 0}px`);
                card.style.setProperty('--stack-r', `${config?.r ?? 0}deg`);
                card.style.setProperty('--stack-s', String(config?.s ?? .78));
                card.style.setProperty('--stack-z', String(config?.z ?? 0));
                card.style.setProperty('--stack-opacity', String(config?.opacity ?? 0));
            });
        }

        function centerMobileCard(smooth = true) {
            const card = cards[currentIndex];
            if (!card) return;

            const target = card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2;
            track.scrollTo({
                left: Math.max(0, target),
                behavior: smooth && !reduceMotion ? 'smooth' : 'auto'
            });
        }

        function applyMobileCarousel(smooth = true) {
            cards.forEach((card, index) => {
                card.dataset.stackPosition = String(index - currentIndex);
                card.dataset.stackVisible = 'true';
                card.setAttribute('aria-hidden', 'false');
                card.tabIndex = 0;
            });

            requestAnimationFrame(() => centerMobileCard(smooth));
        }

        function render(smooth = true) {
            if (desktopMedia.matches) {
                applyDesktopStack();
            } else {
                applyMobileCarousel(smooth);
            }
            updateDots();
        }

        function goTo(index) {
            currentIndex = (index + cards.length) % cards.length;
            render(true);
        }

        function next() {
            goTo(currentIndex + 1);
        }

        function previous() {
            goTo(currentIndex - 1);
        }

        function stopAutoplay() {
            window.clearInterval(autoplayTimer);
            autoplayTimer = 0;
        }

        function startAutoplay() {
            stopAutoplay();
        }

        function restartAutoplay() {
            startAutoplay();
        }

        previousButton?.addEventListener('click', () => {
            previous();
            restartAutoplay();
        });

        nextButton?.addEventListener('click', () => {
            next();
            restartAutoplay();
        });

        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (!desktopMedia.matches || index === currentIndex) return;
                currentIndex = index;
                render(true);
                restartAutoplay();
            });

            card.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                currentIndex = index;
                render(true);
                restartAutoplay();
            });
        });

        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        carousel.addEventListener('focusin', stopAutoplay);
        carousel.addEventListener('focusout', startAutoplay);

        carousel.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                next();
                restartAutoplay();
            }
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                previous();
                restartAutoplay();
            }
        });

        track.addEventListener('scroll', () => {
            if (desktopMedia.matches) return;
            window.cancelAnimationFrame(scrollFrame);
            scrollFrame = window.requestAnimationFrame(() => {
                const viewportCenter = track.scrollLeft + viewport.clientWidth / 2;
                let nearestIndex = currentIndex;
                let nearestDistance = Number.POSITIVE_INFINITY;

                cards.forEach((card, index) => {
                    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                    const distance = Math.abs(cardCenter - viewportCenter);
                    if (distance < nearestDistance) {
                        nearestDistance = distance;
                        nearestIndex = index;
                    }
                });

                if (nearestIndex !== currentIndex) {
                    currentIndex = nearestIndex;
                    updateDots();
                }
            });
        }, { passive: true });

        track.addEventListener('pointerdown', (event) => {
            pointerStartX = event.clientX;
            carousel.classList.add('is-dragging');
        }, { passive: true });

        track.addEventListener('pointerup', (event) => {
            carousel.classList.remove('is-dragging');
            if (pointerStartX === null || !desktopMedia.matches) {
                pointerStartX = null;
                return;
            }

            const distance = event.clientX - pointerStartX;
            pointerStartX = null;

            if (Math.abs(distance) < 45) return;
            distance < 0 ? next() : previous();
            restartAutoplay();
        }, { passive: true });

        track.addEventListener('pointercancel', () => {
            pointerStartX = null;
            carousel.classList.remove('is-dragging');
        }, { passive:true });


        if (finePointer && !reduceMotion) {
            carousel.addEventListener('pointermove', (event) => {
                if (!desktopMedia.matches) return;
                const rect = carousel.getBoundingClientRect();
                if (!rect.width || !rect.height) return;

                const x = ((event.clientX - rect.left) / rect.width - .5) * 10;
                const y = ((event.clientY - rect.top) / rect.height - .5) * 7;

                carousel.style.setProperty('--stack-drift-x', `${x}px`);
                carousel.style.setProperty('--stack-drift-y', `${y}px`);
            }, { passive: true });

            carousel.addEventListener('pointerleave', () => {
                pointerStartX = null;
                carousel.classList.remove('is-dragging');
                carousel.style.setProperty('--stack-drift-x', '0px');
                carousel.style.setProperty('--stack-drift-y', '0px');
            });
        }

        desktopMedia.addEventListener('change', () => {
            stopAutoplay();
            render(false);
            startAutoplay();
        });

        window.addEventListener('resize', () => {
            if (!desktopMedia.matches) render(false);
        }, { passive: true });

        createDots();
        render(false);
        startAutoplay();
    }

    function init() {
        initAboutSection();
        initReviewStack();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
