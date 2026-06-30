import ClientPage from './ClientPage';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

export default async function Page() {
  let initialReviews = [];
  try {
    await dbConnect();
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    initialReviews = JSON.parse(JSON.stringify(reviews));
  } catch (err) {
    console.error(err);
  }
  return <ClientPage initialReviews={initialReviews} />;
}
