const express = require("express");
const app = express();

require("./db-connect");
const Movie = require("./models/movie.model");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.get("/contact", (req, res) => {
  res.send("This is contact page");
});

async function createMovie(movieData) {
  try {
    const movie = new Movie(movieData);
    const savedMovie = await movie.save();
    console.log("Created movie:", savedMovie);
    return savedMovie;
  } catch (error) {
    throw error;
  }
}

async function readAllMovies() {
  try {
    const allMovies = await Movie.find();
    return allMovies;
  } catch (error) {
    throw error;
  }
}

async function readMoviesByActor(actorName) {
  try {
    const moviesByActor = await Movie.find({ actors: actorName });
    return moviesByActor;
  } catch (error) {
    throw error;
  }
}

async function readMoviesByDirector (directorName) {
  try {
    const moviesByDirector = await Movie.find({ director: directorName });
    return moviesByDirector;
  } catch (error) {
    throw error;
  }
}

async function readMoviesByGenre (genreName) {
  try {
    const moviesByGenre = await Movie.find({ genre: genreName });
    return moviesByGenre;
  } catch (error) {
    throw error;
  }
}

async function updateMovie(movieId, updatedData) {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, updatedData, { new: true });
    return updatedMovie;
  } catch (error) {
    throw error;
  }
}

async function deleteMovie(movieId){
  try {
    const movieToDelete = await Movie.findByIdAndDelete(movieId);
    return movieToDelete;
  }
  catch (error){
    throw error;
  }
}

async function readMoviesByRating(){
  try{
    const movies = await Movie.find().sort({ rating: -1 });
    return movies;
  }catch(error){
    throw error;
  }
}

app.post("/movies", async (req, res) => {
  try {
    const savedMovie = await createMovie(req.body);
    res.status(201).json({ message: "Movie added", movie: savedMovie });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: "Failed to add movie" });
  }
});

app.get("/movies", async (req, res) => {
  try {
    const allMovies = await readAllMovies();
    console.log("All movies:", allMovies);
    res.json(allMovies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

app.get("/movies/actor/:actorName", async (req, res) => {
  try {
    const movies = await readMoviesByActor(req.params.actorName);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

app.get("/movies/director/:directorName", async(req, res) => {
  try {
    const director = await readMoviesByDirector(req.params.directorName);
    res.json(director);
  }
  catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
})

app.get("/movies/genre/:genreName", async (req, res) => {
  try {
    const genre = await readMoviesByGenre(req.params.genreName);
    res.json(genre);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
})

app.post('/movies/:movieId', async (req, res) => {
  try {
    const updatedMovie = await updateMovie(req.params.movieId, req.body)
    if (updatedMovie) {
      res.json(updatedMovie)
    } else {
      res.status(404).json({ error: 'Movie not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update movie' })
  }
})

app.delete('/movies/:movieId', async (req, res) => {
  try {
    const updatedMovie = await deleteMovie(req.params.movieId, req.body)
    if (updatedMovie) {
      res.json(updatedMovie)
    } else {
      res.status(404).json({ error: 'Movie not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update movie' })
  }
})

app.get('/movies/ratings', async (req, res) => {
  try {
    const movies = await readMoviesByRating()
    res.json(movies)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' })
  }
})

async function readMoviesByReleaseYear() {
  try {
    const moviesByReleaseYear = await Movie.find().sort({ releaseYear: -1 });
    return moviesByReleaseYear;
  } catch (error) {
    throw error;
  }
}

app.get('/movies/release-years', async (req, res) => {
  try {
    const movies = await readMoviesByReleaseYear();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
