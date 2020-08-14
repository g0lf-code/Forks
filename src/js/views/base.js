export const elements = {
    searchInput : document.querySelector('.search__field'),
    searchField : document.querySelector('.search'),
    searchResList : document.querySelector('.results__list'),
    searchResPages : document.querySelector('.results__pages'),
    searchRes : document.querySelector('.results'),
    recipe : document.querySelector('.recipe'),
    shopping : document.querySelector('.shopping__list'),
    likesMenu : document.querySelector('.likes__field'),
    likesList : document.querySelector('.likes__list')
};

export const elStr = {
    loader : 'loader'
};

export const renderLoader = parent => {
    const loader = `
    <div class="loader">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>
    `;
    parent.insertAdjacentHTML('afterbegin',loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elStr.loader}`)
    if(loader) {
        loader.parentElement.removeChild(loader)
    }
};