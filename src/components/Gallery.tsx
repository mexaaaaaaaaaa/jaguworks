import { useState } from "react";
import { X, ExternalLink, Calendar, Tag } from "lucide-react";
import { Button } from "./ui/button";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Web Dev", "Gaming", "Automation", "Design"];

  const galleryItems = [
    {
      id: 1,
      title: "Minecraft Server Build",
      category: "Gaming",
      image: "/placeholder.svg",
      description: "Custom SMP server with unique features",
      date: "Dec 2024",
      client: "FireCraft Network",
      tags: ["Minecraft", "Server Setup", "Plugins"],
    },
    {
      id: 2,
      title: "Discord Bot Dashboard",
      category: "Automation",
      image: "/placeholder.svg",
      description: "Advanced moderation bot with auto-roles",
      date: "Jan 2025",
      client: "Community Server",
      tags: ["Discord.js", "Node.js", "MongoDB"],
    },
    {
      id: 3,
      title: "Portfolio Website",
      category: "Web Dev",
      image: "/placeholder.svg",
      description: "Modern portfolio with glassmorphism design",
      date: "Jan 2025",
      client: "Personal Project",
      tags: ["React", "Tailwind", "TypeScript"],
    },
    {
      id: 4,
      title: "Cinematic Edit",
      category: "Design",
      image: "/placeholder.svg",
      description: "10-scene Minecraft cinematic production",
      date: "Nov 2024",
      client: "DKD Jagmohan",
      tags: ["Video Editing", "After Effects", "Cinema4D"],
    },
    {
      id: 5,
      title: "AI Telegram Bot",
      category: "Automation",
      image: "/placeholder.svg",
      description: "Smart assistant with TTS & referral system",
      date: "Dec 2024",
      client: "Commercial Project",
      tags: ["Python", "AI/ML", "Telegram API"],
    },
    {
      id: 6,
      title: "E-commerce Platform",
      category: "Web Dev",
      image: "/placeholder.svg",
      description: "Full-stack store with payment integration",
      date: "Oct 2024",
      client: "Client Work",
      tags: ["React", "Supabase", "Razorpay"],
    },
  ];

  const filteredItems = filter === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-10"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Project Gallery</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-4"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A visual showcase of my best work across different domains
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setFilter(category)}
              variant={filter === category ? "default" : "outline"}
              className={`transition-all duration-300 ${
                filter === category 
                  ? "bg-gradient-to-r from-primary to-secondary text-white scale-105" 
                  : "hover:border-primary"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`group relative bg-card/50 backdrop-blur-sm border border-border rounded-xl overflow-hidden hover:border-primary transition-all duration-300 hover-lift cursor-pointer animate-scale-in stagger-${(index % 6) + 1}`}
              onClick={() => setSelectedImage(item)}
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <ExternalLink className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                    {item.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground rounded">
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 2 && (
                    <span className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground rounded">
                      +{item.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in-up"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="relative max-w-4xl w-full bg-card border border-border rounded-2xl overflow-hidden animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onClick={() => setSelectedImage(null)}
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20">
                <img 
                  src={selectedImage.image} 
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {selectedImage.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedImage.client}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                    {selectedImage.category}
                  </span>
                </div>

                <p className="text-muted-foreground mb-4">
                  {selectedImage.description}
                </p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {selectedImage.date}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedImage.tags.map((tag: string, i: number) => (
                    <span 
                      key={i} 
                      className="flex items-center gap-1 px-3 py-1 bg-muted/50 text-muted-foreground rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
