interface User {
    id: number;
    username: string;
    isMember: boolean;
    isCreator: boolean;
    isStaff: boolean;
    isAdmin: boolean;
    accessToken: string;
    createdAt: number;
    lastLogin: number;
}
