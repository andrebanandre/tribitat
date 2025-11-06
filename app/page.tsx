import { Header } from "@/components/header";
import { TopPostsSlider } from "@/components/top-posts-slider";
import { BlogGrid } from "@/components/blog-grid";
import { Footer } from "@/components/footer";
import { CountrySelector } from "@/components/country-selector";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPostsPaginated } from "@/lib/wordpress";
import type { Post } from "@/lib/wordpress.d";

export default async function Home() {
  // Fetch real data from WordPress API with embedded data
  const response = await getPostsPaginated(1, 12);
  const posts: Post[] = response.data;
  const { totalPages } = response.headers;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <TopPostsSlider posts={posts} />
      <CountrySelector />
      <BlogGrid posts={posts} totalPages={totalPages} enableInfinite={false} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 -mt-8">
        <div className="flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/category">Read more posts</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
