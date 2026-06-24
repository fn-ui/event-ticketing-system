import { supabase } from "../lib/supabase";

export const getEvents =
  async () => {
    const { data, error } =
      await supabase
        .from("events")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      throw error;
    }

    return data;
  };

export const getEventById =
  async (id) => {
    const { data, error } =
      await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
      throw error;
    }

    return data;
  };

export const createEvent =
  async (eventData) => {
    const { data, error } =
      await supabase
        .from("events")
        .insert([eventData])
        .select()
        .single();

    if (error) {
      throw error;
    }

    return data;
  };

export const updateEvent =
  async (
    id,
    updatedData
  ) => {
    const { data, error } =
      await supabase
        .from("events")
        .update(updatedData)
        .eq("id", id)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return data;
  };

export const deleteEvent =
  async (id) => {
    const { error } =
      await supabase
        .from("events")
        .delete()
        .eq("id", id);

    if (error) {
      throw error;
    }

    return true;
  };