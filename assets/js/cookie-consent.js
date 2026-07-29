/* =========================================================
   MAG — CONSENTIMENTO DE COOKIES E CONTEÚDO EXTERNO
========================================================= */
(() => {
    "use strict";

    const STORAGE_KEY = "mag_privacy_preferences_v2";
    const CONSENT_VERSION = 2;
    const DEFAULT_PREFERENCES = {
        version: CONSENT_VERSION,
        necessary: true,
        externalContent: false,
        savedAt: null
    };

    function readPreferences() {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const saved = JSON.parse(raw);
            if (!saved || saved.version !== CONSENT_VERSION) return null;
            return {
                ...DEFAULT_PREFERENCES,
                ...saved,
                necessary: true
            };
        } catch (error) {
            console.warn("Não foi possível ler as preferências de privacidade.", error);
            return null;
        }
    }

    function savePreferences(preferences) {
        const normalized = {
            version: CONSENT_VERSION,
            necessary: true,
            externalContent: Boolean(preferences.externalContent),
            savedAt: new Date().toISOString()
        };

        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        } catch (error) {
            console.warn("Não foi possível salvar as preferências de privacidade.", error);
        }

        applyPreferences(normalized);
        document.dispatchEvent(new CustomEvent("mag:privacy-changed", {
            detail: normalized
        }));

        return normalized;
    }

    function applyPreferences(preferences) {
        const externalAllowed = Boolean(preferences?.externalContent);

        document.querySelectorAll("iframe[data-cookie-src]").forEach((iframe) => {
            const placeholder = iframe.parentElement?.querySelector("[data-map-consent-placeholder]");

            if (externalAllowed) {
                if (iframe.src === "about:blank" || !iframe.src) {
                    iframe.src = iframe.dataset.cookieSrc;
                }
                placeholder?.setAttribute("hidden", "");
            } else {
                if (iframe.src && iframe.src !== "about:blank") {
                    iframe.src = "about:blank";
                }
                placeholder?.removeAttribute("hidden");
            }
        });
    }

    function createInterface() {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
            

                    
            
        `;

        while (wrapper.firstElementChild) {
            document.body.appendChild(wrapper.firstElementChild);
        }
    }

    function init() {
        createInterface();

        const banner = document.querySelector("#cookie-consent");
        const modal = document.querySelector("#cookie-preferences");
        const externalToggle = document.querySelector("[data-cookie-external]");
        const dialog = modal?.querySelector(".cookie-preferences__dialog");
        let previouslyFocused = null;

        const current = readPreferences();
        applyPreferences(current || DEFAULT_PREFERENCES);

        if (!current) {
            banner?.removeAttribute("hidden");
        }

        function openSettings() {
            const preferences = readPreferences() || DEFAULT_PREFERENCES;
            if (externalToggle) {
                externalToggle.checked = Boolean(preferences.externalContent);
            }
            previouslyFocused = document.activeElement;
            modal?.removeAttribute("hidden");
            document.body.classList.add("cookie-modal-open");
            modal?.querySelector("[data-cookie-close]")?.focus();
        }

        function closeSettings() {
            modal?.setAttribute("hidden", "");
            document.body.classList.remove("cookie-modal-open");
            if (previouslyFocused instanceof HTMLElement) {
                previouslyFocused.focus();
            }
        }

        function finishChoice(preferences) {
            savePreferences(preferences);
            banner?.setAttribute("hidden", "");
            closeSettings();
        }

        document.querySelectorAll("[data-cookie-settings]").forEach((button) => {
            button.addEventListener("click", openSettings);
        });

        document.querySelector("[data-cookie-accept-all]")?.addEventListener("click", () => {
            finishChoice({ externalContent: true });
        });

        document.querySelector("[data-cookie-necessary]")?.addEventListener("click", () => {
            finishChoice({ externalContent: false });
        });

        document.querySelector("[data-cookie-reject-modal]")?.addEventListener("click", () => {
            finishChoice({ externalContent: false });
        });

        document.querySelector("[data-cookie-save]")?.addEventListener("click", () => {
            finishChoice({ externalContent: Boolean(externalToggle?.checked) });
        });

        document.querySelector("[data-cookie-close]")?.addEventListener("click", closeSettings);

        modal?.addEventListener("click", (event) => {
            if (event.target === modal) closeSettings();
        });

        dialog?.addEventListener("click", (event) => event.stopPropagation());

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && modal && !modal.hasAttribute("hidden")) {
                closeSettings();
            }
        });

        document.querySelectorAll("[data-open-cookie-settings]").forEach((button) => {
            button.addEventListener("click", openSettings);
        });

        document.querySelectorAll("[data-enable-map]").forEach((button) => {
            button.addEventListener("click", () => {
                finishChoice({ externalContent: true });
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
