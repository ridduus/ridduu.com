import ClientPage from './ClientPage';
import dbConnect from '@/lib/db';
import Education from '@/models/Education';
import Experience from '@/models/Experience';
import Profile from '@/models/Profile';

export default async function Page() {
  let initialEducation = [];
  let initialExperience = [];
  let initialProfile = null;
  try {
    await dbConnect();
    const edu = await Education.find().sort({ createdAt: -1 }).lean();
    initialEducation = JSON.parse(JSON.stringify(edu));
    
    const exp = await Experience.find().sort({ createdAt: -1 }).lean();
    initialExperience = JSON.parse(JSON.stringify(exp));
    
    const prof = await Profile.findOne().lean();
    if (prof) initialProfile = JSON.parse(JSON.stringify(prof));
  } catch (err) {
    console.error(err);
  }
  return <ClientPage initialEducation={initialEducation} initialExperience={initialExperience} initialProfile={initialProfile} />;
}
