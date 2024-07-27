
var margin4 = {top: 10, right: 30, bottom: 20, left: 50},
width4 = 1000 - margin4.left - margin4.right,
height4 = 700 - margin4.top - margin4.bottom;

let svg5 = d3.select("#definition")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 150)
    .append("g")
    .attr("transform",
          "translate(" + margin4.left + "," + margin4.top + ")");

let svg6 = d3.select("#bar-chart4")
  .append("svg")
    .attr("width", width4)
    .attr("height", 400)
  .append("g")
    .attr("transform",
          "translate(100,30)");

const def = {
    'Happiness':'The survey measure of SWB is from the February 15, 2024 release of the Gallup World Poll (GWP) covering years from 2005/06 to 2023. Unless stated otherwise, it is the national average response to the question of life evaluations. The English wording of the question is “Please imagine a ladder, with steps numbered from 0 at the bottom to 10 at the top. The top of the ladder represents the best possible life for you and the bottom of the ladder represents the worst possible life for you. On which step of the ladder would you say you personally feel you stand at this time?” This measure is also referred to as Cantril life ladder, or just life ladder in our analysis.',
    'GDP':'The statistics of GDP per capita (variable name gdp) in purchasing power parity (PPP) at constant 2017 international dollar prices are from World Development Indicators (WDI, version 23, Metadata last updated on- Sep 27, 2023).',
    'Social_support':'The national average of the binary responses (either 0 or 1) to the GWP question “If you were in trouble, do you have relatives or friends you can count on to help you whenever you need them, or not?”',
    'Healthy':'Healthy life expectancies at birth are based on the data extracted from the World Health Organization’s (WHO) Global Health Observatory data repository (Last updated: 2020-12-04).',
    'Freedom':'The national average of responses to the GWP question “Are you satisfied or dissatisfied with your freedom to choose what you do with your life?”',
    'Generosity':'The residual of regressing national average of response to the GWP question “Have you donated money to a charity in the past month?” on GDP per capita.',
    'Positive_affect':'It is defined as the average of three positive affect measures in GWP: laugh, enjoyment and doing interesting things in the Gallup World Poll. These measures are the responses to the following three questions, respectively: “Did you smile or laugh a lot yesterday?”, and “Did you experience the following feelings during A LOT OF THE DAY yesterday? How about Enjoyment?”, “Did you learn or do something interesting yesterday?”',
    'Negative_affect':'It is defined as the average of three negative affect measures in GWP. They are worry, sadness and anger, respectively the responses to “Did you experience the following feelings during A LOT OF THE DAY yesterday? How about Worry?”, “Did you experience the following feelings during A LOT OF THE DAY yesterday? How about Sadness?”, and “Did you experience the following feelings during A LOT OF THE DAY yesterday? How about Anger?”'
};

function updateChart() {
    //Clear
    svg5.selectAll("text").remove();
    svg6.selectAll("g").remove();
    svg6.selectAll("rect").remove();
    svg6.selectAll("text").remove();
    let keyValue = '';
    const radios = document.getElementsByName('keyValue');
    
    for (let radio of radios) {
        if(radio.checked) {
            keyValue = radio.value;
        }
    }

    // Update Title
    document.getElementById('keyword').innerText = keyValue;
    yearValue = document.getElementById("yearOption").value;
    
    svg5.append("text")
    .attr("y", 20)
	.attr("dy", 0)
    .attr("transform", "translate(10,0)")
	.text(def[keyValue])
    .call(wrap, 900);
    
    // Load Data
    d3.csv("https://raw.githubusercontent.com/kumji/kumji.github.io/main/data/data.csv")
    .then(function(csvdata) {
        let data = [];
        let top10 = [];
        console.log(yearValue)
        for(let i in csvdata) {
            if (csvdata[i].Year == yearValue) {
                data.push(csvdata[i]);
            }
        }
        data.sort(function(b,a) {
            return a[keyValue] - b[keyValue];
        });
        top10 = data.slice(0,10);
        console.log(top10[9][keyValue]);
        console.log(top10[0][keyValue]*1.2);

        // Bar Chart
        var x = d3.scaleLinear()
        .domain([0, (top10[0][keyValue]*1.2)])
        .range([0, 800]);
        svg6.append("g")
        .attr("transform", "translate(0," + 300 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end")
           
        var y = d3.scaleBand()
        .range([ 0, 300 ])
        .domain(top10.map(function(d) { return d.Country; }))
        .padding(.1);
        svg6.append("g")
        .call(d3.axisLeft(y))
        .style("font-size", "0.8em");
        
        var chart4 = svg6.selectAll("g")
                    .data(top10)
                    .enter().append("g")
                    .attr("class","g1")
                    .attr("transform",function(d) {return "translate(0,"+y(d.Country)+")"; });
        
        chart4.append("rect")
            .data(top10)
            .enter()
            .append("rect")
            .attr("x",x(0))
            .attr("y", function(d) { return y(d.Country); })
            .attr("width", function(d) { return x(d[keyValue]); })
            .attr("height", y.bandwidth() )
            .attr("fill", getColor(keyValue))
        
        chart4.append("text")
            .data(top10)
            .enter()
            .append("text")
            .text(function(d) { return d[keyValue]; })
            .attr("x", function(d){return x(d[keyValue]);})
            .attr("y", function(d) { return y(d.Country); })
            .attr('dy', '0.8em')
            .attr('dx', '0.7em')
            .attr("text-anchor","left")
            .style("fill","grey")

        // Finland Happiniess
        const finannotations = [
                {
                    note: { 
                            label: "Finland had been ranked the happiest country since 2016",
                            title: "Happiest Country",
                            wrap: 300,
                            padding: 10
                            },
                    color: ["#292928"],
                    x: 40,
                    y: 10,
                    dy: 20,
                    dx: 10
                    
                }]
        const finhappy = d3.annotation().annotations(finannotations);
        
        if((yearValue>'2015')&&(keyValue=='Happiness')){
            svg6.append("g")
                    .style("opacity",1)
                    .attr("id","fin_annotation")
                    .style("font-size", 15)
                    .call(finhappy)
        } else {
            d3.select(".fin_annotation").remove()
        }
        
        // Lux GDP
        const luxannotations = [
            {
                note: { 
                        label: "Luxembourg had been ranked the highest GDP country until 2019 and again in 2022",
                        title: "The Highest GDP Country",
                        wrap: 300,
                        padding: 10
                        },
                color: "#292928",
                x: 40,
                y: 10,
                dy: 10,
                dx: 10
                
            }]
        const luxgdp = d3.annotation().annotations(luxannotations);
        
        if((yearValue<'2020' || yearValue=='2022')&&(keyValue=='GDP')){
            svg6.append("g")
                    .style("opacity",1)
                    .attr("id","lux_annotation")
                    .style("font-size", 15)
                    .call(luxgdp)
        } else {
            d3.select(".lux_annotation").remove()
        }

        // Ice Social
        const iceannotations = [
            {
                note: { 
                        label: "Iceland had been the most frequently top 1 ranked for Social support score for the last decade",
                        title: "The Highest Social Support Score Country",
                        wrap: 300,
                        padding: 10
                        },
                color: "#292928",
                x: 40,
                y: 10,
                dy: 40,
                dx: 10
                
            }]
        const iceso = d3.annotation().annotations(iceannotations);
        
        if((yearValue=='2016'||(yearValue=='2017')||
        (yearValue=='2019')||(yearValue=='2020')||
        (yearValue=='2021')||(yearValue=='2022')||
        (yearValue=='2023'))&&
        (keyValue=='Social_support')){
            svg6.append("g")
                    .style("opacity",1)
                    .attr("id","iceannotations")
                    .style("font-size", 15)
                    .call(iceso)
        } else {
            d3.select(".iceannotations").remove()
        }


        // Jap Healthy
        const japannotations = [
            {
                note: { 
                        label: "Japan has been ranked as the most healthy country for the last decade",
                        title: "All-time The Most Healthy Country",
                        wrap: 300,
                        padding: 10
                        },
                color: "#292928",
                x: 40,
                y: 10,
                dy: 5,
                dx: 10
                
            }]
        const japhel = d3.annotation().annotations(japannotations);
        
        if(keyValue=='Healthy'){
            svg6.append("g")
                    .style("opacity",1)
                    .attr("id","japannotations")
                    .style("font-size", 15)
                    .call(japhel)
        } else {
            d3.select(".japannotations").remove()
        }

        // Uzbekistan Freedom
        const uzbannotations = [
            {
                note: { 
                        label: "Uzbekistan had been the most frequently top 1 ranked for the Freedom score for the last decade",
                        title: "Most Frequent Freedom Country",
                        wrap: 300,
                        padding: 10
                        },
                color: "#292928",
                x: 40,
                y: 10,
                dy: 40,
                dx: 10
                
            }]
        const uzbfree = d3.annotation().annotations(uzbannotations);
        
        if((yearValue=='2015'||(yearValue=='2016')||
        (yearValue=='2017')||(yearValue=='2018')||
        (yearValue=='2019'))&&
        (keyValue=='Freedom')){
            svg6.append("g")
                    .style("opacity",1)
                    .attr("id","uzbannotations")
                    .style("font-size", 15)
                    .call(uzbfree)
        } else {
            d3.select(".uzbannotations").remove()
        }

         // Generosity
         const genannotations = [
            {
                note: { 
                        label: "Myanmar and Indonesia had been the most frequently top 1 ranked as the most generous countries for the last decade",
                        title: "Most Generous Country",
                        wrap: 300,
                        padding: 10
                        },
                color: "#292928",
                x: 40,
                y: 10,
                dy: 20,
                dx: 10
                
            }]
        const generosity = d3.annotation().annotations(genannotations);
        
        if(keyValue=='Generosity'){
            svg6.append("g")
                    .style("opacity",1)
                    .attr("id","genannotations")
                    .style("font-size", 15)
                    .call(generosity)
        } else {
            d3.select(".genannotations").remove()
        }

    })

function getColor(keyValue) {
    if (keyValue == 'Happiness') {
        return '#f5f0b6';
    } else if (keyValue == 'GDP') {
        return '#f1a7f1';
    } else if (keyValue == 'Social_support') {
        return '#d9acfb';
    } else if (keyValue == 'Healthy') {
        return '#8abde7';
    } else if (keyValue == 'Freedom') {
        return '#bbf7b9';
    } else if (keyValue == 'Generosity') {
        return '#b2ecf0';
    } else if (keyValue == 'Positive_affect') {
        return '#c2f7b9';
    } else if (keyValue == 'Negative_affect') {
        return '#f4d5a9';
    }

}


}

function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }