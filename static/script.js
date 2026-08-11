
/* =========================================================
   DEMO_MODE = true  → runs a sample itinerary so you can preview
                       the design without a backend.
   DEMO_MODE = false → uses your real POST /api/travel endpoint
                       (identical contract to your original app.js).
   ========================================================= */
const DEMO_MODE = true;

let currentThreadId = null;
try { currentThreadId = localStorage.getItem("travel_thread_id") || null; } catch (e) {}
let latestAnswerMarkdown = "";

document.getElementById("docDate").textContent =
  new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

function setPrompt(text){
  const el = document.getElementById("userInput");
  el.value = text;
  el.focus();
}

function setLoading(isLoading){
  const sendBtn = document.getElementById("sendBtn");
  const btnText = document.getElementById("btnText");
  const btnLoader = document.getElementById("btnLoader");
  sendBtn.disabled = isLoading;
  btnText.textContent = isLoading ? "Charting…" : "Draft my itinerary";
  btnLoader.classList.toggle("hidden", !isLoading);
}

function showError(message){
  const errorBox = document.getElementById("errorBox");
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}
function hideError(){
  const errorBox = document.getElementById("errorBox");
  errorBox.classList.add("hidden");
  errorBox.textContent = "";
}

function showResult(answer, threadId){
  latestAnswerMarkdown = answer;
  const resultSection = document.getElementById("resultSection");
  const resultBox = document.getElementById("resultBox");
  const threadInfo = document.getElementById("threadInfo");

  if (typeof marked !== "undefined"){
    resultBox.innerHTML = marked.parse(answer);
  } else {
    resultBox.innerText = answer;
  }

  threadInfo.textContent = threadId ? ("Thread ID · " + threadId) : "";
  resultSection.classList.remove("hidden");
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function sendMessage(){
  hideError();
  const input = document.getElementById("userInput");
  const message = input.value.trim();

  if (!message){
    showError("Add a few words about your trip first — where, how long, and the vibe you're after.");
    return;
  }

  setLoading(true);

  if (DEMO_MODE){
    await new Promise(r => setTimeout(r, 1100));
    currentThreadId = "demo-" + Math.random().toString(36).slice(2, 9);
    try { localStorage.setItem("travel_thread_id", currentThreadId); } catch (e) {}
    showResult(sampleItinerary(message), currentThreadId);
    setLoading(false);
    return;
  }

  try{
    const response = await fetch("/api/travel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, thread_id: currentThreadId })
    });
    const data = await response.json();
    if (!response.ok || !data.success){
      throw new Error(data.error || "Couldn't reach the planner. Try again in a moment.");
    }
    currentThreadId = data.thread_id;
    try { localStorage.setItem("travel_thread_id", currentThreadId); } catch (e) {}
    showResult(data.answer, data.thread_id);
  } catch (error){
    showError(error.message);
  } finally {
    setLoading(false);
  }
}

function copyResult(){
  const resultBox = document.getElementById("resultBox");
  const text = resultBox.innerText;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const copyBtn = document.querySelector(".copy-btn");
    const old = copyBtn.innerHTML;
    copyBtn.innerHTML = "Copied";
    setTimeout(() => { copyBtn.innerHTML = old; }, 1400);
  }).catch(() => showError("Couldn't copy to clipboard."));
}

function downloadPDF(){
  const pdfContent = document.getElementById("pdfContent");
  if (!latestAnswerMarkdown || !pdfContent){
    showError("Draft an itinerary first, then you can download it.");
    return;
  }
  const downloadBtn = document.querySelector(".download-btn");
  const old = downloadBtn.innerHTML;
  downloadBtn.innerHTML = "Preparing…";
  downloadBtn.disabled = true;

  const options = {
    margin: 0.5,
    filename: "atlas-travel-itinerary.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#F7F2E7" },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] }
  };

  html2pdf().set(options).from(pdfContent).save()
    .then(() => { downloadBtn.innerHTML = old; downloadBtn.disabled = false; })
    .catch(() => { downloadBtn.innerHTML = old; downloadBtn.disabled = false; showError("Couldn't generate the PDF."); });
}

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "Enter") sendMessage();
});

/* ---- demo content only (ignored when DEMO_MODE = false) ---- */
function sampleItinerary(message){
  return `# Kyoto — 5 Days, Unhurried

A calm, food-forward loop through Kyoto for two, built around temples in the mornings, markets in the afternoons, and one day trip out of the city. Mid-range budget, early April cherry-blossom timing.

| Detail | Plan |
| --- | --- |
| Duration | 5 days / 4 nights |
| Base | One hotel near Karasuma-Oike |
| Pace | 2–3 anchors per day, lots of walking |
| Rough budget | ¥18,000–24,000 / day for two |

## Day 1 — Higashiyama & first temples
- Arrive, drop bags, and walk **Kiyomizu-dera** before the afternoon crowds thin.
- Wander down **Sannenzaka & Ninenzaka** — old lanes, tea shops, matcha soft-serve.
- Dinner in **Gion**; watch for geiko on the way to Shirakawa canal at dusk.

## Day 2 — Arashiyama day trip
- Early train to **Arashiyama**; bamboo grove is quietest before 9am.
- **Tenryū-ji** garden, then the riverside path and Iwatayama monkey park.
- Back in the city for a relaxed **izakaya** dinner near Pontochō.

## Day 3 — Markets & the golden pavilion
- Morning at **Nishiki Market** — pick a standing breakfast, buy pickles and knives.
- Bus up to **Kinkaku-ji** (Golden Pavilion), then **Ryōan-ji**'s rock garden.
- Evening free; consider a **sento** (public bath) to reset the legs.

## Day 4 — Fushimi Inari & sake
- Beat the crowds at **Fushimi Inari** — climb past the busy lower gates for the quiet upper trail.
- Afternoon in **Fushimi's sake district**; a tasting flight and a canal-side lunch.
- Optional: **Tofuku-ji** on the way back.

## Day 5 — Slow morning, one last stroll
- **Philosopher's Path** under the blossoms, ending at **Ginkaku-ji**.
- Last bowl of ramen, then head out.

> **Booking notes:** reserve popular dinners a day ahead, carry cash, and grab an ICOCA card for buses and trains. Cherry-blossom week books out early — lock lodging first.

*Times and prices shift — confirm temple hours and any reservations before you go.*`;
}
