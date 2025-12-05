import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AuthLayout from './layouts/AuthLayout';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ManagerLayout from './layouts/ManagerLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Advertise from './pages/Advertise';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Community from './pages/Community';

import FamilyList from './pages/dashboard/FamilyList';
import AddFamily from './pages/dashboard/AddFamily';
import EditFamily from './pages/dashboard/EditFamily';
import FamilyDetail from './pages/dashboard/FamilyDetail';
import VillageAdmin from './pages/dashboard/VillageAdmin';
import AdvertiseAdmin from './pages/dashboard/AdvertiseAdmin';
import AdvertiseForm from './pages/dashboard/AdvertiseForm';
import EventAdmin from './pages/dashboard/EventAdmin';
import EventForm from './pages/dashboard/EventForm';
import EventImagesAdmin from './pages/dashboard/EventImagesAdmin';

import FamilyView from "./pages/dashboard/FamilyView";
import FamilyEdit from "./pages/dashboard/FamilyEdit";
import EventDetails from './pages/EventDetails';
import UserList from './pages/admin/UserList';
import UserForm from './pages/admin/UserForm';

import CategoryList from "./pages/categories/CategoryList";
import AddCategory from "./pages/categories/AddCategory";
import EditCategory from "./pages/categories/EditCategory";



function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="advertise" element={<Advertise />} />
        <Route path="contact" element={<Contact />} />
        <Route path="family/:id" element={<FamilyDetail />} />
        <Route
          path="community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Auth Pages */}
       <Route path="/" element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
       </Route>

      {/* Admin Dashboard */}
      
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="family-list" element={<FamilyList role="admin" />} />
        <Route path="add-family" element={<AddFamily />} />
        <Route path="edit-family/:familyId/:memberId" element={<FamilyEdit />} />
         <Route path="view-family/:familyId/:memberId" element={<FamilyView />} />

         <Route path="user-list" element={<UserList />} />
        <Route path="add-user" element={<UserForm />} />
        <Route path="edit-user/:id" element={<UserForm />} />


        {/* Village Management */}
        <Route path="villages" element={<VillageAdmin />} />
        <Route
              path="/dashboard/admin/advertise"
              element={<AdvertiseAdmin />}
            />
            <Route
              path="/dashboard/admin/advertise/add"
              element={<AdvertiseForm />}
            />
            <Route
              path="/dashboard/admin/advertise/edit/:id"
              element={<AdvertiseForm />}
            />
             {/* Event Management */}
            <Route path="events" element={<EventAdmin />} />
            <Route path="events/add" element={<EventForm />} />
            <Route path="events/edit/:id" element={<EventForm />} />
            <Route path="events/images/:eventId" element={<EventImagesAdmin />} />

            
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/add" element={<AddCategory />} />
            <Route path="categories/edit/:id" element={<EditCategory />} />


      </Route>

      {/* Manager Dashboard */}
      <Route
        path="/dashboard/representative"
        element={
          <ProtectedRoute roles={['representative']}>
            <ManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="family-list" element={<FamilyList role="representative" />} />
        <Route path="add-family" element={<AddFamily />} />
        <Route path="edit-family/:familyId/:memberId" element={<FamilyEdit />} />
      </Route>

       {/* User Dashboard */}
      <Route
        path="/dashboard/user"
        element={
          <ProtectedRoute roles={['user']}>
            <ManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="family-list" element={<FamilyList role="user" />} />
        <Route path="add-family" element={<AddFamily />} />
        <Route path="edit-family/:familyId/:memberId" element={<FamilyEdit />} />
      </Route>
    </Routes>
  );
}

export default App;
