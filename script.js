// --- CONFIGURATION ---
const NTFY_TOPIC = "Jeremiahs_Volcano_Tracker1994";
// Swapped to Global Volcanism Program endpoint
const MONITOR_URL = "https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesGVP"; 
const NOTICES_URL = "https://volcanoes.usgs.gov/hans-public/api/notice/getNewestOrRecent";

// --- ALERT FILTERING (Keeps us under 250 msgs/day) ---
const MINIMUM_ALERT_LEVEL = "ORANGE"; 
const SEVERITY_RANK = { "GREEN": 0, "YELLOW": 1, "ORANGE": 2, "RED": 3 };

// --- UI CONSTANTS ---
const ICON = {
    SYSTEM: "🟢", CHART: "📊", VOLCANO: "🌋", NOTICE_DAILY: "📜",
    TIME: "⏰", BUILDING: "🏢", TEXT: "📝", PIN: "📍", WEB: "🌐"
};

const NOTICE_MAP = {
    "Volcano Activity Notice": "⚠️ Volcano Activity Notice",
    "VONA": "✈️ VONA (Volcano Observatory Notice for Aviation)",
    "Status Report": "🚨 Status Report",
    "Daily Update": "📜 Daily Update",
    "Information Statement": "ℹ️ Information Statement"
};

let lastProcessedNoticeId = null;
let volcanoRegistry = [];

async function runTrackerStartup() {
  console.log(`${ICON.VOLCANO} Initializing Global Tracker...`);

  try {
    const res = await fetch(MONITOR_URL);
    volcanoRegistry = await res.json();
    const count = Array.isArray(volcanoRegistry) ? volcanoRegistry.length : 0;
    
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, { 
      method: 'POST', 
      body: `${ICON.SYSTEM} GLOBAL TRACKER ONLINE\n${ICON.CHART} Total Systems Tracked: ${count}` 
    });
  } catch (err) { console.error("Registry Load Error:", err); }

  try {
    const res = await fetch(NOTICES_URL);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) processNotice(data[0]);
  } catch (err) { console.error("Init Error:", err); }
}

async function processNotice(latest) {
  const identifier = latest.noticeIdentifier;
  if (lastProcessedNoticeId === identifier) return;

  // Severity Filter: Only alert for Orange/Red
  let shouldAlert = false;
  latest.sections.forEach(s => {
    const currentLevel = (s.colorCode || "GREEN").toUpperCase();
    if (SEVERITY_RANK[currentLevel] >= SEVERITY_RANK[MINIMUM_ALERT_LEVEL]) {
      shouldAlert = true;
    }
  });

  if (!shouldAlert) {
    lastProcessedNoticeId = identifier;
    return;
  }

  // Generate Message
  const noticeLabel = NOTICE_MAP[latest.noticeType] || `${ICON.NOTICE_DAILY} ${latest.noticeType}`;
  const displayTime = (latest.sentUtc || "Unknown").substring(0, 16);
  
  let body = "";
  latest.sections.forEach(s => {
      // Cross-reference with our now-global registry
      const vData = volcanoRegistry.find(v => v.volcanoCd === s.volcanoCd);
      body += `\n${ICON.VOLCANO} ${s.volcanoName} (${s.colorCode})`;
      if (vData) body += `\n${ICON.PIN} ${vData.lat || 'N/A'}, ${vData.lon || 'N/A'}`;
      body += `\n${ICON.TEXT} ${s.synopsis}\n`;
  });

  if (latest.notice_url) body += `\n${ICON.WEB} ${latest.notice_url}`;

  await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, { 
    method: 'POST', 
    body: `${noticeLabel}\n${ICON.TIME} ${displayTime}\n${ICON.BUILDING} ${latest.obsFullname}\n${body}`,
    headers: { 'Title': 'Volcano Update', 'Click': latest.notice_url || '' }
  });

  lastProcessedNoticeId = identifier;
}

(async () => await runTrackerStartup())();

setInterval(async () => {
  try {
    const res = await fetch(NOTICES_URL);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) processNotice(data[0]);
  } catch (err) { console.error("Loop Error:", err); }
}, 60000);