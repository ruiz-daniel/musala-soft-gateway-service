
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primeflex/primeflex.css'

import Gateways from './pages/Gateways'
import Gateway from './pages/Gateway'

function App() {
  return (
    <Router>
      <Routes>
        <Route path={'/'} element={<Gateways />} />
        <Route path={'/gateway'} element={<Gateway />} />
      </Routes>
    </Router>
  )
}

export default App
