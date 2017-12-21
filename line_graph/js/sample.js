var data = [
	{ year : 1990, item1 : 95, item2 : 20, item3 : 15 },
	{ year : 1991, item1 : 65, item2 : 10, item3 : 35 },
	{ year : 1992, item1 : 45, item2 : 30, item3 : 90 },
	{ year : 1993, item1 : 10, item2 : 40, item3 : 70 },
	{ year : 1994, item1 : 22, item2 : 50, item3 : 50 },
	{ year : 1995, item1 : 35, item2 : 70, item3 : 30 },
	{ year : 1996, item1 : 40, item2 : 80, item3 : 25 },
	{ year : 1997, item1 : 25, item2 : 90, item3 : 75 },
	{ year : 1998, item1 : 15, item2 : 57, item3 : 95 },
	{ year : 1999, item1 : 45, item2 : 79, item3 : 33 },
	{ year : 2000, item1 : 75, item2 : 20, item3 : 55 },
	{ year : 2001, item1 : 55, item2 : 40, item3 : 15 },
	{ year : 2002, item1 : 30, item2 : 50, item3 : 20 },
	{ year : 2003, item1 : 20, item2 : 10, item3 : 80 },
	{ year : 2004, item1 : 10, item2 : 90, item3 : 50 },
	{ year : 2005, item1 : 47, item2 : 77, item3 : 27 },
	{ year : 2006, item1 : 65, item2 : 55, item3 : 45 },
	{ year : 2007, item1 : 8, item2 : 48, item3 : 58 },
	{ year : 2008, item1 : 64, item2 : 64, item3 : 84 },
	{ year : 2009, item1 : 99, item2 : 90, item3 : 70 },
	{ year : 2010, item1 : 75, item2 : 85, item3 : 45 },
	{ year : 2011, item1 : 22, item2 : 42, item3 : 22 },
	{ year : 2012, item1 : 63, item2 : 13, item3 : 30 },
	{ year : 2013, item1 : 80, item2 : 40, item3 : 90 }
];
var dataSet = [ ];
var svgEle = document.getElementById("myGraph");
var svgWidth = window.getComputedStyle(svgEle, null).getPropertyValue("width");
var svgHeight = window.getComputedStyle(svgEle, null).getPropertyValue("height");
svgWidth = parseFloat(svgWidth) - 60;
svgHeight = parseFloat(svgHeight) - 60;
var offsetX = 30;
var offsetY = 20;
var scale = 2.0;
var rangeYear = 10;	// 10年分を表示
var year = d3.extent(data, function(d){	// 最大値と最小値の年数を求める
	return d.year;
});
var startYear = year[0];	// 最初の年
var currentYear = 2000;		// 最初の表示基準年
var margin = svgWidth / (rangeYear - 1);		// 折れ線グラフの間隔を算出

// 最初にグラフを表示する
pickupData(data, currentYear - startYear);
drawGraph(dataSet, "item1", "itemA", "linear");	// item1の折れ線グラフを表示
drawGraph(dataSet, "item2", "itemB", "linear");	// item2の折れ線グラフを表示
drawGraph(dataSet, "item3", "itemC", "linear");	// item3の折れ線グラフを表示
drawScale();	// 目盛りを表示

// 折れ線グラフを表示するための関数
function drawGraph(dataSet, itemName, cssClassName, type){

	// 折れ線グラフの計算値を計算するメソッド
	var line = d3.svg.line()				// svgのライン
		.x(function(d, i){
			return i * margin + offsetX;	// x座標は出現順番×間隔
		})
		.y(function(d, i){
			return svgHeight - (d[itemName] * scale) - offsetY;	// y座標は、高さから各データを減算
		})
		.interpolate(type)					// 折れ線グラフの形状

	// 折れ線グラフを描画
	var lineElements = d3.select("#myGraph")
		.append("path")							// データの数だけpath要素を追加
		.attr("class", "line "+cssClassName)	// CSSクラスを指定
		.attr("d", line(dataSet))				// 連続線を指定
}

// グラフの目盛りを表示するための関数
function drawScale(){

	// 目盛りを表示するためにスケールを設定
	var yScale = d3.scale.linear()
		.domain([0, 100])
		.range([scale*100, 0])

	// 目盛りを表示
	d3.select("#myGraph")
		.append("g")
		.attr("class", "axis")
		.attr("transform", "translate("+offsetX+", "+((100-(scale-1)*100)+offsetY)+")")
		.call(
			d3.svg.axis()
			.scale(yScale)
			.orient("left")
		)

	// 横の目盛りを表示するためにD3スケールを設定
	var xScale = d3.time.scale()
		.domain([new Date(currentYear+"/1/1"), new Date((currentYear+rangeYear-1)+"/1/1")])
		.range([0, svgWidth])

	// 横方向の線を表示する
	d3.select("#myGraph")
		.append("g")
		.attr("class", "axis")
		.attr("transform", "translate("+offsetX+", "+(svgHeight-offsetY)+")")
		.call(
			d3.svg.axis()
			.scale(xScale)		// axisにスケールを適応
			.orient("bottom")	// 目盛りの表示位置を下側に指定
			.ticks(10)			// 2年に1度の表示にする
			.tickFormat(function(d, i){
				var fmtFunc = d3.time.format("%Y年%m月");	// 変換関数
				return fmtFunc(d);							// 変換した結果を返す
			})
			)
		.selectAll("text")		// 目盛りの文字を対象に処理
		.attr("transform", "rotate(90)")
		.attr("dx", "0.9em")
		.attr("dy", "-0.6em")
		.style("text-anchor", "start")
}

// 表示する範囲のデータセットを抽出し、SVG要素内を消去
function pickupData(data, start){
	dataSet = [];
	for(var i=0; i<rangeYear; i++){
		dataSet[i] = data[start + i];
	}
	d3.select("#myGraph").selectAll("*").remove();
}

// 「前へ」ボタンにイベントを割り当てる
d3.select("#prev").on("click", function(){
	if (currentYear > year[0]){
		currentYear = currentYear - 1;
	}
	// グラフを表示
	pickupData(data, currentYear - startYear);
	drawGraph(dataSet, "item1", "itemA", "linear");	// item1の折れ線グラフを表示
	drawGraph(dataSet, "item2", "itemB", "linear");	// item2の折れ線グラフを表示
	drawGraph(dataSet, "item3", "itemC", "linear");	// item3の折れ線グラフを表示
	drawScale();
})

// 「次へ」ボタンにイベントを割り当てる
d3.select("#next").on("click", function(){
	if (currentYear > year[0]){
		currentYear = currentYear + 1;
	}
	// グラフを表示
	pickupData(data, currentYear - startYear);
	drawGraph(dataSet, "item1", "itemA", "linear");	// item1の折れ線グラフを表示
	drawGraph(dataSet, "item2", "itemB", "linear");	// item2の折れ線グラフを表示
	drawGraph(dataSet, "item3", "itemC", "linear");	// item3の折れ線グラフを表示
	drawScale();
})