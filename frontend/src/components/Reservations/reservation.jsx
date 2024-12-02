// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Container,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   useToast,
//   Heading,
// } from "@chakra-ui/react";
// import axios from "axios";
//
// const Reservations = () => {
//   const [reservations, setReservations] = useState([]);
//   const toast = useToast();
//
//   useEffect(() => {
//     // console.log(format(new date(), "yyyy/DD/MM"));
//     // console.log("hello")
//     const controller = new AbortController();
//
//     const fetchReservations = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:8000/api/reserves/",
//           {
//             signal: controller.signal,
//             withCredentials: true,
//           }
//         );
//         setReservations(response.data);
//       } catch (error) {
//         if (!axios.isCancel(error)) {
//           toast({
//             title: "Error Fetching Reservations",
//             description: error.response?.data?.detail || "An error occurred",
//             status: "error",
//             duration: 3000,
//             isClosable: true,
//           });
//         }
//       }
//     };
//
//     fetchReservations();
//
//     return () => {
//       controller.abort();
//     };
//   }, [toast]);
//
//   return (
//     <Container maxW="container.xl" mt={10} mb={10}>
//       <Box borderWidth={1} borderRadius="lg" p={6}>
//         <Heading mb={6}>Reservations</Heading>
//         <Table variant="simple">
//           <Thead>
//             <Tr>
//               <Th>ID</Th>
//               <Th>Date</Th>
//               <Th>Start</Th>
//               <Th>End</Th>
//             </Tr>
//           </Thead>
//           <Tbody>
//             {reservations.map((reservation) => (
//               <Tr key={reservation.id}>
//                 <Td>{reservation.id}</Td>
//                 <Td>
//                   {reservation.start_date_time
//                     ? new Date(reservation.start_date_time).toLocaleDateString(
//                         "en-US",
//                         {
//                           year: "numeric",
//                           month: "short",
//                           day: "2-digit",
//                         }
//                       )
//                     : "N/A"}
//                 </Td>
//                 <Td>
//                   {reservation.start_date_time
//                     ? new Date(reservation.start_date_time).toLocaleTimeString(
//                         "en-US",
//                         {
//                           hour: "numeric",
//                           minute: "2-digit",
//                           hour12: true,
//                         }
//                       )
//                     : "N/A"}
//                 </Td>
//                 <Td>
//                   {reservation.end_date_time
//                     ? new Date(reservation.end_date_time).toLocaleTimeString(
//                         "en-US",
//                         {
//                           hour: "numeric",
//                           minute: "2-digit",
//                           hour12: true,
//                         }
//                       )
//                     : "N/A"}
//                 </Td>
//               </Tr>
//             ))}
//           </Tbody>
//         </Table>
//       </Box>
//     </Container>
//   );
// };
//
// export default Reservations;
//

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const controller = new AbortController();

    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/reserves/",
          {
            signal: controller.signal,
            withCredentials: true,
          }
        );
        setReservations(response.data);
      } catch (error) {
        if (!axios.isCancel(error)) {
          toast({
            title: "Error Fetching Reservations",
            description: error.response?.data?.detail || "An error occurred",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };

    fetchReservations();

    return () => {
      controller.abort();
    };
  }, [toast]);

  const today = new Date();
  const futureReservations = reservations.filter((reservation) => {
    const resDate = new Date(reservation.date_time);
    return resDate >= today;
  });
  const pastReservations = reservations.filter((reservation) => {
    const resDate = new Date(reservation.date_time);
    return resDate < today;
  });

  return (
    <Container maxW="container.xl" mt={10} mb={10}>
      <Box borderWidth={1} borderRadius="lg" p={6} mb={10}>
        <Heading mb={6}>Your Reservations</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Duration (hr)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {futureReservations.map((reservation) => (
              <Tr key={reservation.id}>
                <Td>{reservation.id}</Td>
                <Td>
                  {reservation.date_time
                    ? new Date(reservation.date_time)
                        .toLocaleString()
                        .split(", ")[0]
                    : "N/A"}
                </Td>
                <Td>
                  {(() => {
                    if (!reservation.date_time) return "N/A";

                    const new_date = new Date(reservation.date_time);
                    const end_time = new Date(new_date);
                    end_time.setHours(
                      new_date.getHours() + reservation.duration
                    );

                    return (
                      new_date.toLocaleString().split(", ")[1] +
                      " - " +
                      end_time.toLocaleString().split(", ")[1]
                    );
                  })()}
                </Td>
                <Td>{reservation.duration || "N/A"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Box borderWidth={1} borderRadius="lg" p={6}>
        <Heading mb={6}>Reservation History</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Duration (hr)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pastReservations.map((reservation) => (
              <Tr key={reservation.id}>
                <Td>{reservation.id}</Td>
                <Td>
                  {reservation.date_time
                    ? new Date(reservation.date_time)
                        .toLocaleString()
                        .split(", ")[0]
                    : "N/A"}
                </Td>
                <Td>
                  {(() => {
                    if (!reservation.date_time) return "N/A";

                    const new_date = new Date(reservation.date_time);
                    const end_time = new Date(new_date);
                    end_time.setHours(
                      new_date.getHours() + reservation.duration
                    );

                    return (
                      new_date.toLocaleString().split(", ")[1] +
                      " - " +
                      end_time.toLocaleString().split(", ")[1]
                    );
                  })()}
                </Td>
                <Td>{reservation.duration || "N/A"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default Reservations;
