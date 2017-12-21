var svgEle = document.getElementById("myGraph");
var svgWidth = 	window.getComputedStyle(svgEle, null).getPropertyValue("width");
var svgHeight = window.getComputedStyle(svgEle, null).getPropertyValue("height");
svgWidth = parseFloat(svgWidth);
svgHeight = parseFloat(svgHeight);
var offsetX = 30;
var offsetY = 20;
var svg = d3.select("#myGraph");
var dataSet = [
	[ 2013, 150, "green" ],
	[ 2015, 411, "yellow" ],
	[ 2015, 2830, "red" ],
	[ 2015, 3469, "blue" ],
	[ 2019, 8270, "red" ],
	[ 2020, 1011, "yellow" ],
	[ 2020, 3379, "blue" ],
	[ 2025, 3350, "green" ]
	];



// 散布図を描画
var circleElements = svg
	.selectAll("circle")
	.data(dataSet)
	.enter()
	.append("circle")				// データの数だけcircle要素が追加される
	.attr("class", "mark")
	.attr("cx", function(d, i){
		return d[0] + offsetX;				// １番目の要素をX座標とする
	})
	.attr("cy", function(d, i){
		return svgHeight - d[1] - offsetY;	// ２番目の要素をY座標とする
	})
	.attr("r", 5)					// 半径を指定

// 目盛りの表示
function drawScale(){
	// 縦の目盛りを表示するためにD3スケールを表示
	var yScale = d3.scale.linear()
		.domain([0, 10000])
		.range([10000, 0])
	// 目盛りを表示
	svg.append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate("+offsetX+", "+(svgHeight-10000-offsetY)+")")
	  .call(
	  	d3.svg.axis()
	  	  .scale(yScale)
	  	  .orient("left")
	  	  )
	// 縦の目盛りを表示するためにD3スケールを表示
	var xScale = d3.scale.linear()
		.domain([2012, 2026])
		.range([2012, 2026])
	// 目盛りを表示
	svg.append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate("+offsetX+", "+(svgHeight-offsetY)+")")
	  .call(
	  	d3.svg.axis()
	  	  .scale(xScale)
	  	  .orient("bottom")
	  	  )

	// グリッドを表示
	var grid = svg.append("g")
	// 横方向と縦方向のグリッド間隔を自動生成
	var rangeX = d3.range(2, 2026, 2);
	var rangeY = d3.range(1000, 10000, 1000);
	// 縦方向のグリッドを表示
	grid.selectAll("line.y")
		.data(rangeY)
		.enter()
		.append("line")
		.attr("class", "grid")
		// (x1,y1) - (x2,y2)の座標値を設定
		.attr("x1", offsetX)
		.attr("y1", function(d, i){
			return svgHeight - d - offsetY;
		})
		.attr("x2", 2026 + offsetX)
		.attr("y2", function(d, i){
			return svgHeight - d - offsetY;
		})
	// 横方向のグリッドを表示
	grid.selectAll("line.x")
		.data(rangeX)
		.enter()
		.append("line")
		.attr("class", "grid")
		// (x1,y1) - (x2,y2)の座標値を設定
		.attr("x1", function(d, i){
			return d + offsetX;
		})
		.attr("y1", svgHeight - offsetY)
		.attr("x2", function(d, i){
			return d + offsetX;
		})
		.attr("y2", svgHeight - offsetY - 10000)
}

// ツールチップを生成
var tooltip = d3.select("body")
				.append("div")
				.attr("class", "tip")
// ツールチップを表示
circleElements
	.on("mouseover", function(){
		tooltip.style("visibility", "visible");
	})
	.on("mousemove", function(d){
		var x = parseInt(d[0]);
		var y = parseInt(d[1]);
		var data = d3.select(this).datum();
		var dx = parseInt(data[0]);
		var dy = parseInt(data[1]);
		tooltip
			.style("left", offsetX + x + "px")
			.style("top", svgHeight + offsetY - y + "px")
			.style("visibility", "visible")	// ツールチップを表示
			.text(dx +", " + dy)
	})
	.on("mouseout", function(){
		tooltip.style("visibility", "hidden")	// ツールチップを非表示
	})

// 目盛りとグリッドを表示する
drawScale();