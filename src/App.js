import './App.css';

import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { Main } from './pages/Main'
import { Form } from './pages/Form';
import { FormValue } from './pages/FormValue';
import { Error } from './pages/Error';
import AuthProvider from "./hooks/AuthProvider";
import PrivateRoute from "./router/PrivateRoute";
import FormAnalysis from './pages/FormAnalysis';

function App() {
    return (
          <AuthProvider>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/form/:id' element={<Form />} />
              <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Main content={0} />} />
                  <Route path="/create" element={<Main content={1}/>} />
                  <Route path="/view" element={<Main content={2} />} />
                  <Route path="/analysis" element={<Main content={3} />} />
                  <Route path="/form/:id/edit" element={<Form />} />
                  <Route path="/form/:id/view" element={<FormValue />} />
                  <Route path="/form/:id/analysis" element={<FormAnalysis />} />
                  <Route path="/*" element={<Login />} />
              </Route>
            </Routes>
          </AuthProvider>
    )
  }

export default App;