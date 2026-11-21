function RewatchProgress({ watchedCount, totalMovies, remainingRuntime }) {
  const progressPercent = totalMovies === 0 ? 0 : (watchedCount / totalMovies) * 100

  return (
    <section aria-labelledby="rewatch-progress-heading" className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/10 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">Your progress</p>
          <h2 id="rewatch-progress-heading" className="mt-2 text-xl font-semibold text-slate-100">
            {watchedCount} of {totalMovies} watched
          </h2>
          <div
            role="progressbar"
            aria-label="Rewatch plan progress"
            aria-valuemin={0}
            aria-valuemax={totalMovies || 1}
            aria-valuenow={watchedCount}
            className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-800"
          >
            <div
              className="h-full rounded-full bg-amber-400 transition-[width] duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 sm:min-w-48">
          <span className="flex size-10 items-center justify-center rounded-lg bg-amber-400/10 text-lg text-amber-300" aria-hidden="true">
            ◷
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Remaining runtime</p>
            <p className="mt-0.5 text-lg font-semibold text-slate-100">{remainingRuntime} min</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RewatchProgress
