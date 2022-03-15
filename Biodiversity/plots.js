

function inIt(){
    // Select the dropdown menu in HTML
    var selector = d3.select("#selDataset")

    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value",sample);
        });

        // Use the 1st sample to populate the webpage at the beginning
        var firstSample = sampleNames[0];
        buildMetaData(firstSample);
        buildCharts(firstSample);
    });

  
};

// Populate webpage at beginning
inIt();


function optionChanged(newSample){
    buildMetaData(newSample);
    buildCharts(newSample);
};


function buildMetaData(sample){
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata")

        PANEL.html("");
        Object.entries(result).forEach(([key,value]) =>{
            PANEL.append("h6").text(key + " : " + value)
        });
    });
};



function buildCharts(sample){

    // Load JSON data
    d3.json("samples.json").then((data) => {
        sampleData = data.samples;
        var samplesArray = sampleData.filter(sampleObj => sampleObj.id == sample);
        var result = samplesArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var sorted_values = sample_values.slice(0,10).reverse();
        var yticks = otu_ids.slice(0,10);
        var sorted_labels = otu_labels.slice(0,10);

        // Bar Chart
        var new_yticks = [];
        yticks.forEach((tick)=>{
            new_yticks.push('OTU ' + String(tick))
        })

        var barData = {
            x: sorted_values,
            y: new_yticks.reverse(),
            type: 'bar',
            orientation: 'h',
            hovertemplate: sorted_labels.reverse()
        };

        var layout = {
            title: 'Top 10 Bacteria Cultures Found'
        };

        Plotly.newPlot("bar",[barData],layout);

        // Bubble Chart 
        var bubbleData = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: color(otu_ids)
                },
            text: otu_labels
            };
    
        var bubbleLayout = {
            title: 'Bacteria Cultures per Sample',
            xaxis: {title: 'OTU ID'},
            hovermode: 'closest'
        };

        Plotly.newPlot("bubble",[bubbleData],bubbleLayout)


        // Gauge Chart
        var sampleMetaData = data.metadata;
        var metaDataArray = sampleMetaData.filter(sampleObj => sampleObj.id == sample);
        var metaDataResult = metaDataArray[0];

        var washFreq = metaDataResult.wfreq;
        console.log(washFreq);


        var gaugeData = {
            domain: {x:[0,1],y:[0,1]},
            value: washFreq,
            title: '<br><b>Belly Button Washing Frequency </b> <br> Scrubs per Week',
            type: 'indicator',
            mode: 'gauge+number',
            gauge: {
                axis: {range: [0,10]},
                bar: {color:'black'},
                steps: [
                    {range: [0,2], color:'red'},
                    {range: [2,4], color:'orange'},
                    {range: [4,6], color:'yellow'},
                    {range: [6,8], color:'lightgreen'},
                    {range: [8,10], color:'green'},
                ]
            }


        };

        var gaugeLayout ={
            width: 400,
            height: 400,
            margin: {t: 0, b: 0 }
        };

        Plotly.newPlot("gauge",[gaugeData],gaugeLayout)

    });


};


function color(ids){

    colors = []

    ids.forEach((id) => {

    if (id > 2500){
        colors.push('rgb(93, 164, 214)');
    }
    else if(id > 1500){
        colors.push('rgb(255, 144, 14)');
    }
    else if(id > 1000){
        colors.push('rgb(44, 160, 101)');
    }
    else {
        colors.push('rgb(255, 65, 54)');
    }
});

    return colors

};


