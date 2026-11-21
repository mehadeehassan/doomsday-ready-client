function BookingResult({ result }) {
  if (!result) return null

  if (!result.possible) {
    return (
      <section role="status" aria-labelledby="booking-result-heading" className="rounded-xl border border-amber-900/70 bg-amber-950/20 p-5 sm:p-6">
        <h2 id="booking-result-heading" className="text-lg font-semibold">Not Possible</h2>
        <p className="mt-2 text-sm leading-6 text-amber-100/80">
          {result.message || 'এই group size-এর জন্য exact bundle combination পাওয়া যায়নি।'}
        </p>
      </section>
    )
  }

  const bundleBreakdown = Object.entries(result.bundles || {}).sort(
    ([firstSize], [secondSize]) => Number(secondSize) - Number(firstSize),
  )

  return (
    <section aria-labelledby="booking-result-heading" className="rounded-xl border border-emerald-900/70 bg-emerald-950/20 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">Booking quote</p>
          <h2 id="booking-result-heading" className="mt-1 text-lg font-semibold text-slate-100">{result.cinema}</h2>
        </div>
        <p className="rounded-lg bg-emerald-900/50 px-3 py-2 text-sm font-semibold text-emerald-200">
          {result.totalBundles} {result.totalBundles === 1 ? 'bundle' : 'bundles'} required
        </p>
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bundleBreakdown.map(([bundleSize, count]) => (
          <li key={bundleSize} className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xl font-semibold text-slate-100">{count} × {bundleSize}</p>
            <p className="mt-1 text-sm text-slate-400">{bundleSize}-seat bundle</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default BookingResult
