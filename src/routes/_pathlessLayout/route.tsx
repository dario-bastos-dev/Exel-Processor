import Layout from '@/pages/layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_pathlessLayout')({
  component: Layout,
});
