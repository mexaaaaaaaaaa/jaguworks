import { Heart, Github, Instagram, Youtube, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: Github, url: "https://github.com/theghoxt69-creator/FIRECRAFTX", label: "GitHub" },
    { icon: Instagram, url: "https://www.instagram.com/dkd_jagmohan_?igsh=aWJlejgyOWNvd3Fo", label: "Instagram" },
    { icon: Youtube, url: "https://www.youtube.com/@D4dirtyGaming", label: "YouTube" },
    { icon: Mail, url: "mailto:jagmohandhaker@gmail.com", label: "Email" },
  ];

  return (
    <footer className="relative py-16 px-4 border-t border-primary/20 bg-card/30 backdrop-blur-xl overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 grid-background opacity-10"></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      
      <div className="container mx-auto relative z-10">
        {/* Main content */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand section */}
          <div className="space-y-4 animate-fade-in-up opacity-0 stagger-1">
            <h3 className="text-2xl font-display font-bold gradient-text">JAGMOHAN</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Building the future of digital experiences through code, creativity, and innovation.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-card/50 border border-primary/20 flex items-center justify-center hover:bg-primary/10 hover:border-primary hover:scale-110 transition-all duration-300 group"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4 animate-fade-in-up opacity-0 stagger-2">
            <h4 className="text-lg font-display font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              {['About', 'Projects', 'Skills', 'Achievements', 'Goals', 'Contact'].map((link, index) => (
                <a
                  key={index}
                  href={`/${link.toLowerCase()}`}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm group flex items-center gap-2"
                >
                  <span className="w-0 h-0.5 bg-primary group-hover:w-4 transition-all duration-300"></span>
                  {link}
                </a>
              ))}
            </nav>
          </div>
          
          {/* Newsletter/CTA */}
          <div className="space-y-4 animate-fade-in-up opacity-0 stagger-3">
            <h4 className="text-lg font-display font-semibold text-foreground">Let's Connect</h4>
            <p className="text-muted-foreground text-sm">
              Available for freelance projects and collaborations.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium hover:scale-105 hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
            >
              Get in Touch
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        {/* Divider */}
        <div className="section-divider my-8"></div>
        
        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in-up opacity-0 stagger-4">
          <p className="text-muted-foreground text-sm text-center md:text-left font-mono">
            © {currentYear} <span className="text-primary font-semibold">JAGMOHAN</span> — All Rights Reserved
          </p>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-mono">Crafted with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="font-mono">& cutting-edge tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
