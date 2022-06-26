const buildCharts = (selectedId, data) => {
    console.log(selectedId);
    console.log(data);

    /////////////////////////////////////////////////////////////////////////
    // Demographic Info
    /////////////////////////////////////////////////////////////////////////


     // Filter Metadata for selectedId
    const metadata = data.metadata.filter(item=> (item.id == selectedId));
     
    const panelDisplay = d3.select("#sample-metadata");
    panelDisplay.html("");
    Object.entries(metadata[0]).forEach(itemData=> 
    {
        panelDisplay.append("p").text(`${itemData[0]}: ${itemData[1]}`)
    });

    /////////////////////////////////////////////////////////////////////////
    // BAR CHART
    /////////////////////////////////////////////////////////////////////////
    
    // Filter sample array data for the selectedId
    const sample = data.samples.filter(item => parseInt(item.id) == selectedId);
        
    // Slice first 10 sample values
    const sampleValues = sample[0].sample_values.slice(0,10);
    sampleValues.reverse();
    const otuIds = sample[0].otu_ids.slice(0,10);
    otuIds.reverse();
    const otuLabels = sample[0].otu_labels;
    otuLabels.reverse();
 
    // Y axis of bar chart, Adding OTU to each id
    const yAxis = otuIds.map(item => 'OTU' + " " + item);
    
    // Define trace object, color and orientation
    const trace = {
        y: yAxis,
        x: sampleValues,
        type: 'bar',
        orientation: "h",
        text:  otuLabels,
        marker: {
            color: 'rgb(160, 78, 226)',
            line: {
                width: 3
            }
        }
    },
    layout = {
        title: '<b>First 10 Operational Taxonomic Units (OTU)</b>',
        xaxis: {title: 'Collected Samples'},
        yaxis: {title: 'OTU ID'}
    };
 
    // Plot using Plotly
    Plotly.newPlot('bar', [trace], layout,  {responsive: true});    
   
    /////////////////////////////////////////////////////////////////////////
    // BUBBLE CHART
    /////////////////////////////////////////////////////////////////////////
 
    const sampleValuesBubble = sample[0].sample_values;
    const otuIdsBubble = sample[0].otu_ids;
 
    // Define the layout and trace object, edit color and orientation
    const trace1 = {
        x: otuIdsBubble,
        y: sampleValuesBubble,
        mode: 'markers',
        marker: {
            color: otuIdsBubble,      
            size: sampleValuesBubble
        }
    },
 
    layout1 = {
        title: '<b>Bubble Chart OTU ID/Number Collected Samples</b>',
        xaxis: {title: 'OTU ID'},
        yaxis: {title: 'Collected Samples'},
        showlegend: false,
        height: 800,
        width: 1300
    };
    
    // Plot using Plotly
    Plotly.newPlot('bubble', [trace1], layout1);

      // BONUS: GAUGE CHART

    /////////////////////////////////////////////////////////////////////////
    // Gauge Chart - Washing frequency
    /////////////////////////////////////////////////////////////////////////

    const guageDisplay = d3.select("#gauge");
    guageDisplay.html(""); 
    const washFrequency = metadata[0].wfreq;
 
    const guageData = [
    {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFrequency,
        title: { text: "<b>Belly Button Washing Frequency </b><br> (Scrubs Per Week)" },
        type: "indicator",
        mode: "gauge+number",     
        gauge: {
            axis: { range: [0,9] },
            bar: { color: "#eeeeee" },
            steps: [
                { range: [0, 1], color: "#f5f5f5" },
                { range: [1, 2], color: "#9fa4a9" },
                { range: [2, 3], color: "#7765a9" },
                { range: [3, 4], color: "#a04fe2" },
                { range: [4, 5], color: "#51217f" },
                { range: [5, 6], color: "#38125b" },
                { range: [6, 7], color: "#3a0c66" },
                { range: [7, 8], color: "#1d0434" },
                { range: [8, 9], color: "#0c0115" }    
            ],
            threshold: {
                value: washFrequency
            }
        }
    }
    ]; 
    const gaugeLayout = {  width: 600, 
                           height: 400, 
                           margin: { t: 0, b: 0 }, 
                        };
 
    // Plot using Plotly
    Plotly.newPlot('gauge', guageData, gaugeLayout); 
}


let allData = null;

d3.json('samples.json').then((data) => {
    //console.log(data.names);
    allData = data;
    let dropdown = d3.select('#selDataset');
    data.names.forEach((id) => {
        dropdown.append('option').text(id).property('value', id);
    })
    buildCharts(data.names[0], allData);
})

const optionChanged = (selectedId) => {
    //console.log(selected);
    buildCharts(selectedId, allData);
}
