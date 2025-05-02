import { randomUUID } from "crypto";

function uuid_to_bytes(uuid) {
    uuid = uuid.replace('-', '');

    // const bytes = Buffer.alloc(16)

    // for (let i = 0; i < uuid.length; i += 2) {
    //     bytes.writeUInt8(parseInt(uuid.slice(i, i + 2), 16))
    // }

    return Buffer.from(uuid, 'hex')
}

function bytes_to_uuid(buf) {
    let uuid = buf.toString('hex');

    return `${uuid.silce(0, 8)}-${uuid.slice(9, 12)}-${uuid.slice(13, 16)}-${uuid.slice(17-20)}-${uuid.slice(21-32)}`;
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

        const name_size = buf.readUint32LE(1);
        // const expected_size = buf.readUint32LE(6 + name_size); // expected file size in bytes

        this.channels[uuid] = {
            name: buf.toString('utf-8', 5, 5 + name_size), // file name
            expected_size: 0, // expected_size,
            recieved_bytes: 0,
            data: Buffer.alloc(10)
        };

        console.log(this.channels[uuid])
    }

    /*
        handle receiving a chunk
    */
    chunk_recieve(buf) {
        const identifier = bytes_to_uuid(buf.slice(1, 17))
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

        buf.copy(channel.data, sequence_number, 22, 22 + chunk_size);
    }

    file_request() {

    }

    on_error(err) {
        console.error(`failed to connect to socket: ${err}`);
    }

    on_message(buf) {
        const opcode = buf.readUInt8();

        console.log(`receive | length ${buf.length}`);
        console.log(Array.from(buf));

        switch (opcode) {
            case 1:
                this.open_transfer(buf);
                break;
            case 2:
                this.chunk_recieve(buf);
                break;
            default:
                console.log('invalid operation code recieved');
        }
    }
}

export default Socket;