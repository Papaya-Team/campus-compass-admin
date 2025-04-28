
import { supabase } from "@/integrations/supabase/client";
import { Student, Campus, Grade, Language } from "@/types";
import { useState } from "react";

// Utility function for retrying failed requests
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
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

// Service hooks for student data using Supabase
export function useSupabaseStudents() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStudents = async (): Promise<Student[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await retryOperation(async () => {
        console.log("Fetching students from Supabase...");
        const { data, error } = await supabase
          .from('student')
          .select(`
            id,
            name,
            campus_id,
            grade_id,
            language_id,
            campus:campus_id (name),
            grade:grade_id (name),
            language:language_id (name)
          `);
        
        if (error) {
          console.error("Supabase error:", error);
          throw new Error(error.message);
        }
        
        console.log("Successfully fetched students:", data);
        
        // Map the Supabase response to our Student type
        return data.map((item: any) => ({
          student_id: item.id.toString(),
          name: item.name,
          campus_id: item.campus_id,
          grade_id: item.grade_id,
          language_id: item.language_id,
          campus: item.campus?.name,
        }));
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch students";
      setError(errorMessage);
      console.error("Final error fetching students:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getStudentById = async (id: string): Promise<Student | undefined> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('student')
        .select(`
          id,
          name,
          campus_id,
          grade_id,
          language_id,
          campus:campus_id (name),
          grade:grade_id (name),
          language:language_id (name)
        `)
        .eq('id', parseInt(id))
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return {
        student_id: data.id.toString(),
        name: data.name,
        campus_id: data.campus_id,
        grade_id: data.grade_id,
        language_id: data.language_id,
        campus: data.campus?.name,
      };
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching student by ID:", err);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const addStudent = async (student: Omit<Student, "student_id">): Promise<Student> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('student')
        .insert({
          name: student.name,
          campus_id: student.campus_id,
          grade_id: student.grade_id,
          language_id: student.language_id
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return {
        student_id: data.id.toString(),
        name: data.name,
        campus_id: data.campus_id,
        grade_id: data.grade_id,
        language_id: data.language_id,
        campus: student.campus,
      };
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding student:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStudent = async (updatedStudent: Student): Promise<Student> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('student')
        .update({
          name: updatedStudent.name,
          campus_id: updatedStudent.campus_id,
          grade_id: updatedStudent.grade_id,
          language_id: updatedStudent.language_id
        })
        .eq('id', parseInt(updatedStudent.student_id))
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return {
        student_id: data.id.toString(),
        name: data.name,
        campus_id: data.campus_id,
        grade_id: data.grade_id,
        language_id: data.language_id,
        campus: updatedStudent.campus,
      };
    } catch (err: any) {
      setError(err.message);
      console.error("Error updating student:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStudent = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('student')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) {
        throw new Error(error.message);
      }
      
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error("Error deleting student:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addMultipleStudents = async (newStudents: Omit<Student, "student_id">[]): Promise<Student[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const studentsToInsert = newStudents.map(student => ({
        name: student.name,
        campus_id: student.campus_id,
        grade_id: student.grade_id,
        language_id: student.language_id
      }));
      
      const { data, error } = await supabase
        .from('student')
        .insert(studentsToInsert)
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Map the returned data to our Student type
      return data.map((item: any, index: number) => ({
        student_id: item.id.toString(),
        name: item.name,
        campus_id: item.campus_id,
        grade_id: item.grade_id,
        language_id: item.language_id,
        campus: newStudents[index].campus,
      }));
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding multiple students:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent,
    addMultipleStudents
  };
}

// Get reference data from Supabase with retry logic
export async function getCampuses(): Promise<Campus[]> {
  try {
    return await retryOperation(async () => {
      const { data, error } = await supabase
        .from('campus')
        .select('campus_id, name');
      
      if (error) throw error;
      
      return data;
    });
  } catch (error) {
    console.error("Error fetching campuses:", error);
    return [];
  }
}

export async function getGrades(): Promise<Grade[]> {
  try {
    return await retryOperation(async () => {
      const { data, error } = await supabase
        .from('grade')
        .select('grade_id, name');
      
      if (error) throw error;
      
      return data;
    });
  } catch (error) {
    console.error("Error fetching grades:", error);
    return [];
  }
}

export async function getLanguages(): Promise<Language[]> {
  try {
    return await retryOperation(async () => {
      const { data, error } = await supabase
        .from('language')
        .select('language_id, name');
      
      if (error) throw error;
      
      return data;
    });
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
}
