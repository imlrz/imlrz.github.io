const dialog = document.querySelector("#preview-dialog");
const dialogImage = document.querySelector("#dialog-image");
const toast = document.querySelector("#toast");
let toastTimer;

function openPreview(src, alt) {
  dialogImage.src = src;
  dialogImage.alt = alt;
  dialog.showModal();
}

function showToast(message = "已复制到剪贴板") {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  showToast();
}

document.querySelectorAll("[data-preview]").forEach(button => {
  button.addEventListener("click", () => {
    openPreview(button.dataset.preview, button.dataset.previewAlt);
  });
});

document.querySelectorAll("[data-copy]").forEach(button => {
  button.addEventListener("click", () => copyText(button.dataset.copy));
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
