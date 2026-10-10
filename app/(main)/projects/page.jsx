import ClientPage from './ClientPage';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {

  let initialProjects = [];
  try {
    await dbConnect();
    const proj = await Project.find().sort({ createdAt: -1 }).lean();
    initialProjects = JSON.parse(JSON.stringify(proj));
  } catch (err) {
    console.error(err);
  }
  return <ClientPage initialProjects={initialProjects} />;
}
