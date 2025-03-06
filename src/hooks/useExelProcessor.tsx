import { useEffect, useState } from 'react';
import api from '../api/axios-config';
import { ExcelFile, SearchConfig } from '../types/types';

const useExcelProcessor = () => {
	const [files, setFiles] = useState<ExcelFile[]>([]);
	const [activeFile, setActiveFile] = useState<ExcelFile | null>(null);
	const [searchConfig, setSearchConfig] = useState<SearchConfig | null>(null);
	const [searchResults, setSearchResults] = useState<any[][]>([]);
	const [headers, setHeaders] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		fetchFiles();
	}, []);

	const fetchFiles = async () => {
		setIsLoading(true);
		try {
			const response = await api.get('files');
			setFiles(response.data);
		} catch (error) {
			console.error('Error fetching files:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFileUpload = async (file: File) => {
		setIsLoading(true);

		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await api.post(`upload`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			const newFile = response.data;
			setFiles((prevFiles) => [...prevFiles, newFile]);
		} catch (error) {
			console.error('Error uploading file:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFileSelect = async (fileId: string) => {
		setIsLoading(true);

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
				const response = await api.get(`files/${fileId}/headers`);
				setHeaders(response.data);
			}
		} catch (error) {
			console.error('Error selecting file:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFileStop = () => {
		setActiveFile(null);
		setSearchConfig(null);
		setSearchResults([]);
		setHeaders([]);
	};

	const handleFileDelete = async (fileId: string) => {
		setIsLoading(true);

		try {
			await api.delete(`files/${fileId}`);
			setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
			if (activeFile?.id === fileId) {
				handleFileStop();
			}
		} catch (error) {
			console.error('Error deleting file:', error);
		} finally {
			setIsLoading(false);
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
		setIsLoading(true);
		if (!activeFile || !searchConfig) return;

		try {
			const response = await api.post(`search`, {
				fileId: activeFile.id,
				columnIndex: searchConfig.selectedColumn,
				searchValues: searchConfig.searchValues,
			});

			setSearchResults(response.data.searchResults);
		} catch (error) {
			console.error('Error performing search:', error);
		} finally {
			setIsLoading(false);
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
		isLoading,
	};
};

export default useExcelProcessor;
