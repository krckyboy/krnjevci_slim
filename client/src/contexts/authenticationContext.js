import React, { createContext } from 'react'
import useLocalStorageReducer from '../hooks/useLocalStorageReducer'
import authenticationReducer from '../reducers/authenticationReducer'

export const AuthenticationContext = createContext()

// Sync state with local storage (token and user)
// User reducer and dispatch
export default function AuthenticationProvider(props) {
	const [authentication, dispatch] = useLocalStorageReducer(
		'authentication',
		{ user: null, token: null },
		authenticationReducer
	)
	return (
		<AuthenticationContext.Provider value={{ authentication, dispatch }}>
			{props.children}
		</AuthenticationContext.Provider>
	)
}
  