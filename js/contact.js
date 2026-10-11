/* js/contact.js
   Contact form (opens a ready-to-send Gmail draft) and the live IST time.
   (classic script: shares one global scope with the other files, so keep the load order from index.html) */

// contact form: choices -> ready-to-send Gmail draft (works on static hosting, no server needed)
const cf = $("#cform"),
  note = $("#cnote"),
  clk2 = $("#clk2");
const istTick = () =>
  (clk2.textContent =
    new Date().toLocaleTimeString("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
    }) + " IST");
istTick();
setInterval(istTick, 15000);
$$(".chs").forEach((g) =>
  g.addEventListener("click", (e) => {
    const b = e.target.closest(".pill");
    if (!b) return;
    if (g.classList.contains("one"))
      g.querySelectorAll(".pill").forEach(
        (x) => x !== b && x.classList.remove("on"),
      );
    b.classList.toggle("on");
  }),
);
cf.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(cf),
    name = (f.get("name") || "").trim(),
    email = (f.get("email") || "").trim(),
    msg = (f.get("msg") || "").trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !msg) {
    note.textContent =
      "Please add your name, a valid email and a short message.";
    note.className = "cnote err";
    return;
  }
  const need =
      [...cf.querySelectorAll(".chs:not(.one) .pill.on")]
        .map((b) => b.textContent)
        .join(", ") || "Not specified",
    bud =
      (cf.querySelector(".chs.one .pill.on") || {}).textContent ||
      "Not specified";
  const body = `Hi KP,\n\nMy name is ${name} (${email}).\n\nI need help with: ${need}\nBudget: ${bud}\n\n${msg}\n`;
  window.open(
    "https://mail.google.com/mail/?view=cm&fs=1&to=kspatel6709@gmail.com&su=" +
      encodeURIComponent("New project enquiry from " + name) +
      "&body=" +
      encodeURIComponent(body),
    "_blank",
    "noopener",
  );
  note.textContent =
    "Thanks " +
    name.split(" ")[0] +
    "! Your email draft is open, just press send.";
  note.className = "cnote ok";
  cf.reset();
  cf.querySelectorAll(".pill.on").forEach((x) => x.classList.remove("on"));
});
