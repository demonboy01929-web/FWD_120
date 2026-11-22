/* =========================================================
   SAU ADMISSIONS WEBSITE - PHP BACKEND INTEGRATION
   ========================================================= */

// Set this to your local PHP server URL (e.g., XAMPP or PHP built-in server)
const API_BASE_URL = "http://localhost:8000/api.php";
const SESSION_KEY = "sau_signed_in";

function isSignedIn() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch (e) {
    return false;
  }
}

function setSignedIn(value) {
  try {
    if (value) sessionStorage.setItem(SESSION_KEY, "1");
    else sessionStorage.removeItem(SESSION_KEY);
  } catch (e) { /* Storage blocked: ignore */ }
}

function showMessage(form, id, text, type) {
  let box = document.getElementById(id);
  if (!box) {
    box = document.createElement("p");
    box.id = id;
    box.setAttribute("role", "status");
    form.appendChild(box);
  }
  box.className = `form-message ${type || "error"}`;
  box.textContent = text;
  box.hidden = !text;
}

document.addEventListener("DOMContentLoaded", () => {

  // 1. Submit Application to PHP Backend
  const applyForm = document.getElementById("apply-form");
  if (applyForm) {
    const modeSelect = applyForm.querySelector("#mode");
    const levelSelect = applyForm.querySelector("#level");
    const programmeSelect = applyForm.querySelector("#programme");

    applyForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const field = (name) => applyForm.elements[name].value.trim();
      const name = field("name");
      const email = field("email");
      const phone = field("phone");
      const password = applyForm.elements.password.value;
      const confirm = applyForm.elements.confirm.value;

      let error = "";
      if (name.length < 3) error = "Please enter your full name.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) error = "Please enter a valid email address.";
      else if (!modeSelect.value) error = "Please choose an admission mode.";
      else if (!levelSelect.value) error = "Please choose a programme level.";
      else if (!programmeSelect.value) error = "Please choose a programme.";
      else if (password.length < 8) error = "Password must be at least 8 characters.";
      else if (password !== confirm) error = "Passwords do not match.";

      if (error) {
        showMessage(applyForm, "apply-message", error, "error");
        return;
      }

      const payload = {
        name,
        email,
        phone,
        mode: modeSelect.options[modeSelect.selectedIndex].text,
        level: levelSelect.options[levelSelect.selectedIndex].text,
        programme: programmeSelect.value,
        password
      };

      try {
        // Appending endpoint parameter for api.php routing
        const response = await fetch(`${API_BASE_URL}?endpoint=apply.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to submit application.");
        }

        // Save server-returned session data locally
        sessionStorage.setItem("sau_applicant", JSON.stringify({
          ...payload,
          studentId: result.studentId,
          status: "Submitted"
        }));
        setSignedIn(true);

        window.location.href = "profile.html";
      } catch (err) {
        showMessage(applyForm, "apply-message", err.message, "error");
      }
    });
  }

  // 2. Student Portal Login via PHP Backend
  const portalForm = document.querySelector(".portal-login form");
  if (portalForm) {
    portalForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const idField = portalForm.querySelector("#student-id");
      const passField = portalForm.querySelector("#password");
      const identifier = idField.value.trim();
      const password = passField.value;

      try {
        const response = await fetch(`${API_BASE_URL}?endpoint=login.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Invalid credentials.");
        }

        sessionStorage.setItem("sau_applicant", JSON.stringify(result.applicant));
        setSignedIn(true);

        window.location.href = "profile.html";
      } catch (err) {
        showMessage(portalForm, "portal-message", err.message, "error");
        passField.value = "";
        passField.focus();
      }
    });
  }

});

// NOTIFICATION SEARCH
document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("notification-search");
    const noticeItems = document.querySelectorAll(".notice-list li");

    if (searchInput) {
        searchInput.addEventListener("input", function () {

            const searchText = searchInput.value.toLowerCase().trim();

            noticeItems.forEach(function (notice) {
                const notificationText = notice.textContent.toLowerCase();
                notice.hidden = !notificationText.includes(searchText);
            });

        });
    }

});


/* =========================================
   SAU ADMISSIONS HELP BOT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const toggle = document.getElementById("helpbotToggle");
    const chatWindow = document.getElementById("helpbotWindow");
    const close = document.getElementById("helpbotClose");

    const messages = document.getElementById("helpbotMessages");
    const form = document.getElementById("helpbotForm");
    const input = document.getElementById("helpbotInput");

    const quickActions = document.querySelector(".helpbot-quick-actions");

    if (!toggle || !chatWindow || !close || !messages || !form || !input) {
        console.error("SAU Help Bot: HTML elements are missing.");
        return;
    }

    // OPEN BOT
    toggle.addEventListener("click", function () {
        chatWindow.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        input.focus();
    });

    // CLOSE BOT
    close.addEventListener("click", function () {
        chatWindow.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
    });


    // DISPLAY MESSAGE
    function addMessage(text, sender, link = null) {

        const message = document.createElement("div");
        message.className = sender === "user" ? "user-message" : "bot-message";

        const paragraph = document.createElement("p");
        paragraph.textContent = text;

        message.appendChild(paragraph);

        if (link) {
            const anchor = document.createElement("a");
            anchor.href = link.url;
            anchor.textContent = link.label;
            message.appendChild(anchor);
        }

        messages.appendChild(message);

        messages.scrollTop = messages.scrollHeight;
    }


    // BOT ANSWERS
    function getBotResponse(question) {

        const q = question.toLowerCase().trim();

        // GREETINGS
        if (/^(hi|hello|hey|good morning|good evening)\b/.test(q)) {
            return {
                text: "Hello! Welcome to the South Asian University Admissions Help Desk. How can I assist you today?"
            };
        }

        // REGISTRATION
        if (q.includes("register") || q.includes("registration") || q.includes("sign up")) {
            return {
                text: "To begin, visit the student portal and follow the registration instructions. You may need to provide your basic details and create your account.",
                link: {
                    label: "Visit Student Portal",
                    url: "studentportal.html"
                }
            };
        }

        // LOGIN
        if (q.includes("login") || q.includes("log in") || q.includes("status") || q.includes("sign in")) {
            return {
                text: "You can access the student portal to log in. Use the account credentials associated with your registration.",
                link: {
                    label: "Open Student Portal",
                    url: "studentportal.html"
                }
            };
        }

        // APPLICATION
        if (q.includes("apply") || q.includes("application") || q.includes("applying")) {
            return {
                text: "To start your application, open the application page. Follow the instructions and complete the required sections.",
                link: {
                    label: "Start Application",
                    url: "apply.html"
                }
            };
        }

        // DOCUMENTS
        if (q.includes("document") || q.includes("certificate") || q.includes("upload")) {
            return {
                text: "Applicants may need academic mark sheets, certificates, identification documents and other programme-specific documents. Please check the official admission requirements before uploading anything.",
                link: {
                    label: "View Programmes",
                    url: "index.html"
                }
            };
        }

        // ELIGIBILITY
        if (q.includes("eligibility") || q.includes("eligible") || q.includes("qualification")) {
            return {
                text: "Eligibility requirements depend on the programme. Please select your programme to check its specific academic requirements.",
                link: {
                    label: "Explore Programmes",
                    url: "index.html"
                }
            };
        }

        // BACHELOR
        if (q.includes("bachelor") || q.includes("undergraduate") || q.includes("ug")) {
            return {
                text: "You can explore undergraduate programmes and their admission details here.",
                link: {
                    label: "Bachelor Programmes",
                    url: "bachelor.html"
                }
            };
        }

        // MASTER
        if (q.includes("master") || q.includes("postgraduate") || q.includes("pg")) {
            return {
                text: "Explore the available Master's programmes and their admission information here.",
                link: {
                    label: "Master Programmes",
                    url: "master.html"
                }
            };
        }

        // PHD
        if (q.includes("phd") || q.includes("doctorate") || q.includes("doctoral")) {
            return {
                text: "You can find PhD programme information and admission details on this page.",
                link: {
                    label: "PhD Programmes",
                    url: "phd.html"
                }
            };
        }

        // FEES
        if (q.includes("fee") || q.includes("fees") || q.includes("payment")) {
            return {
                text: "Programme fees and payment requirements may vary. Please check the latest official admission notifications for updated information.",
                link: {
                    label: "View Notifications",
                    url: "notifications.html"
                }
            };
        }

        // APPLICATION STATUS
        if (q.includes("status") || q.includes("application progress")) {
            return {
                text: "You can visit the student portal to access your application information. Live application-status checking will be connected when the backend is ready.",
                link: {
                    label: "Student Portal",
                    url: "studentportal.html"
                }
            };
        }

        // NOTIFICATIONS
        if (q.includes("notification") || q.includes("announcement") || q.includes("notice")) {
            return {
                text: "Check the notifications section for admission announcements, important dates and updates.",
                link: {
                    label: "View Notifications",
                    url: "notifications.html"
                }
            };
        }

        // CONTACT
        if (q.includes("contact") || q.includes("help") || q.includes("support")) {
            return {
                text: "For official assistance, please use the contact information provided by South Asian University",
                link: {
                    label: "SAU contact page",
                    url: "contact.html"
                }
            };
        }

        // THANK YOU
        if (q.includes("thank")) {
            return {
                text: "You're welcome! Feel free to ask me anything about the admissions process."
            };
        }

        // DEFAULT RESPONSE
        return {
            text: "I'm not sure I understood that. You can ask me about registration, login, applications, documents, eligibility, programmes, fees or notifications."
        };
    }


    // SEND MESSAGE
    function sendMessage(question) {

        const cleanQuestion = question.trim();

        if (!cleanQuestion) return;

        addMessage(cleanQuestion, "user");

        const response = getBotResponse(cleanQuestion);

        addMessage(response.text, "bot", response.link || null);
    }


    // INPUT FORM
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const question = input.value;

        if (!question.trim()) return;

        sendMessage(question);

        input.value = "";
        input.focus();
    });


    // QUICK ACTION BUTTONS
    if (quickActions) {

        quickActions.addEventListener("click", function (event) {

            const button = event.target.closest("[data-question]");

            if (!button) return;

            sendMessage(button.dataset.question);
        });
    }

});



