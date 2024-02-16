// Function to build metadata for the demographic panel
function buildMetadata(sample) {
    // Use D3 to fetch the metadata from the JSON file
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      let metadata = data.metadata;
      // Filter for the selected sample's metadata
      let selectedMetadata = metadata.filter(metadataObj => metadataObj.id == sample)[0];
  
      // Select the panel and clear existing content
      let PANEL = d3.select("#sample-metadata");
      PANEL.html("");
  
      // Append metadata to the panel
      Object.entries(selectedMetadata).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }
  
  // Function to build the charts (bar and bubble)
  function buildCharts(sample) {
    // Fetch the sample data
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      let samples = data.samples;
      let selectedSample = samples.filter(sampleObj => sampleObj.id == sample)[0];
  
      // Destructure the data for plotting
      let {otu_ids, otu_labels, sample_values} = selectedSample;
  
      // Bubble Chart
      let bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30}
      };
      let bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: 'markers',
          marker: {
            color: otu_ids,
            size: sample_values,
            colorscale: "Earth" // Changing color scheme
          }
        }
      ];
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
      // Bar Chart
      let barData = [
        {
          y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
          marker: {
            color: 'rgba(58,200,225,.5)', // Changed color
            line: {
              color: 'rgba(58,200,225,1)',
              width: 1
            }
          }
        }
      ];
      let barLayout = {
        title: "Top 10 Bacterial Cultures Found",
        margin: { t: 30, l: 150 }
      };
      Plotly.newPlot("bar", barData, barLayout);
    });
  }
  
  // Initialize function to populate the dropdown and display initial data
  function init() {
    // Reference to the dropdown
    let selector = d3.select("#selDataset");
  
    // Populate dropdown with sample names
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      let sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector.append("option").text(sample).property("value", sample);
      });
  
      // Display the data of the first sample
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Function to update data upon new sample selection
  function optionChanged(newSample) {
    // Update charts and metadata with the new sample
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();
  