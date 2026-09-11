// Utility for Google Translate integration across the website

export function setGoogleTranslateCookie(langCode) {
  if (typeof window === "undefined") return;
  const hostname = window.location.hostname;
  const isEn = !langCode || langCode === "en";

  if (isEn) {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${hostname}; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${hostname}; path=/;`;
  } else {
    const val = `/en/${langCode}`;
    document.cookie = `googtrans=${val}; path=/;`;
    document.cookie = `googtrans=${val}; domain=.${hostname}; path=/;`;
    document.cookie = `googtrans=${val}; domain=${hostname}; path=/;`;
  }
}

export function changeGoogleTranslate(langCode) {
  if (typeof window === "undefined") return;
  const isEn = !langCode || langCode === "en";

  setGoogleTranslateCookie(langCode);

  const applyCombo = () => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      const targetVal = isEn ? "" : langCode;
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

export function retriggerGoogleTranslate() {
  if (typeof window === "undefined") return;
  const currentLang = localStorage.getItem("karya-language");
  if (!currentLang || currentLang === "en") return;

  const select = document.querySelector(".goog-te-combo");
  if (select) {
    if (select.value !== currentLang) {
      select.value = currentLang;
    }
    select.dispatchEvent(new Event("change"));
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
      "iframe.skiptranslate, body > .skiptranslate, .goog-te-banner-frame, .VIpgJd-ZVi9od-aZ2wEe-wOHMyf"
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
