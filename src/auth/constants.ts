export const JWT_SECRET = process.env.JWT_SECRET || 'qistonpe-secret-key-2024';
export const JWT_EXPIRES_IN = '1d';

export interface JwtPayload {
    sub: number;
    username: string;
}
