import axios from 'axios';
//import { key, app_id } from '../config';
import { key } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try{
            //const res= await axios(`https://api.edamam.com/search?q=${this.uri}&app_id=${app_id}&app_key=${key}`);
            const res = await axios (`https://thingproxy.freeboard.io/fetch/https://api.spoonacular.com/recipes/${this.id}/information?&apiKey=${key}`);
            
            this.title = res.data.title;
            this.author = res.data.sourceName;
            this.img = res.data.image;
            this.sourceUrl = res.data.sourceUrl;
            this.ingredients = (res.data.extendedIngredients).map(el => (el.amount)+' '+el.unit+' '+el.name ); // el.original
            this.time = res.data.readyInMinutes;
            this.servings = res.data.servings;
            this.units = (res.data.extendedIngredients).map(el=> el.unit);
            this.amount = (res.data.extendedIngredients).map(el=> el.amount);
            // console.log(res.data);
             
        }
        catch(error){
            console.log(`Recipe`+error)
        }
    }

    
    parseIngredients(){
        const unitsOld=['tablespoons','tablespoon','cups','ounces','ounce','pounds','teaspoons','teaspoon'];
        const unitsNew=['tbsp','tbsp','cup','oz','oz','pound','tsp','tsp'];
        const unitsUn = [...unitsNew,'kg','g']
        const newIngredients= this.ingredients.map(el => {

            let ingredient=el.toLowerCase();
            unitsOld.forEach((unit,i) => {
                ingredient = ingredient.replace(unit,unitsNew[i]);
            });

            // remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g,' ');

            // 3. parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsUn.includes(el2) );

            
                let objIng;
            if (unitIndex> -1){
                //there is a unit
                let count;
                const arrCount = arrIng.slice(0, unitIndex);
                if(arrCount.length ===1){
                    count = eval(arrIng[0].replace('-','+'));
                }else{
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit : arrIng[unitIndex],
                    ingredient : arrIng.slice(unitIndex+1).join(' ')
                }

            }else if(parseInt(arrIng[0],10)){
                // No unit but 1st element is number
                objIng= {
                    count: parseInt(arrIng[0],10),
                    unit:'',
                    ingredient : arrIng.slice(1).join(' ')
                }
            }else if(unitIndex === -1){
                // there is no unit AND no number in 1st position
                objIng = {
                    count : 1,
                    unit : '',
                    ingredient
                }
            }
            // console.log(objIng);
            return objIng;
            
            
            
        });
        this.ingredients = newIngredients;
        //console.log(this,ingredients);
    }
  
    updateServings(type){
        //Servings
        const newServings = type==='dec' ? this.servings-1 : this.servings+1;
        
        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count = ing.count*(newServings / this.servings);

        });
        
        this.servings = newServings;
    }


}