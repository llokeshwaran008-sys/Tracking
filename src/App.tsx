import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import AddBookingPage from './pages/AddBookingPage';
import BookingsPage from './pages/BookingsPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import KanbanPage from './pages/KanbanPage';
import TimelinePage from './pages/TimelinePage';
import CategoriesPage from './pages/CategoriesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="features" element={<BookingsPage />} />
          <Route path="add" element={<AddBookingPage />} />
          <Route path="kanban" element={<KanbanPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
