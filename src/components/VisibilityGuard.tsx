import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSectionVisibility, SectionVisibility } from "@/hooks/useSectionVisibility";

interface VisibilityGuardProps {
  section: keyof SectionVisibility;
  children: ReactNode;
}

export default function VisibilityGuard({ section, children }: VisibilityGuardProps) {
  const { isVisible, isLoading } = useSectionVisibility();

  // Show loading while fetching visibility settings
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Redirect to 404 if section is disabled
  if (!isVisible(section)) {
    return <Navigate to="/not-found" replace />;
  }

  return <>{children}</>;
}
