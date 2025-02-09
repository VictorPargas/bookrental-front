interface Settings {
  id: number
  createdAt: string
  maxTime: string
  minTime: string
  updatedAt: string
}

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
