// Default Variables
const apiUrl = 'https://api.themoviedb.org/3/';
const apiKeyUrl = 'api_key=84ff3251498b1fa0b9f22832083b3196&page=';

let defaultFavorites = [];
let defaultName = 'User';
let requestUrl = 'trending/movie/week?';

// DOM Elements Variables
const $articlesList = document.getElementById('articles-list');
const $modalName = document.querySelector('.modal-name');
const $userName = document.querySelector('.username');
const $inputSearch = document.querySelector('.input-search');
const $inputName = document.querySelector('.input-name');
const $pagination = document.querySelector('.pagination');
const $favorites = document.querySelector('.favorites');

// Storage Variables
let favoritesStorage =  JSON.parse(localStorage.getItem('favorites'));
let nameStorage =  localStorage.getItem('name');

// Functions Declarations
const verifyStorage = (storage, storageItem, defaultValue) => {

    if(storage == null){
        localStorage.setItem(storageItem, defaultValue);
    }else{
        defaultValue = storage;
    }

    return defaultValue;

}

const addEnterEvent = (element, button) => {

    element.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.querySelector(button).click();
        }
    })
    
}

const loadData = (requestUrl, page) => {

    fetch(apiUrl + requestUrl + apiKeyUrl + page)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        displayArticles(data);

    })
}

const displayArticles = (data) => {

    data.results.forEach(element => {
        
        let isFavorite = defaultFavorites.includes(element.id.toString());

        assignTemplate(element.poster_path, element.vote_average, element.id, isFavorite);           
        
    });

    createPaginationElements(data.total_pages);

}

const assignTemplate = (poster, vote_average, id, isFavorite) => {
    let article = articleTemplate(poster, vote_average, id, isFavorite);
    $articlesList.innerHTML += article; 
}

const articleTemplate = (imagePath, score, idArticle, isFavorite) => {
    
    let iconHeart = '<i class="far fa-bookmark icon"></i>';

    if(isFavorite){
        iconHeart = '<i class="fas fa-bookmark icon"></i>';
    }
    
    if (imagePath != null) {
        return (
            `<div class="article grid-item">
                <div class="cover">
                    <img class="img" src="https://image.tmdb.org/t/p/original${imagePath}" alt="" />
                </div>
                <div class="info">
                    <p class="score">${score}<i class="icon fas fa-star"></i></p>
                    <div id="${idArticle}" class="like" onClick="addFavorite(this.id, this)">`+iconHeart+`</span></div>
                    <a id="${idArticle}" onClick="showTrailer(this.id)" class="trailer"><span class="text">Play Trailer</span></a>
                </div>
            </div>`
        )
        
    } else {
        return '';
    }
    
}

const searchMovie = () => {

    $articlesList.innerHTML = "";

    const querySearch = document.querySelector('input');

    if(querySearch.value != ''){
        requestUrl = 'search/movie?&query=' + querySearch.value + '&';
    }else{
        requestUrl = 'trending/movie/week?';
    }

    loadData(requestUrl, '1');
    
}

const showTrailer = (articleId) => {
    
    const $iframe = document.getElementById('iframe-trailer');

    fetch('https://api.themoviedb.org/3/movie/' + articleId + '/videos?api_key=84ff3251498b1fa0b9f22832083b3196')
    .then(response => {
        return response.json();
    })
    .then(videos => {
        $iframe.src = 'https://www.youtube.com/embed/' + videos.results[0].key + '?&autoplay=1';
    })

    const $modal = document.querySelector('.modal');
    $modal.classList.remove('hidden');
}

const closeTrailer = () => {
    const $modal = document.querySelector('.modal');
    $modal.classList.add('hidden');
    const $iframe = document.getElementById('iframe-trailer');
    $iframe.setAttribute('src', '');

}

const addFavorite = (articleId, element) => {

    let elementInList = favoritesStorage.includes(articleId);

    if(elementInList){

        element.childNodes[0].classList.remove('fas');
        element.childNodes[0].classList.add('far');

        for( let index = favoritesStorage.length; index >= 0; index--){ 
            if ( favoritesStorage[index] == articleId) favoritesStorage.splice(index, 1);
        }
        
        localStorage.setItem('favorites', JSON.stringify(favoritesStorage))

    }else{
        element.childNodes[0].classList.remove('far');
        element.childNodes[0].classList.add('fas');
    
        defaultFavorites.push(articleId);
        localStorage.setItem('favorites', JSON.stringify(defaultFavorites));
    }
    
}

const showFavorites = (element) => {

    // Hide search browser
    $search = document.querySelector('.search');
    $search.classList.add('hidden');

    // Hide pagination 
    $paginationContainer = document.querySelector('.pagination-container');
    $paginationContainer.classList.add('hidden');
    
    $articlesList.innerHTML = '';

    favoritesStorage.forEach(element => {

        fetch('https://api.themoviedb.org/3/movie/' + element + '?api_key=84ff3251498b1fa0b9f22832083b3196')
        .then(response => {
            return response.json();
        })
        .then(data => {
            assignTemplate(data.poster_path, data.vote_average, data.id, true);
        })
    });
}

const nextPage = (element) => {
    const page = element.textContent;

    $articlesList.innerHTML = "";

    loadData(requestUrl, page);
    
}

const addName = () =>{
    
    const newName = document.querySelector('.input-name').value;
    $userName.textContent = newName;
    localStorage.setItem('name', newName);

    $modalName.classList.add('hidden');

}

const createPaginationElements = (totalPages) =>{

    $pagination.innerHTML = "";

    maxPage = 20;

    if (totalPages < maxPage) {
       maxPage = totalPages; 
    } 

    for (let index = 1; index <= maxPage; index++) {
        $pagination.innerHTML += `<li onClick="nextPage(this)">`+index+`</li>`; 
    }


}
// End Functions Declarations


// MAIN 

// Assign current storage to variable
defaultFavorites = verifyStorage(favoritesStorage, 'favorites',  JSON.stringify(defaultFavorites));
defaultName = verifyStorage(nameStorage, 'name', defaultName);

// Verify if storage variable is default, if is true show the modal to request name
if(defaultName === 'User'){
    $modalName.classList.remove('hidden');
}

// Assign username value 
$userName.textContent = defaultName;


// Add event enter to Input Search
addEnterEvent($inputSearch, '.button');
addEnterEvent($inputName, '.button-name');

$inputSearch.addEventListener("input", function(event) {
    searchMovie();
})

$favorites.addEventListener("click", function(event) {
    showFavorites(this);
})

// First Fetch call
loadData('trending/movie/week?', '1');

// END MAIN









 




















