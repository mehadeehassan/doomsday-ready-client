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
          className="min-h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <span className="block text-xs text-slate-500">Enter a whole number from 1 to 10,000.</span>
      </label>

      {errorMessage && <p role="alert" className="text-sm text-red-300">{errorMessage}</p>}

      <button
        type="submit"
        disabled={disabled}
        className="min-h-10 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {disabled ? 'Calculating…' : 'Get booking quote'}
      </button>
    </form>
  )
}

export default BookingForm
