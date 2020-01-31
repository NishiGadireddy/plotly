function buildCharts(sample) {
  d3.json("samples.json").then(data => {
      // the variables
      var alldata = data.samples;
      var selectionArray = alldata.filter(object => object.id == sample);
      var selectionObj = selectionArray[0];
      var sample_values = selectionObj.sample_values;
      var otu_ids = selectionObj.otu_ids;
      var otu_labels = selectionObj.otu_labels;

      // Hz Bar Chart
      var yLabels = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
      var hzBarData = [{
          type: 'bar',
          x: sample_values.slice(0, 10).reverse(),
          y: yLabels,
          text: otu_labels.slice(0, 10).reverse(),
          marker: {
            color: "rgb(188,162,245)"
          },
          orientation: 'h'
        }];

      var barLayout = {
          title: "Top 10 OTU",
          margin: { t: 50, l: 170 },
      };
        
        Plotly.newPlot('bar', hzBarData, barLayout);
      
      // Bubble Chart
      var bubbleData = [{
          x: otu_ids,
          y: sample_values,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
          }
      }];

      var bubbleLayout = {
          title: "Bacteria Cultures in Samples",
          margin: { t: 0 },
          hovermode: "closest",
          xaxis: { title: "OTU IDs" },
          margin: { t: 50 },
      };

      Plotly.newPlot("bubble", bubbleData, bubbleLayout)
  });
};

function metaData(sample) {
  d3.json("samples.json").then( data => {
      // variables
      var metaData = data.metadata;
      var selectionArray = metaData.filter(obj => obj.id == sample);
      var selectionObj = selectionArray[0];
      //goes in box
      var demographicBox = d3.select("#sample-metadata");
      // clear existing
      demographicBox.html("");
      console.log(Object.entries(selectionObj))
      Object.entries(selectionObj).forEach(([key, value]) => {
          demographicBox.append("h6")
          .text(`${key}: ${value}`)

      })

  })
};
//dropdown
function init() {
  var selector = d3.select("#selDataset");
  d3.json("samples.json").then( data => {
      var names = data.names;
      names.forEach( name => {
          selector
          .append("option")
          .text(name)
          .property("value", name);
      });
      // charts 
      var defaultSample = names[0];
      buildCharts(defaultSample);
      metaData(defaultSample);
  }).catch(err => console.log('ok cool error!', err));
};
//new charts with change in data
function idChange(newSample) {  
  buildCharts(newSample);  
  metaData(newSample);}

init();