import './Sidebar.css';
import { useAuth } from '../../../Hooks/useAuth';
import { RiShieldKeyholeFill } from 'react-icons/ri';

function Sidebar() {
	const { username } = useAuth();
	return (
		<div className="sidebar">
			<a
				className="profile"
				href="#">
				<div className="profile-icon">
					<b>{username !== undefined ? username.charAt(0).toUpperCase() : 'G'}</b>
				</div>
				<p>
					{username !== undefined ? username.charAt(0).toUpperCase() + username.slice(1) : 'Guest'}
				</p>
			</a>
			{/* <button>All Entries</button>
			<button>Starred</button> */}
			Vaults
			<button className="vault-button">
				<RiShieldKeyholeFill className="vault-icon" />
				Personal
			</button>
			<button className="vault-button">
				<RiShieldKeyholeFill className="vault-icon" />
				Work
			</button>
			<button className="vault-button">
				<RiShieldKeyholeFill className="vault-icon" />
				Uni
			</button>
		</div>
	);
}

export default Sidebar;
