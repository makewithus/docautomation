import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Editor from "./pages/Editor";
import Documents from "./pages/Documents";

import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doc/:id" element={<Editor />} />
        <Route path="/documents" element={<Documents />} />
      </Routes>
    </div>
  );
}

export default App;