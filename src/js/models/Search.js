//const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
// const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);

import axios from 'axios';
import { res } from '../config';

export default class Search {
    constructor(query){
        this.query = query;
    }

    async getResults(){
        // const proxy = 'https://cors-anywhere.herokuapp.com/';

        try{
          const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);

            //const res = await fetch(`https://forkify-api.herokuapp.com/api/search?&q=${query}`);
            // console.log(res);
            this.result = res.data.recipes;
            // console.log(this.result);

            // for(let i=0; i<res.data.recipes.length; i++){
            // console.log(res.data.recipes[i].title);
            //     }

        } catch(error){
            alert(error);
        }
    }
}
