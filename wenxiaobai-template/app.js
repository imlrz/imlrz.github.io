const THEMES = {
  ustc: {
    label: "USTC Blue",
    title: "学术默认蓝",
    description: "最接近原始论文气质的选择。冷静、可信，适合大多数计算机科学论文。",
    accent: "#2E5AA8",
    soft: "#F1F4F7",
    line: "#B8C4D8",
    note: "academic default"
  },
  indigo: {
    label: "Indigo",
    title: "深靛方法论",
    description: "比标准蓝更内敛，带少量紫调。适合理论、系统、表示学习和方法论较重的论文。",
    accent: "#514AA3",
    soft: "#F5F3FA",
    line: "#C9C3E5",
    note: "theory & systems"
  },
  jade: {
    label: "Jade",
    title: "玉石科学绿",
    description: "克制、理性而不生硬。适合科学智能、生命科学、可持续计算与长期研究项目。",
    accent: "#0B7A68",
    soft: "#F1F7F5",
    line: "#AFD1C8",
    note: "science & longevity"
  },
  wine: {
    label: "Wine",
    title: "正式期刊酒红",
    description: "具有传统期刊和人文研究的正式感，也适合强调理论推导与完整论证的硬核论文。",
    accent: "#8A3048",
    soft: "#F8F2F4",
    line: "#DAB9C3",
    note: "formal journal"
  },
  amber: {
    label: "Amber",
    title: "暖琥珀技术报告",
    description: "更温暖、更具内部研究报告气质。适合技术复盘、实验报告和跨团队研究发布。",
    accent: "#A56510",
    soft: "#F9F5EC",
    line: "#DCC7A2",
    note: "warm technical"
  },
  graphite: {
    label: "Graphite",
    title: "石墨黑白归档",
    description: "近单色、打印稳定、阅读干扰最小。适合预印本、长篇理论论文与正式归档。",
    accent: "#343B45",
    soft: "#F2F3F5",
    line: "#C5CBD1",
    note: "archival monochrome"
  }
};

const BASES = {
  seed: { label: "SEED", name: "Seed" },
  meta: { label: "META", name: "Meta" }
};

let currentBase = "seed";
let currentTheme = "ustc";

const lab = document.querySelector("#color-lab");
const previewImage = document.querySelector("#lab-preview-image");
const themeGrid = document.querySelector("#theme-grid");
const toast = document.querySelector("#toast");
const dialog = document.querySelector("#preview-dialog");
const dialogImage = document.querySelector("#dialog-image");
let toastTimer;

function assetPath(type, base, theme) {
  const extension = type === "previews" ? "png" : "pdf";
  return `assets/${type}/${base}-${theme}.${extension}`;
}

function renderThemeGrid() {
  themeGrid.innerHTML = Object.entries(THEMES).map(([key, theme]) => `
    <button class="theme-card${key === currentTheme ? " active" : ""}" type="button" data-theme-card="${key}" style="--card-accent:${theme.accent}">
      <i aria-hidden="true"></i>
      <strong>${theme.label}</strong>
      <small>${theme.note}</small>
    </button>
  `).join("");
}

function updateLab({ syncUrl = true } = {}) {
  const theme = THEMES[currentTheme];
  const base = BASES[currentBase];
  lab.style.setProperty("--theme-accent", theme.accent);
  lab.style.setProperty("--theme-soft", theme.soft);
  lab.style.setProperty("--theme-line", theme.line);

  previewImage.src = assetPath("previews", currentBase, currentTheme);
  previewImage.alt = `${base.name} ${theme.label} 首页预览`;
  document.querySelector("#lab-base-label").textContent = base.label;
  document.querySelector("#lab-theme-label").textContent = theme.label.toUpperCase();
  document.querySelector("#lab-title").textContent = theme.title;
  document.querySelector("#lab-description").textContent = theme.description;
  document.querySelector("#accent-value").textContent = theme.accent;
  document.querySelector("#soft-value").textContent = theme.soft;
  document.querySelector("#accent-swatch").style.background = theme.accent;
  document.querySelector("#soft-swatch").style.background = theme.soft;
  document.querySelector("#lab-pdf-link").href = assetPath("pdfs", currentBase, currentTheme);

  const command = `\\documentclass[${currentTheme}]{${currentBase}}`;
  document.querySelector("#lab-command").textContent = command;
  document.querySelector("#copy-command").dataset.command = command;

  document.querySelectorAll(".base-tab").forEach(button => {
    const active = button.dataset.base === currentBase;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll(".palette-dot").forEach(button => button.classList.toggle("active", button.dataset.theme === currentTheme));
  renderThemeGrid();

  if (syncUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("base", currentBase);
    url.searchParams.set("theme", currentTheme);
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
    showToast();
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showToast();
  }
}

function openPreview(src, alt) {
  dialogImage.src = src;
  dialogImage.alt = alt;
  dialog.showModal();
}

document.querySelectorAll(".base-tab").forEach(button => {
  button.addEventListener("click", () => {
    currentBase = button.dataset.base;
    updateLab();
  });
});

document.querySelectorAll(".palette-dot").forEach(button => {
  button.addEventListener("click", () => {
    currentTheme = button.dataset.theme;
    updateLab();
  });
});

themeGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-theme-card]");
  if (!button) return;
  currentTheme = button.dataset.themeCard;
  updateLab();
  document.querySelector(".lab-main").scrollIntoView({ behavior: "smooth", block: "center" });
});

document.querySelector("#copy-command").addEventListener("click", event => copyText(event.currentTarget.dataset.command));
document.querySelectorAll("[data-copy]").forEach(button => button.addEventListener("click", () => copyText(button.dataset.copy)));

document.querySelectorAll("[data-preview]").forEach(button => {
  button.addEventListener("click", () => openPreview(button.dataset.preview, button.dataset.previewAlt));
});
document.querySelector("#lab-preview-button").addEventListener("click", () => openPreview(previewImage.src, previewImage.alt));
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
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

const params = new URLSearchParams(window.location.search);
if (BASES[params.get("base")]) currentBase = params.get("base");
if (THEMES[params.get("theme")]) currentTheme = params.get("theme");
updateLab({ syncUrl: false });
