import { useState } from 'react'
import Header from './components/Header.jsx'
import Booking from './pages/Booking.jsx'
import Movies from './pages/Movies.jsx'
import RewatchPlan from './pages/RewatchPlan.jsx'

function App() {
  const [activeView, setActiveView] = useState('Movies')

  function renderActiveView() {
    if (activeView === 'Rewatch Plan') return <RewatchPlan />
    if (activeView === 'Booking') return <Booking />
    return <Movies />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header activeView={activeView} onChangeView={setActiveView} />
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {renderActiveView()}
      </main>
    </div>
  )
}

export default App
