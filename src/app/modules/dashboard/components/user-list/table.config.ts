export const UserTableConfig: UserTable[] = [
  {
    title: 'First Name',
    jsonKey: 'firstName'
  },
  {
    title: 'Last Name',
    jsonKey: 'lastName'
  },
  {
    title: 'Email',
    jsonKey: 'email'
  },
  {
    title: 'Phone',
    jsonKey: 'phone'
  },
  {
    title: 'Date Of Birth',
    jsonKey: 'dateOfBirth'
  },
  {
    title: 'Country',
    jsonKey: 'address.country'
  },
  {
    title: 'State',
    jsonKey: 'address.state'
  },
  {
    title: 'City',
    jsonKey: 'address.city'
  }
]

export interface UserTable {
  title: string;
  jsonKey: string
}
