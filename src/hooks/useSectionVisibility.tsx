import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SectionVisibility {
  blog: boolean;
  minecraft_plans: boolean;
  discord_plans: boolean;
  minecraft_server: boolean;
  telegram_bots: boolean;
  cinematic_reel: boolean;
  discord_automation: boolean;
  testimonials: boolean;
  stats_counter: boolean;
  achievements: boolean;
  about: boolean;
  skills: boolean;
  projects: boolean;
  contact: boolean;
  future_goals: boolean;
}

const defaultVisibility: SectionVisibility = {
  blog: true,
  minecraft_plans: true,
  discord_plans: true,
  minecraft_server: true,
  telegram_bots: true,
  cinematic_reel: true,
  discord_automation: true,
  testimonials: true,
  stats_counter: true,
  achievements: true,
  about: true,
  skills: true,
  projects: true,
  contact: true,
  future_goals: true,
};

export const useSectionVisibility = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["section_visibility"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "section_visibility")
        .maybeSingle();

      if (error || !data) return defaultVisibility;
      return data.value as unknown as SectionVisibility;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const isVisible = (section: keyof SectionVisibility): boolean => {
    if (!data) return true;
    return data[section] ?? true;
  };

  return {
    visibility: data || defaultVisibility,
    isVisible,
    isLoading,
    refetch,
  };
};
