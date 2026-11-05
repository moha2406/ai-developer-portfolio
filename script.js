
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle?.querySelector(".theme-icon");
  const themeLabel = themeToggle?.querySelector(".theme-label");
  const typingElement = document.getElementById("typing");
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const backToTop = document.getElementById("back-to-top");
  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  if (window.emailjs) {
    emailjs.init({
      publicKey: "qKQAN--bQcH4uI9i0"
    });
  }

  const systemTheme = window.matchMedia("(prefers-color-scheme: light)");

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("portfolio-theme");
  } catch (_) {}

  const applyTheme = (theme) => {
    const isLight = theme === "light";

    body.classList.toggle("light-mode", isLight);

    if (themeIcon) {
      themeIcon.textContent = isLight ? "☾" : "☀";
    }

    if (themeLabel) {
      themeLabel.textContent = isLight ? "Dark mode" : "Light mode";
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark mode" : "Switch to light mode"
      );
    }

    const themeColor = document.querySelector('meta[name="theme-color"]');

    if (themeColor) {
      themeColor.setAttribute("content", isLight ? "#f5f8ff" : "#0b1120");
    }
  };

  const getCurrentTheme = () => {
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return systemTheme.matches ? "light" : "dark";
  };

  applyTheme(getCurrentTheme());

  themeToggle?.addEventListener("click", () => {
    const nextTheme = body.classList.contains("light-mode") ? "dark" : "light";

    savedTheme = nextTheme;
    applyTheme(nextTheme);

    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch (_) {}
  });

  systemTheme.addEventListener("change", (event) => {
    if (savedTheme !== "light" && savedTheme !== "dark") {
      applyTheme(event.matches ? "light" : "dark");
    }
  });

  const closeMenu = () => {
    navLinks?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation menu");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.toggle("open") ?? false;

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!navLinks || !menuToggle) return;

    const target = event.target;

    if (
      target instanceof Node &&
      !navLinks.contains(target) &&
      !menuToggle.contains(target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 780) {
      closeMenu();
    }
  });

  if (typingElement) {
    const phrases = [
      "Artificial Intelligence",
      "Python Development",
      "Web Development",
      "Machine Learning"
    ];

    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let deleting = true;

    const type = () => {
      const phrase = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        typingElement.textContent = phrase.slice(0, charIndex);

        if (charIndex >= phrase.length) {
          deleting = true;
          window.setTimeout(type, 1500);
          return;
        }

        window.setTimeout(type, 75);
      } else {
        charIndex--;
        typingElement.textContent = phrase.slice(0, Math.max(charIndex, 0));

        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          window.setTimeout(type, 350);
          return;
        }

        window.setTimeout(type, 35);
      }
    };

    window.setTimeout(type, 1500);
  }

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => {
      item.classList.add("active");
    });
  }

  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks?.querySelectorAll("a").forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  const updateBackToTop = () => {
    backToTop?.classList.toggle("visible", window.scrollY > 500);
  };

  window.addEventListener("scroll", updateBackToTop, { passive: true });

  updateBackToTop();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  const setStatus = (text, type) => {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.className = type || "";
  };

  contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);

    if (formData.get("website")) {
      return;
    }

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("message_subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !subject || !message) {
      setStatus("Please complete all fields before sending.", "error");
      return;
    }

    if (!window.emailjs) {
      setStatus("Email service unavailable. Please email me directly.", "error");
      return;
    }

    const submitButton = contactForm.querySelector('[type="submit"]');

    setStatus("Sending your message...", "");

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      await emailjs.send("service_s8kzijk", "template_5qotgpx", {
        name: name,
        email: email,
        message: `Subject: ${subject}\n\n${message}`
      });

      setStatus("Your message has been sent successfully!", "success");
      contactForm.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus("Failed to send your message. Please try again.", "error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
});
