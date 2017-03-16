
/* ******************************************************

			class AbstractNotifications

***********************************************************  */

/* Backup for notifications
Must be CAREFUL using notifications.
*/

class AbstractNotifications{
	constructor(){
	};

	// OK if controller is null
	sendNotification(controller, type){
		console.log("AbstractNotifications - sendNotification--controller follows");
		console.log(controller);
		if(! controller) return;
		let notif = new Notification(type, this);
		controller.sendNotification(notif);
	};

	receiveNotification(notification){
		window.alert("receive notification - no valid receiver. See console log");
		console.log(notification);
		console.log(this);
	};		
}; // class AbstractNotifications
	


/* ******************************************************

			class UI

***********************************************************  */

/* abstract superclass of all UI objects.
Has id, className (or names) and key.
If id or key is null, it creates dummies.
ID AND KEY WILL NEVER BE NULL.
getStyleObject() - returns a style object that can be used as part
	of the element sttribute/style specification.
includeKey - if true, include the key in the styleObject returned.
	If flase, do not include the key.
*/

class UI extends AbstractNotifications {
	constructor(className, id=null, key=null, includeKeyBool = true ){
		super();

		this.className=	className;
		this.includeKey = includeKeyBool;

		this.id;
		if(id === null)
			this.id = "idDummy" + newInteger();
		else
			this.id = id;

		this.key;
		if(key === null)
			this.key = "keyDummy" + newInteger();
		else
			this.key = key;

		this.reactKey = this.key;
	};

	getStyleObject(){
		let obj = {
			    id: this.id  
			   };
		if(this.includeKey) obj.key = this.key;
		if(this.className !== null) obj.className = this.className;
		return obj;
	};			

}; // class UI

/* ******************************************************

			class UISimpleRectangle

***********************************************************  */

/*
positionInstance is an instance of class PositionRectangle.

This is a convenience superclass of rectangular elements. It
handles position values and id, className, key. It does not do
any actual positioning, but only computes sizes.

This does NOT return a react element.
*/

class UISimpleRectangle extends UI{
	constructor(positionInstance, className, id, key, includeKeyBool) {
	
		super(className, id, key, includeKeyBool);
	
		this.resize = this.resize.bind(this);
		this.positionInstance = positionInstance;
				
		// The following are assigned in resize() and are strings
		// either in px or "auto",. or null 
		this.width
		this.height;
		this.top;
		this.left;
	};

	// return {top: ..., left: ..., width: ..., height: ...}
	resize(){
		if(! this.positionInstance) return;
		
		this.positionInstance.resize();

	 	this.width = this.positionInstance.width;
		this.height =  this.positionInstance.height;
		this.top =  this.positionInstance.top;
		this.left = this.positionInstance.left;
	};

	getStyleObject(){
		let obj = {style:{}};
		if(this.positionInstance)
			obj = this.positionInstance.getStyleObject();
		let obj2 = super.getStyleObject();

		return extend(obj, obj2);
	};
}; // class UISimpleRectangle

/* ******************************************************

			class UIFont

***********************************************************  */

/*
sizeInstance is UISize object. It cannot be null.
*/


class UIFont{
	constructor(sizeInstance, family=null, weight=null, style=null, variant=null){
		this.sizeInstance = sizeInstance;

		this.family = family;
		this.weight = weight;
		this.variant = variant;
		this.style = style;
		this.size = null; // a string, cannot be null

		this.resize();
	};

	resize(){
		this.size = this.sizeInstance.getSize();
		return this.size;
	};

	getStyleObject(){
		let obj = { style: {}};
		obj.style.fontSize = this.size;
		if(this.family !==null) obj.style.fontFamily = this.family;
		if(this.weight !== null) this.style.fontWeight = this.weight;
		if(this.variant !== null) this.style.fontVariant = this.variant;
		if(this.style !== null) this.style.fontStyle = this.style;
		
		return obj;
	};

}; // class UIFont



