// API Key: a0dd635d
// http://www.omdbapi.com/?i=tt3896198&apikey=a0dd635d

const key = 'a0dd635d';

var searchInput = document.getElementById("input");
var displaySearchList = document.getElementsByClassName('fav-container');

fetch('http://www.omdbapi.com/?i=tt3896198&apikey=a0dd635d')
.then(Response => Response.json())
.then(data => console.log(data));

// On clicking any key or keypress event, findMovies function will run
searchInput.addEventListener('input', findMovies);

//Function display the details of a single movie when clicked
async function singleMovie(){
    var urlQueryParams = new URLSearchParams(window.location.search)
    var id = urlQueryParams.get('id');
    console.log(id);
    const url = `https://www.omdbapi.com/?i=${id}&apikey=${key}`
    const res = await fetch(`${url}`);
    const data = await res.json()
    var output = `
    <div class="movie-poster">
        <img src=${data.Poster} alt="Movie Poster">
    </div>
    <div class="movie-details">
        <div class="details-header">
            <div class="dh-ls">
                <h2>${data.Title}</h2>
            </div>
            <div class="dh-rs">
                <i class="fa-solid fa-bookmark" onClick=addToFavorites('${id}') style="cursor: pointer;"></i>
            </div>
        </div>
        <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span
                    style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
        <ul class="details-ul">
            <li><strong>Actors: </strong>${data.Actors}</li>
            <li><strong>Director: </strong>${data.Director}</li>
            <li><strong>Writers: </strong>${data.Writer}</li>
        </ul>
        <ul class="details-ul">
            <li><strong>Genre: </strong>${data.Genre}</li>
            <li><strong>Release Date: </strong>${data.DVD}</li>
            <li><strong>Box Office: </strong>${data.BoxOffice}</li>
            <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
        </ul>
        <p style="font-size: 14px; margin-top:10px;">${data.Plot}</p>
        <p style="font-size: 15px; font-style: italic; color: #222; margin-top: 10px;">
            <i class="fa-solid fa-award"></i>
            &thinsp; ${data.Awards}
        </p>
    </div> 
    `
    document.querySelector('.movie-container').innerHTML = output;
}




// Function to display favourites movie
async function favoritesMovieLoader() {
    var output = '';

    // Traversing over all the movies in the localStorage
    for (let i in localStorage) {
        try {
            var movieData = JSON.parse(localStorage.getItem(i)); // Parsing the stored JSON string

            if (movieData && movieData.imdbID) {
                var id = movieData.imdbID;

                // Adding all the movie html in the output using interpolation
                output += `
                    <div class="fav-item">
                        <div class="fav-poster">
                            <a href="movie.html?id=${id}"><img src=${movieData.Poster} alt="Favourites Poster"></a>
                        </div>
                        <div class="fav-details">
                            <div class="fav-details-box">
                                <div>
                                    <p class="fav-movie-name">${movieData.Title}</p>
                                    <p class="fav-movie-rating">${movieData.Year} &middot; <span
                                        style="font-size: 15px; font-weight: 600;">${movieData.imdbRating}</span>/10
                                    </p>
                                </div>
                                <div style="color: maroon">
                                    <i class="fa-solid fa-trash" style="cursor:pointer;" onClick="removeFromfavorites('${id}')"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            console.log('localStorage.getItem(i):', localStorage.getItem(i));
        }
    }

    // Appending the html to the movie-display class in favorites page
    document.querySelector('.movie-container').innerHTML = output;
}



// Function to add a movie to favourites list

async function addToFavorites(id) {
    console.log("fav-item", id);

    const url = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${key}`;
    const response = await fetch(url);
    const movieData = await response.json();

    localStorage.setItem(id, JSON.stringify(movieData));
    alert('Movie Added to Watchlist!');
}


// Function to remove a movie from favorites
async function removeFromfavorites(id) {
    // Remove the item from localStorage
    localStorage.removeItem(id);

    // Re-load the favorites list
    favoritesMovieLoader();
    
    // Alert the user
    alert('Movie Removed from Watchlist');
}


// Function to display the list of searched movies on the UI
function displaySearchMovieList(movies) {
    var output = '';

    for (let i of movies) {
        var img = '';
        if (i.Poster !== 'N/A') {
            img = i.Poster;
        } else {
            img = 'img/blank-poster.webp';
        }

        var id = i.imdbID;

        output += `
        <div class="fav-item">
        <div class="fav-poster">
        <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
        </div>
        <div class="fav-details">
            <div class="fav-details-box">
                <div>
                    <p class="fav-movie-name"><a href="movie.html?id=${id}">${i.Title}</a></p>
                    <p class="fav-movie-rating"><a href="movie.html?id=${id}">${i.Year}</a></p>
                </div>
                <div>
                    <i class="fa-solid fa-bookmark" style="cursor:pointer;" onClick=addTofavorites('${id}')></i>
                </div>
            </div>
        </div>
    </div>
        `;
    }

    // Set the HTML content after the loop has completed
    document.querySelector('.fav-container').innerHTML = output;

    console.log("Here is the movies list: ", movies);
}



// Function to find movies as per the user's search input
async function findMovies() {
    const url = `http://www.omdbapi.com/?s=${searchInput.value.trim()}&apikey=${key}`;

    try {
        // Making an asynchronous request to the OMDb API using fetch
        const res = await fetch(url);

        // Parsing the JSON response from the API
        const data = await res.json();

        // Checking if the response data contains the searched element by the user
        if (data.Search) {
            // The array containing the searched list of movies will be passed to the display function to make it visible
            displaySearchMovieList(data.Search);
        } else {
            // Handle the case when no search results are found
            console.log("No results found");
        }
    } catch (error) {
        // Handle errors, such as network issues or parsing errors
        console.error("Error fetching data:", error);
    }
}


