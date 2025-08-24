import { fetchFriendLinks, fetchRecentFeedUpdates } from '@/app/actions/blog-server';
import DynamicFriendsLayout from './DynamicFriendsLayout';

interface RecentFeedUpdate {
  title?: string;
  pub_date?: string;
  link?: string;
  friend_name?: string;
  friend_url?: string;
  friend_avatar?: string;
}


// Server-side rendered Friends page
export default async function FriendsPage({ params }: { params: Promise<{ lang: 'zh' | 'en' }> }) {
  const { lang }: { lang: 'zh' | 'en' } = await params;

  // Server-side data fetching
  const [friendsData, recentUpdatesData] = await Promise.all([
    fetchFriendLinks(lang),
    fetchRecentFeedUpdates()
  ]);

  // Process recent updates - sort by publication date (newest first) and filter out items without date
  const recentUpdates = (recentUpdatesData as RecentFeedUpdate[])
    .filter(item => item.pub_date)
    .sort((a, b) => new Date(b.pub_date!).getTime() - new Date(a.pub_date!).getTime());

  return (
    <DynamicFriendsLayout
      friendsData={friendsData}
      recentUpdates={recentUpdates}
      lang={lang}
    />
  );
}