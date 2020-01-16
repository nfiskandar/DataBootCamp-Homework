// from data.js
var tableData = data;

var button = d3.select("#filter-btn");
var tbody = d3.select("tbody");

//Define function to display table
function displayTable(datafortable) {
    datafortable.forEach((tableData) => {
        var row = tbody.append("tr");
        Object.entries(tableData).forEach(([key, value]) => {
            var cell = row.append("td");
            cell.text(value);
        });
    })
};

// Display whole data first
displayTable(tableData);

button.on("click", function() {
    var filteredData = tableData;

    // Select the input element and get the raw HTML node
    var inputDate = d3.select("#datetime").property("value");
    var inputCity = d3.select("#city").property("value").toLowerCase();
    var inputState = d3.select("#state").property("value").toLowerCase();
    var inputCountry = d3.select("#country").property("value").toLowerCase();
    var inputShape = d3.select("#shape").property("value").toLowerCase();

    if (inputDate !== "") {
        var filtered = "Yes";
        filteredData = filteredData.filter(record => record.datetime === inputDate);
    }
    if (inputCity !== "") {
        var filtered = "Yes";
        filteredData = filteredData.filter(record => record.city === inputCity);
    }
    if (inputState !== "") {
        var filtered = "Yes"
        filteredData = filteredData.filter(record => record.state === inputState);
    }
    if (inputCountry !== "") {
        var filtered = "Yes"
        filteredData = filteredData.filter(record => record.country === inputCountry);
    }
    if (inputShape !== "") {
        var filtered = "Yes"
        filteredData = filteredData.filter(record => record.shape === inputShape);
    }

    tbody.html("");

    if (filteredData.length === 0) {
        var nodata = tbody.append("h4");
        nodata.text("No matching data!");       
    }
    else if (filtered === "Yes") {
        console.log(filteredData.length);
        displayTable(filteredData);
    }
    else {
        console.log(tableData.length);
        displayTable(tableData);
    };    
});