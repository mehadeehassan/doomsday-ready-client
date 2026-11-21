function RewatchOrderList({ movies }) {
  if (movies.length === 0) {
    return (
      <section aria-labelledby="rewatch-order-heading" className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/10 sm:p-8">
        <h2 id="rewatch-order-heading" className="text-lg font-semibold">Prerequisite order</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          This movie has no prerequisite movies to rewatch.
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Prerequisite order</h2>
        <p className="mt-1 text-sm text-slate-400">Follow the list from top to bottom.</p>
      </div>

      <ol className="max-w-3xl space-y-3">
        {movies.map((movie, index) => (
          <li key={String(movie._id)} className="relative pl-12">
            {index < movies.length - 1 && (
              <span aria-hidden="true" className="absolute bottom-[-0.75rem] left-[17px] top-10 w-px bg-slate-800" />
            )}
            <span className="absolute left-0 top-4 flex size-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300">
              {String(index + 1).padStart(2, '0')}
            </span>
            <article className={`rounded-xl border p-4 transition-colors sm:p-5 ${
              movie.watched
                ? 'border-emerald-900/80 bg-emerald-950/20'
                : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
            }`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="break-words font-semibold text-slate-100">{movie.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {movie.releaseYear} <span aria-hidden="true">·</span> {movie.runtime} min
                  </p>
                </div>
                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${movie.watched ? 'bg-emerald-900/70 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                  {movie.watched && <span aria-hidden="true">✓</span>}
                  {movie.watched ? 'Watched' : 'Unwatched'}
                </span>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default RewatchOrderList
