import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Register.css';
import { Link } from 'react-router-dom';
import axios from '../../../API/axios';
import {
	ABtoB64,
	B64toAB,
	encryptAES,
	generateSymKey,
	hdkf,
	pbkdf2,
	strtoAB,
} from '../../../Utils/Encryption';
import { AxiosError } from 'axios';

const REGISTER_URL = '/api/auth/register';

const USER_REGEX = /^[a-zA-Z][a-z-A-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register: React.FC = () => {
	const userRef = useRef<HTMLInputElement>(null);
	const errRef = useRef<HTMLParagraphElement>(null);

	const [user, setUser] = useState('');
	const [validUser, setValidUser] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

	const [pwd, setPwd] = useState('');
	const [validPwd, setValidPwd] = useState(false);
	const [pwdFocus, setPwdFocus] = useState(false);

	const [matchPwd, setMatchPwd] = useState('');
	const [validMatch, setValidMatch] = useState(false);
	const [matchFocus, setMatchFocus] = useState(false);

	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (userRef.current) {
			userRef.current.focus();
		}
	}, []);

	useEffect(() => {
		const result = USER_REGEX.test(user);
		setValidUser(result);
	}, [user]);

	useEffect(() => {
		const result = PWD_REGEX.test(pwd);
		setValidPwd(result);
		const match = pwd === matchPwd;
		setValidMatch(match);
	}, [pwd, matchPwd]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const valid1 = USER_REGEX.test(user);
		const valid2 = PWD_REGEX.test(pwd);

		if (!valid1 || !valid2) {
			setErrMsg('Invalid entry');
			return;
		}

		let masterKey = await pbkdf2(pwd, user);
		let stretchedMasterKey = await hdkf(masterKey);
		let mph = await pbkdf2(masterKey, pwd);
		let symkey = await generateSymKey();

		const { encrypted: psk, iv: pskiv } = await encryptAES(symkey, masterKey);
		console.log(pskiv);
		let temp = ABtoB64(pskiv);
		console.log(temp);
		console.log(B64toAB(temp));

		try {
			const response = await axios.post(
				REGISTER_URL,
				JSON.stringify({
					user: user,
					psk: ABtoB64(psk),
					pskiv: ABtoB64(pskiv),
					mph: ABtoB64(mph),
				})
			);
			setSuccess(response.status === 200);
		} catch (error) {
			const aError = error as AxiosError;
			if (!aError?.response) {
				setErrMsg('No server response');
				console.log(aError);
			} else if (aError.response?.status === 409) {
				setErrMsg('Username has already been taken');
			} else {
				setErrMsg('Registration failed');
			}
		}
	};

	return (
		<>
			{success ? (
				<section>
					<h1>Success!</h1>
					<Link to="/login" />
				</section>
			) : (
				<section>
					{errMsg && <p ref={errRef}>{errMsg}</p>}
					<h1>Register</h1>
					<form onSubmit={handleSubmit}>
						<label htmlFor="username">
							Username:
							{user && validUser && (
								<span>
									<FontAwesomeIcon icon={faCheck} />
								</span>
							)}
							{!(validUser || !user) && (
								<span>
									<FontAwesomeIcon icon={faTimes} />
								</span>
							)}
						</label>
						<input
							type="text"
							id="username"
							ref={userRef}
							autoComplete="off"
							onChange={(e) => setUser(e.target.value)}
							required
							onFocus={() => setUserFocus(true)}
							onBlur={() => setUserFocus(false)}
						/>
						{userFocus && user && !validUser && (
							<p>
								<FontAwesomeIcon icon={faInfoCircle} />
								4 to 24 characters. <br />
								Must begin with a letter. <br />
								Letters, Numbers, Underscores, Hyphens allowed.
							</p>
						)}
						<label htmlFor="password">
							Password:
							{pwd && validPwd && (
								<span>
									<FontAwesomeIcon icon={faCheck} />
								</span>
							)}
							{!(validPwd || !pwd) && (
								<span>
									<FontAwesomeIcon icon={faTimes} />
								</span>
							)}
						</label>
						<input
							type="password"
							id="password"
							onChange={(e) => setPwd(e.target.value)}
							required
							onFocus={() => setPwdFocus(true)}
							onBlur={() => setPwdFocus(false)}
						/>
						{pwdFocus && pwd && !validPwd && (
							<p>
								<FontAwesomeIcon icon={faInfoCircle} />
								8 to 24 characters. <br />
								Must include uppercase and lowercase letters, a number, and a special character.{' '}
								<br />
								Allowed special characters: !@#$%
							</p>
						)}
						<label htmlFor="match_password">
							Confirm Password:
							{matchPwd && validMatch && (
								<span>
									<FontAwesomeIcon icon={faCheck} />
								</span>
							)}
							{!(validMatch || !matchPwd) && (
								<span>
									<FontAwesomeIcon icon={faTimes} />
								</span>
							)}
						</label>
						<input
							type="password"
							id="match_password"
							onChange={(e) => setMatchPwd(e.target.value)}
							required
							onFocus={() => setMatchFocus(true)}
							onBlur={() => setMatchFocus(false)}
						/>
						{matchFocus && matchPwd && !validMatch && (
							<p>
								<FontAwesomeIcon icon={faInfoCircle} />
								Must match the first password input field.
							</p>
						)}
						<button disabled={!validUser || !validPwd || !validMatch ? true : false}>
							Sign Up
						</button>
						<p>Already have an account?</p>
						<Link to="/login">Login</Link>
					</form>
				</section>
			)}
		</>
	);
};

export default Register;
