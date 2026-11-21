function RewatchProgress({ watchedCount, totalMovies, remainingRuntime }) {
  return (
    <section aria-labelledby="rewatch-progress-heading" className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
      <h2 id="rewatch-progress-heading" className="text-base font-semibold">Plan progress</h2>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xl font-semibold text-slate-100">
            {watchedCount} of {totalMovies} watched
          </p>
          <progress
            className="mt-3 h-2 w-full accent-amber-400 sm:w-72"
            value={watchedCount}
            max={totalMovies || 1}
            aria-label={`${watchedCount} of ${totalMovies} movies watched`}
          />
        </div>
        <div className="rounded-lg bg-slate-950 px-4 py-3 sm:min-w-44">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Remaining runtime</p>
          <p className="mt-1 text-lg font-semibold text-amber-300">{remainingRuntime} min</p>
        </div>
      </div>
    </section>
  )
}

export default RewatchProgress
