import './App.css';
import Home from './Pages/Home.jsx';
import Analyze from './Pages/Analyze.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

function App() {
    // initialize a browser router
    const router = createBrowserRouter([
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/analyze",
        element: <Analyze />,
      },
    ])
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
