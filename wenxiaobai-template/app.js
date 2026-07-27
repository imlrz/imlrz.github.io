const ASSET_VERSION = "20260727-1";

const COLORS = {
  ustc: { label: "USTC Blue", accent: "#2E5AA8", cite: "#00A7E8", soft: "#F1F4F7", line: "#B8C4D8" },
  indigo: { label: "Indigo", accent: "#514AA3", cite: "#8E66FF", soft: "#F5F3FA", line: "#C9C3E5" },
  wine: { label: "Wine", accent: "#8A3048", cite: "#D94B6D", soft: "#F8F2F4", line: "#DAB9C3" },
  amber: { label: "Amber", accent: "#A56510", cite: "#E09A24", soft: "#F9F5EC", line: "#DCC7A2" }
};

const CITES = {
  normal: { label: "Normal", option: "normalcite" },
  fancy: { label: "Fancy", option: "fancycite" }
};

let currentColor = "ustc";
let currentCite = "normal";
let toastTimer;

const lab = document.querySelector("#color-lab");
const previewImage = document.querySelector("#lab-preview-image");
const dialog = document.querySelector("#preview-dialog");
const dialogImage = document.querySelector("#dialog-image");
const toast = document.querySelector("#toast");

function assetPath(type) {
  const extension = type === "previews" ? "png" : "pdf";
  return `assets/${type}/meta-${currentColor}-${currentCite}.${extension}?v=${ASSET_VERSION}`;
}

function commandText() {
  return `\\documentclass[${currentColor},${CITES[currentCite].option}]{meta}`;
}

function setPressed(selector, dataName, value) {
  document.querySelectorAll(selector).forEach(button => {
    const active = button.dataset[dataName] === value;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function updateConfiguration({ syncUrl = true } = {}) {
  const color = COLORS[currentColor];
  const cite = CITES[currentCite];

  lab.style.setProperty("--theme-accent", color.accent);
  lab.style.setProperty("--theme-cite", color.cite);
  lab.style.setProperty("--theme-soft", color.soft);
  lab.style.setProperty("--theme-line", color.line);

  previewImage.src = assetPath("previews");
  previewImage.alt = `Meta ${color.label} ${cite.label} Cite 彩色页签首页预览`;
  document.querySelector("#lab-color-label").textContent = color.label.toUpperCase();
  document.querySelector("#cite-label").textContent = cite.label.toUpperCase();
  document.querySelector("#citation-sample").classList.toggle("fancy", currentCite === "fancy");
  document.querySelector("#lab-pdf-link").href = assetPath("pdfs");

  const command = commandText();
  document.querySelector("#lab-command").textContent = command;
  document.querySelector("#copy-command").dataset.command = command;

  setPressed("[data-color]", "color", currentColor);
  setPressed("[data-cite]", "cite", currentCite);

  if (syncUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("color", currentColor);
    url.searchParams.set("cite", currentCite);
    url.searchParams.delete("logo");
    history.replaceState(null, "", url);
  }
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

function openPreview(src, alt) {
  dialogImage.src = src;
  dialogImage.alt = alt;
  dialog.showModal();
}

document.querySelectorAll("[data-color]").forEach(button => button.addEventListener("click", () => {
  currentColor = button.dataset.color;
  updateConfiguration();
}));
document.querySelectorAll("[data-cite]").forEach(button => button.addEventListener("click", () => {
  currentCite = button.dataset.cite;
  updateConfiguration();
}));
document.querySelectorAll("[data-select-color]").forEach(button => button.addEventListener("click", () => {
  currentColor = button.dataset.selectColor;
  updateConfiguration();
  document.querySelector("#configure").scrollIntoView({ behavior: "smooth" });
}));
document.querySelectorAll("[data-preview]").forEach(button => button.addEventListener("click", () => openPreview(button.dataset.preview, button.dataset.previewAlt)));
document.querySelector("#lab-preview-button").addEventListener("click", () => openPreview(previewImage.src, previewImage.alt));
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
document.querySelector("#copy-command").addEventListener("click", event => copyText(event.currentTarget.dataset.command));
document.querySelectorAll("[data-copy]").forEach(button => button.addEventListener("click", () => copyText(button.dataset.copy)));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

const params = new URLSearchParams(window.location.search);
if (COLORS[params.get("color")]) currentColor = params.get("color");
if (CITES[params.get("cite")]) currentCite = params.get("cite");
updateConfiguration({ syncUrl: false });
