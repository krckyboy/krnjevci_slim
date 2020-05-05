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
import MyTutorials from '../pages/MyTutorials'
import Tutorials from '../pages/Tutorials'
import MyAccount from '../pages/MyAccount'
import PurchaseHistory from '../pages/PurchaseHistory'
import AddTutorial from '../pages/dev/AddTutorial'
import EditTutorial from '../pages/dev/EditTutorial'
import Tutorial from '../pages/Tutorial'
import ResetPassword from '../pages/ResetPassword'

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
				<Route
					exact
					path={process.env.PUBLIC_URL + '/moji_tutorijali'}
					component={MyTutorials}
				/>
				<Route
					exact
					path={process.env.PUBLIC_URL + '/tutorijali'}
					component={Tutorials}
				/>
				<Route
					exact
					path={process.env.PUBLIC_URL + '/moj_nalog'}
					component={MyAccount}
				/>
				<Route
					exact
					path={process.env.PUBLIC_URL + '/istorija_kupovine'}
					component={PurchaseHistory}
				/>
				<Route
					exact
					path={process.env.PUBLIC_URL + '/dev/dodaj_tutorijal'}
					component={AddTutorial}
				/>
				<Route
					exact
					path={process.env.PUBLIC_URL + '/dev/izmeni_tutorijal'}
					component={EditTutorial}
				/>
				<Route
					exact
					path={process.env.PUBLIC_URL + '/tutorijal'}
					component={Tutorial}
				/>
				<Route
					exact
					path={process.env.PUBLIC_URL + '/resetuj_lozinku'}
					component={ResetPassword}
				/>
				<Route component={NotExist} />
			</Switch>
		</Router>
	)
}

export default App
