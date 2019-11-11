function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
 
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  const meta = d3.select("#sample-metadata");
  const selector = d3.select("#selDataset");
  const inputText = selector.property("value")
    // Use `.html("") to clear any existing metadata
  meta.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    d3.json("/metadata/" + inputText).then((dataset) => {
      const entries = Object.entries(dataset);
      entries.forEach((data) => {
        meta
          .append("h6")
          .text(data[0] + ": " + data[1])
      });
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

async function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  const selector = d3.select("#selDataset");
  const inputText = selector.property("value");

  const JSONdata = await d3.json("/samples/" + inputText);
  const guagedata = await d3.json("/metadata/" + inputText);


      const datalabels = JSONdata.otu_ids;
      const datavalue = JSONdata.sample_values;
      const datatext = JSONdata.otu_labels;

      const pielabels = datalabels.slice(0,9);
      const pievalues = datavalue.slice(0, 9);
      const piehover = datatext.slice(0,9);

      const guagevalues = guagedata.WFREQ;

      const colordata = datalabels.map(Number);

      const trace1 = {
        labels: pielabels,
        values: pievalues,
        hovertext: piehover,
        type: 'pie'
      };

      const trace2 = {
        x: datalabels,
        y: datavalue,
        mode: "markers",
        text: datatext,
        marker: {
          size: datavalue,
          color: colordata,
          colorscale: "Rainbow",
          cmin: 0,
          cmax: 2
        }
      };

      const trace3 = {
        domain: { x: [0, 1], y: [0, 1] },
		    value: guagevalues,
        title: { text:"Belly Button Washing Frequency", font: {size:24}},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "#4CB1F7", thickness: 0.25 },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0.0, 0.5], color: '#464254' },
            { range: [0.5, 1.5], color: '#574B70' },
            { range: [1.5, 2.5], color: '#6A518F' },
            { range: [2.5, 3.5], color: '#8055B1' },
            { range: [3.5, 4.5], color: '#9A56D5' },
            { range: [4.5, 5.5], color: '#926BDC' },
            { range: [5.5, 6.5], color: '#9080E3' },
            { range: [6.5, 7.5], color: '#9698EA' },
            { range: [7.5, 8.5], color: '#ACBAEF' },
            { range: [8.5, 9.5], color: '#C3D7F5' },
            { range: [9.5, 10.5], color: '#DBECF9' }
          ]}
      }
    
      const piedata = [trace1];
      const bubbledata = [trace2];
      const gdata = [trace3];
    
      const layout = {
        title: "Pie Chart"
      };

      const layout2 = {
        title: "Bubble Chart"
      };

      const layout3 = {
      };
      
    
      Plotly.newPlot("pie", piedata, layout);    
      Plotly.newPlot("bubble", bubbledata, layout2);
      Plotly.newPlot("gauge", gdata, layout3);
  };


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

function makeColorArray(x) {
  var out = new Array(x);
  for(var i = 0; i < x; i++) {
    out[i] = i;
  }
  return out;
}

// Initialize the dashboard
init();
