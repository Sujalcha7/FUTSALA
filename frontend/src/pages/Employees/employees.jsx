import React, { useState, useEffect } from "react";

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
    Button,
    HStack,
    Radio,
    RadioGroup,
    useToast,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [employees, setEmployees] = useState([]);

    const fetchEmployees = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/api/employees/all",
                {
                    credentials: "include",
                }
            );
            if (!response.ok) throw new Error("Failed to fetch employees");
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleDelete = async () => {
        try {
            if (selectedEmployees.length === 0) {
                toast({
                    title: "Error",
                    description: "Please select employees to delete",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            for (const employeeId of selectedEmployees) {
                const response = await fetch(
                    `http://localhost:8000/api/users/${employeeId}`,
                    {
                        method: "DELETE",
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(
                        error.detail ||
                            `Failed to delete employee ${employeeId}`
                    );
                }
            }

            toast({
                title: "Success",
                description: "Selected employees deleted successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            setSelectedEmployees([]);
            setShowDeleteOptions(false);
            fetchEmployees();
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="container.xl" mt={4} mb={200}>
            <Box
                py={4}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Heading size="lg">Employee List</Heading>
                <HStack spacing={4}>
                    <Button
                        colorScheme="blue"
                        onClick={() => navigate("/employee-create")}
                    >
                        Add Employee
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={() => setShowDeleteOptions(!showDeleteOptions)}
                    >
                        Delete Employee
                    </Button>
                    <Button
                        colorScheme="green"
                        onClick={() => navigate("/edit-employee")}
                    >
                        Edit Tasks
                    </Button>
                    <Button
                        colorScheme="purple"
                        onClick={() => navigate("/assign-tasks")}
                    >
                        Assign Tasks
                    </Button>
                    <Button
                        colorScheme="teal"
                        onClick={() => navigate("/employee-tasks-list")}
                    >
                        View Tasks
                    </Button>
                </HStack>
            </Box>
            <TableContainer mt={8}>
                <Table variant="striped" colorScheme="gray" size="md">
                    <Thead>
                        <Tr>
                            {showDeleteOptions && <Th>Select</Th>}
                            <Th>ID</Th>
                            <Th>Username</Th>
                            <Th>Email</Th>
                            <Th>Phone Number</Th>
                            <Th>Status</Th>
                            <Th>Role</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {employees.length === 0 ? (
                            <Tr>
                                <Td
                                    colSpan={showDeleteOptions ? 7 : 6}
                                    textAlign="center"
                                >
                                    No employees found
                                </Td>
                            </Tr>
                        ) : (
                            employees.map((employee) => (
                                <Tr key={employee.id}>
                                    {showDeleteOptions && (
                                        <Td>
                                            <RadioGroup
                                                onChange={(value) =>
                                                    setSelectedEmployees(
                                                        (prev) =>
                                                            prev.includes(value)
                                                                ? prev.filter(
                                                                      (id) =>
                                                                          id !==
                                                                          value
                                                                  )
                                                                : [
                                                                      ...prev,
                                                                      value,
                                                                  ]
                                                    )
                                                }
                                            >
                                                <Radio
                                                    value={employee.id.toString()}
                                                />
                                            </RadioGroup>
                                        </Td>
                                    )}
                                    <Td>{employee.id}</Td>
                                    <Td>{employee.username}</Td>
                                    <Td>{employee.email}</Td>
                                    <Td>{employee.phonenumber}</Td>
                                    <Td>
                                        {employee.is_active
                                            ? "Active"
                                            : "Inactive"}
                                    </Td>
                                    <Td>{employee.role}</Td>
                                </Tr>
                            ))
                        )}
                    </Tbody>
                </Table>
            </TableContainer>

            {showDeleteOptions && (
                <Box textAlign="right" mt={4}>
                    <Button colorScheme="red" onClick={handleDelete}>
                        Confirm Delete
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default EmployeeList;
