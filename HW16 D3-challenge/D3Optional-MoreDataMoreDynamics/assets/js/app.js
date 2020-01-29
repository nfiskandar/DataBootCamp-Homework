  // Part 1: Preparing Plot Area
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
  // console.log(svgWidth);
  var svgHeight = Math.floor(svgWidth/windowWidth*windowHeight);

  var margin = {
    top: 20, bottom: 120,
    right: 40, left: 120
  };

  var chartWidth = svgWidth - margin.left - margin.right;
  var chartHeight = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select("#scatter")
          .append("svg")
          .attr("height", svgHeight)
          .attr("width", svgWidth);

  var chartGroup = svg.append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Part 2: Building internal functions
  // ==============================
  
// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.9,
      d3.max(stateData, d => d[chosenXAxis]) * 1.1])
    .range([0, chartWidth]);
  return xLinearScale;
} // closing xScale function

function yScale(stateData, chosenXAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8, 
      d3.max(stateData, d => d[chosenYAxis])*1.2])
    .range([chartHeight, 0]);
  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}// closing renderAxes function

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}// closing renderAxes function

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
} // closing renderCircles function

function updateInnerText(stateText, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  stateText.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => (newYScale(d[chosenYAxis]))+5)
    .text(d => d.abbr);
    return stateText;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>Obesity: ${d.obesity}`)
      // return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
  });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
  return circlesGroup;
} // closing updateToolTip function

// function used for update label into active
function updateXAxis(value) {
    if (value === "age" || value === "income" || value === "poverty") {
      // replaces chosenXAxis with value
      chosenXAxis = value;
    }
    return chosenXAxis;
};
function updateYAxis(value) {
    if (value === "obesity" || value === "healthcare" || value === "smokes") {
      chosenYAxis = value;
    }
    return chosenYAxis;
};

// function used for update label into active
function setActive(Label) {
  Label
    .classed("active", true)
    .classed("inactive", false);
    return Label;
}
// function used for update label into inactive
function setInactive(Label) {
  Label
    .classed("active", false)
    .classed("inactive", true);
    return Label;
}

// function updateCircleText(chosenXAxis, chosenYAxis)

  // Part 3: Loading data 
  // ==============================
  // Import Data
  d3.csv("./assets/data/data.csv").then(function(stateData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
      data.smokes = +data.smokes;
      data.age = +data.age
      data.obesity = +data.obesity
      data.income = +data.income;
    });
  console.log(stateData)

  // Part 4: Generating Initial Plots
  // ==============================
  // xLinearScale function above csv import
  var xLinearScale = xScale(stateData, chosenXAxis);

  // yLinearScale function above csv import
  var yLinearScale = yScale(stateData, chosenYAxis);
    
  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);
    console.log("y axis")
    
  // append initial circles
  var radius = 15;
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", radius)
    .attr("class","stateCircle");

  // Create group for multiple x and y axes labels
  var labelsGroup = chartGroup.append("g")
    // .attr("transform", `translate(${chartWidth/2}, ${chartHeight + 20})`);
  
  // append x-axis Labels
  var povertyLabel = labelsGroup.append("text")
    .attr("transform", `translate(${chartWidth/2}, ${chartHeight + 20})`)
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("transform", `translate(${chartWidth/2}, ${chartHeight + 20})`)
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age(Median)");

  var incomeLabel = labelsGroup.append("text")
    .attr("transform", `translate(${chartWidth/2}, ${chartHeight + 20})`)
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // append y axis Labels
  var obesityLabel = labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive",true)
    .text("Obesity (%)");

  var smokesLabel = labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 20 )
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("value", "smokes") 
    .classed("inactive", true)
    .text("Smokes (%)");

  var healthLabel = labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare") 
    .classed("active", true)
    .text("Lack of Healthcare (%)");
  
  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  var stateText = chartGroup.append("g")
  .selectAll("text")
  .data(stateData)
  .enter()
  .append("text")
  .attr("class","stateText")
  .attr("x", d => xLinearScale(d[chosenXAxis]))
  .attr("y", d => yLinearScale(d[chosenYAxis])+5)
  .text(d => d.abbr);

  // Part 4: Update data when Axis is changed 
  // ========================================

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      updateXAxis(value);
      console.log(chosenXAxis);
      
      updateYAxis(value);
      console.log(chosenYAxis);

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(stateData, chosenXAxis);
      yLinearScale = yScale(stateData, chosenYAxis);

      // updates x axis with transition
      xAxis = renderAxes(xLinearScale, xAxis);
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
      stateText = updateInnerText(stateText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenXAxis === "age") {
            setActive(ageLabel);
            setInactive(povertyLabel);
            setInactive(incomeLabel);
            }
      else if (chosenXAxis === "income"){
            setActive(incomeLabel);
            setInactive(ageLabel);
            setInactive(povertyLabel);
          }
      else {
            setActive(povertyLabel);
            setInactive(ageLabel);
            setInactive(incomeLabel);
            } // closing else

      // changes classes to change bold text
      if (chosenYAxis === "healthcare") {
            setActive(healthLabel);
            setInactive(smokesLabel);
            setInactive(obesityLabel);
            }
      else if (chosenYAxis === "obesity"){
            setActive(obesityLabel);
            setInactive(smokesLabel);
            setInactive(healthLabel);
          }
      else {
            setActive(smokesLabel);
            setInactive(healthLabel);
            setInactive(obesityLabel);
      } // closing else

    }); // closing on"Click"

  }).catch(function(error) {
  console.log(error); // closing d3.csv
})