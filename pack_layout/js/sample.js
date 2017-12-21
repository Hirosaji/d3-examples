var svgEle = document.getElementById("myGraph");
var svgWidth = 	window.getComputedStyle(svgEle, null).getPropertyValue("width");
var svgHeight = window.getComputedStyle(svgEle, null).getPropertyValue("height");
svgWidth = parseFloat(svgWidth);
svgHeight = parseFloat(svgHeight);
var pack;
var circle;
var texts;
var bubble;
var year = "year2000";

var allData = {
	"name" : "全国", "year2000" : 126925843, "year2005" : 127767994, "year2010" : 128057352,
	"children" : [
		{ "name" : "東京都", "year2000" : 12064101, "year2005" : 12576601, "year2010" : 13159388 },
		{ "name" : "大阪府", "year2000" : 8805081, "year2005" : 8817166, "year2010" : 8865245 },
		{ "name" : "愛知県", "year2000" : 7043300, "year2005" : 7254704, "year2010" : 7410719 },
		{ "name" : "長野県", "year2000" : 2215168, "year2005" : 2196114, "year2010" : 2152449,
			"children" : [
				{ "name" : "長野市", "year2000" : 360112, "year2005" : 3785120, "year2010" : 38151100 },
				{ "name" : "松本市", "year2000" : 208970, "year2005" : 2276270, "year2010" : 24303700 },
				{ "name" : "塩尻市", "year2000" : 64128, "year2005" : 683460, "year2010" : 6767000 }
			]
		}
	]
}

function drawPackLayout(dataSet){

	// カラーの準備
	var color = d3.scale.category10();

	// パックレイアウト
	var bubble = d3.layout.pack()
		.size([320, 320])

	// パックレイアウトで使用するグループを作成
	var pack = d3.select("#myGraph")
		.selectAll("g")
		.data(bubble.value(function(d, i) {
			return d[year];
		}).node(dataSet))
		.enter()
		.append("g")
		.attr("transform", function(d){
			return "translate(" + d.x +", " + d.y + ")";	// 最初は、半径１
		})
		.attr("")
			return
	circle = pack.append("circle")
	pack.append("circle")
		.attr("transform", function(d, i){
			return "trainslate"
		})
		.attr("r", 0)
		.transition()
		.duration(function(d, i){
			return d.depth * 1000 + 500;
		})
		.attr("r", function(d){
			return d.r;
		})
		.style("fill", function(d, i){
			return color(i);
		})

	// 縁に表示する文字を生成
	pack.append("text")
		.style("opacity", 0)
		.transition()
		.duration(3000)
		.style("opacity", 1.0)
		.text(function(d, i){
			if(d.depth == 1){	// 第１層のみは対象外
				return d.name;
			}
			return null;
		})