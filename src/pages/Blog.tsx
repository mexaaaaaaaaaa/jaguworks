import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Eye, Search, BookOpen } from "lucide-react";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import blogPosts from "@/data/blog-posts.json";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const categories = ["All", "Tutorial", "Story", "Creative"];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEO 
        title="Blog & Case Studies - Jagmohan"
        description="Read about Minecraft development, Discord automation, AI bots, and my journey as a developer"
      />
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 grid-background opacity-20"></div>
          <div 
            ref={headerRef as any}
            className={`container mx-auto text-center relative z-10 transition-all duration-1000 ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-6">
              Blog & Case Studies
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights, tutorials, and stories from my development journey
            </p>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-card/50 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card/50 border border-border hover:border-primary'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12 px-4 pb-20">
          <div className="container mx-auto max-w-6xl">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">No articles found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => {
                  const { ref, isVisible } = useScrollAnimation();
                  return (
                    <div
                      key={post.slug}
                      ref={ref as any}
                      className={`transition-all duration-700 delay-${index % 3 * 100} ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                    >
                      <Link
                        to={`/blog/${post.slug}`}
                        className="group block h-full bg-card/30 backdrop-blur-sm border border-border rounded-xl overflow-hidden hover:border-primary hover:scale-105 transition-all duration-300"
                      >
                        {/* Featured Badge */}
                        {post.featured && (
                          <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                            Featured
                          </div>
                        )}

                        {/* Image Placeholder */}
                        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-primary/40" />
                          </div>
                          <div className="absolute top-4 left-4 px-3 py-1 bg-card/80 backdrop-blur-sm rounded-full text-xs font-medium border border-primary/20">
                            {post.category}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {post.excerpt}
                          </p>

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{post.readTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{post.views}</span>
                            </div>
                          </div>

                          {/* Read More */}
                          <div className="pt-2">
                            <span className="text-primary font-medium group-hover:underline">
                              Read More →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
