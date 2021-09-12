function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var allsamples= data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    //  5. Create a variable that holds the first sample in the array.
    // #4 and #5 can be combined as below
    var resultsample= allsamples.filter(sampleobj => sampleobj.id== sample)[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var resultotuids= resultsample.otu_ids
    var resultoutlabel= resultsample.otu_labels
    var resultvalues= resultsample.sample_values

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
      //https://stackoverflow.com/questions/32937181/javascript-es6-map-multiple-arrays
    var resulttop10= resultotuids.map((x,i)=> ["OTU "+ x, resultvalues[i]]).slice(0,10).reverse()
    var xvalues= resulttop10.map((x,y)=>x[1])
    var yvalues= resulttop10.map((x,y)=>x[0])
    var yticks= resulttop10.map((x,y)=>x[0])

    // 8. Create the trace for the bar chart. 
    var barData = {x:xvalues, 
    y:yvalues,
    type: "bar",
    orientation: "h"
    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      xaxis:{title:"Qty of Bacteria Found"},
      yaxis:{title: "Bacteria IDs", ticktext: yticks}
    };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", [barData], barLayout)

/////////////// Deliverable 2/////
    // 1. Create the trace for the bubble chart.
    var bubbleopacity= [resultotuids.map(x => "0.5" )]
    var bubblecolor= resultotuids
    var hovertext= resultotuids.map((x,i)=> String(["(OTU "+ x +", " + resultvalues[i] + ")" + "<br>" + resultoutlabel[i]]))
  
    var bubbleData = [{x:resultotuids, y:resultvalues,text: hovertext, mode: "markers", marker:{
      size: resultvalues, color:bubblecolor, colorscale:"Earth"}
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis:{title:"OTU ID"},
      yaxis:{title: "QTY of Bacteria",
      showlegend: false}
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    /////////deliverable 3/////////
    var washfreq= parseFloat(data.metadata.filter(sampleobj => sampleobj.id== sample)[0].wfreq)
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {domain: { x: [0, 1], y: [0, 1] },
      value: washfreq,
      title: { text: "<b>Belly Button Washington Frequency</b> <br> Scrubs per Week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10]},
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" },
        ],
        threshold: {
          line: { color: "black", width: 4 },
          thickness: 0.75,
          value: washfreq
        }
      }
    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {margin: { t: 0, b: 0 }
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}

