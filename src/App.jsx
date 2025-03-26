import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from 'react';
import CordinadorPage from "./pages/Cordinador";
import Login from "./pages/RegisterAndLogin";
import ProtectedRoute from "./Services/ProtedRoutes"
import MainCoordinador from './MainCoordinador'
function App() {


  return (  
  <Router>
     <Routes>
         <Route path="/" element={<Login></Login>} /> 
        {/*  <Route path="/cordinador" element={<CordinadorPage></CordinadorPage>} />

         <Route path="/" element={<CordinadorPage></CordinadorPage>} />  */}

<Route
          path="/c/*"
          element={
            <ProtectedRoute allowedRoles={'coordinador'}>
           <Suspense fallback={"cargando........"}>
                <MainCoordinador>
                  <Routes>
                     <Route path="u" element={<CordinadorPage></CordinadorPage>} />
                  </Routes>

                </MainCoordinador>
              </Suspense>
            </ProtectedRoute>
          }
        />



     </Routes>

  </Router>
  )
}

export default App
