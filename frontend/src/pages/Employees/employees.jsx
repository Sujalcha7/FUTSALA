import React from "react";
import {
    Container,
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from "@chakra-ui/react";

const EmployeeList = () => {
    // Mock employee data
    const employeeData = [
        {
            employeeId: 1,
            shiftStartTime: "9:00 AM",
            shiftEndTime: "5:00 PM",
            assignedTo: "Front Desk",
            salary: 50000,
        },
        {
            employeeId: 2,
            shiftStartTime: "1:00 PM",
            shiftEndTime: "9:00 PM",
            assignedTo: "Technical Support",
            salary: 60000,
        },
        {
            employeeId: 3,
            shiftStartTime: "6:00 AM",
            shiftEndTime: "2:00 PM",
            assignedTo: "Maintenance",
            salary: 45000,
        },
    ];

    return (
        <Container maxW="container.xl">
            <Box py={6}>
                <Heading mb={6} size="lg" textAlign="center">
                    All Employees
                </Heading>
            </Box>
            <TableContainer pb={200}>
                <Table size="md">
                    <Thead>
                        <Tr>
                            <Th>Employee ID</Th>
                            <Th>Shift Start Time</Th>
                            <Th>Shift End Time</Th>
                            <Th>Assigned To</Th>
                            <Th>Salary</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {employeeData.map((employee) => (
                            <Tr key={employee.employeeId}>
                                <Td>{employee.employeeId}</Td>
                                <Td>{employee.shiftStartTime}</Td>
                                <Td>{employee.shiftEndTime}</Td>
                                <Td>{employee.assignedTo}</Td>
                                <Td>{employee.salary}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default EmployeeList;
