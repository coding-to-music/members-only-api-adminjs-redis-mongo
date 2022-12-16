import { SessionOptions } from "express-session";
import { Router } from "express";
import AdminJS, { AdminJSOptions } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSMongoose from "@adminjs/mongoose";
import { compare } from "bcrypt";
import { ENV } from "@utils/loadEnv";
import { Post } from "@post/models/post.model";
import { Profile } from "@profile/models/profile.model";
import { User } from "@user/models/user.model";
import { IUser, Role } from "@user/interfaces/users.interface"

const getActions = () => {
    return {
        edit: {
            isAccessible: ({ currentAdmin }: { currentAdmin: IUser }) => currentAdmin && currentAdmin.roles.indexOf(Role.ADMIN) !== -1,
        },
        delete: {
            isAccessible: ({ currentAdmin }: { currentAdmin: IUser }) => currentAdmin && currentAdmin.roles.indexOf(Role.ADMIN) !== -1,
        },
        new: {
            isAccessible: ({ currentAdmin }: { currentAdmin: IUser }) => currentAdmin && currentAdmin.roles.indexOf(Role.ADMIN) !== -1,
        }
    }
}


const adminJsOptions: AdminJSOptions = {
    rootPath: '/admin',
    branding: {
        companyName: 'Members-Only Admin'
    },
    databases: [],
    loginPath: '/admin/login',
    logoutPath: '/admin/logout',
    resources: [
        {
            resource: User,
            options: {
                actions: getActions()
            }
        },
        {
            resource: Post,
            options: {
                actions: getActions()
            }
        },
        {
            resource: Profile,
            options: {
                actions: getActions()
            }
        }
    ]
}

AdminJS.registerAdapter(AdminJSMongoose)

const adminRouter = Router()

const sessionOptions: SessionOptions = {
    resave: true,
    saveUninitialized: false,
    secret: ENV.COOKIE_SECRET
}

export const adminJs = new AdminJS(adminJsOptions)

export const adminJSRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
        authenticate: async (email, password) => {
            const user = await User.findOne({ email })
            if (user) {
                const matched = await compare(password, user.password)
                if (matched) {
                    return user
                }
            }
            return false
        },
        cookiePassword: ENV.COOKIE_SECRET,
    },
    adminRouter,
    sessionOptions
)