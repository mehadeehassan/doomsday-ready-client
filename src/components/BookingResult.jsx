function BookingResult({ result }) {
  if (!result) return null

  if (!result.possible) {
    return (
      <section role="status" aria-labelledby="booking-result-heading" className="rounded-2xl border border-amber-800/80 bg-amber-950/30 p-5 shadow-lg shadow-black/10 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-400/10 font-semibold text-amber-300" aria-hidden="true">!</span>
          <div>
            <h2 id="booking-result-heading" className="text-lg font-semibold text-amber-100">Not Possible</h2>
            <p className="mt-2 text-sm leading-6 text-amber-100/80">
              {result.message || 'No exact bundle combination is available for this group size.'}
            </p>
          </div>
        </div>
      </section>
    )
  }

  const bundleBreakdown = Object.entries(result.bundles || {}).sort(
    ([firstSize], [secondSize]) => Number(secondSize) - Number(firstSize),
  )

  return (
    <section aria-labelledby="booking-result-heading" className="rounded-2xl border border-emerald-900/70 bg-slate-900/70 p-5 shadow-lg shadow-black/10 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">Booking quote</p>
          <h2 id="booking-result-heading" className="mt-2 text-xl font-semibold text-slate-100">{result.cinema}</h2>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-emerald-800/70 bg-emerald-950/40 px-4 py-3">
          <span className="text-3xl font-bold tabular-nums text-emerald-200">{result.totalBundles}</span>
          <span className="max-w-24 text-sm font-medium leading-5 text-emerald-100">minimum {result.totalBundles === 1 ? 'bundle' : 'bundles'}</span>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-slate-300">Bundle breakdown</h3>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bundleBreakdown.map(([bundleSize, count]) => (
            <li key={bundleSize} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-colors hover:border-slate-700">
              <p className="text-2xl font-semibold tabular-nums text-slate-100">
                {count}<span className="mx-2 text-slate-500">×</span>{bundleSize}
              </p>
              <p className="mt-1 text-sm text-slate-400">{bundleSize}-seat {count === 1 ? 'bundle' : 'bundles'}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default BookingResult
