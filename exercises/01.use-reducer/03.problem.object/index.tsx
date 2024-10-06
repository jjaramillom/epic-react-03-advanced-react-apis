import { useReducer, useState } from 'react'
import * as ReactDOM from 'react-dom/client'

type State = {
	count: number
}
type Action = State

// 🦺 make a type called "State" which is an object with a count property as a number
// 🦺 make a type called "Action" which is the same as the State type
// 🐨 update this function to accept "state" (type "State") and an
// "action" (type "Action")
// 🐨 the function should merge properties from the state and the action and
// return that new object
const countReducer = (state: State, action: Action) => ({ ...state, ...action })

function Counter({ initialCount = 0, step = 1 }) {
	// 🐨 change this to "state" and "setState" and update the second argument
	// to be an object with a count property.
	const [state, setState] = useReducer(countReducer, { count: initialCount })
	// 🐨 update these calls to call setState with an object and a count property
	const increment = () => setState({ count: state.count + step })
	const decrement = () => setState({ count: state.count - step })
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
