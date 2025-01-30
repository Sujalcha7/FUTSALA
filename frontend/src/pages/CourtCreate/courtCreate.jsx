import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  HStack,
  IconButton,
  Select,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";

const CourtCreation = () => {
  const [courtName, setCourtName] = useState("");
  const [courtType, setCourtType] = useState("indoor");
  const [capacity, setCapacity] = useState(0);
  const [description, setDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState(0);
  const [isAvailable, setIsAvailable] = useState("true");
  const [images, setImages] = useState([""]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleAddImage = () => {
    setImages([...images, ""]);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const courtData = {
      court_name: courtName,
      court_type: courtType,
      capacity: capacity,
      description: description,
      hourly_rate: hourlyRate,
      is_available: isAvailable === "true",
      images: images.filter((img) => img.trim() !== ""),
    };

    try {
        console.log(courtData);
      const response = await axios.post(
        "http://localhost:8000/api/courts/",
        courtData,
        {
            headers: {
              "Content-Type": "application/json",
            },
        }
      );

      if (!response.status === 201) {
        throw new Error(response.data.detail || "Failed to create court");
      }

      toast({
        title: "Success",
        description: "Court created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Clear form
      setCourtName("");
      setCourtType("indoor");
      setCapacity(0);
      setDescription("");
      setHourlyRate(0);
      setIsAvailable("true");
      setImages([""]);

      navigate("/courts");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>Court Creation Form</Heading>
        <FormControl>
          <FormLabel>Court Name</FormLabel>
          <Input type="text" value={courtName} onChange={(e) => setCourtName(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Court Type</FormLabel>
          <Select value={courtType} onChange={(e) => setCourtType(e.target.value)}>
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Capacity</FormLabel>
          <Input type="number" value={capacity} onChange={(e) => setCapacity(e.target.valueAsNumber)} min={0} step={1} />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Hourly Rate</FormLabel>
          <Input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.valueAsNumber)} />
        </FormControl>
        <FormControl>
          <FormLabel>Is Available</FormLabel>
          <Select value={isAvailable} onChange={(e) => setIsAvailable(e.target.value)}>
            <option value="true">True</option>
            <option value="false">False</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Images</FormLabel>
          {images.map((image, index) => (
            <HStack key={index} mb={2}>
              <Input
                type="text"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder={`Image URL ${index + 1}`}
              />
              <IconButton
                aria-label="Remove Image"
                icon={<DeleteIcon />}
                onClick={() => handleRemoveImage(index)}
                isDisabled={images.length === 1}
              />
            </HStack>
          ))}
          <Button leftIcon={<AddIcon />} colorScheme="green" onClick={handleAddImage} mt={2}>
            Add Image
          </Button>
        </FormControl>
        <Button type="submit" colorScheme="blue" isLoading={isSubmitting} onClick={handleSubmit}>
          Create Court
        </Button>
      </VStack>
    </Container>
  );
};

export default CourtCreation;