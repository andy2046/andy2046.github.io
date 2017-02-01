
function barChartTrendlineBottomLegend(svgIn, jsonDataIn,arrGrpByIn) { 

//String.prototype.hashCode = 
function hashCode(str) {
  var hash = 0, i, chr, len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
} //;

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



function drawtrendline(svgIn, lineDataIn) { 

	function trendline(dataIn) {
		var n = dataIn.length;
		//console.log(n);
		
		trendlineData = [];
		
		for(var i =1; i<n; i++) {
			var obj = {"x":(dataIn[i].x), "y": (dataIn[i].y + dataIn[i-1].y)/2, "z": (dataIn[i].z + dataIn[i-1].z)/2, "s": i }; 
			trendlineData.push(obj);
		}
		
		//console.log(trendlineData);
		return trendlineData;
		
	}

	if (lineDataIn.length > 1) {
	var arr = trendline(lineDataIn);
	//.sort(function(a, b){return a-b});
	//console.log(lineDataIn,lineDataIn.length);
	//console.log(lineDataIn);
	var maxY = d3.max(lineDataIn, function(d) { return d.y; });
	var minY = d3.min(lineDataIn, function(d) { return d.y; });
	var yPad = 0;//(maxY - minY - 50)*0.6+25;
	//console.log(yPad);
	var svg = svgIn
		.append("g").attr("class", "line enter")
	    .attr("transform", "translate(" + padding + "," + (-yPad) + ")"); // (-padding*2)

	/*
	svg.selectAll("polyline").remove();

	svg.selectAll("polyline")
		.data([lineDataIn])
		.enter().append("polyline")
	    .attr("points",function(d) { 
	        return d.map(function(d) { return [x(d.x), y(d.y)].join(","); }).join(" ");}) // height - y(d.y) 
	    .attr("stroke",function(d,i) { return color(false);})
	    .attr("stroke-width",2)
	    .style("fill", "none");
	*/
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
		
	var line = d3.svg.line()
	    .x(function(d) { return (d.x); }) // x(d.x);
	    .y(function(d) { return (d.y); }) // y(d.y); 
	    .interpolate("linear");

	//svg.selectAll(".line").remove();

	svg.append("path")
		.datum(arr)
		.attr("stroke",function(d,i) { return color(true);})
		.attr("stroke-width",2)
		.style("fill", "none")
		.attr("d", line);


		}
	}		
/*
var margin = {top: 30, right: 120, bottom: 120, left: 120},
    width = 640 - margin.left - margin.right, //960 1260
    height = 450 - margin.top - margin.bottom; // 700 
*/

/*var margin = {top: 70, right: 200, bottom: 150, left: 150},
width = 500; //960
height = 400;*/
var margin = {top: 20, right: 50, bottom: 250, left: 60},
width = 350, //960
height = 300;

var padding = 10;

var trendlineData = [], yExtend = 0;

var y = d3.scale.linear()
    .range([height, 0]);

var barHeight = 25;
var barHeightMax = 28;
var barHeightMin = 10;
var fontSizeMin = 8;

var xlabelX = 225, xlabelY = 85; 

var color = d3.scale.ordinal()
    .range(["steelblue", "#ccc"]);
var color3 = d3.scale.category20(); // category10 category20 category20b category20c

var legendNames = [];

var duration = 750,
    delay = 25;

var _comma = d3.format(",");

/*var partition = d3.layout.partition().sort(function(a, b) { return d3.ascending(a.name, b.name); })
    .value(function(d) { return d.size; });*/

/*var partition = d3.layout.partition()
.value(function(d) { return d.size; });*/

var partition = d3.layout.partition().sort(function(a, b) { return d3.ascending(a.name, b.name); })
.value(function(d) { return d.size; });


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = svgIn.append("svg").attr("id", "svg"+svgIn.attr('id'))
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip3g = d3.select("#"+svgIn.attr('id')).append("div").attr("id", "tooltip"+svgIn.attr('id')).attr("class", "tooltipsvg hidden").style("width","200px")
		.html('<p><strong>Category: <span id="group">xxx</span></strong></p><p><strong>Value: <span id="population">xxx</span></strong></p>');
var contenttableIn = d3.select("#contenttable"+svgIn.attr('id'));
var navPath = d3.select("#navPath"+svgIn.attr('id')).attr("class", "navPath")
		.html(''); // <span id="group">xxx</span>

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .style("fill","white")
    .on("click", up);

svg.append("g")
.attr("class", "y axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -45)
            .attr("x", -50)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Incident #s")
            .style('font-size','12px');

xAxis = svg.append("g")
    .attr("class", "x axis")
  .append("line")
    .attr("x1", "82%")
    .style("shape-rendering","crispEdges")
    .style("fill","none").style("fill-opacity","1").style("stroke","#000").style("stroke-opacity","1").style("stroke-width","1px")
	.attr("transform", "translate(0," + height + ")");

//d3.json("readme.json", function(error, root) {
  //if (error) throw error;
  var jsonData = jsonDataIn ; //'{  "name": "top10job",  "children": [   {    "name": "Static Data",    "children": [     {      "name": "Asset Mgmt",      "children": [       {"name": "AMS", "size": 9},       {"name": "CDO", "size": 12},       {"name": "EDM", "size": 24},       {"name": "POM", "size": 7}      ]     },     {      "name": "Data Warehouse",      "children": [       {"name": "BBD", "size": 14},       {"name": "CSM", "size": 31},       {"name": "DBM", "size": 8},       {"name": "IFD", "size": 14},       {"name": "SMD", "size": 16}      ]     },     {      "name": "Enterprise",      "children": [       {"name": "ALM", "size": 4}, 	  {"name": "ERM", "size": 7}      ]     }, 	{      "name": "Finance",      "children": [       {"name": "GST", "size": 5},       {"name": "PEM", "size": 31},       {"name": "HKM", "size": 7},       {"name": "NOS", "size": 16}      ]     }, 	{      "name": "GMIM",      "children": [       {"name": "DVP", "size": 7}, 	  {"name": "DVR", "size": 4}, 	  {"name": "REU", "size": 4}      ]     }, 	{      "name": "Private Bank",      "children": [       {"name": "PBD", "size": 31}, 	  {"name": "PBI", "size": 13}      ]     }, 	{      "name": "Risk Mgmt",      "children": [       {"name": "CCR", "size": 32},       {"name": "CEL", "size": 21},       {"name": "GRC", "size": 15},       {"name": "RSM", "size": 27}      ]     }    ]   },   {    "name": "Source File Error",    "children": [     {      "name": "Asset Mgmt",      "children": [       {"name": "AMS", "size": 39},       {"name": "CDO", "size": 12},       {"name": "EDM", "size": 14},       {"name": "POM", "size": 7}      ]     },     {      "name": "Data Warehouse",      "children": [       {"name": "BBD", "size": 54},       {"name": "CSM", "size": 31},       {"name": "DBM", "size": 8},       {"name": "IFD", "size": 14},       {"name": "SMD", "size": 6}      ]     },     {      "name": "Enterprise",      "children": [       {"name": "ALM", "size": 4}, 	  {"name": "ERM", "size": 7}      ]     }, 	{      "name": "Finance",      "children": [       {"name": "GST", "size": 53},       {"name": "PEM", "size": 31},       {"name": "HKM", "size": 7},       {"name": "NOS", "size": 16}      ]     }, 	{      "name": "GMIM",      "children": [       {"name": "DVP", "size": 7}, 	  {"name": "DVR", "size": 4}, 	  {"name": "REU", "size": 14}      ]     }, 	{      "name": "Private Bank",      "children": [       {"name": "PBD", "size": 11}, 	  {"name": "PBI", "size": 13}      ]     }, 	{      "name": "Risk Mgmt",      "children": [       {"name": "CCR", "size": 32},       {"name": "CEL", "size": 21},       {"name": "GRC", "size": 5},       {"name": "RSM", "size": 27}      ]     }    ]   },   {    "name": "Config",    "children": [     {      "name": "Asset Mgmt",      "children": [       {"name": "AMS", "size": 39},       {"name": "CDO", "size": 12},       {"name": "EDM", "size": 14},       {"name": "POM", "size": 7}      ]     },     {      "name": "Data Warehouse",      "children": [       {"name": "BBD", "size": 64},       {"name": "CSM", "size": 31},       {"name": "DBM", "size": 8},       {"name": "IFD", "size": 14},       {"name": "SMD", "size": 16}      ]     },     {      "name": "Enterprise",      "children": [       {"name": "ALM", "size": 4}, 	  {"name": "ERM", "size": 7}      ]     }, 	{      "name": "Finance",      "children": [       {"name": "GST", "size": 3},       {"name": "PEM", "size": 31},       {"name": "HKM", "size": 7},       {"name": "NOS", "size": 16}      ]     }, 	{      "name": "GMIM",      "children": [       {"name": "DVP", "size": 7}, 	  {"name": "DVR", "size": 4}, 	  {"name": "REU", "size": 14}      ]     }, 	{      "name": "Private Bank",      "children": [       {"name": "PBD", "size": 11}, 	  {"name": "PBI", "size": 13}      ]     }, 	{      "name": "Risk Mgmt",      "children": [       {"name": "CCR", "size": 32},       {"name": "CEL", "size": 21},       {"name": "GRC", "size": 15},       {"name": "RSM", "size": 27}      ]     }    ]   },   {    "name": "Operational Error",    "children": [     {      "name": "Asset Mgmt",      "children": [       {"name": "AMS", "size": 39},       {"name": "CDO", "size": 12},       {"name": "EDM", "size": 14},       {"name": "POM", "size": 7}      ]     },     {      "name": "Data Warehouse",      "children": [       {"name": "BBD", "size": 34},       {"name": "CSM", "size": 31},       {"name": "DBM", "size": 8},       {"name": "IFD", "size": 14},       {"name": "SMD", "size": 16}      ]     },     {      "name": "Enterprise",      "children": [       {"name": "ALM", "size": 4}, 	  {"name": "ERM", "size": 7}      ]     }, 	{      "name": "Finance",      "children": [       {"name": "GST", "size": 53},       {"name": "PEM", "size": 31},       {"name": "HKM", "size": 7},       {"name": "NOS", "size": 16}      ]     }, 	{      "name": "GMIM",      "children": [       {"name": "DVP", "size": 7}, 	  {"name": "DVR", "size": 4}, 	  {"name": "REU", "size": 4}      ]     }, 	{      "name": "Private Bank",      "children": [       {"name": "PBD", "size": 11}, 	  {"name": "PBI", "size": 3}      ]     }, 	{      "name": "Risk Mgmt",      "children": [       {"name": "CCR", "size": 32},       {"name": "CEL", "size": 21},       {"name": "GRC", "size": 15},       {"name": "RSM", "size": 27}      ]     }    ]   },   {    "name": "Increased Volumes",    "children": [     {      "name": "Asset Mgmt",      "children": [       {"name": "AMS", "size": 39},       {"name": "CDO", "size": 12},       {"name": "EDM", "size": 14},       {"name": "POM", "size": 7}      ]     },     {      "name": "Data Warehouse",      "children": [       {"name": "BBD", "size": 34},       {"name": "CSM", "size": 31},       {"name": "DBM", "size": 8},       {"name": "IFD", "size": 14},       {"name": "SMD", "size": 16}      ]     },     {      "name": "Enterprise",      "children": [       {"name": "ALM", "size": 4}, 	  {"name": "ERM", "size": 7}      ]     }, 	{      "name": "Finance",      "children": [       {"name": "GST", "size": 53},       {"name": "PEM", "size": 31},       {"name": "HKM", "size": 7},       {"name": "NOS", "size": 16}      ]     }, 	{      "name": "GMIM",      "children": [       {"name": "DVP", "size": 7}, 	  {"name": "DVR", "size": 4}, 	  {"name": "REU", "size": 14}      ]     }, 	{      "name": "Private Bank",      "children": [       {"name": "PBD", "size": 11}, 	  {"name": "PBI", "size": 13}      ]     }, 	{      "name": "Risk Mgmt",      "children": [       {"name": "CCR", "size": 2},       {"name": "CEL", "size": 21},       {"name": "GRC", "size": 15},       {"name": "RSM", "size": 27}      ]     }    ]   },   {    "name": "Capacity",    "children": [     {      "name": "Asset Mgmt",      "children": [       {"name": "AMS", "size": 39},       {"name": "CDO", "size": 12},       {"name": "EDM", "size": 4},       {"name": "POM", "size": 7}      ]     },     {      "name": "Data Warehouse",      "children": [       {"name": "BBD", "size": 34},       {"name": "CSM", "size": 31},       {"name": "DBM", "size": 8},       {"name": "IFD", "size": 14},       {"name": "SMD", "size": 16}      ]     },     {      "name": "Enterprise",      "children": [       {"name": "ALM", "size": 4}, 	  {"name": "ERM", "size": 7}      ]     }, 	{      "name": "Finance",      "children": [       {"name": "GST", "size": 53},       {"name": "PEM", "size": 31},       {"name": "HKM", "size": 7},       {"name": "NOS", "size": 16}      ]     }, 	{      "name": "GMIM",      "children": [       {"name": "DVP", "size": 7}, 	  {"name": "DVR", "size": 4}, 	  {"name": "REU", "size": 14}      ]     }, 	{      "name": "Private Bank",      "children": [       {"name": "PBD", "size": 11}, 	  {"name": "PBI", "size": 13}      ]     }, 	{      "name": "Risk Mgmt",      "children": [       {"name": "CCR", "size": 32},       {"name": "CEL", "size": 21},       {"name": "GRC", "size": 15},       {"name": "RSM", "size": 27}      ]     }    ]   },   {    "name": "Platform",    "children": [     {      "name": "Asset Mgmt",      "children": [       {"name": "AMS", "size": 39},       {"name": "CDO", "size": 12},       {"name": "EDM", "size": 14},       {"name": "POM", "size": 7}      ]     },     {      "name": "Data Warehouse",      "children": [       {"name": "BBD", "size": 34},       {"name": "CSM", "size": 31},       {"name": "DBM", "size": 8},       {"name": "IFD", "size": 14},       {"name": "SMD", "size": 16}      ]     },     {      "name": "Enterprise",      "children": [       {"name": "ALM", "size": 4}, 	  {"name": "ERM", "size": 7}      ]     }, 	{      "name": "Finance",      "children": [       {"name": "GST", "size": 53},       {"name": "PEM", "size": 31},       {"name": "HKM", "size": 7},       {"name": "NOS", "size": 16}      ]     }, 	{      "name": "GMIM",      "children": [       {"name": "DVP", "size": 7}, 	  {"name": "DVR", "size": 4}, 	  {"name": "REU", "size": 14}      ]     }, 	{      "name": "Private Bank",      "children": [       {"name": "PBD", "size": 11}, 	  {"name": "PBI", "size": 13}      ]     }, 	{      "name": "Risk Mgmt",      "children": [       {"name": "CCR", "size": 32},       {"name": "CEL", "size": 1},       {"name": "GRC", "size": 15},       {"name": "RSM", "size": 27}      ]     }    ]   },   {    "name": "Code/Bug",    "children": [     {      "name": "Asset Mgmt",      "children": [       {"name": "AMS", "size": 39},       {"name": "CDO", "size": 12},       {"name": "EDM", "size": 14},       {"name": "POM", "size": 7}      ]     },     {      "name": "Data Warehouse",      "children": [       {"name": "BBD", "size": 34},       {"name": "CSM", "size": 31},       {"name": "DBM", "size": 8},       {"name": "IFD", "size": 14},       {"name": "SMD", "size": 16}      ]     },     {      "name": "Enterprise",      "children": [       {"name": "ALM", "size": 4}, 	  {"name": "ERM", "size": 7}      ]     }, 	 {      "name": "Finance",      "children": [       {"name": "GST", "size": 3},       {"name": "PEM", "size": 31},       {"name": "HKM", "size": 7},       {"name": "NOS", "size": 16}      ]     }, 	{      "name": "GMIM",      "children": [       {"name": "DVP", "size": 7}, 	  {"name": "DVR", "size": 4}, 	  {"name": "REU", "size": 14}      ]     }, 	{      "name": "Private Bank",      "children": [       {"name": "PBD", "size": 11}, 	  {"name": "PBI", "size": 13}      ]     }, 	{      "name": "Risk Mgmt",      "children": [       {"name": "CCR", "size": 32},       {"name": "CEL", "size": 21},       {"name": "GRC", "size": 15},       {"name": "RSM", "size": 27}      ]     }    ]   },   {    "name": "New Release/Bug",    "children": [     {      "name": "Asset Mgmt",      "children": [       {"name": "AMS", "size": 39},       {"name": "CDO", "size": 12},       {"name": "EDM", "size": 14},       {"name": "POM", "size": 7}      ]     },     {      "name": "Data Warehouse",      "children": [       {"name": "BBD", "size": 34},       {"name": "CSM", "size": 31},       {"name": "DBM", "size": 8},       {"name": "IFD", "size": 14},       {"name": "SMD", "size": 16}      ]     },     {      "name": "Enterprise",      "children": [       {"name": "ALM", "size": 4}, 	  {"name": "ERM", "size": 7}      ]     }, 	{      "name": "Finance",      "children": [       {"name": "GST", "size": 53},       {"name": "PEM", "size": 31},       {"name": "HKM", "size": 7},       {"name": "NOS", "size": 16}      ]     }, 	{      "name": "GMIM",      "children": [       {"name": "DVP", "size": 7}, 	  {"name": "DVR", "size": 4}, 	  {"name": "REU", "size": 14}      ]     }, 	{      "name": "Private Bank",      "children": [       {"name": "PBD", "size": 11}, 	  {"name": "PBI", "size": 13}      ]     }, 	{      "name": "Risk Mgmt",      "children": [       {"name": "CCR", "size": 32},       {"name": "CEL", "size": 21},       {"name": "GRC", "size": 15},       {"name": "RSM", "size": 27}      ]     }    ]   },   {    "name": "Other",    "children": [     {      "name": "Asset Mgmt",      "children": [       {"name": "AMS", "size": 3},       {"name": "CDO", "size": 12},       {"name": "EDM", "size": 14},       {"name": "POM", "size": 7}      ]     },     {      "name": "Data Warehouse",      "children": [       {"name": "BBD", "size": 4},       {"name": "CSM", "size": 31},       {"name": "DBM", "size": 8},       {"name": "IFD", "size": 14},       {"name": "SMD", "size": 6}      ]     },     {      "name": "Enterprise",      "children": [       {"name": "ALM", "size": 4}, 	  {"name": "ERM", "size": 7}      ]     }, 	{      "name": "Finance",      "children": [       {"name": "GST", "size": 53},       {"name": "PEM", "size": 31},       {"name": "HKM", "size": 7},       {"name": "NOS", "size": 16}      ]     }, 	{      "name": "GMIM",      "children": [       {"name": "DVP", "size": 7}, 	  {"name": "DVR", "size": 4}, 	  {"name": "REU", "size": 14}      ]     }, 	{      "name": "Private Bank",      "children": [       {"name": "PBD", "size": 11}, 	  {"name": "PBI", "size": 13}      ]     }, 	{      "name": "Risk Mgmt",      "children": [       {"name": "CCR", "size": 32},       {"name": "CEL", "size": 21},       {"name": "GRC", "size": 15},       {"name": "RSM", "size": 27}      ]     }    ]   }   ] }';
  var root = JSON.parse( jsonData );
  _.each(root, function(element, index, list){
      element.size = +element.size;
      //console.log(JSON.stringify(element));
  });

var preppedData = genJSON(root, arrGrpByIn);
preppedData["name"]="drilldown";
//console.log(JSON.stringify(preppedData));
root = preppedData;
  partition.nodes(root);
  y.domain([0, root.value]).nice();
  down(root, 0);
//});


function down(d, i) {
	
	//console.log(d,i);
	
	//if (d.depth>0) { return; } 
	
  if (!d.children || this.__transition__) { 
	if (!!d.content) { contenttableIn.attr("class", "contenttable").html(d.content); 
	hide_show_table_analysis("tb_drilldown_newbug","button_id_newbug");
	$('#tb_drilldown_newbug').paging({limit:10});
	
} else {  contenttableIn.html(""); }
			return; }
  
  
  
 //console.log(d); 
  var nullList = 0;
  d.children.forEach(function(e,idx){ 
	if (!!!e.children) { // !e.children ||  typeof e.children === 'undefined'
		nullList = 1; 
		//if (!!d.content) { contenttableIn.attr("class", "contenttable").html(d.content); } else { contenttableIn.html(""); }
		return; }  
	});
	//if (nullList) return;

  var end = duration + d.children.length * delay;
	
	barHeight = (width / (1*d.children.length)) > barHeightMax ? barHeightMax : ( (width / (1*d.children.length)) < barHeightMin ? barHeightMin : (width / (1*d.children.length)) ) ;
	var totalHeight = d.children.length * barHeight * 1.2 + 2 * padding ;
	//xAxis.attr("x1", ( ( totalHeight - 2 * padding ) / width )* 100 +"%");
	navPath.html(navPathBuilder(d).split(':').slice(1).join(':'));
		
  // Mark any currently-displayed bars as exiting.
  var exit = svg.selectAll(".enter")
      .attr("class", "exit");

  // Entering nodes immediately obscure the clicked-on bar, so hide it.
  exit.selectAll("rect").filter(function(p) { return p === d; })
      .style("fill-opacity", 1e-6);

	  // Update the x-scale domain.
  y.domain([0, d3.max(d.children, function(d) { return d.value; })]).nice();
  
  /*svg.select(".y.axis, path")
  .style("shape-rendering","crispEdges").style("fill","none").style("fill-opacity","1").style("stroke","black")
  .style("stroke-opacity","1").style("stroke-width","1px");*/
  
 
  
  // Update the x-axis.
  svg.selectAll(".y.axis").transition()
      .duration(duration)//.style("shape-rendering","crispEdges")
      .call(yAxis);
	
  //console.log($('.y.axis').find('.domain'));

  $('.y.axis').find('path').css({
	  'shape-rendering': 'crispEdges', 'fill': 'none', 
	  'fill-opacity': '1', 'stroke': 'black', 'stroke-opacity': 1, 'stroke-width': '1px'});
  
  $('.y.axis').find('g').find('line').css({
	  'shape-rendering': 'crispEdges', 'fill': 'none', 
	  'fill-opacity': '1', 'stroke': 'black', 'stroke-opacity': 1, 'stroke-width': '1px'});
  
  $('.y.axis').find('g').find('text').css({
	  'text-anchor': 'end', 'font': '8px sans-serif'});
  
  if (!nullList) { 
  // Enter the new bars for the clicked-on data.
  // Per above, entering bars are immediately visible.
  //console.log(d);
	var enter2 = bar2(d);
	enter2.forEach(function(e,idx){
		//.attr("transform", stack(i))
		e.style("opacity", 1);
	});
      
	  // Have the text fade-in, even though the bars are visible.
	// Color the bars as parents; they will fade to children if appropriate.
	enter2.forEach(function(e,idx){
		e.select("text").style("fill-opacity", 1).style("fill","white"); //1e-6
		e.select("rect").style("fill", function(d,i) { return color(true)}); // color3(d.name); });//
	});
  
  
	// Transition entering bars to their new position.
	var enterTransition2List=[],enterTransition2; 
	enter2.forEach(function(e,idx){
		enterTransition2 = e.transition()
		.duration(duration)
		.delay(function(d, i) { return i * delay; })
		;//.attr("transform", stack(idx));
	  
	  enterTransition2List.push(enterTransition2);
	  });
	  
	  legendNames = [];

	// Transition entering rects to the new x-scale.
	enterTransition2List.forEach(function(e,idx){
		e.select("text").attr("transform", stack2(idx) );
		
		e.select("rect")
		 .attr("height", function(d) { if(legendNames.indexOf(d.name) == -1) { legendNames.push(d.name); } //console.log(legendNames,d.name,d.value); 
			return height - y(d.value); }) // height - y(d.value) 
		 .attr("transform", stack2(idx))
		 .style("fill", function(d,i) { return color3(d.name); }); //function(d) { return color(!!d.children); });
	});
  
	legend(legendNames, totalHeight);
  
	}
	
  var enter = bar(d)
      .attr("transform", stack(i))
      .style("opacity", 0);
	  
	  

  
  
  enter.select("text").style("fill-opacity", 1e-6);//.attr("transform", "rotate(-90)");
  //enter.select("rect").style("fill", function(d,i) { return color(true)}); // color3(d.name); });//
  
  //---


	trendlineData = [];
	
var enterTransition = enter.transition()
    .duration(duration)
    .delay(function(d, i) { return i * delay; })
    .attr("transform", function(d, i) { var obj = {"x":( barHeight * i * 1.2 + barHeight/2 ), "y": (y(d.value)), "z": d.value, "s": i }; 
    	trendlineData.push(obj);
		//svg.append("circle").attr("cx", ( padding+barHeight * i * 1.2 + barHeight/2 )).attr("cy", (y(d.value))).attr("r", 2); // height - y(d.value) 
		return "translate(" + barHeight * i * 1.2 + ",0)"; }).style("opacity", 1);
	
// Transition entering text.
enterTransition.select("text")
    .style("fill-opacity", 1)
    .attr("transform", "translate(" + xlabelX +","+ xlabelY + ") rotate(-45)");
    
	

enterTransition.select("rect")
    .attr("height", function(d) { return height - y(d.value); })//.style("opacity", 0)
    ;//.style("fill", function(d,i) { return color3(d.name); });//function(d) { return color(!!d.children); });
	
	if (!nullList) { enterTransition.select("rect").style("opacity", 0); }
	  else { enterTransition.select("rect").style("fill", function(d,i) { return color3(d.name); }); }
	  
	//drawtrendline(svg, trendlineData);
	
// Transition exiting bars to fade out.
var exitTransition = exit.transition()
    .duration(duration)
    .style("opacity", 1e-6)
    .remove();


  // Transition exiting bars to the new x-scale.
  //exitTransition.selectAll("rect").attr("height", function(d) { return y(d.value); });

  // Rebind the current node to the background.
  svg.select(".background")
	.datum(d)
    .transition()
    .duration(end);

  d.index = i;
}

function up(d) {
  contenttableIn.html("");
  
  if (!d.parent || this.__transition__) return;
  var end = duration + d.children.length * delay;

	barHeight = (width / (1*d.parent.children.length)) > barHeightMax ? barHeightMax : ( (width / (1*d.parent.children.length)) < barHeightMin ? barHeightMin : (width / (1*d.parent.children.length)) );
	var totalHeight = d.parent.children.length * barHeight * 1.2 + 2 * padding ;
	//xAxis.attr("x1", ( ( totalHeight - 2 * padding ) / width )* 100 +"%");
	navPath.html(navPathBuilder(d.parent).split(':').slice(1).join(':'));
	
  // Mark any currently-displayed bars as exiting.
  var exit = svg.selectAll(".enter")
      .attr("class", "exit");

	  // Update the x-scale domain.
  y.domain([0, d3.max(d.parent.children, function(d) { return d.value; })]).nice();

  // Update the x-axis.
  svg.selectAll(".y.axis").transition()
      .duration(duration)
      .call(yAxis);
	  
	  var enter2 = bar2(d.parent);
  enter2.forEach(function(e,idx){
	//e.attr("transform", stack(d.index))
      e.style("opacity", 1);
  });
	  
  // Enter the new bars for the clicked-on data's parent.
  var enter = bar(d.parent)
      .attr("transform", function(d, i) { return "translate(" + barHeight * i * 1.2 + ",0)"; })
      .style("opacity", 1e-6);

  // Color the bars as appropriate.
  // Exiting nodes will obscure the parent bar, so hide it.
  
  enter2.forEach(function(e,idx){
	e.select("text").style("fill-opacity", 1).style("fill","white"); //1e-6
	e.select("rect").style("fill", function(d,i) { return color(true)}); // color3(d.name); });//
  });
  
  enter.select("rect")
      //.style("fill", function(d,i) { return color3(d.name); }) //function(d) { return color(!!d.children); })
    .filter(function(p) { return p === d; })
      .style("fill-opacity", 1e-6);
	
  //---

  // Transition entering bars to their new position.
  var enterTransition2List=[],enterTransition2; 
  enter2.forEach(function(e,idx){
	enterTransition2 = e.transition()
      .duration(duration)
      .delay(function(d, i) { return i * delay; })
      ;//.attr("transform", stack(idx));
	  
	  enterTransition2List.push(enterTransition2);
	  });
  
  
  trendlineData = [];
  
  // Transition entering bars to fade in over the full duration.

  // Transition entering bars to fade in over the full duration.
  var enterTransition = enter.transition()
      .duration(end)
      .style("opacity", function(d,i) { var obj = {"x":( barHeight * i * 1.2 + barHeight/2 ), "y": (y(d.value)), "z": d.value, "s": i}; 
      	trendlineData.push(obj);
		return 1;});

	  legendNames = [];
	  
	  enterTransition2List.forEach(function(e,idx){
		e.select("text").attr("transform", stack2(idx));
		
		e.select("rect")
		 .attr("height", function(d) { return height - y(d.value); }) //console.log(d.name,d.value); 
		 .attr("transform", stack2(idx))
		 .style("fill", function(d,i) { if (legendNames.indexOf(d.name) == -1) { 
				legendNames.push(d.name);}
			return color3(d.name); });   //function(d) { return color(!!d.children); });
		});
		
			
	legend(legendNames,totalHeight);
			
	enterTransition.select("text")
      .style("fill-opacity", 1)
      .attr("transform", "translate(" + xlabelX +","+ xlabelY + ") rotate(-45)");
	  
  // Transition entering rects to the new x-scale.
  // When the entering parent rect is done, make it visible!
  enterTransition.select("rect")
      .attr("height", function(d) { return height - y(d.value); }).style("opacity", 0)
      .each("end", function(p) { if (p === d) d3.select(this).style("fill-opacity", null); });

  //drawtrendline(svg, trendlineData);
  // Transition exiting bars to the parent's position.
  var exitTransition = exit.selectAll("g").transition()
      .duration(duration)
      .delay(function(d, i) { return i * delay; })
      .attr("transform", stack(d.index));

  // Transition exiting text to fade out.
  exitTransition.select("text")
      .style("fill-opacity", 1e-6);

  // Transition exiting rects to the new scale and fade to parent color.
  exitTransition.select("rect")
      .attr("height", function(d) { return y(d.value); })
      .style("fill", function(d,i) { return color3(d.name); }); //color(true));

  // Remove exiting nodes when the last child has finished transitioning.
  exit.transition()
      .duration(end)
      .remove();
	
  // Rebind the current parent to the background.
  svg.select(".background")
      .datum(d.parent)
    .transition()
      .duration(end);
}


// Creates a set of bars for the given data node, at the specified index.
function bar(d) {
	var nullList = 0;
    /*d.children.forEach(function(e,idx){ e.children.forEach(function(e1,idx1){ 
	if (!e1.children ||  typeof e1.children === 'undefined') {nullList = 1; return;} });
	if (nullList) return;
	});*/

  var bar = svg.insert("g", ".x.axis")
      .attr("class", "enter")
      .attr("transform", "translate("+padding+",0)")
    .selectAll("g")
      .data(d.children)
    .enter().append("g")
      .style("cursor", function(d) { return ( nullList || !d.children ) ? null : "pointer"; })
      .on("click", down);

  bar.append("text")
      .attr("x", -(height+10))
      .attr("y", barHeight / 2)
      .attr("dx", ".35em")
	  .attr("dy", ".35em")
	  .style("font-size", ( (width/85) > fontSizeMin ? (width/85) : fontSizeMin ) +"px")
      .style("text-anchor", "end")
	  //.style("writing-mode", "tb")
	  //.attr("transform", "rotate(-90)")
      .text(function(d) { return matchMonth(d.name); });
  
  bar.append("text")
  .attr("x", function(d) { return barHeight/(-14+String(d.value).length); })
  .attr("y", function(d) { return y(d.value)-10; })
  .attr("dx", ".35em")
  .attr("dy", ".35em")
  .style("font-size", ( (width/85) > fontSizeMin ? (width/85) : fontSizeMin ) +"px")
  .style("text-anchor", "start")
  //.style("writing-mode", "tb")
  //.attr("transform", "rotate(-90)")
  .text(function(d) { return d.value; });

  bar.append("rect")
	  .attr("id", function(d) { return d.name; } )
      .attr("width", barHeight)
      .attr("height", function(d) { return height - y(d.value); })
	  .attr("y", function(d) { return y(d.value); })
	  .on('mouseover',function(d,i) {
                            // update position n value
							//console.log( window.pageXOffset , window.pageYOffset );
						var cr = getCoords(document.getElementById(d.name),document.getElementById("svg"+svgIn.attr('id')));
                         var tt3g = tooltip3g.style("left", Math.max(0,cr.left)+ 'px') 
											.style("top", cr.top + 'px');

                            //.style("left", Math.max(0,(d3.event.pageX - window.pageXOffset + 20))+ 'px') 
                            //.style("top", (d3.event.pageY - window.pageYOffset + 15) + 'px');
							//console.log( d3.event.pageX , d3.event.pageY );
							
                            tt3g.select("#group").text(matchMonth(d.name));
							tt3g.select("#population").text(_comma(d.value));
                            // display DIV
                            tt3g.classed("hidden", false);
			   })
	  .on('mouseout',function() {
			   tooltip3g.classed("hidden", true);
			   });


  return bar;
}
//change something for tooltip
function getCoords(elm,svgelm) { 
	var el = elm.getBoundingClientRect(),
	svg1 = svgelm.getBoundingClientRect(); 
	//console.log( el.left , el.top );
	return {
           left: d3.event.pageX-svg1.left + 470, // d3.event.pageX-svg1.left, // el.left-svg1.left,
           top:  d3.event.pageY-svg1.top // d3.event.pageY-svg1.top // el.top-svg1.top
         }
}

// Creates a set of bars for the given data node, at the specified index.
function bar2(d) {
	var bar, barList=[] ;
	d.children.forEach(function(e,idx){
	bar = svg.insert("g", ".x.axis")
		.attr("class", "enter")
		.attr("transform", "translate("+padding+",0)")
		.selectAll("g")
		.data(e.children)
		.enter().append("g")
		//.style("cursor", function(d) { return !d.children ? null : "pointer"; })
		;//.on("click", down);
		
		

  bar.append("rect")
      .attr("width", barHeight)
	  //.attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });
	  
	  bar.append("text")
      .attr("x", barHeight / 2 - 5 )
      .attr("y", function(d) { return (height - y(d.value))/2 ; })
      .attr("dy", ".35em")
	  .attr("dx", ".35em")
	  .style("font-size", ( (width/65) > fontSizeMin ? (width/65) : fontSizeMin ) +"px")
      .style("text-anchor", "middle") // start end middle 
      .text(function(d) { return d.value; });
	  
	  
	  /*
	  .on('mouseover',function(d,i) {
                            // update position n value
                         var tt3g = d3.select("#tooltip3g")
                            .style("left", (d3.event.pageX - 20)+ 'px') 
                            .style("top", (d3.event.pageY + 15) + 'px');
							
                            tt3g.select("#group").text(d.name);
							tt3g.select("#population").text(_comma(d.value));
                            // display DIV
                            d3.select("#tooltip3g").classed("hidden", false);
			   })
	  .on('mouseout',function() {
			   d3.select("#tooltip3g").classed("hidden", true);
			   });*/
	
	barList.push(bar);
	
	});
	
	/*
  var bar = svg.insert("g", ".y.axis")
      .attr("class", "enter")
      .attr("transform", "translate(0,5)")
    .selectAll("g")
      .data(d.children.children)
    .enter().append("g")
      .style("cursor", function(d) { return !d.children ? null : "pointer"; })
      ;//.on("click", down);*/

  


  return barList;
}

// A stateful closure for stacking bars horizontally.
function stack(i) {
  var x0 = 0;
  return function(d) {
    var tx = "translate(" + barHeight * i * 1.2 + "," + x0 + ")";
    x0 += (y(d.value)); // (height - y(d.value))
    return tx;
  };
}

function stack2(i, ind) {
  var x0 = 0;
  return function(d) {
    var tx = "translate(" + barHeight * i * 1.2 + "," + ( y(d.value) - x0 )+ ")";
    x0 += (height - y(d.value)); // (height - y(d.value))
	if(!!ind) { tx = "rotate(-90," + barHeight * i * 1.2 + "," + ( y(d.value) - x0 )+ ")"; }
    return tx;
  };
}



function legend(legendArr, startX1) {


legendArr.sort(function(b,a) {return (a > b) ? 1 : ((b > a) ? -1 : 0);} );

var strLine = "";// "Trend";

if(!!strLine) { legendArr = [strLine].concat(legendArr); }

var arrSize = legendArr.length, legengNum = 3;

var gap = 60, px = width, py = height/2;
// max len 25 char  
var maxLen = d3.max(legendArr, function(d) { return String(d).length * 0.5; }) ;
gap = 11*maxLen+12;

//var startX = padding, startY = height + margin.top + 20;
var startX = padding, startY = height +85;

//svg.selectAll(".legend").remove();
//console.log(legendArr.slice().reverse());
var legend3g = svg.selectAll(".legend")
      .data(legendArr.slice().reverse())
	  .enter().append("g")
      .attr("class", "legend enter")        
      .attr("transform", function(d, i) { 
   return "translate("+ ( startX + ( (i)%legengNum )*gap ) +"," + ( startY + ( ( ((i)/legengNum) | 0 )*20) ) + ")"; });

  legend3g.append("rect")
      //.attr("x", function(d, i) { return px + 5 ; } )
      .attr("width", function(d,i) { if(d==strLine) {return px/50 + 10;} else { return px/50; } } )
      .attr("height", function(d,i) { if(d==strLine) {return 4;} else { return py/15; } })
      .style("fill", function(d,i) { if(d==strLine) {return  color(true);} else { return color3(d); } });

  legend3g.append("text")
      .attr("x", function(d, i) { if(d==strLine) {return px/50 + 12;} else { return px/50 + 2;} } )
      .attr("y", py/30)
	  .style("font-size", ( (px/105) > fontSizeMin ? (px/105) : fontSizeMin ) +"px")
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return d; });
  
}
  
  
  /*
  var legend3g1 = svg.selectAll(".legend1")
  .data([1])
  .enter().append("g")
  .attr("class", "legend enter")
  .attr("transform", function(d, i) { return "translate("+ ( startX + ( ((i)/legengNum) | 0)*gap ) +"," + ( startY + ( ( (i)%legengNum )*20) ) + ")"; });

  
  legend3g1.append("line")
	.attr("stroke",function(d,i) { return color(true);})
	.attr("stroke-width",2)
	.style("fill", "none")
    .attr("x1", 0)   // x(arr[0]) 
    .attr("y1", 0)  // y(arr[1])
    .attr("x2", 10)  
    .attr("y2", 0);

  legend3g1.append("text")
  .attr("x", function(d, i) { return px/50 + 5; } )
  .attr("y", py/30 - 8)
  .style("font-size", ( (px/95) > fontSizeMin ? (px/95) : fontSizeMin ) +"px")
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .text(function(d) { return "Trend"; });*/
	


/*function matchMonth(strMonth) {
	var mapMonth = { "01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"Jun",
		"07":"Jul","08":"Aug","09":"Feb","10":"Oct","11":"Nov","12":"Dec"
		};
	var str = strMonth;
	var matches = String(strMonth).match(/(\d{4})-(\d{2})/); // 2014-01 
	if (matches) {
 
	str = matches[1] + '-' + mapMonth[matches[2]];
	}
	return str;
	}*/




function matchMonth(strMonth) {
	var mapMonth = { "01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"Jun",
		"07":"Jul","08":"Aug","09":"Sep","10":"Oct","11":"Nov","12":"Dec"
		};
	var str = strMonth;
	var matches = String(strMonth).match(/(\d{4})-(\d{2})/); // 2014-01 
	if (matches) {
    // matches[1] = digits of first number
    // matches[2] = digits of second number
	str = mapMonth[matches[2]] + '-' + matches[1].substr(2,4) ; //matches[1] + '-' + mapMonth[matches[2]];
	}
	return str;
	}






function navPathBuilder(d) {
	//console.log(d); 
	if (!d.parent || this.__transition__) return '';
	return navPathBuilder(d.parent) +' : ' + matchMonth(d.name);
	}


function genJSON(csvData, groups) {

    var genGroups = function(data) {
      return _.map(data, function(element, index) {
        return { name : index, children : element };
      });
    };

    var nest = function(node, curIndex) {
      if (curIndex === 0) {
        node.children = genGroups(_.groupBy(csvData, groups[0]));
        _.each(node.children, function (child) {
          nest(child, curIndex + 1);
        });
      }
      else {
        if (curIndex < groups.length) {
          node.children = genGroups(
            _.groupBy(node.children, groups[curIndex])
          );
          _.each(node.children, function (child) {
            nest(child, curIndex + 1);
          });
        }
      }
      return node;
    };
    return nest({}, 0);
  }

}


