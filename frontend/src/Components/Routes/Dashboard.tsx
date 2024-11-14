import Sidebar from "../Sidebar/Sidebar";
import Entries from "../Entries/Entries";

type Props = {};

function Dashboard({}: Props) {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Entries />
      </div>
    </div>
  );
}

export default Dashboard;
