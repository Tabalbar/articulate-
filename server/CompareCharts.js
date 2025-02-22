/**
 * Copyright (c) 2021-2023 Roderick Tabalba University of Hawaii at Manoa
 * Laboratory for Advanced Visualizations and Applications (LAVA)
 *
 *
 */
module.exports = (chartMsg, options, chosenCharts) => {
  for (let i = 0; i < chartMsg.explicitChart.length; i++) {
    if (chartMsg.explicitChart[i] !== "") {
      chartMsg.explicitChart[i].chartSelection = "explicit_point";

      for (let j = 0; j < chartMsg.mainAI.length; j++) {
        if (isChartsEqual(chartMsg.explicitChart[i], chartMsg.mainAI[j])) {
          chartMsg.mainAI[j] = "";
          chartMsg.explicitChart[i].chartSelection += " mainAI_point";
        }
      }

      for (let n = 0; n < chartMsg.mainAIOverhearing.length; n++) {
        if (
          isChartsEqual(
            chartMsg.explicitChart[i],
            chartMsg.mainAIOverhearing[n]
          ) &&
          chartMsg.explicitChart[i] !== ""
        ) {
          chartMsg.mainAIOverhearing[n] = "";
        }
      }

      chartMsg.explicitChart[i] = checkIfChartsAlreadyChosen(
        chartMsg.explicitChart[i],
        chosenCharts,
        chartMsg
      );
    }
  }

  for (let i = 0; i < chartMsg.mainAI.length; i++) {
    if (chartMsg.mainAI[i] !== "") {
      chartMsg.mainAI[i].chartSelection = "mainAI_point";

      for (let j = 0; j < chartMsg.mainAIOverhearing.length; j++) {
        if (
          isChartsEqual(chartMsg.mainAI[i], chartMsg.mainAIOverhearing[j]) &&
          chartMsg.explicitChart[i] !== ""
        ) {
          chartMsg.mainAIOverhearing[j] = "";
        }
      }
      chartMsg.mainAI[i] = checkIfChartsAlreadyChosen(
        chartMsg.mainAI[i],
        chosenCharts,
        chartMsg
      );
    }
  }

  for (let i = 0; i < chartMsg.mainAIOverhearing.length; i++) {
    if (chartMsg.mainAIOverhearing[i] !== "") {
      chartMsg.mainAIOverhearing[i].chartSelection = "mainAIOverhearing_point";
      if (chartMsg.mainAIOverhearing[i].command === "random") {
        chartMsg.mainAIOverhearing[i].chartSelection = "random";
      }
    }
    chartMsg.mainAIOverhearing[i] = checkIfChartsAlreadyChosen(
      chartMsg.mainAIOverhearing[i],
      chosenCharts,
      chartMsg
    );
  }

  for (let i = 0; i < chartMsg.pivotChart.length; i++) {
    for (let j = i + 1; j < chartMsg.pivotChart.length; j++) {
      if (isChartsEqual(chartMsg.pivotChart[i], chartMsg.pivotChart[j])) {
        chartMsg.pivotChart[j] = "";
        break;
      }
    }
    if (chartMsg.pivotChart[i] !== "") {
      chartMsg.pivotChart[i].chartSelection = "pivot_point";
    }
    chartMsg.pivotChart[i] = checkIfChartsAlreadyChosen(
      chartMsg.pivotChart[i],
      chosenCharts,
      chartMsg
    );
  }
  let tmpChartWindow = [];
  if (options.randomCharts.chartWindow !== 0) {
    tmpChartWindow = chartMsg.charts.splice(-options.randomCharts.chartWindow);
  }
  for (let i = 0; i < chartMsg.randomCharts.length; i++) {
    for (let j = 0; j < tmpChartWindow.length; j++) {
      if (isChartsEqual(chartMsg.randomCharts[i], tmpChartWindow[j])) {
        chartMsg.randomCharts[i] = "";
      }
    }
    if (chartMsg.randomCharts[i] !== "") {
      chartMsg.randomCharts[i].chartSelection = "random_point";
    }
  }

  for (let i = 0; i < chartMsg.randomCharts.length; i++) {
    chartMsg.randomCharts[i] = checkIfChartsAlreadyChosen(
      chartMsg.randomCharts[i],
      chosenCharts,
      chartMsg
    );
  }
};

function isChartsEqual(chartOne, chartTwo) {
  if (chartOne == "" && chartTwo == "") {
    return true;
  }
  if (chartOne == "" && chartTwo !== "") {
    return false;
  }
  if (chartOne !== "" && chartTwo == "") {
    return false;
  }
  // chartOne = chartOne.charts.spec;
  // chartTwo = chartTwo.charts.spec;
  if (chartOne.hasOwnProperty("layer")) {
    if (JSON.stringify(chartOne.layer) == JSON.stringify(chartTwo.layer)) {
      return true;
    } else {
      return false;
    }
  }

  if (
    JSON.stringify(chartOne.encoding) == JSON.stringify(chartTwo.encoding) &&
    JSON.stringify(chartOne.mark) == JSON.stringify(chartTwo.mark) &&
    JSON.stringify(chartOne.transform) == JSON.stringify(chartTwo.transform) &&
    JSON.stringify(chartOne.layer) == JSON.stringify(chartTwo.layer)
  ) {
    return true;
  } else {
    return false;
  }
}

function checkIfChartsAlreadyChosen(chart, chosenCharts, chartMsg) {
  for (let i = 0; i < chosenCharts.length; i++) {
    if (isChartsEqual(chart, chosenCharts[i])) {
      chartMsg.errMsg = {
        msg: "duplicate",
        id: chosenCharts[i].id,
      };
      return "";
    }
  }
  return chart;
}

function checkIfOverhearingChart(chart) {
  for (let n = 0; n < chart.headerFrequencyCount.nominal.length; n++) {
    if (chart.headerFrequencyCount.nominal[k].count > 0) {
      return true;
    }
  }
  for (let n = 0; n < chart.headerFrequencyCount.quantitative.length; n++) {
    if (chart.headerFrequencyCount.quantitative[k].count > 0) {
      return true;
    }
  }
  for (let n = 0; n < chart.headerFrequencyCount.temporal.length; n++) {
    if (chart.headerFrequencyCount.temporal[k].count > 0) {
      return true;
    }
  }
  for (let n = 0; n < chart.headerFrequencyCount.map.length; n++) {
    if (chart.headerFrequencyCount.map[k].count > 0) {
      return true;
    }
  }
  return false;
}
