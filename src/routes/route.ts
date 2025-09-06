import express, { Router } from 'express';
const router: Router = express.Router();

import * as movies from "../controller/movies"
import * as auth from "../controller/auth"
import authMiddleware from "../middleware/authMiddleware"


router.post('/auth/login', auth.login)


router.get('/movies', authMiddleware.authenticate, movies.listAllMovies)
router.get('/movies/details/:id', authMiddleware.authenticate, movies.getMovieDetails)
router.post('/movies/add', authMiddleware.authenticate, authMiddleware.authorizeAdmin, movies.addMovie)
router.put('/movies/:id/update', authMiddleware.authenticate, authMiddleware.authorizeAdmin, movies.updateMovie)

export { router }