/**
 * Copyright (c) 2021-2023 Roderick Tabalba University of Hawaii at Manoa
 * Laboratory for Advanced Visualizations and Applications (LAVA)
 *
 *
 */
const createTitle = require("./helpers/specifications/createTitle");
const findType = require("./helpers/findType");
const covidColors = require("./covidHelpers/covidColors");
const covidSort = require("./covidHelpers/covidSort");
const createTransform = require("./helpers/specifications/createTransform");
const createChartTemplate = require("./createChartTemplate");

module.exports = (
  chartMsg,
  extractedHeader,
  extractedFilteredValues,
  headerFrequencyCount,
  filterFrequencyCount,
  options
) => {
  let chart = createChartTemplate(
    chartMsg,
    headerFrequencyCount,
    filterFrequencyCount
  );
  chart.mark = "bar";
  chart.encoding.x = {
    field: extractedHeader,
    type: findType(extractedHeader, chartMsg.data),
    axis: {
      labelFontSize: 15,
      titleFontSize: 15,
      labelLimit: 2000,
      labelAngle: -50,
    },
    sort: options.useCovidDataset
      ? covidSort(extractedHeader, chartMsg.data)
      : [],
  };
  chart.encoding.color = {
    field: extractedHeader,
    type: findType(extractedHeader, chartMsg.data),
    scale: {
      range: covidColors(extractedHeader),
    },
    axis: { labelFontSize: 15, titleFontSize: 15, labelLimit: 2000 },
    sort: options.useCovidDataset
      ? covidSort(extractedHeader, chartMsg.data)
      : [],
  };
  chart.encoding.y = {
    aggregate: "count",
    legend: { labelFontSize: 15, titleFontSize: 15, labelLimit: 2000 },
  };
  chart = createTitle(chart, [extractedHeader], "bar", extractedFilteredValues);
  chart = createTransform(chart, chartMsg, extractedFilteredValues);
  // chart.transform.push({
  //   type: "aggregate",
  //   fields: [extractedHeader],
  //   ops: ["distinct"],
  // });
  return chart;
};
