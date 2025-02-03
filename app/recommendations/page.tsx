import { RecommendationsFeed } from "@/components/recommendations-feed";

export const dynamic = "force-dynamic";

export default function RecommendationsPage() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-background">
      <div className="flex-1 w-full max-w-screen-xl mx-auto">
        <RecommendationsFeed />
      </div>
    </main>
  );
} 