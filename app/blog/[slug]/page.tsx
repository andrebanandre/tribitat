import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ShareButtons } from "@/components/share-buttons";
import { RelatedPosts } from "@/components/related-posts";
import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
  getPostsPaginated,
  getAllPostSlugs,
} from "@/lib/wordpress";
import type { Post } from "@/lib/wordpress.d";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return await getAllPostSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  // Strip HTML tags for description
  const description = post.excerpt.rendered.replace(/<[^>]*>/g, "").trim();

  return {
    title: post.title.rendered,
    description: description,
    openGraph: {
      title: post.title.rendered,
      description: description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title.rendered,
      description: description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Fetch the post by slug
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch related data individually (more reliable than embedded data)
  const featuredMedia = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const author = await getAuthorById(post.author);
  const category = await getCategoryById(post.categories[0]);

  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Fetch related posts (same category, excluding current post)
  const relatedResponse = await getPostsPaginated(1, 4, {
    categories: post.categories[0],
  });
  const relatedPostsList = relatedResponse.data
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="relative w-full group">
        {/* Hero Image */}
        <div className="relative h-64 sm:h-96 md:h-[500px] overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6">
          <img
            src={featuredMedia?.source_url || "/placeholder.svg"}
            alt={post.title.rendered}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 animate-zoom-in"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                {category.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 md:mb-3 line-clamp-3 text-balance">
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </h1>
            <p className="text-sm sm:text-base md:text-lg opacity-90 line-clamp-2">
              {post.excerpt.rendered.replace(/<[^>]*>/g, "")}
            </p>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Breadcrumb & Meta */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/" className="hover:text-accent transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-accent font-medium">{post.title.rendered}</span>
        </div>

        {/* Title & Description */}
        <header className="mb-8 border-b border-border pb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <time>{date}</time>
              <span>by</span>
              <a
                href={`/posts/?author=${author.id}`}
                className="hover:text-accent"
              >
                {author.name}
              </a>
            </div>

            <ShareButtons
              title={post.title.rendered}
              url={`/blog/${post.slug}`}
            />
          </div>
        </header>

        {/* Main Content */}
        <div className="prose prose-invert max-w-none text-foreground leading-relaxed mb-12 prose-headings:text-foreground prose-a:text-accent prose-a:hover:underline prose-code:bg-muted prose-code:text-accent prose-code:rounded">
          {/* Render WordPress content directly */}
          {post.content.rendered && (
            <div
              dangerouslySetInnerHTML={{
                __html: post.content.rendered,
              }}
            />
          )}
        </div>
      </article>

      {/* Related Posts */}
      <RelatedPosts posts={relatedPostsList} currentSlug={post.slug} />

      {/* Scroll to Top Button */}
      <ScrollToTop />

      <Footer />
    </main>
  );
}
