import { useDynamicSections } from "@/hooks/useDynamicSections";
import { DynamicSection } from "./DynamicSection";

interface DynamicSectionsRendererProps {
  page: string;
}

export function DynamicSectionsRenderer({ page }: DynamicSectionsRendererProps) {
  const { data: sections, isLoading } = useDynamicSections(page);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className="dynamic-sections">
      {sections.map((section) => (
        <DynamicSection key={section.id} section={section} />
      ))}
    </div>
  );
}

export default DynamicSectionsRenderer;
