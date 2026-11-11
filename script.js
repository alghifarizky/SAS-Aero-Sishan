// File ini dipakai oleh index.html DAN works.html.
// Karena tidak semua elemen ada di kedua halaman, setiap fitur
// dicek dulu: "kalau elemennya ada, baru jalankan".

// ===== NAVBAR: menu mobile =====
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

navToggle.addEventListener("click", function () {
  navMenu.classList.toggle("open");
  navToggle.classList.toggle("open");
  header.classList.toggle("menu-open");
});

// tutup menu saat link diklik
document.querySelectorAll(".nav-menu a").forEach(function (link) {
  link.addEventListener("click", function () {
    navMenu.classList.remove("open");
    navToggle.classList.remove("open");
    header.classList.remove("menu-open");
  });
});

// ===== NAVBAR: latar gelap saat di-scroll + efek parallax hero =====
const heroBg = document.querySelector(".hero-bg");

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 40);

  if (heroBg && y < window.innerHeight) {
    heroBg.style.transform = "scale(1.1) translateY(" + y * 0.3 + "px)";
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ===== NAVBAR: tandai link sesuai section yang sedang terlihat =====
// hanya untuk link yang menuju section di halaman yang sama (href="#...")
const samePageLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
const sections = document.querySelectorAll("section[id]");

if (samePageLinks.length > 0) {
  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = "#" + entry.target.id;
          samePageLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === id);
          });
        }
      });
    },
    { rootMargin: "-50% 0px -50% 0px" }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });
}

// ===== HERO: animasi huruf satu per satu =====
const heroTitle = document.querySelector(".hero-title");

if (heroTitle) {
  let charIndex = 0;

  // salin dulu daftar node-nya, karena kita mengganti node saat looping
  Array.from(heroTitle.childNodes).forEach(function (node) {
    if (node.nodeType !== Node.TEXT_NODE) return;

    const fragment = document.createDocumentFragment();
    node.textContent.split("").forEach(function (letter) {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = letter === " " ? "\u00A0" : letter;
      span.style.animationDelay = charIndex * 0.05 + "s";
      charIndex++;
      fragment.appendChild(span);
    });
    node.replaceWith(fragment);
  });
}

// ===== ANIMASI MUNCUL SAAT SCROLL =====
const revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach(function (el, i) {
  // jeda kecil supaya elemen yang berdampingan muncul bergantian
  el.style.transitionDelay = (i % 3) * 0.1 + "s";
  revealObserver.observe(el);
});

// ===== COUNTER ANGKA (halaman home) =====
function runCounter(el) {
  const target = Number(el.getAttribute("data-target"));
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // pelan di akhir
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      runCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
});

document.querySelectorAll(".counter").forEach(function (counter) {
  counterObserver.observe(counter);
});

// ===== MARQUEE: duplikat logo supaya berjalan tanpa putus (halaman home) =====
const track = document.querySelector(".marquee-track");

if (track) {
  track.innerHTML += track.innerHTML;
}

// ===== LOAD MORE (halaman Business Units) =====
const workCards = document.querySelectorAll(".work-card");
const loadMoreBtn = document.querySelector(".btn-load-more:not(a)");
const CARDS_PER_LOAD = 4; // jumlah kartu yang tampil tiap kali

if (workCards.length > 0 && loadMoreBtn) {
  let visibleCount = CARDS_PER_LOAD;

  function updateCards() {
    workCards.forEach(function (card, i) {
      card.classList.toggle("is-hidden", i >= visibleCount);
    });

    // sembunyikan tombol kalau semua kartu sudah tampil
    loadMoreBtn.style.display = visibleCount >= workCards.length ? "none" : "";
  }

  loadMoreBtn.addEventListener("click", function () {
    visibleCount += CARDS_PER_LOAD;
    updateCards();
  });

  updateCards();
}

// ===== HALAMAN DETAIL PROJECT (project.html) =====
// Semua data project disimpan di sini. Untuk menambah project baru:
// 1) tambahkan satu objek di bawah, 2) buat kartu dengan link project.html?id=...
const projects = {
  "mlrs": {
    title: "Rocket Launcher Vehicle (MLRS)",
    image: "img/unit-mlrs.png",
    paragraphs: [
      "SAS was involved in the development of RHan-122B rocket launcher vehicle under PT. Dahana (state-owned company). RHan 122B is Indonesian 122mm ballistic rocket.",
      "SAS scope was the vehicle automation and fire control system."
    ]
  },
  "tank-turret": {
    title: "ApexTank Turret System Development T.III",
    image: "img/unit-turret.png",
    paragraphs: [
      "SAS is helping Indonesian Army Cavalry unit developing turret system for 105 mm cannon. This multi-years development includes the mechanical, electrical, and control systems part/subsystem of the turret."
    ]
  },
  "fixed-wing-uav": {
    title: "Fixed-Wing UAV",
    image: "img/unit-fixedwing.png",
    paragraphs: [
      "This fixed wing UAV platform is suitable for persistent surveillance mission such as maritime / border patrol. Weaponization is possible."
    ],
    specs: [
      ["Platform", "Pipistrel Sinus"],
      ["MTOW", "850 kg"],
      ["Payload", "up to 280 kg"],
      ["Endurance", "up to 24 hours"],
      ["Wingspan", "15 m"]
    ]
  },
  "helicopter-uav": {
    title: "Helicopter UAV",
    image: "img/unit-heli.png",
    paragraphs: [
      "This helicopter UAV platform is suitable for surveillance, search, and rescue operation. Can be used for payload delivery / autonomous transporting. Weaponization is possible."
    ],
    specs: [
      ["Platform", "CH-7 Ultralight"],
      ["MTOW", "500 kg"],
      ["Payload", "up to 150 kg"],
      ["Endurance", "up to 8 hours"]
    ]
  },
  "male-uav-fcs": {
    title: "MALE-Class UAV Flight Control System",
    image: "img/unit-male.png",
    paragraphs: [
      "SAS is deeply involved in flight control system development for Indonesian MALE-Class Combat UAV under coordination of PT. LEN Industri (state-owned company).",
      "In this 4-years program, we follow aerospace standard methodology for developing highly complex integrated system."
    ]
  },
  "mobile-gcs": {
    title: "Mobile Ground Control System (GCS)",
    image: "img/unit-gcs.png",
    paragraphs: [
      "SAS and PT. LEN Industri (State-owned Company) has successfully developed the Mobile Ground Control System (GCS) for Medium Altitude Long Endurance (MALE) Drones."
    ]
  }
};

const projectHero = document.querySelector(".project-hero");

if (projectHero) {
  // ambil nilai ?id=... dari URL, contoh: project.html?id=fixed-wing-uav
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id") || "mlrs";
  const project = projects[projectId];

  const titleEl = projectHero.querySelector(".project-title");
  const descEl = projectHero.querySelector(".project-desc");
  const bgEl = projectHero.querySelector(".project-bg");

  if (project) {
    titleEl.textContent = project.title;
    bgEl.style.backgroundImage = "url('" + project.image + "')";
    document.title = project.title + " | SAS Aero Sishan";

    // kosongkan deskripsi lama, lalu isi dengan paragraf baru
    descEl.innerHTML = "";

    project.paragraphs.forEach(function (text) {
      const p = document.createElement("p");
      p.textContent = text;
      descEl.appendChild(p);
    });

    // tampilkan daftar spesifikasi kalau project punya data specs
    if (project.specs) {
      const ul = document.createElement("ul");
      ul.className = "project-specs";

      project.specs.forEach(function (spec) {
        const li = document.createElement("li");
        const label = document.createElement("span");
        const value = document.createElement("span");

        label.className = "spec-label";
        label.textContent = spec[0];
        value.textContent = spec[1];

        li.appendChild(label);
        li.appendChild(value);
        ul.appendChild(li);
      });

      descEl.appendChild(ul);
    }
  } else {
    // id tidak dikenal → tampilkan pesan
    projectHero.classList.add("project-notfound");
    titleEl.textContent = "Project not found";
    descEl.innerHTML = "<p>The project you are looking for does not exist.</p>";
    bgEl.style.backgroundImage = "url('img/works-hero.png')";
    document.title = "Project not found | SAS Aero Sishan";
  }
}

// ===== TAHUN DI FOOTER =====
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
