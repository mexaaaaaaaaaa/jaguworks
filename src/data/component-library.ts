import { 
  Layout, Type, Image, CreditCard, HelpCircle, Code, 
  Columns, List, Star, Users, Zap, Award, Target, 
  MessageSquare, Mail, Phone, MapPin, Calendar, Clock,
  CheckCircle, ArrowRight, Play, Download, Share2, Heart,
  Sparkles, Rocket, Shield, Globe, Lightbulb, TrendingUp
} from "lucide-react";

export interface ComponentTemplate {
  id: string;
  name: string;
  category: string;
  icon: any;
  layout_type: string;
  preview_image?: string;
  description: string;
  default_content: Record<string, unknown>;
}

export const COMPONENT_CATEGORIES = [
  { id: "hero", label: "Hero Sections", icon: Layout },
  { id: "features", label: "Features", icon: Zap },
  { id: "pricing", label: "Pricing", icon: CreditCard },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "cta", label: "Call to Action", icon: ArrowRight },
  { id: "gallery", label: "Gallery", icon: Image },
  { id: "team", label: "Team", icon: Users },
  { id: "stats", label: "Statistics", icon: TrendingUp },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "content", label: "Content", icon: Type },
  { id: "custom", label: "Custom", icon: Code },
];

export const COMPONENT_LIBRARY: ComponentTemplate[] = [
  // HERO SECTIONS (5)
  {
    id: "hero-gradient",
    name: "Gradient Hero",
    category: "hero",
    icon: Layout,
    layout_type: "hero_banner",
    description: "Full-width hero with gradient overlay and CTA buttons",
    default_content: {
      title: "Welcome to My Portfolio",
      subtitle: "Full-Stack Developer & Content Creator",
      background_image: "",
      cta_text: "Get Started",
      cta_link: "/contact",
      secondary_cta_text: "Learn More",
      secondary_cta_link: "/about",
      overlay_opacity: 0.7,
      gradient_colors: ["#8B5CF6", "#06B6D4"],
    },
  },
  {
    id: "hero-split",
    name: "Split Hero",
    category: "hero",
    icon: Columns,
    layout_type: "two_column",
    description: "Two-column hero with image and text",
    default_content: {
      title: "Building Digital Experiences",
      subtitle: "",
      left_content: "I create stunning websites and applications that help businesses grow and succeed in the digital world.",
      right_image: "",
      left_image: "",
      right_content: "",
      buttons: [{ text: "View Projects", link: "/projects" }],
    },
  },
  {
    id: "hero-video",
    name: "Video Hero",
    category: "hero",
    icon: Play,
    layout_type: "hero_banner",
    description: "Hero section with video background",
    default_content: {
      title: "Cinematic Experience",
      subtitle: "Watch my latest work",
      video_url: "",
      cta_text: "Watch Reel",
      cta_link: "/cinematic-reel",
      overlay_opacity: 0.5,
    },
  },
  {
    id: "hero-minimal",
    name: "Minimal Hero",
    category: "hero",
    icon: Type,
    layout_type: "text",
    description: "Clean, minimal text-focused hero",
    default_content: {
      title: "Hello, I'm Jagmohan",
      subtitle: "Developer • Creator • Innovator",
      paragraphs: ["Crafting digital experiences that matter."],
      buttons: [{ text: "Say Hello", link: "/contact" }],
    },
  },
  {
    id: "hero-animated",
    name: "Animated Hero",
    category: "hero",
    icon: Sparkles,
    layout_type: "hero_banner",
    description: "Hero with animated particles and effects",
    default_content: {
      title: "Innovation Meets Design",
      subtitle: "Creating the future, one pixel at a time",
      animation_type: "particles",
      cta_text: "Explore",
      cta_link: "/projects",
      overlay_opacity: 0.6,
    },
  },

  // FEATURES SECTIONS (5)
  {
    id: "features-grid-3",
    name: "3-Column Features",
    category: "features",
    icon: Layout,
    layout_type: "cards_grid",
    description: "Three feature cards in a row",
    default_content: {
      title: "What I Offer",
      subtitle: "Services tailored to your needs",
      columns: 3,
      cards: [
        { title: "Web Development", description: "Custom websites built with modern technologies", icon: "Code" },
        { title: "Bot Development", description: "Automated bots for Discord & Telegram", icon: "Bot" },
        { title: "Server Setup", description: "Minecraft & Discord server configuration", icon: "Server" },
      ],
    },
  },
  {
    id: "features-grid-4",
    name: "4-Column Features",
    category: "features",
    icon: Layout,
    layout_type: "cards_grid",
    description: "Four feature cards for comprehensive services",
    default_content: {
      title: "Our Services",
      subtitle: "Everything you need to succeed online",
      columns: 4,
      cards: [
        { title: "Design", description: "Beautiful UI/UX design", icon: "Palette" },
        { title: "Development", description: "Clean, efficient code", icon: "Code" },
        { title: "Hosting", description: "Reliable server hosting", icon: "Server" },
        { title: "Support", description: "24/7 customer support", icon: "Headphones" },
      ],
    },
  },
  {
    id: "features-list",
    name: "Feature List",
    category: "features",
    icon: List,
    layout_type: "feature_list",
    description: "Vertical list of features with icons",
    default_content: {
      title: "Why Choose Me",
      subtitle: "",
      features: [
        { icon: "Zap", title: "Fast Delivery", description: "Quick turnaround on all projects" },
        { icon: "Shield", title: "Secure Code", description: "Security-first development approach" },
        { icon: "Clock", title: "24/7 Support", description: "Always available when you need help" },
        { icon: "Star", title: "Quality Work", description: "Premium quality in every project" },
      ],
    },
  },
  {
    id: "features-icon-boxes",
    name: "Icon Boxes",
    category: "features",
    icon: Zap,
    layout_type: "cards_grid",
    description: "Feature boxes with large icons",
    default_content: {
      title: "Core Features",
      subtitle: "What makes my work stand out",
      style: "icon_boxes",
      cards: [
        { title: "Modern Stack", description: "React, TypeScript, Tailwind", icon: "Rocket" },
        { title: "Responsive", description: "Works on all devices", icon: "Smartphone" },
        { title: "Fast Loading", description: "Optimized performance", icon: "Zap" },
      ],
    },
  },
  {
    id: "features-comparison",
    name: "Feature Comparison",
    category: "features",
    icon: CheckCircle,
    layout_type: "cards_grid",
    description: "Compare features across different options",
    default_content: {
      title: "Feature Comparison",
      subtitle: "See what's included in each plan",
      comparison_mode: true,
      items: [
        { feature: "Custom Domain", basic: true, pro: true, enterprise: true },
        { feature: "SSL Certificate", basic: true, pro: true, enterprise: true },
        { feature: "Priority Support", basic: false, pro: true, enterprise: true },
      ],
    },
  },

  // PRICING SECTIONS (4)
  {
    id: "pricing-3-tier",
    name: "3-Tier Pricing",
    category: "pricing",
    icon: CreditCard,
    layout_type: "pricing_table",
    description: "Classic three-tier pricing table",
    default_content: {
      title: "Simple Pricing",
      subtitle: "Choose the plan that works for you",
      currency: "₹",
      plans: [
        { name: "Starter", price: 49, features: ["1 Project", "Basic Support", "1 Revision"], cta_text: "Get Started", cta_link: "/checkout" },
        { name: "Pro", price: 199, features: ["5 Projects", "Priority Support", "5 Revisions", "Source Code"], cta_text: "Most Popular", cta_link: "/checkout", highlighted: true },
        { name: "Enterprise", price: 499, features: ["Unlimited Projects", "24/7 Support", "Unlimited Revisions", "Source Code", "Custom Features"], cta_text: "Contact Us", cta_link: "/contact" },
      ],
    },
  },
  {
    id: "pricing-single",
    name: "Single Price",
    category: "pricing",
    icon: CreditCard,
    layout_type: "pricing_table",
    description: "Single featured pricing card",
    default_content: {
      title: "One Simple Price",
      subtitle: "Everything you need, one price",
      currency: "₹",
      plans: [
        { name: "Complete Package", price: 999, features: ["Everything Included", "Lifetime Access", "Free Updates", "Priority Support"], cta_text: "Buy Now", cta_link: "/checkout", highlighted: true },
      ],
    },
  },
  {
    id: "pricing-cards",
    name: "Pricing Cards",
    category: "pricing",
    icon: CreditCard,
    layout_type: "pricing_table",
    description: "Modern pricing cards with hover effects",
    default_content: {
      title: "Plans & Pricing",
      subtitle: "Transparent pricing for every budget",
      style: "cards",
      currency: "₹",
      plans: [
        { name: "Basic", price: 99, period: "/month", features: ["Feature 1", "Feature 2"], cta_text: "Start Free Trial" },
        { name: "Premium", price: 299, period: "/month", features: ["All Basic", "Feature 3", "Feature 4"], cta_text: "Get Started", highlighted: true },
      ],
    },
  },
  {
    id: "pricing-toggle",
    name: "Monthly/Yearly Toggle",
    category: "pricing",
    icon: CreditCard,
    layout_type: "pricing_table",
    description: "Pricing with monthly/yearly toggle",
    default_content: {
      title: "Flexible Pricing",
      subtitle: "Save 20% with annual billing",
      show_toggle: true,
      currency: "₹",
      plans: [
        { name: "Starter", monthly_price: 49, yearly_price: 470, features: ["Feature 1", "Feature 2"] },
        { name: "Pro", monthly_price: 99, yearly_price: 950, features: ["All Starter", "Feature 3"], highlighted: true },
      ],
    },
  },

  // TESTIMONIALS (4)
  {
    id: "testimonials-carousel",
    name: "Testimonial Carousel",
    category: "testimonials",
    icon: MessageSquare,
    layout_type: "cards_grid",
    description: "Auto-playing testimonial carousel",
    default_content: {
      title: "What Clients Say",
      subtitle: "Real feedback from real clients",
      style: "carousel",
      testimonials: [
        { name: "John Doe", role: "CEO, TechCorp", content: "Amazing work! Delivered on time and exceeded expectations.", rating: 5, image: "" },
        { name: "Jane Smith", role: "Founder, StartupXYZ", content: "Professional and skilled. Highly recommended!", rating: 5, image: "" },
      ],
    },
  },
  {
    id: "testimonials-grid",
    name: "Testimonial Grid",
    category: "testimonials",
    icon: Users,
    layout_type: "cards_grid",
    description: "Grid layout of testimonial cards",
    default_content: {
      title: "Client Reviews",
      subtitle: "",
      style: "grid",
      columns: 3,
      testimonials: [
        { name: "Client 1", role: "Position", content: "Great experience working together!", rating: 5 },
        { name: "Client 2", role: "Position", content: "Exceeded all expectations!", rating: 5 },
        { name: "Client 3", role: "Position", content: "Will definitely work again!", rating: 5 },
      ],
    },
  },
  {
    id: "testimonials-quote",
    name: "Featured Quote",
    category: "testimonials",
    icon: MessageSquare,
    layout_type: "text",
    description: "Large featured testimonial quote",
    default_content: {
      title: "",
      style: "featured_quote",
      testimonial: {
        name: "Featured Client",
        role: "CEO, BigCompany",
        content: "This is the best investment we've made for our business. The results speak for themselves.",
        rating: 5,
        image: "",
      },
    },
  },
  {
    id: "testimonials-video",
    name: "Video Testimonials",
    category: "testimonials",
    icon: Play,
    layout_type: "cards_grid",
    description: "Video testimonials from clients",
    default_content: {
      title: "Video Reviews",
      subtitle: "Hear directly from our clients",
      style: "video",
      testimonials: [
        { name: "Client", video_url: "", thumbnail: "" },
      ],
    },
  },

  // FAQ (3)
  {
    id: "faq-accordion",
    name: "FAQ Accordion",
    category: "faq",
    icon: HelpCircle,
    layout_type: "faq",
    description: "Expandable FAQ accordion",
    default_content: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions",
      items: [
        { question: "What services do you offer?", answer: "I offer web development, bot development, and server setup services." },
        { question: "How long does a project take?", answer: "Project timelines vary based on complexity. Typically 1-4 weeks." },
        { question: "Do you offer support after delivery?", answer: "Yes, I provide support and maintenance packages." },
      ],
    },
  },
  {
    id: "faq-two-column",
    name: "Two Column FAQ",
    category: "faq",
    icon: Columns,
    layout_type: "faq",
    description: "FAQ in two-column layout",
    default_content: {
      title: "Questions & Answers",
      subtitle: "",
      style: "two_column",
      items: [
        { question: "Question 1?", answer: "Answer 1" },
        { question: "Question 2?", answer: "Answer 2" },
        { question: "Question 3?", answer: "Answer 3" },
        { question: "Question 4?", answer: "Answer 4" },
      ],
    },
  },
  {
    id: "faq-categories",
    name: "Categorized FAQ",
    category: "faq",
    icon: HelpCircle,
    layout_type: "faq",
    description: "FAQ organized by categories",
    default_content: {
      title: "Help Center",
      subtitle: "Browse by category",
      style: "categorized",
      categories: [
        { name: "General", items: [{ question: "What is this?", answer: "This is..." }] },
        { name: "Pricing", items: [{ question: "How much?", answer: "Prices start at..." }] },
      ],
    },
  },

  // CTA (4)
  {
    id: "cta-banner",
    name: "CTA Banner",
    category: "cta",
    icon: ArrowRight,
    layout_type: "hero_banner",
    description: "Full-width call to action banner",
    default_content: {
      title: "Ready to Get Started?",
      subtitle: "Let's build something amazing together",
      cta_text: "Contact Me",
      cta_link: "/contact",
      background_color: "gradient",
    },
  },
  {
    id: "cta-split",
    name: "Split CTA",
    category: "cta",
    icon: Columns,
    layout_type: "two_column",
    description: "Two-column CTA with image",
    default_content: {
      title: "Let's Work Together",
      left_content: "Have a project in mind? I'd love to hear about it. Let's discuss how we can bring your ideas to life.",
      right_image: "",
      buttons: [{ text: "Start a Project", link: "/contact" }],
    },
  },
  {
    id: "cta-newsletter",
    name: "Newsletter CTA",
    category: "cta",
    icon: Mail,
    layout_type: "text",
    description: "Newsletter subscription CTA",
    default_content: {
      title: "Stay Updated",
      subtitle: "Subscribe to my newsletter for latest updates",
      style: "newsletter",
      button_text: "Subscribe",
      placeholder: "Enter your email",
    },
  },
  {
    id: "cta-download",
    name: "Download CTA",
    category: "cta",
    icon: Download,
    layout_type: "text",
    description: "Download/resource CTA",
    default_content: {
      title: "Free Resource",
      subtitle: "Download my free guide",
      cta_text: "Download Now",
      download_url: "",
      icon: "Download",
    },
  },

  // GALLERY (3)
  {
    id: "gallery-grid",
    name: "Image Grid",
    category: "gallery",
    icon: Image,
    layout_type: "image_gallery",
    description: "Responsive image grid gallery",
    default_content: {
      title: "Gallery",
      subtitle: "A showcase of my work",
      columns: 3,
      images: [
        { url: "", caption: "Project 1" },
        { url: "", caption: "Project 2" },
        { url: "", caption: "Project 3" },
      ],
    },
  },
  {
    id: "gallery-masonry",
    name: "Masonry Gallery",
    category: "gallery",
    icon: Image,
    layout_type: "image_gallery",
    description: "Pinterest-style masonry layout",
    default_content: {
      title: "Portfolio",
      subtitle: "",
      style: "masonry",
      images: [],
    },
  },
  {
    id: "gallery-lightbox",
    name: "Lightbox Gallery",
    category: "gallery",
    icon: Image,
    layout_type: "image_gallery",
    description: "Gallery with lightbox popup",
    default_content: {
      title: "Photo Gallery",
      subtitle: "Click to enlarge",
      style: "lightbox",
      images: [],
    },
  },

  // STATS (2)
  {
    id: "stats-counter",
    name: "Stats Counter",
    category: "stats",
    icon: TrendingUp,
    layout_type: "cards_grid",
    description: "Animated statistics counters",
    default_content: {
      title: "",
      style: "counter",
      stats: [
        { value: 500, suffix: "+", label: "Projects Completed" },
        { value: 100, suffix: "+", label: "Happy Clients" },
        { value: 50, suffix: "+", label: "Discord Servers" },
        { value: 3, suffix: "+", label: "Years Experience" },
      ],
    },
  },
  {
    id: "stats-cards",
    name: "Stats Cards",
    category: "stats",
    icon: Award,
    layout_type: "cards_grid",
    description: "Statistics in card format",
    default_content: {
      title: "By the Numbers",
      subtitle: "",
      style: "cards",
      stats: [
        { icon: "Trophy", value: "500+", label: "Projects" },
        { icon: "Users", value: "100+", label: "Clients" },
        { icon: "Star", value: "5.0", label: "Rating" },
      ],
    },
  },

  // CONTACT (2)
  {
    id: "contact-form",
    name: "Contact Form",
    category: "contact",
    icon: Mail,
    layout_type: "two_column",
    description: "Contact form with info sidebar",
    default_content: {
      title: "Get in Touch",
      subtitle: "Have a question? Send me a message!",
      show_form: true,
      contact_info: [
        { icon: "Mail", label: "Email", value: "jagmohandhaker@gmail.com" },
        { icon: "MapPin", label: "Location", value: "India" },
      ],
    },
  },
  {
    id: "contact-cards",
    name: "Contact Cards",
    category: "contact",
    icon: Phone,
    layout_type: "cards_grid",
    description: "Contact information in card format",
    default_content: {
      title: "Contact Information",
      subtitle: "Reach out through any of these channels",
      cards: [
        { icon: "Mail", title: "Email", value: "email@example.com", link: "mailto:email@example.com" },
        { icon: "MessageSquare", title: "Discord", value: "discord.gg/...", link: "" },
      ],
    },
  },

  // CONTENT (3)
  {
    id: "content-text",
    name: "Rich Text",
    category: "content",
    icon: Type,
    layout_type: "text",
    description: "Rich text content block",
    default_content: {
      title: "Section Title",
      subtitle: "Optional subtitle",
      paragraphs: ["Your content goes here..."],
    },
  },
  {
    id: "content-timeline",
    name: "Timeline",
    category: "content",
    icon: Clock,
    layout_type: "feature_list",
    description: "Vertical timeline of events",
    default_content: {
      title: "My Journey",
      subtitle: "",
      style: "timeline",
      items: [
        { year: "2023", title: "Started Freelancing", description: "Began my journey as a freelance developer" },
        { year: "2022", title: "First Project", description: "Completed my first client project" },
      ],
    },
  },
  {
    id: "content-about",
    name: "About Section",
    category: "content",
    icon: Users,
    layout_type: "two_column",
    description: "About me/us section with image",
    default_content: {
      title: "About Me",
      subtitle: "",
      left_image: "",
      right_content: "I'm a passionate developer with experience in building web applications, bots, and server setups. My goal is to help businesses and individuals achieve their digital goals.",
      buttons: [{ text: "Learn More", link: "/about" }],
    },
  },

  // CUSTOM (2)
  {
    id: "custom-html",
    name: "Custom HTML",
    category: "custom",
    icon: Code,
    layout_type: "custom_html",
    description: "Custom HTML/CSS block",
    default_content: {
      html: "<div class='custom-section'><h2>Custom Content</h2><p>Add your custom HTML here</p></div>",
      css: ".custom-section { padding: 2rem; text-align: center; }",
    },
  },
  {
    id: "custom-embed",
    name: "Embed Block",
    category: "custom",
    icon: Globe,
    layout_type: "custom_html",
    description: "Embed external content (YouTube, maps, etc.)",
    default_content: {
      embed_type: "iframe",
      embed_url: "",
      height: "400px",
    },
  },
];

export const getTemplatesByCategory = (categoryId: string) => {
  return COMPONENT_LIBRARY.filter(template => template.category === categoryId);
};

export const getTemplateById = (templateId: string) => {
  return COMPONENT_LIBRARY.find(template => template.id === templateId);
};
