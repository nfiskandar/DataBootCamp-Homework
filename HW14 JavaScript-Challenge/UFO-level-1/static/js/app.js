// from data.js
var tableData = data;

// YOUR CODE HERE!
var button = d3.select("#filter-btn");

// Get a reference to the table body
var tbody = d3.select("tbody");

function displayTable(datafortable) {
    datafortable.forEach((tableData) => {
        var row = tbody.append("tr");
        Object.entries(tableData).forEach(([key, value]) => {
        var cell = row.append("td");
        cell.text(value);
        });
    })
};

displayTable(data);

button.on("click", function() {

    // Select the input element and get the raw HTML node
    var inputValue = d3.select("#datetime").property("value");
  
    console.log(inputValue);
    console.log(d3.event.target.value);

    if (inputValue !== "") {
       
        var filteredData = tableData.filter(date => date.datetime === inputValue);
        console.log(filteredData);
    
        // remove any children from the list to
        tbody.html("");
        displayTable(filteredData);
    }
    else {
        displayTable(data);
    }

});