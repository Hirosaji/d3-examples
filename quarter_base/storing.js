var svgWidth = 1092;
var svgHeight = 300;
var offsetLeft = 53;
var offsetTop = 10;
var offsetBottom = 25;
var xAxisMargin = 80;

d3.csv("quarter_base.csv", function(error, data){

	// svg空間の設定
	var svg = d3.select("#quarterBase")
		.append("svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight)
	// ラッパーの設定
	var wrapper = svg.append("g")
		.attr("transform", "translate(" + offsetLeft + "," + offsetTop + ")")

	// x軸目盛りのスケールを設定
	var xScale = d3.scale.ordinal()
		.domain(data.map(function(d, i){ return d["Past GDP"] }))
		.rangePoints([xAxisMargin, svgWidth-offsetLeft-xAxisMargin])
	// y軸目盛りのスケールを設定
	var yScale = d3.scale.linear()
		.domain([-60, 50])
		.range([svgHeight-offsetTop-offsetBottom, 0])

	// mouseover event(tooltip)の設定と準備
	var tooltip = d3.select("body")
				.append("div")
				.attr("class", "quarterBaseTip")
	var margin = (svgWidth-offsetLeft-(2*xAxisMargin)) / (data.length - 1);

	// グラフと目盛りを描画
	drawAxis();
	drawGraph(data, "純利益の前年同期比増増減率％", "lineElement");

	// 折れ線グラフを表示するための関数
	function drawGraph(dataSet, quarterRate, cssLine){
		
		// 折れ線グラフの座標値を計算するメソッド
		var line = d3.svg.line()
			.x(function(d, i){
				return xScale(d["Past GDP"]);
			})
			.y(function(d, i){
				return yScale(d[quarterRate]);
			})

		// 折れ線グラフを描画
		var lineElements = wrapper.append("path")
			.attr("class", cssLine)
			.attr("d", line(dataSet))

		// mouseover event(tooltip)の描画
		// circleの描画
		var circleElements = wrapper.selectAll("quarter")
			.data(dataSet)
			.enter()
			.append("circle")
			.attr("class", "circleElement")
			.attr("cx", function(d, i){ return margin * i + xAxisMargin; })
			.attr("cy", function(d, i){ return yScale(d[quarterRate]); })
			.attr("r", 5)
			.on("mouseover", function(d, i){
				d3.select(this).attr("class", "circleElement2")

			    var x = margin * i + xAxisMargin;
			    var y = yScale(d[quarterRate]);
			    var onData = d3.select(this).datum();
			    var dy = onData[quarterRate];

			    tooltip.style("left", offsetLeft + x + "px")
			      .style("top", y + offsetTop + offsetBottom + "px")
			      .style("width", 190 + "px")
			      .style("height", 15 + "px")
			      .style("visibility", "visible")
			      .text(quarterRate + "　" + dy)

			})
			.on("mouseout", function(){				
				tooltip.style("visibility", "hidden")
				d3.select(this).attr("class", "circleElement")
			})

	}

	// グラフの目盛りを表示するための関数
	function drawAxis(){

		// x軸目盛りを表示
		wrapper.append("g")
			.attr("class", "axis axisRid")
			.attr("transform", "translate(" + 0 + ", " + (svgHeight - offsetTop - offsetBottom) + ")")
			.call(
		 		d3.svg.axis()
		  			.scale(xScale)
		  			.orient("bottom")
		  			.innerTickSize(-(svgHeight-offsetTop-offsetBottom))
		  			.tickPadding(6)
		  			.tickValues(["15/6", "15/9", "15/12", "16/3", "16/6", "16/9"])
		  	)
		// y軸目盛りを表示
		wrapper.append("g")
			.attr("class", "axis axisRid")
			.call(
		  		d3.svg.axis()
		  			.scale(yScale)
		  			.orient("left")
		  			.innerTickSize(-(svgWidth-offsetLeft))
		  			.ticks(10)
		  	)
			.append("text")

		// y軸のラベルを表示
		svg.append("text")
			.attr("class", "y--label")
			.attr("text-anchor", "middle")
			.attr("transform", "translate(" + (offsetLeft/3) + "," + (svgHeight/2) + ") rotate(-90)")
			.text("純利益の前年同期比増増減率％")

	}

})
