import { FC, useRef } from 'react';

type SearchResultsProps = {
  searchResults: any[][];
  headers: string[];
};

const SearchResults: FC<SearchResultsProps> = ({ searchResults, headers }) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const copyTableToClipboard = async () => {
    if (tableRef.current) {
      try {
        const text = tableRef.current.innerText;
        await navigator.clipboard.writeText(text);
        alert('Resultados copiados para a área de transferência!');
      } catch (err) {
        console.error('Falha ao copiar', err);
        alert(
          'Não foi possível copiar os resultados. Por favor, tente novamente.',
        );
      }
    }
  };
  return (
    <div className=" overflow-x-hidden flex flex-col justify-start items-start">
      <div className="w-[100%] bg-white shadow-md rounded-lg p-6 ">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Search Results
        </h2>
        <p className="mb-4 text-gray-600">
          Found {searchResults.length} matches
        </p>
        <div className="overflow-auto max-h-[500px]">
          <table ref={tableRef} className="w-full border-collapse table-auto">
            <thead className="sticky top-0 bg-gray-100 shadow-sm">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700"></th>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {searchResults.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td
                    key={rowIndex}
                    className="border border-gray-300 px-4 py-2 text-sm text-gray-700 whitespace-nowrap"
                  >
                    {rowIndex + 1}
                  </td>
                  {row.map((cell, cellIndex) =>
                    cell ? (
                      <td
                        key={cellIndex}
                        className="border border-gray-300 px-4 py-2 text-sm text-gray-700 whitespace-nowrap"
                      >
                        {cell}
                      </td>
                    ) : null,
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={copyTableToClipboard}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Copiar Resultados
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
