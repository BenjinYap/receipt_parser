import './App.css'
import routes from "./routes.jsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter(routes);

function App() {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
