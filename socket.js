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

        this.active_transfers = {};

        // event listeners
        ws.on('error', (err) => this.on_error(err));
        ws.on('message', (buf) => this.on_message(buf));
    }

    open_transfer(buf) {
        const uuid = randomUUID();

        // collison detect
        if (this.active_transfers[uuid]) {
            return this.open_transfer()
        }

        const name_size = buf.readUint32LE(1);
        const expected_size = buf.readUint32LE(6 + name_size); // expected file size in bytes

        this.active_transfers[uuid] = {
            name: buf.toString('utf-8', 5, 5 + name_size), // file name
            expected_size: expected_size,
            recieved_bytes: 0,
            data: Buffer.alloc(expected_size)
        };
    }

    chunk_recieve(buf) {
        const id_size = buf.readUint32LE(1);

        // sanity check, if id_size massively huge drop packet
        if (id_size > buf.length) {
            return
        }

        let offset = 5

        const identifier = buf.toString('utf-8', offset, offset += id_size);
        const sequence_number = buf.readUint32LE(++offset);
        const chunk_size = buf.readUint32LE(offset += 4);

        
    }

    on_error(err) {
        console.error(`failed to connect to socket: ${err}`);
    }

    on_message(buf) {
        const opcode = buf.readUInt8();

        console.log(opcode)
    }
}

export default Socket;