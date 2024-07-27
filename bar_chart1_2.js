
var bmargin = {top: 40, right: 30, bottom: 60, left: 150},
bwidth = 450 - bmargin.left - bmargin.right,
bheight = 400 - bmargin.top - bmargin.bottom;


let svg1 = d3.select("#bar-chart1")
.append("svg")
.attr("width", bwidth + bmargin.left + bmargin.right)
.attr("height", bheight + bmargin.top + bmargin.bottom)
.append("g")
.attr("transform",
      "translate(" + bmargin.left + "," + bmargin.top + ")");


let svg2 = d3.select("#bar-chart2")
.append("svg")
.attr("width", bwidth + bmargin.left + bmargin.right)
.attr("height", bheight + bmargin.top + bmargin.bottom)
.append("g")
.attr("transform",
    "translate(" + bmargin.left + "," + bmargin.top + ")");


// Parse the Data
var csvdata = d3.csv("https://raw.githubusercontent.com/kumji/kumji.github.io/main/data/data.csv")
.then(function(csvdata)
{

    var data = [];
    var happy10 = [];
    var sad10 = [];

        for(let i in csvdata) {
            if (csvdata[i].Year == '2023') {
                data.push(csvdata[i]);
            }
        }

        data.sort(function(b, a) {
            return a.Happiness - b.Happiness;
        });
        happy10 = data.slice(0,10);
        
        sad10 = data.sort(function(b, a) {
            return b.Happiness - a.Happiness;
        });
        sad10 = sad10.slice(0,10)


var x = d3.scaleLinear()
.domain([0, 10])
.range([ 0, bwidth]);
svg1.append("g")
.attr("transform", "translate(0," + bheight + ")")
.call(d3.axisBottom(x))
.selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end")
  

var y = d3.scaleBand()
.range([ 0, bheight ])
.domain(happy10.map(function(d) { return d.Country; }))
.padding(.1);
svg1.append("g")
.call(d3.axisLeft(y))
.style("font-size", "0.8em");


var chart1 = svg1.selectAll("g")
            .data(happy10)
            .enter().append("g")
            .attr("class","g1")
            .attr("transform",function(d) {return "translate(0,"+y(d.Country)+")"; });

chart1.append("rect")
    .data(happy10)
    .enter()
    .append("rect")
    .attr("x",x(0))
    .attr("y", function(d) { return y(d.Country); })
    .attr("width", function(d) { return x(d.Happiness); })
    .attr("height", y.bandwidth() )
    .attr("fill", "#0DECF7")

    chart1.append("text")
    .data(happy10)
    .enter()
    .append("text")
    .text(function(d) { return d.Happiness; })
    .attr("x", function(d){return x(d.Happiness);})
    .attr("y", function(d) { return y(d.Country); })
    .attr('dy', '1.0em')
    .attr('dx', '0.7em')
    .attr("text-anchor","left")
    .style("fill","blue")


var sx = d3.scaleLinear()
.domain([0, 10])
.range([ 0, bwidth]);
svg2.append("g")
.attr("transform", "translate(0," + bheight + ")")
.call(d3.axisBottom(sx))
.selectAll("text")
.attr("transform", "translate(-10,0)rotate(-45)")
.style("text-anchor", "end");


var sy = d3.scaleBand()
.range([ 0, bheight ])
.domain(sad10.map(function(d1) { return d1.Country; }))
.padding(.1);
svg2.append("g")
.call(d3.axisLeft(sy))
.style("font-size", "0.8em");

var chart2 = svg2.selectAll("g")
            .data(sad10)
            .enter().append("g")
            .attr("class","g2")
            .attr("transform",function(d) {return "translate(0,"+sy(d.Country)+")"; });

chart2.append("SadRect")
    .data(sad10)
    .enter()
    .append("rect")
    .attr("x",sx(0))
    .attr("y", function(d) { return sy(d.Country); })
    .attr("width", function(d) { return sx(d.Happiness); })
    .attr("height", sy.bandwidth() )
    .attr("fill", "#F3A1A1")

    chart2.append("SadText")
    .data(sad10 )
    .enter()
    .append("text")
    .text(function(d) { return d.Happiness; })
    .attr("x", function(d){return sx(d.Happiness);})
    .attr("y", function(d) { return sy(d.Country); })
    .attr('dy', '1.0em')
    .attr('dx', '0.7em')
    .attr("text-anchor","left")
    .style("fill","red")

    svg2.append("text")      
    .attr("x",150)
    .attr("y",-15)
    .style("text-anchor", "middle")
    .text("Top 10 Saddest Countries in 2023")
    .style("fill","gray")

    svg1.append("text")      
    .attr("x",150)
    .attr("y",-15)
    .style("text-anchor", "middle")
    .text("Top 10 Happiest Countries in 2023")
    .style("fill","gray")
    
})
