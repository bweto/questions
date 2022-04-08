
import HttpClient from './HttpClient';

interface AuthRequest {
    email: string;
    password: string;
  }
  
interface AuthResponse {
    bearer: string;
    data: AuthUserResponse;
  }
  
interface AuthUserResponse {
    permissions: AuthAccess;
    last_login_date: Date;
  }
  
interface AuthAccess {
    role_description: boolean;
    permission_create_course: boolean;
    permission_update_course: boolean;
    permission_delete_course: boolean;
    permission_course_detail: boolean;
    permission_create_question: boolean;
    permission_update_question: boolean;
    permission_delete_question: boolean;
    permission_create_test: boolean;
    permission_update_test: boolean;
    permission_delete_test: boolean;
    permission_enroll_course: boolean;
    permission_create_users: boolean;
    permission_view_general_statistics: boolean;
    permission_view_user_statistics: boolean;
  }

const login = (req: AuthRequest) => HttpClient.post<AuthResponse>(
    '/authentication/v1/login',
    req,
    {headers: {"login-flow": "true"}}
    );
  
const logout = (token: string) => HttpClient.delete(
    "authentication/v1/logout", 
    { headers: { authorization: `bearer ${token}` }}
    );


export {
    login,
    logout
}

export type {
    AuthRequest,
    AuthResponse,
    AuthUserResponse,
    AuthAccess
}

