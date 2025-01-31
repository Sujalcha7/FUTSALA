import React, { useState, useEffect } from "react";
import {
    Container,
    Box,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Textarea,
    Select,
    useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const AssignTasks = () => {
    const { user, setUser, isLoading, getUser } = useAuth();

    const navigate = useNavigate();
    const toast = useToast();
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(""); // Add this line
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        due_date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
        status: "PENDING",
    });

    const handleDateChange = (e) => {
        const selectedDate = e.target.value; // Format: YYYY-MM-DD
        const dateWithEndOfDay = new Date(
            selectedDate + "T23:59:59.999Z"
        ).toISOString();
        setFormData({
            ...formData,
            due_date: dateWithEndOfDay,
        });
    };

    useEffect(() => {
        console.log(`http://localhost:8000/api/employees/task/$(user.id)`);
        const fetchEmployees = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/employees/task/$(user.id)`,
                    {
                        credentials: "include",
                    }
                );
                if (!response.ok) throw new Error("Failed to fetch employees");
                const data = await response.json();
                setEmployees(data);
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
        fetchEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEmployee) {
            toast({
                title: "Error",
                description: "Please select an employee",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        try {
            const response = await fetch(
                `http://localhost:8000/api/employees/${selectedEmployee}/tasks`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) throw new Error("Failed to assign task");
            const data = await response.json();

            toast({
                title: "Success",
                description: "Task assigned successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate("/employees");
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
        <Container maxW="container.sm" py={10}>
            <Box bg="white" p={8} rounded="md" shadow="md">
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Employee</FormLabel>
                            <Select
                                placeholder="Select employee"
                                value={selectedEmployee}
                                onChange={(e) =>
                                    setSelectedEmployee(e.target.value)
                                }
                            >
                                {employees.map((employee) => (
                                    <option
                                        key={employee.id}
                                        value={employee.id}
                                    >
                                        {employee.username}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Title</FormLabel>
                            <Input
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Due Date</FormLabel>
                            <Input
                                type="date"
                                value={formData.due_date.split("T")[0]}
                                onChange={handleDateChange}
                            />
                        </FormControl>

                        <Button type="submit" colorScheme="teal" width="full">
                            Assign Task
                        </Button>
                    </VStack>
                </form>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button
                    colorScheme="blue"
                    onClick={() => navigate("/employees")}
                >
                    Back
                </Button>
            </Box>
        </Container>
    );
};

export default AssignTasks;
