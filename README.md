# belly-button-challenge
## Please see below for details about the code and it's source(s)
### Overlapping Code used for all 3 charts
- To do this I had to first create the connection with the URL using d3
- I then set variables for my dropdown menu and array of samples
- Then we had to iterate through each sample adding the options to the dropdown menu.  
- Created a function that updates the chart info when a new id was selected from the dropdown menu. This worked with the event listener to changed the info to match the ID. 
    - **I struggled with this part of the assignment initially and used ChatGPT to help me get these results**

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
### Bar Chart
- The bar chart itself was similar to what we had done in class. We went over sorting and slicing so I was able to get most of the code on my own for this one. 
- I created a variable for the bar chart so that I could call it later with my event listener when I needed to change the sample
    - **I did get some help from ChatGPT on cleaning up the code for x and y values so that I could slice what I needed and then reverse the results because they weren't showing in the proper order**

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
### Bubble Chart
- The bubble chart was pretty straightforward for the most part. I just had to plug in the values of what we wanted to plot. 
- I created a variable for the bubble chart as well and called it later on in my code to use with the event listener.
    - **I used the Plotly documentation for information about how/what we could plot on a bubble chart. That helped me find the colorscale and different elements I needed to set up**

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


### Metadata Chart
- This one was a bit difficult for me to get. ChatGPT helped me with a lot of the code for this one. 
- I created a function to call the metadata information
    - Within that function I first set a variable to call the data for each sample where it matched the selectedSampleID
    - I then put in code to clear the results of table as it kept adding the metadata to the table as I changed the dd selection. 
    - Finally I iterated over each of the key/value pairs of the metadata and added the information to the chart so that it would display the desired information
        - **ChatGPT helped with a lot of the code for this part of the assignment. I struggled a lot with this one**

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


### Event Listener Code
- Added an event listener so that when the drop down changed the charts would also update with the corresponding information. 
- Also used an optionChanged function that would update the results of the charts with the given id from what was selected in the dropdown. The worked with the event listener to change the results of the charts when a new id was selected.
    - **Code for the event listener was taken from activities performed in class. Also, I used ChatGPT to fill in some of the gaps in my code when I couldn't get it to work properly.**

            // Adds an event listener to the dd listening for the change event. When dd changes calls the optionChanged function
            d3.select("#selDataset").on("change", function () {
                let selectedSampleId = d3.select("#selDataset").property("value");
                optionChanged(selectedSampleId);

