// src/hooks/useExcelProcessor.ts
import { useState, useEffect } from 'react';
import * as ExcelJS from 'exceljs';
import { ExcelFile, SearchConfig } from '../types/types';
import { StorageService } from '../services/storage-service';

export const useExcelProcessor = () => {
  const [files, setFiles] = useState<ExcelFile[]>([]);
  const [activeFile, setActiveFile] = useState<ExcelFile | null>(null);
  const [searchConfig, setSearchConfig] = useState<SearchConfig | null>(null);
  const [searchResults, setSearchResults] = useState<any[][]>([]);

  useEffect(() => {
    const storedFiles = StorageService.getExcelFiles();
    setFiles(storedFiles);
    const storedConfig = StorageService.getSearchConfig();
    if (storedConfig) {
      setSearchConfig(storedConfig);
      setActiveFile(StorageService.getExcelFile(storedConfig.fileId) || null);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());

    const worksheet = workbook.worksheets[0];
    const headers: string[] = [];
    const data: any[][] = [];

    worksheet.eachRow((row, rowNumber) => {
      const rowData: any[] = [];
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (rowNumber === 1) {
          headers.push(cell.text || `Column ${colNumber}`);
        } else {
          rowData.push(cell.text);
        }
      });
      if (rowNumber > 1) {
        data.push(rowData);
      }
    });

    const newFile: ExcelFile = {
      id: Date.now().toString(),
      name: file.name,
      headers,
      data,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    };

    StorageService.saveExcelFile(newFile);
    setFiles(prevFiles => [...prevFiles, newFile]);
  };

  const handleFileSelect = (fileId: string) => {
    const file = StorageService.getExcelFile(fileId);
    if (file) {
      setActiveFile(file);
      StorageService.updateExcelFileLastUsed(fileId);
      setSearchConfig(null);
      setSearchResults([]);
    }
  };

  const handleFileStop = () => {
    setActiveFile(null);
    setSearchConfig(null);
    setSearchResults([]);
    StorageService.saveSearchConfig(null);
  };

  const handleFileDelete = (fileId: string) => {
    StorageService.deleteExcelFile(fileId);
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    
    if (activeFile?.id === fileId) {
      handleFileStop();
    }
  };

  const handleColumnSelect = (columnIndex: number) => {
    if (activeFile) {
      const newConfig: SearchConfig = {
        fileId: activeFile.id,
        selectedColumn: columnIndex,
        searchValues: [],
      };
      setSearchConfig(newConfig);
      StorageService.saveSearchConfig(newConfig);
    }
  };

  const handleSearchValuesChange = (values: string[]) => {
    if (searchConfig) {
      const newConfig = { ...searchConfig, searchValues: values };
      setSearchConfig(newConfig);
      StorageService.saveSearchConfig(newConfig);
    }
  };

  const performSearch = () => {
    if (!activeFile || !searchConfig) return;

    const results = activeFile.data.filter(row => {
      const cellValue = row[searchConfig.selectedColumn]?.toString().trim().toLowerCase();
      return searchConfig.searchValues.some(searchValue => 
        cellValue === searchValue.trim().toLowerCase()
      );
    });

    setSearchResults(results);
  };

  return {
    files,
    activeFile,
    searchConfig,
    searchResults,
    handleFileUpload,
    handleFileSelect,
    handleFileStop,
    handleFileDelete,
    handleColumnSelect,
    handleSearchValuesChange,
    performSearch,
  };
};
