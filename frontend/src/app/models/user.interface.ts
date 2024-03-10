export interface IUser {
    _id?: string,
    name?: string,
    password?: string,
    mobile?: string,
    email?: string,
    createdOn?: Date,
    createdBy?: IUser,
    lastModifiedOn?: Date,
    lastModifiedBy?: IUser
}