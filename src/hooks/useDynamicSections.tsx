import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DynamicSection {
  id: string;
  section_name: string;
  slug: string;
  layout_type: string;
  content: Record<string, unknown>;
  order_index: number;
  is_visible: boolean;
  page: string;
}

export function useDynamicSections(page?: string) {
  return useQuery({
    queryKey: ["dynamic-sections", page],
    queryFn: async () => {
      let query = supabase
        .from("dynamic_sections")
        .select("*")
        .eq("is_visible", true)
        .order("order_index", { ascending: true });

      if (page) {
        query = query.eq("page", page);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DynamicSection[];
    },
  });
}

export function useSiteContent(sectionKey: string) {
  return useQuery({
    queryKey: ["site-content", sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", sectionKey)
        .maybeSingle();
      if (error) throw error;
      return data?.content as Record<string, unknown> | null;
    },
  });
}

export function useSocialLinks() {
  return useQuery({
    queryKey: ["social-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .eq("is_visible", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useThemeSettings() {
  return useQuery({
    queryKey: ["theme-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("theme_settings")
        .select("*");
      if (error) throw error;
      
      const settings: Record<string, unknown> = {};
      data?.forEach((item) => {
        settings[item.key] = item.value;
      });
      return settings;
    },
  });
}
