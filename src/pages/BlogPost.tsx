import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, Eye, ArrowLeft, Share2, Twitter, Linkedin, Copy } from "lucide-react";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { toast } from "sonner";
import blogPosts from "@/data/blog-posts.json";

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const relatedPosts = blogPosts.filter(p => p.slug !== slug && p.category === post.category).slice(0, 3);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post.title;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        break;
    }
  };

  return (
    <>
      <SEO 
        title={`${post.title} - Jagmohan`}
        description={post.excerpt}
        type="article"
      />
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"></div>
          <div className="absolute inset-0 grid-background opacity-20"></div>
          
          <div className="container mx-auto max-w-4xl relative z-10">
            {/* Back Button */}
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category Badge */}
            <div className="mb-4">
              <span className="px-4 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 animate-slide-in-up">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <img 
                  src="https://i.postimg.cc/7YVhHKSt/IMG-20251108-205333.jpg" 
                  alt={post.author}
                  className="w-10 h-10 rounded-full border-2 border-primary/20"
                />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views} views</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Share:</span>
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 rounded-lg bg-card/50 border border-border hover:border-primary hover:bg-primary/10 transition-all"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="p-2 rounded-lg bg-card/50 border border-border hover:border-primary hover:bg-primary/10 transition-all"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="p-2 rounded-lg bg-card/50 border border-border hover:border-primary hover:bg-primary/10 transition-all"
                aria-label="Copy link"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <article className="prose prose-invert max-w-none">
              <div className="bg-card/30 backdrop-blur-sm border border-border rounded-xl p-8 md:p-12">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {post.content}
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 px-4 border-t border-border">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl font-display font-bold mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    to={`/blog/${relatedPost.slug}`}
                    className="group block bg-card/30 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary hover:scale-105 transition-all"
                  >
                    <div className="mb-3">
                      <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary">
                        {relatedPost.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
