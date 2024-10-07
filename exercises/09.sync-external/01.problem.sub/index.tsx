import { useSyncExternalStore } from 'react'
import * as ReactDOM from 'react-dom/client'

// 💰 this is the mediaQuery we're going to be matching against:
const mediaQuery = '(max-width: 600px)'

function getSnapshot() {
	return window.matchMedia(mediaQuery)
}

function subscribe(cb: () => void) {
const matchQueryList = window.matchMedia(mediaQuery)
const onChange = () => {
		cb()
	}
	matchQueryList.addEventListener('change', onChange)
	return () => matchQueryList.removeEventListener('change', onChange)
}

function NarrowScreenNotifier() {
	const isNarrow = useSyncExternalStore(subscribe, getSnapshot)
	return isNarrow ? 'You are on a narrow screen' : 'You are on a wide screen'
}

function App() {
	return <NarrowScreenNotifier />
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
const root = ReactDOM.createRoot(rootEl)
root.render(<App />)

// @ts-expect-error 🚨 this is for the test
window.__epicReactRoot = root
