import React, { createContext, useState, ReactNode, useContext, Dispatch } from 'react';

// Define a type for the context value
interface AuthContextType {
	auth: boolean;
	symkey?: Uint8Array;
	username?: string;
	setAuth: Dispatch<boolean>;
	setSymkey: Dispatch<Uint8Array | undefined>;
	setGlobalUsername: Dispatch<string | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [auth, setAuth] = useState<boolean>(false);
	const [symkey, setSymkey] = useState<Uint8Array>();
	const [username, setGlobalUsername] = useState<string>();

	return (
		<AuthContext.Provider value={{ auth, setAuth, symkey, setSymkey, username, setGlobalUsername }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to access the AuthContext with a type guard
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export default AuthProvider;
