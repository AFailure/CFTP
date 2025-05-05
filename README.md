# Multi-file Upload

The goal of this project is to create a simple application to upload files to a remote server using a network system that mimics the behavior of the TCP protocol with the use of websockets.

## To Run:
Have node.js installed on your system, (you can find it here, https://nodejs.org/en)
install dependencies: npm install express
run script: node index.js

## Protocol

CFTP - Chunked File Transfer Protocol

The protocol dedicated for this specific application has two primary uses. 

The first use is to upload files to a server by establishing a connection with a websocket, sending a request to upload a file. On acceptance of this request, the client will begin to send the file over in chunks of a predetermined size. 

The second use is retrieval of files to a client with the exact same structure previously mentioned but with information flowing the opposite way. 

## Structure

Every packet is sent with the first byte signifying the operation to be completed by the recieving entity. This is known as the "Operation Code" byte or "Opcode" for short. 

| byte 0 |
| ------ |
| opcode |

Different opcodes and their use case are shown in the table below.

| opcode | usage                        |
| ------ | ---------------------------- |
| 1      | file upload request          |
| 2      | upload request accept        |
| 3      | chunk transfer               |
| 4      | chunk acknowledgement        |

### Operation-specific Structure

Each operation hold their own unique byte structure in order to fullfill their purpose and minimize the amount of bandwidth and memory used.

**File Upload Request**
| byte 0 | bytes 1 - 4                 | bytes 5 - 8                        | bytes 9 - x | 
| ------ | --------------------------- | ---------------------------------- | ----------- |
| opcode | file size (number of bytes) | size of file name (with extension) | file name   |


**Upload Request Acceptance**
| byte 0 | bytes 1 - 16             |
| ------ | ------------------------ |
| opcode | UUID - Unique Identifier |

**Chunk Transfer**
| byte 0 | bytes 1 - 16             | bytes 17 - 20   | byte 21 - 24 | byte 25 - x   |
| ------ | ------------------------ | --------------- | ------------ | ------------- |
| opcode | UUID - Unique Identifier | sequence number | chunk size   | chunk payload |

**Chunk Acknowledge**
| byte 0 | bytes 1 - 16             | bytes 17 - 20   |
| ------ | ------------------------ | --------------- |
| opcode | UUID - Unique Identifier | sequence number |


UUID is a 16 byte identifier that is assigned to a specific file upload. This allows multiple files to be uploaded concurrently through one socket connection.

Sequence number is a 32 bit unsigned integer that specifies the offset to which the chunk payload should be loaded into. 

Chunk acknowledgement packets are sent back to the uploading client, similar to TCP to acknowledge a chunk has been received. This however slows down the upload speeds by a considerable amount taking into account the amount of overhead with websockets. 

## Challenges

Native JavaScript on the browser does not have a built-in buffer object like Node.JS, and as such I had to create my own Buffer class to manipulate buffers effectively. My Buffer class includes various read and write methods that make it easy to read in-bound data and create out-bound data.