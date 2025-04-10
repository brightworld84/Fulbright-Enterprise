import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "../lib/queryClient";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Search,
  Server,
  UserRound,
  Stethoscope,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";

type FHIRServerStatus = {
  success: boolean;
  provider: string;
  message: string;
};

type PatientData = {
  id: string;
  name: string;
  birthDate?: string;
  gender?: string;
};

export default function FHIRIntegrationPage() {
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<'epic' | 'cerner' | 'allscripts'>('epic');
  const [patientId, setPatientId] = useState('');
  const [practitionerId, setPractitionerId] = useState('');

  const serverStatusQuery = useQuery({
    queryKey: ['fhir', 'status', selectedProvider],
    queryFn: async () => {
      const response = await apiRequest({
        url: `/api/fhir/status/${selectedProvider}`,
        method: 'GET',
        on401: 'throw',
      });
      return response as FHIRServerStatus;
    },
    enabled: !!selectedProvider,
    refetchInterval: 30000,
  });

  const patientQuery = useQuery({
    queryKey: ['fhir', 'patient', selectedProvider, patientId],
    queryFn: async () => {
      const response = await apiRequest({
        url: `/api/fhir/patient/${selectedProvider}/${patientId}`,
        method: 'GET',
        on401: 'throw',
      });
      return response as { success: boolean; patient: PatientData };
    },
    enabled: false,
  });

  const importRecordsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest({
        url: '/api/fhir/import-records',
        method: 'POST',
        body: { providerType: selectedProvider, patientId },
        on401: 'throw',
      });
      return response as { success: boolean; count: number };
    },
    onSuccess: () => {
      toast({
        title: "Records Imported",
        description: "The patient records were successfully imported.",
      });
      queryClient.invalidateQueries({ queryKey: ['records'] });
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import patient records.",
        variant: "destructive",
      });
    },
  });

  const extractProviderMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest({
        url: '/api/fhir/extract-provider',
        method: 'POST',
        body: { providerType: selectedProvider, practitionerId },
        on401: 'throw',
      });
      return response as { success: boolean };
    },
    onSuccess: () => {
      toast({
        title: "Provider Extracted",
        description: "Provider information was successfully extracted and saved.",
      });
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      setPractitionerId('');
    },
    onError: (error: any) => {
      toast({
        title: "Extraction Failed",
        description: error.message || "Failed to extract provider information.",
        variant: "destructive",
      });
    },
  });

  const handleSearchPatient = () => {
    if (!patientId) {
      toast({
        title: "Patient ID Required",
        description: "Please enter a valid patient ID.",
        variant: "destructive",
      });
      return;
    }
    patientQuery.refetch();
  };

  const handleImportRecords = () => {
    if (!patientId) {
      toast({
        title: "Patient ID Required",
        description: "Please enter a valid patient ID to import records.",
        variant: "destructive",
      });
      return;
    }
    importRecordsMutation.mutate();
  };

  const handleExtractProvider = () => {
    if (!practitionerId) {
      toast({
        title: "Practitioner ID Required",
        description: "Please enter a valid practitioner ID.",
        variant: "destructive",
      });
      return;
    }
    extractProviderMutation.mutate();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>FHIR Integration</CardTitle>
          <CardDescription>Import medical data from external systems.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Select
            value={selectedProvider}
            onValueChange={(value) => setSelectedProvider(value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Providers</SelectLabel>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="cerner">Cerner</SelectItem>
                <SelectItem value="allscripts">Allscripts</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            placeholder="Enter Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
          <Button onClick={handleSearchPatient}>
            <Search className="w-4 h-4 mr-2" /> Search Patient
          </Button>

          <Button onClick={handleImportRecords} disabled={importRecordsMutation.isPending}>
            <Download className="w-4 h-4 mr-2" /> Import Records
          </Button>

          <Separator />

          <Input
            placeholder="Enter Practitioner ID"
            value={practitionerId}
            onChange={(e) => setPractitionerId(e.target.value)}
          />
          <Button onClick={handleExtractProvider} disabled={extractProviderMutation.isPending}>
            <Stethoscope className="w-4 h-4 mr-2" /> Extract Provider Info
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            All data is securely transmitted using FHIR protocol.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default FHIRIntegrationPage;


