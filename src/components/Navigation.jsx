const navigationItems = ['Movies', 'Rewatch Plan', 'Booking']

function Navigation({ activeView, onChangeView }) {
  return (
    <nav aria-label="Main navigation" className="flex w-full gap-2 overflow-x-auto sm:w-auto">
      {navigationItems.map((item) => {
        const isActive = activeView === item

        return (
          <button
            key={item}
            type="button"
            onClick={() => onChangeView(item)}
            aria-current={isActive ? 'page' : undefined}
            className={`min-h-10 flex-1 whitespace-nowrap rounded-lg px-2 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:flex-none sm:px-4 sm:text-sm ${
              isActive
              ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/10'
              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            {item}
          </button>
        )
      })}
    </nav>
  )
}

export default Navigation
