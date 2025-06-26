import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Pages/Login';
import Layout from './Components/Layout';
import Dashboard from './Pages/Dashboard';
import EditProfile from './Pages/Profile/EditProfile';
import ProtectedRoute from './Components/ProtectedRoute';
import Calendar from './Pages/Events/Calendar';
import TeamManagement from './Pages/Team/TeamManagement';
import AddTeamMember from './Pages/Team/AddTeamMember';
import UsersInfo from './Pages/Users/UsersInfo';
import AddUser from './Pages/Users/AddUser';
import BussinesesInfo from './Pages/DiveClubs/BusinessesInfo';
import AddBusiness from './Pages/DiveClubs/AddBusiness';




function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
        <Route path="/team" element={<Layout><TeamManagement /></Layout>} />
        <Route path="/users" element={<Layout><UsersInfo /></Layout>} />
        <Route path="/businesses" element={<Layout><BussinesesInfo /></Layout>} />
        <Route path="/add-user" element={<Layout><AddUser /></Layout>} />
        <Route path="/add-business" element={<Layout><AddBusiness /></Layout>} />
        <Route path="/edit-profile" element={<Layout><EditProfile /></Layout>} />
        <Route 
          path="/add-team-member" 
          element={
            <Layout>
              <ProtectedRoute allowedRoles={['Admin']}>
                <AddTeamMember />
              </ProtectedRoute>
            </Layout>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
