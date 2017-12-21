var svgWidth = 	900
var svgHeight = 400
var offsetX = 50;
var offsetY = 30;

var dataSet = [
		{ "market":"green", "year":2013, "scale":150 },
		{ "market":"yellow", "year":2015, "scale":411 },
		{ "market":"red", "year":2015, "scale":2830 },
		{ "market":"blue", "year":2015, "scale":3469 },
		{ "market":"red", "year":2019, "scale":8270 },
		{ "market":"yellow", "year":2020, "scale":1011 },
		{ "market":"blue", "year":2020, "scale":3379 },
		{ "market":"green", "year":2025, "scale":3350 }
	];	// シェアエコノミー:"green", 電子商取引:"red", アプリ:"yellow", スアホ端末:"blue"

/*
var dataSet = [
		["green", 2013, 150], ["yellow", 2015, 411], ["red", 2015, 2830], ["blue", 2015, 3469],
		["red", 2019, 8270], ["yellow", 2020, 1011], ["blue", 2020, 3379], ["green", 2025, 3350]
	];
*/

var xScale = d3.scale.linear()
	.domain([2012, 2025])
	.range([0, svgWidth])
var yScale = d3.scale.linear()
	.domain([-1000, 10000])
	.range([svgHeight, 0])

var svg = d3.select("#myGraph");

// circleの描画
var circleElements = svg
	.selectAll("circle")
	.data(dataSet)
circleElements
	.enter()
	.append("circle")
	.attr("class", "mark")
	.attr("cx", function(d){
		return xScale(d.year) + offsetX;
	})
	.attr("cy", function(d){
		return yScale(d.scale) + offsetY;
	})
	.attr("r", function(d){
		return d.scale / 90;
	})
	.attr("fill", function(d){
		return d.market;
	})
	
	/*
	.attr("cx", function(d, i){
		return d[1] + offsetX;
	})
	.attr("cy", function(d, i){
		return svgHeight - d[2] - offsetY;
	})
	.attr("r", function(d, i){
		return d[2] / 100;
	})
	.attr("fill", function(d, i){
		return d[0];
	})
	*/


// 目盛りの描画
d3.select("#myGraph")
	.append("g")
	.attr("class", "axis")
	.attr("transform", "translate("+offsetX+", "+(svgHeight+30)+")")
	.call(
		d3.svg.axis()
			.scale(xScale)
			.orient("bottom")
			.ticks(7)
		)
d3.select("#myGraph")
	.append("g")
	.attr("class", "axis")
	.attr("transform", "translate("+offsetX+", "+offsetY+")")
	.call(
		d3.svg.axis()
			.scale(yScale)
			.orient("left")
		)
	.selectAll("text")
	.attr("y", -8)

// グリッドの生成
var grid = svg.append("g");
var rangeX = d3.range(2014, 2025, 2);
var rangeY = d3.range(-2000, 10000, 1000);
grid
	.selectAll("line.y")
	.data(rangeY)
	.enter()
	.append("line")
	.attr("class", "grid")
	.attr("x1", 5)
	.attr("y1", function(d){
		return yScale(d)-6;
	})
	.attr("x2", svgWidth + offsetX)
	.attr("y2", function(d){
		return yScale(d)-6;
	})
grid
	.selectAll("line.x")
	.data(rangeX)
	.enter()
	.append("line")
	.attr("class", "grid")
	.attr("x1", function(d){
		return xScale(d) + offsetX;
	})
	.attr("y1", svgHeight + offsetY)
	.attr("x2", function(d){
		return xScale(d) + offsetX;
	})
	.attr("y2", offsetY)

// ツールチップを生成
var tooltip = d3.select("body")
	.append("div")
	.attr("class", "tip")

// ツールチップを表示
circleElements
	.on("mouseover", function(d){
		var x = parseInt(xScale(d.year));
		var y = parseInt(yScale(d.scale));
		var data = d3.select(this).datum();
		var dx = parseInt(d.year);
		var dy = parseInt(d.scale);
		tooltip
			.style("visibility", "visible")
			.text(dx + ", " + dy)
		d3.select(this).style("opacity", 1.00)
	})
	.on("mousemove", function(d){
		tooltip
			.style("top", (d3.event.pageY - 10) + "px")
			.style("left",(d3.event.pageX + 10) + "px")
	})
	.on("mouseout", function(d){
		tooltip.style("visibility", "hidden")
		d3.select(this).style("opacity", 0.50)
	})