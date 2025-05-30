import { Tabs, TabPanel } from '@cmsgov/design-system';
import FHIRPatient from './fhir/patient';
import FHIRCoverage from './fhir/coverage';
import FHIRCondition from './fhir/condition';
import FHIREncounter from './fhir/encounter';
import FHIRDiagnosticReport from './fhir/diagnosticReport';
import FHIRExplanationOfBenefit from './fhir/explanationOfBenefit';
import FHIRHealthcareService from './fhir/healthcareService';
import FHIRInsurancePlan from './fhir/insurancePlan';
import FHIRLocation from './fhir/location';
import FHIRMedicationRequest from './fhir/medicationRequest';
import FHIRObservation from './fhir/observation';
import FHIROrganization from './fhir/organization';
import FHIROrganizationAffiliation from './fhir/organizationAffiliation';
import FHIRPractitioner from './fhir/practitioner';
import FHIRPractitionerRole from './fhir/practitionerRole';
import FHIRProcedure from './fhir/procedure';
import FHIRServiceRequest from './fhir/serviceRequest';

export default function Records() { 
       
        return (
            <div className='ds-content'>
                
                <Tabs tablistClassName="ds-u-margin-top--3">
                    <TabPanel id="patient" tab="Patient Records">
                      <div>
                        <h2>Patient Entries</h2>
                        <FHIRPatient />               
                      </div>
                </TabPanel>
                <TabPanel id="clinical" tab="Clinical Records">
                      <div>
                        <h1>Conditions</h1>
                        <FHIRCondition />        
                        <h1>Diagnostic Reports</h1>
                        <FHIRDiagnosticReport />
                        <h1>Encounters</h1>
                        <FHIREncounter />  
                        <h1>Medication Requests</h1>
                        <FHIRMedicationRequest />
                        <h1>Observations</h1>
                        <FHIRObservation />
                        <h1>Procedures</h1>
                        <FHIRProcedure />
                        <h1>Service Request</h1>
                        <FHIRServiceRequest />
                      </div>
                </TabPanel>
                <TabPanel id="administrative" tab="Administrative Records">
                      <div>
                        <h1>Explanations Of Benefits</h1>     
                        <FHIRExplanationOfBenefit /> 
                        <h1>Coverage</h1>     
                        <FHIRCoverage /> 
                      </div>
                </TabPanel>
                <TabPanel id="supporting" tab="Supporting Records">
                    <div>
                        <h1>Healthcare Service</h1>
                        <FHIRHealthcareService />
                        <h1>Insurance Plan</h1>
                        <FHIRInsurancePlan />
                        <h1>Location</h1>
                        <FHIRLocation />
                        <h1>Organization</h1>
                        <FHIROrganization />
                        <h1>Organization Affiliation</h1>
                        <FHIROrganizationAffiliation />
                        <h1>Practitioner</h1>
                        <FHIRPractitioner />
                        <h1>Practitioner Role</h1>
                        <FHIRPractitionerRole />
                    </div>
                </TabPanel>
            </Tabs>
            </div>
        );
    }

