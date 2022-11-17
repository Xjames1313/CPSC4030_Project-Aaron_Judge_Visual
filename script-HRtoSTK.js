d3.csv("Data.csv").then(
    function(data){

        console.log(data)

        var size = d3.min([window.innerWidth*0.9, window.innerHeight*0.9])

        var dimensions = {
            margin:{
                top: 20,
                bottom: 30,
                right: 20,
                left: 40
            },
            width: size,
            height: size/3 
        }


        var svg = d3.select("#HR_to_StkOuts")
                    .style("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
                    .style("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)

        dimensions.boundedWidth = dimensions.width - dimensions.margin.right - dimensions.margin.left
        dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
                
        var xScale = d3.scaleBand()
                        .domain(data.map(function(d){return d.year;}))
                        .range([0,dimensions.boundedWidth]).padding(0.2)

        var yScale = d3.scaleLinear()
                        .domain([0, d3.max(data.map(function(d){return d.b_strikeout}), s => +s)])
                        .range([dimensions.boundedHeight,0]);
            
        

        //X Axis
        svg.append("g")
              .attr("transform", "translate("+ dimensions.margin.left + "," + (dimensions.boundedHeight+dimensions.margin.bottom) + ")")
              .call(d3.axisBottom(xScale));
             
        //Y Axis
        svg.append("g")
              .attr("transform","translate("+dimensions.margin.left+","+ dimensions.margin.top +")")
              .call(d3.axisLeft(yScale));

        var tooltip = d3.select("body")
              .append("div")
              .attr("id", "mytooltip")
              .style("position", "absolute")
              .style("z-index", "10")
              .style("visibility", "hidden")
              .text("a simple tooltip");

        //Strike out dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(d.year); } )
            .attr("cy", function (d) { return yScale(d.b_strikeout); } )
            .attr("r", 5)
            .attr("transform", "translate("+ (dimensions.margin.left+ 45) +","+ dimensions.margin.top +")")
            .style("fill", "#CC0000")
            .on("mouseover", function(d, i){
                d3.select(this).transition()
                    .attr("style", "fill: black;");

                d3.select("#mytooltip")
                    .style("visibility", "visible")//set style to it
                    .text("Strikeouts: " + i.b_strikeout)//set text to it
                })
            .on("mouseout", function(){
                d3.select(this).transition()
                    .attr("style", "fill: #CC0000;");

            });

        //Strike Out line
        var line = d3.line()
              .x(function(d) { return xScale(d.year); }) 
              .y(function(d) { return yScale(d.b_strikeout); }) 
              .curve(d3.curveMonotoneX)
              
              svg.append("path")
              .datum(data) 
              .attr("class", "line") 
              .attr("transform", "translate("+ (dimensions.margin.left + 45) +","+ dimensions.margin.top +")")
              .attr("d", line)
              .style("fill", "none")
              .style("stroke", "#CC0000")
              .style("stroke-width", "2");

        //Home Run Dots
        svg.append('g')
              .selectAll("dot")
              .data(data)
              .enter()
              .append("circle")
              .attr("cx", function (d) { return xScale(d.year); } )
              .attr("cy", function (d) { return yScale(d.b_home_run); } )
              .attr("r", 5)
              .attr("transform", "translate("+ (dimensions.margin.left+ 45) +","+ dimensions.margin.top +")")
              .style("fill", "blue")
              .on("mouseover", function(d, i){
                d3.select(this).transition()
                    .attr("style", "fill: grey;");

                d3.select("#mytooltip")
                    .style("visibility", "visible")//set style to it
                    .text("Home Runs: " + i.b_home_run)//set text to it
                })
             .on("mouseout", function(){
                d3.select(this).transition()
                    .attr("style", "fill: blue;");

            });

        //Home Run line
        var line = d3.line()
              .x(function(d) { return xScale(d.year); }) 
              .y(function(d) { return yScale(d.b_home_run); }) 
              .curve(d3.curveMonotoneX)
              
              svg.append("path")
              .datum(data) 
              .attr("class", "line") 
              .attr("transform", "translate("+ (dimensions.margin.left + 45) +","+ (dimensions.margin.top) + ")")
              .attr("d", line)
              .style("fill", "none")
              .style("stroke", "blue")
              .style("stroke-width", "2");
    }
)