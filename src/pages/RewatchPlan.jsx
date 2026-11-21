import { useEffect, useState } from 'react'
import requestApi from '../api.js'
import MovieSelector from '../components/MovieSelector.jsx'
import RewatchOrderList from '../components/RewatchOrderList.jsx'
import RewatchProgress from '../components/RewatchProgress.jsx'

function RewatchPlan() {
  const [movies, setMovies] = useState([])
  const [selectedMovieId, setSelectedMovieId] = useState('')
  const [rewatchPlan, setRewatchPlan] = useState(null)
  const [isMoviesLoading, setIsMoviesLoading] = useState(true)
  const [isPlanLoading, setIsPlanLoading] = useState(false)
  const [moviesError, setMoviesError] = useState('')
  const [planError, setPlanError] = useState('')

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
        if (isMounted) setMoviesError(error.message || 'Could not load movies.')
      })
      .finally(() => {
        if (isMounted) setIsMoviesLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!selectedMovieId) return undefined

    const controller = new AbortController()

    requestApi(`/api/movies/${selectedMovieId}/rewatch-order`, { signal: controller.signal })
      .then((result) => {
        const plan = result?.data
        const hasExpectedResponse =
          Array.isArray(plan?.rewatchOrder) &&
          Number.isInteger(plan.watchedCount) &&
          Number.isInteger(plan.totalMovies) &&
          Number.isFinite(plan.remainingRuntime)

        if (!hasExpectedResponse) {
          throw new Error('The backend returned an invalid rewatch plan.')
        }

        setRewatchPlan(plan)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setPlanError(error.message || 'Could not load the rewatch plan.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsPlanLoading(false)
      })

    return () => controller.abort()
  }, [selectedMovieId])

  function handleMovieSelect(movieId) {
    setSelectedMovieId(movieId)
    setRewatchPlan(null)
    setPlanError('')
    setIsPlanLoading(Boolean(movieId))
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm font-medium text-amber-300">Doomsday Ready</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Rewatch Plan</h1>
        <p className="mt-2 text-sm text-slate-400">
          Choose a movie to view the prerequisite order returned by the backend.
        </p>
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
        {isMoviesLoading ? (
          <p role="status" className="text-sm text-slate-400">Loading movies…</p>
        ) : moviesError ? (
          <div role="alert" className="text-sm text-red-300">{moviesError}</div>
        ) : movies.length === 0 ? (
          <p className="text-sm text-slate-400">Add a movie before creating a rewatch plan.</p>
        ) : (
          <MovieSelector
            movies={movies}
            selectedMovieId={selectedMovieId}
            onSelect={handleMovieSelect}
            disabled={isPlanLoading}
          />
        )}
      </section>

      {planError && (
        <div role="alert" className="rounded-lg border border-red-900 bg-red-950/60 px-4 py-3 text-sm text-red-200">
          {planError}
        </div>
      )}

      {isPlanLoading && (
        <p role="status" className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
          Loading rewatch plan…
        </p>
      )}

      {rewatchPlan && !isPlanLoading && (
        <div className="space-y-6">
          <RewatchProgress
            watchedCount={rewatchPlan.watchedCount}
            totalMovies={rewatchPlan.totalMovies}
            remainingRuntime={rewatchPlan.remainingRuntime}
          />
          <RewatchOrderList movies={rewatchPlan.rewatchOrder} />
        </div>
      )}
    </div>
  )
}

export default RewatchPlan
