import React, { useState, useEffect } from "react";
import {
    Container,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    VStack,
    useToast,
    Textarea,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Divider,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const EditEmployee = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [employeeFormData, setEmployeeFormData] = useState({
        username: "",
        email: "",
        phonenumber: "",
        is_active: true,
    });

    const [taskFormData, setTaskFormData] = useState({
        title: "",
        description: "",
        deadline: "",
        status: "Pending",
    });

    // Updated fetch employees function with better error handling
    useEffect(() => {
        fetchEmployees();
    }, [toast]);

    // Updated fetch tasks function
    useEffect(() => {
        fetchTasks();
    }, [selectedEmployee, toast]);

    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/employee/all", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
            toast({
                title: "Error",
                description: `Failed to load employees: ${error.message}`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTasks = async () => {
        if (!selectedEmployee) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8000/api/tasks/employee/${selectedEmployee.id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setError("Failed to load tasks. Please try again later.");
            toast({
                title: "Error",
                description: `Failed to load tasks: ${error.message}`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmployeeSelect = (employeeId) => {
        const employee = employees.find((e) => e.id === parseInt(employeeId));
        if (employee) {
            setSelectedEmployee(employee);
            setEmployeeFormData({
                username: employee.username,
                email: employee.email,
                phonenumber: employee.phonenumber,
                is_active: employee.is_active,
            });
            setSelectedTask(null);
            setTaskFormData({
                title: "",
                description: "",
                deadline: "",
                status: "Pending",
            });
        }
    };

    const handleTaskSelect = (taskId) => {
        const task = tasks.find((t) => t.id === parseInt(taskId));
        if (task) {
            setSelectedTask(task);
            setTaskFormData({
                title: task.title,
                description: task.description,
                deadline: task.deadline?.split(".")[0],
                status: task.status,
            });
        }
    };

    // Updated employee update function
    const handleEmployeeSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `/api/employee/${selectedEmployee.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(employeeFormData),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            toast({
                title: "Success",
                description: "Employee updated successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Refresh employee list
            fetchEmployees();
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to update employee: ${error.message}`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Updated task update function
    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/tasks/${selectedTask.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...taskFormData,
                    assigned_to: selectedEmployee.id,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Refresh tasks list
            fetchTasks();

            toast({
                title: "Success",
                description: "Task updated successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to update task: ${error.message}`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    if (isLoading && !selectedEmployee) {
        return (
            <Container maxW="container.xl" mt={8}>
                <Box textAlign="center">
                    <Spinner size="xl" />
                    <Text mt={4}>Loading employees...</Text>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" mt={8} mb={200}>
            <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
                <Heading size="lg" mb={6}>
                    Edit Employee Details
                </Heading>

                <FormControl mb={6}>
                    <FormLabel>Select Employee</FormLabel>
                    <Select
                        placeholder="Select employee"
                        onChange={(e) => handleEmployeeSelect(e.target.value)}
                    >
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.username} - {employee.email}
                            </option>
                        ))}
                    </Select>
                </FormControl>

                {selectedEmployee && (
                    <Tabs isFitted variant="enclosed">
                        <TabList mb="1em">
                            <Tab>Employee Details</Tab>
                            <Tab>Tasks</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <VStack
                                    spacing={4}
                                    as="form"
                                    onSubmit={handleEmployeeSubmit}
                                >
                                    <FormControl isRequired>
                                        <FormLabel>Username</FormLabel>
                                        <Input
                                            value={employeeFormData.username}
                                            onChange={(e) =>
                                                setEmployeeFormData({
                                                    ...employeeFormData,
                                                    username: e.target.value,
                                                })
                                            }
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            type="email"
                                            value={employeeFormData.email}
                                            onChange={(e) =>
                                                setEmployeeFormData({
                                                    ...employeeFormData,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Phone Number</FormLabel>
                                        <Input
                                            value={employeeFormData.phonenumber}
                                            onChange={(e) =>
                                                setEmployeeFormData({
                                                    ...employeeFormData,
                                                    phonenumber: e.target.value,
                                                })
                                            }
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            value={employeeFormData.is_active.toString()}
                                            onChange={(e) =>
                                                setEmployeeFormData({
                                                    ...employeeFormData,
                                                    is_active:
                                                        e.target.value ===
                                                        "true",
                                                })
                                            }
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">
                                                Inactive
                                            </option>
                                        </Select>
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        colorScheme="blue"
                                        width="full"
                                    >
                                        Update Employee Details
                                    </Button>
                                </VStack>
                            </TabPanel>

                            <TabPanel>
                                {isLoading ? (
                                    <Box textAlign="center" py={10}>
                                        <Spinner size="xl" />
                                        <Text mt={4}>Loading tasks...</Text>
                                    </Box>
                                ) : error ? (
                                    <Box
                                        textAlign="center"
                                        py={10}
                                        color="red.500"
                                    >
                                        <Text>{error}</Text>
                                    </Box>
                                ) : tasks.length === 0 ? (
                                    <Box textAlign="center" py={10}>
                                        <Text>
                                            No tasks assigned to this employee.
                                        </Text>
                                    </Box>
                                ) : (
                                    <>
                                        <TableContainer mb={6}>
                                            <Table variant="simple">
                                                <Thead>
                                                    <Tr>
                                                        <Th>Title</Th>
                                                        <Th>Description</Th>
                                                        <Th>Deadline</Th>
                                                        <Th>Status</Th>
                                                        <Th>Action</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {tasks.map((task) => (
                                                        <Tr key={task.id}>
                                                            <Td>
                                                                {task.title}
                                                            </Td>
                                                            <Td>
                                                                {
                                                                    task.description
                                                                }
                                                            </Td>
                                                            <Td>
                                                                {new Date(
                                                                    task.deadline
                                                                ).toLocaleString()}
                                                            </Td>
                                                            <Td>
                                                                {task.status}
                                                            </Td>
                                                            <Td>
                                                                <Button
                                                                    size="sm"
                                                                    colorScheme="blue"
                                                                    onClick={() =>
                                                                        handleTaskSelect(
                                                                            task.id
                                                                        )
                                                                    }
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </TableContainer>

                                        {selectedTask && (
                                            <>
                                                <Divider my={6} />
                                                <Heading size="md" mb={4}>
                                                    Edit Task
                                                </Heading>
                                                <VStack
                                                    spacing={4}
                                                    as="form"
                                                    onSubmit={handleTaskSubmit}
                                                >
                                                    <FormControl isRequired>
                                                        <FormLabel>
                                                            Title
                                                        </FormLabel>
                                                        <Input
                                                            value={
                                                                taskFormData.title
                                                            }
                                                            onChange={(e) =>
                                                                setTaskFormData(
                                                                    {
                                                                        ...taskFormData,
                                                                        title: e
                                                                            .target
                                                                            .value,
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    </FormControl>

                                                    <FormControl isRequired>
                                                        <FormLabel>
                                                            Description
                                                        </FormLabel>
                                                        <Textarea
                                                            value={
                                                                taskFormData.description
                                                            }
                                                            onChange={(e) =>
                                                                setTaskFormData(
                                                                    {
                                                                        ...taskFormData,
                                                                        description:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    </FormControl>

                                                    <FormControl isRequired>
                                                        <FormLabel>
                                                            Deadline
                                                        </FormLabel>
                                                        <Input
                                                            type="datetime-local"
                                                            value={
                                                                taskFormData.deadline
                                                            }
                                                            onChange={(e) =>
                                                                setTaskFormData(
                                                                    {
                                                                        ...taskFormData,
                                                                        deadline:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    </FormControl>

                                                    <FormControl isRequired>
                                                        <FormLabel>
                                                            Status
                                                        </FormLabel>
                                                        <Select
                                                            value={
                                                                taskFormData.status
                                                            }
                                                            onChange={(e) =>
                                                                setTaskFormData(
                                                                    {
                                                                        ...taskFormData,
                                                                        status: e
                                                                            .target
                                                                            .value,
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            <option value="Pending">
                                                                Pending
                                                            </option>
                                                            <option value="In Progress">
                                                                In Progress
                                                            </option>
                                                            <option value="Completed">
                                                                Completed
                                                            </option>
                                                        </Select>
                                                    </FormControl>

                                                    <Button
                                                        type="submit"
                                                        colorScheme="blue"
                                                        width="full"
                                                    >
                                                        Update Task
                                                    </Button>
                                                </VStack>
                                            </>
                                        )}
                                    </>
                                )}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                )}

                <Button
                    width="full"
                    mt={6}
                    onClick={() => navigate("/employees")}
                >
                    Back to Employees
                </Button>
            </Box>
        </Container>
    );
};

// Custom hook for managing API errors and loading states
const useApiRequest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const toast = useToast();

    const makeRequest = async (requestFn) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await requestFn();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Received non-JSON response from server");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            setError(error.message);
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, makeRequest };
};

// Custom hook for managing form data
const useFormData = (initialState) => {
    const [data, setData] = useState(initialState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const reset = () => {
        setData(initialState);
    };

    return [data, handleChange, reset];
};

// Date formatting utility
const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

// Status badge component
const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
        switch (status.toLowerCase()) {
            case "completed":
                return "green";
            case "in progress":
                return "blue";
            case "pending":
                return "yellow";
            default:
                return "gray";
        }
    };

    return (
        <Badge colorScheme={getStatusColor()} px={2} py={1} borderRadius="full">
            {status}
        </Badge>
    );
};

export default EditEmployee;
