import { ExcelFile, SearchConfig } from '../types/types';

const EXCEL_FILES_KEY = 'excelFiles';
const SEARCH_CONFIG_KEY = 'searchConfig';

export const StorageService = {
  saveExcelFile: (file: ExcelFile): void => {
    const files = StorageService.getExcelFiles();
    files.push(file);
    localStorage.setItem(EXCEL_FILES_KEY, JSON.stringify(files));
  },

  getExcelFiles: (): ExcelFile[] => {
    const filesJson = localStorage.getItem(EXCEL_FILES_KEY);
    return filesJson ? JSON.parse(filesJson) : [];
  },

  getExcelFile: (id: string): ExcelFile | undefined => {
    const files = StorageService.getExcelFiles();
    return files.find((file) => file.id === id);
  },

  updateExcelFileLastUsed: (id: string): void => {
    const files = StorageService.getExcelFiles();
    const fileIndex = files.findIndex((file) => file.id === id);
    if (fileIndex !== -1) {
      files[fileIndex].lastUsed = new Date().toISOString();
      localStorage.setItem(EXCEL_FILES_KEY, JSON.stringify(files));
    }
  },

  deleteExcelFile: (id: string): void => {
    const files = StorageService.getExcelFiles();
    const updatedFiles = files.filter((file) => file.id !== id);
    localStorage.setItem(EXCEL_FILES_KEY, JSON.stringify(updatedFiles));
  },

  saveSearchConfig: (config: SearchConfig | null): void => {
    localStorage.setItem(SEARCH_CONFIG_KEY, JSON.stringify(config));
  },

  getSearchConfig: (): SearchConfig => {
    const configJson = localStorage.getItem(SEARCH_CONFIG_KEY);
    return configJson ? JSON.parse(configJson) : null;
  },
};
