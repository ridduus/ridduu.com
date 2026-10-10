import ClientPage from './ClientPage';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {

  let initialReviews = [];
  try {
    await dbConnect();
    // Strictly filter ONLY approved reviews for public display
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 }).lean();
    initialReviews = JSON.parse(JSON.stringify(reviews));
  } catch (err) {
    console.error('Error fetching public reviews:', err);
  }
  return <ClientPage initialReviews={initialReviews} />;
}
