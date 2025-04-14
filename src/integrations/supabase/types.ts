export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          farmer_id: string
          id: string
          location: string
          status: string
          title: string
          trader_id: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          farmer_id: string
          id?: string
          location: string
          status: string
          title: string
          trader_id: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          farmer_id?: string
          id?: string
          location?: string
          status?: string
          title?: string
          trader_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_trader_id_fkey"
            columns: ["trader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      auctions: {
        Row: {
          allow_auto_bids: boolean | null
          auction_type: string | null
          created_at: string | null
          current_price: number
          description: string | null
          end_time: string
          farmer_id: string | null
          id: string
          min_increment: number | null
          product_id: string | null
          quantity: number
          reserve_price: number | null
          shipping_options: string | null
          start_price: number
          start_time: string
          status: string | null
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          allow_auto_bids?: boolean | null
          auction_type?: string | null
          created_at?: string | null
          current_price: number
          description?: string | null
          end_time: string
          farmer_id?: string | null
          id?: string
          min_increment?: number | null
          product_id?: string | null
          quantity: number
          reserve_price?: number | null
          shipping_options?: string | null
          start_price: number
          start_time: string
          status?: string | null
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          allow_auto_bids?: boolean | null
          auction_type?: string | null
          created_at?: string | null
          current_price?: number
          description?: string | null
          end_time?: string
          farmer_id?: string | null
          id?: string
          min_increment?: number | null
          product_id?: string | null
          quantity?: number
          reserve_price?: number | null
          shipping_options?: string | null
          start_price?: number
          start_time?: string
          status?: string | null
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auctions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      bids: {
        Row: {
          amount: number
          auction_end_time: string
          auction_id: string | null
          bidder_id: string
          bidder_name: string
          created_at: string
          expires_at: string
          id: string
          is_highest_bid: boolean
          message: string | null
          previous_bid_amount: number | null
          product_id: string
          quantity: number
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          auction_end_time?: string
          auction_id?: string | null
          bidder_id: string
          bidder_name: string
          created_at?: string
          expires_at?: string
          id?: string
          is_highest_bid?: boolean
          message?: string | null
          previous_bid_amount?: number | null
          product_id: string
          quantity?: number
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          auction_end_time?: string
          auction_id?: string | null
          bidder_id?: string
          bidder_name?: string
          created_at?: string
          expires_at?: string
          id?: string
          is_highest_bid?: boolean
          message?: string | null
          previous_bid_amount?: number | null
          product_id?: string
          quantity?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      business_details: {
        Row: {
          business_address: string | null
          business_email: string | null
          business_name: string
          business_phone: string | null
          business_type: string
          business_website: string | null
          created_at: string | null
          gst_number: string | null
          id: string
          registration_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_address?: string | null
          business_email?: string | null
          business_name: string
          business_phone?: string | null
          business_type: string
          business_website?: string | null
          created_at?: string | null
          gst_number?: string | null
          id?: string
          registration_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_address?: string | null
          business_email?: string | null
          business_name?: string
          business_phone?: string | null
          business_type?: string
          business_website?: string | null
          created_at?: string | null
          gst_number?: string | null
          id?: string
          registration_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          id: string
          name: string
          size: number | null
          type: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          size?: number | null
          type: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          size?: number | null
          type?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      farm_details: {
        Row: {
          created_at: string | null
          farm_address: string
          farm_email: string | null
          farm_name: string
          farm_phone: string | null
          farm_size: number
          farm_size_unit: string
          farm_type: string
          id: string
          irrigation_type: string | null
          soil_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          farm_address: string
          farm_email?: string | null
          farm_name: string
          farm_phone?: string | null
          farm_size: number
          farm_size_unit?: string
          farm_type: string
          id?: string
          irrigation_type?: string | null
          soil_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          farm_address?: string
          farm_email?: string | null
          farm_name?: string
          farm_phone?: string | null
          farm_size?: number
          farm_size_unit?: string
          farm_type?: string
          id?: string
          irrigation_type?: string | null
          soil_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string | null
          id: string
          settings: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          settings?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          settings?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          delivery_date: string | null
          farmer_id: string
          id: string
          notes: string | null
          payment_date: string | null
          payment_status: string
          price: number
          product_id: string
          quantity: number
          status: string
          total_amount: number
          trader_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_date?: string | null
          farmer_id: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_status?: string
          price: number
          product_id: string
          quantity: number
          status?: string
          total_amount: number
          trader_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_date?: string | null
          farmer_id?: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_status?: string
          price?: number
          product_id?: string
          quantity?: number
          status?: string
          total_amount?: number
          trader_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          additional_images: string[] | null
          auction_id: string | null
          category: string
          category_id: string | null
          created_at: string
          description: string | null
          farmer_id: string
          farmer_name: string
          id: string
          image_url: string | null
          location: string
          location_id: string | null
          name: string
          price: number
          quality: string
          quantity: number
          status: string
          unit: string
          updated_at: string
        }
        Insert: {
          additional_images?: string[] | null
          auction_id?: string | null
          category: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          farmer_id: string
          farmer_name: string
          id?: string
          image_url?: string | null
          location: string
          location_id?: string | null
          name: string
          price: number
          quality: string
          quantity: number
          status?: string
          unit: string
          updated_at?: string
        }
        Update: {
          additional_images?: string[] | null
          auction_id?: string | null
          category?: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          farmer_id?: string
          farmer_name?: string
          id?: string
          image_url?: string | null
          location?: string
          location_id?: string | null
          name?: string
          price?: number
          quality?: string
          quantity?: number
          status?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          business_details: Json | null
          city: string | null
          created_at: string
          farm_details: Json | null
          id: string
          location_id: string | null
          name: string
          phone: string | null
          pincode: string | null
          role: string
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          business_details?: Json | null
          city?: string | null
          created_at?: string
          farm_details?: Json | null
          id: string
          location_id?: string | null
          name: string
          phone?: string | null
          pincode?: string | null
          role: string
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          business_details?: Json | null
          city?: string | null
          created_at?: string
          farm_details?: Json | null
          id?: string
          location_id?: string | null
          name?: string
          phone?: string | null
          pincode?: string | null
          role?: string
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
