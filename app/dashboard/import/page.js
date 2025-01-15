import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import ImportExternalBlogs from '@/components/ImportExternalBlogs';

export default async function ImportPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return <ImportExternalBlogs />;
}
