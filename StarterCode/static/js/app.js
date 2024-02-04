// Create a variable for the URL
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Use D3 library to read the data in and print it to my console
d3.json(url).then(function(data) {
    // Printed the data to my console so that I could review it
    console.log(data);
    // Set my variable for the dropdown and to hold the sample data I'm looking for
    let dropdownMenu = d3.select("#selDataset");
    let samples = data.samples;
    
    // Loop through the different samples adding the options to the dropdown menu
    samples.forEach(sample => {
        dropdownMenu.append("option").text(sample.id).property("value", sample.id);
    });

    // This function updates the charts when the dd selection changes and retrieves selected sample based on the id
    function optionChanged(selectedSampleID) {
        let selectedSample = data.samples.find(sample => sample.id == selectedSampleID);
        barChart(selectedSample);
        bubbleChart(selectedSample);
        updateMetadata(selectedSampleID);
    }

    // This function takes the sample that was selected and created a bar chart based off the data
    function barChart(sample) {
        let trace1 = {
            // The data was already organized in descending order. Used slice to pull the top 10
            // Used reverse because the data was showing in reversed format
            x: sample.sample_values.slice(0,10).reverse(),
            y: sample.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
            text: sample.otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'
        };

        let data = [trace1];

        Plotly.newPlot("bar", data);

    }

    // This function takes the sample selected and creates a bubble chart based on the below data
    function bubbleChart(sample) {
        let trace2 = {
            // This code was taken from Plotly.com to figure out everything needed
            x: sample.otu_ids,
            y: sample.sample_values, 
            text: sample.otu_labels,
            mode: 'markers', 
            marker: {
                size: sample.sample_values, 
                color: sample.otu_ids, 
                colorscale: 'YlGnBu'
            }
        };
       let layout = {
        xaxis: {title: "OTU ID"}
       };
       let data2 = [trace2];

       Plotly.newPlot("bubble", data2, layout);
    }
    // This function updates the metadata table when the new sample is selected.
    function updateMetadata(selectedSampleID) {
        // Finding the metadata of the sample based on the selected sample
        let selectedMetadata = data.metadata.find(metadata => metadata.id == parseInt(selectedSampleID));
        // This clears the data so that we don't keep adding results to the chart
        d3.select("#sample-metadata").html("");
        // This iterates over each key/value pair in the sample's metadata
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            // This appends a paragraph element to the metadata with the key value pair
            d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
        });
    }
    // Adds an event listener to the dd listening for the change event. When dd changes calls the optionChanged function
    d3.select("#selDataset").on("change", function () {
        let selectedSampleId = d3.select("#selDataset").property("value");
        optionChanged(selectedSampleId);
    });

    // Set my default numbers for my 3 charts on the page
    barChart(samples[0]);
    bubbleChart(samples[0]);
    updateMetadata(samples[0].id);
});
