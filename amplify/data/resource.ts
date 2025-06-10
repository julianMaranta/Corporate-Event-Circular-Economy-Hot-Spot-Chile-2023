import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Registration: a
    .model({
      firstName: a.string().required(),
      lastName: a.string().required(),
      identificationNumber: a.string().required(),
      identificationType: a.enum(["RUT", "DNI", "PASSPORT"]),
      email: a.email().required(),
      occupation: a.string().required(),
      industryType: a.string().required(),
      eventDate: a.date().required(),
      eventTime: a.string().required(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});