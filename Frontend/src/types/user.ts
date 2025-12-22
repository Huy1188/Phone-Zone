export interface Role {
    role_id: number;
    name: string;
    description: string | null;
}

export interface Address {
    address_id: number;
    user_id: number;
    recipient_name: string;
    recipient_phone: string;
    street: string;
    city: string;
    is_default: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface User {
    user_id: number;
    username: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    gender: boolean | null; // true: Nam, false: Nữ
    phone: string | null;
    avatar: string | null;
    role_id: number;
    is_active: boolean;
    // Quan hệ (Có thể có hoặc không tùy API include)
    role?: Role;
    addresses?: Address[];
    createdAt?: string;
    updatedAt?: string;
}
