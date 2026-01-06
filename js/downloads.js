// Minimal download link updater (no jQuery).
// Update the release version here and all pages using .dl-* links update automatically.
(function () {
  'use strict';

  // Single source of truth:
  var VERSION = '3.3.0';

  function getOS() {
    var userAgent = window.navigator.userAgent || '';
    var platform = window.navigator.platform || '';
    var macPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    var windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    var iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    var os = null;

    if (macPlatforms.indexOf(platform) !== -1) {
      os = 'Mac';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }

    return os;
  }

  function setHrefAll(selector, href) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      els[i].setAttribute('href', href);
    }
  }

  function setText(selector, text) {
    var el = document.querySelector(selector);
    if (el) el.textContent = text;
  }

  function setClass(selector, className) {
    var el = document.querySelector(selector);
    if (el) el.className = className;
  }

  function updateDownloadLinks() {
    var baseUrl =
      'https://github.com/jamaljsr/polar/releases/download/v' + VERSION;

    var fileUrls = {
      apple: baseUrl + '/polar-mac-x64-v' + VERSION + '.dmg',
      linux: baseUrl + '/polar-linux-x86_64-v' + VERSION + '.AppImage',
      windows: baseUrl + '/polar-win-x64-v' + VERSION + '.exe',
    };

    // Update footer buttons (present on multiple pages)
    setHrefAll('a.dl-apple', fileUrls.apple);
    setHrefAll('a.dl-linux', fileUrls.linux);
    setHrefAll('a.dl-windows', fileUrls.windows);

    // Homepage: set primary link + the two alternates if present
    var detectedOS = getOS();
    var primaryUrl = 'https://github.com/jamaljsr/polar/releases';
    var alts = [];

    // Decide primary by OS (only for Mac/Linux/Windows)
    if (detectedOS === 'Mac') primaryUrl = fileUrls.apple;
    if (detectedOS === 'Linux') primaryUrl = fileUrls.linux;
    if (detectedOS === 'Windows') primaryUrl = fileUrls.windows;

    if (detectedOS === 'Mac') {
      alts = ['Linux', 'Windows'];
      setClass('#hero-dl-icon', 'fab fa-apple');
      setText('#hero-dl-text', 'Download for Mac');
    } else if (detectedOS === 'Linux') {
      alts = ['Mac', 'Windows'];
      setClass('#hero-dl-icon', 'fab fa-linux');
      setText('#hero-dl-text', 'Download for Linux');
    } else if (detectedOS === 'Windows') {
      alts = ['Mac', 'Linux'];
      setClass('#hero-dl-icon', 'fab fa-windows');
      setText('#hero-dl-text', 'Download for Windows');
    } else {
      // Keep default "Download" copy if we can't pick a specific installer.
      alts = ['Mac', 'Linux'];
    }

    setHrefAll('a.dl-primary', primaryUrl);

    var alt1 = document.querySelector('a.dl-alt1');
    var alt2 = document.querySelector('a.dl-alt2');
    if (alt1 && alts[0]) {
      alt1.textContent = alts[0];
      alt1.setAttribute(
        'href',
        alts[0] === 'Mac'
          ? fileUrls.apple
          : alts[0] === 'Linux'
          ? fileUrls.linux
          : fileUrls.windows
      );
    }
    if (alt2 && alts[1]) {
      alt2.textContent = alts[1];
      alt2.setAttribute(
        'href',
        alts[1] === 'Mac'
          ? fileUrls.apple
          : alts[1] === 'Linux'
          ? fileUrls.linux
          : fileUrls.windows
      );
    }
  }

  // Expose for optional manual use / debugging
  window.PolarDownloads = {
    VERSION: VERSION,
    updateDownloadLinks: updateDownloadLinks,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateDownloadLinks);
  } else {
    updateDownloadLinks();
  }
})();
