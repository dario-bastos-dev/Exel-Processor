import Pesquisa from '@/pages/planilhas/pesquisa';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_pathlessLayout/planilhas/pesquisa')({
  component: Pesquisa,
});
