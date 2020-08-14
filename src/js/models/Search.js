import axios from 'axios';
import {key} from '../config';

export default class Search{
    constructor (query) {
        this.query = query;
    }
    async getRes()
    {
        //const key= 'a4639708bf09d0d95853cfcc544866b8';
        const key = '4629150ab723480e9574b024811c096f'
        //const app_id= '3f675689';    edamam
        try{
        //const res= await axios(`https://api.edamam.com/search?q=${this.query}&app_id=${app_id}&app_key=${key}&from=0&to=30`);
        const res= await axios(`https://thingproxy.freeboard.io/fetch/https://api.spoonacular.com/recipes/search?query=${this.query}&apiKey=${key}&number=30`);
        this.result=res.data.results;
        // console.log(this.result);
        // console.log(res.data);

        }
        catch(error){
            alert(error);
        }
    }
}

