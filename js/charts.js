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
    console.log(data)
    // 3. Create a variable that holds the samples array. 
    var arraySample = data.samples;
    var metaData = data.metadata;
    console.log(arraySample);
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var arrayResult = arraySample.filter(sampleObj => sampleObj.id == sample);
    console.log(arrayResult);
    
    // 4.5 Create a variable that filters the metadata array for the object with the desired sample number.
    var metaFilters = metaData.filter(sampleObj => sampleObj.id == sample);
    console.log(metaFilters);
    
    // 5. Create a variable that holds the first sample in the array.
    var sampleOne = arrayResult[0];
    console.log(sampleOne);
    
    // 5.5 Create a variable that holds the first sample in the metadata array.
    var firstMeta = metaFilters[0]
    console.log(firstMeta);
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    //var otuIds = sampleOne.otu_ids;
    var ID = sampleOne.otu_ids;
    var otuLabels = sampleOne.otu_labels;
    var sampleValues = sampleOne.sample_values;
    
    // 6.5. Create a variable that holds the washing frequency.
    var washFreq = firstMeta.wfreq;
    var washFreqFloat = parseFloat(washFreq);
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // var yticks = otuIds.slice(0,10).map(otu_Id => `OTU ${otu_Id}`).reverse();
    var yticks = ID.slice(0,10).map(otu_Id => `OTU ${otu_Id}`).reverse();

    // 8. Create the trace for the bar chart. 
    // x values are sample_values(descending order)
    // y values are out_ids(descending order)
    // hover text are otu_lables(descending order)
    var barData = [
      { 
        x: sampleValues.slice(0,10).reverse(),
        y: yticks,
        text: otuLabels.slice(0,10).reverse(),
        type: "bar",
        marker: {color: 'rgb(80,22,103)'},
        orientation: "h"
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      margin: {
        l:100,
        r:100,
        t:100,
        b:100,
      }
    };
  
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    
    // 11. Create the trace for the bubble chart.
    //x axis is otu_ids.
    //y axis is sample_values.
    //sample_values as marker size.
    //otu_ids as marker colors.
    //otu_labels as hover-text values.
    var bubbleData = [
      {
        x: ID,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
        size:sampleValues,
        color: ['rgb(240, 255, 255)', 'rgb(0, 255, 255)',  'rgb(127, 255, 212)', 'rgb(230, 230, 250)', 'rgb(147, 112, 219)', 'rgb(128, 128, 128)', 'rgb(30, 144, 255)', 'rgb(0, 191, 255)',
                'rgb(148, 0, 211)','rgb(0, 206, 209)','rgb(72, 61, 139)','rgb(139, 0, 139)','rgb(255, 248, 220)','rgb(100, 149, 237)','rgb(138, 43, 226)','rgb(245, 245, 220)','rgb(240, 248, 255)',
                'rgb(0, 255, 127)','rgb(46, 139, 87)','rgb(102, 51, 153)','rgb(65, 105, 225)','rgb(0, 0, 125)'],
        //colorscale: ['rgb(0, 255, 255)', 'rgb(138, 43, 226)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)']
      }
    }
  ];   
  

    // 12. Create the layout for the bubble chart.
    var bubbleLayout = {
    title: ",<b>Bacteria Cultures Per Sample</b>",
    xaxis: {title: "OTU ID"}
  };

    // 13. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout,);
    
    // Guage  graph

    // 16 Create the trace for the gauge chart.
    var gaugeData = [
      {
        value: washFreqFloat, 
        type: "indicator",
        mode: "gauge+number",
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
        gauge: {
          axis: {
            range: [null,10],
            tickwidth: 1,
            tickcolor: "black"
        },
        bar: {color: "indigo"},
        steps: [
          {range:[0,2], color: "Azure"},
          {range:[2,4], color: "Aqua"},
          {range:[4,6], color: "Aquamarine"},
          {range:[6,8], color: "lavender"},
          {range:[8,10], color: "mediumPurple"}
          ]
        },
      } 
    ];
    
    // 17. Create the layout for the gauge chart.
    var gaugeLayout = { 
     margin: {t:10,b:0,l:15,r:25}
    };

    // 18. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData,gaugeLayout,);
  
  });
}