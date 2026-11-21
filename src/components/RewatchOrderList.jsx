function RewatchOrderList({ movies }) {
  if (movies.length === 0) {
    return (
      <section aria-labelledby="rewatch-order-heading" className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <h2 id="rewatch-order-heading" className="text-lg font-semibold">Prerequisite order</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          এই movie-এর আগে দেখার মতো কোনো prerequisite movie নেই।
        </p>
      </section>
    )
  }

  return (
    <section aria-labelledby="rewatch-order-heading" className="space-y-4">
      <div>
        <h2 id="rewatch-order-heading" className="text-lg font-semibold">Prerequisite order</h2>
        <p className="mt-1 text-sm text-slate-400">প্রথমে তালিকার উপরের movie-টি দেখুন।</p>
      </div>

      <ol className="grid gap-3 lg:grid-cols-2">
        {movies.map((movie, index) => (
          <li
            key={String(movie._id)}
            className={`rounded-xl border p-5 ${
              movie.watched
                ? 'border-emerald-900/80 bg-emerald-950/20'
                : 'border-slate-800 bg-slate-900/60'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm font-semibold text-slate-300">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-100">{movie.title}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${movie.watched ? 'bg-emerald-900/70 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                    {movie.watched ? '✓ Watched' : 'Unwatched'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  {movie.releaseYear} <span aria-hidden="true">·</span> {movie.runtime} min
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default RewatchOrderList
