// import Home from "./components/Home";

// function App() {
//   return <Home />;
// }

// export default App;


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import TodoDetail from "./components/TodoDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo/:id" element={<TodoDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
