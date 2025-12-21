import * as cheerio from "cheerio";
import { sendTelegram } from "./telegram.js";

const URL = "https://stw-planner.com/mission-alerts";
let $;

const fetchSTWPlannerHTML = async () => {
  const response = await fetch(URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
  });
  const HTML = await response.text();
  return HTML;
};

async function startProgram() {
  const html = await fetchSTWPlannerHTML();
  $ = cheerio.load(html);
  getHtmlData();
}

const getHtmlData = () => {
  const $totalVbucks = $(".special-title").first().text() ?? "";
  const $vBuckMissionsList = $(".special-wrapper .mission-entry");

  let vbucksAlertsList = [];
  $vBuckMissionsList.each((i, el) => {
    const vbucks = $(el).find(".mission-reward-name").last().text().trim();
    const missionName = $(el)
      .find(".mission-zone")
      .html()
      .replace(/<br\s*\/?>/gi, " - ") 
      .replace(/\s+/g, " ")
      .trim();

    vbucksAlertsList.push({ vBucks: vbucks, missionName: missionName });
  });

  const message = mapVbucksAlertsToMessage(vbucksAlertsList, $totalVbucks);

  sendTelegram(message);
};

const mapVbucksAlertsToMessage = (vbucksAlertsList, totalVBucks) => {
  if (!vbucksAlertsList.length) {
    return "❌ Hoy no hay misiones con V-Bucks.";
  }

  let message = `🔥 *MISIONES CON V-BUCKS HOY* \n${totalVBucks}\n\n`;

  vbucksAlertsList.forEach((mission, index) => {
    message +=
      `*${index + 1}️⃣ Zona:* ${mission.missionName}\n` +
      `💰 *V-Bucks:* ${mission.vBucks}\n\n`;
  });

  return message;
};

export default startProgram;
