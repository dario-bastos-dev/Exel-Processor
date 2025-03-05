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
