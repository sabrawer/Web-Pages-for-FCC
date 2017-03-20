/* For more complex programs one would put these constants into an object
in order to define a namespace. However, this application
is simple enough that that is not needed.
*/

const buttonStyleClass = "buttonStyle"
const buttonBarStyleClass = "buttonBar";
const containedButtonContainerClass = "cbContainer";
const dropDownContainerClass = "dropDownContainer";
const dropDownCellClass = "dropDownCell";
const dropDownCellId = "drop";
const secondaryDropDownCellId = "drop1";

const recipeLineClass = "recipeLine";

// classes for text fields in individual recipes
const recipeTextGeneralClass = "recipeTextGeneral  ";
const recipeTitleElementClass = "recipeTitleElement";
const recipeScreenContainerClass = "recipeScreenContainer";

const recipeNameClass = "recipeName";
const recipeIngredientsClass = "recipeIngredients";
const recipeInstructionsClass = "recipeInstructions";
const recipeCommentsClass = "recipeComments";
const recipeKeywordsClass = "recipeKeywords";
const recipeLinkClass = "recipeLink";
const recipeBookClass = "recipeBook";
const recipePhotoClass = "recipePhoto"; 

// number of rows in text fields
const recipeNumberOfNameRows =1;
const recipeNumberOfIngredientsRows =10;
const recipeNumberOfInstructionsRows =10;
const recipeNumberOfCommentsRows =5;
const recipeNumberOfKeywordsRows =3;
const recipeNumberOfLinkRows = 2;
const recipeNumberOfBookRows = 2;


const recipeSimpleMenuClass = "recipeSimpleMenu";
const recipeSimpleMenuUIFontArray = ["%",10,12];

const recipeLineUIFontArray = ["%",10,18];
const recipeLinePositionObject = {width: "auto", height: "auto", top:null,
					left: null, position: null};
const recipeNameUIFontArray = ["%",7,14];
// text font comes out a few pixels too large
const recipeTextareaUIFontArray = ["%",8,11];

// classes for popups
const popupGeneralContainerClass = "popupGeneralContainer";
const popupGeneralMessageClass = "popupGeneralMessage";
const popupSelectKeywordsMessageClass = "popupSelectKeywordsMessage";
const popupButtonOneOfOneLeftClass = "buttonOneOfOneLeft";
const popupButtonOneOfTwoLeftClass = "buttonOneOfTwoLeft";
const popupButtonOneOfThreeLeftClass = "buttonOneOfThreeLeft";
const popupSingleButtonContainerClass = "popupSingleButtonContainer";

const popupBookTextareaClass = "popupBookTextarea";
const popupPhotoTextareaClass = "popupPhotoTextarea";
const popupKeywordsListClass = "popupKeywordsList";
const popupKeywordsListSelectedClass = "popupKeywordsListSelected";
const popupKeywordsTitleClass = "popupKeywordsTitle";
const popupBooksListClass = "popupBooksList";
const popupBooksListSelectedClass = "popupBooksListSelected";
const popupBooksListNoSelectClass = "popupBooksListNoSelect";

popupDefaultFontSize = "12px";

//container with textarea

/* popup menu configurations, including positions, are
entirely configured in CSS. These menus do not resize
when the window is resized. 

The configurations can be overridden by javascript.
*/
		

