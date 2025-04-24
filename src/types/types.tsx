import { AxiosResponse } from 'axios';

export interface ExcelFile {
	id: string;
	name: string;
	headers: string[];
	data: any[][];
	createdAt: string;
	lastUsed: string;
}

export interface SearchConfig {
	fileId: string;
	selectedColumn: number;
	searchValues: string[];
}

type Data<U, S> = {
	user: U | null;
	sheet: S | null;
};

export type ResponseReq<U, S> = {
	status: string;
	message: string;
	data: Data<U, S> | null;
	header?: string[];
	token?: string;
	error: { code: number; details: string[] } | null;
};

export interface User {
	id: string;
	name: string;
	email: string;
	excelFiles?: ExcelFile[];
	createdAt: Date;
	updatedAt: Date;
}

export type Response = AxiosResponse<ResponseReq<User, ExcelFile[]>>;
