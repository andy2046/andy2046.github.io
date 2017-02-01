


function drawbaseline(svgIn, actualLineData, baseLineData) { 


function getColor(idx) {
		var id = isNaN(idx) ? hashCode(idx) : idx ;
                var palette = [
                   "#0a72ff", "#1eff06", "#ff1902", "#ffe304", "#0d8c39", 
				   "#0f83aa", "#ba5f59", "#c602fe", "#f2affd", "#11fee3", 
				   "#8e7808", "#b7ff78", "#fe8f06", "#7b8f70", "#f00755", 
				   "#b14ece", "#feb87c", "#8fe7fd", "#8f6f92", "#0eff9f", 
				   "#74a2fd", "#08b401", "#ffbac4", "#fd75aa", "#c3cd7a", 
				   "#fe6e4c", "#77a009", "#aeff04", "#05aba2", "#a8feb7", 
				   "#fe32e8", "#bfc0ea", "#eab739", "#b56520", 
				   '#2ec7c9', 
				   '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3', 
				   '#e5cf0d', '#97b552', '#95706d', '#dc69aa', '#07a2a4', 
				   '#9a7fd1', '#588dd5', '#f5994e', '#c05050', '#59678c', 
				   '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ]
                return palette[id % palette.length];
            } 




//Set the dimensions of the canvas / graph
var margin = {top: 30, right: 50, bottom: 60, left: 50},
 width = 1000 - margin.left - margin.right,
 height = 450 - margin.top - margin.bottom;

//Parse the date / time
var parseDate = d3.time.format("%d-%b-%y").parse;
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

//Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
var y1 = d3.scale.linear().range([height, 0]);

//Define the axes
var xAxis = d3.svg.axis().scale(x)
 .orient("bottom").ticks(10).tickFormat(d3.time.format("%b-%Y"));

var yAxis = d3.svg.axis().scale(y)
 .orient("left").ticks(5);

var yAxis1 = d3.svg.axis().scale(y1)
 .orient("right").ticks(5);

var methods = [ //interpolation methods
 'linear',
 'step-before',
 'step-after',
 'basis',
 'basis-open',
 'basis-closed',
 'bundle',
 'cardinal',
 'cardinal-open',
 'cardinal-closed',
 'monotone'
 ];



var actualLineData1 = JSON.parse( actualLineData );
var baseLineData1 = JSON.parse( baseLineData );

var actualMax = 1;
var baselineMax = 1;

var avgVal = 1;
var targetVal = 1;

actualLineData1.forEach(function(d) {
     d.date = parseDate(d.date);
     d.sev2 = +d.sev2;
	 d.total = +d.total;
	 actualMax = (d.total > actualMax) ? d.total : actualMax ;
 });

baseLineData1.forEach(function(d) {
    d.date = parseDate(d.date);
    d.target = +d.target;
	d.avg = +d.avg;
	d.baseline = +d.baseline;
	baselineMax = (d.baseline > baselineMax) ? d.baseline : baselineMax ;
	avgVal = d.avg;
	targetVal = d.target;
});

actualLineData1.sort(function(x, y){
	   return d3.ascending(x.date, y.date);
	});

baseLineData1.sort(function(x, y){
	   return d3.ascending(x.date, y.date);
	});


//Define the line
var baselineLine = d3.svg.line()
 .x(function(d) { return x(d.date); })
 .y(function(d) { return y(d.baseline); })
	.interpolate('cardinal');

var avglineLine = d3.svg.line()
.x(function(d) { return x(d.date); })
.y(function(d) { return y(d.avg); })
	.interpolate('cardinal');

var targetlineLine = d3.svg.line()
.x(function(d) { return x(d.date); })
.y(function(d) { return y(d.target); })
	.interpolate('cardinal');



var actuallineLine = d3.svg.line()
.x(function(d) { return x(d.date); })
.y(function(d) { return y(d.total); })
	.interpolate('cardinal');

var sev2Max = d3.max(actualLineData1, function(d) { return Math.max(d.sev2); });

var scaleSev2 = d3.scale.linear()
.domain([0, sev2Max])
.range([15, 60]);

var sev2line = d3.svg.line()
 .x(function(d) { return x(d.date); })
 .y(function(d) { return y1(scaleSev2(d.sev2)); })
	.interpolate('cardinal');
	
//Adds the svg canvas
var svg =  //d3.select("#root")
	svgIn.append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
 .append("g")
     .attr("transform", 
           "translate(" + margin.left + "," + margin.top + ")");
			  


 // Scale the range of the data
 x.domain(d3.extent(baseLineData1, function(d) { return d.date; }));
 y.domain([0, Math.max(baselineMax,actualMax) ]);
 y1.domain([0, 100]); // d3.max(actualLineData1, function(d) { return Math.max(1*d.sev2); })]);

 // Add the valueline path.
 
var targetlinePathID = "targetlinePath",
 	avglinePathID = "avglinePath",
 	sev2linePathID = "sev2linePath",
 	actuallinePathID = "actuallinePath",
 	baselinePathID = "baselinePath";
 
 svg.append("path")
 .attr("id",targetlinePathID)
 .attr("class", "line")
 .attr("d", targetlineLine(baseLineData1))
 .attr("fill", "none")
	.style("stroke", function(d) {
				return "red";
			});
 
 svg.append("path")
 .attr("id",avglinePathID)
 .attr("class", "line")
 .attr("d", avglineLine(baseLineData1))
 .attr("fill", "none")
	.style("stroke", function(d) {
				return "blue";
			});

 svg.append("path")
 .attr("id",sev2linePathID)
     .attr("class", "line")
     .attr("d", sev2line(actualLineData1))
     .attr("fill", "none")
		.style("stroke", function(d) {
					return "yellow";
				})
		.attr("transform", "translate(0,100)");

 svg.append("path")
 .attr("id",actuallinePathID)
 .attr("class", "line")
 .attr("d", actuallineLine(actualLineData1))
 .attr("fill", "none")
	.style("stroke", function(d) {
				return "green";
			});

	svg.append("path")
	.attr("id",baselinePathID)
     .attr("class", "line")
		.style("stroke-dasharray", "5,1")
     .attr("d", baselineLine(baseLineData1))
     .attr("fill", "none")
		.style("stroke", function(d) {
					return "purple";
				});
		
 // Add the scatterplot
 svg.selectAll("dottotal")
     .data(actualLineData1)
   .enter().append("circle")
     .attr("r", 3.5)
		.style("fill", "green")
     .attr("cx", function(d) { return x(d.date); })
     .attr("cy", function(d) { return y(d.total); });
	
	svg.selectAll("texttotal")
     .data(actualLineData1)
   .enter().append("text")
   .attr("x", function(d) { return x(d.date); })
   .attr("y", function(d) { return y(d.total); })
   .attr("dx", ".35em")
	  .attr("dy", ".35em")
	  .style("font-size", "10px")
   .style("text-anchor", "end")
   .style("font-weight", "bold")
	  //.style("writing-mode", "tb")
	  .attr("transform", "translate(20,10)")
   .text(function(d) { return ~~d.total; })
   .on('mouseover',function(d,i) {
                            d3.select(this).style("font-size", "15px").style("fill", "red");
                            //console.log(d3.select(this));
			   })
	  .on('mouseout',function() {
		  d3.select(this).style("font-size", "10px").style("fill", "black");
			   });
	
	// Add the scatterplot
	 svg.selectAll("dotsev2")
	     .data(actualLineData1)
	   .enter().append("circle")
	     .attr("r", 3.5)
			.style("fill", "yellow")
	     .attr("cx", function(d) { return x(d.date); })
	     .attr("cy", function(d) { return y1(scaleSev2(d.sev2)); })
	     .attr("transform", "translate(0,100)");
		
		svg.selectAll("textsev2")
	     .data(actualLineData1)
	   .enter().append("text")
	   .attr("x", function(d) { return x(d.date); })
	   .attr("y", function(d) { return y1(scaleSev2(d.sev2)); })
	   .attr("dx", ".35em")
		  .attr("dy", ".35em")
		  .style("font-size", "10px")
	   .style("text-anchor", "end")
	   .style("font-weight", "bold")
		  //.style("writing-mode", "tb")
		  .attr("transform", "translate(10,90)")
	   .text(function(d) { return ~~d.sev2; })
	   .on('mouseover',function(d,i) {
                            d3.select(this).style("font-size", "15px").style("fill", "red");
                            //console.log(d3.select(this));
			   })
	  .on('mouseout',function() {
		  d3.select(this).style("font-size", "10px").style("fill", "black");
			   });
		
	
 // Add the X Axis
 svg.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis);

 // Add the Y Axis
 svg.append("g")
     .attr("class", "y axis")
		//.style("fill", "blue")
     .call(yAxis);
	
	svg.append("g")
     .attr("class", "y1 axis")
		.attr("transform", "translate(" + width + " ,0)")	
     //.style("fill", "yellow")
     .call(yAxis1);
	
	d3.selectAll(".y1.axis").selectAll("path").style("stroke", "yellow");

	
	var xText = 2, yText = 10, rCircle = 4.5 ;
	
	var focusavg = svg.append("g").attr("class", "focus").style("display", "none");
	focusavg.append("circle").attr("r", rCircle);
	focusavg.append("text")
    .attr("x", xText)
    .attr("y", yText)
	.attr("dx", ".35em")
    .attr("dy", ".35em");
	
	var focusbaseline = svg.append("g").attr("class", "focus").style("display", "none");
	focusbaseline.append("circle").attr("r", rCircle);
	focusbaseline.append("text")
    .attr("x", xText)
    .attr("y", yText)
	.attr("dx", ".35em")
    .attr("dy", ".35em");
	
	var focustarget = svg.append("g").attr("class", "focus").style("display", "none");
	focustarget.append("circle").attr("r", rCircle);
	focustarget.append("text")
    .attr("x", xText)
    .attr("y", yText)
	.attr("dx", ".35em")
    .attr("dy", ".35em");

function mousemoved(that) {
	var x0 = x.invert(d3.mouse(that)[0]),
    i = bisectDate(baseLineData1, x0, 1),
    d0 = baseLineData1[i - 1],
    d1 = baseLineData1[i],
    d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    
    focusavg.attr("transform", "translate(" + x(d.date) + "," + y(d.avg) + ")");
    focusavg.select("text").text(d.avg).style("fill", "blue");
    focusavg.select("circle").style("stroke", "blue");
    
    focusbaseline.attr("transform", "translate(" + x(d.date) + "," + y(d.baseline) + ")");
    focusbaseline.select("text").text(d.baseline).style("fill", "purple");
    focusbaseline.select("circle").style("stroke", "purple");
    
    focustarget.attr("transform", "translate(" + x(d.date) + "," + y(d.target) + ")");
    focustarget.select("text").text(d.target).style("fill", "red");
    focustarget.select("circle").style("stroke", "red");
    
  }

svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function() { d3.selectAll(".focus").style("display", null); //focus.style("display", null); 
    	})
    .on("mouseout", function() { d3.selectAll(".focus").style("display", "none"); //focus.style("display", "none"); 
    	})
    .on("mousemove", function() { 
    	var that = this; 
    	mousemoved(that);
    	} );

legend();


function legend() {


/*	var targetlinePathID = "targetlinePath",
 	avglinePathID = "avglinePath",
 	sev2linePathID = "sev2linePath",
 	actuallinePathID = "actuallinePath",
 	baselinePathID = "baselinePath";*/	

var legendArr = [{text:"2015 Baseline",color:"purple",id:baselinePathID},
                 {text:"Avg Baseline",color:"blue",id:avglinePathID},
                 {text:"Target (-25%)",color:"red",id:targetlinePathID},
                 {text:"Actual",color:"green",id:actuallinePathID},
                 {text:"Sev 2",color:"yellow",id:sev2linePathID}];

//legendArr.sort(function(b,a) {return (a > b) ? 1 : ((b > a) ? -1 : 0);} );


var startX = width, startY = height + 40;

var legend3g = svg.selectAll(".legend")
      .data(legendArr)//.slice().reverse())
	  .enter().append("g")
      .attr("class", "legend enter")
      .attr("transform", function(d, i) { return "translate("+ ( width - 200 - i*150 ) +"," + (startY) + ")"; });

  legend3g.append("rect")
      //.attr("x", function(d, i) { return px + 5 ; } )
      .attr("width", function(d,i) { return 30; } )
      .attr("height", function(d,i) { return 4; })
      .style("fill", function(d,i) { return  d.color; })
      .on('mouseover',function(d,i) {
    	  //console.log(d.id);
    	  d3.select("#" + d.id).classed('hover', true);
    	  d3.select("#" + d.id).style("stroke-width","6px");
			   })
	  .on('mouseout',function(d,i) {
		  d3.select("#" + d.id).classed('hover', false);
		  d3.select("#" + d.id).style("stroke-width","2px");
			   });

  legend3g.append("text")
      .attr("x", function(d, i) { return 35; } )
      .attr("y", 1)
	  .style("font-size", "10px")
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return d.text; });
  
}
  
  
  

}

