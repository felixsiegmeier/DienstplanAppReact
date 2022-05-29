import React from 'react';
import DoctorList from './components/doctors/DoctorList';
import Plans from './components/plans/Plans';
import NewPlan from './components/plan/NewPlan';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Header from './components/header/Header';
import WishMatrix from "./components/wish/WishMatrix"
import Plan from './components/plan/Plan';


function App() {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/" element={<Plans />} />
        <Route path="/newplan" element={<NewPlan />} />
        <Route path="/wishmatrix/:planId" element={<WishMatrix />} />
        <Route path="/plan/:planId" element={<Plan />} />
    </Routes>
</BrowserRouter>
  );
}

export default App;
