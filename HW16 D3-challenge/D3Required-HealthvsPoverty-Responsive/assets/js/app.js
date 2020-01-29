function makeResponsive() {
  // Part 1: Preparing Responsive Plot Area
  // ==============================
  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  
  // Since the svg area is in a html container, therefore calculate area accordingly
  var svgWidth = +d3.select('.container').style('width').slice(0, -2)
  console.log(svgWidth);
  var svgHeight = Math.floor(svgWidth/windowWidth*windowHeight);

  var margin = { top: 30, right: 30, bottom: 50, left: 50  };

  var chartWidth = svgWidth - margin.left - margin.right;
  var chartHeight = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select("#scatter")
          .append("svg")
          .attr("height", svgHeight)
          .attr("width", svgWidth);

  var chartGroup = svg.append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Part 2: Loading data and Creating Plots
  // ==============================
  // Import Data
  d3.csv("./assets/data/data.csv").then(function(stateData) {

      // Step 1: Parse Data/Cast as numbers
      // ==============================
      stateData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.age = +data.age;
      });
  //       id	state	abbr	poverty	povertyMoe	age	ageMoe	income	incomeMoe	healthcare	healthcareLow	healthcareHigh	
  // obesity	obesityLow	obesityHigh	smokes	smokesLow	smokesHigh	-0.385218228
  //Healthcare vs. Poverty or Smokers vs. Age
      // console.log(stateData)

      // Step 2: Create scale functions
      // ==============================
      var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d.poverty)*0.9, d3.max(stateData, d => d.poverty)*1.1])
        .range([0, chartWidth]);

      var yLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d.healthcare)*0.8, d3.max(stateData, d => d.healthcare)*1.2])
        .range([chartHeight, 0]);

      // Step 3: Create axis functions
      // ==============================
      var bottomAxis = d3.axisBottom(xLinearScale).ticks(6);
      var leftAxis = d3.axisLeft(yLinearScale).ticks(6);

      // Step 4: Append Axes to the chart
      // ==============================
      chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

      chartGroup.append("g")
        .call(leftAxis);

      // Step 5: Create Circles
      // ==============================
      var radius = 15;
      var circlesGroup = chartGroup.append("g")
                .selectAll("circle")
                .data(stateData)
                .enter()
                .append("circle")
                .attr("cx", d => xLinearScale(d.poverty))
                .attr("cy", d => yLinearScale(d.healthcare))
                .attr("r", radius)
                .attr("class","stateCircle")
                
      // Step 6: Add Text on the top of Circles
      // =============================
      // Add the SVG Text Element to the svgContainer
      var text = chartGroup.append("g")
          .selectAll("text")
          .data(stateData)
          .enter()
          .append("text")
          .attr("class","stateText")
          .attr("x", d => xLinearScale(d.poverty))
          .attr("y", d => yLinearScale(d.healthcare)+5)
          .text(d => d.abbr);

      // Step 7: Initialize tool tip
      // ==============================
      var toolTip = d3.tip()
                .attr("class", "d3-tip")
                .offset([radius, radius*2])
                .html(function(d) {return (`${d.state}<br>${d.healthcare}%`)
                });

      // Step 8: Create tooltip in the chart
      // ==============================
      chartGroup.call(toolTip);

      // Step 9: Create event listeners to display and hide the tooltip
      // ==============================
      circlesGroup
        .on("mouseover", function(data) {
        toolTip.show(data, this);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

      // Step 10: Create Axes Labels
      // ==============================
      chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (chartHeight/2))
          .attr("dy", "1em")
          .attr("class", "aText")
          .classed("active", true)
          .text("Lack of Healthcare (%)");

      chartGroup.append("text")
          .attr("transform", `translate(${(chartWidth/2)}, ${chartHeight + margin.top})`)
          .attr("x", 0)
          .attr("y", 10)
          .attr("class", "aText")
          .classed("active", true)
          .text("In Poverty (%)");

    }).catch(function(error) {
      console.log(error);
    });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);