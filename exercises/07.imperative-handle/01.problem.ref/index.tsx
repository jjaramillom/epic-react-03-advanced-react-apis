import { useLayoutEffect, useRef, useState, useImperativeHandle } from 'react'
import * as ReactDOM from 'react-dom/client'
import { allMessages } from './messages'

type ScrollableImperativeAPI = {
	scrollToTop: () => void
	scrollToBottom: () => void
}

function Scrollable({
	children,
	ref,
}: {
	children: React.ReactNode
	ref: React.RefObject<ScrollableImperativeAPI | null>
}) {
	const containerRef = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		scrollToBottom()
	})

	function scrollToTop() {
		if (!containerRef.current) return
		containerRef.current.scrollTop = 0
	}

	function scrollToBottom() {
		if (!containerRef.current) return
		containerRef.current.scrollTop = containerRef.current.scrollHeight
	}

	useImperativeHandle(ref, () => ({ scrollToBottom, scrollToTop }))

	return (
		<div ref={containerRef} role="log">
			{children}
		</div>
	)
}

function App() {
	const [messages, setMessages] = useState(allMessages.slice(0, 8))
	const ref = useRef<ScrollableImperativeAPI>(null)
	function addMessage() {
		if (messages.length < allMessages.length) {
			setMessages(allMessages.slice(0, messages.length + 1))
		}
	}
	function removeMessage() {
		if (messages.length > 0) {
			setMessages(allMessages.slice(0, messages.length - 1))
		}
	}

	const scrollToTop = () => {
		ref.current?.scrollToTop()
	}

	const scrollToBottom = () => {
		ref.current?.scrollToBottom()
	}

	return (
		<div className="messaging-app">
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<button onClick={addMessage}>add message</button>
				<button onClick={removeMessage}>remove message</button>
			</div>
			<hr />
			<div>
				<button onClick={scrollToTop}>scroll to top</button>
			</div>
			<Scrollable ref={ref}>
				{messages.map((message, index, array) => (
					<div key={message.id}>
						<strong>{message.author}</strong>: <span>{message.content}</span>
						{array.length - 1 === index ? null : <hr />}
					</div>
				))}
			</Scrollable>
			<div>
				<button onClick={scrollToBottom}>scroll to bottom</button>
			</div>
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)

/*
eslint
	@typescript-eslint/no-unused-vars: "off",
*/
