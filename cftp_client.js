class Buffer {
    constructor (size) {
        this.array_buffer = new ArrayBuffer(size);
        this.byte_array = new Uint8Array(this.array_buffer);
    }

    static fromString(str) {
        const buf = new Buffer(str.length);

        buf.writeString(0, str);

        return buf;
    }

    static fromBytes(arr) {
        const buf = new Buffer(arr.length);

        for (let i = 0; i < arr.length; i++) {
            buf.byte_array[i] = arr[i];
        }

        return buf;
    }

    static fromArrayBuf(arr_buf) {
        const buf = new Buffer(arr_buf.byteLength);

        buf.array_buffer = arr_buf;
        buf.byte_array = new Uint8Array(arr_buf);

        return buf;
    }

    cmp(buf) {
        if (this.byte_array.length != buf.byte_array.length) {
            return false;
        }

        for (let i = 0; i < this.byte_array.length; i++) {
            if (this.byte_array[i] != buf.byte_array[i]) {
                return false;
            }
        }

        return true;
    }

    slice(start, end) {
        const new_buffer = new Buffer(end - start);

        for (let i = start; i < end; i++) {
            new_buffer.writeUInt8(i - start, this.byte_array[i]);
        }

        return new_buffer;
    }

    readCheck(offset, size) {
        if (offset + size > this.array_buffer.length) {
            throw new Error('offset exceeds bounds');
        }
    }

    readUInt8(offset) {
        return this.byte_array[offset];
    }

    readUInt16LE(offset) {
        return this.byte_array[offset] + (this.byte_array[offset + 1] << 8);
    }

    readUInt16BE(offset) {
        return this.byte_array[offset + 1] + (this.byte_array[offset] << 8);
    }

    readUInt32LE(offset) {
        return this.byte_array[offset]
            + (this.byte_array[offset + 1] << 8)
            + (this.byte_array[offset + 2] << 16)
            + (this.byte_array[offset + 3] << 24);
    }

    readUInt32BE(offset) {
        return this.byte_array[offset + 3]
            + (this.byte_array[offset + 2] << 8)
            + (this.byte_array[offset + 1] << 16)
            + (this.byte_array[offset    ] << 24);
    }

    readUInt64LE(offset) {
        return this.byte_array[offset]
            + (this.byte_array[offset + 1] << 8)
            + (this.byte_array[offset + 2] << 16)
            + (this.byte_array[offset + 3] << 24)
            + (this.byte_array[offset + 4] << 32)
            + (this.byte_array[offset + 5] << 40)
            + (this.byte_array[offset + 6] << 48)
            + (this.byte_array[offset + 7] << 56);
    }

    readUInt64BE(offset) {
        return this.byte_array[offset + 7]
            + (this.byte_array[offset + 6] << 8)
            + (this.byte_array[offset + 5] << 16)
            + (this.byte_array[offset + 4] << 24)
            + (this.byte_array[offset + 3] << 32)
            + (this.byte_array[offset + 2] << 40)
            + (this.byte_array[offset + 1] << 48)
            + (this.byte_array[offset    ] << 56);
    }

    readChar(offset) {
        return String.fromCharCode(this.byte_array[offset])
    }
    
    readString(offset, size) {
        let str = '';

        for (let i = 0; i < size; i++) {
            str += String.fromCharCode(this.byte_array[offset + i]);
        }

        return str;
    }

    // sanity check inputs
    write_check(offset, data, size, type) {
        if (offset + size >= this.array_buffer.length) {
            throw new Error('offset exceeds bounds');
        }

        if (typeof(data) != type) {
            throw new Error('invalid type')
        }
    }

    writeUInt8(offset, number) {
        this.write_check(offset, number, 1, 'number');

        this.byte_array[offset]         = number & 0xFF;
    }

    writeUInt16LE(offset, number) {
        this.write_check(offset, number, 2, 'number');

        this.byte_array[offset]         =  number & 0x00FF;
        this.byte_array[offset + 1]     = (number & 0xFF00) >> 8;
    }
    
    writeUInt16BE(offset, number) {
        this.write_check(offset, number, 2, 'number');

        this.byte_array[offset]         = (number & 0xFF00) >> 8;
        this.byte_array[offset + 1]     =  number & 0x00FF;
    }

    writeUInt32LE(offset, number) {
        this.write_check(offset, number, 4, 'number');

        this.byte_array[offset]         =  number & 0x000000FF;
        this.byte_array[offset + 1]     = (number & 0x0000FF00) >> 8;
        this.byte_array[offset + 2]     = (number & 0x00FF0000) >> 16;
        this.byte_array[offset + 3]     = (number & 0xFF000000) >> 24;
    }

    writeUInt32BE(offset, number) {
        this.write_check(offset, number, 4, 'number');

        this.byte_array[offset]         = (number & 0xFF000000) >> 24;
        this.byte_array[offset + 1]     = (number & 0x00FF0000) >> 16;
        this.byte_array[offset + 2]     = (number & 0x0000FF00) >> 8;
        this.byte_array[offset + 3]     =  number & 0x000000FF;
    }

    writeUInt64LE(offset, number) {
        this.write_check(offset, number, 8, 'number');

        this.byte_array[offset]         =  number & 0x00000000000000FF;
        this.byte_array[offset + 1]     = (number & 0x000000000000FF00) >> 8;
        this.byte_array[offset + 2]     = (number & 0x0000000000FF0000) >> 16;
        this.byte_array[offset + 3]     = (number & 0x00000000FF000000) >> 24;
        this.byte_array[offset + 4]     = (number & 0x000000FF00000000) >> 32;
        this.byte_array[offset + 5]     = (number & 0x0000FF0000000000) >> 40;
        this.byte_array[offset + 6]     = (number & 0x00FF000000000000) >> 48;
        this.byte_array[offset + 7]     = (number & 0xFF00000000000000) >> 56;          
    }
    
    writeUInt64BE(offset, number) {
        this.write_check(offset, number, 8, 'number');

        this.byte_array[offset]         = (number & 0xFF00000000000000) >> 56;
        this.byte_array[offset + 1]     = (number & 0x00FF000000000000) >> 48;
        this.byte_array[offset + 2]     = (number & 0x0000FF0000000000) >> 40;
        this.byte_array[offset + 3]     = (number & 0x000000FF00000000) >> 32;
        this.byte_array[offset + 4]     = (number & 0x00000000FF000000) >> 24;
        this.byte_array[offset + 5]     = (number & 0x0000000000FF0000) >> 16;
        this.byte_array[offset + 6]     = (number & 0x000000000000FF00) >> 8;
        this.byte_array[offset + 7]     =  number & 0x00000000000000FF;    
    }

    writeChar(offset, char) {
        this.write_check(offset, char, 1, 'string');
    
        this.byte_array[offset] = char.charAt(0);
    }

    writeString(offset, data) {
        this.write_check(offset, data, data.length, 'string');

        for (let i = 0; i < data.length; i++) {
            this.byte_array[offset + i] = data.charCodeAt(i);
        }
    }

    writeBuffer(offset, buf) {
        for (let i = 0; i < buf.byte_array.length; i++) {
            this.byte_array[offset + i] = buf.byte_array[i];
        }
    }
}


// const CHUNK_SIZE = 65535 - 25; // max tcp payload
const CHUNK_SIZE = 1024;

/*
    [opcode : 1 byte]
    [identifier : 16 bytes]
    [sqeuence-number : 4 bytes]
    [chunk-size : 4 bytes]
    [chunk : start - end]
*/

function send_chunk(socket, uuid, content_buf, start, end) {
    const size = end - start;

    const buffer = new Buffer(25 + size);

    // const chunk_buffer = Buffer.fromArrayBuf(content_buf.slice(start, end));

    buffer.writeUInt8(0, 3);
    buffer.writeBuffer(1, uuid);
    buffer.writeUInt32LE(17, start)
    buffer.writeUInt32LE(21, size);
    buffer.writeBuffer(25, Buffer.fromArrayBuf(content_buf.slice(start, end)));

    socket.send(buffer.array_buffer);
}



function acknowledge_yield(socket, uuid, sequence) {
    return new Promise((resolve, reject) => {
        async function onMessage(event) {
            const data = Buffer.fromArrayBuf(await event.data.arrayBuffer());

            const opcode = data.readUInt8(0);

            // listen for opcode for (chunk ACK)
            if (opcode != 4) {
                return;
            }

            const recieved_uuid = data.slice(1, 17);
            const sqeuence_number = data.readUInt32LE(17);

            // non-matching uuids ignore
            if (recieved_uuid.cmp(uuid) == false) {
                return;
            }
            
            if (sqeuence_number != sequence) {
                return
            }

            socket.removeEventListener('message', onMessage)

            resolve()
        }

        socket.addEventListener('message', onMessage);
    })
}

function upload_file(file, file_index) {
    const socket = new WebSocket('ws://localhost:8081');

    const file_name = file.name;
    const progress_bar = document.getElementById('progress-bar-' + file_index);
    const progress_text = document.getElementById('progress-ratio-' + file_index);

    // socket init
    socket.addEventListener('open', () => {
        const buffer = new Buffer(9 + file_name.length);

        buffer.writeUInt8(0, 1);
        buffer.writeUInt32LE(1, file.size);
        buffer.writeUInt32LE(5, file_name.length);
        buffer.writeString(9, file_name);

        socket.send(buffer.array_buffer);
    })

    // socket wait for callback
    socket.addEventListener('message', async (event) => {
        const data = Buffer.fromArrayBuf(await event.data.arrayBuffer());

        const opcode = data.readUInt8(0);

        if (opcode != 2) {
            return;
        }

        // server accepted transfer request
        const uuid = data.slice(1, 17);

        // begin sending files in chunks
        const reader = new FileReader();
        
        reader.readAsArrayBuffer(file);

        reader.onloadend = async function() {
            // const partitions = Math.ceil(file.size / CHUNK_SIZE);

            // byte stream
            for (let byte = 0; byte < file.size; byte += CHUNK_SIZE) {
                const byte_start = byte;
                const byte_end = Math.min(byte + CHUNK_SIZE, file.size);

                progress_bar.style = `width: ${byte_end / file.size * 100}%`;
                progress_text.innerHTML = format_filesize(byte_end, file.size);

                send_chunk(socket, uuid, reader.result, byte_start, byte_end);

                await acknowledge_yield(socket, uuid, byte_start);
            }
        }
    })
}

function upload() {
    const file_input = document.getElementById('file-input');
    const files = file_input.files;

    if (files.length < 1) {
        return console.log('no files selected');
    }

    setUploadList();

    for (let i = 0; i < files.length; i++) {
        upload_file(files[i], i);
    }
}

function format_size(size) {
    if (size >= 1000000) {
        return `${(size / 1000000).toFixed(2)} MB`;
    } else if (size >= 1000) {
        return `${(size / 1000).toFixed(2)} KB`;
    }

    return `${size} B`; 
}

function format_filesize(recieved, file_size) {
    if (file_size >= 1000000) {
        return `${(recieved / 1000000).toFixed(2)}/${(file_size / 1000000).toFixed(2)} MB`;
    } else if (file_size >= 1024) {
        return `${(recieved / 1000).toFixed(2)}/${(file_size / 1000).toFixed(2)} KB`;
    }

    return `${recieved}/${file_size} B`;
}

let filesToUpload = [];

function updateFileList(event) {
    const fileListDisplay = document.getElementById("file-list");
    const files = [...event.target.files];
    
    fileListDisplay.innerHTML = '';
    
    files.forEach((file) => {
        fileListDisplay.innerHTML += `<div>${file.name} - ${format_size(file.size)}</div>`;
    });
}

function setUploadList() {
    const file_input = document.getElementById("file-input");
    const upload_list = document.getElementById("upload-list");

    const files = [...file_input.files];

    upload_list.innerHTML = '';

    files.forEach((file, i) => {
        upload_list.innerHTML += `<div class="file-item"><h2>${file.name}</h2><p id="progress-ratio-${i}">${format_filesize(0, file.size)}</p><div class="progress"><div class="progress-bar" id="progress-bar-${i}"></div></div></div>`
    })
}
