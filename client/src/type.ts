export interface roomOptions {
    isPublic?: boolean;
    area : string;
    totalPlayer : number;
    playerPerTeam : number;
}
export interface playerInRoom {
    id : string;
    name : string;
    isReady : boolean;
}