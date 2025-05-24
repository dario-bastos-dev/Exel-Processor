'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { File, Loader2, Upload, X } from 'lucide-react';
import React, { useState, useRef, FormEvent } from 'react';
import { toast } from 'sonner';

interface FileDropzoneProps {
  onFileSubmit: (file: File) => Promise<void>;
  acceptedFileTypes?: string;
  maxSize?: number; // em bytes
  className?: string;
  buttonText?: string;
  isSubmitting?: boolean;
}

export function FileDropzone({
  onFileSubmit,
  acceptedFileTypes = '.xlsx,.xls,.csv',
  maxSize = 10485760, // 10MB por padrão
  className,
  buttonText = 'Enviar arquivo',
  isSubmitting = false,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const validateFile = (file: File) => {
    // Verificar tipo de arquivo
    const fileType = file.name.split('.').pop()?.toLowerCase() || '';
    const isAcceptedType = acceptedFileTypes
      .split(',')
      .some(
        (type) =>
          type.includes(fileType) ||
          type === '.*' ||
          (type.startsWith('.') && file.name.endsWith(type)),
      );

    if (!isAcceptedType) {
      toast.error('Tipo de arquivo não suportado', {
        description: `Por favor selecione um arquivo ${acceptedFileTypes}`,
      });
      return false;
    }

    // Verificar tamanho
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande', {
        description: `O arquivo deve ter menos de ${maxSize / 1048576}MB`,
      });
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Nenhum arquivo selecionado', {
        description: 'Por favor selecione um arquivo antes de enviar.',
      });
      return;
    }

    try {
      // Iniciar simulação de progresso
      const toastId = toast.loading('Enviando arquivo...');
      simulateProgressStart();

      // Enviar arquivo
      await onFileSubmit(selectedFile);

      // Completar progresso após envio bem-sucedido
      setUploadProgress(100);

      toast.success('Arquivo enviado com sucesso', {
        description: `${selectedFile.name} foi processado`,
        id: toastId,
      });

      setTimeout(() => {
        toast.dismiss(toastId);
        setSelectedFile(null);
        setUploadProgress(0);
      }, 2000);
    } catch (error) {
      toast.error('Erro ao enviar arquivo', {
        description:
          error instanceof Error
            ? error.message
            : 'Ocorreu um erro desconhecido',
      });

      setUploadProgress(0);
    }
  };

  const simulateProgressStart = () => {
    setUploadProgress(0);

    // Simular progresso até 90% (os últimos 10% serão preenchidos após o envio real)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 300);

    // Limpar intervalo após 10 segundos se algo der errado
    setTimeout(() => clearInterval(interval), 10000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <form onSubmit={handleSubmit} className={cn('w-full space-y-4', className)}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={acceptedFileTypes}
        onChange={handleFileInputChange}
      />

      {!selectedFile ? (
        <Card
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          )}
          onClick={handleButtonClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          tabIndex={0}
          role="button"
          aria-label="Upload file"
        >
          <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Upload className="h-10 w-10" />
            <div className="flex flex-col gap-1">
              <p className="text-lg font-medium">
                Arraste e solte seu arquivo aqui ou clique para buscar
              </p>
              <p className="text-sm">
                Suporta {acceptedFileTypes.replace(/\./g, '')} até{' '}
                {formatFileSize(maxSize)}
              </p>
            </div>
            <Button
              variant="secondary"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleButtonClick();
              }}
            >
              Selecionar arquivo
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="rounded-lg p-6 border">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <File className="h-8 w-8 text-primary" />
                <div className="flex flex-col">
                  <p className="font-medium truncate max-w-[250px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleRemoveFile}
                disabled={isSubmitting}
                type="button"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Remover arquivo</span>
              </Button>
            </div>

            {uploadProgress > 0 && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2 w-full" />
                <p className="text-sm text-muted-foreground text-right">
                  {uploadProgress.toFixed(0)}%
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!selectedFile || isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </div>
    </form>
  );
}
