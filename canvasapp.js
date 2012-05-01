// See - http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/
// Starting of the painting app. basic drawing. 
var canvas;
var context;
var clickX 		= new Array();
var clickY 		= new Array();
var clickDrag 	= new Array();
var isPainting;

function prepareCanvas() {
	canvas 	= document.getElementById('canvas');
	context = canvas.getContext('2d');

	$('#canvas').mousedown(function(e){
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
			
		isPainting = true;
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		redraw();
	});

	$('#canvas').mousemove(function(e){
		if(isPainting){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
		}
	});

	$('#canvas').mouseup(function(e){
		isPainting = false;
	});

	$('#canvas').mouseleave(function(e){
		isPainting = false;
	});
}

function addClick(x, y, dragging) {
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
}

function redraw() {
	canvas.width = canvas.width; 
  
	context.strokeStyle = "#003399";
	context.lineJoin = "round";
	context.lineWidth = 5;
			
	for(var i=0; i < clickX.length; i++)
	{		
		context.beginPath();
		if(clickDrag[i] && i) {
			context.moveTo(clickX[i-1], clickY[i-1]);
		} else {
			context.moveTo(clickX[i]-1, clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		context.stroke();
	}
}