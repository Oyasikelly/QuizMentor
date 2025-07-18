import { use } from 'react';
import QuizClient from './QuizClient';

export default function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <QuizClient id={id} />;
}
