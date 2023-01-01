import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { Home } from "./Home";
import { Editor } from "./components/editor";

const queryClient = new QueryClient();

function App() {
  return <Editor />;
}

export default App;
