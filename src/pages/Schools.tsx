
import { useState, useEffect } from "react";
import { useSupabaseSchools, getDistricts } from "@/services/supabaseSchoolService";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, Pencil, Trash2, Loader2 } from "lucide-react";
import { School, District } from "@/types";
import { useQuery } from "@tanstack/react-query";

const Schools = () => {
  // State for managing schools
  const [schools, setSchools] = useState<School[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSchool, setCurrentSchool] = useState<Partial<School>>({});
  const [schoolToDelete, setSchoolToDelete] = useState<string | null>(null);
  
  // Use the custom hook for Supabase operations
  const { 
    isLoading, 
    error, 
    getSchools, 
    addSchool, 
    updateSchool, 
    deleteSchool 
  } = useSupabaseSchools();

  // Fetch schools using React Query
  const { data: schoolsData, refetch: refetchSchools } = useQuery({
    queryKey: ['schools'],
    queryFn: getSchools
  });

  // Fetch districts using React Query
  const { data: districtsData } = useQuery({
    queryKey: ['districts'],
    queryFn: getDistricts
  });

  // Update state when data is fetched
  useEffect(() => {
    if (schoolsData) {
      setSchools(schoolsData);
    }
  }, [schoolsData]);

  useEffect(() => {
    if (districtsData) {
      setDistricts(districtsData);
    }
  }, [districtsData]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (currentSchool.school_id) {
        // Update existing school
        await updateSchool(currentSchool as School);
      } else {
        // Add new school
        await addSchool({
          name: currentSchool.name || '',
          district_id: currentSchool.district_id
        });
      }
      
      // Refresh schools list
      refetchSchools();
      // Close dialog
      setIsDialogOpen(false);
      // Reset form
      setCurrentSchool({});
      
    } catch (error) {
      console.error("Error saving school:", error);
    }
  };

  // Handle school deletion
  const confirmDelete = async () => {
    if (!schoolToDelete) return;
    
    try {
      await deleteSchool(schoolToDelete);
      // Refresh schools list
      refetchSchools();
    } catch (error) {
      console.error("Error deleting school:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setSchoolToDelete(null);
    }
  };

  // Open dialog to add new school
  const openAddDialog = () => {
    setCurrentSchool({});
    setIsDialogOpen(true);
  };

  // Open dialog to edit school
  const openEditDialog = (school: School) => {
    setCurrentSchool(school);
    setIsDialogOpen(true);
  };

  // Open dialog to confirm deletion
  const openDeleteDialog = (schoolId: string) => {
    setSchoolToDelete(schoolId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Schools</h1>
          <Button onClick={openAddDialog} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add School
          </Button>
        </div>

        {/* Schools Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>District</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Loading schools...
                    </div>
                  </TableCell>
                </TableRow>
              ) : schools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No schools found
                  </TableCell>
                </TableRow>
              ) : (
                schools.map((school) => (
                  <TableRow key={school.school_id}>
                    <TableCell>{school.name}</TableCell>
                    <TableCell>{school.district || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(school)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(school.school_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add/Edit School Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {currentSchool.school_id ? 'Edit School' : 'Add School'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">School Name</Label>
                  <Input
                    id="name"
                    value={currentSchool.name || ''}
                    onChange={(e) => 
                      setCurrentSchool({ ...currentSchool, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="district">District</Label>
                  <Select
                    value={currentSchool.district_id || ''}
                    onValueChange={(value) => 
                      setCurrentSchool({ ...currentSchool, district_id: value })
                    }
                  >
                    <SelectTrigger id="district">
                      <SelectValue placeholder="Select a district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.district_id} value={district.district_id}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {currentSchool.school_id ? 'Save Changes' : 'Add School'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the school.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default Schools;
