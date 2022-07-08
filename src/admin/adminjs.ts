import AdminJS, { AdminJSOptions } from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSMongoose from '@adminjs/mongoose';
import { compare } from 'bcrypt';
import { ENV } from '@utils/validateEnv';
import User from '@models/User';
import Post from '@models/Post';
import Profile from '@models/Profile';

const adminJsOptions: AdminJSOptions = {
    rootPath: '/admin',
    branding: {
        companyName: 'Members-Only Admin'
    },
    databases: [],
    loginPath: '/admin/login',
    logoutPath: '/admin/logout',
    resources: [
        { resource: User },
        { resource: Post },
        { resource: Profile }
    ]
}

AdminJS.registerAdapter(AdminJSMongoose)

export const adminJs = new AdminJS(adminJsOptions)

export const adminJSRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
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
})