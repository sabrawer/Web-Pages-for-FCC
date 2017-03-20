
function addKeywords(database,rec, arr){
	for(let i=0;i<arr.length;i++)
		rec.addKeyword( database, arr[i])
}

function addBooks(database){
	database.addBook("Monica Dutt, The Art of Indian Cooking");
	database.addBook("Ina Garten, Barefoot Contessa at Home");
	database.addBook("Maida Heatter, New Book of Great Desserts");
	database.addBook("Fish: Recipes from the Sea (Phaidon)");
	database.addBook("My Recipe Notebook");
}



function resetToOriginal(database){
	if(! database) return;
	database.removeAllRecipeItems();
	addBooks(database);
	createRecipes(database);
}
		

function createRecipes(database){

// PHOTOS
	let rec;
	rec = getNewPhotoRecipe(database);
	//rec.identifier = database.createUniqueIdentifier();
	rec.name = "Braised Chicken with Artichokes and Cheese";
	rec.photos = ["Braised Chicken with Artichokes and Cheese.jpg"];
	addKeywords(database,rec, ["dinner", "fowl","carb" ] );
	database.saveRecipe(rec);
	//console.log(rec);

	rec = rec = getNewPhotoRecipe(database);
	//rec.identifier = database.createUniqueIdentifier();
	rec.name = "Lemony Pasta with Chickpeas and Parsley";
	rec.photos = ["Lemony Pasta with Chickpeas and Parsley.jpg"];
	rec.comments = "Did not photograph very well";
	addKeywords(database,rec, ["lunch","dinner","carb"]);
	database.saveRecipe(rec);
	//console.log(rec);

	rec = rec = getNewPhotoRecipe(database);
	//rec.identifier = database.createUniqueIdentifier();
	rec.name = "Stir-Fried Lamb with Scallions - Asian";
	rec.photos = ["Stir-Fried Lamb with Scallions-1.jpg", 
			"Stir-Fried Lamb with Scallions-2.jpg"];
	rec.comments = "Note I have added <Asian> to title for search.";
	addKeywords(database,rec, ["dinner", "meat","vegetable"]);
	database.saveRecipe(rec);
	//console.log(rec);

	rec = rec = getNewPhotoRecipe(database);
	//rec.identifier = database.createUniqueIdentifier();
	rec.name = "Grapefruit and Beet Salad";
	rec.photos = ["grapefruitAndBeetSalad-1.tiff","grapefruitAndBeetSalad-2.tiff"];
	addKeywords(database,rec, ["fruit","vegetable","salad"]);
	database.saveRecipe(rec);
	//console.log(rec);

// BOOK

	rec = getNewBookRecipe(database);
	//rec.identifier = database.createUniqueIdentifier();
	rec.name = "Ground Meat Curry with Green Peas - Indian";
	rec.book = "Monica Dutt, The Art of Indian Cooking";
	rec.comments = "page 69. Excellent. Note I have added <Indian> to title for search.";
	addKeywords(database,rec, ["meat","dinner", "vegetable"]);
	database.saveRecipe(rec);
	//console.log(rec);

	rec = getNewBookRecipe(database);
	//rec.identifier = database.createUniqueIdentifier();
	rec.name = "Sole Filet";
	rec.book = "Fish: Recipes from the Sea (Phaidon)";
	rec.comments = "page 100.";
	addKeywords(database,rec, ["lunch","dinner","fish"]);
	database.saveRecipe(rec);
	//console.log(rec);

	rec = getNewBookRecipe(database);
	//rec.identifier = database.createUniqueIdentifier();
	rec.name = "Joan's Pumpkin Loaf ";
	rec.book = "Maida Heatter, New Book of Great Desserts";
	rec.comments = "page 258. Yum!!";
	addKeywords(database,rec, ["dessert", "carb", "vegetable"]);
	database.saveRecipe(rec);
	//console.log(rec);

	
	rec = getNewBookRecipe(database);
	//rec.identifier = database.createUniqueIdentifier();
	rec.name = "Tomato Feta Salad - with cheese";
	rec.book = "Ina Garten, Barefoot Contessa at Home";
	rec.comments = "page 81. Note how I have added <with cheese> to title for search";
	addKeywords(database,rec, ["salad", "vegetable"]);
	database.saveRecipe(rec);
	//console.log(rec);

	rec = getNewBookRecipe(database);
	//rec.identifier = database.createUniqueIdentifier();
	rec.name = "Mustard-Roasted Pork Tenderloin";
	rec.book = "My Recipe Notebook";
	rec.comments = "In meat/poultry section of notebook.\nGood and very easy.";
	addKeywords(database,rec, ["dinner", "meat"]);
	database.saveRecipe(rec);
	//console.log(rec);

// LINK

	rec = getNewLinkRecipe(database);
	//rec.identifier = database.createUniqueIdentifier();
	rec.name = "Buffalo Chicken Drumsticks With Blue Cheese Dip";
	rec.link = "http://www.bhg.com/recipe/chicken/buffalo-chicken-drumsticks-with-blue-cheese-dip/";
	addKeywords(database,rec, ["appetizer", "snack", "lunch","dinner","fowl" ]);
	database.saveRecipe(rec);
	//console.log(rec);

	rec = getNewLinkRecipe(database);
	//rec.identifier = database.createUniqueIdentifier();
	rec.name = "Bourbon-glazed Salmon";
	rec.link = "http://www.health.com/health/gallery/0,,20345280,00.html#bourbon-glazed-salmon-2";
	addKeywords(database,rec, ["fish", "dinner", "lunch"]);
	database.saveRecipe(rec);
	//console.log(rec);

	rec = getNewLinkRecipe(database);
	//rec.identifier = database.createUniqueIdentifier();
	rec.name = "Baja Fish Tacos - Mexican"
	rec.link = "http://www.health.com/health/gallery/0,,20345280,00.html#baja-fish-tacos";
	rec.comments = "Note I have added <Mexican> to title for search";
	addKeywords(database,rec, ["fish", "lunch","dinner"]);
	database.saveRecipe(rec);
	//console.log(rec);

	rec = getNewLinkRecipe(database);
	//rec.identifier = database.createUniqueIdentifier();
	rec.name = "Mexican Spice-Rubbed Rib Eyes with Lime Butter";
	rec.link = "http://www.foodandwine.com/slideshows/top-10-fast-meat-recipes";
	addKeywords(database,rec, ["dinner","meat"]);
	database.saveRecipe(rec);
	//console.log(rec);

// TEXT

	rec = getNewTextRecipe(database);
	//rec.identifier = database.createUniqueIdentifier();
	rec.name = "Duck Breast À L’Orange";
	rec.ingredients = "4 SERVINGS\n4 small duck breasts (6–8 ounces each)\n2 tablespoons finely grated orange zest\n3/4 cup fresh orange juice\n 1/4 cup honey\n1/4 cup soy sauce\n1/2 teaspoon freshly ground black pepper\nOrange slices (for serving)";

	rec.instructions = "Score fat of each duck breast in a crosshatch pattern, spacing about 1/2 inch apart. Combine orange zest, orange juice, honey, soy sauce, and pepper in a large resealable plastic bag. Add duck, seal bag, and turn to coat. Chill at least 6 hours and up to 12 hours.\n" +
"Remove duck breasts from marinade; set marinade aside. Place duck, skin side down, in a cold large skillet, then set over low heat and cook, shifting breasts in skillet occasionally for even cooking, until fat is rendered and skin is deep golden brown, 12–15 minutes. Turn duck, cover skillet, and cook until an instant-read thermometer inserted into the thickest part registers 120 degs for medium-rare, about 3 minutes. Transfer to a cutting board and tent loosely with foil. Let rest 10 minutes before slicing.\n" + 
"Meanwhile, pour off fat from skillet, then add reserved marinade and bring to a simmer; cook until sauce is thick and syrupy, about 5 minutes.\n" + 
"Transfer duck to plates and spoon sauce over. Serve with orange slices."

	rec.comments = "Pekin ducks, also known as crescent or Long Island ducklings, have small breasts. If using magret, which are larger, cook a minute or two longer per side. This recipe is from N7, one of the Hot 10, America's Best New Restaurants 2016.";

	addKeywords(database,rec, ["fowl","dinner","fruit"]);

	database.saveRecipe(rec);
	//console.log(rec);	
}

	
	




