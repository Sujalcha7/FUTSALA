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

const EmployeeTasksList = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/tasks/all",
                    {
                        credentials: "include",
                    }
                );
                if (!response.ok) throw new Error("Failed to fetch tasks");
                const data = await response.json();
                console.log("Fetched tasks:", data); // Debug log
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        };
        fetchTasks();
    }, []);
    return (
        <Container maxW="container.xl" mt={4} mb={200}>
            <Box
                py={4}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Heading size="lg">Employee Tasks List</Heading>
                <HStack spacing={4}>
                    <Button
                        colorScheme="blue"
                        onClick={() => navigate("/employees")}
                    >
                        Back
                    </Button>
                </HStack>
            </Box>
            <TableContainer mt={8}>
                <Table variant="striped" colorScheme="gray" size="md">
                    <Thead>
                        <Tr>
                            {showDeleteOptions && <Th>Select</Th>}
                            <Th>Task ID</Th>
                            <Th>Title</Th>
                            <Th>Description</Th>
                            <Th>Created At</Th>
                            <Th>Due Date</Th>
                            <Th>Status</Th>
                            <Th>Assigned To</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {tasks.map((task) => {
                            console.log("Task data:", task); // Debug log
                            return (
                                <Tr key={task.id}>
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
                                                    value={task.id.toString()}
                                                />
                                            </RadioGroup>
                                        </Td>
                                    )}
                                    <Td>{task.id}</Td>
                                    <Td>{task.title}</Td>
                                    <Td>{task.description}</Td>
                                    <Td>
                                        {new Date(
                                            task.created_at
                                        ).toLocaleDateString()}
                                    </Td>
                                    <Td>
                                        {new Date(
                                            task.due_date
                                        ).toLocaleDateString()}
                                    </Td>
                                    <Td>{task.status}</Td>
                                    <Td>
                                        {task.user?.username || "No email"}{" "}
                                        {/* Temporary show email instead of username */}
                                    </Td>
                                </Tr>
                            );
                        })}
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

export default EmployeeTasksList;
