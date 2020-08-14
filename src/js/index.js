import Search from './models/Search';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import List from './models/List';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Recipe from './models/recipe';
import Likes from './models/Likes';

/** Glbal state of the app
 * - search object
 * current recipe object 
 * shopping list object
 * liked recipes
 */

const state = {}; 
//  window.state = state;

/*
* Search Controller
 */
const controlSearch = async () => {
    // 1. get query from view
     const query = searchView.getInput();  //create placeholder later
    // const query = 'chicken gravy';

    if(query){
    // 2. create new serch object and add to state
    state.search= new Search(query);
    
    try{
        // 3. prepare UI for results
            searchView.clearInput();
            searchView.clearList();
            renderLoader(elements.searchRes);
        
            // 4. search for recipe
        await state.search.getRes();
    
        //5. Render result on UI
            // console.log(state.search.result)
            clearLoader();
            searchView.renderResult(state.search.result)
        }
    catch(err){
        alert('Something went Wrong with search...');
        clearLoader();
        }
    }
     
}

elements.searchField.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// TESTING
// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();
// });


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goto=parseInt(btn.dataset.goto,10);
        searchView.clearList();
        searchView.renderResult(state.search.result, goto);
        // console.log(goto);
    }
})


var shoppingCount = 0;      // this var is to prevent from duplicate entry of shopping list.
/*
 Recipe controller
*/ 

const controlRecipe = async() => {
    // get id from url
    const id = window.location.hash.replace('#','');
    shoppingCount=0;
    //console.log(id);

    if(id){
        // prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //  Highlight Selected recipe
        if (state.search)
        searchView.highlightSelected(id);

        // create new recipe obeject
        state.recipe = new Recipe(id);
        // Testing
        //  window.r = state.recipe;
        // get recpie data
        try{
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
        
        // calculate servings and time (actually i need not to)
        const time = state.recipe.time;
        const serving = state.recipe.servings;

        // render recipe
       clearLoader();
       recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
       
        // console.log(state.recipe);
        //  console.log('time : '+time);
        //  console.log(serving);
        }
        catch(error) {
            alert(`In "index" ` + error);
        }
    }
};


// window.addEventListener('hashchange',controlRecipe);
// window.addEventListener('load',controlRecipe);

// combined line for above window events
['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));

/*
*   LIST CONTROLLER
 */
const controlList = () =>{
    // create a list if not yet.
    
    if(!state.list)
    state.list = new List();
    

    // Add each ingredient to List & UI
    
        state.recipe.ingredients.forEach(el => {
            const item = state.list.addItem(el.count, el.unit, el.ingredient);
            listView.renderItem(item);
        });
        
    
}

// Handle, Delete and Update shopping list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state and UI
        state.list.deleteItem(id);
        listView.deleteItem(id);
    }
    // Handle count update
    else if(e.target.matches('.shopping__count-value')) {
        if(state.list.items.count > 0)
        { const val = parseFloat(e.target.value, 10);
        
        state.list.updateCount(id,val); }
    }
});

/*
    LIKES Controller
*/
// state.likes = new Likes();
// likesView.toggleLikeMenu(state.likes.getNumLikes())

const controlLike= () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    
    // user has NOT liked the current recipe
    if(!state.likes.isLiked(currentID)){
        // Add Like to state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img,
            );
        // toggle the like button
            likesView.toggleLikeBtn(true);
        // add Like to UI list
        likesView.renderLike(newLike);
        //console.log(state.likes);
    } 
    // user  has Liked curent recipe
    else {
        // remove like from the state
        state.likes.deleteLike(currentID);
        // toggle like button
        likesView.toggleLikeBtn(false);

        // remove Like from UI list
       likesView.deleteLike(currentID);        //console.log(state.likes);

    }

    likesView.toggleLikeMenu(state.likes.getNumLikes())
};


// Restore likes recipe on page loads
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes on page refresh
    state.likes.readStorage();

    // toggle like btn
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // render existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


// Handling Recipe Butoons
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *' ))
    {    // deacrease if button is clicked
        if(state.recipe.servings > 1)
        {   state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
     else if(e.target.matches('.btn-increase, .btn-increase *' ))
    {       // Increase
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        
        if(shoppingCount<1) 
        {   controlList();
            shoppingCount++;  }
        else{
            alert(`Already Added to Shopping List`)
        }
        // console.log(shoppingCount);
    } else if(e.target.matches('.recipe__love, .recipe__love *')){
        //Like controller
        controlLike();
    }
    //  console.log(state.recipe);
})

//window.l = new List()