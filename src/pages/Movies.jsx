import { useEffect, useState } from 'react'
import requestApi from '../api.js'

function getMovieId(movie) {
  return String(movie._id)
}

function MoviePrerequisites({ movies, selectedIds, onChange, disabled = false }) {
  if (movies.length === 0) {
    return <p className="text-sm text-slate-500">Prerequisite হিসেবে যোগ করার মতো অন্য কোনো movie নেই।</p>
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {movies.map((movie) => {
        const movieId = getMovieId(movie)

        return (
          <label key={movieId} className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={selectedIds.includes(movieId)}
              onChange={(event) => {
                const nextIds = event.target.checked
                  ? [...selectedIds, movieId]
                  : selectedIds.filter((id) => id !== movieId)
                onChange(nextIds)
              }}
              disabled={disabled}
              className="size-4 accent-amber-400"
            />
            <span>{movie.title}</span>
          </label>
        )
      })}
    </div>
  )
}

function Movies() {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [title, setTitle] = useState('')
  const [releaseYear, setReleaseYear] = useState('')
  const [runtime, setRuntime] = useState('')
  const [newPrerequisiteIds, setNewPrerequisiteIds] = useState([])
  const [editingMovieId, setEditingMovieId] = useState('')
  const [editedPrerequisiteIds, setEditedPrerequisiteIds] = useState([])

  useEffect(() => {
    let isMounted = true

    requestApi('/api/movies')
      .then((result) => {
        if (!Array.isArray(result?.data)) {
          throw new Error('Backend থেকে movie list-এর সঠিক format পাওয়া যায়নি।')
        }

        if (isMounted) setMovies(result.data)
      })
      .catch((error) => {
        if (isMounted) setErrorMessage(error.message || 'Movies load করা যায়নি।')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  async function refreshMovies() {
    const result = await requestApi('/api/movies')

    if (!Array.isArray(result?.data)) {
      throw new Error('Backend থেকে movie list-এর সঠিক format পাওয়া যায়নি।')
    }

    setMovies(result.data)
  }

  async function handleAddMovie(event) {
    event.preventDefault()
    setFormError('')
    setErrorMessage('')
    setSuccessMessage('')

    const parsedReleaseYear = Number(releaseYear)
    const parsedRuntime = Number(runtime)

    if (!title.trim()) {
      setFormError('Movie title লিখুন।')
      return
    }
    if (!Number.isInteger(parsedReleaseYear) || parsedReleaseYear < 1) {
      setFormError('সঠিক release year লিখুন।')
      return
    }
    if (!Number.isInteger(parsedRuntime) || parsedRuntime < 1 || parsedRuntime > 300) {
      setFormError('Runtime 1 থেকে 300 মিনিটের মধ্যে লিখুন।')
      return
    }

    setIsSaving(true)

    try {
      await requestApi('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          releaseYear: parsedReleaseYear,
          runtime: parsedRuntime,
          prerequisites: newPrerequisiteIds,
        }),
      })

      await refreshMovies()
      setTitle('')
      setReleaseYear('')
      setRuntime('')
      setNewPrerequisiteIds([])
      setSuccessMessage('Movie সফলভাবে যোগ হয়েছে।')
    } catch (error) {
      setFormError(error.message || 'Movie যোগ করা যায়নি।')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleWatchedChange(movie) {
    setErrorMessage('')
    setSuccessMessage('')
    setIsSaving(true)

    try {
      await requestApi(`/api/movies/${getMovieId(movie)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watched: !movie.watched }),
      })

      await refreshMovies()
      setSuccessMessage(`“${movie.title}”-এর watched status update হয়েছে।`)
    } catch (error) {
      setErrorMessage(error.message || 'Watched status update করা যায়নি।')
    } finally {
      setIsSaving(false)
    }
  }

  function startEditingPrerequisites(movie) {
    setEditingMovieId(getMovieId(movie))
    setEditedPrerequisiteIds((movie.prerequisites || []).map(String))
    setErrorMessage('')
    setSuccessMessage('')
  }

  async function handlePrerequisiteSave(movie) {
    setErrorMessage('')
    setSuccessMessage('')
    setIsSaving(true)

    try {
      await requestApi(`/api/movies/${getMovieId(movie)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prerequisites: editedPrerequisiteIds }),
      })

      await refreshMovies()
      setEditingMovieId('')
      setSuccessMessage(`“${movie.title}”-এর prerequisites update হয়েছে।`)
    } catch (error) {
      setErrorMessage(error.message || 'Prerequisites update করা যায়নি।')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm font-medium text-amber-300">Doomsday Ready</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Movies</h1>
        <p className="mt-2 text-sm text-slate-400">Movie list এবং watched status পরিচালনা করুন।</p>
      </div>

      {errorMessage && (
        <div role="alert" className="rounded-lg border border-red-900 bg-red-950/60 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div role="status" className="rounded-lg border border-emerald-900 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-200">
          {successMessage}
        </div>
      )}

      <section aria-labelledby="add-movie-heading" className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
        <h2 id="add-movie-heading" className="text-lg font-semibold">Add Movie</h2>
        <form noValidate onSubmit={handleAddMovie} className="mt-5 space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-300">
              <span>Title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={120}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none focus:border-amber-400"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>Release year</span>
              <input
                type="number"
                min="1"
                step="1"
                value={releaseYear}
                onChange={(event) => setReleaseYear(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none focus:border-amber-400"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>Runtime (minutes)</span>
              <input
                type="number"
                min="1"
                max="300"
                step="1"
                value={runtime}
                onChange={(event) => setRuntime(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none focus:border-amber-400"
              />
            </label>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-slate-300">Prerequisite movies (optional)</legend>
            <MoviePrerequisites
              movies={movies}
              selectedIds={newPrerequisiteIds}
              onChange={setNewPrerequisiteIds}
              disabled={isSaving}
            />
          </fieldset>

          {formError && <p role="alert" className="text-sm text-red-300">{formError}</p>}

          <button
            type="submit"
            disabled={isSaving}
            className="min-h-10 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : 'Add Movie'}
          </button>
        </form>
      </section>

      <section aria-labelledby="movie-list-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 id="movie-list-heading" className="text-lg font-semibold">Movie list</h2>
          {!isLoading && <span className="text-sm text-slate-500">{movies.length} movies</span>}
        </div>

        {isLoading ? (
          <p role="status" className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">Movies load হচ্ছে…</p>
        ) : movies.length === 0 ? (
          <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">এখনো কোনো movie যোগ করা হয়নি।</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {movies.map((movie) => {
              const movieId = getMovieId(movie)
              const prerequisiteMovies = movies.filter((candidate) =>
                (movie.prerequisites || []).map(String).includes(getMovieId(candidate)),
              )
              const isEditing = editingMovieId === movieId

              return (
                <article key={movieId} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="break-words text-base font-semibold text-slate-100">{movie.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{movie.releaseYear} · {movie.runtime} min</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${movie.watched ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                      {movie.watched ? 'Watched' : 'Unwatched'}
                    </span>
                  </div>

                  <div className="mt-4 border-t border-slate-800 pt-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <fieldset className="space-y-3">
                          <legend className="mb-2 text-sm font-medium text-slate-300">Edit prerequisites</legend>
                          <MoviePrerequisites
                            movies={movies.filter((candidate) => getMovieId(candidate) !== movieId)}
                            selectedIds={editedPrerequisiteIds}
                            onChange={setEditedPrerequisiteIds}
                            disabled={isSaving}
                          />
                        </fieldset>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => handlePrerequisiteSave(movie)} disabled={isSaving} className="rounded-lg bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60">Save prerequisites</button>
                          <button type="button" onClick={() => setEditingMovieId('')} disabled={isSaving} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 disabled:opacity-60">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Prerequisites</p>
                        <p className="mt-1 text-sm text-slate-300">
                          {prerequisiteMovies.length > 0
                            ? prerequisiteMovies.map((prerequisite) => prerequisite.title).join(', ')
                            : 'None'}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button type="button" onClick={() => startEditingPrerequisites(movie)} disabled={isSaving} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-slate-500 disabled:opacity-60">Edit prerequisites</button>
                          <button type="button" onClick={() => handleWatchedChange(movie)} disabled={isSaving} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-slate-500 disabled:opacity-60">
                            Mark {movie.watched ? 'unwatched' : 'watched'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default Movies
