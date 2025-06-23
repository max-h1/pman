import Sidebar from './Sidebar/Sidebar';
import Entries from './Entries/Entries';
import Searchbar from './Searchbar/Searchbar';
import './Dashboard.css';

type Props = {};

function Dashboard({}: Props) {
	return (
		<div className="dash">
			<Sidebar />
			<div className="dash-content">
				<Entries />
			</div>
		</div>
	);
}

export default Dashboard;
