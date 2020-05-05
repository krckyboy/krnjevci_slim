import { useState } from 'react'

export default function(initialValue) {
	const [value, setValue] = useState(initialValue)

	function handleChange(e) {
		setValue(e.target.value)
	}

	function reset() {
		setValue('')
	}

	return { value, handleChange, reset, setValue }
}
 