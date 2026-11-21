function BookingForm({ groupSize, onGroupSizeChange, onSubmit, disabled = false, errorMessage = '' }) {
  return (
    <form noValidate onSubmit={onSubmit} className="space-y-4">
      <label className="block max-w-xs space-y-2">
        <span className="block text-sm font-medium text-slate-300">Group Size</span>
        <input
          type="number"
          min="1"
          max="10000"
          step="1"
          inputMode="numeric"
          value={groupSize}
          onChange={(event) => onGroupSizeChange(event.target.value)}
          required
          disabled={disabled}
          className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <span className="block text-xs leading-5 text-slate-400">Enter a whole number from 1 to 10,000.</span>
      </label>

      {errorMessage && <p role="alert" className="text-sm text-red-300">{errorMessage}</p>}

      <button
        type="submit"
        disabled={disabled}
        className="min-h-11 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm shadow-amber-950/20 transition-colors hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {disabled ? 'Calculating…' : 'Get booking quote'}
      </button>
    </form>
  )
}

export default BookingForm
