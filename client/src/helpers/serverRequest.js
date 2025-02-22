/**
 * Copyright (c) 2021-2023 Roderick Tabalba University of Hawaii at Manoa
 * Laboratory for Advanced Visualizations and Applications (LAVA)
 *
 *
 */
import {
  duplicate,
  noCharts,
  oneChart,
  twoCharts,
  threeCharts,
  fewCharts,
} from "../components/voice/assistantVoiceOptions";
import speakVoice from "../components/voice/speakVoice";

/**
 * API request to Node Server for chart generation
 *
 * @param {object} chartMsg message for server
 * @param {function} setChartMsg set state for server request
 * @param {object} modifiedChartOptions Handler for toggling algorithm
 * @param {boolean} mute To speak or not to speak voice synthesizer
 * @param {function} setVoiceMsg set state for voice synthesizer
 * @returns
 */
export async function serverRequest(
  chartMsg,
  setChartMsg,
  modifiedChartOptions,
  setVoiceMsg,
  charts,
  setCharts,
  setChartToHighlight
) {
  //Check charts to pivot
  let pivotTheseCharts = [];
  let isCommand = true;

  for (let i = 0; i < charts.length; i++) {
    if (charts[i].pivotThis) {
      pivotTheseCharts.push(charts[i]);
    }
  }
  let selectedCharts = [];
  for (let i = 0; i < charts.length; i++) {
    if (charts[i].visible) {
      selectedCharts.push(charts[i]);
    }
  }

  //API request
  const response = await fetch("/createCharts", {
    method: "POST",
    body: JSON.stringify({
      chartMsg,
      modifiedChartOptions,
      pivotTheseCharts,
      selectedCharts,
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // decrypt message from server
  const body = await response.text();
  const responseChartMsg = JSON.parse(body);
  if (responseChartMsg.chartMsg.errMsg == "none") {
    return { assistantResponse: false, isCommand: false };
  }

  // //API request
  // const pythonResponse = await fetch("/flask", {
  //   method: "POST",
  //   body: JSON.stringify({ chartMsg: chartMsg }),
  //   headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //   },
  // });
  // const pythonBody = await pythonResponse.text();
  // const pythonChartMsg = JSON.parse(pythonBody);

  // console.log(pythonChartMsg);

  //tmp var to hold charts
  let tmpChartMsg = responseChartMsg.chartMsg;
  //Must add explicit first
  // console.log(pythonChartMsg.pythonCharts);
  let newCharts = [
    ...tmpChartMsg.randomCharts,
    ...tmpChartMsg.explicitChart,
    ...tmpChartMsg.mainAI,
    ...tmpChartMsg.mainAIOverhearing,
    ...tmpChartMsg.pivotChart,
    // ...pythonChartMsg.pythonCharts,
  ];

  //Clean up for charts that weren't generated
  newCharts = newCharts.filter((x) => {
    return x !== "";
  });

  //id on charts
  let startingId = chartMsg.charts.length;
  for (let i = 0; i < newCharts.length; i++) {
    newCharts[i].id = startingId + i;
  }

  //cleaning up for pivot
  let tmpCharts = chartMsg.charts;
  for (let i = 0; i < tmpCharts.length; i++) {
    tmpCharts[i].pivotThis = false;
  }
  // tmpCharts[1].highlight = true;

  //Put header frequency count into state
  setChartMsg((prev) => {
    return {
      ...prev,
      charts: [...tmpCharts, ...newCharts],
      mainAICount: tmpChartMsg.mainAICount,
      mainAIOverhearingCount: tmpChartMsg.mainAIOverhearingCount,
      total: tmpChartMsg.total,
    };
  });

  // How many charts were generated
  let count = newCharts.length;
  let assistantResponse;

  if (count == 0) {
    if (tmpChartMsg.errMsg.msg == "duplicate") {
      assistantResponse =
        duplicate[Math.floor(Math.random() * duplicate.length)];
      setChartToHighlight(tmpChartMsg.errMsg.id);
      setTimeout(() => {
        setChartToHighlight(null);
      }, 4000);
    } else {
      if (chartMsg.command !== "random") {
        //FLAG DISABLED FOR NOW
        // assistantResponse =
        //   noCharts[Math.floor(Math.random() * noCharts.length)];
        assistantResponse = false;
      } else {
        assistantResponse = false;
      }
    }
  } else if (count == 1) {
    assistantResponse = oneChart[Math.floor(Math.random() * oneChart.length)];
  } else if (count == 2) {
    assistantResponse = twoCharts[Math.floor(Math.random() * twoCharts.length)];
  } else if (count == 3) {
    assistantResponse =
      threeCharts[Math.floor(Math.random() * threeCharts.length)];
  } else {
    assistantResponse = fewCharts[Math.floor(Math.random() * fewCharts.length)];
  }

  return { assistantResponse: assistantResponse, isCommand: isCommand };
}
