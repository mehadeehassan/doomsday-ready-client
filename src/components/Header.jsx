import Navigation from './Navigation.jsx'

function Header({ activeView, onChangeView }) {
  function handleHomeClick() {
    onChangeView('Movies')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 shadow-sm shadow-black/10 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <a
          href="#main-content"
          onClick={handleHomeClick}
          className="flex items-center gap-3 self-start rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
        >
          <span
            className="flex size-10 items-center justify-center rounded-lg bg-amber-400 font-bold text-slate-950"
            aria-hidden="true"
          >
            DR
          </span>
          <span className="text-lg font-semibold tracking-tight">Doomsday Ready</span>
        </a>
        <Navigation activeView={activeView} onChangeView={onChangeView} />
      </div>
    </header>
  )
}

export default Header
