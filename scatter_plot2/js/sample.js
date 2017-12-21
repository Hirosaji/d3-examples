var svgEle = document.getElementById("myGraph");
var svgWidth = 	window.getComputedStyle(svgEle, null).getPropertyValue("width");
var svgHeight = window.getComputedStyle(svgEle, null).getPropertyValue("height");
svgWidth = parseFloat(svgWidth);
svgHeight = parseFloat(svgHeight);
var offsetX = 30;
var offsetY = 20;
var svg = d3.select("#myGraph");
var dataSet = [
		[30, 40], [120, 115], [125,90], [150, 160], [300, 190],
		[60, 40], [140, 145], [165, 110], [200, 170], [250, 190]
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
	.attr("r", 10)					// 半径を指定

// 目盛りの表示
function drawScale(){
	var maxX = d3.max(dataSet, function(d, i){
		return d[0];
	})
	var maxY = d3.max(dataSet, function(d, i){
		return d[1];
	})
	// 縦の目盛りを表示するためにD3スケールを表示
	var yScale = d3.scale.linear()
		.domain([0, maxY])
		.range([maxY, 0])
	// 目盛りを表示
	svg.append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate("+offsetX+", "+(svgHeight-maxY-offsetY)+")")
	  .call(
	  	d3.svg.axis()
	  	  .scale(yScale)
	  	  .orient("left")
	  	  )
	// 縦の目盛りを表示するためにD3スケールを表示
	var xScale = d3.scale.linear()
		.domain([0, maxX])
		.range([0, maxX])
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
	var rangeX = d3.range(50, maxX, 50);
	var rangeY = d3.range(20, maxY, 20);
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
		.attr("x2", maxX + offsetX)
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
		.attr("y2", svgHeight - offsetY - maxY)
}

// ツールチップを生成
var tooltip = d3.select("body")
				.append("div")
				.attr("class", "tip")
// ツールチップを表示
circleElements
	.on("mouseover", function(d){
		var x = parseInt(d[0]);
		var y = parseInt(d[1]);
		var data = d3.select(this).datum();
		var dx = parseInt(data[0]);
		var dy = parseInt(data[1]);
		tooltip
			.style("visibility", "visible")	// ツールチップを表示
			.text(dx +", " + dy)
	})
	.on("mousemove", function(d){
		tooltip
		.style("top", (d3.event.pageY-10)+"px")
		.style("left",(d3.event.pageX+10)+"px")
	})
	.on("mouseout", function(){
		tooltip.style("visibility", "hidden")	// ツールチップを非表示
	})

// 目盛りとグリッドを表示する
drawScale();