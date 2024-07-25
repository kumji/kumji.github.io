// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg1 = d3.select("#bar-chart3")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom+100)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select("#legend")
  .append("svg")
    .attr("width", 150 + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom+100)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// https://worldhappiness.report/ed/2024/happiness-of-the-younger-the-older-and-those-in-between/
// https://d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
d3.csv("https://raw.githubusercontent.com/kumji/kumji.github.io/main/data/data.csv")
    .then(function(csvdata) {
    var data = [];
    var happy20 = [];
        for(let i in csvdata) {
            if (csvdata[i].Year == '2023') {
                data.push(csvdata[i]);
            }
        }

        data.sort(function(b, a) {
            return a.Happiness - b.Happiness;
        });
        happy20 = data.slice(0,20);

        console.log(happy20)

        var subgroups = Object.keys(data[0]).slice(2)

    // Happy Chart
    var countries = d3.map(happy20, function(d){return(d.Country)});

    var x = d3.scaleBand()
        .domain(countries)
        .range([0, width])
        .padding([0.2])
    svg1.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text") 
        .style("text-anchor", "end") 
        .attr("dx", "-.8em") 
        .attr("dy", ".15em") 
        .attr("transform", function(d) {return "rotate(-65)"})
        .append("text") 
        .attr("x", width/2) 
        .attr("y", 100) 
        .style("text-anchor","middle") 
        .text("Country");

    var y = d3.scaleLinear()
        .domain([0,100])
        .range([ height, 0 ]);
    svg1.append("g")
        .call(d3.axisLeft(y));

    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e41a1c','#377eb8','#4daf4a', '#FF5733', '#F7F00D', '#0DF0F7', '#F70DF7'])


    var stackedData = d3.stack()
        .keys(subgroups)
        (happy20)

    // create a tooltip
    var tooltip = d3.select("#bar-chart3")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("height", "fit-content")

    var mouseover = function(d) {
        var selectedData = d3.select(this).data()[0].data;
        let text = "Country: " + selectedData.Country + "<br>Happiniess: " + selectedData.Happiness
                + "<br>GDP: " + selectedData.GDP + "<br>Social Support: " + selectedData.Social_support
                + "<br>Healthy: " + selectedData.Healthy + "<br>Freedom: " + selectedData.Freedom
                + "<br>Generosity: " + selectedData.Generosity + "<br>Positive_affect: " + selectedData.Positive_affect
                + "<br>Negative_affect: " + selectedData.Negative_affect;
        tooltip
            .html(text)
            .style("opacity", 1)
    }
    var mousemove = function(d) {
        console.log(event.pageX)
        tooltip
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY) + "px")
    }
    var mouseleave = function(d) {
        tooltip
        .style("opacity", 0)
    }
    

    svg1.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function(d) { return color(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
            .attr("x", function(d) { return x(d.data.Country); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width",x.bandwidth())
    var countries = d3.map(happy20, function(d){return(d.Country)});

    var x = d3.scaleBand()
        .domain(countries)
        .range([0, width])
        .padding([0.2])
    svg1.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text") 
        .style("text-anchor", "end") 
        .attr("dx", "-.8em") 
        .attr("dy", ".15em") 
        .attr("transform", function(d) {return "rotate(-65)"})
        .append("text") 
        .attr("x", width/2)
        .attr("y", 100) 
        .style("text-anchor","middle") 
        .text("Country"); 

    var y = d3.scaleLinear()
        .domain([0,100])
        .range([ height, 0 ]);
    svg1.append("g")
        .call(d3.axisLeft(y));

    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e41a1c','#377eb8','#4daf4a', '#81EAF1', '#92F181', '#F7940D', '#F70DF7'])


    var stackedData = d3.stack()
        .keys(subgroups)
        (happy20)

    svg1.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function(d) { return color(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
            .attr("x", function(d) { return x(d.data.Country); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width",x.bandwidth())
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    svg2.append("g")
    .selectAll("g")
    .data(subgroups)
    .enter()
    .append("circle")
    .attr("cx", 0)
    .attr("cy", function(d,i){ return 100 + i*25})
    .attr("r", 7)
    .style("fill", function(d){ return color(d)})

    svg2.append("g")
    .selectAll("g")
    .data(subgroups)
    .enter()
    .append("text")
    .attr("x", 20)
    .attr("y", function(d,i){ return 100 + i*25}) 
    .style("fill", function(d){ return color(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")



})
