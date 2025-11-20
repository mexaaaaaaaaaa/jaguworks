import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Film } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const CinematicReel = () => {
  const projects = [
    {
      title: "Cinematic Edit - jagmohan",
      video: "/videos/manishwaah-cinematic.mp4",
      description: "A professionally crafted cinematic edit featuring smooth transitions, expert color grading, and perfectly synced beats that bring the visual narrative to life.",
      tags: ["Transitions", "Color Grade", "Beat Sync"],
      gradient: "from-purple-600 via-pink-600 to-red-600",
      glowColor: "rgba(219, 39, 119, 0.3)",
    },
    {
      title: "Cinematic Slow-Mo – Jagmohan",
      video: "/videos/dkd-jagmohan-slowmo.mp4",
      description: "An atmospheric masterpiece utilizing slow-motion techniques to create depth, emotion, and dramatic cinematic effects that captivate viewers.",
      tags: ["Slow Motion", "Atmosphere", "Cinematic Effects"],
      gradient: "from-cyan-600 via-blue-600 to-indigo-600",
      glowColor: "rgba(37, 99, 235, 0.3)",
    },
    {
      title: "Action Edit – srvna fonk",
      video: "/videos/action-export-reel.mp4",
      description: "A high-energy action-packed edit with dynamic effects, precise timing, and beat-driven transitions that showcase advanced editing mastery.",
      tags: ["Action Timing", "Dynamic Effects", "Beat Driven"],
      gradient: "from-orange-600 via-red-600 to-pink-600",
      glowColor: "rgba(239, 68, 68, 0.3)",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Back button */}
      <div className="container mx-auto px-4 pt-8 relative z-10">
        <Link to="/">
          <Button 
            variant="ghost" 
            className="group hover:bg-card/50 backdrop-blur-sm border border-border/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Film className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Cinematic Reel Project</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Professional 10-scene cinematic Minecraft video production showcasing
            <br className="hidden md:block" />
            masterful editing, color grading, and storytelling techniques
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full mt-8"></div>
        </div>

        {/* Project Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Glow effect */}
              <div 
                className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${project.glowColor}, transparent)` }}
              ></div>
              
              {/* Card */}
              <div className="relative bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500">
                {/* Video Preview */}
                <div className="relative aspect-video bg-black/50 overflow-hidden">
                  <video
                    src={project.video}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${project.gradient} flex items-center justify-center animate-pulse`}>
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className={`bg-gradient-to-r ${project.gradient} text-white border-0 hover:scale-105 transition-transform`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Watch Now Button */}
                  <Button
                    variant="neon"
                    className="w-full group/btn relative overflow-hidden"
                    onClick={() => {
                      const video = document.querySelector(`video[src="${project.video}"]`) as HTMLVideoElement;
                      if (video) {
                        if (video.requestFullscreen) {
                          video.requestFullscreen();
                        }
                        video.play();
                      }
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      Watch Now
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-20 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <p className="text-muted-foreground mb-4">
            Crafted with passion, precision, and creative excellence
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/60">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span>Professional Cinematic Production</span>
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" style={{ animationDelay: "0.5s" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicReel;
