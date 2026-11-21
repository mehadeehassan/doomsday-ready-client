import { useEffect, useState } from 'react'
import requestApi from '../api.js'
import useToast from '../toast/useToast.js'

function getMovieId(movie) {
  return String(movie._id)
}

function MoviePrerequisites({ movies, selectedIds, onChange, disabled = false }) {
  if (movies.length === 0) {
    return <p className="text-sm text-slate-500">There are no other movies to add as prerequisites.</p>
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
  const showToast = useToast()
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
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
          throw new Error('The backend returned an invalid movie list.')
        }

        if (isMounted) setMovies(result.data)
      })
      .catch((error) => {
        if (isMounted) setErrorMessage(error.message || 'Could not load movies.')
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
      throw new Error('The backend returned an invalid movie list.')
    }

    setMovies(result.data)
  }

  async function handleAddMovie(event) {
    event.preventDefault()
    setFormError('')
    setErrorMessage('')

    const parsedReleaseYear = Number(releaseYear)
    const parsedRuntime = Number(runtime)

    if (!title.trim()) {
      setFormError('Enter a movie title.')
      return
    }
    if (!Number.isInteger(parsedReleaseYear) || parsedReleaseYear < 1) {
      setFormError('Enter a valid release year.')
      return
    }
    if (!Number.isInteger(parsedRuntime) || parsedRuntime < 1 || parsedRuntime > 300) {
      setFormError('Runtime must be between 1 and 300 minutes.')
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
      showToast('success', 'Movie created successfully.')
    } catch (error) {
      if (error.status === 409 && error.message.toLowerCase().includes('title already exists')) {
        showToast('error', 'A movie with this title already exists.')
      } else if (error.code === 'CIRCULAR_DEPENDENCY') {
        showToast('error', `Circular dependency: ${error.message}`)
      } else {
        showToast('error', `Movie creation failed: ${error.message || 'Please try again.'}`)
      }
    } finally {
      setIsSaving(false)
    }
  }

  async function handleWatchedChange(movie) {
    setErrorMessage('')
    setIsSaving(true)

    try {
      await requestApi(`/api/movies/${getMovieId(movie)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watched: !movie.watched }),
      })

      await refreshMovies()
      showToast('success', `Watched status updated for “${movie.title}”.`)
    } catch (error) {
      showToast('error', `Could not update the watched status: ${error.message || 'Please try again.'}`)
    } finally {
      setIsSaving(false)
    }
  }

  function startEditingPrerequisites(movie) {
    setEditingMovieId(getMovieId(movie))
    setEditedPrerequisiteIds((movie.prerequisites || []).map(String))
    setErrorMessage('')
  }

  async function handlePrerequisiteSave(movie) {
    setErrorMessage('')
    setIsSaving(true)

    try {
      await requestApi(`/api/movies/${getMovieId(movie)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prerequisites: editedPrerequisiteIds }),
      })

      await refreshMovies()
      setEditingMovieId('')
      showToast('success', `Movie updated successfully: prerequisites for “${movie.title}”.`)
    } catch (error) {
      if (error.code === 'CIRCULAR_DEPENDENCY') {
        showToast('error', `Circular dependency: ${error.message}`)
      } else {
        showToast('error', `Could not update prerequisites: ${error.message || 'Please try again.'}`)
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm font-medium text-amber-300">Doomsday Ready</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Movies</h1>
        <p className="mt-2 text-sm text-slate-400">Manage your movie list and watched status.</p>
      </div>

      {errorMessage && (
        <div role="alert" className="rounded-lg border border-red-900 bg-red-950/60 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      )}
      <section aria-labelledby="add-movie-heading" className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/10 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">Movie library</p>
          <h2 id="add-movie-heading" className="mt-1 text-lg font-semibold">Add Movie</h2>
        </div>
        <form noValidate onSubmit={handleAddMovie} className="mt-5 space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block space-y-2 text-sm font-medium text-slate-300">
              <span className="block">Title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={120}
                required
                placeholder="Enter movie title"
                className="min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-400 outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15"
              />
            </label>
            <label className="block space-y-2 text-sm font-medium text-slate-300">
              <span className="block">Release Year</span>
              <input
                type="number"
                min="1"
                step="1"
                value={releaseYear}
                onChange={(event) => setReleaseYear(event.target.value)}
                required
                placeholder="e.g. 2018"
                className="min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-400 outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15"
              />
            </label>
            <label className="block space-y-2 text-sm font-medium text-slate-300">
              <span className="block">Runtime (Minutes)</span>
              <input
                type="number"
                min="1"
                max="300"
                step="1"
                value={runtime}
                onChange={(event) => setRuntime(event.target.value)}
                required
                placeholder="e.g. 149"
                className="min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-400 outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15"
              />
            </label>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-slate-300">Prerequisite Movies (Optional)</legend>
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
            className="min-h-11 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm shadow-amber-950/20 transition-colors hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
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
          <p role="status" className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">Loading movies…</p>
        ) : movies.length === 0 ? (
          <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">No movies have been added yet.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {movies.map((movie) => {
              const movieId = getMovieId(movie)
              const prerequisiteMovies = movies.filter((candidate) =>
                (movie.prerequisites || []).map(String).includes(getMovieId(candidate)),
              )
              const isEditing = editingMovieId === movieId

              return (
                <article key={movieId} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/10 transition-colors hover:border-slate-700 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="wrap-break-word text-lg font-semibold leading-6 text-slate-100">{movie.title}</h3>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-300">
                        <span className="rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1.5">{movie.releaseYear}</span>
                        <span className="rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1.5">{movie.runtime} min</span>
                      </div>
                    </div>
                    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${movie.watched ? 'bg-emerald-950/70 text-emerald-300 ring-emerald-900' : 'bg-slate-800/80 text-slate-300 ring-slate-700'}`}>
                      {movie.watched && <span aria-hidden="true">✓</span>}
                      {movie.watched ? 'Watched' : 'Unwatched'}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-slate-800 pt-4">
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
                          <button type="button" onClick={() => handlePrerequisiteSave(movie)} disabled={isSaving} className="min-h-10 rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-60">Save prerequisites</button>
                          <button type="button" onClick={() => setEditingMovieId('')} disabled={isSaving} className="min-h-10 rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-60">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Prerequisites</p>
                          {prerequisiteMovies.length > 0 ? (
                            <ul className="mt-3 flex flex-wrap gap-2">
                              {prerequisiteMovies.map((prerequisite) => (
                                <li key={getMovieId(prerequisite)} className="max-w-full rounded-lg bg-slate-800/80 px-3 py-1.5 text-sm text-slate-200">
                                  {prerequisite.title}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-2 text-sm text-slate-400">No prerequisites</p>
                          )}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button type="button" onClick={() => startEditingPrerequisites(movie)} disabled={isSaving} className="min-h-10 rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-60">Edit prerequisites</button>
                          <button type="button" onClick={() => handleWatchedChange(movie)} disabled={isSaving} className="min-h-10 rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-60">
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
