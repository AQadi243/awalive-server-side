import { z } from "zod";



// Define Zod Schema
const MessageZodSchema = z.object({
    body: z.object({

        email: z.string().email({ message: "Invalid email address" }).max(100, "Email must be 100 characters or less"),
        message: z.string().min(1, "Message is required").max(500, "Message must be 500 characters or less"),
        senderDate: z.date().optional(), 
    })
  });

  export default MessageZodSchema