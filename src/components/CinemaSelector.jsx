function CinemaSelector({ cinemas, selectedCinemaId, onSelect, disabled = false }) {
  const selectedCinema = cinemas.find((cinema) => String(cinema._id) === selectedCinemaId)

  return (
    <div className="space-y-3">
      <label className="block max-w-xl space-y-2">
        <span className="block text-sm font-medium text-slate-300">Cinema</span>
        <select
          value={selectedCinemaId}
          onChange={(event) => onSelect(event.target.value)}
          disabled={disabled || cinemas.length === 0}
          className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">Select a cinema</option>
          {cinemas.map((cinema) => (
            <option key={String(cinema._id)} value={String(cinema._id)}>
              {cinema.name} · bundles: {cinema.bundleSizes.join(', ')}
            </option>
          ))}
        </select>
      </label>

      {selectedCinema && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="font-semibold text-slate-100">{selectedCinema.name}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Available bundle sizes</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedCinema.bundleSizes.map((bundleSize) => (
              <span key={bundleSize} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-medium tabular-nums text-slate-200">
                {bundleSize} seats
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CinemaSelector
