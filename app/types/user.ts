// Tipagem para o perfil do usuário
export interface UserProfile {
    name: string;
    profile: 'Administrador' | 'Usuário';
    email: string;
  }


  export interface UpdateUserParams {
    name: string;
    profile: string;
    email: string;
  }

  export interface ChangePasswordParams {
    password: string;
    newPassword: string;
  }

  
  export interface ApiResponseError {
    errors: string[];
    tokenIsExpired: boolean;
  }

  