/*
// CSVファイルからデータセットを取得
d3.csv("mydata.csv", function(error, data){
	var dataSet = [ ];				// データを格納する配列変数
	var labelName = [ ];			// ラベルを入れる配列変数
	for(var i in data[0]){			// 最初のデータだけを処理
		dataSet.push(data[0][i]);	// 横１行全てをまとめて入れる
		labelName.push(i);			// ラベルを入れる
	}
})

*/

// SVG要素の幅と高さを求める
var svgEle = document.getElementById("myGraph");
var svgWidth = window.getComputedStyle(svgEle, null).getPropertyValue("width");
var svgHeight = window.getComputedStyle(svgEle, null).getPropertyValue("height");
svgWidth = parseFloat(svgWidth);	// 値は単位付きなんので、単位を削除する
svgHeight = parseFloat(svgHeight);	// 同上

// グラフで使用する変数
var offsetX = 30;		// x座標のオフセット（ズレ具合）
var offsetY = 20;		// y座標のオフセット（ズレ具合）
var barElements; 		// 棒グラフの棒の要素を格納する変数
var dataSet = [20, 70, 175, 80, 220, 40, 180, 70, 90, 150, 30];
var dataMax = 300;		// データの最大値
var barWidth = 20;		// 棒の横幅
var barMargin = 5;		// 棒同士の間隔

// グラフを描画
barElements = d3.select("#myGraph")
	.selectAll("rect")
	.data(dataSet)

// データの追加
barElements.enter()					// データの数だけ繰り返す
	.append("rect")					// データの数だけrect要素を生成
	.attr("class", "bar")			// CSSクラスを指定
	.attr("height", 0)
	.attr("width", barWidth)		// 横幅を指定
	.attr("x", function(d, i){		// 生成するx座標を指定
		return i * (barWidth+barMargin) + offsetX;
	})
	.attr("y", svgHeight - offsetY)		// グラフの一番下に座標を設定する
	// イベント処理
	.on("mouseover", function(){
		d3.select(this)
		  .style("fill", "red")			// 棒の塗りのスタイルを赤にする
	})
	.on("mouseout", function(){
		d3.select(this)
		  .style("fill", "orange")		// 棒の塗りのスタイルを橙に戻す
	})
	// アニメーション処理
	.transition()
	.duration(1000)						// アニメーション時間
	.delay(function(d, i){
		return i * 100;					// 0.1秒待ち
	})
	.attr("y", function(d, i){			// y座標を指定
		return svgHeight - d - offsetY; // y座標を計算
	})
	.attr("height", function(d, i){		// 横幅を指定
		return d;
	})

barElements.enter()
	.append("text")
	.attr("class", "barNum")
	.attr("x", function(d, i){
		return i * (barWidth+barMargin) + 10 + offsetX;
	})
	.attr("y", svgHeight - 5 - offsetY)
	.text(function(d, i){
		return d;
	})

// 目盛りを表示するためにスケールを設定
var yScale = d3.scale.linear()	// スケールを指定
	.domain([0, dataMax])		// 元のデータ範囲
	.range([dataMax, 0])		// 実際の出力サイズ

// 目盛りを設定し、表示する
d3.select("#myGraph").append("g")
	.attr("class", "axis")
	.attr("transform", "translate("+offsetX+", "+((svgHeight-300)-offsetY)+")")	// 目盛りの表示位置を指定
	.call(
		d3.svg.axis()
		.scale(yScale)	// スケールを適応
		.orient("left")	// 目盛りの表示位置を左側に指定
	)

// 横方向の線を表示する
d3.select("#myGraph")
	.append("rect")
	.attr("class", "barName")
	.attr("width", svgWidth)
	.attr("height", 1)
	.attr("transform", "translate("+offsetX+", "+(svgHeight-offsetY)+")")

// 横方向の棒ラベルを表示する
barElements.enter()
	.append("text")
	.attr("class", "axis_x")
	.attr("x", function(d, i){					// x座標を指定する
		return i * (barWidth+barMargin) + 5 + offsetX;			// 棒グラフの表示間隔に合わせる
	})
	.attr("y", svgHeight - offsetY + 15)
	.text(function(d, i){
		// return labelName[i];
		return ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"][i];	// ラベル名を返す
	})