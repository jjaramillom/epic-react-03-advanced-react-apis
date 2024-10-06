import { useReducer, useState } from 'react'
import * as ReactDOM from 'react-dom/client'

type State = { count: number }
// 🦺 make it so the action can be a function which accepts State and returns Partial<State>
type Action = Partial<State>
const countReducer = (
	state: State,
	action: Action | ((state: State) => Partial<State>),
) => ({
	...state,
	...(typeof action === 'function' ? action(state) : action),
})

function Counter({ initialCount = 0, step = 1 }) {
	const [state, setState] = useReducer(countReducer, {
		count: initialCount,
	})
	const increment = () =>
		setState(({ count }: State) => ({ count: count + step }))
	const decrement = () =>
		setState(({ count }: State) => ({ count: count - step }))
	return (
		<div className="counter">
			<output>{state.count}</output>
			<div>
				<button onClick={decrement}>⬅️</button>
				<button onClick={increment}>➡️</button>
			</div>
		</div>
	)
}

function App() {
	const [step, setStep] = useState(1)

	return (
		<div className="app">
			<h1>Counter:</h1>
			<form>
				<div>
					<label htmlFor="step-input">Step</label>
					<input
						id="step-input"
						type="number"
						value={step}
						onChange={(e) => setStep(Number(e.currentTarget.value))}
					/>
				</div>
			</form>
			<Counter step={step} />
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
