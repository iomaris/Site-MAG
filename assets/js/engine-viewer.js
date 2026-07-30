/* ==========================================================
   MOTOR CUMMINS X15 — CARREGAMENTO 3D SOB DEMANDA
   A biblioteca e o modelo só são baixados quando a seção se
   aproxima da tela, reduzindo bastante o carregamento inicial.
========================================================== */

"use strict";

(function initializeCumminsViewerLazily(){
    const iframe = document.getElementById("cummins-engine-viewer");
    const viewer = iframe?.closest(".advantages-engine__viewer");

    if(!iframe || !viewer) return;

    let initialized = false;

    function loadSketchfabApi(){
        if(typeof window.Sketchfab === "function"){
            return Promise.resolve();
        }

        return new Promise((resolve, reject)=>{
            const existing = document.querySelector('script[data-sketchfab-api]');

            if(existing){
                existing.addEventListener("load", resolve, { once:true });
                existing.addEventListener("error", reject, { once:true });
                return;
            }

            const script = document.createElement("script");
            script.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
            script.async = true;
            script.dataset.sketchfabApi = "true";
            script.addEventListener("load", resolve, { once:true });
            script.addEventListener("error", reject, { once:true });
            document.head.appendChild(script);
        });
    }

    async function startViewer(){
        if(initialized) return;
        initialized = true;
        viewer.classList.add("is-loading");

        try{
            await loadSketchfabApi();

            if(typeof window.Sketchfab !== "function"){
                throw new Error("Sketchfab API indisponível");
            }

            const modelUid = "7ce75c3b7f9c4d759190fb027efccc53";
            const client = new window.Sketchfab("1.12.1", iframe);

            client.init(modelUid, {
                autostart:1,
                preload:0,
                autospin:0.2,
                camera:0,
                dnt:1,
                scrollwheel:1,
                ui_infos:0,
                ui_controls:0,
                ui_general_controls:0,
                ui_help:0,
                ui_hint:0,
                ui_settings:0,
                ui_stop:0,
                ui_vr:0,
                ui_ar:0,
                ui_fullscreen:0,
                ui_inspector:0,
                ui_annotations:0,
                ui_animations:0,
                ui_watermark:0,
                ui_loading:0,
                ui_fadeout:0,

                success(api){
                    api.start();
                    api.addEventListener("viewerready", ()=>{
                        api.setBackground({ color:[1,1,1] });

                        if(typeof api.recenterCamera === "function"){
                            api.recenterCamera();
                        }

                        viewer.classList.remove("is-loading");
                        iframe.classList.add("is-ready");
                    });
                },

                error(){
                    viewer.classList.remove("is-loading");
                    iframe.classList.add("has-error");
                }
            });
        }catch(error){
            viewer.classList.remove("is-loading");
            iframe.classList.add("has-error");
            console.warn("Não foi possível carregar o motor 3D.", error);
        }
    }

    if("IntersectionObserver" in window){
        const observer = new IntersectionObserver((entries)=>{
            if(!entries.some(entry=>entry.isIntersecting)) return;
            observer.disconnect();
            startViewer();
        }, {
            rootMargin:"500px 0px",
            threshold:0.01
        });

        observer.observe(viewer);
    }else{
        startViewer();
    }
})();
