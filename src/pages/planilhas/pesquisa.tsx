import Loader from '@/components/loader';
import SearchResults from '@/components/search-results';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import useExcelProcessor from '@/hooks/useExelProcessor';
import getRealName from '@/utils/name-file';
import { FileSpreadsheet } from 'lucide-react';
import { ChangeEvent } from 'react';

const Pesquisa = () => {
  const {
    files,
    activeFile,
    searchConfig,
    searchResults,
    headers,
    isLoading,
    handleFileSelect,
    handleFileStop,
    handleSearchValuesChange,
    handleColumnSelect,
    performSearch,
  } = useExcelProcessor();

  const onSearchValuesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const values = event.target.value
      .split('\n')
      .filter((v) => v.trim() !== '');
    handleSearchValuesChange(values);
  };
  return (
    <>
      {isLoading && <Loader />}
      <section className="grid grid-rows-2 p-4">
        <div id="arquivos-salvos" className="w-full flex flex-col gap-4">
          <h2 className="text-3xl">Planilhas salvas</h2>
          <div className="flex flex-wrap gap-4 md:h-56">
            {files.map((file) => (
              <Card key={file.id} className="w-[220px] text-center border-none">
                <CardHeader>{getRealName(file.name)}</CardHeader>
                <CardContent className="flex justify-center">
                  <FileSpreadsheet size={66} color="#1F6E42" />
                </CardContent>
                <CardFooter className="flex justify-center">
                  {activeFile?.id === file.id ? (
                    <button
                      onClick={handleFileStop}
                      className="w-56 bg-yellow-500 text-white px-3 py-1 rounded-md text-sm mr-2 hover:bg-yellow-600 transition duration-300 hover:cursor-pointer"
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFileSelect(file.id)}
                      className="w-56 bg-green-500 text-white px-3 py-1 rounded-md text-sm mr-2 hover:bg-green-600 transition duration-300 hover:cursor-pointer"
                    >
                      Use
                    </button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <div id="pesquisar">
          <div className="mb-8 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Pesquisar
            </h2>
            <select
              value={searchConfig?.selectedColumn ?? ''}
              onChange={(e) => handleColumnSelect(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value="" disabled>
                Selecione uma coluna
              </option>
              {headers.map((header, index) => (
                <option key={index} value={index}>
                  {header}
                </option>
              ))}
            </select>
            <textarea
              value={searchConfig?.searchValues?.join('\n') ?? ''}
              onChange={onSearchValuesChange}
              className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="Enter search values, one per line"
            />
            <button
              onClick={performSearch}
              className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
            >
              Buscar
            </button>
          </div>
        </div>

        {searchResults.length > 0 && (
          <SearchResults searchResults={searchResults} headers={headers} />
        )}
      </section>
    </>
  );
};

export default Pesquisa;
