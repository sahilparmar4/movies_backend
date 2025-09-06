import { Request, Response } from "express";
import Movie from "../model/Movie";

export const listAllMovies = async (req: Request, res: Response) => {
    try {
        const movies = await Movie.find();
        return res.json({ status: 200, message: "Movies fetched successfully", data: movies });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching movies", error: err });
    }
}

export const getMovieDetails = async (req: Request, res: Response) => {
    try {
        if(!req.params.id){
            return res.status(400).json({message: "Event ID is required"});
        }
        const event = await Movie.findById({_id: req.params.id});
        return res.json({status:200,message: "Movie Details fetched successfully", data:event});
    } catch (err) {
        res.status(500).json({ message: "Error fetching movies", error: err });
    }
}

export const addMovie = async (req: Request, res: Response) => {
    try {
        const { title, releaseYear, poster } = req.body;
        if (!title || !releaseYear || !poster) {
            return res.status(400).json({ message: "Title, Release Year and Poster are required" });
        }
        const newMovie = new Movie({ title, releaseYear, poster });
        await newMovie.save();
        return res.status(201).json({ status: 201, message: "Movie added successfully", data: newMovie });
    } catch (err) {
        return res.status(500).json({ message: "Error adding movie", error: err });
    }
}

export const updateMovie = async (req: Request, res: Response) => {
    try {
        if(!req.params.id){
            return res.status(400).json({message: "Movie ID is required"});
        }
        const { title, releaseYear, poster } = req.body;
        if (!title || !releaseYear || !poster) {
            return res.status(400).json({ message: "Title, Release Year and Poster are required" });
        }
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            { title, releaseYear, poster },
            { new: true }
        );
        if (!updatedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        return res.json({ status: 200, message: "Movie updated successfully", data: updatedMovie });
    } catch (err) {
        return res.status(500).json({ message: "Error updating movie", error: err });
    }
}