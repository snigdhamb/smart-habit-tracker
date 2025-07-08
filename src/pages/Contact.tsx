// src/pages/Contact.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./About";
import { Center, Container, Heading, Card, Stack, Input, Button, Field, Em, Textarea, Alert } from "@chakra-ui/react";import { NavBar } from "@/components/NavBar";
import { keyframes } from '@emotion/react';


export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(null);

  const isFormComplete = Boolean(name.trim() && email.trim() && message.trim());

  const slideDown = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  <Router></Router>;

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://send-email-0y4a.onrender.com/api/send-contact-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, message })
      });

      if (response.ok) {
        setAlertStatus("success");
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => setAlertStatus(null), 2000);
      } else {
        setAlertStatus("error");
        setTimeout(() => setAlertStatus(null), 2000);
      }
    } catch (error) {
      setAlertStatus("error");
      setTimeout(() => setAlertStatus(null), 2000);
    }
  };

  return (
    <>
      {/* Top nav */}
      <NavBar />

      <Center><Heading size={"3xl"}  animation={`${slideDown} 0.4s ease-out`}  opacity={0} animationFillMode="forwards">Contact</Heading></Center>
      
      <Container mt={20}>
        <Center>
          <Card.Root w={"lg"} animation={`${slideDown} 0.4s ease-out`}  opacity={0} animationFillMode="forwards" animationDelay={"0.2s"}>
            <Card.Header>
              <Card.Title>
                <Em>For any questions, comments, or concerns: </Em>
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Stack gap="4" w="full">
                <Field.Root required>
                  <Field.Label>
                    Name
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </Field.Root>
                <Field.Root required>
                  <Field.Label>
                    Email
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input type="email" value={email} placeholder="jane.doe@example.com" onChange={(e) => setEmail(e.target.value)} />
                </Field.Root>
                <Field.Root required>
                  <Field.Label>
                    Message
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Textarea
                    resize="vertical"
                    minH="150px"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Field.Root>
              </Stack>
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
              <Button variant="outline">Cancel</Button>
              <Button
                bgColor={"midnightGreen"}
                colorScheme={isFormComplete ? "blue" : "gray"}
                disabled={!isFormComplete}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Card.Footer>
          </Card.Root>
        </Center>
      </Container>

      {alertStatus && (
        <Center>
          <Alert.Root status={alertStatus} width="lg" mt={6} animation={`${slideDown} 0.4s ease-out`}  opacity={0} animationFillMode="forwards">
            <Alert.Indicator />
            <Alert.Title>
              {alertStatus === "success"
                ? "Your message was sent successfully!"
                : "Failed to send message. Please try again."}
            </Alert.Title>
          </Alert.Root>
        </Center>
      )}
      
      <Routes>
        <Route path="/about" element={<About />}/>
        <Route path="/contact" element={<Contact />}/>
      </Routes>
    </>
  );
}