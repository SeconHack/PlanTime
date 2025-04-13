import Login from './pages/Login';
import MainPage from './pages/MainPage'
import PersonalData from './pages/PersonalData';
import Registration from './pages/Registration';
import AdminPage from "./pages/AdminPage.tsx";
import HRdepartmentPage from "./pages/HRdepartmentPage";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/Registration"
                    element={<Registration />}
                />

                <Route
                    path="/Login"
                    element={<Login />}
                />

                <Route
                    path="/PersonalData"
                    element={<PersonalData/>}
                />
                <Route
                    path="*"
                    element={<Navigate to="/Login" />}
                />

                <Route
                    path="/MainPage"
                    element={<MainPage/>}
                />

                <Route
                    path="/AdminPage"
                    element={<AdminPage/>}
                />

                <Route
                    path="/HRdepartmentPage"
                    element={<HRdepartmentPage/>}
                />
                {/* <Route
                    path='/Posts/:id'
                    element={<Post_inside/>}    
                />

                <Route
                    path='/Posts'
                    element={<Posts/>}
                /> */}

            </Routes>
        </Router>
  )
}

export default App
