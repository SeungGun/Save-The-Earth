import { HashRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Main from "./Main";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main/>} />
      </Routes>
    </HashRouter>
  //   <div className="App">
  //   <Main/>
  // </div>
  );
}

export default App;
