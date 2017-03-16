/* For more complex programs one would put these constants into an object
in order to define a namespace. However, this application
is simple enough that that is not needed.
*/

const buttonStyleClass = "buttonStyle"
const buttonBarStyleClass = "buttonBarClass";

const recipeTextGeneralClass = "recipeTextGeneralClass  ";

const recipeTitleElementClass = "recipeTitleElementClass";
const recipeScreenContainerClass = "recipeScreenContainerClass";
const recipeLineClass = "recipeLineClass";
const recipeNameClass = recipeTextGeneralClass + " recipeNameClass";
const recipeIngredientsClass = recipeTextGeneralClass + " recipeIngredientsClass";
const recipeInstructionsClass = recipeTextGeneralClass + " recipeInsttructionsClass";
const recipeCommentsClass = recipeTextGeneralClass + " recipeCommentsClass";
const recipeKeywordsClass = recipeTextGeneralClass + " recipeKeywordsClass";
const recipeLinkClass = recipeTextGeneralClass + " recipeLinkClass";
const recipeBookClass = recipeTextGeneralClass + " recipeBookClass";
const recipePhotoClass = "recipePhotoClass"; 

const recipeNumberOfNameRows =1;
const recipeNumberOfIngredientsRows =10;
const recipeNumberOfInstructionsRows =10;
const recipeNumberOfCommentsRows =5;
const recipeNumberOfKeywordsRows =3;
const recipeNumberOfLinkRows = 2;
const recipeNumberOfBookRows = 2;


const recipeSimpleMenuClass = "recipeSimpleMenuClass";
const recipeSimpleMenuUIFontArray = ["%",10,12];

const recipeLineUIFontArray = ["%",10,18];
const recipeLinePositionObject = {width: "auto", height: "auto", top:null,
					left: null, position: null};

const recipeNameUIFontArray = ["%",7,14];
// text font comes out a few pixels too large
const recipeTextareaUIFontArray = ["%",8,11];

// container if message and buttons only
const popupGeneralContainer = "popupGeneralContainer";

// default class for popup message
popupGeneralMessageClass = "popupGeneralMessageClass";
popupButtonContainerClass = "popupButtonContainerClass";

popupDefaultFontSize = "12px";

//container with textarea

/* popup menu configurations, including positions, are
entirely configured in CSS. These menus do not resize
when the window is resized. 

The configurations can be overridden by javascript.
*/
		

