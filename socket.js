import { randomUUID } from "crypto";
import path from 'path';
import fs from 'fs';

const __dir__ = import.meta.dirname;
const save_dir = path.join(__dir__, 'files');

function uuid_to_bytes(uuid) {
    uuid = uuid.replace(/-/g, '');

    const bytes = Buffer.alloc(16)

    for (let i = 0; i < uuid.length; i += 2) {
        bytes.writeUInt8(parseInt(uuid.slice(i, i + 2), 16), i / 2);
    }

    return bytes;
}

function bytes_to_uuid(buf) {
    let uuid = buf.toString('hex');

    return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20, 32)}`;
}

class Socket {
    constructor(server, ws, req) {
        this.wss = server;
        this.socket = ws;
        this.client_address = req.socket.remoteAddress;

        this.channels = {};

        // event listeners
        ws.on('error', (err) => this.on_error(err));
        ws.on('message', (buf) => this.on_message(buf));
    }

    /*
        open a channel for recieving file segments
    */
    open_transfer(buf) {
        const uuid = randomUUID();

        // collison detect
        if (this.channels[uuid]) {
            return this.open_transfer()
        }

        const expected_size = buf.readUint32LE(1); // expected file size in bytes
        const name_size = buf.readUint32LE(5);
        
        this.channels[uuid] = {
            name: buf.toString('utf-8', 9, 9 + name_size), // file name
            expected_size: expected_size,
            recieved_bytes: 0,
            data: Buffer.alloc(expected_size)
        };

        // send send transfer confirmation
        // [opcode : 1 byte] [uuid : 16 bytes]
        const accept = Buffer.alloc(17);

        accept.writeUInt8(2, 0);

        uuid_to_bytes(uuid).copy(accept, 1, 0, 16);

        this.socket.send(accept)
    }

    save_transfer(uuid) {
        const channel = this.channels[uuid];

        fs.writeFileSync(path.join(save_dir, channel.name), channel.data);
    
        console.log('file saved to',path.join(save_dir, channel.name));
    }

    /*
        handle receiving a chunk
    */
    chunk_recieve(buf) {
        const uuid_buf = buf.slice(1, 17);
        
        const identifier = bytes_to_uuid(uuid_buf);
        const sequence_number = buf.readUint32LE(17);
        const chunk_size = buf.readUint32LE(21);

        // check identifier
        const channel = this.channels[identifier];
        if (channel == null) {
            return; // drop chunk due to invalid identifer
        }

        // sanity check
        if (chunk_size != buf.length - 25) {
            
            return; // drop chunk, send back retranmission request
        }

        channel.recieved_bytes += chunk_size;

        buf.copy(channel.data, sequence_number, 25, 25 + chunk_size);

        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`bytes recieved: ${channel.recieved_bytes} / ${channel.expected_size}`);

        if (channel.recieved_bytes == channel.expected_size) {
            process.stdout.write('\n');
            this.save_transfer(identifier);
        }

        // acknowledgement buffer
        const ack_buffer = new Buffer.alloc(21);

        // send acknowledgement packet acknowledging that bytes were recieved for seq number
        ack_buffer.writeUInt8(4, 0);
        ack_buffer.writeUint32LE(sequence_number, 17);

        uuid_buf.copy(ack_buffer, 1, 0, 16);

        this.socket.send(ack_buffer);
    }

    on_error(err) {
        console.error(`failed to connect to socket: ${err}`);
    }

    on_message(buf) {
        const opcode = buf.readUInt8();

        switch (opcode) {
            case 1:
                this.open_transfer(buf);
                break;
            case 3:
                this.chunk_recieve(buf);
                break;
            default:
                console.log('invalid operation code recieved');
        }
    }
}

export default Socket;