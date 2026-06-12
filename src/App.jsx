import { Routes, Route } from 'react-router-dom'
import PageLayout from './components/layout/PageLayout'
import Home from './pages/Home'
import Challenges from './pages/Challenges'
import Evaluate from './pages/Evaluate'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'

export default function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/evaluate/:challengeId?" element={<Evaluate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </PageLayout>
  )
}