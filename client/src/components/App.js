import React from 'react'
import '../styles.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// Pages
import Home from '../pages/Home'
import AboutUs from '../pages/AboutUs'
import NotExist from '../pages/NotExist'
import DevShortcutRoutes from '../pages/DevShortcutRoutes'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Cart from '../pages/Cart'

// import AuthenticationProvider from '../contexts/authenticationContext'
// import MessagesProvider from '../contexts/messagesContext'
// import setAuthToken from '../utils/setAuthToken'

// Set auth token if in local storage
// if (localStorage.authentication) {
// 	const parsedAuthentication = JSON.parse(
// 		localStorage.getItem('authentication')
// 	)

// 	if (parsedAuthentication !== null && parsedAuthentication.token) {
// 		setAuthToken(parsedAuthentication.token)
// 	}
// }

/* 
		<AuthenticationProvider>
      <MessagesProvider>
        ... <Router />
      </MessagesProvider>
		</AuthenticationProvider>
*/

function App() {
	return (
		<Router
			onUpdate={() => window.scrollTo(0, 0)}
			basename={process.env.PUBLIC_URL}
		>
			<Switch>
				<Route exact path={process.env.PUBLIC_URL + '/'} component={Home} />
				<Route
					exact
					path={process.env.PUBLIC_URL + '/o_nama'}
					component={AboutUs}
				/>
				<Route
					exact
					path={process.env.PUBLIC_URL + '/dev_shortcut_routes'}
					component={DevShortcutRoutes}
				/>
				<Route
					exact
					path={process.env.PUBLIC_URL + '/uloguj_se'}
					component={Login}
				/>
				<Route
					exact
					path={process.env.PUBLIC_URL + '/registruj_se'}
					component={Register}
				/>
				<Route
					exact
					path={process.env.PUBLIC_URL + '/korpa'}
					component={Cart}
				/>
				<Route component={NotExist} />
			</Switch>
		</Router>
	)
}

export default App
