import React, { useState, useEffect } from "react";
import {
    Container,
    Box,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Select,
    Textarea,
    useToast,
    Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const EditTask = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [tasks, setTasks] = useState([]);
    const [selectedTaskId, setSelectedTaskId] = useState("");
    const [taskFormData, setTaskFormData] = useState({
        title: "",
        description: "",
        due_date: "",
        status: "",
    });

    useEffect(() => {
        fetchTasks();
    }, []);

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
            setTasks(data);
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

    const handleTaskSelect = (taskId) => {
        const task = tasks.find((t) => t.id === parseInt(taskId));
        if (task) {
            setSelectedTaskId(taskId);
            setTaskFormData({
                title: task.title,
                description: task.description,
                due_date: task.due_date.split("T")[0], // Only keep YYYY-MM-DD
                status: task.status,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTaskId) {
            toast({
                title: "Error",
                description: "Please select a task to update",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/api/tasks/${selectedTaskId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(taskFormData),
                }
            );

            if (!response.ok) throw new Error("Failed to update task");

            toast({
                title: "Success",
                description: "Task updated successfully",
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
            <Heading mb={6}>Edit Task</Heading>
            <Box bg="white" p={8} rounded="md" shadow="md">
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Select Task</FormLabel>
                            <Select
                                value={selectedTaskId}
                                onChange={(e) =>
                                    handleTaskSelect(e.target.value)
                                }
                            >
                                <option value="">Select a task</option>
                                {tasks.map((task) => (
                                    <option key={task.id} value={task.id}>
                                        {task.title}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Title</FormLabel>
                            <Input
                                value={taskFormData.title}
                                onChange={(e) =>
                                    setTaskFormData({
                                        ...taskFormData,
                                        title: e.target.value,
                                    })
                                }
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                value={taskFormData.description}
                                onChange={(e) =>
                                    setTaskFormData({
                                        ...taskFormData,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Due Date</FormLabel>
                            <Input
                                type="date"
                                value={taskFormData.due_date.split("T")[0]}
                                onChange={(e) => {
                                    const selectedDate = e.target.value; // Format: YYYY-MM-DD
                                    const dateWithEndOfDay = new Date(
                                        selectedDate + "T23:59:59.999Z"
                                    ).toISOString();
                                    setTaskFormData({
                                        ...taskFormData,
                                        due_date: dateWithEndOfDay,
                                    });
                                }}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Status</FormLabel>
                            <Select
                                value={taskFormData.status}
                                onChange={(e) =>
                                    setTaskFormData({
                                        ...taskFormData,
                                        status: e.target.value,
                                    })
                                }
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </Select>
                        </FormControl>

                        <Button type="submit" colorScheme="teal" width="full">
                            Update Task
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

export default EditTask;
