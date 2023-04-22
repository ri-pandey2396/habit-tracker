import { IUser } from "./user.interface"

export interface IMonthlyTask {
    _id?: string,
    habit?: ITaskProgress[],
    selectedTheme?: string,
    monthYear?: string;
    goals?: string,
    notes?: string,
    createdOn?: Date,
    createdBy?: IUser,
    lastModifiedOn?: Date,
    lastModifiedBy?: IUser
}

export interface ITaskProgress {
    _id?: string,
    habitName?: string,
    progress?: {} | any,
    createdBy?: IUser,
    lastModifiedOn?: Date,
    lastModifiedBy?: IUser
}