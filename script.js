/**
 * R.K. High School, Obra - Official Website Scripts
 * Features: Mobile Nav, Stats Counter, Gallery Modal, Dynamic Year & Monet Theme Harmonizer
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Device / Browser Monet Accent Color Synchronization
  const initMonetPalette = () => {
    try {
      // Test if browser exposes native accent color
      const dummyEl = document.createElement("div");
      dummyEl.style.color = "AccentColor";
      document.body.appendChild(dummyEl);
      const computedAccent = window.getComputedStyle(dummyEl).color;
      document.body.removeChild(dummyEl);

      // Agar device/browser ka dynamic Monet Accent maujood hai
      if (computedAccent && computedAccent !== "rgb(0, 0, 0)" && !computedAccent.includes("rgba(0, 0, 0")) {
        document.documentElement.style.setProperty("--primary", computedAccent);
      }
    } catch (e) {
      console.warn("Monet engine fallback to default theme color.");
    }
  };

  initMonetPalette();

  // 2. Mobile Navigation Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen);
      menuToggle.innerHTML = isOpen ? "&#x2715;" : "&#9776;";
    });

    // Menu link click par band ho jaye
    document.querySelectorAll(".nav a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = "&#9776;";
      });
    });

    // Screen par bahar tap karne par auto-close
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = "&#9776;";
      }
    });
  }

  // 3. Animated Statistics Counters
  const counters = document.querySelectorAll(".counter");
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = Number(el.dataset.target);
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 60));

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current + "+";
          }, 25);

          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(c => counterObserver.observe(c));
  }

  // 4. Gallery Lightbox Modal
  const lightbox = document.querySelector("#lightbox");
  const lightboxImg = document.querySelector("#lightbox-img");
  const lightboxClose = document.querySelector(".lightbox-close");

  if (lightbox && lightboxImg) {
    document.querySelectorAll(".gallery-item").forEach(item => {
      item.addEventListener("click", () => {
        lightboxImg.src = item.dataset.src;
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.src = "";
    };

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && lightbox.classList.contains("open")) {
        closeLightbox();
      }
    });
  }

  // 5. Back to Top Button
  const toTop = document.querySelector("#toTop");
  if (toTop) {
    window.addEventListener("scroll", () => {
      toTop.classList.toggle("show", window.scrollY > 400);
    });

    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 6. Dynamic Current Year in Footer
  const yearEl = document.querySelector("#year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
