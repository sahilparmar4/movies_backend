import { Request, Response } from "express";
import Movie from "../model/Movie";
import { paginate } from "../utils/pagination";

export const listAllMovies = async (req: Request, res: Response) => {
    try {
        const pageParam = req.query.page as string | undefined;
        const page = pageParam ? parseInt(pageParam, 10) || 1 : 1;
        const perPage = 8;

        const { docs: movies, total, totalPages, perPage: returnedPerPage } = await paginate(Movie, page, perPage);

        return res.json({
            status: 200,
            message: "Movies fetched successfully",
            data: { movies: movies, pagination: { total, page, perPage: returnedPerPage, totalPages } },
        });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching movies", error: err });
    }
}

export const getMovieDetails = async (req: Request, res: Response) => {
    try {
        const movieId = req.params.id;
        if (!movieId) {
            return res.status(400).json({ message: "Movie ID is required" });
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        return res.json({ status: 200, message: "Movie Details fetched successfully", data: movie });
    } catch (err) {
        res.status(500).json({ message: "Error fetching movie", error: err });
    }
}


export const addMovie = async (req: Request, res: Response) => {
    try {
        const { title, publishingYear } = req.body;
        const posterFromFile = req.file ? `/uploads/${req.file.filename}` : undefined;
        const poster = posterFromFile || req.body.poster;

        if (!title || !publishingYear || !poster) {
            return res.status(400).json({ message: "Title, Publishing Year and Poster are required" });
        }

        const newMovie = new Movie({
            title,
            releaseYear: publishingYear,
            poster,
        });

        await newMovie.save();
        return res.status(201).json({
            status: 201,
            message: "Movie added successfully",
            data: newMovie,
        });
    } catch (err) {
        return res.status(500).json({ message: "Error adding movie", error: err });
    }
};


export const updateMovie = async (req: Request, res: Response) => {
    try {
        const movieId = req.params.id;
        if (!movieId) {
            return res.status(400).json({ message: "Movie ID is required" });
        }

        const { title, publishingYear } = req.body;
        const posterFromFile = req.file ? `/uploads/${req.file.filename}` : undefined;
        const poster = posterFromFile || req.body.poster;

        if (!title || !publishingYear || !poster) {
            return res.status(400).json({ message: "Title, Publishing Year and Poster are required" });
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            movieId,
            { title, releaseYear: publishingYear, poster },
            { new: true }
        );

        if (!updatedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        return res.json({ status: 200, message: "Movie updated successfully", data: updatedMovie });
    } catch (err) {
        return res.status(500).json({ message: "Error updating movie", error: err });
    }
};
