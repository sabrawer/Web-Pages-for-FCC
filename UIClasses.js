/* ******************************************************

			class UIButton

***********************************************************  */

/*
UIButton is a div with a text child and a callback and flexible
positioning and sizing and one or more classes for styling. 

If in the positionInstance, the width is "auto", the button
will size based on the text size. If the font object has
font size UISize("%,...), the font size will vary with window
width and the button size will in general change based on
the text size, but not always (see below).

=======
POSITIONING:

If button is or is not not positioned absolutely, and has width "auto",
it will take up all the available space. It
will resize correctly based on the font size of text.

If positioned in an absolutely-positioned container, it
will also have the appropriate width but will not resize
correctly, even if the container has width "auto".

Use class UIButtonContained to put the button in a flex
container which can, if desired, be positioned absolutely,
so the button positions itself and resizes itself correctly.

see testClassesUIButton.html for examples of use.
========

positionInstance is an instance of PositionRectangle. It determines
whether the button is positioned absolutely or not. If it is
null, a default instance is created in the UISimpleRectangle
class. In that case, the button position is
expected to be configured in CSS.

uiFontObject is an instance of UIFont, or null.

display - generally "block" or "inline-block" but can be any of the
	appropriate values. Can also be null.

includeKeyBool - if null or true, key is included in styleObject.
	If false, key is not included.

this.id and this.key will never be null.

z-index must be given in the button class.

notificationController - if defined, used to send "background" notifications
	Notificatiions are sent to this controller. Generally it is the
	owner is this button.

This class does NOT receive notification events. However
when clicked it sends a "background" notification if there is
a controller.
*/

class UIButton extends UISimpleRectangle{
	constructor(positionInstance, uiFontObject, className, id, text, 
			callback, includeKeyBool, display, notificationController){ 
		super(positionInstance, className, id, null,includeKeyBool);

		this.buttonClicked = this.buttonClicked.bind(this);
		this.getReactElement = this.getReactElement.bind(this);

		this.uiFontObject = uiFontObject;
		this.callback = callback;
		this.text = text;

		this.display = display;			// may be null or undefined

		this.notifController = notificationController; // used for notifications
								// may be null or undefined
	};

	getReactElement(){
		let obj1 = this.getStyleObject();
		let obj2 = this.uiFontObject.getStyleObject();
		let obj = extend(obj1, obj2);
		if(this.display) obj.style.display = this.display;
		obj.onClick = this.buttonClicked;

		return CE("div",obj, this.text);	
	};

	resize(){
		super.resize();
		this.uiFontObject.resize();
	};

	/* must filter extraneous clicks.*/
	buttonClicked(event){
		event.persist();
		console.log("UIButton - buttonClicked");
		if(event.target.id !== this.id) return;
		if(this.callback)this.callback(this);
		if(this.notifController){
			let notif = new Notification("backgroundFromButtonClicked",this);
			this.notifController.sendNotification(notif);
		}
		
	};

	// returns integers, not strings
	getOffset(){
		let elem = document.getElementById(this.id);
		let rect = elem.getBoundingClientRect();
		return {left: rect.left, top: rect.top, 
			bottom: rect.bottom, right: rect.right};
	};

}; // class UIButton


/* ******************************************************

			class UIButtonContained

***********************************************************  */

/*
This is a UIButton in a flex container and with auto margins.
The button will have the appropriate size (depending on
font size) and will resize correctly whether the container
is positioned absolutely or not.

The container may be given a callback. This is useful for
"background" clicks.

Notifications as in superclass.

See 
testClassesUIButtonContained.html,
testClassesButtonBar.html 
for examples of use. For a css example of abvout the same thing,see
/Users/stevenbrawer/htmlJavascriptCssEtcWebPages/flexBoxExamples-2.html.

*/

class UIButtonContained extends UIButton{
	constructor(positionInstance, uiFontObject, className, id, text, 
			callback, includeKeyBool, display,
			containerPosition, containerClassName, containerCallback,
			notificationController){
		super(positionInstance, uiFontObject, className, id, text, 
			callback, includeKeyBool, display, notificationController);

		this.backgroundClick = this.backgroundClick.bind(this);

		this.containerPos = containerPosition;
		if(! this.containerPos)
			this.containerPos = new PositionRectangle(null,null,null,null,null);
		this.containerClassName = containerClassName;
		this.conKey = "key" + newInteger();
		this.conId = "containerId" + newInteger();
		this.conCallback = containerCallback;
	}

	getReactElement(){
		// container attributes/style
		let conObj = this.containerPos.getStyleObject();
		
		conObj.className = this.containerClassName;
		conObj.key = this.conKey;
		conObj.id = this.conId;

		conObj.style.display="flex";
		conObj.style.width = "100%";
		conObj.style.alignItems = "center";
		
		if(this.conCallback) conObj.onClick = this.backgroundClick;
		
		let rightMrgnObj = {
				style:{
					marginRight: "auto"
					}
				    };
		let leftMrgnObj = {
				style:{
					marginLeft: "auto"
					}
				    };
		let btnElem = super.getReactElement();
		return CE("div",conObj,
				CE("div",rightMrgnObj,null),
				btnElem,
				CE("div",leftMrgnObj, null)
			);
	};

	resize(){
		this.containerPos.resize();
		super.resize();
	};

	backgroundClick(event){
		if(event.target.id !== this.conId) return;
		if(this.notifController)
			this.sendNotification(this.notifController, "background");
		if(this.conCallback) this.conCallback(this);
	};

}; // class UIButtonContained

/* ******************************************************

			class UIButtonBar

***********************************************************  */

/*
A flex container with a bunch of UIButtonContained, evenly 
spaced. The container is positioned depending on positionObject
and depending on whether this is put inside a fixed-size
container. Several very useful variations are possible. See
testClassesButtonBar.html for examples.

The container can be styled with className.

A click on the background sends a "background" notification.

buttonsArray is an array of UIButtonContained objects (not the
	react elements).

this.ignoreBackground - when a button is clicked, there are two notificatyions -
	one from the button (backgroundFromButtonClicked) and another from
	this class ("background") - see backgroundClick(). There is a 
	controller (not the one passed as argument) which creates and uses
	this class, and it receives both notifications. When it receives
	the button click (to presumably put up a menu), it sets
	this.ignreBackground to true, so that the backgrund notification
	is not sent. Then this.ignoreBackground is set to false bhy
	this class.
*/

class UIButtonBar extends UISimpleRectangle{
	constructor(positionObject, buttonsArray, className, controller){
		super(positionObject,className,null,null,null);

		this.backgroundClick = this.backgroundClick.bind(this);

		this.posObj = positionObject;
		this.buttonsArray = buttonsArray;
		this.controller = controller; // notifications only
		this.ignoreBackground = false; /// hack, hack, hack
						// see controller

	};

	getReactElement(){
		let arr=[];
		for(let i=0;i<this.buttonsArray.length;i++){
			arr.push(this.buttonsArray[i].getReactElement() );
		}

		let obj = {}; //this.getStyleObject();
		obj.className = "buttonBar";
		obj.key = "key" + newInteger();
		obj.onClick = this.backgroundClick;

		return CE("div", obj, arr);
	};

	resize(){
		super.resize();
		for(let i=0;i<this.buttonsArray.length;i++)
			this.buttonsArray[i].resize();
	};

	backgroundClick(){
		if(this.ignoreBackground){
			this.ignoreBackground = false;
			return;
		}
		console.log("UIButtonBar-backgroundClick");
		let notif = new Notification("background", this);
		this.controller.sendNotification(notif);
	}

	receiveNotification(notif){
		console.log("UIButtonBar - receive notification");

	};

}; //class UIButtonBar
		
		


/* ******************************************************

			class UIDropDownMenu

***********************************************************  */

/*
This is a dumb drop-down menu. It requires a class and a hover
pseudo-class designation to work correctly. Only a single
selection is possible.

This class combines both controller and view. A cell is an element
of the drop down menu. The cells are styled by cellClassName.

choices - an array of strings - the menu items

The menu is positioned absolutely at position determined by the triggerObject.
It will be at the top or the bottom and the left side of the triggerObject,
as determined by string topOrBottom = "top" or "bottom". The
triggerObject should be be the object which produced the event
to put up the drop down, in order that notifications work
correctly. It is managed independently.

triggerObject must have method getOffset(), which is used to position the
	drop down menu..

The callback from here takes two arguments - this and the selection.

The state of the menu is given by two booleans - this.showMenu and this.menuUp. 

menuUp - if true, some other menu is up, and drop down should not
	be shown. A click here should generate a background notification.
showMenu - if true, getReactElement() returtns the triggerObject and this menu. If
	false, only the triggerObject is returned.

This class sends and receives notifications.

ids and keys of individual cells are generated from choices. A given id is:
		<the choice>: + <uniqueNumber>

idsArray, keysArray - used to assign attributes to cells.

controller - ifit exists, it is used only to send notifications

Note that this menu will resize correctly if the window width is modified
while the menu is "up".

ALL NOTIFICATIONS HANDLED FROM THE CONTROLLER
*/

	class UIDropDownMenu extends AbstractNotifications{
		constructor(triggerObject, uiFontObject, containerClassName, cellClassName,
				topOrBottom, choices, callback,dropDownElementId){

			super();

			this.selection = this.selection.bind(this);

			this.triggerObject = triggerObject;
			this.containerClassName = containerClassName;
			this.cellClassName = cellClassName;
			this.topOrBottom = topOrBottom;
			this.callback= callback;
			this.choices = choices;
			this.idsArray = this.createIdsArray();// same order as choices
			this.keysArray = this.createKeysArray();
			this.uiFontObject = uiFontObject;
			this.rootElement = document.getElementById(dropDownElementId);
		
			this.menuUp = false;
			this.showMenu = false;

		};

	createIdsArray(){
		let arr = [];
		for(let i=0;i<this.choices.length;i++){
			let id = this.choices[i] + ":" + newInteger();
			arr.push(id);
		}
		return arr;
	};

	createKeysArray(){
		let arr = [];
		for(let i=0;i<this.choices.length;i++){
			let key = "key"  + newInteger();
			arr.push(key);
		}
		return arr;
	};
		
	// this would be evoked by a controller after an event sent
	// by the triggerObject.
	putUpMenu(){
		if(this.menuUp) return
		this.showMenu = true;
		this.resize();
	};

	close(){
		this.remove();
	};

	getReactElement(){
		return null;
	};

	doMenu(){
		console.log("doMenu");
		this.showMenu = true;

		/* First create the cells. These will be positioned
		correctly and will have the proper size because
		they will be nested in an absolutely-positioned
		container.*/

		let fontSize = this.uiFontObject.size;
		let arr = [];
		for(let i=0;i<this.choices.length;i++){
			let obj = {
					className: this.cellClassName,
					id: this.idsArray[i],
					key: this.keysArray[i],
					onClick: this.selection,
					style:{
						width: "auto",
						height: "auto",
						fontSize: fontSize
						}
				};
			arr.push( CE("div", obj,this.choices[i]) );
		} // for
		
		// the container

		let offsetObj = this.triggerObject.getOffset();
		//console.log(offsetObj);
		let top =  offsetObj[this.topOrBottom];
		let left = offsetObj.left;
		let obj = {
				className: this.containerClassName,
				style:{
					position: "absolute",
					top: top,
					left: left,
					width: "auto",
					height: "auto"
					}
				};
		let ce = CE("div",obj, arr);
		//console.log(ce);
		ReactDOM.render(ce, this.rootElement);
	};
			
	
	resize(){
		this.uiFontObject.resize();
		if(this.showMenu){
			this.remove();
			this.doMenu();
		}	
	};

	remove(){
		this.showMenu = false;
		let arr = this.rootElement.children;
		if(arr.length > 0)
			this.rootElement.removeChild(arr[0]);
	};

	receiveNotification(notif){
	};

	/*sendNotification(notif){
	};*/

	// callback from menu selection
	selection(event){
		event.persist();
		let id = event.target.id;
		let arr = id.split(":");
		let choice = arr[0];
		this.showMenu = false;
		this.remove();
		this.callback(this,choice);
	};
}; //class UIDropDownMenu
		

/* ******************************************************

			class UIPopUp

***********************************************************  */

/*

This class assumes a message (can be null), a textarea (can be null),
a one- or two-column multi-choice list, and up to three buttons.
It can serve as a superclass for popups of other configurations.

messageObject = {text: string, className: className, fontSize: aUISize...}

textAreaObject - if null, there is non. Otherwise it is
		{defaultText: str or null, className: className, 
			rows: intOrNull, cols: intOrNull}

buttonsArray is array of objects:
	[ {text: string, classname: className, 
		callback: aCallback, fontSize: aUISize, }, { ...}, ... ]

Screen should be positioned absolutely, and positionInstance gives where
it goes and how big it is.

This class does NOT send or receive notifications.


*/

class UIPopUp extends UISimpleRectangle{
	constructor(positionInstance, containerClassName, containerId, messageObject, 
				textAreaObject, buttonsArray, listObject, secondElementId = null){
		super(positionInstance, containerClassName, containerId, null, true);

		//this.saveCallback =   this.saveCallback.bind(this);
		//this.cancelCallback = this.cancelCallback.bind(this);

		this.messageObject = messageObject;
		this.textAreaObject = textAreaObject;
		this.buttonsArray =  buttonsArray;
		this.listObject = listObject;
		this.selectionListController=null;
		this.positionInstance = positionInstance; // can be null
		this.rootElem = document.getElementById("popup");
		this.buttonInstance = null;
		this.containerId = null;
		this.listOneSelected = null; // for single-column list
		this.clicked = this.clicked.bind(this);
		this.secondElementId = secondElementId; // if not null, this is the place to
					// render the poopup. Use this when two
					// popups are open at the same time.
		this.secondRoot = null;
		if(this.secondElementId)
			this.secondRoot = document.getElementById(this.secondElementId);
		
	};

	open(){
		if( (this.listObject)&&(this.listObject.numColumns == 2) )
			this.selectionListController = 
			  new UIPopUpListController(this,this.listObject);
		this.resize();
		this.render();
		if(this.selectionListController)
			this.selectionListController.setup(); //must go here
	};

	getRoot(){
		let rt = this.rootElem;
		if(this.secondRoot)  rt = this.secondRoot;
		return rt;
	};

	render(){
		let elem = this.getReactElement();

		let rendTo = this.getRoot();
		// We must assign the height of the popup container
		// assume buttons on the bottom
		let obj = {style:{visibility: "hidden"}};
		let tem = CE("div", obj, elem);
		ReactDOM.render(tem, rendTo);

		// now get the desired height of the popup
		let offset = this.buttonInstance.getOffset();
		let height = offset.bottom;

		// now render for real
		ReactDOM.render(elem, rendTo);
		let cont = document.getElementById(this.containerId);
		cont.style.height = height + "px";
	};

	resize(){
		// popup does not resize

	};

	getReactElement(){
		let arr=[];
		let msg = this.getMessageElement();
		if(msg)arr.push(msg);
		let lst = this.getListElement();
		if(lst) arr.push(lst);
		let txt = this.getTextAreaElement();
		if(txt) arr.push(txt);
		let buttons = this.getButtonsElement();
		if(buttons) arr.push(buttons);
		this.containerId = "popupContainer" + newInteger();
		let obj = {className: popupGeneralContainer,
			    id: this.containerId,
			    key: "key" + newInteger()};
		return CE("div", obj, arr);
	};		

	getMessageElement(){
		if(! this.messageObject) return null;

		let tag = "div";
		if( this.messageObject.hasOwnProperty("tag") ) 
			tag = this.messageObject.tag;
				
		let obj = {	className: this.messageObject.className,
				key: "messageKey" + newInteger(),
				wrap: "hard",
				style:{
					fontSize: this.messageObject.fontSize.resize(),
					fontFamily: "inherit"
				}
			  };

		return CE(tag, obj, this.messageObject.text);
	};

	// 1 COLUMN ONLY
	getListElementOne(){
		this.listIdObject = {};
		this.listOneSelected = null;
		let arr = [];
		let list = this.listObject.list;
		if(this.listObject.select)this.listOneSelected = list[0];
		
		for(let i=0;i<list.length;i++){
			let cls =  this.listObject.listClassName;
			if(this.listObject.select)
				if(i===0)
				     cls =  this.listObject.listSelectionClassName;
			let id = list[i];
			let obj1 = {key: "key" + newInteger(),
				     id: id,
				    className: cls,
				    //onClick: this.clicked
				};
			if(this.listObject.select) obj1.onClick = this.clicked;
			let ce = CE("div", obj1, list[i]);
			//arr.push( CE("div",{key:"key" + newInteger()},ce) );
			arr.push(ce);
		}
		return arr;


	};

	
	// 2 COLUMNS ONLY
	getListElement(){

		if(! this.listObject) return null;
		if(this.listObject.numColumns === 1) 
			return this.getListElementOne();
		else if(this.listObject.numColumns !== 2) 
			return null;

		this.listIdObject = {};
		let arr = [];

		let leftArray = this.listObject.leftList;
		let rightArray = this.listObject.rightList;
		if(leftArray.length !== rightArray.length)return null;
		
		// titles
		let obj1 = {	key: "key" + newInteger(),
				className: this.listObject.titleClassName
			     };
		let ce1 = CE("div",obj1, this.listObject.leftTitle);
		let obj2 = extend(obj1, {key: "key" + newInteger()} );
		let ce2 = CE("div", obj2, this.listObject.rightTitle);
		arr.push(CE("div",{key: "key" + newInteger()},ce1,ce2) );

		
		for(let i=0;i<leftArray.length;i++){
			let id = leftArray[i] + ":left";
			let obj1 = {key: "key" + newInteger(),
				     id: id,
				    className: this.listObject.listClassName,
				    onClick: this.selectionListController.clicked
				};
			let ce1 = CE("div", obj1, leftArray[i]);
			id = rightArray[i] + ":right";
			let key = "key" + newInteger();
			let obj2 = extend(obj1,{key: key, id: id} );
			//console.log(obj2);
			let ce2 = CE("div", obj2, rightArray[i]); 
			arr.push( CE("div",{key:"key" + newInteger()},ce1,ce2) );
		}
		return arr;

	};

	getButtonInstance(buttonObj){

		// no notification controller for button

		return new UIButtonContained(null, buttonObj.fontSize,
			buttonObj.className, "buttonId" + newInteger(),
			buttonObj.text, buttonObj.callback, true,
			"inline-block", null, 
			"popupSingleButtonContainerClass", null, null);
	};

	// oldName is either null, a string or an array of strings
	// Must NOT be anything else
	getTextAreaElement(){
		if(! this.textAreaObject) return null;
		let obj = {className: this.textAreaObject.className,
			    id: this.textAreaObject.id,
			   key: "key" + newInteger()};
		let oldVals = this.textAreaObject.oldName;
		if(oldVals) {
			if(typeof oldVals != "string"){
				let str = "";
				for(let i=0;i<oldVals.length;i++)
					str += oldVals[i] + "\n";
				oldVals = str;
			}
		}
		if(oldVals)obj.defaultValue = oldVals;
		return CE("textarea", obj,null);
	};

	getButtonsElement(){
		if( (! this.buttonsArray)||(this.buttonsArray.length === 0))
			return null;
		let arr = [];
	
		// the popupButtonContainerClass has padding which
		// allows the buttons to be separated linearly, and which
		// moves the buttons down. This container object
		// (created below) should itself be placed absolutely
		// with just "left" specified as it will then flow
		// with the flow.

		for(let i=0;i<this.buttonsArray.length;i++){
			let set = false;
			if(i === 0) set = true;
			let button = this.getButtonInstance(this.buttonsArray[i], set);
			if(i === 0) this.buttonInstance = button;
			arr.push(button.getReactElement() );
		}

		// now create the top-level container for the buttons only.
		// this goes inside the top-level popup container.
		// this does not have padding to separate the buttons.
		// It is positioned absolutely to cause the buttons
		// to be positioned along the horizontal.

		// bobj is the OVERALL BUTTON CONTAINER. EACH BUTTON ALSO
		// HAS ITS OWN CONTAINER
		let cls = "pupupSeveralButtonsContainerClass ";
		if(this.buttonsArray.length === 1)
			cls += "buttonOneOfOneLeft";
		else if(this.buttonsArray.length === 2)
			cls += "buttonOneOfTwoLeft";
		else
			// untried as of 3/15/17
			cls += "buttonOneOfThreeLeft";
		let bobj = {key: "key" + newInteger(),
			    className: cls};
			
		return CE("div",bobj,arr );		
	};	
		
	
	close(){
		if(this.selectionListController)
			this.selectionListController.close();
		let rt = this.getRoot();
		let arr = rt.children;
		if(arr.length > 0)
			rt.removeChild(arr[0]);
	};

	// invoked by a controller
	getLists(){
		if(this.selectionListController)
			return this.selectionListController.getLists();
		else
			return null;
	};

	// callback for single-column list when list element
	// is selected by clicking on list
	clicked(event){
		event.persist();
		let id = event.target.id;
		if(id == this.listOneSelected) return;
		document.getElementById(this.listOneSelected).className = 
			this.listObject.listClassName;
		this.listOneSelected = id;
		document.getElementById(this.listOneSelected).className = 
			this.listObject.listSelectionClassName;
	};

	

}; //class UIPopUp

/* ******************************************************

			class UIPopUpListController

***********************************************************  */

/* listObject has initially selected strings, as well as all available strings.
This assumes two columns - a leftList and a rightList, and also selectedLeft and
selectedRight initially.  The id of each list element is name:left or name:right.
Each name must be a unique string.*/



class UIPopUpListController extends AbstractNotifications{
	constructor(popup, listObject){
		super();

		this.clicked = this.clicked.bind(this);
		this.listObject = listObject;
		this.popup = popup;
		this.selectedIds = new Set();

	}

	setup(){
		//console.log(this.listObject);
		let left = this.listObject.selectedLeft;
		for(let i=0;i<left.length;i++){
			let id = left[i] + ":left";
			this.selectedIds.add(id);
			this.select(id);
		}
		let right = this.listObject.selectedRight;
		for(let i=0;i<right.length;i++){
			let id = right[i] + ":right";
			this.selectedIds.add(id);
			this.select(id);		
		}
	};

	// listClassName is style for unselected list elements.
	deselect(id){
		console.log("deselect: " + id);
		document.getElementById(id).className = 
				this.listObject.listClassName;
	};

	// listSelectionClassName has style for list elements which
	// are selected
	select(id){
		document.getElementById(id).className = 
				this.listObject.listSelectionClassName;
	};
		
			

	clicked(event){
		event.persist();
		let id = event.target.id;
		console.log("clicked: " + id);
		if(this.selectedIds.has(id) ){
			this.selectedIds.delete(id);
			this.deselect(id);
		}else{
			this.selectedIds.add(id);
			this.select(id);
		}
	};

	/* Return list of the form: {leftList: array, rightList: array}
	where each array is a list of the strings. If both arrays are
	empty, return null.
	*/
	getLists(){
		let left = [];
		let right = [];
		for(let id of this.selectedIds){
			let arr = id.split(":");
			if(arr[1] == "left")
				left.push( arr[0] );
			else 
				right.push( arr[0] );
		}
		if(left.length + right.length === 0)
			return null;
		else
			return { left: left, right: right};
	};

	close(){
		this.popup = null;
	};

}; // class UIPopUpListController
		
				


		