document.addEventListener('DOMContentLoaded', () => {
    const filterBtn = document.getElementById('filter-btn');
    const searchBtn = document.getElementById('search-btn');
    const moviesContainer = document.getElementById('movies-container');

    // Function to fetch movies based on filters or search
    function fetchMovies(queryString) {
        console.log("Fetching movies with query:", queryString); // Debugging

        // Update the URL in the browser (optional, for SEO)
        const newUrl = `/search/results${queryString}`;
        window.history.pushState({ path: newUrl }, '', newUrl);

        // Send AJAX request
        fetch(newUrl)
            .then(response => response.json()) // Expecting JSON response
            .then(data => {
                updateMovies(data.movies); // Update the UI with new movie data
            })
            .catch(error => {
                console.error("Fetch error:", error);
            });
    }

    // Function to update the movie list in the UI
    function updateMovies(movies) {
        moviesContainer.innerHTML = ""; // Clear previous content

        if (!Array.isArray(movies) || !movies.length) {
            moviesContainer.innerHTML = `
                <div class="col-12 text-center">
                    <i class="fas fa-sad-tear fa-4x mb-4 text-primary"></i>
                    <h2>No movies found</h2>
                </div>`;
            return;
        }

        // Render movies dynamically
        movies.forEach(movie => {
            const movieHTML = `
            <div class="col-xl-3 col-lg-4 col-md-6">
                <div class="product-item">
                    <div class="position-relative bg-light overflow-hidden">
                        <img class="img-fluid w-100 fixed-size" src="${movie.image_url}" alt="${movie.title}">
                        <div class="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                    </div>
                    <div class="text-center p-4">
                        <a class="h5 mb-2" href="/movies/${movie.id}">${movie.title}</a>
                        <p>${movie.description}</p>
                    </div>
                    <div class="d-flex border-top">
                        <small class="w-50 text-center border-end py-2">
                            <a class="text-body" href="/movies/${movie.id}">
                                <i class="fa fa-eye text-primary me-2"></i>View detail
                            </a>
                        </small>
                        <small class="w-50 text-center py-2">
                            <a class="text-body" href="/cart/add/${movie.id}">
                                <i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart
                            </a>
                        </small>
                    </div>
                </div>
            </div>`;
            moviesContainer.innerHTML += movieHTML;
        });
    }

    // Filter button click handler
    filterBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent page reload
        const genre = document.getElementById('genre').value;
        const language = document.getElementById('language').value;
        const age = document.getElementById('age').value;
        const rate = document.getElementById('rate').value;
        const priceMax = document.getElementById('price-max').value;

        const queryString = `?genre=${genre}&language=${language}&age=${age}&rate=${rate}&price=${priceMax}`;
        fetchMovies(queryString); // Make AJAX request
    });

    // Search button click handler
    searchBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent page reload
        const searchQuery = document.getElementById('search-box').value;
        const queryString = `?search=${encodeURIComponent(searchQuery)}`;
        fetchMovies(queryString); // Make AJAX request
    });
});
