# Multi-file Upload

The goal of this project is to create a simple application to upload files to a remote server using a network system that mimics the behavior of the TCP protocol with the use of websockets.

## Protocol

The protocol dedicated for this specific application has two primary uses. 

The first use is to upload files to a server by establishing a connection with a websocket, sending a request to upload a file. On acceptance of this request, the client will begin to send the file over in chunks of a predetermined size. 

The second use is retrieval of files to a client with the exact same structure previously mentioned but with information flowing the opposite way. 

## Structure

CFTP - Chunked File Transfer Protocol

| byte 0 | byte 1-4     | byte 5-x |
| ------ | ------------ | --------- | 
| opcode | payload size | payload   |


| opcode | usage                        |
| ------ | ---------------------------- |
| 1      | file upload request          |
| 2      | file download request        |
| 3      | chunk transfer               |