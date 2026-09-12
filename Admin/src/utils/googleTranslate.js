// Utility for Google Translate integration across the Admin Console
import { LANGUAGE_OPTIONS } from "../constants/languages";

// React DOM reconciliation protection when Google Translate wraps text nodes in <font> tags
if (typeof window !== "undefined" && typeof Node === "function" && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("Google Translate: Prevented removeChild on modified parent", child, this);
      }
      return child;
    }
    return originalRemoveChild.apply(this, arguments);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("Google Translate: Prevented insertBefore on modified parent", referenceNode, this);
      }
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments);
  };
}

export function setGoogleTranslateCookie(langCode) {
  if (typeof window === "undefined") return;
  const hostname = window.location.hostname;
  const isEn = !langCode || langCode === "en";

  if (isEn) {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    if (hostname.includes(".")) {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${hostname}; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${hostname}; path=/;`;
    }
  } else {
    const val = `/en/${langCode}`;
    document.cookie = `googtrans=${val}; path=/;`;
    if (hostname.includes(".")) {
      document.cookie = `googtrans=${val}; domain=.${hostname}; path=/;`;
      document.cookie = `googtrans=${val}; domain=${hostname}; path=/;`;
    }
  }
}

export function changeGoogleTranslate(langCode) {
  if (typeof window === "undefined") return;
  const isEn = !langCode || langCode === "en";

  setGoogleTranslateCookie(langCode);

  const applyCombo = () => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      if (isEn) {
        if (select.value !== "") {
          select.value = "";
          select.dispatchEvent(new Event("change"));
        }
        return true;
      }

      // Find language details for smart alias resolution (e.g., brx/bodo, gom/kok, mni/mni-Mtei)
      const langDef = LANGUAGE_OPTIONS.find((l) => l.code === langCode);
      const englishName = langDef?.english?.toLowerCase() || "";

      let targetVal = langCode;
      const options = Array.from(select.options);

      // 1. Exact match by value
      const exactMatch = options.find((opt) => opt.value.toLowerCase() === langCode.toLowerCase());
      if (exactMatch) {
        targetVal = exactMatch.value;
      } else {
        // 2. Prefix match by code (e.g. mni -> mni-Mtei)
        const prefixMatch = options.find((opt) => opt.value.toLowerCase().startsWith(langCode.toLowerCase()));
        if (prefixMatch) {
          targetVal = prefixMatch.value;
        } else if (englishName) {
          // 3. Match by English name in option text
          const nameMatch = options.find((opt) => opt.text.toLowerCase().includes(englishName));
          if (nameMatch) {
            targetVal = nameMatch.value;
          }
        }
      }

      if (select.value !== targetVal) {
        select.value = targetVal;
        select.dispatchEvent(new Event("change"));
      }
      return true;
    }
    return false;
  };

  if (!applyCombo()) {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (applyCombo() || attempts > 30) {
        clearInterval(interval);
      }
    }, 200);
  }
}

/**
 * Permanently suppresses and hides Google Translate's injected top navbar/banner
 */
export function initGoogleTopBarSuppressor() {
  if (typeof window === "undefined") return;

  const suppress = () => {
    if (document.body && document.body.style.top && document.body.style.top !== "0px") {
      document.body.style.top = "0px";
    }
    const frames = document.querySelectorAll(
      "iframe.skiptranslate, body > .skiptranslate, .goog-te-banner-frame, .VIpgJd-ZVi9od-aZ2wEe-wOHMyf, #goog-gt-tt"
    );
    frames.forEach((el) => {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("visibility", "hidden", "important");
      el.style.setProperty("height", "0px", "important");
      el.style.setProperty("opacity", "0", "important");
      el.style.setProperty("pointer-events", "none", "important");
    });
  };

  suppress();
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", suppress);
  }
  window.addEventListener("load", suppress);

  try {
    const observer = new MutationObserver(suppress);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
      childList: true,
      subtree: true,
    });
  } catch (e) {
    // Ignore observer errors
  }
}

// Auto-initialize suppressor
if (typeof window !== "undefined") {
  initGoogleTopBarSuppressor();
}
