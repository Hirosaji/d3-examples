////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////

//Quick fix for resizing some things for mobile-ish viewers
var mobileScreen = ($( window ).innerWidth() < 500 ? true : false);

//Scatterplot
var margin = {left: 30, top: 20, right: 20, bottom: 20},
	width = Math.min($("#chart").width(), 800) - margin.left - margin.right,
	height = width*2/3;
			
var svg = d3.select("#chart").append("svg")
			.attr("width", (width + margin.left + margin.right))
			.attr("height", (height + margin.top + margin.bottom));
			
var wrapper = svg.append("g").attr("class", "chordWrapper")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//////////////////////////////////////////////////////
///////////// Initialize Axes & Scales ///////////////
//////////////////////////////////////////////////////

var opacityCircles = 0.7; 

//Set the color for each region
var color = d3.scale.ordinal()
					.range(["#EFB605", "#E58903", "#E01A25", "#C20049", "#991C71", "#66489F", "#2074A0", "#10A66E", "#7EB852"])
					.domain(["Africa | North & East", "Africa | South & West", "America | North & Central", "America | South", 
							 "Asia | East & Central", "Asia | South & West", "Europe | North & West", "Europe | South & East", "Oceania"]);
							 
//Set the new x axis range
var xScale = d3.scale.log()
	.range([0, width])
	.domain([100,2e5]); //I prefer this exact scale over the true range and then using "nice"
	//.domain(d3.extent(countries, function(d) { return d.GDP_perCapita; }))
	//.nice();
//Set new x-axis
var xAxis = d3.svg.axis()
	.orient("bottom")
	.ticks(2)
	.tickFormat(function (d) { //Difficult function to create better ticks
		return xScale.tickFormat((mobileScreen ? 4 : 8),function(d) { 
			var prefix = d3.formatPrefix(d); 
			return "$" + prefix.scale(d) + prefix.symbol;
		})(d);
	})	
	.scale(xScale);	
//Append the x-axis
wrapper.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(" + 0 + "," + height + ")")
	.call(xAxis);
		
//Set the new y axis range
var yScale = d3.scale.linear()
	.range([height,0])
	.domain(d3.extent(countries, function(d) { return d.lifeExpectancy; }))
	.nice();	
var yAxis = d3.svg.axis()
	.orient("left")
	.ticks(6)  //Set rough # of ticks
	.scale(yScale);	
//Append the y-axis
wrapper.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + 0 + "," + 0 + ")")
		.call(yAxis);
		
//Scale for the bubble size
var rScale = d3.scale.sqrt()
			.range([mobileScreen ? 1 : 2, mobileScreen ? 10 : 16])
			.domain(d3.extent(countries, function(d) { return d.GDP; }));
	
////////////////////////////////////////////////////////////	
/////////////////// Scatterplot Circles ////////////////////
////////////////////////////////////////////////////////////	

//Initiate a group element for the circles
var circleGroup = wrapper.append("g")
	.attr("class", "circleWrapper"); 
	
//Place the country circles
circleGroup.selectAll("countries")
	.data(countries.sort(function(a,b) { return b.GDP > a.GDP; })) //Sort so the biggest circles are below
	.enter().append("circle")
		.attr("class", function(d,i) { return "countries " + d.CountryCode; })
		.style("opacity", opacityCircles)
		.style("fill", function(d) {return color(d.Region);})
		.attr("cx", function(d) {return xScale(d.GDP_perCapita);})
		.attr("cy", function(d) {return yScale(d.lifeExpectancy);})
		.attr("r", function(d) {return rScale(d.GDP);});
			
////////////////////////////////////////////////////////////// 
//////////////////////// Voronoi ///////////////////////////// 
////////////////////////////////////////////////////////////// 

//Initiate the voronoi function
//Use the same variables of the data in the .x and .y as used in the cx and cy of the circle call
//The clip extent will make the boundaries end nicely along the chart area instead of splitting up the entire SVG
//(if you do not do this it would mean that you already see a tooltip when your mouse is still in the axis area, which is confusing)
var voronoi = d3.geom.voronoi()
	.x(function(d) { return xScale(d.GDP_perCapita); })
	.y(function(d) { return yScale(d.lifeExpectancy); })
	.clipExtent([[0, 0], [width, height]]);

//Initiate a group element to place the voronoi diagram in
var voronoiGroup = wrapper.append("g")
	.attr("class", "voronoiWrapper");
	
//Create the Voronoi diagram
voronoiGroup.selectAll("path")
	.data(voronoi(countries)) //Use vononoi() with your dataset inside
	.enter().append("path")
	.attr("d", function(d, i) { return "M" + d.join("L") + "Z"; })
	.datum(function(d, i) { return d.point; })
	//Give each cell a unique class where the unique part corresponds to the circle classes
	.attr("class", function(d,i) { return "voronoi " + d.CountryCode; })
	//.style("stroke", "#2074A0") //I use this to look at how the cells are dispersed as a check
	.style("fill", "none")
	.style("pointer-events", "all")
	.on("mouseover", showTooltip)
	.on("mouseout",  removeTooltip);
		

///////////////////////////////////////////////////////////////////////////
/////////////////////////// Hover functions ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Show the tooltip on the hovered over circle
function showTooltip(d) {
	
	//Save the circle element (so not the voronoi which is triggering the hover event)
	//in a variable by using the unique class of the voronoi (CountryCode)
	var element = d3.selectAll(".countries."+d.CountryCode);
	
	//Define and show the tooltip using bootstrap popover
	//But you can use whatever you prefer
	$(element).popover({
		placement: 'auto top', //place the tooltip above the item
		container: '#chart', //the name (class or id) of the container
		trigger: 'manual',
		html : true,
		content: function() { //the html content to show inside the tooltip
			return "<span style='font-size: 11px; text-align: center;'>" + d.Country + "</span>"; }
	});
	$(element).popover('show');

	//Make chosen circle more visible
	element.style("opacity", 1);
					
}//function showTooltip

//Hide the tooltip when the mouse moves away
function removeTooltip(d) {

	//Save the circle element (so not the voronoi which is triggering the hover event)
	//in a variable by using the unique class of the voronoi (CountryCode)
	var element = d3.selectAll(".countries."+d.CountryCode);
	
	//Hide the tooltip
	$('.popover').each(function() {
		$(this).remove();
	}); 
	
	//Fade out the bright circle again
	element.style("opacity", opacityCircles);
	
}//function removeTooltip

//iFrame handler
//iFrame handler
var pymChild = new pym.Child();
pymChild.sendHeight()
setTimeout(function() { pymChild.sendHeight(); },5000);