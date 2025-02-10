
export interface ResultLogin {
  name: string;
    tokens: {
        accessToken: string;
    };
}

export interface CreateInvitation {
  email: string
  companiesId: string
  companyName: string
  level: string
}
