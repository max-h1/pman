import "./App.css";
import Entries from "./Components/Entries/Entries";
import Sidebar from "./Components/Sidebar/Sidebar";

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
