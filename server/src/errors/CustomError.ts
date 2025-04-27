export class CustomError extends Error {
	public statusCode: number;
	public name: string;

	constructor(message: string, statusCode: number, name?: string) {
		super(message);
		this.statusCode = statusCode;
		this.name = name || "Error";
	}
}
