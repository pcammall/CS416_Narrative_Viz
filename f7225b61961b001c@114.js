function _1(md){return(
md`# D3 scatterplot

A good starting point for many two-dimensional charts.`
)}

function _chart(d3,my_data)
{
  // Specify the chart’s dimensions.
  const width = 1050;
  const height = 1050;
  const marginTop = 25;
  const marginRight = 20;
  const marginBottom = 35;
  const marginLeft = 40;

  // Define the horizontal scale.
  const x = d3
    .scaleLinear()
    .domain(d3.extent(my_data, (d) => d.odometer))
    .nice()
    .range([marginLeft, width - marginRight]);

  // Define the vertical scale.
  const y = d3
    .scaleLinear()
    .domain([0, 250000])
    .nice()
    .range([height - marginBottom, marginTop]);

  //create the color scale
  const colors = d3.scaleOrdinal(d3.schemeCategory10).domain([my_data["year"]]);

  //function to highlight and filter
  const highlight = function (event, d) {
    var selected_body = d.body;

    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 3);

    d3.selectAll("." + selected_body)
      .transition()
      .duration(200)
      .style("fill", colors(selected_body))
      .attr("r", 7);
  };

  const doNotHighlight = function (event, d) {
    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", (d) => colors(d.year))
      .attr("r", 5);
  };

  // Create the container SVG.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Add the axes.
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));

  // Append a circle for each data point.
  svg
    .append("g")
    .selectAll("circle")
    .data(my_data)
    .join("circle")
    .attr("cx", (d) => x(d.odometer))
    .attr("cy", (d) => y(d.sellingprice))
    .attr("r", 3)
    .attr("fill", (d) => colors(d.year));

  return svg.node();
}


function _my_data(d3){return(
d3.csv(
  "https://raw.githubusercontent.com/pcammall/CS416/6e39695196e4819837cbcfbaa72fddcf5f8fd34c/narrative_viz/car_sales_ford.csv"
)
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["d3","my_data"], _chart);
  main.variable(observer("my_data")).define("my_data", ["d3"], _my_data);
  return main;
}
