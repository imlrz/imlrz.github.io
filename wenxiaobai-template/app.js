const ASSET_VERSION = "20260726-5";

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

const LOGOS = {
  tile: {
    label: "Tile",
    title: "方块字标",
    detail: "方块图标＋深色字标",
    description: "黑色圆角方块保留彩色图形，搭配深石墨色 Pada 字标，直接落在摘要卡片上。",
    option: "tilelogo"
  },
  pill: {
    label: "Pill",
    title: "深灰胶囊",
    detail: "深灰胶囊＋浅色 Logo",
    description: "论文保留所选主题色，只在右下角加入深灰圆角承托，以浅色完整 Logo 形成干净对比。",
    option: "pilllogo"
  },
  booktag: {
    label: "Booktag",
    title: "彩色页签",
    detail: "主题色页签＋浅色 Logo",
    description: "非对称书页标签沿摘要卡片右下角收边，标签颜色随蓝、紫、红、黄主题同步变化。",
    option: "booktaglogo"
  },
  obsidian: {
    label: "Obsidian",
    title: "曜石页签",
    detail: "近黑页签＋主题色细线",
    description: "页签主体统一压至近黑色，只在顶边保留一条极细主题色线，整体更冷静、更克制。",
    option: "obsidiantaglogo"
  }
};

let currentColor = "ustc";
let currentCite = "normal";
let currentLogo = "tile";
let toastTimer;

const lab = document.querySelector("#color-lab");
const previewImage = document.querySelector("#lab-preview-image");
const dialog = document.querySelector("#preview-dialog");
const dialogImage = document.querySelector("#dialog-image");
const toast = document.querySelector("#toast");

function assetPath(type) {
  const extension = type === "previews" ? "png" : "pdf";
  return `assets/${type}/meta-${currentColor}-${currentCite}-${currentLogo}.${extension}?v=${ASSET_VERSION}`;
}

function commandText() {
  return `\\documentclass[${currentColor},${CITES[currentCite].option},${LOGOS[currentLogo].option}]{meta}`;
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
  const logo = LOGOS[currentLogo];

  lab.style.setProperty("--theme-accent", color.accent);
  lab.style.setProperty("--theme-cite", color.cite);
  lab.style.setProperty("--theme-soft", color.soft);
  lab.style.setProperty("--theme-line", color.line);

  previewImage.src = assetPath("previews");
  previewImage.alt = `Meta ${color.label} ${cite.label} Cite ${logo.title}首页预览`;
  document.querySelector("#lab-color-label").textContent = color.label.toUpperCase();
  document.querySelector("#lab-title").textContent = logo.title;
  document.querySelector("#lab-description").textContent = logo.description;
  document.querySelector("#cite-label").textContent = cite.label.toUpperCase();
  document.querySelector("#logo-label").textContent = logo.label.toUpperCase();
  document.querySelector("#logo-detail").textContent = logo.detail;

  const citationSample = document.querySelector("#citation-sample");
  citationSample.classList.toggle("fancy", currentCite === "fancy");

  document.querySelector("#lab-pdf-link").href = assetPath("pdfs");
  const command = commandText();
  document.querySelector("#lab-command").textContent = command;
  document.querySelector("#copy-command").dataset.command = command;

  setPressed("[data-color]", "color", currentColor);
  setPressed("[data-cite]", "cite", currentCite);
  setPressed("[data-logo]", "logo", currentLogo);

  if (syncUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("color", currentColor);
    url.searchParams.set("cite", currentCite);
    url.searchParams.set("logo", currentLogo);
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
document.querySelectorAll("[data-logo]").forEach(button => button.addEventListener("click", () => {
  currentLogo = button.dataset.logo;
  updateConfiguration();
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
if (LOGOS[params.get("logo")]) currentLogo = params.get("logo");
updateConfiguration({ syncUrl: false });
