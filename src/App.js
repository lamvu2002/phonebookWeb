import Register from "./components/Register";
import Login from "./components/Login";

import Layout from "./components/Layout";
import Admin from "./components/Admin";
import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";

import RequireAuth from "./components/RequireAuth";
import { Routes, Route } from "react-router-dom";
import PhonebookForUser from "./components/PhonebookForUser";

const ROLES = {
  User: 2001,
  Admin: 5150,
  Client: 2002,
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        {/* we want to protect these routes */}
        <Route
          element={<RequireAuth allowedRoles={[ROLES.User]} ROLES={ROLES} />}
        >
          <Route path="/" element={<PhonebookForUser />} />
        </Route>

        <Route
          element={<RequireAuth allowedRoles={[ROLES.Admin]} ROLES={ROLES} />}
        >
          <Route path="admin" element={<Admin />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
