import axios from '../../../API/axios';
import React, { useState } from 'react';
import './Login.css';
import { useAuth } from '../../Hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { pbkdf2, B64toAB, ABtoB64, decryptAES, hdkf, importKey } from '../../../Utils/Encryption';

const Login: React.FC = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [usernameError, setUsernameError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loginError, setLoginError] = useState('');

	const { setAuth, setSymkey, setGlobalUsername } = useAuth(); // Access login from AuthContext
	const navigate = useNavigate();

	const Attemptlogin = async (username: string, password: string) => {
		setLoading(true);
		setLoginError('');

		var masterKey = await pbkdf2(password, username);
		var mph = await pbkdf2(masterKey, password);
		var stretchedMasterKey = await hdkf(masterKey);
		var mphStr = ABtoB64(mph);

		axios
			.post('/api/auth/login', { username, mph: mphStr }, { withCredentials: true })
			.then(async (response) => {
				if (response?.status === 200) {
					setAuth(true);
					let psk = B64toAB(response.data['psk']);
					let pskiv = B64toAB(response.data['pskiv']);
					let rawkey = await decryptAES(psk, masterKey, pskiv);
					console.log('Symkey:', rawkey);
					setSymkey(rawkey);
					console.log('Username: ', username);
					setGlobalUsername(username);
					console.log();
					navigate('/dashboard');
				}
			})
			.catch(() => {
				setLoginError('Login failed. Please check your credentials.');
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleLogin = () => {
		let valid = true;
		setUsernameError(false);
		setPasswordError(false);

		if (!username) {
			setUsernameError(true);
			valid = false;
		}
		if (!password) {
			setPasswordError(true);
			valid = false;
		}

		if (valid) {
			Attemptlogin(username, password);
		}
	};

	return (
		<section id="login-page">
			<form onSubmit={handleLogin}>
				<h2>Login</h2>

				<div className="input-group">
					<label htmlFor="username">Username</label>
					<input
						id="username"
						autoComplete="false"
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>

				{usernameError && <p className="error">Username is required.</p>}

				<div className="input-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				{passwordError && <p className="error">Password is required.</p>}
				<button
					type="submit"
					disabled={loading}
					onClick={handleLogin}>
					{loading ? 'Logging in...' : 'Login'}
				</button>
				{loginError && <p className="error">{loginError}</p>}
				<Link to="/register">Create Account</Link>
			</form>
		</section>
	);
};

export default Login;
