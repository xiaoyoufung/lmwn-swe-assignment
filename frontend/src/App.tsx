import { RouterProvider, createHashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootLayout from './pages/Root';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Reports from './pages/Reports';


function App() {
  const queryClient = new QueryClient();

  const router = createHashRouter([
    {
      path: "/",
      element: <RootLayout />,
      children:[
        {
          path: "/",
          element: <Dashboard />
        },
        {
          path: "/orders",
          element: <Orders />
        },
        {
          path: "/reports",
          element: <Reports />
        }
      ]
    }
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider >
  );
}

export default App;