import SeriesDetailsPage from '@/components/SeriesDetailsPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SeriesDetailsPage id={id} />;
}
