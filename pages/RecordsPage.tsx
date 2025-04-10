import Header from "../components/layout/Header";
import { BottomNavigation } from "../components/layout/BottomNavigation";
import { FloatingActionButton } from "../components/layout/FloatingActionButton";
import RecordCard from "../components/dashboard/RecordCard";
import { AddRecordModal } from "../components/modals/AddRecordModal";
import ViewRecordModal from "../components/modals/ViewRecordModal";
import { MedicalDataCharts } from "../components/data/MedicalDataCharts";
import EmailImportCard from "../components/email/EmailImportCard";
import EmailSimulationForm from "../components/email/EmailSimulationForm";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useMedicalRecord } from "../contexts/MedicalRecordContext";
import { Input } from "../components/ui/input";
import { PlusCircle, Search, BarChart3, List, MailPlus } from "lucide-react";
import { useAccessibility } from "../contexts/AccessibilityContext";

export function RecordsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "visualize">("list");
  const { setShowAddRecordModal } = useMedicalRecord();
  const { options } = useAccessibility();

  const recordsQuery = useQuery({
    queryKey: ["/api/records"],
    staleTime: 60000, // 1 minute
  });

  if (recordsQuery.isLoading) {
    return (
      <div className="min-h-screen pb-16">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  const records = recordsQuery.data || [];

  // Filter records based on search query and active tab
  const filteredRecords = Array.isArray(records) ? records.filter(record => {
    const matchesSearch = 
      searchQuery === "" || 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.provider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (!matchesSearch) return false;
    
    if (activeTab === "all") return true;
    return record.recordType.toLowerCase() === activeTab.toLowerCase();
  }) : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={`min-h-screen pb-16 ${options.highContrast ? "high-contrast" : ""} ${options.largeText ? "large-text" : ""}`}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-neutral-800 mb-4">Medical Records</h1>
        
        {/* Email Import Card - only show when authenticated */}
        {recordsQuery.isSuccess && <EmailImportCard />}
        
        {/* View mode toggle */}
        <div className="flex justify-end mb-4">
          <div className="bg-muted inline-flex rounded-lg p-1">
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-lg px-3"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4 mr-2" />
              List View
            </Button>
            <Button 
              variant={viewMode === "visualize" ? "default" : "ghost"}
              size="sm"
              className="rounded-lg px-3"
              onClick={() => setViewMode("visualize")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Visualize
            </Button>
          </div>
        </div>
        
        {viewMode === "visualize" ? (
          <MedicalDataCharts records={Array.isArray(records) ? records : []} />
        ) : (
          <Card className="shadow mb-6">
            <CardContent className="p-6">
              <div className="mb-4 relative">
                <Input
                  type="text"
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
                <Search className="h-4 w-4 absolute left-3 top-3 text-neutral-400" />
              </div>
              
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start overflow-x-auto py-2 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="lab">Lab Results</TabsTrigger>
                  <TabsTrigger value="imaging">Imaging</TabsTrigger>
                  <TabsTrigger value="medication">Medications</TabsTrigger>
                  <TabsTrigger value="consultation">Consultations</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab}>
                  {filteredRecords.length > 0 ? (
                    <div className="space-y-4">
                      {filteredRecords.map(record => (
                        <RecordCard key={record.id} record={record} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-neutral-200 rounded-lg">
                      <PlusCircle className="h-12 w-12 text-neutral-300 mx-auto mb-2" />
                      <h3 className="text-lg font-medium text-neutral-700 mb-1">No records found</h3>
                      <p className="text-sm text-neutral-500 max-w-md mx-auto mb-4">
                        {searchQuery 
                          ? "Try adjusting your search or category filter"
                          : "Start by adding your first medical record"}
                      </p>
                      <Button 
                        onClick={() => setShowAddRecordModal(true)}
                        className="bg-primary mt-2"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Record
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
        
        {/* Add summary card at the bottom when in list view */}
        {viewMode === "list" && Array.isArray(records) && records.length > 0 && (
          <Card className="shadow mb-6 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">Visualize Your Health Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Switch to visualization view to see trends and patterns in your medical records
                  </p>
                </div>
                <Button 
                  onClick={() => setViewMode("visualize")}
                  className="whitespace-nowrap"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Charts
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Email Simulation Section (Development Only) */}
        {__DEV__ && recordsQuery.isSuccess && (          
          <div className="mt-8 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-neutral-800">Email Simulation</h2>
              <div className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                Development Feature
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              This section allows you to test the email-to-record functionality without setting up an actual email server.
            </p>
            <EmailSimulationForm />
          </div>
        )}
      </main>
      
      <FloatingActionButton />
      <BottomNavigation />
      <AddRecordModal />
      <ViewRecordModal />
    </div>
  );
}

export default RecordsPage;
