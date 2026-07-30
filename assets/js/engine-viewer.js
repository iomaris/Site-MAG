/* ==========================================================
   MOTOR CUMMINS X15 — VISUALIZAÇÃO 3D LIMPA
   Usa o Viewer API apenas como renderizador do modelo.
========================================================== */

"use strict";

(function initializeCumminsViewer(){
    const iframe = document.getElementById("cummins-engine-viewer");

    if(!iframe || typeof window.Sketchfab !== "function"){
        return;
    }

    const modelUid = "7ce75c3b7f9c4d759190fb027efccc53";
    const client = new window.Sketchfab("1.12.1", iframe);

    client.init(modelUid, {
        autostart:1,
        preload:1,
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

        success:function onSuccess(api){
            api.start();

            api.addEventListener("viewerready", function onViewerReady(){
                /* Fundo branco para integrar o motor ao layout da seção. */
                api.setBackground({
                    color:[1,1,1]
                });

                iframe.classList.add("is-ready");
            });
        },

        error:function onError(){
            iframe.classList.add("has-error");
        }
    });
})();
