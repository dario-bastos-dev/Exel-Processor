import { createLazyFileRoute } from '@tanstack/react-router';
import ExcelProcessor from '../components/exel-processor';

export const Route = createLazyFileRoute('/home')({
  component: ExcelProcessor,
});
