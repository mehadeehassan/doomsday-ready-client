import { useEffect, useState } from 'react'
import requestApi from '../api.js'
import BookingForm from '../components/BookingForm.jsx'
import BookingResult from '../components/BookingResult.jsx'
import CinemaSelector from '../components/CinemaSelector.jsx'

function Booking() {
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
          throw new Error('Backend থেকে cinema list-এর সঠিক format পাওয়া যায়নি।')
        }

        if (isMounted) setCinemas(result.data)
      })
      .catch((error) => {
        if (isMounted) setCinemasError(error.message || 'Cinema list load করা যায়নি।')
      })
      .finally(() => {
        if (isMounted) setIsCinemasLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

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
      setFormError('একটি cinema নির্বাচন করুন।')
      return
    }

    const parsedGroupSize = Number(groupSize)
    if (!Number.isInteger(parsedGroupSize) || parsedGroupSize < 1 || parsedGroupSize > 10000) {
      setFormError('Group size 1 থেকে 10,000-এর মধ্যে পূর্ণসংখ্যা হতে হবে।')
      return
    }

    setIsQuoteLoading(true)

    try {
      const query = new URLSearchParams({ groupSize: String(parsedGroupSize) })
      const result = await requestApi(`/api/cinemas/${selectedCinemaId}/booking?${query}`)

      if (typeof result?.data?.possible !== 'boolean') {
        throw new Error('Backend থেকে booking quote-এর সঠিক format পাওয়া যায়নি।')
      }

      if (
        result.data.possible &&
        (typeof result.data.cinema !== 'string' ||
          !Number.isInteger(result.data.totalBundles) ||
          !result.data.bundles ||
          typeof result.data.bundles !== 'object' ||
          Array.isArray(result.data.bundles))
      ) {
        throw new Error('Backend থেকে booking quote-এর সঠিক format পাওয়া যায়নি।')
      }

      setBookingResult(result.data)
    } catch (error) {
      setFormError(error.message || 'Booking quote পাওয়া যায়নি।')
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
          Cinema ও group size বেছে backend থেকে booking quote নিন।
        </p>
      </div>

      {isCinemasLoading ? (
        <p role="status" className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
          Cinemas load হচ্ছে…
        </p>
      ) : cinemasError ? (
        <div role="alert" className="rounded-lg border border-red-900 bg-red-950/60 px-4 py-3 text-sm text-red-200">
          {cinemasError}
        </div>
      ) : cinemas.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
          <h2 className="text-lg font-semibold">No cinemas available</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Booking quote পেতে backend-এ অন্তত একটি cinema যোগ করতে হবে।
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <section aria-labelledby="booking-details-heading" className="space-y-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
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
              Booking quote load হচ্ছে…
            </p>
          )}
          {!isQuoteLoading && <BookingResult result={bookingResult} />}
        </div>
      )}
    </div>
  )
}

export default Booking
