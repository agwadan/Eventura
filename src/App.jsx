import { useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./screens/Home";
import Login from "./screens/Login";
import SignUp from "./screens/Signup";
import EventDetail from "./screens/EventDetail";
import EventList from "./screens/EventList";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/event-list" element={<EventList />} />
          <Route path="/event-detail/:eventId" element={<EventDetail />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
