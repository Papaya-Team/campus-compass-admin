
import { supabase } from "@/integrations/supabase/client";
import { School, District } from "@/types";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

// Utility function for retrying failed requests
async function retryOperation(operation: any, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1}/${maxRetries} for database operation`);
      return await operation();
    } catch (err) {
      console.error(`Attempt ${attempt + 1} failed:`, err);
      lastError = err;
      
      if (attempt < maxRetries - 1) {
        // Wait before next retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError; // If all retries fail
}

export function useSupabaseSchools() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSchools = async (): Promise<School[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await retryOperation(async () => {
        console.log("Fetching schools from Supabase...");
        const { data, error } = await supabase
          .from('school')
          .select(`
            school_id,
            name,
            district_id,
            district:district_id (name)
          `);
        
        if (error) {
          console.error("Supabase error:", error);
          throw new Error(error.message);
        }
        
        console.log("Successfully fetched schools:", data);
        
        // Map the Supabase response to our School type
        return data.map((item: any) => ({
          school_id: item.school_id,
          name: item.name,
          district_id: item.district_id,
          district: item.district?.name,
        }));
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch schools";
      setError(errorMessage);
      console.error("Final error fetching schools:", err);
      toast.error("Failed to fetch schools", {
        description: errorMessage
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getSchoolById = async (id: string): Promise<School | undefined> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await retryOperation(async () => {
        const { data, error } = await supabase
          .from('school')
          .select(`
            school_id,
            name,
            district_id,
            district:district_id (name)
          `)
          .eq('school_id', id)
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        return {
          school_id: data.school_id,
          name: data.name,
          district_id: data.district_id,
          district: data.district?.name,
        };
      });
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching school by ID:", err);
      toast.error("Failed to fetch school details", {
        description: err.message
      });
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const addSchool = async (school: Omit<School, "school_id">): Promise<School> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await retryOperation(async () => {
        // Generate a UUID for the school_id
        const school_id = crypto.randomUUID();
        
        const { data, error } = await supabase
          .from('school')
          .insert({
            school_id: school_id,  // Include the generated UUID
            name: school.name,
            district_id: school.district_id
          })
          .select()
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        toast.success("School added successfully");

        return {
          school_id: data.school_id,
          name: data.name,
          district_id: data.district_id,
          district: school.district,
        };
      });
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding school:", err);
      toast.error("Failed to add school", {
        description: err.message
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSchool = async (updatedSchool: School): Promise<School> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await retryOperation(async () => {
        const { data, error } = await supabase
          .from('school')
          .update({
            name: updatedSchool.name,
            district_id: updatedSchool.district_id
          })
          .eq('school_id', updatedSchool.school_id)
          .select()
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        toast.success("School updated successfully");
        
        return {
          school_id: data.school_id,
          name: data.name,
          district_id: data.district_id,
          district: updatedSchool.district,
        };
      });
    } catch (err: any) {
      setError(err.message);
      console.error("Error updating school:", err);
      toast.error("Failed to update school", {
        description: err.message
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSchool = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await retryOperation(async () => {
        const { error } = await supabase
          .from('school')
          .delete()
          .eq('school_id', id);
        
        if (error) {
          throw new Error(error.message);
        }
        
        toast.success("School deleted successfully");
        return true;
      });
    } catch (err: any) {
      setError(err.message);
      console.error("Error deleting school:", err);
      toast.error("Failed to delete school", {
        description: err.message
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getSchools,
    getSchoolById,
    addSchool,
    updateSchool,
    deleteSchool
  };
}

// Function to fetch districts for dropdowns
export async function getDistricts(): Promise<District[]> {
  try {
    return await retryOperation(async () => {
      const { data, error } = await supabase
        .from('district')
        .select('district_id, name, region_id');
      
      if (error) throw error;
      
      return data;
    });
  } catch (error) {
    console.error("Error fetching districts:", error);
    toast.error("Failed to load districts");
    return [];
  }
}
