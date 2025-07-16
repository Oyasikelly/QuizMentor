import React, { useEffect, useState } from 'react';

interface FilterControlsProps {
  subjectId: string;
  onSubjectChange: (subjectId: string) => void;
  teacherId: string;
}

export default function FilterControls({
  subjectId,
  onSubjectChange,
  teacherId,
}: FilterControlsProps) {
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      setLoading(true);
      try {
        const res = await fetch(`/api/subjects?teacherId=${teacherId}`);
        const data = await res.json();
        setSubjects(data.subjects || []);
      } finally {
        setLoading(false);
      }
    }
    if (teacherId) fetchSubjects();
  }, [teacherId]);

  return (
    <div className="mb-6">
      <div className="bg-card rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center gap-4">
        <div>
          <label
            htmlFor="subject-filter"
            className="block text-sm font-medium mb-1"
          >
            Filter by Subject:
          </label>
          <select
            id="subject-filter"
            className="border rounded px-3 py-2 bg-background"
            value={subjectId}
            onChange={(e) => onSubjectChange(e.target.value)}
            disabled={loading}
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        {/* Add more filters here as needed */}
      </div>
    </div>
  );
}
