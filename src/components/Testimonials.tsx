import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Server Owner",
    company: "MCFleet Network",
    rating: 5,
    text: "Jagmohan's work on our Minecraft server was exceptional! The setup was professional, fast, and exactly what we needed. Highly recommended!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Community Manager",
    company: "FireMC Server",
    rating: 5,
    text: "Amazing Discord automation! Our server moderation is now fully automated and the custom bots work flawlessly. Worth every penny!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Developer",
    company: "YesSmartypie",
    rating: 5,
    text: "The Telegram bots created are incredibly efficient. The automation saved us hours of manual work. Professional service from start to finish!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
  },
  {
    id: 4,
    name: "Sarah Williams",
    role: "Content Creator",
    company: "YouTube Channel",
    rating: 5,
    text: "The cinematic edits and video work are top-notch! Jagmohan has a great eye for detail and delivered beyond expectations.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-30" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Client Testimonials
          </h2>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-primary via-accent to-primary rounded-full" />
        </div>

        <div className="relative">
          <Card className="bg-card/40 backdrop-blur-md border-primary/20 overflow-hidden hover-lift">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    className="w-24 h-24 rounded-full border-4 border-primary/30 shadow-lg shadow-primary/20 animate-scale-in"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-primary/20 backdrop-blur-sm rounded-full p-2 border border-primary/30">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                  </div>
                </div>

                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 transition-all duration-300 ${
                        i < currentTestimonial.rating
                          ? "fill-primary text-primary animate-pulse"
                          : "fill-muted text-muted"
                      }`}
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>

                <blockquote className="text-lg md:text-xl text-foreground/90 italic leading-relaxed max-w-2xl">
                  "{currentTestimonial.text}"
                </blockquote>

                <div>
                  <p className="text-xl font-semibold text-foreground">
                    {currentTestimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentTestimonial.role} at {currentTestimonial.company}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/30 rounded-full p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/30"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/30 rounded-full p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/30"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary shadow-lg shadow-primary/50"
                  : "w-2 bg-primary/30 hover:bg-primary/50"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
