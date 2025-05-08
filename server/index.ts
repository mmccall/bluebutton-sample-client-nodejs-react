import express, {Request, Response} from "express";
import {AuthorizationToken, BlueButton} from "./sdk";
import * as fs from "fs";

//TODO HERE....  remove and recreate blue button functionality in a standalone js file.
//LOOK FOR ALL bb. entries and create new functions in a new file that does them.
//STEAL THE CODE FROM THE MAIN LIBRARY AS NECESSARY.
//can keep authorizationToken, it's a class and could be useful.
//need to replace all bluebutton functions.

interface User {
    authToken?: AuthorizationToken,   
    conditionData?: any,
    coverageData?: any,
    diagnosticReportData?: any,
    encounterData?: any,
    eobData?: any,
    healthcareServiceData?: any,
    insurancePlanData?: any,
    locationData?: any,
    medicationRequestData?: any,
    observationData?: any,
    organizationData?: any,
    organizationAffiliationData?: any,
    patientData?: any,
    profileData?: any,
    practitionerData?: any,
    practitionerRoleData?: any,
    procedureData?: any,
    serviceRequestData?: any,
    errors?: string[]
}

const BENE_DENIED_ACCESS = "access_denied"
const FE_MSG_ACCESS_DENIED = "Beneficiary denied app access to their data"
const ERR_QUERY_EOB = "Error when querying the patient's EOB!"
const ERR_MISSING_AUTH_CODE = "Response was missing access code!"
const ERR_MISSING_STATE = "State is required when using PKCE"

const app = express();

const bb = new BlueButton();
const authData = bb.generateAuthData();

// This is where medicare.gov beneficiary associated
// with the current logged in app user,
// in real app, this could be the app specific
// account management system

const loggedInUser: User = {
};

// helper to clean up cached eob data
function clearBB2Data() {
    loggedInUser.authToken = undefined;
    loggedInUser.eobData = {};
}
  
// AuthorizationToken holds access grant info:
// access token, expire in, expire at, token type, scope, refreh token, etc.
// it is associated with current logged in user in real app,
// check SDK js docs for more details.

let authToken: AuthorizationToken;

// auth flow: response with URL to redirect to Medicare.gov beneficiary login
app.get("/api/authorize/authurl", (req: Request, res: Response) => {
  res.send(bb.generateAuthorizeUrl(authData));
});

// auth flow: oauth2 call back
app.get("/api/bluebutton/callback", (req: Request, res: Response) => {
    (async (req: Request, res: Response) => {
        if (typeof req.query.error === "string") {
          // clear all cached claims eob data since the bene has denied access
          // for the application
          clearBB2Data();
          let errMsg = req.query.error;
          if (req.query.error === BENE_DENIED_ACCESS) {
              errMsg = FE_MSG_ACCESS_DENIED;
          }
          loggedInUser.eobData = {"message": errMsg};
          process.stdout.write(errMsg + '\n');
        } else {
          if (
            typeof req.query.code === "string" &&
            typeof req.query.state === "string"
          ) {
            try {
              authToken = await bb.getAuthorizationToken(
                authData,
                req.query.code,
                req.query.state
              );
              
              // data flow: after access granted
              // the app logic can fetch the beneficiary's data in app specific ways:
              // e.g. download EOB periodically etc.
              // access token can expire, SDK automatically refresh access token when that happens.
              const conditionResults = await bb.getConditionData(authToken);
              const coverageResults = await bb.getCoverageData(authToken);
              const diagnosticReportResults = await bb.getDiagnosticReportData(authToken);
              const encounterResults = await bb.getEncounterData(authToken);
              const eobResults = await bb.getExplanationOfBenefitData(authToken);
              const healthcareServiceResults = await bb.getHealthcareServiceData(authToken);
              const insurancePlanResults = await bb.getInsurancePlanData(authToken);
              const locationResults = await bb.getLocationData(authToken);
              const medicationRequestResults = await bb.getMedicationRequestData(authToken);
              const observationResults = await bb.getObservationData(authToken);
              const organizationResults = await bb.getObservationData(authToken);
              const organizationAffillitionResults = await bb.getOrganizationAffiliationData(authToken);
              const patientResults = await bb.getPatientData(authToken);
              const profileResults = await bb.getProfileData(authToken);
              const practitionerResults = await bb.getPractitionerData(authToken);
              const practitionerRoleResults = await bb.getPractitionerRole(authToken);
              const procedureResults = await bb.getProcedureData(authToken);
              const serviceRequestResults = await bb.getServiceRequestData(authToken);
           
              //just get authToken from last call if it changed during that.
              authToken = serviceRequestResults.token; // in case authToken got refreshed during fhir call
              loggedInUser.authToken = authToken;
              
              loggedInUser.conditionData = conditionResults.response?.data;
              loggedInUser.coverageData = coverageResults.response?.data;
              loggedInUser.diagnosticReportData = diagnosticReportResults.response?.data;
              loggedInUser.encounterData = encounterResults.response?.data;
              loggedInUser.eobData = eobResults.response?.data;
              loggedInUser.healthcareServiceData = healthcareServiceResults.response?.data;
              loggedInUser.insurancePlanData = insurancePlanResults.response?.data;
              loggedInUser.locationData = locationResults.response?.data;
              loggedInUser.medicationRequestData = medicationRequestResults.response?.data;
              loggedInUser.observationData = observationResults.response?.data;
              loggedInUser.organizationData = organizationResults.response?.data;
              loggedInUser.organizationAffiliationData = organizationAffillitionResults.response?.data;
              loggedInUser.patientData = patientResults.response?.data;
              loggedInUser.profileData = profileResults.response?.data;
              loggedInUser.practitionerData = practitionerResults.response?.data;
              loggedInUser.practitionerRoleData = practitionerRoleResults.response?.data;
              loggedInUser.procedureData = procedureResults.response?.data;
              loggedInUser.serviceRequestData = serviceRequestResults.response?.data;

              console.log(loggedInUser);

            } catch (e) {
              loggedInUser.eobData = {};
              process.stdout.write(ERR_QUERY_EOB + '\n');
              process.stdout.write("Exception: " + e + '\n');
            }
          } else {
            clearBB2Data();
            process.stdout.write(ERR_MISSING_AUTH_CODE + '\n');
            process.stdout.write("OR" + '\n');
            process.stdout.write(ERR_MISSING_STATE + '\n');
            process.stdout.write("AUTH CODE: " + req.query.code + '\n');
            process.stdout.write("STATE: " + req.query.state + '\n');
          }
        }
        const fe_redirect_url = 
        process.env.SELENIUM_TESTS ? 'http://client:3000' : 'http://localhost:3000';
        res.redirect(fe_redirect_url);
      }
      )(req, res);
});

app.get("/api/bluebutton/loadDefaults", (req: Request, res: Response) => {
    loggedInUser.eobData = loadDataFile("Dataset 1", "eobData");
    res.send(process.env.SELENIUM_TESTS ? 'http://client:3000' : 'http://localhost:3000');
});

// helper to load json data from file
function loadDataFile(dataset_name: string, resource_file_name: string): any {
    const filename = `./default_datasets/${dataset_name}/${resource_file_name}.json`
    const resource = fs.readFileSync(filename, 'utf-8')

    try {
        return JSON.parse(resource);
    } catch (error) {
        process.stdout.write("Error parsing JSON: " + error);
        return null
    }
}

/**
 * Data endpoints
 */
app.get("/api/data/patient", (req: Request, res: Response) => {
  if (loggedInUser.patientData) {
    res.json(loggedInUser.patientData);
  }
});

app.get("/api/data/benefit", (req: Request, res: Response) => {
  if (loggedInUser.eobData) {
    res.json(loggedInUser.eobData);
  }
});

// data flow: front end fetch eob
app.get("/api/data/observation", (req: Request, res: Response) => {
  if (loggedInUser.observationData) {
    res.json(loggedInUser.observationData);
  }
});

const port = 3001;

app.listen(port, () => {
    process.stdout.write(`[server]: Server is running at https://localhost:${port}`);
    process.stdout.write("\n");
});
