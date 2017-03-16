
/*
	
			INTRODUCTION

A recipe UI consists of set of LINES which have the recipe name and,
when clicked, opens the appropriate recipe screen.

recipe lines are not positioned absolutely but by the usual flow.
recipe screens, however, ARE positioned absolutely, at the top of the window. 
When opening a screen, the screen is automatically scrolled to
the top of the window.
*/


/* ******************************************************

			class RecipeLine

***********************************************************  */

/* Extends UIButton with useful attributes and methods
*/

class RecipeLine extends UIButton{

	constructor(positionInstance, uiFontObject, className, id, text, 
			callback, includeKeyBool, display, notificationController, 
			lineInstance){

		super(positionInstance, uiFontObject, className, id, text, 
			callback, includeKeyBool, display, notificationController);

		this.nameChanged = false;
		this.contentsChanged = false;
	};

	resetChanged(){
		this.nameChanged = false;
		this.contentsChanged = false;
	};

	isChanged(){
		return this.nameChanged || this.contentsChanged;
	};

};


/* ******************************************************

			class RecipeScreenAbstract

***********************************************************  */

/* 
Abstract superclass for recipe screens.
Positioning is done internally.It is positioned absolutely beneath the
corresponding line.     


*/

class RecipeScreenAbstract extends UI{
	constructor(callback, recipeDisplayController, recipeInstance, backgroundClickCallback){

		super("dummyClass",null,null, true);

		this.saveRecipe = this.saveRecipe.bind(this);
		this.deleteRecipe = this.deleteRecipe.bind(this);
		this.selectKeywords = this.selectKeywords.bind(this);
		this.backgroundClick = this.backgroundClick.bind(this);
		this.closeRecipeScreen = this.closeRecipeScreen.bind(this);
		this.assignRecipeKeywords = this.assignRecipeKeywords.bind(this);
		this.changeName = this.changeName.bind(this);
		this.assignNewName = this.assignNewName.bind(this);
		this.textChanged = this.textChanged.bind(this);
		this.selectBookForRecipe = this.selectBookForRecipe.bind(this);
		this.getSelectedBook = this.getSelectedBook.bind(this);
		this.addPhotoLinks = this.addPhotoLinks.bind(this);
		this.assignLinks = this.assignLinks.bind(this);

		this.callback = callback;
		this.controller = recipeDisplayController;
		this.recipe = recipeInstance;
		this.backgroundClick = backgroundClickCallback;

		this.myName = "RecipeScreenAbstract";

		this.textUIFont = getFontFromFontArray(recipeTextareaUIFontArray);
		this.simpleMenuUIFont = getFontFromFontArray(recipeSimpleMenuUIFontArray);
		this.nameUIFont = getFontFromFontArray(recipeNameUIFontArray);
		this.idObject = {}; 
		this.noRecipeCopyOnResize = false; // hack for closing screen when
						  // anything that has been changed is
						  // to be abandoned.
		
	};

	screenWidth(){
		return (this.controller.screenWidth - 55) + "px";
	};

	// IDENT MUST HAVE INITIAL CAPITAL
	// Name, Book, Link, Text,...
	getClassNameFromIdent(ident){
		if(ident == "Name")
			return recipeNameClass;
		else if (ident == "Ingredients")
			return recipeIngredientsClass;
		else if (ident == "Instructions")
			return recipeInstructionsClass;
		else if (ident == "Comments")
			return recipeCommentsClass;
		else if (ident == "Keywords")
			return recipeKeywordsClass;
		else if (ident == "Photo")
			return recipePhotoClass;
		else if (ident == "Link")
			return recipeLinkClass;
		else
			return recipeTextGeneralClass;
	};

	getIdOfTextarea(ident){
		if(this.idObject.hasOwnProperty(ident))
			return this.idObject[ident];
		else
			return null;
	};

	// all stying such as margins, text-align, read-only etc done in css class
	textAreaStyleObject(rows, vals, ident){		
		let fontSize = this.textUIFont.resize();// resize returns size in px
		let id = "textArea" + newInteger();
		this.idObject[ident] = id;
		let obj = { 	className: this.getClassNameFromIdent(ident),
				id: id, 
				key: "textKey" + newInteger(),
				defaultValue: vals,
				rows: String(rows),
				cols: "100",
				onKeyUp: this.textChanged,
				style: {
					fontSize: fontSize,
					width: this.screenWidth(),
					maxWidth: this.screenWidth()
					}
			    };
		if( (ident == "Book")||(ident == "Keywords")||(ident == "Name") )
			obj.readOnly = "true";
		return obj;
	};

	textAreaElement(rows, vals, ident){
		let obj = this.textAreaStyleObject(rows, vals, ident);
		return CE("textarea",obj, null);
	};


	/* arr is of form
		[ [text, callback], [text,callback],...]
		element is of form: space  text  space  text .....
	*/
	simpleMenuElement(add){
		let arr = [ 	["save recipe", this.saveRecipe],
				["delete recipe", this.deleteRecipe],
				["change name", this.changeName ],
				["select keywords",this.selectKeywords],
				["close", this.closeRecipeScreen] 
			   ];
		if(add) arr.push(add);

		// word or phrase spacing
		let spc = "";
		let numSpaces = getNumberFromPx( new UISize("%",2,4).resize() );
		numSpaces = Math.floor(numSpaces);
		for(let i=1;i<=numSpaces;i++)spc += " ";
		
		let retArr = [];
		let fontSize = this.simpleMenuUIFont.resize();
		for(let i=0;i<arr.length;i++){
			let key = "simpleMenu" + newInteger();
			let ce1 = CE("pre",{key: key, 
					     className:recipeSimpleMenuClass,
					     style:{
							display:"inline-block",
							fontSize: fontSize
						    }
						},spc);
			key = "simpleMenu" + newInteger();
			let posObj = new  PositionRectangle(null,null,
					new UISize("auto"),new UISize("15px"), null);
			
			let ce2 = new UIButton(posObj, this.simpleMenuUIFont,
					recipeSimpleMenuClass + "1",
					"id" + newInteger(), arr[i][0],
					arr[i][1],true,"inline-block",this);
			
			retArr.push(ce1);
			retArr.push(ce2.getReactElement());
		} // for

		
		
		let obj = {
				className:recipeSimpleMenuClass,
				key: "simpleMenu" + newInteger,
				style:	{
					 width: "100%",
					 height: "auto",
					display: "flex"
					 }
			   };

		return CE("div", obj, retArr);
	};

	// TEXT MUST BE INITIAL CAP
	titleElement(text){
		let obj = {	className: recipeTitleElementClass,
				style:{
					fontSize: this.nameUIFont.resize(),
					width: "100%",
					height: "auto"
					}
			   };
		let add = "";
		if(text == "Book") add = " (no edit)";
		if(text == "Keywords") add = " (no edit)";
		if(text == "Name") add = " (no edit)";
				
		return CE("div", obj, text.toUpperCase() + add);
	};

	/* resize() is implemented in the subclasses. All it does is to
	copy text from the text areas to the recipe. So it can be used
	when the screen is closed, to update the recipe object.
	*/

	resize(){
		window.alert("RecipeScreenAbstract: resize() - should not call");
	};

	// invoked from resize() in subclasses.
	preserveText(arr){
		if(this.noRecipeCopyOnResize){
			this.noRecipeCopyOnResize = false;
			return;
		};
		//console.log("preserveText");
		//console.log(this.idObject);
		arr.push( ["Comments", "comments"] );
		//console.log(arr);
		for(let i=0;i<arr.length;i++){
			if(! this.idObject.hasOwnProperty(arr[i][0]) ) return;
			let id = this.idObject[arr[i][0]];
			let elem = document.getElementById(id);
			let val = "********";
			if(elem) val = elem.value;
			this.recipe[arr[i][1]] = val;
			
		}
		//console.log(this.recipe);
	};

	// callback - keyup in a text area
	textChanged(event){
		this.controller.openedLine.contentsChanged = true;
	};

	getReactElement(){
		// implemented in subclasses
		window.alert(this.myName = " getReactElement");
	};

	saveRecipe(buttonInstance){
		console.log("save recipe");
		this.callback(this, "save");

	};

	deleteRecipe(buttonInstance){
		console.log("delete recipe");
		this.callback(this,"delete");

	};

	changeName(buttonInstance){
		console.log("change name");
		this.callback(this, "change name", this.assignNewName);
	};

	selectKeywords(buttonInstance){
		console.log("select keywords");
		this.callback(this,"select keywords", this.assignRecipeKeywords);

	};

	// invoked to put up list of books, where one or none
	// will be selected
	selectBookForRecipe(){
		console.log("selectBookForRecipe");
		this.callback(this, "select book", this.getSelectedBook);
	};

	// invoked after book selected from list, or cancel
	getSelectedBook(bookName){
		console.log("getSelectedBook: " + bookName);
		this.recipe.book = bookName;
	};
		

	closeRecipeScreen(buttonInstance) {
		console.log("close recipe screen");
		this.controller.closeScreen();
	};

	backgroundClick(event){
		console.log("background click");

	};

	assignNewName(nameString){
		console.log("assignNewName: " + nameString);
		this.recipe.name = nameString;
	};

	addPhotoLinks(){
		console.log("addPhotoLinks");
		this.callback(this, "add links", this.assignLinks);
	};

	assignLinks(arrayOfLinks){
		console.log("assignLinks: " + arrayOfLinks);
		this.recipe.photos = arrayOfLinks;
	};

	assignRecipeKeywords(obj){
		if(! obj) return;
		//in recipe,keywords = {meals:[], foods:[] }; //
		this.recipe.keywords.meals = obj.meals;
		this.recipe.keywords.foods = obj.foods;

		// Below is overridden if an update follows immediately after
		// assigning value. recipe.keywordsText() used instead.
		let id = this.idObject["Keywords"];
		let str = "";
		for(let i=0;i<obj.meals.length;i++)str += (obj.meals[i] + "  ");
		for(let i=0;i<obj.foods.length;i++)str += (obj.foods[i] + "  ");
		document.getElementById(id).value = str;
	};

	sendNotification(){
	};

}; //RecipeScreenAbstract

/* ******************************************************

			class RecipeTextScreen

***********************************************************  */

class RecipeTextScreen extends RecipeScreenAbstract{
	constructor(callback, recipeInstance, displayController,
			backgroundClickCallback){

		super(callback, displayController, recipeInstance, backgroundClickCallback);

		this.backgroundClickCallback = backgroundClickCallback;
		this.textId = "textScreen" + newInteger();

	};

	getReactElement(){	
		return CE("div",{id:this.textId},
				this.simpleMenuElement(null),
				this.titleElement("Name"),
				this.textAreaElement( recipeNumberOfNameRows, 
							this.recipe.name, "Name"),
			
				this.titleElement("Ingredients"),
				this.textAreaElement(recipeNumberOfIngredientsRows , 
						this.recipe.ingredients, "Ingredients"),
				this.titleElement("Instructions"),
				this.textAreaElement(recipeNumberOfInstructionsRows , 
						this.recipe.instructions, "Instructions"),
				this.titleElement("Comments"),
				this.textAreaElement(recipeNumberOfCommentsRows , 
						this.recipe.comments, "Comments"),
				this.titleElement("Keywords"),
				this.textAreaElement(recipeNumberOfKeywordsRows,
						this.recipe.keywordsText(), "Keywords" )
				
			);	
	};

	resize(){
		let arr = [ ["Ingredients","ingredients"],["Instructions","instructions"] ];
		this.preserveText(arr);
	};
};

/* ******************************************************

			class RecipePhotoScreen

***********************************************************  */

class RecipePhotoScreen extends RecipeScreenAbstract{
	constructor(callback, recipeInstance, displayController,
			backgroundClickCallback){

		super(callback, displayController, recipeInstance, backgroundClickCallback);

		this.backgroundClickCallback = backgroundClickCallback;
		this.textId = "photoScreen" + newInteger();

		//this.recipe = recipeInstance;
		this.textId = "photoId" + newInteger();
	};

	photoElement(){
		let arr = [];
		let obj = {
				className: recipePhotoClass,
				style:{
					width: this.screenWidth(),
					height: "auto",
				}
			   };
		for(let i=0;i<this.recipe.photos.length;i++){
				let obj1 = extend(obj,{key:"photoKey" + newInteger()} );
				obj1 = extend(obj1,{src: this.recipe.photos[i]} );
				let ce = CE("img",obj1,null);
				arr.push(ce);
		}
		return CE("div",{}, arr);
	};	

	getReactElement(){	
		return CE("div",{id:this.textId},
				this.simpleMenuElement(["add photo links", this.addPhotoLinks]),
				this.titleElement("Name"),
				this.textAreaElement( recipeNumberOfNameRows, 
							this.recipe.name, "Name"),
				this.titleElement("Photos"),
				this.photoElement(),
				this.titleElement("Comments"),
				this.textAreaElement(recipeNumberOfCommentsRows , 
						this.recipe.comments, "Comments"),
				this.titleElement("Keywords"),
				this.textAreaElement(recipeNumberOfKeywordsRows,
						this.recipe.keywordsText(), "Keywords" )
			);	
	};

	resize(){
		let arr = [];
		this.preserveText(arr);
	};

}; // class RecipePhotoScreen

/* ******************************************************

			class RecipeLinkScreen

***********************************************************  */

class RecipeLinkScreen extends RecipeScreenAbstract{
	constructor(callback, recipeInstance, displayController,
			backgroundClickCallback){

		super(callback, displayController, recipeInstance, backgroundClickCallback);

		this.backgroundClickCallback = backgroundClickCallback;
		this.followLink = this.followLink.bind(this);
		this.textId = "linkScreen" + newInteger();

		//this.recipe = recipeInstance;
		this.textId = "linkId" + newInteger();
	};

		getReactElement(){
			return CE("div",{id:this.textId},
				this.simpleMenuElement(  ["follow link", this.followLink] ),
				this.titleElement("Name"),
				this.textAreaElement( recipeNumberOfNameRows, 
							this.recipe.name, "Name"),
				this.titleElement("Link"),
				this.textAreaElement(recipeNumberOfLinkRows,
						this.recipe.link,"Link"),
				this.titleElement("Comments"),
				this.textAreaElement(recipeNumberOfCommentsRows , 
						this.recipe.comments, "Comments"),
				this.titleElement("Keywords"),
				this.textAreaElement(recipeNumberOfKeywordsRows,
						this.recipe.keywordsText(), "Keywords" )
			);	
	};

	followLink(){
		let id = this.idObject["Link"];
		let val = document.getElementById(id).value;
		this.recipe.link = val;
		//this.resize();
		window.open(this.recipe.link);
	};

	resize(){
		let arr = [["Link", "link"]];
		this.preserveText(arr);
	};

}; //class RecipeLinkScreen


/* ******************************************************

			class RecipeBookScreen

***********************************************************  */

class RecipeBookScreen extends RecipeScreenAbstract{
	constructor(callback, recipeInstance, displayController,
			backgroundClickCallback){

		super(callback, displayController, recipeInstance, backgroundClickCallback);

		this.backgroundClickCallback = backgroundClickCallback;
		this.textId = "bookScreen" + newInteger();

		//this.recipe = recipeInstance;
		this.textId = "bookId" + newInteger();
	};

	getReactElement(){	
		return CE("div",{id:this.textId},
				this.simpleMenuElement(["select book", this.selectBookForRecipe] ),
				this.titleElement("Name"),
				this.textAreaElement( recipeNumberOfNameRows, 
							this.recipe.name, "Name"),

				this.titleElement("Book"),
				this.textAreaElement( recipeNumberOfBookRows, 
							this.recipe.book, "Book"),

				this.titleElement("Comments"),
				this.textAreaElement(recipeNumberOfCommentsRows , 
						this.recipe.comments, "Comments"),
				this.titleElement("Keywords"),
				this.textAreaElement(recipeNumberOfKeywordsRows,
						this.recipe.keywordsText(), "Keywords" )
			);
		};

	resize(){
		let arr = [];
		this.preserveText(arr);
	};

}; //class RecipeBookScreen


/* ******************************************************

			class RecipeDisplayController

***********************************************************  */

/*
This class is a gate between the recipe UI elements and the top-level
controller. This class manages the explicit recipe UI elements, receives callbacks, 
provides data, receives notifications, etc. The top-level controller
does not communicate directly with the recipe UI elements, but
with (an instance of) this class.

class names are classes used to style the various UIelements

DOES NOT RESPOND TO BACKGROUND NOTIFICATIONS.
*/

class RecipeDisplayController extends AbstractNotifications{
	constructor(topLevelController, controllerCallback, recipeModelController,
			initialRecipesArray ){
		super();

		this.callbackFromLine = this.callbackFromLine.bind(this);
		this.screenCallback = this.screenCallback.bind(this);
		this.backgroundClickCallback =this.backgroundClickCallback.bind(this);
		this.backgroundClick = this.backgroundClick.bind(this);		
		this.saveThisRecipe = this.saveThisRecipe.bind(this);
		this.deleteThisRecipe = this.deleteThisRecipe.bind(this);
		this.cancelThisAction = this.cancelThisAction.bind(this);
		this.selectTheseKeywords = this.selectTheseKeywords.bind(this);
		this.nameDoneCallback = this.nameDoneCallback.bind(this);
		this.closeThisRecipe = this.closeThisRecipe.bind(this);
		this.closeScreenNoChange = this.closeScreenNoChange.bind(this);
		this.bookSelectDoneCallback = this.bookSelectDoneCallback.bind(this);
		this.photoLinkDoneCallback = this.photoLinkDoneCallback.bind(this);

		this.controller = topLevelController;
		this.callback = controllerCallback;
		this.model = recipeModelController;
	
		this.lineUIFontObj = getFontFromFontArray(recipeLineUIFontArray);

		this.recLinArray =[]; // array of objects 
					//{recipe: the recipe,line: associatedLine}

		this.openedRecipeScreen = null; // if not null, a screen is open
		this.openedLine = null;
		this.menuUp = false;
		this.screenWidth; // used by screens to set textarea width
		this.bookCallback = null; // for adding book
		this.bookListCallback = null; // for selecting book from list
		this.keywordsCallback = null;
		this.photoLinkCallback = null;
		this.nameCallback = null;
		this.nameTextObject = null;
		this.bookTextObject = null;
		this.photoTextObject = null;
		this.screenChanged = false;
		this.popup = null;
		this.recipesArray = initialRecipesArray;

		this.setup(this.recipesArray);
		this.resize();
		

	};

	setup(recipesArray){
		this.createLineInstances(recipesArray);
	};
	// invoked from top-level controller usually
	insertRecipe(recipe){
		this.recipesArray.push(recipe);
		this.createLineInstances(this.recipesArray); // sorts
		let line = this.getLineForRecipe(recipe);
		if(line === null) return;
		line.resetChanged();
		this.openScreen(line);
	};

	getLineForRecipe(recipe){
		for(let i=0;i<this.recLinArray.length;i++){
			if(recipe.identifier == this.recLinArray[i].recipe.identifier)
				return this.recLinArray[i].line;
			}
		return null;
	};

	removeRecipeFromArray(recipe){
		this.recipesArray = [];
		//console.log(JSON.stringify(this.recLinArray) );
		for(let i=0;i<this.recLinArray.length;i++){
			if(recipe.identifier != this.recLinArray[i].recipe.identifier)
				this.recipesArray.push(this.recLinArray[i].recipe);
		}
	};

	// no notification controller for any RecipeLine
	createLineInstances(recipesArray){
		this.recLinArray =[];
		sortArrayOfRecipes(this.recipesArray);// sorts array in place
		for(let i=0;i<recipesArray.length;i++){
			let posObj = createPositionObjectFromObject(recipeLinePositionObject); 
			let name = recipesArray[i].name;
			let id = name + ":" + i + ":" + newInteger();
			let line = new RecipeLine(posObj, this.lineUIFontObj, recipeLineClass,
				id, name, this.callbackFromLine, true, null, null);
			this.recLinArray.push({recipe: recipesArray[i], line: line});
		} // for
	};		
	
	/* If there is an opened screen, resize copies values from 
		textarea to recipe instance unless
		this.openedRecipeScreen.noRecipeCopyOnResize = true;
		It will only be true for the next resize and then it
		is set back to false (the default value).
	*/	
	resize(){
		for(let i=0;i<this.recLinArray.length;i++)
			this.recLinArray[i].line.resize();
		if(this.openedRecipeScreen)
			this.openedRecipeScreen.resize();
	};

	/* lineInstance is a value of property line: in an object
	in recLinArray */ 
	callbackFromLine(lineInstance){
		if( (this.menuUp) || (this.openedRecipeScreen) ){
			let notif = new Notification("background", this);
			controller.sendNotification(notif);
			return;
		}

		this.openScreen(lineInstance);
	};

	getIndexOfLine(screen){
		let id= screen.id;
		let arr = id.split(":");
		return Number(arr[1]);
	};

	// note that this.openedLine is not available here
	changeTextOfLineTo(newName){
		this.openedLine.text = newName;
		this.openedLine.nameChanged = true;
	};	

	getReactElement(){
		let arr = [];
		let screenIndex = null;
		
		if(! this.openedRecipeScreen){
			for(let i=0;i<this.recLinArray.length;i++){
				let elem = this.recLinArray[i].line.getReactElement();
				arr.push( elem);
			}
		}
		
		if(this.openedRecipeScreen){
			this.screenWidth = getNumberFromPx( new UISize("%",300,700).resize() );	
			let elem = this.openedRecipeScreen.getReactElement();
			
			let obj = {	key: "key" + newInteger(),
			    	    	className: recipeScreenContainerClass,
			   		onClick: this.backgroundClick,
			    		style:{
						position: "absolute",
						top: 30 + "px",
						left: "10px",
						width: (this.screenWidth - 30) + "px",
						height: "auto",				    
						}
			  	   };
			arr.push( CE("div",obj, elem));		
		}
		return arr; 
	};

	// invoked from screen when contents of any text area has changed
	screenContentsChanged(){
		if(this.openedLine)
			this.openedLine.contentsChanged = true;
	};

	openScreen(lineInstance){
		console.log("openScreen");

		this.openedLine = lineInstance;
		let arr = lineInstance.id.split(":");
		let indx = Number(arr[1]);
		let recipe = this.recLinArray[indx].recipe;

		let x = [ this.screenCallback, recipe, this,
				   this.backgroundClickCallback ];

		if(recipe.type == "text"){
			this.openedRecipeScreen = new RecipeTextScreen(
					x[0], x[1], x[2], x[3]);
		}else if (recipe.type == "photo"){
			this.openedRecipeScreen = new RecipePhotoScreen(
			 		x[0], x[1], x[2], x[3]);
		}else if (recipe.type == "link"){
			this.openedRecipeScreen = new RecipeLinkScreen(
			 		x[0], x[1], x[2], x[3]);
		} else if (recipe.type == "book"){
			this.openedRecipeScreen = new RecipeBookScreen(
			 		x[0], x[1], x[2], x[3]);
		} else{
			window.alert("RecipeDisplayController - bad recipe type: "
					 + recipe.type);
		}
		this.controller.update();
		window.scrollTo(0,0);
	};

	// callback from screen
	closeScreen(){
		if(this.openedLine){
			if(this.openedLine.isChanged()){
				this.createPopUp("close", null, null,null);
			}
			else{
				this.closeScreenLocal();
			}
		}
		
	};

	closeScreenLocal(){
		this.openedLine.resetChanged();
		this.createLineInstances(this.recipesArray); // sorts

		this.openedRecipeScreen = null;
		this.bookCallback = null;
		this.bookListCallback = null;
		this.keywordsCallback = null;
		this.nameCallback = null;
		this.photoLinkCallback = null;
		this.openedLine = null;

		this.controller.update();
	};
		

	screenCallback(screenInstance, action, callback = null){
		console.log("RecipeDisplayController - screenCallback, action: " + action);
		let nameId = screenInstance.getIdOfTextarea("Name");
		let textarea = document.getElementById(nameId);
		let name = textarea.value;
		let currentKeywords = screenInstance.recipe.keywords;
		this.createPopUp(action, name, currentKeywords, callback);
	};


	// this is also used by top-level controller to create pop ups
	// callback is to a method in display screen
	
	createPopUp(action, name, currentKeywords, callback){
		let textObject = null;
		let listObject = null;
		let buttonsArray = null;
		let messageObject = null;
		this.bookCallback = null;
		this.bookListCallback = null;
		this.keywordsCallback = null;
		this.photoLinkCallback = null;
		this.nameCallback = null;
		this.bookTextObject = null;
		this.nameTextObject = null;
		this.photoTextObject = null;

		if(action == "save"){
			let str = "Save recipe. This will overwrite the existing recipe.";

			messageObject = {text: str,className: popupGeneralMessageClass,
						fontSize: new UISize(popupDefaultFontSize) };

			buttonsArray = [
				{text: "save",className: "buttonStyle",
					callback: this.saveThisRecipe,
					fontSize: new UIFont(new UISize(popupDefaultFontSize) )
				},
				{text: "cancel", className: "buttonStyle",
				 callback: this.cancelThisAction,
				 fontSize: new UIFont(new UISize(popupDefaultFontSize) )
				}
					];
						
			
		}else if(action == "delete"){
			let str = "Delete recipe named: '" + name + "' ? "; 
			messageObject = {text: str,className: popupGeneralMessageClass,
						fontSize: new UISize(popupDefaultFontSize) };

			buttonsArray = [
				{text: "delete",className: "buttonStyle",
					callback: this.deleteThisRecipe,
					fontSize: new UIFont(new UISize(popupDefaultFontSize) )
				},
				{text: "cancel", className: "buttonStyle",
				 callback: this.cancelThisAction,
				 fontSize: new UIFont(new UISize(popupDefaultFontSize) )
				}
					];

		}else if(action == "close"){
			let str = "Recipe has changed. To save changes, click 'cancel', " + 
				    "then click 'save recipe'. " +
				     "To lose all changes, including any name change, " +
					"click 'close' ";
			messageObject = {text: str,className: popupGeneralMessageClass,
						fontSize: new UISize(popupDefaultFontSize) };

			buttonsArray = [
				{text: "close",className: "buttonStyle",
					callback: this.closeScreenNoChange,
					fontSize: new UIFont(new UISize(popupDefaultFontSize) )
				},
				{text: "cancel", className: "buttonStyle",
				 callback: this.cancelThisAction, 
				 fontSize: new UIFont(new UISize(popupDefaultFontSize) )
				}
					];


		}else if (action == "change name"){
			this.nameCallback = callback;
			let str = "Please enter the new name of the recipe. " +
			           "This does NOT save the recipe or the new name."
					
			messageObject = {text: str,className: popupGeneralMessageClass,
						fontSize: new UISize(popupDefaultFontSize) };

			// use Book class for name
			textObject = {className: "popupBookTextareaClass",
					oldName: name,
					id: "name" + newInteger()}; 
	
			this.nameTextObject = textObject;
			this.nameCallback = callback;

			buttonsArray = [
				{text: "change",className: "buttonStyle",
					callback: this.nameDoneCallback,
					fontSize: new UIFont(new UISize(popupDefaultFontSize) )
				},
				{text: "cancel", className: "buttonStyle",
				 callback: this.cancelThisAction,
				 fontSize: new UIFont(new UISize(popupDefaultFontSize) )
				}
					];

		}else if(action == "select keywords"){
			// left is meals, right is foods
			this.keywordsCallback = callback; // may be null
			//console.log(currentKeywords);
			let keywords = controller.allKeywords();
			let str = "Select keywords for '" + name + "'.";

			messageObject = {text: str,className: popupGeneralMessageClass,
						fontSize: new UISize(popupDefaultFontSize) };

			
			
			listObject = {leftList: keywords.meals, leftTitle: "MEALS",
						rightList: keywords.foods, rightTitle: "FOODS",
						selectedLeft: currentKeywords.meals,
						selectedRight: currentKeywords.foods,
						numColumns: 2, 
						fontSize: 
					           new UIFont(new UISize(popupDefaultFontSize)),
						listClassName: "popupKeywordsList",
						listSelectionClassName:"popupKeywordsListSelected", 
						titleClassName: "popupKeywordsTitle" };

			buttonsArray = [
				{text: "select",className: "buttonStyle",
					callback: this.selectTheseKeywords,
					fontSize: new UIFont(new UISize(popupDefaultFontSize) )
				},
				{text: "cancel", className: "buttonStyle",
				 callback: this.cancelThisAction,
				 fontSize: new UIFont(new UISize(popupDefaultFontSize) )
				}
					];

		}else if (action == "select book"){
			this.bookListCallback = callback;
			let books = this.controller.allBooks();
			let str = "Please select a book."
			messageObject = {text: str,className: popupGeneralMessageClass,
						fontSize: new UISize(popupDefaultFontSize) };

			listObject = {list: books,numColumns: 1, select: true,
					fontSize:new UIFont(new UISize(popupDefaultFontSize)),
					listClassName: "popupBooksList",
					listSelectionClassName:"popupBooksListSelected"
					};

			buttonsArray = [
				{text: "select",className: "buttonStyle",
					callback: this.bookSelectDoneCallback,
					fontSize: new UIFont(new UISize(popupDefaultFontSize) )
				},
				{text: "cancel", className: "buttonStyle",
				 callback: this.cancelThisAction,
				 fontSize: new UIFont(new UISize(popupDefaultFontSize) )
				}
					];

	
		}else if (action == "add links"){   // links to photos
			this.photoLinkCallback = callback;  
			let str = "Please enter one or more links to photos of a recipe. " +
				  "Each link should have carriage return ('enter') at end."
				  
			messageObject = {text: str,className: popupGeneralMessageClass,
						fontSize: new UISize(popupDefaultFontSize) };
			
			let photoLinksArray = [];
			if(this.openedRecipeScreen)
				photoLinksArray = this.openedRecipeScreen.recipe.photos;
			textObject = {	className: "popupPhotoTextareaClass", 
				      	oldName: photoLinksArray,
					id: "photo" + newInteger()}; 

			this.photoTextObject = textObject;

			buttonsArray = [
				{text: "done",className: "buttonStyle",
					callback: this.photoLinkDoneCallback,
					fontSize: new UIFont(new UISize(popupDefaultFontSize) )
				},
				{text: "cancel", className: "buttonStyle",
				 callback: this.cancelThisAction,
				 fontSize: new UIFont(new UISize(popupDefaultFontSize) )
				}
					];
			
		
		}else{
			window.alert("RecipeDisplayController - bad action");
		}

		this.popup = new UIPopUp( null ,popupGeneralContainer,
					   null, messageObject,textObject,
					     buttonsArray, listObject);
		this.popup.open();

		// notifications not needed here
		//let notif = new Notification("menuUp", this);
		//this.controller.sendNotification(notif);
	};

	/* Be careful about update. A resize copies values from textareas to
	the recipe object, and this may not be desired. 
	*/
	closePopup(update = true){
		if(this.popup)this.popup.close();
		//let notif = new Notification("menuDown", this);
		//this.controller.sendNotification(notif);

		this.popup = null;
		this.bookCallback = null;
		this.keywordsCallback = null;
		this.nameCallback = null;
		this.photoLinkCallback = null;
		
		if(update)this.controller.update();
	};

	backgroundClick(event){
		console.log("display controller background click");
	};

	backgroundClickCallback(){
		// do nothing

	};

	receiveNotification(notif){
		console.log("RecipeDisplayController - receiveNotification");
		console.log(notif);
		if(notif.owner === this) return;
		if(notif.type == "menuUp"){
			this.menuUp = true;
			return;
		}
		if(notif.type == "menuDown"){
			this.menuUp = false;
			return;
		};

	};

	closeOpenedScreen(){

	};

	// CALLBACKS FROM POPUPS ==================================

	/* If new keywords have been assigned, they will already be
	in the recipe instance. Same with the name and the book.*/
	saveThisRecipe(){
		console.log("saveThisRecipe");
		
		this.openedRecipeScreen.resize(); // updates recipe instance 
		this.openedLine.resetChanged();
		let recipe = this.openedRecipeScreen.recipe;
		this.closePopup(false);
		this.controller.saveThisRecipe(recipe);
	};

	// callback from delete button
	deleteThisRecipe(){
		console.log("deleteThisRecipe");
		let recipe = this.openedRecipeScreen.recipe;
		controller.deleteThisRecipe(recipe);//deletes from storage
		this.openedLine.resetChanged();
		this.closePopup(false);
		//console.log(recipe);
		this.removeRecipeFromArray(recipe);// re-creates recipesArray
		//console.log(JSON.stringify(this.recipesArray) );
		this.closeScreenLocal(); // recreates line elements
	};

	// callback from cancel button
	cancelThisAction(){
		console.log("cancelThisAction");
		this.closePopup();

	};

	// when selecting book from list
	bookSelectDoneCallback(){
		console.log("bookSelectDoneCallback");
		let bookName = this.popup.listOneSelected;
		if(this.openedLine)this.openedLine.contentsChanged = true;
		this.bookListCallback(bookName);
		this.closePopup();// must happen  AFTER bookNAme processed
	}

	// callback when changing name
	nameDoneCallback(){
		console.log("nameDoneCallback");
		let id = this.nameTextObject.id;
		let newName = document.getElementById(id).value;
		
		// alter recipe object, callback to screen
		// callback assigned in method changeName().
		if(this.nameCallback) this.nameCallback(newName);
		if(this.openedLine) this.openedLine.nameChanged = true;
		this.closePopup();
	};

	photoLinkDoneCallback(){
		console.log("photoLinkDoneCallback");
		let id = this.photoTextObject.id;
		let links = document.getElementById(id).value;
		let arr = links.split("\n");
		this.photoLinkCallback(arr);
		if(this.openedLine) this.openedLine.contentsChanged = true;
		this.closePopup();
	};

	// callback from the "select" button of keywords list screen
	selectTheseKeywords(){
		console.log("selectTheseKeywords");

		let keywordObj = this.popup.getLists();
		console.log(keywordObj);
		let obj;
		if(keywordObj)
			obj = {meals: keywordObj.left,
				foods: keywordObj.right};
		else
			obj =  null;

		// this next invokes a method in the screen. See
		// RecipeScreenAbstract,  method selectKeywords().
		// Also can have a callback in some other instance.
		// see classs RecipeSearchUIPopUp.
		if(this.keywordsCallback) this.keywordsCallback(obj);
		if(this.openedLine) this.openedLine.contentsChanged = true;
		this.closePopup();
		};

	closeThisRecipe(){
		this.closePopup(false); // no resize
		this.closeScreenLocal();
	};

	/* Must be careful that resize() doesn't copy old
	values from textarea to recipe after recipe has reverted to
	saved.
	*/
	closeScreenNoChange(){
		this.openedLine.resetChanged();
		let recipe = this.openedRecipeScreen.recipe;
		this.controller.revertRecipe(recipe);
		this.openedRecipeScreen.noRecipeCopyOnResize = true;//hack hack
		this.closeThisRecipe(); // causes resize
	};
		
		

	//================================================


}; //class RecipeDisplayController


/* ******************************************************

			class RecipeButtonBarController

***********************************************************  */

/*{
	buttonObjectArray - arrayof objects of the form

	label: aString,
	choices: array of choices for a drop-down menu.
	text: aString, which appears on the button
	callback: a callback to the controller, generally with the
			choice made.
	classNames: aString - space-delineated names of the classes used for styling and positioning
		of the button. One of them must declare "position: absolute". These names
		may be the same for all buttons, but of course it is always possible
		to style the buttons individually.
	id: aString - the actual id of the button.
	idPrefix: aString - Used ONLY if id is null. In that case
		the id is this string and a number automatically generated.
	keyPrefix: aString - the prefix from which a key is generated by appending a
			unique number. This can be the same for each button.
	}

	This class handles ALL notifications for the drop down.
*/

class RecipeButtonBarController extends AbstractNotifications{
	constructor(topLevelController, buttonObjectsArray){
		super();

		this.selected = this.selected.bind(this);
		this.selectionMade = this.selectionMade.bind(this);

		this.controller = topLevelController;
		this.buttonObjectsArray = buttonObjectsArray;
		this.buttonArray = [];
		this.dropDownObjects = {};
		this.dropDownArray = [];
		this.menuUp = false;
		this.selectedDropDown = null;

		this.setup();

	};

	setup(){
		let barr = this.buttonObjectsArray;
		this.buttonArray = [];
		this.dropDownObjects = {};
		for(let i=0;i<barr.length;i++){
			
			let fntsz = new UISize("%",8,20); // resizes
			let uifont = new UIFont(fntsz);
		
			let button = new UIButtonContained(null, uifont,"buttonStyle", 
				"buttonId" + newInteger(), barr[i].text,
				this.selected,true,null, null,"container",
				null,this.controller);

			this.buttonArray.push(button);
			this.dropDownObjects[button.id] = i;
		} // for

		let barPos = new PositionRectangle(null,null, 
					new UISize("auto"),new UISize("auto"), null);
		this.buttonBar = new UIButtonBar(barPos, this.buttonArray, "buttonBar",
								this.controller);
		this.resize();
		//return CE("div",{className: "buttonBar"},this.buttonBar);
		
		// create drop downs for each button
		this.dropDownArray= [];
		for(let i=0;i<this.buttonObjectsArray.length;i++){
			let obj = this.buttonObjectsArray[i];
			let fnt = new UIFont(new UISize("%",8,15) );
			let choices = obj.choices;
			let dropDown = new UIDropDownMenu(this.buttonArray[i], fnt, 
					"dropDownContainer", "cellClass", 
					"bottom", choices, this.selectionMade, "drop");
			this.dropDownArray.push(dropDown);
			dropDown.resize();
		}
	};

	resize(){
		this.buttonBar.resize();
	};

	getReactElement(){
		let elem = this.buttonBar.getReactElement();
		//console.log(elem);
		return elem;
	};

	// button has been clicked - open drop down
	selected(button){
		console.log("recipeButtonBarController-selected");
		if(this.menuUp) return;
		if(this.selectedDropDown) return;

		let id = button.id;
		this.selectedDropDown = this.dropDownArray[this.dropDownObjects[id]];
		this.selectedDropDown.putUpMenu();
		this.buttonBar.ignoreBackground = true;
		this.menuUp = true;
		let notif = new Notification("menuUp", this);
		this.controller.sendNotification(notif);
	};

	getButtonForDropDown(){
		if(this.selectedDropDown) 
			return this.selectedDropDown.triggerObject;
		else
			return null
	};

	// Invoked from UIDropDownMenu
	selectionMade(dropDown, choice){
		console.log("recipeButtonBarController - selectionMade");
		let name = dropDown.triggerObject.text;		
		let id = dropDown.triggerObject.id;
		let indx = this.dropDownObjects[id];
		let callback = this.buttonObjectsArray[indx].callback;
		this.selectedDropDown = null;
		this.menuUp = false;
		let notif = new Notification("menuDown", this);
		this.controller.sendNotification(notif);	
		callback(name, choice);
	};


	receiveNotification(notif){
		console.log("recipeButtonBarController-receiveNotification");
		//console.log(notif);
		//console.log(this.selectedDropDown);
		if(notif.owner === this) return;
		if(notif.type == "backgroundFromButtonClicked"){
			let button = this.getButtonForDropDown(); // could be null
			if(notif.owner === button) {
				console.log("ignoring notification");
				return;
			}
		}

		if(this.selectedDropDown){
			if( (notif.type == "background") || 
		   	   (notif.type == "backgroundFromButtonClicked")||
			     (notif.type == "resize") ){
				this.selectedDropDown.close();
				this.selectedDropDown = null;
				this.menuUp = false;
				let notify = new Notification("menuDown", this);
				this.controller.sendNotification(notify);
			}
		}else if (notif.type == "menuUp"){
			this.menuUp = true;
		}
		else if (notif.type == "menuDown"){
			this.menuUp = false;
		}
		
	};
}; //class RecipeButtonBarController


/* ******************************************************

			class RecipeSearchUIPopUp

***********************************************************  */

/*
Special-purpose class to put up pop up for searching.
Subclass of UIPopUp. 
*/

class RecipeSearchUIPopUp extends UIPopUp{
	constructor(container, controller, messageObject, textObject, buttonsArray, elementId){
		super(null, container, null, messageObject,
				textObject, buttonsArray, null, elementId);

		
		this.selectKeywords = this.selectKeywords.bind(this);
		this.assignRecipeKeywords = this.assignRecipeKeywords.bind(this);
		this.secondTextObject = null;
		this.controller = controller;
		this.secondMessageObject = null;
		this.keywordsPopup = null;	
		this.selectedKeywordsArray = [];	
		
	};

	getReactElement(){
		let arr=[];

		// done in superclass
		let msg = this.getMessageElement();
		if(msg)arr.push(msg);
		let txt = this.getTextAreaElement();
		if(txt) arr.push(txt);

		// done in this class
		let msg2 = this.getSecondMessageElement();
		if(msg2) arr.push(msg2);
		let txt2 = this.getSecondTextElement();
		if(txt2) arr.push(txt2);

		// done in superclass
		let buttons = this.getButtonsElement();
		if(buttons) arr.push(buttons);

		this.containerId = "popupContainer" + newInteger();
		let obj = {className: popupGeneralContainer,
			    id: this.containerId,
			    key: "key" + newInteger()};
		return CE("div", obj, arr);
	};	

	
	getSecondMessageElement(){
		let obj = {className: "popupSelectKeywordsMessage",
			id: "keywordsMessage:" + newInteger(),
			key: "key" + newInteger(),
			onClick: this.selectKeywords,
			style:{
				fontSize: new UIFont(new UISize(popupDefaultFontSize)),
				}
			  };
		return CE("div", obj, "click to select keywords");
	};

	getSecondTextElement(){
		this.secondTextObject = {className: "popupBookTextareaClass", 
					id: "text" + newInteger(),
					key: "key" + newInteger(),
					readOnly: true}; 

		return CE("textarea", this.secondTextObject,null);

	};

	// puts up <select keywords" popup
	selectKeywords(){
		console.log("RecipeSearchUIPopUp - selectKeywords");
		let displayController = this.controller.lineController;
		let currentKeywords = {meals: [], foods: [] };
		displayController.createPopUp("select keywords", "none", currentKeywords, 
			this.assignRecipeKeywords)
	};

	// obj contains selected keywords. Put in second text area, and
	// save for later access
	assignRecipeKeywords(obj){
		console.log("RecipeSearchUIPopUp - assignRecipeKeywords");
		console.log(obj);
		let arr = [];
		let str= "";
		if( obj) arr = (obj.meals).concat(obj.foods);
		this.selectedKeywordsArray = arr;
		if(arr.length === 0){
			let id2 = this.secondTextObject.id;
			document.getElementById(id2).value = "";
			return;
		};
		for(let i=0; i<arr.length; i++) str += arr[i] + " ";
		let id = this.secondTextObject.id;
		document.getElementById(id).value = str;
	};
		

	
}; //class RecipeSearchUIPopUp


























