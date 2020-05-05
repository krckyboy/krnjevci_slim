import React, { createContext, useReducer } from 'react'
import messagesReducer from '../reducers/messagesReducer'

export const MessagesContext = createContext()

export default function MessagesProvider(props) {
	const [message, dispatch] = useReducer(messagesReducer, {
		text: null,
		type: null,
	})
	return (
		<MessagesContext.Provider value={{ message, dispatch }}>
			{props.children}
		</MessagesContext.Provider>
	)
}
