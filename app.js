
// MAIN 
const apiURL = 'https://api.themoviedb.org/3/';

const keyURL = 'api_key=84ff3251498b1fa0b9f22832083b3196&page=';

const $articlesList = document.getElementById('articles-list');


let storedList =  JSON.parse(localStorage.getItem('favorites'));
let storedName =  localStorage.getItem('name');

const modalName = document.querySelector('.modal-name');

let favoritesList = [];

let defaultUser = 'User';

favoritesList = verifyStorage(storedList, 'favorites',  JSON.stringify(favoritesList));

defaultUser = verifyStorage(storedName, 'name', defaultUser);

if(defaultUser === 'User'){
    modalName.classList.remove('hidden');
}

const $username = document.querySelector('.username');


$username.textContent = defaultUser;




const $inputSearch = document.querySelector('.input');

$inputSearch.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector('.button').click();
    }
})


displayArticles('trending/movie/week?', '1');

// FUNCTIONS 
function displayArticles(requestURL, page) {

    fetch(apiURL + requestURL + keyURL + page)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        data.results.forEach(element => {
            
            let isFavorite = favoritesList.includes(element.id.toString());

            let article = articleTemplate(element.poster_path, element.vote_average, element.id, isFavorite);

            $articlesList.innerHTML += article;            
            
        });
    })
}
 
function showTrailer(articleId) {
    
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

function closeTrailer() {
    const $modal = document.querySelector('.modal');
    $modal.classList.add('hidden');
    const $iframe = document.getElementById('iframe-trailer');
    $iframe.setAttribute('src', '');

}

function searchMovie() {

    $articlesList.innerHTML = "";

    const querySearch = document.querySelector('input');

    let requestURL = 'search/movie?&query=' + querySearch.value + '&';

    displayArticles(requestURL);
    
}

function articleTemplate(imagePath, score, idArticle, favorite) {
    
    let iconHeart = '<i class="far fa-heart icon"></i>';

    if(favorite){
        iconHeart = '<i class="fas fa-heart icon"></i>';
    }

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
}

function addFavorite(articleId, element) {

    element.childNodes[0].classList.remove('far');
    element.childNodes[0].classList.add('fas');
    
    favoritesList.push(articleId);
    localStorage.setItem('favorites', JSON.stringify(favoritesList));

}

function showFavorites() {
    $articlesList.innerHTML = '';

    storedList.forEach(element => {
        fetch('https://api.themoviedb.org/3/movie/' + element + '?api_key=' + key)
        .then(response => {
            return response.json();
        })
        .then(data => {
            
            let template = articleTemplate(data.poster_path, data.vote_average, data.id, true);
            $articlesList.innerHTML += template;
           
        })
    });
}

function nextPage(element) {
    const page = element.textContent;

    $articlesList.innerHTML = "";

    displayArticles('trending/movie/week?', page);
    
}

function addName(){
    
    const newName = document.querySelector('.input-name').value;
    $username.textContent = newName;
    localStorage.setItem('name', newName);

    modalName.classList.add('hidden');

}

function verifyStorage(storage, storageItem, defaultValue) {
    
    if(storage == null){
        localStorage.setItem(storageItem, defaultValue);
    }else{
        defaultValue = storage;
    }

    return defaultValue;
    
}






