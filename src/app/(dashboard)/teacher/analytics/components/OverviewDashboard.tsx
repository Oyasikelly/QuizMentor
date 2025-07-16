import React from 'react';
import OverviewCards from './OverviewCards';

export default function OverviewDashboard({
  subjectId,
}: {
  subjectId: string;
}) {
  return <OverviewCards subjectId={subjectId} />;
}
