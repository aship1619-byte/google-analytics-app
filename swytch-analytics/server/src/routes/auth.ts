import { FastifyInstance } from "fastify";

export default async function authRoutes(server: FastifyInstance) {
    server.post("/auth", async (request, reply) => {
        const { idToken } = request.body as { idToken: string };

        if (!idToken) {
            return reply.status(400).send({ error: "idToken is required" });
        }

        try {
            const res = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.FIREBASE_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken }),
                }
            );

            const data = await res.json() as {
                users?: {
                    localId: string;
                    email: string;
                    displayName: string;
                    photoUrl: string;
                }[]
            };

            if (!data.users || data.users.length === 0) {
                return reply.status(401).send({ error: "Invalid token" });
            }

            const firebaseUser = data.users[0];

            const token = server.jwt.sign(
                {
                    uid: firebaseUser.localId,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName,
                    picture: firebaseUser.photoUrl,
                },
                { expiresIn: "7d" }
            );

            return reply
                .setCookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 7,
                })
                .send({ success: true });
        } catch (err) {
            server.log.error(err);
            return reply.status(401).send({ error: "Invalid token" });
        }
    });

    server.delete("/auth", async (request, reply) => {
        return reply
            .clearCookie("token", { path: "/" })
            .send({ success: true });
    });
}