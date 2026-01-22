import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Ad {
  id: string;
  title: string;
  ad_type: "banner" | "adsense" | "affiliate" | "popup" | "native";
  placement: "header" | "sidebar" | "between-sections" | "footer" | "popup" | "sticky-mobile" | "in-article";
  image_url?: string;
  html_content?: string;
  adsense_slot?: string;
  click_url?: string;
  impressions: number;
  clicks: number;
  is_active: boolean;
  priority: number;
  start_date?: string;
  end_date?: string;
  target_pages?: string[];
  size: "small" | "medium" | "large" | "leaderboard" | "rectangle" | "skyscraper";
  created_at: string;
  updated_at: string;
}

export const useAds = (placement?: string, page?: string) => {
  return useQuery({
    queryKey: ["ads", placement, page],
    queryFn: async () => {
      let query = supabase
        .from("ads")
        .select("*")
        .eq("is_active", true)
        .order("priority", { ascending: false });

      if (placement) {
        query = query.eq("placement", placement);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter by target pages if specified
      let filteredAds = data as Ad[];
      if (page) {
        filteredAds = filteredAds.filter(
          (ad) => !ad.target_pages?.length || ad.target_pages.includes(page)
        );
      }

      return filteredAds;
    },
  });
};

export const useAllAds = () => {
  return useQuery({
    queryKey: ["all-ads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Ad[];
    },
  });
};

export const useAdStats = () => {
  return useQuery({
    queryKey: ["ad-stats"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [impressionsToday, clicksToday, totalAds] = await Promise.all([
        supabase
          .from("ad_impressions")
          .select("id", { count: "exact" })
          .gte("viewed_at", today.toISOString()),
        supabase
          .from("ad_clicks")
          .select("id", { count: "exact" })
          .gte("clicked_at", today.toISOString()),
        supabase.from("ads").select("id, impressions, clicks"),
      ]);

      const ads = totalAds.data || [];
      const totalImpressions = ads.reduce((sum, ad) => sum + (ad.impressions || 0), 0);
      const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);

      return {
        impressionsToday: impressionsToday.count || 0,
        clicksToday: clicksToday.count || 0,
        totalImpressions,
        totalClicks,
        ctr: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0",
        activeAds: ads.length,
      };
    },
  });
};

export const useCreateAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ad: Partial<Ad>) => {
      const { data, error } = await supabase
        .from("ads")
        .insert([ad as any])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      queryClient.invalidateQueries({ queryKey: ["all-ads"] });
    },
  });
};

export const useUpdateAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Ad> & { id: string }) => {
      const { data, error } = await supabase
        .from("ads")
        .update(updates as any)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      queryClient.invalidateQueries({ queryKey: ["all-ads"] });
    },
  });
};

export const useDeleteAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      queryClient.invalidateQueries({ queryKey: ["all-ads"] });
    },
  });
};

export const useTrackImpression = () => {
  return useMutation({
    mutationFn: async (adId: string) => {
      // Track impression
      await supabase.from("ad_impressions").insert([{
        ad_id: adId,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
      }]);

      // Increment counter on ads table
      const { data: ad } = await supabase.from("ads").select("impressions").eq("id", adId).single();
      if (ad) {
        await supabase
          .from("ads")
          .update({ impressions: (ad.impressions || 0) + 1 })
          .eq("id", adId);
      }
    },
  });
};

export const useTrackClick = () => {
  return useMutation({
    mutationFn: async (adId: string) => {
      // Track click
      await supabase.from("ad_clicks").insert([{
        ad_id: adId,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
      }]);

      // Increment counter (simple update)
      const { data: ad } = await supabase.from("ads").select("clicks").eq("id", adId).single();
      if (ad) {
        await supabase
          .from("ads")
          .update({ clicks: (ad.clicks || 0) + 1 })
          .eq("id", adId);
      }
    },
  });
};
