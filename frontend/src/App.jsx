import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Maintab from './pages/Maintab'
import StateMessage from './context/message/StateMessage'
import StateStatus from './context/status/StateStatus'

function App() {
  return (
    <>
      <StateMessage>
        <StateStatus>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/maintab/:tab/:id" element={<Maintab />} />
          </Routes>
        </StateStatus>
      </StateMessage>
    </>
  )
}

export default App