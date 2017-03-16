
/* ******************************************************

			class Notification

***********************************************************  */

/*
types: menuUp, menuDown, background, backgroundFromButtonClicked, resize
*/

class Notification{
	constructor(name, owner){
		this.name = name;
		this.type = name;
		this.owner = owner;
		this.id = "NotificationId:" + newInteger();
	};

	amIOwner(anInstance){
		return ( anInstance === this.owner);
	};
};





/* ******************************************************

			class UISize

***********************************************************  */


/*
All dynamic resizing is based on the use of this class.

"size" is a STRING of form "nnnpx" or "%" (no number) or else "auto",
where nnn is any number of digits.
Mote that minWinWidth and maxWinWidth are constants used to set
the minimum and maximum size (in px) of the window. It does not restrict
the browser but it restricts how elements will resize. 

min, max are used only if size = "%". Otherwise not used.
The "%" means that the value in px will the following:

	min + (max-min)*(winWidth - minWinWidth)/(maxWinWidth - minWinWidth)

So the size is determined entirely by the window width and varies linearly
between min and max. But once the computed size is smaller than min,
it is set equal to min, and once it is larger than max, it is set
equal to max.  You can make
the size 100% of the window width by setting min = minWinWidth and 
max = maxWinWidth. To make the size a fraction f (<=1) of the window
width, set min = minWinWidth and max = min + f*(maxWinWidth - minWinWidth).

This is used for positioning and font-size, among other things.
*/
class UISize{
	constructor(size, min=null, max=null){
		this.sizeArg = size;
		this.sizeSpec = this.getPosObject(size);
			// sizeSpec is {value: aNumber, type: "%" or "px" or "auto"}
		this.min = min;
		this.max = max;
	};

	//size is "%" or "nnnpx" or "auto"
	getPosObject(size){
		size = size.trim();
		let defaultObj = { value: 0, type: "auto"};

		if(size == "auto") return defaultObj;

		if(size.length === 0) return defaultObj;

		if(size.charAt(0) === "%") return {value: 0, type: "%"};

		let indx = size.indexOf("px");
		if(indx > 0){
			let val = size.substring(0,indx);
			return {value: Number(val), type: "px"};
		}

		return defaultObj;	
	};

	getSize(){
		if(this.sizeSpec.type == "auto") return "auto";
		if(this.sizeSpec.type == "px") return this.sizeSpec.value + "px";
		if(this.sizeSpec.type == "%")return interpolate(this.min, this.max) + "px";
	};

	resize(){
		return this.getSize();
	};

	copy(){
		return new UISize(this.sizeArg, this.min, this.max);
	};
		

}; //class UISize


/* ******************************************************

		class PositionRectangle

***********************************************************  */

/*
A mixin, which computes the dimensions in px of top, left,width, height.
Each argument is either null or a UISize object.  
resize() - recomputes all positions. this.top, etc (if not null)
	are kept current.
getStyleObject() - returns a style object used for CSS positioning.
	{style:{top: ..., width: ...}} whatever is not null.
positionStrOrNull - If not-null, any of the allowed values,
	such as "absolute" or "relative" .

Here is a use case:
	let top = new UISize("40px");
	let width = new UISize("%", 100,300);
	let posObj = new PositionRectangle(top, null, width, null, null);
*/
class PositionRectangle{
	constructor(topSize, leftSize, widthSize, heightSize, positionStrOrNull){
		// any of these can be null
		this.topSize = topSize;
		this.leftSize = leftSize;
		this.widthSize = widthSize;
		this.heightSize = heightSize;
		this.position = positionStrOrNull;

		// VALUE IS STRING IN px, "auto",  OR NULL
		this.top = null;
		this.left = null;
		this.width = null;
		this.height = null;
	
		this.resize();
	};

	

	// compute values
	resize(){
		if(this.topSize)this.top = this.topSize.resize();
		if(this.leftSize)this.left = this.leftSize.resize();
		if(this.widthSize)this.width = this.widthSize.resize();
		if(this.heightSize)this.height = this.heightSize.resize();
	};

	getStyleObject(){
		let obj =  {style:{}};
		if(this.top) obj.style.top = this.top;
		if(this.left) obj.style.left = this.left;
		if(this.width) obj.style.width = this.width;
		if(this.height) obj.style.height = this.height;
		if(this.position) obj.style.position = this.position;

		return obj;
	};
}; // class PositionRectangle
