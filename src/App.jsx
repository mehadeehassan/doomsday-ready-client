import { useState } from 'react'

const navigationItems = ['Movies', 'Rewatch Plan', 'Booking']

function App() {
  const [activeView, setActiveView] = useState('Movies')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <a href="#main-content" className="flex items-center gap-3 self-start rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400">
            <span className="flex size-10 items-center justify-center rounded-lg bg-amber-400 font-bold text-slate-950" aria-hidden="true">
              DR
            </span>
            <span className="text-lg font-semibold tracking-tight">Doomsday Ready</span>
          </a>

          <nav aria-label="Main navigation" className="flex w-full gap-2 overflow-x-auto sm:w-auto">
            {navigationItems.map((item) => {
              const isActive = activeView === item

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveView(item)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`min-h-10 flex-1 whitespace-nowrap rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:flex-none ${
                    isActive
                      ? 'bg-slate-800 text-amber-300'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                  }`}
                >
                  {item}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-amber-300">Doomsday Ready</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{activeView}</h1>
        </div>

        <section
          aria-labelledby="view-placeholder-title"
          className="min-h-52 rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8"
        >
          <h2 id="view-placeholder-title" className="text-lg font-medium text-slate-100">
            {activeView}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            এই view-এর content পরবর্তী ধাপে যোগ করা হবে।
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
