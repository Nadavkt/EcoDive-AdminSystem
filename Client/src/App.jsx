import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Pages/Login';
import Layout from './Components/Layout';
import Calendar from './Pages/Calendar';
import TeamManagement from './Pages/TeamManagment';
import UsersInfo from './Pages/UsersInfo';
import BussinesesInfo from './Pages/BusinessesInfo';
import AddUser from './Pages/AddUser';
import AddBusiness from './Pages/AddBusiness';
import Dashboard from './Pages/Dashboard';


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
      </Routes>
    </BrowserRouter>
  )
}

export default App
