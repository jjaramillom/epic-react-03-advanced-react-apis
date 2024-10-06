import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Position = {
	left: number
	top: number
	right: number
	bottom: number
}

function useWindowSize() {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	})

	useEffect(() => {
		function handleResize() {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	return windowSize
}

export default function Tooltip({
	children,
	targetRect,
}: {
	children: React.ReactNode
	targetRect: Position | null
}) {
	const ref = useRef<HTMLDivElement | null>(null)
	const [tooltipHeight, setTooltipHeight] = useState(0)
	const [tooltipWidth, setTooltipWidth] = useState(0)
	const windowSize = useWindowSize()

	// 🐨 change this to useLayoutEffect to ensure it runs synchronously after the
	// DOM has been updated so the user doesn't see the tooltip jump around.
	useLayoutEffect(() => {
		const rect = ref.current?.getBoundingClientRect()
		if (!rect) return
		const { height, width } = rect
		setTooltipHeight(height)
		setTooltipWidth(width)
	}, [])

	// console.log(tooltipHeight)

	let tooltipX = 0
	let tooltipY = 0
	if (targetRect !== null) {
		console.log(tooltipWidth + targetRect.left)
		console.log(windowSize.width)
		tooltipX = targetRect.left
		tooltipY = targetRect.top - tooltipHeight
		if (tooltipY < 0) {
			tooltipY = targetRect.bottom
		}

		tooltipX += window.scrollX
		tooltipY += window.scrollY
	}

	// If the tooltip overflows to the right, move it to the left
	if (targetRect && tooltipWidth + targetRect.left > windowSize.width) {
		tooltipX = windowSize.width - tooltipWidth - 10
	}

	// This artificially slows down rendering
	let now = performance.now()
	while (performance.now() - now < 100) {
		// Do nothing for a bit...
	}

	return createPortal(
		<TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
			{children}
		</TooltipContainer>,
		document.body,
	)
}

function TooltipContainer({
	children,
	x,
	y,
	contentRef,
}: {
	children: React.ReactNode
	x: number
	y: number
	contentRef: React.RefObject<HTMLDivElement | null>
}) {
	return (
		<div
			className="tooltip-container"
			style={{ '--x': `${x}px`, '--y': `${y}px` }}
		>
			<div ref={contentRef} className="tooltip">
				{children}
			</div>
		</div>
	)
}

export function ButtonWithTooltip({
	tooltipContent,
	...rest
}: React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> & { tooltipContent: React.ReactNode }) {
	const [targetRect, setTargetRect] = useState<Position | null>(null)
	const buttonRef = useRef<HTMLButtonElement | null>(null)

	function displayTooltip() {
		const rect = buttonRef.current?.getBoundingClientRect()
		if (!rect) return
		setTargetRect({
			left: rect.left,
			top: rect.top,
			right: rect.right,
			bottom: rect.bottom,
		})
	}

	const hideTooltip = () => setTargetRect(null)

	return (
		<>
			<button
				{...rest}
				ref={buttonRef}
				onPointerEnter={displayTooltip}
				onPointerLeave={hideTooltip}
				onFocus={displayTooltip}
				onBlur={hideTooltip}
			/>
			{targetRect ? (
				<Tooltip targetRect={targetRect}>{tooltipContent}</Tooltip>
			) : null}
		</>
	)
}
