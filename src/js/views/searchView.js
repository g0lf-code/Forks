import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearList = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const arr = Array.from(document.querySelectorAll('.results__link'));
    arr.forEach(el=> {
        el.classList.remove('results__link--active');
    })
    
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
};

export const limitTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit)
    {
        title.split(' ').reduce ((acc,cur) => {
            if(acc+cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc+cur.length;
        }, 0);
        //returns the trimmed title
        return `${newTitle.join(' ')} ...`;
    } 

    return title;
};

const renderRecipe = data => {
    //  console.log(data);
    const markup = 
     `<li>
           <a class="results__link" href="#${data.id}">
               <figure class="results__fig">
                    <img src="https://spoonacular.com/recipeImages/${data.image}" alt="${data.image}">
               </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitTitle(data.title)}</h4>
                </div>
           </a>
     </li>`     //*include for Author in search Results* <p class="results__author">${data.sourceName}</p>
    ;
    elements.searchResList.insertAdjacentHTML('beforeend',markup);
};

//type : 'prev' or 'next'
const createButton = (page, type) => 
`
<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page+1}>
       <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type=== 'prev' ? 'left' : 'right'}"></use>
       </svg>
       <span>Page ${type === 'prev' ? page-1 : page+1}</span>
</button>
    
`
;

const renderBtn = (page, numRes, resPerPage) => {
        const pages = Math.ceil(numRes / resPerPage);
        let button;
        if(page === 1 && pages>1){
            // button togo next page
           button = createButton(page, 'next')
        }else if(page < pages){
            // both button
            button = 
            `${button = createButton(page, 'prev')}
             ${button = createButton(page, 'next')}`
        }
        else if(page===pages && pages > 1){
            // last page
          button = createButton(page, 'prev')
        }
        
        elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};

export const renderResult = (recipes, page=1, resPerPage=10) => {
    // render results of current page
    const start = (page-1) * resPerPage;
    const end = page*resPerPage;

    recipes.slice(start,end).forEach(renderRecipe)

    //render pagination buttons
    renderBtn(page, recipes.length, resPerPage);
}; 