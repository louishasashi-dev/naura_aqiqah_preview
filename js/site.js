(function () {
  var config = window.NAURA_ASSETS || { settings: {}, items: {} };

  function makePlaceholder(slot, item) {
    var placeholder = document.createElement("span");
    placeholder.className = "asset-placeholder";
    placeholder.textContent = item && item.label ? item.label : "Gambar belum tersedia";
    slot.replaceChildren(placeholder);
    slot.classList.add("is-placeholder");
  }

  function renderAssets() {
    document.querySelectorAll("[data-asset]").forEach(function (slot) {
      var key = slot.getAttribute("data-asset");
      var item = config.items[key];

      slot.classList.remove("is-placeholder");
      delete slot.dataset.status;
      delete slot.dataset.verified;

      if (!item) {
        makePlaceholder(slot, null);
        return;
      }

      slot.dataset.status = item.status;
      slot.dataset.verified = String(Boolean(item.verified));

      if (config.settings.usePlaceholders || !item.enabled || !item.src) {
        makePlaceholder(slot, item);
        return;
      }

      var image = document.createElement("img");
      image.src = item.src;
      image.alt = item.alt || "";
      image.loading = slot.closest(".hero") ? "eager" : "lazy";
      image.decoding = "async";
      image.onerror = function () {
        makePlaceholder(slot, item);
      };
      slot.replaceChildren(image);
    });
  }

  function setupNav() {
    var shell = document.querySelector(".header-inner");
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!shell || !toggle || !nav) return;

    var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    var compact = window.matchMedia("(max-width: 1100px)");
    var mobileMs = 250;
    var containerMs = 760;
    var linkMs = 360;
    var inStep = 90;
    var outStep = 70;
    var isNormal = false;
    var busy = false;
    var queued = null;
    var run = 0;
    var timers = [];

    function clearTimers() {
      timers.forEach(clearTimeout);
      timers = [];
    }

    function later(callback, delay) {
      timers.push(setTimeout(callback, delay));
    }

    function isCurrent(id) {
      return id === run;
    }

    function setAttributes(next) {
      shell.dataset.navMode = next ? "normal" : "split";
      shell.classList.toggle("nav-normal", next);
      toggle.setAttribute("aria-expanded", String(next));
      toggle.setAttribute("aria-label", next ? "Sembunyikan navigasi" : "Tampilkan navigasi");
      nav.setAttribute("aria-hidden", String(!next));
      if (next) nav.removeAttribute("inert");
      else nav.setAttribute("inert", "");
    }

    function setDelays(step, reverse) {
      links.forEach(function (link, index) {
        var order = reverse ? links.length - 1 - index : index;
        link.style.transitionDelay = order * step + "ms";
      });
    }

    function clearDelays() {
      links.forEach(function (link) {
        link.style.transitionDelay = "";
      });
    }

    function finish(next) {
      isNormal = next;
      busy = false;
      if (queued !== null && queued !== isNormal) {
        var nextMode = queued;
        queued = null;
        setMode(nextMode);
      } else {
        queued = null;
      }
    }

    function snap(next) {
      run += 1;
      clearTimers();
      isNormal = next;
      busy = false;
      queued = null;
      clearDelays();
      setAttributes(next);
      shell.classList.toggle("nav-links-visible", next);
      shell.classList.toggle("nav-links-in", next);
    }

    function openNav(id) {
      setAttributes(true);
      if (compact.matches) {
        clearDelays();
        shell.classList.add("nav-links-visible");
        requestAnimationFrame(function () {
          if (!isCurrent(id)) return;
          shell.classList.add("nav-links-in");
          later(function () {
            if (isCurrent(id)) finish(true);
          }, mobileMs);
        });
        return;
      }
      setDelays(inStep, false);
      later(function () {
        if (!isCurrent(id)) return;
        shell.classList.add("nav-links-visible");
        requestAnimationFrame(function () {
          if (!isCurrent(id)) return;
          requestAnimationFrame(function () {
            if (!isCurrent(id)) return;
            shell.classList.add("nav-links-in");
            finish(true);
          });
        });
      }, containerMs);
    }

    function closeNav(id) {
      if (compact.matches) {
        clearDelays();
        shell.classList.remove("nav-links-in");
        shell.classList.remove("nav-links-visible");
        setAttributes(false);
        later(function () {
          if (isCurrent(id)) finish(false);
        }, mobileMs);
        return;
      }
      setDelays(outStep, true);
      shell.classList.remove("nav-links-in");
      later(function () {
        if (!isCurrent(id)) return;
        shell.classList.remove("nav-links-visible");
        setAttributes(false);
        later(function () {
          if (isCurrent(id)) finish(false);
        }, containerMs);
      }, (links.length - 1) * outStep + linkMs);
    }

    function setMode(next) {
      if (next === isNormal) return;
      if (busy) {
        queued = next;
        return;
      }
      run += 1;
      clearTimers();
      busy = true;
      var id = run;
      if (reduced.matches) {
        snap(next);
        return;
      }
      if (next) openNav(id);
      else closeNav(id);
    }

    toggle.addEventListener("click", function () {
      setMode(!isNormal);
    });

    document.addEventListener("click", function (event) {
      if (isNormal && !shell.contains(event.target)) setMode(false);
    });

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        if (isNormal) setMode(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isNormal) setMode(false);
    });

    if (reduced.addEventListener) {
      reduced.addEventListener("change", function () {
        snap(isNormal);
      });
    }

    if (compact.addEventListener) {
      compact.addEventListener("change", function () {
        clearTimers();
        run += 1;
        isNormal = false;
        busy = false;
        queued = null;
        clearDelays();
        setAttributes(false);
        shell.classList.remove("nav-links-visible");
        shell.classList.remove("nav-links-in");
      });
    }

    snap(false);
  }

  function setupActiveNav() {
    var nav = document.getElementById("site-nav");
    if (!nav) return;

    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var sections = links
      .map(function (link) {
        return document.getElementById(link.getAttribute("href").slice(1));
      })
      .filter(Boolean);
    if (!links.length || !sections.length) return;

    var frame = 0;
    var pendingId = null;
    var pendingTimer = 0;

    function setActive(id) {
      links.forEach(function (link) {
        var active = link.getAttribute("href") === "#" + id;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    }

    function currentId() {
      var offset = 120;
      var active = null;
      var ordered = sections.slice().sort(function (a, b) {
        return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
      });
      ordered.forEach(function (section) {
        if (section.getBoundingClientRect().top <= offset) active = section.id;
      });
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      ) {
        active = "kontak";
      }
      return active;
    }

    function sync() {
      frame = 0;
      if (pendingId) return;
      setActive(currentId());
    }

    function requestSync() {
      if (!frame) frame = requestAnimationFrame(sync);
    }

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        var id = link.getAttribute("href").slice(1);
        pendingId = id;
        setActive(id);
        window.clearTimeout(pendingTimer);
        pendingTimer = window.setTimeout(function () {
          pendingId = null;
          requestSync();
        }, 1200);
      });
    });

    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
    sync();
  }

  function setupCarousel() {
    var root = document.querySelector("[data-carousel='docs']");
    if (!root) return null;

    var viewport = root.querySelector(".doc-viewport");
    var track = root.querySelector(".doc-track");
    var originals = Array.prototype.slice.call(track.querySelectorAll(".doc-card"));
    var counter = root.querySelector(".doc-counter");
    var prev = root.querySelector(".doc-prev");
    var next = root.querySelector(".doc-next");
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    var cloneCount = 3;
    var realCount = originals.length;
    var position = cloneCount;
    var step = 0;
    var animating = false;
    var pending = 0;
    var startX = null;
    var resizeFrame = 0;

    function pad(value) {
      return String(value).padStart(2, "0");
    }

    function normalizedIndex() {
      return ((position - cloneCount) % realCount + realCount) % realCount;
    }

    function updateCounter() {
      counter.textContent = pad(normalizedIndex() + 1) + " / " + pad(realCount);
    }

    function applyTransform(animate) {
      if (animate) track.classList.remove("is-jumping");
      else track.classList.add("is-jumping");
      track.style.transform = "translate3d(" + -position * step + "px, 0, 0)";
      if (!animate) {
        void track.offsetWidth;
        track.classList.remove("is-jumping");
      }
    }

    function measure() {
      if (animating) {
        animating = false;
        pending = 0;
        normalize();
        updateCounter();
      }
      var first = track.children[cloneCount];
      var second = track.children[cloneCount + 1];
      if (first && second) step = second.offsetLeft - first.offsetLeft;
      if (!step) {
        var gap = parseFloat(getComputedStyle(track).gap) || 0;
        step = first.getBoundingClientRect().width + gap;
      }
      applyTransform(false);
    }

    function normalize() {
      while (position >= cloneCount + realCount) position -= realCount;
      while (position < cloneCount) position += realCount;
    }

    function move(delta) {
      if (!delta || realCount < 2) return;
      if (animating) {
        pending = delta;
        return;
      }
      position += delta;
      if (reduced.matches) {
        normalize();
        applyTransform(false);
        updateCounter();
        return;
      }
      animating = true;
      applyTransform(true);
    }

    function rebuild() {
      track.querySelectorAll(".doc-card.is-clone").forEach(function (card) {
        card.remove();
      });
      originals.slice(-cloneCount).forEach(function (card) {
        var clone = card.cloneNode(true);
        clone.classList.add("is-clone");
        clone.setAttribute("aria-hidden", "true");
        track.insertBefore(clone, originals[0]);
      });
      originals.slice(0, cloneCount).forEach(function (card) {
        var clone = card.cloneNode(true);
        clone.classList.add("is-clone");
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });
      track.querySelectorAll("img").forEach(function (image) {
        image.setAttribute("draggable", "false");
      });
      position = cloneCount;
      animating = false;
      pending = 0;
      measure();
      updateCounter();
    }

    track.addEventListener("transitionend", function (event) {
      if (event.target !== track || event.propertyName !== "transform" || !animating) return;
      animating = false;
      normalize();
      applyTransform(false);
      updateCounter();
      if (pending) {
        var delta = pending;
        pending = 0;
        move(delta);
      }
    });

    prev.addEventListener("click", function () {
      move(-1);
    });

    next.addEventListener("click", function () {
      move(1);
    });

    viewport.addEventListener("pointerdown", function (event) {
      startX = event.clientX;
    });

    viewport.addEventListener("pointerup", function (event) {
      if (startX === null) return;
      var deltaX = event.clientX - startX;
      startX = null;
      if (Math.abs(deltaX) > 45) move(deltaX < 0 ? 1 : -1);
    });

    viewport.addEventListener("pointercancel", function () {
      startX = null;
    });

    window.addEventListener("resize", function () {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(measure);
    });

    rebuild();
    return { refresh: rebuild };
  }

  function setYear() {
    var now = new Date().getFullYear();
    var year = document.getElementById("year");
    var experience = document.getElementById("years-experience");
    if (year) year.textContent = String(now);
    if (experience) experience.textContent = String(now - 2013 + 1) + "+";
  }

  function waktuRelatif(tanggal, sekarang) {
    var parts = tanggal.split("-").map(Number);
    var y = parts[0];
    var m = parts[1];
    var d = parts[2];
    var hari = Math.max(0, Math.round(
      (Date.UTC(sekarang.getFullYear(), sekarang.getMonth(), sekarang.getDate()) -
        Date.UTC(y, m - 1, d)) / 86400000
    ));
    var bulan = (sekarang.getFullYear() - y) * 12 + sekarang.getMonth() - (m - 1);
    if (sekarang.getDate() < d) bulan--;
    if (hari === 0) return "hari ini";
    if (hari === 1) return "kemarin";
    if (hari < 7) return hari + " hari lalu";
    if (bulan < 1) {
      var minggu = Math.floor(hari / 7);
      return minggu === 1 ? "seminggu lalu" : minggu + " minggu lalu";
    }
    if (bulan < 12) return bulan === 1 ? "sebulan lalu" : bulan + " bulan lalu";
    var tahun = Math.floor(bulan / 12);
    return tahun === 1 ? "setahun lalu" : tahun + " tahun lalu";
  }

  function setupReviewTimes() {
    var nodes = document.querySelectorAll(".waktu-ulasan[data-tanggal]");
    if (!nodes.length) return;

    function perbaruiWaktu() {
      var sekarang = new Date();
      nodes.forEach(function (el) {
        el.textContent = waktuRelatif(el.getAttribute("data-tanggal"), sekarang);
      });
    }

    perbaruiWaktu();
    setInterval(perbaruiWaktu, 60 * 60 * 1000);
  }

  function setupReviewLightbox() {
    var overlay = document.getElementById("review-lightbox");
    var photoAreas = document.querySelectorAll(".review-photos");
    if (!overlay || !photoAreas.length) return;

    var image = overlay.querySelector(".lightbox-image");
    var caption = overlay.querySelector(".lightbox-caption");
    var closeButton = overlay.querySelector(".lightbox-close");
    var prevButton = overlay.querySelector(".lightbox-prev");
    var nextButton = overlay.querySelector(".lightbox-next");
    var groups = [];
    var background = Array.prototype.slice.call(document.querySelectorAll("body > :not(.lightbox)"));
    var currentGroup = 0;
    var currentIndex = 0;
    var lastTrigger = null;

    photoAreas.forEach(function (area) {
      var links = Array.prototype.slice.call(area.querySelectorAll("a"));
      area.dataset.count = String(links.length);

      var card = area.closest(".review-card");
      if (card && !card.querySelector(".review-photo-hint")) {
        var hint = document.createElement("p");
        hint.className = "review-photo-hint";
        hint.textContent = "Klik gambar untuk memperbesar";
        area.insertAdjacentElement("afterend", hint);
      }

      groups.push(links.map(function (link) {
        var img = link.querySelector("img");
        return {
          link: link,
          src: link.getAttribute("href"),
          alt: img ? img.getAttribute("alt") : link.getAttribute("aria-label")
        };
      }));
    });

    function show() {
      var group = groups[currentGroup];
      var item = group[currentIndex];
      image.src = item.src;
      image.alt = item.alt;
      caption.textContent = item.alt;
      prevButton.hidden = group.length < 2;
      nextButton.hidden = group.length < 2;
    }

    function open(groupIndex, itemIndex) {
      currentGroup = groupIndex;
      currentIndex = itemIndex;
      lastTrigger = groups[groupIndex][itemIndex].link;
      show();
      overlay.hidden = false;
      document.body.classList.add("lightbox-open");
      background.forEach(function (el) { el.inert = true; });
      closeButton.focus();
    }

    function hide() {
      overlay.hidden = true;
      document.body.classList.remove("lightbox-open");
      background.forEach(function (el) { el.inert = false; });
      image.removeAttribute("src");
      if (lastTrigger) lastTrigger.focus();
    }

    function move(step) {
      var group = groups[currentGroup];
      currentIndex = (currentIndex + step + group.length) % group.length;
      show();
    }

    groups.forEach(function (group, groupIndex) {
      group.forEach(function (item, itemIndex) {
        item.link.addEventListener("click", function (event) {
          event.preventDefault();
          open(groupIndex, itemIndex);
        });
      });
    });

    closeButton.addEventListener("click", hide);
    prevButton.addEventListener("click", function () { move(-1); });
    nextButton.addEventListener("click", function () { move(1); });
    overlay.addEventListener("click", function (event) {
      if (!event.target.closest("button, .lightbox-image")) hide();
    });
    document.addEventListener("keydown", function (event) {
      if (overlay.hidden) return;
      if (event.key === "Escape") hide();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
      if (event.key !== "Tab") return;
      var focusable = Array.prototype.slice.call(overlay.querySelectorAll("button")).filter(function (button) {
        return !button.hidden;
      });
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (!first) return;
      if (!overlay.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  var carousel = null;

  renderAssets();
  setupNav();
  setupActiveNav();
  carousel = setupCarousel();
  setYear();
  setupReviewTimes();
  setupReviewLightbox();

  window.NauraAssets = {
    apply: function () {
      renderAssets();
      if (carousel) carousel.refresh();
    },
    setPlaceholderMode: function (value) {
      config.settings.usePlaceholders = Boolean(value);
      renderAssets();
      if (carousel) carousel.refresh();
    }
  };
})();
