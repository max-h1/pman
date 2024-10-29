import "./App.css";
import Entries from "./Components/Entries/Entries";
import Sidebar from "./Components/Sidebar/Sidebar";
import Searchbar from "./Components/Searchbar/Searchbar";
import AddDialog from "./Components/AddDialog/AddDialog";

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Searchbar />
        <Entries />
        <AddDialog />
      </div>
    </div>
  );
}

export default App;
