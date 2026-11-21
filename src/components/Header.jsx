import Navigation from './Navigation.jsx'

function Header({ activeView, onChangeView }) {
  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <a
          href="#main-content"
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
