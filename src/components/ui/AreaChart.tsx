// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";
// import { Box } from "@chakra-ui/react";

// const MyChart: React.FC = () => {
//   const chartRef = useRef<SVGSVGElement>(null);

//   useEffect(() => {
//     // set the dimensions and margins of the graph
//     const margin = { top: 10, right: 30, bottom: 30, left: 60 };
//     const width = 460 - margin.left - margin.right;
//     const height = 400 - margin.top - margin.bottom;

//     // append the svg object to the body of the page
//     const svg = d3
//       .select(chartRef.current)
//       .append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform", `translate(${margin.left},${margin.top})`);

//     // Read the data
//     d3.csv(
//       "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv"
//     )
//       .then((data) => {
//         // Convert data types
//         const parseDate = d3.timeParse("%Y-%m-%d");
//         data.forEach((d) => {
//           d.date = parseDate(d.date);
//           d.value = +d.value;
//         });

//         // Add X axis --> it is a date format
//         const x = d3
//           .scaleTime()
//           .domain(d3.extent(data, (d) => d.date) as [Date, Date])
//           .range([0, width]);
//         const xAxis = svg
//           .append("g")
//           .attr("transform", `translate(0, ${height})`)
//           .call(d3.axisBottom(x));

//         // Add Y axis
//         const y = d3
//           .scaleLinear()
//           .domain([0, d3.max(data, (d) => d.value)!])
//           .range([height, 0]);
//         const yAxis = svg.append("g").call(d3.axisLeft(y));

//         // Add a clipPath: everything out of this area won't be drawn.
//         const clip = svg
//           .append("defs")
//           .append("clipPath")
//           .attr("id", "clip")
//           .append("rect")
//           .attr("width", width)
//           .attr("height", height)
//           .attr("x", 0)
//           .attr("y", 0);

//         // Add brushing
//         const brush = d3
//           .brushX()
//           .extent([
//             [0, 0],
//             [width, height],
//           ])
//           .on("end", updateChart);

//         // Create the area variable: where both the area and the brush take place
//         const area = svg.append("g").attr("clip-path", "url(#clip)");

//         // Create an area generator
//         const areaGenerator = d3
//           .area()
//           .x((d) => x(d.date))
//           .y0(y(0))
//           .y1((d) => y(d.value));

//         // Add the area
//         area
//           .append("path")
//           .datum(data)
//           .attr("class", "myArea")
//           .attr("fill", "#4b78d1")
//           .attr("fill-opacity", 0.3)
//           .attr("stroke", "black")
//           .attr("stroke-width", 1)
//           .attr("d", areaGenerator);

//         // Add the brushing
//         area.append("g").attr("class", "brush").call(brush);

//         // A function that sets idleTimeout to null
//         let idleTimeout: NodeJS.Timeout;
//         function idled() {
//           idleTimeout = null;
//         }

//         // A function that updates the chart for given boundaries
//         function updateChart(event: d3.D3BrushEvent<unknown>) {
//           // What are the selected boundaries?
//           const extent = event.selection;

//           // If no selection, back to the initial coordinate. Otherwise, update X axis domain
//           if (!extent) {
//             if (!idleTimeout) {
//               return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
//             }
//             x.domain(d3.extent(data, (d) => d.date) as [Date, Date]);
//           } else {
//             x.domain([
//               x.invert(extent[0]) as Date,
//               x.invert(extent[1]) as Date,
//             ]);
//             area.select<SVGGElement>(".brush").call(brush.move, null); // This removes the grey brush area as soon as the selection has been done
//           }

//           // Update axis and area position
//           xAxis.transition().duration(1000).call(d3.axisBottom(x));
//           area
//             .select<SVGPathElement>(".myArea")
//             .transition()
//             .duration(1000)
//             .attr("d", areaGenerator);
//         }

//         // If user double click, reinitialize the chart
//         svg.on("dblclick", () => {
//           x.domain(d3.extent(data, (d) => d.date) as [Date, Date]);
//           xAxis.transition().call(d3.axisBottom(x));
//           area
//             .select<SVGPathElement>(".myArea")
//             .transition()
//             .attr("d", areaGenerator);
//         });
//       })
//       .catch((error) => {
//         console.error("Error loading data:", error);
//       });

//     // Cleanup
//     return () => {
//       svg.remove();
//     };
//   }, []);

//   return <Box id="my_dataviz" ref={chartRef}></Box>;
// };

// export default MyChart;
