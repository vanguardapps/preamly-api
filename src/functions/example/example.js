export const handler = async (event) => {
    return {message: `Hey ${event.name ?? "Unknown"}!`};
};

// example invocation: pnpm serverless invoke --function example --data '{"name": "Bob"}'

// note, in production when we call functions, we'll have to just use AWS_PROFILE=whatever,
// probably will need an access token for an IAM user that is configured as an API user so to speak