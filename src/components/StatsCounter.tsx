import { useEffect, useRef, useState } from 'react';
import { Code2, Users, Server, Sparkles } from 'lucide-react';

interface Stat {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    value: 500,
    suffix: '+',
    label: 'Projects Completed',
    color: 'text-primary',
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: 100,
    suffix: '+',
    label: 'Happy Clients',
    color: 'text-secondary',
  },
  {
    icon: <Server className="w-8 h-8" />,
    value: 50,
    suffix: '+',
    label: 'Discord Servers',
    color: 'text-accent',
  },
  {
    icon: <Code2 className="w-8 h-8" />,
    value: 1000,
    suffix: '+',
    label: 'Lines of Code',
    color: 'text-primary',
  },
];

const StatsCounter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    stats.forEach((stat, index) => {
      let currentStep = 0;
      const increment = stat.value / steps;

      const timer = setInterval(() => {
        currentStep++;
        const newValue = Math.min(currentStep * increment, stat.value);
        
        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[index] = Math.floor(newValue);
          return newCounts;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, interval);
    });
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Achievements & Milestones
          </h2>
          <p className="text-muted-foreground text-lg">
            Building digital excellence, one project at a time
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-card/30 backdrop-blur-md border border-border/50 rounded-2xl p-8 hover-lift hover-glow transition-all duration-300"
              style={{
                animation: isVisible ? `fadeInUp 0.6s ease-out ${index * 0.1}s both` : 'none',
              }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className={`${stat.color} mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>

                {/* Counter */}
                <div className="text-center mb-2">
                  <span className="text-4xl md:text-5xl font-bold gradient-text">
                    {counts[index].toLocaleString()}
                    <span className={stat.color}>{stat.suffix}</span>
                  </span>
                </div>

                {/* Label */}
                <p className="text-muted-foreground text-sm font-medium text-center">
                  {stat.label}
                </p>
              </div>

              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-2xl border-2 border-primary/50 animate-pulse-glow"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
