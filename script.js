/**
 * R.K. High School, Obra - Official Website Scripts
 * Features:
 * 1. Monet Palette Engine
 * 2. Responsive Mobile Navigation Menu
 * 3. Animated Statistics Counters
 * 4. Lightbox Viewer
 * 5. Scroll to Top
 * 6. Dynamic Year
 * 7. Interactive Star Rating Widget
 * 8. Real-time Reviews/Comments Feed
 * 9. Form Validation & Submission for Admission & Enquiry
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

      if (computed && computed !== "rgb(0, 0, 0)" && !computed.includes("rgba(0, 0, 0")) {
        document.documentElement.style.setProperty("--monet-primary", computed);
        document.documentElement.style.setProperty("--pill-text", computed);
      }
    } catch (err) {
      console.warn("Fallback to default school palette.");
    }
  };

  applyMonetColors();

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

    document.querySelectorAll(".nav a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = "&#9776;";
      });
    });

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

  // 6. Dynamic Current Year in Footer
  const yearEl = document.querySelector("#year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 7. Interactive Star Rating Handler
  const starWidget = document.querySelector("#starWidget");
  const ratingInput = document.querySelector("#selectedRating");

  if (starWidget && ratingInput) {
    const stars = starWidget.querySelectorAll(".star");

    const updateStars = (rating) => {
      stars.forEach(star => {
        const val = Number(star.dataset.val);
        star.classList.toggle("active", val <= rating);
      });
    };

    stars.forEach(star => {
      star.addEventListener("click", () => {
        const selected = Number(star.dataset.val);
        ratingInput.value = selected;
        updateStars(selected);
      });
    });
  }

  // 8. Student Comments & Review Form Submit
  const commentForm = document.querySelector("#commentRatingForm");
  const reviewsStream = document.querySelector("#reviewsStream");

  if (commentForm && reviewsStream) {
    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.querySelector("#reviewerName").value.trim();
      const comment = document.querySelector("#reviewComment").value.trim();
      const rating = Number(document.querySelector("#selectedRating").value || 5);

      if (!name || !comment) return;

      const starString = "★".repeat(rating) + "☆".repeat(5 - rating);

      const newReview = document.createElement("div");
      newReview.className = "review-box";
      newReview.innerHTML = `
        <div class="review-meta">
          <strong>${name}</strong>
          <div class="stars-display">${starString}</div>
        </div>
        <p>${comment}</p>
        <time>Just now</time>
      `;

      reviewsStream.prepend(newReview);
      commentForm.reset();
      
      // Reset stars to default 5
      if (ratingInput) ratingInput.value = "5";
      const stars = starWidget.querySelectorAll(".star");
      stars.forEach(s => s.classList.add("active"));
    });
  }

  // 9. Student Admission & Enquiry Form Submission
  const enquiryForm = document.querySelector("#studentEnquiryForm");
  const successBanner = document.querySelector("#enquirySuccessMsg");
  const refIdEl = document.querySelector("#refId");

  if (enquiryForm) {
    enquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      // Required fields validation
      const requiredInputs = enquiryForm.querySelectorAll("input[required], select[required]");
      requiredInputs.forEach(input => {
        const group = input.closest(".form-group");
        if (!input.value.trim()) {
          isValid = false;
          if (group) group.classList.add("has-error");
        } else {
          if (group) group.classList.remove("has-error");
        }
      });

      // Phone validation (10 digits)
      const phoneInput = enquiryForm.querySelector("#studentPhone");
      if (phoneInput && phoneInput.value.trim()) {
        const phoneRegex = /^[0-9]{10}$/;
        const group = phoneInput.closest(".form-group");
        if (!phoneRegex.test(phoneInput.value.trim())) {
          isValid = false;
          if (group) group.classList.add("has-error");
        } else {
          if (group) group.classList.remove("has-error");
        }
      }

      if (isValid) {
        // Reference ID generation
        const randomRef = "#RKHS-" + Math.floor(1000 + Math.random() * 9000);
        if (refIdEl) refIdEl.textContent = randomRef;

        if (successBanner) {
          successBanner.style.display = "block";
          successBanner.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        enquiryForm.reset();
      }
    });

    // Clear error highlights on user input
    enquiryForm.querySelectorAll("input, select").forEach(input => {
      input.addEventListener("input", () => {
        const group = input.closest(".form-group");
        if (group) group.classList.remove("has-error");
      });
    });
  }
});
