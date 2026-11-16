// Mobile navigation, scroll reveal, active links and contact email helper.
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();

  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  menuToggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    if (window.lucide) window.lucide.createIcons();
  });

  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => sectionObserver.observe(section));

  document.getElementById("year").textContent = new Date().getFullYear();

  const form = document.getElementById("contactForm");
  form?.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get("name");
    const email = data.get("email");
    const subject = data.get("subject") || "Portfolio enquiry";
    const message = data.get("message");
    const body = `Hi, I'm ${name} (${email}).%0D%0A%0D%0A${encodeURIComponent(message)}`;
    // Replace this address with your own email address.
    window.location.href = `mailto:hello@example.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    // document.getElementById("formNote").textContent = "Your email app should open with the message ready to send.";
  });
});


// -------------- sending messages -----------

const contactForm = document.getElementById("contactForm");

const submitBtn = document.getElementById("submitBtn");

const formStatus = document.getElementById("formStatus");

const API_URL = "http://127.0.0.1:8000/api/contact/";


contactForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    formStatus.textContent = "";

    const formData = new FormData(contactForm);

    const data = Object.fromEntries(formData.entries());

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (!response.ok) {

            const errors = result.errors
                ? Object.entries(result.errors)
                    .map(([field, messages]) =>
                        `${field}: ${messages.join(", ")}`
                    )
                    .join("\n")
                : result.message || "Something went wrong.";

            throw new Error(errors);

        }

        formStatus.textContent = result.message;

        formStatus.style.color = "green";

        contactForm.reset();

    }

    catch (error) {

        formStatus.textContent = error.message;

        formStatus.style.color = "red";

    }

    finally {

        submitBtn.disabled = false;

        submitBtn.textContent = "Send Message";

    }

});