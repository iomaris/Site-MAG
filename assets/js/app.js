/*==========================================================
MAG INDUSTRIAL
Main Javascript
==========================================================*/

"use strict";

/*==========================================================
SELECTORS
==========================================================*/

const body = document.body;

const header = document.querySelector(".header");

const loader = document.querySelector(".loader");

const backTop = document.querySelector(".back-top");

const mobileButton = document.querySelector(".menu-mobile");

const navbar = document.querySelector(".navbar");

const sections = document.querySelectorAll("section");

const fadeElements = document.querySelectorAll(

    ".fade-up, .fade-left, .fade-right, .zoom"

);

/*==========================================================
LOADER
==========================================================*/

window.addEventListener("load", () => {

    if (!loader) return;

    loader.style.opacity = "0";

    loader.style.visibility = "hidden";

    loader.style.pointerEvents = "none";

    loader.style.transition = ".8s ease";

    setTimeout(() => {

        loader.remove();

    }, 900);

});

/*==========================================================
HEADER
==========================================================*/

function headerScroll(){

    if(!header) return;

    if(window.scrollY > 60){

        header.classList.add("scrolled");

    }else{

        header.classList.remove("scrolled");

    }

}

headerScroll();

window.addEventListener("scroll", headerScroll);

/*==========================================================
BACK TO TOP
==========================================================*/

function toggleBackTop(){

    if(!backTop) return;

    if(window.scrollY > 600){

        backTop.classList.add("show");

    }else{

        backTop.classList.remove("show");

    }

}

toggleBackTop();

window.addEventListener("scroll", toggleBackTop);

if(backTop){

    backTop.addEventListener("click", e=>{

        e.preventDefault();

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}

/*==========================================================
SMOOTH LINKS
==========================================================*/

document.querySelectorAll('a[href^="#"]').forEach(link=>{

    link.addEventListener("click",e=>{

        const id = link.getAttribute("href");

        if(id === "#") return;

        const section = document.querySelector(id);

        if(!section) return;

        e.preventDefault();

        section.scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

    });

});


const observer = new IntersectionObserver(

(entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},

{

    threshold:.15,

    rootMargin:"0px 0px -80px 0px"

}

);

fadeElements.forEach(element=>{

    observer.observe(element);

});



const counters = document.querySelectorAll("[data-counter]");

const counterObserver = new IntersectionObserver(

(entries)=>{

    entries.forEach(entry=>{

        if(!entry.isIntersecting) return;

        const counter = entry.target;

        const target = Number(counter.dataset.counter);

        const duration = 2200;

        const startTime = performance.now();

        function update(now){

            const progress = Math.min((now-startTime)/duration,1);

            const value = Math.floor(progress*target);

            counter.textContent = value.toLocaleString("pt-BR");

            if(progress<1){

                requestAnimationFrame(update);

            }else{

                counter.textContent = target.toLocaleString("pt-BR");

            }

        }

        requestAnimationFrame(update);

        counterObserver.unobserve(counter);

    });

},

{

    threshold:.5

}

);

counters.forEach(counter=>{

    counterObserver.observe(counter);

});

/*==========================================================
MENU MOBILE
==========================================================*/

function setMobileMenu(open){

    if(!mobileButton || !navbar) return;

    navbar.classList.toggle("active", open);

    mobileButton.classList.toggle("active", open);

    body.classList.toggle("menu-open", open);

    mobileButton.setAttribute("aria-expanded", String(open));

    mobileButton.setAttribute(
        "aria-label",
        open ? "Fechar menu" : "Abrir menu"
    );

}

if(mobileButton && navbar){

    mobileButton.addEventListener("click",()=>{

        setMobileMenu(!navbar.classList.contains("active"));

    });

}

document.querySelectorAll(".navbar a").forEach(link=>{

    link.addEventListener("click",()=>{

        setMobileMenu(false);

    });

});

document.addEventListener("keydown",event=>{

    if(event.key === "Escape"){

        setMobileMenu(false);

    }

});

window.addEventListener("resize",()=>{

    if(window.innerWidth > 992){

        setMobileMenu(false);

    }

});

/*==========================================================
ACTIVE MENU
==========================================================*/

const menuLinks = document.querySelectorAll(".navbar a");

function activeMenu(){

    let current = "";

    sections.forEach(section=>{

        const top = section.offsetTop - 180;

        const height = section.offsetHeight;

        if(window.scrollY >= top){

            current = section.getAttribute("id");

        }

    });

    menuLinks.forEach(link=>{

        link.classList.remove("active");

        const href = link.getAttribute("href");

        if(href === "#" + current){

            link.classList.add("active");

        }

    });

}

window.addEventListener("scroll",activeMenu);

activeMenu();

/*==========================================================
PARALLAX HERO
==========================================================*/

const hero = document.querySelector(".hero");

const heroVideo = document.querySelector(".hero video");

window.addEventListener("scroll",()=>{

    if(!hero || !heroVideo) return;

    const offset = window.scrollY;

    heroVideo.style.transform = `translateY(${offset*0.18}px) scale(1.08)`;

});

/*==========================================================
BUTTON RIPPLE
==========================================================*/

document.querySelectorAll(".btn-primary,.btn-secondary").forEach(button=>{

    button.addEventListener("mouseenter",()=>{

        button.style.transition=".35s";

    });

});

/*==========================================================
GALLERY EFFECT
==========================================================*/

document.querySelectorAll(".gallery img").forEach(image=>{

    image.addEventListener("mousemove",(e)=>{

        const rect = image.getBoundingClientRect();

        const x = e.clientX - rect.left;

        const y = e.clientY - rect.top;

        image.style.transformOrigin = `${x}px ${y}px`;

    });

});

/*==========================================================
SCROLL PROGRESS
==========================================================*/

const progressBar = document.createElement("div");

progressBar.className = "scroll-progress";

document.body.appendChild(progressBar);

window.addEventListener("scroll",()=>{

    const scroll = window.scrollY;

    const height = document.documentElement.scrollHeight-window.innerHeight;

    const width = (scroll/height)*100;

    progressBar.style.width = width+"%";

});

/*==========================================================
CURRENT YEAR
==========================================================*/

const year = document.querySelector(".current-year");

if(year){

    year.textContent = new Date().getFullYear();

}
/*==========================================================
MAG UI
Parte 03
==========================================================*/

/*==========================================================
HEADER SHADOW
==========================================================*/

const updateHeader = () => {

    if (!header) return;

    if (window.scrollY > 120) {

        header.style.boxShadow =
            "0 20px 50px rgba(0,0,0,.12)";

    } else {

        header.style.boxShadow = "none";

    }

};

window.addEventListener("scroll", updateHeader);

updateHeader();

/*==========================================================
BUTTON HOVER
==========================================================*/

document.querySelectorAll(".btn-primary,.btn-secondary").forEach(btn => {

    btn.addEventListener("mouseenter", () => {

        btn.style.transform = "translateY(-4px)";

    });

    btn.addEventListener("mouseleave", () => {

        btn.style.transform = "";

    });

});

/*==========================================================
CARD HOVER
==========================================================*/

document.querySelectorAll(

".product-card,.service-card,.number-card,.advantage"

).forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transition=".35s";

    });

});

/*==========================================================
IMAGE REVEAL
==========================================================*/

document.querySelectorAll(".product-image img, .product-feature__image img").forEach(image=>{

    image.loading="lazy";

});

/*==========================================================
PARALLAX ELEMENTS
==========================================================*/

const parallax = document.querySelectorAll("[data-parallax]");

window.addEventListener("scroll",()=>{

    const scroll = window.pageYOffset;

    parallax.forEach(item=>{

        const speed = item.dataset.parallax || .15;

        item.style.transform =
        `translateY(${scroll*speed}px)`;

    });

});

/*==========================================================
SECTION REVEAL
==========================================================*/

const revealSections = document.querySelectorAll("section");

const revealObserver = new IntersectionObserver(

(entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},

{

    threshold:.08

}

);

revealSections.forEach(section=>{

    revealObserver.observe(section);

});

/*==========================================================
INPUT LABEL
==========================================================*/

document.querySelectorAll("input,textarea").forEach(field=>{

    field.addEventListener("focus",()=>{

        field.parentElement.classList.add("focus");

    });

    field.addEventListener("blur",()=>{

        if(field.value===""){

            field.parentElement.classList.remove("focus");

        }

    });

});

/*==========================================================
DISABLE RIGHT CLICK VIDEO
==========================================================*/

if(heroVideo){

    heroVideo.addEventListener("contextmenu",(e)=>{

        e.preventDefault();

    });

}

/*==========================================================
PRELOAD IMAGES
==========================================================*/

const preload = [];

document.querySelectorAll("img").forEach(img=>{

    if(img.src){

        const image = new Image();

        image.src = img.src;

        preload.push(image);

    }

});

/*==========================================================
CONSOLE
==========================================================*/

console.log(

"%cMAG INDUSTRIAL",

"color:#0057B8;font-size:22px;font-weight:bold;"

);

console.log(

"%cWebsite desenvolvido por MAG.",

"color:#666;font-size:13px;"

);

/*==========================================================
END
==========================================================*/
/*==========================================================
MAG UI
Parte 04
==========================================================*/

/*==========================================================
MOUSE GLOW
==========================================================*/

const glow = document.createElement("div");

glow.className = "mouse-glow";

document.body.appendChild(glow);

window.addEventListener("mousemove",(e)=>{

    glow.style.left = e.clientX + "px";

    glow.style.top = e.clientY + "px";

});

/*==========================================================
MAGNETIC BUTTON
==========================================================*/

document.querySelectorAll(".btn-primary,.btn-secondary").forEach(button=>{

    button.addEventListener("mousemove",(e)=>{

        const rect = button.getBoundingClientRect();

        const x = e.clientX - rect.left - rect.width/2;

        const y = e.clientY - rect.top - rect.height/2;

        button.style.transform =
        `translate(${x*0.12}px,${y*0.12}px)`;

    });

    button.addEventListener("mouseleave",()=>{

        button.style.transform="translate(0,0)";

    });

});

/*==========================================================
TILT CARDS
==========================================================*/

document.querySelectorAll(

".product-card,.service-card,.number-card"

).forEach(card=>{

    card.addEventListener("mousemove",(e)=>{

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;

        const y = e.clientY - rect.top;

        const rotateY = ((x / rect.width)-0.5)*8;

        const rotateX = ((y / rect.height)-0.5)*-8;

        card.style.transform =

        `perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)`;

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="";

    });

});

/*==========================================================
HEADER AUTO HIDE
==========================================================*/

let lastScroll = 0;

window.addEventListener("scroll",()=>{

    if(!header) return;

    const current = window.pageYOffset;

    if(current > lastScroll && current > 180){

        header.style.transform="translateY(-110%)";

    }else{

        header.style.transform="translateY(0)";

    }

    lastScroll = current;

});

/*==========================================================
BUTTON CLICK
==========================================================*/

/*
 * O antigo efeito ripple inseria um <span> do tamanho do botão dentro do
 * próprio flex container. Em telas touch isso aumentava temporariamente a
 * largura/altura dos botões. O efeito foi removido para manter as dimensões
 * estáveis ao tocar ou clicar.
 */

/*==========================================================
HERO TITLE ANIMATION
==========================================================*/

const heroTitle = document.querySelector(".hero h1");

if(heroTitle){

    heroTitle.style.opacity="0";

    heroTitle.style.transform="translateY(40px)";

    setTimeout(()=>{

        heroTitle.style.transition="1s ease";

        heroTitle.style.opacity="1";

        heroTitle.style.transform="translateY(0)";

    },350);

}

/*==========================================================
HERO PARAGRAPH
==========================================================*/

const heroText = document.querySelector(".hero p");

if(heroText){

    heroText.style.opacity="0";

    heroText.style.transform="translateY(30px)";

    setTimeout(()=>{

        heroText.style.transition=".9s ease";

        heroText.style.opacity="1";

        heroText.style.transform="translateY(0)";

    },700);

}

/*==========================================================
BUTTONS ANIMATION
==========================================================*/

document.querySelectorAll(".hero .btn-primary,.hero .btn-secondary")

.forEach((button,index)=>{

    button.style.opacity="0";

    button.style.transform="translateY(25px)";

    setTimeout(()=>{

        button.style.transition=".8s ease";

        button.style.opacity="1";

        button.style.transform="translateY(0)";

    },900+(index*180));

});

/*==========================================================
ACTIVE SECTION
==========================================================*/

const revealTitles = document.querySelectorAll(".section-title");

window.addEventListener("scroll",()=>{

    revealTitles.forEach(title=>{

        const top = title.getBoundingClientRect().top;

        if(top < window.innerHeight*0.85){

            title.classList.add("show");

        }

    });

});

/*==========================================================
IMAGE FADE
==========================================================*/

document.querySelectorAll(".about img,.gallery img").forEach(img=>{

    img.addEventListener("load",()=>{

        img.style.opacity="1";

    });

});

/* =====================================================
   CARROSSEL DE AVALIAÇÕES DO GOOGLE
===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const carousel = document.querySelector('[data-reviews-carousel]');

    if (!carousel) {
        return;
    }

    const track = carousel.querySelector('.reviews-carousel__track');
    const cards = [...carousel.querySelectorAll('.google-review-card')];
    const previousButton = carousel.querySelector(
        '.reviews-carousel__button--prev'
    );
    const nextButton = carousel.querySelector(
        '.reviews-carousel__button--next'
    );
    const dotsContainer = document.querySelector(
        '.reviews-carousel__dots'
    );

    if (!track || cards.length === 0 || !dotsContainer) {
        return;
    }

    let currentIndex = 0;
    let autoplayTimer;

    function getCardStep() {

        const firstCard = cards[0];
        const trackStyles = window.getComputedStyle(track);
        const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;

        return firstCard.getBoundingClientRect().width + gap;

    }

    function getVisibleCards() {

        const step = getCardStep();

        return Math.max(
            1,
            Math.round(track.clientWidth / step)
        );

    }

    function getMaximumIndex() {

        return Math.max(
            0,
            cards.length - getVisibleCards()
        );

    }

    function createDots() {

        dotsContainer.innerHTML = '';

        cards.forEach((_, index) => {

            const dot = document.createElement('button');

            dot.type = 'button';
            dot.className = 'reviews-carousel__dot';
            dot.setAttribute(
                'aria-label',
                `Ir para avaliação ${index + 1}`
            );

            dot.addEventListener('click', () => {

                currentIndex = Math.min(
                    index,
                    getMaximumIndex()
                );

                moveCarousel();
                restartAutoplay();

            });

            dotsContainer.appendChild(dot);

        });

    }

    function updateDots() {

        const dots = dotsContainer.querySelectorAll(
            '.reviews-carousel__dot'
        );

        dots.forEach((dot, index) => {

            dot.classList.toggle(
                'active',
                index === currentIndex
            );

        });

    }

    function moveCarousel() {

        const maximumIndex = getMaximumIndex();

        currentIndex = Math.min(
            Math.max(currentIndex, 0),
            maximumIndex
        );

        track.scrollTo({
            left:currentIndex * getCardStep(),
            behavior:'smooth'
        });

        updateDots();

    }

    function goToNextReview() {

        const maximumIndex = getMaximumIndex();

        if (currentIndex >= maximumIndex) {
            currentIndex = 0;
        } else {
            currentIndex += 1;
        }

        moveCarousel();

    }

    function goToPreviousReview() {

        const maximumIndex = getMaximumIndex();

        if (currentIndex <= 0) {
            currentIndex = maximumIndex;
        } else {
            currentIndex -= 1;
        }

        moveCarousel();

    }

    function startAutoplay() {

        if (
            window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches
        ) {
            return;
        }

        autoplayTimer = window.setInterval(
            goToNextReview,
            4500
        );

    }

    function stopAutoplay() {

        window.clearInterval(autoplayTimer);

    }

    function restartAutoplay() {

        stopAutoplay();
        startAutoplay();

    }

    previousButton?.addEventListener('click', () => {

        goToPreviousReview();
        restartAutoplay();

    });

    nextButton?.addEventListener('click', () => {

        goToNextReview();
        restartAutoplay();

    });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    track.addEventListener('scroll', () => {

        const step = getCardStep();

        if (step <= 0) {
            return;
        }

        currentIndex = Math.round(track.scrollLeft / step);
        updateDots();

    }, { passive:true });

    window.addEventListener('resize', () => {

        currentIndex = Math.min(
            currentIndex,
            getMaximumIndex()
        );

        moveCarousel();

    });

    createDots();
    moveCarousel();
    startAutoplay();

});
/* =====================================================
   ANIMAÇÕES DA LINHA DO TEMPO MAG
===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const historySection = document.querySelector(
        '[data-history-section]'
    );

    if (!historySection) {
        return;
    }

    const historyItems = historySection.querySelectorAll(
        '[data-history-item]'
    );

    const historyTimeline = historySection.querySelector(
        '.mag-history__timeline'
    );

    const historyFinish = historySection.querySelector(
        '.mag-history__finish'
    );

    function updateHistoryGeometry() {

        if (!historyTimeline || !historyFinish) {
            return;
        }

        /*
           No mobile, a linha precisa terminar exatamente no topo do
           cartão final. A medida é calculada pelo layout real, evitando
           valores fixos que quebram quando o texto muda de altura.
        */
        historyTimeline.style.setProperty(
            '--history-mobile-rail-height',
            `${Math.max(0, historyFinish.offsetTop)}px`
        );

    }

    historySection.classList.add('history-ready');

    /* Entrada dos cartões */

    const historyObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-visible');

                historyObserver.unobserve(entry.target);

            });

        },
        {
            threshold:0.24,
            rootMargin:'0px 0px -8% 0px'
        }
    );

    historyItems.forEach((item) => {
        historyObserver.observe(item);
    });

    /* Progresso azul acompanhando o scroll */

    let animationFrame = null;

    function updateHistoryProgress() {

        const sectionRect =
            historySection.getBoundingClientRect();

        const viewportHeight =
            window.innerHeight;

        const startPoint =
            viewportHeight * 0.72;

        const scrollDistance =
            sectionRect.height -
            viewportHeight * 0.25;

        const rawProgress =
            (startPoint - sectionRect.top) /
            scrollDistance;

        const progress =
            Math.min(
                Math.max(rawProgress, 0),
                1
            );

        historySection.style.setProperty(
            '--history-progress',
            progress.toFixed(3)
        );

        animationFrame = null;

    }

    function requestHistoryUpdate() {

        if (animationFrame !== null) {
            return;
        }

        animationFrame =
            window.requestAnimationFrame(
                updateHistoryProgress
            );

    }

    window.addEventListener(
        'scroll',
        requestHistoryUpdate,
        { passive:true }
    );

    window.addEventListener(
        'resize',
        () => {
            updateHistoryGeometry();
            requestHistoryUpdate();
        }
    );

    if ('ResizeObserver' in window && historyTimeline) {
        const historyResizeObserver = new ResizeObserver(() => {
            updateHistoryGeometry();
        });

        historyResizeObserver.observe(historyTimeline);
    }

    if (document.fonts?.ready) {
        document.fonts.ready.then(updateHistoryGeometry);
    }

    updateHistoryGeometry();
    updateHistoryProgress();

});

/* =====================================================
   ENTRADA DOS CARDS DE PRODUTOS
===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('[data-product-reveal]');

    if (!productCards.length) {
        return;
    }

    if (!('IntersectionObserver' in window)) {
        productCards.forEach((card) => card.classList.add('is-visible'));
        return;
    }

    const productObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold:0.16,
        rootMargin:'0px 0px -6% 0px'
    });

    productCards.forEach((card, index) => {
        card.style.transitionDelay = `${Math.min(index * 90, 270)}ms`;
        productObserver.observe(card);
    });
});

/*==========================================================
FORMULÁRIO DE CONTATO — FORMSUBMIT AJAX + PÁGINA DE OBRIGADO
==========================================================*/

const contactForm = document.querySelector("#contact-form");

if (contactForm) {

    const contactStatus = document.querySelector("#contact-form-status");
    const contactButton = contactForm.querySelector('button[type="submit"]');
    const contactButtonText = contactButton?.querySelector(".contact-submit__text");
    const contactUrl = document.querySelector("#contact-form-url");

    const originalButtonText =
        contactButtonText?.textContent.trim() || "Enviar mensagem";

    function updateContactMetadata() {
        if (contactUrl) {
            contactUrl.value = window.location.href;
        }
    }

    function setFormLoading(isLoading) {
        if (contactButton) {
            contactButton.disabled = isLoading;
            contactButton.classList.toggle("is-loading", isLoading);
        }

        if (contactButtonText) {
            contactButtonText.textContent =
                isLoading ? "Enviando mensagem..." : originalButtonText;
        }
    }

    function showContactStatus(type, message) {
        if (!contactStatus) return;

        contactStatus.className = `contact-form-status ${type}`;
        contactStatus.textContent = message;
    }

    function getSuccessPageUrl() {
        const successPage =
            contactForm.dataset.successPage || "obrigado.html";

        return new URL(successPage, window.location.href).href;
    }

    updateContactMetadata();

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        updateContactMetadata();
        setFormLoading(true);
        showContactStatus(
            "is-loading",
            "Aguarde um instante. Estamos enviando sua mensagem."
        );

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    Accept: "application/json"
                }
            });

            let result = null;

            try {
                result = await response.json();
            } catch (error) {
                result = null;
            }

            if (!response.ok || result?.success === "false" || result?.success === false) {
                throw new Error(result?.message || "Não foi possível enviar a mensagem.");
            }

            window.location.assign(getSuccessPageUrl());

        } catch (error) {
            console.error("Erro ao enviar o formulário:", error);
            setFormLoading(false);
            showContactStatus(
                "is-error",
                "Não foi possível enviar agora. Verifique sua conexão e tente novamente."
            );
        }
    });

    /* Restaura o botão caso o visitante volte pelo navegador. */
    window.addEventListener("pageshow", () => {
        setFormLoading(false);
    });
}

/*==========================================================
TRABALHE CONOSCO — ENVIO DE CURRÍCULO EM PDF
==========================================================*/

const careerForm = document.querySelector("#career-form");

if (careerForm) {
    const resumeInput = document.querySelector("#career-resume");
    const fileName = document.querySelector("#career-file-name");
    const status = document.querySelector("#career-form-status");
    const submitButton = careerForm.querySelector('button[type="submit"]');
    const submitText = submitButton?.querySelector(".career-submit__text");
    const maxFileSize = 10 * 1024 * 1024;
    const originalSubmitText = submitText?.textContent.trim() || "Enviar currículo";

    function showCareerStatus(type, message) {
        if (!status) return;
        status.className = `career-form-status ${type}`;
        status.textContent = message;
    }

    function resetCareerFile() {
        if (resumeInput) resumeInput.value = "";
        if (fileName) {
            fileName.textContent = "Nenhum arquivo selecionado.";
            fileName.classList.remove("has-file");
        }
    }

    function validateResume(file) {
        if (!file) {
            showCareerStatus("is-error", "Selecione um currículo em PDF.");
            return false;
        }

        const isPdf =
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf");

        if (!isPdf) {
            showCareerStatus("is-error", "O currículo precisa estar no formato PDF.");
            resetCareerFile();
            return false;
        }

        if (file.size > maxFileSize) {
            showCareerStatus("is-error", "O PDF precisa ter no máximo 10 MB.");
            resetCareerFile();
            return false;
        }

        showCareerStatus("", "");
        return true;
    }

    resumeInput?.addEventListener("change", () => {
        const file = resumeInput.files?.[0];

        if (!file) {
            resetCareerFile();
            return;
        }

        if (!validateResume(file)) return;

        if (fileName) {
            const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
            fileName.textContent = `${file.name} — ${sizeInMb} MB`;
            fileName.classList.add("has-file");
        }
    });

    careerForm.addEventListener("submit", (event) => {
        if (!careerForm.checkValidity()) {
            event.preventDefault();
            careerForm.reportValidity();
            return;
        }

        const file = resumeInput?.files?.[0];

        if (!validateResume(file)) {
            event.preventDefault();
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.classList.add("is-loading");
        }

        if (submitText) {
            submitText.textContent = "Enviando currículo...";
        }

        showCareerStatus("", "Aguarde um instante. Estamos enviando seu currículo.");
    });

    window.addEventListener("pageshow", () => {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.classList.remove("is-loading");
        }

        if (submitText) {
            submitText.textContent = originalSubmitText;
        }
    });
}
