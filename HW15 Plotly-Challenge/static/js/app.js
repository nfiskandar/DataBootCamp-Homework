// Part 1: Building the dropdown menu data
//---------------------------------------------------------------------------

var subjectID = d3.select("#selDataset")

// Defining the value of drop down menu from list of names
function BuildDropDown(){
  d3.json("samples.json").then((importedData) => {
    var names = importedData.names;
    names.forEach(name=>{
      var row = subjectID.append("option");
        row.text(name);
        row.attr("value",name);
    });
  });
};
//Calling BuildDropDown function for chart selection
BuildDropDown();

// Part 2: Defining internal function to display metadata in rows
//---------------------------------------------------------------------------
var meta = d3.select("#sample-metadata");
function displayData(dataforDisplay) {
  dataforDisplay.forEach((datadisplayed) => {
    Object.entries(datadisplayed).forEach(([key, value]) => {
      var row = meta.append("p").text(`${key}: ${value}`);
        });
    })
};

// Part 3: Defining internal function to generate all Plots including metadata
//---------------------------------------------------------------------------

function BuildPlots(filterID){
  // Use D3 fetch to read the JSON file
  // The data from the JSON file is arbitrarily named importedData as the argument
  d3.json("samples.json").then((importedData) => {
      // Grabbing samples data
      var datasamples = importedData.samples;
      // console.log(datasamples)

      // Build internal function to be used inside coding
      function filterData(importedData) {
        return importedData.id === filterID;
      };

      function filterIntData(importedData) {
        return importedData.id === parseInt(filterID);
      };

      // 2. Use filter() to pass the function as its argument
      var datafromInput = datasamples.filter(filterData);
      // console.log(datafromInput)

      // Sort the data array using the sample_values value
      datafromInput.sort(function(a, b) {
        return parseFloat(b.sample_values) - parseFloat(a.sample_values);
      });
  
      datafromInput = datafromInput[0];
      console.log(datafromInput);

      // Selecting first 10 biggest data and reverse it to display from biggest
      var sliceCount = 10;
      var sliced_otu_ids = datafromInput.otu_ids.slice(0, sliceCount).reverse();
 
      // Generate an array for string for y axis of bar chart
      var stringOtu_ids = sliced_otu_ids.map(function(item) {
          return "OTU "+item;
        });   
  
      //Creating data for Barchart
      var trace1 = {
        x: datafromInput.sample_values.slice(0, sliceCount).reverse(),
        y: stringOtu_ids,
        text: datafromInput.otu_labels.slice(0, sliceCount).reverse(),
        name: "TopOTU",
        type: "bar",
        orientation: "h"
      };
  
      //Plot Barchart 
      var BarData = [trace1];
      Plotly.newPlot("bar", BarData);
  
      //Creating data for Bubble Chart
      var trace2 = {
          x: datafromInput.otu_ids,
          y: datafromInput.sample_values,
          text: datafromInput.otu_labels,
          mode: 'markers',
          marker: {
            color: datafromInput.otu_ids,
            size: datafromInput.sample_values
          }
      };
       
      //Plot Bubble Chart 
      var BubbleData = [trace2];
      Plotly.newPlot('bubble', BubbleData);
  
      // Grabbing metadata and filtering based on selection filterID
      var metadata = importedData.metadata;
      var selectedMetadata = metadata.filter(filterIntData);

      // Makesure it is empty then displaying key and value data of metadata
      meta.html("");
      displayData(selectedMetadata);  

      // Grabbing the washing frequency data 
      var freq = selectedMetadata[0].wfreq;
      //Creating data for Gauge
      var trace3 = {
            domain: { x: [0, 1], y: [0, 1] },
            value: freq,
            title: { text: "Washing Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: { axis: { range: [null, 9] }  }
        };
      var Gaugedata = [trace3];
  
      //Plot Gauge Chart 
      Plotly.newPlot('gauge', Gaugedata);
  
    });
  };    

// Part 4: Displaying Initial Plots based on first value for names 
//---------------------------------------------------------------------------
// Defining init function for first display 
function init(){
  var filterID = "940";
  BuildPlots(filterID);
}

//Calling init function for first display
init();

// Part 5: Handling the change when different Test Subject ID is selected
//---------------------------------------------------------------------------
// Recognizing the change on Test Subject ID and run optionChanged function
d3.select("#selDataset").on("change", optionChanged);

// Definiting optionChanged function to generate new plot when different filterID selected
function optionChanged(filterID) {
    console.log(filterID);
    BuildPlots(filterID);
};

