import Arquivos from '@/pages/planilhas/arquivos';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_pathlessLayout/planilhas/arquivos')({
  component: Arquivos,
});
