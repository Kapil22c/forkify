import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';


import { elements, renderLoader, clearLoader } from './views/base';

// global state of the app
// - search object
// - current recipe object
// - shopping list object
// - liked recipes

const state = {};
// window.state = state;
//Search Controller

const controlSearch = async () => {
    //1. Get the queries from view
    const query = searchView.getInput();

    // console.log(query);


    if(query){
        // 2. New search object and add to state
        state.search = new Search(query);
        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        // 4. Search for recipes
        try{
          await state.search.getResults();
          // 5. render results on UI
          clearLoader();
          searchView.renderResults(state.search.result);
          // console.log(state.search.result);
        }catch(err){
          alert('Something wrong with the search...');
          clearLoader();
        }



    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// testing

// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();
// });

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  // console.log(btn);
  if(btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
    // console.log(goToPage);
  }
});

// const search = new Search('pizza');
// console.log(search);

// search.getResults();---- this goes on number 4 state.search.getResults();



// import axios from 'axios';

// async function getResults(query){
//     // const proxy = 'https://cors-anywhere.herokuapp.com/';

//     try{
//         const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${query}`);
//         //const res = await fetch(`https://forkify-api.herokuapp.com/api/search?&q=${query}`);
//         console.log(res);
//         for(let i=0; i<res.data.recipes.length; i++){
//         console.log(res.data.recipes[i].title);

//         }

//     } catch(error){
//         alert(error);
//     }
// }
// getResults('pizza');

//Recipe Controller

// const r = new Recipe(47746);
// r.getRecipe();
// console.log(r);

const controlRecipe = async () => {
  //get ID from url
  const id = window.location.hash.replace('#','');
  // console.log(id);
  if(id){
    //prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // highlight selected search item
    if(state.search){
      searchView.highlightSelected(id);
    }

    // create new recipe Object
    state.recipe = new Recipe(id);

    //testing
    // window.r = state.recipe;

    try{
      //Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      // render recipe
      // console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      );
      //

    } catch(err){
      alert('Error Processing recipe!!');
    }
  }
};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));


// List Controller

const controlList = () =>{
  // Create a list if there is none yet
  if(!state.list) state.list = new List();

  // Add each ingredients to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle delete button
  if(e.target.matches('.shopping__delete, .shopping__delete *')){
    // delete from state
    state.list.deleteItem(id);
    //delete from UI
    listView.deleteItem(id);
    // Handle the count update
  }else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value,10);
    state.list.updateCount(id, val);
  }
});

// Like Controller
//test
// state.likes = new Likes();
// likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
  if(!state.likes) {state.likes = new Likes();}
  const currentID = state.recipe.id;

  // user has Not yet liked current recipe
  if(!state.likes.isLiked(currentID)){
      // Add like to the state
      const newLike = state.likes.addLike(
        currentID,
        state.recipe.title,
        state.recipe.author,
        state.recipe.img
      );
      // Toggle the like button
      likesView.toggleLikeBtn(true);
      // Add like to UI list
      likesView.renderLike(newLike);
      // console.log(state.likes);
  // user has liked current recipe
  }else{
    // remove like from the state
    state.likes.deleteLike(currentID);
    // Toggle the like button
    likesView.toggleLikeBtn(false);

    // remove like to UI list
    likesView.deleteLike(currentID);
    // console.log(state.likes);

  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

window.addEventListener('load', () => {
  state.likes = new Likes();
  // restore likes
  state.likes.readStorage();
    // toggle like button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // render existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));

});


// Handling recipe button
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')){
    // Decrease button is clicked
    if(state.recipe.servings > 1){
      state.recipe.updateServings('dec');
      recipeView.updateServingIngredients(state.recipe);
    }
  }else if(e.target.matches('.btn-increase, .btn-increase *')){
    // increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingIngredients(state.recipe);
  }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
    // Add ingredients to shopping list
    controlList();
  }else if(e.target.matches('.recipe__love, .recipe__love *')){
    //like controller
    controlLike();
  }
  // console.log(state.recipe);
});

// window.l = new List();
