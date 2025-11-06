import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BlogGrid } from "@/components/blog-grid";
import { PaginationControls } from "@/components/pagination-controls";
import { getPostsPaginated } from "@/lib/wordpress";
import type { Post } from "@/lib/wordpress.d";

export default async function AllPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page, 10) || 1 : 1;
  const perPage = 12;

  const response = await getPostsPaginated(page, perPage);
  const posts: Post[] = response.data;
  const { totalPages } = response.headers;

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance mb-2">
            All Posts
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse the latest stories from all categories
          </p>
        </div>
      </section>

      <BlogGrid posts={posts} totalPages={totalPages} enableInfinite={false} />

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        buildHref={(p) => {
          const sp = new URLSearchParams();
          if (p > 1) sp.set("page", String(p));
          return `/category${sp.toString() ? `?${sp.toString()}` : ""}`;
        }}
      />

      <Footer />
    </main>
  );
}
