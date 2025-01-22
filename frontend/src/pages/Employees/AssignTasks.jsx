import React, { useState } from "react";
import {
    Container,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    useToast,
    Textarea,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AssignTask = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        employee_id: "",
        deadline: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/employees/assign-task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to assign task");

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
        <Container maxW="container.md" mt={8} mb={200}>
            <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
                <Heading size="lg" mb={6}>
                    Assign New Task
                </Heading>
                <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                    <FormControl isRequired>
                        <FormLabel>Employee ID</FormLabel>
                        <Input
                            type="number"
                            value={formData.employee_id}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    employee_id: e.target.value,
                                })
                            }
                            placeholder="Enter employee ID"
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Task Title</FormLabel>
                        <Input
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            placeholder="Enter task title"
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
                            placeholder="Enter task description"
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Deadline</FormLabel>
                        <Input
                            type="datetime-local"
                            value={formData.deadline}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    deadline: e.target.value,
                                })
                            }
                        />
                    </FormControl>

                    <Button type="submit" colorScheme="blue" width="full">
                        Assign Task
                    </Button>

                    <Button width="full" onClick={() => navigate("/employees")}>
                        Back to Employees
                    </Button>
                </VStack>
            </Box>
        </Container>
    );
};

// export default EditTask;
export { AssignTask };
