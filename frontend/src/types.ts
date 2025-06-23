export interface Entry {
	id: number;
	service: string;
	user: string;
	password: string;
	iv: string;
}

export const APIURL = 'http://localhost:5001';
