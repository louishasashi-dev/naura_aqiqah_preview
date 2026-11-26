(function () {
  function setViewport() {
    document.documentElement.style.setProperty("--viewport-h", window.innerHeight + "px");
  }

  setViewport();
  window.addEventListener("resize", setViewport, { passive: true });
})();
