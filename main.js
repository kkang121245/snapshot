var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, {get: all[name], enumerable: true});
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable});
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", {value: true}), mod);

var main_exports = {};
__export(main_exports, {
  default: () => ChatSnapshotPlugin,
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

function getStellaEngine(app) {
  var _a, _b;
  const plugin = (_b = (_a = app.plugins) == null ? void 0 : _a.plugins) == null ? void 0 : _b["ggai-stella-engine"];
  return plugin != null ? plugin : null;
}

var import_obsidian = require("obsidian");
var CaptureOptionsModal = class extends import_obsidian.Modal {
  constructor(app, initial, onSubmit, submitLabel = "구간 선택", onCancel) {
    super(app);
    this.settings = {...initial};
    this.onSubmit = onSubmit;
    this.submitLabel = submitLabel;
    this.onCancel = onCancel;
  }
  onOpen() {
    const {contentEl} = this;
    contentEl.empty();
    contentEl.createEl("h3", {text: "캡쳐 옵션"});
    contentEl.createEl("p", {
      text: "옵션을 정한 뒤 저장할 메시지의 시작과 끝을 채팅창에서 직접 탭하세요.",
      cls: "ggai-snap-modal-hint",
    });
    new import_obsidian.Setting(contentEl)
      .setName("이름 표시")
      .setDesc("캐릭터 이름을 어떻게 표시할지 선택하세요.")
      .addDropdown((dropdown) => {
        dropdown
          .addOption("show", "표시")
          .addOption("hide", "숨기기")
          .addOption("replace", "대체 텍스트")
          .setValue(this.settings.nameMode)
          .onChange((value) => {
            this.settings.nameMode = value;
          });
      });
    new import_obsidian.Setting(contentEl)
      .setName("깡캐 프로필 표시")
      .setDesc("프로필 이미지를 어떻게 표시할지 선택하세요.")
      .addDropdown((dropdown) => {
        dropdown
          .addOption("show", "표시")
          .addOption("hide", "숨기기")
          .setValue(this.settings.userAvatarMode)
          .onChange((value) => {
            this.settings.userAvatarMode = value;
          });
      });
    new import_obsidian.Setting(contentEl)
      .setName("깡통 프로필 표시")
      .setDesc("프로필 이미지를 어떻게 표시할지 선택하세요.")
      .addDropdown((dropdown) => {
        dropdown
          .addOption("show", "표시")
          .addOption("hide", "숨기기")
          .setValue(this.settings.characterAvatarMode)
          .onChange((value) => {
            this.settings.characterAvatarMode = value;
          });
      });
    new import_obsidian.Setting(contentEl)
      .setName("이미지 형식")
      .setDesc("PNG는 화질이 좋고, JPG는 용량이 작습니다.")
      .addDropdown((dropdown) => {
        dropdown
          .addOption("png", "PNG")
          .addOption("jpg", "JPG")
          .setValue(this.settings.imageFormat || "png")
          .onChange((value) => {
            this.settings.imageFormat = value;
          });
      });
    new import_obsidian.Setting(contentEl)
      .setName("이미지당 최대 메시지 수")
      .setDesc("선택한 범위가 이 개수보다 길면 여러 장의 이미지로 나눠 저장합니다.")
      .addSlider((slider) => {
        slider
          .setLimits(2, 30, 2)
          .setValue(this.settings.maxMessagesPerCapture || 10)
          .setDynamicTooltip()
          .onChange((value) => {
            this.settings.maxMessagesPerCapture = value;
          });
      });
    new import_obsidian.Setting(contentEl)
      .addButton((btn) => {
        btn.setButtonText("취소").onClick(() => {
          this.close();
          if (this.onCancel) this.onCancel();
        });
      })
      .addButton((btn) => {
        btn
          .setButtonText(this.submitLabel)
          .setCta()
          .onClick(() => {
            this.onSubmit(this.settings);
            this.close();
          });
      });
  }
  onClose() {
    this.contentEl.empty();
  }
};

var import_obsidian3 = require("obsidian");

function resolveUrl(url, baseUrl) {
  if (url.match(/^[a-z]+:\/\//i)) {
    return url;
  }
  if (url.match(/^\/\//)) {
    return window.location.protocol + url;
  }
  if (url.match(/^[a-z]+:/i)) {
    return url;
  }
  const doc = document.implementation.createHTMLDocument();
  const base = doc.createElement("base");
  const a = doc.createElement("a");
  doc.head.appendChild(base);
  doc.body.appendChild(a);
  if (baseUrl) {
    base.href = baseUrl;
  }
  a.href = url;
  return a.href;
}
var uuid = (() => {
  let counter = 0;
  const random = () => `0000${((Math.random() * 36 ** 4) << 0).toString(36)}`.slice(-4);
  return () => {
    counter += 1;
    return `u${random()}${counter}`;
  };
})();
function toArray(arrayLike) {
  const arr = [];
  for (let i = 0, l = arrayLike.length; i < l; i++) {
    arr.push(arrayLike[i]);
  }
  return arr;
}
var styleProps = null;
function getStyleProperties(options = {}) {
  if (styleProps) {
    return styleProps;
  }
  if (options.includeStyleProperties) {
    styleProps = options.includeStyleProperties;
    return styleProps;
  }
  styleProps = toArray(window.getComputedStyle(document.documentElement));
  return styleProps;
}
function px(node, styleProperty) {
  const win = node.ownerDocument.defaultView || window;
  const val = win.getComputedStyle(node).getPropertyValue(styleProperty);
  return val ? parseFloat(val.replace("px", "")) : 0;
}
function getNodeWidth(node) {
  const leftBorder = px(node, "border-left-width");
  const rightBorder = px(node, "border-right-width");
  return node.clientWidth + leftBorder + rightBorder;
}
function getNodeHeight(node) {
  const topBorder = px(node, "border-top-width");
  const bottomBorder = px(node, "border-bottom-width");
  return node.clientHeight + topBorder + bottomBorder;
}
function getImageSize(targetNode, options = {}) {
  const width = options.width || getNodeWidth(targetNode);
  const height = options.height || getNodeHeight(targetNode);
  return {width, height};
}
function getPixelRatio() {
  let ratio;
  let FINAL_PROCESS;
  try {
    FINAL_PROCESS = process;
  } catch (e) {}
  const val = FINAL_PROCESS && FINAL_PROCESS.env ? FINAL_PROCESS.env.devicePixelRatio : null;
  if (val) {
    ratio = parseInt(val, 10);
    if (Number.isNaN(ratio)) {
      ratio = 1;
    }
  }
  return ratio || window.devicePixelRatio || 1;
}
var canvasDimensionLimit = 16384;
function checkCanvasDimensions(canvas) {
  if (canvas.width > canvasDimensionLimit || canvas.height > canvasDimensionLimit) {
    if (canvas.width > canvasDimensionLimit && canvas.height > canvasDimensionLimit) {
      if (canvas.width > canvas.height) {
        canvas.height *= canvasDimensionLimit / canvas.width;
        canvas.width = canvasDimensionLimit;
      } else {
        canvas.width *= canvasDimensionLimit / canvas.height;
        canvas.height = canvasDimensionLimit;
      }
    } else if (canvas.width > canvasDimensionLimit) {
      canvas.height *= canvasDimensionLimit / canvas.width;
      canvas.width = canvasDimensionLimit;
    } else {
      canvas.width *= canvasDimensionLimit / canvas.height;
      canvas.height = canvasDimensionLimit;
    }
  }
}
function canvasToBlob(canvas, options = {}) {
  if (canvas.toBlob) {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, options.type ? options.type : "image/png", options.quality ? options.quality : 1);
    });
  }
  return new Promise((resolve) => {
    const binaryString = window.atob(canvas.toDataURL(options.type ? options.type : void 0, options.quality ? options.quality : void 0).split(",")[1]);
    const len = binaryString.length;
    const binaryArray = new Uint8Array(len);
    for (let i = 0; i < len; i += 1) {
      binaryArray[i] = binaryString.charCodeAt(i);
    }
    resolve(
      new Blob([binaryArray], {
        type: options.type ? options.type : "image/png",
      }),
    );
  });
}
function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      img.decode().then(() => {
        requestAnimationFrame(() => resolve(img));
      });
    };
    img.onerror = reject;
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.src = url;
  });
}
async function svgToDataURL(svg) {
  return Promise.resolve()
    .then(() => new XMLSerializer().serializeToString(svg))
    .then(encodeURIComponent)
    .then((html) => `data:image/svg+xml;charset=utf-8,${html}`);
}
async function nodeToDataURL(node, width, height) {
  const xmlns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(xmlns, "svg");
  const foreignObject = document.createElementNS(xmlns, "foreignObject");
  svg.setAttribute("width", `${width}`);
  svg.setAttribute("height", `${height}`);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  foreignObject.setAttribute("width", "100%");
  foreignObject.setAttribute("height", "100%");
  foreignObject.setAttribute("x", "0");
  foreignObject.setAttribute("y", "0");
  foreignObject.setAttribute("externalResourcesRequired", "true");
  svg.appendChild(foreignObject);
  foreignObject.appendChild(node);
  return svgToDataURL(svg);
}
var isInstanceOfElement = (node, instance) => {
  if (node instanceof instance) return true;
  const nodePrototype = Object.getPrototypeOf(node);
  if (nodePrototype === null) return false;
  return nodePrototype.constructor.name === instance.name || isInstanceOfElement(nodePrototype, instance);
};

function formatCSSText(style) {
  const content = style.getPropertyValue("content");
  return `${style.cssText} content: '${content.replace(/'|"/g, "")}';`;
}
function formatCSSProperties(style, options) {
  return getStyleProperties(options)
    .map((name) => {
      const value = style.getPropertyValue(name);
      const priority = style.getPropertyPriority(name);
      return `${name}: ${value}${priority ? " !important" : ""};`;
    })
    .join(" ");
}
function getPseudoElementStyle(className, pseudo, style, options) {
  const selector = `.${className}:${pseudo}`;
  const cssText = style.cssText ? formatCSSText(style) : formatCSSProperties(style, options);
  return document.createTextNode(`${selector}{${cssText}}`);
}
function clonePseudoElement(nativeNode, clonedNode, pseudo, options) {
  const style = window.getComputedStyle(nativeNode, pseudo);
  const content = style.getPropertyValue("content");
  if (content === "" || content === "none") {
    return;
  }
  const className = uuid();
  try {
    clonedNode.className = `${clonedNode.className} ${className}`;
  } catch (err) {
    return;
  }
  const styleElement = document.createElement("style");
  styleElement.appendChild(getPseudoElementStyle(className, pseudo, style, options));
  clonedNode.appendChild(styleElement);
}
function clonePseudoElements(nativeNode, clonedNode, options) {
  clonePseudoElement(nativeNode, clonedNode, ":before", options);
  clonePseudoElement(nativeNode, clonedNode, ":after", options);
}

var WOFF = "application/font-woff";
var JPEG = "image/jpeg";
var mimes = {
  woff: WOFF,
  woff2: WOFF,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: JPEG,
  jpeg: JPEG,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp",
};
function getExtension(url) {
  const match = /\.([^./]*?)$/g.exec(url);
  return match ? match[1] : "";
}
function getMimeType(url) {
  const extension = getExtension(url).toLowerCase();
  return mimes[extension] || "";
}

function getContentFromDataUrl(dataURL) {
  return dataURL.split(/,/)[1];
}
function isDataUrl(url) {
  return url.search(/^(data:)/) !== -1;
}
function makeDataUrl(content, mimeType) {
  return `data:${mimeType};base64,${content}`;
}
async function fetchAsDataURL(url, init, process2) {
  const res = await fetch(url, init);
  if (res.status === 404) {
    throw new Error(`Resource "${res.url}" not found`);
  }
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onloadend = () => {
      try {
        resolve(process2({res, result: reader.result}));
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsDataURL(blob);
  });
}
var cache = {};
function getCacheKey(url, contentType, includeQueryParams) {
  let key = url.replace(/\?.*/, "");
  if (includeQueryParams) {
    key = url;
  }
  if (/ttf|otf|eot|woff2?/i.test(key)) {
    key = key.replace(/.*\//, "");
  }
  return contentType ? `[${contentType}]${key}` : key;
}
async function resourceToDataURL(resourceUrl, contentType, options) {
  const cacheKey = getCacheKey(resourceUrl, contentType, options.includeQueryParams);
  if (cache[cacheKey] != null) {
    return cache[cacheKey];
  }
  if (options.cacheBust) {
    resourceUrl += (/\?/.test(resourceUrl) ? "&" : "?") + new Date().getTime();
  }
  let dataURL;
  try {
    const content = await fetchAsDataURL(resourceUrl, options.fetchRequestInit, ({res, result}) => {
      if (!contentType) {
        contentType = res.headers.get("Content-Type") || "";
      }
      return getContentFromDataUrl(result);
    });
    dataURL = makeDataUrl(content, contentType);
  } catch (error) {
    dataURL = options.imagePlaceholder || "";
    let msg = `Failed to fetch resource: ${resourceUrl}`;
    if (error) {
      msg = typeof error === "string" ? error : error.message;
    }
    if (msg) {
      console.warn(msg);
    }
  }
  cache[cacheKey] = dataURL;
  return dataURL;
}

async function cloneCanvasElement(canvas) {
  const dataURL = canvas.toDataURL();
  if (dataURL === "data:,") {
    return canvas.cloneNode(false);
  }
  return createImage(dataURL);
}
async function cloneVideoElement(video, options) {
  if (video.currentSrc) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL2 = canvas.toDataURL();
    return createImage(dataURL2);
  }
  const poster = video.poster;
  const contentType = getMimeType(poster);
  const dataURL = await resourceToDataURL(poster, contentType, options);
  return createImage(dataURL);
}
async function cloneIFrameElement(iframe, options) {
  var _a;
  try {
    if ((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.body) {
      return await cloneNode(iframe.contentDocument.body, options, true);
    }
  } catch (_b) {}
  return iframe.cloneNode(false);
}
async function cloneSingleNode(node, options) {
  if (isInstanceOfElement(node, HTMLCanvasElement)) {
    return cloneCanvasElement(node);
  }
  if (isInstanceOfElement(node, HTMLVideoElement)) {
    return cloneVideoElement(node, options);
  }
  if (isInstanceOfElement(node, HTMLIFrameElement)) {
    return cloneIFrameElement(node, options);
  }
  return node.cloneNode(isSVGElement(node));
}
var isSlotElement = (node) => node.tagName != null && node.tagName.toUpperCase() === "SLOT";
var isSVGElement = (node) => node.tagName != null && node.tagName.toUpperCase() === "SVG";
async function cloneChildren(nativeNode, clonedNode, options) {
  var _a, _b;
  if (isSVGElement(clonedNode)) {
    return clonedNode;
  }
  let children = [];
  if (isSlotElement(nativeNode) && nativeNode.assignedNodes) {
    children = toArray(nativeNode.assignedNodes());
  } else if (isInstanceOfElement(nativeNode, HTMLIFrameElement) && ((_a = nativeNode.contentDocument) === null || _a === void 0 ? void 0 : _a.body)) {
    children = toArray(nativeNode.contentDocument.body.childNodes);
  } else {
    children = toArray(((_b = nativeNode.shadowRoot) !== null && _b !== void 0 ? _b : nativeNode).childNodes);
  }
  if (children.length === 0 || isInstanceOfElement(nativeNode, HTMLVideoElement)) {
    return clonedNode;
  }
  await children.reduce(
    (deferred, child) =>
      deferred
        .then(() => cloneNode(child, options))
        .then((clonedChild) => {
          if (clonedChild) {
            clonedNode.appendChild(clonedChild);
          }
        }),
    Promise.resolve(),
  );
  return clonedNode;
}
function cloneCSSStyle(nativeNode, clonedNode, options) {
  const targetStyle = clonedNode.style;
  if (!targetStyle) {
    return;
  }
  const sourceStyle = window.getComputedStyle(nativeNode);
  if (sourceStyle.cssText) {
    targetStyle.cssText = sourceStyle.cssText;
    targetStyle.transformOrigin = sourceStyle.transformOrigin;
  } else {
    getStyleProperties(options).forEach((name) => {
      let value = sourceStyle.getPropertyValue(name);
      if (name === "font-size" && value.endsWith("px")) {
        const reducedFont = Math.floor(parseFloat(value.substring(0, value.length - 2))) - 0.1;
        value = `${reducedFont}px`;
      }
      if (isInstanceOfElement(nativeNode, HTMLIFrameElement) && name === "display" && value === "inline") {
        value = "block";
      }
      if (name === "d" && clonedNode.getAttribute("d")) {
        value = `path(${clonedNode.getAttribute("d")})`;
      }
      targetStyle.setProperty(name, value, sourceStyle.getPropertyPriority(name));
    });
  }
}
function cloneInputValue(nativeNode, clonedNode) {
  if (isInstanceOfElement(nativeNode, HTMLTextAreaElement)) {
    clonedNode.innerHTML = nativeNode.value;
  }
  if (isInstanceOfElement(nativeNode, HTMLInputElement)) {
    clonedNode.setAttribute("value", nativeNode.value);
  }
}
function cloneSelectValue(nativeNode, clonedNode) {
  if (isInstanceOfElement(nativeNode, HTMLSelectElement)) {
    const clonedSelect = clonedNode;
    const selectedOption = Array.from(clonedSelect.children).find((child) => nativeNode.value === child.getAttribute("value"));
    if (selectedOption) {
      selectedOption.setAttribute("selected", "");
    }
  }
}
function decorate(nativeNode, clonedNode, options) {
  if (isInstanceOfElement(clonedNode, Element)) {
    cloneCSSStyle(nativeNode, clonedNode, options);
    clonePseudoElements(nativeNode, clonedNode, options);
    cloneInputValue(nativeNode, clonedNode);
    cloneSelectValue(nativeNode, clonedNode);
  }
  return clonedNode;
}
async function ensureSVGSymbols(clone, options) {
  const uses = clone.querySelectorAll ? clone.querySelectorAll("use") : [];
  if (uses.length === 0) {
    return clone;
  }
  const processedDefs = {};
  for (let i = 0; i < uses.length; i++) {
    const use = uses[i];
    const id = use.getAttribute("xlink:href");
    if (id) {
      const exist = clone.querySelector(id);
      const definition = document.querySelector(id);
      if (!exist && definition && !processedDefs[id]) {
        processedDefs[id] = await cloneNode(definition, options, true);
      }
    }
  }
  const nodes = Object.values(processedDefs);
  if (nodes.length) {
    const ns = "http://www.w3.org/1999/xhtml";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("xmlns", ns);
    svg.style.position = "absolute";
    svg.style.width = "0";
    svg.style.height = "0";
    svg.style.overflow = "hidden";
    svg.style.display = "none";
    const defs = document.createElementNS(ns, "defs");
    svg.appendChild(defs);
    for (let i = 0; i < nodes.length; i++) {
      defs.appendChild(nodes[i]);
    }
    clone.appendChild(svg);
  }
  return clone;
}
async function cloneNode(node, options, isRoot) {
  if (!isRoot && options.filter && !options.filter(node)) {
    return null;
  }
  return Promise.resolve(node)
    .then((clonedNode) => cloneSingleNode(clonedNode, options))
    .then((clonedNode) => cloneChildren(node, clonedNode, options))
    .then((clonedNode) => decorate(node, clonedNode, options))
    .then((clonedNode) => ensureSVGSymbols(clonedNode, options));
}

var URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g;
var URL_WITH_FORMAT_REGEX = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g;
var FONT_SRC_REGEX = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function toRegex(url) {
  const escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${escaped})(['"]?\\))`, "g");
}
function parseURLs(cssText) {
  const urls = [];
  cssText.replace(URL_REGEX, (raw, quotation, url) => {
    urls.push(url);
    return raw;
  });
  return urls.filter((url) => !isDataUrl(url));
}
async function embed(cssText, resourceURL, baseURL, options, getContentFromUrl) {
  try {
    const resolvedURL = baseURL ? resolveUrl(resourceURL, baseURL) : resourceURL;
    const contentType = getMimeType(resourceURL);
    let dataURL;
    if (getContentFromUrl) {
      const content = await getContentFromUrl(resolvedURL);
      dataURL = makeDataUrl(content, contentType);
    } else {
      dataURL = await resourceToDataURL(resolvedURL, contentType, options);
    }
    return cssText.replace(toRegex(resourceURL), `$1${dataURL}$3`);
  } catch (error) {}
  return cssText;
}
function filterPreferredFontFormat(str, {preferredFontFormat}) {
  return !preferredFontFormat ? str : (
      str.replace(FONT_SRC_REGEX, (match) => {
        while (true) {
          const [src, , format] = URL_WITH_FORMAT_REGEX.exec(match) || [];
          if (!format) {
            return "";
          }
          if (format === preferredFontFormat) {
            return `src: ${src};`;
          }
        }
      })
    );
}
function shouldEmbed(url) {
  return url.search(URL_REGEX) !== -1;
}
async function embedResources(cssText, baseUrl, options) {
  if (!shouldEmbed(cssText)) {
    return cssText;
  }
  const filteredCSSText = filterPreferredFontFormat(cssText, options);
  const urls = parseURLs(filteredCSSText);
  return urls.reduce((deferred, url) => deferred.then((css) => embed(css, url, baseUrl, options)), Promise.resolve(filteredCSSText));
}

async function embedProp(propName, node, options) {
  var _a;
  const propValue = (_a = node.style) === null || _a === void 0 ? void 0 : _a.getPropertyValue(propName);
  if (propValue) {
    const cssString = await embedResources(propValue, null, options);
    node.style.setProperty(propName, cssString, node.style.getPropertyPriority(propName));
    return true;
  }
  return false;
}
async function embedBackground(clonedNode, options) {
  (await embedProp("background", clonedNode, options)) || (await embedProp("background-image", clonedNode, options));
  (await embedProp("mask", clonedNode, options)) || (await embedProp("-webkit-mask", clonedNode, options)) || (await embedProp("mask-image", clonedNode, options)) || (await embedProp("-webkit-mask-image", clonedNode, options));
}
async function embedImageNode(clonedNode, options) {
  const isImageElement = isInstanceOfElement(clonedNode, HTMLImageElement);
  if (!(isImageElement && !isDataUrl(clonedNode.src)) && !(isInstanceOfElement(clonedNode, SVGImageElement) && !isDataUrl(clonedNode.href.baseVal))) {
    return;
  }
  const url = isImageElement ? clonedNode.src : clonedNode.href.baseVal;
  const dataURL = await resourceToDataURL(url, getMimeType(url), options);
  await new Promise((resolve, reject) => {
    clonedNode.onload = resolve;
    clonedNode.onerror =
      options.onImageErrorHandler ?
        (...attributes) => {
          try {
            resolve(options.onImageErrorHandler(...attributes));
          } catch (error) {
            reject(error);
          }
        }
      : reject;
    const image = clonedNode;
    if (image.decode) {
      image.decode = resolve;
    }
    if (image.loading === "lazy") {
      image.loading = "eager";
    }
    if (isImageElement) {
      clonedNode.srcset = "";
      clonedNode.src = dataURL;
    } else {
      clonedNode.href.baseVal = dataURL;
    }
  });
}
async function embedChildren(clonedNode, options) {
  const children = toArray(clonedNode.childNodes);
  const deferreds = children.map((child) => embedImages(child, options));
  await Promise.all(deferreds).then(() => clonedNode);
}
async function embedImages(clonedNode, options) {
  if (isInstanceOfElement(clonedNode, Element)) {
    await embedBackground(clonedNode, options);
    await embedImageNode(clonedNode, options);
    await embedChildren(clonedNode, options);
  }
}

function applyStyle(node, options) {
  const {style} = node;
  if (options.backgroundColor) {
    style.backgroundColor = options.backgroundColor;
  }
  if (options.width) {
    style.width = `${options.width}px`;
  }
  if (options.height) {
    style.height = `${options.height}px`;
  }
  const manual = options.style;
  if (manual != null) {
    Object.keys(manual).forEach((key) => {
      style[key] = manual[key];
    });
  }
  return node;
}

var cssFetchCache = {};
async function fetchCSS(url) {
  let cache2 = cssFetchCache[url];
  if (cache2 != null) {
    return cache2;
  }
  const res = await fetch(url);
  const cssText = await res.text();
  cache2 = {url, cssText};
  cssFetchCache[url] = cache2;
  return cache2;
}
async function embedFonts(data, options) {
  let cssText = data.cssText;
  const regexUrl = /url\(["']?([^"')]+)["']?\)/g;
  const fontLocs = cssText.match(/url\([^)]+\)/g) || [];
  const loadFonts = fontLocs.map(async (loc) => {
    let url = loc.replace(regexUrl, "$1");
    if (!url.startsWith("https://")) {
      url = new URL(url, data.url).href;
    }
    return fetchAsDataURL(url, options.fetchRequestInit, ({result}) => {
      cssText = cssText.replace(loc, `url(${result})`);
      return [loc, result];
    });
  });
  return Promise.all(loadFonts).then(() => cssText);
}
function parseCSS(source) {
  if (source == null) {
    return [];
  }
  const result = [];
  const commentsRegex = /(\/\*[\s\S]*?\*\/)/gi;
  let cssText = source.replace(commentsRegex, "");
  const keyframesRegex = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
  while (true) {
    const matches = keyframesRegex.exec(cssText);
    if (matches === null) {
      break;
    }
    result.push(matches[0]);
  }
  cssText = cssText.replace(keyframesRegex, "");
  const importRegex = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi;
  const combinedCSSRegex = "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})";
  const unifiedRegex = new RegExp(combinedCSSRegex, "gi");
  while (true) {
    let matches = importRegex.exec(cssText);
    if (matches === null) {
      matches = unifiedRegex.exec(cssText);
      if (matches === null) {
        break;
      } else {
        importRegex.lastIndex = unifiedRegex.lastIndex;
      }
    } else {
      unifiedRegex.lastIndex = importRegex.lastIndex;
    }
    result.push(matches[0]);
  }
  return result;
}
async function getCSSRules(styleSheets, options) {
  const ret = [];
  const deferreds = [];
  styleSheets.forEach((sheet) => {
    if ("cssRules" in sheet) {
      try {
        toArray(sheet.cssRules || []).forEach((item, index) => {
          if (item.type === CSSRule.IMPORT_RULE) {
            let importIndex = index + 1;
            const url = item.href;
            const deferred = fetchCSS(url)
              .then((metadata) => embedFonts(metadata, options))
              .then((cssText) =>
                parseCSS(cssText).forEach((rule) => {
                  try {
                    sheet.insertRule(rule, rule.startsWith("@import") ? (importIndex += 1) : sheet.cssRules.length);
                  } catch (error) {
                    console.error("Error inserting rule from remote css", {
                      rule,
                      error,
                    });
                  }
                }),
              )
              .catch((e) => {
                console.error("Error loading remote css", e.toString());
              });
            deferreds.push(deferred);
          }
        });
      } catch (e) {
        const inline = styleSheets.find((a) => a.href == null) || document.styleSheets[0];
        if (sheet.href != null) {
          deferreds.push(
            fetchCSS(sheet.href)
              .then((metadata) => embedFonts(metadata, options))
              .then((cssText) =>
                parseCSS(cssText).forEach((rule) => {
                  inline.insertRule(rule, inline.cssRules.length);
                }),
              )
              .catch((err) => {
                console.error("Error loading remote stylesheet", err);
              }),
          );
        }
        console.error("Error inlining remote css file", e);
      }
    }
  });
  return Promise.all(deferreds).then(() => {
    styleSheets.forEach((sheet) => {
      if ("cssRules" in sheet) {
        try {
          toArray(sheet.cssRules || []).forEach((item) => {
            ret.push(item);
          });
        } catch (e) {
          console.error(`Error while reading CSS rules from ${sheet.href}`, e);
        }
      }
    });
    return ret;
  });
}
function getWebFontRules(cssRules) {
  return cssRules.filter((rule) => rule.type === CSSRule.FONT_FACE_RULE).filter((rule) => shouldEmbed(rule.style.getPropertyValue("src")));
}
async function parseWebFontRules(node, options) {
  if (node.ownerDocument == null) {
    throw new Error("Provided element is not within a Document");
  }
  const styleSheets = toArray(node.ownerDocument.styleSheets);
  const cssRules = await getCSSRules(styleSheets, options);
  return getWebFontRules(cssRules);
}
function normalizeFontFamily(font) {
  return font.trim().replace(/["']/g, "");
}
function getUsedFonts(node) {
  const fonts = new Set();
  function traverse(node2) {
    const fontFamily = node2.style.fontFamily || getComputedStyle(node2).fontFamily;
    fontFamily.split(",").forEach((font) => {
      fonts.add(normalizeFontFamily(font));
    });
    Array.from(node2.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        traverse(child);
      }
    });
  }
  traverse(node);
  return fonts;
}
async function getWebFontCSS(node, options) {
  const rules = await parseWebFontRules(node, options);
  const usedFonts = getUsedFonts(node);
  const cssTexts = await Promise.all(
    rules
      .filter((rule) => usedFonts.has(normalizeFontFamily(rule.style.fontFamily)))
      .map((rule) => {
        const baseUrl = rule.parentStyleSheet ? rule.parentStyleSheet.href : null;
        return embedResources(rule.cssText, baseUrl, options);
      }),
  );
  return cssTexts.join("\n");
}
async function embedWebFonts(clonedNode, options) {
  const cssText =
    options.fontEmbedCSS != null ? options.fontEmbedCSS
    : options.skipFonts ? null
    : await getWebFontCSS(clonedNode, options);
  if (cssText) {
    const styleNode = document.createElement("style");
    const sytleContent = document.createTextNode(cssText);
    styleNode.appendChild(sytleContent);
    if (clonedNode.firstChild) {
      clonedNode.insertBefore(styleNode, clonedNode.firstChild);
    } else {
      clonedNode.appendChild(styleNode);
    }
  }
}

async function toSvg(node, options = {}) {
  const {width, height} = getImageSize(node, options);
  const clonedNode = await cloneNode(node, options, true);
  await embedWebFonts(clonedNode, options);
  await embedImages(clonedNode, options);
  applyStyle(clonedNode, options);
  const datauri = await nodeToDataURL(clonedNode, width, height);
  return datauri;
}
async function toCanvas(node, options = {}) {
  const {width, height} = getImageSize(node, options);
  const svg = await toSvg(node, options);
  const img = await createImage(svg);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const ratio = options.pixelRatio || getPixelRatio();
  const canvasWidth = options.canvasWidth || width;
  const canvasHeight = options.canvasHeight || height;
  canvas.width = canvasWidth * ratio;
  canvas.height = canvasHeight * ratio;
  if (!options.skipAutoScale) {
    checkCanvasDimensions(canvas);
  }
  canvas.style.width = `${canvasWidth}`;
  canvas.style.height = `${canvasHeight}`;
  if (options.backgroundColor) {
    context.fillStyle = options.backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}
async function toBlob(node, options = {}) {
  const canvas = await toCanvas(node, options);
  const blob = await canvasToBlob(canvas, options);
  return blob;
}

var COLOR_FN_NAMES = ["color-mix", "oklch", "oklab", "lch", "lab", "color"];
var scratchCtx = null;
function getScratchCtx() {
  if (scratchCtx) return scratchCtx;
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  scratchCtx = canvas.getContext("2d");
  return scratchCtx;
}
function normalizeColor(raw) {
  const ctx = getScratchCtx();
  if (!ctx) return null;
  try {
    const sentinel = "rgba(1, 2, 3, 0.503)";
    ctx.fillStyle = "#000000";
    ctx.fillStyle = sentinel;
    const before = ctx.fillStyle;
    ctx.fillStyle = raw;
    const after = ctx.fillStyle;
    if (after === before) return null;
    return after;
  } catch (e) {
    return null;
  }
}
function resolveColorFunctions(input) {
  if (!input || input.indexOf("(") === -1) return input;
  let result = "";
  let i = 0;
  while (i < input.length) {
    let matched = false;
    for (const name of COLOR_FN_NAMES) {
      const token = `${name}(`;
      if (input.startsWith(token, i)) {
        let depth = 0;
        let j = i + name.length;
        for (; j < input.length; j += 1) {
          if (input[j] === "(") depth += 1;
          else if (input[j] === ")") {
            depth -= 1;
            if (depth === 0) {
              j += 1;
              break;
            }
          }
        }
        const raw = input.slice(i, j);
        const normalized = normalizeColor(raw);
        result += normalized != null ? normalized : raw;
        i = j;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result += input[i];
      i += 1;
    }
  }
  return result;
}

var import_obsidian2 = require("obsidian");
var NameMappingModal = class extends import_obsidian2.Modal {
  constructor(app, names, existingMap, onSubmit, onLiveChange, onCancel) {
    super(app);
    this.names = names;
    this.onSubmit = onSubmit;
    this.onLiveChange = onLiveChange;
    this.onCancel = onCancel;
    this.namesMap = {};
    for (const name of names) {
      this.namesMap[name] = (existingMap && existingMap[name]) || "";
    }
    this.customEntries = Object.entries(existingMap || {})
      .filter(([key]) => !names.includes(key))
      .map(([key, value]) => ({key, value: value || ""}));
  }
  onOpen() {
    const {contentEl} = this;
    contentEl.empty();
    contentEl.createEl("h3", {text: "이름 바꾸기"});
    contentEl.createEl("p", {
      text: "대체할 텍스트를 입력하세요. 비워두면 원래 이름 그대로 표시됩니다.",
      cls: "ggai-snap-modal-hint",
    });
    for (const name of this.names) {
      const setting = new import_obsidian2.Setting(contentEl).setName(name).addText((text) => {
        text.setPlaceholder(name).setValue(this.namesMap[name] || "");
        text.onChange((value) => {
          this.namesMap[name] = value;
          this.notifyLiveChange();
        });
      });
      setting.settingEl.addClass("ggai-snap-modal-field");
    }

    contentEl.createEl("p", {
      text: "그 외 추가로 바꾸고 싶은 텍스트가 있다면 아래에 추가하세요.",
      cls: "ggai-snap-modal-hint",
    });
    this.customListEl = contentEl.createDiv({cls: "ggai-snap-modal-custom-list"});
    for (const entry of this.customEntries) {
      this.renderCustomRow(entry);
    }

    new import_obsidian2.Setting(contentEl).addButton((btn) => {
      btn.setButtonText("+ 텍스트 추가").onClick(() => {
        const entry = {key: "", value: ""};
        this.customEntries.push(entry);
        this.renderCustomRow(entry);
      });
    });

    new import_obsidian2.Setting(contentEl)
      .addButton((btn) => {
        btn.setButtonText("취소").onClick(() => {
          this.close();
          if (this.onCancel) this.onCancel();
        });
      })
      .addButton((btn) => {
        btn
          .setButtonText("캡쳐")
          .setCta()
          .onClick(() => {
            this.onSubmit(this.buildFinalMap());
            this.close();
          });
      });
  }
  renderCustomRow(entry) {
    const row = new import_obsidian2.Setting(this.customListEl);
    row.settingEl.addClass("ggai-snap-modal-field");
    row.addText((text) => {
      text.setPlaceholder("찾을 텍스트").setValue(entry.key);
      text.onChange((value) => {
        entry.key = value;
        this.notifyLiveChange();
      });
    });
    row.addText((text) => {
      text.setPlaceholder("바꿀 텍스트").setValue(entry.value);
      text.onChange((value) => {
        entry.value = value;
        this.notifyLiveChange();
      });
    });
    row.addExtraButton((btn) => {
      btn
        .setIcon("cross")
        .setTooltip("삭제")
        .onClick(() => {
          this.customEntries = this.customEntries.filter((e) => e !== entry);
          row.settingEl.remove();
          this.notifyLiveChange();
        });
    });
  }
  buildFinalMap() {
    const map = {...this.namesMap};
    for (const entry of this.customEntries) {
      const key = entry.key.trim();
      if (!key) continue;
      map[key] = entry.value;
    }
    return map;
  }
  notifyLiveChange() {
    if (this.onLiveChange) this.onLiveChange(this.buildFinalMap());
  }
  onClose() {
    this.contentEl.empty();
  }
};

var MESSAGES_SELECTOR = ".ggai-chat-messages";
var MSG_SELECTOR = ".ggai-chat-msg";
var MOBILE_WIDTH_PX = 390;
var AVATAR_SHRINK_THRESHOLD_PX = 50;
var AVATAR_SHRINK_TARGET_PX = 40;
var BAKE_EXCLUDE_PROPS = new Set(["width", "height", "max-width", "max-height", "min-width", "min-height", "inline-size", "block-size", "position", "top", "left", "right", "bottom", "transform", "transform-origin", "align-self", "flex-basis", "grid-column", "grid-row", "grid-column-start", "grid-column-end", "grid-row-start", "grid-row-end"]);
function bakeComputedStyle(source, target) {
  const cs = getComputedStyle(source);
  let cssText = "";
  for (let i = 0; i < cs.length; i += 1) {
    const prop = cs.item(i);
    if (!prop || BAKE_EXCLUDE_PROPS.has(prop)) continue;
    const rawValue = cs.getPropertyValue(prop);
    if (!rawValue) continue;
    cssText += `${prop}:${resolveColorFunctions(rawValue)};`;
  }
  target.setAttribute("style", cssText);
}
function bakeTree(sourceRoot, cloneRoot) {
  bakeComputedStyle(sourceRoot, cloneRoot);
  const sourceChildren = Array.from(sourceRoot.children);
  const cloneChildren2 = Array.from(cloneRoot.children);
  for (let i = 0; i < sourceChildren.length; i += 1) {
    const cloneChild = cloneChildren2[i];
    if (cloneChild) bakeTree(sourceChildren[i], cloneChild);
  }
}
function pad2(n) {
  return n < 10 ? `0${n}` : `${n}`;
}
function timestamp() {
  const d = new Date();
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}-${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`;
}
function splitRangeEls(rangeEls, maxMessages) {
  if (!maxMessages || maxMessages <= 0) return [rangeEls];
  const chunks = [];
  let current = [];
  let msgCount = 0;
  for (const el of rangeEls) {
    const isMsg = el.classList.contains("ggai-chat-msg");
    if (isMsg && msgCount >= maxMessages) {
      chunks.push(current);
      current = [];
      msgCount = 0;
    }
    current.push(el);
    if (isMsg) msgCount += 1;
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}
function ensureImageLoaded(img, timeoutMs = 1500) {
  if (img.complete && (img.naturalWidth || img.width)) return Promise.resolve(img);
  return new Promise((resolve) => {
    let done = false;
    const finish = (result) => {
      if (done) return;
      done = true;
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
      resolve(result);
    };
    const onLoad = () => finish(img);
    const onError = () => finish(null);
    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);
    setTimeout(() => finish(img.naturalWidth || img.width ? img : null), timeoutMs);
  });
}
async function saveImageToVault(app, sessionFile, blob, extension = "png", ts, suffix = "") {
  const normalized = sessionFile.replace(/\\/g, "/");
  const parts = normalized.split("/").filter(Boolean);
  parts.pop();
  const sessionName = parts.pop() || "Untitled Session";
  let scenarioName = parts.pop() || "Untitled";
  if (scenarioName.toLowerCase() === "sessions" && parts.length >= 1) {
    scenarioName = parts.pop();
  }

  const rootFolder = "chat snapshot";
  const folder = `${rootFolder}/${scenarioName}`;
  if (!(await app.vault.adapter.exists(rootFolder))) {
    await app.vault.createFolder(rootFolder);
  }
  if (!(await app.vault.adapter.exists(folder))) {
    await app.vault.createFolder(folder);
  }

  const usedTs = ts || timestamp();
  let filename = `${sessionName}_${usedTs}${suffix}.${extension}`;
  let fullPath = `${folder}/${filename}`;
  let counter = 1;
  while (await app.vault.adapter.exists(fullPath)) {
    counter += 1;
    filename = `${sessionName}_${usedTs}${suffix}_${counter}.${extension}`;
    fullPath = `${folder}/${filename}`;
  }
  const buf = await blob.arrayBuffer();
  await app.vault.createBinary(fullPath, buf);
  return fullPath;
}
var CapturePreviewModal = class extends import_obsidian3.Modal {
  constructor(app, images, options) {
    super(app);
    this.images = images;
    this.options = options;
  }
  onOpen() {
    const {contentEl} = this;
    contentEl.empty();
    contentEl.createEl("h3", {text: "캡쳐 미리보기"});
    contentEl.createEl("p", {
      text: this.images.length > 1 ? `캡쳐본이 ${this.images.length}장으로 나눠 저장됩니다. 확인 후 저장하세요.` : "이 이미지로 저장할까요?",
      cls: "ggai-snap-modal-hint",
    });
    const gallery = contentEl.createDiv({cls: "ggai-snap-preview-gallery"});
    gallery.style.maxHeight = "60vh";
    gallery.style.overflowY = "auto";
    for (const image of this.images) {
      const img = gallery.createEl("img");
      img.src = image.url;
      img.style.display = "block";
      img.style.maxWidth = "100%";
      img.style.marginBottom = "8px";
      img.style.borderRadius = "4px";
    }
    const actionRow = new import_obsidian3.Setting(contentEl);
    actionRow.addButton((btn) => {
      btn.setButtonText("다시 선택").onClick(() => {
        this.close();
        this.options.onReselect();
      });
    });
    actionRow.addButton((btn) => {
      btn.setButtonText("옵션 재설정").onClick(() => {
        this.close();
        this.options.onResetOptions();
      });
    });
    if (this.options.showNameReplacementsReset) {
      actionRow.addButton((btn) => {
        btn.setButtonText("대체 텍스트 재설정").onClick(() => {
          this.close();
          this.options.onResetNameReplacements();
        });
      });
    }
    const confirmRow = new import_obsidian3.Setting(contentEl);
    confirmRow.addButton((btn) => {
      btn.setButtonText("취소").onClick(() => {
        this.close();
        this.options.onCancel();
      });
    });
    confirmRow.addButton((btn) => {
      btn
        .setButtonText("저장")
        .setCta()
        .onClick(() => {
          this.close();
          this.options.onSave();
        });
    });
  }
  onClose() {
    this.contentEl.empty();
    if (this.options.onClose) this.options.onClose();
  }
};
var ChatCaptureSession = class {
  constructor(app, sessionFile, settings, leaf, onSettingsChange) {
    this.container = null;
    this.toolbarEl = null;
    this.statusEl = null;
    this.captureBtn = null;
    this.startId = null;
    this.endId = null;
    this.capturing = false;
    this.boundMouseDown = (e) => this.handleMouseDown(e);
    this.boundClick = (e) => this.handleClick(e);
    this.app = app;
    this.sessionFile = sessionFile;
    this.settings = settings;
    this.leaf = leaf;
    this.onSettingsChange = onSettingsChange;
  }
  start() {
    var _a;
    const viewEl = this.leaf.view.containerEl;
    const container = (_a = viewEl == null ? void 0 : viewEl.querySelector(MESSAGES_SELECTOR)) != null ? _a : null;
    if (!container) {
      new import_obsidian3.Notice("채팅 화면을 찾을 수 없습니다. 세션이 열려 있는지 확인해주세요.");
      return false;
    }
    this.container = container;
    container.classList.add("ggai-snap-mode");
    container.addEventListener("mousedown", this.boundMouseDown, true);
    container.addEventListener("click", this.boundClick, true);
    this.buildToolbar();
    this.updateStatus();
    return true;
  }
  hideToolbar() {
    if (this.toolbarEl) this.toolbarEl.style.display = "none";
  }
  showToolbar() {
    if (this.toolbarEl) this.toolbarEl.style.display = "";
  }
  buildToolbar() {
    const bar = document.body.createDiv({cls: "ggai-snap-toolbar"});
    this.statusEl = bar.createSpan({cls: "ggai-snap-status"});
    const resetBtn = bar.createEl("button", {text: "다시 선택"});
    resetBtn.addEventListener("click", () => this.resetSelection());
    const captureBtn = bar.createEl("button", {text: "캡쳐"});
    captureBtn.addClass("mod-cta");
    captureBtn.disabled = true;
    captureBtn.addEventListener("click", () => void this.onCaptureButtonClick());
    this.captureBtn = captureBtn;
    const cancelBtn = bar.createEl("button", {text: "취소"});
    cancelBtn.addEventListener("click", () => this.cleanup());
    this.toolbarEl = bar;
  }
  handleMouseDown(e) {
    if (this.capturing) return;
    const target = e.target.closest(MSG_SELECTOR);
    if (target) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
  handleClick(e) {
    var _a;
    if (this.capturing) return;
    const target = e.target.closest(MSG_SELECTOR);
    if (!target || !((_a = this.container) == null ? void 0 : _a.contains(target))) return;
    e.preventDefault();
    e.stopPropagation();
    const nodeId = target.dataset.nodeId;
    if (!nodeId) return;
    if (!this.startId) {
      this.startId = nodeId;
    } else if (!this.endId) {
      this.endId = nodeId;
    } else {
      this.startId = nodeId;
      this.endId = null;
    }
    this.applyHighlight();
    this.updateStatus();
  }
  getOrderedMessageEls() {
    if (!this.container) return [];
    return Array.from(this.container.querySelectorAll(MSG_SELECTOR));
  }
  getSelectedRange() {
    if (!this.startId) return null;
    const msgEls = this.getOrderedMessageEls();
    const startIdx = msgEls.findIndex((el) => el.dataset.nodeId === this.startId);
    if (startIdx < 0) return null;
    if (!this.endId) return {lo: startIdx, hi: startIdx, msgEls};
    const endIdx = msgEls.findIndex((el) => el.dataset.nodeId === this.endId);
    if (endIdx < 0) return {lo: startIdx, hi: startIdx, msgEls};
    return {lo: Math.min(startIdx, endIdx), hi: Math.max(startIdx, endIdx), msgEls};
  }
  getNamesInRange(range) {
    const {lo, hi, msgEls} = range;
    const names = [];
    const seen = new Set();
    for (let i = lo; i <= hi; i += 1) {
      const nameEl = msgEls[i].querySelector(".ggai-chat-name");
      const name = nameEl ? nameEl.textContent.trim() : "";
      if (name && !seen.has(name)) {
        seen.add(name);
        names.push(name);
      }
    }
    return names;
  }
  async onCaptureButtonClick() {
    if (this.capturing) return;
    const range = this.getSelectedRange();
    if (!range) return;
    if (this.settings.nameMode === "replace") {
      const names = this.getNamesInRange(range);
      const existing = this.getNameReplacements();
      const hasUnmappedName = names.some((name) => !(name in existing));
      if (hasUnmappedName) {
        this.openNameMapping(names);
        return;
      }
    }
    void this.showPreview();
  }
  getNameReplacements() {
    var _a;
    return ((_a = this.settings.nameReplacementsBySession) == null ? void 0 : _a[this.sessionFile]) || {};
  }
  setNameReplacements(map) {
    if (!this.settings.nameReplacementsBySession) this.settings.nameReplacementsBySession = {};
    this.settings.nameReplacementsBySession[this.sessionFile] = {...map};
  }
  openNameMapping(names, onCancel) {
    new NameMappingModal(
      this.app,
      names,
      this.getNameReplacements(),
      async (map) => {
        this.setNameReplacements(map);
        if (this.onSettingsChange) await this.onSettingsChange(this.settings);
        if (this.baselineClones && this.baselineClones.length > 0) {
          void this.reEncodePreview();
        } else {
          void this.showPreview();
        }
      },
      (liveMap) => {
        this.setNameReplacements(liveMap);
        if (this.onSettingsChange) void this.onSettingsChange(this.settings);
      },
      onCancel,
    ).open();
  }
  applyHighlight() {
    const msgEls = this.getOrderedMessageEls();
    for (const el of msgEls) {
      el.classList.remove("ggai-snap-endpoint", "ggai-snap-in-range");
      el.style.opacity = "";
    }
    const range = this.getSelectedRange();
    if (!range) return;
    const {lo, hi, msgEls: ordered} = range;
    for (let i = lo; i <= hi; i += 1) {
      ordered[i].classList.add(i === lo || i === hi ? "ggai-snap-endpoint" : "ggai-snap-in-range");
    }
  }
  updateStatus() {
    if (!this.statusEl || !this.captureBtn) return;
    if (!this.startId) {
      this.statusEl.setText("캡쳐를 시작할 메시지를 선택하세요");
      this.captureBtn.disabled = true;
    } else if (!this.endId) {
      this.statusEl.setText("캡쳐 영역을 지정하세요");
      this.captureBtn.disabled = true;
    } else {
      this.statusEl.setText("영역 선택 완료");
      this.captureBtn.disabled = false;
    }
  }
  resetSelection() {
    this.startId = null;
    this.endId = null;
    this.applyHighlight();
    this.updateStatus();
  }
  async buildMobileClone(rangeEls, onProgress) {
    const clone = this.container.cloneNode(false);
    clone.classList.remove("ggai-snap-mode");
    bakeComputedStyle(this.container, clone);
    const total = rangeEls.length;
    for (let i = 0; i < rangeEls.length; i += 1) {
      const el = rangeEls[i];
      const elClone = el.cloneNode(true);
      bakeTree(el, elClone);
      clone.appendChild(elClone);
      if (onProgress) onProgress(i + 1, total);
      if ((i + 1) % 3 === 0) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    }
    clone.style.width = `${MOBILE_WIDTH_PX}px`;
    clone.style.maxWidth = `${MOBILE_WIDTH_PX}px`;
    clone.style.boxSizing = "border-box";
    clone.style.height = "auto";
    clone.style.maxHeight = "none";
    clone.style.overflow = "visible";
    clone.style.padding = "6px";
    clone.style.margin = "0";
    return clone;
  }
  async applyMessageStyling(clone, onProgress) {
    const msgEls = Array.from(clone.querySelectorAll(MSG_SELECTOR));
    const total = msgEls.length;
    const nameReplacements = this.getNameReplacements();

    for (const msgEl of msgEls) {
      msgEl.classList.remove("ggai-snap-endpoint", "ggai-snap-in-range");
      msgEl.style.outline = "none";
      msgEl.style.backgroundColor = "transparent";
      const nameEl = msgEl.querySelector(".ggai-chat-name");
      if (nameEl) {
        if (this.settings.nameMode === "hide") {
          nameEl.remove();
        } else if (this.settings.nameMode === "replace") {
          const original = nameEl.textContent.trim();
          const replacement = nameReplacements[original];
          if (replacement && replacement.trim()) nameEl.setText(replacement);
        }
      }
      const avatarEl = msgEl.querySelector(".ggai-chat-avatar");
      if (avatarEl) {
        const isUser = msgEl.classList.contains("is-user");
        const mode = isUser ? this.settings.userAvatarMode : this.settings.characterAvatarMode;
        if (mode === "hide") {
          avatarEl.remove();
        } else {
          this.shrinkAvatarIfLarge(avatarEl);
        }
      }
      const bubbleEl = msgEl.querySelector(".ggai-chat-bubble");
      if (bubbleEl) {
        bubbleEl.removeAttribute("contenteditable");
        bubbleEl.style.maxWidth = "100%";
        bubbleEl.style.minWidth = "0";
        bubbleEl.style.boxSizing = "border-box";
      }
    }

    if (this.settings.nameMode === "replace") {
      const entries = Object.entries(nameReplacements).filter(([, value]) => value && value.trim());
      if (entries.length > 0) {
        for (const msgEl of msgEls) {
          const bubbleEl = msgEl.querySelector(".ggai-chat-bubble");
          if (bubbleEl) this.replaceNamesInBubble(bubbleEl, entries);
        }
      }
    }

    for (let i = 0; i < msgEls.length; i += 1) {
      const msgEl = msgEls[i];
      const bubbleEl = msgEl.querySelector(".ggai-chat-bubble");
      if (bubbleEl) {
        const paras = bubbleEl.querySelectorAll("p.ggai-chat-para");
        for (const p of paras) {
          const w = p.getBoundingClientRect().width;
          if (w > 0) {
            p.style.width = `${Math.ceil(w)}px`;
          }
        }
      }
      if (onProgress) onProgress(i + 1, total);
      if ((i + 1) % 3 === 0) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    }
  }
  replaceNamesInBubble(bubbleEl, entries) {
    const walker = document.createTreeWalker(bubbleEl, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);
    for (const textNode of textNodes) {
      let text = textNode.nodeValue;
      let changed = false;
      for (const [original, replacement] of entries) {
        if (!original || !text.includes(original)) continue;
        text = text.split(original).join(replacement);
        changed = true;
      }
      if (changed) textNode.nodeValue = text;
    }
  }
  shrinkAvatarIfLarge(avatarEl) {
    const rect = avatarEl.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    if (!size || size < AVATAR_SHRINK_THRESHOLD_PX) return;
    const px2 = `${AVATAR_SHRINK_TARGET_PX}px`;
    avatarEl.style.width = px2;
    avatarEl.style.height = px2;
    avatarEl.style.minWidth = px2;
    avatarEl.style.minHeight = px2;
    avatarEl.style.maxWidth = px2;
    avatarEl.style.maxHeight = px2;
    avatarEl.style.flex = `0 0 ${px2}`;
    const img = avatarEl.querySelector("img");
    if (img) {
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
    }
  }
  async showPreview() {
    if (!this.container || this.capturing) return;
    const range = this.getSelectedRange();
    if (!range) return;
    this.capturing = true;
    if (this.captureBtn) this.captureBtn.disabled = true;
    if (this.statusEl) this.statusEl.setText("미리보기 생성 중...");
    try {
      await this.buildBaseline(range);
      await this.reEncodePreview();
    } catch (err) {
      new import_obsidian3.Notice(`미리보기 생성에 실패했습니다: ${err.message}`);
      this.capturing = false;
      if (this.captureBtn) this.captureBtn.disabled = false;
      if (this.statusEl) this.statusEl.setText("준비 완료");
    }
  }
  async buildBaseline(range) {
    const allChildren = Array.from(this.container.children);
    const startEl = range.msgEls[range.lo];
    const endEl = range.msgEls[range.hi];
    const startPos = allChildren.indexOf(startEl);
    const endPos = allChildren.indexOf(endEl);
    const rangeEls = allChildren.slice(startPos, endPos + 1).filter((el) => el.classList.contains("ggai-chat-msg") || el.classList.contains("ggai-chat-date-divider"));
    for (const el of this.getOrderedMessageEls()) {
      el.style.transition = "none";
      el.classList.remove("ggai-snap-endpoint", "ggai-snap-in-range");
      void el.offsetHeight;
    }
    const maxMessages = this.settings.maxMessagesPerCapture > 0 ? this.settings.maxMessagesPerCapture : 20;
    const chunks = splitRangeEls(rangeEls, maxMessages);
    for (const el of this.getOrderedMessageEls()) {
      el.style.transition = "";
    }

    this.baselineClones = [];
    for (let c = 0; c < chunks.length; c += 1) {
      const chunkEls = chunks[c];
      const label = chunks.length > 1 ? `이미지 ${c + 1}/${chunks.length} ` : "";
      const clone = await this.buildMobileClone(chunkEls, (done, total) => {
        if (this.statusEl) this.statusEl.setText(`${label}복제 중... (${done}/${total})`);
      });
      this.baselineClones.push(clone);
    }
    this.applyHighlight();
  }
  async reEncodePreview() {
    if (!this.baselineClones || this.baselineClones.length === 0) return;
    this.capturing = true;
    this.showToolbar();
    if (this.captureBtn) this.captureBtn.disabled = true;
    if (this.statusEl) this.statusEl.setText("로딩 중...");
    const activeWrappers = [];
    try {
      const bg = getComputedStyle(document.body).getPropertyValue("--background-primary").trim() || "#ffffff";
      const format = this.settings.imageFormat === "jpg" ? "jpg" : "png";
      const images = [];
      const total = this.baselineClones.length;

      for (let c = 0; c < total; c += 1) {
        const label = total > 1 ? `이미지 ${c + 1}/${total} ` : "";
        const clone = this.baselineClones[c].cloneNode(true);
        const wrapper = document.body.createDiv();
        wrapper.style.position = "fixed";
        wrapper.style.top = "0";
        wrapper.style.left = "-99999px";
        wrapper.style.pointerEvents = "none";
        wrapper.appendChild(clone);
        activeWrappers.push(wrapper);
        await this.applyMessageStyling(clone, (done, msgTotal) => {
          if (this.statusEl) this.statusEl.setText(`${label}스타일 적용 중... (${done}/${msgTotal})`);
        });
        if (this.statusEl) this.statusEl.setText(`${label}인코딩 중...`);
        const blobOptions = {
          backgroundColor: bg,
          pixelRatio: 2,
          cacheBust: true,
          type: IMAGE_FORMAT_MIME[format],
        };
        if (format === "jpg") blobOptions.quality = JPEG_QUALITY;
        const blob = await toBlob(clone, blobOptions);
        if (!blob) throw new Error("이미지 인코딩 실패");
        images.push({blob, url: URL.createObjectURL(blob)});
        wrapper.remove();
        activeWrappers.pop();
      }

      if (this.statusEl) this.statusEl.setText("미리보기 준비 완료");
      this.openPreview(images, format);
    } catch (err) {
      new import_obsidian3.Notice(`미리보기 생성에 실패했습니다: ${err.message}`);
      this.capturing = false;
      if (this.captureBtn) this.captureBtn.disabled = false;
      if (this.statusEl) this.statusEl.setText("준비 완료");
    } finally {
      for (const wrapper of activeWrappers) wrapper.remove();
    }
  }
  openPreview(images, format) {
    this.hideToolbar();
    const modal = new CapturePreviewModal(this.app, images, {
      showNameReplacementsReset: this.settings.nameMode === "replace",
      onClose: () => this.showToolbar(),
      onSave: () => {
        this.revokePreviewUrls(images);
        void this.saveImages(images, format);
      },
      onReselect: () => {
        this.revokePreviewUrls(images);
        this.baselineClones = null;
        this.capturing = false;
        if (this.captureBtn) this.captureBtn.disabled = false;
        this.resetSelection();
      },
      onResetOptions: () => {
        this.revokePreviewUrls(images);
        this.capturing = false;
        this.hideToolbar();
        new CaptureOptionsModal(
          this.app,
          this.settings,
          async (settings) => {
            this.settings = settings;
            if (this.onSettingsChange) await this.onSettingsChange(this.settings);
            void this.reEncodePreview();
          },
          "재생성",
          () => void this.reEncodePreview(),
        ).open();
      },
      onResetNameReplacements: () => {
        this.revokePreviewUrls(images);
        this.capturing = false;
        this.hideToolbar();
        const currentRange = this.getSelectedRange();
        const names = currentRange ? this.getNamesInRange(currentRange) : [];
        this.openNameMapping(names, () => void this.reEncodePreview());
      },
      onCancel: () => {
        this.revokePreviewUrls(images);
        this.capturing = false;
        if (this.captureBtn) this.captureBtn.disabled = false;
        if (this.statusEl) this.statusEl.setText("영역 선택 완료");
      },
    });
    modal.open();
  }
  revokePreviewUrls(images) {
    for (const image of images) {
      try {
        URL.revokeObjectURL(image.url);
      } catch (e) {}
    }
  }
  async saveImages(images, format) {
    if (this.statusEl) this.statusEl.setText("저장 중...");
    try {
      const ts = timestamp();
      const savedPaths = [];
      for (let i = 0; i < images.length; i += 1) {
        const suffix = images.length > 1 ? `_part${i + 1}` : "";
        const savedPath = await saveImageToVault(this.app, this.sessionFile, images[i].blob, IMAGE_FORMAT_EXTENSIONS[format], ts, suffix);
        savedPaths.push(savedPath);
      }
      const message =
        savedPaths.length > 1 ?
          `캡쳐본을 ${savedPaths.length}장으로 나눠 저장했습니다:
${savedPaths.join("\n")}`
        : `캡쳐본을 저장했습니다:
${savedPaths[0]}`;
      new import_obsidian3.Notice(message);
      this.cleanup();
    } catch (err) {
      new import_obsidian3.Notice(`캡쳐에 실패했습니다: ${err.message}`);
      this.capturing = false;
      if (this.captureBtn) this.captureBtn.disabled = false;
      if (this.statusEl) this.statusEl.setText("준비 완료");
    }
  }
  cleanup() {
    var _a;
    if (this.container) {
      this.container.classList.remove("ggai-snap-mode");
      this.container.removeEventListener("mousedown", this.boundMouseDown, true);
      this.container.removeEventListener("click", this.boundClick, true);
      for (const el of this.getOrderedMessageEls()) {
        el.classList.remove("ggai-snap-endpoint", "ggai-snap-in-range");
        el.style.opacity = "";
      }
    }
    (_a = this.toolbarEl) == null ? void 0 : _a.remove();
    this.toolbarEl = null;
  }
};

var IMAGE_FORMAT_EXTENSIONS = {
  png: "png",
  jpg: "jpg",
};
var IMAGE_FORMAT_MIME = {
  png: "image/png",
  jpg: "image/jpeg",
};
var JPEG_QUALITY = 0.92;

var DEFAULT_CAPTURE_SETTINGS = {
  nameMode: "show",
  userAvatarMode: "show",
  characterAvatarMode: "show",
  nameReplacementsBySession: {},
  imageFormat: "png",
  maxMessagesPerCapture: 20,
};

var ChatSnapshotPlugin = class extends import_obsidian4.Plugin {
  constructor() {
    super(...arguments);
    this.disposers = [];
    this.captureSettings = {...DEFAULT_CAPTURE_SETTINGS};
    this.activeCapture = null;
  }
  async onload() {
    const saved = await this.loadData();
    this.captureSettings = {...DEFAULT_CAPTURE_SETTINGS, ...(saved != null ? saved : {})};
    this.app.workspace.onLayoutReady(() => this.tryRegisterStellaAction());
  }
  tryRegisterStellaAction() {
    const stella = getStellaEngine(this.app);
    if (!stella) return;
    const unregister = stella.extensions.register({
      id: "ggai-chat-snapshot:capture",
      sessionActions: [
        {
          id: "capture",
          title: "캡쳐",
          icon: "camera",
          run: ({sessionFile}) => {
            this.beginCapture(sessionFile);
          },
        },
      ],
    });
    this.disposers.push(unregister);
  }
  beginCapture(sessionFile) {
    var _a;
    (_a = this.activeCapture) == null ? void 0 : _a.cleanup();
    this.activeCapture = null;
    const leaf = this.app.workspace.activeLeaf;
    if (!leaf) return;
    new CaptureOptionsModal(this.app, this.captureSettings, async (settings) => {
      this.captureSettings = settings;
      await this.saveData(this.captureSettings);
      const session = new ChatCaptureSession(this.app, sessionFile, settings, leaf, async (updatedSettings) => {
        this.captureSettings = updatedSettings;
        await this.saveData(this.captureSettings);
      });
      const started = session.start();
      if (started) {
        this.activeCapture = session;
      }
    }).open();
  }
  onunload() {
    var _a;
    (_a = this.activeCapture) == null ? void 0 : _a.cleanup();
    this.activeCapture = null;
    for (const dispose of this.disposers) dispose();
    this.disposers = [];
  }
};
