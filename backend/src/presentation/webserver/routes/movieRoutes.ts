// import { Router } from 'express';
// import { MovieController } from '../../controllers/movieController';
// import { ManageMovies } from '../../../application/usecases/movies';
// import { MongoMovieRepository } from '../../../infrastructure/repositories/movieRepository';
// import { MongoClient } from 'mongodb';

// const router = Router();
// const mongoClient = new MongoClient('your-mongo-connection-string');
// const movieRepo = new MongoMovieRepository();
// const manageMovies = new ManageMovies(movieRepo);
// const movieController = new MovieController(manageMovies);

// router.post('/movies', movieController.createMovie.bind(movieController));
// router.patch('/movies/:movieId/approve', movieController.approveMovie.bind(movieController));
// router.patch('/movies/:movieId/block', movieController.blockMovie.bind(movieController));
// router.get('/movies', movieController.getMovies.bind(movieController));

// export default router;
