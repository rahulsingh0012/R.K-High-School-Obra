/**
 * R.K. High School, Obra - Official Website Scripts
 * Features: Device Monet Palette Synchronizer, Mobile Menu, Animated Stats, Lightbox Modal
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Device/Browser Monet Palette Engine
  const applyMonetColors = () => {
    try {
      const probe = document.createElement("div");
      probe.style.color = "AccentColor";
      document.body.appendChild(probe);
      const computed = window.getComputedStyle(probe).color;
      document.body.removeChild(probe);

      // Agar device ya browser ka native Monet Accent maujood hai
      if (computed && computed !== "rgb(0, 0, 0)" && !computed.includes("rgba(0, 0, 0")) {
        document.documentElement.style.setProperty("--monet-primary", computed);
        document.documentElement.style.setProperty("--pill-text", computed);
      }
    } catch (err) {
      console.warn("Fallback to default school palette.");
    }
  };

  applyMonetColors();

  // Dark/Light Mode switch hone par re-evaluate karein
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyMonetColors);
  }

  // 2. Responsive Mobile Navigation Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen);
      menuToggle.innerHTML = isOpen ? "&#x2715;" : "&#9776;";
    });

    // Menu link tap par menu auto close ho jaye
    document.querySelectorAll(".nav a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = "&#9776;";
      });
    });

    // Screen par kahin bhi bahar touch karne par menu band ho jaye
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = "&#9776;";
      }
    });
  }

  // 3. Smooth Animated Statistics Counters
  const counters = document.querySelectorAll(".counter");
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const targetEl = entry.target;
          const targetVal = Number(targetEl.dataset.target);
          let currentVal = 0;
          const increment = Math.max(1, Math.ceil(targetVal / 50));

          const interval = setInterval(() => {
            currentVal += increment;
            if (currentVal >= targetVal) {
              currentVal = targetVal;
              clearInterval(interval);
            }
            targetEl.textContent = currentVal + "+";
          }, 30);

          observer.unobserve(targetEl);
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // 4. Photo Gallery Lightbox Viewer
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

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("open")) {
        closeLightbox();
      }
    });
  }

  // 5. Scroll to Top Button
  const toTop = document.querySelector("#toTop");
  if (toTop) {
    window.addEventListener("scroll", () => {
      toTop.classList.toggle("show", window.scrollY > 380);
    });

    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 6. Footer Dynamic Current Year
  const yearEl = document.querySelector("#year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
