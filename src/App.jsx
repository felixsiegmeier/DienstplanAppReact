import './App.css';
import React from 'react';
import DoctorsPage from './pages/Doctors/doctorspage';
import WishPage from './pages/Wish/wishpage';
import LandingPage from './pages/Landing/landingpage';
import PlanPage from './pages/Plan/planpage';
import LoginPage from './pages/Login/loginpage';

function App() {
// Pseudo-routing with state of the displayed page.
const [page, setPage] = React.useState("loginPage")
// Id of the selected plan gets passed to the pages
const [planId, setPlanId] = React.useState(false)

      switch(page){
        case "loginPage":{
          return <LoginPage setPage={setPage} />
        }
        case "doctorsPage":{
          // This page lists all doctors with their individual attributes like clinics and duty-lines
          return <DoctorsPage  setPage={setPage}/>
        }
        case "wishPage":{
          // plan-specific page with all duty-wishes. These can only be added/ changed/ deleted here
          return planId && <WishPage planId={planId} setPage={setPage}/>
        }
        case "planPage":{
          // plan-page with Table-view of the plan. Plan can get filled here (manually or automatically)
          return <PlanPage setPage={setPage} planId={planId}/>
        }
        default:{
          // default page after login. Other pages can be reached from here
          return <LandingPage setPage={setPage} setPlanId={setPlanId}/>
        }
      }

}

export default App;
