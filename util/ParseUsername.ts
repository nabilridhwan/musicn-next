// This files parses the username so that it removes special characters front and back and also replaces them with underscores
export default function parseUsername(username: string) {
	return username
		.toLowerCase()
		.replace(/[^0-9a-zA-Z_]+/g, '_')
		.replace(/^[^a-z]+/g, '')
		.replace(/[^0-9a-zA-Z]+$/g, '').slice(0, 30);
}
