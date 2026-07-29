"use strict";

const careerForm = document.querySelector("#career-form");

if (careerForm) {
    const resumeInput = document.querySelector("#career-resume");
    const fileName = document.querySelector("#career-file-name");
    const status = document.querySelector("#career-form-status");
    const submitButton = careerForm.querySelector('button[type="submit"]');
    const submitText = submitButton?.querySelector(".career-submit__text");
    const maxFileSize = 10 * 1024 * 1024;
    const originalSubmitText = submitText?.textContent.trim() || "Enviar currículo";

    function showStatus(type, message) {
        if (!status) return;
        status.className = `career-form-status ${type}`.trim();
        status.textContent = message;
    }

    function resetFile() {
        if (resumeInput) resumeInput.value = "";
        if (fileName) {
            fileName.textContent = "Nenhum arquivo selecionado.";
            fileName.classList.remove("has-file");
        }
    }

    function validateResume(file) {
        if (!file) {
            showStatus("is-error", "Selecione um currículo em PDF.");
            return false;
        }

        const isPdf =
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf");

        if (!isPdf) {
            showStatus("is-error", "O currículo precisa estar no formato PDF.");
            resetFile();
            return false;
        }

        if (file.size > maxFileSize) {
            showStatus("is-error", "O PDF precisa ter no máximo 10 MB.");
            resetFile();
            return false;
        }

        showStatus("", "");
        return true;
    }

    resumeInput?.addEventListener("change", () => {
        const file = resumeInput.files?.[0];

        if (!file) {
            resetFile();
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
        }

        if (submitText) {
            submitText.textContent = "Enviando currículo...";
        }

        showStatus("", "Aguarde. O currículo está sendo enviado.");
    });

    window.addEventListener("pageshow", () => {
        if (submitButton) submitButton.disabled = false;
        if (submitText) submitText.textContent = originalSubmitText;
    });
}
