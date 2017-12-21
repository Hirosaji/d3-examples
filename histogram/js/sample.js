var svgWidth = 320;
var svgHeight = 240;
var yAxisHeight = svgHeight - 30;
var xAxisWidth = svgWidth - 40;
var offsetX = 30;
var offsetY = 10;
var stepX = 10;
var xScale;
var yScale;

var dataSet = [
		50, 95, 60, 44, 60, 50, 35, 20, 10, 8,
		56, 70, 65, 42, 22, 33, 40, 53, 52, 89,
		90, 55, 50, 55, 65, 72, 45, 35, 15, 45
	];

// ヒストグラムを設定
var histogram = d3.layout.histogram()
	.range([0, 100])
	.bins(d3.range(0, 100.1, stepX))

// データセットからスケールを算出
function calcScale(){
	// データセットから最大値を求める
	var maxValue = d3.max(histogram(dataSet), function(d, i){
			return d.y;	// データそのものではなく最大個数を返す
		})
	// 縦のスケールを設定
	yScale = d3.scale.linear()
		.domain([0, maxValue])
		.range([yAxisHeight, 0])
	// 横のスケールを設定
	xScale = d3.scale.linear()
		.domain([0, 100])
		.range([0, xAxisWidth ])
}
// スケール／目盛りを表示
function drawScale(){
	// 縦の目盛りを表示
	d3.select("#myGraph")
			.append("g")
			.attr("class", "axis")
			.attr("transform", "translate("+offsetX+", "+offsetY+")")
			.call(
				d3.svg.axis()
				.scale(yScale)
				.orient("left")
			)
	// 横の目盛りを表示
	d3.select("#myGraph")
			.append("g")
			.attr("class", "axis")
			.attr("transform", "translate("+offsetX+", "+(yAxisHeight + offsetY)+")")
			.call(
				d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
			)
}
// ヒストグラムの要素を設定
function drawHistgram(){
	var barElements = d3.select("#myGraph")
		.selectAll("rect")
		.data(histogram(dataSet))
		.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("x", function(d, i){
			return i * xScale(d.dx) + offsetX;
		})
		.attr("y", yAxisHeight + offsetY)
		.attr("width", function(d, i){
			return xScale(d.dx);
		})
		.attr("height", 0)
		.transition()
		.duration(1000)
		.attr("y", function(d, i){
			return yScale(d.y) + offsetY;
		})
		.attr("height", function(d, i){
			return yAxisHeight - yScale(d.y);
		})
}
// 間隔が変更されたらヒストグラムを更新
d3.select("#step").on("change", function(){
	stepX = this.value; 
	histogram
		.bins(d3.range(0, 100.1, stepX))
	d3.select("#myGraph").selectAll("*").remove();
	calcScale();
	drawHistgram();
	drawScale();
})
// 初期ヒストグラムの表示処理
calcScale();
drawHistgram();
drawScale();

