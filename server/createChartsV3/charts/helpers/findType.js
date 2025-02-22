/**
 * Copyright (c) 2021-2023 Roderick Tabalba University of Hawaii at Manoa
 * Laboratory for Advanced Visualizations and Applications (LAVA)
 *
 *
 */
let specialTypes = [{ header: "map", type: "map" }];

module.exports = (header, data) => {
  let lowerCaseHeader = header.toLowerCase();
  for (let i = 0; i < specialTypes.length; i++) {
    if (header === specialTypes[i].header) {
      return specialTypes[i].type;
    }
  }
  if (
    lowerCaseHeader.includes("date") ||
    lowerCaseHeader.includes("year") ||
    lowerCaseHeader.includes("month") ||
    lowerCaseHeader.includes("day") ||
    lowerCaseHeader.includes("months") ||
    lowerCaseHeader.includes("dates")
  ) {
    return "temporal";
  } else if (isNaN(data[1][header])) {
    return "nominal";
  } else {
    return "quantitative";
  }
};
