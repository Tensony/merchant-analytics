import { useState } from 'react';

export interface Annotation {
  id:      string;
  date:    string;
  note:    string;
  color:   string;
}

interface UseChartAnnotationsReturn {
  annotations:      Annotation[];
  addAnnotation:    (date: string, note: string) => void;
  removeAnnotation: (id: string) => void;
  clearAll:         () => void;
}

const ANNOTATION_COLORS = [
  '#22d98a', '#4d9cf8', '#a78bfa', '#f5a623', '#f06291',
];

export function useChartAnnotations(): UseChartAnnotationsReturn {
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id:    'default-1',
      date:  'Mar 15',
      note:  'Flash sale event — revenue spike',
      color: '#f5a623',
    },
  ]);

  function addAnnotation(date: string, note: string) {
    const color = ANNOTATION_COLORS[annotations.length % ANNOTATION_COLORS.length];
    setAnnotations((prev) => [
      ...prev,
      { id: Date.now().toString(), date, note, color },
    ]);
  }

  function removeAnnotation(id: string) {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }

  function clearAll() {
    setAnnotations([]);
  }

  return { annotations, addAnnotation, removeAnnotation, clearAll };
}