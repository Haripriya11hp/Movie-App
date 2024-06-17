const apiKey = "61e576a4";
let movieName = document.getElementById("movieName");

const searchMovie = () => {
  let found = document.getElementById("searchFound");
  let notFound = document.getElementById("notFound");
  let thumbnail = document.getElementById("thumbnailContainer");
  let movieDetails = document.getElementById("movie-details-modal");
  const movieTitle = movieName.value;
  fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${movieTitle}`)
    .then((response) => response.json())
    .then((data) => {
      try {
        if (data.Response == "True") {
          console.log(data);
          found.classList.remove("d-none");
          notFound.classList.add("d-none");
          thumbnail.classList.remove("d-none");
          movieDetails.classList.remove("d-none");

          document.getElementById("searchTitle").innerText = data.Title;
          document.getElementById("searchPlot").innerText = data.Plot;
          document.getElementById("searchImdb").innerText = data.imdbRating;
          document.getElementById("searchNominations").innerText = data.Awards;
          document.getElementById("searchPoster").src = data.Poster;
          document.getElementById("searchRelease").innerText = data.Released;
          document
            .getElementById("search-close-modal")
            .addEventListener("click", () => {
              found.classList.add("d-none");
            });
        } else if (data.Response == "False") {
          console.log("movie not found");
          notFound.classList.remove("d-none");
          found.classList.add("d-none");
          thumbnail.classList.add("d-none");
          movieDetails.classList.remove("d-none");

          document.getElementById("notFoundTitle").innerText = movieName.value;
        }
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    });
};
const toggleIcon = () => {
  if (movieName.value.trim() !== "") {
    searchIcon.style.display = "none";
    closeIcon.style.display = "inline";
  } else {
    searchIcon.style.display = "inline";
    closeIcon.style.display = "none";
  }
};

const clearInput = () => {
  movieName.value = "";
  toggleIcon();
};
movieName.addEventListener("change", searchMovie);

const fetchMoviesByGenre = (query, containerId) => {
  fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`)
    .then((response) => response.json())
    .then((data) => {
      const posterContainer = document.getElementById(containerId);
      posterContainer.innerHTML = ""; // Clear any existing content
      const movies = data.Search.slice(0, 10); // Get the first 10 movies
      movies.forEach((movie) => {
        const img = document.createElement("img");
        img.src = movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"; // Use a placeholder if the poster is not available
        img.alt = movie.Title;
        img.className = "thumbnail";
        img.dataset.movieId = movie.imdbID; // Store the movie ID in a data attribute
        img.addEventListener("click", () => fetchMovieDetails(movie.imdbID)); // Add click event to fetch details
        posterContainer.appendChild(img);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
};

const fetchMovieDetails = (movieId) => {
  fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("details-title").textContent = data.Title;
      document.getElementById("details-plot").textContent = data.Plot;
      document.getElementById("details-imdb").textContent = data.imdbRating;
      document.getElementById("details-released").textContent = data.Released;
      document.getElementById("details-nominations").textContent = data.Awards;
      document.getElementById("details-poster").src =
        data.Poster !== "N/A" ? data.Poster : "placeholder.jpg";
      document.getElementById("movie-details-modal").style.display = "block"; // Show the modal
    })
    .catch((error) => console.error("Error fetching movie details:", error));
};

// Close modal when clicking on the 'x' button
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("movie-details-modal").style.display = "none";
});

// Fetch movies for each genre
fetchMoviesByGenre("action", "poster-container-action");
fetchMoviesByGenre("horror", "poster-container-horror");
fetchMoviesByGenre("winter", "poster-container-winter"); // Fetch winter specials
