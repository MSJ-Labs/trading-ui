import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import ProfilePage from '../features/auth/pages/ProfilePage'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}