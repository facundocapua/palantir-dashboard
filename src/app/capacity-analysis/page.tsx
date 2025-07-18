import CapacityAnalysisContent from '@/components/capacity-analysis-content';

interface PageProps {
  searchParams: {
    year?: string;
    month?: string;
  };
}

export default function CapacityAnalysisPage({ searchParams }: PageProps) {
  const currentDate = new Date();
  const year = searchParams.year ? parseInt(searchParams.year) : currentDate.getFullYear();
  const month = searchParams.month ? parseInt(searchParams.month) : currentDate.getMonth() + 1;

  return (
      <CapacityAnalysisContent
        initialYear={year}
        initialMonth={month}
      />
  );
}
