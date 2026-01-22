export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          color: string
          current_value: number | null
          description: string | null
          display_order: number | null
          icon: string
          id: string
          is_active: boolean | null
          is_progress: boolean | null
          target_value: number | null
          title: string
        }
        Insert: {
          color: string
          current_value?: number | null
          description?: string | null
          display_order?: number | null
          icon: string
          id?: string
          is_active?: boolean | null
          is_progress?: boolean | null
          target_value?: number | null
          title: string
        }
        Update: {
          color?: string
          current_value?: number | null
          description?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean | null
          is_progress?: boolean | null
          target_value?: number | null
          title?: string
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ad_clicks: {
        Row: {
          ad_id: string
          clicked_at: string
          id: string
          page_url: string | null
          user_agent: string | null
        }
        Insert: {
          ad_id: string
          clicked_at?: string
          id?: string
          page_url?: string | null
          user_agent?: string | null
        }
        Update: {
          ad_id?: string
          clicked_at?: string
          id?: string
          page_url?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_clicks_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_impressions: {
        Row: {
          ad_id: string
          id: string
          page_url: string | null
          user_agent: string | null
          viewed_at: string
        }
        Insert: {
          ad_id: string
          id?: string
          page_url?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
        Update: {
          ad_id?: string
          id?: string
          page_url?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_impressions_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      addons: {
        Row: {
          category: string
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          price: number
        }
        Insert: {
          category: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
        }
        Update: {
          category?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      admin_face_data: {
        Row: {
          face_descriptor: Json
          id: string
          is_enabled: boolean | null
          last_verified_at: string | null
          registered_at: string | null
          user_id: string
        }
        Insert: {
          face_descriptor: Json
          id?: string
          is_enabled?: boolean | null
          last_verified_at?: string | null
          registered_at?: string | null
          user_id: string
        }
        Update: {
          face_descriptor?: Json
          id?: string
          is_enabled?: boolean | null
          last_verified_at?: string | null
          registered_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ads: {
        Row: {
          ad_type: string
          adsense_slot: string | null
          click_url: string | null
          clicks: number
          created_at: string
          end_date: string | null
          html_content: string | null
          id: string
          image_url: string | null
          impressions: number
          is_active: boolean
          placement: string
          priority: number
          size: string | null
          start_date: string | null
          target_pages: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          ad_type?: string
          adsense_slot?: string | null
          click_url?: string | null
          clicks?: number
          created_at?: string
          end_date?: string | null
          html_content?: string | null
          id?: string
          image_url?: string | null
          impressions?: number
          is_active?: boolean
          placement?: string
          priority?: number
          size?: string | null
          start_date?: string | null
          target_pages?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          ad_type?: string
          adsense_slot?: string | null
          click_url?: string | null
          clicks?: number
          created_at?: string
          end_date?: string | null
          html_content?: string | null
          id?: string
          image_url?: string | null
          impressions?: number
          is_active?: boolean
          placement?: string
          priority?: number
          size?: string | null
          start_date?: string | null
          target_pages?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          read_time: string | null
          slug: string
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          read_time?: string | null
          slug: string
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          read_time?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string | null
          id: string
          messages: Json | null
          session_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          messages?: Json | null
          session_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          messages?: Json | null
          session_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          type: string
          usage_limit: number | null
          used_count: number | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          type: string
          usage_limit?: number | null
          used_count?: number | null
          value: number
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          type?: string
          usage_limit?: number | null
          used_count?: number | null
          value?: number
        }
        Relationships: []
      }
      dynamic_sections: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_visible: boolean
          layout_type: string
          order_index: number
          page: string
          section_name: string
          slug: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          layout_type?: string
          order_index?: number
          page?: string
          section_name: string
          slug: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          layout_type?: string
          order_index?: number
          page?: string
          section_name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      easter_eggs_discovered: {
        Row: {
          discovered_at: string | null
          egg_name: string
          id: string
          user_id: string | null
        }
        Insert: {
          discovered_at?: string | null
          egg_name: string
          id?: string
          user_id?: string | null
        }
        Update: {
          discovered_at?: string | null
          egg_name?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      game_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      game_scores: {
        Row: {
          game_name: string
          id: string
          played_at: string | null
          player_name: string | null
          score: number
          user_id: string | null
        }
        Insert: {
          game_name: string
          id?: string
          played_at?: string | null
          player_name?: string | null
          score: number
          user_id?: string | null
        }
        Update: {
          game_name?: string
          id?: string
          played_at?: string | null
          player_name?: string | null
          score?: number
          user_id?: string | null
        }
        Relationships: []
      }
      internal_notes: {
        Row: {
          created_at: string | null
          created_by: string | null
          entity_id: string
          entity_type: string
          id: string
          note: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          entity_id: string
          entity_type: string
          id?: string
          note: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          note?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      media_library: {
        Row: {
          created_at: string
          id: string
          name: string
          size: number | null
          type: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          size?: number | null
          type?: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          size?: number | null
          type?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          addons: Json | null
          buyer_discord: string | null
          buyer_email: string
          buyer_name: string
          buyer_phone: string | null
          cloudflare_enabled: boolean | null
          cloudflare_txn_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          invoice_url: string | null
          order_id: string
          paid_at: string | null
          payment_txn_id: string | null
          plan_name: string
          plan_price: number
          server_access_details: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          addons?: Json | null
          buyer_discord?: string | null
          buyer_email: string
          buyer_name: string
          buyer_phone?: string | null
          cloudflare_enabled?: boolean | null
          cloudflare_txn_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_url?: string | null
          order_id: string
          paid_at?: string | null
          payment_txn_id?: string | null
          plan_name: string
          plan_price: number
          server_access_details?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          addons?: Json | null
          buyer_discord?: string | null
          buyer_email?: string
          buyer_name?: string
          buyer_phone?: string | null
          cloudflare_enabled?: boolean | null
          cloudflare_txn_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_url?: string | null
          order_id?: string
          paid_at?: string | null
          payment_txn_id?: string | null
          plan_name?: string
          plan_price?: number
          server_access_details?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      page_analytics: {
        Row: {
          created_at: string | null
          date: string
          id: string
          page_path: string
          unique_visitors: number | null
          views: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          page_path: string
          unique_visitors?: number | null
          views?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          page_path?: string
          unique_visitors?: number | null
          views?: number | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          category: string
          created_at: string | null
          delivery: string | null
          description: string | null
          display_order: number | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          delivery?: string | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          delivery?: string | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referred_id: string
          referrer_id: string
          score_awarded: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          referred_id: string
          referrer_id: string
          score_awarded?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          referred_id?: string
          referrer_id?: string
          score_awarded?: number
        }
        Relationships: []
      }
      scheduled_content: {
        Row: {
          action: string
          content_id: string
          content_type: string
          created_at: string | null
          created_by: string | null
          id: string
          scheduled_for: string
          status: string | null
        }
        Insert: {
          action: string
          content_id: string
          content_type: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          scheduled_for: string
          status?: string | null
        }
        Update: {
          action?: string
          content_id?: string
          content_type?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          scheduled_for?: string
          status?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: Json
          id: string
          section_key: string
          updated_at: string
        }
        Insert: {
          content?: Json
          id?: string
          section_key: string
          updated_at?: string
        }
        Update: {
          content?: Json
          id?: string
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      social_links: {
        Row: {
          display_order: number
          icon: string | null
          id: string
          is_visible: boolean
          platform: string
          url: string
        }
        Insert: {
          display_order?: number
          icon?: string | null
          id?: string
          is_visible?: boolean
          platform: string
          url: string
        }
        Update: {
          display_order?: number
          icon?: string | null
          id?: string
          is_visible?: boolean
          platform?: string
          url?: string
        }
        Relationships: []
      }
      stats: {
        Row: {
          color: string | null
          display_order: number | null
          icon: string
          id: string
          is_active: boolean | null
          label: string
          suffix: string | null
          value: number
        }
        Insert: {
          color?: string | null
          display_order?: number | null
          icon: string
          id?: string
          is_active?: boolean | null
          label: string
          suffix?: string | null
          value: number
        }
        Update: {
          color?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean | null
          label?: string
          suffix?: string | null
          value?: number
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          company: string | null
          content: string
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          rating: number | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          content: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          rating?: number | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          content?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          rating?: number | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      theme_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      trash_bin: {
        Row: {
          data: Json
          deleted_at: string | null
          deleted_by: string | null
          expires_at: string | null
          id: string
          original_id: string
          original_table: string
        }
        Insert: {
          data: Json
          deleted_at?: string | null
          deleted_by?: string | null
          expires_at?: string | null
          id?: string
          original_id: string
          original_table: string
        }
        Update: {
          data?: Json
          deleted_at?: string | null
          deleted_by?: string | null
          expires_at?: string | null
          id?: string
          original_id?: string
          original_table?: string
        }
        Relationships: []
      }
      user_game_stats: {
        Row: {
          games_played: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          games_played?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          games_played?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_scores: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string
          referred_by: string | null
          score: number
          tools_used: number
          total_earned: number
          total_spent: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code: string
          referred_by?: string | null
          score?: number
          tools_used?: number
          total_earned?: number
          total_spent?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_by?: string | null
          score?: number
          tools_used?: number
          total_earned?: number
          total_spent?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      visitor_locations: {
        Row: {
          city: string | null
          country: string | null
          country_code: string | null
          id: string
          latitude: number | null
          longitude: number | null
          visited_at: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          country_code?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          visited_at?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          country_code?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          visited_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      use_tool_score: {
        Args: { p_tool_name: string; p_user_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
