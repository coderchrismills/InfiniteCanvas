// See - http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/
// Starting of the painting app. basic drawing. 
// Draw paths, save the imageData, clear paths
var canvas;
var context;
var isPainting;
var colorPickerShowing;
var strokeColor = {r:0, g:51, b:153};
var strokeHex = '#003399';
var imageData;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();

function prepareCanvas() {
	colorPickerShowing = true;
	$('#ColorPickerHolder').ColorPicker({
		flat: true,
		onChange: function(hsb, hex, rgb) { 
			strokeColor = rgb;
			strokeHex = '#'+hex;
			$('#ColorPickerColor').css('backgroundColor', '#' + hex); 
		},
		onSubmit: function(hsb, hex, rgb) {
			strokeColor = rgb;
			strokeHex = '#'+hex;
			$('#ColorPickerColor').css('backgroundColor', '#' + hex);
			toggleColorPicker();
		}
	});
	toggleColorPicker();

	canvas 	= document.getElementById('canvas');
	context = canvas.getContext('2d');

	imageData = context.createImageData(canvas.width, canvas.height);

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
		// add line (points + color) to draw list
		clearClickData();
		imageData = context.getImageData(0,0, canvas.width, canvas.height);
	});

	$('#canvas').mouseleave(function(e){
		isPainting = false;
		// add line (points + color) to draw list
		clearClickData();
		imageData = context.getImageData(0,0, canvas.width, canvas.height);
	});
}

function clearClickData() {
	clickX.length = 0;
	clickY.length = 0;
	clickDrag.length = 0;
}

function addClick(x, y, dragging) {
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
	/*
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = strokeColor.r;
    imageData.data[index+1] = strokeColor.g;
    imageData.data[index+2] = strokeColor.b;
    imageData.data[index+3] = 255;
    */
}

function redraw() {
	//canvas.width = canvas.width; 
  	context.putImageData(imageData,0,0);

	context.strokeStyle = strokeHex;
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

function clearCanvas() {
	clearClickData();

	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.restore();

	imageData = context.getImageData(0,0,canvas.width, canvas.height);
}

function checkClearCanvas() {
	if(confirm("Destroy your awesome art? Really?"))
		clearCanvas();
}

function toggleColorPicker() {
	if(colorPickerShowing) {
		$('#ColorPickerHolder').hide();
		colorPickerShowing = false;
	}
	else {
		$('#ColorPickerHolder').show();
		colorPickerShowing = true;
	}
}