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

  function setupYouTubeVideos(root) {
    var noop = function () {};
    var empty = {
      refresh: noop,
      syncClones: noop
    };
    if (!root) return empty;
    var viewport = root.querySelector(".yt-viewport");
    var track = root.querySelector(".yt-track");
    var dialog = root.closest("section").querySelector(".yt-dialog");
    if (!viewport || !track || !dialog) return empty;

    var closeButton = dialog.querySelector(".yt-dialog-close");
    var dialogDate = dialog.querySelector(".yt-dialog-date");
    var dialogTitle = dialog.querySelector("#yt-dialog-title");
    var dialogDesc = dialog.querySelector(".yt-dialog-desc");
    var dialogLink = dialog.querySelector(".yt-dialog-link");
    var lastTrigger = null;
    var resizeFrame = 0;

    function isClamped(element) {
      var style = window.getComputedStyle(element);
      var lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.55;
      return element.scrollHeight > Math.ceil(lineHeight * 3) + 1;
    }

    function syncClones() {
      var bounds = viewport.getBoundingClientRect();
      track.querySelectorAll(".yt-card.is-clone").forEach(function (card) {
        var box = card.getBoundingClientRect();
        var visible = box.right > bounds.left + 1 && box.left < bounds.right - 1;
        card.inert = !visible;
        card.setAttribute("aria-hidden", String(!visible));
      });
    }

    function recalculate() {
      track.querySelectorAll(".yt-card").forEach(function (card) {
        var title = card.querySelector("h3");
        var desc = card.querySelector(".yt-desc");
        var more = card.querySelector(".yt-more");
        if (!title || !desc || !more) return;
        more.hidden = !(isClamped(title) || isClamped(desc));
      });
      syncClones();
    }

    function openDialog(card, trigger) {
      if (!card || dialog.open) return;
      var title = card.querySelector("h3");
      var desc = card.querySelector(".yt-desc");
      var date = card.querySelector(".yt-meta");
      var link = card.querySelector(".yt-link");
      var descText = desc ? desc.innerText.trim() : "";
      dialogTitle.textContent = title ? title.textContent.replace(/\s+/g, " ").trim() : "";
      dialogDate.textContent = date ? date.textContent.trim() : "";
      dialogDesc.textContent = descText;
      dialogDesc.hidden = !descText;
      var href = link ? link.getAttribute("href") : "";
      if (href) {
        dialogLink.href = href;
        dialogLink.hidden = false;
      } else {
        dialogLink.removeAttribute("href");
        dialogLink.hidden = true;
      }
      lastTrigger = trigger;
      var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty("--yt-scrollbar-width", scrollbarWidth + "px");
      document.body.classList.add("yt-dialog-open");
      dialog.showModal();
      closeButton.focus({ preventScroll: true });
    }

    closeButton.addEventListener("click", function () {
      dialog.close();
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener("close", function () {
      document.body.classList.remove("yt-dialog-open");
      document.documentElement.style.removeProperty("--yt-scrollbar-width");
      if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
      lastTrigger = null;
    });

    track.addEventListener("click", function (event) {
      var more = event.target.closest(".yt-more");
      if (more) {
        openDialog(more.closest(".yt-card"), more);
        return;
      }
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        recalculate();
      });
    }
    window.addEventListener("load", recalculate);
    window.addEventListener("resize", function () {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(function () {
        resizeFrame = requestAnimationFrame(recalculate);
      });
    });

    recalculate();

    return {
      refresh: recalculate,
      syncClones: syncClones
    };
  }

  function setupReviewCards(root) {
    var noop = function () {};
    var empty = {
      refresh: noop,
      syncClones: noop
    };
    if (!root) return empty;
    var viewport = root.querySelector(".testimonial-viewport");
    var track = root.querySelector(".testimonial-track");
    var dialog = root.querySelector(".review-dialog");
    if (!viewport || !track || !dialog) return empty;

    var reviewLinks = {
      "Arsyila Azzahra Rahman": "https://maps.app.goo.gl/Y4EfcaA2yVwiScPE6",
      "Hanif Afriyan": "https://maps.app.goo.gl/jDN4ZAtDfY7y7vmTA",
      "Jafra skin care Cengkareng": "https://maps.app.goo.gl/E9idZ1pnQAKkewQq6",
      "Suci Almeera Shalu": "https://maps.app.goo.gl/kyvszo3Ek31iLnie6",
      "Lia ismiati": "https://maps.app.goo.gl/w9i7prjb8MfB1gPN7",
      "Prinanti Mandalia": "https://maps.app.goo.gl/ohPaGskLQ7bpzus46",
      "Albirru Tenta Tarigan": "https://maps.app.goo.gl/SgSrDp7Q3C4Es6GV6",
      "Eko Nur Wahyudin": "https://maps.app.goo.gl/7YksiuPdWckjSxVD8"
    };
    var closeButton = dialog.querySelector(".review-dialog-close");
    var scroller = dialog.querySelector(".review-dialog-scroll");
    var media = dialog.querySelector(".review-dialog-media");
    var image = dialog.querySelector(".review-dialog-image");
    image.draggable = false;
    var prevButton = dialog.querySelector(".review-dialog-prev");
    var nextButton = dialog.querySelector(".review-dialog-next");
    var indicator = dialog.querySelector(".review-dialog-indicator");
    var dialogStars = dialog.querySelector(".review-dialog-stars");
    var dialogWaktu = dialog.querySelector(".review-dialog-waktu");
    var dialogTitle = dialog.querySelector("#review-dialog-title");
    var dialogSumber = dialog.querySelector(".review-dialog-sumber");
    var dialogText = dialog.querySelector(".review-dialog-text");
    var dialogLink = dialog.querySelector(".review-dialog-link");
    var photos = [];
    var photoIndex = 0;
    var lastTrigger = null;
    var resizeFrame = 0;
    var swipeStart = null;

    function reviewerKey(card) {
      var author = card.querySelector(".review-author strong");
      var name = author ? author.textContent.trim() : "";
      if (name.indexOf("Jafra skin care Cengkareng") === 0) return "Jafra skin care Cengkareng";
      return name;
    }

    function findLink(card) {
      return reviewLinks[reviewerKey(card)] || "";
    }

    function photoHint(count) {
      return count > 1
        ? "Ketuk untuk lihat " + count + " foto & ulasan"
        : "Ketuk foto untuk baca ulasan lengkap";
    }

    function addControls(card) {
      var author = card.querySelector(".review-author");
      var text = card.querySelector(".review-text");
      var photosArea = card.querySelector(".review-photos");
      if (author && text && !author.querySelector(".review-more")) {
        var more = document.createElement("button");
        more.type = "button";
        more.className = "review-more";
        more.textContent = "Selengkapnya";
        more.setAttribute("aria-haspopup", "dialog");
        author.appendChild(more);
      }
      if (photosArea && !card.querySelector(".review-photo-hint")) {
        var hint = document.createElement("p");
        hint.className = "review-photo-hint";
        hint.textContent = "Perbesar gambar & baca ulasan";
        photosArea.insertAdjacentElement("afterend", hint);
      }
      if (card && !card.querySelector(".review-map-link")) {
        var map = document.createElement("a");
        map.className = "review-map-link";
        map.textContent = "Lihat di Google Maps";
        map.target = "_blank";
        map.rel = "noopener";
        var hintEl = card.querySelector(".review-photo-hint");
        if (hintEl) hintEl.insertAdjacentElement("afterend", map);
      }
      if (photosArea && !card.querySelector(".review-photo-tap")) {
        var count = photosArea.querySelectorAll("a").length;
        var firstImg = photosArea.querySelector("img");
        var tap = document.createElement("button");
        var frame = document.createElement("span");
        var img = document.createElement("img");
        var mobileHint = document.createElement("span");
        tap.type = "button";
        tap.className = "review-photo-tap";
        tap.setAttribute("aria-haspopup", "dialog");
        frame.className = "review-photo-frame";
        img.src = firstImg ? firstImg.getAttribute("src") : "";
        img.alt = firstImg ? firstImg.getAttribute("alt") : "Foto ulasan";
        img.loading = "lazy";
        img.decoding = "async";
        frame.appendChild(img);
        mobileHint.className = "review-photo-hint-mobile";
        mobileHint.textContent = photoHint(count);
        tap.appendChild(frame);
        if (count > 1) {
          var badge = document.createElement("span");
          badge.className = "review-photo-badge";
          badge.textContent = count + " foto";
          tap.appendChild(badge);
        }
        tap.appendChild(mobileHint);
        photosArea.insertAdjacentElement("afterend", tap);
      }
    }

    function isClamped(element) {
      var style = window.getComputedStyle(element);
      var lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.7;
      return element.scrollHeight > Math.ceil(lineHeight * 2) + 1;
    }

    function syncClones() {
      var bounds = viewport.getBoundingClientRect();
      track.querySelectorAll(".testimonial-card.is-clone").forEach(function (card) {
        var box = card.getBoundingClientRect();
        var visible = box.right > bounds.left + 1 && box.left < bounds.right - 1;
        card.inert = !visible;
        card.setAttribute("aria-hidden", String(!visible));
      });
    }

    function recalculate() {
      track.querySelectorAll(".testimonial-card").forEach(function (card) {
        var text = card.querySelector(".review-text");
        var more = card.querySelector(".review-more");
        var photosArea = card.querySelector(".review-photos");
        var map = card.querySelector(".review-map-link");
        var href = findLink(card);
        if (photosArea) {
          var count = photosArea.querySelectorAll("a").length;
          photosArea.dataset.count = String(count);
          var tapHint = card.querySelector(".review-photo-hint-mobile");
          if (tapHint) tapHint.textContent = photoHint(count);
        }
        if (text && more) more.hidden = !isClamped(text);
        if (map && href) map.href = href;
      });
      syncClones();
    }

    function updatePhoto() {
      if (!photos.length) return;
      var link = photos[photoIndex];
      var img = link.querySelector("img");
      image.src = link.getAttribute("href");
      image.alt = img ? img.getAttribute("alt") : link.getAttribute("aria-label");
      prevButton.hidden = photos.length < 2;
      nextButton.hidden = photos.length < 2;
      indicator.hidden = photos.length < 2;
      indicator.textContent = photos.length > 1 ? (photoIndex + 1) + " / " + photos.length : "";
    }

    function movePhoto(step) {
      if (photos.length < 2) return;
      photoIndex = (photoIndex + step + photos.length) % photos.length;
      updatePhoto();
    }

    function openDialog(card, trigger) {
      if (!card || dialog.open) return;
      var stars = card.querySelector(".stars");
      var waktu = card.querySelector(".waktu-ulasan");
      var author = card.querySelector(".review-author strong");
      var sumber = card.querySelector(".review-author span");
      var text = card.querySelector(".review-text");
      dialogStars.textContent = stars ? stars.textContent : "";
      dialogWaktu.textContent = waktu ? waktu.textContent : "";
      dialogTitle.textContent = author ? author.textContent : "";
      dialogSumber.textContent = sumber ? sumber.textContent : "";
      dialogText.textContent = text ? text.textContent.trim() : "";
      dialogLink.href = findLink(card);
      photos = Array.prototype.slice.call(card.querySelectorAll(".review-photos a"));
      photoIndex = 0;
      updatePhoto();
      lastTrigger = trigger;
      if (scroller) scroller.scrollTop = 0;
      var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty("--review-scrollbar-width", scrollbarWidth + "px");
      document.body.classList.add("review-dialog-open");
      dialog.showModal();
      closeButton.focus({ preventScroll: true });
    }

    track.querySelectorAll(".testimonial-card:not(.is-clone)").forEach(addControls);

    root.addEventListener("click", function (event) {
      var more = event.target.closest(".review-more");
      if (more) {
        openDialog(more.closest(".testimonial-card"), more);
        return;
      }
      var photo = event.target.closest(".review-photos a");
      if (photo) {
        event.preventDefault();
        openDialog(photo.closest(".testimonial-card"), photo);
        return;
      }
      var tap = event.target.closest(".review-photo-tap");
      if (tap) openDialog(tap.closest(".testimonial-card"), tap);
    });

    closeButton.addEventListener("click", function () {
      dialog.close();
    });

    prevButton.addEventListener("click", function () { movePhoto(-1); });
    nextButton.addEventListener("click", function () { movePhoto(1); });

    media.addEventListener("pointerdown", function (event) {
      if (event.button && event.button !== 0) return;
      swipeStart = { x: event.clientX, y: event.clientY };
    });

    media.addEventListener("pointerup", function (event) {
      if (!swipeStart) return;
      var deltaX = event.clientX - swipeStart.x;
      var deltaY = event.clientY - swipeStart.y;
      swipeStart = null;
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        movePhoto(deltaX < 0 ? 1 : -1);
      }
    });

    media.addEventListener("pointercancel", function () {
      swipeStart = null;
    });

    document.addEventListener("keydown", function (event) {
      if (!dialog.open) return;
      if (event.key === "ArrowLeft") movePhoto(-1);
      if (event.key === "ArrowRight") movePhoto(1);
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener("close", function () {
      document.body.classList.remove("review-dialog-open");
      document.documentElement.style.removeProperty("--review-scrollbar-width");
      image.removeAttribute("src");
      if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
      lastTrigger = null;
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(recalculate);
    }
    window.addEventListener("load", recalculate);
    window.addEventListener("resize", function () {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(recalculate);
    });

    recalculate();

    return {
      refresh: recalculate,
      syncClones: syncClones
    };
  }

  function createCarousel(root, options) {
    if (!root) return null;

    var viewport = root.querySelector(options.viewport);
    var track = root.querySelector(options.track);
    var counter = root.querySelector(options.counter);
    var prev = root.querySelector(options.prev);
    var next = root.querySelector(options.next);
    var originals = track ? Array.prototype.slice.call(track.querySelectorAll(options.item)) : [];
    if (!viewport || !track || !counter || !prev || !next || !originals.length) return null;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    var onMove = options.onMove || function () {};
    var onClone = options.onClone || function () {};
    var onRebuild = options.onRebuild || function () {};
    var onSettle = options.onSettle || function () {};
    var cloneCount = 0;
    var realCount = originals.length;
    var position = 0;
    var step = 0;
    var animating = false;
    var pending = 0;
    var start = null;
    var suppressClick = false;
    var suppressTimer = 0;
    var resizeFrame = 0;

    function pad(value) {
      return String(value).padStart(2, "0");
    }

    function visibleCount() {
      if (window.innerWidth <= 640) return 1;
      if (options.maxVisible) return Math.min(options.maxVisible, realCount);
      if (window.innerWidth <= 1100) return 2;
      return 3;
    }

    function targetCloneCount() {
      return Math.min(visibleCount(), realCount);
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

    function normalize() {
      while (position >= cloneCount + realCount) position -= realCount;
      while (position < cloneCount) position += realCount;
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
      if (!step && first) {
        var gap = parseFloat(getComputedStyle(track).gap) || 0;
        step = first.getBoundingClientRect().width + gap;
      }
      applyTransform(false);
      onSettle();
    }

    function move(delta) {
      if (!delta || realCount < 2) return;
      onMove();
      if (animating) {
        pending = delta;
        return;
      }
      position += delta;
      if (reduced.matches) {
        normalize();
        applyTransform(false);
        updateCounter();
        onSettle();
        return;
      }
      animating = true;
      applyTransform(true);
    }

    function rebuild(preserveIndex) {
      var current = preserveIndex ? normalizedIndex() : 0;
      track.querySelectorAll(options.item + ".is-clone").forEach(function (card) {
        card.remove();
      });
      cloneCount = targetCloneCount();
      originals.slice(-cloneCount).forEach(function (card) {
        var clone = card.cloneNode(true);
        clone.classList.add("is-clone");
        clone.setAttribute("aria-hidden", "true");
        clone.inert = true;
        onClone(clone);
        track.insertBefore(clone, originals[0]);
      });
      originals.slice(0, cloneCount).forEach(function (card) {
        var clone = card.cloneNode(true);
        clone.classList.add("is-clone");
        clone.setAttribute("aria-hidden", "true");
        clone.inert = true;
        onClone(clone);
        track.appendChild(clone);
      });
      track.querySelectorAll("img").forEach(function (image) {
        image.setAttribute("draggable", "false");
      });
      position = cloneCount + current;
      animating = false;
      pending = 0;
      measure();
      updateCounter();
      onRebuild();
    }

    track.addEventListener("transitionend", function (event) {
      if (event.target !== track || event.propertyName !== "transform" || !animating) return;
      animating = false;
      normalize();
      applyTransform(false);
      updateCounter();
      onSettle();
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
      if (event.button && event.button !== 0) return;
      start = { x: event.clientX, y: event.clientY };
    });

    viewport.addEventListener("pointerup", function (event) {
      if (!start) return;
      var deltaX = event.clientX - start.x;
      var deltaY = event.clientY - start.y;
      start = null;
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
        suppressClick = true;
        window.clearTimeout(suppressTimer);
        suppressTimer = window.setTimeout(function () {
          suppressClick = false;
        }, 400);
        move(deltaX < 0 ? 1 : -1);
      }
    });

    viewport.addEventListener("pointercancel", function () {
      start = null;
    });

    viewport.addEventListener("click", function (event) {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }, true);

    window.addEventListener("resize", function () {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(function () {
        if (targetCloneCount() !== cloneCount) rebuild(true);
        else measure();
      });
    });

    rebuild(false);
    return { refresh: function () { rebuild(true); } };
  }

  function setupCarousel() {
    var youtubeRoot = document.querySelector("[data-carousel='youtube']");
    var youtubeVideos = setupYouTubeVideos(youtubeRoot);
    var testimoniRoot = document.querySelector("[data-carousel='testimoni']");
    var reviewCards = setupReviewCards(testimoniRoot);
    var instances = [];
    var docs = createCarousel(document.querySelector("[data-carousel='docs']"), {
      viewport: ".doc-viewport",
      track: ".doc-track",
      item: ".doc-card",
      counter: ".doc-counter",
      prev: ".doc-prev",
      next: ".doc-next"
    });
    var youtube = createCarousel(youtubeRoot, {
      viewport: ".yt-viewport",
      track: ".yt-track",
      item: ".yt-card",
      counter: ".yt-counter",
      prev: ".yt-prev",
      next: ".yt-next",
      onRebuild: youtubeVideos.refresh,
      onSettle: youtubeVideos.syncClones
    });
    var testimoni = createCarousel(testimoniRoot, {
      viewport: ".testimonial-viewport",
      track: ".testimonial-track",
      item: ".testimonial-card",
      counter: ".testimonial-counter",
      prev: ".testimonial-prev",
      next: ".testimonial-next",
      maxVisible: 2,
      onRebuild: reviewCards.refresh,
      onSettle: reviewCards.syncClones
    });
    if (docs) instances.push(docs);
    if (youtube) instances.push(youtube);
    if (testimoni) instances.push(testimoni);
    return instances;
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
    function perbaruiWaktu() {
      var nodes = document.querySelectorAll(".waktu-ulasan[data-tanggal]");
      if (!nodes.length) return;
      var sekarang = new Date();
      nodes.forEach(function (el) {
        el.textContent = waktuRelatif(el.getAttribute("data-tanggal"), sekarang);
      });
    }

    perbaruiWaktu();
    setInterval(perbaruiWaktu, 60 * 60 * 1000);
  }

  var carousels = [];

  function initSite() {
    renderAssets();
    setupNav();
    setupActiveNav();
    carousels = setupCarousel();
    setYear();
    setupReviewTimes();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSite, { once: true });
  } else {
    initSite();
  }

  window.NauraAssets = {
    apply: function () {
      renderAssets();
      carousels.forEach(function (instance) {
        instance.refresh();
      });
    },
    setPlaceholderMode: function (value) {
      config.settings.usePlaceholders = Boolean(value);
      renderAssets();
      carousels.forEach(function (instance) {
        instance.refresh();
      });
    }
  };
})();
