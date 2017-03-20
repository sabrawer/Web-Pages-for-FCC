

/* ******************************************************

			class Recipe

***********************************************************  */

class Recipe{
	constructor(){
		this.type=""; // text, link, book, photos
		this.identifier="";
		this.name="";
		this.ingredients="";
		this.instructions="";
		this.comments="";
		this.book=""; // a RecipeBook object
		this.link="";
		this.photos = []; // list of refs to photos
		this.keywords = {meals:[], foods:[] }; // {meals: [.....], foods: [.....] }
		
	};

	getKeys(){
		return ["type","name","ingredients",
			"instructions","comments","book","link","photos",
			"keywords","identifier"];
	};

	addPhoto(link){
		this.photos.push(link);
	};

	setName(str){
		this.name = str;
	};

	addKeyword(database, str){
		let keywords = database.allKeywords();
		let arr = keywords.meals;
		for(let i=0;i<arr.length;i++){
			if(arr[i] == str)
				this.keywords.meals.push(str);
		}
		arr = keywords.foods;
		for(let i=0;i<arr.length;i++){
			if(arr[i] == str)
				this.keywords.foods.push(str);
		}
	};

		
	// Return this recipes keywords as a space-separated
	// string of keywords
	keywordsText(){
		let result = "";
		for (let key in this.keywords) {
        		if (this.keywords.hasOwnProperty(key)){
				let arr = this.keywords[key];
				for(let i=0;i<arr.length;i++){	
					result += arr[i] + "  ";
				}
			}
		}
		return result; 
	};

}; // class Recipe

