const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const birthdayDate = new Date("2026-09-26T00:00:00+02:00");

/* -----------------------------
   Opening + soundtrack
------------------------------ */
const giftScreen = $("#giftScreen");
const giftArt = $(".gift-art");
const openGiftButton = $("#openGift");
const miniNav = $("#miniNav");
const musicDock = $("#musicDock");
const soundtrack = $("#soundtrack");
const musicToggle = $("#musicToggle");
const musicStatus = $("#musicStatus");

soundtrack.volume = 0.32;
soundtrack.load();
let typingStarted = false;

function setMusicUI(isPlaying, message) {
  musicDock.classList.toggle("paused", !isPlaying);
  musicToggle.textContent = isPlaying ? "❚❚" : "♪";
  musicStatus.textContent = message;
}

async function playSoundtrack() {
  try {
    soundtrack.muted = false;
    const playPromise = soundtrack.play();
    if (playPromise) await playPromise;
    setMusicUI(true, "playing softly");
  } catch (error) {
    console.warn("Soundtrack could not start:", error);
    setMusicUI(false, "tap to play");
  }
}

soundtrack.addEventListener("canplay", () => {
  if (soundtrack.paused) musicStatus.textContent = "soundtrack ready";
});

soundtrack.addEventListener("error", () => {
  setMusicUI(false, "audio unavailable");
});

openGiftButton.addEventListener("click", () => {
  giftArt?.classList.add("opening");
  createConfetti(45);
  playSoundtrack();

  window.setTimeout(() => {
    giftScreen.classList.add("is-hidden");
    document.body.classList.remove("no-scroll");
    miniNav.classList.add("show");
    musicDock.classList.add("show");
    typeHeroMessage();
  }, 700);
});

musicToggle.addEventListener("click", () => {
  if (soundtrack.paused) {
    playSoundtrack();
  } else {
    soundtrack.pause();
    setMusicUI(false, "paused");
  }
});

const heroMessage = "Friends since 2019. Twenty-one years of you. One little website made with a lot of love.";
function typeHeroMessage() {
  if (typingStarted) return;
  typingStarted = true;

  const target = $("#typingText");
  let index = 0;
  target.textContent = "";

  const timer = window.setInterval(() => {
    target.textContent += heroMessage.charAt(index);
    index += 1;
    if (index >= heroMessage.length) window.clearInterval(timer);
  }, 36);
}

/* -----------------------------
   Countdown
------------------------------ */
function updateCountdown() {
  const difference = birthdayDate - new Date();

  if (difference <= 0) {
    $("#countdownGrid").classList.add("hidden");
    $("#birthdayState").classList.remove("hidden");
    return;
  }

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference / 3600000) % 24);
  const minutes = Math.floor((difference / 60000) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  $("#days").textContent = String(days).padStart(2, "0");
  $("#hours").textContent = String(hours).padStart(2, "0");
  $("#minutes").textContent = String(minutes).padStart(2, "0");
  $("#seconds").textContent = String(seconds).padStart(2, "0");
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

/* -----------------------------
   21 appreciation cards
------------------------------ */
const appreciationMessages = [
  "You have a genuinely kind heart. Your kindness never feels forced; it is simply part of who you are.",
  "You carry yourself with grace. There is something calm and gentle about the way you move through life.",
  "You are stronger than you sometimes realise. You have grown without losing your softness.",
  "You are humble. You do not need to be the loudest person in the room for your presence to be felt.",
  "You make friendship feel safe. Having someone who has been part of my life since 2019 is something I never take for granted.",
  "You have grown beautifully — not only in appearance, but in maturity, character and the way you carry yourself.",
  "Your smile is ridiculously wholesome. Some people smile and somehow the whole photo becomes warmer. You are one of those people.",
  "You are thoughtful. You notice things, you care, and you have a gentle way of dealing with people.",
  "You have your own style. From school uniform to headwraps, dresses and blazers, you somehow make every era look intentional.",
  "You are resilient. You have made it through difficult days without allowing those days to define your whole story.",
  "You are trustworthy. Having someone I can genuinely see as family is rare, and I value that deeply.",
  "You have a peaceful presence. You do not always need to say much for people to feel comfortable around you.",
  "You are disciplined. There is a quiet determination in you that I genuinely respect.",
  "You know how to remain yourself. Trends change, people change and life changes, yet there is still something unmistakably Confidence about you.",
  "You are easy to root for. Seeing good things happen for you genuinely makes me happy.",
  "You have made ordinary memories special. Some moments did not feel important when they happened — but years later, here we are.",
  "You remind me that family is not always about blood. Sometimes life simply gives you people who become sisters and brothers along the way.",
  "You have a beautiful future ahead of you, not because life will always be easy, but because you have the character to keep growing through it.",
  "You deserve to be celebrated — not only because you are turning 21, but because your presence has mattered in people’s lives.",
  "You have been part of my life since 2019. That makes you part of so many chapters of my own story.",
  "You are Confidence — my friend, my sister — and after everything since 2019, I am simply grateful that our paths crossed."
];

const appreciationGrid = $("#appreciationGrid");
const openedCards = new Set();

appreciationMessages.forEach((message, index) => {
  const card = document.createElement("article");
  card.className = "appreciation-card reveal";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Open appreciation ${index + 1}`);
  card.innerHTML = `
    <div class="appreciation-inner">
      <div class="appreciation-front">
        <strong>${String(index + 1).padStart(2, "0")}</strong>
        <span>${index === 20 ? "the last one" : "tap to open"}</span>
      </div>
      <div class="appreciation-back"><p>${message}</p></div>
    </div>`;

  function toggleCard() {
    card.classList.toggle("open");
    if (card.classList.contains("open")) openedCards.add(index);
    else openedCards.delete(index);

    $("#openedCount").textContent = openedCards.size;
    if (index === 20 && card.classList.contains("open")) createConfetti(45);
  }

  card.addEventListener("click", toggleCard);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleCard();
    }
  });

  appreciationGrid.appendChild(card);
});

/* -----------------------------
   Open-when letters
------------------------------ */
const notes = {
  smile: {
    title: "You need to smile",
    text: `<p>First of all, why are you not smiling? We need to fix that immediately.</p><p>Please remember that you survived the school-uniform era, awkward photos, growing up and knowing me since 2019. At this point you can survive anything.</p><p>Also, somewhere right now there is probably an old photo of you that would make both of us laugh. So smile before I find it.</p><p>You are loved. 🤍</p>`
  },
  doubt: {
    title: "You doubt yourself",
    text: `<p>Confidence — and yes, the irony of writing this to someone literally named Confidence is not lost on me — you are far more capable than you sometimes give yourself credit for.</p><p>You do not need to know everything. You do not need your whole life planned. You simply need to take the next step.</p><p>You have already grown through things that once felt impossible. You will grow through this too. Trust yourself a little more.</p>`
  },
  hardday: {
    title: "You have had a hard day",
    text: `<p>Today does not get to decide how you feel about your entire life.</p><p>Rest. Pray. Cry if you need to. Eat something nice. Complain for five minutes if necessary. Then breathe.</p><p>Tomorrow gets another chance — and so do you. You do not always have to be strong.</p>`
  },
  friendship: {
    title: "You miss our friendship",
    text: `<p>Since 2019, life has changed a lot — and so have we.</p><p>Wherever life takes us, I hope you always know that the years we have shared matter to me. You became family somewhere along the way, and I do not use that word lightly.</p><p>So if life gets busy, send the message. Make the call. I will probably annoy you within the first five minutes and everything will feel normal again.</p>`
  },
  future: {
    title: "The future feels scary",
    text: `<p>You are not supposed to know exactly how your entire life will unfold at 21.</p><p>Some doors will open. Some will close. Some plans will change completely. That does not mean you are lost. Sometimes you are simply being redirected.</p><p>Take life one chapter at a time. Chapter 21 does not need to contain the entire book.</p>`
  },
  birthday: {
    title: "It is your 21st birthday",
    text: `<p>Confidence Makoma Moropana, you are officially 21.</p><p>Today, I hope you allow yourself to simply enjoy being celebrated. No pressure to have everything figured out. No rushing into the next thing. Just be present.</p><p>May this chapter carry peace, good people, unexpected opportunities, answered prayers, laughter, growth and memories worth keeping.</p><p>Welcome to Chapter 21. Happy birthday, sis. 🤍</p>`
  }
};

const noteModal = $("#noteModal");
$$('.envelope').forEach((button) => {
  button.addEventListener("click", () => {
    const note = notes[button.dataset.note];
    $("#modalTitle").textContent = note.title;
    $("#modalText").innerHTML = note.text;
    noteModal.classList.add("show");
    noteModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  });
});

function closeNoteModal() {
  noteModal.classList.remove("show");
  noteModal.setAttribute("aria-hidden", "true");
  if (!$("#galleryModal").classList.contains("show")) document.body.classList.remove("no-scroll");
}
$("#closeModal").addEventListener("click", closeNoteModal);
noteModal.addEventListener("click", (event) => {
  if (event.target === noteModal) closeNoteModal();
});

/* -----------------------------
   Full album — all 20 photos
------------------------------ */
const gallery = [
  { src: "images/blackjacket.jpg", label: "Campus chapter", caption: "A quiet campus moment.", subtext: "Simple, relaxed and completely you." },
  { src: "images/blue1.jpg", label: "The blue-dress chapter", caption: "Soft, elegant and effortless.", subtext: "One of those photos that feels like it belongs in this chapter." },
  { src: "images/blue2.jpg", label: "The blue-dress chapter", caption: "That smile deserved its own frame.", subtext: "Some photos do not need much explanation." },
  { src: "images/blue3.jpg", label: "The blue-dress chapter", caption: "Another side of the moment.", subtext: "A little detail, a little grace, and another version of you worth remembering." },
  { src: "images/braids.jpg", label: "Growing up", caption: "Different seasons, still you.", subtext: "Different hairstyles, different years, same unmistakable Confidence." },
  { src: "images/bw.jpg", label: "Throwback", caption: "Before Chapter 21.", subtext: "An older version of you and another piece of the story." },
  { src: "images/campus.jpg", label: "Campus days", caption: "Somewhere between then and now.", subtext: "One of the many moments between school days and Chapter 21." },
  { src: "images/hero.jpg", label: "26 • 09 • 2026", caption: "Chapter 21 looks good on you.", subtext: "From school uniforms to this — safe to say the glow-up has been successful." },
  { src: "images/cap1.jpg", label: "Casual days", caption: "No big occasion required.", subtext: "Sometimes an ordinary moment is worth keeping exactly as it is." },
  { src: "images/green.jpg", label: "Chapter 21", caption: "Growing into yourself.", subtext: "One chapter at a time." },
  { src: "images/group.jpg", label: "School memories", caption: "Part of the story.", subtext: "Friends, school grounds and a version of life that feels both close and far away now." },
  { src: "images/makhado.jpg", label: "A day out", caption: "Another page added.", subtext: "Dressed up, somewhere new, and another memory worth keeping." },
  { src: "images/picnic.jpg", label: "Ordinary memories", caption: "The random ones become special too.", subtext: "Some photos were never meant to be important — until years later." },
  { src: "images/schoolwide.jpg", label: "School memories", caption: "The uniform era.", subtext: "Where so much growing, laughing and figuring things out happened." },
  { src: "images/throwback.jpg", label: "25 February 2021", caption: "A proper throwback.", subtext: "Chapter 21 was still a long way away." },
  { src: "images/sunglasses.jpg", label: "Campus chapter", caption: "Sunglasses on. Unbothered.", subtext: "Very much a moment." },
  { src: "images/cap2.jpg", label: "Casual days", caption: "Same wall, different expression.", subtext: "Obviously both photos had to make the album." },
  { src: "images/school1.jpg", label: "School memories", caption: "One of those school-day frames.", subtext: "The kind of random memory that becomes nostalgic later." },
  { src: "images/school2.jpg", label: "School memories", caption: "Another one from the uniform era.", subtext: "Because one photo was never going to be enough." },
  { src: "images/whiteblazer.jpg", label: "Growing up", caption: "Grace has always suited you.", subtext: "A different chapter, the same calm presence." }
];

const galleryModal = $("#galleryModal");
const galleryImage = $("#galleryImage");
const galleryCaption = $("#galleryCaption");
const galleryLabel = $("#galleryLabel");
const gallerySubtext = $("#gallerySubtext");
const galleryCounter = $("#galleryCounter");
const galleryThumbs = $("#galleryThumbs");
let currentPhoto = 0;

function renderGalleryThumbnails() {
  gallery.forEach((photo, index) => {
    const button = document.createElement("button");
    button.className = "gallery-thumb";
    button.type = "button";
    button.setAttribute("aria-label", `View photo ${index + 1}`);
    button.innerHTML = `<img src="${photo.src}" alt="Photo ${index + 1} thumbnail" />`;
    button.addEventListener("click", () => showPhoto(index));
    galleryThumbs.appendChild(button);
  });
}
renderGalleryThumbnails();

function showPhoto(index) {
  currentPhoto = (index + gallery.length) % gallery.length;
  const photo = gallery[currentPhoto];

  galleryImage.src = photo.src;
  galleryImage.alt = photo.caption;
  galleryLabel.textContent = photo.label;
  galleryCaption.textContent = photo.caption;
  gallerySubtext.textContent = photo.subtext || "";
  galleryCounter.textContent = `${String(currentPhoto + 1).padStart(2, "0")} / ${gallery.length}`;

  $$(".gallery-thumb", galleryThumbs).forEach((thumb, thumbIndex) => {
    thumb.classList.toggle("active", thumbIndex === currentPhoto);
  });

  $$(".gallery-thumb", galleryThumbs)[currentPhoto]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}

function openGallery(index = 0) {
  showPhoto(index);
  galleryModal.classList.add("show");
  galleryModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeGallery() {
  galleryModal.classList.remove("show");
  galleryModal.setAttribute("aria-hidden", "true");
  if (!noteModal.classList.contains("show")) document.body.classList.remove("no-scroll");
}

$$('.memory-card').forEach((card) => {
  const index = Number(card.dataset.galleryIndex || 0);
  $(".photo-plus", card)?.addEventListener("click", (event) => {
    event.stopPropagation();
    openGallery(index);
  });
  $("img", card)?.addEventListener("click", () => openGallery(index));
});

$("#viewAllPhotos").addEventListener("click", () => openGallery(0));
$("#openAlbumButton").addEventListener("click", () => openGallery(0));
$("#galleryClose").addEventListener("click", closeGallery);
$("#galleryPrev").addEventListener("click", () => showPhoto(currentPhoto - 1));
$("#galleryNext").addEventListener("click", () => showPhoto(currentPhoto + 1));

let touchStartX = null;
galleryModal.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });
galleryModal.addEventListener("touchend", (event) => {
  if (touchStartX === null) return;
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 55) showPhoto(currentPhoto + (distance < 0 ? 1 : -1));
  touchStartX = null;
}, { passive: true });

/* -----------------------------
   Scroll reveal + keyboard
------------------------------ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

$$('.reveal').forEach((element) => revealObserver.observe(element));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (noteModal.classList.contains("show")) closeNoteModal();
    if (galleryModal.classList.contains("show")) closeGallery();
  }
  if (galleryModal.classList.contains("show") && event.key === "ArrowLeft") showPhoto(currentPhoto - 1);
  if (galleryModal.classList.contains("show") && event.key === "ArrowRight") showPhoto(currentPhoto + 1);
});

/* -----------------------------
   Confetti + progress
------------------------------ */
function createConfetti(amount = 100) {
  const colors = ["#e7d7c5", "#536a55", "#735744", "#fffdf9", "#d2b99f"];

  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--dur", `${2.4 + Math.random() * 2.7}s`);
    piece.style.setProperty("--drift", `${-130 + Math.random() * 260}px`);
    piece.style.animationDelay = `${Math.random() * 0.35}s`;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 6000);
  }
}

$("#celebrateButton").addEventListener("click", () => createConfetti(180));

function updateProgress() {
  const maximum = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = maximum > 0 ? (window.scrollY / maximum) * 100 : 0;
  $("#readingProgress").style.width = `${percentage}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();
