import Header from "../components/layout/Header";
import { BottomNavigation } from "../components/layout/BottomNavigation";
import { AddRecordModal } from "../components/modals/AddRecordModal";
import ViewRecordModal from "../components/modals/ViewRecordModal";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { useToast } from "../hooks/use-toast";
import { useAccessibility } from "../contexts/AccessibilityContext";
import { Accessibility } from "lucide-react";

export function ProfilePage() {
  const { toast } = useToast();
  const {
    options,
    toggleHighContrast,
    toggleLargeText,
    toggleScreenReaderOptimized,
    toggleReducedMotion,
    resetAccessibilityOptions,
  } = useAccessibility();

  const showNotImplemented = () => {
    toast({
      title: "Not implemented",
      description: "This feature is not yet available in this demo."
    });
  };

  return (
    <div className="min-h-screen pb-16">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="shadow mb-6">
          <CardHeader className="pb-0">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-white text-2xl">
                  JD
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-bold mt-4">John Doe</CardTitle>
              <p className="text-neutral-500">john.doe@example.com</p>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-neutral-800 mb-4">Account Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Personal Information</h3>
                      <p className="text-sm text-neutral-500">Update your personal details</p>
                    </div>
                    <Button variant="outline" onClick={showNotImplemented}>Edit</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Security</h3>
                      <p className="text-sm text-neutral-500">Manage password and security settings</p>
                    </div>
                    <Button variant="outline" onClick={showNotImplemented}>Manage</Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-neutral-800 mb-4">Privacy & Data</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Data Storage</h3>
                      <p className="text-sm text-neutral-500">Manage how your medical data is stored</p>
                    </div>
                    <Button variant="outline" onClick={showNotImplemented}>Configure</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Export Data</h3>
                      <p className="text-sm text-neutral-500">Download a copy of your medical records</p>
                    </div>
                    <Button variant="outline" onClick={showNotImplemented}>Export</Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-neutral-800 mb-4">AI & Notifications</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">AI Analysis</h3>
                      <p className="text-sm text-neutral-500">Allow AI to analyze your medical records</p>
                    </div>
                    <Switch id="ai-analysis" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-neutral-500">Receive alerts about important updates</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-neutral-800 mb-4">
                  <span className="flex items-center gap-2">
                    <Accessibility className="h-5 w-5" />
                    Accessibility Settings
                  </span>
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">High Contrast</h3>
                      <p className="text-sm text-neutral-500">Increases contrast for better visibility</p>
                    </div>
                    <Switch 
                      id="high-contrast" 
                      checked={options.highContrast}
                      onCheckedChange={toggleHighContrast}
                      aria-label="Toggle high contrast mode"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Large Text</h3>
                      <p className="text-sm text-neutral-500">Increases text size throughout the app</p>
                    </div>
                    <Switch 
                      id="large-text"
                      checked={options.largeText}
                      onCheckedChange={toggleLargeText}
                      aria-label="Toggle large text mode"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Screen Reader Optimized</h3>
                      <p className="text-sm text-neutral-500">Improves compatibility with screen readers</p>
                    </div>
                    <Switch 
                      id="screen-reader" 
                      checked={options.screenReaderOptimized}
                      onCheckedChange={toggleScreenReaderOptimized}
                      aria-label="Toggle screen reader optimizations"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Reduced Motion</h3>
                      <p className="text-sm text-neutral-500">Minimizes animations and transitions</p>
                    </div>
                    <Switch 
                      id="reduced-motion"
                      checked={options.reducedMotion}
                      onCheckedChange={toggleReducedMotion}
                      aria-label="Toggle reduced motion mode"
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={resetAccessibilityOptions}
                    className="w-full mt-2"
                    aria-label="Reset all accessibility settings"
                  >
                    Reset Accessibility Settings
                  </Button>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border-red-300 text-red-500 hover:bg-red-50"
                onClick={showNotImplemented}
              >
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <BottomNavigation />
      <AddRecordModal />
      <ViewRecordModal />
    </div>
  );
}

export default ProfilePage;
