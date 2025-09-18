import { RoomData } from '@/src/roomManager';

export function encode(msg: RoomMsgToSend): string {
    return JSON.stringify(msg)
}

export function decode(buffer: ArrayBuffer): RoomMsgToReceive {
    console.log(buffer)
    return JSON.parse(buffer)
}

export interface RoomMsgToSend {
    type: string;
    value: {
        nickName?: string;
        roomID?: string;
    };
}

export interface RoomMsgToReceive {
    type: string;
    value: {
        roomData?: RoomData;
    };
}
