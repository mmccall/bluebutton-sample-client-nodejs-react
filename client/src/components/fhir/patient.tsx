import { Table, TableRow, TableCell, TableHead, Tabs, TabPanel } from '@cmsgov/design-system';
import ReactJson from 'react-json-view';

export type PatientResource = {
    name: string[],
    birthDate: string,
    id: string
}

export type PatientRoot = {
    fullUrl: string,
    resource: PatientResource[],
}

export default function FHIRPatient( {patientData} ) {
    return (
        <div>

            {patientData.map(record => {
                return (
                    <div className="ds-l-col--6 ds-u-margin--2">
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
                                            Name:
                                        </TableCell>
                                        <TableCell>
                                            {record.resource.name[0].text}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Date of Birth:
                                        </TableCell>
                                        <TableCell>
                                            {record.resource.birthDate}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Identifier:
                                        </TableCell>
                                        <TableCell>
                                            {record.resource.id}
                                        </TableCell>
                                    </TableRow>
                                </Table>
                            </TabPanel>
                            <TabPanel key="source" id="source" tab="Source">
                                <ReactJson src={record} collapsed={true} />
                            </TabPanel>
                        </Tabs>
                    </div>
                )
            })}
        </div>
    );
}