import { Table, TableBody, TableCaption, TableRow, TableCell, TableHead, Tabs, TabPanel } from '@cmsgov/design-system';
import React, { useEffect, useState } from 'react';
import * as process from 'process';
import ReactJson from 'react-json-view';
import { ExplanationOfBenefit } from 'fhir/r4';

export type FHIRRecord = {
    fullUrl: string,
    resource: ExplanationOfBenefit,
}

export type ErrorResponse = {
    type: string,
    content: string,
}

export default function FHIRExplanationOfBenefit() {
    const [bundleRecords, setBundleRecords] = useState<FHIRRecord[]>([]);
    const [bundleCount, setBundleCount] = useState(0)
    const [message, setMessage] = useState<ErrorResponse>();

    useEffect(() => {
        const test_url = process.env.TEST_APP_API_URL ? process.env.TEST_APP_API_URL : '';

        // get coverage data
        fetch(`${test_url}/api/data/explanationOfBenefit`)
            .then(res => {
                console.log(res);
                return res.json();
            }).then(fhirData => {
                console.log(fhirData);
                if (fhirData.resourceType === "Bundle") {
                    setBundleCount(fhirData.total)
                    const records: FHIRRecord[] = fhirData.entry.map((resourceData: any) => {
                        return {
                            fullUrl: resourceData.fullUrl,
                            resource: resourceData.resource
                        }
                    });
                    setBundleRecords(records);
                }
                else {
                    if (fhirData.resourceType === "OperationOutcome") {
                        console.log(fhirData.issue);
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
            <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-lg-flex-direction--row ds-u-flex-wrap--nowrap ds-u-lg-flex-wrap--wrap">
                <div><h2>Total Records: {bundleCount}</h2></div>
                {bundleRecords.map(record => {
                    return (
                        <div className="default-card ds-u-margin--2">
                            <Tabs>
                                <TabPanel key="display" id="display" tab="Display">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    key="Description"
                                                    id="description"
                                                >
                                                    Description
                                                </TableCell>
                                                <TableCell
                                                    key="Value"
                                                    id="value"
                                                >
                                                    Value
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableRow>
                                            <TableCell>
                                               Insurer:
                                            </TableCell>
                                            <TableCell>
                                                {record.resource.insurer.display}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Outcome:
                                            </TableCell>
                                            <TableCell>
                                               {record.resource.outcome}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Completed:
                                            </TableCell>
                                            <TableCell>
                                                {record.resource.billablePeriod?.end}
                                            </TableCell>
                                        </TableRow>
                                    </Table>
                                </TabPanel>
                                <TabPanel key="source" id="source" tab="Source">
                                    <div style={{ minHeight: '230px' }}>
                                        <ReactJson src={record} collapsed={true} />
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                    )
                })}
            </div>
        )
    };
}