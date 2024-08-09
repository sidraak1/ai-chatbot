'use client'

import { Box, Button, Stack, TextField, Avatar, Typography } from '@mui/material'
import { useState, useRef, useEffect } from 'react'

const TypingIndicator = () => (
  <Box display="flex" alignItems="center">
    <Box
      bgcolor="#4db6ac" // Lighter Blue-Green for typing indicator
      width={8}
      height={8}
      borderRadius="50%"
      mx={0.5}
      sx={{
        '@keyframes blink': {
          '0%, 20%, 50%, 80%, 100%': { opacity: 1 },
          '40%': { opacity: 0.3 },
          '60%': { opacity: 0.5 },
        },
        animation: 'blink 1.4s infinite both',
      }}
    />
    <Box
      bgcolor="#4db6ac" // Lighter Blue-Green for typing indicator
      width={8}
      height={8}
      borderRadius="50%"
      mx={0.5}
      sx={{
        '@keyframes blink': {
          '0%, 20%, 50%, 80%, 100%': { opacity: 1 },
          '40%': { opacity: 0.3 },
          '60%': { opacity: 0.5 },
        },
        animation: 'blink 1.4s infinite both',
      }}
    />
    <Box
      bgcolor="#4db6ac" // Lighter Blue-Green for typing indicator
      width={8}
      height={8}
      borderRadius="50%"
      mx={0.5}
      sx={{
        '@keyframes blink': {
          '0%, 20%, 50%, 80%, 100%': { opacity: 1 },
          '40%': { opacity: 0.3 },
          '60%': { opacity: 0.5 },
        },
        animation: 'blink 1.4s infinite both',
      }}
    />
  </Box>
)

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Groot, your AI helper! How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [typingMessageIndex, setTypingMessageIndex] = useState(null)

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return
    setIsLoading(true)

    // Add user message
    const newMessages = [...messages, { role: 'user', content: message }]
    setMessages(newMessages)
    setMessage('')

    // Add typing indicator for the assistant
    const typingIndex = newMessages.length
    setTypingMessageIndex(typingIndex)
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'assistant', content: '', isTyping: true },
    ])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessages),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let content = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        content += decoder.decode(value, { stream: true })
      }

      // Replace typing indicator with actual message
      setMessages((messages) => {
        const updatedMessages = [...messages]
        updatedMessages[typingMessageIndex] = { role: 'assistant', content }
        return updatedMessages
      })

    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    } finally {
      setIsLoading(false)
      setTypingMessageIndex(null) // Ensure typing indicator is cleared
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#e0f2f1" // Lighter green background
    >
      <Typography 
        variant="h4" 
        component="div" 
        fontWeight="bold" 
        mb={2} 
        textAlign="center" 
        fontFamily="'Roboto', sans-serif" // Use a clean, modern font
        color="#00796b" // Matching color theme
      >
        Your AI Helper
      </Typography>
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="1px solid #b2dfdb"
        borderRadius={2}
        p={2}
        spacing={3}
        bgcolor="#f0f0f0"
        boxShadow={4}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
              alignItems="center"
            >
              {message.role === 'assistant' && !message.isTyping && (
                <Avatar
                  src="/images/groot.jpg"
						alt="Groot"
                  sx={{ mr: 2, width: 40, height: 40 }}
                />
              )}
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? '#80cbc4' // Lighter Blue-Green for assistant
                    : '#2f8a81' // Slightly darker Blue-Green for user
                }
                color={
                  message.role === 'assistant'
                    ? 'black'
                    : 'white'
                }
                borderRadius={16}
                p={2}
                maxWidth="75%"
                position="relative"
                fontFamily="'Roboto', sans-serif" // Use the same font for consistency
              >
                {index === typingMessageIndex ? (
                  <TypingIndicator />
                ) : (
                  message.content
                )}
              </Box>
              {message.role === 'user' && (
                <Avatar
                  alt="User"
                  src="/path/to/user-pfp.png"
                  sx={{ ml: 2, width: 40, height: 40 }}
                />
              )}
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Type a message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                fontFamily: "'Roboto', sans-serif", // Consistent font
                backgroundColor: 'white', // Set the background color to white
              },
              '& .MuiInputLabel-root': {
                color: '#00796b', // Optional: color of the label text
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#00796b', // Optional: color of the border
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#004d40', // Optional: color of the border on hover
              },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
            sx={{ width: 100, borderRadius: '20px', bgcolor: '#2f8a81', color: 'white', fontFamily: "'Roboto', sans-serif" }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
