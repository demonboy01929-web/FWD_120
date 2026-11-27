/* =========================================================
   SAU ADMIN PORTAL - FRONTEND DEMONSTRATION
   Data is stored in this browser's localStorage only.
   Do not use this demo to store real student information.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const STORAGE = {
    notices: "sauAdminNoticesDemo",
    students: "sauAdminStudentsDemo",
    programmes: "sauAdminProgrammesDemo",
    activity: "sauAdminActivityDemo"
  };

  const read = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const safe = (value = "") => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

  let notices = read(STORAGE.notices, [
    { id: "n1", title: "Admissions 2026–27: Important update", category: "Admissions", date: "2026-08-20", description: "Please check the latest admissions information.", link: "", published: true },
    { id: "n2", title: "Hostel registration information", category: "Hostel", date: "2026-08-12", description: "Hostel registration notice for students.", link: "", published: true }
  ]);
  let students = read(STORAGE.students, []);
  let programmes = read(STORAGE.programmes, [
    { id: "bachelor", name: "Bachelor's programmes", detail: "Undergraduate programme listings and application access.", enabled: true, shortcut: true, url: "../bachelor.html", image: "../photos/admin-bachelor.jpg" },
    { id: "master", name: "Master's programmes", detail: "Postgraduate programme listings and application access.", enabled: true, shortcut: true, url: "../master.html", image: "../photos/admin-master.jpg" },
    { id: "phd", name: "PhD programmes", detail: "Doctoral programme listings and application access.", enabled: true, shortcut: true, url: "../phd.html", image: "../photos/admin-phd.jpg" }
  ]);
  let activity = read(STORAGE.activity, []);

  const dateLabel = (date) => date ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const logActivity = (event, details) => {
    activity.unshift({ event, details, time: new Date().toLocaleString("en-IN") });
    activity = activity.slice(0, 12);
    save(STORAGE.activity, activity);
    renderActivity();
  };

  function updateStats() {
    $("#totalStudents").textContent = students.length;
    $("#activeStudents").textContent = "—";
    $("#totalNotifications").textContent = notices.length;
    $("#openProgrammes").textContent = programmes.filter(item => item.enabled).length;
    $("#loginCount").textContent = activity.filter(item => item.event.toLowerCase().includes("login")).length;
    $("#activeCountLarge").textContent = "Not available";
  }

  function renderNotices() {
    const query = ($("#noticeSearch").value || "").toLowerCase();
    const filtered = notices.filter(n => `${n.title} ${n.category}`.toLowerCase().includes(query));
    $("#noticeTableBody").innerHTML = filtered.map(n => `
      <tr>
        <td><span class="table-title">${safe(n.title)}</span><span class="table-subtitle">${safe(n.description || "")}</span></td>
        <td>${safe(n.category)}</td>
        <td>${dateLabel(n.date)}</td>
        <td><span class="status-pill ${n.published ? "published" : "draft"}">${n.published ? "Published" : "Draft"}</span></td>
        <td><div class="row-actions">
          <button type="button" data-edit-notice="${safe(n.id)}">Edit</button>
          <button type="button" data-toggle-notice="${safe(n.id)}">${n.published ? "Unpublish" : "Publish"}</button>
          <button type="button" class="delete-button" data-delete-notice="${safe(n.id)}">Delete</button>
        </div></td>
      </tr>`).join("");
    $("#noticeEmpty").hidden = filtered.length > 0;
    updateStats();
  }

  function openNoticeForm(notice = null) {
    $("#noticeForm").hidden = false;
    $("#noticeFormTitle").textContent = notice ? "Edit notification" : "Add notification";
    $("#noticeId").value = notice?.id || "";
    $("#noticeTitle").value = notice?.title || "";
    $("#noticeCategory").value = notice?.category || "Admissions";
    $("#noticeDate").value = notice?.date || new Date().toISOString().slice(0, 10);
    $("#noticeDescription").value = notice?.description || "";
    $("#noticeLink").value = notice?.link || "";
    $("#noticePublished").checked = notice ? notice.published : true;
    $("#noticeMessage").hidden = true;
    $("#noticeForm").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  $("#newNoticeButton").addEventListener("click", () => openNoticeForm());
  $("#cancelNotice").addEventListener("click", () => $("#noticeForm").hidden = true);
  $("#noticeSearch").addEventListener("input", renderNotices);

  $("#noticeForm").addEventListener("submit", event => {
    event.preventDefault();
    const id = $("#noticeId").value || `n${Date.now()}`;
    const record = {
      id,
      title: $("#noticeTitle").value.trim(),
      category: $("#noticeCategory").value,
      date: $("#noticeDate").value,
      description: $("#noticeDescription").value.trim(),
      link: $("#noticeLink").value.trim(),
      published: $("#noticePublished").checked
    };
    if (!record.title || !record.date) return;
    const index = notices.findIndex(item => item.id === id);
    if (index >= 0) notices[index] = record;
    else notices.unshift(record);
    save(STORAGE.notices, notices);
    $("#noticeForm").hidden = true;
    renderNotices();
    logActivity(index >= 0 ? "Notification updated" : "Notification created", record.title);
  });

  $("#noticeTableBody").addEventListener("click", event => {
    const edit = event.target.closest("[data-edit-notice]");
    const toggle = event.target.closest("[data-toggle-notice]");
    const remove = event.target.closest("[data-delete-notice]");
    if (edit) openNoticeForm(notices.find(n => n.id === edit.dataset.editNotice));
    if (toggle) {
      const item = notices.find(n => n.id === toggle.dataset.toggleNotice);
      if (item) { item.published = !item.published; save(STORAGE.notices, notices); renderNotices(); logActivity(item.published ? "Notification published" : "Notification unpublished", item.title); }
    }
    if (remove) {
      const item = notices.find(n => n.id === remove.dataset.deleteNotice);
      if (item && confirm(`Delete "${item.title}"?`)) {
        notices = notices.filter(n => n.id !== item.id);
        save(STORAGE.notices, notices); renderNotices(); logActivity("Notification deleted", item.title);
      }
    }
  });

  function renderProgrammes() {
    $("#programmeControls").innerHTML = programmes.map(p => `
      <div class="programme-control">
        <div><b>${safe(p.name)}</b><small>${safe(p.detail)}</small></div>
        <label class="switch" aria-label="Toggle ${safe(p.name)}">
          <input type="checkbox" data-programme-toggle="${safe(p.id)}" ${p.enabled ? "checked" : ""}>
          <span></span>
        </label>
      </div>`).join("");
    $("#shortcutGrid").innerHTML = programmes.filter(p => p.shortcut).map(p => `
      <article class="shortcut-card">
        <img src="${safe(p.image)}" alt="Replace with a programme photograph">
        <div><b>${safe(p.name)}</b><span>${p.enabled ? "Visible and enabled" : "Currently disabled"}</span><br>
        <a href="${safe(p.url)}">Preview programme page →</a></div>
      </article>`).join("");
    updateStats();
  }

  $("#programmeControls").addEventListener("change", event => {
    const input = event.target.closest("[data-programme-toggle]");
    if (!input) return;
    const item = programmes.find(p => p.id === input.dataset.programmeToggle);
    if (!item) return;
    item.enabled = input.checked;
    save(STORAGE.programmes, programmes);
    renderProgrammes();
    logActivity(item.enabled ? "Programme enabled" : "Programme disabled", item.name);
  });

  function renderStudents() {
    const query = ($("#studentSearch").value || "").toLowerCase();
    const filtered = students.filter(s => `${s.name} ${s.number} ${s.email} ${s.programme}`.toLowerCase().includes(query));
    $("#studentTableBody").innerHTML = filtered.map(s => `
      <tr>
        <td><span class="table-title">${safe(s.name)}</span><span class="table-subtitle">${safe(s.email)}</span></td>
        <td>${safe(s.number)}</td><td>${safe(s.programme)}</td>
        <td><span class="status-pill ${s.status === "Admitted" ? "admitted" : ""}">${safe(s.status)}</span></td>
        <td><div class="row-actions"><button type="button" data-edit-student="${safe(s.id)}">Edit</button><button type="button" class="delete-button" data-delete-student="${safe(s.id)}">Delete</button></div></td>
      </tr>`).join("");
    $("#studentEmpty").hidden = filtered.length > 0;
    updateStats();
  }

  function openStudentForm(student = null) {
    $("#studentForm").hidden = false;
    $("#studentFormTitle").textContent = student ? "Edit student" : "Add student";
    $("#studentId").value = student?.id || "";
    $("#studentName").value = student?.name || "";
    $("#studentNumber").value = student?.number || "";
    $("#studentEmail").value = student?.email || "";
    $("#studentProgramme").value = student?.programme || "Bachelor's";
    $("#studentStatus").value = student?.status || "Application received";
    $("#studentForm").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  $("#newStudentButton").addEventListener("click", () => openStudentForm());
  $("#cancelStudent").addEventListener("click", () => $("#studentForm").hidden = true);
  $("#studentSearch").addEventListener("input", renderStudents);
  $("#studentForm").addEventListener("submit", event => {
    event.preventDefault();
    const id = $("#studentId").value || `s${Date.now()}`;
    const record = {
      id, name: $("#studentName").value.trim(), number: $("#studentNumber").value.trim(),
      email: $("#studentEmail").value.trim(), programme: $("#studentProgramme").value,
      status: $("#studentStatus").value
    };
    const index = students.findIndex(s => s.id === id);
    if (index >= 0) students[index] = record;
    else students.unshift(record);
    save(STORAGE.students, students);
    $("#studentForm").hidden = true;
    renderStudents();
    logActivity(index >= 0 ? "Student record updated" : "Student record added", record.name);
  });

  $("#studentTableBody").addEventListener("click", event => {
    const edit = event.target.closest("[data-edit-student]");
    const remove = event.target.closest("[data-delete-student]");
    if (edit) openStudentForm(students.find(s => s.id === edit.dataset.editStudent));
    if (remove) {
      const item = students.find(s => s.id === remove.dataset.deleteStudent);
      if (item && confirm(`Delete the sample record for ${item.name}?`)) {
        students = students.filter(s => s.id !== item.id);
        save(STORAGE.students, students); renderStudents(); logActivity("Student record deleted", item.name);
      }
    }
  });

  function renderActivity() {
    $("#activityTableBody").innerHTML = activity.length ? activity.map(item => `
      <tr><td><span class="table-title">${safe(item.event)}</span></td><td>${safe(item.details)}</td><td>${safe(item.time)}</td></tr>
    `).join("") : `<tr><td colspan="3">No activity recorded yet.</td></tr>`;
    updateStats();
  }

  // Sidebar navigation and quick-action links
  function goToSection(id) {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    $$(".sidebar-link").forEach(link => link.classList.toggle("active", link.dataset.section === id));
    $("#adminSidebar").classList.remove("open");
  }
  $$(".sidebar-link").forEach(link => link.addEventListener("click", event => {
    event.preventDefault(); goToSection(link.dataset.section);
  }));
  $$("[data-go]").forEach(button => button.addEventListener("click", () => goToSection(button.dataset.go)));
  $("#sidebarToggle").addEventListener("click", () => $("#adminSidebar").classList.toggle("open"));

  $("#adminProfileButton").addEventListener("click", () => {
    $("#adminProfileMenu").hidden = !$("#adminProfileMenu").hidden;
  });
  $("#adminLogout").addEventListener("click", () => {
    alert("Demo logout button. Connect this to your server-side admin session when the backend is added.");
    $("#adminProfileMenu").hidden = true;
  });

  // Initial render
  renderNotices();
  renderProgrammes();
  renderStudents();
  renderActivity();
});

// ==================================
// SAU ADMIN AUTHENTICATION
// ==================================

const SAU_SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SAU_SUPABASE_KEY = "YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY";

const sauDB = window.supabase.createClient(
    SAU_SUPABASE_URL,
    SAU_SUPABASE_KEY
);


// ==================================
// LOGIN PAGE
// ==================================

const loginForm = document.getElementById("adminLoginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("adminEmail").value.trim();
        const password = document.getElementById("adminPassword").value;
        const message = document.getElementById("loginMessage");

        message.textContent = "Verifying credentials...";

        const { data, error } = await sauDB.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            message.textContent = "Invalid email or password.";
            return;
        }

        const { data: access, error: accessError } = await sauDB
            .from("admin_access")
            .select("role")
            .eq("user_id", data.user.id)
            .eq("role", "owner")
            .maybeSingle();

        if (accessError || !access) {
            await sauDB.auth.signOut();
            message.textContent = "You are not authorised to access the admin portal.";
            return;
        }

        window.location.href = "admin.html";
    });
}


// ==================================
// ADMIN DASHBOARD SECURITY
// ==================================

const adminDashboard = document.querySelector(".admin-layout");

if (adminDashboard) {
    adminDashboard.style.display = "none";

    (async function checkAdminAccess() {
        const { data: sessionData } = await sauDB.auth.getSession();
        const user = sessionData.session?.user;

        if (!user) {
            window.location.replace("admin-login.html");
            return;
        }

        const { data: access, error } = await sauDB
            .from("admin_access")
            .select("role")
            .eq("user_id", user.id)
            .eq("role", "owner")
            .maybeSingle();

        if (error || !access) {
            await sauDB.auth.signOut();
            window.location.replace("admin-login.html");
            return;
        }

        adminDashboard.style.display = "";
    })();
}


// ==================================
// ADMIN LOGOUT
// ==================================

const logoutButton = document.getElementById("adminLogout");

if (logoutButton) {
    logoutButton.addEventListener("click", async function () {
        await sauDB.auth.signOut();
        window.location.replace("admin-login.html");
    });
}