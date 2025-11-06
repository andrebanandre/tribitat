import { Header } from "@/components/header";
import { BlogGrid } from "@/components/blog-grid";
import { Footer } from "@/components/footer";
import { PaginationControls } from "@/components/pagination-controls";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategoryBySlug, getPostsPaginated } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import type { Post } from "@/lib/wordpress.d";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = sp?.page ? parseInt(sp.page, 10) || 1 : 1;
  const perPage = 12;

  // Fetch the category by slug
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Fetch posts by category with embedded data
  const response = await getPostsPaginated(page, perPage, {
    category: category.id.toString(),
  });
  const posts: Post[] = response.data;
  const { totalPages } = response.headers;
  const currentPage = page;

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Category Header */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance mb-2">
            {category.name}
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover stories and insights from {category.name}
          </p>
        </div>
      </section>

      {/* Blog Grid with numbered pagination (infinite disabled) */}
      <BlogGrid
        posts={posts}
        categoryId={category.id}
        totalPages={totalPages}
        enableInfinite={false}
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        buildHref={(page) => {
          const params = new URLSearchParams();
          if (page > 1) params.set("page", String(page));
          return `/category/${slug}${
            params.toString() ? `?${params.toString()}` : ""
          }`;
        }}
      />

      <Footer />
    </main>
  );
}
