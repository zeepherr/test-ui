import { RouterProvider } from "react-router";
import { AuthBootstrap } from "./components/auth/Auth.bootstrap";
import { GlobalLoadingBar } from "./components/GlobalLoading";
import { Toaster } from "./components/ui/sonner";
import router from "./routes/app.route";

function App() {
  return (
    <>
      <Toaster />
      <GlobalLoadingBar />
      <AuthBootstrap>
        <RouterProvider router={router} />
      </AuthBootstrap>
    </>
  );
}

export default App;
