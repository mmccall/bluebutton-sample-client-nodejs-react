import { Table, TableCaption, TableRow, TableCell, TableHead, TableBody, Tabs, TabPanel } from '@cmsgov/design-system';
import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import * as process from 'process';
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

export type EOBRecord = {
    id: string,
    code: string,
    display: string,
    amount: number
}

export type PatientRecord = {
    fullUrl: string,
    resource: string,
}

export type FHIRRecord = {
    fullUrl: string,
    resource: string,
}

export type ErrorResponse = {
    type: string,
    content: string,
}

export default function Records() {
    //const [records, setRecords] = useState<EOBRecord[]>([]);
    const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([]);
    const [observationRecords, setObservationRecords] = useState<PatientRecord[]>([]);
    const [message, setMessage] = useState<ErrorResponse>();
    /*
    * DEVELOPER NOTES:
    *  Here we are parsing through the different PDE Claim records
    * for the user/beneficiary.  We have hard coded certain pieces of this data. (ie...item[0])
    * You will want to find a method of parsing the FHIR JSON response to get the data
    * you need for your application.  Don't forget to use a 'Discriminator' to determine
    * which item within a list you want to get data from.
    * 
    * ie.  You are interested in getting all Prescription Drug NDC codes you would use the following criteria/discriminator
    * resource.item[N].coding[N].code WHERE resource.item[N].coding[N].system = "http://hl7.org/fhir/sid/ndc"
    * 
    * 
    * *NOTE* 
    * There are multiple claim types within the BB2 Sandbox, not just PDE (Part-D Events - Drug/Medication Claims).  There are also
    * Carrier Claims, SNF, HHA, Hospice, Inpatient, and Outpatient
    */
    useEffect(() => {
        const test_url = process.env.TEST_APP_API_URL ? process.env.TEST_APP_API_URL : '';


        // get eob data
        /**
        fetch(`${test_url}/api/data/benefit`)
            .then(res => {
                return res.json();
            }).then(eobData => {
                if (eobData.entry) {
                    const records: EOBRecord[] = eobData.entry.map((resourceData: any) => {
                        const resource = resourceData.resource;
                        return {
                            id: resource.id,
                            code: resource.item[0]?.productOrService?.coding[0]?.code || 'Unknown',
                            display: resource.item[0]?.productOrService?.coding[0]?.display || 'Unknown Prescription Drug',
                            amount: resource.item[0]?.adjudication[7]?.amount?.value || '0'
                        }
                    });
                    setRecords(records);
                }
                else {
                    if (eobData.message) {
                        setMessage({ "type": "error", "content": eobData.message || "Unknown" })
                    }
                }
            });
             */

        // get coverage data
        fetch(`${test_url}/api/data/coverage`)
        .then(res => {
            return res.json();
        }).then(fhirData => {
            if (fhirData.entry) {
                const records: FHIRRecord[] = fhirData.entry.map((resourceData: any) => {
                    return {
                        fullUrl: resourceData.fullUrl,
                        resource: resourceData.resource
                    }
                });
                setCoverageRecords(records);
            }
            else {
                if (fhirData.message) {
                    setMessage({ "type": "error", "content": fhirData.message || "Unknown" })
                }
            }
        });

        // get patient data
        fetch(`${test_url}/api/data/patient`)
            .then(res => {
                return res.json();
            }).then(fhirData => {
                if (fhirData.entry) {
                    const records: PatientRecord[] = fhirData.entry.map((resourceData: any) => {
                        return {
                            fullUrl: resourceData.fullUrl,
                            resource: resourceData.resource
                        }
                    });
                    setPatientRecords(records);
                }
                else {
                    if (fhirData.message) {
                        setMessage({ "type": "error", "content": fhirData.message || "Unknown" })
                    }
                }
            });

        // get observation data
        fetch(`${test_url}/api/data/observation`)
            .then(res => {
                return res.json();
            }).then(fhirData => {
                if (fhirData.entry) {
                    const records: PatientRecord[] = fhirData.entry.map((resourceData: any) => {
                        return {
                            fullUrl: resourceData.fullUrl,
                            resource: resourceData.resource
                        }
                    });
                    setObservationRecords(records);
                }
                else {
                    if (fhirData.message) {
                        setMessage({ "type": "error", "content": fhirData.message || "Unknown" })
                    }
                }
            });
    }, [])



    if (message) {
        return (
            <div className='full-width-card'>
                <Table className="ds-u-margin-top--2" stackable stackableBreakpoint="md">
                    <TableCaption>Error Response</TableCaption>
                    <TableHead>
                        <TableRow>
                            <TableCell id="column_1">Type</TableCell>
                            <TableCell id="column_2">Content</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell stackedTitle="Type" headers="column_1">
                                {message.type}
                            </TableCell>
                            <TableCell stackedTitle="Content" headers="column_2">
                                {message.content}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        );
    } else {
        return (
            


            <div className='ds-content'>
                
                <Tabs tablistClassName="ds-u-margin-top--3">
                    <TabPanel id="patient" tab="Patient Records">
                      <div>
                        <h2>Patient Entries</h2>
                        <FHIRPatient patientData={patientRecords}/>               
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
}
