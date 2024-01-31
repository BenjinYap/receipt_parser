// import OrderLayout from "./pages/order/OrderLayout.tsx";
// import Featured from "./pages/order/featured/Featured.tsx";
import Layout from "./Layout.tsx";
import Home from "./Pages/Home/Home";

const routes = [
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: "",
        element: <Home/>,
      },
      // {
      //   path: "/order",
      //   element: <OrderLayout/>,
      //   children: [
      //     {
      //       path: "",
      //       element: <Featured/>,
      //     },
      //   ],
      // }
    ],
  },
];

export default routes;