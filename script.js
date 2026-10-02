/**
 * R.K. High School, Obra - Official Website Scripts
 */

document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Menu Toggle with Animated Icon
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen);
      menuToggle.innerHTML = isOpen ? "&#x2715;" : "&#9776;";
    });

    // Kisi bhi menu link par click karte hi menu band ho jaye
    document.querySelectorAll(".nav a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = "&#9776;";
      });
    });

    // Screen par bahar tap karne par menu auto-close ho jaye
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = "&#9776;";
      }
    });
  }

  // Animated Statistics Counters
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

  // Gallery Lightbox Modal
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

  // Back to Top Button
  const toTop = document.querySelector("#toTop");
  if (toTop) {
    window.addEventListener("scroll", () => {
      toTop.classList.toggle("show", window.scrollY > 400);
    });

    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Dynamic Current Year in Footer
  const yearEl = document.querySelector("#year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  // Principal Photo Upload & Browser-local Persistence
  const principalInput=document.querySelector("#principalImageInput"), principalPhoto=document.querySelector("#principalPhoto"), principalPlaceholder=document.querySelector("#principalPhotoPlaceholder"), removePrincipalImage=document.querySelector("#removePrincipalImage"), principalStorageKey="rkhs-principal-photo";
  const showPrincipalPhoto=src=>{if(!principalPhoto||!principalPlaceholder)return;principalPhoto.src=src;principalPhoto.hidden=false;principalPlaceholder.hidden=true;if(removePrincipalImage)removePrincipalImage.hidden=false};
  const clearPrincipalPhoto=()=>{if(principalPhoto){principalPhoto.src="";principalPhoto.hidden=true}if(principalPlaceholder)principalPlaceholder.hidden=false;if(removePrincipalImage)removePrincipalImage.hidden=true;try{localStorage.removeItem(principalStorageKey)}catch(e){}};
  if(principalInput)principalInput.addEventListener("change",e=>{const file=e.target.files&&e.target.files[0];if(!file||!file.type.startsWith("image/"))return;const reader=new FileReader();reader.onload=()=>{showPrincipalPhoto(reader.result);try{localStorage.setItem(principalStorageKey,reader.result)}catch(e){}};reader.readAsDataURL(file)});
  if(removePrincipalImage)removePrincipalImage.addEventListener("click",clearPrincipalPhoto);
  try{const savedPrincipalPhoto=localStorage.getItem(principalStorageKey);if(savedPrincipalPhoto)showPrincipalPhoto(savedPrincipalPhoto)}catch(e){}

});
