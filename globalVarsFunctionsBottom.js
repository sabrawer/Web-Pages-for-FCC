

function getNewTextRecipe(database){
	let recipe = new Recipe();
	recipe.type = "text";
	recipe.name = "AAA New Text Recipe";
	recipe.identifier = database.createUniqueIdentifier();
	return recipe;
};

function getNewPhotoRecipe(database){

	let recipe = new Recipe();
	recipe.type = "photo";
	recipe.name = "AAA New Photo Recipe";
	recipe.identifier = database.createUniqueIdentifier();
	return recipe;
}

function getNewLinkRecipe(database){

	let recipe = new Recipe();
	recipe.type = "link";
	recipe.name = "AAA New Link Recipe";
	recipe.identifier = database.createUniqueIdentifier();
	return recipe;
}

function getNewBookRecipe(database){

	let recipe = new Recipe();
	recipe.type = "book";
	recipe.name = "AAA New Book Recipe";
	recipe.identifier = database.createUniqueIdentifier();
	return recipe;
}


