import AuthService from "./auth.service";

interface User {
    accessToken: string;
}

export default function authHeader(): Record<string, string> {
    const user = localStorage.getItem('user');
    const parsedUser: User | null = user ? JSON.parse(user) : null;

    const parseJwt = (token: string): Record<string, any> | null => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    if (parsedUser && parsedUser.accessToken) {
        const decodedJwt = parseJwt(parsedUser.accessToken);
        if (decodedJwt && decodedJwt.exp * 1000 < Date.now()) {
            AuthService.logout();
            window.location.reload();
        }
        return { 'x-access-token': parsedUser.accessToken };
    } else {
        return {};
    }
}
