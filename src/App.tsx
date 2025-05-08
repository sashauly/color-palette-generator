import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useMediaQuery } from "@uidotdev/usehooks";

function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const toasterPosition = isMobile ? "top-center" : "bottom-right";
  return (
    <Provider store={store}>
      <Toaster position={toasterPosition} />
      <BrowserRouter basename="/color-palette-generator/">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
