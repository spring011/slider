/**
**轮播动画@spring
*/

var slider = (function(){
	/*
	* public func
	*/
	function currentStyle(elem, style){
        return elem.currentStyle || document.defaultView.getComputedStyle(elem, null);
    }

    function setDisPlay(elem, value){
    	elem.style.display = value;
    }

    function setLeft(elem, left){
		elem.style.left = left + 'px';
	}

	//观察者模式
	function Observer(){}
	Observer.addListener = function(depend, name, handler, scope){
		depend[name] = {
			scope: scope || this,
			handler: handler
		}
	}
	Observer.removeListener = function(depend, name){
		if(name in depend){
			delete depend[name];
		}
	}
	Observer.trigger = function(depend,name){
		if(name in depend){
			depend[name].handler.call(depend[name].scope);
		}
	}



	/*
	*data
	*/
	var data = {
		slideElemsArr: [],//sliders的所有子元素
		index: -1,//当前显示的子元素的位置
		count: 0,//个数
		slideElemWdth : 0,
		lLeft: 0,
		rLeft: 0,

		config: {
			pause: 3000,//停顿时间
		    time: 20,//滑动时间
		},
		observer: {}
	}



    
	/*
	*operate
	*/
	function initData(sliderId){

		var sliderE = document.getElementById(sliderId);

		data.slideElemsArr = sliderE.getElementsByTagName('div');
		data.slideElemWdth = parseInt(currentStyle(data.slideElemsArr[0])['width']);

		data.lLeft = parseInt(currentStyle(data.slideElemsArr[0])['left']);
		data.rLeft = parseInt(currentStyle(data.slideElemsArr[1])['left']);

		data.count = data.slideElemsArr.length;
	}

	function runFrame(){
		var move = 0,
		stepLen = 3;

		var timer = setInterval(function(){
			setDisPlay(data.slideElemsArr[(data.index + 1) % data.count], "block");

			if(move < data.slideElemWdth){
				move = move + stepLen;

				if(move > data.slideElemWdth){
					move = data.slideElemWdth;
				}

				setLeft(data.slideElemsArr[data.index], data.lLeft - move);
				setLeft(data.slideElemsArr[(data.index + 1) % data.count], data.rLeft - move);
			}else{
				clearInterval(timer);

				
				setLeft(data.slideElemsArr[data.index], data.rLeft);
				setDisPlay(data.slideElemsArr[data.index], "none");

				Observer.trigger(data.observer, "nextFrame");

			}


		},30);

	}
	


	/*
	* frame manager
	*/
	function transform(){
		if(data.index == -1 || (data.index + 1) / data.count >= 1){
			data.index = 0;
		}else{
			data.index++;
		}
		runFrame();

	}
	Observer.addListener(data.observer, "nextFrame",function(){
		transform();

	})



	/*
	*interface
	*/
	return {
		slide:function(sliderId){
			initData(sliderId);
			transform();

		}
	}
})();

slider.slide('slider');//id


