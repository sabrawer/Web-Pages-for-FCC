/* ******************************************************

			class RecipeStore

***********************************************************  */

class RecipeStore{
	constructor(){
	};

	saveRecipe(recipe){
		window.alert("save not implemented");

	};

	deleteRecipe(recipeName){
		window.alert("delete not implemented");

	};

	readRecipe(recipeName){
		window.alert("read not implemented");

	};

};

/* ******************************************************

			class RecipeStoreLocal

***********************************************************  */

/*
identifiers are of the form Recipe:aNumber. identifiers are the keys
for recipes
*/

class RecipeStoreLocal extends RecipeStore{
	constructor(){
		super();

		this.revertRecipe = this.revertRecipe.bind(this);

		this.recipeIdentifierArrayKey = "recipeIdentifierArray";
		this.recipeBooksArrayKey = "recipeBooksArray";

		this.recipeIdentifierArray = 
		    this.readList(this.recipeIdentifierArrayKey); // array of identifiers
								// of recipes in database

		this.recipeBooksList = this.readList(this.recipeBooksArrayKey);
		this.recipeKeywordsObj = this.createKeywordsObject();

		this.recipeIdentifierNameObject = 
			this.createRecipeIdentifierNameObject();// {identifier:name,....}
		console.log("DATABASE LISTS");
		console.log(this.recipeIdentifierArray);
		console.log(this.recipeBooksList);
		console.log(this.recipeIdentifierNameObject);
	}

	createUniqueIdentifier(){
		let maxNum = 0;
		for(let i=0;i<this.recipeIdentifierArray.length;i++){
			let arr = this.recipeIdentifierArray[i].split(":");
			let num = Number(arr[1]);
			if(num > maxNum) maxNum = num;
		}	
		return "Recipe:" + (maxNum + 1);
	};

	readList(key){
		let list = this.getFromLocalStorage(key, false);
		if(! list){
			list = [];
			this.storeLocal(key,list);
		}
		return list;
	};

	createRecipeIdentifierNameObject(){
		let obj = {};
		for(let i=0;i<this.recipeIdentifierArray.length;i++){
			let key = this.recipeIdentifierArray[i];
			let recObj = this.getFromLocalStorage(key, false);
			if(recObj)obj[key] = recObj.name;
		};
		return obj;
	};

	readRecipe(identifier){
		if(this.recipeIdentifierIndex(identifier) < 0) return null;
		return this.getFromLocalStorage(identifier, true);
	};


	deleteRecipe(identifier){
		this.deleteFromRecipeIdentifierArray(identifier); // also from identifier-name obj
		this.removeFromLocalStorage(identifier);
	};

	// cannot save or retrieve methods of class instances
	// note - name may have been modified, so thaty the
	// this.recipeIdentifierNameObject is always revised.
	// this.recipeIdentifierArray is modified only if it does
	// not already contain the identifier - ie, if this is brand
	// new recipe.
	saveRecipe(recipe){
		let temRecipe = {};
		let keysArr = recipe.getKeys();
		for(let i=0;i<keysArr.length;i++){
			temRecipe[keysArr[i]] = recipe[keysArr[i]];
		}
		let identifier = recipe.identifier;
		this.recipeIdentifierNameObject[identifier] = recipe.name;
		let indx = this.recipeIdentifierIndex(identifier);
		if(indx < 0){
			this.recipeIdentifierArray.push(identifier);
			// store modified array
			this.storeLocal(this.recipeIdentifierArrayKey, this.recipeIdentifierArray);
		}
		this.storeLocal(identifier, temRecipe);
	};

	recipeIdentifierIndex(identifier){
		let indx = this.recipeIdentifierArray.indexOf(identifier);
		return indx;
	};


	deleteFromRecipeIdentifierArray(identifier){
		let indx = this.recipeIdentifierIndex(identifier);
		if(indx < 0) {
			window.alert("deleteFromRecipeIdentifierArray - no such recipe: " + identifier);
			return;
		}
		this.recipeIdentifierArray.splice(indx, 1);
		this.storeLocal(this.recipeIdentifierArrayKey, this.recipeIdentifierArray);
		delete this.recipeIdentifierNameObject[identifier];
	};
	
	storeLocal(key, obj){
		localStorage.setItem(key, JSON.stringify(obj) );
	};

	getFromLocalStorage(key, makeRecipe = false){
		let x = localStorage[key];
		if(! x) return null;
		if(! makeRecipe){
			return JSON.parse(x);
		}
		// now read a recipe
		// reading only fields. Need new recipe object
		let temRecipe = JSON.parse(x);
		let rec = new Recipe();
		let keysArr = rec.getKeys();
		
		for(let i=0;i<keysArr.length;i++){
			rec[keysArr[i]] = temRecipe[keysArr[i]];
		}
		rec.database = this;
		return rec;
	};

	// put fields of "recipe" back to what is stored
	// IF YOU USE CONSOLE TO PRINT RESULTS, YOU WILL NEED TO
	// STRINGIFY HERE BEFORE LOGGING. Else the object may change
	// before the logging and you won't see accurate result.
	// THIS IS A KNOWN PROBLEM.
	//
	revertRecipe(recipe){
		let obj = this.getFromLocalStorage(recipe.identifier,false);
		let keysArr = recipe.getKeys();
		for(let i=0;i<keysArr.length;i++){
			if(keysArr[i] == "identifier")continue;
			recipe[ keysArr[i] ] = obj[ keysArr[i] ];
		}
	};

	removeFromLocalStorage(key){
		let x = localStorage[key];
		if(! x) {
			console.log("***************key not in local storage: " + key);
			return;
		}
		localStorage.removeItem(key);
	};

	// does not delete books or keywords
	removeAllRecipeItems(){
		//console.log("removeAllRecipeItems-----------------------------");
		for(let i=0;i<this.recipeIdentifierArray.length;i++){
			//console.log(this.recipeIdentifierArray[i]);
			this.removeFromLocalStorage(this.recipeIdentifierArray[i]);
		}
		this.removeFromLocalStorage(this.recipeIdentifierArrayKey);
		//console.log("LIST BELOW SHOULD BE EMPTY");
		this.recipeIdentifierArray =
			this.readList(this.recipeIdentifierArrayKey); // put the list back
		//console.log(this.recipeIdentifierArray);
		this.recipeIdentifierNameObject = {};
		this.removeFromLocalStorage(this.recipeBooksArrayKey);
		// list below shold be empty
		this.recipeBooksList = this.readList(this.recipeBooksArrayKey);

	};

	addBook(bookStr){
		console.log(bookStr);
		this.recipeBooksList.push(bookStr);
		this.storeLocal(this.recipeBooksArrayKey, this.recipeBooksList);
	};	

	allRecipeNames(){
		//console.log("allRecipeNames");
		let arr = [];
		for(let key in this.recipeIdentifierNameObject){
			if(this.recipeIdentifierNameObject.hasOwnProperty(key) ) 
				arr.push(this.recipeIdentifierNameObject[key]);
		}
		return arr;
	};

	// return array of all recipe objects.
	allRecipes(){
		let arr = [];
		for(let i=0;i<this.recipeIdentifierArray.length;i++){
			let identifier = this.recipeIdentifierArray[i];
			arr.push(this.readRecipe(identifier) );
		}
		return arr;
	};

	allBooks(){
		let arr = [];
		for(let i=0;i<this.recipeBooksList.length;i++)
			arr.push(this.recipeBooksList[i]);
		return arr;
	};

	allKeywords(){
		return this.recipeKeywordsObj;
	};

	//NOTE - SAME NUMBER OF ENTRIES IN EACH ARRAY - WE USE THIS LATER
	createKeywordsObject(){
		let mealsObj = ["breakfast", "lunch","dinner", "sideDish", "snack", "soup", "dessert","appetizer", "salad"];
let foodsObj = ["fish","fowl","meat","vegetable","drink", "fruit", "condiment", "carb", "other" ];
		return {meals: mealsObj, foods: foodsObj};
	};

}; // class RecipeStoreLocal
