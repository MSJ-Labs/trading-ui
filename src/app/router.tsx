import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AppLayout from './layout/AppLayout'
import ProfilePage from '../features/auth/pages/ProfilePage'
import MarketPage from '../features/marketdata/pages/MarketPage'

// Login and registration are Keycloak pages, reached through the BFF (/oauth2/authorization/keycloak).
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/market" element={<MarketPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/market" replace />} />
      </Routes>
    </BrowserRouter>
  )
}