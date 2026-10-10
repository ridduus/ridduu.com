import ClientPage from './ClientPage';
import dbConnect from '@/lib/db';
import Skill from '@/models/Skill';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {

  let initialSkills = [];
  try {
    await dbConnect();
    const skills = await Skill.find().sort({ createdAt: -1 }).lean();
    initialSkills = JSON.parse(JSON.stringify(skills));
  } catch (err) {
    console.error(err);
  }
  return <ClientPage initialSkills={initialSkills} />;
}
