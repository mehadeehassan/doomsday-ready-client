function MovieSelector({ movies, selectedMovieId, onSelect, disabled = false }) {
  return (
    <label className="block max-w-xl space-y-2">
      <span className="text-sm font-medium text-slate-300">Target movie</span>
      <select
        value={selectedMovieId}
        onChange={(event) => onSelect(event.target.value)}
        disabled={disabled || movies.length === 0}
        className="min-h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="">Choose a movie</option>
        {movies.map((movie) => (
          <option key={String(movie._id)} value={String(movie._id)}>
            {movie.title} ({movie.releaseYear})
          </option>
        ))}
      </select>
    </label>
  )
}

export default MovieSelector
