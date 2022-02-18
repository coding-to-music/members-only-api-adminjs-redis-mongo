import { Express, Request, Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "@/package.json";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Members-Only API Documentation",
            version,
            description: "This is the documentation for the Members-Only API, which is a simple API for managing members of a community.",
            termsOfService: "",
            contact: {
                name: "Lekan Adetunmbi",
                url: "https://pollaroid.net",
                email: "me@pollaroid.net"
            },
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT"
            },
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['@/routes/**/*.ts', '@/models/**/*.ts'],
};

export default swaggerJSDoc(options);