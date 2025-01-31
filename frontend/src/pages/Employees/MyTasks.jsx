import React, { useState, useEffect } from "react";
import {
    Container,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Badge,
    useToast,
} from "@chakra-ui/react";
import { useAuth } from "../../AuthContext";

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const toast = useToast();
    const { user, setUser, isLoading, getUser } = useAuth();

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/tasks/${taskId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!response.ok) throw new Error("Failed to update task status");

            toast({
                title: "Success",
                description: "Task status updated successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            fetchTasks();
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

    const fetchTasks = async () => {
        console.log(`http://localhost:8000/api/employees/tasks/${user.id}`);
        try {
            const response = await fetch(
                `http://localhost:8000/api/employees/tasks/${user.id}`,
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
            });
        }
    };

    return (
        <Container maxW="container.xl">
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Title</Th>
                        <Th>Due Date</Th>
                        <Th>Status</Th>
                        {/* <Th>Actions</Th> */}
                    </Tr>
                </Thead>
                <Tbody>
                    {tasks.map((task) => (
                        <Tr key={task.id}>
                            <Td>{task.title}</Td>
                            <Td>
                                {new Date(task.due_date).toLocaleDateString()}
                            </Td>
                            <Td>
                                <Badge
                                    colorScheme={
                                        task.status === "completed"
                                            ? "green"
                                            : "yellow"
                                    }
                                >
                                    {task.status}
                                </Badge>
                            </Td>
                            {/* <Td>
                                <Button
                                    colorScheme="green"
                                    isDisabled={task.status === "completed"}
                                    onClick={() =>
                                        handleStatusUpdate(task.id, "completed")
                                    }
                                >
                                    Complete
                                </Button>
                            </Td> */}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Container>
    );
};

export default MyTasks;
