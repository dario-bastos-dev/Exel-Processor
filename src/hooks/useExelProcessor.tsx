import axios from 'axios';
import { useEffect, useState } from 'react';
import { ExcelFile, SearchConfig } from '../types/types';

const API_URL = 'http://localhost:3000';

export const useExcelProcessor = () => {
	const [files, setFiles] = useState<ExcelFile[]>([]);
	const [activeFile, setActiveFile] = useState<ExcelFile | null>(null);
	const [searchConfig, setSearchConfig] = useState<SearchConfig | null>(null);
	const [searchResults, setSearchResults] = useState<any[][]>([]);
	const [headers, setHeaders] = useState<string[]>([]);

	useEffect(() => {
		fetchFiles();
	}, []);

	const fetchFiles = async () => {
		try {
			const response = await axios.get(`${API_URL}/files`);
			setFiles(response.data);
		} catch (error) {
			console.error('Error fetching files:', error);
		}
	};

	const handleFileUpload = async (file: File) => {
		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await axios.post(`${API_URL}/upload`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			const newFile = response.data;
			setFiles((prevFiles) => [...prevFiles, newFile]);
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	};

	const handleFileSelect = async (fileId: string) => {
		try {
			const file = files.find((f) => f.id === fileId);
			if (file) {
				setActiveFile(file);
				// Inicialize searchConfig com a primeira coluna selecionada
				setSearchConfig({
					fileId: file.id,
					selectedColumn: 0,
					searchValues: [],
				});
				setSearchResults([]);

				// Buscar os cabeçalhos do arquivo
				const response = await axios.get(`${API_URL}/files/${fileId}/headers`);
				setHeaders(response.data);
			}
		} catch (error) {
			console.error('Error selecting file:', error);
		}
	};

	const handleFileStop = () => {
		setActiveFile(null);
		setSearchConfig(null);
		setSearchResults([]);
		setHeaders([]);
	};

	const handleFileDelete = async (fileId: string) => {
		try {
			await axios.delete(`${API_URL}/files/${fileId}`);
			setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
			if (activeFile?.id === fileId) {
				handleFileStop();
			}
		} catch (error) {
			console.error('Error deleting file:', error);
		}
	};

	const handleColumnSelect = (columnIndex: number) => {
		if (activeFile && searchConfig) {
			setSearchConfig({
				...searchConfig,
				selectedColumn: columnIndex,
			});
		}
	};

	const handleSearchValuesChange = (values: string[]) => {
		if (searchConfig) {
			setSearchConfig({
				...searchConfig,
				searchValues: values,
			});
		}
	};

	const performSearch = async () => {
		if (!activeFile || !searchConfig) return;

		try {
			const response = await axios.post(`${API_URL}/search`, {
				fileId: activeFile.id,
				columnIndex: searchConfig.selectedColumn,
				searchValues: searchConfig.searchValues,
			});

			setSearchResults(response.data.searchResults);
		} catch (error) {
			console.error('Error performing search:', error);
		}
	};

	return {
		files,
		activeFile,
		searchConfig,
		searchResults,
		headers,
		handleFileUpload,
		handleFileSelect,
		handleFileStop,
		handleFileDelete,
		handleColumnSelect,
		handleSearchValuesChange,
		performSearch,
	};
};
