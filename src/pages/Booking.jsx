import { useEffect, useState } from 'react'
import requestApi from '../api.js'
import BookingForm from '../components/BookingForm.jsx'
import BookingResult from '../components/BookingResult.jsx'
import CinemaSelector from '../components/CinemaSelector.jsx'
import useToast from '../toast/useToast.js'

function Booking() {
  const showToast = useToast()
  const [cinemas, setCinemas] = useState([])
  const [selectedCinemaId, setSelectedCinemaId] = useState('')
  const [groupSize, setGroupSize] = useState('')
  const [bookingResult, setBookingResult] = useState(null)
  const [isCinemasLoading, setIsCinemasLoading] = useState(true)
  const [isQuoteLoading, setIsQuoteLoading] = useState(false)
  const [cinemasError, setCinemasError] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    let isMounted = true

    requestApi('/api/cinemas')
      .then((result) => {
        if (!Array.isArray(result?.data)) {
          throw new Error('The backend returned an invalid cinema list.')
        }

        if (isMounted) setCinemas(result.data)
      })
      .catch((error) => {
        if (isMounted) {
          const message = error.message || 'Could not load cinemas.'
          setCinemasError(message)
          showToast('error', `Cinema loading failed: ${message}`)
        }
      })
      .finally(() => {
        if (isMounted) setIsCinemasLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [showToast])

  function handleCinemaSelect(cinemaId) {
    setSelectedCinemaId(cinemaId)
    setBookingResult(null)
    setFormError('')
  }

  function handleGroupSizeChange(value) {
    setGroupSize(value)
    setBookingResult(null)
    setFormError('')
  }

  async function handleBookingSubmit(event) {
    event.preventDefault()
    setFormError('')
    setBookingResult(null)

    if (!selectedCinemaId) {
      const message = 'Select a cinema.'
      setFormError(message)
      showToast('warning', message)
      return
    }

    const parsedGroupSize = Number(groupSize)
    if (!Number.isInteger(parsedGroupSize) || parsedGroupSize < 1 || parsedGroupSize > 10000) {
      const message = 'Group size must be a whole number between 1 and 10,000.'
      setFormError(message)
      showToast('warning', message)
      return
    }

    setIsQuoteLoading(true)

    try {
      const query = new URLSearchParams({ groupSize: String(parsedGroupSize) })
      const result = await requestApi(`/api/cinemas/${selectedCinemaId}/booking?${query}`)

      if (typeof result?.data?.possible !== 'boolean') {
        throw new Error('The backend returned an invalid booking quote.')
      }

      if (
        result.data.possible &&
        (typeof result.data.cinema !== 'string' ||
          !Number.isInteger(result.data.totalBundles) ||
          !result.data.bundles ||
          typeof result.data.bundles !== 'object' ||
          Array.isArray(result.data.bundles))
      ) {
        throw new Error('The backend returned an invalid booking quote.')
      }

      setBookingResult(result.data)
      if (result.data.possible) {
        showToast('success', `Booking quote generated for ${result.data.cinema}.`)
      } else {
        showToast('warning', result.data.message || 'No exact bundle combination is possible.')
      }
    } catch (error) {
      const message = error.message || 'Could not get a booking quote.'
      setFormError(message)
      showToast('error', `Booking request failed: ${message}`)
    } finally {
      setIsQuoteLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm font-medium text-amber-300">Doomsday Ready</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Cinema Booking</h1>
        <p className="mt-2 text-sm text-slate-400">
          Select a cinema and group size to get a booking quote.
        </p>
      </div>

      {isCinemasLoading ? (
        <p role="status" className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
          Loading cinemas…
        </p>
      ) : cinemasError ? (
        <div role="alert" className="rounded-lg border border-red-900 bg-red-950/60 px-4 py-3 text-sm text-red-200">
          {cinemasError}
        </div>
      ) : cinemas.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/10 sm:p-8">
          <h2 className="text-lg font-semibold">No cinemas available</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Add at least one cinema to the backend before requesting a booking quote.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <section aria-labelledby="booking-details-heading" className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/10 sm:p-6">
            <h2 id="booking-details-heading" className="text-lg font-semibold">Booking details</h2>
            <CinemaSelector
              cinemas={cinemas}
              selectedCinemaId={selectedCinemaId}
              onSelect={handleCinemaSelect}
              disabled={isQuoteLoading}
            />
            <div className="border-t border-slate-800 pt-5">
              <BookingForm
                groupSize={groupSize}
                onGroupSizeChange={handleGroupSizeChange}
                onSubmit={handleBookingSubmit}
                disabled={isQuoteLoading}
                errorMessage={formError}
              />
            </div>
          </section>

          {isQuoteLoading && (
            <p role="status" className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
              Loading booking quote…
            </p>
          )}
          {!isQuoteLoading && <BookingResult result={bookingResult} />}
        </div>
      )}
    </div>
  )
}

export default Booking
