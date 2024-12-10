import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatsOverview from '../components/dashboard/stats/StatsOverview';
import UsersList from '../components/dashboard/users/UsersList';
import Menu from './Menu';
import BlogList from '../components/dashboard/blog/BlogList';
import BlogPostForm from '../components/dashboard/blog/BlogPostForm';
import EventList from '../components/dashboard/events/EventList';
import EventForm from '../components/dashboard/events/EventForm';
import OrderList from '../components/dashboard/orders/OrderList';
import ReservationList from '../components/dashboard/reservations/ReservationList';

function Dashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<StatsOverview />} />
        <Route path="users" element={<UsersList />} />
        <Route path="menu/*" element={<Menu />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="reservations" element={<ReservationList />} />
        <Route path="blog" element={<BlogList />} />
        <Route path="blog/new" element={<BlogPostForm />} />
        <Route path="blog/edit/:id" element={<BlogPostForm />} />
        <Route path="events" element={<EventList />} />
        <Route path="events/new" element={<EventForm />} />
        <Route path="events/edit/:id" element={<EventForm />} />
      </Routes>
    </DashboardLayout>
  );
}

export default Dashboard;