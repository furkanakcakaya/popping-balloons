window.requestAnimationFrame =
	window.requestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	function(callback) {
	setTimeout(function() {
		callback(Date.now());
	}, 1000 / 60);
};

function setUpMouseHander(element, mouseDownFunc, mouseDragFunc, mouseUpFunc) {

	if (!element || !mouseDownFunc || !(typeof mouseDownFunc == "function")) {
		throw "Illegal arguments in setUpMouseHander";
	}
	if (typeof element == "string") {
		element = document.getElementById(element);
	}
	if (!element || !element.addEventListener) {
		throw "first argument in setUpMouseHander is not a valid element";
	}
	var dragging = false;
	var startX, startY;
	var prevX, prevY;

	function doMouseDown(evt) {
		if (dragging) {
			return;
		}
		var r = element.getBoundingClientRect();
		var x = evt.clientX - r.left;
		var y = evt.clientY - r.top;
		prevX = startX = x;
		prevY = startY = y;
		dragging = mouseDownFunc(x, y, evt);
		if (dragging) {
			document.addEventListener("mousemove", doMouseMove);
			document.addEventListener("mouseup", doMouseUp);
		}
	}

	function doMouseMove(evt) {
		if (dragging) {
			if (mouseDragFunc) {
				var r = element.getBoundingClientRect();
				var x = evt.clientX - r.left;
				var y = evt.clientY - r.top;
				mouseDragFunc(x, y, evt, prevX, prevY, startX, startY);
			}
			prevX = x;
			prevY = y;
		}
	}

	function doMouseUp(evt) {
		if (dragging) {
			document.removeEventListener("mousemove", doMouseMove);
			document.removeEventListener("mouseup", doMouseUp);
			if (mouseUpFunc) {
				var r = element.getBoundingClientRect();
				var x = evt.clientX - r.left;
				var y = evt.clientY - r.top;
				mouseUpFunc(x, y, evt, prevX, prevY, startX, startY);
			}
			dragging = false;
		}
	}
	element.addEventListener("mousedown", doMouseDown);
}

function setUpTouchHander(element, touchStartFunc, touchMoveFunc, touchEndFunc, touchCancelFunc) {

	if (!element || !touchStartFunc || !(typeof touchStartFunc == "function")) {
		throw "Illegal arguments in setUpTouchHander";
	}
	if (typeof element == "string") {
		element = document.getElementById(element);
	}
	if (!element || !element.addEventListener) {
		throw "first argument in setUpTouchHander is not a valid element";
	}
	var dragging = false;
	var startX, startY;
	var prevX, prevY;

	function doTouchStart(evt) {
		if (evt.touches.length != 1) {
			doTouchEnd(evt);
			return;
		}
		evt.preventDefault();
		if (dragging) {
			doTouchEnd();
		}
		var r = element.getBoundingClientRect();
		var x = evt.touches[0].clientX - r.left;
		var y = evt.touches[0].clientY - r.top;
		prevX = startX = x;
		prevY = startY = y;
		dragging = touchStartFunc(x, y, evt);
		if (dragging) {
			element.addEventListener("touchmove", doTouchMove);
			element.addEventListener("touchend", doTouchEnd);
			element.addEventListener("touchcancel", doTouchCancel);
		}
	}

	function doTouchMove(evt) {
		if (dragging) {
			if (evt.touches.length != 1) {
				doTouchEnd(evt);
				return;
			}
			evt.preventDefault();
			if (touchMoveFunc) {
				var r = element.getBoundingClientRect();
				var x = evt.touches[0].clientX - r.left;
				var y = evt.touches[0].clientY - r.top;
				touchMoveFunc(x, y, evt, prevX, prevY, startX, startY);
			}
			prevX = x;
			prevY = y;
		}
	}

	function doTouchCancel() {
		if (touchCancelFunc) {
			touchCancelFunc();
		}
	}

	function doTouchEnd(evt) {
		if (dragging) {
			dragging = false;
			element.removeEventListener("touchmove", doTouchMove);
			element.removeEventListener("touchend", doTouchEnd);
			element.removeEventListener("touchcancel", doTouchCancel);
			if (touchEndFunc) {
				touchEndFunc(evt, prevX, prevY, startX, startY);
			}
		}
	}
	element.addEventListener("touchstart", doTouchStart);
}



