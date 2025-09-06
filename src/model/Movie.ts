import mongoose, { Schema } from "mongoose";

interface Movie extends Document{
    title: string;
    releaseYear: number;
    poster: string;
    createdAt?: Date;
    updatedAt?: Date;
    _id?: string;
}

const eventSchema: Schema<Movie> = new Schema({
  title: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  poster: { type: String, required: true },
});

const Movie = mongoose.model<Movie>('movie', eventSchema);

export default Movie;
