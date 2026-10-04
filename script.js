/**
 * R.K. High School, Obra - Official Website Scripts
 * Features:
 * 1. Monet Palette Engine
 * 2. Mobile Responsive Navigation & Clean Touch Handler
 * 3. Smooth Ripple Effect for Buttons & Navigation
 * 4. Animated Statistics Counters
 * 5. Gallery Lightbox Viewer
 * 6. Scroll to Top Button
 * 7. Dynamic Current Year
 * 8. Interactive Star Rating Widget
 * 9. Real-time Firebase Firestore Reviews Feed
 * 10. Firebase Firestore Admission & Enquiry Form Submission
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

  // 2. Ripple Effect Logic
  const createRipple = (e) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const circle = document.createElement("span");
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${(e.clientX || (e.touches && e.touches[0].clientX) || rect.left + radius) - rect.left - radius}px`;
    circle.style.top = `${(e.clientY || (e.touches && e.touches[0].clientY) || rect.top + radius) - rect.top - radius}px`;
    circle.classList.add("ripple-wave");

    const existingRipple = target.querySelector(".ripple-wave");
    if (existingRipple) {
      existingRipple.remove();
    }

    target.appendChild(circle);
    setTimeout(() => {
      circle.remove();
    }, 600);
  };

  document.querySelectorAll(".ripple-element, .btn").forEach(el => {
    el.addEventListener("pointerdown", createRipple);
  });

  // 3. Responsive Mobile Navigation Menu & Touch-Safe Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#nav");
  const navLinks = document.querySelectorAll(".nav a.nav-item");

  if (menuToggle && nav) {
    menuToggle.addEventListener("pointerdown", (e) => {
      // Prevents blue touch highlight
      e.stopPropagation();
    });

    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen);
      menuToggle.innerHTML = isOpen ? "&#x2715;" : "&#9776;";
    });

    // Active link selection logic
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navLinks.forEach(item => item.classList.remove("active"));
        link.classList.add("active");

        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = "&#9776;";
      });
    });

    document.querySelectorAll(".nav .nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
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

  // 4. Smooth Animated Statistics Counters
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

  // 5. Photo Gallery Lightbox Viewer
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

  // 6. Scroll to Top Button
  const toTop = document.querySelector("#toTop");
  if (toTop) {
    window.addEventListener("scroll", () => {
      toTop.classList.toggle("show", window.scrollY > 380);
    });

    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 7. Dynamic Current Year in Footer
  const yearEl = document.querySelector("#year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 8. Interactive Star Rating Widget
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
      star.addEventListener("pointerdown", (e) => {
        e.preventDefault();
      });

      star.addEventListener("click", (e) => {
        e.preventDefault();
        const selected = Number(star.dataset.val);
        ratingInput.value = selected;
        updateStars(selected);
      });
    });
  }

  // =========================================================================
  // 9 & 10. FIREBASE FIRESTORE REVIEWS & ENQUIRY INTEGRATION
  // =========================================================================
  const initFirebaseFeatures = () => {
    if (!window.db || !window.firestoreTools) {
      setTimeout(initFirebaseFeatures, 150);
      return;
    }

    const { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } = window.firestoreTools;
    const db = window.db;

    // --- 9. REAL-TIME REVIEWS & DYNAMIC RATING ---
    const commentForm = document.querySelector("#commentRatingForm");
    const reviewsStream = document.querySelector("#reviewsStream");
    const overallBadge = document.querySelector(".overall-badge");
    const reviewsRef = collection(db, "school_reviews");

    if (commentForm) {
      commentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = commentForm.querySelector("button[type='submit']");
        const originalText = submitBtn.textContent;

        const name = document.querySelector("#reviewerName").value.trim();
        const comment = document.querySelector("#reviewComment").value.trim();
        const ratingVal = ratingInput ? Number(ratingInput.value) : 0;

        if (!name || !comment) return;

        if (!ratingVal || ratingVal < 1) {
          alert("कृपया समीक्षा भेजने से पहले स्टार रेटिंग चुनें।");
          return;
        }

        try {
          submitBtn.disabled = true;
          submitBtn.textContent = "प्रकाशित हो रहा है...";

          await addDoc(reviewsRef, {
            name: name,
            comment: comment,
            rating: ratingVal,
            createdAt: serverTimestamp()
          });

          commentForm.reset();
          if (ratingInput) ratingInput.value = "";
          if (starWidget) {
            starWidget.querySelectorAll(".star").forEach(s => s.classList.remove("active"));
          }
        } catch (err) {
          console.error("Firebase Review Error:", err);
          alert("समीक्षा दर्ज करने में समस्या आई। कृपया अपना इंटरनेट कनेक्शन जाँचें।");
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      });
    }

    // Real-Time Snapshot Listener for Reviews
    const q = query(reviewsRef, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      if (snapshot.empty) return;

      reviewsStream.innerHTML = "";
      let totalRating = 0;
      let count = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const rVal = Number(data.rating || 5);
        totalRating += rVal;
        count++;

        const starString = "★".repeat(rVal) + "☆".repeat(5 - rVal);
        const reviewBox = document.createElement("div");
        reviewBox.className = "review-box";
        reviewBox.innerHTML = `
          <div class="review-meta">
            <strong>${data.name}</strong>
            <div class="stars-display">${starString}</div>
          </div>
          <p>${data.comment}</p>
          <time>सत्यापित प्रतिक्रिया</time>
        `;
        reviewsStream.appendChild(reviewBox);
      });

      if (count > 0 && overallBadge) {
        const avg = (totalRating / count).toFixed(1);
        overallBadge.textContent = `⭐ ${avg} / 5.0 (${count} कुल समीक्षाएँ)`;
      }
    }, (error) => {
      console.warn("Reviews stream note:", error);
    });

    // --- 10. STUDENT ADMISSION & ENQUIRY FORM SUBMISSION (FIRESTORE) ---
    const enquiryForm = document.querySelector("#studentEnquiryForm");
    const successBanner = document.querySelector("#enquirySuccessMsg");
    const refIdEl = document.querySelector("#refId");
    const enquiriesRef = collection(db, "student_enquiries");

    if (enquiryForm) {
      enquiryForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        let isValid = true;

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
          const submitBtn = enquiryForm.querySelector("button[type='submit']");
          const originalBtnText = submitBtn.textContent;
          submitBtn.disabled = true;
          submitBtn.textContent = "Submitting / जमा हो रहा है...";

          const randomRef = "#RKHS-" + Math.floor(1000 + Math.random() * 9000);

          try {
            await addDoc(enquiriesRef, {
              refId: randomRef,
              studentName: enquiryForm.querySelector("#studentName").value.trim(),
              parentName: enquiryForm.querySelector("#parentName").value.trim(),
              studentPhone: enquiryForm.querySelector("#studentPhone").value.trim(),
              studentEmail: enquiryForm.querySelector("#studentEmail").value.trim() || "N/A",
              enquiryClass: enquiryForm.querySelector("#enquiryClass").value,
              vocationalInterest: enquiryForm.querySelector("#vocationalInterest").value,
              address: enquiryForm.querySelector("#address").value.trim(),
              enquiryMessage: enquiryForm.querySelector("#enquiryMessage").value.trim() || "N/A",
              status: "Pending",
              submittedAt: serverTimestamp()
            });

            if (refIdEl) refIdEl.textContent = randomRef;
            if (successBanner) {
              successBanner.style.display = "block";
              successBanner.scrollIntoView({ behavior: "smooth", block: "center" });
            }

            enquiryForm.reset();
          } catch (err) {
            console.error("Enquiry Submission Error:", err);
            alert("Submission error. Please try again. / आवेदन जमा करने में त्रुटि आई, कृपया पुनः प्रयास करें।");
          } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        }
      });

      enquiryForm.querySelectorAll("input, select").forEach(input => {
        input.addEventListener("input", () => {
          const group = input.closest(".form-group");
          if (group) group.classList.remove("has-error");
        });
      });
    }
  };

  initFirebaseFeatures();
});
