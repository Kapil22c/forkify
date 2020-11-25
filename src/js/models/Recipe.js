import axios from 'axios';
import { res } from '../config';
export default class Recipe{
  constructor(id){
    this.id = id;
  }

  async getRecipe() {
    try{
        const res1 = await axios(`https://forkify-api.herokuapp.com/api/get?key=${res}&rId=${this.id}`);
        this.title = res1.data.recipe.title;
        this.author = res1.data.recipe.publisher;
        this.img = res1.data.recipe.image_url;
        this.url = res1.data.recipe.source_url;
        this.ingredients = res1.data.recipe.ingredients;
        // console.log(res1);
    }catch(error){
      console.log(error);
      alert('Something went wrong :(');
    }
  }

  calcTime(){
      const numIng = this.ingredients.length;
      const period = Math.ceil(numIng/3);
      this.time = period * 15;
  }
  calcServings(){
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
    const unitShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
    const units = [...unitShort, 'kg','g'];

    const newIngredients = this.ingredients.map(el =>{
      // 1. uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) =>{
        ingredient = ingredient.replace(unit, unitShort[i]);
      });

      // 2 remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      //3. parse ingredients into count, unit and ingredients
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

      let objIng;
      if(unitIndex > -1){
        // There is a unit
        const arrCount = arrIng.slice(0,unitIndex);
        let count;
        if(arrCount.length ===1){
          count = eval(arrIng[0].replace('-','+'));
        }else{
          count = eval(arrIng.slice(0,unitIndex).join('+'));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex+1).join(' ')
        };

      }else if(parseInt(arrIng[0], 10)){
        //there is no unit but 1st ele is number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit:'',
          ingredient: arrIng.slice(1).join(' ')
        }
      }
      else if(unitIndex === -1){
        // there is no unit and no number at 1st position
        objIng = {
          count:1,
          unit:'',
          ingredient
        }
      }


      return objIng;
    });
    this.ingredients = newIngredients;
  }

  
  updateServings (type) {
    //servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    // ingredients
    this.ingredients.forEach(ing => {
      ing.count *=  (newServings/this.servings);
    });

    this.servings = newServings;

  }
}
