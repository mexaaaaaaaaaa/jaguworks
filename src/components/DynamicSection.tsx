import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface DynamicSectionProps {
  section: {
    id: string;
    section_name: string;
    slug: string;
    layout_type: string;
    content: Record<string, unknown>;
  };
}

const getIcon = (iconName: string): LucideIcon | null => {
  if (!iconName) return null;
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  const formattedName = iconName
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
  return icons[formattedName] || icons[iconName] || null;
};

export function DynamicSection({ section }: DynamicSectionProps) {
  const { layout_type, content, section_name, slug } = section;

  const renderSection = () => {
    switch (layout_type) {
      case "text":
        return <TextSection content={content} />;
      case "text_image":
        return <TextImageSection content={content} />;
      case "cards_grid":
        return <CardsGridSection content={content} />;
      case "pricing_table":
        return <PricingTableSection content={content} />;
      case "image_gallery":
        return <ImageGallerySection content={content} />;
      case "faq":
        return <FAQSection content={content} />;
      case "custom_html":
        return <CustomHTMLSection content={content} />;
      case "hero_banner":
        return <HeroBannerSection content={content} />;
      case "two_column":
        return <TwoColumnSection content={content} />;
      case "feature_list":
        return <FeatureListSection content={content} />;
      default:
        return <div>Unknown section type: {layout_type}</div>;
    }
  };

  return (
    <section id={slug} className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {renderSection()}
      </div>
    </section>
  );
}

function TextSection({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const paragraphs = (content.paragraphs as string[]) || [];
  const buttons = (content.buttons as Array<{ text: string; link: string }>) || [];

  return (
    <div className="max-w-4xl mx-auto text-center">
      {title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>}
      {subtitle && <p className="text-xl text-muted-foreground mb-8">{subtitle}</p>}
      <div className="prose prose-lg dark:prose-invert mx-auto">
        {paragraphs.map((para, i) => (
          <p key={i} className="text-muted-foreground">{para}</p>
        ))}
      </div>
      {buttons.length > 0 && (
        <div className="flex gap-4 justify-center mt-8">
          {buttons.map((btn, i) => (
            <Link key={i} to={btn.link}>
              <Button>{btn.text}</Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function TextImageSection({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const paragraphs = (content.paragraphs as string[]) || [];
  const imageUrl = content.image_url as string;
  const imagePosition = (content.image_position as string) || "right";
  const buttons = (content.buttons as Array<{ text: string; link: string }>) || [];

  return (
    <div className={`grid md:grid-cols-2 gap-12 items-center ${imagePosition === "left" ? "md:flex-row-reverse" : ""}`}>
      <div className={`space-y-6 ${imagePosition === "left" ? "md:order-2" : ""}`}>
        {title && <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>}
        {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
        {paragraphs.map((para, i) => (
          <p key={i} className="text-muted-foreground">{para}</p>
        ))}
        {buttons.length > 0 && (
          <div className="flex gap-4">
            {buttons.map((btn, i) => (
              <Link key={i} to={btn.link}>
                <Button>{btn.text}</Button>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className={imagePosition === "left" ? "md:order-1" : ""}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title || "Section image"}
            className="rounded-2xl shadow-2xl w-full"
          />
        )}
      </div>
    </div>
  );
}

function CardsGridSection({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const cards = (content.cards as Array<{
    title: string;
    description: string;
    icon: string;
    link: string;
  }>) || [];

  return (
    <div>
      <div className="text-center mb-12">
        {title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>}
        {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = getIcon(card.icon);
          return (
            <Card key={i} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <CardHeader>
                {Icon && (
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                )}
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{card.description}</p>
                {card.link && (
                  <Link to={card.link} className="text-primary hover:underline mt-4 inline-block">
                    Learn more →
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function PricingTableSection({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const plans = (content.plans as Array<{
    name: string;
    price: string;
    features: string[];
    cta_text: string;
    cta_link: string;
    is_popular?: boolean;
  }>) || [];

  return (
    <div>
      <div className="text-center mb-12">
        {title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>}
        {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <Card key={i} className={`relative ${plan.is_popular ? "border-primary shadow-lg shadow-primary/20" : ""}`}>
            {plan.is_popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full">
                Popular
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-4xl font-bold mt-4">{plan.price}</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features?.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <LucideIcons.Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.cta_text && (
                <Link to={plan.cta_link || "#"} className="block">
                  <Button className="w-full" variant={plan.is_popular ? "default" : "outline"}>
                    {plan.cta_text}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ImageGallerySection({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const images = (content.images as Array<{ url: string; caption: string }>) || [];

  return (
    <div>
      <div className="text-center mb-12">
        {title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>}
        {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div key={i} className="group relative overflow-hidden rounded-lg">
            <img
              src={img.url}
              alt={img.caption || `Gallery image ${i + 1}`}
              className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {img.caption && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQSection({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const items = (content.items as Array<{ question: string; answer: string }>) || [];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        {title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>}
        {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
      </div>
      <Accordion type="single" collapsible className="space-y-4">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-4">
            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function CustomHTMLSection({ content }: { content: Record<string, unknown> }) {
  const html = content.html as string;
  const css = content.css as string;

  return (
    <div>
      {css && <style>{css}</style>}
      <div dangerouslySetInnerHTML={{ __html: html || "" }} />
    </div>
  );
}

function HeroBannerSection({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const backgroundImage = content.background_image as string;
  const ctaText = content.cta_text as string;
  const ctaLink = content.cta_link as string;
  const overlayOpacity = (content.overlay_opacity as number) || 0.5;

  return (
    <div
      className="relative rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center text-center"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
      <div className="relative z-10 p-8 max-w-3xl">
        {title && <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h2>}
        {subtitle && <p className="text-xl text-white/80 mb-8">{subtitle}</p>}
        {ctaText && (
          <Link to={ctaLink || "#"}>
            <Button size="lg" className="text-lg px-8">{ctaText}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

function TwoColumnSection({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const leftContent = content.left_content as string;
  const rightContent = content.right_content as string;
  const leftImage = content.left_image as string;
  const rightImage = content.right_image as string;

  return (
    <div>
      {title && <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{title}</h2>}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {leftImage && <img src={leftImage} alt="" className="rounded-lg w-full" />}
          {leftContent && <p className="text-muted-foreground">{leftContent}</p>}
        </div>
        <div className="space-y-4">
          {rightImage && <img src={rightImage} alt="" className="rounded-lg w-full" />}
          {rightContent && <p className="text-muted-foreground">{rightContent}</p>}
        </div>
      </div>
    </div>
  );
}

function FeatureListSection({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const features = (content.features as Array<{
    icon: string;
    title: string;
    description: string;
  }>) || [];

  return (
    <div>
      <div className="text-center mb-12">
        {title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>}
        {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {features.map((feature, i) => {
          const Icon = getIcon(feature.icon);
          return (
            <div key={i} className="flex gap-4">
              {Icon && (
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DynamicSection;
