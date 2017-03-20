// These are defined in the go function, after window loads.
// See beginning of the actual script
let CE;
let CE0, CE1, CE2;

const minWinWidth = 300;
const maxWinWidth = 700;

let integerForKeys = 0;
function newInteger(){
	return integerForKeys++;
}

function interpolate(min, max){
	let factor = (windowWidth()-minWinWidth)/(maxWinWidth-minWinWidth);
	return min + (max - min)*factor;
}

function windowWidth(){
	let w = window.innerWidth;
	if(w > maxWinWidth) return maxWinWidth;
	if(w < minWinWidth) return minWinWidth;
	return w;
}

function pix(num){ return (num + "px");}

function getNumberFromPx(str){
	let indx = str.indexOf("px");
	if(indx < 0) return 0;
	return Number(str.substring(0,indx));
};

function nullClick(){
	console.log("function nullClick");
}

// font arrays given in global constants
function getFontFromFontArray(arr){
	let sz = new UISize(arr[0],arr[1],arr[2]);
	return new UIFont(sz);
}

// INCOMPLETE - MUST BE ABLE TO HANDLE ARRAYS ????????????????
function createPositionObjectFromObject(obj){
	let top = obj.top;
	if(top) ltop = new UISize(top);
	let left = obj.left;
	if(left) left = new UISize(left);
	let width = obj.width;
	if(width) width = new UISize(width);
	let height = obj.height;
	if(height) height = new UISize(height);
	let pos = obj.position;
	return new PositionRectangle(top, left, width, height, pos);
};


/* 
This is for special purposes - NOT general
Does NOT modify obj - returns entirely new object.
Thus obj = extend(obj, anObject) isOK. 
*/
function extend(obj, src) {
    	let retObj = {};
	for (let key in obj) {
        	if (obj.hasOwnProperty(key))
			retObj[key] = obj[key]
	}
    
    	for (let key in src) {
     	   if (src.hasOwnProperty(key)){
		let newObj;
		if(key == "style"){
			let temObj = retObj.style;
			if(temObj &&(temObj !== null) ){
				newObj = extend(temObj, src.style);
			}else{
				newObj = src.style;
			}
			retObj.style = newObj;
		} else{
			retObj[key] = src[key];
		} // if
	}// if						
    }// for
    return retObj;
}

// sorts array of recipes by name, in place
// x,y are recipes
function sortArrayOfRecipes(arr){
	arr.sort(function(x,y){
			let a = x.name.toLowerCase();
			let b = y.name.toLowerCase();
			return compare(a,b);
			} 
		); // sort
}

// used for sorting
function compare(a,b){
	if(a < b)
		return -1;
	else if (a > b)
		return 1;
	else
		return 0;
} 
