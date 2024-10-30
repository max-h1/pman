import "./App.css";
import Entries from "./Components/Entries/Entries";
import Sidebar from "./Components/Sidebar/Sidebar";
import Searchbar from "./Components/Searchbar/Searchbar";
import NewEntryModal from "./Components/Modals/NewEntryModal/NewEntryModal";

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Entries />
        {/* <NewEntryModal /> */}
      </div>
    </div>
  );
}

export default App;
