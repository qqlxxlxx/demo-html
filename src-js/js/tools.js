(function(){
	function getScreen(){
		let width, height;
		if(window.innerWidth){
			width = window.innerWidth;
			height = window.innerHeight;
		}else if(document.compatMode === "BackCompat"){
			width = window.document.body.clientWidth;
			height = window.document.body.clientHeight;
		}else{
			width = document.documentElement.clientWidth;
			height = document.documentElement.clientHeight;
		}
		return{
			width:width,
			height:height
		}
	}
	function getPageScroll(){
		let x, y;
		if(window.pageXOffset){
			x = window.pageXOffset;
			y = window.pageXOffset;
		}else if(document.compatMode === "BackCompat"){
			x = document.body.scrollLeft;
			y = document.body.scrollTop;
		}else{
			x = window.document.documentElement.scrollLeft;
			y = window.document.documentElement.scrollTop;
		}
		return{
			x:x,
			y:y
		}
	}
	function debouce(fn, delay) {
		let timerId = null;
		return function() {
			let self = this;
			let args = arguments;
			timerId && clearTimeout(timerId);
			timerId = setTimeout(function() {
				fn.apply(self, args);
			}, delay || 1000)
		}
	}
	window.getScreen = getScreen;
	window.getPageScroll = getPageScroll;
	window.debouce = debouce;
})();