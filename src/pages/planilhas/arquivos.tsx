import { FileDropzone } from '@/components/file-drop';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import useExcelProcessor from '@/hooks/useExelProcessor';
import getRealName from '@/utils/name-file';
import { FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

const Arquivos = () => {
  const { files, handleFileDelete, handleFileUpload, isLoading } =
    useExcelProcessor();

  const handleFileSubmit = async (file: File): Promise<void> => {
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDelete = async (fileId: string): Promise<void> => {
    try {
      await handleFileDelete(fileId);
      toast.success('Arquivo deletado com sucesso!');
    } catch (error) {
      toast.error('Erro ao deletar o arquivo.');
    }
    setTimeout(() => {
      toast.dismiss();
    }, 2000);
  };

  return (
    <section className="grid grid-rows-2 gap-4 p-4">
      <div id="enviar-arquivo">
        <h2 className="text-3xl mb-2.5">Enviar arquivo</h2>
        <Toaster position="top-center" />
        <FileDropzone
          onFileSubmit={handleFileSubmit}
          isSubmitting={isLoading}
          acceptedFileTypes=".xlsx,.xls,.csv"
          maxSize={20971520} // 20MB
          buttonText="Processar planilha"
        />
      </div>
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
                <button
                  onClick={() => handleDelete(file.id)}
                  className="w-56 bg-red-800 text-white px-3 py-1 rounded-md text-sm hover:bg-red-900 transition duration-300 hover:cursor-pointer"
                >
                  Deletar
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Arquivos;
