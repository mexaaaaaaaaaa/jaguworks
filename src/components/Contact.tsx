import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Instagram, MessageCircle, Youtube, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await emailjs.send(
        'service_z9tpweb',
        'template_tcx82vr',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        'kvWIKwv_Y8XNUAiK2'
      );
      
      toast.success("Message sent! I'll get back to you soon 🚀");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error('EmailJS error:', error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const socials = [
    { 
      name: "Discord", 
      icon: MessageCircle, 
      url: "https://discord.gg/your-discord",
      color: "hover:text-[#5865F2]"
    },
    { 
      name: "GitHub", 
      icon: Github, 
      url: "https://github.com/your-github",
      color: "hover:text-white"
    },
    { 
      name: "Instagram", 
      icon: Instagram, 
      url: "https://instagram.com/your-instagram",
      color: "hover:text-[#E4405F]"
    },
    { 
      name: "YouTube", 
      icon: Youtube, 
      url: "https://youtube.com/your-channel",
      color: "hover:text-[#FF0000]"
    },
  ];

  return (
    <section id="contact" className="py-20 px-4 relative overflow-hidden bg-card/20">
      <div className="absolute inset-0 grid-background opacity-20"></div>
      
      <div className="container mx-auto relative z-10 max-w-4xl">
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Let's Connect</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-4"></div>
          <p className="text-xl text-primary font-medium">
            Let's Build Something Incredible ✨
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="animate-slide-in-left">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-card/50 border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-card/50 border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="bg-card/50 border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>
              
              <Button 
                type="submit" 
                variant="hero" 
                size="lg"
                className="w-full group"
              >
                Send Message
                <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>

          {/* Social Links */}
          <div className="animate-slide-in-right">
            <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 glow-primary">
              <h3 className="text-2xl font-bold mb-6 text-foreground">Connect on Social</h3>
              
              <div className="space-y-4">
                {socials.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all duration-300 group border border-transparent hover:border-primary ${social.color}`}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-lg font-medium">{social.name}</span>
                    </a>
                  );
                })}
              </div>

              <div className="mt-8 pt-8 border-t border-primary/20">
                <p className="text-muted-foreground text-sm text-center">
                  Available for freelance projects and collaborations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
